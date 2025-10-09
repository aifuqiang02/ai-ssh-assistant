/**
 * 共享的 StorageManager 实例
 */
import { StorageManager } from '@ai-ssh/database'

let storageManagerInstance: StorageManager | null = null

export function initializeStorageManager(instance: StorageManager) {
  storageManagerInstance = instance
}

export function getStorageManager(): StorageManager {
  if (!storageManagerInstance) {
    throw new Error('StorageManager not initialized. Call initializeStorageManager first.')
  }
  return storageManagerInstance
}

export const storageManager = new Proxy({} as StorageManager, {
  get(target, prop) {
    const manager = getStorageManager()
    const value = (manager as any)[prop]
    if (typeof value === 'function') {
      return value.bind(manager)
    }
    return value
  }
})

