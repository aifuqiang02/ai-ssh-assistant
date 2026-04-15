import type { AIProvider } from '../types/ai-providers'
import type { ProviderConfig } from '../types/ai-providers.types'

export function buildInitialAIProviders(defaultProviders: ProviderConfig[]): AIProvider[] {
  return defaultProviders.map(provider => ({
    ...provider,
    apiKey: provider.apiKey || '',
    enabled: provider.config?.defaultEnabled ?? false,
    isDefault: false
  })) as AIProvider[]
}
