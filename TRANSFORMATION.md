# AI SSH Assistant 转型为通用 AI 助手框架

基于 OpenCode 参考项目的分析，制定从"SSH 专用助手"到"通用 AI 助手框架"的转型计划。

## 一、转型目标

```
当前: AI SSH Assistant (专用 SSH 管理工具)
                    ↓ 架构重构
目标: AI Assistant Framework (通用助手框架)
     ├── SSH Skill (可选插件)
     ├── Deploy Skill (可选插件)
     ├── Database Skill (可选插件)
     └── Custom Skills (用户自定义)
```

**核心价值转变:**

- 从"SSH 管理"到"通用任务助手"
- SSH 只是众多技能之一
- 支持插件化扩展
- 兼容 OpenCode 的提示词系统

## 二、架构对比

### 当前架构 (紧耦合)

```
┌─────────────────────────────────────────────────┐
│              AIChatSessionWithTools              │ ← 上帝组件
│  (聊天 UI + 工具调用 + 风险评估 + Todo解析)      │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              tool-executor.ts                    │ ← 硬编码工具
│  switch(toolName) {                              │
│    case 'execute_ssh_command': ...               │
│    case 'read_file': ...                         │
│    ...                                           │
│  }                                               │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              ssh-handlers.ts                     │ ← 上帝类
│         SSHManager + SFTP + 日志                  │
└─────────────────────────────────────────────────┘
```

### 目标架构 (插件化)

```
┌─────────────────────────────────────────────────┐
│              Agent Core                          │
│  (提示词生成 + 工具协调 + 权限控制 + 会话管理)    │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              Skill Registry                      │
│  ┌───────────┐ ┌───────────┐ ┌───────────────┐  │
│  │ SSH Skill │ │  Deploy   │ │ Custom Skill  │  │
│  │           │ │   Skill   │ │               │  │
│  └───────────┘ └───────────┘ └───────────────┘  │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              Tool Executor                       │
│  (动态工具发现 + 权限验证 + 执行协调)             │
└─────────────────────────────────────────────────┘
```

## 三、核心重构

### 1. 新增框架核心模块

```
packages/core/
├── src/
│   ├── skill/
│   │   ├── interface.ts        # 技能接口定义
│   │   ├── registry.ts         # 技能注册表
│   │   └── loader.ts           # 技能加载器
│   │
│   ├── tool/
│   │   ├── definition.ts       # 工具定义类型
│   │   ├── executor.ts         # 通用执行器
│   │   └── parser.ts           # 响应解析器
│   │
│   ├── prompts/
│   │   ├── generator.ts        # 动态提示词生成
│   │   └── templates/          # 提示词模板
│   │
│   └── agent/
│       ├── types.ts            # Agent 类型
│       └── coordinator.ts      # Agent 协调器
│
└── package.json
```

### 2. 技能接口设计

```typescript
// packages/core/src/skill/interface.ts

import { z } from 'zod'
import type { ToolDefinition } from '../tool/definition'

export interface Skill {
  // 技能标识
  id: string
  name: string
  version: string
  description: string

  // 工具定义
  tools: ToolDefinition[]

  // 提示词片段
  systemPrompt: string // 系统提示词
  instructionPrompt?: string // 操作指令

  // 生命周期
  initialize?(context: SkillContext): Promise<void>
  execute(toolName: string, params: any): Promise<ToolResult>
  dispose?(): void
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

### 3. SSH 技能迁移

```typescript
// packages/core/src/skills/ssh/index.ts

import type { Skill } from '../../skill/interface'
import {
  sshExecuteTool,
  fileReadTool,
  fileWriteTool,
  listFilesTool
} from './tools'
import { sshSystemPrompt, sshInstructions } from './prompts'

export const sshSkill: Skill = {
  id: 'ssh',
  name: 'SSH Server Management',
  version: '1.0.0',
  description: 'Manage remote Linux servers via SSH connection',

  tools: [sshExecuteTool, fileReadTool, fileWriteTool, listFilesTool],

  systemPrompt: sshSystemPrompt,
  instructionPrompt: sshInstructions,

  async initialize(context) {
    // 初始化 SSH 连接池
    await SSHConnectionPool.ensureReady()
  },

  async execute(toolName, params) {
    const executor = SSHExecutor.getInstance()
    return await executor.execute(toolName, params)
  }
}
```

### 4. 工具定义迁移

```typescript
// packages/core/src/skills/ssh/tools/ssh-execute.ts

import { tool } from '@opencode-ai/plugin'
import { z } from 'zod'

export const sshExecuteTool = tool({
  description: 'Execute a command on the remote server via SSH',
  args: {
    command: tool.schema
      .string()
      .min(1, 'Command cannot be empty')
      .describe('The command to execute'),

    connectionId: tool.schema.string().describe('SSH connection identifier'),

    verify: tool.schema
      .boolean()
      .default(true)
      .describe('Ask for confirmation before execution'),

    timeout: tool.schema
      .number()
      .default(30000)
      .describe('Timeout in milliseconds')
  },

  async execute(args, context) {
    const executor = SSHExecutor.getInstance()

    if (args.verify) {
      await context.ask({
        permission: 'ssh:execute',
        patterns: [args.command],
        always: false
      })
    }

    return await executor.runCommand(args.command, {
      connectionId: args.connectionId,
      timeout: args.timeout
    })
  }
})
```

### 5. 提示词模板迁移

```markdown
<!-- packages/core/src/skills/ssh/prompts/system.md -->

---

name: ssh-system description: SSH server management assistant mode: primary
model: anthropic/claude-sonnet-4-20250514 temperature: 0.1 tools: ssh-execute:
true ssh-file-read: true ssh-file-write: true ssh-list-files: true

---

# SSH Server Management Assistant

You are an expert Linux system administrator and DevOps engineer. Your role is
to help users manage remote servers through natural language.

## Core Principles

### 1. Safety First

- ALWAYS verify destructive commands:
  - `rm -rf *`
  - `dd if=* of=*`
  - `chmod -R 777 *`
  - `mkfs.*`
  - `iptables --flush`
- Ask for confirmation when uncertain

### 2. Context Awareness

- Check OS distribution (Debian/Ubuntu vs RHEL/CentOS vs Alpine)
- Verify service status before modifications
- Consider server resources

### 3. Precision Over Speed

- Provide command explanation before execution
- Suggest testing in non-production first
- Ask clarifying questions when uncertain

## Available Tools

- `ssh-execute`: Execute shell commands
- `ssh-file-read`: Read file content
- `ssh-file-write`: Write/edit file content
- `ssh-list-files`: List directory contents

## Workflow

1. **Understand** - Grasp the user's goal
2. **Plan** - Formulate a command or sequence
3. **Verify** - Check for safety issues
4. **Execute** - Run with user confirmation
5. **Verify** - Confirm success and output
```

### 6. 技能注册表

```typescript
// packages/core/src/skill/registry.ts

import type { Skill, ToolDefinition } from './interface'

export class SkillRegistry {
  private skills = new Map<string, Skill>()
  private toolMap = new Map<string, ToolDefinition>()

  register(skill: Skill): void {
    this.skills.set(skill.id, skill)

    // 注册工具到全局映射
    for (const tool of skill.tools) {
      this.toolMap.set(`${skill.id}:${tool.name}`, tool)
    }
  }

  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId)
  }

  getTool(skillId: string, toolName: string): ToolDefinition | undefined {
    return this.toolMap.get(`${skillId}:${toolName}`)
  }

  getAllTools(): ToolDefinition[] {
    return Array.from(this.toolMap.values())
  }

  generateSystemPrompt(): string {
    const prompts = []

    for (const skill of this.skills.values()) {
      if (skill.systemPrompt) {
        prompts.push(skill.systemPrompt)
      }
    }

    return prompts.join('\n\n---\n\n')
  }
}

// 全局注册表实例
export const skillRegistry = new SkillRegistry()

// 注册 SSH 技能
import { sshSkill } from './skills/ssh'
skillRegistry.register(sshSkill)

// 注册部署技能
import { deploySkill } from './skills/deploy'
skillRegistry.register(deploySkill)
```

## 四、提示词系统 (直接采用 OpenCode)

### 1. Agent 配置

```typescript
// packages/core/src/agent/types.ts

export type AgentMode = 'primary' | 'subagent' | 'all'

export interface AgentConfig {
  name: string
  description: string
  mode: AgentMode
  model: {
    provider: string
    modelId: string
  }
  temperature: number // 0.0-1.0, 建议 0.1
  maxSteps?: number // 最大推理步骤
  prompt?: string // 提示词模板路径
  tools?: {
    [skillId: string]: {
      [toolName: string]: boolean
    }
  }
  permission?: PermissionRules
}

export interface PermissionRules {
  [pattern: string]: 'allow' | 'deny' | 'ask'
}
```

### 2. 提示词生成器

```typescript
// packages/core/src/prompts/generator.ts

import { skillRegistry } from '../skill/registry'
import { loadMarkdownConfig } from '../config/markdown'

export async function generateSystemPrompt(
  agentConfig: AgentConfig,
  projectRules?: string[]
): Promise<string> {
  const components: string[] = []

  // 1. 技能系统提示词
  const skillPrompts = skillRegistry.generateSystemPrompt()
  if (skillPrompts) {
    components.push(skillPrompts)
  }

  // 2. 项目规则
  if (projectRules) {
    components.push(...projectRules)
  }

  // 3. Agent 特定提示词
  if (agentConfig.prompt) {
    const promptTemplate = await loadMarkdownConfig(agentConfig.prompt)
    components.push(promptTemplate.content)
  }

  return components.join('\n\n---\n\n')
}

export function generateToolDescriptions(): object[] {
  const tools = skillRegistry.getAllTools()

  return tools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: tool.args,
        required: tool.required || []
      }
    }
  }))
}
```

### 3. Agent 执行器

```typescript
// packages/core/src/agent/coordinator.ts

import { skillRegistry } from '../skill/registry'
import {
  generateSystemPrompt,
  generateToolDescriptions
} from '../prompts/generator'
import type { AgentConfig, ToolResult } from './types'

export class AgentCoordinator {
  private config: AgentConfig

  constructor(config: AgentConfig) {
    this.config = config
  }

  async *execute(input: string): AsyncGenerator<string> {
    const context = {
      sessionId: generateSessionId(),
      agent: this.config.name,
      abort: new AbortController().signal,
      ask: this.createAskHandler()
    }

    // 1. 生成系统提示词
    const systemPrompt = await generateSystemPrompt(this.config)

    // 2. 生成工具描述
    const tools = generateToolDescriptions()

    // 3. 调用 AI 模型
    const response = await callAIModel({
      model: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxSteps ? this.config.maxSteps * 1000 : undefined,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input }
      ],
      tools
    })

    // 4. 处理响应
    for (const message of response.messages) {
      if (message.role === 'assistant') {
        // 解析工具调用
        if (message.tool_calls) {
          for (const toolCall of message.tool_calls) {
            const result = await this.executeTool(toolCall, context)
            yield result
          }
        } else {
          yield message.content
        }
      }
    }
  }

  private async executeTool(toolCall: any, context: any): Promise<string> {
    const [skillId, toolName] = toolCall.function.name.split(':')
    const tool = skillRegistry.getTool(skillId, toolName)

    if (!tool) {
      throw new Error(`Tool not found: ${toolCall.function.name}`)
    }

    const args = JSON.parse(toolCall.function.arguments)

    const result = await tool.execute(args, context)

    return result.content
  }
}
```

## 五、减少幻觉的策略

### 1. 温度控制

```typescript
const defaultAgent: AgentConfig = {
  // ...
  temperature: 0.1 // 降低随机性，提高准确性
  // ...
}
```

### 2. 步骤限制

```typescript
const planAgent: AgentConfig = {
  // ...
  maxSteps: 10 // 限制推理步骤
  // ...
}
```

### 3. 工具限制

```typescript
const planAgent: AgentConfig = {
  tools: {
    ssh: {
      'ssh-execute': false, // 禁止执行命令
      'ssh-file-read': true, // 只允许读取
      'ssh-file-write': false
    }
  }
}
```

### 4. 权限控制

```typescript
const permissionAgent: AgentConfig = {
  permission: {
    'ssh:execute': 'ask', // 执行前询问
    'ssh:write': 'ask',
    'deploy:*': 'deny', // 禁止部署操作
    '*': 'allow'
  }
}
```

### 5. 确认机制

```typescript
// 在工具定义中
export const sshExecuteTool = tool({
  // ...
  async execute(args, context) {
    // 高危命令自动触发确认
    if (isDangerousCommand(args.command)) {
      await context.ask({
        permission: 'ssh:execute:dangerous',
        patterns: [args.command],
        always: false
      })
    }

    return await ssh.execute(args.command)
  }
})
```

## 六、迁移计划

### 第一阶段: 提取工具层 (1-2 周)

```
任务:
1. 从 AIChatSessionWithTools.vue 提取:
   - 风险评估函数 → risk-evaluator.ts
   - Todo 解析函数 → todo-parser.ts
   - XML 解析逻辑 → response-parser.ts

2. 重构 tool-executor.ts:
   - 定义工具接口
   - 抽取 SSH 工具到独立函数
   - 移除 switch 语句

产出:
- packages/core/src/tool/definition.ts
- packages/core/src/tool/parser.ts
```

### 第二阶段: 定义技能接口 (1 周)

```
任务:
1. 创建技能接口 (skill/interface.ts)
2. 创建技能注册表 (skill/registry.ts)
3. 将 SSH 工具包装为技能

产出:
- Skill 接口
- SkillRegistry 类
- ssh-skill 初始版本
```

### 第三阶段: 重构提示词系统 (1 周)

```
任务:
1. 创建提示词模板格式 (Markdown + YAML frontmatter)
2. 实现动态提示词生成 (prompts/generator.ts)
3. 迁移 SSH 提示词到模板

产出:
- prompts/templates/ssh-system.md
- prompts/templates/ssh-plan.md
```

### 第四阶段: 集成 Agent 协调器 (1 周)

```
任务:
1. 创建 Agent 类型定义 (agent/types.ts)
2. 实现 Agent 执行器 (agent/coordinator.ts)
3. 集成技能注册表

产出:
- Agent 协调器
- 工具调用流程
```

### 第五阶段: 添加新技能 (持续)

```
可选技能:
- deploy-skill: 部署管理
- docker-skill: Docker 容器管理
- k8s-skill: Kubernetes 管理
- database-skill: 数据库操作
- custom-skill: 用户自定义
```

## 七、目录结构

```
packages/core/
├── src/
│   ├── skill/
│   │   ├── interface.ts        # 技能接口
│   │   ├── registry.ts         # 技能注册表
│   │   ├── loader.ts           # 技能加载器
│   │   └── errors.ts           # 错误类型
│   │
│   ├── tool/
│   │   ├── definition.ts       # 工具定义
│   │   ├── executor.ts         # 执行器
│   │   └── parser.ts           # 响应解析
│   │
│   ├── prompts/
│   │   ├── generator.ts        # 提示词生成
│   │   ├── loader.ts           # 模板加载
│   │   └── templates/          # 模板文件
│   │       ├── system/
│   │       │   └── ssh.md
│   │       ├── instruction/
│   │       │   └── ssh.md
│   │       └── agent/
│   │           └── ssh.md
│   │
│   ├── agent/
│   │   ├── types.ts            # Agent 类型
│   │   ├── coordinator.ts      # 协调器
│   │   └── executor.ts         # 执行器
│   │
│   └── config/
│       ├── types.ts            # 配置类型
│       └── markdown.ts         # Markdown 解析
│
├── skills/
│   ├── ssh/
│   │   ├── index.ts            # SSH 技能入口
│   │   ├── tools/              # SSH 工具定义
│   │   ├── prompts/            # SSH 提示词
│   │   └── executor.ts         # SSH 执行器
│   │
│   └── deploy/
│       ├── index.ts
│       ├── tools/
│       └── prompts/
│
└── package.json
```

## 八、兼容性

### 保持向后兼容

```typescript
// 现有 API 仍然可用
import { SSHService } from '@ai-ssh/server'
import { ChatService } from '@ai-ssh/shared'

// 新架构通过技能方式提供 SSH 功能
import { sshSkill } from '@ai-ssh/core/skills/ssh'

// 用户可以选择使用:
const agent = new AgentCoordinator({
  skills: [sshSkill]
})
```

### 渐进式迁移

```
v1.6.x (当前) → v1.7.x → v2.0.x
  │               │          │
  │               │          └── 纯技能架构
  │               │
  │               └── 混合模式 (传统 + 技能)
  │
  └── 传统架构
```

## 九、收益

| 方面           | 收益                               |
| -------------- | ---------------------------------- |
| **通用性**     | 从 SSH 助手变为通用助手框架        |
| **可扩展性**   | 插件化技能，易于添加新功能         |
| **可维护性**   | 模块化设计，职责分离               |
| **可测试性**   | 技能可独立单元测试                 |
| **复用性**     | SSH 技能可在其他项目复用           |
| **提示词质量** | 采用 OpenCode 提示词系统，减少幻觉 |
| **安全性**     | 细粒度权限控制，危险命令确认       |

## 参考资料

- OpenCode 项目: https://github.com/anomalyco/opencode
- Vercel AI SDK: https://sdk.vercel.ai
- Model Context Protocol: https://modelcontextprotocol.io
