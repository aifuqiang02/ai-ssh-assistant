/**
 * find 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const findSpec: CompletionSpec = {
  name: 'find',
  description: '在目录树中搜索文件',
  icon: '🔎',
  args: {
    name: 'path',
    description: '搜索路径',
    isOptional: true,
    generators: {
      // 目录补全
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
        
        // 执行 ls -F，只显示目录
        const lsResult = await window.electronAPI.ssh.executeSilent(
          context.connectionId,
          `cd "${searchDir}" 2>/dev/null && ls -F 2>/dev/null | grep "/$" | sed "s|/||"`
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
        
        const dirs = cleaned
          .split('\n')
          .map(d => d.trim())
          .filter(d => d.length > 0 && !d.includes('#') && !d.includes('@'))
        
        return dirs.map(dir => ({
          name: prefix + dir,
          icon: '📁',
          type: 'folder' as const,
          priority: 90
        }))
      },
      cache: 2000
    }
  },
  options: [
    {
      name: ['-name'],
      description: '按文件名搜索（支持通配符）',
      args: {
        name: 'pattern',
        description: '文件名模式',
        suggestions: [
          { name: '*.txt', description: '所有文本文件', type: 'arg' as const },
          { name: '*.js', description: '所有 JavaScript 文件', type: 'arg' as const },
          { name: '*.log', description: '所有日志文件', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-iname'],
      description: '按文件名搜索（忽略大小写）',
      args: {
        name: 'pattern',
        description: '文件名模式'
      }
    },
    {
      name: ['-type'],
      description: '按文件类型搜索',
      args: {
        name: 'type',
        description: '文件类型',
        suggestions: [
          { name: 'f', description: '普通文件', type: 'arg' as const, priority: 100 },
          { name: 'd', description: '目录', type: 'arg' as const, priority: 95 },
          { name: 'l', description: '符号链接', type: 'arg' as const, priority: 90 },
          { name: 's', description: 'socket', type: 'arg' as const, priority: 70 },
          { name: 'p', description: '管道', type: 'arg' as const, priority: 70 },
          { name: 'b', description: '块设备', type: 'arg' as const, priority: 70 },
          { name: 'c', description: '字符设备', type: 'arg' as const, priority: 70 }
        ]
      }
    },
    {
      name: ['-size'],
      description: '按文件大小搜索',
      args: {
        name: 'size',
        description: '大小（如 +10M, -1G）',
        suggestions: [
          { name: '+10M', description: '大于 10MB', type: 'arg' as const },
          { name: '-1M', description: '小于 1MB', type: 'arg' as const },
          { name: '+1G', description: '大于 1GB', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-mtime'],
      description: '按修改时间搜索（天）',
      args: {
        name: 'days',
        description: '天数',
        suggestions: [
          { name: '-1', description: '最近 1 天', type: 'arg' as const },
          { name: '-7', description: '最近 7 天', type: 'arg' as const },
          { name: '-30', description: '最近 30 天', type: 'arg' as const },
          { name: '+30', description: '30 天前', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-mmin'],
      description: '按修改时间搜索（分钟）',
      args: {
        name: 'minutes',
        description: '分钟数'
      }
    },
    {
      name: ['-user'],
      description: '按文件所有者搜索',
      args: {
        name: 'username',
        description: '用户名'
      }
    },
    {
      name: ['-group'],
      description: '按文件所属组搜索',
      args: {
        name: 'groupname',
        description: '组名'
      }
    },
    {
      name: ['-perm'],
      description: '按文件权限搜索',
      args: {
        name: 'mode',
        description: '权限模式',
        suggestions: [
          { name: '644', description: 'rw-r--r--', type: 'arg' as const },
          { name: '755', description: 'rwxr-xr-x', type: 'arg' as const },
          { name: '777', description: 'rwxrwxrwx', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-maxdepth'],
      description: '最大搜索深度',
      args: {
        name: 'levels',
        description: '层级数',
        suggestions: [
          { name: '1', description: '只搜索当前目录', type: 'arg' as const },
          { name: '2', type: 'arg' as const },
          { name: '3', type: 'arg' as const }
        ]
      }
    },
    {
      name: ['-mindepth'],
      description: '最小搜索深度',
      args: {
        name: 'levels',
        description: '层级数'
      }
    },
    {
      name: ['-empty'],
      description: '搜索空文件或目录'
    },
    {
      name: ['-delete'],
      description: '删除找到的文件（危险）'
    },
    {
      name: ['-exec'],
      description: '对找到的文件执行命令',
      args: {
        name: 'command',
        description: '要执行的命令'
      }
    },
    {
      name: ['-print'],
      description: '打印找到的文件（默认行为）'
    },
    {
      name: ['-print0'],
      description: '用 null 字符分隔输出'
    }
  ]
}

