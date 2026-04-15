/**
 * 工具定义类型
 * 参考 OpenCode 项目设计，提供标准化的工具描述格式
 */

/**
 * 工具参数属性定义
 */
export interface ToolParameterProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
  enum?: string[]
  default?: any
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
}

/**
 * 工具参数定义
 */
export interface ToolParameters {
  type: 'object'
  properties: Record<string, ToolParameterProperty>
  required?: string[]
  additionalProperties?: boolean
}

/**
 * 工具定义
 */
export interface ToolDefinition {
  /** 工具唯一标识符 */
  name: string
  /** 工具描述，供 AI 模型理解 */
  description: string
  /** 参数定义 */
  parameters: ToolParameters
  /** 是否启用 */
  enabled?: boolean
  /** 所属技能 ID */
  skillId?: string
  /** 权限要求 */
  permission?: string
}

/**
 * SSH 执行工具定义
 */
export interface SSHExecuteTool extends ToolDefinition {
  name: 'execute_ssh_command'
  description: 'Execute a command on the remote server via SSH'
  parameters: {
    type: 'object'
    properties: {
      command: ToolParameterProperty & { type: 'string' }
      verify: ToolParameterProperty & { type: 'boolean'; default: true }
      timeout: ToolParameterProperty & { type: 'number'; default: 30000 }
    }
    required: ['command']
  }
  skillId: 'ssh'
  permission: 'ssh:execute'
}

/**
 * 文件读取工具定义
 */
export interface FileReadTool extends ToolDefinition {
  name: 'read_file'
  description: 'Read file content from the remote server'
  parameters: {
    type: 'object'
    properties: {
      path: ToolParameterProperty & { type: 'string' }
      encoding: ToolParameterProperty & {
        type: 'string'
        enum: ['utf-8', 'base64']
        default: 'utf-8'
      }
    }
    required: ['path']
  }
  skillId: 'ssh'
  permission: 'ssh:read'
}

/**
 * 文件列表工具定义
 */
export interface ListFilesTool extends ToolDefinition {
  name: 'list_files'
  description: 'List directory contents on the remote server'
  parameters: {
    type: 'object'
    properties: {
      path: ToolParameterProperty & { type: 'string'; default: '.' }
    }
    required: ['path']
  }
  skillId: 'ssh'
  permission: 'ssh:read'
}

/**
 * 预定义的 SSH 工具列表
 */
export const SSH_TOOLS: ToolDefinition[] = [
  {
    name: 'execute_ssh_command',
    description: 'Execute a command on the remote server via SSH',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The command to execute' },
        verify: {
          type: 'boolean',
          description: 'Ask for confirmation before execution',
          default: true
        },
        timeout: { type: 'number', description: 'Timeout in milliseconds', default: 30000 }
      },
      required: ['command']
    },
    enabled: true,
    skillId: 'ssh',
    permission: 'ssh:execute'
  },
  {
    name: 'read_file',
    description: 'Read file content from the remote server',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Absolute path to the file' },
        encoding: {
          type: 'string',
          enum: ['utf-8', 'base64'],
          description: 'File encoding',
          default: 'utf-8'
        }
      },
      required: ['path']
    },
    enabled: true,
    skillId: 'ssh',
    permission: 'ssh:read'
  },
  {
    name: 'list_files',
    description: 'List directory contents on the remote server',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Directory path to list', default: '.' }
      },
      required: ['path']
    },
    enabled: true,
    skillId: 'ssh',
    permission: 'ssh:read'
  }
]
