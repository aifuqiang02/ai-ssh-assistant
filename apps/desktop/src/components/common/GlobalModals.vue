<template>
  <div class="global-modals">
    <!-- 确认对话框 -->
    <transition name="modal">
      <div
        v-if="confirmModal.visible"
        class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="confirmModal.visible = false"
      >
        <div class="modal-content bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <div class="modal-header mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ confirmModal.title || '确认操作' }}
            </h3>
          </div>
          
          <div class="modal-body mb-6">
            <p class="text-gray-600 dark:text-gray-300">
              {{ confirmModal.message }}
            </p>
          </div>
          
          <div class="modal-footer flex justify-end gap-3">
            <button
              @click="handleConfirmCancel"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {{ confirmModal.cancelText || '取消' }}
            </button>
            <button
              @click="handleConfirmOk"
              :class="[
                'px-4 py-2 rounded text-white transition-colors',
                confirmModal.type === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              ]"
            >
              {{ confirmModal.okText || '确定' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 信息对话框 -->
    <transition name="modal">
      <div
        v-if="alertModal.visible"
        class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="alertModal.visible = false"
      >
        <div class="modal-content bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <div class="modal-header mb-4 flex items-center gap-3">
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center',
                alertModal.type === 'success' ? 'bg-green-100 text-green-600' :
                alertModal.type === 'error' ? 'bg-red-100 text-red-600' :
                alertModal.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                'bg-blue-100 text-blue-600'
              ]"
            >
              <span class="text-lg">
                {{ 
                  alertModal.type === 'success' ? '✓' :
                  alertModal.type === 'error' ? '✕' :
                  alertModal.type === 'warning' ? '⚠' : 'ℹ'
                }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ alertModal.title || '提示' }}
            </h3>
          </div>
          
          <div class="modal-body mb-6">
            <p class="text-gray-600 dark:text-gray-300">
              {{ alertModal.message }}
            </p>
          </div>
          
          <div class="modal-footer flex justify-end">
            <button
              @click="handleAlertOk"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {{ alertModal.okText || '确定' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 输入对话框 -->
    <transition name="modal">
      <div
        v-if="promptModal.visible"
        class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="promptModal.visible = false"
      >
        <div class="modal-content bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <div class="modal-header mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ promptModal.title || '输入信息' }}
            </h3>
          </div>
          
          <div class="modal-body mb-6">
            <p class="text-gray-600 dark:text-gray-300 mb-3">
              {{ promptModal.message }}
            </p>
            <input
              v-model="promptModal.inputValue"
              :type="promptModal.inputType || 'text'"
              :placeholder="promptModal.placeholder"
              class="form-input-full"
              @keyup.enter="handlePromptOk"
              @keyup.escape="handlePromptCancel"
              ref="promptInput"
            />
          </div>
          
          <div class="modal-footer flex justify-end gap-3">
            <button
              @click="handlePromptCancel"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {{ promptModal.cancelText || '取消' }}
            </button>
            <button
              @click="handlePromptOk"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {{ promptModal.okText || '确定' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'

// 扩展Window接口以包含$modal属性
declare global {
  interface Window {
    $modal: {
      showConfirm: (options: {
        title?: string
        message: string
        type?: 'info' | 'danger'
        okText?: string
        cancelText?: string
        onOk?: () => void
        onCancel?: () => void
      }) => void
      showAlert: (options: {
        title?: string
        message: string
        type?: 'info' | 'success' | 'error' | 'warning'
        okText?: string
        onOk?: () => void
      }) => void
      showPrompt: (options: {
        title?: string
        message: string
        placeholder?: string
        inputType?: string
        defaultValue?: string
        okText?: string
        cancelText?: string
        onOk?: (value: string) => void
        onCancel?: () => void
      }) => void
    }
  }
}

// 模态框状态
const confirmModal = reactive({
  visible: false,
  title: '',
  message: '',
  type: 'info' as 'info' | 'danger',
  okText: '确定',
  cancelText: '取消',
  onOk: null as (() => void) | null,
  onCancel: null as (() => void) | null
})

const alertModal = reactive({
  visible: false,
  title: '',
  message: '',
  type: 'info' as 'info' | 'success' | 'error' | 'warning',
  okText: '确定',
  onOk: null as (() => void) | null
})

const promptModal = reactive({
  visible: false,
  title: '',
  message: '',
  placeholder: '',
  inputType: 'text',
  inputValue: '',
  okText: '确定',
  cancelText: '取消',
  onOk: null as ((value: string) => void) | null,
  onCancel: null as (() => void) | null
})

const promptInput = ref<HTMLInputElement>()

// 确认对话框处理函数
const handleConfirmOk = () => {
  confirmModal.visible = false
  if (confirmModal.onOk) {
    confirmModal.onOk()
  }
}

const handleConfirmCancel = () => {
  confirmModal.visible = false
  if (confirmModal.onCancel) {
    confirmModal.onCancel()
  }
}

// 信息对话框处理函数
const handleAlertOk = () => {
  alertModal.visible = false
  if (alertModal.onOk) {
    alertModal.onOk()
  }
}

// 输入对话框处理函数
const handlePromptOk = () => {
  const value = promptModal.inputValue
  promptModal.visible = false
  promptModal.inputValue = ''
  if (promptModal.onOk) {
    promptModal.onOk(value)
  }
}

const handlePromptCancel = () => {
  promptModal.visible = false
  promptModal.inputValue = ''
  if (promptModal.onCancel) {
    promptModal.onCancel()
  }
}

// 全局方法
const showConfirm = (options: {
  title?: string
  message: string
  type?: 'info' | 'danger'
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
}) => {
  Object.assign(confirmModal, {
    visible: true,
    title: options.title || '确认操作',
    message: options.message,
    type: options.type || 'info',
    okText: options.okText || '确定',
    cancelText: options.cancelText || '取消',
    onOk: options.onOk || null,
    onCancel: options.onCancel || null
  })
}

const showAlert = (options: {
  title?: string
  message: string
  type?: 'info' | 'success' | 'error' | 'warning'
  okText?: string
  onOk?: () => void
}) => {
  Object.assign(alertModal, {
    visible: true,
    title: options.title || '提示',
    message: options.message,
    type: options.type || 'info',
    okText: options.okText || '确定',
    onOk: options.onOk || null
  })
}

const showPrompt = (options: {
  title?: string
  message: string
  placeholder?: string
  inputType?: string
  defaultValue?: string
  okText?: string
  cancelText?: string
  onOk?: (value: string) => void
  onCancel?: () => void
}) => {
  Object.assign(promptModal, {
    visible: true,
    title: options.title || '输入信息',
    message: options.message,
    placeholder: options.placeholder || '',
    inputType: options.inputType || 'text',
    inputValue: options.defaultValue || '',
    okText: options.okText || '确定',
    cancelText: options.cancelText || '取消',
    onOk: options.onOk || null,
    onCancel: options.onCancel || null
  })
  
  // 聚焦输入框
  nextTick(() => {
    promptInput.value?.focus()
  })
}

// 暴露给全局使用
defineExpose({
  showConfirm,
  showAlert,
  showPrompt
})

// 注册到全局
if (typeof window !== 'undefined') {
  window.$modal = {
    showConfirm,
    showAlert,
    showPrompt
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-content {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>
