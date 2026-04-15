/**
 * 补全引擎 - 核心逻辑
 */
import type {
  CompletionSpec,
  CompletionContext,
  CompletionResult,
  Suggestion,
  Subcommand,
  Option,
  Arg,
  Generator,
  AutocompleteConfig
} from '@/types/autocomplete'
import { historyManager } from './history-manager'
import { aliasManager } from './alias-manager'
import { AISuggestionManager } from './ai-suggestion-manager'

export class AutocompleteEngine {
  private specs: Map<string, CompletionSpec> = new Map()
  private cache: Map<string, { data: Suggestion[]; timestamp: number }> = new Map()
  private config: AutocompleteConfig
  private aiManager: AISuggestionManager
  
  constructor(config: Partial<AutocompleteConfig> = {}) {
    this.config = {
      enabled: true,
      triggerDelay: 100,
      maxSuggestions: 50,
      fuzzyMatch: true,
      showDescriptions: true,
      showIcons: true,
      ...config
    }
    this.aiManager = new AISuggestionManager()
  }
  
  /**
   * 注册命令规范
   */
  registerSpec(spec: CompletionSpec): void {
    const names = Array.isArray(spec.name) ? spec.name : [spec.name]
    names.forEach(name => {
      this.specs.set(name, spec)
    })
  }
  
  /**
   * 批量注册规范
   */
  registerSpecs(specs: CompletionSpec[]): void {
    specs.forEach(spec => this.registerSpec(spec))
  }
  
  /**
   * 解析当前行,生成补全上下文
   */
  parseContext(
    currentLine: string,
    cursorPosition: number,
    connectionId: string,
    currentDirectory?: string
  ): CompletionContext {
    // 简单的 token 分割 (后续可以改进支持引号等)
    const tokens = currentLine.trim().split(/\s+/).filter(t => t.length > 0)
    
    // 检查当前行是否以空格结尾 (表示用户在输入新的 token)
    const endsWithSpace = currentLine.length > 0 && currentLine[currentLine.length - 1] === ' '
    
    // 找到光标所在的 token
    let currentTokenIndex = 0
    let charCount = 0
    
    if (endsWithSpace && tokens.length > 0) {
      // 如果以空格结尾,说明在输入新 token
      currentTokenIndex = tokens.length
    } else {
      // 否则找到光标所在的 token
      for (let i = 0; i < tokens.length; i++) {
        const tokenStart = currentLine.indexOf(tokens[i], charCount)
        const tokenEnd = tokenStart + tokens[i].length
        if (cursorPosition >= tokenStart && cursorPosition <= tokenEnd) {
          currentTokenIndex = i
          break
        }
        charCount = tokenEnd
      }
    }
    
    const currentToken = endsWithSpace ? '' : (tokens[currentTokenIndex] || '')
    
    // 解析已输入的选项和参数
    const options: Record<string, string | true> = {}
    const args: string[] = []
    
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.startsWith('-')) {
        // 选项
        if (tokens[i + 1] && !tokens[i + 1].startsWith('-')) {
          options[token] = tokens[i + 1]
          i++ // 跳过值
        } else {
          options[token] = true
        }
      } else if (i !== currentTokenIndex) {
        // 参数
        args.push(token)
      }
    }
    
    return {
      currentLine,
      tokens,
      cursorPosition,
      currentTokenIndex,
      currentToken,
      currentDirectory,
      connectionId,
      options,
      args
    }
  }
  
  /**
   * 获取补全建议
   */
  async getCompletions(context: CompletionContext): Promise<CompletionResult> {
    if (!this.config.enabled || context.tokens.length === 0) {
      return {
        suggestions: [],
        replaceStart: context.cursorPosition,
        replaceEnd: context.cursorPosition,
        context
      }
    }
    
    const commandName = context.tokens[0]
    const spec = this.specs.get(commandName)
    
    // 如果第一个 token 还没完全输入完(还在输入命令名称阶段)
    // 判断依据:currentTokenIndex === 0 且 currentToken 不完全等于某个已知命令
    if (context.currentTokenIndex === 0) {
      // 检查是否有完全匹配的命令
      const exactMatch = this.specs.has(context.currentToken)
      
      if (!exactMatch || !spec) {
        // 如果没有完全匹配,或者找不到 spec,显示命令名称建议
        return this.getCommandNameSuggestions(context)
      }
      
      // 如果有完全匹配,但 token 后面没有空格(即用户还在输入这个 token)
      // 这种情况下,应该继续显示命令补全,而不是切换到参数补全
      // 注意:如果用户输入了 "cd "(末尾有空格),parseContext 会创建一个新的空 token
      // 所以 currentTokenIndex 会变成 1
      
      // 如果走到这里,说明:
      // 1. currentToken 完全匹配某个命令(如 "cd")
      // 2. 但 currentTokenIndex 仍然是 0
      // 这说明用户输入了 "cd" 但还没按空格
      // 此时应该继续显示命令补全
      return this.getCommandNameSuggestions(context)
    }
    
    // 现在 currentTokenIndex > 0,说明用户已经输入了空格,开始输入参数
    if (!spec) {
      // 没有找到命令规范（如 tail, head 等未定义的命令）
      // 在参数阶段，只提供 AI 建议和文件/目录补全，不显示命令名
      const suggestions: Suggestion[] = []
      
      // 尝试 AI 建议
      const shouldShowAI = this.aiManager.isAvailable() 
        && context.currentToken.length <= 5
      
      if (shouldShowAI) {
        try {
          const recentHistory = await historyManager.getHistory(context.connectionId)
          const aiSuggestions = await this.aiManager.getAISuggestions({
            currentLine: context.currentLine,
            currentDirectory: context.currentDirectory || '~',
            recentHistory: recentHistory.slice(0, 10).map(h => h.command),
            connectionId: context.connectionId
          })
          suggestions.push(...aiSuggestions)
        } catch (error) {
          // 获取 AI 建议失败
        }
      }
      
      // 过滤和排序
      const filtered = this.filterSuggestions(suggestions, context.currentToken)
      const sorted = this.sortSuggestions(filtered)
      const limited = sorted.slice(0, this.config.maxSuggestions)
      
      return {
        suggestions: limited,
        replaceStart: context.cursorPosition - context.currentToken.length,
        replaceEnd: context.cursorPosition,
        context
      }
    }
    
    // 根据当前位置决定补全类型
    const suggestions = await this.getSuggestionsForSpec(spec, context)
    
    // 过滤和排序
    const filtered = this.filterSuggestions(suggestions, context.currentToken)
    const sorted = this.sortSuggestions(filtered)
    const limited = sorted.slice(0, this.config.maxSuggestions)
    
    return {
      suggestions: limited,
      replaceStart: context.cursorPosition - context.currentToken.length,
      replaceEnd: context.cursorPosition,
      context
    }
  }
  
  /**
   * 获取命令名称建议
   */
  private async getCommandNameSuggestions(context: CompletionContext): Promise<CompletionResult> {
    const suggestions: Suggestion[] = []
    
    // 1. 从已注册的规范中获取命令
    this.specs.forEach((spec, name) => {
      suggestions.push({
        name,
        description: spec.description,
        icon: spec.icon || '⚡',
        type: 'subcommand',
        priority: 100
      })
    })
    
    // 2. 从别名中获取建议
    try {
      const aliasSuggestions = await aliasManager.getAliasSuggestions(
        context.connectionId,
        context.currentToken
      )
      
      // 添加别名建议
      aliasSuggestions.forEach(({ alias, command }) => {
        suggestions.push({
          name: alias,
          description: `别名: ${command}`,
          icon: '🔗',
          type: 'special',
          priority: 95 // 别名优先级高于历史命令
        })
      })
    } catch (error) {
      // 获取别名失败
    }

    // 3. 从历史命令中获取建议
    try {
      const historySuggestions = await historyManager.getHistorySuggestions(
        context.connectionId,
        context.currentToken,
        15 // 最多15条历史命令
      )

      // 添加历史命令建议
      historySuggestions.forEach(({ command, frequency }) => {
        // 避免重复添加已注册的命令和别名
        const commandName = command.split(/\s+/)[0]
        const isRegistered = this.specs.has(commandName)
        const isDuplicate = suggestions.some(s => s.name === command)

        if (!isDuplicate) {
          suggestions.push({
            name: command,
            description: `历史命令 (使用${frequency}次)`,
            icon: '🕐',
            type: 'special',
            priority: isRegistered ? 80 : 85 // 未注册的命令优先级稍低
          })
        }
      })
    } catch (error) {
      // 获取历史命令失败
    }
    
    // 4. 获取 AI 智能建议
    // 触发条件优化：
    // - 输入为空或较短（≤5 字符）时显示
    // - 但如果当前已经有很多其他建议（>10个），则不显示 AI 建议
    const shouldShowAI = this.aiManager.isAvailable() 
      && context.currentToken.length <= 5
      && suggestions.length <= 10
    
    if (shouldShowAI) {
      try {
        // 获取最近的历史命令
        const recentHistory = await historyManager.getHistory(context.connectionId)
        
        const aiSuggestions = await this.aiManager.getAISuggestions({
          currentLine: context.currentLine,
          currentDirectory: context.currentDirectory || '~',
          recentHistory: recentHistory.slice(0, 10).map(h => h.command),
          connectionId: context.connectionId
        })
        
        // 添加 AI 建议，避免重复
        aiSuggestions.forEach(aiSug => {
          const isDuplicate = suggestions.some(s => s.name === aiSug.name)
          if (!isDuplicate) {
            suggestions.push(aiSug)
          }
        })
      } catch (error) {
        // 获取 AI 建议失败
      }
    }
    
    const filtered = this.filterSuggestions(suggestions, context.currentToken)
    const sorted = this.sortSuggestions(filtered)
    
    return {
      suggestions: sorted.slice(0, this.config.maxSuggestions),
      replaceStart: 0,
      replaceEnd: context.currentToken.length,
      context
    }
  }
  
  /**
   * 根据规范获取建议
   */
  private async getSuggestionsForSpec(
    spec: CompletionSpec,
    context: CompletionContext
  ): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = []
    
    // 判断当前应该补全什么
    const currentToken = context.currentToken
    
    // 1. 如果输入以 - 开头,补全选项
    if (currentToken.startsWith('-')) {
      if (spec.options) {
        suggestions.push(...this.getOptionSuggestions(spec.options, context))
      }
      return suggestions
    }
    
    // 2. 查找是否在子命令中
    const subcommand = this.findCurrentSubcommand(spec, context)
    if (subcommand) {
      // 在子命令中,递归处理
      return this.getSuggestionsForSubcommand(subcommand, context)
    }
    
    // 3. 子命令建议 (只在不是命令本身时显示)
    if (spec.subcommands && context.currentTokenIndex > 0) {
      suggestions.push(...this.getSubcommandSuggestions(spec.subcommands, context))
    }
    
    // 4. 参数建议 (只在不是命令本身时显示)
    if (spec.args && context.currentTokenIndex > 0) {
      const argSuggestions = await this.getArgSuggestions(spec.args, context)
      suggestions.push(...argSuggestions)
    }
    
    // 5. 选项建议 (可以在任何时候显示)
    if (spec.options && context.currentTokenIndex > 0) {
      suggestions.push(...this.getOptionSuggestions(spec.options, context))
    }
    
    // 6. 运行生成器 (只在不是命令本身时显示)
    if (spec.generators && context.currentTokenIndex > 0) {
      const generated = await this.runGenerators(spec.generators, context)
      suggestions.push(...generated)
    }
    
    return suggestions
  }
  
  /**
   * 查找当前所在的子命令
   */
  private findCurrentSubcommand(spec: CompletionSpec, context: CompletionContext): Subcommand | null {
    if (!spec.subcommands) return null
    
    // 从 tokens 中查找子命令
    for (let i = 1; i < context.currentTokenIndex; i++) {
      const token = context.tokens[i]
      if (!token.startsWith('-')) {
        const subcommand = spec.subcommands.find(sub => {
          const names = Array.isArray(sub.name) ? sub.name : [sub.name]
          return names.includes(token)
        })
        if (subcommand) {
          return subcommand
        }
      }
    }
    
    return null
  }
  
  /**
   * 获取子命令的建议
   */
  private async getSuggestionsForSubcommand(
    subcommand: Subcommand,
    context: CompletionContext
  ): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = []
    
    // 子命令的子命令
    if (subcommand.subcommands) {
      suggestions.push(...this.getSubcommandSuggestions(subcommand.subcommands, context))
    }
    
    // 子命令的参数
    if (subcommand.args) {
      const argSuggestions = await this.getArgSuggestions(subcommand.args, context)
      suggestions.push(...argSuggestions)
    }
    
    // 子命令的选项
    if (subcommand.options) {
      suggestions.push(...this.getOptionSuggestions(subcommand.options, context))
    }
    
    return suggestions
  }
  
  /**
   * 获取子命令建议
   */
  private getSubcommandSuggestions(subcommands: Subcommand[], context: CompletionContext): Suggestion[] {
    return subcommands
      .filter(sub => !sub.hidden)
      .map(sub => {
        const names = Array.isArray(sub.name) ? sub.name : [sub.name]
        return {
          name: names[0],
          description: sub.description,
          icon: sub.icon || '📦',
          type: 'subcommand' as const,
          priority: sub.priority || 50
        }
      })
  }
  
  /**
   * 获取选项建议
   */
  private getOptionSuggestions(options: Option[], context: CompletionContext): Suggestion[] {
    const suggestions: Suggestion[] = []
    
    for (const option of options) {
      const names = Array.isArray(option.name) ? option.name : [option.name]
      
      // 检查是否已经使用过 (不可重复的选项)
      if (!option.isRepeatable) {
        const used = names.some(name => context.options[name] !== undefined)
        if (used) continue
      }
      
      // 检查排他性
      if (option.exclusiveOn) {
        const hasExclusive = option.exclusiveOn.some(name => context.options[name] !== undefined)
        if (hasExclusive) continue
      }
      
      names.forEach(name => {
        suggestions.push({
          name,
          description: option.description,
          icon: option.icon || '🔧',
          type: 'option',
          priority: option.isRequired ? 90 : 40
        })
      })
    }
    
    return suggestions
  }
  
  /**
   * 获取参数建议
   */
  private async getArgSuggestions(args: Arg | Arg[], context: CompletionContext): Promise<Suggestion[]> {
    const argArray = Array.isArray(args) ? args : [args]
    const suggestions: Suggestion[] = []
    
    for (const arg of argArray) {
      // 固定建议
      if (arg.suggestions) {
        const argSugs = arg.suggestions.map(sug => {
          if (typeof sug === 'string') {
            return {
              name: sug,
              description: arg.description,
              icon: '📄',
              type: 'arg' as const
            }
          }
          return sug
        })
        suggestions.push(...argSugs)
      }
      
      // 生成器
      if (arg.generators) {
        const generated = await this.runGenerators(arg.generators, context)
        suggestions.push(...generated)
      }
    }
    
    return suggestions
  }
  
  /**
   * 运行生成器
   */
  private async runGenerators(generators: Generator | Generator[], context: CompletionContext): Promise<Suggestion[]> {
    const genArray = Array.isArray(generators) ? generators : [generators]
    const suggestions: Suggestion[] = []
    
    for (const generator of genArray) {
      // 检查触发条件
      if (generator.trigger && !generator.trigger(context)) {
        continue
      }
      
      // 检查缓存
      const script = typeof generator.script === 'function' 
        ? generator.script(context) 
        : generator.script
      
      if (generator.cache && generator.cache > 0 && script) {
        const cacheKey = `${context.connectionId}:${script}`
        const cached = this.cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < generator.cache) {
          suggestions.push(...cached.data)
          continue
        }
      }

      try {
        let result: Suggestion[] = []

        if (generator.custom) {
          // 自定义生成器
          result = await generator.custom(context)
        } else if (script) {
          // 脚本生成器 - 使用 SSH 执行

          try {
            // 调用 Electron API 执行远程命令
            if (window.electronAPI && window.electronAPI.ssh) {
              const execResult = await window.electronAPI.ssh.executeSilent(
                context.connectionId,
                script
              )

              if (execResult.success && execResult.output) {
                // 后处理
                if (generator.postProcess) {
                  result = generator.postProcess(execResult.output, context)
                } else {
                  // 默认处理: 每行一个建议
                  const lines = execResult.output.split('\n').filter(l => l.trim())
                  result = lines.map(line => ({
                    name: line.trim(),
                    type: 'arg' as const
                  }))
                }
              }
            }
          } catch (error) {
            // SSH 执行错误
          }
        }

        suggestions.push(...result)

        // 更新缓存
        if (generator.cache && generator.cache > 0 && script && result.length > 0) {
          const cacheKey = `${context.connectionId}:${script}`
          this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          })
        }
      } catch (error) {
        // 运行错误
      }
    }
    
    return suggestions
  }
  
  /**
   * 过滤建议
   */
  private filterSuggestions(suggestions: Suggestion[], filter: string): Suggestion[] {
    if (!filter) return suggestions
    
    const lowerFilter = filter.toLowerCase()
    
    return suggestions.filter(sug => {
      if (this.config.fuzzyMatch) {
        // 模糊匹配
        return this.fuzzyMatch(sug.name.toLowerCase(), lowerFilter)
      } else {
        // 前缀匹配
        return sug.name.toLowerCase().startsWith(lowerFilter)
      }
    })
  }
  
  /**
   * 模糊匹配算法
   */
  private fuzzyMatch(text: string, pattern: string): boolean {
    let patternIdx = 0
    for (let i = 0; i < text.length && patternIdx < pattern.length; i++) {
      if (text[i] === pattern[patternIdx]) {
        patternIdx++
      }
    }
    return patternIdx === pattern.length
  }
  
  /**
   * 排序建议
   */
  private sortSuggestions(suggestions: Suggestion[]): Suggestion[] {
    return suggestions.sort((a, b) => {
      // 优先级高的在前
      const priorityA = a.priority || 0
      const priorityB = b.priority || 0
      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }
      
      // 字母顺序
      return a.name.localeCompare(b.name)
    })
  }
  
  /**
   * 清空缓存
   */
  clearCache(): void {
    this.cache.clear()
  }
  
  /**
   * 获取 AI 管理器（用于外部重新加载配置）
   */
  getAIManager(): AISuggestionManager {
    return this.aiManager
  }
  
  /**
   * 检查 AI 建议是否可用
   */
  isAIAvailable(): boolean {
    return this.aiManager.isAvailable()
  }
}

