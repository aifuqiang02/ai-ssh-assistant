/**
 * 设置插件示例
 * 展示如何创建一个符合插件接口的组件
 */

import type { SettingPlugin } from './types'
import SettingsAppearance from './SettingsAppearance.vue'

/**
 * 外观设置插件
 * 这是一个符合 SettingPlugin 接口的插件定义
 */
export const AppearancePlugin: SettingPlugin = {
  // 1. 元数据 - 描述这个插件
  metadata: {
    id: 'com.app.settings.appearance',  // 唯一标识，建议用反向域名
    name: 'Appearance',                  // 显示名称
    description: 'Customize app appearance and visual effects',
    icon: 'bi bi-palette',               // 图标
    order: 10,                           // 排序顺序
    section: 'appearance',               // section ID
    i18nKey: 'settings.appearance',      // i18n key 前缀
    enabled: true,                       // 默认启用
    version: '1.0.0'                     // 版本
  },

  // 2. 组件 - UI 部分
  component: SettingsAppearance,

  // 3. 生命周期钩子
  async setup() {

    // 初始化逻辑
    // - 加载用户设置
    // - 初始化主题
    // - 注册事件监听等
  },

  async teardown() {

    // 清理逻辑
    // - 保存未保存的设置
    // - 卸载事件监听
    // - 清理资源等
  },

  // 4. 验证数据
  validate(data: any): boolean {
    return (
      data &&
      data.theme &&
      ['light', 'dark', 'auto'].includes(data.theme) &&
      data.fontSize &&
      ['small', 'medium', 'large'].includes(data.fontSize)
    )
  },

  // 5. 保存数据
  async save(data: any): Promise<void> {
    if (!this.validate?.(data)) {
      throw new Error('Invalid appearance settings')
    }
    
    console.log('💾 Saving appearance settings:', data)
    
    // 调用 API 保存
    // const response = await fetch('/api/settings/appearance', {
    //   method: 'POST',
    //   body: JSON.stringify(data)
    // })
    
    // 或者保存到 localStorage
    localStorage.setItem('appearance-settings', JSON.stringify(data))
  },

  // 6. 加载数据
  async load(): Promise<any> {
    console.log('📥 Loading appearance settings')
    
    // 从 localStorage 读取
    const saved = localStorage.getItem('appearance-settings')
    if (saved) {
      return JSON.parse(saved)
    }
    
    // 或从 API 获取
    // const response = await fetch('/api/settings/appearance')
    // return await response.json()
    
    // 返回默认值
    return {
      theme: 'auto',
      fontSize: 'medium',
      colorScheme: 'default'
    }
  }
}

/**
 * 其他插件示例（模板）
 */

// AI 服务商插件
export const AiProvidersPlugin: SettingPlugin = {
  metadata: {
    id: 'com.app.settings.ai-providers',
    name: 'AI Providers',
    description: 'Configure AI model service providers',
    icon: 'bi bi-robot',
    order: 20,
    section: 'ai-providers',
    i18nKey: 'settings.aiProviders'
  },
  component: () => import('./SettingsAiProviders.vue').then(m => m.default),
  // ... 其他方法
}

// SSH 配置插件
export const SshPlugin: SettingPlugin = {
  metadata: {
    id: 'com.app.settings.ssh',
    name: 'SSH Configuration',
    description: 'Configure SSH connection defaults',
    icon: 'bi bi-terminal',
    order: 50,
    section: 'ssh',
    i18nKey: 'settings.ssh'
  },
  component: () => import('./SettingsSsh.vue').then(m => m.default),
  // ... 其他方法
}

/**
 * 使用示例
 */

// import { settingsPluginRegistry, AppearancePlugin } from './types'
//
// // 注册插件
// settingsPluginRegistry.register(AppearancePlugin)
//
// // 获取所有插件
// const plugins = settingsPluginRegistry.getPlugins()
//
// // 获取特定插件
// const appearance = settingsPluginRegistry.getPlugin('com.app.settings.appearance')
//
// // 调用插件方法
// await appearance?.setup?.()
// const data = await appearance?.load?.()
// if (appearance?.validate?.(data)) {
//   await appearance?.save?.(data)
// }
// await appearance?.teardown?.()
//
// // 获取导航项
// const navItems = settingsPluginRegistry.getNavigationItems()
