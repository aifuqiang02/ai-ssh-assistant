import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { logger } from '../utils/safe-logger.js'
import { successResponseSchema } from '../schemas/common.schema.js'

export async function systemRoutes(fastify: FastifyInstance) {
  // 获取系统信息
  fastify.get('/info', {
    schema: {
      description: '获取远程服务器系统信息',
      tags: ['系统'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['connectionId'],
        properties: {
          connectionId: { type: 'string' }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: { connectionId: string }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId } = request.query

      logger.info(`Getting system info for connection ${connectionId}`)

      // 模拟系统信息
      const systemInfo = {
        hostname: 'server-001',
        os: {
          name: 'Ubuntu',
          version: '20.04.6 LTS',
          kernel: '5.4.0-91-generic',
          architecture: 'x86_64'
        },
        cpu: {
          model: 'Intel(R) Xeon(R) CPU E5-2686 v4 @ 2.30GHz',
          cores: 4,
          threads: 8,
          usage: Math.floor(Math.random() * 30) + 10 // 10-40%
        },
        memory: {
          total: 8589934592, // 8GB
          available: Math.floor(Math.random() * 4000000000) + 2000000000, // 2-6GB
          used: 0,
          cached: Math.floor(Math.random() * 1000000000) + 500000000,
          buffers: Math.floor(Math.random() * 200000000) + 100000000
        },
        disk: [
          {
            device: '/dev/xvda1',
            mountpoint: '/',
            filesystem: 'ext4',
            total: 21474836480, // 20GB
            used: Math.floor(Math.random() * 10000000000) + 5000000000, // 5-15GB
            available: 0
          }
        ],
        network: [
          {
            interface: 'eth0',
            ip: '10.0.1.100',
            mac: '02:42:ac:11:00:02',
            status: 'up',
            rxBytes: Math.floor(Math.random() * 1000000000),
            txBytes: Math.floor(Math.random() * 1000000000)
          }
        ],
        uptime: Math.floor(Math.random() * 2592000) + 86400, // 1-30 days
        loadAverage: [
          parseFloat((Math.random() * 2).toFixed(2)),
          parseFloat((Math.random() * 2).toFixed(2)),
          parseFloat((Math.random() * 2).toFixed(2))
        ],
        processes: Math.floor(Math.random() * 200) + 100,
        users: Math.floor(Math.random() * 5) + 1,
        lastBootTime: new Date(Date.now() - Math.floor(Math.random() * 2592000000)).toISOString()
      }

      // 计算内存使用情况
      systemInfo.memory.used = systemInfo.memory.total - systemInfo.memory.available
      systemInfo.disk[0].available = systemInfo.disk[0].total - systemInfo.disk[0].used

      return reply.send({
        success: true,
        data: systemInfo
      })
    } catch (error) {
      logger.error('Get system info error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取系统信息失败',
        code: 'GET_SYSTEM_INFO_ERROR'
      })
    }
  })

  // 获取系统性能监控数据
  fastify.get('/performance', {
    schema: {
      description: '获取系统性能监控数据',
      tags: ['系统'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['connectionId'],
        properties: {
          connectionId: { type: 'string' },
          interval: { type: 'integer', minimum: 1, maximum: 3600, default: 60 },
          duration: { type: 'integer', minimum: 60, maximum: 86400, default: 3600 }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: {
      connectionId: string
      interval?: number
      duration?: number
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, interval = 60, duration = 3600 } = request.query

      logger.info(`Getting performance data for connection ${connectionId}`)

      // 生成模拟性能数据
      const dataPoints = Math.floor(duration / interval)
      const now = Date.now()
      
      const performanceData = {
        cpu: [],
        memory: [],
        disk: [],
        network: [],
        timestamp: new Date().toISOString()
      }

      for (let i = 0; i < dataPoints; i++) {
        const timestamp = new Date(now - (dataPoints - i - 1) * interval * 1000).toISOString()
        
        performanceData.cpu.push({
          timestamp,
          usage: Math.floor(Math.random() * 50) + 10,
          user: Math.floor(Math.random() * 30) + 5,
          system: Math.floor(Math.random() * 20) + 5,
          idle: Math.floor(Math.random() * 20) + 70
        })

        performanceData.memory.push({
          timestamp,
          total: 8589934592,
          used: Math.floor(Math.random() * 4000000000) + 2000000000,
          cached: Math.floor(Math.random() * 1000000000) + 500000000,
          buffers: Math.floor(Math.random() * 200000000) + 100000000
        })

        performanceData.disk.push({
          timestamp,
          read: Math.floor(Math.random() * 1000000),
          write: Math.floor(Math.random() * 1000000),
          iops: Math.floor(Math.random() * 1000) + 100
        })

        performanceData.network.push({
          timestamp,
          rxBytes: Math.floor(Math.random() * 10000000),
          txBytes: Math.floor(Math.random() * 10000000),
          rxPackets: Math.floor(Math.random() * 10000),
          txPackets: Math.floor(Math.random() * 10000)
        })
      }

      return reply.send({
        success: true,
        data: performanceData
      })
    } catch (error) {
      logger.error('Get performance data error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取性能数据失败',
        code: 'GET_PERFORMANCE_ERROR'
      })
    }
  })

  // 获取系统进程列表
  fastify.get('/processes', {
    schema: {
      description: '获取系统进程列表',
      tags: ['系统'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['connectionId'],
        properties: {
          connectionId: { type: 'string' },
          sortBy: { type: 'string', enum: ['pid', 'name', 'cpu', 'memory'], default: 'cpu' },
          sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          limit: { type: 'integer', minimum: 1, maximum: 1000, default: 50 }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: {
      connectionId: string
      sortBy?: string
      sortOrder?: string
      limit?: number
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, sortBy = 'cpu', sortOrder = 'desc', limit = 50 } = request.query

      logger.info(`Getting process list for connection ${connectionId}`)

      // 模拟进程列表
      const processes = [
        {
          pid: 1,
          name: 'systemd',
          user: 'root',
          cpu: 0.1,
          memory: 1.2,
          status: 'sleeping',
          startTime: '2024-01-01T00:00:00.000Z',
          command: '/sbin/init'
        },
        {
          pid: 123,
          name: 'nginx',
          user: 'www-data',
          cpu: 15.5,
          memory: 8.3,
          status: 'running',
          startTime: '2024-01-15T10:30:00.000Z',
          command: 'nginx: master process /usr/sbin/nginx'
        },
        {
          pid: 456,
          name: 'node',
          user: 'app',
          cpu: 25.2,
          memory: 12.7,
          status: 'running',
          startTime: '2024-01-20T09:15:00.000Z',
          command: 'node /app/server.js'
        },
        {
          pid: 789,
          name: 'mysql',
          user: 'mysql',
          cpu: 5.8,
          memory: 45.1,
          status: 'sleeping',
          startTime: '2024-01-10T08:00:00.000Z',
          command: 'mysqld --defaults-file=/etc/mysql/my.cnf'
        }
      ]

      // 排序
      processes.sort((a, b) => {
        let compareValue = 0
        switch (sortBy) {
          case 'pid':
            compareValue = a.pid - b.pid
            break
          case 'name':
            compareValue = a.name.localeCompare(b.name)
            break
          case 'cpu':
            compareValue = a.cpu - b.cpu
            break
          case 'memory':
            compareValue = a.memory - b.memory
            break
          default:
            compareValue = a.cpu - b.cpu
        }
        return sortOrder === 'desc' ? -compareValue : compareValue
      })

      const limitedProcesses = processes.slice(0, limit)

      return reply.send({
        success: true,
        data: {
          processes: limitedProcesses,
          total: processes.length,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      logger.error('Get processes error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取进程列表失败',
        code: 'GET_PROCESSES_ERROR'
      })
    }
  })

  // 获取系统服务状态
  fastify.get('/services', {
    schema: {
      description: '获取系统服务状态',
      tags: ['系统'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        required: ['connectionId'],
        properties: {
          connectionId: { type: 'string' },
          filter: { type: 'string', enum: ['all', 'running', 'stopped', 'failed'] }
        }
      }
    },
    preHandler: [fastify.authenticate]
  }, async (request: FastifyRequest<{
    Querystring: {
      connectionId: string
      filter?: string
    }
  }>, reply: FastifyReply) => {
    try {
      const { connectionId, filter } = request.query

      logger.info(`Getting services for connection ${connectionId}, filter: ${filter}`)

      // 模拟服务列表
      const services = [
        {
          name: 'nginx',
          status: 'active',
          enabled: true,
          description: 'A high performance web server and a reverse proxy server',
          since: '2024-01-15T10:30:00.000Z'
        },
        {
          name: 'mysql',
          status: 'active',
          enabled: true,
          description: 'MySQL Community Server',
          since: '2024-01-10T08:00:00.000Z'
        },
        {
          name: 'redis',
          status: 'failed',
          enabled: true,
          description: 'Advanced key-value store',
          since: '2024-01-20T14:15:00.000Z'
        },
        {
          name: 'apache2',
          status: 'inactive',
          enabled: false,
          description: 'The Apache HTTP Server',
          since: null
        }
      ]

      // 根据过滤器过滤服务
      let filteredServices = services
      if (filter && filter !== 'all') {
        filteredServices = services.filter(service => {
          switch (filter) {
            case 'running':
              return service.status === 'active'
            case 'stopped':
              return service.status === 'inactive'
            case 'failed':
              return service.status === 'failed'
            default:
              return true
          }
        })
      }

      return reply.send({
        success: true,
        data: {
          services: filteredServices,
          total: filteredServices.length,
          summary: {
            active: services.filter(s => s.status === 'active').length,
            inactive: services.filter(s => s.status === 'inactive').length,
            failed: services.filter(s => s.status === 'failed').length
          }
        }
      })
    } catch (error) {
      logger.error('Get services error:', error)
      return reply.status(500).send({
        success: false,
        message: '获取服务状态失败',
        code: 'GET_SERVICES_ERROR'
      })
    }
  })
}

