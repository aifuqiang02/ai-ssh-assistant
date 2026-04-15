export interface ToolParameterProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
  enum?: string[]
  default?: unknown
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
}

export interface ToolParameters {
  type: 'object'
  properties: Record<string, ToolParameterProperty>
  required?: string[]
  additionalProperties?: boolean
}

export interface ToolDefinition {
  name: string
  description: string
  parameters: ToolParameters
  enabled?: boolean
  skillId?: string
  permission?: string
}

export interface PluginManifest {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  license?: string
  homepage?: string
}

export interface PluginHooks {
  onLoad?: (context: PluginContext) => Promise<void> | void
  onUnload?: () => Promise<void> | void
  onMessage?: (
    message: PluginMessage
  ) => Promise<PluginMessageResponse | void> | PluginMessageResponse | void
  onCommand?: (
    command: string,
    args: Record<string, unknown>
  ) => Promise<PluginCommandResult | void> | PluginCommandResult | void
  onToolCall?: (
    toolName: string,
    params: Record<string, unknown>
  ) => Promise<PluginToolResult | void> | PluginToolResult | void
  onSSHCommand?: (
    command: string,
    connectionId: string
  ) => Promise<PluginSSHResult | void> | PluginSSHResult | void
}

export interface PluginPermissions {
  canExecuteSSH?: boolean
  canReadFiles?: boolean
  canWriteFiles?: boolean
  canAccessNetwork?: boolean
  customPermissions?: Record<string, boolean>
}

export interface Plugin {
  manifest: PluginManifest
  hooks: PluginHooks
  tools?: ToolDefinition[]
  permissions?: PluginPermissions
  enabled?: boolean
}

export interface PluginContext {
  id: string
  name: string
  version: string
  config: PluginConfig
  emit: (event: string, data: unknown) => void
  getState: <T>(key: string) => T | undefined
  setState: <T>(key: string, value: T) => void
  logger: PluginLogger
}

export interface PluginConfig {
  [key: string]: unknown
}

export interface PluginLogger {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
}

export interface PluginMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface PluginMessageResponse {
  content?: string
  actions?: PluginAction[]
}

export interface PluginAction {
  type: 'replace' | 'append' | 'delete' | 'execute'
  target?: string
  value?: unknown
}

export interface PluginCommandResult {
  success: boolean
  output?: string
  error?: string
}

export interface PluginToolResult {
  success: boolean
  result?: unknown
  error?: string
}

export interface PluginSSHResult {
  allowed: boolean
  reason?: string
  modifiedCommand?: string
}

export interface PluginLoadResult {
  success: boolean
  plugin?: Plugin
  error?: string
}
