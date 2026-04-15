<div align="center">
  <h1>AI SSH Assistant</h1>
  <p>
    <strong>基于 AI 的智能 SSH 远程服务器管理助手</strong>
  </p>
  <p>通过自然语言对话，轻松管理您的远程服务器</p>
  
  <p>
    <a href="https://github.com/aifuqiang02/ai-ssh-assistant/releases/latest">
      <img src="https://img.shields.io/github/v/release/aifuqiang02/ai-ssh-assistant?style=flat-square" alt="Latest Release">
    </a>
    <a href="https://github.com/aifuqiang02/ai-ssh-assistant/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/aifuqiang02/ai-ssh-assistant?style=flat-square" alt="License">
    </a>
    <a href="https://github.com/aifuqiang02/ai-ssh-assistant/stargazers">
      <img src="https://img.shields.io/github/stars/aifuqiang02/ai-ssh-assistant?style=flat-square" alt="Stars">
    </a>
    <img src="https://img.shields.io/badge/Node.js-20+-green?style=flat-square" alt="Node Version">
    <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square" alt="Platform">
    <a href="https://github.com/aifuqiang02/ai-ssh-assistant/actions">
      <img src="https://img.shields.io/github/actions/workflow/status/aifuqiang02/ai-ssh-assistant/build.yml?branch=main&style=flat-square&label=Build" alt="Build Status">
    </a>
  </p>
</div>

---

## ✨ 特性亮点

- 🤖 **AI 智能对话** - 使用自然语言与服务器交互，AI 自动生成并执行命令
- 🔗 **SSH 连接管理** - 安全管理多个远程服务器连接，支持密码和私钥认证
- 💻 **实时终端** - 基于 xterm.js 的完整终端模拟器，支持所有 SSH 功能
- 📁 **文件管理** - 可视化的远程文件浏览和 SFTP 文件传输
- 🔒 **安全可靠** - 命令安全审计、风险等级评估、执行日志记录
- 🎨 **现代化 UI** - 仿 VS Code 的美观界面，支持亮色/暗色主题
- 📊 **数据统计** - 详细的使用数据、性能分析和 Token 统计
- 💾 **双存储模式** - 支持本地存储（无需登录）和云端存储（多设备同步）
- 🌐 **多 AI 平台** - 支持 OpenAI、Anthropic、Google Gemini、Ollama、通义千问等
- 📱 **跨平台** - 完整支持 Windows、macOS 和 Linux 系统

## 📸 应用演示

<div align="center">
  <img src="docs/demo.gif" alt="AI SSH Assistant 功能演示" width="100%">
  <p><em>AI SSH Assistant 功能演示</em></p>
</div>

<details>
<summary>查看更多截图和视频</summary>

### 静态截图

<div align="center">
  <img src="docs/demo.png" alt="AI SSH Assistant 界面展示" width="100%">
  <p><em>应用主界面</em></p>
</div>

### 完整演示视频

> 💡 如需观看完整高清演示，请[下载视频](docs/demo.mp4)

</details>

## 🚀 快速开始

### 📦 下载安装包（推荐）

访问
**[Releases 页面](https://github.com/aifuqiang02/ai-ssh-assistant/releases/latest)**
下载最新版本：

#### Windows

- 下载 `AI-SSH-Assistant-x.x.x-setup-x64.exe`
- 双击运行安装程序
- 支持 Windows 10/11 (64-bit)

#### macOS

- **Intel 芯片**: 下载 `ai-ssh-assistant-x.x.x-macos-x64.dmg`
- **Apple Silicon**: 下载 `ai-ssh-assistant-x.x.x-macos-arm64.dmg`
- 首次运行需在"系统偏好设置 → 安全性与隐私"中允许

#### Linux

- **AppImage (推荐)**:
  ```bash
  chmod +x ai-ssh-assistant-x.x.x-linux-x64.AppImage
  ./ai-ssh-assistant-x.x.x-linux-x64.AppImage
  ```
- **Debian/Ubuntu**:
  ```bash
  sudo dpkg -i ai-ssh-assistant-x.x.x-linux-x64.deb
  ```

### 🛠️ 从源码运行

#### 环境要求

- Node.js 20+
- pnpm 8+
- SQLite 3+ (开发环境)
- PostgreSQL 14+ / Redis 6+ (生产环境可选)

#### 安装依赖

```bash
pnpm install
```

#### 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入必要的配置（可选）
# 如果只使用桌面应用的本地模式，可以跳过此步骤
```

<details>
<summary>查看环境变量配置详情（可选，用于云端模式或开发）</summary>

```bash
# 数据库配置
DATABASE_URL="file:./packages/database/dev.db"  # SQLite (开发)

# 服务器配置
PORT=3000
HOST=0.0.0.0

# JWT 安全密钥（生产环境请修改）
JWT_SECRET="your-jwt-secret-32-chars-minimum"
ENCRYPTION_KEY="your-32-char-encryption-key-here"
SESSION_SECRET="your-session-secret-32-chars-min"

# AI 服务配置（可在应用内配置）
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

</details>

#### 数据库初始化（仅开发环境需要）

```bash
# 生成 Prisma 客户端
cd packages/database
pnpm prisma generate

# 创建数据库并运行迁移
pnpm prisma migrate dev --name init

# 插入种子数据
pnpm prisma db seed
```

#### 启动开发环境

```bash
# 启动桌面应用（推荐，包含完整功能）
pnpm dev:desktop

# 或同时启动所有服务
pnpm dev

# 或分别启动
pnpm dev:server    # 启动后端服务（云端模式需要）
pnpm dev:web       # 启动 Web 应用
```

#### 构建生产版本

##### 🚀 云端自动构建（推荐）

项目已配置完整的 GitHub Actions 云端构建流程，支持全平台自动打包：

```bash
# 方法 1: 标签发版（推荐）
git tag v1.0.4
git push origin v1.0.4  # 自动构建并发布到 GitHub Releases

# 方法 2: 手动触发
# 访问 GitHub Actions 页面，选择"🚀 Release"工作流手动触发
```

**云端构建优势:**

- ✅ 自动构建 Windows/macOS/Linux 全平台安装包
- ✅ 自动创建 GitHub Release 并上传构建产物
- ✅ 无需本地配置复杂的构建环境
- ✅ 支持 macOS 的 Intel + Apple Silicon 双架构
- ✅ 完整的构建日志和错误信息

> 💡 详细使用说明请参考：[GitHub Actions 云端构建指南](./docs/github-actions-build.md)

##### 🛠️ 本地构建

```bash
# 构建桌面应用安装包
pnpm build:desktop

# 构建所有应用
pnpm build

# 分平台构建
pnpm build:win     # Windows (需要 Windows 环境)
pnpm build:mac     # macOS (需要 macOS 环境)
pnpm build:linux   # Linux (需要 Linux 环境)
```

### 服务端部署

项目内已经沉淀了服务端部署脚本，当前正式环境约定如下：

- 正式机：`101.43.49.100`
- 服务目录：`/www/wwwroot/ai-ssh-assistant/server/`
- 服务端口：`40401`
- PM2 进程名：`ai-ssh-assistant-server`

相关脚本位于：

- `deploy/deploy-server.mjs`：构建并上传服务端 bundle
- `deploy/remote-check.mjs`：检查 PM2、端口和健康状态
- `deploy/remote-logs.mjs`：查看远程 PM2 日志
- `deploy/remote-restart.mjs`：上传最新 `.env.production` 并重启服务
- `deploy/remote-cold-start.mjs`：删除并冷启动 PM2 进程

常用命令：

```bash
# 构建并部署服务端
pnpm exec node deploy/deploy-server.mjs

# 查看正式机服务状态
pnpm exec node deploy/remote-check.mjs

# 查看正式机日志
pnpm exec node deploy/remote-logs.mjs

# 更新生产环境文件并重启
pnpm exec node deploy/remote-restart.mjs
```

说明：

- 生产环境文件来自 `packages/server/.env.production`
- 不要把真实密钥写入仓库根 `.env`
- 如果修改了 Prisma schema 或 generated client，部署前需要先执行：

```bash
pnpm --filter @ai-ssh/database db:generate
```

---

## 📚 使用指南

### 本地模式（无需登录）

1. 启动应用后，默认使用本地存储模式
2. 在左侧边栏创建 SSH 连接
3. 配置您的 AI 服务提供商（设置 → AI 配置）
4. 开始与您的服务器对话！

### 云端模式（多设备同步）

1. 点击右上角登录按钮
2. 注册/登录账户
3. 您的数据将自动同步到云端
4. 可在多个设备间无缝切换

### AI 配置

应用支持多种 AI 平台：

- **OpenAI** - GPT-3.5/GPT-4
- **Anthropic** - Claude 3 系列
- **Google** - Gemini Pro
- **Ollama** - 本地运行的开源模型
- **通义千问** - 阿里云大模型
- **其他** - DeepSeek、月之暗面等

在"设置 → AI 配置"中添加 API Key 即可使用。

---

## 🏗️ 项目架构

<details>
<summary>查看详细架构</summary>

```
ai-ssh-assistant/
├── apps/
│   ├── desktop/          # Electron 桌面应用
│   └── web/              # Web 前端应用（未来支持）
├── packages/
│   ├── server/           # Node.js 后端服务
│   ├── shared/           # 前后端共享代码
│   └── database/         # 数据库相关 (Prisma)
├── docs/                 # 项目文档
├── scripts/              # 构建和发布脚本
└── docker/               # Docker 部署配置
```

### 技术栈

**前端**

- Vue 3 + TypeScript + Composition API
- Electron (桌面应用)
- Tailwind CSS + Bootstrap 5
- xterm.js (终端模拟器)
- Vue Router

**后端**

- Node.js 20+ + TypeScript
- Fastify (Web 框架)
- Prisma (ORM)
- SQLite / PostgreSQL + Redis
- JWT 认证
- ssh2 (SSH 连接)

</details>

---

## 🐳 Docker 部署（可选）

<details>
<summary>查看 Docker 部署说明</summary>

### 启动生产环境

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

### 服务端口

- **API 服务**: http://localhost:3000
- **Web 前端**: http://localhost:5173
- **Grafana 监控**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

</details>

---

## 🧪 测试账户（开发环境）

<details>
<summary>查看测试账户</summary>

开发环境包含以下测试账户：

- **管理员**: `admin@ai-ssh-assistant.com` / `admin123`
- **普通用户**: `user@ai-ssh-assistant.com` / `user123`

> ⚠️ 注意：这些账户仅用于开发和测试，生产环境请创建新的安全账户。

</details>

---

## 👨‍💻 开发指南

详细的开发文档请参考 [docs/](./docs/) 目录。

<details>
<summary>查看开发相关文档</summary>

### 核心文档

- [快速上手](./docs/development/getting-started.md)
- [服务架构](./docs/development/service-architecture.md)
- [数据库设计](./docs/development/database-schema.md)
- [最佳实践](./docs/development/best-practices.md)
- [国际化参考](./docs/development/I18N_QUICK_REFERENCE.md)

### 功能文档

- [终端自动补全](./docs/autocomplete/README.md) - 完整的自动补全系统文档
- [AI 智能建议](./docs/autocomplete/AI_SUGGESTION_GUIDE.md) - AI 功能使用指南
- [文档编辑器](./docs/document-editor-guide.md)
- [主题系统](./docs/theme-system.md)

### 发布文档

- [版本发布](./docs/releases/README.md) - 所有版本的发布说明
- [发布指南](./docs/RELEASE_GUIDE.md) - 完整的发布流程
- [更新日志](./CHANGELOG.md) - 详细的变更记录

### 调试指南

- [调试指南](./docs/debug/debug-guide.md)
- [自动补全调试](./docs/autocomplete/AUTOCOMPLETE_DEBUG_GUIDE.md)

</details>

---

## 🤝 贡献

欢迎贡献代码、报告 Bug 或提出新功能建议！

### 如何贡献

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 报告问题

如果您发现了 Bug 或有功能建议，请在
[Issues](https://github.com/aifuqiang02/ai-ssh-assistant/issues) 页面提交。

---

## 💬 加入社区

欢迎加入 QQ 交流群，与其他用户交流使用经验、分享技巧、反馈问题！

<div align="center">
  <img src="docs/qq.jpg" alt="AI SSH 交流群" width="300">
  <p>
    <strong>AI SSH 交流群</strong><br>
    QQ 群号：<code>307460844</code><br>
    <a href="https://qm.qq.com/q/etLhGujyzm">点击加入群聊</a>
  </p>
</div>

---

## ❓ 常见问题

<details>
<summary>如何配置 AI 服务？</summary>

在应用中点击"设置 → AI 配置"，添加您的 API
Key。支持多个 AI 平台，推荐使用 Anthropic Claude 或 OpenAI GPT-4。

</details>

<details>
<summary>本地模式和云端模式有什么区别？</summary>

- **本地模式**: 数据存储在本地，无需登录，适合个人使用
- **云端模式**: 数据同步到云端，需要登录，支持多设备同步

</details>

<details>
<summary>支持哪些操作系统？</summary>

完整支持 Windows 10/11、macOS (Intel + Apple Silicon) 和 Linux
(Ubuntu/Debian/AppImage)。

</details>

<details>
<summary>数据安全吗？</summary>

- SSH 密码和私钥使用加密存储
- 所有数据传输使用 HTTPS/WSS
- 支持本地存储模式，数据完全在本地
- 开源代码，可审计

</details>

---

## 📋 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

最新版本的详细说明请访问
[Releases 页面](https://github.com/aifuqiang02/ai-ssh-assistant/releases)。

---

## 🙏 致谢

感谢以下开源项目：

- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [xterm.js](https://xtermjs.org/) - 终端模拟器
- [ssh2](https://github.com/mscdex/ssh2) - SSH2 客户端
- [Prisma](https://www.prisma.io/) - 现代化 ORM
- [Fastify](https://www.fastify.io/) - 快速 Web 框架

---

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 开源协议。

---

<div align="center">
  <p>如果这个项目对您有帮助，请给个 ⭐️ Star 支持一下！</p>
  <p>Made with ❤️ by <a href="https://github.com/aifuqiang02">aifuqiang</a></p>
</div>
