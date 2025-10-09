/**
 * SSH 树形结构管理服务
 * 使用 Prisma 统一管理数据（local.db）
 */

import { storageManager } from '../main/storage'

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
  
  async updateConnection(userId: string, connectionId: string, data: UpdateConnectionDto): Promise<SSHConnectionConfig> {
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
  
  // ============= 树形结构 =============
  
  async getSSHTree(userId: string): Promise<any[]> {
    console.log('[SSHTreeService] Getting SSH tree for user:', userId)
    
    // 获取所有文件夹
    const folders = await storageManager.findMany('SSHFolder', {
      where: { userId },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    })
    
    // 获取所有连接
    const connections = await storageManager.findMany('SSHConnection', {
      where: { userId, isActive: true },
      orderBy: { createdAt: 'asc' }
    })
    
    console.log('[SSHTreeService] Found:', { folders: folders.length, connections: connections.length })
    
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
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          children: this.buildFolderChildren(folder.id, folders, connections)
        })
      })
    
    // 添加根级连接
    connections
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
          createdAt: connection.createdAt,
          updatedAt: connection.updatedAt
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
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          children: this.buildFolderChildren(folder.id, folders, connections)
        })
      })
    
    // 添加该文件夹下的连接
    connections
      .filter(c => c.folderId === folderId)
      .forEach(connection => {
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
          createdAt: connection.createdAt,
          updatedAt: connection.updatedAt
        })
      })
    
    return children
  }
  
  // ============= 节点移动 =============
  
  async moveNode(userId: string, nodeId: string, nodeType: 'folder' | 'connection', targetFolderId: string | null, order: number): Promise<void> {
    console.log('[SSHTreeService] Moving node:', { userId, nodeId, nodeType, targetFolderId, order })
    
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

