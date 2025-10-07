# 架构改进建议

## 当前架构问题

### Desktop 应用直连数据库的问题：

1. **安全风险**
   - 数据库连接字符串暴露在客户端
   - 用户可以通过逆向工程获取数据库凭证
   - 无法实现细粒度的权限控制

2. **网络限制**
   - 需要数据库端口（5432）对外开放
   - 企业防火墙可能阻止直连
   - 增加数据库的攻击面

3. **维护困难**
   - 数据库迁移需要更新所有客户端
   - 无法统一管理 API 版本
   - 难以实施速率限制和监控

## 推荐架构

### 选项 1：所有客户端通过 Server API（推荐）✅

```
┌─────────────┐                    ┌──────────────┐
│   Desktop   │                    │    Server    │
│   应用      │────HTTP API───────→│   (Fastify)  │
└─────────────┘                    │              │
                                   │  - 认证鉴权  │
┌─────────────┐    HTTP API        │  - 数据校验  │
│    Web      │───────────────────→│  - 业务逻辑  │
│   应用      │                    │  - 速率限制  │
└─────────────┘                    └──────┬───────┘
                                          │
                                          ↓
                                   ┌──────────────┐
                                   │  PostgreSQL  │
                                   │   数据库     │
                                   └──────────────┘
```

**优势：**
- ✅ 统一的 API 层，便于维护
- ✅ 数据库凭证只在服务器端
- ✅ 可实现细粒度的权限控制
- ✅ 统一的日志、监控、限流
- ✅ 更好的安全性

**Desktop 应用的存储策略：**
- **Local Only**: 本地 SQLite（离线使用）
- **Cloud Mode**: HTTP API → Server → PostgreSQL
- **Hybrid Mode**: SQLite 缓存 + HTTP API 同步

### 选项 2：混合架构（当前方案优化）

保留直连能力，但添加 HTTP API 选项：

```typescript
// packages/database/src/adapters/cloud.adapter.ts

export class CloudStorageAdapter extends BaseStorageAdapter {
  constructor(options: CloudStorageOptions) {
    super(options)
    
    // 支持两种连接方式
    if (options.useHttpApi) {
      // 通过 HTTP API
      this.client = new HttpApiClient(options.apiUrl, options.token)
    } else {
      // 直连数据库
      this.prisma = new PrismaClient({...})
    }
  }
}
```

**配置示例：**

```typescript
// Desktop 应用 - 通过 API（安全）
const storage = new StorageManager({
  mode: 'cloud',
  cloudOptions: {
    useHttpApi: true,
    apiUrl: 'https://api.example.com',
    token: userToken
  }
})

// Server 端 - 直连数据库
const storage = new StorageManager({
  mode: 'cloud',
  cloudOptions: {
    useHttpApi: false,
    connectionString: process.env.DATABASE_URL
  }
})
```

## 实施步骤

### 1. 创建 HTTP API 适配器

```typescript
// packages/database/src/adapters/http-api.adapter.ts
export class HttpApiAdapter extends BaseStorageAdapter {
  private apiClient: ApiClient
  
  constructor(options: HttpApiOptions) {
    super(options)
    this.apiClient = new ApiClient(options.baseUrl, options.token)
  }
  
  async create(model: string, data: any) {
    return this.apiClient.post(`/${model}`, data)
  }
  
  async findMany(model: string, args: any) {
    return this.apiClient.get(`/${model}`, { params: args })
  }
  
  // ... 其他方法
}
```

### 2. 更新 Server API 路由

在 Server 端添加通用的数据操作端点：

```typescript
// packages/server/src/routes/storage.routes.ts
export const storageRoutes = async (fastify: FastifyInstance) => {
  // 创建记录
  fastify.post('/:model', async (request, reply) => {
    const { model } = request.params
    const data = request.body
    const userId = request.user.id
    
    // 权限检查
    if (!canAccess(userId, model, 'create')) {
      return reply.code(403).send({ error: 'Forbidden' })
    }
    
    const result = await prisma[model].create({ data })
    return result
  })
  
  // 查询记录
  fastify.get('/:model', async (request, reply) => {
    const { model } = request.params
    const args = request.query
    const userId = request.user.id
    
    // 添加用户过滤
    const where = { ...args.where, userId }
    
    const result = await prisma[model].findMany({ ...args, where })
    return result
  })
  
  // ... 其他 CRUD 操作
}
```

### 3. Desktop 应用配置

```typescript
// apps/desktop/electron/main/index.ts
import { StorageManager } from '@ai-ssh/database'

// 初始化存储管理器
const storage = new StorageManager({
  mode: 'hybrid',
  hybridOptions: {
    // 本地存储
    localOptions: {
      connectionString: 'file:./local.db'
    },
    // 云端通过 API
    cloudOptions: {
      useHttpApi: true,
      apiUrl: process.env.API_URL || 'http://localhost:3000/api/v1',
      token: userToken
    }
  }
})
```

## 安全考虑

### 当前方案（直连）的安全措施：

1. **连接字符串加密**
   ```typescript
   const encryptedDbUrl = encrypt(DATABASE_URL, DEVICE_KEY)
   ```

2. **只读数据库用户**
   ```sql
   CREATE USER desktop_app WITH PASSWORD 'xxx';
   GRANT SELECT, INSERT, UPDATE ON ALL TABLES TO desktop_app;
   REVOKE DELETE, DROP ON ALL TABLES FROM desktop_app;
   ```

3. **VPN/私有网络**
   - 数据库不对公网开放
   - 通过 VPN 访问

### 推荐方案（HTTP API）的优势：

1. **JWT 认证**
   - 短期令牌，定期刷新
   - 细粒度权限控制

2. **速率限制**
   ```typescript
   fastify.register(rateLimit, {
     max: 100,
     timeWindow: '1 minute'
   })
   ```

3. **审计日志**
   - 记录所有 API 调用
   - 异常行为检测

## 总结

### 当前架构：
- Desktop → 直连 PostgreSQL ❌
- Web → Server API → PostgreSQL ✅

### 推荐架构：
- Desktop → Server API → PostgreSQL ✅
- Web → Server API → PostgreSQL ✅

**建议立即改进：**
1. 为 Desktop 应用实现 HTTP API 适配器
2. 逐步迁移现有直连代码
3. 保留直连作为备选方案（企业内网使用）

