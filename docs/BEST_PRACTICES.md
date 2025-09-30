# 项目最佳实践

本文档记录了开发过程中遇到的常见问题和解决方案，帮助避免重复犯错。

## 目录
- [API 响应序列化问题](#api-响应序列化问题)
- [认证 Token 存储](#认证-token-存储)
- [Prisma 数据返回](#prisma-数据返回)

---

## API 响应序列化问题

### 问题描述
Fastify 的响应 schema 验证过于严格，如果 schema 中 `data` 字段只定义为 `{ type: 'object' }` 而没有指定 `properties` 或 `additionalProperties: true`，则会导致返回的对象被序列化为空对象 `{}`。

### 错误示例
```typescript
response: {
  201: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: { type: 'object' }  // ❌ 这会导致 data 为空对象
    }
  }
}
```

### 正确做法

**方案 1：允许额外属性（推荐）**
```typescript
response: {
  201: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: {
        type: 'object',
        additionalProperties: true  // ✅ 允许任意属性
      }
    }
  }
}
```

**方案 2：明确定义所有属性**
```typescript
response: {
  201: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          // ... 列出所有需要返回的字段
        }
      }
    }
  }
}
```

**方案 3：手动构造返回对象**
```typescript
// 在路由处理器中
const folder = await sshService.createFolder(userId, data)

// 手动构造返回对象，确保所有字段都被包含
const folderData = {
  id: folder.id,
  name: folder.name,
  order: folder.order,
  isActive: folder.isActive,
  parentId: folder.parentId,
  userId: folder.userId,
  createdAt: folder.createdAt,
  updatedAt: folder.updatedAt
}

return reply.status(201).send({
  success: true,
  message: '文件夹创建成功',
  data: folderData
})
```

### 最佳实践
1. **开发环境**：使用 `additionalProperties: true` 以提高灵活性
2. **生产环境**：明确定义所有属性，提高安全性和可维护性
3. **始终验证返回数据**：在开发时检查浏览器控制台和后端日志

---

## 认证 Token 存储

### 问题描述
项目中使用自定义的 token 存储 key（`userToken`），而不是常见的 `token`，导致 API 请求时提示"未登录"。

### 错误示例
```typescript
// ❌ 错误：使用错误的 key
const token = localStorage.getItem('token')
```

### 正确做法
```typescript
// ✅ 正确：使用项目中定义的 key
const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
```

### Token 存储位置
查看 `apps/desktop/src/stores/storage.ts` 中的定义：

```typescript
// 登录时
storage.setItem('userToken', token)

// 获取时
const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
```

### 最佳实践

**1. 创建统一的 Token 工具函数**

创建 `apps/desktop/src/utils/auth.ts`：
```typescript
/**
 * 获取认证 Token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
}

/**
 * 设置认证 Token
 */
export function setAuthToken(token: string, remember: boolean = false): void {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem('userToken', token)
}

/**
 * 移除认证 Token
 */
export function removeAuthToken(): void {
  localStorage.removeItem('userToken')
  sessionStorage.removeItem('userToken')
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
```

**2. 在 API 请求中使用**
```typescript
import { getAuthToken } from '@/utils/auth'

const token = getAuthToken()
if (!token) {
  throw new Error('未登录')
}

const response = await fetch('http://localhost:3000/api/v1/...', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
})
```

**3. 使用 API Service 统一处理**

在 `apps/desktop/src/services/api.service.ts` 中已经有封装，直接使用：
```typescript
import apiService from '@/services/api.service'

// API Service 会自动处理 token
const response = await apiService.post('/ssh/test-connection', data)
```

### 检查清单
- [ ] 使用正确的 token key（`userToken`）
- [ ] 同时检查 localStorage 和 sessionStorage
- [ ] 使用统一的工具函数而不是直接访问 storage
- [ ] 在所有 API 请求中包含 Authorization header

---

## Prisma 数据返回

### 问题描述
Prisma 返回的对象在某些情况下可能无法被正确序列化，特别是在 Fastify 的响应中。

### 最佳实践

**1. Service 层返回纯数据**
```typescript
// packages/server/src/services/ssh.service.ts
async createFolder(userId: string, data: CreateSSHFolderDto): Promise<SSHFolder> {
  const folder = await this.prisma.sSHFolder.create({
    data: {
      name: data.name,
      parentId: data.parentId,
      order: data.order ?? 0,
      userId
    }
  })
  
  // 直接返回，Prisma 对象通常可以正常序列化
  return folder as any
}
```

**2. Route 层确保数据完整性**
```typescript
// packages/server/src/routes/ssh.routes.ts
const folder = await sshService.createFolder(userId, data)

// 手动构造返回对象（可选但更安全）
const folderData = {
  id: folder.id,
  name: folder.name,
  order: folder.order,
  isActive: folder.isActive,
  parentId: folder.parentId,
  userId: folder.userId,
  createdAt: folder.createdAt,
  updatedAt: folder.updatedAt
}

return reply.status(201).send({
  success: true,
  message: '文件夹创建成功',
  data: folderData
})
```

**3. 响应 Schema 设置**
```typescript
response: {
  201: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: {
        type: 'object',
        additionalProperties: true  // 允许所有属性
      }
    }
  }
}
```

---

## 调试技巧

### 1. 前端调试
```typescript
// 在关键位置添加详细日志
console.log('=== Creating folder ===')
console.log('Request data:', data)
console.log('Response:', response)
console.log('Response.data:', response.data)
```

### 2. 后端调试
```typescript
// 在路由处理器中添加日志
console.log('Received request body:', request.body)
console.log('Service returned:', result)
console.log('Sending response:', responseData)
```

### 3. 检查网络请求
- 打开浏览器开发者工具 (F12)
- 切换到 Network 标签
- 检查请求和响应的完整内容
- 查看 Response Headers 和 Response Body

### 4. 验证数据流
```
用户操作 → 前端组件 → Store → API Service → 后端路由 → Service 层 → Prisma → 数据库
                ↓                                      ↓
            前端日志                              后端日志
```

---

## 避免类似问题的检查清单

在实现新功能时，请检查以下内容：

### API 开发
- [ ] 响应 schema 是否正确定义（使用 `additionalProperties: true` 或明确定义所有字段）
- [ ] 后端是否正确返回数据（检查后端日志）
- [ ] 前端是否正确接收数据（检查浏览器控制台）
- [ ] 数据是否需要手动构造（Prisma 对象序列化）

### 认证相关
- [ ] 使用正确的 token key（`userToken`）
- [ ] 检查 localStorage 和 sessionStorage
- [ ] API 请求包含 Authorization header
- [ ] 使用统一的 auth 工具函数

### 数据持久化
- [ ] 创建后是否返回完整的实体数据（包括 id）
- [ ] 前端是否正确处理返回的数据
- [ ] 异步操作是否正确等待完成

### 组件通信
- [ ] Props 是否正确传递
- [ ] Events 是否正确触发
- [ ] Watch 是否正确监听变化
- [ ] 组件生命周期是否正确处理

---

## 常用调试命令

```bash
# 查看后端日志
pnpm dev  # 在 packages/server 目录

# 查看前端控制台
# 打开浏览器 DevTools (F12)

# 重启后端（应用配置更改后）
Ctrl+C
pnpm dev

# 清除浏览器缓存和 localStorage
# 浏览器 DevTools → Application → Clear storage
```

---

## 相关文档
- [Fastify Schema Validation](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)

---

**最后更新**: 2025-09-30
