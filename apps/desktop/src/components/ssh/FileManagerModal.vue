<template>
  <div v-if="visible" class="file-manager-modal-overlay" @click.self="handleClose">
    <div class="file-manager-modal">
      <!-- 标题栏 -->
      <div class="modal-header">
        <div class="modal-title">
          <i class="bi bi-folder-open"></i>
          <span>文件管理 - {{ connection?.name }}</span>
        </div>
        <button class="close-button" @click="handleClose">
          <i class="bi bi-x"></i>
        </button>
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
          <button class="toolbar-btn primary" @click="handleUpload">
            <i class="bi bi-upload"></i>
            上传文件
          </button>
          <button class="toolbar-btn" @click="createFolder">
            <i class="bi bi-folder-plus"></i>
            新建文件夹
          </button>
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

      <!-- 文件列表 -->
      <div class="file-list-container">
        <!-- 批量操作栏 -->
        <div v-if="selectedFiles.length > 0" class="bulk-actions">
          <div class="selected-info">
            已选择 {{ selectedFiles.length }} 个文件
          </div>
          <div class="bulk-buttons">
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
          </div>
        </div>

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
          
          <div v-else-if="files.length === 0" class="empty-state">
            <i class="bi bi-folder-open"></i>
            <span>此目录为空</span>
          </div>

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
                v-if="file.type === 'file'" 
                class="action-btn" 
                @click="downloadFile(file)"
                title="下载"
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
        </div>
      </div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <div class="status-left">
          {{ files.length }} 个项目
          <span v-if="selectedFiles.length > 0"> - 已选择 {{ selectedFiles.length }} 个</span>
        </div>
        <div class="status-right">
          {{ connection?.host }}:{{ connection?.port }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SSHTreeNodeData } from './SSHTreeNode.vue'

interface FileItem {
  name: string
  type: 'file' | 'directory'
  size: number
  modifiedTime: string
  permissions?: string
}

interface Props {
  visible: boolean
  connection: SSHTreeNodeData | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

// 状态
const currentPath = ref('/')
const files = ref<FileItem[]>([])
const loading = ref(false)
const selectedFiles = ref<FileItem[]>([])

// 计算属性
const isAllSelected = computed(() => {
  return files.value.length > 0 && selectedFiles.value.length === files.value.length
})

// 监听连接变化，加载文件列表
watch(() => props.connection, (newConnection) => {
  if (newConnection && props.visible) {
    currentPath.value = '/'
    loadFiles()
  }
}, { immediate: true })

watch(() => props.visible, (visible) => {
  if (visible && props.connection) {
    loadFiles()
  } else {
    // 关闭时清空选择
    selectedFiles.value = []
  }
})

// 加载文件列表
const loadFiles = async () => {
  if (!props.connection || !window.electronAPI) {
    return
  }

  loading.value = true
  try {
    const result = await window.electronAPI.ssh.listFiles(
      props.connection.id,
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
  // 单击选择文件
  if (!isFileSelected(file)) {
    selectedFiles.value = [file]
  }
}

const handleFileDoubleClick = (file: FileItem) => {
  if (file.type === 'directory') {
    navigateToDirectory(file.name)
  }
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
  if (!props.connection || !window.electronAPI) return

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
          props.connection.id,
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

// 下载文件
const downloadFile = async (file: FileItem) => {
  if (!props.connection || !window.electronAPI) return

  try {
    const remotePath = currentPath.value === '/' 
      ? `/${file.name}` 
      : `${currentPath.value}/${file.name}`
    
    const localPath = await window.electronAPI.fs.showSaveDialog({
      title: '保存文件',
      defaultPath: file.name
    })

    if (localPath) {
      loading.value = true
      await window.electronAPI.ssh.downloadFile(
        props.connection.id,
        remotePath,
        localPath
      )
      alert('下载成功')
    }
  } catch (error: any) {
    console.error('Download error:', error)
    alert(`下载失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 批量下载
const handleBulkDownload = async () => {
  if (selectedFiles.value.length === 0) return

  try {
    const folderPath = await window.electronAPI.fs.showOpenDialog({
      title: '选择下载目录',
      properties: ['openDirectory']
    })

    if (folderPath && folderPath.length > 0) {
      loading.value = true
      
      for (const file of selectedFiles.value) {
        if (file.type === 'file') {
          const remotePath = currentPath.value === '/' 
            ? `/${file.name}` 
            : `${currentPath.value}/${file.name}`
          const localPath = `${folderPath[0]}/${file.name}`
          
          await window.electronAPI.ssh.downloadFile(
            props.connection!.id,
            remotePath,
            localPath
          )
        }
      }
      
      alert(`成功下载 ${selectedFiles.value.filter(f => f.type === 'file').length} 个文件`)
      selectedFiles.value = []
    }
  } catch (error: any) {
    console.error('Bulk download error:', error)
    alert(`批量下载失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 删除文件
const deleteFile = async (file: FileItem) => {
  if (!confirm(`确定要删除 "${file.name}" 吗？`)) return

  if (!props.connection || !window.electronAPI) return

  try {
    const remotePath = currentPath.value === '/' 
      ? `/${file.name}` 
      : `${currentPath.value}/${file.name}`
    
    loading.value = true
    await window.electronAPI.ssh.deleteFile(
      props.connection.id,
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

  if (!props.connection || !window.electronAPI) return

  try {
    loading.value = true
    
    for (const file of selectedFiles.value) {
      const remotePath = currentPath.value === '/' 
        ? `/${file.name}` 
        : `${currentPath.value}/${file.name}`
      
      await window.electronAPI.ssh.deleteFile(
        props.connection.id,
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

// 新建文件夹
const createFolder = async () => {
  const folderName = prompt('请输入文件夹名称:')
  if (!folderName) return

  if (!props.connection || !window.electronAPI) return

  try {
    const remotePath = currentPath.value === '/' 
      ? `/${folderName}` 
      : `${currentPath.value}/${folderName}`
    
    loading.value = true
    await window.electronAPI.ssh.createDirectory(
      props.connection.id,
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

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.file-manager-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.file-manager-modal {
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg-light);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.close-button {
  width: 32px;
  height: 32px;
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

.close-button:hover {
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
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
  padding: 12px 20px;
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

.file-list-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.bulk-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: var(--vscode-accent);
  color: #ffffff;
}

.selected-info {
  font-size: 13px;
  font-weight: 500;
}

.bulk-buttons {
  display: flex;
  gap: 8px;
}

.file-list-header {
  display: grid;
  grid-template-columns: 40px 1fr 100px 150px 100px;
  gap: 12px;
  padding: 10px 20px;
  background: var(--vscode-bg-lighter);
  border-bottom: 1px solid var(--vscode-border);
  font-size: 12px;
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
  padding: 10px 20px;
  border-bottom: 1px solid var(--vscode-border);
  cursor: pointer;
  transition: background 0.1s ease;
}

.file-item:hover {
  background: var(--vscode-bg-lighter);
}

.file-item.selected {
  background: var(--vscode-accent);
  color: #ffffff;
}

.file-col-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-col-name {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.file-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.file-col-size,
.file-col-modified,
.file-col-actions {
  display: flex;
  align-items: center;
  font-size: 13px;
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
  padding: 8px 20px;
  border-top: 1px solid var(--vscode-border);
  background: var(--vscode-bg-light);
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

/* Bootstrap Icons */
.bi-folder-open::before { content: "📂"; }
.bi-x::before { content: "✕"; font-weight: bold; }
.bi-arrow-left::before { content: "←"; }
.bi-house::before { content: "🏠"; }
.bi-arrow-clockwise::before { content: "↻"; }
.bi-upload::before { content: "⬆"; }
.bi-folder-plus::before { content: "📁+"; }
.bi-download::before { content: "⬇"; }
.bi-trash::before { content: "🗑"; }
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
</style>

