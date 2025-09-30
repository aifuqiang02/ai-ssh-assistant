<template>
  <footer class="vscode-statusbar text-vscode-fg h-6 flex items-center justify-between text-xs select-none">
    <!-- 左侧状态信息 -->
    <div class="flex items-center">
      <!-- Git 分支信息 -->
      <div class="statusbar-item" @click="showBranchInfo">
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.5 2.5 0 0 1 7.5 6h2A1 1 0 0 0 10.5 5V4.622A2.251 2.251 0 0 1 9.5 3.25z"/>
        </svg>
        <span>main</span>
      </div>

      <!-- 错误和警告 -->
      <div class="statusbar-item" @click="showProblems" v-if="errors > 0 || warnings > 0">
        <svg class="w-3 h-3 mr-1 text-red-400" fill="currentColor" viewBox="0 0 16 16" v-if="errors > 0">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        <svg class="w-3 h-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 16 16" v-else-if="warnings > 0">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <span v-if="errors > 0" class="text-red-400">{{ errors }}</span>
        <span v-if="warnings > 0" class="text-yellow-400 ml-2">{{ warnings }}</span>
      </div>

      <!-- SSH 连接状态 -->
      <div class="statusbar-item" @click="showConnectionDetails">
        <div 
          :class="[
            'w-2 h-2 rounded-full mr-2',
            connectionStatus === 'connected' ? 'bg-green-400' : 
            connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
          ]"
        ></div>
        <span>{{ connectionStatusText }}</span>
        <span v-if="currentServer" class="text-vscode-statusbar-text-dim ml-1">({{ currentServer }})</span>
      </div>
    </div>
    
    <!-- 中央消息区域 -->
    <div class="flex-1 px-4">
      <span v-if="currentMessage" class="text-center block">{{ currentMessage }}</span>
    </div>
    
    <!-- 右侧信息 -->
    <div class="flex items-center">
      <!-- 编码格式 -->
      <div class="statusbar-item" @click="changeEncoding">
        <span>UTF-8</span>
      </div>

      <!-- 行列位置 -->
      <div class="statusbar-item" @click="goToLine">
        <span>第 {{ currentLine }} 行，第 {{ currentColumn }} 列</span>
      </div>

      <!-- 语言模式 -->
      <div class="statusbar-item" @click="selectLanguage">
        <span>{{ currentLanguage }}</span>
      </div>

      <!-- 网络状态 -->
      <div class="statusbar-item" @click="showNetworkInfo">
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16" :class="networkStatus === 'online' ? 'text-green-400' : 'text-red-400'">
          <path d="M0 6a6 6 0 1 1 12 0A6 6 0 0 1 0 6z"/>
          <path d="M13 8.5a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V9a.5.5 0 0 1-.5-.5z"/>
        </svg>
        <span>{{ networkStatus === 'online' ? '在线' : '离线' }}</span>
      </div>

      <!-- 系统资源 -->
      <div class="statusbar-item" @click="showSystemInfo">
        <span>CPU: {{ cpuUsage }}%</span>
        <span class="ml-2">内存: {{ memoryUsage }}MB</span>
      </div>

      <!-- 通知图标 -->
      <div class="statusbar-item" @click="showNotifications" v-if="hasNotifications">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 响应式数据
const connectionStatus = ref<'connected' | 'connecting' | 'disconnected'>('disconnected')
const currentServer = ref<string | null>(null)
const currentMessage = ref('')
const memoryUsage = ref(128)
const cpuUsage = ref(15)
const networkStatus = ref<'online' | 'offline'>('online')

// VSCode 状态栏相关数据
const errors = ref(0)
const warnings = ref(0)
const currentLine = ref(1)
const currentColumn = ref(1)
const currentLanguage = ref('TypeScript')
const hasNotifications = ref(false)

// 安全访问器
const getWindow = (): any => {
  return typeof globalThis !== 'undefined' && 'window' in globalThis ? (globalThis as any).window : null
}

const getNavigator = (): any => {
  return typeof globalThis !== 'undefined' && 'navigator' in globalThis ? (globalThis as any).navigator : null
}

// 计算属性
const connectionStatusText = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'SSH 已连接'
    case 'connecting':
      return 'SSH 连接中...'
    default:
      return 'SSH 未连接'
  }
})

// 定时器
let systemTimer: NodeJS.Timeout | null = null

// 状态栏点击事件处理
const showBranchInfo = () => {
  showMessage('Git 分支: main', 2000)
}

const showProblems = () => {
  showMessage(`发现 ${errors.value} 个错误，${warnings.value} 个警告`, 3000)
}

const showConnectionDetails = () => {
  const server = currentServer.value ? ` - ${currentServer.value}` : ''
  showMessage(`${connectionStatusText.value}${server}`, 2000)
}

const changeEncoding = () => {
  showMessage('编码格式: UTF-8', 2000)
}

const goToLine = () => {
  showMessage('按 Ctrl+G 跳转到指定行', 2000)
}

const selectLanguage = () => {
  showMessage(`当前语言模式: ${currentLanguage.value}`, 2000)
}

const showNetworkInfo = () => {
  showMessage(`网络状态: ${networkStatus.value === 'online' ? '在线' : '离线'}`, 2000)
}

const showSystemInfo = () => {
  showMessage(`系统资源 - CPU: ${cpuUsage.value}%, 内存: ${memoryUsage.value}MB`, 3000)
}

const showNotifications = () => {
  showMessage('暂无新通知', 2000)
}

// 更新系统信息
const updateSystemInfo = () => {
  // 模拟系统信息更新
  memoryUsage.value = Math.floor(Math.random() * 200) + 100
  cpuUsage.value = Math.floor(Math.random() * 50) + 5
  
  // 模拟错误和警告数量变化
  if (Math.random() > 0.8) {
    errors.value = Math.floor(Math.random() * 5)
    warnings.value = Math.floor(Math.random() * 10)
  }
  
  // 模拟通知状态
  hasNotifications.value = Math.random() > 0.7
  
  // 如果有 Electron API，可以获取真实的系统信息
  const win = getWindow()
  if (win?.electronAPI) {
    win.electronAPI.getSystemInfo().then((info: any) => {
      if (info.memory) memoryUsage.value = Math.round(info.memory.used / 1024 / 1024)
      if (info.cpu) cpuUsage.value = Math.round(info.cpu.usage)
    }).catch(() => {
      // 如果获取失败，保持模拟数据
    })
  }
}

// 更新网络状态
const updateNetworkStatus = () => {
  const nav = getNavigator()
  if (nav) {
    networkStatus.value = nav.onLine ? 'online' : 'offline'
  }
}

// 模拟连接状态变化
const simulateConnectionStatus = () => {
  const statuses: ('connected' | 'connecting' | 'disconnected')[] = ['connected', 'disconnected', 'connecting']
  const servers = ['192.168.1.100', '10.0.0.50', 'prod-server-01', null]
  
  setTimeout(() => {
    connectionStatus.value = statuses[Math.floor(Math.random() * statuses.length)]
    currentServer.value = servers[Math.floor(Math.random() * servers.length)]
  }, 3000)
}

// 显示临时消息
const showMessage = (message: string, duration: number = 3000) => {
  currentMessage.value = message
  setTimeout(() => {
    currentMessage.value = ''
  }, duration)
}

onMounted(() => {
  // 初始化系统信息
  updateSystemInfo()
  updateNetworkStatus()
  simulateConnectionStatus()
  
  // 启动定时器
  systemTimer = setInterval(updateSystemInfo, 10000) // 每10秒更新一次
  
  // 监听网络状态变化
  const win = getWindow()
  if (win) {
    win.addEventListener('online', updateNetworkStatus)
    win.addEventListener('offline', updateNetworkStatus)
  }
  
  // 监听来自主进程的状态更新
  if (win?.electronAPI) {
    win.electronAPI.onStatusUpdate((status: any) => {
      if (status.connection) connectionStatus.value = status.connection
      if (status.server) currentServer.value = status.server
      if (status.message) showMessage(status.message)
      if (status.errors !== undefined) errors.value = status.errors
      if (status.warnings !== undefined) warnings.value = status.warnings
      if (status.line !== undefined) currentLine.value = status.line
      if (status.column !== undefined) currentColumn.value = status.column
      if (status.language) currentLanguage.value = status.language
    })
  }
  
  // 初始化一些示例数据
  setTimeout(() => {
    currentServer.value = '192.168.1.100'
    connectionStatus.value = 'connected'
    errors.value = 0
    warnings.value = 2
    currentLine.value = 42
    currentColumn.value = 15
  }, 2000)
})

onUnmounted(() => {
  // 清理定时器
  if (systemTimer) clearInterval(systemTimer)
  
  // 清理事件监听器
  const win = getWindow()
  if (win) {
    win.removeEventListener('online', updateNetworkStatus)
    win.removeEventListener('offline', updateNetworkStatus)
  }
})

// 暴露给父组件的方法
defineExpose({
  showMessage,
  updateConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected', server?: string) => {
    connectionStatus.value = status
    if (server !== undefined) currentServer.value = server
  },
  updateCursorPosition: (line: number, column: number) => {
    currentLine.value = line
    currentColumn.value = column
  },
  updateProblems: (errorCount: number, warningCount: number) => {
    errors.value = errorCount
    warnings.value = warningCount
  }
})
</script>

<style scoped>
.vscode-statusbar {
  font-family: 'Segoe UI', 'Consolas', monospace;
  font-size: 12px;
  user-select: none;
  border-top: 1px solid var(--vscode-border);
  background-color: var(--vscode-bg-light) !important;
  color: var(--vscode-fg);
}

.statusbar-item {
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  min-height: 22px;
  border-right: 1px solid transparent;
}

.statusbar-item:hover {
  background-color: var(--vscode-bg-lighter);
}

.statusbar-item:active {
  background-color: var(--vscode-bg-lighter);
}

/* 状态指示器动画 */
.w-2.h-2 {
  transition: all 0.3s ease;
}

/* 连接状态特殊样式 */
.animate-pulse {
  animation: vscode-pulse 1.5s infinite;
}

@keyframes vscode-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* SVG 图标样式 */
.statusbar-item svg {
  flex-shrink: 0;
}

/* 错误和警告颜色 */
.text-red-400 {
  color: var(--vscode-error);
}

.text-yellow-400 {
  color: var(--vscode-warning);
}

.text-green-400 {
  color: var(--vscode-success);
}

/* 暗色文本 */
.text-vscode-statusbar-text-dim {
  color: var(--vscode-fg);
  opacity: 0.7;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .statusbar-item {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  
  .statusbar-item span {
    font-size: 11px;
  }
}

@media (max-width: 800px) {
  .statusbar-item:not(.statusbar-item:first-child):not(.statusbar-item:last-child) {
    display: none;
  }
}
</style>
