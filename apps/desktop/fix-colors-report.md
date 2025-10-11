# 硬编码颜色修复报告

## 📋 检查进度

### ✅ 已完成
- [x] `apps/desktop/src/components/layout/AppTitleBar.vue` - 2处
- [x] `apps/desktop/src/components/layout/AppSidebar.vue` - 2处  
- [x] `apps/desktop/src/components/layout/AppStatusBar.vue` - 无硬编码
- [x] `apps/desktop/src/components/layout/RightPanel.vue` - 无硬编码
- [x] `apps/desktop/src/views/SettingsView.vue` - 10+处

### 🔄 待处理
- [ ] `apps/desktop/src/views/TerminalView.vue` - 10处
- [ ] `apps/desktop/src/views/PromptOptimizerView.vue` - 3处
- [ ] `apps/desktop/src/views/SessionSettingsView.vue` - 2处
- [ ] `apps/desktop/src/views/FileManagerView.vue` - 24处
- [ ] 聊天组件
- [ ] SSH组件
- [ ] 通用组件

## 🔍 常见硬编码颜色替换表

| 硬编码颜色 | 推荐主题变量 | 用途 |
|-----------|------------|------|
| `#ffffff`, `white` | `var(--vscode-button-foreground)` | 按钮文字 |
| `#000000`, `black` | `var(--vscode-editor-background)` | 深色背景 |
| `#e74c3c`, `#f44747` | `var(--vscode-error)` | 错误色 |
| `#27ae60`, `#2EA043` | `var(--vscode-editorGutter-addedBackground)` | 成功色 |
| `#3498db`, `#0078D4` | `var(--vscode-button-background)` | 主色调 |
| `rgba(0,0,0,0.5)` | 保留（遮罩层） | 半透明遮罩 |
| `rgba(255,255,255,0.1)` | `var(--vscode-list-hoverBackground)` | 悬停效果 |

## 📝 修复原则

1. **按钮颜色** - 使用 `--vscode-button-*` 系列变量
2. **状态色** - 使用 `--vscode-editorGutter-*Background` 系列
3. **背景色** - 使用 `--vscode-editor-background` 或 `--vscode-bg`
4. **文字色** - 使用 `--vscode-foreground` 或 `--vscode-fg`
5. **边框色** - 使用 `--vscode-panel-border` 或 `--vscode-border`
6. **半透明遮罩** - 可保留 `rgba(0,0,0,0.5)` 等

## ⚠️ 注意事项

- 半透明遮罩层（modal overlay）通常保留黑色半透明
- 阴影（box-shadow）中的颜色可以保留
- 某些特殊效果的渐变色可能需要保留

## 🎯 下一步

继续处理剩余文件，重点关注：
1. TerminalView.vue
2. FileManagerView.vue  
3. 聊天相关组件
4. SSH相关组件

