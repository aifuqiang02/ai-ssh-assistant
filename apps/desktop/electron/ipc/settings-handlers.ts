/**
 * 设置管理 IPC 处理器
 * 负责处理设置的读写、迁移、导入导出等操作
 */

import { ipcMain, app } from 'electron'
import type { StorageManager } from '@repo/database'
import fs from 'fs/promises'
import path from 'path'

interface UserSettings {
  // 外观设置
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    fontSize: 'small' | 'medium' | 'large'
    colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  }
  
  // SSH 设置
  ssh: {
    timeout: number
    keepAlive: boolean
    defaultPort: number
  }
  
  // 终端设置
  terminal: {
    fontSize: number
    cursorStyle: 'block' | 'underline' | 'bar'
    cursorBlink: boolean
  }
  
  // AI 助手设置
  aiAssistant: {
    autoApproveReadOnly: boolean
    commandRiskLevel: number
    enableChatHistory: boolean
    maxHistoryMessages: number
  }
  
  // AI 服务商配置
  aiProviders: any[]
  
  // 高级设置
  advanced: {
    autoConnect: boolean
    saveCommandHistory: boolean
    developerMode: boolean
    storageMode: 'local' | 'cloud' | 'hybrid'
    syncFrequency: 'realtime' | 'moderate' | 'conservative'
  }
  
  // 数据存储配置
  storage: {
    mode: 'local' | 'cloud' | 'hybrid'
    cloudProvider?: string
    lastSyncTime?: string
  }
  
  // 版本信息
  version: string
  lastUpdated: string
}

class SettingsManager {
  private storage: StorageManager | null
  private currentUserId: string | null = null
  private settingsFilePath: string
  
  constructor(storage: StorageManager | null) {
    this.storage = storage
    // 使用应用数据目录存储设置文件
    const userDataPath = app.getPath('userData')
    this.settingsFilePath = path.join(userDataPath, 'app-settings.json')
    console.log('[SettingsManager] Settings file path:', this.settingsFilePath)
  }
  
  /**
   * 设置当前用户ID
   */
  setCurrentUser(userId: string | null) {
    this.currentUserId = userId
    console.log('[SettingsManager] Current user set to:', userId)
  }
  
  /**
   * 从文件读取设置（后备方案）
   */
  private async readSettingsFromFile(): Promise<UserSettings | null> {
    try {
      const data = await fs.readFile(this.settingsFilePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // 文件不存在或读取失败
      return null
    }
  }
  
  /**
   * 写入设置到文件（后备方案）
   */
  private async writeSettingsToFile(settings: UserSettings): Promise<void> {
    try {
      // 确保目录存在
      await fs.mkdir(path.dirname(this.settingsFilePath), { recursive: true })
      await fs.writeFile(this.settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8')
    } catch (error) {
      console.error('[SettingsManager] Failed to write settings to file:', error)
      throw error
    }
  }
  
  /**
   * 获取用户设置
   */
  async getSettings(): Promise<UserSettings> {
    // 如果没有数据库，使用文件存储
    if (!this.storage) {
      console.log('[SettingsManager] Using file storage (no database)')
      const settings = await this.readSettingsFromFile()
      return settings || this.getDefaultSettings()
    }
    
    // 如果没有登录用户，返回默认设置
    if (!this.currentUserId) {
      console.log('[SettingsManager] No user logged in, returning default settings')
      return this.getDefaultSettings()
    }
    
    try {
      const user = await this.storage.findUnique('User', {
        where: { id: this.currentUserId },
        select: { settings: true }
      })
      
      if (user?.settings) {
        console.log('[SettingsManager] Settings loaded from database for user:', this.currentUserId)
        return user.settings as UserSettings
      }
      
      console.log('[SettingsManager] No settings found, returning defaults')
      return this.getDefaultSettings()
    } catch (error) {
      console.error('[SettingsManager] Failed to get settings:', error)
      return this.getDefaultSettings()
    }
  }
  
  /**
   * 保存用户设置
   */
  async saveSettings(settings: Partial<UserSettings>): Promise<void> {
    // 如果没有数据库，使用文件存储
    if (!this.storage) {
      console.log('[SettingsManager] Saving to file storage (no database)')
      try {
        const currentSettings = await this.getSettings()
        const mergedSettings = {
          ...currentSettings,
          ...settings,
          version: '1.0.0',
          lastUpdated: new Date().toISOString()
        }
        await this.writeSettingsToFile(mergedSettings)
        console.log('[SettingsManager] Settings saved to file successfully')
        return
      } catch (error) {
        console.error('[SettingsManager] Failed to save settings to file:', error)
        throw error
      }
    }
    
    // 数据库存储需要用户登录
    if (!this.currentUserId) {
      console.warn('[SettingsManager] No user logged in, settings not saved')
      throw new Error('No user logged in')
    }
    
    try {
      // 获取当前设置并合并
      const currentSettings = await this.getSettings()
      const mergedSettings = {
        ...currentSettings,
        ...settings,
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      }
      
      await this.storage.update('User', {
        where: { id: this.currentUserId },
        data: {
          settings: mergedSettings,
          updatedAt: new Date()
        }
      })
      
      console.log('[SettingsManager] Settings saved successfully for user:', this.currentUserId)
    } catch (error) {
      console.error('[SettingsManager] Failed to save settings:', error)
      throw error
    }
  }
  
  /**
   * 重置为默认设置
   */
  async resetSettings(): Promise<UserSettings> {
    const defaultSettings = this.getDefaultSettings()
    
    if (this.currentUserId) {
      try {
        await this.saveSettings(defaultSettings)
        console.log('[SettingsManager] Settings reset to defaults')
      } catch (error) {
        console.error('[SettingsManager] Failed to reset settings:', error)
      }
    }
    
    return defaultSettings
  }
  
  /**
   * 导出设置为 JSON
   */
  async exportSettings(): Promise<string> {
    const settings = await this.getSettings()
    return JSON.stringify(settings, null, 2)
  }
  
  /**
   * 导入设置
   */
  async importSettings(settingsJson: string): Promise<void> {
    try {
      const settings = JSON.parse(settingsJson) as UserSettings
      await this.saveSettings(settings)
      console.log('[SettingsManager] Settings imported successfully')
    } catch (error) {
      console.error('[SettingsManager] Failed to import settings:', error)
      throw new Error('Invalid settings JSON')
    }
  }
  
  /**
   * 从 localStorage 迁移数据
   */
  async migrateFromLocalStorage(localData: any): Promise<void> {
    try {
      const migratedSettings = this.convertLocalStorageToSettings(localData)
      await this.saveSettings(migratedSettings)
      console.log('[SettingsManager] ✅ Successfully migrated from localStorage')
    } catch (error) {
      console.error('[SettingsManager] Failed to migrate from localStorage:', error)
      throw error
    }
  }
  
  /**
   * 转换 localStorage 数据为新格式
   */
  private convertLocalStorageToSettings(localData: any): UserSettings {
    return {
      appearance: {
        theme: localData.theme || 'auto',
        fontSize: localData.fontSize || 'medium',
        colorScheme: localData.colorScheme || 'blue'
      },
      ssh: {
        timeout: localData.sshTimeout || 30,
        keepAlive: localData.keepAlive !== undefined ? localData.keepAlive : true,
        defaultPort: localData.defaultSSHPort || 22
      },
      terminal: {
        fontSize: localData.terminalFontSize || 14,
        cursorStyle: localData.cursorStyle || 'block',
        cursorBlink: localData.cursorBlink !== undefined ? localData.cursorBlink : true
      },
      aiAssistant: {
        autoApproveReadOnly: localData.autoApproveReadOnly !== undefined ? localData.autoApproveReadOnly : true,
        commandRiskLevel: localData.commandRiskLevel !== undefined ? localData.commandRiskLevel : 2,
        enableChatHistory: localData.enableChatHistory !== undefined ? localData.enableChatHistory : true,
        maxHistoryMessages: localData.maxHistoryMessages || 50
      },
      aiProviders: [], // AI Providers 需要单独处理
      advanced: {
        autoConnect: localData.autoConnect || false,
        saveCommandHistory: localData.saveCommandHistory !== undefined ? localData.saveCommandHistory : true,
        developerMode: localData.developerMode || false,
        storageMode: localData.storageMode || 'local',
        syncFrequency: localData.syncFrequency || 'moderate'
      },
      storage: {
        mode: localData.storageMode || 'local'
      },
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }
  }
  
  /**
   * 获取默认设置
   */
  private getDefaultSettings(): UserSettings {
    return {
      appearance: {
        theme: 'auto',
        fontSize: 'medium',
        colorScheme: 'blue'
      },
      ssh: {
        timeout: 30,
        keepAlive: true,
        defaultPort: 22
      },
      terminal: {
        fontSize: 14,
        cursorStyle: 'block',
        cursorBlink: true
      },
      aiAssistant: {
        autoApproveReadOnly: true,
        commandRiskLevel: 2,
        enableChatHistory: true,
        maxHistoryMessages: 50
      },
      aiProviders: [],
      advanced: {
        autoConnect: false,
        saveCommandHistory: true,
        developerMode: false,
        storageMode: 'local',
        syncFrequency: 'moderate'
      },
      storage: {
        mode: 'local'
      },
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }
  }
}

let settingsManager: SettingsManager | null = null

/**
 * 注册设置相关的 IPC 处理器
 */
export function registerSettingsHandlers(storage: StorageManager | null) {
  settingsManager = new SettingsManager(storage)
  
  // 获取设置
  ipcMain.handle('settings:get', async () => {
    try {
      return await settingsManager!.getSettings()
    } catch (error) {
      console.error('[IPC] settings:get error:', error)
      throw error
    }
  })
  
  // 保存设置
  ipcMain.handle('settings:save', async (_, settings: Partial<UserSettings>) => {
    try {
      await settingsManager!.saveSettings(settings)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:save error:', error)
      throw error
    }
  })
  
  // 重置设置
  ipcMain.handle('settings:reset', async () => {
    try {
      return await settingsManager!.resetSettings()
    } catch (error) {
      console.error('[IPC] settings:reset error:', error)
      throw error
    }
  })
  
  // 导出设置
  ipcMain.handle('settings:export', async () => {
    try {
      return await settingsManager!.exportSettings()
    } catch (error) {
      console.error('[IPC] settings:export error:', error)
      throw error
    }
  })
  
  // 导入设置
  ipcMain.handle('settings:import', async (_, settingsJson: string) => {
    try {
      await settingsManager!.importSettings(settingsJson)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:import error:', error)
      throw error
    }
  })
  
  // 设置当前用户
  ipcMain.on('settings:set-user', (_, userId: string | null) => {
    settingsManager!.setCurrentUser(userId)
  })
  
  // 从 localStorage 迁移
  ipcMain.handle('settings:migrate-from-localstorage', async (_, localData: any) => {
    try {
      await settingsManager!.migrateFromLocalStorage(localData)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:migrate error:', error)
      throw error
    }
  })
  
  console.log('[IPC] Settings handlers registered')
}

/**
 * 获取设置管理器实例（用于其他模块）
 */
export function getSettingsManager(): SettingsManager | null {
  return settingsManager
}

