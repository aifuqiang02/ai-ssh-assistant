# 架构重构对比

## 📊 重构前 vs 重构后

### 问题：重复代码

**重构前**：每个服务都要写大量重复代码 ❌

```typescript
// ❌ chat.service.ts 中的重复代码
function getApiUrl(): string {
  return localStorage.getItem('apiUrl') || 'http://127.0.0.1:3000/api/v1'
}

function getUserToken(): string {
  return localStorage.getItem('userToken') || ''
}

function getStorageMode(): 'local' | 'cloud' {
  return (localStorage.getItem('storageMode') as 'local' | 'cloud') || 'local'
}

// ❌ ssh.service.ts 中的相同重复代码
function getApiUrl(): string { ... }  // 又写一遍！
function getUserToken(): string { ... }  // 又写一遍！
function getStorageMode(): 'local' | 'cloud' { ... }  // 又写一遍！

// ❌ settings.service.ts 中的相同重复代码
// ... 再写一遍！
```

**重构后**：统一基础设施，零重复 ✅

```typescript
// ✅ 所有服务共享基础设施
import { createService } from './base/service-factory'
import { BaseApiImpl, BaseLocalImpl } from './base/base-api-impl'

// 工具函数、HTTP 封装、工厂逻辑全部复用！
```

---

## 📝 代码量对比

### Chat 服务

| 项目 | 重构前 | 重构后 | 减少 |
|------|--------|--------|------|
| **总行数** | ~225 行 | ~120 行 | **-47%** 🎉 |
| **API 实现** | ~130 行（大量 fetch） | ~40 行（简洁调用） | **-69%** 🎉 |
| **工具函数** | ~25 行 | 0 行（共享） | **-100%** 🎉 |
| **工厂函数** | ~15 行 | 4 行 | **-73%** 🎉 |

### SSH 服务、Settings 服务

**同样大幅减少！**

---

## 🎯 Token 认证机制（无需传递 userId）

### 第一版重构：手动获取 userId ❌

```typescript
// ❌ API 实现中每个方法都要 getUserId()
class ChatApiImpl extends BaseApiImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    const userId = getUserId()  // 😫 重复代码
    return this.post('/api/chat/sessions', { userId, ...data })
  }
  
  async getSessions(): Promise<ChatSession[]> {
    const userId = getUserId()  // 😫 重复代码
    return this.get('/api/chat/sessions', { userId })
  }
  
  // ... 每个方法都要写一遍 const userId = getUserId()
}
```

### 最终方案：从 Token 解析，完全无需传递 ✅

```typescript
// ✅ API 实现中完全无需 userId！
class ChatApiImpl extends BaseApiImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    // 😊 无需 getUserId()，无需传 userId
    // 请求自动携带 Authorization: Bearer <token>
    // 后端从 token 中解析 userId
    return this.post('/api/chat/sessions', data)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    // 😊 极致简洁！
    return this.get('/api/chat/sessions')
  }
}
```

### 🔐 工作原理

**前端（自动）**：
```typescript
// service-factory.ts 中的 apiRequest 函数
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getUserToken()  // 自动获取 token
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      // ✅ 自动添加 Authorization header
      'Authorization': `Bearer ${token}`,
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
  
  return response.json()
}
```

**后端（解析）**：
```typescript
// 后端中间件示例（Express.js）
app.use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  if (token) {
    // 解析 JWT token
    const decoded = jwt.verify(token, SECRET_KEY)
    req.userId = decoded.userId  // 从 token 中获取 userId
  }
  
  next()
})

// 业务逻辑中直接使用 req.userId
app.post('/api/chat/sessions', async (req, res) => {
  const userId = req.userId  // ✅ 从 token 解析，无法伪造
  const { title, folderId } = req.body
  
  const session = await createSession(userId, title, folderId)
  res.json(session)
})
```

**优势对比**：

| 方案 | 前端代码 | 后端处理 | 安全性 | 符合标准 |
|------|---------|---------|-------|---------|
| **方案1：前端传 userId** | `const userId = getUserId()`<br>`post('/api', { userId, ...data })` | 直接使用 `req.body.userId` | ❌ 低（可伪造） | ❌ 不符合 |
| **方案2：从 Token 解析** | `post('/api', data)` | 从 token 解析：`req.userId` | ✅ 高（无法伪造） | ✅ 符合 RESTful + JWT |

**总结优势**：
- ✅ **消除重复**：前端 API 实现中无需任何 `getUserId()` 调用
- ✅ **更安全**：userId 由服务端从 token 解析，客户端无法伪造
- ✅ **更简洁**：API 调用更简洁，减少参数
- ✅ **符合标准**：符合 RESTful API 设计和 JWT 认证最佳实践
- ✅ **易维护**：修改认证逻辑只需改一处（`apiRequest` 函数）

### 👤 本地模式的特殊处理

**问题**：本地模式只有一个用户，无需登录，获取不到 userId

**解决方案**：

```typescript
// ❌ 第一版：Local 实现中也要重复获取 userId
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    const userId = getUserId()  // 😫 每个方法都要写
    return this.electronAPI.chat.createSession(userId, data)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    const userId = getUserId()  // 😫 重复代码
    return this.electronAPI.chat.getSessions(userId)
  }
}

// ✅ 最终方案：BaseLocalImpl 提供 getUserId() 方法
export class BaseLocalImpl {
  protected getUserId(): string {
    const storageMode = getStorageMode()
    
    if (storageMode === 'local') {
      return 'local-user'  // 本地模式固定用户
    } else {
      return getUserId() || 'guest'  // 云端模式真实用户
    }
  }
}

class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async createSession(data: CreateSessionDto): Promise<ChatSession> {
    // 😊 使用 this.getUserId()，本地模式自动返回 'local-user'
    return this.electronAPI.chat.createSession(this.getUserId(), data)
  }
  
  async getSessions(): Promise<ChatSession[]> {
    // 😊 简洁，且自动适配本地/云端模式
    return this.electronAPI.chat.getSessions(this.getUserId())
  }
}
```

**对比**：

| 方案 | 重复代码 | 本地模式支持 | 代码行数 |
|------|---------|-------------|---------|
| **方案1：每次 getUserId()** | ❌ 每个方法都要写 | ⚠️ 可能返回空 | 多 1 行/方法 |
| **方案2：this.getUserId()** | ✅ 无重复 | ✅ 自动返回 'local-user' | 简洁 |

**最终优势**：
- ✅ **消除重复**：Local 实现中无需重复 `const userId = getUserId()`
- ✅ **本地友好**：本地模式无需登录，自动使用 'local-user'
- ✅ **统一接口**：API 实现和 Local 实现都很简洁
- ✅ **自动适配**：根据 storageMode 自动返回正确的 userId

---

## 🔄 API 调用对比

### 远程 API 实现

**重构前** ❌：
```typescript
class ChatApiImpl implements IChatService {
  async createSession(userId: string, data: CreateSessionDto): Promise<ChatSession> {
    // 😫 每个方法都要写这么多代码
    const response = await fetch(`${getApiUrl()}/api/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getUserToken()}`
      },
      body: JSON.stringify({ userId, ...data })
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  async getSessions(userId: string): Promise<ChatSession[]> {
    // 😫 又要写一大堆...
    const response = await fetch(`${getApiUrl()}/api/chat/sessions?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${getUserToken()}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }
}
```

**重构后** ✅：
```typescript
class ChatApiImpl extends BaseApiImpl implements IChatService {
  async createSession(userId: string, data: CreateSessionDto): Promise<ChatSession> {
    // 😊 一行搞定！
    return this.post('/api/chat/sessions', { userId, ...data })
  }
  
  async getSessions(userId: string): Promise<ChatSession[]> {
    // 😊 一行搞定！
    return this.get('/api/chat/sessions', { userId })
  }
}
```

**对比**：
- 重构前：每个方法 **10-15 行**
- 重构后：每个方法 **1-2 行**
- 减少：**80-90%** 🎉

---

## 🏭 工厂函数对比

### 创建服务实例

**重构前** ❌：
```typescript
// ❌ 每个服务都要写这些
function getStorageMode(): 'local' | 'cloud' {
  return (localStorage.getItem('storageMode') as 'local' | 'cloud') || 'local'
}

export function createChatService(): IChatService {
  const storageMode = getStorageMode()
  
  console.log(`[ChatService] Using ${storageMode} storage mode`)
  
  if (storageMode === 'cloud') {
    return new ChatApiImpl()
  } else {
    return new ChatLocalImpl()
  }
}

export const chatService = createChatService()

// 😫 ssh.service.ts 又要写一遍
// 😫 settings.service.ts 又要写一遍
// 😫 ...
```

**重构后** ✅：
```typescript
// ✅ 一行搞定，自动判断
export const chatService = createService<IChatService>(
  'ChatService',
  ChatLocalImpl,
  ChatApiImpl
)

// ✅ 其他服务也是一行
export const sshService = createService<ISSHService>(
  'SSHService',
  SSHLocalImpl,
  SSHApiImpl
)
```

**对比**：
- 重构前：每个服务 **15-20 行**工厂代码
- 重构后：每个服务 **4 行**
- 减少：**80%** 🎉

---

## 📦 新增服务对比

### 添加一个新服务需要多少代码？

**重构前** ❌：
```typescript
// 需要编写约 150-200 行代码：
// 1. 接口定义：20 行
// 2. API 实现：80 行（大量 fetch 模板代码）
// 3. 本地实现：30 行
// 4. 工具函数：25 行
// 5. 工厂函数：15 行
// 总计：~170 行
```

**重构后** ✅：
```typescript
// 只需编写约 60-80 行代码：
// 1. 接口定义：20 行
// 2. API 实现：20 行（简洁调用）
// 3. 本地实现：20 行
// 4. 导出：4 行
// 总计：~64 行

// 减少：62% 🎉
```

---

## ✅ 优势总结

| 指标 | 重构前 | 重构后 | 提升 |
|------|--------|--------|------|
| **代码重复** | 严重（每个服务重复工具函数） | 零重复 | ✅ 100% 改善 |
| **新增服务代码量** | ~170 行 | ~64 行 | ✅ -62% |
| **API 调用代码** | 10-15 行/方法 | 1-2 行/方法 | ✅ -85% |
| **维护成本** | 高（改一个逻辑要改 N 处） | 低（改一处即可） | ✅ N 倍提升 |
| **可读性** | 差（大量模板代码） | 好（简洁清晰） | ✅ 大幅提升 |
| **扩展性** | 差（添加新服务麻烦） | 好（复制粘贴即可） | ✅ 大幅提升 |

---

## 🎯 实际案例

### 案例 1：修改 API URL 格式

**重构前** ❌：
```typescript
// 😫 需要修改 N 个文件
// apps/desktop/src/services/chat.service.ts
// apps/desktop/src/services/ssh.service.ts
// apps/desktop/src/services/settings.service.ts
// ...
// 每个文件都要改 getApiUrl()
```

**重构后** ✅：
```typescript
// 😊 只需修改 1 个文件
// apps/desktop/src/services/base/service-factory.ts
export function getApiUrl(): string {
  return localStorage.getItem('apiUrl') || 'http://127.0.0.1:3000/api/v1'
}
// 所有服务自动生效！
```

### 案例 2：添加请求拦截器

**重构前** ❌：
```typescript
// 😫 需要在每个服务的每个方法中添加
```

**重构后** ✅：
```typescript
// 😊 只需在 BaseApiImpl 中添加一次
export class BaseApiImpl {
  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    // 在这里统一添加拦截器
    console.log('API Request:', endpoint, data)
    
    const result = await apiRequest<T>(endpoint, {
      method: 'POST',
      body: data
    })
    
    console.log('API Response:', result)
    return result
  }
}
// 所有服务的所有 POST 请求都会自动记录日志！
```

---

## 🚀 迁移指南

### 如何将现有服务迁移到新架构？

#### 1. Chat 服务（已完成 ✅）
- 原代码：225 行
- 新代码：120 行
- 减少：47%

#### 2. SSH 服务（已完成 ✅）
- 参考 `apps/desktop/src/services/ssh.service.ts`

#### 3. Settings 服务（已完成 ✅）
- 参考 `apps/desktop/src/services/settings.service.ts`

#### 4. 其他服务（待迁移）
按照文档 `service-architecture.md` 中的"添加新服务的步骤"操作即可。

---

## 📈 性能影响

| 指标 | 影响 | 说明 |
|------|------|------|
| **运行时性能** | 无影响 | 都是函数调用，性能相同 |
| **构建体积** | 略减小 | 代码量减少，打包体积稍小 |
| **开发效率** | ⬆️ 大幅提升 | 新增服务只需原来 40% 的代码 |
| **维护效率** | ⬆️ 大幅提升 | 修改逻辑只需改一处 |

---

## 💡 最佳实践

1. **所有新服务都使用新架构**
2. **逐步迁移旧服务到新架构**
3. **基础设施的修改要谨慎（影响所有服务）**
4. **为基础设施编写单元测试**

---

## 🎉 总结

通过引入**基础设施层**，我们成功地：

1. ✅ **消除了重复代码**（工具函数、HTTP 封装、工厂逻辑）
2. ✅ **简化了 API 实现**（从 10-15 行减少到 1-2 行）
3. ✅ **统一了判断逻辑**（storageMode 判断只在一处）
4. ✅ **提升了开发效率**（新增服务代码量减少 62%）
5. ✅ **降低了维护成本**（改一处生效全部）

**这就是架构设计的力量！** 🚀

