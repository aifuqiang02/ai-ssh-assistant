import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const treeNodePath = join(currentDir, 'SSHTreeNode.vue')
const sidebarPath = join(currentDir, '..', 'layout', 'AppSidebar.vue')

test('ssh connection click shows inline elapsed progress state while connecting', async () => {
  const [treeNodeSource, sidebarSource] = await Promise.all([
    readFile(treeNodePath, 'utf8'),
    readFile(sidebarPath, 'utf8')
  ])

  assert.match(sidebarSource, /:connecting-node-id="connectingNodeId"/)
  assert.match(sidebarSource, /:connecting-elapsed-seconds="connectingElapsedSeconds"/)
  assert.match(sidebarSource, /connectingNodeId\.value = node\.id/)
  assert.match(sidebarSource, /connectingElapsedSeconds\.value = 1/)
  assert.match(treeNodeSource, /连接中\s*\{\{\s*connectingElapsedSeconds\s*\}\}s/)
  assert.match(treeNodeSource, /tree-node-connection-status/)
})
