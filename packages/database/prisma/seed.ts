import { PrismaClient, UserRole } from '../src/generated/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
      settings: {
        theme: 'dark',
        language: 'zh-CN',
        defaultModel: 'gpt-4'
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
      settings: {
        theme: 'dark',
        language: 'zh-CN',
        defaultModel: 'gpt-3.5-turbo'
      }
    }
  })
  console.log('✅ 测试用户创建完成:', user.email)

  // 创建系统配置
  const systemConfigs = [
    {
      key: 'max_connections_per_user',
      value: '10',
      type: 'NUMBER' as const,
      description: '每个用户最大SSH连接数',
      category: 'limits',
      isPublic: false
    },
    {
      key: 'max_daily_commands',
      value: '1000',
      type: 'NUMBER' as const,
      description: '每日最大命令执行数',
      category: 'limits',
      isPublic: false
    },
    {
      key: 'ai_model_default',
      value: 'gpt-4',
      type: 'STRING' as const,
      description: '默认AI模型',
      category: 'ai',
      isPublic: true
    },
    {
      key: 'enable_command_logging',
      value: 'true',
      type: 'BOOLEAN' as const,
      description: '启用命令日志记录',
      category: 'security',
      isPublic: false
    },
    {
      key: 'session_timeout',
      value: '86400',
      type: 'NUMBER' as const,
      description: '会话超时时间（秒）',
      category: 'security',
      isPublic: false
    },
    {
      key: 'supported_models',
      value: JSON.stringify([
        'gpt-4',
        'gpt-3.5-turbo',
        'claude-3-sonnet',
        'claude-3-haiku'
      ]),
      type: 'JSON' as const,
      description: '支持的AI模型列表',
      category: 'ai',
      isPublic: true
    }
  ]

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config
    })
  }
  console.log('✅ 系统配置创建完成')

  // 创建示例会话组
  const defaultGroup = await prisma.sessionGroup.upsert({
    where: { id: 'default-group-' + admin.id },
    update: {},
    create: {
      id: 'default-group-' + admin.id,
      name: '默认分组',
      sort: 0,
      userId: admin.id,
      meta: {
        description: '默认的会话分组',
        color: '#007acc'
      }
    }
  })
  console.log('✅ 默认会话组创建完成:', defaultGroup.name)

  // 创建示例聊天会话
  const chatSession = await prisma.chatSession.create({
    data: {
      title: '欢迎使用 AI SSH 助手',
      model: 'gpt-4',
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
        tokens: 150,
        fromModel: 'gpt-4',
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
