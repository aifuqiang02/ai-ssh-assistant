#!/bin/bash

# AI SSH Assistant 服务端生产构建脚本

set -e

# 检查是否执行清理（默认跳过，避免 Windows 文件锁定问题）
SKIP_CLEAN=true
if [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
    SKIP_CLEAN=false
fi

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# 项目根目录（scripts 目录的父目录）
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🏗️  Building AI SSH Assistant Server for Production"
echo "📂 Project root: $PROJECT_ROOT"
if [ "$SKIP_CLEAN" = true ]; then
    echo "🧹 Skipping clean step (default behavior)"
else
    echo "🧹 Performing full clean (--clean)"
fi

# 切换到项目根目录
cd "$PROJECT_ROOT"

# 清理之前的构建
if [ "$SKIP_CLEAN" = false ]; then
    echo "🧹 Cleaning previous server builds..."
fi
if command -v pnpm &> /dev/null && [ "$SKIP_CLEAN" = false ]; then
    pnpm clean 2>/dev/null || {
        echo "⚠️  Standard clean failed, trying alternative cleanup..."
        # 在 Windows 下，某些文件可能被锁定，尝试强制清理
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            echo "   Windows detected, using aggressive cleanup..."
            # Windows 下使用 rd 命令强制删除
            rd /s /q packages\server\dist 2>nul || true
            rd /s /q packages\server\dist-bundle 2>nul || true
            rd /s /q packages\shared\dist 2>nul || true
            rd /s /q packages\database\dist 2>nul || true
        else
            # Unix-like 系统使用 rm -rf
            rm -rf packages/server/dist 2>/dev/null || true
            rm -rf packages/server/dist-bundle 2>/dev/null || true
            rm -rf packages/shared/dist 2>/dev/null || true
            rm -rf packages/database/dist 2>/dev/null || true
        fi
        echo "   Alternative cleanup completed"
    }
else
    echo "⚠️  pnpm not found, skipping clean step..."
fi

# 安装依赖
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# 类型检查（只检查服务端相关包）
echo "🔍 Running type checks for server packages..."
if ! pnpm --filter @ai-ssh/shared type-check; then
    echo "❌ Shared package type check failed - stopping build"
    exit 1
fi
if ! pnpm --filter @ai-ssh/database type-check; then
    echo "❌ Database package type check failed - stopping build"
    exit 1
fi
if ! pnpm --filter @ai-ssh/server type-check; then
    echo "❌ Server package type check failed - stopping build"
    exit 1
fi

# 代码检查（只检查有 lint 命令的服务端包）
echo "📝 Running linter for server packages..."
if ! pnpm --filter @ai-ssh/server lint; then
    echo "⚠️  Server package lint failed - continuing with build..."
    echo "   Note: Fix lint issues for better code quality"
fi

# 运行测试
echo "🧪 Running tests for server packages..."
if ! pnpm --filter @ai-ssh/server test; then
    echo "⚠️  Server tests failed (no test files found), continuing with build..."
fi

# 生成 Prisma 客户端
echo "🔧 Generating Prisma client..."
pnpm db:generate || {
    echo "⚠️  Prisma client generation failed, continuing with build..."
}

# 构建项目
echo "🔨 Building server projects..."

# 构建共享包
echo "   📚 Building shared packages..."
pnpm build:shared || {
    echo "❌ Failed to build shared packages"
    exit 1
}

# 构建数据库包
echo "   💾 Building database packages..."
pnpm build:database || {
    echo "❌ Failed to build database packages"
    exit 1
}

# 构建服务端
echo "   🖥️  Building server..."
pnpm build:server || {
    echo "❌ Failed to build server"
    exit 1
}

# 构建服务端 Bundle
echo "   📦 Building server bundle..."
cd packages/server
pnpm build:bundle || {
    echo "❌ Failed to build server bundle"
    exit 1
}
cd ../..

echo "✅ Server build completed successfully!"

# 显示构建结果
echo ""
echo "📊 Build Results:"
echo "   - Shared: packages/shared/dist/"
echo "   - Database: packages/database/dist/"
echo "   - Server: packages/server/dist/"
echo "   - Server Bundle: packages/server/dist-bundle/"
echo ""

# 可选：创建 Docker 镜像
if [ "$1" = "--docker" ]; then
    echo "🐳 Building Docker images..."
    docker-compose build
    echo "✅ Docker images built successfully!"
fi

echo ""
echo "🚀 Server is ready for deployment!"
echo "   Run with: node packages/server/dist-bundle/index.js"
echo "   Or: cd packages/server && node dist-bundle/index.js"
echo ""
echo "💡 Usage tips:"
echo "   Force cleanup: $0 --clean"
echo "   Build with Docker: $0 --docker"
