/**
 * 服务工厂 - 统一的双实现选择逻辑
 * 根据 storageMode 自动选择本地或远程实现
 */

// ============= 工具函数 =============
export function getApiUrl(): string {
  return localStorage.getItem('apiUrl') || 'http://127.0.0.1:3000/api/v1'
}

export function getUserToken(): string {
  return localStorage.getItem('userToken') || ''
}

export function getStorageMode(): 'local' | 'cloud' {
  return (localStorage.getItem('storageMode') as 'local' | 'cloud') || 'local'
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
      return user.id || ''
    } catch (e) {
      console.error('[getUserId] Failed to parse user info:', e)
      return ''
    }
  }
  
  return ''
}

/**
 * 获取本地模式的用户 ID
 * 本地模式只有一个用户，无需登录
 * @returns 本地模式固定使用 'local-user'
 */
export function getLocalUserId(): string {
  const storageMode = getStorageMode()
  
  if (storageMode === 'local') {
    // 本地模式：使用固定的默认用户 ID
    return 'local-user'
  } else {
    // 云端模式：从登录信息获取真实用户 ID
    return getUserId() || 'guest'
  }
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
      ...(auth && token ? { 'Authorization': `Bearer ${token}` } : {}),
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
 * @param ApiImpl 远程 API 实现类
 */
export function createService<T>(
  serviceName: string,
  LocalImpl: new () => T,
  ApiImpl: new () => T
): T {
  const storageMode = getStorageMode()
  
  console.log(`[${serviceName}] Using ${storageMode} storage mode`)
  
  if (storageMode === 'cloud') {
    return new ApiImpl()
  } else {
    return new LocalImpl()
  }
}

// ============= 响应式服务工厂（支持热切换） =============
/**
 * 创建响应式服务，支持 storageMode 变化时自动切换实现
 */
export function createReactiveService<T>(
  serviceName: string,
  LocalImpl: new () => T,
  ApiImpl: new () => T
): T {
  let instance: T
  let currentMode = getStorageMode()
  
  // 初始化实例
  const updateInstance = () => {
    const mode = getStorageMode()
    if (mode !== currentMode) {
      console.log(`[${serviceName}] Switching from ${currentMode} to ${mode} mode`)
      currentMode = mode
      instance = mode === 'cloud' ? new ApiImpl() : new LocalImpl()
    }
  }
  
  // 创建初始实例
  instance = currentMode === 'cloud' ? new ApiImpl() : new LocalImpl()
  
  // 监听 storage 变化
  window.addEventListener('storage', (e) => {
    if (e.key === 'storageMode') {
      updateInstance()
    }
  })
  
  // 返回代理，每次方法调用时检查是否需要切换
  return new Proxy(instance, {
    get(target, prop) {
      updateInstance()
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

