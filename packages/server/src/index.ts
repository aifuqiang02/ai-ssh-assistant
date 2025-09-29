import { buildApp } from './app.js'
import { logger } from './utils/safe-logger.js'
import { config } from './config/app.config.js'
import Database from './config/database.js'
import RedisManager from './config/redis.js'

async function startServer() {
  try {
    // 连接数据库
    await Database.connect()
    logger.info('Database connected successfully')

    // 连接 Redis
    await RedisManager.connect()
    logger.info('Redis connected successfully')

    // 构建应用
    const app = await buildApp()

    // 启动服务器
    const address = await app.listen({
      port: config.port,
      host: config.host
    })

    logger.info(`🚀 Server running at ${address}`)
    logger.info(`📚 API Documentation: ${address}/docs`)
    logger.info(`🔍 Health Check: ${address}/health`)

    // 优雅关闭处理
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`)
      
      try {
        // 关闭服务器
        await app.close()
        logger.info('Server closed')

        // 断开数据库连接
        await Database.disconnect()
        logger.info('Database disconnected')

        // 断开 Redis 连接
        await RedisManager.disconnect()
        logger.info('Redis disconnected')

        process.exit(0)
      } catch (error) {
        logger.error('Error during shutdown:', String(error))
        process.exit(1)
      }
    }

    // 监听进程信号
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // 处理未捕获的异常
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', String(error))
      process.exit(1)
    })

    process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
      logger.error('Unhandled Rejection at: %o, reason: %s', promise, String(reason))
      process.exit(1)
    })

  } catch (error) {
    logger.error('Failed to start server:', String(error))
    process.exit(1)
  }
}

// 启动服务器
startServer()

