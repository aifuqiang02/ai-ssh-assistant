import { beforeEach, describe, expect, it, vi } from 'vitest'

const createCompletionMock = vi.fn()
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
    getOfficialModelMock.mockReturnValue({ id: 'gpt-last' })
    reserveUsageMock.mockResolvedValue({ reserved: true, periodKey: '2026-04-12' })
    createCompletionMock.mockResolvedValue({
      choices: [{ message: { content: 'ok' } }],
      model: 'gpt-last',
      usage: {
        prompt_tokens: 1,
        completion_tokens: 2,
        total_tokens: 3
      }
    })
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
      modelId: 'gpt-last',
      messages: [{ role: 'user', content: 'hello' }],
      tools: [{ type: 'function', function: { name: 'bash', parameters: { type: 'object' } } }],
      toolChoice: 'auto',
      stream: false
    })

    expect(result).toEqual({
      content: 'ok',
      model: 'gpt-last',
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
      }),
      expect.any(Object)
    )
  })

  it('refunds usage on upstream failure', async () => {
    createCompletionMock.mockRejectedValue(new Error('upstream failed'))
    const { officialAiChatService } = await import('./official-ai-chat.service.js')

    await expect(
      officialAiChatService.createChatCompletion({
        userId: 'user_1',
        modelId: 'gpt-last',
        messages: [{ role: 'user', content: 'hello' }],
        stream: false
      })
    ).rejects.toMatchObject({ code: 'OFFICIAL_MODEL_UPSTREAM_ERROR' })

    expect(refundUsageMock).toHaveBeenCalledWith('user_1', '2026-04-12')
  })

  it('passes request cancellation to the OpenAI SDK', async () => {
    const controller = new AbortController()
    const { officialAiChatService } = await import('./official-ai-chat.service.js')

    await officialAiChatService.createChatCompletion({
      userId: 'user_1',
      modelId: 'gpt-last',
      messages: [{ role: 'user', content: 'hello' }],
      stream: true,
      signal: controller.signal
    })

    expect(createCompletionMock).toHaveBeenCalledWith(
      expect.objectContaining({ stream: true }),
      { signal: controller.signal }
    )
  })

  it('surfaces daily quota exhaustion without calling upstream', async () => {
    reserveUsageMock.mockResolvedValue({ reserved: false, periodKey: '2026-04-12' })
    const { officialAiChatService } = await import('./official-ai-chat.service.js')

    await expect(
      officialAiChatService.createChatCompletion({
        userId: 'user_1',
        modelId: 'gpt-last',
        messages: [{ role: 'user', content: 'hello' }]
      })
    ).rejects.toMatchObject({
      code: 'OFFICIAL_MODEL_QUOTA_EXCEEDED',
      statusCode: 429,
      message: '今日官方模型调用次数已用完'
    })
    expect(createCompletionMock).not.toHaveBeenCalled()
  })
})
