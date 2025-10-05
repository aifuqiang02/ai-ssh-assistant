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
ROOT_DIR="`pwd`"
ENV_FILE="$ROOT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "📋 Creating .env file from template..."
    cp "$ROOT_DIR/env.example" "$ENV_FILE"
    echo "⚠️  Please edit .env file and set your API keys and database credentials"
    echo "   Required variables:"
    echo "   - DATABASE_URL"
    echo "   - JWT_SECRET"
    echo "   - ENCRYPTION_KEY"
    echo "   - OPENAI_API_KEY or ANTHROPIC_API_KEY"
    read -p "Press Enter to continue after editing .env file..."
fi

# 加载环境变量
echo "🔐 Loading environment variables from .env file..."
if [ -f "$ENV_FILE" ]; then
    # 使用 set -a 自动导出所有变量
    set -a
    source "$ENV_FILE"
    set +a
    echo "✅ Environment variables loaded successfully"
    
    # 验证必要的环境变量
    MISSING_VARS=()
    [ -z "$DATABASE_URL" ] && MISSING_VARS+=("DATABASE_URL")
    [ -z "$JWT_SECRET" ] && MISSING_VARS+=("JWT_SECRET")
    [ -z "$ENCRYPTION_KEY" ] && MISSING_VARS+=("ENCRYPTION_KEY")
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo "⚠️  Warning: The following required environment variables are missing:"
        for var in "${MISSING_VARS[@]}"; do
            echo "   - $var"
        done
        echo ""
        echo "   Please edit $ENV_FILE and set these variables."
        read -p "Press Enter to continue anyway or Ctrl+C to abort..."
    fi
else
    echo "❌ .env file not found at $ENV_FILE"
    exit 1
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

# 检查 Electron 是否正确安装
echo "🔍 Checking Electron installation..."
DESKTOP_DIR="apps/desktop"
ELECTRON_PATH="$DESKTOP_DIR/node_modules/electron/dist/electron"
ELECTRON_PATH_WIN="$DESKTOP_DIR/node_modules/electron/dist/electron.exe"

if [ ! -f "$ELECTRON_PATH" ] && [ ! -f "$ELECTRON_PATH_WIN" ]; then
    echo "⚠️  Electron binary not found, reinstalling..."
    
    # 设置国内镜像源（推荐国内用户）
    export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
    export ELECTRON_CUSTOM_DIR="{{ version }}"
    
    echo "🗑️  Removing existing Electron..."
    cd "$DESKTOP_DIR"
    pnpm remove electron 2>/dev/null || true
    
    echo "📦 Installing Electron with China mirror..."
    pnpm add electron@27.3.11 --force
    cd ../..
    
    # 检查是否安装成功
    if [ ! -f "$ELECTRON_PATH" ] && [ ! -f "$ELECTRON_PATH_WIN" ]; then
        echo "❌ Electron installation failed with mirror."
        echo "   Trying without mirror..."
        
        unset ELECTRON_MIRROR
        unset ELECTRON_CUSTOM_DIR
        
        cd "$DESKTOP_DIR"
        pnpm add electron@27.3.11 --force
        cd ../..
    fi
fi

# 验证 Electron 安装
echo "✅ Verifying Electron installation..."
if [ -f "$ELECTRON_PATH" ] || [ -f "$ELECTRON_PATH_WIN" ]; then
    echo "✅ Electron binary found"
    
    # 尝试运行验证
    if cd "$DESKTOP_DIR" && node -e "require('electron')" 2>/dev/null; then
        echo "✅ Electron can be loaded successfully"
        cd ../..
    else
        echo "⚠️  Electron binary exists but cannot be loaded"
        echo "   This might not affect development, continuing..."
        cd ../..
    fi
else
    echo "❌ Electron installation failed!"
    echo ""
    echo "请手动修复："
    echo "  cd apps/desktop"
    echo "  export ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'"
    echo "  pnpm remove electron && pnpm add electron@27.3.11 --force"
    echo ""
    echo "或运行修复脚本："
    echo "  chmod +x scripts/fix-electron.sh"
    echo "  ./scripts/fix-electron.sh"
    echo ""
    read -p "是否继续？(y/n): " continue_choice
    if [ "$continue_choice" != "y" ] && [ "$continue_choice" != "Y" ]; then
        exit 1
    fi
fi

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
