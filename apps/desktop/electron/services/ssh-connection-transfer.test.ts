import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SSH_CONNECTION_EXPORT_FORMAT,
  SSH_CONNECTION_EXPORT_VERSION,
  prepareConnectionImport
} from './ssh-connection-transfer'

test('import skips normalized host duplicates against existing records and within the file', () => {
  const prepared = prepareConnectionImport(
    {
      format: SSH_CONNECTION_EXPORT_FORMAT,
      version: SSH_CONNECTION_EXPORT_VERSION,
      connections: [
        {
          name: 'Existing',
          host: ' SERVER.EXAMPLE.COM ',
          port: 22,
          username: 'root',
          authType: 'PASSWORD'
        },
        {
          name: 'New',
          host: '10.0.0.8',
          port: 2222,
          username: 'admin',
          authType: 'password',
          password: 'secret'
        },
        {
          name: 'Duplicate new',
          host: ' 10.0.0.8 ',
          port: 22,
          username: 'other',
          authType: 'PASSWORD'
        }
      ]
    },
    ['server.example.com']
  )

  assert.deepEqual(prepared.result, { imported: 1, skipped: 2, invalid: 0 })
  assert.deepEqual(prepared.connections, [
    {
      name: 'New',
      host: '10.0.0.8',
      port: 2222,
      username: 'admin',
      authType: 'PASSWORD',
      password: 'secret'
    }
  ])
})

test('import preserves credentials while ignoring exported system fields', () => {
  const prepared = prepareConnectionImport({
    format: SSH_CONNECTION_EXPORT_FORMAT,
    version: SSH_CONNECTION_EXPORT_VERSION,
    connections: [{
      id: 'old-id',
      userId: 'old-user',
      status: 'CONNECTED',
      folderId: 'old-folder',
      createdAt: '2020-01-01',
      name: 'Key server',
      host: 'key.example.com',
      port: 22,
      username: 'deploy',
      authType: 'PRIVATE_KEY',
      privateKey: 'PRIVATE',
      publicKey: 'PUBLIC',
      passphrase: 'PASSPHRASE'
    }]
  }, [])

  assert.deepEqual(prepared.result, { imported: 1, skipped: 0, invalid: 0 })
  assert.deepEqual(Object.keys(prepared.connections[0]).sort(), [
    'authType',
    'host',
    'name',
    'passphrase',
    'port',
    'privateKey',
    'publicKey',
    'username'
  ])
})

test('import reports invalid entries and rejects unsupported envelopes', () => {
  const prepared = prepareConnectionImport({
    format: SSH_CONNECTION_EXPORT_FORMAT,
    version: SSH_CONNECTION_EXPORT_VERSION,
    connections: [
      { name: '', host: 'host', port: 22, username: 'root', authType: 'PASSWORD' },
      { name: 'Bad port', host: 'host', port: 70000, username: 'root', authType: 'PASSWORD' },
      { name: 'Bad auth', host: 'host', port: 22, username: 'root', authType: 'TOKEN' }
    ]
  }, [])

  assert.deepEqual(prepared.result, { imported: 0, skipped: 0, invalid: 3 })
  assert.throws(
    () => prepareConnectionImport({ format: SSH_CONNECTION_EXPORT_FORMAT, version: 2, connections: [] }, []),
    /Unsupported or invalid/
  )
})
