/**
 * ls 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const lsSpec: CompletionSpec = {
  name: 'ls',
  description: '列出目录内容',
  icon: '📋',
  args: {
    name: 'path',
    description: '目录或文件路径',
    isOptional: true,
    isVariadic: true,
    generators: {
      // 动态生成：根据用户输入的路径提供补全
      custom: async (context) => {
        const userInput = context.currentToken || ''
        
        // 解析路径
        let searchDir = ''
        let prefix = ''
        
        if (userInput) {
          if (userInput.endsWith('/')) {
            searchDir = userInput
            prefix = userInput
          } else {
            const lastSlash = userInput.lastIndexOf('/')
            if (lastSlash >= 0) {
              searchDir = userInput.substring(0, lastSlash + 1) || '/'
              prefix = searchDir
            } else {
              searchDir = context.currentDirectory || '.'
              prefix = ''
            }
          }
        } else {
          searchDir = context.currentDirectory || '.'
          prefix = ''
        }
        
        // 执行 ls -AF (显示所有文件,带类型标识)
        const lsResult = await window.electronAPI.ssh.executeSilent(
          context.connectionId,
          `cd "${searchDir}" 2>/dev/null && ls -AF 2>/dev/null`
        )
        
        if (!lsResult.success || !lsResult.output) {
          return []
        }
        
        // 清理输出
        let cleaned = lsResult.output
          .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
          .replace(/\x1b\][^\x07]*\x07/g, '')
          .replace(/\r/g, '')
          .replace(/\x1b\[\?[0-9]+[hl]/g, '')
        
        const items = cleaned
          .split('\n')
          .map(i => i.trim())
          .filter(i => i.length > 0 && !i.includes('#') && !i.includes('@'))
        
        return items.map(item => {
          const isDir = item.endsWith('/')
          const isExec = item.endsWith('*')
          const name = item.replace(/[/*@=|]$/, '') // 移除类型标识
          
          return {
            name: prefix + name,
            icon: isDir ? '📁' : (isExec ? '⚙️' : '📄'),
            type: (isDir ? 'folder' : 'file') as 'folder' | 'file',
            priority: isDir ? 90 : 70
          }
        })
      },
      cache: 2000
    }
  },
  options: [
    {
      name: ['-l'],
      description: '使用长格式列表',
      icon: '📝'
    },
    {
      name: ['-a', '--all'],
      description: '显示所有文件(包括隐藏文件)'
    },
    {
      name: ['-h', '--human-readable'],
      description: '以人类可读的格式显示大小'
    },
    {
      name: ['-R', '--recursive'],
      description: '递归列出子目录'
    },
    {
      name: ['-t'],
      description: '按修改时间排序'
    },
    {
      name: ['-S'],
      description: '按文件大小排序'
    },
    {
      name: ['-r', '--reverse'],
      description: '反向排序'
    },
    {
      name: ['--color'],
      description: '彩色输出',
      args: {
        name: 'when',
        suggestions: ['auto', 'always', 'never']
      }
    }
  ]
}

