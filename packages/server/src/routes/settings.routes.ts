import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'
import { settingsService } from '../services/settings.service.js'

// 不需要 GetSettingsRequest 接口，userId 从 token 中获取

interface SaveSettingsRequest {
  Body: {
    settings: any
  }
}

export async function settingsRoutes(fastify: FastifyInstance) {
  // 获取用户设置
  fastify.get('/settings', {
    schema: {
      description: '获取用户设置（从 JWT token 获取用户信息）',
      tags: ['设置'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            settings: { type: 'object' }
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
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 从 JWT token 中获取用户 ID
      const user = request.user as any
      const userId = user.userId

      logger.info(`[Settings API] Getting settings for user: ${userId}`)

      // 获取用户设置
      const settings = await settingsService.getUserSettings(userId)

      if (!settings) {
        logger.info(`[Settings API] No settings found for user ${userId}, returning empty object`)
        // 如果没有设置，返回空对象（首次使用）
        return reply.send({
          success: true,
          message: '用户设置为空',
          settings: {}
        })
      }

      logger.info(`[Settings API] Settings found for user ${userId}`)
      return reply.send({
        success: true,
        message: '获取设置成功',
        settings: settings.data
      })
    } catch (error) {
      logger.error('[Settings API] Get settings error:', error)
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
      description: '保存用户设置（从 JWT token 获取用户信息）',
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
            settings: { type: 'object' }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<SaveSettingsRequest>, reply: FastifyReply) => {
    try {
      // 从 JWT token 中获取用户 ID
      const user = request.user as any
      const userId = user.userId
      const { settings } = request.body

      logger.info(`[Settings API] Saving settings for user: ${userId}`)

      // 保存用户设置
      const savedSettings = await settingsService.saveUserSettings(userId, settings)

      logger.info(`[Settings API] Settings saved successfully for user ${userId}`)
      return reply.send({
        success: true,
        message: '保存设置成功',
        settings: savedSettings.data
      })
    } catch (error) {
      logger.error('[Settings API] Save settings error:', error)
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
      description: '删除用户设置（从 JWT token 获取用户信息）',
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
      // 从 JWT token 中获取用户 ID
      const user = request.user as any
      const userId = user.userId

      logger.info(`[Settings API] Deleting settings for user: ${userId}`)

      // 删除用户设置
      await settingsService.deleteUserSettings(userId)

      logger.info(`[Settings API] Settings deleted successfully for user ${userId}`)
      return reply.send({
        success: true,
        message: '删除设置成功'
      })
    } catch (error) {
      logger.error('[Settings API] Delete settings error:', error)
      return reply.status(500).send({
        success: false,
        message: '删除设置失败',
        code: 'DELETE_SETTINGS_ERROR'
      })
    }
  })
}

