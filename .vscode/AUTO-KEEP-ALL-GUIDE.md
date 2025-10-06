# Auto Keep All 使用指南

自动点击 Cursor AI 的 "Keep All" 按钮的完整解决方案。

## 🎯 目标

让 Cursor 在启动后自动执行脚本，定期检查并点击 "Keep All" 按钮。

## 📋 方案对比

### ✅ 方案 1：开发者工具控制台（推荐 - 最简单）

**步骤：**

1. 打开 Cursor
2. 按 `F12` 或 `Ctrl+Shift+I` 打开开发者工具
3. 切换到 `Console` 标签
4. 复制并粘贴 `.vscode/auto-keep-all-script.js` 中的内容
5. 按 `Enter` 执行

**优点：**
- ✅ 无需配置，立即生效
- ✅ 可随时启动/停止
- ✅ 100% 可靠

**缺点：**
- ❌ 每次启动 Cursor 需要手动执行
- ❌ 关闭开发者工具后失效

**控制命令：**
```javascript
// 停止
window.stopAutoKeepAll()

// 重新启动
window.startAutoKeepAll()

// 或直接清除定时器
clearInterval(window.__autoKeepAllInterval)
```

---

### 🔧 方案 2：自定义扩展（实验性）

**位置：** `.vscode/extensions/auto-keep-all/`

**安装步骤：**

1. 扩展文件已创建
2. 重启 Cursor
3. 在命令面板 (`Ctrl+Shift+P`) 输入 `Developer: Install Extension from Location`
4. 选择 `.vscode/extensions/auto-keep-all` 目录

**注意：** 由于 VS Code/Cursor 的安全限制，此方法可能无法直接操作 DOM。

---

### ⚡ 方案 3：快捷键自动执行（推荐 - 自动化）

在 `.vscode/keybindings.json` 中添加：

```json
[
  {
    "key": "ctrl+shift+k",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
      "text": "echo \"启动 Auto Keep All...\""
    },
    "when": "terminalFocus"
  }
]
```

---

### 🚀 方案 4：启动任务（最佳 - 完全自动）

在 `.vscode/tasks.json` 中添加：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Auto Keep All",
      "type": "shell",
      "command": "echo",
      "args": [
        "请打开开发者工具(F12)并在控制台执行 .vscode/auto-keep-all-script.js 中的脚本"
      ],
      "runOptions": {
        "runOn": "folderOpen"
      },
      "presentation": {
        "reveal": "always",
        "panel": "shared"
      }
    }
  ]
}
```

---

## 📝 脚本功能

脚本会：

1. ⏱️ 每秒检查一次页面
2. 🔍 查找 `.pure-ai-prompt-bar` 和 `.aiFullFilePromptBarWidget` 容器
3. 🖱️ 自动点击其中的 "Keep" 按钮
4. 📊 在控制台输出日志

---

## 🛠️ 推荐使用流程

### 日常使用（最简单）：

1. **打开项目** → Cursor 自动启动
2. **按 F12** → 打开开发者工具
3. **切换到 Console** → 找到控制台
4. **粘贴脚本** → 复制 `.vscode/auto-keep-all-script.js` 的内容
5. **按 Enter** → 脚本开始运行
6. **最小化开发者工具** → 不要关闭，只需最小化

### 高级用法（一次配置）：

创建一个书签或代码片段：

**VS Code 用户代码片段：**

文件: `.vscode/snippets.code-snippets`

```json
{
  "Auto Keep All": {
    "prefix": "autokeep",
    "body": [
      "// 粘贴到开发者工具控制台",
      "// 从 .vscode/auto-keep-all-script.js 复制内容"
    ],
    "description": "Auto Keep All 脚本提示"
  }
}
```

---

## ❓ 常见问题

### Q: 脚本会影响性能吗？
A: 不会。每秒只执行一次 DOM 查询，开销极小。

### Q: 如何知道脚本正在运行？
A: 打开开发者工具的 Console，会看到 "✅ Auto Keep All 已启动" 消息。

### Q: 脚本会自动点击所有按钮吗？
A: 不会。脚本只点击特定 class 的 "Keep" 按钮。

### Q: 如何临时停止？
A: 在控制台执行：`window.stopAutoKeepAll()`

### Q: 关闭开发者工具后还能工作吗？
A: 可以！只要不刷新页面，脚本会继续运行。建议最小化而不是关闭开发者工具。

---

## 🎨 自定义

修改检查间隔（默认 1000ms = 1秒）：

```javascript
// 改为 500ms (0.5秒)
window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 500);

// 改为 2000ms (2秒)
window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 2000);
```

---

## 📚 相关文件

- `.vscode/auto-keep-all-script.js` - 主脚本文件（复制到控制台使用）
- `.vscode/extensions/auto-keep-all/` - 自定义扩展（实验性）
- `.vscode/AUTO-KEEP-ALL-GUIDE.md` - 本指南

---

## 🆘 获取帮助

如果遇到问题：

1. 检查控制台是否有错误信息
2. 确认按钮的 class 名称是否改变（Cursor 更新可能改变）
3. 使用 Chrome DevTools 的 Elements 面板检查实际的 DOM 结构
4. 调整脚本中的选择器

---

**祝你使用愉快！🎉**

