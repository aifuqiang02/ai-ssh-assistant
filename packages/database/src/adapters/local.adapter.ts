/**
 * 本地存储适配器
 * 基于 SQLite 或 PostgreSQL 的本地数据库实现
 */

import { PrismaClient } from '../generated/client'
import { BaseStorageAdapter, StorageOptions, SyncResult } from './base.adapter'

export class LocalStorageAdapter extends BaseStorageAdapter {
  private prisma: PrismaClient

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
      await this.prisma.$connect()
      this.isConnected = true
      console.log('Local database connected')
      
      if (this.options.syncEnabled) {
        this.startAutoSync()
      }
    } catch (error) {
      console.error('Failed to connect to local database:', error)
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
    const enrichedData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'pending' // 标记为待同步
    }
    
    return await modelDelegate.create({ data: enrichedData })
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
    
    return await modelDelegate.findUnique(options)
  }

  async update(model: string, options: any): Promise<any> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      throw new Error(`Model ${model} not found`)
    }
    
    // 更新时间戳和同步状态
    const updateData = {
      ...options.data,
      updatedAt: new Date(),
      syncStatus: 'pending'
    }
    
    return await modelDelegate.update({
      ...options,
      data: updateData
    })
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
}
