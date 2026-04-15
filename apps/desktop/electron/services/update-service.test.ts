import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

import {
  UpdateService,
  buildManifestUrls,
  compareVersions,
  selectFastestSource,
  type PlatformUpdateManifest,
  type UpdateSourceProbeResult
} from './update-service.ts'

function createLoggerProbe() {
  const entries: Array<{ level: string; message: string; data?: Record<string, unknown> }> = []

  return {
    entries,
    logger: {
      info(message: string, data?: Record<string, unknown>) {
        entries.push({ level: 'info', message, data })
      },
      warn(message: string, data?: Record<string, unknown>) {
        entries.push({ level: 'warn', message, data })
      },
      error(message: string, data?: Record<string, unknown>) {
        entries.push({ level: 'error', message, data })
      }
    }
  }
}

test('compareVersions understands semantic version ordering', () => {
  assert.equal(compareVersions('1.8.4', '1.8.3'), 1)
  assert.equal(compareVersions('1.8.3', '1.8.3'), 0)
  assert.equal(compareVersions('1.8.2', '1.8.3'), -1)
})

test('buildManifestUrls uses fixed github and proxy manifest urls', () => {
  const urls = buildManifestUrls({
    githubOwner: 'aifuqiang02',
    githubRepo: 'ai-ssh-assistant',
    platform: 'darwin',
    arch: 'arm64'
  })

  assert.deepEqual(urls, [
    'https://github.com/aifuqiang02/ai-ssh-assistant/releases/latest/download/update-manifest-darwin-arm64.json',
    'https://git.aifuqiang.win/https://github.com/aifuqiang02/ai-ssh-assistant/releases/latest/download/update-manifest-darwin-arm64.json'
  ])
})

test('selectFastestSource chooses the fastest successful source', () => {
  const selected = selectFastestSource([
    { sourceId: 'github', url: 'https://github.test/file', ok: true, durationMs: 80 },
    { sourceId: 'mirror-1', url: 'https://mirror.test/file', ok: true, durationMs: 25 },
    {
      sourceId: 'mirror-2',
      url: 'https://mirror-2.test/file',
      ok: false,
      durationMs: 5,
      status: 500
    }
  ])

  assert.equal(selected?.sourceId, 'mirror-1')
})

test('startBackgroundCheck reuses a valid cached artifact without downloading again', async () => {
  const writes = new Map<string, Buffer>()
  const loggerProbe = createLoggerProbe()
  const manifest: PlatformUpdateManifest = {
    version: '1.8.4',
    releaseDate: '2026-04-07T12:00:00.000Z',
    notes: 'cached test',
    platform: 'win32-x64',
    artifact: {
      version: '1.8.4',
      releaseDate: '2026-04-07T12:00:00.000Z',
      notes: 'cached test',
      fileName: 'AI-SSH-Assistant-1.8.4-setup-x64.exe',
      size: 4,
      sha512:
        '7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==',
      sources: [{ id: 'github', url: 'https://github.test/file.exe' }]
    }
  }
  const expectedCachePath = path.join('/cache', '1.8.4', 'AI-SSH-Assistant-1.8.4-setup-x64.exe')
  writes.set(expectedCachePath, Buffer.from('test'))

  const service = new UpdateService({
    currentVersion: '1.8.3',
    platform: 'win32',
    arch: 'x64',
    manifestUrls: ['https://manifest.test/update.json'],
    fetch: async (input: RequestInfo | URL) => {
      assert.equal(String(input), 'https://manifest.test/update.json')
      return new Response(JSON.stringify(manifest), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    },
    getUserDataPath: () => '/cache',
    fileStore: {
      mkdir: async () => {},
      exists: async filePath => writes.has(filePath),
      readFile: async filePath => writes.get(filePath) ?? Buffer.alloc(0),
      writeFile: async (filePath, data) => {
        writes.set(filePath, Buffer.from(data))
      }
    },
    openPath: async () => '',
    launchInstaller: async () => {},
    emitState: () => {},
    logger: loggerProbe.logger
  })

  const state = await service.startBackgroundCheck()

  assert.equal(state.status, 'downloaded')
  assert.equal(state.downloadedFilePath, expectedCachePath)
  assert.equal(
    loggerProbe.entries.some(entry => entry.message === 'Using cached update package'),
    true
  )
})

test('installDownloadedUpdate launches cached installer on windows', async () => {
  const launched: string[] = []
  const loggerProbe = createLoggerProbe()
  const service = new UpdateService({
    currentVersion: '1.8.3',
    platform: 'win32',
    arch: 'x64',
    manifestUrls: [],
    fetch: async () => new Response(null, { status: 404 }),
    getUserDataPath: () => '/cache',
    fileStore: {
      mkdir: async () => {},
      exists: async () => true,
      readFile: async () => Buffer.from('test'),
      writeFile: async () => {}
    },
    openPath: async () => '',
    launchInstaller: async filePath => {
      launched.push(filePath)
    },
    emitState: () => {},
    logger: loggerProbe.logger
  })

  service.setStateForTest({
    status: 'downloaded',
    currentVersion: '1.8.3',
    availableVersion: '1.8.4',
    downloadedFilePath: '/cache/1.8.4/setup.exe'
  })

  await service.installDownloadedUpdate()

  assert.deepEqual(launched, ['/cache/1.8.4/setup.exe'])
  assert.equal(
    loggerProbe.entries.some(entry => entry.message === 'Launching cached installer directly'),
    true
  )
})

test('installDownloadedUpdate falls back to later manifest urls when earlier ones fail', async () => {
  const manifest: PlatformUpdateManifest = {
    version: '1.8.4',
    releaseDate: '2026-04-07T12:00:00.000Z',
    notes: 'fallback test',
    platform: 'linux-x64',
    artifact: {
      version: '1.8.4',
      releaseDate: '2026-04-07T12:00:00.000Z',
      notes: 'fallback test',
      fileName: 'ai-ssh-assistant-1.8.4-linux-x64.AppImage',
      size: 4,
      sha512:
        '7iaw3Ur350mqGo7jwQrpkj9hiYB3Lkc/iBml1JQODbJ6wYX4oOHV+E+IvIh/1nsUNzLDBMxfqa2Ob1f1ACio/w==',
      sources: [{ id: 'mirror-1', url: 'https://mirror.test/file.AppImage' }]
    }
  }
  const writes = new Map<string, Buffer>()
  const loggerProbe = createLoggerProbe()

  const service = new UpdateService({
    currentVersion: '1.8.3',
    platform: 'linux',
    arch: 'x64',
    manifestUrls: ['https://bad.example.com/update.json', 'https://good.example.com/update.json'],
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      if (url.includes('bad.example.com')) {
        return new Response(null, { status: 503 })
      }
      if (url.includes('good.example.com')) {
        return new Response(JSON.stringify(manifest), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        })
      }
      if (init?.method === 'HEAD') {
        return new Response(null, { status: 200 })
      }
      return new Response(Buffer.from('test'), { status: 200 })
    },
    getUserDataPath: () => '/cache',
    fileStore: {
      mkdir: async () => {},
      exists: async filePath => writes.has(filePath),
      readFile: async filePath => writes.get(filePath) ?? Buffer.alloc(0),
      writeFile: async (filePath, data) => {
        writes.set(filePath, Buffer.from(data))
      }
    },
    openPath: async () => '',
    launchInstaller: async () => {},
    emitState: () => {},
    logger: loggerProbe.logger
  })

  const state = await service.startBackgroundCheck()

  assert.equal(state.status, 'downloaded')
  assert.equal(state.selectedSourceId, 'mirror-1')
  assert.equal(
    loggerProbe.entries.some(entry => entry.message === 'Manifest request failed'),
    true
  )
})

test('installDownloadedUpdate opens dmg on macOS', async () => {
  const opened: string[] = []
  const launched: string[] = []
  const loggerProbe = createLoggerProbe()
  const service = new UpdateService({
    currentVersion: '1.8.3',
    platform: 'darwin',
    arch: 'arm64',
    manifestUrls: [],
    fetch: async () => new Response(null, { status: 404 }),
    getUserDataPath: () => '/cache',
    fileStore: {
      mkdir: async () => {},
      exists: async () => true,
      readFile: async () => Buffer.from('test'),
      writeFile: async () => {}
    },
    openPath: async filePath => {
      opened.push(filePath)
      return ''
    },
    launchInstaller: async filePath => {
      launched.push(filePath)
    },
    emitState: () => {},
    logger: loggerProbe.logger
  })

  service.setStateForTest({
    status: 'downloaded',
    currentVersion: '1.8.3',
    availableVersion: '1.8.4',
    downloadedFilePath: '/cache/1.8.4/update.dmg'
  })

  await service.installDownloadedUpdate()

  assert.deepEqual(opened, ['/cache/1.8.4/update.dmg'])
  assert.deepEqual(launched, [])
  assert.equal(
    loggerProbe.entries.some(
      entry => entry.message === 'Opening cached update package with system handler'
    ),
    true
  )
})

test('installDownloadedUpdate launches AppImage directly on linux', async () => {
  const opened: string[] = []
  const launched: string[] = []
  const service = new UpdateService({
    currentVersion: '1.8.3',
    platform: 'linux',
    arch: 'x64',
    manifestUrls: [],
    fetch: async () => new Response(null, { status: 404 }),
    getUserDataPath: () => '/cache',
    fileStore: {
      mkdir: async () => {},
      exists: async () => true,
      readFile: async () => Buffer.from('test'),
      writeFile: async () => {}
    },
    openPath: async filePath => {
      opened.push(filePath)
      return ''
    },
    launchInstaller: async filePath => {
      launched.push(filePath)
    },
    emitState: () => {}
  })

  service.setStateForTest({
    status: 'downloaded',
    currentVersion: '1.8.3',
    availableVersion: '1.8.4',
    downloadedFilePath: '/cache/1.8.4/update.AppImage'
  })

  await service.installDownloadedUpdate()

  assert.deepEqual(launched, ['/cache/1.8.4/update.AppImage'])
  assert.deepEqual(opened, [])
})

test('probe results fall back when the fastest source fails', async () => {
  const probes: UpdateSourceProbeResult[] = [
    { sourceId: 'github', url: 'https://github.test/file', ok: false, durationMs: 5, status: 503 },
    { sourceId: 'mirror-1', url: 'https://mirror.test/file', ok: true, durationMs: 50 }
  ]

  assert.equal(selectFastestSource(probes)?.url, 'https://mirror.test/file')
})
