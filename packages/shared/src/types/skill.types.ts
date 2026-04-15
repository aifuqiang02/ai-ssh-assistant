/**
 * Skill 接口定义
 *
 * 参考 OpenCode 项目设计，将工具组织为可复用的技能
 */

import type { ToolDefinition } from './tool.types.js'

/**
 * 技能执行结果
 */
export interface SkillResult {
  success: boolean
  content: string
  error?: string
  metadata?: Record<string, any>
}

/**
 * 技能上下文
 */
export interface SkillContext {
  sessionId: string
  agent: string
  abort: AbortSignal
  ask(input: SkillAskInput): Promise<void>
  metadata(input: { title?: string; metadata?: Record<string, any> }): void
}

/**
 * 权限确认请求
 */
export interface SkillAskInput {
  permission: string
  patterns: string[]
  always?: boolean
  metadata?: Record<string, any>
}

/**
 * 技能元信息
 */
export interface SkillInfo {
  id: string
  name: string
  version: string
  description: string
  author?: string
  homepage?: string
}

/**
 * 技能接口
 *
 * 技能是相关工具的集合，提供特定领域的功能
 */
export interface Skill {
  /** 技能信息 */
  info: SkillInfo

  /** 工具定义列表 */
  tools: ToolDefinition[]

  /** 系统提示词 */
  systemPrompt: string

  /** 操作指令提示词 (可选) */
  instructionPrompt?: string

  /** 初始化技能 */
  initialize?(context: SkillContext): Promise<void>

  /** 执行工具 */
  execute(toolName: string, params: Record<string, any>): Promise<SkillResult>

  /** 释放资源 */
  dispose?(): void
}

/**
 * 技能生命周期状态
 */
export type SkillStatus = 'pending' | 'initializing' | 'ready' | 'disposed' | 'error'

/**
 * 技能实例
 */
export interface SkillInstance {
  skill: Skill
  status: SkillStatus
  error?: Error
}

/**
 * 技能过滤器
 */
export interface SkillFilter {
  ids?: string[]
  tags?: string[]
  enabled?: boolean
}

/**
 * 技能注册选项
 */
export interface SkillRegisterOptions {
  autoInitialize?: boolean
  priority?: number
}
