/**
 * 服务工厂 - 统一的本地实现选择逻辑
 */

import { getRendererApiBaseUrl } from '@/config/api-environment'

// ============= 工具函数 =============
export function getApiUrl(): string {
  return localStorage.getItem('apiUrl') || getRendererApiBaseUrl()
}

export function getUserToken(): string {
  return localStorage.getItem('userToken') || ''
}

export function getStorageMode(): 'local' {
  return 'local'
}

export function getUserId(): string {
  // 优先从 localStorage 获取（记住我）
  let userStr = localStorage.getItem('userInfo')

  // 如果没有，尝试从 sessionStorage 获取（不记住我）
  if (!userStr) {
    userStr = sessionStorage.getItem('userInfo')
  }

  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      const userId = user.id || ''
      console.log('getUserId: found user info:', { userId, user })
      return userId
    } catch (e) {
      console.log('getUserId: failed to parse user info:', e)
      return ''
    }
  }

  console.log('getUserId: no user info found')
  return ''
}

/**
 * 获取本地模式的用户 ID
 * 本地模式只有一个用户，无需登录
 * @returns 本地模式固定使用 'local-user'
 */
export function getLocalUserId(): string {
  return 'local-user'
}

// ============= HTTP 请求封装 =============
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  // 是否需要认证（默认 true）
  auth?: boolean
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = true } = options

  const url = `${getApiUrl()}${endpoint}`
  const token = getUserToken()

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      // ✅ 自动添加 Authorization header，后端从 token 解析 userId
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  // 对于 DELETE 等没有响应体的请求
  if (response.status === 204) {
    return undefined as T
  }

  const result = await response.json()

  // ✅ 自动提取后端统一响应格式中的 data 字段
  // 后端格式: { success: true, data: ... }
  // 注意：某些接口（如 settings）使用不同的字段名，需要在具体 service 中处理
  if (result && typeof result === 'object' && 'data' in result && result.success === true) {
    return result.data as T
  }

  return result as T
}

// ============= 服务工厂 =============
/**
 * 创建服务实例
 * @param serviceName 服务名称，用于日志
 * @param LocalImpl 本地实现类
 * @param _ApiImpl 保留签名兼容旧调用，已不再使用
 */
export function createService<T>(
  serviceName: string,
  LocalImpl: new () => T,
  _ApiImpl: new () => T
): T {
  console.log(`[${serviceName}] 使用本地实现`)
  return new LocalImpl()
}

// ============= 响应式服务工厂（支持热切换） =============
/**
 * 创建响应式服务，统一固定为本地实现
 */
export function createReactiveService<T extends object>(
  _serviceName: string,
  LocalImpl: new () => T,
  _ApiImpl: new () => T
): T {
  const instance = new LocalImpl()

  return new Proxy(instance, {
    get(_target, prop) {
      const value = instance[prop as keyof T]
      if (typeof value === 'function') {
        return (...args: any[]) => {
          return (value as any).apply(instance, args)
        }
      }
      return value
    }
  })
}
