import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const rebuildScriptPath = join(currentDir, 'rebuild-native.js')
const releaseWorkflowPath = join(currentDir, '../../../.github/workflows/release.yml')
const manualWorkflowPath = join(currentDir, '../../../.github/workflows/manual-build.yml')

test('native dependency preparation downloads an Electron prebuilt binary', async () => {
  const source = await readFile(rebuildScriptPath, 'utf8')

  assert.match(source, /prebuild-install\/bin\.js/)
  assert.match(source, /'--runtime=electron'/)
  assert.match(source, /TARGET_ARCH/)
  assert.doesNotMatch(source, /electron-rebuild/)
})

test('release builds macOS architectures separately with target-specific native bindings', async () => {
  const source = await readFile(releaseWorkflowPath, 'utf8')

  assert.match(source, /build_script: 'build:mac:x64'/)
  assert.match(source, /build_script: 'build:mac:arm64'/)
  assert.match(source, /TARGET_ARCH: \$\{\{ matrix\.target_arch \}\}/)
  assert.doesNotMatch(source, /apps\/desktop\/release\/\*\*\/latest\*\.yml/)
})

test('manual builds use the same target-specific native binding strategy', async () => {
  const source = await readFile(manualWorkflowPath, 'utf8')

  assert.match(source, /build_script: 'build:mac:x64'/)
  assert.match(source, /build_script: 'build:mac:arm64'/)
  assert.match(source, /pnpm install --frozen-lockfile --ignore-scripts/)
  assert.match(source, /TARGET_ARCH: \$\{\{ matrix\.target_arch \}\}/)
})
