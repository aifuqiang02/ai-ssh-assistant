import type { Plugin, PluginManifest, PluginHooks } from '../types'

const MANIFEST: PluginManifest = {
  id: 'command-audit',
  name: 'Command Audit',
  version: '1.0.0',
  description: 'Audit all SSH commands for security and compliance',
  author: 'AI SSH Assistant'
}

const HOOKS: PluginHooks = {
  onLoad: context => {
    context.logger.info('Command Audit plugin loaded')
    context.logger.info('All SSH commands will be logged for audit purposes')
  },
  onSSHCommand: async (command, connectionId) => {
    const auditLog = {
      timestamp: Date.now(),
      connectionId,
      command,
      user: 'audit-user'
    }

    console.log('[AUDIT]', JSON.stringify(auditLog))

    return {
      allowed: true,
      reason: 'Command logged for audit'
    }
  },
  onToolCall: async (toolName, params) => {
    const auditLog = {
      timestamp: Date.now(),
      tool: toolName,
      params: JSON.stringify(params)
    }

    console.log('[AUDIT TOOL]', JSON.stringify(auditLog))

    return undefined
  }
}

const plugin: Plugin = {
  manifest: MANIFEST,
  hooks: HOOKS,
  permissions: {
    canExecuteSSH: true
  }
}

export default plugin
