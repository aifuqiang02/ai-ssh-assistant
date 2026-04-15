/**
 * AI 服务提供商和模型类型定义
 */

// AI 能力定义
export interface AICapabilities {
  text: boolean
  image: boolean
  functionCall: boolean
  vision: boolean
}

// 模型价格信息
export interface ModelPricing {
  inputCostPer1KTokens?: number
  outputCostPer1KTokens?: number
  currency?: string
}

// AI 模型定义
export interface AIModel {
  id: string
  name: string
  description?: string
  providerId: string
  contextWindow: number
  capabilities: AICapabilities
  price?: ModelPricing
  recommended?: boolean
  enabled?: boolean
  model: string // 模型标识符
}

// AI 提供商配置
export interface AIProviderConfig {
  id: string
  name: string
  apiKey: string
  enabled: boolean
  models: ModelConfig[]
  description: string
  icon: string
  website: string
  endpoint: string
  isDefault: boolean
  config?: Record<string, any>
}

// 模型配置 (扩展 AIModel 的所有属性)
export interface ModelConfig extends AIModel {
  // 额外的配置属性
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

// AI 提供商定义 (基础信息)
export interface AIProvider {
  id: string
  name: string
  description: string
  icon: string
  website: string
  apiKey: string
  endpoint: string
  enabled: boolean
  isDefault: boolean
  models: AIModel[]
  config?: Record<string, any>
}

// AI 服务响应
export interface AIResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  metadata?: Record<string, any>
}

// AI 聊天选项
export interface AIChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  systemPrompt?: string
}
