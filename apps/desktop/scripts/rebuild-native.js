/**
 * 在打包前重建原生模块
 * 确保 better-sqlite3 等原生模块适配当前 Electron 版本
 powershell "$env:PYTHON='python'; $env:npm_config_msvs_version='2022'; cd node_modules\.pnpm\better-sqlite3@12.4.1\node_modules\better-sqlite3; npx electron-rebuild -f"
 */

const { execSync } = require('child_process')
const path = require('path')

console.log('🔧 开始重建原生模块（适配 Electron 版本）...')
console.log(`   环境: ${process.env.CI || process.env.GITHUB_ACTIONS ? 'CI' : 'Local'}`)

try {
  // 使用 electron-rebuild 重建 better-sqlite3
  execSync('npx electron-rebuild -f -w better-sqlite3', {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    // 使用 cmd.exe 避免 Git Bash 兼容性问题
    shell: process.platform === 'win32' ? 'cmd.exe' : undefined
  })

  console.log('✅ 原生模块重建完成')
} catch (error) {
  console.error('❌ 原生模块重建失败:', error.message)
  console.error('\n如果继续失败，请尝试：')
  console.error('1. 在 CMD 或 PowerShell 中执行（不要用 Git Bash）')
  console.error('2. 手动执行: cd apps/desktop && npx electron-rebuild -f -w better-sqlite3')
  console.error('3. 确保已安装 Windows Build Tools')
  process.exit(1)
}

