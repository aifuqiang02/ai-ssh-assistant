// 浏览器环境的 Prisma 客户端适配器
// 在前端环境中，我们不直接使用数据库，而是通过API调用

interface MockPrismaClient {
  $connect(): Promise<void>
  $disconnect(): Promise<void>
  [key: string]: any
}

// 全局类型声明
declare global {
  var __prisma: any | undefined
  var window: any | undefined
  var document: any | undefined
}

class BrowserPrismaClient implements MockPrismaClient {
  async $connect(): Promise<void> {
    console.log('🌐 Browser Prisma Client: Mock connection established')
  }

  async $disconnect(): Promise<void> {
    console.log('🌐 Browser Prisma Client: Mock connection closed')
  }

  // 模拟所有数据库操作
  [key: string]: any

  constructor() {
    // 为所有可能的模型创建代理
    return new Proxy(this, {
      get(target, prop) {
        if (typeof prop === 'string' && !prop.startsWith('$') && !['connected'].includes(prop)) {
          // 模拟模型操作
          return {
            create: async (args: any) => {
              console.log(`🌐 Browser Mock: ${prop}.create`, args)
              return { id: `mock-${Date.now()}`, ...args.data }
            },
            findMany: async (args?: any) => {
              console.log(`🌐 Browser Mock: ${prop}.findMany`, args)
              return []
            },
            findUnique: async (args: any) => {
              console.log(`🌐 Browser Mock: ${prop}.findUnique`, args)
              return null
            },
            update: async (args: any) => {
              console.log(`🌐 Browser Mock: ${prop}.update`, args)
              return { ...args.where, ...args.data }
            },
            delete: async (args: any) => {
              console.log(`🌐 Browser Mock: ${prop}.delete`, args)
              return args.where
            },
            upsert: async (args: any) => {
              console.log(`🌐 Browser Mock: ${prop}.upsert`, args)
              return { ...args.where, ...args.create, ...args.update }
            }
          }
        }
        return target[prop as keyof BrowserPrismaClient]
      }
    })
  }
}

// 检测环境并导出相应的客户端
let PrismaClient: any
let prisma: MockPrismaClient

if (typeof window !== 'undefined' || typeof document !== 'undefined') {
  // 浏览器环境
  console.log('🌐 Using Browser Prisma Client (Mock)')
  PrismaClient = BrowserPrismaClient
  prisma = new BrowserPrismaClient()
} else {
  // Node.js 环境
  try {
    console.log('🖥️ Using Node.js Prisma Client')
    const { PrismaClient: NodePrismaClient } = require('./generated/client')
    PrismaClient = NodePrismaClient

    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient()
    } else {
      if (!(globalThis as any).__prisma) {
        (globalThis as any).__prisma = new PrismaClient({
          log: ['query', 'error', 'warn'],
        })
      }
      prisma = (globalThis as any).__prisma
    }
  } catch (error) {
    console.warn('⚠️ Failed to load Node.js Prisma Client, falling back to mock:', error)
    PrismaClient = BrowserPrismaClient
    prisma = new BrowserPrismaClient()
  }
}

export { PrismaClient, prisma }
export default prisma
