# 开发环境启动脚本

本目录包含用于快速启动 AI SSH Assistant 开发环境的脚本。

## 📋 前置要求

- **Linux/macOS**: Node.js >= 20, pnpm >= 8, Docker, Docker Compose
- **Windows**: Node.js >= 20, pnpm >= 8, Docker Desktop, PowerShell

## 🚀 使用方法

### Linux/macOS

```bash
# 1. 添加执行权限
chmod +x scripts/dev.sh

# 2. 运行脚本
./scripts/dev.sh
```

### Windows

```powershell
# 运行 PowerShell 脚本
.\scripts\start-dev.ps1
```

## 🔧 脚本功能

启动脚本会自动执行以下操作：

### 1. 环境检查
- ✅ 检查 Node.js、pnpm、Docker 是否已安装
- ✅ 验证 Node.js 版本 >= 20
- ✅ 检查 Docker 服务是否运行

### 2. 环境变量管理
- 📋 自动从 `env.example` 创建 `.env` 文件（如果不存在）
- 🔐 加载 `.env` 文件中的所有环境变量
- ⚠️ 验证必需的环境变量是否已配置：
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `ENCRYPTION_KEY`

### 3. 服务启动
- 🗄️ 启动 PostgreSQL 数据库（Docker 容器）
- 💾 启动 Redis 缓存（Docker 容器）
- 📦 安装 npm 依赖
- 🔧 生成 Prisma 客户端
- 🗃️ 运行数据库迁移
- 🌱 填充初始数据
- 🔨 构建共享包
- 🎯 启动后端 API 服务
- 🖥️ 启动桌面应用

### 4. 日志输出
- 📊 显示所有服务的访问地址
- 📖 提供常用命令提示

## 🌐 服务访问地址

脚本启动后，可以通过以下地址访问各个服务：

- **后端 API**: http://localhost:3000
- **API 文档**: http://localhost:3000/docs
- **桌面应用**: Electron 窗口自动打开
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🛑 停止服务

按 `Ctrl+C` 停止所有服务。脚本会自动：
1. 停止 Node.js 进程（API 和桌面应用）
2. 停止 Docker 容器（PostgreSQL 和 Redis）
3. 清理后台进程

## 📝 配置环境变量

首次运行时，脚本会从 `env.example` 创建 `.env` 文件。请编辑该文件并配置以下变量：

### 必需的环境变量

```env
# 数据库连接
DATABASE_URL="postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant"

# JWT 认证密钥（至少 32 字符）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 数据加密密钥（32 字符）
ENCRYPTION_KEY="your-32-char-encryption-key-here"
```

### 可选的环境变量

```env
# AI 服务商 API Keys
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."

# Redis 配置
REDIS_HOST="localhost"
REDIS_PORT="6379"

# 服务端口
PORT="3000"
```

## 🔍 手动加载环境变量

如果不使用启动脚本，需要手动加载环境变量：

### Linux/macOS (Bash)

```bash
# 方法 1: 使用 export
export $(grep -v '^#' .env | xargs)

# 方法 2: 使用 source
set -a
source .env
set +a

# 方法 3: 使用 dotenv-cli
npm install -g dotenv-cli
dotenv -e .env -- pnpm dev
```

### Windows (PowerShell)

```powershell
# 方法 1: 逐行加载
Get-Content .env | ForEach-Object {
    if ($_ -notmatch '^#' -and $_ -match '=') {
        $name, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

# 方法 2: 使用 dotenv-cli
npm install -g dotenv-cli
dotenv -e .env -- pnpm dev
```

## ✅ 验证环境变量

```bash
# Linux/macOS
echo $DATABASE_URL
echo $JWT_SECRET

# Windows PowerShell
echo $env:DATABASE_URL
echo $env:JWT_SECRET

# Node.js
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

## 🐛 常见问题

### 1. 权限错误（Linux/macOS）

```bash
# 错误: Permission denied
chmod +x scripts/dev.sh
```

### 2. Docker 未启动

```bash
# 错误: Cannot connect to the Docker daemon
# 解决: 启动 Docker 服务
sudo systemctl start docker  # Linux
open -a Docker              # macOS
```

### 3. 端口已被占用

```bash
# 检查端口占用
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 停止占用端口的进程或修改 .env 中的 PORT 配置
```

### 4. 环境变量未生效

确保 `.env` 文件存在于项目根目录，并且格式正确：
- 每行一个变量
- 格式为 `KEY=VALUE`
- 不要在等号两边添加空格
- 字符串值不需要引号（除非包含特殊字符）

示例：
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=my-secret-key
```

### 5. Node.js 版本过低

```bash
# 错误: Node.js version x.x.x is too old
# 解决: 升级 Node.js
nvm install 20  # 使用 nvm
nvm use 20
```

## 📖 更多信息

详细的开发指南请参考：[开发文档](../docs/development/getting-started.md)

## 🤝 脚本维护

- **dev.sh**: Linux/macOS Bash 脚本
- **start-dev.ps1**: Windows PowerShell 脚本（待创建）

两个脚本功能相同，只是针对不同操作系统。

## 📞 获取帮助

如果遇到问题，请：
1. 查看脚本输出的错误信息
2. 检查 `.env` 文件配置
3. 查看 Docker 容器日志: `docker-compose logs -f`
4. 参考开发文档的常见问题部分

