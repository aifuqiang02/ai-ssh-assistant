import { ref, computed } from 'vue'
import { MCPClient, MCPToolAdapter, type MCPToolInfo, type ToolDefinition } from '@ai-ssh/core'

export interface MCPServerConfig {
  id: string
  name: string
  url: string
  enabled: boolean
  autoConnect: boolean
}

interface MCPServerState {
  client: MCPClient | null
  tools: ToolDefinition[]
  connected: boolean
  error: string | null
  lastConnected: Date | null
}

class MCPService {
  private servers = new Map<string, MCPServerState>()
  private config = ref<MCPServerConfig[]>([])

  getConfigs(): MCPServerConfig[] {
    return this.config.value
  }

  readonly allTools = computed(() => {
    const tools: ToolDefinition[] = []
    for (const state of this.servers.values()) {
      if (state.connected && state.tools.length > 0) {
        tools.push(...state.tools)
      }
    }
    return tools
  })

  readonly connectedServers = computed(() => {
    return Array.from(this.servers.entries())
      .filter(([, state]) => state.connected)
      .map(([id]) => id)
  })

  readonly errors = computed(() => {
    const errors: Record<string, string> = {}
    for (const [id, state] of this.servers.entries()) {
      if (state.error) {
        errors[id] = state.error
      }
    }
    return errors
  })

  async addServer(config: MCPServerConfig): Promise<void> {
    this.config.value.push(config)
    this.servers.set(config.id, {
      client: null,
      tools: [],
      connected: false,
      error: null,
      lastConnected: null
    })
  }

  async removeServer(serverId: string): Promise<void> {
    const state = this.servers.get(serverId)
    if (state?.client) {
      await state.client.disconnect()
    }
    this.servers.delete(serverId)
    this.config.value = this.config.value.filter(c => c.id !== serverId)
  }

  async connect(serverId: string): Promise<void> {
    const config = this.config.value.find(c => c.id === serverId)
    if (!config || !config.enabled) {
      throw new Error(`Server ${serverId} not found or disabled`)
    }

    let state = this.servers.get(serverId)
    if (!state) {
      state = {
        client: null,
        tools: [],
        connected: false,
        error: null,
        lastConnected: null
      }
      this.servers.set(serverId, state)
    }

    if (state.connected) {
      return
    }

    try {
      const client = new MCPClient({
        timeout: 30000,
        reconnectAttempts: 3,
        reconnectDelay: 1000
      })

      client.on('connected', () => {
        if (this.servers.has(serverId)) {
          this.servers.get(serverId)!.connected = true
          this.servers.get(serverId)!.error = null
          this.servers.get(serverId)!.lastConnected = new Date()
        }
      })

      client.on('disconnected', (code: number, reason: string) => {
        if (this.servers.has(serverId)) {
          this.servers.get(serverId)!.connected = false
        }
      })

      client.on('error', (error: Error) => {
        if (this.servers.has(serverId)) {
          this.servers.get(serverId)!.error = error.message
        }
      })

      client.on('toolsChanged', async () => {
        await this.loadTools(serverId, client)
      })

      await client.connect(config.url)
      state.client = client

      await this.loadTools(serverId, client)
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Connection failed'
      throw error
    }
  }

  private async loadTools(serverId: string, client: MCPClient): Promise<void> {
    try {
      const tools = await client.listTools()
      const adaptedTools = tools.map(
        (tool: MCPToolInfo) => new MCPToolAdapter(client, tool) as unknown as ToolDefinition
      )

      if (this.servers.has(serverId)) {
        this.servers.get(serverId)!.tools = adaptedTools
      }
    } catch (error) {
      console.error(`Failed to load tools from server ${serverId}:`, error)
    }
  }

  async disconnect(serverId: string): Promise<void> {
    const state = this.servers.get(serverId)
    if (state?.client) {
      await state.client.disconnect()
      state.client = null
      state.connected = false
      state.tools = []
    }
  }

  async reconnect(serverId: string): Promise<void> {
    await this.disconnect(serverId)
    await this.connect(serverId)
  }

  getServerState(serverId: string): MCPServerState | undefined {
    return this.servers.get(serverId)
  }

  async connectAllAuto(): Promise<void> {
    const autoConnectServers = this.config.value.filter(c => c.enabled && c.autoConnect)
    await Promise.all(autoConnectServers.map(c => this.connect(c.id).catch(() => {})))
  }

  async disconnectAll(): Promise<void> {
    for (const serverId of this.servers.keys()) {
      await this.disconnect(serverId)
    }
  }
}

export const mcpService = new MCPService()

export type { MCPServerState }
