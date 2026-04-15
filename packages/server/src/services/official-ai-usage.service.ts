import Database from '../config/database.js'
import { config } from '../config/app.config.js'
import { billingService } from './billing.service.js'

const OFFICIAL_FEATURE_KEY = 'official_ai_chat'
const OFFICIAL_MONTHLY_LIMIT = 1000

export interface OfficialModelStatusModel {
  id: string
  name: string
  shortName: string
  description?: string
  enabled: boolean
}

export interface OfficialModelStatusPayload {
  enabled: boolean
  guest?: boolean
  requiresAiPlan: boolean
  hasAiPlan: boolean
  monthlyLimit: number
  usedCount: number
  remainingCount: number
  resetAt: string
  models: OfficialModelStatusModel[]
}

function createOfficialModels(): OfficialModelStatusModel[] {
  return config.officialAi.models.map(modelId => ({
    id: modelId,
    name: modelId,
    shortName: modelId.replace('MiniMax-', ''),
    enabled: true
  }))
}

function getBusinessMonthKey(now = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.officialAi.timezone,
    year: 'numeric',
    month: '2-digit'
  })
  const parts = formatter.formatToParts(now)
  const year = parts.find(part => part.type === 'year')?.value || '1970'
  const month = parts.find(part => part.type === 'month')?.value || '01'
  return `${year}-${month}`
}

function getResetAt(now = new Date()): string {
  const local = new Date(now)
  const yearMonthFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.officialAi.timezone,
    year: 'numeric',
    month: '2-digit'
  })
  const parts = yearMonthFormatter.formatToParts(local)
  const year = Number(parts.find(part => part.type === 'year')?.value || '1970')
  const month = Number(parts.find(part => part.type === 'month')?.value || '1')
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  return new Date(Date.UTC(nextYear, nextMonth - 1, 1, 0, 0, 0)).toISOString()
}

export class OfficialAiUsageService {
  private prisma = Database.getInstance()

  getOfficialModels() {
    return createOfficialModels()
  }

  getOfficialModel(modelId: string) {
    return this.getOfficialModels().find(model => model.id === modelId) || null
  }

  async getStatus(userId?: string | null): Promise<OfficialModelStatusPayload> {
    const models = this.getOfficialModels()
    const base = {
      enabled: config.officialAi.enabled,
      requiresAiPlan: true,
      monthlyLimit: OFFICIAL_MONTHLY_LIMIT,
      resetAt: getResetAt(),
      models
    }

    if (!userId) {
      return {
        ...base,
        guest: true,
        hasAiPlan: false,
        usedCount: 0,
        remainingCount: 0
      }
    }

    const subscription = await billingService.getSubscriptionState(userId)
    if (!subscription.hasAiPlan) {
      return {
        ...base,
        hasAiPlan: false,
        usedCount: 0,
        remainingCount: 0
      }
    }

    const usage = await this.prisma.managedAiUsage.findUnique({
      where: {
        userId_featureKey_periodKey: {
          userId,
          featureKey: OFFICIAL_FEATURE_KEY,
          periodKey: getBusinessMonthKey()
        }
      }
    })

    const usedCount = usage?.usedCount || 0
    return {
      ...base,
      hasAiPlan: true,
      usedCount,
      remainingCount: Math.max(OFFICIAL_MONTHLY_LIMIT - usedCount, 0)
    }
  }

  async reserveUsage(userId: string) {
    const periodKey = getBusinessMonthKey()
    const existing = await this.prisma.managedAiUsage.findUnique({
      where: {
        userId_featureKey_periodKey: {
          userId,
          featureKey: OFFICIAL_FEATURE_KEY,
          periodKey
        }
      }
    })

    if (!existing) {
      await this.prisma.managedAiUsage.create({
        data: {
          userId,
          featureKey: OFFICIAL_FEATURE_KEY,
          periodKey,
          usedCount: 0,
          limitCount: OFFICIAL_MONTHLY_LIMIT
        }
      })
    }

    const updated = await this.prisma.managedAiUsage.updateMany({
      where: {
        userId,
        featureKey: OFFICIAL_FEATURE_KEY,
        periodKey,
        usedCount: { lt: OFFICIAL_MONTHLY_LIMIT }
      },
      data: {
        usedCount: { increment: 1 }
      }
    })

    return {
      reserved: updated.count > 0,
      periodKey
    }
  }

  async refundUsage(userId: string, periodKey: string) {
    await this.prisma.managedAiUsage.updateMany({
      where: {
        userId,
        featureKey: OFFICIAL_FEATURE_KEY,
        periodKey,
        usedCount: { gt: 0 }
      },
      data: {
        usedCount: { decrement: 1 }
      }
    })
  }
}

export const officialAiUsageService = new OfficialAiUsageService()
