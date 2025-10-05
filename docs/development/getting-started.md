# AI SSH Assistant 开发指南

本文档详细说明如何在 AI SSH Assistant 项目中添加新功能。

## 目录

- [项目架构](#项目架构)
- [开发环境准备](#开发环境准备)
- [添加新功能的步骤](#添加新功能的步骤)
- [示例：添加一个新的 API 功能](#示例添加一个新的-api-功能)
- [示例：添加一个新的前端页面](#示例添加一个新的前端页面)
- [示例：添加数据库表](#示例添加数据库表)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 项目架构

本项目采用 **Monorepo** 架构，使用 `pnpm workspace` 管理多个包：

```
ai-ssh-assistant/
├── apps/
│   └── desktop/          # Electron 桌面应用（Vue 3 + TypeScript）
│       ├── electron/     # Electron 主进程
│       │   ├── main/     # 主进程入口
│       │   ├── preload/  # 预加载脚本
│       │   └── ipc/      # IPC 处理器
│       └── src/          # Vue 渲染进程
│           ├── components/
│           ├── stores/   # Pinia 状态管理
│           ├── services/ # API 服务
│           ├── router/   # Vue Router
│           └── views/    # 页面视图
├── packages/
│   ├── database/         # 数据库层（Prisma）
│   │   ├── prisma/       # Prisma schema & migrations
│   │   └── src/          # 数据库客户端
│   ├── server/           # 后端服务（Fastify）
│   │   └── src/
│   │       ├── routes/   # API 路由
│   │       ├── services/ # 业务逻辑
│   │       ├── utils/    # 工具函数
│   │       └── config/   # 配置文件
│   └── shared/           # 共享代码
│       └── src/
│           ├── types/    # TypeScript 类型定义
│           ├── constants/# 常量
│           └── utils/    # 共享工具函数
```

### 技术栈

- **前端**: Vue 3 + TypeScript + Pinia + TailwindCSS
- **桌面**: Electron
- **后端**: Fastify + TypeScript
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM**: Prisma
- **缓存**: Redis

---

## 开发环境准备

### 1. 环境要求

#### 使用 Docker（推荐）
- Docker >= 20.10
- Docker Compose >= 2.0

#### 本地开发
- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14
- Redis (可选)

### 2. 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd ai-ssh-assistant

# 安装依赖
pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 到根目录并重命名为 `.env`：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置数据库和其他服务：

```env
# 数据库配置
DATABASE_URL="postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant"

# JWT 配置
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# 加密配置
ENCRYPTION_KEY="your-32-char-secret-encryption-key"

# 其他配置...
```

### 4. 初始化数据库

```bash
# 进入 database 包目录
cd packages/database

# 生成 Prisma 客户端
pnpm prisma generate

# 运行迁移
pnpm prisma migrate dev

# 填充初始数据
pnpm prisma db seed
```

### 5. 启动开发环境

#### 方式一：使用 Docker（推荐）

使用 Docker Compose 快速启动所有服务：

```bash
# 启动所有服务（PostgreSQL + Redis + 后端 API + Web 前端 + Nginx + 监控）
docker-compose up -d

# 启动核心服务（PostgreSQL + Redis + 后端 API）
docker-compose up -d postgres redis api

# 查看日志
docker-compose logs -f

# 停止所有服务
docker-compose down

# 停止并删除数据卷（完全清理）
docker-compose down -v
```

单独启动某个服务：

```bash
# 只启动数据库
docker-compose up -d postgres

# 只启动 Redis
docker-compose up -d redis

# 启动后端 API 服务
docker-compose up -d api

# 启动 Web 前端（可选）
docker-compose up -d web

# 启动监控服务（可选）
docker-compose up -d prometheus grafana
```

常用 Docker 命令：

```bash
# 进入 PostgreSQL 容器
docker-compose exec postgres psql -U ai_ssh_user -d ai_ssh_assistant

# 进入 Redis 容器
docker-compose exec redis redis-cli

# 查看容器状态
docker-compose ps

# 重启服务
docker-compose restart api

# 查看特定服务的日志
docker-compose logs -f api

# 重新构建镜像
docker-compose build --no-cache api

# 重新构建所有镜像
docker-compose build --no-cache
```

初始化数据库（使用 Docker）：

```bash
# 进入 API 容器
docker-compose exec api sh

# 在容器内运行 Prisma 命令
cd /app/packages/database
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
exit
```

访问服务：

```bash
# 后端 API：http://localhost:3000
# Web 前端：http://localhost:5173
# Nginx：http://localhost
# Grafana 监控：http://localhost:3001（用户名: admin, 密码: admin123）
# Prometheus：http://localhost:9090
```

#### 方式二：本地开发

使用提供的启动脚本（推荐）：

```bash
# Linux/macOS - 使用 Bash 脚本
chmod +x scripts/dev.sh
./scripts/dev.sh

# Windows - 使用 PowerShell 脚本
.\scripts\start-dev.ps1
```

**注意**: 启动脚本会自动：
1. 检查必要的工具（Node.js、pnpm、Docker）
2. 加载 `.env` 文件中的环境变量
3. 验证必需的环境变量是否已配置
4. 启动 Docker 数据库服务（PostgreSQL + Redis）
5. 安装依赖并运行数据库迁移
6. 启动后端 API 和桌面应用

手动启动：

```bash
# 终端 1: 启动后端服务
cd packages/server
pnpm dev

# 终端 2: 启动桌面应用
cd apps/desktop
pnpm dev
```

---

## 添加新功能的步骤

### 通用流程

```mermaid
graph TD
    A[需求分析] --> B{是否需要数据库?}
    B -->|是| C[设计数据模型]
    B -->|否| E[设计 API 接口]
    C --> D[更新 Prisma Schema]
    D --> E
    E --> F[实现后端 API]
    F --> G[实现前端界面]
    G --> H[测试]
    H --> I[文档更新]
```

### 详细步骤

1. **需求分析**: 明确功能需求和用户场景
2. **数据建模** (如需要): 设计数据库表结构
3. **API 设计**: 定义 RESTful API 接口
4. **后端实现**: 编写 Service 和 Route
5. **前端实现**: 创建组件和页面
6. **状态管理**: 使用 Pinia 管理状态
7. **IPC 通信** (如需要): 添加 Electron IPC 处理
8. **测试**: 单元测试和集成测试
9. **文档**: 更新 API 文档和用户文档

---

## 示例：添加一个新的 API 功能

假设我们要添加一个 **服务器标签管理** 功能。

### 步骤 1: 设计数据模型

编辑 `packages/database/prisma/schema.prisma`:

```prisma
model ServerTag {
  id        String   @id @default(cuid())
  name      String
  color     String   @default("#3B82F6") // 标签颜色
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  servers   ServerConnection[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, name])
  @@map("server_tags")
}

model ServerConnection {
  // ... 现有字段 ...
  tags      ServerTag[]
}
```

运行迁移：

```bash
cd packages/database
pnpm prisma migrate dev --name add_server_tags
pnpm prisma generate
```

### 步骤 2: 添加 TypeScript 类型

在 `packages/shared/src/types/index.ts` 中添加：

```typescript
export interface ServerTag {
  id: string
  name: string
  color: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateServerTagDto {
  name: string
  color?: string
}

export interface UpdateServerTagDto {
  name?: string
  color?: string
}
```

### 步骤 3: 创建 Service

创建 `packages/server/src/services/server-tag.service.ts`:

```typescript
import { PrismaClient } from '../../../database/src/generated/client-postgresql/index.js'
import type { CreateServerTagDto, UpdateServerTagDto, ServerTag } from '@ai-ssh/shared'

export class ServerTagService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * 获取用户的所有标签
   */
  async getUserTags(userId: string): Promise<ServerTag[]> {
    return this.prisma.serverTag.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * 创建标签
   */
  async createTag(userId: string, data: CreateServerTagDto): Promise<ServerTag> {
    return this.prisma.serverTag.create({
      data: {
        ...data,
        userId
      }
    })
  }

  /**
   * 更新标签
   */
  async updateTag(id: string, userId: string, data: UpdateServerTagDto): Promise<ServerTag> {
    // 验证标签所有权
    await this.validateTagOwnership(id, userId)
    
    return this.prisma.serverTag.update({
      where: { id },
      data
    })
  }

  /**
   * 删除标签
   */
  async deleteTag(id: string, userId: string): Promise<void> {
    await this.validateTagOwnership(id, userId)
    
    await this.prisma.serverTag.delete({
      where: { id }
    })
  }

  /**
   * 验证标签所有权
   */
  private async validateTagOwnership(id: string, userId: string): Promise<void> {
    const tag = await this.prisma.serverTag.findUnique({
      where: { id }
    })

    if (!tag) {
      throw new Error('标签不存在')
    }

    if (tag.userId !== userId) {
      throw new Error('无权操作此标签')
    }
  }
}
```

### 步骤 4: 创建 Route

创建 `packages/server/src/routes/server-tag.routes.ts`:

```typescript
import { FastifyPluginAsync } from 'fastify'
import { ServerTagService } from '../services/server-tag.service.js'

const serverTagRoutes: FastifyPluginAsync = async (fastify) => {
  const serverTagService = new ServerTagService(fastify.prisma)

  // 获取用户的所有标签
  fastify.get('/tags', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['ServerTag'],
      summary: '获取用户的所有标签',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  color: { type: 'string' },
                  userId: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id
    const tags = await serverTagService.getUserTags(userId)
    
    return reply.send({
      success: true,
      data: tags
    })
  })

  // 创建标签
  fastify.post('/tags', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['ServerTag'],
      summary: '创建新标签',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 50 },
          color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id
    const data = request.body as any
    
    const tag = await serverTagService.createTag(userId, data)
    
    return reply.status(201).send({
      success: true,
      message: '标签创建成功',
      data: tag
    })
  })

  // 更新标签
  fastify.put('/tags/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['ServerTag'],
      summary: '更新标签',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 50 },
          color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id
    const { id } = request.params as any
    const data = request.body as any
    
    const tag = await serverTagService.updateTag(id, userId, data)
    
    return reply.send({
      success: true,
      message: '标签更新成功',
      data: tag
    })
  })

  // 删除标签
  fastify.delete('/tags/:id', {
    onRequest: [fastify.authenticate],
    schema: {
      tags: ['ServerTag'],
      summary: '删除标签',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const userId = request.user.id
    const { id } = request.params as any
    
    await serverTagService.deleteTag(id, userId)
    
    return reply.send({
      success: true,
      message: '标签删除成功'
    })
  })
}

export default serverTagRoutes
```

### 步骤 5: 注册路由

在 `packages/server/src/app.ts` 中注册路由：

```typescript
import serverTagRoutes from './routes/server-tag.routes.js'

// ... 现有代码 ...

// 注册路由
app.register(serverTagRoutes, { prefix: '/api/v1' })
```

### 步骤 6: 创建前端 API 服务

在 `apps/desktop/src/services/api.service.ts` 中添加方法：

```typescript
export class ApiService {
  // ... 现有方法 ...

  /**
   * 获取用户的所有标签
   */
  async getTags(): Promise<ServerTag[]> {
    const response = await this.get<{ success: boolean; data: ServerTag[] }>('/tags')
    return response.data
  }

  /**
   * 创建标签
   */
  async createTag(data: CreateServerTagDto): Promise<ServerTag> {
    const response = await this.post<{ success: boolean; data: ServerTag }>('/tags', data)
    return response.data
  }

  /**
   * 更新标签
   */
  async updateTag(id: string, data: UpdateServerTagDto): Promise<ServerTag> {
    const response = await this.put<{ success: boolean; data: ServerTag }>(`/tags/${id}`, data)
    return response.data
  }

  /**
   * 删除标签
   */
  async deleteTag(id: string): Promise<void> {
    await this.delete(`/tags/${id}`)
  }
}
```

### 步骤 7: 创建 Pinia Store

创建 `apps/desktop/src/stores/serverTag.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../services/api.service'
import type { ServerTag, CreateServerTagDto, UpdateServerTagDto } from '@ai-ssh/shared'

export const useServerTagStore = defineStore('serverTag', () => {
  const tags = ref<ServerTag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 加载所有标签
   */
  const loadTags = async () => {
    loading.value = true
    error.value = null
    
    try {
      tags.value = await apiService.getTags()
    } catch (err: any) {
      error.value = err.message || '加载标签失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建标签
   */
  const createTag = async (data: CreateServerTagDto) => {
    loading.value = true
    error.value = null
    
    try {
      const newTag = await apiService.createTag(data)
      tags.value.unshift(newTag)
      return newTag
    } catch (err: any) {
      error.value = err.message || '创建标签失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新标签
   */
  const updateTag = async (id: string, data: UpdateServerTagDto) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedTag = await apiService.updateTag(id, data)
      const index = tags.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tags.value[index] = updatedTag
      }
      return updatedTag
    } catch (err: any) {
      error.value = err.message || '更新标签失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除标签
   */
  const deleteTag = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deleteTag(id)
      tags.value = tags.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.message || '删除标签失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tags,
    loading,
    error,
    loadTags,
    createTag,
    updateTag,
    deleteTag
  }
})
```

### 步骤 8: 创建 UI 组件

创建 `apps/desktop/src/components/server/ServerTagManager.vue`:

```vue
<template>
  <div class="server-tag-manager">
    <div class="header">
      <h3 class="text-lg font-semibold">服务器标签</h3>
      <button @click="showCreateDialog = true" class="btn-primary">
        + 新建标签
      </button>
    </div>

    <!-- 标签列表 -->
    <div class="tag-list">
      <div
        v-for="tag in tags"
        :key="tag.id"
        class="tag-item"
        :style="{ borderColor: tag.color }"
      >
        <div class="tag-info">
          <span class="tag-color" :style="{ backgroundColor: tag.color }"></span>
          <span class="tag-name">{{ tag.name }}</span>
        </div>
        <div class="tag-actions">
          <button @click="editTag(tag)" class="btn-icon">
            <IconEdit />
          </button>
          <button @click="confirmDelete(tag)" class="btn-icon">
            <IconDelete />
          </button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑对话框 -->
    <Dialog v-model:visible="showCreateDialog" title="创建标签">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>标签名称</label>
          <input v-model="formData.name" type="text" required />
        </div>
        <div class="form-group">
          <label>标签颜色</label>
          <input v-model="formData.color" type="color" />
        </div>
        <div class="form-actions">
          <button type="button" @click="showCreateDialog = false" class="btn-secondary">
            取消
          </button>
          <button type="submit" class="btn-primary">
            {{ editingTag ? '更新' : '创建' }}
          </button>
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useServerTagStore } from '../../stores/serverTag'
import type { ServerTag } from '@ai-ssh/shared'

const serverTagStore = useServerTagStore()

const showCreateDialog = ref(false)
const editingTag = ref<ServerTag | null>(null)
const formData = ref({
  name: '',
  color: '#3B82F6'
})

const { tags, loadTags } = serverTagStore

onMounted(() => {
  loadTags()
})

const handleSubmit = async () => {
  try {
    if (editingTag.value) {
      await serverTagStore.updateTag(editingTag.value.id, formData.value)
    } else {
      await serverTagStore.createTag(formData.value)
    }
    
    showCreateDialog.value = false
    resetForm()
  } catch (err) {
    console.error('操作失败:', err)
  }
}

const editTag = (tag: ServerTag) => {
  editingTag.value = tag
  formData.value = {
    name: tag.name,
    color: tag.color
  }
  showCreateDialog.value = true
}

const confirmDelete = async (tag: ServerTag) => {
  if (confirm(`确定要删除标签 "${tag.name}" 吗？`)) {
    try {
      await serverTagStore.deleteTag(tag.id)
    } catch (err) {
      console.error('删除失败:', err)
    }
  }
}

const resetForm = () => {
  editingTag.value = null
  formData.value = {
    name: '',
    color: '#3B82F6'
  }
}
</script>

<style scoped>
.server-tag-manager {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tag-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 2px solid;
  border-radius: 8px;
  background: white;
}

.tag-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.tag-actions {
  display: flex;
  gap: 8px;
}
</style>
```

### 步骤 9: 测试

使用 Postman 或前端界面测试所有 API 端点：

- `GET /api/v1/tags` - 获取标签列表
- `POST /api/v1/tags` - 创建标签
- `PUT /api/v1/tags/:id` - 更新标签
- `DELETE /api/v1/tags/:id` - 删除标签

---

## 示例：添加一个新的前端页面

假设我们要添加一个 **服务器监控** 页面。

### 步骤 1: 创建路由

在 `apps/desktop/src/router/index.ts` 中添加路由：

```typescript
const routes = [
  // ... 现有路由 ...
  {
    path: '/monitoring',
    name: 'monitoring',
    component: () => import('../views/MonitoringView.vue'),
    meta: {
      requiresAuth: true,
      title: '服务器监控'
    }
  }
]
```

### 步骤 2: 创建页面组件

创建 `apps/desktop/src/views/MonitoringView.vue`:

```vue
<template>
  <div class="monitoring-view">
    <AppHeader title="服务器监控" />
    
    <div class="monitoring-content">
      <!-- 监控仪表板 -->
      <div class="dashboard-grid">
        <MetricCard
          title="CPU 使用率"
          :value="metrics.cpu"
          unit="%"
          :trend="metrics.cpuTrend"
        />
        <MetricCard
          title="内存使用率"
          :value="metrics.memory"
          unit="%"
          :trend="metrics.memoryTrend"
        />
        <MetricCard
          title="磁盘使用率"
          :value="metrics.disk"
          unit="%"
          :trend="metrics.diskTrend"
        />
        <MetricCard
          title="网络流量"
          :value="metrics.network"
          unit="MB/s"
          :trend="metrics.networkTrend"
        />
      </div>

      <!-- 实时图表 -->
      <div class="charts-section">
        <LineChart
          title="CPU 使用率趋势"
          :data="cpuChartData"
        />
        <LineChart
          title="内存使用率趋势"
          :data="memoryChartData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from '../components/layout/AppHeader.vue'
import MetricCard from '../components/monitoring/MetricCard.vue'
import LineChart from '../components/monitoring/LineChart.vue'

const metrics = ref({
  cpu: 0,
  memory: 0,
  disk: 0,
  network: 0,
  cpuTrend: 'up',
  memoryTrend: 'down',
  diskTrend: 'stable',
  networkTrend: 'up'
})

const cpuChartData = ref([])
const memoryChartData = ref([])

let intervalId: number | null = null

onMounted(() => {
  // 开始定时获取监控数据
  fetchMetrics()
  intervalId = setInterval(fetchMetrics, 5000) as any
})

onUnmounted(() => {
  // 清理定时器
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const fetchMetrics = async () => {
  try {
    // 调用 API 获取监控数据
    // const data = await apiService.getMetrics()
    // metrics.value = data
  } catch (err) {
    console.error('获取监控数据失败:', err)
  }
}
</script>

<style scoped>
.monitoring-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.monitoring-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
}
</style>
```

### 步骤 3: 添加导航菜单

在侧边栏或导航菜单中添加新页面的链接。

---

## 示例：添加数据库表

### 步骤 1: 修改 Prisma Schema

编辑 `packages/database/prisma/schema.prisma`:

```prisma
model ServerMetrics {
  id           String   @id @default(cuid())
  serverId     String
  server       ServerConnection @relation(fields: [serverId], references: [id], onDelete: Cascade)
  cpuUsage     Float
  memoryUsage  Float
  diskUsage    Float
  networkIn    Float
  networkOut   Float
  timestamp    DateTime @default(now())

  @@index([serverId, timestamp])
  @@map("server_metrics")
}
```

### 步骤 2: 创建迁移

```bash
cd packages/database
pnpm prisma migrate dev --name add_server_metrics
```

### 步骤 3: 生成客户端

```bash
pnpm prisma generate
```

---

## 最佳实践

### 1. 代码组织

- **单一职责原则**: 每个 Service/Component 只负责一个功能
- **DRY 原则**: 抽取共用逻辑到 `packages/shared`
- **命名规范**: 
  - 文件名: `kebab-case.ts`
  - 类名: `PascalCase`
  - 函数名: `camelCase`
  - 常量: `UPPER_SNAKE_CASE`

### 2. 类型安全

- 所有公共接口都应定义 TypeScript 类型
- 共享类型放在 `packages/shared/src/types`
- 使用 Zod 进行运行时类型验证

### 3. 错误处理

```typescript
// Service 层
try {
  const result = await someOperation()
  return result
} catch (error: any) {
  logger.error('Operation failed', { error: error.message })
  throw new Error('操作失败，请稍后重试')
}

// Route 层
fastify.post('/endpoint', async (request, reply) => {
  try {
    const result = await service.doSomething()
    return reply.send({ success: true, data: result })
  } catch (error: any) {
    return reply.status(500).send({
      success: false,
      message: error.message || '服务器错误'
    })
  }
})
```

### 4. API 设计

- 遵循 RESTful 规范
- 使用合适的 HTTP 状态码
- 统一的响应格式:

```typescript
{
  success: boolean
  message?: string
  data?: any
  error?: {
    code: string
    details?: any
  }
}
```

### 5. 安全性

- 所有敏感操作需要身份验证
- 使用 `fastify.authenticate` 中间件
- 验证用户权限
- 对用户输入进行验证和清理
- 使用参数化查询防止 SQL 注入

### 6. 性能优化

- 使用数据库索引
- 实现分页查询
- 使用 Redis 缓存热数据
- 避免 N+1 查询问题

### 7. 测试

```typescript
// Service 单元测试示例
describe('ServerTagService', () => {
  let service: ServerTagService
  let prisma: PrismaClient

  beforeEach(() => {
    prisma = new PrismaClient()
    service = new ServerTagService(prisma)
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  it('should create a tag', async () => {
    const tag = await service.createTag('user-id', {
      name: 'Production',
      color: '#FF0000'
    })

    expect(tag.name).toBe('Production')
    expect(tag.color).toBe('#FF0000')
  })
})
```

---

## 常见问题

### Q1: Prisma 客户端类型不匹配

**问题**: 修改 schema 后，TypeScript 报类型错误。

**解决**: 
```bash
cd packages/database
pnpm prisma generate
```

### Q2: 数据库迁移失败

**问题**: 运行 `prisma migrate dev` 失败。

**解决**:
1. 检查数据库连接字符串
2. 确保数据库服务正在运行
3. 检查 schema 语法是否正确
4. 如果是开发环境，可以重置数据库: `pnpm prisma migrate reset`

### Q3: Electron IPC 调用失败

**问题**: 前端调用 IPC 方法时报错。

**解决**:
1. 确保在 `preload/index.ts` 中正确暴露了方法
2. 检查 `ipc/` 目录下的处理器是否正确注册
3. 在 `electron/main/index.ts` 中导入 IPC 处理器

### Q4: API 请求被 CSP 阻止

**问题**: 浏览器控制台显示 CSP 错误。

**解决**:
编辑 `apps/desktop/index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; connect-src 'self' http://localhost:3000 http://127.0.0.1:3000;">
```

### Q5: 环境变量不生效

**问题**: `.env` 文件中的配置没有生效。

**解决**:
1. 确保 `.env` 文件在项目根目录
2. 重启开发服务器
3. 使用启动脚本 `start-dev.ps1` 确保环境变量正确设置

### Q6: pnpm 依赖安装失败

**问题**: 运行 `pnpm install` 报错。

**解决**:
```bash
# 清除缓存
pnpm store prune

# 重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Q7: Docker 容器无法启动

**问题**: 运行 `docker-compose up` 后容器启动失败。

**解决**:
```bash
# 1. 检查端口是否被占用
docker ps -a
netstat -ano | findstr "5432"  # PostgreSQL
netstat -ano | findstr "6379"  # Redis
netstat -ano | findstr "3000"  # 后端 API
netstat -ano | findstr "5173"  # Web 前端
netstat -ano | findstr "80"    # Nginx

# 2. 清理旧容器和数据卷
docker-compose down -v
docker system prune -a

# 3. 重新构建并启动
docker-compose build --no-cache
docker-compose up -d

# 4. 查看详细日志
docker-compose logs api
docker-compose logs postgres
docker-compose logs redis
```

### Q8: Docker 容器内无法连接数据库

**问题**: 后端服务无法连接到 PostgreSQL 容器。

**解决**:
1. 检查 `docker-compose.yml` 中的网络配置和 healthcheck
2. 确保 `DATABASE_URL` 使用容器服务名（如 `postgres`）而不是 `localhost`
3. Docker Compose 会自动等待数据库健康检查通过，如果还有问题可以手动控制启动顺序：
```bash
docker-compose up -d postgres redis
sleep 15
docker-compose up -d api

# 查看数据库是否就绪
docker-compose exec postgres pg_isready -U ai_ssh_user

# 测试容器间网络连接
docker-compose exec api ping postgres
docker-compose exec api nc -zv postgres 5432
```

### Q9: Docker 数据持久化问题

**问题**: 重启 Docker 后数据丢失。

**解决**:
确保 `docker-compose.yml` 中配置了数据卷：
```yaml
volumes:
  postgres_data:
  redis_data:

services:
  postgres:
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

如需备份数据：
```bash
# 备份 PostgreSQL
docker-compose exec postgres pg_dump -U ai_ssh_user ai_ssh_assistant > backup.sql

# 恢复
docker-compose exec -T postgres psql -U ai_ssh_user ai_ssh_assistant < backup.sql
```

### Q10: 环境变量未生效

**问题**: `.env` 文件中的环境变量在运行时未生效。

**解决**:

使用启动脚本（推荐）：
```bash
# Linux/macOS
./scripts/dev.sh

# Windows
.\scripts\start-dev.ps1
```

手动加载环境变量：
```bash
# Linux/macOS
export $(grep -v '^#' .env | xargs)

# 或使用 source
set -a
source .env
set +a

# Windows PowerShell
Get-Content .env | ForEach-Object {
    if ($_ -notmatch '^#' -and $_ -match '=') {
        $name, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

# 或使用 dotenv-cli (跨平台)
npm install -g dotenv-cli
dotenv -e .env -- pnpm dev
```

验证环境变量是否加载：
```bash
# Linux/macOS
echo $DATABASE_URL

# Windows PowerShell
echo $env:DATABASE_URL

# Node.js 中验证
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

### Q11: Electron 安装失败

**问题**: 运行桌面应用时报错 `Electron failed to install correctly, please delete node_modules/electron and try installing again`

**原因**: 
- Electron 二进制文件下载失败或不完整
- 网络问题导致安装中断
- 国内网络访问 GitHub Releases 受限

**解决方案 1 - 重新安装 Electron**:
```bash
# 删除并重新安装 Electron
pnpm remove electron -w
pnpm add electron@27.3.11 -w

# 如果还是失败，使用 --force 强制重装
pnpm add electron@27.3.11 -w --force
```

**解决方案 2 - 使用国内镜像（推荐国内用户）**:
```bash
# 设置 Electron 镜像源（临时）
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_CUSTOM_DIR="{{ version }}"
pnpm add electron@27.3.11 -w --force

# 或者配置到 .npmrc（永久生效）
echo "electron_mirror=https://npmmirror.com/mirrors/electron/" >> .npmrc
echo "electron_custom_dir={{ version }}" >> .npmrc
pnpm install
```

**解决方案 3 - 清理缓存后重装**:
```bash
# 清理所有缓存
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml

# 设置镜像源
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# 重新安装
pnpm install
```

**解决方案 4 - 手动下载 Electron**:
```bash
# 1. 查看需要的版本
cat package.json | grep electron

# 2. 手动从镜像站下载对应版本
# Windows: https://npmmirror.com/mirrors/electron/27.3.11/electron-v27.3.11-win32-x64.zip
# macOS: https://npmmirror.com/mirrors/electron/27.3.11/electron-v27.3.11-darwin-x64.zip
# Linux: https://npmmirror.com/mirrors/electron/27.3.11/electron-v27.3.11-linux-x64.zip

# 3. 解压到 node_modules/electron/dist/
```

**验证安装**:
```bash
# 验证 Electron 是否可用
node -e "console.log(require('electron'))"

# 查看 Electron 版本
npx electron --version
```

**注意**: 启动脚本 `dev.sh` 已经包含了 Electron 自动修复逻辑，会自动尝试解决这个问题。

---

## 调试技巧

### 1. 后端调试

在 VS Code 中创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/packages/server/src/index.ts",
      "preLaunchTask": "npm: dev",
      "outFiles": ["${workspaceFolder}/packages/server/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development",
        "DATABASE_URL": "postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant"
      }
    }
  ]
}
```

### 2. 前端调试

使用 Vue DevTools 和 Chrome DevTools。

### 3. 数据库调试

```bash
# 打开 Prisma Studio
cd packages/database
pnpm prisma studio
```

### 4. 日志

在代码中添加详细日志：

```typescript
import logger from '../utils/logger'

logger.info('Operation started', { userId, operation: 'createTag' })
logger.error('Operation failed', { error: error.message, stack: error.stack })
```

### 5. Docker 调试

使用 Docker 进行调试：

```bash
# 实时查看容器日志
docker-compose logs -f api

# 查看最近 100 行日志
docker-compose logs --tail=100 api

# 查看所有服务的日志
docker-compose logs -f

# 进入容器内部
docker-compose exec api sh

# 查看容器资源使用情况
docker stats

# 查看容器详细信息
docker inspect ai-ssh-api

# 查看网络连接
docker network inspect ai-ssh-assistant_ai-ssh-network

# 测试容器间连接
docker-compose exec api ping postgres
docker-compose exec api nc -zv postgres 5432
docker-compose exec api nc -zv redis 6379

# 查看容器内的进程
docker-compose exec api ps aux

# 查看容器的磁盘使用
docker-compose exec api df -h
```

在容器内运行命令：

```bash
# 在容器内运行 Node.js 脚本
docker-compose exec api node scripts/test.js

# 在容器内运行 Prisma 命令
docker-compose exec api pnpm prisma studio

# 检查环境变量
docker-compose exec api env | grep DATABASE
docker-compose exec api env | grep REDIS

# 在容器内运行数据库查询
docker-compose exec postgres psql -U ai_ssh_user -d ai_ssh_assistant -c "SELECT * FROM users LIMIT 5;"

# 在容器内测试 Redis
docker-compose exec redis redis-cli PING
docker-compose exec redis redis-cli INFO
```

---

## 资源链接

### 核心技术栈
- [Fastify 文档](https://www.fastify.io/)
- [Prisma 文档](https://www.prisma.io/docs)
- [Vue 3 文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Electron 文档](https://www.electronjs.org/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)

### 容器化 & 部署
- [Docker 文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)

### 数据库 & 缓存
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Redis 文档](https://redis.io/docs/)

---

## 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/your-feature`
3. 提交更改: `git commit -m 'Add some feature'`
4. 推送到分支: `git push origin feature/your-feature`
5. 提交 Pull Request

---

## 许可证

MIT License
