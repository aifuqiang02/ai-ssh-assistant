# 本地模式优化 - 无需登录的用户 ID 处理

## 🎯 问题背景

### 问题描述
- **本地模式特点**：单用户应用，无需登录
- **现有问题**：
  1. Local 实现中每个方法都要调用 `getUserId()`
  2. 本地模式下没有用户登录，`getUserId()` 返回空字符串
  3. 代码存在大量重复：`const userId = getUserId()`

### 用户反馈
> "对于本地存储，貌似只有一个用户。看是否可以怎么优化下。比较无需登录。这儿也获取不到userId"

## ✅ 解决方案

### 1. 引入 `getLocalUserId()` 函数

```typescript
// apps/desktop/src/services/base/service-factory.ts

/**
 * 获取本地模式的用户 ID
 * 本地模式只有一个用户，无需登录
 */
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
```

**逻辑说明**：
- **本地模式** (`storageMode === 'local'`)：返回固定值 `'local-user'`
- **云端模式** (`storageMode === 'cloud'`)：从 `localStorage`/`sessionStorage` 获取真实 userId

### 2. 在 `BaseLocalImpl` 中封装

```typescript
// apps/desktop/src/services/base/base-api-impl.ts

export class BaseLocalImpl {
  protected get electronAPI() {
    return window.electronAPI
  }
  
  /**
   * 获取用户 ID
   * 本地模式：固定使用 'local-user'（无需登录）
   * 云端模式：从登录信息获取
   */
  protected getUserId(): string {
    return getLocalUserId()
  }
}
```

**优势**：
- ✅ 所有 Local 实现都继承 `BaseLocalImpl`
- ✅ 统一通过 `this.getUserId()` 获取用户 ID
- ✅ 自动适配本地/云端模式

### 3. 简化 Local 实现

#### 优化前 ❌

```typescript
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    const userId = getUserId()  // 😫 每个方法都要写
    return this.electronAPI.chat.createSession(userId, data)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    const userId = getUserId()  // 😫 重复代码
    return this.electronAPI.chat.getSessions(userId)
  }
  
  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    const userId = getUserId()  // 😫 又是重复
    return this.electronAPI.chat.sendMessage(userId, sessionId, content)
  }
}
```

#### 优化后 ✅

```typescript
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    // ✅ 使用 this.getUserId()，本地模式自动返回 'local-user'
    return this.electronAPI.chat.createSession(this.getUserId(), data)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    // ✅ 简洁，无重复
    return this.electronAPI.chat.getSessions(this.getUserId())
  }
  
  async sendMessage(sessionId: string, content: string): Promise<ChatMessage> {
    // ✅ 一行搞定
    return this.electronAPI.chat.sendMessage(this.getUserId(), sessionId, content)
  }
}
```

## 📊 对比分析

### 代码行数对比

| 服务 | 优化前 | 优化后 | 减少 |
|------|--------|--------|------|
| **Chat 服务** | 每个方法 2 行 | 每个方法 1 行 | **-50%** |
| **Settings 服务** | 每个方法 2 行 | 每个方法 1 行 | **-50%** |
| **总体** | 大量 `const userId = getUserId()` | 无重复代码 | **消除所有重复** |

### 功能对比

| 特性 | 优化前 | 优化后 |
|------|--------|--------|
| **本地模式支持** | ⚠️ `getUserId()` 可能返回空 | ✅ 自动返回 `'local-user'` |
| **云端模式支持** | ✅ 从 localStorage 获取 | ✅ 从 localStorage 获取 |
| **代码重复** | ❌ 每个方法都要写 | ✅ 无重复 |
| **无需登录** | ❌ 不支持 | ✅ 本地模式无需登录 |

## 🔄 工作流程

### 本地模式

```
用户调用服务
    ↓
chatService.getSessions()
    ↓
ChatLocalImpl.getSessions()
    ↓
this.getUserId() → getLocalUserId() → 'local-user'
    ↓
electronAPI.chat.getSessions('local-user')
    ↓
本地 IPC 调用
    ↓
本地 SQLite 查询（WHERE userId = 'local-user'）
```

### 云端模式

```
用户调用服务
    ↓
chatService.getSessions()
    ↓
ChatApiImpl.getSessions()
    ↓
自动添加 Authorization: Bearer <token>
    ↓
HTTP API 请求
    ↓
后端从 token 解析 userId
    ↓
数据库查询（WHERE userId = <从token解析>）
```

## 💡 最佳实践

### 1. 本地模式数据隔离（未来扩展）

如果将来需要支持本地多用户，可以轻松扩展：

```typescript
export function getLocalUserId(): string {
  const storageMode = getStorageMode()
  
  if (storageMode === 'local') {
    // 方案1：固定单用户（当前实现）
    return 'local-user'
    
    // 方案2：支持多用户（未来扩展）
    // const currentUser = localStorage.getItem('local-current-user')
    // return currentUser || 'local-user-1'
  } else {
    return getUserId() || 'guest'
  }
}
```

### 2. 数据库初始化

确保本地数据库支持 `'local-user'`：

```typescript
// apps/desktop/electron/services/chat.service.ts

constructor() {
  this.db = new LocalChatDatabase()
  
  // 确保本地用户存在
  this.ensureLocalUser()
}

private ensureLocalUser() {
  // 初始化 'local-user' 的默认数据（如果需要）
}
```

### 3. 迁移策略

如果用户从本地模式切换到云端模式：

```typescript
// 1. 本地数据（userId = 'local-user'）
// 2. 登录后（userId = 'real-user-id'）
// 3. 可选：迁移本地数据到云端

async migrateLocalDataToCloud(realUserId: string) {
  // 读取本地数据
  const localSessions = await db.getSessions('local-user')
  
  // 上传到云端
  for (const session of localSessions) {
    await api.createSession(realUserId, session)
  }
  
  // 可选：清理本地数据
  await db.clearUserData('local-user')
}
```

## 🎉 总结

### 核心改进

1. ✅ **消除重复代码**：Local 实现中无需重复 `const userId = getUserId()`
2. ✅ **本地模式友好**：固定使用 `'local-user'`，无需登录
3. ✅ **统一接口**：`this.getUserId()` 在基类中实现
4. ✅ **自动适配**：根据 `storageMode` 自动返回正确的 userId
5. ✅ **易于扩展**：未来可轻松支持本地多用户

### 文件变更

- ✅ `apps/desktop/src/services/base/service-factory.ts` - 添加 `getLocalUserId()`
- ✅ `apps/desktop/src/services/base/base-api-impl.ts` - `BaseLocalImpl` 添加 `getUserId()` 方法
- ✅ `apps/desktop/src/services/chat.service.ts` - 简化为 `this.getUserId()`
- ✅ `apps/desktop/src/services/settings.service.ts` - 简化为 `this.getUserId()`

### 用户体验提升

| 场景 | 优化前 | 优化后 |
|------|--------|--------|
| **本地模式启动** | ❌ 需要考虑 userId | ✅ 自动使用 'local-user' |
| **无需登录** | ⚠️ userId 可能为空 | ✅ 固定值，稳定可靠 |
| **切换到云端** | ✅ 正常 | ✅ 自动切换到真实 userId |
| **代码维护** | ❌ 重复代码多 | ✅ 简洁易维护 |

---

## 📖 相关文档

- [服务架构设计](./service-architecture.md)
- [重构前后对比](./refactoring-comparison.md)
- [服务使用示例](./service-usage-examples.md)

