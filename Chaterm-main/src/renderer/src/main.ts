import './assets/main.css'
import './assets/theme.less'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './locales'
import contextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'
import 'ant-design-vue/dist/reset.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { notification } from 'ant-design-vue'
import { shortcutService } from './services/shortcutService'
import eventBus from './utils/eventBus'

// Set global notification top position
notification.config({
  top: '30px'
})
// Import storage functions
import * as storageState from './agent/storage/state'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
// Router
app.use(router)
// Internationalization
app.use(i18n)
// State management
app.use(pinia)
// Context menu
app.use(contextmenu)

// Expose storage API to global window object for main process calls
declare global {
  interface Window {
    storageAPI: typeof storageState
    api: any
  }
}

window.storageAPI = storageState

app.mount('#app')

if (import.meta.hot) {
  import.meta.hot.on('vite:afterUpdate', () => {
    shortcutService.init()
  })
}

// Setup global message listener for main process communications
if (window.api && window.api.onMainMessage) {
  window.api.onMainMessage((message: any) => {
    console.log('Global main process message received:', message.type, message)

    // Handle command generation responses
    if (message.type === 'commandGenerationResponse') {
      eventBus.emit('commandGenerationResponse', {
        command: message.command,
        error: message.error,
        tabId: message.tabId
      })
    }
  })
}

import { userConfigStore } from '@/services/userConfigStoreService'

// 渲染进程启动时注册 IPC 处理器
function setupIPCHandlers() {
  const electronAPI = (window as any).electron

  if (!electronAPI?.ipcRenderer) return
  const { ipcRenderer } = electronAPI

  ipcRenderer.on('userConfig:get', async () => {
    try {
      const config = await userConfigStore.getConfig()
      ipcRenderer.send('userConfig:get-response', config)
    } catch (error) {
      const e = error as Error
      ipcRenderer.send('userConfig:get-error', e.message)
    }
  })
}

setupIPCHandlers()

export { pinia }
