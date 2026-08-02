/**
 * SSH 服务 - 统一接口
 * 仅使用本地 Electron 实现
 */

import { createService } from './base/service-factory'
import { BaseLocalImpl } from './base/base-api-impl'

// ============= 接口定义 =============
export interface ISSHService {
  // ======== 树形结构管理 ========
  getSSHTree(): Promise<any[]> // SSHTreeNode[] from @ai-ssh/shared
  exportConnections(): Promise<SSHConnectionExportResult>
  importConnections(): Promise<SSHConnectionImportResult>

  // 文件夹管理
  createFolder(data: any): Promise<any> // CreateSSHFolderDto
  updateFolder(id: string, data: any): Promise<any> // UpdateSSHFolderDto
  deleteFolder(id: string): Promise<void>

  // 连接配置管理（树形结构）
  createConnection(data: any): Promise<any> // CreateSSHConnectionDto
  updateConnection(id: string, data: any): Promise<any> // UpdateSSHConnectionDto
  deleteConnection(id: string): Promise<void>

  // 节点移动
  moveNode(data: any): Promise<void> // MoveNodeDto

  // ======== 运行时连接管理 ========
  connect(config: SSHConfig): Promise<SSHConnection>
  disconnect(id: string): Promise<void>
  getConnections(): Promise<SSHConnection[]>

  // 配置测试
  saveConnection(config: SSHConfig): Promise<SSHConfig>
  testConnection(config: SSHConfig): Promise<TestResult>

  // 命令执行
  execute(id: string, command: string): Promise<CommandResult>
  write(id: string, data: string): Promise<void>

  // 文件操作
  listFiles(id: string, remotePath: string): Promise<FileInfo[]>
  uploadFile(id: string, localPath: string, remotePath: string): Promise<void>
  downloadFile(id: string, remotePath: string, localPath: string): Promise<void>
  deleteFile(id: string, remotePath: string, isDirectory: boolean): Promise<void>
  createDirectory(id: string, remotePath: string): Promise<void>
}

export interface SSHConfig {
  id?: string
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  name?: string
  timeout?: number
  keepAlive?: boolean
  keepAliveInterval?: number
}

export interface SSHConnection {
  id: string
  config: SSHConfig
  status: 'connected' | 'disconnected'
  connectedAt?: number
}

export interface TestResult {
  success: boolean
  message: string
}

export interface CommandResult {
  output: string
  exitCode: number
}

export interface FileInfo {
  name: string
  path: string
  size: number
  isDirectory: boolean
  modifiedAt: number
}

export interface SSHConnectionExportResult {
  canceled: boolean
  exported?: number
}

export interface SSHConnectionImportResult {
  canceled: boolean
  imported?: number
  skipped?: number
  invalid?: number
}

// ============= 本地 IPC 实现 =============
class SSHLocalImpl extends BaseLocalImpl implements ISSHService {
  // ======== 树形结构管理 ========
  async getSSHTree(): Promise<any[]> {
    return this.electronAPI.ssh.getTree(this.getUserId())
  }

  async exportConnections(): Promise<SSHConnectionExportResult> {
    return this.electronAPI.ssh.exportConnections(this.getUserId())
  }

  async importConnections(): Promise<SSHConnectionImportResult> {
    return this.electronAPI.ssh.importConnections(this.getUserId())
  }

  async createFolder(data: any): Promise<any> {
    return this.electronAPI.ssh.createFolder(this.getUserId(), data)
  }

  async updateFolder(id: string, data: any): Promise<any> {
    return this.electronAPI.ssh.updateFolder(this.getUserId(), id, data)
  }

  async deleteFolder(id: string): Promise<void> {
    await this.electronAPI.ssh.deleteFolder(this.getUserId(), id)
  }

  async createConnection(data: any): Promise<any> {
    return this.electronAPI.ssh.createConnection(this.getUserId(), data)
  }

  async updateConnection(id: string, data: any): Promise<any> {
    return this.electronAPI.ssh.updateConnection(this.getUserId(), id, data)
  }

  async deleteConnection(id: string): Promise<void> {
    await this.electronAPI.ssh.deleteConnection(this.getUserId(), id)
  }

  async moveNode(data: any): Promise<void> {
    await this.electronAPI.ssh.moveNode(this.getUserId(), data)
  }

  // ======== 运行时连接管理 ========
  async connect(config: SSHConfig): Promise<SSHConnection> {
    return this.electronAPI.ssh.connect(config)
  }

  async disconnect(id: string): Promise<void> {
    return this.electronAPI.ssh.disconnect(id)
  }

  async getConnections(): Promise<SSHConnection[]> {
    return this.electronAPI.ssh.getConnections()
  }

  async saveConnection(config: SSHConfig): Promise<SSHConfig> {
    return this.electronAPI.ssh.saveConnection(config)
  }

  async testConnection(config: SSHConfig): Promise<TestResult> {
    return this.electronAPI.ssh.testConnection(config)
  }

  async execute(id: string, command: string, requestId?: string): Promise<CommandResult> {
    return this.electronAPI.ssh.execute(id, command, requestId)
  }

  async cancelExecute(requestId: string): Promise<boolean> {
    return this.electronAPI.ssh.cancelExecute(requestId)
  }

  async write(id: string, data: string): Promise<void> {
    return this.electronAPI.ssh.write(id, data)
  }

  async listFiles(id: string, remotePath: string): Promise<FileInfo[]> {
    return this.electronAPI.ssh.listFiles(id, remotePath)
  }

  async uploadFile(id: string, localPath: string, remotePath: string): Promise<void> {
    return this.electronAPI.ssh.uploadFile(id, localPath, remotePath)
  }

  async downloadFile(id: string, remotePath: string, localPath: string): Promise<void> {
    return this.electronAPI.ssh.downloadFile(id, remotePath, localPath)
  }

  async deleteFile(id: string, remotePath: string, isDirectory: boolean): Promise<void> {
    return this.electronAPI.ssh.deleteFile(id, remotePath, isDirectory)
  }

  async createDirectory(id: string, remotePath: string): Promise<void> {
    return this.electronAPI.ssh.createDirectory(id, remotePath)
  }
}

// ============= 默认导出 =============
export const sshService = createService<ISSHService>('SSHService', SSHLocalImpl, SSHLocalImpl)
