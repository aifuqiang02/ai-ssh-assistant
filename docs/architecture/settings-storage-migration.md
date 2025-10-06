# 设置存储迁移方案 - localStorage → 数据库

## 📋 概述

当前所有设置都存储在 `localStorage` 中，存在以下问题：
- ❌ 无法跨设备同步
- ❌ 数据容易丢失（清除浏览器缓存）
- ❌ 没有版本控制和迁移机制
- ❌ 无法进行数据备份和恢复
- ❌ 多用户环境下无法隔离数据

**解决方案**：将所有设置迁移到数据库存储

---

## 🎯 目标

1. ✅ 将所有设置从 `localStorage` 迁移到数据库
2. ✅ 支持用户级别的设置隔离
3. ✅ 支持云端同步（通过 StorageManager）
4. ✅ 提供数据迁移和备份机制
5. ✅ 保持向后兼容，平滑迁移

---

## 📊 数据库设计

### 1. 使用现有 User.settings 字段

数据库 schema 中 `User` 表已有 `settings` 字段（Json 类型）：

```prisma
model User {
  id        String   @id @default(cuid())
  // ... 其他字段
  settings  Json?    // 存储用户偏好设置
  // ...
}
```

### 2. Settings JSON 结构

```typescript
interface UserSettings {
  // 外观设置
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    fontSize: 'small' | 'medium' | 'large'
    colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  }
  
  // SSH 设置
  ssh: {
    timeout: number          // 超时时间（秒）
    keepAlive: boolean       // 保持连接
    defaultPort: number      // 默认端口
  }
  
  // 终端设置
  terminal: {
    fontSize: number         // 字体大小
    cursorStyle: 'block' | 'underline' | 'bar'
    cursorBlink: boolean     // 光标闪烁
  }
  
  // AI 助手设置
  aiAssistant: {
    autoApproveReadOnly: boolean    // 自动批准只读操作
    commandRiskLevel: number        // 命令风险等级 (0-5)
    enableChatHistory: boolean      // 保存对话历史
    maxHistoryMessages: number      // 最大历史消息数
  }
  
  // AI 服务商配置
  aiProviders: Array<{
    id: string
    name: string
    apiKey: string           // 加密存储
    endpoint: string
    enabled: boolean
    isDefault: boolean
    config: Record<string, any>
    models: Array<{
      id: string
      name: string
      description?: string
      providerId: string
      contextWindow: number
      capabilities: {
        text: boolean
        image: boolean
        functionCall: boolean
        vision: boolean
      }
      price?: {
        input: number
        output: number
      }
      recommended?: boolean
      enabled: boolean
    }>
  }>
  
  // 高级设置
  advanced: {
    autoConnect: boolean            // 自动连接
    saveCommandHistory: boolean     // 保存命令历史
    developerMode: boolean          // 开发者模式
    storageMode: 'local' | 'cloud' | 'hybrid'
    syncFrequency: 'realtime' | 'moderate' | 'conservative'
  }
  
  // 数据存储配置
  storage: {
    mode: 'local' | 'cloud' | 'hybrid'
    cloudProvider?: string
    lastSyncTime?: string
  }
  
  // 版本信息（用于迁移）
  version: string
  lastUpdated: string
}
```

---

## 🔧 技术实现

### 1. Electron 主进程 - IPC 处理器

创建 `apps/desktop/electron/ipc/settings-handlers.ts`：

```typescript
import { ipcMain } from 'electron'
import { StorageManager } from '@repo/database'

class SettingsManager {
  private storage: StorageManager
  private currentUserId: string | null = null
  
  constructor(storage: StorageManager) {
    this.storage = storage
  }
  
  setCurrentUser(userId: string) {
    this.currentUserId = userId
  }
  
  async getSettings(): Promise<any> {
    if (!this.currentUserId) {
      throw new Error('No user logged in')
    }
    
    const user = await this.storage.findUnique('User', {
      where: { id: this.currentUserId },
      select: { settings: true }
    })
    
    return user?.settings || this.getDefaultSettings()
  }
  
  async updateSettings(settings: any): Promise<void> {
    if (!this.currentUserId) {
      throw new Error('No user logged in')
    }
    
    await this.storage.update('User', {
      where: { id: this.currentUserId },
      data: {
        settings: settings,
        updatedAt: new Date()
      }
    })
  }
  
  private getDefaultSettings(): any {
    return {
      appearance: {
        theme: 'auto',
        fontSize: 'medium',
        colorScheme: 'blue'
      },
      ssh: {
        timeout: 30,
        keepAlive: true,
        defaultPort: 22
      },
      terminal: {
        fontSize: 14,
        cursorStyle: 'block',
        cursorBlink: true
      },
      aiAssistant: {
        autoApproveReadOnly: true,
        commandRiskLevel: 2,
        enableChatHistory: true,
        maxHistoryMessages: 50
      },
      aiProviders: [],
      advanced: {
        autoConnect: false,
        saveCommandHistory: true,
        developerMode: false,
        storageMode: 'local',
        syncFrequency: 'moderate'
      },
      storage: {
        mode: 'local'
      },
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }
  }
}

export function registerSettingsHandlers(storage: StorageManager) {
  const settingsManager = new SettingsManager(storage)
  
  // 获取设置
  ipcMain.handle('settings:get', async () => {
    try {
      return await settingsManager.getSettings()
    } catch (error) {
      console.error('Failed to get settings:', error)
      throw error
    }
  })
  
  // 保存设置
  ipcMain.handle('settings:save', async (_, settings) => {
    try {
      await settingsManager.updateSettings(settings)
      return { success: true }
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  })
  
  // 重置设置
  ipcMain.handle('settings:reset', async () => {
    try {
      const defaultSettings = settingsManager.getDefaultSettings()
      await settingsManager.updateSettings(defaultSettings)
      return defaultSettings
    } catch (error) {
      console.error('Failed to reset settings:', error)
      throw error
    }
  })
  
  // 导出设置
  ipcMain.handle('settings:export', async () => {
    try {
      const settings = await settingsManager.getSettings()
      return JSON.stringify(settings, null, 2)
    } catch (error) {
      console.error('Failed to export settings:', error)
      throw error
    }
  })
  
  // 导入设置
  ipcMain.handle('settings:import', async (_, settingsJson: string) => {
    try {
      const settings = JSON.parse(settingsJson)
      await settingsManager.updateSettings(settings)
      return { success: true }
    } catch (error) {
      console.error('Failed to import settings:', error)
      throw error
    }
  })
  
  // 设置当前用户
  ipcMain.on('settings:set-user', (_, userId: string) => {
    settingsManager.setCurrentUser(userId)
  })
  
  // 从 localStorage 迁移数据
  ipcMain.handle('settings:migrate-from-localstorage', async (_, localStorageData: any) => {
    try {
      const migratedSettings = await migrateFromLocalStorage(localStorageData)
      await settingsManager.updateSettings(migratedSettings)
      return { success: true }
    } catch (error) {
      console.error('Failed to migrate settings:', error)
      throw error
    }
  })
}

// 迁移函数
async function migrateFromLocalStorage(localData: any): Promise<any> {
  return {
    appearance: {
      theme: localData.theme || 'auto',
      fontSize: localData.fontSize || 'medium',
      colorScheme: localData.colorScheme || 'blue'
    },
    ssh: {
      timeout: localData.sshTimeout || 30,
      keepAlive: localData.keepAlive !== undefined ? localData.keepAlive : true,
      defaultPort: localData.defaultSSHPort || 22
    },
    terminal: {
      fontSize: localData.terminalFontSize || 14,
      cursorStyle: localData.cursorStyle || 'block',
      cursorBlink: localData.cursorBlink !== undefined ? localData.cursorBlink : true
    },
    aiAssistant: {
      autoApproveReadOnly: localData.autoApproveReadOnly !== undefined ? localData.autoApproveReadOnly : true,
      commandRiskLevel: localData.commandRiskLevel !== undefined ? localData.commandRiskLevel : 2,
      enableChatHistory: localData.enableChatHistory !== undefined ? localData.enableChatHistory : true,
      maxHistoryMessages: localData.maxHistoryMessages || 50
    },
    aiProviders: [], // AI Providers 需要单独迁移
    advanced: {
      autoConnect: localData.autoConnect || false,
      saveCommandHistory: localData.saveCommandHistory !== undefined ? localData.saveCommandHistory : true,
      developerMode: localData.developerMode || false,
      storageMode: localData.storageMode || 'local',
      syncFrequency: localData.syncFrequency || 'moderate'
    },
    storage: {
      mode: localData.storageMode || 'local'
    },
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  }
}
```

### 2. Preload API 定义

更新 `apps/desktop/electron/preload/index.ts`：

```typescript
export const electronAPI = {
  // ... 现有API
  
  // 设置相关
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    save: (settings: any) => ipcRenderer.invoke('settings:save', settings),
    reset: () => ipcRenderer.invoke('settings:reset'),
    export: () => ipcRenderer.invoke('settings:export'),
    import: (settingsJson: string) => ipcRenderer.invoke('settings:import', settingsJson),
    setUser: (userId: string) => ipcRenderer.send('settings:set-user', userId),
    migrateFromLocalStorage: (localData: any) => ipcRenderer.invoke('settings:migrate-from-localstorage', localData)
  }
}
```

### 3. 前端 SettingsView 修改

修改 `apps/desktop/src/views/SettingsView.vue`：

```typescript
// 替换 localStorage 调用为 IPC 调用

// 保存设置
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
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  }
  
  try {
    await window.electronAPI.settings.save(settings)
    console.log('Settings saved to database')
    
    // 触发设置更新事件
    window.dispatchEvent(new CustomEvent('settings-updated'))
  } catch (error) {
    console.error('Failed to save settings:', error)
    showNotification('保存设置失败', 'error')
  }
}

// 加载设置
const loadSettings = async () => {
  try {
    const settings = await window.electronAPI.settings.get()
    
    // 应用设置到 Vue refs
    if (settings.appearance) {
      theme.value = settings.appearance.theme || 'auto'
      fontSize.value = settings.appearance.fontSize || 'medium'
      selectedColorScheme.value = settings.appearance.colorScheme || 'blue'
    }
    
    if (settings.ssh) {
      sshTimeout.value = settings.ssh.timeout || 30
      keepAlive.value = settings.ssh.keepAlive !== undefined ? settings.ssh.keepAlive : true
      defaultSSHPort.value = settings.ssh.defaultPort || 22
    }
    
    // ... 其他设置
    
    console.log('Settings loaded from database:', settings)
  } catch (error) {
    console.error('Failed to load settings:', error)
    
    // 失败时尝试从 localStorage 迁移
    await migrateFromLocalStorage()
  }
}

// 迁移函数
const migrateFromLocalStorage = async () => {
  try {
    const localSettings = localStorage.getItem('appSettings')
    if (localSettings) {
      const data = JSON.parse(localSettings)
      await window.electronAPI.settings.migrateFromLocalStorage(data)
      
      // 迁移成功后清除 localStorage
      localStorage.removeItem('appSettings')
      localStorage.removeItem('aiProviderConfigs')
      
      console.log('✅ Settings migrated from localStorage to database')
      
      // 重新加载设置
      await loadSettings()
    }
  } catch (error) {
    console.error('Migration failed:', error)
  }
}
```

---

## 📈 迁移流程

### 阶段 1: 准备工作（已完成）
- ✅ 数据库 Schema 已有 User.settings 字段
- ✅ StorageManager 已实现

### 阶段 2: 创建 IPC 处理器
1. 创建 `settings-handlers.ts`
2. 在主进程中注册处理器
3. 更新 preload API

### 阶段 3: 前端迁移
1. 修改 `SettingsView.vue` 使用 IPC
2. 添加自动迁移逻辑
3. 保留降级到 localStorage 的能力（离线模式）

### 阶段 4: 测试
1. 测试设置读写
2. 测试 localStorage 迁移
3. 测试多用户隔离
4. 测试云端同步

### 阶段 5: 上线
1. 发布新版本
2. 用户首次启动时自动迁移
3. 监控迁移成功率

---

## 🔒 安全考虑

1. **API Key 加密**
   - 使用 `encryption.ts` 中的加密函数
   - 数据库中存储加密后的 API Key
   - 读取时自动解密

2. **用户数据隔离**
   - 每个用户只能访问自己的设置
   - 通过 userId 进行权限控制

3. **数据验证**
   - 保存前验证数据格式
   - 使用 Zod 或 TypeScript 进行类型检查

---

## 🚀 优势

1. ✅ **数据持久化**：不会因清除缓存丢失
2. ✅ **多设备同步**：通过云端同步设置
3. ✅ **版本控制**：支持设置迁移和升级
4. ✅ **备份恢复**：支持导出/导入
5. ✅ **用户隔离**：多用户环境下数据隔离
6. ✅ **性能优化**：减少 localStorage 读写

---

## 📝 待办事项

- [ ] 创建 `settings-handlers.ts`
- [ ] 更新 preload API
- [ ] 修改 SettingsView.vue
- [ ] 添加迁移逻辑
- [ ] 创建设置导出/导入功能
- [ ] 编写单元测试
- [ ] 更新文档

---

## 🔗 相关文件

- `packages/database/src/storage-manager.ts` - 存储管理器
- `packages/database/prisma/schema.prisma` - 数据库 Schema
- `apps/desktop/electron/ipc/settings-handlers.ts` - 设置 IPC 处理器（待创建）
- `apps/desktop/src/views/SettingsView.vue` - 设置页面
- `apps/desktop/electron/preload/index.ts` - Preload API

