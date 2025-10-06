/**
 * 设置辅助函数
 * 提供统一的设置访问接口，自动处理数据库和 localStorage 的兼容
 */

/**
 * 获取 AI 服务商配置
 */
export async function getAIProviderConfigs(): Promise<any[]> {
  try {
    // 优先从数据库获取
    const settings = await window.electronAPI.settings.get()
    if (settings?.aiProviders && settings.aiProviders.length > 0) {
      console.log('[SettingsHelper] 从数据库加载 AI 服务商配置')
      return settings.aiProviders
    }
    
    // 如果数据库没有，尝试从 localStorage 获取（兼容旧数据）
    const localConfigs = localStorage.getItem('aiProviderConfigs')
    if (localConfigs) {
      console.log('[SettingsHelper] 从 localStorage 加载 AI 服务商配置（兼容模式）')
      return JSON.parse(localConfigs)
    }
    
    return []
  } catch (error) {
    console.error('[SettingsHelper] 获取 AI 服务商配置失败:', error)
    return []
  }
}

/**
 * 获取指定服务商的配置
 */
export async function getProviderConfig(providerId: string): Promise<any | null> {
  const configs = await getAIProviderConfigs()
  return configs.find((p: any) => p.id === providerId) || null
}

/**
 * 监听设置更新
 */
export function onSettingsUpdated(callback: () => void): () => void {
  const handler = () => callback()
  
  window.addEventListener('settings-updated', handler)
  window.addEventListener('ai-provider-configs-updated', handler)
  
  // 返回清理函数
  return () => {
    window.removeEventListener('settings-updated', handler)
    window.removeEventListener('ai-provider-configs-updated', handler)
  }
}

