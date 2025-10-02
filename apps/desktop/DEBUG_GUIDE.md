# 🐛 错误调试指南

本项目内置了自动错误收集和日志导出系统，可以快速将错误信息发送给 AI 助手进行分析和修复。

## 📋 快速开始

### 1️⃣ 遇到错误时

当你遇到任何错误或问题时，运行以下命令：

```bash
npm run debug
```

这个命令会自动：
- ✅ 收集后端（Electron 主进程）的所有错误日志
- ✅ 收集前端（渲染进程）的所有错误日志
- ✅ 生成一个格式化的 Markdown 报告：`DEBUG_LOGS.md`

### 2️⃣ 发送给 AI

1. 打开生成的 `DEBUG_LOGS.md` 文件
2. **完整复制**文件内容
3. 粘贴给 AI 助手（如 Cursor AI、ChatGPT 等）
4. 简单描述你遇到的问题

AI 会自动分析错误日志并提供修复方案！

### 3️⃣ 清理日志（可选）

修复问题后，可以清理旧的日志文件：

```bash
npm run clear-logs
```

## 🔍 错误收集机制

### 后端错误收集

自动拦截以下错误类型：
- `console.error()` - 所有控制台错误
- `uncaughtException` - 未捕获的异常
- `unhandledRejection` - 未处理的 Promise 拒绝

日志文件位置：
- **Windows**: `%APPDATA%/ai-ssh-assistant/logs/error-logs.json`
- **macOS**: `~/Library/Application Support/ai-ssh-assistant/logs/error-logs.json`
- **Linux**: `~/.config/ai-ssh-assistant/logs/error-logs.json`

### 前端错误收集

自动拦截以下错误类型：
- `window.error` - 全局 JavaScript 错误
- `unhandledRejection` - 未处理的 Promise 错误
- `console.error()` - 控制台错误
- `Vue.errorHandler` - Vue 组件错误

日志保存在：
- LocalStorage（备份）
- 项目目录：`logs/frontend-errors.json`

## 💡 使用技巧

### 在开发模式下查看实时错误

打开浏览器控制台，输入：

```javascript
window.__errorCollector.getErrors()
```

查看所有收集到的错误。

### 导出 JSON 格式

```javascript
window.__errorCollector.exportAsJSON()
```

### 手动记录错误

```javascript
window.__errorCollector.logError('自定义错误消息', '堆栈信息')
```

### 清空错误日志

```javascript
window.__errorCollector.clearErrors()
```

## 📊 错误统计

查看错误统计信息：

```javascript
window.__errorCollector.getStats()
```

输出示例：
```json
{
  "total": 5,
  "byType": {
    "console.error": 3,
    "window.error": 2
  },
  "latest": { ... },
  "oldestTimestamp": "2024-01-01T10:00:00.000Z",
  "newestTimestamp": "2024-01-01T10:05:00.000Z"
}
```

## 🎯 最佳实践

### 1. 问题复现流程

```bash
# 1. 清空旧日志
npm run clear-logs

# 2. 启动应用
npm run dev

# 3. 重现问题

# 4. 导出日志
npm run debug

# 5. 将 DEBUG_LOGS.md 发送给 AI
```

### 2. 向 AI 报告问题的模板

```
【问题描述】
简单描述你遇到的问题，比如：
- 点击"连接"按钮时应用崩溃
- 文件上传失败
- 界面显示异常

【复现步骤】
1. 打开应用
2. 点击 XXX
3. 看到 XXX 错误

【错误日志】
[粘贴 DEBUG_LOGS.md 的完整内容]
```

### 3. 常见问题

**Q: 日志文件太大怎么办？**  
A: 系统自动保留最近 100 条错误，不会无限增长。

**Q: 我的错误没有被记录？**  
A: 确保应用正在运行，重现问题后再运行 `npm run debug`。

**Q: 如何禁用错误收集？**  
A: 在浏览器控制台运行：
```javascript
window.__errorCollector.setEnabled(false)
```

**Q: 错误日志会包含敏感信息吗？**  
A: 可能包含文件路径、用户名等信息。发送给 AI 前请检查并移除敏感内容。

## 🚀 高级用法

### 自定义日志导出脚本

编辑 `scripts/export-logs.ts` 可以自定义日志格式、过滤规则等。

### 集成到 CI/CD

```yaml
# GitHub Actions 示例
- name: Export Error Logs
  if: failure()
  run: npm run debug
  
- name: Upload Logs
  uses: actions/upload-artifact@v2
  with:
    name: error-logs
    path: DEBUG_LOGS.md
```

## 📝 注意事项

1. ⚠️ **隐私保护**：日志可能包含敏感信息（如文件路径、主机名），发送前请检查
2. 🔄 **定期清理**：建议定期运行 `npm run clear-logs` 清理旧日志
3. 💾 **备份重要日志**：重要的错误日志请及时备份
4. 🐛 **仅开发使用**：生产环境建议禁用或限制日志收集

## 🤝 反馈与建议

如果这个错误收集系统帮到了你，或者你有改进建议，欢迎反馈！

---

**祝调试顺利！** 🎉

