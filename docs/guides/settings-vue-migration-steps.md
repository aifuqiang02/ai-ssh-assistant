# SettingsView.vue 迁移步骤

## 修改说明

将 `apps/desktop/src/views/SettingsView.vue` 中的 localStorage 调用替换为数据库 IPC 调用。

---

## 步骤 1: 修改 saveSettings 函数

**位置**：第 1410 行左右

**原代码**：
```typescript
const saveSettings = () => {
  const settings = {
    theme: theme.value,
    fontSize: fontSize.value,
    colorScheme: selectedColorScheme.value,
    sshTimeout: sshTimeout.value,
    keepAlive: keepAlive.value,
    defaultSSHPort: defaultSSHPort.value,
    terminalFontSize: terminalFontSize.value,
    cursorStyle: cursorStyle.value,
    cursorBlink: cursorBlink.value,
    // AI 助手设置
    autoApproveReadOnly: autoApproveReadOnly.value,
    commandRiskLevel: commandRiskLevel.value,
    enableChatHistory: enableChatHistory.value,
    maxHistoryMessages: maxHistoryMessages.value,
    // 高级设置
    autoConnect: autoConnect.value,
    saveCommandHistory: saveCommandHistory.value,
    developerMode: developerMode.value,
    storageMode: storageMode.value,
    syncFrequency: syncFrequency.value
  }
  
  localStorage.setItem('appSettings', JSON.stringify(settings))
  themeStore.setMode(theme.value)
  themeStore.setColorScheme(selectedColorScheme.value)
  themeStore.setFontSize(fontSize.value)
  
  // 触发设置更新事件
  window.dispatchEvent(new CustomEvent('settings-updated'))
  
  console.log('Settings saved:', settings)
}
```

**新代码**：
```typescript
const saveSettings = async () => {
  const settings = {
    appearance: {
      theme: theme.value,
      fontSize: fontSize.value,
      colorScheme: selectedColorScheme.value
    },
    ssh: {
      timeout: sshTimeout.value,
      keepAlive: keepAlive.value,
      defaultPort: defaultSSHPort.value
    },
    terminal: {
      fontSize: terminalFontSize.value,
      cursorStyle: cursorStyle.value,
      cursorBlink: cursorBlink.value
    },
    aiAssistant: {
      autoApproveReadOnly: autoApproveReadOnly.value,
      commandRiskLevel: commandRiskLevel.value,
      enableChatHistory: enableChatHistory.value,
      maxHistoryMessages: maxHistoryMessages.value
    },
    aiProviders: aiProviders.value,
    advanced: {
      autoConnect: autoConnect.value,
      saveCommandHistory: saveCommandHistory.value,
      developerMode: developerMode.value,
      storageMode: storageMode.value,
      syncFrequency: syncFrequency.value
    },
    storage: {
      mode: storageMode.value
    }
  }
  
  try {
    await window.electronAPI.settings.save(settings)
    console.log('[Settings] Settings saved to database')
    
    // 更新主题 Store
    themeStore.setMode(theme.value)
    themeStore.setColorScheme(selectedColorScheme.value)
    themeStore.setFontSize(fontSize.value)
    
    // 触发设置更新事件
    window.dispatchEvent(new CustomEvent('settings-updated'))
  } catch (error) {
    console.error('[Settings] Failed to save settings:', error)
    showNotification('保存设置失败', 'error')
  }
}
```

---

## 步骤 2: 修改 loadSettings 函数

**位置**：第 1446 行左右

**原代码**：
```typescript
const loadSettings = () => {
  try {
    theme.value = mode.value
    fontSize.value = themeFontSize.value
    selectedColorScheme.value = colorScheme.value
    
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      
      sshTimeout.value = settings.sshTimeout || 30
      keepAlive.value = settings.keepAlive !== undefined ? settings.keepAlive : true
      defaultSSHPort.value = settings.defaultSSHPort || 22
      terminalFontSize.value = settings.terminalFontSize || 14
      cursorStyle.value = settings.cursorStyle || 'block'
      cursorBlink.value = settings.cursorBlink !== undefined ? settings.cursorBlink : true
      // AI 助手设置
      autoApproveReadOnly.value = settings.autoApproveReadOnly !== undefined ? settings.autoApproveReadOnly : true
      commandRiskLevel.value = settings.commandRiskLevel !== undefined ? settings.commandRiskLevel : 2
      enableChatHistory.value = settings.enableChatHistory !== undefined ? settings.enableChatHistory : true
      maxHistoryMessages.value = settings.maxHistoryMessages || 50
      // 高级设置
      autoConnect.value = settings.autoConnect || false
      saveCommandHistory.value = settings.saveCommandHistory !== undefined ? settings.saveCommandHistory : true
      developerMode.value = settings.developerMode || false
      storageMode.value = settings.storageMode || 'local'
      syncFrequency.value = settings.syncFrequency || 'moderate'
      
      checkLoginStatus()
    }
  } catch (error) {
    console.error('Load settings error:', error)
  }
}
```

**新代码**：
```typescript
const loadSettings = async () => {
  try {
    // 从主题 Store 加载主题设置
    theme.value = mode.value
    fontSize.value = themeFontSize.value
    selectedColorScheme.value = colorScheme.value
    
    // 从数据库加载设置
    const settings = await window.electronAPI.settings.get()
    
    if (settings) {
      // 外观设置
      if (settings.appearance) {
        theme.value = settings.appearance.theme || 'auto'
        fontSize.value = settings.appearance.fontSize || 'medium'
        selectedColorScheme.value = settings.appearance.colorScheme || 'blue'
      }
      
      // SSH 设置
      if (settings.ssh) {
        sshTimeout.value = settings.ssh.timeout || 30
        keepAlive.value = settings.ssh.keepAlive !== undefined ? settings.ssh.keepAlive : true
        defaultSSHPort.value = settings.ssh.defaultPort || 22
      }
      
      // 终端设置
      if (settings.terminal) {
        terminalFontSize.value = settings.terminal.fontSize || 14
        cursorStyle.value = settings.terminal.cursorStyle || 'block'
        cursorBlink.value = settings.terminal.cursorBlink !== undefined ? settings.terminal.cursorBlink : true
      }
      
      // AI 助手设置
      if (settings.aiAssistant) {
        autoApproveReadOnly.value = settings.aiAssistant.autoApproveReadOnly !== undefined ? settings.aiAssistant.autoApproveReadOnly : true
        commandRiskLevel.value = settings.aiAssistant.commandRiskLevel !== undefined ? settings.aiAssistant.commandRiskLevel : 2
        enableChatHistory.value = settings.aiAssistant.enableChatHistory !== undefined ? settings.aiAssistant.enableChatHistory : true
        maxHistoryMessages.value = settings.aiAssistant.maxHistoryMessages || 50
      }
      
      // AI 服务商配置
      if (settings.aiProviders && settings.aiProviders.length > 0) {
        aiProviders.value = settings.aiProviders
      }
      
      // 高级设置
      if (settings.advanced) {
        autoConnect.value = settings.advanced.autoConnect || false
        saveCommandHistory.value = settings.advanced.saveCommandHistory !== undefined ? settings.advanced.saveCommandHistory : true
        developerMode.value = settings.advanced.developerMode || false
        storageMode.value = settings.advanced.storageMode || 'local'
        syncFrequency.value = settings.advanced.syncFrequency || 'moderate'
      }
      
      checkLoginStatus()
      console.log('[Settings] Settings loaded from database')
    }
  } catch (error) {
    console.error('[Settings] Failed to load settings:', error)
    
    // 失败时尝试从 localStorage 迁移
    await migrateFromLocalStorage()
  }
}
```

---

## 步骤 3: 添加迁移函数

**在 loadSettings 函数后添加**：

```typescript
// 从 localStorage 迁移到数据库
const migrateFromLocalStorage = async () => {
  try {
    const localSettings = localStorage.getItem('appSettings')
    const localProviders = localStorage.getItem('aiProviderConfigs')
    
    if (localSettings || localProviders) {
      console.log('[Settings] 检测到 localStorage 数据，开始迁移...')
      
      const data: any = {}
      
      if (localSettings) {
        data.appSettings = JSON.parse(localSettings)
      }
      
      if (localProviders) {
        data.aiProviderConfigs = JSON.parse(localProviders)
      }
      
      // 调用迁移 API
      await window.electronAPI.settings.migrateFromLocalStorage(data.appSettings || {})
      
      // 如果有 AI 服务商配置，单独保存
      if (data.aiProviderConfigs) {
        const settings = await window.electronAPI.settings.get()
        settings.aiProviders = data.aiProviderConfigs
        await window.electronAPI.settings.save(settings)
      }
      
      // 迁移成功后清除 localStorage
      localStorage.removeItem('appSettings')
      localStorage.removeItem('aiProviderConfigs')
      
      console.log('[Settings] ✅ 成功从 localStorage 迁移到数据库')
      showNotification('设置已自动迁移到数据库', 'success')
      
      // 重新加载设置
      await loadSettings()
    }
  } catch (error) {
    console.error('[Settings] 迁移失败:', error)
    showNotification('设置迁移失败，请手动重新配置', 'error')
  }
}
```

---

## 步骤 4: 修改 saveAIProviderConfigs 函数

**位置**：第 1747 行左右

**修改**：将保存逻辑合并到 saveSettings 中，AI 服务商配置作为 settings 的一部分保存。

**新代码**：
```typescript
const saveAIProviderConfigs = async () => {
  try {
    // 获取当前设置
    const currentSettings = await window.electronAPI.settings.get()
    
    // 更新 AI 服务商配置
    currentSettings.aiProviders = aiProviders.value.map(provider => ({
      id: provider.id,
      name: provider.name,
      apiKey: provider.apiKey || '',
      endpoint: provider.endpoint,
      enabled: provider.enabled,
      isDefault: provider.isDefault,
      config: provider.config,
      models: provider.models?.map(model => ({
        id: model.id,
        name: model.name,
        description: model.description,
        providerId: model.providerId,
        contextWindow: model.contextWindow,
        capabilities: model.capabilities,
        price: model.price,
        recommended: model.recommended,
        enabled: model.enabled !== false
      }))
    }))
    
    // 保存到数据库
    await window.electronAPI.settings.save(currentSettings)
    
    console.log('[Settings] AI Provider configs saved')
    
    // 触发自定义事件通知其他组件配置已更新
    window.dispatchEvent(new CustomEvent('ai-provider-configs-updated'))
  } catch (error) {
    console.error('[Settings] Failed to save AI provider configs:', error)
  }
}
```

---

## 步骤 5: 修改 watch 中的保存调用

**位置**：第 1788 行左右

**原代码**：
```typescript
// 监听 AI 服务商配置变化
watch(aiProviders, () => {
  saveAIProviderConfigs()
}, { deep: true })
```

**保持不变**，因为 saveAIProviderConfigs 已经修改为使用数据库。

---

## 步骤 6: 在 onMounted 中添加用户设置

**位置**：第 1799 行左右

**原代码**：
```typescript
onMounted(() => {
  loadSettings()
  initializeAIProviders()
  console.log('SettingsView mounted')
})
```

**新代码**：
```typescript
onMounted(async () => {
  // 设置当前用户（如果已登录）
  const user = getCurrentUser() // 需要从 auth store 获取
  if (user) {
    window.electronAPI.settings.setUser(user.id)
  } else {
    window.electronAPI.settings.setUser(null)
  }
  
  await loadSettings()
  initializeAIProviders()
  console.log('SettingsView mounted')
})
```

---

## 步骤 7: 添加用户登录/登出时的处理

**在合适的位置添加**：

```typescript
// 监听用户登录状态变化
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth && authStore.user) {
    // 用户登录，设置当前用户并重新加载设置
    window.electronAPI.settings.setUser(authStore.user.id)
    loadSettings()
  } else {
    // 用户登出，清除用户并使用默认设置
    window.electronAPI.settings.setUser(null)
    loadSettings()
  }
})
```

---

## 测试检查清单

- [ ] 设置页面加载时正确显示设置
- [ ] 修改设置后点击保存成功
- [ ] 刷新页面后设置保持不变
- [ ] localStorage 数据成功迁移到数据库
- [ ] 迁移后 localStorage 数据被清除
- [ ] AI 服务商配置正确保存和加载
- [ ] 模型列表不再丢失（已修复的 bug）
- [ ] 多用户环境下设置正确隔离

---

## 完成后清理

1. 测试迁移成功后，可以移除所有 localStorage 相关的备用代码
2. 更新相关文档说明新的存储机制
3. 发布更新日志通知用户

---

## 注意事项

1. **向后兼容**：首次加载时自动从 localStorage 迁移
2. **错误处理**：数据库操作失败时有友好的错误提示
3. **用户体验**：迁移过程对用户透明，无需手动操作
4. **数据安全**：API Key 等敏感信息加密存储

