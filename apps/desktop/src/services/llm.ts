import { Tool } from './tools/tool'
import type { AIProvider, AIModel } from '../types/ai-providers'
import { getRendererApiOrigin } from '@/config/api-environment'
import { zodToOpenAIParameters } from './zod-schema'

const OFFICIAL_API_BASE_URL = getRendererApiOrigin()

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | Array<{ type: string; [key: string]: any }>
  name?: string
  tool_call_id?: string
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }>
}

export interface ToolCallMessageContent {
  type: 'tool-call'
  tool_call_id: string
  tool_name: string
  arguments: Record<string, any>
}

export interface ToolResultMessageContent {
  type: 'tool-result'
  tool_call_id: string
  result: string
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
  finish?: 'stop' | 'tool-calls'
}

export interface ToolResult {
  title: string
  metadata: Record<string, any>
  output: string
}

interface ToolInfo {
  id: string
  init: () => Promise<{
    description: string
    parameters: any
    execute: (args: any, ctx: any) => Promise<ToolResult>
  }>
}

export class LLMSession {
  private provider: AIProvider
  private model: AIModel
  private tools: ToolInfo[]

  constructor(
    provider: AIProvider,
    model: AIModel,
    tools: ToolInfo[],
    private connectionId: string,
    private onProgress?: (msg: string) => void,
    private serverEnvDocId?: string,
    private signal?: AbortSignal
  ) {
    this.provider = provider
    this.model = model
    this.tools = tools
  }

  async *stream(messages: ChatMessage[]): AsyncGenerator<StreamChunk, void, unknown> {
    const toolDefinitions = await Promise.all(
      this.tools.map(async tool => {
        const info = await tool.init()
        const parameters = info.parameters

        return {
          type: 'function' as const,
          function: {
            name: tool.id,
            description: info.description,
            parameters: zodToOpenAIParameters(parameters)
          }
        }
      })
    )

    if ((this.provider.config?.runtimeProviderId || this.provider.id) === 'official') {
      yield* this.streamOfficialModel(messages, toolDefinitions)
      return
    }

    const endpoint = `${this.provider.endpoint}/chat/completions`

    const body: any = {
      model: this.model.id,
      messages: this.toModelMessages(messages),
      temperature: 0.3,
      stream: true,
      tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
      tool_choice: 'auto'
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: this.signal
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }

    yield* this.parseStream(response.body!, this.signal)
  }

  private async *streamOfficialModel(
    messages: ChatMessage[],
    toolDefinitions: object[]
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const response = await fetch(`${OFFICIAL_API_BASE_URL}/api/v1/ai/official/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken') || sessionStorage.getItem('userToken') || ''}`
      },
      body: JSON.stringify({
        modelId: this.model.id,
        messages: this.toModelMessages(messages),
        stream: true,
        temperature: 0.3,
        tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
        toolChoice: 'auto'
      }),
      signal: this.signal
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      throw new Error(payload.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    yield* this.parseStream(response.body!, this.signal)
  }

  async *parseStream(
    body: ReadableStream,
    signal?: AbortSignal
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let toolCallsBuffer: Record<string, { name: string; arguments: string; originalId?: string }> =
      {}

    const cancelReader = () => {
      void reader.cancel(createAbortError()).catch(() => {})
    }

    if (signal?.aborted) {
      cancelReader()
      throw createAbortError()
    }

    signal?.addEventListener('abort', cancelReader, { once: true })

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (signal?.aborted) throw createAbortError()
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
                  const index = tc.index ?? 0
                  const apiId = tc.id

                  const bufferKey = String(index)

                  if (!toolCallsBuffer[bufferKey]) {
                    toolCallsBuffer[bufferKey] = { name: '', arguments: '', originalId: apiId }
                  } else if (apiId && !toolCallsBuffer[bufferKey].originalId) {
                    toolCallsBuffer[bufferKey].originalId = apiId
                  }

                  if (tc.function?.name) {
                    toolCallsBuffer[bufferKey].name = tc.function.name
                  }
                  if (tc.function?.arguments) {
                    toolCallsBuffer[bufferKey].arguments += tc.function.arguments
                  }
                }
              }

              if (choice.finish_reason === 'tool_calls' || choice.finish_reason === 'stop') {
                for (const [bufferKey, tc] of Object.entries(toolCallsBuffer)) {
                  if (tc.name) {
                    const yieldId = tc.originalId || bufferKey

                    let parsedArgs = {}
                    if (tc.arguments) {
                      try {
                        parsedArgs = JSON.parse(tc.arguments)
                      } catch (e) {
                        // parse error
                      }
                    }

                    yield {
                      type: 'tool-call',
                      toolCallId: yieldId,
                      toolName: tc.name,
                      toolInput: parsedArgs
                    }
                  }
                }
                toolCallsBuffer = {}

                if (choice.finish_reason === 'tool_calls') {
                  yield { type: 'done', finish: 'tool-calls' }
                } else {
                  yield { type: 'done', finish: 'stop' }
                }
                return
              }
            } catch (e) {
              // Ignore malformed SSE events without discarding the stream.
            }
          }
        }
      }
    } finally {
      signal?.removeEventListener('abort', cancelReader)
      reader.releaseLock()
    }
  }

  async executeTool(toolName: string, args: any): Promise<ToolResult> {
    const tool = this.tools.find(t => t.id === toolName)
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`)
    }

    const info = await tool.init()
    return info.execute(args, {
      sessionID: '',
      messageID: '',
      agent: 'ssh-agent',
      abort: this.signal || new AbortController().signal,
      metadata: () => {},
      extra: {
        connectionId: this.connectionId,
        serverEnvDocId: this.serverEnvDocId
      }
    })
  }

  private toModelMessages(messages: ChatMessage[]): any[] {
    const result = messages.map((msg, idx) => {
      if (msg.role === 'tool') {
        return {
          role: 'tool',
          content: msg.content,
          tool_call_id: msg.tool_call_id
        }
      }

      if (msg.role === 'assistant') {
        if (msg.tool_calls && msg.tool_calls.length > 0) {
          const openaiToolCalls = msg.tool_calls.map(tc => ({
            id: tc.id,
            type: tc.type,
            function: {
              name: tc.function.name,
              arguments:
                typeof tc.function.arguments === 'string'
                  ? tc.function.arguments
                  : JSON.stringify(tc.function.arguments)
            }
          }))

          return {
            role: 'assistant',
            content: null,
            tool_calls: openaiToolCalls
          }
        }
      }

      if (typeof msg.content === 'string') {
        const invokeMatch = msg.content.match(/<invoke><(\w+)>\n(.*?)\n<\/\1><\/invoke>/s)
        if (invokeMatch) {
          const toolName = invokeMatch[1]
          const argsStr = invokeMatch[2]
          let args = {}
          try {
            args = JSON.parse(argsStr)
          } catch (e) {
            // parse error
          }
          return {
            role: 'assistant',
            content: null,
            tool_calls: [
              {
                id: msg.tool_call_id || `call_${idx}_${Date.now()}`,
                type: 'function',
                function: {
                  name: toolName,
                  arguments: JSON.stringify(args)
                }
              }
            ]
          }
        }
      }

      return {
        role: msg.role,
        content: msg.content
      }
    })

    return result
  }

}

export function createLLMSession(
  provider: AIProvider,
  model: AIModel,
  tools: ToolInfo[],
  connectionId: string,
  onProgress?: (msg: string) => void,
  serverEnvDocId?: string,
  signal?: AbortSignal
): LLMSession {
  return new LLMSession(provider, model, tools, connectionId, onProgress, serverEnvDocId, signal)
}

function createAbortError(): Error {
  const error = new Error('Request aborted')
  error.name = 'AbortError'
  return error
}
