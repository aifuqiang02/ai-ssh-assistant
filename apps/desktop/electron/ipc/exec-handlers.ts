/**
 * 本地命令执行 IPC 处理器
 */
import { ipcMain } from 'electron'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'
import * as os from 'os'

const execAsync = promisify(exec)

/**
 * 注册命令执行 handlers
 */
export function registerExecHandlers() {
  // 执行命令（简单版本，返回完整输出）
  ipcMain.handle('exec:command', async (_, command: string, options?: any) => {
    try {
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB
        ...options
      })
      return {
        success: true,
        stdout,
        stderr
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        stdout: error.stdout || '',
        stderr: error.stderr || ''
      }
    }
  })

  // 执行脚本（支持实时输出）
  ipcMain.handle('exec:script', async (event, scriptPath: string, options?: any) => {
    return new Promise((resolve, reject) => {
      const platform = os.platform()
      const ext = path.extname(scriptPath).toLowerCase()

      // 根据平台和扩展名选择执行方式
      let command: string
      let args: string[]

      if (platform === 'win32') {
        if (ext === '.bat' || ext === '.cmd') {
          // Windows 批处理文件
          command = 'cmd.exe'
          args = ['/c', scriptPath]
        } else if (ext === '.ps1') {
          // PowerShell 脚本
          command = 'powershell.exe'
          args = ['-ExecutionPolicy', 'Bypass', '-File', scriptPath]
        } else if (ext === '.sh') {
          // 使用 Git Bash 或 WSL
          const gitBashPath = 'C:\\Program Files\\Git\\bin\\bash.exe'
          command = gitBashPath
          args = [scriptPath]
        } else {
          reject(new Error('Unsupported script type on Windows'))
          return
        }
      } else {
        // Linux/Mac
        if (ext === '.sh' || !ext) {
          command = '/bin/bash'
          args = [scriptPath]
        } else {
          reject(new Error('Unsupported script type on Unix'))
          return
        }
      }

      const child = spawn(command, args, {
        cwd: options?.cwd || path.dirname(scriptPath),
        env: {
          ...process.env,
          ...options?.env
        }
      })

      let stdout = ''
      let stderr = ''

      // 监听标准输出
      child.stdout?.on('data', (data: Buffer) => {
        const output = data.toString()
        stdout += output
        // 发送实时输出事件
        event.sender.send('exec:output', {
          scriptPath,
          type: 'stdout',
          data: output
        })
      })

      // 监听错误输出
      child.stderr?.on('data', (data: Buffer) => {
        const output = data.toString()
        stderr += output
        // 发送实时输出事件
        event.sender.send('exec:output', {
          scriptPath,
          type: 'stderr',
          data: output
        })
      })

      // 监听进程退出
      child.on('close', (code: number) => {
        if (code === 0) {
          resolve({
            success: true,
            code,
            stdout,
            stderr
          })
        } else {
          resolve({
            success: false,
            code,
            stdout,
            stderr,
            error: `Script exited with code ${code}`
          })
        }
      })

      // 监听错误
      child.on('error', (error: Error) => {
        reject({
          success: false,
          error: error.message,
          stdout,
          stderr
        })
      })
    })
  })

  // 检查命令是否存在
  ipcMain.handle('exec:which', async (_, command: string) => {
    try {
      const platform = os.platform()
      const whichCmd = platform === 'win32' ? 'where' : 'which'
      const { stdout } = await execAsync(`${whichCmd} ${command}`)
      return {
        exists: true,
        path: stdout.trim()
      }
    } catch {
      return {
        exists: false
      }
    }
  })

  // 获取系统信息
  ipcMain.handle('exec:platform', async () => {
    return {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      homedir: os.homedir(),
      tmpdir: os.tmpdir()
    }
  })
}

