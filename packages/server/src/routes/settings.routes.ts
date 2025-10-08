import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'
import { settingsService } from '../services/settings.service.js'
import { successResponseSchema } from '../schemas/common.schema.js'

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
      response: successResponseSchema
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 从 JWT token 中获取用户 ID
      const user = request.user as any
      const userId = user.userId

      // 获取用户设置
      const settings = await settingsService.getUserSettings(userId)
      
      if (!settings) {
        // 如果没有设置，返回空对象（首次使用）
        return reply.send({
          success: true,
          message: '用户设置为空',
          settings: {}
        })
      }
      
      // 🔍 临时调试：直接返回原始数据看看
      return reply.send({
        success: true,
        message: '获取设置成功',
        settings: settings.data
      })
    } catch (error: any) {
      console.error('[Settings API] Get settings error:', error)
      logger.error('[Settings API] Get settings error:', error)
      return reply.status(500).send({
        success: false,
        message: error.message || '获取设置失败',
        code: 'GET_SETTINGS_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
          settings: { 
            type: 'object',
            additionalProperties: true
          }
        }
      },
      response: successResponseSchema
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<SaveSettingsRequest>, reply: FastifyReply) => {
    try {
      // 从 JWT token 中获取用户 ID
      const user = request.user as any
      const userId = user.userId
      const { settings } = request.body
      
      // 保存用户设置
      const savedSettings = await settingsService.saveUserSettings(userId, settings)

      return reply.send({
        success: true,
        message: '保存设置成功',
        settings: savedSettings.data
      })
    } catch (error: any) {
      console.error('[Settings API] Save settings error:', error)
      logger.error('[Settings API] Save settings error:', error)
      return reply.status(500).send({
        success: false,
        message: error.message || '保存设置失败',
        code: 'SAVE_SETTINGS_ERROR',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
  })

  // 删除用户设置
  fastify.delete('/settings', {
    schema: {
      description: '删除用户设置（从 JWT token 获取用户信息）',
      tags: ['设置'],
      security: [{ bearerAuth: [] }],
      response: successResponseSchema
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 从 JWT token 中获取用户 ID
      const user = request.user as any
      const userId = user.userId

      // 删除用户设置
      await settingsService.deleteUserSettings(userId)

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

