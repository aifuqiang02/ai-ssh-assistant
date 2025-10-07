import { prisma } from '@ai-ssh/database'
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
      logger.error(`Failed to get settings for user ${userId}:`, error)
      throw new Error('获取用户设置失败')
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

      logger.info(`Settings saved for user: ${userId}`)
      return settings
    } catch (error) {
      logger.error(`Failed to save settings for user ${userId}:`, error)
      throw new Error('保存用户设置失败')
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

      logger.info(`Settings deleted for user: ${userId}`)
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

