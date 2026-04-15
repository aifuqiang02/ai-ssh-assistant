import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const scriptPath = join(currentDir, 'run-prod-desktop.js')

test('prod desktop launcher forces production main process and production renderer', async () => {
  const source = await readFile(scriptPath, 'utf8')

  assert.match(source, /NODE_ENV: 'production'/)
  assert.match(source, /ELECTRON_FORCE_PROD_RENDERER: '1'/)
})
