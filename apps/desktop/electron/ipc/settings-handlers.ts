/**
 * 设置管理 IPC 处理器（简化版）
 * 元配置（storageMode, cloudConfig）由渲染进程通过 localStorage 管理
 * 用户数据由 SettingsStorageService 根据传入的参数存储
 */

import { ipcMain } from 'electron'
import { SettingsStorageService } from '../services/settings-storage.service'
import type { UserSettings } from '../services/settings-storage.service'

const settingsService = new SettingsStorageService()

/**
 * 注册设置相关的 IPC 处理器
 */
export function registerSettingsHandlers() {
  // 获取设置
  ipcMain.handle('settings:get', async (_, options?: { storageMode?: string; cloudConfig?: any }) => {
    try {
      const { storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:get, mode:', storageMode)
      return await settingsService.getSettings(storageMode as any, cloudConfig)
    } catch (error) {
      console.error('[IPC] settings:get error:', error)
      throw error
    }
  })
  
  // 保存设置
  ipcMain.handle('settings:save', async (_, settings: UserSettings, options?: { storageMode?: string; cloudConfig?: any }) => {
    try {
      const { storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:save, mode:', storageMode)
      await settingsService.saveSettings(settings, storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:save error:', error)
      throw error
    }
  })
  
  // 重置设置
  ipcMain.handle('settings:reset', async (_, options?: { storageMode?: string; cloudConfig?: any }) => {
    try {
      const { storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:reset, mode:', storageMode)
      await settingsService.resetSettings(storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:reset error:', error)
      throw error
    }
  })
  
  // 导出设置
  ipcMain.handle('settings:export', async (_, exportPath: string, options?: { storageMode?: string; cloudConfig?: any }) => {
    try {
      const { storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:export, mode:', storageMode, 'path:', exportPath)
      await settingsService.exportSettings(exportPath, storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:export error:', error)
      throw error
    }
  })
  
  // 导入设置
  ipcMain.handle('settings:import', async (_, importPath: string, options?: { storageMode?: string; cloudConfig?: any }) => {
    try {
      const { storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:import, mode:', storageMode, 'path:', importPath)
      await settingsService.importSettings(importPath, storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:import error:', error)
      throw error
    }
  })
  
  console.log('[IPC] ✅ Settings handlers registered (simplified)')
}
