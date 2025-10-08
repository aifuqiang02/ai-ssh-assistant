// 工具执行器

import type { ToolResult, ToolUseParams } from '../../types/tools'
import { executeSSHCommand, readRemoteFile, listRemoteDirectory } from '../ssh/ssh-command.service'

/**
 * SSH 命令执行工具
 */
export async function executeSSHCommandTool(
  params: ToolUseParams,
  connectionId: string,
  onProgress?: (progress: string) => void
): Promise<ToolResult> {
  const command = params.command as string

  if (!command) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: command'
    }
  }

  try {
    onProgress?.(`Executing command: ${command}`)
    const result = await executeSSHCommand(connectionId, command)

    return {
      success: true,
      content: `<command_result>\n${result.output}\n</command_result>`
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: `Command execution failed: ${error.message}`
    }
  }
}

/**
 * 文件读取工具
 */
export async function readFileTool(
  params: ToolUseParams,
  connectionId: string
): Promise<ToolResult> {
  const path = params.path as string

  if (!path) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: path'
    }
  }

  try {
    // 使用封装的读取文件方法
    const result = await readRemoteFile(connectionId, path)

    if (!result.success) {
      return {
        success: false,
        content: '',
        error: result.error || `Failed to read file: ${path}`
      }
    }

    return {
      success: true,
      content: `<file_content path="${path}">\n${result.output}\n</file_content>`
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: `Failed to read file: ${error.message}`
    }
  }
}

/**
 * 文件列表工具
 */
export async function listFilesTool(
  params: ToolUseParams,
  connectionId: string
): Promise<ToolResult> {
  const path = params.path as string || '.'
  const showHidden = params.show_hidden === 'true' || params.show_hidden === true

  try {
    // 使用封装的列出目录方法
    const result = await listRemoteDirectory(connectionId, path, showHidden)

    if (!result.success) {
      return {
        success: false,
        content: '',
        error: result.error || `Failed to list files: ${path}`
      }
    }

    return {
      success: true,
      content: `<file_list path="${path}">\n${result.output}\n</file_list>`
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: `Failed to list files: ${error.message}`
    }
  }
}

/**
 * 询问后续问题工具
 */
export async function askFollowupQuestionTool(
  params: ToolUseParams
): Promise<ToolResult> {
  const question = params.question as string

  if (!question) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: question'
    }
  }

  return {
    success: true,
    content: `<followup_question>${question}</followup_question>`
  }
}

/**
 * 尝试完成工具
 */
export async function attemptCompletionTool(
  params: ToolUseParams
): Promise<ToolResult> {
  const result = params.result as string

  if (!result) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: result'
    }
  }

  return {
    success: true,
    content: `<completion_result>${result}</completion_result>`
  }
}

/**
 * 解析 XML 工具调用
 */
export function parseToolUse(content: string): {
  toolName: string
  params: ToolUseParams
} | null {
  // 匹配 XML 格式的工具调用
  const toolMatch = content.match(/<(\w+)>([\s\S]*?)<\/\1>/)

  if (!toolMatch) {
    return null
  }

  const toolName = toolMatch[1]
  const paramsContent = toolMatch[2]

  // 解析参数
  const params: ToolUseParams = {}
  const paramMatches = paramsContent.matchAll(/<(\w+)>([\s\S]*?)<\/\1>/g)

  for (const match of paramMatches) {
    const paramName = match[1]
    const paramValue = match[2].trim()
    params[paramName] = paramValue
  }

  return { toolName, params }
}

/**
 * 执行工具
 */
export async function executeTool(
  toolName: string,
  params: ToolUseParams,
  connectionId: string,
  onProgress?: (progress: string) => void
): Promise<ToolResult> {
  let result: ToolResult
  
  switch (toolName) {
    case 'execute_ssh_command':
      result = await executeSSHCommandTool(params, connectionId, onProgress)
      break

    case 'read_file':
      result = await readFileTool(params, connectionId)
      break

    case 'list_files':
      result = await listFilesTool(params, connectionId)
      break

    case 'ask_followup_question':
      result = await askFollowupQuestionTool(params)
      break

    case 'attempt_completion':
      result = await attemptCompletionTool(params)
      break

    default:
      result = {
        success: false,
        content: '',
        error: `Unknown tool: ${toolName}`
      }
  }
  
  return result
}
