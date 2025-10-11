# 主题系统使用指南

本文档介绍如何在项目中使用新的 VSCode 主题系统。

## 📋 目录

- [快速开始](#快速开始)
- [主题变量](#主题变量)
- [组件使用](#组件使用)
- [最佳实践](#最佳实践)
- [迁移指南](#迁移指南)
- [常见问题](#常见问题)

## 快速开始

### 1. 主题已自动加载

主题系统在应用启动时自动初始化，无需手动配置。

```typescript
// apps/desktop/src/services/theme.service.ts
// 自动初始化
if (typeof window !== 'undefined') {
  themeService.init()
}
```

### 2. 使用主题切换组件

在任何页面添加主题切换按钮：

```vue
<template>
  <div class="header">
    <h1>我的应用</h1>
    <ThemeSwitcher />  <!-- 主题切换按钮 -->
  </div>
</template>

<script setup lang="ts">
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'
</script>
```

### 3. 在样式中使用主题变量

```vue
<template>
  <div class="my-component">
    <p>Hello World</p>
  </div>
</template>

<style scoped>
.my-component {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  border: 1px solid var(--vscode-panel-border);
  padding: 16px;
  border-radius: 4px;
}
</style>
```

## 主题变量

### 常用变量速查表

#### 背景色

| 变量名 | 用途 | Dark Modern | Light Modern |
|--------|------|-------------|--------------|
| `--vscode-editor-background` | 编辑器/主内容区背景 | `#1F1F1F` | `#FFFFFF` |
| `--vscode-sideBar-background` | 侧边栏背景 | `#181818` | `#F8F8F8` |
| `--vscode-panel-background` | 面板背景 | `#181818` | `#F8F8F8` |
| `--vscode-activityBar-background` | 活动栏背景 | `#181818` | `#F8F8F8` |
| `--vscode-titleBar-activeBackground` | 标题栏背景 | `#181818` | `#F8F8F8` |
| `--vscode-statusBar-background` | 状态栏背景 | `#181818` | `#F8F8F8` |
| `--vscode-input-background` | 输入框背景 | `#313131` | `#FFFFFF` |
| `--vscode-dropdown-background` | 下拉框背景 | `#313131` | `#FFFFFF` |

#### 前景色（文字）

| 变量名 | 用途 | Dark Modern | Light Modern |
|--------|------|-------------|--------------|
| `--vscode-foreground` | 主文字颜色 | `#CCCCCC` | `#3B3B3B` |
| `--vscode-editor-foreground` | 编辑器文字 | `#CCCCCC` | `#3B3B3B` |
| `--vscode-descriptionForeground` | 描述性文字（次要） | `#9D9D9D` | `#3B3B3B` |
| `--vscode-errorForeground` | 错误文字 | `#F85149` | `#F85149` |

#### 边框

| 变量名 | 用途 | Dark Modern | Light Modern |
|--------|------|-------------|--------------|
| `--vscode-panel-border` | 面板边框 | `#2B2B2B` | `#E5E5E5` |
| `--vscode-sideBar-border` | 侧边栏边框 | `#2B2B2B` | `#E5E5E5` |
| `--vscode-input-border` | 输入框边框 | `#3C3C3C` | `#CECECE` |
| `--vscode-focusBorder` | 焦点边框 | `#0078D4` | `#005FB8` |

#### 按钮

| 变量名 | 用途 | Dark Modern | Light Modern |
|--------|------|-------------|--------------|
| `--vscode-button-background` | 主按钮背景 | `#0078D4` | `#005FB8` |
| `--vscode-button-foreground` | 主按钮文字 | `#FFFFFF` | `#FFFFFF` |
| `--vscode-button-hoverBackground` | 主按钮悬停 | `#026EC1` | `#0258A8` |
| `--vscode-button-secondaryBackground` | 次要按钮背景 | `#313131` | `#E5E5E5` |
| `--vscode-button-secondaryForeground` | 次要按钮文字 | `#CCCCCC` | `#3B3B3B` |

#### 状态色

| 变量名 | 用途 | Dark Modern | Light Modern |
|--------|------|-------------|--------------|
| `--vscode-editorGutter-addedBackground` | 新增（绿色） | `#2EA043` | `#2EA043` |
| `--vscode-editorGutter-modifiedBackground` | 修改（蓝色） | `#0078D4` | `#005FB8` |
| `--vscode-editorGutter-deletedBackground` | 删除（红色） | `#F85149` | `#F85149` |

### 完整变量列表

查看完整的变量列表和详细说明：
- [Dark Modern 主题](../apps/desktop/src/assets/styles/themes/dark-modern.css)
- [Light Modern 主题](../apps/desktop/src/assets/styles/themes/light-modern.css)
- [主题 README](../apps/desktop/src/assets/styles/themes/README.md)

## 组件使用

### 示例 1: 卡片组件

```vue
<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.card {
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 4px;
  overflow: hidden;
}

.card-header {
  background: var(--vscode-sideBar-background);
  color: var(--vscode-foreground);
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.card-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.card-body {
  padding: 16px;
  color: var(--vscode-editor-foreground);
}
</style>
```

### 示例 2: 输入框组件

```vue
<template>
  <div class="input-group">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="input-field"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-foreground);
}

.input-field {
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 2px;
  padding: 6px 8px;
  font-size: 13px;
  transition: border-color 0.15s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.input-field::placeholder {
  color: var(--vscode-input-placeholderForeground);
}
</style>
```

### 示例 3: 按钮组件

```vue
<template>
  <button 
    class="btn"
    :class="[`btn-${variant}`, { 'btn-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 2px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-button-border);
}

.btn-primary:hover:not(.btn-disabled) {
  background: var(--vscode-button-hoverBackground);
}

.btn-secondary {
  background: var(--vscode-button-secondaryBackground);
  color: var(--vscode-button-secondaryForeground);
}

.btn-secondary:hover:not(.btn-disabled) {
  background: var(--vscode-button-secondaryHoverBackground);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## 最佳实践

### ✅ 推荐做法

#### 1. 使用语义化变量

```css
/* ✅ 好 - 使用编辑器相关的变量 */
.editor-panel {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}

/* ✅ 好 - 使用侧边栏相关的变量 */
.sidebar-item {
  background: var(--vscode-sideBar-background);
  color: var(--vscode-sideBar-foreground);
}
```

#### 2. 使用状态相关的变量

```css
/* ✅ 好 - 使用错误相关的变量 */
.error-message {
  color: var(--vscode-errorForeground);
}

/* ✅ 好 - 使用成功相关的变量 */
.success-indicator {
  background: var(--vscode-editorGutter-addedBackground);
}
```

#### 3. 使用焦点边框

```css
/* ✅ 好 - 使用统一的焦点样式 */
.input-field:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}
```

### ❌ 避免做法

#### 1. 避免硬编码颜色

```css
/* ❌ 差 - 硬编码颜色，不会自动适配主题 */
.bad-example {
  background: #1F1F1F;
  color: #CCCCCC;
}

/* ✅ 好 - 使用主题变量 */
.good-example {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}
```

#### 2. 避免使用不相关的变量

```css
/* ❌ 差 - 在编辑器区域使用状态栏的变量 */
.editor-area {
  background: var(--vscode-statusBar-background);
}

/* ✅ 好 - 使用相关的变量 */
.editor-area {
  background: var(--vscode-editor-background);
}
```

#### 3. 避免过度使用简化变量

```css
/* ⚠️ 可以但不推荐 - 简化变量不够精确 */
.component {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* ✅ 更好 - 使用完整的语义化变量 */
.component {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}
```

## 迁移指南

### 从旧的简化变量迁移

如果你的代码使用了旧的简化变量（如 `--vscode-bg`），可以逐步迁移到新的完整变量。

#### 迁移对照表

| 旧变量（简化） | 新变量（完整） | 说明 |
|---------------|---------------|------|
| `--vscode-bg` | `--vscode-editor-background` | 主背景 |
| `--vscode-bg-light` | `--vscode-sideBar-background` | 侧边栏背景 |
| `--vscode-bg-lighter` | `--vscode-panel-background` | 面板背景 |
| `--vscode-bg-input` | `--vscode-input-background` | 输入框背景 |
| `--vscode-fg` | `--vscode-editor-foreground` | 主文字 |
| `--vscode-fg-muted` | `--vscode-descriptionForeground` | 次要文字 |
| `--vscode-accent` | `--vscode-button-background` | 强调色 |
| `--vscode-border` | `--vscode-panel-border` | 边框 |

#### 迁移示例

**修改前**:
```css
.my-component {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
  border: 1px solid var(--vscode-border);
}

.my-button {
  background: var(--vscode-accent);
  color: #ffffff;
}
```

**修改后**:
```css
.my-component {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
  border: 1px solid var(--vscode-panel-border);
}

.my-button {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}
```

### 向后兼容性

旧的简化变量仍然可用，不会破坏现有代码。但建议新代码使用完整变量。

```css
/* ✅ 仍然有效（向后兼容） */
.legacy-component {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* ✅ 推荐（新代码） */
.modern-component {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}
```

## 常见问题

### Q1: 如何切换主题？

**方法 1: 使用主题切换组件**
```vue
<ThemeSwitcher />
```

**方法 2: 使用主题服务**
```typescript
import { themeService } from '@/services/theme.service'

// 切换主题（深色 ↔ 浅色）
themeService.toggleTheme()

// 应用指定主题
themeService.applyTheme('light-modern')
```

### Q2: 如何检测当前主题？

```typescript
import { themeService } from '@/services/theme.service'

// 获取当前主题
const currentTheme = themeService.getCurrentTheme()

// 检查是否为深色主题
if (themeService.isDarkTheme()) {
  console.log('当前是深色主题')
}

// 检查是否为浅色主题
if (themeService.isLightTheme()) {
  console.log('当前是浅色主题')
}
```

### Q3: 如何监听主题变化？

```typescript
// 在组件中监听主题变化
onMounted(() => {
  window.addEventListener('theme-changed', (event: Event) => {
    const customEvent = event as CustomEvent
    console.log('主题已切换为:', customEvent.detail.theme)
  })
})
```

### Q4: 如何添加自定义主题？

1. 在 `apps/desktop/src/assets/styles/themes/` 创建新的 CSS 文件
2. 定义所有必需的 CSS 变量
3. 在 `main.css` 中导入
4. 在 `theme.service.ts` 中添加主题选项

### Q5: 为什么我的组件颜色没有自动切换？

确保你使用了 CSS 变量而不是硬编码的颜色：

```css
/* ❌ 不会自动切换 */
.component {
  background: #1F1F1F;
}

/* ✅ 会自动切换 */
.component {
  background: var(--vscode-editor-background);
}
```

### Q6: 如何在 JavaScript 中获取主题颜色？

```typescript
// 获取 CSS 变量的值
const bgColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--vscode-editor-background')
  .trim()

console.log('背景色:', bgColor)
```

### Q7: 主题设置会保存吗？

是的，主题设置会自动保存到 `localStorage`，下次打开应用时会自动恢复。

```typescript
// 主题服务会自动处理持久化
themeService.applyTheme('light-modern')
// 自动保存到 localStorage

// 下次启动时自动加载
themeService.init()
```

## 参考资源

- [VSCode 主题颜色参考](https://code.visualstudio.com/api/references/theme-color)
- [主题系统 README](../apps/desktop/src/assets/styles/themes/README.md)
- [Dark Modern 主题源码](../apps/desktop/src/assets/styles/themes/dark-modern.css)
- [Light Modern 主题源码](../apps/desktop/src/assets/styles/themes/light-modern.css)
- [主题服务源码](../apps/desktop/src/services/theme.service.ts)

---

**最后更新**: 2025-01-11
**维护者**: AI SSH Assistant Team

