// 共享类型定义

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface SSHConnectionConfig {
  id?: string
  name: string
  host: string
  port: number
  username: string
  authType: 'password' | 'privateKey' | 'agent'
  password?: string
  privateKey?: string
  passphrase?: string
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tokens?: number
  model?: string
}

export interface CommandResult {
  command: string
  output: string
  error?: string
  exitCode: number
  duration: number
  timestamp: Date
  success: boolean
}

// Export SSH types
export * from './ssh.types.js'

// Export Chat types
export * from './chat.types.js'