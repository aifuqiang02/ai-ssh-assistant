import type { Plugin, PluginManifest, PluginHooks, ToolDefinition } from '../types'

const MANIFEST: PluginManifest = {
  id: 'monitor',
  name: 'System Monitor',
  version: '1.0.0',
  description: 'Monitor system resources (CPU, Memory, Disk)',
  author: 'AI SSH Assistant',
  homepage: 'https://github.com/aifuqiang02/ai-ssh-assistant'
}

const TOOLS: ToolDefinition[] = [
  {
    name: 'monitor_cpu',
    description: 'Get CPU usage information',
    parameters: {
      type: 'object',
      properties: {
        interval: {
          type: 'number',
          description: 'Sampling interval in seconds',
          default: 1
        },
        count: {
          type: 'number',
          description: 'Number of samples to collect',
          default: 3
        }
      },
      required: []
    },
    enabled: true,
    skillId: 'plugin:monitor',
    permission: 'plugin:monitor:read'
  },
  {
    name: 'monitor_memory',
    description: 'Get memory usage information',
    parameters: {
      type: 'object',
      properties: {
        unit: {
          type: 'string',
          description: 'Unit for display (bytes, MB, GB)',
          enum: ['bytes', 'MB', 'GB'],
          default: 'MB'
        }
      },
      required: []
    },
    enabled: true,
    skillId: 'plugin:monitor',
    permission: 'plugin:monitor:read'
  },
  {
    name: 'monitor_disk',
    description: 'Get disk usage information',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path to check disk usage',
          default: '/'
        }
      },
      required: []
    },
    enabled: true,
    skillId: 'plugin:monitor',
    permission: 'plugin:monitor:read'
  }
]

const HOOKS: PluginHooks = {
  onLoad: context => {
    context.logger.info('System Monitor plugin loaded')
  },
  onUnload: () => {
    console.log('System Monitor plugin unloaded')
  },
  onCommand: async (command, args) => {
    if (command.startsWith('monitor ')) {
      const subCommand = command.substring(8).trim().split(' ')[0]

      switch (subCommand) {
        case 'cpu':
          return {
            success: true,
            output: `CPU monitoring for ${args.count || 3} samples at ${args.interval || 1}s intervals`
          }
        case 'memory':
          return {
            success: true,
            output: `Memory usage in ${args.unit || 'MB'} units`
          }
        case 'disk':
          return {
            success: true,
            output: `Disk usage for path: ${args.path || '/'}`
          }
      }
    }
    return undefined
  }
}

const plugin: Plugin = {
  manifest: MANIFEST,
  hooks: HOOKS,
  tools: TOOLS,
  permissions: {
    canReadFiles: true
  }
}

export default plugin
