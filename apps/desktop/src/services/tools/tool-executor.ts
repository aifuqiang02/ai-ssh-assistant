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
  console.log('[SSH Command Tool] 开始执行')
  console.log('[SSH Command Tool] 参数:', params)
  console.log('[SSH Command Tool] 连接ID:', connectionId)
  
  const command = params.command as string

  if (!command) {
    console.error('[SSH Command Tool] ❌ 缺少 command 参数')
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: command'
    }
  }

  console.log('[SSH Command Tool] 命令:', command)

  try {
    onProgress?.(`Executing command: ${command}`)
    console.log('[SSH Command Tool] 调用 executeSSHCommand...')

    const result = await executeSSHCommand(connectionId, command)
    
    console.log('[SSH Command Tool] executeSSHCommand 返回:', result)
    console.log('[SSH Command Tool] 成功:', result.success)
    console.log('[SSH Command Tool] 输出长度:', result.output?.length || 0)

    return {
      success: true,
      content: `<command_result>\n${result.output}\n</command_result>`
    }
  } catch (error: any) {
    console.error('[SSH Command Tool] ❌ 执行失败:', error)
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
  console.log('[Tool Parser] 开始解析工具调用')
  console.log('[Tool Parser] 内容长度:', content.length)
  console.log('[Tool Parser] 内容预览:', content.substring(0, 200))
  
  // 匹配 XML 格式的工具调用
  const toolMatch = content.match(/<(\w+)>([\s\S]*?)<\/\1>/)

  if (!toolMatch) {
    console.log('[Tool Parser] ❌ 未找到工具调用')
    return null
  }

  const toolName = toolMatch[1]
  const paramsContent = toolMatch[2]
  
  console.log('[Tool Parser] ✅ 找到工具:', toolName)
  console.log('[Tool Parser] 参数内容:', paramsContent)

  // 解析参数
  const params: ToolUseParams = {}
  const paramMatches = paramsContent.matchAll(/<(\w+)>([\s\S]*?)<\/\1>/g)

  for (const match of paramMatches) {
    const paramName = match[1]
    const paramValue = match[2].trim()
    params[paramName] = paramValue
    console.log(`[Tool Parser] 参数 ${paramName}:`, paramValue)
  }

  console.log('[Tool Parser] 解析完成:', { toolName, params })
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
  console.log('[Tool Executor] 开始执行工具')
  console.log('[Tool Executor] 工具名称:', toolName)
  console.log('[Tool Executor] 参数:', params)
  console.log('[Tool Executor] 连接ID:', connectionId)
  
  let result: ToolResult
  
  switch (toolName) {
    case 'execute_ssh_command':
      console.log('[Tool Executor] → 执行 SSH 命令工具')
      result = await executeSSHCommandTool(params, connectionId, onProgress)
      break

    case 'read_file':
      console.log('[Tool Executor] → 执行读取文件工具')
      result = await readFileTool(params, connectionId)
      break

    case 'list_files':
      console.log('[Tool Executor] → 执行列出文件工具')
      result = await listFilesTool(params, connectionId)
      break

    case 'ask_followup_question':
      console.log('[Tool Executor] → 执行询问问题工具')
      result = await askFollowupQuestionTool(params)
      break

    case 'attempt_completion':
      console.log('[Tool Executor] → 执行完成任务工具')
      result = await attemptCompletionTool(params)
      break

    default:
      console.log('[Tool Executor] ❌ 未知工具:', toolName)
      result = {
        success: false,
        content: '',
        error: `Unknown tool: ${toolName}`
      }
  }
  
  console.log('[Tool Executor] 执行结果:', result.success ? '✅ 成功' : '❌ 失败')
  if (!result.success) {
    console.error('[Tool Executor] 错误信息:', result.error)
  }
  
  return result
}

