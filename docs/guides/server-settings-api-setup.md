# Server Settings API 使用指南

## 📋 概述

Settings API 允许桌面应用将用户设置同步到云端，实现跨设备数据同步。

---

## 🗄️ 数据库设计

### UserSettings 表结构

```prisma
model UserSettings {
  id        String   @id @default(cuid())
  userId    String   @unique
  data      Json     // 存储所有用户设置（JSON格式）
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_settings")
}
```

### 为什么移除了 User 表的 settings 字段？

**之前（重复设计）**：
```prisma
model User {
  settings Json?  // ❌ 直接存储
  userSettings UserSettings?  // ❌ 又关联表
}
```

**现在（清晰设计）**：
```prisma
model User {
  userSettings UserSettings?  // ✅ 只用独立表
}
```

**优势**：
- ✅ 避免数据重复
- ✅ User 表保持简洁
- ✅ 更好的扩展性
- ✅ 可以追踪设置历史

---

## 🚀 部署步骤

### 1. 安装依赖

```bash
cd packages/server
pnpm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# 数据库连接
CLOUD_DATABASE_URL="postgresql://username:password@localhost:5432/ai_ssh_assistant"

# JWT 密钥
JWT_SECRET="your-secret-key-here"

# Server 配置
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"
```

### 3. 生成 Prisma Client

```bash
cd packages/database
pnpm db:generate
```

### 4. 运行数据库迁移

```bash
# 创建迁移
pnpm prisma migrate dev --name add_user_settings

# 或者直接推送到数据库（开发环境）
pnpm db:push
```

### 5. 启动 Server

```bash
cd packages/server
pnpm dev
```

**预期输出**：
```
Server listening at http://0.0.0.0:3000
✅ Settings API ready at /api/v1/settings
```

---

## 📡 API 文档

### 基础信息

- **Base URL**: `http://localhost:3000/api/v1`
- **认证方式**: JWT Bearer Token
- **Content-Type**: `application/json`

### 1. 获取用户设置

**请求**：
```http
GET /api/v1/settings
Authorization: Bearer <your-jwt-token>
```

**响应**（200 OK）：
```json
{
  "success": true,
  "message": "获取设置成功",
  "data": {
    "settings": {
      "appearance": {
        "theme": "dark",
        "fontSize": "medium",
        "colorScheme": "blue"
      },
      "ssh": {
        "timeout": 30000,
        "keepAlive": true,
        "defaultPort": 22
      },
      "aiProviders": [...],
      "advanced": {
        "storageMode": "hybrid",
        "syncFrequency": "moderate"
      },
      "version": "1.0.0",
      "lastUpdated": "2025-10-07T10:30:00.000Z"
    }
  }
}
```

**响应**（404 Not Found - 首次访问）：
```json
{
  "success": false,
  "message": "未找到用户设置",
  "code": "SETTINGS_NOT_FOUND"
}
```

---

### 2. 保存用户设置

**请求**：
```http
POST /api/v1/settings
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "settings": {
    "appearance": {
      "theme": "dark",
      "fontSize": "medium",
      "colorScheme": "blue"
    },
    "ssh": {
      "timeout": 30000,
      "keepAlive": true,
      "defaultPort": 22
    },
    "aiProviders": [...],
    "advanced": {
      "storageMode": "hybrid"
    },
    "version": "1.0.0",
    "lastUpdated": "2025-10-07T10:30:00.000Z"
  }
}
```

**响应**（200 OK）：
```json
{
  "success": true,
  "message": "保存设置成功",
  "data": {
    "settings": { ... }
  }
}
```

---

### 3. 删除用户设置

**请求**：
```http
DELETE /api/v1/settings
Authorization: Bearer <your-jwt-token>
```

**响应**（200 OK）：
```json
{
  "success": true,
  "message": "删除设置成功"
}
```

---

## 🔒 认证流程

### 1. 用户登录获取 Token

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**响应**：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 604800
  }
}
```

### 2. 使用 Token 访问 Settings API

```javascript
const token = "eyJhbGciOiJIUzI1NiIs..."

// 获取设置
fetch('http://localhost:3000/api/v1/settings', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// 保存设置
fetch('http://localhost:3000/api/v1/settings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ settings: { ... } })
})
```

---

## 🖥️ Desktop App 集成

### 配置

在 Desktop App 中设置 API 端点：

**`.env.local`**:
```bash
VITE_API_ENDPOINT=http://localhost:3000/api/v1
```

### 使用流程

```
用户登录
  ↓
获取 accessToken
  ↓
设置 Cloud Config
  apiEndpoint: http://localhost:3000/api/v1
  userToken: <accessToken>
  ↓
切换到 Cloud/Hybrid 模式
  ↓
设置自动同步到云端 ✅
```

---

## 🧪 测试

### 使用 cURL

**获取设置**：
```bash
curl -X GET http://localhost:3000/api/v1/settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**保存设置**：
```bash
curl -X POST http://localhost:3000/api/v1/settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "appearance": {
        "theme": "dark"
      }
    }
  }'
```

### 使用 Postman

1. 创建新请求
2. Method: `GET` 或 `POST`
3. URL: `http://localhost:3000/api/v1/settings`
4. Headers:
   - `Authorization`: `Bearer <token>`
   - `Content-Type`: `application/json`
5. Body (POST):
   ```json
   {
     "settings": { ... }
   }
   ```

---

## 🐛 故障排查

### 问题 1: 401 Unauthorized

**错误**:
```json
{
  "success": false,
  "message": "Authentication required",
  "code": "FST_JWT_NO_AUTHORIZATION_IN_HEADER"
}
```

**解决**:
- ✅ 确保添加了 `Authorization` header
- ✅ Token 格式正确：`Bearer <token>`
- ✅ Token 未过期

---

### 问题 2: 404 Settings Not Found

**错误**:
```json
{
  "success": false,
  "message": "未找到用户设置",
  "code": "SETTINGS_NOT_FOUND"
}
```

**解决**:
- ✅ 这是首次访问的正常行为
- ✅ 先调用 POST 保存设置

---

### 问题 3: ECONNREFUSED

**错误**:
```
Error: connect ECONNREFUSED ::1:3000
```

**解决**:
- ✅ 确保 Server 正在运行
- ✅ 检查端口是否正确（默认 3000）
- ✅ 检查防火墙设置

---

### 问题 4: Database Connection Error

**错误**:
```
Error: Can't reach database server
```

**解决**:
- ✅ 确保 PostgreSQL 正在运行
- ✅ 检查 `CLOUD_DATABASE_URL` 配置
- ✅ 确认数据库用户名和密码
- ✅ 运行 `pnpm db:push` 创建表

---

## 📊 监控

### 健康检查

```bash
curl http://localhost:3000/health
```

**响应**：
```json
{
  "status": "healthy",
  "timestamp": "2025-10-07T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### API 文档

访问 Swagger 文档：
```
http://localhost:3000/docs
```

---

## 🔐 安全建议

### 生产环境

1. **使用 HTTPS**
   ```bash
   VITE_API_ENDPOINT=https://api.your-domain.com/api/v1
   ```

2. **强密钥**
   ```bash
   JWT_SECRET=$(openssl rand -hex 32)
   ```

3. **限流配置**
   ```javascript
   // app.ts 中已配置
   rateLimit: {
     max: 100,  // 每分钟最多 100 次请求
     timeWindow: 60000
   }
   ```

4. **CORS 配置**
   ```bash
   CORS_ORIGIN="https://your-app.com"
   ```

---

## 📝 总结

### ✅ 已实现
- ✅ Settings API 端点
- ✅ JWT 认证
- ✅ 数据库存储
- ✅ 自动时间戳
- ✅ 用户隔离

### 🔄 工作流程
```
Desktop App → HTTP API → Server → PostgreSQL
     ↑                                    ↓
     └──────────── 云端同步 ───────────────┘
```

### 📚 相关文档
- [架构设计](../architecture/settings-storage-redesign.md)
- [测试指南](../testing/settings-storage-modes-test.md)
- [修复记录](../fixes/settings-cloud-storage-complete-fix.md)

---

**文档版本**: 1.0  
**创建时间**: 2025-10-07  
**状态**: ✅ API 已实现，待部署测试

