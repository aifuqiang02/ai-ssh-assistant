/**
 * 快捷命令服务
 * 用于管理用户收藏的常用命令
 */

export interface ShortcutCommand {
  id: string
  command: string
  description?: string
  tags?: string[]
  createdAt: number
  usedCount: number
  lastUsedAt?: number
  connectionId?: string  // 所属连接ID
}

class ShortcutCommandService {
  private readonly STORAGE_KEY = 'terminal_shortcut_commands'

  /**
   * 获取存储键（按连接ID）
   */
  private getStorageKey(connectionId?: string): string {
    if (connectionId) {
      return `${this.STORAGE_KEY}_${connectionId}`
    }
    return this.STORAGE_KEY
  }

  /**
   * 获取所有快捷命令
   * @param connectionId 连接ID，如果提供则只返回该连接的命令
   */
  getAll(connectionId?: string): ShortcutCommand[] {
    try {
      const key = this.getStorageKey(connectionId)
      const data = localStorage.getItem(key)
      if (!data) return []
      return JSON.parse(data)
    } catch (error) {

      return []
    }
  }

  /**
   * 添加快捷命令
   * @param connectionId 连接ID
   */
  add(command: string, description?: string, tags?: string[], connectionId?: string): ShortcutCommand {
    const commands = this.getAll(connectionId)
    
    // 检查是否已存在
    const existing = commands.find(c => c.command === command)
    if (existing) {

      return existing
    }

    const newCommand: ShortcutCommand = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      command,
      description,
      tags,
      createdAt: Date.now(),
      usedCount: 0,
      connectionId
    }

    commands.push(newCommand)
    this.save(commands, connectionId)
    

    return newCommand
  }

  /**
   * 删除快捷命令
   */
  delete(id: string, connectionId?: string): boolean {
    const commands = this.getAll(connectionId)
    const index = commands.findIndex(c => c.id === id)
    
    if (index === -1) {

      return false
    }

    commands.splice(index, 1)
    this.save(commands, connectionId)
    

    return true
  }

  /**
   * 更新快捷命令
   */
  update(id: string, updates: Partial<Omit<ShortcutCommand, 'id' | 'createdAt'>>, connectionId?: string): boolean {
    const commands = this.getAll(connectionId)
    const index = commands.findIndex(c => c.id === id)
    
    if (index === -1) {

      return false
    }

    commands[index] = { ...commands[index], ...updates }
    this.save(commands, connectionId)
    

    return true
  }

  /**
   * 记录命令使用
   */
  recordUsage(id: string, connectionId?: string): void {
    const commands = this.getAll(connectionId)
    const command = commands.find(c => c.id === id)
    
    if (!command) {

      return
    }

    command.usedCount++
    command.lastUsedAt = Date.now()
    this.save(commands, connectionId)
    

  }

  /**
   * 搜索快捷命令
   */
  search(keyword: string, connectionId?: string): ShortcutCommand[] {
    const commands = this.getAll(connectionId)
    const lowerKeyword = keyword.toLowerCase()
    
    return commands.filter(c => 
      c.command.toLowerCase().includes(lowerKeyword) ||
      c.description?.toLowerCase().includes(lowerKeyword) ||
      c.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
    )
  }

  /**
   * 按使用频率排序
   */
  getByUsageFrequency(connectionId?: string): ShortcutCommand[] {
    const commands = this.getAll(connectionId)
    return commands.sort((a, b) => b.usedCount - a.usedCount)
  }

  /**
   * 按创建时间排序（最新的在前）
   */
  getByCreatedTime(connectionId?: string): ShortcutCommand[] {
    const commands = this.getAll(connectionId)
    return commands.sort((a, b) => b.createdAt - a.createdAt)
  }

  /**
   * 保存到 localStorage
   */
  private save(commands: ShortcutCommand[], connectionId?: string): void {
    try {
      const key = this.getStorageKey(connectionId)
      localStorage.setItem(key, JSON.stringify(commands))

    } catch (error) {

    }
  }

  /**
   * 清空所有快捷命令
   */
  clear(connectionId?: string): void {
    const key = this.getStorageKey(connectionId)
    localStorage.removeItem(key)

  }

  /**
   * 导出快捷命令（用于备份）
   */
  export(connectionId?: string): string {
    return JSON.stringify(this.getAll(connectionId), null, 2)
  }

  /**
   * 导入快捷命令（用于恢复）
   */
  import(jsonData: string, connectionId?: string): boolean {
    try {
      const commands = JSON.parse(jsonData) as ShortcutCommand[]
      
      // 验证数据格式
      if (!Array.isArray(commands)) {
        throw new Error('数据格式错误')
      }

      this.save(commands, connectionId)

      return true
    } catch (error) {

      return false
    }
  }
}

export const shortcutCommandService = new ShortcutCommandService()

