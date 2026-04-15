import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const treeNodePath = join(currentDir, 'SSHTreeNode.vue')

test('ssh tree node reuses one action menu for right click and more button', async () => {
  const source = await readFile(treeNodePath, 'utf8')

  assert.match(source, /@contextmenu\.prevent="openContextMenu"/)
  assert.match(source, /@click="toggleActionMenu\(\$event\)"/)
  assert.match(source, /@mouseenter="showActionMenu\(\$event\)"/)
  assert.match(source, /:style="actionDropdownStyle"/)
  assert.match(source, /const openContextMenu = \(event: MouseEvent\)/)
  assert.match(source, /const actionDropdownStyle = computed\(/)
  assert.match(source, /const actionMenuMode = ref<'hover' \| 'contextmenu' \| null>\(null\)/)
  assert.match(source, /if \(actionMenuMode\.value !== 'hover'\) \{/)
  assert.match(source, /document\.addEventListener\('click', handleOutsideClick, true\)/)
  assert.match(source, /const handleOutsideClick = \(event: MouseEvent\)/)
  assert.match(source, /if \(showActions\.value && actionMenuMode\.value === 'contextmenu'\) \{/)
  assert.match(
    source,
    /const toggleActionMenu = \(event\?: MouseEvent\) => \{[\s\S]*?if \(showActions\.value && actionMenuMode\.value === 'contextmenu'\) \{/
  )
  assert.match(
    source,
    /const showActionMenu = \(event\?: MouseEvent\) => \{[\s\S]*?if \(showActions\.value && actionMenuMode\.value === 'contextmenu'\) \{/
  )
  assert.match(source, /:class="\['tree-node-actions', \{ 'menu-visible': showActions \}\]"/)
  assert.match(source, /\.tree-node-actions\.menu-visible \{/)
})
