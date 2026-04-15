import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const chatViewPath = join(currentDir, 'AIChatOpenCodeStyle.vue')

test('chat input stays editable while generation is in progress', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.doesNotMatch(source, /:disabled="isGenerating"/)
  assert.match(source, /if \(!inputMessage\.value\.trim\(\) \|\| isGenerating\.value\) return/)
})

test('chat stop button shows stopping state and aborted tools render as cancelled', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /const isStopping = ref\(false\)/)
  assert.match(source, /aborted: 'Cancelled'/)
  assert.match(source, /oc-send-button oc-stop-button is-stopping/)
  assert.match(source, /:disabled="isStopping"/)
  assert.match(source, />Stopping\.\.\.</)
})

test('session status panel is collapsed by default', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /const sessionStatusExpanded = ref\(false\)/)
})

test('assistant display is built from ordered timeline blocks', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /blocks:\s*getOrderedBlocks\(msg\)/)
  assert.match(source, /v-for="block in msg\.blocks"/)
  assert.doesNotMatch(source, /!isThinkingContent\(msg\.content\)/)
  assert.doesNotMatch(source, /getResponseText\(msg\)/)
})

test('stream handler writes explicit analysis inquiry and summary semantics', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /appendAssistantTextBlock\(currentMsg, event\.delta\)/)
  assert.match(source, /event\.toolName === 'ask_followup_question'/)
  assert.match(
    source,
    /displayKind:\s*event\.toolName === 'ask_followup_question' \? 'inquiry' : 'tool'/
  )
  assert.match(source, /markLastAssistantTextBlockAsSummary\(currentMsg\)/)
})

test('inquiry and summary use response shell while tools stay in timeline', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /v-if="block\.type === 'analysis'"/)
  assert.match(source, /v-else-if="block\.type === 'tool' && block\.toolPart"/)
  assert.match(
    source,
    /v-else-if="\(block\.type === 'inquiry' \|\| block\.type === 'summary'\) && block\.text"/
  )
  assert.match(source, /block\.type === 'inquiry' \? '询问' : '总结'/)
  assert.match(source, /copyResponse\(block\.text\)/)
})

test('active SSH chat system prompt forbids interactive shell commands', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /SSH command execution rules:/)
  assert.match(source, /All SSH commands must be non-interactive and one-shot\./)
  assert.match(
    source,
    /Never run interactive programs like vim, nano, less, more, top, htop, watch, mysql, psql, or ssh\./
  )
  assert.match(
    source,
    /Never run commands that wait indefinitely for input or stream forever, such as tail -f, journalctl -f, docker logs -f, or read\./
  )
  assert.match(
    source,
    /Use non-interactive flags whenever available \(for example: --no-pager, -n, --yes, --batch, --non-interactive\)\./
  )
  assert.match(
    source,
    /If a task cannot be completed safely in non-interactive mode, ask the user before proceeding instead of executing the command\./
  )
})

test('active SSH chat system prompt explains how to update env docs without force_replace errors', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(
    source,
    /When updating the server environment document, default to old_string\/new_string exact replacements\./
  )
  assert.match(
    source,
    /Do not replace the entire document with content unless the user clearly asked for a full rewrite\./
  )
  assert.match(
    source,
    /Only use force_replace=true after the user explicitly confirms a full-document overwrite\./
  )
})

test('official model errors are normalized into member and quota friendly messages', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /请开通 AI 会员后使用官方模型/)
  assert.match(source, /本月官方模型次数已用完/)
  assert.match(source, /官方模型不存在/)
  assert.match(source, /官方模型暂不可用/)
  assert.match(source, /官方模型暂时不可用，请稍后再试/)
})

test('assistant turns with tool activity stay expanded while tools are running', async () => {
  const source = await readFile(chatViewPath, 'utf8')

  assert.match(source, /const hasRunningTool = msg\.blocks\.some\(/)
  assert.match(source, /block\.type === 'tool' && block\.toolPart\?\.state\.status === 'running'/)
  assert.match(source, /if \(hasRunningTool\) \{\s*return false\s*\}/)
})
