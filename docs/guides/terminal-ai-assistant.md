# TerminalView 工具调用使用指南

## ✅ 已完成的改造

`TerminalView.vue` 已成功集成工具调用系统，现在支持通过 AI 执行 SSH 命令！

## 🎯 新功能

### 1. SSH 命令执行
AI 现在可以直接执行 SSH 命令，并将结果返回给你。

### 2. 文件操作
- 读取远程文件内容
- 列出目录文件
- 查看文件详情

### 3. 智能任务完成
AI 可以自动完成复杂的多步骤任务。

## 🚀 如何使用

### 步骤 1: 连接到 SSH 服务器

在左侧树中点击一个 SSH 连接，打开终端。

### 步骤 2: 打开 AI 助手

点击终端右上角的 🤖 机器人图标，打开 AI 助手面板。

### 步骤 3: 开始对话

直接输入你的需求，AI 会自动使用工具完成任务！

## 💬 使用示例

### 示例 1: 查看系统信息

**你输入**:
```
帮我查看服务器的系统信息，包括 CPU、内存和磁盘使用情况
```

**AI 会自动**:
1. 执行 `uname -a` 查看系统信息
2. 执行 `free -h` 查看内存
3. 执行 `df -h` 查看磁盘
4. 汇总所有信息并分析
5. 在聊天窗口和终端中显示结果

### 示例 2: 检查服务状态

**你输入**:
```
检查 Nginx 服务是否在运行，如果没运行就启动它
```

**AI 会自动**:
1. 执行 `systemctl status nginx` 检查状态
2. 如果未运行，请求执行 `sudo systemctl start nginx`
3. 再次检查状态确认
4. 报告结果

### 示例 3: 分析日志

**你输入**:
```
查看最近 100 行的 Nginx 访问日志，找出访问最频繁的 IP
```

**AI 会自动**:
1. 执行 `tail -n 100 /var/log/nginx/access.log`
2. 分析日志内容
3. 统计 IP 访问频率
4. 展示结果

### 示例 4: 文件操作

**你输入**:
```
读取 /etc/nginx/nginx.conf 的配置，帮我检查有没有问题
```

**AI 会自动**:
1. 使用 `read_file` 工具读取配置文件
2. 分析配置内容
3. 指出潜在问题
4. 提供优化建议

## 🔐 安全机制

### 自动批准对话框

每次 AI 要执行命令时，都会弹出批准对话框，显示：

- 🔧 **工具名称**: `execute_ssh_command`
- 📝 **命令内容**: 将要执行的完整命令
- ⚠️ **危险警告**: 对于 `rm -rf`, `dd` 等危险命令会显示警告
- 💬 **反馈输入**: 可以修改或限制命令

**你可以选择**:
- ✅ **批准执行** - 执行命令
- ❌ **拒绝** - 取消操作
- 💬 **添加反馈** - 给 AI 额外的指示

### 危险命令检测

系统会自动检测以下危险模式：
- `rm -rf` - 递归删除
- `dd` - 磁盘操作
- `mkfs` - 格式化
- `shutdown` / `reboot` - 重启
- `chmod -R` / `chown -R` - 递归权限修改
- `kill -9` - 强制终止

当检测到危险命令时，会显示醒目的⚠️警告。

## 🎨 UI 说明

### AI 助手面板

```
┌─────────────────────────────────┐
│  AI 助手                    [X]  │
├─────────────────────────────────┤
│                                 │
│  [对话内容区域]                  │
│  ├─ 你的问题                     │
│  ├─ AI 的分析                    │
│  └─ 🔧 工具调用标记              │
│     ├─ execute_ssh_command      │
│     └─ ✅ 执行成功               │
│        [命令输出]                │
│                                 │
├─────────────────────────────────┤
│  [输入框]                        │
│  向AI助手提问...                 │
│  (Ctrl+Enter 发送，支持SSH命令) │
└─────────────────────────────────┘
```

### 工具批准对话框

```
┌──────────────────────────────┐
│  工具调用请求      [需要批准] │
├──────────────────────────────┤
│  工具名称: execute_ssh_command│
│                              │
│  参数:                        │
│  command: df -h              │
│                              │
│  说明:                        │
│  AI 助手请求执行 SSH 命令     │
│                              │
│  反馈(可选): ____________     │
│                              │
│  [拒绝]         [批准执行]    │
└──────────────────────────────┘
```

### 执行结果显示

#### 在 AI 聊天窗口中:
```
AI: 我会帮您查看磁盘使用情况。

🔧 execute_ssh_command
✅ 执行成功
┌─────────────────────────
│ Filesystem   Size  Used
│ /dev/sda1    50G   22G
│ /dev/sdb1    500G  390G
└─────────────────────────

根据结果，您的磁盘使用情况如下...
```

#### 在终端窗口中:
```
[AI执行命令结果]
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        50G   22G   26G  45% /
/dev/sdb1       500G  390G   85G  82% /data
```

## 📊 工作流程

```
1. 用户输入需求
   ↓
2. AI 分析任务
   ↓
3. 生成工具调用 (XML格式)
   ↓
4. 弹出批准对话框
   ↓
5. 用户批准/拒绝
   ↓
6. [批准] 执行 SSH 命令
   ↓
7. 获取命令输出
   ↓
8. 显示在聊天窗口和终端
   ↓
9. AI 分析结果
   ↓
10. 继续下一步或完成任务
```

## 🔧 技术细节

### 改造内容

#### 1. 导入新组件
```typescript
// 旧的
import AIChatSession from '@/components/chat/AIChatSession.vue'

// 新的
import AIChatSessionWithTools from '@/components/chat/AIChatSessionWithTools.vue'
import type { ToolResult } from '@/types/tools'
```

#### 2. 添加服务器信息
```typescript
const serverInfo = computed(() => {
  const config = getNodeConfig()
  if (!config) return undefined
  
  return {
    host: config.host,
    username: config.username
  }
})
```

#### 3. 工具执行处理
```typescript
const handleToolExecuted = (toolName: string, result: ToolResult) => {
  // 将命令执行结果显示到终端
  if (toolName === 'execute_ssh_command' && result.success) {
    terminal.value.write('\r\n\x1b[36m[AI执行命令结果]\x1b[0m\r\n')
    terminal.value.write(result.content + '\r\n')
  }
}
```

#### 4. 组件使用
```vue
<AIChatSessionWithTools
  :connection-id="actualConnectionId"
  :enable-tools="true"
  :server-info="serverInfo"
  @tool-executed="handleToolExecuted"
  <!-- 其他 props -->
/>
```

## 💡 使用建议

### 1. 清晰的任务描述

✅ **好的描述**:
```
查看 /var/log/nginx 目录下最新的错误日志，
找出过去 1 小时内的所有 500 错误
```

❌ **不好的描述**:
```
看看日志
```

### 2. 分步骤验证

对于复杂任务，让 AI 一步步执行：
```
先检查 Nginx 配置是否正确，
然后测试配置，
如果没问题就重启 Nginx
```

### 3. 明确限制

如果需要限制操作范围：
```
只查看前 10 行日志
```
```
只列出 .conf 文件
```

### 4. 提供上下文

```
我的应用部署在 /var/www/app 目录，
使用 PM2 管理进程，
帮我检查进程状态
```

## 🐛 故障排查

### 问题 1: AI 不使用工具

**可能原因**:
- AI 模型不支持工具调用
- 任务描述不够清晰

**解决方案**:
- 使用 GPT-4 或 Claude 等高级模型
- 明确告诉 AI 要执行命令

### 问题 2: 命令执行失败

**可能原因**:
- SSH 连接已断开
- 权限不足
- 命令语法错误

**解决方案**:
- 检查连接状态
- 使用 `sudo` 提升权限
- 让 AI 修正命令

### 问题 3: 批准对话框不显示

**可能原因**:
- 浏览器弹窗被阻止

**解决方案**:
- 检查浏览器设置
- 刷新页面重试

## 📚 更多资源

- 📖 [完整使用指南](./TOOLS_USAGE.md)
- 🚀 [快速入门](./QUICKSTART.md)
- 🏗️ [实现详解](./TOOLS_IMPLEMENTATION_SUMMARY.md)

## 🎉 开始使用

1. ✅ 打开一个 SSH 连接
2. ✅ 点击 🤖 图标打开 AI 助手
3. ✅ 配置 AI 模型（在设置中）
4. ✅ 开始对话，让 AI 帮你执行命令！

---

**享受智能 SSH 终端体验！** 🚀

