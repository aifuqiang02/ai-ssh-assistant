/**
 * Shell IPC 处理器
 */
import { ipcMain, IpcMainInvokeEvent, shell, app } from 'electron'
import path from 'path'

/**
 * 在文件管理器中显示文件
 */
async function showItemInFolder(_event: IpcMainInvokeEvent, filePath: string): Promise<void> {
  // 如果路径是相对路径，转换为绝对路径（相对于 userData）
  let absolutePath = filePath
  if (!path.isAbsolute(filePath)) {
    absolutePath = path.join(app.getPath('userData'), filePath)
  }
  
  // 规范化路径，确保在 Windows 上使用正确的路径分隔符
  absolutePath = path.normalize(absolutePath)
  
  // 在文件管理器中显示文件
  shell.showItemInFolder(absolutePath)
}

/**
 * 打开路径（文件或文件夹）
 */
async function openPath(_event: IpcMainInvokeEvent, targetPath: string): Promise<string> {
  // 如果路径是相对路径，转换为绝对路径
  let absolutePath = targetPath
  if (!path.isAbsolute(targetPath)) {
    absolutePath = path.join(app.getPath('userData'), targetPath)
  }
  
  // 规范化路径，确保在 Windows 上使用正确的路径分隔符
  absolutePath = path.normalize(absolutePath)
  
  // 打开路径
  return await shell.openPath(absolutePath)
}

/**
 * 在默认浏览器中打开 URL
 */
async function openExternal(_event: IpcMainInvokeEvent, url: string): Promise<void> {
  await shell.openExternal(url)
}

/**
 * 注册 Shell 相关的 IPC 处理器
 */
export function registerShellHandlers() {
  ipcMain.handle('shell:show-item-in-folder', showItemInFolder)
  ipcMain.handle('shell:open-path', openPath)
  ipcMain.handle('shell:open-external', openExternal)
}

