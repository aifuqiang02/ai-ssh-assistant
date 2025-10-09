<template>
  <div class="chat-tree-node">
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
    >
      <!-- 展开/折叠图标 -->
      <div class="tree-node-arrow">
        <svg 
          v-if="node.type === 'folder'"
          :class="['chevron-icon', { 'expanded': isExpanded }]"
          width="16" 
          height="16" 
          viewBox="0 0 16 16"
          @click.stop="toggleExpand"
        >
          <path 
            fill="currentColor" 
            d="M6 4l4 4-4 4V4z"
          />
        </svg>
        <span v-else class="tree-node-spacer"></span>
      </div>

      <!-- 节点图标（仅显示会话图标） -->
      <i 
        v-if="node.type === 'session'"
        class="bi bi-chat-dots tree-node-icon text-vscode-accent"
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
      <span v-else class="tree-node-label">{{ node.name }}</span>

      <!-- 消息数量徽章（仅会话节点） -->
      <span 
        v-if="node.type === 'session' && node.messageCount && node.messageCount > 0"
        class="message-badge"
      >
        {{ node.messageCount }}
      </span>

      <!-- 更多操作按钮 -->
      <div class="tree-node-actions" @click.stop>
        <div class="action-menu-wrapper">
          <button
            class="vscode-icon-button more-button"
            @click="toggleActionMenu"
            @mouseenter="showActionMenu"
            @mouseleave="scheduleHideActionMenu"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          
          <!-- 操作下拉菜单 -->
          <div 
            v-if="showActions"
            class="action-dropdown"
            @mouseenter="cancelHideActionMenu"
            @mouseleave="scheduleHideActionMenu"
          >
            <!-- 会话节点菜单 -->
            <template v-if="node.type === 'session'">
              <div class="action-item" @click="handleOpenSession">
                <i class="bi bi-box-arrow-up-right"></i>
                <span>打开对话</span>
              </div>
              <div class="action-divider"></div>
              <div class="action-item" @click="startEdit">
                <i class="bi bi-pencil"></i>
                <span>重命名</span>
              </div>
              <div class="action-item danger" @click="handleDelete">
                <i class="bi bi-trash"></i>
                <span>删除</span>
              </div>
            </template>
            
            <!-- 文件夹节点菜单 -->
            <template v-else>
              <div class="action-item" @click="handleCreateFolder">
                <i class="bi bi-folder-plus"></i>
                <span>新建文件夹</span>
              </div>
              <div class="action-item" @click="handleCreateSession">
                <i class="bi bi-chat-dots"></i>
                <span>新建对话</span>
              </div>
              <div class="action-divider"></div>
              <div class="action-item" @click="startEdit">
                <i class="bi bi-pencil"></i>
                <span>重命名</span>
              </div>
              <div class="action-item danger" @click="handleDelete">
                <i class="bi bi-trash"></i>
                <span>删除</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 子节点 -->
    <div v-if="node.type === 'folder' && isExpanded && node.children" class="tree-node-children">
      <ChatTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :selected-id="selectedId"
        :auto-edit-id="autoEditId"
        :edit-trigger="editTrigger"
        @select="$emit('select', $event)"
        @update="$emit('update', $event)"
        @delete="$emit('delete', $event)"
        @open-session="$emit('open-session', $event)"
        @drag-node="$emit('drag-node', $event)"
        @drop-node="$emit('drop-node', $event)"
        @create-folder="$emit('create-folder', $event)"
        @create-session="$emit('create-session', $event)"
        @request-input="$emit('request-input', $event)"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

export interface ChatTreeNodeData {
  id: string
  name: string
  type: 'folder' | 'session'
  order?: number
  children?: ChatTreeNodeData[]
  // 文件夹特有属性
  parentId?: string | null
  // 会话特有属性
  folderId?: string | null
  lastMessageAt?: Date
  messageCount?: number
  model?: string
}

interface Props {
  node: ChatTreeNodeData
  depth?: number
  selectedId?: string | null
  autoEditId?: string | null
  editTrigger?: number
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
  selectedId: null,
  autoEditId: null,
  editTrigger: 0
})

const emit = defineEmits<{
  select: [node: ChatTreeNodeData]
  update: [node: ChatTreeNodeData]
  delete: [node: ChatTreeNodeData]
  'open-session': [node: ChatTreeNodeData]
  'drag-node': [node: ChatTreeNodeData]
  'drop-node': [data: { dragNode: ChatTreeNodeData; dropNode: ChatTreeNodeData }]
  'create-folder': [data: { parentId: string; name: string }]
  'create-session': [data: { folderId: string; name: string }]
  'request-input': [data: { type: string; title: string; placeholder: string; callback: (name: string) => void }]
}>()

// 展开/折叠状态（文件夹默认展开）
const isExpanded = ref(props.node.type === 'folder')

// 选中状态
const isSelected = computed(() => props.selectedId === props.node.id)

// 编辑状态
const isEditing = ref(false)
const editName = ref('')
const editInput = ref<HTMLInputElement | null>(null)

// 拖拽状态
const isDragging = ref(false)
const isDragOver = ref(false)

// 操作菜单
const showActions = ref(false)
let hideTimer: number | null = null

// 监听 editTrigger 和 autoEditId，如果匹配当前节点则自动进入编辑模式
watch([() => props.editTrigger, () => props.autoEditId], ([trigger, editId]) => {
  if (trigger > 0 && editId === props.node.id && !isEditing.value) {
    startEdit()
  }
})

const toggleExpand = () => {
  if (props.node.type === 'folder') {
    isExpanded.value = !isExpanded.value
  }
}

const handleNodeClick = () => {
  emit('select', props.node)
  if (props.node.type === 'session') {
    emit('open-session', props.node)
  }
}

const handleOpenSession = () => {
  emit('open-session', props.node)
  hideActions()
}

const startEdit = async () => {
  editName.value = props.node.name
  isEditing.value = true
  hideActions()
  await nextTick()
  editInput.value?.focus()
  editInput.value?.select()
}

const cancelEdit = () => {
  isEditing.value = false
  editName.value = ''
}

const handleEditBlur = () => {
  if (isEditing.value) {
    handleEditConfirm()
  }
}

const handleEditConfirm = () => {
  if (editName.value.trim() && editName.value !== props.node.name) {
    const updatedNode = {
      ...props.node,
      name: editName.value.trim()
    }
    emit('update', updatedNode)
  }
  cancelEdit()
}

const handleDelete = () => {
  emit('delete', props.node)
  hideActions()
}

const handleCreateFolder = () => {
  // 通过事件请求父组件显示输入对话框
  emit('request-input', {
    type: 'folder',
    title: '新建文件夹',
    placeholder: '请输入文件夹名称',
    callback: (name: string) => {
      emit('create-folder', {
        parentId: props.node.id,
        name: name.trim()
      })
    }
  })
  hideActions()
}

const handleCreateSession = () => {
  // 通过事件请求父组件显示输入对话框
  emit('request-input', {
    type: 'session',
    title: '新建对话',
    placeholder: '请输入对话名称',
    callback: (name: string) => {
      emit('create-session', {
        folderId: props.node.id,
        name: name.trim()
      })
    }
  })
  hideActions()
}

// 拖拽相关
const handleDragStart = (event: DragEvent) => {
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', props.node.id)
  }
  emit('drag-node', props.node)
}

const handleDragEnd = () => {
  isDragging.value = false
}

const handleDragOver = (event: DragEvent) => {
  if (props.node.type === 'folder') {
    event.preventDefault()
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (props.node.type === 'folder') {
    const dragNodeId = event.dataTransfer?.getData('text/plain')
    if (dragNodeId && dragNodeId !== props.node.id) {
      // 这里需要通过父组件处理，因为需要找到被拖拽的节点
      // emit('drop-node', { dragNodeId, dropNodeId: props.node.id })
    }
  }
}

// 操作菜单相关
const showActionMenu = () => {
  cancelHideActionMenu()
  showActions.value = true
}

const hideActions = () => {
  showActions.value = false
}

const scheduleHideActionMenu = () => {
  hideTimer = window.setTimeout(() => {
    hideActions()
  }, 200)
}

const cancelHideActionMenu = () => {
  if (hideTimer !== null) {
    window.clearTimeout(hideTimer)
    hideTimer = null
  }
}

const toggleActionMenu = () => {
  showActions.value = !showActions.value
}
</script>

<style scoped>
.chat-tree-node {
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

.tree-node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vscode-fg);
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

.message-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  margin-left: 6px;
  background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground);
  border-radius: 9px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
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

.tree-node-children {
  margin-left: 0;
}

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
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  padding: 4px 0;
  margin-top: 2px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--vscode-fg);
  transition: background 0.15s ease;
}

.action-item:hover {
  background: var(--vscode-bg-lighter);
}

.action-item.danger {
  color: var(--vscode-error);
}

.action-item i {
  font-size: 12px;
  width: 14px;
  text-align: center;
}

.action-divider {
  height: 1px;
  background: var(--vscode-border);
  margin: 2px 0;
}

/* vscode 按钮样式 */
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
</style>

