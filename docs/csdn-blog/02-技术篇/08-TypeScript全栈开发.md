# TypeScript 全栈开发：类型安全的最佳实践

> 深入讲解如何使用 TypeScript 构建类型安全的全栈应用，从前端到后端的完整实践。

## 前言

TypeScript 已经成为现代 Web 开发的标准。在 AI SSH Assistant 中，我们使用 TypeScript 实现了从前端到后端的完整类型安全。

本文将详细讲解：
- 🎯 TypeScript 配置
- 📦 类型定义
- 🔄 类型共享
- 🛠️ 实用技巧
- ⚡ 性能优化

---

## TypeScript 配置

### 项目结构

```
ai-ssh-assistant/
├── apps/
│   └── desktop/              # Electron 应用
│       ├── tsconfig.json
│       ├── electron/         # 主进程
│       └── src/              # 渲染进程
├── packages/
│   ├── shared/               # 共享类型
│   │   └── tsconfig.json
│   ├── database/             # 数据库
│   │   └── tsconfig.json
│   └── server/               # 服务端
│       └── tsconfig.json
└── tsconfig.json             # 根配置
```

### 根配置

```json
// tsconfig.json
{
  "compilerOptions": {
    // 基础配置
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    
    // 模块解析
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    
    // 类型检查
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // 输出
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    // 其他
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 前端配置

```json
// apps/desktop/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "preserve",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../../packages/shared/src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "electron/**/*.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

### 后端配置

```json
// packages/server/tsconfig.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../shared/src/*"],
      "@database/*": ["../database/src/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 类型定义

### 基础类型

```typescript
// packages/shared/src/types/base.ts

/**
 * 用户类型
 */
export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * SSH 连接类型
 */
export interface SSHConnection {
  id: string
  name: string
  host: string
  port: number
  username: string
  authType: 'password' | 'privateKey'
  password?: string
  privateKey?: string
  passphrase?: string
  folderId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * AI 会话类型
 */
export interface ChatSession {
  id: string
  name: string
  connectionId: string
  userId: string
  systemPrompt?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * 聊天消息类型
 */
export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  command?: string
  output?: string
  createdAt: Date
}
```

### API 类型

```typescript
// packages/shared/src/types/api.ts

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * SSH 连接 API
 */
export namespace SSHConnectionAPI {
  export interface CreateParams {
    name: string
    host: string
    port: number
    username: string
    authType: 'password' | 'privateKey'
    password?: string
    privateKey?: string
    passphrase?: string
    folderId?: string
  }

  export interface UpdateParams extends Partial<CreateParams> {
    id: string
  }

  export interface ListParams extends PaginationParams {
    folderId?: string
    search?: string
  }

  export type CreateResponse = ApiResponse<SSHConnection>
  export type UpdateResponse = ApiResponse<SSHConnection>
  export type GetResponse = ApiResponse<SSHConnection>
  export type ListResponse = ApiResponse<PaginatedResponse<SSHConnection>>
  export type DeleteResponse = ApiResponse<void>
}
```

### IPC 类型

```typescript
// packages/shared/src/types/ipc.ts

/**
 * IPC 通道定义
 */
export const IPC_CHANNELS = {
  // SSH
  SSH_CONNECT: 'ssh:connect',
  SSH_DISCONNECT: 'ssh:disconnect',
  SSH_EXECUTE: 'ssh:execute',
  SSH_CREATE_SHELL: 'ssh:createShell',
  
  // 文件
  FILE_READ: 'file:read',
  FILE_WRITE: 'file:write',
  FILE_LIST: 'file:list',
  
  // 数据库
  DB_QUERY: 'db:query',
  DB_EXECUTE: 'db:execute',
} as const

/**
 * SSH IPC 类型
 */
export namespace SSHIBC {
  export interface ConnectParams {
    id: string
    host: string
    port: number
    username: string
    password?: string
    privateKey?: string
    passphrase?: string
  }

  export interface ExecuteParams {
    connectionId: string
    command: string
    timeout?: number
  }

  export interface ExecuteResult {
    output: string
    exitCode: number
    error?: string
  }
}

/**
 * Electron API 类型定义
 */
export interface ElectronAPI {
  ssh: {
    connect(params: SSHIBC.ConnectParams): Promise<void>
    disconnect(connectionId: string): Promise<void>
    execute(
      connectionId: string,
      command: string,
      timeout?: number
    ): Promise<SSHIBC.ExecuteResult>
    createShell(
      connectionId: string,
      onData: (data: string) => void
    ): Promise<string>
  }
  
  file: {
    read(path: string): Promise<string>
    write(path: string, content: string): Promise<void>
    list(path: string): Promise<string[]>
  }
}

// 全局类型声明
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
```

---

## 类型共享

### Monorepo 类型共享

```typescript
// packages/shared/src/index.ts
export * from './types/base'
export * from './types/api'
export * from './types/ipc'

// 在其他包中使用
import { SSHConnection, ChatSession } from '@shared/types'
```

### 前后端类型同步

```typescript
// packages/shared/src/types/dto.ts

/**
 * 数据传输对象（DTO）
 */
export namespace DTO {
  /**
   * 创建 SSH 连接 DTO
   */
  export interface CreateSSHConnection {
    name: string
    host: string
    port: number
    username: string
    authType: 'password' | 'privateKey'
    password?: string
    privateKey?: string
  }

  /**
   * SSH 连接响应 DTO
   */
  export interface SSHConnectionResponse {
    id: string
    name: string
    host: string
    port: number
    username: string
    authType: string
    createdAt: string  // ISO 8601 字符串
    updatedAt: string
  }
}

// 后端使用
import { DTO } from '@shared/types'

app.post('/api/connections', async (req, res) => {
  const params: DTO.CreateSSHConnection = req.body
  // ...
  const response: DTO.SSHConnectionResponse = {
    // ...
  }
  res.json(response)
})

// 前端使用
import { DTO } from '@shared/types'

async function createConnection(params: DTO.CreateSSHConnection) {
  const response = await fetch('/api/connections', {
    method: 'POST',
    body: JSON.stringify(params)
  })
  const data: DTO.SSHConnectionResponse = await response.json()
  return data
}
```

### 类型转换

```typescript
// packages/shared/src/utils/converters.ts

/**
 * 将数据库模型转换为 DTO
 */
export function toSSHConnectionDTO(
  model: SSHConnection
): DTO.SSHConnectionResponse {
  return {
    id: model.id,
    name: model.name,
    host: model.host,
    port: model.port,
    username: model.username,
    authType: model.authType,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString()
  }
}

/**
 * 将 DTO 转换为数据库模型
 */
export function fromSSHConnectionDTO(
  dto: DTO.SSHConnectionResponse
): SSHConnection {
  return {
    id: dto.id,
    name: dto.name,
    host: dto.host,
    port: dto.port,
    username: dto.username,
    authType: dto.authType as 'password' | 'privateKey',
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  }
}
```

---

## 实用技巧

### 1. 类型守卫

```typescript
// packages/shared/src/utils/type-guards.ts

/**
 * 检查是否为 SSH 连接
 */
export function isSSHConnection(obj: any): obj is SSHConnection {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.host === 'string' &&
    typeof obj.port === 'number' &&
    typeof obj.username === 'string'
  )
}

/**
 * 检查是否为聊天消息
 */
export function isChatMessage(obj: any): obj is ChatMessage {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.sessionId === 'string' &&
    ['user', 'assistant', 'system'].includes(obj.role) &&
    typeof obj.content === 'string'
  )
}

// 使用
function processData(data: unknown) {
  if (isSSHConnection(data)) {
    // TypeScript 知道 data 是 SSHConnection
    console.log(data.host)
  }
}
```

### 2. 泛型工具类型

```typescript
// packages/shared/src/types/utils.ts

/**
 * 使所有属性可选
 */
export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends object ? PartialDeep<T[P]> : T[P]
}

/**
 * 使所有属性必需
 */
export type RequiredDeep<T> = {
  [P in keyof T]-?: T[P] extends object ? RequiredDeep<T[P]> : T[P]
}

/**
 * 提取 Promise 的返回类型
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * 提取数组元素类型
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never

/**
 * 创建只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 使用
type PartialConnection = PartialDeep<SSHConnection>
type ConnectionArray = SSHConnection[]
type Connection = ArrayElement<ConnectionArray>  // SSHConnection
```

### 3. 条件类型

```typescript
// packages/shared/src/types/conditional.ts

/**
 * 根据条件选择类型
 */
export type ConditionalType<T extends boolean, True, False> = 
  T extends true ? True : False

/**
 * 提取函数参数类型
 */
export type FunctionParams<T> = 
  T extends (...args: infer P) => any ? P : never

/**
 * 提取函数返回类型
 */
export type FunctionReturn<T> = 
  T extends (...args: any[]) => infer R ? R : never

// 使用
function connect(host: string, port: number): Promise<void> {
  // ...
}

type ConnectParams = FunctionParams<typeof connect>  // [string, number]
type ConnectReturn = FunctionReturn<typeof connect>  // Promise<void>
```

### 4. 映射类型

```typescript
// packages/shared/src/types/mapped.ts

/**
 * 将所有属性转换为 Promise
 */
export type Promisify<T> = {
  [P in keyof T]: Promise<T[P]>
}

/**
 * 将所有方法转换为异步方法
 */
export type AsyncMethods<T> = {
  [P in keyof T]: T[P] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[P]
}

/**
 * 提取所有字符串属性
 */
export type StringKeys<T> = {
  [P in keyof T]: T[P] extends string ? P : never
}[keyof T]

// 使用
interface SSHService {
  connect(id: string): void
  disconnect(id: string): void
  execute(id: string, command: string): string
}

type AsyncSSHService = AsyncMethods<SSHService>
// {
//   connect(id: string): Promise<void>
//   disconnect(id: string): Promise<void>
//   execute(id: string, command: string): Promise<string>
// }
```

### 5. 模板字面量类型

```typescript
// packages/shared/src/types/template.ts

/**
 * IPC 通道类型
 */
type IPCChannel = 
  | `ssh:${string}`
  | `file:${string}`
  | `db:${string}`

/**
 * 事件名称类型
 */
type EventName<T extends string> = `on${Capitalize<T>}`

/**
 * API 路径类型
 */
type APIPath = `/api/${string}`

// 使用
const channel: IPCChannel = 'ssh:connect'  // ✅
const channel2: IPCChannel = 'invalid'     // ❌

const event: EventName<'click'> = 'onClick'  // ✅
const event2: EventName<'click'> = 'click'   // ❌
```

---

## Vue 3 + TypeScript

### 组件类型定义

```typescript
// apps/desktop/src/components/SSHConnectionCard.vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SSHConnection } from '@shared/types'

// Props 类型
interface Props {
  connection: SSHConnection
  selected?: boolean
}

// Emits 类型
interface Emits {
  (e: 'connect', id: string): void
  (e: 'edit', connection: SSHConnection): void
  (e: 'delete', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const isHovered = ref(false)

// 计算属性
const statusText = computed(() => {
  return props.selected ? '已连接' : '未连接'
})

// 方法
function handleConnect() {
  emit('connect', props.connection.id)
}

function handleEdit() {
  emit('edit', props.connection)
}

function handleDelete() {
  emit('delete', props.connection.id)
}

// 暴露给父组件
defineExpose({
  connection: props.connection
})
</script>
```

### Composables 类型

```typescript
// apps/desktop/src/composables/useSSHConnection.ts
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { SSHConnection } from '@shared/types'

export interface UseSSHConnectionReturn {
  connections: Ref<SSHConnection[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  selectedConnection: Ref<SSHConnection | null>
  fetchConnections: () => Promise<void>
  createConnection: (data: Partial<SSHConnection>) => Promise<void>
  updateConnection: (id: string, data: Partial<SSHConnection>) => Promise<void>
  deleteConnection: (id: string) => Promise<void>
  selectConnection: (id: string) => void
}

export function useSSHConnection(): UseSSHConnectionReturn {
  const connections = ref<SSHConnection[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedConnection = ref<SSHConnection | null>(null)

  async function fetchConnections() {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/connections')
      const data = await response.json()
      connections.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : '未知错误'
    } finally {
      loading.value = false
    }
  }

  async function createConnection(data: Partial<SSHConnection>) {
    // ...
  }

  async function updateConnection(id: string, data: Partial<SSHConnection>) {
    // ...
  }

  async function deleteConnection(id: string) {
    // ...
  }

  function selectConnection(id: string) {
    selectedConnection.value = connections.value.find(c => c.id === id) || null
  }

  return {
    connections,
    loading,
    error,
    selectedConnection,
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    selectConnection
  }
}
```

### Pinia Store 类型

```typescript
// apps/desktop/src/stores/ssh.ts
import { defineStore } from 'pinia'
import type { SSHConnection } from '@shared/types'

interface SSHState {
  connections: SSHConnection[]
  activeConnectionId: string | null
  loading: boolean
  error: string | null
}

export const useSSHStore = defineStore('ssh', {
  state: (): SSHState => ({
    connections: [],
    activeConnectionId: null,
    loading: false,
    error: null
  }),

  getters: {
    activeConnection(): SSHConnection | null {
      if (!this.activeConnectionId) return null
      return this.connections.find(c => c.id === this.activeConnectionId) || null
    },

    connectionCount(): number {
      return this.connections.length
    }
  },

  actions: {
    async fetchConnections() {
      this.loading = true
      this.error = null

      try {
        const response = await fetch('/api/connections')
        this.connections = await response.json()
      } catch (e) {
        this.error = e instanceof Error ? e.message : '未知错误'
      } finally {
        this.loading = false
      }
    },

    setActiveConnection(id: string) {
      this.activeConnectionId = id
    }
  }
})
```

---

## 性能优化

### 1. 类型推断优化

```typescript
// ❌ 显式类型注解（冗余）
const connections: SSHConnection[] = await fetchConnections()

// ✅ 类型推断
const connections = await fetchConnections()  // 自动推断为 SSHConnection[]
```

### 2. 避免 any

```typescript
// ❌ 使用 any
function process(data: any) {
  return data.value
}

// ✅ 使用泛型
function process<T extends { value: any }>(data: T) {
  return data.value
}

// ✅ 使用 unknown
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: any }).value
  }
}
```

### 3. 类型缓存

```typescript
// ❌ 重复计算类型
type A = SomeComplexType<T>
type B = SomeComplexType<T>
type C = SomeComplexType<T>

// ✅ 缓存类型
type CachedType = SomeComplexType<T>
type A = CachedType
type B = CachedType
type C = CachedType
```

### 4. 增量编译

```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

---

## 总结

TypeScript 全栈开发的关键要点：

1. **严格的类型检查** - 启用所有严格模式
2. **类型共享** - Monorepo + 共享包
3. **类型安全的 API** - DTO + 类型转换
4. **实用工具类型** - 泛型、条件类型、映射类型
5. **Vue 3 集成** - 完整的类型支持

**最佳实践**：
- ✅ 启用严格模式
- ✅ 使用类型推断
- ✅ 避免 any
- ✅ 共享类型定义
- ✅ 使用类型守卫

---

## 项目信息

想了解更多技术细节？

- 🌟 **GitHub 仓库**：https://github.com/aifuqiang02/ai-ssh-assistant
- 📦 **下载体验**：https://github.com/aifuqiang02/ai-ssh-assistant/releases/latest
- 💬 **QQ 交流群**：307460844 - [点击加入](https://qm.qq.com/q/etLhGujyzm)

**如果觉得有用，欢迎给个 ⭐️ Star 支持一下！**

---

## 关于作者

一名热爱开源的后端开发工程师，专注于 AI 与开发工具的结合。

欢迎关注我，后续会持续分享 AI SSH Assistant 的技术细节！

---

**相关文章**：
- 上一篇：《AI 工具系统设计：让 AI 拥有执行能力》
- 下一篇：《实战篇》系列即将发布

---

*本文首发于 CSDN，转载请注明出处。*

