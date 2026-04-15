/**
 * electron-builder before-pack hook
 * 在打包前清理目标目录，避免硬链接冲突
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

/**
 * @param {import('electron-builder').BeforePackContext} context
 */
async function beforePack(context) {
  const { electronPlatformName, appOutDir } = context
  console.log(`[before-pack] 清理打包目录: ${electronPlatformName}`)
  
  try {
    // 获取 release 目录
    const releaseDir = path.dirname(path.dirname(appOutDir))
    
    console.log(`[before-pack] 目标目录: ${appOutDir}`)
    console.log(`[before-pack] Release 目录: ${releaseDir}`)
    
    // 删除旧的打包输出
    if (fs.existsSync(appOutDir)) {
      console.log(`[before-pack] 删除旧的输出目录...`)
      
      if (process.platform !== 'win32') {
        // Linux/macOS: 使用 rm -rf (更可靠)
        try {
          execSync(`rm -rf "${appOutDir}"`, { stdio: 'inherit' })
        } catch (err) {
          console.warn(`[before-pack] rm 命令失败，使用 Node.js API`)
          fs.rmSync(appOutDir, { recursive: true, force: true, maxRetries: 3 })
        }
      } else {
        // Windows: 使用 Node.js API
        fs.rmSync(appOutDir, { recursive: true, force: true, maxRetries: 3 })
      }
      
      console.log(`[before-pack] ✅ 清理完成`)
    } else {
      console.log(`[before-pack] ✅ 无需清理（目录不存在）`)
    }
  } catch (error) {
    console.error(`[before-pack] ❌ 清理失败:`, error.message)
    // 不抛出错误，允许继续打包
  }
}

module.exports = beforePack

