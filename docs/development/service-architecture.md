# 服务架构设计

## 🏗️ 架构概览

本项目采用**双实现架构**，每个业务服务都有两个实现：
- **远程实现**：通过 HTTP API 调用服务端
- **本地实现**：通过 Electron IPC 调用本地业务逻辑

在接口层统一判断使用哪种实现。

## 📁 目录结构

```
apps/desktop/
├── src/services/                    # 渲染进程 - 接口层
│   ├── base/                        # 基础设施（消除重复代码）
│   │   ├── service-factory.ts       # 统一的服务工厂
│   │   └── base-api-impl.ts         # 基础 API 实现类
│   │
│   ├── chat.service.ts              # Chat 服务接口 + 双实现
│   ├── ssh.service.ts               # SSH 服务接口 + 双实现
│   ├── settings.service.ts          # Settings 服务接口 + 双实现
│   └── ...
│
├── electron/services/               # 主进程 - 本地业务实现
│   ├── chat.service.ts              # Chat 本地业务逻辑（SQLite）
│   ├── ssh.service.ts               # SSH 本地业务逻辑
│   └── ...
│
├── electron/ipc/                    # IPC 处理器
│   ├── chat-handlers.ts             # Chat IPC 桥接
│   ├── ssh-handlers.ts              # SSH IPC 桥接
│   └── ...
│
└── electron/preload/                # 预加载脚本
    └── index.ts                     # 暴露给渲染进程的 API
```

## 🔄 数据流

### 本地模式（storageMode = 'local'）
```
Vue 组件
    ↓
chatService.createSession()
    ↓
ChatLocalImpl (判断逻辑选择)
    ↓
window.electronAPI.chat.createSession() (IPC)
    ↓
chat-handlers.ts (主进程 IPC)
    ↓
ChatLocalService (本地业务逻辑)
    ↓
SQLite 数据库
```

### 云端模式（storageMode = 'cloud'）
```
Vue 组件
    ↓
chatService.createSession()
    ↓
ChatApiImpl (判断逻辑选择)
    ↓
fetch() (HTTP 请求)
    ↓
Server API
    ↓
PostgreSQL 数据库
```

## 💡 实现示例

### 1. 定义接口和双实现（使用基础设施，无重复代码）

```typescript
// apps/desktop/src/services/chat.service.ts

import { createService } from './base/service-factory'
import { BaseApiImpl, BaseLocalImpl } from './base/base-api-impl'

// ============= 接口定义 =============
export interface IChatService {
  // ✨ 无需传 userId，自动从 localStorage 获取
  createSession(data: CreateSessionDto): Promise<ChatSession>
  getSessions(): Promise<ChatSession[]>
  // ... 其他方法
}

// ============= 远程 API 实现（继承基类，无需重复 HTTP 逻辑） =============
class ChatApiImpl extends BaseApiImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    // ✅ 完全无需传 userId！
    // 请求会自动携带 Authorization: Bearer <token>
    // 后端从 token 中解析 userId（更安全、更符合 RESTful 设计）
    return this.post('/api/chat/sessions', data)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    // ✅ 完全无需传 userId！后端从 token 解析
    return this.get('/api/chat/sessions')
  }
}

// ============= 本地 IPC 实现（继承基类，便捷访问 electronAPI） =============
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    // ✅ 使用 this.getUserId()
    // 本地模式：返回固定的 'local-user'（无需登录）
    // 云端模式：从 localStorage 获取真实用户 ID
    return this.electronAPI.chat.createSession(this.getUserId(), data)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    return this.electronAPI.chat.getSessions(this.getUserId())
  }
}

// ============= 导出实例（使用统一工厂，无需重复判断逻辑） =============
export const chatService = createService<IChatService>(
  'ChatService',
  ChatLocalImpl,
  ChatApiImpl
)
```

### 📦 基础设施说明

#### service-factory.ts（统一工具）
```typescript
// apps/desktop/src/services/base/service-factory.ts

// 统一的工具函数
export function getApiUrl(): string
export function getUserToken(): string
export function getStorageMode(): 'local' | 'cloud'
export function getUserId(): string

// HTTP 请求封装
export async function apiRequest<T>(endpoint: string, options?: RequestOptions): Promise<T>

// 服务工厂
export function createService<T>(
  serviceName: string,
  LocalImpl: new () => T,
  ApiImpl: new () => T
): T

// 响应式服务工厂（支持热切换）
export function createReactiveService<T>(...)
```

#### base-api-impl.ts（基础类）
```typescript
// apps/desktop/src/services/base/base-api-impl.ts

// 基础 API 实现类
export class BaseApiImpl {
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  protected async post<T>(endpoint: string, data?: any): Promise<T>
  protected async put<T>(endpoint: string, data?: any): Promise<T>
  protected async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  
  // ✅ 所有请求都会自动添加 Authorization: Bearer <token>
  // ✅ 后端从 token 中解析 userId，无需前端传递
}

// 基础本地实现类
export class BaseLocalImpl {
  protected get electronAPI() {
    return window.electronAPI
  }
}
```

### 🔐 Token 认证机制（云端模式）

**前端**：
- 所有 API 请求自动携带 `Authorization: Bearer <token>`
- token 从 `localStorage.getItem('userToken')` 或 `sessionStorage.getItem('userToken')` 获取
- **无需在请求中传递 userId**

**后端**：
- 从请求头中提取 token：`Authorization: Bearer <token>`
- 解析 token 获取 userId（例如 JWT 解析）
- 使用解析出的 userId 进行业务处理

**优势**：
- ✅ **更安全**：userId 由服务端从 token 解析，客户端无法伪造
- ✅ **更简洁**：前端无需传递 userId
- ✅ **符合标准**：符合 RESTful API 设计和 JWT 认证最佳实践

### 👤 本地用户 ID 处理

**问题**：本地模式只有一个用户，无需登录，获取不到 userId

**解决方案**：

```typescript
// service-factory.ts
export function getLocalUserId(): string {
  const storageMode = getStorageMode()
  
  if (storageMode === 'local') {
    // 本地模式：使用固定的默认用户 ID
    return 'local-user'
  } else {
    // 云端模式：从登录信息获取真实用户 ID
    return getUserId() || 'guest'
  }
}

// BaseLocalImpl
export class BaseLocalImpl {
  protected getUserId(): string {
    return getLocalUserId()  // 本地模式返回 'local-user'
  }
}
```

**使用**：
```typescript
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    // ✅ this.getUserId() 在本地模式自动返回 'local-user'
    return this.electronAPI.chat.createSession(this.getUserId(), data)
  }
}
```

**优势**：
- ✅ **无需登录**：本地模式使用固定 userId，无需登录流程
- ✅ **统一接口**：Local 实现也统一使用 `this.getUserId()`
- ✅ **自动切换**：根据 storageMode 自动返回正确的 userId

### 2. 本地业务逻辑实现

```typescript
// apps/desktop/electron/services/chat.service.ts

import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

export class ChatLocalService {
  private db: Database.Database

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'chat.db')
    this.db = new Database(dbPath)
    this.initTables()
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `)
  }

  createSession(userId: string, data: CreateSessionDto): ChatSession {
    const session = {
      id: nanoid(),
      userId,
      title: data.title,
      createdAt: Date.now()
    }
    
    this.db.prepare(`
      INSERT INTO chat_sessions (id, userId, title, createdAt)
      VALUES (?, ?, ?, ?)
    `).run(session.id, session.userId, session.title, session.createdAt)
    
    return session
  }

  getSessions(userId: string): ChatSession[] {
    return this.db.prepare(`
      SELECT * FROM chat_sessions 
      WHERE userId = ? 
      ORDER BY createdAt DESC
    `).all(userId) as ChatSession[]
  }
}
```

### 3. IPC 处理器

```typescript
// apps/desktop/electron/ipc/chat-handlers.ts

import { ipcMain } from 'electron'
import { getChatLocalService } from '../services/chat.service'

export function registerChatHandlers() {
  const chatService = getChatLocalService()

  ipcMain.handle('chat:create-session', async (event, userId, data) => {
    return chatService.createSession(userId, data)
  })

  ipcMain.handle('chat:get-sessions', async (event, userId) => {
    return chatService.getSessions(userId)
  })
}
```

### 4. Preload 暴露

```typescript
// apps/desktop/electron/preload/index.ts

const api = {
  // ... 其他 API
  
  chat: {
    createSession: (userId: string, data: any) =>
      ipcRenderer.invoke('chat:create-session', userId, data),
    getSessions: (userId: string) =>
      ipcRenderer.invoke('chat:get-sessions', userId)
  }
}
```

### 5. Vue 组件使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { chatService } from '@/services/chat.service'

const sessions = ref([])
const userId = ref('user-123')

onMounted(async () => {
  // 自动根据 storageMode 选择本地或远程
  sessions.value = await chatService.getSessions(userId.value)
})

async function createNewSession() {
  const session = await chatService.createSession(userId.value, {
    title: '新对话'
  })
  
  sessions.value.unshift(session)
}
</script>

<template>
  <div>
    <button @click="createNewSession">创建会话</button>
    
    <div v-for="session in sessions" :key="session.id">
      {{ session.title }}
    </div>
  </div>
</template>
```

## 🔧 配置存储模式

### 切换到本地模式
```typescript
localStorage.setItem('storageMode', 'local')
// 重新创建服务实例
const chatService = createChatService()
```

### 切换到云端模式
```typescript
localStorage.setItem('storageMode', 'cloud')
localStorage.setItem('apiUrl', 'https://api.example.com/api/v1')
localStorage.setItem('userToken', 'your-jwt-token')
// 重新创建服务实例
const chatService = createChatService()
```

## ✅ 优势

1. **统一接口**：业务代码不关心实现方式
2. **灵活切换**：轻松切换本地/云端模式
3. **易于测试**：可以模拟不同的实现
4. **代码复用**：接口定义只写一次
5. **类型安全**：TypeScript 完整支持

## 📝 添加新服务的步骤（极简化！）

### 1. 创建接口和双实现（只需 3 步）
```typescript
// apps/desktop/src/services/new-service.service.ts
import { createService } from './base/service-factory'
import { BaseApiImpl, BaseLocalImpl } from './base/base-api-impl'

// ① 定义接口
export interface INewService {
  doSomething(param: string): Promise<any>
}

// ② 远程实现（使用基类方法）
class NewServiceApiImpl extends BaseApiImpl implements INewService {
  async doSomething(param: string): Promise<any> {
    return this.post('/api/new-service/do-something', { param })
  }
}

// ③ 本地实现（使用 electronAPI）
class NewServiceLocalImpl extends BaseLocalImpl implements INewService {
  async doSomething(param: string): Promise<any> {
    return this.electronAPI.newService.doSomething(param)
  }
}

// ④ 导出（自动根据 storageMode 选择实现）
export const newService = createService<INewService>(
  'NewService',
  NewServiceLocalImpl,
  NewServiceApiImpl
)
```

**对比旧方式的优势：**
- ❌ 旧方式：需要写 `getApiUrl()`、`getUserToken()`、`fetch()` 等重复代码
- ✅ 新方式：只需 `this.post()`、`this.get()` 等简洁调用
- ❌ 旧方式：需要写 `createNewService()` 工厂函数和判断逻辑
- ✅ 新方式：直接用 `createService()`，一行搞定

### 2. 创建本地业务逻辑
```typescript
// apps/desktop/electron/services/new-service.service.ts
export class NewServiceLocal {
  doSomething() { ... }
}
```

### 3. 创建 IPC 处理器
```typescript
// apps/desktop/electron/ipc/new-service-handlers.ts
export function registerNewServiceHandlers() { ... }
```

### 4. 在 preload 中暴露
```typescript
// apps/desktop/electron/preload/index.ts
const api = {
  newService: {
    doSomething: () => ipcRenderer.invoke('new-service:do-something')
  }
}
```

### 5. 注册处理器
```typescript
// apps/desktop/electron/main/index.ts
import { registerNewServiceHandlers } from '../ipc/new-service-handlers'

app.whenReady().then(() => {
  registerNewServiceHandlers()
})
```

## 🎯 最佳实践

1. **接口优先**：先定义接口，再实现
2. **统一错误处理**：在接口层处理错误
3. **日志记录**：记录每个操作的日志
4. **权限检查**：在本地业务逻辑中验证用户权限
5. **数据验证**：在接口层验证输入数据

