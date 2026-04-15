# OpenCode vs AI-SSH-Assistant 工具调用消息格式对比

> 生成日期:
> 2026-01-28 目的: 系统对比 OpenCode 和我们的消息格式差异，确保所有逻辑一致

---

## 目录

- [核心差异概览](#核心差异概览)
- [OpenCode 消息格式](#opencode-消息格式)
- [我们当前的实现](#我们当前的实现)
- [问题清单](#问题清单)
- [修复计划](#修复计划)
- [修改记录](#修改记录)

---

## 核心差异概览

| 方面         | OpenCode                                | AI-SSH-Assistant         | 状态        |
| ------------ | --------------------------------------- | ------------------------ | ----------- |
| 消息转换     | 使用 `ai` 包的 `convertToModelMessages` | 自定义 `toModelMessages` | ❌ 需要对齐 |
| 工具调用格式 | `tool_calls` 数组                       | 部分正确                 | ✅ 已修复   |
| 工具结果格式 | `role: 'tool'` + `tool_call_id`         | 部分正确                 | ✅ 已修复   |
| 多轮消息顺序 | assistant → tool                        | 只发 tool                | ❌ 需要修复 |
| 消息历史管理 | `MessageV2` 系统                        | 前端状态                 | 不需要改    |
| 内容过滤     | 后端自动处理                            | 前端手动处理             | 不需要改    |

---

## OpenCode 消息格式

### 1. 工具调用消息 (Assistant)

OpenCode 使用 Vercel AI SDK 的 `convertToModelMessages` 函数，格式如下：

```typescript
// Assistant 消息，包含工具调用
{
  role: 'assistant',
  content: null,  // 或文本内容
  tool_calls: [
    {
      id: 'call_abc123',
      type: 'function',
      function: {
        name: 'execute_ssh_command',
        arguments: '{"command":"uptime"}'
      }
    }
  ]
}
```

**关键点**:

- `content` 可以是 `null` 或空字符串
- 工具调用在独立的 `tool_calls` 字段中
- `tool_calls` 是一个数组，支持多个工具调用

### 2. 工具结果消息 (Tool)

```typescript
// Tool 结果消息
{
  role: 'tool',
  content: '22:24:22 up 54 days, 15:11, 2 users, load average: 0.17, 0.06, 0.01',
  tool_call_id: 'call_abc123'  // 必须与 tool_calls 中的 id 对应
}
```

**关键点**:

- `role` 必须是 `'tool'`
- `tool_call_id` 必须与 `assistant` 消息中 `tool_calls[].id` 完全匹配

### 3. 多轮对话消息顺序

**正确的消息顺序**:

```typescript
[
  { role: 'system', content: '...' },
  { role: 'user', content: '查看服务器信息' },
  // 第一轮
  { role: 'assistant', content: '', tool_calls: [...] },
  { role: 'tool', content: '...', tool_call_id: '...' },
  // 第二轮
  { role: 'assistant', content: '', tool_calls: [...] },
  { role: 'tool', content: '...', tool_call_id: '...' },
  { role: 'user', content: '接下来...' }
]
```

**关键点**:

1. 每轮工具调用必须有对应的 `assistant` 消息（带 `tool_calls`）
2. `tool` 消息必须在对应的 `assistant` 消息之后
3. `tool` 消息的 `tool_call_id` 必须与 `assistant.tool_calls[].id` 匹配

### 4. OpenCode 内部消息结构

OpenCode 使用 `MessageV2` 系统管理消息：

```typescript
interface MessageV2 {
  info: {
    id: string
    role: 'user' | 'assistant'
    parentID: string
    finish?: 'stop' | 'tool-calls' | 'unknown'
  }
  parts: Array<{
    type: 'text' | 'tool' | 'reasoning'
    tool?: string
    callID?: string
    state?: {
      status: 'pending' | 'running' | 'completed' | 'error'
      input?: Record<string, any>
      output?: string
    }
  }>
}
```

**转换为 LLM 消息的流程**:

1. `MessageV2.parts` 提取消息的所有部分
2. `toModelMessage` 将 `MessageV2` 转换为 `UIMessage`
3. `convertToModelMessages` (from `ai` package) 将 `UIMessage` 转换为
   `ModelMessage`

---

## 我们当前的实现

### 1. ChatMessage 接口

```typescript
// apps/desktop/src/services/llm.ts
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
```

### 2. toModelMessages 转换

```typescript
private toModelMessages(messages: ChatMessage[]): any[] {
  return messages.map(msg => {
    if (msg.role === 'tool') {
      return {
        role: 'tool',
        content: msg.content,
        tool_call_id: msg.tool_call_id
      }
    }

    if (msg.role === 'assistant' && msg.tool_calls) {
      return {
        role: 'assistant',
        content: msg.content || '',
        tool_calls: msg.tool_calls
      }
    }

    return {
      role: msg.role,
      content: msg.content
    }
  })
}
```

### 3. 消息构建逻辑 (AIChatSessionWithTools.vue)

```typescript
// 构建 API 消息
for (const msg of messages.value) {
  if (msg.role === 'assistant' && msg.toolResult) {
    // ❌ 问题：只发送了 tool 消息，没有发送 assistant 消息
    apiMessages.push({
      role: 'tool',
      content: msg.toolResult.content,
      tool_call_id: toolCallId
    })
    continue
  }
}
```

---

## 问题清单

### 问题 1: 多轮对话只发送 Tool 消息

**位置**: `AIChatSessionWithTools.vue:1254-1267`

**问题描述**: 第二轮对话时，只发送了 `tool` 消息，没有发送对应的 `assistant`
消息（包含 `tool_calls`）。

**当前代码**:

```typescript
if (msg.role === 'assistant' && msg.toolResult) {
  apiMessages.push({
    role: 'tool',
    content: msg.toolResult.content,
    tool_call_id: toolCallId
  })
  continue // 只发送了 tool，没有 assistant
}
```

**正确代码**:

```typescript
if (msg.role === 'assistant' && msg.toolResult) {
  // 1. 先发送 assistant 消息（包含 tool_calls）
  apiMessages.push({
    role: 'assistant',
    content: '',
    tool_calls: [
      {
        id: toolCallId,
        type: 'function',
        function: {
          name: msg.toolUse?.name || 'execute_ssh_command',
          arguments: JSON.stringify(msg.toolUse?.params || {})
        }
      }
    ]
  })

  // 2. 再发送 tool 结果
  apiMessages.push({
    role: 'tool',
    content: msg.toolResult.content,
    tool_call_id: toolCallId
  })
  continue
}
```

**状态**: ✅ 已修复

### 问题 2: tool_calls 字段类型不完整

**位置**: `services/llm.ts`

**状态**: ✅ 已修复

### 问题 3: 消息日志输出需要调整

**位置**: `llm.ts:337-346`

**状态**: ✅ 已修复

---

## 修改记录

### 2026-01-28 修改

| 文件                         | 修改点           | 修改内容                      |
| ---------------------------- | ---------------- | ----------------------------- |
| `services/llm.ts`            | ChatMessage 接口 | 添加 `tool_calls` 字段        |
| `services/llm.ts`            | toModelMessages  | 转换时包含 `tool_calls` 字段  |
| `AIChatSessionWithTools.vue` | Message 接口     | `content` 支持数组格式        |
| `AIChatSessionWithTools.vue` | 工具调用保存     | 使用 OpenCode 格式            |
| `AIChatSessionWithTools.vue` | 多轮消息构建     | 先发送 assistant，再发送 tool |

---

## 修复计划

### 阶段 1: 基础修复 ✅

- [x] ChatMessage 接口支持 tool_calls
- [x] toModelMessages 正确转换 tool_calls
- [x] 多轮对话消息顺序正确

### 阶段 2: 验证测试 ⏳

- [ ] 第一轮工具调用正常执行
- [ ] 第二轮工具调用正常执行
- [ ] 日志输出格式正确

### 阶段 3: 优化完善 ⏳

- [ ] 添加更多调试日志
- [ ] 错误处理优化
- [ ] 代码注释完善

---

## 调试建议

### 查看最终发送的消息

在控制台查看 `[Chat] ===== 最终发送给 API 的消息 =====` 部分，确认消息格式正确：

```
✅ 正确格式:
消息 #0: role=system, content="..."
消息 #1: role=tool, tool_call_id=call_xxx, content 长度=xxx
消息 #2: role=user, content="..."

❌ 错误格式（第二轮）:
消息 #0: role=system, content="..."
消息 #1: role=tool, tool_call_id=call_xxx, content 长度=xxx  // 缺少 assistant 消息
消息 #2: role=user, content="..."
```

### 查看 toModelMessages 输出

在控制台查看 `[LLM] 转换后的消息 JSON:` 部分，确认转换正确：

```
✅ 正确格式:
[0] role=system, preview=...
[1] role=tool, preview=...
[2] role=assistant, preview=[tool_calls: 1] (has tool_calls)

❌ 错误格式:
[0] role=system, preview=...
[1] role=tool, preview=...
[2] role=user, preview=...  // 缺少 assistant 消息
```

---

## 参考资料

- OpenCode message-v2.ts: `opencode/packages/opencode/src/session/message-v2.ts`
- OpenCode processor.ts: `opencode/packages/opencode/src/session/processor.ts`
- OpenCode prompt.ts: `opencode/packages/opencode/src/session/prompt.ts`
- Vercel AI SDK: `https://sdk.vercel.ai/docs/reference/ai-sdk-core`
