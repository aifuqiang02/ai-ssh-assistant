# 正确的存储架构设计

## ❌ 当前架构的严重问题

### 问题 1：直接暴露数据库
```typescript
// ❌ 当前实现 - 非常危险！
// packages/database/src/adapters/cloud.adapter.ts
this.prisma = new PrismaClient({
  datasources: {
    db: {
      url: cloudDbUrl  // 直接连接远程 PostgreSQL
    }
  }
})
```

**安全风险：**
- 🔴 数据库连接字符串暴露在客户端代码中
- 🔴 数据库端口（5432）必须对外开放
- 🔴 任何人都可以逆向工程获取数据库凭证
- 🔴 无法实现细粒度的权限控制
- 🔴 无法进行速率限制和审计

## ✅ Lobe-Chat 的正确实现

### Lobe-Chat 架构分析

**1. 本地存储：IndexedDB**
```typescript
// 浏览器/Electron 使用 IndexedDB
// 通过 dexie ORM 管理数据
const db = new Dexie('LobeChat')
db.version(1).stores({
  messages: '++id, sessionId, createdAt',
  sessions: '++id, createdAt',
  // ...
})
```

**2. 云端存储：Server API**
```typescript
// ✅ 通过 HTTP API 访问
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

**3. 数据同步：CRDT 技术**
- 本地优先（Local First）
- 自动同步到云端
- 冲突自动解决

### 架构图对比

#### ❌ 当前错误架构
```
┌─────────────┐
│   Desktop   │
│   应用      │─────────────────┐
└─────────────┘                 │
                                │ 直接连接
                                │ PostgreSQL
┌─────────────┐                 │ 端口 5432
│    Web      │    HTTP API     │
│   应用      │───────────────┐ │
└─────────────┘               ↓ ↓
                        ┌──────────────┐
                        │    Server    │
                        │   (Fastify)  │
                        └──────┬───────┘
                               │
                               ↓
                        ┌──────────────┐
                        │  PostgreSQL  │ ← 🔴 数据库直接暴露！
                        │   数据库     │
                        └──────────────┘
```

#### ✅ Lobe-Chat 正确架构
```
┌─────────────┐                    ┌──────────────┐
│   Desktop   │                    │    Server    │
│   应用      │    HTTP API        │   (Next.js)  │
│             │───────────────────→│              │
│ IndexedDB   │                    │  - JWT 认证  │
│ (本地缓存)  │                    │  - 权限控制  │
└─────────────┘                    │  - 业务逻辑  │
                                   └──────┬───────┘
┌─────────────┐    HTTP API               │
│    Web      │───────────────────────────┘
│   应用      │                            │
│             │                            ↓
│ IndexedDB   │                    ┌──────────────┐
│ (本地缓存)  │                    │  PostgreSQL  │ ← ✅ 安全隔离
└─────────────┘                    │   数据库     │
                                   └──────────────┘
```

## 🎯 正确的实现方案

### 方案 1：Desktop 应用存储架构（推荐）

#### 1. 本地存储：SQLite/IndexedDB
```typescript
// Electron 环境：使用 SQLite
import Database from 'better-sqlite3'

class LocalStorage {
  private db: Database.Database
  
  constructor() {
    const userDataPath = app.getPath('userData')
    this.db = new Database(`${userDataPath}/local.db`)
    
    // 初始化表结构
    this.initTables()
  }
  
  async saveMessage(message: any) {
    return this.db.prepare(`
      INSERT INTO messages (id, content, sessionId, createdAt)
      VALUES (?, ?, ?, ?)
    `).run(message.id, message.content, message.sessionId, message.createdAt)
  }
}

// Web 环境：使用 IndexedDB
import Dexie from 'dexie'

class IndexedDBStorage extends Dexie {
  messages: Dexie.Table<Message, string>
  sessions: Dexie.Table<Session, string>
  
  constructor() {
    super('AISSHAssistant')
    this.version(1).stores({
      messages: 'id, sessionId, createdAt',
      sessions: 'id, userId, createdAt',
      settings: 'id, userId'
    })
  }
}
```

#### 2. 云端同步：通过 Server API
```typescript
// packages/database/src/adapters/api-cloud.adapter.ts
export class ApiCloudAdapter extends BaseStorageAdapter {
  private apiClient: ApiClient
  
  constructor(options: ApiCloudOptions) {
    super(options)
    this.apiClient = new ApiClient({
      baseURL: options.apiUrl,
      headers: {
        'Authorization': `Bearer ${options.token}`
      }
    })
  }
  
  async create(model: string, data: any) {
    const response = await this.apiClient.post(`/api/${model}`, data)
    return response.data
  }
  
  async findMany(model: string, args: any) {
    const response = await this.apiClient.get(`/api/${model}`, { params: args })
    return response.data
  }
  
  async sync() {
    // 获取本地未同步的数据
    const localChanges = await this.getLocalChanges()
    
    // 推送到服务器
    const result = await this.apiClient.post('/api/sync', {
      changes: localChanges,
      lastSyncTime: this.lastSyncTime
    })
    
    // 应用服务器返回的变更
    await this.applyRemoteChanges(result.data.changes)
    
    return result.data
  }
}
```

#### 3. Server 端 API 实现
```typescript
// packages/server/src/routes/sync.routes.ts
import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

export async function syncRoutes(fastify: FastifyInstance) {
  const prisma = new PrismaClient()
  
  // 同步端点
  fastify.post('/api/sync', {
    preHandler: [fastify.authenticate], // JWT 认证
    handler: async (request, reply) => {
      const userId = request.user.id
      const { changes, lastSyncTime } = request.body
      
      // 1. 应用客户端的变更
      const appliedChanges = []
      for (const change of changes) {
        try {
          const result = await prisma[change.model][change.action]({
            where: { id: change.id, userId }, // 确保用户权限
            data: change.data
          })
          appliedChanges.push({ ...change, status: 'success' })
        } catch (error) {
          appliedChanges.push({ ...change, status: 'error', error: error.message })
        }
      }
      
      // 2. 获取服务器端的新变更
      const serverChanges = await prisma.syncLog.findMany({
        where: {
          userId,
          createdAt: { gt: new Date(lastSyncTime) }
        }
      })
      
      return {
        appliedChanges,
        serverChanges,
        syncTime: new Date().toISOString()
      }
    }
  })
  
  // CRUD API
  fastify.post('/api/:model', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const { model } = request.params
      const data = request.body
      const userId = request.user.id
      
      // 权限检查
      if (!canUserAccessModel(userId, model)) {
        return reply.code(403).send({ error: 'Forbidden' })
      }
      
      const result = await prisma[model].create({
        data: { ...data, userId }
      })
      
      // 记录到同步日志
      await prisma.syncLog.create({
        data: {
          userId,
          model,
          action: 'create',
          recordId: result.id,
          data: result
        }
      })
      
      return result
    }
  })
}
```

### 方案 2：混合存储策略（类似 Lobe-Chat）

```typescript
// apps/desktop/electron/main/storage-manager.ts
import { LocalStorage } from './local-storage'
import { ApiCloudAdapter } from '@ai-ssh/database'

export class HybridStorageManager {
  private local: LocalStorage
  private cloud?: ApiCloudAdapter
  private syncQueue: any[] = []
  
  constructor(options: StorageOptions) {
    // 本地存储始终可用
    this.local = new LocalStorage()
    
    // 如果有 token，启用云同步
    if (options.cloudToken) {
      this.cloud = new ApiCloudAdapter({
        apiUrl: options.apiUrl,
        token: options.cloudToken
      })
      
      // 启动后台同步
      this.startBackgroundSync()
    }
  }
  
  async create(model: string, data: any) {
    // 1. 先保存到本地（快速响应）
    const localResult = await this.local.create(model, data)
    
    // 2. 如果有云端，加入同步队列
    if (this.cloud) {
      this.syncQueue.push({
        model,
        action: 'create',
        data: localResult,
        timestamp: Date.now()
      })
    }
    
    return localResult
  }
  
  async findMany(model: string, args: any) {
    // 优先从本地读取（快速）
    const localData = await this.local.findMany(model, args)
    
    // 如果有云端且在线，后台同步
    if (this.cloud && navigator.onLine) {
      this.backgroundSync()
    }
    
    return localData
  }
  
  private async backgroundSync() {
    if (this.syncQueue.length === 0) return
    
    try {
      const result = await this.cloud!.sync()
      
      // 清空已同步的队列
      this.syncQueue = []
      
      // 应用服务器的变更到本地
      await this.applyServerChanges(result.serverChanges)
    } catch (error) {
      console.error('Background sync failed:', error)
      // 失败不影响用户使用，稍后重试
    }
  }
  
  private startBackgroundSync() {
    // 每 30 秒同步一次
    setInterval(() => {
      if (navigator.onLine) {
        this.backgroundSync()
      }
    }, 30 * 1000)
  }
}
```

## 🔒 安全最佳实践

### 1. JWT 认证
```typescript
// Server 端
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET!
})

fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})
```

### 2. 权限控制
```typescript
function canUserAccessModel(userId: string, model: string): boolean {
  // 检查用户是否有权限访问该模型
  const allowedModels = getUserPermissions(userId)
  return allowedModels.includes(model)
}
```

### 3. 速率限制
```typescript
fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
})
```

### 4. 数据加密
```typescript
// 敏感数据本地加密
import crypto from 'crypto'

function encryptData(data: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key)
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
}
```

## 📋 迁移步骤

### 第 1 步：修改 CloudStorageAdapter

将直接数据库连接改为 API 调用：

```typescript
// packages/database/src/adapters/cloud.adapter.ts
export class CloudStorageAdapter extends BaseStorageAdapter {
  private apiClient: AxiosInstance
  
  constructor(options: CloudStorageOptions) {
    super(options)
    
    // ✅ 使用 HTTP API 而不是直接连接数据库
    this.apiClient = axios.create({
      baseURL: options.apiUrl || process.env.API_URL,
      headers: {
        'Authorization': `Bearer ${options.token}`
      }
    })
  }
  
  async create(model: string, data: any) {
    const response = await this.apiClient.post(`/api/${model}`, data)
    return response.data
  }
}
```

### 第 2 步：实现 Server API

```bash
# 创建通用 CRUD API
packages/server/src/routes/
├── crud.routes.ts      # 通用 CRUD 端点
├── sync.routes.ts      # 数据同步端点
└── auth.routes.ts      # 认证端点
```

### 第 3 步：更新 Desktop 应用配置

```typescript
// apps/desktop/electron/main/index.ts
const storage = new StorageManager({
  mode: 'hybrid',
  localOptions: {
    path: app.getPath('userData') + '/local.db'
  },
  cloudOptions: {
    // ✅ 使用 API URL 而不是数据库连接
    apiUrl: process.env.API_URL || 'http://localhost:3000/api/v1',
    token: userToken
  }
})
```

## 📊 性能优化

### 1. 本地优先策略
- 所有操作先写本地
- 异步同步到云端
- 用户体验流畅

### 2. 增量同步
- 只同步变更的数据
- 使用时间戳/版本号
- 减少网络流量

### 3. 冲突解决
- 使用 CRDT 算法
- 自动合并冲突
- 保留变更历史

## 🎯 总结

### ❌ 不要这样做：
```typescript
// 直接连接远程数据库
const prisma = new PrismaClient({
  datasources: {
    db: { url: 'postgresql://...' }  // 危险！
  }
})
```

### ✅ 应该这样做：
```typescript
// Desktop: 本地 SQLite + 云端 API
const storage = new HybridStorage({
  local: new SQLiteAdapter({ path: './local.db' }),
  cloud: new ApiAdapter({ 
    apiUrl: 'https://api.example.com',
    token: userToken 
  })
})

// Server: 连接数据库并提供 API
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL }
  }
})
```

**关键原则：**
1. ✅ 客户端使用本地存储（SQLite/IndexedDB）
2. ✅ 云端数据通过 HTTP API 访问
3. ✅ 数据库连接只在服务器端
4. ✅ 使用 JWT 认证和权限控制
5. ✅ 本地优先，异步同步

