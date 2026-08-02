import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const appSidebarPath = join(currentDir, 'AppSidebar.vue')

test('ssh connection flow has no subscription gate before connecting', async () => {
  const source = await readFile(appSidebarPath, 'utf8')

  assert.doesNotMatch(source, /canUseSsh|ensureSshAccess|subscription/i)
  assert.match(source, /window\.electronAPI\.ssh\.connect/)
})

test('connection import and export are not rendered in the sidebar', async () => {
  const source = await readFile(appSidebarPath, 'utf8')

  assert.doesNotMatch(source, /sshService\.(importConnections|exportConnections)/)
  assert.doesNotMatch(source, /ssh\.(importConnections|exportConnections)/)
  assert.match(source, /ssh-connections-imported/)
})
