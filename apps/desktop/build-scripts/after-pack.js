/**
 * electron-builder after-pack hook
 * 确保工作空间包和关键依赖被正确包含
 */

const path = require('path')
const fs = require('fs')

/**
 * @param {import('electron-builder').AfterPackContext} context
 */
async function afterPack(context) {
  const { electronPlatformName, appOutDir } = context
  console.log(`[after-pack] 验证打包内容: ${electronPlatformName}`)

  try {
    const resourcesPath = path.join(appOutDir, 'resources')
    const appPath = path.join(resourcesPath, 'app')
    const nodeModulesPath = path.join(appPath, 'node_modules')

    // 确保工作空间包存在并完整
    ensureWorkspacePackage(
      nodeModulesPath,
      '@ai-ssh/database',
      path.resolve(__dirname, '../../../packages/database'),
      ['dist', 'package.json']
    )

    ensureWorkspacePackage(
      nodeModulesPath,
      '@ai-ssh/shared',
      path.resolve(__dirname, '../../../packages/shared'),
      ['dist', 'package.json']
    )

    // 验证关键依赖是否存在
    const criticalDeps = ['better-sqlite3', 'ssh2', 'vue', '@xterm/xterm', 'marked', 'axios']

    let allDepsOk = true
    for (const dep of criticalDeps) {
      const depPath = path.join(nodeModulesPath, dep)
      if (fs.existsSync(depPath)) {
        console.log(`[after-pack] ✅ ${dep} 存在`)
      } else {
        console.warn(`[after-pack] ⚠️ ${dep} 缺失`)
        allDepsOk = false
      }
    }

    // 验证工作空间包的子依赖
    verifyWorkspaceDependencies(nodeModulesPath, '@ai-ssh/database')
    verifyWorkspaceDependencies(nodeModulesPath, '@ai-ssh/shared')

    if (allDepsOk) {
      console.log('[after-pack] ✅ 所有关键依赖验证通过')
    } else {
      console.warn('[after-pack] ⚠️ 部分依赖缺失，可能影响功能')
    }

    console.log('[after-pack] ✅ 验证完成')
  } catch (error) {
    console.error('[after-pack] ❌ 验证失败:', error.message)
    // 不抛出错误，允许打包继续
  }
}

/**
 * 确保工作空间包存在
 */
function ensureWorkspacePackage(nodeModulesPath, packageName, sourcePackage, includes) {
  const packagePath = path.join(nodeModulesPath, ...packageName.split('/'))

  // 检查包是否存在
  if (fs.existsSync(packagePath)) {
    // 检查必需的文件/目录
    const allExist = includes.every(item => fs.existsSync(path.join(packagePath, item)))

    if (allExist) {
      console.log(`[after-pack] ✅ ${packageName} 已存在且完整`)

      // 确保 Prisma 生成的客户端存在
      if (packageName === '@ai-ssh/database') {
        ensurePrismaClient(packagePath)
      }

      return
    }
  }

  console.log(`[after-pack] 📦 复制 ${packageName}...`)

  // 创建包目录
  fs.mkdirSync(packagePath, { recursive: true })

  // 复制指定的文件/目录
  for (const item of includes) {
    const sourcePath = path.join(sourcePackage, item)
    const targetPath = path.join(packagePath, item)

    if (!fs.existsSync(sourcePath)) {
      console.warn(`[after-pack] ⚠️ 源文件不存在: ${sourcePath}`)
      continue
    }

    copyRecursiveSync(sourcePath, targetPath)
  }

  // 确保 Prisma 生成的客户端存在
  if (packageName === '@ai-ssh/database') {
    ensurePrismaClient(packagePath)
  }

  console.log(`[after-pack] ✅ ${packageName} 复制完成`)
}

/**
 * 确保 Prisma Client 已生成并复制到正确位置
 */
function ensurePrismaClient(packagePath) {
  const prismaGeneratedSrc = path.join(packagePath, 'src', 'generated', 'client-sqlite')
  const prismaGeneratedTarget = path.join(packagePath, 'dist', 'src', 'generated', 'client-sqlite')

  // 检查是否需要生成 Prisma Client
  if (!fs.existsSync(prismaGeneratedSrc) && !fs.existsSync(prismaGeneratedTarget)) {
    console.log(`[after-pack] 🔧 尝试生成 Prisma Client...`)
    try {
      const { execSync } = require('child_process')
      const databasePath = path.resolve(__dirname, '../../../packages/database')
      execSync('pnpm prisma generate', {
        cwd: databasePath,
        stdio: 'inherit'
      })
      console.log(`[after-pack] ✅ Prisma Client 生成成功`)
    } catch (error) {
      console.warn(`[after-pack] ⚠️ Prisma Client 生成失败: ${error.message}`)
    }
  }

  // 确保 dist/src/generated/client-sqlite 存在
  if (fs.existsSync(prismaGeneratedSrc)) {
    console.log(`[after-pack] 📦 复制 Prisma Client 到 dist...`)
    fs.mkdirSync(prismaGeneratedTarget, { recursive: true })
    copyRecursiveSync(prismaGeneratedSrc, prismaGeneratedTarget)
    console.log(`[after-pack] ✅ Prisma Client 已复制到 dist`)
  } else if (fs.existsSync(prismaGeneratedTarget)) {
    console.log(`[after-pack] ✅ Prisma Client 已存在于 dist`)
  } else {
    console.warn(`[after-pack] ⚠️ Prisma Client 文件未找到`)
  }
}

/**
 * 验证工作空间包的依赖是否存在
 */
function verifyWorkspaceDependencies(nodeModulesPath, packageName) {
  const packagePath = path.join(nodeModulesPath, ...packageName.split('/'))
  const packageJsonPath = path.join(packagePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`[after-pack] ⚠️ ${packageName}/package.json 不存在`)
    return
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const deps = { ...packageJson.dependencies, ...packageJson.peerDependencies }

    if (Object.keys(deps).length === 0) {
      console.log(`[after-pack] ℹ️ ${packageName} 无外部依赖`)
      return
    }

    let missingDeps = []
    for (const dep in deps) {
      // 跳过工作空间内部依赖
      if (dep.startsWith('@ai-ssh/')) continue

      const depPath = path.join(nodeModulesPath, dep)
      if (!fs.existsSync(depPath)) {
        missingDeps.push(dep)
      }
    }

    if (missingDeps.length > 0) {
      console.warn(`[after-pack] ⚠️ ${packageName} 缺少依赖:`, missingDeps.join(', '))
    } else {
      console.log(`[after-pack] ✅ ${packageName} 依赖完整`)
    }
  } catch (error) {
    console.warn(`[after-pack] ⚠️ 无法读取 ${packageName} 依赖:`, error.message)
  }
}

/**
 * 递归复制
 */
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName))
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

module.exports = afterPack
