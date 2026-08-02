import { Tool } from './tool'
import z from 'zod'
import { executeSSHCommand, readRemoteFile, listRemoteDirectory } from '../ssh/ssh-command.service'
import { DocCategory, docStorageService } from '../doc-storage.service'
import { fetchWebContent } from './webfetch.service'

function looksLikeFullServerEnvDoc(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false

  return (
    trimmed.startsWith('# ') ||
    trimmed.includes('## System Information') ||
    trimmed.includes('## Installed Software') ||
    trimmed.includes('服务器环境文档') ||
    trimmed.length > 200
  )
}

const getBackupFilename = (docId: string, reason: 'replace-document' | 'exact-replace') => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .replace('Z', '')
  return `${docId}-server-env-backup-${reason}-${timestamp}`
}

const createServerEnvBackup = async (
  docId: string,
  currentContent: string,
  reason: 'replace-document' | 'exact-replace'
) => {
  if (!currentContent.trim()) {
    return
  }

  const backupFilename = getBackupFilename(docId, reason)
  const backupBody = [
    `# Server Env Backup: ${docId}`,
    '',
    `- Reason: ${reason}`,
    `- Created At: ${new Date().toISOString()}`,
    '',
    '---',
    '',
    currentContent
  ].join('\n')

  await docStorageService.saveDoc(DocCategory.SSH_NOTES, backupFilename, backupBody)
}

const buildExactReplacement = (currentContent: string, nextContent: string) => {
  if (currentContent === nextContent) {
    return null
  }

  let prefixLength = 0
  const maxPrefixLength = Math.min(currentContent.length, nextContent.length)
  while (
    prefixLength < maxPrefixLength &&
    currentContent[prefixLength] === nextContent[prefixLength]
  ) {
    prefixLength += 1
  }

  let suffixLength = 0
  const maxSuffixLength = Math.min(
    currentContent.length - prefixLength,
    nextContent.length - prefixLength
  )
  while (
    suffixLength < maxSuffixLength &&
    currentContent[currentContent.length - 1 - suffixLength] ===
      nextContent[nextContent.length - 1 - suffixLength]
  ) {
    suffixLength += 1
  }

  return {
    oldString: currentContent.slice(prefixLength, currentContent.length - suffixLength),
    newString: nextContent.slice(prefixLength, nextContent.length - suffixLength)
  }
}

export const ExecuteSSHCommandTool = Tool.define('execute_ssh_command', async () => {
  return {
    description: 'Execute a command on the remote server via SSH',
    parameters: z.object({
      command: z.string().describe('The command to execute')
    }),
    async execute({ command }, ctx) {
      const connectionId = ctx.extra?.connectionId
      if (!connectionId) {
        throw new Error('No SSH connection available')
      }

      ctx.metadata({ title: `Executing: ${command}` })
      const result = await executeSSHCommand(connectionId, command, ctx.abort)
      if (!result.success) {
        throw new Error(result.error || `SSH command failed: ${command}`)
      }
      return {
        title: `Executed: ${command}`,
        metadata: {},
        output: `<command_result>\n${result.output}\n</command_result>`
      }
    }
  }
})

export const ReadFileTool = Tool.define('read_file', async () => {
  return {
    description: 'Read file content from the remote server',
    parameters: z.object({
      path: z.string().describe('Absolute path to the file')
    }),
    async execute({ path }, ctx) {
      const connectionId = ctx.extra?.connectionId
      if (!connectionId) {
        throw new Error('No SSH connection available')
      }

      const result = await readRemoteFile(connectionId, path, ctx.abort)
      if (!result.success) {
        throw new Error(result.error || `Failed to read file: ${path}`)
      }
      return {
        title: `Read: ${path}`,
        metadata: {},
        output: `<file_content path="${path}">\n${result.output}\n</file_content>`
      }
    }
  }
})

export const ListFilesTool = Tool.define('list_files', async () => {
  return {
    description: 'List directory contents on the remote server',
    parameters: z.object({
      path: z.string().describe('Directory path to list').optional().default('.')
    }),
    async execute({ path }, ctx) {
      const connectionId = ctx.extra?.connectionId
      if (!connectionId) {
        throw new Error('No SSH connection available')
      }

      const result = await listRemoteDirectory(connectionId, path ?? '.', false, ctx.abort)
      if (!result.success) {
        throw new Error(result.error || `Failed to list directory: ${path}`)
      }
      return {
        title: `Listed: ${path}`,
        metadata: {},
        output: `<directory_listing path="${path}">\n${result.output}\n</directory_listing>`
      }
    }
  }
})

export const AttemptCompletionTool = Tool.define('attempt_completion', async () => {
  return {
    description: 'Mark the task as complete and provide a summary',
    parameters: z.object({
      result: z.string().describe('Summary of what was accomplished')
    }),
    async execute({ result }) {
      return {
        title: 'Task completed',
        metadata: {},
        output: `<completion>\n${result}\n</completion>`
      }
    }
  }
})

export const AskFollowupQuestionTool = Tool.define('ask_followup_question', async () => {
  return {
    description: 'Ask the user a clarifying question',
    parameters: z.object({
      question: z.string().describe('The question to ask')
    }),
    async execute({ question }) {
      return {
        title: 'Question',
        metadata: {},
        output: `<followup_question>\n${question}\n</followup_question>`
      }
    }
  }
})

export const ReadServerEnvDocTool = Tool.define('read_server_env_doc', async () => {
  return {
    description:
      "Read the canonical env.md from the authenticated remote user's $HOME. Returns raw content for update_server_env_doc.",
    parameters: z.object({}),
    async execute(_params: any, ctx) {
      const docId = ctx.extra?.connectionId
      if (!docId) {
        throw new Error('No document ID or connection ID available')
      }

      console.info('[SSHTools] 读取服务器环境文档', {
        tool: 'read_server_env_doc',
        docId,
        connectionId: ctx.extra?.connectionId,
        serverEnvDocId: ctx.extra?.serverEnvDocId
      })

      const doc = await docStorageService.readServerEnvDoc(docId)

      return {
        title: 'Server Environment Document',
        metadata: {},
        output: doc ? doc.content : '服务器环境文档不存在'
      }
    }
  }
})

export const UpdateServerEnvDocTool = Tool.define('update_server_env_doc', async () => {
  return {
    description:
      "Update the canonical env.md in the authenticated remote user's $HOME using an atomic remote write. Default to old_string/new_string exact replacements for existing documents. Use content only when creating a new document or when the user explicitly requests a full rewrite. Only set force_replace=true after the user explicitly confirms a full-document overwrite.",
    parameters: z.object({
      content: z
        .string()
        .optional()
        .describe(
          'The complete updated server environment document content. Preferred for initializing or replacing the whole document.'
        ),
      old_string: z
        .string()
        .optional()
        .describe(
          'The exact text to find and replace. Copy this directly from the document without any changes.'
        ),
      new_string: z
        .string()
        .optional()
        .describe('The text to replace old_string with. Use empty string "" to delete content.'),
      force_replace: z
        .preprocess(value => {
          if (value === 'true') return true
          if (value === 'false') return false
          return z.boolean().optional().parse(value)
        }, z.boolean().optional())
        .optional()
        .describe('Set true only when the user explicitly confirms full-document overwrite.')
    }),
    async execute(params: any, ctx) {
      const docId = ctx.extra?.connectionId
      if (!docId) {
        throw new Error('No document ID or connection ID available')
      }

      const content = typeof params.content === 'string' ? params.content : ''
      const oldString = typeof params.old_string === 'string' ? params.old_string : ''
      const newString = typeof params.new_string === 'string' ? params.new_string : ''
      const forceReplace = params.force_replace === true
      const existingDoc = await docStorageService.readServerEnvDoc(docId)
      const existingContent = existingDoc?.content || ''

      console.info('[SSHTools] 更新服务器环境文档', {
        tool: 'update_server_env_doc',
        docId,
        connectionId: ctx.extra?.connectionId,
        serverEnvDocId: ctx.extra?.serverEnvDocId,
        mode: content ? 'replace-document' : 'exact-replace',
        forceReplace,
        contentLength: content.length,
        oldLength: oldString.length,
        newLength: newString.length
      })

      if (oldString) {
        await createServerEnvBackup(docId, existingContent, 'exact-replace')

        try {
          await docStorageService.editServerEnvDoc(docId, oldString, newString)
        } catch (error) {
          throw error
        }
      } else if (content) {
        if (existingContent && !forceReplace) {
          if (!looksLikeFullServerEnvDoc(content)) {
            throw new Error(
              'content 仅适用于整篇环境文档更新。已有文档的局部修改请使用 old_string/new_string。'
            )
          }

          const exactReplacement = buildExactReplacement(existingContent, content)
          if (!exactReplacement) {
            return {
              title: 'Server Environment Document Unchanged',
              metadata: {},
              output: '文档内容未发生变化'
            }
          }

          await createServerEnvBackup(docId, existingContent, 'exact-replace')
          await docStorageService.editServerEnvDoc(
            docId,
            exactReplacement.oldString,
            exactReplacement.newString
          )

          return {
            title: 'Server Environment Document Updated',
            metadata: {},
            output: '已根据整篇内容自动收敛为精确替换并更新文档内容'
          }
        }

        await createServerEnvBackup(docId, existingContent, 'replace-document')
        await docStorageService.saveServerEnvDoc(docId, content)
      } else {
        throw new Error('content or old_string is required')
      }

      return {
        title: 'Server Environment Document Updated',
        metadata: {},
        output: '已更新文档内容'
      }
    }
  }
})

export const WebFetchTool = Tool.define('webfetch', async () => {
  return {
    description: 'Fetch and extract content from a web page URL',
    parameters: z.object({
      url: z.string().describe('The URL to fetch (e.g., https://example.com or example.com)')
    }),
    async execute({ url }) {
      const result = await fetchWebContent(url)

      if (!result.success) {
        throw new Error(result.error || `Failed to fetch: ${url}`)
      }

      return {
        title: result.title || `Fetched: ${result.url}`,
        metadata: {
          url: result.url,
          title: result.title
        },
        output: `<web_content url="${result.url}"${result.title ? ` title="${result.title}"` : ''}>
${result.content}
</web_content>`
      }
    }
  }
})

export const SSH_TOOLS = [
  ExecuteSSHCommandTool,
  ReadFileTool,
  ListFilesTool,
  AttemptCompletionTool,
  AskFollowupQuestionTool,
  ReadServerEnvDocTool,
  UpdateServerEnvDocTool,
  WebFetchTool
]
