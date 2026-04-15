// apps/desktop/src/services/processor.ts

// 流式事件类型
export type StreamEvent =
  | { type: 'start' }
  | { type: 'text-delta'; delta: string }
  | { type: 'text-done' }
  | { type: 'tool-call'; toolCallId: string; toolName: string; input: any }
  | { type: 'tool-result'; toolCallId: string; output: { output: string } }
  | { type: 'tool-error'; toolCallId: string; error: string }
  | { type: 'done'; finish: 'stop' | 'tool-calls' }
  | { type: 'error'; error: Error }

import type { ModelMessage } from './messages/convert'
import type { ChatMessage, StreamChunk } from './llm'
import { createLLMSession } from './llm'
import { resetToModelMessagesCache } from './messages/convert'
import type { AIProvider, AIModel } from '@/types/ai-providers'

// 流式处理器配置
export interface ProcessorConfig {
  messages: ModelMessage[]
  tools: any[]
  provider: AIProvider
  model: AIModel
  connectionId?: string
  serverEnvDocId?: string
  abortSignal?: AbortSignal
  onEvent?: (event: StreamEvent) => void
  onToolExecute?: (toolName: string, input: any) => Promise<{ output: string }>
}

// 处理器结果
export interface ProcessorResult {
  finish: 'stop' | 'tool-calls'
  toolCalls?: Array<{ callId: string; name: string; input: any }>
  messages?: ModelMessage[]
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

// 会话状态
interface SessionState {
  toolCalls: Map<string, { name: string; input: any }>
  aborted: boolean
  stepCount: number
}

// 最大步数限制（防止无限循环）
const MAX_STEPS = 100

// 流式处理器类
export class SessionProcessor {
  private config: ProcessorConfig
  private state: SessionState
  private abortController: AbortController
  private onProgress?: (msg: string) => void
  private messages: ModelMessage[]

  constructor(config: ProcessorConfig, onProgress?: (msg: string) => void) {
    this.config = config
    this.messages = [...config.messages]
    this.state = {
      toolCalls: new Map(),
      aborted: false,
      stepCount: 0
    }
    this.abortController = new AbortController()
    this.onProgress = onProgress

    if (config.abortSignal) {
      config.abortSignal.addEventListener('abort', () => {
        this.abortController.abort()
        this.state.aborted = true
      })
    }
  }

  async process(): Promise<ProcessorResult> {
    resetToModelMessagesCache()
    this.state.stepCount = 0

    while (this.state.stepCount < MAX_STEPS && !this.state.aborted) {
      this.state.stepCount++
      this.state.toolCalls.clear()

      this.emit({ type: 'start' })

      try {
        const result = await this.processOneRound()

        if (result.finish === 'stop') {
          return { finish: 'stop', messages: this.messages }
        }

        if (result.finish === 'tool-calls' && result.toolCalls && result.toolCalls.length > 0) {
          await this.executeTools(result.toolCalls)
          continue
        }
      } catch (error) {
        const err = error as Error
        this.emit({ type: 'error', error: err })
        throw err
      }
    }

    return { finish: 'stop', messages: this.messages }
  }

  private async processOneRound(): Promise<{
    finish: 'stop' | 'tool-calls'
    toolCalls?: Array<{ callId: string; name: string; input: any }>
  }> {
    let accumulatedText = ''

    const iterator = this.llmStream()
    let result = await iterator.next()

    while (!result.done && !this.state.aborted) {
      const chunk = result.value

      switch (chunk.type) {
        case 'text':
          accumulatedText += chunk.content || ''
          this.emit({ type: 'text-delta', delta: chunk.content || '' })
          break

        case 'tool-call':
          this.state.toolCalls.set(chunk.toolCallId!, {
            name: chunk.toolName!,
            input: chunk.toolInput
          })
          this.emit({
            type: 'tool-call',
            toolCallId: chunk.toolCallId!,
            toolName: chunk.toolName!,
            input: chunk.toolInput
          })
          break

        case 'done':
          this.emit({ type: 'text-done' })

          if (this.state.toolCalls.size > 0) {
            // 构建 tool_calls 数组
            const toolCallsArray = Array.from(this.state.toolCalls.entries()).map(([id, tc]) => ({
              id: id,
              type: 'function' as const,
              function: {
                name: tc.name,
                arguments: typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input)
              }
            }))

            // 保存包含 tool_calls 的 assistant 消息
            this.messages.push({
              role: 'assistant',
              content: accumulatedText,
              tool_calls: toolCallsArray
            })

            const toolCalls = Array.from(this.state.toolCalls.entries()).map(([id, tc]) => ({
              callId: id,
              name: tc.name,
              input: tc.input
            }))

            this.emit({ type: 'done', finish: 'tool-calls' })
            return { finish: 'tool-calls', toolCalls }
          }

          if (accumulatedText) {
            this.messages.push({
              role: 'assistant',
              content: accumulatedText
            })
          }

          this.emit({ type: 'done', finish: 'stop' })
          return { finish: 'stop' }
      }

      result = await iterator.next()
    }

    return { finish: 'stop' }
  }

  private async executeTools(
    toolCalls: Array<{ callId: string; name: string; input: any }>
  ): Promise<void> {
    for (const tc of toolCalls) {
      this.emit({
        type: 'tool-call',
        toolCallId: tc.callId,
        toolName: tc.name,
        input: tc.input
      })

      try {
        if (this.config.onToolExecute) {
          const result = await this.config.onToolExecute(tc.name, tc.input)

          this.emit({
            type: 'tool-result',
            toolCallId: tc.callId,
            output: { output: result.output }
          })

          this.messages.push({
            role: 'tool',
            content: result.output,
            tool_call_id: tc.callId
          })
        } else {
          const errorOutput = `Tool execution not configured: ${tc.name}`
          this.emit({
            type: 'tool-error',
            toolCallId: tc.callId,
            error: errorOutput
          })

          this.messages.push({
            role: 'tool',
            content: errorOutput,
            tool_call_id: tc.callId
          })
        }
      } catch (error) {
        const err = error as Error
        if (
          err.name === 'AbortError' ||
          String(err.message || '')
            .toLowerCase()
            .includes('aborted')
        ) {
          this.state.aborted = true
          throw err
        }
        const errorOutput = err.message || String(error)

        this.emit({
          type: 'tool-error',
          toolCallId: tc.callId,
          error: errorOutput
        })

        this.messages.push({
          role: 'tool',
          content: errorOutput,
          tool_call_id: tc.callId
        })
      }
    }
  }

  private async *llmStream(): AsyncGenerator<StreamChunk, void, unknown> {
    const messages = this.modelToChatMessages(this.messages)

    const session = createLLMSession(
      this.config.provider,
      this.config.model,
      this.config.tools,
      this.config.connectionId || '',
      msg => this.onProgress?.(msg),
      this.config.serverEnvDocId
    )

    yield* session.stream(messages)
  }

  private modelToChatMessages(msgs: ModelMessage[]): ChatMessage[] {
    const result = msgs.map(msg => {
      const chatMsg: ChatMessage = {
        role: msg.role as any,
        content: msg.content ?? ''
      }

      if (msg.tool_calls) {
        chatMsg.tool_calls = msg.tool_calls.map(tc => ({
          id: tc.id,
          type: tc.type,
          function: tc.function
        }))
      }

      if (msg.tool_call_id) {
        chatMsg.tool_call_id = msg.tool_call_id
      }

      return chatMsg
    })

    return result
  }

  private emit(event: StreamEvent) {
    this.config.onEvent?.(event)
  }

  getToolCalls(): Array<{ callId: string; name: string; input: any }> {
    return Array.from(this.state.toolCalls.entries()).map(([id, tc]) => ({
      callId: id,
      name: tc.name,
      input: tc.input
    }))
  }

  isAborted(): boolean {
    return this.state.aborted
  }

  getMessages(): ModelMessage[] {
    return this.messages
  }
}

export function getToolCallId(toolCallId: string | undefined, index: number): string {
  return toolCallId || `call_${index}`
}
