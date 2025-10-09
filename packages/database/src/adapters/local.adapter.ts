/**
 * 本地存储适配器
 * 基于 SQLite 或 PostgreSQL 的本地数据库实现
 */

import { PrismaClient } from '../prisma-client'  // ✅ 使用 Prisma Client 适配器
import { BaseStorageAdapter, StorageOptions, SyncResult } from './base.adapter'

export class LocalStorageAdapter extends BaseStorageAdapter {
  private prisma: any

  constructor(options: StorageOptions = {}) {
    super(options)
    
    // 本地数据库连接字符串
    const localDbUrl = options.connectionString || 
      process.env.LOCAL_DATABASE_URL || 
      'file:./local.db' // SQLite 默认
    
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: localDbUrl
        }
      }
    })
  }

  get type(): 'local' {
    return 'local'
  }

  async connect(): Promise<void> {
    try {
      console.log('🔌 正在连接本地数据库...')
      console.log('📁 数据库文件路径:', process.env.DATABASE_URL || 'file:./local.db')
      
      await this.prisma.$connect()
      this.isConnected = true
      console.log('✅ Local database connected')
      
      // 自动初始化数据库表（如果不存在）
      console.log('🔍 开始检查数据库表...')
      await this.initializeDatabase()
      
      if (this.options.syncEnabled) {
        this.startAutoSync()
      }
    } catch (error) {
      console.error('❌ Failed to connect to local database:', error)
      throw error
    }
  }

  /**
   * 自动初始化数据库表
   * 检查必需的表是否存在，不存在则创建
   */
  private async initializeDatabase(): Promise<void> {
    try {
      console.log('🔎 检查 user_settings 表是否存在...')
      // 检查 user_settings 表是否存在
      const result = await this.prisma.$queryRaw<Array<{ name: string }>>`
        SELECT name FROM sqlite_master WHERE type='table' AND name='user_settings'
      `
      
      console.log('📊 查询结果:', result)
      
      if (result && result.length > 0) {
        console.log('✅ Database tables already exist')
        return
      }
      
      console.log('📋 表不存在，开始初始化数据库表...')
      console.log('⏳ 这可能需要几秒钟...')
      
      // 创建所有必需的表
      try {
        console.log('1️⃣ 创建 users 表...')
        // 创建 users 表
        await this.prisma.$executeRaw`
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
        `
        console.log('   ✓ users 表创建成功')
        
        console.log('2️⃣ 创建 user_settings 表...')
        // 创建 user_settings 表
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS user_settings (
            id TEXT PRIMARY KEY,
            userId TEXT UNIQUE NOT NULL,
            data TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          )
        `
        console.log('   ✓ user_settings 表创建成功')
        
        console.log('3️⃣ 创建 ssh_connections 表...')
        // 创建 ssh_connections 表
        await this.prisma.$executeRaw`
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
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          )
        `
        console.log('   ✓ ssh_connections 表创建成功')
        
        console.log('4️⃣ 创建 chat_sessions 表...')
        // 创建 chat_sessions 表
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS chat_sessions (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT DEFAULT 'CHAT' NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            config TEXT,
            meta TEXT,
            userId TEXT NOT NULL,
            sshConnectionId TEXT,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (sshConnectionId) REFERENCES ssh_connections(id)
          )
        `
        console.log('   ✓ chat_sessions 表创建成功')
        
        console.log('5️⃣ 创建 messages 表...')
        // 创建 messages 表
        await this.prisma.$executeRaw`
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
            plugin TEXT,
            pluginState TEXT,
            translate TEXT,
            tts TEXT,
            sessionId TEXT NOT NULL,
            userId TEXT NOT NULL,
            FOREIGN KEY (sessionId) REFERENCES chat_sessions(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          )
        `
        console.log('   ✓ messages 表创建成功')
        
        console.log('6️⃣ 创建 command_logs 表...')
        // 创建 command_logs 表
        await this.prisma.$executeRaw`
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
        `
        console.log('   ✓ command_logs 表创建成功')
        
        console.log('👤 创建默认本地用户...')
        // 创建默认的本地用户（如果不存在）
        await this.prisma.$executeRaw`
          INSERT OR IGNORE INTO users (id, uuid, username, role, isActive, createdAt, updatedAt)
          VALUES (
            'local-user',
            'local-user-uuid',
            'Local User',
            'USER',
            1,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
        `
        console.log('   ✓ 默认用户创建成功')
        
        console.log('🎉 ===============================================')
        console.log('✅ 数据库初始化完成！')
        console.log('✅ 所有表创建成功')
        console.log('✅ 默认本地用户已创建 (local-user)')
        console.log('🎉 ===============================================')
      } catch (createError) {
        console.error('❌ Failed to create tables:', createError)
        throw createError
      }
    } catch (error) {
      console.error('❌ Failed to check/initialize database:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.stopAutoSync()
      await this.prisma.$disconnect()
      this.isConnected = false
      console.log('Local database disconnected')
    } catch (error) {
      console.error('Failed to disconnect from local database:', error)
      throw error
    }
  }

  // CRUD 操作实现
  async create(model: string, data: any): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    // 添加本地时间戳
    let enrichedData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // 只对支持同步的模型添加 syncStatus
    // User 和 UserSettings 不需要同步状态
    const syncableModels = ['SshConnection', 'ChatSession', 'Message', 'CommandLog']
    if (syncableModels.includes(model)) {
      enrichedData.syncStatus = 'pending'
    }
    
    // 处理 SQLite 的 JSON 字段序列化
    enrichedData = this.serializeJsonFields(model, enrichedData)
    
    const result = await modelDelegate.create({ data: enrichedData })
    
    // 反序列化返回结果
    return this.deserializeJsonFields(model, result)
  }

  async findMany(model: string, options: any = {}): Promise<any[]> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    return await modelDelegate.findMany(options)
  }

  async findUnique(model: string, options: any): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    const result = await modelDelegate.findUnique(options)
    
    // 反序列化 JSON 字段
    return result ? this.deserializeJsonFields(model, result) : result
  }

  async update(model: string, options: any): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    // 更新时间戳
    let updateData = {
      ...options.data,
      updatedAt: new Date()
    }
    
    // 只对支持同步的模型添加 syncStatus
    const syncableModels = ['SshConnection', 'ChatSession', 'Message', 'CommandLog']
    if (syncableModels.includes(model)) {
      updateData.syncStatus = 'pending'
    }
    
    // 处理 SQLite 的 JSON 字段序列化
    updateData = this.serializeJsonFields(model, updateData)
    
    const result = await modelDelegate.update({
      ...options,
      data: updateData
    })
    
    // 反序列化返回结果
    return this.deserializeJsonFields(model, result)
  }

  async delete(model: string, options: any): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    return await modelDelegate.delete(options)
  }

  // 批量操作
  async createMany(model: string, data: any[]): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    const enrichedData = data.map(item => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'pending'
    }))
    
    return await modelDelegate.createMany({ data: enrichedData })
  }

  async updateMany(model: string, options: any): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    const updateData = {
      ...options.data,
      updatedAt: new Date(),
      syncStatus: 'pending'
    }
    
    return await modelDelegate.updateMany({
      ...options,
      data: updateData
    })
  }

  async deleteMany(model: string, options: any): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    return await modelDelegate.deleteMany(options)
  }

  // 事务支持
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn)
  }

  // 同步功能（可选实现）
  async sync(): Promise<SyncResult> {
    if (!this.options.syncEnabled) {
      throw new Error('Sync is not enabled for this adapter')
    }

    const result: SyncResult = {
      success: true,
      conflictsResolved: 0,
      recordsSynced: 0,
      lastSyncTime: new Date(),
      errors: []
    }

    try {
      // 这里可以实现与云端的同步逻辑
      // 1. 获取待同步的本地数据
      // 2. 推送到云端
      // 3. 拉取云端更新
      // 4. 解决冲突
      
      console.log('Local sync completed:', result)
      await this.setLastSyncTime(result.lastSyncTime)
      
    } catch (error) {
      result.success = false
      result.errors = [error instanceof Error ? error.message : String(error)]
      console.error('Local sync failed:', error)
    }

    return result
  }

  async getLastSyncTime(): Promise<Date | null> {
    // 可以从一个专门的同步状态表中获取
    try {
      const syncRecord = await this.prisma.$queryRaw`
        SELECT last_sync_time FROM sync_status ORDER BY id DESC LIMIT 1
      ` as any[]
      
      return syncRecord.length > 0 ? new Date(syncRecord[0].last_sync_time) : null
    } catch {
      return null
    }
  }

  async setLastSyncTime(time: Date): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO sync_status (last_sync_time, created_at) 
        VALUES (${time}, ${new Date()})
      `
    } catch (error) {
      console.warn('Failed to update last sync time:', error)
    }
  }

  // 获取待同步的数据
  async getPendingSyncData(model: string): Promise<any[]> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      return []
    }

    try {
      return await modelDelegate.findMany({
        where: {
          syncStatus: 'pending'
        }
      })
    } catch {
      return []
    }
  }

  // 标记数据为已同步
  async markAsSynced(model: string, ids: string[]): Promise<void> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      return
    }

    try {
      await modelDelegate.updateMany({
        where: {
          id: {
            in: ids
          }
        },
        data: {
          syncStatus: 'synced',
          lastSyncedAt: new Date()
        }
      })
    } catch (error) {
      console.warn(`Failed to mark ${model} records as synced:`, error)
    }
  }

  /**
   * 序列化 JSON 字段（SQLite 需要将对象转为字符串）
   */
  private serializeJsonFields(model: string, data: any): any {
    if (model === 'UserSettings' && data.data && typeof data.data === 'object') {
      return {
        ...data,
        data: JSON.stringify(data.data)
      }
    }
    
    // 其他模型可能也有 JSON 字段，按需添加
    if (model === 'ChatSession') {
      const serialized = { ...data }
      if (serialized.config && typeof serialized.config === 'object') {
        serialized.config = JSON.stringify(serialized.config)
      }
      if (serialized.meta && typeof serialized.meta === 'object') {
        serialized.meta = JSON.stringify(serialized.meta)
      }
      return serialized
    }
    
    return data
  }

  /**
   * 反序列化 JSON 字段（SQLite 需要将字符串转回对象）
   */
  private deserializeJsonFields(model: string, data: any): any {
    if (!data) return data

    if (model === 'UserSettings' && data.data && typeof data.data === 'string') {
      try {
        return {
          ...data,
          data: JSON.parse(data.data)
        }
      } catch {
        return data
      }
    }
    
    // 其他模型可能也有 JSON 字段，按需添加
    if (model === 'ChatSession') {
      const deserialized = { ...data }
      if (deserialized.config && typeof deserialized.config === 'string') {
        try {
          deserialized.config = JSON.parse(deserialized.config)
        } catch {
          // 保持原样
        }
      }
      if (deserialized.meta && typeof deserialized.meta === 'string') {
        try {
          deserialized.meta = JSON.parse(deserialized.meta)
        } catch {
          // 保持原样
        }
      }
      return deserialized
    }
    
    return data
  }
}
