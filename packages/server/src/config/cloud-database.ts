import { logger } from '../utils/safe-logger.js'
import { PrismaClient } from '../../../database/src/generated/client-postgresql/index.js'

/**
 * 云数据库配置 - 专门用于用户认证和云端数据存储
 */
class CloudDatabase {
  private static instance: PrismaClient | null = null
  private static isConnected = false

  /**
   * 获取云数据库实例
   */
  static getInstance(): PrismaClient {
    if (!CloudDatabase.instance) {
      const cloudDatabaseUrl = process.env.CLOUD_DATABASE_URL || 
                              'postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant'
      
      CloudDatabase.instance = new PrismaClient({
        datasources: {
          db: {
            url: cloudDatabaseUrl
          }
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      })
    }

    return CloudDatabase.instance
  }

  /**
   * 连接云数据库
   */
  static async connect(): Promise<void> {
    if (CloudDatabase.isConnected) {
      logger.info('Cloud database is already connected')
      return
    }

    try {
      const client = CloudDatabase.getInstance()
      
      // 测试连接
      await client.$connect()
      
      // 运行一个简单的查询来验证连接
      await client.$queryRaw`SELECT 1`
      
      CloudDatabase.isConnected = true
      logger.info('Cloud database connected successfully')
    } catch (error) {
      logger.error({ error }, 'Failed to connect to cloud database')
      throw error
    }
  }

  /**
   * 断开云数据库连接
   */
  static async disconnect(): Promise<void> {
    if (!CloudDatabase.isConnected || !CloudDatabase.instance) {
      logger.info('Cloud database is not connected')
      return
    }

    try {
      await CloudDatabase.instance.$disconnect()
      CloudDatabase.instance = null
      CloudDatabase.isConnected = false
      logger.info('Cloud database disconnected successfully')
    } catch (error) {
      logger.error({ error }, 'Failed to disconnect from cloud database')
      throw error
    }
  }

  /**
   * 检查云数据库连接状态
   */
  static isConnectionActive(): boolean {
    return CloudDatabase.isConnected && CloudDatabase.instance !== null
  }

  /**
   * 健康检查
   */
  static async healthCheck(): Promise<boolean> {
    try {
      if (!CloudDatabase.isConnectionActive()) {
        return false
      }

      const client = CloudDatabase.getInstance()
      await client.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      logger.error({ error }, 'Cloud database health check failed')
      return false
    }
  }
}

export default CloudDatabase

