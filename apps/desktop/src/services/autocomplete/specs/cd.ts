/**
 * cd 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const cdSpec: CompletionSpec = {
  name: 'cd',
  description: '切换目录',
  icon: '📁',
  args: {
    name: 'directory',
    description: '目标目录',
    isOptional: true,
    generators: {
      // 动态生成：根据用户输入的路径提供补全
      custom: async (context) => {
        // 获取用户当前输入的路径（第一个参数）
        const userInput = context.currentToken || ''
        
        // 判断目标目录：
        // 1. 如果用户输入了路径，使用该路径
        // 2. 否则使用当前工作目录
        let targetDir = ''
        let searchDir = ''
        let prefix = ''
        
        if (userInput) {
          // 用户已经输入了路径
          if (userInput.endsWith('/')) {
            // 如果以 / 结尾，在该目录下搜索 (如 /var/www/)
            searchDir = userInput
            prefix = userInput
          } else {
            // 否则，提取目录部分 (如 /var/ww -> /var/)
            const lastSlash = userInput.lastIndexOf('/')
            if (lastSlash >= 0) {
              searchDir = userInput.substring(0, lastSlash + 1) || '/'
              prefix = searchDir
            } else {
              // 没有斜杠，在当前目录搜索
              searchDir = context.currentDirectory || '.'
              prefix = ''
            }
          }
        } else {
          // 用户没有输入，在当前目录搜索
          searchDir = context.currentDirectory || '.'
          prefix = ''
        }
        
        // 如果没有当前目录，尝试获取
        if (!context.currentDirectory && searchDir === '.') {
          const pwdResult = await window.electronAPI.ssh.executeSilent(
            context.connectionId,
            'pwd'
          )
          if (pwdResult.success && pwdResult.output) {
            searchDir = pwdResult.output.trim()
          }
        }
        
        
        // 在目标目录执行 ls
        const lsResult = await window.electronAPI.ssh.executeSilent(
          context.connectionId,
          `cd "${searchDir}" 2>/dev/null && ls -F 2>/dev/null | grep "/$" | sed "s|/||"`
        )
        
        if (!lsResult.success || !lsResult.output) {
          return []
        }
        
        // 手动处理输出
        const output = lsResult.output
        
        // 清理 ANSI 转义序列和特殊字符
        let cleaned = output
          .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '') // ANSI 颜色代码
          .replace(/\x1b\][^\x07]*\x07/g, '')     // OSC 序列
          .replace(/\r/g, '')                      // 回车符
          .replace(/\x1b\[\?[0-9]+[hl]/g, '')     // 私有模式设置
        
        const dirs = cleaned
          .split('\n')
          .map(d => d.trim())
          .filter(d => d.length > 0 && !d.includes('#') && !d.includes('@'))
        
        
        // 返回建议，带上路径前缀
        return dirs.map(dir => ({
          name: prefix + dir,
          description: `进入 ${dir}`,
          icon: '📂',
          type: 'folder' as const,
          priority: 80
        }))
      },
      cache: 2000 // 缓存 2 秒
    }
  }
}

