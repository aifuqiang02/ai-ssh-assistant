import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const fileManagerViewPath = join(currentDir, 'FileManagerView.vue')
const preloadPath = join(currentDir, '../../electron/preload/index.ts')

test('file manager delete action uses explicit danger label and styling', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /grid-template-columns:\s*40px 1fr 100px 132px 132px;/)
  assert.match(source, /class="action-btn primary"/)
  assert.match(source, /<span>下载<\/span>/)
  assert.match(source, /\.action-btn\.primary\s*\{/)
  assert.match(source, /\.action-btn\.primary:hover\s*\{/)
  assert.match(source, /class="action-btn danger" @click="deleteFile\(file\)" title="删除"/)
  assert.match(source, /<span>删除<\/span>/)
  assert.match(source, /\.action-btn\.danger\s*\{/)
  assert.match(source, /border:\s*1px solid/)
  assert.match(source, /\.action-btn\.danger:hover\s*\{/)
})

test('file manager synchronizes route connection and path atomically before loading on first activation', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /const hasInitializedRouteState = ref\(false\)/)
  assert.match(source, /const syncRouteState = \(\) => \{/)
  assert.match(source, /const nextConnectionId = actualConnectionId\.value/)
  assert.match(source, /const nextPath = route\.query\.path as string \| undefined/)
  assert.match(source, /const decodedPath = nextPath \? decodeURIComponent\(nextPath\) : '\/'/)
  assert.match(source, /currentConnectionId\.value = nextConnectionId/)
  assert.match(source, /currentPath\.value = decodedPath/)
  assert.match(
    source,
    /if \(!hasInitializedRouteState\.value\) \{[\s\S]*hasInitializedRouteState\.value = true[\s\S]*loadFiles\(\)/
  )
  assert.match(
    source,
    /\(\) => \[actualConnectionId\.value, route\.query\.path as string \| undefined\]/
  )
  assert.doesNotMatch(source, /syncRouteStateAndLoad/)
})

test('file manager writes the active directory back to route query so tab switches restore it', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /const router = useRouter\(\)/)
  assert.match(source, /const syncCurrentPathToRoute = \(\) => \{/)
  assert.match(source, /router\.replace\(\{/)
  assert.match(
    source,
    /query: \{[\s\S]*\.\.\.route\.query,[\s\S]*path: encodeURIComponent\(currentPath\.value\)/
  )
  assert.match(source, /syncCurrentPathToRoute\(\)/)
})

test('file manager keeps parent-row navigation aligned with the displayed file list path', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /const displayedPath = ref\('\/'\)/)
  assert.match(source, /displayedPath\.value = requestPath/)
  assert.match(
    source,
    /<div v-if="displayedPath !== '\/'" class="file-item parent-dir" @click="goBack">/
  )
  assert.match(source, /const basePath = displayedPath\.value/)
  assert.match(source, /const previousPath = displayedPath\.value/)
  assert.match(source, /const parts = displayedPath\.value\.split\('\/'\)\.filter\(p => p\)/)
})

test('file manager uses a cache-first file list strategy with background refresh', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /const fileListCache = new Map<string,/)
  assert.match(
    source,
    /const getFileListCacheKey = \(connectionId: string, remotePath: string\) =>/
  )
  assert.match(
    source,
    /const applyCachedFilesIfAvailable = \(connectionId: string, remotePath: string\) =>/
  )
  assert.match(source, /const cacheKey = getFileListCacheKey\(connectionId, requestPath\)/)
  assert.match(source, /applyCachedFilesIfAvailable\(connectionId, requestPath\)/)
  assert.match(
    source,
    /fileListCache\.set\(cacheKey, \{ files: result\.files, cachedAt: Date\.now\(\) \}\)/
  )
})

test('file manager invalidates cached directory listings after mutations', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /const invalidateFileListCache = \(remotePath: string\) =>/)
  assert.match(source, /invalidateFileListCache\(currentPath\.value\)/)
})

test('file deletion passes opaque listing identity instead of relying on display text', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /identity\?: string/)
  assert.match(source, /file\.type === 'directory',\s*file\.identity/)
  assert.match(source, /:key="file\.identity \|\| file\.name"/)
})

test('file manager merges drag entry data with dropped files so desktop multi-file drops do not lose paths', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /const seenDroppedFiles = new Set<string>\(\)/)
  assert.match(source, /await traverseEntry\(entry, '', files, directories, seenDroppedFiles\)/)
  assert.match(source, /const itemFile = item\.getAsFile\?\.\(\)/)
  assert.match(source, /appendBrowserDroppedFile\(itemFile, files, seenDroppedFiles\)/)
  assert.match(source, /const droppedFiles = Array\.from\(dataTransfer\.files \|\| \[\]\)/)
  assert.match(source, /appendDroppedFileInfo\(files, seenDroppedFiles, \{/)
  assert.match(source, /const fileKey = `\$\{file\.localPath\}::\$\{file\.relativePath\}`/)
})

test('file manager treats the current remote directory as already existing during drag uploads', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(
    source,
    /const remoteDirCache = new Set<string>\(\[normalizeRemotePath\(currentPath\.value\)\]\)/
  )
})

test('file manager resolves dropped file paths through preload API instead of relying on file.path', async () => {
  const source = await readFile(fileManagerViewPath, 'utf8')

  assert.match(source, /const getPathForFile = window\.electronAPI\?\.fs\?\.getPathForFile/)
  assert.match(source, /if \(typeof getPathForFile === 'function'\) \{/)
  assert.match(source, /try \{/)
  assert.match(source, /console\.warn\('\[拖拽收集\] preload getPathForFile 不可用:', error\)/)
  assert.match(source, /return \(file as any\)\.path as string \| undefined/)
})

test('preload exposes fs.getPathForFile for drag-and-drop file resolution', async () => {
  const source = await readFile(preloadPath, 'utf8')

  assert.match(source, /getPathForFile: \(file: File\) => webUtils\.getPathForFile\(file\)/)
})
