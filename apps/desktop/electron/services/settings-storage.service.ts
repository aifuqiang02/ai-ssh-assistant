/**
 * 设置存储服务
 * 支持本地存储和云端同步
 */

import { app } from 'electron'
import fs from 'fs/promises'
import path from 'path'
import axios from 'axios'

export interface UserSettings {
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
    defaultMode: 'basic' | 'tools'
    autoApproveReadOnly: boolean
    enableChatHistory: boolean
    maxHistoryMessages: number
    commandRiskLevel: 1 | 2 | 3 | 4 | 5
  }
  
  // AI 服务商配置
  aiProviders: any[]
  
  // 编辑器设置
  editor: {
    lineNumbers: boolean
    wordWrap: boolean
    tabSize: number
  }
  
  // 高级设置
  advanced: {
    developerMode: boolean
    storageMode: 'local' | 'cloud' | 'hybrid'
    syncFrequency: 'realtime' | 'moderate' | 'manual'
  }
  
  // 版本信息
  version: string
  lastUpdated: string
}

/**
 * 存储模式
 */
type StorageMode = 'local' | 'cloud' | 'hybrid'

/**
 * 云端存储配置
 */
interface CloudStorageConfig {
  apiEndpoint: string
  userToken: string
}

/**
 * 设置存储服务类
 */
export class SettingsStorageService {
  private settingsFilePath: string
  
  constructor() {
    // 使用应用数据目录存储设置文件
    const userDataPath = app.getPath('userData')
    this.settingsFilePath = path.join(userDataPath, 'app-settings.json')
    console.log('[SettingsStorage] Settings file path:', this.settingsFilePath)
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
        timeout: 30000,
        keepAlive: true,
        defaultPort: 22
      },
      terminal: {
        fontSize: 14,
        cursorStyle: 'block',
        cursorBlink: true
      },
      aiAssistant: {
        defaultMode: 'tools',
        autoApproveReadOnly: false,
        enableChatHistory: true,
        maxHistoryMessages: 10,
        commandRiskLevel: 3
      },
      aiProviders: [],
      editor: {
        lineNumbers: true,
        wordWrap: false,
        tabSize: 2
      },
      advanced: {
        developerMode: false,
        storageMode: 'local',
        syncFrequency: 'moderate'
      },
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }
  }
  
  /**
   * 从本地文件读取设置
   */
  private async readFromLocalFile(): Promise<UserSettings | null> {
    try {
      const data = await fs.readFile(this.settingsFilePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // 文件不存在或读取失败
      return null
    }
  }
  
  /**
   * 写入设置到本地文件
   */
  private async writeToLocalFile(settings: UserSettings): Promise<void> {
    try {
      // 确保目录存在
      await fs.mkdir(path.dirname(this.settingsFilePath), { recursive: true })
      await fs.writeFile(this.settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8')
      console.log('[SettingsStorage] Settings saved to local file')
    } catch (error) {
      console.error('[SettingsStorage] Failed to write settings to file:', error)
      throw error
    }
  }
  
  /**
   * 从云端读取设置
   */
  private async readFromCloud(cloudConfig: CloudStorageConfig | null): Promise<UserSettings | null> {
    if (!cloudConfig) {
      console.warn('[SettingsStorage] No cloud config available')
      return null
    }
    
    const url = `${cloudConfig.apiEndpoint}/settings`
    console.log('[SettingsStorage] 📤 GET Request:', url)
    console.log('[SettingsStorage] Token present:', !!cloudConfig.userToken)
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${cloudConfig.userToken}`
        },
        timeout: 5000
      })
      
      console.log('[SettingsStorage] 📥 GET Response Status:', response.status)
      console.log('[SettingsStorage] Response Data:', {
        success: response.data?.success,
        message: response.data?.message,
        hasSettings: !!response.data?.settings
      })
      
      if (response.data && response.data.settings) {
        console.log('[SettingsStorage] ✅ Settings loaded from cloud')
        return response.data.settings
      }
      
      console.log('[SettingsStorage] ⚠️ No settings in response')
      return null
    } catch (error: any) {
      console.error('[SettingsStorage] ❌ GET Request Failed')
      console.error('[SettingsStorage] Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      })
      return null
    }
  }
  
  /**
   * 写入设置到云端
   */
  private async writeToCloud(settings: UserSettings, cloudConfig: CloudStorageConfig | null): Promise<boolean> {
    if (!cloudConfig) {
      console.warn('[SettingsStorage] No cloud config available')
      return false
    }
    
    const url = `${cloudConfig.apiEndpoint}/settings`
    console.log('[SettingsStorage] 📤 POST Request:', url)
    console.log('[SettingsStorage] Token present:', !!cloudConfig.userToken)
    console.log('[SettingsStorage] Settings size:', JSON.stringify(settings).length, 'bytes')
    
    try {
      const response = await axios.post(
        url,
        { settings },
        {
          headers: {
            'Authorization': `Bearer ${cloudConfig.userToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      )
      
      console.log('[SettingsStorage] 📥 POST Response Status:', response.status)
      console.log('[SettingsStorage] Response Data:', {
        success: response.data?.success,
        message: response.data?.message
      })
      console.log('[SettingsStorage] ✅ Settings saved to cloud')
      return true
    } catch (error: any) {
      console.error('[SettingsStorage] ❌ POST Request Failed')
      console.error('[SettingsStorage] Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      })
      return false
    }
  }
  
  /**
   * 获取设置（根据存储模式）
   */
  async getSettings(storageMode: StorageMode = 'local', cloudConfig: CloudStorageConfig | null = null): Promise<UserSettings> {
    console.log('[SettingsStorage] Getting settings, mode:', storageMode)
    let settings: UserSettings | null = null
    
    switch (storageMode) {
      case 'local':
        // 仅本地存储
        console.log('[SettingsStorage] Using local file storage')
        settings = await this.readFromLocalFile()
        break
        
      case 'cloud':
        // 仅云端存储（失败时降级到本地）
        console.log('[SettingsStorage] Using cloud storage')
        settings = await this.readFromCloud(cloudConfig)
        if (!settings) {
          console.warn('[SettingsStorage] Cloud read failed, falling back to local')
          settings = await this.readFromLocalFile()
        }
        break
        
      case 'hybrid':
        // 混合模式：优先云端，同步到本地
        console.log('[SettingsStorage] Using hybrid storage')
        settings = await this.readFromCloud(cloudConfig)
        if (settings) {
          // 云端读取成功，同步到本地
          await this.writeToLocalFile(settings)
        } else {
          // 云端失败，使用本地
          settings = await this.readFromLocalFile()
        }
        break
    }
    
    // 如果没有设置，返回默认值
    if (!settings) {
      console.log('[SettingsStorage] No settings found, using defaults')
      settings = this.getDefaultSettings()
      // 保存默认设置
      await this.saveSettings(settings, storageMode, cloudConfig)
    }
    console.log('[SettingsStorage]get settings',settings)
    return settings
  }
  
  /**
   * 保存设置（根据存储模式）
   */
  async saveSettings(settings: UserSettings, storageMode: StorageMode = 'local', cloudConfig: CloudStorageConfig | null = null): Promise<void> {
    console.log('[SettingsStorage] Saving settings, mode:', storageMode)
    // 更新时间戳
    settings.lastUpdated = new Date().toISOString()
    
    switch (storageMode) {
      case 'local':
        // 仅本地存储
        console.log('[SettingsStorage] Saving to local file')
        await this.writeToLocalFile(settings)
        break
        
      case 'cloud':
        // 云端存储（同时保留本地缓存）
        console.log('[SettingsStorage] Saving to cloud')
        const cloudSuccess = await this.writeToCloud(settings, cloudConfig)
        
        // ✅ 无论云端是否成功，都保存到本地作为缓存
        await this.writeToLocalFile(settings)
        
        if (!cloudSuccess) {
          console.warn('[SettingsStorage] Cloud write failed, using local cache')
        } else {
          console.log('[SettingsStorage] Cloud saved, local cache updated')
        }
        break
        
      case 'hybrid':
        // 混合模式：同时保存到本地和云端
        console.log('[SettingsStorage] Saving to both local and cloud')
        await this.writeToLocalFile(settings)
        // 云端保存失败不影响本地
        await this.writeToCloud(settings, cloudConfig).catch(err => {
          console.error('[SettingsStorage] Cloud sync failed:', err)
        })
        break
    }
    
    console.log('[SettingsStorage] Settings saved successfully')
  }
  
  /**
   * 导出设置
   */
  async exportSettings(exportPath: string, storageMode: StorageMode = 'local', cloudConfig: CloudStorageConfig | null = null): Promise<void> {
    const settings = await this.getSettings(storageMode, cloudConfig)
    await fs.writeFile(exportPath, JSON.stringify(settings, null, 2), 'utf-8')
  }
  
  /**
   * 导入设置
   */
  async importSettings(importPath: string, storageMode: StorageMode = 'local', cloudConfig: CloudStorageConfig | null = null): Promise<void> {
    const data = await fs.readFile(importPath, 'utf-8')
    const settings = JSON.parse(data) as UserSettings
    await this.saveSettings(settings, storageMode, cloudConfig)
  }
  
  /**
   * 重置设置
   */
  async resetSettings(storageMode: StorageMode = 'local', cloudConfig: CloudStorageConfig | null = null): Promise<void> {
    const defaultSettings = this.getDefaultSettings()
    await this.saveSettings(defaultSettings, storageMode, cloudConfig)
  }
}

