import { DEFAULT_PROVIDERS } from '@/types/ai-providers'
import type { AIModel, AIProvider } from '@/types/ai-providers.types'
import type { AIProviderConfig } from './settings.service'

export interface PersistedSelectedModel {
  source?: 'local' | 'official'
  providerId?: string
  modelId?: string
  provider?: AIProvider
  model?: AIModel
}

export interface ResolvedSelectedModel {
  source: 'local' | 'official'
  providerId: string
  providerName: string
  modelId: string
  modelName: string
  supportsDirectClientCall: boolean
  supportsManagedServerCall: boolean
  provider: AIProvider | null
  model: AIModel | null
}

function findLocalProvider(settingsProviders: AIProviderConfig[], providerId: string) {
  const savedConfig = settingsProviders.find(provider => provider.id === providerId)
  const defaultProvider = DEFAULT_PROVIDERS.find(provider => provider.id === providerId)
  if (!savedConfig || !defaultProvider) {
    return null
  }

  return {
    ...defaultProvider,
    apiKey: savedConfig.apiKey || '',
    enabled: savedConfig.enabled !== undefined ? savedConfig.enabled : false,
    isDefault: false,
    models:
      savedConfig.models && savedConfig.models.length > 0
        ? savedConfig.models.map(configModel => {
            const defaultModel = defaultProvider.models.find(model => model.id === configModel.id)
            return defaultModel
              ? {
                  ...defaultModel,
                  ...configModel,
                  enabled: configModel.enabled !== undefined ? configModel.enabled : true
                }
              : configModel
          })
        : defaultProvider.models
  }
}

export function resolveSelectedModel(
  savedSelection: string | null,
  settingsProviders: AIProviderConfig[]
): ResolvedSelectedModel | null {
  if (!savedSelection) {
    return null
  }

  try {
    const parsed = JSON.parse(savedSelection) as PersistedSelectedModel

    if (parsed.source === 'official' && parsed.providerId === 'official' && parsed.modelId) {
      return {
        source: 'official',
        providerId: 'official',
        providerName: '官方模型',
        modelId: parsed.modelId,
        modelName: parsed.modelId,
        supportsDirectClientCall: false,
        supportsManagedServerCall: true,
        provider: null,
        model: null
      }
    }

    if (parsed.provider && parsed.model) {
      return {
        source: 'local',
        providerId: parsed.provider.id,
        providerName: parsed.provider.name,
        modelId: parsed.model.id,
        modelName: parsed.model.name,
        supportsDirectClientCall: true,
        supportsManagedServerCall: false,
        provider: parsed.provider,
        model: parsed.model
      }
    }

    if (parsed.providerId && parsed.modelId) {
      const provider = findLocalProvider(settingsProviders, parsed.providerId)
      const model = provider?.models?.find(item => item.id === parsed.modelId) || null
      if (!provider || !model) {
        return null
      }

      return {
        source: 'local',
        providerId: provider.id,
        providerName: provider.name,
        modelId: model.id,
        modelName: model.name,
        supportsDirectClientCall: true,
        supportsManagedServerCall: false,
        provider,
        model
      }
    }

    return null
  } catch {
    return null
  }
}
