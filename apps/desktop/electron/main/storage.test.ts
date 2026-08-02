import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const storagePath = join(currentDir, 'storage.ts')

test('StorageManager survives Electron main-process module reloads', async () => {
  const source = await readFile(storagePath, 'utf8')

  assert.match(source, /Symbol\.for\('ai-ssh-assistant\.storage-manager'\)/)
  assert.match(source, /\(globalThis as StorageGlobal\)\[storageManagerKey\] = instance/)
  assert.match(source, /const storageManagerInstance = \(globalThis as StorageGlobal\)\[storageManagerKey\]/)
  assert.doesNotMatch(source, /let storageManagerInstance/)
})
