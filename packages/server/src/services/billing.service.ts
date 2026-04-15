import Database from '../config/database.js'
import { logger } from '../utils/safe-logger.js'
import {
  PaymentOrderStatus,
  SubscriptionPlanCode,
  SubscriptionPlanType
} from '../../../database/src/generated/client/index.js'

const PAYMENT_APP_ID = 'app_mnby1nrf4abd1f24f71395b7aba6'
const PAYMENT_PRODUCT_ID = 'cmnt1em8j001xsao1ohcrn2x9'
const PAYMENT_BASE_URL =
  'https://open.tx07.cn/api/v1/apps/app_mnby1nrf4abd1f24f71395b7aba6/payment/sessions'

const PLAN_AMOUNTS: Record<SubscriptionPlanCode, number> = {
  [SubscriptionPlanCode.BASE_MONTHLY]: 200,
  [SubscriptionPlanCode.BASE_YEARLY]: 2000,
  [SubscriptionPlanCode.BASE_LIFETIME]: 9900,
  [SubscriptionPlanCode.AI_MONTHLY]: 300,
  [SubscriptionPlanCode.FULL_MONTHLY]: 500,
  [SubscriptionPlanCode.FULL_YEARLY]: 5000,
  [SubscriptionPlanCode.FULL_LIFETIME]: 19900
}

type BillingSubscriptionPayload = {
  trialExpiresAt: string | null
  hasBasePlan: boolean
  hasAiPlan: boolean
  basePlanType: 'monthly' | 'yearly' | 'lifetime' | null
  aiPlanType: 'monthly' | 'yearly' | 'lifetime' | null
  baseExpiresAt: string | null
  aiExpiresAt: string | null
}

type PaymentPlatformSession = {
  sessionId: string
  appId: string
  bizId: string
  status: 'pending' | 'paid' | 'expired' | 'closed'
  amount: number
  notifyUrl: string
  qrCodeUrl: string
  checkoutUrl: string
  pollUrl: string
  expiresAt: string
  paidAt: string | null
  paymentProduct: {
    id: string
    name: string
    description: string
    price: number
  }
  businessNotify?: {
    status: string
    attempts: number
    notifiedAt: string | null
    response: string | null
    error: string | null
  }
}

type PaymentPlatformEnvelope = {
  code?: number
  msg?: string
  data?: PaymentPlatformSession
}

async function parsePaymentPlatformResponse(response: Response) {
  const rawText = await response.text()
  let payload: PaymentPlatformEnvelope | null = null

  try {
    payload = rawText ? (JSON.parse(rawText) as PaymentPlatformEnvelope) : null
  } catch {
    payload = null
  }

  return {
    rawText,
    payload
  }
}

function toPlanType(
  value: SubscriptionPlanType | null
): BillingSubscriptionPayload['basePlanType'] {
  switch (value) {
    case SubscriptionPlanType.MONTHLY:
      return 'monthly'
    case SubscriptionPlanType.YEARLY:
      return 'yearly'
    case SubscriptionPlanType.LIFETIME:
      return 'lifetime'
    default:
      return null
  }
}

function hasActivePaidPlan(planType: SubscriptionPlanType | null, expiresAt: Date | null) {
  if (!planType) return false
  if (planType === SubscriptionPlanType.LIFETIME) return true
  return Boolean(expiresAt && expiresAt.getTime() > Date.now())
}

function hasActiveTrial(trialExpiresAt: Date | null) {
  return Boolean(trialExpiresAt && trialExpiresAt.getTime() > Date.now())
}

function addMonths(base: Date, months: number) {
  const next = new Date(base)
  next.setMonth(next.getMonth() + months)
  return next
}

function addYears(base: Date, years: number) {
  const next = new Date(base)
  next.setFullYear(next.getFullYear() + years)
  return next
}

function getPlanConfig(planCode: SubscriptionPlanCode) {
  switch (planCode) {
    case SubscriptionPlanCode.BASE_MONTHLY:
      return { basePlanType: SubscriptionPlanType.MONTHLY, baseDuration: 'monthly' as const }
    case SubscriptionPlanCode.BASE_YEARLY:
      return { basePlanType: SubscriptionPlanType.YEARLY, baseDuration: 'yearly' as const }
    case SubscriptionPlanCode.BASE_LIFETIME:
      return { basePlanType: SubscriptionPlanType.LIFETIME, baseDuration: 'lifetime' as const }
    case SubscriptionPlanCode.AI_MONTHLY:
      return { aiPlanType: SubscriptionPlanType.MONTHLY, aiDuration: 'monthly' as const }
    case SubscriptionPlanCode.FULL_MONTHLY:
      return {
        basePlanType: SubscriptionPlanType.MONTHLY,
        baseDuration: 'monthly' as const,
        aiPlanType: SubscriptionPlanType.MONTHLY,
        aiDuration: 'monthly' as const
      }
    case SubscriptionPlanCode.FULL_YEARLY:
      return {
        basePlanType: SubscriptionPlanType.YEARLY,
        baseDuration: 'yearly' as const,
        aiPlanType: SubscriptionPlanType.YEARLY,
        aiDuration: 'yearly' as const
      }
    case SubscriptionPlanCode.FULL_LIFETIME:
      return {
        basePlanType: SubscriptionPlanType.LIFETIME,
        baseDuration: 'lifetime' as const,
        aiPlanType: SubscriptionPlanType.LIFETIME,
        aiDuration: 'lifetime' as const
      }
  }
}

export class BillingService {
  private prisma = Database.getInstance()

  async ensureSubscription(userId: string) {
    const existing = await this.prisma.userSubscription.findUnique({ where: { userId } })
    if (existing) {
      return existing
    }

    const trialExpiresAt = addMonths(new Date(), 1)
    return this.prisma.userSubscription.create({
      data: {
        userId,
        trialExpiresAt
      }
    })
  }

  async getSubscriptionState(userId: string): Promise<BillingSubscriptionPayload> {
    const subscription = await this.ensureSubscription(userId)
    const trialActive = hasActiveTrial(subscription.trialExpiresAt)

    return {
      trialExpiresAt: subscription.trialExpiresAt?.toISOString() || null,
      hasBasePlan:
        trialActive || hasActivePaidPlan(subscription.basePlanType, subscription.baseExpiresAt),
      hasAiPlan:
        trialActive || hasActivePaidPlan(subscription.aiPlanType, subscription.aiExpiresAt),
      basePlanType: toPlanType(subscription.basePlanType),
      aiPlanType: toPlanType(subscription.aiPlanType),
      baseExpiresAt: subscription.baseExpiresAt?.toISOString() || null,
      aiExpiresAt: subscription.aiExpiresAt?.toISOString() || null
    }
  }

  async createPaymentSession(input: {
    bizId: string
    planCode: SubscriptionPlanCode
    notifyUrl: string
    userId: string
  }) {
    const amount = PLAN_AMOUNTS[input.planCode]
    if (!amount) {
      throw new Error(`未知套餐类型: ${input.planCode}`)
    }

    const response = await fetch(PAYMENT_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentProductId: PAYMENT_PRODUCT_ID,
        amount,
        bizId: input.bizId,
        notifyUrl: input.notifyUrl
      })
    })

    const { payload, rawText } = await parsePaymentPlatformResponse(response)

    logger.info(
      {
        httpStatus: response.status,
        platformCode: payload?.code,
        platformMsg: payload?.msg,
        payload,
        rawText
      },
      'Payment platform create session response'
    )

    if (!response.ok || payload?.code !== 200 || !payload?.data) {
      throw new Error(payload?.msg || rawText || '生成支付二维码失败')
    }

    await this.prisma.paymentOrder.upsert({
      where: { bizId: input.bizId },
      update: {
        sessionId: payload.data.sessionId,
        planCode: input.planCode,
        paymentProductId: payload.data.paymentProduct.id,
        amount: payload.data.amount,
        status: PaymentOrderStatus.PENDING,
        rawPlatformPayload: payload.data
      },
      create: {
        bizId: input.bizId,
        sessionId: payload.data.sessionId,
        userId: input.userId,
        planCode: input.planCode,
        paymentProductId: payload.data.paymentProduct.id,
        amount: payload.data.amount,
        status: PaymentOrderStatus.PENDING,
        rawPlatformPayload: payload.data
      }
    })

    return payload.data
  }

  async queryPaymentSessionByBizId(bizId: string) {
    const response = await fetch(`${PAYMENT_BASE_URL}/by-biz/${bizId}`)
    const { payload, rawText } = await parsePaymentPlatformResponse(response)

    logger.info(
      {
        httpStatus: response.status,
        platformCode: payload?.code,
        platformMsg: payload?.msg,
        payload,
        rawText,
        bizId
      },
      'Payment platform query session response'
    )

    if (!response.ok || payload?.code !== 200 || !payload?.data) {
      throw new Error(payload?.msg || rawText || '查询支付结果失败')
    }

    return payload.data
  }

  async activateSubscription(input: {
    userId: string
    bizId: string
    sessionId: string
    planCode: SubscriptionPlanCode
  }) {
    const platformSession = await this.queryPaymentSessionByBizId(input.bizId)

    if (platformSession.sessionId !== input.sessionId) {
      throw new Error('支付会话不匹配')
    }

    if (platformSession.status !== 'paid') {
      throw new Error('支付尚未完成')
    }

    const existingOrder = await this.prisma.paymentOrder.findUnique({
      where: { bizId: input.bizId }
    })
    if (existingOrder?.status === PaymentOrderStatus.ACTIVATED) {
      return this.getSubscriptionState(input.userId)
    }

    const subscription = await this.ensureSubscription(input.userId)
    const now = new Date()
    const config = getPlanConfig(input.planCode)

    let nextBasePlanType = subscription.basePlanType
    let nextBaseExpiresAt = subscription.baseExpiresAt
    let nextAiPlanType = subscription.aiPlanType
    let nextAiExpiresAt = subscription.aiExpiresAt

    if ('basePlanType' in config) {
      nextBasePlanType = config.basePlanType
      if (config.baseDuration === 'lifetime') {
        nextBaseExpiresAt = null
      } else {
        const start =
          subscription.baseExpiresAt && subscription.baseExpiresAt > now
            ? subscription.baseExpiresAt
            : now
        nextBaseExpiresAt =
          config.baseDuration === 'yearly' ? addYears(start, 1) : addMonths(start, 1)
      }
    }

    if ('aiPlanType' in config) {
      nextAiPlanType = config.aiPlanType
      if (config.aiDuration === 'lifetime') {
        nextAiExpiresAt = null
      } else {
        const start =
          subscription.aiExpiresAt && subscription.aiExpiresAt > now
            ? subscription.aiExpiresAt
            : now
        nextAiExpiresAt = config.aiDuration === 'yearly' ? addYears(start, 1) : addMonths(start, 1)
      }
    }

    await this.prisma.$transaction([
      this.prisma.userSubscription.update({
        where: { userId: input.userId },
        data: {
          basePlanType: nextBasePlanType,
          baseExpiresAt: nextBaseExpiresAt,
          aiPlanType: nextAiPlanType,
          aiExpiresAt: nextAiExpiresAt
        }
      }),
      this.prisma.paymentOrder.upsert({
        where: { bizId: input.bizId },
        update: {
          sessionId: input.sessionId,
          userId: input.userId,
          planCode: input.planCode,
          paymentProductId: platformSession.paymentProduct.id,
          amount: platformSession.amount,
          status: PaymentOrderStatus.ACTIVATED,
          paidAt: platformSession.paidAt ? new Date(platformSession.paidAt) : now,
          activatedAt: now,
          rawPlatformPayload: platformSession
        },
        create: {
          bizId: input.bizId,
          sessionId: input.sessionId,
          userId: input.userId,
          planCode: input.planCode,
          paymentProductId: platformSession.paymentProduct.id,
          amount: platformSession.amount,
          status: PaymentOrderStatus.ACTIVATED,
          paidAt: platformSession.paidAt ? new Date(platformSession.paidAt) : now,
          activatedAt: now,
          rawPlatformPayload: platformSession
        }
      })
    ])

    return this.getSubscriptionState(input.userId)
  }

  async handlePaymentNotify(payload: Record<string, unknown>) {
    logger.info({ payload }, 'Received payment notify callback')
    return { success: true }
  }
}

export const billingService = new BillingService()
