// AI 服务商类型定义

export interface AIProvider {
  id: string
  name: string
  description: string
  icon: string
  website: string
  
  // 配置
  apiKey: string
  endpoint: string
  enabled: boolean
  isDefault: boolean
  
  // 支持的模型
  models: AIModel[]
  
  // 额外配置
  config?: Record<string, any>
}

export interface AIModel {
  id: string
  name: string
  description?: string
  providerId: string
  contextWindow: number
  
  capabilities: {
    text: boolean
    image: boolean
    functionCall: boolean
    vision: boolean
  }
  
  price?: {
    input: number   // USD per 1M tokens
    output: number  // USD per 1M tokens
  }
  
  recommended?: boolean
  enabled?: boolean  // 是否启用该模型（默认启用）
}

// 省略 apiKey, enabled, isDefault 的类型
export type ProviderConfig = Omit<AIProvider, 'apiKey' | 'enabled' | 'isDefault'>

