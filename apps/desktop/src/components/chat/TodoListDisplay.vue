<template>
  <div
    v-if="todos && todos.length > 0"
    class="todo-list-container"
  >
    <div
      class="todo-header"
      @click="toggleCollapse"
    >
      <!-- Status Icon -->
      <span :class="['status-icon', statusIconClass]"></span>
      
      <!-- Most Important Todo Text -->
      <span class="todo-text">
        {{ headerText }}
      </span>
      
      <!-- Progress Counter -->
      <div class="progress-counter">
        <i class="bi bi-check2-square"></i>
        <span>{{ completedCount }}/{{ totalCount }}</span>
      </div>
    </div>

    <!-- Expanded Todo List (Floating Panel) -->
    <Teleport to="body">
      <div v-if="!isCollapsed" class="todo-overlay-container">
        <!-- Backdrop -->
        <div class="todo-backdrop" @click="toggleCollapse"></div>
        
        <!-- Floating Panel -->
        <div
          class="todo-floating-panel"
          :style="{ top: panelPosition.top, left: panelPosition.left, width: panelPosition.width }"
        >
          <!-- Panel Header -->
          <div class="panel-header">
            <div class="header-left">
              <i class="bi bi-check2-square"></i>
              <span class="header-title">Todo List</span>
              <span class="header-count">{{ completedCount }}/{{ totalCount }}</span>
            </div>
            <div class="header-actions">
              <i 
                class="bi bi-trash action-icon"
                title="清除任务列表"
                @click.stop="handleClear"
              ></i>
              <i 
                class="bi bi-chevron-down collapse-icon"
                @click.stop="toggleCollapse"
              ></i>
            </div>
          </div>

          <!-- Todo Items -->
          <ul ref="todoListRef" class="todo-items-list">
            <li
              v-for="(todo, index) in todos"
              :key="todo.id"
              :ref="el => setItemRef(el, index)"
              class="todo-item"
            >
              <span :class="['item-status-icon', getStatusClass(todo.status)]"></span>
              <span :class="['item-text', getStatusClass(todo.status)]">
                {{ todo.content }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

// Todo 类型定义
interface Todo {
  id: string
  content: string
  status: 'pending' | 'in_progress' | 'completed'
}

// Props
const props = defineProps<{
  todos: Todo[]
}>()

// Emits
const emit = defineEmits<{
  'clear': []
}>()

// 响应式状态
const isCollapsed = ref(true)
const todoListRef = ref<HTMLUListElement | null>(null)
const itemRefs = ref<(HTMLLIElement | null)[]>([])
const headerElement = ref<HTMLElement | null>(null)
const panelPosition = ref({ top: '0px', left: '0px', width: 'auto' })

// 计算属性
const totalCount = computed(() => props.todos.length)
const completedCount = computed(() => props.todos.filter(t => t.status === 'completed').length)
const allCompleted = computed(() => completedCount.value === totalCount.value && totalCount.value > 0)

const mostImportantTodo = computed(() => {
  // 优先显示 in_progress 的任务
  const inProgress = props.todos.find(t => t.status === 'in_progress')
  if (inProgress) return inProgress
  
  // 其次显示 pending 的任务
  return props.todos.find(t => t.status === 'pending')
})

const headerText = computed(() => {
  if (allCompleted.value) return '所有任务已完成！'
  return mostImportantTodo.value?.content || '没有待处理任务'
})

const statusIconClass = computed(() => {
  if (allCompleted.value) return 'completed'
  if (!mostImportantTodo.value) return 'default'
  return mostImportantTodo.value.status
})

const scrollIndex = computed(() => {
  const inProgressIdx = props.todos.findIndex(t => t.status === 'in_progress')
  if (inProgressIdx !== -1) return inProgressIdx
  return props.todos.findIndex(t => t.status !== 'completed')
})

// 方法
const toggleCollapse = (event?: MouseEvent) => {
  if (event && event.target instanceof HTMLElement) {
    const rect = event.target.closest('.todo-header')?.getBoundingClientRect()
    if (rect) {
      // 计算浮动面板的位置（在标题上方）
      // 估算面板高度：header(49px) + items(~30px per item) + padding
      const itemHeight = 30
      const headerHeight = 49
      const padding = 24
      const estimatedHeight = Math.min(400, headerHeight + (props.todos.length * itemHeight) + padding)
      
      panelPosition.value = {
        top: `${Math.max(10, rect.top - estimatedHeight - 4)}px`, // 确保不超出屏幕顶部
        left: `${rect.left}px`,
        width: `${rect.width}px` // 与标题栏宽度一致
      }
    }
  }
  isCollapsed.value = !isCollapsed.value
}

const setItemRef = (el: any, index: number) => {
  if (el) {
    itemRefs.value[index] = el as HTMLLIElement
  }
}

const getStatusClass = (status: string): string => {
  return status
}

const handleClear = () => {
  emit('clear')
  isCollapsed.value = true
}

// 监听 todos 变化，自动滚动到当前任务
watch(() => [props.todos, isCollapsed.value], () => {
  if (isCollapsed.value) return
  
  nextTick(() => {
    if (!todoListRef.value || scrollIndex.value === -1) return
    
    const target = itemRefs.value[scrollIndex.value]
    if (target && todoListRef.value) {
      const ul = todoListRef.value
      const targetTop = target.offsetTop - ul.offsetTop
      const targetHeight = target.offsetHeight
      const ulHeight = ul.clientHeight
      const scrollTo = targetTop - (ulHeight / 2 - targetHeight / 2)
      ul.scrollTop = scrollTo
    }
  })
}, { deep: true })

// 生命周期
onMounted(() => {
  // 监听窗口大小变化，关闭面板
  window.addEventListener('resize', () => {
    if (!isCollapsed.value) {
      isCollapsed.value = true
    }
  })
})

onBeforeUnmount(() => {
  // 清理事件监听器已经由 window.removeEventListener 自动处理
})
</script>

<style scoped>
.todo-list-container {
  margin: 0;
  border: 1px solid var(--vscode-panel-border);
  border-top: 0;
  border-radius: 0 0 6px 6px;
  background: var(--vscode-editor-background);
  position: relative;
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.todo-header:hover {
  background: var(--vscode-list-hoverBackground);
}

/* Status Icons */
.status-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 2px;
}

.status-icon.completed {
  background: var(--vscode-charts-green, #4caf50);
}

.status-icon.in_progress {
  background: var(--vscode-charts-yellow, #ffc107);
}

.status-icon.pending {
  border: 1px solid var(--vscode-descriptionForeground);
  background: transparent;
}

.status-icon.default {
  background: var(--vscode-descriptionForeground);
}

.todo-text {
  flex: 1;
  font-weight: 500;
  color: var(--vscode-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.todo-header:has(.status-icon.completed) .todo-text {
  color: var(--vscode-charts-green, #4caf50);
}

.todo-header:has(.status-icon.in_progress) .todo-text {
  color: var(--vscode-charts-yellow, #ffc107);
}

.progress-counter {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
  font-weight: 500;
}

.progress-counter i {
  font-size: 12px;
}

/* Overlay Container (Teleport to body) */
.todo-overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: none;
}

.todo-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: all;
}

/* Floating Panel */
.todo-floating-panel {
  position: fixed;
  width: 400px;
  max-width: calc(100vw - 40px);
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-panel-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  max-height: 400px;
  min-height: 200px;
  overflow: hidden;
  pointer-events: all;
  /* 确保面板完全不透明，遮盖下层内容 */
  opacity: 1;
  z-index: 1001;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
  background: var(--vscode-editor-background);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left i {
  color: var(--vscode-foreground);
  font-size: 14px;
}

.header-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--vscode-foreground);
}

.header-count {
  color: var(--vscode-descriptionForeground);
  font-size: 13px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-icon {
  font-size: 13px;
  opacity: 0.6;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  transition: all 0.2s;
  color: var(--vscode-foreground);
}

.action-icon:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
  color: var(--vscode-errorForeground);
}

.collapse-icon {
  font-size: 14px;
  opacity: 0.7;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  transition: all 0.2s;
}

.collapse-icon:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

/* Todo Items List */
.todo-items-list {
  margin: 0;
  padding: 12px 16px;
  list-style: none;
  max-height: 340px;
  overflow-y: auto;
  background: var(--vscode-editor-background);
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  min-height: 20px;
  line-height: 1.4;
  background: var(--vscode-editor-background);
  padding: 2px 0;
}

.item-status-icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 7px;
}

.item-status-icon.completed {
  background: var(--vscode-charts-green, #4caf50);
}

.item-status-icon.in_progress {
  background: var(--vscode-charts-yellow, #ffc107);
}

.item-status-icon.pending {
  border: 1px solid var(--vscode-descriptionForeground);
  background: transparent;
}

.item-text {
  font-weight: 500;
  word-break: break-word;
  font-size: 13px;
}

.item-text.completed {
  color: var(--vscode-charts-green, #4caf50);
}

.item-text.in_progress {
  color: var(--vscode-charts-yellow, #ffc107);
}

.item-text.pending {
  color: var(--vscode-foreground);
}
</style>

