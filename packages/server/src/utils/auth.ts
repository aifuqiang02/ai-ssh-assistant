import { FastifyRequest, FastifyReply } from 'fastify'
import { logger } from './safe-logger.js'

// 扩展 Fastify 类型
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

// JWT 认证中间件
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    logger.warn('JWT verification failed: %s', String(error))
    reply.status(401).send({
      success: false,
      message: '认证失败，请重新登录',
      code: 'AUTHENTICATION_FAILED'
    })
  }
}

// 角色检查中间件工厂
export function requireRole(roles: string | string[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user
    
    if (!user) {
      return reply.status(401).send({
        success: false,
        message: '认证失败',
        code: 'NOT_AUTHENTICATED'
      })
    }
    
    if (!allowedRoles.includes((user as any).role)) {
      return reply.status(403).send({
        success: false,
        message: '权限不足',
        code: 'INSUFFICIENT_PERMISSIONS'
      })
    }
  }
}

// 可选认证中间件（不强制要求登录）
export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    // 忽略认证错误，允许匿名访问
  }
}

