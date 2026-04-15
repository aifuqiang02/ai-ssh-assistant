# OpenCode vs AI-SSH-Assistant 流程对比

> 生成日期: 2026-01-28

本文档详细对比 OpenCode 系统与 AI-SSH-Assistant 在多轮工具调用、消息处理、流式响应等方面的实现差异。

## 目录

- [核心差异概览](#核心差异概览)
- [1. 多轮工具调用循环对比](#1-多轮工具调用循环对比)
- [2. 工具调用格式对比](#2-工具调用格式对比)
- [3. 思考/推理系统对比](#3-思考推理系统对比)
- [4. 消息历史管理对比](#4-消息历史管理对比)
- [5. 关键差异总结](#5-关键差异总结)
- [6. 问题根因分析](#6-问题根因分析)
- [7. 修复建议](#7-修复建议)

---

## 核心差异概览

| 维度             | OpenCode                                                      | AI-SSH-Assistant (我们)                                |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| **多轮循环位置** | 后端 (prompt.ts:270)                                          | 前端 (AIChatSessionWithTools.vue:1305)                 |
| **消息格式**     | 结构化 Parts (tool-call, tool-result, reasoning)              | 简单字符串 + XML 标签                                  |
| **工具调用表示** | `content: [{type: 'tool-call', toolCallId, toolName, input}]` | `content: '<invoke><execute_ssh_command>...</invoke>'` |
| **工具结果表示** | `content: [{type: 'tool-result', toolCallId, result}]`        | `role: 'tool'` 消息                                    |
| **思考/推理**    | 专用 ReasoningPart                                            | 无                                                     |
| **状态管理**     | 后端 Session State + Message Store                            | 前端 `messages.value`                                  |
| **流式处理**     | 后端 SSE 推送到前端                                           | 前端直接调用 LLM API                                   |
| **工具执行**     | 后端 ToolRegistry + 插件系统                                  | 前端直接调用工具                                       |

---

## 1. 多轮工具调用循环对比

### 1.1 OpenCode 的后端循环

**文件**: `opencode/packages/opencode/src/session/prompt.ts`

**核心循环** (第 270-523 行):

```typescript
// 第 270 行: while 循环
while (round < maxRounds) {
  // 1. 获取消息历史
  const messages = MessageV2.filterCompacted(sessionId, ...)

  // 2. 创建新的 assistant message
  const assistantMessage = await createAssistantMessage(...)

  // 3. 调用 LLM.stream 获取响应
  const processor = SessionProcessor.create({...})
  const result = await processor.process({
    messages,
    tools: [...],
    systemPrompt: ...
  })

  // 4. 检查是否需要工具调用
  if (result.finish === 'tool-calls') {
    // 执行工具
    for (const toolCall of result.toolCalls) {
      await executeTool(toolCall, ...)
    }
    // 继续下一轮
    round++
  } else {
    // 完成，退出循环
    break
  }
}
```

**流程图**:

```
┌─────────────────────────────────────────────────────────────────┐
│                      后端 prompt.ts                             │
├─────────────────────────────────────────────────────────────────┤
│  loop() {                                                       │
│    while (轮次 < 最大限制) {                                     │
│      1. 获取消息历史: MessageV2.filterCompacted()               │
│         ↓                                                       │
│      2. 创建新的 assistant message                             │
│         ↓                                                       │
│      3. 调用 LLM.stream() → 获取响应                            │
│         ↓                                                       │
│      4. 如果 finish === "tool-calls":                          │
│         - 执行工具 (第 421-440 行)                              │
│         - 更新工具状态 (第 445-457 行)                          │
│         - 继续下一轮                                            │
│         ↓                                                       │
│      5. 如果 finish !== "tool-calls": 退出循环                  │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 我们的前端循环

**文件**: `apps/desktop/src/components/chat/AIChatSessionWithTools.vue`

**核心循环** (第 1305-1479 行):

```typescript
// 第 1305 行: for 循环
for (let round = 0; round < maxRounds; round++) {
  // 1. 构建 apiMessages
  const apiMessages = []
  apiMessages.push({ role: 'system', content: systemPrompt })

  for (const msg of messages.value) {
    if (msg.streaming) {
      continue // 跳过流式消息
    }
    if (msg.role === 'assistant' && msg.toolResult) {
      // 只发送 tool result，不发送 <invoke> 内容
      apiMessages.push({
        role: 'tool',
        content: msg.toolResult.content,
        tool_call_id: msg.toolResult.toolCallId
      })
      continue
    }
    // ... 其他处理
  }
  apiMessages.push({ role: 'user', content: currentMessage })

  // 2. 创建 assistant message (streaming: true)
  const assistantMessage = {
    id: Date.now(),
    role: 'assistant',
    content: '',
    streaming: true
  }
  messages.value.push(assistantMessage)

  // 3. 调用 LLM.stream
  for await (const chunk of session.stream(apiMessages)) {
    // 处理流式响应
  }

  // 4. 执行工具
  for (const toolCall of toolCalls) {
    const result = await session.executeTool(toolCall.name, toolCall.input)
    // 保存工具结果
    assistantMessage.toolResult = {
      success: true,
      content: result.output,
      toolCallId: toolCall.callId
    }
  }

  // 5. 设置 streaming = false
  assistantMessage.streaming = false

  // 6. 如果没有工具调用，退出
  if (toolCalls.length === 0) {
    break
  }
}
```

**流程图**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    前端 AIChatSessionWithTools.vue              │
├─────────────────────────────────────────────────────────────────┤
│  handleSendMessage() {                                          │
│    for (let round = 0; round < maxRounds; round++) {            │
│      1. 构建 apiMessages: 过滤历史消息                          │
│         - 跳过 streaming 的消息                                 │
│         - assistant 消息:只发送 tool result                    │
│         - 不发送包含 <invoke> 的内容                            │
│         ↓                                                       │
│      2. 创建 assistant message (streaming: true)               │
│         ↓                                                       │
│      3. for await (chunk of session.stream(apiMessages))       │
│         ↓                                                       │
│      4. 执行工具                                                │
│         ↓                                                       │
│      5. 设置 assistantMessage.streaming = false                │
│         ↓                                                       │
│      6. 如果没有工具调用: break                                 │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 循环位置差异的影响

| 方面         | OpenCode (后端循环)        | 我们 (前端循环)              |
| ------------ | -------------------------- | ---------------------------- |
| **状态同步** | 自动同步，无状态丢失风险   | 需要手动管理，可能状态不一致 |
| **错误恢复** | 后端自动处理，前端订阅更新 | 前端需要自行处理错误         |
| **网络开销** | 单次连接，SSE 推送         | 每次轮次独立 HTTP 请求       |
| **扩展性**   | 容易添加中间件、插件       | 难以扩展                     |
| **用户体验** | SSE 实时推送，延迟低       | 可能需要轮询或重新连接       |

---

## 2. 工具调用格式对比

### 2.1 OpenCode 的工具调用格式

**文件**: `opencode/packages/opencode/src/session/message-v2.ts`

**Assistant 消息中的工具调用**:

```typescript
{
  role: 'assistant',
  content: [
    {
      type: 'tool-call',
      toolCallId: 'call_123',
      toolName: 'execute_ssh_command',
      input: { command: 'ls -la' }
    }
  ],
  finish: 'tool-calls'  // 表示有工具调用需要执行
}
```

**Tool 结果消息**:

```typescript
{
  role: 'tool',
  content: [
    {
      type: 'tool-result',
      toolCallId: 'call_123',
      result: 'total 24\ndrwxr-xr-x ...'
    }
  ]
}
```

**工具部分定义** (message-v2.ts):

```typescript
interface ToolPart {
  type: 'tool-call'
  status: 'pending' | 'running' | 'completed' | 'error'
  toolCallId: string
  toolName: string
  input: Record<string, unknown>
  output?: string
  startedAt?: number
  completedAt?: number
}
```

### 2.2 我们的当前格式

**文件**: `apps/desktop/src/services/llm.ts`

**Assistant 消息（包含 XML 标签）**:

```typescript
{
  role: 'assistant',
  content: '<invoke><execute_ssh_command>\n{"command":"ls -la"}\n</execute_ssh_command></invoke>'
}
```

**Tool 结果消息**:

```typescript
{
  role: 'tool',
  content: 'total 24\ndrwxr-xr-x ...',
  tool_call_id: 'call_function_xxx'  // MiniMax 返回的 ID
}
```

### 2.3 格式差异的问题

```
┌─────────────────────────────────────────────────────────────────┐
│                     格式兼容性问题                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OpenCode 格式:                                                 │
│  { role: 'assistant', content: [{ type: 'tool-call', ... }] }  │
│         ↓                                                       │
│  OpenAI/兼容 API 识别为工具调用                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  我们的格式:                                                    │
│  { role: 'assistant', content: '<invoke>...</invoke>' }        │
│         ↓                                                       │
│  MiniMax API 不识别 <invoke> 标签                               │
│         ↓                                                       │
│  第一轮: 正常工作（API 忽略 <invoke>，返回完成）                │
│  第二轮: API 看到 <invoke>，要求提供 tool_result               │
│         但我们发送的是普通 assistant 消息                       │
│         ↓                                                       │
│  错误: HTTP 400: tool result's tool id not found               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 问题根因

**MiniMax API 的期望格式**:

```typescript
// Assistant 消息（包含工具调用）
{
  role: 'assistant',
  content: [
    {
      type: 'tool-call',
      tool_call_id: 'call_123',
      tool_name: 'execute_ssh_command',
      arguments: { command: 'ls -la' }
    }
  ]
}

// Tool 结果消息
{
  role: 'tool',
  content: 'total 24\n...',
  tool_call_id: 'call_123'
}
```

**我们当前的错误格式**:

```typescript
// 第一轮后，保存的消息
{
  role: 'assistant',
  content: '<invoke><execute_ssh_command>...</invoke>\n<result>...</result>'
}

// 第二轮构建 apiMessages 时
// 错误地发送了包含 <invoke> 的 assistant 消息
apiMessages.push({
  role: 'assistant',
  content: '<invoke>...</invoke>'  // ❌ 错误！MiniMax 不识别
})
```

---

## 3. 思考/推理系统对比

### 3.1 OpenCode 的推理系统

**文件**: `opencode/packages/opencode/src/session/processor.ts`

**推理事件处理** (第 55-202 行):

```typescript
for await (const event of stream) {
  switch (event.type) {
    case 'reasoning-start':
      // 创建推理部分
      await Session.updatePart({
        type: 'reasoning',
        status: 'pending'
      })
      break

    case 'reasoning-delta':
      // 增量更新推理文本
      reasoningContent += event.delta
      await Session.updatePart({
        type: 'reasoning',
        content: reasoningContent,
        status: 'running'
      })
      break

    case 'reasoning-end':
      // 推理完成
      await Session.updatePart({
        type: 'reasoning',
        status: 'completed'
      })
      break
  }
}
```

**推理部分结构**:

```typescript
interface ReasoningPart {
  type: 'reasoning'
  status: 'pending' | 'running' | 'completed'
  content: string // AI 的思考过程
  startedAt?: number
  completedAt?: number
}
```

**特点**:

- 推理内容独立存储，不显示给用户但可查看
- 提供 AI 决策的透明度
- 支持调试和审计
- 可以展开/折叠显示

### 3.2 我们的实现

**当前状态**: 没有推理系统。

AI 的思考过程直接反映在最终响应中，或者根本不暴露。

### 3.3 推理系统缺失的影响

| 影响         | 说明                                     |
| ------------ | ---------------------------------------- |
| **调试困难** | 无法查看 AI 的思考过程，只能看到最终结果 |
| **用户信任** | 用户不知道 AI 为什么做出某个决定         |
| **问题诊断** | 当 AI 犯错时，难以定位原因               |
| **透明度**   | 缺少"思考链"会影响用户体验               |

---

## 4. 消息历史管理对比

### 4.1 OpenCode: 后端消息管理

**文件**: `opencode/packages/opencode/src/session/message-v2.ts`

**消息流**:

```
┌──────────────────────────────────────────────────────────────────┐
│                        后端存储                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MessageV2.stream(sessionId)                                     │
│    ↓                                                             │
│  返回所有消息 (user + assistant + tool)                          │
│    ↓                                                             │
│  MessageV2.filterCompacted()                                     │
│    ↓                                                             │
│  过滤掉已压缩到摘要的消息，只保留相关的                           │
│    ↓                                                             │
│  发送给 LLM                                                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**消息结构** (message-v2.ts):

```typescript
interface MessageV2 {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  parts: Array<{
    type: 'text' | 'tool-call' | 'tool-result' | 'reasoning'
    content: any
    status?: 'pending' | 'running' | 'completed' | 'error'
  }>
  finish: 'stop' | 'tool-calls' | 'unknown'
  createdAt: Date
  updatedAt: Date
}
```

**消息过滤** (prompt.ts:274):

```typescript
// 获取消息历史
const messages = MessageV2.filterCompacted({
  sessionId,
  partsOnly: true,
  compactAfter: lastSummaryAt
})

// filterCompacted 会:
// 1. 获取所有消息
// 2. 过滤掉已压缩到摘要的消息
// 3. 只保留相关的、未被压缩的消息
// 4. 按时间顺序排列
```

### 4.2 我们: 前端消息管理

**文件**: `apps/desktop/src/components/chat/AIChatSessionWithTools.vue`

**消息流**:

```
┌──────────────────────────────────────────────────────────────────┐
│                        前端状态                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  messages: Message[] = ref([                                     │
│    { id: 1, role: 'user', content: '...' },                     │
│    { id: 2, role: 'assistant', content: '...' },                │
│    { id: 3, role: 'assistant', toolResult: {...} },             │
│    ...                                                           │
│  ])                                                              │
│    ↓                                                             │
│  构建 apiMessages:                                               │
│    - system prompt                                               │
│    - tool results (role: 'tool')                                │
│    - current user message                                        │
│    ↓                                                             │
│  发送给 LLM (MiniMax API)                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**消息结构**:

```typescript
interface Message {
  id: number
  role: 'user' | 'assistant' | 'tool' | 'system'
  content: string
  toolUse?: { name: string; params: any }
  toolResult?: { success: boolean; content: string; toolCallId: string }
  streaming: boolean
  timestamp: Date
}
```

**消息构建逻辑** (AIChatSessionWithTools.vue:1221-1285):

```typescript
// 构建 API 消息
const apiMessages: ChatMessage[] = []

// 1. 添加系统提示
apiMessages.push({ role: 'system', content: systemPrompt })

// 2. 遍历历史消息
for (const msg of messages.value) {
  // 跳过流式消息
  if (msg.streaming) {
    continue
  }

  // 如果是 assistant 且有 toolResult，只发送 tool result
  if (msg.role === 'assistant' && msg.toolResult) {
    apiMessages.push({
      role: 'tool',
      content: msg.toolResult.content,
      tool_call_id: msg.toolResult.toolCallId
    })
    continue
  }

  // 跳过用户消息（最后单独添加）
  if (msg.role === 'user') {
    continue
  }

  // 其他消息直接添加
  apiMessages.push({
    role: msg.role as any,
    content: msg.content
  })
}

// 3. 添加当前用户消息
apiMessages.push({ role: 'user', content: currentMessage })
```

### 4.3 消息历史管理差异

| 方面       | OpenCode (后端)              | 我们 (前端)          |
| ---------- | ---------------------------- | -------------------- |
| **持久化** | 自动持久化到数据库           | 仅内存存储，刷新丢失 |
| **压缩**   | 自动摘要压缩                 | 无压缩               |
| **过滤**   | `filterCompacted()` 自动过滤 | 手动过滤，可能遗漏   |
| **同步**   | 多端自动同步                 | 仅当前标签页有效     |
| **查询**   | 支持按条件查询               | 只能线性遍历         |

---

## 5. 关键差异总结

### 5.1 为什么我们的实现有问题？

| 问题             | OpenCode 做法                   | 我们的做法                           | 影响                       |
| ---------------- | ------------------------------- | ------------------------------------ | -------------------------- |
| **工具调用表示** | 结构化 `tool-call` Parts        | XML 字符串 `<invoke>`                | MiniMax 不识别 XML         |
| **工具结果传递** | 独立的 `tool-result` Parts      | `role: 'tool'` 消息 + `tool_call_id` | 基本正确，但 ID 可能不匹配 |
| **循环控制**     | 后端控制，自动同步              | 前端控制，需要手动设置状态           | 状态可能不同步             |
| **消息过滤**     | 后端 `filterCompacted` 自动过滤 | 前端手动过滤                         | 可能遗漏或重复发送         |
| **流式状态**     | 后端更新 `Session.updatePart`   | 前端设置 `streaming = false`         | 时机可能不对               |
| **错误恢复**     | 后端自动重试                    | 前端需要自行处理                     | 用户体验差                 |

### 5.2 当前问题流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                    第一轮（正常工作）                            │
├─────────────────────────────────────────────────────────────────┤
│  用户: "查看服务器信息"                                          │
│    ↓                                                             │
│  构建 apiMessages: [system, user]                               │
│    ↓                                                             │
│  LLM 返回: assistant 消息 + tool_calls                          │
│    ↓                                                             │
│  前端解析 tool_calls，执行工具                                   │
│    ↓                                                             │
│  保存 assistantMessage:                                          │
│  { content: '<invoke>...</invoke>\n<result>...</result>' }      │
│    ↓                                                             │
│  构建 apiMessages: [system, tool(result), user(new)]            │
│    ↓                                                             │
│  发送给 LLM                                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    第二轮（失败）                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  构建 apiMessages:                                               │
│  [system, tool(result), user(new)]  ← 正确                      │
│    ↓                                                             │
│  LLM 返回响应                                                    │
│    ↓                                                             │
│  错误: HTTP 400: tool result's tool id not found                │
│                                                                 │
│  可能原因:                                                       │
│  1. tool_call_id 不匹配                                          │
│  2. 消息格式不正确                                               │
│  3. 消息历史包含无效内容                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. 问题根因分析

### 6.1 核心问题: 工具调用 ID 不匹配

**问题描述**: MiniMax API 返回的工具调用 ID 格式为
`call_function_xxx_N`，但在第二轮时，我们发送的 `tool_call_id`
可能与 API 期望的不匹配。

**代码位置**: `llm.ts:140-185`

```typescript
// 解析流式响应
let toolCallsBuffer: Record<
  string,
  { name: string; arguments: string; originalId?: string }
> = {}

for (const chunk of stream) {
  if (chunk.type === 'tool-call') {
    const index = chunk.index ?? 0
    const apiId = chunk.id

    // 缓存工具调用信息
    if (!toolCallsBuffer[index]) {
      toolCallsBuffer[index] = {
        name: chunk.toolName,
        arguments: chunk.toolInput,
        originalId: apiId
      }
    }
  }
}

// 返回的工具调用
const toolCalls = Object.values(toolCallsBuffer).map((tc, i) => ({
  callId: tc.originalId || `call_${i}`, // 可能的 ID 问题
  name: tc.name,
  input: tc.arguments
}))
```

**问题**: 如果 `tc.originalId` 为空（后续流块没有 ID），则使用
`call_${i}`，这与 MiniMax 返回的 ID 不匹配。

### 6.2 次要问题: 消息格式不兼容

**问题描述**: 我们使用 XML 标签表示工具调用，但 MiniMax
API 期望结构化的消息格式。

**当前格式**:

```typescript
{
  role: 'assistant',
  content: '<invoke><execute_ssh_command>{"command":"..."}</execute_ssh_command></invoke>'
}
```

**期望格式**:

```typescript
{
  role: 'assistant',
  content: [
    {
      type: 'tool-call',
      tool_call_id: 'call_function_xxx',
      tool_name: 'execute_ssh_command',
      arguments: { command: '...' }
    }
  ]
}
```

### 6.3 状态管理问题

**问题描述**: `streaming`
标志的设置时机可能不正确，导致第二轮错误地包含流式消息。

**代码位置**: `AIChatSessionWithTools.vue:1462-1464`

```typescript
// 当前代码
assistantMessage.streaming = false
console.log('[Chat] 设置 streaming=false for msg id=' + assistantMessage.id)
```

**潜在问题**:

1. 如果工具执行抛出异常，`streaming = false` 可能不会被执行
2. `continue` 跳转可能跳过状态设置

---

## 7. 修复建议

### 7.1 已完成的修改

**修改文件 1**: `apps/desktop/src/services/llm.ts`

```typescript
// ChatMessage 接口支持数组格式
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | Array<{ type: string; [key: string]: any }>
  // ...
}

// toModelMessages 转换逻辑
private toModelMessages(messages: ChatMessage[]): any[] {
  return messages.map(msg => {
    // 工具结果消息
    if (msg.role === 'tool') {
      return {
        role: 'tool',
        content: msg.content,
        tool_call_id: msg.tool_call_id
      }
    }

    // Assistant 消息，可能包含工具调用
    if (msg.role === 'assistant') {
      // 如果 content 是数组（OpenCode 格式），直接使用
      if (Array.isArray(msg.content)) {
        const toolCalls = msg.content.filter((c: any) => c.type === 'tool-call')
        if (toolCalls.length > 0) {
          return { role: 'assistant', content: msg.content }
        }
      }

      // 兼容旧的 XML 格式
      if (typeof msg.content === 'string') {
        const invokeMatch = msg.content.match(/<invoke><(\w+)>\n(.*?)\n<\/\1><\/invoke>/s)
        if (invokeMatch) {
          const toolName = invokeMatch[1]
          const args = JSON.parse(invokeMatch[2])
          return {
            role: 'assistant',
            content: [{
              type: 'tool-call',
              tool_call_id: msg.tool_call_id || `call_${Date.now()}`,
              tool_name: toolName,
              arguments: args
            }]
          }
        }
      }
    }

    return { role: msg.role, content: msg.content }
  })
}
```

**修改文件 2**: `apps/desktop/src/components/chat/AIChatSessionWithTools.vue`

```typescript
// Message 接口支持数组格式
interface Message {
  content: string | Array<{ type: string; [key: string]: any }>
  // ...
}

// 工具调用保存改为 OpenCode 格式
apiMessages.push({
  role: 'assistant',
  content: [
    {
      type: 'tool-call',
      tool_call_id: toolCall.callId,
      tool_name: toolCall.name,
      arguments: args
    }
  ]
})

// 工具调用收集支持对象格式
let toolCalls: Array<{
  callId: string
  name: string
  input: string | Record<string, any>
}> = []
// ...
toolCalls.push({
  callId: chunk.toolCallId!,
  name: chunk.toolName!,
  input: chunk.toolInput !== undefined ? chunk.toolInput : {}
})
```

### 7.2 方案 B: 确保 ID 匹配

**修改文件**: `apps/desktop/src/services/llm.ts`

```typescript
private async *parseStream(...) {
  // ... 现有代码

  // 确保 ID 匹配
  const getToolCallId = (index: number, name: string, args: string): string => {
    const buffer = toolCallsBuffer[index]
    if (buffer?.originalId) {
      return buffer.originalId
    }
    // 如果没有原始 ID，生成一个唯一 ID
    return `call_${name}_${index}_${Date.now()}`
  }
}
```

### 7.3 方案 C: 状态管理增强

**修改文件**: `apps/desktop/src/components/chat/AIChatSessionWithTools.vue`

```typescript
// 使用 try/finally 确保 streaming 标志始终被重置
try {
  for (const toolCall of toolCalls) {
    // 执行工具
  }
} finally {
  // 无论成功失败，都设置 streaming = false
  assistantMessage.streaming = false
  console.log('[Chat] 设置 streaming=false for msg id=' + assistantMessage.id)
}
```

### 7.4 调试日志增强

**建议添加的日志**:

```typescript
// 1. 打印最终发送的消息
console.log('[Chat] ===== 最终发送给 API 的消息 =====')
for (let i = 0; i < apiMessages.length; i++) {
  const msg = apiMessages[i]
  console.log(
    `[Chat] 消息 #${i}: role=${msg.role}, tool_call_id=${msg.tool_call_id}`
  )
}
console.log('[Chat] ===== 消息结束 =====')

// 2. 打印工具执行结果
console.log('[Chat] 工具执行结果:')
console.log('  - toolCallId:', toolCall.callId)
console.log('  - toolName:', toolCall.name)
console.log('  - result:', result.output.substring(0, 100))
```

---

## 8. 下一步行动

### 立即执行

1. [ ] 验证消息格式是否正确
2. [ ] 检查 tool_call_id 是否匹配
3. [ ] 确认 streaming 标志的设置时机
4. [ ] 添加详细的调试日志

### 短期优化

1. [ ] 修复消息格式转换逻辑
2. [ ] 确保 ID 生成和匹配正确
3. [ ] 增强错误处理
4. [ ] 添加单元测试

### 长期改进

1. [ ] 考虑迁移到后端循环（类似 OpenCode）
2. [ ] 添加推理系统
3. [ ] 实现消息压缩
4. [ ] 支持多端同步

---

## 9. 修改记录

### 2026-01-28: 消息格式改造

**问题**: 多轮工具调用时，第二轮 API 调用失败，错误为
`tool result's tool id not found`

**根因**:

1. 使用自定义 XML 格式 (`<invoke>...</invoke>`) 表示工具调用，MiniMax API 不识别
2. 工具调用 ID 可能不匹配
3. 消息过滤逻辑可能遗漏 `<invoke>` 内容

**修改内容**:

| 文件                         | 修改点                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `services/llm.ts`            | `ChatMessage.content` 支持数组格式；`toModelMessages()` 转换为 OpenCode 格式                 |
| `AIChatSessionWithTools.vue` | `Message.content` 支持数组格式；工具调用保存使用 OpenCode 格式；参数解析兼容字符串和对象格式 |

**修改后的消息格式**:

```typescript
// Assistant 消息（包含工具调用）
{
  role: 'assistant',
  content: [
    {
      type: 'tool-call',
      tool_call_id: 'call_function_xxx',
      tool_name: 'execute_ssh_command',
      arguments: { command: 'ls -la' }
    }
  ]
}

// Tool 结果消息
{
  role: 'tool',
  content: 'total 24\n...',
  tool_call_id: 'call_function_xxx'
}
```

**状态**: ✅ 已完成，待测试

---

## 附录: 关键文件索引

| 文件                              | 路径                                                          | 说明               |
| --------------------------------- | ------------------------------------------------------------- | ------------------ |
| OpenCode prompt.ts                | `opencode/packages/opencode/src/session/prompt.ts`            | 后端消息处理主循环 |
| OpenCode processor.ts             | `opencode/packages/opencode/src/session/processor.ts`         | 流式响应处理       |
| OpenCode message-v2.ts            | `opencode/packages/opencode/src/session/message-v2.ts`        | 消息结构定义       |
| 我们的 AIChatSessionWithTools.vue | `apps/desktop/src/components/chat/AIChatSessionWithTools.vue` | 前端消息处理       |
| 我们的 llm.ts                     | `apps/desktop/src/services/llm.ts`                            | LLM 服务封装       |

---

## 参考资料

- OpenCode 消息处理流程: `OPENCODE_SEQUENCE_DIAGRAM.md`
- MiniMax API 文档: 工具调用格式
- Vercel AI SDK: `https://sdk.vercel.ai/docs/reference/ai-sdk-core`
