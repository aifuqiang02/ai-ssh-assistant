// 工具系统类型定义

/**
 * 工具调用参数
 */
export interface ToolUseParams {
  [key: string]: any
}

/**
 * 工具调用
 */
export interface ToolUse {
  name: string
  params: ToolUseParams
  partial: boolean
}

/**
 * 工具结果
 */
export interface ToolResult {
  success: boolean
  content: string
  error?: string
  images?: string[]
}

/**
 * 工具定义
 */
export interface ToolDefinition {
  name: string
  description: string
  parameters: {
    [key: string]: {
      type: string
      description: string
      required?: boolean
    }
  }
}

/**
 * 工具批准请求
 */
export interface ToolApprovalRequest {
  tool: string
  params: ToolUseParams
  description: string
  timestamp: number
}

/**
 * 工具批准响应
 */
export interface ToolApprovalResponse {
  approved: boolean
  feedback?: string
}

/**
 * 支持的工具列表
 */
export enum ToolName {
  EXECUTE_SSH_COMMAND = 'execute_ssh_command',
  READ_FILE = 'read_file',
  WRITE_FILE = 'write_file',
  LIST_FILES = 'list_files',
  ASK_FOLLOWUP = 'ask_followup_question',
  ATTEMPT_COMPLETION = 'attempt_completion',
}

/**
 * 工具执行器接口
 */
export interface ToolExecutor {
  (
    params: ToolUseParams,
    onProgress?: (progress: string) => void
  ): Promise<ToolResult>
}

