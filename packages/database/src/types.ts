// 数据库类型导出

export type * from './generated/client/index.js'

// 明确导出枚举类型 - 手动定义以确保浏览器兼容性
export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const

export const SSHAuthType = {
  PASSWORD: 'PASSWORD',
  KEY: 'KEY',
  AGENT: 'AGENT'
} as const

export const ConnectionStatus = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  ERROR: 'ERROR'
} as const

export const SessionType = {
  SSH: 'SSH',
  SFTP: 'SFTP',
  TUNNEL: 'TUNNEL'
} as const

export const MessageRole = {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT',
  SYSTEM: 'SYSTEM'
} as const

export const SafetyLevel = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const

export const ApiKeyType = {
  OPENAI: 'OPENAI',
  ANTHROPIC: 'ANTHROPIC',
  GOOGLE: 'GOOGLE',
  AZURE: 'AZURE'
} as const

export const ConfigType = {
  SYSTEM: 'SYSTEM',
  USER: 'USER',
  GLOBAL: 'GLOBAL'
} as const

export const KnowledgeType = {
  DOCUMENT: 'DOCUMENT',
  FAQ: 'FAQ',
  TUTORIAL: 'TUTORIAL',
  REFERENCE: 'REFERENCE'
} as const

export const DocumentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
} as const

// 导出类型版本
export type UserRole = typeof UserRole[keyof typeof UserRole]
export type SSHAuthType = typeof SSHAuthType[keyof typeof SSHAuthType]
export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus]
export type SessionType = typeof SessionType[keyof typeof SessionType]
export type MessageRole = typeof MessageRole[keyof typeof MessageRole]
export type SafetyLevel = typeof SafetyLevel[keyof typeof SafetyLevel]
export type ApiKeyType = typeof ApiKeyType[keyof typeof ApiKeyType]
export type ConfigType = typeof ConfigType[keyof typeof ConfigType]
export type KnowledgeType = typeof KnowledgeType[keyof typeof KnowledgeType]
export type DocumentStatus = typeof DocumentStatus[keyof typeof DocumentStatus]