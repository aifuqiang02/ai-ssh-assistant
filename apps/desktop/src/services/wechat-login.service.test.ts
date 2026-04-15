import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const servicePath = join(currentDir, 'wechat-login.service.ts')

test('wechat login service logs key checkpoints from business login to logout cleanup', async () => {
  const source = await readFile(servicePath, 'utf8')

  assert.match(source, /\[wechat-login\] exchangeWechatProfileForLogin start/)
  assert.match(source, /\[wechat-login\] exchangeWechatProfileForLogin failed/)
  assert.match(source, /\[wechat-login\] saveLoginState start/)
  assert.match(source, /\[wechat-login\] saveLoginState done/)
  assert.match(source, /\[wechat-login\] logoutWechatLogin start/)
  assert.match(source, /\[wechat-login\] logoutWechatLogin cleared local auth state/)
  assert.match(source, /\[wechat-login\] logoutWechatLogin done/)
})
