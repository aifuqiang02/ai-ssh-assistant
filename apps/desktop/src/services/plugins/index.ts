import { ref, computed } from 'vue'
import { PluginManager, type Plugin, type PluginManifest, type PluginMessage } from '@ai-ssh/core'

interface PluginWithState extends PluginManifest {
  loaded: boolean
  enabled: boolean
  error?: string
}

class PluginService {
  private manager = new PluginManager()
  private plugins = ref<PluginWithState[]>([])

  readonly allPlugins = computed(() => this.plugins.value)

  readonly enabledPlugins = computed(() => this.plugins.value.filter(p => p.enabled && p.loaded))

  readonly loadedPlugins = computed(() => this.plugins.value.filter(p => p.loaded))

  async registerPlugin(plugin: Plugin): Promise<boolean> {
    const result = await this.manager.register(
      plugin.manifest,
      plugin.hooks,
      plugin.tools,
      plugin.permissions as Record<string, boolean>
    )

    if (result.success) {
      this.updatePluginList()
      return true
    }

    console.error('Failed to register plugin:', result.error)
    return false
  }

  async unregisterPlugin(id: string): Promise<boolean> {
    const result = await this.manager.unregister(id)
    if (result) {
      this.updatePluginList()
    }
    return result
  }

  async loadPlugin(id: string): Promise<boolean> {
    const result = await this.manager.load(id)
    if (result.success) {
      this.updatePluginList()
      return true
    }

    console.error('Failed to load plugin:', result.error)
    this.updatePluginList()
    return false
  }

  async unloadPlugin(id: string): Promise<boolean> {
    const result = await this.manager.unload(id)
    this.updatePluginList()
    return result
  }

  async enablePlugin(id: string): Promise<boolean> {
    const result = await this.manager.enable(id)
    this.updatePluginList()
    return result
  }

  async disablePlugin(id: string): Promise<boolean> {
    const result = await this.manager.disable(id)
    this.updatePluginList()
    return result
  }

  getPluginTools() {
    return this.manager.getPluginTools()
  }

  onMessage(message: PluginMessage) {
    return this.manager.onMessage(message)
  }

  onCommand(command: string, args: Record<string, unknown>) {
    return this.manager.onCommand(command, args)
  }

  onToolCall(toolName: string, params: Record<string, unknown>) {
    return this.manager.onToolCall(toolName, params)
  }

  onSSHCommand(command: string, connectionId: string) {
    return this.manager.onSSHCommand(command, connectionId)
  }

  private updatePluginList() {
    const pluginList: PluginWithState[] = []

    for (const id of this.manager.getPluginIds()) {
      const plugin = this.manager.getPlugin(id)
      if (plugin) {
        pluginList.push({
          ...plugin.manifest,
          loaded: this.manager.isLoaded(id),
          enabled: this.manager.isEnabled(id)
        })
      }
    }

    this.plugins.value = pluginList
  }
}

export const pluginService = new PluginService()

export type { PluginWithState }
