/**
 * 设置管理 IPC 处理器（数据库版）
 * 元配置（storageMode, cloudConfig）由渲染进程通过 localStorage 管理
 * 用户数据存储在数据库中
 */

import { ipcMain } from 'electron'
import { StorageManager } from '@ai-ssh/database'
import { SettingsStorageService } from '../services/settings-storage.service'
import type { UserSettings } from '../services/settings-storage.service'

/**
 * 注册设置相关的 IPC 处理器
 */
export function registerSettingsHandlers(storage: StorageManager | null = null) {
  const settingsService = new SettingsStorageService(storage)
  // 获取设置
  ipcMain.handle('settings:get', async (_, options?: { userId?: string; storageMode?: string; cloudConfig?: any }) => {
    try {
      const { userId = null, storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:get, userId:', userId, 'mode:', storageMode)
      return await settingsService.getSettings(userId, storageMode as any, cloudConfig)
    } catch (error) {
      console.error('[IPC] settings:get error:', error)
      throw error
    }
  })
  
  // 保存设置
  ipcMain.handle('settings:save', async (_, settings: UserSettings, options?: { userId?: string; storageMode?: string; cloudConfig?: any }) => {
    try {
      const { userId = null, storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:save, userId:', userId, 'mode:', storageMode)
      await settingsService.saveSettings(userId, settings, storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:save error:', error)
      throw error
    }
  })
  
  // 重置设置
  ipcMain.handle('settings:reset', async (_, options?: { userId?: string; storageMode?: string; cloudConfig?: any }) => {
    try {
      const { userId = null, storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:reset, userId:', userId, 'mode:', storageMode)
      await settingsService.resetSettings(userId, storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:reset error:', error)
      throw error
    }
  })
  
  // 导出设置
  ipcMain.handle('settings:export', async (_, exportPath: string, options?: { userId?: string; storageMode?: string; cloudConfig?: any }) => {
    try {
      const { userId = null, storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:export, userId:', userId, 'mode:', storageMode, 'path:', exportPath)
      await settingsService.exportSettings(userId, exportPath, storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:export error:', error)
      throw error
    }
  })
  
  // 导入设置
  ipcMain.handle('settings:import', async (_, importPath: string, options?: { userId?: string; storageMode?: string; cloudConfig?: any }) => {
    try {
      const { userId = null, storageMode = 'local', cloudConfig = null } = options || {}
      console.log('[IPC] settings:import, userId:', userId, 'mode:', storageMode, 'path:', importPath)
      await settingsService.importSettings(userId, importPath, storageMode as any, cloudConfig)
      return { success: true }
    } catch (error) {
      console.error('[IPC] settings:import error:', error)
      throw error
    }
  })
  
  console.log('[IPC] ✅ Settings handlers registered (database version)')
}
