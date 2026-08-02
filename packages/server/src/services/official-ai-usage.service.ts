import Database from '../config/database.js'
import { config } from '../config/app.config.js'

const OFFICIAL_FEATURE_KEY = 'official_ai_chat'
const OFFICIAL_DAILY_LIMIT = 100

export interface OfficialModelStatusModel {
  id: string
  name: string
  shortName: string
  description?: string
  enabled: boolean
}

export interface OfficialModelStatusPayload {
  enabled: boolean
  models: OfficialModelStatusModel[]
}

function createOfficialModels(): OfficialModelStatusModel[] {
  return config.officialAi.models.map(modelId => ({
    id: modelId,
    name: modelId,
    shortName: modelId,
    enabled: true
  }))
}

export function getBusinessDayKey(now = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.officialAi.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const parts = formatter.formatToParts(now)
  const year = parts.find(part => part.type === 'year')?.value || '1970'
  const month = parts.find(part => part.type === 'month')?.value || '01'
  const day = parts.find(part => part.type === 'day')?.value || '01'
  return `${year}-${month}-${day}`
}

export class OfficialAiUsageService {
  private prisma = Database.getInstance()

  getOfficialModels() {
    return createOfficialModels()
  }

  getOfficialModel(modelId: string) {
    return this.getOfficialModels().find(model => model.id === modelId) || null
  }

  getStatus(): OfficialModelStatusPayload {
    return {
      enabled: config.officialAi.enabled,
      models: this.getOfficialModels()
    }
  }

  async reserveUsage(userId: string) {
    const periodKey = getBusinessDayKey()
    await this.prisma.managedAiUsage.upsert({
      where: {
        userId_featureKey_periodKey: { userId, featureKey: OFFICIAL_FEATURE_KEY, periodKey }
      },
      update: {},
      create: {
        userId,
        featureKey: OFFICIAL_FEATURE_KEY,
        periodKey,
        usedCount: 0,
        limitCount: OFFICIAL_DAILY_LIMIT
      }
    })

    const updated = await this.prisma.managedAiUsage.updateMany({
      where: {
        userId,
        featureKey: OFFICIAL_FEATURE_KEY,
        periodKey,
        usedCount: { lt: OFFICIAL_DAILY_LIMIT }
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
