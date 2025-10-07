# 设置存储架构重新设计

## 🎯 设计目标

将设置存储从 **直接数据库连接** 改为 **本地存储 + API 调用** 的混合模式，符合桌面应用的最佳实践。

---

## ❌ 旧架构的问题

### 问题 1: 桌面应用直接连接数据库
```
Electron Desktop App
  └── StorageManager (PostgreSQL)  ❌
      └── 桌面应用不应该直接连接数据库
      └── 依赖 @repo/database (Prisma)
      └── 需要 PostgreSQL 在本地运行
```

**问题**：
- ❌ 桌面应用不应该直接连接远程数据库
- ❌ 依赖复杂（Prisma, PostgreSQL驱动等）
- ❌ 安全风险（数据库凭据暴露）
- ❌ 性能问题（每次读写都要网络请求）
- ❌ 离线无法使用

---

## ✅ 新架构

###架构图

```
┌─────────────────────────────────────────────┐
│          Electron Desktop App                │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │  SettingsStorageService                │ │
│  │                                        │ │
│  │  ┌─────────────┐  ┌─────────────────┐ │ │
│  │  │ 本地存储    │  │   云端存储      │ │ │
│  │  │             │  │                 │ │ │
│  │  │ 文件存储    │  │  HTTP API       │ │ │
│  │  │ app-        │  │  └──────────┐   │ │ │
│  │  │ settings    │  │             ↓   │ │ │
│  │  │ .json       │  │    Server API   │ │ │
│  │  └─────────────┘  └─────────────────┘ │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
                                │
                                ↓
                    ┌───────────────────────┐
                    │   Server (Node.js)    │
                    │                       │
                    │  packages/server      │
                    │        ↓              │
                    │   PostgreSQL DB       │
                    └───────────────────────┘
```

### 三种存储模式

#### 1. **Local 模式** (默认)
```typescript
storageMode: 'local'

// 仅使用本地文件存储
读取: Local File (app-settings.json)
写入: Local File (app-settings.json)
```

**适用场景**：
- ✅ 无需登录
- ✅ 离线使用
- ✅ 隐私保护
- ✅ 快速响应

#### 2. **Cloud 模式**
```typescript
storageMode: 'cloud'

// 仅使用云端存储（失败时降级到本地）
读取: HTTP API → Server → Database
写入: HTTP API → Server → Database
失败降级: Local File
```

**适用场景**：
- ✅ 需要跨设备同步
- ✅ 用户已登录
- ✅ 有网络连接
- ⚠️  离线时自动降级到本地

#### 3. **Hybrid 模式** (推荐)
```typescript
storageMode: 'hybrid'

// 本地 + 云端双向同步
读取: 优先 HTTP API，失败则 Local File
写入: Local File + HTTP API (异步)
同步: 双向同步
```

**适用场景**：
- ✅ 最佳用户体验
- ✅ 离线可用
- ✅ 自动同步
- ✅ 性能最优

---

## 📁 核心文件

### 1. **SettingsStorageService** ⭐
**路径**: `apps/desktop/electron/services/settings-storage.service.ts`

**职责**：
- ✅ 管理本地文件存储
- ✅ 通过 HTTP API 调用服务端
- ✅ 处理三种存储模式的逻辑
- ✅ 提供同步、导入、导出功能

**关键方法**：
```typescript
class SettingsStorageService {
  // 获取设置
  async getSettings(): Promise<UserSettings>
  
  // 保存设置
  async saveSettings(settings: UserSettings): Promise<void>
  
  // 同步设置（hybrid 模式）
  async syncSettings(): Promise<{ success: boolean; message: string }>
  
  // 设置存储模式
  setStorageMode(mode: 'local' | 'cloud' | 'hybrid'): void
  
  // 设置云端配置
  setCloudConfig(config: { apiEndpoint: string; userToken: string } | null): void
}
```

### 2. **Settings IPC Handlers**
**路径**: `apps/desktop/electron/ipc/settings-handlers.new.ts`

**职责**：
- ✅ 注册 IPC 处理器
- ✅ 桥接 Renderer 和 Main 进程
- ✅ 调用 SettingsStorageService

**IPC 方法**：
```typescript
// 获取设置
'settings:get' → getSettings()

// 保存设置
'settings:save' → saveSettings(settings)

// 同步设置
'settings:sync' → syncSettings()

// 设置存储模式
'settings:set-storage-mode' → setStorageMode(mode)

// 设置云端配置
'settings:set-cloud-config' → setCloudConfig(config)

// 导入/导出
'settings:export' → exportSettings(path)
'settings:import' → importSettings(path)

// 重置
'settings:reset' → resetSettings()
```

### 3. **Preload API**
**路径**: `apps/desktop/electron/preload/index.ts`

**更新**：
```typescript
// ❌ 移除
setUser(userId: string | null)

// ✅ 新增
setStorageMode(mode: 'local' | 'cloud' | 'hybrid')
setCloudConfig(config: { apiEndpoint: string; userToken: string } | null)
sync() → Promise<{ success: boolean; message: string }>
```

### 4. **SettingsView.vue**
**路径**: `apps/desktop/src/views/SettingsView.vue`

**更新**：
- ✅ `onMounted`: 根据登录状态设置云端配置
- ✅ `onLoginSuccess`: 登录时设置云端配置和存储模式
- ✅ `logout`: 登出时清除云端配置，切换到本地模式
- ✅ `onStorageModeChange`: 存储模式变化时通知服务
- ✅ `manualSync`: 使用新的 sync API

---

## 🔄 工作流程

### 场景 1: 本地模式（未登录）

```
用户操作: 修改设置 → 保存
  ↓
SettingsView.vue: saveSettings()
  ↓
IPC: 'settings:save'
  ↓
SettingsStorageService: saveSettings()
  ↓
Local File: app-settings.json (写入)
  ↓
✅ 完成
```

### 场景 2: 云端模式（已登录）

```
用户操作: 修改设置 → 保存
  ↓
SettingsView.vue: saveSettings()
  ↓
IPC: 'settings:save'
  ↓
SettingsStorageService: saveSettings()
  ↓
HTTP POST: /api/settings
  ↓
Server API: 保存到 PostgreSQL
  ↓
成功 ✅ / 失败 ❌ (降级到本地)
  ↓
✅ 完成
```

### 场景 3: 混合模式（已登录，最佳体验）

```
用户操作: 修改设置 → 保存
  ↓
SettingsView.vue: saveSettings()
  ↓
IPC: 'settings:save'
  ↓
SettingsStorageService: saveSettings()
  ├─ (同步) Local File: 立即写入
  └─ (异步) HTTP POST: /api/settings
              ↓
         Server API: 保存到 PostgreSQL
              ↓
         成功 ✅ / 失败 ❌ (不影响本地)
  ↓
✅ 完成（立即响应）
```

### 场景 4: 用户登录流程

```
用户操作: 点击登录 → 输入凭据
  ↓
Login API: POST /api/auth/login
  ↓
返回: { user: {...}, token: "..." }
  ↓
SettingsView: onLoginSuccess()
  ├─ setCloudConfig({ apiEndpoint, userToken })
  ├─ setStorageMode('hybrid')  // 如果用户选择了云端/混合
  └─ loadSettings()  // 从云端加载设置
  ↓
✅ 登录成功，云端同步激活
```

### 场景 5: 用户登出流程

```
用户操作: 点击登出
  ↓
SettingsView: logout()
  ├─ 清除 localStorage/sessionStorage
  ├─ setCloudConfig(null)
  └─ setStorageMode('local')
  ↓
SettingsStorageService: 切换到本地模式
  ↓
✅ 登出成功，使用本地存储
```

---

## 🔧 API 接口设计（Server 端）

### 获取用户设置
```http
GET /api/settings
Authorization: Bearer <token>

Response:
{
  "settings": {
    "appearance": {...},
    "ssh": {...},
    ...
  }
}
```

### 保存用户设置
```http
POST /api/settings
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "settings": {
    "appearance": {...},
    "ssh": {...},
    ...
  }
}

Response:
{
  "success": true,
  "message": "Settings saved successfully"
}
```

---

## 📊 对比

| 特性 | 旧架构 (StorageManager) | 新架构 (SettingsStorageService) |
|------|------------------------|--------------------------------|
| **数据库连接** | ❌ 直接连接 PostgreSQL | ✅ 无直接连接 |
| **依赖** | ❌ Prisma, @repo/database | ✅ 仅 axios, fs |
| **离线使用** | ❌ 需要数据库可用 | ✅ 完全离线可用 |
| **安全性** | ❌ 凭据暴露风险 | ✅ 仅 HTTP token |
| **性能** | ⚠️  每次网络请求 | ✅ 本地优先，快速响应 |
| **跨设备同步** | ✅ 支持 | ✅ 支持 (通过 API) |
| **架构清晰度** | ⚠️  混淆桌面/服务端 | ✅ 分离明确 |
| **可维护性** | ⚠️  依赖复杂 | ✅ 简单清晰 |

---

## 🎯 迁移步骤

### ✅ 已完成
1. ✅ 创建 `SettingsStorageService`
2. ✅ 创建新的 `settings-handlers.new.ts`
3. ✅ 更新 `main/index.ts` 使用新 handlers
4. ✅ 更新 `preload/index.ts` API
5. ✅ 更新 `SettingsView.vue` 调用新 API

### ⏳ 待完成
1. ⏳ 实现 Server 端 API (`packages/server/src/routes/settings.ts`)
2. ⏳ 删除旧的 `settings-handlers.ts`
3. ⏳ 移除 `@ai-ssh/database` 依赖（从 desktop app）
4. ⏳ 测试三种存储模式
5. ⏳ 添加单元测试

---

## 🚀 下一步

### 短期 (Server API)
```typescript
// packages/server/src/routes/settings.ts
import express from 'express'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// GET /api/settings
router.get('/settings', authenticateToken, async (req, res) => {
  // 从数据库获取用户设置
  const userId = req.user.id
  const settings = await prisma.userSettings.findUnique({
    where: { userId }
  })
  
  res.json({ settings: settings?.data || {} })
})

// POST /api/settings
router.post('/settings', authenticateToken, async (req, res) => {
  // 保存用户设置到数据库
  const userId = req.user.id
  const { settings } = req.body
  
  await prisma.userSettings.upsert({
    where: { userId },
    update: { data: settings },
    create: { userId, data: settings }
  })
  
  res.json({ success: true })
})

export default router
```

### 长期优化
1. ✅ 增量同步（仅同步变更的部分）
2. ✅ 冲突解决策略（多设备同时修改）
3. ✅ 设置版本控制
4. ✅ 压缩传输数据
5. ✅ 缓存优化

---

## 📝 总结

### 核心原则
- ✅ **桌面应用不直接连接数据库**
- ✅ **本地优先，云端同步**
- ✅ **API 调用，而非直接数据库访问**
- ✅ **离线可用，在线同步**

### 架构优势
- ✅ **简化依赖**：移除 Prisma 和数据库驱动
- ✅ **提升性能**：本地文件读写 vs 数据库查询
- ✅ **增强安全**：HTTP token vs 数据库凭据
- ✅ **清晰分离**：桌面端 vs 服务端职责明确

### 用户体验
- ✅ **快速响应**：本地读写几乎无延迟
- ✅ **离线可用**：无网络也能正常使用
- ✅ **自动同步**：联网时自动同步到云端
- ✅ **跨设备**：多设备数据一致

---

**文档版本**: 1.0  
**创建时间**: 2025-10-07  
**作者**: AI Assistant

