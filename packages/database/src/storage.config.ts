/**
 * 存储配置文件
 * 根据环境和用户设置配置存储模式
 */

import { StorageManagerOptions } from './storage-manager'

export interface StorageConfig {
  // 默认存储模式
  defaultMode: 'local' | 'cloud' | 'hybrid'
  
  // 环境特定配置
  development: StorageManagerOptions
  production: StorageManagerOptions
  test: StorageManagerOptions
  
  // 用户可选配置
  userPreferences?: {
    allowCloudStorage?: boolean
    allowOfflineMode?: boolean
    syncFrequency?: 'realtime' | 'frequent' | 'moderate' | 'rare'
    dataPrivacy?: 'strict' | 'moderate' | 'relaxed'
  }
}

// 根据同步频率获取间隔时间
function getSyncInterval(frequency: string): number {
  switch (frequency) {
    case 'realtime': return 30 * 1000 // 30秒
    case 'frequent': return 2 * 60 * 1000 // 2分钟
    case 'moderate': return 5 * 60 * 1000 // 5分钟
    case 'rare': return 30 * 60 * 1000 // 30分钟
    default: return 5 * 60 * 1000
  }
}

// 默认存储配置
export const defaultStorageConfig: StorageConfig = {
  defaultMode: 'hybrid',
  
  // 开发环境：优先本地存储，支持云同步
  development: {
    mode: 'hybrid',
    localOptions: {
      connectionString: process.env.LOCAL_DATABASE_URL || 'file:./dev.db',
      enabled: true
    },
    cloudOptions: {
      connectionString: process.env.DATABASE_URL,
      enabled: !!process.env.DATABASE_URL,
      provider: 'postgresql',
      ssl: false,
      retryAttempts: 2,
      timeout: 10000
    },
    hybridOptions: {
      primaryStorage: 'local',
      fallbackEnabled: true,
      syncStrategy: 'periodic',
      syncInterval: 30 * 1000, // 30秒，开发时频繁同步
      conflictResolution: 'local', // 开发时优先本地
      offlineMode: true
    }
  },
  
  // 生产环境：优先云存储，本地缓存
  production: {
    mode: 'hybrid',
    localOptions: {
      connectionString: process.env.LOCAL_DATABASE_URL || 'file:./app.db',
      enabled: true
    },
    cloudOptions: {
      connectionString: process.env.DATABASE_URL,
      enabled: true,
      provider: 'postgresql',
      ssl: true,
      retryAttempts: 5,
      timeout: 30000,
      poolSize: 20
    },
    hybridOptions: {
      primaryStorage: 'cloud',
      fallbackEnabled: true,
      syncStrategy: 'periodic',
      syncInterval: 5 * 60 * 1000, // 5分钟
      conflictResolution: 'cloud', // 生产环境优先云端
      offlineMode: true
    }
  },
  
  // 测试环境：仅本地存储
  test: {
    mode: 'local',
    localOptions: {
      connectionString: process.env.TEST_DATABASE_URL || 'file:./test.db',
      enabled: true
    },
    cloudOptions: {
      enabled: false
    }
  },
  
  userPreferences: {
    allowCloudStorage: true,
    allowOfflineMode: true,
    syncFrequency: 'moderate',
    dataPrivacy: 'moderate'
  }
}

// 根据环境和用户偏好生成存储配置
export function createStorageConfig(
  env: string = process.env.NODE_ENV || 'development',
  userPrefs?: StorageConfig['userPreferences']
): StorageManagerOptions {
  const baseConfig = defaultStorageConfig[env as keyof StorageConfig] as StorageManagerOptions
  const preferences = { ...defaultStorageConfig.userPreferences, ...userPrefs }
  
  // 根据用户偏好调整配置
  const config = JSON.parse(JSON.stringify(baseConfig)) // 深拷贝
  
  // 数据隐私设置
  if (preferences?.dataPrivacy === 'strict') {
    // 严格模式：仅本地存储
    config.mode = 'local'
    config.cloudOptions = { ...config.cloudOptions, enabled: false }
  } else if (preferences?.dataPrivacy === 'relaxed') {
    // 宽松模式：优先云存储
    if (config.hybridOptions) {
      config.hybridOptions.primaryStorage = 'cloud'
    }
  }
  
  // 云存储偏好
  if (preferences?.allowCloudStorage === false) {
    config.mode = 'local'
    config.cloudOptions = { ...config.cloudOptions, enabled: false }
  }
  
  // 离线模式偏好
  if (preferences?.allowOfflineMode === false && config.hybridOptions) {
    config.hybridOptions.fallbackEnabled = false
    config.hybridOptions.offlineMode = false
  }
  
  // 同步频率
  if (preferences?.syncFrequency && config.hybridOptions) {
    const interval = getSyncInterval(preferences.syncFrequency)
    config.hybridOptions.syncInterval = interval
    
    // 实时同步
    if (preferences.syncFrequency === 'realtime') {
      config.hybridOptions.syncStrategy = 'realtime'
    }
  }
  
  return config
}

// 预设配置模板
export const storagePresets = {
  // 完全本地模式（隐私优先）
  localOnly: {
    mode: 'local' as const,
    localOptions: {
      connectionString: 'file:./local.db',
      enabled: true
    },
    cloudOptions: {
      enabled: false
    }
  },
  
  // 完全云端模式（同步优先）
  cloudOnly: {
    mode: 'cloud' as const,
    localOptions: {
      enabled: false
    },
    cloudOptions: {
      connectionString: process.env.DATABASE_URL,
      enabled: true,
      provider: 'postgresql' as const,
      ssl: true,
      retryAttempts: 5
    }
  },
  
  // 高性能混合模式
  highPerformance: {
    mode: 'hybrid' as const,
    localOptions: {
      connectionString: 'file:./cache.db',
      enabled: true
    },
    cloudOptions: {
      connectionString: process.env.DATABASE_URL,
      enabled: true,
      provider: 'postgresql' as const,
      ssl: true,
      poolSize: 50,
      timeout: 5000
    },
    hybridOptions: {
      primaryStorage: 'local' as const,
      fallbackEnabled: true,
      syncStrategy: 'realtime' as const,
      syncInterval: 10 * 1000, // 10秒
      conflictResolution: 'merge' as const,
      offlineMode: true
    }
  },
  
  // 移动设备优化模式
  mobile: {
    mode: 'hybrid' as const,
    localOptions: {
      connectionString: 'file:./mobile.db',
      enabled: true
    },
    cloudOptions: {
      connectionString: process.env.DATABASE_URL,
      enabled: true,
      provider: 'postgresql' as const,
      ssl: true,
      retryAttempts: 3,
      timeout: 15000
    },
    hybridOptions: {
      primaryStorage: 'local' as const,
      fallbackEnabled: true,
      syncStrategy: 'periodic' as const,
      syncInterval: 10 * 60 * 1000, // 10分钟，节省流量
      conflictResolution: 'local' as const,
      offlineMode: true
    }
  }
}

// 环境检测和自动配置
export function autoDetectStorageConfig(): StorageManagerOptions {
  const env = process.env.NODE_ENV || 'development'
  
  // 检测运行环境
  const isElectron = typeof window !== 'undefined' && window.process?.type === 'renderer'
  const isMobile = typeof navigator !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
  const hasCloudUrl = !!process.env.DATABASE_URL
  
  // 根据环境自动选择配置
  if (isElectron) {
    // Electron 环境：优先本地，支持云同步
    return hasCloudUrl ? storagePresets.highPerformance : storagePresets.localOnly
  } else if (isMobile) {
    // 移动环境：优化流量使用
    return hasCloudUrl ? storagePresets.mobile : storagePresets.localOnly
  } else {
    // Web 环境：根据是否有云数据库决定
    return hasCloudUrl ? storagePresets.cloudOnly : storagePresets.localOnly
  }
}

// 配置验证
export function validateStorageConfig(config: StorageManagerOptions): string[] {
  const errors: string[] = []
  
  if (config.mode === 'cloud' && !config.cloudOptions?.connectionString) {
    errors.push('Cloud mode requires a connection string')
  }
  
  if (config.mode === 'hybrid') {
    if (!config.localOptions?.enabled && !config.cloudOptions?.enabled) {
      errors.push('Hybrid mode requires at least one adapter to be enabled')
    }
    
    if (!config.hybridOptions) {
      errors.push('Hybrid mode requires hybrid options')
    }
  }
  
  if (config.cloudOptions?.enabled && !config.cloudOptions.connectionString) {
    errors.push('Cloud adapter requires a connection string when enabled')
  }
  
  return errors
}
