// apps/desktop/src/services/messages/message.ts

import type { ChatMessage } from '../llm'

// 消息角色
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

// 工具调用状态
export type ToolState = 'pending' | 'running' | 'completed' | 'error' | 'aborted'

// 消息元数据
export interface MessageInfo {
  id: string
  role: MessageRole
  parentID?: string
  sessionID?: string
  finish?: 'stop' | 'tool-calls' | 'unknown'
  createdAt: number
  agent?: string
  model?: {
    providerID: string
    modelID: string
  }
  compacted?: boolean // 是否已被压缩
  summary?: string // 压缩后的摘要
}

// 文本部分
export type AssistantTextKind = 'analysis' | 'summary'

export interface TextPart {
  type: 'text'
  text: string
  ignored?: boolean
  kind?: AssistantTextKind
}

export type ToolDisplayKind = 'tool' | 'inquiry'

// 工具部分
export interface ToolPart {
  type: 'tool'
  tool: string
  callID: string
  displayKind?: ToolDisplayKind
  state: {
    status: ToolState
    input?: Record<string, any>
    output?: string
    error?: string
    raw?: string
    time?: {
      start: number
      end?: number
    }
    metadata?: Record<string, any>
    title?: string
    attachments?: Array<{
      url: string
      mime: string
      filename: string
    }>
  }
  metadata?: Record<string, any>
}

// 推理部分
export interface ReasoningPart {
  type: 'reasoning'
  text: string
  time?: {
    start: number
    end?: number
  }
  metadata?: Record<string, any>
}

// 消息部分联合类型
export type MessagePart = TextPart | ToolPart | ReasoningPart

// 完整消息
export interface Message {
  info: MessageInfo
  parts: MessagePart[]
}

// 创建用户消息
export function createUserMessage(id: string, content: string, sessionID?: string): Message {
  return {
    info: {
      id,
      role: 'user',
      sessionID,
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

// 创建助手消息
export function createAssistantMessage(
  id: string,
  parentID: string,
  sessionID?: string,
  agent?: string
): Message {
  return {
    info: {
      id,
      role: 'assistant',
      parentID,
      sessionID,
      agent,
      finish: 'unknown' as const,
      createdAt: Date.now()
    },
    parts: []
  }
}

// 创建工具调用部分
export function createToolPart(tool: string, callID: string): ToolPart {
  return {
    type: 'tool',
    tool,
    callID,
    state: {
      status: 'pending',
      input: {},
      raw: ''
    }
  }
}

// 更新工具部分状态
export function updateToolState(part: ToolPart, updates: Partial<ToolPart['state']>): ToolPart {
  return {
    ...part,
    state: {
      ...part.state,
      ...updates,
      time: part.state.time
        ? {
            ...part.state.time,
            ...(updates.time || {})
          }
        : updates.time
    }
  }
}
