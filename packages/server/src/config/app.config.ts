import { z } from 'zod'
import { config as dotenvConfig } from 'dotenv'
import { join } from 'path'
import { existsSync } from 'fs'
import { logger } from '../utils/safe-logger.js'

const booleanFromEnv = (defaultValue: boolean) =>
  z
    .union([z.boolean(), z.string()])
    .optional()
    .transform(value => {
      if (value === undefined) {
        return defaultValue
      }

      if (typeof value === 'boolean') {
        return value
      }

      const normalized = value.trim().toLowerCase()
      if (['1', 'true', 'yes', 'on'].includes(normalized)) {
        return true
      }

      if (['0', 'false', 'no', 'off'].includes(normalized)) {
        return false
      }

      return defaultValue
    })

// 加载环境变量（仅使用 packages/server/.env）
const envPaths = [
  join(process.cwd(), '.env') // packages/server/.env
]

let envLoaded = false
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenvConfig({ path: envPath })
    envLoaded = true
    break
  }
}

if (!envLoaded) {
  // 尝试默认位置（当前工作目录）
  dotenvConfig()
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

  // 安全配置
  ENCRYPTION_KEY: z.string().length(32, 'Encryption key must be exactly 32 characters'),
  SESSION_SECRET: z.string().min(32, 'Session secret must be at least 32 characters'),
  SESSION_MAX_AGE: z.coerce.number().default(86400),

  // CORS 配置
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),

  // 限流配置
  RATE_LIMIT_MAX: z.coerce.number().default(1000),
  RATE_LIMIT_WINDOW: z.coerce.number().default(3600),

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
  ENABLE_METRICS: booleanFromEnv(true),
  METRICS_PORT: z.coerce.number().default(9090),

  // 开发配置
  DEBUG: booleanFromEnv(false),
  ENABLE_DOCS: booleanFromEnv(true),
  ENABLE_DEVTOOLS: booleanFromEnv(true),

  // 官方托管 AI 配置
  OFFICIAL_AI_ENABLED: booleanFromEnv(true),
  OFFICIAL_AI_BASE_URL: z.string().default('http://151.245.90.96:3000/v1'),
  OFFICIAL_AI_API_KEY: z.string().optional(),
  OFFICIAL_AI_TIMEOUT_MS: z.coerce.number().default(60000),
  OFFICIAL_AI_MODELS: z.string().default('MiniMax-M2.7-highspeed,MiniMax-M2.7'),
  OFFICIAL_AI_TIMEZONE: z.string().default('Asia/Shanghai'),

  // 启动时自动数据库迁移
  AUTO_MIGRATE: booleanFromEnv(true)
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

  // 安全配置
  encryptionKey: env.ENCRYPTION_KEY,
  sessionSecret: env.SESSION_SECRET,
  sessionMaxAge: env.SESSION_MAX_AGE,

  // CORS 配置
  corsOrigin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),

  // 限流配置
  rateLimitMax: env.RATE_LIMIT_MAX,
  rateLimitWindow: env.RATE_LIMIT_WINDOW,

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
  enableDevtools: env.ENABLE_DEVTOOLS,

  // 官方托管 AI 配置
  officialAi: {
    enabled: env.OFFICIAL_AI_ENABLED,
    baseUrl: env.OFFICIAL_AI_BASE_URL,
    apiKey: env.OFFICIAL_AI_API_KEY,
    timeoutMs: env.OFFICIAL_AI_TIMEOUT_MS,
    models: env.OFFICIAL_AI_MODELS.split(',')
      .map(model => model.trim())
      .filter(Boolean),
    timezone: env.OFFICIAL_AI_TIMEZONE
  },

  // 启动时自动数据库迁移
  autoMigrate: env.AUTO_MIGRATE
} as const

// 配置验证函数
export function validateConfig() {
  // 检查生产环境配置
  if (config.isProd) {
    if (config.enableDocs) {
      logger.warn('API documentation is enabled in production')
    }

    if (config.debug) {
      logger.warn('Debug mode is enabled in production')
    }

    if (!config.smtp.host && !config.smtp.user) {
      logger.warn('SMTP configuration is missing, email features will not work')
    }
  }

  return true
}

// 打印配置信息
export function printConfig() {
  logger.info(
    {
      environment: config.nodeEnv,
      server: `${config.host}:${config.port}`,
      database: config.databaseUrl.replace(/\/\/.*@/, '//***:***@'),
      redis: `${config.redis.host}:${config.redis.port}/${config.redis.db}`,
      features: {
        docs: config.enableDocs,
        metrics: config.enableMetrics,
        debug: config.debug,
        officialAi: config.officialAi.enabled
      }
    },
    'Configuration loaded'
  )
}
