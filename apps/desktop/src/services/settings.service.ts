/**
 * Settings 服务 - 统一接口
 * 仅使用本地存储实现
 */

import { createService } from './base/service-factory'
import { BaseLocalImpl } from './base/base-api-impl'
import type { AIModel } from '../types/ai-providers.types'

// ============= 接口定义 =============
export interface ISettingsService {
  getSettings(): Promise<AppSettings>
  saveSettings(settings: AppSettings): Promise<{ success: boolean }>
  resetSettings(): Promise<{ success: boolean }>
  exportSettings(exportPath: string): Promise<{ success: boolean }>
  importSettings(importPath: string): Promise<{ success: boolean; settings?: AppSettings }>
}

export interface AppSettings {
  // AI 配置
  aiProviders?: AIProviderConfig[]

  // 主题配置
  theme?: 'light' | 'dark' | 'auto'

  // 语言配置
  language?: string

  // 权限配置
  permissionConfig?: PermissionConfig

  // 其他配置...
  [key: string]: any
}

export interface AIProviderConfig {
  id: string
  name: string
  enabled: boolean
  apiKey?: string
  endpoint?: string
  config?: Record<string, any>
  isDefault?: boolean
  models?: AIModel[]
}

export interface PermissionConfig {
  version: string
  lastUpdated: string
  customRules: PermissionRule[]
  modeSettings: {
    plan: {
      enabled: boolean
    }
    build: {
      autoConfirmDangerous: boolean
    }
  }
}

export interface PermissionRule {
  pattern: string
  action: 'allow' | 'deny' | 'ask'
  description?: string
}

// ============= 本地存储实现 =============
class SettingsLocalImpl extends BaseLocalImpl implements ISettingsService {
  private storageKey = 'app-settings'

  async getSettings(): Promise<AppSettings> {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : this.getDefaultSettings()
  }

  async saveSettings(settings: AppSettings): Promise<{ success: boolean }> {
    localStorage.setItem(this.storageKey, JSON.stringify(settings))
    return { success: true }
  }

  async resetSettings(): Promise<{ success: boolean }> {
    localStorage.removeItem(this.storageKey)
    return { success: true }
  }

  async exportSettings(exportPath: string): Promise<{ success: boolean }> {
    const settings = await this.getSettings()
    await window.electronAPI.fs.writeFile(exportPath, JSON.stringify(settings, null, 2))
    return { success: true }
  }

  async importSettings(importPath: string): Promise<{ success: boolean; settings?: AppSettings }> {
    const content = await window.electronAPI.fs.readFile(importPath)
    const settings = JSON.parse(content)
    await this.saveSettings(settings)
    return { success: true, settings }
  }

  private getDefaultSettings(): AppSettings {
    return {
      theme: 'dark',
      language: 'zh-CN'
    }
  }
}

// ============= 默认导出 =============
export const settingsService = createService<ISettingsService>(
  'SettingsService',
  SettingsLocalImpl,
  SettingsLocalImpl
)
