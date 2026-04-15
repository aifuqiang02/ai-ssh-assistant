/**
 * 文档存储服务
 * 管理本地 markdown 文件的存储，按功能分类组织
 */
import { app } from 'electron'
import fs from 'fs/promises'
import type { Stats } from 'fs'
import path from 'path'

// 文档类型定义
export enum DocCategory {
  SSH_SERVER_ENV = 'ssh/server-env', // SSH 服务器环境文档
  SSH_NOTES = 'ssh/notes', // SSH 相关笔记
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

class DocStorageService {
  private baseDir: string

  constructor() {
    // 文档存储基础目录
    this.baseDir = path.join(app.getPath('userData'), 'docs')
  }

  /**
   * 获取文档目录路径
   */
  private getCategoryDir(category: DocCategory): string {
    return path.join(this.baseDir, category)
  }

  /**
   * 确保目录存在
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }

  /**
   * 获取文档完整路径
   */
  private getDocPath(category: DocCategory, filename: string): string {
    const categoryDir = this.getCategoryDir(category)
    // 确保文件名以 .md 结尾
    const mdFilename = filename.endsWith('.md') ? filename : `${filename}.md`
    return path.join(categoryDir, mdFilename)
  }

  /**
   * 生成安全的文件名（去除特殊字符）
   */
  private sanitizeFilename(name: string): string {
    return name
      .replace(/[<>:"/\\|?*]/g, '_') // 替换非法字符
      .replace(/\s+/g, '_') // 空格替换为下划线
      .replace(/_+/g, '_') // 多个下划线合并为一个
      .replace(/^_+|_+$/g, '') // 去除首尾下划线
  }

  /**
   * 初始化目录结构
   */
  async initialize(): Promise<void> {
    // 创建所有分类目录
    const categories = Object.values(DocCategory)
    for (const category of categories) {
      const categoryDir = this.getCategoryDir(category)
      await this.ensureDirectory(categoryDir)
    }
    console.log('[DocStorage] 文档目录初始化完成:', this.baseDir)
  }

  /**
   * 创建或更新文档
   */
  async saveDoc(category: DocCategory, filename: string, content: string): Promise<DocFile> {
    // 规范化文件名
    const safeFilename = this.sanitizeFilename(filename)
    const docPath = this.getDocPath(category, safeFilename)

    // 确保目录存在
    await this.ensureDirectory(path.dirname(docPath))

    // 获取文件状态（如果存在）
    let stats: Stats | null = null
    try {
      stats = await fs.stat(docPath)
    } catch {
      // 文件不存在，使用当前时间
    }

    // 写入文件
    await fs.writeFile(docPath, content, 'utf-8')

    // 获取新的文件状态
    const newStats = await fs.stat(docPath)

    return {
      id: path.basename(docPath, '.md'),
      category,
      filename: safeFilename,
      content,
      fullPath: docPath,
      createdAt: stats?.birthtime || new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * 读取文档
   */
  async readDoc(category: DocCategory, filename: string): Promise<DocFile | null> {
    try {
      const safeFilename = this.sanitizeFilename(filename)
      const docPath = this.getDocPath(category, safeFilename)

      const content = await fs.readFile(docPath, 'utf-8')
      const stats = await fs.stat(docPath)

      return {
        id: path.basename(docPath, '.md'),
        category,
        filename: safeFilename,
        content,
        fullPath: docPath,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null
      }
      throw error
    }
  }

  /**
   * 删除文档
   */
  async deleteDoc(category: DocCategory, filename: string): Promise<boolean> {
    try {
      const safeFilename = this.sanitizeFilename(filename)
      const docPath = this.getDocPath(category, safeFilename)

      await fs.unlink(docPath)
      return true
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return false
      }
      throw error
    }
  }

  /**
   * 列出分类下的所有文档
   */
  async listDocs(category: DocCategory): Promise<DocFile[]> {
    try {
      const categoryDir = this.getCategoryDir(category)

      // 确保目录存在
      await this.ensureDirectory(categoryDir)

      const files = await fs.readdir(categoryDir)
      const docs: DocFile[] = []

      for (const file of files) {
        // 只处理 .md 文件
        if (!file.endsWith('.md')) {
          continue
        }

        try {
          const docPath = path.join(categoryDir, file)
          const content = await fs.readFile(docPath, 'utf-8')
          const stats = await fs.stat(docPath)

          docs.push({
            id: path.basename(file, '.md'),
            category,
            filename: file,
            content,
            fullPath: docPath,
            createdAt: stats.birthtime,
            updatedAt: stats.mtime
          })
        } catch (error) {
          console.error(`[DocStorage] 读取文档失败: ${file}`, error)
        }
      }

      // 按更新时间排序（最新的在前）
      docs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

      return docs
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return []
      }
      throw error
    }
  }

  /**
   * 检查文档是否存在
   */
  async exists(category: DocCategory, filename: string): Promise<boolean> {
    try {
      const safeFilename = this.sanitizeFilename(filename)
      const docPath = this.getDocPath(category, safeFilename)
      await fs.access(docPath)
      return true
    } catch {
      return false
    }
  }

  /**
   * 获取 SSH 连接的服务器环境文档路径
   */
  getServerEnvDocPath(connectionId: string): string {
    const filename = `${connectionId}.md`
    return this.getDocPath(DocCategory.SSH_SERVER_ENV, filename)
  }

  /**
   * 创建或更新 SSH 连接的服务器环境文档
   */
  async saveServerEnvDoc(connectionId: string, content: string): Promise<DocFile> {
    const filename = `${connectionId}.md`
    console.info('[DocStorage:electron] 保存服务器环境文档', {
      connectionId,
      filename,
      fullPath: this.getServerEnvDocPath(connectionId),
      contentLength: content.length
    })
    return this.saveDoc(DocCategory.SSH_SERVER_ENV, filename, content)
  }

  /**
   * 读取 SSH 连接的服务器环境文档
   */
  async readServerEnvDoc(connectionId: string): Promise<DocFile | null> {
    const filename = `${connectionId}.md`
    console.info('[DocStorage:electron] 读取服务器环境文档', {
      connectionId,
      filename,
      fullPath: this.getServerEnvDocPath(connectionId)
    })
    return this.readDoc(DocCategory.SSH_SERVER_ENV, filename)
  }
}

// 单例实例
let docStorageService: DocStorageService | null = null

export function getDocStorageService(): DocStorageService {
  if (!docStorageService) {
    docStorageService = new DocStorageService()
    // 初始化目录结构（异步，不阻塞）
    docStorageService.initialize().catch(error => {
      console.error('[DocStorage] 初始化失败:', error)
    })
  }
  return docStorageService
}
