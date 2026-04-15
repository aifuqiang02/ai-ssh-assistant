// 工具执行器

import type { ToolResult, ToolUseParams } from '../../types/tools'
import { executeSSHCommand, readRemoteFile, listRemoteDirectory } from '../ssh/ssh-command.service'
import { generateServerEnvDocTool, readServerEnvDocTool } from './server-env-doc-tool'

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
  const path = (params.path as string) || '.'
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
export async function askFollowupQuestionTool(params: ToolUseParams): Promise<ToolResult> {
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
export async function attemptCompletionTool(params: ToolUseParams): Promise<ToolResult> {
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
 * 列出本地目录中的文件和子目录（支持任意路径）
 * 用于项目分析场景，AI 可以探索用户的项目目录
 */
export async function listLocalDirectoryTool(params: ToolUseParams): Promise<ToolResult> {
  const directory = params.directory as string

  if (!directory) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: directory'
    }
  }

  try {
    const files = await window.electronAPI.fs.readdir(directory)
    const fileStats = await Promise.all(
      files.map(async (name: string) => {
        try {
          const fullPath = `${directory}/${name}`
          const stat = await window.electronAPI.fs.stat(fullPath)
          return {
            name,
            type: stat.isDirectory ? 'directory' : 'file',
            size: stat.isDirectory ? null : stat.size
          }
        } catch {
          return { name, type: 'unknown', size: null }
        }
      })
    )

    const fileList = fileStats
      .map(f => {
        const sizeStr = f.size !== null ? ` (${Math.round(f.size / 1024)}KB)` : ''
        return `- ${f.name} [${f.type}]${sizeStr}`
      })
      .join('\n')

    return {
      success: true,
      content: `📂 目录: ${directory}\n\n${fileList}`
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: `Failed to list directory: ${error.message}`
    }
  }
}

/**
 * 读取本地文件内容（支持任意路径）
 * 用于项目分析场景，AI 可以读取项目配置文件、README 等
 */
export async function readLocalFileTool(params: ToolUseParams): Promise<ToolResult> {
  const filePath = params.file_path as string

  if (!filePath) {
    return {
      success: false,
      content: '',
      error: 'Missing required parameter: file_path'
    }
  }

  try {
    const content = await window.electronAPI.fs.readFile(filePath)
    const lines = content.split('\n').length
    const chars = content.length

    return {
      success: true,
      content: `✅ 已读取文件: ${filePath} (${lines} 行, ${chars} 字符)`,
      data: content // 完整内容给 AI 分析
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
 * 列出可用的 SSH 连接
 * 用于项目分析场景，AI 可以在生成部署配置时引用正确的连接 ID
 */
export async function listSshConnectionsTool(): Promise<ToolResult> {
  try {
    // 动态获取当前用户 ID
    const { getLocalUserId } = await import('@/services/base/service-factory')
    const userId = getLocalUserId()

    // 获取 SSH 连接树
    const tree = await (window as any).api.ssh.getTree(userId)

    // 从树中提取所有连接
    const connections: any[] = []
    const extractConnections = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.type === 'connection') {
          connections.push({
            id: node.id,
            name: node.name || node.host,
            host: node.host,
            port: node.port || 22,
            username: node.username
          })
        }
        if (node.children) {
          extractConnections(node.children)
        }
      }
    }

    if (tree && Array.isArray(tree)) {
      extractConnections(tree)
    }

    if (connections.length === 0) {
      return {
        success: true,
        content: '⚠️ 当前没有可用的 SSH 连接，请先在 SSH 管理界面添加连接'
      }
    }

    const connectionList = connections
      .map(
        c => `- ${c.name} (ID: ${c.id})
  └─ ${c.username}@${c.host}:${c.port}`
      )
      .join('\n')

    return {
      success: true,
      content: `📡 可用的 SSH 连接 (${connections.length} 个):\n\n${connectionList}`,
      data: JSON.stringify(connections, null, 2) // 完整数据给 AI
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: `Failed to list SSH connections: ${error.message}`
    }
  }
}

/**
 * 验证 XML 格式是否正确
 */
export function validateXMLFormat(content: string): {
  isValid: boolean
  error?: string
} {
  // 检查是否包含 XML 标签
  if (!content.includes('<') || !content.includes('>')) {
    return { isValid: false, error: 'No XML tags found' }
  }

  // 使用简单正则检查匹配标签
  const tagMatches = content.match(/<(\w+)>([\s\S]*?)<\/\1>/g)

  if (tagMatches && tagMatches.length === 1) {
    return { isValid: true }
  }

  // 检查是否有不完整的标签
  const openTags = content.match(/<(\w+)[^>]*>/g) || []
  const closeTags = content.match(/<\/(\w+)>/g) || []

  if (openTags.length !== closeTags.length) {
    return { isValid: false, error: 'Mismatched opening and closing tags' }
  }

  return { isValid: false, error: 'Invalid tool call format' }
}

/**
 * 解析 XML 工具调用 - 简化版本
 */
export function parseToolUse(content: string): {
  toolName: string
  params: ToolUseParams
} | null {
  // 严格的正则匹配：必须完整匹配 <tool_name>...</tool_name>
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
  const validTools = [
    'execute_ssh_command',
    'read_file',
    'list_files',
    'ask_followup_question',
    'attempt_completion',
    'list_local_directory',
    'read_local_file',
    'list_ssh_connections',
    'read_server_env_doc',
    'update_server_env_doc',
    'generate_server_env_doc'
  ]

  // 验证工具名是否有效
  if (!validTools.includes(toolName)) {
    return {
      success: false,
      content: '',
      error: `Invalid tool name: ${toolName}. Valid tools: ${validTools.join(', ')}`
    }
  }

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

    case 'list_local_directory':
      result = await listLocalDirectoryTool(params)
      break

    case 'read_local_file':
      result = await readLocalFileTool(params)
      break

    case 'list_ssh_connections':
      result = await listSshConnectionsTool()
      break

    case 'generate_server_env_doc':
      console.warn('[ToolExecutor] generate_server_env_doc 已废弃，转交给统一的环境文档更新逻辑')
      result = await generateServerEnvDocTool(params, connectionId)
      break

    case 'update_server_env_doc':
      result = await generateServerEnvDocTool(params, connectionId)
      break

    case 'read_server_env_doc':
      result = await readServerEnvDocTool(params, connectionId)
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
