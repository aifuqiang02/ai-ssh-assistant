/**
 * i18next 配置
 */

import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import type { Locale } from '@ai-ssh/shared'

// ESM 模式下获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 初始化 i18next
 */
export async function initI18n() {
  await i18next.use(Backend).init({
    lng: 'zh-CN', // 默认语言
    fallbackLng: 'zh-CN', // 回退语言
    preload: ['zh-CN', 'en-US'], // 预加载语言

    // 命名空间
    ns: ['common', 'auth', 'ssh', 'file', 'error'],
    defaultNS: 'common',

    // 后端配置
    backend: {
      // 翻译文件路径：locales/{{lng}}/{{ns}}.json
      loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json')
    },

    // 插值配置
    interpolation: {
      escapeValue: false // 不转义 HTML
    },

    // 调试模式
    debug: process.env.NODE_ENV === 'development'
  })
}

/**
 * 翻译函数
 */
export function t(key: string, options?: any): string {
  return i18next.t(key, options) as string
}

/**
 * 设置当前语言
 */
export function setLanguage(locale: Locale) {
  i18next.changeLanguage(locale)
}

/**
 * 获取当前语言
 */
export function getLanguage(): Locale {
  return i18next.language as Locale
}

/**
 * 创建翻译中间件（用于 Fastify）
 * 从请求头中读取 Accept-Language 并设置语言
 */
export function i18nMiddleware(req: any, _reply: any, done: any) {
  const acceptLanguage = req.headers['accept-language']

  if (acceptLanguage) {
    // 解析 Accept-Language 头
    const lang = acceptLanguage.split(',')[0].split(';')[0].trim()

    // 映射到支持的语言
    let locale: Locale = 'zh-CN'
    if (lang.startsWith('en')) {
      locale = 'en-US'
    } else if (lang.startsWith('zh')) {
      locale = 'zh-CN'
    }

    // 设置当前请求的语言
    req.locale = locale
    setLanguage(locale)
  } else {
    req.locale = 'zh-CN'
  }

  done()
}

export default i18next
