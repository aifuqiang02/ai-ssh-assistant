/** Prepare the better-sqlite3 binary for the target Electron runtime. */
const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const desktopDir = path.resolve(__dirname, '..')
const electronVersion = require(path.join(desktopDir, 'node_modules/electron/package.json')).version
const betterSqliteDir = path.dirname(
  require.resolve('better-sqlite3/package.json', { paths: [desktopDir] })
)
const prebuildInstall = require.resolve('prebuild-install/bin.js', { paths: [desktopDir] })
const targetArch = process.env.TARGET_ARCH || process.arch

console.log(`Preparing better-sqlite3 for Electron ${electronVersion} (${process.platform}-${targetArch})`)

try {
  fs.rmSync(path.join(betterSqliteDir, 'build'), { recursive: true, force: true })
  execFileSync(
    process.execPath,
    [
      prebuildInstall,
      '--runtime=electron',
      `--target=${electronVersion}`,
      `--platform=${process.platform}`,
      `--arch=${targetArch}`
    ],
    {
      cwd: betterSqliteDir,
      env: {
        ...process.env,
        npm_config_better_sqlite3_binary_host:
          process.env.npm_config_better_sqlite3_binary_host ||
          'https://npmmirror.com/mirrors/better-sqlite3'
      },
      stdio: 'inherit'
    }
  )

  const bindingPath = path.join(betterSqliteDir, 'build', 'Release', 'better_sqlite3.node')
  if (!fs.existsSync(bindingPath)) {
    throw new Error(`Native binding was not created at ${bindingPath}`)
  }

  console.log('better-sqlite3 prebuilt binary is ready')
} catch (error) {
  console.error('Failed to prepare better-sqlite3:', error.message)
  process.exit(1)
}
