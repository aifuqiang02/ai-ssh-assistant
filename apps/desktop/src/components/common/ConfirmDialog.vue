<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
        <div class="dialog-container" @click.stop>
          <!-- 对话框头部 -->
          <div class="dialog-header">
            <div class="dialog-icon" :class="iconClass">
              <i :class="iconName"></i>
            </div>
            <h3 class="dialog-title">{{ title }}</h3>
          </div>

          <!-- 对话框内容 -->
          <div class="dialog-content">
            <p class="dialog-message">{{ message }}</p>
          </div>

          <!-- 对话框按钮 -->
          <div class="dialog-footer">
            <button
              class="dialog-button dialog-button-cancel"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="dialog-button dialog-button-confirm"
              :class="confirmButtonClass"
              @click="handleConfirm"
              ref="confirmButtonRef"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'info' | 'success'
  closeOnOverlay?: boolean
}

const props = withDefaults(defineProps<{
  visible: boolean
  options: ConfirmOptions
}>(), {
  visible: false
})

const emit = defineEmits<{
  'confirm': []
  'cancel': []
  'update:visible': [value: boolean]
}>()

const confirmButtonRef = ref<HTMLButtonElement | null>(null)

// 计算属性
const title = computed(() => props.options.title || '确认操作')
const message = computed(() => props.options.message)
const confirmText = computed(() => props.options.confirmText || '确定')
const cancelText = computed(() => props.options.cancelText || '取消')
const type = computed(() => props.options.type || 'warning')
const closeOnOverlay = computed(() => props.options.closeOnOverlay !== false)

const iconName = computed(() => {
  const icons = {
    warning: 'bi bi-exclamation-triangle',
    danger: 'bi bi-exclamation-octagon',
    info: 'bi bi-info-circle',
    success: 'bi bi-check-circle'
  }
  return icons[type.value]
})

const iconClass = computed(() => `dialog-icon-${type.value}`)

const confirmButtonClass = computed(() => `dialog-button-${type.value}`)

// 方法
const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleOverlayClick = () => {
  if (closeOnOverlay.value) {
    handleCancel()
  }
}

// 监听 visible 变化，自动聚焦确认按钮
watch(() => props.visible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      confirmButtonRef.value?.focus()
    })
  }
})

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.visible) return
  
  if (e.key === 'Enter') {
    e.preventDefault()
    handleConfirm()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
  }
}

// 添加键盘监听
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
/* 遮罩层 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

/* 对话框容器 */
.dialog-container {
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  min-width: 400px;
  max-width: 500px;
  overflow: hidden;
  animation: dialogSlideIn 0.2s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 对话框头部 */
.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--vscode-border);
}

.dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
}

.dialog-icon-warning {
  background: var(--vscode-editorGutter-modifiedBackground);
  opacity: 0.15;
  color: var(--vscode-warning);
}

.dialog-icon-danger {
  background: var(--vscode-editorGutter-deletedBackground);
  opacity: 0.15;
  color: var(--vscode-error);
}

.dialog-icon-info {
  background: var(--vscode-button-background);
  opacity: 0.15;
  color: var(--vscode-accent);
}

.dialog-icon-success {
  background: var(--vscode-editorGutter-addedBackground);
  opacity: 0.15;
  color: var(--vscode-success);
}

.dialog-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
}

/* 对话框内容 */
.dialog-content {
  padding: 20px 24px;
}

.dialog-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vscode-fg);
  white-space: pre-wrap;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--vscode-border);
  background: var(--vscode-bg-lighter);
}

/* 按钮样式 */
.dialog-button {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.dialog-button:focus {
  box-shadow: 0 0 0 2px var(--vscode-accent);
}

.dialog-button-cancel {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-border);
  color: var(--vscode-fg);
}

.dialog-button-cancel:hover {
  background: var(--vscode-bg);
  border-color: var(--vscode-fg-muted);
}

.dialog-button-confirm {
  color: var(--vscode-button-foreground);
}

.dialog-button-warning {
  background: var(--vscode-warning);
  border-color: var(--vscode-warning);
}

.dialog-button-warning:hover {
  opacity: 0.9;
}

.dialog-button-danger {
  background: var(--vscode-error);
  border-color: var(--vscode-error);
}

.dialog-button-danger:hover {
  opacity: 0.9;
}

.dialog-button-info {
  background: var(--vscode-accent);
  border-color: var(--vscode-accent);
}

.dialog-button-info:hover {
  opacity: 0.9;
}

.dialog-button-success {
  background: var(--vscode-success);
  border-color: var(--vscode-success);
}

.dialog-button-success:hover {
  opacity: 0.9;
}

/* 过渡动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .dialog-container {
  animation: dialogSlideIn 0.2s ease-out;
}

.dialog-fade-leave-active .dialog-container {
  animation: dialogSlideOut 0.2s ease-in;
}

@keyframes dialogSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}
</style>

