# AI 工具调用系统使用指南

本指南说明如何使用改造后的 `AIChatSessionWithTools` 组件，该组件基于 Roo-Code 的实现原理，支持 AI 通过工具调用执行 SSH 命令和其他操作。

## 功能概述

### 核心特性

1. **工具调用机制** - AI 可以调用预定义的工具来执行操作
2. **SSH 命令执行** - 通过 AI 在远程服务器上执行命令
3. **用户批准流程** - 所有工具调用都需要用户批准
4. **实时进度反馈** - 显示工具执行的实时状态
5. **结果展示** - 清晰展示工具执行结果

### 支持的工具

- `execute_ssh_command` - 执行 SSH 命令
- `read_file` - 读取远程文件内容
- `list_files` - 列出目录文件
- `ask_followup_question` - 询问用户问题
- `attempt_completion` - 完成任务并展示结果

## 快速开始

### 1. 基本使用

```vue
<template>
  <AIChatSessionWithTools
    :messages="messages"
    :current-provider="currentProvider"
    :current-model="currentModel"
    :connection-id="sshConnectionId"
    :enable-tools="true"
    :server-info="{
      host: '192.168.1.100',
      username: 'root'
    }"
    @send-message="handleSendMessage"
    @tool-executed="handleToolExecuted"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AIChatSessionWithTools from '@/components/chat/AIChatSessionWithTools.vue'
import type { Message } from '@/components/chat/AIChatSessionWithTools.vue'

const messages = ref<Message[]>([])
const sshConnectionId = ref('your-connection-id')

const handleSendMessage = (content: string) => {
  console.log('User sent:', content)
}

const handleToolExecuted = (toolName: string, result: any) => {
  console.log(`Tool ${toolName} executed:`, result)
}
</script>
```

### 2. 完整示例

```vue
<template>
  <div class="chat-container h-screen flex flex-col">
    <!-- 头部 -->
    <div class="header p-4 border-b border-vscode-border">
      <h2 class="text-lg font-medium">AI SSH 助手</h2>
      <div class="text-sm text-vscode-fg-muted">
        连接到: {{ serverInfo.host }}
      </div>
    </div>

    <!-- 聊天区域 -->
    <AIChatSessionWithTools
      class="flex-1"
      :messages="messages"
      :current-provider="provider"
      :current-model="model"
      :connection-id="connectionId"
      :enable-tools="true"
      :server-info="serverInfo"
      :session-name="sessionName"
      empty-state-text="开始与 AI 助手对话，执行 SSH 操作"
      @send-message="handleSendMessage"
      @clear-messages="handleClearMessages"
      @update:messages="messages = $event"
      @tool-executed="handleToolExecuted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AIChatSessionWithTools from '@/components/chat/AIChatSessionWithTools.vue'
import type { Message } from '@/components/chat/AIChatSessionWithTools.vue'
import type { AIProvider, AIModel } from '@/types/ai-providers'

const messages = ref<Message[]>([])
const connectionId = ref('')
const sessionName = ref('SSH 会话 1')

const serverInfo = ref({
  host: '192.168.1.100',
  username: 'root'
})

const provider = ref<AIProvider>({
  id: 'openai',
  name: 'OpenAI',
  endpoint: 'https://api.openai.com/v1',
  apiKey: 'your-api-key'
})

const model = ref<AIModel>({
  id: 'gpt-4',
  name: 'GPT-4'
})

onMounted(async () => {
  // 建立 SSH 连接
  connectionId.value = await connectToSSH(serverInfo.value)
})

const handleSendMessage = (content: string) => {
  console.log('User:', content)
}

const handleClearMessages = () => {
  messages.value = []
}

const handleToolExecuted = (toolName: string, result: any) => {
  console.log(`[Tool] ${toolName}:`, result)
  
  // 可以在这里添加额外的逻辑
  if (toolName === 'execute_ssh_command' && !result.success) {
    console.error('Command failed:', result.error)
  }
}

async function connectToSSH(info: any): Promise<string> {
  // 实现 SSH 连接逻辑
  return 'connection-id'
}
</script>
```

## AI 工具调用示例

### 示例 1: 执行基本命令

**用户输入**:
```
请帮我查看当前目录的文件列表
```

**AI 响应** (内部生成):
```xml
<execute_ssh_command>
<command>ls -la</command>
</execute_ssh_command>
```

**系统行为**:
1. 解析工具调用
2. 弹出批准对话框
3. 用户批准后执行
4. 显示执行结果

### 示例 2: 读取文件

**用户输入**:
```
读取 /etc/nginx/nginx.conf 的内容
```

**AI 响应**:
```xml
<read_file>
<path>/etc/nginx/nginx.conf</path>
</read_file>
```

### 示例 3: 复杂操作

**用户输入**:
```
帮我检查 Nginx 服务状态，如果没运行就启动它
```

**AI 响应序列**:

1. 检查状态:
```xml
<execute_ssh_command>
<command>systemctl status nginx</command>
</execute_ssh_command>
```

2. 根据结果启动服务:
```xml
<execute_ssh_command>
<command>sudo systemctl start nginx</command>
</execute_ssh_command>
```

3. 确认结果:
```xml
<attempt_completion>
<result>Nginx 服务已成功启动并正在运行。</result>
</attempt_completion>
```

## 工具批准机制

### 批准流程

1. **AI 生成工具调用** - AI 在响应中包含 XML 格式的工具调用
2. **解析工具调用** - 系统解析出工具名称和参数
3. **显示批准对话框** - 展示工具信息给用户
4. **用户决策** - 用户可以批准、拒绝或提供反馈
5. **执行或取消** - 根据用户决策执行工具或返回拒绝信息

### 批准对话框功能

- **查看工具信息** - 显示工具名称和所有参数
- **危险命令警告** - 自动检测并警告潜在危险操作
- **提供反馈** - 用户可以添加额外指示
- **记住选择** - 可选择记住对某类工具的批准

### 危险命令检测

系统会自动检测以下模式的危险命令：

- `rm -rf` - 递归强制删除
- `dd` - 磁盘操作
- `mkfs` - 格式化文件系统
- `chmod -R` / `chown -R` - 递归权限修改
- `shutdown` / `reboot` - 系统重启
- `kill -9` / `pkill` - 强制终止进程

当检测到危险命令时，会显示醒目的警告提示。

## 组件 Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `messages` | `Message[]` | `[]` | 消息列表 |
| `currentProvider` | `AIProvider` | `null` | AI 服务商配置 |
| `currentModel` | `AIModel` | `null` | AI 模型配置 |
| `connectionId` | `string` | `''` | SSH 连接 ID |
| `enableTools` | `boolean` | `true` | 是否启用工具功能 |
| `serverInfo` | `object` | `undefined` | 服务器信息 |
| `sessionName` | `string` | `''` | 会话名称 |
| `multiline` | `boolean` | `false` | 多行输入 |
| `showCopyButton` | `boolean` | `true` | 显示复制按钮 |
| `showToolbar` | `boolean` | `true` | 显示工具栏 |
| `autoScroll` | `boolean` | `true` | 自动滚动 |

## 组件 Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `send-message` | `(content: string)` | 用户发送消息 |
| `clear-messages` | `()` | 清空消息 |
| `update:messages` | `(messages: Message[])` | 消息列表更新 |
| `tool-executed` | `(toolName: string, result: ToolResult)` | 工具执行完成 |

## 扩展工具

### 添加新工具

1. **定义工具类型** (`src/types/tools.ts`):

```typescript
export enum ToolName {
  // 现有工具...
  MY_NEW_TOOL = 'my_new_tool',
}
```

2. **添加工具描述** (`src/services/tools/system-prompt.ts`):

```typescript
tools.push(`
## my_new_tool

Description: 你的工具描述

Parameters:
- param1: (required) 参数说明

Usage:
<my_new_tool>
<param1>value</param1>
</my_new_tool>`)
```

3. **实现工具执行器** (`src/services/tools/tool-executor.ts`):

```typescript
export async function myNewToolExecutor(
  params: ToolUseParams,
  connectionId: string
): Promise<ToolResult> {
  // 实现你的工具逻辑
  try {
    const result = await doSomething(params)
    return {
      success: true,
      content: result
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: error.message
    }
  }
}

// 在 executeTool 中添加 case
case 'my_new_tool':
  return await myNewToolExecutor(params, connectionId)
```

## 最佳实践

### 1. 清晰的提示词

向 AI 提供清晰的任务描述：

✅ **好的示例**:
```
检查 /var/log/nginx 目录下的最新错误日志，找出过去1小时内的所有 500 错误
```

❌ **不好的示例**:
```
看看日志
```

### 2. 安全考虑

- 始终审查 AI 生成的命令
- 对危险操作格外小心
- 使用受限权限的用户账户
- 定期备份重要数据

### 3. 性能优化

- 避免频繁的大文件读取
- 合理使用工具链，一次完成多个相关操作
- 对于长时间运行的命令，考虑后台执行

### 4. 错误处理

```typescript
const handleToolExecuted = (toolName: string, result: ToolResult) => {
  if (!result.success) {
    // 记录错误
    console.error(`Tool ${toolName} failed:`, result.error)
    
    // 可以添加重试逻辑或用户通知
    if (toolName === 'execute_ssh_command') {
      showNotification({
        type: 'error',
        message: `命令执行失败: ${result.error}`
      })
    }
  }
}
```

## 故障排查

### 工具调用未被识别

**问题**: AI 响应中包含工具调用但系统未识别

**解决方案**:
1. 检查 XML 格式是否正确
2. 确保工具名称与定义匹配
3. 查看控制台是否有解析错误

### SSH 连接失败

**问题**: 工具执行时提示 "未建立 SSH 连接"

**解决方案**:
1. 确认 `connectionId` prop 已正确传入
2. 验证 SSH 连接是否仍然有效
3. 检查网络连接

### 工具批准对话框不显示

**问题**: 工具调用后批准对话框未弹出

**解决方案**:
1. 确认 `enableTools` 设置为 `true`
2. 检查 `ToolApprovalDialog` 组件是否正确导入
3. 查看浏览器控制台错误

## 性能指标

- **工具解析**: < 10ms
- **批准响应**: 用户交互时间
- **SSH 命令执行**: 取决于命令和网络延迟
- **UI 更新**: < 16ms (60fps)

## 更新日志

### v1.0.0 (2025-01-XX)

- ✨ 初始版本
- ✨ 支持 SSH 命令执行
- ✨ 实现工具批准机制
- ✨ 添加危险命令检测
- ✨ 完整的 Markdown 渲染支持

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

