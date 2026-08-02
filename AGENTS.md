# AGENTS.md

## 本地启动

### 环境要求

- Node.js 20 或更高版本
- pnpm 8，仓库固定使用 `pnpm@8.12.0`
- 首次运行先在仓库根目录执行 `pnpm install`
- 服务端只读取 `packages/server/.env`；可参考根目录 `.env.example` 准备配置，禁止提交真实密钥

### 同时启动客户端和服务端

在仓库根目录执行：

```bash
pnpm dev
```

该命令会先构建 database workspace，再并行启动服务端和桌面端：

- 服务端默认地址：`http://127.0.0.1:3000`
- 服务端健康检查：`http://127.0.0.1:3000/health`
- 桌面端 Vite 地址：`http://127.0.0.1:5173`
- Electron 主进程由 Vite 开发服务自动启动

也可以分别启动：

```bash
pnpm dev:server
pnpm dev:desktop
```

只启动桌面端前，至少先执行一次：

```bash
pnpm build:database
pnpm dev:desktop
```

### 本地启动排查

- `pnpm dev:server` 会先清理占用的服务端端口，并在 `9229` 开启 Node 调试端口。
- 桌面端没有显示官方模型时，先确认本地 `/health` 和相关 API 正常，不要直接判断为客户端模型配置问题。
- `better-sqlite3` 必须匹配 Electron 的 ABI。当前 Electron 为 `29.4.6`，需要准备原生绑定时执行 `pnpm --filter @ai-ssh/desktop rebuild`。
- 重建原生绑定前先退出所有正在运行的 Electron 客户端，避免 Windows 锁定 `better_sqlite3.node`。
- 原生模块统一由 `apps/desktop/scripts/rebuild-native.js` 通过 `prebuild-install` 下载目标 Electron/平台/架构的绑定，不要改回强制源码编译的 `electron-rebuild` 流程。
- 需要在本地模拟生产客户端时使用 `pnpm --filter @ai-ssh/desktop prod:desktop`；它会构建并直接启动应用，但不会生成安装包。

### 提交前验证

按修改范围运行：

```bash
pnpm --filter @ai-ssh/server test
pnpm --filter @ai-ssh/desktop test
pnpm --filter @ai-ssh/server type-check
pnpm --filter @ai-ssh/desktop type-check
pnpm --filter @ai-ssh/database type-check
pnpm --filter @ai-ssh/shared type-check
```

不要为了验证客户端在本地执行根 `pnpm build`，因为它会进入桌面安装包构建流程。客户端安装包统一交给 GitHub Actions。

## 客户端发布

### 1. 统一修改版本号

这是一个 monorepo 项目，发布新版本前需要**统一修改所有包的版本号**：

- 根 `package.json`
- `apps/desktop/package.json`
- `packages/server/package.json`
- `packages/database/package.json`
- `packages/shared/package.json`

确保所有包的版本号一致后再进行下一步。

同时更新 `CHANGELOG.md` 对应版本内容，Release workflow 会从中提取发布说明。

### 2. 提交并发布 tag

版本修改、测试和类型检查通过后，提交并推送 `main`，再创建并推送与版本一致的 tag：

```bash
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

不要让 tag 指向未包含版本号或发布修复的旧提交。除非用户明确要求，否则不要自动提交、推送或创建 tag。

### 3. GitHub Actions 打包

发布 tag 后，GitHub Actions 会自动触发打包流程：

- 工作流文件：`.github/workflows/release.yml`
- 触发规则：推送 `v*` tag，也支持手动输入版本号触发
- 构建矩阵：Windows x64、macOS x64、macOS arm64、Linux x64
- 客户端生产 API 地址来自 GitHub Actions Variables 中的 `DESKTOP_VITE_API_BASE_URL`
- `TARGET_ARCH` 必须与矩阵架构一致，尤其不能混用 macOS x64 和 arm64 的 SQLite 原生绑定

**注意**：不要在本地执行 `pnpm build`、`electron-builder`
等打包命令，全部由 GitHub Actions 完成。

### 4. 发布验收

发布不能以 Release 页面已创建作为完成标准，必须等待全部矩阵任务成功，并确认 Release 至少包含：

- Windows x64 安装程序
- macOS Intel x64 DMG
- macOS Apple Silicon arm64 DMG
- Linux AppImage
- Linux DEB
- 各平台自动更新 manifest

如果某个平台失败，只修复构建原因并重新发布新的补丁版本；不要覆盖已发布 tag，也不要强推 tag。

## Prisma 约定

项目只保留两份按数据库类型划分的 Prisma schema：

- `packages/database/prisma/schema-postgresql.prisma`：服务端 PostgreSQL 唯一 schema
- `packages/database/prisma/schema-sqlite.prisma`：桌面端本地 SQLite 唯一 schema

禁止再新增或恢复第二份 PostgreSQL schema（例如旧的
`schema.prisma`），避免模型漂移导致“代码里有模型但运行库没建表”。

执行数据库相关命令时，必须显式使用对应 schema：

- PostgreSQL：`pnpm db:generate`、`pnpm db:push`、`pnpm db:migrate`、`pnpm db:migrate:deploy`
- SQLite 客户端生成：由 `pnpm --filter @ai-ssh/database build` 或
  `pnpm db:generate` 统一处理

修改 PostgreSQL 数据模型时，必须同时检查：

- `packages/database/prisma/schema-postgresql.prisma`
- `packages/database/migrations/`

不要只改客户端生成产物目录
`packages/database/src/generated/*`；生成产物不是源文件。

## 服务端发布

### 发布前检查

- 确认 `packages/server/package.json` 与其他 workspace 版本一致。
- 确认 `packages/server/.env.production` 存在且配置正确；该文件只用于部署，不得提交。
- 如果修改 PostgreSQL 模型，先按 Prisma 约定检查 schema 和 migrations。
- 运行服务端测试与类型检查，必要时先验证数据库和 Redis 连接。

### 一键部署

使用项目内置部署脚本一键部署：

```bash
node deploy/deploy-server.mjs
```

部署脚本职责：

- `deploy/deploy.config.mjs` - 服务器配置（host、port、目录）
- `deploy/deploy-server.mjs` - 部署执行（打包 → 上传 → 解压 → PM2 重启）

部署流程自动完成：

1. 本地通过 `esbuild` 打包 server bundle，并注入当前 `APP_VERSION`
2. 打包成 `.tar.gz` 归档
3. 上传到服务器 `/www/wwwroot/ai-ssh-assistant/server/releases/<timestamp>/`
4. 上传生产环境变量到共享目录，并连接共享日志和上传目录
5. 将 `current` 软链接切换到新版本
6. 重启并保存 PM2 进程 `ai-ssh-assistant-server`

**注意**：不要在本地执行 `pnpm build` 再手动 scp，用部署脚本一键完成。

### 部署后验收

部署脚本成功不代表发布验收完成。至少检查：

```text
https://api.tx07.cn/ai-ssh/health
```

验收要求：

- HTTP 状态为 `200`
- 返回版本号与本次发布版本一致
- 数据库状态为 `healthy`
- Redis 状态为 `healthy`
- PM2 进程 `ai-ssh-assistant-server` 为 `online`
- 登录接口可正常调用
- `/api/v1/ai/official/status` 能返回当前内置模型

部署配置和生产 `.env` 含服务器信息或密钥，必须保持 Git 忽略；不得把密码、Token、API Key 写入 `AGENTS.md`、提交记录或日志摘要。
