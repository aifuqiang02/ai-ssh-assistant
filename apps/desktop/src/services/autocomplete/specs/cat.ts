/**
 * cat 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const catSpec: CompletionSpec = {
  name: 'cat',
  description: '连接文件并打印到标准输出',
  icon: '📄',
  args: {
    name: 'file',
    description: '文件路径',
    isVariadic: true,
    generators: {
      // 文件和目录补全
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
        
        // 执行 ls -AF
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
          const name = item.replace(/[/*@=|]$/, '')
          
          return {
            name: prefix + name,
            icon: isDir ? '📁' : '📄',
            type: (isDir ? 'folder' : 'file') as 'folder' | 'file',
            priority: isDir ? 70 : 90 // 文件优先级高于目录
          }
        })
      },
      cache: 2000
    }
  },
  options: [
    {
      name: ['-n', '--number'],
      description: '显示行号'
    },
    {
      name: ['-b', '--number-nonblank'],
      description: '对非空行显示行号'
    },
    {
      name: ['-s', '--squeeze-blank'],
      description: '压缩连续的空行'
    },
    {
      name: ['-E', '--show-ends'],
      description: '在每行末尾显示 $'
    },
    {
      name: ['-T', '--show-tabs'],
      description: '将 TAB 显示为 ^I'
    },
    {
      name: ['-A', '--show-all'],
      description: '显示所有不可打印字符'
    }
  ]
}

