# 🚀 AI 工具调用系统 - 快速入门

10 分钟快速上手 AI SSH 助手！

## ⚡ 3 步快速开始

### 步骤 1: 导入组件

```vue
<script setup lang="ts">
import AIChatSessionWithTools from '@/components/chat/AIChatSessionWithTools.vue'
</script>
```

### 步骤 2: 添加到模板

```vue
<template>
  <AIChatSessionWithTools
    :connection-id="yourSSHConnectionId"
    :current-provider="yourAIProvider"
    :current-model="yourAIModel"
    :enable-tools="true"
  />
</template>
```

### 步骤 3: 开始对话

```
你: 帮我查看服务器磁盘使用情况
AI: [执行 df -h 命令]
```

就这么简单！🎉

## 📝 完整示例

```vue
<template>
  <div class="h-screen">
    <AIChatSessionWithTools
      :messages="messages"
      :connection-id="connectionId"
      :current-provider="provider"
      :current-model="model"
      :enable-tools="true"
      :server-info="{ host: '192.168.1.100', username: 'root' }"
      @update:messages="messages = $event"
      @tool-executed="handleToolExecuted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AIChatSessionWithTools from '@/components/chat/AIChatSessionWithTools.vue'

// 消息列表
const messages = ref([])

// SSH 连接 ID
const connectionId = ref('your-connection-id')

// AI 配置
const provider = ref({
  id: 'openai',
  name: 'OpenAI',
  endpoint: 'https://api.openai.com/v1',
  apiKey: 'your-api-key'
})

const model = ref({
  id: 'gpt-4',
  name: 'GPT-4'
})

// 工具执行回调
const handleToolExecuted = (toolName, result) => {
  console.log(`工具 ${toolName} 执行完成:`, result)
}
</script>
```

## 🎯 常见使用场景

### 场景 1: 系统诊断

```
你: 帮我诊断服务器性能问题

AI 会自动：
1. 检查 CPU 使用率
2. 检查内存使用
3. 检查磁盘 I/O
4. 检查网络连接
5. 生成诊断报告
```

### 场景 2: 日志分析

```
你: 分析 Nginx 错误日志中的 500 错误

AI 会自动：
1. 找到错误日志文件
2. 过滤 500 错误
3. 统计错误频率
4. 分析错误原因
5. 提供修复建议
```

### 场景 3: 应用部署

```
你: 部署一个 Python Flask 应用

AI 会自动：
1. 检查 Python 环境
2. 创建虚拟环境
3. 安装依赖
4. 配置 Gunicorn
5. 启动应用
6. 配置 Nginx 反向代理
```

## 🛠️ 可用工具

| 工具 | 说明 | 示例 |
|------|------|------|
| `execute_ssh_command` | 执行 SSH 命令 | 查看进程、管理服务 |
| `read_file` | 读取文件内容 | 查看配置文件、日志 |
| `list_files` | 列出目录文件 | 浏览目录结构 |
| `ask_followup_question` | 询问用户 | 获取额外信息 |
| `attempt_completion` | 完成任务 | 展示最终结果 |

## 💡 实用提示

### 提示 1: 清晰描述任务

✅ **好**:
```
检查 Nginx 是否在运行，如果没有就启动它
```

❌ **不好**:
```
nginx
```

### 提示 2: 提供上下文

✅ **好**:
```
我的应用部署在 /var/www/app 目录，帮我检查 PM2 进程状态
```

❌ **不好**:
```
检查进程
```

### 提示 3: 逐步验证

对于复杂任务，让 AI 分步执行并验证每一步。

## 🔒 安全最佳实践

1. **审查所有命令** - 在批准前仔细查看
2. **测试环境优先** - 先在测试服务器上试用
3. **备份重要数据** - 执行危险操作前备份
4. **使用受限账户** - 不要使用 root 账户
5. **监控执行结果** - 关注工具执行的输出

## ⚙️ 配置选项

### 基本配置

```vue
<AIChatSessionWithTools
  :enable-tools="true"          <!-- 启用工具 -->
  :show-toolbar="true"          <!-- 显示工具栏 -->
  :show-copy-button="true"      <!-- 显示复制按钮 -->
  :auto-scroll="true"           <!-- 自动滚动 -->
  :multiline="false"            <!-- 单行输入 -->
/>
```

### 高级配置

```vue
<AIChatSessionWithTools
  :server-info="{
    host: '192.168.1.100',
    username: 'deploy'
  }"
  :session-name="'生产服务器诊断'"
  empty-state-text="开始 AI 辅助运维"
  input-placeholder="描述你的需求..."
  @tool-executed="onToolExecuted"
  @send-message="onSendMessage"
/>
```

## 🐛 常见问题

### Q: 工具调用不显示批准对话框？

**A**: 检查 `enable-tools` 是否设置为 `true`

### Q: SSH 命令执行失败？

**A**: 确认 `connection-id` 已正确传入且连接有效

### Q: AI 不使用工具？

**A**: 确保提供了明确的任务描述，AI 需要理解你想要完成什么

### Q: 如何添加自定义工具？

**A**: 查看 [TOOLS_USAGE.md](./TOOLS_USAGE.md) 的"扩展工具"章节

## 📚 深入学习

- 📖 [完整使用指南](./TOOLS_USAGE.md)
- 🏗️ [实现架构文档](./TOOLS_IMPLEMENTATION_SUMMARY.md)
- 📋 [Roo-Code 分析](../../Roo-Code会话实现分析.md)

## 🎬 下一步

1. ✅ 尝试基本命令执行
2. ✅ 探索不同的工具
3. ✅ 处理复杂的多步骤任务
4. ✅ 自定义工具和提示词
5. ✅ 集成到你的工作流

## 💬 需要帮助？

- 💡 查看示例代码
- 📖 阅读完整文档
- 🐛 提交 Issue
- 💪 贡献代码

---

**开始你的 AI 运维之旅！** 🚀

