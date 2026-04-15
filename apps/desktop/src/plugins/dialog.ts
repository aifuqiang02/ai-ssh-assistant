import type { App } from 'vue'
import { $confirm, $alert } from '@/composables/useDialog'

/**
 * Dialog 插件
 * 在 Vue 应用中全局注册 $confirm 和 $alert 方法
 */
export default {
  install(app: App) {
    // 注册全局方法
    app.config.globalProperties.$confirm = $confirm
    app.config.globalProperties.$alert = $alert
  }
}

// TypeScript 类型声明
declare module 'vue' {
  interface ComponentCustomProperties {
    $confirm: typeof $confirm
    $alert: typeof $alert
  }
}

