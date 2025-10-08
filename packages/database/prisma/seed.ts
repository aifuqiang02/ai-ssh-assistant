import { PrismaClient, UserRole } from '../src/generated/client-postgresql/index.js'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.CLOUD_DATABASE_URL || 'postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant'
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

  // 创建示例聊天会话
  const chatSession = await prisma.chatSession.create({
    data: {
      title: '欢迎使用 AI SSH 助手',
      type: 'CHAT',
      userId: admin.id,
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        systemRole: '你是一个专业的Linux系统管理助手，帮助用户管理远程服务器。'
      },
      meta: {
        description: '这是一个示例会话',
        tags: ['示例', '欢迎']
      }
    }
  })

  // 创建欢迎消息
  await prisma.message.createMany({
    data: [
      {
        sessionId: chatSession.id,
        userId: admin.id,
        role: 'SYSTEM',
        content: '欢迎使用 AI SSH 助手！我可以帮助你管理远程服务器。'
      },
      {
        sessionId: chatSession.id,
        userId: admin.id,
        role: 'USER',
        content: '你好，请介绍一下你的功能。'
      },
      {
        sessionId: chatSession.id,
        userId: admin.id,
        role: 'ASSISTANT',
        content: '你好！我是 AI SSH 助手，可以帮助你：\n\n1. 🔗 管理SSH连接\n2. 💻 执行远程命令\n3. 📊 分析系统状态\n4. 🛡️ 提供安全建议\n5. 🤖 智能命令生成\n\n请告诉我你想要做什么，我会为你提供帮助！',
        extra: {
          model: 'gpt-4',
          provider: 'openai'
        }
      }
    ]
  })
  console.log('✅ 示例聊天会话创建完成')

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
  .catch((e) => {
    console.error('❌ 种子数据插入失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
