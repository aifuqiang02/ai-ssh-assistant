import apiService, { type LoginResponse } from './api.service'

const WECHAT_LOGIN_APP_ID = 'app_mnby1nrf4abd1f24f71395b7aba6'
const WECHAT_LOGIN_BASE_URL =
  'https://open.tx07.cn/api/v1/apps/app_mnby1nrf4abd1f24f71395b7aba6/wechat-login'
const POLL_INTERVAL_MS = 2500

export interface WechatProfile {
  openId: string
  unionId?: string | null
  nickname: string
  avatarUrl?: string | null
  authorizedAt?: string
}

export interface WechatLoginSession {
  sessionId: string
  bizId: string
  status: 'pending' | 'success' | 'expired'
  qrCodeUrl?: string
  pollUrl?: string
  expiresAt?: string
  profile?: WechatProfile | null
}

interface WechatSessionResponse {
  code: number
  msg: string
  data: WechatLoginSession
}

export type LoggedInWechatUser = LoginResponse['user'] & {
  wechatProfile?: WechatProfile
}

function createBizId() {
  return `ai-ssh-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

async function requestWechatSession<T>(url: string, init?: RequestInit): Promise<T> {
  if (typeof window !== 'undefined' && window.electronAPI?.api?.wechatRequest) {
    const result = await window.electronAPI.api.wechatRequest(
      '',
      (init?.method as 'GET' | 'POST' | 'PUT' | 'DELETE') || 'GET',
      init?.body ? JSON.parse(String(init.body)) : undefined,
      (init?.headers as Record<string, string>) || undefined,
      url
    )

    if ((result as any)?.code && (result as any).code !== 200) {
      throw new Error((result as any).msg || '微信登录请求失败')
    }

    return result as T
  }

  const response = await fetch(url, init)
  const data = (await response.json()) as T

  if (!response.ok) {
    throw new Error((data as any)?.msg || `微信登录请求失败: ${response.status}`)
  }

  return data
}

function saveLoginState(payload: LoginResponse, remember = true) {
  const storage = remember ? localStorage : sessionStorage
  const otherStorage = remember ? sessionStorage : localStorage

  console.log('[wechat-login] saveLoginState start', {
    remember,
    userId: payload.user?.id,
    username: payload.user?.username,
    hasAccessToken: !!payload.accessToken,
    hasRefreshToken: !!payload.refreshToken
  })

  otherStorage.removeItem('userToken')
  otherStorage.removeItem('refreshToken')
  otherStorage.removeItem('userInfo')

  storage.setItem('userToken', payload.accessToken)
  storage.setItem('refreshToken', payload.refreshToken)
  storage.setItem('userInfo', JSON.stringify(payload.user))
  apiService.setToken(payload.accessToken)

  console.log('[wechat-login] saveLoginState done', {
    storedIn: remember ? 'localStorage' : 'sessionStorage',
    tokenPreview: payload.accessToken?.slice(0, 16),
    refreshPreview: payload.refreshToken?.slice(0, 16)
  })

  window.dispatchEvent(
    new CustomEvent('auth-state-changed', {
      detail: { user: payload.user, token: payload.accessToken }
    })
  )
}

export async function createWechatLoginSession() {
  const bizId = createBizId()
  console.log('[wechat-login] createWechatLoginSession start', { bizId })
  const response = await requestWechatSession<WechatSessionResponse>(
    `${WECHAT_LOGIN_BASE_URL}/sessions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bizId })
    }
  )

  console.log('[wechat-login] createWechatLoginSession success', response.data)
  return response.data
}

export async function pollWechatLoginSession(pollUrl: string) {
  console.log('[wechat-login] pollWechatLoginSession', { pollUrl })
  const response = await requestWechatSession<WechatSessionResponse>(pollUrl)
  console.log('[wechat-login] pollWechatLoginSession result', response.data)
  return response.data
}

export async function exchangeWechatProfileForLogin(
  bizId: string,
  profile: WechatProfile,
  remember = true
) {
  console.log('[wechat-login] exchangeWechatProfileForLogin start', {
    bizId,
    openId: profile.openId,
    nickname: profile.nickname,
    hasAvatar: !!profile.avatarUrl,
    remember
  })

  const response = await apiService.wechatLogin({
    bizId,
    appId: WECHAT_LOGIN_APP_ID,
    openId: profile.openId,
    unionId: profile.unionId || undefined,
    nickname: profile.nickname,
    avatarUrl: profile.avatarUrl || undefined
  })

  if (!response.success || !response.data) {
    console.warn('[wechat-login] exchangeWechatProfileForLogin failed', {
      bizId,
      response
    })
    throw new Error(response.message || '业务登录失败')
  }

  console.log('[wechat-login] exchangeWechatProfileForLogin success', response.data)
  saveLoginState(response.data, remember)
  return response.data
}

export function getStoredUser(): LoggedInWechatUser | null {
  const raw = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
  console.log('[wechat-login] getStoredUser raw', raw)
  if (!raw) return null

  try {
    return JSON.parse(raw) as LoggedInWechatUser
  } catch {
    return null
  }
}

export function hasStoredLogin() {
  const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
  console.log('[wechat-login] hasStoredLogin token?', !!token)
  return Boolean(token)
}

export async function logoutWechatLogin() {
  console.log('[wechat-login] logoutWechatLogin start', {
    hadLocalToken: !!localStorage.getItem('userToken'),
    hadSessionToken: !!sessionStorage.getItem('userToken'),
    hadLocalUser: !!localStorage.getItem('userInfo'),
    hadSessionUser: !!sessionStorage.getItem('userInfo')
  })

  try {
    await apiService.logout()
  } catch {
    apiService.clearToken()
  }

  apiService.clearToken()


  console.log('[wechat-login] logoutWechatLogin cleared local auth state', {
    hasLocalToken: !!localStorage.getItem('userToken'),
    hasSessionToken: !!sessionStorage.getItem('userToken'),
    hasLocalUser: !!localStorage.getItem('userInfo'),
    hasSessionUser: !!sessionStorage.getItem('userInfo')
  })

  window.dispatchEvent(
    new CustomEvent('auth-state-changed', {
      detail: { user: null, token: null }
    })
  )

  console.log('[wechat-login] logoutWechatLogin done')
}

export function startWechatLoginPolling(
  pollUrl: string,
  onTick: (session: WechatLoginSession) => void,
  onError: (error: Error) => void
) {
  let timer: number | null = null

  const run = async () => {
    try {
      const session = await pollWechatLoginSession(pollUrl)
      onTick(session)

      if (session.status === 'pending') {
        timer = window.setTimeout(run, POLL_INTERVAL_MS)
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('轮询失败'))
    }
  }

  timer = window.setTimeout(run, POLL_INTERVAL_MS)

  return () => {
    if (timer !== null) {
      window.clearTimeout(timer)
    }
  }
}
