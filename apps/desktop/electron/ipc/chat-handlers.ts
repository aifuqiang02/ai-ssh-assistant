/**
 * Chat IPC Handlers
 * 连接渲染进程和本地业务逻辑
 */

import { ipcMain } from 'electron'
import { getChatLocalService } from '../services/chat.service'

// ✅ 立即执行，静态注册（Electron 打包兼容）
const chatService = getChatLocalService()

// 获取聊天树
ipcMain.handle('chat:get-chat-tree', async (event, userId: string) => {
  try {
    console.log('[IPC] chat:get-chat-tree', { userId })
    return chatService.getChatTree(userId)
  } catch (error) {
    console.error('[IPC] chat:get-chat-tree error:', error)
    throw error
  }
})

// 创建文件夹
ipcMain.handle('chat:create-folder', async (event, userId: string, data: any) => {
  try {
    console.log('[IPC] chat:create-folder', { userId, data })
    return chatService.createFolder(userId, data)
  } catch (error) {
    console.error('[IPC] chat:create-folder error:', error)
    throw error
  }
})

// 更新文件夹
ipcMain.handle('chat:update-folder', async (event, userId: string, folderId: string, data: any) => {
  try {
    console.log('[IPC] chat:update-folder', { userId, folderId, data })
    return chatService.updateFolder(userId, folderId, data)
  } catch (error) {
    console.error('[IPC] chat:update-folder error:', error)
    throw error
  }
})

// 删除文件夹
ipcMain.handle('chat:delete-folder', async (event, userId: string, folderId: string) => {
  try {
    console.log('[IPC] chat:delete-folder', { userId, folderId })
    return chatService.deleteFolder(userId, folderId)
  } catch (error) {
    console.error('[IPC] chat:delete-folder error:', error)
    throw error
  }
})

// 移动节点
ipcMain.handle('chat:move-node', async (event, userId: string, data: any) => {
  try {
    console.log('[IPC] chat:move-node', { userId, data })
    return chatService.moveNode(userId, data.nodeId, data.targetFolderId, data.order || 0)
  } catch (error) {
    console.error('[IPC] chat:move-node error:', error)
    throw error
  }
})

// 创建会话
ipcMain.handle('chat:create-session', async (event, userId: string, data: any) => {
  try {
    console.log('[IPC] chat:create-session', { userId, data })
    return chatService.createSession(userId, data)
  } catch (error) {
    console.error('[IPC] chat:create-session error:', error)
    throw error
  }
})

// 获取单个会话
ipcMain.handle('chat:get-session', async (event, userId: string, sessionId: string) => {
  try {
    console.log('[IPC] chat:get-session', { userId, sessionId })
    return chatService.getSession(userId, sessionId)
  } catch (error) {
    console.error('[IPC] chat:get-session error:', error)
    throw error
  }
})

// 获取会话列表
ipcMain.handle('chat:get-sessions', async (event, userId: string) => {
  try {
    console.log('[IPC] chat:get-sessions', { userId })
    return chatService.getSessions(userId)
  } catch (error) {
    console.error('[IPC] chat:get-sessions error:', error)
    throw error
  }
})

// 更新会话
ipcMain.handle(
  'chat:update-session',
  async (event, userId: string, sessionId: string, data: any) => {
    try {
      console.log('[IPC] chat:update-session', { userId, sessionId, data })
      return chatService.updateSession(userId, sessionId, data)
    } catch (error) {
      console.error('[IPC] chat:update-session error:', error)
      throw error
    }
  }
)

// 删除会话
ipcMain.handle('chat:delete-session', async (event, userId: string, sessionId: string) => {
  try {
    console.log('[IPC] chat:delete-session', { userId, sessionId })
    return chatService.deleteSession(userId, sessionId)
  } catch (error) {
    console.error('[IPC] chat:delete-session error:', error)
    throw error
  }
})

// 发送消息
ipcMain.handle(
  'chat:send-message',
  async (event, userId: string, sessionId: string, content: string) => {
    try {
      console.log('[IPC] chat:send-message', { userId, sessionId, contentLength: content.length })
      return chatService.sendMessage(userId, sessionId, content)
    } catch (error) {
      console.error('[IPC] chat:send-message error:', error)
      throw error
    }
  }
)

// 获取消息列表
ipcMain.handle('chat:get-messages', async (event, userId: string, sessionId: string) => {
  try {
    console.log('[IPC] chat:get-messages', { userId, sessionId })
    return chatService.getMessages(userId, sessionId)
  } catch (error) {
    console.error('[IPC] chat:get-messages error:', error)
    throw error
  }
})

// 删除消息
ipcMain.handle('chat:delete-message', async (event, userId: string, messageId: string) => {
  try {
    console.log('[IPC] chat:delete-message', { userId, messageId })
    return chatService.deleteMessage(userId, messageId)
  } catch (error) {
    console.error('[IPC] chat:delete-message error:', error)
    throw error
  }
})

console.log('[IPC] ✅ Chat handlers registered (static)')
