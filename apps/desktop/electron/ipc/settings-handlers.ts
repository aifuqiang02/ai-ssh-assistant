/**
 * 设置管理 IPC 处理器 - 使用 StorageManager 统一接口
 * StorageManager 自动处理本地/云端/混合模式
 */

import { ipcMain } from 'electron'
import { StorageManager } from '@ai-ssh/database'
import * as fs from 'fs/promises'

// 默认设置
const DEFAULT_SETTINGS = {
  aiProviders: {},
  appearance: {
    theme: 'light',
    fontSize: 14,
    fontFamily: 'Consolas'
  },
  editor: {
    tabSize: 2,
    wordWrap: true,
    minimap: true
  },
  terminal: {
    fontSize: 14,
    fontFamily: 'Consolas',
    cursorStyle: 'block'
  },
  shortcuts: {},
  storageMode: 'local'
}

/**
 * 注册设置相关的 IPC 处理器
 * @param storage - 已配置好的 StorageManager 实例
 */
export function registerSettingsHandlers(storage: StorageManager) {
  // ✅ 获取设置 - 统一接口，StorageManager 自动处理模式
  ipcMain.handle('settings:get', async (_, userId?: string) => {
    try {
      console.log('[Settings IPC] Get settings for user:', userId)
      
      if (!userId) {
        return DEFAULT_SETTINGS
      }

      const userSettings = await storage.findUnique('UserSettings', {
        where: { userId }
      })

      if (userSettings?.data) {
        console.log('[Settings IPC] Settings loaded from storage')
        return userSettings.data
      }

      console.log('[Settings IPC] No settings found, returning defaults')
      return DEFAULT_SETTINGS
    } catch (error) {
      console.error('[Settings IPC] Get error:', error)
      return DEFAULT_SETTINGS
    }
  })

  // ✅ 保存设置 - StorageManager 自动同步
  ipcMain.handle('settings:save', async (_, userId: string, settings: any) => {
    try {
      console.log('[Settings IPC] 📝 开始保存设置')
      console.log('[Settings IPC] userId:', userId)
      console.log('[Settings IPC] settings:', JSON.stringify(settings, null, 2))
      
      if (!userId) {
        console.error('[Settings IPC] ❌ userId 为空')
        throw new Error('User ID is required')
      }

      // 检查是否存在
      console.log('[Settings IPC] 🔍 检查现有设置...')
      const existing = await storage.findUnique('UserSettings', {
        where: { userId }
      })
      console.log('[Settings IPC] 现有设置:', existing ? '已存在' : '不存在')

      if (existing) {
        console.log('[Settings IPC] 📝 更新现有设置...')
        const result = await storage.update('UserSettings', {
          where: { userId },
          data: { 
            data: settings,
            updatedAt: new Date()
          }
        })
        console.log('[Settings IPC] 更新结果:', result)
      } else {
        console.log('[Settings IPC] 📝 创建新设置...')
        const result = await storage.create('UserSettings', {
          userId,
          data: settings
        })
        console.log('[Settings IPC] 创建结果:', result)
      }

      console.log('[Settings IPC] ✅ 设置保存成功')
      
      // ✅ 如果是 hybrid 模式，自动触发同步
      const status = await storage.getStatus()
      console.log('[Settings IPC] 存储模式:', status.mode)
      if (status.mode === 'hybrid' && !status.sync.inProgress) {
        console.log('[Settings IPC] 🔄 触发后台同步...')
        storage.sync().catch(err => {
          console.warn('[Settings IPC] ⚠️ 后台同步失败:', err)
        })
      }
      
      return { success: true }
    } catch (error) {
      console.error('[Settings IPC] ❌ 保存设置失败:', error)
      console.error('[Settings IPC] 错误堆栈:', error instanceof Error ? error.stack : error)
      throw error
    }
  })

  // ✅ 重置设置
  ipcMain.handle('settings:reset', async (_, userId?: string) => {
    try {
      console.log('[Settings IPC] Reset settings for user:', userId)
      
      if (!userId) {
        return DEFAULT_SETTINGS
      }

      const existing = await storage.findUnique('UserSettings', {
        where: { userId }
      })

      if (existing) {
        await storage.update('UserSettings', {
          where: { userId },
          data: { 
            data: DEFAULT_SETTINGS,
            updatedAt: new Date()
          }
        })
      } else {
        await storage.create('UserSettings', {
          userId,
          data: DEFAULT_SETTINGS
        })
      }

      console.log('[Settings IPC] Settings reset successfully')
      return { success: true }
    } catch (error) {
      console.error('[Settings IPC] Reset error:', error)
      throw error
    }
  })

  // ✅ 导出设置
  ipcMain.handle('settings:export', async (_, userId: string, exportPath: string) => {
    try {
      console.log('[Settings IPC] Export settings for user:', userId, 'to:', exportPath)
      
      const userSettings = await storage.findUnique('UserSettings', {
        where: { userId }
      })

      const settingsToExport = userSettings?.data || DEFAULT_SETTINGS
      await fs.writeFile(exportPath, JSON.stringify(settingsToExport, null, 2), 'utf-8')
      
      console.log('[Settings IPC] Settings exported successfully')
      return { success: true }
    } catch (error) {
      console.error('[Settings IPC] Export error:', error)
      throw error
    }
  })

  // ✅ 导入设置
  ipcMain.handle('settings:import', async (_, userId: string, importPath: string) => {
    try {
      console.log('[Settings IPC] Import settings for user:', userId, 'from:', importPath)
      
      const fileContent = await fs.readFile(importPath, 'utf-8')
      const importedSettings = JSON.parse(fileContent)

      const existing = await storage.findUnique('UserSettings', {
        where: { userId }
      })

      if (existing) {
        await storage.update('UserSettings', {
          where: { userId },
          data: { 
            data: importedSettings,
            updatedAt: new Date()
          }
        })
      } else {
        await storage.create('UserSettings', {
          userId,
          data: importedSettings
        })
      }

      console.log('[Settings IPC] Settings imported successfully')
      return { success: true, settings: importedSettings }
    } catch (error) {
      console.error('[Settings IPC] Import error:', error)
      throw error
    }
  })

  console.log('[Settings IPC] ✅ Handlers registered')
}
