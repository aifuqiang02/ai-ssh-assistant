# 工具调用修复总结

> 日期: 2026-01-28状态: ✅ 已完成

## 问题描述

多轮工具调用时，第二轮 API 调用失败：

```
HTTP 400: invalid params, tool result's tool id(call_function_xxx) not found
```

## 根因分析

### OpenAI/MiniMax API 期望的消息格式

**工具调用消息**:

```typescript
{
  role: 'assistant',
  content: '',  // 可以为空
  tool_calls: [
    {
      id: 'call_function_xxx',
      type: 'function',
      function: {
        name: 'execute_ssh_command',
        arguments: '{"command":"uptime"}'
      }
    }
  ]
}
```

**工具结果消息**:

```typescript
{
  role: 'tool',
  content: '22:24:22 up 54 days...',
  tool_call_id: 'call_function_xxx'  // 必须与 tool_calls[].id 匹配
}
```

### 多轮对话消息顺序

```
[
  { role: 'system', content: '...' },
  { role: 'user', content: '查看服务器信息' },
  // 第一轮
  { role: 'assistant', tool_calls: [...] },
  { role: 'tool', tool_call_id: '...', content: '...' },
  // 第二轮（必须先有 assistant，再有 tool）
  { role: 'assistant', tool_calls: [...] },
  { role: 'tool', tool_call_id: '...', content: '...' },
  { role: 'user', content: '接下来...' }
]
```

## 修改的文件

### 1. services/llm.ts

**修改 1.1**: ChatMessage 接口添加 tool_calls 字段

```typescript
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

**修改 1.2**: toModelMessages 正确转换 tool_calls

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
      // 转换为 MiniMax/OpenAI 格式
      const openaiToolCalls = msg.tool_calls.map(tc => ({
        id: tc.id,
        type: 'function',
        function: {
          name: tc.function.name,
          arguments: typeof tc.function.arguments === 'string'
            ? tc.function.arguments
            : JSON.stringify(tc.function.arguments)
        }
      }))

      return {
        role: 'assistant',
        content: '',  // content 置空
        tool_calls: openaiToolCalls
      }
    }

    return {
      role: msg.role,
      content: msg.content
    }
  })
}
```

### 2. components/chat/AIChatSessionWithTools.vue

**修改 2.1**: Message 接口支持数组格式

```typescript
interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string | Array<{ type: string; [key: string]: any }>
  // ...
  toolUse?: { name: string; params: Record<string, any> }
  toolResult?: { success: boolean; content: string; toolCallId: string }
}
```

**修改 2.2**: 多轮消息构建逻辑

```typescript
// 如果是 assistant 消息且已有 toolResult
if (msg.role === 'assistant' && msg.toolResult) {
  const toolCallId = msg.toolResult.toolCallId || `result-${msg.id}`

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

**修改 2.3**: 工具调用保存使用 OpenCode 格式

```typescript
// 保存工具调用信息
assistantMessage.toolUse = {
  name: toolCall.name,
  params: args
}

// 保存工具结果
assistantMessage.toolResult = {
  success: true,
  content: result.output,
  toolCallId: toolCall.callId
}

// 添加工具调用到消息历史（使用 OpenCode 格式）
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

apiMessages.push({
  role: 'tool',
  content: result.output,
  tool_call_id: toolCall.callId
})
```

**修改 2.4**: 参数解析兼容字符串和对象格式

```typescript
const rawInput = toolCall.input

if (typeof rawInput === 'string') {
  // 兼容旧的字符串格式
  let cleanInput = rawInput
    .replace(/<invoke>[\s\S]*?<\/invoke>/gi, '')
    .replace(/\n/g, ' ')
    .trim()
  // ...
} else if (typeof rawInput === 'object' && rawInput !== null) {
  // 新的对象格式
  args = rawInput
}
```

**修改 2.5**: 日志输出处理两种类型

```typescript
const contentStr =
  typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
```

## 测试验证

### 验证命令

```bash
pnpm --filter @ai-ssh/desktop dev
```

### 测试步骤

1. 发送: "查看服务器运行情况"
2. 第一轮应该正常执行工具调用
3. 发送: "接下来查看 docker"
4. 第二轮应该正常执行工具调用

### 预期日志

```
✅ 第一轮:
[Chat] 🔄 开始第 1 轮对话
[LLM] 收到 tool_calls: [{"id":"call_function_xxx_1",...}]
[Chat] 收集工具调用: execute_ssh_command call_function_xxx_1
[Chat] 执行工具: ...
[Chat] 保存工具结果: call_function_xxx_1
[Chat] 工具结果已添加到消息历史
[Chat] ⚑ 设置 streaming=false

✅ 第二轮:
[Chat] 🔄 开始第 2 轮对话
[Chat] ===== 最终发送给 API 的消息 =====
[Chat] 消息 #0: role=system
[Chat] 消息 #1: role=assistant, 包含工具调用=true (has tool_calls)
[Chat] 消息 #2: role=tool, tool_call_id=call_function_xxx_1
[Chat] 消息 #3: role=user
[LLM] 消息 #2: role=assistant, preview=[tool_calls: 1] (has tool_calls)
[LLM] 收到 tool_calls: ...
```

## 相关文档

- `OPENCODE_SEQUENCE_DIAGRAM.md` - OpenCode 完整消息处理时序图
- `OPENCODE_VS_OURS_COMPARISON.md` - OpenCode vs AI-SSH-Assistant 流程对比
- `OPENCODE_TOOL_CALLS_COMPARISON.md` - 工具调用消息格式详细对比
