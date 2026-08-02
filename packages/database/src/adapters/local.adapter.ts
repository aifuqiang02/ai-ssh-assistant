/**
 * 本地存储适配器
 * 基于 better-sqlite3 的 SQLite 实现
 */

import Database from 'better-sqlite3'
import { dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { BaseStorageAdapter, StorageOptions, SyncResult } from './base.adapter'

export class LocalStorageAdapter extends BaseStorageAdapter {
  private db: Database.Database

  constructor(options: StorageOptions = {}) {
    super(options)

    const dbPath = options.connectionString || process.env.LOCAL_DATABASE_URL || 'file:./local.db'

    const dbDir = dirname(dbPath.replace('file:', ''))
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
    }

    this.db = new Database(dbPath.replace('file:', ''))
    this.db.pragma('journal_mode = WAL')
  }

  get type(): 'local' {
    return 'local'
  }

  async connect(): Promise<void> {
    try {
      console.log('🔌 正在连接本地数据库...')
      await this.initializeDatabase()
      this.isConnected = true
      console.log('✅ Local database connected')
    } catch (error) {
      console.error('❌ Failed to connect to local database:', error)
      throw error
    }
  }

  private async initializeDatabase(): Promise<void> {
    console.log('🔎 检查并确保所有必需的表存在（幂等创建）...')

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        uuid TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        password TEXT,
        avatar TEXT,
        role TEXT DEFAULT 'USER' NOT NULL,
        isActive INTEGER DEFAULT 1 NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        settings TEXT
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id TEXT PRIMARY KEY,
        userId TEXT UNIQUE NOT NULL,
        data TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ssh_folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        userId TEXT NOT NULL,
        parentId TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parentId) REFERENCES ssh_folders(id) ON DELETE CASCADE
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ssh_connections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        host TEXT NOT NULL,
        port INTEGER DEFAULT 22 NOT NULL,
        username TEXT NOT NULL,
        authType TEXT NOT NULL,
        password TEXT,
        privateKey TEXT,
        publicKey TEXT,
        passphrase TEXT,
        status TEXT DEFAULT 'DISCONNECTED' NOT NULL,
        lastUsed DATETIME,
        isActive INTEGER DEFAULT 1 NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        meta TEXT,
        userId TEXT NOT NULL,
        folderId TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (folderId) REFERENCES ssh_folders(id) ON DELETE SET NULL
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chat_folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        userId TEXT NOT NULL,
        parentId TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parentId) REFERENCES chat_folders(id) ON DELETE CASCADE
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT DEFAULT 'CHAT' NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        config TEXT,
        meta TEXT,
        summary TEXT,
        last_summary_at DATETIME,
        summarized_message_count INTEGER DEFAULT 0,
        userId TEXT NOT NULL,
        sshConnectionId TEXT,
        folderId TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (sshConnectionId) REFERENCES ssh_connections(id),
        FOREIGN KEY (folderId) REFERENCES chat_folders(id) ON DELETE SET NULL
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        role TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        meta TEXT,
        extra TEXT,
        isDeleted INTEGER DEFAULT 0 NOT NULL,
        isEdited INTEGER DEFAULT 0 NOT NULL,
        translate TEXT,
        tts TEXT,
        sessionId TEXT NOT NULL,
        userId TEXT NOT NULL,
        FOREIGN KEY (sessionId) REFERENCES chat_sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS command_logs (
        id TEXT PRIMARY KEY,
        command TEXT NOT NULL,
        output TEXT,
        exitCode INTEGER,
        duration INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        safetyLevel TEXT DEFAULT 'SAFE' NOT NULL,
        metadata TEXT,
        userId TEXT NOT NULL,
        sshConnectionId TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (sshConnectionId) REFERENCES ssh_connections(id)
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS document_folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        parent_id TEXT,
        user_id TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES document_folders(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS document_files (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        content TEXT,
        language TEXT,
        folder_id TEXT,
        user_id TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        size INTEGER,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        is_starred INTEGER NOT NULL DEFAULT 0,
        open_count INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        last_opened_at DATETIME,
        FOREIGN KEY (folder_id) REFERENCES document_folders(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS document_edit_history (
        id TEXT PRIMARY KEY,
        file_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        prompt TEXT NOT NULL,
        original_content TEXT NOT NULL,
        modified_content TEXT NOT NULL,
        diff TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (file_id) REFERENCES document_files(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    this.db.exec(
      'CREATE INDEX IF NOT EXISTS idx_document_folders_user ON document_folders(user_id)'
    )
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS idx_document_folders_parent ON document_folders(parent_id)'
    )
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_document_files_user ON document_files(user_id)')
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS idx_document_files_folder ON document_files(folder_id)'
    )
    this.db.exec('CREATE INDEX IF NOT EXISTS idx_document_files_status ON document_files(status)')
    this.db.exec(
      'CREATE INDEX IF NOT EXISTS idx_document_edit_history_file ON document_edit_history(file_id)'
    )

    console.log('✅ 所有表创建成功')

    const insertUser = this.db.prepare(`
      INSERT OR IGNORE INTO users (id, uuid, username, role, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    insertUser.run('local-user', 'local-user-uuid', 'Local User', 'USER', 1)
    console.log('✅ 默认本地用户已创建 (local-user)')

    console.log('🎉 数据库初始化完成！')
  }

  async disconnect(): Promise<void> {
    this.db.close()
    this.isConnected = false
    console.log('Local database disconnected')
  }

  async create(model: string, data: any): Promise<any> {
    const tableName = this.getTableName(model)
    const id = data.id || this.generateId()
    const now = new Date().toISOString()

    const columns = ['id', 'createdAt', 'updatedAt', ...Object.keys(data)]
    const values = [id, now, now, ...Object.values(data).map(v => this.serializeValue(v))]
    const placeholders = columns.map(() => '?').join(', ')

    // 引用列名以避免 SQL 关键字冲突（如 order）
    const quotedColumns = columns.map(col => `"${col}"`).join(', ')

    const stmt = this.db.prepare(
      `INSERT INTO ${tableName} (${quotedColumns}) VALUES (${placeholders})`
    )
    stmt.run(...values)

    return { id, ...data, createdAt: now, updatedAt: now }
  }

  async findMany(model: string, options: any = {}): Promise<any[]> {
    const tableName = this.getTableName(model)
    let query = `SELECT * FROM ${tableName}`
    const params: any[] = []

    if (options.where) {
      const conditions = Object.entries(options.where).map(([key, value]) => {
        params.push(this.serializeParam(value))
        return `"${key}" = ?`
      })
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    if (options.orderBy) {
      let orderParts: string[] = []

      if (Array.isArray(options.orderBy)) {
        for (const orderObj of options.orderBy) {
          const parts = Object.entries(orderObj).map(([key, value]) => `"${key}" ${value}`)
          orderParts.push(...parts)
        }
      } else {
        orderParts = Object.entries(options.orderBy).map(([key, value]) => `"${key}" ${value}`)
      }

      if (orderParts.length > 0) {
        query += ` ORDER BY ${orderParts.join(', ')}`
      }
    }

    if (options.take) {
      query += ` LIMIT ${options.take}`
    }

    if (options.skip) {
      query += ` OFFSET ${options.skip}`
    }

    const stmt = this.db.prepare(query)
    const rows = params.length > 0 ? stmt.all(...params) : stmt.all()
    return rows.map((row: any) => this.deserializeRow(row))
  }

  async findUnique(model: string, options: any): Promise<any> {
    const tableName = this.getTableName(model)
    const id = options.where.id
    const stmt = this.db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
    const row = stmt.get(id) as any
    return row ? this.deserializeRow(row) : null
  }

  async update(model: string, options: any): Promise<any> {
    const tableName = this.getTableName(model)
    const id = options.where.id
    const data = { ...options.data, updatedAt: new Date().toISOString() }

    // 引用列名以避免 SQL 关键字冲突（如 order）
    const setParts = Object.keys(data).map(key => `"${key}" = ?`)
    const values = [...Object.values(data).map(v => this.serializeValue(v)), id]

    const stmt = this.db.prepare(`UPDATE ${tableName} SET ${setParts.join(', ')} WHERE id = ?`)
    stmt.run(...values)

    return this.findUnique(model, { where: { id } })
  }

  async delete(model: string, options: any): Promise<any> {
    const tableName = this.getTableName(model)
    const id = options.where.id

    const item = await this.findUnique(model, { where: { id } })
    if (item) {
      const stmt = this.db.prepare(`DELETE FROM ${tableName} WHERE id = ?`)
      stmt.run(id)
    }
    return item
  }

  async createMany(model: string, data: any[]): Promise<any> {
    for (const item of data) {
      await this.create(model, item)
    }
    return { count: data.length }
  }

  async updateMany(model: string, options: any): Promise<any> {
    const tableName = this.getTableName(model)
    const data = { ...options.data, updatedAt: new Date().toISOString() }

    // 引用列名以避免 SQL 关键字冲突（如 order）
    const setParts = Object.keys(data).map(key => `"${key}" = ?`)
    const values: any[] = Object.values(data).map(v => this.serializeValue(v))

    if (options.where) {
      const conditions = Object.entries(options.where).map(([key, value]) => {
        values.push(value)
        return `"${key}" = ?`
      })
      const stmt = this.db.prepare(
        `UPDATE ${tableName} SET ${setParts.join(', ')} WHERE ${conditions.join(' AND ')}`
      )
      stmt.run(...values)
    } else {
      const stmt = this.db.prepare(`UPDATE ${tableName} SET ${setParts.join(', ')}`)
      stmt.run(...values)
    }

    return { count: 0 }
  }

  async deleteMany(model: string, options: any): Promise<any> {
    const tableName = this.getTableName(model)
    const params: any[] = []

    let query = `DELETE FROM ${tableName}`
    if (options.where) {
      const conditions = Object.entries(options.where).map(([key, value]) => {
        params.push(value)
        return `"${key}" = ?`
      })
      query += ` WHERE ${conditions.join(' AND ')}`
    }

    const stmt = this.db.prepare(query)
    stmt.run(...params)

    return { count: 0 }
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    this.db.exec('BEGIN TRANSACTION')
    try {
      const result = await fn(this)
      this.db.exec('COMMIT')
      return result
    } catch (error) {
      this.db.exec('ROLLBACK')
      throw error
    }
  }

  async sync(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      conflictsResolved: 0,
      recordsSynced: 0,
      lastSyncTime: new Date(),
      errors: []
    }
    return result
  }

  async getLastSyncTime(): Promise<Date | null> {
    return null
  }

  async setLastSyncTime(_time: Date): Promise<void> {}

  private getTableName(model: string): string {
    const map: Record<string, string> = {
      User: 'users',
      UserSettings: 'user_settings',
      SSHFolder: 'ssh_folders',
      SSHConnection: 'ssh_connections',
      ChatFolder: 'chat_folders',
      ChatSession: 'chat_sessions',
      Message: 'messages',
      CommandLog: 'command_logs',
      DocumentFolder: 'document_folders',
      DocumentFile: 'document_files',
      DocumentEditHistory: 'document_edit_history'
    }
    return map[model] || model.toLowerCase()
  }

  private generateId(): string {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    )
  }

  private serializeParam(value: any): string | number | null {
    if (value === null || value === undefined) return null
    if (typeof value === 'boolean') return value ? 1 : 0
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value
    return JSON.stringify(value)
  }

  private serializeValue(value: any): string | null {
    if (value === null || value === undefined) return null
    if (typeof value === 'string') return value
    return JSON.stringify(value)
  }

  private deserializeValue(value: string | null): any {
    if (value === null || value === undefined) return null
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  private deserializeRow(row: Record<string, unknown>): any {
    const result: any = {}
    for (const [key, value] of Object.entries(row)) {
      result[key] = this.deserializeValue(value as string | null)
    }
    return result
  }
}
