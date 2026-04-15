/**
 * 清理旧的打包输出目录
 * 避免 electron-builder 硬链接冲突
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const releaseDir = path.resolve(__dirname, '../release')

console.log(`[clean-release] 检查目录: ${releaseDir}`)
console.log(`[clean-release] 目录存在: ${fs.existsSync(releaseDir)}`)

if (fs.existsSync(releaseDir)) {
  console.log('🧹 清理旧的打包输出目录...')
  try {
    // 在 Linux/macOS 上使用 rm -rf 更可靠
    if (process.platform !== 'win32') {
      execSync(`rm -rf "${releaseDir}"`, { stdio: 'inherit' })
      console.log('✅ 清理完成（使用 rm -rf）')
    } else {
      // Windows
      fs.rmSync(releaseDir, { recursive: true, force: true, maxRetries: 3 })
      console.log('✅ 清理完成')
    }
    
    // 验证清理成功
    if (fs.existsSync(releaseDir)) {
      console.error('❌ 清理后目录仍然存在，强制删除...')
      execSync(`rm -rf "${releaseDir}" || rmdir /s /q "${releaseDir}"`, { stdio: 'inherit' })
    }
  } catch (error) {
    console.error('❌ 清理失败:', error.message)
    // 抛出错误，阻止打包（避免冲突）
    throw error
  }
} else {
  console.log('✅ 无需清理（release 目录不存在）')
}

