/**
 * API服务 - 处理与后端的HTTP通信
 */

// API基础配置
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:3000'
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
  }

  /**
   * 设置认证token
   */
  setToken(token: string): void {
    this.token = token
  }

  /**
   * 清除认证token
   */
  clearToken(): void {
    this.token = null
    localStorage.removeItem('userToken')
    sessionStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
    sessionStorage.removeItem('userInfo')
  }

  /**
   * 通用HTTP请求方法
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // 添加认证头
    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`)
      
      const response = await fetch(url, config)
      const data = await response.json()

      console.log(`API Response: ${response.status}`, data)

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
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
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT请求
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
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
      console.log('🔐 Using Electron IPC for login')
      return window.electronAPI.api.auth.login(credentials)
    }
    return this.post<LoginResponse>('/auth/login', credentials)
  }

  /**
   * 用户注册
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    if (this.isElectron && window.electronAPI) {
      console.log('📝 Using Electron IPC for register')
      return window.electronAPI.api.auth.register(userData)
    }
    return this.post<RegisterResponse>('/auth/register', userData)
  }

  /**
   * 用户登出
   */
  async logout(): Promise<ApiResponse> {
    const result = await this.post('/auth/logout')
    this.clearToken()
    return result
  }

  /**
   * 刷新token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    return this.post('/auth/refresh', { refreshToken })
  }

  /**
   * 验证token
   */
  async verifyToken(): Promise<ApiResponse<{ user: any }>> {
    return this.get('/auth/verify')
  }

  // ==================== 用户相关API ====================

  /**
   * 获取用户信息
   */
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.get('/user/profile')
  }

  /**
   * 更新用户信息
   */
  async updateUserProfile(userData: any): Promise<ApiResponse<any>> {
    return this.put('/user/profile', userData)
  }

  // ==================== SSH连接相关API ====================

  /**
   * 获取SSH树形结构
   */
  async getSSHTree(): Promise<ApiResponse<any[]>> {
    return this.get('/ssh/tree')
  }

  /**
   * 创建SSH文件夹
   */
  async createSSHFolder(folderData: any): Promise<ApiResponse<any>> {
    return this.post('/ssh/folders', folderData)
  }

  /**
   * 更新SSH文件夹
   */
  async updateSSHFolder(id: string, folderData: any): Promise<ApiResponse<any>> {
    return this.put(`/ssh/folders/${id}`, folderData)
  }

  /**
   * 删除SSH文件夹
   */
  async deleteSSHFolder(id: string): Promise<ApiResponse> {
    return this.delete(`/ssh/folders/${id}`)
  }

  /**
   * 获取SSH连接列表
   */
  async getSSHConnections(): Promise<ApiResponse<any[]>> {
    return this.get('/ssh/connections')
  }

  /**
   * 创建SSH连接
   */
  async createSSHConnection(connectionData: any): Promise<ApiResponse<any>> {
    return this.post('/ssh/connections', connectionData)
  }

  /**
   * 更新SSH连接
   */
  async updateSSHConnection(id: string, connectionData: any): Promise<ApiResponse<any>> {
    return this.put(`/ssh/connections/${id}`, connectionData)
  }

  /**
   * 删除SSH连接
   */
  async deleteSSHConnection(id: string): Promise<ApiResponse> {
    return this.delete(`/ssh/connections/${id}`)
  }

  /**
   * 移动节点（文件夹或连接）
   */
  async moveSSHNode(moveData: any): Promise<ApiResponse> {
    return this.post('/ssh/move', moveData)
  }

  /**
   * 测试SSH连接
   */
  async testSSHConnection(id: string): Promise<ApiResponse<{ status: string }>> {
    return this.post(`/ssh/connections/${id}/test`)
  }

  // ==================== 聊天相关API ====================

  /**
   * 获取聊天树形结构
   */
  async getChatTree(): Promise<ApiResponse<any[]>> {
    return this.get('/chat/tree')
  }

  /**
   * 创建聊天文件夹
   */
  async createChatFolder(folderData: any): Promise<ApiResponse<any>> {
    return this.post('/chat/folders', folderData)
  }

  /**
   * 更新聊天文件夹
   */
  async updateChatFolder(id: string, folderData: any): Promise<ApiResponse<any>> {
    return this.put(`/chat/folders/${id}`, folderData)
  }

  /**
   * 删除聊天文件夹
   */
  async deleteChatFolder(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/chat/folders/${id}`)
  }

  /**
   * 获取聊天会话列表
   */
  async getChatSessions(): Promise<ApiResponse<any[]>> {
    return this.get('/chat/sessions')
  }

  /**
   * 创建聊天会话
   */
  async createChatSession(sessionData: any): Promise<ApiResponse<any>> {
    return this.post('/chat/sessions', sessionData)
  }

  /**
   * 更新聊天会话
   */
  async updateChatSession(id: string, sessionData: any): Promise<ApiResponse<any>> {
    return this.put(`/chat/sessions/${id}`, sessionData)
  }

  /**
   * 删除聊天会话
   */
  async deleteChatSession(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/chat/sessions/${id}`)
  }

  /**
   * 移动聊天节点
   */
  async moveChatNode(moveData: any): Promise<ApiResponse<any>> {
    return this.post('/chat/move', moveData)
  }

  /**
   * 发送消息
   */
  async sendMessage(sessionId: string, message: any): Promise<ApiResponse<any>> {
    return this.post(`/chat/sessions/${sessionId}/messages`, message)
  }

  /**
   * 获取会话消息
   */
  async getSessionMessages(sessionId: string): Promise<ApiResponse<any[]>> {
    return this.get(`/chat/sessions/${sessionId}/messages`)
  }

  // ==================== 系统相关API ====================

  /**
   * 获取系统状态
   */
  async getSystemStatus(): Promise<ApiResponse<any>> {
    return this.get('/system/status')
  }

  /**
   * 获取系统配置
   */
  async getSystemConfig(): Promise<ApiResponse<any>> {
    return this.get('/system/config')
  }
}

// 导出单例实例
export const apiService = new ApiService()
export default apiService
