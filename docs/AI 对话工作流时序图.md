# AI 对话工作流时序图

本文档详细展示 AI SSH Assistant 中 AI 对话的完整工作流，包括系统提示词生成、工具调用、会话总结等关键环节。

## 📊 完整 AI 对话时序图

### 从用户点击到最终响应的完整流程

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ AIChatSessionWith│    │   system-prompt   │    │   AI API 调用     │    │   工具执行器     │
│   Tools.vue     │    │   (提示词生成)    │    │   (流式响应)      │    │   (executeTool) │
│   (UI 层)       │    │   (业务层)        │    │   (外部服务)      │    │   (业务层)      │
└─────────────────┘    └──────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │                       │
         │ 1. 用户点击发送按钮      │                       │                       │
         │    @click="handleSendMessage()"                │                       │
         │    isGenerating ? handleStopGeneration()       │                       │
         │                        │                       │                       │
         │ 2. handleSendMessage() │                       │                       │
         │    清空输入框，调用     │                       │                       │
         │    sendMessageInternal()                       │                       │
         │                        │                       │                       │
         │ 3. sendMessageInternal()                       │                       │
         │    验证配置，添加用户消息                       │                       │
         │    准备 AI 消息格式                            │                       │
         │                        │                       │                       │
         │ 4. 生成系统提示词       │                       │                       │
         │    if (enableTools && agent)                   │                       │
         │    generateSystemPrompt({                      │                       │
         │      enableSSH: true,                          │                       │
         │      enableFileOps: true,                      │                       │
         │      serverInfo,                               │                       │
         │      serverEnvDoc                              │                       │
         │    })                                          │                       │
         ├────────────────────────►│                       │                       │
         │                        │ 5. 读取服务器环境文档 │                       │
         │                        │    docStorageService  │                       │
         │                        │    .readServerEnvDoc()│                       │
         │                        │                       │                       │
         │                        │ 6. 构建 SSH 系统提示词│                       │
         │                        │    包含工具定义、服务器信息│                       │
         │                        │    环境文档等                           │                       │
         │                        │◄───────────────────────┤                       │
         │                        │                       │                       │
         │ 7. 准备历史消息         │                       │                       │
         │    策略：会话总结 + 最近 N 条消息              │                       │
         │    if (totalMessageCount > 10) {               │                       │
         │      使用总结 + 最近 10 条                     │                       │
         │    }                                           │                       │
         │                        │                       │                       │
         │ 8. 调用 AI API         │                       │                       │
         │    chatCompletion()    │                       │                       │
         │    流式响应处理        │                       │                       │
         ├────────────────────────►│                       │                       │
         │                        │ 9. 流式输出处理        │                       │
         │                        │    实时更新消息内容    │                       │
         │                        │    检测 Todo List     │                       │
         │                        │    extractTodoListFromMessage()               │                       │
         │                        │                       │                       │
         │                        │ 10. 检测工具调用       │                       │
         │                        │     parseToolUse()    │                       │
         │                        │     if (toolUse)      │                       │
         │                        │     executeToolCall() │                       │
         │                        ├───────────────────────►│                       │
         │                        │                       │ 11. 工具批准检查       │
         │                        │                       │     alwaysAutoApprove │                       │
         │                        │                       │     readOnlyTools     │                       │
         │                        │                       │     commandRiskLevel  │                       │
         │                        │                       │                       │
         │                        │                       │ 12. 执行工具           │
         │                        │                       │     executeTool()      │                       │
         │                        │                       │     SSH 命令执行       │                       │
         │                        │                       │     文件操作           │                       │
         │                        │                       │◄───────────────────────┤
         │                        │ 13. 递归调用 AI        │                       │
         │                        │     让 AI 处理工具结果 │                       │
         │                        │     sendMessageInternal()                     │                       │
         │                        │     (toolResult, true)│                       │
         │                        │◄───────────────────────┤                       │
         │                        │                       │                       │
         │ 14. 完成响应处理        │                       │                       │
         │     isGenerating = false                       │                       │
         │                        │                       │                       │
         │ 15. 触发会话总结        │                       │                       │
         │     autoSummarizeSession()                     │                       │
         │     后台异步执行                              │                       │
         │                        │                       │                       │
         │ 16. 检查总结条件        │                       │                       │
         │     shouldSummarize(                            │                       │
         │       messageCount,                             │                       │
         │       lastSummaryAt,                            │                       │
         │       threshold: 3                              │                       │
         │     )                                           │                       │
         │                        │                       │                       │
         │ 17. 执行 AI 总结        │                       │                       │
         │     summarizeMessages()                         │                       │
         │     累积总结或完整总结                          │                       │
         │                        │                       │                       │
         │ 18. 保存总结到数据库    │                       │                       │
         │     chatService.updateSessionSummary()          │                       │
         │     sessionId, summary, messageCount            │                       │
         │                        │                       │                       │
         │ 19. 总结完成，更新状态   │                       │                       │
         │     sessionSummary = result.summary             │                       │
         │     summarizedMessageCount = allMessages.length │                       │
         │     lastSummaryAt = new Date()                  │                       │
         │                        │                       │                       │
```

## 🔑 关键环节详解

### 1. **系统提示词生成** (`system-prompt.ts`)

```typescript
// 关键代码位置：apps/desktop/src/services/tools/system-prompt.ts
export function generateSystemPrompt(options: SystemPromptOptions): string {
  const {
    enableSSH = true,
    enableFileOps = true,
    serverInfo,
    serverEnvDoc
  } = options

  let prompt = `你是强大的 AI SSH 助手，可以通过 SSH 连接到远程服务器执行各种操作。

你的能力包括：
- SSH 命令执行
- 文件上传/下载
- 目录操作
- 系统监控
- 部署管理

工具使用规范：
- 优先使用工具解决问题
- 危险命令需要用户确认
- 保持操作安全性和准确性

服务器信息：
${serverInfo || '暂无服务器信息'}

服务器环境文档：
${serverEnvDoc || '暂无环境文档'}`

  return prompt
}
```

### 2. **工具调用检测** (`parseToolUse`)

```typescript
// AI 响应中的工具调用格式示例
assistant: 我需要查看服务器上的文件列表。
<execute_ssh_command>
{
  "command": "ls -la /home/user"
}
</execute_ssh_command>
```

### 3. **工具执行流程** (`executeToolCall`)

```typescript
// 工具批准策略
const alwaysAutoApproveTools = [
  'attempt_completion',     // 任务完成
  'ask_followup_question',  // 询问问题
]

const readOnlyTools = [
  'read_file',              // 读取文件
  'list_files',             // 列出文件
]

// 风险等级评估
if (toolName === 'execute_ssh_command') {
  const riskLevel = assessCommandRisk(params.command)
  if (riskLevel <= aiSettings.value.commandRiskLevel) {
    needsApproval = false
  }
}
```

### 4. **会话总结策略** (`autoSummarizeSession`)

```typescript
// 总结触发条件
const needsSummary = shouldSummarize(
  allMessages.length,        // 当前消息总数
  lastSummaryAt.value,       // 上次总结时间
  summarizedMessageCount.value, // 已总结的消息数
  3                          // 阈值：新增3条消息触发总结
)

// 总结范围策略
if (sessionSummary.value && summarizedMessageCount.value > 0) {
  // 累积总结：只总结新增的消息
  messagesToSummarize = allMessages.slice(summarizedMessageCount.value)
} else {
  // 完整总结：总结所有消息
  messagesToSummarize = allMessages
}
```

## 📋 总结内容的应用

### 1. **历史消息压缩**
```typescript
// 使用总结压缩历史消息
if (totalMessageCount > recentMessageCount) {
  // 添加总结作为系统消息
  apiMessages.push({
    role: 'system',
    content: `以下是之前对话的总结：\n${sessionSummary.value}`
  })

  // 只保留最近的消息
  const recentMessages = allHistoryMessages.slice(-recentMessageCount)
  // ... 添加到 apiMessages
}
```

### 2. **上下文保持**
- 总结确保重要信息不丢失
- 新对话基于总结继续
- 避免 token 限制问题

### 3. **用户体验优化**
- 减少 API 调用延迟
- 保持对话连贯性
- 支持长对话场景

## 🎯 设计优势

1. **智能提示词**：根据服务器环境动态生成系统提示
2. **安全工具执行**：多层风险评估和用户确认机制
3. **实时流式响应**：边生成边显示，支持实时取消
4. **会话持久化**：自动总结确保对话历史不丢失
5. **工具生态**：丰富的 SSH 和文件操作工具集

## 📊 性能优化

- **消息压缩**：总结 + 最近消息策略减少 token 使用
- **流式处理**：实时响应提升用户体验
- **异步总结**：后台总结不阻塞用户交互
- **缓存机制**：API 密钥和配置本地缓存
