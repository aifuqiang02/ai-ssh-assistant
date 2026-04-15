import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const appViewPath = join(currentDir, 'App.vue')

test('file manager routes use connection-aware keep-alive keys', async () => {
  const source = await readFile(appViewPath, 'utf8')

  assert.match(
    source,
    /if \(route\.path\.startsWith\('\/file-manager'\) && route\.query\.connectionId\) \{/
  )
  assert.doesNotMatch(
    source,
    /const currentPath = route\.query\.path \? `-\$\{route\.query\.path\}` : ''/
  )
  assert.match(source, /return `file-manager-\$\{route\.query\.connectionId\}`/)
})

test('active tab path stays synced with the current route so file manager tabs restore latest directory', async () => {
  const source = await readFile(appViewPath, 'utf8')

  assert.match(source, /const route = useRoute\(\)/)
  assert.match(source, /watch\(\s*\(\) => route\.fullPath,/)
  assert.match(
    source,
    /const routeTabEntry = openTabsList\.value\.find\(tab => isSameTabRoute\(tab\.path, route\.fullPath\)\)/
  )
  assert.match(source, /routeTabEntry\.path = route\.fullPath/)
  assert.match(source, /const isSameTabRoute = \(tabPath: string, currentFullPath: string\) => \{/)
})

test('app bootstraps the updater and surfaces install-ready notifications', async () => {
  const source = await readFile(appViewPath, 'utf8')

  assert.match(source, /import \{ useUpdateClient \} from '@\/services\/update-client'/)
  assert.match(source, /const updater = useUpdateClient\(\)/)
  assert.match(source, /await updater\.initialize\(\)/)
  assert.match(source, /window\.\$notification\.add\(/)
  assert.match(source, /label: '立即安装'/)
  assert.match(source, /await updater\.installDownloadedUpdate\(\)/)
})
