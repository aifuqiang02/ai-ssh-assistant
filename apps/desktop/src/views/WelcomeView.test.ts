import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const welcomeViewPath = join(currentDir, 'WelcomeView.vue')

test('welcome view does not render the quick start section', async () => {
  const source = await readFile(welcomeViewPath, 'utf8')

  assert.doesNotMatch(source, /welcome\.quickStartTitle/)
  assert.doesNotMatch(source, /welcome\.quickStartDesc/)
  assert.doesNotMatch(source, /openSSHConnections/)
})

test('welcome view renders official model quota summary and reset time labels', async () => {
  const source = await readFile(welcomeViewPath, 'utf8')

  assert.match(source, /官方模型月额度/)
  assert.match(source, /下次重置时间/)
  assert.match(source, /officialUsageSummary/)
  assert.match(source, /officialResetLabel/)
})
