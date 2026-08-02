declare module '@ai-ssh/database' {
  export interface StorageManagerOptions {
    mode: 'local' | 'cloud' | 'hybrid' | 'auto'
    localOptions?: {
      connectionString?: string
      enabled?: boolean
    }
    cloudOptions?: Record<string, unknown> & {
      enabled?: boolean
    }
    hybridOptions?: {
      primaryStorage: 'local' | 'cloud'
      fallbackEnabled?: boolean
      syncStrategy?: 'realtime' | 'periodic' | 'manual'
      syncInterval?: number
      conflictResolution?: 'local' | 'cloud' | 'merge' | 'manual'
      offlineMode?: boolean
    }
  }

  export class StorageManager {
    constructor(options: StorageManagerOptions)
    connect(): Promise<void>
    disconnect(): Promise<void>
    create(model: string, data: unknown): Promise<any>
    findMany(model: string, options?: unknown): Promise<any[]>
    findUnique(model: string, options: unknown): Promise<any>
    update(model: string, options: unknown): Promise<any>
    delete(model: string, options: unknown): Promise<any>
    createMany(model: string, data: unknown[]): Promise<any>
    transaction<T>(operation: () => Promise<T>): Promise<T>
    sync(): Promise<any>
    getStatus(): Promise<any>
    switchMode(mode: 'local' | 'cloud' | 'hybrid'): Promise<void>
  }
}
