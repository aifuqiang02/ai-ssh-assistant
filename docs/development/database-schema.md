# 🗄️ 数据库表结构说明

本文档详细说明了 AI SSH Assistant 的数据库架构设计。

## 📊 概述

项目使用 **Prisma ORM** 作为数据库访问层，支持：
- **PostgreSQL** - 生产环境（完整功能）
- **SQLite** - 开发环境（本地存储）

## 📁 数据库文件位置

```
packages/database/
├── prisma/
│   ├── schema.prisma              # 主 schema（PostgreSQL）
│   ├── schema-postgresql.prisma   # PostgreSQL schema
│   ├── schema-sqlite.prisma       # SQLite schema
│   └── migrations/                # 数据库迁移文件
└── src/
    └── generated/                 # 生成的 Prisma Client
```

---

## 📋 表结构详解

### 1. 👤 用户表 (users)

存储用户账户信息和认证数据。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | String | 用户唯一标识 | 主键, CUID |
| `uuid` | String | UUID（兼容 lobe-chat） | 唯一, CUID |
| `email` | String? | 电子邮箱 | 唯一, 可选 |
| `username` | String? | 用户名 | 唯一, 可选 |
| `password` | String? | 密码哈希 | 可选（支持第三方登录） |
| `avatar` | String? | 头像 URL | 可选 |
| `role` | UserRole | 用户角色 | 枚举, 默认 USER |
| `isActive` | Boolean | 是否激活 | 默认 true |
| `settings` | JSON? | 用户设置 | JSON 格式 |
| `createdAt` | DateTime | 创建时间 | 自动生成 |
| `updatedAt` | DateTime | 更新时间 | 自动更新 |

**关联关系：**
- 一对多：`sshFolders`, `sshConnections`, `chatSessions`, `messages`, `commandLogs`

**用户角色枚举 (UserRole)：**
- `USER` - 普通用户
- `ADMIN` - 管理员
- `PREMIUM` - 高级用户

---

### 2. 📂 SSH 文件夹表 (ssh_folders)

用于组织和管理 SSH 连接的树形结构。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | String | 文件夹 ID | 主键, CUID |
| `name` | String | 文件夹名称 | 必填 |
| `order` | Int | 排序顺序 | 默认 0 |
| `isActive` | Boolean | 是否激活 | 默认 true |
| `parentId` | String? | 父文件夹 ID | 外键, 可选 |
| `userId` | String | 所属用户 ID | 外键, 必填 |
| `createdAt` | DateTime | 创建时间 | 自动生成 |
| `updatedAt` | DateTime | 更新时间 | 自动更新 |

**关联关系：**
- 多对一：`user` (User)
- 自引用（树形结构）：`parent` (SSHFolder), `children` (SSHFolder[])
- 一对多：`connections` (SSHConnection[])

**树形结构特性：**
- 支持无限层级嵌套
- 级联删除：删除父文件夹时，子文件夹也会被删除

---

### 3. 🔐 SSH 连接配置表 (ssh_connections)

存储 SSH 服务器连接配置和认证信息。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | String | 连接 ID | 主键, CUID |
| `name` | String | 连接名称 | 必填 |
| `host` | String | 主机地址 | 必填 |
| `port` | Int | SSH 端口 | 默认 22 |
| `username` | String | 用户名 | 必填 |
| `order` | Int | 排序顺序 | 默认 0 |
| `authType` | SSHAuthType | 认证类型 | 枚举, 必填 |
| `password` | String? | 密码（加密） | 可选 |
| `privateKey` | String? | 私钥路径或内容 | 可选 |
| `publicKey` | String? | 公钥内容 | 可选 |
| `passphrase` | String? | 私钥密码（加密） | 可选 |
| `status` | ConnectionStatus | 连接状态 | 枚举, 默认 DISCONNECTED |
| `lastUsed` | DateTime? | 最后使用时间 | 可选 |
| `isActive` | Boolean | 是否激活 | 默认 true |
| `meta` | JSON? | 元数据信息 | JSON 格式 |
| `folderId` | String? | 所属文件夹 ID | 外键, 可选 |
| `userId` | String | 所属用户 ID | 外键, 必填 |
| `createdAt` | DateTime | 创建时间 | 自动生成 |
| `updatedAt` | DateTime | 更新时间 | 自动更新 |

**关联关系：**
- 多对一：`user` (User), `folder` (SSHFolder)
- 一对多：`chatSessions` (ChatSession[]), `commandLogs` (CommandLog[])

**认证类型枚举 (SSHAuthType)：**
- `PASSWORD` - 密码认证
- `PRIVATE_KEY` - 私钥认证
- `SSH_AGENT` - SSH Agent 认证

**连接状态枚举 (ConnectionStatus)：**
- `CONNECTED` - 已连接
- `DISCONNECTED` - 已断开
- `CONNECTING` - 连接中
- `ERROR` - 错误状态

---

### 4. 💬 聊天会话表 (chat_sessions)

存储 AI 聊天会话信息。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | String | 会话 ID | 主键, CUID |
| `title` | String | 会话标题 | 必填 |
| `type` | SessionType | 会话类型 | 枚举, 默认 CHAT |
| `config` | JSON? | AI 配置 | JSON 格式 |
| `meta` | JSON? | 会话元数据 | JSON 格式 |
| `userId` | String | 所属用户 ID | 外键, 必填 |
| `sshConnectionId` | String? | 关联 SSH 连接 | 外键, 可选 |
| `createdAt` | DateTime | 创建时间 | 自动生成 |
| `updatedAt` | DateTime | 更新时间 | 自动更新 |

**关联关系：**
- 多对一：`user` (User), `sshConnection` (SSHConnection)
- 一对多：`messages` (Message[])

**会话类型枚举 (SessionType)：**
- `CHAT` - 普通聊天
- `SSH` - SSH 操作会话
- `MIXED` - 混合模式

**config 字段示例：**
```json
{
  "model": "gpt-4",
  "temperature": 0.7,
  "systemRole": "你是一个 SSH 操作助手..."
}
```

---

### 5. 📝 消息表 (messages)

存储聊天会话中的消息记录。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | String | 消息 ID | 主键, CUID |
| `content` | String | 消息内容 | 必填 |
| `role` | MessageRole | 消息角色 | 枚举, 必填 |
| `meta` | JSON? | 消息元数据 | JSON 格式 |
| `extra` | JSON? | 额外信息 | JSON 格式 |
| `isDeleted` | Boolean | 是否删除 | 默认 false |
| `isEdited` | Boolean | 是否编辑 | 默认 false |
| `plugin` | JSON? | 插件信息 | JSON 格式 |
| `pluginState` | JSON? | 插件状态 | JSON 格式 |
| `translate` | JSON? | 翻译信息 | JSON 格式 |
| `tts` | JSON? | 语音合成信息 | JSON 格式 |
| `sessionId` | String | 所属会话 ID | 外键, 必填 |
| `userId` | String | 发送者用户 ID | 外键, 必填 |
| `createdAt` | DateTime | 创建时间 | 自动生成 |
| `updatedAt` | DateTime | 更新时间 | 自动更新 |

**关联关系：**
- 多对一：`session` (ChatSession), `user` (User)

**消息角色枚举 (MessageRole)：**
- `USER` - 用户消息
- `ASSISTANT` - AI 助手消息
- `SYSTEM` - 系统消息
- `FUNCTION` - 函数调用消息
- `TOOL` - 工具调用消息

**extra 字段示例：**
```json
{
  "model": "gpt-4",
  "tokens": 150,
  "finishReason": "stop"
}
```

---

### 6. 📜 命令日志表 (command_logs)

记录 SSH 命令执行历史。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | String | 日志 ID | 主键, CUID |
| `command` | String | 执行的命令 | 必填 |
| `output` | String? | 命令输出 | 可选 |
| `exitCode` | Int? | 退出码 | 可选 |
| `duration` | Int? | 执行时间（毫秒） | 可选 |
| `safetyLevel` | SafetyLevel | 安全级别 | 枚举, 默认 SAFE |
| `metadata` | JSON? | 元数据 | JSON 格式 |
| `userId` | String | 执行用户 ID | 外键, 必填 |
| `sshConnectionId` | String? | SSH 连接 ID | 外键, 可选 |
| `createdAt` | DateTime | 创建时间 | 自动生成 |

**关联关系：**
- 多对一：`user` (User), `sshConnection` (SSHConnection)

**安全级别枚举 (SafetyLevel)：**
- `SAFE` - 安全命令（如 `ls`, `pwd`）
- `CAUTION` - 需要注意的命令（如 `chmod`, `chown`）
- `DANGEROUS` - 危险命令（如 `rm -rf`, `dd`）

---

## 🔗 关系图

```
┌─────────┐
│  User   │──┬───→ sshFolders
└─────────┘  │
             ├───→ sshConnections
             ├───→ chatSessions
             ├───→ messages
             └───→ commandLogs

┌──────────────┐
│  SSHFolder   │──→ connections (SSHConnection[])
└──────────────┘  │
      ↓↑          └──→ parent/children (树形结构)
   自引用

┌────────────────┐
│ SSHConnection  │──→ chatSessions
└────────────────┘  └──→ commandLogs

┌──────────────┐
│ ChatSession  │──→ messages
└──────────────┘
```

---

## 🔒 数据安全

### 加密字段

以下字段在存储前需要加密：
- `ssh_connections.password` - SSH 密码
- `ssh_connections.passphrase` - 私钥密码

### 级联删除规则

| 父表 | 子表 | 删除策略 |
|------|------|---------|
| User | SSHFolder | CASCADE |
| User | SSHConnection | CASCADE |
| User | ChatSession | CASCADE |
| User | Message | CASCADE |
| User | CommandLog | CASCADE |
| SSHFolder | SSHFolder (子文件夹) | CASCADE |
| SSHFolder | SSHConnection | SET NULL |
| SSHConnection | ChatSession | SET NULL |
| SSHConnection | CommandLog | SET NULL |
| ChatSession | Message | CASCADE |

---

## 📈 索引策略

### 唯一索引
- `users.uuid`
- `users.email`
- `users.username`

### 性能优化索引（建议添加）

```sql
-- SSH 连接查询优化
CREATE INDEX idx_ssh_connections_user_id ON ssh_connections(userId);
CREATE INDEX idx_ssh_connections_folder_id ON ssh_connections(folderId);
CREATE INDEX idx_ssh_connections_status ON ssh_connections(status);

-- 聊天会话查询优化
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(userId);
CREATE INDEX idx_chat_sessions_ssh_connection_id ON chat_sessions(sshConnectionId);

-- 消息查询优化
CREATE INDEX idx_messages_session_id ON messages(sessionId);
CREATE INDEX idx_messages_created_at ON messages(createdAt DESC);

-- 命令日志查询优化
CREATE INDEX idx_command_logs_user_id ON command_logs(userId);
CREATE INDEX idx_command_logs_ssh_connection_id ON command_logs(sshConnectionId);
CREATE INDEX idx_command_logs_created_at ON command_logs(createdAt DESC);

-- SSH 文件夹树形结构优化
CREATE INDEX idx_ssh_folders_parent_id ON ssh_folders(parentId);
CREATE INDEX idx_ssh_folders_user_id ON ssh_folders(userId);
```

---

## 🛠️ 迁移管理

### 查看迁移历史

```bash
cd packages/database
npx prisma migrate status
```

### 创建新迁移

```bash
npx prisma migrate dev --name your_migration_name
```

### 应用迁移（生产环境）

```bash
npx prisma migrate deploy
```

### 重置数据库（开发环境）

```bash
npx prisma migrate reset
```

---

## 📊 数据统计字段

### 建议添加的统计字段

```prisma
model User {
  // 统计信息
  connectionCount  Int @default(0) // SSH 连接数
  sessionCount     Int @default(0) // 会话数
  messageCount     Int @default(0) // 消息数
  lastLoginAt      DateTime?       // 最后登录时间
}
```

---

## 🔄 数据迁移版本

| 版本 | 日期 | 说明 |
|------|------|------|
| `init_postgresql` | 2024-09-29 | 初始化 PostgreSQL schema |
| `add_ssh_folders` | 2024-09-30 | 添加 SSH 文件夹表，支持树形结构 |

---

## 📚 相关文档

- [Prisma 官方文档](https://www.prisma.io/docs)
- [数据库存储说明](./database-storage.md)
- [开发入门指南](./getting-started.md)

---

**最后更新：** 2024-10-02

