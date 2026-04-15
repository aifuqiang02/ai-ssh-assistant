import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const appSidebarPath = join(currentDir, 'AppSidebar.vue')

test('ssh connection flow checks subscription gate before connecting', async () => {
  const source = await readFile(appSidebarPath, 'utf8')

  assert.match(source, /canUseSsh|ensureSshAccess|subscription/i)
  assert.match(source, /window\.electronAPI\.ssh\.connect/)
})
