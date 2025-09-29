import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'

export async function sshRoutes(fastify: FastifyInstance) {
  // 获取 SSH 连接列表
  fastify.get('/connections', {
    schema: {
      description: '获取 SSH 连接列表',
      tags: ['SSH'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as any
      
      // 模拟连接列表
      const connections = [
        {
          id: '1',
          name: '生产服务器',
          host: '192.168.1.100',
          port: 22,
          username: 'root',
          status: 'connected',
          lastConnected: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          name: '测试服务器',
          host: '192.168.1.101',
          port: 22,
          username: 'admin',
          status: 'disconnected',
          lastConnected: '2024-01-10T10:30:00.000Z',
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      ]

      return reply.send({
        success: true,
        data: connections
      })
    } catch (error) {
      logger.error('Get SSH connections error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取连接列表失败',
        code: 'GET_CONNECTIONS_ERROR'
      })
    }
  })

  // 创建 SSH 连接
  fastify.post('/connections', {
    schema: {
      description: '创建 SSH 连接',
      tags: ['SSH'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'host', 'username'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          host: { type: 'string', minLength: 1, maxLength: 255 },
          port: { type: 'integer', minimum: 1, maximum: 65535, default: 22 },
          username: { type: 'string', minLength: 1, maxLength: 100 },
          password: { type: 'string', maxLength: 255 },
          privateKey: { type: 'string' },
          description: { type: 'string', maxLength: 500 }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{ 
    Body: {
      name: string
      host: string
      port?: number
      username: string
      password?: string
      privateKey?: string
      description?: string
    }
  }>, reply: FastifyReply) => {
    try {
      const user = request.user as any
      const connectionData = request.body

      logger.info(`User ${user.username} creating SSH connection: ${connectionData.name}`)

      const newConnection = {
        id: Date.now().toString(),
        ...connectionData,
        port: connectionData.port || 22,
        status: 'disconnected',
        createdAt: new Date().toISOString(),
        userId: user.userId
      }

      return reply.status(201).send({
        success: true,
        message: 'SSH 连接创建成功',
        data: newConnection
      })
    } catch (error) {
      logger.error('Create SSH connection error:', error)
      return reply.status(500).send({
        success: false,
        message: '创建连接失败',
        code: 'CREATE_CONNECTION_ERROR'
      })
    }
  })

  // 测试 SSH 连接
  fastify.post('/connections/test', {
    schema: {
      description: '测试 SSH 连接',
      tags: ['SSH'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['host', 'username'],
        properties: {
          host: { type: 'string' },
          port: { type: 'integer', default: 22 },
          username: { type: 'string' },
          password: { type: 'string' },
          privateKey: { type: 'string' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Body: {
      host: string
      port?: number
      username: string
      password?: string
      privateKey?: string
    }
  }>, reply: FastifyReply) => {
    try {
      const { host, port = 22, username } = request.body

      logger.info(`Testing SSH connection to ${username}@${host}:${port}`)

      // 模拟连接测试
      const testResult = {
        success: Math.random() > 0.3, // 70% 成功率
        responseTime: Math.floor(Math.random() * 1000) + 100,
        serverInfo: {
          os: 'Linux Ubuntu 20.04',
          kernel: '5.4.0-91-generic',
          uptime: '15 days, 3 hours, 25 minutes'
        }
      }

      if (testResult.success) {
        return reply.send({
          success: true,
          message: 'SSH 连接测试成功',
          data: testResult
        })
      } else {
        return reply.status(400).send({
          success: false,
          message: 'SSH 连接测试失败',
          code: 'CONNECTION_TEST_FAILED'
        })
      }
    } catch (error) {
      logger.error('Test SSH connection error:', error)
      return reply.status(500).send({
        success: false,
        message: '连接测试失败',
        code: 'CONNECTION_TEST_ERROR'
      })
    }
  })

  // 执行命令
  fastify.post('/execute', {
    schema: {
      description: '在 SSH 连接上执行命令',
      tags: ['SSH'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['connectionId', 'command'],
        properties: {
          connectionId: { type: 'string' },
          command: { type: 'string', minLength: 1, maxLength: 1000 },
          timeout: { type: 'integer', minimum: 1, maximum: 300, default: 30 }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Body: {
      connectionId: string
      command: string
      timeout?: number
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, command, timeout = 30 } = request.body

      logger.info(`Executing command on connection ${connectionId}: ${command}`)

      // 模拟命令执行
      const executionResult = {
        command,
        output: `Executed: ${command}\nExample output for demonstration`,
        error: '',
        exitCode: 0,
        executionTime: Math.floor(Math.random() * 1000) + 100,
        timestamp: new Date().toISOString()
      }

      return reply.send({
        success: true,
        message: '命令执行成功',
        data: executionResult
      })
    } catch (error) {
      logger.error('Execute command error:', error)
      return reply.status(500).send({
        success: false,
        message: '命令执行失败',
        code: 'COMMAND_EXECUTION_ERROR'
      })
    }
  })

  // 获取命令历史
  fastify.get('/history', {
    schema: {
      description: '获取命令执行历史',
      tags: ['SSH'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          connectionId: { type: 'string' },
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: {
      connectionId?: string
      page?: number
      limit?: number
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, page = 1, limit = 20 } = request.query

      // 模拟历史记录
      const history = [
        {
          id: '1',
          connectionId: '1',
          command: 'ls -la',
          output: 'total 24\ndrwxr-xr-x 3 user user 4096 Jan 20 10:30 .',
          exitCode: 0,
          executionTime: 150,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          connectionId: '1',
          command: 'ps aux',
          output: 'USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND',
          exitCode: 0,
          executionTime: 200,
          timestamp: new Date(Date.now() - 60000).toISOString()
        }
      ]

      const filteredHistory = connectionId 
        ? history.filter(h => h.connectionId === connectionId)
        : history

      const total = filteredHistory.length
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedHistory = filteredHistory.slice(startIndex, endIndex)

      return reply.send({
        success: true,
        data: {
          history: paginatedHistory,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      logger.error('Get command history error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取命令历史失败',
        code: 'GET_HISTORY_ERROR'
      })
    }
  })
}

