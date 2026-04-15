/**
 * AI 智能建议管理器
 * 基于上下文提供智能命令建议
 */

import type { Suggestion } from '@/types/autocomplete'
import type { AIProvider, AIModel } from '@/types/ai-providers'
import { chatCompletion } from '@/services/ai-api.service'
import { settingsService } from '@/services/settings.service'
import { resolveSelectedModel } from '@/services/selected-model-resolver.service'

export class AISuggestionManager {
  private isEnabled: boolean = false
  private currentProvider: AIProvider | null = null
  private currentModel: AIModel | null = null
  private cache: Map<string, { suggestions: Suggestion[]; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 2 * 60 * 1000 // 2分钟缓存（缩短缓存时间）
  private requestInProgress: Map<string, Promise<Suggestion[]>> = new Map()
  private lastCommandPrefix: string = '' // 记录上次的命令前缀
  private lastDirectory: string = '' // 记录上次的目录

  constructor() {
    this.loadAIConfig()
  }

  /**
   * 加载 AI 配置
   */
  private async loadAIConfig(): Promise<void> {
    try {
      const saved = localStorage.getItem('selectedAIModel')
      if (!saved) {
        this.isEnabled = false
        this.currentProvider = null
        this.currentModel = null
        return
      }

      const resolved = resolveSelectedModel(
        saved,
        (await settingsService.getSettings())?.aiProviders || []
      )
      if (resolved?.source === 'official') {
        this.isEnabled = false
        this.currentProvider = null
        this.currentModel = null
        return
      }

      const parsed = JSON.parse(saved)

      // 新格式：完整的 provider 和 model 对象
      if (parsed.provider && parsed.model) {
        this.currentProvider = parsed.provider
        this.currentModel = parsed.model

        // 获取 API 密钥
        const settings = await settingsService.getSettings()
        const configs = settings?.aiProviders || []
        const providerConfig = configs.find((p: any) => p.id === this.currentProvider?.id)

        if (providerConfig?.apiKey && this.currentProvider && this.currentModel) {
          this.currentProvider = {
            ...this.currentProvider,
            apiKey: providerConfig.apiKey
          }
          this.isEnabled = true
        } else {
          this.isEnabled = false
          this.currentProvider = null
          this.currentModel = null
        }
      } else {
        this.isEnabled = false
        this.currentProvider = null
        this.currentModel = null
      }
    } catch (error) {
      // 加载 AI 配置失败
      this.isEnabled = false
      this.currentProvider = null
      this.currentModel = null
    }
  }

  /**
   * 检查 AI 建议是否可用
   */
  public isAvailable(): boolean {
    return this.isEnabled && !!this.currentProvider && !!this.currentModel
  }

  /**
   * 获取缓存键
   * 策略：
   * - 如果只输入了命令名（无参数）：缓存命令级别的建议
   * - 如果输入了参数：禁用缓存，每次都重新请求 AI（保证建议的准确性）
   */
  private getCacheKey(context: {
    currentLine: string
    currentDirectory: string
    recentHistory?: string[]
  }): string {
    const tokens = context.currentLine.trim().split(/\s+/)
    const commandPrefix = tokens[0] || ''

    // 如果有多个 token（即输入了空格和参数），使用完整输入作为缓存键
    // 这样可以确保不同的参数组合不会共享缓存
    if (tokens.length > 1) {
      // 使用完整输入，确保参数变化时重新请求
      const historyKey = context.recentHistory?.[0] || ''
      return `${context.currentDirectory}:${context.currentLine}:${historyKey}`
    }

    // 如果只有命令前缀（无参数），使用命令级别的缓存
    const historyKey = context.recentHistory?.[0] || ''
    return `${context.currentDirectory}:${commandPrefix}:${historyKey}`
  }

  /**
   * 获取 AI 智能建议
   */
  public async getAISuggestions(context: {
    currentLine: string
    currentDirectory: string
    recentHistory?: string[]
    connectionId: string
  }): Promise<Suggestion[]> {
    if (!this.isAvailable()) {
      return []
    }

    // 提取当前命令前缀和目录
    const currentCommandPrefix = context.currentLine.trim().split(/\s+/)[0] || ''
    const currentDirectory = context.currentDirectory || '~'

    // 如果命令前缀变化了，清除所有缓存（因为上下文完全变了）
    if (this.lastCommandPrefix && currentCommandPrefix !== this.lastCommandPrefix) {
      this.clearCache()
    }

    // 如果目录变化了，也清除缓存（因为上下文环境变了）
    if (this.lastDirectory && currentDirectory !== this.lastDirectory) {
      this.clearCache()
    }

    this.lastCommandPrefix = currentCommandPrefix
    this.lastDirectory = currentDirectory

    // 检查缓存
    const cacheKey = this.getCacheKey(context)
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.suggestions
    }

    // 检查是否有正在进行的请求
    const inProgress = this.requestInProgress.get(cacheKey)
    if (inProgress) {
      return await inProgress
    }

    // 创建新请求
    const requestPromise = this._fetchAISuggestions(context)
    this.requestInProgress.set(cacheKey, requestPromise)

    try {
      const suggestions = await requestPromise

      // 缓存结果
      this.cache.set(cacheKey, {
        suggestions,
        timestamp: Date.now()
      })

      return suggestions
    } finally {
      this.requestInProgress.delete(cacheKey)
    }
  }

  /**
   * 实际执行 AI 请求
   */
  private async _fetchAISuggestions(context: {
    currentLine: string
    currentDirectory: string
    recentHistory?: string[]
  }): Promise<Suggestion[]> {
    if (!this.currentProvider || !this.currentModel) {
      return []
    }

    try {
      const systemPrompt = `你是一个 Linux/Unix Shell 命令助手。根据用户当前输入和上下文，建议接下来可能要执行的命令。

规则：
1. 只返回命令建议，每行一个，不要解释
2. 每个建议包含：命令行 | 简短描述（不超过30字）
3. 最多返回 3 个建议
4. 优先考虑当前目录和最近历史
5. 建议应该是完整可执行的命令
6. 格式：command args | description

示例输出：
ls -la | 查看详细文件列表
cd /var/log | 进入日志目录
grep "error" syslog | 搜索错误日志`

      const recentHistoryText =
        context.recentHistory && context.recentHistory.length > 0
          ? `\n最近执行的命令:\n${context.recentHistory
              .slice(0, 5)
              .map((cmd, i) => `${i + 1}. ${cmd}`)
              .join('\n')}`
          : ''

      const userPrompt = `当前目录: ${context.currentDirectory}
当前输入: ${context.currentLine || '(空)'}${recentHistoryText}

请根据以上信息提供 1-3 个智能命令建议。`

      const startTime = Date.now()

      const response = await chatCompletion(this.currentProvider, this.currentModel, {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // 较低的温度以获得更确定的结果
        maxTokens: 200, // 限制 token 数量以提高速度
        stream: false
      })

      const elapsed = Date.now() - startTime

      // 解析 AI 响应
      const suggestions = this.parseAIResponse(response.content)

      return suggestions
    } catch (error: any) {
      // AI 请求失败
      return []
    }
  }

  /**
   * 解析 AI 响应
   */
  private parseAIResponse(content: string): Suggestion[] {
    const suggestions: Suggestion[] = []
    const lines = content.trim().split('\n')

    for (const line of lines) {
      const trimmed = line.trim()

      // 跳过空行和注释
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
        continue
      }

      // 解析格式：command | description
      const parts = trimmed.split('|').map(p => p.trim())

      if (parts.length >= 1) {
        const command = parts[0]
        const description = parts[1] || ''

        // 跳过明显不是命令的行
        if (command.length === 0 || command.length > 200) {
          continue
        }

        // 移除可能的序号前缀（如 "1. ", "- "）
        const cleanCommand = command.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '')

        suggestions.push({
          name: cleanCommand,
          description: description,
          icon: '🤖',
          type: 'special', // 使用 special 类型
          priority: 60 // AI 建议优先级中等
        })

        // 最多 3 个建议
        if (suggestions.length >= 3) {
          break
        }
      }
    }

    return suggestions
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear()
  }

  /**
   * 重新加载 AI 配置（当用户更改模型时调用）
   */
  public async reloadConfig(): Promise<void> {
    await this.loadAIConfig()
    this.clearCache()
  }
}
