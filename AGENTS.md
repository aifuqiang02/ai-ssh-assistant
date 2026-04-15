# AGENTS.md

## 版本发布流程

### 1. 统一修改版本号

这是一个 monorepo 项目，根目录和各 workspace 包（如 `apps/desktop`）都有独立的
`version` 字段。发布新版本前需要**统一修改所有包的版本号**：

- 根 `package.json`
- `apps/desktop/package.json`
- 其他 workspace 包（如有独立版本）

确保所有包的版本号一致后再进行下一步。

### 2. GitHub Actions 打包

发布 tag 后，GitHub Actions 会自动触发打包流程：

- 工作流文件：`.github/workflows/release.yml`
- 打包产物：Windows/macOS/Linux 安装包

**注意**：不要在本地执行 `pnpm build`、`electron-builder`
等打包命令，全部由 GitHub Actions 完成。

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

## 部署约定

### 服务端部署

使用项目内置部署脚本一键部署：

```bash
node deploy/deploy-server.mjs
```

部署脚本职责：

- `deploy/deploy.config.mjs` - 服务器配置（host、port、目录）
- `deploy/deploy-server.mjs` - 部署执行（打包 → 上传 → 解压 → PM2 重启）

部署流程自动完成：

1. 本地 `esbuild` 打包 server bundle
2. 打包成 `.tar.gz` 归档
3. 上传到服务器 `/www/wwwroot/ai-ssh-assistant/server/releases/<timestamp>/`
4. 创建软链接到 `current`
5. 重启 PM2 进程

**注意**：不要在本地执行 `pnpm build` 再手动 scp，用部署脚本一键完成。
