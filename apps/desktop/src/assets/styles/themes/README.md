# VSCode 主题系统

本项目使用完整的 VSCode 官方主题变量，确保与 VSCode 编辑器的视觉体验一致。

## 📁 文件结构

```
themes/
├── dark-modern.css      # VSCode Dark Modern 主题（默认）
├── light-modern.css     # VSCode Light Modern 主题
└── README.md           # 本文档
```

## 🎨 主题来源

主题颜色直接来自 VSCode 官方源码：
- **源路径**: `vscode-main/extensions/theme-defaults/themes/`
- **Dark Modern**: `dark_modern.json`
- **Light Modern**: `light_modern.json`

## 🔧 使用方法

### 1. 自动主题切换

主题通过 `<html>` 根元素的 class 自动切换：

```html
<!-- 深色主题 -->
<html class="dark">

<!-- 浅色主题 -->
<html class="light">
```

### 2. 在组件中使用

所有 CSS 变量都以 `--vscode-` 为前缀，可以直接在任何组件中使用：

```css
.my-component {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  border: 1px solid var(--vscode-panel-border);
}
```

### 3. 常用变量速查

#### 背景色
```css
--vscode-editor-background          /* 编辑器主背景 */
--vscode-sideBar-background         /* 侧边栏背景 */
--vscode-panel-background           /* 面板背景 */
--vscode-activityBar-background     /* 活动栏背景 */
--vscode-titleBar-activeBackground  /* 标题栏背景 */
--vscode-statusBar-background       /* 状态栏背景 */
```

#### 前景色（文字）
```css
--vscode-foreground                 /* 主文字颜色 */
--vscode-editor-foreground          /* 编辑器文字 */
--vscode-descriptionForeground      /* 描述性文字（次要） */
--vscode-errorForeground            /* 错误文字 */
```

#### 边框
```css
--vscode-panel-border               /* 面板边框 */
--vscode-sideBar-border             /* 侧边栏边框 */
--vscode-input-border               /* 输入框边框 */
--vscode-focusBorder                /* 焦点边框 */
```

#### 按钮
```css
--vscode-button-background          /* 主按钮背景 */
--vscode-button-foreground          /* 主按钮文字 */
--vscode-button-hoverBackground     /* 主按钮悬停 */
--vscode-button-secondaryBackground /* 次要按钮背景 */
```

#### 输入框
```css
--vscode-input-background           /* 输入框背景 */
--vscode-input-foreground           /* 输入框文字 */
--vscode-input-border               /* 输入框边框 */
--vscode-input-placeholderForeground /* 占位符文字 */
```

#### 下拉菜单
```css
--vscode-dropdown-background        /* 下拉框背景 */
--vscode-dropdown-foreground        /* 下拉框文字 */
--vscode-dropdown-border            /* 下拉框边框 */
--vscode-dropdown-listBackground    /* 下拉列表背景 */
```

#### 标签页
```css
--vscode-tab-activeBackground       /* 活动标签背景 */
--vscode-tab-activeForeground       /* 活动标签文字 */
--vscode-tab-activeBorderTop        /* 活动标签顶部边框 */
--vscode-tab-inactiveBackground     /* 非活动标签背景 */
--vscode-tab-inactiveForeground     /* 非活动标签文字 */
```

#### 状态色
```css
--vscode-errorForeground            /* 错误颜色 */
--vscode-editorGutter-addedBackground    /* 新增（绿色） */
--vscode-editorGutter-modifiedBackground /* 修改（蓝色） */
--vscode-editorGutter-deletedBackground  /* 删除（红色） */
```

#### AI 助手专用
```css
--vscode-chat-slashCommandBackground    /* 斜杠命令背景 */
--vscode-chat-slashCommandForeground    /* 斜杠命令文字 */
--vscode-chat-editedFileForeground      /* 编辑文件提示 */
```

## 📊 完整变量列表

### Dark Modern 主题（深色）

| 类别 | 变量数量 |
|------|---------|
| 基础颜色 | 4 |
| 编辑器 | 10 |
| 标签页 | 12 |
| 侧边栏 | 7 |
| 活动栏 | 7 |
| 面板 | 7 |
| 标题栏 | 5 |
| 状态栏 | 12 |
| 按钮 | 7 |
| 输入框 | 6 |
| 下拉菜单 | 4 |
| 通知 | 5 |
| 其他 | 30+ |
| **总计** | **100+** |

### Light Modern 主题（浅色）

与 Dark Modern 对应，所有变量名相同，仅颜色值不同。

## 🎯 简化变量（向后兼容）

为了方便使用，每个主题文件末尾都定义了简化版变量：

```css
/* 简化变量 */
--vscode-bg                /* 主背景 */
--vscode-bg-light          /* 浅背景 */
--vscode-bg-lighter        /* 更浅背景 */
--vscode-bg-input          /* 输入框背景 */
--vscode-fg                /* 主文字 */
--vscode-fg-muted          /* 次要文字 */
--vscode-accent            /* 强调色 */
--vscode-accent-hover      /* 强调色悬停 */
--vscode-border            /* 边框 */
--vscode-border-subtle     /* 微妙边框 */
--vscode-success           /* 成功色 */
--vscode-warning           /* 警告色 */
--vscode-error             /* 错误色 */
```

**推荐**：新代码使用完整变量名（如 `--vscode-editor-background`），简化变量仅用于快速原型或向后兼容。

## 🔄 主题切换实现

在 Vue 组件中切换主题：

```typescript
// 切换到深色主题
document.documentElement.classList.remove('light')
document.documentElement.classList.add('dark')

// 切换到浅色主题
document.documentElement.classList.remove('dark')
document.documentElement.classList.add('light')
```

## 📝 最佳实践

### ✅ 推荐做法

```css
/* 1. 使用语义化的完整变量名 */
.editor-panel {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  border: 1px solid var(--vscode-panel-border);
}

/* 2. 使用相关组件的变量 */
.sidebar-item {
  background: var(--vscode-sideBar-background);
  color: var(--vscode-sideBar-foreground);
}

/* 3. 使用状态相关的变量 */
.error-message {
  color: var(--vscode-errorForeground);
}
```

### ❌ 避免做法

```css
/* 1. 避免硬编码颜色 */
.bad-example {
  background: #1F1F1F;  /* ❌ 不会自动适配主题 */
  color: #CCCCCC;       /* ❌ 不会自动适配主题 */
}

/* 2. 避免使用不相关的变量 */
.editor-area {
  background: var(--vscode-statusBar-background);  /* ❌ 语义不符 */
}

/* 3. 避免过度使用简化变量 */
.component {
  background: var(--vscode-bg);  /* ⚠️ 不够精确 */
  /* 更好的做法： */
  background: var(--vscode-editor-background);  /* ✅ 语义明确 */
}
```

## 🚀 扩展主题

如果需要添加新主题（如 High Contrast），只需：

1. 在 `vscode-main/extensions/theme-defaults/themes/` 找到对应的 JSON 文件
2. 创建新的 CSS 文件（如 `hc-black.css`）
3. 转换 JSON 颜色定义为 CSS 变量
4. 在 `main.css` 中导入

```css
/* main.css */
@import './themes/dark-modern.css';
@import './themes/light-modern.css';
@import './themes/hc-black.css';      /* 新主题 */
```

## 📚 参考资源

- [VSCode 主题颜色参考](https://code.visualstudio.com/api/references/theme-color)
- [VSCode 官方主题源码](https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults)
- [CSS 自定义属性（变量）](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)

## 🔍 变量查找

如果不确定使用哪个变量，可以：

1. 打开 VSCode
2. 按 `Ctrl+Shift+P`（Windows/Linux）或 `Cmd+Shift+P`（Mac）
3. 输入 "Developer: Generate Color Theme From Current Settings"
4. 查看生成的主题文件，找到对应的颜色变量名

或者直接查看本目录下的 `dark-modern.css` 和 `light-modern.css` 文件。

## 📊 颜色对比表

### 背景色对比（Dark vs Light）

| 变量名 | Dark Modern | Light Modern |
|--------|-------------|--------------|
| `editor-background` | `#1F1F1F` | `#FFFFFF` |
| `sideBar-background` | `#181818` | `#F8F8F8` |
| `panel-background` | `#181818` | `#F8F8F8` |
| `activityBar-background` | `#181818` | `#F8F8F8` |

### 强调色对比

| 变量名 | Dark Modern | Light Modern |
|--------|-------------|--------------|
| `focusBorder` | `#0078D4` | `#005FB8` |
| `button-background` | `#0078D4` | `#005FB8` |
| `progressBar-background` | `#0078D4` | `#005FB8` |

---

**最后更新**: 2025-01-11
**维护者**: AI SSH Assistant Team

