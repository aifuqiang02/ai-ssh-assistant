/**
 * npm 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const npmSpec: CompletionSpec = {
  name: 'npm',
  description: 'Node 包管理器',
  icon: '📦',
  subcommands: [
    {
      name: 'install',
      description: '安装依赖包',
      icon: '⬇️',
      args: {
        name: 'package',
        description: '包名称',
        isOptional: true
      },
      options: [
        {
          name: ['-g', '--global'],
          description: '全局安装'
        },
        {
          name: ['-D', '--save-dev'],
          description: '保存为开发依赖'
        },
        {
          name: ['--save'],
          description: '保存为生产依赖'
        }
      ]
    },
    {
      name: ['i'],
      description: 'install 的简写',
      icon: '⬇️'
    },
    {
      name: 'uninstall',
      description: '卸载依赖包',
      icon: '🗑️',
      args: {
        name: 'package',
        description: '包名称'
      }
    },
    {
      name: 'run',
      description: '运行脚本',
      icon: '▶️',
      args: {
        name: 'script',
        description: '脚本名称',
        generators: {
          custom: async (context) => {
            // 读取 package.json 中的 scripts
            const result = await window.electronAPI.ssh.executeSilent(
              context.connectionId,
              'test -f package.json && cat package.json 2>/dev/null'
            )
            
            if (!result.success || !result.output) {
              return []
            }
            
            try {
              // 尝试解析 JSON
              const pkg = JSON.parse(result.output.trim())
              const scripts = pkg.scripts || {}
              
              return Object.keys(scripts).map(name => ({
                name,
                description: scripts[name],
                icon: '▶️',
                type: 'arg' as const,
                priority: 90
              }))
            } catch (error) {
              // 无法解析 package.json
              return []
            }
          },
          cache: 5000
        }
      }
    },
    {
      name: 'start',
      description: '启动应用',
      icon: '🚀'
    },
    {
      name: 'test',
      description: '运行测试',
      icon: '🧪'
    },
    {
      name: 'build',
      description: '构建项目',
      icon: '🔨'
    },
    {
      name: 'init',
      description: '初始化 package.json',
      icon: '✨',
      options: [
        {
          name: ['-y', '--yes'],
          description: '使用默认值'
        }
      ]
    },
    {
      name: 'update',
      description: '更新依赖包',
      icon: '🔄',
      args: {
        name: 'package',
        description: '包名称',
        isOptional: true
      }
    },
    {
      name: 'outdated',
      description: '检查过时的包',
      icon: '⚠️'
    },
    {
      name: 'list',
      description: '列出已安装的包',
      icon: '📋',
      options: [
        {
          name: ['-g', '--global'],
          description: '列出全局包'
        },
        {
          name: ['--depth'],
          description: '显示深度',
          args: {
            name: 'depth',
            description: '深度级别',
            suggestions: ['0', '1', '2']
          }
        }
      ]
    },
    {
      name: 'search',
      description: '搜索包',
      icon: '🔍',
      args: {
        name: 'keyword',
        description: '搜索关键词'
      }
    },
    {
      name: 'publish',
      description: '发布包',
      icon: '📤'
    },
    {
      name: 'version',
      description: '版本管理',
      icon: '🏷️',
      args: {
        name: 'version',
        description: '版本号或类型',
        suggestions: ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor']
      }
    }
  ],
  options: [
    {
      name: '--version',
      description: '显示 npm 版本'
    },
    {
      name: '--help',
      description: '显示帮助信息'
    }
  ]
}

