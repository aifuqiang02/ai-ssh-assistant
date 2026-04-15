import test from 'node:test'
import assert from 'node:assert/strict'

import { mergeProviderForSave } from './managed-provider-settings'

test('mergeProviderForSave preserves isCustom for unmanaged provider models', () => {
  const provider = {
    id: 'custom-openai',
    name: 'Custom OpenAI',
    endpoint: 'http://example.com/v1',
    enabled: true,
    models: [
      {
        id: 'custom-model',
        name: 'Custom Model',
        providerId: 'custom-openai',
        contextWindow: 8192,
        capabilities: { text: true, image: false, functionCall: true, vision: false },
        enabled: true,
        isCustom: true
      }
    ]
  }

  const merged = mergeProviderForSave(provider as any)

  assert.equal(merged.models?.[0]?.isCustom, true)
})
