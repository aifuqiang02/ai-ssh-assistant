<template>
  <div class="vscode-sidebar-container h-full flex flex-col">
    <!-- 侧边栏标题 -->
    <div class="vscode-sidebar-header px-4 py-2 border-b border-vscode-border">
      <h3 class="text-sm font-medium text-vscode-fg m-0">{{ sidebarTitle }}</h3>
    </div>
    
    <!-- 侧边栏内容 -->
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <!-- SSH 连接视图 -->
      <div v-if="activeView === 'ssh'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full" @click="createRootFolder">
            新建文件夹
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            连接列表
          </div>
          <div class="ssh-tree-container">
            <SSHTreeNode
              v-for="node in sshTreeData"
              :key="node.id"
              :node="node"
              :selected-id="selectedNodeId"
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
      
      <!-- AI 聊天视图 -->
      <div v-else-if="activeView === 'chat'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2" @click="createRootChatFolder">
            新建文件夹
          </button>
          <button class="vscode-button w-full" @click="createRootChatSession">
            新建对话
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            对话列表
          </div>
          <div class="chat-tree-container">
            <ChatTreeNode
              v-for="node in chatTreeData"
              :key="node.id"
              :node="node"
              :selected-id="selectedChatNodeId"
              :auto-edit-id="autoEditChatNodeId"
              :edit-trigger="editChatTrigger"
              @select="handleChatNodeSelect"
              @update="handleChatNodeUpdate"
              @delete="handleChatNodeDelete"
              @open-session="handleOpenSession"
              @drag-node="handleDragChatNode"
              @drop-node="handleDropChatNode"
              @create-folder="handleCreateChatSubFolder"
              @create-session="handleCreateChatSubSession"
              @request-input="handleRequestInput"
            />
          </div>
        </div>
      </div>
      
      <!-- 文件管理视图 -->
      <div v-else-if="activeView === 'files'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2">
            打开文件夹
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            文件浏览器
          </div>
          <div class="vscode-tree-item">
            <i class="bi bi-folder text-vscode-warning mr-2"></i>
            <span>项目文件夹</span>
          </div>
        </div>
      </div>
      
      <!-- 终端视图 -->
      <div v-else-if="activeView === 'terminal'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2">
            新建终端
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            终端会话
          </div>
          <div 
            v-for="terminal in terminals" 
            :key="terminal.id"
            class="vscode-tree-item"
          >
            <i class="bi bi-terminal text-vscode-info mr-2"></i>
            <span>{{ terminal.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 历史记录视图 -->
      <div v-else-if="activeView === 'history'" class="p-4">
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            操作历史
          </div>
          <div 
            v-for="item in history" 
            :key="item.id"
            class="vscode-tree-item"
          >
            <i class="bi bi-clock-history text-vscode-fg-muted mr-2"></i>
            <span class="text-sm">{{ item.action }}</span>
          </div>
        </div>
      </div>
      
      <!-- 欢迎视图 -->
      <div v-else-if="activeView === 'welcome'" class="p-4">
        <div class="space-y-4">
          <!-- 快速导航 -->
          <div class="mb-6">
            <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-3">
              快速导航
            </div>
            <div class="space-y-2">
              <div 
                class="vscode-tree-item cursor-pointer hover:bg-vscode-bg-lighter"
                @click="navigateToView('ssh')"
              >
                <i class="bi bi-hdd-network text-vscode-accent mr-2"></i>
                <span>SSH 连接</span>
              </div>
              <div 
                class="vscode-tree-item cursor-pointer hover:bg-vscode-bg-lighter"
                @click="navigateToView('chat')"
              >
                <i class="bi bi-chat-dots text-vscode-accent mr-2"></i>
                <span>AI 对话</span>
              </div>
              <div 
                class="vscode-tree-item cursor-pointer hover:bg-vscode-bg-lighter"
                @click="navigateToView('files')"
              >
                <i class="bi bi-folder text-vscode-accent mr-2"></i>
                <span>文件管理</span>
              </div>
              <div 
                class="vscode-tree-item cursor-pointer hover:bg-vscode-bg-lighter"
                @click="navigateToView('history')"
              >
                <i class="bi bi-clock-history text-vscode-accent mr-2"></i>
                <span>历史记录</span>
              </div>
            </div>
          </div>
          
          <!-- 最近使用 -->
          <div>
            <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-3">
              最近使用
            </div>
            <div class="space-y-2">
              <div class="text-sm text-vscode-fg-muted text-center py-4">
                暂无最近使用的项目
              </div>
            </div>
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
            取消
          </button>
          <button @click="confirmInputDialog" class="vscode-button primary">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import SSHTreeNode, { type SSHTreeNodeData } from '../ssh/SSHTreeNode.vue'
import SSHConnectionDialog from '../ssh/SSHConnectionDialog.vue'
import ChatTreeNode, { type ChatTreeNodeData } from '../chat/ChatTreeNode.vue'
import { useSSHStore } from '../../stores/ssh'
import { useChatStore } from '../../stores/chat'

interface Props {
  activeView: string
}

const props = defineProps<Props>()

const router = useRouter()

// 使用 SSH Store
const sshStore = useSSHStore()

// 输入对话框相关
const showInputDialog = ref(false)
const inputDialogTitle = ref('')
const inputDialogPlaceholder = ref('')
const inputDialogValue = ref('')
const inputDialogInput = ref<HTMLInputElement | null>(null)
const inputDialogCallback = ref<((value: string) => void) | null>(null)

// 使用 Chat Store
const chatStore = useChatStore()

// 注入 openNewTab 方法
const openNewTab = inject<(id: string, name: string, icon: string, path: string) => void>('openNewTab')

// SSH 相关
// 从 store 获取数据
const sshTreeData = computed(() => sshStore.sshTree as any)
const selectedNodeId = computed(() => sshStore.selectedNodeId)

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

// Chat 相关
const chatTreeData = computed(() => chatStore.chatTree as any)
const selectedChatNodeId = computed(() => chatStore.selectedNodeId)
const dragChatNode = ref<ChatTreeNodeData | null>(null)
const autoEditChatNodeId = ref<string | null>(null)
const editChatTrigger = ref(0)

// 初始化时加载数据
onMounted(() => {
  if (props.activeView === 'ssh') {
    sshStore.loadSSHTree()
  } else if (props.activeView === 'chat') {
    chatStore.loadChatTree()
  }
})

// 监听视图切换，加载对应数据
watch(() => props.activeView, (newView) => {
  if (newView === 'ssh' && sshStore.sshTree.length === 0) {
    sshStore.loadSSHTree()
  } else if (newView === 'chat' && chatStore.chatTree.length === 0) {
    chatStore.loadChatTree()
  }
})

const terminals = ref([
  { id: '1', name: 'bash' },
  { id: '2', name: 'powershell' }
])

const history = ref([
  { id: '1', action: '连接到生产服务器' },
  { id: '2', action: '执行命令: ls -la' },
  { id: '3', action: '上传文件到服务器' }
])

// 计算侧边栏标题
const sidebarTitle = computed(() => {
  const titles: Record<string, string> = {
    welcome: '欢迎',
    ssh: 'SSH 连接',
    chat: 'AI 助手',
    files: '文件管理',
    terminal: '终端',
    history: '历史记录'
  }
  return titles[props.activeView] || '欢迎'
})

// 创建根文件夹
const createRootFolder = async () => {
  try {
    const newFolder = await sshStore.createFolder({
      name: '新建文件夹',
      order: 0
    })
    
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
      // 编辑模式
      await sshStore.updateConnection(editingConnection.value.id, {
        ...data,
        authType: data.authType as any
      })
    } else {
      // 新建模式
      await sshStore.createConnection({
        ...data,
        authType: data.authType as any
      })
    }
    // 关闭对话框后重置编辑状态
    editingConnection.value = null
  } catch (err) {
    console.error('保存连接失败:', err)
  }
}

// 处理连接测试
const handleConnectionTest = async (data: any) => {
  try {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
    if (!token) {
      throw new Error('未登录')
    }

    const response = await fetch('http://localhost:3000/api/v1/ssh/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        host: data.host,
        port: data.port || 22,
        username: data.username,
        authType: data.authType,
        password: data.password,
        privateKey: data.privateKey,
        passphrase: data.passphrase
      })
    })

    const result = await response.json()
    
    if (result.success && result.data.connected) {
      return { success: true, message: '连接测试成功！' }
    } else {
      return { 
        success: false, 
        message: result.data.error || '连接测试失败' 
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
  sshStore.selectNode(node.id)
}

// 更新节点
const handleNodeUpdate = async (node: SSHTreeNodeData) => {
  try {
    if (node.type === 'folder') {
      await sshStore.updateFolder(node.id, {
        name: node.name,
        parentId: node.parentId,
        order: node.order
      })
    } else {
      await sshStore.updateConnection(node.id, {
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
  } catch (err) {
    console.error('更新节点失败:', err)
  }
}

// 删除节点
const handleNodeDelete = async (node: SSHTreeNodeData) => {
  try {
    if (node.type === 'folder') {
      await sshStore.deleteFolder(node.id)
    } else {
      await sshStore.deleteConnection(node.id)
    }
  } catch (err) {
    console.error('删除节点失败:', err)
  }
}

// 连接节点
const handleNodeConnect = async (node: SSHTreeNodeData) => {
  console.log('连接到:', node)
  
  if (node.type !== 'connection') {
    return
  }
  
  try {
    // 检查是否在 Electron 环境
    if (!window.electronAPI) {
      console.error('Not running in Electron environment')
      alert('SSH 连接功能仅在桌面应用中可用')
      return
    }
    
    // 构建连接配置
    const connectionConfig = {
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
    
    console.log('Connecting with config:', { ...connectionConfig, password: '***', privateKey: '***' })
    
    // 调用 Electron IPC 建立 SSH 连接
    const result = await window.electronAPI.ssh.connect(connectionConfig)
    
    console.log('Connection result:', result)
    
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
        console.log(`Opened terminal tab for connection: ${node.name}`)
      }
    } else {
      alert(`连接失败: ${result?.message || '未知错误'}`)
    }
  } catch (err: any) {
    console.error('SSH connection error:', err)
    alert(`连接失败: ${err.message || '未知错误'}`)
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
    await sshStore.moveNode({
      nodeId: dragNode.id,
      nodeType: dragNode.type,
      targetFolderId: dropNode.type === 'folder' ? dropNode.id : dropNode.folderId,
      order: 0
    })
  } catch (err) {
    console.error('移动节点失败:', err)
  }
}

// 创建子文件夹
const handleCreateSubFolder = async (data: { parentId: string; name: string }) => {
  try {
    const newFolder = await sshStore.createFolder({
      name: data.name,
      parentId: data.parentId,
      order: 0
    })
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

// 打开文件管理器
const handleOpenFileManager = async (connection: SSHTreeNodeData) => {
  console.log('打开文件管理器:', connection)
  
  if (!window.electronAPI) {
    alert('文件管理功能仅在桌面应用中可用')
    return
  }
  
  if (!openNewTab) {
    console.error('openNewTab 方法未注入')
    return
  }
  
  try {
    // 构建连接配置
    const connectionConfig = {
      id: connection.id,
      name: connection.name,
      host: connection.host,
      port: connection.port || 22,
      username: connection.username,
      authType: connection.authType,
      password: connection.password,
      privateKey: connection.privateKey,
      passphrase: connection.passphrase
    }
    
    // 建立连接
    const result = await window.electronAPI.ssh.connect(connectionConfig)
    
    if (result && result.status === 'connected') {
      // 连接成功，在新标签页中打开文件管理器
      const fileManagerId = `file-manager-${result.id || connection.id}`
      openNewTab(
        fileManagerId,
        `${connection.name} - 文件管理`,
        'bi bi-folder-open',
        `/file-manager?connectionId=${result.id || connection.id}&nodeId=${connection.id}&name=${encodeURIComponent(connection.name)}&host=${encodeURIComponent(connection.host || '')}&port=${connection.port || 22}`
      )
      console.log(`Opened file manager tab for connection: ${connection.name}`)
    } else {
      alert(`连接失败: ${result?.message || '未知错误'}`)
    }
  } catch (err: any) {
    console.error('打开文件管理器失败:', err)
    alert(`连接失败: ${err.message || '未知错误'}`)
  }
}

// ==================== Chat Tree 相关方法 ====================

// 创建根级文件夹（Chat）
const createRootChatFolder = async () => {
  showInputPrompt('新建文件夹', '请输入文件夹名称', async (folderName: string) => {
  
  try {
    const newFolder = await chatStore.createFolder({
      name: folderName.trim(),
      parentId: null,
      order: 0
    })
    
    if (newFolder && newFolder.id) {
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))
      
      autoEditChatNodeId.value = newFolder.id
      editChatTrigger.value++
      
      setTimeout(() => {
        autoEditChatNodeId.value = null
      }, 500)
    }
  } catch (err) {
    console.error('创建文件夹失败:', err)
  }
  })
}

// 创建根级会话（Chat）
const createRootChatSession = async () => {
  showInputPrompt('新建对话', '请输入对话名称', async (sessionName: string) => {
  
  try {
    const newSession = await chatStore.createSession({
      title: sessionName.trim(),
      folderId: null,
      order: 0
    })
    
    if (newSession && newSession.id) {
      // 打开新创建的会话
      handleOpenSession({ id: newSession.id, name: sessionName.trim(), type: 'session' } as ChatTreeNodeData)
    }
  } catch (err) {
    console.error('创建对话失败:', err)
  }
  })
}

// 选中 Chat 节点
const handleChatNodeSelect = (node: ChatTreeNodeData) => {
  chatStore.selectNode(node.id)
}

// 更新 Chat 节点
const handleChatNodeUpdate = async (node: ChatTreeNodeData) => {
  try {
    if (node.type === 'folder') {
      await chatStore.updateFolder(node.id, {
        name: node.name,
        parentId: node.parentId,
        order: node.order
      })
    } else {
      await chatStore.updateSession(node.id, {
        title: node.name,
        folderId: node.folderId,
        order: node.order
      })
    }
  } catch (err) {
    console.error('更新节点失败:', err)
  }
}

// 删除 Chat 节点
const handleChatNodeDelete = async (node: ChatTreeNodeData) => {
  const nodeType = node.type === 'folder' ? '文件夹' : '对话'
  const confirmed = confirm(`确定要删除${nodeType} "${node.name}" 吗？`)
  if (!confirmed) return
  
  try {
    if (node.type === 'folder') {
      await chatStore.deleteFolder(node.id)
    } else {
      await chatStore.deleteSession(node.id)
    }
  } catch (err) {
    console.error('删除节点失败:', err)
  }
}

// 打开会话
const handleOpenSession = (node: ChatTreeNodeData) => {
  chatStore.openSession(node.id)
  router.push({ path: '/chat', query: { sessionId: node.id } })
}

// 拖拽 Chat 节点
const handleDragChatNode = (node: ChatTreeNodeData) => {
  dragChatNode.value = node
}

// 放置 Chat 节点
const handleDropChatNode = async (data: { dragNode: ChatTreeNodeData; dropNode: ChatTreeNodeData }) => {
  console.log('放置节点:', data)
  // 只能放到文件夹中
  if (data.dropNode.type !== 'folder') return
  
  try {
    await chatStore.moveNode({
      nodeId: data.dragNode.id,
      targetFolderId: data.dropNode.id,
      order: 0
    })
    dragChatNode.value = null
  } catch (err) {
    console.error('移动节点失败:', err)
  }
}

// 创建子文件夹（Chat）
const handleCreateChatSubFolder = async (data: { parentId: string; name: string }) => {
  try {
    const newFolder = await chatStore.createFolder({
      name: data.name,
      parentId: data.parentId,
      order: 0
    })
    
    if (newFolder && newFolder.id) {
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))
      
      autoEditChatNodeId.value = newFolder.id
      editChatTrigger.value++
      
      setTimeout(() => {
        autoEditChatNodeId.value = null
      }, 500)
    }
  } catch (err) {
    console.error('创建子文件夹失败:', err)
  }
}

// 创建子会话（Chat）
const handleCreateChatSubSession = async (data: { folderId: string; name: string }) => {
  try {
    const newSession = await chatStore.createSession({
      title: data.name,
      folderId: data.folderId,
      order: 0
    })
    
    if (newSession && newSession.id) {
      handleOpenSession({ id: newSession.id, name: data.name, type: 'session' } as ChatTreeNodeData)
    }
  } catch (err) {
    console.error('创建子会话失败:', err)
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
const handleRequestInput = (data: { type: string; title: string; placeholder: string; callback: (name: string) => void }) => {
  showInputPrompt(data.title, data.placeholder, data.callback)
}
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
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
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
  color: #ffffff;
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
.bi-plus::before { content: "➕"; }
.bi-hdd-network::before { content: "🖥️"; }
.bi-play::before { content: "▶️"; }
.bi-pencil::before { content: "✏️"; }
.bi-chat-dots::before { content: "💬"; }
.bi-folder-plus::before { content: "📁"; }
.bi-folder::before { content: "📂"; }
.bi-terminal::before { content: "💻"; }
.bi-clock-history::before { content: "🕒"; }

[class^="bi-"] {
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
  background: rgba(0, 0, 0, 0.5);
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
</style>