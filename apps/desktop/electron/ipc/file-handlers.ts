import { ipcMain, dialog, shell } from 'electron'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { windowEvents } from '../shared/events'
import * as tar from 'tar'

// 文件系统处理器
class FileSystemManager {
  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (error) {
      console.error('Read file error:', error)
      throw error
    }
  }

  async writeFile(filePath: string, data: string): Promise<void> {
    try {
      // 确保目录存在
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, data, 'utf-8')
    } catch (error) {
      console.error('Write file error:', error)
      throw error
    }
  }

  async mkdirRecursive(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true })
    } catch (error) {
      console.error('mkdirRecursive error:', error)
      throw error
    }
  }

  async appendFile(filePath: string, data: string): Promise<void> {
    try {
      // 确保目录存在
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      // 检查文件是否存在，如果不存在则创建
      try {
        await fs.access(filePath)
      } catch {
        await fs.writeFile(filePath, '', 'utf-8')
      }
      await fs.appendFile(filePath, data, 'utf-8')
    } catch (error) {
      console.error('appendFile error:', error)
      throw error
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Delete file error:', error)
      throw error
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<void> {
    try {
      await fs.rename(oldPath, newPath)
    } catch (error) {
      console.error('Rename file error:', error)
      throw error
    }
  }

  async copyFile(src: string, dest: string): Promise<void> {
    try {
      await fs.mkdir(path.dirname(dest), { recursive: true })
      await fs.copyFile(src, dest)
    } catch (error) {
      console.error('Copy file error:', error)
      throw error
    }
  }

  async listDirectory(dirPath: string): Promise<any[]> {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true })
      const result = []

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name)
        const stats = await fs.stat(fullPath)

        result.push({
          name: item.name,
          path: fullPath,
          isDirectory: item.isDirectory(),
          isFile: item.isFile(),
          size: stats.size,
          modified: stats.mtime,
          permissions: stats.mode
        })
      }

      return result.sort((a, b) => {
        // 目录排在前面
        if (a.isDirectory && !b.isDirectory) return -1
        if (!a.isDirectory && b.isDirectory) return 1
        // 按名称排序
        return a.name.localeCompare(b.name)
      })
    } catch (error) {
      console.error('List directory error:', error)
      throw error
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true })
    } catch (error) {
      console.error('Create directory error:', error)
      throw error
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  async getStats(filePath: string): Promise<any> {
    try {
      const stats = await fs.stat(filePath)
      return {
        size: stats.size,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        modified: stats.mtime,
        created: stats.birthtime,
        permissions: stats.mode
      }
    } catch (error) {
      console.error('Get stats error:', error)
      throw error
    }
  }

  async uploadFile(localPath: string, remotePath: string, connectionId: string): Promise<void> {
    // 这里应该实现 SFTP 上传功能
    // 目前返回模拟结果
    return new Promise(resolve => {
      setTimeout(() => {
        //console.log(`Uploading ${localPath} to ${remotePath} via connection ${connectionId}`)

        // 通知前端上传进度
        windowEvents.sendToRenderer('file:upload-progress', {
          localPath,
          remotePath,
          connectionId,
          progress: 100,
          status: 'completed'
        })

        resolve()
      }, 2000)
    })
  }

  async downloadFile(remotePath: string, localPath: string, connectionId: string): Promise<void> {
    // 这里应该实现 SFTP 下载功能
    // 目前返回模拟结果
    return new Promise(resolve => {
      setTimeout(() => {
        //console.log(`Downloading ${remotePath} to ${localPath} via connection ${connectionId}`)

        // 通知前端下载进度
        windowEvents.sendToRenderer('file:download-progress', {
          remotePath,
          localPath,
          connectionId,
          progress: 100,
          status: 'completed'
        })

        resolve()
      }, 2000)
    })
  }

  async showOpenDialog(options: any): Promise<string[]> {
    const mainWindow = windowEvents.getMainWindow()
    if (!mainWindow) {
      throw new Error('Main window not available')
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      title: options.title || '选择文件',
      defaultPath: options.defaultPath,
      buttonLabel: options.buttonLabel || '选择',
      filters: options.filters || [{ name: '所有文件', extensions: ['*'] }],
      properties: options.properties || ['openFile']
    })

    return result.canceled ? [] : result.filePaths
  }

  async showSaveDialog(options: any): Promise<string | null> {
    const mainWindow = windowEvents.getMainWindow()
    if (!mainWindow) {
      throw new Error('Main window not available')
    }

    const result = await dialog.showSaveDialog(mainWindow, {
      title: options.title || '保存文件',
      defaultPath: options.defaultPath,
      buttonLabel: options.buttonLabel || '保存',
      filters: options.filters || [{ name: '所有文件', extensions: ['*'] }]
    })

    return result.canceled ? null : result.filePath || null
  }

  async openPath(targetPath: string): Promise<string> {
    try {
      // 使用 shell.openPath 打开文件夹或文件
      const errorMessage = await shell.openPath(targetPath)
      return errorMessage // 如果成功返回空字符串，失败返回错误信息
    } catch (error) {
      console.error('Open path error:', error)
      throw error
    }
  }

  async createArchive(
    baseDir: string,
    files: string[],
    outputPath: string
  ): Promise<{ success: boolean; size?: number; error?: string }> {
    try {
      //console.log('[FileSystem] 创建压缩包:', { baseDir, files, outputPath })

      // 确保输出目录存在
      const outputDir = path.dirname(outputPath)
      await fs.mkdir(outputDir, { recursive: true })

      // 使用 tar 打包
      await tar.create(
        {
          gzip: true,
          file: outputPath,
          cwd: baseDir,
          portable: true
        },
        files
      )

      // 获取压缩包大小
      const stats = await fs.stat(outputPath)

      //console.log('[FileSystem] 压缩包创建成功:', {
      //  outputPath,
      //  size: stats.size,
      //  sizeMB: (stats.size / 1024 / 1024).toFixed(2)
      //})

      return {
        success: true,
        size: stats.size
      }
    } catch (error: any) {
      console.error('[FileSystem] 创建压缩包失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 创建文件系统管理器实例
const fsManager = new FileSystemManager()

// 注册 IPC 处理器
ipcMain.handle('fs:read-file', async (_, filePath: string) => {
  try {
    return await fsManager.readFile(filePath)
  } catch (error) {
    console.error('Read file error:', error)
    throw error
  }
})

ipcMain.handle('fs:write-file', async (_, filePath: string, data: string) => {
  try {
    await fsManager.writeFile(filePath, data)
    return true
  } catch (error) {
    console.error('Write file error:', error)
    throw error
  }
})

ipcMain.handle('fs:delete-file', async (_, filePath: string) => {
  try {
    await fsManager.deleteFile(filePath)
    return true
  } catch (error) {
    console.error('Delete file error:', error)
    throw error
  }
})

ipcMain.handle('fs:list-directory', async (_, dirPath: string) => {
  try {
    return await fsManager.listDirectory(dirPath)
  } catch (error) {
    console.error('List directory error:', error)
    throw error
  }
})

ipcMain.handle('fs:create-directory', async (_, dirPath: string) => {
  try {
    await fsManager.createDirectory(dirPath)
    return true
  } catch (error) {
    console.error('Create directory error:', error)
    throw error
  }
})

ipcMain.handle('fs:exists', async (_, filePath: string) => {
  try {
    return await fsManager.exists(filePath)
  } catch (error) {
    console.error('Check exists error:', error)
    return false
  }
})

ipcMain.handle('fs:get-stats', async (_, filePath: string) => {
  try {
    return await fsManager.getStats(filePath)
  } catch (error) {
    console.error('Get stats error:', error)
    throw error
  }
})

ipcMain.handle(
  'fs:upload-file',
  async (_, localPath: string, remotePath: string, connectionId: string) => {
    try {
      await fsManager.uploadFile(localPath, remotePath, connectionId)
      return true
    } catch (error) {
      console.error('Upload file error:', error)
      throw error
    }
  }
)

ipcMain.handle(
  'fs:download-file',
  async (_, remotePath: string, localPath: string, connectionId: string) => {
    try {
      await fsManager.downloadFile(remotePath, localPath, connectionId)
      return true
    } catch (error) {
      console.error('Download file error:', error)
      throw error
    }
  }
)

ipcMain.handle('fs:show-open-dialog', async (_, options: any) => {
  try {
    return await fsManager.showOpenDialog(options)
  } catch (error) {
    console.error('Show open dialog error:', error)
    throw error
  }
})

ipcMain.handle('fs:show-save-dialog', async (_, options: any) => {
  try {
    return await fsManager.showSaveDialog(options)
  } catch (error) {
    console.error('Show save dialog error:', error)
    throw error
  }
})

ipcMain.handle('fs:open-path', async (_, targetPath: string) => {
  try {
    return await fsManager.openPath(targetPath)
  } catch (error) {
    console.error('Open path error:', error)
    throw error
  }
})

// 新增的文件系统方法别名（为部署工具添加）
ipcMain.handle('fs:readFile', async (_, filePath: string) => {
  try {
    return await fsManager.readFile(filePath)
  } catch (error) {
    console.error('Read file error:', error)
    throw error
  }
})

ipcMain.handle('fs:writeFile', async (_, filePath: string, content: string) => {
  try {
    return await fsManager.writeFile(filePath, content)
  } catch (error) {
    console.error('Write file error:', error)
    throw error
  }
})

ipcMain.handle('fs:stat', async (_, filePath: string) => {
  try {
    return await fsManager.getStats(filePath)
  } catch (error) {
    console.error('Get stats error:', error)
    throw error
  }
})

ipcMain.handle('fs:readdir', async (_, dirPath: string) => {
  try {
    return await fsManager.listDirectory(dirPath)
  } catch (error) {
    console.error('List directory error:', error)
    throw error
  }
})

ipcMain.handle('fs:mkdir', async (_, dirPath: string) => {
  try {
    return await fsManager.createDirectory(dirPath)
  } catch (error) {
    console.error('Create directory error:', error)
    throw error
  }
})

ipcMain.handle('fs:unlink', async (_, filePath: string) => {
  try {
    return await fsManager.deleteFile(filePath)
  } catch (error) {
    console.error('Delete file error:', error)
    throw error
  }
})

ipcMain.handle('fs:rename', async (_, oldPath: string, newPath: string) => {
  try {
    return await fsManager.renameFile(oldPath, newPath)
  } catch (error) {
    console.error('Rename file error:', error)
    throw error
  }
})

ipcMain.handle('fs:copyFile', async (_, src: string, dest: string) => {
  try {
    return await fsManager.copyFile(src, dest)
  } catch (error) {
    console.error('Copy file error:', error)
    throw error
  }
})

ipcMain.handle('fs:showOpenDialog', async (_, options: any) => {
  try {
    return await fsManager.showOpenDialog(options)
  } catch (error) {
    console.error('Show open dialog error:', error)
    throw error
  }
})

ipcMain.handle('fs:showSaveDialog', async (_, options: any) => {
  try {
    return await fsManager.showSaveDialog(options)
  } catch (error) {
    console.error('Show save dialog error:', error)
    throw error
  }
})

ipcMain.handle(
  'fs:create-archive',
  async (_, baseDir: string, files: string[], outputPath: string) => {
    try {
      return await fsManager.createArchive(baseDir, files, outputPath)
    } catch (error) {
      console.error('Create archive error:', error)
      throw error
    }
  }
)

ipcMain.handle('fs:mkdirRecursive', async (_, dirPath: string) => {
  try {
    await fsManager.mkdirRecursive(dirPath)
  } catch (error) {
    console.error('mkdirRecursive error:', error)
    throw error
  }
})

ipcMain.handle('fs:appendFile', async (_, filePath: string, data: string) => {
  try {
    await fsManager.appendFile(filePath, data)
  } catch (error) {
    console.error('appendFile error:', error)
    throw error
  }
})

export { fsManager }
