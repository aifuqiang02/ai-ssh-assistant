/**
 * SSH Skill
 *
 * 将 SSH 工具封装为可复用的技能
 */

import type { Skill } from '@ai-ssh/shared'
import type { ToolDefinition } from '@ai-ssh/shared'
import { SSH_TOOLS } from '@ai-ssh/shared'
import { SSH_SYSTEM_PROMPT } from '../../tools/prompt-templates'
import {
  executeSSHCommand,
  readRemoteFile,
  listRemoteDirectory
} from '../../ssh/ssh-command.service'
import { checkCommandPermission, type ChatMode } from '../../permissions'

/**
 * SSH Skill 信息
 */
export const sshSkillInfo = {
  id: 'ssh',
  name: 'SSH Server Management',
  version: '1.0.0',
  description: 'Manage remote Linux servers via SSH connection',
  author: 'AI SSH Assistant',
  homepage: 'https://github.com/ai-ssh-assistant'
}

/**
 * SSH 工具名称
 */
export const SSH_TOOL_NAMES = {
  EXECUTE: 'execute_ssh_command',
  READ: 'read_file',
  LIST: 'list_files'
} as const

/**
 * 获取当前连接 ID
 */
function getCurrentConnectionId(): string {
  return ''
}

/**
 * SSH Skill 执行器
 */
export function createSSHExecutor() {
  return async (
    toolName: string,
    params: Record<string, any>,
    context: SkillContext
  ): Promise<SkillResult> => {
    const connectionId = getCurrentConnectionId()

    if (!connectionId) {
      return {
        success: false,
        content: '',
        error: 'No SSH connection available'
      }
    }

    try {
      switch (toolName) {
        case SSH_TOOL_NAMES.EXECUTE:
          return await executeCommand(connectionId, params, context)
        case SSH_TOOL_NAMES.READ:
          return await readRemoteFileTool(connectionId, params)
        case SSH_TOOL_NAMES.LIST:
          return await listFilesTool(connectionId, params)
        default:
          return {
            success: false,
            content: '',
            error: `Unknown tool: ${toolName}`
          }
      }
    } catch (error) {
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}

/**
 * 执行 SSH 命令
 */
async function executeCommand(
  connectionId: string,
  params: Record<string, any>,
  context: SkillContext
): Promise<SkillResult> {
  const command = params.command as string
  const verify = params.verify as boolean | undefined
  const timeout = params.timeout as number | undefined
  const mode = ((context as any).mode as ChatMode) || 'agent'

  if (!command) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: command'
    }
  }

  const permission = checkCommandPermission(command, mode)

  if (permission.action === 'deny') {
    return {
      success: false,
      content: '',
      error: `Command blocked for safety reasons.\n\n${permission.reason || 'This command matches a dangerous pattern.'}`
    }
  }

  if (verify !== false && permission.requiresConfirmation) {
    await context.ask({
      permission: 'ssh:execute',
      patterns: [command],
      always: false,
      metadata: {
        title: 'Confirm SSH Command',
        description: permission.rule?.description || 'This command requires your confirmation'
      }
    })
  }

  const result = await executeSSHCommand(connectionId, command)

  return {
    success: result.success,
    content: result.output,
    error: result.error,
    metadata: {
      command,
      timeout,
      permission: permission.action
    }
  }
}

/**
 * 读取远程文件
 */
async function readRemoteFileTool(
  connectionId: string,
  params: Record<string, any>
): Promise<SkillResult> {
  const path = params.path as string
  const encoding = params.encoding as string | undefined

  if (!path) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: path'
    }
  }

  const result = await readRemoteFile(connectionId, path)

  if (result.success) {
    return {
      success: true,
      content: `<file_content path="${path}">\n${result.output}\n</file_content>`,
      metadata: { path, encoding }
    }
  } else {
    return {
      success: false,
      content: '',
      error: result.error || `Failed to read file: ${path}`
    }
  }
}

/**
 * 列出远程目录
 */
async function listFilesTool(
  connectionId: string,
  params: Record<string, any>
): Promise<SkillResult> {
  const path = (params.path as string) || '.'
  const showHidden = params.show_hidden === true || params.show_hidden === 'true'

  const result = await listRemoteDirectory(connectionId, path, showHidden)

  if (result.success) {
    return {
      success: true,
      content: `<file_list path="${path}">\n${result.output}\n</file_list>`,
      metadata: { path }
    }
  } else {
    return {
      success: false,
      content: '',
      error: result.error || `Failed to list files: ${path}`
    }
  }
}

// 类型声明
interface SkillContext {
  sessionId: string
  agent: string
  abort: AbortSignal
  ask(input: {
    permission: string
    patterns: string[]
    always?: boolean
    metadata?: Record<string, any>
  }): Promise<void>
  metadata(input: { title?: string; metadata?: Record<string, any> }): void
}

interface SkillResult {
  success: boolean
  content: string
  error?: string
  metadata?: Record<string, any>
}

/**
 * 创建 SSH Skill 实例
 */
export function createSSHSkill(): Skill {
  return {
    info: sshSkillInfo,
    tools: SSH_TOOLS,
    systemPrompt: SSH_SYSTEM_PROMPT,
    execute: async (toolName: string, params: Record<string, any>) => {
      const executor = createSSHExecutor()
      return executor(toolName, params, {
        sessionId: '',
        agent: 'ssh',
        abort: new AbortController().signal,
        async ask() {},
        metadata() {}
      })
    }
  }
}
