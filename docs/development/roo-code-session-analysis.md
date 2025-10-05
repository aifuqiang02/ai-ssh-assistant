# Roo-Code 会话实现分析

## 目录
1. [概述](#概述)
2. [核心架构](#核心架构)
3. [会话管理机制](#会话管理机制)
4. [消息持久化](#消息持久化)
5. [任务生命周期](#任务生命周期)
6. [消息流转](#消息流转)
7. [提示词系统](#提示词系统)
8. [工具调用机制](#工具调用机制)
9. [关键特性](#关键特性)
10. [技术亮点](#技术亮点)

---

## 概述

Roo-Code 是一个基于 VS Code 扩展的 AI 编程助手，它实现了一套完整的会话（Session）管理系统。在 Roo-Code 中，会话被称为 **Task（任务）**，每个任务代表一次完整的用户交互过程。

### 主要特点
- 基于 VSCode Webview 的用户界面
- 支持多任务并发管理
- 完整的消息持久化机制
- 支持任务历史回溯和恢复
- 多模态输入（文本 + 图片）
- 实时流式响应
- 支持 Checkpoint（检查点）功能

---

## 核心架构

### 1. 三层架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    Webview UI Layer                          │
│              (Vue.js + TypeScript)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ WebviewMessage
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                 Provider Layer                               │
│              ClineProvider 类                                 │
│  - 管理 Task 实例                                             │
│  - 处理 Webview 消息                                          │
│  - 协调状态同步                                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ Task Management
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Task Layer                                │
│                  Task 类                                     │
│  - 执行具体任务逻辑                                           │
│  - 管理对话历史                                               │
│  - 调用 AI API                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2. 核心类说明

#### ClineProvider
- **位置**: `src/core/webview/ClineProvider.ts`
- **职责**:
  - 实现 `vscode.WebviewViewProvider` 接口
  - 管理 Task 栈（`clineStack: Task[]`）
  - 处理来自 Webview 的消息
  - 维护全局状态和配置
  - 协调多个任务实例

```typescript
export class ClineProvider extends EventEmitter<TaskProviderEvents> 
  implements vscode.WebviewViewProvider, TaskProviderLike {
  
  private clineStack: Task[] = []  // 任务栈
  private view?: vscode.WebviewView | vscode.WebviewPanel
  private mcpHub?: McpHub
  private marketplaceManager: MarketplaceManager
  
  // 核心方法
  public async resolveWebviewView(webviewView: vscode.WebviewView) {...}
  private async postStateToWebview() {...}
  private setWebviewMessageListener(webview: vscode.Webview) {...}
}
```

#### Task
- **位置**: `src/core/task/Task.ts`
- **职责**:
  - 管理单个任务的完整生命周期
  - 维护双重消息历史（API 和 UI）
  - 执行工具调用（文件操作、命令执行等）
  - 处理 AI 响应流
  - 实现自动批准机制

```typescript
export class Task extends EventEmitter<TaskEvents> {
  readonly taskId: string           // 任务唯一标识
  readonly rootTaskId?: string      // 根任务 ID（支持子任务）
  readonly parentTaskId?: string    // 父任务 ID
  
  // 双重消息历史
  apiConversationHistory: ApiMessage[] = []  // 发送给 API 的消息
  clineMessages: ClineMessage[] = []         // 显示在 UI 的消息
  
  // 任务状态
  abort: boolean = false
  isPaused: boolean = false
  isInitialized = false
  
  // 核心方法
  async startTask(task?: string, images?: string[]) {...}
  async resumeTask() {...}
  async say(type: ClineSay, text?: string, images?: string[]) {...}
  async executeRecursive() {...}
}
```

---

## 会话管理机制

### 1. 任务创建流程

```
用户输入
   ↓
WebviewMessage (type: "newTask")
   ↓
ClineProvider.handleWebviewMessage()
   ↓
创建新 Task 实例
   ↓
Task.startTask()
   ↓
初始化消息历史
   ↓
开始执行任务
```

**代码示例**（ClineProvider 中的任务创建）:

```typescript
// 在 webviewMessageHandler.ts 中
case "newTask":
  await this.initClineWithTask(text, images, mode)
  
// initClineWithTask 方法
private async initClineWithTask(
  task?: string, 
  images?: string[], 
  mode?: Mode
) {
  const cline = new Task({
    provider: this,
    apiConfiguration: this.getApiConfiguration(),
    task,
    images,
    startTask: true,
    taskNumber: this.getNextTaskNumber(),
  })
  
  this.clineStack.push(cline)
  await cline.startTask(task, images)
}
```

### 2. 任务栈管理

Roo-Code 使用 **栈结构** 管理多个任务:

```typescript
private clineStack: Task[] = []

// 当前活动任务
get currentTask(): Task | undefined {
  return this.clineStack[this.clineStack.length - 1]
}

// 添加新任务
pushTask(task: Task) {
  this.clineStack.push(task)
}

// 移除任务
popTask() {
  return this.clineStack.pop()
}
```

### 3. 任务恢复机制

支持从历史中恢复任务：

```typescript
async showTaskWithId(taskId: string) {
  const historyItem = await this.getTaskFromHistory(taskId)
  
  const cline = new Task({
    provider: this,
    historyItem: historyItem,  // 从历史恢复
    startTask: false,
  })
  
  // 加载保存的消息
  await cline.resumeTask()
}
```

---

## 消息持久化

### 1. 存储结构

每个任务的数据存储在独立目录中：

```
<globalStoragePath>/
  └── tasks/
      └── <taskId>/
          ├── api_conversation_history.json  # API 消息历史
          ├── ui_messages.json               # UI 显示消息
          └── task_metadata.json             # 任务元数据
```

**全局文件名定义**（`src/shared/globalFileNames.ts`）：

```typescript
export const GlobalFileNames = {
  apiConversationHistory: "api_conversation_history.json",
  uiMessages: "ui_messages.json",
  mcpSettings: "mcp_settings.json",
  customModes: "custom_modes.yaml",
  taskMetadata: "task_metadata.json",
}
```

### 2. 双重消息历史

Roo-Code 维护两套消息历史：

#### API 消息历史 (`apiConversationHistory`)
- 用于发送给 AI 模型
- 格式符合 Anthropic API 规范
- 包含系统提示词和工具定义

**类型定义**（`src/core/task-persistence/apiMessages.ts`）：

```typescript
export type ApiMessage = Anthropic.MessageParam & { 
  ts?: number           // 时间戳
  isSummary?: boolean   // 是否为摘要消息
}

// 读取 API 消息
export async function readApiMessages({
  taskId,
  globalStoragePath,
}: {
  taskId: string
  globalStoragePath: string
}): Promise<ApiMessage[]> {
  const taskDir = await getTaskDirectoryPath(globalStoragePath, taskId)
  const filePath = path.join(taskDir, GlobalFileNames.apiConversationHistory)
  
  if (await fileExistsAtPath(filePath)) {
    return JSON.parse(await fs.readFile(filePath, "utf8"))
  }
  return []
}

// 保存 API 消息
export async function saveApiMessages({
  messages,
  taskId,
  globalStoragePath,
}: {
  messages: ApiMessage[]
  taskId: string
  globalStoragePath: string
}) {
  const taskDir = await getTaskDirectoryPath(globalStoragePath, taskId)
  const filePath = path.join(taskDir, GlobalFileNames.apiConversationHistory)
  await safeWriteJson(filePath, messages)
}
```

#### UI 消息历史 (`clineMessages`)
- 用于在 Webview 中显示
- 包含用户可见的所有交互信息
- 支持丰富的消息类型

**类型定义**（`@roo-code/types`）：

```typescript
export interface ClineMessage {
  ts: number                    // 时间戳
  type: "ask" | "say"           // 消息类型
  ask?: ClineAsk                // 询问类型
  say?: ClineSay                // 陈述类型
  text?: string                 // 消息内容
  images?: string[]             // 图片（base64）
  partial?: boolean             // 是否为部分消息
  isAnswered?: boolean          // 是否已回答
  metadata?: Record<string, any> // 元数据
}
```

**保存 UI 消息**（`src/core/task-persistence/taskMessages.ts`）：

```typescript
export async function saveTaskMessages({
  messages,
  taskId,
  globalStoragePath,
}: SaveTaskMessagesOptions) {
  const taskDir = await getTaskDirectoryPath(globalStoragePath, taskId)
  const filePath = path.join(taskDir, GlobalFileNames.uiMessages)
  await safeWriteJson(filePath, messages)
}
```

### 3. 任务元数据

**元数据结构**（`src/core/task-persistence/taskMetadata.ts`）：

```typescript
export interface HistoryItem {
  id: string                  // 任务 ID
  rootTaskId?: string         // 根任务 ID
  parentTaskId?: string       // 父任务 ID
  number: number              // 任务编号
  ts: number                  // 时间戳
  task: string                // 任务描述
  tokensIn: number            // 输入 token 数
  tokensOut: number           // 输出 token 数
  cacheWrites: number         // 缓存写入
  cacheReads: number          // 缓存读取
  totalCost: number           // 总成本
  size: number                // 任务目录大小
  workspace: string           // 工作空间路径
  mode?: string               // 任务模式
}

export async function taskMetadata({
  taskId,
  rootTaskId,
  parentTaskId,
  taskNumber,
  messages,
  globalStoragePath,
  workspace,
  mode,
}: TaskMetadataOptions) {
  // 计算 token 使用情况
  const tokenUsage = getApiMetrics(
    combineApiRequests(combineCommandSequences(messages.slice(1)))
  )
  
  // 计算任务目录大小
  const taskDir = await getTaskDirectoryPath(globalStoragePath, taskId)
  const taskDirSize = await getFolderSize.loose(taskDir)
  
  const historyItem: HistoryItem = {
    id: taskId,
    number: taskNumber,
    ts: lastRelevantMessage.ts,
    task: messages[0]?.text || `Task #${taskNumber}`,
    tokensIn: tokenUsage.totalTokensIn,
    tokensOut: tokenUsage.totalTokensOut,
    totalCost: tokenUsage.totalCost,
    size: taskDirSize,
    workspace,
    mode,
  }
  
  return { historyItem, tokenUsage }
}
```

---

## 任务生命周期

### 1. 完整生命周期

```
┌─────────────┐
│   创建任务   │
│  (Created)  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   初始化    │
│(Initialize) │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   执行中    │
│ (Running)   │
└──────┬──────┘
       │
       ├─────→ 需要用户输入 (Waiting)
       │           │
       │           ↓
       │       用户响应
       │           │
       ├───────────┘
       │
       ↓
┌─────────────┐
│   完成      │
│ (Completed) │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   保存      │
│  (Saved)    │
└─────────────┘
```

### 2. 任务初始化

**startTask 方法**（Task.ts 中）：

```typescript
private async startTask(task?: string, images?: string[]): Promise<void> {
  // 1. 清空消息历史
  this.clineMessages = []
  this.apiConversationHistory = []
  
  // 2. 同步状态到 Webview
  await this.providerRef.deref()?.postStateToWebview()
  
  // 3. 添加初始用户消息
  await this.say("text", task, images)
  
  // 4. 标记为已初始化
  this.isInitialized = true
  
  // 5. 准备图片块
  let imageBlocks = formatResponse.imageBlocks(images)
  
  // 6. 开始执行任务
  await this.executeRecursive()
}
```

### 3. 任务恢复

**resumeTask 方法**：

```typescript
async resumeTask() {
  // 1. 加载保存的消息
  this.clineMessages = await this.getSavedClineMessages()
  this.apiConversationHistory = await this.getSavedApiConversationHistory()
  
  // 2. 同步状态到 Webview
  await this.providerRef.deref()?.postStateToWebview()
  
  // 3. 检查最后一条消息
  const lastMessage = this.clineMessages.at(-1)
  
  // 4. 根据状态决定下一步
  if (lastMessage?.ask === "resume_task") {
    await this.executeRecursive()
  } else if (lastMessage?.say === "completion_result") {
    // 任务已完成
    this.isInitialized = true
  }
}
```

### 4. 任务执行循环

**executeRecursive 方法**（核心执行逻辑）：

```typescript
private async executeRecursive() {
  while (!this.abort) {
    try {
      // 1. 准备 API 请求
      const systemPrompt = await this.generateSystemPrompt()
      
      // 2. 调用 AI API
      const response = await this.api.createMessage(
        systemPrompt,
        this.apiConversationHistory
      )
      
      // 3. 处理流式响应
      for await (const chunk of response) {
        if (chunk.type === "text") {
          await this.say("api_response", chunk.text, undefined, true)
        } else if (chunk.type === "tool_use") {
          await this.handleToolUse(chunk)
        }
      }
      
      // 4. 检查是否需要继续
      if (needsUserInput) {
        break  // 等待用户输入
      }
      
      // 5. 保存状态
      await this.saveMessages()
      
    } catch (error) {
      await this.handleError(error)
      break
    }
  }
}
```

### 5. 任务暂停和恢复

```typescript
// 暂停任务
async pauseTask() {
  this.isPaused = true
  this.abort = true  // 停止当前执行
  await this.saveMessages()
}

// 恢复任务
async unpauseTask() {
  this.isPaused = false
  this.abort = false
  await this.executeRecursive()
}
```

---

## 消息流转

### 1. 消息添加流程

**say 方法**（Task 类中的核心方法）：

```typescript
async say(
  type: ClineSay,
  text?: string,
  images?: string[],
  partial?: boolean,
  checkpoint?: Record<string, unknown>,
  progressStatus?: ToolProgressStatus,
  options: {
    isNonInteractive?: boolean
    metadata?: Record<string, unknown>
  } = {},
  contextCondense?: ContextCondense,
): Promise<undefined> {
  // 1. 检查是否中止
  if (this.abort) {
    throw new Error(`Task ${this.taskId} aborted`)
  }
  
  // 2. 处理部分更新（流式输出）
  if (partial !== undefined) {
    const lastMessage = this.clineMessages.at(-1)
    
    if (lastMessage && lastMessage.type === "say" && lastMessage.say === type) {
      // 更新现有消息
      lastMessage.text = text
      lastMessage.partial = partial
      await this.providerRef.deref()?.postStateToWebview()
      return
    }
  }
  
  // 3. 创建新消息
  const message: ClineMessage = {
    ts: Date.now(),
    type: "say",
    say: type,
    text,
    images,
    partial,
    metadata: options.metadata,
  }
  
  // 4. 添加到消息历史
  this.addToClideMessages(message)
  
  // 5. 同步到 Webview
  await this.providerRef.deref()?.postStateToWebview()
  
  // 6. 保存到磁盘
  if (!partial) {
    await this.saveMessages()
  }
}
```

### 2. API 消息管理

**添加 API 消息**：

```typescript
private addToApiConversationHistory(message: ApiMessage) {
  const messageWithTs: ApiMessage = {
    ...message,
    ts: Date.now(),
  }
  
  this.apiConversationHistory.push(messageWithTs)
  
  // 保存到磁盘
  await saveApiMessages({
    messages: this.apiConversationHistory,
    taskId: this.taskId,
    globalStoragePath: this.globalStoragePath,
  })
}
```

### 3. 消息类型

**ClineSay（陈述类型）**：

```typescript
export type ClineSay =
  | "text"                    // 普通文本
  | "api_req_started"         // API 请求开始
  | "api_response"            // API 响应
  | "tool"                    // 工具调用
  | "error"                   // 错误信息
  | "completion_result"       // 任务完成
  | "shell_integration_warning" // Shell 集成警告
  // ... 更多类型
```

**ClineAsk（询问类型）**：

```typescript
export type ClineAsk =
  | "followup"                // 追问
  | "command"                 // 命令执行确认
  | "command_output"          // 命令输出确认
  | "completion_result"       // 完成确认
  | "tool"                    // 工具使用确认
  | "api_req_failed"          // API 请求失败
  | "resume_task"             // 恢复任务
  | "resume_completed_task"   // 恢复已完成任务
  // ... 更多类型
```

### 4. 用户响应处理

**askResponse 消息处理**：

```typescript
case "askResponse":
  const { messageTs, response, text, images } = message
  
  // 查找对应的询问消息
  const askMessage = this.currentTask?.findMessage(messageTs)
  
  if (askMessage) {
    // 标记为已回答
    askMessage.isAnswered = true
    
    // 根据响应类型处理
    switch (response) {
      case "yesButtonClicked":
        // 继续执行
        await this.currentTask.continueExecution()
        break
        
      case "noButtonClicked":
        // 取消操作
        await this.currentTask.cancelCurrentOperation()
        break
        
      case "messageResponse":
        // 添加用户回复
        await this.currentTask.say("text", text, images)
        await this.currentTask.executeRecursive()
        break
    }
  }
```

---

## 提示词系统

Roo-Code 实现了一套复杂而灵活的提示词生成系统，能够根据不同的模式、配置和上下文动态生成系统提示词。

### 1. 提示词架构

提示词采用模块化设计，由多个独立的部分组成：

```
System Prompt
├── Role Definition          (角色定义)
├── Markdown Formatting      (Markdown 格式说明)
├── Shared Tool Use          (工具使用通用说明)
├── Tool Descriptions        (工具描述列表)
├── Tool Use Guidelines      (工具使用指南)
├── MCP Servers              (MCP 服务器信息)
├── Capabilities             (能力说明)
├── Modes                    (模式说明)
├── Rules                    (使用规则)
├── System Info              (系统信息)
├── Objective                (目标说明)
└── Custom Instructions      (自定义指令)
```

### 2. 提示词生成流程

**核心生成函数**（`src/core/prompts/system.ts`）：

```typescript
export const SYSTEM_PROMPT = async (
  context: vscode.ExtensionContext,
  cwd: string,
  supportsComputerUse: boolean,
  mcpHub?: McpHub,
  diffStrategy?: DiffStrategy,
  browserViewportSize?: string,
  mode: Mode = defaultModeSlug,
  customModePrompts?: CustomModePrompts,
  customModes?: ModeConfig[],
  globalCustomInstructions?: string,
  diffEnabled?: boolean,
  experiments?: Record<string, boolean>,
  enableMcpServerCreation?: boolean,
  language?: string,
  rooIgnoreInstructions?: string,
  partialReadsEnabled?: boolean,
  settings?: SystemPromptSettings,
  todoList?: TodoItem[],
  modelId?: string,
): Promise<string> => {
  // 1. 检查是否有文件自定义提示词
  const fileCustomSystemPrompt = await loadSystemPromptFile(cwd, mode, variables)
  
  if (fileCustomSystemPrompt) {
    // 使用文件自定义提示词
    return `${roleDefinition}\n\n${fileCustomSystemPrompt}\n\n${customInstructions}`
  }
  
  // 2. 生成标准提示词
  return generatePrompt(
    context,
    cwd,
    supportsComputerUse,
    mode,
    mcpHub,
    diffStrategy,
    // ... 其他参数
  )
}
```

**标准提示词组装**：

```typescript
async function generatePrompt(...) {
  // 获取模式配置
  const modeConfig = getModeBySlug(mode, customModeConfigs)
  const { roleDefinition, baseInstructions } = getModeSelection(mode, promptComponent, customModeConfigs)
  
  // 并行获取各个部分
  const [modesSection, mcpServersSection] = await Promise.all([
    getModesSection(context),
    shouldIncludeMcp
      ? getMcpServersSection(mcpHub, diffStrategy, enableMcpServerCreation)
      : Promise.resolve(""),
  ])
  
  // 组装完整提示词
  const basePrompt = `${roleDefinition}

${markdownFormattingSection()}

${getSharedToolUseSection()}

${getToolDescriptionsForMode(
  mode,
  cwd,
  supportsComputerUse,
  codeIndexManager,
  // ...
)}

${getToolUseGuidelinesSection(codeIndexManager)}

${mcpServersSection}

${getCapabilitiesSection(cwd, supportsComputerUse, mcpHub, diffStrategy, codeIndexManager)}

${modesSection}

${getRulesSection(cwd, supportsComputerUse, diffStrategy, codeIndexManager)}

${getSystemInfoSection(cwd)}

${getObjectiveSection(codeIndexManager, experiments)}

${await addCustomInstructions(baseInstructions, globalCustomInstructions, cwd, mode, settings)}`
  
  return basePrompt
}
```

### 3. 提示词各部分详解

#### 3.1 Role Definition（角色定义）

根据不同模式定义 AI 的角色：

```typescript
// Code 模式
roleDefinition: "You are Roo Code, a highly skilled software engineer..."

// Architect 模式
roleDefinition: "You are a software architect who specializes in system design..."

// Ask 模式
roleDefinition: "You are a knowledgeable AI assistant..."

// Debug 模式
roleDefinition: "You are a debugging specialist..."
```

#### 3.2 Shared Tool Use（工具使用说明）

提供工具调用的通用格式说明：

```typescript
export function getSharedToolUseSection(): string {
  return `====

TOOL USE

You have access to a set of tools that are executed upon the user's approval. You must use exactly one tool per message, and every assistant message must include a tool call. You use tools step-by-step to accomplish a given task, with each tool use informed by the result of the previous tool use.

# Tool Use Formatting

Tool uses are formatted using XML-style tags. The tool name itself becomes the XML tag name. Each parameter is enclosed within its own set of tags. Here's the structure:

<actual_tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</actual_tool_name>

Always use the actual tool name as the XML tag name for proper parsing and execution.`
}
```

#### 3.3 Tool Descriptions（工具描述）

根据模式动态生成可用工具列表：

```typescript
export function getToolDescriptionsForMode(
  mode: Mode,
  cwd: string,
  supportsComputerUse: boolean,
  codeIndexManager?: CodeIndexManager,
  // ...
): string {
  const config = getModeConfig(mode, customModes)
  const tools = new Set<string>()
  
  // 根据模式的 groups 添加工具
  config.groups.forEach((groupEntry) => {
    const groupName = getGroupName(groupEntry)
    const toolGroup = TOOL_GROUPS[groupName]
    if (toolGroup) {
      toolGroup.tools.forEach((tool) => {
        if (isToolAllowedForMode(tool, mode, customModes, undefined, undefined, experiments)) {
          tools.add(tool)
        }
      })
    }
  })
  
  // 添加始终可用的工具
  ALWAYS_AVAILABLE_TOOLS.forEach((tool) => tools.add(tool))
  
  // 条件性排除某些工具
  if (!codeIndexManager?.isFeatureEnabled) {
    tools.delete("codebase_search")
  }
  
  // 生成工具描述
  const descriptions = Array.from(tools).map((toolName) => {
    const descriptionFn = toolDescriptionMap[toolName]
    return descriptionFn?.(args)
  })
  
  return `# Tools\n\n${descriptions.filter(Boolean).join("\n\n")}`
}
```

**工具描述示例** - `read_file` 工具：

```typescript
export function getReadFileDescription(args: ToolArgs): string {
  const maxConcurrentReads = args.settings?.maxConcurrentFileReads ?? 5
  const isMultipleReadsEnabled = maxConcurrentReads > 1
  
  return `## read_file
Description: Request to read the contents of ${isMultipleReadsEnabled ? "one or more files" : "a file"}. The tool outputs line-numbered content (e.g. "1 | const x = 1") for easy reference when creating diffs or discussing code.${args.partialReadsEnabled ? " Use line ranges to efficiently read specific portions of large files." : ""} Supports text extraction from PDF and DOCX files, but may not handle other binary files properly.

**IMPORTANT: You can read a maximum of ${maxConcurrentReads} files in a single request.**

Parameters:
- args: Contains one or more file elements, where each file contains:
  - path: (required) File path (relative to workspace directory ${args.cwd})
  ${args.partialReadsEnabled ? `- line_range: (optional) One or more line range elements in format "start-end" (1-based, inclusive)` : ""}

Usage:
<read_file>
<args>
  <file>
    <path>path/to/file</path>
    ${args.partialReadsEnabled ? `<line_range>start-end</line_range>` : ""}
  </file>
</args>
</read_file>

IMPORTANT: You MUST use this Efficient Reading Strategy:
- You MUST read all related files and implementations together in a single operation (up to ${maxConcurrentReads} files at once)
- You MUST obtain all necessary context before proceeding with changes
${args.partialReadsEnabled ? `- You MUST use line ranges to read specific portions of large files, rather than reading entire files when not needed` : ""}`
}
```

#### 3.4 Rules（使用规则）

定义 AI 行为的严格规则：

```typescript
export function getRulesSection(
  cwd: string,
  supportsComputerUse: boolean,
  diffStrategy?: DiffStrategy,
  codeIndexManager?: CodeIndexManager,
): string {
  return `====

RULES

- The project base directory is: ${cwd.toPosix()}
- All file paths must be relative to this directory.
- Before using the execute_command tool, you must first think about the SYSTEM INFORMATION context...
${codebaseSearchRule}
- When using the search_files tool, craft your regex patterns carefully...
- When creating a new project, organize all new files within a dedicated project directory...
${getEditingInstructions(diffStrategy)}
- Some modes have restrictions on which files they can edit...
- Do not ask for more information than necessary...
- You are only allowed to ask the user questions using the ask_followup_question tool...
- When executing commands, if you don't see the expected output, assume the terminal executed successfully...
- Your goal is to try to accomplish the user's task, NOT engage in a back and forth conversation.
- NEVER end attempt_completion result with a question!
- You are STRICTLY FORBIDDEN from starting your messages with "Great", "Certainly", "Okay", "Sure"...
- When presented with images, utilize your vision capabilities...
- It is critical you wait for the user's response after each tool use...`
}
```

**编辑指令部分**：

```typescript
function getEditingInstructions(diffStrategy?: DiffStrategy): string {
  const instructions: string[] = []
  const availableTools: string[] = []
  
  // 收集可用的编辑工具
  if (diffStrategy) {
    availableTools.push(
      "apply_diff (for surgical edits - targeted changes to specific lines or functions)",
      "write_to_file (for creating new files or complete file rewrites)",
    )
  } else {
    availableTools.push("write_to_file (for creating new files or complete file rewrites)")
  }
  
  availableTools.push("insert_content (for adding lines to files)")
  availableTools.push("search_and_replace (for finding and replacing individual pieces of text)")
  
  instructions.push(`- For editing files, you have access to these tools: ${availableTools.join(", ")}.`)
  
  instructions.push(
    "- When using the write_to_file tool to modify a file, ALWAYS provide the COMPLETE file content. This is NON-NEGOTIABLE. Partial updates or placeholders like '// rest of code unchanged' are STRICTLY FORBIDDEN."
  )
  
  return instructions.join("\n")
}
```

#### 3.5 Capabilities（能力说明）

描述 AI 的具体能力：

```typescript
export function getCapabilitiesSection(
  cwd: string,
  supportsComputerUse: boolean,
  mcpHub?: McpHub,
  diffStrategy?: DiffStrategy,
  codeIndexManager?: CodeIndexManager,
): string {
  return `====

CAPABILITIES

- You have access to tools that let you execute CLI commands, list files, view source code definitions, regex search${
  supportsComputerUse ? ", use the browser" : ""
}, read and write files, and ask follow-up questions.
- When the user initially gives you a task, a recursive list of all filepaths in the current workspace directory ('${cwd}') will be included in environment_details.
${
  codeIndexManager?.isFeatureEnabled
    ? `- You can use the \`codebase_search\` tool to perform semantic searches across your entire codebase. This tool is powerful for finding functionally relevant code, even if you don't know the exact keywords.`
    : ""
}
- You can use search_files to perform regex searches across files in a specified directory.
- You can use the list_code_definition_names tool to get an overview of source code definitions.
- You can use the execute_command tool to run commands on the user's computer.
${
  supportsComputerUse
    ? "- You can use the browser_action tool to interact with websites through a Puppeteer-controlled browser."
    : ""
}
${
  mcpHub
    ? `- You have access to MCP servers that may provide additional tools and resources.`
    : ""
}`
}
```

#### 3.6 Custom Instructions（自定义指令）

支持三种类型的自定义指令：

1. **全局自定义指令**：适用于所有模式
2. **模式自定义指令**：特定模式的指令
3. **文件自定义指令**：通过 `.roo-code/` 目录中的文件定义

```typescript
export async function addCustomInstructions(
  baseInstructions: string,
  globalCustomInstructions: string,
  cwd: string,
  mode: string,
  options?: {
    language?: string
    rooIgnoreInstructions?: string
    settings?: SystemPromptSettings
  },
): Promise<string> {
  const parts: string[] = []
  
  // 1. 全局自定义指令
  if (globalCustomInstructions.trim()) {
    parts.push(`====\n\nCUSTOM INSTRUCTIONS\n\n${globalCustomInstructions.trim()}`)
  }
  
  // 2. 模式特定指令
  if (baseInstructions.trim()) {
    parts.push(`====\n\nMODE INSTRUCTIONS\n\n${baseInstructions.trim()}`)
  }
  
  // 3. 语言偏好
  if (options?.language) {
    parts.push(`====\n\nPREFERRED LANGUAGE\n\nUser prefers responses in: ${options.language}`)
  }
  
  // 4. RooIgnore 指令
  if (options?.rooIgnoreInstructions) {
    parts.push(`====\n\n${options.rooIgnoreInstructions}`)
  }
  
  return parts.join("\n\n")
}
```

### 4. 模式系统与提示词

不同模式有不同的工具组合和指令：

```typescript
// Code 模式配置
{
  slug: "code",
  name: "Code",
  roleDefinition: "You are Roo Code, a highly skilled software engineer...",
  groups: ["core", "edit", "browser", "mcp", "subtasks", "experimental"],
  baseInstructions: "Focus on writing clean, maintainable code...",
}

// Architect 模式配置
{
  slug: "architect",
  name: "Architect",
  roleDefinition: "You are a software architect...",
  groups: ["core", "readonly"],  // 只读工具
  fileRestrictions: ["\\.md$"],   // 只能编辑 .md 文件
  baseInstructions: "Focus on high-level design...",
}

// Ask 模式配置
{
  slug: "ask",
  name: "Ask",
  roleDefinition: "You are a knowledgeable AI assistant...",
  groups: ["core", "readonly"],
  baseInstructions: "Provide clear, concise answers...",
}
```

### 5. 动态提示词注入

在任务执行过程中，还会动态添加环境信息：

```typescript
// 在 API 请求中添加环境详情
const environmentDetails = {
  workspace: cwd,
  workspaceFiles: await getWorkspaceFiles(cwd),
  activeTerminals: await getActiveTerminals(),
  openFiles: await getOpenFiles(),
  currentFile: await getCurrentFile(),
  problems: await getDiagnostics(),
  // ...
}

// 附加到用户消息
const userMessage = {
  role: "user",
  content: [
    { type: "text", text: userInput },
    {
      type: "text",
      text: `\n\n<environment_details>\n${JSON.stringify(environmentDetails, null, 2)}\n</environment_details>`
    }
  ]
}
```

---

## 工具调用机制

Roo-Code 实现了一套完整的工具调用系统，支持文件操作、命令执行、浏览器控制等多种功能。

### 1. 工具调用架构

```
┌────────────────────────────────────────────────────┐
│              AI Model Response                      │
│  <read_file>                                       │
│    <args>                                          │
│      <file><path>src/app.ts</path></file>         │
│    </args>                                         │
│  </read_file>                                      │
└───────────────────┬────────────────────────────────┘
                    │
                    ↓
┌───────────────────────────────────────────────────┐
│         Task.processToolUse()                      │
│  - 解析 XML 工具调用                               │
│  - 验证工具参数                                     │
│  - 检查权限                                        │
└───────────────────┬───────────────────────────────┘
                    │
                    ↓
┌───────────────────────────────────────────────────┐
│         具体工具实现                                │
│  readFileTool()                                   │
│  writeToFileTool()                                │
│  executeCommandTool()                             │
│  ...                                              │
└───────────────────┬───────────────────────────────┘
                    │
                    ↓
┌───────────────────────────────────────────────────┐
│         用户批准流程                                │
│  - 显示工具调用请求                                 │
│  - 等待用户确认                                     │
│  - 自动批准检查                                     │
└───────────────────┬───────────────────────────────┘
                    │
                    ↓
┌───────────────────────────────────────────────────┐
│         执行工具                                    │
│  - 执行实际操作                                     │
│  - 捕获错误                                        │
│  - 返回结果                                        │
└───────────────────┬───────────────────────────────┘
                    │
                    ↓
┌───────────────────────────────────────────────────┐
│         结果反馈                                    │
│  - 格式化结果                                       │
│  - 添加到对话历史                                   │
│  - 更新 UI 显示                                    │
└───────────────────────────────────────────────────┘
```

### 2. 工具定义与注册

**工具映射表**（`src/core/prompts/tools/index.ts`）：

```typescript
const toolDescriptionMap: Record<string, (args: ToolArgs) => string | undefined> = {
  execute_command: (args) => getExecuteCommandDescription(args),
  read_file: (args) => {
    const modelId = args.settings?.modelId
    if (modelId && shouldUseSingleFileRead(modelId)) {
      return getSimpleReadFileDescription(args)
    }
    return getReadFileDescription(args)
  },
  fetch_instructions: (args) => getFetchInstructionsDescription(args.settings?.enableMcpServerCreation),
  write_to_file: (args) => getWriteToFileDescription(args),
  search_files: (args) => getSearchFilesDescription(args),
  list_files: (args) => getListFilesDescription(args),
  list_code_definition_names: (args) => getListCodeDefinitionNamesDescription(args),
  browser_action: (args) => getBrowserActionDescription(args),
  ask_followup_question: () => getAskFollowupQuestionDescription(),
  attempt_completion: (args) => getAttemptCompletionDescription(args),
  use_mcp_tool: (args) => getUseMcpToolDescription(args),
  access_mcp_resource: (args) => getAccessMcpResourceDescription(args),
  codebase_search: (args) => getCodebaseSearchDescription(args),
  switch_mode: () => getSwitchModeDescription(),
  new_task: (args) => getNewTaskDescription(args),
  insert_content: (args) => getInsertContentDescription(args),
  search_and_replace: (args) => getSearchAndReplaceDescription(args),
  apply_diff: (args) => args.diffStrategy?.getToolDescription({ cwd: args.cwd }),
  update_todo_list: (args) => getUpdateTodoListDescription(args),
  run_slash_command: () => getRunSlashCommandDescription(),
  generate_image: (args) => getGenerateImageDescription(args),
}
```

**工具分组**：

```typescript
export const TOOL_GROUPS: Record<string, ToolGroup> = {
  core: {
    name: "Core",
    tools: [
      "read_file",
      "list_files",
      "list_code_definition_names",
      "search_files",
      "fetch_instructions",
    ],
  },
  edit: {
    name: "Edit",
    tools: [
      "write_to_file",
      "insert_content",
      "search_and_replace",
      "apply_diff",
    ],
  },
  browser: {
    name: "Browser",
    tools: ["browser_action"],
  },
  mcp: {
    name: "MCP",
    tools: ["use_mcp_tool", "access_mcp_resource"],
  },
  subtasks: {
    name: "Subtasks",
    tools: ["new_task"],
  },
  experimental: {
    name: "Experimental",
    tools: [
      "execute_command",
      "ask_followup_question",
      "attempt_completion",
      "switch_mode",
      "update_todo_list",
      "run_slash_command",
      "generate_image",
    ],
  },
}
```

### 3. 工具调用流程

**步骤 1: 解析工具调用**

从 AI 响应中提取工具调用：

```typescript
// 在 Task.ts 中
private parseAssistantMessage(content: string): ToolUse[] {
  const tools: ToolUse[] = []
  
  // 使用 XML 解析提取工具调用
  const toolMatches = content.matchAll(/<(\w+)>([\s\S]*?)<\/\1>/g)
  
  for (const match of toolMatches) {
    const [, toolName, toolContent] = match
    
    // 解析工具参数
    const params = this.parseToolParams(toolContent)
    
    tools.push({
      name: toolName,
      params,
      partial: false,
    })
  }
  
  return tools
}
```

**步骤 2: 验证工具**

```typescript
// 验证工具是否可用
private async validateToolUse(tool: ToolUse): Promise<boolean> {
  // 1. 检查工具是否存在
  if (!this.availableTools.includes(tool.name)) {
    await this.say("error", `Tool '${tool.name}' is not available`)
    return false
  }
  
  // 2. 检查模式限制
  if (!isToolAllowedForMode(tool.name, this.taskMode)) {
    await this.say("error", `Tool '${tool.name}' is not allowed in ${this.taskMode} mode`)
    return false
  }
  
  // 3. 检查必需参数
  const requiredParams = getRequiredParams(tool.name)
  for (const param of requiredParams) {
    if (!(param in tool.params)) {
      await this.say("error", `Missing required parameter '${param}' for tool '${tool.name}'`)
      return false
    }
  }
  
  return true
}
```

**步骤 3: 执行工具**

```typescript
private async executeToolUse(tool: ToolUse): Promise<void> {
  // 定义工具执行映射
  const toolExecutors: Record<string, ToolExecutor> = {
    read_file: readFileTool,
    write_to_file: writeToFileTool,
    execute_command: executeCommandTool,
    list_files: listFilesTool,
    search_files: searchFilesTool,
    browser_action: browserActionTool,
    // ... 更多工具
  }
  
  const executor = toolExecutors[tool.name]
  
  if (!executor) {
    throw new Error(`No executor found for tool: ${tool.name}`)
  }
  
  // 执行工具
  await executor(
    this,                           // Task 实例
    tool,                           // 工具调用信息
    this.askApproval.bind(this),    // 批准函数
    this.handleError.bind(this),    // 错误处理
    this.pushToolResult.bind(this), // 结果推送
    this.removeClosingTag.bind(this) // XML 清理
  )
}
```

### 4. 核心工具详解

#### 4.1 read_file 工具

**功能**：读取一个或多个文件的内容

**实现**（`src/core/tools/readFileTool.ts`）：

```typescript
export async function readFileTool(
  cline: Task,
  block: ToolUse,
  askApproval: AskApproval,
  handleError: HandleError,
  pushToolResult: PushToolResult,
  _removeClosingTag: RemoveClosingTag,
) {
  // 1. 解析参数
  const argsXmlTag: string | undefined = block.params.args
  const fileEntries: FileEntry[] = []
  
  if (argsXmlTag) {
    const parsed = parseXml(argsXmlTag)
    const files = Array.isArray(parsed.file) ? parsed.file : [parsed.file]
    
    for (const file of files) {
      fileEntries.push({
        path: file.path,
        lineRanges: parseLineRanges(file.line_range),
      })
    }
  }
  
  // 2. 验证访问权限
  for (const entry of fileEntries) {
    const accessAllowed = cline.rooIgnoreController?.validateAccess(entry.path)
    if (!accessAllowed) {
      await cline.say("rooignore_error", entry.path)
      return
    }
  }
  
  // 3. 批量请求批准（如果有多个文件）
  if (fileEntries.length > 1) {
    const { response, text, images } = await askApproval("tool", batchMessage)
    
    if (response === "yesButtonClicked") {
      // 批准所有文件
      fileEntries.forEach(entry => entry.approved = true)
    } else if (response === "objectResponse") {
      // 单独处理每个文件的批准
      const permissions = JSON.parse(text)
      fileEntries.forEach((entry, index) => {
        entry.approved = permissions[entry.path] === true
      })
    }
  }
  
  // 4. 读取文件内容
  const results: FileResult[] = []
  
  for (const entry of fileEntries) {
    if (!entry.approved) continue
    
    const fullPath = path.resolve(cline.cwd, entry.path)
    
    try {
      // 检查是否为二进制文件
      const isBinary = await isBinaryFile(fullPath)
      
      if (isBinary) {
        // 处理图片文件
        if (isSupportedImageFormat(fullPath)) {
          const imageData = await processImageFile(fullPath)
          results.push({
            path: entry.path,
            imageDataUrl: imageData.dataUrl,
            notice: imageData.notice,
          })
          continue
        }
        
        // 处理其他二进制文件
        results.push({
          path: entry.path,
          notice: "Binary file - content not displayed",
        })
        continue
      }
      
      // 读取文本文件
      if (entry.lineRanges && entry.lineRanges.length > 0) {
        // 读取指定行范围
        const content = await readLines(fullPath, entry.lineRanges)
        results.push({
          path: entry.path,
          content: addLineNumbers(content, entry.lineRanges[0].start),
          lineRanges: entry.lineRanges,
        })
      } else {
        // 读取整个文件
        const content = await fs.readFile(fullPath, "utf-8")
        const totalLines = content.split("\n").length
        
        results.push({
          path: entry.path,
          content: addLineNumbers(content, 1),
          totalLines,
        })
      }
      
      // 跟踪文件访问
      await cline.fileContextTracker.trackFileContext(entry.path, "read_tool")
      
    } catch (error) {
      results.push({
        path: entry.path,
        error: error.message,
      })
    }
  }
  
  // 5. 格式化并返回结果
  const filesXml = formatFilesResult(results)
  pushToolResult(filesXml)
}
```

**返回格式**：

```xml
<files>
  <file>
    <path>src/app.ts</path>
    <content lines="1-100">
1 | import express from 'express'
2 | 
3 | const app = express()
...
100 | export default app
    </content>
  </file>
</files>
```

#### 4.2 write_to_file 工具

**功能**：创建新文件或修改现有文件

**实现**（`src/core/tools/writeToFileTool.ts`）：

```typescript
export async function writeToFileTool(
  cline: Task,
  block: ToolUse,
  askApproval: AskApproval,
  handleError: HandleError,
  pushToolResult: PushToolResult,
  removeClosingTag: RemoveClosingTag,
) {
  const relPath: string = block.params.path
  let newContent: string = block.params.content
  let predictedLineCount: number = parseInt(block.params.line_count ?? "0")
  
  // 1. 参数验证
  if (!relPath) {
    pushToolResult(await cline.sayAndCreateMissingParamError("write_to_file", "path"))
    return
  }
  
  if (newContent === undefined) {
    pushToolResult(await cline.sayAndCreateMissingParamError("write_to_file", "content"))
    return
  }
  
  // 2. 访问权限检查
  const accessAllowed = cline.rooIgnoreController?.validateAccess(relPath)
  if (!accessAllowed) {
    await cline.say("rooignore_error", relPath)
    return
  }
  
  // 3. 写保护检查
  const isWriteProtected = cline.rooProtectedController?.isWriteProtected(relPath)
  
  // 4. 检查文件是否存在
  const fullPath = path.resolve(cline.cwd, relPath)
  const fileExists = await fileExistsAtPath(fullPath)
  
  // 5. 预处理内容（移除 markdown 代码块标记等）
  if (newContent.startsWith("```")) {
    newContent = newContent.split("\n").slice(1).join("\n")
  }
  if (newContent.endsWith("```")) {
    newContent = newContent.split("\n").slice(0, -1).join("\n")
  }
  
  // 6. 处理流式输出（partial）
  if (block.partial) {
    // 检查是否启用了防止焦点打扰实验
    if (!isPreventFocusDisruptionEnabled) {
      // 打开编辑器并流式更新
      if (!cline.diffViewProvider.isEditing) {
        await cline.diffViewProvider.open(relPath)
      }
      await cline.diffViewProvider.update(newContent, false)
    }
    return
  }
  
  // 7. 完整内容处理
  // 检查行数预测
  if (!predictedLineCount) {
    const actualLineCount = newContent.split("\n").length
    await cline.say("error", `line_count parameter missing. Actual lines: ${actualLineCount}`)
    return
  }
  
  // 8. 检测代码省略
  if (detectCodeOmission(originalContent, newContent, predictedLineCount)) {
    if (cline.diffStrategy) {
      pushToolResult(
        formatResponse.toolError(
          `Content appears to be truncated. Please use 'apply_diff' tool instead.`
        )
      )
      return
    }
  }
  
  // 9. 请求批准
  const completeMessage = JSON.stringify({
    tool: fileExists ? "editedExistingFile" : "newFileCreated",
    path: getReadablePath(cline.cwd, relPath),
    content: fileExists ? undefined : newContent,
    diff: fileExists ? createPrettyPatch(relPath, originalContent, newContent) : undefined,
    isOutsideWorkspace: isPathOutsideWorkspace(fullPath),
    isProtected: isWriteProtected,
  })
  
  const didApprove = await askApproval("tool", completeMessage, undefined, isWriteProtected)
  
  if (!didApprove) {
    await cline.diffViewProvider.revertChanges()
    return
  }
  
  // 10. 保存文件
  if (isPreventFocusDisruptionEnabled) {
    // 直接保存，不显示 diff view
    await cline.diffViewProvider.saveDirectly(relPath, newContent, false, diagnosticsEnabled, writeDelayMs)
  } else {
    // 显示 diff view 并保存
    await cline.diffViewProvider.saveChanges(diagnosticsEnabled, writeDelayMs)
  }
  
  // 11. 跟踪文件编辑
  await cline.fileContextTracker.trackFileContext(relPath, "roo_edited")
  cline.didEditFile = true
  
  // 12. 返回结果
  const message = await cline.diffViewProvider.pushToolWriteResult(cline, cline.cwd, !fileExists)
  pushToolResult(message)
  
  // 13. 清理和处理队列消息
  await cline.diffViewProvider.reset()
  cline.processQueuedMessages()
}
```

**关键特性**：

1. **流式更新**：支持实时显示编辑过程
2. **Diff 视图**：修改文件时显示差异对比
3. **代码省略检测**：防止 AI 截断代码
4. **写保护检查**：保护重要文件
5. **延迟写入**：可配置写入延迟，减少磁盘 I/O

#### 4.3 execute_command 工具

**功能**：在终端中执行命令

**实现片段**：

```typescript
export async function executeCommandTool(
  cline: Task,
  block: ToolUse,
  askApproval: AskApproval,
  handleError: HandleError,
  pushToolResult: PushToolResult,
) {
  const command: string = block.params.command
  
  // 1. 验证命令
  if (!command) {
    pushToolResult(await cline.sayAndCreateMissingParamError("execute_command", "command"))
    return
  }
  
  // 2. 检查是否在拒绝列表中
  if (cline.isCommandDenied(command)) {
    await cline.say("error", `Command '${command}' is in the denied commands list`)
    return
  }
  
  // 3. 请求批准
  const message = JSON.stringify({
    tool: "execute_command",
    command,
  })
  
  const didApprove = await askApproval("tool", message)
  
  if (!didApprove) {
    return
  }
  
  // 4. 创建终端进程
  const terminalProcess = await cline.createTerminalProcess(command)
  
  // 5. 监听输出
  const output: string[] = []
  let isComplete = false
  
  terminalProcess.on("output", (data) => {
    output.push(data)
    // 实时更新 UI
    cline.say("command_output", output.join(""), undefined, true)
  })
  
  terminalProcess.on("exit", (code) => {
    isComplete = true
    cline.say("command_output", output.join(""), undefined, false)
  })
  
  // 6. 等待命令完成或超时
  await pWaitFor(() => isComplete, { timeout: 60000 })
  
  // 7. 返回结果
  pushToolResult(`<command_result>\n${output.join("")}\n</command_result>`)
}
```

### 5. 批准流程

**askApproval 函数**：

```typescript
private async askApproval(
  type: "tool" | "command",
  message: string,
  images?: string[],
  isProtected?: boolean
): Promise<boolean> {
  // 1. 检查自动批准
  if (this.autoApprovalHandler.shouldAutoApprove(type, message)) {
    return true
  }
  
  // 2. 检查是否为受保护操作
  if (isProtected) {
    // 受保护操作始终需要批准
    const { response } = await this.ask("tool", message, false)
    return response === "yesButtonClicked"
  }
  
  // 3. 请求用户批准
  const { response, text, images: feedbackImages } = await this.ask("tool", message, false)
  
  // 4. 处理响应
  switch (response) {
    case "yesButtonClicked":
      if (text) {
        await this.say("user_feedback", text, feedbackImages)
      }
      return true
      
    case "noButtonClicked":
      if (text) {
        await this.say("user_feedback", text, feedbackImages)
      }
      this.didRejectTool = true
      return false
      
    case "messageResponse":
      // 用户提供了额外信息
      await this.say("user_feedback", text, feedbackImages)
      return false
      
    default:
      return false
  }
}
```

### 6. 工具结果格式化

**formatResponse 工具**（`src/core/prompts/responses.ts`）：

```typescript
export const formatResponse = {
  // 工具执行成功
  toolResult: (result: string, images?: string[]) => {
    if (images && images.length > 0) {
      return [
        { type: "text", text: result },
        ...images.map(img => ({ type: "image", source: { type: "base64", data: img } }))
      ]
    }
    return result
  },
  
  // 工具执行失败
  toolError: (error: string) => {
    return `<error>\n${error}\n</error>`
  },
  
  // 工具被拒绝
  toolDenied: () => {
    return "The user denied this operation."
  },
  
  // 工具被批准并附带反馈
  toolApprovedWithFeedback: (feedback: string) => {
    return `The user approved this operation and provided feedback:\n${feedback}`
  },
  
  // 创建漂亮的 diff
  createPrettyPatch: (filename: string, oldStr: string, newStr: string) => {
    const diff = createPatch(filename, oldStr, newStr)
    return `\`\`\`diff\n${diff}\n\`\`\``
  },
}
```

### 7. 工具重复检测

防止 AI 重复调用相同的工具：

```typescript
export class ToolRepetitionDetector {
  private toolHistory: ToolCall[] = []
  private readonly maxRepetitions = 3
  private readonly timeWindow = 30000 // 30 秒
  
  addToolCall(toolName: string, params: any) {
    this.toolHistory.push({
      toolName,
      params,
      timestamp: Date.now(),
    })
    
    // 清理旧记录
    this.cleanOldEntries()
  }
  
  isRepetitive(toolName: string, params: any): boolean {
    const recentCalls = this.toolHistory.filter(call =>
      call.toolName === toolName &&
      JSON.stringify(call.params) === JSON.stringify(params)
    )
    
    return recentCalls.length >= this.maxRepetitions
  }
  
  private cleanOldEntries() {
    const cutoff = Date.now() - this.timeWindow
    this.toolHistory = this.toolHistory.filter(call => call.timestamp > cutoff)
  }
}
```

---

## 关键特性

### 1. 流式响应

支持 AI 响应的流式输出：

```typescript
// 在 API 响应处理中
for await (const chunk of stream) {
  if (chunk.type === "content_block_delta") {
    if (chunk.delta.type === "text_delta") {
      // 流式更新文本
      await this.say(
        "api_response",
        accumulatedText + chunk.delta.text,
        undefined,
        true  // partial = true
      )
    }
  }
}

// 完成时设置 partial = false
await this.say("api_response", finalText, undefined, false)
```

### 2. Checkpoint（检查点）

支持在任务执行过程中创建检查点：

```typescript
// 创建检查点
async createCheckpoint() {
  const checkpoint = {
    ts: Date.now(),
    messages: [...this.clineMessages],
    apiHistory: [...this.apiConversationHistory],
    gitCommitHash: await this.getGitCommitHash(),
  }
  
  await this.checkpointService.saveCheckpoint(this.taskId, checkpoint)
  
  await this.say("checkpoint_created", undefined, undefined, false, checkpoint)
}

// 恢复到检查点
async restoreCheckpoint(checkpointTs: number) {
  const checkpoint = await this.checkpointService.loadCheckpoint(
    this.taskId,
    checkpointTs
  )
  
  // 恢复 Git 状态
  await this.gitRestoreToCommit(checkpoint.gitCommitHash)
  
  // 恢复消息历史
  this.clineMessages = checkpoint.messages
  this.apiConversationHistory = checkpoint.apiHistory
  
  await this.saveMessages()
  await this.providerRef.deref()?.postStateToWebview()
}
```

### 3. 子任务支持

支持在任务中创建子任务：

```typescript
async createSubTask(task: string, images?: string[]) {
  const subTask = new Task({
    provider: this.providerRef.deref()!,
    apiConfiguration: this.apiConfiguration,
    task,
    images,
    rootTask: this.rootTask || this,  // 保持根任务引用
    parentTask: this,                  // 设置父任务
    taskNumber: await this.getNextSubTaskNumber(),
  })
  
  // 添加到子任务列表
  this.childTaskId = subTask.taskId
  
  // 开始执行子任务
  await subTask.startTask(task, images)
  
  return subTask
}
```

### 4. 自动批准机制

**AutoApprovalHandler 类**（`src/core/task/AutoApprovalHandler.ts`）：

```typescript
export class AutoApprovalHandler {
  private readonly approvalSettings: ApprovalSettings
  
  shouldAutoApprove(operation: Operation): boolean {
    switch (operation.type) {
      case "read_file":
        return this.approvalSettings.alwaysAllowReadOnly
        
      case "write_file":
        if (operation.isInsideWorkspace) {
          return this.approvalSettings.alwaysAllowWrite
        } else {
          return this.approvalSettings.alwaysAllowWriteOutsideWorkspace
        }
        
      case "execute_command":
        const command = operation.command
        return this.approvalSettings.allowedCommands.includes(command)
        
      case "browser":
        return this.approvalSettings.alwaysAllowBrowser
        
      case "mcp":
        return this.approvalSettings.alwaysAllowMcp
        
      default:
        return false
    }
  }
}
```

### 5. 模式系统

支持多种工作模式：

```typescript
export enum Mode {
  Code = "code",          // 编码模式
  Architect = "architect", // 架构模式
  Ask = "ask",            // 询问模式
  Debug = "debug",        // 调试模式
}

// 任务中的模式
private _taskMode: string = Mode.Code

// 切换模式
async switchMode(newMode: Mode) {
  this._taskMode = newMode
  
  // 更新系统提示词
  await this.updateSystemPrompt()
  
  // 保存任务元数据
  await this.saveTaskMetadata()
}
```

### 6. Token 管理和成本追踪

```typescript
// 获取 API 指标
getApiMetrics(messages: ClineMessage[]): TokenUsage {
  let totalTokensIn = 0
  let totalTokensOut = 0
  let totalCacheWrites = 0
  let totalCacheReads = 0
  let totalCost = 0
  
  for (const message of messages) {
    if (message.say === "api_req_started") {
      const data = JSON.parse(message.text || "{}")
      totalTokensIn += data.tokensIn || 0
      totalTokensOut += data.tokensOut || 0
      totalCacheWrites += data.cacheWrites || 0
      totalCacheReads += data.cacheReads || 0
      totalCost += data.cost || 0
    }
  }
  
  return {
    totalTokensIn,
    totalTokensOut,
    totalCacheWrites,
    totalCacheReads,
    totalCost,
  }
}
```

### 7. 上下文压缩

支持自动压缩长对话上下文：

```typescript
async condenseContext() {
  const shouldCondense = this.shouldCondenseContext()
  
  if (!shouldCondense) {
    return
  }
  
  // 找到可以压缩的消息
  const condensableMessages = this.findCondensableMessages()
  
  // 调用 AI 生成摘要
  const summary = await this.generateSummary(condensableMessages)
  
  // 替换原消息
  this.apiConversationHistory = [
    ...this.apiConversationHistory.slice(0, startIndex),
    {
      role: "user",
      content: `[Context Summary]\n${summary}`,
      isSummary: true,
    },
    ...this.apiConversationHistory.slice(endIndex + 1),
  ]
  
  await this.saveApiMessages()
}

private shouldCondenseContext(): boolean {
  const config = this.getConfig()
  const totalTokens = this.getTotalTokens()
  const contextWindow = this.api.getContextWindow()
  
  return (
    config.autoCondenseContext &&
    totalTokens > contextWindow * config.autoCondenseContextPercent
  )
}
```

---

## 技术亮点

### 1. 弱引用管理

使用 `WeakRef` 避免循环引用：

```typescript
export class Task {
  providerRef: WeakRef<ClineProvider>
  
  constructor(options: TaskOptions) {
    this.providerRef = new WeakRef(options.provider)
  }
  
  // 访问 provider
  get provider(): ClineProvider | undefined {
    return this.providerRef.deref()
  }
}
```

### 2. 事件驱动架构

使用 EventEmitter 实现解耦：

```typescript
export class Task extends EventEmitter<TaskEvents> {
  // 发出事件
  async completeTask() {
    this.emit("taskCompleted", {
      taskId: this.taskId,
      tokenUsage: this.getTokenUsage(),
      toolUsage: this.getToolUsage(),
    })
  }
}

// ClineProvider 中监听
task.on("taskCompleted", (data) => {
  this.handleTaskCompleted(data)
})
```

### 3. 类型安全

充分利用 TypeScript 类型系统：

```typescript
// 消息类型联合
export type WebviewMessage = {
  type: "newTask"
  text?: string
  images?: string[]
} | {
  type: "askResponse"
  messageTs: number
  response: ClineAskResponse
  text?: string
} | {
  type: "clearTask"
} // ... 更多类型

// 使用类型守卫
function isNewTaskMessage(msg: WebviewMessage): msg is { type: "newTask", text?: string } {
  return msg.type === "newTask"
}
```

### 4. 异步流控制

使用 async/await 和 Promise 优雅处理异步：

```typescript
async startTask() {
  try {
    // 并行加载资源
    const [systemPrompt, previousMessages, workspaceContext] = await Promise.all([
      this.generateSystemPrompt(),
      this.getSavedApiConversationHistory(),
      this.getWorkspaceContext(),
    ])
    
    // 串行执行任务
    await this.say("text", task, images)
    await this.executeRecursive()
    
  } catch (error) {
    await this.handleError(error)
  }
}
```

### 5. 资源清理

实现完整的资源清理机制：

```typescript
export class Task {
  private disposables: vscode.Disposable[] = []
  
  constructor() {
    // 注册资源
    this.disposables.push(
      this.terminalProcess,
      this.browserSession,
      this.fileWatcher,
    )
  }
  
  async dispose() {
    // 清理所有资源
    for (const disposable of this.disposables) {
      try {
        await disposable.dispose()
      } catch (error) {
        console.error("Dispose error:", error)
      }
    }
    
    this.disposables = []
  }
}
```

### 6. 缓存优化

使用 NodeCache 优化性能：

```typescript
import NodeCache from "node-cache"

// 任务大小缓存
const taskSizeCache = new NodeCache({ 
  stdTTL: 30,           // 30 秒过期
  checkperiod: 5 * 60   // 每 5 分钟检查过期项
})

async function getTaskSize(taskDir: string): Promise<number> {
  const cachedSize = taskSizeCache.get<number>(taskDir)
  
  if (cachedSize !== undefined) {
    return cachedSize
  }
  
  const size = await getFolderSize.loose(taskDir)
  taskSizeCache.set(taskDir, size)
  
  return size
}
```

### 7. 错误恢复

实现完善的错误处理和恢复机制：

```typescript
async executeRecursive() {
  let retryCount = 0
  const maxRetries = 3
  
  while (retryCount < maxRetries) {
    try {
      await this.callApiAndProcess()
      break  // 成功则退出
      
    } catch (error) {
      retryCount++
      
      if (this.isRecoverableError(error)) {
        await this.say("error", `Retry ${retryCount}/${maxRetries}`)
        await delay(1000 * retryCount)  // 指数退避
        continue
      } else {
        // 不可恢复错误
        await this.handleFatalError(error)
        break
      }
    }
  }
}

private isRecoverableError(error: any): boolean {
  return (
    error.code === "ECONNRESET" ||
    error.code === "ETIMEDOUT" ||
    error.status === 429 ||  // Rate limit
    error.status === 500     // Server error
  )
}
```

---

## 总结

### 核心设计理念

1. **关注点分离**
   - Provider 负责协调和管理
   - Task 负责具体执行逻辑
   - Persistence 负责数据持久化

2. **可靠性优先**
   - 完整的错误处理
   - 自动保存和恢复
   - 支持断点续传

3. **用户体验**
   - 流式响应提供即时反馈
   - 自动批准减少打扰
   - 历史记录方便回溯

4. **可扩展性**
   - 插件化的工具系统
   - 灵活的模式机制
   - 支持子任务嵌套

### 优秀实践

1. **双重消息历史**：API 消息和 UI 消息分离，清晰的职责划分
2. **弱引用管理**：避免内存泄漏，优雅处理循环引用
3. **事件驱动**：解耦组件，提高可维护性
4. **类型安全**：充分利用 TypeScript，减少运行时错误
5. **资源管理**：完善的生命周期管理，确保资源正确释放

### 可借鉴的设计

对于其他 AI 对话系统的实现，可以借鉴：

1. 双重历史机制（API vs UI）
2. 任务栈管理多会话
3. 流式响应的部分更新策略
4. 完整的持久化方案
5. 检查点和恢复机制
6. 自动批准系统
7. 上下文压缩策略

---

**文档版本**: 1.0  
**分析时间**: 2025-10-05  
**基于版本**: Roo-Code-main (最新)
