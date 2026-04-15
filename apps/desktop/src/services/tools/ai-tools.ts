import { z } from 'zod'
import { executeSSHCommand, readRemoteFile, listRemoteDirectory } from '../ssh/ssh-command.service'

export interface ToolContext {
  connectionId: string
  onProgress?: (progress: string) => void
}

export function createSSHCommandTool(context: ToolContext) {
  return {
    name: 'execute_ssh_command',
    description: 'Execute a shell command on the remote server via SSH',
    inputSchema: z.object({
      command: z.string().describe('The shell command to execute')
    }),
    execute: async ({ command }: { command: string }) => {
      context.onProgress?.(`Executing: ${command}`)
      const result = await executeSSHCommand(context.connectionId, command)
      return `<command_result>\n${result.output}\n</command_result>`
    }
  }
}

export function createReadFileTool(context: ToolContext) {
  return {
    name: 'read_file',
    description: 'Read file content from the remote server',
    inputSchema: z.object({
      path: z.string().describe('Absolute path to the file to read'),
      encoding: z.enum(['utf-8', 'base64']).optional().default('utf-8').describe('File encoding')
    }),
    execute: async ({ path, encoding }: { path: string; encoding?: string }) => {
      const result = await readRemoteFile(context.connectionId, path)
      if (!result.success) {
        throw new Error(result.error || `Failed to read file: ${path}`)
      }
      return `<file_content path="${path}">\n${result.output}\n</file_content>`
    }
  }
}

export function createListFilesTool(context: ToolContext) {
  return {
    name: 'list_files',
    description: 'List directory contents on the remote server',
    inputSchema: z.object({
      path: z.string().optional().default('.').describe('Directory path to list'),
      show_hidden: z
        .boolean()
        .optional()
        .default(false)
        .describe('Show hidden files and directories')
    }),
    execute: async ({ path, show_hidden }: { path?: string; show_hidden?: boolean }) => {
      const result = await listRemoteDirectory(
        context.connectionId,
        path ?? '.',
        show_hidden ?? false
      )
      if (!result.success) {
        throw new Error(result.error || `Failed to list directory: ${path}`)
      }
      return `<directory_listing path="${path}">\n${result.output}\n</directory_listing>`
    }
  }
}

export function createAttemptCompletionTool() {
  return {
    name: 'attempt_completion',
    description: 'Mark the task as complete and provide a summary',
    inputSchema: z.object({
      result: z.string().describe('Summary of what was accomplished')
    }),
    execute: async ({ result }: { result: string }) => {
      return `<completion>\n${result}\n</completion>`
    }
  }
}

export function createAskFollowupQuestionTool() {
  return {
    name: 'ask_followup_question',
    description: 'Ask the user a clarifying question',
    inputSchema: z.object({
      question: z.string().describe('The question to ask the user')
    }),
    execute: async ({ question }: { question: string }) => {
      return `<followup_question>\n${question}\n</followup_question>`
    }
  }
}

export function createTools(context: ToolContext) {
  return {
    execute_ssh_command: createSSHCommandTool(context),
    read_file: createReadFileTool(context),
    list_files: createListFilesTool(context),
    attempt_completion: createAttemptCompletionTool(),
    ask_followup_question: createAskFollowupQuestionTool()
  }
}

export type AITools = ReturnType<typeof createTools>
