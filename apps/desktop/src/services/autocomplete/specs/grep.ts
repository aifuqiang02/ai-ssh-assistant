/**
 * grep 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const grepSpec: CompletionSpec = {
  name: 'grep',
  description: '在文件中搜索模式',
  icon: '🔍',
  args: [
    {
      name: 'pattern',
      description: '搜索模式'
    },
    {
      name: 'file',
      description: '文件路径',
      isOptional: true,
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
            const name = item.replace(/[/*@=|]$/, '')
            
            return {
              name: prefix + name,
              icon: isDir ? '📁' : '📄',
              type: (isDir ? 'folder' : 'file') as 'folder' | 'file',
              priority: isDir ? 70 : 85
            }
          })
        },
        cache: 2000
      }
    }
  ],
  options: [
    {
      name: ['-i', '--ignore-case'],
      description: '忽略大小写'
    },
    {
      name: ['-v', '--invert-match'],
      description: '反向匹配，显示不匹配的行'
    },
    {
      name: ['-n', '--line-number'],
      description: '显示行号'
    },
    {
      name: ['-r', '-R', '--recursive'],
      description: '递归搜索目录'
    },
    {
      name: ['-l', '--files-with-matches'],
      description: '只显示包含匹配的文件名'
    },
    {
      name: ['-c', '--count'],
      description: '只显示匹配的行数'
    },
    {
      name: ['-w', '--word-regexp'],
      description: '只匹配整个单词'
    },
    {
      name: ['-x', '--line-regexp'],
      description: '只匹配整行'
    },
    {
      name: ['-A', '--after-context'],
      description: '显示匹配行及其后N行',
      args: {
        name: 'num',
        description: '行数',
        suggestions: [
          { name: '1', type: 'arg' as const },
          { name: '3', type: 'arg' as const },
          { name: '5', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-B', '--before-context'],
      description: '显示匹配行及其前N行',
      args: {
        name: 'num',
        description: '行数',
        suggestions: [
          { name: '1', type: 'arg' as const },
          { name: '3', type: 'arg' as const },
          { name: '5', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-C', '--context'],
      description: '显示匹配行及其前后N行',
      args: {
        name: 'num',
        description: '行数',
        suggestions: [
          { name: '1', type: 'arg' as const },
          { name: '3', type: 'arg' as const },
          { name: '5', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-E', '--extended-regexp'],
      description: '使用扩展正则表达式'
    },
    {
      name: ['-F', '--fixed-strings'],
      description: '将模式视为固定字符串'
    },
    {
      name: ['-P', '--perl-regexp'],
      description: '使用 Perl 正则表达式'
    },
    {
      name: ['--color'],
      description: '高亮显示匹配文本',
      args: {
        name: 'when',
        suggestions: [
          { name: 'auto', type: 'arg' as const },
          { name: 'always', type: 'arg' as const },
          { name: 'never', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['--include'],
      description: '只搜索匹配的文件',
      args: {
        name: 'pattern',
        description: '文件模式'
      }
    },
    {
      name: ['--exclude'],
      description: '排除匹配的文件',
      args: {
        name: 'pattern',
        description: '文件模式'
      }
    }
  ]
}

