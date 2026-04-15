import test from 'node:test'
import assert from 'node:assert/strict'

import { PROXY_URL_TEMPLATE, generateUpdateManifest } from './generate-update-manifest.mjs'

test('generateUpdateManifest builds per-platform multi-source entries', () => {
  const manifest = generateUpdateManifest({
    version: '1.8.4',
    releaseDate: '2026-04-07T12:00:00.000Z',
    notes: 'Updater test release',
    githubOwner: 'aifuqiang02',
    githubRepo: 'ai-ssh-assistant',
    files: [
      {
        fileName: 'AI-SSH-Assistant-1.8.4-setup-x64.exe',
        size: 100,
        sha512: 'sha-win',
        platform: 'win32',
        arch: 'x64'
      },
      {
        fileName: 'ai-ssh-assistant-1.8.4-macos-arm64.dmg',
        size: 200,
        sha512: 'sha-mac',
        platform: 'darwin',
        arch: 'arm64'
      },
      {
        fileName: 'ai-ssh-assistant-1.8.4-linux-x64.AppImage',
        size: 300,
        sha512: 'sha-linux',
        platform: 'linux',
        arch: 'x64'
      }
    ]
  })

  assert.equal(manifest.version, '1.8.4')
  assert.equal(manifest.platforms['win32-x64'].sha512, 'sha-win')
  assert.equal(
    manifest.platforms['darwin-arm64'].fileName,
    'ai-ssh-assistant-1.8.4-macos-arm64.dmg'
  )
  assert.equal(manifest.platforms['linux-x64'].size, 300)
  assert.deepEqual(
    manifest.platforms['win32-x64'].sources.map(source => source.id),
    ['github', 'proxy']
  )
  assert.match(
    manifest.platforms['win32-x64'].sources[0].url,
    /github\.com\/aifuqiang02\/ai-ssh-assistant\/releases\/download\/v1\.8\.4\//
  )
  assert.equal(
    manifest.platforms['win32-x64'].sources[1].url,
    'https://git.aifuqiang.win/https://github.com/aifuqiang02/ai-ssh-assistant/releases/download/v1.8.4/AI-SSH-Assistant-1.8.4-setup-x64.exe'
  )
})

test('generateUpdateManifest uses the fixed proxy template', () => {
  assert.equal(PROXY_URL_TEMPLATE, 'https://git.aifuqiang.win/{url}')
})
