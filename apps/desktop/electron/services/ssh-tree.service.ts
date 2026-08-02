/**
 * SSH 树形结构管理服务
 * 使用 Prisma 统一管理数据（local.db）
 */

import { storageManager } from '../main/storage'
import {
  SSH_CONNECTION_EXPORT_FORMAT,
  SSH_CONNECTION_EXPORT_VERSION,
  normalizeStoredAuthType,
  prepareConnectionImport,
  type SSHConnectionExportEnvelope,
  type SSHConnectionImportResult
} from './ssh-connection-transfer'

export interface SSHFolder {
  id: string
  userId: string
  name: string
  parentId?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface SSHConnectionConfig {
  id: string
  name: string
  host: string
  port: number
  username: string
  authType: string
  password?: string
  privateKey?: string
  publicKey?: string
  passphrase?: string
  folderId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateFolderDto {
  name: string
  parentId?: string
  order?: number
}

export interface UpdateFolderDto {
  name?: string
  parentId?: string
  order?: number
}

export interface CreateConnectionDto {
  name: string
  host: string
  port?: number
  username: string
  authType: 'password' | 'privateKey' | 'agent'
  password?: string
  privateKey?: string
  publicKey?: string
  passphrase?: string
  folderId?: string
  order?: number
}

export interface UpdateConnectionDto {
  name?: string
  host?: string
  port?: number
  username?: string
  authType?: 'password' | 'privateKey' | 'agent'
  password?: string
  privateKey?: string
  publicKey?: string
  passphrase?: string
  folderId?: string
  order?: number
}

export class SSHTreeService {
  // ============= 文件夹管理 =============

  async createFolder(userId: string, data: CreateFolderDto): Promise<SSHFolder> {
    console.log('[SSHTreeService] Creating folder:', { userId, data })

    const folder = await storageManager.create('SSHFolder', {
      userId,
      name: data.name,
      parentId: data.parentId || null,
      order: data.order || 0
    })

    console.log('[SSHTreeService] Folder created:', folder.id)
    return folder
  }

  async updateFolder(userId: string, folderId: string, data: UpdateFolderDto): Promise<SSHFolder> {
    console.log('[SSHTreeService] Updating folder:', { userId, folderId, data })

    const folder = await storageManager.update('SSHFolder', {
      where: { id: folderId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.order !== undefined && { order: data.order })
      }
    })

    console.log('[SSHTreeService] Folder updated:', folderId)
    return folder
  }

  async getFolder(userId: string, folderId: string): Promise<SSHFolder | null> {
    return storageManager.findUnique('SSHFolder', {
      where: { id: folderId }
    })
  }

  async deleteFolder(userId: string, folderId: string): Promise<void> {
    console.log('[SSHTreeService] Deleting folder:', { userId, folderId })

    await storageManager.delete('SSHFolder', {
      where: { id: folderId }
    })

    console.log('[SSHTreeService] Folder deleted:', folderId)
  }

  // ============= 连接配置管理 =============

  async createConnection(userId: string, data: CreateConnectionDto): Promise<SSHConnectionConfig> {
    console.log('[SSHTreeService] Creating connection:', { userId, data })

    const connection = await storageManager.create('SSHConnection', {
      userId,
      name: data.name,
      host: data.host,
      port: data.port || 22,
      username: data.username,
      authType: data.authType.toUpperCase(),
      password: data.password || null,
      privateKey: data.privateKey || null,
      publicKey: data.publicKey || null,
      passphrase: data.passphrase || null,
      folderId: data.folderId || null,
      status: 'DISCONNECTED',
      isActive: true
    })

    console.log('[SSHTreeService] Connection created:', connection.id)
    return connection
  }

  async updateConnection(
    userId: string,
    connectionId: string,
    data: UpdateConnectionDto
  ): Promise<SSHConnectionConfig> {
    console.log('[SSHTreeService] Updating connection:', { userId, connectionId, data })

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.host !== undefined) updateData.host = data.host
    if (data.port !== undefined) updateData.port = data.port
    if (data.username !== undefined) updateData.username = data.username
    if (data.authType !== undefined) updateData.authType = data.authType.toUpperCase()
    if (data.password !== undefined) updateData.password = data.password
    if (data.privateKey !== undefined) updateData.privateKey = data.privateKey
    if (data.publicKey !== undefined) updateData.publicKey = data.publicKey
    if (data.passphrase !== undefined) updateData.passphrase = data.passphrase
    if (data.folderId !== undefined) updateData.folderId = data.folderId

    const connection = await storageManager.update('SSHConnection', {
      where: { id: connectionId },
      data: updateData
    })

    console.log('[SSHTreeService] Connection updated:', connectionId)
    return connection
  }

  async deleteConnection(userId: string, connectionId: string): Promise<void> {
    console.log('[SSHTreeService] Deleting connection:', { userId, connectionId })

    await storageManager.delete('SSHConnection', {
      where: { id: connectionId }
    })

    console.log('[SSHTreeService] Connection deleted:', connectionId)
  }

  async exportConnections(userId: string): Promise<SSHConnectionExportEnvelope> {
    const connections = await storageManager.findMany('SSHConnection', {
      where: { userId },
      orderBy: { createdAt: 'asc' }
    })

    return {
      format: SSH_CONNECTION_EXPORT_FORMAT,
      version: SSH_CONNECTION_EXPORT_VERSION,
      connections: connections
        .filter((connection: any) =>
          connection.isActive === true || connection.isActive === 1 || connection.isActive === '1'
        )
        .map((connection: any) => ({
          name: connection.name,
          host: connection.host,
          port: connection.port,
          username: connection.username,
          authType: normalizeStoredAuthType(connection.authType),
          ...(connection.password && { password: connection.password }),
          ...(connection.privateKey && { privateKey: connection.privateKey }),
          ...(connection.publicKey && { publicKey: connection.publicKey }),
          ...(connection.passphrase && { passphrase: connection.passphrase })
        }))
    }
  }

  async importConnections(userId: string, envelope: unknown): Promise<SSHConnectionImportResult> {
    const existing = await storageManager.findMany('SSHConnection', { where: { userId } })
    const prepared = prepareConnectionImport(
      envelope,
      existing.map((connection: any) => connection.host)
    )

    for (const connection of prepared.connections) {
      await storageManager.create('SSHConnection', {
        userId,
        ...connection,
        folderId: null,
        status: 'DISCONNECTED',
        isActive: true
      })
    }

    return prepared.result
  }

  // ============= 树形结构 =============

  async getSSHTree(userId: string): Promise<any[]> {
    console.log('[SSHTreeService] Getting SSH tree for user:', userId)

    // 获取所有文件夹
    const folders = await storageManager.findMany('SSHFolder', {
      where: { userId },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    })

    // 获取所有连接
    const connections = await storageManager.findMany('SSHConnection', {
      where: { userId },
      orderBy: { createdAt: 'asc' }
    })

    // 过滤活跃连接（isActive 为 true 或 1）
    const activeConnections = connections.filter(
      (c: any) => c.isActive === true || c.isActive === 1 || c.isActive === '1'
    )

    // 构建树形结构
    const tree: any[] = []

    // 添加根级文件夹
    folders
      .filter((f: any) => !f.parentId)
      .forEach((folder: any) => {
        tree.push({
          id: folder.id,
          name: folder.name,
          type: 'folder',
          parentId: null,
          order: folder.order,
          createdAt: formatDate(folder.createdAt),
          updatedAt: formatDate(folder.updatedAt),
          children: this.buildFolderChildren(folder.id, folders, activeConnections)
        })
      })

    // 添加根级连接
    activeConnections
      .filter((c: any) => !c.folderId)
      .forEach((connection: any) => {
        tree.push({
          id: connection.id,
          name: connection.name,
          type: 'connection',
          host: connection.host,
          port: connection.port,
          username: connection.username,
          authType: connection.authType,
          password: connection.password,
          privateKey: connection.privateKey,
          passphrase: connection.passphrase,
          folderId: null,
          createdAt: formatDate(connection.createdAt),
          updatedAt: formatDate(connection.updatedAt)
        })
      })

    return tree
  }

  private buildFolderChildren(folderId: string, folders: any[], connections: any[]): any[] {
    const children: any[] = []

    // 添加子文件夹
    folders
      .filter(f => f.parentId === folderId)
      .forEach(folder => {
        children.push({
          id: folder.id,
          name: folder.name,
          type: 'folder',
          parentId: folderId,
          order: folder.order,
          createdAt: formatDate(folder.createdAt),
          updatedAt: formatDate(folder.updatedAt),
          children: this.buildFolderChildren(folder.id, folders, connections)
        })
      })

    // 添加该文件夹下的连接
    const folderConnections = connections.filter(c => c.folderId === folderId)
    folderConnections.forEach(connection => {
      children.push({
        id: connection.id,
        name: connection.name,
        type: 'connection',
        host: connection.host,
        port: connection.port,
        username: connection.username,
        authType: connection.authType,
        password: connection.password,
        privateKey: connection.privateKey,
        passphrase: connection.passphrase,
        folderId: folderId,
        createdAt: formatDate(connection.createdAt),
        updatedAt: formatDate(connection.updatedAt)
      })
    })

    return children
  }

  // ============= 节点移动 =============

  async moveNode(
    userId: string,
    nodeId: string,
    nodeType: 'folder' | 'connection',
    targetFolderId: string | null,
    order: number
  ): Promise<void> {
    console.log('[SSHTreeService] Moving node:', {
      userId,
      nodeId,
      nodeType,
      targetFolderId,
      order
    })

    if (nodeType === 'folder') {
      await storageManager.update('SSHFolder', {
        where: { id: nodeId },
        data: {
          parentId: targetFolderId,
          order
        }
      })
    } else {
      await storageManager.update('SSHConnection', {
        where: { id: nodeId },
        data: {
          folderId: targetFolderId
        }
      })
    }

    console.log('[SSHTreeService] Node moved:', nodeId)
  }
}

// 创建服务实例
let sshTreeServiceInstance: SSHTreeService | null = null

export function getSSHTreeService(): SSHTreeService {
  if (!sshTreeServiceInstance) {
    sshTreeServiceInstance = new SSHTreeService()
  }
  return sshTreeServiceInstance
}

function formatDate(date: Date | string | null | undefined): string | null {
  if (!date) return null
  if (typeof date === 'string') return date
  if (date instanceof Date) return date.toISOString()
  return null
}
