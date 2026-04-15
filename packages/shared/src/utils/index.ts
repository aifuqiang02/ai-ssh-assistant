// 共享工具函数

import { nanoid } from 'nanoid'

export const generateId = () => nanoid()

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // 至少8位，包含字母和数字
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

export const sanitizeCommand = (command: string): string => {
  // 移除危险字符
  return command.replace(/[;&|`$()]/g, '')
}

export const isValidHost = (host: string): boolean => {
  // 简单的主机名或IP验证
  const hostRegex = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$|^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  return hostRegex.test(host)
}
