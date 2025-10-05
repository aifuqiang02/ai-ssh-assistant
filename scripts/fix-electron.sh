#!/bin/bash

# Electron 安装修复脚本
# 用于解决 "Electron failed to install correctly" 错误

set -e

echo "🔧 Electron 安装修复工具"
echo "======================================"
echo ""

# 检测操作系统
OS="$(uname -s)"
case "$OS" in
    Linux*)     PLATFORM=linux;;
    Darwin*)    PLATFORM=darwin;;
    MINGW*|MSYS*|CYGWIN*)    PLATFORM=win32;;
    *)          PLATFORM="UNKNOWN:${OS}"
esac

echo "🖥️  检测到操作系统: $PLATFORM"
echo ""

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，请先安装 pnpm"
    exit 1
fi

DESKTOP_DIR="apps/desktop"
ELECTRON_PATH="$DESKTOP_DIR/node_modules/electron/dist/electron"
ELECTRON_PATH_WIN="$DESKTOP_DIR/node_modules/electron/dist/electron.exe"

echo "📋 当前 Electron 状态："
if [ -f "$ELECTRON_PATH" ] || [ -f "$ELECTRON_PATH_WIN" ]; then
    echo "   ✅ Electron 二进制文件存在"
    
    # 尝试验证
    if cd "$DESKTOP_DIR" && node -e "require('electron')" 2>/dev/null; then
        echo "   ✅ Electron 可以正常加载"
        cd ../..
        echo ""
        echo "✅ Electron 已正确安装，无需修复！"
        exit 0
    else
        echo "   ⚠️  Electron 二进制存在但无法加载"
        cd ../.. 2>/dev/null || true
    fi
else
    echo "   ❌ Electron 二进制文件不存在"
fi
echo ""

# 询问用户选择修复方式
echo "请选择修复方式："
echo "  1) 使用国内镜像重新安装 (推荐国内用户)"
echo "  2) 使用官方源重新安装"
echo "  3) 清理所有缓存后重新安装"
echo "  4) 手动下载指引"
echo ""
read -p "请输入选项 (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🌏 使用国内镜像源安装 Electron..."
        echo "======================================"
        
        # 设置镜像源
        export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
        export ELECTRON_CUSTOM_DIR="{{ version }}"
        
        echo "🗑️  删除现有 Electron..."
        cd "$DESKTOP_DIR"
        pnpm remove electron 2>/dev/null || true
        
        echo "📦 安装 Electron (使用国内镜像)..."
        pnpm add electron@27.3.11 --force
        cd ../..
        
        # 配置永久镜像
        if [ ! -f "$DESKTOP_DIR/.npmrc" ] || ! grep -q "electron_mirror" "$DESKTOP_DIR/.npmrc"; then
            echo ""
            read -p "是否永久配置镜像源到 apps/desktop/.npmrc? (y/n): " config_mirror
            if [ "$config_mirror" = "y" ] || [ "$config_mirror" = "Y" ]; then
                echo "electron_mirror=https://npmmirror.com/mirrors/electron/" >> "$DESKTOP_DIR/.npmrc"
                echo "electron_custom_dir={{ version }}" >> "$DESKTOP_DIR/.npmrc"
                echo "✅ 已配置镜像源到 apps/desktop/.npmrc"
            fi
        fi
        ;;
    
    2)
        echo ""
        echo "🌐 使用官方源安装 Electron..."
        echo "======================================"
        
        echo "🗑️  删除现有 Electron..."
        cd "$DESKTOP_DIR"
        pnpm remove electron 2>/dev/null || true
        
        echo "📦 安装 Electron..."
        pnpm add electron@27.3.11 --force
        cd ../..
        ;;
    
    3)
        echo ""
        echo "🧹 清理所有缓存..."
        echo "======================================"
        
        echo "🗑️  清理 pnpm store..."
        pnpm store prune
        
        echo "🗑️  删除 node_modules..."
        rm -rf node_modules
        
        echo "🗑️  删除 pnpm-lock.yaml..."
        rm -f pnpm-lock.yaml
        
        echo "🌏 设置国内镜像源..."
        export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
        export ELECTRON_CUSTOM_DIR="{{ version }}"
        
        echo "📦 重新安装所有依赖..."
        pnpm install
        ;;
    
    4)
        echo ""
        echo "📖 手动下载指引"
        echo "======================================"
        echo ""
        echo "1. 根据您的操作系统下载对应的 Electron 27.3.11:"
        echo ""
        echo "   Windows (x64):"
        echo "   https://npmmirror.com/mirrors/electron/27.3.11/electron-v27.3.11-win32-x64.zip"
        echo ""
        echo "   macOS (x64):"
        echo "   https://npmmirror.com/mirrors/electron/27.3.11/electron-v27.3.11-darwin-x64.zip"
        echo ""
        echo "   macOS (arm64):"
        echo "   https://npmmirror.com/mirrors/electron/27.3.11/electron-v27.3.11-darwin-arm64.zip"
        echo ""
        echo "   Linux (x64):"
        echo "   https://npmmirror.com/mirrors/electron/27.3.11/electron-v27.3.11-linux-x64.zip"
        echo ""
        echo "2. 解压下载的文件"
        echo ""
        echo "3. 将解压后的内容复制到:"
        echo "   apps/desktop/node_modules/electron/dist/"
        echo ""
        echo "4. 确保可执行文件有执行权限 (Linux/macOS):"
        echo "   chmod +x apps/desktop/node_modules/electron/dist/electron"
        echo ""
        exit 0
        ;;
    
    *)
        echo "❌ 无效的选项"
        exit 1
        ;;
esac

# 验证安装
echo ""
echo "🔍 验证 Electron 安装..."
echo "======================================"

if [ -f "$ELECTRON_PATH" ] || [ -f "$ELECTRON_PATH_WIN" ]; then
    echo "✅ Electron 二进制文件存在"
else
    echo "❌ Electron 二进制文件不存在"
    exit 1
fi

if cd "$DESKTOP_DIR" && node -e "require('electron')" 2>/dev/null; then
    echo "✅ Electron 可以正常加载"
    cd ../..
else
    echo "❌ Electron 无法加载"
    cd ../.. 2>/dev/null || true
    echo ""
    echo "可能的原因："
    echo "  1. 网络问题导致下载不完整"
    echo "  2. 权限问题"
    echo "  3. 文件损坏"
    echo ""
    echo "建议："
    echo "  - 尝试选项 3 (清理缓存后重装)"
    echo "  - 或使用选项 4 (手动下载)"
    exit 1
fi

# 显示版本信息
cd "$DESKTOP_DIR"
ELECTRON_VERSION=$(npx electron --version 2>/dev/null || echo "未知")
cd ../..
echo "📌 Electron 版本: $ELECTRON_VERSION"

echo ""
echo "✅ Electron 安装修复完成！"
echo ""
echo "现在可以运行："
echo "  ./scripts/dev.sh        # 启动开发环境"
echo "  cd apps/desktop && pnpm dev  # 单独启动桌面应用"

