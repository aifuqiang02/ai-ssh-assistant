export interface TitleBarModelOption {
  id: string
  name: string
  shortName: string
  providerId: string
  providerName: string
  source?: 'local' | 'official'
  group?: 'local' | 'official'
  disabled?: boolean
  disabledReason?: string
}

interface ProviderLike {
  id: string
  name: string
  enabled?: boolean
  apiKey?: string
  config?: Record<string, any>
  models?: Array<{
    id: string
    name: string
    enabled?: boolean
  }>
}

export function buildTitleBarModels(providers: ProviderLike[]): TitleBarModelOption[] {
  const models: TitleBarModelOption[] = []

  for (const provider of providers) {
    const isManagedProvider = !!provider.config?.managedByApp
    const hasUsableAccess = !!provider.apiKey || provider.id === 'ollama'
    if (!provider.enabled || (!hasUsableAccess && !isManagedProvider)) {
      continue
    }

    for (const model of provider.models || []) {
      if (model.enabled === false) {
        continue
      }

      models.push({
        id: model.id,
        name: model.name,
        shortName: model.name.length > 15 ? `${model.name.substring(0, 15)}...` : model.name,
        providerId: provider.id,
        providerName: provider.name,
        source: 'local',
        group: 'local'
      })
    }
  }

  return models
}

export function buildOfficialTitleBarModels(
  models: Array<{
    id: string
    name: string
    shortName: string
    enabled: boolean
  }>,
  options: {
    disabled?: boolean
    disabledReason?: string
  } = {}
): TitleBarModelOption[] {
  return models.map(model => ({
    id: model.id,
    name: model.name,
    shortName: model.shortName,
    providerId: 'official',
    providerName: '官方模型',
    source: 'official',
    group: 'official',
    disabled: options.disabled || model.enabled === false,
    disabledReason: options.disabled ? options.disabledReason : undefined
  }))
}

export function resolveSelectedTitleBarModel(
  availableModels: TitleBarModelOption[],
  savedSelection: string | null
): { model: TitleBarModelOption | null; shouldClear: boolean } {
  if (!savedSelection) {
    return { model: null, shouldClear: false }
  }

  try {
    const parsed = JSON.parse(savedSelection)
    const providerId = parsed?.provider?.id || parsed?.providerId
    const modelId = parsed?.model?.id || parsed?.modelId
    const model =
      availableModels.find(item => item.id === modelId && item.providerId === providerId) || null
    return {
      model,
      shouldClear: !model
    }
  } catch {
    return {
      model: null,
      shouldClear: true
    }
  }
}
