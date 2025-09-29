import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'

import { config } from './config/app.config.js'
import { logger } from './utils/safe-logger.js'
import { authenticate } from './utils/auth.js'
import Database from './config/database.js'
import RedisManager from './config/redis.js'

// 路由导入
import { authRoutes } from './routes/auth.routes.js'
import { userRoutes } from './routes/user.routes.js'
import { sshRoutes } from './routes/ssh.routes.js'
import { aiRoutes } from './routes/ai.routes.js'
import { fileRoutes } from './routes/file.routes.js'
import { systemRoutes } from './routes/system.routes.js'

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.logLevel,
      transport: config.isDev ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      } : undefined
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

  // 注册文件上传
  await app.register(multipart, {
    limits: {
      fileSize: config.upload.maxSize,
      files: 10
    }
  })

  // Swagger 文档
  if (config.enableDocs) {
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
            },
            sessionAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'x-session-id'
            }
          }
        },
        security: [
          { bearerAuth: [] },
          { sessionAuth: [] }
        ]
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
      transformStaticCSP: (header) => header
    })
  }

  // 健康检查
  app.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['System'],
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
  }, async (_request, reply) => {
    try {
      // 检查数据库连接
      await Database.getInstance().$queryRaw`SELECT 1`
      const dbStatus = 'healthy'
      
      // 检查 Redis 连接
      const redisStatus = await RedisManager.healthCheck() ? 'healthy' : 'unhealthy'

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
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
  })

  // API 版本信息
  app.get('/version', {
    schema: {
      description: 'Get API version information',
      tags: ['System'],
      response: {
        200: {
          type: 'object',
          properties: {
            version: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            author: { type: 'string' },
            buildDate: { type: 'string' },
            nodeVersion: { type: 'string' },
            environment: { type: 'string' }
          }
        }
      }
    }
  }, async () => {
    return {
      version: process.env.npm_package_version || '1.0.0',
      name: 'AI SSH Assistant API',
      description: 'AI-powered SSH remote server management assistant',
      author: 'AI SSH Assistant Team',
      buildDate: new Date().toISOString(),
      nodeVersion: process.version,
      environment: config.nodeEnv
    }
  })

  // 注册认证装饰器
  app.decorate('authenticate', authenticate)

  // 注册 API 路由
  await app.register(authRoutes, { prefix: '/api/v1/auth' })
  await app.register(userRoutes, { prefix: '/api/v1/users' })
  await app.register(sshRoutes, { prefix: '/api/v1/ssh' })
  await app.register(aiRoutes, { prefix: '/api/v1/ai' })
  await app.register(fileRoutes, { prefix: '/api/v1/files' })
  await app.register(systemRoutes, { prefix: '/api/v1/system' })

  // 404 处理
  app.setNotFoundHandler({
    preHandler: app.rateLimit()
  }, async (request, reply) => {
    reply.status(404).send({
      success: false,
      message: 'Route not found',
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    })
  })

  // 全局错误处理
  app.setErrorHandler(async (error, request, reply) => {
    const statusCode = error.statusCode || 500
    
    logger.error({
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      headers: request.headers,
      body: request.body,
      statusCode
    }, 'Request error:')

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
    if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
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
    logger.info('Application shutting down...')
  })

  // 请求日志钩子
  app.addHook('onRequest', async (request) => {
    logger.info({
      ip: request.ip,
      userAgent: request.headers['user-agent']
    }, `${request.method} ${request.url}`)
  })

  // 响应日志钩子
  app.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.elapsedTime
    logger.info({
      responseTime: `${responseTime.toFixed(2)}ms`,
      contentLength: reply.getHeader('content-length')
    }, `${request.method} ${request.url} - ${reply.statusCode}`)
  })

  return app
}

