<template>
  <div class="terminal-view">
    <!-- 终端头部信息 -->
    <div class="terminal-header">
      <div class="connection-info">
        <span class="connection-name">{{ actualConnectionName }}</span>
        <span v-if="connectionStatus === 'connected'" class="status-badge connected">
          <i class="bi bi-circle-fill"></i> 已连接
        </span>
        <span v-else-if="connectionStatus === 'connecting'" class="status-badge connecting">
          <i class="bi bi-circle-fill"></i> 连接中...
        </span>
        <span v-else class="status-badge disconnected">
          <i class="bi bi-circle-fill"></i> 已断开
        </span>
        
        <!-- 连接控制按钮（放在状态旁边） -->
        <div class="connection-actions">
          <!-- 已连接时显示断开按钮 -->
          <button 
            v-if="connectionStatus === 'connected'" 
            @click="handleDisconnect" 
            class="btn-icon btn-small" 
            title="断开连接"
          >
            <i class="bi bi-x-circle"></i>
          </button>
          <!-- 已断开时显示重新连接按钮 -->
          <button 
            v-else-if="connectionStatus === 'disconnected'" 
            @click="handleReconnect" 
            class="btn-icon btn-small" 
            title="重新连接"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </button>
          <!-- 连接中时禁用所有按钮 -->
          <button 
            v-else
            disabled
            class="btn-icon btn-small btn-disabled" 
            title="连接中..."
          >
            <i class="bi bi-hourglass-split"></i>
          </button>
        </div>
      </div>
      <div class="terminal-actions">
        <!-- AI助手切换按钮 -->
        <button 
          @click="toggleAIAssistant" 
          :class="['btn-icon', { 'active': showAIAssistant }]"
          title="AI助手"
        >
          <i class="bi bi-robot"></i>
        </button>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="terminal-main">
      <!-- 终端容器 -->
      <div 
        ref="terminalContainer" 
        class="terminal-container"
        :class="{ 'with-ai-panel': showAIAssistant }"
      ></div>
      
      <!-- AI助手面板 -->
      <div 
        v-if="showAIAssistant"
        class="ai-assistant-panel"
      >
        <div class="ai-panel-header">
          <h3 class="ai-panel-title">AI 助手</h3>
          <button 
            @click="toggleAIAssistant"
            class="btn-icon"
            title="关闭AI助手"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <AIChatSessionWithTools
          :current-provider="currentProvider"
          :current-model="currentModel"
          :connection-id="actualConnectionId"
          :enable-tools="true"
          :server-info="serverInfo"
          :multiline="true"
          :input-rows="2"
          input-placeholder="向AI助手提问... (Ctrl+Enter 发送，支持SSH命令执行)"
          empty-state-text="SSH终端AI助手（支持工具调用）"
          empty-state-subtext="可以通过AI执行SSH命令、读取文件等操作"
          :show-attach-button="false"
          :show-status-info="false"
          @tool-executed="handleToolExecuted"
        />
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <div 
      v-if="showContextMenu" 
      class="context-menu"
      :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
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
      <div class="context-menu-item" @click="handleClear">
        <i class="bi bi-trash"></i>
        <span>清屏</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'
import { sshService } from '@/services/ssh.service'
import { findNode } from '@/utils/tree-utils'
import AIChatSessionWithTools from '@/components/chat/AIChatSessionWithTools.vue'
import type { AIProvider, AIModel } from '@/types/ai-providers'
import { chatCompletion, type ChatMessage as APIChatMessage } from '@/services/ai-api.service'
import type { ToolResult } from '@/types/tools'

// Props
const props = defineProps<{
  connectionId?: string
  connectionName?: string
}>()

// 路由
const route = useRoute()

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
  return props.connectionId || (route.query.connectionId as string)
})

const actualConnectionName = computed(() => {
  return props.connectionName || decodeURIComponent(route.query.name as string || '终端')
})

// 从 URL 获取节点 ID
const nodeId = computed(() => {
  return route.query.nodeId as string
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

// Refs
const terminalContainer = ref<HTMLElement | null>(null)
const terminal = ref<Terminal | null>(null)
const fitAddon = ref<FitAddon | null>(null)
const webLinksAddon = ref<WebLinksAddon | null>(null)
const connectionStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected')
const outputListener = ref<(() => void) | null>(null)
const statusListener = ref<(() => void) | null>(null)
const currentConnectionId = ref<string>('') // 当前活动的连接ID
const terminalDataDisposable = ref<any>(null) // 保存 terminal.onData 的 disposable 引用

// 右键菜单状态
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

// AI助手相关状态
const showAIAssistant = ref(true)
// 注意：不再在父组件管理消息，让子组件完全自己处理
// const aiMessages = ref<Message[]>([])  // 移除父组件的消息管理
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)

// 服务器信息（用于工具调用）
const serverInfo = computed(() => {
  const config = getNodeConfig()
  if (!config) return undefined
  
  return {
    host: config.host,
    username: config.username
  }
})

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
    convertEol: false,  // 禁用自动换行符转换，避免重复换行
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
  terminalDataDisposable.value = terminal.value.onData((data) => {
    const connId = currentConnectionId.value
    if (connId && window.electronAPI) {
      // 直接写入终端输入（不添加换行符，不等待响应）
      window.electronAPI.ssh.write(connId, data).catch((err: any) => {
        console.error('Failed to send input:', err)
      })
    }
  })

  // 添加右键菜单功能
  terminalContainer.value.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault()
    
    // 显示右键菜单
    contextMenuX.value = e.clientX
    contextMenuY.value = e.clientY
    showContextMenu.value = true
  })

  // 点击其他地方关闭菜单
  document.addEventListener('click', () => {
    showContextMenu.value = false
  })

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  if (fitAddon.value) {
    fitAddon.value.fit()
  }
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
      statusListener.value = window.electronAPI.onConnectionStatusChange(({ id, status }) => {
        if (id === connId) {
          if (status === 'connected') {
            connectionStatus.value = 'connected'
          } else if (status === 'disconnected') {
            connectionStatus.value = 'disconnected'
          }
        }
      })

      // 直接设置为已连接状态
      connectionStatus.value = 'connected'
      
      // 立即获取并显示初始输出（不依赖状态变化事件）
      setTimeout(async () => {
        if (window.electronAPI && terminal.value) {
          try {
            const initialOutput = await window.electronAPI.ssh.getInitialOutput(connId)
            if (initialOutput) {
              terminal.value.write(initialOutput)
            }
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
const handleReconnect = async () => {
  if (connectionStatus.value === 'connected') {
    // 如果已连接，不执行任何操作
    return
  }
  
  // 先断开旧连接（如果存在）
  if (currentConnectionId.value && window.electronAPI) {
    try {
      await window.electronAPI.ssh.disconnect(currentConnectionId.value)
      console.log('Disconnected old connection:', currentConnectionId.value)
    } catch (err) {
      console.warn('Failed to disconnect:', err)
    }
  }
  
  // 清理监听器
  cleanupListeners()
  
  // 获取节点配置
  const config = getNodeConfig()
  
  if (config && window.electronAPI) {
    terminal.value?.clear()
    connectionStatus.value = 'connecting'
    
    try {
      const result = await window.electronAPI.ssh.connect(config)
      
      if (result && result.status === 'connected') {
        // 更新当前连接ID
        currentConnectionId.value = result.id
        connectToSSH()
      } else {
        connectionStatus.value = 'disconnected'
        terminal.value?.writeln(`重连失败: ${result?.message || '未知错误'}\r\n`)
      }
    } catch (err: any) {
      connectionStatus.value = 'disconnected'
      terminal.value?.writeln(`重连失败: ${err.message}\r\n`)
    }
  } else {
    // 没有配置，提示用户
    terminal.value?.clear()
    terminal.value?.writeln('无法获取连接配置，请从侧边栏重新点击连接\r\n')
    connectionStatus.value = 'disconnected'
  }
}

// 断开连接
const handleDisconnect = async () => {
  if (connectionStatus.value !== 'connected') {
    // 如果未连接，不执行任何操作
    return
  }
  
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
      showContextMenu.value = false
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text && currentConnectionId.value && window.electronAPI) {
      await window.electronAPI.ssh.execute(currentConnectionId.value, text)
    }
    showContextMenu.value = false
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

const handleClear = () => {
  terminal.value?.clear()
  showContextMenu.value = false
}

// AI助手相关函数
const toggleAIAssistant = () => {
  showAIAssistant.value = !showAIAssistant.value
  // 调整终端大小以适应新布局
  setTimeout(() => {
    handleResize()
  }, 100)
}

// 加载AI模型配置
const loadAIModelConfiguration = () => {
  try {
    const saved = localStorage.getItem('selectedAIModel')
    if (!saved) return
    
    const savedModel = JSON.parse(saved)
    const configsStr = localStorage.getItem('aiProviderConfigs')
    
    if (configsStr && savedModel) {
      const configs = JSON.parse(configsStr)
      const provider = configs.find((p: AIProvider) => p.id === savedModel.providerId)
      
      if (provider) {
        const model = provider.models?.find((m: AIModel) => m.id === savedModel.modelId)
        if (model) {
          currentProvider.value = provider
          currentModel.value = model
        }
      }
    }
  } catch (error) {
    console.error('AI模型配置加载失败:', error)
  }
}

// 注意：移除了 handleAISendMessage, handleAIClearMessages, handleAIUpdateMessages
// 因为子组件 AIChatSessionWithTools 现在完全自己管理消息

const handleToolExecuted = (toolName: string, result: ToolResult) => {
  console.log(`[Terminal] Tool ${toolName} executed:`, result)
  
  // 注意：SSH 命令的输出已经通过 shell 的 data 事件自动显示在终端了
  // 这里不需要再次显示，避免重复
  // 如果需要特殊标记，可以只添加一个提示
  
  if (toolName === 'execute_ssh_command' && result.success && result.content && terminal.value) {
    // 只添加一个简单的成功提示，不重复显示输出
    // terminal.value.write('\r\n\x1b[32m✓ AI 命令执行成功\x1b[0m\r\n')
    
    // 或者完全不显示，因为输出已经在终端中了
    // 用户可以在 AI 助手面板中看到完整的分析
  }
}

// 监听 connectionId 变化
// 注意：使用 KeepAlive 时，组件会被缓存，actualConnectionId 可能与 currentConnectionId 不同
// 这是正常的，因为 actualConnectionId 来自路由参数（标签创建时的 ID）
// 而 currentConnectionId 是实际的 SSH 连接 ID
// 我们不应该在这里重新连接，除非是真正的新连接
watch(() => actualConnectionId.value, (newId) => {
  // 如果已经初始化过，说明是切换回来的，不需要重新连接
  if (isInitialized.value && currentConnectionId.value) {
    return
  }
  
  // 只有在首次初始化时才建立连接
  if (newId && terminal.value && !currentConnectionId.value) {
    currentConnectionId.value = newId
    connectToSSH()
  }
})

// 标记是否已初始化
const isInitialized = ref(false)

// 生命周期
onMounted(async () => {
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
})

// 当组件被 KeepAlive 激活时
onActivated(() => {
  // 重新调整终端大小以适应容器
  if (terminal.value && fitAddon.value) {
    nextTick(() => {
      try {
        fitAddon.value?.fit()
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
  // 移除窗口大小监听器
  window.removeEventListener('resize', handleResize)
  
  // 清理事件监听器
  cleanupListeners()
  
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

.connection-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
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

.status-badge i {
  font-size: 8px;
}

.status-badge.connected {
  color: #0dbc79;
  background-color: rgba(13, 188, 121, 0.1);
}

.status-badge.connecting {
  color: #e5e510;
  background-color: rgba(229, 229, 16, 0.1);
}

.status-badge.disconnected {
  color: #cd3131;
  background-color: rgba(205, 49, 49, 0.1);
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

.btn-icon.active {
  background-color: var(--vscode-accent);
  color: #ffffff;
}

.btn-icon.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon.btn-disabled:hover {
  background-color: transparent;
}

.btn-icon.btn-small {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.terminal-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.terminal-container {
  flex: 1;
  padding: 8px;
  overflow: hidden;
  background-color: #1e1e1e;
  transition: flex 0.3s ease;
}

.terminal-container.with-ai-panel {
  flex: 0 0 65%;
}

.ai-assistant-panel {
  flex: 0 0 35%;
  min-width: 150px;
  background-color: var(--vscode-bg-light);
  border-left: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
}

.ai-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--vscode-bg-lighter);
  border-bottom: 1px solid var(--vscode-border-subtle);
}

.ai-panel-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin: 0;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  min-width: 160px;
  padding: 4px 0;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--vscode-fg);
  font-size: 13px;
  transition: all 0.15s ease;
  user-select: none;
}

.context-menu-item:hover {
  background: var(--vscode-accent);
  color: #ffffff;
}

.context-menu-item:hover i {
  color: #ffffff;
}

.context-menu-item i {
  width: 16px;
  font-size: 14px;
  color: var(--vscode-fg-muted);
  transition: color 0.15s ease;
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