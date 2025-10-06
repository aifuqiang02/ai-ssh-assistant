# Auto Keep All 扩展

自动点击 Cursor AI 的 "Keep All" 按钮，保持所有 AI 建议的更改。

## 安装方法

### 方法 1：使用自定义扩展（推荐）

1. 扩展文件已创建在 `.vscode/extensions/auto-keep-all/` 目录
2. 重启 Cursor
3. 扩展将自动加载并开始工作

### 方法 2：手动在控制台执行（临时方案）

如果扩展方式不工作，可以：

1. 按 `Ctrl+Shift+I` (Windows/Linux) 或 `Cmd+Option+I` (Mac) 打开开发者工具
2. 切换到 Console 标签
3. 粘贴并执行以下脚本：

\`\`\`javascript
function checkAndClickButtons() {
    const container1 = document.querySelector('.pure-ai-prompt-bar');
    if (container1) {
        const button1 = container1.querySelector(
            '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-button'
        );
        if (button1) {
            console.log('点击 pure-ai-prompt-bar 中的 anysphere-button');
            button1.click();
        }
    }

    const container2 = document.querySelector('.aiFullFilePromptBarWidget');
    if (container2) {
        const button2 = container2.querySelector(
            '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-text-button'
        );
        if (button2) {
            console.log('点击 aiFullFilePromptBarWidget 中的 anysphere-text-button');
            button2.click();
        }
    }
}

window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 1000);
console.log('Auto Keep All 已启动！');
\`\`\`

### 方法 3：使用启动脚本（最佳方案）

创建一个启动脚本文件：

\`\`\`bash
# .vscode/auto-keep-all.sh
#!/bin/bash
echo "等待 Cursor 启动..."
sleep 5
echo "注入 Auto Keep All 脚本..."
# 这里需要使用 Chrome DevTools Protocol 来注入脚本
\`\`\`

## 命令

- `Toggle Auto Keep All`: 切换自动点击功能的开关

## 停止脚本

在控制台执行：
\`\`\`javascript
clearInterval(window.__autoKeepAllInterval);
console.log('Auto Keep All 已停止');
\`\`\`

## 注意事项

- 脚本每秒检查一次是否有 "Keep All" 按钮出现
- 如果找到按钮，会自动点击
- 不会影响正常的编辑器功能

## 故障排除

如果扩展不工作：
1. 检查控制台是否有错误信息
2. 确认 Cursor 版本兼容性
3. 尝试方法 2 手动执行脚本

