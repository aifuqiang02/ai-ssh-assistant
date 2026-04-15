import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const modalPath = join(currentDir, 'SubscriptionPaymentModal.vue')

test('subscription payment modal shows payment status, qr area, and retry action', async () => {
  const source = await readFile(modalPath, 'utf8')

  assert.match(source, /支付二维码|支付成功|待支付|状态：/)
  assert.match(source, /qrCodeDataUrl/)
  assert.match(source, /重新生成二维码/)
  assert.match(source, /retry/)
})
