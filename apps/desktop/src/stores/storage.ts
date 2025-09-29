import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { StorageManager, createStorageConfig, type StorageMode } from '@ai-ssh/database'

export interface UserInfo {
  id: number
  email: string
  name: string
  avatar?: string
  cloudStorageEnabled: boolean
}

export interface StorageState {
  mode: StorageMode
  isInitialized: boolean
  user: UserInfo | null
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  lastSyncTime: string | null
  syncErrorMessage: string | null
}

export const useStorageStore = defineStore('storage', () => {
  // State
  const state = ref<StorageState>({
    mode: 'local',
    isInitialized: false,
    user: null,
    syncStatus: 'idle',
    lastSyncTime: null,
    syncErrorMessage: null
  })

  const storageManager = ref<StorageManager | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!state.value.user)
  const isCloudEnabled = computed(() => state.value.mode !== 'local' && isLoggedIn.value)
  const canSync = computed(() => state.value.mode === 'hybrid' && isLoggedIn.value)

  // Actions
  const initializeStorage = async (mode: StorageMode = 'auto') => {
    try {
      console.log('Initializing storage with mode:', mode)
      
      const config = createStorageConfig(process.env.NODE_ENV || 'development', {
        allowCloudStorage: true,
        allowOfflineMode: true,
        syncFrequency: 'moderate',
        autoSwitchStorage: true // 启用自动切换存储
      })

      // 更新配置模式
      config.defaultMode = mode

      // 如果是云端模式但没有用户信息，使用本地模式
      if (mode !== 'local' && !state.value.user) {
        console.warn('Cloud mode requested but no user logged in, falling back to local')
        config.defaultMode = 'local'
        state.value.mode = 'local'
      } else {
        state.value.mode = mode
      }

      // 创建存储管理器
      storageManager.value = new StorageManager(config)
      await storageManager.value.connect()

      state.value.isInitialized = true
      console.log('Storage initialized successfully')
    } catch (error) {
      console.error('Storage initialization failed:', error)
      throw error
    }
  }

  const switchStorageMode = async (mode: StorageMode) => {
    if (!storageManager.value) {
      await initializeStorage(mode)
      return
    }

    try {
      console.log('Switching storage mode to:', mode)
      
      // 如果切换到云端模式但没有登录，抛出错误
      if (mode !== 'local' && !state.value.user) {
        throw new Error('Cannot switch to cloud mode without user login')
      }

      await storageManager.value.switchMode(mode)
      state.value.mode = mode
      
      console.log('Storage mode switched successfully')
    } catch (error) {
      console.error('Storage mode switch failed:', error)
      throw error
    }
  }

  const login = async (userInfo: UserInfo, token: string, remember: boolean = false) => {
    try {
      console.log('User login:', userInfo.email)
      
      state.value.user = userInfo
      
      // 保存认证信息
      const storage = remember ? localStorage : sessionStorage
      storage.setItem('userToken', token)
      storage.setItem('userInfo', JSON.stringify(userInfo))
      
      // 如果当前是本地模式，切换到混合模式
      if (state.value.mode === 'local') {
        await switchStorageMode('hybrid')
      }
      
      console.log('User login successful')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('User logout')
      
      // 清除认证信息
      localStorage.removeItem('userToken')
      localStorage.removeItem('userInfo')
      sessionStorage.removeItem('userToken')
      sessionStorage.removeItem('userInfo')
      
      state.value.user = null
      
      // 切换到本地模式
      await switchStorageMode('local')
      
      console.log('User logout successful')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
      const userInfoStr = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
      
      if (token && userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        state.value.user = userInfo
        console.log('Auth status checked - user logged in:', userInfo.email)
        return true
      } else {
        state.value.user = null
        console.log('Auth status checked - no user logged in')
        return false
      }
    } catch (error) {
      console.error('Check auth status failed:', error)
      state.value.user = null
      return false
    }
  }

  const syncData = async () => {
    if (!canSync.value || !storageManager.value) {
      console.warn('Cannot sync - conditions not met')
      return
    }

    try {
      state.value.syncStatus = 'syncing'
      state.value.syncErrorMessage = null
      
      console.log('Starting data sync...')
      const result = await storageManager.value.sync()
      
      state.value.syncStatus = 'success'
      state.value.lastSyncTime = new Date().toISOString()
      
      console.log('Data sync completed:', result)
      return result
    } catch (error) {
      console.error('Data sync failed:', error)
      state.value.syncStatus = 'error'
      state.value.syncErrorMessage = error instanceof Error ? error.message : 'Sync failed'
      throw error
    }
  }

  const getStorageAdapter = () => {
    if (!storageManager.value) {
      throw new Error('Storage manager not initialized')
    }
    return storageManager.value
  }

  // Database operations (代理到存储管理器)
  const create = async (model: string, data: any) => {
    const adapter = getStorageAdapter()
    return adapter.create(model, data)
  }

  const findMany = async (model: string, options?: any) => {
    const adapter = getStorageAdapter()
    return adapter.findMany(model, options)
  }

  const findUnique = async (model: string, options: any) => {
    const adapter = getStorageAdapter()
    return adapter.findUnique(model, options)
  }

  const update = async (model: string, options: any) => {
    const adapter = getStorageAdapter()
    return adapter.update(model, options)
  }

  const remove = async (model: string, options: any) => {
    const adapter = getStorageAdapter()
    return adapter.delete(model, options)
  }

  const disconnect = async () => {
    if (storageManager.value) {
      await storageManager.value.disconnect()
      storageManager.value = null
      state.value.isInitialized = false
      console.log('Storage disconnected')
    }
  }

  // 用户认证状态管理
  const setUserAuthenticated = async (user: { id: string; email?: string; username?: string }) => {
    if (storageManager.value) {
      await storageManager.value.setUserAuthenticated(user)
      
      // 更新前端状态
      state.value.user = {
        id: parseInt(user.id),
        email: user.email || '',
        name: user.username || user.email || '',
        avatar: undefined,
        cloudStorageEnabled: true
      }
      
      console.log('User authenticated, storage may have switched to cloud')
    }
  }

  const setUserUnauthenticated = async () => {
    if (storageManager.value) {
      await storageManager.value.setUserUnauthenticated()
      
      // 清除前端状态
      state.value.user = null
      
      console.log('User unauthenticated, storage may have switched to local')
    }
  }

  return {
    // State
    state: computed(() => state.value),
    
    // Getters
    isLoggedIn,
    isCloudEnabled,
    canSync,
    
    // Actions
    initializeStorage,
    switchStorageMode,
    login,
    logout,
    checkAuthStatus,
    setUserAuthenticated,
    setUserUnauthenticated,
    syncData,
    disconnect,
    
    // Database operations
    create,
    findMany,
    findUnique,
    update,
    remove
  }
})
