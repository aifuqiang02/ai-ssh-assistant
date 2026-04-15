#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('🔧 构建工作空间依赖包...')

// 确保在项目根目录执行
const projectRoot = path.resolve(__dirname, '../../../')
process.chdir(projectRoot)

try {
  // 构建 core 包
  console.log('📦 构建 @ai-ssh/core...')
  execSync('pnpm --filter @ai-ssh/core build', { stdio: 'inherit' })

  // 构建 shared 包
  console.log('📦 构建 @ai-ssh/shared...')
  execSync('pnpm --filter @ai-ssh/shared build', { stdio: 'inherit' })

  // 构建 database 包
  console.log('📦 构建 @ai-ssh/database...')
  execSync('pnpm --filter @ai-ssh/database build', { stdio: 'inherit' })

  // 验证构建产物存在
  const coreDist = path.join(projectRoot, 'packages/core/dist')
  const sharedDist = path.join(projectRoot, 'packages/shared/dist')
  const databaseDist = path.join(projectRoot, 'packages/database/dist')

  if (!fs.existsSync(coreDist)) {
    throw new Error(`@ai-ssh/core 构建产物不存在: ${coreDist}`)
  }

  if (!fs.existsSync(sharedDist)) {
    throw new Error(`@ai-ssh/shared 构建产物不存在: ${sharedDist}`)
  }

  if (!fs.existsSync(databaseDist)) {
    throw new Error(`@ai-ssh/database 构建产物不存在: ${databaseDist}`)
  }

  console.log('✅ 工作空间依赖包构建完成！')
  console.log(`   - @ai-ssh/core: ${coreDist}`)
  console.log(`   - @ai-ssh/shared: ${sharedDist}`)
  console.log(`   - @ai-ssh/database: ${databaseDist}`)
} catch (error) {
  console.error('❌ 构建工作空间依赖包失败:', error.message)
  process.exit(1)
}
