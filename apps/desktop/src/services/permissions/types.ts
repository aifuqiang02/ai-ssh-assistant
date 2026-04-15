/**
 * 权限配置类型定义
 */

export type PermissionAction = 'allow' | 'deny' | 'ask'

export interface PermissionRule {
  pattern: string
  action: PermissionAction
  description?: string
}

export interface PermissionConfig {
  version: string
  lastUpdated: string
  defaults: PermissionRule[]
  modes: {
    plan: PermissionModeConfig
    build: PermissionModeConfig
  }
}

export interface PermissionModeConfig {
  autoAllowPatterns: string[]
  autoDenyPatterns: string[]
}

/**
 * 默认权限配置
 */
export const DEFAULT_PERMISSION_CONFIG: PermissionConfig = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString().split('T')[0],
  defaults: [
    // 危险命令 - 自动拒绝
    {
      pattern: '^\\s*rm\\s+-rf\\s+/\\s*$',
      action: 'deny',
      description: 'Delete root directory'
    },
    {
      pattern: '^\\s*rm\\s+-rf\\s+/',
      action: 'deny',
      description: 'Delete system directories'
    },
    {
      pattern: '^\\s*dd\\s+if=.*of=.*',
      action: 'deny',
      description: 'Disk dd operation'
    },
    {
      pattern: '^\\s*mkfs\\.',
      action: 'deny',
      description: 'Format filesystem'
    },
    {
      pattern: '^\\s*:\\(\\)\\s*:\\s*\\|\\s*:\\s*&\\s*;\\s*:',
      action: 'deny',
      description: 'Fork bomb'
    },

    // 高风险命令 - 询问确认
    {
      pattern: '^\\s*chmod\\s+-R\\s+777\\s+',
      action: 'ask',
      description: 'World writable permissions'
    },
    {
      pattern: '^\\s*chown\\s+-R\\s+',
      action: 'ask',
      description: 'Change ownership'
    },
    {
      pattern: '^\\s*iptables\\s+--flush',
      action: 'ask',
      description: 'Clear firewall rules'
    },
    {
      pattern: '^\\s*ufw\\s+reset',
      action: 'ask',
      description: 'Reset firewall'
    },
    {
      pattern: '^\\s*systemctl\\s+restart\\s+',
      action: 'ask',
      description: 'Restart system service'
    },
    {
      pattern: '^\\s*service\\s+.*\\s+restart',
      action: 'ask',
      description: 'Restart service'
    },

    // Sudo 命令 - 询问确认
    {
      pattern: '^\\s*sudo\\s+',
      action: 'ask',
      description: 'Elevated privileges'
    },
    {
      pattern: '^\\s*su\\s+',
      action: 'ask',
      description: 'Switch to root user'
    }
  ],
  modes: {
    plan: {
      // 只读模式：只允许读取操作
      autoAllowPatterns: [
        '^\\s*ls\\s+',
        '^\\s*cat\\s+',
        '^\\s*head\\s+',
        '^\\s*tail\\s+',
        '^\\s*grep\\s+',
        '^\\s*find\\s+.*-name\\s+',
        '^\\s*pwd\\s*$',
        '^\\s*whoami\\s*$',
        '^\\s*uname\\s+',
        '^\\s*hostname\\s*$',
        '^\\s*cat\\s+.*\\|\\s*head\\s+',
        '^\\s*cat\\s+.*\\|\\s*tail\\s+'
      ],
      autoDenyPatterns: [
        '^\\s*rm\\s+',
        '^\\s*mv\\s+',
        '^\\s*cp\\s+.*\\s+-f',
        '^\\s*mkdir\\s+',
        '^\\s*touch\\s+',
        '^\\s*chmod\\s+',
        '^\\s*chown\\s+',
        '^\\s*echo\\s+.*\\s+>\\s*',
        '^\\s*echo\\s+.*\\s+>>\\s*',
        '^\\s*printf\\s+.*\\s+>\\s*',
        '^\\s*sed\\s+-i\\s+',
        '^\\s*apt\\s+install\\s+',
        '^\\s*apt\\s+remove\\s+',
        '^\\s*yum\\s+install\\s+',
        '^\\s*yum\\s+remove\\s+',
        '^\\s*npm\\s+install\\s+',
        '^\\s*npm\\s+uninstall\\s+',
        '^\\s*docker\\s+',
        '^\\s*systemctl\\s+',
        '^\\s*service\\s+'
      ]
    },
    build: {
      // 执行模式：允许大部分操作
      autoAllowPatterns: [
        '^\\s*ls\\s+',
        '^\\s*cat\\s+',
        '^\\s*head\\s+',
        '^\\s*tail\\s+',
        '^\\s*grep\\s+',
        '^\\s*find\\s+',
        '^\\s*pwd\\s*$',
        '^\\s*whoami\\s*$',
        '^\\s*uname\\s+',
        '^\\s*hostname\\s*$',
        '^\\s*df\\s+',
        '^\\s*free\\s+',
        '^\\s*top\\s+',
        '^\\s*ps\\s+',
        '^\\s*netstat\\s+',
        '^\\s*curl\\s+',
        '^\\s*wget\\s+',
        '^\\s*git\\s+',
        '^\\s*npm\\s+run\\s+',
        '^\\s*node\\s+'
      ],
      autoDenyPatterns: []
    }
  }
}

/**
 * 权限检查结果
 */
export interface PermissionCheckResult {
  action: PermissionAction
  rule?: PermissionRule
  reason?: string
  requiresConfirmation: boolean
}

/**
 * 解析用户自定义配置
 */
export function parsePermissionConfig(config: Record<string, any>): PermissionConfig {
  // 如果用户提供了配置，合并默认配置
  if (!config) {
    return DEFAULT_PERMISSION_CONFIG
  }

  return {
    version: config.version || DEFAULT_PERMISSION_CONFIG.version,
    lastUpdated: config.lastUpdated || new Date().toISOString().split('T')[0],
    defaults: config.defaults || DEFAULT_PERMISSION_CONFIG.defaults,
    modes: {
      plan: {
        autoAllowPatterns:
          config.modes?.plan?.autoAllowPatterns ||
          DEFAULT_PERMISSION_CONFIG.modes.plan.autoAllowPatterns,
        autoDenyPatterns:
          config.modes?.plan?.autoDenyPatterns ||
          DEFAULT_PERMISSION_CONFIG.modes.plan.autoDenyPatterns
      },
      build: {
        autoAllowPatterns:
          config.modes?.build?.autoAllowPatterns ||
          DEFAULT_PERMISSION_CONFIG.modes.build.autoAllowPatterns,
        autoDenyPatterns:
          config.modes?.build?.autoDenyPatterns ||
          DEFAULT_PERMISSION_CONFIG.modes.build.autoDenyPatterns
      }
    }
  }
}
