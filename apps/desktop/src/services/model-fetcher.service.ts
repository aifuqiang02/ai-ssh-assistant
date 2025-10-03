/**
 * 模型列表获取服务
 * 负责从各个 AI 服务商的 API 获取可用的模型列表
 */

import type { AIModel } from '../types/ai-providers.types'

interface ModelFetchResult {
  success: boolean
  models?: AIModel[]
  error?: string
}

/**
 * OpenAI 模型列表获取
 */
export async function fetchOpenAIModels(
  apiKey: string,
  endpoint: string = 'https://api.openai.com/v1'
): Promise<ModelFetchResult> {
  try {
    const response = await fetch(`${endpoint}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // 转换为我们的 AIModel 格式
    const models: AIModel[] = data.data
      .filter((model: any) => {
        // 只保留 GPT 和 O1 模型
        return model.id.includes('gpt') || model.id.includes('o1') || model.id.includes('dall-e')
      })
      .map((model: any) => ({
        id: model.id,
        name: formatModelName(model.id),  // 格式化显示名称
        description: model.description,
        providerId: 'openai',
        contextWindow: getContextWindow(model.id),
        capabilities: getCapabilities(model.id),
        price: getPricing(model.id),
        recommended: model.id === 'gpt-4o' || model.id === 'gpt-4o-mini',  // 推荐模型
      }))

    return {
      success: true,
      models,
    }
  } catch (error) {
    console.error('Failed to fetch OpenAI models:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Anthropic 模型列表
 * Anthropic 没有提供 list models API，使用固定列表
 */
export async function fetchAnthropicModels(): Promise<ModelFetchResult> {
  const models: AIModel[] = [
    {
      id: 'claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      providerId: 'anthropic',
      contextWindow: 200000,
      capabilities: { text: true, image: false, vision: true, functionCall: true },
      recommended: true,
    },
    {
      id: 'claude-3-5-haiku-20241022',
      name: 'Claude 3.5 Haiku',
      providerId: 'anthropic',
      contextWindow: 200000,
      capabilities: { text: true, image: false, vision: true, functionCall: true },
    },
    {
      id: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      providerId: 'anthropic',
      contextWindow: 200000,
      capabilities: { text: true, image: false, vision: true, functionCall: true },
    },
  ]

  return {
    success: true,
    models,
  }
}

/**
 * Google AI 模型列表获取
 */
export async function fetchGoogleModels(
  apiKey: string,
  endpoint: string = 'https://generativelanguage.googleapis.com/v1beta'
): Promise<ModelFetchResult> {
  try {
    const response = await fetch(`${endpoint}/models?key=${apiKey}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    const models: AIModel[] = data.models
      .filter((model: any) => {
        // 只保留生成模型
        return model.supportedGenerationMethods?.includes('generateContent')
      })
      .map((model: any) => ({
        id: model.name.replace('models/', ''),
        name: model.displayName || model.name,
        description: model.description,
        providerId: 'google',
        contextWindow: model.inputTokenLimit || 32000,
        capabilities: {
          text: true,
          image: false,
          vision: model.name.includes('vision'),
          functionCall: model.name.includes('pro'),
        },
      }))

    return {
      success: true,
      models,
    }
  } catch (error) {
    console.error('Failed to fetch Google models:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * DeepSeek 模型列表
 */
export async function fetchDeepSeekModels(
  apiKey: string,
  endpoint: string = 'https://api.deepseek.com/v1'
): Promise<ModelFetchResult> {
  try {
    const response = await fetch(`${endpoint}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    const models: AIModel[] = data.data.map((model: any) => ({
      id: model.id,
      name: model.id,
      providerId: 'deepseek',
      contextWindow: 64000,
      capabilities: {
        text: true,
        image: false,
        vision: false,
        functionCall: model.id.includes('chat'),
      },
    }))

    return {
      success: true,
      models,
    }
  } catch (error) {
    console.error('Failed to fetch DeepSeek models:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 通用的 OpenAI 兼容 API 模型列表获取
 * 适用于所有兼容 OpenAI API 格式的服务商
 */
export async function fetchOpenAICompatibleModels(
  providerId: string,
  apiKey: string,
  endpoint: string
): Promise<ModelFetchResult> {
  try {
    const response = await fetch(`${endpoint}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    const models: AIModel[] = data.data.map((model: any) => {
      const modelId = model.id.toLowerCase()
      
      // 尝试从 API 响应中获取上下文窗口
      let contextWindow = model.context_window || model.context_length || model.max_tokens
      
      // 如果 API 没有提供，从模型 ID 智能判断
      if (!contextWindow) {
        if (modelId.includes('128k')) contextWindow = 128000
        else if (modelId.includes('64k')) contextWindow = 64000
        else if (modelId.includes('32k')) contextWindow = 32000
        else if (modelId.includes('16k')) contextWindow = 16384
        else if (modelId.includes('8k')) contextWindow = 8192
        else if (modelId.includes('4k')) contextWindow = 4096
        else contextWindow = 8000 // 默认值
      }
      
      // 尝试从 API 响应中获取价格信息
      let price: AIModel['price'] | undefined
      if (model.pricing) {
        // 不同服务商的价格字段格式可能不同
        const inputPrice = model.pricing.prompt || model.pricing.input || model.pricing.input_cost_per_token
        const outputPrice = model.pricing.completion || model.pricing.output || model.pricing.output_cost_per_token
        
        if (inputPrice && outputPrice) {
          // 如果价格是字符串，转换为数字；如果已经是每百万 token 的价格则直接使用
          const parsePrice = (p: any) => {
            const num = typeof p === 'string' ? parseFloat(p) : p
            // 如果价格小于 0.01，可能是每 token 的价格，需要乘以 1000000
            return num < 0.01 ? num * 1000000 : num
          }
          
          price = {
            input: parsePrice(inputPrice),
            output: parsePrice(outputPrice),
          }
        }
      }
      
      // 智能判断能力
      const capabilities = {
        text: true,
        image: modelId.includes('dall-e') || modelId.includes('image') || modelId.includes('sd') || model.modality?.includes('image'),
        vision: modelId.includes('vision') || modelId.includes('gpt-4o') || modelId.includes('claude-3') || model.modality?.includes('multimodal'),
        functionCall: modelId.includes('gpt') || modelId.includes('claude') || modelId.includes('function') || model.function_calling === true,
      }
      
      return {
        id: model.id,
        name: model.name || model.id,
        description: model.description,
        providerId,
        contextWindow,
        capabilities,
        price,
      }
    })

    return {
      success: true,
      models,
    }
  } catch (error) {
    console.error(`Failed to fetch ${providerId} models:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * OpenRouter 模型列表获取（专门处理 OpenRouter 的详细数据）
 */
export async function fetchOpenRouterModels(
  apiKey: string,
  endpoint: string = 'https://openrouter.ai/api/v1'
): Promise<ModelFetchResult> {
  try {
    const response = await fetch(`${endpoint}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // 调试：打印第一个模型的完整数据结构
    if (data.data && data.data.length > 0) {
      console.log('OpenRouter 模型示例数据:', JSON.stringify(data.data[0], null, 2))
    }
    
    const models: AIModel[] = data.data.map((model: any) => {
      // 提取价格信息（OpenRouter 返回的价格是字符串，单位是每 token）
      let price: AIModel['price'] | undefined
      if (model.pricing) {
        price = {
          input: parseFloat(model.pricing.prompt) * 1000000, // 转换为每百万 token 的美元价格
          output: parseFloat(model.pricing.completion) * 1000000,
        }
      }
      
      // 从 architecture 中提取能力信息
      const modality = model.architecture?.modality || 'text'
      const isMultimodal = modality.includes('text+image') || modality.includes('multimodal')
      
      return {
        id: model.id,
        name: model.name || model.id,
        description: model.description,
        providerId: 'openrouter',
        contextWindow: model.context_length || model.top_provider?.context_length || 4096,
        capabilities: {
          text: true,
          image: modality.includes('image'),
          vision: isMultimodal,
          functionCall: model.architecture?.instruct_type === 'function' || model.id.includes('gpt') || model.id.includes('claude'),
        },
        price,
      }
    })

    return {
      success: true,
      models,
    }
  } catch (error) {
    console.error('Failed to fetch OpenRouter models:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * 根据服务商 ID 获取模型列表
 */
export async function fetchModelsForProvider(
  providerId: string,
  apiKey: string,
  endpoint?: string
): Promise<ModelFetchResult> {
  switch (providerId) {
    case 'openai':
      return fetchOpenAIModels(apiKey, endpoint)
    
    case 'anthropic':
      return fetchAnthropicModels()
    
    case 'google':
      return fetchGoogleModels(apiKey, endpoint)
    
    case 'deepseek':
      return fetchDeepSeekModels(apiKey, endpoint)
    
    case 'openrouter':
      return fetchOpenRouterModels(apiKey, endpoint)
    
    // 兼容 OpenAI API 的服务商
    case 'together':
    case 'groq':
    case 'moonshot':
    case 'zhipu':
    case 'minimax':
    case 'baichuan':
      if (endpoint) {
        return fetchOpenAICompatibleModels(providerId, apiKey, endpoint)
      }
      return {
        success: false,
        error: 'Endpoint is required for this provider',
      }
    
    default:
      return {
        success: false,
        error: `Provider ${providerId} not supported`,
      }
  }
}

// 辅助函数：格式化模型名称
function formatModelName(modelId: string): string {
  // 特殊模型名称映射
  const nameMap: Record<string, string> = {
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o mini',
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-4-turbo-preview': 'GPT-4 Turbo Preview',
    'gpt-4': 'GPT-4',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'gpt-3.5-turbo-16k': 'GPT-3.5 Turbo 16k',
    'o1-preview': 'O1 Preview',
    'o1-mini': 'O1 Mini',
  }
  
  // 检查是否有直接映射
  if (nameMap[modelId]) {
    return nameMap[modelId]
  }
  
  // 自动格式化：将 gpt-4-0125-preview 转换为 GPT-4 (0125 Preview)
  const formatted = modelId
    .replace(/^gpt-(\d+)\.?(\d*)/i, 'GPT-$1.$2')
    .replace(/^o1-/i, 'O1 ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
  
  return formatted || modelId
}

// 辅助函数：根据模型 ID 获取上下文窗口大小
function getContextWindow(modelId: string): number {
  if (modelId.includes('gpt-4o')) return 128000
  if (modelId.includes('gpt-4-turbo')) return 128000
  if (modelId.includes('gpt-4')) return 8192
  if (modelId.includes('gpt-3.5-turbo-16k')) return 16384
  if (modelId.includes('gpt-3.5-turbo')) return 4096
  if (modelId.includes('o1')) return 128000
  return 4096
}

// 辅助函数：根据模型 ID 获取能力
function getCapabilities(modelId: string): AIModel['capabilities'] {
  return {
    text: true,
    image: modelId.includes('dall-e'),
    vision: modelId.includes('vision') || modelId.includes('gpt-4o') || modelId.includes('gpt-4-turbo'),
    functionCall: modelId.includes('gpt-4') || modelId.includes('gpt-3.5') || modelId.includes('o1'),
  }
}

// 辅助函数：根据模型 ID 获取价格
function getPricing(modelId: string): AIModel['price'] | undefined {
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 2.5, output: 10 },
    'gpt-4o-mini': { input: 0.15, output: 0.6 },
    'gpt-4-turbo': { input: 10, output: 30 },
    'gpt-4': { input: 30, output: 60 },
    'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  }

  for (const [key, value] of Object.entries(pricing)) {
    if (modelId.includes(key)) {
      return value
    }
  }

  return undefined
}

