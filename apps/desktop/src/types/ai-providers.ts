// AI 服务商主入口文件 - 支持 60+ 个服务商

export * from './ai-providers.types'

import { INTERNATIONAL_PROVIDERS } from './ai-providers.international'
import { CHINESE_PROVIDERS } from './ai-providers.chinese'
import { CHINESE_EXTENDED_PROVIDERS } from './ai-providers.chinese-extended'
import { PLATFORM_PROVIDERS } from './ai-providers.platforms'
import { CLOUD_PROVIDERS } from './ai-providers.cloud'
import { OPENSOURCE_PROVIDERS } from './ai-providers.opensource'
import { SPECIALIZED_PROVIDERS } from './ai-providers.specialized'
import type { ProviderConfig } from './ai-providers.types'

// 合并所有服务商 (共 60+ 个)
export const DEFAULT_PROVIDERS: ProviderConfig[] = [
  ...INTERNATIONAL_PROVIDERS,        // 9 个国际主流
  ...CHINESE_PROVIDERS,              // 12 个中国主流
  ...CHINESE_EXTENDED_PROVIDERS,     // 10 个中国其他
  ...PLATFORM_PROVIDERS,             // 7 个开发者平台
  ...CLOUD_PROVIDERS,                // 5 个云服务
  ...OPENSOURCE_PROVIDERS,           // 10 个开源/小型
  ...SPECIALIZED_PROVIDERS           // 8 个专业服务
]

// 按类别导出
export { 
  INTERNATIONAL_PROVIDERS, 
  CHINESE_PROVIDERS,
  CHINESE_EXTENDED_PROVIDERS,
  PLATFORM_PROVIDERS,
  CLOUD_PROVIDERS,
  OPENSOURCE_PROVIDERS,
  SPECIALIZED_PROVIDERS
}

// 统计信息
export const PROVIDER_STATS = {
  total: DEFAULT_PROVIDERS.length,
  international: INTERNATIONAL_PROVIDERS.length,
  chinese: CHINESE_PROVIDERS.length + CHINESE_EXTENDED_PROVIDERS.length,
  platforms: PLATFORM_PROVIDERS.length,
  cloud: CLOUD_PROVIDERS.length,
  opensource: OPENSOURCE_PROVIDERS.length,
  specialized: SPECIALIZED_PROVIDERS.length,
  totalModels: DEFAULT_PROVIDERS.reduce((sum, p) => sum + p.models.length, 0)
}

// 按用途分类
export const PROVIDER_CATEGORIES = {
  text: DEFAULT_PROVIDERS.filter(p => p.models.some(m => m.capabilities.text)),
  vision: DEFAULT_PROVIDERS.filter(p => p.models.some(m => m.capabilities.vision)),
  image: DEFAULT_PROVIDERS.filter(p => p.models.some(m => m.capabilities.image)),
  functionCall: DEFAULT_PROVIDERS.filter(p => p.models.some(m => m.capabilities.functionCall))
}
