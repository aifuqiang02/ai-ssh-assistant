# 项目最佳实践

本文档记录了开发过程中遇到的常见问题和解决方案，帮助避免重复犯错。

## 目录
- [API 响应序列化问题](#api-响应序列化问题)
- [认证 Token 存储](#认证-token-存储)
- [Prisma 数据返回](#prisma-数据返回)
- [SSH 连接事件监听清理](#ssh-连接事件监听清理)

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

## SSH 连接事件监听清理

### 问题描述
在 SSH 终端组件中，重新连接时如果不清理旧的事件监听器，会导致多个监听器叠加，造成输出重复显示（如多个 shell 提示符）。

### 错误示例
```typescript
// ❌ 错误：重新连接时没有清理旧监听器
const handleReconnect = () => {
  terminal.value.clear()
  connectToSSH() // 这会注册新的监听器，但旧的还在
}

const connectToSSH = () => {
  // 注册监听器
  window.electronAPI.on(`ssh:output:${connId}`, (data) => {
    terminal.value.write(data) // 每次重连都会添加新的监听器
  })
}
```

### 正确做法

**1. 保存监听器清理函数**
```typescript
// 保存监听器的清理函数
const outputListener = ref<(() => void) | null>(null)
const statusListener = ref<(() => void) | null>(null)

const connectToSSH = () => {
  // 清理旧监听器
  cleanupListeners()
  
  // 注册新监听器并保存清理函数
  outputListener.value = window.electronAPI.on(`ssh:output:${connId}`, (data) => {
    terminal.value.write(data)
  })
  
  statusListener.value = window.electronAPI.onConnectionStatusChange(({ id, status }) => {
    // 处理状态变化
  })
}
```

**2. 实现清理函数**
```typescript
const cleanupListeners = () => {
  if (outputListener.value) {
    outputListener.value() // 调用清理函数移除监听器
    outputListener.value = null
  }
  if (statusListener.value) {
    statusListener.value()
    statusListener.value = null
  }
}
```

**3. 重新连接时先断开并清理**
```typescript
const handleReconnect = async () => {
  // 如果已连接，不执行任何操作
  if (connectionStatus.value === 'connected') {
    return
  }
  
  // 1. 断开旧的 SSH 连接
  if (currentConnectionId.value && window.electronAPI) {
    await window.electronAPI.ssh.disconnect(currentConnectionId.value)
  }
  
  // 2. 清理监听器
  cleanupListeners()
  
  // 3. 清空终端
  terminal.value?.clear()
  
  // 4. 获取配置并自动重连
  const config = getNodeConfig()
  if (config && window.electronAPI) {
    connectionStatus.value = 'connecting'
    const result = await window.electronAPI.ssh.connect(config)
    
    if (result?.status === 'connected') {
      currentConnectionId.value = result.id
      connectToSSH()
    }
  }
}

// 断开连接（仅在已连接时可用）
const handleDisconnect = async () => {
  if (connectionStatus.value !== 'connected') {
    return
  }
  
  if (currentConnectionId.value && window.electronAPI) {
    await window.electronAPI.ssh.disconnect(currentConnectionId.value)
    cleanupListeners()
    connectionStatus.value = 'disconnected'
  }
}
```

**4. 后端正确清理连接**
```typescript
// packages/desktop/electron/ipc/ssh-handlers.ts
async disconnect(id: string): Promise<void> {
  const connection = this.connections.get(id)
  if (!connection) return

  // 关闭 shell 会话
  if (connection.shell) {
    connection.shell.end()
    connection.shell = undefined
  }

  // 关闭 SSH 客户端
  if (connection.client) {
    connection.client.end()
    connection.client = undefined
  }

  // 从连接池中移除
  this.connections.delete(id)
}
```

**5. 组件卸载时清理**
```typescript
onBeforeUnmount(() => {
  // 清理监听器
  cleanupListeners()
  
  // 释放终端资源
  if (terminal.value) {
    terminal.value.dispose()
  }
  
  // 断开 SSH 连接
  if (actualConnectionId.value && window.electronAPI) {
    window.electronAPI.ssh.disconnect(actualConnectionId.value)
  }
})
```

### 最佳实践

1. **始终保存清理函数**：事件监听器注册时应返回清理函数
2. **重连前先清理**：重新连接前必须清理旧监听器和连接
3. **按钮状态管理**：根据连接状态显示正确的按钮
   - 已连接：只显示"断开连接"按钮
   - 已断开：只显示"重新连接"按钮
   - 连接中：显示禁用的加载按钮
4. **保存连接配置**：通过 URL 参数传递节点ID，从 store 获取配置用于重连
5. **组件卸载清理**：组件销毁时清理所有资源
6. **后端完全断开**：后端断开时应关闭所有相关资源并从连接池移除

### UI/UX 优化

**按钮根据状态显示：**
```vue
<template>
  <!-- 已连接时显示断开按钮 -->
  <button 
    v-if="connectionStatus === 'connected'" 
    @click="handleDisconnect"
  >
    <i class="bi bi-x-circle"></i>
  </button>
  
  <!-- 已断开时显示重新连接按钮 -->
  <button 
    v-else-if="connectionStatus === 'disconnected'" 
    @click="handleReconnect"
  >
    <i class="bi bi-arrow-clockwise"></i>
  </button>
  
  <!-- 连接中时禁用 -->
  <button v-else disabled class="btn-disabled">
    <i class="bi bi-hourglass-split"></i>
  </button>
</template>
```

**传递节点配置用于重连：**
```typescript
// AppSidebar.vue - 打开终端时传递节点ID
openNewTab(
  terminalId,
  name,
  icon,
  `/terminal?connectionId=${result.id}&nodeId=${node.id}&name=${name}`
)

// TerminalView.vue - 从 store 获取配置
const getNodeConfig = () => {
  if (!nodeId.value) return null
  const node = sshStore.findNode(nodeId.value, sshStore.sshTree)
  if (!node || node.type !== 'connection') return null
  
  return {
    id: node.id,
    name: node.name,
    host: node.host,
    port: node.port || 22,
    username: node.username,
    authType: node.authType,
    password: node.password,
    privateKey: node.privateKey,
    passphrase: node.passphrase
  }
}
```

### 常见错误

**错误：重连后输入命令提示 "Connection not found or not connected"**

原因：终端输入处理器使用了错误的连接ID

```typescript
// ❌ 错误：使用固定的 actualConnectionId（从 URL 获取）
terminal.value.onData((data) => {
  const connId = actualConnectionId.value  // 这个值不会变
  window.electronAPI.ssh.execute(connId, data)
})

// ✅ 正确：使用动态的 currentConnectionId
terminal.value.onData((data) => {
  const connId = currentConnectionId.value  // 这个值会随重连更新
  window.electronAPI.ssh.execute(connId, data)
})
```

### 常见错误 2

**错误：组件卸载时 "Could not dispose an addon that has not been loaded"**

原因：Terminal 实例可能未完全初始化就被卸载，或者 addons 未完全加载

```typescript
// ❌ 错误：直接 dispose，可能抛出异常
const fitAddon = ref<FitAddon | null>(null)

onBeforeUnmount(() => {
  if (terminal.value) {
    terminal.value.dispose()  // 如果 addon 未加载完成会报错
  }
})

// ✅ 正确：保存所有 addon 引用，清理时先置空再 dispose
const fitAddon = ref<FitAddon | null>(null)
const webLinksAddon = ref<WebLinksAddon | null>(null)

const initTerminal = () => {
  terminal.value = new Terminal({ /* ... */ })
  
  // 保存 addon 引用
  fitAddon.value = new FitAddon()
  webLinksAddon.value = new WebLinksAddon()
  
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.loadAddon(webLinksAddon.value)
}

onBeforeUnmount(() => {
  if (terminal.value) {
    try {
      // 先清理 addons 引用
      if (fitAddon.value) {
        fitAddon.value = null
      }
      if (webLinksAddon.value) {
        webLinksAddon.value = null
      }
      
      // 再清理 terminal
      terminal.value.dispose()
      terminal.value = null
    } catch (err) {
      // 静默处理 xterm.js addon 生命周期问题
    }
  }
})

// ✅ 同时确保初始化完成后再使用
onMounted(() => {
  nextTick(() => {
    if (terminalContainer.value) {
      initTerminal()
    }
  })
})
```

### 检查清单
- [ ] 事件监听器保存了清理函数
- [ ] 重连前调用了 `cleanupListeners()`
- [ ] 重连前调用了 `disconnect()`
- [ ] 按钮根据 `connectionStatus` 正确显示
- [ ] 断开/重连按钮根据状态禁用
- [ ] 重连时自动获取配置并建立新连接
- [ ] **终端输入使用 `currentConnectionId` 而非 `actualConnectionId`**
- [ ] **组件初始化使用 `nextTick` 确保 DOM 准备就绪**
- [ ] **所有 xterm addons 都保存了引用（不要直接 new）**
- [ ] **dispose 时先清空 addon 引用，再 dispose terminal**
- [ ] **Terminal dispose 包含 try-catch 错误处理**
- [ ] 后端 `disconnect()` 清理了 shell 和 client
- [ ] 组件卸载时清理了所有资源

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
