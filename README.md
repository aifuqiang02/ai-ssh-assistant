# AI SSH Assistant

一个基于 AI 的 SSH 远程服务器管理助手，支持自然语言交互和智能命令生成。

## 项目架构

```
ai-ssh-assistant/
├── apps/
│   ├── desktop/          # Electron 桌面应用
│   └── web/              # Web 前端应用
├── packages/
│   ├── server/           # Node.js 后端服务
│   ├── shared/           # 前后端共享代码
│   └── database/         # 数据库相关
├── docs/                 # 项目文档
├── scripts/              # 构建脚本
└── docker/               # Docker 配置
```

## 技术栈

### 前端
- **框架**: Vue 3 + Composition API
- **语言**: TypeScript
- **桌面**: Electron
- **UI**: Tailwind CSS + Bootstrap 5
- **状态管理**: Pinia
- **路由**: Vue Router
- **终端**: xterm.js

### 后端
- **运行时**: Node.js 20+
- **框架**: Fastify
- **语言**: TypeScript
- **数据库**: SQLite (开发) / PostgreSQL (生产) + Redis
- **ORM**: Prisma
- **认证**: JWT
- **SSH**: ssh2
- **AI**: OpenAI API + Anthropic API

## 快速开始

### 环境要求
- Node.js 20+
- SQLite 3+ (开发环境) / PostgreSQL 14+ (生产环境)
- Redis 6+
- pnpm 8+
- Docker & Docker Compose (可选，用于生产部署)

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

#### 数据库配置
- **开发环境**: 使用 SQLite 数据库 (`file:./packages/database/dev.db`)
- **生产环境**: 推荐使用 PostgreSQL

#### 主要配置项
```bash
# 数据库
DATABASE_URL="file:./packages/database/dev.db"  # SQLite (开发)
# DATABASE_URL="postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant"  # PostgreSQL (生产)

# 服务器
PORT=3000
HOST=0.0.0.0

# JWT 安全
JWT_SECRET="your-jwt-secret-32-chars-minimum"
ENCRYPTION_KEY="your-32-char-encryption-key-here"
SESSION_SECRET="your-session-secret-32-chars-min"

# AI 服务
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### 数据库初始化
```bash
# 生成 Prisma 客户端
cd packages/database
pnpm prisma generate

# 创建数据库并运行迁移
pnpm prisma migrate dev --name init

# 插入种子数据
pnpm prisma db seed
```

### 启动开发环境
```bash
# 同时启动后端服务和桌面应用
pnpm dev

# 或者分别启动
pnpm dev:server    # 启动后端服务
pnpm dev:desktop   # 启动桌面应用
pnpm dev:web       # 启动 Web 应用
```

### 构建生产版本
```bash
# 构建所有应用
pnpm build

# 构建桌面应用
pnpm build:desktop

# 构建 Web 应用
pnpm build:web

# 构建后端服务
pnpm build:server
```

### Docker 部署（生产环境）

#### 云数据库配置
Docker Compose 包含完整的生产环境配置：

- **PostgreSQL 数据库**:
  - 数据库名: `ai_ssh_assistant`
  - 用户名: `ai_ssh_user`
  - 密码: `ai_ssh_password`
  - 端口: `5432`

- **Redis 缓存**:
  - 端口: `6379`
  - 持久化存储启用

- **监控系统**:
  - Grafana: http://localhost:3001 (admin/admin123)
  - Prometheus: http://localhost:9090

#### 启动生产环境
```bash
# 启动完整的生产环境
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 服务端口
- **API 服务**: http://localhost:3000
- **Web 前端**: http://localhost:5173
- **Grafana 监控**: http://localhost:3001
- **Prometheus**: http://localhost:9090
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 测试账户

数据库种子数据包含以下测试账户：

### 管理员账户
- **邮箱**: `admin@ai-ssh-assistant.com`
- **密码**: `admin123`
- **角色**: ADMIN

### 普通用户账户
- **邮箱**: `user@ai-ssh-assistant.com`
- **密码**: `user123`
- **角色**: USER

### 当前注册用户
- **邮箱**: `635104032@qq.com`
- **用户名**: `aifuqiang`
- **角色**: USER

> 注意：以上账户仅用于开发和测试，生产环境请创建新的安全账户。

## 功能特性

- 🤖 **AI 对话**: 自然语言交互，智能理解用户意图
- 🔗 **SSH 管理**: 安全的远程服务器连接管理
- 💻 **终端模拟**: 实时命令执行和结果展示
- 📊 **使用统计**: 详细的使用数据和性能分析
- 🎨 **现代 UI**: 直观友好的用户界面
- 🔒 **安全审计**: 命令安全检查和执行日志
- 📱 **跨平台**: 支持 Windows、macOS、Linux
- 👥 **用户管理**: 用户注册、登录、角色管理
- 🗄️ **数据存储**: 本地 SQLite 数据库，支持数据持久化

## 开发指南

详细的开发文档请参考 [docs/](./docs/) 目录。

## 许可证

MIT License
