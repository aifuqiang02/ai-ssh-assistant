import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'
import { settingsService } from '../services/settings.service.js'

interface GetSettingsRequest {
  Querystring: {
    userId?: string
  }
}

interface SaveSettingsRequest {
  Body: {
    settings: any
  }
}

export async function settingsRoutes(fastify: FastifyInstance) {
  // 获取用户设置
  fastify.get('/settings', {
    schema: {
      description: '获取用户设置',
      tags: ['设置'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'string' }
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
                settings: { type: 'object' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<GetSettingsRequest>, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const userId = user.userId

      logger.info(`Getting settings for user: ${userId}`)

      // 获取用户设置
      const settings = await settingsService.getUserSettings(userId)

      if (!settings) {
        return reply.status(404).send({
          success: false,
          message: '未找到用户设置',
          code: 'SETTINGS_NOT_FOUND'
        })
      }

      return reply.send({
        success: true,
        message: '获取设置成功',
        data: {
          settings: settings.data
        }
      })
    } catch (error) {
      logger.error('Get settings error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取设置失败',
        code: 'GET_SETTINGS_ERROR'
      })
    }
  })

  // 保存用户设置
  fastify.post('/settings', {
    schema: {
      description: '保存用户设置',
      tags: ['设置'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['settings'],
        properties: {
          settings: { type: 'object' }
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
                settings: { type: 'object' }
              }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<SaveSettingsRequest>, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const userId = user.userId
      const { settings } = request.body

      logger.info(`Saving settings for user: ${userId}`)

      // 保存用户设置
      const savedSettings = await settingsService.saveUserSettings(userId, settings)

      return reply.send({
        success: true,
        message: '保存设置成功',
        data: {
          settings: savedSettings.data
        }
      })
    } catch (error) {
      logger.error('Save settings error:', error)
      return reply.status(500).send({
        success: false,
        message: '保存设置失败',
        code: 'SAVE_SETTINGS_ERROR'
      })
    }
  })

  // 删除用户设置
  fastify.delete('/settings', {
    schema: {
      description: '删除用户设置',
      tags: ['设置'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const userId = user.userId

      logger.info(`Deleting settings for user: ${userId}`)

      // 删除用户设置
      await settingsService.deleteUserSettings(userId)

      return reply.send({
        success: true,
        message: '删除设置成功'
      })
    } catch (error) {
      logger.error('Delete settings error:', error)
      return reply.status(500).send({
        success: false,
        message: '删除设置失败',
        code: 'DELETE_SETTINGS_ERROR'
      })
    }
  })
}

