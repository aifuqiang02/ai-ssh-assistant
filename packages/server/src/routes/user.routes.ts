import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'
import { successResponseSchema } from '../schemas/common.schema.js'

interface UpdateProfileBody {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  bio?: string
  avatar?: string
}

interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export async function userRoutes(fastify: FastifyInstance) {
  // 获取当前用户信息
  fastify.get('/profile', {
    schema: {
      description: '获取当前用户信息',
      tags: ['用户'],
      security: [{ bearerAuth: [] }],
      response: successResponseSchema
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as any

      // 模拟用户数据
      const userProfile = {
        id: user.userId,
        username: user.username,
        email: 'user@example.com',
        firstName: '张',
        lastName: '三',
        bio: '这是一个演示用户的个人简介。',
        avatar: 'https://via.placeholder.com/150',
        role: user.role,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLogin: new Date().toISOString()
      }

      return reply.send({
        success: true,
        data: userProfile
      })
    } catch (error) {
      logger.error('Get profile error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取用户信息失败',
        code: 'GET_PROFILE_ERROR'
      })
    }
  })

  // 更新用户信息
  fastify.put<{ Body: UpdateProfileBody }>('/profile', {
    schema: {
      description: '更新用户信息',
      tags: ['用户'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string', maxLength: 50 },
          lastName: { type: 'string', maxLength: 50 },
          bio: { type: 'string', maxLength: 500 },
          avatar: { type: 'string', format: 'uri' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Body: UpdateProfileBody }>, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const updates = request.body

      logger.info(`User ${user.username} updating profile`, updates)

      // 模拟更新成功
      const updatedProfile = {
        id: user.userId,
        username: updates.username || user.username,
        email: updates.email || 'user@example.com',
        firstName: updates.firstName || '张',
        lastName: updates.lastName || '三',
        bio: updates.bio || '这是一个演示用户的个人简介。',
        avatar: updates.avatar || 'https://via.placeholder.com/150',
        role: user.role,
        updatedAt: new Date().toISOString()
      }

      return reply.send({
        success: true,
        message: '用户信息更新成功',
        data: updatedProfile
      })
    } catch (error) {
      logger.error('Update profile error:', error)
      return reply.status(500).send({
        success: false,
        message: '更新用户信息失败',
        code: 'UPDATE_PROFILE_ERROR'
      })
    }
  })

  // 修改密码
  fastify.put<{ Body: ChangePasswordBody }>('/password', {
    schema: {
      description: '修改用户密码',
      tags: ['用户'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['currentPassword', 'newPassword', 'confirmNewPassword'],
        properties: {
          currentPassword: { type: 'string', minLength: 6, maxLength: 100 },
          newPassword: { type: 'string', minLength: 6, maxLength: 100 },
          confirmNewPassword: { type: 'string', minLength: 6, maxLength: 100 }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Body: ChangePasswordBody }>, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const { currentPassword, newPassword, confirmNewPassword } = request.body

      // 验证新密码确认
      if (newPassword !== confirmNewPassword) {
        return reply.status(400).send({
          success: false,
          message: '新密码确认不匹配',
          code: 'PASSWORD_MISMATCH'
        })
      }

      // 验证新密码不能与当前密码相同
      if (currentPassword === newPassword) {
        return reply.status(400).send({
          success: false,
          message: '新密码不能与当前密码相同',
          code: 'SAME_PASSWORD'
        })
      }

      logger.info(`User ${user.username} changed password`)

      return reply.send({
        success: true,
        message: '密码修改成功'
      })
    } catch (error) {
      logger.error('Change password error:', error)
      return reply.status(500).send({
        success: false,
        message: '修改密码失败',
        code: 'CHANGE_PASSWORD_ERROR'
      })
    }
  })

  // 获取用户列表（管理员）
  fastify.get('/list', {
    schema: {
      description: '获取用户列表（管理员权限）',
      tags: ['用户'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          search: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'user'] },
          sortBy: { type: 'string', enum: ['username', 'email', 'createdAt'], default: 'createdAt' },
          sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ 
    Querystring: { 
      page?: number
      limit?: number
      search?: string
      role?: string
      sortBy?: string
      sortOrder?: string
    } 
  }>, reply: FastifyReply) => {
    try {
      const user = request.user as any
      
      // 检查管理员权限
      if (user.role !== 'admin') {
        return reply.status(403).send({
          success: false,
          message: '权限不足',
          code: 'INSUFFICIENT_PERMISSIONS'
        })
      }

      const { page = 1, limit = 20, search, role, sortBy = 'createdAt', sortOrder = 'desc' } = request.query

      // 模拟用户列表数据
      const users = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
          lastLogin: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          username: 'user1',
          email: 'user1@example.com',
          role: 'user',
          createdAt: '2024-01-02T00:00:00.000Z',
          lastLogin: '2024-01-10T10:30:00.000Z',
          status: 'active'
        }
      ]

      const filteredUsers = users.filter(u => {
        if (search && !u.username.includes(search) && !u.email.includes(search)) {
          return false
        }
        if (role && u.role !== role) {
          return false
        }
        return true
      })

      const total = filteredUsers.length
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

      return reply.send({
        success: true,
        data: {
          users: paginatedUsers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: endIndex < total,
            hasPrev: page > 1
          }
        }
      })
    } catch (error) {
      logger.error('Get users list error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取用户列表失败',
        code: 'GET_USERS_ERROR'
      })
    }
  })

  // 删除用户账户
  fastify.delete('/account', {
    schema: {
      description: '删除用户账户',
      tags: ['用户'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['password'],
        properties: {
          password: { type: 'string', minLength: 6, maxLength: 100 }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ Body: { password: string } }>, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const { password } = request.body

      logger.info(`User ${user.username} requested account deletion`)

      return reply.send({
        success: true,
        message: '账户已成功删除'
      })
    } catch (error) {
      logger.error('Delete account error:', error)
      return reply.status(500).send({
        success: false,
        message: '删除账户失败',
        code: 'DELETE_ACCOUNT_ERROR'
      })
    }
  })
}

