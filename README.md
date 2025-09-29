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
- **数据库**: PostgreSQL + Redis
- **ORM**: Prisma
- **认证**: JWT
- **SSH**: ssh2
- **AI**: OpenAI API + Anthropic API

## 快速开始

### 环境要求
- Node.js 20+
- PostgreSQL 14+
- Redis 6+
- pnpm 8+

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

### 启动开发环境
```bash
# 启动后端服务
pnpm dev:server

# 启动桌面应用
pnpm dev:desktop

# 启动 Web 应用
pnpm dev:web
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

## 功能特性

- 🤖 **AI 对话**: 自然语言交互，智能理解用户意图
- 🔗 **SSH 管理**: 安全的远程服务器连接管理
- 💻 **终端模拟**: 实时命令执行和结果展示
- 📊 **使用统计**: 详细的使用数据和性能分析
- 🎨 **现代 UI**: 直观友好的用户界面
- 🔒 **安全审计**: 命令安全检查和执行日志
- 📱 **跨平台**: 支持 Windows、macOS、Linux

## 开发指南

详细的开发文档请参考 [docs/](./docs/) 目录。

## 许可证

MIT License
