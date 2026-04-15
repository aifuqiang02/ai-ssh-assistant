import { beforeEach, describe, expect, it, vi } from 'vitest'

const createCompletionMock = vi.fn()
const getSubscriptionStateMock = vi.fn()
const getOfficialModelMock = vi.fn()
const reserveUsageMock = vi.fn()
const refundUsageMock = vi.fn()

vi.mock('openai', () => ({
  OpenAI: class {
    chat = {
      completions: {
        create: createCompletionMock
      }
    }
  }
}))

vi.mock('./billing.service.js', () => ({
  billingService: {
    getSubscriptionState: getSubscriptionStateMock
  }
}))

vi.mock('./official-ai-usage.service.js', () => ({
  officialAiUsageService: {
    getOfficialModel: getOfficialModelMock,
    reserveUsage: reserveUsageMock,
    refundUsage: refundUsageMock
  }
}))

describe('OfficialAiChatService', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    getSubscriptionStateMock.mockResolvedValue({ hasAiPlan: true })
    getOfficialModelMock.mockReturnValue({ id: 'MiniMax-M2.7-highspeed' })
    reserveUsageMock.mockResolvedValue({ reserved: true, periodKey: '2026-04' })
    createCompletionMock.mockResolvedValue({
      choices: [{ message: { content: 'ok' } }],
      model: 'MiniMax-M2.7-highspeed',
      usage: {
        prompt_tokens: 1,
        completion_tokens: 2,
        total_tokens: 3
      }
    })
  })

  it('rejects when ai membership is missing', async () => {
    getSubscriptionStateMock.mockResolvedValue({ hasAiPlan: false })
    const { officialAiChatService } = await import('./official-ai-chat.service.js')

    await expect(
      officialAiChatService.createChatCompletion({
        userId: 'user_1',
        modelId: 'MiniMax-M2.7-highspeed',
        messages: [{ role: 'user', content: 'hello' }],
        stream: false
      })
    ).rejects.toMatchObject({ code: 'AI_PLAN_REQUIRED' })
  })

  it('rejects when official model is missing', async () => {
    getOfficialModelMock.mockReturnValue(null)
    const { officialAiChatService } = await import('./official-ai-chat.service.js')

    await expect(
      officialAiChatService.createChatCompletion({
        userId: 'user_1',
        modelId: 'missing-model',
        messages: [{ role: 'user', content: 'hello' }],
        stream: false
      })
    ).rejects.toMatchObject({ code: 'OFFICIAL_MODEL_NOT_FOUND' })
  })

  it('returns normalized non-stream response for official chat', async () => {
    const { officialAiChatService } = await import('./official-ai-chat.service.js')
    const result = await officialAiChatService.createChatCompletion({
      userId: 'user_1',
      modelId: 'MiniMax-M2.7-highspeed',
      messages: [{ role: 'user', content: 'hello' }],
      tools: [{ type: 'function', function: { name: 'bash', parameters: { type: 'object' } } }],
      toolChoice: 'auto',
      stream: false
    })

    expect(result).toEqual({
      content: 'ok',
      model: 'MiniMax-M2.7-highspeed',
      usage: {
        promptTokens: 1,
        completionTokens: 2,
        totalTokens: 3
      }
    })
    expect(createCompletionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        tools: [{ type: 'function', function: { name: 'bash', parameters: { type: 'object' } } }],
        tool_choice: 'auto'
      })
    )
  })

  it('refunds usage on upstream failure', async () => {
    createCompletionMock.mockRejectedValue(new Error('upstream failed'))
    const { officialAiChatService } = await import('./official-ai-chat.service.js')

    await expect(
      officialAiChatService.createChatCompletion({
        userId: 'user_1',
        modelId: 'MiniMax-M2.7-highspeed',
        messages: [{ role: 'user', content: 'hello' }],
        stream: false
      })
    ).rejects.toMatchObject({ code: 'OFFICIAL_MODEL_UPSTREAM_ERROR' })

    expect(refundUsageMock).toHaveBeenCalledWith('user_1', '2026-04')
  })
})
