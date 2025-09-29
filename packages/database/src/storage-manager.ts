/**
 * 存储管理器
 * 统一管理本地和云存储适配器，提供数据同步和冲突解决功能
 */

import { BaseStorageAdapter, SyncResult } from './adapters/base.adapter'
import { LocalStorageAdapter } from './adapters/local.adapter'
import { CloudStorageAdapter, CloudStorageOptions } from './adapters/cloud.adapter'

export interface StorageManagerOptions {
  // 存储模式
  mode: 'local' | 'cloud' | 'hybrid'
  
  // 本地存储配置
  localOptions?: {
    connectionString?: string
    enabled?: boolean
  }
  
  // 云存储配置
  cloudOptions?: CloudStorageOptions & {
    enabled?: boolean
  }
  
  // 混合模式配置
  hybridOptions?: {
    primaryStorage: 'local' | 'cloud' // 主要存储
    fallbackEnabled?: boolean // 是否启用降级
    syncStrategy?: 'realtime' | 'periodic' | 'manual' // 同步策略
    syncInterval?: number // 同步间隔（毫秒）
    conflictResolution?: 'local' | 'cloud' | 'merge' | 'manual' // 冲突解决
    offlineMode?: boolean // 离线模式支持
  }
}

export interface StorageStatus {
  mode: string
  local: {
    connected: boolean
    lastSync?: Date
    pendingRecords?: number
  }
  cloud: {
    connected: boolean
    lastSync?: Date
    health?: boolean
  }
  sync: {
    enabled: boolean
    lastResult?: SyncResult
    inProgress: boolean
  }
}

export class StorageManager {
  private localAdapter?: LocalStorageAdapter
  private cloudAdapter?: CloudStorageAdapter
  private options: StorageManagerOptions
  private syncInProgress = false
  private syncTimer?: NodeJS.Timeout

  constructor(options: StorageManagerOptions) {
    this.options = {
      mode: 'local',
      hybridOptions: {
        primaryStorage: 'local',
        fallbackEnabled: true,
        syncStrategy: 'periodic',
        syncInterval: 5 * 60 * 1000, // 5分钟
        conflictResolution: 'merge',
        offlineMode: true
      },
      ...options
    }

    this.initializeAdapters()
  }

  private initializeAdapters(): void {
    // 初始化本地适配器
    if (this.options.mode === 'local' || this.options.mode === 'hybrid') {
      if (this.options.localOptions?.enabled !== false) {
        this.localAdapter = new LocalStorageAdapter({
          connectionString: this.options.localOptions?.connectionString,
          syncEnabled: this.options.mode === 'hybrid'
        })
      }
    }

    // 初始化云适配器
    if (this.options.mode === 'cloud' || this.options.mode === 'hybrid') {
      if (this.options.cloudOptions?.enabled !== false) {
        this.cloudAdapter = new CloudStorageAdapter({
          ...this.options.cloudOptions,
          syncEnabled: this.options.mode === 'hybrid'
        })
      }
    }
  }

  async connect(): Promise<void> {
    const connectPromises: Promise<void>[] = []

    // 连接本地适配器
    if (this.localAdapter) {
      connectPromises.push(
        this.localAdapter.connect().catch(error => {
          console.error('Failed to connect local adapter:', error)
          if (this.options.mode === 'local') {
            throw error
          }
        })
      )
    }

    // 连接云适配器
    if (this.cloudAdapter) {
      connectPromises.push(
        this.cloudAdapter.connect().catch(error => {
          console.error('Failed to connect cloud adapter:', error)
          if (this.options.mode === 'cloud') {
            throw error
          }
          // 混合模式下云连接失败不抛出错误，启用降级模式
        })
      )
    }

    await Promise.all(connectPromises)

    // 启动自动同步（仅混合模式）
    if (this.options.mode === 'hybrid' && this.options.hybridOptions?.syncStrategy === 'periodic') {
      this.startAutoSync()
    }

    console.log(`Storage manager connected in ${this.options.mode} mode`)
  }

  async disconnect(): Promise<void> {
    this.stopAutoSync()

    const disconnectPromises: Promise<void>[] = []

    if (this.localAdapter) {
      disconnectPromises.push(this.localAdapter.disconnect())
    }

    if (this.cloudAdapter) {
      disconnectPromises.push(this.cloudAdapter.disconnect())
    }

    await Promise.all(disconnectPromises)
    console.log('Storage manager disconnected')
  }

  // 获取主要存储适配器
  private getPrimaryAdapter(): BaseStorageAdapter {
    if (this.options.mode === 'local') {
      if (!this.localAdapter) {
        throw new Error('Local adapter not available')
      }
      return this.localAdapter
    }

    if (this.options.mode === 'cloud') {
      if (!this.cloudAdapter) {
        throw new Error('Cloud adapter not available')
      }
      return this.cloudAdapter
    }

    // 混合模式
    const primary = this.options.hybridOptions?.primaryStorage || 'local'
    const primaryAdapter = primary === 'local' ? this.localAdapter : this.cloudAdapter
    
    if (!primaryAdapter || !primaryAdapter.getConnectionStatus()) {
      // 主要存储不可用，尝试降级
      const fallbackAdapter = primary === 'local' ? this.cloudAdapter : this.localAdapter
      if (fallbackAdapter && fallbackAdapter.getConnectionStatus()) {
        console.warn(`Primary storage (${primary}) unavailable, using fallback`)
        return fallbackAdapter
      }
      throw new Error('No storage adapter available')
    }

    return primaryAdapter
  }

  // CRUD 操作代理
  async create(model: string, data: any): Promise<any> {
    const adapter = this.getPrimaryAdapter()
    const result = await adapter.create(model, data)

    // 混合模式下，如果使用本地存储，标记需要同步
    if (this.options.mode === 'hybrid' && adapter.type === 'local') {
      this.scheduleSync()
    }

    return result
  }

  async findMany(model: string, options?: any): Promise<any[]> {
    const adapter = this.getPrimaryAdapter()
    return await adapter.findMany(model, options)
  }

  async findUnique(model: string, options: any): Promise<any> {
    const adapter = this.getPrimaryAdapter()
    return await adapter.findUnique(model, options)
  }

  async update(model: string, options: any): Promise<any> {
    const adapter = this.getPrimaryAdapter()
    const result = await adapter.update(model, options)

    // 混合模式下，如果使用本地存储，标记需要同步
    if (this.options.mode === 'hybrid' && adapter.type === 'local') {
      this.scheduleSync()
    }

    return result
  }

  async delete(model: string, options: any): Promise<any> {
    const adapter = this.getPrimaryAdapter()
    const result = await adapter.delete(model, options)

    // 混合模式下，如果使用本地存储，标记需要同步
    if (this.options.mode === 'hybrid' && adapter.type === 'local') {
      this.scheduleSync()
    }

    return result
  }

  // 批量操作
  async createMany(model: string, data: any[]): Promise<any> {
    const adapter = this.getPrimaryAdapter()
    const result = await adapter.createMany(model, data)

    if (this.options.mode === 'hybrid' && adapter.type === 'local') {
      this.scheduleSync()
    }

    return result
  }

  async updateMany(model: string, options: any): Promise<any> {
    const adapter = this.getPrimaryAdapter()
    const result = await adapter.updateMany(model, options)

    if (this.options.mode === 'hybrid' && adapter.type === 'local') {
      this.scheduleSync()
    }

    return result
  }

  async deleteMany(model: string, options: any): Promise<any> {
    const adapter = this.getPrimaryAdapter()
    const result = await adapter.deleteMany(model, options)

    if (this.options.mode === 'hybrid' && adapter.type === 'local') {
      this.scheduleSync()
    }

    return result
  }

  // 事务支持
  async transaction<T>(fn: (manager: StorageManager) => Promise<T>): Promise<T> {
    const adapter = this.getPrimaryAdapter()
    
    return await adapter.transaction(async (tx) => {
      // 创建一个临时的存储管理器实例用于事务
      const txManager = Object.create(this)
      txManager.getPrimaryAdapter = () => ({ ...adapter, ...tx })
      
      return await fn(txManager)
    })
  }

  // 同步功能
  async sync(): Promise<SyncResult> {
    if (this.options.mode !== 'hybrid') {
      throw new Error('Sync is only available in hybrid mode')
    }

    if (this.syncInProgress) {
      throw new Error('Sync already in progress')
    }

    if (!this.localAdapter || !this.cloudAdapter) {
      throw new Error('Both local and cloud adapters are required for sync')
    }

    this.syncInProgress = true

    try {
      console.log('Starting data synchronization...')
      
      const result: SyncResult = {
        success: true,
        conflictsResolved: 0,
        recordsSynced: 0,
        lastSyncTime: new Date(),
        errors: []
      }

      // 双向同步逻辑
      try {
        // 1. 本地 -> 云端
        if (this.localAdapter.sync) {
          const localSyncResult = await this.localAdapter.sync()
          result.recordsSynced += localSyncResult.recordsSynced
          result.conflictsResolved += localSyncResult.conflictsResolved
          if (localSyncResult.errors) {
            result.errors?.push(...localSyncResult.errors)
          }
        }

        // 2. 云端 -> 本地
        if (this.cloudAdapter.sync) {
          const cloudSyncResult = await this.cloudAdapter.sync()
          result.recordsSynced += cloudSyncResult.recordsSynced
          result.conflictsResolved += cloudSyncResult.conflictsResolved
          if (cloudSyncResult.errors) {
            result.errors?.push(...cloudSyncResult.errors)
          }
        }

      } catch (error) {
        result.success = false
        result.errors?.push(error instanceof Error ? error.message : String(error))
      }

      console.log('Data synchronization completed:', result)
      return result

    } finally {
      this.syncInProgress = false
    }
  }

  // 调度同步（防抖）
  private scheduleSync(): void {
    if (this.options.hybridOptions?.syncStrategy !== 'realtime') {
      return
    }

    // 清除之前的调度
    if (this.syncTimer) {
      clearTimeout(this.syncTimer)
    }

    // 延迟执行同步（防抖）
    this.syncTimer = setTimeout(() => {
      this.sync().catch(error => {
        console.error('Scheduled sync failed:', error)
      })
    }, 1000) // 1秒延迟
  }

  // 启动自动同步
  private startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
    }

    const interval = this.options.hybridOptions?.syncInterval || 5 * 60 * 1000
    this.syncTimer = setInterval(() => {
      this.sync().catch(error => {
        console.error('Auto sync failed:', error)
      })
    }, interval)

    console.log(`Auto sync started with ${interval}ms interval`)
  }

  // 停止自动同步
  private stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = undefined
    }
  }

  // 获取存储状态
  async getStatus(): Promise<StorageStatus> {
    const status: StorageStatus = {
      mode: this.options.mode,
      local: {
        connected: this.localAdapter?.getConnectionStatus() || false
      },
      cloud: {
        connected: this.cloudAdapter?.getConnectionStatus() || false
      },
      sync: {
        enabled: this.options.mode === 'hybrid',
        inProgress: this.syncInProgress
      }
    }

    // 获取最后同步时间
    try {
      if (this.localAdapter?.getLastSyncTime) {
        status.local.lastSync = await this.localAdapter.getLastSyncTime() || undefined
      }
      if (this.cloudAdapter?.getLastSyncTime) {
        status.cloud.lastSync = await this.cloudAdapter.getLastSyncTime() || undefined
      }
    } catch (error) {
      console.warn('Failed to get sync times:', error)
    }

    // 云端健康检查
    if (this.cloudAdapter && 'healthCheck' in this.cloudAdapter) {
      try {
        status.cloud.health = await (this.cloudAdapter as any).healthCheck()
      } catch {
        status.cloud.health = false
      }
    }

    return status
  }

  // 切换存储模式（运行时）
  async switchMode(newMode: 'local' | 'cloud' | 'hybrid'): Promise<void> {
    if (newMode === this.options.mode) {
      return
    }

    console.log(`Switching storage mode from ${this.options.mode} to ${newMode}`)
    
    // 停止当前模式
    this.stopAutoSync()
    
    // 更新配置
    this.options.mode = newMode
    
    // 重新初始化适配器（如果需要）
    this.initializeAdapters()
    
    // 重新连接
    await this.connect()
    
    console.log(`Storage mode switched to ${newMode}`)
  }

  // 强制同步（忽略进行中状态）
  async forceSync(): Promise<SyncResult> {
    this.syncInProgress = false
    return await this.sync()
  }

  // 清理资源
  async cleanup(): Promise<void> {
    await this.disconnect()
    
    if (this.localAdapter) {
      await this.localAdapter.cleanup()
    }
    
    if (this.cloudAdapter) {
      await this.cloudAdapter.cleanup()
    }
  }
}
