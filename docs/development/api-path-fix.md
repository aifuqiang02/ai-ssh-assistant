# API 路径修复 - 移除重复的 `/api/` 前缀

## 🐛 问题描述

**错误症状**：API 请求返回 404 错误

**错误示例**：
```
POST /api/v1/api/ssh/folders
→ 404 Not Found
```

## 🔍 根本原因

### 路径拼接逻辑
```typescript
// service-factory.ts
export function getApiUrl(): string {
  return localStorage.getItem('apiUrl') || 'http://127.0.0.1:3000/api/v1'
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions) {
  const url = `${getApiUrl()}${endpoint}`  // 拼接基础 URL + endpoint
  // ...
}
```

### 错误的 Service 实现
```typescript
// ❌ 错误：重复了 /api/ 前缀
class SSHApiImpl extends BaseApiImpl {
  async createFolder(data: any) {
    return this.post('/api/ssh/folders', data)
    // 最终 URL: http://127.0.0.1:3000/api/v1 + /api/ssh/folders
    //         = http://127.0.0.1:3000/api/v1/api/ssh/folders ❌
  }
}
```

## ✅ 修复方案

### 修复规则
**移除所有 Service 实现中的 `/api/` 前缀**

因为 `getApiUrl()` 已经返回了包含 `/api/v1` 的基础 URL，所以 Service 中的路径应该直接以资源名称开头。

### 修复对比

| Service | 错误路径 | 正确路径 |
|---------|---------|---------|
| **SSH** | `/api/ssh/folders` | `/ssh/folders` ✅ |
| **SSH** | `/api/ssh/tree` | `/ssh/tree` ✅ |
| **SSH** | `/api/ssh/connections` | `/ssh/connections` ✅ |
| **Chat** | `/api/chat/tree` | `/chat/tree` ✅ |
| **Chat** | `/api/chat/folders` | `/chat/folders` ✅ |
| **Chat** | `/api/chat/sessions` | `/chat/sessions` ✅ |
| **Settings** | `/api/settings` | `/settings` ✅ |

## 📝 修复的文件

### 1. **apps/desktop/src/services/ssh.service.ts** ✅
```typescript
// ❌ 修复前
async createFolder(data: any): Promise<any> {
  return this.post('/api/ssh/folders', data)
}

// ✅ 修复后
async createFolder(data: any): Promise<any> {
  return this.post('/ssh/folders', data)
}
```

**修复数量**：22 处 API 路径

### 2. **apps/desktop/src/services/chat.service.ts** ✅
```typescript
// ❌ 修复前
async getChatTree(): Promise<ChatTreeNode[]> {
  return this.get('/api/chat/tree')
}

// ✅ 修复后
async getChatTree(): Promise<ChatTreeNode[]> {
  return this.get('/chat/tree')
}
```

**修复数量**：7 处 API 路径

### 3. **apps/desktop/src/services/settings.service.ts** ✅
```typescript
// ❌ 修复前
async getSettings(): Promise<any> {
  return this.get('/api/settings')
}

// ✅ 修复后
async getSettings(): Promise<any> {
  return this.get('/settings')
}
```

**修复数量**：3 处 API 路径

## 🎯 最终 URL 示例

### 正确的 URL 生成
```typescript
const baseUrl = getApiUrl()  // 'http://127.0.0.1:3000/api/v1'
const endpoint = '/ssh/folders'
const finalUrl = `${baseUrl}${endpoint}`
// ✅ 结果: http://127.0.0.1:3000/api/v1/ssh/folders
```

### API 路径对照表

| Service 方法 | Endpoint | 完整 URL |
|-------------|----------|---------|
| `sshService.getSSHTree()` | `/ssh/tree` | `http://127.0.0.1:3000/api/v1/ssh/tree` |
| `sshService.createFolder()` | `/ssh/folders` | `http://127.0.0.1:3000/api/v1/ssh/folders` |
| `chatService.getChatTree()` | `/chat/tree` | `http://127.0.0.1:3000/api/v1/chat/tree` |
| `chatService.createSession()` | `/chat/sessions` | `http://127.0.0.1:3000/api/v1/chat/sessions` |
| `settingsService.getSettings()` | `/settings` | `http://127.0.0.1:3000/api/v1/settings` |

## 🚀 最佳实践

### Service 实现规范

```typescript
// ✅ 正确：使用相对路径（不含 /api/ 前缀）
class MyApiImpl extends BaseApiImpl {
  async getData() {
    return this.get('/resource')        // ✅
    return this.post('/resource', data) // ✅
    return this.put('/resource/123')    // ✅
    return this.delete('/resource/123') // ✅
  }
}

// ❌ 错误：包含 /api/ 前缀
class MyApiImpl extends BaseApiImpl {
  async getData() {
    return this.get('/api/resource')        // ❌ 重复
    return this.post('/api/resource', data) // ❌ 重复
  }
}
```

### 路径命名规则

1. **以资源名称开头**：`/ssh/...`, `/chat/...`, `/settings`
2. **使用复数形式**：`/folders`, `/connections`, `/sessions`
3. **RESTful 风格**：
   - GET `/resource` - 获取列表
   - POST `/resource` - 创建
   - GET `/resource/:id` - 获取单个
   - PUT `/resource/:id` - 更新
   - DELETE `/resource/:id` - 删除

## 📚 相关文档

- [服务架构设计](./service-architecture.md)
- [Service Factory 文档](./service-usage-examples.md)

---

**修复日期**：2024-01-XX
**影响范围**：所有 API 调用
**修复状态**：✅ 已完成

