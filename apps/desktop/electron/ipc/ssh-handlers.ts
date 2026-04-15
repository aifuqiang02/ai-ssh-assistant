import { ipcMain } from 'electron'
import { Client, SFTPWrapper } from 'ssh2'
import fs from 'fs/promises'
import path from 'path'
import { windowEvents } from '../shared/events'
import { getSSHTreeService } from '../services/ssh-tree.service'
import { Events, emit } from '../../src/services/event-bus'

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
  timeout?: number
  keepAlive?: boolean
  keepAliveInterval?: number
  client?: Client
  shell?: any // Shell stream
  sftp?: SFTPWrapper // SFTP session
  isConnected: boolean
  lastUsed: Date
  initialOutputBuffer?: string[] // 缓存初始输出
  isInitialOutputClaimed?: boolean // 初始输出是否已被获取
  currentDirectoryProbe?: {
    requestId: string
    buffer: string
    stderr: string
    resolve: (result: { success: boolean; output?: string; error?: string }) => void
    reject: (error: Error) => void
    timeoutId: NodeJS.Timeout
  } | null
}

type SerializedSSHConnection = Omit<
  SSHConnection,
  'client' | 'shell' | 'sftp' | 'password' | 'privateKey' | 'passphrase' | 'lastUsed'
> & {
  lastUsed: string
}

class SSHManager {
  private connections: Map<string, SSHConnection> = new Map()
  private pendingExecs: Map<string, any> = new Map()
  private fileListShellChannels: Map<string, any> = new Map()
  private configPath: string

  constructor() {
    this.configPath = path.join(
      process.env.HOME || process.env.USERPROFILE || '',
      '.ai-ssh-assistant',
      'connections.json'
    )
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

  async connect(
    config: Omit<SSHConnection, 'id' | 'client' | 'isConnected' | 'lastUsed'>
  ): Promise<string> {
    const id = Date.now().toString()
    const client = new Client()

    return new Promise((resolve, reject) => {
      client.on('ready', () => {
        // 创建 shell 会话，设置终端类型和尺寸
        client.shell(
          {
            term: 'xterm-256color', // 设置终端类型为 xterm-256color
            cols: 120, // 默认列数
            rows: 30 // 默认行数
          },
          (err, stream) => {
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

              if (connection.currentDirectoryProbe) {
                connection.currentDirectoryProbe.buffer += output.replace(/\r/g, '')

                const beginMarker = `__OC_CWD_BEGIN__${connection.currentDirectoryProbe.requestId}\n`
                const endPrefix = `\n__OC_CWD_END__${connection.currentDirectoryProbe.requestId}:`
                const beginIndex = connection.currentDirectoryProbe.buffer.indexOf(beginMarker)
                const endIndex = connection.currentDirectoryProbe.buffer.indexOf(endPrefix)

                if (beginIndex !== -1 && endIndex !== -1 && endIndex >= beginIndex) {
                  const content = connection.currentDirectoryProbe.buffer.slice(
                    beginIndex + beginMarker.length,
                    endIndex
                  )
                  const statusLine = connection.currentDirectoryProbe.buffer.slice(
                    endIndex + endPrefix.length
                  )
                  const statusMatch = statusLine.match(/^(\d+)/)

                  if (statusMatch) {
                    const probe = connection.currentDirectoryProbe
                    connection.currentDirectoryProbe = null
                    clearTimeout(probe.timeoutId)
                    probe.resolve({
                      success: statusMatch[1] === '0',
                      output: content.trim(),
                      error: undefined
                    })
                    return
                  }
                }
              }

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

            // 发布事件总线事件
            emit(Events.SSH_CONNECTED, {
              connectionId: id,
              host: config.host,
              port: config.port,
              username: config.username,
              authType: config.authType
            })

            resolve(id)
          }
        )
      })

      client.on('error', error => {
        console.error('SSH connection error:', error)
        reject(error)
      })

      client.on('close', () => {
        const connection = this.connections.get(id)
        if (connection) {
          connection.isConnected = false
          connection.client = undefined
        }

        this.closeFileListShell(id)

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
        username: config.username,
        readyTimeout: (config.timeout ?? 10) * 1000
      }

      if (config.keepAlive !== false) {
        connectConfig.keepaliveInterval = (config.keepAliveInterval ?? 15) * 1000
        connectConfig.keepaliveCountMax = 3
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

  async resize(id: string, cols: number, rows: number): Promise<void> {
    const connection = this.connections.get(id)
    if (!connection || !connection.shell || !connection.isConnected) {
      console.warn(`Cannot resize: connection ${id} not found or not connected`)
      return
    }

    try {
      connection.shell.setWindow(rows, cols)
    } catch (err) {
      console.error(`[SSHManager] Failed to resize terminal for ${id}:`, err)
    }
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

    this.closeFileListShell(id)

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

    // 发布事件总线事件
    emit(Events.SSH_DISCONNECTED, {
      connectionId: id,
      host: connection.host,
      username: connection.username
    })

    // 从连接池中移除
    this.connections.delete(id)
  }

  async execute(
    id: string,
    command: string,
    requestId?: string
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    const startTime = Date.now()
    const connection = this.connections.get(id)
    if (!connection || !connection.client || !connection.isConnected) {
      console.error('[SSHManager] ❌ 连接不存在或未连接')
      throw new Error('Connection not found or not connected')
    }

    // 发布事件总线事件
    emit(Events.SSH_COMMAND_STARTED, {
      connectionId: id,
      command,
      host: connection.host,
      username: connection.username
    })

    return new Promise((resolve, reject) => {
      let output = ''
      let errorOutput = ''
      let firstOutputTime = 0
      const timeout = 300000 // 5分钟超时，支持长时间运行的命令（apt, yum, 下载等）
      let settled = false
      let execStream: any = null
      let commandSentTime = Date.now()
      let wasAborted = false

      // 超时处理
      const timeoutId = setTimeout(() => {
        cleanup()
        if (execStream) {
          execStream.close()
        }
        resolve({
          success: false,
          error: '命令执行超时（12000秒）'
        })
      }, timeout)

      // 清理监听器
      const cleanup = () => {
        clearTimeout(timeoutId)
        if (requestId) {
          this.pendingExecs.delete(requestId)
        }
      }

      const settleResolve = (result: { success: boolean; output?: string; error?: string }) => {
        if (settled) return
        settled = true
        cleanup()
        resolve(result)
      }

      const settleReject = (error: Error) => {
        if (settled) return
        settled = true
        cleanup()
        reject(error)
      }

      const finalizeOutput = () => {
        if (settled) return

        // 清理输出
        let cleanedOutput = output

        // 1. 移除命令回显（第一行）
        const lines = cleanedOutput.split('\n')
        if (lines.length > 0) {
          const firstLine = lines[0]?.trim() || ''
          const trimmedCommand = command.trim()

          if (firstLine && firstLine === trimmedCommand) {
            cleanedOutput = lines.slice(1).join('\n')
          }
        }

        // 2. 移除最后的提示符（最后一行如果包含 $ # 等提示符）
        const outputLines = cleanedOutput.split('\n')
        if (outputLines.length > 0) {
          const lastLine = outputLines[outputLines.length - 1]
          // 检测常见的提示符模式
          const promptPattern = /[@#$%>]\s*$/
          if (promptPattern.test(lastLine) || lastLine.trim() === '') {
            cleanedOutput = outputLines.slice(0, -1).join('\n')
          }
        }

        // 3. 移除末尾多余的换行符（保留一个）
        cleanedOutput = cleanedOutput.replace(/\n+$/, '\n').replace(/^\n+/, '')

        // 发布事件总线事件
        emit(Events.SSH_COMMAND_COMPLETED, {
          connectionId: id,
          command,
          success: !errorOutput,
          output: cleanedOutput,
          duration: Date.now() - startTime
        })

        settleResolve({
          success: !errorOutput,
          output: cleanedOutput,
          error: errorOutput || undefined
        })
      }

      // 监听标准输出
      const onData = (data: Buffer) => {
        const chunk = data.toString()
        output += chunk

        // 记录首次输出时间
        if (firstOutputTime === 0) {
          firstOutputTime = Date.now()
        }
      }

      // 监听错误输出
      const onStderr = (data: Buffer) => {
        const chunk = data.toString()
        errorOutput += chunk
      }

      let finalCommand = command

      // 检测并处理可能使用分页器的命令
      const pagerCommands = ['systemctl', 'journalctl', 'git log', 'git diff']
      const needsNoPager = pagerCommands.some(cmd => command.trim().startsWith(cmd))

      if (needsNoPager && !command.includes('--no-pager') && !command.includes('SYSTEMD_PAGER')) {
        // 为 systemctl 和 journalctl 添加 --no-pager
        if (command.trim().startsWith('systemctl') || command.trim().startsWith('journalctl')) {
          finalCommand = command.replace(/^(systemctl|journalctl)/, '$1 --no-pager')
        }
        // 为 git 命令添加 --no-pager
        else if (command.trim().startsWith('git')) {
          finalCommand = command.replace(/^git/, 'git --no-pager')
        }
      }

      connection.client!.exec(finalCommand, (err, stream) => {
        if (err) {
          console.error('[SSHManager] ❌ 写入命令失败:', err)
          settleReject(err)
          return
        }

        execStream = stream
        if (requestId) {
          this.pendingExecs.set(requestId, { stream, aborted: false })
        }

        commandSentTime = Date.now()

        stream.on('data', onData)
        stream.stderr.on('data', onStderr)

        stream.on('close', () => {
          const pendingExec = requestId ? this.pendingExecs.get(requestId) : null
          wasAborted = Boolean(pendingExec?.aborted)

          if (wasAborted) {
            const abortError = new Error('Command aborted')
            abortError.name = 'AbortError'
            settleReject(abortError)
            return
          }

          finalizeOutput()
        })

        stream.on('error', (streamError: Error) => {
          settleReject(streamError)
        })
      })
    })
  }

  async cancelExecute(requestId: string): Promise<boolean> {
    const pendingExec = this.pendingExecs.get(requestId)
    if (!pendingExec) {
      return false
    }

    pendingExec.aborted = true

    try {
      pendingExec.stream.signal?.('INT')
    } catch (error) {
      console.warn('[SSHManager] Failed to send SIGINT to exec stream:', error)
    }

    try {
      pendingExec.stream.close()
    } catch (error) {
      console.warn('[SSHManager] Failed to close exec stream:', error)
    }

    return true
  }

  /**
   * 直接写入终端输入（用于用户交互）
   * 不添加换行符，不等待响应，只是简单地转发给 shell
   */
  async write(id: string, data: string): Promise<void> {
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

  /**
   * 静默执行命令（不在终端显示，用于后台获取信息）
   * 临时标记为静默模式,拦截 shell 输出,执行命令后恢复正常
   */
  async executeSilent(
    id: string,
    command: string
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    const connection = this.connections.get(id)
    if (!connection || !connection.client || !connection.isConnected) {
      throw new Error('Connection not found or not connected')
    }

    return new Promise(resolve => {
      let output = ''
      let hasResolved = false

      // 使用 client.exec() 创建独立的执行通道,不干扰交互式 shell
      connection.client!.exec(command, (err, stream) => {
        if (err) {
          console.error('[SSHManager] executeSilent - exec 错误:', err)
          if (!hasResolved) {
            hasResolved = true
            resolve({ success: false, error: err.message })
          }
          return
        }

        // 设置超时
        const timeout = setTimeout(() => {
          stream.close()
          if (!hasResolved) {
            hasResolved = true
            resolve({ success: false, error: 'Command execution timeout' })
          }
        }, 3000)

        // 收集输出
        stream.on('data', (data: Buffer) => {
          output += data.toString('utf8')
        })

        stream.stderr.on('data', (data: Buffer) => {
          output += data.toString('utf8')
        })

        stream.on('close', (code: number) => {
          clearTimeout(timeout)

          // 清理输出 - 移除 ANSI 转义序列和多余空白
          let cleaned = output
            .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '') // ANSI 颜色代码
            .replace(/\x1b\][^\x07]*\x07/g, '') // OSC 序列
            .replace(/\r/g, '') // 回车符
            .replace(/\x1b\[\?[0-9]+[hl]/g, '') // 私有模式设置
            .trim()

          if (!hasResolved) {
            hasResolved = true
            resolve({ success: true, output: cleaned })
          }
        })

        stream.on('error', (err: Error) => {
          clearTimeout(timeout)
          console.error('[SSHManager] executeSilent - stream 错误:', err)
          if (!hasResolved) {
            hasResolved = true
            resolve({ success: false, error: err.message })
          }
        })
      })
    })
  }

  private escapeShellSingleQuotes(value: string): string {
    return value.replace(/'/g, `'\\''`)
  }

  private closeFileListShell(id: string) {
    const channel = this.fileListShellChannels.get(id)
    if (!channel) {
      return
    }

    if (channel.pending) {
      clearTimeout(channel.pending.timeoutId)
      channel.pending.reject(new Error('File list shell channel closed'))
    }

    try {
      channel.stream.end()
    } catch (error) {
      console.warn('[SSHManager] [fileListShell] Failed to close shell channel:', error)
    }

    this.fileListShellChannels.delete(id)
  }

  async getCurrentDirectory(
    id: string
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    const connection = this.connections.get(id)
    if (!connection || !connection.client || !connection.shell || !connection.isConnected) {
      throw new Error('Connection not found or not connected')
    }

    try {
      if (connection.currentDirectoryProbe) {
        throw new Error('Current directory probe already in progress')
      }

      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const wrappedCommand = `printf '__OC_CWD_BEGIN__${requestId}\\n'; pwd; __oc_status=$?; printf '\\n__OC_CWD_END__${requestId}:%s\\n' "$__oc_status"\n`

      return await new Promise<{ success: boolean; output?: string; error?: string }>(
        (resolve, reject) => {
          const timeoutId = setTimeout(() => {
            connection.currentDirectoryProbe = null
            reject(new Error('Current directory shell command timeout'))
          }, 3000)

          connection.currentDirectoryProbe = {
            requestId,
            buffer: '',
            stderr: '',
            timeoutId,
            resolve,
            reject
          }

          connection.shell.write(wrappedCommand, (error: Error | undefined) => {
            if (!error) {
              return
            }

            clearTimeout(timeoutId)
            connection.currentDirectoryProbe = null
            reject(error)
          })
        }
      )
    } catch (error) {
      console.warn('[SSHManager] [cwdShell] Falling back to executeSilent pwd:', error)
      return await this.executeSilent(id, 'pwd')
    }
  }

  private async getFileListShell(id: string): Promise<any> {
    const existingChannel = this.fileListShellChannels.get(id)
    if (existingChannel?.stream) {
      return existingChannel.stream
    }

    const connection = this.connections.get(id)
    if (!connection || !connection.client || !connection.isConnected) {
      throw new Error('Connection not found or not connected')
    }

    return new Promise((resolve, reject) => {
      connection.client!.shell(
        {
          term: 'dumb',
          cols: 120,
          rows: 24
        },
        (err, stream) => {
          if (err) {
            reject(err)
            return
          }

          const channel = {
            stream,
            buffer: '',
            queue: Promise.resolve(),
            pending: null as any
          }

          const flushPending = () => {
            if (!channel.pending) {
              return
            }

            const beginMarker = `__OC_BEGIN__${channel.pending.requestId}\n`
            const endPrefix = `\n__OC_END__${channel.pending.requestId}:`
            const beginIndex = channel.buffer.indexOf(beginMarker)
            const endIndex = channel.buffer.indexOf(endPrefix)

            if (beginIndex === -1 || endIndex === -1 || endIndex < beginIndex) {
              return
            }

            const content = channel.buffer.slice(beginIndex + beginMarker.length, endIndex)
            const statusLine = channel.buffer.slice(endIndex + endPrefix.length)
            const statusMatch = statusLine.match(/^(\d+)/)
            if (!statusMatch) {
              return
            }

            const consumedLength = endIndex + endPrefix.length + statusMatch[1].length
            channel.buffer = channel.buffer.slice(consumedLength).replace(/^\r?\n/, '')

            const pending = channel.pending
            channel.pending = null
            clearTimeout(pending.timeoutId)
            pending.resolve({
              success: statusMatch[1] === '0',
              output: content.trim(),
              error: pending.stderr.trim() || undefined
            })
          }

          stream.on('data', (data: Buffer) => {
            channel.buffer += data.toString('utf8').replace(/\r/g, '')
            flushPending()
          })

          stream.stderr.on('data', (data: Buffer) => {
            if (channel.pending) {
              channel.pending.stderr += data.toString('utf8')
            }
          })

          stream.on('close', () => {
            if (channel.pending) {
              clearTimeout(channel.pending.timeoutId)
              channel.pending.reject(new Error('File list shell channel closed unexpectedly'))
            }

            this.fileListShellChannels.delete(id)
          })

          stream.on('error', (error: Error) => {
            console.warn('[SSHManager] [fileListShell] Shell stream error:', error)
          })

          this.fileListShellChannels.set(id, channel)
          resolve(stream)
        }
      )
    })
  }

  private async executeOnFileListShell(id: string, command: string) {
    await this.getFileListShell(id)
    const channel = this.fileListShellChannels.get(id)
    if (!channel) {
      throw new Error('File list shell channel unavailable')
    }

    const runCommand = async () => {
      const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const wrappedCommand = `printf '__OC_BEGIN__${requestId}\\n'; ${command}; __oc_status=$?; printf '\\n__OC_END__${requestId}:%s\\n' "$__oc_status"\n`

      return new Promise<{ success: boolean; output?: string; error?: string }>(
        (resolve, reject) => {
          const timeoutId = setTimeout(() => {
            channel.pending = null
            this.closeFileListShell(id)
            reject(new Error('File list shell command timeout'))
          }, 5000)

          channel.pending = {
            requestId,
            stderr: '',
            timeoutId,
            resolve,
            reject
          }

          channel.stream.write(wrappedCommand, (error: Error | undefined) => {
            if (!error) {
              return
            }

            clearTimeout(timeoutId)
            channel.pending = null
            reject(error)
          })
        }
      )
    }

    channel.queue = channel.queue.then(runCommand, runCommand)
    return channel.queue
  }

  private sortListedFiles(files: any[]) {
    files.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1
      if (a.type !== 'directory' && b.type === 'directory') return 1
      return a.name.localeCompare(b.name)
    })

    return files
  }

  private parseStructuredListOutput(output: string): any[] {
    const lines = output
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    const files = lines.map(line => {
      const [name, rawType, rawSize, rawModifiedTime, rawPermissions] = line.split('\t')

      if (!name || !rawType || !rawSize || !rawModifiedTime || !rawPermissions) {
        throw new Error(`Invalid exec listing row: ${line}`)
      }

      const modifiedTimestamp = Number(rawModifiedTime)
      const size = Number(rawSize)
      const permissions = Number(rawPermissions)

      if (
        !Number.isFinite(modifiedTimestamp) ||
        !Number.isFinite(size) ||
        !Number.isFinite(permissions)
      ) {
        throw new Error(`Invalid exec listing values: ${line}`)
      }

      return {
        name,
        type: rawType === 'd' ? 'directory' : 'file',
        size,
        modifiedTime: new Date(modifiedTimestamp * 1000).toISOString(),
        permissions
      }
    })

    this.sortListedFiles(files)
    return files
  }

  private async listFilesViaPersistentShell(id: string, remotePath: string): Promise<any[] | null> {
    const startTime = Date.now()
    const escapedRemotePath = this.escapeShellSingleQuotes(remotePath)
    const shellCommand = `LC_ALL=C find '${escapedRemotePath}' -mindepth 1 -maxdepth 1 -printf '%f\\t%y\\t%s\\t%T@\\t%m\\n'`

    try {
      const shellResult = await this.executeOnFileListShell(id, shellCommand)
      if (!shellResult.success) {
        console.warn('[SSHManager] [listFiles] 常驻 shell 列目录失败，回退 exec', {
          connectionId: id,
          remotePath,
          durationMs: Date.now() - startTime,
          error: shellResult.error || 'shell command failed'
        })
        return null
      }

      const output = (shellResult.output || '').trim()
      if (!output) {
        return []
      }

      const files = this.parseStructuredListOutput(output)
      return files
    } catch (error: any) {
      console.warn('[SSHManager] [listFiles] 常驻 shell 列目录异常，回退 exec', {
        connectionId: id,
        remotePath,
        durationMs: Date.now() - startTime,
        error: error.message
      })
      return null
    }
  }

  private async listFilesViaExec(id: string, remotePath: string): Promise<any[] | null> {
    const startTime = Date.now()
    const escapedRemotePath = this.escapeShellSingleQuotes(remotePath)
    const execCommand = `LC_ALL=C find '${escapedRemotePath}' -mindepth 1 -maxdepth 1 -printf '%f\t%y\t%s\t%T@\t%m\n'`
    const execResult = await this.executeSilent(id, execCommand)

    if (!execResult.success) {
      console.warn('[SSHManager] [listFiles] exec 列目录失败，回退 SFTP', {
        connectionId: id,
        remotePath,
        durationMs: Date.now() - startTime,
        error: execResult.error || 'exec failed'
      })
      return null
    }

    const output = (execResult.output || '').trim()

    if (!output) {
      return []
    }

    const files = this.parseStructuredListOutput(output)

    return files
  }

  private async listFilesViaSftp(
    id: string,
    remotePath: string,
    startTime: number
  ): Promise<any[]> {
    const sftp = await this.getSFTP(id)
    const afterSftpTime = Date.now()

    return new Promise((resolve, reject) => {
      sftp.readdir(remotePath, (err, list) => {
        const readdirFinishedAt = Date.now()

        if (err) {
          console.warn('[SSHManager] [listFiles] readdir 失败', {
            connectionId: id,
            remotePath,
            getSftpDurationMs: afterSftpTime - startTime,
            readdirDurationMs: readdirFinishedAt - afterSftpTime,
            totalDurationMs: Date.now() - startTime,
            error: err.message
          })
          reject(err)
          return
        }

        const transformStartAt = Date.now()
        const files = list.map(item => ({
          name: item.filename,
          type: item.attrs.isDirectory() ? 'directory' : 'file',
          size: item.attrs.size,
          modifiedTime: new Date(item.attrs.mtime * 1000).toISOString(),
          permissions: item.attrs.mode
        }))
        const transformFinishedAt = Date.now()

        const sortStartAt = Date.now()
        this.sortListedFiles(files)
        const sortFinishedAt = Date.now()

        resolve(files)
      })
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

  getConnections(): SerializedSSHConnection[] {
    return Array.from(this.connections.values()).map(conn => ({
      id: conn.id,
      name: conn.name,
      host: conn.host,
      port: conn.port,
      username: conn.username,
      authType: conn.authType,
      isConnected: conn.isConnected,
      lastUsed: conn.lastUsed.toISOString() // 转换为字符串
      // 不包含: client, shell, sftp, password, privateKey, passphrase 等敏感或不可序列化的字段
    }))
  }

  async saveConnection(
    config: Omit<SSHConnection, 'id' | 'client' | 'isConnected' | 'lastUsed'>
  ): Promise<string> {
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

  async testConnection(
    config: Omit<SSHConnection, 'id' | 'client' | 'isConnected' | 'lastUsed'>
  ): Promise<{ success: boolean; message: string }> {
    const client = new Client()

    return new Promise(resolve => {
      const timeout = setTimeout(() => {
        client.end()
        resolve({
          success: false,
          message: '连接超时（10秒）'
        })
      }, 10000) // 10秒超时

      client.on('ready', () => {
        clearTimeout(timeout)
        client.end()
        resolve({
          success: true,
          message: '连接成功'
        })
      })

      client.on('error', (err: any) => {
        clearTimeout(timeout)
        client.end()

        let message = '连接失败'
        if (err.code === 'ENOTFOUND') {
          message = '主机地址无法解析'
        } else if (err.code === 'ECONNREFUSED') {
          message = '连接被拒绝，请检查主机地址和端口'
        } else if (err.code === 'ETIMEDOUT') {
          message = '连接超时，请检查网络和防火墙设置'
        } else if (err.level === 'authentication') {
          message = '身份验证失败，请检查用户名和密码/私钥'
        } else if (err.message) {
          message = err.message
        }

        resolve({
          success: false,
          message
        })
      })

      const connectConfig: any = {
        host: config.host,
        port: config.port,
        username: config.username,
        readyTimeout: (config.timeout ?? 10) * 1000
      }

      if (config.keepAlive !== false) {
        connectConfig.keepaliveInterval = (config.keepAliveInterval ?? 15) * 1000
        connectConfig.keepaliveCountMax = 3
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
    const startTime = Date.now()
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
          console.warn('[SSHManager] [listFiles] 创建 SFTP 会话失败', {
            connectionId: id,
            durationMs: Date.now() - startTime,
            error: err.message
          })
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
    const startTime = Date.now()

    const shellFiles = await this.listFilesViaPersistentShell(id, remotePath)
    if (shellFiles !== null) {
      return shellFiles
    }

    try {
      const execFiles = await this.listFilesViaExec(id, remotePath)
      if (execFiles !== null) {
        return execFiles
      }
    } catch (error: any) {
      console.warn('[SSHManager] [listFiles] exec 列目录失败，回退 SFTP', {
        connectionId: id,
        remotePath,
        durationMs: Date.now() - startTime,
        error: error.message
      })
    }

    return this.listFilesViaSftp(id, remotePath, startTime)
  }

  // 上传文件
  async uploadFile(id: string, localPath: string, remotePath: string): Promise<void> {
    const sftp = await this.getSFTP(id)

    // 连续进度更新
    let lastReportedProgress = -1
    let totalSize = 0 // 存储文件总大小
    let hasError = false

    const reportProgress = (progress: number, transferred: number, total: number) => {
      // 如果已经发生错误，不再发送进度
      if (hasError) return

      // 保留一位小数，减少频繁更新但保持连续性
      const roundedProgress = Math.round(progress * 10) / 10
      if (roundedProgress !== lastReportedProgress) {
        lastReportedProgress = roundedProgress
        windowEvents.sendToRenderer('ssh:upload-progress', {
          id,
          localPath,
          remotePath,
          progress: roundedProgress,
          transferred,
          total
        })
      }
    }

    return new Promise((resolve, reject) => {
      sftp.fastPut(
        localPath,
        remotePath,
        {
          step: (transferred, chunk, total) => {
            totalSize = total // 更新总大小
            const progress = (transferred / total) * 100
            reportProgress(progress, transferred, total)
          }
        },
        err => {
          if (err) {
            hasError = true
            console.error(`[SSH上传失败] ${localPath} -> ${remotePath}:`, err)
            reject(err)
            return
          }

          // 只有在没有错误的情况下才标记完成
          if (!hasError) {
            // 发送最终的100%进度
            reportProgress(100, totalSize, totalSize)
            resolve()
          }
        }
      )
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

    // 连续进度更新
    let lastReportedProgress = -1
    let totalSize = 0 // 存储文件总大小

    const reportProgress = (progress: number, transferred: number, total: number) => {
      // 保留一位小数，减少频繁更新但保持连续性
      const roundedProgress = Math.round(progress * 10) / 10
      if (roundedProgress !== lastReportedProgress) {
        lastReportedProgress = roundedProgress
        windowEvents.sendToRenderer('ssh:download-progress', {
          id,
          remotePath,
          localPath,
          progress: roundedProgress,
          transferred,
          total
        })
      }
    }

    return new Promise((resolve, reject) => {
      sftp.fastGet(
        remotePath,
        localPath,
        {
          step: (transferred, chunk, total) => {
            totalSize = total // 更新总大小
            const progress = (transferred / total) * 100
            reportProgress(progress, transferred, total)
          }
        },
        err => {
          if (err) {
            reject(err)
            return
          }

          // 发送最终的100%进度
          reportProgress(100, totalSize, totalSize)
          resolve()
        }
      )
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
        sftp.unlink(remotePath, err => {
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
                sftp.unlink(itemPath, e => {
                  if (e) rej(e)
                  else res()
                })
              })
            }
          }

          // 删除空目录
          sftp.rmdir(remotePath, e => {
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
      sftp.mkdir(remotePath, err => {
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

ipcMain.handle('ssh:resize', async (_, id: string, cols: number, rows: number) => {
  try {
    await sshManager.resize(id, cols, rows)
    return true
  } catch (error) {
    console.error('SSH resize error:', error)
    throw error
  }
})

ipcMain.handle('ssh:execute', async (_, id: string, command: string, requestId?: string) => {
  try {
    return await sshManager.execute(id, command, requestId)
  } catch (error) {
    console.error('SSH execute error:', error)
    throw error
  }
})

ipcMain.handle('ssh:cancel-execute', async (_, requestId: string) => {
  try {
    return await sshManager.cancelExecute(requestId)
  } catch (error) {
    console.error('SSH cancel execute error:', error)
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

ipcMain.handle('ssh:execute-silent', async (_, id: string, command: string) => {
  try {
    return await sshManager.executeSilent(id, command)
  } catch (error) {
    console.error('SSH execute silent error:', error)
    throw error
  }
})

ipcMain.handle('ssh:get-current-directory', async (_, id: string) => {
  try {
    return await sshManager.getCurrentDirectory(id)
  } catch (error) {
    console.error('SSH get current directory error:', error)
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
    return {
      success: false,
      message: error instanceof Error ? error.message : '测试连接时发生未知错误'
    }
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
    throw error // 抛出异常而不是返回错误对象
  }
})

ipcMain.handle(
  'ssh:download-file',
  async (_, id: string, remotePath: string, localPath: string) => {
    try {
      await sshManager.downloadFile(id, remotePath, localPath)
      return { success: true }
    } catch (error: any) {
      console.error('SSH download file error:', error)
      throw error // 抛出异常而不是返回错误对象
    }
  }
)

ipcMain.handle(
  'ssh:delete-file',
  async (_, id: string, remotePath: string, isDirectory: boolean) => {
    try {
      await sshManager.deleteFile(id, remotePath, isDirectory)
      return { success: true }
    } catch (error: any) {
      console.error('SSH delete file error:', error)
      throw error // 抛出异常而不是返回错误对象
    }
  }
)

ipcMain.handle('ssh:create-directory', async (_, id: string, remotePath: string) => {
  try {
    await sshManager.createDirectory(id, remotePath)
    return { success: true }
  } catch (error: any) {
    console.error('SSH create directory error:', error)
    throw error // 抛出异常而不是返回错误对象
  }
})

// ============= SSH 树形结构管理 =============
const sshTreeService = getSSHTreeService()

// 获取 SSH 树
ipcMain.handle('ssh:get-tree', async (_, userId: string) => {
  try {
    return sshTreeService.getSSHTree(userId)
  } catch (error) {
    console.error('[IPC] ssh:get-tree error:', error)
    throw error
  }
})

// 创建文件夹
ipcMain.handle('ssh:create-folder', async (_, userId: string, data: any) => {
  try {
    return sshTreeService.createFolder(userId, data)
  } catch (error) {
    console.error('[IPC] ssh:create-folder error:', error)
    throw error
  }
})

// 更新文件夹
ipcMain.handle('ssh:update-folder', async (_, userId: string, folderId: string, data: any) => {
  try {
    return sshTreeService.updateFolder(userId, folderId, data)
  } catch (error) {
    console.error('[IPC] ssh:update-folder error:', error)
    throw error
  }
})

// 删除文件夹
ipcMain.handle('ssh:delete-folder', async (_, userId: string, folderId: string) => {
  try {
    return sshTreeService.deleteFolder(userId, folderId)
  } catch (error) {
    console.error('[IPC] ssh:delete-folder error:', error)
    throw error
  }
})

// 创建连接配置
ipcMain.handle('ssh:create-connection-config', async (_, userId: string, data: any) => {
  try {
    return sshTreeService.createConnection(userId, data)
  } catch (error) {
    console.error('[IPC] ssh:create-connection-config error:', error)
    throw error
  }
})

// 更新连接配置
ipcMain.handle(
  'ssh:update-connection-config',
  async (_, userId: string, connectionId: string, data: any) => {
    try {
      return sshTreeService.updateConnection(userId, connectionId, data)
    } catch (error) {
      console.error('[IPC] ssh:update-connection-config error:', error)
      throw error
    }
  }
)

// 删除连接配置
ipcMain.handle('ssh:delete-connection-config', async (_, userId: string, connectionId: string) => {
  try {
    return sshTreeService.deleteConnection(userId, connectionId)
  } catch (error) {
    console.error('[IPC] ssh:delete-connection-config error:', error)
    throw error
  }
})

// 移动节点
ipcMain.handle('ssh:move-node', async (_, userId: string, data: any) => {
  try {
    return sshTreeService.moveNode(
      userId,
      data.nodeId,
      data.nodeType,
      data.targetFolderId,
      data.order || 0
    )
  } catch (error) {
    console.error('[IPC] ssh:move-node error:', error)
    throw error
  }
})

export { sshManager }
