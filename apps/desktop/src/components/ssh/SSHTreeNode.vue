<template>
  <div class="ssh-tree-node">
    <!-- 节点内容 -->
    <div
      :class="[
        'tree-node-content',
        {
          'is-selected': isSelected,
          'is-dragging': isDragging,
          'is-drag-over': isDragOver
        }
      ]"
      :style="{ paddingLeft: `${depth * 16}px` }"
      draggable="true"
      @click="handleNodeClick"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @contextmenu.prevent="openContextMenu"
    >
      <!-- 展开/折叠图标 -->
      <div v-if="node.type !== 'connection'" class="tree-node-arrow">
        <svg
          v-if="node.type === 'folder'"
          :class="['chevron-icon', { expanded: isExpanded }]"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path fill="currentColor" d="M6 4l4 4-4 4V4z" />
        </svg>
        <span v-else class="tree-node-spacer"></span>
      </div>

      <!-- 节点图标（仅显示连接图标） -->
      <i
        v-if="node.type === 'connection'"
        class="bi bi-hdd-network tree-node-icon text-vscode-accent"
      ></i>

      <!-- 节点名称 -->
      <input
        v-if="isEditing"
        ref="editInput"
        v-model="editName"
        type="text"
        class="tree-node-input"
        @blur="handleEditBlur"
        @keydown.enter="handleEditConfirm"
        @keydown.esc="cancelEdit"
        @click.stop
      />
      <span v-else class="tree-node-label-group">
        <span class="tree-node-label">{{ node.name }}</span>
        <span v-if="isConnecting" class="tree-node-connection-status">
          连接中 {{ connectingElapsedSeconds }}s
        </span>
      </span>

      <!-- 更多操作按钮 -->
      <div :class="['tree-node-actions', { 'menu-visible': showActions }]" @click.stop>
        <div ref="actionMenuWrapper" class="action-menu-wrapper">
          <button
            class="vscode-icon-button more-button"
            @click="toggleActionMenu($event)"
            @mouseenter="showActionMenu($event)"
            @mouseleave="scheduleHideActionMenu"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </button>

          <!-- 操作下拉菜单 -->
          <div
            v-if="showActions"
            class="action-dropdown"
            :style="actionDropdownStyle"
            @mouseenter="cancelHideActionMenu"
            @mouseleave="scheduleHideActionMenu"
          >
            <!-- 连接节点菜单 -->
            <template v-if="node.type === 'connection'">
              <div class="action-item" @click="handleConnect">
                <i class="bi bi-play"></i>
                <span>{{ $t('ssh.treeConnect') }}</span>
              </div>
              <div class="action-item" @click="handleOpenFileManager">
                <i class="bi bi-folder-open"></i>
                <span>{{ $t('ssh.treeFileManager') }}</span>
              </div>
              <div class="action-divider"></div>
              <div class="action-item" @click="handleEditConnection">
                <i class="bi bi-gear"></i>
                <span>{{ $t('ssh.treeEdit') }}</span>
              </div>
              <div class="action-item" @click="startEdit">
                <i class="bi bi-pencil"></i>
                <span>{{ $t('ssh.treeRename') }}</span>
              </div>
              <div class="action-item danger" @click="handleDelete">
                <i class="bi bi-trash"></i>
                <span>{{ $t('ssh.treeDelete') }}</span>
              </div>
            </template>

            <!-- 文件夹节点菜单 -->
            <template v-else>
              <div class="action-item" @click="handleCreateFolder">
                <i class="bi bi-folder-plus"></i>
                <span>{{ $t('ssh.treeNewFolder') }}</span>
              </div>
              <div class="action-item" @click="handleCreateConnection">
                <i class="bi bi-hdd-network"></i>
                <span>{{ $t('ssh.treeNewConnection') }}</span>
              </div>
              <div class="action-divider"></div>
              <div class="action-item" @click="startEdit">
                <i class="bi bi-pencil"></i>
                <span>{{ $t('ssh.treeRename') }}</span>
              </div>
              <div class="action-item danger" @click="handleDelete">
                <i class="bi bi-trash"></i>
                <span>{{ $t('ssh.treeDelete') }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 子节点 -->
    <div v-if="node.type === 'folder' && isExpanded && node.children" class="tree-node-children">
      <SSHTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        :connecting-node-id="connectingNodeId"
        :connecting-elapsed-seconds="connectingElapsedSeconds"
        :auto-edit-id="autoEditId"
        :edit-trigger="editTrigger"
        @select="$emit('select', $event)"
        @update="$emit('update', $event)"
        @delete="$emit('delete', $event)"
        @connect="$emit('connect', $event)"
        @drag-node="$emit('drag-node', $event)"
        @drop-node="$emit('drop-node', $event)"
        @create-folder="$emit('create-folder', $event)"
        @create-connection="$emit('create-connection', $event)"
        @edit-connection="$emit('edit-connection', $event)"
        @open-file-manager="$emit('open-file-manager', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { $confirm } from '@/composables/useDialog'
import {
  canUseSsh,
  getSubscriptionState,
  getSshUpgradeMessage
} from '@/services/subscription.service'

export interface SSHTreeNodeData {
  id: string
  name: string
  type: 'folder' | 'connection'
  order?: number
  children?: SSHTreeNodeData[]
  // 文件夹特有属性
  parentId?: string | null
  // 连接特有属性
  host?: string
  port?: number
  username?: string
  password?: string
  privateKey?: string
  passphrase?: string
  authType?: string
  folderId?: string | null
  status?: string
}

interface Props {
  node: SSHTreeNodeData
  depth?: number
  selectedId?: string | null
  connectingNodeId?: string | null
  connectingElapsedSeconds?: number
  autoEditId?: string | null
  editTrigger?: number
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
  selectedId: null,
  connectingNodeId: null,
  connectingElapsedSeconds: 0,
  autoEditId: null,
  editTrigger: 0
})

const { t: $t } = useI18n()
const router = useRouter()
const openNewTab =
  inject<(id: string, name: string, icon: string, path: string) => void>('openNewTab')

const emit = defineEmits<{
  select: [node: SSHTreeNodeData]
  update: [node: SSHTreeNodeData]
  delete: [node: SSHTreeNodeData]
  connect: [node: SSHTreeNodeData]
  'drag-node': [node: SSHTreeNodeData]
  'drop-node': [data: { dragNode: SSHTreeNodeData; dropNode: SSHTreeNodeData }]
  'create-folder': [data: { parentId: string; name: string }]
  'create-connection': [data: { folderId: string; name: string }]
  'edit-connection': [connection: SSHTreeNodeData]
  'open-file-manager': [connection: SSHTreeNodeData]
}>()

// 展开/折叠状态（文件夹默认展开）
const isExpanded = ref(props.node.type === 'folder')

// 选中状态
const isSelected = computed(() => props.selectedId === props.node.id)
const isConnecting = computed(
  () => props.node.type === 'connection' && props.connectingNodeId === props.node.id
)

// 编辑状态
const isEditing = ref(false)
const editName = ref('')
const editInput = ref<HTMLInputElement | null>(null)

// 拖拽状态
const isDragging = ref(false)
const isDragOver = ref(false)

// 操作菜单
const showActions = ref(false)
const actionMenuMode = ref<'hover' | 'contextmenu' | null>(null)
const actionMenuPosition = ref({ left: 0, top: 0 })
const actionMenuWrapper = ref<HTMLElement | null>(null)
let hideTimer: number | null = null

const actionDropdownStyle = computed(() => ({
  left: `${actionMenuPosition.value.left}px`,
  top: `${actionMenuPosition.value.top}px`
}))

const openProfileForUpgrade = () => {
  if (openNewTab) {
    openNewTab('profile', '个人中心', 'bi bi-person-circle', '/profile')
    return
  }

  router.push('/profile')
}

const ensureSshSubscription = async () => {
  const state = getSubscriptionState()
  if (canUseSsh(state)) {
    return true
  }

  const confirmed = await $confirm({
    title: '需要继续订阅',
    message: getSshUpgradeMessage(state) || '试用期结束,需要继续订阅才能使用。',
    confirmText: '去订阅',
    cancelText: '取消',
    type: 'warning'
  })

  if (confirmed) {
    openProfileForUpgrade()
  }

  return false
}

const tryConnectNode = async () => {
  if (!(await ensureSshSubscription())) {
    return
  }

  emit('connect', props.node)
}

// 监听 editTrigger 和 autoEditId，如果匹配当前节点则自动进入编辑模式
watch([() => props.editTrigger, () => props.autoEditId], ([trigger, editId]) => {
  if (editId && editId === props.node.id && trigger > 0) {
    nextTick(() => {
      startEdit()
    })
  }
})

// 切换展开/折叠
const toggleExpand = () => {
  if (props.node.type === 'folder') {
    isExpanded.value = !isExpanded.value
  }
}

// 点击节点（整行点击）
const handleNodeClick = async () => {
  emit('select', props.node)
  // 如果是文件夹，点击整行展开/折叠
  if (props.node.type === 'folder') {
    toggleExpand()
  }
  // 如果是连接节点，直接连接
  else if (props.node.type === 'connection') {
    await tryConnectNode()
  }
}

// 显示操作菜单
const showActionMenu = (event?: MouseEvent) => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  if (showActions.value && actionMenuMode.value === 'contextmenu') {
    return
  }

  if (event?.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect()
    actionMenuPosition.value = {
      left: rect.right - 120,
      top: rect.bottom + 2
    }
  }

  actionMenuMode.value = 'hover'
  showActions.value = true
}

// 切换操作菜单
const toggleActionMenu = (event?: MouseEvent) => {
  if (showActions.value && actionMenuMode.value === 'contextmenu') {
    return
  }

  if (showActions.value) {
    showActions.value = false
    actionMenuMode.value = null
    return
  }

  showActionMenu(event)
}

const openContextMenu = (event: MouseEvent) => {
  cancelHideActionMenu()
  actionMenuPosition.value = {
    left: event.clientX,
    top: event.clientY
  }
  actionMenuMode.value = 'contextmenu'
  showActions.value = true
}

// 延迟隐藏操作菜单
const scheduleHideActionMenu = () => {
  if (actionMenuMode.value !== 'hover') {
    return
  }

  hideTimer = window.setTimeout(() => {
    showActions.value = false
    actionMenuMode.value = null
  }, 200)
}

// 取消隐藏操作菜单
const cancelHideActionMenu = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const handleOutsideClick = (event: MouseEvent) => {
  if (!showActions.value || actionMenuMode.value !== 'contextmenu') {
    return
  }

  if (actionMenuWrapper.value?.contains(event.target as Node)) {
    return
  }

  showActions.value = false
  actionMenuMode.value = null
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick, true)
})

// 处理连接
const handleConnect = async () => {
  await tryConnectNode()
  showActions.value = false
  actionMenuMode.value = null
}

// 处理删除
const handleDelete = () => {
  emit('delete', props.node)
  showActions.value = false
  actionMenuMode.value = null
}

// 处理编辑连接
const handleEditConnection = () => {
  emit('edit-connection', props.node)
  showActions.value = false
  actionMenuMode.value = null
}

const handleOpenFileManager = () => {
  emit('open-file-manager', props.node)
  showActions.value = false
  actionMenuMode.value = null
}

// 处理创建文件夹
const handleCreateFolder = () => {
  if (props.node.type === 'folder') {
    emit('create-folder', {
      parentId: props.node.id,
      name: '新建文件夹'
    })
    isExpanded.value = true
  }
  showActions.value = false
  actionMenuMode.value = null
}

// 处理创建连接
const handleCreateConnection = () => {
  if (props.node.type === 'folder') {
    emit('create-connection', {
      folderId: props.node.id,
      name: '新建连接'
    })
    isExpanded.value = true
  }
  showActions.value = false
  actionMenuMode.value = null
}

// 开始编辑
const startEdit = () => {
  editName.value = props.node.name
  isEditing.value = true
  showActions.value = false
  actionMenuMode.value = null
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

// 确认编辑
const handleEditConfirm = () => {
  if (editName.value.trim()) {
    props.node.name = editName.value.trim()
    emit('update', props.node)
  }
  isEditing.value = false
}

// 取消编辑
const cancelEdit = () => {
  editName.value = props.node.name
  isEditing.value = false
}

// 失去焦点时确认编辑
const handleEditBlur = () => {
  handleEditConfirm()
}

// 拖拽开始
const handleDragStart = (event: DragEvent) => {
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(props.node))
  }
  emit('drag-node', props.node)
}

// 拖拽结束
const handleDragEnd = () => {
  isDragging.value = false
}

// 拖拽经过
const handleDragOver = (event: DragEvent) => {
  if (props.node.type === 'folder') {
    isDragOver.value = true
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }
}

// 拖拽离开
const handleDragLeave = () => {
  isDragOver.value = false
}

// 放置
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (props.node.type === 'folder' && event.dataTransfer) {
    const dragNodeData = JSON.parse(event.dataTransfer.getData('application/json'))
    emit('drop-node', { dragNode: dragNodeData, dropNode: props.node })
  }
}
</script>

<style scoped>
.ssh-tree-node {
  user-select: none;
}

.tree-node-content {
  display: flex;
  align-items: center;
  padding: 4px 8px 4px 0;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.1s ease;
  position: relative;
}

.tree-node-content:hover {
  background: var(--vscode-bg-lighter);
}

.tree-node-content.is-selected {
  background: var(--vscode-bg-lighter);
}

.tree-node-content.is-dragging {
  opacity: 0.5;
}

.tree-node-content.is-drag-over {
  background: var(--vscode-accent);
  opacity: 0.3;
}

.tree-node-arrow {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  color: var(--vscode-fg-muted);
  flex-shrink: 0;
}

.chevron-icon {
  transform: rotate(0deg);
  transition: transform 0.15s ease;
  color: var(--vscode-fg-muted);
}

.chevron-icon.expanded {
  transform: rotate(90deg);
}

.tree-node-spacer {
  width: 16px;
  height: 16px;
}

.tree-node-icon {
  margin-right: 6px;
  font-size: 14px;
}

.tree-node-label-group {
  display: inline-flex;
  align-items: flex-end;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.tree-node-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vscode-fg);
}

.tree-node-connection-status {
  color: var(--vscode-warning);
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.tree-node-input {
  flex: 1;
  background: var(--vscode-bg-input);
  border: 1px solid var(--vscode-accent);
  color: var(--vscode-fg);
  font-size: 13px;
  padding: 2px 6px;
  outline: none;
}

.tree-node-actions {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.15s ease;
  display: flex;
  gap: 4px;
}

.tree-node-content:hover .tree-node-actions {
  opacity: 1;
}

.tree-node-actions.menu-visible {
  opacity: 1;
}

.tree-node-children {
  margin-left: 0;
}

/* 图标样式 */
.bi-chevron-right::before {
  content: '›';
  font-size: 16px;
}
.bi-chevron-down::before {
  content: '⌄';
  font-size: 16px;
}
.bi-folder::before {
  content: '📁';
}
.bi-folder-open::before {
  content: '📂';
}
.bi-folder-plus::before {
  content: '📁';
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
.bi-trash::before {
  content: '🗑️';
}

.vscode-icon-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s ease;
  color: var(--vscode-fg-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.vscode-icon-button:hover {
  color: var(--vscode-fg);
  background: var(--vscode-bg-lighter);
}

.vscode-icon-button i {
  font-size: 11px;
}

/* 操作菜单样式 */
.action-menu-wrapper {
  position: relative;
}

.more-button {
  opacity: 0;
  transition: opacity 0.15s ease;
}

.tree-node-content:hover .more-button {
  opacity: 1;
}

.action-dropdown {
  position: fixed;
  z-index: 1000;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  padding: 4px 0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--vscode-fg);
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-item:hover {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
}

.action-item.danger {
  color: var(--vscode-error);
}

.action-item.danger:hover {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
}

.action-divider {
  height: 1px;
  background: var(--vscode-border);
  margin: 4px 0;
}

.action-item i {
  font-size: 12px;
  width: 16px;
  text-align: center;
}

/* 三点图标 */
.bi-three-dots-vertical::before {
  content: '⋮';
  font-size: 16px;
  font-weight: bold;
}

/* 齿轮图标 */
.bi-gear::before {
  content: '⚙';
  font-size: 14px;
}
</style>
