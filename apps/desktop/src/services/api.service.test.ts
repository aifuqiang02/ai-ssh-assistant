import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const apiServicePath = join(currentDir, 'api.service.ts')

test('wechat login exchange uses electron auth bridge before browser fetch', async () => {
  const source = await readFile(apiServicePath, 'utf8')

  const match = source.match(/async wechatLogin\([\s\S]*?\n  }/)
  assert.ok(match, 'expected wechatLogin method to exist')

  const methodSource = match[0]
  assert.match(methodSource, /window\.electronAPI\.api\.auth\.wechatLogin/)
})

test('api service exposes official model status and chat endpoints', async () => {
  const source = await readFile(apiServicePath, 'utf8')

  assert.match(source, /async getOfficialModelStatus\(/)
  assert.match(source, /return this\.get\('\/ai\/official\/status'\)/)
  assert.match(source, /async createOfficialChat\(/)
  assert.match(source, /return this\.post\('\/ai\/official\/chat', payload\)/)
})

test('api service preserves backend error code for downstream official model handling', async () => {
  const source = await readFile(apiServicePath, 'utf8')

  assert.match(source, /error\.code = data\.code/)
  assert.match(source, /error\.status = response\.status/)
})

test('api service clears both access and refresh tokens on logout cleanup', async () => {
  const source = await readFile(apiServicePath, 'utf8')

  assert.match(source, /localStorage\.removeItem\('refreshToken'\)/)
  assert.match(source, /sessionStorage\.removeItem\('refreshToken'\)/)
})

test('api service logs token preview for request lifecycle debugging', async () => {
  const source = await readFile(apiServicePath, 'utf8')

  assert.match(source, /\[api\] loadToken/)
  assert.match(source, /\[api\] setToken/)
  assert.match(source, /\[api\] request start/)
  assert.match(source, /\[api\] request failed response/)
  assert.match(source, /tokenPreview: this\.token\?\.slice\(0, 16\)/)
})
