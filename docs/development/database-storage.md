# 数据存储兼容方案

本项目实现了一套完整的本地存储和云存储兼容方案，支持离线使用、自动同步和冲突解决。

## 🚀 特性

- **多种存储模式**：本地存储、云存储、混合存储
- **自动同步**：支持实时同步和定时同步
- **离线支持**：网络断开时自动切换到本地存储
- **冲突解决**：智能处理数据冲突
- **性能优化**：连接池、重试机制、缓存策略
- **类型安全**：完整的 TypeScript 支持

## 📦 安装

```bash
# 已包含在项目中，无需额外安装
pnpm install
```

## 🔧 配置

### 环境变量

```bash
# 云数据库连接（可选）
DATABASE_URL="postgresql://user:password@host:5432/database"

# 本地数据库连接（可选）
LOCAL_DATABASE_URL="file:./local.db"

# 测试数据库连接（可选）
TEST_DATABASE_URL="file:./test.db"
```

### 基础配置

```typescript
import { StorageManager, createStorageConfig } from '@packages/database'

// 自动检测最佳配置
const config = autoDetectStorageConfig()
const storage = new StorageManager(config)
```

## 📖 使用方法

### 1. 基础使用

```typescript
import { StorageManager, storagePresets } from '@packages/database'

// 使用预设配置
const storage = new StorageManager(storagePresets.localOnly)

await storage.connect()

// CRUD 操作
const user = await storage.create('user', {
  email: 'user@example.com',
  username: 'testuser'
})

const users = await storage.findMany('user', {
  where: { isActive: true }
})

await storage.update('user', {
  where: { id: user.id },
  data: { lastLogin: new Date() }
})

await storage.disconnect()
```

### 2. 混合模式（推荐）

```typescript
const config = createStorageConfig('production', {
  allowCloudStorage: true,
  allowOfflineMode: true,
  syncFrequency: 'moderate'
})

const storage = new StorageManager(config)
await storage.connect()

// 数据会自动在本地和云端同步
const session = await storage.create('chatSession', {
  title: '新会话',
  userId: 'user123'
})

// 检查同步状态
const status = await storage.getStatus()
console.log('同步状态:', status.sync)

// 手动触发同步
if (status.sync.enabled) {
  const result = await storage.sync()
  console.log('同步结果:', result)
}
```

### 3. 事务处理

```typescript
await storage.transaction(async (txStorage) => {
  const user = await txStorage.create('user', userData)
  const session = await txStorage.create('chatSession', {
    userId: user.id,
    title: '欢迎会话'
  })
  return { user, session }
})
```

### 4. 离线模式

```typescript
// 配置离线支持
const config = {
  mode: 'hybrid',
  hybridOptions: {
    primaryStorage: 'local',
    fallbackEnabled: true,
    offlineMode: true
  }
}

const storage = new StorageManager(config)
await storage.connect()

// 即使网络断开，数据仍会保存到本地
const message = await storage.create('message', {
  content: '离线消息',
  userId: 'user123'
})

// 网络恢复后自动同步
```

## 🎯 存储模式

### Local Only（仅本地）
```typescript
const storage = new StorageManager(storagePresets.localOnly)
```
- ✅ 完全离线工作
- ✅ 数据隐私性最高
- ❌ 无法跨设备同步

### Cloud Only（仅云端）
```typescript
const storage = new StorageManager(storagePresets.cloudOnly)
```
- ✅ 自动跨设备同步
- ✅ 数据备份安全
- ❌ 需要网络连接

### Hybrid（混合模式）⭐
```typescript
const storage = new StorageManager(storagePresets.highPerformance)
```
- ✅ 本地缓存，快速响应
- ✅ 云端同步，数据安全
- ✅ 离线支持
- ✅ 自动冲突解决

## ⚙️ 高级配置

### 自定义同步策略

```typescript
const config = {
  mode: 'hybrid',
  hybridOptions: {
    syncStrategy: 'realtime', // 实时同步
    syncInterval: 30 * 1000,  // 30秒
    conflictResolution: 'merge' // 智能合并
  }
}
```

### 性能优化

```typescript
const config = {
  mode: 'cloud',
  cloudOptions: {
    provider: 'postgresql',
    poolSize: 50,        // 连接池大小
    timeout: 5000,       // 超时时间
    retryAttempts: 5,    // 重试次数
    ssl: true
  }
}
```

### 用户偏好配置

```typescript
const config = createStorageConfig('production', {
  allowCloudStorage: true,    // 允许云存储
  allowOfflineMode: true,     // 允许离线模式
  syncFrequency: 'frequent',  // 同步频率
  dataPrivacy: 'moderate'     // 数据隐私级别
})
```

## 🔄 同步机制

### 同步状态

```typescript
const status = await storage.getStatus()
console.log({
  mode: status.mode,
  localConnected: status.local.connected,
  cloudConnected: status.cloud.connected,
  syncInProgress: status.sync.inProgress,
  lastSync: status.local.lastSync
})
```

### 手动同步

```typescript
const result = await storage.sync()
console.log({
  success: result.success,
  recordsSynced: result.recordsSynced,
  conflictsResolved: result.conflictsResolved,
  errors: result.errors
})
```

### 冲突解决策略

1. **local**: 优先本地数据
2. **cloud**: 优先云端数据  
3. **merge**: 智能合并（默认）
4. **manual**: 手动处理

## 🛠️ 数据库迁移

运行同步字段迁移：

```bash
# PostgreSQL
psql -d your_database -f packages/database/migrations/add-sync-fields.sql

# SQLite（本地开发）
sqlite3 local.db < packages/database/migrations/add-sync-fields.sql
```

## 📊 监控和调试

### 连接状态监控

```typescript
// 健康检查
const isHealthy = await storage.cloudAdapter?.healthCheck()

// 连接信息
const info = await storage.cloudAdapter?.getConnectionInfo()
```

### 日志配置

```typescript
// 启用详细日志
const storage = new StorageManager({
  mode: 'hybrid',
  cloudOptions: {
    log: ['query', 'info', 'warn', 'error']
  }
})
```

## 🔐 安全考虑

1. **数据加密**: 敏感数据在本地存储前加密
2. **连接安全**: 云端连接使用 SSL/TLS
3. **访问控制**: 基于用户权限的数据访问
4. **审计日志**: 记录所有数据变更操作

## 📱 平台适配

### Electron 应用
```typescript
// 自动检测 Electron 环境
const config = autoDetectStorageConfig() // 自动选择混合模式
```

### 移动应用
```typescript
const config = storagePresets.mobile // 优化流量使用
```

### Web 应用
```typescript
const config = storagePresets.cloudOnly // 纯云端存储
```

## 🚨 错误处理

```typescript
try {
  await storage.connect()
  // 数据操作...
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    // 网络连接失败，切换到本地模式
    await storage.switchMode('local')
  }
}
```

## 📈 性能建议

1. **批量操作**: 使用 `createMany`、`updateMany` 等批量方法
2. **索引优化**: 为常用查询字段创建索引
3. **连接池**: 合理配置数据库连接池大小
4. **缓存策略**: 启用适当的缓存机制
5. **分页查询**: 大量数据使用分页加载

## 🔧 故障排除

### 常见问题

1. **同步失败**: 检查网络连接和数据库权限
2. **冲突过多**: 调整冲突解决策略
3. **性能问题**: 优化查询和索引
4. **连接超时**: 增加超时时间和重试次数

### 调试技巧

```typescript
// 启用调试模式
process.env.DEBUG = 'storage:*'

// 查看详细错误信息
const result = await storage.sync()
if (!result.success) {
  console.error('同步错误:', result.errors)
}
```

## 📚 更多示例

查看 `packages/database/examples/storage-usage.ts` 文件获取完整的使用示例。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个存储系统！
