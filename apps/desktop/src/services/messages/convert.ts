import type { Message, MessagePart } from './message'
import type { ToolPart, TextPart } from './message'

export type ModelMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content?: string | null
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }>
  tool_call_id?: string
  index?: number
}

let globalSeenToolCallIds = new Set<string>()

const MAX_MODEL_TEXT_LENGTH = 4000
const MAX_TOOL_OUTPUT_LENGTH = 3000

function summarizeForModel(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content
  }

  const headLength = Math.floor(maxLength * 0.65)
  const tailLength = Math.floor(maxLength * 0.25)
  const head = content.slice(0, headLength).trimEnd()
  const tail = content.slice(-tailLength).trimStart()

  return `${head}\n\n...[内容已摘要，省略 ${content.length - head.length - tail.length} 个字符]...\n\n${tail}`
}

function summarizeStructuredOutput(
  content: string,
  tagName: string,
  maxLines: number,
  label: string
): string | null {
  const pattern = new RegExp(`<${tagName}[^>]*>\\n?([\\s\\S]*?)\\n?<\\/${tagName}>`, 'i')
  const match = content.match(pattern)
  if (!match) return null

  const body = match[1].trim()
  const lines = body.split(/\r?\n/).filter(Boolean)
  if (lines.length <= maxLines && body.length <= MAX_TOOL_OUTPUT_LENGTH) {
    return content
  }

  const head = lines.slice(0, maxLines).join('\n')
  const remaining = Math.max(lines.length - maxLines, 0)
  return `<${tagName}>\n${head}\n\n...[${label} 已摘要，省略 ${remaining} 行]...\n</${tagName}>`
}

function summarizeToolOutput(toolName: string, output: string): string {
  if (!output) return output

  if (toolName === 'list_files' || output.includes('<directory_listing')) {
    return (
      summarizeStructuredOutput(output, 'directory_listing', 40, '目录列表') ||
      summarizeForModel(output, 2200)
    )
  }

  if (toolName === 'webfetch' || output.includes('<web_content')) {
    return (
      summarizeStructuredOutput(output, 'web_content', 45, '网页内容') ||
      summarizeForModel(output, 2200)
    )
  }

  if (toolName === 'read_file' || output.includes('<file_content')) {
    return (
      summarizeStructuredOutput(output, 'file_content', 60, '文件内容') ||
      summarizeForModel(output, 2600)
    )
  }

  if (toolName === 'execute_ssh_command' || toolName === 'bash' || output.includes('<command_result')) {
    return (
      summarizeStructuredOutput(output, 'command_result', 50, '命令输出') ||
      summarizeForModel(output, 2400)
    )
  }

  return summarizeForModel(output, MAX_TOOL_OUTPUT_LENGTH)
}

export function resetToModelMessagesCache() {
  globalSeenToolCallIds = new Set<string>()
}

export function fromUserMessage(content: string): Message {
  return {
    info: {
      id: `msg_${Date.now()}`,
      role: 'user',
      createdAt: Date.now()
    },
    parts: [
      {
        type: 'text',
        text: content
      }
    ]
  }
}

export function toModelMessages(msgs: Message[]): ModelMessage[] {
  const result: ModelMessage[] = []
  const seenToolCallIds = new Set<string>()
  let toolIndex = 0

  for (const msg of msgs) {
    if (msg.info.role === 'user') {
      const userContent = msg.parts
        .filter((p): p is TextPart => p.type === 'text')
        .map(p => p.text)
        .join('\n')

      result.push({
        role: 'user',
        content: summarizeForModel(userContent, MAX_MODEL_TEXT_LENGTH)
      })
    }

    if (msg.info.role === 'assistant') {
      const assistantMsg: ModelMessage = {
        role: 'assistant',
        content: null as any
      }

      const toolParts = msg.parts.filter((p): p is ToolPart => p.type === 'tool')

      // 收集所有工具调用（包括已完成和待处理的）
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

      const textParts = msg.parts
        .filter((p): p is TextPart => p.type === 'text')
        .map(p => p.text)
        .join('\n')

      if (textParts) {
        assistantMsg.content = summarizeForModel(textParts, MAX_MODEL_TEXT_LENGTH)
      }

      if (assistantMsg.tool_calls?.length || assistantMsg.content !== null) {
        result.push(assistantMsg)
      }

      // 为已完成的 tool parts 添加 tool 结果消息
      for (const tp of toolParts) {
        if (tp.state.status === 'completed' || tp.state.status === 'error') {
          const toolCallId = tp.callID
          if (!seenToolCallIds.has(toolCallId)) {
            seenToolCallIds.add(toolCallId)
            const output = tp.state.output || tp.state.error || ''
            result.push({
              role: 'tool',
              content: summarizeToolOutput(tp.tool, output),
              tool_call_id: toolCallId,
              index: toolIndex++
            })
          }
        }
      }
    }

    if (msg.info.role === 'tool') {
      const toolPart = msg.parts.find((p): p is ToolPart => p.type === 'tool')
      if (toolPart) {
        const toolCallId = toolPart.callID
        if (!seenToolCallIds.has(toolCallId)) {
          seenToolCallIds.add(toolCallId)
          const output = toolPart.state.output || toolPart.state.error || ''
          result.push({
            role: 'tool',
            content: summarizeToolOutput(toolPart.tool, output),
            tool_call_id: toolCallId,
            index: toolIndex++
          })
        }
      }
    }
  }

  return result
}

export function filterValidMessages(msgs: Message[]): Message[] {
  return msgs.filter(msg => {
    if (msg.info.role === 'user') return true
    if (msg.info.role === 'assistant') {
      // 只要有内容就保留（包括文本和工具调用）
      if (msg.parts.length > 0) return true
      // 如果 finish 不是 unknown，说明是完整的 assistant 消息
      if (msg.info.finish !== 'unknown') return true
      return false
    }
    return true
  })
}

export function updateToolResult(
  msg: Message,
  callID: string,
  result: { output: string }
): Message {
  const now = Date.now()
  return {
    ...msg,
    parts: msg.parts.map((part): MessagePart => {
      if (part.type === 'tool' && part.callID === callID) {
        return {
          ...part,
          state: {
            ...part.state,
            status: 'completed',
            output: result.output,
            time: {
              start: part.state.time?.start ?? now,
              end: now
            }
          }
        }
      }
      return part
    })
  }
}

/**
 * 过滤已压缩的消息
 * 保留未被压缩的消息，用于发送给 LLM
 */
export function filterCompactedMessages(msgs: Message[]): Message[] {
  return msgs.filter(msg => !msg.info.compacted)
}

/**
 * 压缩消息
 * 将多条旧消息合并为一条摘要消息
 * @param msgs 所有消息
 * @param maxMessages 保留的最大消息数（超出部分会被压缩）
 * @returns 压缩后的消息数组
 */
export function compactMessages(msgs: Message[], maxMessages: number = 20): Message[] {
  if (msgs.length <= maxMessages) {
    return msgs
  }

  // 保留最近的消息
  const recentMessages = msgs.slice(-maxMessages)

  // 旧消息需要被压缩
  const oldMessages = msgs.slice(0, -maxMessages)

  if (oldMessages.length === 0) {
    return recentMessages
  }

  // 生成摘要
  const summary = generateMessageSummary(oldMessages)

  // 创建压缩后的系统消息
  const compactedMsg: Message = {
    info: {
      id: `compacted_${Date.now()}`,
      role: 'system',
      createdAt: Date.now(),
      compacted: true,
      summary: summary
    },
    parts: [
      {
        type: 'text',
        text: `[历史对话摘要]\n${summary}`
      }
    ]
  }

  // 返回：压缩消息 + 最近的消息
  return [compactedMsg, ...recentMessages]
}

/**
 * 生成消息摘要
 */
function generateMessageSummary(msgs: Message[]): string {
  const userMsgs = msgs.filter(m => m.info.role === 'user')
  const assistantMsgs = msgs.filter(m => m.info.role === 'assistant')

  let summary = ''

  // 统计用户请求
  if (userMsgs.length > 0) {
    summary += `用户共提出 ${userMsgs.length} 个问题\\n`
    // 显示前3个用户问题
    userMsgs.slice(0, 3).forEach((msg, idx) => {
      const text = msg.parts
        .filter((p): p is TextPart => p.type === 'text')
        .map(p => p.text)
        .join(' ')
        .substring(0, 100)
      summary += `${idx + 1}. ${text}${text.length >= 100 ? '...' : ''}\\n`
    })
    if (userMsgs.length > 3) {
      summary += `... 还有 ${userMsgs.length - 3} 个问题\\n`
    }
  }

  // 统计助手响应
  if (assistantMsgs.length > 0) {
    summary += `\\n助手响应了 ${assistantMsgs.length} 次，执行了以下操作：\\n`

    // 统计工具调用
    const toolCounts: Record<string, number> = {}
    assistantMsgs.forEach(msg => {
      msg.parts.forEach(part => {
        if (part.type === 'tool') {
          toolCounts[part.tool] = (toolCounts[part.tool] || 0) + 1
        }
      })
    })

    Object.entries(toolCounts).forEach(([tool, count]) => {
      summary += `- ${tool}: ${count} 次\\n`
    })
  }

  return summarizeForModel(summary || '无详细历史记录', 2000)
}
