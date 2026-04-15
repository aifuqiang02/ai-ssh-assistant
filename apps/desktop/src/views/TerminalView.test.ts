import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const terminalViewPath = join(currentDir, 'TerminalView.vue')

test('ai assistant supports floating launcher semantics instead of close semantics', async () => {
  const source = await readFile(terminalViewPath, 'utf8')

  assert.match(source, /title="收起AI助手"/)
  assert.match(source, /title="展开AI助手"/)
  assert.match(source, /expandAIAssistant/)
  assert.doesNotMatch(source, /title="关闭AI助手"/)
  assert.doesNotMatch(source, /bi bi-x/)
})

test('connecting status shows disabled visual feedback', async () => {
  const source = await readFile(terminalViewPath, 'utf8')

  assert.match(source, /class="status-badge connecting disabled"/)
  assert.match(source, /cursor: not-allowed;/)
  assert.match(source, /opacity: 0\.6;/)
})

test('ai assistant collapses into a floating launcher and lets terminal expand fully', async () => {
  const source = await readFile(terminalViewPath, 'utf8')

  assert.doesNotMatch(source, /bi bi-robot/)
  assert.doesNotMatch(source, /title="AI助手"/)
  assert.match(source, /const isAIAssistantMinimized = ref\(false\)/)
  assert.match(source, /v-if="!isAIAssistantMinimized"/)
  assert.match(source, /v-else[\s\S]*class="ai-assistant-floating-toggle"/)
  assert.match(source, /class="ai-floating-toggle-label">AI 助手<\/span>/)
  assert.match(source, /@click="expandAIAssistant"/)
  assert.match(source, /class="terminal-container"/)
  assert.match(source, /'with-ai-panel': showAIAssistant/)
  assert.match(source, /\.ai-assistant-floating-toggle/)
  assert.doesNotMatch(source, /collapsed: isAIAssistantMinimized/)
})

test('floating ai launcher uses a high-contrast style on dark terminal background', async () => {
  const source = await readFile(terminalViewPath, 'utf8')

  assert.match(source, /\.ai-assistant-floating-toggle \{/)
  assert.match(
    source,
    /background: linear-gradient\(135deg, rgba\(255, 255, 255, 0\.96\) 0%, rgba\(230, 236, 244, 0\.92\) 100%\);/
  )
  assert.match(source, /color: #111827;/)
  assert.match(source, /border: 1px solid rgba\(255, 255, 255, 0\.72\);/)
  assert.match(source, /font-weight: 600;/)
})

test('open-in-folder tolerates pwd output that includes prompt text around the path', async () => {
  const source = await readFile(terminalViewPath, 'utf8')

  assert.match(
    source,
    /window\.electronAPI\.ssh\.getCurrentDirectory\(currentConnectionId\.value\)/
  )
  assert.match(source, /const posixPathMatch = line\.match\(\/\(\?:~\|\\\/\)/)
  assert.match(source, /const normalizedPath = posixPathMatch\[0\]\.startsWith\('~'\)/)
  assert.match(source, /if \(normalizedPath\.startsWith\('\/'\)\) \{/)
  assert.doesNotMatch(
    source,
    /window\.electronAPI\.ssh\.execute\(currentConnectionId\.value, 'pwd'\)/
  )
  assert.doesNotMatch(source, /const pathLine = lines\.find\(line => line\.startsWith\('\/'\)\)/)
})

test('cached terminal tabs keep a route snapshot instead of following global route query changes', async () => {
  const source = await readFile(terminalViewPath, 'utf8')

  assert.match(source, /const routeSnapshot = ref\(\{/)
  assert.match(source, /connectionId: route\.query\.connectionId as string \| undefined/)
  assert.match(source, /name: route\.query\.name as string \| undefined/)
  assert.match(source, /nodeId: route\.query\.nodeId as string \| undefined/)
  assert.match(source, /const syncRouteSnapshot = \(\) => \{/)
  assert.match(source, /if \(!props\.connectionId\) \{[\s\S]*routeSnapshot\.value = \{/)
  assert.match(source, /return props\.connectionId \|\| routeSnapshot\.value\.connectionId \|\| ''/)
  assert.match(source, /decodeURIComponent\(routeSnapshot\.value\.name \|\| '终端'\)/)
  assert.match(source, /return routeSnapshot\.value\.nodeId \|\| ''/)
  assert.doesNotMatch(
    source,
    /return props\.connectionId \|\| \(route\.query\.connectionId as string\)/
  )
})
