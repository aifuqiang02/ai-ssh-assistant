# 直接使用 Service 架构（移除 Pinia Store 中间层）

## 🎯 重构目标

**问题**：在新的服务架构下，Pinia Store 成为了多余的中间层

**解决方案**：组件直接使用 `chatService`，移除 `useChatStore`

## 📊 重构前后对比

### 重构前 ❌：三层架构（冗余）

```
组件 (AppSidebar.vue)
    ↓ 调用
Pinia Store (useChatStore)
    ↓ 调用
API Service (apiService)
    ↓ 调用
后端 API 或 本地 IPC
```

**问题**：
- Pinia Store 只是简单转发调用，没有复杂状态管理
- 增加了一层不必要的抽象
- 维护成本高（修改API要同时改Store和Service）

### 重构后 ✅：两层架构（简洁）

```
组件 (AppSidebar.vue)
    ↓ 直接调用
Chat Service (chatService)
    ↓ 自动选择
远程 API (ChatApiImpl) 或 本地 IPC (ChatLocalImpl)
```

**优势**：
- 减少一层抽象
- 组件直接管理自己的状态
- 代码更简洁易懂
- chatService 自动根据 `storageMode` 选择实现

## 🔧 重构步骤

### 1. 扩展 chatService 接口

```typescript
// apps/desktop/src/services/chat.service.ts

export interface IChatService {
  // 树形结构
  getChatTree(): Promise<ChatTreeNode[]>
  
  // 文件夹管理
  createFolder(data: CreateChatFolderDto): Promise<any>
  updateFolder(id: string, data: UpdateChatFolderDto): Promise<any>
  deleteFolder(id: string): Promise<void>
  
  // 会话管理
  createSession(data: CreateChatSessionDto): Promise<any>
  updateSession(id: string, data: UpdateChatSessionDto): Promise<any>
  deleteSession(id: string): Promise<void>
  
  // 节点移动
  moveNode(data: MoveChatNodeDto): Promise<void>
  
  // 消息管理
  sendMessage(sessionId: string, content: string): Promise<ChatMessage>
  getMessages(sessionId: string): Promise<ChatMessage[]>
  deleteMessage(messageId: string): Promise<void>
}
```

### 2. 实现 API 和 Local 版本

**API 实现**：
```typescript
class ChatApiImpl extends BaseApiImpl implements IChatService {
  async getChatTree(): Promise<ChatTreeNode[]> {
    // ✅ 自动携带 token，后端解析 userId
    return this.get('/api/chat/tree')
  }
  
  async createFolder(data: CreateChatFolderDto): Promise<any> {
    return this.post('/api/chat/folders', data)
  }
  
  // ... 其他方法
}
```

**Local 实现**：
```typescript
class ChatLocalImpl extends BaseLocalImpl implements IChatService {
  async getChatTree(): Promise<ChatTreeNode[]> {
    // ✅ this.getUserId() 本地模式返回 'local-user'
    return this.electronAPI.chat.getChatTree?.(this.getUserId()) || []
  }
  
  async createFolder(data: CreateChatFolderDto): Promise<any> {
    return this.electronAPI.chat.createFolder?.(this.getUserId(), data)
  }
  
  // ... 其他方法
}
```

### 3. 组件中直接使用 chatService

**重构前** ❌：
```typescript
// AppSidebar.vue
import { useChatStore } from '../../stores/chat'

const chatStore = useChatStore()
const chatTreeData = computed(() => chatStore.chatTree)

const loadChatTree = () => {
  chatStore.loadChatTree()
}

const createFolder = async (data) => {
  await chatStore.createFolder(data)
}
```

**重构后** ✅：
```typescript
// AppSidebar.vue
import { chatService } from '../../services/chat.service'

const chatTreeData = ref<ChatTreeNode[]>([])
const chatLoading = ref(false)

const loadChatTree = async () => {
  chatLoading.value = true
  try {
    // ✅ 直接调用 chatService
    chatTreeData.value = await chatService.getChatTree()
  } catch (err) {
    console.error('加载失败:', err)
  } finally {
    chatLoading.value = false
  }
}

const createFolder = async (data) => {
  // ✅ 直接调用 chatService
  await chatService.createFolder(data)
  // 重新加载
  await loadChatTree()
}
```

## 📝 具体修改内容

### apps/desktop/src/components/layout/AppSidebar.vue

#### 1. 导入修改
```typescript
// ❌ 移除
import { useChatStore } from '../../stores/chat'

// ✅ 添加
import { chatService } from '../../services/chat.service'
import type { ChatTreeNode as ChatTreeNodeType } from '@ai-ssh/shared'
```

#### 2. 状态管理
```typescript
// ❌ 移除
const chatStore = useChatStore()
const chatTreeData = computed(() => chatStore.chatTree)

// ✅ 添加
const chatTreeData = ref<ChatTreeNodeType[]>([])
const selectedChatNodeId = ref<string | null>(null)
const chatLoading = ref(false)
const chatError = ref<string | null>(null)
```

#### 3. 数据加载
```typescript
const loadChatTree = async () => {
  chatLoading.value = true
  chatError.value = null
  
  try {
    // ✅ 直接使用 chatService
    chatTreeData.value = await chatService.getChatTree()
  } catch (err: any) {
    chatError.value = err.message || '加载聊天树失败'
    console.error('加载聊天树失败:', err)
  } finally {
    chatLoading.value = false
  }
}
```

#### 4. CRUD 操作

**创建文件夹**：
```typescript
const createRootChatFolder = async () => {
  try {
    const newFolder = await chatService.createFolder({
      name: folderName.trim(),
      parentId: null,
      order: 0
    })
    
    // 重新加载树
    await loadChatTree()
  } catch (err) {
    console.error('创建文件夹失败:', err)
  }
}
```

**更新节点**：
```typescript
const handleChatNodeUpdate = async (node: ChatTreeNodeData) => {
  try {
    if (node.type === 'folder') {
      await chatService.updateFolder(node.id, {
        name: node.name,
        parentId: node.parentId,
        order: node.order
      })
    } else {
      await chatService.updateSession(node.id, {
        title: node.name,
        folderId: node.folderId,
        order: node.order
      })
    }
    await loadChatTree()
  } catch (err) {
    console.error('更新节点失败:', err)
  }
}
```

**删除节点**：
```typescript
const handleChatNodeDelete = async (node: ChatTreeNodeData) => {
  try {
    if (node.type === 'folder') {
      await chatService.deleteFolder(node.id)
    } else {
      await chatService.deleteSession(node.id)
    }
    await loadChatTree()
  } catch (err) {
    console.error('删除节点失败:', err)
  }
}
```

## 🎁 优势总结

| 方面 | 重构前（使用 Store） | 重构后（直接 Service） | 改善 |
|------|---------------------|----------------------|------|
| **代码层次** | 3层（组件→Store→Service） | 2层（组件→Service） | ✅ 减少1层 |
| **代码行数** | Store + 组件 | 仅组件 | ✅ 更少 |
| **状态管理** | Pinia Store | Vue ref/reactive | ✅ 更简单 |
| **维护成本** | 需维护 Store 和 Service | 仅维护 Service | ✅ 更低 |
| **模式切换** | 手动判断 | 自动（chatService内部） | ✅ 更智能 |
| **类型安全** | 分散在多处 | 集中在 Service | ✅ 更好 |

## 🚀 扩展建议

### 1. 何时需要 Pinia Store？

**需要 Store 的场景**：
- 多个组件共享复杂状态
- 需要 Pinia 的 devtools 调试
- 需要持久化插件
- 复杂的状态计算和派生

**直接使用 Service 的场景**（当前 Chat）：
- 组件独立管理状态
- 简单的 CRUD 操作
- 状态不需要跨组件共享

### 2. 其他服务的重构

可以用相同方式重构：
- **Settings Service**：已实现 ✅
- **SSH Service**：可以考虑重构（如果 SSH Store 也是简单转发）
- **文件管理 Service**：TODO

### 3. 状态管理最佳实践

```typescript
// ✅ 推荐：组件内部管理状态
const data = ref<T[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    data.value = await service.getData()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

## 📚 相关文档

- [服务架构设计](./service-architecture.md)
- [本地模式优化](./local-mode-optimization.md)
- [重构前后对比](./refactoring-comparison.md)

