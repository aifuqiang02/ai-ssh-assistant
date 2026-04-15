import { BrowserEventEmitter } from '../mcp/client'
import type {
  Plugin,
  PluginContext,
  PluginManifest,
  PluginHooks,
  PluginLoadResult,
  PluginMessage,
  PluginMessageResponse,
  PluginCommandResult,
  PluginToolResult,
  PluginSSHResult,
  ToolDefinition
} from './types'

interface PluginState {
  plugin: Plugin
  context: PluginContext
  loaded: boolean
  enabled: boolean
}

interface PluginManagerOptions {
  pluginsDir?: string
  autoLoad?: boolean
}

export class PluginManager extends BrowserEventEmitter {
  private plugins = new Map<string, PluginState>()
  private options: Required<PluginManagerOptions>
  private internalEventBus: BrowserEventEmitter

  constructor(options: PluginManagerOptions = {}) {
    super()
    this.options = {
      pluginsDir: options.pluginsDir ?? './plugins',
      autoLoad: options.autoLoad ?? true
    }
    this.internalEventBus = new BrowserEventEmitter()
  }

  getPluginIds(): string[] {
    return Array.from(this.plugins.keys())
  }

  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id)?.plugin
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
      .filter(state => state.loaded)
      .map(state => state.plugin)
  }

  getEnabledPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
      .filter(state => state.loaded && state.enabled)
      .map(state => state.plugin)
  }

  getPluginTools(): ToolDefinition[] {
    const tools: ToolDefinition[] = []
    for (const state of this.plugins.values()) {
      if (state.loaded && state.enabled && state.plugin.tools) {
        for (const tool of state.plugin.tools) {
          if (tool.enabled !== false) {
            tools.push({
              ...tool,
              name: `plugin:${state.context.id}:${tool.name}`,
              skillId: `plugin:${state.context.id}`
            })
          }
        }
      }
    }
    return tools
  }

  isLoaded(id: string): boolean {
    return this.plugins.get(id)?.loaded ?? false
  }

  isEnabled(id: string): boolean {
    return this.plugins.get(id)?.enabled ?? false
  }

  async register(
    manifest: PluginManifest,
    hooks: PluginHooks,
    tools?: ToolDefinition[],
    permissions?: Record<string, boolean>
  ): Promise<PluginLoadResult> {
    const id = manifest.id

    if (this.plugins.has(id)) {
      return { success: false, error: `Plugin ${id} already registered` }
    }

    const plugin: Plugin = {
      manifest,
      hooks,
      tools,
      permissions: permissions as Plugin['permissions']
    }

    const context = this.createContext(plugin)

    this.plugins.set(id, {
      plugin,
      context,
      loaded: false,
      enabled: true
    })

    this.emit('plugin:registered', { id, manifest })

    return { success: true, plugin }
  }

  async unregister(id: string): Promise<boolean> {
    const state = this.plugins.get(id)
    if (!state) return false

    if (state.loaded) {
      await this.unload(id)
    }

    this.plugins.delete(id)
    this.emit('plugin:unregistered', { id })

    return true
  }

  async load(id: string): Promise<PluginLoadResult> {
    const state = this.plugins.get(id)
    if (!state) {
      return { success: false, error: `Plugin ${id} not found` }
    }

    if (state.loaded) {
      return { success: true, plugin: state.plugin }
    }

    try {
      if (state.plugin.hooks.onLoad) {
        await state.plugin.hooks.onLoad(state.context)
      }

      state.loaded = true
      this.emit('plugin:loaded', { id, manifest: state.plugin.manifest })

      return { success: true, plugin: state.plugin }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load plugin'
      }
    }
  }

  async unload(id: string): Promise<boolean> {
    const state = this.plugins.get(id)
    if (!state || !state.loaded) return false

    try {
      if (state.plugin.hooks.onUnload) {
        await state.plugin.hooks.onUnload()
      }

      state.loaded = false
      this.emit('plugin:unloaded', { id })

      return true
    } catch (error) {
      console.error(`Failed to unload plugin ${id}:`, error)
      return false
    }
  }

  async enable(id: string): Promise<boolean> {
    const state = this.plugins.get(id)
    if (!state) return false

    state.enabled = true

    if (!state.loaded) {
      await this.load(id)
    }

    this.emit('plugin:enabled', { id })
    return true
  }

  async disable(id: string): Promise<boolean> {
    const state = this.plugins.get(id)
    if (!state) return false

    state.enabled = false
    this.emit('plugin:disabled', { id })

    return true
  }

  async onMessage(message: PluginMessage): Promise<PluginMessageResponse | null> {
    const responses: PluginMessageResponse[] = []

    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.hooks.onMessage) {
        try {
          const response = await plugin.hooks.onMessage(message)
          if (response) {
            responses.push(response)
          }
        } catch (error) {
          console.error(`Plugin ${plugin.manifest.id} onMessage error:`, error)
        }
      }
    }

    if (responses.length === 0) return null

    return {
      content: responses
        .map(r => r.content)
        .filter(Boolean)
        .join('\n\n'),
      actions: responses.flatMap(r => r.actions ?? [])
    }
  }

  async onCommand(
    command: string,
    args: Record<string, unknown>
  ): Promise<PluginCommandResult | null> {
    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.hooks.onCommand) {
        try {
          const result = await plugin.hooks.onCommand(command, args)
          if (result) {
            return result
          }
        } catch (error) {
          console.error(`Plugin ${plugin.manifest.id} onCommand error:`, error)
        }
      }
    }

    return null
  }

  async onToolCall(
    toolName: string,
    params: Record<string, unknown>
  ): Promise<PluginToolResult | null> {
    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.hooks.onToolCall) {
        try {
          const result = await plugin.hooks.onToolCall(toolName, params)
          if (result) {
            return result
          }
        } catch (error) {
          console.error(`Plugin ${plugin.manifest.id} onToolCall error:`, error)
        }
      }
    }

    return null
  }

  async onSSHCommand(command: string, connectionId: string): Promise<PluginSSHResult | null> {
    for (const plugin of this.getEnabledPlugins()) {
      if (plugin.hooks.onSSHCommand) {
        try {
          const result = await plugin.hooks.onSSHCommand(command, connectionId)
          if (result) {
            return result
          }
        } catch (error) {
          console.error(`Plugin ${plugin.manifest.id} onSSHCommand error:`, error)
        }
      }
    }

    return null
  }

  private createContext(plugin: Plugin): PluginContext {
    const stateMap = new Map<string, unknown>()

    return {
      id: plugin.manifest.id,
      name: plugin.manifest.name,
      version: plugin.manifest.version,
      config: {},
      emit: (event: string, data: unknown) => {
        this.internalEventBus.emit(`${plugin.manifest.id}:${event}`, data)
        this.emit(`plugin:${event}`, { pluginId: plugin.manifest.id, data })
      },
      getState: <T>(key: string): T | undefined => stateMap.get(key) as T | undefined,
      setState: <T>(key: string, value: T): void => {
        stateMap.set(key, value)
      },
      logger: {
        debug: (message: string, ...args: unknown[]) =>
          console.debug(`[${plugin.manifest.id}]`, message, ...args),
        info: (message: string, ...args: unknown[]) =>
          console.info(`[${plugin.manifest.id}]`, message, ...args),
        warn: (message: string, ...args: unknown[]) =>
          console.warn(`[${plugin.manifest.id}]`, message, ...args),
        error: (message: string, ...args: unknown[]) =>
          console.error(`[${plugin.manifest.id}]`, message, ...args)
      }
    }
  }
}

export const pluginManager = new PluginManager()
