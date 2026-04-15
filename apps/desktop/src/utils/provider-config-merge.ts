import type { AIProvider, ProviderConfig } from '../types/ai-providers'
import type { AIProviderConfig } from '../services/settings.service'

const MINIMAX_MODEL_MIGRATIONS: Record<string, string> = {
  'MiniMax-M2.7': 'MiniMax-M2.5',
  'MiniMax-M2.7-highspeed': 'MiniMax-M2.5-highspeed'
}

type SavedProviderConfig = AIProviderConfig & Partial<Pick<AIProvider, 'isDefault'>>

function mergeProviderModels(defaultProvider: ProviderConfig, savedProvider: SavedProviderConfig) {
  if (!Array.isArray(savedProvider.models)) {
    return defaultProvider.models
  }

  if (savedProvider.models.length === 0) {
    return []
  }

  if (defaultProvider.id !== 'minimax') {
    return savedProvider.models
  }

  const defaultModelIds = new Set(defaultProvider.models.map(model => model.id))
  const migratedLegacyIds = new Set(Object.values(MINIMAX_MODEL_MIGRATIONS))

  const mergedDefaultModels = defaultProvider.models.map(defaultModel => {
    const savedModel = savedProvider.models?.find(
      model =>
        model.id === defaultModel.id || model.id === MINIMAX_MODEL_MIGRATIONS[defaultModel.id]
    )

    return savedModel
      ? {
          ...defaultModel,
          enabled: savedModel.enabled
        }
      : defaultModel
  })

  const extraSavedModels = savedProvider.models.filter(
    model => !defaultModelIds.has(model.id) && !migratedLegacyIds.has(model.id)
  )

  return [...mergedDefaultModels, ...extraSavedModels]
}

export function mergeSavedProviderWithDefault(
  defaultProvider: ProviderConfig,
  savedProvider: SavedProviderConfig
) {
  return {
    ...defaultProvider,
    ...savedProvider,
    apiKey: savedProvider.apiKey || defaultProvider.apiKey || '',
    isDefault: savedProvider.isDefault ?? false,
    models: mergeProviderModels(defaultProvider, savedProvider)
  }
}
