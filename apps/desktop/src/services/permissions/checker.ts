/**
 * 权限检查服务
 *
 * 基于正则表达式匹配命令，返回权限检查结果
 */

import type { PermissionConfig, PermissionCheckResult, PermissionRule } from './types'
import { DEFAULT_PERMISSION_CONFIG } from './types'

export type ChatMode = 'agent' | 'plan' | 'ask'

/**
 * 权限检查器
 */
export class PermissionChecker {
  private config: PermissionConfig

  constructor(config?: Partial<PermissionConfig>) {
    this.config = {
      ...DEFAULT_PERMISSION_CONFIG,
      ...config,
      defaults: [...DEFAULT_PERMISSION_CONFIG.defaults, ...(config?.defaults || [])]
    }
  }

  /**
   * 检查命令权限
   */
  check(command: string, mode: ChatMode = 'agent'): PermissionCheckResult {
    const trimmedCommand = command.trim()

    // 1. 先检查模式特定的规则
    const modeConfig = this.config.modes[mode === 'plan' ? 'plan' : 'build']

    // Plan 模式特殊处理
    if (mode === 'plan') {
      // 检查是否匹配自动允许模式
      for (const pattern of modeConfig.autoAllowPatterns) {
        if (this.matchPattern(pattern, trimmedCommand)) {
          return {
            action: 'allow',
            reason: 'Matches auto-allow pattern for plan mode',
            requiresConfirmation: false
          }
        }
      }

      // 检查是否匹配自动拒绝模式
      for (const pattern of modeConfig.autoDenyPatterns) {
        if (this.matchPattern(pattern, trimmedCommand)) {
          return {
            action: 'deny',
            rule: {
              pattern,
              action: 'deny',
              description: 'Read-only mode: modification commands are not allowed'
            },
            reason: 'Plan mode is read-only, modification commands are denied',
            requiresConfirmation: false
          }
        }
      }

      // Plan 模式下未匹配的修改命令需要询问
      return {
        action: 'ask',
        rule: {
          pattern: '*',
          action: 'ask',
          description: 'Plan mode: modification requires confirmation'
        },
        reason: 'Plan mode requires confirmation for modification commands',
        requiresConfirmation: true
      }
    }

    // Build 模式：检查默认规则
    for (const rule of this.config.defaults) {
      if (this.matchPattern(rule.pattern, trimmedCommand)) {
        const requiresConfirmation = rule.action === 'ask'
        return {
          action: rule.action,
          rule,
          reason: rule.description,
          requiresConfirmation
        }
      }
    }

    // 默认允许
    return {
      action: 'allow',
      reason: 'Default allow',
      requiresConfirmation: false
    }
  }

  /**
   * 检查是否需要用户确认
   */
  requiresConfirmation(command: string, mode: ChatMode = 'agent'): boolean {
    const result = this.check(command, mode)
    return result.requiresConfirmation
  }

  /**
   * 检查命令是否安全（不需要确认）
   */
  isSafe(command: string, mode: ChatMode = 'agent'): boolean {
    const result = this.check(command, mode)
    return result.action === 'allow' && !result.requiresConfirmation
  }

  /**
   * 匹配正则表达式模式
   */
  private matchPattern(pattern: string, command: string): boolean {
    try {
      const regex = new RegExp(pattern, 'i')
      return regex.test(command)
    } catch {
      // 如果正则无效，进行简单的字符串匹配
      return command.includes(pattern)
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<PermissionConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      defaults: [...this.config.defaults, ...(config.defaults || [])]
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): PermissionConfig {
    return { ...this.config }
  }

  /**
   * 添加自定义规则
   */
  addRule(rule: PermissionRule): void {
    this.config.defaults.push(rule)
  }

  /**
   * 移除规则
   */
  removeRule(pattern: string): void {
    this.config.defaults = this.config.defaults.filter(r => r.pattern !== pattern)
  }

  /**
   * 导出配置
   */
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  /**
   * 获取危险命令提示文本
   */
  getDangerWarning(result: PermissionCheckResult): string {
    if (result.action === 'deny') {
      return `🚫 This command has been blocked for safety reasons.\n\n${result.reason || 'The command matches a dangerous pattern.'}`
    }

    if (result.requiresConfirmation && result.rule) {
      return `⚠️ Confirmation Required\n\nThis command (${result.rule.description}) requires your confirmation to execute.\n\nCommand: \`${result.rule.pattern}\``
    }

    return ''
  }
}

// 单例实例
let globalChecker: PermissionChecker | null = null

/**
 * 获取全局权限检查器
 */
export function getPermissionChecker(): PermissionChecker {
  if (!globalChecker) {
    globalChecker = new PermissionChecker()
  }
  return globalChecker
}

/**
 * 设置全局权限检查器
 */
export function setPermissionChecker(checker: PermissionChecker): void {
  globalChecker = checker
}

/**
 * 便捷函数：检查命令权限
 */
export function checkCommandPermission(
  command: string,
  mode: ChatMode = 'agent'
): PermissionCheckResult {
  return getPermissionChecker().check(command, mode)
}

/**
 * 便捷函数：检查是否需要确认
 */
export function commandRequiresConfirmation(command: string, mode: ChatMode = 'agent'): boolean {
  return getPermissionChecker().requiresConfirmation(command, mode)
}
