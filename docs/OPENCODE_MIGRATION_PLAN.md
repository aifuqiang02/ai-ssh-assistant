# OpenCode 核心逻辑迁移计划

> 日期: 2026-01-28 目标: 将 OpenCode 的核心消息处理逻辑迁移到我们的项目

## 迁移范围

### 需要迁移的模块

1. **消息类型定义** (`message.ts`)
   - `MessageV2.Info`
   - `MessageV2.Part`
   - `MessageV2.WithParts`
   - `ToolPart` / `TextPart` / `ReasoningPart`

2. **消息转换** (`message.ts`)
   - `toModelMessages()` - 转换为 API 格式
   - `fromToolResult()` - 从工具结果创建消息

3. **流式处理器** (`processor.ts`)
   - `SessionProcessor` 类
   - 事件处理 (text, tool-call, tool-result, reasoning)

4. **多轮循环** (`session.ts`)
   - `Session.loop` 逻辑
   - 消息历史管理

### 不需要迁移的部分

- 存储系统 (Storage) - 我们使用内存状态
- 权限系统 (PermissionNext) - 当前不需要
- 快照系统 (Snapshot) - 当前不需要
- 摘要系统 (SessionSummary) - 当前不需要

---

## 实现步骤

### 步骤 1: 创建消息类型定义

```typescript
// apps/desktop/src/services/messages/message.ts

// 消息角色
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

// 工具调用状态
export type ToolState = 'pending' | 'running' | 'completed' | 'error'

// 消息元数据
export interface MessageInfo {
  id: string
  role: MessageRole
  parentID?: string
  sessionID?: string
  finish?: 'stop' | 'tool-calls' | 'unknown'
  createdAt: number
}

// 文本部分
export interface TextPart {
  type: 'text'
  text: string
}

// 工具部分
export interface ToolPart {
  type: 'tool'
  tool: string
  callID: string
  state: {
    status: ToolState
    input?: Record<string, any>
    output?: string
    error?: string
    time?: {
      start: number
      end?: number
    }
  }
}

// 推理部分
export interface ReasoningPart {
  type: 'reasoning'
  text: string
  time?: {
    start: number
    end?: number
  }
}

// 消息部分联合类型
export type MessagePart = TextPart | ToolPart | ReasoningPart

// 完整消息
export interface Message {
  info: MessageInfo
  parts: MessagePart[]
}
```

### 步骤 2: 创建消息转换函数

```typescript
// apps/desktop/src/services/messages/convert.ts

import type { Message, MessagePart } from './message'

// LLM API 消息格式
export interface ModelMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
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

// 工具结果消息
export interface ToolResultMessage {
  role: 'tool'
  content: string
  tool_call_id: string
}

// 转换为 LLM API 格式
export function toModelMessages(msgs: Message[]): ModelMessage[] {
  const result: ModelMessage[] = []

  for (const msg of msgs) {
    // 跳过空消息
    if (msg.parts.length === 0) continue

    // 用户消息
    if (msg.info.role === 'user') {
      const textParts = msg.parts
        .filter((p): p is TextPart => p.type === 'text')
        .map(p => p.text)
        .join('\n')

      if (textParts) {
        result.push({
          role: 'user',
          content: textParts
        })
      }
    }

    // 助手消息
    if (msg.info.role === 'assistant') {
      const assistantMsg: ModelMessage = {
        role: 'assistant',
        content: ''
      }

      // 收集工具调用
      const toolParts = msg.parts.filter(
        (p): p is ToolPart => p.type === 'tool'
      )
      if (toolParts.length > 0) {
        assistantMsg.tool_calls = toolParts.map(tp => ({
          id: tp.callID,
          type: 'function' as const,
          function: {
            name: tp.tool,
            arguments: JSON.stringify(tp.state.input || {})
          }
        }))
      }

      // 收集文本内容
      const textParts = msg.parts
        .filter((p): p is TextPart => p.type === 'text')
        .map(p => p.text)
        .join('\n')

      if (textParts) {
        assistantMsg.content = textParts
      }

      if (assistantMsg.tool_calls || assistantMsg.content) {
        result.push(assistantMsg)
      }

      // 添加工具结果
      for (const tp of toolParts) {
        if (tp.state.status === 'completed' && tp.state.output) {
          result.push({
            role: 'tool',
            content: tp.state.output,
            tool_call_id: tp.callID
          })
        }
      }
    }
  }

  return result
}

// 从工具结果创建消息
export function fromToolResult(
  callID: string,
  tool: string,
  result: { output: string }
): Message {
  return {
    info: {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      createdAt: Date.now()
    },
    parts: [
      {
        type: 'tool',
        tool,
        callID,
        state: {
          status: 'completed',
          input: {},
          output: result.output,
          time: {
            start: Date.now(),
            end: Date.now()
          }
        }
      }
    ]
  }
}
```

### 步骤 3: 创建流式处理器

```typescript
// apps/desktop/src/services/processor.ts

import type { ModelMessage, ToolResultMessage } from './messages/convert'

// 流式事件类型
export type StreamEvent =
  | { type: 'start' }
  | { type: 'text-delta'; delta: string }
  | { type: 'text-done' }
  | { type: 'tool-call'; toolCallId: string; toolName: string; input: string }
  | { type: 'tool-result'; toolCallId: string; output: { output: string } }
  | { type: 'done' }
  | { type: 'error'; error: Error }

// 处理器配置
export interface ProcessorConfig {
  messages: ModelMessage[]
  tools: any[]
  abortSignal?: AbortSignal
  onEvent?: (event: StreamEvent) => void
}

// 处理器结果
export interface ProcessorResult {
  finish: 'stop' | 'tool-calls'
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

// 流式处理器类
export class SessionProcessor {
  private config: ProcessorConfig
  private toolCalls: Map<string, { name: string; input: any }> = new Map()
  private abortController: AbortController

  constructor(config: ProcessorConfig) {
    this.config = config
    this.abortController = new AbortController()
    if (config.abortSignal) {
      config.abortSignal.addEventListener('abort', () => {
        this.abortController.abort()
      })
    }
  }

  async *process(): AsyncGenerator<StreamEvent, ProcessorResult, unknown> {
    // 发送 start 事件
    yield { type: 'start' }

    try {
      // 调用 LLM
      for await (const chunk of this.llmStream()) {
        if (this.abortController.signal.aborted) break

        switch (chunk.type) {
          case 'text':
            yield { type: 'text-delta', delta: chunk.content || '' }
            break

          case 'tool-call':
            this.toolCalls.set(chunk.toolCallId, {
              name: chunk.toolName,
              input: chunk.toolInput
            })
            yield {
              type: 'tool-call',
              toolCallId: chunk.toolCallId,
              toolName: chunk.toolName,
              input: JSON.stringify(chunk.toolInput)
            }
            break

          case 'done':
            yield { type: 'text-done' }

            // 检查是否有工具调用
            if (this.toolCalls.size > 0) {
              yield { type: 'done' }
              return { finish: 'tool-calls' }
            }

            yield { type: 'done' }
            return { finish: 'stop' }
        }
      }
    } catch (error) {
      yield { type: 'error', error: error as Error }
      throw error
    }

    return { finish: 'stop' }
  }

  private async *llmStream(): AsyncGenerator<any, void, unknown> {
    // 这里调用我们的 LLM 服务
    // 使用 createLLMSession
  }

  // 执行工具
  async executeTool(toolCallId: string, args: any): Promise<{ output: string }> {
    const toolInfo = this.toolCalls.get(toolCallId)
    if (!toolInfo) {
      throw new Error(`Unknown tool call: ${toolCallId}`)
    }

    // 执行工具并返回结果
    return { output: '...' }
  }

  // 工具结果处理
  async handleToolResult(
    toolCallId: string,
    result: { output: string }
  ): Promise<void> {
    yield {
      type: 'tool-result',
      toolCallId,
      output: result
    }
  }
}
```

### 步骤 4: 修改 AIChatSessionWithTools.vue 使用新系统

```typescript
// apps/desktop/src/components/chat/AIChatSessionWithTools.vue

import { toModelMessages } from '@/services/messages/convert'
import { SessionProcessor } from '@/services/processor'

async function sendMessageWithTools(content: string) {
  // 1. 创建用户消息
  const userMessage: Message = {
    info: {
      id: `msg_${Date.now()}`,
      role: 'user',
      createdAt: Date.now()
    },
    parts: [{ type: 'text', text: content }]
  }
  messages.value.push(userMessage)

  // 2. 多轮处理循环
  const maxRounds = 10
  let round = 0

  while (round < maxRounds) {
    round++

    // 3. 构建消息历史
    const allMessages = [...historyMessages, ...pendingMessages]
    const modelMessages = toModelMessages(allMessages)

    // 4. 创建处理器
    const processor = new SessionProcessor({
      messages: modelMessages,
      tools: SSH_TOOLS,
      abortSignal: abortController.value?.signal
    })

    // 5. 处理流式响应
    let finish: 'stop' | 'tool-calls' = 'stop'

    for await (const event of processor.process()) {
      switch (event.type) {
        case 'text-delta':
          // 更新 UI
          break

        case 'tool-call':
          // 执行工具
          const result = await executeTool(event.toolName, event.input)

          // 添加工具结果消息
          const toolResultMessage = fromToolResult(
            event.toolCallId,
            event.toolName,
            result
          )
          pendingMessages.push(toolResultMessage)
          break
      }

      if (event.type === 'done') {
        finish = 'stop'
      }
    }

    // 6. 如果没有工具调用，退出循环
    if (finish === 'stop') {
      break
    }
  }
}
```

---

## 文件结构

```
apps/desktop/src/
├── services/
│   ├── llm.ts                    # LLM 服务（保留）
│   ├── messages/
│   │   ├── index.ts              # 导出
│   │   ├── message.ts            # 消息类型定义
│   │   └── convert.ts            # 消息转换函数
│   └── processor.ts              # 流式处理器
└── components/chat/
    └── AIChatSessionWithTools.vue  # 主组件（使用新系统）
```

---

## 待办事项

- [ ] 创建 `services/messages/message.ts` - 消息类型定义
- [ ] 创建 `services/messages/convert.ts` - 消息转换函数
- [ ] 创建 `services/processor.ts` - 流式处理器
- [ ] 修改 `AIChatSessionWithTools.vue` - 使用新系统
- [ ] 测试多轮工具调用
