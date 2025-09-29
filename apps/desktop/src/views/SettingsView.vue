<template>
  <div class="settings-view p-6 bg-vscode-bg-light h-full">
    <div class="settings-header mb-6">
      <h2 class="text-2xl font-bold text-vscode-fg">设置</h2>
      <p class="text-vscode-fg-muted">配置应用程序选项</p>
    </div>
    
    <div class="settings-content space-y-6">
      <!-- 主题设置 -->
      <div class="setting-group bg-vscode-bg rounded-lg p-4 border border-vscode-border">
        <h3 class="text-lg font-semibold mb-3 text-vscode-fg">外观</h3>
        
        <div class="setting-item flex items-center justify-between mb-4">
          <label class="text-vscode-fg-muted">主题模式</label>
          <select 
            v-model="theme" 
            class="px-3 py-2 border rounded-md bg-vscode-bg-light border-vscode-border text-vscode-fg"
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="auto">跟随系统</option>
          </select>
        </div>
        
        <div class="setting-item flex items-center justify-between">
          <label class="text-vscode-fg-muted">字体大小</label>
          <select 
            v-model="fontSize" 
            class="px-3 py-2 border rounded-md bg-vscode-bg-light border-vscode-border text-vscode-fg"
          >
            <option value="small">小</option>
            <option value="medium">中</option>
            <option value="large">大</option>
          </select>
        </div>
      </div>
      
      <!-- 数据存储设置 -->
      <div class="setting-group bg-vscode-bg rounded-lg p-4 border border-vscode-border">
        <h3 class="text-lg font-semibold mb-3 text-vscode-fg">数据存储</h3>
        
        <div class="setting-item mb-4">
          <label class="block text-vscode-fg-muted mb-2">存储模式</label>
          <select 
            v-model="storageMode" 
            @change="onStorageModeChange"
            class="w-full px-3 py-2 border rounded-md bg-vscode-bg-light border-vscode-border text-vscode-fg"
          >
            <option value="local">仅本地存储</option>
            <option value="cloud">仅云端存储</option>
            <option value="hybrid">混合模式 (本地+云端)</option>
          </select>
          <p class="text-xs text-vscode-fg-muted mt-1">
            <span v-if="storageMode === 'local'">数据仅保存在本地，隐私性最高</span>
            <span v-else-if="storageMode === 'cloud'">数据保存在云端，可跨设备同步</span>
            <span v-else>本地存储为主，云端同步备份</span>
          </p>
        </div>

        <!-- 云端存储配置 -->
        <div v-if="storageMode !== 'local'" class="cloud-storage-config space-y-3">
          <div class="setting-item">
            <div class="flex items-center justify-between mb-2">
              <label class="text-vscode-fg-muted">云端存储状态</label>
              <span :class="[
                'px-2 py-1 text-xs rounded',
                userInfo ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              ]">
                {{ userInfo ? '已登录' : '未登录' }}
              </span>
            </div>
            
            <div v-if="userInfo" class="user-info bg-vscode-bg p-3 rounded border border-vscode-border">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-vscode-accent rounded-full flex items-center justify-center text-white text-sm">
                  {{ userInfo.name?.charAt(0) || 'U' }}
                </div>
                <div class="flex-1">
                  <p class="text-vscode-fg font-medium">{{ userInfo.name }}</p>
                  <p class="text-vscode-fg-muted text-sm">{{ userInfo.email }}</p>
                </div>
                <button @click="logout" class="text-red-400 hover:text-red-300 text-sm">
                  退出登录
                </button>
              </div>
            </div>
            
            <div v-else class="login-prompt">
              <button @click="showLoginModal = true" class="vscode-button primary w-full">
                登录云端账户
              </button>
            </div>
          </div>

          <div v-if="storageMode === 'hybrid'" class="setting-item">
            <label class="block text-vscode-fg-muted mb-2">同步频率</label>
            <select 
              v-model="syncFrequency" 
              class="w-full px-3 py-2 border rounded-md bg-vscode-bg-light border-vscode-border text-vscode-fg"
            >
              <option value="realtime">实时同步</option>
              <option value="high">高频 (15秒)</option>
              <option value="moderate">中频 (1分钟)</option>
              <option value="low">低频 (5分钟)</option>
              <option value="manual">手动同步</option>
            </select>
          </div>

          <div v-if="userInfo && storageMode === 'hybrid'" class="setting-item">
            <div class="flex items-center justify-between mb-2">
              <label class="text-vscode-fg-muted">上次同步时间</label>
              <button @click="manualSync" :disabled="syncLoading" class="text-vscode-accent hover:underline text-sm">
                {{ syncLoading ? '同步中...' : '立即同步' }}
              </button>
            </div>
            <p class="text-xs text-vscode-fg-muted">
              {{ lastSyncTime || '从未同步' }}
            </p>
          </div>
        </div>
      </div>

      <!-- SSH 设置 -->
      <div class="setting-group bg-vscode-bg rounded-lg p-4 border border-vscode-border">
        <h3 class="text-lg font-semibold mb-3 text-vscode-fg">SSH 配置</h3>
        
        <div class="setting-item mb-4">
          <label class="block text-vscode-fg-muted mb-2">默认超时时间 (秒)</label>
          <input 
            v-model="sshTimeout" 
            type="number" 
            class="w-full px-3 py-2 border rounded-md bg-vscode-bg-light border-vscode-border text-vscode-fg"
            min="10"
            max="300"
          />
        </div>
        
        <div class="setting-item flex items-center justify-between">
          <label class="text-vscode-fg-muted">保持连接</label>
          <input 
            v-model="keepAlive" 
            type="checkbox" 
            class="w-4 h-4 text-vscode-accent bg-vscode-bg-light border-vscode-border rounded"
          />
        </div>
      </div>
      
      <!-- 保存按钮 -->
      <div class="settings-actions">
        <button 
          @click="saveSettings"
          class="px-6 py-2 bg-vscode-accent text-white rounded-md hover:bg-vscode-accent-hover transition-colors"
        >
          保存设置
        </button>
      </div>
    </div>

    <!-- 登录模态框 -->
    <LoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @login-success="onLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginModal from '../components/auth/LoginModal.vue'

// 基础设置
const theme = ref('light')
const fontSize = ref('medium')
const sshTimeout = ref(30)
const keepAlive = ref(true)

// 存储设置
const storageMode = ref<'local' | 'cloud' | 'hybrid'>('local')
const syncFrequency = ref<'realtime' | 'high' | 'moderate' | 'low' | 'manual'>('moderate')
const userInfo = ref<any>(null)
const showLoginModal = ref(false)
const syncLoading = ref(false)
const lastSyncTime = ref<string>('')

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
  const savedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
  
  if (token && savedUserInfo) {
    try {
      userInfo.value = JSON.parse(savedUserInfo)
    } catch (error) {
      console.error('Parse user info error:', error)
      logout()
    }
  }
}

// 存储模式变化处理
const onStorageModeChange = () => {
  if (storageMode.value !== 'local' && !userInfo.value) {
    // 如果选择云端相关模式但未登录，显示登录框
    showLoginModal.value = true
  }
  
  // 保存设置
  saveSettings()
}

// 登录成功处理
const onLoginSuccess = (user: any) => {
  userInfo.value = user
  console.log('Login successful:', user)
  
  // 如果是云端存储模式，初始化存储管理器
  if (storageMode.value !== 'local') {
    initializeStorageManager()
  }
}

// 退出登录
const logout = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')
  sessionStorage.removeItem('userToken')
  sessionStorage.removeItem('userInfo')
  userInfo.value = null
  
  // 切换回本地存储模式
  storageMode.value = 'local'
  saveSettings()
}

// 手动同步
const manualSync = async () => {
  if (!userInfo.value || storageMode.value === 'local') return
  
  syncLoading.value = true
  try {
    // 这里调用实际的同步逻辑
    await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟同步
    lastSyncTime.value = new Date().toLocaleString()
    console.log('Manual sync completed')
  } catch (error) {
    console.error('Sync error:', error)
  } finally {
    syncLoading.value = false
  }
}

// 初始化存储管理器
const initializeStorageManager = async () => {
  try {
    console.log('Initializing storage manager with mode:', storageMode.value)
    // 这里集成实际的存储管理器初始化逻辑
  } catch (error) {
    console.error('Storage manager initialization error:', error)
  }
}

// 保存设置
const saveSettings = () => {
  const settings = {
    theme: theme.value,
    fontSize: fontSize.value,
    sshTimeout: sshTimeout.value,
    keepAlive: keepAlive.value,
    storageMode: storageMode.value,
    syncFrequency: syncFrequency.value,
    userInfo: userInfo.value
  }
  
  // 保存到本地存储
  localStorage.setItem('appSettings', JSON.stringify(settings))
  
  console.log('Settings saved:', settings)
  
  // 显示保存成功消息
  // 可以用更好的通知组件替换alert
  const notification = document.createElement('div')
  notification.textContent = '设置已保存！'
  notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50'
  document.body.appendChild(notification)
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// 加载设置
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      theme.value = settings.theme || 'light'
      fontSize.value = settings.fontSize || 'medium'
      sshTimeout.value = settings.sshTimeout || 30
      keepAlive.value = settings.keepAlive !== undefined ? settings.keepAlive : true
      storageMode.value = settings.storageMode || 'local'
      syncFrequency.value = settings.syncFrequency || 'moderate'
      
      // 不直接从设置加载userInfo，而是通过token验证
      checkLoginStatus()
    }
  } catch (error) {
    console.error('Load settings error:', error)
  }
}

onMounted(() => {
  loadSettings()
  console.log('SettingsView mounted')
})
</script>

<style scoped>
.settings-view {
  max-height: 100vh;
  overflow-y: auto;
}
</style>
