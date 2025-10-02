# 主题系统使用指南

## 概述

AI SSH Assistant 提供了完整的主题定制功能，支持浅色/深色/自动模式，以及多种颜色方案。

## 功能特性

### 1. 主题模式

- **☀️ 浅色模式**: 适合在明亮环境下使用
- **🌙 深色模式**: 适合在暗光环境下使用，保护眼睛
- **🔄  自动模式**: 跟随系统主题设置自动切换

### 2. 颜色方案

支持 5 种颜色方案，可自定义应用的主色调：

- 🔵 **蓝色** (默认): 经典专业，适合日常使用
- 🟢 **绿色**: 清新自然，缓解视觉疲劳
- 🟣 **紫色**: 优雅神秘，彰显个性
- 🟠 **橙色**: 温暖活力，提升工作热情
- 🔴 **红色**: 激情醒目，适合高强度工作

### 3. 字体大小

提供三种字体大小选项：

- **小 (14px)**: 适合高分辨率屏幕
- **中 (16px)**: 默认大小，平衡舒适
- **大 (18px)**: 适合视力较弱或喜欢大字体的用户

## 使用方法

### 方法一：设置页面

1. 点击左侧活动栏底部的 ⚙️ **设置** 图标
2. 在 **外观** 部分：
   - **主题模式**: 从下拉菜单选择浅色/深色/自动
   - **颜色方案**: 点击圆形色块选择喜欢的颜色
   - **字体大小**: 从下拉菜单选择合适的大小
3. 实时预览效果，满意后点击 **保存设置**

### 方法二：快捷切换（标题栏）

在应用标题栏右侧窗口控制按钮旁，有一个快捷主题切换按钮：

- **太阳图标 ☀️**: 当前为浅色模式
- **月亮图标 🌙**: 当前为深色模式
- **自动图标 🔄**: 当前为自动模式

点击该按钮可在三种模式间快速切换：浅色 → 深色 → 自动 → 浅色...

## 技术实现

### 架构设计

```
src/
├── stores/
│   └── theme.ts          # Pinia 主题状态管理
├── assets/
│   └── styles/
│       └── main.css      # CSS 变量和主题样式
└── views/
    └── SettingsView.vue  # 设置页面 UI
```

### 主题 Store (Pinia)

主题状态通过 Pinia store 集中管理：

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// 设置主题模式
themeStore.setMode('dark')

// 设置颜色方案
themeStore.setColorScheme('purple')

// 设置字体大小
themeStore.setFontSize('large')

// 快速切换模式
themeStore.toggleMode()
```

### CSS 变量

主题样式基于 CSS 自定义属性实现：

```css
/* 深色主题 */
:root.dark {
  --vscode-bg: #1e1e1e;
  --vscode-fg: #cccccc;
  --vscode-accent: #007acc;
  /* ... */
}

/* 浅色主题 */
:root.light {
  --vscode-bg: #ffffff;
  --vscode-fg: #3c3c3c;
  --vscode-accent: #007acc;
  /* ... */
}
```

### 响应式设计

主题系统自动响应：

1. **系统主题变化**: 在自动模式下，监听系统主题偏好变化
2. **用户设置**: 保存到 localStorage，应用重启后自动恢复
3. **实时预览**: 设置页面提供实时主题预览

## 持久化存储

主题设置自动保存到本地存储，包括：

- 主题模式 (light/dark/auto)
- 颜色方案 (blue/green/purple/orange/red)
- 字体大小 (small/medium/large)
- 动画和过渡效果开关

存储位置：`localStorage` (key: `ai-ssh-assistant-theme`)

## 自定义开发

### 添加新颜色方案

1. 在 `src/stores/theme.ts` 中添加新颜色：

```typescript
switch (colorScheme.value) {
  case 'custom':
    vars['--primary-color'] = '#yourColor'
    vars['--primary-hover'] = '#yourHoverColor'
    break
}
```

2. 在 `getAvailableColorSchemes()` 中注册：

```typescript
{ value: 'custom', label: '自定义', color: '#yourColor' }
```

### 扩展主题变量

在 `src/assets/styles/main.css` 中添加新的 CSS 变量：

```css
:root {
  --your-custom-var: value;
}

:root.light {
  --your-custom-var: lightValue;
}

:root.dark {
  --your-custom-var: darkValue;
}
```

## 最佳实践

1. **避免硬编码颜色**: 始终使用 CSS 变量（如 `var(--vscode-bg)`）
2. **测试两种模式**: 确保组件在浅色和深色模式下都清晰可读
3. **保持一致性**: 遵循 VSCode 主题规范，保持界面一致性
4. **性能优化**: 主题切换使用 CSS 变量，避免大量 DOM 操作

## 问题排查

### 主题不生效

1. 检查浏览器控制台是否有错误
2. 确认 `themeStore.initialize()` 在 App.vue 中被调用
3. 清除浏览器缓存和 localStorage

### 颜色显示异常

1. 检查 CSS 变量是否正确定义
2. 确认 HTML 根元素 (`documentElement`) 有正确的 class (`light` 或 `dark`)
3. 使用开发者工具检查计算后的 CSS 变量值

### 系统主题检测失败

1. 确认浏览器支持 `window.matchMedia('(prefers-color-scheme: dark)')`
2. 检查是否在 Electron 环境中正确初始化

## 未来计划

- [ ] 支持更多颜色方案
- [ ] 自定义颜色选择器
- [ ] 主题导入/导出功能
- [ ] 社区主题市场
- [ ] 细粒度的组件级主题定制

---

**文档版本**: 1.0.0  
**最后更新**: 2025-09-30  
**维护者**: AI SSH Assistant Team
