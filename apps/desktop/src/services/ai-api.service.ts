// 统一的 AI API 调用服务

import apiService from './api.service'
import { getRendererApiOrigin } from '@/config/api-environment'
import type { AIProvider, AIModel } from '../types/ai-providers'
import type { MessageMetadata } from '../types/message-metadata'

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
  tools?: object[]
  toolChoice?: string | object
}

/**
 * Agent 模式配置
 * 参考 OpenCode 项目设计，不同模式使用不同参数
 *
 * 温度说明:
 * - 0.0-0.3: 确定性输出，适合分析和计划
 * - 0.3-0.7: 平衡模式，适合一般任务
 * - 0.7-1.0: 创造性输出，适合创意写作
 */
export type AgentMode = 'plan' | 'build'

export interface AgentConfig {
  mode: AgentMode
  temperature: number // 温度控制随机性
  maxTokens: number // 最大输出 token 数
  maxSteps?: number // 最大推理步骤数
}

/**
 * 默认 Agent 模式配置
 *
 * plan 模式 (只读分析):
 * - temperature: 0.1 - 低温确保准确性，避免幻觉
 * - maxSteps: 10 - 限制推理步骤，防止过度思考
 *
 * build 模式 (执行任务):
 * - temperature: 0.3 - 适中温度，保持准确性同时允许灵活响应
 * - maxSteps: 20 - 允许更复杂的任务执行
 */
export const AGENT_MODE_CONFIGS: Record<AgentMode, AgentConfig> = {
  plan: {
    mode: 'plan',
    temperature: 0.1, // 低温，减少随机性，提高准确性
    maxTokens: 4096, // 限制输出长度
    maxSteps: 10 // 限制推理步骤
  },
  build: {
    mode: 'build',
    temperature: 0.3, // 适中温度，平衡创造性和准确性
    maxTokens: 8192, // 允许更长输出
    maxSteps: 20 // 允许更多步骤
  }
}

/**
 * 根据模式获取默认配置
 */
export function getAgentConfig(mode: AgentMode = 'build'): AgentConfig {
  return AGENT_MODE_CONFIGS[mode]
}

/**
 * 合并自定义配置与默认配置
 */
export function mergeAgentConfig(mode: AgentMode, custom?: Partial<AgentConfig>): AgentConfig {
  const defaults = AGENT_MODE_CONFIGS[mode]

  if (!custom) {
    return defaults
  }

  return {
    mode: custom.mode ?? defaults.mode,
    temperature: custom.temperature ?? defaults.temperature,
    maxTokens: custom.maxTokens ?? defaults.maxTokens,
    maxSteps: custom.maxSteps ?? defaults.maxSteps
  }
}

export interface ChatCompletionResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  metadata?: MessageMetadata | null // 详细的统计信息
  finishReason?: string
}

export interface StreamChunk {
  content: string
  done: boolean
  metadata?: MessageMetadata | null // 添加 metadata 支持
}

function getRuntimeProviderId(provider: AIProvider): string {
  return provider.config?.runtimeProviderId || provider.id
}

async function callOfficialManagedModel(
  provider: AIProvider,
  model: AIModel,
  request: ChatCompletionRequest,
  onChunk?: (chunk: StreamChunk) => void
): Promise<ChatCompletionResponse> {
  const buildOfficialError = (message: string, code?: string) => {
    const error = new Error(message) as Error & { code?: string }
    error.code = code
    return error
  }

  if (request.stream && onChunk) {
    const response = await fetch(`${getRendererApiOrigin()}/api/v1/ai/official/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken') || sessionStorage.getItem('userToken') || ''}`
      },
      body: JSON.stringify({
        modelId: model.id,
        messages: request.messages,
        stream: true,
        temperature: request.temperature,
        maxTokens: request.maxTokens
      }),
      signal: request.signal
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw buildOfficialError(
        error.message || `HTTP ${response.status}: ${response.statusText}`,
        error.code
      )
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    let fullContent = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '))
      for (const line of lines) {
        const data = JSON.parse(line.slice(6))
        if (data.content) {
          fullContent += data.content
        }
        onChunk({ content: data.content || '', done: !!data.done })
      }
    }

    return {
      content: fullContent,
      model: model.id,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      }
    }
  }

  const response = await apiService.createOfficialChat({
    modelId: model.id,
    messages: request.messages,
    stream: false,
    temperature: request.temperature,
    maxTokens: request.maxTokens
  })

  return {
    content: response.data?.content || '',
    model: response.data?.model || model.id,
    usage: response.data?.usage
  }
}

/**
 * 计算费用（美元）
 */
function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelPrice?: { input: number; output: number }
): number | undefined {
  if (!modelPrice || !inputTokens || !outputTokens) {
    return undefined
  }

  // 价格单位是 USD per 1M tokens
  const inputCost = (inputTokens / 1_000_000) * modelPrice.input
  const outputCost = (outputTokens / 1_000_000) * modelPrice.output

  return inputCost + outputCost
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

  const body: any = {
    model: model.id,
    messages: request.messages,
    temperature: request.temperature ?? 0.7,
    max_tokens: request.maxTokens,
    top_p: request.topP,
    frequency_penalty: request.frequencyPenalty,
    presence_penalty: request.presencePenalty,
    stream: request.stream ?? false
  }

  // 添加工具定义 (如果提供)
  if (request.tools && request.tools.length > 0) {
    body.tools = request.tools
    body.tool_choice = request.toolChoice || 'auto'
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
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
    return await handleOpenAIStream(response, onChunk, model)
  }

  // 非流式响应
  const data = await response.json()
  const inputTokens = data.usage?.prompt_tokens || 0
  const outputTokens = data.usage?.completion_tokens || 0
  const cost = calculateCost(inputTokens, outputTokens, model.price)

  return {
    content: data.choices[0]?.message?.content || '',
    model: data.model,
    usage: {
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens: data.usage?.total_tokens || 0
    },
    metadata: cost !== undefined ? { cost } : undefined,
    finishReason: data.choices[0]?.finish_reason
  }
}

/**
 * 处理 OpenAI 流式响应
 */
async function handleOpenAIStream(
  response: Response,
  onChunk: (chunk: StreamChunk) => void,
  model: AIModel
): Promise<ChatCompletionResponse> {
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('Response body is not readable')
  }

  let fullContent = ''
  let actualModel = ''
  let usageData: any = null

  // 速度统计
  const startTime = Date.now()
  let firstTokenTime: number | null = null
  let tokenCount = 0

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

            // 捕获 model 字段
            if (parsed.model && !actualModel) {
              actualModel = parsed.model
            }

            // 捕获 usage 信息（可能在最后一个chunk中）
            if (parsed.usage) {
              usageData = parsed.usage
            }

            if (content) {
              // 记录首个 Token 时间
              if (!firstTokenTime) {
                firstTokenTime = Date.now()
              }

              fullContent += content
              tokenCount++
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

  const endTime = Date.now()
  const duration = endTime - (firstTokenTime || startTime)
  const ttft = firstTokenTime ? firstTokenTime - startTime : undefined
  const tps = duration > 0 ? tokenCount / (duration / 1000) : undefined

  // 计算费用
  const inputTokens = usageData?.prompt_tokens || 0
  const outputTokens = usageData?.completion_tokens || 0
  const cost = calculateCost(inputTokens, outputTokens, model.price)

  // 构建 metadata
  const metadata: MessageMetadata = {
    totalInputTokens: usageData?.prompt_tokens,
    totalOutputTokens: usageData?.completion_tokens,
    totalTokens: usageData?.total_tokens,
    inputCachedTokens: usageData?.prompt_tokens_details?.cached_tokens,
    inputTextTokens: usageData?.prompt_tokens_details?.text_tokens,
    inputAudioTokens: usageData?.prompt_tokens_details?.audio_tokens,
    outputTextTokens: usageData?.completion_tokens_details?.text_tokens,
    outputAudioTokens: usageData?.completion_tokens_details?.audio_tokens,
    outputReasoningTokens: usageData?.completion_tokens_details?.reasoning_tokens,
    tps,
    ttft,
    duration,
    latency: endTime - startTime,
    cost
  }

  return {
    content: fullContent,
    model: actualModel,
    usage: {
      promptTokens: usageData?.prompt_tokens || 0,
      completionTokens: usageData?.completion_tokens || 0,
      totalTokens: usageData?.total_tokens || 0
    },
    metadata
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

  const body: any = {
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

  // Anthropic 使用 tools 参数 (格式略有不同)
  if (request.tools && request.tools.length > 0) {
    body.tools = request.tools
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
    return await handleAnthropicStream(response, onChunk, model)
  }

  // 非流式响应
  const data = await response.json()
  const inputTokens = data.usage?.input_tokens || 0
  const outputTokens = data.usage?.output_tokens || 0
  const cost = calculateCost(inputTokens, outputTokens, model.price)

  return {
    content: data.content[0]?.text || '',
    model: data.model,
    usage: {
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens: inputTokens + outputTokens
    },
    metadata: cost !== undefined ? { cost } : undefined,
    finishReason: data.stop_reason
  }
}

/**
 * 处理 Anthropic 流式响应
 */
async function handleAnthropicStream(
  response: Response,
  onChunk: (chunk: StreamChunk) => void,
  model: AIModel
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
  // 确保模型路径包含 "models/" 前缀
  const modelPath = model.id.startsWith('models/') ? model.id : `models/${model.id}`
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

  try {
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
  } catch (error) {
    throw error
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
  let objectCount = 0
  let buffer = '' // 缓冲区用于累积完整的 JSON 对象
  let braceCount = 0 // 用于追踪 { } 平衡

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        // 处理最后的缓冲区内容
        if (buffer.trim() && buffer.trim() !== ',') {
          try {
            const parsed = JSON.parse(buffer.trim())
            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''

            if (content) {
              fullContent += content
              objectCount++
              onChunk({ content, done: false })
            }
          } catch (e) {}
        }

        break
      }

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      // 处理完整的 JSON 对象
      // NDJSON 格式：对象之间用 ',' 或 '\n' 分隔
      while (buffer.length > 0) {
        // 找到下一个 JSON 对象的开始
        const trimmed = buffer.trimStart()
        if (!trimmed) break

        // 跳过逗号、空行、括号
        if (
          trimmed[0] === ',' ||
          trimmed[0] === '\n' ||
          trimmed[0] === '\r' ||
          trimmed[0] === '[' ||
          trimmed[0] === ']'
        ) {
          buffer = trimmed.substring(1)
          continue
        }

        // 确保以 { 开始
        if (trimmed[0] !== '{') {
          break
        }

        // 累积字符直到找到平衡的 { }
        let objectStr = ''
        let braces = 0
        let inString = false
        let escaped = false

        for (let i = 0; i < trimmed.length; i++) {
          const char = trimmed[i]

          // 处理转义字符
          if (escaped) {
            objectStr += char
            escaped = false
            continue
          }

          if (char === '\\') {
            objectStr += char
            escaped = true
            continue
          }

          // 处理字符串
          if (char === '"') {
            inString = !inString
            objectStr += char
            continue
          }

          if (inString) {
            objectStr += char
            continue
          }

          // 统计 { }
          if (char === '{') {
            braces++
            objectStr += char
          } else if (char === '}') {
            braces--
            objectStr += char

            // 找到了完整的对象
            if (braces === 0) {
              try {
                const parsed = JSON.parse(objectStr)
                const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''

                if (content) {
                  fullContent += content
                  objectCount++
                  onChunk({ content, done: false })
                }
              } catch (e) {}

              // 继续处理下一个对象
              buffer = trimmed.substring(i + 1)
              objectStr = ''
              braces = 0
              break
            }
          } else {
            objectStr += char
          }
        }

        // 如果没有找到完整的对象，保留在 buffer 中
        if (braces !== 0) {
          buffer = trimmed
          break
        }
      }
    }

    onChunk({ content: '', done: true })
  } catch (error) {
    throw error
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
      Authorization: `Bearer ${provider.apiKey}`,
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

    throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  // 流式响应
  if (request.stream && onChunk) {
    return await handleOpenAIStream(response, onChunk, model)
  }

  // 非流式响应
  const data = await response.json()
  const inputTokens = data.usage?.prompt_tokens || 0
  const outputTokens = data.usage?.completion_tokens || 0
  const cost = calculateCost(inputTokens, outputTokens, model.price)

  return {
    content: data.choices[0]?.message?.content || '',
    model: data.model,
    usage: {
      promptTokens: inputTokens,
      completionTokens: outputTokens,
      totalTokens: data.usage?.total_tokens || 0
    },
    metadata: cost !== undefined ? { cost } : undefined,
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
  switch (getRuntimeProviderId(provider)) {
    case 'official':
      return await callOfficialManagedModel(provider, model, request, onChunk)

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
    case 'minimax':
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
  const englishWords = text
    .replace(/[\u4e00-\u9fa5]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0).length

  return Math.ceil(chineseChars + englishWords * 1.3)
}

/**
 * 估算请求的总 token 数
 */
export function estimateRequestTokens(messages: ChatMessage[]): number {
  return messages.reduce((total, msg) => total + estimateTokens(msg.content), 0)
}
