import { ipcMain } from 'electron'
import { Client, SFTPWrapper } from 'ssh2'
import fs from 'fs/promises'
import path from 'path'
import { windowEvents } from '../shared/events'

interface SSHConnection {
  id: string
  name: string
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  passphrase?: string
  authType?: 'password' | 'privateKey' | 'agent'
  client?: Client
  shell?: any // Shell stream
  sftp?: SFTPWrapper // SFTP session
  isConnected: boolean
  lastUsed: Date
  initialOutputBuffer?: string[] // 缓存初始输出
  isInitialOutputClaimed?: boolean // 初始输出是否已被获取
}

class SSHManager {
  private connections: Map<string, SSHConnection> = new Map()
  private configPath: string

  constructor() {
    this.configPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.ai-ssh-assistant', 'connections.json')
    this.loadConnections()
  }

  private async loadConnections() {
    try {
      const data = await fs.readFile(this.configPath, 'utf-8')
      const connections = JSON.parse(data)
      connections.forEach((conn: SSHConnection) => {
        this.connections.set(conn.id, { ...conn, isConnected: false, client: undefined })
      })
    } catch (error) {
      // 文件不存在或格式错误，使用空的连接列表
      console.log('No existing connections file found, starting with empty list')
    }
  }

  private async saveConnections() {
    try {
      const configDir = path.dirname(this.configPath)
      await fs.mkdir(configDir, { recursive: true })
      
      const connections = Array.from(this.connections.values()).map(conn => ({
        id: conn.id,
        name: conn.name,
        host: conn.host,
        port: conn.port,
        username: conn.username,
        password: conn.password,
        privateKey: conn.privateKey,
        lastUsed: conn.lastUsed
      }))
      
      await fs.writeFile(this.configPath, JSON.stringify(connections, null, 2))
    } catch (error) {
      console.error('Failed to save connections:', error)
      throw error
    }
  }

  async connect(config: Omit<SSHConnection, 'id' | 'client' | 'isConnected' | 'lastUsed'>): Promise<string> {
    const id = Date.now().toString()
    const client = new Client()

    return new Promise((resolve, reject) => {
      client.on('ready', () => {
        // 创建 shell 会话
        client.shell((err, stream) => {
          if (err) {
            reject(err)
            return
          }

          const connection: SSHConnection = {
            ...config,
            id,
            client,
            shell: stream,
            isConnected: true,
            lastUsed: new Date(),
            initialOutputBuffer: [], // 初始化输出缓冲数组
            isInitialOutputClaimed: false // 初始输出未被获取
          }
          
          this.connections.set(id, connection)

          // 监听 shell 输出
          stream.on('data', (data: Buffer) => {
            const output = data.toString()
            
            // 如果初始输出还未被获取，缓存它
            if (!connection.isInitialOutputClaimed) {
              connection.initialOutputBuffer = connection.initialOutputBuffer || []
              connection.initialOutputBuffer.push(output)
            } else {
              // 正常发送输出
              windowEvents.sendToRenderer(`ssh:output:${id}`, output)
            }
          })

          stream.stderr.on('data', (data: Buffer) => {
            windowEvents.sendToRenderer(`ssh:output:${id}`, data.toString())
          })

          stream.on('close', () => {
            connection.isConnected = false
            connection.shell = undefined
            windowEvents.sendToRenderer('ssh:connection-status-changed', {
              id,
              status: 'disconnected'
            })
          })
          
          // 通知前端连接状态变化
          windowEvents.sendToRenderer('ssh:connection-status-changed', {
            id,
            status: 'connected',
            config
          })
          
          resolve(id)
        })
      })

      client.on('error', (error) => {
        console.error('SSH connection error:', error)
        reject(error)
      })

      client.on('close', () => {
        const connection = this.connections.get(id)
        if (connection) {
          connection.isConnected = false
          connection.client = undefined
        }
        
        // 通知前端连接状态变化
        windowEvents.sendToRenderer('ssh:connection-status-changed', {
          id,
          status: 'disconnected'
        })
      })

      // 连接配置
      const connectConfig: any = {
        host: config.host,
        port: config.port,
        username: config.username
      }

      if (config.password) {
        connectConfig.password = config.password
      }

      if (config.privateKey) {
        connectConfig.privateKey = config.privateKey
        if (config.passphrase) {
          connectConfig.passphrase = config.passphrase
        }
      }

      client.connect(connectConfig)
    })
  }

  async disconnect(id: string): Promise<void> {
    const connection = this.connections.get(id)
    if (!connection) {
      console.warn(`Connection ${id} not found`)
      return
    }

    // 关闭 shell 会话
    if (connection.shell) {
      try {
        connection.shell.end()
        connection.shell = undefined
      } catch (err) {
        console.error('Failed to close shell:', err)
      }
    }

    // 关闭 SSH 客户端
    if (connection.client) {
      try {
        connection.client.end()
        connection.client = undefined
      } catch (err) {
        console.error('Failed to close client:', err)
      }
    }

    connection.isConnected = false
    
    // 从连接池中移除
    this.connections.delete(id)
    
    console.log(`Disconnected: ${id}`)
  }

  async execute(id: string, command: string): Promise<{ success: boolean; output?: string; error?: string }> {
    console.log('[SSHManager] ========== 执行 SSH 命令 ==========')
    console.log('[SSHManager] 连接ID:', id)
    console.log('[SSHManager] 命令:', command)
    
    const connection = this.connections.get(id)
    if (!connection || !connection.shell || !connection.isConnected) {
      console.error('[SSHManager] ❌ 连接不存在或未连接')
      throw new Error('Connection not found or not connected')
    }

    console.log('[SSHManager] ✅ 连接有效，准备执行命令')

    return new Promise((resolve, reject) => {
      const shell = connection.shell
      let output = ''
      let errorOutput = ''
      let commandSent = false
      const timeout = 30000 // 30 秒超时

      // 超时处理
      const timeoutId = setTimeout(() => {
        console.log('[SSHManager] ⏱️ 命令执行超时')
        shell.removeAllListeners('data')
        shell.stderr.removeAllListeners('data')
        resolve({
          success: false,
          error: '命令执行超时'
        })
      }, timeout)

      // 监听标准输出
      const onData = (data: Buffer) => {
        const chunk = data.toString()
        output += chunk
        console.log('[SSHManager] 收到输出片段:', chunk.substring(0, 100))
        
        // 检测命令提示符（简单的启发式方法）
        // 通常 shell 提示符以 $ 或 # 结尾
        if (commandSent && (chunk.includes('$') || chunk.includes('#') || chunk.includes('> '))) {
          console.log('[SSHManager] ✅ 检测到命令执行完成（提示符出现）')
          clearTimeout(timeoutId)
          shell.removeListener('data', onData)
          shell.stderr.removeListener('data', onStderr)
          
          // 清理输出（移除命令本身和提示符）
          const lines = output.split('\n')
          let cleanedOutput = lines
            .slice(1, -1) // 移除第一行（命令）和最后一行（提示符）
            .join('\n')
            .trim()
          
          console.log('[SSHManager] 清理后的输出长度:', cleanedOutput.length)
          console.log('[SSHManager] 清理后的输出预览:', cleanedOutput.substring(0, 200))
          
          resolve({
            success: !errorOutput,
            output: cleanedOutput,
            error: errorOutput || undefined
          })
        }
      }

      // 监听错误输出
      const onStderr = (data: Buffer) => {
        const chunk = data.toString()
        errorOutput += chunk
        console.log('[SSHManager] 收到错误输出:', chunk)
      }

      shell.on('data', onData)
      shell.stderr.on('data', onStderr)

      // 发送命令（添加换行符）
      const commandWithNewline = command.endsWith('\n') ? command : command + '\n'
      console.log('[SSHManager] 发送命令到 shell...')
      shell.write(commandWithNewline, (err: any) => {
        if (err) {
          console.error('[SSHManager] ❌ 写入命令失败:', err)
          clearTimeout(timeoutId)
          shell.removeListener('data', onData)
          shell.stderr.removeListener('data', onStderr)
          reject(err)
        } else {
          console.log('[SSHManager] ✅ 命令已发送')
          commandSent = true
        }
      })
    })
  }

  /**
   * 直接写入终端输入（用于用户交互）
   * 不添加换行符，不等待响应，只是简单地转发给 shell
   */
  async write(id: string, data: string): Promise<void> {
    console.log('[SSHManager] write - 开始写入数据')
    const connection = this.connections.get(id)
    
    if (!connection) {
      console.error('[SSHManager] ❌ 连接不存在:', id)
      throw new Error('Connection not found')
    }

    if (!connection.shell) {
      console.error('[SSHManager] ❌ Shell 不可用')
      throw new Error('Shell not available')
    }

    // 直接写入，不做任何修改
    connection.shell.write(data, (err: any) => {
      if (err) {
        console.error('[SSHManager] ❌ 写入数据失败:', err)
      }
    })
  }

  async getInitialOutput(id: string): Promise<string> {
    const connection = this.connections.get(id)
    if (!connection) {
      throw new Error('Connection not found')
    }

    // 返回缓冲的输出并清空
    const output = (connection.initialOutputBuffer || []).join('')
    
    // 标记初始输出已被获取（之后的输出直接发送）
    connection.isInitialOutputClaimed = true
    connection.initialOutputBuffer = []
    
    return output
  }

  getConnections(): SSHConnection[] {
    return Array.from(this.connections.values()).map(conn => ({
      ...conn,
      client: undefined // 不序列化 client 对象
    }))
  }

  async saveConnection(config: Omit<SSHConnection, 'id' | 'client' | 'isConnected' | 'lastUsed'>): Promise<string> {
    const id = Date.now().toString()
    const connection: SSHConnection = {
      ...config,
      id,
      isConnected: false,
      lastUsed: new Date()
    }

    this.connections.set(id, connection)
    await this.saveConnections()
    return id
  }

  async deleteConnection(id: string): Promise<void> {
    const connection = this.connections.get(id)
    if (connection && connection.isConnected) {
      await this.disconnect(id)
    }
    
    this.connections.delete(id)
    await this.saveConnections()
  }

  async testConnection(config: Omit<SSHConnection, 'id' | 'client' | 'isConnected' | 'lastUsed'>): Promise<boolean> {
    const client = new Client()

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        client.end()
        resolve(false)
      }, 10000) // 10秒超时

      client.on('ready', () => {
        clearTimeout(timeout)
        client.end()
        resolve(true)
      })

      client.on('error', () => {
        clearTimeout(timeout)
        resolve(false)
      })

      const connectConfig: any = {
        host: config.host,
        port: config.port,
        username: config.username
      }

      if (config.password) {
        connectConfig.password = config.password
      }

      if (config.privateKey) {
        connectConfig.privateKey = config.privateKey
      }

      client.connect(connectConfig)
    })
  }

  // 获取或创建 SFTP 会话
  private async getSFTP(id: string): Promise<SFTPWrapper> {
    const connection = this.connections.get(id)
    if (!connection || !connection.client || !connection.isConnected) {
      throw new Error('Connection not found or not connected')
    }

    // 如果已有 SFTP 会话，直接返回
    if (connection.sftp) {
      return connection.sftp
    }

    // 创建新的 SFTP 会话
    return new Promise((resolve, reject) => {
      connection.client!.sftp((err, sftp) => {
        if (err) {
          reject(err)
          return
        }
        connection.sftp = sftp
        resolve(sftp)
      })
    })
  }

  // 列出远程目录文件
  async listFiles(id: string, remotePath: string): Promise<any[]> {
    const sftp = await this.getSFTP(id)

    return new Promise((resolve, reject) => {
      sftp.readdir(remotePath, (err, list) => {
        if (err) {
          reject(err)
          return
        }

        const files = list.map(item => ({
          name: item.filename,
          type: item.attrs.isDirectory() ? 'directory' : 'file',
          size: item.attrs.size,
          modifiedTime: new Date(item.attrs.mtime * 1000).toISOString(),
          permissions: item.attrs.mode
        }))

        // 排序：目录在前，然后按名称排序
        files.sort((a, b) => {
          if (a.type === 'directory' && b.type !== 'directory') return -1
          if (a.type !== 'directory' && b.type === 'directory') return 1
          return a.name.localeCompare(b.name)
        })

        resolve(files)
      })
    })
  }

  // 上传文件
  async uploadFile(id: string, localPath: string, remotePath: string): Promise<void> {
    const sftp = await this.getSFTP(id)

    return new Promise((resolve, reject) => {
      sftp.fastPut(localPath, remotePath, {
        step: (transferred, chunk, total) => {
          const progress = Math.round((transferred / total) * 100)
          windowEvents.sendToRenderer('ssh:upload-progress', {
            id,
            localPath,
            remotePath,
            progress,
            transferred,
            total
          })
        }
      }, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  // 下载文件
  async downloadFile(id: string, remotePath: string, localPath: string): Promise<void> {
    const sftp = await this.getSFTP(id)

    // 确保本地目录存在
    const localDir = path.dirname(localPath)
    
    try {
      await fs.mkdir(localDir, { recursive: true })
    } catch (error: any) {
      // 忽略目录已存在的错误
      if (error.code !== 'EEXIST') {
        console.error('Failed to create directory:', localDir, error)
      }
    }

    return new Promise((resolve, reject) => {
      sftp.fastGet(remotePath, localPath, {
        step: (transferred, chunk, total) => {
          const progress = Math.round((transferred / total) * 100)
          windowEvents.sendToRenderer('ssh:download-progress', {
            id,
            remotePath,
            localPath,
            progress,
            transferred,
            total
          })
        }
      }, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  // 删除文件或目录
  async deleteFile(id: string, remotePath: string, isDirectory: boolean): Promise<void> {
    const sftp = await this.getSFTP(id)

    return new Promise((resolve, reject) => {
      if (isDirectory) {
        // 递归删除目录
        this.deleteDirectory(sftp, remotePath)
          .then(() => resolve())
          .catch(reject)
      } else {
        sftp.unlink(remotePath, (err) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      }
    })
  }

  // 递归删除目录
  private async deleteDirectory(sftp: SFTPWrapper, remotePath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // 先列出目录内容
      sftp.readdir(remotePath, async (err, list) => {
        if (err) {
          reject(err)
          return
        }

        try {
          // 删除所有子项
          for (const item of list) {
            const itemPath = `${remotePath}/${item.filename}`
            if (item.attrs.isDirectory()) {
              await this.deleteDirectory(sftp, itemPath)
            } else {
              await new Promise<void>((res, rej) => {
                sftp.unlink(itemPath, (e) => {
                  if (e) rej(e)
                  else res()
                })
              })
            }
          }

          // 删除空目录
          sftp.rmdir(remotePath, (e) => {
            if (e) reject(e)
            else resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  // 创建目录
  async createDirectory(id: string, remotePath: string): Promise<void> {
    const sftp = await this.getSFTP(id)

    return new Promise((resolve, reject) => {
      sftp.mkdir(remotePath, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}

// 创建 SSH 管理器实例
const sshManager = new SSHManager()

// 注册 IPC 处理器
ipcMain.handle('ssh:connect', async (_, config) => {
  try {
    const id = await sshManager.connect(config)
    return {
      status: 'connected',
      id,
      message: 'Connection successful'
    }
  } catch (error: any) {
    console.error('SSH connect error:', error)
    return {
      status: 'error',
      message: error.message || 'Connection failed'
    }
  }
})

ipcMain.handle('ssh:disconnect', async (_, id: string) => {
  try {
    await sshManager.disconnect(id)
    return true
  } catch (error) {
    console.error('SSH disconnect error:', error)
    throw error
  }
})

ipcMain.handle('ssh:execute', async (_, id: string, command: string) => {
  try {
    return await sshManager.execute(id, command)
  } catch (error) {
    console.error('SSH execute error:', error)
    throw error
  }
})

ipcMain.handle('ssh:write', async (_, id: string, data: string) => {
  try {
    await sshManager.write(id, data)
  } catch (error) {
    console.error('SSH write error:', error)
    throw error
  }
})

ipcMain.handle('ssh:get-initial-output', async (_, id: string) => {
  try {
    return await sshManager.getInitialOutput(id)
  } catch (error) {
    console.error('SSH get initial output error:', error)
    throw error
  }
})

ipcMain.handle('ssh:get-connections', () => {
  return sshManager.getConnections()
})

ipcMain.handle('ssh:save-connection', async (_, config) => {
  try {
    return await sshManager.saveConnection(config)
  } catch (error) {
    console.error('SSH save connection error:', error)
    throw error
  }
})

ipcMain.handle('ssh:delete-connection', async (_, id: string) => {
  try {
    await sshManager.deleteConnection(id)
    return true
  } catch (error) {
    console.error('SSH delete connection error:', error)
    throw error
  }
})

ipcMain.handle('ssh:test-connection', async (_, config) => {
  try {
    return await sshManager.testConnection(config)
  } catch (error) {
    console.error('SSH test connection error:', error)
    return false
  }
})

// SFTP 相关处理器
ipcMain.handle('ssh:list-files', async (_, id: string, remotePath: string) => {
  try {
    const files = await sshManager.listFiles(id, remotePath)
    return { success: true, files }
  } catch (error: any) {
    console.error('SSH list files error:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('ssh:upload-file', async (_, id: string, localPath: string, remotePath: string) => {
  try {
    await sshManager.uploadFile(id, localPath, remotePath)
    return { success: true }
  } catch (error: any) {
    console.error('SSH upload file error:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('ssh:download-file', async (_, id: string, remotePath: string, localPath: string) => {
  try {
    await sshManager.downloadFile(id, remotePath, localPath)
    return { success: true }
  } catch (error: any) {
    console.error('SSH download file error:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('ssh:delete-file', async (_, id: string, remotePath: string, isDirectory: boolean) => {
  try {
    await sshManager.deleteFile(id, remotePath, isDirectory)
    return { success: true }
  } catch (error: any) {
    console.error('SSH delete file error:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('ssh:create-directory', async (_, id: string, remotePath: string) => {
  try {
    await sshManager.createDirectory(id, remotePath)
    return { success: true }
  } catch (error: any) {
    console.error('SSH create directory error:', error)
    return { success: false, error: error.message }
  }
})

export { sshManager }
