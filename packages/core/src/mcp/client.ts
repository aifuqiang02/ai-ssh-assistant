function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

interface EventListener {
  callback: Function
  once: boolean
}

class BrowserEventEmitter {
  private events: Map<string, EventListener[]> = new Map()

  on(event: string, callback: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push({ callback, once: false })
    return this
  }

  once(event: string, callback: Function): this {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push({ callback, once: true })
    return this
  }

  off(event: string, callback?: Function): this {
    if (!callback) {
      this.events.delete(event)
      return this
    }
    const listeners = this.events.get(event)
    if (listeners) {
      this.events.set(
        event,
        listeners.filter(l => l.callback !== callback)
      )
    }
    return this
  }

  emit(event: string, ...args: unknown[]): boolean {
    const listeners = this.events.get(event)
    if (!listeners) return false

    for (const listener of [...listeners]) {
      listener.callback(...args)
      if (listener.once) {
        this.off(event, listener.callback)
      }
    }
    return true
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
    return this
  }
}

export interface MCPMessage {
  type: 'request' | 'response' | 'notification'
  method?: string
  params?: Record<string, unknown>
  result?: Record<string, unknown>
  id?: string
  error?: string
}

export interface MCPToolInfo {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export interface MCPClientOptions {
  timeout?: number
  reconnectAttempts?: number
  reconnectDelay?: number
}

export class MCPClient extends BrowserEventEmitter {
  private socket: WebSocket | null = null
  private url: string = ''
  private pending = new Map<
    string,
    { resolve: Function; reject: Function; timeout: NodeJS.Timeout }
  >()
  private options: MCPClientOptions
  private reconnectAttemptsLeft: number = 0
  private isConnecting: boolean = false

  constructor(options: MCPClientOptions = {}) {
    super()
    this.options = {
      timeout: options.timeout ?? 30000,
      reconnectAttempts: options.reconnectAttempts ?? 3,
      reconnectDelay: options.reconnectDelay ?? 1000
    }
    this.reconnectAttemptsLeft = this.options.reconnectAttempts!
  }

  async connect(url: string): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return
    }

    if (this.isConnecting) {
      throw new Error('Connection already in progress')
    }

    this.url = url
    this.isConnecting = true

    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url)

        this.socket.onopen = () => {
          this.isConnecting = false
          this.reconnectAttemptsLeft = this.options.reconnectAttempts!
          this.emit('connected')
          resolve()
        }

        this.socket.onerror = error => {
          this.isConnecting = false
          this.emit('error', error)
          reject(new Error('WebSocket connection error'))
        }

        this.socket.onclose = event => {
          this.isConnecting = false
          this.emit('disconnected', event.code, event.reason)

          if (this.reconnectAttemptsLeft > 0 && !event.wasClean) {
            this.reconnectAttemptsLeft--
            setTimeout(() => {
              this.connect(this.url).catch(() => {})
            }, this.options.reconnectDelay)
          }
        }

        this.socket.onmessage = event => {
          try {
            const message: MCPMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            this.emit('messageError', error)
          }
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  async disconnect(): Promise<void> {
    this.reconnectAttemptsLeft = 0

    return new Promise(resolve => {
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        resolve()
        return
      }

      this.socket.onclose = () => {
        this.socket = null
        resolve()
      }

      this.socket.close(1000, 'Client disconnect')
    })
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }

  async listTools(): Promise<MCPToolInfo[]> {
    const id = generateId()

    const message: MCPMessage = {
      type: 'request',
      method: 'tools/list',
      params: {},
      id
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error('List tools request timeout'))
      }, this.options.timeout)

      this.pending.set(id, { resolve, reject, timeout })

      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message))
      } else {
        clearTimeout(timeout)
        reject(new Error('Not connected'))
      }
    })
  }

  async callTool(name: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to MCP server')
    }

    const id = generateId()

    const message: MCPMessage = {
      type: 'request',
      method: 'tools/call',
      params: { name, arguments: params },
      id
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`Tool call timeout: ${name}`))
      }, this.options.timeout)

      this.pending.set(id, { resolve, reject, timeout })
      if (this.socket) {
        this.socket.send(JSON.stringify(message))
      } else {
        clearTimeout(timeout)
        reject(new Error('Socket not available'))
      }
    })
  }

  private handleMessage(message: MCPMessage): void {
    if (message.type === 'response' && message.id) {
      const pending = this.pending.get(message.id)
      if (pending) {
        clearTimeout(pending.timeout)
        this.pending.delete(message.id)

        if (message.error) {
          pending.reject(new Error(message.error))
        } else if (message.result) {
          pending.resolve(message.result)
        } else {
          pending.resolve(undefined)
        }
      }
    } else if (message.type === 'notification') {
      this.handleNotification(message)
    }
  }

  private handleNotification(message: MCPMessage): void {
    switch (message.method) {
      case 'notifications/toolsChanged':
        this.emit('toolsChanged', message.params)
        break
      case 'notifications/log':
        this.emit('log', message.params)
        break
      default:
        this.emit('notification', message)
    }
  }

  async sendNotification(method: string, params?: Record<string, unknown>): Promise<void> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to MCP server')
    }

    const message: MCPMessage = {
      type: 'notification',
      method,
      params
    }

    this.socket.send(JSON.stringify(message))
  }
}

export { BrowserEventEmitter }
