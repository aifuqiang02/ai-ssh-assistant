interface LogEntry {
  timestamp: string
  type: 'user' | 'assistant' | 'tool' | 'error' | 'system'
  content: string
  details?: Record<string, any>
}

class ChatLogger {
  private logs: LogEntry[] = []
  private logPath: string = ''
  private initialized: boolean = false

  private init() {
    if (this.initialized) return
    this.initialized = true

    const date = new Date().toISOString().slice(0, 10)
    this.logPath = `logs/chat-${date}.md`

    // 通过 IPC 调用主进程创建日志目录
    const api = (window as any).electronAPI
    if (api?.mkdirRecursive) {
      api
        .mkdirRecursive('logs')
        .catch((err: any) => console.error('[Logger] 创建日志目录失败:', err))
    } else {
      console.warn('[Logger] electronAPI.mkdirRecursive 不可用')
    }

    // 初始化文件
    this.writeToFile(`# Chat Log - ${date}\n\nTotal entries: 0\n\n---\n\n`)
  }

  private writeToFile(content: string) {
    const api = (window as any).electronAPI
    if (api?.fs?.writeFile) {
      api.fs
        .writeFile(this.logPath, content)
        .catch((err: any) => console.error('[Logger] 写入文件失败:', err))
    } else {
      console.warn('[Logger] electronAPI.fs.writeFile 不可用')
    }
  }

  log(type: LogEntry['type'], content: string, details?: Record<string, any>) {
    this.init()

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      content,
      details
    }
    this.logs.push(entry)
    this.appendToFile(entry)
  }

  user(content: string) {
    this.log('user', content)
  }

  assistant(content: string) {
    this.log('assistant', content)
  }

  tool(toolName: string, params: Record<string, any>, result: any) {
    this.log('tool', `Tool: ${toolName}`, { params, result })
  }

  error(message: string, details?: Record<string, any>) {
    this.log('error', message, details)
  }

  system(message: string) {
    this.log('system', message)
  }

  private appendToFile(entry: LogEntry) {
    const timestamp = entry.timestamp.slice(11, 19)
    const emoji = {
      user: '👤',
      assistant: '🤖',
      tool: '🔧',
      error: '❌',
      system: 'ℹ️'
    }[entry.type]

    let md = `\n### ${timestamp} ${emoji} ${entry.type.toUpperCase()}\n\n`
    md += `\`\`\`\n${entry.content.substring(0, 500)}\n\`\`\`\n`

    if (entry.details) {
      md += `\n<details>\n<summary>Details</summary>\n\n\`\`\`json\n${JSON.stringify(entry.details, null, 2)}\n\`\`\`\n</details>\n`
    }

    const api = (window as any).electronAPI
    if (api?.fs?.appendFile) {
      api.fs
        .appendFile(this.logPath, md)
        .catch((err: any) => console.error('[Logger] 追加文件失败:', err))
    } else {
      console.warn('[Logger] electronAPI.fs.appendFile 不可用')
    }
  }

  exportAll(): string {
    let md = `# Chat Log - ${new Date().toISOString().slice(0, 10)}\n\n`
    md += `Total entries: ${this.logs.length}\n\n`

    for (const entry of this.logs) {
      const timestamp = entry.timestamp.slice(11, 19)
      const emoji = {
        user: '👤',
        assistant: '🤖',
        tool: '🔧',
        error: '❌',
        system: 'ℹ️'
      }[entry.type]

      md += `### ${timestamp} ${emoji} ${entry.type.toUpperCase()}\n\n`
      md += `\`\`\`\n${entry.content}\n\`\`\`\n`

      if (entry.details) {
        md += `\n<details>\n<summary>Details</summary>\n\n\`\`\`json\n${JSON.stringify(entry.details, null, 2)}\n\`\`\`\n</details>\n`
      }

      md += '\n---\n\n'
    }

    return md
  }

  clear() {
    this.logs = []
  }
}

export const chatLogger = new ChatLogger()
