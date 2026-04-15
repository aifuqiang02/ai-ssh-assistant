import { ref, h, render, type VNode } from 'vue'
import ConfirmDialog, { type ConfirmOptions } from '@/components/common/ConfirmDialog.vue'

// 全局对话框状态
const dialogVisible = ref(false)
const dialogOptions = ref<ConfirmOptions>({ message: '' })
let resolvePromise: ((value: boolean) => void) | null = null

/**
 * 显示确认对话框
 * @param options 对话框选项
 * @returns Promise<boolean> 用户点击确定返回 true，取消返回 false
 */
export function useConfirm() {
  const confirm = (options: string | ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      // 如果传入的是字符串，转换为选项对象
      if (typeof options === 'string') {
        dialogOptions.value = { message: options }
      } else {
        dialogOptions.value = options
      }

      dialogVisible.value = true
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    dialogVisible.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    dialogVisible.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    confirm,
    dialogVisible,
    dialogOptions,
    handleConfirm,
    handleCancel
  }
}

/**
 * 全局 $confirm 方法
 * 可以在任何地方调用，无需引入组件
 */
export const $confirm = (options: string | ConfirmOptions): Promise<boolean> => {
  return new Promise(resolve => {
    // 创建一个容器
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 创建组件实例
    let vnode: VNode | null = null

    const handleConfirm = () => {
      cleanup()
      resolve(true)
    }

    const handleCancel = () => {
      cleanup()
      resolve(false)
    }

    const cleanup = () => {
      if (vnode) {
        render(null, container)
        vnode = null
      }
      document.body.removeChild(container)
    }

    // 格式化选项
    const dialogOptions: ConfirmOptions =
      typeof options === 'string' ? { message: options } : options

    // 渲染组件
    vnode = h(ConfirmDialog, {
      visible: true,
      options: dialogOptions,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
      'onUpdate:visible': (visible: boolean) => {
        if (!visible) {
          handleCancel()
        }
      }
    })

    render(vnode, container)
  })
}

/**
 * 全局 $alert 方法 - 非阻塞通知
 */
export const $alert = (message: string, title?: string): void => {
  if (typeof window !== 'undefined') {
    // 首先检查 window.$notification 是否存在
    if (window.$notification) {
      window.$notification.add({
        type: 'info',
        title: title || '提示',
        message,
        duration: 3000
      })
    } else if (window.electronAPI?.notification?.show) {
      // 如果有 Electron 的通知 API，使用它
      window.electronAPI.notification.show(title || '提示', message).catch(console.error)
    } else {
      // 最后的降级方案 - 使用 alert 或 console.log
      console.log(`${title || '提示'}: ${message}`)
    }
  }
}

// 导出类型
export type { ConfirmOptions }
