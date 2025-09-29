import { app, BrowserWindow, shell, ipcMain, Menu, dialog, globalShortcut } from 'electron'
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

      // 动态导入 IPC 处理器
      try {
        await import('../ipc/ssh-handlers')
        await import('../ipc/ai-handlers')
        await import('../ipc/file-handlers')
        await import('../ipc/system-handlers')
      } catch (error) {
        console.warn('Warning: Could not load some IPC handlers:', error)
      }
    })

    // 安全设置
    app.on('web-contents-created', (_, contents) => {
      // 阻止导航到外部URL
      contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl)
        
        if (parsedUrl.origin !== 'http://localhost:5173' && parsedUrl.origin !== 'file://') {
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
      width: 1750,
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
        webSecurity: true,
        allowRunningInsecureContent: false
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
    this.mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12' && input.type === 'keyDown') {
        console.log('F12 detected via before-input-event')
        const webContents = this.mainWindow!.webContents
        const isOpened = webContents.isDevToolsOpened()
        console.log('DevTools currently opened:', isOpened)
        
        if (isOpened) {
          console.log('Closing DevTools via local handler...')
          webContents.closeDevTools()
        } else {
          console.log('Opening DevTools via local handler...')
          webContents.openDevTools()
        }
        
        // 防止默认行为
        event.preventDefault()
      }
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

  private createMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: '文件',
        submenu: [
          {
            label: '新建连接',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow?.webContents.send('menu:new-connection')
            }
          },
          {
            label: '导入连接',
            accelerator: 'CmdOrCtrl+I',
            click: async () => {
              const result = await dialog.showOpenDialog(this.mainWindow!, {
                title: '导入连接配置',
                filters: [
                  { name: 'JSON 文件', extensions: ['json'] },
                  { name: '所有文件', extensions: ['*'] }
                ],
                properties: ['openFile']
              })
              
              if (!result.canceled && result.filePaths.length > 0) {
                this.mainWindow?.webContents.send('menu:import-connections', result.filePaths[0])
              }
            }
          },
          {
            label: '导出连接',
            accelerator: 'CmdOrCtrl+E',
            click: async () => {
              const result = await dialog.showSaveDialog(this.mainWindow!, {
                title: '导出连接配置',
                defaultPath: 'ssh-connections.json',
                filters: [
                  { name: 'JSON 文件', extensions: ['json'] }
                ]
              })
              
              if (!result.canceled && result.filePath) {
                this.mainWindow?.webContents.send('menu:export-connections', result.filePath)
              }
            }
          },
          { type: 'separator' },
          process.platform === 'darwin' ? 
            { role: 'close' } : 
            { role: 'quit' }
        ]
      },
      {
        label: '编辑',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: '偏好设置',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              this.mainWindow?.webContents.send('menu:open-settings')
            }
          }
        ]
      },
      {
        label: '视图',
        submenu: [
          {
            label: '切换侧边栏',
            accelerator: 'CmdOrCtrl+B',
            click: () => {
              this.mainWindow?.webContents.send('menu:toggle-sidebar')
            }
          },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: '窗口',
        submenu: [
          { role: 'minimize' },
          { role: 'close' },
          ...(process.platform === 'darwin' ? [
            { type: 'separator' as const },
            { role: 'front' as const }
          ] : [])
        ]
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '关于 AI SSH Assistant',
            click: () => {
              this.mainWindow?.webContents.send('menu:show-about')
            }
          },
          {
            label: '检查更新',
            click: () => {
              this.mainWindow?.webContents.send('menu:check-updates')
            }
          },
          { type: 'separator' },
          {
            label: '用户手册',
            click: () => {
              shell.openExternal('https://github.com/ai-ssh-assistant/docs')
            }
          },
          {
            label: '反馈问题',
            click: () => {
              shell.openExternal('https://github.com/ai-ssh-assistant/issues')
            }
          }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
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
