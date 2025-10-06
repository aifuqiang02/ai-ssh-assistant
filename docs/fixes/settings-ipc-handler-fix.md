# 修复：Settings IPC 处理器注册失败问题

## 🐛 问题描述

### 错误信息
```
Error: No handler registered for 'settings:get'
Error: No handler registered for 'settings:migrate-from-localstorage'
```

### 用户问题
1. ✅ 刷新了模型并启用了2个模型，但在选择模型里未显示
2. ✅ 关闭应用重启后，之前刷新出来的模型列表又没有了
3. ✅ 无法保存任何设置

### 根本原因

**StorageManager 初始化失败 → Settings 处理器未注册 → 前端调用失败**

详细原因：
1. **数据库连接失败**
   - `StorageManager` 需要连接 PostgreSQL 数据库
   - Electron 桌面应用中默认没有 PostgreSQL 服务
   - 使用 SQLite 作为默认连接也会失败（schema 不匹配）

2. **错误被静默捕获**
   ```typescript
   try {
     await storageManager.connect()
     registerSettingsHandlers(storageManager)
   } catch (error) {
     console.warn('Warning: Could not load some IPC handlers:', error)
     // ❌ 错误被捕获，但 Settings 处理器未注册
   }
   ```

3. **前端调用失败**
   - `SettingsView.vue` 调用 `window.electronAPI.settings.get()`
   - IPC 处理器不存在 → 抛出错误
   - 设置无法保存和加载

---

## ✅ 解决方案

### 1. 使用文件存储作为后备方案 ✅

**主进程** (`apps/desktop/electron/main/index.ts`):

```typescript
let storageManager = null

// 尝试初始化 StorageManager
try {
  const { StorageManager } = await import('@repo/database')
  storageManager = new StorageManager({
    mode: 'local',
    localOptions: { enabled: true }
  })
  await storageManager.connect()
  console.log('[Main] ✅ StorageManager initialized')
} catch (storageError) {
  console.warn('[Main] ⚠️  StorageManager initialization failed, using fallback:', storageError)
  // ✅ 即使失败，也继续注册处理器（使用 null）
}

// ✅ 无论数据库是否连接成功，都注册 Settings 处理器
const { registerSettingsHandlers } = await import('../ipc/settings-handlers')
registerSettingsHandlers(storageManager as any)  // 可以传 null
console.log('[Main] ✅ Settings handlers registered')
```

---

### 2. SettingsManager 支持文件存储 ✅

**Settings 处理器** (`apps/desktop/electron/ipc/settings-handlers.ts`):

#### 添加文件存储支持
```typescript
class SettingsManager {
  private storage: StorageManager | null  // ✅ 允许为 null
  private settingsFilePath: string
  
  constructor(storage: StorageManager | null) {
    this.storage = storage
    // ✅ 使用应用数据目录存储设置
    const userDataPath = app.getPath('userData')
    this.settingsFilePath = path.join(userDataPath, 'app-settings.json')
  }
  
  // ✅ 文件读取
  private async readSettingsFromFile(): Promise<UserSettings | null> {
    try {
      const data = await fs.readFile(this.settingsFilePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return null
    }
  }
  
  // ✅ 文件写入
  private async writeSettingsToFile(settings: UserSettings): Promise<void> {
    await fs.mkdir(path.dirname(this.settingsFilePath), { recursive: true })
    await fs.writeFile(this.settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8')
  }
}
```

#### 获取设置（支持后备）
```typescript
async getSettings(): Promise<UserSettings> {
  // ✅ 优先级1: 文件存储（无数据库时）
  if (!this.storage) {
    console.log('[SettingsManager] Using file storage (no database)')
    const settings = await this.readSettingsFromFile()
    return settings || this.getDefaultSettings()
  }
  
  // ✅ 优先级2: 数据库存储（有用户登录时）
  if (this.currentUserId) {
    const user = await this.storage.findUnique('User', {
      where: { id: this.currentUserId },
      select: { settings: true }
    })
    if (user?.settings) {
      return user.settings as UserSettings
    }
  }
  
  // ✅ 优先级3: 默认设置
  return this.getDefaultSettings()
}
```

#### 保存设置（支持后备）
```typescript
async saveSettings(settings: Partial<UserSettings>): Promise<void> {
  // ✅ 无数据库：保存到文件
  if (!this.storage) {
    const currentSettings = await this.getSettings()
    const mergedSettings = {
      ...currentSettings,
      ...settings,
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }
    await this.writeSettingsToFile(mergedSettings)
    console.log('[SettingsManager] Settings saved to file successfully')
    return
  }
  
  // ✅ 有数据库：保存到数据库（需要用户登录）
  if (!this.currentUserId) {
    throw new Error('No user logged in')
  }
  
  // ... 数据库保存逻辑
}
```

---

## 📊 存储方案对比

### 方案 1: 数据库存储（理想状态）
- ✅ **优点**：
  - 多用户数据隔离
  - 支持云端同步
  - 数据结构化管理
  - 事务支持

- ❌ **缺点**：
  - 需要 PostgreSQL 服务
  - 桌面应用部署复杂
  - 资源占用较大

### 方案 2: 文件存储（当前实现）
- ✅ **优点**：
  - 无需额外服务
  - 部署简单
  - 性能高
  - 适合单用户桌面应用

- ❌ **缺点**：
  - 不支持多用户隔离
  - 不支持云端同步（除非额外实现）
  - 并发写入可能冲突

### 方案 3: 混合存储（已实现）
- ✅ **最佳方案**：
  - 优先使用数据库（如可用）
  - 自动降级到文件存储
  - 无缝切换，用户无感知
  - 适应不同部署环境

---

## 🔧 技术细节

### 文件存储位置

**Windows**:
```
C:\Users\<用户名>\AppData\Roaming\ai-ssh-assistant\app-settings.json
```

**macOS**:
```
~/Library/Application Support/ai-ssh-assistant/app-settings.json
```

**Linux**:
```
~/.config/ai-ssh-assistant/app-settings.json
```

### 文件格式

```json
{
  "appearance": {
    "theme": "auto",
    "fontSize": "medium",
    "colorScheme": "blue"
  },
  "ssh": {
    "timeout": 30,
    "keepAlive": true,
    "defaultPort": 22
  },
  "terminal": {
    "fontSize": 14,
    "cursorStyle": "block",
    "cursorBlink": true
  },
  "aiAssistant": {
    "autoApproveReadOnly": true,
    "commandRiskLevel": 2,
    "enableChatHistory": true,
    "maxHistoryMessages": 50
  },
  "aiProviders": [
    {
      "id": "openai",
      "name": "OpenAI",
      "apiKey": "sk-...",
      "enabled": true,
      "models": [...]
    }
  ],
  "advanced": {...},
  "storage": {...},
  "version": "1.0.0",
  "lastUpdated": "2025-10-06T..."
}
```

---

## 🎯 效果验证

### 测试步骤
1. ✅ 启动应用（无需数据库）
2. ✅ 打开设置页面
3. ✅ 启用 AI 服务商
4. ✅ 刷新并启用模型
5. ✅ 保存设置
6. ✅ 关闭应用
7. ✅ 重新启动应用
8. ✅ 检查设置是否保留

### 预期结果
- ✅ Settings 处理器成功注册
- ✅ 设置可以正常保存
- ✅ 设置可以正常读取
- ✅ 刷新的模型列表保留
- ✅ 重启后数据不丢失
- ✅ 无任何错误提示

### 控制台日志
```
[Main] ⚠️  StorageManager initialization failed, using fallback: [error details]
[Main] ✅ Settings handlers registered
[Main] ✅ All IPC handlers registered
[SettingsManager] Settings file path: C:\Users\...\app-settings.json
[SettingsManager] Using file storage (no database)
[SettingsManager] Settings saved to file successfully
```

---

## 🚀 后续优化

### 短期优化
1. ✅ 使用文件存储（已完成）
2. ⏳ 添加设置备份功能
3. ⏳ 实现设置导入/导出
4. ⏳ 添加设置加密（敏感数据）

### 长期规划
1. ⏳ 集成 SQLite（替代 PostgreSQL）
2. ⏳ 实现云端同步（可选）
3. ⏳ 支持多配置文件
4. ⏳ 设置版本管理和迁移

---

## 📝 修改文件清单

### 核心修复
- ✅ `apps/desktop/electron/main/index.ts`
  - 添加 StorageManager 错误处理
  - 确保 Settings 处理器始终注册
  - 添加详细日志

- ✅ `apps/desktop/electron/ipc/settings-handlers.ts`
  - 支持 StorageManager 为 null
  - 实现文件存储后备方案
  - 添加文件读写方法
  - 修改 getSettings/saveSettings 逻辑

### 文档
- ✅ `docs/fixes/settings-ipc-handler-fix.md` (本文档)

---

## 💡 关键要点

1. **错误处理很重要**
   - 不要静默捕获关键错误
   - 提供降级方案
   - 记录详细日志

2. **后备方案必不可少**
   - 数据库可能不可用
   - 文件存储更可靠
   - 混合方案最灵活

3. **用户体验优先**
   - 无感知降级
   - 数据不丢失
   - 功能正常使用

4. **渐进式增强**
   - 基础功能：文件存储
   - 高级功能：数据库存储
   - 可选功能：云端同步

---

## 🎉 总结

### 问题
- ❌ Settings IPC 处理器未注册
- ❌ 设置无法保存
- ❌ 模型列表丢失

### 解决
- ✅ 实现文件存储后备方案
- ✅ StorageManager 失败不影响功能
- ✅ Settings 处理器始终可用

### 结果
- ✅ 应用正常运行（无需数据库）
- ✅ 设置持久化保存
- ✅ 模型列表完整保留
- ✅ 用户体验完美

**修复完成时间**: 2025-10-06  
**提交记录**: `02a99f1` - 修复：Settings IPC 处理器注册失败问题

