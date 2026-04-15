<template>
  <div class="vscode-sidebar-container h-full flex flex-col">
    <!-- 侧边栏标题 -->
    <div class="vscode-sidebar-header px-4 py-2 border-b border-vscode-border">
      <h3 class="text-sm font-medium text-vscode-fg m-0">{{ sidebarTitle }}</h3>
    </div>

    <!-- 侧边栏内容 -->
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <!-- SSH 连接视图 -->
      <div v-if="activeView === 'ssh'" class="p-2">
        <div class="mb-4">
          <button class="vscode-button primary w-full" @click="createRootFolder">
            {{ $t('ssh.newFolder') }}
          </button>
        </div>

        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            {{ $t('ssh.connectionList') }}
          </div>
          <div class="ssh-tree-container">
            <SSHTreeNode
              v-for="node in sshTreeData"
              :key="node.id"
              :node="node"
              :selected-id="selectedNodeId"
              :connecting-node-id="connectingNodeId"
              :connecting-elapsed-seconds="connectingElapsedSeconds"
              :auto-edit-id="autoEditNodeId"
              :edit-trigger="editTrigger"
              @select="handleNodeSelect"
              @update="handleNodeUpdate"
              @delete="handleNodeDelete"
              @connect="handleNodeConnect"
              @drag-node="handleDragNode"
              @drop-node="handleDropNode"
              @create-folder="handleCreateSubFolder"
              @create-connection="handleCreateSubConnection"
              @edit-connection="openEditConnectionDialog"
              @open-file-manager="handleOpenFileManager"
            />
          </div>
        </div>

        <!-- SSH 连接配置对话框 -->
        <SSHConnectionDialog
          v-model="showConnectionDialog"
          :folder-id="currentFolderId"
          :connection="editingConnection"
          @submit="handleConnectionSubmit"
          @test="handleConnectionTest"
        />
      </div>

      <!-- 终端视图 -->
      <div v-else-if="activeView === 'terminal'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2">新建终端</button>
        </div>

        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            终端会话
          </div>
          <div v-for="terminal in terminals" :key="terminal.id" class="vscode-tree-item">
            <i class="bi bi-terminal text-vscode-info mr-2"></i>
            <span>{{ terminal.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入对话框 -->
    <div v-if="showInputDialog" class="input-dialog-overlay" @click.self="closeInputDialog">
      <div class="input-dialog">
        <div class="input-dialog-header">
          <h3 class="text-sm font-medium text-vscode-fg">{{ inputDialogTitle }}</h3>
          <button @click="closeInputDialog" class="vscode-icon-button">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="input-dialog-body">
          <input
            ref="inputDialogInput"
            v-model="inputDialogValue"
            type="text"
            :placeholder="inputDialogPlaceholder"
            class="form-input-full"
            @keyup.enter="confirmInputDialog"
            @keyup.escape="closeInputDialog"
          />
        </div>
        <div class="input-dialog-footer">
          <button @click="closeInputDialog" class="vscode-button">
            {{ $t('ssh.cancel') }}
          </button>
          <button @click="confirmInputDialog" class="vscode-button primary">
            {{ $t('ssh.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SSHTreeNode, { type SSHTreeNodeData } from '../ssh/SSHTreeNode.vue'
import SSHConnectionDialog from '../ssh/SSHConnectionDialog.vue'
import { sshService } from '../../services/ssh.service'
import { settingsService } from '../../services/settings.service'
import {
  canUseSsh,
  getSubscriptionState,
  getSshUpgradeMessage
} from '../../services/subscription.service'
import { $alert, $confirm } from '@/composables/useDialog'

interface Props {
  activeView: string
}

const props = defineProps<Props>()

const router = useRouter()
const { t: $t } = useI18n()

// 输入对话框相关
const showInputDialog = ref(false)
const inputDialogTitle = ref('')
const inputDialogPlaceholder = ref('')
const inputDialogValue = ref('')
const inputDialogInput = ref<HTMLInputElement | null>(null)
const inputDialogCallback = ref<((value: string) => void) | null>(null)

// 注入 openNewTab 方法
const openNewTab =
  inject<(id: string, name: string, icon: string, path: string) => void>('openNewTab')
const closeTab = inject<(tabId: string) => void>('closeTab')

// ============= SSH 相关（✅ 直接使用 sshService） =============
const sshTreeData = ref<any[]>([])
const selectedNodeId = ref<string | null>(null)
const connectingNodeId = ref<string | null>(null)
const connectingElapsedSeconds = ref(0)
const sshLoading = ref(false)
const sshError = ref<string | null>(null)
let connectingTimer: number | null = null

// 拖拽的节点
const dragNode = ref<SSHTreeNodeData | null>(null)

// 连接对话框
const showConnectionDialog = ref(false)
const currentFolderId = ref<string | null>(null)
const editingConnection = ref<any>(null)

// 自动编辑的节点 ID
const autoEditNodeId = ref<string | null>(null)
// 编辑触发计数器（用于强制触发 watch）
const editTrigger = ref(0)

// ============= SSH 数据加载 =============
onMounted(() => {
  loadSSHTree()
})

watch(
  () => props.activeView,
  newView => {
    if (newView === 'ssh') {
      loadSSHTree()
    }
  }
)

const clearConnectionProgress = () => {
  if (connectingTimer) {
    window.clearInterval(connectingTimer)
    connectingTimer = null
  }
  connectingNodeId.value = null
  connectingElapsedSeconds.value = 0
}

onUnmounted(() => {
  clearConnectionProgress()
})

const getSSHSettings = async () => {
  const settings = await settingsService.getSettings()
  return {
    timeout: settings?.ssh?.timeout || 10,
    keepAlive: settings?.ssh?.keepAlive !== false,
    keepAliveInterval: settings?.ssh?.keepAliveInterval ?? 15
  }
}

const loadSSHTree = async () => {
  sshLoading.value = true
  sshError.value = null

  try {
    // ✅ 直接使用 sshService
    sshTreeData.value = await sshService.getSSHTree()
  } catch (err: any) {
    sshError.value = err.message || '加载 SSH 树失败'
    console.error('加载 SSH 树失败:', err)
  } finally {
    sshLoading.value = false
  }
}

const terminals = ref([
  { id: '1', name: 'bash' },
  { id: '2', name: 'powershell' }
])

// 计算侧边栏标题
const sidebarTitle = computed(() => {
  const titles: Record<string, string> = {
    ssh: $t('sidebar.ssh'),
    terminal: $t('sidebar.terminal')
  }
  return titles[props.activeView] || $t('sidebar.ssh')
})

// 创建根文件夹
const createRootFolder = async () => {
  try {
    // ✅ 直接使用 sshService
    const newFolder = await sshService.createFolder({
      name: '新建文件夹',
      order: 0
    })

    // 重新加载树
    await loadSSHTree()

    // 创建成功后，等待树重新加载完成，然后标记为自动编辑
    if (newFolder && newFolder.id) {
      // 等待树加载和 DOM 更新完成
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      autoEditNodeId.value = newFolder.id
      editTrigger.value++ // 增加触发计数器

      // 清除标记
      setTimeout(() => {
        autoEditNodeId.value = null
      }, 500)
    }
  } catch (err) {
    console.error('创建文件夹失败:', err)
  }
}

// 打开连接对话框（新建）
const openConnectionDialog = (folderId: string | null = null) => {
  editingConnection.value = null
  currentFolderId.value = folderId
  showConnectionDialog.value = true
}

const openProfileForUpgrade = () => {
  if (openNewTab) {
    openNewTab('profile', '个人中心', 'bi bi-person-circle', '/profile')
    return
  }

  router.push('/profile')
}

const ensureSshAccess = async () => {
  const state = getSubscriptionState()
  if (canUseSsh(state)) {
    return true
  }

  const message = getSshUpgradeMessage(state)
  const confirmed = await $confirm({
    title: '需要继续订阅',
    message: message || '当前账号暂无 SSH 使用权限。',
    confirmText: '去订阅',
    cancelText: '取消'
  })

  if (confirmed) {
    openProfileForUpgrade()
  }

  return false
}

// 打开编辑连接对话框
const openEditConnectionDialog = (connection: any) => {
  editingConnection.value = connection
  currentFolderId.value = connection.folderId
  showConnectionDialog.value = true
}

// 处理连接提交
const handleConnectionSubmit = async (data: any) => {
  try {
    if (editingConnection.value) {
      // ✅ 编辑模式 - 直接使用 sshService
      await sshService.updateConnection(editingConnection.value.id, {
        ...data,
        authType: data.authType as any
      })
    } else {
      // ✅ 新建模式 - 直接使用 sshService
      await sshService.createConnection({
        ...data,
        authType: data.authType as any
      })
    }

    // 重新加载树
    await loadSSHTree()

    // 关闭对话框后重置编辑状态
    editingConnection.value = null
  } catch (err) {
    console.error('保存连接失败:', err)
  }
}

// 处理连接测试
const handleConnectionTest = async (data: any) => {
  try {
    // 使用 sshService 进行测试，自动根据 storageMode 选择本地或远程实现
    const result = await sshService.testConnection({
      host: data.host,
      port: data.port || 22,
      username: data.username,
      password: data.password,
      privateKey: data.privateKey
    })

    if (result.success) {
      return { success: true, message: '连接测试成功！' }
    } else {
      return {
        success: false,
        message: result.message || '连接测试失败'
      }
    }
  } catch (err: any) {
    console.error('测试连接失败:', err)
    return {
      success: false,
      message: err.message || '测试连接时发生错误'
    }
  }
}

// 选中节点
const handleNodeSelect = (node: SSHTreeNodeData) => {
  selectedNodeId.value = node.id
}

// 更新节点
const handleNodeUpdate = async (node: SSHTreeNodeData) => {
  try {
    if (node.type === 'folder') {
      // ✅ 直接使用 sshService
      await sshService.updateFolder(node.id, {
        name: node.name,
        parentId: node.parentId,
        order: node.order
      })
    } else {
      // ✅ 直接使用 sshService
      await sshService.updateConnection(node.id, {
        name: node.name,
        host: node.host,
        port: node.port,
        username: node.username,
        password: node.password,
        authType: node.authType,
        folderId: node.folderId,
        order: node.order
      })
    }
    // 重新加载树
    await loadSSHTree()
  } catch (err) {
    console.error('更新节点失败:', err)
  }
}

// 删除节点
const handleNodeDelete = async (node: SSHTreeNodeData) => {
  try {
    if (node.type === 'folder') {
      // ✅ 直接使用 sshService
      await sshService.deleteFolder(node.id)
    } else {
      // ✅ 直接使用 sshService
      await sshService.deleteConnection(node.id)
    }
    // 重新加载树
    await loadSSHTree()
  } catch (err) {
    console.error('删除节点失败:', err)
  }
}

// 连接节点
const handleNodeConnect = async (node: SSHTreeNodeData) => {
  if (node.type !== 'connection') {
    return
  }

  if (connectingNodeId.value) {
    return
  }

  const allowed = await ensureSshAccess()
  if (!allowed) {
    return
  }

  try {
    // 检查是否在 Electron 环境
    if (!window.electronAPI) {
      $alert('SSH 连接功能仅在桌面应用中可用')
      return
    }

    connectingNodeId.value = node.id
    connectingElapsedSeconds.value = 1
    connectingTimer = window.setInterval(() => {
      connectingElapsedSeconds.value += 1
    }, 1000)

    // 构建连接配置
    const sshSettings = await getSSHSettings()
    const connectionConfig = {
      id: node.id,
      name: node.name,
      host: node.host,
      port: node.port || 22,
      username: node.username,
      authType: node.authType,
      password: node.password,
      privateKey: node.privateKey,
      passphrase: node.passphrase,
      timeout: sshSettings.timeout,
      keepAlive: sshSettings.keepAlive,
      keepAliveInterval: sshSettings.keepAliveInterval
    }

    // 调用 Electron IPC 建立 SSH 连接
    const result = await window.electronAPI.ssh.connect(connectionConfig)

    if (result && result.status === 'connected') {
      // 连接成功，打开终端标签页
      if (openNewTab) {
        const terminalId = `terminal-${result.id || node.id}`
        openNewTab(
          terminalId,
          `${node.name} (${node.host})`,
          'bi bi-terminal',
          `/terminal?connectionId=${result.id || node.id}&nodeId=${node.id}&name=${encodeURIComponent(node.name)}`
        )
      }
    } else {
      $alert(`连接失败: ${result?.message || '未知错误'}`)
    }
  } catch (err: any) {
    $alert(`连接失败: ${err.message || '未知错误'}`)
  } finally {
    clearConnectionProgress()
  }
}

// 拖拽节点
const handleDragNode = (node: SSHTreeNodeData) => {
  dragNode.value = node
}

// 放置节点
const handleDropNode = async (data: { dragNode: SSHTreeNodeData; dropNode: SSHTreeNodeData }) => {
  const { dragNode, dropNode } = data

  // 防止拖到自己或自己的子节点
  if (dragNode.id === dropNode.id) {
    return
  }

  try {
    // ✅ 直接使用 sshService
    await sshService.moveNode({
      nodeId: dragNode.id,
      nodeType: dragNode.type,
      targetFolderId: dropNode.type === 'folder' ? dropNode.id : dropNode.folderId,
      order: 0
    })
    // 重新加载树
    await loadSSHTree()
  } catch (err) {
    console.error('移动节点失败:', err)
  }
}

// 创建子文件夹
const handleCreateSubFolder = async (data: { parentId: string; name: string }) => {
  try {
    // ✅ 直接使用 sshService
    const newFolder = await sshService.createFolder({
      name: data.name,
      parentId: data.parentId,
      order: 0
    })

    // 重新加载树
    await loadSSHTree()
    // 创建成功后，等待树重新加载完成，然后标记为自动编辑
    if (newFolder && newFolder.id) {
      // 等待树加载和 DOM 更新完成
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      autoEditNodeId.value = newFolder.id
      editTrigger.value++ // 增加触发计数器

      // 清除标记
      setTimeout(() => {
        autoEditNodeId.value = null
      }, 500)
    }
  } catch (err) {
    console.error('创建子文件夹失败:', err)
  }
}

// 创建子连接（从右键菜单触发）
const handleCreateSubConnection = (data: { folderId: string; name: string }) => {
  // 打开对话框，并传入 folderId
  openConnectionDialog(data.folderId)
}

const handleOpenFileManager = async (connection: SSHTreeNodeData) => {
  if (!window.electronAPI) {
    $alert('文件管理功能仅在桌面应用中可用')
    return
  }

  if (!openNewTab) {
    console.error('openNewTab 方法未注入')
    return
  }

  const allowed = await ensureSshAccess()
  if (!allowed) {
    return
  }

  try {
    const sshSettings = await getSSHSettings()
    const connectionConfig = {
      id: connection.id,
      name: connection.name,
      host: connection.host,
      port: connection.port || 22,
      username: connection.username,
      authType: connection.authType,
      password: connection.password,
      privateKey: connection.privateKey,
      passphrase: connection.passphrase,
      timeout: sshSettings.timeout,
      keepAlive: sshSettings.keepAlive,
      keepAliveInterval: sshSettings.keepAliveInterval
    }

    const result = await window.electronAPI.ssh.connect(connectionConfig)

    if (result && result.status === 'connected') {
      const fileManagerId = `file-manager-${result.id || connection.id}`
      openNewTab(
        fileManagerId,
        `${connection.name} - 文件管理`,
        'bi bi-folder-open',
        `/file-manager?connectionId=${result.id || connection.id}&nodeId=${connection.id}&name=${encodeURIComponent(connection.name)}&host=${encodeURIComponent(connection.host || '')}&port=${connection.port || 22}`
      )
    } else {
      $alert(`连接失败: ${result?.message || '未知错误'}`)
    }
  } catch (err: any) {
    $alert(`连接失败: ${err.message || '未知错误'}`)
  }
}

// 导航到指定视图
const navigateToView = (viewId: string) => {
  // 触发自定义事件通知父组件切换视图
  const event = new CustomEvent('switch-view', {
    detail: { viewId }
  })
  window.dispatchEvent(event)
}

// 输入对话框方法
const showInputPrompt = (title: string, placeholder: string, callback: (value: string) => void) => {
  inputDialogTitle.value = title
  inputDialogPlaceholder.value = placeholder
  inputDialogValue.value = ''
  inputDialogCallback.value = callback
  showInputDialog.value = true

  // 自动聚焦输入框
  nextTick(() => {
    inputDialogInput.value?.focus()
  })
}

const closeInputDialog = () => {
  showInputDialog.value = false
  inputDialogTitle.value = ''
  inputDialogPlaceholder.value = ''
  inputDialogValue.value = ''
  inputDialogCallback.value = null
}

const confirmInputDialog = () => {
  const value = inputDialogValue.value.trim()
  if (value && inputDialogCallback.value) {
    inputDialogCallback.value(value)
  }
  closeInputDialog()
}

// 处理来自 ChatTreeNode 的输入请求
const handleRequestInput = (data: {
  type: string
  title: string
  placeholder: string
  callback: (name: string) => void
}) => {
  showInputPrompt(data.title, data.placeholder, data.callback)
}

// ============= 文档管理方法 (已移除) =============
// 文档管理功能已移除
</script>

<style scoped>
.vscode-sidebar-container {
  background: var(--vscode-bg-light);
  color: var(--vscode-fg);
}

.vscode-sidebar-header {
  background: var(--vscode-bg-light);
}

.vscode-button {
  padding: 6px 12px;
  font-size: 13px;
  font-family:
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  background: var(--vscode-bg-light);
  color: var(--vscode-fg);
  cursor: pointer;
  transition: all 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
}

.vscode-button:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.vscode-button:focus {
  outline: 1px solid var(--vscode-accent);
  outline-offset: 2px;
}

.vscode-button:active {
  background: var(--vscode-bg);
}

/* 主要按钮样式 */
.vscode-button.primary {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-accent);
}

.vscode-button.primary:hover {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

.vscode-button.primary:active {
  background: var(--vscode-accent-hover);
}

.vscode-tree-title {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vscode-fg-muted);
}

.vscode-tree-item {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.1s ease;
}

.vscode-tree-item:hover {
  background: var(--vscode-bg-lighter);
}

.vscode-tree-actions {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.15s ease;
  display: flex;
  gap: 0.25rem;
}

.vscode-tree-item:hover .vscode-tree-actions {
  opacity: 1;
}

.vscode-icon-button {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: color 0.15s ease;
  color: var(--vscode-fg-muted);
}

.vscode-icon-button:hover {
  color: var(--vscode-fg);
  background: var(--vscode-bg-lighter);
}

.vscode-icon-button i {
  font-size: 11px;
}

/* Bootstrap Icons 图标字体支持 */
.bi-plus::before {
  content: '➕';
}
.bi-hdd-network::before {
  content: '🖥️';
}
.bi-play::before {
  content: '▶️';
}
.bi-pencil::before {
  content: '✏️';
}
.bi-chat-dots::before {
  content: '💬';
}
.bi-folder-plus::before {
  content: '📁';
}
.bi-folder::before {
  content: '📂';
}
.bi-terminal::before {
  content: '💻';
}
.bi-clock-history::before {
  content: '🕒';
}

[class^='bi-'] {
  font-style: normal;
  display: inline-block;
  width: 1rem;
  height: 1rem;
  text-align: center;
}

/* 颜色变量 */
.text-vscode-accent {
  color: var(--vscode-accent);
}

.text-vscode-success {
  color: var(--vscode-success);
}

.text-vscode-warning {
  color: var(--vscode-warning);
}

.text-vscode-info {
  color: var(--vscode-accent);
}

.text-vscode-fg-muted {
  color: var(--vscode-fg-muted);
}

/* 输入对话框样式 */
.input-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* 半透明遮罩，保持黑色 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.input-dialog {
  background: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.input-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-border);
}

.input-dialog-body {
  padding: 16px;
}

.input-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--vscode-border);
}

.form-input-full {
  width: 100%;
  padding: 8px 12px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 13px;
  outline: none;
}

.form-input-full:focus {
  border-color: var(--vscode-accent);
}

/* 文档管理选项卡 */
.doc-tabs-header {
  display: flex;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg-light);
}

.doc-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  position: relative;
}

.doc-tab:hover {
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

.doc-tab.active {
  color: var(--vscode-fg);
  font-weight: 500;
}

.doc-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--vscode-accent);
}

.doc-tab i {
  font-size: 0.875rem;
}

.doc-tab.icon-only {
  flex: 0 0 auto;
  min-width: 2.5rem;
  padding: 0.75rem 0.5rem;
}

.doc-tab.icon-only span {
  display: none;
}

/* 搜索输入框 */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--vscode-fg-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.5rem;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-input-border);
  color: var(--vscode-input-fg);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vscode-focus-border);
  background: var(--vscode-bg-light);
}

.search-input::placeholder {
  color: var(--vscode-fg-muted);
  opacity: 0.6;
}

.search-clear {
  position: absolute;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--vscode-fg-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-clear:hover {
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

/* 搜索选项按钮 */
.search-options {
  display: flex;
  gap: 4px;
  padding: 0 2px;
}

.search-option-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vscode-fg-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.search-option-btn:hover {
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

.search-option-btn.active {
  background: var(--vscode-accent);
  color: white;
  border-color: var(--vscode-accent);
}

.search-option-btn i {
  font-size: 14px;
}

/* 搜索结果头部 */
.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
}

.icon-btn-xs {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--vscode-fg-muted);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn-xs:hover {
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

/* 搜索结果组 */
.search-result-group {
  margin-bottom: 2px;
}

.search-result-file {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}

.search-result-file:hover {
  background: var(--vscode-bg-lighter);
}

.chevron-icon {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  flex-shrink: 0;
}

.file-icon {
  font-size: 16px;
  color: var(--vscode-accent);
  flex-shrink: 0;
}

.file-name {
  font-size: 13px;
  color: var(--vscode-fg);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-path {
  font-size: 11px;
  color: var(--vscode-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.match-count {
  padding: 2px 6px;
  background: var(--vscode-accent);
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
}

/* 匹配内容预览 */
.search-matches {
  margin-left: 28px;
  margin-top: 2px;
  margin-bottom: 4px;
}

.search-match-item {
  display: flex;
  gap: 8px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.15s;
}

.search-match-item:hover {
  background: var(--vscode-bg-lighter);
}

.match-line-number {
  color: var(--vscode-fg-muted);
  min-width: 32px;
  text-align: right;
  font-family: monospace;
  flex-shrink: 0;
}

.match-content {
  color: var(--vscode-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
}

/* 搜索高亮 */
:deep(.search-highlight) {
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.3);
  color: var(--vscode-fg);
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state i {
  font-size: 48px;
  color: var(--vscode-fg-muted);
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--vscode-fg);
  margin-bottom: 8px;
}

.empty-state .hint {
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.hint-list {
  margin-top: 16px;
  font-size: 12px;
  color: var(--vscode-fg-muted);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint-list kbd {
  background: var(--vscode-bg-lighter);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid var(--vscode-border);
  font-size: 11px;
  font-family: monospace;
}

/* 标星文档列表 */
.starred-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.starred-file-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.1s ease;
  gap: 0.5rem;
}

.starred-file-item:hover {
  background: var(--vscode-bg-lighter);
}

.starred-file-item .file-icon {
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--bs-info);
}

.starred-file-item .file-info {
  flex: 1;
  min-width: 0;
}

.starred-file-item .file-name {
  font-size: 0.8125rem;
  color: var(--vscode-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.starred-file-item .file-path {
  font-size: 0.7rem;
  color: var(--vscode-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.starred-file-item .star-icon {
  flex-shrink: 0;
  font-size: 0.875rem;
  color: #ffc107;
  opacity: 0.7;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  padding: 0.25rem;
  border-radius: 4px;
}

.starred-file-item .star-icon.clickable {
  cursor: pointer;
}

.starred-file-item .star-icon.clickable:hover {
  opacity: 1;
  transform: scale(1.15);
  background: rgba(255, 193, 7, 0.1);
}

/* 使用最多文档列表 */
.most-used-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.most-used-file-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.1s ease;
  gap: 0.5rem;
}

.most-used-file-item:hover {
  background: var(--vscode-bg-lighter);
}

.most-used-file-item .file-icon {
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--bs-info);
}

.most-used-file-item .file-info {
  flex: 1;
  min-width: 0;
}

.most-used-file-item .file-name {
  font-size: 0.8125rem;
  color: var(--vscode-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.most-used-file-item .file-path {
  font-size: 0.7rem;
  color: var(--vscode-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.most-used-file-item .usage-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  background: var(--vscode-bg-lighter);
  font-size: 0.75rem;
  color: var(--vscode-fg-muted);
}

.most-used-file-item .usage-badge i {
  font-size: 0.7rem;
}

.most-used-file-item .usage-badge .count {
  font-weight: 500;
  color: var(--vscode-accent);
}

/* 最近使用文档列表 */
.recent-files-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.recent-file-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.1s ease;
  gap: 0.5rem;
}

.recent-file-item:hover {
  background: var(--vscode-bg-lighter);
}

.recent-file-item .file-icon {
  flex-shrink: 0;
  font-size: 1rem;
  color: var(--bs-success);
}

.recent-file-item .file-info {
  flex: 1;
  min-width: 0;
}

.recent-file-item .file-name {
  font-size: 0.8125rem;
  color: var(--vscode-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-file-item .file-path {
  font-size: 0.7rem;
  color: var(--vscode-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-file-item .time-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  background: var(--vscode-bg-lighter);
  font-size: 0.7rem;
  color: var(--vscode-fg-muted);
}

.recent-file-item .time-badge i {
  font-size: 0.7rem;
}

.recent-file-item .time-badge .time {
  font-weight: 500;
}
</style>
