import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const filePath = join(currentDir, 'api-environment.ts')

test('api environment centralizes dev and production API origins', async () => {
  const source = await readFile(filePath, 'utf8')

  assert.match(source, /const PROD_API_ORIGIN = 'https:\/\/api\.tx07\.cn\/ai-ssh'/)
  assert.match(source, /const DEV_API_ORIGIN = 'http:\/\/127\.0\.0\.1:3000'/)
  assert.match(source, /export function getRendererApiOrigin\(/)
  assert.match(source, /export function getRendererLegalBaseUrl\(/)
  assert.match(source, /export function getApiOriginByMode\(/)
  assert.match(source, /export function getApiBaseUrlByMode\(/)
})
