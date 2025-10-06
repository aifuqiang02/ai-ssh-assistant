# UI 重新设计 - AIChatSessionWithTools

## 概述

基于 Roo-Code 的优秀 UI 设计，我们对 `AIChatSessionWithTools` 组件进行了完全重构，提供更现代、更专业的聊天界面体验。

## 主要改进

### 1. 视觉设计

- **消息分离**：用户消息和 AI 消息有清晰的视觉区分
- **角色标识**：每条消息都有图标和角色名称（用户/AI 助手）
- **时间戳**：AI 消息显示生成时间
- **动画效果**：消息淡入动画，提升用户体验

### 2. 工具调用可视化

- **工具块设计**：工具调用以独立的卡片形式展示
- **图标识别**：不同工具类型有专属图标
  - 🖥️ SSH 命令执行
  - 📄 文件读取
  - 📁 目录列表
- **参数展示**：清晰展示工具调用的参数
- **结果反馈**：成功/失败状态一目了然

### 3. 代码高亮

- 使用 `highlight.js` 进行代码语法高亮
- 支持多种编程语言
- 深色主题（vs2015）与 VSCode 风格一致

### 4. Markdown 渲染

- 完整的 Markdown 支持
- 代码块自动高亮
- 行内代码样式优化
- 链接和列表正确渲染

### 5. 交互优化

- **键盘快捷键**：Ctrl+Enter 发送消息
- **自动滚动**：新消息自动滚动到可见区域
- **加载状态**：AI 生成时显示优雅的加载动画
- **工具进度**：工具执行时显示实时进度

## 组件结构

```
AIChatSessionWithTools
├── messages-area（消息列表区）
│   ├── empty-state（空状态）
│   └── messages-list
│       └── message-row
│           ├── message-header（头部：图标+角色+时间）
│           └── message-body
│               ├── message-content（普通消息）
│               ├── tool-use-block（工具调用）
│               │   ├── tool-header
│               │   ├── tool-params
│               │   └── tool-result
│               └── message-loading（加载中）
├── tool-progress（工具执行进度）
└── input-area（输入区域）
    └── input-container
        ├── message-input（多行输入框）
        └── input-actions
            └── send-button（发送按钮）
```

## 样式系统

### VSCode 主题变量

使用 VSCode 的 CSS 变量确保与编辑器主题一致：

```css
/* 背景色 */
--vscode-editor-background
--vscode-editorGroupHeader-tabsBackground

/* 前景色 */
--vscode-foreground
--vscode-descriptionForeground

/* 边框 */
--vscode-editorGroup-border
--vscode-focusBorder

/* 按钮 */
--vscode-button-background
--vscode-button-hoverBackground

/* 状态颜色 */
--vscode-charts-blue      /* 用户消息 */
--vscode-charts-green     /* AI 消息 */
--vscode-charts-purple    /* 工具调用 */
--vscode-errorForeground  /* 错误信息 */
```

### 颜色语义

- **蓝色**：用户相关（图标、加载指示器）
- **绿色**：AI 相关（图标、成功状态）
- **紫色**：工具相关（工具图标）
- **红色**：错误状态
- **黄色**：警告信息

## 使用示例

```vue
<template>
  <AIChatSessionWithTools
    :current-provider="provider"
    :current-model="model"
    :connection-id="sshConnectionId"
    :enable-tools="true"
    :server-info="{
      host: '110.42.111.221',
      username: 'root'
    }"
    :multiline="true"
    :input-rows="3"
    input-placeholder="向AI助手提问..."
    empty-state-text="SSH终端AI助手"
    empty-state-subtext="可以通过AI执行SSH命令、读取文件等操作"
    @tool-executed="handleToolExecuted"
  />
</template>
```

## 关键特性

### 1. 自适应高度

消息区域高度自适应，支持自定义最大高度：

```vue
<AIChatSessionWithTools
  max-height="calc(100vh - 200px)"
/>
```

### 2. 流式输出

AI 响应采用流式输出，实时显示生成的内容：

```typescript
const response = await chatCompletion(
  provider,
  model,
  {
    messages: apiMessages,
    stream: true
  },
  (chunk) => {
    assistantMessage.content += chunk.content || ''
    // 触发响应式更新
    internalMessages.value = [...internalMessages.value]
    scrollToBottom()
  }
)
```

### 3. 工具执行流程

```
用户输入 → AI 解析 → 检测工具调用 
  ↓
显示工具批准对话框
  ↓
用户批准 → 执行工具 → 显示结果
  ↓
AI 继续处理结果
```

## 性能优化

1. **计算属性缓存**：使用 `computed` 缓存消息列表
2. **条件渲染**：使用 `v-if` 避免不必要的渲染
3. **事件防抖**：输入事件使用防抖处理
4. **虚拟滚动**：大量消息时可考虑虚拟滚动（未实现）

## 可访问性

- 使用语义化的 HTML 标签
- 图标添加 `aria-label`
- 按钮有清晰的悬停提示
- 键盘导航支持

## 未来改进

- [ ] 消息编辑功能
- [ ] 消息删除功能
- [ ] 消息搜索
- [ ] 代码复制按钮
- [ ] 图片附件支持
- [ ] 虚拟滚动优化
- [ ] 主题切换动画
- [ ] 消息导出功能

## 技术栈

- **Vue 3**：组合式 API
- **TypeScript**：类型安全
- **Marked**：Markdown 解析
- **Highlight.js**：代码高亮
- **Bootstrap Icons**：图标库

## 参考资源

- [Roo-Code ChatView](https://github.com/RooVetGit/Roo-Cline)
- [VSCode Webview UI Toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit)
- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)


