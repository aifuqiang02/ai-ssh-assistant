/**
 * Prisma Client 适配器
 * 处理 CommonJS 和 ESM 模块之间的兼容性
 */

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 调试信息
console.log('🔍 Prisma Client Adapter - Current directory:', __dirname)

// 创建 require 函数以导入 CommonJS 模块
const require = createRequire(import.meta.url)

// 尝试多个可能的路径
const possiblePaths = [
  join(__dirname, 'generated', 'client', 'index.js'),  
  // ↑ 开发模式：相对于源文件
  
  join(__dirname, '..', 'generated', 'client', 'index.js'),  
  // ↑ 编译后：dist/src/prisma-client.js → dist/src/generated/client/
  
  join(__dirname, '..', '..', 'generated', 'client', 'index.js'),  
  // ↑ 其他情况
  
  join(__dirname, '..', '..', '..', '..', 'packages', 'database', 'dist', 'src', 'generated', 'client', 'index.js'),
  // ↑ Electron main: apps/desktop/dist-electron/main/ → packages/database/dist/src/generated/client/
  
  join(__dirname, '..', '..', '..', '..', '..', 'packages', 'database', 'dist', 'src', 'generated', 'client', 'index.js'),
  // ↑ Electron main (更深层级)
]

let prismaClientPath: string | undefined
for (const path of possiblePaths) {
  if (existsSync(path)) {
    prismaClientPath = path
    console.log('✅ Found Prisma Client at:', path)
    break
  }
}

if (!prismaClientPath) {
  console.error('❌ Could not find Prisma Client in any of these paths:')
  possiblePaths.forEach(p => console.error('  -', p))
  throw new Error('Prisma Client not found')
}

// 导入生成的 Prisma Client（CommonJS 格式）
const { PrismaClient: PrismaClientImpl, Prisma } = require(prismaClientPath)

// 重新导出
export { PrismaClientImpl as PrismaClient, Prisma }

// 默认导出
export default PrismaClientImpl

