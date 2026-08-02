import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { FastifyInstance } from 'fastify'

const mockFindUserByWechatIdentity = vi.fn().mockResolvedValue(null)
const mockCreateWechatUser = vi.fn().mockResolvedValue({
  id: 'user_wechat_1',
  uuid: 'uuid_wechat_1',
  email: null,
  username: '微信用户',
  avatar: 'https://thirdwx.qlogo.cn/avatar.png',
  role: 'USER',
  isActive: true,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z')
})
const mockOfficialGetStatus = vi.fn().mockReturnValue({
  enabled: true,
  models: [
    {
      id: 'gpt-last',
      name: 'gpt-last',
      shortName: 'gpt-last',
      enabled: true
    }
  ]
})
const mockOfficialCreateChat = vi.fn().mockResolvedValue({
  content: '官方模型回复',
  model: 'gpt-last',
  usage: {
    promptTokens: 10,
    completionTokens: 20,
    totalTokens: 30
  }
})

vi.mock('../services/user.service.js', async () => {
  const actual = await vi.importActual<typeof import('../services/user.service.js')>(
    '../services/user.service.js'
  )
  return {
    ...actual,
    userService: {
      ...actual.userService,
      validateEmailFormat: vi.fn().mockReturnValue(true),
      findUserByEmail: vi.fn().mockResolvedValue(null),
      validatePassword: vi.fn().mockResolvedValue(false),
      updateLastLogin: vi.fn().mockResolvedValue(undefined),
      isEmailExists: vi.fn().mockResolvedValue(false),
      isUsernameExists: vi.fn().mockResolvedValue(false),
      createUser: vi.fn(),
      findUserByWechatIdentity: mockFindUserByWechatIdentity,
      createWechatUser: mockCreateWechatUser,
      updateWechatProfile: vi.fn()
    }
  }
})

vi.mock('@fastify/rate-limit', () => ({
  default: async function rateLimitPlugin(app: any) {
    app.decorate('rateLimit', () => async function rateLimitHandler() {})
  }
}))

vi.mock('../config/database.js', () => ({
  default: {
    getInstance: () => ({
      $queryRaw: vi.fn().mockResolvedValue(1)
    })
  }
}))

vi.mock('../config/redis.js', () => ({
  default: {
    getInstance: () => ({
      on: vi.fn(),
      defineCommand: vi.fn(),
      script: vi.fn(),
      evalsha: vi.fn(),
      eval: vi.fn(),
      incr: vi.fn(),
      pttl: vi.fn(),
      pexpire: vi.fn()
    }),
    healthCheck: vi.fn().mockResolvedValue(true)
  }
}))

vi.mock('../services/official-ai-usage.service.js', () => ({
  officialAiUsageService: {
    getStatus: mockOfficialGetStatus,
    getOfficialModels: vi.fn().mockReturnValue([
      {
        id: 'gpt-last',
        name: 'gpt-last',
        shortName: 'gpt-last',
        enabled: true
      }
    ]),
    getOfficialModel: vi.fn(),
    reserveUsage: vi.fn(),
    refundUsage: vi.fn()
  }
}))

vi.mock('../services/official-ai-chat.service.js', () => ({
  officialAiChatService: {
    createChatCompletion: mockOfficialCreateChat
  }
}))

describe('App', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test'
    process.env.JWT_SECRET = '12345678901234567890123456789012'
    process.env.ENCRYPTION_KEY = '12345678901234567890123456789012'
    process.env.SESSION_SECRET = '12345678901234567890123456789012'

    const { buildApp } = await import('../app.js')
    app = await buildApp()
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  it('serves health endpoint', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
  })

  it('does not expose removed system routes', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/system/info'
    })

    expect(response.statusCode).toBe(404)
  })

  it('does not expose version endpoint', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/version'
    })

    expect(response.statusCode).toBe(404)
  })

  it('serves public terms page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/legal/terms'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.body).toContain('用户协议')
  })

  it('serves public privacy page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/legal/privacy'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.body).toContain('隐私政策')
  })

  it('exchanges successful wechat profile for business login tokens', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/wechat-login',
      payload: {
        bizId: 'biz_123',
        appId: 'app_mnby1nrf4abd1f24f71395b7aba6',
        openId: 'openid_123',
        unionId: 'unionid_123',
        nickname: '微信用户',
        avatarUrl: 'https://thirdwx.qlogo.cn/avatar.png'
      }
    })

    expect(response.statusCode).toBe(200)

    const body = response.json()
    expect(body.success).toBe(true)
    expect(body.data.user.wechatProfile.openId).toBe('openid_123')
    expect(body.data.user.wechatProfile.nickname).toBe('微信用户')
    expect(body.data.accessToken).toBeTruthy()
    expect(body.data.refreshToken).toBeTruthy()
    expect(mockFindUserByWechatIdentity).toHaveBeenCalledWith('openid_123', 'unionid_123')
    expect(mockCreateWechatUser).toHaveBeenCalled()
  })

  it('requires authentication for official model status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai/official/status'
    })

    expect(response.statusCode).toBe(401)
    expect(mockOfficialGetStatus).not.toHaveBeenCalled()
  })

  it('serves fresh official model status for authenticated users', async () => {
    const token = app.jwt.sign({ userId: 'user_wechat_1', uuid: 'uuid_wechat_1', role: 'USER' })
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai/official/status',
      headers: { authorization: `Bearer ${token}` }
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['cache-control']).toBe('no-store, no-cache, must-revalidate')
    expect(response.headers.pragma).toBe('no-cache')
    expect(response.json().data.models[0].id).toBe('gpt-last')
  })

  it('creates official model chat for authenticated user', async () => {
    const token = app.jwt.sign({ userId: 'user_wechat_1', uuid: 'uuid_wechat_1', role: 'USER' })
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/official/chat',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        modelId: 'gpt-last',
        messages: [{ role: 'user', content: '你好' }],
        stream: false
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data.content).toBe('官方模型回复')
    expect(mockOfficialCreateChat).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user_wechat_1',
        modelId: 'gpt-last',
        messages: [{ role: 'user', content: '你好' }],
        stream: false,
        signal: expect.any(AbortSignal)
      })
    )
  })

  it.each(['/api/v1/billing/subscription', '/api/v1/payment/sessions'])(
    'does not expose removed billing route %s',
    async url => {
      const response = await app.inject({ method: 'GET', url })
      expect(response.statusCode).toBe(404)
    }
  )
})
