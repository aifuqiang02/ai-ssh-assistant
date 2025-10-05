<template>
  <div class="vscode-app h-screen flex flex-col bg-vscode-bg text-vscode-fg select-none">
    <!-- 标题栏 -->
    <AppTitleBar v-if="!isFullscreen" class="vscode-titlebar" @open-settings="openSettings" />
    
    <!-- 主内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 活动栏 -->
      <div class="vscode-activitybar w-12 bg-vscode-bg-light border-r border-vscode-border flex flex-col">
        <div class="flex-1 py-2">
          <div 
            v-for="item in activityBarItems" 
            :key="item.id"
            @click="setActiveView(item.id)"
            :class="['vscode-activity-item', { 'active': activeView === item.id }]"
            :title="item.tooltip"
          >
            <i :class="item.icon"></i>
          </div>
        </div>
        <div class="py-2">
          <div class="vscode-activity-item" @click="openSettings" title="设置">
            <i class="bi bi-gear"></i>
          </div>
        </div>
      </div>
      
      <!-- 侧边栏 -->
      <div 
        v-if="showSidebar" 
        class="vscode-sidebar bg-vscode-bg-light border-r border-vscode-border flex-shrink-0"
        :style="{ width: sidebarWidth + 'px' }"
      >
        <AppSidebar :active-view="activeView" />
      </div>
      
      <!-- 左侧拖拽分割条 -->
      <div 
        v-if="showSidebar"
        class="vscode-splitter vscode-splitter-vertical"
        @mousedown="startLeftResize"
      ></div>
      
      <!-- 编辑器区域 -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- 标签栏 -->
        <div class="vscode-tab-bar bg-vscode-bg-light border-b border-vscode-border flex" style="height: 37px;">
          <div 
            v-for="tab in openTabs" 
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            :class="['vscode-tab', { 'active': activeTab === tab.id }]"
          >
            <i :class="tab.icon" class="mr-1"></i>
            <span>{{ tab.name }}</span>
            <button @click.stop="closeTab(tab.id)" class="vscode-tab-close">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
        
        <!-- 主内容 -->
        <main class="flex-1 overflow-hidden bg-vscode-bg">
          <router-view />
        </main>
      </div>
      
    </div>
    
    <!-- 状态栏 -->
    <AppStatusBar v-if="!isFullscreen" class="vscode-statusbar" />
    
    <!-- 全局模态框 -->
    <GlobalModals />
    
    <!-- 通知组件 -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import { useStorageStore } from '@/stores/storage'
import AppTitleBar from '@/components/layout/AppTitleBar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppStatusBar from '@/components/layout/AppStatusBar.vue'
import GlobalModals from '@/components/common/GlobalModals.vue'
import NotificationContainer from '@/components/common/NotificationContainer.vue'

const router = useRouter()
const appStore = useAppStore()
const themeStore = useThemeStore()
const storageStore = useStorageStore()

// 响应式数据
const isFullscreen = ref(false)
const showSidebar = ref(true)
const activeView = ref('welcome')
const activeTab = ref('welcome')

// 面板尺寸
const sidebarWidth = ref(256) // 默认256px

// 拖拽状态
const isResizing = ref(false)
const resizeType = ref<'left' | null>(null)
const startX = ref(0)
const startWidth = ref(0)

// 活动栏项目
const activityBarItems = ref([
  { id: 'welcome', icon: 'bi bi-house', tooltip: '欢迎' },
  { id: 'ssh', icon: 'bi bi-hdd-network', tooltip: 'SSH 连接' },
  { id: 'chat', icon: 'bi bi-chat-dots', tooltip: 'AI 聊天' },
  { id: 'files', icon: 'bi bi-folder', tooltip: '文件管理' }
])

// 打开的标签
const openTabs = ref([
  { id: 'welcome', name: '欢迎', icon: 'bi bi-house', path: '/' }
])

// 方法
const setActiveView = (viewId: string) => {
  activeView.value = viewId
  
  // SSH 和 Chat 视图只切换侧边栏，不打开新 tab
  if (viewId === 'ssh' || viewId === 'chat') {
    return
  }
  
  // 定义路由和标签信息映射
  const viewConfigs: Record<string, { path: string; name: string; icon: string }> = {
    welcome: { path: '/', name: '欢迎', icon: 'bi bi-house' },
    files: { path: '/files', name: '文件管理', icon: 'bi bi-folder' }
  }
  
  const config = viewConfigs[viewId]
  if (config) {
    // 在新标签中打开或切换到已存在的标签
    openNewTab(viewId, config.name, config.icon, config.path)
  }
}

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
  const tab = openTabs.value.find(t => t.id === tabId)
  if (tab && tab.path) {
    // 路由跳转到对应页面
    router.push(tab.path)
    console.log(`Switched to tab: ${tab.name}`)
  }
}

const closeTab = (tabId: string) => {
  const index = openTabs.value.findIndex(t => t.id === tabId)
  if (index === -1) return
  
  // 如果只剩一个 tab，不允许关闭，而是切换到 welcome
  if (openTabs.value.length === 1) {
    if (tabId !== 'welcome') {
      // 关闭当前 tab，打开 welcome tab
      openTabs.value = [{ id: 'welcome', name: '欢迎', icon: 'bi bi-house', path: '/' }]
      activeTab.value = 'welcome'
      router.push('/')
      console.log('Last tab closed, switched to welcome')
    }
    return
  }
  
  // 正常关闭 tab
  openTabs.value.splice(index, 1)
  if (activeTab.value === tabId) {
    // 切换到相邻标签
    const newIndex = Math.min(index, openTabs.value.length - 1)
    const newTab = openTabs.value[newIndex]
    activeTab.value = newTab.id
    // 路由跳转到新激活的标签页面
    router.push(newTab.path)
    console.log(`Tab closed, switched to: ${newTab.name}`)
  }
}

// 打开新标签的方法
const openNewTab = (id: string, name: string, icon: string, path: string) => {
  // 检查标签是否已经存在
  const existingTab = openTabs.value.find(t => t.id === id)
  if (existingTab) {
    // 如果标签已存在，直接激活它
    activeTab.value = id
    router.push(path)
    return
  }
  
  // 创建新标签
  const newTab = { id, name, icon, path }
  openTabs.value.push(newTab)
  
  // 激活新标签
  activeTab.value = id
  router.push(path)
  
  console.log(`Opened new tab: ${name}`)
}

const openSettings = () => {
  // 打开设置页面 - 在新标签中打开
  console.log('Opening settings in new tab...')
  openNewTab('settings', '设置', 'bi bi-gear', '/settings')
}

// 提供打开新标签的方法给子组件
provide('openNewTab', openNewTab)


// 处理视图切换事件
const handleSwitchView = (event: Event) => {
  const customEvent = event as CustomEvent
  const { viewId } = customEvent.detail
  if (viewId) {
    setActiveView(viewId)
  }
}

// 拖拽调整大小功能
const startLeftResize = (event: MouseEvent) => {
  isResizing.value = true
  resizeType.value = 'left'
  startX.value = event.clientX
  startWidth.value = sidebarWidth.value
  document.body.classList.add('resizing')
  document.addEventListener('mousemove', handlePanelResize)
  document.addEventListener('mouseup', stopResize)
  event.preventDefault()
}


const handlePanelResize = (event: MouseEvent) => {
  if (!isResizing.value) return
  
  const deltaX = event.clientX - startX.value
  
  if (resizeType.value === 'left') {
    // 左侧侧边栏调整
    const newWidth = startWidth.value + deltaX
    sidebarWidth.value = Math.max(200, Math.min(600, newWidth)) // 限制在200-600px之间
  }
}

const stopResize = () => {
  isResizing.value = false
  resizeType.value = null
  document.body.classList.remove('resizing')
  document.removeEventListener('mousemove', handlePanelResize)
  document.removeEventListener('mouseup', stopResize)
}

// 键盘快捷键处理
const handleKeydown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + B 切换侧边栏
  if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
    event.preventDefault()
    showSidebar.value = !showSidebar.value
  }
  
  // F11 切换全屏
  if (event.key === 'F11') {
    event.preventDefault()
    isFullscreen.value = !isFullscreen.value
    if (window.electronAPI?.toggleFullscreen) {
      window.electronAPI.toggleFullscreen()
    }
  }
  
  // Ctrl/Cmd + , 打开设置
  if ((event.ctrlKey || event.metaKey) && event.key === ',') {
    event.preventDefault()
    openSettings()
  }

  // F12 切换开发者工具
  if (event.key === 'F12') {
    event.preventDefault()
    if (window.electronAPI?.toggleDevTools) {
      window.electronAPI.toggleDevTools()
        .then((opened: boolean) => {
          console.log('DevTools toggled via Vue:', opened ? 'opened' : 'closed')
        })
        .catch((error: any) => {
          console.error('Failed to toggle DevTools:', error)
        })
    }
  }
}

// 窗口大小变化处理
const handleResize = () => {
  // 响应式布局调整
  if (window.innerWidth < 768) {
    showSidebar.value = false
  }
}

onMounted(async () => {
  // 初始化应用
  appStore.initialize()
  themeStore.initialize()
  
  // 初始化存储管理器
  try {
    // 检查用户登录状态
    const isLoggedIn = storageStore.checkAuthStatus()
    
    // 根据登录状态和用户设置确定存储模式
    const savedSettings = localStorage.getItem('appSettings')
    let storageMode = 'local' // 默认本地存储
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        storageMode = settings.storageMode || 'local'
      } catch (error) {
        console.error('Parse settings error:', error)
      }
    }
    
    // 如果设置为云端模式但未登录，fallback到本地模式
    if (storageMode !== 'local' && !isLoggedIn) {
      console.warn('Cloud storage requested but user not logged in, using local storage')
      storageMode = 'local'
    }
    
    await storageStore.initializeStorage(storageMode as any)
    console.log('Storage initialized with mode:', storageMode)
  } catch (error) {
    console.error('Storage initialization failed:', error)
    // 如果存储初始化失败，fallback到本地模式
    try {
      await storageStore.initializeStorage('local')
      console.log('Fallback to local storage successful')
    } catch (fallbackError) {
      console.error('Fallback storage initialization failed:', fallbackError)
    }
  }
  
  // 绑定事件监听器
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
  window.addEventListener('switch-view', handleSwitchView as EventListener)
  
  // 监听全屏状态变化
  if (window.electronAPI?.onFullscreenChange) {
    window.electronAPI.onFullscreenChange((fullscreen: boolean) => {
      isFullscreen.value = fullscreen
    })
  }
})

onUnmounted(async () => {
  // 断开存储连接
  try {
    await storageStore.disconnect()
    console.log('Storage disconnected')
  } catch (error) {
    console.error('Storage disconnect error:', error)
  }
  
  // 清理事件监听器
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('switch-view', handleSwitchView as EventListener)
})
</script>

<style scoped>
.vscode-app {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 13px;
}

/* 活动栏样式 */
.vscode-activitybar {
  background: var(--vscode-bg-light);
}

.vscode-activity-item {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--vscode-fg-muted);
  transition: color 0.15s ease;
  position: relative;
}

.vscode-activity-item:hover {
  color: var(--vscode-fg);
}

.vscode-activity-item.active {
  color: var(--vscode-accent);
}

.vscode-activity-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 16px;
  background: var(--vscode-accent);
}

.vscode-activity-item i {
  font-size: 16px;
}

/* 标签栏样式 */
.vscode-tab-bar {
  background: var(--vscode-bg-light);
}

.vscode-tab {
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  border-top: 2px solid transparent;
  position: relative;
  min-width: 120px;
  max-width: 200px;
  height: 37px;
  transition: color 0.15s ease;
}

.vscode-tab:hover {
  color: var(--vscode-fg);
}

.vscode-tab.active {
  color: var(--vscode-fg);
  border-top-color: var(--vscode-accent);
  background: var(--vscode-bg);
}

.vscode-tab:not(.active):hover {
  background: var(--vscode-bg-lighter);
}

.vscode-tab span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.5rem;
}

.vscode-tab-close {
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  color: var(--vscode-fg-muted);
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}

.vscode-tab-close:hover {
  color: var(--vscode-fg);
  background-color: var(--vscode-bg-lighter);
}

.vscode-tab:hover .vscode-tab-close {
  opacity: 1;
}

.vscode-tab-close i {
  font-size: 10px;
}

/* 侧边栏样式 */
.vscode-sidebar {
  background: var(--vscode-bg-light);
}

/* 状态栏样式 */
.vscode-statusbar {
  background: var(--vscode-accent);
  height: 22px;
}

/* 标题栏样式 */
.vscode-titlebar {
  background: var(--vscode-bg-light);
  height: 30px;
  -webkit-app-region: drag;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .vscode-sidebar {
    position: absolute;
    left: 48px;
    top: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }
}

/* 自定义滚动条 */
:deep(.scrollbar-thin) {
  scrollbar-width: thin;
  scrollbar-color: var(--vscode-bg-lighter) var(--vscode-bg);
}

:deep(.scrollbar-thin::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.scrollbar-thin::-webkit-scrollbar-track) {
  background: var(--vscode-bg);
}

:deep(.scrollbar-thin::-webkit-scrollbar-thumb) {
  background: var(--vscode-bg-lighter);
  border-radius: 0;
}

:deep(.scrollbar-thin::-webkit-scrollbar-thumb:hover) {
  background: var(--vscode-border);
}

/* 拖拽分割条样式 */
.vscode-splitter {
  background: var(--vscode-bg-light);
  position: relative;
  z-index: 10;
}

.vscode-splitter-vertical {
  width: 4px;
  cursor: col-resize;
  transition: background-color 0.15s ease;
}

.vscode-splitter-vertical:hover {
  background-color: var(--vscode-accent);
}

.vscode-splitter-vertical::before {
  content: '';
  position: absolute;
  left: -2px;
  right: -2px;
  top: 0;
  bottom: 0;
  background: transparent;
}

/* 拖拽时的全局样式 */
body.resizing {
  cursor: col-resize !important;
  user-select: none !important;
}

body.resizing * {
  cursor: col-resize !important;
  user-select: none !important;
}
</style>
