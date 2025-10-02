# 🚀 快速调试指南

## 遇到错误？三步搞定！

### 步骤 1: 导出日志 📊
```bash
npm run debug
```

### 步骤 2: 打开报告 📄
打开生成的 `DEBUG_LOGS.md` 文件

### 步骤 3: 发送给 AI 🤖
复制全部内容，粘贴给 AI 助手，并简单描述问题

---

## 示例对话

```
我：下载文件时出现错误，这是日志：

[粘贴 DEBUG_LOGS.md 内容]

AI：我看到问题了！错误是因为...
   需要修改 XXX 文件...
   这是修复代码...
```

---

## 其他命令

清空旧日志：
```bash
npm run clear-logs
```

查看实时错误（开发模式下在浏览器控制台）：
```javascript
window.__errorCollector.getErrors()
```

---

**详细文档**: 查看 [DEBUG_GUIDE.md](./DEBUG_GUIDE.md)

