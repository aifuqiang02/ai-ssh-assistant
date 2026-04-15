import { beforeEach, describe, expect, it, vi } from 'vitest'

const findUniqueMock = vi.fn()
const createMock = vi.fn()
const updateManyMock = vi.fn()
const getSubscriptionStateMock = vi.fn()

vi.mock('../config/database.js', () => ({
  default: {
    getInstance: () => ({
      managedAiUsage: {
        findUnique: findUniqueMock,
        create: createMock,
        updateMany: updateManyMock
      }
    })
  }
}))

vi.mock('./billing.service.js', () => ({
  billingService: {
    getSubscriptionState: getSubscriptionStateMock
  }
}))

describe('OfficialAiUsageService', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    findUniqueMock.mockResolvedValue(null)
    createMock.mockResolvedValue(undefined)
    updateManyMock.mockResolvedValue({ count: 1 })
    getSubscriptionStateMock.mockResolvedValue({ hasAiPlan: true })
  })

  it('returns guest official status without quota usage', async () => {
    const { officialAiUsageService } = await import('./official-ai-usage.service.js')
    const result = await officialAiUsageService.getStatus()

    expect(result.guest).toBe(true)
    expect(result.hasAiPlan).toBe(false)
    expect(result.remainingCount).toBe(0)
    expect(result.models).toHaveLength(2)
  })

  it('returns remaining quota for ai member', async () => {
    findUniqueMock.mockResolvedValue({ usedCount: 12 })

    const { officialAiUsageService } = await import('./official-ai-usage.service.js')
    const result = await officialAiUsageService.getStatus('user_1')

    expect(result.hasAiPlan).toBe(true)
    expect(result.usedCount).toBe(12)
    expect(result.remainingCount).toBe(988)
  })

  it('creates usage row before reserving when monthly record does not exist', async () => {
    const { officialAiUsageService } = await import('./official-ai-usage.service.js')
    const result = await officialAiUsageService.reserveUsage('user_1')

    expect(createMock).toHaveBeenCalled()
    expect(updateManyMock).toHaveBeenCalled()
    expect(result.reserved).toBe(true)
  })

  it('refunds reserved usage', async () => {
    const { officialAiUsageService } = await import('./official-ai-usage.service.js')
    await officialAiUsageService.refundUsage('user_1', '2026-04')

    expect(updateManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user_1',
          periodKey: '2026-04'
        })
      })
    )
  })
})
