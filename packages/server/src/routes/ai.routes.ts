import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'
import { successResponseSchema } from '../schemas/common.schema.js'

export async function aiRoutes(fastify: FastifyInstance) {
  // AI 聊天
  fastify.post('/chat', {
    schema: {
      description: 'AI 聊天对话',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', minLength: 1, maxLength: 2000 },
          context: {
            type: 'object',
            properties: {
              connectionId: { type: 'string' },
              currentDirectory: { type: 'string' },
              lastCommand: { type: 'string' },
              systemInfo: { type: 'object' }
            }
          },
          model: { type: 'string', enum: ['gpt-3.5-turbo', 'gpt-4', 'claude-3'], default: 'gpt-3.5-turbo' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Body: {
      message: string
      context?: {
        connectionId?: string
        currentDirectory?: string
        lastCommand?: string
        systemInfo?: object
      }
      model?: string
    }
  }>, reply: FastifyReply) => {
    try {
      const { message, context, model = 'gpt-3.5-turbo' } = request.body
      const user = request.user as any


      // 模拟 AI 响应
      const responses = [
        `关于 "${message}"，我建议您可以尝试以下几个方法来解决这个问题：

1. 首先检查系统状态和资源使用情况
2. 查看相关日志文件以获取更多信息
3. 确认服务配置是否正确

如果您需要更具体的帮助，请提供更多详细信息。`,

        `针对您的问题 "${message}"，这里有一些实用的建议：

• 使用 \`htop\` 或 \`top\` 命令监控系统性能
• 通过 \`systemctl status\` 检查服务状态
• 查看 \`/var/log/\` 目录下的相关日志

您想了解哪个方面的更多信息？`,

        `我理解您关于 "${message}" 的询问。基于常见的最佳实践：

→ 定期备份重要数据
→ 保持系统和软件更新
→ 监控安全事件和异常访问
→ 使用强密码和密钥认证

需要我详细解释其中任何一点吗？`
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const aiResponse = {
        id: Date.now().toString(),
        message: randomResponse,
        model,
        context: context || {},
        confidence: 0.85 + Math.random() * 0.1,
        responseTime: Math.floor(Math.random() * 2000) + 500,
        timestamp: new Date().toISOString(),
        suggestions: [
          '查看系统日志',
          '检查服务状态',
          '监控资源使用',
          '备份重要数据'
        ]
      }

      return reply.send({
        success: true,
        data: aiResponse
      })
    } catch (error) {
      logger.error('AI chat error:', error)
      return reply.status(500).send({
        success: false,
        message: 'AI 对话失败',
        code: 'AI_CHAT_ERROR'
      })
    }
  })

  // 命令建议
  fastify.post('/suggest', {
    schema: {
      description: '获取命令建议',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['input'],
        properties: {
          input: { type: 'string', minLength: 1, maxLength: 500 },
          context: {
            type: 'object',
            properties: {
              os: { type: 'string' },
              shell: { type: 'string' },
              currentDirectory: { type: 'string' }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Body: {
      input: string
      context?: {
        os?: string
        shell?: string
        currentDirectory?: string
      }
    }
  }>, reply: FastifyReply) => {
    try {
      const { input, context } = request.body


      // 根据输入生成命令建议
      const suggestions = generateCommandSuggestions(input, context)

      return reply.send({
        success: true,
        data: {
          input,
          suggestions,
          context: context || {},
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      logger.error('Command suggestion error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取命令建议失败',
        code: 'COMMAND_SUGGESTION_ERROR'
      })
    }
  })

  // 日志分析
  fastify.post('/analyze', {
    schema: {
      description: '分析日志或系统信息',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['data', 'type'],
        properties: {
          data: { type: 'string', minLength: 1, maxLength: 10000 },
          type: { type: 'string', enum: ['log', 'performance', 'security', 'error'] },
          options: {
            type: 'object',
            properties: {
              includeRecommendations: { type: 'boolean', default: true },
              severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
            }
          }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Body: {
      data: string
      type: 'log' | 'performance' | 'security' | 'error'
      options?: {
        includeRecommendations?: boolean
        severity?: string
      }
    }
  }>, reply: FastifyReply) => {
    try {
      const { data, type, options = {} } = request.body


      // 模拟分析结果
      const analysis = {
        type,
        summary: `分析了 ${data.length} 字符的${type}数据`,
        findings: [
          {
            severity: 'medium',
            category: type,
            description: '检测到一些需要注意的模式',
            count: Math.floor(Math.random() * 10) + 1
          },
          {
            severity: 'low',
            category: 'performance',
            description: '系统性能正常，无明显异常',
            count: 0
          }
        ],
        recommendations: options.includeRecommendations ? [
          '建议定期监控系统状态',
          '及时处理警告级别的问题',
          '保持日志轮转配置合理'
        ] : [],
        confidence: 0.8 + Math.random() * 0.15,
        processingTime: Math.floor(Math.random() * 3000) + 1000,
        timestamp: new Date().toISOString()
      }

      return reply.send({
        success: true,
        data: analysis
      })
    } catch (error) {
      logger.error('Data analysis error:', error)
      return reply.status(500).send({
        success: false,
        message: '数据分析失败',
        code: 'DATA_ANALYSIS_ERROR'
      })
    }
  })

  // 获取 AI 模型列表
  fastify.get('/models', {
    schema: {
      description: '获取可用的 AI 模型列表',
      tags: ['AI'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const models = [
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: '快速响应，适合日常对话',
          capabilities: ['chat', 'suggestion', 'analysis'],
          status: 'available'
        },
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: '更强的推理能力，适合复杂问题',
          capabilities: ['chat', 'suggestion', 'analysis', 'code-review'],
          status: 'available'
        },
        {
          id: 'claude-3',
          name: 'Claude-3',
          description: '擅长分析和总结',
          capabilities: ['chat', 'analysis', 'summarization'],
          status: 'maintenance'
        }
      ]

      return reply.send({
        success: true,
        data: models
      })
    } catch (error) {
      logger.error('Get AI models error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取模型列表失败',
        code: 'GET_MODELS_ERROR'
      })
    }
  })
}

// 生成命令建议的辅助函数
function generateCommandSuggestions(input: string, context?: any): any[] {
  const suggestions = []
  const lowerInput = input.toLowerCase()

  // 基于输入内容生成建议
  if (lowerInput.includes('查看') || lowerInput.includes('看') || lowerInput.includes('list')) {
    suggestions.push(
      { command: 'ls -la', description: '显示详细的文件列表' },
      { command: 'ps aux', description: '查看运行的进程' },
      { command: 'df -h', description: '查看磁盘使用情况' },
      { command: 'free -m', description: '查看内存使用情况' }
    )
  }

  if (lowerInput.includes('日志') || lowerInput.includes('log')) {
    suggestions.push(
      { command: 'tail -f /var/log/syslog', description: '实时查看系统日志' },
      { command: 'journalctl -f', description: '查看 systemd 日志' },
      { command: 'grep ERROR /var/log/*', description: '搜索错误日志' }
    )
  }

  if (lowerInput.includes('网络') || lowerInput.includes('network')) {
    suggestions.push(
      { command: 'netstat -tulpn', description: '查看网络连接' },
      { command: 'ss -tulpn', description: '查看套接字状态' },
      { command: 'iptables -L', description: '查看防火墙规则' }
    )
  }

  if (lowerInput.includes('性能') || lowerInput.includes('performance')) {
    suggestions.push(
      { command: 'htop', description: '交互式进程查看器' },
      { command: 'iotop', description: '查看磁盘 I/O' },
      { command: 'sar -u 1 5', description: '查看 CPU 使用率' }
    )
  }

  // 如果没有特定匹配，返回通用建议
  if (suggestions.length === 0) {
    suggestions.push(
      { command: 'pwd', description: '显示当前目录' },
      { command: 'whoami', description: '显示当前用户' },
      { command: 'uname -a', description: '显示系统信息' },
      { command: 'date', description: '显示当前时间' }
    )
  }

  return suggestions.slice(0, 5) // 最多返回5个建议
}

