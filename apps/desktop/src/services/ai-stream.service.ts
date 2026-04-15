import type { AIProvider, AIModel } from '../types/ai-providers'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  name?: string
  tool_call_id?: string
}

export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters?: {
      type: 'object'
      properties: Record<string, any>
      required?: string[]
    }
  }
}

export interface StreamChunk {
  type: 'text' | 'tool-call' | 'tool-result' | 'done' | 'error'
  content?: string
  toolCallId?: string
  toolName?: string
  toolInput?: any
  toolOutput?: string
  error?: string
  done?: boolean
}

export interface ChatCompletionResponse {
  content: string
  model: string
  finishReason: string
  toolCalls?: Array<{
    id: string
    name: string
    arguments: string
  }>
}

function toModelMessages(messages: ChatMessage[]): any[] {
  return messages.map(msg => {
    if (msg.role === 'tool') {
      return {
        role: 'tool',
        content: msg.content,
        tool_call_id: msg.tool_call_id
      }
    }
    return {
      role: msg.role,
      content: msg.content
    }
  })
}

export async function* streamAIResponse(
  provider: AIProvider,
  model: AIModel,
  messages: ChatMessage[],
  tools: ToolDefinition[],
  signal?: AbortSignal
): AsyncGenerator<StreamChunk, void, unknown> {
  const endpoint = `${provider.endpoint}/chat/completions`

  const body: any = {
    model: model.id,
    messages: toModelMessages(messages),
    temperature: 0.3,
    stream: true,
    tools: tools.length > 0 ? tools : undefined,
    tool_choice: 'auto'
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let buffer = ''
    let toolCallsBuffer: Record<string, { name: string; arguments: string }> = {}

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            yield { type: 'done', done: true }
            return
          }

          try {
            const parsed = JSON.parse(data)
            const choice = parsed.choices?.[0]

            if (!choice) continue

            if (choice.delta?.content) {
              yield {
                type: 'text',
                content: choice.delta.content
              }
            }

            if (choice.delta?.tool_calls) {
              for (const tc of choice.delta.tool_calls) {
                const callId = tc.function?.name ? tc.index + '_' + Date.now() : tc.index + ''
                if (!toolCallsBuffer[callId]) {
                  toolCallsBuffer[callId] = { name: tc.function?.name || '', arguments: '' }
                }
                if (tc.function?.name) {
                  toolCallsBuffer[callId].name = tc.function.name
                }
                if (tc.function?.arguments) {
                  toolCallsBuffer[callId].arguments += tc.function.arguments
                }
              }
            }

            if (choice.finish_reason === 'tool_calls' || choice.finish_reason === 'stop') {
              for (const [callId, tc] of Object.entries(toolCallsBuffer)) {
                if (tc.name) {
                  yield {
                    type: 'tool-call',
                    toolCallId: callId,
                    toolName: tc.name,
                    toolInput: tc.arguments
                  }
                }
              }
              toolCallsBuffer = {}

              if (choice.finish_reason === 'tool_calls') {
                continue
              }

              yield { type: 'done', done: true }
              return
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error: any) {
    console.error('[API] 请求失败:', error)
    yield { type: 'error', error: error.message }
  }
}

export function createToolDefinition(
  name: string,
  description: string,
  parameters: Record<string, any>
): ToolDefinition {
  return {
    type: 'function',
    function: {
      name,
      description,
      parameters: {
        type: 'object',
        properties: parameters,
        required: Object.entries(parameters)
          .filter(([_, v]) => v.required || (typeof v === 'object' && (v as any).required))
          .map(([k, _]) => k)
      }
    }
  }
}

export function createToolDefinitions(
  tools: Record<string, { description: string; parameters: Record<string, any> }>
): ToolDefinition[] {
  return Object.entries(tools).map(([name, def]) =>
    createToolDefinition(name, def.description, def.parameters)
  )
}
