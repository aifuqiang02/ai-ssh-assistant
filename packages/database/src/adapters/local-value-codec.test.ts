import test from 'node:test'
import assert from 'node:assert/strict'
import { deserializeStorageRow } from './local-value-codec'

test('preserves SSH credentials that look like JSON scalars', () => {
  const row = deserializeStorageRow('SSHConnection', {
    password: '123456',
    privateKey: 'false',
    passphrase: 'null',
    username: 'true',
    host: 'server.example.com',
    port: '2222',
    isActive: 'false'
  })

  assert.equal(row.password, '123456')
  assert.equal(row.privateKey, 'false')
  assert.equal(row.passphrase, 'null')
  assert.equal(row.username, 'true')
  assert.equal(row.host, 'server.example.com')
  assert.equal(row.port, 2222)
  assert.equal(row.isActive, false)
})

test('still decodes typed local values and JSON settings', () => {
  assert.deepEqual(
    deserializeStorageRow('UserSettings', {
      data: '{"ssh":{"timeout":15}}',
      updatedAt: '"2026-09-30T00:00:00.000Z"'
    }),
    {
      data: { ssh: { timeout: 15 } },
      updatedAt: '2026-09-30T00:00:00.000Z'
    }
  )
})
