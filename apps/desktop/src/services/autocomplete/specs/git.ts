/**
 * git 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const gitSpec: CompletionSpec = {
  name: 'git',
  description: 'Git 版本控制系统',
  icon: '🔀',
  subcommands: [
    {
      name: 'clone',
      description: '克隆仓库',
      icon: '📦',
      args: {
        name: 'repository',
        description: '仓库 URL'
      }
    },
    {
      name: 'add',
      description: '添加文件到暂存区',
      icon: '➕',
      args: {
        name: 'file',
        description: '要添加的文件',
        suggestions: [
          { name: '.', description: '添加所有文件', icon: '📦', type: 'special' as const, priority: 100 },
          { name: '-A', description: '添加所有文件（包括删除）', icon: '📦', type: 'special' as const, priority: 95 },
          { name: '--all', description: '添加所有文件（包括删除）', icon: '📦', type: 'special' as const, priority: 95 }
        ],
        generators: {
          custom: async (context) => {
            const result = await window.electronAPI.ssh.executeSilent(
              context.connectionId,
              'git status --short 2>/dev/null | awk \'{print $2}\''
            )
            
            if (!result.success || !result.output) {
              return []
            }
            
            const files = result.output
              .split('\n')
              .map(f => f.trim())
              .filter(f => f.length > 0)
            
            return files.map(file => ({
              name: file,
              description: '修改的文件',
              icon: '📝',
              type: 'file' as const,
              priority: 80
            }))
          },
          cache: 1000
        }
      }
    },
    {
      name: 'commit',
      description: '提交更改',
      icon: '✅',
      options: [
        {
          name: ['-m', '--message'],
          description: '提交消息',
          args: {
            name: 'message',
            description: '提交描述'
          }
        },
        {
          name: ['-a', '--all'],
          description: '自动暂存所有修改的文件'
        },
        {
          name: '--amend',
          description: '修改上一次提交'
        }
      ]
    },
    {
      name: 'push',
      description: '推送到远程仓库',
      icon: '⬆️',
      args: [
        {
          name: 'remote',
          description: '远程仓库名称',
          suggestions: ['origin'],
          generators: {
            script: 'git remote',
            postProcess: (output) => {
              const remotes = output.split('\n').filter(r => r.trim())
              return remotes.map(remote => ({
                name: remote,
                description: '远程仓库',
                icon: '🌐',
                type: 'arg' as const
              }))
            }
          }
        },
        {
          name: 'branch',
          description: '分支名称',
          isOptional: true,
          generators: {
            script: 'git branch | sed "s/\*//" | awk \'{print $1}\'',
            postProcess: (output) => {
              const branches = output.split('\n').filter(b => b.trim())
              return branches.map(branch => ({
                name: branch,
                description: '本地分支',
                icon: '🌿',
                type: 'arg' as const
              }))
            }
          }
        }
      ]
    },
    {
      name: 'pull',
      description: '从远程仓库拉取',
      icon: '⬇️'
    },
    {
      name: 'status',
      description: '查看仓库状态',
      icon: '📊',
      options: [
        {
          name: ['-s', '--short'],
          description: '简短格式'
        }
      ]
    },
    {
      name: 'checkout',
      description: '切换分支或恢复文件',
      icon: '🔄',
      options: [
        {
          name: ['-b'],
          description: '创建并切换到新分支',
          args: {
            name: 'branch',
            description: '新分支名称'
          }
        }
      ],
      args: {
        name: 'branch',
        description: '分支名称或文件路径',
        generators: {
          script: 'git branch -a | sed "s/\*//" | sed "s/remotes\\/origin\\///" | awk \'{print $1}\' | sort -u',
          postProcess: (output) => {
            const branches = output.split('\n').filter(b => b.trim())
            return branches.map(branch => ({
              name: branch,
              description: '分支',
              icon: '🌿',
              type: 'arg' as const
            }))
          }
        }
      }
    },
    {
      name: 'branch',
      description: '分支管理',
      icon: '🌿',
      options: [
        {
          name: ['-d', '--delete'],
          description: '删除分支',
          args: {
            name: 'branch',
            description: '要删除的分支'
          }
        },
        {
          name: ['-D'],
          description: '强制删除分支'
        },
        {
          name: ['-m', '--move'],
          description: '重命名分支'
        },
        {
          name: ['-a', '--all'],
          description: '显示所有分支(包括远程)'
        }
      ]
    },
    {
      name: 'log',
      description: '查看提交历史',
      icon: '📜',
      options: [
        {
          name: '--oneline',
          description: '单行显示'
        },
        {
          name: '--graph',
          description: '图形化显示'
        },
        {
          name: ['--all'],
          description: '显示所有分支'
        }
      ]
    },
    {
      name: 'diff',
      description: '查看差异',
      icon: '🔍'
    },
    {
      name: 'merge',
      description: '合并分支',
      icon: '🔀',
      args: {
        name: 'branch',
        description: '要合并的分支'
      }
    },
    {
      name: 'stash',
      description: '暂存更改',
      icon: '💾',
      subcommands: [
        {
          name: 'push',
          description: '暂存当前更改'
        },
        {
          name: 'pop',
          description: '恢复暂存的更改'
        },
        {
          name: 'list',
          description: '列出所有暂存'
        },
        {
          name: 'drop',
          description: '删除暂存'
        }
      ]
    }
  ],
  options: [
    {
      name: '--version',
      description: '显示 Git 版本'
    },
    {
      name: '--help',
      description: '显示帮助信息'
    }
  ]
}

