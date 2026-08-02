import { getRendererApiOrigin } from '@/config/api-environment'

/**
 * API服务 - 处理与后端的HTTP通信
 */

// API基础配置
const API_BASE_URL = getRendererApiOrigin()
const API_PREFIX = '/api/v1'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  code?: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: {
    id: string
    uuid: string
    username: string | null
    email: string | null
    avatar: string | null
    wechatProfile?: {
      bizId?: string
      appId?: string
      openId: string
      unionId?: string
      nickname: string
      avatarUrl?: string
    }
    role: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface RegisterResponse {
  user: {
    id: string
    uuid: string
    username: string | null
    email: string | null
    avatar: string | null
    role: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
}

export interface WechatLoginExchangeRequest {
  bizId: string
  appId: string
  openId: string
  unionId?: string
  nickname: string
  avatarUrl?: string
}

export interface OfficialModelStatus {
  enabled: boolean
  models: Array<{
    id: string
    name: string
    shortName: string
    description?: string
    enabled: boolean
  }>
}

export interface OfficialChatRequest {
  modelId: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  stream?: boolean
  temperature?: number
  maxTokens?: number
}

export interface OfficialChatResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

class ApiService {
  private baseUrl: string
  private token: string | null = null
  private isElectron: boolean = false

  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_PREFIX}`
    this.isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined
    this.loadToken()
  }

  /**
   * 从本地存储加载token
   */
  private loadToken(): void {
    this.token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
    console.log('[api] loadToken', {
      hasToken: !!this.token,
      tokenPreview: this.token?.slice(0, 16),
      baseUrl: this.baseUrl
    })
  }

  /**
   * 设置认证token
   */
  setToken(token: string): void {
    this.token = token
    console.log('[api] setToken', {
      hasToken: !!token,
      tokenPreview: token?.slice(0, 16),
      baseUrl: this.baseUrl
    })
  }

  /**
   * 清除认证token
   */
  clearToken(): void {
    console.log('[api] clearToken start', {
      hadToken: !!this.token,
      tokenPreview: this.token?.slice(0, 16)
    })
    this.token = null
    localStorage.removeItem('userToken')
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('userToken')
    sessionStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    sessionStorage.removeItem('userInfo')
    console.log('[api] clearToken done')
  }

  /**
   * 通用HTTP请求方法
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json'
    }

    // 添加认证头
    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    try {
      console.log('[api] request start', {
        endpoint,
        url,
        method: config.method || 'GET',
        hasToken: !!this.token,
        tokenPreview: this.token?.slice(0, 16)
      })

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        console.warn('[api] request failed response', {
          endpoint,
          url,
          status: response.status,
          code: data.code,
          message: data.message,
          hasToken: !!this.token,
          tokenPreview: this.token?.slice(0, 16)
        })
        const error = new Error(
          data.message || `HTTP error! status: ${response.status}`
        ) as Error & {
          code?: string
          status?: number
        }
        error.code = data.code
        error.status = response.status
        throw error
      }

      console.log('[api] request success', {
        endpoint,
        url,
        status: response.status,
        hasToken: !!this.token,
        tokenPreview: this.token?.slice(0, 16)
      })

      return data
    } catch (error) {
      console.error('[api] request exception', {
        endpoint,
        url,
        hasToken: !!this.token,
        tokenPreview: this.token?.slice(0, 16),
        error
      })
      throw error
    }
  }

  /**
   * GET请求
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /**
   * POST请求
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * PUT请求
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * DELETE请求
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // ==================== 认证相关API ====================

  /**
   * 用户登录
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (this.isElectron && window.electronAPI) {
      return window.electronAPI.api.auth.login(credentials)
    }
    return this.post<LoginResponse>('/auth/login', credentials)
  }

  /**
   * 用户注册
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    if (this.isElectron && window.electronAPI) {
      return window.electronAPI.api.auth.register(userData)
    }
    return this.post<RegisterResponse>('/auth/register', userData)
  }

  async wechatLogin(payload: WechatLoginExchangeRequest): Promise<ApiResponse<LoginResponse>> {
    if (this.isElectron && window.electronAPI) {
      return window.electronAPI.api.auth.wechatLogin(payload)
    }
    return this.post<LoginResponse>('/auth/wechat-login', payload)
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse> {
    const result =
      this.isElectron && window.electronAPI
        ? await window.electronAPI.api.auth.logout(this.token || undefined)
        : await this.post('/auth/logout')
    this.clearToken()
    return result
  }

  /**
   * 刷新token
   */
  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    return this.post('/auth/refresh', { refreshToken })
  }

  /**
   * 验证token
   */
  async verifyToken(): Promise<ApiResponse<{ user: any }>> {
    if (this.isElectron && window.electronAPI && this.token) {
      return window.electronAPI.api.auth.verify(this.token)
    }
    return this.get('/auth/verify')
  }

  async getOfficialModelStatus(): Promise<ApiResponse<OfficialModelStatus>> {
    return this.get('/ai/official/status')
  }

  async createOfficialChat(
    payload: OfficialChatRequest
  ): Promise<ApiResponse<OfficialChatResponse>> {
    return this.post('/ai/official/chat', payload)
  }
}

// 导出单例实例
export const apiService = new ApiService()
export default apiService
