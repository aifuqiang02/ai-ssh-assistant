import type { AIProvider } from '../types/ai-providers'

export function mergeProviderForSave(provider: AIProvider, latestProvider?: AIProvider) {
  const isManagedProvider = !!provider.config?.managedByApp
  const latestModelsById = new Map((latestProvider?.models || []).map(model => [model.id, model]))

  const models = provider.models?.map(model => {
    if (!isManagedProvider) {
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        providerId: model.providerId,
        contextWindow: model.contextWindow,
        capabilities: model.capabilities,
        price: model.price,
        recommended: model.recommended,
        isCustom: model.isCustom,
        enabled: model.enabled !== false
      }
    }

    const latestModel = latestModelsById.get(model.id)
    return {
      ...(latestModel || model),
      enabled: model.enabled !== false
    }
  })

  return {
    id: provider.id,
    name: provider.name,
    apiKey: isManagedProvider
      ? latestProvider?.apiKey || provider.apiKey || ''
      : provider.apiKey || '',
    endpoint: isManagedProvider ? latestProvider?.endpoint || provider.endpoint : provider.endpoint,
    enabled: provider.enabled,
    isDefault: provider.isDefault,
    config: isManagedProvider
      ? JSON.parse(JSON.stringify(latestProvider?.config || provider.config || undefined))
      : provider.config
        ? JSON.parse(JSON.stringify(provider.config))
        : undefined,
    models
  }
}
