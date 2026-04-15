# VSCode 主题变量快速参考

## 🎨 最常用的 20 个变量

### 背景色（8个）

```css
/* 编辑器/主内容区 */
--vscode-editor-background

/* 侧边栏 */
--vscode-sideBar-background

/* 面板 */
--vscode-panel-background

/* 输入框 */
--vscode-input-background

/* 下拉框 */
--vscode-dropdown-background

/* 标题栏 */
--vscode-titleBar-activeBackground

/* 状态栏 */
--vscode-statusBar-background

/* Widget/弹窗 */
--vscode-editorWidget-background
```

### 前景色/文字（4个）

```css
/* 主文字 */
--vscode-foreground

/* 编辑器文字 */
--vscode-editor-foreground

/* 次要文字 */
--vscode-descriptionForeground

/* 错误文字 */
--vscode-errorForeground
```

### 边框（3个）

```css
/* 面板边框 */
--vscode-panel-border

/* 输入框边框 */
--vscode-input-border

/* 焦点边框 */
--vscode-focusBorder
```

### 按钮（5个）

```css
/* 主按钮背景 */
--vscode-button-background

/* 主按钮文字 */
--vscode-button-foreground

/* 主按钮悬停 */
--vscode-button-hoverBackground

/* 次要按钮背景 */
--vscode-button-secondaryBackground

/* 次要按钮文字 */
--vscode-button-secondaryForeground
```

## 📝 使用模板

### 卡片组件

```css
.card {
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-panel-border);
  color: var(--vscode-editor-foreground);
}
```

### 输入框

```css
.input {
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
}

.input:focus {
  border-color: var(--vscode-focusBorder);
}
```

### 按钮

```css
/* 主按钮 */
.btn-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.btn-primary:hover {
  background: var(--vscode-button-hoverBackground);
}

/* 次要按钮 */
.btn-secondary {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}
```

### 侧边栏

```css
.sidebar {
  background: var(--vscode-sideBar-background);
  color: var(--vscode-sideBar-foreground);
  border-right: 1px solid var(--vscode-sideBar-border);
}
```

### 标题栏

```css
.titlebar {
  background: var(--vscode-titleBar-activeBackground);
  color: var(--vscode-titleBar-activeForeground);
  border-bottom: 1px solid var(--vscode-titleBar-border);
}
```

## 🎯 快速决策树

```
需要设置颜色？
├─ 是背景色？
│  ├─ 主内容区 → --vscode-editor-background
│  ├─ 侧边栏 → --vscode-sideBar-background
│  ├─ 输入框 → --vscode-input-background
│  └─ 按钮 → --vscode-button-background
│
├─ 是文字颜色？
│  ├─ 主文字 → --vscode-foreground
│  ├─ 次要文字 → --vscode-descriptionForeground
│  └─ 错误文字 → --vscode-errorForeground
│
├─ 是边框？
│  ├─ 普通边框 → --vscode-panel-border
│  └─ 焦点边框 → --vscode-focusBorder
│
└─ 是状态色？
   ├─ 成功/新增 → --vscode-editorGutter-addedBackground
   ├─ 修改 → --vscode-editorGutter-modifiedBackground
   └─ 错误/删除 → --vscode-editorGutter-deletedBackground
```

## 🔍 变量命名规则

```
--vscode-{组件}-{属性}

组件:
- editor (编辑器)
- sideBar (侧边栏)
- panel (面板)
- button (按钮)
- input (输入框)
- dropdown (下拉框)
- tab (标签页)
- titleBar (标题栏)
- statusBar (状态栏)

属性:
- background (背景)
- foreground (前景/文字)
- border (边框)
- hoverBackground (悬停背景)
- activeForeground (活动前景)
```

## ⚡ 记忆技巧

### 1. 背景色都以 `background` 结尾
```css
--vscode-editor-background
--vscode-sideBar-background
--vscode-input-background
```

### 2. 文字色都以 `foreground` 结尾
```css
--vscode-foreground
--vscode-editor-foreground
--vscode-descriptionForeground
```

### 3. 边框都包含 `border`
```css
--vscode-panel-border
--vscode-input-border
--vscode-focusBorder
```

### 4. 按钮变量都以 `button-` 开头
```css
--vscode-button-background
--vscode-button-foreground
--vscode-button-hoverBackground
```

## 🚫 常见错误

### ❌ 错误 1: 硬编码颜色
```css
/* 错误 */
.component {
  background: #1F1F1F;
}

/* 正确 */
.component {
  background: var(--vscode-editor-background);
}
```

### ❌ 错误 2: 使用不相关的变量
```css
/* 错误 - 在编辑器区域使用状态栏变量 */
.editor {
  background: var(--vscode-statusBar-background);
}

/* 正确 */
.editor {
  background: var(--vscode-editor-background);
}
```

### ❌ 错误 3: 忘记添加 `var()`
```css
/* 错误 */
.component {
  background: --vscode-editor-background;
}

/* 正确 */
.component {
  background: var(--vscode-editor-background);
}
```

## 📱 移动端/响应式

所有变量在移动端同样适用：

```css
@media (max-width: 768px) {
  .mobile-component {
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
  }
}
```

## 🎨 深色/浅色对比

| 变量 | 深色 | 浅色 |
|------|------|------|
| `editor-background` | `#1F1F1F` | `#FFFFFF` |
| `foreground` | `#CCCCCC` | `#3B3B3B` |
| `focusBorder` | `#0078D4` | `#005FB8` |

## 🔗 更多信息

- [完整变量列表](./README.md)
- [使用指南](../../../docs/theme-system.md)
- [实现总结](../../../docs/theme-system-summary.md)

---

**提示**: 将此文件加入书签，随时查阅！

