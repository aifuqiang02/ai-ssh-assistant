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
    <div
      class="file-list-wrapper"
      :class="{
        'drag-upload-active': isDragOverUpload,
        'drag-download-active': isDragOverDownload
      }"
      @dragenter="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- 文件列表头部 -->
      <div class="file-list-header">
        <div class="file-col-checkbox">
          <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
        </div>
        <div class="file-col-name">名称</div>
        <div class="file-col-size">大小</div>
        <div class="file-col-modified">修改时间</div>
        <div class="file-col-actions">操作</div>
      </div>

      <!-- 文件列表 -->
      <div class="file-list">
        <div v-if="files.length === 0 && displayedPath === '/'" class="empty-state">
          <i class="bi bi-folder-open"></i>
          <span>此目录为空</span>
        </div>

        <template v-else>
          <!-- 返回上级目录 -->
          <div v-if="displayedPath !== '/'" class="file-item parent-dir" @click="goBack">
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
            :key="file.identity || file.name"
            :class="['file-item', { selected: isFileSelected(file) }]"
            draggable="true"
            @click="handleFileClick(file)"
            @dblclick="handleFileDoubleClick(file)"
            @dragstart="handleFileDragStart($event, file)"
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
                class="action-btn primary"
                @click="downloadFile(file)"
                :title="file.type === 'directory' ? '下载文件夹' : '下载文件'"
              >
                <i class="bi bi-download"></i>
                <span>下载</span>
              </button>
              <button class="action-btn danger" @click="deleteFile(file)" title="删除">
                <i class="bi bi-trash"></i>
                <span>删除</span>
              </button>
            </div>
          </div>
        </template>
      </div>

      <div
        v-if="isDragOverUpload || isDragOverDownload"
        class="file-drop-overlay"
        :class="{ download: isDragOverDownload }"
      >
        <i :class="isDragOverDownload ? 'bi bi-cloud-arrow-down' : 'bi bi-cloud-arrow-up'"></i>
        <p>
          {{
            isDragOverDownload ? '释放以开始下载（支持文件夹递归）' : '释放以上传（支持文件夹递归）'
          }}
        </p>
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-left">
        {{ files.length }} 个项目
        <span v-if="selectedFiles.length > 0"> - 已选择 {{ selectedFiles.length }} 个</span>
      </div>
      <div class="status-right">
        <!-- 上传进度显示 -->
        <div
          v-if="hasActiveUploads"
          class="upload-progress-indicator"
          @click="showUploadManager = true"
          title="点击查看上传详情"
        >
          <i class="bi bi-upload"></i>
          <div class="progress-info">
            <div class="progress-text">
              <span class="upload-count"
                >{{ completedUploadsCount }}/{{ activeUploadsCount + completedUploadsCount }}</span
              >
              <span v-if="currentUploadingTask" class="current-file">{{
                currentUploadingTask.name
              }}</span>
              <span v-if="currentUploadingTask" class="upload-status"
                >{{ currentUploadingTask.progress }}%</span
              >
              <span v-else-if="hasActiveUploads" class="upload-status">上传中...</span>
              <span v-else class="upload-status">等待中</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: (currentUploadingTask ? currentUploadingTask.progress : 0) + '%' }"
              ></div>
            </div>
          </div>
        </div>

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
              <span class="download-count"
                >{{ completedDownloadsCount }}/{{
                  activeDownloadsCount + completedDownloadsCount
                }}</span
              >
              <span v-if="currentDownloadingTask" class="current-file">{{
                currentDownloadingTask.name
              }}</span>
              <span v-else class="download-status">{{ currentTaskProgress }}%</span>
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
    <div
      v-if="showCreateFolderDialog"
      class="create-folder-overlay"
      @click.self="cancelCreateFolder"
    >
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
          <button
            class="btn-confirm"
            @click="confirmCreateFolder"
            :disabled="!newFolderName.trim()"
          >
            <i class="bi bi-check"></i>
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 下载管理器弹窗 -->
    <div
      v-if="showDownloadManager"
      class="download-manager-overlay"
      @click.self="showDownloadManager = false"
    >
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
                <i
                  v-if="task.status === 'downloading'"
                  class="bi bi-arrow-down-circle spinning"
                ></i>
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
                  <span v-else-if="task.status === 'completed'" class="task-status success"
                    >已完成</span
                  >
                  <span v-else-if="task.status === 'error'" class="task-status error">{{
                    task.error || '失败'
                  }}</span>
                  <span v-else-if="task.status === 'cancelled'" class="task-status cancelled"
                    >已取消</span
                  >
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

    <!-- 上传管理器弹窗 -->
    <div
      v-if="showUploadManager"
      class="upload-manager-overlay"
      @click.self="showUploadManager = false"
    >
      <div class="upload-manager-modal">
        <div class="modal-header">
          <h3>上传管理器</h3>
          <button class="close-btn" @click="showUploadManager = false">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="uploadTasks.length === 0" class="empty-tasks">
            <i class="bi bi-cloud-upload"></i>
            <p>暂无上传任务</p>
          </div>
          <div v-else class="task-list">
            <div v-for="task in uploadTasks" :key="task.id" :class="['task-item', task.status]">
              <div class="task-icon">
                <i v-if="task.status === 'uploading'" class="bi bi-arrow-up-circle spinning"></i>
                <i v-else-if="task.status === 'completed'" class="bi bi-check-circle"></i>
                <i v-else-if="task.status === 'error'" class="bi bi-x-circle"></i>
                <i v-else-if="task.status === 'cancelled'" class="bi bi-dash-circle"></i>
                <i v-else class="bi bi-clock"></i>
              </div>
              <div class="task-info">
                <div class="task-name">{{ task.name }}</div>
                <div class="task-details">
                  <span class="task-size">{{ formatFileSize(task.size) }}</span>
                  <span v-if="task.status === 'uploading'" class="task-progress">
                    {{ task.progress }}%
                  </span>
                  <span v-else-if="task.status === 'completed'" class="task-status success"
                    >已完成</span
                  >
                  <span v-else-if="task.status === 'error'" class="task-status error">{{
                    task.error || '失败'
                  }}</span>
                  <span v-else-if="task.status === 'cancelled'" class="task-status cancelled"
                    >已取消</span
                  >
                  <span v-else class="task-status pending">等待中</span>
                </div>
                <div v-if="task.status === 'uploading'" class="task-progress-bar">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
              </div>
              <div class="task-actions">
                <button
                  v-if="task.status === 'uploading' || task.status === 'pending'"
                  class="task-btn cancel"
                  @click="cancelUploadTask(task.id)"
                  title="取消上传"
                >
                  <i class="bi bi-x"></i>
                </button>
                <button
                  v-else
                  class="task-btn remove"
                  @click="removeUploadTask(task.id)"
                  title="移除"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="footer-btn" @click="clearCompletedUploadTasks">
            <i class="bi bi-check-all"></i>
            清除已完成
          </button>
          <button class="footer-btn danger" @click="cancelAllUploads">
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
import { useRoute, useRouter } from 'vue-router'
import { sshService } from '@/services/ssh.service'
import { settingsService } from '@/services/settings.service'
import { findNode } from '@/utils/tree-utils'
import { $alert, $confirm } from '@/composables/useDialog'

interface FileItem {
  name: string
  identity?: string
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

interface UploadTask {
  id: string
  name: string
  localPath: string
  remotePath: string
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'cancelled'
  progress: number
  size: number
  error?: string
  cancelled?: boolean
}

interface FileListCacheEntry {
  files: FileItem[]
  cachedAt: number
}

const DRAG_DOWNLOAD_MIME = 'application/x-ai-ssh-remote-files'

interface DragDownloadPayloadItem {
  name: string
  type: 'file' | 'directory'
  remotePath: string
  size?: number
}

interface DroppedFileInfo {
  localPath: string
  relativePath: string
  size: number
}

interface DroppedFilesPayload {
  files: DroppedFileInfo[]
  directories: Set<string>
}

type FileSystemEntry = FileSystemFileEntry | FileSystemDirectoryEntry

interface FileSystemEntryBase {
  isFile: boolean
  isDirectory: boolean
  name: string
  fullPath: string
}

interface FileSystemFileEntry extends FileSystemEntryBase {
  isFile: true
  file: (callback: (file: File) => void, errorCallback?: (error: DOMException) => void) => void
}

interface FileSystemDirectoryEntry extends FileSystemEntryBase {
  isDirectory: true
  createReader: () => FileSystemDirectoryReader
}

interface FileSystemDirectoryReader {
  readEntries: (
    successCallback: (entries: FileSystemEntry[]) => void,
    errorCallback?: (error: DOMException) => void
  ) => void
}

// 路由
const route = useRoute()
const router = useRouter()

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
  return decodeURIComponent((route.query.name as string) || '文件管理器')
})

const actualHost = computed(() => {
  return decodeURIComponent((route.query.host as string) || '')
})

const actualPort = computed(() => {
  return (route.query.port as string) || '22'
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
const displayedPath = ref('/')
const files = ref<FileItem[]>([])
const fileListCache = new Map<string, FileListCacheEntry>()
const selectedFiles = ref<FileItem[]>([])
const connectionStatus = ref<'disconnected' | 'connected'>('disconnected')
const currentConnectionId = ref<string>('')
const isDragOverUpload = ref(false)
const isDragOverDownload = ref(false)
const dragUploadDepth = ref(0)
const dragDownloadDepth = ref(0)
// 下载管理
const downloadTasks = ref<DownloadTask[]>([])
const showDownloadManager = ref(false)

// 上传管理
const uploadTasks = ref<UploadTask[]>([])
const showUploadManager = ref(false)
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
  return downloadTasks.value.filter(t => t.status === 'downloading' || t.status === 'pending')
    .length
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

const hasInitializedRouteState = ref(false)

// 上传进度计算
const activeUploadsCount = computed(() => {
  return uploadTasks.value.filter(t => t.status === 'uploading' || t.status === 'pending').length
})

const completedUploadsCount = computed(() => {
  return uploadTasks.value.filter(t => t.status === 'completed').length
})

const hasActiveUploads = computed(() => {
  return uploadTasks.value.some(t => t.status === 'pending' || t.status === 'uploading')
})

const currentUploadingTask = computed(() => {
  return uploadTasks.value.find(t => t.status === 'uploading')
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
    downloading: 1, // 最高优先级
    pending: 2, // 第二优先级
    completed: 3, // 第三优先级
    error: 4, // 第四优先级
    cancelled: 5 // 最低优先级
  }

  return [...downloadTasks.value].sort((a, b) => {
    const priorityA = statusPriority[a.status] || 999
    const priorityB = statusPriority[b.status] || 999
    return priorityA - priorityB
  })
})

let fileListRequestSequence = 0
let latestFileListRequestId = 0

const getFileListCacheKey = (connectionId: string, remotePath: string) =>
  `${connectionId}:${remotePath}`

const applyCachedFilesIfAvailable = (connectionId: string, remotePath: string) => {
  const cached = fileListCache.get(getFileListCacheKey(connectionId, remotePath))
  if (!cached) {
    return false
  }

  files.value = cached.files
  displayedPath.value = remotePath
  return true
}

const invalidateFileListCache = (remotePath: string) => {
  if (!currentConnectionId.value) {
    return
  }

  fileListCache.delete(getFileListCacheKey(currentConnectionId.value, remotePath))
}

// 建立连接
const connectToSSH = async () => {
  const config = getNodeConfig()
  if (!config || !window.electronAPI) return

  try {
    const settings = await settingsService.getSettings()
    const result = await window.electronAPI.ssh.connect({
      ...config,
      timeout: settings?.ssh?.timeout || 10,
      keepAlive: settings?.ssh?.keepAlive !== false,
      keepAliveInterval: settings?.ssh?.keepAliveInterval ?? 15
    })

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

  const connectionId = currentConnectionId.value
  const requestPath = currentPath.value
  const requestSequence = ++fileListRequestSequence
  const requestId = `fm-${requestSequence}`
  latestFileListRequestId = requestSequence
  const startTime = performance.now()
  const cacheKey = getFileListCacheKey(connectionId, requestPath)

  applyCachedFilesIfAvailable(connectionId, requestPath)

  try {
    const result = await window.electronAPI.ssh.listFiles(connectionId, requestPath)

    const duration = Math.round(performance.now() - startTime)

    if (latestFileListRequestId !== requestSequence || currentConnectionId.value !== connectionId) {
      return
    }

    if (result.success) {
      files.value = result.files
      displayedPath.value = requestPath
      fileListCache.set(cacheKey, { files: result.files, cachedAt: Date.now() })
    } else {
      console.warn(`[FileManager] [${requestId}] 列表加载失败`, {
        path: currentPath.value,
        durationMs: duration,
        error: result.error
      })
      $alert(`加载文件列表失败: ${result.error}`)
    }
  } catch (error: any) {
    const duration = Math.round(performance.now() - startTime)
    console.warn(`[FileManager] [${requestId}] 列表加载异常`, {
      path: currentPath.value,
      durationMs: duration,
      error: error.message
    })
    $alert(`加载文件列表失败: ${error.message}`)
  }
}

const syncCurrentPathToRoute = () => {
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      path: encodeURIComponent(currentPath.value)
    }
  })
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
  const basePath = displayedPath.value
  const previousPath = basePath
  if (basePath === '/') {
    currentPath.value = `/${dirName}`
  } else {
    currentPath.value = `${basePath}/${dirName}`
  }

  syncCurrentPathToRoute()
  selectedFiles.value = []
  loadFiles()
}

const navigateToPath = () => {
  syncCurrentPathToRoute()
  selectedFiles.value = []
  loadFiles()
}

const goBack = () => {
  if (displayedPath.value === '/') return

  const previousPath = displayedPath.value
  const parts = displayedPath.value.split('/').filter(p => p)
  parts.pop()
  currentPath.value = parts.length > 0 ? '/' + parts.join('/') : '/'

  syncCurrentPathToRoute()
  selectedFiles.value = []
  loadFiles()
}

const goHome = () => {
  const previousPath = currentPath.value
  currentPath.value = '/'

  syncCurrentPathToRoute()
  selectedFiles.value = []
  loadFiles()
}

const refreshFiles = () => {
  selectedFiles.value = []
  invalidateFileListCache(currentPath.value)
  loadFiles()
}

// 文件选择
const isFileSelected = (file: FileItem) => {
  return selectedFiles.value.some(f => (f.identity || f.name) === (file.identity || file.name))
}

const toggleFileSelection = (file: FileItem) => {
  const index = selectedFiles.value.findIndex(
    f => (f.identity || f.name) === (file.identity || file.name)
  )
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

const normalizeRemotePath = (value: string) => {
  if (!value) return '/'
  let normalized = value.replace(/\\/g, '/').replace(/\/+/g, '/')
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  return normalized || '/'
}

const joinRemotePath = (base: string, relative: string) => {
  const sanitizedRelative = (relative || '').replace(/\\/g, '/').replace(/^\/+/, '')
  if (!sanitizedRelative) {
    return normalizeRemotePath(base || '/')
  }
  if (!base || base === '/') {
    return normalizeRemotePath(`/${sanitizedRelative}`)
  }
  return normalizeRemotePath(`${base}/${sanitizedRelative}`)
}

const getRemoteDirname = (remotePath: string) => {
  const normalized = normalizeRemotePath(remotePath)
  if (normalized === '/') return '/'
  const lastSlash = normalized.lastIndexOf('/')
  if (lastSlash <= 0) return '/'
  return normalized.substring(0, lastSlash) || '/'
}

const ensureRemoteDirectoryExists = async (remoteDir: string, cache: Set<string>) => {
  if (!currentConnectionId.value || !window.electronAPI) return
  const normalized = normalizeRemotePath(remoteDir)
  if (normalized === '/' || cache.has(normalized)) return

  try {
    await window.electronAPI.ssh.createDirectory(currentConnectionId.value, normalized)
    cache.add(normalized)
  } catch (error: any) {
    // 如果目录已存在会抛错，忽略即可
    console.warn(`[远程目录] 创建失败（可能已存在）: ${normalized}`, error.message)
    cache.add(normalized)
  }
}

const ensureParentDirectories = async (remotePath: string, cache: Set<string>) => {
  const parent = getRemoteDirname(remotePath)
  if (!parent || parent === '/') return

  const segments = parent.split('/').filter(segment => segment.length > 0)
  let current = ''
  for (const segment of segments) {
    current += `/${segment}`
    await ensureRemoteDirectoryExists(current, cache)
  }
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
      // 获取每个文件的大小信息
      const fileStats = await Promise.all(
        filePaths.map(async localPath => {
          try {
            const stats = await window.electronAPI!.fs.getStats(localPath)
            return { localPath, size: stats.size }
          } catch (error) {
            console.warn(`[上传] 获取文件信息失败 ${localPath}:`, error)
            return { localPath, size: 0 }
          }
        })
      )

      // 创建上传任务队列
      const tasks: UploadTask[] = fileStats.map(({ localPath, size }) => {
        const fileName = localPath.split(/[/\\]/).pop() || 'file'
        const remotePath =
          currentPath.value === '/' ? `/${fileName}` : `${currentPath.value}/${fileName}`

        return {
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: fileName,
          localPath,
          remotePath,
          status: 'pending' as const,
          progress: 0,
          size
        }
      })

      // 添加到上传任务队列
      uploadTasks.value.push(...tasks)

      // 异步处理上传任务，不阻塞UI
      uploadFilesFromDialogAsync(filePaths, tasks)
    }
  } catch (error: any) {
    console.error('[上传] 文件选择失败:', error)
    $alert(`选择文件失败: ${error.message}`)
  }
}

// 异步上传从对话框选择的文件
const uploadFilesFromDialogAsync = async (filePaths: string[], tasks: UploadTask[]) => {
  let hasSuccessfulUploads = false

  for (let i = 0; i < filePaths.length; i++) {
    const localPath = filePaths[i]
    const task = tasks[i]

    if (!task) continue

    try {
      // 启动真实进度跟踪（在状态更新之前设置监听器）
      const progressController = startRealProgressTracking(task.id, 'ssh:upload-progress', {
        id: currentConnectionId.value,
        localPath: localPath,
        remotePath: task.remotePath
      })

      // 更新任务状态为上传中
      updateUploadTaskStatus(task.id, { status: 'uploading', progress: 0 })

      try {
        await window.electronAPI!.ssh.uploadFile(
          currentConnectionId.value,
          localPath,
          task.remotePath
        )
        // 上传成功，停止进度跟踪并设为完成状态
        progressController.stop()
        updateUploadTaskStatus(task.id, { status: 'completed', progress: 100 })
        hasSuccessfulUploads = true
      } catch (error) {
        progressController.stop()
        throw error
      }
    } catch (error: any) {
      console.error(`[上传文件] 失败 ${task.name}:`, error)

      // 提供更友好的错误消息
      let friendlyMessage = error.message || '上传失败'
      if (error.code === 3 || error.message?.includes('Permission denied')) {
        friendlyMessage = '权限不足，无法写入远程目录。请检查文件夹权限或联系管理员。'
      } else if (error.message?.includes('No such file or directory')) {
        friendlyMessage = '远程路径不存在，请检查路径是否正确。'
      } else if (error.message?.includes('Disk quota exceeded')) {
        friendlyMessage = '磁盘空间不足，无法完成上传。'
      }

      updateUploadTaskStatus(task.id, { status: 'error', error: friendlyMessage })

      // 显示用户友好的错误提示
      $alert(`${task.name} 上传失败: ${friendlyMessage}`)
    }
  }

  // 只有在有文件成功上传时才刷新文件列表
  if (hasSuccessfulUploads) {
    invalidateFileListCache(currentPath.value)
    await loadFiles()
  }
}

const handleFileDragStart = (event: DragEvent, file: FileItem) => {
  if (!event.dataTransfer) return
  if (!currentConnectionId.value || !window.electronAPI) return

  const targets =
    selectedFiles.value.length > 0 && isFileSelected(file) ? selectedFiles.value : [file]

  const payload: DragDownloadPayloadItem[] = targets.map(item => ({
    name: item.name,
    type: item.type,
    remotePath: joinRemotePath(currentPath.value, item.name),
    size: item.size
  }))

  event.dataTransfer.setData(DRAG_DOWNLOAD_MIME, JSON.stringify(payload))
  event.dataTransfer.setData('text/plain', targets.map(item => item.name).join(', '))
  event.dataTransfer.effectAllowed = 'copy'
}

const isUploadDragEvent = (event: DragEvent) => {
  const types = Array.from(event.dataTransfer?.types || [])
  return types.includes('Files')
}

const isDownloadDragEvent = (event: DragEvent) => {
  const types = Array.from(event.dataTransfer?.types || [])
  return types.includes(DRAG_DOWNLOAD_MIME)
}

const handleDragEnter = (event: DragEvent) => {
  if (!event.dataTransfer) return

  if (isUploadDragEvent(event)) {
    event.preventDefault()
    dragUploadDepth.value++
    isDragOverUpload.value = true
  } else if (isDownloadDragEvent(event)) {
    event.preventDefault()
    dragDownloadDepth.value++
    isDragOverDownload.value = true
  }
}

const handleDragOver = (event: DragEvent) => {
  if (!event.dataTransfer) return

  if (isDragOverUpload.value || isDragOverDownload.value) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }
}

const handleDragLeave = (event: DragEvent) => {
  if (!event.dataTransfer) return

  if (isUploadDragEvent(event)) {
    dragUploadDepth.value = Math.max(dragUploadDepth.value - 1, 0)
    if (dragUploadDepth.value === 0) {
      isDragOverUpload.value = false
    }
  }

  if (isDownloadDragEvent(event)) {
    dragDownloadDepth.value = Math.max(dragDownloadDepth.value - 1, 0)
    if (dragDownloadDepth.value === 0) {
      isDragOverDownload.value = false
    }
  }
}

const resetDragState = () => {
  dragUploadDepth.value = 0
  dragDownloadDepth.value = 0
  isDragOverUpload.value = false
  isDragOverDownload.value = false
}

const handleDrop = async (event: DragEvent) => {
  if (!event.dataTransfer) return

  event.preventDefault()

  const remotePayload = event.dataTransfer.getData(DRAG_DOWNLOAD_MIME)
  try {
    if (remotePayload) {
      await handleDownloadDrop(remotePayload)
      return
    }

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      await processUploadDrop(event.dataTransfer)
    }
  } finally {
    resetDragState()
  }
}

const processUploadDrop = async (dataTransfer: DataTransfer) => {
  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    const payload = await collectDroppedFiles(dataTransfer)
    if (payload.files.length === 0) {
      return
    }

    // 创建上传任务队列
    const tasks: UploadTask[] = payload.files.map(file => ({
      id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.relativePath,
      localPath: file.localPath,
      remotePath:
        currentPath.value === '/'
          ? `/${file.relativePath}`
          : `${currentPath.value}/${file.relativePath}`,
      status: 'pending' as const,
      progress: 0,
      size: file.size
    }))

    uploadTasks.value.push(...tasks)

    // 异步处理上传任务，不阻塞UI
    uploadDroppedFilesAsync(payload, tasks)
  } catch (error: any) {
    console.error('[拖拽上传] 收集文件失败:', error)
    $alert(`收集文件失败: ${error.message || error}`)
  }
}

const getDroppedFileSize = async (localPath: string) => {
  let size = 0

  try {
    const stats = await window.electronAPI!.fs.getStats(localPath)
    size = stats.size
  } catch (error) {
    console.warn(`[拖拽收集] 获取文件大小失败 ${localPath}:`, error)
  }

  return size
}

const appendDroppedFileInfo = (
  files: DroppedFileInfo[],
  seenDroppedFiles: Set<string>,
  file: DroppedFileInfo
) => {
  const fileKey = `${file.localPath}::${file.relativePath}`
  if (seenDroppedFiles.has(fileKey)) {
    return
  }

  seenDroppedFiles.add(fileKey)
  files.push(file)
}

const getLocalPathForDroppedFile = (file: File | null | undefined) => {
  if (!file || !window.electronAPI) {
    return undefined
  }

  const getPathForFile = window.electronAPI?.fs?.getPathForFile
  if (typeof getPathForFile === 'function') {
    try {
      const resolvedPath = getPathForFile(file)
      if (resolvedPath) {
        return resolvedPath
      }
    } catch (error) {
      console.warn('[拖拽收集] preload getPathForFile 不可用:', error)
    }
  }

  return (file as any).path as string | undefined
}

const appendBrowserDroppedFile = async (
  file: File | null | undefined,
  files: DroppedFileInfo[],
  seenDroppedFiles: Set<string>
) => {
  const localPath = getLocalPathForDroppedFile(file)
  if (!file || !localPath) {
    return
  }

  const relativePath =
    (file as any).webkitRelativePath && (file as any).webkitRelativePath.length > 0
      ? ((file as any).webkitRelativePath as string)
      : file.name

  appendDroppedFileInfo(files, seenDroppedFiles, {
    localPath,
    relativePath,
    size: await getDroppedFileSize(localPath)
  })
}

const collectDroppedFiles = async (dataTransfer: DataTransfer): Promise<DroppedFilesPayload> => {
  const directories = new Set<string>()
  const files: DroppedFileInfo[] = []
  const seenDroppedFiles = new Set<string>()
  const items = Array.from(dataTransfer.items || [])
  const droppedFiles = Array.from(dataTransfer.files || [])

  const hasEntrySupport = items.some(item => typeof (item as any).webkitGetAsEntry === 'function')

  if (hasEntrySupport) {
    for (const item of items) {
      if (item.kind !== 'file') continue

      const itemFile = item.getAsFile?.()
      await appendBrowserDroppedFile(itemFile, files, seenDroppedFiles)

      const entry = (item as any).webkitGetAsEntry?.() as FileSystemEntry | undefined
      if (entry) {
        await traverseEntry(entry, '', files, directories, seenDroppedFiles)
      }
    }
  }

  for (const file of droppedFiles) {
    await appendBrowserDroppedFile(file, files, seenDroppedFiles)
  }

  return { files, directories }
}

const traverseEntry = async (
  entry: FileSystemEntry,
  parentRelativePath: string,
  files: DroppedFileInfo[],
  directories: Set<string>,
  seenDroppedFiles: Set<string>
) => {
  const relativePath = parentRelativePath ? `${parentRelativePath}/${entry.name}` : entry.name

  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => {
      ;(entry as FileSystemFileEntry).file(resolve, reject)
    })
    const localPath = getLocalPathForDroppedFile(file)
    if (localPath) {
      appendDroppedFileInfo(files, seenDroppedFiles, {
        localPath,
        relativePath,
        size: await getDroppedFileSize(localPath)
      })
    }
  } else if (entry.isDirectory) {
    directories.add(relativePath)
    const reader = (entry as FileSystemDirectoryEntry).createReader()
    let entries: FileSystemEntry[] = []

    do {
      entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
        reader.readEntries(resolve, reject)
      })
      for (const child of entries) {
        await traverseEntry(child, relativePath, files, directories, seenDroppedFiles)
      }
    } while (entries.length > 0)
  }
}

const uploadDroppedFiles = async (payload: DroppedFilesPayload) => {
  const remoteDirCache = new Set<string>([normalizeRemotePath(currentPath.value)])

  const sortedDirectories = Array.from(payload.directories).sort(
    (a, b) => a.split('/').length - b.split('/').length
  )

  for (const dir of sortedDirectories) {
    const remoteDir = joinRemotePath(currentPath.value, dir)
    await ensureRemoteDirectoryExists(remoteDir, remoteDirCache)
  }

  const sortedFiles = [...payload.files].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath)
  )

  for (const file of sortedFiles) {
    const remotePath = joinRemotePath(currentPath.value, file.relativePath)
    await ensureParentDirectories(remotePath, remoteDirCache)
    await window.electronAPI!.ssh.uploadFile(currentConnectionId.value, file.localPath, remotePath)
  }
}

// 异步上传文件，支持任务队列管理
const uploadDroppedFilesAsync = async (payload: DroppedFilesPayload, tasks: UploadTask[]) => {
  const remoteDirCache = new Set<string>([normalizeRemotePath(currentPath.value)])
  let hasSuccessfulUploads = false

  // 异步创建目录
  const sortedDirectories = Array.from(payload.directories).sort(
    (a, b) => a.split('/').length - b.split('/').length
  )

  for (const dir of sortedDirectories) {
    try {
      const remoteDir = joinRemotePath(currentPath.value, dir)
      await ensureRemoteDirectoryExists(remoteDir, remoteDirCache)
    } catch (error: any) {
      console.error(`[上传目录] 创建失败 ${dir}:`, error)
    }
  }

  // 异步上传文件，每个文件作为一个独立任务
  const sortedFiles = [...payload.files].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath)
  )

  for (let i = 0; i < sortedFiles.length; i++) {
    const file = sortedFiles[i]
    const task = tasks[i]

    if (!task) continue

    try {
      // 更新任务状态为上传中
      updateUploadTaskStatus(task.id, { status: 'uploading', progress: 0 })

      const remotePath = joinRemotePath(currentPath.value, file.relativePath)
      await ensureParentDirectories(remotePath, remoteDirCache)

      // 启动真实进度跟踪
      const progressController = startRealProgressTracking(task.id, 'ssh:upload-progress', {
        id: currentConnectionId.value,
        localPath: file.localPath,
        remotePath: remotePath
      })

      try {
        await window.electronAPI!.ssh.uploadFile(
          currentConnectionId.value,
          file.localPath,
          remotePath
        )
        // 上传成功，停止进度跟踪并设为完成状态
        progressController.stop()
        updateUploadTaskStatus(task.id, { status: 'completed', progress: 100 })
        hasSuccessfulUploads = true
      } catch (error) {
        progressController.stop()
        throw error
      }
    } catch (error: any) {
      console.error(`[上传文件] 失败 ${file.relativePath}:`, error)

      // 提供更友好的错误消息
      let friendlyMessage = error.message || '上传失败'
      if (error.code === 3 || error.message?.includes('Permission denied')) {
        friendlyMessage = '权限不足，无法写入远程目录。请检查文件夹权限或联系管理员。'
      } else if (error.message?.includes('No such file or directory')) {
        friendlyMessage = '远程路径不存在，请检查路径是否正确。'
      } else if (error.message?.includes('Disk quota exceeded')) {
        friendlyMessage = '磁盘空间不足，无法完成上传。'
      }

      updateUploadTaskStatus(task.id, { status: 'error', error: friendlyMessage })

      // 显示用户友好的错误提示
      $alert(`${file.relativePath} 上传失败: ${friendlyMessage}`)
    }
  }

  // 只有在有文件成功上传时才刷新文件列表
  const completedCount = uploadTasks.value.filter(
    t => tasks.some(task => task.id === t.id) && t.status === 'completed'
  ).length
  if (hasSuccessfulUploads) {
    await loadFiles()
    $alert(`成功上传 ${completedCount} 个文件`)
  }
}

// 更新上传任务状态
const updateUploadTaskStatus = (taskId: string, updates: Partial<UploadTask>) => {
  const index = uploadTasks.value.findIndex(t => t.id === taskId)
  if (index >= 0) {
    uploadTasks.value[index] = { ...uploadTasks.value[index], ...updates }
  }
}

// 真实的进度更新（通过事件监听）
const startRealProgressTracking = (taskId: string, eventName: string, matchCriteria: any) => {
  let isCompleted = false

  const handleProgress = (data: any) => {
    // 检查是否匹配当前任务
    if (isCompleted) return

    let isMatch = true
    for (const [key, value] of Object.entries(matchCriteria)) {
      if (data[key] !== value) {
        isMatch = false
        break
      }
    }

    if (isMatch && data.progress !== undefined) {
      if (eventName.includes('upload')) {
        updateUploadTaskStatus(taskId, { progress: data.progress })
      } else {
        updateTaskStatus(taskId, { progress: data.progress })
      }
    }
  }

  // 添加事件监听
  const progressListener = window.electronAPI?.on(eventName, handleProgress)

  return {
    stop: () => {
      isCompleted = true
      if (progressListener) {
        progressListener()
      }
    }
  }
}

const handleDownloadDrop = async (rawPayload: string) => {
  if (!rawPayload || !window.electronAPI) return

  try {
    const payload: DragDownloadPayloadItem[] = JSON.parse(rawPayload)
    if (!payload || payload.length === 0) return

    const folderPath = await window.electronAPI.fs.showOpenDialog({
      title: '选择下载目录',
      properties: ['openDirectory']
    })

    if (!folderPath || folderPath.length === 0) {
      return
    }

    isDownloadCancelled = false

    for (const item of payload) {
      const localPath = `${folderPath[0]}/${item.name}`
      await addDownloadTask(item.name, item.type, item.remotePath, localPath, item.size || 0)
    }
  } catch (error: any) {
    console.error('[拖拽下载] 失败:', error)
    $alert(`拖拽下载失败: ${error.message || error}`)
  }
}

// 下载文件或文件夹
const downloadFile = async (file: FileItem) => {
  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    const remotePath =
      currentPath.value === '/' ? `/${file.name}` : `${currentPath.value}/${file.name}`

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
    $alert(`下载失败: ${error.message}`)
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
      // 使用recursive: true，自动创建所有父目录
      await api.fs.createDirectory(dirPath)
      createdDirectories.add(dirPath)
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
    return 0
  }

  // 检查是否已被取消
  if (isDownloadCancelled) {
    return 0
  }

  // 限制递归深度，防止无限循环
  if (depth > 50) {
    console.warn(`[收集文件] 达到最大递归深度限制: ${remotePath}`)
    return 0
  }

  let fileCount = 0

  try {
    const result = await window.electronAPI.ssh.listFiles(currentConnectionId.value, remotePath)

    if (result.success) {
      // 先处理所有文件（立即创建下载任务）
      for (const item of result.files) {
        // 每次循环都检查取消标志
        if (isDownloadCancelled) {
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
          return fileCount
        }

        if (item.type === 'directory') {
          const itemRemotePath = `${remotePath}/${item.name}`
          const itemLocalPath = `${localBasePath}/${item.name}`
          const itemRelativeName = relativePrefix ? `${relativePrefix}/${item.name}` : item.name

          const subCount = await collectAndAddDownloadTasks(
            itemRemotePath,
            itemLocalPath,
            itemRelativeName,
            depth + 1
          )
          fileCount += subCount
        }
      }
    } else {
      console.error(`[收集文件] 列出失败:`, result)
    }
  } catch (error) {
    console.error('[收集文件] 错误:', error)
  }

  return fileCount
}

// 添加下载任务
const addDownloadTask = async (
  name: string,
  type: 'file' | 'directory',
  remotePath: string,
  localPath: string,
  size: number
) => {
  // 检查是否已被取消
  if (isDownloadCancelled) {
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
    try {
      const fileCount = await collectAndAddDownloadTasks(remotePath, localPath)

      if (fileCount === 0) {
        $alert('文件夹为空或无法访问')
      }
    } catch (error: any) {
      $alert(`扫描文件失败: ${error.message}`)
    }
  }
}

// 更新任务状态（确保 Vue 响应式更新）
const updateTaskStatus = (taskId: string, updates: Partial<DownloadTask>) => {
  const index = downloadTasks.value.findIndex(t => t.id === taskId)
  if (index >= 0) {
    // 创建新对象替换，确保响应式更新
    downloadTasks.value[index] = { ...downloadTasks.value[index], ...updates }
  }
}

// 执行下载任务
const executeDownloadTask = async (task: DownloadTask) => {
  if (task.cancelled || !currentConnectionId.value || !window.electronAPI) return

  // 检查全局取消标志
  if (isDownloadCancelled) {
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

  // 启动真实进度跟踪（在状态更新之前设置监听器）
  const progressController = startRealProgressTracking(task.id, 'ssh:download-progress', {
    id: currentConnectionId.value,
    remotePath: task.remotePath,
    localPath: task.localPath
  })

  updateTaskStatus(task.id, { status: 'downloading', progress: 0 })

  // 获取最新的任务引用
  const getTask = () => downloadTasks.value.find(t => t.id === task.id)

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
        console.warn(
          `[下载任务] 下载失败，重试 ${retryCount}/${maxRetries}:`,
          downloadError.message
        )
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)) // 递增延迟
      }
    }

    // 下载成功，停止进度跟踪并设为完成状态
    progressController.stop()
    updateTaskStatus(task.id, { progress: 100, status: 'completed' })

    // 检查是否所有任务都完成了
    checkAndAutoCleanup()
  } catch (error: any) {
    progressController.stop()
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
  const allDone =
    downloadTasks.value.length > 0 &&
    downloadTasks.value.every(
      t => t.status === 'completed' || t.status === 'error' || t.status === 'cancelled'
    )

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
        // 异步打开目录，不阻塞后续流程
        window.electronAPI.fs.openPath(dirPath).catch((error: any) => {
          console.error('[下载管理] 打开目录失败:', error)
        })
      }
    }

    autoCleanupTimer = setTimeout(() => {
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
  downloadTasks.value = downloadTasks.value.filter(
    t => t.status !== 'completed' && t.status !== 'error' && t.status !== 'cancelled'
  )

  // 如果所有任务都清除了，重置取消标志，允许下次下载
  if (downloadTasks.value.length === 0) {
    isDownloadCancelled = false
  }
}

// 上传任务管理函数
const cancelUploadTask = (taskId: string) => {
  updateUploadTaskStatus(taskId, { cancelled: true, status: 'cancelled' })
}

const removeUploadTask = (taskId: string) => {
  const index = uploadTasks.value.findIndex(t => t.id === taskId)
  if (index >= 0) {
    uploadTasks.value.splice(index, 1)
  }
}

const clearCompletedUploadTasks = () => {
  uploadTasks.value = uploadTasks.value.filter(
    t => t.status !== 'completed' && t.status !== 'error' && t.status !== 'cancelled'
  )
}

const cancelAllUploads = () => {
  uploadTasks.value.forEach(task => {
    if (task.status === 'uploading' || task.status === 'pending') {
      updateUploadTaskStatus(task.id, { cancelled: true, status: 'cancelled' })
    }
  })
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
        const remotePath =
          currentPath.value === '/' ? `/${file.name}` : `${currentPath.value}/${file.name}`
        const localPath = `${folderPath[0]}/${file.name}`

        await addDownloadTask(file.name, file.type, remotePath, localPath, file.size || 0)
      }

      selectedFiles.value = []
      // 不自动打开下载管理器，用户可以点击状态栏查看
    }
  } catch (error: any) {
    $alert(`批量下载失败: ${error.message}`)
  }
}

// 删除文件
const deleteFile = async (file: FileItem) => {
  if (!(await $confirm(`确定要删除 "${file.name}" 吗？`))) return

  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    const remotePath =
      currentPath.value === '/' ? `/${file.name}` : `${currentPath.value}/${file.name}`

    await window.electronAPI.ssh.deleteFile(
      currentConnectionId.value,
      remotePath,
      file.type === 'directory',
      file.identity
    )

    invalidateFileListCache(currentPath.value)
    await loadFiles()
  } catch (error: any) {
    $alert(`删除失败: ${error.message}`)
  }
}

// 批量删除
const handleBulkDelete = async () => {
  if (selectedFiles.value.length === 0) return

  if (!(await $confirm(`确定要删除选中的 ${selectedFiles.value.length} 个项目吗？`))) return

  if (!currentConnectionId.value || !window.electronAPI) return

  try {
    for (const file of selectedFiles.value) {
      const remotePath =
        currentPath.value === '/' ? `/${file.name}` : `${currentPath.value}/${file.name}`

      await window.electronAPI.ssh.deleteFile(
        currentConnectionId.value,
        remotePath,
        file.type === 'directory',
        file.identity
      )
    }

    selectedFiles.value = []
    invalidateFileListCache(currentPath.value)
    await loadFiles()
  } catch (error: any) {
    $alert(`批量删除失败: ${error.message}`)
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
    const remotePath =
      currentPath.value === '/' ? `/${folderName}` : `${currentPath.value}/${folderName}`

    showCreateFolderDialog.value = false

    await window.electronAPI.ssh.createDirectory(currentConnectionId.value, remotePath)

    invalidateFileListCache(currentPath.value)
    await loadFiles()
  } catch (error: any) {
    $alert(`创建文件夹失败: ${error.message}`)
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
    txt: 'bi bi-file-text',
    pdf: 'bi bi-file-pdf',
    doc: 'bi bi-file-word',
    docx: 'bi bi-file-word',
    xls: 'bi bi-file-excel',
    xlsx: 'bi bi-file-excel',
    ppt: 'bi bi-file-ppt',
    pptx: 'bi bi-file-ppt',
    zip: 'bi bi-file-zip',
    rar: 'bi bi-file-zip',
    jpg: 'bi bi-file-image',
    jpeg: 'bi bi-file-image',
    png: 'bi bi-file-image',
    gif: 'bi bi-file-image',
    mp3: 'bi bi-file-music',
    mp4: 'bi bi-file-play',
    avi: 'bi bi-file-play'
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
  return (
    date.toLocaleDateString('zh-CN') +
    ' ' +
    date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  )
}

const syncRouteState = () => {
  const nextConnectionId = actualConnectionId.value
  if (!nextConnectionId) {
    return
  }

  const nextPath = route.query.path as string | undefined
  const decodedPath = nextPath ? decodeURIComponent(nextPath) : '/'

  currentConnectionId.value = nextConnectionId
  connectionStatus.value = 'connected'
  currentPath.value = decodedPath

  if (!hasInitializedRouteState.value) {
    hasInitializedRouteState.value = true
    loadFiles()
  }
}

// 监听路由状态变化，避免 connectionId 和 path 分开更新时串用旧路径
watch(
  () => [actualConnectionId.value, route.query.path as string | undefined],
  ([newId, newPath], [oldId, oldPath]) => {
    if (!newId) {
      return
    }

    if (newId === oldId && newPath === oldPath) {
      return
    }

    syncRouteState()
  }
)

// 生命周期
onMounted(async () => {
  // ✅ 加载 SSH 树
  await loadSSHTree()

  if (actualConnectionId.value) {
    // 如果已经有连接ID（从侧边栏传入），直接使用
    syncRouteState()
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
  color: var(--vscode-editorGutter-addedBackground);
  background-color: rgba(var(--vscode-editorGutter-addedBackground-rgb, 22, 174, 96), 0.15);
  border: 1px solid var(--vscode-editorGutter-addedBackground);
}

.status-badge.disconnected {
  color: var(--vscode-editorGutter-deletedBackground);
  background-color: rgba(var(--vscode-editorGutter-deletedBackground-rgb, 239, 68, 68), 0.15);
  border: 1px solid var(--vscode-editorGutter-deletedBackground);
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
  color: var(--vscode-button-foreground);
}

.toolbar-btn.primary:hover:not(:disabled) {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

.toolbar-btn.danger {
  color: var(--vscode-error);
}

.toolbar-btn.danger:hover:not(:disabled) {
  background: var(--vscode-inputValidation-errorBackground);
  border-color: var(--vscode-inputValidation-errorBorder);
  color: var(--vscode-button-foreground);
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
  position: relative;
  border: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.file-list-wrapper.drag-upload-active,
.file-list-wrapper.drag-download-active {
  border-color: var(--vscode-accent);
}

.file-drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: var(--vscode-button-foreground);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  text-align: center;
  z-index: 10;
  border: 2px dashed var(--vscode-accent);
}

.file-drop-overlay.download {
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.15);
  color: var(--vscode-fg);
}

.file-drop-overlay i {
  font-size: 32px;
}

.selected-count {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--vscode-badge-background);
  border: 1px solid var(--vscode-accent);
  border-radius: 4px;
  color: var(--vscode-badge-foreground);
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--vscode-fg-muted);
  gap: 16px;
}

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
  to {
    transform: rotate(360deg);
  }
}

.file-item {
  display: grid;
  grid-template-columns: 40px 1fr 100px 132px 132px;
  gap: 12px;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.1s ease;
}

.file-item:hover {
  background: var(--vscode-bg-lighter);
}

.file-item.selected {
  background: var(--vscode-list-activeSelectionBackground);
}

/* 分隔线样式 - 使用更细的线条 */
.file-item:not(:last-child) {
  border-bottom: 1px solid rgba(var(--vscode-border-rgb, 128, 128, 128), 0.1);
}

/* 返回上级目录样式 */
.file-item.parent-dir {
  background: var(--vscode-list-inactiveSelectionBackground);
  font-weight: 500;
}

.file-item.parent-dir:hover {
  background: var(--vscode-list-hoverBackground);
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
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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

.action-btn.primary {
  padding: 0 8px;
  background: rgba(var(--vscode-accent-rgb, 59, 130, 246), 0.12);
  border: 1px solid rgba(var(--vscode-accent-rgb, 59, 130, 246), 0.35);
  color: var(--vscode-accent);
}

.action-btn.primary:hover {
  background: rgba(var(--vscode-accent-rgb, 59, 130, 246), 0.18);
  border-color: var(--vscode-accent);
  color: var(--vscode-accent);
}

.action-btn.danger {
  padding: 0 8px;
  background: rgba(var(--vscode-editorGutter-deletedBackground-rgb, 239, 68, 68), 0.12);
  border: 1px solid var(--vscode-editorGutter-deletedBackground);
  color: var(--vscode-editorGutter-deletedBackground);
}

.action-btn.danger:hover {
  background: var(--vscode-editorGutter-deletedBackground);
  border-color: var(--vscode-editorGutter-deletedBackground);
  color: #fff;
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
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
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

/* 上传进度指示器 */
.upload-progress-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--vscode-badge-background);
  border: 1px solid var(--vscode-accent);
  border-radius: 4px;
  color: var(--vscode-badge-foreground);
  font-size: 13px;
  font-weight: 500;
  margin-right: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.upload-progress-indicator:hover {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
}

.upload-progress-indicator i {
  font-size: 14px;
}

.upload-progress-indicator .progress-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
}

.upload-progress-indicator .progress-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 12px;
}

.upload-progress-indicator .upload-count {
  font-weight: 600;
  color: var(--vscode-accent);
}

.upload-progress-indicator .current-file {
  font-size: 11px;
  color: var(--vscode-fg-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.upload-progress-indicator .upload-status {
  font-size: 11px;
  color: var(--vscode-fg-muted);
}

.upload-progress-indicator .progress-bar {
  height: 3px;
  background: var(--vscode-bg);
  border-radius: 2px;
  overflow: hidden;
}

.upload-progress-indicator .progress-fill {
  height: 100%;
  background: var(--vscode-accent);
  transition: width 0.15s ease;
}

/* 线性进度条样式 - 平滑过渡 */
.task-item.uploading .task-progress-bar .progress-fill,
.task-item.downloading .task-progress-bar .progress-fill,
.upload-progress-indicator .progress-fill,
.download-progress-indicator .progress-fill {
  transition: width 0.3s ease-out;
}

/* 上传管理器弹窗 */
.upload-manager-overlay {
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

.upload-manager-modal {
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

.upload-manager-modal .modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg-lighter);
}

.upload-manager-modal .modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
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

.task-status.transferring {
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
.bi-folder-open::before {
  content: '📂';
}
.bi-arrow-left::before {
  content: '←';
}
.bi-arrow-up-circle::before {
  content: '⬆';
}
.bi-house::before {
  content: '🏠';
}
.bi-arrow-clockwise::before {
  content: '↻';
}
.bi-upload::before {
  content: '⬆';
}
.bi-folder-plus::before {
  content: '📁+';
}
.bi-download::before {
  content: '⬇';
}
.bi-trash::before {
  content: '🗑';
}
.bi-x::before {
  content: '✕';
}
.bi-x-lg::before {
  content: '✕';
  font-size: 10px;
  font-weight: bold;
}
.bi-folder::before {
  content: '📁';
}
.bi-folder-fill::before {
  content: '📁';
}
.bi-file-text::before {
  content: '📄';
}
.bi-file-pdf::before {
  content: '📕';
}
.bi-file-word::before {
  content: '📘';
}
.bi-file-excel::before {
  content: '📗';
}
.bi-file-ppt::before {
  content: '📙';
}
.bi-file-zip::before {
  content: '📦';
}
.bi-file-image::before {
  content: '🖼';
}
.bi-file-music::before {
  content: '🎵';
}
.bi-file-play::before {
  content: '🎬';
}
.bi-file-earmark::before {
  content: '📄';
}
.bi-circle-fill::before {
  content: '●';
}
.bi-arrow-down-circle::before {
  content: '⬇';
}
.bi-check-circle::before {
  content: '✓';
}
.bi-x-circle::before {
  content: '✕';
}
.bi-dash-circle::before {
  content: '—';
}
.bi-clock::before {
  content: '⏱';
}
.bi-inbox::before {
  content: '📥';
}
.bi-check-all::before {
  content: '✓✓';
}
</style>
