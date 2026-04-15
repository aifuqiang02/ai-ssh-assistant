# ContextMenu 通用右键菜单组件

## 功能特性

- ✅ 自动位置计算（避免超出屏幕边界）
- ✅ 支持图标、快捷键显示
- ✅ 支持分隔线
- ✅ 支持禁用状态
- ✅ 支持危险操作（红色高亮）
- ✅ 点击外部自动关闭
- ✅ ESC 键关闭
- ✅ Teleport 到 body（避免 z-index 问题）

## 基本用法

```vue
<template>
  <div @contextmenu="handleContextMenu">
    右键点击这里
  </div>
  
  <ContextMenu
    :visible="menuVisible"
    :x="menuX"
    :y="menuY"
    :items="menuItems"
    @close="menuVisible = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContextMenu, { type ContextMenuItem } from '@/components/common/ContextMenu.vue'

const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)

const menuItems: ContextMenuItem[] = [
  {
    label: '新建',
    icon: 'bi bi-plus',
    onClick: () => console.log('新建')
  },
  {
    label: '打开',
    icon: 'bi bi-folder2-open',
    shortcut: 'Ctrl+O',
    onClick: () => console.log('打开')
  },
  { type: 'divider' },
  {
    label: '删除',
    icon: 'bi bi-trash',
    danger: true,
    onClick: () => console.log('删除')
  }
]

function handleContextMenu(e: MouseEvent) {
  e.preventDefault()
  menuX.value = e.clientX
  menuY.value = e.clientY
  menuVisible.value = true
}
</script>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| items | `ContextMenuItem[]` | - | 菜单项列表 |
| visible | `boolean` | `false` | 是否显示 |
| x | `number` | `0` | X 坐标 |
| y | `number` | `0` | Y 坐标 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| close | - | 菜单关闭时触发 |

### ContextMenuItem 接口

```typescript
interface ContextMenuItem {
  type?: 'item' | 'divider'  // 类型：菜单项或分隔线
  label?: string              // 标签文本
  icon?: string              // 图标类名（Bootstrap Icons）
  shortcut?: string          // 快捷键提示
  disabled?: boolean         // 是否禁用
  danger?: boolean           // 是否为危险操作（红色）
  children?: ContextMenuItem[]  // 子菜单（未实现）
  onClick?: () => void       // 点击回调
}
```

## 示例

### 基础菜单

```typescript
const menuItems: ContextMenuItem[] = [
  {
    label: '复制',
    icon: 'bi bi-clipboard',
    shortcut: 'Ctrl+C',
    onClick: () => copy()
  },
  {
    label: '粘贴',
    icon: 'bi bi-clipboard-check',
    shortcut: 'Ctrl+V',
    onClick: () => paste()
  }
]
```

### 带分隔线

```typescript
const menuItems: ContextMenuItem[] = [
  { label: '编辑', icon: 'bi bi-pencil' },
  { type: 'divider' },
  { label: '删除', icon: 'bi bi-trash', danger: true }
]
```

### 禁用状态

```typescript
const menuItems: ContextMenuItem[] = [
  { label: '保存', icon: 'bi bi-save', disabled: true },
  { label: '另存为', icon: 'bi bi-save' }
]
```

### 危险操作

```typescript
const menuItems: ContextMenuItem[] = [
  { 
    label: '删除', 
    icon: 'bi bi-trash',
    danger: true,  // 红色显示
    onClick: () => deleteItem()
  }
]
```

## 样式定制

组件使用 Bootstrap 5 CSS 变量，自动适配明暗主题：

- `--bs-body-bg` - 背景色
- `--bs-border-color` - 边框色
- `--bs-secondary-bg` - 悬停背景
- `--bs-danger` - 危险操作颜色

## 注意事项

1. **位置计算**：组件会自动调整位置避免超出屏幕
2. **事件冒泡**：记得在触发位置使用 `e.preventDefault()` 阻止默认右键菜单
3. **关闭时机**：
   - 点击菜单项后自动关闭
   - 点击菜单外部关闭
   - 按 ESC 键关闭
4. **z-index**：使用 Teleport 到 body，z-index 为 9999

## 已应用场景

- ✅ 文档树节点右键菜单（DocumentTreeNode）
- 🔲 SSH 连接列表
- 🔲 聊天会话列表
- 🔲 文件管理器

