# 如何用 Node.js 实现一个完整的 SSH 客户端

> 深入讲解如何使用 ssh2 库实现一个功能完整、性能优秀的 SSH 客户端。

## 前言

SSH（Secure Shell）是远程管理服务器的标准协议。在 AI SSH Assistant 中，SSH 客户端是最核心的模块之一。

本文将详细讲解如何用 Node.js 实现一个完整的 SSH 客户端，包括：
- 🔐 密码和私钥认证
- 💻 命令执行
- 📁 SFTP 文件传输
- 🔄 连接管理
- ⚠️ 错误处理

---

## SSH 协议基础

### SSH 是什么？

SSH（Secure Shell）是一种加密的网络协议，用于在不安全的网络中安全地运行网络服务。

**主要用途**：
- 远程登录服务器
- 执行远程命令
- 传输文件（SFTP/SCP）
- 端口转发/隧道

**特点**：
- ✅ 加密传输
- ✅ 身份验证
- ✅ 数据完整性
- ✅ 端口转发

### SSH 认证方式

**1. 密码认证**
```bash
ssh user@host
# 输入密码
```

**2. 公钥认证（推荐）**
```bash
# 生成密钥对
ssh-keygen -t rsa -b 4096

# 复制公钥到服务器
ssh-copy-id user@host

# 使用私钥登录
ssh -i ~/.ssh/id_rsa user@host
```

**优势对比**：
| 认证方式 | 安全性 | 便捷性 | 适用场景 |
|---------|--------|--------|---------|
| 密码 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 临时访问 |
| 公钥 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 自动化、生产环境 |

### SSH 通道类型

**1. exec - 执行单个命令**
```bash
ssh user@host "ls -la"
```

**2. shell - 交互式 Shell**
```bash
ssh user@host
# 进入交互式终端
```

**3. sftp - 文件传输**
```bash
sftp user@host
# 进入 SFTP 模式
```

---

## ssh2 库介绍

### 为什么选择 ssh2？

在 Node.js 生态中，ssh2 是最成熟的 SSH 客户端库。

**优势**：
- ✅ 功能完整（支持所有 SSH 特性）
- ✅ 纯 JavaScript 实现（无需编译）
- ✅ 性能优秀
- ✅ 文档详细
- ✅ 社区活跃

**安装**：
```bash
npm install ssh2
# 或
pnpm add ssh2
```

### 基本用法

```typescript
import { Client } from 'ssh2'

const conn = new Client()

conn
  .on('ready', () => {
    console.log('SSH 连接成功！')
    
    // 执行命令
    conn.exec('ls -la', (err, stream) => {
      if (err) throw err
      
      stream
        .on('data', (data: Buffer) => {
          console.log('输出:', data.toString())
        })
        .on('close', () => {
          console.log('命令执行完成')
          conn.end()
        })
    })
  })
  .on('error', (err) => {
    console.error('SSH 连接失败:', err)
  })
  .connect({
    host: '192.168.1.100',
    port: 22,
    username: 'root',
    password: 'your-password'
  })
```

---

## 连接管理实现

### 连接配置

```typescript
// types/ssh.ts
export interface SSHConfig {
  host: string
  port: number
  username: string
  authType: 'password' | 'privateKey'
  password?: string
  privateKey?: string
  passphrase?: string
  timeout?: number
}

export interface SSHConnection {
  id: string
  name: string
  config: SSHConfig
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  client?: Client
  lastError?: string
}
```

### SSH 服务实现

```typescript
// services/ssh.service.ts
import { Client, ClientChannel } from 'ssh2'
import { EventEmitter } from 'events'
import crypto from 'crypto'

export class SSHService extends EventEmitter {
  private connections: Map<string, SSHConnection> = new Map()

  /**
   * 创建 SSH 连接
   */
  async connect(config: SSHConfig): Promise<string> {
    const connectionId = this.generateId()
    
    const connection: SSHConnection = {
      id: connectionId,
      name: `${config.username}@${config.host}`,
      config,
      status: 'connecting'
    }
    
    this.connections.set(connectionId, connection)
    
    try {
      const client = await this.createClient(config)
      connection.client = client
      connection.status = 'connected'
      
      // 监听断开事件
      client.on('close', () => {
        connection.status = 'disconnected'
        this.emit('disconnected', connectionId)
      })
      
      client.on('error', (err) => {
        connection.status = 'error'
        connection.lastError = err.message
        this.emit('error', connectionId, err)
      })
      
      this.emit('connected', connectionId)
      return connectionId
      
    } catch (error) {
      connection.status = 'error'
      connection.lastError = (error as Error).message
      throw error
    }
  }

  /**
   * 创建 SSH 客户端
   */
  private createClient(config: SSHConfig): Promise<Client> {
    return new Promise((resolve, reject) => {
      const client = new Client()
      
      // 设置超时
      const timeout = setTimeout(() => {
        client.end()
        reject(new Error('连接超时'))
      }, config.timeout || 30000)
      
      client
        .on('ready', () => {
          clearTimeout(timeout)
          resolve(client)
        })
        .on('error', (err) => {
          clearTimeout(timeout)
          reject(err)
        })
        .connect({
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          privateKey: config.privateKey,
          passphrase: config.passphrase,
          readyTimeout: config.timeout || 30000,
          keepaliveInterval: 10000,  // 保持连接
          keepaliveCountMax: 3
        })
    })
  }

  /**
   * 断开连接
   */
  disconnect(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (!connection) {
      throw new Error(`连接不存在: ${connectionId}`)
    }
    
    if (connection.client) {
      connection.client.end()
    }
    
    connection.status = 'disconnected'
    this.connections.delete(connectionId)
  }

  /**
   * 获取连接
   */
  getConnection(connectionId: string): SSHConnection | undefined {
    return this.connections.get(connectionId)
  }

  /**
   * 获取所有连接
   */
  getAllConnections(): SSHConnection[] {
    return Array.from(this.connections.values())
  }

  /**
   * 生成连接 ID
   */
  private generateId(): string {
    return crypto.randomBytes(16).toString('hex')
  }
}
```

---

## 命令执行实现

### exec vs shell

**exec**：
- 执行单个命令
- 命令执行完自动关闭
- 适合自动化脚本

**shell**：
- 交互式 Shell
- 需要手动关闭
- 适合终端模拟

### 命令执行（exec）

```typescript
/**
 * 执行 SSH 命令
 */
async executeCommand(
  connectionId: string,
  command: string,
  options?: {
    timeout?: number
    env?: Record<string, string>
  }
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const connection = this.getConnection(connectionId)
  if (!connection || !connection.client) {
    throw new Error('连接不存在或未连接')
  }

  return new Promise((resolve, reject) => {
    const timeout = options?.timeout || 60000
    let stdout = ''
    let stderr = ''
    let exitCode = 0

    // 设置超时
    const timer = setTimeout(() => {
      reject(new Error('命令执行超时'))
    }, timeout)

    connection.client!.exec(command, { env: options?.env }, (err, stream) => {
      if (err) {
        clearTimeout(timer)
        reject(err)
        return
      }

      stream
        .on('data', (data: Buffer) => {
          stdout += data.toString()
        })
        .stderr.on('data', (data: Buffer) => {
          stderr += data.toString()
        })

      stream.on('close', (code: number) => {
        clearTimeout(timer)
        exitCode = code
        resolve({ stdout, stderr, exitCode })
      })
    })
  })
}
```

### 实时输出处理

```typescript
/**
 * 执行命令并实时返回输出
 */
async executeCommandStream(
  connectionId: string,
  command: string,
  onData: (data: string) => void,
  onError: (data: string) => void
): Promise<number> {
  const connection = this.getConnection(connectionId)
  if (!connection || !connection.client) {
    throw new Error('连接不存在或未连接')
  }

  return new Promise((resolve, reject) => {
    connection.client!.exec(command, (err, stream) => {
      if (err) {
        reject(err)
        return
      }

      stream
        .on('data', (data: Buffer) => {
          onData(data.toString())
        })
        .stderr.on('data', (data: Buffer) => {
          onError(data.toString())
        })

      stream.on('close', (code: number) => {
        resolve(code)
      })
    })
  })
}
```

### 命令完成检测

**问题**：有些命令（如 `systemctl status`）会使用 pager，导致命令"卡住"。

**解决方案**：
1. 自动添加 `--no-pager` 参数
2. 使用完成标记

```typescript
/**
 * 智能命令执行（自动处理 pager）
 */
async executeCommandSmart(
  connectionId: string,
  command: string
): Promise<string> {
  // 检测需要 --no-pager 的命令
  const pagerCommands = ['systemctl', 'journalctl', 'git log', 'git diff']
  let finalCommand = command

  for (const cmd of pagerCommands) {
    if (command.startsWith(cmd) && !command.includes('--no-pager')) {
      finalCommand = command.replace(cmd, `${cmd} --no-pager`)
      break
    }
  }

  // 添加完成标记
  const marker = `__CMD_COMPLETE_${Date.now()}__`
  finalCommand = `(${finalCommand}) && echo "${marker}" || echo "${marker}"`

  let output = ''
  let completed = false

  await this.executeCommandStream(
    connectionId,
    finalCommand,
    (data) => {
      output += data
      if (data.includes(marker)) {
        completed = true
      }
    },
    (data) => {
      output += data
    }
  )

  // 等待标记出现
  if (!completed) {
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  // 清理输出
  return this.cleanOutput(output, marker)
}

/**
 * 清理命令输出
 */
private cleanOutput(output: string, marker: string): string {
  // 移除命令回显
  const lines = output.split('\n')
  if (lines.length > 0) {
    lines.shift() // 移除第一行（命令本身）
  }

  // 移除完成标记
  const markerIndex = output.lastIndexOf(marker)
  if (markerIndex !== -1) {
    output = output.substring(0, markerIndex)
  }

  // 移除 ANSI 转义序列
  output = output.replace(/\x1b\[[0-9;]*m/g, '')

  return output.trim()
}
```

---

## Shell 会话实现

### 交互式 Shell

```typescript
/**
 * 创建 Shell 会话
 */
async createShell(
  connectionId: string,
  onData: (data: string) => void
): Promise<ClientChannel> {
  const connection = this.getConnection(connectionId)
  if (!connection || !connection.client) {
    throw new Error('连接不存在或未连接')
  }

  return new Promise((resolve, reject) => {
    connection.client!.shell((err, stream) => {
      if (err) {
        reject(err)
        return
      }

      // 监听数据
      stream.on('data', (data: Buffer) => {
        onData(data.toString())
      })

      // 监听关闭
      stream.on('close', () => {
        console.log('Shell 会话关闭')
      })

      resolve(stream)
    })
  })
}

/**
 * 向 Shell 写入数据
 */
writeToShell(stream: ClientChannel, data: string): void {
  stream.write(data)
}

/**
 * 调整终端大小
 */
resizeShell(stream: ClientChannel, rows: number, cols: number): void {
  stream.setWindow(rows, cols, 0, 0)
}
```

### 与 xterm.js 集成

```typescript
// 在 Electron 渲染进程中
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

// 创建终端
const terminal = new Terminal({
  cursorBlink: true,
  fontSize: 14,
  fontFamily: 'Consolas, monospace',
  theme: {
    background: '#1e1e1e',
    foreground: '#d4d4d4'
  }
})

const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)
terminal.open(document.getElementById('terminal')!)
fitAddon.fit()

// 创建 SSH Shell
const stream = await sshService.createShell(connectionId, (data) => {
  terminal.write(data)
})

// 终端输入 -> SSH
terminal.onData((data) => {
  sshService.writeToShell(stream, data)
})

// 终端大小变化 -> SSH
terminal.onResize(({ rows, cols }) => {
  sshService.resizeShell(stream, rows, cols)
})
```

---

## SFTP 文件传输

### SFTP 客户端

```typescript
/**
 * 创建 SFTP 会话
 */
async createSFTP(connectionId: string): Promise<SFTPWrapper> {
  const connection = this.getConnection(connectionId)
  if (!connection || !connection.client) {
    throw new Error('连接不存在或未连接')
  }

  return new Promise((resolve, reject) => {
    connection.client!.sftp((err, sftp) => {
      if (err) {
        reject(err)
        return
      }
      resolve(sftp)
    })
  })
}
```

### 文件上传

```typescript
/**
 * 上传文件
 */
async uploadFile(
  connectionId: string,
  localPath: string,
  remotePath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const sftp = await this.createSFTP(connectionId)
  const fs = require('fs')

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(localPath)
    const writeStream = sftp.createWriteStream(remotePath)

    // 获取文件大小
    const stats = fs.statSync(localPath)
    const totalSize = stats.size
    let uploadedSize = 0

    readStream.on('data', (chunk: Buffer) => {
      uploadedSize += chunk.length
      if (onProgress) {
        const progress = (uploadedSize / totalSize) * 100
        onProgress(progress)
      }
    })

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('close', resolve)

    readStream.pipe(writeStream)
  })
}
```

### 文件下载

```typescript
/**
 * 下载文件
 */
async downloadFile(
  connectionId: string,
  remotePath: string,
  localPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const sftp = await this.createSFTP(connectionId)
  const fs = require('fs')

  return new Promise(async (resolve, reject) => {
    // 获取远程文件大小
    const stats = await new Promise<any>((res, rej) => {
      sftp.stat(remotePath, (err, stats) => {
        if (err) rej(err)
        else res(stats)
      })
    })

    const totalSize = stats.size
    let downloadedSize = 0

    const readStream = sftp.createReadStream(remotePath)
    const writeStream = fs.createWriteStream(localPath)

    readStream.on('data', (chunk: Buffer) => {
      downloadedSize += chunk.length
      if (onProgress) {
        const progress = (downloadedSize / totalSize) * 100
        onProgress(progress)
      }
    })

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('close', resolve)

    readStream.pipe(writeStream)
  })
}
```

### 文件列表

```typescript
/**
 * 列出目录内容
 */
async listDirectory(
  connectionId: string,
  path: string
): Promise<FileInfo[]> {
  const sftp = await this.createSFTP(connectionId)

  return new Promise((resolve, reject) => {
    sftp.readdir(path, (err, list) => {
      if (err) {
        reject(err)
        return
      }

      const files: FileInfo[] = list.map((item) => ({
        name: item.filename,
        size: item.attrs.size,
        isDirectory: item.attrs.isDirectory(),
        isFile: item.attrs.isFile(),
        permissions: item.attrs.mode,
        modifiedTime: new Date(item.attrs.mtime * 1000)
      }))

      resolve(files)
    })
  })
}

interface FileInfo {
  name: string
  size: number
  isDirectory: boolean
  isFile: boolean
  permissions: number
  modifiedTime: Date
}
```

---

## 错误处理

### 常见错误

```typescript
export enum SSHErrorCode {
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  AUTH_FAILED = 'AUTH_FAILED',
  HOST_UNREACHABLE = 'HOST_UNREACHABLE',
  COMMAND_FAILED = 'COMMAND_FAILED',
  SFTP_ERROR = 'SFTP_ERROR'
}

export class SSHError extends Error {
  constructor(
    public code: SSHErrorCode,
    message: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'SSHError'
  }
}
```

### 错误处理示例

```typescript
try {
  await sshService.connect(config)
} catch (error) {
  if (error instanceof SSHError) {
    switch (error.code) {
      case SSHErrorCode.CONNECTION_TIMEOUT:
        console.error('连接超时，请检查网络')
        break
      case SSHErrorCode.AUTH_FAILED:
        console.error('认证失败，请检查用户名和密码')
        break
      case SSHErrorCode.HOST_UNREACHABLE:
        console.error('无法连接到主机，请检查 IP 和端口')
        break
      default:
        console.error('SSH 错误:', error.message)
    }
  } else {
    console.error('未知错误:', error)
  }
}
```

---

## 完整示例

```typescript
// 使用示例
async function example() {
  const sshService = new SSHService()

  try {
    // 1. 连接到服务器
    const connectionId = await sshService.connect({
      host: '192.168.1.100',
      port: 22,
      username: 'root',
      authType: 'password',
      password: 'your-password'
    })
    console.log('✅ 连接成功:', connectionId)

    // 2. 执行命令
    const result = await sshService.executeCommand(
      connectionId,
      'ls -la /home'
    )
    console.log('📝 命令输出:', result.stdout)

    // 3. 实时执行命令
    await sshService.executeCommandStream(
      connectionId,
      'tail -f /var/log/syslog',
      (data) => console.log('📄', data),
      (error) => console.error('❌', error)
    )

    // 4. 上传文件
    await sshService.uploadFile(
      connectionId,
      '/local/path/file.txt',
      '/remote/path/file.txt',
      (progress) => console.log(`📤 上传进度: ${progress.toFixed(2)}%`)
    )

    // 5. 下载文件
    await sshService.downloadFile(
      connectionId,
      '/remote/path/file.txt',
      '/local/path/file.txt',
      (progress) => console.log(`📥 下载进度: ${progress.toFixed(2)}%`)
    )

    // 6. 断开连接
    sshService.disconnect(connectionId)
    console.log('👋 已断开连接')

  } catch (error) {
    console.error('❌ 错误:', error)
  }
}
```

---

## 性能优化

### 1. 连接池

```typescript
class SSHConnectionPool {
  private pool: Map<string, Client[]> = new Map()
  private maxConnections = 5

  async getConnection(config: SSHConfig): Promise<Client> {
    const key = `${config.host}:${config.port}:${config.username}`
    
    if (!this.pool.has(key)) {
      this.pool.set(key, [])
    }

    const connections = this.pool.get(key)!
    
    // 复用现有连接
    if (connections.length > 0) {
      return connections.pop()!
    }

    // 创建新连接
    return this.createConnection(config)
  }

  releaseConnection(key: string, client: Client): void {
    const connections = this.pool.get(key)
    if (connections && connections.length < this.maxConnections) {
      connections.push(client)
    } else {
      client.end()
    }
  }
}
```

### 2. 命令缓存

```typescript
class CommandCache {
  private cache: Map<string, { result: string; timestamp: number }> = new Map()
  private ttl = 60000 // 1 分钟

  get(command: string): string | null {
    const cached = this.cache.get(command)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(command)
      return null
    }

    return cached.result
  }

  set(command: string, result: string): void {
    this.cache.set(command, {
      result,
      timestamp: Date.now()
    })
  }
}
```

---

## 总结

实现一个完整的 SSH 客户端需要考虑：

1. **连接管理** - 连接池、断线重连、超时处理
2. **命令执行** - exec vs shell、实时输出、完成检测
3. **文件传输** - 上传下载、进度显示、大文件处理
4. **错误处理** - 分类错误、友好提示、重试机制
5. **性能优化** - 连接复用、命令缓存、流式处理

**关键要点**：
- ✅ 使用 ssh2 库
- ✅ 正确处理异步操作
- ✅ 完善的错误处理
- ✅ 注意命令完成检测
- ✅ 优化性能和用户体验

---

## 项目信息

想了解更多技术细节？

- 🌟 **GitHub 仓库**：https://github.com/aifuqiang02/ai-ssh-assistant
- 📦 **下载体验**：https://github.com/aifuqiang02/ai-ssh-assistant/releases/latest
- 💬 **QQ 交流群**：307460844 - [点击加入](https://qm.qq.com/q/etLhGujyzm)

**如果觉得有用，欢迎给个 ⭐️ Star 支持一下！**

---

## 关于作者

一名热爱开源的后端开发工程师，专注于 AI 与开发工具的结合。

欢迎关注我，后续会持续分享 AI SSH Assistant 的技术细节！

---

**相关文章**：
- 上一篇：《AI SSH Assistant 架构设计：从 Monorepo 到微服务》
- 下一篇：《从 0 到 1 实现 AI 对话：OpenAI API 最佳实践》（即将发布）

---

*本文首发于 CSDN，转载请注明出处。*

