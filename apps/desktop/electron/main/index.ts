import { app, BrowserWindow, shell, ipcMain, dialog, globalShortcut, session } from 'electron'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, normalize } from 'path'
import { windowEvents } from '../shared/events'
import { StorageManager } from '@ai-ssh/database'
import { initializeStorageManager } from './storage'
import { UpdateService, buildManifestUrls } from '../services/update-service'
import { getApiOriginByMode } from '../../src/config/api-environment'

// ✅ 静态导入所有 IPC 处理器（Electron 打包兼容）
import '../ipc/api-handlers'
import '../ipc/ssh-handlers'
import '../ipc/ai-handlers'
import '../ipc/file-handlers'
import '../ipc/system-handlers'
import '../ipc/settings-handlers'

import { registerExecHandlers } from '../ipc/exec-handlers'
import { registerShellHandlers } from '../ipc/shell-handlers'
import { registerDocStorageHandlers } from '../ipc/doc-storage-handlers'

// 注册处理器
registerExecHandlers()
registerShellHandlers()
registerDocStorageHandlers()

class Application {
  private mainWindow: BrowserWindow | null = null
  private forceProdRenderer = process.env.ELECTRON_FORCE_PROD_RENDERER === '1'
  private isDev =
    (!app.isPackaged && !this.forceProdRenderer) || process.env.NODE_ENV === 'development'

  constructor() {
    this.initialize()
  }

  private initialize() {
    // 设置应用程序用户模型ID (Windows)
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.ai-ssh-assistant.desktop')
    }

    // 配置 CSP 允许连接到 AI API 和 Markdown 编辑器资源
    app.on('ready', () => {
      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
              "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; " +
                "style-src 'self' 'unsafe-inline' https://unpkg.com; " +
                "img-src 'self' data: https: http://110.42.111.221:45345; " +
                "font-src 'self' data: https://unpkg.com; " +
                "connect-src 'self' http: https: ws: wss:; " +
                "media-src 'self'"
            ]
          }
        })
      })
    })

    // 当所有窗口关闭时退出应用 (macOS 除外)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    // 应用即将退出时取消注册快捷键
    app.on('will-quit', () => {
      globalShortcut.unregisterAll()
    })

    app.on('activate', () => {
      // macOS 上，当点击 dock 图标且没有其他窗口打开时，重新创建窗口
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })

    // 应用准备就绪时创建窗口
    app.whenReady().then(async () => {
      this.createWindow()

      // 注册F12快捷键控制调试窗口
      this.registerShortcuts()

      // 注册开发者工具切换IPC处理器
      this.setupDevToolsIPC()

      // 初始化 StorageManager 并注册 Settings IPC 处理器
      try {
        console.log('[Main] 初始化 StorageManager...')
        // ✅ 使用用户数据目录存储数据库文件，避免重装应用时数据丢失
        const userDataPath = app.getPath('userData')
        const dbPath = join(userDataPath, 'local.db')
        console.log('[Main] 数据库路径:', dbPath)

        // ✅ 默认使用本地模式，登录后会动态切换到云端/混合模式
        const storageConfig = {
          mode: 'local' as const,
          localOptions: {
            connectionString: `file:${dbPath}`,
            enabled: true
          }
        }

        const storageManager = new StorageManager(storageConfig)
        await storageManager.connect()
        console.log('[Main] ✅ StorageManager initialized in local mode')

        // 初始化共享的 StorageManager 实例
        // ✅ IPC handlers 会通过 getStorageManager() 自动获取
        initializeStorageManager(storageManager)
        console.log('[Main] ✅ Shared StorageManager initialized')

        console.log('[Main] ✅ All IPC handlers registered (static)')

        // ✅ 注册存储模式切换处理器

        // 切换到云端/混合模式（登录时调用）
        ipcMain.handle('storage:switch-to-cloud', async (_, userToken: string) => {
          try {
            console.log('[Main] Switching to hybrid storage mode with token')

            // ✅ 重新创建 StorageManager 使用云端配置
            const hybridConfig = {
              mode: 'hybrid' as const,
              cloudOptions: {
                provider: 'postgresql' as const,
                connectionString: process.env.DATABASE_URL || '',
                userToken: userToken,
                enabled: true
              },
              hybridOptions: {
                primaryStorage: 'cloud' as const,
                fallbackEnabled: true,
                offlineMode: true,
                syncStrategy: 'realtime' as const
              }
            }

            await storageManager.disconnect()
            const newStorageManager = new StorageManager(hybridConfig)
            await newStorageManager.connect()

            // 更新引用
            Object.assign(storageManager, newStorageManager)

            // 触发同步
            const syncResult = await storageManager.sync()
            console.log('[Main] ✅ Switched to hybrid mode, sync result:', syncResult)
            return { success: true, mode: 'hybrid' }
          } catch (error) {
            console.error('[Main] Failed to switch to cloud mode:', error)
            throw error
          }
        })

        // 切换到本地模式（登出时调用）
        ipcMain.handle('storage:switch-to-local', async () => {
          try {
            console.log('[Main] Switching to local storage mode')
            await storageManager.switchMode('local')

            console.log('[Main] ✅ Switched to local mode')
            return { success: true, mode: 'local' }
          } catch (error) {
            console.error('[Main] Failed to switch to local mode:', error)
            throw error
          }
        })

        // 获取当前存储状态
        ipcMain.handle('storage:get-status', async () => {
          try {
            const status = await storageManager.getStatus()
            return status
          } catch (error) {
            console.error('[Main] Failed to get storage status:', error)
            throw error
          }
        })

        // 手动触发同步
        ipcMain.handle('storage:sync', async () => {
          try {
            console.log('[Main] Manual sync triggered')
            const result = await storageManager.sync()
            console.log('[Main] Sync result:', result)
            return result
          } catch (error) {
            console.error('[Main] Sync failed:', error)
            throw error
          }
        })
      } catch (settingsError) {
        console.error('[Main] ❌ CRITICAL: Failed to initialize StorageManager:', settingsError)
        throw settingsError // 不再降级，必须有 StorageManager
      }

      // IPC 处理器已通过静态导入自动注册
      console.log('[Main] ✅ All IPC handlers registered')
    })

    // 安全设置
    app.on('web-contents-created', (_, contents) => {
      // 阻止导航到外部URL (但允许API调用)
      contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)

        // 允许开发服务器、本地文件和API服务器
        const allowedOrigins = [
          'http://localhost:5173', // Vite开发服务器
          getApiOriginByMode(true), // 生产 API 服务器
          'http://localhost:3000', // 本地 API 服务器
          getApiOriginByMode(false), // 本地 API 服务器 (IPv4)
          'file://' // 本地文件
        ]

        const isAllowed = allowedOrigins.some(
          origin => parsedUrl.origin === origin || parsedUrl.protocol === 'file:'
        )

        if (!isAllowed) {
          event.preventDefault()
          shell.openExternal(navigationUrl)
        }
      })

      // 阻止新窗口创建
      contents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
      })
    })
  }

  private createWindow(): void {
    // 创建浏览器窗口
    this.mainWindow = new BrowserWindow({
      width: 1450,
      height: 900,
      minWidth: 800,
      minHeight: 600,
      show: false,
      autoHideMenuBar: true,
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      frame: false, // 完全隐藏标题栏和窗口边框
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: this.isDev ? false : true, // 开发模式下禁用webSecurity以允许API调用
        allowRunningInsecureContent: this.isDev ? true : false
      }
    })

    // 窗口事件处理
    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()

      // 设置主窗口到事件发射器
      if (this.mainWindow) {
        windowEvents.setMainWindow(this.mainWindow)
      }

      // 调试窗口默认不显示，使用F12控制
      // if (this.isDev) {
      //   this.mainWindow?.webContents.openDevTools()
      // }

      // 添加本地键盘监听作为备用方案
      this.setupKeyboardHandlers()
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })

    // 加载应用
    if (this.isDev) {
      // 确保 Vite 开发服务器启动后再加载
      const url = process.env['ELECTRON_RENDERER_URL'] || 'http://localhost:5173'
      console.log('Loading renderer from:', url)
      this.mainWindow.loadURL(url)
    } else {
      // 生产环境加载构建后的文件
      // 在打包后的应用中，文件位于app.asar中的dist目录
      const htmlPath = join(__dirname, '../../dist/index.html')
      console.log('Loading renderer from:', htmlPath)
      this.mainWindow.loadFile(htmlPath)
    }

    // 处理外部链接
    this.mainWindow.webContents.setWindowOpenHandler(details => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
  }

  private registerShortcuts(): void {
    // 注册F12快捷键切换调试窗口
    const ret = globalShortcut.register('F12', () => {
      console.log('F12 pressed!')
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        const webContents = this.mainWindow.webContents
        console.log('DevTools opened:', webContents.isDevToolsOpened())
        if (webContents.isDevToolsOpened()) {
          console.log('Closing DevTools...')
          webContents.closeDevTools()
        } else {
          console.log('Opening DevTools...')
          webContents.openDevTools()
        }
      } else {
        console.log('Main window not available')
      }
    })

    if (!ret) {
      console.log('Failed to register F12 shortcut')
    } else {
      console.log('F12 shortcut registered successfully')
    }

    // 验证快捷键是否注册成功
    console.log('Is F12 registered:', globalShortcut.isRegistered('F12'))
  }

  private setupKeyboardHandlers(): void {
    if (!this.mainWindow) return

    // 监听来自渲染进程的键盘事件
    // 注意：F12 快捷键已在 registerShortcuts() 中通过 globalShortcut 注册
    // 这里不再重复处理 F12，避免冲突
    this.mainWindow.webContents.on('before-input-event', (event, input) => {
      // F12 由 globalShortcut 处理，这里跳过
      if (input.key === 'F12') {
        return // 不处理，让 globalShortcut 处理
      }

      // 这里可以处理其他键盘快捷键
      // 例如: Ctrl+Shift+I, Ctrl+R 等
    })

    // 添加调试窗口状态监听
    this.mainWindow.webContents.on('devtools-opened', () => {
      console.log('DevTools opened event fired')
    })

    this.mainWindow.webContents.on('devtools-closed', () => {
      console.log('DevTools closed event fired')
    })
  }

  private setupDevToolsIPC(): void {
    // 处理来自渲染进程的开发者工具切换请求
    ipcMain.handle('devtools:toggle', () => {
      console.log('DevTools toggle requested via IPC')
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        const webContents = this.mainWindow.webContents
        const isOpened = webContents.isDevToolsOpened()
        console.log('DevTools currently opened (IPC):', isOpened)

        if (isOpened) {
          console.log('Closing DevTools via IPC...')
          webContents.closeDevTools()
          return false
        } else {
          console.log('Opening DevTools via IPC...')
          webContents.openDevTools()
          return true
        }
      }
      return false
    })
  }

  // 获取主窗口实例
  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }
}

// 创建应用实例
const application = new Application()
let updateService: UpdateService | null = null

function getManifestUrls(platform: NodeJS.Platform, arch: string) {
  return buildManifestUrls({
    githubOwner: 'aifuqiang02',
    githubRepo: 'ai-ssh-assistant',
    platform,
    arch
  })
}

app.whenReady().then(() => {
  updateService = new UpdateService({
    currentVersion: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    manifestUrls: getManifestUrls(process.platform, process.arch),
    fetch: globalThis.fetch,
    getUserDataPath: () => join(app.getPath('userData'), 'updates'),
    fileStore: {
      mkdir: async dirPath => {
        await mkdir(dirPath, { recursive: true })
      },
      exists: async filePath => {
        try {
          await access(filePath)
          return true
        } catch {
          return false
        }
      },
      readFile: async filePath => readFile(filePath),
      writeFile: async (filePath, data) => {
        await writeFile(filePath, data)
      }
    },
    openPath: async filePath => shell.openPath(filePath),
    launchInstaller: async filePath => {
      const child = spawn(filePath, [], {
        detached: true,
        stdio: 'ignore'
      })
      child.unref()
      setTimeout(() => app.quit(), 500)
    },
    emitState: state => {
      windowEvents.sendToRenderer('updater:state-changed', state)
    },
    logger: {
      info: (message, data) => {
        console.info('[Updater]', message, data || {})
      },
      warn: (message, data) => {
        console.warn('[Updater]', message, data || {})
      },
      error: (message, data) => {
        console.error('[Updater]', message, data || {})
      }
    }
  })

  void updateService.startBackgroundCheck()
})

// IPC 事件处理
ipcMain.handle('app:get-version', () => {
  return app.getVersion()
})

ipcMain.handle('app:get-path', (_, name: string) => {
  const rawPath = app.getPath(name as any)
  // 规范化路径，确保在 Windows 上使用正确的路径分隔符
  return normalize(rawPath)
})

ipcMain.handle('app:show-message-box', async (_, options) => {
  const result = await dialog.showMessageBox(options)
  return result
})

ipcMain.handle('app:show-error-box', (_, title: string, content: string) => {
  dialog.showErrorBox(title, content)
})

ipcMain.handle('updater:get-state', () => {
  return updateService?.getState() || { status: 'idle', currentVersion: app.getVersion() }
})

ipcMain.handle('updater:start-background-check', async () => {
  if (!updateService) {
    throw new Error('Update service not initialized')
  }

  return updateService.startBackgroundCheck()
})

ipcMain.handle('updater:install-downloaded-update', async () => {
  if (!updateService) {
    throw new Error('Update service not initialized')
  }

  await updateService.installDownloadedUpdate()
  return true
})

ipcMain.handle('app:quit', () => {
  app.quit()
})

// 全屏切换
ipcMain.handle('app:toggle-fullscreen', () => {
  const window = application.getMainWindow()
  if (window) {
    window.setFullScreen(!window.isFullScreen())
    return window.isFullScreen()
  }
  return false
})

// 窗口控制
ipcMain.handle('app:minimize', () => {
  application.getMainWindow()?.minimize()
})

ipcMain.handle('app:maximize', () => {
  const window = application.getMainWindow()
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
    return window.isMaximized()
  }
  return false
})

ipcMain.handle('app:close', () => {
  application.getMainWindow()?.close()
})
