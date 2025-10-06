# AI 助手聊天模式切换功能

## 功能概述

AI 助手现在支持两种聊天模式，用户可以根据需求自由切换：

| 模式 | 图标 | 说明 | 适用场景 |
|------|------|------|----------|
| **Agent** | 🤖 | AI 可以主动执行工具和命令 | 需要 AI 帮你完成任务 |
| **Ask** | 💬 | AI 仅回答问题，不执行工具 | 只是咨询问题，获取建议 |

## UI 设计

### 模式选择器位置

```
┌─────────────────────────────────┐
│ 消息显示区域                      │
│                                 │
│                                 │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ [Agent] [Ask]  ← 模式选择器      │
│ ┌─────────────────────────────┐ │
│ │ 输入框                       │ │
│ │                             │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 视觉效果

- **未激活状态**：灰色文字，透明背景
- **悬停状态**：白色文字，半透明背景
- **激活状态**：主题按钮颜色（蓝色），白色文字

### 按钮样式

```css
.mode-button {
  /* 图标 + 文本的横向布局 */
  display: flex;
  align-items: center;
  gap: 6px;
  
  /* 紧凑的内边距 */
  padding: 6px 14px;
  
  /* 圆角设计 */
  border-radius: 4px;
  
  /* 平滑过渡动画 */
  transition: all 0.2s;
}
```

## 功能详解

### Agent 模式（智能代理）

**特点：**
- ✅ AI 可以主动执行 SSH 命令
- ✅ AI 可以读取和操作文件
- ✅ AI 可以使用所有可用的工具
- ✅ 完整的工具调用系统提示词

**输入框提示：**
```
描述你的任务，AI 会主动执行操作...
```

**系统提示词：**
```
[完整的工具调用系统提示词，包含所有工具定义和使用说明]
```

**示例对话：**

**用户：** "列出当前目录的文件"

**AI：** 
```xml
<execute_ssh_command>
<command>ls -la</command>
</execute_ssh_command>
```
[执行命令]
```
total 48
drwxr-xr-x  5 user user 4096 Jan  1 12:00 .
drwxr-xr-x 10 user user 4096 Dec 31 10:00 ..
-rw-r--r--  1 user user  220 Dec 31 09:00 .bashrc
...
```

### Ask 模式（纯问答）

**特点：**
- ❌ AI 不会执行任何工具
- ❌ AI 不会运行任何命令
- ✅ AI 只提供建议和解答
- ✅ 简洁的问答系统提示词

**输入框提示：**
```
提出你的问题，AI 会进行回答...
```

**系统提示词：**
```
你是一个乐于助人的 AI 助手。请专注于回答用户的问题，提供清晰准确的信息和建议。不要尝试执行任何工具或命令。
```

**示例对话：**

**用户：** "列出当前目录的文件"

**AI：** "要列出当前目录的文件，你可以使用以下命令：

```bash
ls -la
```

这个命令的参数说明：
- `ls`: 列出文件和目录
- `-l`: 显示详细信息（权限、大小、日期等）
- `-a`: 显示所有文件（包括隐藏文件）

你也可以使用其他选项：
- `ls -lh`: 以人类可读的格式显示文件大小
- `ls -lt`: 按修改时间排序
- `ls -lS`: 按文件大小排序"

## 使用场景对比

### 何时使用 Agent 模式

✅ **任务执行场景**
- "帮我查看系统日志"
- "检查磁盘使用情况"
- "重启 Nginx 服务"
- "创建一个新目录"
- "查找所有 .log 文件"

✅ **自动化场景**
- "部署最新版本的应用"
- "备份数据库"
- "清理临时文件"
- "更新系统软件包"

### 何时使用 Ask 模式

✅ **咨询场景**
- "如何配置 Nginx 反向代理？"
- "Docker 容器和镜像有什么区别？"
- "Git rebase 和 merge 该如何选择？"
- "什么是 JWT 认证？"

✅ **学习场景**
- "解释一下 Linux 的权限系统"
- "SSH 的工作原理是什么？"
- "如何优化 Node.js 应用性能？"

✅ **规划场景**
- "我应该如何设计微服务架构？"
- "给我一个 CI/CD 流程的建议"
- "推荐一些监控工具"

## 技术实现

### 状态管理

```typescript
// 聊天模式状态
const chatMode = ref<'agent' | 'ask'>('agent')

// 动态占位符
const currentPlaceholder = computed(() => {
  if (chatMode.value === 'agent') {
    return '描述你的任务，AI 会主动执行操作...'
  } else {
    return '提出你的问题，AI 会进行回答...'
  }
})
```

### 系统提示词逻辑

```typescript
// 根据模式生成不同的系统提示词
if (props.enableTools && chatMode.value === 'agent') {
  // Agent 模式：完整的工具系统提示词
  const systemPrompt = generateSystemPrompt({
    enableSSH: true,
    enableFileOps: true,
    serverInfo: props.serverInfo
  })
  apiMessages.push({
    role: 'system',
    content: systemPrompt
  })
} else if (chatMode.value === 'ask') {
  // Ask 模式：简单的问答提示词
  apiMessages.push({
    role: 'system',
    content: '你是一个乐于助人的 AI 助手。请专注于回答用户的问题，提供清晰准确的信息和建议。不要尝试执行任何工具或命令。'
  })
}
```

### 模式切换按钮

```vue
<div class="mode-selector">
  <button
    class="mode-button"
    :class="{ 'active': chatMode === 'agent' }"
    title="Agent 模式：AI 可以主动执行工具和命令"
    @click="chatMode = 'agent'"
  >
    <i class="bi bi-robot"></i>
    <span>Agent</span>
  </button>
  <button
    class="mode-button"
    :class="{ 'active': chatMode === 'ask' }"
    title="Ask 模式：AI 只回答问题，不执行工具"
    @click="chatMode = 'ask'"
  >
    <i class="bi bi-chat-dots"></i>
    <span>Ask</span>
  </button>
</div>
```

## 用户体验优化

### 1. 视觉提示

- **模式指示器**：激活的模式使用主题颜色高亮
- **图标语义**：机器人代表执行，对话框代表问答
- **工具提示**：悬停显示每个模式的详细说明

### 2. 输入提示

- **动态占位符**：根据模式显示不同的提示文本
- **明确预期**：让用户知道当前模式下 AI 会如何响应

### 3. 快速切换

- **一键切换**：无需确认，立即生效
- **状态保持**：切换模式不影响当前对话历史
- **下次记忆**：可扩展为记住用户的模式偏好

## 设计理念

### 为什么需要两种模式？

1. **安全性**
   - Ask 模式避免了意外的命令执行
   - 用户可以先咨询，再决定是否执行

2. **灵活性**
   - 不同场景需要不同的交互方式
   - 同一个会话中可以灵活切换

3. **效率性**
   - Agent 模式：快速完成任务
   - Ask 模式：快速获取知识

4. **用户控制**
   - 用户完全掌控 AI 的行为范围
   - 明确的模式边界，避免混淆

## 未来扩展

### 可能的改进

1. **模式记忆**
   ```typescript
   // 保存用户的模式偏好
   localStorage.setItem('preferredChatMode', chatMode.value)
   ```

2. **更多模式**
   - **Code 模式**：专注于代码生成和审查
   - **Debug 模式**：专注于问题诊断和调试
   - **Learn 模式**：教学风格的详细解释

3. **模式推荐**
   ```typescript
   // 根据用户输入智能推荐模式
   if (input.includes('如何') || input.includes('什么是')) {
     suggestMode('ask')
   } else if (input.includes('帮我') || input.includes('执行')) {
     suggestMode('agent')
   }
   ```

4. **权限控制**
   ```typescript
   // 根据用户权限限制可用模式
   if (!hasToolPermission) {
     chatMode.value = 'ask'
     disableMode('agent')
   }
   ```

## 相关文件

- `apps/desktop/src/components/chat/AIChatSessionWithTools.vue` - 主要实现文件

## 修改记录

- **2025-01-XX**: 初始实现，添加 Agent 和 Ask 两种模式

