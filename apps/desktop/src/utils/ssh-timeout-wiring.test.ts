import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const srcDir = join(currentDir, '..')
const desktopDir = join(srcDir, '..')
const settingsViewPath = join(srcDir, 'views', 'SettingsView.vue')
const sshHandlersPath = join(desktopDir, 'electron', 'ipc', 'ssh-handlers.ts')
const terminalViewPath = join(srcDir, 'views', 'TerminalView.vue')
const sshCommandServicePath = join(srcDir, 'services', 'ssh', 'ssh-command.service.ts')
const desktopMainPath = join(desktopDir, 'electron', 'main', 'index.ts')
const desktopHtmlPath = join(desktopDir, 'index.html')
const aiTestServicePath = join(srcDir, 'services', 'ai-test.service.ts')

test('ssh timeout defaults to 10 seconds in settings UI', async () => {
  const source = await readFile(settingsViewPath, 'utf8')

  assert.match(source, /const sshTimeout = ref\(10\)/)
  assert.match(source, /min="10"/)
  assert.match(source, /settings\.ssh\.timeout \|\| 10/)
})

test('ssh main-process connections use configured readyTimeout with 10 second fallback', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /readyTimeout:\s*\(config\.timeout \?\? 10\) \* 1000/)
})

test('ssh main-process connections enable protocol keepalive by default', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /if \(config\.keepAlive !== false\)/)
  assert.match(
    source,
    /connectConfig\.keepaliveInterval = \(config\.keepAliveInterval \?\? 15\) \* 1000/
  )
  assert.match(source, /connectConfig\.keepaliveCountMax = 3/)
})

test('ssh settings expose configurable keepalive interval with 15 second default', async () => {
  const source = await readFile(settingsViewPath, 'utf8')

  assert.match(source, /const keepAliveInterval = ref\(15\)/)
  assert.match(source, /v-model\.number="keepAliveInterval"/)
  assert.match(source, /keepAliveInterval: keepAliveInterval\.value/)
  assert.match(source, /settings\.ssh\.keepAliveInterval \?\? 15/)
})

test('terminal view schedules silent auto reconnect on unexpected disconnect', async () => {
  const source = await readFile(terminalViewPath, 'utf8')

  assert.match(source, /const autoReconnectAttempts = ref\(0\)/)
  assert.match(source, /const maxAutoReconnectAttempts = 3/)
  assert.match(source, /await scheduleAutoReconnect\(\)/)
  assert.match(
    source,
    /const handleReconnect = async \(options: \{ silent\?: boolean \} = \{\}\) =>/
  )
})

test('renderer SSH command service cancels in-flight execute requests on abort', async () => {
  const source = await readFile(sshCommandServicePath, 'utf8')

  assert.match(source, /signal\?: AbortSignal/)
  assert.match(
    source,
    /const requestId = `exec-\$\{Date\.now\(\)\}-\$\{Math\.random\(\)\.toString\(36\)\.slice\(2, 8\)\}`/
  )
  assert.match(source, /window\.electronAPI\.ssh\.cancelExecute\(requestId\)/)
  assert.match(source, /window\.electronAPI\.ssh\.execute\(connectionId, command, requestId\)/)
})

test('main-process SSH handlers expose cancelable exec requests', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /private pendingExecs: Map<string, PendingExec> = new Map\(\)/)
  assert.match(source, /async cancelExecute\(requestId: string\): Promise<boolean>/)
  assert.match(source, /ipcMain\.handle\('ssh:cancel-execute'/)
  assert.match(source, /connection\.client!\.exec\(finalCommand, \(err, stream\) =>/)
})

test('desktop CSP allows all http and https connect targets', async () => {
  const mainSource = await readFile(desktopMainPath, 'utf8')
  const htmlSource = await readFile(desktopHtmlPath, 'utf8')

  assert.match(mainSource, /connect-src 'self' http: https: ws: wss:/)
  assert.match(htmlSource, /connect-src 'self' http: https: ws: wss:/)
})

test('openai-compatible provider tests use unified chat completions endpoint', async () => {
  const source = await readFile(aiTestServicePath, 'utf8')

  assert.doesNotMatch(source, /\$\{provider\.endpoint\}\/v1\/chat\/completions/)
  assert.match(source, /\$\{provider\.endpoint\}\/chat\/completions/)
})
