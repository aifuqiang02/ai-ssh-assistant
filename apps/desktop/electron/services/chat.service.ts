/**
 * Chat 本地业务逻辑
 * 使用 SQLite 存储数据
 */

import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { nanoid } from 'nanoid'

export interface ChatSession {
  id: string
  userId: string
  title: string
  folderId?: string
  model?: string
  createdAt: number
  updatedAt: number
}

export interface ChatMessage {
  id: string
  sessionId: string
  userId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number
}

export interface CreateSessionDto {
  title: string
  folderId?: string
  model?: string
}

export interface UpdateSessionDto {
  title?: string
  folderId?: string
  model?: string
}

export class ChatLocalService {
  private db: Database.Database

  constructor() {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'chat.db')
    
    this.db = new Database(dbPath)
    
    // 性能优化
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('synchronous = NORMAL')
    
    // 初始化表
    this.initTables()
  }

  private initTables() {
    this.db.exec(`
      -- 会话表
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        folderId TEXT,
        model TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_sessions_user 
        ON chat_sessions(userId);
      
      CREATE INDEX IF NOT EXISTS idx_sessions_folder 
        ON chat_sessions(folderId);
      
      -- 消息表
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        userId TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (sessionId) REFERENCES chat_sessions(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_messages_session 
        ON chat_messages(sessionId);
      
      CREATE INDEX IF NOT EXISTS idx_messages_user 
        ON chat_messages(userId);
    `)
  }

  // ============= 会话管理 =============
  
  createSession(userId: string, data: CreateSessionDto): ChatSession {
    const now = Date.now()
    const session: ChatSession = {
      id: nanoid(),
      userId,
      title: data.title,
      folderId: data.folderId,
      model: data.model,
      createdAt: now,
      updatedAt: now
    }
    
    const stmt = this.db.prepare(`
      INSERT INTO chat_sessions (id, userId, title, folderId, model, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      session.id,
      session.userId,
      session.title,
      session.folderId || null,
      session.model || null,
      session.createdAt,
      session.updatedAt
    )
    
    console.log(`[ChatLocalService] Created session: ${session.id}`)
    return session
  }
  
  getSession(userId: string, sessionId: string): ChatSession | null {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions 
      WHERE id = ? AND userId = ?
    `)
    
    const row = stmt.get(sessionId, userId) as ChatSession | undefined
    return row || null
  }
  
  getSessions(userId: string): ChatSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions 
      WHERE userId = ? 
      ORDER BY updatedAt DESC
    `)
    
    return stmt.all(userId) as ChatSession[]
  }
  
  updateSession(userId: string, sessionId: string, data: UpdateSessionDto): ChatSession {
    const existing = this.getSession(userId, sessionId)
    if (!existing) {
      throw new Error('Session not found')
    }
    
    const updates: string[] = []
    const values: any[] = []
    
    if (data.title !== undefined) {
      updates.push('title = ?')
      values.push(data.title)
    }
    
    if (data.folderId !== undefined) {
      updates.push('folderId = ?')
      values.push(data.folderId)
    }
    
    if (data.model !== undefined) {
      updates.push('model = ?')
      values.push(data.model)
    }
    
    updates.push('updatedAt = ?')
    values.push(Date.now())
    
    values.push(sessionId, userId)
    
    const stmt = this.db.prepare(`
      UPDATE chat_sessions 
      SET ${updates.join(', ')}
      WHERE id = ? AND userId = ?
    `)
    
    stmt.run(...values)
    
    console.log(`[ChatLocalService] Updated session: ${sessionId}`)
    return this.getSession(userId, sessionId)!
  }
  
  deleteSession(userId: string, sessionId: string): void {
    const stmt = this.db.prepare(`
      DELETE FROM chat_sessions 
      WHERE id = ? AND userId = ?
    `)
    
    const result = stmt.run(sessionId, userId)
    
    if (result.changes === 0) {
      throw new Error('Session not found')
    }
    
    console.log(`[ChatLocalService] Deleted session: ${sessionId}`)
  }
  
  // ============= 消息管理 =============
  
  sendMessage(userId: string, sessionId: string, content: string): ChatMessage {
    const message: ChatMessage = {
      id: nanoid(),
      sessionId,
      userId,
      role: 'user',
      content,
      createdAt: Date.now()
    }
    
    const stmt = this.db.prepare(`
      INSERT INTO chat_messages (id, sessionId, userId, role, content, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      message.id,
      message.sessionId,
      message.userId,
      message.role,
      message.content,
      message.createdAt
    )
    
    // 更新会话的 updatedAt
    this.db.prepare(`
      UPDATE chat_sessions 
      SET updatedAt = ? 
      WHERE id = ?
    `).run(Date.now(), sessionId)
    
    console.log(`[ChatLocalService] Created message: ${message.id}`)
    return message
  }
  
  getMessages(userId: string, sessionId: string): ChatMessage[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_messages 
      WHERE sessionId = ? AND userId = ? 
      ORDER BY createdAt ASC
    `)
    
    return stmt.all(sessionId, userId) as ChatMessage[]
  }
  
  deleteMessage(userId: string, messageId: string): void {
    const stmt = this.db.prepare(`
      DELETE FROM chat_messages 
      WHERE id = ? AND userId = ?
    `)
    
    const result = stmt.run(messageId, userId)
    
    if (result.changes === 0) {
      throw new Error('Message not found')
    }
    
    console.log(`[ChatLocalService] Deleted message: ${messageId}`)
  }
  
  // ============= 工具方法 =============
  
  close() {
    this.db.close()
  }
}

// 单例模式
let instance: ChatLocalService | null = null

export function getChatLocalService(): ChatLocalService {
  if (!instance) {
    instance = new ChatLocalService()
  }
  return instance
}

