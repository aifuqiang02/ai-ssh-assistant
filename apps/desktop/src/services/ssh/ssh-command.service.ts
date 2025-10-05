/**
 * SSH 命令执行服务
 * 封装 Electron IPC 调用，用于在远程服务器上执行命令
 */

export interface SSHCommandResult {
  success: boolean
  output: string
  error?: string
}

/**
 * 执行 SSH 命令
 * @param connectionId SSH 连接 ID
 * @param command 要执行的命令
 * @returns 命令执行结果
 */
export async function executeSSHCommand(
  connectionId: string,
  command: string
): Promise<SSHCommandResult> {
  console.log('[SSH Service] ============ 开始执行 SSH 命令 ============')
  console.log('[SSH Service] 连接ID:', connectionId)
  console.log('[SSH Service] 命令:', command)
  
  try {
    // 检查是否在 Electron 环境中
    console.log('[SSH Service] 检查 Electron API...')
    console.log('[SSH Service] window.electronAPI 存在:', !!window.electronAPI)
    
    if (!window.electronAPI) {
      console.error('[SSH Service] ❌ Electron API 不可用')
      throw new Error('Electron API 不可用，请确保在 Electron 环境中运行')
    }

    console.log('[SSH Service] ✅ Electron API 可用')
    console.log('[SSH Service] 调用 window.electronAPI.ssh.execute...')
    
    // 调用 Electron IPC
    const result = await window.electronAPI.ssh.execute(connectionId, command)
    
    console.log('[SSH Service] IPC 调用完成')
    console.log('[SSH Service] 返回结果类型:', typeof result)
    console.log('[SSH Service] 返回结果:', result)
    console.log('[SSH Service] 返回结果的所有键:', result ? Object.keys(result) : 'null')

    // 处理 null 或 undefined
    if (!result) {
      console.log('[SSH Service] ⚠️ 返回结果为空')
      return {
        success: false,
        output: '',
        error: '命令执行没有返回结果'
      }
    }

    // 处理字符串结果
    if (typeof result === 'string') {
      console.log('[SSH Service] 结果是字符串')
      console.log('[SSH Service] ✅ 命令执行完成')
      return {
        success: true,
        output: result
      }
    }

    // 处理对象结果
    if (typeof result === 'object') {
      console.log('[SSH Service] 结果是对象，开始解析...')
      console.log('[SSH Service] result.success:', result.success)
      console.log('[SSH Service] result.output:', result.output)
      console.log('[SSH Service] result.stdout:', result.stdout)
      console.log('[SSH Service] result.error:', result.error)
      console.log('[SSH Service] result.stderr:', result.stderr)
      
      // 提取输出和错误
      const output = result.output || result.stdout || result.data || ''
      const error = result.error || result.stderr || result.message || ''
      const success = result.success !== false && !error
      
      console.log('[SSH Service] 解析后 - output:', output ? `存在 (${output.length} 字符)` : '空')
      console.log('[SSH Service] 解析后 - error:', error ? `存在 (${error})` : '无')
      console.log('[SSH Service] 解析后 - success:', success)

      const finalResult = {
        success: success,
        output: output ? output.toString() : '',
        error: error ? error.toString() : undefined
      }
      
      console.log('[SSH Service] ✅ 命令执行完成')
      console.log('[SSH Service] 最终成功状态:', finalResult.success)
      console.log('[SSH Service] 最终输出长度:', finalResult.output.length)
      console.log('[SSH Service] 最终输出内容:', finalResult.output.substring(0, 200))
      
      return finalResult
    }

    // 其他情况
    console.error('[SSH Service] ❌ 意外的结果格式')
    console.error('[SSH Service] 结果类型:', typeof result)
    console.error('[SSH Service] 结果值:', result)
    
    return {
      success: false,
      output: '',
      error: `意外的结果格式: ${typeof result}`
    }
  } catch (error: any) {
    console.error('[SSH Service] ❌ SSH 命令执行失败')
    console.error('[SSH Service] 错误:', error)
    console.error('[SSH Service] 错误消息:', error.message)
    console.error('[SSH Service] 错误堆栈:', error.stack)
    
    return {
      success: false,
      output: '',
      error: error.message || '命令执行失败'
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
  filePath: string
): Promise<SSHCommandResult> {
  // 使用 cat 命令读取文件，如果失败则尝试使用 head
  const command = `cat "${filePath}" 2>/dev/null || head -n 1000 "${filePath}"`
  return executeSSHCommand(connectionId, command)
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
  showHidden: boolean = false
): Promise<SSHCommandResult> {
  const command = showHidden ? `ls -la "${dirPath}"` : `ls -l "${dirPath}"`
  return executeSSHCommand(connectionId, command)
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

// 导出全局类型声明（供 TypeScript 使用）
declare global {
  interface Window {
    electronAPI: {
      ssh: {
        connect: (config: any) => Promise<any>
        disconnect: (id: string) => Promise<any>
        execute: (id: string, command: string) => Promise<any>
        getInitialOutput: (id: string) => Promise<any>
        getConnections: () => Promise<any>
        saveConnection: (config: any) => Promise<any>
        deleteConnection: (id: string) => Promise<any>
        testConnection: (config: any) => Promise<any>
        listFiles: (id: string, remotePath: string) => Promise<any>
        uploadFile: (id: string, localPath: string, remotePath: string) => Promise<any>
        downloadFile: (id: string, remotePath: string, localPath: string) => Promise<any>
        deleteFile: (id: string, remotePath: string, isDirectory: boolean) => Promise<any>
        createDirectory: (id: string, remotePath: string) => Promise<any>
      }
      on: (channel: string, callback: (data: any) => void) => () => void
      onConnectionStatusChange: (callback: (data: any) => void) => () => void
      // ... 其他 API
    }
  }
}

