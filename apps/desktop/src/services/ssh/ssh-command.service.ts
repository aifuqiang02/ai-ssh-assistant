/**
 * SSH 命令执行服务
 * 封装 Electron IPC 调用，用于在远程服务器上执行命令
 */

export interface SSHCommandResult {
  success: boolean
  output: string
  error?: string
}

function createAbortError() {
  const error = new Error('Command aborted')
  error.name = 'AbortError'
  return error
}

/**
 * 执行 SSH 命令
 * @param connectionId SSH 连接 ID
 * @param command 要执行的命令
 * @returns 命令执行结果
 */
export async function executeSSHCommand(
  connectionId: string,
  command: string,
  signal?: AbortSignal
): Promise<SSHCommandResult> {
  const requestId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  let abortListener: (() => void) | null = null

  try {
    // 检查是否在 Electron 环境中
    if (!window.electronAPI) {
      throw new Error('Electron API 不可用，请确保在 Electron 环境中运行')
    }

    if (signal?.aborted) {
      throw createAbortError()
    }

    if (signal) {
      abortListener = () => {
        window.electronAPI.ssh.cancelExecute(requestId).catch(() => {})
      }
      signal.addEventListener('abort', abortListener, { once: true })
    }

    // 调用 Electron IPC
    const result = await window.electronAPI.ssh.execute(connectionId, command, requestId)

    // 处理 null 或 undefined
    if (!result) {
      return {
        success: false,
        output: '',
        error: '命令执行没有返回结果'
      }
    }

    // 处理字符串结果
    if (typeof result === 'string') {
      return {
        success: true,
        output: result
      }
    }

    // 处理对象结果
    if (typeof result === 'object') {
      // 提取输出和错误
      const output = result.output || result.stdout || result.data || ''
      const error = result.error || result.stderr || result.message || ''

      if (signal?.aborted || String(error).toLowerCase().includes('aborted')) {
        throw createAbortError()
      }

      const success = result.success !== false && !error

      return {
        success: success,
        output: output ? output.toString() : '',
        error: error ? error.toString() : undefined
      }
    }

    // 其他情况
    return {
      success: false,
      output: '',
      error: `意外的结果格式: ${typeof result}`
    }
  } catch (error: any) {
    if (signal?.aborted || error?.name === 'AbortError') {
      throw createAbortError()
    }

    return {
      success: false,
      output: '',
      error: error.message || '命令执行失败'
    }
  } finally {
    if (signal && abortListener) {
      signal.removeEventListener('abort', abortListener)
    }
  }
}

/**
 * 读取远程文件内容
 * @param connectionId SSH 连接 ID
 * @param filePath 文件路径
 * @returns 文件内容
 */
export async function readRemoteFile(
  connectionId: string,
  filePath: string,
  signal?: AbortSignal
): Promise<SSHCommandResult> {
  // 使用 cat 命令读取文件，如果失败则尝试使用 head
  const command = `cat "${filePath}" 2>/dev/null || head -n 1000 "${filePath}"`
  return executeSSHCommand(connectionId, command, signal)
}

/**
 * 列出远程目录内容
 * @param connectionId SSH 连接 ID
 * @param dirPath 目录路径
 * @param showHidden 是否显示隐藏文件
 * @returns 目录列表
 */
export async function listRemoteDirectory(
  connectionId: string,
  dirPath: string,
  showHidden: boolean = false,
  signal?: AbortSignal
): Promise<SSHCommandResult> {
  const command = showHidden ? `ls -la "${dirPath}"` : `ls -l "${dirPath}"`
  return executeSSHCommand(connectionId, command, signal)
}

/**
 * 检查远程文件是否存在
 * @param connectionId SSH 连接 ID
 * @param filePath 文件路径
 * @returns 是否存在
 */
export async function checkRemoteFileExists(
  connectionId: string,
  filePath: string
): Promise<boolean> {
  const result = await executeSSHCommand(connectionId, `test -e "${filePath}" && echo "exists"`)
  return result.success && result.output.trim() === 'exists'
}

/**
 * 获取远程文件信息
 * @param connectionId SSH 连接 ID
 * @param filePath 文件路径
 * @returns 文件信息
 */
export async function getRemoteFileInfo(
  connectionId: string,
  filePath: string
): Promise<SSHCommandResult> {
  const command = `stat "${filePath}" 2>/dev/null || ls -l "${filePath}"`
  return executeSSHCommand(connectionId, command)
}
