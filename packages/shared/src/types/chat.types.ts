/**
 * AI 聊天相关类型定义
 */

// 聊天消息角色
export type ChatRole = 'user' | 'assistant' | 'system'

// 聊天消息
export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  timestamp: number
  model?: string
}

// 聊天会话
export interface ChatSession {
  id: string
  title: string
  folderId?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
  lastMessageAt?: Date
  messageCount?: number
  model?: string
}

// 聊天文件夹
export interface ChatFolder {
  id: string
  name: string
  parentId?: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

// 树形节点类型（前端使用）
export interface ChatTreeNode {
  id: string
  name: string
  type: 'folder' | 'session'
  order: number
  children?: ChatTreeNode[]
  // 会话特有属性
  folderId?: string | null
  parentId?: string | null
  lastMessageAt?: Date
  messageCount?: number
  model?: string
}

// 创建文件夹 DTO
export interface CreateChatFolderDto {
  name: string
  parentId?: string | null
  order?: number
}

// 更新文件夹 DTO
export interface UpdateChatFolderDto {
  name?: string
  parentId?: string | null
  order?: number
}

// 创建会话 DTO
export interface CreateChatSessionDto {
  title: string
  folderId?: string | null
  order?: number
  model?: string
}

// 更新会话 DTO
export interface UpdateChatSessionDto {
  title?: string
  folderId?: string | null
  order?: number
  model?: string
}

// 移动节点 DTO
export interface MoveChatNodeDto {
  nodeId: string
  targetFolderId?: string | null
  order?: number
}

// 发送消息 DTO
export interface SendMessageDto {
  sessionId: string
  message: string
  model?: string
}

