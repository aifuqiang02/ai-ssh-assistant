/**
 * 存储适配器基类
 * 定义了统一的数据存储接口，支持本地和云存储
 */

export interface StorageOptions {
  connectionString?: string
  syncEnabled?: boolean
  syncInterval?: number // 同步间隔（毫秒）
  conflictResolution?: 'local' | 'remote' | 'merge' // 冲突解决策略
}

export interface SyncResult {
  success: boolean
  conflictsResolved: number
  recordsSynced: number
  lastSyncTime: Date
  errors?: string[]
}

export abstract class BaseStorageAdapter {
  protected options: StorageOptions
  protected isConnected = false
  protected syncTimer?: NodeJS.Timeout

  constructor(options: StorageOptions = {}) {
    this.options = {
      syncEnabled: false,
      syncInterval: 5 * 60 * 1000, // 5分钟
      conflictResolution: 'merge',
      ...options
    }
  }

  // 抽象方法 - 子类必须实现
  abstract get type(): 'local' | 'cloud'
  abstract connect(): Promise<void>
  abstract disconnect(): Promise<void>
  
  // CRUD 操作
  abstract create(model: string, data: any): Promise<any>
  abstract findMany(model: string, options?: any): Promise<any[]>
  abstract findUnique(model: string, options: any): Promise<any>
  abstract update(model: string, options: any): Promise<any>
  abstract delete(model: string, options: any): Promise<any>
  
  // 批量操作
  abstract createMany(model: string, data: any[]): Promise<any>
  abstract updateMany(model: string, options: any): Promise<any>
  abstract deleteMany(model: string, options: any): Promise<any>
  
  // 事务支持
  abstract transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>
  
  // 同步相关
  abstract sync?(): Promise<SyncResult>
  abstract getLastSyncTime?(): Promise<Date | null>
  abstract setLastSyncTime?(time: Date): Promise<void>

  // 连接状态管理
  getConnectionStatus(): boolean {
    return this.isConnected
  }

  // 启动自动同步
  startAutoSync(): void {
    if (!this.options.syncEnabled || !this.sync) {
      return
    }

    this.stopAutoSync() // 确保没有重复的定时器

    this.syncTimer = setInterval(async () => {
      try {
        await this.sync!()
      } catch (error) {
        console.error('Auto sync failed:', error)
      }
    }, this.options.syncInterval)
  }

  // 停止自动同步
  stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = undefined
    }
  }

  // 清理资源
  async cleanup(): Promise<void> {
    this.stopAutoSync()
    if (this.isConnected) {
      await this.disconnect()
    }
  }
}
