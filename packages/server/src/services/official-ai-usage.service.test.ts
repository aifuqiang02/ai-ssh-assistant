import { beforeEach, describe, expect, it, vi } from 'vitest'

const upsertMock = vi.fn()
const updateManyMock = vi.fn()

vi.mock('../config/database.js', () => ({
  default: {
    getInstance: () => ({
      managedAiUsage: {
        upsert: upsertMock,
        updateMany: updateManyMock
      }
    })
  }
}))

describe('OfficialAiUsageService', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    upsertMock.mockResolvedValue(undefined)
    updateManyMock.mockResolvedValue({ count: 1 })
  })

  it('returns model availability without exposing quota usage', async () => {
    const { officialAiUsageService } = await import('./official-ai-usage.service.js')
    const result = officialAiUsageService.getStatus()

    expect(result.models).toEqual([
      expect.objectContaining({ id: 'gpt-last', enabled: true })
    ])
    expect(result).not.toHaveProperty('usedCount')
    expect(result).not.toHaveProperty('remainingCount')
    expect(result).not.toHaveProperty('dailyLimit')
  })

  it('uses Asia/Shanghai calendar days for usage periods', async () => {
    const { getBusinessDayKey } = await import('./official-ai-usage.service.js')

    expect(getBusinessDayKey(new Date('2026-04-11T15:59:59.999Z'))).toBe('2026-04-11')
    expect(getBusinessDayKey(new Date('2026-04-11T16:00:00.000Z'))).toBe('2026-04-12')
  })

  it('upserts a daily usage row before atomically reserving', async () => {
    const { officialAiUsageService } = await import('./official-ai-usage.service.js')
    const result = await officialAiUsageService.reserveUsage('user_1')

    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ limitCount: 100 })
      })
    )
    expect(updateManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ usedCount: { lt: 100 } })
      })
    )
    expect(result.reserved).toBe(true)
    expect(result.periodKey).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('refunds reserved usage', async () => {
    const { officialAiUsageService } = await import('./official-ai-usage.service.js')
    await officialAiUsageService.refundUsage('user_1', '2026-04-12')

    expect(updateManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user_1',
          periodKey: '2026-04-12'
        })
      })
    )
  })
})
