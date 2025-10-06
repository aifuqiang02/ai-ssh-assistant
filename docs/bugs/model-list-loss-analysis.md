# 模型列表丢失问题分析

## 问题描述

在设置中，某个已开启的服务商在刷新模型后，模型列表会丢失。但是：
- ✅ API Key **未丢失**
- ✅ 是否开启状态 **未丢失**  
- ❌ 刷新获得的**最新模型列表丢失**

## 根本原因

### 问题代码位置
`apps/desktop/src/views/SettingsView.vue` 第 1524-1532 行：

```javascript
// 恢复模型的 enabled 状态
if (savedConfig.models && provider.models) {
  providerWithConfig.models = provider.models.map(model => {
    const savedModel = savedConfig.models.find((m: any) => m.id === model.id)
    return {
      ...model,
      enabled: savedModel ? savedModel.enabled : model.enabled
    }
  })
}
```

### 错误逻辑分析

1. **初始化流程**：
   ```javascript
   // 第1步：从 DEFAULT_PROVIDERS 创建初始数据
   aiProviders.value = DEFAULT_PROVIDERS.map(provider => ({ ...provider }))
   
   // 第2步：从 localStorage 读取保存的配置
   const savedConfig = savedConfigs.find((c: any) => c.id === provider.id)
   
   // 第3步：【问题所在】以 DEFAULT_PROVIDERS 的 models 为基础
   providerWithConfig.models = provider.models.map(model => { ... })
   ```

2. **问题**：
   - `provider.models` 来自 `DEFAULT_PROVIDERS`（静态默认配置）
   - `savedConfig.models` 来自 `localStorage`（包含用户刷新获取的新模型）
   - **代码以 `provider.models` 为基础，只恢复 enabled 状态**
   - **忽略了 `savedConfig.models` 中新增的模型**

3. **数据丢失场景**：

   **场景 1：刷新前**
   ```javascript
   DEFAULT_PROVIDERS.openai.models = [
     { id: 'gpt-4', name: 'GPT-4' },
     { id: 'gpt-3.5', name: 'GPT-3.5' }
   ]
   ```

   **场景 2：用户刷新模型列表**
   ```javascript
   // API 返回新模型
   fetchedModels = [
     { id: 'gpt-4', name: 'GPT-4' },
     { id: 'gpt-3.5', name: 'GPT-3.5' },
     { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },      // 新模型
     { id: 'gpt-4o', name: 'GPT-4o' }                 // 新模型
   ]
   
   // 保存到 localStorage
   localStorage.aiProviderConfigs.openai.models = fetchedModels
   ```

   **场景 3：页面重新加载（问题发生）**
   ```javascript
   // 从 DEFAULT_PROVIDERS 初始化
   provider.models = [
     { id: 'gpt-4', name: 'GPT-4' },
     { id: 'gpt-3.5', name: 'GPT-3.5' }
   ]
   
   // 从 localStorage 读取
   savedConfig.models = [
     { id: 'gpt-4', ... },
     { id: 'gpt-3.5', ... },
     { id: 'gpt-4-turbo', ... },
     { id: 'gpt-4o', ... }
   ]
   
   // 【错误】以 provider.models 为基础恢复
   // 结果：只恢复了 gpt-4 和 gpt-3.5 的 enabled 状态
   //       gpt-4-turbo 和 gpt-4o 丢失！
   providerWithConfig.models = provider.models.map(...)
   ```

## 触发条件

这个 bug 会在以下情况触发：

1. ✅ 用户为某个服务商配置了 API Key
2. ✅ 用户点击"刷新模型列表"获取了新模型
3. ✅ 新模型被保存到 localStorage
4. ❌ **页面刷新 / 重新打开设置页面**
5. ❌ `initializeAIProviders()` 被调用
6. ❌ 模型列表被重置为 DEFAULT_PROVIDERS 的默认值
7. ❌ 用户刷新获取的新模型丢失

## 为什么 API Key 和 enabled 状态不丢失？

因为这些字段的恢复逻辑是正确的：

```javascript
const providerWithConfig = {
  ...provider,
  apiKey: savedConfig.apiKey ? decryptApiKey(savedConfig.apiKey) : '',  // ✅ 直接使用 savedConfig
  endpoint: savedConfig.endpoint || provider.endpoint,                    // ✅ 优先使用 savedConfig
  enabled: savedConfig.enabled || false,                                  // ✅ 直接使用 savedConfig
  isDefault: savedConfig.isDefault || false,                              // ✅ 直接使用 savedConfig
  config: savedConfig.config || provider.config                           // ✅ 优先使用 savedConfig
}
```

但是模型列表的逻辑是错的：
```javascript
// ❌ 以 provider.models (DEFAULT_PROVIDERS) 为基础
providerWithConfig.models = provider.models.map(model => {
  const savedModel = savedConfig.models.find((m: any) => m.id === model.id)
  return {
    ...model,
    enabled: savedModel ? savedModel.enabled : model.enabled
  }
})
```

## 解决方案

### 方案 1: 优先使用 savedConfig.models（推荐）

```javascript
// 恢复模型列表
if (savedConfig.models && savedConfig.models.length > 0) {
  // 如果 localStorage 有模型列表，直接使用（包含刷新获取的新模型）
  providerWithConfig.models = savedConfig.models
} else if (provider.models) {
  // 否则使用默认配置
  providerWithConfig.models = provider.models
}
```

### 方案 2: 合并模型列表（保留默认 + 添加新模型）

```javascript
// 恢复模型列表（合并策略）
if (savedConfig.models) {
  // 1. 先使用 savedConfig.models 中的所有模型
  const savedModelIds = new Set(savedConfig.models.map((m: any) => m.id))
  
  // 2. 添加 DEFAULT_PROVIDERS 中存在但 savedConfig 中不存在的模型
  const defaultOnlyModels = provider.models.filter(m => !savedModelIds.has(m.id))
  
  providerWithConfig.models = [...savedConfig.models, ...defaultOnlyModels]
} else {
  providerWithConfig.models = provider.models
}
```

### 方案 3: 完全依赖 savedConfig（最简单）

```javascript
// 恢复配置，包括模型的 enabled 状态
const providerWithConfig = {
  ...provider,
  apiKey: savedConfig.apiKey ? decryptApiKey(savedConfig.apiKey) : '',
  endpoint: savedConfig.endpoint || provider.endpoint,
  enabled: savedConfig.enabled || false,
  isDefault: savedConfig.isDefault || false,
  config: savedConfig.config || provider.config,
  models: savedConfig.models || provider.models  // ✅ 优先使用 savedConfig.models
}
```

## 推荐修复

**使用方案 1**，因为：
- ✅ 逻辑简单清晰
- ✅ 完全保留用户刷新获取的模型列表
- ✅ 只在 localStorage 为空时才使用默认配置
- ✅ 符合"用户数据优先"的原则

## 测试验证

修复后需要测试：

1. **测试场景 1：正常刷新**
   - 配置 API Key
   - 刷新模型列表
   - 刷新页面
   - ✅ 验证：模型列表应该保持完整

2. **测试场景 2：清空缓存**
   - 清空 localStorage
   - 重新加载
   - ✅ 验证：应该显示 DEFAULT_PROVIDERS 的默认模型

3. **测试场景 3：多次刷新**
   - 第一次刷新获取模型 A, B, C
   - 刷新页面
   - 第二次刷新获取模型 D, E, F
   - ✅ 验证：应该显示最新的模型列表

## 相关代码文件

- `apps/desktop/src/views/SettingsView.vue` - initializeAIProviders() 函数
- `apps/desktop/src/services/model-fetcher.service.ts` - 模型获取逻辑
- `apps/desktop/src/types/ai-providers.*.ts` - DEFAULT_PROVIDERS 配置

