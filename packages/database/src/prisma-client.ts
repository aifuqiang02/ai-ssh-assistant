/**
 * Prisma Client 适配器
 * 处理 Prisma Client 路径解析
 */

import { join } from 'path'
import { existsSync } from 'fs'

// 调试信息
console.log('🔍 Prisma Client Adapter - Current directory:', __dirname)

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

// 动态加载 Prisma Client
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prismaModule = require(prismaClientPath)

// 导出（CommonJS 方式）
export const { PrismaClient, Prisma } = prismaModule
export default prismaModule.PrismaClient
