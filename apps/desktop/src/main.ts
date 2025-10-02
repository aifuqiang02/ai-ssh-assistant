import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createRouter, createWebHashHistory } from 'vue-router'
import BootstrapVueNext from 'bootstrap-vue-next'

// 样式导入
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.css'

// 应用组件和路由
import App from './App.vue'
import routes from './router'

// 创建应用实例
const app = createApp(App)

// 设置 Vue 错误处理器
app.config.errorHandler = (err: any, instance: any, info: string) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)
  console.error('Stack:', err.stack)
}

// 创建 Pinia store
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 注册插件
app.use(pinia)
app.use(router)
app.use(BootstrapVueNext)

// 挂载应用
app.mount('#app')
