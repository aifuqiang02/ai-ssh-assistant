/**
 * Settings 服务 - 统一接口
 * 支持本地存储和远程 API 两种实现方式
 */

import { createService } from './base/service-factory'
import { BaseApiImpl, BaseLocalImpl } from './base/base-api-impl'

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
  
  // 其他配置...
  [key: string]: any
}

export interface AIProviderConfig {
  id: string
  name: string
  enabled: boolean
  apiKey?: string
  models?: ModelConfig[]
}

export interface ModelConfig {
  id: string
  name: string
  enabled: boolean
}

// ============= 远程 API 实现 =============
class SettingsApiImpl extends BaseApiImpl implements ISettingsService {
  async getSettings(): Promise<AppSettings> {
    // ✅ 无需传 userId，后端从 token 中解析
    const response: any = await this.get('/settings')
    // 后端返回格式: { success, message, settings }
    // 需要手动提取 settings 字段
    return response.settings || response
  }
  
  async saveSettings(settings: AppSettings): Promise<{ success: boolean }> {
    // ✅ 无需传 userId，后端从 token 中解析
    // 注意：后端期望的格式是 { settings: {...} }
    await this.post('/settings', { settings })
    return { success: true }
  }
  
  async resetSettings(): Promise<{ success: boolean }> {
    // ✅ 无需传 userId，后端从 token 中解析
    await this.delete('/settings')
    return { success: true }
  }
  
  async exportSettings(exportPath: string): Promise<{ success: boolean }> {
    const settings = await this.getSettings()
    // 导出逻辑（本地文件操作需要通过 electron API）
    await window.electronAPI.fs.writeFile(exportPath, JSON.stringify(settings, null, 2))
    return { success: true }
  }
  
  async importSettings(importPath: string): Promise<{ success: boolean; settings?: AppSettings }> {
    const content = await window.electronAPI.fs.readFile(importPath)
    const settings = JSON.parse(content)
    await this.saveSettings(settings)
    return { success: true, settings }
  }
}

// ============= 本地 IPC 实现 =============
class SettingsLocalImpl extends BaseLocalImpl implements ISettingsService {
  async getSettings(): Promise<AppSettings> {
    // ✅ 使用 this.getUserId()，本地模式自动使用 'local-user'
    return this.electronAPI.settings.get(this.getUserId())
  }
  
  async saveSettings(settings: AppSettings): Promise<{ success: boolean }> {
    return this.electronAPI.settings.save(this.getUserId(), settings)
  }
  
  async resetSettings(): Promise<{ success: boolean }> {
    return this.electronAPI.settings.reset(this.getUserId())
  }
  
  async exportSettings(exportPath: string): Promise<{ success: boolean }> {
    return this.electronAPI.settings.export(this.getUserId(), exportPath)
  }
  
  async importSettings(importPath: string): Promise<{ success: boolean; settings?: AppSettings }> {
    return this.electronAPI.settings.import(this.getUserId(), importPath)
  }
}

// ============= 默认导出 =============
export const settingsService = createService<ISettingsService>(
  'SettingsService',
  SettingsLocalImpl,
  SettingsApiImpl
)

