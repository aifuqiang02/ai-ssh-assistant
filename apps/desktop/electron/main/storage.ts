/**
 * 共享的 StorageManager 实例
 */
import { StorageManager } from '@ai-ssh/database'

const storageManagerKey = Symbol.for('ai-ssh-assistant.storage-manager')

type StorageGlobal = typeof globalThis & {
  [storageManagerKey]?: StorageManager
}

export function initializeStorageManager(instance: StorageManager) {
  ;(globalThis as StorageGlobal)[storageManagerKey] = instance
}

export function getStorageManager(): StorageManager {
  const storageManagerInstance = (globalThis as StorageGlobal)[storageManagerKey]
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

