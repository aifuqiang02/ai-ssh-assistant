<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-wrapper">
      <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">
          <i class="bi bi-lightning-charge"></i>
          快捷命令
        </h3>
        <button class="btn-close" @click="handleClose">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <i class="bi bi-search"></i>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索命令..."
            class="search-input"
          />
        </div>

        <!-- 统计信息 -->
        <div class="stats-bar">
          <span class="stat-item">
            <i class="bi bi-lightning"></i>
            共 {{ filteredCommands.length }} 个命令
          </span>
          <div class="sort-options">
            <button
              :class="['sort-btn', { active: sortBy === 'frequency' }]"
              @click="sortBy = 'frequency'"
              title="按使用频率排序"
            >
              <i class="bi bi-sort-numeric-down"></i>
              使用频率
            </button>
            <button
              :class="['sort-btn', { active: sortBy === 'time' }]"
              @click="sortBy = 'time'"
              title="按创建时间排序"
            >
              <i class="bi bi-clock-history"></i>
              创建时间
            </button>
          </div>
        </div>

        <!-- 命令列表 -->
        <div class="commands-list">
          <div
            v-if="filteredCommands.length === 0"
            class="empty-state"
          >
            <i class="bi bi-inbox"></i>
            <p>{{ searchKeyword ? '未找到匹配的命令' : '还没有快捷命令' }}</p>
            <p class="empty-hint">在终端中选中命令后右键选择"收藏为快捷命令"</p>
          </div>

          <div
            v-for="command in filteredCommands"
            :key="command.id"
            class="command-item"
            @click="handleUseCommand(command)"
          >
            <div class="command-info">
              <div class="command-header">
                <code class="command-text">{{ command.command }}</code>
                <div class="command-meta">
                  <span v-if="command.usedCount > 0" class="usage-badge">
                    <i class="bi bi-arrow-repeat"></i>
                    {{ command.usedCount }}
                  </span>
                </div>
              </div>
              <div v-if="command.description" class="command-description">
                {{ command.description }}
              </div>
              <div v-if="command.tags && command.tags.length > 0" class="command-tags">
                <span v-for="tag in command.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
              <div class="command-footer">
                <span class="created-time">
                  {{ formatTime(command.createdAt) }}
                </span>
                <span v-if="command.lastUsedAt" class="last-used">
                  最后使用: {{ formatTime(command.lastUsedAt) }}
                </span>
              </div>
            </div>
            <div class="command-actions">
              <button
                class="action-btn btn-edit"
                @click.stop="handleEdit(command)"
                title="编辑"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="action-btn btn-delete"
                @click.stop="handleDelete(command)"
                title="删除"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="handleClose">
          关闭
        </button>
        <button class="btn-primary" @click="handleExport">
          <i class="bi bi-download"></i>
          导出
        </button>
        <button class="btn-primary" @click="handleImport">
          <i class="bi bi-upload"></i>
          导入
        </button>
      </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div v-if="editingCommand" class="edit-modal-wrapper">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h3 class="modal-title">编辑快捷命令</h3>
          <button class="btn-close" @click="cancelEdit">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>命令</label>
            <textarea
              v-model="editForm.command"
              class="form-control"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label>描述（可选）</label>
            <input
              v-model="editForm.description"
              type="text"
              class="form-control"
              placeholder="添加描述..."
            />
          </div>
          <div class="form-group">
            <label>标签（可选，用逗号分隔）</label>
            <input
              v-model="editForm.tagsText"
              type="text"
              class="form-control"
              placeholder="如: docker, 部署, 常用"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cancelEdit">取消</button>
          <button class="btn-primary" @click="saveEdit">保存</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { shortcutCommandService, type ShortcutCommand } from '@/services/shortcut-command.service'
import { $alert, $confirm } from '@/composables/useDialog'

interface Props {
  visible: boolean
  connectionId?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'use-command', command: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 数据
const commands = ref<ShortcutCommand[]>([])
const searchKeyword = ref('')
const sortBy = ref<'frequency' | 'time'>('frequency')
const editingCommand = ref<ShortcutCommand | null>(null)
const editForm = ref({
  command: '',
  description: '',
  tagsText: ''
})

// 计算属性
const filteredCommands = computed(() => {
  let list = commands.value

  // 搜索过滤
  if (searchKeyword.value) {
    list = shortcutCommandService.search(searchKeyword.value, props.connectionId)
  }

  // 排序
  if (sortBy.value === 'frequency') {
    list = [...list].sort((a, b) => b.usedCount - a.usedCount)
  } else {
    list = [...list].sort((a, b) => b.createdAt - a.createdAt)
  }

  return list
})

// 监听 visible 变化，刷新数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadCommands()
  }
})

// ESC 键关闭弹窗
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (editingCommand.value) {
      cancelEdit()
    } else if (props.visible) {
      handleClose()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 方法
const loadCommands = () => {
  commands.value = shortcutCommandService.getAll(props.connectionId)
}

const handleClose = () => {
  emit('close')
}

const handleUseCommand = (command: ShortcutCommand) => {
  shortcutCommandService.recordUsage(command.id, props.connectionId)
  emit('use-command', command.command)
  emit('close')
}

const handleEdit = (command: ShortcutCommand) => {
  editingCommand.value = command
  editForm.value = {
    command: command.command,
    description: command.description || '',
    tagsText: command.tags?.join(', ') || ''
  }
}

const cancelEdit = () => {
  editingCommand.value = null
  editForm.value = {
    command: '',
    description: '',
    tagsText: ''
  }
}

const saveEdit = () => {
  if (!editingCommand.value) return

  const tags = editForm.value.tagsText
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)

  shortcutCommandService.update(
    editingCommand.value.id,
    {
      command: editForm.value.command,
      description: editForm.value.description || undefined,
      tags: tags.length > 0 ? tags : undefined
    },
    props.connectionId
  )

  loadCommands()
  cancelEdit()
}

const handleDelete = async (command: ShortcutCommand) => {
  if (await $confirm(`确定要删除快捷命令 "${command.command}" 吗？`)) {
    shortcutCommandService.delete(command.id, props.connectionId)
    loadCommands()
  }
}

const handleExport = () => {
  const data = shortcutCommandService.export(props.connectionId)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const timestamp = Date.now()
  const connId = props.connectionId ? `_${props.connectionId}` : ''
  a.download = `shortcut-commands${connId}_${timestamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const handleImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as string
      if (shortcutCommandService.import(data, props.connectionId)) {
        loadCommands();
        
        $alert('导入成功！')
      } else {
        $alert('导入失败，请检查文件格式')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / 60 / 1000)} 分钟前`
  }
  // 小于1天
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / 60 / 60 / 1000)} 小时前`
  }
  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / 24 / 60 / 60 / 1000)} 天前`
  }
  
  // 格式化为日期
  return date.toLocaleDateString('zh-CN')
}

// 初始加载
if (props.visible) {
  loadCommands()
}
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.edit-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
}

.modal-content {
  background: var(--vscode-bg-light);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--vscode-border);
  width: 800px;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-small {
  width: 500px;
  max-width: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vscode-fg);
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--vscode-fg-muted);
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: var(--vscode-hover);
  color: var(--vscode-fg);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.search-bar {
  position: relative;
  margin-bottom: 16px;
}

.search-bar i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vscode-fg-muted);
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--vscode-accent);
}

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: var(--vscode-bg-lighter);
  border-radius: 6px;
}

.stat-item {
  font-size: 13px;
  color: var(--vscode-fg-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.sort-options {
  display: flex;
  gap: 4px;
}

.sort-btn {
  padding: 4px 10px;
  border: 1px solid var(--vscode-border);
  background: var(--vscode-bg);
  color: var(--vscode-fg-muted);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.sort-btn:hover {
  background: var(--vscode-hover);
  color: var(--vscode-fg);
}

.sort-btn.active {
  background: var(--vscode-accent);
  color: white;
  border-color: var(--vscode-accent);
}

.commands-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--vscode-fg-muted);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 8px 0;
}

.empty-hint {
  font-size: 13px;
  opacity: 0.7;
}

.command-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  background: var(--vscode-bg-lighter);
  cursor: pointer;
  transition: all 0.2s;
}

.command-item:hover {
  background: var(--vscode-hover);
  border-color: var(--vscode-accent);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.command-info {
  flex: 1;
  min-width: 0;
}

.command-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.command-text {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: var(--vscode-fg);
  background: var(--vscode-bg);
  padding: 4px 8px;
  border-radius: 4px;
  word-break: break-all;
}

.command-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.usage-badge {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--vscode-accent);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.command-description {
  font-size: 13px;
  color: var(--vscode-fg-muted);
  margin-bottom: 8px;
}

.command-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--vscode-bg);
  color: var(--vscode-fg-muted);
  border-radius: 10px;
  border: 1px solid var(--vscode-border);
}

.command-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--vscode-fg-muted);
}

.command-actions {
  display: flex;
  gap: 4px;
  margin-left: 12px;
}

.action-btn {
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: var(--vscode-fg-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.action-btn:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.btn-delete:hover {
  color: var(--vscode-editorGutter-deletedBackground);
  background: rgba(220, 38, 38, 0.1);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--vscode-border);
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--vscode-accent);
  color: white;
}

.btn-primary:hover {
  background: var(--vscode-accent-hover);
}

.btn-secondary {
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
  border: 1px solid var(--vscode-border);
}

.btn-secondary:hover {
  background: var(--vscode-hover);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
  font-size: 14px;
  font-family: inherit;
}

.form-control:focus {
  outline: none;
  border-color: var(--vscode-accent);
}

textarea.form-control {
  resize: vertical;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>

