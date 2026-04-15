/**
 * 环境变量管理器
 * 提供环境变量补全功能
 */

export interface EnvVariable {
  name: string
  value?: string
  description?: string
}

export class EnvManager {
  private envCache = new Map<string, EnvVariable[]>()
  private lastFetch = new Map<string, number>()
  private readonly CACHE_TTL = 120000 // 120秒缓存 (环境变量很少改变)
  
  // 常用环境变量列表
  private readonly COMMON_VARS: EnvVariable[] = [
    { name: 'HOME', description: '用户主目录' },
    { name: 'PATH', description: '可执行文件搜索路径' },
    { name: 'USER', description: '当前用户名' },
    { name: 'SHELL', description: '当前 Shell' },
    { name: 'PWD', description: '当前工作目录' },
    { name: 'OLDPWD', description: '上次工作目录' },
    { name: 'LANG', description: '语言设置' },
    { name: 'TERM', description: '终端类型' },
    { name: 'EDITOR', description: '默认编辑器' },
    { name: 'HOSTNAME', description: '主机名' },
  ]
  
  /**
   * 获取环境变量列表
   */
  async getEnvVariables(connectionId: string): Promise<EnvVariable[]> {
    const now = Date.now()
    const lastTime = this.lastFetch.get(connectionId) || 0
    
    // 如果缓存有效，直接返回
    if (now - lastTime < this.CACHE_TTL) {
      return this.envCache.get(connectionId) || this.COMMON_VARS
    }
    
    try {
      // 使用 env 或 printenv 命令获取环境变量
      const result = await window.electronAPI.ssh.executeSilent(
        connectionId,
        'env 2>/dev/null || printenv 2>/dev/null'
      )
      
      if (!result.success || !result.output) {
        return this.COMMON_VARS
      }

      // 解析环境变量
      const entries = this.parseEnvOutput(result.output)

      // 更新缓存
      this.envCache.set(connectionId, entries)
      this.lastFetch.set(connectionId, now)

      return entries
    } catch (error) {
      return this.COMMON_VARS
    }
  }
  
  /**
   * 解析 env 命令输出
   */
  private parseEnvOutput(output: string): EnvVariable[] {
    const entries: EnvVariable[] = []
    const lines = output
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && l.includes('='))
    
    for (const line of lines) {
      // env 输出格式: NAME=value
      const index = line.indexOf('=')
      if (index > 0) {
        const name = line.substring(0, index)
        const value = line.substring(index + 1)
        
        // 过滤掉一些内部变量
        if (!name.startsWith('_') && !name.startsWith('BASH_')) {
          // 查找常用变量的描述
          const commonVar = this.COMMON_VARS.find(v => v.name === name)
          
          entries.push({
            name,
            value: value.length > 50 ? value.substring(0, 47) + '...' : value,
            description: commonVar?.description
          })
        }
      }
    }
    
    // 按名称排序
    return entries.sort((a, b) => a.name.localeCompare(b.name))
  }
  
  /**
   * 获取环境变量建议
   * @param prefix 前缀（可能包含 $ 符号）
   */
  async getEnvSuggestions(
    connectionId: string,
    prefix: string
  ): Promise<EnvVariable[]> {
    // 移除开头的 $
    const cleanPrefix = prefix.startsWith('$') ? prefix.substring(1) : prefix
    
    const variables = await this.getEnvVariables(connectionId)
    
    if (!cleanPrefix || cleanPrefix.trim().length === 0) {
      // 返回常用变量
      return this.COMMON_VARS
    }
    
    // 过滤匹配前缀的变量（不区分大小写）
    const prefixUpper = cleanPrefix.toUpperCase()
    return variables.filter(v => 
      v.name.toUpperCase().startsWith(prefixUpper)
    )
  }
  
  /**
   * 检测字符串中是否包含待补全的环境变量
   * @param text 要检测的文本
   * @param cursorPosition 光标位置
   * @returns 如果包含环境变量，返回 { start, prefix }，否则返回 null
   */
  detectEnvVariable(text: string, cursorPosition: number): { start: number; prefix: string } | null {
    // 向前查找最近的 $ 符号
    let start = cursorPosition - 1
    while (start >= 0) {
      const char = text[start]
      if (char === '$') {
        // 找到了 $，提取环境变量名称
        const prefix = text.substring(start, cursorPosition)
        // 验证是否是有效的环境变量名（$后面跟字母或下划线开头）
        if (/^\$[A-Z_][A-Z0-9_]*$/i.test(prefix) || prefix === '$') {
          return { start, prefix }
        }
        break
      } else if (!/[A-Z0-9_]/i.test(char)) {
        // 遇到非法字符，停止查找
        break
      }
      start--
    }
    
    return null
  }
  
  /**
   * 清除缓存
   */
  clearCache(connectionId?: string) {
    if (connectionId) {
      this.envCache.delete(connectionId)
      this.lastFetch.delete(connectionId)
    } else {
      this.envCache.clear()
      this.lastFetch.clear()
    }
  }
}

// 单例实例
export const envManager = new EnvManager()

