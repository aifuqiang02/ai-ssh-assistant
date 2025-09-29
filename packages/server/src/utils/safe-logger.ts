import pino from 'pino'

// 创建日志实例
const pinoLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    }
  } : undefined
})

// 类型安全的 logger 包装器
export const logger = {
  error: (...args: any[]) => (pinoLogger.error as any)(...args),
  warn: (...args: any[]) => (pinoLogger.warn as any)(...args),
  info: (...args: any[]) => (pinoLogger.info as any)(...args),
  debug: (...args: any[]) => (pinoLogger.debug as any)(...args),
  trace: (...args: any[]) => (pinoLogger.trace as any)(...args),
  fatal: (...args: any[]) => (pinoLogger.fatal as any)(...args),
  child: (bindings: Record<string, any>) => {
    const childLogger = pinoLogger.child(bindings)
    return {
      error: (...args: any[]) => (childLogger.error as any)(...args),
      warn: (...args: any[]) => (childLogger.warn as any)(...args),
      info: (...args: any[]) => (childLogger.info as any)(...args),
      debug: (...args: any[]) => (childLogger.debug as any)(...args),
      trace: (...args: any[]) => (childLogger.trace as any)(...args),
      fatal: (...args: any[]) => (childLogger.fatal as any)(...args),
    }
  }
}

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
      request.log.info({
        statusCode: reply.statusCode,
        responseTime: reply.getResponseTime()
      }, 'Request completed')
    })

    server.addHook('onError', async (request: any, _reply: any, error: Error) => {
      request.log.error({ error }, 'Request error')
    })
  }
}

// 默认导出
export default logger
