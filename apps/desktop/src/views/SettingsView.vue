<template>
  <div class="settings-view p-6 bg-vscode-bg h-full">
    <div class="settings-header mb-6">
      <h2 class="text-2xl font-bold text-vscode-fg">设置</h2>
      <p class="text-vscode-fg-muted">配置应用程序选项</p>
    </div>
    
    <div class="settings-content space-y-6">
      <!-- 主题设置 -->
      <div class="setting-group bg-vscode-bg p-6">
        <h3 class="text-lg font-semibold mb-4 text-vscode-fg">外观</h3>
        
        <!-- 主题模式 -->
        <div class="setting-item flex items-center justify-between mb-4">
          <div class="flex-1">
            <label class="text-vscode-fg font-medium">主题模式</label>
            <p class="text-xs text-vscode-fg-muted mt-1">
              选择应用的外观主题
            </p>
          </div>
          <select 
            v-model="theme" 
            @change="onThemeChange"
            class="form-input-md"
          >
            <option value="light">☀️ 浅色</option>
            <option value="dark">🌙 深色</option>
            <option value="auto">🔄 跟随系统</option>
          </select>
        </div>
        
        <!-- 颜色方案 -->
        <div class="setting-item mb-4">
          <label class="block text-vscode-fg font-medium mb-2">颜色方案</label>
          <p class="text-xs text-vscode-fg-muted mb-3">
            自定义应用的主色调
          </p>
          <div class="grid grid-cols-5 gap-2">
            <div 
              v-for="scheme in availableColorSchemes" 
              :key="scheme.value"
              @click="onColorSchemeChange(scheme.value)"
              :class="[
                'flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all border-2',
                selectedColorScheme === scheme.value 
                  ? 'border-vscode-accent bg-vscode-bg-lighter' 
                  : 'border-vscode-border hover:border-vscode-fg-muted'
              ]"
            >
              <div 
                :style="{ backgroundColor: scheme.color }" 
                class="w-8 h-8 rounded-full mb-2 shadow-lg"
              ></div>
              <span class="text-xs text-vscode-fg">{{ scheme.label }}</span>
              <span v-if="selectedColorScheme === scheme.value" class="text-xs text-vscode-accent mt-1">✓</span>
            </div>
          </div>
        </div>
        
        <!-- 字体大小 -->
        <div class="setting-item flex items-center justify-between mb-4">
          <div class="flex-1">
            <label class="text-vscode-fg font-medium">字体大小</label>
            <p class="text-xs text-vscode-fg-muted mt-1">
              调整界面文字大小
            </p>
          </div>
          <select 
            v-model="fontSize" 
            @change="onFontSizeChange"
            class="form-input-md"
          >
            <option value="small">小 (14px)</option>
            <option value="medium">中 (16px)</option>
            <option value="large">大 (18px)</option>
          </select>
        </div>

        <!-- 主题预览 -->
        <div class="setting-item">
          <label class="block text-vscode-fg font-medium mb-2">预览</label>
          <div class="theme-preview p-4 bg-vscode-bg-lighter">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-10 h-10 rounded-full" :style="{ backgroundColor: availableColorSchemes.find(s => s.value === selectedColorScheme)?.color }"></div>
              <div>
                <p class="text-vscode-fg font-medium">示例标题</p>
                <p class="text-vscode-fg-muted text-sm">这是一段示例文字</p>
              </div>
            </div>
            <button 
              class="px-4 py-2 rounded text-white transition-colors hover:opacity-100"
              :style="{ 
                backgroundColor: availableColorSchemes.find(s => s.value === selectedColorScheme)?.color,
                opacity: 0.9
              }"
            >
              示例按钮1
            </button>
          </div>
        </div>
      </div>
      
      <!-- 数据存储设置 -->
      <div class="setting-group bg-vscode-bg p-6 border-t border-vscode-border-subtle">
        <h3 class="text-lg font-semibold mb-3 text-vscode-fg">数据存储</h3>
        
        <div class="setting-item mb-4">
          <label class="block text-vscode-fg-muted mb-2">存储模式</label>
          <select 
            v-model="storageMode" 
            @change="onStorageModeChange"
            class="form-input-lg"
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
            
            <div v-if="userInfo" class="user-info bg-vscode-bg-lighter p-3">
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
              class="form-input-lg"
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
      <div class="setting-group bg-vscode-bg p-6 border-t border-vscode-border-subtle">
        <h3 class="text-lg font-semibold mb-3 text-vscode-fg">SSH 配置</h3>
        
        <div class="setting-item mb-4">
          <label class="block text-vscode-fg-muted mb-2">默认超时时间 (秒)</label>
          <input 
            v-model="sshTimeout" 
            type="number" 
            class="form-input-sm"
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
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import LoginModal from '../components/auth/LoginModal.vue'
import { useThemeStore } from '../stores/theme'

// 主题 Store
const themeStore = useThemeStore()
const { mode, colorScheme, fontSize: themeFontSize } = storeToRefs(themeStore)

// 基础设置
const theme = ref<'light' | 'dark' | 'auto'>('auto')
const fontSize = ref<'small' | 'medium' | 'large'>('medium')
const selectedColorScheme = ref<'blue' | 'green' | 'purple' | 'orange' | 'red'>('blue')
const sshTimeout = ref(30)
const keepAlive = ref(true)

// 可用的颜色方案
const availableColorSchemes = computed(() => themeStore.getAvailableColorSchemes())

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

// 主题变化处理
const onThemeChange = () => {
  themeStore.setMode(theme.value)
  console.log('Theme mode changed to:', theme.value)
  showSuccessNotification('主题模式已更新')
}

const onColorSchemeChange = (scheme: 'blue' | 'green' | 'purple' | 'orange' | 'red') => {
  selectedColorScheme.value = scheme
  themeStore.setColorScheme(scheme)
  console.log('Color scheme changed to:', scheme)
  showSuccessNotification('颜色方案已更新')
}

const onFontSizeChange = () => {
  themeStore.setFontSize(fontSize.value)
  console.log('Font size changed to:', fontSize.value)
  showSuccessNotification('字体大小已更新')
}

// 显示成功通知
const showSuccessNotification = (message: string) => {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-all'
  document.body.appendChild(notification)
  
  // 添加进入动画
  setTimeout(() => {
    notification.style.opacity = '1'
    notification.style.transform = 'translateY(0)'
  }, 10)
  
  // 3秒后淡出并移除
  setTimeout(() => {
    notification.style.opacity = '0'
    notification.style.transform = 'translateY(-10px)'
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
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
    colorScheme: selectedColorScheme.value,
    sshTimeout: sshTimeout.value,
    keepAlive: keepAlive.value,
    storageMode: storageMode.value,
    syncFrequency: syncFrequency.value,
    userInfo: userInfo.value
  }
  
  // 保存到本地存储
  localStorage.setItem('appSettings', JSON.stringify(settings))
  
  console.log('Settings saved:', settings)
  
  // 应用主题设置
  themeStore.setMode(theme.value)
  themeStore.setColorScheme(selectedColorScheme.value)
  themeStore.setFontSize(fontSize.value)
  
  showSuccessNotification('设置已保存！')
}

// 加载设置
const loadSettings = () => {
  try {
    // 从 themeStore 加载主题设置
    theme.value = mode.value
    fontSize.value = themeFontSize.value
    selectedColorScheme.value = colorScheme.value
    
    // 从 localStorage 加载其他设置
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      
      // SSH 和其他设置
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

// 监听主题 Store 变化
watch([mode, colorScheme, themeFontSize], () => {
  theme.value = mode.value
  fontSize.value = themeFontSize.value
  selectedColorScheme.value = colorScheme.value
})

onMounted(() => {
  loadSettings()
  console.log('SettingsView mounted')
  console.log('Current theme:', {
    mode: mode.value,
    colorScheme: colorScheme.value,
    fontSize: themeFontSize.value
  })
})
</script>

<style scoped>
.settings-view {
  max-height: 100vh;
  overflow-y: auto;
}

/* 主题预览样式 */
.theme-preview {
  transition: all 0.3s ease;
}

.theme-preview button {
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-preview button:active {
  transform: scale(0.98);
}

/* 颜色方案选择器样式 */
.setting-item > div[class*="grid"] > div {
  user-select: none;
}

.setting-item > div[class*="grid"] > div:active {
  transform: scale(0.95);
}

/* 成功通知动画初始状态 */
.fixed.bg-green-600 {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}
</style>
