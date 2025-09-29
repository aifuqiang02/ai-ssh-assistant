import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/logger.js'
import { userService, UserResponse } from '../services/user.service.js'

interface LoginBody {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterBody {
  username: string
  email: string
  password: string
}

interface RefreshTokenBody {
  refreshToken: string
}

export async function authRoutes(fastify: FastifyInstance) {
  // 用户登录
  fastify.post<{ Body: LoginBody }>('/login', {
    schema: {
      description: '用户登录',
      tags: ['认证'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, maxLength: 100 },
          rememberMe: { type: 'boolean', default: false }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    uuid: { type: 'string' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    avatar: { type: 'string' },
                    role: { type: 'string' },
                    isActive: { type: 'boolean' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' }
                  }
                },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                expiresIn: { type: 'number' }
              }
            }
          }
        },
        401: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    try {
      const { email, password, rememberMe } = request.body

      // 验证邮箱格式
      if (!userService.validateEmailFormat(email)) {
        return reply.status(400).send({
          success: false,
          message: '邮箱格式不正确',
          code: 'INVALID_EMAIL_FORMAT'
        })
      }

      // 查找用户
      const user = await userService.findUserByEmail(email)
      if (!user) {
        return reply.status(401).send({
          success: false,
          message: '邮箱或密码错误',
          code: 'INVALID_CREDENTIALS'
        })
      }

      // 检查用户是否激活
      if (!user.isActive) {
        return reply.status(401).send({
          success: false,
          message: '账户已被禁用',
          code: 'ACCOUNT_DISABLED'
        })
      }

      // 验证密码
      const isPasswordValid = await userService.validatePassword(user, password)
      if (!isPasswordValid) {
        return reply.status(401).send({
          success: false,
          message: '邮箱或密码错误',
          code: 'INVALID_CREDENTIALS'
        })
      }

      // 更新最后登录时间
      await userService.updateLastLogin(user.id)

      // 生成JWT令牌
      const accessToken = fastify.jwt.sign(
        { 
          userId: user.id,
          uuid: user.uuid, 
          username: user.username,
          email: user.email,
          role: user.role 
        },
        { 
          expiresIn: rememberMe ? '7d' : '1d' 
        }
      )

      const refreshToken = fastify.jwt.sign(
        { 
          userId: user.id,
          uuid: user.uuid,
          type: 'refresh' 
        },
        { 
          expiresIn: '30d' 
        }
      )

      // 返回用户信息（不包含密码）
      const userResponse: UserResponse = {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }

      logger.info(`User ${user.username} (${email}) logged in successfully`)

      return reply.send({
        success: true,
        message: '登录成功',
        data: {
          user: userResponse,
          accessToken,
          refreshToken,
          expiresIn: rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60 // seconds
        }
      })
    } catch (error) {
      logger.error('Login error:', error)
      return reply.status(500).send({
        success: false,
        message: '登录失败',
        code: 'LOGIN_ERROR'
      })
    }
  })

  // 用户注册
  fastify.post<{ Body: RegisterBody }>('/register', {
    schema: {
      description: '用户注册',
      tags: ['认证'],
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 2, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, maxLength: 100 }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    uuid: { type: 'string' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    avatar: { type: 'string' },
                    role: { type: 'string' },
                    isActive: { type: 'boolean' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
    try {
      const { username, email, password } = request.body

      // 验证邮箱格式
      if (!userService.validateEmailFormat(email)) {
        return reply.status(400).send({
          success: false,
          message: '邮箱格式不正确',
          code: 'INVALID_EMAIL_FORMAT'
        })
      }

      // 验证用户名格式
      const usernameValidation = userService.validateUsernameFormat(username)
      if (!usernameValidation.isValid) {
        return reply.status(400).send({
          success: false,
          message: usernameValidation.message,
          code: 'INVALID_USERNAME_FORMAT'
        })
      }

      // 验证密码强度
      const passwordValidation = userService.validatePasswordStrength(password)
      if (!passwordValidation.isValid) {
        return reply.status(400).send({
          success: false,
          message: passwordValidation.message,
          code: 'WEAK_PASSWORD'
        })
      }

      // 检查邮箱是否已存在
      const emailExists = await userService.isEmailExists(email)
      if (emailExists) {
        return reply.status(409).send({
          success: false,
          message: '该邮箱已被注册',
          code: 'EMAIL_EXISTS'
        })
      }

      // 检查用户名是否已存在
      const usernameExists = await userService.isUsernameExists(username)
      if (usernameExists) {
        return reply.status(409).send({
          success: false,
          message: '该用户名已被使用',
          code: 'USERNAME_EXISTS'
        })
      }

      // 创建用户
      const user = await userService.createUser({
        email,
        username,
        password
      })

      logger.info(`New user registered: ${username} (${email})`)

      return reply.status(201).send({
        success: true,
        message: '注册成功',
        data: { user }
      })
    } catch (error) {
      logger.error('Register error:', error)
      
      // 处理已知错误
      if (error instanceof Error) {
        if (error.message.includes('该邮箱已被注册')) {
          return reply.status(409).send({
            success: false,
            message: error.message,
            code: 'EMAIL_EXISTS'
          })
        }
        if (error.message.includes('该用户名已被使用')) {
          return reply.status(409).send({
            success: false,
            message: error.message,
            code: 'USERNAME_EXISTS'
          })
        }
      }

      return reply.status(500).send({
        success: false,
        message: '注册失败，请稍后重试',
        code: 'REGISTER_ERROR'
      })
    }
  })

  // 刷新令牌
  fastify.post<{ Body: RefreshTokenBody }>('/refresh', {
    schema: {
      description: '刷新访问令牌',
      tags: ['认证'],
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: RefreshTokenBody }>, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body

      // 验证刷新令牌
      const decoded = fastify.jwt.verify(refreshToken) as any

      if (decoded.type !== 'refresh') {
        return reply.status(401).send({
          success: false,
          message: '无效的刷新令牌',
          code: 'INVALID_REFRESH_TOKEN'
        })
      }

      // 生成新的访问令牌
      const accessToken = fastify.jwt.sign(
        { 
          userId: decoded.userId, 
          username: decoded.username, 
          role: decoded.role 
        },
        { 
          expiresIn: '1d' 
        }
      )

      return reply.send({
        success: true,
        message: '令牌刷新成功',
        data: {
          accessToken,
          expiresIn: 24 * 60 * 60 // 24 hours in seconds
        }
      })
    } catch (error) {
      logger.error('Token refresh error:', error)
      return reply.status(401).send({
        success: false,
        message: '令牌刷新失败',
        code: 'TOKEN_REFRESH_ERROR'
      })
    }
  })

  // 用户登出
  fastify.post('/logout', {
    schema: {
      description: '用户登出',
      tags: ['认证'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 这里可以将令牌加入黑名单
      logger.info(`User ${(request.user as any)?.username} logged out`)

      return reply.send({
        success: true,
        message: '登出成功'
      })
    } catch (error) {
      logger.error('Logout error:', error)
      return reply.status(500).send({
        success: false,
        message: '登出失败',
        code: 'LOGOUT_ERROR'
      })
    }
  })

  // 验证令牌
  fastify.get('/verify', {
    schema: {
      description: '验证访问令牌',
      tags: ['认证'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as any

      return reply.send({
        success: true,
        message: '令牌验证成功',
        data: {
          user: {
            id: user.userId,
            username: user.username,
            role: user.role
          }
        }
      })
    } catch (error) {
      logger.error('Token verify error:', error)
      return reply.status(401).send({
        success: false,
        message: '令牌验证失败',
        code: 'TOKEN_VERIFY_ERROR'
      })
    }
  })
}
