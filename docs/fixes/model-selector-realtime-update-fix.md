# 修复：启用大模型后在选择器中立即显示

## 🐛 问题描述

### 现象
- 用户在设置页面启用 AI 服务商后
- 返回 AI 助手页面
- 在模型选择下拉框中 **没有立即显示** 新启用的模型
- 需要刷新页面才能看到

### 根本原因

1. **数据加载不一致**
   - `ModelSelector.vue` 还在使用 `localStorage` 加载配置
   - `SettingsView.vue` 已经迁移到数据库存储
   - 配置保存到数据库后，ModelSelector 无法感知

2. **缺少事件监听**
   - `SettingsView.vue` 保存后触发 `ai-provider-configs-updated` 事件
   - `ModelSelector.vue` **没有监听** 这个事件
   - 导致配置更新后组件不刷新

3. **其他组件也有类似问题**
   - `AIChatSession.vue` - 使用 localStorage 获取 API Key
   - `ChatView.vue` - 使用 localStorage 加载配置
   - `AIChatSessionWithTools.vue` - 使用 localStorage 获取配置

---

## ✅ 解决方案

### 1. ModelSelector 从数据库加载 ✅

**文件**: `apps/desktop/src/components/chat/ModelSelector.vue`

#### 修改前：
```typescript
const loadProviders = () => {
  // 从 localStorage 加载
  const saved = localStorage.getItem('aiProviderConfigs')
  if (saved) {
    const savedConfigs = JSON.parse(saved)
    // ...
  }
}

onMounted(() => {
  loadProviders()
  window.addEventListener('storage', handleStorageChange)  // ❌ 只监听 storage
})
```

#### 修改后：
```typescript
const loadProviders = async () => {
  // ✅ 从数据库加载
  const settings = await window.electronAPI.settings.get()
  if (settings?.aiProviders && settings.aiProviders.length > 0) {
    const savedConfigs = settings.aiProviders
    // ...
  }
}

// ✅ 监听设置更新事件
const handleSettingsUpdate = () => {
  console.log('[ModelSelector] 检测到设置更新，重新加载配置')
  loadProviders()
}

onMounted(() => {
  loadProviders()
  // ✅ 监听配置更新事件
  window.addEventListener('ai-provider-configs-updated', handleSettingsUpdate)
  window.addEventListener('settings-updated', handleSettingsUpdate)
})
```

---

### 2. AIChatSessionWithTools 从数据库获取 API Key ✅

**文件**: `apps/desktop/src/components/chat/AIChatSessionWithTools.vue`

#### 修改前：
```typescript
// ❌ 从 localStorage 获取
const configsStr = localStorage.getItem('aiProviderConfigs') || '[]'
const configs = JSON.parse(configsStr)
const providerConfig = configs.find((p: any) => p.id === props.currentProvider?.id)
```

#### 修改后：
```typescript
// ✅ 从数据库获取
const settings = await window.electronAPI.settings.get()
const configs = settings?.aiProviders || []
const providerConfig = configs.find((p: any) => p.id === props.currentProvider?.id)
```

---

### 3. AIChatSession 从数据库获取配置 ✅

**文件**: `apps/desktop/src/components/chat/AIChatSession.vue`

#### 修改：
```typescript
// ✅ 从数据库获取 API 密钥配置
const settings = await window.electronAPI.settings.get()
const configs = settings?.aiProviders || []
const providerConfig = configs.find((p: any) => p.id === props.currentProvider?.id)
```

---

### 4. ChatView 从数据库加载 ✅

**文件**: `apps/desktop/src/views/ChatView.vue`

#### 修改 1: 获取 API 密钥
```typescript
// ✅ 从数据库获取 API 密钥
const settings = await window.electronAPI.settings.get()
const configs = settings?.aiProviders || []
const providerConfig = configs.find((p: any) => p.id === currentProvider.value?.id)
```

#### 修改 2: 加载模型配置
```typescript
const loadModelConfiguration = async () => {
  const saved = localStorage.getItem('selectedAIModel')
  if (!saved) return
  
  const savedModel = JSON.parse(saved)
  
  // ✅ 从数据库获取配置
  const settings = await window.electronAPI.settings.get()
  const configs = settings?.aiProviders || []
  
  if (configs.length > 0 && savedModel) {
    const provider = configs.find((p: AIProvider) => p.id === savedModel.providerId)
    // ...
  }
}
```

---

### 5. 新增辅助工具函数 ✅

**文件**: `apps/desktop/src/utils/settings-helper.ts`

提供统一的设置访问接口：

```typescript
/**
 * 获取 AI 服务商配置
 */
export async function getAIProviderConfigs(): Promise<any[]> {
  try {
    // 优先从数据库获取
    const settings = await window.electronAPI.settings.get()
    if (settings?.aiProviders && settings.aiProviders.length > 0) {
      return settings.aiProviders
    }
    
    // 兼容 localStorage（旧数据）
    const localConfigs = localStorage.getItem('aiProviderConfigs')
    if (localConfigs) {
      return JSON.parse(localConfigs)
    }
    
    return []
  } catch (error) {
    console.error('[SettingsHelper] 获取配置失败:', error)
    return []
  }
}

/**
 * 监听设置更新
 */
export function onSettingsUpdated(callback: () => void): () => void {
  const handler = () => callback()
  
  window.addEventListener('settings-updated', handler)
  window.addEventListener('ai-provider-configs-updated', handler)
  
  // 返回清理函数
  return () => {
    window.removeEventListener('settings-updated', handler)
    window.removeEventListener('ai-provider-configs-updated', handler)
  }
}
```

---

## 📊 修改文件清单

### 核心修复
- ✅ `apps/desktop/src/components/chat/ModelSelector.vue`
  - 从数据库加载配置
  - 添加事件监听

- ✅ `apps/desktop/src/components/chat/AIChatSessionWithTools.vue`
  - 从数据库获取 API Key

- ✅ `apps/desktop/src/components/chat/AIChatSession.vue`
  - 从数据库获取 API Key

- ✅ `apps/desktop/src/views/ChatView.vue`
  - 从数据库获取 API Key 和配置

### 新增工具
- ✅ `apps/desktop/src/utils/settings-helper.ts`
  - 统一的设置访问接口
  - 兼容 localStorage 和数据库

---

## 🎯 效果验证

### 测试步骤
1. 打开设置页面
2. 启用一个 AI 服务商（如 OpenAI）
3. 配置 API Key
4. 启用几个模型
5. **立即** 返回 AI 助手页面
6. 点击模型选择器

### 预期结果
- ✅ 立即显示新启用的服务商
- ✅ 显示所有启用的模型
- ✅ 无需刷新页面
- ✅ 选择模型后可以正常使用

---

## 🔍 技术细节

### 事件流程

```
用户在设置页面操作
    ↓
保存到数据库 (window.electronAPI.settings.save)
    ↓
触发事件 (window.dispatchEvent('ai-provider-configs-updated'))
    ↓
ModelSelector 监听到事件 (handleSettingsUpdate)
    ↓
重新加载配置 (loadProviders)
    ↓
从数据库获取最新配置 (window.electronAPI.settings.get)
    ↓
更新组件显示
    ↓
✅ 用户立即看到新的模型
```

### 数据来源优先级

1. **数据库** - 优先使用（`window.electronAPI.settings.get()`）
2. **localStorage** - 兼容旧数据（逐步淘汰）
3. **默认配置** - 都没有时使用 `DEFAULT_PROVIDERS`

---

## 🚀 未来优化

### 待优化文件
以下文件仍在使用 localStorage，后续可以逐步迁移：

- `apps/desktop/src/views/TerminalView.vue`
- `apps/desktop/src/components/layout/RightPanel.vue`
- `apps/desktop/src/components/layout/AppTitleBar.vue`

### 优化建议
1. 统一使用 `settings-helper.ts` 工具函数
2. 移除所有 localStorage 相关代码
3. 完全依赖数据库存储

---

## 📝 总结

### 问题根源
- 设置存储已迁移到数据库
- 但部分组件仍使用 localStorage
- 缺少实时更新机制

### 解决方案
- ✅ 所有组件从数据库加载配置
- ✅ 监听设置更新事件
- ✅ 立即刷新显示

### 最终效果
- ✅ 启用服务商后立即可用
- ✅ 无需刷新页面
- ✅ 配置实时同步
- ✅ 用户体验提升

---

**修复完成时间**: 2025-10-06  
**提交记录**: `645d5ba` - 修复：启用大模型后在选择器中立即显示

