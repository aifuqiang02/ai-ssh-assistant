/**
 * Chat 服务 - 统一接口
 * 支持本地存储和远程 API 两种实现方式
 */

import type { ChatSession, ChatMessage, ChatTreeNode, CreateChatFolderDto, CreateChatSessionDto, UpdateChatFolderDto, UpdateChatSessionDto, MoveChatNodeDto } from '@ai-ssh/shared'
import { createService } from './base/service-factory'
import { BaseApiImpl, BaseLocalImpl } from './base/base-api-impl'

// ============= 接口定义 =============
export interface IChatService {
  // 树形结构
  getChatTree(): Promise<ChatTreeNode[]>
  
  // 文件夹管理
  createFolder(data: CreateChatFolderDto): Promise<any>
  updateFolder(id: string, data: UpdateChatFolderDto): Promise<any>
  deleteFolder(id: string): Promise<void>
  
  // 会话管理
  createSession(data: CreateChatSessionDto): Promise<any>
  getSession(sessionId: string): Promise<ChatSession | null>
  getSessions(): Promise<ChatSession[]>
  updateSession(id: string, data: UpdateChatSessionDto): Promise<any>
  deleteSession(id: string): Promise<void>
  
  // 节点移动
  moveNode(data: MoveChatNodeDto): Promise<void>
  
  // 消息管理
  sendMessage(sessionId: string, content: string): Promise<ChatMessage>
  getMessages(sessionId: string): Promise<ChatMessage[]>
  deleteMessage(messageId: string): Promise<void>
}

// ============= 远程 API 实现 =============
class ChatApiImpl extends BaseApiImpl implements IChatService {
  // 树形结构
  async getChatTree(): Promise<ChatTreeNode[]> {
    return this.get('/chat/tree')
  }
  
  // 文件夹管理
  async createFolder(data: CreateChatFolderDto): Promise<any> {
    return this.post('/chat/folders', data)
  }
  
  async updateFolder(id: string, data: UpdateChatFolderDto): Promise<any> {
    return this.put(`/chat/folders/${id}`, data)
  }
  
  async deleteFolder(id: string): Promise<void> {
    await this.delete(`/chat/folders/${id}`)
  }
  
  // 会话管理
  async createSession(data: CreateChatSessionDto): Promise<any> {
    return this.post('/chat/sessions', data)
  }
  
  async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      return await this.get(`/chat/sessions/${sessionId}`)
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null
      }
      throw error
    }
  }
  
  async getSessions(): Promise<ChatSession[]> {
    return this.get('/chat/sessions')
  }
  
  async updateSession(id: string, data: UpdateChatSessionDto): Promise<any> {
    return this.put(`/chat/sessions/${id}`, data)
  }
  
  async deleteSession(id: string): Promise<void> {
    await this.delete(`/chat/sessions/${id}`)
  }
  
  // 节点移动
  async moveNode(data: MoveChatNodeDto): Promise<void> {
    await this.put('/chat/move', data)
  }
  
  // 消息管理
  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    return this.post('/chat/messages', { sessionId, content })
  }
  
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.get('/chat/messages', { sessionId })
  }
  
  async deleteMessage(messageId: string): Promise<void> {
    await this.delete(`/chat/messages/${messageId}`)
  }
}

// ============= 本地 IPC 实现 =============
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  // 树形结构
  async getChatTree(): Promise<ChatTreeNode[]> {
    // TODO: 实现本地 IPC 调用
    return this.electronAPI.chat.getChatTree?.(this.getUserId()) || []
  }
  
  // 文件夹管理
  async createFolder(data: CreateChatFolderDto): Promise<any> {
    // TODO: 实现本地 IPC 调用
    return this.electronAPI.chat.createFolder?.(this.getUserId(), data)
  }
  
  async updateFolder(id: string, data: UpdateChatFolderDto): Promise<any> {
    // TODO: 实现本地 IPC 调用
    return this.electronAPI.chat.updateFolder?.(this.getUserId(), id, data)
  }
  
  async deleteFolder(id: string): Promise<void> {
    // TODO: 实现本地 IPC 调用
    return this.electronAPI.chat.deleteFolder?.(this.getUserId(), id)
  }
  
  // 会话管理
  async createSession(data: CreateChatSessionDto): Promise<any> {
    return this.electronAPI.chat.createSession(this.getUserId(), data)
  }
  
  async getSession(sessionId: string): Promise<ChatSession | null> {
    return this.electronAPI.chat.getSession(this.getUserId(), sessionId)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    return this.electronAPI.chat.getSessions(this.getUserId())
  }
  
  async updateSession(id: string, data: UpdateChatSessionDto): Promise<any> {
    return this.electronAPI.chat.updateSession(this.getUserId(), id, data)
  }
  
  async deleteSession(id: string): Promise<void> {
    return this.electronAPI.chat.deleteSession(this.getUserId(), id)
  }
  
  // 节点移动
  async moveNode(data: MoveChatNodeDto): Promise<void> {
    // TODO: 实现本地 IPC 调用
    return this.electronAPI.chat.moveNode?.(this.getUserId(), data)
  }
  
  // 消息管理
  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    return this.electronAPI.chat.sendMessage(this.getUserId(), sessionId, content)
  }
  
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.electronAPI.chat.getMessages(this.getUserId(), sessionId)
  }
  
  async deleteMessage(messageId: string): Promise<void> {
    return this.electronAPI.chat.deleteMessage(this.getUserId(), messageId)
  }
}

// ============= 默认导出 =============
export const chatService = createService<IChatService>(
  'ChatService',
  ChatLocalImpl,
  ChatApiImpl
)

