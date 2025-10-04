import { PrismaClient } from '@ai-ssh/database'
import type {
  ChatTreeNode,
  CreateChatFolderDto,
  UpdateChatFolderDto,
  CreateChatSessionDto,
  UpdateChatSessionDto,
  MoveChatNodeDto
} from '@ai-ssh/shared'

export class ChatService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * 获取用户的聊天树形结构
   */
  async getUserChatTree(userId: string): Promise<ChatTreeNode[]> {
    // 获取所有文件夹
    const folders = await this.prisma.chatFolder.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: {
        sessions: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { messages: true }
            }
          }
        }
      }
    })

    // 获取根级别的会话（没有文件夹的）
    const rootSessions = await this.prisma.chatSession.findMany({
      where: {
        userId,
        folderId: null
      },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    })

    // 构建树形结构
    const tree: ChatTreeNode[] = []

    // 添加根级别文件夹
    const rootFolders = folders.filter(f => !f.parentId)
    for (const folder of rootFolders) {
      tree.push(this.buildFolderNode(folder, folders))
    }

    // 添加根级别会话
    for (const session of rootSessions) {
      tree.push(this.buildSessionNode(session))
    }

    return tree.sort((a, b) => a.order - b.order)
  }

  /**
   * 构建文件夹节点
   */
  private buildFolderNode(folder: any, allFolders: any[]): ChatTreeNode {
    const children: ChatTreeNode[] = []

    // 添加子文件夹
    const subFolders = allFolders.filter(f => f.parentId === folder.id)
    for (const sub of subFolders) {
      children.push(this.buildFolderNode(sub, allFolders))
    }

    // 添加该文件夹下的会话
    if (folder.sessions) {
      for (const session of folder.sessions) {
        children.push(this.buildSessionNode(session))
      }
    }

    return {
      id: folder.id,
      name: folder.name,
      type: 'folder',
      order: folder.order,
      parentId: folder.parentId,
      children: children.sort((a, b) => a.order - b.order)
    }
  }

  /**
   * 构建会话节点
   */
  private buildSessionNode(session: any): ChatTreeNode {
    const messageCount = session._count?.messages || 0
    
    // 提取 model 从 config
    let model: string | undefined
    if (session.config && typeof session.config === 'object') {
      model = (session.config as any).model
    }

    return {
      id: session.id,
      name: session.title,
      type: 'session',
      order: session.order,
      folderId: session.folderId,
      messageCount,
      lastMessageAt: session.updatedAt,
      model
    }
  }

  /**
   * 创建文件夹
   */
  async createFolder(userId: string, data: CreateChatFolderDto) {
    return await this.prisma.chatFolder.create({
      data: {
        name: data.name,
        parentId: data.parentId || null,
        order: data.order || 0,
        userId
      }
    })
  }

  /**
   * 更新文件夹
   */
  async updateFolder(userId: string, id: string, data: UpdateChatFolderDto) {
    // 验证文件夹是否属于用户
    const folder = await this.prisma.chatFolder.findUnique({
      where: { id }
    })

    if (!folder || folder.userId !== userId) {
      throw new Error('文件夹不存在或无权限')
    }

    return await this.prisma.chatFolder.update({
      where: { id },
      data: {
        name: data.name,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
        order: data.order
      }
    })
  }

  /**
   * 删除文件夹
   */
  async deleteFolder(userId: string, id: string) {
    // 验证文件夹是否属于用户
    const folder = await this.prisma.chatFolder.findUnique({
      where: { id }
    })

    if (!folder || folder.userId !== userId) {
      throw new Error('文件夹不存在或无权限')
    }

    // 删除文件夹（会话会设置为 null，不会被删除）
    await this.prisma.chatFolder.delete({
      where: { id }
    })
  }

  /**
   * 创建会话
   */
  async createSession(userId: string, data: CreateChatSessionDto) {
    return await this.prisma.chatSession.create({
      data: {
        title: data.title,
        folderId: data.folderId || null,
        order: data.order || 0,
        userId,
        config: data.model ? { model: data.model } : undefined
      }
    })
  }

  /**
   * 更新会话
   */
  async updateSession(userId: string, id: string, data: UpdateChatSessionDto) {
    // 验证会话是否属于用户
    const session = await this.prisma.chatSession.findUnique({
      where: { id }
    })

    if (!session || session.userId !== userId) {
      throw new Error('会话不存在或无权限')
    }

    const updateData: any = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.folderId !== undefined) updateData.folderId = data.folderId
    if (data.order !== undefined) updateData.order = data.order
    if (data.model !== undefined) {
      updateData.config = { model: data.model }
    }

    return await this.prisma.chatSession.update({
      where: { id },
      data: updateData
    })
  }

  /**
   * 删除会话
   */
  async deleteSession(userId: string, id: string) {
    // 验证会话是否属于用户
    const session = await this.prisma.chatSession.findUnique({
      where: { id }
    })

    if (!session || session.userId !== userId) {
      throw new Error('会话不存在或无权限')
    }

    // 删除会话（会级联删除消息）
    await this.prisma.chatSession.delete({
      where: { id }
    })
  }

  /**
   * 移动节点（文件夹或会话）
   */
  async moveNode(userId: string, data: MoveChatNodeDto) {
    // 首先检查是文件夹还是会话
    const folder = await this.prisma.chatFolder.findUnique({
      where: { id: data.nodeId }
    })

    if (folder) {
      // 移动文件夹
      if (folder.userId !== userId) {
        throw new Error('无权限移动此文件夹')
      }

      return await this.prisma.chatFolder.update({
        where: { id: data.nodeId },
        data: {
          parentId: data.targetFolderId || null,
          order: data.order || 0
        }
      })
    } else {
      // 移动会话
      const session = await this.prisma.chatSession.findUnique({
        where: { id: data.nodeId }
      })

      if (!session || session.userId !== userId) {
        throw new Error('无权限移动此会话')
      }

      return await this.prisma.chatSession.update({
        where: { id: data.nodeId },
        data: {
          folderId: data.targetFolderId || null,
          order: data.order || 0
        }
      })
    }
  }
}

