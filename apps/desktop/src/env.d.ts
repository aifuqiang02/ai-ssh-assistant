/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 导入 Electron API 类型定义
import type { ElectronAPI } from './types/electron'

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

