// 统一的 AI API 调用服务

import type { AIProvider, AIModel } from '../types/ai-providers'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionRequest {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  signal?: AbortSignal
}

export interface ChatCompletionResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
}

export interface StreamChunk {
  content: string
  done: boolean
}

/**
 * OpenAI API 调用
 */
async function callOpenAI(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const endpoint = `${provider.endpoint}/chat/completions`
  
  const body = {
    model: model.id,
    messages: request.messages,
    temperature: request.temperature ?? 0.7,
    max_tokens: request.maxTokens,
    top_p: request.topP,
    frequency_penalty: request.frequencyPenalty,
    presence_penalty: request.presencePenalty,
    stream: request.stream ?? false
  }
  
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal: request.signal
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  // 流式响应
  if (request.stream && onChunk) {
    return await handleOpenAIStream(response, onChunk)
  }
  
  // 非流式响应
  const data = await response.json()
  return {
    content: data.choices[0]?.message?.content || '',
    model: data.model,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    },
    finishReason: data.choices[0]?.finish_reason
  }
}

/**
 * 处理 OpenAI 流式响应
 */
async function handleOpenAIStream(
  response: Response,
  onChunk: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  if (!reader) {
    throw new Error('Response body is not readable')
  }
  
  let fullContent = ''
  let totalTokens = 0
  let actualModel = '' // 🔍 捕获实际使用的模型
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim() !== '')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          
          if (data === '[DONE]') {
            onChunk({ content: '', done: true })
            break
          }
          
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content || ''
            
            // 捕获 model 字段（第一次出现时）
            if (parsed.model && !actualModel) {
              actualModel = parsed.model
            }
            
            if (content) {
              fullContent += content
              onChunk({ content, done: false })
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
  
  return {
    content: fullContent,
    model: actualModel,
    usage: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens
    }
  }
}

/**
 * Anthropic Claude API 调用
 */
async function callAnthropic(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const endpoint = `${provider.endpoint}/messages`
  
  // 分离系统消息和用户消息
  const systemMessage = request.messages.find(m => m.role === 'system')
  const messages = request.messages.filter(m => m.role !== 'system')
  
  const body = {
    model: model.id,
    messages: messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    })),
    system: systemMessage?.content,
    max_tokens: request.maxTokens || 4096,
    temperature: request.temperature ?? 0.7,
    top_p: request.topP,
    stream: request.stream ?? false
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'x-api-key': provider.apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  // 流式响应
  if (request.stream && onChunk) {
    return await handleAnthropicStream(response, onChunk)
  }
  
  // 非流式响应
  const data = await response.json()
  return {
    content: data.content[0]?.text || '',
    model: data.model,
    usage: {
      promptTokens: data.usage?.input_tokens || 0,
      completionTokens: data.usage?.output_tokens || 0,
      totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
    },
    finishReason: data.stop_reason
  }
}

/**
 * 处理 Anthropic 流式响应
 */
async function handleAnthropicStream(
  response: Response,
  onChunk: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  if (!reader) {
    throw new Error('Response body is not readable')
  }
  
  let fullContent = ''
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim() !== '')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          
          try {
            const parsed = JSON.parse(data)
            
            if (parsed.type === 'content_block_delta') {
              const content = parsed.delta?.text || ''
              if (content) {
                fullContent += content
                onChunk({ content, done: false })
              }
            } else if (parsed.type === 'message_stop') {
              onChunk({ content: '', done: true })
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
  
  return {
    content: fullContent,
    model: '',
    usage: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0
    }
  }
}

/**
 * Google Gemini API 调用
 */
async function callGoogle(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const modelPath = model.id.replace('models/', '')
  const endpoint = request.stream
    ? `${provider.endpoint}/${modelPath}:streamGenerateContent?key=${provider.apiKey}`
    : `${provider.endpoint}/${modelPath}:generateContent?key=${provider.apiKey}`
  
  // 转换消息格式
  const contents = request.messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  
  const systemInstruction = request.messages.find(m => m.role === 'system')
  
  const body: any = {
    contents,
    generationConfig: {
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxTokens,
      topP: request.topP
    }
  }
  
  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction.content }]
    }
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  // 流式响应
  if (request.stream && onChunk) {
    return await handleGoogleStream(response, onChunk)
  }
  
  // 非流式响应
  const data = await response.json()
  const candidate = data.candidates?.[0]
  const content = candidate?.content?.parts?.[0]?.text || ''
  
  return {
    content,
    model: model.id,
    usage: {
      promptTokens: data.usageMetadata?.promptTokenCount || 0,
      completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: data.usageMetadata?.totalTokenCount || 0
    },
    finishReason: candidate?.finishReason
  }
}

/**
 * 处理 Google 流式响应
 */
async function handleGoogleStream(
  response: Response,
  onChunk: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  if (!reader) {
    throw new Error('Response body is not readable')
  }
  
  let fullContent = ''
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim() !== '')
      
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line)
          const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''
          
          if (content) {
            fullContent += content
            onChunk({ content, done: false })
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
    
    onChunk({ content: '', done: true })
  } finally {
    reader.releaseLock()
  }
  
  return {
    content: fullContent,
    model: '',
    usage: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0
    }
  }
}

/**
 * OpenRouter API 调用（需要特殊请求头）
 */
async function callOpenRouter(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const endpoint = `${provider.endpoint}/chat/completions`
  
  const body = {
    model: model.id,
    messages: request.messages,
    temperature: request.temperature ?? 0.7,
    max_tokens: request.maxTokens,
    top_p: request.topP,
    stream: request.stream ?? false
  }
  
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json',
      // OpenRouter 特定请求头
      'HTTP-Referer': 'https://ai-ssh-assistant.app',
      'X-Title': 'AI SSH Assistant'
    },
    body: JSON.stringify(body),
    signal: request.signal
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('[OpenRouter] API 错误:', error)
    throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  // 流式响应
  if (request.stream && onChunk) {
    return await handleOpenAIStream(response, onChunk)
  }
  
  // 非流式响应
  const data = await response.json()
  return {
    content: data.choices[0]?.message?.content || '',
    model: data.model,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    },
    finishReason: data.choices[0]?.finish_reason
  }
}

/**
 * 通用 OpenAI 兼容 API 调用（用于通义千问、DeepSeek、Moonshot 等）
 */
async function callGenericOpenAI(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  return callOpenAI(provider, model, request, onChunk)
}

/**
 * Ollama 本地 API 调用
 */
async function callOllama(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const endpoint = `${provider.endpoint}/api/chat`
  
  const body = {
    model: model.id,
    messages: request.messages.map(m => ({
      role: m.role,
      content: m.content
    })),
    stream: request.stream ?? false,
    options: {
      temperature: request.temperature ?? 0.7,
      num_predict: request.maxTokens,
      top_p: request.topP
    }
  }
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  // 流式响应
  if (request.stream && onChunk) {
    return await handleOllamaStream(response, onChunk)
  }
  
  // 非流式响应
  const data = await response.json()
  return {
    content: data.message?.content || '',
    model: data.model,
    usage: {
      promptTokens: data.prompt_eval_count || 0,
      completionTokens: data.eval_count || 0,
      totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
    },
    finishReason: data.done ? 'stop' : undefined
  }
}

/**
 * 处理 Ollama 流式响应
 */
async function handleOllamaStream(
  response: Response,
  onChunk: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  if (!reader) {
    throw new Error('Response body is not readable')
  }
  
  let fullContent = ''
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.trim() !== '')
      
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line)
          const content = parsed.message?.content || ''
          
          if (content) {
            fullContent += content
            onChunk({ content, done: false })
          }
          
          if (parsed.done) {
            onChunk({ content: '', done: true })
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
  
  return {
    content: fullContent,
    model: '',
    usage: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0
    }
  }
}

/**
 * 统一的聊天完成接口
 */
export async function chatCompletion(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  // 根据服务商选择对应的 API 调用方法
  switch (provider.id) {
    case 'openai':
      return await callOpenAI(provider, model, request, onChunk)
    
    case 'anthropic':
      return await callAnthropic(provider, model, request, onChunk)
    
    case 'google':
      return await callGoogle(provider, model, request, onChunk)
    
    case 'ollama':
      return await callOllama(provider, model, request, onChunk)
    
    // OpenRouter 聚合平台（支持多个模型）
    case 'openrouter':
      return await callOpenRouter(provider, model, request, onChunk)
    
    // 其他使用 OpenAI 兼容接口的服务商
    case 'qwen':
    case 'deepseek':
    case 'moonshot':
    default:
      return await callGenericOpenAI(provider, model, request, onChunk)
  }
}

/**
 * 计算消息的 token 数量（粗略估算）
 */
export function estimateTokens(text: string): number {
  // 简单估算：中文按字符数，英文按单词数 * 1.3
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = text.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(w => w.length > 0).length
  
  return Math.ceil(chineseChars + englishWords * 1.3)
}

/**
 * 估算请求的总 token 数
 */
export function estimateRequestTokens(messages: ChatMessage[]): number {
  return messages.reduce((total, msg) => total + estimateTokens(msg.content), 0)
}

