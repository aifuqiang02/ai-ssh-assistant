import { logger } from '../utils/safe-logger.js'
// 直接导入 Prisma 客户端，避免浏览器兼容层的问题
import { PrismaClient } from '../../../database/src/generated/client-postgresql/index.js'

class Database {
  private static instance: PrismaClient | null = null
  private static isConnected = false

  /**
   * 获取数据库实例
   */
  static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      })
    }

    return Database.instance
  }

  /**
   * 连接数据库
   */
  static async connect(): Promise<void> {
    if (Database.isConnected) {
      logger.info('Database is already connected')
      return
    }

    try {
      const client = Database.getInstance()
      
      // 测试连接
      await client.$connect()
      
      // 运行一个简单的查询来验证连接
      await client.$queryRaw`SELECT 1`
      
      Database.isConnected = true
      logger.info('Database connected successfully')
    } catch (error) {
      logger.error({ error }, 'Failed to connect to database')
      throw error
    }
  }

  /**
   * 断开数据库连接
   */
  static async disconnect(): Promise<void> {
    if (!Database.isConnected || !Database.instance) {
      logger.info('Database is not connected')
      return
    }

    try {
      await Database.instance.$disconnect()
      Database.instance = null
      Database.isConnected = false
      logger.info('Database disconnected successfully')
    } catch (error) {
      logger.error({ error }, 'Failed to disconnect from database')
      throw error
    }
  }

  /**
   * 检查数据库连接状态
   */
  static isConnectionActive(): boolean {
    return Database.isConnected && Database.instance !== null
  }

  /**
   * 健康检查
   */
  static async healthCheck(): Promise<boolean> {
    try {
      if (!Database.isConnectionActive()) {
        return false
      }

      const client = Database.getInstance()
      await client.$queryRaw`SELECT 1`
      return true
    } catch (error) {
      logger.error({ error }, 'Database health check failed')
      return false
    }
  }

  /**
   * 重新连接数据库
   */
  static async reconnect(): Promise<void> {
    try {
      await Database.disconnect()
      await Database.connect()
      logger.info('Database reconnected successfully')
    } catch (error) {
      logger.error({ error }, 'Failed to reconnect to database')
      throw error
    }
  }
}

export default Database

