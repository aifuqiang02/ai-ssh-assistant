# 🤖 AI 工具调用系统

基于 **Roo-Code** 实现原理的完整 AI 工具调用系统，支持通过 AI 执行 SSH 命令和文件操作。

<div align="center">

![Status](https://img.shields.io/badge/status-ready-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Based On](https://img.shields.io/badge/based%20on-Roo--Code-purple)

</div>

---

## ✨ 特性

- 🛠️ **完整的工具调用系统** - XML 格式的工具定义和执行
- 🔐 **安全的批准机制** - 所有操作需要用户确认
- 🖥️ **SSH 命令执行** - 在远程服务器上执行命令
- 📁 **文件操作** - 读取、列出文件
- ⚡ **实时进度反馈** - 显示工具执行状态
- 🎨 **美观的 UI** - VSCode 风格的界面
- 🚨 **危险命令检测** - 自动识别潜在风险
- 📝 **完整文档** - 详细的使用指南和示例

## 📦 项目结构

```
apps/desktop/
├── src/
│   ├── types/
│   │   └── tools.ts                          # 🎯 工具类型定义
│   ├── services/
│   │   └── tools/
│   │       ├── system-prompt.ts              # 📝 系统提示词生成器
│   │       └── tool-executor.ts              # ⚙️ 工具执行引擎
│   └── components/
│       └── chat/
│           ├── AIChatSessionWithTools.vue    # 💬 增强版聊天组件
│           └── ToolApprovalDialog.vue        # ✅ 工具批准对话框
├── QUICKSTART.md                             # 🚀 快速入门
├── TOOLS_USAGE.md                            # 📖 完整使用指南
├── TOOLS_IMPLEMENTATION_SUMMARY.md           # 🏗️ 实现总结
└── README_TOOLS.md                           # 📋 本文档
```

## 🚀 快速开始

### 1. 查看快速入门

```bash
# 查看快速入门指南
cat QUICKSTART.md
```

**10 分钟快速上手！**

### 2. 基本使用

```vue
<template>
  <AIChatSessionWithTools
    :connection-id="sshConnectionId"
    :current-provider="provider"
    :current-model="model"
    :enable-tools="true"
  />
</template>
```

### 3. 开始对话

```
你: 帮我查看服务器磁盘使用情况
AI: [自动执行 df -h 命令]
你: 分析 Nginx 错误日志
AI: [读取并分析日志文件]
```

## 📚 文档导航

### 🎓 学习路径

1. **完全新手** → 从 [QUICKSTART.md](./QUICKSTART.md) 开始
2. **想深入使用** → 阅读 [TOOLS_USAGE.md](./TOOLS_USAGE.md)
3. **了解实现原理** → 查看 [TOOLS_IMPLEMENTATION_SUMMARY.md](./TOOLS_IMPLEMENTATION_SUMMARY.md)
4. **理解 Roo-Code** → 参考 [Roo-Code会话实现分析.md](../../Roo-Code会话实现分析.md)

### 📖 文档说明

| 文档 | 内容 | 适合人群 |
|------|------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | 10分钟快速入门 | 初学者 |
| [TOOLS_USAGE.md](./TOOLS_USAGE.md) | 完整使用指南、API 参考 | 所有用户 |
| [TOOLS_IMPLEMENTATION_SUMMARY.md](./TOOLS_IMPLEMENTATION_SUMMARY.md) | 架构设计、实现细节 | 开发者 |
| [README_TOOLS.md](./README_TOOLS.md) | 项目概览（本文档） | 所有人 |

## 🎯 核心概念

### 工具调用流程

```
用户输入 → AI 生成工具调用 → 用户批准 → 执行工具 → 返回结果 → AI 分析结果
```

### 工具格式（XML）

```xml
<execute_ssh_command>
<command>ls -la</command>
</execute_ssh_command>
```

### 系统提示词

自动生成包含工具描述的提示词，指导 AI 正确使用工具。

## 🛠️ 可用工具

| 工具 | 功能 | 危险级别 |
|------|------|----------|
| `execute_ssh_command` | 执行 SSH 命令 | ⚠️ 取决于命令 |
| `read_file` | 读取文件内容 | ✅ 安全 |
| `list_files` | 列出目录文件 | ✅ 安全 |
| `ask_followup_question` | 询问用户 | ✅ 安全 |
| `attempt_completion` | 完成任务 | ✅ 安全 |

## 💻 代码示例

### 基础使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import AIChatSessionWithTools from '@/components/chat/AIChatSessionWithTools.vue'

const connectionId = ref('ssh-connection-1')
const messages = ref([])

const provider = ref({
  id: 'openai',
  name: 'OpenAI',
  endpoint: 'https://api.openai.com/v1',
  apiKey: 'sk-...'
})

const model = ref({
  id: 'gpt-4',
  name: 'GPT-4'
})
</script>

<template>
  <AIChatSessionWithTools
    v-model:messages="messages"
    :connection-id="connectionId"
    :current-provider="provider"
    :current-model="model"
    :enable-tools="true"
    :server-info="{ host: '192.168.1.100', username: 'root' }"
  />
</template>
```

### 处理工具执行事件

```typescript
const handleToolExecuted = (toolName: string, result: any) => {
  if (!result.success) {
    // 处理错误
    console.error(`Tool ${toolName} failed:`, result.error)
    showNotification({
      type: 'error',
      message: result.error
    })
  } else {
    // 记录成功
    console.log(`Tool ${toolName} succeeded`)
  }
}
```

### 自定义配置

```vue
<AIChatSessionWithTools
  :enable-tools="true"
  :show-toolbar="true"
  :show-copy-button="true"
  :auto-scroll="true"
  :multiline="true"
  :input-rows="4"
  input-placeholder="告诉 AI 你想做什么..."
  empty-state-text="开始智能运维"
  @tool-executed="handleToolExecuted"
  @send-message="handleSendMessage"
  @clear-messages="handleClearMessages"
/>
```

## 🎬 使用场景

### 场景 1: 系统诊断 🔍

```
你: 服务器响应很慢，帮我诊断一下

AI 会自动：
✓ 检查 CPU 和内存使用
✓ 检查磁盘 I/O
✓ 检查网络连接
✓ 查看系统日志
✓ 生成诊断报告
```

### 场景 2: 应用部署 🚀

```
你: 帮我部署一个 Node.js 应用

AI 会自动：
✓ 检查 Node.js 环境
✓ 克隆代码仓库
✓ 安装依赖
✓ 配置 PM2
✓ 设置开机自启
✓ 配置 Nginx 反向代理
```

### 场景 3: 日志分析 📊

```
你: 分析最近一小时的错误日志

AI 会自动：
✓ 定位日志文件
✓ 过滤错误信息
✓ 统计错误类型
✓ 分析错误原因
✓ 提供修复建议
```

## 🔒 安全特性

### 已实现

- ✅ **强制批准** - 所有工具调用需要用户确认
- ✅ **危险命令检测** - 自动识别 `rm -rf`, `dd` 等
- ✅ **可视化参数** - 清晰展示将要执行的操作
- ✅ **用户反馈** - 可以修改或限制命令
- ✅ **连接验证** - 确保 SSH 连接有效

### 推荐实践

1. 🔐 使用受限权限账户，不要用 root
2. 🔐 在测试环境先验证
3. 🔐 定期备份重要数据
4. 🔐 审查所有 AI 生成的命令
5. 🔐 记录操作审计日志

## 📊 技术栈

- **Vue 3** - 组件框架
- **TypeScript** - 类型安全
- **Marked** - Markdown 渲染
- **Highlight.js** - 代码高亮
- **Tailwind CSS** - 样式框架

## 🔧 扩展开发

### 添加新工具

1. 在 `tools.ts` 添加工具类型
2. 在 `system-prompt.ts` 添加工具描述
3. 在 `tool-executor.ts` 实现工具逻辑
4. 测试工具功能

详见 [TOOLS_USAGE.md](./TOOLS_USAGE.md) 的扩展章节。

### 自定义系统提示词

```typescript
import { generateSystemPrompt } from '@/services/tools/system-prompt'

const customPrompt = generateSystemPrompt({
  enableSSH: true,
  enableFileOps: true,
  serverInfo: {
    host: '192.168.1.100',
    username: 'deploy'
  }
})
```

## 🎓 学习资源

### 内部文档

- 📖 [快速入门](./QUICKSTART.md)
- 📖 [使用指南](./TOOLS_USAGE.md)
- 📖 [实现总结](./TOOLS_IMPLEMENTATION_SUMMARY.md)

### 外部参考

- 🔗 [Roo-Code GitHub](https://github.com/RooCodeInc/Roo-Code)
- 🔗 [Roo-Code 会话分析](../../Roo-Code会话实现分析.md)
- 🔗 [Anthropic Tool Use](https://docs.anthropic.com/claude/docs/tool-use)

## 🐛 故障排查

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 工具调用未被识别 | 检查 XML 格式和工具名称 |
| SSH 连接失败 | 验证 `connectionId` 和连接状态 |
| 批准对话框不显示 | 确认 `enableTools` 为 `true` |
| AI 不使用工具 | 提供更明确的任务描述 |

详细故障排查请查看 [TOOLS_USAGE.md](./TOOLS_USAGE.md)。

## 📈 性能指标

- ⚡ 工具解析: < 10ms
- ⚡ UI 更新: < 16ms (60fps)
- ⚡ SSH 命令执行: 取决于命令和网络

## 🗺️ 路线图

### v1.1 (计划中)

- [ ] 命令历史和快速重复
- [ ] 工具结果导出
- [ ] 批量文件操作
- [ ] 更多系统诊断工具

### v1.2 (规划中)

- [ ] 消息持久化 (IndexedDB)
- [ ] 自动批准规则配置
- [ ] 工具链（串联执行）
- [ ] Checkpoint 功能

### v2.0 (愿景)

- [ ] 子任务支持
- [ ] MCP 集成
- [ ] 插件系统
- [ ] 多服务器并行操作
- [ ] 可视化工作流

## 🤝 贡献

欢迎贡献！请查看贡献指南：

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 开启 Pull Request

## 📝 更新日志

### v1.0.0 (2025-01-XX)

- ✨ 初始发布
- ✨ 实现基础工具调用系统
- ✨ SSH 命令执行支持
- ✨ 工具批准机制
- ✨ 危险命令检测
- 📚 完整文档

## 📄 许可证

MIT License

---

## 🎯 快速链接

- 🚀 [10分钟快速入门](./QUICKSTART.md)
- 📖 [完整使用指南](./TOOLS_USAGE.md)
- 🏗️ [实现架构文档](./TOOLS_IMPLEMENTATION_SUMMARY.md)
- 💬 [提交 Issue](https://github.com/your-repo/issues)

---

<div align="center">

**基于 Roo-Code 实现原理** | **Made with ❤️ by AI Assistant**

[开始使用](./QUICKSTART.md) · [查看文档](./TOOLS_USAGE.md) · [了解实现](./TOOLS_IMPLEMENTATION_SUMMARY.md)

</div>

