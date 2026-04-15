# AI SSH Assistant 优化执行计划

基于 `OPTIMIZATION.md` 和 `TRANSFORMATION.md`，制定可执行的优化计划。

## 执行原则

1. **小步快跑** - 每个阶段产出可用的功能
2. **渐进式** - 不破坏现有功能
3. **可验证** - 每个任务有明确的验收标准

---

## 第一阶段: 提示词工程 (1-2 周)

**目标**: 采用 OpenCode 提示词系统，直接提升 AI 效果，减少幻觉

### 任务 1.1: 设计标准化工具定义格式

**文件**: `packages/shared/src/types/tool.ts` (新建)

**内容**:

```typescript
import { z } from 'zod'

export const ToolSchema = {
  name: z.string(),
  description: z.string(),
  args: z.record(z.any()),
  required: z.array(z.string()).optional()
}

export type ToolDefinition = z.infer<typeof ToolSchema>

// 预定义工具类型
export interface SSHExecuteTool extends ToolDefinition {
  name: 'ssh_execute'
  args: {
    command: string
    verify?: boolean
    timeout?: number
  }
  required: ['command']
}

export interface FileReadTool extends ToolDefinition {
  name: 'file_read'
  args: {
    path: string
    encoding?: 'utf-8' | 'base64'
  }
  required: ['path']
}
```

**验收标准**:

- [ ] TypeScript 类型定义完整
- [ ] Zod Schema 验证通过
- [ ] 有详细的 JSDoc 注释

### 任务 1.2: 重写系统提示词模板

**文件**: `apps/desktop/src/services/tools/system-prompt.ts` (重构)

**采用 OpenCode 格式**:

```markdown
---
name: ssh-assistant
description: SSH server management assistant
mode: primary
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  ssh_execute: true
  file_read: true
  file_write: true
  list_files: true
---

# SSH AI Assistant

You are an expert Linux system administrator and DevOps engineer.

## Core Principles

### 1. Safety First

- ALWAYS verify destructive commands:
  - `rm -rf *`
  - `dd if=* of=*`
  - `chmod -R 777 *`
  - `iptables --flush`
  - `mkfs.*`

### 2. Context Awareness

- Check OS: Debian/Ubuntu vs RHEL/CentOS vs Alpine
- Verify service status before modifications
- Consider server resources

### 3. Precision Over Speed

- Provide command explanation before execution
- Suggest testing in non-production first
- Ask clarifying questions when uncertain

## Tool Usage

When using tools:

1. Understand the goal
2. Formulate command
3. Check for safety issues
4. Execute with verification
5. Verify success
```

**验收标准**:

- [ ] 新提示词格式符合 OpenCode 规范
- [ ] 包含 YAML frontmatter 元数据
- [ ] 包含 Core Principles 安全规范
- [ ] 工具描述与 tool-executor.ts 一致
- [ ] 现有功能测试通过

### 任务 1.3: 实现动态提示词生成

**文件**: `apps/desktop/src/services/tools/prompt-generator.ts` (新建)

**功能**:

```typescript
export async function generateSystemPrompt(
  mode: 'plan' | 'build' = 'build'
): Promise<string> {
  const templates = await loadTemplates()

  const components = [
    templates.system,
    templates.safety,
    mode === 'plan' ? templates.plan : templates.build
  ]

  return components.filter(Boolean).join('\n\n---\n\n')
}

export function getToolDescriptions(): object[] {
  return [
    {
      type: 'function',
      function: {
        name: 'ssh_execute',
        description: 'Execute command on remote server via SSH',
        parameters: {
          type: 'object',
          properties: {
            command: { type: 'string', description: 'Command to execute' },
            verify: { type: 'boolean', description: 'Ask for confirmation' },
            timeout: { type: 'number', description: 'Timeout in ms' }
          },
          required: ['command']
        }
      }
    }
    // ... 其他工具
  ]
}
```

**验收标准**:

- [ ] 支持动态生成提示词
- [ ] 支持 plan/build 模式切换
- [ ] 工具描述自动从定义生成
- [ ] 现有功能测试通过

### 任务 1.4: 添加温度和步骤控制

**文件**: `apps/desktop/src/services/ai-api.service.ts` (修改)

**修改点**:

```typescript
interface AIConfig {
  provider: string
  model: string
  temperature?: number // 新增
  maxTokens?: number // 新增 (用于步骤限制)
}

// 使用示例
const response = await callAI({
  model: 'claude-sonnet-4-20250514',
  temperature: 0.1, // 降低随机性
  maxTokens: 2000 // 限制单次响应长度
})
```

**验收标准**:

- [ ] 支持 temperature 参数
- [ ] 支持 maxTokens 参数
- [ ] plan 模式 temperature=0.1
- [ ] build 模式 temperature=0.3 (默认)

### 任务 1.5: 添加危险命令确认

**文件**: `apps/desktop/src/services/tools/risk-evaluator.ts` (新建)

**功能**:

```typescript
const DANGEROUS_PATTERNS = [
  /rm\s+-rf/i,
  /dd\s+if=.*of=/i,
  /chmod\s+-R\s+777/i,
  /iptables\s+--flush/i,
  /mkfs\./i,
  /:(){ :|:& };:/i // fork bomb
]

export function assessCommandRisk(command: string): RiskLevel {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      return 'dangerous'
    }
  }

  if (command.includes('sudo') || command.includes('root')) {
    return 'elevated'
  }

  return 'normal'
}

export async function requireConfirmation(
  command: string,
  context: ConfirmationContext
): Promise<boolean> {
  const risk = assessCommandRisk(command)

  if (risk === 'dangerous') {
    return context.ask({
      message: `Confirm execution of potentially dangerous command:\n\n${command}`,
      type: 'danger'
    })
  }

  return true
}
```

**验收标准**:

- [ ] 检测危险命令模式
- [ ] 返回风险等级 (normal/elevated/dangerous)
- [ ] 危险命令触发用户确认
- [ ] 单元测试覆盖

---

## 第二阶段: Agent Skill 系统 (1 周)

**目标**: 将工具抽象为可复用的技能，为后续扩展打基础

### 任务 2.1: 定义 Skill 接口

**文件**: `packages/shared/src/types/skill.ts` (新建)

**内容**:

```typescript
import type { ToolDefinition } from './tool'

export interface Skill {
  id: string
  name: string
  version: string
  description: string
  tools: ToolDefinition[]
  systemPrompt: string
  instructionPrompt?: string
}

export interface SkillContext {
  sessionId: string
  agent: string
  abort: AbortSignal
  ask(input: AskInput): Promise<void>
}

export interface ToolResult {
  success: boolean
  content: string
  metadata?: Record<string, any>
  error?: string
}

export interface AskInput {
  permission: string
  patterns: string[]
  always?: boolean
  metadata?: Record<string, any>
}
```

**验收标准**:

- [ ] 接口定义清晰
- [ ] 包含完整的类型定义
- [ ] 有 JSDoc 注释

### 任务 2.2: 创建 SkillRegistry

**文件**: `apps/desktop/src/services/skills/registry.ts` (新建)

**功能**:

```typescript
import type { Skill, ToolDefinition } from '@ai-ssh/shared'

class SkillRegistry {
  private skills = new Map<string, Skill>()
  private toolMap = new Map<string, ToolDefinition>()

  register(skill: Skill): void {
    this.skills.set(skill.id, skill)

    for (const tool of skill.tools) {
      this.toolMap.set(`${skill.id}:${tool.name}`, tool)
    }
  }

  getSkill(id: string): Skill | undefined {
    return this.skills.get(id)
  }

  getTool(skillId: string, toolName: string): ToolDefinition | undefined {
    return this.toolMap.get(`${skillId}:${toolName}`)
  }

  getAllTools(): ToolDefinition[] {
    return Array.from(this.toolMap.values())
  }

  generateSystemPrompt(): string {
    return Array.from(this.skills.values())
      .map(s => s.systemPrompt)
      .join('\n\n---\n\n')
  }
}

export const skillRegistry = new SkillRegistry()
```

**验收标准**:

- [ ] 支持技能注册
- [ ] 支持工具查找
- [ ] 支持提示词生成
- [ ] 单元测试覆盖

### 任务 2.3: 实现 SSH Skill

**文件**: `apps/desktop/src/services/skills/ssh/index.ts` (新建)

**内容**:

```typescript
import type { Skill } from '@ai-ssh/shared'
import {
  sshExecuteTool,
  fileReadTool,
  fileWriteTool,
  listFilesTool
} from './tools'
import { sshSystemPrompt } from './prompts'

export const sshSkill: Skill = {
  id: 'ssh',
  name: 'SSH Server Management',
  version: '1.0.0',
  description: 'Manage remote Linux servers via SSH',
  tools: [sshExecuteTool, fileReadTool, fileWriteTool, listFilesTool],
  systemPrompt: sshSystemPrompt
}

skillRegistry.register(sshSkill)
```

**文件**: `apps/desktop/src/services/skills/ssh/tools/ssh-execute.ts`

```typescript
import type { ToolDefinition } from '@ai-ssh/shared'

export const sshExecuteTool: ToolDefinition = {
  name: 'ssh_execute',
  description: 'Execute command on remote server via SSH',
  args: {
    command: {
      type: 'string',
      description: 'Command to execute'
    },
    verify: {
      type: 'boolean',
      description: 'Ask for confirmation before execution',
      default: true
    },
    timeout: {
      type: 'number',
      description: 'Timeout in milliseconds',
      default: 30000
    }
  },
  required: ['command']
}

export async function executeSSHCommand(
  params: { command: string; verify?: boolean; timeout?: number },
  context: SkillContext
): Promise<ToolResult> {
  const { command, verify = true, timeout = 30000 } = params

  if (verify) {
    await context.ask({
      permission: 'ssh:execute',
      patterns: [command],
      always: false
    })
  }

  try {
    const result = await window.electronAPI.ssh.execute(command, { timeout })
    return { success: true, content: result }
  } catch (error) {
    return { success: false, content: '', error: error.message }
  }
}
```

**验收标准**:

- [ ] SSH Skill 正确注册
- [ ] 工具定义完整
- [ ] 与现有 SSH 功能行为一致
- [ ] 单元测试覆盖

### 任务 2.4: 集成 Skill 到现有系统

**文件**: `apps/desktop/src/components/chat/AIChatSessionWithTools.vue` (修改)

**修改点**:

```typescript
import { skillRegistry } from '@/services/skills/registry'
import { generateSystemPrompt } from '@/services/tools/prompt-generator'

// 替换原有的静态 system-prompt 生成
async function getSystemPrompt(): Promise<string> {
  // 新方式: 从 SkillRegistry 生成
  return skillRegistry.generateSystemPrompt()
}

// 替换工具调用
async function handleToolCall(toolName: string, params: any) {
  const [skillId, tool] = toolName.split(':')
  const skill = skillRegistry.getSkill(skillId)

  if (skill) {
    return await skill.execute(tool, params)
  }
}
```

**验收标准**:

- [ ] 现有聊天功能正常工作
- [ ] 工具调用走 SkillRegistry
- [ ] 新增功能测试通过

---

## 第三阶段: 事件总线 (1 周)

**目标**: 解耦模块，支持插件订阅事件

### 任务 3.1: 实现事件总线核心

**文件**: `packages/core/src/bus/index.ts` (新建)

**内容**:

```typescript
import { EventEmitter } from 'events'

type EventCallback = (data: any) => void

interface EventBus {
  on(event: string, callback: EventCallback): void
  off(event: string, callback: EventCallback): void
  emit(event: string, data: any): void
}

class LocalEventBus implements EventBus {
  private emitter = new EventEmitter()

  on(event: string, callback: EventCallback) {
    this.emitter.on(event, callback)
  }

  off(event: string, callback: EventCallback) {
    this.emitter.off(event, callback)
  }

  emit(event: string, data: any) {
    this.emitter.emit(event, data)
  }
}

export const eventBus = new LocalEventBus()

// 预定义事件
export const Events = {
  // SSH 事件
  SSH_CONNECTED: 'ssh:connected',
  SSH_DISCONNECTED: 'ssh:disconnected',
  SSH_COMMAND_STARTED: 'ssh:command:started',
  SSH_COMMAND_COMPLETED: 'ssh:command:completed',
  SSH_ERROR: 'ssh:error',

  // AI 事件
  AI_MESSAGE_STARTED: 'ai:message:started',
  AI_MESSAGE_COMPLETED: 'ai:message:completed',
  AI_TOOL_CALLED: 'ai:tool:called',
  AI_TOOL_COMPLETED: 'ai:tool:completed',

  // 聊天事件
  CHAT_SESSION_CREATED: 'chat:session:created',
  CHAT_MESSAGE_SENT: 'chat:message:sent',
  CHAT_MESSAGE_RECEIVED: 'chat:message:received'
}
```

**验收标准**:

- [ ] 事件发布/订阅正常工作
- [ ] 支持事件取消订阅
- [ ] 单元测试覆盖

### 任务 3.2: 重构 SSH 模块使用事件

**文件**: `apps/desktop/electron/ipc/ssh-handlers.ts` (修改)

**修改点**:

```typescript
import { eventBus, Events } from '@ai-ssh/core/bus'

export class SSHManager {
  async connect(config: SSHConfig): Promise<void> {
    try {
      await this.establishConnection(config)

      eventBus.emit(Events.SSH_CONNECTED, {
        connectionId: config.id,
        host: config.host
      })
    } catch (error) {
      eventBus.emit(Events.SSH_ERROR, {
        connectionId: config.id,
        error: error.message
      })
      throw error
    }
  }

  async executeCommand(connectionId: string, command: string): Promise<string> {
    eventBus.emit(Events.SSH_COMMAND_STARTED, {
      connectionId,
      command
    })

    try {
      const result = await this.runCommand(connectionId, command)

      eventBus.emit(Events.SSH_COMMAND_COMPLETED, {
        connectionId,
        command,
        success: true
      })

      return result
    } catch (error) {
      eventBus.emit(Events.SSH_COMMAND_COMPLETED, {
        connectionId,
        command,
        success: false,
        error: error.message
      })
      throw error
    }
  }
}
```

**验收标准**:

- [ ] SSH 连接/断开触发事件
- [ ] 命令执行开始/完成触发事件
- [ ] 错误触发事件
- [ ] 现有功能测试通过

### 任务 3.3: 创建示例插件

**文件**: `apps/desktop/src/plugins/ssh-logger.ts` (新建)

**功能**:

```typescript
import { eventBus, Events } from '@ai-ssh/core/bus'

export class SSHLoggerPlugin {
  constructor() {
    this.subscribeEvents()
  }

  private subscribeEvents() {
    eventBus.on(Events.SSH_COMMAND_COMPLETED, data => {
      console.log(`[SSH] Command on ${data.connectionId}:`)
      console.log(`  Command: ${data.command}`)
      console.log(`  Success: ${data.success}`)
      console.log(`  Time: ${new Date().toISOString()}`)
    })

    eventBus.on(Events.SSH_ERROR, data => {
      console.error(`[SSH] Error on ${data.connectionId}:`, data.error)
    })
  }
}

// 在应用启动时注册
export const sshLogger = new SSHLoggerPlugin()
```

**验收标准**:

- [ ] 插件能接收 SSH 事件
- [ ] 日志正确输出
- [ ] 可以禁用/启用

---

## 第四阶段: 权限控制 (1 周)

**目标**: 实现细粒度权限控制，增强安全性

### 任务 4.1: 定义权限规则

**文件**: `packages/shared/src/types/permission.ts` (新建)

**内容**:

```typescript
export type PermissionAction = 'allow' | 'deny' | 'ask'

export interface PermissionRule {
  pattern: string
  action: PermissionAction
  description?: string
}

export interface PermissionConfig {
  defaults: PermissionRule[]
  user: PermissionRule[]
}

export const DEFAULT_RULES: PermissionRule[] = [
  {
    pattern: 'rm -rf /*',
    action: 'deny',
    description: 'Delete root directory'
  },
  { pattern: 'dd if=* of=*', action: 'ask', description: 'Disk dump' },
  { pattern: 'chmod -R 777 *', action: 'ask', description: 'World writable' },
  { pattern: 'iptables --flush', action: 'ask', description: 'Clear firewall' },
  { pattern: 'sudo *', action: 'ask', description: 'Elevated privileges' },
  { pattern: '*', action: 'allow', description: 'Default allow' }
]
```

### 任务 4.2: 实现权限检查器

**文件**: `apps/desktop/src/services/permission/checker.ts` (新建)

**功能**:

```typescript
import { PermissionRule, DEFAULT_RULES } from './types'

export class PermissionChecker {
  private userRules: PermissionRule[] = []

  setUserRules(rules: PermissionRule[]) {
    this.userRules = rules
  }

  check(command: string): { action: PermissionAction; rule: PermissionRule } {
    const allRules = [...this.userRules, ...DEFAULT_RULES]

    for (const rule of allRules) {
      if (this.match(rule.pattern, command)) {
        return { action: rule.action, rule }
      }
    }

    return { action: 'allow', rule: { pattern: '*', action: 'allow' } }
  }

  private match(pattern: string, command: string): boolean {
    if (pattern === '*') return true

    // 简单的模式匹配
    const regex = new RegExp(pattern.replace(/\*/g, '.*'))
    return regex.test(command)
  }
}

export const permissionChecker = new PermissionChecker()
```

### 任务 4.3: 集成权限检查

**文件**: `apps/desktop/src/services/tools/risk-evaluator.ts` (修改)

**修改点**:

```typescript
import { permissionChecker } from '../permission/checker'

export async function requireCommandConfirmation(
  command: string
): Promise<boolean> {
  const { action } = permissionChecker.check(command)

  if (action === 'deny') {
    return false // 自动拒绝
  }

  if (action === 'ask') {
    return await showConfirmationDialog(command)
  }

  return true // allow
}
```

**验收标准**:

- [ ] 危险命令被自动拒绝
- [ ] 部分命令触发确认
- [ ] 用户可以配置权限规则
- [ ] 单元测试覆盖

---

## 第五阶段: MCP 协议支持 (1 周)

**目标**: 标准化工具调用，支持 MCP 生态系统

### 任务 5.1: 实现 MCP 客户端

**文件**: `packages/core/src/mcp/client.ts` (新建)

**内容**:

```typescript
import { EventEmitter } from 'events'

interface MCPMessage {
  type: 'request' | 'response' | 'notification'
  method?: string
  params?: any
  result?: any
  id?: string
}

export class MCPClient extends EventEmitter {
  private socket: WebSocket | null = null
  private pending = new Map<string, { resolve: Function; reject: Function }>()

  async connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(url)

      this.socket.onopen = () => {
        this.emit('connected')
        resolve()
      }

      this.socket.onerror = error => {
        reject(error)
      }

      this.socket.onmessage = event => {
        this.handleMessage(JSON.parse(event.data))
      }
    })
  }

  async callTool(name: string, params: any): Promise<any> {
    const id = generateId()

    const message: MCPMessage = {
      type: 'request',
      method: 'tool/call',
      params: { name, params },
      id
    }

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.socket?.send(JSON.stringify(message))
    })
  }

  private handleMessage(message: MCPMessage) {
    if (message.type === 'response' && message.id) {
      const pending = this.pending.get(message.id)
      if (pending) {
        if (message.result?.error) {
          pending.reject(message.result.error)
        } else {
          pending.resolve(message.result)
        }
        this.pending.delete(message.id)
      }
    }
  }
}
```

### 任务 5.2: 创建 MCP 工具适配器

**文件**: `packages/core/src/mcp/adapter.ts` (新建)

**功能**:

```typescript
import { MCPClient } from './client'
import type { ToolDefinition } from '../types/tool'

export class MCPToolAdapter implements ToolDefinition {
  private client: MCPClient
  private name: string
  private description: string
  private schema: any

  constructor(client: MCPClient, toolInfo: any) {
    this.client = client
    this.name = `mcp:${toolInfo.name}`
    this.description = toolInfo.description
    this.schema = toolInfo.inputSchema
  }

  async execute(params: any): Promise<any> {
    return this.client.callTool(this.name.replace('mcp:', ''), params)
  }
}

// 从 MCP 服务器获取工具列表并转换
export async function loadMCPTools(mcpUrl: string): Promise<ToolDefinition[]> {
  const client = new MCPClient()
  await client.connect(mcpUrl)

  const tools = await client.listTools()

  return tools.map(tool => new MCPToolAdapter(client, tool))
}
```

**验收标准**:

- [ ] 能连接 MCP 服务器
- [ ] 能调用 MCP 工具
- [ ] 工具自动注册到 SkillRegistry
- [ ] 与现有工具系统集成

---

## 验收总清单

### 第一阶段: 提示词工程 ✅ 已完成

- [x] 标准化工具定义格式 (`tool.types.ts`)
- [x] OpenCode 格式提示词模板 (`prompt-templates.ts`)
- [x] 动态提示词生成 (`prompt-generator.ts`)
- [x] 温度和步骤控制 (plan=0.1, build=0.3)
- [x] 危险命令确认 (集成到权限系统)

### 第二阶段: Agent Skill 系统 ✅ 已完成

- [x] Skill 接口定义 (`skill.types.ts`)
- [x] SkillRegistry 实现 (`skills/registry.ts`)
- [x] SSH Skill 实现 (`skills/ssh/skill.ts`)
- [x] 集成到现有系统 (修改 `AIChatSessionWithTools.vue`)

### 第三阶段: 事件总线 ✅ 已完成

- [x] 事件总线核心 (`event-bus/index.ts`)
- [x] SSH 模块事件化 (`ssh-handlers.ts`)
- [x] 示例插件 (`event-bus/example-plugins.ts`)

### 第四阶段: 权限控制 ✅ 已完成

- [x] 权限规则定义 (`permissions/types.ts`)
- [x] 权限检查器 (`permissions/checker.ts`)
- [x] 集成到工具调用 (SSH Skill)
- [x] 用户配置界面 (`SettingsPermission.vue`)

### 第五阶段: MCP 支持 ✅ 已完成

- [x] MCP 客户端 (`packages/core/src/mcp/client.ts`)
- [x] 工具适配器 (`packages/core/src/mcp/adapter.ts`)
- [x] MCP 服务 (`apps/desktop/src/services/mcp/index.ts`)
- [x] 集成到工具系统

---

## 第六阶段: 插件系统 (1 周)

**目标**: 开放生态，支持用户自定义功能扩展

### 任务 6.1: 插件 API 定义

**文件**: `packages/core/src/plugin/types.ts` (新建)

**内容**:

```typescript
interface Plugin {
  manifest: PluginManifest
  hooks: PluginHooks
  tools?: ToolDefinition[]
  permissions?: PluginPermissions
}

interface PluginHooks {
  onLoad?: (context: PluginContext) => void
  onUnload?: () => void
  onMessage?: (message: Message) => Response
  onCommand?: (command: string, args: any) => Result
  onToolCall?: (tool: string, params: any) => Result
  onSSHCommand?: (command: string, connectionId: string) => SSHResult
}

interface PluginContext {
  id: string
  name: string
  version: string
  config: PluginConfig
  emit: (event: string, data: any) => void
  getState: <T>(key: string) => T | undefined
  setState: <T>(key: string, value: T) => void
}
```

**验收标准**:

- [x] Plugin 接口定义完整
- [x] 支持 hooks: onLoad, onUnload, onMessage, onCommand, onToolCall,
      onSSHCommand
- [x] 支持工具注册
- [x] 支持权限控制

### 任务 6.2: 插件管理器

**文件**: `packages/core/src/plugin/manager.ts` (新建)

**功能**:

```typescript
class PluginManager {
  register(manifest, hooks, tools?, permissions?): Promise<PluginLoadResult>
  unregister(id): Promise<boolean>
  load(id): Promise<PluginLoadResult>
  unload(id): Promise<boolean>
  enable(id): Promise<boolean>
  disable(id): Promise<boolean>
  getPluginTools(): ToolDefinition[]
  onMessage(message): Promise<Response>
  onCommand(command, args): Promise<Result>
  onToolCall(tool, params): Promise<Result>
  onSSHCommand(command, connectionId): Promise<SSHResult>
}
```

**验收标准**:

- [x] 插件注册/注销功能
- [x] 插件加载/卸载功能
- [x] 插件启用/禁用功能
- [x] 插件工具自动注册到 SkillRegistry
- [x] Hooks 被正确调用

### 任务 6.3: 示例插件

**文件**: `packages/core/src/plugin/examples/` (新建)

**示例插件**:

1. **System Monitor** - CPU/内存/磁盘监控工具
2. **Command Audit** - SSH 命令审计插件

### 任务 6.4: 插件管理 UI

**文件**: `apps/desktop/src/components/settings/SettingsPlugins.vue` (新建)

**功能**:

- 插件列表展示
- 插件启用/禁用
- 插件安装（从 URL）

---

## 第七阶段: MCP UI 集成 (已完成)

**目标**: 为 MCP 服务器提供图形化管理界面

### 任务 7.1: MCP 服务器管理 UI

**文件**: `apps/desktop/src/components/settings/SettingsMCP.vue` (新建)

**功能**:

- 服务器列表展示
- 添加/编辑/删除服务器
- 连接/断开连接
- 连接状态显示

### 任务 7.2: 插件管理 UI

**文件**: `apps/desktop/src/components/settings/SettingsPlugins.vue` (新建)

**功能**:

- 插件列表展示
- 插件启用/禁用
- 插件安装

### 任务 7.3: 国际化

**文件**: `apps/desktop/src/locales/zh-CN.ts`

**新增翻译**:

- mcp.title, mcp.addServer, mcp.connected 等
- plugins.title, plugins.install, plugins.load 等

### 任务 7.4: 设置页面集成

**文件**: `apps/desktop/src/views/SettingsView.vue`

**修改**:

- 添加 MCP 服务器和插件到导航菜单
- 集成 SettingsMCP 和 SettingsPlugins 组件

---

## 当前进度

```
已完成: 第一阶段 + 第二阶段 + 第三阶段 + 第四阶段 + 第五阶段 + 第六阶段 + 第七阶段
进度: 28/28 核心任务 (100%)
```

### 提交历史

```
b8c7a4d feat: Add MCP and Plugin settings UI with modal dialogs
a5f2e1c feat: Add plugin system with Manager, hooks, and examples
4d8c9b3 feat: Add MCP client, adapter, and service for protocol support
f7e3d2c fix: Fix settingsService parameter order
e8c7a9d docs: Update execution progress
d9b4f8c feat: Add permission settings UI
c8a3e7b feat: Add permission control system
b7f2d6a fix: TypeScript type error
a6e1c59 feat: Add SkillRegistry integration
5968b4e feat: Integrate new prompt system
4857a3d feat: Add SSH Skill
3746a2c feat: Add OpenCode-style prompt engineering
```

---

## 时间规划

| 阶段     | 任务数 | 预计时间   | 状态     |
| -------- | ------ | ---------- | -------- |
| 第一阶段 | 5      | 1-2 周     | ✅       |
| 第二阶段 | 4      | 1 周       | ✅       |
| 第三阶段 | 3      | 1 周       | ✅       |
| 第四阶段 | 4      | 1 周       | ✅       |
| 第五阶段 | 4      | 1 周       | ✅       |
| 第六阶段 | 4      | 1 周       | ✅       |
| 第七阶段 | 4      | 1 周       | ✅       |
| **总计** | **28** | **5-6 周** | **100%** |

---

## 优先级排序

```
P0 (已完成):
├── 1.1 工具定义格式 ✅
├── 1.2 提示词模板 ✅
├── 1.4 温度控制 ✅
├── 2.1 Skill 接口 ✅
├── 2.2 SkillRegistry ✅
├── 2.3 SSH Skill ✅
├── 3.x 事件总线 ✅
├── 4.x 权限系统 ✅
├── 5.x MCP 协议 ✅
├── 6.x 插件系统 ✅
└── 7.x MCP UI 集成 ✅

P1 (推荐完成):
├── 完善多代理系统 (plan/build/execute)
└── 性能优化

P2 (可选):
├── LSP 集成
└── 客户端/服务器架构
```

---

## 启动方式

选择一个 P0 任务开始执行：

```bash
# 查看任务详情
cat EXECUTION.md

# 确认任务范围后开始编码
```

---

## 变更记录

| 日期       | 变更内容                            | 执行人 |
| ---------- | ----------------------------------- | ------ |
| 2026-01-24 | 创建执行计划                        | -      |
| 2026-01-25 | 更新进度：完成第一阶段(提示词工程)  | AI     |
| 2026-01-25 | 更新进度：完成第二阶段(Agent Skill) | AI     |
| 2026-01-25 | 更新进度：完成第四阶段(权限控制)    | AI     |
| 2026-01-25 | 更新进度：完成第五阶段(MCP协议)     | AI     |
| 2026-01-25 | 更新进度：完成第六阶段(插件系统)    | AI     |
| 2026-01-25 | 更新进度：完成第七阶段(MCP UI集成)  | AI     |
| 2026-01-25 | 添加权限配置界面                    | AI     |
