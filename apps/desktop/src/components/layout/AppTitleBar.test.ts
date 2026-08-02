import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const appTitleBarPath = join(currentDir, 'AppTitleBar.vue')

test('about menu action opens a new tab instead of replacing the current route', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')
  const match = source.match(/case 'show-about':[\s\S]*?break/)

  assert.ok(match, 'expected show-about menu action to exist')

  const aboutCase = match[0]
  assert.match(aboutCase, /openNewTab\(/)
  assert.doesNotMatch(aboutCase, /router\.push\('\/about'\)/)
})

test('file menu owns connection import and export actions', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')

  assert.match(source, /id: 'file'.*titlebar\.menuFile/)
  assert.match(source, /case 'import-connections':/)
  assert.match(source, /sshService\.importConnections\(\)/)
  assert.match(source, /ssh-connections-imported/)
  assert.match(source, /case 'export-connections':/)
  assert.match(source, /sshService\.exportConnections\(\)/)
})

test('title bar exposes wechat avatar, nickname, profile entry, and logout action', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')

  assert.match(source, /wechatUser/)
  assert.match(source, /wechatProfile\?\.avatarUrl|avatar/)
  assert.match(source, /wechatProfile\?\.nickname|username/)
  assert.match(source, /个人中心/)
  assert.match(source, /退出登录|handleLogout/)
})

test('title bar emits open-login when user area is clicked while logged out', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')

  assert.match(source, /handleUserAreaClick/)
  assert.match(source, /emit\('open-login'\)/)
  assert.match(source, /if \(!wechatUser\.value\)/)
})

test('profile center opens standalone profile tab instead of settings profile section', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')

  assert.match(source, /openNewTab\('profile'.*'\/profile'\)/)
  assert.doesNotMatch(source, /\/settings\?section=profile/)
})

test('title bar renders official models without quota details', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')

  assert.match(source, /groupedModels\.official/)
  assert.match(source, /return '官方模型'/)
  assert.doesNotMatch(source, /monthlyLimit|remainingCount|本月剩余/)
  assert.match(source, /我的模型/)
  assert.match(source, /buildOfficialTitleBarModels/)
})

test('title bar persists official selection with explicit source metadata', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')

  assert.match(source, /source: 'official'/)
  assert.match(source, /providerId: 'official'/)
  assert.match(source, /modelId: model\.id/)
})

test('title bar defaults to the first available official model when no selection is saved', async () => {
  const source = await readFile(appTitleBarPath, 'utf8')

  assert.match(source, /const defaultOfficialModel = getDefaultOfficialModel\(\)/)
  assert.match(source, /groupedModels\.value\.official\.find\(model => !model\.disabled\)/)
  assert.match(source, /applyOfficialModelSelection\(defaultOfficialModel\)/)
})
