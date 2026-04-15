import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const packageJsonPath = join(currentDir, '../package.json')

test('desktop package exposes prod:desktop script for local production-like debugging', async () => {
  const source = await readFile(packageJsonPath, 'utf8')

  assert.match(
    source,
    /"prod:desktop": "node scripts\/build-workspace-deps\.js && vite build && node scripts\/rebuild-native\.js && node scripts\/run-prod-desktop\.js"/
  )
})
