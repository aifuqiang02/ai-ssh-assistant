import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

export const registerUpdater = (targetWindow) => {
  // Status
  const status = {
    error: -1,
    available: 1,
    noAvailable: 2,
    downloading: 3,
    downloaded: 4
  }

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  /**
   * Check for updates (connect to GitHub Releases)
   */
  ipcMain.handle('update:checkUpdate', async () => {
    return await autoUpdater.checkForUpdates()
  })

  /**
   * Download update
   */
  ipcMain.handle('update:download', async () => {
    return await autoUpdater.downloadUpdate()
  })

  ipcMain.handle('update:quitAndInstall', async () => {
    return autoUpdater.quitAndInstall()
  })

  // Listen for various autoUpdater events
  autoUpdater.on('checking-for-update', () => {})

  autoUpdater.on('update-available', () => {
    sendStatusToWindow({
      type: 'update-available',
      status: status.available,
      desc: 'Available'
    })
  })

  autoUpdater.on('update-not-available', () => {
    sendStatusToWindow({
      type: 'update-not-available',
      status: status.noAvailable,
      desc: 'No-Available'
    })
  })

  autoUpdater.on('error', (err) => {
    sendStatusToWindow({
      type: 'error',
      status: status.error,
      desc: err
    })
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const percentNumber = Math.ceil(progressObj.percent)
    const totalSize = bytesChange(progressObj.total)
    const transferredSize = bytesChange(progressObj.transferred)
    let text = `${percentNumber}% (${transferredSize}/${totalSize})`
    console.log(text)
    sendStatusToWindow({
      type: 'download-progress',
      status: status.downloading,
      desc: text,
      progress: percentNumber,
      percentNumber,
      totalSize,
      transferredSize
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow({
      ...info,
      status: status.downloaded,
      desc: 'Downloaded'
    })
  })

  function sendStatusToWindow(content = {}) {
    const channel = 'update:autoUpdate'
    if (targetWindow) {
      targetWindow.webContents.send(channel, content)
    }
  }

  function bytesChange(limit) {
    let size = ''
    if (limit < 1024) {
      size = limit.toFixed(2) + 'B'
    } else if (limit < 1024 * 1024) {
      size = (limit / 1024).toFixed(2) + 'KB'
    } else if (limit < 1024 * 1024 * 1024) {
      size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    const index = size.indexOf('.')
    const dou = size.substring(index + 1, index + 3)
    if (dou === '00') {
      return size.substring(0, index)
    }

    return size
  }
}
