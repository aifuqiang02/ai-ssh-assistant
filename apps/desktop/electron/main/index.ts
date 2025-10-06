import { app, BrowserWindow, shell, ipcMain, dialog, globalShortcut, session } from 'electron'
import { join } from 'path'
import { windowEvents } from '../shared/events'

// IPC 处理器将在运行时动态加载

class Application {
  private mainWindow: BrowserWindow | null = null
  private isDev = !app.isPackaged || process.env.NODE_ENV === 'development'

  constructor() {
    this.initialize()
  }

  private initialize() {
    // 设置应用程序用户模型ID (Windows)
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.ai-ssh-assistant.desktop')
    }

    // 配置 CSP 允许连接到 AI API
    app.on('ready', () => {
      session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Content-Security-Policy': [
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "font-src 'self' data:; " +
              "connect-src 'self' http://127.0.0.1:3000 http://localhost:3000 ws://127.0.0.1:3000 ws://localhost:3000 https://*; " +
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
      // this.createMenu()  // 注释掉菜单创建
      
      // 注册F12快捷键控制调试窗口
      this.registerShortcuts()
      
      // 注册开发者工具切换IPC处理器
      this.setupDevToolsIPC()

      // 初始化存储管理器
      let storageManager = null
      
      try {
        console.log('[Main] 开始初始化 StorageManager...')
        const { StorageManager } = await import('@repo/database')
        
        // 从环境变量或配置文件读取存储模式
        const storageMode = process.env.STORAGE_MODE || 'local'
        
        const storageConfig: any = {
          mode: storageMode as any,
          localOptions: {
            enabled: true
          }
        }
        
        // 如果是云存储或混合模式，添加云配置
        if (storageMode === 'cloud' || storageMode === 'hybrid') {
          storageConfig.cloudOptions = {
            enabled: true,
            endpoint: process.env.CLOUD_STORAGE_ENDPOINT,
            apiKey: process.env.CLOUD_STORAGE_API_KEY
          }
        }
        
        console.log('[Main] StorageManager 配置:', { mode: storageMode })
        
        storageManager = new StorageManager(storageConfig)
        await storageManager.connect()
        
        console.log('[Main] ✅ StorageManager 初始化成功，模式:', storageMode)
      } catch (storageError) {
        console.warn('[Main] ⚠️  StorageManager 初始化失败，将使用文件存储作为后备:', storageError)
        storageManager = null
      }
      
      // 注册 Settings 处理器（无论数据库是否成功都注册）
      try {
        console.log('[Main] 注册 Settings IPC 处理器...')
        const settingsModule = await import('../ipc/settings-handlers')
        
        settingsModule.registerSettingsHandlers(storageManager)
        console.log('[Main] ✅ Settings handlers registered successfully!', storageManager ? '(使用数据库)' : '(使用文件)')
      } catch (settingsError) {
        console.error('[Main] ❌ CRITICAL: Failed to register Settings handlers:', settingsError)
      }
      
      // 动态导入其他 IPC 处理器
      try {
        await import('../ipc/api-handlers')
        await import('../ipc/ssh-handlers')
        await import('../ipc/ai-handlers')
        await import('../ipc/file-handlers')
        await import('../ipc/system-handlers')
        console.log('[Main] ✅ All other IPC handlers registered')
      } catch (error) {
        console.error('[Main] ❌ Failed to load some IPC handlers:', error)
      }
    })

    // 安全设置
    app.on('web-contents-created', (_, contents) => {
      // 阻止导航到外部URL (但允许API调用)
      contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)
        
        // 允许开发服务器、本地文件和API服务器
        const allowedOrigins = [
          'http://localhost:5173',  // Vite开发服务器
          'http://localhost:3000',  // API服务器
          'http://127.0.0.1:3000',  // API服务器 (IPv4)
          'file://'                 // 本地文件
        ]
        
        const isAllowed = allowedOrigins.some(origin => 
          parsedUrl.origin === origin || parsedUrl.protocol === 'file:'
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
      frame: false,  // 完全隐藏标题栏和窗口边框
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
    this.mainWindow.webContents.setWindowOpenHandler((details) => {
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

// IPC 事件处理
ipcMain.handle('app:get-version', () => {
  return app.getVersion()
})

ipcMain.handle('app:get-path', (_, name: string) => {
  return app.getPath(name as any)
})

ipcMain.handle('app:show-message-box', async (_, options) => {
  const result = await dialog.showMessageBox(options)
  return result
})

ipcMain.handle('app:show-error-box', (_, title: string, content: string) => {
  dialog.showErrorBox(title, content)
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
