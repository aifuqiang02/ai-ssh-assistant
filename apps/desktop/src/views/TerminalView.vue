<template>
  <div class="terminal-view">
    <!-- 终端头部信息 -->
    <div class="terminal-header">
      <div class="connection-info">
        <span class="connection-name">{{ actualConnectionName }}</span>
        <span
          v-if="connectionStatus === 'connected'"
          class="status-badge connected clickable"
          title="点击断开连接"
          @click="handleConnectionStatusClick"
        >
          <i class="bi bi-circle-fill"></i> 已连接
        </span>
        <span
          v-else-if="connectionStatus === 'connecting'"
          class="status-badge connecting disabled"
        >
          <i class="bi bi-circle-fill"></i> 连接中...
        </span>
        <span
          v-else
          class="status-badge disconnected clickable"
          title="点击重新连接"
          @click="handleConnectionStatusClick"
        >
          <i class="bi bi-circle-fill"></i> 已断开
        </span>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="showContextMenu"
      ref="contextMenuRef"
      class="context-menu"
      :style="contextMenuStyle"
      @click="handleContextMenuClick"
    >
      <div class="context-menu-item" @click="handleCopy">
        <i class="bi bi-clipboard"></i>
        <span>复制</span>
      </div>
      <div class="context-menu-item" @click="handlePaste">
        <i class="bi bi-clipboard-check"></i>
        <span>粘贴</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" @click="handleOpenInFolder">
        <i class="bi bi-folder2-open"></i>
        <span>文件管理</span>
      </div>
      <div v-if="hasSelection" class="context-menu-item" @click="handleOpenLocalEdit">
        <i class="bi bi-pencil-square"></i>
        <span>本地编辑</span>
      </div>
      <div class="context-menu-divider"></div>
      <div v-if="hasSelection" class="context-menu-item" @click="handleAddShortcutCommand">
        <i class="bi bi-lightning-charge"></i>
        <span>收藏为快捷命令</span>
      </div>
      <div
        class="context-menu-item has-submenu"
        @mouseenter="showShortcutSubmenu = true"
        @mouseleave="showShortcutSubmenu = false"
      >
        <i class="bi bi-lightning"></i>
        <span>快捷命令</span>
        <i class="bi bi-chevron-right submenu-arrow"></i>

        <div v-if="showShortcutSubmenu" class="context-submenu" @click.stop>
          <template v-if="shortcutCommands.length > 0">
            <div
              v-for="shortcut in shortcutCommands"
              :key="shortcut.id"
              class="context-menu-item submenu-item"
              :title="shortcut.command"
              @click="handleRunShortcutFromMenu(shortcut.id, shortcut.command)"
            >
              <i class="bi bi-terminal"></i>
              <span class="submenu-item-label">{{ shortcut.command }}</span>
            </div>
            <div class="context-menu-divider"></div>
          </template>
          <div v-else class="context-menu-item submenu-item empty">
            <i class="bi bi-inbox"></i>
            <span class="submenu-item-label">暂无快捷命令</span>
          </div>
          <div class="context-menu-item submenu-item manage" @click="handleShowShortcutCommands">
            <i class="bi bi-gear"></i>
            <span class="submenu-item-label">管理快捷命令</span>
          </div>
        </div>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" @click="handleClear">
        <i class="bi bi-trash"></i>
        <span>清屏</span>
      </div>
    </div>

    <!-- 自动补全弹窗 -->
    <AutocompletePopup
      ref="autocompletePopupRef"
      :suggestions="autocompleteSuggestions"
      :visible="autocompleteVisible"
      :position="autocompletePosition"
      @select="handleAutocompleteSelect"
      @close="handleAutocompleteClose"
    />

    <!-- 快捷命令管理弹窗 -->
    <ShortcutCommandsModal
      :visible="showShortcutCommands"
      :connection-id="hostIdentifier"
      @close="showShortcutCommands = false"
      @use-command="handleUseShortcutCommand"
    />

    <!-- 服务器环境文档编辑器模态框 -->
    <div
      v-if="showServerEnvDocEditor"
      class="modal-overlay"
      @click.self="showServerEnvDocEditor = false"
    >
      <div class="modal-content server-env-doc-modal">
        <ServerEnvDocEditor
          v-if="serverEnvDocId"
          :connection-id="serverEnvDocId"
          :connection-info="connectionInfoForDoc"
          @close="showServerEnvDocEditor = false"
        />
      </div>
    </div>

    <!-- 主内容区域：终端 + AI 助手面板 -->
    <div class="terminal-main">
      <!-- 终端容器 -->
      <div
        ref="terminalContainer"
        class="terminal-container"
        :class="{ 'with-ai-panel': showAIAssistant && !isAIAssistantMinimized }"
      ></div>

      <!-- AI助手面板 -->
      <div v-if="!isAIAssistantMinimized" class="ai-assistant-panel">
        <div class="ai-panel-header" title="收起AI助手">
          <h3 class="ai-panel-title">AI 助手</h3>
          <div class="ai-panel-header-actions">
            <button class="btn-icon" title="收起AI助手" @click="minimizeAIAssistant">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <AIChatOpenCodeStyle
          :current-provider="currentProvider"
          :current-model="currentModel"
          :connection-id="currentConnectionId"
          :session-id="terminalSessionId"
          :server-env-doc-id="serverEnvDocId"
          :show-server-env-button="!!serverEnvDocId && connectionStatus === 'connected'"
          @open-server-env-doc="showServerEnvDocEditor = true"
        />
      </div>

      <button
        v-else
        class="ai-assistant-floating-toggle"
        title="展开AI助手"
        @click="expandAIAssistant"
      >
        <span class="ai-floating-toggle-label">AI 助手</span>
        <i class="bi bi-chevron-left"></i>
      </button>
    </div>

    <div class="terminal-status-bar">
      <div class="terminal-status-left">
        <span class="status-pill" :class="remoteEditStatusClass">
          <i class="bi bi-pencil-square"></i>
          <span>{{ remoteEditStatusText }}</span>
        </span>
        <span v-if="remoteEditStatusTime" class="status-time">{{ remoteEditStatusTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
  watch,
  computed,
  nextTick,
  inject
} from 'vue'
import { useRoute } from 'vue-router'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'
import { sshService } from '@/services/ssh.service'
import { settingsService } from '@/services/settings.service'
import { resolveSelectedModel } from '@/services/selected-model-resolver.service'
import { findNode } from '@/utils/tree-utils'
import AutocompletePopup from '@/components/terminal/AutocompletePopup.vue'
import ShortcutCommandsModal from '@/components/terminal/ShortcutCommandsModal.vue'
import ServerEnvDocEditor from '@/components/docs/ServerEnvDocEditor.vue'
import AIChatOpenCodeStyle from '@/components/chat/AIChatOpenCodeStyle.vue'
import { useTerminalAutocomplete } from '@/composables/useTerminalAutocomplete'
import { registerModelSelectionSyncListeners } from '@/utils/model-sync-events'
import { shortcutCommandService, type ShortcutCommand } from '@/services/shortcut-command.service'
import { $alert, $confirm } from '@/composables/useDialog'
import { docStorageService } from '@/services/doc-storage.service'
import type { Suggestion } from '@/types/autocomplete'
import type { AIProvider, AIModel } from '@/types/ai-providers'

// Props
const props = defineProps<{
  connectionId?: string
  connectionName?: string
}>()

// Inject
const openNewTab =
  inject<(id: string, name: string, icon: string, path: string) => void>('openNewTab')

// 路由
const route = useRoute()
const routeSnapshot = ref({
  connectionId: route.query.connectionId as string | undefined,
  name: route.query.name as string | undefined,
  nodeId: route.query.nodeId as string | undefined
})

const syncRouteSnapshot = () => {
  if (!props.connectionId) {
    routeSnapshot.value = {
      connectionId: route.query.connectionId as string | undefined,
      name: route.query.name as string | undefined,
      nodeId: route.query.nodeId as string | undefined
    }
  }
}

// SSH 树数据
const sshTree = ref<any[]>([])

// 加载 SSH 树
const loadSSHTree = async () => {
  try {
    sshTree.value = await sshService.getSSHTree()
  } catch (err) {
    console.error('加载 SSH 树失败:', err)
  }
}

// 从 URL 参数获取连接信息
const actualConnectionId = computed(() => {
  return props.connectionId || routeSnapshot.value.connectionId || ''
})

const actualConnectionName = computed(() => {
  return props.connectionName || decodeURIComponent(routeSnapshot.value.name || '终端')
})

// 从 URL 获取节点 ID
const nodeId = computed(() => {
  return routeSnapshot.value.nodeId || ''
})

// 从 SSH 树获取节点配置
const getNodeConfig = () => {
  if (!nodeId.value) return null
  const node = findNode(nodeId.value, sshTree.value)
  if (!node || node.type !== 'connection') return null

  return {
    id: node.id,
    name: node.name,
    host: node.host,
    port: node.port || 22,
    username: node.username,
    authType: node.authType,
    password: node.password,
    privateKey: node.privateKey,
    passphrase: node.passphrase
  }
}

// 连接信息（用于文档编辑器）
const connectionInfoForDoc = computed(() => {
  const config = getNodeConfig()
  if (!config) return undefined

  return {
    name: config.name,
    host: config.host,
    port: config.port || 22,
    username: config.username
  }
})

// Refs
const terminalContainer = ref<HTMLElement | null>(null)
const terminal = ref<Terminal | null>(null)
const fitAddon = ref<FitAddon | null>(null)
const webLinksAddon = ref<WebLinksAddon | null>(null)
const connectionStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected')
const autoReconnectAttempts = ref(0)
const outputListener = ref<(() => void) | null>(null)
const statusListener = ref<(() => void) | null>(null)
const currentConnectionId = ref<string>('') // 当前活动的运行时 SSH 连接ID
const terminalDataDisposable = ref<any>(null) // 保存 terminal.onData 的 disposable 引用
const terminalSessionId = ref<string>('terminal-' + Date.now()) // 终端会话ID
const showAIAssistant = ref(true) // AI助手面板显示状态
const isAIAssistantMinimized = ref(false)
const showServerEnvDocEditor = ref(false) // 服务器环境文档编辑器显示状态
const currentProvider = ref<any>(null) // 当前 AI provider
const currentModel = ref<any>(null) // 当前 AI model
let unregisterModelSyncListeners: (() => void) | null = null
const serverEnvDocId = computed(() => nodeId.value || '') // 服务器环境文档 ID：只使用稳定的配置节点 ID

// 右键菜单状态
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextMenuRef = ref<HTMLElement | null>(null)
const CONTEXT_MENU_MARGIN = 12
const contextMenuStyle = computed(() => ({
  top: `${contextMenuY.value}px`,
  left: `${contextMenuX.value}px`
}))
const hasSelection = computed(() => {
  return terminal.value?.hasSelection() || false
})

interface RemoteEditSession {
  sessionKey: string
  connectionId: string
  remotePath: string
  localPath: string
  lastUploadedContent: string
  isUploading: boolean
  intervalId: number
}

const remoteEditSessions = new Map<string, RemoteEditSession>()
const REMOTE_EDIT_POLL_MS = 1200
const remoteEditStatus = ref<'idle' | 'active' | 'syncing' | 'synced' | 'error'>('idle')
const remoteEditStatusText = ref('本地编辑: 未开启')
const remoteEditStatusTime = ref('')

// 快捷命令状态
const showShortcutCommands = ref(false)
const showShortcutSubmenu = ref(false)
const autoReconnectTimer = ref<number | null>(null)
const suppressAutoReconnect = ref(false)
const maxAutoReconnectAttempts = 3

// 生成主机唯一标识（用于快捷命令等需要持久化的功能）
// 格式: {username}@{host}:{port}
const hostIdentifier = computed(() => {
  const config = getNodeConfig()
  if (!config) return undefined

  return `${config.username}@${config.host}:${config.port || 22}`
})

const shortcutCommands = computed<ShortcutCommand[]>(() => {
  const commands = shortcutCommandService.getByUsageFrequency(hostIdentifier.value)
  return commands.slice(0, 8)
})

const remoteEditStatusClass = computed(() => ({
  active: remoteEditStatus.value === 'active',
  syncing: remoteEditStatus.value === 'syncing',
  synced: remoteEditStatus.value === 'synced',
  error: remoteEditStatus.value === 'error'
}))

// 自动补全相关
const autocompletePopupRef = ref<InstanceType<typeof AutocompletePopup> | null>(null)
const {
  suggestions: autocompleteSuggestions,
  popupVisible: autocompleteVisible,
  popupPosition: autocompletePosition,
  setPopupRef,
  selectSuggestion: selectAutocompleteSuggestion,
  hidePopup: hideAutocompletePopup,
  setupTerminalListener: setupAutocompleteListener
} = useTerminalAutocomplete(terminal, terminalContainer, currentConnectionId)

// 初始化终端
const initTerminal = () => {
  if (!terminalContainer.value) {
    console.error('[Terminal Init] Terminal container not found')
    return
  }

  // 创建终端实例
  terminal.value = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Consolas, "Courier New", monospace',
    convertEol: false, // 禁用自动换行符转换，避免重复换行
    theme: {
      background: '#1e1e1e',
      foreground: '#cccccc',
      cursor: '#ffffff',
      black: '#000000',
      red: '#cd3131',
      green: '#0dbc79',
      yellow: '#e5e510',
      blue: '#2472c8',
      magenta: '#bc3fbc',
      cyan: '#11a8cd',
      white: '#e5e5e5',
      brightBlack: '#666666',
      brightRed: '#f14c4c',
      brightGreen: '#23d18b',
      brightYellow: '#f5f543',
      brightBlue: '#3b8eea',
      brightMagenta: '#d670d6',
      brightCyan: '#29b8db',
      brightWhite: '#ffffff'
    },
    allowProposedApi: true
  })

  // 添加插件
  fitAddon.value = new FitAddon()
  webLinksAddon.value = new WebLinksAddon()
  terminal.value.loadAddon(fitAddon.value)
  terminal.value.loadAddon(webLinksAddon.value)

  // 挂载到 DOM
  terminal.value.open(terminalContainer.value)
  fitAddon.value.fit()

  // 清理旧的监听器（如果存在）
  if (terminalDataDisposable.value) {
    terminalDataDisposable.value.dispose()
    terminalDataDisposable.value = null
  }

  // 监听终端输入
  terminalDataDisposable.value = terminal.value.onData(data => {
    const connId = currentConnectionId.value
    if (connId && window.electronAPI) {
      // 直接写入终端输入（不添加换行符，不等待响应）
      window.electronAPI.ssh.write(connId, data).catch((err: any) => {
        console.error('Failed to send input:', err)
      })
    }
  })

  // 在捕获阶段拦截右键鼠标事件，避免 vim/xterm 将右键识别成可视选择
  terminalContainer.value.addEventListener('mousedown', handleTerminalRightMouseDown, true)
  terminalContainer.value.addEventListener('mouseup', handleTerminalRightMouseDown, true)
  terminalContainer.value.addEventListener('contextmenu', handleTerminalContextMenu)

  // 点击其他地方关闭菜单
  document.addEventListener('click', () => {
    showContextMenu.value = false
    showShortcutSubmenu.value = false
  })

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  // 设置自动补全监听器
  setupAutocompleteListener()
}

// 处理窗口大小变化
const handleResize = () => {
  if (fitAddon.value && terminal.value) {
    fitAddon.value.fit()

    // 如果已连接，同时调整 SSH 终端尺寸
    const connId = currentConnectionId.value
    if (connId && window.electronAPI && connectionStatus.value === 'connected') {
      const dims = fitAddon.value.proposeDimensions()
      if (dims && dims.cols && dims.rows) {
        // 调用 SSH 服务调整远程终端尺寸
        window.electronAPI.ssh.resize(connId, dims.cols, dims.rows).catch(err => {
          console.warn('Failed to resize SSH terminal:', err)
        })
      }
    }
  }
}

const handleTerminalRightMouseDown = (e: MouseEvent) => {
  if (e.button !== 2) return

  // 在捕获阶段拦截右键，避免 xterm/vim 收到鼠标事件后切到 visual 模式
  e.preventDefault()
  e.stopPropagation()
}

const handleTerminalContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  void positionContextMenu(e.clientX, e.clientY)
}

// 清理旧的监听器
const cleanupListeners = () => {
  if (outputListener.value) {
    outputListener.value()
    outputListener.value = null
  }
  if (statusListener.value) {
    statusListener.value()
    statusListener.value = null
  }
}

const clearAutoReconnectTimer = () => {
  if (autoReconnectTimer.value !== null) {
    window.clearTimeout(autoReconnectTimer.value)
    autoReconnectTimer.value = null
  }
}

const scheduleAutoReconnect = async () => {
  if (suppressAutoReconnect.value) {
    return
  }

  if (autoReconnectAttempts.value >= maxAutoReconnectAttempts) {
    connectionStatus.value = 'disconnected'
    return
  }

  clearAutoReconnectTimer()
  autoReconnectAttempts.value += 1
  connectionStatus.value = 'connecting'

  const delay = Math.min(1000 * autoReconnectAttempts.value, 3000)
  autoReconnectTimer.value = window.setTimeout(async () => {
    await handleReconnect({ silent: true })
  }, delay)
}

const positionContextMenu = async (clientX: number, clientY: number) => {
  contextMenuX.value = clientX
  contextMenuY.value = clientY
  showContextMenu.value = true

  await nextTick()

  const menu = contextMenuRef.value
  if (!menu) return

  const rect = menu.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let nextX = clientX
  let nextY = clientY

  if (nextX + rect.width + CONTEXT_MENU_MARGIN > viewportWidth) {
    nextX = Math.max(CONTEXT_MENU_MARGIN, viewportWidth - rect.width - CONTEXT_MENU_MARGIN)
  }

  if (nextY + rect.height + CONTEXT_MENU_MARGIN > viewportHeight) {
    nextY = Math.max(CONTEXT_MENU_MARGIN, clientY - rect.height)
  }

  if (nextY < CONTEXT_MENU_MARGIN) {
    nextY = CONTEXT_MENU_MARGIN
  }

  contextMenuX.value = nextX
  contextMenuY.value = nextY
}

const closeContextMenu = () => {
  showContextMenu.value = false
  showShortcutSubmenu.value = false
}

const focusTerminal = () => {
  nextTick(() => {
    terminal.value?.focus()
  })
}

const formatStatusTime = (date = new Date()) => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const setRemoteEditStatus = (
  status: 'idle' | 'active' | 'syncing' | 'synced' | 'error',
  text: string,
  withTime = true
) => {
  remoteEditStatus.value = status
  remoteEditStatusText.value = text
  remoteEditStatusTime.value = withTime ? formatStatusTime() : ''
}

const normalizeTerminalSelection = (selection: string) => {
  return selection
    .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
    .replace(/\x1B\][^\x07]*\x07/g, '')
    .replace(/\r/g, '')
    .trim()
}

const sanitizeRemoteSelectionToPath = (selection: string) => {
  const normalized = normalizeTerminalSelection(selection)
  if (!normalized) return ''

  const lines = normalized
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  if (lines.length !== 1) {
    return ''
  }

  return lines[0]
}

const normalizePosixPath = (inputPath: string) => {
  const segments = inputPath.split('/')
  const normalizedSegments: string[] = []

  for (const segment of segments) {
    if (!segment || segment === '.') {
      continue
    }

    if (segment === '..') {
      normalizedSegments.pop()
      continue
    }

    normalizedSegments.push(segment)
  }

  return `/${normalizedSegments.join('/')}`
}

const resolveRemotePath = (currentDir: string, selection: string) => {
  if (selection.startsWith('/')) {
    return normalizePosixPath(selection)
  }

  if (selection.startsWith('~/')) {
    return ''
  }

  return normalizePosixPath(`${currentDir}/${selection}`)
}

const escapeShellSingleQuotes = (value: string) => {
  return value.replace(/'/g, `'\\''`)
}

const getCleanedCurrentDirectory = async () => {
  if (!currentConnectionId.value || !window.electronAPI) {
    throw new Error('连接不可用')
  }

  const result = await window.electronAPI.ssh.getCurrentDirectory(currentConnectionId.value)
  if (!result.success) {
    throw new Error('获取当前目录失败，请确保已连接到服务器')
  }

  let currentDir = result.output?.trim() || ''

  currentDir = currentDir
    .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
    .replace(/\x1B\][^\x07]*\x07/g, '')
    .replace(/\x1B[=>]/g, '')
    .replace(/\x1B\[[?!][0-9;]*[a-zA-Z]/g, '')
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

  const lines: string[] = currentDir
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)

  if (lines.length > 0) {
    for (const line of lines) {
      const posixPathMatch = line.match(/(?:~|\/)[^\s]*/)
      if (!posixPathMatch) {
        continue
      }

      const normalizedPath = posixPathMatch[0].startsWith('~')
        ? ''
        : normalizePosixPath(posixPathMatch[0])

      if (normalizedPath.startsWith('/')) {
        currentDir = normalizedPath
        break
      }
    }
  }

  if (!currentDir.startsWith('/')) {
    throw new Error(`获取到的路径格式无效: ${currentDir}`)
  }

  return currentDir
}

const getRemoteEditBaseDirectory = async () => {
  const userDataDir = await window.electronAPI.getPath('userData')
  const scopeId = serverEnvDocId.value || nodeId.value || currentConnectionId.value || 'default'
  return `${userDataDir}\\remote-edit\\${scopeId}`
}

const buildLocalMirrorPath = async (remotePath: string) => {
  const baseDir = await getRemoteEditBaseDirectory()
  const remoteSegments = remotePath.split('/').filter(Boolean)
  const safeSegments = remoteSegments.map(
    segment => segment.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || '_'
  )
  const folderSegments = safeSegments.slice(0, -1)
  const fileName = safeSegments[safeSegments.length - 1] || 'remote-file.txt'
  const targetDir = folderSegments.length > 0 ? `${baseDir}\\${folderSegments.join('\\')}` : baseDir

  await window.electronAPI.fs.createDirectory(targetDir)
  return `${targetDir}\\${fileName}`
}

const stopRemoteEditSession = (sessionKey: string) => {
  const session = remoteEditSessions.get(sessionKey)
  if (!session) return

  window.clearInterval(session.intervalId)
  remoteEditSessions.delete(sessionKey)
}

const stopAllRemoteEditSessions = () => {
  for (const sessionKey of remoteEditSessions.keys()) {
    stopRemoteEditSession(sessionKey)
  }

  if (remoteEditSessions.size === 0) {
    setRemoteEditStatus('idle', '本地编辑: 未开启', false)
  }
}

const startRemoteEditSync = async (
  sessionKey: string,
  remotePath: string,
  localPath: string,
  initialContent: string
) => {
  stopRemoteEditSession(sessionKey)

  const session: RemoteEditSession = {
    sessionKey,
    connectionId: currentConnectionId.value,
    remotePath,
    localPath,
    lastUploadedContent: initialContent,
    isUploading: false,
    intervalId: 0
  }

  session.intervalId = window.setInterval(async () => {
    if (!window.electronAPI || !currentConnectionId.value) {
      return
    }

    if (session.isUploading || currentConnectionId.value !== session.connectionId) {
      return
    }

    try {
      const exists = await window.electronAPI.fs.exists(session.localPath)
      if (!exists) {
        return
      }

      const currentContent = await window.electronAPI.fs.readFile(session.localPath)
      if (currentContent === session.lastUploadedContent) {
        return
      }

      session.isUploading = true
      setRemoteEditStatus(
        'syncing',
        `本地编辑: 正在同步 ${session.remotePath.split('/').pop() || '文件'}`
      )
      await window.electronAPI.ssh.uploadFile(
        session.connectionId,
        session.localPath,
        session.remotePath
      )
      session.lastUploadedContent = currentContent
      setRemoteEditStatus(
        'synced',
        `本地编辑: 已同步 ${session.remotePath.split('/').pop() || '文件'}`
      )
    } catch (err) {
      setRemoteEditStatus(
        'error',
        `本地编辑: 同步失败 ${session.remotePath.split('/').pop() || '文件'}`
      )
      console.error('[RemoteEdit] 自动同步失败:', err)
    } finally {
      session.isUploading = false
    }
  }, REMOTE_EDIT_POLL_MS)

  remoteEditSessions.set(sessionKey, session)
}

// 确保服务器环境文档存在（暂未实现）
const ensureServerEnvDoc = () => {
  // TODO: 实现服务器环境文档自动生成功能
}

// 建立 SSH 连接
const connectToSSH = async () => {
  const connId = currentConnectionId.value
  if (!connId || !terminal.value) return

  // 清理旧的监听器
  cleanupListeners()

  connectionStatus.value = 'connecting'

  try {
    // 监听 SSH 输出
    if (window.electronAPI) {
      // 注册输出监听器并保存清理函数
      outputListener.value = window.electronAPI.on(`ssh:output:${connId}`, (data: string) => {
        terminal.value?.write(data)
      })

      // 连接状态变化监听（用于处理重连等情况）
      statusListener.value = window.electronAPI.onConnectionStatusChange(async ({ id, status }) => {
        if (id === connId) {
          if (status === 'connected') {
            clearAutoReconnectTimer()
            autoReconnectAttempts.value = 0
            suppressAutoReconnect.value = false
            connectionStatus.value = 'connected'
            ensureServerEnvDoc()
          } else if (status === 'disconnected') {
            connectionStatus.value = 'disconnected'
            await scheduleAutoReconnect()
          }
        }
      })

      // 直接设置为已连接状态
      clearAutoReconnectTimer()
      autoReconnectAttempts.value = 0
      suppressAutoReconnect.value = false
      connectionStatus.value = 'connected'
      ensureServerEnvDoc()

      // 初次连接时立即同步一次终端尺寸，避免 vim 等全屏程序只占半屏
      nextTick(() => {
        try {
          handleResize()
        } catch (err) {
          console.warn('Failed to sync terminal size after connect:', err)
        }
      })

      // 立即获取并显示初始输出（不依赖状态变化事件）
      setTimeout(async () => {
        if (window.electronAPI && terminal.value) {
          try {
            const initialOutput = await window.electronAPI.ssh.getInitialOutput(connId)
            if (initialOutput) {
              terminal.value.write(initialOutput)
            }
            // 连接成功后聚焦到终端并再同步一次尺寸，确保远端收到 SIGWINCH
            terminal.value?.focus()
            handleResize()
          } catch (err) {
            console.error('Failed to get initial output:', err)
          }
        }
      }, 150)
    }
  } catch (err: any) {
    connectionStatus.value = 'disconnected'
    terminal.value?.writeln(`连接失败: ${err.message}\r\n`)
  }
}

// 重新连接
const handleReconnect = async (options: { silent?: boolean } = {}) => {
  const { silent = false } = options

  if (connectionStatus.value === 'connected') {
    // 如果已连接，不执行任何操作
    return
  }

  clearAutoReconnectTimer()
  suppressAutoReconnect.value = true

  // 先断开旧连接（如果存在）
  if (currentConnectionId.value && window.electronAPI) {
    try {
      await window.electronAPI.ssh.disconnect(currentConnectionId.value)
    } catch (err) {
      console.warn('Failed to disconnect:', err)
    }
  }

  // 清理监听器
  cleanupListeners()

  // 获取节点配置
  const config = getNodeConfig()

  if (config && window.electronAPI) {
    if (!silent) {
      terminal.value?.clear()
    }
    connectionStatus.value = 'connecting'

    try {
      const settings = await settingsService.getSettings()
      const result = await window.electronAPI.ssh.connect({
        ...config,
        timeout: settings?.ssh?.timeout || 10,
        keepAlive: settings?.ssh?.keepAlive !== false,
        keepAliveInterval: settings?.ssh?.keepAliveInterval ?? 15
      })

      if (result && result.status === 'connected') {
        // 更新当前连接ID
        currentConnectionId.value = result.id
        suppressAutoReconnect.value = false
        connectToSSH()
      } else {
        connectionStatus.value = 'disconnected'
        suppressAutoReconnect.value = false
        if (!silent) {
          terminal.value?.writeln(`重连失败: ${result?.message || '未知错误'}\r\n`)
        } else {
          await scheduleAutoReconnect()
        }
      }
    } catch (err: any) {
      connectionStatus.value = 'disconnected'
      suppressAutoReconnect.value = false
      if (!silent) {
        terminal.value?.writeln(`重连失败: ${err.message}\r\n`)
      } else {
        await scheduleAutoReconnect()
      }
    }
  } else {
    // 没有配置，提示用户
    if (!silent) {
      terminal.value?.clear()
      terminal.value?.writeln('无法获取连接配置，请从侧边栏重新点击连接\r\n')
    }
    suppressAutoReconnect.value = false
    connectionStatus.value = 'disconnected'
  }
}

const minimizeAIAssistant = () => {
  isAIAssistantMinimized.value = true
}

const expandAIAssistant = () => {
  isAIAssistantMinimized.value = false
}

const handleConnectionStatusClick = async () => {
  if (connectionStatus.value === 'connected') {
    await handleDisconnect()
    return
  }

  if (connectionStatus.value === 'disconnected') {
    await handleReconnect()
  }
}

// 断开连接
const handleDisconnect = async () => {
  if (connectionStatus.value !== 'connected') {
    // 如果未连接，不执行任何操作
    return
  }

  suppressAutoReconnect.value = true
  clearAutoReconnectTimer()
  autoReconnectAttempts.value = 0

  if (currentConnectionId.value && window.electronAPI) {
    try {
      await window.electronAPI.ssh.disconnect(currentConnectionId.value)
      cleanupListeners()
      connectionStatus.value = 'disconnected'
    } catch (err: any) {
      console.error('Disconnect error:', err)
    }
  }
}

// 右键菜单处理
const handleContextMenuClick = (e: Event) => {
  e.stopPropagation()
}

const handleCopy = async () => {
  const selection = terminal.value?.getSelection()
  if (selection) {
    try {
      await navigator.clipboard.writeText(selection)
      closeContextMenu()

      // 复制后重新聚焦到终端
      focusTerminal()
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text && currentConnectionId.value && window.electronAPI) {
      // 使用 write 而不是 execute，避免添加完成标记
      await window.electronAPI.ssh.write(currentConnectionId.value, text)
    }
    closeContextMenu()

    // 粘贴后重新聚焦到终端
    focusTerminal()
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

const handleClear = () => {
  terminal.value?.clear()
  closeContextMenu()

  // 清屏后重新聚焦到终端
  focusTerminal()
}

// 收藏为快捷命令
const handleAddShortcutCommand = () => {
  const selection = terminal.value?.getSelection()
  if (!selection) {
    console.warn('[ShortcutCommand] 没有选中内容')
    closeContextMenu()
    return
  }

  try {
    // 清理命令（去除首尾空白和换行）
    const command = selection.trim()

    if (command.length === 0) {
      console.warn('[ShortcutCommand] 选中内容为空')
      closeContextMenu()
      return
    }

    // 添加快捷命令（关联到当前主机）
    shortcutCommandService.add(command, undefined, undefined, hostIdentifier.value)

    // TODO: 可以添加一个轻量级的 toast 提示

    closeContextMenu()

    // 重新聚焦到终端
    focusTerminal()
  } catch (err) {
    console.error('[ShortcutCommand] 收藏命令失败:', err)
    closeContextMenu()
  }
}

// 显示快捷命令管理
const handleShowShortcutCommands = () => {
  closeContextMenu()
  showShortcutCommands.value = true
}

// 使用快捷命令
const handleUseShortcutCommand = async (command: string) => {
  if (!currentConnectionId.value || !window.electronAPI) {
    console.error('[ShortcutCommand] 无法执行命令：连接ID不存在')
    return
  }

  try {
    // 写入命令并执行
    await window.electronAPI.ssh.write(currentConnectionId.value, command + '\r')

    // 重新聚焦到终端
    nextTick(() => {
      terminal.value?.focus()
    })
  } catch (err) {
    console.error('[ShortcutCommand] 执行命令失败:', err)
  }
}

const handleRunShortcutFromMenu = async (shortcutId: string, command: string) => {
  shortcutCommandService.recordUsage(shortcutId, hostIdentifier.value)
  showShortcutSubmenu.value = false
  await handleUseShortcutCommand(command)
}

const handleOpenLocalEdit = async () => {
  closeContextMenu()

  const selection = terminal.value?.getSelection() || ''
  const selectedPath = sanitizeRemoteSelectionToPath(selection)

  if (!selectedPath) {
    $alert('请只选中一个文件名或文件路径后再试')
    focusTerminal()
    return
  }

  if (!currentConnectionId.value || !window.electronAPI) {
    $alert('当前连接不可用，无法打开本地编辑')
    return
  }

  try {
    const currentDir = await getCleanedCurrentDirectory()
    const remotePath = resolveRemotePath(currentDir, selectedPath)

    if (!remotePath) {
      $alert('暂不支持使用 ~ 路径的本地编辑，请先切换到目标目录后再试')
      focusTerminal()
      return
    }

    const escapedRemotePath = escapeShellSingleQuotes(remotePath)
    const checkResult = await window.electronAPI.ssh.executeSilent(
      currentConnectionId.value,
      `test -f '${escapedRemotePath}' && printf '__FILE_OK__'`
    )

    if (!checkResult.success || !checkResult.output?.includes('__FILE_OK__')) {
      $alert(`未找到可编辑的远程文件:\n${remotePath}`)
      focusTerminal()
      return
    }

    const sessionKey = `${serverEnvDocId.value || currentConnectionId.value}:${remotePath}`
    const existingSession = remoteEditSessions.get(sessionKey)
    if (existingSession) {
      await window.electronAPI.fs.openPath(existingSession.localPath)
      setRemoteEditStatus('active', `本地编辑: 已打开 ${remotePath.split('/').pop() || '文件'}`)
      focusTerminal()
      return
    }

    const localPath = await buildLocalMirrorPath(remotePath)
    await window.electronAPI.ssh.downloadFile(currentConnectionId.value, remotePath, localPath)
    const initialContent = await window.electronAPI.fs.readFile(localPath)

    await startRemoteEditSync(sessionKey, remotePath, localPath, initialContent)
    await window.electronAPI.fs.openPath(localPath)
    setRemoteEditStatus('active', `本地编辑: 已打开 ${remotePath.split('/').pop() || '文件'}`)
    focusTerminal()
  } catch (err: any) {
    console.error('[RemoteEdit] 打开本地编辑失败:', err)
    $alert(`打开本地编辑失败: ${err.message || '未知错误'}`)
    focusTerminal()
  }
}

const handleOpenInFolder = async () => {
  closeContextMenu()

  if (!currentConnectionId.value || !window.electronAPI) {
    console.error('无法打开文件管理器：连接ID不存在或API不可用')
    return
  }

  try {
    const currentDir = await getCleanedCurrentDirectory()

    const config = getNodeConfig()
    if (!config) {
      console.error('无法获取连接配置')
      return
    }

    if (typeof openNewTab === 'function') {
      const fileManagerId = `file-manager-${currentConnectionId.value}-${Date.now()}`
      const fileManagerUrl = `/file-manager?connectionId=${currentConnectionId.value}&nodeId=${config.id}&name=${encodeURIComponent(actualConnectionName.value || config.name)}&host=${encodeURIComponent(config.host || '')}&port=${config.port || 22}&path=${encodeURIComponent(currentDir)}`

      openNewTab(
        fileManagerId,
        `${actualConnectionName.value} - ${currentDir}`,
        'bi bi-folder-open',
        fileManagerUrl
      )
    } else {
      console.warn('openNewTab 方法不可用，无法在新标签页中打开文件管理器')
      $alert(`当前目录: ${currentDir}\n\n提示：请从侧边栏的 SSH 连接上右键选择"文件管理"功能`)
    }

    focusTerminal()
  } catch (err: any) {
    $alert(`操作失败: ${err.message || '未知错误'}`)
  }
}

// 处理终端点击事件 - 确保焦点在终端上
const handleTerminalClick = () => {
  // 点击终端区域时,将焦点设置到终端
  nextTick(() => {
    terminal.value?.focus()
  })
}

/**
 * 处理自动补全选择
 */
const handleAutocompleteSelect = (suggestion: Suggestion) => {
  selectAutocompleteSuggestion(suggestion)
}

/**
 * 关闭自动补全
 */
const handleAutocompleteClose = () => {
  hideAutocompletePopup()
}

// 监听 connectionId 变化
// 注意：使用 KeepAlive 时，组件会被缓存，actualConnectionId 可能与 currentConnectionId 不同
// 这是正常的，因为 actualConnectionId 来自路由参数（标签创建时的 ID）
// 而 currentConnectionId 是实际的 SSH 连接 ID
// 我们不应该在这里重新连接，除非是真正的新连接
watch(
  () => actualConnectionId.value,
  newId => {
    // 如果已经初始化过，说明是切换回来的，不需要重新连接
    if (isInitialized.value && currentConnectionId.value) {
      return
    }

    // 只有在首次初始化时才建立连接
    if (newId && terminal.value && !currentConnectionId.value) {
      currentConnectionId.value = newId
      connectToSSH()
    }
  }
)

// 标记是否已初始化
const isInitialized = ref(false)

// 全局键盘事件处理 - 确保空格键等字符能正确输入到终端
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  // 检查焦点是否在 textarea 或 input 元素上
  const target = e.target as HTMLElement
  const tagName = target.tagName.toUpperCase()

  // 如果焦点在输入框、选择框或按钮上,不拦截
  if (
    tagName === 'TEXTAREA' ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'BUTTON'
  ) {
    return
  }

  // 检查是否在可编辑元素内
  if (target.isContentEditable) {
    return
  }

  // 如果是特殊键(Ctrl, Alt, Meta 组合键),不拦截
  if (e.ctrlKey || e.altKey || e.metaKey) {
    return
  }

  // 对于可打印字符(包括空格),确保终端获得焦点
  // 空格键的 key 值是 ' ' (一个空格字符)
  if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Tab') {
    // 在按键被处理之前,先聚焦终端
    // 这样 xterm.js 才能捕获键盘事件
    if (terminal.value && !terminal.value.textarea?.contains(document.activeElement)) {
      terminal.value.focus()
    }
  }
}

// 加载 AI 模型配置
const loadAIModelConfiguration = async () => {
  const settings = await settingsService.getSettings()

  const saved = localStorage.getItem('selectedAIModel')
  if (!saved) {
    currentProvider.value = null
    currentModel.value = null
    return
  }

  const resolved = resolveSelectedModel(saved, settings?.aiProviders || [])
  if (!resolved) {
    currentProvider.value = null
    currentModel.value = null
    return
  }

  if (resolved.source === 'official') {
    currentProvider.value = {
      id: 'official',
      name: '官方模型',
      description: '官方托管模型',
      icon: 'bi bi-stars',
      website: '',
      apiKey: '',
      endpoint: '',
      enabled: true,
      isDefault: false,
      models: [] as any,
      config: {
        runtimeProviderId: 'official',
        managedByApp: true
      }
    } as any
    currentModel.value = {
      id: resolved.modelId,
      name: resolved.modelName,
      providerId: 'official',
      contextWindow: 0,
      capabilities: {
        text: true,
        image: false,
        functionCall: false,
        vision: false
      }
    } as any
    return
  }

  currentProvider.value = resolved.provider as any
  currentModel.value = resolved.model as any
}

// 监听模型切换事件
const handleModelChanged = () => {
  loadAIModelConfiguration()
}

// 监听设置更新事件
const handleSettingsUpdated = () => {
  loadAIModelConfiguration()
}

// 生命周期
onMounted(async () => {
  syncRouteSnapshot()

  // ✅ 加载 SSH 树
  await loadSSHTree()

  // 确保 DOM 已经渲染
  nextTick(() => {
    if (terminalContainer.value && !isInitialized.value) {
      initTerminal()
      isInitialized.value = true
      if (actualConnectionId.value) {
        currentConnectionId.value = actualConnectionId.value
        connectToSSH()
      }
    } else {
      console.warn('Terminal container not found or already initialized')
    }
  })

  // 加载AI模型配置
  loadAIModelConfiguration()

  // 监听模型切换和设置更新事件
  unregisterModelSyncListeners = registerModelSelectionSyncListeners(window, handleModelChanged)

  // 添加全局键盘事件监听 (使用 capture 阶段,更早捕获事件)
  document.addEventListener('keydown', handleGlobalKeyDown, true)

  // 设置自动补全 popup 引用
  nextTick(() => {
    if (autocompletePopupRef.value) {
      setPopupRef(autocompletePopupRef.value)
    }
  })
})

// 当组件被 KeepAlive 激活时
onActivated(() => {
  // 重新调整终端大小以适应容器
  if (terminal.value && fitAddon.value) {
    nextTick(() => {
      try {
        fitAddon.value?.fit()
        // 激活时聚焦到终端
        terminal.value?.focus()
      } catch (err) {
        console.warn('Failed to fit terminal on activation:', err)
      }
    })
  }
})

// 当组件被 KeepAlive 停用时
onDeactivated(() => {
  // 组件被隐藏时不需要特殊处理，保持连接和状态
})

onBeforeUnmount(() => {
  suppressAutoReconnect.value = true
  clearAutoReconnectTimer()

  // 移除窗口大小监听器
  window.removeEventListener('resize', handleResize)

  // 移除全局键盘事件监听
  document.removeEventListener('keydown', handleGlobalKeyDown, true)

  // 清理事件监听器
  unregisterModelSyncListeners?.()
  cleanupListeners()
  stopAllRemoteEditSessions()

  // 清理终端输入监听器
  if (terminalDataDisposable.value) {
    terminalDataDisposable.value.dispose()
    terminalDataDisposable.value = null
  }

  // 清理终端实例和 addons
  if (terminal.value) {
    try {
      // 先清理 addons
      if (fitAddon.value) {
        fitAddon.value = null
      }
      if (webLinksAddon.value) {
        webLinksAddon.value = null
      }

      // 再清理 terminal
      terminal.value.dispose()
      terminal.value = null
    } catch (err) {
      // 静默处理 dispose 错误，避免控制台警告
      // 这是 xterm.js addon 生命周期的已知问题
    }
  }

  // 断开 SSH 连接
  if (currentConnectionId.value && window.electronAPI) {
    window.electronAPI.ssh.disconnect(currentConnectionId.value).catch(console.error)
  }

  // 重置初始化标记
  isInitialized.value = false
})
</script>

<style scoped>
.terminal-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--vscode-bg);
}

.terminal-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.terminal-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  padding: 0 12px;
  border-top: 1px solid var(--vscode-border-subtle);
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg-muted);
  font-size: 12px;
}

.terminal-status-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--vscode-fg-muted);
}

.status-pill.active {
  color: #d7ba7d;
}

.status-pill.syncing {
  color: #4fc1ff;
}

.status-pill.synced {
  color: #23d18b;
}

.status-pill.error {
  color: #f48771;
}

.status-time {
  color: var(--vscode-fg-muted);
  white-space: nowrap;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--vscode-bg-lighter);
  border-bottom: 1px solid var(--vscode-border-subtle);
}

.connection-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.connection-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.clickable {
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.status-badge.clickable:hover {
  opacity: 0.85;
}

.status-badge.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.status-badge i {
  font-size: 8px;
}

.status-badge.connected {
  color: var(--vscode-editorGutter-addedBackground);
  background-color: rgba(var(--vscode-editorGutter-addedBackground-rgb, 22, 174, 96), 0.15);
  border: 1px solid var(--vscode-editorGutter-addedBackground);
}

.status-badge.connecting {
  color: var(--vscode-editorGutter-modifiedBackground);
  background-color: rgba(var(--vscode-editorGutter-modifiedBackground-rgb, 234, 179, 8), 0.15);
  border: 1px solid var(--vscode-editorGutter-modifiedBackground);
}

.status-badge.disconnected {
  color: var(--vscode-editorGutter-deletedBackground);
  background-color: rgba(var(--vscode-editorGutter-deletedBackground-rgb, 239, 68, 68), 0.15);
  border: 1px solid var(--vscode-editorGutter-deletedBackground);
}

.terminal-actions {
  display: flex;
  gap: 4px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.btn-icon:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-fg);
}

.btn-icon.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon.btn-disabled:hover {
  background-color: transparent;
}

.terminal-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.terminal-container {
  flex: 1;
  padding: 0 0;
  overflow: hidden;
  background-color: var(--vscode-terminal-background);
  transition: flex 0.3s ease;
}

.terminal-container.with-ai-panel {
  flex: 0.6;
}

/* AI 助手面板样式 */
.ai-assistant-panel {
  flex: 0.4;
  min-width: 0;
  min-height: 0;
  border-left: 1px solid var(--vscode-border);
  background-color: var(--vscode-bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ai-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--vscode-border);
}

.ai-panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.ai-panel-header-actions {
  display: flex;
  gap: 4px;
}

.ai-assistant-floating-toggle {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(230, 236, 244, 0.92) 100%);
  color: #111827;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.34);
  cursor: pointer;
  z-index: 3;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.ai-assistant-floating-toggle:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(241, 245, 249, 0.96) 100%);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.38);
}

.ai-floating-toggle-label {
  font-size: 13px;
  font-weight: 600;
}

/* 服务器环境文档编辑器模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.server-env-doc-modal {
  width: 90%;
  max-width: 1200px;
  height: 85%;
  background: var(--vscode-editor-background);
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background-color: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  min-width: 180px;
  max-width: min(240px, calc(100vw - 24px));
  padding: 4px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--vscode-fg);
  font-size: 0.875rem;
  border-radius: 6px;
  transition: all 0.15s ease;
  user-select: none;
}

.context-menu-item.has-submenu {
  position: relative;
  justify-content: space-between;
}

.submenu-arrow {
  margin-left: auto;
  width: auto;
  font-size: 12px;
}

.context-submenu {
  position: absolute;
  top: -4px;
  left: calc(100% - 6px);
  min-width: 220px;
  max-width: 320px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--vscode-border);
  background-color: var(--vscode-bg-light);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 10000;
}

.submenu-item {
  width: 100%;
}

.submenu-item-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.submenu-item.empty {
  cursor: default;
  color: var(--vscode-fg-muted);
}

.submenu-item.empty:hover {
  background: transparent;
  color: var(--vscode-fg-muted);
}

.context-menu-item:hover {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
}

.context-menu-item:hover i {
  color: var(--vscode-button-foreground);
}

.context-menu-item i {
  width: 18px;
  font-size: 0.875rem;
  color: var(--vscode-fg-muted);
  transition: color 0.15s ease;
  text-align: center;
  flex-shrink: 0;
}

.context-menu-divider {
  height: 1px;
  background-color: var(--vscode-border);
  margin: 4px 0;
}

/* 确保 xterm 容器填满父容器 */
.terminal-container :deep(.xterm) {
  height: 100% !important;
}

.terminal-container :deep(.xterm-viewport) {
  overflow-y: auto !important;
}
</style>
