// 共享常量定义

export const APP_NAME = 'AI SSH Assistant'
export const APP_VERSION = '1.0.0'

export const DEFAULT_SSH_PORT = 22
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const COMMAND_TIMEOUT = 30000 // 30秒
export const CONNECTION_TIMEOUT = 10000 // 10秒

export const SUPPORTED_AUTH_TYPES = ['password', 'privateKey', 'agent'] as const

export const AI_MODELS = {
  OPENAI: {
    GPT4: 'gpt-4',
    GPT35: 'gpt-3.5-turbo'
  },
  ANTHROPIC: {
    CLAUDE3_SONNET: 'claude-3-sonnet-20240229',
    CLAUDE3_HAIKU: 'claude-3-haiku-20240307'
  },
  OPENROUTER: {
    GPT4: 'openai/gpt-4',
    GPT35: 'openai/gpt-3.5-turbo',
    CLAUDE3_SONNET: 'anthropic/claude-3-sonnet',
    CLAUDE3_HAIKU: 'anthropic/claude-3-haiku'
  }
} as const

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: '用户名或密码错误',
  CONNECTION_FAILED: '连接失败',
  COMMAND_TIMEOUT: '命令执行超时',
  PERMISSION_DENIED: '权限不足',
  NETWORK_ERROR: '网络连接错误'
} as const
