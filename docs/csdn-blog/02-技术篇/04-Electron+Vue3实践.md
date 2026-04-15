# Electron + Vue3 最佳实践：如何构建高性能桌面应用

> 深入讲解 Electron + Vue3 的开发实践，包括项目搭建、IPC 通信、性能优化、打包发布等。

## 前言

Electron 让 Web 开发者能够使用熟悉的技术栈开发跨平台桌面应用。结合 Vue 3 的强大功能，我们可以快速构建功能丰富、性能优秀的桌面应用。

本文将详细讲解 Electron + Vue3 的最佳实践，包括：
- 🏗️ 项目搭建
- 🔄 IPC 通信
- ⚡ 性能优化
- 📦 打包发布
- 🔒 安全考虑

---

## Electron 基础

### 进程模型

Electron 采用多进程架构：

```
┌─────────────────────────────────────┐
│         主进程 (Main Process)        │
│  - 管理应用生命周期                  │
│  - 创建和管理窗口                    │
│  - 访问 Node.js API                 │
│  - 处理系统事件                      │
└─────────────────────────────────────┘
              │
              ├──────────────┬──────────────┐
              │              │              │
┌─────────────▼──────┐ ┌────▼────────┐ ┌──▼──────────┐
│ 渲染进程 1         │ │ 渲染进程 2   │ │ 渲染进程 3   │
│ (Renderer Process) │ │             │ │             │
│ - 运行 Web 页面    │ │ - 独立的     │ │ - 隔离的     │
│ - Vue 应用         │ │   Chromium  │ │   环境       │
│ - 受限的 Node.js   │ │   实例      │ │             │
└────────────────────┘ └─────────────┘ └─────────────┘
```

**主进程（Main Process）**：
- 每个应用只有一个
- 负责创建 BrowserWindow
- 可以访问所有 Node.js API
- 管理应用生命周期

**渲染进程（Renderer Process）**：
- 每个窗口一个进程
- 运行 Web 页面（Vue 应用）
- 默认不能访问 Node.js API
- 通过 IPC 与主进程通信

### IPC 通信

主进程和渲染进程通过 IPC（Inter-Process Communication）通信：

**渲染进程 → 主进程**：
```typescript
// 渲染进程
window.electronAPI.invoke('get-data', { id: 1 })

// 主进程
ipcMain.handle('get-data', async (event, args) => {
  return { data: 'result' }
})
```

**主进程 → 渲染进程**：
```typescript
// 主进程
mainWindow.webContents.send('update', { data: 'new data' })

// 渲染进程
window.electronAPI.on('update', (data) => {
  console.log(data)
})
```

### 安全考虑

**关键原则**：
1. ❌ 不要在渲染进程中启用 `nodeIntegration`
2. ✅ 启用 `contextIsolation`
3. ✅ 使用 `preload` 脚本
4. ✅ 验证所有输入
5. ✅ 使用 CSP（Content Security Policy）

---

## 项目搭建

### 技术栈

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "electron": "^28.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "electron-builder": "^24.9.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 项目结构

```
apps/desktop/
├── electron/              # Electron 主进程
│   ├── main.ts           # 主进程入口
│   ├── preload.ts        # 预加载脚本
│   └── ipc/              # IPC 处理器
│       ├── ssh-handlers.ts
│       ├── ai-handlers.ts
│       └── file-handlers.ts
│
├── src/                  # Vue 渲染进程
│   ├── App.vue
│   ├── main.ts
│   ├── router/
│   ├── stores/
│   ├── views/
│   └── components/
│
├── resources/            # 资源文件
│   ├── icon.png
│   └── icon.icns
│
├── electron.vite.config.ts  # Vite 配置
├── electron-builder.yml     # 打包配置
└── package.json
```

### Vite 配置

```typescript
// electron.vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  main: {
    // 主进程配置
    build: {
      outDir: 'dist-electron/main',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'electron/main.ts')
        }
      }
    }
  },
  preload: {
    // 预加载脚本配置
    build: {
      outDir: 'dist-electron/preload',
      rollupOptions: {
        input: {
          preload: resolve(__dirname, 'electron/preload.ts')
        }
      }
    }
  },
  renderer: {
    // 渲染进程配置
    root: '.',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        }
      }
    }
  }
})
```

### 主进程实现

```typescript
// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      contextIsolation: true,      // 启用上下文隔离
      nodeIntegration: false,       // 禁用 Node 集成
      sandbox: false                // 允许 preload 访问 Node.js
    },
    // 窗口样式
    frame: true,
    titleBarStyle: 'default',
    backgroundColor: '#1e1e1e',
    show: false  // 先不显示，等加载完成
  })

  // 加载应用
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 窗口加载完成后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // 窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 应用准备就绪
app.whenReady().then(() => {
  createWindow()

  // macOS 特殊处理
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 所有窗口关闭
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 注册 IPC 处理器
import './ipc/ssh-handlers'
import './ipc/ai-handlers'
import './ipc/file-handlers'
```

### Preload 脚本

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // SSH 相关
  ssh: {
    connect: (config: any) => ipcRenderer.invoke('ssh:connect', config),
    disconnect: (id: string) => ipcRenderer.invoke('ssh:disconnect', id),
    execute: (id: string, command: string) => 
      ipcRenderer.invoke('ssh:execute', id, command),
    onData: (callback: (data: string) => void) => {
      ipcRenderer.on('ssh:data', (_, data) => callback(data))
    }
  },

  // AI 相关
  ai: {
    chat: (messages: any[]) => ipcRenderer.invoke('ai:chat', messages),
    chatStream: (messages: any[], callback: (chunk: string) => void) => {
      const channel = `ai:chat-stream:${Date.now()}`
      ipcRenderer.on(channel, (_, chunk) => callback(chunk))
      return ipcRenderer.invoke('ai:chat-stream', messages, channel)
    }
  },

  // 文件相关
  file: {
    select: () => ipcRenderer.invoke('file:select'),
    read: (path: string) => ipcRenderer.invoke('file:read', path),
    write: (path: string, content: string) => 
      ipcRenderer.invoke('file:write', path, content)
  },

  // 应用相关
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    quit: () => ipcRenderer.invoke('app:quit')
  }
})

// TypeScript 类型定义
export interface ElectronAPI {
  ssh: {
    connect: (config: any) => Promise<string>
    disconnect: (id: string) => Promise<void>
    execute: (id: string, command: string) => Promise<string>
    onData: (callback: (data: string) => void) => void
  }
  ai: {
    chat: (messages: any[]) => Promise<string>
    chatStream: (messages: any[], callback: (chunk: string) => void) => Promise<void>
  }
  file: {
    select: () => Promise<string[]>
    read: (path: string) => Promise<string>
    write: (path: string, content: string) => Promise<void>
  }
  app: {
    getVersion: () => Promise<string>
    quit: () => Promise<void>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
```

---

## IPC 最佳实践

### 类型安全的 IPC

```typescript
// shared/types/ipc.ts
export interface IPCRequest<T = any> {
  id: string
  method: string
  params: T
}

export interface IPCResponse<T = any> {
  id: string
  success: boolean
  data?: T
  error?: string
}

// 定义所有 IPC 方法
export interface IPCMethods {
  'ssh:connect': {
    params: SSHConfig
    result: string
  }
  'ssh:execute': {
    params: { id: string; command: string }
    result: { stdout: string; stderr: string }
  }
  'ai:chat': {
    params: { messages: ChatMessage[] }
    result: string
  }
}
```

### IPC 处理器封装

```typescript
// electron/ipc/base-handler.ts
import { ipcMain, IpcMainInvokeEvent } from 'electron'

export abstract class BaseIPCHandler {
  protected abstract handlers: Record<string, Function>

  register(): void {
    Object.entries(this.handlers).forEach(([channel, handler]) => {
      ipcMain.handle(channel, async (event: IpcMainInvokeEvent, ...args: any[]) => {
        try {
          return await handler.call(this, event, ...args)
        } catch (error) {
          console.error(`IPC Error [${channel}]:`, error)
          throw error
        }
      })
    })
  }
}

// electron/ipc/ssh-handlers.ts
import { BaseIPCHandler } from './base-handler'
import { SSHService } from '../services/ssh.service'

export class SSHIPCHandler extends BaseIPCHandler {
  private sshService = new SSHService()

  protected handlers = {
    'ssh:connect': this.handleConnect,
    'ssh:disconnect': this.handleDisconnect,
    'ssh:execute': this.handleExecute,
    'ssh:list': this.handleList
  }

  private async handleConnect(event: any, config: SSHConfig): Promise<string> {
    return await this.sshService.connect(config)
  }

  private async handleDisconnect(event: any, id: string): Promise<void> {
    await this.sshService.disconnect(id)
  }

  private async handleExecute(
    event: any,
    id: string,
    command: string
  ): Promise<{ stdout: string; stderr: string }> {
    return await this.sshService.executeCommand(id, command)
  }

  private async handleList(event: any): Promise<SSHConnection[]> {
    return this.sshService.getAllConnections()
  }
}

// 注册处理器
new SSHIPCHandler().register()
```

### 双向通信

```typescript
// 主进程推送数据到渲染进程
class SSHIPCHandler extends BaseIPCHandler {
  private async handleConnect(event: any, config: SSHConfig): Promise<string> {
    const id = await this.sshService.connect(config)
    
    // 监听 SSH 数据
    this.sshService.on('data', (connectionId, data) => {
      // 推送到渲染进程
      event.sender.send('ssh:data', { connectionId, data })
    })
    
    return id
  }
}

// 渲染进程接收数据
window.electronAPI.ssh.onData(({ connectionId, data }) => {
  console.log(`收到数据 [${connectionId}]:`, data)
})
```

---

## Vue 3 集成

### Router 配置

```typescript
// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // Electron 中使用 hash 模式
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/WelcomeView.vue')
    },
    {
      path: '/ssh/:id',
      name: 'ssh',
      component: () => import('@/views/SSHView.vue')
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('@/views/ChatView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue')
    }
  ]
})

export default router
```

### Pinia Store

```typescript
// src/stores/ssh.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSSHStore = defineStore('ssh', () => {
  const connections = ref<SSHConnection[]>([])
  const activeConnectionId = ref<string | null>(null)

  // 连接到服务器
  async function connect(config: SSHConfig) {
    const id = await window.electronAPI.ssh.connect(config)
    
    connections.value.push({
      id,
      name: `${config.username}@${config.host}`,
      status: 'connected',
      config
    })
    
    activeConnectionId.value = id
    return id
  }

  // 断开连接
  async function disconnect(id: string) {
    await window.electronAPI.ssh.disconnect(id)
    
    const index = connections.value.findIndex(c => c.id === id)
    if (index !== -1) {
      connections.value.splice(index, 1)
    }
    
    if (activeConnectionId.value === id) {
      activeConnectionId.value = null
    }
  }

  // 执行命令
  async function executeCommand(id: string, command: string) {
    return await window.electronAPI.ssh.execute(id, command)
  }

  return {
    connections,
    activeConnectionId,
    connect,
    disconnect,
    executeCommand
  }
})
```

### 组件示例

```vue
<!-- src/views/SSHView.vue -->
<template>
  <div class="ssh-view">
    <div class="toolbar">
      <button @click="executeCommand">执行命令</button>
      <button @click="disconnect">断开连接</button>
    </div>
    
    <div class="terminal" ref="terminalRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSSHStore } from '@/stores/ssh'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

const route = useRoute()
const sshStore = useSSHStore()
const terminalRef = ref<HTMLElement>()

let terminal: Terminal
let fitAddon: FitAddon

onMounted(() => {
  // 创建终端
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    theme: {
      background: '#1e1e1e',
      foreground: '#d4d4d4'
    }
  })
  
  fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)
  
  terminal.open(terminalRef.value!)
  fitAddon.fit()
  
  // 监听 SSH 数据
  window.electronAPI.ssh.onData((data) => {
    terminal.write(data)
  })
  
  // 终端输入 -> SSH
  terminal.onData((data) => {
    const connectionId = route.params.id as string
    sshStore.executeCommand(connectionId, data)
  })
})

onUnmounted(() => {
  terminal?.dispose()
})

async function executeCommand() {
  const connectionId = route.params.id as string
  const command = prompt('输入命令:')
  if (command) {
    await sshStore.executeCommand(connectionId, command)
  }
}

async function disconnect() {
  const connectionId = route.params.id as string
  await sshStore.disconnect(connectionId)
}
</script>
```

---

## 性能优化

### 1. 启动速度优化

**延迟加载**：
```typescript
// 不要在启动时加载所有模块
// ❌ 不好
import heavyModule from 'heavy-module'

app.whenReady().then(() => {
  heavyModule.init()
  createWindow()
})

// ✅ 好
app.whenReady().then(() => {
  createWindow()
  
  // 延迟加载
  setTimeout(async () => {
    const heavyModule = await import('heavy-module')
    heavyModule.init()
  }, 1000)
})
```

**窗口预渲染**：
```typescript
function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,  // 先不显示
    backgroundColor: '#1e1e1e'  // 设置背景色
  })

  mainWindow.loadURL('...')

  // 加载完成后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })
}
```

### 2. 内存优化

**及时释放资源**：
```typescript
class ResourceManager {
  private resources = new Map<string, any>()

  register(id: string, resource: any) {
    this.resources.set(id, resource)
  }

  release(id: string) {
    const resource = this.resources.get(id)
    if (resource) {
      // 清理资源
      if (resource.dispose) resource.dispose()
      if (resource.destroy) resource.destroy()
      if (resource.close) resource.close()
      
      this.resources.delete(id)
    }
  }

  releaseAll() {
    this.resources.forEach((_, id) => this.release(id))
  }
}

// 窗口关闭时清理
mainWindow.on('closed', () => {
  resourceManager.releaseAll()
  mainWindow = null
})
```

**限制并发**：
```typescript
class TaskQueue {
  private queue: Array<() => Promise<any>> = []
  private running = 0
  private maxConcurrent = 3

  async add<T>(task: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve as any))
    }

    this.running++
    try {
      return await task()
    } finally {
      this.running--
      const next = this.queue.shift()
      if (next) next()
    }
  }
}
```

### 3. 渲染优化

**虚拟滚动**：
```vue
<template>
  <div class="list-container" @scroll="handleScroll">
    <div class="list-spacer" :style="{ height: totalHeight + 'px' }">
      <div
        class="list-items"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="item in visibleItems"
          :key="item.id"
          class="list-item"
        >
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  items: any[]
  itemHeight: number
}>()

const scrollTop = ref(0)
const containerHeight = 600

const visibleStart = computed(() => 
  Math.floor(scrollTop.value / props.itemHeight)
)

const visibleEnd = computed(() => 
  Math.ceil((scrollTop.value + containerHeight) / props.itemHeight)
)

const visibleItems = computed(() => 
  props.items.slice(visibleStart.value, visibleEnd.value)
)

const totalHeight = computed(() => 
  props.items.length * props.itemHeight
)

const offsetY = computed(() => 
  visibleStart.value * props.itemHeight
)

function handleScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}
</script>
```

---

## 打包发布

### electron-builder 配置

```yaml
# electron-builder.yml
appId: com.aifuqiang.ai-ssh-assistant
productName: AI SSH Assistant
copyright: Copyright © 2025 aifuqiang

directories:
  output: release
  buildResources: resources

files:
  - dist-electron/**/*
  - dist/**/*
  - package.json

# Windows 配置
win:
  target:
    - target: nsis
      arch:
        - x64
  icon: resources/icon.ico
  artifactName: ${productName}-${version}-setup-${arch}.${ext}

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: always
  createStartMenuShortcut: true

# macOS 配置
mac:
  target:
    - target: dmg
      arch:
        - x64
        - arm64
  icon: resources/icon.icns
  category: public.app-category.developer-tools
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: resources/entitlements.mac.plist
  entitlementsInherit: resources/entitlements.mac.plist

dmg:
  contents:
    - x: 410
      y: 150
      type: link
      path: /Applications
    - x: 130
      y: 150
      type: file

# Linux 配置
linux:
  target:
    - AppImage
    - deb
  icon: resources/icon.png
  category: Development
  maintainer: aifuqiang <aifuqiang02@gmail.com>

appImage:
  artifactName: ${productName}-${version}-linux-${arch}.${ext}

deb:
  artifactName: ${productName}-${version}-linux-${arch}.${ext}
```

### 构建脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && electron-builder",
    "build:win": "vite build && electron-builder --win",
    "build:mac": "vite build && electron-builder --mac",
    "build:linux": "vite build && electron-builder --linux",
    "build:all": "vite build && electron-builder -mwl"
  }
}
```

### 自动更新

```typescript
// electron/main.ts
import { autoUpdater } from 'electron-updater'

// 配置更新服务器
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'aifuqiang02',
  repo: 'ai-ssh-assistant'
})

// 检查更新
autoUpdater.checkForUpdatesAndNotify()

// 监听更新事件
autoUpdater.on('update-available', (info) => {
  mainWindow?.webContents.send('update-available', info)
})

autoUpdater.on('update-downloaded', (info) => {
  mainWindow?.webContents.send('update-downloaded', info)
})

// 安装更新
ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall()
})
```

---

## 总结

Electron + Vue3 开发桌面应用的关键要点：

1. **安全第一** - 启用 contextIsolation，使用 preload
2. **类型安全** - TypeScript + 类型定义
3. **性能优化** - 延迟加载、虚拟滚动、资源管理
4. **IPC 通信** - 封装处理器、错误处理
5. **打包发布** - electron-builder、自动更新

**最佳实践**：
- ✅ 使用 Vite 提升开发体验
- ✅ 使用 Pinia 管理状态
- ✅ 封装 IPC 通信
- ✅ 注意内存泄漏
- ✅ 完善错误处理

---

## 项目信息

想了解更多技术细节？

- 🌟 **GitHub 仓库**：https://github.com/aifuqiang02/ai-ssh-assistant
- 📦 **下载体验**：https://github.com/aifuqiang02/ai-ssh-assistant/releases/latest
- 💬 **QQ 交流群**：307460844 - [点击加入](https://qm.qq.com/q/etLhGujyzm)

**如果觉得有用，欢迎给个 ⭐️ Star 支持一下！**

---

## 关于作者

一名热爱开源的后端开发工程师，专注于 AI 与开发工具的结合。

欢迎关注我，后续会持续分享 AI SSH Assistant 的技术细节！

---

**相关文章**：
- 上一篇：《从 0 到 1 实现 AI 对话：OpenAI API 最佳实践》
- 下一篇：《xterm.js 深度实践：打造完美的 Web 终端》（即将发布）

---

*本文首发于 CSDN，转载请注明出处。*

