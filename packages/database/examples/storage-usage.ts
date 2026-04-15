/**
 * 存储管理器使用示例
 * 演示如何在不同场景下使用本地和云存储
 */

import { StorageManager } from '../src/storage-manager'
import { createStorageConfig, storagePresets, autoDetectStorageConfig } from '../src/storage.config'

// 示例 1: 基础使用 - 自动检测环境
async function basicUsage() {
  console.log('=== 基础使用示例 ===')
  
  // 自动检测最佳配置
  const config = autoDetectStorageConfig()
  const storage = new StorageManager(config)
  
  try {
    // 连接存储
    await storage.connect()
    
    // 基础 CRUD 操作
    const user = await storage.create('user', {
      email: 'user@example.com',
      username: 'testuser',
      settings: {
        theme: 'dark',
        language: 'zh-CN'
      }
    })
    
    console.log('Created user:', user.id)
    
    // 查询数据
    const users = await storage.findMany('user', {
      where: {
        isActive: true
      },
      take: 10
    })
    
    console.log(`Found ${users.length} active users`)
    
    // 更新数据
    await storage.update('user', {
      where: { id: user.id },
      data: {
        settings: {
          ...user.settings,
          lastLogin: new Date()
        }
      }
    })
    
    console.log('User updated')
    
  } finally {
    await storage.disconnect()
  }
}

// 示例 2: 混合模式使用 - 本地优先，云端同步
async function hybridModeUsage() {
  console.log('=== 混合模式使用示例 ===')
  
  const config = createStorageConfig('production', {
    allowCloudStorage: true,
    allowOfflineMode: true,
    syncFrequency: 'moderate',
    dataPrivacy: 'moderate'
  })
  
  const storage = new StorageManager(config)
  
  try {
    await storage.connect()
    
    // 批量创建数据
    const sessions = await storage.createMany('chatSession', [
      {
        title: '会话 1',
        userId: 'user1',
        settings: { model: 'gpt-4' }
      },
      {
        title: '会话 2', 
        userId: 'user1',
        settings: { model: 'claude-3' }
      }
    ])
    
    console.log(`Created ${sessions.count} chat sessions`)
    
    // 检查存储状态
    const status = await storage.getStatus()
    console.log('Storage status:', {
      mode: status.mode,
      localConnected: status.local.connected,
      cloudConnected: status.cloud.connected,
      syncEnabled: status.sync.enabled
    })
    
    // 手动触发同步
    if (status.sync.enabled) {
      console.log('Starting manual sync...')
      const syncResult = await storage.sync()
      console.log('Sync result:', {
        success: syncResult.success,
        recordsSynced: syncResult.recordsSynced,
        conflictsResolved: syncResult.conflictsResolved
      })
    }
    
  } finally {
    await storage.disconnect()
  }
}

// 示例 3: 事务处理
async function transactionUsage() {
  console.log('=== 事务处理示例 ===')
  
  const storage = new StorageManager(storagePresets.localOnly)
  
  try {
    await storage.connect()
    
    // 在事务中执行多个操作
    const result = await storage.transaction(async (txStorage) => {
      // 创建用户
      const user = await txStorage.create('user', {
        email: 'tx@example.com',
        username: 'txuser'
      })
      
      // 创建SSH连接
      const connection = await txStorage.create('sshConnection', {
        name: '服务器1',
        host: '192.168.1.100',
        port: 22,
        username: 'root',
        userId: user.id
      })
      
      // 创建聊天会话
      const session = await txStorage.create('chatSession', {
        title: '技术讨论',
        userId: user.id
      })
      
      return { user, connection, session }
    })
    
    console.log('Transaction completed:', {
      userId: result.user.id,
      connectionId: result.connection.id,
      sessionId: result.session.id
    })
    
  } catch (error) {
    console.error('Transaction failed:', error)
  } finally {
    await storage.disconnect()
  }
}

// 示例 4: 离线模式和网络恢复
async function offlineModeUsage() {
  console.log('=== 离线模式使用示例 ===')
  
  const config = {
    mode: 'hybrid' as const,
    localOptions: {
      connectionString: 'file:./offline-demo.db',
      enabled: true
    },
    cloudOptions: {
      connectionString: process.env.DATABASE_URL,
      enabled: !!process.env.DATABASE_URL,
      provider: 'postgresql' as const
    },
    hybridOptions: {
      primaryStorage: 'local' as const,
      fallbackEnabled: true,
      syncStrategy: 'realtime' as const,
      conflictResolution: 'merge' as const,
      offlineMode: true
    }
  }
  
  const storage = new StorageManager(config)
  
  try {
    await storage.connect()
    
    // 模拟离线操作
    console.log('Creating data while offline...')
    
    for (let i = 1; i <= 5; i++) {
      await storage.create('message', {
        content: `离线消息 ${i}`,
        userId: 'user1',
        sessionId: 'session1',
        role: 'user'
      })
    }
    
    console.log('Offline data created')
    
    // 检查待同步数据
    const status = await storage.getStatus()
    if (status.local.pendingRecords) {
      console.log(`${status.local.pendingRecords} records pending sync`)
    }
    
    // 模拟网络恢复，触发同步
    if (status.cloud.connected && status.sync.enabled) {
      console.log('Network recovered, syncing data...')
      const syncResult = await storage.sync()
      console.log('Sync completed:', syncResult)
    }
    
  } finally {
    await storage.disconnect()
  }
}

// 示例 5: 存储模式切换
async function modeSwitchingUsage() {
  console.log('=== 存储模式切换示例 ===')
  
  // 开始使用本地模式
  const storage = new StorageManager(storagePresets.localOnly)
  
  try {
    await storage.connect()
    console.log('Started in local mode')
    
    // 创建一些数据
    await storage.create('user', {
      email: 'switch@example.com',
      username: 'switchuser'
    })
    
    // 检查是否有云数据库可用
    if (process.env.DATABASE_URL) {
      console.log('Switching to hybrid mode...')
      
      // 切换到混合模式
      await storage.switchMode('hybrid')
      
      // 触发同步以上传本地数据
      const syncResult = await storage.sync()
      console.log('Data synced after mode switch:', syncResult)
    }
    
    const finalStatus = await storage.getStatus()
    console.log('Final storage mode:', finalStatus.mode)
    
  } finally {
    await storage.disconnect()
  }
}

// 示例 6: 高级查询和性能优化
async function advancedUsage() {
  console.log('=== 高级使用示例 ===')
  
  const storage = new StorageManager(storagePresets.highPerformance)
  
  try {
    await storage.connect()
    
    // 复杂查询
    const recentMessages = await storage.findMany('message', {
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
        },
        role: 'assistant'
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        },
        session: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })
    
    console.log(`Found ${recentMessages.length} recent assistant messages`)
    
    // 聚合查询
    const userStats = await storage.findMany('user', {
      select: {
        id: true,
        username: true,
        _count: {
          messages: true,
          chatSessions: true
        }
      },
      where: {
        isActive: true
      }
    })
    
    console.log('User statistics:', userStats.map(user => ({
      username: user.username,
      messageCount: user._count.messages,
      sessionCount: user._count.chatSessions
    })))
    
    // 批量更新
    const updateResult = await storage.updateMany('message', {
      where: {
        createdAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7天前
        }
      },
      data: {
        archived: true
      }
    })
    
    console.log(`Archived ${updateResult.count} old messages`)
    
  } finally {
    await storage.disconnect()
  }
}

// 运行所有示例
async function runAllExamples() {
  try {
    await basicUsage()
    await hybridModeUsage()
    await transactionUsage()
    await offlineModeUsage()
    await modeSwitchingUsage()
    await advancedUsage()
  } catch (error) {
    console.error('Example execution failed:', error)
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runAllExamples()
}
