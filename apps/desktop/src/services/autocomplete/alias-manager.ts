/**
 * 命令别名管理器
 * 从 .bashrc, .bash_aliases 等文件读取用户定义的别名
 */

export interface AliasEntry {
  alias: string
  command: string
  source?: string // 别名来源文件
}

export class AliasManager {
  private aliasCache = new Map<string, AliasEntry[]>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 60000 // 60秒缓存 (别名很少改变)
  
  /**
   * 获取所有别名
   */
  async getAliases(connectionId: string): Promise<AliasEntry[]> {
    const now = Date.now()
    const lastTime = this.lastFetch.get(connectionId) || 0
    
    // 如果缓存有效，直接返回
    if (now - lastTime < this.CACHE_TTL) {
      return this.aliasCache.get(connectionId) || []
    }
    
    try {
      // 使用 alias 命令获取当前 shell 中的所有别名
      const result = await window.electronAPI.ssh.executeSilent(
        connectionId,
        'alias 2>/dev/null'
      )
      
      if (!result.success || !result.output) {
        return []
      }
      
      // 解析别名
      const entries = this.parseAliases(result.output)
      
      // 更新缓存
      this.aliasCache.set(connectionId, entries)
      this.lastFetch.set(connectionId, now)
      
      return entries
    } catch (error) {
            // 获取别名错误
      return []
    }
  }
  
  /**
   * 解析 alias 命令输出
   */
  private parseAliases(output: string): AliasEntry[] {
    const entries: AliasEntry[] = []
    const lines = output
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
    
    for (const line of lines) {
      // alias 输出格式: alias name='command'
      // 或: alias name="command"
      const match = line.match(/^alias\s+([^=]+)=(['"])(.*?)\2$/)
      if (match) {
        const alias = match[1].trim()
        const command = match[3].trim()
        
        entries.push({
          alias,
          command,
          source: 'shell'
        })
      }
    }
    
    return entries
  }
  
  /**
   * 获取别名建议
   */
  async getAliasSuggestions(
    connectionId: string,
    prefix: string
  ): Promise<AliasEntry[]> {
    const aliases = await this.getAliases(connectionId)
    
    if (!prefix || prefix.trim().length === 0) {
      return aliases
    }
    
    // 过滤匹配前缀的别名
    const prefixLower = prefix.toLowerCase()
    return aliases.filter(a => 
      a.alias.toLowerCase().startsWith(prefixLower)
    )
  }
  
  /**
   * 解析别名（递归展开）
   * @param alias 别名名称
   * @param connectionId 连接ID
   * @returns 展开后的命令，如果不是别名则返回原值
   */
  async resolveAlias(
    alias: string,
    connectionId: string,
    maxDepth: number = 5
  ): Promise<string> {
    if (maxDepth <= 0) {
      return alias // 防止循环别名
    }
    
    const aliases = await this.getAliases(connectionId)
    const entry = aliases.find(a => a.alias === alias)
    
    if (!entry) {
      return alias // 不是别名
    }
    
    // 递归展开别名中的别名
    const firstWord = entry.command.split(/\s+/)[0]
    const resolved = await this.resolveAlias(firstWord, connectionId, maxDepth - 1)
    
    // 如果第一个词被展开了，替换它
    if (resolved !== firstWord) {
      const rest = entry.command.substring(firstWord.length)
      return resolved + rest
    }
    
    return entry.command
  }
  
  /**
   * 清除缓存
   */
  clearCache(connectionId?: string) {
    if (connectionId) {
      this.aliasCache.delete(connectionId)
      this.lastFetch.delete(connectionId)
    } else {
      this.aliasCache.clear()
      this.lastFetch.clear()
    }
  }
}

// 单例实例
export const aliasManager = new AliasManager()

