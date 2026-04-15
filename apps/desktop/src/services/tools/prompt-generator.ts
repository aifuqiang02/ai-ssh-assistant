/**
 * 提示词生成器
 *
 * 从模板动态生成系统提示词，支持多种模式
 */

import {
  SSH_SYSTEM_PROMPT,
  SSH_PLAN_PROMPT,
  SAFETY_PROMPT,
  DEFAULT_TEMPLATES,
  type PromptTemplateConfig
} from './prompt-templates'

import { getSkillRegistry } from '../skills/registry'

export type PromptMode = 'build' | 'plan'

export interface GeneratePromptOptions {
  mode?: PromptMode
  serverInfo?: {
    host: string
    username: string
  }
  serverEnvDoc?: string | null
  customTemplate?: string
}

/**
 * 获取模板配置
 */
export function getTemplateConfig(mode: PromptMode): PromptTemplateConfig {
  return mode === 'plan' ? DEFAULT_TEMPLATES.plan : DEFAULT_TEMPLATES.ssh
}

/**
 * 替换模板变量
 */
function replaceVariables(template: string, variables: Record<string, string | undefined>): string {
  let result = template

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    result = result.replace(new RegExp(placeholder, 'g'), value ?? '')
  }

  return result
}

/**
 * 生成系统提示词
 */
export function generateSystemPrompt(options: GeneratePromptOptions = {}): string {
  const { mode = 'build', serverInfo, serverEnvDoc } = options

  // 选择基础模板
  const baseTemplate = mode === 'plan' ? SSH_PLAN_PROMPT : SSH_SYSTEM_PROMPT

  // 准备变量
  const variables: Record<string, string> = {
    mode,
    serverInfo: serverInfo
      ? `
## Server Information

- Host: ${serverInfo.host}
- Username: ${serverInfo.username}
- All commands will be executed on this server
`
      : '',
    serverEnvDoc: serverEnvDoc
      ? `
## Server Environment Documentation

${serverEnvDoc}
`
      : ''
  }

  // 生成提示词
  const prompt = replaceVariables(baseTemplate, variables)

  // 添加安全规范
  const fullPrompt = mode === 'build' ? `${prompt}\n\n${SAFETY_PROMPT}` : prompt

  return fullPrompt
}

/**
 * 生成工具描述 (用于 AI API - 结构化格式)
 */
export function getToolDescriptions(mode: PromptMode): object[] {
  const allTools = [
    {
      type: 'function',
      function: {
        name: 'execute_ssh_command',
        description: 'Execute a command on the remote server via SSH',
        parameters: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'The shell command to execute'
            },
            verify: {
              type: 'boolean',
              description: 'Ask for confirmation before execution',
              default: true
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
              default: 30000
            }
          },
          required: ['command']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'read_file',
        description: 'Read file content from the remote server',
        parameters: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Absolute path to the file'
            },
            encoding: {
              type: 'string',
              enum: ['utf-8', 'base64'],
              description: 'File encoding',
              default: 'utf-8'
            }
          },
          required: ['path']
        }
      }
    },
    {
      type: 'function',
      function: {
        name: 'list_files',
        description: 'List directory contents on the remote server',
        parameters: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Directory path to list',
              default: '.'
            }
          },
          required: ['path']
        }
      }
    }
  ]

  // plan 模式只返回只读工具
  if (mode === 'plan') {
    return allTools.filter(tool => {
      const name = (tool as any).function.name
      return name === 'read_file' || name === 'list_files'
    })
  }

  return allTools
}

/**
 * 获取建议的模型配置
 */
export function getModelConfig(mode: PromptMode) {
  const templateConfig = getTemplateConfig(mode)

  return {
    temperature: templateConfig.temperature,
    maxTokens: mode === 'plan' ? 4096 : 8192
  }
}

/**
 * 从 SkillRegistry 生成工具描述文本
 * 如果 SkillRegistry 不可用，返回默认工具描述
 */
export function generateToolDescriptionsText(): string {
  try {
    const registry = getSkillRegistry()
    const tools = registry.getAllTools()

    if (tools.length === 0) {
      return getDefaultToolDescriptionsText()
    }

    const sections: string[] = []

    for (const tool of tools) {
      if (!tool) continue
      const toolName = tool.name
      const description = tool.description
      const params = tool.parameters.properties

      let section = `### ${toolName}\n\n${description}\n\nParameters:\n`

      for (const [paramName, param] of Object.entries(params)) {
        const p = param as any
        const requiredList = tool.parameters.required || []
        const required = requiredList.includes(paramName) ? '(required)' : '(optional)'
        const typeInfo = p.enum ? ` (${p.enum.join(' | ')})` : ` (${p.type})`
        const defaultInfo = p.default !== undefined ? ` (default: ${p.default})` : ''
        section += `- \`${paramName}\`${typeInfo}${defaultInfo}: ${p.description} ${required}\n`
      }

      section += `\nExample:\n\`\`\`xml\n<${toolName}>\n`

      for (const [paramName] of Object.entries(params)) {
        section += `<${paramName}>value</${paramName}>\n`
      }

      section += `</${toolName}>\n\`\`\``
      sections.push(section)
    }

    return `## Available Tools\n\n${sections.join('\n\n')}`
  } catch {
    return getDefaultToolDescriptionsText()
  }
}

/**
 * 默认工具描述文本
 */
function getDefaultToolDescriptionsText(): string {
  return `## Available Tools

### execute_ssh_command
Execute a command on the remote server via SSH.

Parameters:
- \`command\` (required): The shell command to execute
- \`verify\` (optional): Ask for confirmation before execution (default: true)
- \`timeout\` (optional): Timeout in milliseconds (default: 30000)

Example:
\`\`\`xml
<execute_ssh_command>
<command>ls -la /var/www</command>
<verify>true</verify>
</execute_ssh_command>
\`\`\`

### read_file
Read file content from the remote server.

Parameters:
- \`path\` (required): Absolute path to the file
- \`encoding\` (optional): File encoding, 'utf-8' or 'base64' (default: utf-8)

Example:
\`\`\`xml
<read_file>
<path>/etc/nginx/nginx.conf</path>
</read_file>
\`\`\`

### list_files
List directory contents on the remote server.

Parameters:
- \`path\` (required): Directory path to list (default: .)

Example:
\`\`\`xml
<list_files>
<path>/home/user/projects</path>
</list_files>
\`\`\``
}
