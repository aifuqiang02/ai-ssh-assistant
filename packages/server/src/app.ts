import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import rateLimit from '@fastify/rate-limit'

import { config } from './config/app.config.js'
import { logger } from './utils/safe-logger.js'
import { authenticate } from './utils/auth.js'
import Database from './config/database.js'
import RedisManager from './config/redis.js'
import { i18nMiddleware } from './config/i18n.js'

// 路由导入
import { authRoutes } from './routes/auth.routes.js'
import { officialAiRoutes } from './routes/official-ai.routes.js'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.logLevel,
      transport: config.isDev
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname'
            }
          }
        : undefined
    }
  })

  // 注册 CORS
  await app.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })

  // 注册 JWT
  await app.register(jwt, {
    secret: config.jwtSecret,
    sign: {
      algorithm: 'HS256',
      expiresIn: config.jwtExpiresIn
    }
  })

  // 注册限流
  await app.register(rateLimit, {
    max: config.rateLimitMax,
    timeWindow: config.rateLimitWindow * 1000,
    redis: RedisManager.getInstance(),
    nameSpace: 'ai-ssh-rate-limit:'
  })

  // 注册 i18n 中间件
  app.addHook('onRequest', i18nMiddleware)

  // 注册请求日志中间件（为每个请求创建 request.log）
  // safe-logger 的 loggerMiddleware 会在 onRequest/onResponse/onError 中记录请求相关日志
  const { loggerMiddleware } = await import('./utils/safe-logger.js')
  // loggerMiddleware is an object exposing a `register` function.
  // Avvio expects a plugin function or promise, so wrap it in an async plugin function.
  await app.register(async function loggerPlugin(server: any, _opts: any) {
    await loggerMiddleware.register(server)
  })

  // Swagger 文档（仅在开发环境启用）
  if (config.enableDocs && config.isDev) {
    await app.register(swagger, {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'AI SSH Assistant API',
          description: 'AI-powered SSH remote server management assistant API',
          version: '1.0.0',
          contact: {
            name: 'AI SSH Assistant Team',
            email: 'team@ai-ssh-assistant.com'
          }
        },
        servers: [
          {
            url: `http://${config.host}:${config.port}`,
            description: 'Development server'
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      }
    })

    await app.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1
      },
      staticCSP: true,
      transformStaticCSP: header => header
    })
  }

  // 健康检查
  app.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['基础设施'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
              version: { type: 'string' },
              services: {
                type: 'object',
                properties: {
                  database: { type: 'string' },
                  redis: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (_request, reply) => {
      try {
        // 检查数据库连接
        await Database.getInstance().$queryRaw`SELECT 1`
        const dbStatus = 'healthy'

        // 检查 Redis 连接
        const redisStatus = (await RedisManager.healthCheck()) ? 'healthy' : 'unhealthy'

        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          version: process.env.APP_VERSION || process.env.npm_package_version || '1.0.0',
          services: {
            database: dbStatus,
            redis: redisStatus
          }
        }
      } catch (error) {
        logger.error('Health check failed:', String(error))
        reply.status(503)
        return {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  )

  const legalPage = (title: string, body: string) => `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 880px; margin: 0 auto; padding: 40px 20px; line-height: 1.75; color: #1f2937; }
      h1 { margin-bottom: 20px; }
      h2 { margin-top: 28px; }
      p { margin: 12px 0; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    ${body}
  </body>
</html>`

  app.get('/legal/terms', async (_request, reply) => {
    reply.type('text/html; charset=utf-8')
    return legalPage(
      '用户协议',
      `
      <p>欢迎使用 AI SSH Assistant。使用本产品即表示你同意遵守本协议。</p>
      <h2>一、服务说明</h2>
      <p>本产品为开发与运维辅助工具，提供本地终端、远程连接、AI 协作等功能。</p>
      <h2>二、用户义务</h2>
      <p>你应合法使用本产品，不得将其用于任何违法违规、侵犯他人权益或危害系统安全的行为。</p>
      <h2>三、账号与登录</h2>
      <p>你应妥善保管登录信息，并对登录后产生的操作负责。</p>
      <h2>四、责任限制</h2>
      <p>因网络波动、第三方服务异常、用户误操作等原因造成的损失，平台将在法律允许范围内承担有限责任。</p>
      `
    )
  })

  app.get('/legal/privacy', async (_request, reply) => {
    reply.type('text/html; charset=utf-8')
    return legalPage(
      '隐私政策',
      `
      <p>我们重视你的隐私与数据安全。本政策说明我们如何收集、使用与保护你的信息。</p>
      <h2>一、收集的信息</h2>
      <p>在微信登录过程中，我们可能收集 openId、unionId、昵称、头像等必要信息，用于完成身份识别与账号登录。</p>
      <h2>二、信息用途</h2>
      <p>收集的信息仅用于登录认证、账号展示、系统功能提供与必要的安全审计。</p>
      <h2>三、信息存储</h2>
      <p>我们会采取合理的技术与管理措施保护你的信息不被泄露、篡改或滥用。</p>
      <h2>四、用户权利</h2>
      <p>你可以通过退出登录、停止使用或联系管理员等方式申请删除或更正相关信息。</p>
      `
    )
  })

  // 注册认证装饰器
  app.decorate('authenticate', authenticate)

  // 注册 API 路由
  await app.register(authRoutes, { prefix: '/api/v1/auth' })
  await app.register(officialAiRoutes, { prefix: '/api/v1/ai/official' })

  // 404 处理
  app.setNotFoundHandler(
    typeof app.rateLimit === 'function'
      ? {
          preHandler: app.rateLimit()
        }
      : {},
    async (request, reply) => {
      reply.status(404).send({
        success: false,
        message: 'Route not found',
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString()
      })
    }
  )

  // 全局错误处理
  app.setErrorHandler(async (error, request, reply) => {
    const statusCode = error.statusCode || 500

    logger.error(
      {
        error: error.message,
        stack: error.stack,
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
        statusCode
      },
      'Request error:'
    )

    // 验证错误
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        message: 'Validation error',
        errors: error.validation.map(err => ({
          field: err.instancePath?.replace('/', '') || err.schemaPath,
          message: err.message,
          value: (err as any).data
        }))
      })
    }

    // JWT 错误
    if (
      error.code === 'FST_JWT_BAD_REQUEST' ||
      error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER'
    ) {
      return reply.status(401).send({
        success: false,
        message: 'Authentication required',
        code: error.code
      })
    }

    // 限流错误
    if (error.code === 'FST_TOO_MANY_REQUESTS') {
      return reply.status(429).send({
        success: false,
        message: 'Too many requests',
        retryAfter: (error as any).retryAfter
      })
    }

    // 开发环境返回详细错误信息
    if (config.isDev) {
      return reply.status(statusCode).send({
        success: false,
        message: error.message,
        stack: error.stack,
        code: error.code
      })
    }

    // 生产环境返回通用错误信息
    return reply.status(statusCode).send({
      success: false,
      message: statusCode === 500 ? 'Internal server error' : error.message,
      code: error.code
    })
  })

  // 优雅关闭钩子
  app.addHook('onClose', async () => {
    // 应用关闭
  })

  return app
}
