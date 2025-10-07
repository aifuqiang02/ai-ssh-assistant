<template>
  <div class="file-manager-view">
    <!-- 文件管理器头部 -->
    <div class="file-manager-header">
      <div class="connection-info">
        <i class="bi bi-folder-open"></i>
        <span class="connection-name">{{ actualConnectionName }}</span>
        <span v-if="connectionStatus === 'connected'" class="status-badge connected">
          <i class="bi bi-circle-fill"></i> 已连接
        </span>
        <span v-else class="status-badge disconnected">
          <i class="bi bi-circle-fill"></i> 已断开
        </span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn" @click="goBack" :disabled="currentPath === '/'">
          <i class="bi bi-arrow-left"></i>
          返回
        </button>
        <button class="toolbar-btn" @click="goHome">
          <i class="bi bi-house"></i>
          主目录
        </button>
        <button class="toolbar-btn" @click="refreshFiles">
          <i class="bi bi-arrow-clockwise"></i>
          刷新
        </button>
      </div>
      <div class="toolbar-right">
        <!-- 批量操作按钮 -->
        <template v-if="selectedFiles.length > 0">
          <span class="selected-count">已选 {{ selectedFiles.length }} 项</span>
          <button class="toolbar-btn primary" @click="handleBulkDownload">
            <i class="bi bi-download"></i>
            批量下载
          </button>
          <button class="toolbar-btn danger" @click="handleBulkDelete">
            <i class="bi bi-trash"></i>
            批量删除
          </button>
          <button class="toolbar-btn" @click="clearSelection">
            <i class="bi bi-x"></i>
            取消选择
          </button>
        </template>
        <!-- 常规操作按钮 -->
        <template v-else>
          <button class="toolbar-btn primary" @click="handleUpload">
            <i class="bi bi-upload"></i>
            上传文件
          </button>
          <button class="toolbar-btn" @click="createFolder">
            <i class="bi bi-folder-plus"></i>
            新建文件夹
          </button>
        </template>
      </div>
    </div>

    <!-- 路径导航 -->
    <div class="path-bar">
      <i class="bi bi-folder"></i>
      <input 
        v-model="currentPath" 
        class="path-input"
        @keydown.enter="navigateToPath"
        placeholder="输入路径..."
      />
    </div>

    <!-- 文件列表容器 -->
    <div class="file-list-wrapper">
      <!-- 文件列表头部 -->
      <div class="file-list-header">
        <div class="file-col-checkbox">
          <input 
            type="checkbox" 
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
        </div>
        <div class="file-col-name">名称</div>
        <div class="file-col-size">大小</div>
        <div class="file-col-modified">修改时间</div>
        <div class="file-col-actions">操作</div>
      </div>

      <!-- 文件列表 -->
      <div class="file-list">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>加载中...</span>
        </div>
        
        <div v-else-if="files.length === 0 && currentPath === '/'" class="empty-state">
          <i class="bi bi-folder-open"></i>
          <span>此目录为空</span>
        </div>

        <template v-else>
          <!-- 返回上级目录 -->
          <div 
            v-if="currentPath !== '/'"
            class="file-item parent-dir"
            @click="goBack"
          >
            <div class="file-col-checkbox"></div>
            <div class="file-col-name">
              <i class="file-icon bi bi-arrow-up-circle"></i>
              <span class="file-name">..</span>
            </div>
            <div class="file-col-size">
              <span class="parent-hint">返回上级</span>
            </div>
            <div class="file-col-modified"></div>
            <div class="file-col-actions"></div>
          </div>

          <!-- 文件和文件夹列表 -->
          <div 
            v-for="file in files" 
            :key="file.name"
            :class="['file-item', { 'selected': isFileSelected(file) }]"
            @click="handleFileClick(file)"
            @dblclick="handleFileDoubleClick(file)"
          >
          <div class="file-col-checkbox" @click.stop>
            <input 
              type="checkbox" 
              :checked="isFileSelected(file)"
              @change="toggleFileSelection(file)"
            />
          </div>
          <div class="file-col-name">
            <i :class="['file-icon', getFileIcon(file)]"></i>
            <span class="file-name">{{ file.name }}</span>
          </div>
          <div class="file-col-size">
            {{ file.type === 'directory' ? '-' : formatFileSize(file.size) }}
          </div>
          <div class="file-col-modified">
            {{ formatDate(file.modifiedTime) }}
          </div>
          <div class="file-col-actions" @click.stop>
            <button 
              class="action-btn" 
              @click="downloadFile(file)"
              :title="file.type === 'directory' ? '下载文件夹' : '下载文件'"
            >
              <i class="bi bi-download"></i>
            </button>
            <button 
              class="action-btn danger" 
              @click="deleteFile(file)"
              title="删除"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        </template>
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        {{ files.length }} 个项目
        <span v-if="selectedFiles.length > 0"> - 已选择 {{ selectedFiles.length }} 个</span>
      </div>
      <div class="status-right">
        <!-- 下载进度显示 -->
        <div 
          v-if="hasActiveDownloads" 
          class="download-progress-indicator"
          @click="showDownloadManager = true"
          title="点击查看下载详情"
        >
          <i class="bi bi-download"></i>
          <div class="progress-info">
            <div class="progress-text">
              <span class="download-count">{{ completedDownloadsCount }}/{{ activeDownloadsCount + completedDownloadsCount }}</span>
              <span v-if="currentDownloadingTask" class="current-file">{{ currentDownloadingTask.name }}</span>
              <span v-else class="download-status">等待中...</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentTaskProgress + '%' }"></div>
            </div>
          </div>
        </div>
        <span class="host-info">{{ actualHost }}:{{ actualPort }}</span>
      </div>
    </div>

    <!-- 新建文件夹弹窗 -->
    <div v-if="showCreateFolderDialog" class="create-folder-overlay" @click.self="cancelCreateFolder">
      <div class="create-folder-dialog">
        <div class="modal-header">
          <h3>新建文件夹</h3>
          <button class="close-btn" @click="cancelCreateFolder">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <input 
            ref="folderNameInput"
            v-model="newFolderName" 
            type="text" 
            class="folder-name-input"
            placeholder="请输入文件夹名称"
            @keydown.enter="confirmCreateFolder"
            @keydown.esc="cancelCreateFolder"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="cancelCreateFolder">取消</button>
          <button class="btn-confirm" @click="confirmCreateFolder" :disabled="!newFolderName.trim()">
            <i class="bi bi-check"></i>
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 下载管理器弹窗 -->
    <div v-if="showDownloadManager" class="download-manager-overlay" @click.self="showDownloadManager = false">
      <div class="download-manager-modal">
        <div class="modal-header">
          <h3>下载管理器</h3>
          <button class="close-btn" @click="showDownloadManager = false">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="downloadTasks.length === 0" class="empty-tasks">
            <i class="bi bi-inbox"></i>
            <p>暂无下载任务</p>
          </div>
          <div v-else class="task-list">
            <div 
              v-for="task in sortedDownloadTasks" 
              :key="task.id"
              :class="['task-item', task.status]"
            >
              <div class="task-icon">
                <i v-if="task.status === 'downloading'" class="bi bi-arrow-down-circle spinning"></i>
                <i v-else-if="task.status === 'completed'" class="bi bi-check-circle"></i>
                <i v-else-if="task.status === 'error'" class="bi bi-x-circle"></i>
                <i v-else-if="task.status === 'cancelled'" class="bi bi-dash-circle"></i>
                <i v-else class="bi bi-clock"></i>
              </div>
              <div class="task-info">
                <div class="task-name">{{ task.name }}</div>
                <div class="task-details">
                  <span class="task-size">{{ formatFileSize(task.size) }}</span>
                  <span v-if="task.status === 'downloading'" class="task-progress">
                    {{ task.progress }}%
                  </span>
                  <span v-else-if="task.status === 'completed'" class="task-status success">已完成</span>
                  <span v-else-if="task.status === 'error'" class="task-status error">{{ task.error || '失败' }}</span>
                  <span v-else-if="task.status === 'cancelled'" class="task-status cancelled">已取消</span>
                  <span v-else class="task-status pending">等待中</span>
                </div>
                <div v-if="task.status === 'downloading'" class="task-progress-bar">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
              </div>
              <div class="task-actions">
                <button 
                  v-if="task.status === 'downloading' || task.status === 'pending'"
                  class="task-btn cancel"
                  @click="cancelDownload(task.id)"
                  title="取消下载"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
                <button 
                  v-else
                  class="task-btn remove"
                  @click="removeDownloadTask(task.id)"
                  title="移除"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="footer-btn" @click="clearCompletedTasks">
            <i class="bi bi-check-all"></i>
            清除已完成
          </button>
          <button class="footer-btn danger" @click="cancelAllDownloads">
            <i class="bi bi-x-circle"></i>
            取消全部
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { sshService } from '@/services/ssh.service'
import { findNode } from '@/utils/tree-utils'

interface FileItem {
  name: string
  type: 'file' | 'directory'
  size: number
  modifiedTime: string
  permissions?: string
}

interface DownloadTask {
  id: string
  name: string
  remotePath: string
  localPath: string
  status: 'pending' | 'downloading' | 'completed' | 'error' | 'cancelled'
  progress: number
  size: number
  error?: string
  cancelled?: boolean
}

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
  return route.query.connectionId as string
})

const actualConnectionName = computed(() => {
  return decodeURIComponent(route.query.name as string || '文件管理器')
})

const actualHost = computed(() => {
  return decodeURIComponent(route.query.host as string || '')
})

const actualPort = computed(() => {
  return route.query.port as string || '22'
})

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

// 状态
const currentPath = ref('/')
const files = ref<FileItem[]>([])
const loading = ref(false)
const selectedFiles = ref<FileItem[]>([])
const connectionStatus = ref<'disconnected' | 'connected'>('disconnected')
const currentConnectionId = ref<string>('')

// 下载管理
const downloadTasks = ref<DownloadTask[]>([])
const showDownloadManager = ref(false)
const createdDirectories = new Set<string>() // 缓存已创建的目录，避免重复创建
const directoryCreationPromises = new Map<string, Promise<void>>() // 目录创建Promise队列，确保串行
let autoCleanupTimer: NodeJS.Timeout | null = null // 自动清理定时器
let isDownloadCancelled = false // 全局取消标志，用于停止文件夹扫描和新任务创建

// 新建文件夹对话框
const showCreateFolderDialog = ref(false)
const newFolderName = ref('')
const folderNameInput = ref<HTMLInputElement | null>(null)

// 计算属性
const isAllSelected = computed(() => {
  return files.value.length > 0 && selectedFiles.value.length === files.value.length
})

// 下载进度计算
const activeDownloadsCount = computed(() => {
  return downloadTasks.value.filter(t => t.status === 'downloading' || t.status === 'pending').length
})

const completedDownloadsCount = computed(() => {
  return downloadTasks.value.filter(t => t.status === 'completed').length
})

const hasActiveDownloads = computed(() => {
  return downloadTasks.value.some(t => t.status === 'pending' || t.status === 'downloading')
})

const currentDownloadingTask = computed(() => {
  return downloadTasks.value.find(t => t.status === 'downloading')
})

const currentTaskProgress = computed(() => {
  const task = currentDownloadingTask.value
  return task ? task.progress : 0
})

const overallProgress = computed(() => {
  if (downloadTasks.value.length === 0) return 0
  const total = downloadTasks.value.length
  const completed = downloadTasks.value.filter(t => t.status === 'completed').length
  const downloading = downloadTasks.value.filter(t => t.status === 'downloading')
  const downloadingProgress = downloading.reduce((sum, t) => sum + t.progress, 0)
  return Math.round((completed * 100 + downloadingProgress) / total)
})

// 排序后的下载任务列表（正在下载 > 待下载 > 已完成）
const sortedDownloadTasks = computed(() => {
  const statusPriority: Record<string, number> = {
    'downloading': 1,  // 最高优先级
    'pending': 2,      // 第二优先级
    'completed': 3,    // 第三优先级
    'error': 4,        // 第四优先级
    'cancelled': 5     // 最低优先级
  }
  
  return [...downloadTasks.value].sort((a, b) => {
    const priorityA = statusPriority[a.status] || 999
    const priorityB = statusPriority[b.status] || 999
    return priorityA - priorityB
  })
})

// 建立连接
const connectToSSH = async () => {
  const config = getNodeConfig()
  if (!config || !window.electronAPI) return

  try {
    const result = await window.electronAPI.ssh.connect(config)
    
    if (result && result.status === 'connected') {
      currentConnectionId.value = result.id
      connectionStatus.value = 'connected'
      loadFiles()
    } else {
      connectionStatus.value = 'disconnected'
      console.error('连接失败:', result?.message)
    }
  } catch (error: any) {
    connectionStatus.value = 'disconnected'
    console.error('连接失败:', error)
  }
}

// 加载文件列表
const loadFiles = async () => {
  if (!currentConnectionId.value || !window.electronAPI) {
    return
  }

  loading.value = true
  try {
    const result = await window.electronAPI.ssh.listFiles(
      currentConnectionId.value,
      currentPath.value
    )
    
    if (result.success) {
      files.value = result.files
    } else {
      console.error('Failed to load files:', result.error)
      alert(`加载文件列表失败: ${result.error}`)
    }
  } catch (error: any) {
    console.error('Error loading files:', error)
    alert(`加载文件列表失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 文件操作
const handleFileClick = (file: FileItem) => {
  // 如果是文件夹，单击进入
  if (file.type === 'directory') {
    navigateToDirectory(file.name)
  } else {
    // 如果是文件，单击选择
    if (!isFileSelected(file)) {
      selectedFiles.value = [file]
    }
  }
}

const handleFileDoubleClick = (file: FileItem) => {
  // 双击不做额外操作，避免与单击冲突
  return
}

const navigateToDirectory = (dirName: string) => {
  if (currentPath.value === '/') {
    currentPath.value = `/${dirName}`
  } else {
    currentPath.value = `${currentPath.value}/${dirName}`
  }
  selectedFiles.value = []
  loadFiles()
}

const navigateToPath = () => {
  selectedFiles.value = []
  loadFiles()
}

const goBack = () => {
  if (currentPath.value === '/') return
  
  const parts = currentPath.value.split('/').filter(p => p)
  parts.pop()
  currentPath.value = parts.length > 0 ? '/' + parts.join('/') : '/'
  selectedFiles.value = []
  loadFiles()
}

const goHome = () => {
  currentPath.value = '/'
  selectedFiles.value = []
  loadFiles()
}

const refreshFiles = () => {
  selectedFiles.value = []
  loadFiles()
}

// 文件选择
const isFileSelected = (file: FileItem) => {
  return selectedFiles.value.some(f => f.name === file.name)
}

const toggleFileSelection = (file: FileItem) => {
  const index = selectedFiles.value.findIndex(f => f.name === file.name)
  if (index >= 0) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(file)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedFiles.value = []
  } else {
    selectedFiles.value = [...files.value]
  }
}

const clearSelection = () => {
  selectedFiles.value = []
}

// 上传文件
const handleUpload = async () => {
  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    const filePaths = await window.electronAPI.fs.showOpenDialog({
      title: '选择要上传的文件',
      properties: ['openFile', 'multiSelections']
    })

    if (filePaths && filePaths.length > 0) {
      loading.value = true
      for (const localPath of filePaths) {
        const fileName = localPath.split(/[/\\]/).pop() || 'file'
        const remotePath = currentPath.value === '/' 
          ? `/${fileName}` 
          : `${currentPath.value}/${fileName}`
        
        await window.electronAPI.ssh.uploadFile(
          currentConnectionId.value,
          localPath,
          remotePath
        )
      }
      
      alert(`成功上传 ${filePaths.length} 个文件`)
      await loadFiles()
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    alert(`上传失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 下载文件或文件夹
const downloadFile = async (file: FileItem) => {
  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    const remotePath = currentPath.value === '/' 
      ? `/${file.name}` 
      : `${currentPath.value}/${file.name}`
    
    if (file.type === 'directory') {
      // 下载文件夹
      const folderPath = await window.electronAPI.fs.showOpenDialog({
        title: '选择保存位置',
        properties: ['openDirectory']
      })

      if (folderPath && folderPath.length > 0) {
        const localPath = `${folderPath[0]}/${file.name}`
        await addDownloadTask(file.name, 'directory', remotePath, localPath, file.size || 0)
      }
    } else {
      // 下载文件
      const localPath = await window.electronAPI.fs.showSaveDialog({
        title: '保存文件',
        defaultPath: file.name
      })

      if (localPath) {
        await addDownloadTask(file.name, 'file', remotePath, localPath, file.size)
      }
    }
  } catch (error: any) {
    console.error('Download error:', error)
    alert(`下载失败: ${error.message}`)
  }
}

// 确保目录创建（带锁机制，避免并发竞态）
const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  if (!window.electronAPI) return
  
  const api = window.electronAPI
  
  // 如果正在创建中，等待现有的Promise
  const existingPromise = directoryCreationPromises.get(dirPath)
  if (existingPromise) {
    await existingPromise
    return
  }
  
  // 如果已经创建过，直接返回
  if (createdDirectories.has(dirPath)) {
    return
  }
  
  // 创建新的Promise并立即加入队列（在await之前）
  const creationPromise = (async () => {
    try {
      console.log(`[目录创建] ${dirPath}`)
      // 使用recursive: true，自动创建所有父目录
      await api.fs.createDirectory(dirPath)
      createdDirectories.add(dirPath)
      console.log(`[目录创建] 成功: ${dirPath}`)
    } catch (error: any) {
      // 任何错误都当作成功（可能是已存在）
      console.warn(`[目录创建] 警告: ${dirPath}`, error.message)
      createdDirectories.add(dirPath)
    } finally {
      // 完成后从队列中移除
      directoryCreationPromises.delete(dirPath)
    }
  })()
  
  // 立即设置到 Map 中（在 await 之前）
  directoryCreationPromises.set(dirPath, creationPromise)
  
  // 等待创建完成
  await creationPromise
}

// 边扫描边创建下载任务（流式处理，避免卡顿）
const collectAndAddDownloadTasks = async (
  remotePath: string, 
  localBasePath: string, 
  relativePrefix: string = '',
  depth: number = 0
): Promise<number> => {
  if (!currentConnectionId.value || !window.electronAPI) {
    console.log('[收集文件] 缺少连接ID或API')
    return 0
  }
  
  // 检查是否已被取消
  if (isDownloadCancelled) {
    console.log(`[收集文件] 已取消，停止扫描: ${remotePath}`)
    return 0
  }
  
  // 限制递归深度，防止无限循环
  if (depth > 50) {
    console.warn(`[收集文件] 达到最大递归深度限制: ${remotePath}`)
    return 0
  }
  
  console.log(`[收集文件] 列出目录 [深度${depth}]: ${remotePath}`)
  let fileCount = 0
  
  try {
    const result = await window.electronAPI.ssh.listFiles(currentConnectionId.value, remotePath)
    
    if (result.success) {
      console.log(`[收集文件] 找到 ${result.files.length} 个项目`)
      
      // 先处理所有文件（立即创建下载任务）
      for (const item of result.files) {
        // 每次循环都检查取消标志
        if (isDownloadCancelled) {
          console.log(`[收集文件] 已取消，停止添加任务`)
          return fileCount
        }
        
        if (item.type === 'file') {
          const itemRemotePath = `${remotePath}/${item.name}`
          const itemLocalPath = `${localBasePath}/${item.name}`
          const itemRelativeName = relativePrefix ? `${relativePrefix}/${item.name}` : item.name
          
          const taskId = `download-${Date.now()}-${Math.random()}`
          const task: DownloadTask = {
            id: taskId,
            name: itemRelativeName,
            remotePath: itemRemotePath,
            localPath: itemLocalPath,
            status: 'pending',
            progress: 0,
            size: item.size || 0
          }
          
          downloadTasks.value.push(task)
          fileCount++
          
          // 立即开始下载（如果队列未满）
          executeDownloadTask(task)
          
          // 让出控制权，避免UI卡顿
          if (fileCount % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0))
          }
        }
      }
      
      // 再递归处理所有子目录
      for (const item of result.files) {
        // 每次循环都检查取消标志
        if (isDownloadCancelled) {
          console.log(`[收集文件] 已取消，停止进入子目录`)
          return fileCount
        }
        
        if (item.type === 'directory') {
          const itemRemotePath = `${remotePath}/${item.name}`
          const itemLocalPath = `${localBasePath}/${item.name}`
          const itemRelativeName = relativePrefix ? `${relativePrefix}/${item.name}` : item.name
          
          console.log(`[收集文件] 进入子目录: ${itemRelativeName}`)
          const subCount = await collectAndAddDownloadTasks(itemRemotePath, itemLocalPath, itemRelativeName, depth + 1)
          fileCount += subCount
        }
      }
    } else {
      console.error(`[收集文件] 列出失败:`, result)
    }
  } catch (error) {
    console.error('[收集文件] 错误:', error)
  }
  
  if (depth === 0) {
    console.log(`[收集文件] 全部完成，共收集 ${fileCount} 个文件`)
  }
  
  return fileCount
}

// 添加下载任务
const addDownloadTask = async (name: string, type: 'file' | 'directory', remotePath: string, localPath: string, size: number) => {
  // 检查是否已被取消
  if (isDownloadCancelled) {
    console.log(`[下载任务] 已取消，不添加新任务: ${name}`)
    return
  }
  
  if (type === 'file') {
    // 单个文件，直接创建任务
    const taskId = `download-${Date.now()}-${Math.random()}`
    const task: DownloadTask = {
      id: taskId,
      name,
      remotePath,
      localPath,
      status: 'pending',
      progress: 0,
      size
    }
    
    downloadTasks.value.push(task)
    executeDownloadTask(task)
  } else {
    // 文件夹，边扫描边下载（流式处理）
    console.log(`[文件夹下载] 开始扫描并下载: ${remotePath} -> ${localPath}`)
    
    try {
      const fileCount = await collectAndAddDownloadTasks(remotePath, localPath)
      
      if (fileCount === 0) {
        alert('文件夹为空或无法访问')
      } else {
        console.log(`[文件夹下载] 已添加 ${fileCount} 个文件到下载队列`)
      }
    } catch (error: any) {
      console.error('[文件夹下载] 错误:', error)
      alert(`扫描文件失败: ${error.message}`)
    }
  }
}

// 更新任务状态（确保 Vue 响应式更新）
const updateTaskStatus = (taskId: string, updates: Partial<DownloadTask>) => {
  const index = downloadTasks.value.findIndex(t => t.id === taskId)
  if (index >= 0) {
    // 创建新对象替换，确保响应式更新
    downloadTasks.value[index] = { ...downloadTasks.value[index], ...updates }
    console.log(`[状态更新] ${downloadTasks.value[index].name} -> ${updates.status || '属性更新'}`)
  }
}

// 执行下载任务
const executeDownloadTask = async (task: DownloadTask) => {
  if (task.cancelled || !currentConnectionId.value || !window.electronAPI) return
  
  // 检查全局取消标志
  if (isDownloadCancelled) {
    console.log(`[下载任务] 全局已取消，不执行: ${task.name}`)
    updateTaskStatus(task.id, { cancelled: true, status: 'cancelled' })
    return
  }
  
  // 等待前面的任务（简单的队列控制，避免同时下载太多）
  while (downloadTasks.value.filter(t => t.status === 'downloading').length >= 3) {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (task.cancelled || isDownloadCancelled) return
  }
  
  // 再等待一小段时间，避免瞬间大量并发导致目录创建冲突
  await new Promise(resolve => setTimeout(resolve, 10))
  
  // 再次检查
  if (isDownloadCancelled) {
    updateTaskStatus(task.id, { cancelled: true, status: 'cancelled' })
    return
  }
  
  console.log(`[下载任务] 开始: ${task.name}`)
  console.log(`[下载任务] 远程: ${task.remotePath}`)
  console.log(`[下载任务] 本地: ${task.localPath}`)
  
  updateTaskStatus(task.id, { status: 'downloading', progress: 0 })
  
  // 获取最新的任务引用
  const getTask = () => downloadTasks.value.find(t => t.id === task.id)
  
  // 模拟进度更新
  const progressInterval = setInterval(() => {
    const currentTask = getTask()
    if (currentTask && currentTask.status === 'downloading' && currentTask.progress < 90) {
      updateTaskStatus(task.id, { progress: currentTask.progress + 10 })
    }
  }, 200)
  
  try {
    // 确保本地目录存在 - 使用 path 分隔符（支持 Windows 和 Unix）
    const pathSeparator = task.localPath.includes('\\') ? '\\' : '/'
    const lastSeparatorIndex = task.localPath.lastIndexOf(pathSeparator)
    
    if (lastSeparatorIndex > 0) {
      const localDir = task.localPath.substring(0, lastSeparatorIndex)
      // 使用带锁机制的目录创建函数
      await ensureDirectoryExists(localDir)
    }
    
    // 下载文件（带重试机制）
    console.log(`[下载任务] 开始传输文件...`)
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      try {
        await window.electronAPI.ssh.downloadFile(
          currentConnectionId.value,
          task.remotePath,
          task.localPath
        )
        break // 成功，退出重试循环
      } catch (downloadError: any) {
        retryCount++
        if (retryCount >= maxRetries) {
          throw downloadError // 达到最大重试次数，抛出错误
        }
        console.warn(`[下载任务] 下载失败，重试 ${retryCount}/${maxRetries}:`, downloadError.message)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)) // 递增延迟
      }
    }
    
    clearInterval(progressInterval)
    updateTaskStatus(task.id, { progress: 100, status: 'completed' })
    console.log(`[下载任务] 完成: ${task.name}`)
    console.log(`[下载计数] 已完成/总数: ${completedDownloadsCount.value}/${downloadTasks.value.length}`)
    
    // 检查是否所有任务都完成了
    checkAndAutoCleanup()
  } catch (error: any) {
    clearInterval(progressInterval)
    console.error(`[下载任务] 失败: ${task.name}`, error)
    const currentTask = getTask()
    if (currentTask && !currentTask.cancelled) {
      updateTaskStatus(task.id, { status: 'error', error: error.message || '下载失败' })
    }
    
    // 即使失败也检查是否需要清理
    checkAndAutoCleanup()
  }
}

// 检查并自动清理已完成的任务
const checkAndAutoCleanup = () => {
  const allDone = downloadTasks.value.length > 0 && 
                  downloadTasks.value.every(t => 
                    t.status === 'completed' || 
                    t.status === 'error' || 
                    t.status === 'cancelled'
                  )
  
  console.log('[下载管理] 检查任务状态:', {
    allDone,
    total: downloadTasks.value.length,
    statuses: downloadTasks.value.map(t => ({ name: t.name, status: t.status }))
  })
  
  if (allDone) {
    // 清除之前的定时器
    if (autoCleanupTimer) {
      clearTimeout(autoCleanupTimer)
    }
    
    // 找到第一个成功下载的文件，打开其所在目录
    const firstCompletedTask = downloadTasks.value.find(t => t.status === 'completed')
    if (firstCompletedTask && window.electronAPI) {
      const localPath = firstCompletedTask.localPath
      // 提取目录路径（去掉文件名）
      const pathSeparator = localPath.includes('\\') ? '\\' : '/'
      const lastSeparatorIndex = localPath.lastIndexOf(pathSeparator)
      
      if (lastSeparatorIndex > 0) {
        const dirPath = localPath.substring(0, lastSeparatorIndex)
        console.log('[下载管理] 打开下载目录:', dirPath)
        
        // 异步打开目录，不阻塞后续流程
        window.electronAPI.fs.openPath(dirPath).catch((error: any) => {
          console.error('[下载管理] 打开目录失败:', error)
        })
      }
    }
    
    console.log('[下载管理] 所有任务已完成，1.5秒后自动清理')
    autoCleanupTimer = setTimeout(() => {
      console.log('[下载管理] 执行自动清理')
      clearCompletedTasks()
      autoCleanupTimer = null
    }, 1500)
  }
}

// 取消下载
const cancelDownload = (taskId: string) => {
  const task = downloadTasks.value.find(t => t.id === taskId)
  if (task) {
    updateTaskStatus(taskId, { cancelled: true, status: 'cancelled' })
    checkAndAutoCleanup()
  }
}

// 取消所有下载
const cancelAllDownloads = () => {
  console.log('[下载管理] 取消所有下载')
  // 设置全局取消标志，阻止新任务创建
  isDownloadCancelled = true
  
  // 取消所有现有任务
  downloadTasks.value.forEach(task => {
    if (task.status === 'downloading' || task.status === 'pending') {
      updateTaskStatus(task.id, { cancelled: true, status: 'cancelled' })
    }
  })
  checkAndAutoCleanup()
}

// 移除下载任务
const removeDownloadTask = (taskId: string) => {
  const index = downloadTasks.value.findIndex(t => t.id === taskId)
  if (index >= 0) {
    downloadTasks.value.splice(index, 1)
  }
}

// 清除已完成的任务
const clearCompletedTasks = () => {
  downloadTasks.value = downloadTasks.value.filter(t => 
    t.status !== 'completed' && t.status !== 'error' && t.status !== 'cancelled'
  )
  
  // 如果所有任务都清除了，重置取消标志，允许下次下载
  if (downloadTasks.value.length === 0) {
    console.log('[下载管理] 所有任务已清除，重置取消标志')
    isDownloadCancelled = false
  }
}

// 批量下载
const handleBulkDownload = async () => {
  if (selectedFiles.value.length === 0 || !window.electronAPI) return

  try {
    const folderPath = await window.electronAPI.fs.showOpenDialog({
      title: '选择下载目录',
      properties: ['openDirectory']
    })

    if (folderPath && folderPath.length > 0) {
      // 重置取消标志，允许新的下载任务
      isDownloadCancelled = false
      
      // 为每个选中的文件/文件夹创建下载任务
      for (const file of selectedFiles.value) {
        const remotePath = currentPath.value === '/' 
          ? `/${file.name}` 
          : `${currentPath.value}/${file.name}`
        const localPath = `${folderPath[0]}/${file.name}`
        
        await addDownloadTask(file.name, file.type, remotePath, localPath, file.size || 0)
      }
      
      selectedFiles.value = []
      // 不自动打开下载管理器，用户可以点击状态栏查看
    }
  } catch (error: any) {
    console.error('Bulk download error:', error)
    alert(`批量下载失败: ${error.message}`)
  }
}

// 删除文件
const deleteFile = async (file: FileItem) => {
  if (!confirm(`确定要删除 "${file.name}" 吗？`)) return

  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    const remotePath = currentPath.value === '/' 
      ? `/${file.name}` 
      : `${currentPath.value}/${file.name}`
    
    loading.value = true
    await window.electronAPI.ssh.deleteFile(
      currentConnectionId.value,
      remotePath,
      file.type === 'directory'
    )
    
    await loadFiles()
  } catch (error: any) {
    console.error('Delete error:', error)
    alert(`删除失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 批量删除
const handleBulkDelete = async () => {
  if (selectedFiles.value.length === 0) return
  
  if (!confirm(`确定要删除选中的 ${selectedFiles.value.length} 个项目吗？`)) return

  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    loading.value = true
    
    for (const file of selectedFiles.value) {
      const remotePath = currentPath.value === '/' 
        ? `/${file.name}` 
        : `${currentPath.value}/${file.name}`
      
      await window.electronAPI.ssh.deleteFile(
        currentConnectionId.value,
        remotePath,
        file.type === 'directory'
      )
    }
    
    selectedFiles.value = []
    await loadFiles()
  } catch (error: any) {
    console.error('Bulk delete error:', error)
    alert(`批量删除失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 新建文件夹 - 显示对话框
const createFolder = () => {
  newFolderName.value = ''
  showCreateFolderDialog.value = true
  // 延迟聚焦输入框
  nextTick(() => {
    folderNameInput.value?.focus()
  })
}

// 确认创建文件夹
const confirmCreateFolder = async () => {
  const folderName = newFolderName.value.trim()
  if (!folderName) return

  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    const remotePath = currentPath.value === '/' 
      ? `/${folderName}` 
      : `${currentPath.value}/${folderName}`
    
    loading.value = true
    showCreateFolderDialog.value = false
    
    await window.electronAPI.ssh.createDirectory(
      currentConnectionId.value,
      remotePath
    )
    
    await loadFiles()
  } catch (error: any) {
    console.error('Create folder error:', error)
    alert(`创建文件夹失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 取消创建文件夹
const cancelCreateFolder = () => {
  showCreateFolderDialog.value = false
  newFolderName.value = ''
}

// 工具函数
const getFileIcon = (file: FileItem) => {
  if (file.type === 'directory') {
    return 'bi bi-folder-fill'
  }
  
  const ext = file.name.split('.').pop()?.toLowerCase()
  const iconMap: Record<string, string> = {
    'txt': 'bi bi-file-text',
    'pdf': 'bi bi-file-pdf',
    'doc': 'bi bi-file-word',
    'docx': 'bi bi-file-word',
    'xls': 'bi bi-file-excel',
    'xlsx': 'bi bi-file-excel',
    'ppt': 'bi bi-file-ppt',
    'pptx': 'bi bi-file-ppt',
    'zip': 'bi bi-file-zip',
    'rar': 'bi bi-file-zip',
    'jpg': 'bi bi-file-image',
    'jpeg': 'bi bi-file-image',
    'png': 'bi bi-file-image',
    'gif': 'bi bi-file-image',
    'mp3': 'bi bi-file-music',
    'mp4': 'bi bi-file-play',
    'avi': 'bi bi-file-play',
  }
  
  return iconMap[ext || ''] || 'bi bi-file-earmark'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听 connectionId 变化
watch(() => actualConnectionId.value, (newId) => {
  if (newId) {
    currentConnectionId.value = newId
    connectionStatus.value = 'connected'
    loadFiles()
  }
})

// 生命周期
onMounted(async () => {
  // ✅ 加载 SSH 树
  await loadSSHTree()
  
  if (actualConnectionId.value) {
    // 如果已经有连接ID（从侧边栏传入），直接使用
    currentConnectionId.value = actualConnectionId.value
    connectionStatus.value = 'connected'
    loadFiles()
  } else {
    // 否则尝试建立新连接
    connectToSSH()
  }
})

onBeforeUnmount(() => {
  // 清理自动清理定时器
  if (autoCleanupTimer) {
    clearTimeout(autoCleanupTimer)
    autoCleanupTimer = null
  }
  // 断开连接（可选，因为可能还在用终端）
  // if (currentConnectionId.value && window.electronAPI) {
  //   window.electronAPI.ssh.disconnect(currentConnectionId.value).catch(console.error)
  // }
})
</script>

<style scoped>
.file-manager-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vscode-bg);
}

.file-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vscode-bg-lighter);
  border-bottom: 1px solid var(--vscode-border);
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

.status-badge i {
  font-size: 8px;
}

.status-badge.connected {
  color: #0dbc79;
  background-color: rgba(13, 188, 121, 0.1);
}

.status-badge.disconnected {
  color: #cd3131;
  background-color: rgba(205, 49, 49, 0.1);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg-light);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toolbar-btn:hover:not(:disabled) {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.primary {
  background: var(--vscode-accent);
  border-color: var(--vscode-accent);
  color: #ffffff;
}

.toolbar-btn.primary:hover:not(:disabled) {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

.toolbar-btn.danger {
  color: var(--vscode-error);
}

.toolbar-btn.danger:hover:not(:disabled) {
  background: var(--vscode-error);
  border-color: var(--vscode-error);
  color: #ffffff;
}

.path-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg-light);
}

.path-input {
  flex: 1;
  padding: 6px 12px;
  background: var(--vscode-bg-input);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  outline: none;
}

.path-input:focus {
  border-color: var(--vscode-accent);
}

.file-list-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.selected-count {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.1);
  border: 1px solid var(--vscode-accent);
  border-radius: 4px;
  color: var(--vscode-accent);
  font-size: 13px;
  font-weight: 500;
  margin-right: 8px;
}

.file-list-header {
  display: grid;
  grid-template-columns: 40px 1fr 100px 150px 100px;
  gap: 12px;
  padding: 6px 12px;
  background: var(--vscode-bg-lighter);
  border-bottom: 1px solid var(--vscode-border);
  font-size: 11px;
  font-weight: 600;
  color: var(--vscode-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.file-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--vscode-border) transparent;
}

.file-list::-webkit-scrollbar {
  width: 8px;
}

.file-list::-webkit-scrollbar-track {
  background: transparent;
}

.file-list::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 4px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--vscode-fg-muted);
  gap: 16px;
}

.loading-state i,
.empty-state i {
  font-size: 48px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vscode-border);
  border-top-color: var(--vscode-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.file-item {
  display: grid;
  grid-template-columns: 40px 1fr 100px 150px 100px;
  gap: 12px;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.1s ease;
}

.file-item:hover {
  background: var(--vscode-bg-lighter);
}

.file-item.selected {
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.15);
}

/* 分隔线样式 - 使用更细的线条 */
.file-item:not(:last-child) {
  border-bottom: 1px solid rgba(var(--vscode-border-rgb, 128, 128, 128), 0.1);
}

/* 返回上级目录样式 */
.file-item.parent-dir {
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.05);
  font-weight: 500;
}

.file-item.parent-dir:hover {
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.1);
}

.file-item.parent-dir .file-icon {
  color: var(--vscode-accent);
  font-size: 16px;
}

.file-item.parent-dir .file-name {
  color: var(--vscode-fg);
  font-weight: 500;
}

.parent-hint {
  font-size: 11px;
  color: var(--vscode-fg-muted);
  font-style: italic;
}

.file-col-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-col-name {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.file-icon {
  flex-shrink: 0;
  font-size: 14px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.file-col-size,
.file-col-modified,
.file-col-actions {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.file-col-actions {
  gap: 6px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.file-item:hover .file-col-actions {
  opacity: 1;
}

.action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  color: var(--vscode-fg-muted);
  transition: all 0.15s ease;
  font-size: 12px;
}

.action-btn:hover {
  background: var(--vscode-bg);
  border-color: var(--vscode-border);
  color: var(--vscode-fg);
}

.action-btn.danger:hover {
  background: var(--vscode-error);
  border-color: var(--vscode-error);
  color: #ffffff;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid var(--vscode-border);
  background: var(--vscode-bg-lighter);
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 下载进度指示器 */
.download-progress-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-accent);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
}

.download-progress-indicator:hover {
  background: var(--vscode-bg-lighter);
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.download-progress-indicator i {
  color: var(--vscode-accent);
  font-size: 14px;
  animation: bounce 2s infinite;
  flex-shrink: 0;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.progress-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.progress-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--vscode-fg);
}

.download-count {
  font-weight: 600;
  color: var(--vscode-accent);
  white-space: nowrap;
}

.current-file {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vscode-fg);
}

.download-status {
  color: var(--vscode-fg-muted);
  font-style: italic;
}

.download-progress-indicator .progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.download-progress-indicator .progress-fill {
  height: 100%;
  background: var(--vscode-accent);
  transition: width 0.3s ease;
}

.host-info {
  color: var(--vscode-fg-muted);
}

/* 新建文件夹对话框 */
.create-folder-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.2s ease;
}

.create-folder-dialog {
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.create-folder-dialog .modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg-lighter);
}

.create-folder-dialog .modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.create-folder-dialog .modal-body {
  padding: 24px 20px;
}

.folder-name-input {
  width: 100%;
  padding: 10px 12px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.folder-name-input:focus {
  border-color: var(--vscode-focus-border);
}

.folder-name-input::placeholder {
  color: var(--vscode-fg-muted);
}

.create-folder-dialog .modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--vscode-border);
  background: var(--vscode-bg-lighter);
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: transparent;
  color: var(--vscode-fg);
  border: 1px solid var(--vscode-border);
}

.btn-cancel:hover {
  background: var(--vscode-bg-lighter);
}

.btn-confirm {
  background: var(--vscode-button-bg);
  color: var(--vscode-button-fg);
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-confirm:hover:not(:disabled) {
  background: var(--vscode-button-hover-bg);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 下载管理器弹窗 */
.download-manager-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.download-manager-modal {
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.download-manager-modal .modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg-lighter);
}

.download-manager-modal .modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--vscode-fg-muted);
  transition: all 0.15s ease;
}

.close-btn:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.empty-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--vscode-fg-muted);
}

.empty-tasks i {
  font-size: 48px;
  margin-bottom: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.task-item:hover {
  border-color: var(--vscode-accent);
}

.task-item.completed {
  opacity: 0.7;
}

.task-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 18px;
}

.task-item.downloading .task-icon {
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.1);
  color: var(--vscode-accent);
}

.task-item.completed .task-icon {
  background: rgba(13, 188, 121, 0.1);
  color: #0dbc79;
}

.task-item.error .task-icon {
  background: rgba(205, 49, 49, 0.1);
  color: var(--vscode-error);
}

.task-item.cancelled .task-icon {
  background: rgba(128, 128, 128, 0.1);
  color: var(--vscode-fg-muted);
}

.spinning {
  animation: spin 1s linear infinite;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 6px;
}

.task-details {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--vscode-fg-muted);
  margin-bottom: 6px;
}

.task-type {
  padding: 2px 6px;
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.1);
  border-radius: 3px;
  color: var(--vscode-accent);
}

.task-status.success {
  color: #0dbc79;
}

.task-status.error {
  color: var(--vscode-error);
}

.task-status.cancelled {
  color: var(--vscode-fg-muted);
}

.task-progress-bar {
  height: 3px;
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.task-progress-bar .progress-fill {
  height: 100%;
  background: var(--vscode-accent);
  transition: width 0.3s ease;
}

.task-error {
  font-size: 11px;
  color: var(--vscode-error);
  margin-top: 4px;
}

.task-actions {
  display: flex;
  gap: 4px;
}

.task-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  color: var(--vscode-fg-muted);
  transition: all 0.15s ease;
}

.task-btn:hover {
  background: var(--vscode-bg);
  border-color: var(--vscode-border);
  color: var(--vscode-fg);
}

.task-btn.cancel:hover {
  background: var(--vscode-error);
  border-color: var(--vscode-error);
  color: #ffffff;
}

.modal-footer {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--vscode-border);
  background: var(--vscode-bg-lighter);
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.footer-btn:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.footer-btn.danger {
  color: var(--vscode-error);
}

.footer-btn.danger:hover {
  background: var(--vscode-error);
  border-color: var(--vscode-error);
  color: #ffffff;
}

/* Bootstrap Icons */
.bi-folder-open::before { content: "📂"; }
.bi-arrow-left::before { content: "←"; }
.bi-arrow-up-circle::before { content: "⬆"; }
.bi-house::before { content: "🏠"; }
.bi-arrow-clockwise::before { content: "↻"; }
.bi-upload::before { content: "⬆"; }
.bi-folder-plus::before { content: "📁+"; }
.bi-download::before { content: "⬇"; }
.bi-trash::before { content: "🗑"; }
.bi-x::before { content: "✕"; }
.bi-x-lg::before { content: "✕"; font-size: 10px; font-weight: bold; }
.bi-folder::before { content: "📁"; }
.bi-folder-fill::before { content: "📁"; }
.bi-file-text::before { content: "📄"; }
.bi-file-pdf::before { content: "📕"; }
.bi-file-word::before { content: "📘"; }
.bi-file-excel::before { content: "📗"; }
.bi-file-ppt::before { content: "📙"; }
.bi-file-zip::before { content: "📦"; }
.bi-file-image::before { content: "🖼"; }
.bi-file-music::before { content: "🎵"; }
.bi-file-play::before { content: "🎬"; }
.bi-file-earmark::before { content: "📄"; }
.bi-circle-fill::before { content: "●"; }
.bi-arrow-down-circle::before { content: "⬇"; }
.bi-check-circle::before { content: "✓"; }
.bi-x-circle::before { content: "✕"; }
.bi-dash-circle::before { content: "—"; }
.bi-clock::before { content: "⏱"; }
.bi-inbox::before { content: "📥"; }
.bi-check-all::before { content: "✓✓"; }
</style>

