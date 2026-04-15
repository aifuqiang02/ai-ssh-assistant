import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const modalPath = join(currentDir, 'SubscriptionUpgradeModal.vue')

test('subscription upgrade modal shows all package choices and pricing copy', async () => {
  const source = await readFile(modalPath, 'utf8')

  assert.match(source, /基础版/)
  assert.match(source, /AI 套餐/)
  assert.match(source, /完整版/)
  assert.match(source, /2 元\/月/)
  assert.match(source, /50 元\/年/)
  assert.match(source, /199 元/)
  assert.match(source, /立即开通|去支付|继续开通/)
})
