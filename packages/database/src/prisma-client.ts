/**
 * Prisma Client 适配器
 * 处理 CommonJS 和 ESM 模块之间的兼容性
 */

import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 创建 require 函数以导入 CommonJS 模块
const require = createRequire(import.meta.url)

// 导入生成的 Prisma Client（CommonJS 格式）
const prismaClientPath = join(__dirname, 'generated', 'client', 'index.js')
const { PrismaClient: PrismaClientImpl, Prisma } = require(prismaClientPath)

// 重新导出
export { PrismaClientImpl as PrismaClient, Prisma }

// 默认导出
export default PrismaClientImpl

