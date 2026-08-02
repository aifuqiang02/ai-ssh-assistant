import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const desktopRoot = join(currentDir, '../..')

test('settings and desktop package no longer expose application MCP or plugin features', async () => {
  const [settings, packageJson, tsconfig, workspaceBuild] = await Promise.all([
    readFile(join(currentDir, 'SettingsView.vue'), 'utf8'),
    readFile(join(desktopRoot, 'package.json'), 'utf8'),
    readFile(join(desktopRoot, 'tsconfig.json'), 'utf8'),
    readFile(join(desktopRoot, 'scripts/build-workspace-deps.js'), 'utf8')
  ])

  assert.doesNotMatch(settings, /SettingsMCP|SettingsPlugins|section-mcp|section-plugins/)
  assert.doesNotMatch(packageJson, /@ai-ssh\/core/)
  assert.doesNotMatch(tsconfig, /@ai-ssh\/core/)
  assert.doesNotMatch(workspaceBuild, /@ai-ssh\/core|packages\/core/)
})

test('application MCP/plugin implementation files and core workspace package are removed', async () => {
  const removedPaths = [
    'src/components/settings/SettingsMCP.vue',
    'src/components/settings/SettingsPlugins.vue',
    'src/services/mcp/index.ts',
    'src/services/plugins/index.ts',
    '../../packages/core/package.json'
  ]

  for (const path of removedPaths) {
    await assert.rejects(access(join(desktopRoot, path)))
  }
})
