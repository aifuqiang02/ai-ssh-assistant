import { z } from 'zod'
import { config as dotenvConfig } from 'dotenv'
import { join } from 'path'
import { existsSync } from 'fs'

// 加载环境变量
const envPath = join(process.cwd(), '../../.env')
if (existsSync(envPath)) {
  dotenvConfig({ path: envPath })
} else {
  dotenvConfig() // 尝试默认位置
}

// 环境变量验证 schema
const envSchema = z.object({
  // 基础配置
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  
  // 数据库配置
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // Redis 配置
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  
  // JWT 配置
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  
  // AI 服务配置
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().default('gpt-4'),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-3-sonnet-20240229'),
  
  // 安全配置
  ENCRYPTION_KEY: z.string().length(32, 'Encryption key must be exactly 32 characters'),
  SESSION_SECRET: z.string().min(32, 'Session secret must be at least 32 characters'),
  SESSION_MAX_AGE: z.coerce.number().default(86400),
  
  // CORS 配置
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),
  
  // 限流配置
  RATE_LIMIT_MAX: z.coerce.number().default(1000),
  RATE_LIMIT_WINDOW: z.coerce.number().default(3600),
  
  // 文件上传配置
  UPLOAD_MAX_SIZE: z.coerce.number().default(10 * 1024 * 1024), // 10MB
  UPLOAD_DIR: z.string().default('./uploads'),
  
  // 日志配置
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_DIR: z.string().default('./logs'),
  
  // 邮件配置
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  
  // 监控配置
  ENABLE_METRICS: z.coerce.boolean().default(true),
  METRICS_PORT: z.coerce.number().default(9090),
  
  // 开发配置
  DEBUG: z.coerce.boolean().default(false),
  ENABLE_DOCS: z.coerce.boolean().default(true),
  ENABLE_DEVTOOLS: z.coerce.boolean().default(true)
})

// 验证环境变量
const env = envSchema.parse(process.env)

// 导出配置对象
export const config = {
  // 基础配置
  nodeEnv: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  port: env.PORT,
  host: env.HOST,
  
  // 数据库配置
  databaseUrl: env.DATABASE_URL,
  
  // Redis 配置
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB
  },
  
  // JWT 配置
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  
  // AI 服务配置
  ai: {
    openai: {
      apiKey: env.OPENAI_API_KEY,
      baseUrl: env.OPENAI_BASE_URL,
      model: env.OPENAI_MODEL
    },
    anthropic: {
      apiKey: env.ANTHROPIC_API_KEY,
      model: env.ANTHROPIC_MODEL
    }
  },
  
  // 安全配置
  encryptionKey: env.ENCRYPTION_KEY,
  sessionSecret: env.SESSION_SECRET,
  sessionMaxAge: env.SESSION_MAX_AGE,
  
  // CORS 配置
  corsOrigin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  
  // 限流配置
  rateLimitMax: env.RATE_LIMIT_MAX,
  rateLimitWindow: env.RATE_LIMIT_WINDOW,
  
  // 文件上传配置
  upload: {
    maxSize: env.UPLOAD_MAX_SIZE,
    dir: env.UPLOAD_DIR
  },
  
  // 日志配置
  logLevel: env.LOG_LEVEL,
  logDir: env.LOG_DIR,
  
  // 邮件配置
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM
  },
  
  // 监控配置
  enableMetrics: env.ENABLE_METRICS,
  metricsPort: env.METRICS_PORT,
  
  // 开发配置
  debug: env.DEBUG,
  enableDocs: env.ENABLE_DOCS,
  enableDevtools: env.ENABLE_DEVTOOLS
} as const

// 配置验证函数
export function validateConfig() {
  const errors: string[] = []
  
  // 检查必需的 AI API 密钥
  if (!config.ai.openai.apiKey && !config.ai.anthropic.apiKey) {
    errors.push('At least one AI API key (OpenAI or Anthropic) is required')
  }
  
  // 检查生产环境配置
  if (config.isProd) {
    if (config.enableDocs) {
      console.warn('⚠️  API documentation is enabled in production')
    }
    
    if (config.debug) {
      console.warn('⚠️  Debug mode is enabled in production')
    }
    
    if (!config.smtp.host && !config.smtp.user) {
      console.warn('⚠️  SMTP configuration is missing, email features will not work')
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
  
  return true
}

// 打印配置信息
export function printConfig() {
  console.log('📋 Configuration loaded:')
  console.log(`   Environment: ${config.nodeEnv}`)
  console.log(`   Server: ${config.host}:${config.port}`)
  console.log(`   Database: ${config.databaseUrl.replace(/\/\/.*@/, '//***:***@')}`)
  console.log(`   Redis: ${config.redis.host}:${config.redis.port}/${config.redis.db}`)
  console.log(`   AI Services: ${config.ai.openai.apiKey ? 'OpenAI ✓' : 'OpenAI ✗'} ${config.ai.anthropic.apiKey ? 'Anthropic ✓' : 'Anthropic ✗'}`)
  console.log(`   Features: Docs=${config.enableDocs} Metrics=${config.enableMetrics} Debug=${config.debug}`)
}

