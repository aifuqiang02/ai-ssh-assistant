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

test('welcome view does not expose subscription or official model quota details', async () => {
  const source = await readFile(welcomeViewPath, 'utf8')

  assert.doesNotMatch(source, /订阅|升级|额度|剩余次数|重置时间/)
  assert.match(source, /登录即可使用官方 AI/)
})

test('welcome view links feedback to GitHub issues in the external browser', async () => {
  const source = await readFile(welcomeViewPath, 'utf8')

  assert.match(source, /使用过程中，如有问题，或者体验不好的地方，可以加群反馈/)
  assert.match(source, /https:\/\/github\.com\/aifuqiang02\/ai-ssh-assistant\/issues\/new/)
  assert.match(source, /electronAPI\.system\.openExternal\(githubFeedbackUrl\)/)
})
