import { prisma } from '../config/database.js'
import { logger } from '../utils/safe-logger.js'

interface UserSettings {
  id: string
  userId: string
  data: any
  createdAt: Date
  updatedAt: Date
}

class SettingsService {
  /**
   * 获取用户设置
   */
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const settings = await prisma.userSettings.findUnique({
        where: { userId }
      })

      return settings
    } catch (error) {
      console.error('[Settings Service] Get settings error:', error)
      logger.error(`Failed to get settings for user ${userId}:`, error)
      throw error  // 抛出原始错误以便查看详细信息
    }
  }

  /**
   * 保存用户设置
   */
  async saveUserSettings(userId: string, data: any): Promise<UserSettings> {
    try {
      const settings = await prisma.userSettings.upsert({
        where: { userId },
        update: {
          data,
          updatedAt: new Date()
        },
        create: {
          userId,
          data
        }
      })

      return settings
    } catch (error) {
      console.error('[Settings Service] Save settings error:', error)
      logger.error(`Failed to save settings for user ${userId}:`, error)
      throw error  // 抛出原始错误以便查看详细信息
    }
  }

  /**
   * 删除用户设置
   */
  async deleteUserSettings(userId: string): Promise<void> {
    try {
      await prisma.userSettings.delete({
        where: { userId }
      })

    } catch (error) {
      logger.error(`Failed to delete settings for user ${userId}:`, error)
      throw new Error('删除用户设置失败')
    }
  }

  /**
   * 检查用户是否有设置
   */
  async hasUserSettings(userId: string): Promise<boolean> {
    try {
      const count = await prisma.userSettings.count({
        where: { userId }
      })

      return count > 0
    } catch (error) {
      logger.error(`Failed to check settings for user ${userId}:`, error)
      return false
    }
  }
}

export const settingsService = new SettingsService()
export type { UserSettings }

