/**
 * 事件总线核心模块
 *
 * 提供发布/订阅模式，用于解耦模块间通信
 */

type EventCallback = (data: any) => void

interface EventBus {
  on(event: string, callback: EventCallback): () => void
  off(event: string, callback: EventCallback): void
  emit(event: string, data: any): void
  once(event: string, callback: EventCallback): () => void
}

/**
 * 预定义事件类型
 */
export const Events = {
  // SSH 事件
  SSH_CONNECTED: 'ssh:connected',
  SSH_DISCONNECTED: 'ssh:disconnected',
  SSH_CONNECTING: 'ssh:connecting',
  SSH_ERROR: 'ssh:error',
  SSH_COMMAND_STARTED: 'ssh:command:started',
  SSH_COMMAND_COMPLETED: 'ssh:command:completed',
  SSH_OUTPUT_RECEIVED: 'ssh:output:received',

  // AI 事件
  AI_MESSAGE_STARTED: 'ai:message:started',
  AI_MESSAGE_COMPLETED: 'ai:message:completed',
  AI_TOOL_CALLED: 'ai:tool:called',
  AI_TOOL_COMPLETED: 'ai:tool:completed',
  AI_TOOL_ERROR: 'ai:tool:error',

  // 聊天事件
  CHAT_SESSION_CREATED: 'chat:session:created',
  CHAT_SESSION_DELETED: 'chat:session:deleted',
  CHAT_MESSAGE_SENT: 'chat:message:sent',
  CHAT_MESSAGE_RECEIVED: 'chat:message:received',

  // 权限事件
  PERMISSION_REQUIRED: 'permission:required',
  PERMISSION_GRANTED: 'permission:granted',
  PERMISSION_DENIED: 'permission:denied',

  // 应用事件
  APP_READY: 'app:ready',
  APP_SHUTDOWN: 'app:shutdown',
  SETTINGS_CHANGED: 'settings:changed'
} as const

export type EventName = (typeof Events)[keyof typeof Events]

/**
 * 事件总线实现
 */
export class LocalEventBus implements EventBus {
  private emitter = new Map<string, Set<EventCallback>>()
  private wildcardCallback: Set<EventCallback> | null = null

  /**
   * 订阅事件
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.emitter.has(event)) {
      this.emitter.set(event, new Set())
    }
    this.emitter.get(event)!.add(callback)

    // 返回取消订阅函数
    return () => {
      this.off(event, callback)
    }
  }

  /**
   * 取消订阅
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.emitter.get(event)
    if (callbacks) {
      callbacks.delete(callback)
      if (callbacks.size === 0) {
        this.emitter.delete(event)
      }
    }
  }

  /**
   * 发布事件
   */
  emit(event: string, data: any): void {
    // 触发特定事件回调
    const callbacks = this.emitter.get(event)
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback(data)
        } catch (error) {
          console.error(`[EventBus] Error in event callback for "${event}":`, error)
        }
      }
    }

    // 触发通配符回调
    if (this.wildcardCallback) {
      for (const callback of this.wildcardCallback) {
        try {
          callback({ event, data })
        } catch (error) {
          console.error('[EventBus] Error in wildcard callback:', error)
        }
      }
    }
  }

  /**
   * 只订阅一次
   */
  once(event: string, callback: EventCallback): () => void {
    const wrapper = (data: any) => {
      this.off(event, wrapper)
      callback(data)
    }
    this.on(event, wrapper)
    return () => this.off(event, wrapper)
  }

  /**
   * 订阅所有事件（通配符）
   */
  onAny(callback: (event: { event: string; data: any }) => void): () => void {
    if (!this.wildcardCallback) {
      this.wildcardCallback = new Set()
    }
    this.wildcardCallback.add(callback)

    return () => {
      this.wildcardCallback?.delete(callback)
    }
  }

  /**
   * 获取事件订阅数
   */
  listenerCount(event?: string): number {
    if (event) {
      return this.emitter.get(event)?.size || 0
    }

    let count = 0
    for (const callbacks of this.emitter.values()) {
      count += callbacks.size
    }
    if (this.wildcardCallback) {
      count += this.wildcardCallback.size
    }
    return count
  }

  /**
   * 获取所有已订阅的事件
   */
  eventNames(): string[] {
    return Array.from(this.emitter.keys())
  }

  /**
   * 清除所有订阅
   */
  clear(): void {
    this.emitter.clear()
    this.wildcardCallback = null
  }

  /**
   * 清除特定事件的所有订阅
   */
  clearEvent(event: string): void {
    this.emitter.delete(event)
  }
}

/**
 * 事件监听器装饰器
 * 用于自动管理事件订阅
 */
export function OnEvent(event: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const eventBus = (this as any).eventBus || globalEventBus
      const boundMethod = originalMethod.bind(this)

      return eventBus.on(event, boundMethod)
    }

    return descriptor
  }
}

/**
 * 全局事件总线单例
 */
export const globalEventBus = new LocalEventBus()

/**
 * 获取全局事件总线
 */
export function getEventBus(): LocalEventBus {
  return globalEventBus
}

/**
 * 便捷函数：发布事件
 */
export function emit(event: string, data?: any): void {
  globalEventBus.emit(event, data)
}

/**
 * 便捷函数：订阅事件
 */
export function on(event: string, callback: EventCallback): () => void {
  return globalEventBus.on(event, callback)
}

/**
 * 便捷函数：只订阅一次
 */
export function once(event: string, callback: EventCallback): () => void {
  return globalEventBus.once(event, callback)
}

/**
 * 便捷函数：订阅所有事件
 */
export function onAny(callback: (event: { event: string; data: any }) => void): () => void {
  return globalEventBus.onAny(callback)
}

/**
 * 事件订阅者接口
 */
export interface EventSubscriber {
  /**
   * 返回要订阅的事件列表
   */
  subscribe(): { event: string; handler: EventCallback }[]

  /**
   * 返回要取消订阅的事件列表
   */
  unsubscribe?(): { event: string }[]
}

/**
 * 注册订阅者
 */
export function registerSubscriber(subscriber: EventSubscriber): () => void {
  const subscriptions = subscriber.subscribe()
  const unsubscribers: (() => void)[] = []

  for (const { event, handler } of subscriptions) {
    unsubscribers.push(on(event, handler))
  }

  // 返回取消所有订阅的函数
  return () => {
    for (const unsub of unsubscribers) {
      unsub()
    }

    if (subscriber.unsubscribe) {
      for (const { event } of subscriber.unsubscribe()) {
        globalEventBus.clearEvent(event)
      }
    }
  }
}
