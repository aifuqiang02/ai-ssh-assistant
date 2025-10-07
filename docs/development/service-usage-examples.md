# 服务使用示例

## 📦 Chat 服务

### 基本使用

```typescript
import { chatService } from '@/services/chat.service'

// ✅ 创建会话（自动获取 userId）
const session = await chatService.createSession({
  title: 'New Chat',
  folderId: 'folder-id',
  model: 'gpt-4'
})

// ✅ 获取所有会话
const sessions = await chatService.getSessions()

// ✅ 发送消息
const message = await chatService.sendMessage(sessionId, 'Hello AI!')

// ✅ 获取消息列表
const messages = await chatService.getMessages(sessionId)

// ✅ 删除会话
await chatService.deleteSession(sessionId)
```

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { chatService } from '@/services/chat.service'
import type { ChatSession } from '@ai-ssh/shared'

const sessions = ref<ChatSession[]>([])
const loading = ref(false)

// 加载会话列表
const loadSessions = async () => {
  loading.value = true
  try {
    // ✅ 无需传 userId，自动获取
    sessions.value = await chatService.getSessions()
  } catch (error) {
    console.error('Failed to load sessions:', error)
  } finally {
    loading.value = false
  }
}

// 创建新会话
const createSession = async (title: string) => {
  try {
    // ✅ 无需传 userId，自动获取
    const newSession = await chatService.createSession({ title })
    sessions.value.unshift(newSession)
  } catch (error) {
    console.error('Failed to create session:', error)
  }
}

onMounted(() => {
  loadSessions()
})
</script>
```

---

## ⚙️ Settings 服务

### 基本使用

```typescript
import { settingsService } from '@/services/settings.service'

// ✅ 获取设置（自动获取 userId）
const settings = await settingsService.getSettings()

// ✅ 保存设置
await settingsService.saveSettings({
  theme: 'dark',
  language: 'zh-CN',
  aiProviders: [...]
})

// ✅ 重置设置
await settingsService.resetSettings()

// ✅ 导出设置
await settingsService.exportSettings('/path/to/settings.json')

// ✅ 导入设置
const result = await settingsService.importSettings('/path/to/settings.json')
```

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { settingsService } from '@/services/settings.service'
import type { AppSettings } from '@/services/settings.service'

const settings = ref<AppSettings>({})
const saving = ref(false)

// 加载设置
const loadSettings = async () => {
  try {
    // ✅ 无需传 userId，自动获取
    settings.value = await settingsService.getSettings()
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

// 保存设置
const saveSettings = async () => {
  saving.value = true
  try {
    // ✅ 无需传 userId，自动获取
    await settingsService.saveSettings(settings.value)
    console.log('Settings saved successfully')
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
```

---

## 🔌 SSH 服务

### 基本使用

```typescript
import { sshService } from '@/services/ssh.service'

// ✅ 连接 SSH
const connection = await sshService.connect({
  host: '192.168.1.100',
  port: 22,
  username: 'root',
  password: 'password'
})

// ✅ 执行命令
const result = await sshService.execute(connection.id, 'ls -la')
console.log(result.output)

// ✅ 列出文件
const files = await sshService.listFiles(connection.id, '/home')

// ✅ 上传文件
await sshService.uploadFile(connection.id, '/local/file.txt', '/remote/file.txt')

// ✅ 下载文件
await sshService.downloadFile(connection.id, '/remote/file.txt', '/local/file.txt')

// ✅ 断开连接
await sshService.disconnect(connection.id)
```

---

## 🔄 存储模式切换

所有服务会根据 `localStorage.getItem('storageMode')` **自动选择**本地或远程实现：

### 本地模式

```typescript
// 设置为本地模式
localStorage.setItem('storageMode', 'local')

// ✅ 所有服务调用自动使用本地 IPC 实现
await chatService.createSession({ title: 'Test' })
// → 调用 window.electronAPI.chat.createSession(userId, data)
```

### 云端模式

```typescript
// 设置为云端模式
localStorage.setItem('storageMode', 'cloud')

// ✅ 所有服务调用自动使用远程 API 实现
await chatService.createSession({ title: 'Test' })
// → 调用 POST http://api.example.com/api/chat/sessions
```

### 响应式切换（可选）

如果需要实时响应 storageMode 变化，使用 `createReactiveService`：

```typescript
import { createReactiveService } from './base/service-factory'

// ✅ 支持热切换
export const chatService = createReactiveService<IChatService>(
  'ChatService',
  ChatLocalImpl,
  ChatApiImpl
)

// 当用户切换存储模式时，服务实例会自动切换
```

---

## 🎯 最佳实践

### 1. 错误处理

```typescript
try {
  const sessions = await chatService.getSessions()
  // 处理成功逻辑
} catch (error) {
  if (error.message?.includes('401')) {
    // 未授权，跳转登录
    router.push('/login')
  } else {
    // 其他错误
    console.error('Failed to load sessions:', error)
  }
}
```

### 2. 加载状态

```typescript
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const data = await chatService.getSessions()
    // 处理数据
  } finally {
    loading.value = false  // 无论成功失败都要关闭加载
  }
}
```

### 3. 用户未登录处理

```typescript
import { getUserId } from '@/services/base/service-factory'

// 检查是否登录
if (!getUserId()) {
  console.warn('User not logged in')
  router.push('/login')
  return
}

// 已登录，继续调用服务
const sessions = await chatService.getSessions()
```

### 4. TypeScript 类型推断

```typescript
import type { ChatSession, ChatMessage } from '@ai-ssh/shared'
import type { AppSettings } from '@/services/settings.service'

// ✅ 完整的类型推断
const session: ChatSession = await chatService.createSession({ title: 'Test' })
const messages: ChatMessage[] = await chatService.getMessages(session.id)
const settings: AppSettings = await settingsService.getSettings()
```

---

## 📝 总结

### ✅ 优势

1. **自动获取 userId** - 无需每次传递
2. **自动模式切换** - 根据 `storageMode` 自动选择实现
3. **类型安全** - 完整的 TypeScript 支持
4. **简洁易用** - 减少样板代码
5. **统一接口** - 本地和云端调用方式一致

### 📖 相关文档

- [服务架构设计](./service-architecture.md)
- [重构前后对比](./refactoring-comparison.md)

