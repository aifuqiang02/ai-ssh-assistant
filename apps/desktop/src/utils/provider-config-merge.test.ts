import test from 'node:test'
import assert from 'node:assert/strict'

import { mergeSavedProviderWithDefault } from './provider-config-merge'

test('upgrades saved MiniMax M2.5 models to the current M2.7 defaults', () => {
  const defaultProvider = {
    id: 'minimax',
    name: 'MiniMax',
    models: [
      { id: 'MiniMax-M2.7', name: 'MiniMax-M2.7', providerId: 'minimax' },
      {
        id: 'MiniMax-M2.7-highspeed',
        name: 'MiniMax-M2.7-highspeed',
        providerId: 'minimax'
      }
    ]
  }

  const savedProvider = {
    id: 'minimax',
    apiKey: 'saved-key',
    models: [
      { id: 'MiniMax-M2.5', name: 'MiniMax-M2.5', providerId: 'minimax', enabled: true },
      {
        id: 'MiniMax-M2.5-highspeed',
        name: 'MiniMax-M2.5-highspeed',
        providerId: 'minimax',
        enabled: false
      }
    ]
  }

  const merged = mergeSavedProviderWithDefault(defaultProvider as any, savedProvider as any)

  assert.equal(merged.apiKey, 'saved-key')
  assert.deepEqual(
    merged.models.map((model: any) => ({ id: model.id, enabled: model.enabled })),
    [
      { id: 'MiniMax-M2.7', enabled: true },
      { id: 'MiniMax-M2.7-highspeed', enabled: false }
    ]
  )
})
