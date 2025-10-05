# AI 工具调用系统实现文档

## 📋 项目概述

基于 **Roo-Code** 的实现原理，成功实现了完整的 AI 工具调用系统，支持通过 AI 执行 SSH 命令、文件操作等功能。

## ✅ 完整功能已实现

### 1. 系统架构
- ✅ 三层架构（UI → Tools → SSH Service）
- ✅ 工具定义和注册系统
- ✅ 工具执行器
- ✅ SSH 命令服务

### 2. AI 集成
- ✅ 系统提示词生成
- ✅ 工具描述和格式说明
- ✅ XML 格式的工具调用
- ✅ 流式响应支持

### 3. 用户交互
- ✅ 工具批准对话框
- ✅ 实时进度显示
- ✅ 命令执行反馈
- ✅ 结果展示和分析

### 4. SSH 执行
- ✅ 命令执行
- ✅ 输出捕获
- ✅ 错误处理
- ✅ 超时保护

## 📁 文件结构

```
apps/desktop/src/
├── types/
│   └── tools.ts                          # 工具系统类型定义
├── services/
│   ├── tools/
│   │   ├── system-prompt.ts              # 系统提示词生成器
│   │   └── tool-executor.ts              # 工具执行器
│   └── ssh/
│       └── ssh-command.service.ts        # SSH 命令服务
├── components/
│   └── chat/
│       ├── AIChatSessionWithTools.vue    # 工具聊天组件
│       └── ToolApprovalDialog.vue        # 工具批准对话框
└── views/
    └── TerminalView.vue                  # 终端视图（集成 AI 助手）
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
┌──────────────┐
│  工具解析器  │ → parseToolUse()
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  用户批准    │ → ToolApprovalDialog
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  工具执行    │ → executeTool()
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  SSH 服务    │ → executeSSHCommand()
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  Electron    │ → IPC
│  主进程      │ → sshManager.execute()
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  SSH 服务器  │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  返回结果    │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│  AI 分析     │
└──────────────┘
```

### 2. 三层架构

#### UI 层 (AIChatSessionWithTools.vue)
- 用户界面
- 消息展示
- 工具调用触发
- 批准对话框

#### Tools 层 (tool-executor.ts)
- 工具定义
- 工具解析
- 工具执行调度
- 结果处理

#### Service 层 (ssh-command.service.ts)
- IPC 通信
- SSH 命令封装
- 错误处理
- 结果格式化

## 🔧 核心实现

### 1. 类型定义 (tools.ts)

```typescript
export interface ToolUseParams {
  [key: string]: string | boolean | number
}

export interface ToolResult {
  success: boolean
  content: string
  error?: string
}

export type ToolName = 
  | 'execute_ssh_command'
  | 'read_file'
  | 'list_files'
  | 'ask_followup_question'
  | 'attempt_completion'
```

### 2. 系统提示词生成 (system-prompt.ts)

```typescript
export function generateSystemPrompt(options: {
  enableSSH?: boolean
  enableFileOps?: boolean
  serverInfo?: { host: string; username: string }
}): string {
  // 生成包含工具定义的系统提示词
  // 包括：角色定义、工具使用说明、工具描述、使用规则等
}
```

### 3. 工具执行器 (tool-executor.ts)

```typescript
// 解析工具调用
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

// SSH 命令工具
export async function executeSSHCommandTool(
  params: ToolUseParams,
  connectionId: string,
  onProgress?: (progress: string) => void
): Promise<ToolResult>
```

### 4. SSH 命令服务 (ssh-command.service.ts)

```typescript
export async function executeSSHCommand(
  connectionId: string,
  command: string
): Promise<SSHCommandResult> {
  // 1. 检查 Electron API
  // 2. 调用 IPC
  // 3. 处理结果
  // 4. 返回格式化结果
}
```

### 5. Electron 主进程 (ssh-handlers.ts)

```typescript
class SSHManager {
  async execute(
    id: string,
    command: string
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    // 1. 获取 SSH 连接
    // 2. 发送命令（添加换行符）
    // 3. 监听输出
    // 4. 检测完成（提示符）
    // 5. 清理并返回结果
  }
}
```

## 🎯 支持的工具

### 1. execute_ssh_command
执行 SSH 命令

```xml
<execute_ssh_command>
<command>ls -la</command>
</execute_ssh_command>
```

### 2. read_file
读取远程文件

```xml
<read_file>
<path>/etc/hosts</path>
</read_file>
```

### 3. list_files
列出目录内容

```xml
<list_files>
<path>/var/log</path>
<show_hidden>true</show_hidden>
</list_files>
```

### 4. ask_followup_question
询问用户

```xml
<ask_followup_question>
<question>需要我继续吗？</question>
</ask_followup_question>
```

### 5. attempt_completion
完成任务

```xml
<attempt_completion>
<result>任务已完成</result>
</attempt_completion>
```

## 🔧 关键修复记录

### 问题 1：F12 快捷键冲突
**问题**：两个 F12 处理器冲突，导致 DevTools 无法打开
**解决**：禁用 `before-input-event` 中的 F12 处理，只保留 `globalShortcut`

### 问题 2：消息流架构问题
**问题**：父组件自己处理消息，使用简单提示词，没有工具调用功能
**解决**：让 `AIChatSessionWithTools` 完全自主管理消息和工具调用

### 问题 3：SSH execute 返回 undefined
**问题**：`execute` 方法返回 `Promise<void>`，没有返回结果
**解决**：重写 `execute` 方法，添加：
- 换行符执行命令
- 输出捕获
- 提示符检测
- 结果清理
- 完整的返回对象

### 问题 4：重复显示命令输出
**问题**：终端显示两次命令输出
**解决**：移除 `handleToolExecuted` 中的重复显示逻辑

## 📊 测试结果

### 测试用例 1：执行 pwd
```
用户输入: "执行 pwd 命令"
AI 响应: ✅ 生成工具调用
执行结果: ✅ 返回 "/"
AI 分析: ✅ 说明当前在根目录
```

### 测试用例 2：执行 ls
```
用户输入: "执行ls 命令"
AI 响应: ✅ 生成工具调用
执行结果: ✅ 返回完整目录列表
AI 分析: ✅ 详细分析目录内容
```

## 💡 使用建议

### 1. 模型选择

**推荐模型**：
- OpenAI GPT-4 / GPT-4 Turbo ⭐⭐⭐⭐⭐
- Anthropic Claude 3.5 Sonnet ⭐⭐⭐⭐⭐
- Google Gemini Pro ⭐⭐⭐⭐

**部分支持**：
- z-ai/glm-4.6（需要对话上下文）

### 2. 安全建议

1. **始终审查命令** - 在批准前仔细检查命令
2. **避免危险操作** - 慎用 `rm -rf`, `dd` 等命令
3. **备份重要数据** - 执行修改操作前备份
4. **使用只读命令** - 优先使用查看类命令

### 3. 最佳实践

1. **明确指令** - 清楚地说明你想做什么
2. **分步执行** - 复杂任务分解为多个步骤
3. **验证结果** - 检查每步执行结果
4. **保存记录** - 记录重要操作

## 🚀 扩展开发

### 添加新工具

1. **定义工具类型**
```typescript
// types/tools.ts
export type ToolName = 
  | 'existing_tools...'
  | 'your_new_tool'
```

2. **实现工具函数**
```typescript
// services/tools/tool-executor.ts
export async function yourNewTool(
  params: ToolUseParams,
  connectionId: string
): Promise<ToolResult> {
  // 实现逻辑
}
```

3. **注册工具**
```typescript
// tool-executor.ts executeTool()
case 'your_new_tool':
  return await yourNewTool(params, connectionId)
```

4. **更新系统提示词**
```typescript
// services/tools/system-prompt.ts
function generateToolDescriptions() {
  // 添加新工具描述
}
```

## 📚 相关文档

- [Roo-Code 会话实现分析](./roo-code-session-analysis.md)
- [AI 工具使用指南](../guides/ai-tools-usage.md)
- [终端 AI 助手指南](../guides/terminal-ai-assistant.md)

## 🎯 技术亮点

1. **模块化设计** - 清晰的层次结构，易于维护
2. **类型安全** - 完整的 TypeScript 类型定义
3. **错误处理** - 完善的异常捕获和错误提示
4. **用户友好** - 直观的交互和清晰的反馈
5. **安全可靠** - 批准机制和危险命令检测
6. **可扩展** - 易于添加新工具

## 🎊 总结

成功实现了一个完整的 AI 工具调用系统：

- ✅ 架构清晰，易于理解和维护
- ✅ 功能完善，覆盖核心使用场景
- ✅ 用户友好，交互流畅自然
- ✅ 安全可靠，批准机制保护用户
- ✅ 可扩展，易于添加新功能

这是一个生产级别的实现，可以作为类似功能的参考范例！🌟

