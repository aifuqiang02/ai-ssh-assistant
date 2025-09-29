<template>
  <div class="notification-container fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification-item max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
          getNotificationTypeClass(notification.type)
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div 
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-white text-sm',
                  getIconBackgroundClass(notification.type)
                ]"
              >
                {{ getNotificationIcon(notification.type) }}
              </div>
            </div>
            
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p 
                v-if="notification.title"
                class="text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-300">
                {{ notification.message }}
              </p>
              
              <!-- 操作按钮 -->
              <div v-if="notification.actions && notification.actions.length > 0" class="mt-3 flex gap-2">
                <button
                  v-for="action in notification.actions"
                  :key="action.label"
                  @click="handleAction(notification, action)"
                  :class="[
                    'text-sm font-medium rounded-md px-3 py-1 transition-colors',
                    action.type === 'primary' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900'
                  ]"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">关闭</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div 
          v-if="notification.duration && notification.duration > 0"
          class="h-1 bg-gray-200 dark:bg-gray-700"
        >
          <div
            :class="[
              'h-full transition-all ease-linear',
              getProgressBarClass(notification.type)
            ]"
            :style="{ 
              width: `${getProgress(notification)}%`,
              transitionDuration: `${notification.duration}ms`
            }"
          ></div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface NotificationAction {
  label: string
  type?: 'primary' | 'secondary'
  handler: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: NotificationAction[]
  createdAt: number
}

const notifications = ref<Notification[]>([])
let notificationId = 0

// 添加通知
const addNotification = (options: Omit<Notification, 'id' | 'createdAt'>) => {
  const notification: Notification = {
    id: `notification-${++notificationId}`,
    createdAt: Date.now(),
    duration: options.duration ?? 4000,
    ...options
  }
  
  notifications.value.push(notification)
  
  // 自动移除（如果不是持久化通知）
  if (!notification.persistent && notification.duration && notification.duration > 0) {
    setTimeout(() => {
      removeNotification(notification.id)
    }, notification.duration)
  }
  
  return notification.id
}

// 移除通知
const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// 清空所有通知
const clearAll = () => {
  notifications.value = []
}

// 处理操作按钮点击
const handleAction = (notification: Notification, action: NotificationAction) => {
  action.handler()
  removeNotification(notification.id)
}

// 获取通知类型对应的样式类
const getNotificationTypeClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'border-l-4 border-green-400'
    case 'error':
      return 'border-l-4 border-red-400'
    case 'warning':
      return 'border-l-4 border-yellow-400'
    default:
      return 'border-l-4 border-blue-400'
  }
}

// 获取图标背景样式类
const getIconBackgroundClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-blue-500'
  }
}

// 获取进度条样式类
const getProgressBarClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-yellow-500'
    default:
      return 'bg-blue-500'
  }
}

// 获取通知图标
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    default:
      return 'ℹ'
  }
}

// 获取进度百分比
const getProgress = (notification: Notification) => {
  if (!notification.duration || notification.duration <= 0) return 0
  
  const elapsed = Date.now() - notification.createdAt
  const progress = Math.max(0, 100 - (elapsed / notification.duration) * 100)
  return progress
}

// 便捷方法
const success = (message: string, options?: Partial<Notification>) => {
  return addNotification({ ...options, type: 'success', message })
}

const error = (message: string, options?: Partial<Notification>) => {
  return addNotification({ ...options, type: 'error', message })
}

const warning = (message: string, options?: Partial<Notification>) => {
  return addNotification({ ...options, type: 'warning', message })
}

const info = (message: string, options?: Partial<Notification>) => {
  return addNotification({ ...options, type: 'info', message })
}

// 暴露给全局使用
defineExpose({
  addNotification,
  removeNotification,
  clearAll,
  success,
  error,
  warning,
  info
})

// 扩展Window接口以包含$notification属性
declare global {
  interface Window {
    $notification: {
      add: typeof addNotification
      remove: typeof removeNotification
      clear: typeof clearAll
      success: typeof success
      error: typeof error
      warning: typeof warning
      info: typeof info
    }
  }
}

// 注册到全局
if (typeof window !== 'undefined') {
  window.$notification = {
    add: addNotification,
    remove: removeNotification,
    clear: clearAll,
    success,
    error,
    warning,
    info
  }
}

onMounted(() => {
  // 监听来自主进程的通知
  if (window.electronAPI?.onNotification) {
    window.electronAPI.onNotification((notification: any) => {
      addNotification(notification)
    })
  }
})
</script>

<style scoped>
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
