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
const mockGetSubscriptionState = vi.fn().mockResolvedValue({
  trialExpiresAt: '2026-05-10T12:00:00.000Z',
  hasBasePlan: true,
  hasAiPlan: true,
  basePlanType: null,
  aiPlanType: null,
  baseExpiresAt: null,
  aiExpiresAt: null
})
const mockCreatePaymentSession = vi.fn().mockResolvedValue({
  sessionId: 'payment_session_xxx',
  appId: 'app_mnby1nrf4abd1f24f71395b7aba6',
  bizId: 'pay_xxx',
  status: 'pending',
  amount: 100,
  notifyUrl: 'http://127.0.0.1:3000/api/v1/payment/notify',
  qrCodeUrl: 'weixin://wxpay/bizpayurl?pr=example_native_code',
  checkoutUrl: 'weixin://wxpay/bizpayurl?pr=example_native_code',
  pollUrl:
    'https://open.tx07.cn/api/v1/apps/app_mnby1nrf4abd1f24f71395b7aba6/payment/sessions/by-biz/pay_xxx',
  expiresAt: '2026-03-18T10:00:00.000Z',
  paidAt: null,
  paymentProduct: {
    id: 'cmnt1em8j001xsao1ohcrn2x9',
    name: 'ai ssh订阅服务费',
    description: 'ai ssh订阅服务费',
    price: 100
  }
})
const mockActivateSubscription = vi.fn().mockResolvedValue({
  trialExpiresAt: '2026-05-10T12:00:00.000Z',
  hasBasePlan: true,
  hasAiPlan: false,
  basePlanType: 'monthly',
  aiPlanType: null,
  baseExpiresAt: '2026-06-10T12:00:00.000Z',
  aiExpiresAt: null
})
const mockOfficialGetStatus = vi.fn().mockResolvedValue({
  enabled: true,
  guest: true,
  requiresAiPlan: true,
  hasAiPlan: true,
  monthlyLimit: 1000,
  usedCount: 0,
  remainingCount: 0,
  resetAt: '2026-05-01T00:00:00.000Z',
  models: [
    {
      id: 'MiniMax-M2.7-highspeed',
      name: 'MiniMax-M2.7-highspeed',
      shortName: 'M2.7-highspeed',
      enabled: true
    },
    {
      id: 'MiniMax-M2.7',
      name: 'MiniMax-M2.7',
      shortName: 'MiniMax-M2.7',
      enabled: true
    }
  ]
})
const mockOfficialCreateChat = vi.fn().mockResolvedValue({
  content: '官方模型回复',
  model: 'MiniMax-M2.7-highspeed',
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

vi.mock('../services/billing.service.js', () => ({
  billingService: {
    getSubscriptionState: mockGetSubscriptionState,
    createPaymentSession: mockCreatePaymentSession,
    activateSubscription: mockActivateSubscription,
    handlePaymentNotify: vi.fn().mockResolvedValue({ success: true })
  }
}))

vi.mock('../services/official-ai-usage.service.js', () => ({
  officialAiUsageService: {
    getStatus: mockOfficialGetStatus,
    getOfficialModels: vi.fn().mockReturnValue([
      {
        id: 'MiniMax-M2.7-highspeed',
        name: 'MiniMax-M2.7-highspeed',
        shortName: 'M2.7-highspeed',
        enabled: true
      },
      {
        id: 'MiniMax-M2.7',
        name: 'MiniMax-M2.7',
        shortName: 'MiniMax-M2.7',
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

  it('returns current subscription state for authenticated user', async () => {
    const token = app.jwt.sign({ userId: 'user_wechat_1', uuid: 'uuid_wechat_1', role: 'USER' })
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/billing/subscription',
      headers: { authorization: `Bearer ${token}` }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data.hasBasePlan).toBe(true)
    expect(mockGetSubscriptionState).toHaveBeenCalledWith('user_wechat_1')
  })

  it('returns official model guest status without authentication', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ai/official/status'
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data.guest).toBe(true)
    expect(response.json().data.models).toHaveLength(2)
    expect(mockOfficialGetStatus).toHaveBeenCalledWith(undefined)
  })

  it('creates official model chat for authenticated user', async () => {
    const token = app.jwt.sign({ userId: 'user_wechat_1', uuid: 'uuid_wechat_1', role: 'USER' })
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ai/official/chat',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        modelId: 'MiniMax-M2.7-highspeed',
        messages: [{ role: 'user', content: '你好' }],
        stream: false
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data.content).toBe('官方模型回复')
    expect(mockOfficialCreateChat).toHaveBeenCalledWith({
      userId: 'user_wechat_1',
      modelId: 'MiniMax-M2.7-highspeed',
      messages: [{ role: 'user', content: '你好' }],
      stream: false,
      temperature: undefined,
      maxTokens: undefined,
      tools: undefined,
      toolChoice: undefined
    })
  })

  it('creates payment session for authenticated user', async () => {
    const token = app.jwt.sign({ userId: 'user_wechat_1', uuid: 'uuid_wechat_1', role: 'USER' })
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/payment/sessions',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        bizId: 'pay_xxx',
        planCode: 'BASE_MONTHLY'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data.sessionId).toBe('payment_session_xxx')
    expect(mockCreatePaymentSession).toHaveBeenCalled()
  })

  it('activates subscription after successful payment verification', async () => {
    const token = app.jwt.sign({ userId: 'user_wechat_1', uuid: 'uuid_wechat_1', role: 'USER' })
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/billing/activate-subscription',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        bizId: 'pay_xxx',
        sessionId: 'payment_session_xxx',
        planCode: 'BASE_MONTHLY'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().data.hasBasePlan).toBe(true)
    expect(mockActivateSubscription).toHaveBeenCalledWith({
      userId: 'user_wechat_1',
      bizId: 'pay_xxx',
      sessionId: 'payment_session_xxx',
      planCode: 'BASE_MONTHLY'
    })
  })
})
