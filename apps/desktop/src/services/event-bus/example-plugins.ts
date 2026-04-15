/**
 * SSH 日志插件示例
 *
 * 演示如何使用事件总线订阅 SSH 事件
 */

import { Events, on, onAny, type EventSubscriber } from '../event-bus'

/**
 * SSH 日志记录器插件
 */
export class SSHLoggerPlugin implements EventSubscriber {
  private unsubscribers: (() => void)[] = []
  private commandHistory: Array<{
    id: string
    command: string
    success: boolean
    timestamp: Date
    duration?: number
  }> = []

  constructor() {
    this.initialize()
  }

  /**
   * 初始化订阅
   */
  private initialize(): void {
    // 订阅连接事件
    this.unsubscribers.push(
      on(Events.SSH_CONNECTED, data => {
        console.log('═══════════════════════════════════════════')
        console.log('🔌 SSH 连接已建立')
        console.log(`   连接ID: ${data.connectionId}`)
        console.log(`   主机: ${data.host}:${data.port}`)
        console.log(`   用户: ${data.username}`)
        console.log('═══════════════════════════════════════════')
      })
    )

    this.unsubscribers.push(
      on(Events.SSH_DISCONNECTED, data => {
        console.log('═══════════════════════════════════════════')
        console.log('🔌 SSH 连接已断开')
        console.log(`   连接ID: ${data.connectionId}`)
        console.log(`   主机: ${data.host}`)
        console.log(`   用户: ${data.username}`)
        console.log('═══════════════════════════════════════════')
      })
    )

    // 订阅命令执行事件
    this.unsubscribers.push(
      on(Events.SSH_COMMAND_STARTED, data => {
        console.log('')
        console.log('▶️ 执行命令')
        console.log(`   连接: ${data.connectionId}`)
        console.log(`   命令: ${data.command}`)
        console.log(`   时间: ${data.timestamp || new Date().toISOString()}`)
      })
    )

    this.unsubscribers.push(
      on(Events.SSH_COMMAND_COMPLETED, data => {
        const status = data.success ? '✅ 成功' : '❌ 失败'
        console.log('')
        console.log('■ 命令完成')
        console.log(`   连接: ${data.connectionId}`)
        console.log(`   命令: ${data.command}`)
        console.log(`   状态: ${status}`)
        if (data.duration) {
          console.log(`   耗时: ${data.duration}ms`)
        }
        console.log('')

        // 记录到历史
        this.commandHistory.push({
          id: data.connectionId,
          command: data.command,
          success: data.success,
          timestamp: new Date(),
          duration: data.duration
        })

        // 限制历史记录数量
        if (this.commandHistory.length > 100) {
          this.commandHistory.shift()
        }
      })
    )

    // 订阅所有事件（调试用）
    this.unsubscribers.push(
      onAny(({ event, data }) => {
        // 只记录包含 error 的事件
        if (event.includes('error') || event.includes('ERROR')) {
          console.warn(`[EventBus] ${event}:`, data)
        }
      })
    )

    console.log('[SSHLogger] ✅ SSH 日志插件已启动')
  }

  /**
   * 获取命令历史
   */
  getCommandHistory(): typeof this.commandHistory {
    return [...this.commandHistory]
  }

  /**
   * 清空命令历史
   */
  clearHistory(): void {
    this.commandHistory = []
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalCommands: number
    successCount: number
    failureCount: number
    averageDuration: number
  } {
    const total = this.commandHistory.length
    const success = this.commandHistory.filter(c => c.success).length
    const failure = total - success

    const durations = this.commandHistory
      .filter(c => c.duration !== undefined)
      .map(c => c.duration!)

    const avgDuration =
      durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0

    return {
      totalCommands: total,
      successCount: success,
      failureCount: failure,
      averageDuration: Math.round(avgDuration)
    }
  }

  /**
   * 实现 EventSubscriber 接口
   */
  subscribe(): { event: string; handler: (data: any) => void }[] {
    return []
  }

  /**
   * 销毁插件
   */
  destroy(): void {
    for (const unsub of this.unsubscribers) {
      unsub()
    }
    this.unsubscribers = []
    console.log('[SSHLogger] SSH 日志插件已销毁')
  }
}

/**
 * 命令审计插件
 *
 * 用于安全审计，记录所有执行的命令
 */
export class CommandAuditPlugin implements EventSubscriber {
  private unsubscribers: (() => void)[] = []
  private auditLog: Array<{
    timestamp: Date
    event: string
    connectionId: string
    command?: string
    success: boolean
    metadata?: Record<string, any>
  }> = []

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    // 审计所有 SSH 命令
    this.unsubscribers.push(
      on(Events.SSH_COMMAND_COMPLETED, data => {
        this.auditLog.push({
          timestamp: new Date(),
          event: 'SSH_COMMAND_COMPLETED',
          connectionId: data.connectionId,
          command: data.command,
          success: data.success,
          metadata: {
            duration: data.duration,
            outputLength: data.output?.length || 0
          }
        })
      })
    )

    // 审计权限事件
    this.unsubscribers.push(
      on(Events.PERMISSION_DENIED, data => {
        this.auditLog.push({
          timestamp: new Date(),
          event: 'PERMISSION_DENIED',
          connectionId: data.connectionId || 'unknown',
          command: data.command,
          success: false,
          metadata: {
            reason: data.reason
          }
        })
      })
    )

    console.log('[CommandAudit] ✅ 命令审计插件已启动')
  }

  /**
   * 获取审计日志
   */
  getAuditLog(): typeof this.auditLog {
    return [...this.auditLog]
  }

  /**
   * 导出审计日志
   */
  exportAuditLog(): string {
    return JSON.stringify(this.auditLog, null, 2)
  }

  subscribe(): { event: string; handler: (data: any) => void }[] {
    return []
  }

  destroy(): void {
    for (const unsub of this.unsubscribers) {
      unsub()
    }
    this.unsubscribers = []
    console.log('[CommandAudit] 命令审计插件已销毁')
  }
}

// 单例实例
let sshLogger: SSHLoggerPlugin | null = null
let commandAudit: CommandAuditPlugin | null = null

/**
 * 启动所有示例插件
 */
export function startExamplePlugins(): void {
  if (!sshLogger) {
    sshLogger = new SSHLoggerPlugin()
  }
  if (!commandAudit) {
    commandAudit = new CommandAuditPlugin()
  }
}

/**
 * 停止所有示例插件
 */
export function stopExamplePlugins(): void {
  sshLogger?.destroy()
  commandAudit?.destroy()
  sshLogger = null
  commandAudit = null
}

/**
 * 获取 SSH 日志器实例
 */
export function getSSHLogger(): SSHLoggerPlugin | null {
  return sshLogger
}

/**
 * 获取命令审计实例
 */
export function getCommandAudit(): CommandAuditPlugin | null {
  return commandAudit
}
