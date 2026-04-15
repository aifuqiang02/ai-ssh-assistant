/**
 * i18n 配置
 */

import { createI18n } from 'vue-i18n'
import type { Locale } from '@ai-ssh/shared'
import zhCN from './zh-CN'
import enUS from './en-US'

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(), // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
  globalInjection: true, // 全局注入 $t 函数
})

/**
 * 获取默认语言
 */
function getDefaultLocale(): Locale {
  // 从 localStorage 读取
  const savedLocale = localStorage.getItem('locale') as Locale | null
  if (savedLocale && ['zh-CN', 'en-US'].includes(savedLocale)) {
    return savedLocale
  }
  
  // 从浏览器语言推断
  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  if (browserLang.startsWith('en')) {
    return 'en-US'
  }
  
  return 'zh-CN' // 默认中文
}

/**
 * 设置当前语言
 */
export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  
  // 同步到 HTML lang 属性
  document.documentElement.lang = locale
}

/**
 * 获取当前语言
 */
export function getLocale(): Locale {
  return i18n.global.locale.value as Locale
}

export default i18n

