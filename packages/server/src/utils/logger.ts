import pino from 'pino'

const enablePrettyTransport = process.env.NODE_ENV === 'development'

// 创建日志实例
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: enablePrettyTransport
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    : undefined
})

// 导出日志级别类型
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

// 创建子日志器的辅助函数
export const createChildLogger = (name: string, extra?: Record<string, any>) => {
  return logger.child({ name, ...extra })
}

// 日志中间件（用于记录HTTP请求）
export const loggerMiddleware = {
  name: 'logger',
  register: async (server: any) => {
    server.addHook('onRequest', async (request: any) => {
      request.log = createChildLogger('request', {
        reqId: request.id,
        method: request.method,
        url: request.url
      })

      request.log.info('Request started')
    })

    server.addHook('onResponse', async (request: any, reply: any) => {
      request.log.info(
        {
          statusCode: reply.statusCode,
          responseTime: reply.getResponseTime()
        },
        'Request completed'
      )
    })

    server.addHook('onError', async (request: any, _reply: any, error: Error) => {
      request.log.error({ error }, 'Request error')
    })
  }
}

// 默认导出
export default logger
