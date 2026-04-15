import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const settingsViewPath = join(currentDir, 'SettingsView.vue')
const platformProvidersPath = join(currentDir, '..', 'types', 'ai-providers.platforms.ts')

test('settings view only shows delete action for custom models and marks added models', async () => {
  const source = await readFile(settingsViewPath, 'utf8')

  assert.match(source, /v-if="model\.isCustom === true \|\| provider\.id === 'custom-openai'"/)
  assert.match(source, /@click(?:\.stop)?="removeCustomModel\(provider\.id, model\.id\)"/)
  assert.match(source, /isCustom: true/)
  assert.match(source, /provider\.id !== 'custom-openai' && model\.isCustom !== true/)
  assert.match(source, /const removeCustomModel = async \(providerId: string, modelId: string\) =>/)
})

test('custom-openai provider ships without default models', async () => {
  const source = await readFile(platformProvidersPath, 'utf8')

  assert.match(source, /id: 'custom-openai'[\s\S]*models: \[\]/)
  assert.doesNotMatch(source, /id: 'custom-openai'[\s\S]*gpt-4/)
})

test('settings view exposes updater status, retry, and install actions', async () => {
  const source = await readFile(settingsViewPath, 'utf8')

  assert.match(source, /id: 'updates'/)
  assert.match(source, /section-updates/)
  assert.match(source, /window\.electronAPI\.updater\.startBackgroundCheck\(\)/)
  assert.match(source, /window\.electronAPI\.updater\.installDownloadedUpdate\(\)/)
  assert.match(source, /更新状态/)
  assert.match(source, /立即安装更新/)
})
