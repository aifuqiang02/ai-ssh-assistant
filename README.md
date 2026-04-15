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
- 🔒 **安全可靠** - SSH 凭据与配置信息保存在本地，降低云端泄露风险
- 🎨 **现代化 UI** - 仿 VS Code 的美观界面，支持亮色/暗色主题
- 💾 **本地存储** - SSH 连接、密钥和相关配置仅保存在本地设备
- 🌐 **多 AI 平台** - 支持 OpenAI、Anthropic、Google Gemini、Ollama、通义千问等
- 📱 **跨平台** - 完整支持 Windows、macOS 和 Linux 系统

## 📸 应用演示

<div align="center">
  <img src="docs/images/soft.png" alt="AI SSH Assistant 应用界面展示" width="100%">
  <p><em>AI SSH Assistant 最新界面展示</em></p>
</div>

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

### 登录后开始使用

1. 启动应用后，先登录账号
2. 在左侧边栏创建 SSH 连接
3. 在设置中配置您的 AI 服务提供商
4. 开始与您的服务器对话

> 当前版本只有本地存储一种方式。登录是使用软件的必要步骤，但 SSH 连接、私钥和相关配置仍以本地保存为主，不默认做云端同步。

### 订阅说明

- 项目代码开源，桌面软件为持续运营的付费产品
- 基础功能套餐：`2 元 / 月`
- AI 套餐：`3 元 / 月`

这不是为了把简单功能层层收费，而是为了让一个长期维护的独立项目，能够持续投入时间去修问题、做优化、补细节、提升稳定性。

### 为什么值得支持

- 您支付的不只是一个安装包，而是在支持一个持续打磨体验的工具
- 低门槛订阅可以帮助项目长期更新，而不是发布后停在原地
- 对独立开发者来说，稳定而克制的收入，才能换来更长期、更认真、更负责的维护

如果这个工具确实帮您省下了时间、减少了重复操作，愿意订阅支持，就是在帮助一个认真做产品的人把这件事继续做好。

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
<summary>数据存储在哪里？</summary>

- SSH 连接、私钥和相关配置默认保存在本地设备
- 当前版本不提供配置自动云端同步，优先保证数据可控与本地安全

</details>

<details>
<summary>为什么软件需要登录和付费？</summary>

- 项目代码开源，但桌面软件以持续运营的产品方式维护
- 登录用于识别订阅状态并保障服务可持续，不等于把敏感配置全部上传云端
- 订阅价格保持在较低水平，希望让更多用户愿意长期支持独立开发

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
