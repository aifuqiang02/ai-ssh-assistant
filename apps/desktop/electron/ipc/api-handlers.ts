import { ipcMain } from 'electron'
import fetch from 'node-fetch'

const API_BASE_URL = 'http://127.0.0.1:3000/api/v1'

interface ApiRequest {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  headers?: Record<string, string>
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  code?: string
}

// 通用API请求处理器
ipcMain.handle('api:request', async (event, request: ApiRequest): Promise<ApiResponse> => {
  const { endpoint, method, data, headers = {} } = request
  const url = `${API_BASE_URL}${endpoint}`

  try {
    console.log(`[API] ${method} ${url}`)
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const response = await fetch(url, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    const responseData = await response.json() as ApiResponse
    
    console.log(`[API] Response ${response.status}:`, responseData)

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`)
    }

    return responseData
  } catch (error) {
    console.error('[API] Request failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'API_ERROR'
    }
  }
})

// 认证相关API处理器
ipcMain.handle('api:auth:login', async (event, credentials: { email: string; password: string; rememberMe?: boolean }) => {
  const url = `${API_BASE_URL}/auth/login`
  
  try {
    console.log(`[API] POST ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json() as ApiResponse
    console.log(`[API] Login response ${response.status}:`, data)

    return data
  } catch (error) {
    console.error('[API] Login failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
      code: 'LOGIN_ERROR'
    }
  }
})

ipcMain.handle('api:auth:register', async (event, userData: { email: string; username: string; password: string }) => {
  const url = `${API_BASE_URL}/auth/register`
  
  try {
    console.log(`[API] POST ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    const data = await response.json() as ApiResponse
    console.log(`[API] Register response ${response.status}:`, data)

    return data
  } catch (error) {
    console.error('[API] Register failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Register failed',
      code: 'REGISTER_ERROR'
    }
  }
})

ipcMain.handle('api:auth:logout', async (event, token?: string) => {
  const url = `${API_BASE_URL}/auth/logout`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    console.log(`[API] POST ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
    })

    const data = await response.json() as ApiResponse
    console.log(`[API] Logout response ${response.status}:`, data)

    return data
  } catch (error) {
    console.error('[API] Logout failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Logout failed',
      code: 'LOGOUT_ERROR'
    }
  }
})

ipcMain.handle('api:auth:refresh', async (event, refreshToken: string) => {
  const url = `${API_BASE_URL}/auth/refresh`
  
  try {
    console.log(`[API] POST ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await response.json() as ApiResponse
    console.log(`[API] Refresh response ${response.status}:`, data)

    return data
  } catch (error) {
    console.error('[API] Refresh failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Token refresh failed',
      code: 'REFRESH_ERROR'
    }
  }
})

ipcMain.handle('api:auth:verify', async (event, token: string) => {
  const url = `${API_BASE_URL}/auth/verify`
  
  try {
    console.log(`[API] GET ${url}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })

    const data = await response.json() as ApiResponse
    console.log(`[API] Verify response ${response.status}:`, data)

    return data
  } catch (error) {
    console.error('[API] Verify failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Token verification failed',
      code: 'VERIFY_ERROR'
    }
  }
})

console.log('[IPC] API handlers registered')
