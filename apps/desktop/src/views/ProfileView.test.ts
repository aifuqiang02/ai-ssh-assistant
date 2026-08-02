import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const profileViewPath = join(currentDir, 'ProfileView.vue')

test('profile view retains account details without subscription or payment UI', async () => {
  const source = await readFile(profileViewPath, 'utf8')

  assert.match(source, /个人中心/)
  assert.match(source, /useAuthSession/)
  assert.doesNotMatch(source, /Subscription|Payment|套餐|订阅|支付|充值|升级|额度/)
})
