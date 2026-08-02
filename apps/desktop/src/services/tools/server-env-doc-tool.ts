/**
 * 服务器环境文档工具
 * 让 AI 自动收集服务器信息并生成/更新文档
 */
import type { ToolResult, ToolUseParams } from '../../types/tools'
import { docStorageService } from '../doc-storage.service'

/**
 * 编辑服务器环境文档 - 灵活编辑模式
 * 像编辑源代码一样，可以在文档任何位置进行增删改
 */
export async function generateServerEnvDocTool(
  params: ToolUseParams,
  connectionId: string
): Promise<ToolResult> {
  try {
    const docId = connectionId

    // 用户提供的更新内容（必需参数）
    const newContent = typeof params.content === 'string' ? params.content.trim() : ''

    // 如果没有内容，不进行更新
    if (!newContent) {
      return {
        success: false,
        content: '',
        error: '需要提供要保存的内容'
      }
    }

    console.info('[ServerEnvDocTool] 更新服务器环境文档', {
      docId,
      connectionId,
      contentLength: newContent.length
    })

    // 保存文档（直接替换整个文档内容）
    await docStorageService.saveServerEnvDoc(docId, newContent)

    return {
      success: true,
      content: '服务器环境文档已更新保存'
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: `编辑服务器环境文档失败: ${error.message}`
    }
  }
}

/**
 * 读取服务器环境文档工具
 */
export async function readServerEnvDocTool(
  params: ToolUseParams,
  connectionId: string
): Promise<ToolResult> {
  try {
    const docId = connectionId
    console.info('[ServerEnvDocTool] 读取服务器环境文档', {
      docId,
      connectionId
    })
    const doc = await docStorageService.readServerEnvDoc(docId)
    
    if (!doc) {
      return {
        success: false,
        content: '',
        error: '服务器环境文档不存在，请先使用 update_server_env_doc 工具初始化文档'
      }
    }

    return {
      success: true,
      content: `服务器环境文档内容：

${doc.content.substring(0, 2000)}${doc.content.length > 2000 ? '...\\n\\n(文档内容较长，已截断)' : ''}

文档最后更新: ${new Date(doc.updatedAt).toLocaleString('zh-CN')}`
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      error: `读取服务器环境文档失败: ${error.message}`
    }
  }
}
