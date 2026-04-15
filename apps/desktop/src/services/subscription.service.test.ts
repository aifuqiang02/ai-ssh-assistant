import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const servicePath = join(currentDir, 'subscription.service.ts')

test('subscription sync logs token and user summary before remote fetch', async () => {
  const source = await readFile(servicePath, 'utf8')

  assert.match(source, /\[subscription\] sync start/)
  assert.match(source, /tokenPreview: localToken\?\.slice\(0, 16\)/)
  assert.match(source, /\[subscription\] sync success/)
  assert.match(source, /\[subscription\] sync short-circuit guest state/)
})
