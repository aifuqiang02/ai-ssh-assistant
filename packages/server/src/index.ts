import { buildApp } from './app.js'
import { logger } from './utils/safe-logger.js'
import { config } from './config/app.config.js'
import Database from './config/database.js'
import RedisManager from './config/redis.js'
import { initI18n } from './config/i18n.js'
import { autoMigrateIfEnabled } from './bootstrap/prisma-migrate.js'

async function startServer() {
  try {
    const bootStartedAt = Date.now()
    logger.info('🧭 Boot step 1/6: init i18n start')

    // 初始化 i18n
    await initI18n()
    logger.info({ elapsedMs: Date.now() - bootStartedAt }, '🧭 Boot step 1/6: init i18n done')

    // 启动时自动迁移（可通过 AUTO_MIGRATE=true 开启）
    logger.info({ autoMigrate: config.autoMigrate }, '🧭 Boot step 2/6: auto migrate start')
    await autoMigrateIfEnabled(config.autoMigrate)
    logger.info({ elapsedMs: Date.now() - bootStartedAt }, '🧭 Boot step 2/6: auto migrate done')

    // 连接数据库
    logger.info('🧭 Boot step 3/6: database connect start')
    await Database.connect()
    logger.info(
      { elapsedMs: Date.now() - bootStartedAt },
      '🧭 Boot step 3/6: database connect done'
    )

    // 连接 Redis
    logger.info('🧭 Boot step 4/6: redis connect start')
    await RedisManager.connect()
    logger.info({ elapsedMs: Date.now() - bootStartedAt }, '🧭 Boot step 4/6: redis connect done')

    // 构建应用
    logger.info('🧭 Boot step 5/6: build app start')
    const app = await buildApp()
    logger.info({ elapsedMs: Date.now() - bootStartedAt }, '🧭 Boot step 5/6: build app done')

    // 启动服务器 - 支持端口重试
    logger.info({ host: config.host, port: config.port }, '🧭 Boot step 6/6: listen start')
    let address: string
    const maxRetries = 5
    let currentPort = config.port

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        address = await app.listen({
          port: currentPort,
          host: config.host
        })
        logger.info(
          { elapsedMs: Date.now() - bootStartedAt, currentPort },
          '🧭 Boot step 6/6: listen done'
        )
        break
      } catch (error: any) {
        logger.error({ error, currentPort, attempt }, '🧭 Listen attempt failed')
        if (error.code === 'EADDRINUSE' && attempt < maxRetries - 1) {
          logger.warn(`Port ${currentPort} is in use, trying port ${currentPort + 1}...`)
          currentPort++
          continue
        }
        throw error
      }
    }

    // 启动成功日志
    const actualPort = currentPort || config.port
    logger.info(`🚀 Server running at: ${address}`)
    logger.info(`📚 API Documentation: http://${config.host}:${actualPort}/docs`)
    logger.info(`🔍 Health Check: http://${config.host}:${actualPort}/health`)
    logger.info(`📊 Environment: ${config.nodeEnv}`)
    logger.info(`🗄️  Database: ${Database.getStatus()}`)
    logger.info(`🔴 Redis: ${RedisManager.getStatus()}`)
    if (actualPort !== config.port) {
      logger.warn(`⚠️  Original port ${config.port} was in use, using port ${actualPort} instead`)
    }

    // 优雅关闭处理
    const gracefulShutdown = async (_signal: string) => {
      try {
        // 关闭服务器
        await app.close()

        // 断开数据库连接
        await Database.disconnect()

        // 断开 Redis 连接
        await RedisManager.disconnect()

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
    process.on('uncaughtException', error => {
      // 记录完整错误堆栈并退出
      logger.error({ err: error, stack: (error as any)?.stack }, 'Uncaught Exception')
      process.exit(1)
    })

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      // reason 可能是 Error 或任意值，尽量记录详细信息
      logger.error(
        { reason, stack: reason instanceof Error ? reason.stack : undefined },
        'Unhandled Rejection at promise'
      )
      void promise
      process.exit(1)
    })
  } catch (error) {
    logger.error({ error }, 'Failed to start server')
    process.exit(1)
  }
}

// 启动服务器
startServer()
