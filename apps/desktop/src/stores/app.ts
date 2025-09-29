import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const currentRoute = ref('/')
  const sidebarCollapsed = ref(false)
  
  // 应用设置
  const settings = ref({
    language: 'zh-CN',
    autoSave: true,
    notifications: true,
    theme: 'auto'
  })
  
  // 错误状态
  const error = ref<string | null>(null)
  const errors = ref<string[]>([])
  
  // 计算属性
  const hasErrors = computed(() => errors.value.length > 0)
  const isReady = computed(() => isInitialized.value && !isLoading.value)
  
  // 初始化应用
  const initialize = async () => {
    if (isInitialized.value) return
    
    try {
      isLoading.value = true
      
      // 加载用户设置
      await loadSettings()
      
      // 初始化其他服务
      await initializeServices()
      
      isInitialized.value = true
      console.log('App initialized successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '应用初始化失败'
      addError(errorMessage)
      console.error('App initialization failed:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  // 加载设置
  const loadSettings = async () => {
    try {
      const savedSettings = localStorage.getItem('app-settings')
      if (savedSettings) {
        settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    }
  }
  
  // 保存设置
  const saveSettings = async () => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings.value))
    } catch (err) {
      console.error('Failed to save settings:', err)
      throw new Error('保存设置失败')
    }
  }
  
  // 初始化服务
  const initializeServices = async () => {
    // 这里可以初始化各种服务
    // 例如：WebSocket 连接、数据库连接等
    return Promise.resolve()
  }
  
  // 更新设置
  const updateSetting = <K extends keyof typeof settings.value>(
    key: K,
    value: typeof settings.value[K]
  ) => {
    settings.value[key] = value
    saveSettings()
  }
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 设置当前路由
  const setCurrentRoute = (route: string) => {
    currentRoute.value = route
  }
  
  // 错误处理
  const addError = (message: string) => {
    error.value = message
    errors.value.push(message)
  }
  
  const clearError = () => {
    error.value = null
  }
  
  const clearAllErrors = () => {
    error.value = null
    errors.value = []
  }
  
  const removeError = (index: number) => {
    errors.value.splice(index, 1)
    if (errors.value.length === 0) {
      error.value = null
    }
  }
  
  // 打开设置页面
  const openSettings = () => {
    // 导航到设置页面
    console.log('Opening settings...')
    
    // 在组件外部无法直接使用 useRouter，需要在调用的地方处理路由
    // 这里我们发出一个事件或者设置一个状态标记
    currentRoute.value = '/settings'
    
    // 触发自定义事件来通知路由变化
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('navigate-to-settings'))
    }
  }
  
  // 重置应用状态
  const reset = () => {
    isInitialized.value = false
    isLoading.value = false
    currentRoute.value = '/'
    sidebarCollapsed.value = false
    error.value = null
    errors.value = []
  }
  
  return {
    // 状态
    isInitialized,
    isLoading,
    currentRoute,
    sidebarCollapsed,
    settings,
    error,
    errors,
    
    // 计算属性
    hasErrors,
    isReady,
    
    // 方法
    initialize,
    loadSettings,
    saveSettings,
    updateSetting,
    toggleSidebar,
    setCurrentRoute,
    addError,
    clearError,
    clearAllErrors,
    removeError,
    openSettings,
    reset
  }
}, {
  persist: {
    key: 'ai-ssh-assistant-app',
    storage: localStorage,
    paths: ['settings', 'sidebarCollapsed']
  }
})
