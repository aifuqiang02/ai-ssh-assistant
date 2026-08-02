import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const sshToolsPath = join(currentDir, 'ssh-tools.ts')

test('update_server_env_doc converts content updates into exact replacements for existing docs', async () => {
  const source = await readFile(sshToolsPath, 'utf8')

  assert.match(source, /force_replace:[\s\S]*?z[\s\S]*?\.preprocess\(/)
  assert.match(source, /if \(value === 'true'\) return true/)
  assert.match(source, /if \(value === 'false'\) return false/)
  assert.match(source, /return z\.boolean\(\)\.optional\(\)\.parse\(value\)/)
  assert.match(
    source,
    /const buildExactReplacement = \(currentContent: string, nextContent: string\) => \{/
  )
  assert.match(source, /const exactReplacement = buildExactReplacement\(existingContent, content\)/)
  assert.match(
    source,
    /await docStorageService\.editServerEnvDoc\([\s\S]*?exactReplacement\.oldString,[\s\S]*?exactReplacement\.newString[\s\S]*?\)/
  )
  assert.match(source, /if \(oldString\) \{/)
  assert.match(source, /if \(!looksLikeFullServerEnvDoc\(content\)\) \{/)
  assert.match(source, /content 仅适用于整篇环境文档更新/)
  assert.match(source, /const forceReplace = params\.force_replace === true/)
  assert.doesNotMatch(source, /拒绝整篇覆盖服务器环境文档/)
})

test('update_server_env_doc creates backup snapshot and removes unsafe full-document fallback', async () => {
  const source = await readFile(sshToolsPath, 'utf8')

  assert.match(source, /const createServerEnvBackup = async \(/)
  assert.match(source, /await createServerEnvBackup\(docId, existingContent, 'replace-document'\)/)
  assert.match(source, /await createServerEnvBackup\(docId, existingContent, 'exact-replace'\)/)
  assert.doesNotMatch(source, /精确替换失败，回退为整篇环境文档保存/)
})

test('update_server_env_doc description tells the model when to use exact replace and force_replace', async () => {
  const source = await readFile(sshToolsPath, 'utf8')

  assert.match(
    source,
    /Default to old_string\/new_string exact replacements for existing documents\./
  )
  assert.match(
    source,
    /Use content only when creating a new document or when the user explicitly requests a full rewrite\./
  )
  assert.match(
    source,
    /Only set force_replace=true after the user explicitly confirms a full-document overwrite\./
  )
})

test('SSH command failures are surfaced and env doc tools do not expose internal document IDs', async () => {
  const source = await readFile(sshToolsPath, 'utf8')

  assert.match(source, /if \(!result\.success\) \{\s*throw new Error\(result\.error/)
  assert.match(source, /ReadServerEnvDocTool[\s\S]*?parameters: z\.object\(\{\}\)/)
  assert.doesNotMatch(source, /__serverEnvDocId/)
})
