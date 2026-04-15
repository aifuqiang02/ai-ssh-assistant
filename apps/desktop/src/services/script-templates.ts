/**
 * 脚本模板
 */

export interface ScriptTemplate {
  id: string
  name: string
  description: string
  platform: 'windows' | 'linux' | 'mac' | 'all'
  language: 'bash' | 'bat' | 'powershell'
  content: string
  category: 'build' | 'test' | 'backup' | 'other'
}

export const scriptTemplates: ScriptTemplate[] = [
  // ========== 构建脚本 ==========
  {
    id: 'nodejs-build',
    name: 'Node.js 项目构建',
    description: '使用 pnpm 构建 Node.js 项目',
    platform: 'all',
    language: 'bash',
    category: 'build',
    content: `#!/bin/bash

echo "🚀 开始构建 Node.js 项目..."

# 检查 Node.js 版本
node --version
pnpm --version

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 执行构建
echo "🔨 执行构建..."
pnpm run build

echo "✅ 构建完成！"
`
  },
  {
    id: 'nodejs-build-windows',
    name: 'Node.js 项目构建 (Windows)',
    description: '使用 pnpm 构建 Node.js 项目 (Windows 批处理)',
    platform: 'windows',
    language: 'bat',
    category: 'build',
    content: `@echo off
echo ==========================================
echo Node.js 项目构建
echo ==========================================

echo 检查 Node.js 版本...
node --version
pnpm --version

echo.
echo 安装依赖...
pnpm install
if errorlevel 1 goto error

echo.
echo 执行构建...
pnpm run build
if errorlevel 1 goto error

echo.
echo ==========================================
echo 构建完成！
echo ==========================================
goto end

:error
echo.
echo ==========================================
echo 构建失败！
echo ==========================================
exit /b 1

:end
`
  },

  // ========== 备份脚本 ==========
  {
    id: 'backup-files',
    name: '文件备份',
    description: '备份指定目录到备份目录',
    platform: 'linux',
    language: 'bash',
    category: 'backup',
    content: `#!/bin/bash

APP_DIR="/var/www/my-app"
BACKUP_DIR="/var/backups"
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\${BACKUP_DIR}/backup_\${DATE}.tar.gz"

echo "💾 开始备份..."

# 创建备份目录
mkdir -p \${BACKUP_DIR}

# 打包备份
echo "📦 打包文件..."
tar -czf \${BACKUP_FILE} -C \$(dirname \${APP_DIR}) \$(basename \${APP_DIR})

# 显示备份信息
echo "✅ 备份完成！"
echo "备份文件: \${BACKUP_FILE}"
ls -lh \${BACKUP_FILE}

# 保留最近 7 天的备份
echo "🧹 清理旧备份..."
find \${BACKUP_DIR} -name "backup_*.tar.gz" -type f -mtime +7 -delete

# 显示剩余备份
echo "📋 当前备份文件:"
ls -lh \${BACKUP_DIR}/backup_*.tar.gz
`
  },

  // ========== 测试脚本 ==========
  {
    id: 'health-check',
    name: '健康检查',
    description: '检查应用是否正常运行',
    platform: 'linux',
    language: 'bash',
    category: 'test',
    content: `#!/bin/bash

APP_URL="http://localhost:3000"
HEALTH_ENDPOINT="\${APP_URL}/health"

echo "🏥 执行健康检查..."

# 检查 HTTP 响应
HTTP_CODE=\$(curl -s -o /dev/null -w "%{http_code}" \${HEALTH_ENDPOINT})

if [ \${HTTP_CODE} -eq 200 ]; then
    echo "✅ 应用运行正常 (HTTP \${HTTP_CODE})"
    exit 0
else
    echo "❌ 应用异常 (HTTP \${HTTP_CODE})"
    exit 1
fi
`
  },

  // ========== 其他脚本 ==========
  {
    id: 'env-setup',
    name: '环境配置',
    description: '设置环境变量和配置文件',
    platform: 'all',
    language: 'bash',
    category: 'other',
    content: `#!/bin/bash

APP_DIR="/var/www/my-app"
ENV_FILE="\${APP_DIR}/.env"

echo "⚙️ 配置环境..."

# 创建 .env 文件
cat > \${ENV_FILE} << EOF
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
EOF

echo "✅ 环境配置完成！"
cat \${ENV_FILE}
`
  }
]

/**
 * 根据分类获取模板
 */
export function getTemplatesByCategory(category: string): ScriptTemplate[] {
  return scriptTemplates.filter(t => t.category === category)
}

/**
 * 根据平台获取模板
 */
export function getTemplatesByPlatform(platform: string): ScriptTemplate[] {
  return scriptTemplates.filter(t => t.platform === platform || t.platform === 'all')
}

/**
 * 根据ID获取模板
 */
export function getTemplateById(id: string): ScriptTemplate | undefined {
  return scriptTemplates.find(t => t.id === id)
}
