/**
 * 通用的 Fastify Schema 定义
 * 用于统一路由响应格式
 */

/**
 * 标准成功响应 Schema (200)
 * 允许返回任意对象结构
 */
export const successResponseSchema = {
  200: {
    type: 'object',
    additionalProperties: true
  }
} as const

/**
 * 标准错误响应 Schema
 */
export const errorResponseSchema = {
  400: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      code: { type: 'string' }
    }
  },
  401: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      code: { type: 'string' }
    }
  },
  404: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      code: { type: 'string' }
    }
  },
  500: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      code: { type: 'string' }
    }
  }
} as const

/**
 * 完整的响应 Schema (成功 + 错误)
 */
export const standardResponseSchema = {
  ...successResponseSchema,
  ...errorResponseSchema
} as const

/**
 * 仅成功响应的 Schema 对象
 */
export const createSuccessResponse = () => ({
  response: successResponseSchema
})

/**
 * 完整响应的 Schema 对象（成功 + 错误）
 */
export const createStandardResponse = () => ({
  response: standardResponseSchema
})

