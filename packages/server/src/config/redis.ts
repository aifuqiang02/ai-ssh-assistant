import { Redis } from 'ioredis'
import { logger } from '../utils/safe-logger.js'

interface RedisConfig {
  host: string
  port: number
  password?: string
  db: number
  retryDelayOnFailover: number
  maxRetriesPerRequest: number
  lazyConnect: boolean
}

class RedisManager {
  private static instance: Redis | null = null
  private static isConnected = false

  /**
   * 获取 Redis 配置
   */
  private static getConfig(): RedisConfig {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    }
  }

  /**
   * 获取 Redis 实例
   */
  static getInstance(): Redis {
    if (!RedisManager.instance) {
      const config = RedisManager.getConfig()
      RedisManager.instance = new Redis(config)

      // 设置事件监听器
      RedisManager.instance.on('connect', () => {
        logger.info('Redis connection established')
      })

      RedisManager.instance.on('ready', () => {
        RedisManager.isConnected = true
        logger.info('Redis is ready to receive commands')
      })

      RedisManager.instance.on('error', (error) => {
        logger.error({ error }, 'Redis connection error')
        RedisManager.isConnected = false
      })

      RedisManager.instance.on('close', () => {
        logger.info('Redis connection closed')
        RedisManager.isConnected = false
      })

      RedisManager.instance.on('reconnecting', () => {
        logger.info('Redis reconnecting...')
      })

      RedisManager.instance.on('end', () => {
        logger.info('Redis connection ended')
        RedisManager.isConnected = false
      })
    }

    return RedisManager.instance
  }

  /**
   * 连接 Redis
   */
  static async connect(): Promise<void> {
    if (RedisManager.isConnected) {
      logger.info('Redis is already connected')
      return
    }

    try {
      const client = RedisManager.getInstance()
      await client.connect()
      
      // 测试连接
      await client.ping()
      
      logger.info('Redis connected successfully')
    } catch (error) {
      logger.error({ error }, 'Failed to connect to Redis')
      // Redis 连接失败不应该阻止应用启动，只记录错误
      logger.warn('Application will continue without Redis')
    }
  }

  /**
   * 断开 Redis 连接
   */
  static async disconnect(): Promise<void> {
    if (!RedisManager.instance) {
      logger.info('Redis is not connected')
      return
    }

    try {
      await RedisManager.instance.disconnect()
      RedisManager.instance = null
      RedisManager.isConnected = false
      logger.info('Redis disconnected successfully')
    } catch (error) {
      logger.error({ error }, 'Failed to disconnect from Redis')
      throw error
    }
  }

  /**
   * 检查 Redis 连接状态
   */
  static isConnectionActive(): boolean {
    return RedisManager.isConnected && RedisManager.instance !== null
  }

  /**
   * 健康检查
   */
  static async healthCheck(): Promise<boolean> {
    try {
      if (!RedisManager.isConnectionActive()) {
        return false
      }

      const client = RedisManager.getInstance()
      const result = await client.ping()
      return result === 'PONG'
    } catch (error) {
      logger.error({ error }, 'Redis health check failed')
      return false
    }
  }

  /**
   * 获取缓存
   */
  static async get(key: string): Promise<string | null> {
    try {
      if (!RedisManager.isConnectionActive()) {
        logger.warn('Redis is not connected, cannot get key: %s', key)
        return null
      }

      const client = RedisManager.getInstance()
      return await client.get(key)
    } catch (error) {
      logger.error({ error, key }, 'Failed to get key from Redis')
      return null
    }
  }

  /**
   * 设置缓存
   */
  static async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (!RedisManager.isConnectionActive()) {
        logger.warn('Redis is not connected, cannot set key: %s', key)
        return false
      }

      const client = RedisManager.getInstance()
      
      if (ttl) {
        await client.setex(key, ttl, value)
      } else {
        await client.set(key, value)
      }
      
      return true
    } catch (error) {
      logger.error({ error, key }, 'Failed to set key in Redis')
      return false
    }
  }

  /**
   * 删除缓存
   */
  static async del(key: string): Promise<boolean> {
    try {
      if (!RedisManager.isConnectionActive()) {
        logger.warn('Redis is not connected, cannot delete key: %s', key)
        return false
      }

      const client = RedisManager.getInstance()
      const result = await client.del(key)
      return result > 0
    } catch (error) {
      logger.error({ error, key }, 'Failed to delete key from Redis')
      return false
    }
  }
}

export default RedisManager

