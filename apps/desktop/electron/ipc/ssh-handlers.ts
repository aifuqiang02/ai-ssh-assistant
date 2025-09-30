import { ipcMain } from 'electron'
import { Client } from 'ssh2'
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
              console.log(`[SSH ${id}] Buffering initial output, buffer size:`, connection.initialOutputBuffer.length)
            } else {
              // 正常发送输出
              console.log(`[SSH ${id}] Sending output to renderer, length:`, output.length)
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

  async execute(id: string, data: string): Promise<void> {
    const connection = this.connections.get(id)
    if (!connection || !connection.shell || !connection.isConnected) {
      throw new Error('Connection not found or not connected')
    }

    // 写入数据到 shell
    connection.shell.write(data)
  }

  async getInitialOutput(id: string): Promise<string> {
    const connection = this.connections.get(id)
    if (!connection) {
      throw new Error('Connection not found')
    }

    // 返回缓冲的输出并清空
    const output = (connection.initialOutputBuffer || []).join('')
    console.log(`[SSH ${id}] Getting initial output, length:`, output.length, 'buffer size:', connection.initialOutputBuffer?.length)
    
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

export { sshManager }
