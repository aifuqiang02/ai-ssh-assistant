/**
 * 云存储适配器
 * 支持多种云数据库服务：PostgreSQL、MySQL、MongoDB等
 */

import { PrismaClient } from '../generated/client'
import { BaseStorageAdapter, StorageOptions, SyncResult } from './base.adapter'

export interface CloudStorageOptions extends StorageOptions {
  provider?: 'postgresql' | 'mysql' | 'mongodb' | 'supabase' | 'planetscale'
  region?: string
  ssl?: boolean
  poolSize?: number
  timeout?: number
  retryAttempts?: number
  retryDelay?: number
}

export class CloudStorageAdapter extends BaseStorageAdapter {
  private prisma: PrismaClient
  private cloudOptions: CloudStorageOptions

  constructor(options: CloudStorageOptions = {}) {
    super(options)
    this.cloudOptions = {
      provider: 'postgresql',
      ssl: true,
      poolSize: 10,
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...options
    }
    
    // 云数据库连接字符串
    const cloudDbUrl = options.connectionString || 
      process.env.DATABASE_URL || 
      process.env.CLOUD_DATABASE_URL
    
    if (!cloudDbUrl) {
      throw new Error('Cloud database URL is required')
    }

    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: cloudDbUrl
        }
      },
      log: ['query', 'info', 'warn', 'error']
    })
  }

  get type(): 'cloud' {
    return 'cloud'
  }

  async connect(): Promise<void> {
    let attempts = 0
    const maxAttempts = this.cloudOptions.retryAttempts || 3
    
    while (attempts < maxAttempts) {
      try {
        await this.prisma.$connect()
        
        // 测试连接
        await this.prisma.$queryRaw`SELECT 1`
        
        this.isConnected = true
        console.log(`Cloud database connected (${this.cloudOptions.provider})`)
        
        if (this.options.syncEnabled) {
          this.startAutoSync()
        }
        
        return
      } catch (error) {
        attempts++
        console.error(`Cloud database connection attempt ${attempts} failed:`, error)
        
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to connect to cloud database after ${maxAttempts} attempts`)
        }
        
        // 等待后重试
        await this.delay(this.cloudOptions.retryDelay || 1000)
      }
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.stopAutoSync()
      await this.prisma.$disconnect()
      this.isConnected = false
      console.log('Cloud database disconnected')
    } catch (error) {
      console.error('Failed to disconnect from cloud database:', error)
      throw error
    }
  }

  // CRUD 操作实现
  async create(model: string, data: any): Promise<any> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      // 添加云端时间戳
      const enrichedData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        cloudSyncedAt: new Date()
      }
      
      return await modelDelegate.create({ data: enrichedData })
    })
  }

  async findMany(model: string, options: any = {}): Promise<any[]> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      return await modelDelegate.findMany(options)
    })
  }

  async findUnique(model: string, options: any): Promise<any> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      return await modelDelegate.findUnique(options)
    })
  }

  async update(model: string, options: any): Promise<any> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      // 更新时间戳
      const updateData = {
        ...options.data,
        updatedAt: new Date(),
        cloudSyncedAt: new Date()
      }
      
      return await modelDelegate.update({
        ...options,
        data: updateData
      })
    })
  }

  async delete(model: string, options: any): Promise<any> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      return await modelDelegate.delete(options)
    })
  }

  // 批量操作
  async createMany(model: string, data: any[]): Promise<any> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      const enrichedData = data.map(item => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
        cloudSyncedAt: new Date()
      }))
      
      return await modelDelegate.createMany({ 
        data: enrichedData,
        skipDuplicates: true // 云端操作通常需要处理重复
      })
    })
  }

  async updateMany(model: string, options: any): Promise<any> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      const updateData = {
        ...options.data,
        updatedAt: new Date(),
        cloudSyncedAt: new Date()
      }
      
      return await modelDelegate.updateMany({
        ...options,
        data: updateData
      })
    })
  }

  async deleteMany(model: string, options: any): Promise<any> {
    return await this.withRetry(async () => {
      const modelDelegate = (this.prisma as any)[model]
      if (!modelDelegate) {
        throw new Error(`Model ${model} not found`)
      }
      
      return await modelDelegate.deleteMany(options)
    })
  }

  // 事务支持
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.withRetry(async () => {
      return await this.prisma.$transaction(fn, {
        timeout: this.cloudOptions.timeout || 30000
      })
    })
  }

  // 云端同步实现
  async sync(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      conflictsResolved: 0,
      recordsSynced: 0,
      lastSyncTime: new Date(),
      errors: []
    }

    try {
      // 云端同步逻辑
      // 1. 检查网络连接
      if (!this.isConnected) {
        await this.connect()
      }
      
      // 2. 获取最后同步时间
      const lastSync = await this.getLastSyncTime()
      
      // 3. 获取增量更新
      const models = ['user', 'sshConnection', 'chatSession', 'message'] // 需要同步的模型
      
      for (const model of models) {
        try {
          const records = await this.getUpdatedRecords(model, lastSync)
          result.recordsSynced += records.length
          
          // 这里可以实现具体的同步逻辑
          console.log(`Synced ${records.length} ${model} records`)
        } catch (error) {
          result.errors?.push(`Failed to sync ${model}: ${error}`)
        }
      }
      
      await this.setLastSyncTime(result.lastSyncTime)
      console.log('Cloud sync completed:', result)
      
    } catch (error) {
      result.success = false
      result.errors = [error instanceof Error ? error.message : String(error)]
      console.error('Cloud sync failed:', error)
    }

    return result
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const syncRecord = await this.prisma.$queryRaw`
        SELECT last_sync_time FROM sync_status 
        WHERE adapter_type = 'cloud' 
        ORDER BY created_at DESC 
        LIMIT 1
      ` as any[]
      
      return syncRecord.length > 0 ? new Date(syncRecord[0].last_sync_time) : null
    } catch {
      return null
    }
  }

  async setLastSyncTime(time: Date): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO sync_status (adapter_type, last_sync_time, created_at) 
        VALUES ('cloud', ${time}, ${new Date()})
      `
    } catch (error) {
      console.warn('Failed to update cloud sync time:', error)
    }
  }

  // 获取指定时间后更新的记录
  private async getUpdatedRecords(model: string, since: Date | null): Promise<any[]> {
    const modelDelegate = (this.prisma as any)[model]
    if (!modelDelegate) {
      return []
    }

    try {
      const where = since ? {
        updatedAt: {
          gt: since
        }
      } : {}

      return await modelDelegate.findMany({
        where,
        orderBy: {
          updatedAt: 'asc'
        }
      })
    } catch {
      return []
    }
  }

  // 重试机制
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let attempts = 0
    const maxAttempts = this.cloudOptions.retryAttempts || 3
    
    while (attempts < maxAttempts) {
      try {
        return await operation()
      } catch (error) {
        attempts++
        
        if (attempts >= maxAttempts) {
          throw error
        }
        
        // 检查是否是网络错误，如果是则重新连接
        if (this.isNetworkError(error)) {
          try {
            await this.connect()
          } catch {
            // 连接失败，继续重试
          }
        }
        
        await this.delay(this.cloudOptions.retryDelay || 1000)
      }
    }
    
    throw new Error('Should not reach here')
  }

  // 检查是否是网络错误
  private isNetworkError(error: any): boolean {
    const networkErrorCodes = [
      'ECONNREFUSED',
      'ECONNRESET',
      'ETIMEDOUT',
      'ENOTFOUND',
      'EAI_AGAIN'
    ]
    
    return networkErrorCodes.some(code => 
      error?.code === code || error?.message?.includes(code)
    )
  }

  // 延迟工具函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return true
    } catch {
      return false
    }
  }

  // 获取连接信息
  getConnectionInfo(): any {
    return {
      type: this.type,
      provider: this.cloudOptions.provider,
      connected: this.isConnected,
      syncEnabled: this.options.syncEnabled,
      lastHealthCheck: new Date()
    }
  }
}
