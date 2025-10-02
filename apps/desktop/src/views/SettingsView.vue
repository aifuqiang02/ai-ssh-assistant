<template>
  <div class="settings-view">
    <!-- 左侧导航树 -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">设置</h3>
      </div>
      <nav class="settings-nav">
        <div 
          v-for="section in settingsSections" 
          :key="section.id"
          :class="['nav-item', { active: activeSection === section.id }]"
          @click="scrollToSection(section.id)"
        >
          <i :class="['nav-icon', section.icon]"></i>
          <span class="nav-label">{{ section.label }}</span>
        </div>
      </nav>
    </div>
    
    <!-- 右侧内容区域 -->
    <div class="settings-content" ref="contentContainer" @scroll="onScroll">
      <div class="content-inner">
        <!-- 外观设置 -->
        <section :id="'section-appearance'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-palette"></i>
            外观
          </h2>
          <p class="section-description">自定义应用程序的外观和视觉效果</p>
        
        <!-- 主题模式 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">主题模式</label>
              <p class="setting-hint">选择应用的外观主题</p>
          </div>
            <div class="setting-right">
              <select v-model="theme" @change="onThemeChange" class="form-select">
            <option value="light">☀️ 浅色</option>
            <option value="dark">🌙 深色</option>
            <option value="auto">🔄 跟随系统</option>
          </select>
            </div>
        </div>
        
        <!-- 颜色方案 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">颜色方案</label>
              <p class="setting-hint">自定义应用的主色调</p>
            </div>
            <div class="setting-right">
              <div class="color-scheme-grid">
            <div 
              v-for="scheme in availableColorSchemes" 
              :key="scheme.value"
              @click="onColorSchemeChange(scheme.value)"
                  :class="['color-scheme-item', { active: selectedColorScheme === scheme.value }]"
                  :title="scheme.label"
                >
                  <div class="color-preview" :style="{ backgroundColor: scheme.color }"></div>
                  <span class="color-label">{{ scheme.label }}</span>
                  <i v-if="selectedColorScheme === scheme.value" class="bi bi-check-circle-fill check-icon"></i>
                </div>
            </div>
          </div>
        </div>
        
        <!-- 字体大小 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">字体大小</label>
              <p class="setting-hint">调整界面文字大小</p>
          </div>
            <div class="setting-right">
              <select v-model="fontSize" @change="onFontSizeChange" class="form-select">
            <option value="small">小 (14px)</option>
            <option value="medium">中 (16px)</option>
            <option value="large">大 (18px)</option>
          </select>
            </div>
        </div>

        <!-- 主题预览 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">预览效果</label>
              <p class="setting-hint">查看当前主题的效果</p>
            </div>
            <div class="setting-right">
              <div class="theme-preview">
                <div class="preview-header">
                  <div class="preview-avatar" :style="{ backgroundColor: availableColorSchemes.find(s => s.value === selectedColorScheme)?.color }">
                    <i class="bi bi-person"></i>
                  </div>
                  <div class="preview-info">
                    <p class="preview-title">示例标题</p>
                    <p class="preview-subtitle">这是一段示例文字</p>
              </div>
            </div>
            <button 
                  class="preview-button"
              :style="{ 
                    backgroundColor: availableColorSchemes.find(s => s.value === selectedColorScheme)?.color
              }"
            >
                  <i class="bi bi-check-circle"></i>
              示例按钮
            </button>
          </div>
        </div>
      </div>
        </section>
      
      <!-- 数据存储设置 -->
        <section :id="'section-storage'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-database"></i>
            数据存储
          </h2>
          <p class="section-description">配置数据存储方式和同步选项</p>

          <!-- 存储模式 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">存储模式</label>
              <p class="setting-hint">选择数据存储的方式</p>
            </div>
            <div class="setting-right">
              <select v-model="storageMode" @change="onStorageModeChange" class="form-select">
            <option value="local">仅本地存储</option>
            <option value="cloud">仅云端存储</option>
            <option value="hybrid">混合模式 (本地+云端)</option>
          </select>
              <p class="setting-info">
                <i class="bi bi-info-circle"></i>
            <span v-if="storageMode === 'local'">数据仅保存在本地，隐私性最高</span>
            <span v-else-if="storageMode === 'cloud'">数据保存在云端，可跨设备同步</span>
            <span v-else>本地存储为主，云端同步备份</span>
          </p>
            </div>
        </div>

        <!-- 云端存储配置 -->
          <template v-if="storageMode !== 'local'">
            <!-- 登录状态 -->
            <div class="setting-row">
              <div class="setting-left">
                <label class="setting-label">云端账户</label>
                <p class="setting-hint">登录后可使用云端存储功能</p>
            </div>
              <div class="setting-right">
                <div v-if="userInfo" class="user-info-card">
                  <div class="user-avatar">
                  {{ userInfo.name?.charAt(0) || 'U' }}
                </div>
                  <div class="user-details">
                    <p class="user-name">{{ userInfo.name }}</p>
                    <p class="user-email">{{ userInfo.email }}</p>
                </div>
                  <button @click="logout" class="btn-logout">
                    <i class="bi bi-box-arrow-right"></i>
                    退出
                </button>
              </div>
            <div v-else class="login-prompt">
                  <button @click="showLoginModal = true" class="btn-login">
                    <i class="bi bi-box-arrow-in-right"></i>
                登录云端账户
              </button>
                </div>
            </div>
          </div>

            <!-- 同步频率 -->
            <div v-if="storageMode === 'hybrid'" class="setting-row">
              <div class="setting-left">
                <label class="setting-label">同步频率</label>
                <p class="setting-hint">设置数据同步的频率</p>
              </div>
              <div class="setting-right">
                <select v-model="syncFrequency" class="form-select">
              <option value="realtime">实时同步</option>
              <option value="high">高频 (15秒)</option>
              <option value="moderate">中频 (1分钟)</option>
              <option value="low">低频 (5分钟)</option>
              <option value="manual">手动同步</option>
            </select>
              </div>
          </div>

            <!-- 同步状态 -->
            <div v-if="userInfo && storageMode === 'hybrid'" class="setting-row">
              <div class="setting-left">
                <label class="setting-label">上次同步时间</label>
                <p class="setting-hint">查看最后一次同步的时间</p>
              </div>
              <div class="setting-right">
                <div class="sync-status">
                  <span class="sync-time">{{ lastSyncTime || '从未同步' }}</span>
                  <button @click="manualSync" :disabled="syncLoading" class="btn-sync">
                    <i :class="['bi', syncLoading ? 'bi-arrow-repeat rotating' : 'bi-arrow-repeat']"></i>
                {{ syncLoading ? '同步中...' : '立即同步' }}
              </button>
            </div>
          </div>
        </div>
          </template>
        </section>

        <!-- SSH 配置 -->
        <section :id="'section-ssh'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-terminal"></i>
            SSH 配置
          </h2>
          <p class="section-description">配置 SSH 连接的默认参数</p>

          <!-- 默认超时时间 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">连接超时时间</label>
              <p class="setting-hint">SSH 连接超时时间（秒）</p>
            </div>
            <div class="setting-right">
          <input 
                v-model.number="sshTimeout" 
            type="number" 
                class="form-input"
            min="10"
            max="300"
          />
            </div>
        </div>
        
          <!-- 保持连接 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">保持连接</label>
              <p class="setting-hint">保持 SSH 连接活跃，防止超时断开</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="keepAlive" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 默认端口 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">默认端口</label>
              <p class="setting-hint">新建 SSH 连接时的默认端口</p>
            </div>
            <div class="setting-right">
          <input 
                v-model.number="defaultSSHPort" 
                type="number" 
                class="form-input"
                min="1"
                max="65535"
          />
        </div>
      </div>
        </section>

        <!-- 终端设置 -->
        <section :id="'section-terminal'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-terminal-fill"></i>
            终端
          </h2>
          <p class="section-description">自定义终端的外观和行为</p>

          <!-- 终端字体大小 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">字体大小</label>
              <p class="setting-hint">终端文字大小</p>
            </div>
            <div class="setting-right">
              <input 
                v-model.number="terminalFontSize" 
                type="number" 
                class="form-input"
                min="10"
                max="24"
              />
            </div>
          </div>

          <!-- 光标样式 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">光标样式</label>
              <p class="setting-hint">选择终端光标的样式</p>
            </div>
            <div class="setting-right">
              <select v-model="cursorStyle" class="form-select">
                <option value="block">方块</option>
                <option value="underline">下划线</option>
                <option value="bar">竖线</option>
              </select>
            </div>
          </div>

          <!-- 光标闪烁 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">光标闪烁</label>
              <p class="setting-hint">是否启用光标闪烁效果</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="cursorBlink" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- 高级设置 -->
        <section :id="'section-advanced'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-gear-fill"></i>
            高级设置
          </h2>
          <p class="section-description">高级功能和实验性选项</p>

          <!-- 启动时自动连接 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">启动时自动连接</label>
              <p class="setting-hint">应用启动时自动连接上次使用的 SSH</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="autoConnect" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 记录命令历史 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">命令历史记录</label>
              <p class="setting-hint">记录所有执行的命令</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="saveCommandHistory" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 开发者工具 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">开发者模式</label>
              <p class="setting-hint">启用调试功能和详细日志</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="developerMode" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- 关于 -->
        <section :id="'section-about'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-info-circle"></i>
            关于
          </h2>
          <p class="section-description">应用程序信息和版本详情</p>

          <div class="about-info">
            <div class="app-logo">
              <i class="bi bi-terminal-fill"></i>
            </div>
            <h3 class="app-name">AI SSH Assistant</h3>
            <p class="app-version">版本 1.0.0</p>
            <p class="app-description">
              一款智能的 SSH 管理工具，结合 AI 技术，让远程服务器管理更加简单高效。
            </p>
            <div class="about-links">
              <a href="#" class="about-link">
                <i class="bi bi-github"></i>
                GitHub
              </a>
              <a href="#" class="about-link">
                <i class="bi bi-file-text"></i>
                文档
              </a>
              <a href="#" class="about-link">
                <i class="bi bi-bug"></i>
                反馈
              </a>
            </div>
          </div>
        </section>
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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import LoginModal from '../components/auth/LoginModal.vue'
import { useThemeStore } from '../stores/theme'

// 设置分类
const settingsSections = [
  { id: 'appearance', label: '外观', icon: 'bi bi-palette' },
  { id: 'storage', label: '数据存储', icon: 'bi bi-database' },
  { id: 'ssh', label: 'SSH 配置', icon: 'bi bi-terminal' },
  { id: 'terminal', label: '终端', icon: 'bi bi-terminal-fill' },
  { id: 'advanced', label: '高级设置', icon: 'bi bi-gear-fill' },
  { id: 'about', label: '关于', icon: 'bi bi-info-circle' }
]

// 主题 Store
const themeStore = useThemeStore()
const { mode, colorScheme, fontSize: themeFontSize } = storeToRefs(themeStore)

// 导航相关
const activeSection = ref('appearance')
const contentContainer = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

// 基础设置
const theme = ref<'light' | 'dark' | 'auto'>('auto')
const fontSize = ref<'small' | 'medium' | 'large'>('medium')
const selectedColorScheme = ref<'blue' | 'green' | 'purple' | 'orange' | 'red'>('blue')

// SSH 设置
const sshTimeout = ref(30)
const keepAlive = ref(true)
const defaultSSHPort = ref(22)

// 终端设置
const terminalFontSize = ref(14)
const cursorStyle = ref('block')
const cursorBlink = ref(true)

// 高级设置
const autoConnect = ref(false)
const saveCommandHistory = ref(true)
const developerMode = ref(false)

// 可用的颜色方案
const availableColorSchemes = computed(() => themeStore.getAvailableColorSchemes())

// 存储设置
const storageMode = ref<'local' | 'cloud' | 'hybrid'>('local')
const syncFrequency = ref<'realtime' | 'high' | 'moderate' | 'low' | 'manual'>('moderate')
const userInfo = ref<any>(null)
const showLoginModal = ref(false)
const syncLoading = ref(false)
const lastSyncTime = ref<string>('')

// 滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(`section-${sectionId}`)
  if (element && contentContainer.value) {
    isScrolling.value = true
    activeSection.value = sectionId
    
    const container = contentContainer.value
    const offsetTop = element.offsetTop - 82 // 距离顶部，标题在合适位置
    
    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
    
    // 滚动完成后重置标志
    setTimeout(() => {
      isScrolling.value = false
    }, 600)
  }
}

// 监听滚动，更新激活的导航项
const onScroll = () => {
  if (isScrolling.value) return
  
  const container = contentContainer.value
  if (!container) return
  
  const scrollTop = container.scrollTop
  const sections = settingsSections.map(s => ({
    id: s.id,
    element: document.getElementById(`section-${s.id}`)
  }))
  
  // 找到当前滚动位置对应的section
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element) {
      const offsetTop = section.element.offsetTop - 60 // 提前一点切换
      if (scrollTop >= offsetTop) {
        activeSection.value = section.id
        break
      }
    }
  }
}

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
    showLoginModal.value = true
  }
  saveSettings()
}

// 登录成功处理
const onLoginSuccess = (user: any) => {
  userInfo.value = user
  console.log('Login successful:', user)
  
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
  storageMode.value = 'local'
  saveSettings()
}

// 手动同步
const manualSync = async () => {
  if (!userInfo.value || storageMode.value === 'local') return
  
  syncLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    lastSyncTime.value = new Date().toLocaleString()
    showSuccessNotification('同步成功')
  } catch (error) {
    console.error('Sync error:', error)
    showErrorNotification('同步失败')
  } finally {
    syncLoading.value = false
  }
}

// 主题变化处理
const onThemeChange = () => {
  themeStore.setMode(theme.value)
  showSuccessNotification('主题模式已更新')
}

const onColorSchemeChange = (scheme: 'blue' | 'green' | 'purple' | 'orange' | 'red') => {
  selectedColorScheme.value = scheme
  themeStore.setColorScheme(scheme)
  showSuccessNotification('颜色方案已更新')
}

const onFontSizeChange = () => {
  themeStore.setFontSize(fontSize.value)
  showSuccessNotification('字体大小已更新')
}

// 显示通知
const showSuccessNotification = (message: string) => {
  showNotification(message, 'success')
}

const showErrorNotification = (message: string) => {
  showNotification(message, 'error')
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.className = `notification ${type === 'success' ? 'notification-success' : 'notification-error'}`
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.classList.add('show')
  }, 10)
  
  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
        document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// 初始化存储管理器
const initializeStorageManager = async () => {
  try {
    console.log('Initializing storage manager with mode:', storageMode.value)
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
    defaultSSHPort: defaultSSHPort.value,
    terminalFontSize: terminalFontSize.value,
    cursorStyle: cursorStyle.value,
    cursorBlink: cursorBlink.value,
    autoConnect: autoConnect.value,
    saveCommandHistory: saveCommandHistory.value,
    developerMode: developerMode.value,
    storageMode: storageMode.value,
    syncFrequency: syncFrequency.value
  }
  
  localStorage.setItem('appSettings', JSON.stringify(settings))
  themeStore.setMode(theme.value)
  themeStore.setColorScheme(selectedColorScheme.value)
  themeStore.setFontSize(fontSize.value)
  
  console.log('Settings saved:', settings)
}

// 加载设置
const loadSettings = () => {
  try {
    theme.value = mode.value
    fontSize.value = themeFontSize.value
    selectedColorScheme.value = colorScheme.value
    
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      
      sshTimeout.value = settings.sshTimeout || 30
      keepAlive.value = settings.keepAlive !== undefined ? settings.keepAlive : true
      defaultSSHPort.value = settings.defaultSSHPort || 22
      terminalFontSize.value = settings.terminalFontSize || 14
      cursorStyle.value = settings.cursorStyle || 'block'
      cursorBlink.value = settings.cursorBlink !== undefined ? settings.cursorBlink : true
      autoConnect.value = settings.autoConnect || false
      saveCommandHistory.value = settings.saveCommandHistory !== undefined ? settings.saveCommandHistory : true
      developerMode.value = settings.developerMode || false
      storageMode.value = settings.storageMode || 'local'
      syncFrequency.value = settings.syncFrequency || 'moderate'
      
      checkLoginStatus()
    }
  } catch (error) {
    console.error('Load settings error:', error)
  }
}

// 自动保存
watch([
  theme, fontSize, selectedColorScheme, sshTimeout, keepAlive, defaultSSHPort,
  terminalFontSize, cursorStyle, cursorBlink, autoConnect, saveCommandHistory,
  developerMode, storageMode, syncFrequency
], () => {
  saveSettings()
}, { deep: true })

// 监听主题 Store 变化
watch([mode, colorScheme, themeFontSize], () => {
  theme.value = mode.value
  fontSize.value = themeFontSize.value
  selectedColorScheme.value = colorScheme.value
})

onMounted(() => {
  loadSettings()
  console.log('SettingsView mounted')
})
</script>

<style scoped>
.settings-view {
  display: flex;
  height: 100vh;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* ========== 左侧导航 ========== */
.settings-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--vscode-bg-lighter);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
}

.sidebar-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.settings-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vscode-fg-muted);
  user-select: none;
}

.nav-item:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.nav-item.active {
  background: var(--vscode-bg);
  color: var(--vscode-accent);
  border-left: 2px solid var(--vscode-accent);
  padding-left: 18px;
}

.nav-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
}

/* ========== 右侧内容 ========== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-inner {
  max-width: 800px;
  padding: 32px 48px;
}

.setting-section {
  margin-bottom: 48px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--vscode-fg);
}

.section-title i {
  font-size: 22px;
  color: var(--vscode-accent);
}

.section-description {
  margin: 0 0 24px 0;
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

.setting-row {
  display: flex;
  gap: 32px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vscode-border);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-left {
  flex: 1;
  min-width: 0;
}

.setting-right {
  flex-shrink: 0;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.setting-hint {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin: 0;
  line-height: 1.5;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--vscode-bg-lighter);
  border-radius: 4px;
}

/* ========== 表单控件 ========== */
.form-select,
.form-input {
  width: 100%;
  padding: 8px 12px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-select:focus,
.form-input:focus {
  border-color: var(--vscode-accent);
}

.form-select:hover,
.form-input:hover {
  border-color: var(--vscode-fg-muted);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vscode-border);
  border-radius: 24px;
  transition: 0.3s;
}

.toggle-slider:before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--vscode-accent);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* ========== 颜色方案选择器 ========== */
.color-scheme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.color-scheme-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid var(--vscode-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.color-scheme-item:hover {
  border-color: var(--vscode-fg-muted);
  background: var(--vscode-bg-lighter);
}

.color-scheme-item.active {
  border-color: var(--vscode-accent);
  background: var(--vscode-bg-lighter);
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-label {
  font-size: 12px;
  color: var(--vscode-fg);
  text-align: center;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--vscode-accent);
  font-size: 14px;
}

/* ========== 主题预览 ========== */
.theme-preview {
  padding: 16px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.preview-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.preview-info {
  flex: 1;
}

.preview-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.preview-subtitle {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.preview-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.preview-button:active {
  transform: translateY(0);
}

/* ========== 用户信息卡片 ========== */
.user-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--vscode-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.user-email {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--vscode-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: #e74c3c;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-logout:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
}

/* ========== 登录按钮 ========== */
.login-prompt {
  width: 100%;
}

.btn-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--vscode-accent);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-login:active {
  transform: translateY(0);
}

/* ========== 同步状态 ========== */
.sync-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sync-time {
  font-size: 13px;
  color: var(--vscode-fg-muted);
}

.btn-sync {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-accent);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sync:hover:not(:disabled) {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.btn-sync:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ========== 关于部分 ========== */
.about-info {
  text-align: center;
  padding: 32px 24px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 12px;
}

.app-logo {
  font-size: 64px;
  color: var(--vscode-accent);
  margin-bottom: 16px;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--vscode-fg);
  margin: 0 0 8px 0;
}

.app-version {
  font-size: 14px;
  color: var(--vscode-fg-muted);
  margin: 0 0 16px 0;
}

.app-description {
  font-size: 14px;
  color: var(--vscode-fg-muted);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 24px auto;
}

.about-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.about-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  color: var(--vscode-accent);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.about-link:hover {
  background: var(--vscode-bg);
  border-color: var(--vscode-accent);
  transform: translateY(-2px);
}

/* ========== 通知 ========== */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.notification.show {
  opacity: 1;
  transform: translateY(0);
}

.notification-success {
  background: #27ae60;
  color: white;
}

.notification-error {
  background: #e74c3c;
  color: white;
}

/* ========== 滚动条 ========== */
.settings-content::-webkit-scrollbar,
.settings-nav::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track,
.settings-nav::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb,
.settings-nav::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
.settings-nav::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-fg-muted);
}
</style>
