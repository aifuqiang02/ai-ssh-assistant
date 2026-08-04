const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

async function afterSign(context) {
  if (context.electronPlatformName !== 'darwin') return

  const appBundle = fs.readdirSync(context.appOutDir).find(name => name.endsWith('.app'))
  if (!appBundle) {
    throw new Error(`[after-sign] macOS App bundle not found: ${context.appOutDir}`)
  }

  const appPath = path.join(context.appOutDir, appBundle)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', appPath], { stdio: 'inherit' })
  execFileSync('codesign', ['--verify', '--deep', '--strict', '--verbose=2', appPath], {
    stdio: 'inherit'
  })
  console.log('[after-sign] macOS ad-hoc signature verified')
}

module.exports = afterSign
