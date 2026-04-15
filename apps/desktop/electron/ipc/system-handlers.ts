import { ipcMain, shell, Notification } from 'electron'
import os from 'os'
import { windowEvents } from '../shared/events'

// 系统信息管理器
class SystemManager {
  getSystemInfo() {
    return {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      hostname: os.hostname(),
      uptime: os.uptime(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      nodeVersion: process.version,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome
    }
  }

  getMemoryUsage() {
    const processMemory = process.memoryUsage()
    const systemMemory = {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem()
    }

    return {
      system: {
        total: Math.round(systemMemory.total / 1024 / 1024), // MB
        free: Math.round(systemMemory.free / 1024 / 1024),   // MB
        used: Math.round(systemMemory.used / 1024 / 1024),   // MB
        percentage: Math.round((systemMemory.used / systemMemory.total) * 100)
      },
      process: {
        rss: Math.round(processMemory.rss / 1024 / 1024),               // MB
        heapTotal: Math.round(processMemory.heapTotal / 1024 / 1024),   // MB
        heapUsed: Math.round(processMemory.heapUsed / 1024 / 1024),     // MB
        external: Math.round(processMemory.external / 1024 / 1024)      // MB
      }
    }
  }

  getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
      const startMeasure = process.cpuUsage()
      
      setTimeout(() => {
        const endMeasure = process.cpuUsage(startMeasure)
        const totalUsage = endMeasure.user + endMeasure.system
        const percentage = (totalUsage / 1000000) * 100 // 转换为百分比
        resolve(Math.min(100, Math.max(0, percentage)))
      }, 100)
    })
  }

  getNetworkInfo() {
    const interfaces = os.networkInterfaces()
    const result: any[] = []

    Object.keys(interfaces).forEach(name => {
      const nets = interfaces[name]
      if (nets) {
        nets.forEach(net => {
          // 跳过内部地址
          if (!net.internal) {
            result.push({
              name,
              address: net.address,
              family: net.family,
              mac: net.mac,
              netmask: net.netmask
            })
          }
        })
      }
    })

    return result
  }

  async openExternal(url: string): Promise<void> {
    try {
      await shell.openExternal(url)
    } catch (error) {
      console.error('Failed to open external URL:', error)
      throw error
    }
  }

  showNotification(title: string, body: string, options: any = {}): string {
    try {
      if (!Notification.isSupported()) {
        throw new Error('Notifications are not supported on this system')
      }

      const notification = new Notification({
        title,
        body,
        icon: options.icon,
        silent: options.silent || false,
        urgency: options.urgency || 'normal'
      })

      const id = Date.now().toString()

      notification.on('click', () => {
        const mainWindow = windowEvents.getMainWindow()
        if (mainWindow) {
          if (mainWindow.isMinimized()) {
            mainWindow.restore()
          }
          mainWindow.focus()
          windowEvents.sendToRenderer('notification:clicked', { id, title, body })
        }
      })

      notification.on('close', () => {
        windowEvents.sendToRenderer('notification:closed', { id })
      })

      notification.show()
      return id
    } catch (error) {
      console.error('Show notification error:', error)
      throw error
    }
  }

  clearNotification(id: string): void {
    // 在 Electron 中，通知会自动管理，这里主要是为了 API 一致性
    console.log(`Notification ${id} cleared`)
  }

  getLoadAverage() {
    const loads = os.loadavg()
    return {
      load1: loads[0],
      load5: loads[1],
      load15: loads[2]
    }
  }

  getSystemUptime() {
    const uptime = os.uptime()
    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    return {
      total: uptime,
      formatted: `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`
    }
  }
}

// 创建系统管理器实例
const systemManager = new SystemManager()

// 注册 IPC 处理器
ipcMain.handle('system:get-info', () => {
  try {
    return systemManager.getSystemInfo()
  } catch (error) {
    console.error('Get system info error:', error)
    throw error
  }
})

ipcMain.handle('system:get-memory-usage', () => {
  try {
    return systemManager.getMemoryUsage()
  } catch (error) {
    console.error('Get memory usage error:', error)
    throw error
  }
})

ipcMain.handle('system:get-cpu-usage', async () => {
  try {
    return await systemManager.getCpuUsage()
  } catch (error) {
    console.error('Get CPU usage error:', error)
    throw error
  }
})

ipcMain.handle('system:get-network-info', () => {
  try {
    return systemManager.getNetworkInfo()
  } catch (error) {
    console.error('Get network info error:', error)
    throw error
  }
})

ipcMain.handle('system:open-external', async (_, url: string) => {
  try {
    await systemManager.openExternal(url)
    return true
  } catch (error) {
    console.error('Open external error:', error)
    throw error
  }
})

ipcMain.handle('notification:show', (_, title: string, body: string, options: any) => {
  try {
    return systemManager.showNotification(title, body, options)
  } catch (error) {
    console.error('Show notification error:', error)
    throw error
  }
})

ipcMain.handle('notification:clear', (_, id: string) => {
  try {
    systemManager.clearNotification(id)
    return true
  } catch (error) {
    console.error('Clear notification error:', error)
    throw error
  }
})

// 定期发送系统状态更新
setInterval(async () => {
  try {
    const memory = systemManager.getMemoryUsage()
    const cpu = await systemManager.getCpuUsage()
    const loadAvg = systemManager.getLoadAverage()
    
    windowEvents.sendToRenderer('status:update', {
      memory,
      cpu,
      loadAvg,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send system status update:', error)
  }
}, 5000) // 每5秒更新一次

export { systemManager }
