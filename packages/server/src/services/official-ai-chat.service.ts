import { OpenAI } from 'openai'
import { config } from '../config/app.config.js'
import { billingService } from './billing.service.js'
import { officialAiUsageService } from './official-ai-usage.service.js'

type OfficialChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type OfficialChatInput = {
  userId: string
  modelId: string
  messages: OfficialChatMessage[]
  stream?: boolean
  temperature?: number
  maxTokens?: number
  tools?: object[]
  toolChoice?: string | object
}

export class OfficialAiChatService {
  private client = new OpenAI({
    apiKey: config.officialAi.apiKey || 'missing-official-ai-key',
    baseURL: config.officialAi.baseUrl,
    timeout: config.officialAi.timeoutMs
  })

  async createChatCompletion(input: OfficialChatInput) {
    if (!config.officialAi.enabled) {
      const error = new Error('官方模型暂不可用') as Error & { statusCode?: number; code?: string }
      error.statusCode = 503
      error.code = 'OFFICIAL_MODEL_DISABLED'
      throw error
    }

    const subscription = await billingService.getSubscriptionState(input.userId)
    if (!subscription.hasAiPlan) {
      const error = new Error('请开通 AI 会员后使用官方模型') as Error & {
        statusCode?: number
        code?: string
      }
      error.statusCode = 403
      error.code = 'AI_PLAN_REQUIRED'
      throw error
    }

    if (!officialAiUsageService.getOfficialModel(input.modelId)) {
      const error = new Error('官方模型不存在') as Error & { statusCode?: number; code?: string }
      error.statusCode = 404
      error.code = 'OFFICIAL_MODEL_NOT_FOUND'
      throw error
    }

    const reservation = await officialAiUsageService.reserveUsage(input.userId)
    if (!reservation.reserved) {
      const error = new Error('本月官方模型次数已用完') as Error & {
        statusCode?: number
        code?: string
      }
      error.statusCode = 429
      error.code = 'OFFICIAL_MODEL_QUOTA_EXCEEDED'
      throw error
    }

    try {
      if (input.stream) {
        return await this.client.chat.completions.create({
          model: input.modelId,
          messages: input.messages,
          stream: true,
          temperature: input.temperature,
          max_tokens: input.maxTokens,
          tools: input.tools as any,
          tool_choice: input.toolChoice as any
        })
      }

      const response = await this.client.chat.completions.create({
        model: input.modelId,
        messages: input.messages,
        stream: false,
        temperature: input.temperature,
        max_tokens: input.maxTokens,
        tools: input.tools as any,
        tool_choice: input.toolChoice as any
      })

      return {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        usage: response.usage
          ? {
              promptTokens: response.usage.prompt_tokens,
              completionTokens: response.usage.completion_tokens,
              totalTokens: response.usage.total_tokens
            }
          : undefined
      }
    } catch (error) {
      await officialAiUsageService.refundUsage(input.userId, reservation.periodKey)
      const wrapped = new Error('官方模型暂时不可用，请稍后再试') as Error & {
        statusCode?: number
        code?: string
        cause?: unknown
      }
      wrapped.statusCode = 502
      wrapped.code = 'OFFICIAL_MODEL_UPSTREAM_ERROR'
      wrapped.cause = error
      throw wrapped
    }
  }
}

export const officialAiChatService = new OfficialAiChatService()
