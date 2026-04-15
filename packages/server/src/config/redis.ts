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
    const host = process.env.REDIS_HOST || 'localhost'
    const port = parseInt(process.env.REDIS_PORT || '6379')
    const password = process.env.REDIS_PASSWORD
    const db = parseInt(process.env.REDIS_DB || '0')

    const config = {
      host,
      port,
      password,
      db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    }

    // 详细记录连接信息
    logger.info({
      redisHost: host,
      redisPort: port,
      redisPassword: password ? '***password-set***' : 'no-password',
      redisDb: db
    }, 'Redis connection details: host=%s, port=%d, hasPassword=%s, db=%d', host, port, password ? 'yes' : 'no', db)

    logger.info({ redisConfig: { ...config, password: password ? '***masked***' : undefined } }, 'Redis configuration loaded')
    return config
  }

  /**
   * 获取 Redis 连接状态
   */
  static getStatus(): string {
    return RedisManager.isConnected ? 'connected' : 'disconnected'
  }

  /**
   * 获取 Redis 实例
   */
  static getInstance(): Redis {
    if (!RedisManager.instance) {
      const config = RedisManager.getConfig()
      RedisManager.instance = new Redis(config)

      // 设置事件监听器
      RedisManager.instance.on('ready', () => {
        RedisManager.isConnected = true
      })

      RedisManager.instance.on('error', (error) => {
        const config = RedisManager.getConfig()
        logger.error({
          error,
          connectionDetails: {
            host: config.host,
            port: config.port,
            db: config.db,
            hasPassword: !!config.password
          }
        }, 'Redis connection error at %s:%d - Error: %s', config.host, config.port, error.message || 'Unknown error')
        RedisManager.isConnected = false
      })

      RedisManager.instance.on('close', () => {
        RedisManager.isConnected = false
      })

      RedisManager.instance.on('end', () => {
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
      logger.info('Redis already connected, skipping connection')
      return
    }

    const config = RedisManager.getConfig()

    try {
      logger.info('Attempting to connect to Redis at %s:%d (db: %d)...', config.host, config.port, config.db)
      const client = RedisManager.getInstance()

      // 添加连接超时设置
      client.options.connectTimeout = 5000 // 5秒超时
      client.options.commandTimeout = 3000 // 3秒命令超时

      logger.info('Calling client.connect()...')
      await client.connect()

      // 测试连接
      logger.info('Testing Redis connection with PING...')
      const pingResult = await client.ping()
      logger.info({ pingResult }, 'Redis PING test successful')

      logger.info('Redis connected successfully to %s:%d', config.host, config.port)
    } catch (error) {
      logger.error({
        error,
        connectionDetails: {
          host: config.host,
          port: config.port,
          db: config.db,
          hasPassword: !!config.password
        }
      }, 'Failed to connect to Redis at %s:%d - Error: %s', config.host, config.port, error.message || 'Unknown error')

      // 提供诊断建议
      if (error.message?.includes('ECONNREFUSED')) {
        logger.error('Redis connection refused - please check if Redis server is running on %s:%d', config.host, config.port)
      } else if (error.message?.includes('ETIMEDOUT')) {
        logger.error('Redis connection timeout - please check network connectivity to %s:%d', config.host, config.port)
      } else if (error.message?.includes('AUTH')) {
        logger.error('Redis authentication failed - please check REDIS_PASSWORD environment variable')
      }

      // Redis 连接失败不应该阻止应用启动，只记录错误
      logger.warn('Application will continue without Redis')
    }
  }

  /**
   * 断开 Redis 连接
   */
  static async disconnect(): Promise<void> {
    if (!RedisManager.instance) {
      return
    }

    try {
      await RedisManager.instance.disconnect()
      RedisManager.instance = null
      RedisManager.isConnected = false
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

