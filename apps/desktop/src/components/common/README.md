# 通用组件使用指南

## 📦 ConfirmDialog - 确认对话框

### 基本使用

#### 方式1：直接调用（推荐）

```typescript
import { $confirm } from '@/composables/useDialog'

// 简单用法 - 只传字符串
const result = await $confirm('确定要删除吗？')
if (result) {
  // 用户点击了确定
}

// 完整用法 - 传入配置对象
const result = await $confirm({
  title: '删除确认',
  message: '确定要删除这个文件吗？\n此操作不可恢复。',
  type: 'danger',
  confirmText: '删除',
  cancelText: '取消'
})
```

#### 方式2：在 Options API 中使用

```typescript
export default {
  methods: {
    async handleDelete() {
      const confirmed = await this.$confirm({
        title: '删除确认',
        message: '确定要删除吗？',
        type: 'danger'
      })
      
      if (confirmed) {
        // 执行删除操作
      }
    }
  }
}
```

### 配置选项

```typescript
interface ConfirmOptions {
  title?: string              // 对话框标题，默认 "确认操作"
  message: string             // 对话框内容（必填）
  confirmText?: string        // 确认按钮文字，默认 "确定"
  cancelText?: string         // 取消按钮文字，默认 "取消"
  type?: 'warning' | 'danger' | 'info' | 'success'  // 对话框类型，默认 'warning'
  closeOnOverlay?: boolean    // 点击遮罩层是否关闭，默认 true
}
```

### 对话框类型

| 类型 | 说明 | 图标颜色 | 按钮颜色 |
|------|------|---------|---------|
| `warning` | 警告操作 | 黄色 | 黄色 |
| `danger` | 危险操作（删除等） | 红色 | 红色 |
| `info` | 信息提示 | 蓝色 | 蓝色 |
| `success` | 成功确认 | 绿色 | 绿色 |

### 使用示例

#### 1. 删除确认
```typescript
const confirmed = await $confirm({
  title: '删除文件',
  message: '确定要删除 "config.json" 吗？\n此操作不可恢复。',
  type: 'danger',
  confirmText: '删除',
  cancelText: '取消'
})
```

#### 2. 清空数据
```typescript
const confirmed = await $confirm({
  title: '清空数据',
  message: '确定要清空所有数据吗？',
  type: 'warning',
  confirmText: '清空',
  cancelText: '取消'
})
```

#### 3. 保存确认
```typescript
const confirmed = await $confirm({
  title: '保存更改',
  message: '是否保存当前的更改？',
  type: 'info',
  confirmText: '保存',
  cancelText: '取消'
})
```

#### 4. 完成确认
```typescript
const confirmed = await $confirm({
  title: '任务完成',
  message: '任务已完成，是否继续下一个任务？',
  type: 'success',
  confirmText: '继续',
  cancelText: '稍后'
})
```

### 键盘快捷键

- `Enter` - 确认
- `Escape` - 取消

### 特性

✅ 美观的 VSCode 风格设计
✅ 支持主题自动适配（深色/浅色）
✅ 支持键盘快捷键
✅ 自动聚焦确认按钮
✅ 点击遮罩层关闭（可配置）
✅ 平滑的动画效果
✅ 支持多行文本（使用 `\n` 换行）
✅ Promise 异步调用
✅ TypeScript 类型支持

---

## 🔮 未来扩展

### AlertDialog - 警告对话框（计划中）
```typescript
await $alert('操作成功！', '提示')
```

### ToastNotification - 轻提示（计划中）
```typescript
$toast.success('保存成功')
$toast.error('操作失败')
$toast.info('正在处理...')
```

### LoadingOverlay - 加载遮罩（计划中）
```typescript
const loading = $loading.show('正在加载...')
// ... 异步操作
loading.hide()
```

---

## 📁 文件结构

```
apps/desktop/src/
├── components/
│   └── common/
│       ├── ConfirmDialog.vue      # 确认对话框组件
│       └── README.md              # 本文档
├── composables/
│   └── useDialog.ts               # 对话框调用方法
└── plugins/
    └── dialog.ts                  # 对话框插件（全局注册）
```

---

## 🎨 样式定制

对话框使用 VSCode CSS 变量，自动适配主题：

```css
--vscode-bg                  /* 背景色 */
--vscode-fg                  /* 文字颜色 */
--vscode-border              /* 边框颜色 */
--vscode-bg-lighter          /* 浅色背景 */
--vscode-error               /* 错误/危险色 */
--vscode-warning             /* 警告色 */
--vscode-success             /* 成功色 */
--vscode-accent              /* 强调色 */
```

如需自定义样式，可以在组件中覆盖这些变量。

