import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const apiHandlersPath = join(currentDir, 'api-handlers.ts')

test('electron api handlers use local API in development and production API when packaged', async () => {
  const source = await readFile(apiHandlersPath, 'utf8')

  assert.match(source, /import \{ app, ipcMain \} from 'electron'/)
  assert.match(
    source,
    /const isProductionApi = app\.isPackaged \|\| process\.env\.ELECTRON_FORCE_PROD_RENDERER === '1'/
  )
  assert.match(source, /getApiBaseUrlByMode\(isProductionApi\)/)
})

test('electron api handlers centralize request logging for all HTTP calls', async () => {
  const source = await readFile(apiHandlersPath, 'utf8')

  assert.match(source, /function logApiStart\(/)
  assert.match(source, /function logApiSuccess\(/)
  assert.match(source, /function logApiFailure\(/)
  assert.match(source, /async function fetchJson</)
  assert.match(source, /fetchJson<ApiResponse>\('auth\.wechatLogin', 'POST', url/)
  assert.match(source, /authorizationPreview/)
  assert.match(source, /apiBaseUrl: API_BASE_URL/)
})
