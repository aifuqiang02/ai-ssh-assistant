// Electron API 类型定义
interface ElectronAPI {
  // 应用控制
  minimizeWindow: () => Promise<any>
  maximizeWindow: () => Promise<any>
  closeWindow: () => Promise<any>
  toggleFullscreen: () => Promise<any>
  quit: () => Promise<any>

  // 应用信息
  getVersion: () => Promise<string>
  getPath: (name: string) => Promise<string>
  updater: {
    getState: () => Promise<any>
    startBackgroundCheck: () => Promise<any>
    installDownloadedUpdate: () => Promise<boolean>
  }

  // 对话框
  showMessageBox: (options: any) => Promise<any>
  showErrorBox: (title: string, content: string) => Promise<void>

  // 开发者工具
  toggleDevTools: () => Promise<boolean>

  // API 相关
  api: {
    request: (
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      data?: any,
      headers?: Record<string, string>
    ) => Promise<any>
    auth: {
      login: (credentials: any) => Promise<any>
      register: (userData: any) => Promise<any>
      wechatLogin: (payload: any) => Promise<any>
      logout: (token?: string) => Promise<any>
      refresh: (refreshToken: string) => Promise<any>
      verify: (token: string) => Promise<any>
    }
    wechatRequest: (
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      data?: any,
      headers?: Record<string, string>,
      absoluteUrl?: string
    ) => Promise<any>
  }

  // SSH 相关
  ssh: {
    // 树形结构管理
    getTree: (userId: string) => Promise<any[]>
    exportConnections: (userId: string) => Promise<SSHConnectionExportResult>
    importConnections: (userId: string) => Promise<SSHConnectionImportDialogResult>
    createFolder: (userId: string, data: any) => Promise<any>
    updateFolder: (userId: string, folderId: string, data: any) => Promise<any>
    deleteFolder: (userId: string, folderId: string) => Promise<void>
    createConnection: (userId: string, data: any) => Promise<any>
    updateConnection: (userId: string, id: string, data: any) => Promise<any>
    deleteConnection: (userId: string, id: string) => Promise<void>
    moveNode: (userId: string, data: any) => Promise<void>

    // 运行时连接管理
    connect: (config: any) => Promise<any>
    disconnect: (id: string) => Promise<any>
    resize: (id: string, cols: number, rows: number) => Promise<any> // 调整终端尺寸
    execute: (id: string, command: string, requestId?: string) => Promise<any>
    cancelExecute: (requestId: string) => Promise<boolean>
    readEnvDoc: (id: string) => Promise<{ content: string; fullPath: string } | null>
    writeEnvDoc: (id: string, content: string) => Promise<{ content: string; fullPath: string }>
    executeSilent: (
      id: string,
      command: string
    ) => Promise<{ success: boolean; output?: string; error?: string }> // 静默执行（不在终端显示）
    getCurrentDirectory: (
      id: string
    ) => Promise<{ success: boolean; output?: string; error?: string }>
    write: (id: string, data: string) => Promise<void> // 直接写入终端输入
    getInitialOutput: (id: string) => Promise<string>
    getConnections: () => Promise<any>
    saveConnection: (config: any) => Promise<any>
    testConnection: (config: any) => Promise<{ success: boolean; message: string }>

    // SFTP 相关
    listFiles: (id: string, remotePath: string) => Promise<any>
    uploadFile: (id: string, localPath: string, remotePath: string) => Promise<any>
    downloadFile: (id: string, remotePath: string, localPath: string) => Promise<any>
    deleteFile: (
      id: string,
      remotePath: string,
      isDirectory: boolean,
      identity?: string
    ) => Promise<any>
    createDirectory: (id: string, remotePath: string) => Promise<any>
  }

  // AI 相关
  ai: {
    analyze: (data: any) => Promise<any>
    suggest: (command: string) => Promise<string[]>
    translate: (text: string, from: string, to: string) => Promise<string>
  }

  // 文件系统
  fs: {
    readFile: (path: string) => Promise<string>
    writeFile: (path: string, data: string) => Promise<boolean>
    deleteFile: (path: string) => Promise<boolean>
    readdir: (dirPath: string) => Promise<string[]>
    stat: (path: string) => Promise<{ isDirectory: boolean; size: number }>
    listDirectory: (path: string) => Promise<any[]>
    createDirectory: (path: string) => Promise<boolean>
    exists: (path: string) => Promise<boolean>
    getStats: (path: string) => Promise<any>
    getPathForFile: (file: File) => string
    uploadFile: (localPath: string, remotePath: string, connectionId: string) => Promise<boolean>
    downloadFile: (remotePath: string, localPath: string, connectionId: string) => Promise<boolean>

    // 文件对话框
    showOpenDialog: (options: any) => Promise<string[]>
    showSaveDialog: (options: any) => Promise<string | null>

    // 打开文件夹
    openPath: (targetPath: string) => Promise<string>
  }

  // 系统信息
  system: {
    getInfo: () => Promise<any>
    getMemoryUsage: () => Promise<any>
    getCpuUsage: () => Promise<any>
    getNetworkInfo: () => Promise<any>
    openExternal: (url: string) => Promise<void>
    getSystemInfo: () => Promise<any>
  }

  // 兼容性快捷方式
  getSystemInfo: () => Promise<any>

  // 通知系统
  notification: {
    show: (title: string, body: string, options?: any) => Promise<any>
    clear: (id: string) => Promise<any>
  }

  // 事件监听器
  on: (channel: string, callback: (...args: any[]) => void) => () => void
  once: (channel: string, callback: (...args: any[]) => void) => void

  // 特定事件监听器
  onWindowStateChange: (callback: (state: any) => void) => () => void
  onFullscreenChange: (callback: (isFullscreen: boolean) => void) => () => void
  onConnectionStatusChange: (callback: (status: any) => void) => () => void
  onTerminalOutput: (callback: (output: string) => void) => () => void
  onNotification: (callback: (notification: any) => void) => () => void
  onStatusUpdate: (callback: (status: any) => void) => () => void
  onUpdaterStateChange: (callback: (state: any) => void) => () => void
  onMenuAction: (action: string, callback: (...args: any[]) => void) => () => void

  // 设置相关 - 统一接口，StorageManager 自动处理模式
  settings: {
    get: (userId?: string) => Promise<any>
    save: (userId: string, settings: any) => Promise<{ success: boolean }>
    reset: (userId?: string) => Promise<{ success: boolean }>
    export: (userId: string, exportPath: string) => Promise<{ success: boolean }>
    import: (userId: string, importPath: string) => Promise<{ success: boolean; settings?: any }>
  }

  // 存储管理 - 动态模式切换
  storage: {
    switchToCloud: (userToken: string) => Promise<{ success: boolean; mode: string }>
    switchToLocal: () => Promise<{ success: boolean; mode: string }>
    getStatus: () => Promise<any>
    sync: () => Promise<any>
  }

  // 命令执行服务
  exec: {
    command: (command: string, options?: any) => Promise<any>
    script: (scriptPath: string, options?: any) => Promise<any>
    which: (command: string) => Promise<string | null>
    platform: () => Promise<string>
    onOutput: (callback: (data: any) => void) => void
    offOutput: (callback: (data: any) => void) => void
  }

  // Shell 操作
  shell: {
    showItemInFolder: (filePath: string) => Promise<void>
    openPath: (path: string) => Promise<string>
    openExternal: (url: string) => Promise<void>
  }

  // 文档存储（本地 markdown 文件）
  docStorage: {
    save: (category: string, filename: string, content: string) => Promise<any>
    read: (category: string, filename: string) => Promise<any>
    delete: (category: string, filename: string) => Promise<boolean>
    list: (category: string) => Promise<any[]>
    exists: (category: string, filename: string) => Promise<boolean>
    saveServerEnv: (connectionId: string, content: string) => Promise<any>
    readServerEnv: (connectionId: string) => Promise<any>
  }
}

interface SSHConnectionExportResult {
  canceled: boolean
  exported?: number
}

interface SSHConnectionImportDialogResult {
  canceled: boolean
  imported?: number
  skipped?: number
  invalid?: number
}

// 全局类型声明
declare global {
  interface Window {
    electronAPI: ElectronAPI
    api: ElectronAPI // 别名，方便使用
  }

  // 声明全局 electronAPI
  var electronAPI: ElectronAPI
  var api: ElectronAPI // 别名
}

// 导出类型供其他文件使用
export { ElectronAPI }
