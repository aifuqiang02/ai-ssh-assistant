/**
 * 文档存储服务（前端）
 * 管理本地 markdown 文件的存储
 */

// 文档分类枚举（与后端保持一致）
export enum DocCategory {
  SSH_SERVER_ENV = 'ssh/server-env', // SSH 服务器环境文档
  SSH_NOTES = 'ssh/notes', // SSH 相关笔记
  DEPLOY = 'deploy', // 部署相关文档
  NOTES = 'notes' // 其他笔记
}

export interface DocFile {
  id: string
  category: DocCategory
  filename: string
  content: string
  fullPath: string
  createdAt: Date
  updatedAt: Date
}

/**
 * 文档存储服务类
 */
class DocStorageService {
  /**
   * 保存文档
   */
  async saveDoc(category: DocCategory, filename: string, content: string): Promise<DocFile> {
    return await window.electronAPI.docStorage.save(category, filename, content)
  }

  /**
   * 读取文档
   */
  async readDoc(category: DocCategory, filename: string): Promise<DocFile | null> {
    return await window.electronAPI.docStorage.read(category, filename)
  }

  /**
   * 删除文档
   */
  async deleteDoc(category: DocCategory, filename: string): Promise<boolean> {
    return await window.electronAPI.docStorage.delete(category, filename)
  }

  /**
   * 列出分类下的所有文档
   */
  async listDocs(category: DocCategory): Promise<DocFile[]> {
    return await window.electronAPI.docStorage.list(category)
  }

  /**
   * 检查文档是否存在
   */
  async exists(category: DocCategory, filename: string): Promise<boolean> {
    return await window.electronAPI.docStorage.exists(category, filename)
  }

  /**
   * 保存 SSH 连接的服务器环境文档
   */
  async saveServerEnvDoc(connectionId: string, content: string): Promise<DocFile> {
    console.info('[DocStorage] 保存服务器环境文档', {
      connectionId,
      contentLength: content.length
    })
    const doc = await window.electronAPI.ssh.writeEnvDoc(connectionId, content)
    return this.toRemoteEnvDoc(doc)
  }

  /**
   * 读取 SSH 连接的服务器环境文档
   */
  async readServerEnvDoc(connectionId: string): Promise<DocFile | null> {
    console.info('[DocStorage] 读取服务器环境文档', { connectionId })
    const doc = await window.electronAPI.ssh.readEnvDoc(connectionId)
    return doc ? this.toRemoteEnvDoc(doc) : null
  }

  /**
   * 生成服务器环境文档模板
   */
  generateServerEnvTemplate(connectionInfo: {
    name: string
    host: string
    port: number
    username: string
  }): string {
    return `# ${connectionInfo.name} Server Environment Documentation

## System Information

## Installed Software
`
  }

  /**
   * 编辑服务器环境文档
   * 通过精确字符串替换进行编辑
   */
  async editServerEnvDoc(
    connectionId: string,
    oldString: string,
    newString: string
  ): Promise<DocFile> {
    console.info('[DocStorage] 编辑服务器环境文档', {
      connectionId,
      oldLength: oldString.length,
      newLength: newString.length
    })
    const existingDoc = await this.readServerEnvDoc(connectionId)
    const currentContent = existingDoc?.content || ''

    if (!currentContent.includes(oldString)) {
      const preview = currentContent.substring(0, 500)
      throw new Error(
        `old_string not found in document\n\n文档内容预览:\n${preview}...\n\n请重新读取文档，确保 old_string 与文档内容完全匹配（包括空格和换行符）`
      )
    }

    const updatedContent = currentContent.replace(oldString, newString)
    return await this.saveServerEnvDoc(connectionId, updatedContent)
  }

  private toRemoteEnvDoc(doc: { content: string; fullPath: string }): DocFile {
    const now = new Date()
    return {
      id: doc.fullPath,
      category: DocCategory.SSH_SERVER_ENV,
      filename: 'env.md',
      content: doc.content,
      fullPath: doc.fullPath,
      createdAt: now,
      updatedAt: now
    }
  }
}

// 导出单例
export const docStorageService = new DocStorageService()
