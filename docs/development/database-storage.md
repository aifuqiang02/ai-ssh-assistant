# 数据存储架构

本项目实现了一套完整的双模式存储架构，支持本地优先（Local-First）和云端同步两种模式。

## 🎯 架构概述

### 设计原则

1. **本地优先（Local-First）**：数据优先存储在本地，提供离线使用能力
2. **双模式切换**：用户可以选择纯本地模式或云端同步模式
3. **统一接口**：服务层提供统一的接口，屏蔽底层实现差异
4. **安全性**：桌面应用不直接连接远程数据库，通过 API 访问

### 技术栈

- **本地存储**：better-sqlite3（Electron 主进程）
- **云端存储**：PostgreSQL + Prisma（后端服务）
- **IPC 通信**：Electron IPC（渲染进程 ↔ 主进程）
- **API 通信**：HTTP REST API + JWT 认证

## 📦 存储模式

### 模式 1: 本地模式（Local Mode）

**特点**：
- ✅ 完全离线工作
- ✅ 数据隐私性最高
- ✅ 无需登录和网络
- ✅ 响应速度最快
- ❌ 无法跨设备同步

**数据流**：
```
渲染进程 → IPC → 主进程 → better-sqlite3 → 本地 SQLite 文件
```

**技术实现**：
- 前端调用 `window.electronAPI.*` 方法
- Electron 主进程处理 IPC 消息
- 使用 `better-sqlite3` 操作本地 SQLite 数据库
- 用户 ID 固定为 `'local-user'`

### 模式 2: 云端模式（Cloud Mode）

**特点**：
- ✅ 自动跨设备同步
- ✅ 数据云端备份
- ✅ 多用户协作
- ✅ 服务端计算能力
- ❌ 需要网络连接
- ❌ 需要用户登录

**数据流**：
```
渲染进程 → HTTP API → 后端服务 → Prisma → PostgreSQL
```

**技术实现**：
- 前端调用 HTTP REST API
- JWT Token 认证
- 后端服务处理业务逻辑
- Prisma ORM 操作 PostgreSQL 数据库
- 用户 ID 从 JWT Token 中提取

## 🔧 服务层架构

### 统一接口模式

每个业务模块都定义了统一的服务接口，有两个实现：

```typescript
// 1. 定义接口
export interface IChatService {
  getChatTree(): Promise<ChatTreeNode[]>
  createSession(data: CreateChatSessionDto): Promise<any>
  sendMessage(sessionId: string, content: string): Promise<ChatMessage>
  // ...
}

// 2. 云端 API 实现
class ChatApiImpl extends BaseApiImpl implements IChatService {
  async getChatTree(): Promise<ChatTreeNode[]> {
    return this.get('/chat/tree')  // HTTP API 调用
  }
}

// 3. 本地 IPC 实现
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async getChatTree(): Promise<ChatTreeNode[]> {
    return window.electronAPI.chat.getChatTree()  // IPC 调用
  }
}

// 4. 自动选择实现
export const chatService: IChatService = createService(
  ChatLocalImpl,
  ChatApiImpl
)
```

### 已实现的服务

1. **Chat Service** (`apps/desktop/src/services/chat.service.ts`)
   - 聊天会话管理
   - 消息收发
   - 树形结构组织

2. **SSH Service** (`apps/desktop/src/services/ssh.service.ts`)
   - SSH 连接管理
   - 文件夹组织
   - 树形结构

3. **Settings Service** (`apps/desktop/src/services/settings.service.ts`)
   - 用户设置
   - AI 提供商配置
   - 主题和界面配置

### 使用示例

```vue
<script setup lang="ts">
import { chatService } from '@/services/chat.service'
import { onMounted, ref } from 'vue'

const sessions = ref([])

onMounted(async () => {
  // 自动判断使用本地 IPC 还是远程 API
  sessions.value = await chatService.getSessions()
})

const createSession = async () => {
  const session = await chatService.createSession({
    title: '新会话',
    parentId: null
  })
  sessions.value.push(session)
}
</script>
```

## 🔄 模式切换

### 切换时机

用户可以在设置页面切换存储模式：

1. **登录成功** → 自动切换到云端模式
2. **退出登录** → 自动切换到本地模式
3. **手动切换** → 用户在设置中手动选择

### 切换实现

```typescript
// apps/desktop/src/views/SettingsView.vue
const switchToCloud = async () => {
  if (!userToken) {
    // 需要先登录
    showLoginModal.value = true
    return
  }
  
  // 切换到云端模式
  await window.electronAPI.storage.switchToCloud({
    apiUrl: cloudApiUrl.value,
    token: userToken
  })
  
  // 重新加载数据
  await loadCloudData()
}

const switchToLocal = async () => {
  // 切换到本地模式
  await window.electronAPI.storage.switchToLocal()
  
  // 重新加载本地数据
  await loadLocalData()
}
```

## 💾 本地数据库实现

### 主进程服务

每个业务模块在主进程中都有对应的服务实现：

```typescript
// apps/desktop/electron/services/chat.service.ts
import Database from 'better-sqlite3'

export class ChatService {
  private db: Database.Database

  constructor(dbPath: string) {
    this.db = new Database(dbPath)
    this.initTables()
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        userId TEXT NOT NULL,
        parentId TEXT,
        order INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  getChatTree(userId: string): ChatTreeNode[] {
    const stmt = this.db.prepare(`
      SELECT * FROM chat_sessions 
      WHERE userId = ? 
      ORDER BY order ASC
    `)
    const sessions = stmt.all(userId)
    return buildTree(sessions)
  }

  createSession(userId: string, data: CreateChatSessionDto) {
    const stmt = this.db.prepare(`
      INSERT INTO chat_sessions (id, title, userId, parentId, order)
      VALUES (?, ?, ?, ?, ?)
    `)
    const id = generateId()
    stmt.run(id, data.title, userId, data.parentId, data.order ?? 0)
    return { id, ...data }
  }
}
```

### IPC 处理器

```typescript
// apps/desktop/electron/ipc/chat-handlers.ts
import { ipcMain } from 'electron'
import { ChatService } from '../services/chat.service'

export function registerChatHandlers(chatService: ChatService) {
  ipcMain.handle('chat:getChatTree', async (_, userId: string) => {
    return chatService.getChatTree(userId)
  })

  ipcMain.handle('chat:createSession', async (_, userId: string, data: any) => {
    return chatService.createSession(userId, data)
  })
}
```

### Preload 脚本

```typescript
// apps/desktop/electron/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  chat: {
    getChatTree: (userId: string) => 
      ipcRenderer.invoke('chat:getChatTree', userId),
    
    createSession: (userId: string, data: any) => 
      ipcRenderer.invoke('chat:createSession', userId, data)
  }
})
```

## 🌐 云端数据库实现

### 后端服务

```typescript
// packages/server/src/services/chat.service.ts
import { PrismaClient } from '@ai-ssh/database'

export class ChatService {
  constructor(private prisma: PrismaClient) {}

  async getChatTree(userId: string): Promise<ChatTreeNode[]> {
    const sessions = await this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    })
    return buildTree(sessions)
  }

  async createSession(userId: string, data: CreateChatSessionDto) {
    return this.prisma.chatSession.create({
      data: {
        ...data,
        userId
      }
    })
  }
}
```

### API 路由

```typescript
// packages/server/src/routes/chat.routes.ts
import { FastifyPluginAsync } from 'fastify'
import { ChatService } from '../services/chat.service'

const chatRoutes: FastifyPluginAsync = async (fastify) => {
  const chatService = new ChatService(fastify.prisma)

  // 获取聊天树 - 自动从 JWT 提取 userId
  fastify.get('/chat/tree', {
    onRequest: [fastify.authenticate]
  }, async (request, reply) => {
    const userId = request.user.id  // 从 JWT token 中获取
    const tree = await chatService.getChatTree(userId)
    return { success: true, data: tree }
  })

  // 创建会话
  fastify.post('/chat/sessions', {
    onRequest: [fastify.authenticate]
  }, async (request, reply) => {
    const userId = request.user.id
    const session = await chatService.createSession(userId, request.body)
    return { success: true, data: session }
  })
}

export default chatRoutes
```

## 🔐 用户 ID 处理

### 本地模式

```typescript
// 固定使用 'local-user'
const userId = 'local-user'
await window.electronAPI.chat.getChatTree(userId)
```

### 云端模式

```typescript
// 从 JWT Token 中自动提取
// 前端无需传递 userId，后端从 request.user.id 获取

// 前端调用
await chatService.getChatTree()  // ✅ 无需传 userId

// 后端处理
fastify.get('/chat/tree', {
  onRequest: [fastify.authenticate]  // 验证 JWT
}, async (request, reply) => {
  const userId = request.user.id  // 从 JWT 提取
  // ...
})
```

### 自动处理逻辑

```typescript
// apps/desktop/src/services/base/service-factory.ts
export function getUserId(): string | null {
  // 优先从 localStorage，其次 sessionStorage
  const token = localStorage.getItem('userToken') || 
                sessionStorage.getItem('userToken')
  
  if (token) {
    // 解析 JWT 获取 userId
    const payload = parseJWT(token)
    return payload.userId
  }
  
  return null
}

export function getLocalUserId(): string {
  const userId = getUserId()
  return userId || 'local-user'  // 本地模式使用固定 ID
}
```

## 📊 数据表结构

### 本地 SQLite 表

```sql
-- 聊天会话
CREATE TABLE chat_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  userId TEXT NOT NULL,
  parentId TEXT,
  order INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 聊天消息
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  sessionId TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sessionId) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- SSH 连接
CREATE TABLE ssh_connections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  host TEXT NOT NULL,
  port INTEGER DEFAULT 22,
  username TEXT NOT NULL,
  authType TEXT NOT NULL,
  password TEXT,
  privateKey TEXT,
  passphrase TEXT,
  userId TEXT NOT NULL,
  parentId TEXT,
  order INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 用户设置
CREATE TABLE user_settings (
  userId TEXT PRIMARY KEY,
  settings TEXT NOT NULL,  -- JSON 格式
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### 云端 PostgreSQL 表

```prisma
// packages/database/prisma/schema.prisma
model ChatSession {
  id        String   @id @default(cuid())
  title     String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  parentId  String?
  parent    ChatSession? @relation("ChatSessionHierarchy", fields: [parentId], references: [id])
  children  ChatSession[] @relation("ChatSessionHierarchy")
  messages  ChatMessage[]
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@map("chat_sessions")
}

model ChatMessage {
  id        String   @id @default(cuid())
  sessionId String
  session   ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role      String
  content   String
  createdAt DateTime @default(now())

  @@index([sessionId])
  @@map("chat_messages")
}

model SSHConnection {
  id         String   @id @default(cuid())
  name       String
  host       String
  port       Int      @default(22)
  username   String
  authType   String
  password   String?
  privateKey String?
  passphrase String?
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  parentId   String?
  parent     SSHConnection? @relation("SSHHierarchy", fields: [parentId], references: [id])
  children   SSHConnection[] @relation("SSHHierarchy")
  order      Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
  @@map("ssh_connections")
}
```

## 🛠️ 开发指南

### 添加新的数据模型

1. **定义接口**
```typescript
// apps/desktop/src/services/your-service.ts
export interface IYourService {
  getAll(): Promise<YourModel[]>
  create(data: CreateYourDto): Promise<YourModel>
  // ...
}
```

2. **实现本地服务**
```typescript
// apps/desktop/electron/services/your-service.ts
export class YourService {
  constructor(private db: Database.Database) {
    this.initTables()
  }
  
  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS your_table (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        -- 其他字段
      )
    `)
  }
  
  getAll(userId: string) {
    return this.db.prepare('SELECT * FROM your_table WHERE userId = ?').all(userId)
  }
}
```

3. **注册 IPC 处理器**
```typescript
// apps/desktop/electron/ipc/your-handlers.ts
export function registerYourHandlers(yourService: YourService) {
  ipcMain.handle('your:getAll', async (_, userId) => {
    return yourService.getAll(userId)
  })
}
```

4. **实现云端服务**
```typescript
// packages/server/src/services/your.service.ts
export class YourService {
  constructor(private prisma: PrismaClient) {}
  
  async getAll(userId: string) {
    return this.prisma.yourModel.findMany({
      where: { userId }
    })
  }
}
```

5. **创建 API 路由**
```typescript
// packages/server/src/routes/your.routes.ts
const yourRoutes: FastifyPluginAsync = async (fastify) => {
  const yourService = new YourService(fastify.prisma)
  
  fastify.get('/your', {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    const data = await yourService.getAll(request.user.id)
    return { success: true, data }
  })
}
```

6. **实现双模式服务**
```typescript
// apps/desktop/src/services/your.service.ts
class YourApiImpl extends BaseApiImpl implements IYourService {
  async getAll() {
    return this.get('/your')
  }
}

class YourLocalImpl extends BaseLocalImpl implements IYourService {
  async getAll() {
    return window.electronAPI.your.getAll(this.getUserId())
  }
}

export const yourService = createService(YourLocalImpl, YourApiImpl)
```

## 🔍 调试技巧

### 本地模式调试

```typescript
// 查看 SQLite 数据库
const dbPath = path.join(app.getPath('userData'), 'local.db')
console.log('Database path:', dbPath)

// 使用 DB Browser for SQLite 打开查看
```

### 云端模式调试

```typescript
// 启用 Prisma 查询日志
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})
```

### IPC 通信调试

```typescript
// 主进程
ipcMain.handle('chat:getChatTree', async (_, userId) => {
  console.log('[IPC] chat:getChatTree called with userId:', userId)
  const result = chatService.getChatTree(userId)
  console.log('[IPC] chat:getChatTree result:', result)
  return result
})

// 渲染进程
const tree = await window.electronAPI.chat.getChatTree(userId)
console.log('[Renderer] Received tree:', tree)
```

## 📚 相关文档

- [Service Architecture](./service-architecture.md) - 服务架构详细说明
- [Store Elimination](./store-elimination-complete.md) - Pinia Store 迁移指南
- [API Path Fix](./api-path-fix.md) - API 路径修复记录

## 🔄 迁移指南

### 从旧 StorageManager 迁移

旧的 `StorageManager` 已被新的服务架构替代：

**旧方式**：
```typescript
// ❌ 过时
const storage = new StorageManager(config)
await storage.create('chatSession', data)
```

**新方式**：
```typescript
// ✅ 推荐
import { chatService } from '@/services/chat.service'
await chatService.createSession(data)
```

### 从 Pinia Store 迁移

**旧方式**：
```typescript
// ❌ 过时
import { useChatStore } from '@/stores/chat'
const chatStore = useChatStore()
await chatStore.loadSessions()
```

**新方式**：
```typescript
// ✅ 推荐
import { chatService } from '@/services/chat.service'
const sessions = await chatService.getSessions()
```

---

**最后更新**: 2025-10-07
