/**
 * docker 命令补全规范
 */
import type { CompletionSpec } from '@/types/autocomplete'

export const dockerSpec: CompletionSpec = {
  name: 'docker',
  description: 'Docker 容器管理',
  icon: '🐳',
  subcommands: [
    {
      name: 'run',
      description: '运行容器',
      icon: '▶️',
      options: [
        {
          name: ['-d', '--detach'],
          description: '后台运行'
        },
        {
          name: ['-p', '--publish'],
          description: '发布端口',
          args: {
            name: 'ports',
            description: '端口映射 (host:container)'
          }
        },
        {
          name: ['-v', '--volume'],
          description: '挂载卷',
          args: {
            name: 'volume',
            description: '卷映射'
          }
        },
        {
          name: ['--name'],
          description: '容器名称',
          args: {
            name: 'name',
            description: '容器名称'
          }
        },
        {
          name: ['-e', '--env'],
          description: '设置环境变量',
          isRepeatable: true
        },
        {
          name: ['--rm'],
          description: '退出时自动删除容器'
        }
      ],
      args: {
        name: 'image',
        description: '镜像名称'
      }
    },
    {
      name: 'ps',
      description: '列出容器',
      icon: '📋',
      options: [
        {
          name: ['-a', '--all'],
          description: '显示所有容器(包括停止的)'
        },
        {
          name: ['-q', '--quiet'],
          description: '只显示容器ID'
        }
      ]
    },
    {
      name: 'images',
      description: '列出镜像',
      icon: '🖼️',
      options: [
        {
          name: ['-a', '--all'],
          description: '显示所有镜像'
        },
        {
          name: ['-q', '--quiet'],
          description: '只显示镜像ID'
        }
      ]
    },
    {
      name: 'start',
      description: '启动容器',
      icon: '▶️',
      args: {
        name: 'container',
        description: '容器名称或ID',
        generators: {
          script: 'docker ps -a --format "{{.Names}}"',
          postProcess: (output) => {
            const containers = output.split('\n').filter(c => c.trim())
            return containers.map(container => ({
              name: container,
              description: '容器',
              icon: '📦',
              type: 'arg' as const
            }))
          }
        }
      }
    },
    {
      name: 'stop',
      description: '停止容器',
      icon: '⏹️',
      args: {
        name: 'container',
        description: '容器名称或ID',
        generators: {
          script: 'docker ps --format "{{.Names}}"',
          postProcess: (output) => {
            const containers = output.split('\n').filter(c => c.trim())
            return containers.map(container => ({
              name: container,
              description: '运行中的容器',
              icon: '📦',
              type: 'arg' as const
            }))
          }
        }
      }
    },
    {
      name: 'restart',
      description: '重启容器',
      icon: '🔄',
      args: {
        name: 'container',
        description: '容器名称或ID'
      }
    },
    {
      name: 'rm',
      description: '删除容器',
      icon: '🗑️',
      options: [
        {
          name: ['-f', '--force'],
          description: '强制删除'
        }
      ],
      args: {
        name: 'container',
        description: '容器名称或ID'
      }
    },
    {
      name: 'rmi',
      description: '删除镜像',
      icon: '🗑️',
      options: [
        {
          name: ['-f', '--force'],
          description: '强制删除'
        }
      ],
      args: {
        name: 'image',
        description: '镜像名称或ID'
      }
    },
    {
      name: 'pull',
      description: '拉取镜像',
      icon: '⬇️',
      args: {
        name: 'image',
        description: '镜像名称'
      }
    },
    {
      name: 'push',
      description: '推送镜像',
      icon: '⬆️',
      args: {
        name: 'image',
        description: '镜像名称'
      }
    },
    {
      name: 'build',
      description: '构建镜像',
      icon: '🔨',
      options: [
        {
          name: ['-t', '--tag'],
          description: '镜像标签',
          args: {
            name: 'tag',
            description: '标签名称'
          }
        },
        {
          name: ['-f', '--file'],
          description: 'Dockerfile 路径',
          args: {
            name: 'file',
            description: 'Dockerfile'
          }
        }
      ],
      args: {
        name: 'path',
        description: '构建上下文路径',
        suggestions: ['.', './']
      }
    },
    {
      name: 'exec',
      description: '在容器中执行命令',
      icon: '⚡',
      options: [
        {
          name: ['-i', '--interactive'],
          description: '交互模式'
        },
        {
          name: ['-t', '--tty'],
          description: '分配伪终端'
        }
      ],
      args: [
        {
          name: 'container',
          description: '容器名称或ID'
        },
        {
          name: 'command',
          description: '要执行的命令',
          suggestions: ['bash', 'sh', '/bin/bash', '/bin/sh']
        }
      ]
    },
    {
      name: 'logs',
      description: '查看容器日志',
      icon: '📜',
      options: [
        {
          name: ['-f', '--follow'],
          description: '跟踪日志输出'
        },
        {
          name: ['--tail'],
          description: '显示最后N行',
          args: {
            name: 'lines',
            description: '行数'
          }
        }
      ],
      args: {
        name: 'container',
        description: '容器名称或ID'
      }
    },
    {
      name: 'compose',
      description: 'Docker Compose',
      icon: '🎼',
      subcommands: [
        {
          name: 'up',
          description: '启动服务',
          icon: '▶️',
          options: [
            {
              name: ['-d', '--detach'],
              description: '后台运行'
            },
            {
              name: ['--build'],
              description: '启动前构建镜像'
            }
          ]
        },
        {
          name: 'down',
          description: '停止并删除服务',
          icon: '⏹️'
        },
        {
          name: 'ps',
          description: '列出服务',
          icon: '📋'
        },
        {
          name: 'logs',
          description: '查看服务日志',
          icon: '📜'
        }
      ]
    }
  ],
  options: [
    {
      name: '--version',
      description: '显示 Docker 版本'
    },
    {
      name: '--help',
      description: '显示帮助信息'
    }
  ]
}

