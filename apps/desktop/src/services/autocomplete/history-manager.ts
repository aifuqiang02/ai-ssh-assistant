/**
 * 历史命令管理器
 * 从终端 history 命令获取历史记录并提供补全建议
 */

export interface HistoryEntry {
  command: string
  timestamp?: number
  frequency?: number
}

export class HistoryManager {
  private historyCache = new Map<string, HistoryEntry[]>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 30000 // 30秒缓存
  
  /**
   * 获取历史命令
   */
  async getHistory(connectionId: string): Promise<HistoryEntry[]> {
    const now = Date.now()
    const lastTime = this.lastFetch.get(connectionId) || 0
    
    // 如果缓存有效，直接返回
    if (now - lastTime < this.CACHE_TTL) {
      return this.historyCache.get(connectionId) || []
    }
    
    try {
      // 从 SSH 执行 history 命令
      const result = await window.electronAPI.ssh.executeSilent(
        connectionId,
        'history 100 2>/dev/null | tail -100'
      )
      
      if (!result.success || !result.output) {
        return []
      }
      
      // 解析历史命令
      const entries = this.parseHistory(result.output)
      
      // 更新缓存
      this.historyCache.set(connectionId, entries)
      this.lastFetch.set(connectionId, now)
      
      return entries
    } catch (error) {
      // 获取历史命令错误
      return []
    }
  }
  
  /**
   * 解析 history 命令输出
   */
  private parseHistory(output: string): HistoryEntry[] {
    const lines = output
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
    
    const entries: HistoryEntry[] = []
    const commandFrequency = new Map<string, number>()
    
    for (const line of lines) {
      // history 输出格式: "  123  command args"
      const match = line.match(/^\s*\d+\s+(.+)$/)
      if (match) {
        const command = match[1].trim()
        
        // 跳过空命令和特殊命令
        if (!command || command.startsWith('#') || command === 'history') {
          continue
        }
        
        // 统计频率
        const freq = commandFrequency.get(command) || 0
        commandFrequency.set(command, freq + 1)
        
        entries.push({
          command,
          timestamp: Date.now()
        })
      }
    }
    
    // 添加频率信息并去重
    const uniqueCommands = new Map<string, HistoryEntry>()
    for (const entry of entries) {
      const existing = uniqueCommands.get(entry.command)
      const frequency = commandFrequency.get(entry.command) || 1
      
      if (!existing || (existing.timestamp || 0) < (entry.timestamp || 0)) {
        uniqueCommands.set(entry.command, {
          ...entry,
          frequency
        })
      }
    }
    
    // 转换为数组并按频率排序
    return Array.from(uniqueCommands.values()).sort((a, b) => {
      const freqA = a.frequency || 0
      const freqB = b.frequency || 0
      if (freqA !== freqB) {
        return freqB - freqA // 频率高的在前
      }
      return (b.timestamp || 0) - (a.timestamp || 0) // 时间新的在前
    })
  }
  
  /**
   * 获取历史命令建议
   * @param connectionId 连接ID
   * @param prefix 当前输入的前缀
   * @param maxResults 最多返回多少条结果
   */
  async getHistorySuggestions(
    connectionId: string,
    prefix: string,
    maxResults: number = 10
  ): Promise<Array<{ command: string; frequency: number }>> {
    const history = await this.getHistory(connectionId)
    
    if (!prefix || prefix.trim().length === 0) {
      // 如果没有前缀，返回最常用的命令
      return history.slice(0, maxResults).map(h => ({
        command: h.command,
        frequency: h.frequency || 1
      }))
    }
    
    // 过滤匹配前缀的命令
    const prefixLower = prefix.toLowerCase()
    const matches = history
      .filter(h => h.command.toLowerCase().startsWith(prefixLower))
      .slice(0, maxResults)
      .map(h => ({
        command: h.command,
        frequency: h.frequency || 1
      }))
    
    return matches
  }
  
  /**
   * 清除缓存
   */
  clearCache(connectionId?: string) {
    if (connectionId) {
      this.historyCache.delete(connectionId)
      this.lastFetch.delete(connectionId)
    } else {
      this.historyCache.clear()
      this.lastFetch.clear()
    }
  }
}

// 单例实例
export const historyManager = new HistoryManager()

