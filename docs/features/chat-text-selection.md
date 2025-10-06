# AI 会话内容文本选择功能

## 功能说明

现在 AI 助手会话中的所有内容都可以被选中和复制。

## 实现方式

为所有消息相关的元素添加了 `user-select: text` CSS 属性：

### 覆盖范围

| 元素 | 说明 |
|------|------|
| `.messages-area` | 整个消息区域 |
| `.message-container` | 消息容器 |
| `.message-body` | 消息体（包含 `cursor: text`） |
| `.message-content` | 消息内容 |
| `p` 标签 | 段落文本 |
| `code` 标签 | 内联代码 |
| `pre` 标签 | 预格式化文本 |
| `.code-block` | 代码块 |
| `.tool-use-block` | 工具调用块 |
| `.param-value` | 工具参数值 |
| `.tool-output` | 工具输出 |
| `.tool-error` | 错误消息 |

### 关键 CSS

```css
/* 消息体 */
.message-body {
  padding-left: 12px;
  user-select: text;
  cursor: text;  /* 鼠标悬停显示文本光标 */
}

/* 消息内容 */
.message-content {
  line-height: 1.6;
  word-wrap: break-word;
  user-select: text;
}

/* 代码块 */
.message-content :deep(.code-block) {
  /* ... 其他样式 ... */
  user-select: text;
}

/* 工具输出 */
.tool-output {
  /* ... 其他样式 ... */
  user-select: text;
}
```

## 用户体验

### 使用方式

1. **选择文本**
   - 鼠标拖动选择任意文本
   - 双击选择单词
   - 三击选择整行
   - Ctrl+A 选择所有内容

2. **复制文本**
   - Ctrl+C 复制选中的文本
   - 右键菜单 → 复制（如果浏览器支持）

3. **光标提示**
   - 鼠标悬停在文本上会显示文本光标（I 型）
   - 明确提示用户该区域可以选择文本

### 适用场景

- ✅ 复制 AI 的解释说明
- ✅ 复制代码片段
- ✅ 复制命令行输出
- ✅ 复制错误信息
- ✅ 复制工具调用参数
- ✅ 选择部分内容进行搜索

### 交互体验

- 选择操作不会影响其他交互（如按钮点击）
- 滚动条仍然可以正常使用
- 不影响消息的展开/折叠等交互

## 技术细节

### CSS 属性

```css
user-select: text;  /* 允许用户选择文本 */
cursor: text;       /* 显示文本光标 */
```

### 浏览器兼容性

`user-select` 属性在所有现代浏览器中都得到支持：
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Electron (基于 Chromium)

### 为什么需要显式设置

某些情况下，父元素或全局样式可能设置了：
- `user-select: none` - 禁止选择
- `pointer-events: none` - 禁止指针事件

显式设置 `user-select: text` 可以覆盖这些设置，确保文本可以被选中。

## 相关文件

- `apps/desktop/src/components/chat/AIChatSessionWithTools.vue` - AI 会话组件

## 修改记录

- **2025-01-XX**: 初始实现，为所有消息内容添加文本选择功能

