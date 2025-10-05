#!/bin/bash

# AI SSH Assistant 开发环境启动脚本

set -e

echo "🚀 Starting AI SSH Assistant Development Environment"

# 检查必要的工具
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "🔍 Checking required tools..."
check_command "node"
check_command "pnpm"
check_command "docker"
check_command "docker-compose"

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="20.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ All required tools are available"

# 检查环境变量文件
echo `pwd`
if [ ! -f "`pwd`/.env" ]; then
    echo "📋 Creating .env file from template..."
    cp `pwd`/env.example `pwd`/.env
    echo "⚠️  Please edit ../.env file and set your API keys and database credentials"
    echo "   Required variables:"
    echo "   - DATABASE_URL"
    echo "   - JWT_SECRET"
    echo "   - ENCRYPTION_KEY"
    echo "   - OPENAI_API_KEY or ANTHROPIC_API_KEY"
    read -p "Press Enter to continue after editing `pwd`/.env file..."
fi

# 启动数据库服务
echo "🗄️  Starting database services..."
docker-compose up -d postgres redis

# 等待数据库启动
echo "⏳ Waiting for database to be ready..."
sleep 10

# 安装依赖
echo "📦 Installing dependencies..."
pnpm install

# 生成 Prisma 客户端
echo "🔧 Generating Prisma client..."
pnpm db:generate

# 运行数据库迁移
echo "🗃️  Running database migrations..."
pnpm db:push

# 种子数据
echo "🌱 Seeding database..."
pnpm db:seed

# 构建共享包
echo "🔨 Building shared packages..."
pnpm build:shared

# 启动开发服务器
echo "🎯 Starting development servers..."

# 使用 trap 来处理 Ctrl+C
trap 'echo "🛑 Shutting down..."; kill $(jobs -p); docker-compose stop postgres redis; exit' INT

# 并行启动服务
pnpm dev:server &
SERVER_PID=$!

sleep 5

pnpm dev:desktop &
DESKTOP_PID=$!

echo "✅ Development environment started successfully!"
echo ""
echo "🌐 Services:"
echo "   - API Server: http://localhost:3000"
echo "   - API Docs: http://localhost:3000/docs"
echo "   - Desktop App: Starting..."
echo "   - Database: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
echo "📖 Commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Database studio: pnpm db:studio"
echo "   - Stop services: Ctrl+C"
echo ""

# 等待所有后台进程
wait $SERVER_PID $DESKTOP_PID
