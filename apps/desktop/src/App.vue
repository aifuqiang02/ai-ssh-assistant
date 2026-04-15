<template>
  <div class="vscode-app h-screen flex flex-col bg-vscode-bg text-vscode-fg select-none">
    <!-- 标题栏 -->
    <AppTitleBar
      v-if="!isFullscreen"
      class="vscode-titlebar"
      @open-settings="openSettings"
      @open-login="openLoginModal"
    />

    <!-- 主内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 活动栏 -->
      <div
        class="vscode-activitybar w-12 bg-vscode-bg-light border-r border-vscode-border flex flex-col"
      >
        <div class="flex-1 py-2">
          <div
            v-for="item in activityBarItems"
            :key="item.id"
            @click="setActiveView(item.id)"
            :class="['vscode-activity-item', { active: activeView === item.id }]"
            :title="item.tooltip"
          >
            <i :class="item.icon"></i>
          </div>
        </div>
        <div class="py-2">
          <div
            class="vscode-activity-item"
            @click="openSettings"
            :title="$t('activityBar.settings')"
          >
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
        <div
          class="vscode-tab-bar bg-vscode-bg-light border-b border-vscode-border flex"
          style="height: 37px"
        >
          <div
            v-for="tab in openTabs"
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            @mousedown.middle="closeTab(tab.id)"
            :class="['vscode-tab', { active: activeTab === tab.id }]"
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
          <router-view v-slot="{ Component, route }">
            <keep-alive>
              <component :is="Component" :key="getRouteKey(route)" />
            </keep-alive>
          </router-view>
        </main>
      </div>
    </div>

    <!-- 状态栏 -->
    <AppStatusBar v-if="!isFullscreen" class="vscode-statusbar" />

    <!-- 全局模态框 -->
    <GlobalModals />

    <!-- 通知组件 -->
    <NotificationContainer />

    <LoginModal
      v-if="showLoginModal"
      :key="loginModalKey"
      :show="showLoginModal"
      @close="closeLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApp } from '@/composables/useApp'
import { useTheme } from '@/composables/useTheme'
import { useUpdateClient } from '@/services/update-client'
import AppTitleBar from '@/components/layout/AppTitleBar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppStatusBar from '@/components/layout/AppStatusBar.vue'
import GlobalModals from '@/components/common/GlobalModals.vue'
import NotificationContainer from '@/components/common/NotificationContainer.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import { useAuthSession } from '@/services/auth-session.service'

const router = useRouter()
const route = useRoute()
const app = useApp()
const theme = useTheme()
const updater = useUpdateClient()
const { t: $t } = useI18n()
const { isAuthenticated, syncAuthState } = useAuthSession()

// 响应式数据
const isFullscreen = ref(false)
const showSidebar = ref(true)
const activeView = ref('ssh')
const activeTab = ref('ssh')

// 打开的标签列表（本地状态）
const openTabsList = ref<Array<{ id: string; name: string; icon: string; path: string }>>([
  { id: 'ssh', name: '', icon: 'bi bi-hdd-network', path: '/ssh' }
])

// 面板尺寸
const sidebarWidth = ref(256) // 默认256px

// 拖拽状态
const isResizing = ref(false)
const resizeType = ref<'left' | null>(null)
const startX = ref(0)
const startWidth = ref(0)

// 活动栏项目
const activityBarItems = computed(() => [
  { id: 'ssh', icon: 'bi bi-hdd-network', tooltip: $t('activityBar.ssh') }
])

// 打开的标签 - 更新 name 为国际化的
const openTabs = computed(() =>
  openTabsList.value.map(tab => ({
    ...tab,
    name:
      tab.id === 'ssh'
        ? $t('ssh.sshConnection')
        : tab.id === 'settings'
          ? $t('common.settings')
          : tab.name
  }))
)

// 当前激活的标签 ID
const activeTabId = ref('ssh')
const showLoginModal = ref(false)
const loginModalKey = ref(0)

// 方法
const setActiveView = (viewId: string) => {
  activeView.value = viewId

  // SSH 视图只切换侧边栏，不打开新 tab
  if (viewId === 'ssh') {
    return
  }

  // 定义路由和标签信息映射
  const viewConfigs: Record<string, { path: string; name: string; icon: string }> = {
    ssh: { path: '/ssh', name: $t('ssh.sshConnection'), icon: 'bi bi-hdd-network' }
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
  }
}

const closeTab = (tabId: string) => {
  const index = openTabsList.value.findIndex(t => t.id === tabId)
  if (index === -1) {
    return
  }

  // 如果只剩一个 tab，不允许关闭
  if (openTabsList.value.length === 1) {
    return
  }

  // 记录当前激活的标签
  const wasActive = activeTab.value === tabId

  // 正常关闭 tab
  openTabsList.value.splice(index, 1)

  if (wasActive) {
    // 切换到相邻标签
    const newIndex = Math.min(index, openTabsList.value.length - 1)
    const newTab = openTabsList.value[newIndex]

    activeTab.value = newTab.id
    // 路由跳转到新激活的标签页面
    router
      .push(newTab.path)
      .then(() => {})
      .catch(err => {})
  }
}

// 打开新标签的方法
const openNewTab = (id: string, name: string, icon: string, path: string) => {
  // 检查标签是否已经存在
  const existingTab = openTabs.value.find(t => t.id === id)
  if (existingTab) {
    // 如果标签已存在，直接激活它
    activeTab.value = id

    // 如果路径不同，强制跳转路由（确保 query 参数生效）
    if (existingTab.path !== path) {
      router.push(path)
    }
    return
  }

  // 创建新标签
  const newTab = { id, name, icon, path }
  openTabsList.value.push(newTab)

  // 激活新标签
  activeTab.value = id
  router.push(path)
}

const openSettings = () => {
  // 打开设置页面 - 在新标签中打开

  openNewTab('settings', $t('common.settings'), 'bi bi-gear', '/settings')
}

const closeLoginModal = () => {
  console.log('[App] closeLoginModal', { isAuthenticated: isAuthenticated.value })
  showLoginModal.value = false
}

const handleLoginSuccess = () => {
  console.log('[App] handleLoginSuccess')
  syncAuthState()
  showLoginModal.value = false
}

const openLoginModal = () => {
  console.log('[App] openLoginModal')
  loginModalKey.value += 1
  showLoginModal.value = true
}

watch(
  () => isAuthenticated.value,
  value => {
    console.log('[App] isAuthenticated changed', { value })
    if (!value) {
      openLoginModal()
    } else {
      showLoginModal.value = false
    }
  },
  { immediate: true }
)

const isSameTabRoute = (tabPath: string, currentFullPath: string) => {
  const [tabBasePath, tabQuery = ''] = tabPath.split('?')
  const [currentBasePath, currentQuery = ''] = currentFullPath.split('?')

  if (tabBasePath !== currentBasePath) {
    return false
  }

  const tabParams = new URLSearchParams(tabQuery)
  const currentParams = new URLSearchParams(currentQuery)
  const tabConnectionId = tabParams.get('connectionId') || ''
  const currentConnectionId = currentParams.get('connectionId') || ''

  return tabConnectionId === currentConnectionId
}

watch(
  () => route.fullPath,
  () => {
    const routeTabEntry = openTabsList.value.find(tab => isSameTabRoute(tab.path, route.fullPath))
    if (!routeTabEntry) {
      return
    }

    if (routeTabEntry.path === route.fullPath) {
      return
    }

    routeTabEntry.path = route.fullPath
  }
)

watch(
  () => updater.state.value,
  nextState => {
    if (!updater.shouldShowInstallPrompt(nextState) || !window.$notification) {
      return
    }

    window.$notification.add({
      type: 'success',
      title: '发现新版本',
      message: `新版本 ${nextState.availableVersion} 已下载完成，点击即可直接安装。`,
      persistent: true,
      actions: [
        {
          label: '立即安装',
          handler: async () => {
            await updater.installDownloadedUpdate()
          }
        }
      ]
    })
  },
  { deep: true }
)

// 提供打开新标签和关闭标签的方法给子组件
provide('openNewTab', openNewTab)
provide('closeTab', closeTab)

// 为路由生成唯一的缓存键
const getRouteKey = (route: any) => {
  // 对于终端路由，使用 connectionId 作为唯一键
  if (route.path.startsWith('/terminal') && route.query.connectionId) {
    return `terminal-${route.query.connectionId}`
  }

  if (route.path.startsWith('/file-manager') && route.query.connectionId) {
    return `file-manager-${route.query.connectionId}`
  }

  // 其他路由使用路径作为键
  return route.path
}

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
      window.electronAPI
        .toggleDevTools()
        .then((opened: boolean) => {})
        .catch((error: any) => {})
    }
  }
}

// 窗口大小变化处理
const handleResize = () => {
  // 响应式布局调整
  // 不再自动隐藏侧边栏，保持用户的选择
}

onMounted(async () => {
  // 初始化应用
  app.initialize()
  theme.initialize()
  await updater.initialize()

  // 初始化存储管理器
  // ✅ 存储管理现在由服务架构自动处理
  // 服务会根据 localStorage/sessionStorage 中的 token 自动选择模式

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

  syncAuthState()
  if (!isAuthenticated.value) {
    openLoginModal()
  }
  console.log('[App] mounted login state', {
    isAuthenticated: isAuthenticated.value,
    showLoginModal: showLoginModal.value
  })
})

onUnmounted(async () => {
  // 清理事件监听器
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('switch-view', handleSwitchView as EventListener)
})
</script>

<style scoped>
.vscode-app {
  font-family:
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
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
  border-right: 1px solid var(--vscode-border);
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
  transition:
    opacity 0.15s ease,
    color 0.15s ease,
    background-color 0.15s ease;
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
