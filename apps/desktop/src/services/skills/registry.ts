/**
 * Skill Registry
 *
 * 技能注册表，管理所有可用技能
 */

import type {
  Skill,
  SkillInfo,
  SkillContext,
  SkillResult,
  SkillStatus,
  SkillInstance
} from '@ai-ssh/shared'

/**
 * 技能注册表事件
 */
export interface SkillRegistryEvents {
  registered: (skill: Skill) => void
  unregistered: (skillId: string) => void
  initialized: (skillId: string) => void
  error: (skillId: string, error: Error) => void
}

/**
 * 技能执行器回调
 */
type SkillExecutorFn = (
  skillId: string,
  toolName: string,
  params: Record<string, any>,
  context: SkillContext
) => Promise<SkillResult>

/**
 * Skill Registry
 *
 * 管理技能的注册、发现和执行
 */
export class SkillRegistry {
  private skills = new Map<string, Skill>()
  private instances = new Map<string, SkillInstance>()
  private toolToSkill = new Map<string, string>() // toolName -> skillId
  private executors: Map<string, SkillExecutorFn> = new Map()
  private initialized = false

  /**
   * 注册技能
   */
  register(skill: Skill, options?: { executor?: SkillExecutorFn }): void {
    if (this.skills.has(skill.info.id)) {
      console.warn(`Skill ${skill.info.id} already registered, skipping`)
      return
    }

    // 注册技能
    this.skills.set(skill.info.id, skill)

    // 注册工具映射
    for (const tool of skill.tools) {
      const fullName = `${skill.info.id}:${tool.name}`
      this.toolToSkill.set(fullName, skill.info.id)
      this.toolToSkill.set(tool.name, skill.info.id)
    }

    // 注册执行器
    if (options?.executor) {
      this.executors.set(skill.info.id, options.executor)
    }

    // 创建实例
    this.instances.set(skill.info.id, {
      skill,
      status: 'pending'
    })

    console.log(`[SkillRegistry] Registered skill: ${skill.info.id} (${skill.info.name})`)
  }

  /**
   * 注销技能
   */
  unregister(skillId: string): void {
    const skill = this.skills.get(skillId)
    if (!skill) return

    // 清理工具映射
    for (const tool of skill.tools) {
      this.toolToSkill.delete(`${skillId}:${tool.name}`)
      this.toolToSkill.delete(tool.name)
    }

    // 清理实例
    this.instances.delete(skillId)

    // 清理执行器
    this.executors.delete(skillId)

    // 注销技能
    this.skills.delete(skillId)

    console.log(`[SkillRegistry] Unregistered skill: ${skillId}`)
  }

  /**
   * 获取技能
   */
  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId)
  }

  /**
   * 获取所有技能
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skills.values())
  }

  /**
   * 获取技能信息列表
   */
  getSkillsInfo(): SkillInfo[] {
    return this.getAllSkills().map(skill => skill.info)
  }

  /**
   * 根据工具名查找技能
   */
  getSkillByTool(toolName: string): Skill | undefined {
    const skillId = this.toolToSkill.get(toolName)
    if (!skillId) return undefined
    return this.skills.get(skillId)
  }

  /**
   * 获取工具定义
   */
  getToolDefinition(skillId: string, toolName: string) {
    const skill = this.skills.get(skillId)
    if (!skill) return undefined
    return skill.tools.find(t => t.name === toolName)
  }

  /**
   * 获取所有工具定义
   */
  getAllTools() {
    const tools: ReturnType<typeof this.getToolDefinition>[] = []
    for (const skill of this.skills.values()) {
      for (const tool of skill.tools) {
        if (tool.enabled !== false) {
          tools.push({
            skillId: skill.info.id,
            ...tool
          })
        }
      }
    }
    return tools
  }

  /**
   * 生成系统提示词
   */
  generateSystemPrompt(): string {
    const prompts: string[] = []

    for (const skill of this.skills.values()) {
      if (skill.systemPrompt) {
        prompts.push(skill.systemPrompt)
      }
    }

    return prompts.join('\n\n---\n\n')
  }

  /**
   * 生成工具描述 (用于 AI API)
   */
  generateToolDescriptions(): object[] {
    const descriptions: object[] = []

    for (const skill of this.skills.values()) {
      for (const tool of skill.tools) {
        if (tool.enabled !== false) {
          descriptions.push({
            type: 'function',
            function: {
              name: `${skill.info.id}:${tool.name}`,
              description: tool.description,
              parameters: {
                type: 'object',
                properties: tool.parameters.properties,
                required: tool.parameters.required || []
              }
            }
          })
        }
      }
    }

    return descriptions
  }

  /**
   * 执行工具
   */
  async execute(
    skillId: string,
    toolName: string,
    params: Record<string, any>,
    context: SkillContext
  ): Promise<SkillResult> {
    const skill = this.skills.get(skillId)
    if (!skill) {
      return {
        success: false,
        content: '',
        error: `Skill not found: ${skillId}`
      }
    }

    // 使用自定义执行器或技能内置执行器
    const executor = this.executors.get(skillId)
    if (executor) {
      return executor(skillId, toolName, params, context)
    }

    if (skill.execute) {
      return skill.execute(toolName, params)
    }

    return {
      success: false,
      content: '',
      error: `No executor available for skill: ${skillId}`
    }
  }

  /**
   * 初始化所有技能
   */
  async initializeAll(context: SkillContext): Promise<void> {
    if (this.initialized) {
      console.warn('[SkillRegistry] Already initialized')
      return
    }

    const initPromises: Promise<void>[] = []

    for (const skill of this.skills.values()) {
      const instance = this.instances.get(skill.info.id)
      if (!instance) continue

      instance.status = 'initializing'

      const promise = (async () => {
        try {
          if (skill.initialize) {
            await skill.initialize(context)
          }
          instance.status = 'ready'
          console.log(`[SkillRegistry] Initialized skill: ${skill.info.id}`)
        } catch (error) {
          instance.status = 'error'
          instance.error = error as Error
          console.error(`[SkillRegistry] Failed to initialize skill: ${skill.info.id}`, error)
          throw error
        }
      })()

      initPromises.push(promise)
    }

    await Promise.allSettled(initPromises)
    this.initialized = true
  }

  /**
   * 释放所有技能
   */
  async disposeAll(): Promise<void> {
    const disposePromises: Promise<void>[] = []

    for (const skill of this.skills.values()) {
      const instance = this.instances.get(skill.info.id)
      if (!instance || instance.status === 'disposed') continue

      const disposeFn = skill.dispose
      if (disposeFn) {
        disposePromises.push(
          (async () => {
            try {
              await disposeFn()
              instance.status = 'disposed'
            } catch (error) {
              console.error(`[SkillRegistry] Failed to dispose skill: ${skill.info.id}`, error)
            }
          })()
        )
      } else {
        instance.status = 'disposed'
      }
    }

    await Promise.allSettled(disposePromises)
    this.initialized = false
  }

  /**
   * 获取技能状态
   */
  getSkillStatus(skillId: string): SkillStatus | undefined {
    return this.instances.get(skillId)?.status
  }

  /**
   * 获取所有技能状态
   */
  getAllStatus(): Record<string, SkillStatus> {
    const status: Record<string, SkillStatus> = {}
    for (const [skillId, instance] of this.instances) {
      status[skillId] = instance.status
    }
    return status
  }

  /**
   * 检查技能是否已注册
   */
  has(skillId: string): boolean {
    return this.skills.has(skillId)
  }

  /**
   * 获取技能数量
   */
  size(): number {
    return this.skills.size
  }

  /**
   * 清空所有技能
   */
  clear(): void {
    this.skills.clear()
    this.instances.clear()
    this.toolToSkill.clear()
    this.executors.clear()
    this.initialized = false
  }
}

// 全局单例
let globalRegistry: SkillRegistry | null = null

/**
 * 获取全局技能注册表
 */
export function getSkillRegistry(): SkillRegistry {
  if (!globalRegistry) {
    globalRegistry = new SkillRegistry()
  }
  return globalRegistry
}

/**
 * 设置全局技能注册表
 */
export function setSkillRegistry(registry: SkillRegistry): void {
  globalRegistry = registry
}
