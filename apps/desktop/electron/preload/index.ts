import { contextBridge, ipcRenderer } from 'electron'

// 自定义 API 定义
const api = {
  // 应用控制
  minimizeWindow: () => ipcRenderer.invoke('app:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('app:maximize'),
  closeWindow: () => ipcRenderer.invoke('app:close'),
  toggleFullscreen: () => ipcRenderer.invoke('app:toggle-fullscreen'),
  quit: () => ipcRenderer.invoke('app:quit'),

  // 应用信息
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getPath: (name: string) => ipcRenderer.invoke('app:get-path', name),

  // 对话框
  showMessageBox: (options: any) => ipcRenderer.invoke('app:show-message-box', options),
  showErrorBox: (title: string, content: string) => ipcRenderer.invoke('app:show-error-box', title, content),

  // 开发者工具
  toggleDevTools: () => ipcRenderer.invoke('devtools:toggle'),

  // API 相关
  api: {
    // 通用API请求
    request: (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any, headers?: Record<string, string>) =>
      ipcRenderer.invoke('api:request', { endpoint, method, data, headers }),
    
    // 认证相关
    auth: {
      login: (credentials: { email: string; password: string; rememberMe?: boolean }) =>
        ipcRenderer.invoke('api:auth:login', credentials),
      register: (userData: { email: string; username: string; password: string }) =>
        ipcRenderer.invoke('api:auth:register', userData),
      logout: (token?: string) => ipcRenderer.invoke('api:auth:logout', token),
      refresh: (refreshToken: string) => ipcRenderer.invoke('api:auth:refresh', refreshToken),
      verify: (token: string) => ipcRenderer.invoke('api:auth:verify', token)
    }
  },

  // SSH 相关
  ssh: {
    connect: (config: any) => ipcRenderer.invoke('ssh:connect', config),
    disconnect: (id: string) => ipcRenderer.invoke('ssh:disconnect', id),
    execute: (id: string, command: string) => ipcRenderer.invoke('ssh:execute', id, command),
    getInitialOutput: (id: string) => ipcRenderer.invoke('ssh:get-initial-output', id),
    getConnections: () => ipcRenderer.invoke('ssh:get-connections'),
    saveConnection: (config: any) => ipcRenderer.invoke('ssh:save-connection', config),
    deleteConnection: (id: string) => ipcRenderer.invoke('ssh:delete-connection', id),
    testConnection: (config: any) => ipcRenderer.invoke('ssh:test-connection', config),
    
    // SFTP 相关
    listFiles: (id: string, remotePath: string) => ipcRenderer.invoke('ssh:list-files', id, remotePath),
    uploadFile: (id: string, localPath: string, remotePath: string) => ipcRenderer.invoke('ssh:upload-file', id, localPath, remotePath),
    downloadFile: (id: string, remotePath: string, localPath: string) => ipcRenderer.invoke('ssh:download-file', id, remotePath, localPath),
    deleteFile: (id: string, remotePath: string, isDirectory: boolean) => ipcRenderer.invoke('ssh:delete-file', id, remotePath, isDirectory),
    createDirectory: (id: string, remotePath: string) => ipcRenderer.invoke('ssh:create-directory', id, remotePath)
  },

  // AI 相关
  ai: {
    chat: (message: string, context?: any) => ipcRenderer.invoke('ai:chat', message, context),
    analyze: (data: any) => ipcRenderer.invoke('ai:analyze', data),
    suggest: (command: string) => ipcRenderer.invoke('ai:suggest', command),
    translate: (text: string, from: string, to: string) => ipcRenderer.invoke('ai:translate', text, from, to)
  },

  // 文件系统
  fs: {
    readFile: (path: string) => ipcRenderer.invoke('fs:read-file', path),
    writeFile: (path: string, data: string) => ipcRenderer.invoke('fs:write-file', path, data),
    deleteFile: (path: string) => ipcRenderer.invoke('fs:delete-file', path),
    listDirectory: (path: string) => ipcRenderer.invoke('fs:list-directory', path),
    createDirectory: (path: string) => ipcRenderer.invoke('fs:create-directory', path),
    exists: (path: string) => ipcRenderer.invoke('fs:exists', path),
    getStats: (path: string) => ipcRenderer.invoke('fs:get-stats', path),
    
    // 文件传输
    uploadFile: (localPath: string, remotePath: string, connectionId: string) => 
      ipcRenderer.invoke('fs:upload-file', localPath, remotePath, connectionId),
    downloadFile: (remotePath: string, localPath: string, connectionId: string) => 
      ipcRenderer.invoke('fs:download-file', remotePath, localPath, connectionId),
    
    // 文件对话框
    showOpenDialog: (options: any) => ipcRenderer.invoke('fs:show-open-dialog', options),
    showSaveDialog: (options: any) => ipcRenderer.invoke('fs:show-save-dialog', options),
    
    // 打开文件夹
    openPath: (targetPath: string) => ipcRenderer.invoke('fs:open-path', targetPath)
  },

  // 系统信息
  system: {
    getInfo: () => ipcRenderer.invoke('system:get-info'),
    getMemoryUsage: () => ipcRenderer.invoke('system:get-memory-usage'),
    getCpuUsage: () => ipcRenderer.invoke('system:get-cpu-usage'),
    getNetworkInfo: () => ipcRenderer.invoke('system:get-network-info'),
    openExternal: (url: string) => ipcRenderer.invoke('system:open-external', url),
    getSystemInfo: () => ipcRenderer.invoke('system:get-info')
  },

  // 兼容性快捷方式
  getSystemInfo: () => ipcRenderer.invoke('system:get-info'),

  // 通知系统
  notification: {
    show: (title: string, body: string, options?: any) => 
      ipcRenderer.invoke('notification:show', title, body, options),
    clear: (id: string) => ipcRenderer.invoke('notification:clear', id)
  },

  // 事件监听器
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args))
    return () => ipcRenderer.removeListener(channel, callback)
  },

  once: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (_, ...args) => callback(...args))
  },

  // 特定事件监听器
  onWindowStateChange: (callback: (state: any) => void) => {
    return api.on('window:state-changed', callback)
  },

  onFullscreenChange: (callback: (isFullscreen: boolean) => void) => {
    return api.on('window:fullscreen-changed', callback)
  },

  onConnectionStatusChange: (callback: (status: any) => void) => {
    return api.on('ssh:connection-status-changed', callback)
  },

  onTerminalOutput: (callback: (output: string) => void) => {
    return api.on('ssh:terminal-output', callback)
  },

  onNotification: (callback: (notification: any) => void) => {
    return api.on('notification:received', callback)
  },

  onStatusUpdate: (callback: (status: any) => void) => {
    return api.on('status:update', callback)
  },

  // 菜单事件监听器
  onMenuAction: (action: string, callback: (...args: any[]) => void) => {
    return api.on(`menu:${action}`, callback)
  }
}

// 类型定义
export type ElectronAPI = {
  // 应用控制
  minimizeWindow: () => Promise<any>
  maximizeWindow: () => Promise<any>
  closeWindow: () => Promise<any>
  toggleFullscreen: () => Promise<any>
  quit: () => Promise<any>
  
  // 应用信息
  getVersion: () => Promise<string>
  getPath: (name: string) => Promise<string>
  
  // 对话框
  showMessageBox: (options: any) => Promise<any>
  showErrorBox: (title: string, content: string) => Promise<void>
  
  // 开发者工具
  toggleDevTools: () => Promise<boolean>
  
  // API 相关
  api: {
    request: (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any, headers?: Record<string, string>) => Promise<any>
    auth: {
      login: (credentials: any) => Promise<any>
      register: (userData: any) => Promise<any>
      logout: (token?: string) => Promise<any>
      refresh: (refreshToken: string) => Promise<any>
      verify: (token: string) => Promise<any>
    }
  }
  
  // SSH 相关
  ssh: {
    connect: (config: any) => Promise<any>
    disconnect: (id: string) => Promise<any>
    execute: (id: string, command: string) => Promise<any>
    getInitialOutput: (id: string) => Promise<string>
    getConnections: () => Promise<any>
    saveConnection: (config: any) => Promise<any>
    deleteConnection: (id: string) => Promise<any>
    testConnection: (config: any) => Promise<any>
    
    // SFTP 相关
    listFiles: (id: string, remotePath: string) => Promise<any>
    uploadFile: (id: string, localPath: string, remotePath: string) => Promise<any>
    downloadFile: (id: string, remotePath: string, localPath: string) => Promise<any>
    deleteFile: (id: string, remotePath: string, isDirectory: boolean) => Promise<any>
    createDirectory: (id: string, remotePath: string) => Promise<any>
  }
  
  // AI 相关
  ai: {
    chat: (message: string, context?: any) => Promise<string>
    analyze: (data: any) => Promise<any>
    suggest: (command: string) => Promise<string[]>
    translate: (text: string, from: string, to: string) => Promise<string>
  }
  
  // 文件系统
  fs: {
    readFile: (path: string) => Promise<string>
    writeFile: (path: string, data: string) => Promise<boolean>
    deleteFile: (path: string) => Promise<boolean>
    listDirectory: (path: string) => Promise<any[]>
    createDirectory: (path: string) => Promise<boolean>
    exists: (path: string) => Promise<boolean>
    getStats: (path: string) => Promise<any>
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
  onMenuAction: (action: string, callback: (...args: any[]) => void) => () => void
}

// 通过 contextBridge 暴露 API
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api as unknown as ElectronAPI)
  } catch (error) {
    console.error('Failed to expose electron APIs:', error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electronAPI = api as unknown as ElectronAPI
}

// 全局类型声明
declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
