/**
 * 设置管理 IPC 处理器
 * 负责处理设置的读写、导出导入等操作
 */

import { ipcMain } from 'electron'
import { SettingsStorageService, type UserSettings } from '../services/settings-storage.service'

// 创建全局设置存储服务实例
const settingsStorage = new SettingsStorageService()

/**
 * 注册所有设置相关的 IPC 处理器
 */
export function registerSettingsHandlers() {
  console.log('[IPC] Registering Settings handlers...')
  
  // 设置存储模式
  ipcMain.handle('settings:set-storage-mode', async (_event, mode: 'local' | 'cloud' | 'hybrid') => {
    try {
      settingsStorage.setStorageMode(mode)
      return { success: true }
    } catch (error) {
      console.error('[IPC] Error in settings:set-storage-mode:', error)
      throw error
    }
  })
  
  // 设置云端配置
  ipcMain.handle('settings:set-cloud-config', async (_event, config: { apiEndpoint: string; userToken: string } | null) => {
    try {
      settingsStorage.setCloudConfig(config)
      return { success: true }
    } catch (error) {
      console.error('[IPC] Error in settings:set-cloud-config:', error)
      throw error
    }
  })
  
  // 获取设置
  ipcMain.handle('settings:get', async () => {
    try {
      console.log('[IPC] Getting settings...')
      const settings = await settingsStorage.getSettings()
      console.log('[IPC] Settings retrieved successfully')
      return settings
    } catch (error) {
      console.error('[IPC] Error in settings:get:', error)
      throw error
    }
  })
  
  // 保存设置
  ipcMain.handle('settings:save', async (_event, settings: UserSettings) => {
    try {
      console.log('[IPC] Saving settings...')
      await settingsStorage.saveSettings(settings)
      console.log('[IPC] Settings saved successfully')
      return { success: true }
    } catch (error) {
      console.error('[IPC] Error in settings:save:', error)
      throw error
    }
  })
  
  // 同步设置（仅 hybrid 模式）
  ipcMain.handle('settings:sync', async () => {
    try {
      console.log('[IPC] Syncing settings...')
      const result = await settingsStorage.syncSettings()
      console.log('[IPC] Sync result:', result)
      return result
    } catch (error) {
      console.error('[IPC] Error in settings:sync:', error)
      throw error
    }
  })
  
  // 重置设置
  ipcMain.handle('settings:reset', async () => {
    try {
      console.log('[IPC] Resetting settings...')
      await settingsStorage.resetSettings()
      const newSettings = await settingsStorage.getSettings()
      console.log('[IPC] Settings reset successfully')
      return newSettings
    } catch (error) {
      console.error('[IPC] Error in settings:reset:', error)
      throw error
    }
  })
  
  // 导出设置
  ipcMain.handle('settings:export', async (_event, exportPath: string) => {
    try {
      console.log('[IPC] Exporting settings to:', exportPath)
      await settingsStorage.exportSettings(exportPath)
      console.log('[IPC] Settings exported successfully')
      return { success: true }
    } catch (error) {
      console.error('[IPC] Error in settings:export:', error)
      throw error
    }
  })
  
  // 导入设置
  ipcMain.handle('settings:import', async (_event, importPath: string) => {
    try {
      console.log('[IPC] Importing settings from:', importPath)
      await settingsStorage.importSettings(importPath)
      const newSettings = await settingsStorage.getSettings()
      console.log('[IPC] Settings imported successfully')
      return newSettings
    } catch (error) {
      console.error('[IPC] Error in settings:import:', error)
      throw error
    }
  })
  
  // 从 localStorage 迁移设置（仅用于兼容性）
  ipcMain.handle('settings:migrate-from-localstorage', async (_event, localStorageData: any) => {
    try {
      console.log('[IPC] Migrating settings from localStorage...')
      
      // 获取当前设置
      const currentSettings = await settingsStorage.getSettings()
      
      // 合并 localStorage 数据
      if (localStorageData.aiProviderConfigs) {
        currentSettings.aiProviders = JSON.parse(localStorageData.aiProviderConfigs)
      }
      
      // 保存合并后的设置
      await settingsStorage.saveSettings(currentSettings)
      
      console.log('[IPC] Migration completed successfully')
      return { success: true, settings: currentSettings }
    } catch (error) {
      console.error('[IPC] Error in settings:migrate-from-localstorage:', error)
      throw error
    }
  })
  
  console.log('[IPC] ✅ Settings handlers registered successfully')
}

