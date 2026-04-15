import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const loginModalPath = join(currentDir, 'LoginModal.vue')

test('login modal defaults to WeChat QR login with polling and agreement checked', async () => {
  const source = await readFile(loginModalPath, 'utf8')

  assert.match(source, /bizId/)
  assert.match(source, /qrCodeUrl/)
  assert.match(source, /toDataURL|QRCode|qrcode/)
  assert.match(source, /poll/i)
  assert.match(source, /startWechatLoginPolling/)
  assert.match(source, /agreementChecked|agreeTerms/)
  assert.match(source, /用户协议/)
  assert.match(source, /隐私协议/)
  assert.match(source, /openExternal|openAgreementLink|openProtocolLink/)
  assert.doesNotMatch(source, /const showModal = ref\(props\.show\)/)
  assert.doesNotMatch(source, /邮箱/)
  assert.doesNotMatch(source, /密码/)
})
