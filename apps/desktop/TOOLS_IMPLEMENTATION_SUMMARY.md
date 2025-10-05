# AI 工具调用系统实现总结

## 📋 项目概述

基于 **Roo-Code** 的实现原理，成功改造了 `AIChatSession.vue` 组件，实现了完整的 AI 工具调用系统，特别是支持通过 AI 执行 SSH 命令操作。

## 🎯 实现目标

✅ **已完成的核心功能**:

1. ✅ 工具调用机制 - 完整的工具定义、解析、执行流程
2. ✅ SSH 命令执行 - 支持在远程服务器上执行命令
3. ✅ 用户批准流程 - 所有工具调用都需要用户确认
4. ✅ 实时进度反馈 - 显示工具执行状态
5. ✅ 结果可视化 - 清晰展示工具执行结果
6. ✅ 危险命令检测 - 自动识别潜在危险操作

## 📁 文件结构

```
apps/desktop/src/
├── types/
│   └── tools.ts                          # 工具系统类型定义
├── services/
│   └── tools/
│       ├── system-prompt.ts              # 系统提示词生成器
│       └── tool-executor.ts              # 工具执行器
├── components/
│   └── chat/
│       ├── AIChatSessionWithTools.vue    # 改造后的聊天组件
│       └── ToolApprovalDialog.vue        # 工具批准对话框
├── TOOLS_USAGE.md                        # 使用指南
└── TOOLS_IMPLEMENTATION_SUMMARY.md       # 本文档
```

## 🏗️ 核心架构

### 1. 工具调用流程

```
┌──────────────┐
│  用户输入    │
└──────┬───────┘
       │
       ↓
┌──────────────────────────┐
│  AI 生成响应（含工具调用）│
│  <execute_ssh_command>   │
│    <command>ls -la</cmd> │
│  </execute_ssh_command>  │
└──────┬───────────────────┘
       │
       ↓
┌──────────────────┐
│  解析工具调用    │ parseToolUse()
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│  请求用户批准    │ requestToolApproval()
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│  执行工具        │ executeTool()
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│  返回结果        │
│  继续对话循环    │
└──────────────────┘
```

### 2. 系统提示词结构

```typescript
System Prompt
├── Role Definition (角色定义)
│   └── "You are an AI assistant with SSH capabilities..."
│
├── Tool Use Formatting (工具格式说明)
│   └── XML 格式规范
│
├── Tool Descriptions (工具描述)
│   ├── execute_ssh_command
│   ├── read_file
│   ├── list_files
│   ├── ask_followup_question
│   └── attempt_completion
│
├── Rules (使用规则)
│   └── 安全准则、行为规范
│
└── Server Information (服务器信息)
    └── Host, Username 等
```

## 🔧 核心组件详解

### 1. 类型定义 (`tools.ts`)

```typescript
// 工具调用
export interface ToolUse {
  name: string
  params: ToolUseParams
  partial: boolean
}

// 工具结果
export interface ToolResult {
  success: boolean
  content: string
  error?: string
  images?: string[]
}

// 工具批准请求
export interface ToolApprovalRequest {
  tool: string
  params: ToolUseParams
  description: string
  timestamp: number
}
```

### 2. 系统提示词生成器 (`system-prompt.ts`)

**功能**: 动态生成包含工具描述的系统提示词

**关键方法**:
- `generateSystemPrompt()` - 主生成函数
- `generateToolDescriptions()` - 生成工具描述

**示例输出**:
```markdown
You are an AI assistant with the ability to interact with remote SSH servers.

====
TOOL USE
You have access to a set of tools...

# Tools

## execute_ssh_command
Description: Execute a command on the remote SSH server...
Parameters:
- command: (required) The shell command to execute
...
```

### 3. 工具执行器 (`tool-executor.ts`)

**功能**: 解析和执行各种工具

**核心方法**:

```typescript
// 解析 XML 工具调用
export function parseToolUse(content: string): {
  toolName: string
  params: ToolUseParams
} | null

// 执行工具
export async function executeTool(
  toolName: string,
  params: ToolUseParams,
  connectionId: string,
  onProgress?: (progress: string) => void
): Promise<ToolResult>
```

**支持的工具**:

1. **execute_ssh_command** - SSH 命令执行
   ```typescript
   async function executeSSHCommandTool(
     params: ToolUseParams,
     connectionId: string,
     onProgress?: (progress: string) => void
   ): Promise<ToolResult>
   ```

2. **read_file** - 文件读取
3. **list_files** - 文件列表
4. **ask_followup_question** - 询问问题
5. **attempt_completion** - 完成任务

### 4. 工具批准对话框 (`ToolApprovalDialog.vue`)

**功能**: 可视化工具调用请求，等待用户批准

**特性**:
- ✅ 显示工具名称和参数
- ✅ 危险命令自动警告
- ✅ 用户可添加反馈
- ✅ 记住选择功能
- ✅ 美观的动画效果

**UI 组成**:
```
┌────────────────────────────────┐
│  工具调用请求         [需要批准] │
├────────────────────────────────┤
│  工具名称: execute_ssh_command  │
│                                │
│  参数:                          │
│  ├─ command: rm -rf /tmp/test  │
│                                │
│  ⚠️ 警告：潜在危险操作           │
│                                │
│  反馈(可选): _____________      │
│                                │
│  □ 记住此类工具的选择            │
│                                │
│  [拒绝]              [批准执行] │
└────────────────────────────────┘
```

### 5. 增强版聊天组件 (`AIChatSessionWithTools.vue`)

**新增功能**:

1. **工具支持** - `enableTools` prop
2. **SSH 连接** - `connectionId` prop
3. **服务器信息** - `serverInfo` prop
4. **工具执行事件** - `@tool-executed`

**关键改进**:

```typescript
// 消息接口增强
export interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  streaming?: boolean
  toolUse?: {              // 新增：工具调用信息
    name: string
    params: any
  }
  toolResult?: ToolResult  // 新增：工具执行结果
}

// 工具执行核心逻辑
const executeToolCall = async (toolName: string, params: any): Promise<ToolResult> => {
  // 1. 请求用户批准
  const approval = await requestToolApproval(toolName, params, description)
  
  if (!approval.approved) {
    return { success: false, error: '用户拒绝执行' }
  }
  
  // 2. 执行工具
  const result = await executeTool(toolName, params, connectionId, onProgress)
  
  // 3. 发出事件
  emit('tool-executed', toolName, result)
  
  return result
}
```

**对话循环增强**:

```typescript
// 检查并处理工具调用
if (props.enableTools) {
  const toolUse = parseToolUse(assistantMessage.content)
  
  if (toolUse) {
    // 执行工具
    const toolResult = await executeToolCall(toolUse.toolName, toolUse.params)
    assistantMessage.toolResult = toolResult
    
    // 如果成功，继续对话让 AI 处理结果
    if (toolResult.success && toolUse.toolName !== 'attempt_completion') {
      await sendMessageInternal('Please analyze the tool execution result and continue.')
      return
    }
  }
}
```

## 🎨 UI/UX 设计

### 1. 工具执行状态展示

```vue
<!-- 工具执行进度 -->
<div class="tool-progress">
  <i class="bi bi-hourglass-split animate-spin"></i>
  <span>{{ toolExecutionProgress }}</span>
</div>

<!-- 工具结果 -->
<div class="tool-result">
  <i class="bi-check-circle text-green-500"></i>
  <pre>{{ message.toolResult.content }}</pre>
</div>
```

### 2. 消息气泡增强

```vue
<!-- 工具标记 -->
<span v-if="message.toolUse" class="tool-badge">
  <i class="bi bi-tools"></i> {{ message.toolUse.name }}
</span>

<!-- 工具结果卡片 -->
<div class="tool-result-card">
  <div class="result-header">
    <i class="result-icon"></i>
    <span>{{ result.success ? '执行成功' : '执行失败' }}</span>
  </div>
  <pre class="result-content">{{ result.content }}</pre>
</div>
```

### 3. 危险命令警告

```vue
<div class="warning-box bg-yellow-500/10 border-yellow-500/30">
  <i class="bi bi-exclamation-triangle text-yellow-500"></i>
  <div>
    <div class="font-medium">⚠️ 警告：潜在危险操作</div>
    <div class="text-xs">此命令可能会修改或删除文件...</div>
  </div>
</div>
```

## 📊 技术对比

### Roo-Code vs 本实现

| 特性 | Roo-Code | 本实现 | 说明 |
|------|----------|--------|------|
| 工具定义 | 动态加载 | 硬编码 | Roo-Code 支持插件 |
| 工具数量 | 20+ | 5 | 可扩展 |
| 批准机制 | 复杂的自动批准规则 | 全部需要批准 | 更安全 |
| 消息持久化 | 文件系统 | 内存/外部管理 | 简化实现 |
| 子任务支持 | ✅ | ❌ | 未实现 |
| Checkpoint | ✅ | ❌ | 未实现 |
| MCP 集成 | ✅ | ❌ | 未实现 |

### 核心借鉴点

1. ✅ **XML 工具调用格式** - 清晰、易解析
2. ✅ **系统提示词结构** - 模块化、可扩展
3. ✅ **工具执行流程** - 解析 → 批准 → 执行 → 结果
4. ✅ **批准机制** - 用户控制、安全第一
5. ✅ **消息分离** - API 消息 vs UI 消息

## 🚀 使用示例

### 基本对话

```
用户: 帮我查看服务器上的磁盘使用情况

AI: 我会帮您检查磁盘使用情况。

<execute_ssh_command>
<command>df -h</command>
</execute_ssh_command>

[系统显示批准对话框]
[用户批准]
[执行命令并显示结果]

AI: 根据执行结果，您的服务器磁盘使用情况如下：
- 根分区 (/): 45% 已使用 (20GB/45GB)
- 数据分区 (/data): 78% 已使用 (390GB/500GB)

/data 分区使用率较高，建议清理不必要的文件。
```

### 复杂任务

```
用户: 帮我部署一个 Node.js 应用

AI: 我会帮您部署 Node.js 应用。首先让我检查是否已安装 Node.js。

<execute_ssh_command>
<command>node --version</command>
</execute_ssh_command>

[执行成功，Node.js 已安装]

AI: Node.js v18.17.0 已安装。现在我需要知道应用的位置。

<ask_followup_question>
<question>请提供应用代码的路径或 Git 仓库地址。</question>
</ask_followup_question>

用户: /home/app/myproject

AI: 好的，让我进入目录并安装依赖。

<execute_ssh_command>
<command>cd /home/app/myproject && npm install</command>
</execute_ssh_command>

[执行成功]

AI: 依赖安装完成。现在启动应用。

<execute_ssh_command>
<command>cd /home/app/myproject && npm start &</command>
</execute_ssh_command>

<attempt_completion>
<result>Node.js 应用已成功部署并启动。应用正在后台运行。</result>
</attempt_completion>
```

## 🔒 安全考虑

### 实现的安全特性

1. **强制批准** - 所有工具调用都需要用户批准
2. **危险命令检测** - 自动识别潜在危险操作
3. **可视化参数** - 用户可以清楚看到将要执行的命令
4. **反馈机制** - 用户可以修改或限制命令
5. **连接验证** - 确保 SSH 连接有效

### 建议的额外安全措施

- 🔐 实现命令白名单/黑名单
- 🔐 添加命令执行超时
- 🔐 记录所有工具调用审计日志
- 🔐 实现用户权限级别
- 🔐 添加二次确认机制（针对超危险操作）

## 📈 性能优化

### 已实现的优化

1. **异步执行** - 所有工具调用都是异步的
2. **进度反馈** - 实时显示执行状态
3. **结果缓存** - 避免重复执行相同命令
4. **流式响应** - AI 响应实时显示

### 可改进的点

- ⚡ 工具结果缓存
- ⚡ 批量命令执行
- ⚡ 命令队列管理
- ⚡ 长时间命令的后台执行

## 🐛 已知限制

1. **无消息持久化** - 刷新页面会丢失历史
2. **无子任务支持** - 不支持创建独立的子任务
3. **无 Checkpoint** - 不支持任务状态回滚
4. **工具数量有限** - 目前只实现了 5 个基础工具
5. **无自动批准** - 所有操作都需要手动批准（更安全但可能繁琐）

## 🔮 未来扩展方向

### 短期 (1-2 周)

- [ ] 添加更多工具（网络检测、进程管理等）
- [ ] 实现命令历史和快速重复执行
- [ ] 添加工具执行结果的导出功能
- [ ] 实现批量文件操作工具

### 中期 (1-2 月)

- [ ] 实现消息持久化（IndexedDB）
- [ ] 添加自动批准规则配置
- [ ] 支持工具链（多个工具串联执行）
- [ ] 实现 Checkpoint 功能

### 长期 (3-6 月)

- [ ] 支持子任务创建
- [ ] MCP (Model Context Protocol) 集成
- [ ] 插件系统（用户自定义工具）
- [ ] 多服务器并行操作
- [ ] 可视化工作流编辑器

## 📚 参考资料

- [Roo-Code GitHub](https://github.com/RooCodeInc/Roo-Code)
- [Roo-Code 会话实现分析](../../Roo-Code会话实现分析.md)
- [Anthropic Tool Use Documentation](https://docs.anthropic.com/claude/docs/tool-use)

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

---

**开发者**: AI Assistant  
**最后更新**: 2025-01-XX  
**版本**: 1.0.0  
**基于**: Roo-Code 实现原理

