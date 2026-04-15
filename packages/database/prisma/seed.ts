import { PrismaClient, UserRole } from '../src/generated/client/index.js'
import * as bcrypt from 'bcryptjs'

const databaseUrl = process.env.CLOUD_DATABASE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Missing CLOUD_DATABASE_URL or DATABASE_URL for Prisma seed')
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function main() {
  console.log('🌱 开始插入种子数据...')

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ai-ssh-assistant.com' },
    update: {},
    create: {
      email: 'admin@ai-ssh-assistant.com',
      username: 'admin',
      password: adminPassword,
      role: UserRole.ADMIN,
      userSettings: {
        create: {
          data: {
            theme: 'dark',
            language: 'zh-CN',
            defaultModel: 'gpt-4'
          }
        }
      }
    }
  })
  console.log('✅ 管理员用户创建完成:', admin.email)

  // 创建测试用户
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@ai-ssh-assistant.com' },
    update: {},
    create: {
      email: 'user@ai-ssh-assistant.com',
      username: 'testuser',
      password: userPassword,
      role: UserRole.USER,
      userSettings: {
        create: {
          data: {
            theme: 'dark',
            language: 'zh-CN',
            defaultModel: 'gpt-3.5-turbo'
          }
        }
      }
    }
  })
  console.log('✅ 测试用户创建完成:', user.email)

  const sshConnection = await prisma.sSHConnection.create({
    data: {
      name: '示例服务器',
      host: '127.0.0.1',
      port: 22,
      username: 'root',
      authType: 'PASSWORD',
      password: 'example-password',
      userId: admin.id,
      meta: {
        description: '示例 SSH 连接',
        tags: ['示例', 'SSH']
      }
    }
  })

  await prisma.commandLog.createMany({
    data: [
      {
        userId: admin.id,
        sshConnectionId: sshConnection.id,
        command: 'echo "welcome"',
        output: 'welcome',
        exitCode: 0,
        duration: 20,
        safetyLevel: 'SAFE',
        metadata: {
          source: 'seed'
        }
      },
      {
        userId: user.id,
        command: 'pwd',
        output: '/home/testuser',
        exitCode: 0,
        duration: 12,
        safetyLevel: 'SAFE',
        metadata: {
          source: 'seed'
        }
      }
    ]
  })
  console.log('✅ 示例 SSH 连接和命令日志创建完成')

  console.log('\n🎉 种子数据插入完成！')
  console.log('\n📋 测试账户信息：')
  console.log('管理员账户:')
  console.log('  邮箱: admin@ai-ssh-assistant.com')
  console.log('  密码: admin123')
  console.log('\n普通用户账户:')
  console.log('  邮箱: user@ai-ssh-assistant.com')
  console.log('  密码: user123')
}

main()
  .catch(e => {
    console.error('❌ 种子数据插入失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
