import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildOfficialTitleBarModels,
  buildTitleBarModels,
  resolveSelectedTitleBarModel
} from './titlebar-models.ts'

test('buildTitleBarModels includes enabled configured providers', () => {
  const models = buildTitleBarModels([
    {
      id: 'openrouter',
      name: 'OpenRouter',
      enabled: true,
      apiKey: 'user-key',
      models: [{ id: 'openrouter/moe-256b', name: 'Qualified', enabled: true }]
    },
    {
      id: 'custom-openai',
      name: 'Custom',
      enabled: true,
      apiKey: 'user-key',
      models: [{ id: 'gpt-4', name: 'GPT-4', enabled: true }]
    }
  ])

  assert.deepEqual(
    models.map(model => ({ id: model.id, providerId: model.providerId })),
    [
      { id: 'openrouter/moe-256b', providerId: 'openrouter' },
      { id: 'gpt-4', providerId: 'custom-openai' }
    ]
  )
})

test('resolveSelectedTitleBarModel clears stale selection when model no longer exists', () => {
  const result = resolveSelectedTitleBarModel(
    [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        shortName: 'GPT-4',
        providerId: 'custom-openai',
        providerName: 'Custom'
      }
    ],
    JSON.stringify({
      provider: { id: 'openrouter' },
      model: { id: 'openrouter/moe-256b' }
    })
  )

  assert.equal(result.model, null)
  assert.equal(result.shouldClear, true)
  assert.equal(result.shouldPersist, false)
})

test('buildOfficialTitleBarModels marks official models as official group entries', () => {
  const models = buildOfficialTitleBarModels([
    {
      id: 'MiniMax-M2.7-highspeed',
      name: 'MiniMax-M2.7-highspeed',
      shortName: 'M2.7-highspeed',
      enabled: true
    }
  ])

  assert.deepEqual(models, [
    {
      id: 'MiniMax-M2.7-highspeed',
      name: 'MiniMax-M2.7-highspeed',
      shortName: 'M2.7-highspeed',
      providerId: 'official',
      providerName: '官方模型',
      source: 'official',
      group: 'official',
      disabled: false,
      disabledReason: undefined
    }
  ])
})

test('resolveSelectedTitleBarModel keeps official selection when official model exists', () => {
  const result = resolveSelectedTitleBarModel(
    [
      {
        id: 'MiniMax-M2.7-highspeed',
        name: 'MiniMax-M2.7-highspeed',
        shortName: 'M2.7-highspeed',
        providerId: 'official',
        providerName: '官方模型',
        source: 'official',
        group: 'official'
      }
    ],
    JSON.stringify({
      source: 'official',
      providerId: 'official',
      modelId: 'MiniMax-M2.7-highspeed'
    })
  )

  assert.equal(result.model?.providerId, 'official')
  assert.equal(result.model?.id, 'MiniMax-M2.7-highspeed')
  assert.equal(result.shouldClear, false)
  assert.equal(result.shouldPersist, false)
})

test('resolveSelectedTitleBarModel replaces a removed official model with the current one', () => {
  const result = resolveSelectedTitleBarModel(
    [
      {
        id: 'gpt-last',
        name: 'gpt-last',
        shortName: 'gpt-last',
        providerId: 'official',
        providerName: '官方模型',
        source: 'official',
        group: 'official'
      }
    ],
    JSON.stringify({
      source: 'official',
      providerId: 'official',
      modelId: 'gpt5.5'
    })
  )

  assert.equal(result.model?.id, 'gpt-last')
  assert.equal(result.shouldClear, false)
  assert.equal(result.shouldPersist, true)
})
