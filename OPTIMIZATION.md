# AI SSH Assistant 优化建议

基于 OpenCode 参考项目的分析，以下是可以借鉴和优化的方向：

## 一、架构优化

### 1. 引入事件总线架构

**当前问题**: 模块间通过直接调用耦合紧密，扩展困难

**优化方案**:

```
# 建议添加
packages/bus/
├── src/
│   ├── index.ts          # 事件总线核心
│   ├── definitions.ts    # 事件定义 (Zod Schema)
│   └── subscriptions.ts  # 订阅管理
└── package.json
```

**收益**: 解耦 SSH 连接、AI 对话、文件操作等模块，支持插件订阅事件

### 2. 协议标准化

**当前问题**: AI 工具调用缺乏标准化协议

**优化方案**:

- 实现 MCP (Model Context Protocol) 客户端
- 定义标准的工具调用格式
- 支持 MCP Server 扩展

**收益**: 复用现有 MCP 生态系统，连接更多工具

### 3. 客户端/服务器架构改造

**当前问题**: 主要面向本地桌面场景

**优化方案**:

- 拆分 CLI 核心为独立包
- 实现 ACP (Agent Client Protocol)
- 支持远程连接和移动端客户端

**收益**: 支持远程管理服务器场景，扩展使用场景

### 4. 提示词工程 (Prompt Engineering)

**当前问题**: 提示词简单，幻觉较多，指令遵循不稳定

**优化方案**:

**参考 OpenCode 的提示词系统设计**:

````markdown
---
description: SSH 服务器管理助手
mode: primary
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  ssh: true
  file: true
  bash: true
  edit: false
---

# SSH AI Assistant

You are an expert Linux system administrator and DevOps engineer. Your role is
to help users manage remote servers through natural language commands.

## Core Principles

### 1. Safety First

- Always verify destructive commands before execution
- Ask for confirmation for commands matching patterns:
  - `rm -rf *`
  - `dd if=* of=*`
  - `chmod -R 777 *`
  - `systemctl restart *`
- Suggest safe alternatives when possible

### 2. Context Awareness

- Check server OS distribution (Debian/Ubuntu vs RHEL/CentOS)
- Verify service status before modifications
- Consider server resource constraints (disk, memory, CPU)

### 3. Precision Over Speed

- When uncertain about a command, ask clarifying questions
- Provide command explanation before execution
- Suggest testing in non-production first

## Command Patterns

### Package Management

```bash
# Debian/Ubuntu
apt update && apt upgrade -y

# RHEL/CentOS
yum update -y

# Alpine
apk update && apk upgrade
```
````

### Service Management

```bash
# Check status
systemctl status <service>

# Restart with verification
systemctl restart <service> && systemctl is-active <service>
```

### File Operations

```bash
# Safe copy with confirmation
cp -i <source> <destination>

# Backup before modification
cp -b <file> <file>.backup
```

## Error Handling

When a command fails:

1. Analyze the error message
2. Suggest fixes based on common causes
3. Offer alternative approaches
4. Ask if user wants to try a different solution

````

**工具定义标准化**:

```typescript
// .ai-ssh/tool/ssh-execute.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Execute a command on the remote server via SSH",
  args: {
    command: tool.schema
      .string()
      .describe("The command to execute")
      .min(1, "Command cannot be empty"),

    timeout: tool.schema
      .number()
      .describe("Timeout in milliseconds")
      .default(30000),

    verify: tool.schema
      .boolean()
      .describe("Ask for confirmation before execution")
      .default(true),
  },

  async execute(args, context) {
    const { command, timeout, verify } = args

    if (verify) {
      await context.ask({
        permission: "ssh:execute",
        patterns: [command],
        always: false,
      })
    }

    return await ssh.execute(command, { timeout })
  },
})

export default tool({
  description: "Read file content from the remote server",
  args: {
    path: tool.schema
      .string()
      .describe("Absolute path to the file"),

    encoding: tool.schema
      .enum(["utf-8", "base64"])
      .default("utf-8"),
  },
  async execute(args) {
    return await sftp.readFile(args.path, args.encoding)
  },
})

export default tool({
  description: "Write or edit file content on the remote server",
  args: {
    path: tool.schema.string().describe("Absolute path to the file"),
    content: tool.schema.string().describe("File content to write"),
    backup: tool.schema.boolean().default(true),
  },
  async execute(args) {
    if (args.backup) {
      await sftp.readFile(args.path).then(backup =>
        sftp.writeFile(`${args.path}.backup`, backup)
      )
    }
    return await sftp.writeFile(args.path, args.content)
  },
})
````

**提示词模板管理**:

```
prompts/
├── system/
│   ├── default.md        # 默认系统提示词
│   ├── plan.md           # 只读分析模式
│   └── build.md          # 执行模式
├── instruction/
│   ├── safety.md         # 安全操作规范
│   ├── context.md        # 上下文感知规则
│   └── error.md          # 错误处理指南
└── agent/
    ├── triage.md         # 问题分类
    └── executor.md       # 命令执行
```

**减少幻觉的具体策略**:

| 策略     | 实现方式                 | 效果         |
| -------- | ------------------------ | ------------ |
| 温度控制 | `temperature: 0.1`       | 减少随机输出 |
| 工具限制 | `tools: { edit: false }` | 禁止危险操作 |
| 步骤限制 | `maxSteps: 10`           | 防止过度推理 |
| 确认机制 | `verify: true`           | 执行前确认   |
| 具体指令 | 详细的操作规范           | 提高准确性   |
| 示例注入 | Few-shot examples        | 引导正确输出 |

**收益**:

- 显著减少幻觉，提高命令准确性
- 标准化工具调用格式，易于扩展
- 安全优先，防止危险操作
- 支持多种 Agent 模式 (plan/build/triage)
- 可配置的提示词模板，便于定制

## 三、代理系统

### 1. 多代理模式

**当前问题**: 单一对话模式，缺乏任务分解能力

**优化方案**:

```
# 建议添加
packages/agent/
├── src/
│   ├── types.ts          # 代理类型定义
│   ├── build.ts          # 构建代理 (执行命令)
│   ├── plan.ts           # 计划代理 (只读分析)
│   └── general.ts        # 通用代理 (多步骤)
└── package.json
```

**收益**:

- `plan` 模式预览命令不执行，降低风险
- `build` 模式自动执行验证过的命令
- 支持复杂任务的分解和执行

### 2. 细粒度权限控制

**当前问题**: 缺乏用户可配置的权限系统

**优化方案**:

```
# 建议添加权限配置
permission:
  # 默认规则
  defaults:
    "*": "ask"           # 默认询问
    "rm -rf /": "deny"   # 高危命令拒绝
    "sudo *": "ask"      # sudo 需要确认

  # 用户规则
  user:
    "git push": "allow"
    "npm install": "allow"
```

**收益**:

- 平衡便利性和安全性
- 支持不同用户角色配置
- 危险命令需要明确授权

### 3. Agent Skill 系统

**当前问题**: 缺乏可复用的技能定义，用户无法自定义复杂操作

**优化方案**:

```
packages/skill/
├── src/
│   ├── index.ts           # Skill 核心模块
│   ├── loader.ts          # Skill 加载器
│   ├── parser.ts          # Markdown 解析
│   └── types.ts           # 类型定义
├── skills/
│   └── deploy/
│       └── SKILL.md       # 部署技能定义
└── package.json
```

**Skill 定义格式** (Markdown + YAML frontmatter):

````markdown
---
name: deploy
description: 自动化部署应用到服务器
parameters:
  env: dev | prod
  version: string
---

# 部署技能

当用户需要部署应用时使用此技能：

## 使用方式

```bash
npm run deploy -- --env=prod --version=1.0.0
```
````

## 前置条件

- 确保 SSH 连接已建立
- 检查服务器磁盘空间
- 备份当前版本

````

**加载机制**:

```typescript
// 扫描目录
const SKILL_GLOB = new Bun.Glob('**/SKILL.md')

// 支持多个位置
const skillDirs = [
  '.ai-ssh/skills/', // 项目级 skills
  '~/.ai-ssh/skills/' // 全局 skills
]

// 解析 frontmatter
const info = z
  .object({
    name: z.string(),
    description: z.string(),
    parameters: z.record(z.any()).optional()
  })
  .parse(markdown.data)
````

**与 Agent 集成**:

```typescript
// 作为工具注册到 Agent
const SkillTool = Tool.define('skill', async ctx => {
  return {
    description:
      'Load a skill to get detailed instructions for a specific task',
    parameters: z.object({
      name: z.string().describe('The skill identifier from available_skills')
    }),
    async execute(params) {
      const skill = await Skill.get(params.name)
      return {
        content: skill.content,
        title: `Loaded skill: ${skill.name}`
      }
    }
  }
})

// Agent 自动发现可用 skills
const availableSkills = await Skill.all()
```

**收益**:

- 复用常见操作模式 (部署、备份、监控等)
- 用户可自定义复杂工作流
- 支持 Markdown 格式，编写简单
- 与权限系统集成，安全可控
- 支持项目级和全局级技能共享

## 四、代码组织优化

### 1. 统一包管理器

**当前问题**: pnpm + Turbo 配置复杂

**优化方案**:

- 迁移到 Bun workspaces
- 使用 Bun 的原生 TypeScript 支持
- 简化构建配置

**收益**:

- 更快的安装和构建速度
- 更简洁的配置文件
- 更好的运行时性能

### 2. 增强工具系统

**当前问题**: 工具调用缺乏标准化

**优化方案**:

```
packages/tool/
├── src/
│   ├── base.ts           # 工具基类
│   ├── ssh.ts            # SSH 工具
│   ├── file.ts           # 文件工具
│   ├── exec.ts           # 执行工具
│   └── registry.ts       # 工具注册表
└── package.json
```

**收益**: 工具定义标准化，易于扩展新工具

### 3. 技能系统

**当前问题**: 缺乏复用能力

**优化方案**:

```typescript
// 定义可复用的技能
const skills = {
  deploy: {
    description: '部署应用到服务器',
    parameters: z.object({
      env: z.enum(['dev', 'prod']),
      version: z.string()
    }),
    execute: async (ctx, params) => { ... }
  },

  backup: {
    description: '备份服务器数据',
    ...
  }
}
```

**收益**:

- 复用常见操作
- 自然语言触发复杂任务
- 降低使用门槛

## 五、扩展性增强

### 1. 插件系统

**当前问题**: 缺乏扩展机制

**优化方案**:

```typescript
// 插件 API
interface Plugin {
  name: string
  version: string
  tools?: Tool[]
  hooks?: {
    onMessage?: (msg: Message) => void
    onCommand?: (cmd: string) => boolean
  }
}

// 插件示例
export default {
  name: 'monitor',
  version: '1.0.0',
  tools: [monitorCPU, monitorMemory],
  hooks: {
    onCommand: cmd => {
      if (cmd.startsWith('monitor ')) {
        // 自定义处理
        return true
      }
      return false
    }
  }
} satisfies Plugin
```

**收益**: 开放生态，用户可自定义功能

### 2. LSP 集成

**当前问题**: 缺乏代码分析能力

**优化方案**:

- 集成 Language Server Protocol
- 支持代码自动补全
- 语法检查和错误提示

**收益**: 更好的代码编辑体验

## 六、性能优化

### 1. 流式响应优化

**当前问题**: AI 响应等待时间长

**优化方案**:

- 实现流式终端输出
- 命令执行结果实时推送
- 优化网络传输效率

**收益**: 更流畅的交互体验

### 2. 会话管理优化

**当前问题**: 大对话历史影响性能

**优化方案**:

- 实现对话摘要压缩
- 智能截断历史消息
- 本地缓存优化

**收益**: 支持更长对话，保持响应速度

## 七、安全增强

### 1. 命令验证增强

**当前问题**: 风险评估功能简单

**优化方案**:

- 集成恶意命令检测
- 支持自定义安全规则
- 命令执行前沙箱检查

**收益**: 更安全的生产环境使用

### 2. 审计日志完善

**当前问题**: 审计功能基础

**优化方案**:

- 详细操作审计日志
- 可疑行为告警
- 合规报告生成

**收益**: 企业级安全需求满足

## 八、优先级建议

### 高优先级 (立即执行)

1. **提示词工程** - 直接采用 OpenCode 提示词系统，减少幻觉
2. **事件总线架构** - 基础架构改进
3. **细粒度权限控制** - 安全增强
4. **Agent Skill 系统** - 可复用技能库

### 中优先级 (规划实施)

1. **多代理系统** - 复杂任务支持 (plan/build/execute)
2. **MCP 协议支持** - 标准化工具调用
3. **插件系统** - 开放生态
4. **性能优化** - 用户体验提升

### 低优先级 (长期考虑)

1. **客户端/服务器架构** - 架构升级
2. **LSP 集成** - 高级功能
3. **Bun 迁移** - 技术栈统一

## 九、具体行动项

### 第一阶段: 提示词工程 (1-2 周)

```
1. 采用 OpenCode 提示词模板格式
2. 定义标准化工具描述 (ssh-execute, file-read, file-write)
3. 实现温度控制和步骤限制
4. 添加安全确认机制
```

### 第二阶段: 架构改进 (2-3 周)

```
1. 创建事件总线模块
2. 实现基础事件定义
3. 重构 SSH 连接管理
4. 重构 AI 对话服务
```

### 第三阶段: 安全增强 (1-2 周)

```
1. 实现权限控制系统
2. 添加命令预览模式
3. 完善风险评估
4. 增加审计日志
```

### 第四阶段: 功能扩展 (3-4 周)

```
1. 实现多代理系统
2. 添加插件 API
3. 集成 MCP 客户端
4. 实现 Agent Skill 系统
```

### 第五阶段: 性能优化 (持续)

```
1. 流式响应优化
2. 会话管理优化
3. 构建流程优化
4. 内存占用优化
```

---

## 参考资料

- OpenCode 项目: https://github.com/anomalyco/opencode
- Vercel AI SDK: https://sdk.vercel.ai
- Model Context Protocol: https://modelcontextprotocol.io
- Tauri 2.0: https://tauri.app
