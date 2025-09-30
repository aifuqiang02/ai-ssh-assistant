import { PrismaClient } from '../../../database/src/generated/client-postgresql/index.js'
import { Client as SSHClient } from 'ssh2'
import type {
  SSHFolder,
  SSHConnection,
  CreateSSHFolderDto,
  UpdateSSHFolderDto,
  CreateSSHConnectionDto,
  UpdateSSHConnectionDto,
  MoveNodeDto,
  SSHTreeNode
} from '@ai-ssh/shared'

export class SSHService {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * 获取用户的 SSH 树形结构
   */
  async getUserSSHTree(userId: string): Promise<SSHTreeNode[]> {
    // 获取所有文件夹
    const folders = await this.prisma.sSHFolder.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: {
        connections: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // 获取根级别的连接（没有文件夹的）
    const rootConnections = await this.prisma.sSHConnection.findMany({
      where: {
        userId,
        folderId: null
      },
      orderBy: { order: 'asc' }
    })

    // 构建树形结构
    const tree: SSHTreeNode[] = []

    // 添加根级别文件夹
    const rootFolders = folders.filter(f => !f.parentId)
    for (const folder of rootFolders) {
      tree.push(this.buildFolderNode(folder, folders))
    }

    // 添加根级别连接
    for (const conn of rootConnections) {
      tree.push(this.buildConnectionNode(conn))
    }

    return tree.sort((a, b) => a.order - b.order)
  }

  /**
   * 构建文件夹节点
   */
  private buildFolderNode(folder: any, allFolders: any[]): SSHTreeNode {
    const children: SSHTreeNode[] = []

    // 添加子文件夹
    const subFolders = allFolders.filter(f => f.parentId === folder.id)
    for (const subFolder of subFolders) {
      children.push(this.buildFolderNode(subFolder, allFolders))
    }

    // 添加该文件夹下的连接
    if (folder.connections) {
      for (const conn of folder.connections) {
        children.push(this.buildConnectionNode(conn))
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
   * 构建连接节点
   */
  private buildConnectionNode(conn: any): SSHTreeNode {
    return {
      id: conn.id,
      name: conn.name,
      type: 'connection',
      order: conn.order,
      host: conn.host,
      port: conn.port,
      username: conn.username,
      password: conn.password,
      authType: conn.authType,
      status: conn.status,
      folderId: conn.folderId
    }
  }

  /**
   * 创建文件夹
   */
  async createFolder(userId: string, data: CreateSSHFolderDto): Promise<SSHFolder> {
    // 验证父文件夹所有权（如果有）
    if (data.parentId) {
      await this.validateFolderOwnership(data.parentId, userId)
    }

    return this.prisma.sSHFolder.create({
      data: {
        name: data.name,
        parentId: data.parentId,
        order: data.order ?? 0,
        userId
      }
    }) as any
  }

  /**
   * 更新文件夹
   */
  async updateFolder(folderId: string, userId: string, data: UpdateSSHFolderDto): Promise<SSHFolder> {
    await this.validateFolderOwnership(folderId, userId)

    // 如果要移动到新父文件夹，验证新父文件夹所有权
    if (data.parentId) {
      await this.validateFolderOwnership(data.parentId, userId)
    }

    return this.prisma.sSHFolder.update({
      where: { id: folderId },
      data: {
        name: data.name,
        parentId: data.parentId,
        order: data.order
      }
    }) as any
  }

  /**
   * 删除文件夹（及其所有子项）- 物理删除
   */
  async deleteFolder(folderId: string, userId: string): Promise<void> {
    await this.validateFolderOwnership(folderId, userId)

    // Prisma 会自动级联删除子文件夹和连接（通过 onDelete: Cascade）
    await this.prisma.sSHFolder.delete({
      where: { id: folderId }
    })
  }

  /**
   * 创建 SSH 连接
   */
  async createConnection(userId: string, data: CreateSSHConnectionDto): Promise<SSHConnection> {
    // 验证文件夹所有权（如果有）
    if (data.folderId) {
      await this.validateFolderOwnership(data.folderId, userId)
    }

    return this.prisma.sSHConnection.create({
      data: {
        name: data.name,
        host: data.host,
        port: data.port ?? 22,
        username: data.username,
        authType: data.authType,
        password: data.password,
        privateKey: data.privateKey,
        publicKey: data.publicKey,
        passphrase: data.passphrase,
        folderId: data.folderId,
        order: data.order ?? 0,
        meta: data.meta,
        userId
      }
    }) as any
  }

  /**
   * 更新 SSH 连接
   */
  async updateConnection(connectionId: string, userId: string, data: UpdateSSHConnectionDto): Promise<SSHConnection> {
    await this.validateConnectionOwnership(connectionId, userId)

    // 如果要移动到新文件夹，验证新文件夹所有权
    if (data.folderId) {
      await this.validateFolderOwnership(data.folderId, userId)
    }

    return this.prisma.sSHConnection.update({
      where: { id: connectionId },
      data: {
        name: data.name,
        host: data.host,
        port: data.port,
        username: data.username,
        authType: data.authType,
        password: data.password,
        privateKey: data.privateKey,
        publicKey: data.publicKey,
        passphrase: data.passphrase,
        folderId: data.folderId,
        order: data.order,
        meta: data.meta
      }
    }) as any
  }

  /**
   * 删除 SSH 连接 - 物理删除
   */
  async deleteConnection(connectionId: string, userId: string): Promise<void> {
    await this.validateConnectionOwnership(connectionId, userId)

    await this.prisma.sSHConnection.delete({
      where: { id: connectionId }
    })
  }

  /**
   * 移动节点（文件夹或连接）
   */
  async moveNode(userId: string, data: MoveNodeDto): Promise<void> {
    if (data.nodeType === 'folder') {
      await this.validateFolderOwnership(data.nodeId, userId)
      
      if (data.targetFolderId) {
        await this.validateFolderOwnership(data.targetFolderId, userId)
      }

      await this.prisma.sSHFolder.update({
        where: { id: data.nodeId },
        data: {
          parentId: data.targetFolderId,
          order: data.order ?? 0
        }
      })
    } else {
      await this.validateConnectionOwnership(data.nodeId, userId)
      
      if (data.targetFolderId) {
        await this.validateFolderOwnership(data.targetFolderId, userId)
      }

      await this.prisma.sSHConnection.update({
        where: { id: data.nodeId },
        data: {
          folderId: data.targetFolderId,
          order: data.order ?? 0
        }
      })
    }
  }

  /**
   * 验证文件夹所有权
   */
  private async validateFolderOwnership(folderId: string, userId: string): Promise<void> {
    const folder = await this.prisma.sSHFolder.findUnique({
      where: { id: folderId }
    })

    if (!folder) {
      throw new Error('文件夹不存在')
    }

    if (folder.userId !== userId) {
      throw new Error('无权操作此文件夹')
    }
  }

  /**
   * 验证连接所有权
   */
  private async validateConnectionOwnership(connectionId: string, userId: string): Promise<void> {
    const connection = await this.prisma.sSHConnection.findUnique({
      where: { id: connectionId }
    })

    if (!connection) {
      throw new Error('连接不存在')
    }

    if (connection.userId !== userId) {
      throw new Error('无权操作此连接')
    }
  }

  /**
   * 测试 SSH 连接
   */
  async testConnection(config: {
    host: string
    port?: number
    username: string
    authType: 'PASSWORD' | 'PRIVATE_KEY' | 'SSH_AGENT'
    password?: string | null
    privateKey?: string | null
    passphrase?: string | null
  }): Promise<{ connected: boolean; error?: string }> {
    const client = new SSHClient()

    console.log('Testing SSH connection:', {
      host: config.host,
      port: config.port || 22,
      username: config.username,
      authType: config.authType
    })

    return new Promise((resolve) => {
      // 设置 15 秒超时
      const timeout = setTimeout(() => {
        console.log('SSH connection timeout')
        client.end()
        resolve({
          connected: false,
          error: '连接超时（15秒）'
        })
      }, 15000)

      client.on('ready', () => {
        console.log('SSH connection successful')
        clearTimeout(timeout)
        client.end()
        resolve({
          connected: true
        })
      })

      client.on('error', (err: any) => {
        console.error('SSH connection error:', err.message, err.level)
        clearTimeout(timeout)
        client.end()
        
        // 提供更友好的错误信息
        let errorMessage = err.message || '连接失败'
        
        if (err.level === 'client-authentication') {
          errorMessage = '认证失败：用户名、密码或密钥不正确'
        } else if (err.code === 'ENOTFOUND') {
          errorMessage = '主机地址无法解析，请检查主机地址'
        } else if (err.code === 'ECONNREFUSED') {
          errorMessage = '连接被拒绝，请检查主机地址和端口是否正确'
        } else if (err.code === 'ETIMEDOUT') {
          errorMessage = '连接超时，请检查网络连接和防火墙设置'
        }
        
        resolve({
          connected: false,
          error: errorMessage
        })
      })

      // 构建连接配置
      const connectConfig: any = {
        host: config.host,
        port: config.port || 22,
        username: config.username,
        readyTimeout: 15000,
        tryKeyboard: false // 禁用键盘交互式认证
      }

      // 根据认证类型设置认证信息
      if (config.authType === 'PASSWORD') {
        if (!config.password) {
          clearTimeout(timeout)
          resolve({
            connected: false,
            error: '密码认证需要提供密码'
          })
          return
        }
        connectConfig.password = config.password
        console.log('Using password authentication')
      } else if (config.authType === 'PRIVATE_KEY') {
        if (!config.privateKey) {
          clearTimeout(timeout)
          resolve({
            connected: false,
            error: '私钥认证需要提供私钥'
          })
          return
        }
        connectConfig.privateKey = config.privateKey
        if (config.passphrase) {
          connectConfig.passphrase = config.passphrase
        }
        console.log('Using private key authentication')
      } else if (config.authType === 'SSH_AGENT') {
        // SSH Agent 认证需要特殊处理
        connectConfig.agent = process.env.SSH_AUTH_SOCK
        console.log('Using SSH agent authentication')
      }

      try {
        console.log('Attempting to connect...')
        client.connect(connectConfig)
      } catch (err: any) {
        console.error('Connection attempt failed:', err)
        clearTimeout(timeout)
        resolve({
          connected: false,
          error: err.message || '连接配置错误'
        })
      }
    })
  }
}
