// 直接导入生成的 Prisma 客户端，避免包装层问题
import { PrismaClient, User, UserRole } from '../../../database/src/generated/client-postgresql/index.js'
import bcrypt from 'bcryptjs'
import { logger } from '../utils/safe-logger.js'
import Database from '../config/database.js'

export interface CreateUserData {
  email: string
  username: string
  password: string
  role?: UserRole
}

export interface UserResponse {
  id: string
  uuid: string
  email: string | null
  username: string | null
  avatar: string | null
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = Database.getInstance()
  }

  /**
   * 创建新用户
   */
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    try {
      const { email, username, password, role = UserRole.USER } = userData

      // 检查邮箱是否已存在
      if (email) {
        const existingEmailUser = await this.prisma.user.findUnique({
          where: { email }
        })
        if (existingEmailUser) {
          throw new Error('该邮箱已被注册')
        }
      }

      // 检查用户名是否已存在
      if (username) {
        const existingUsernameUser = await this.prisma.user.findUnique({
          where: { username }
        })
        if (existingUsernameUser) {
          throw new Error('该用户名已被使用')
        }
      }

      // 加密密码
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // 创建用户
      const user = await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role,
          isActive: true,
          settings: {
            theme: 'dark',
            language: 'zh-CN',
            notifications: {
              email: true,
              push: true,
              desktop: true
            },
            privacy: {
              profileVisible: true,
              activityVisible: false
            }
          }
        }
      })

      logger.info(`New user created: ${username} (${email})`)

      // 返回用户信息（不包含密码）
      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } catch (error) {
      logger.error('Failed to create user:', error)
      throw error
    }
  }

  /**
   * 通过邮箱查找用户
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      })
      return user
    } catch (error) {
      logger.error(`Failed to find user by email: ${email}`, error)
      throw error
    }
  }

  /**
   * 通过用户名查找用户
   */
  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username }
      })
      return user
    } catch (error) {
      logger.error(`Failed to find user by username: ${username}`, error)
      throw error
    }
  }

  /**
   * 通过ID查找用户
   */
  async findUserById(id: string): Promise<UserResponse | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id }
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } catch (error) {
      logger.error(`Failed to find user by ID: ${id}`, error)
      throw error
    }
  }

  /**
   * 验证用户密码
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    try {
      if (!user.password) {
        return false
      }
      return await bcrypt.compare(password, user.password)
    } catch (error) {
      logger.error('Failed to validate password:', error)
      return false
    }
  }

  /**
   * 更新用户最后登录时间
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          updatedAt: new Date()
        }
      })
    } catch (error) {
      logger.error(`Failed to update last login for user: ${userId}`, error)
      throw error
    }
  }

  /**
   * 检查邮箱是否已存在
   */
  async isEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true }
      })
      return !!user
    } catch (error) {
      logger.error(`Failed to check email existence: ${email}`, error)
      throw error
    }
  }

  /**
   * 检查用户名是否已存在
   */
  async isUsernameExists(username: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
        select: { id: true }
      })
      return !!user
    } catch (error) {
      logger.error(`Failed to check username existence: ${username}`, error)
      throw error
    }
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(userId: string) {
    try {
      const [sshConnectionsCount, chatSessionsCount, commandLogsCount] = await Promise.all([
        this.prisma.sSHConnection.count({ where: { userId } }),
        this.prisma.chatSession.count({ where: { userId } }),
        this.prisma.commandLog.count({ where: { userId } })
      ])

      return {
        sshConnections: sshConnectionsCount,
        chatSessions: chatSessionsCount,
        commandLogs: commandLogsCount
      }
    } catch (error) {
      logger.error(`Failed to get user stats for user: ${userId}`, error)
      throw error
    }
  }

  /**
   * 验证密码强度
   */
  validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
      return { isValid: false, message: '密码长度至少6位' }
    }

    if (password.length > 100) {
      return { isValid: false, message: '密码长度不能超过100位' }
    }

    // 可以添加更多密码强度检查
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    if (!hasLetter && !hasNumber) {
      return { isValid: false, message: '密码应包含字母或数字' }
    }

    return { isValid: true }
  }

  /**
   * 验证邮箱格式
   */
  validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * 验证用户名格式
   */
  validateUsernameFormat(username: string): { isValid: boolean; message?: string } {
    if (username.length < 2) {
      return { isValid: false, message: '用户名长度至少2位' }
    }

    if (username.length > 50) {
      return { isValid: false, message: '用户名长度不能超过50位' }
    }

    // 用户名只能包含字母、数字、下划线和中文
    const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      return { isValid: false, message: '用户名只能包含中文、字母、数字和下划线' }
    }

    return { isValid: true }
  }
}

// 导出单例实例
export const userService = new UserService()

