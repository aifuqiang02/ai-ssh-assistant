<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import stripAnsi from 'strip-ansi'
import { settingsService } from '@/services/settings.service'
import { sshService, type SSHConnection } from '@/services/ssh.service'
import { docStorageService } from '@/services/doc-storage.service'
import { SSH_TOOLS } from '@/services/tools/ssh-tools'
import {
  Message as V2Message,
  createUserMessage,
  createAssistantMessage,
  type ToolPart,
  type TextPart
} from '@/services/messages/message'
import {
  toModelMessages,
  fromUserMessage,
  filterValidMessages,
  filterCompactedMessages,
  compactMessages,
  updateToolResult
} from '@/services/messages/convert'
import { SessionProcessor, type StreamEvent } from '@/services/processor'
import type { AIProvider, AIModel } from '@/types/ai-providers'

const props = defineProps<{
  currentProvider: AIProvider | null
  currentModel: AIModel | null
  connectionId?: string
  sessionId?: string
  serverEnvDocId?: string
  showServerEnvButton?: boolean
}>()

const emit = defineEmits<{
  openServerEnvDoc: []
}>()

const PLACEHOLDERS = [
  'What would you like to do?',
  'Execute a shell command',
  'Read a file',
  'List directory contents',
  'Deploy your application',
  'Check system status'
]

const inputMessage = ref('')
const isGenerating = ref(false)
const isStopping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const messages = ref<V2Message[]>([])
const error = ref<any>(null)
const abortController = ref<AbortController | null>(null)
const expandedTools = ref<Set<string>>(new Set())
const expandedTurns = ref<Set<string>>(new Set())
const visibleCount = ref(5)
const loadMoreRef = ref<HTMLElement | null>(null)
const isLoadingMore = ref(false)
const copiedId = ref<string | null>(null)
const responseCopied = ref(false)
const currentStatus = ref('')
const currentStage = ref<
  'idle' | 'preparing' | 'thinking' | 'executing' | 'complete' | 'error' | 'stopped'
>('idle')
const sessionStatusExpanded = ref(false)
const sessionDuration = ref('')
const performanceMetrics = ref<SessionPerformanceMetrics>({
  prepMs: null,
  firstResponseMs: null,
  totalMs: null,
  toolCalls: 0,
  compactionLimit: null,
  contextCompacted: false
})
const cachedConnection = ref<SSHConnection | null>(null)
const cachedServerEnvDoc = ref<string | null>(null)
const cacheLoading = ref(false)
const sessionContextStats = ref<SessionContextStats>({
  connectionSource: 'unknown',
  envDocSource: 'unknown',
  lastRefreshedAt: null
})
const stopRequested = ref(false)
const interruptionState = ref<InterruptionState | null>(null)
const durationInterval = ref<number | null>(null)
const sessionStartTime = ref<number | null>(null)
const placeholderIndex = ref(0)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const serverEnvMenuOpen = ref(false)
const serverEnvMenuRef = ref<HTMLElement | null>(null)

const INPUT_MIN_HEIGHT = 48
const INPUT_MAX_HEIGHT = 104

interface TodoItem {
  id: string
  content: string
  status: 'pending' | 'completed'
  activeForm?: string
}

interface DiffItem {
  file: string
  before?: string
  after?: string
  changes?: number
}

interface DisplayMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  blocks: DisplayBlock[]
  finish?: string
  timestamp: number
  summary?: string
  modelInfo?: { providerID: string; modelID: string }
}

type DisplayBlock =
  | {
      id: string
      type: 'analysis'
      text: string
      compact: boolean
    }
  | {
      id: string
      type: 'inquiry' | 'summary'
      text: string
    }
  | {
      id: string
      type: 'tool'
      toolPart: ToolPart
    }
  | {
      id: string
      type: 'todos'
      todos: TodoItem[]
    }
  | {
      id: string
      type: 'diffs'
      diffs: DiffItem[]
    }

interface SessionPerformanceMetrics {
  prepMs: number | null
  firstResponseMs: number | null
  totalMs: number | null
  toolCalls: number
  compactionLimit: number | null
  contextCompacted: boolean
}

interface SessionContextStats {
  connectionSource: 'cache' | 'fresh' | 'missing' | 'unknown'
  envDocSource: 'cache' | 'fresh' | 'missing' | 'unknown'
  lastRefreshedAt: number | null
}

interface InterruptionState {
  reason: string
  completedTools: number
  lastTool: string
  partialResponse: string
  canResume: boolean
}

const displayMessages = computed<DisplayMessage[]>(() => {
  const filtered = messages.value.filter(
    msg => msg.info.role === 'user' || msg.info.role === 'assistant'
  )
  const visible = Math.min(filtered.length, visibleCount.value)
  const sliced = filtered.slice(-visible)
  const mapped = sliced.map(msg => ({
    id: msg.info.id,
    role: msg.info.role as 'user' | 'assistant',
    content: getContent(msg),
    blocks: getOrderedBlocks(msg),
    finish: msg.info.finish,
    timestamp: msg.info.createdAt,
    summary: (msg.info as any).summary,
    modelInfo: (msg.info as any).model
  }))
  return mapped
})

const currentConnectionDisplay = computed(() => {
  const connection = cachedConnection.value
  const connectionConfig = connection?.config

  const name = connectionConfig?.name || (connection as any)?.name || '当前主机'
  const host = connectionConfig?.host || (connection as any)?.host || 'unknown-host'
  const port = connectionConfig?.port || (connection as any)?.port || 22
  const username = connectionConfig?.username || (connection as any)?.username || 'unknown-user'
  const id = connection?.id || props.connectionId || ''
  const shortId = id ? id.slice(0, 8) : ''

  return {
    name,
    host,
    port,
    username,
    id,
    shortId
  }
})

const sessionSteps = computed(() => {
  const stageOrder: Array<typeof currentStage.value> = [
    'preparing',
    'thinking',
    'executing',
    'complete'
  ]
  const currentIndex =
    currentStage.value === 'error' || currentStage.value === 'stopped'
      ? 2
      : Math.max(stageOrder.indexOf(currentStage.value), 0)

  return [
    {
      key: 'preparing',
      label: '准备上下文',
      active: currentStage.value === 'preparing',
      done: currentIndex > 0
    },
    {
      key: 'thinking',
      label: '分析请求',
      active: currentStage.value === 'thinking',
      done: currentIndex > 1
    },
    {
      key: 'executing',
      label: '执行操作',
      active: currentStage.value === 'executing',
      done: currentIndex > 2 || currentStage.value === 'complete'
    },
    {
      key: 'complete',
      label: '完成',
      active: currentStage.value === 'complete',
      done: currentStage.value === 'complete'
    }
  ]
})

const performanceBadges = computed(() => {
  const metrics = performanceMetrics.value
  const badges: string[] = []

  if (metrics.prepMs !== null) badges.push(`准备 ${metrics.prepMs}ms`)
  if (metrics.firstResponseMs !== null) badges.push(`首响应 ${metrics.firstResponseMs}ms`)
  if (metrics.totalMs !== null) badges.push(`总耗时 ${metrics.totalMs}ms`)
  badges.push(`工具 ${metrics.toolCalls} 次`)
  if (metrics.compactionLimit !== null) {
    badges.push(
      metrics.contextCompacted
        ? `上下文压缩到最近 ${metrics.compactionLimit} 条`
        : `上下文保留最近 ${metrics.compactionLimit} 条`
    )
  }

  return badges
})

const performanceInsight = computed(() => {
  const metrics = performanceMetrics.value

  if (metrics.totalMs !== null && metrics.totalMs >= 8000) {
    if (metrics.toolCalls >= 3) {
      return '这次请求较慢，主要因为发生了多次工具往返。'
    }
    if ((metrics.prepMs || 0) >= 1500) {
      return '这次请求较慢，准备上下文占用了较多时间。'
    }
    if ((metrics.firstResponseMs || 0) >= 2500) {
      return '这次请求较慢，模型首个响应返回得比较晚。'
    }
    return '这次请求整体偏慢，系统已记录关键耗时供后续优化。'
  }

  if (metrics.toolCalls >= 3) {
    return '本轮请求包含多次工具调用，回答会更完整，但耗时通常也会更长一些。'
  }

  if (metrics.contextCompacted) {
    return '会话较长时已自动压缩历史上下文，以保持响应更稳定。'
  }

  return ''
})

const latestToolParts = computed(() => {
  for (let i = messages.value.length - 1; i >= 0; i -= 1) {
    const msg = messages.value[i]
    if (msg.info.role === 'assistant') {
      const toolParts = getToolParts(msg)
      if (toolParts.length > 0) {
        return toolParts
      }
    }
  }
  return [] as ToolPart[]
})

const debugFacts = computed(() => {
  const facts: Array<{ label: string; value: string }> = []
  const providerName = props.currentProvider?.name || props.currentProvider?.id || '未选择'
  const modelName = props.currentModel?.name || props.currentModel?.id || '未选择'

  facts.push({ label: '模型', value: `${providerName} / ${modelName}` })
  facts.push({
    label: '连接上下文',
    value:
      sessionContextStats.value.connectionSource === 'cache'
        ? '命中缓存'
        : sessionContextStats.value.connectionSource === 'fresh'
          ? '实时读取'
          : sessionContextStats.value.connectionSource === 'missing'
            ? '缺失'
            : '未知'
  })
  facts.push({
    label: '环境文档',
    value:
      sessionContextStats.value.envDocSource === 'cache'
        ? '命中缓存'
        : sessionContextStats.value.envDocSource === 'fresh'
          ? '实时读取'
          : sessionContextStats.value.envDocSource === 'missing'
            ? '缺失'
            : '未知'
  })

  if (performanceMetrics.value.compactionLimit !== null) {
    facts.push({
      label: '上下文策略',
      value: performanceMetrics.value.contextCompacted
        ? `压缩到最近 ${performanceMetrics.value.compactionLimit} 条`
        : `保留最近 ${performanceMetrics.value.compactionLimit} 条`
    })
  }

  if (sessionContextStats.value.lastRefreshedAt) {
    facts.push({
      label: '上下文时间',
      value: formatTime(sessionContextStats.value.lastRefreshedAt)
    })
  }

  return facts
})

const debugToolChain = computed(() => {
  return latestToolParts.value.slice(-6).map(part => ({
    id: part.callID,
    label: part.tool,
    status: part.state.status || 'unknown'
  }))
})

watch(displayMessages, () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})

onMounted(() => {
  nextTick(() => {
    resizeInputHeight()
  })

  setupInfiniteScroll()
  startDurationTimer()
  startPlaceholderRotation()
  document.addEventListener('pointerdown', handlePointerDownOutsideMenu)
  void refreshSessionContext()
})

onUnmounted(() => {
  stopDurationTimer()
  stopPlaceholderRotation()
  document.removeEventListener('pointerdown', handlePointerDownOutsideMenu)
})

watch(
  () => [props.connectionId, props.serverEnvDocId],
  () => {
    cachedConnection.value = null
    cachedServerEnvDoc.value = null
    void refreshSessionContext(true)
  }
)

watch(inputMessage, () => {
  nextTick(() => {
    resizeInputHeight()
  })
})

function startPlaceholderRotation() {
  setInterval(() => {
    placeholderIndex.value = (placeholderIndex.value + 1) % PLACEHOLDERS.length
  }, 4000)
}

function stopPlaceholderRotation() {
  // Timer will be cleaned up by Vue
}

function startDurationTimer() {
  sessionStartTime.value = Date.now()
  durationInterval.value = window.setInterval(() => {
    if (sessionStartTime.value) {
      const elapsed = Date.now() - sessionStartTime.value
      const seconds = Math.floor(elapsed / 1000)
      if (seconds < 60) {
        sessionDuration.value = `${seconds}s`
      } else {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        sessionDuration.value = `${mins}m ${secs}s`
      }
    }
  }, 1000)
}

function stopDurationTimer() {
  if (durationInterval.value) {
    clearInterval(durationInterval.value)
  }
}

function setupInfiniteScroll() {
  const observer = new IntersectionObserver(
    entries => {
      if (
        entries[0].isIntersecting &&
        visibleCount.value <
          messages.value.filter(m => m.info.role === 'user' || m.info.role === 'assistant').length
      ) {
        isLoadingMore.value = true
        setTimeout(() => {
          visibleCount.value += 5
          isLoadingMore.value = false
        }, 500)
      }
    },
    { threshold: 0.1 }
  )

  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
}

function extractTodos(part: ToolPart): TodoItem[] {
  if (part.tool !== 'todowrite' || part.state.status !== 'completed' || !part.state.output) {
    return []
  }

  try {
    const output = JSON.parse(part.state.output)
    if (!output.todos || !Array.isArray(output.todos)) return []

    return output.todos.map((t: any) => ({
      id: t.id || Math.random().toString(36).substr(2, 9),
      content: t.content,
      status: t.status || 'pending',
      activeForm: t.activeForm
    }))
  } catch {
    return []
  }
}

function extractDiffs(part: ToolPart): DiffItem[] {
  if (part.tool !== 'edit' || part.state.status !== 'completed' || !part.state.metadata?.filediff) {
    return []
  }

  const fd = part.state.metadata.filediff
  return [
    {
      file: fd.file || part.state.input?.path || 'Unknown',
      before: fd.before,
      after: fd.after,
      changes: fd.changes
    }
  ]
}

function appendAssistantTextBlock(msg: V2Message, delta: string) {
  const lastPart = msg.parts[msg.parts.length - 1]
  if (lastPart?.type === 'text' && (lastPart.kind || 'analysis') !== 'summary') {
    lastPart.text += delta
    return
  }

  msg.parts.push({ type: 'text', text: delta, kind: 'analysis' })
}

function markLastAssistantTextBlockAsSummary(msg: V2Message | null) {
  if (!msg) return

  for (let i = msg.parts.length - 1; i >= 0; i -= 1) {
    const part = msg.parts[i]
    if (part.type === 'text' && part.text.trim()) {
      part.kind = 'summary'
      return
    }

    if (part.type === 'tool') {
      return
    }
  }
}

async function sendMessageWithTools(content: string) {
  const requestStartedAt = Date.now()
  let firstResponseRecorded = false
  let performanceLogged = false
  let slowThinkingTimer: number | null = null
  let slowExecutionTimer: number | null = null

  if (!props.currentProvider || !props.currentModel) {
    throw new Error('未选择 AI 提供商或模型')
  }
  if (!props.connectionId) {
    throw new Error('未建立 SSH 连接')
  }

  isGenerating.value = true
  error.value = null
  abortController.value = new AbortController()
  stopRequested.value = false
  interruptionState.value = null
  sessionStartTime.value = Date.now()
  performanceMetrics.value = {
    prepMs: null,
    firstResponseMs: null,
    totalMs: null,
    toolCalls: 0,
    compactionLimit: null,
    contextCompacted: false
  }
  setStatus('preparing', '正在准备当前主机的上下文')

  try {
    slowThinkingTimer = window.setTimeout(() => {
      if (
        isGenerating.value &&
        currentStage.value === 'preparing' &&
        performanceMetrics.value.firstResponseMs === null
      ) {
        setStatus('preparing', '正在读取上下文和环境文档，这一步稍慢一些')
      }
    }, 1200)

    if (props.currentProvider?.id !== 'official') {
      const settings = await settingsService.getSettings()
      const providerConfig = (settings?.aiProviders || []).find(
        (p: any) => p.id === props.currentProvider?.id
      )
      if (!providerConfig?.apiKey) throw new Error('未找到 API 密钥配置')
    }

    const userMsg = fromUserMessage(content)
    messages.value.push(userMsg)

    await nextTick()
    scrollToBottom()

    const serverEnvDocId = props.serverEnvDocId || props.connectionId || ''
    await refreshSessionContext()
    const currentConnection = cachedConnection.value
    const serverEnvDoc = cachedServerEnvDoc.value
    setStatus('thinking', '正在分析你的请求')

    const validMessages = filterValidMessages(messages.value)
    // 过滤已压缩的消息（避免重复发送给 LLM）
    const uncompactedMessages = filterCompactedMessages(validMessages)
    const adaptiveCompactionLimit = getAdaptiveCompactionLimit(uncompactedMessages)
    performanceMetrics.value.compactionLimit = adaptiveCompactionLimit
    performanceMetrics.value.contextCompacted = adaptiveCompactionLimit < 20
    if (adaptiveCompactionLimit < 20) {
      setStatus('thinking', '当前会话较长，正在压缩历史上下文')
    }
    // 如果消息太多，自动压缩旧消息
    const compactedMessages = compactMessages(uncompactedMessages, adaptiveCompactionLimit)
    const modelMessages = [
      {
        role: 'system' as const,
        content: buildSystemPrompt(currentConnection, serverEnvDoc, serverEnvDocId)
      },
      ...toModelMessages(compactedMessages)
    ]
    performanceMetrics.value.prepMs = Date.now() - requestStartedAt

    let currentMsg: V2Message | null = null

    const processor = new SessionProcessor(
      {
        messages: modelMessages,
        tools: SSH_TOOLS,
        provider: props.currentProvider!,
        model: props.currentModel!,
        connectionId: props.connectionId,
        serverEnvDocId,
        abortSignal: abortController.value?.signal,
        onEvent: event => {
          switch (event.type) {
            case 'start':
              setStatus('thinking', '正在分析你的请求')
              break

            case 'text-delta':
              if (!firstResponseRecorded) {
                performanceMetrics.value.firstResponseMs = Date.now() - requestStartedAt
                firstResponseRecorded = true
                if (slowThinkingTimer) {
                  clearTimeout(slowThinkingTimer)
                  slowThinkingTimer = null
                }
                slowExecutionTimer = window.setTimeout(() => {
                  if (
                    isGenerating.value &&
                    currentStage.value === 'thinking' &&
                    performanceMetrics.value.toolCalls === 0
                  ) {
                    setStatus('thinking', '模型正在整理较长的回答，请稍候')
                  }
                }, 2500)
              }
              if (!currentMsg) {
                currentMsg = createAssistantMessage(
                  `msg_${Date.now()}`,
                  userMsg.info.id,
                  props.sessionId,
                  'ssh-agent'
                )
                messages.value.push(currentMsg)
              }
              appendAssistantTextBlock(currentMsg, event.delta)
              const activeMsg = currentMsg
              const msgIdx = messages.value.findIndex(m => m.info.id === activeMsg.info.id)
              if (msgIdx !== -1) {
                messages.value = messages.value
                  .slice(0, msgIdx)
                  .concat([activeMsg], messages.value.slice(msgIdx + 1))
              }
              updateStatus()
              scrollToBottom()
              break

            case 'tool-call':
              if (!firstResponseRecorded) {
                performanceMetrics.value.firstResponseMs = Date.now() - requestStartedAt
                firstResponseRecorded = true
                if (slowThinkingTimer) {
                  clearTimeout(slowThinkingTimer)
                  slowThinkingTimer = null
                }
              }
              if (slowExecutionTimer) {
                clearTimeout(slowExecutionTimer)
              }
              performanceMetrics.value.toolCalls += 1
              slowExecutionTimer = window.setTimeout(() => {
                if (
                  isGenerating.value &&
                  currentStage.value === 'executing' &&
                  performanceMetrics.value.toolCalls > 0
                ) {
                  setStatus(
                    'executing',
                    `正在串行执行 ${performanceMetrics.value.toolCalls} 个工具步骤，请稍候`
                  )
                }
              }, 2500)
              if (!currentMsg) {
                currentMsg = createAssistantMessage(
                  `msg_${Date.now()}`,
                  userMsg.info.id,
                  props.sessionId,
                  'ssh-agent'
                )
                messages.value.push(currentMsg)
              }
              // 检查是否已存在相同的 tool call
              const existingToolPart = currentMsg.parts.find(
                (p): p is ToolPart => p.type === 'tool' && p.callID === event.toolCallId
              )
              if (existingToolPart) {
                break
              }
              const tp: ToolPart = {
                type: 'tool',
                tool: event.toolName,
                callID: event.toolCallId,
                displayKind: event.toolName === 'ask_followup_question' ? 'inquiry' : 'tool',
                state: { status: 'running', input: event.input, time: { start: Date.now() } }
              }
              currentMsg.parts.push(tp)
              if (event.toolName === 'ask_followup_question') {
                setStatus('thinking', '正在等待你的补充信息')
              } else {
                setStatus('executing', getStatusDescription(tp))
              }
              messages.value = [...messages.value]
              scrollToBottom()
              break

            case 'tool-result':
              if (!currentMsg) break
              const completed = updateToolResult(currentMsg, event.toolCallId, {
                output: event.output.output
              })
              const idx = messages.value.findIndex(m => m.info.id === completed.info.id)
              if (idx !== -1) messages.value[idx] = completed
              currentMsg = completed
              if (event.output.output.includes('已更新文档内容')) {
                void refreshSessionContext(true)
              }
              messages.value = [...messages.value]
              scrollToBottom()
              break

            case 'tool-error':
              if (!currentMsg) break
              const toolWasAborted =
                stopRequested.value ||
                String(event.error || '')
                  .toLowerCase()
                  .includes('aborted')
              const friendlyToolError = normalizeUserErrorMessage(event.error)
              const errPart = currentMsg.parts.find(
                p => p.type === 'tool' && p.callID === event.toolCallId
              ) as ToolPart | undefined
              if (errPart) {
                errPart.state = {
                  ...errPart.state,
                  status: toolWasAborted ? 'aborted' : 'error',
                  error: toolWasAborted ? 'Command aborted' : friendlyToolError,
                  time: { start: errPart.state.time?.start || Date.now(), end: Date.now() }
                }
              }
              if (!toolWasAborted) {
                setStatus('error', friendlyToolError)
              }
              messages.value = [...messages.value]
              break

            case 'done':
              if (currentMsg) {
                if (event.finish === 'stop') {
                  markLastAssistantTextBlockAsSummary(currentMsg)
                }
                currentMsg.info.finish = event.finish
                messages.value = [...messages.value]
              }
              if (event.finish === 'stop') {
                performanceMetrics.value.totalMs = Date.now() - requestStartedAt
                if (!performanceLogged) {
                  logPerformanceSummary('success')
                  performanceLogged = true
                }
              }
              if (event.finish === 'stop') {
                setStatus('complete', '已完成这次请求')
              } else {
                setStatus('thinking', '正在继续处理下一步')
              }
              updateStatus()
              break

            case 'error':
              console.error('[AIChatOpenCode] 错误:', event.error)
              if (
                stopRequested.value ||
                event.error.name === 'AbortError' ||
                String(event.error.message || '')
                  .toLowerCase()
                  .includes('aborted')
              ) {
                setStatus('stopped', '正在停止本次请求并保留当前进度')
              } else {
                setStatus('error', normalizeUserErrorMessage(event.error.message))
              }
              break
          }
        },
        onToolExecute: async (toolName, input) => {
          const tool = SSH_TOOLS.find(t => t.id === toolName)
          if (!tool) throw new Error(`Unknown tool: ${toolName}`)
          const info = await tool.init()
          return await info.execute(input, {
            sessionID: props.sessionId || '',
            messageID: '',
            agent: 'ssh-agent',
            abort: abortController.value?.signal || new AbortController().signal,
            metadata: () => ({}),
            extra: {
              connectionId: props.connectionId,
              serverEnvDocId: props.serverEnvDocId || ''
            }
          })
        }
      },
      () => {}
    )

    await processor.process()
  } catch (err: any) {
    const wasAborted =
      stopRequested.value ||
      err?.name === 'AbortError' ||
      String(err?.message || '')
        .toLowerCase()
        .includes('aborted')

    if (wasAborted) {
      error.value = null
      performanceMetrics.value.totalMs = Date.now() - requestStartedAt
      captureInterruptionState('本次请求已停止，当前进度已保留')
      setStatus('stopped', '已停止本次请求，可直接继续后续步骤')
      if (!performanceLogged) {
        logPerformanceSummary('aborted')
        performanceLogged = true
      }
      return
    }

    console.error('[AIChatOpenCode] 错误:', err)
    error.value = err
    performanceMetrics.value.totalMs = Date.now() - requestStartedAt
    setStatus('error', normalizeUserErrorMessage(err?.message || '执行失败'))
    if (!performanceLogged) {
      logPerformanceSummary(err?.name === 'AbortError' ? 'aborted' : 'error')
      performanceLogged = true
    }
    throw err
  } finally {
    isGenerating.value = false
    isStopping.value = false
    abortController.value = null
    if (slowThinkingTimer) clearTimeout(slowThinkingTimer)
    if (slowExecutionTimer) clearTimeout(slowExecutionTimer)
    if (performanceMetrics.value.totalMs === null) {
      performanceMetrics.value.totalMs = Date.now() - requestStartedAt
    }
    if (!performanceLogged) {
      logPerformanceSummary('aborted')
      performanceLogged = true
    }
  }
}

function updateStatus() {
  if (
    currentStage.value === 'complete' ||
    currentStage.value === 'stopped' ||
    currentStage.value === 'error'
  ) {
    return
  }

  const lastMsg = messages.value[messages.value.length - 1]
  if (lastMsg && lastMsg.info.role === 'assistant') {
    const toolParts = getToolParts(lastMsg)
    const lastTool = toolParts[toolParts.length - 1]
    if (lastTool) {
      setStatus('executing', getStatusDescription(lastTool))
    } else if (lastMsg.parts.some(p => p.type === 'text')) {
      setStatus('thinking', '正在整理回答内容')
    }
  }
}

function getStatusDescription(part: ToolPart): string {
  const input = part.state.input || {}

  if (part.tool === 'execute_ssh_command' || part.tool === 'bash') {
    const command = input.command || input.description || ''
    if (command) {
      const preview = command.length > 60 ? command.substring(0, 60) + '...' : command
      return `正在这台主机上执行命令: ${preview}`
    }
    return '正在这台主机上执行命令'
  }

  if (part.tool === 'read_server_env_doc') {
    return '正在读取当前主机的环境文档'
  }

  if (part.tool === 'update_server_env_doc') {
    return input.content ? '正在更新当前主机的环境文档' : '正在按当前文档内容做精确更新'
  }

  const descriptions: Record<string, string> = {
    read_file: '正在读取服务器文件',
    read: '正在读取服务器文件',
    list_files: '正在查看目录内容',
    list: '正在查看目录内容',
    edit: '正在整理修改内容',
    write: '正在写入文件',
    glob: '正在搜索相关文件',
    grep: '正在搜索相关内容',
    webfetch: '正在查询网络信息',
    task: '正在拆解任务步骤',
    todowrite: '正在整理下一步计划',
    todoread: '正在读取当前计划'
  }
  return descriptions[part.tool] || '正在处理中'
}

function setStatus(
  stage: 'idle' | 'preparing' | 'thinking' | 'executing' | 'complete' | 'error' | 'stopped',
  message: string
) {
  currentStage.value = stage
  currentStatus.value = message
}

function toggleSessionStatusExpanded() {
  sessionStatusExpanded.value = !sessionStatusExpanded.value
}

function summarizePartialResponse(): string {
  for (let i = messages.value.length - 1; i >= 0; i -= 1) {
    const msg = messages.value[i]
    if (msg.info.role !== 'assistant') continue

    const text = getContent(msg).trim()
    if (!text) continue
    return text.length > 120 ? `${text.slice(0, 120)}...` : text
  }

  return ''
}

function captureInterruptionState(reason: string) {
  const toolParts = latestToolParts.value
  const completedTools = toolParts.filter(part => part.state.status === 'completed').length
  const lastTool = toolParts[toolParts.length - 1]?.tool || '尚未执行工具'

  interruptionState.value = {
    reason,
    completedTools,
    lastTool,
    partialResponse: summarizePartialResponse(),
    canResume: true
  }
}

function logPerformanceSummary(result: 'success' | 'error' | 'aborted') {
  void result
}

async function refreshSessionContext(force = false) {
  if (cacheLoading.value) return

  const connectionId = props.connectionId
  const serverEnvDocId = props.serverEnvDocId || connectionId || ''

  if (!connectionId) {
    cachedConnection.value = null
    cachedServerEnvDoc.value = null
    return
  }

  if (!force && cachedConnection.value && cachedServerEnvDoc.value !== null) {
    sessionContextStats.value = {
      connectionSource: 'cache',
      envDocSource: 'cache',
      lastRefreshedAt: Date.now()
    }
    return
  }

  cacheLoading.value = true

  try {
    const [connections, serverEnvDoc] = await Promise.all([
      sshService.getConnections().catch(error => {
        console.warn('[AIChat] 获取 SSH 连接信息失败:', error)
        return [] as SSHConnection[]
      }),
      serverEnvDocId
        ? docStorageService.readServerEnvDoc(serverEnvDocId).catch(error => {
            console.warn('[AIChat] 读取服务器环境文档失败:', error)
            return null
          })
        : Promise.resolve(null)
    ])

    cachedConnection.value = connections.find(connection => connection.id === connectionId) || null
    cachedServerEnvDoc.value = serverEnvDoc?.content || null
    sessionContextStats.value = {
      connectionSource: cachedConnection.value ? 'fresh' : 'missing',
      envDocSource: serverEnvDoc?.content ? 'fresh' : 'missing',
      lastRefreshedAt: Date.now()
    }
  } finally {
    cacheLoading.value = false
  }
}

function summarizeServerEnvDoc(serverEnvDoc: string | null): string {
  if (!serverEnvDoc) {
    return 'Current server environment document for this connection does not exist yet.'
  }

  const normalized = serverEnvDoc.trim()
  if (normalized.length <= 2400) {
    return `Current server environment document for this connection:\n\n${normalized}`
  }

  const lines = normalized.split(/\r?\n/)
  const headings = lines.filter(line => /^(#|##|###)\s+/.test(line)).slice(0, 12)
  const head = lines.slice(0, 40).join('\n')
  const tail = lines.slice(-25).join('\n')

  const sections = [
    'Current server environment document for this connection (summarized to reduce prompt size):',
    '',
    'Document outline:',
    headings.length > 0 ? headings.join('\n') : '(no headings detected)',
    '',
    'Document beginning:',
    head,
    '',
    'Recent document tail:',
    tail
  ]

  return sections.join('\n')
}

function buildSystemPrompt(
  connection: SSHConnection | null,
  serverEnvDoc: string | null,
  serverEnvDocId: string
): string {
  const connectionConfig = connection?.config
  const connectionName = connectionConfig?.name || (connection as any)?.name || '(unnamed)'
  const connectionHost = connectionConfig?.host || (connection as any)?.host || 'unknown-host'
  const connectionPort = connectionConfig?.port || (connection as any)?.port || 'unknown-port'
  const connectionUsername =
    connectionConfig?.username || (connection as any)?.username || 'unknown-user'

  const connectionSummary = connection
    ? [
        `Current SSH connection ID: ${connection.id}`,
        `Connection name: ${connectionName}`,
        `Host: ${connectionHost}`,
        `Port: ${connectionPort}`,
        `Username: ${connectionUsername}`
      ].join('\n')
    : `Current SSH connection ID: ${serverEnvDocId || 'unknown'}`

  const rules = [
    'When handling server environment documentation, always use the dedicated tools read_server_env_doc and update_server_env_doc.',
    'Always call read_server_env_doc before modifying the environment document unless you are creating or replacing the entire document with update_server_env_doc content.',
    'When updating the server environment document, default to old_string/new_string exact replacements.',
    'Do not replace the entire document with content unless the user clearly asked for a full rewrite.',
    'Only use force_replace=true after the user explicitly confirms a full-document overwrite.',
    'Never create or update generic markdown files such as server_env.md, server-env-doc.md, env.md, or similar names for server environment notes.',
    "The environment document belongs only to the current SSH connection. Never merge or reuse another host's document.",
    '',
    'SSH command execution rules:',
    'All SSH commands must be non-interactive and one-shot.',
    'Never run interactive programs like vim, nano, less, more, top, htop, watch, mysql, psql, or ssh.',
    'Never run commands that wait indefinitely for input or stream forever, such as tail -f, journalctl -f, docker logs -f, or read.',
    'Never rely on the user sending Ctrl+C or replying to command prompts to finish a command.',
    'Use non-interactive flags whenever available (for example: --no-pager, -n, --yes, --batch, --non-interactive).',
    'Explicitly limit output for commands that can produce large results.',
    'If a task cannot be completed safely in non-interactive mode, ask the user before proceeding instead of executing the command.'
  ].join('\n')

  const envDocSection = summarizeServerEnvDoc(serverEnvDoc)

  return [
    'You are an SSH assistant using structured tool calls.',
    connectionSummary,
    '',
    'Server environment documentation rules:',
    rules,
    '',
    envDocSection
  ].join('\n')
}

async function handleSendMessage() {
  if (!inputMessage.value.trim() || isGenerating.value) return
  const content = inputMessage.value.trim()
  inputMessage.value = ''
  try {
    await sendMessageWithTools(content)
  } catch (e: any) {
    void e
  }
  nextTick(() => {
    resizeInputHeight()
    inputRef.value?.focus()
  })
}

function handleInputKeydown(event: KeyboardEvent) {
  if (
    event.key === 'Enter' &&
    !event.shiftKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    event.preventDefault()
    void handleSendMessage()
  }
}

function resizeInputHeight() {
  const input = inputRef.value
  if (!input) return

  input.style.height = 'auto'
  const targetHeight = Math.min(Math.max(input.scrollHeight, INPUT_MIN_HEIGHT), INPUT_MAX_HEIGHT)
  input.style.height = `${targetHeight}px`
  input.style.overflowY = input.scrollHeight > INPUT_MAX_HEIGHT ? 'auto' : 'hidden'
}

function openServerEnvMenu() {
  serverEnvMenuOpen.value = true
}

function closeServerEnvMenu() {
  serverEnvMenuOpen.value = false
}

function openServerEnvDoc() {
  serverEnvMenuOpen.value = false
  emit('openServerEnvDoc')
}

function prepareServerEnvUpdatePrompt() {
  const prompt = '请更新当前主机的环境文档，补充或修正以下内容：\n'
  const current = inputMessage.value.trim()
  inputMessage.value = current.startsWith(prompt.trim())
    ? current
    : current
      ? `${prompt}${current}`
      : prompt
  serverEnvMenuOpen.value = false

  nextTick(() => {
    const input = inputRef.value
    if (!input) return
    input.focus()
    const cursor = input.value.length
    input.setSelectionRange(cursor, cursor)
  })
}

function handleStop() {
  if (abortController.value) {
    isStopping.value = true
    stopRequested.value = true
    abortController.value.abort()
    abortController.value = null
  }
  setStatus('stopped', '正在停止本次请求并保留当前进度')
}

function handlePointerDownOutsideMenu(event: PointerEvent) {
  if (!serverEnvMenuOpen.value) return

  const target = event.target as Node | null
  if (!target) return

  if (serverEnvMenuRef.value?.contains(target)) {
    return
  }

  serverEnvMenuOpen.value = false
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function renderMarkdown(text: string): string {
  if (!text) return ''
  try {
    const html = marked.parse(text, {
      async: false
    }) as string
    return html
  } catch {
    return text
  }
}

function getContent(msg: V2Message): string {
  return msg.parts
    .filter((p): p is TextPart => p.type === 'text')
    .map(p => p.text)
    .join('\n')
}

function getToolParts(msg: V2Message): ToolPart[] {
  return msg.parts.filter(
    (p): p is ToolPart => p.type === 'tool' && (p.displayKind || 'tool') === 'tool'
  )
}

function getOrderedBlocks(msg: V2Message): DisplayBlock[] {
  const blocks: DisplayBlock[] = []

  msg.parts.forEach((part, index) => {
    if (part.type === 'text') {
      const text = part.text.trim()
      if (!text) return

      const kind = part.kind || 'analysis'
      if (kind === 'summary') {
        blocks.push({
          id: `${msg.info.id}-summary-${index}`,
          type: 'summary',
          text
        })
        return
      }

      blocks.push({
        id: `${msg.info.id}-analysis-${index}`,
        type: 'analysis',
        text,
        compact: shouldCompactAnalysis(text)
      })
      return
    }

    if (part.type !== 'tool') return

    if ((part.displayKind || 'tool') === 'inquiry') {
      const text = String(part.state.output || part.state.input?.question || '').trim()
      if (!text) return

      blocks.push({
        id: `${msg.info.id}-inquiry-${part.callID}`,
        type: 'inquiry',
        text
      })
      return
    }

    blocks.push({
      id: `${msg.info.id}-tool-${part.callID}`,
      type: 'tool',
      toolPart: part
    })

    const todos = extractTodos(part)
    if (todos.length > 0) {
      blocks.push({
        id: `${msg.info.id}-todos-${part.callID}`,
        type: 'todos',
        todos
      })
    }

    const diffs = extractDiffs(part)
    if (diffs.length > 0) {
      blocks.push({
        id: `${msg.info.id}-diffs-${part.callID}`,
        type: 'diffs',
        diffs
      })
    }
  })

  return blocks
}

function shouldCompactAnalysis(text: string): boolean {
  const lineCount = text.split(/\r?\n/).filter(Boolean).length
  return text.length > 120 || lineCount > 3
}

function getFileInfo(path: string) {
  const lastSlash = path.lastIndexOf('/')
  return {
    directory: path.substring(0, lastSlash) || '/',
    filename: path.substring(lastSlash + 1)
  }
}

function getToolInfo(
  toolName: string,
  input: Record<string, any> = {},
  metadata: Record<string, any> = {}
) {
  switch (toolName) {
    case 'execute_ssh_command':
    case 'bash':
      const cmd = input.command || ''
      const preview = cmd.length > 50 ? cmd.substring(0, 50) + '...' : cmd
      return {
        icon: 'terminal',
        title: 'Shell',
        subtitle: cmd ? `$ ${preview}` : 'Running command',
        args: []
      }
    case 'read_file':
    case 'read':
      const readFile = getFileInfo(input.path || input.filePath || '')
      return {
        icon: 'file-text',
        title: 'Read',
        subtitle: input.path || input.filePath || 'Unknown file',
        pathInfo: readFile,
        args: []
      }
    case 'list_files':
    case 'list':
      return { icon: 'folder', title: 'List', subtitle: input.path || '/', args: [] }
    case 'webfetch':
      const url = input.url || ''
      const urlPreview = url.length > 50 ? url.substring(0, 50) + '...' : url
      return {
        icon: 'globe',
        title: 'Web',
        subtitle: urlPreview || 'Fetching URL',
        args: []
      }
    case 'edit':
      const editFile = getFileInfo(input.path || input.filePath || '')
      return {
        icon: 'code',
        title: 'Edit',
        subtitle: input.path || input.filePath || 'Unknown file',
        pathInfo: editFile,
        args: input.old_string ? [`Replace "${input.old_string?.substring(0, 30)}..."`] : []
      }
    case 'write':
    case 'attempt_completion':
      const writeFile = getFileInfo(input.path || input.filePath || '')
      return {
        icon: 'file-plus',
        title: 'Write',
        subtitle: input.path || input.filePath || input.result?.substring(0, 50) || 'New file',
        pathInfo: writeFile,
        args: []
      }
    case 'todowrite':
      return { icon: 'checklist', title: 'To-dos', subtitle: '', args: [] }
    case 'todoread':
      return { icon: 'list', title: 'Read to-dos', subtitle: '', args: [] }
    case 'glob':
      return {
        icon: 'search',
        title: 'Glob',
        subtitle: input.path || '/',
        args: input.pattern ? [`pattern: ${input.pattern}`] : []
      }
    case 'grep':
      return {
        icon: 'search',
        title: 'Grep',
        subtitle: input.path || '/',
        args: input.pattern ? [`pattern: ${input.pattern}`] : []
      }
    case 'webfetch':
      return {
        icon: 'globe',
        title: 'Webfetch',
        subtitle: input.url || '',
        args: input.format ? [`format: ${input.format}`] : []
      }
    case 'task':
      return {
        icon: 'users',
        title: `${input.subagent_type || 'Task'} Agent`,
        subtitle: input.description || '',
        args: []
      }
    default:
      return { icon: 'tool', title: toolName, subtitle: '', args: [] }
  }
}

function getToolStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    running: 'Running',
    completed: 'Completed',
    error: 'Failed',
    aborted: 'Cancelled'
  }
  return statusMap[status] || status
}

function normalizeUserErrorMessage(rawError: string): string {
  const cleaned = rawError.replace(/^Error: /i, '').trim()

  if (
    cleaned.includes('No document ID or connection ID available') ||
    cleaned.includes('No SSH connection available') ||
    cleaned.includes('未建立 SSH 连接')
  ) {
    return '当前没有可用的主机连接，请先连接到目标主机后再试。'
  }

  if (cleaned.includes('未找到 API 密钥配置')) {
    return '当前模型没有可用的 API Key，请先在设置中完成配置。'
  }

  if (cleaned.includes('请开通 AI 会员后使用官方模型')) {
    return '当前账号尚未开通 AI 会员，暂时无法使用官方模型。'
  }

  if (cleaned.includes('本月官方模型次数已用完')) {
    return '本月官方模型次数已用完，请下个月重置后再试。'
  }

  if (cleaned.includes('官方模型不存在')) {
    return '当前官方模型已下线或不可用，请重新选择其他官方模型。'
  }

  if (cleaned.includes('官方模型暂不可用')) {
    return '官方模型当前已关闭，请稍后再试。'
  }

  if (cleaned.includes('官方模型暂时不可用，请稍后再试')) {
    return '官方模型服务暂时不可用，请稍后再试。'
  }

  if (cleaned.includes('content or old_string is required')) {
    return '这次环境文档更新缺少有效内容，系统将优先改用整篇文档更新。'
  }

  if (cleaned.includes('old_string not found in document')) {
    return '当前环境文档已经变化，局部替换无法安全完成。建议直接按整篇文档重新更新。'
  }

  if (cleaned.includes('Failed to read file')) {
    return '目标文件暂时无法读取，请确认路径存在且当前主机有权限访问。'
  }

  if (cleaned.includes('HTTP ')) {
    return '模型服务暂时响应异常，请稍后重试。'
  }

  return cleaned
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (date.toDateString() === now.toDateString())
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function toggleTool(callID: string) {
  if (expandedTools.value.has(callID)) expandedTools.value.delete(callID)
  else expandedTools.value.add(callID)
}

function toggleTurn(turnId: string) {
  if (expandedTurns.value.has(turnId)) expandedTurns.value.delete(turnId)
  else expandedTurns.value.add(turnId)
}

function hasTools(msg: DisplayMessage): boolean {
  return msg.blocks.some(block => block.type === 'tool')
}

function getTurnId(msg: DisplayMessage): string {
  return `turn-${msg.id}`
}

function canCollapse(msg: DisplayMessage): boolean {
  return msg.role === 'assistant' && hasTools(msg)
}

function isCollapsed(msg: DisplayMessage): boolean {
  if (!canCollapse(msg)) {
    return false
  }

  const hasRunningTool = msg.blocks.some(
    block => block.type === 'tool' && block.toolPart?.state.status === 'running'
  )

  if (hasRunningTool) {
    return false
  }

  return expandedTurns.value.has(getTurnId(msg)) ? false : msg.finish === 'stop'
}

async function copyToClipboard(text: string, id: string) {
  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = id
    setTimeout(() => (copiedId.value = null), 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

async function copyResponse(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    responseCopied.value = true
    setTimeout(() => (responseCopied.value = false), 2000)
  } catch (err) {
    console.error('Failed to copy response:', err)
  }
}

function getErrorTitle(error: string): { title: string; message: string } {
  const cleaned = normalizeUserErrorMessage(error)

  if (cleaned.includes('主机连接')) {
    return { title: '连接不可用', message: cleaned }
  }

  if (cleaned.includes('API Key') || cleaned.includes('模型服务')) {
    return { title: '模型服务异常', message: cleaned }
  }

  if (cleaned.includes('环境文档')) {
    return { title: '环境文档更新失败', message: cleaned }
  }

  if (cleaned.includes('文件')) {
    return { title: '文件访问失败', message: cleaned }
  }

  return { title: '执行失败', message: cleaned }
}

function estimateMessageWeight(msg: V2Message): number {
  return msg.parts.reduce((total, part) => {
    if (part.type === 'text') {
      return total + (part.text?.length || 0)
    }

    if (part.type === 'tool') {
      return (
        total +
        JSON.stringify(part.state.input || {}).length +
        (part.state.output?.length || 0) +
        (part.state.error?.length || 0)
      )
    }

    if (part.type === 'reasoning') {
      return total + (part.text?.length || 0)
    }

    return total
  }, 0)
}

function getAdaptiveCompactionLimit(msgs: V2Message[]): number {
  const totalWeight = msgs.reduce((sum, msg) => sum + estimateMessageWeight(msg), 0)

  if (totalWeight > 45000) return 8
  if (totalWeight > 30000) return 12
  if (totalWeight > 18000) return 16
  return 20
}
</script>

<template>
  <div
    class="oc-chat"
    :class="{ generating: isGenerating }"
    style="
      --background-base: #1f1f1f;
      --text-base: #cccccc;
      --surface-base: #2d2d2d;
      --text-weak: #9d9d9d;
      --surface-base-hover: #383838;
      --text-interactive-base: #4daafc;
      --text-success-base: #2ea043;
      --text-critical-base: #f85149;
    "
  >
    <div ref="messagesContainer" class="oc-messages">
      <div v-if="props.connectionId" class="oc-connection-banner">
        <div class="oc-connection-banner-main">
          <span class="oc-connection-banner-name">{{ currentConnectionDisplay.name }}</span>
          <span class="oc-connection-banner-host">
            {{ currentConnectionDisplay.username }}@{{ currentConnectionDisplay.host }}:{{
              currentConnectionDisplay.port
            }}
          </span>
        </div>
        <div class="oc-connection-banner-meta">
          <span class="oc-connection-banner-label">当前主机</span>
          <span v-if="currentConnectionDisplay.shortId" class="oc-connection-banner-id">
            {{ currentConnectionDisplay.shortId }}
          </span>
        </div>
      </div>

      <div v-if="displayMessages.length === 0" class="oc-empty">
        <div class="oc-empty-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9z" />
            <path d="M12 8v8" />
            <path d="M12 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
          </svg>
        </div>
        <div class="oc-empty-title">AI SSH Assistant</div>
        <div class="oc-empty-text">{{ PLACEHOLDERS[placeholderIndex] }}</div>
        <div class="oc-empty-hint">
          <p>Press <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line</p>
        </div>
      </div>

      <div v-else class="oc-message-list">
        <div
          v-if="
            visibleCount <
            messages.filter(m => m.info.role === 'user' || m.info.role === 'assistant').length
          "
          ref="loadMoreRef"
          class="oc-load-more"
        >
          <span v-if="isLoadingMore" class="oc-loading-spinner"></span>
          <span v-else>Load more messages</span>
        </div>

        <template v-for="(msg, index) in displayMessages" :key="msg.id">
          <div
            class="oc-turn"
            :class="{
              collapsed: isCollapsed(msg),
              working: isGenerating && msg.role === 'assistant'
            }"
            :data-msg-id="msg.id"
            :data-msg-role="msg.role"
          >
            <div class="oc-turn-header">
              <button
                v-if="canCollapse(msg)"
                class="oc-collapse-button"
                @click="toggleTurn(getTurnId(msg))"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  :class="{ expanded: expandedTurns.has(getTurnId(msg)) }"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="oc-turn-title">
                <span class="oc-turn-role">{{ msg.role === 'user' ? 'You' : 'Assistant' }}</span>
                <span class="oc-turn-time">{{ formatTime(msg.timestamp) }}</span>
                <span v-if="msg.modelInfo" class="oc-model-badge">{{
                  msg.modelInfo.modelID || 'MiniMax'
                }}</span>
              </div>
              <div v-if="msg.finish === 'stop'" class="oc-turn-badge oc-badge-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Done
              </div>
              <div v-else-if="msg.finish === 'tool-calls'" class="oc-turn-badge oc-badge-info">
                <span class="oc-badge-spinner"></span>
                Thinking
              </div>
              <div v-else class="oc-turn-badge oc-badge-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Done
              </div>
            </div>

            <div class="oc-turn-content">
              <template v-if="msg.role === 'user'">
                <div class="oc-user-message">
                  <div
                    v-if="msg.content"
                    class="oc-markdown oc-user-text"
                    v-html="renderMarkdown(msg.content)"
                  ></div>
                  <button
                    class="oc-copy-button"
                    @click="copyToClipboard(msg.content, msg.id)"
                    :title="copiedId === msg.id ? 'Copied!' : 'Copy'"
                  >
                    <svg
                      v-if="copiedId !== msg.id"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                </div>
              </template>

              <template v-else>
                <template v-for="block in msg.blocks" :key="block.id">
                  <div v-if="block.type === 'analysis'" class="oc-timeline-block">
                    <details v-if="block.compact" class="oc-analysis-block">
                      <summary>分析过程</summary>
                      <div
                        class="oc-markdown oc-analysis-text"
                        v-html="renderMarkdown(block.text)"
                      ></div>
                    </details>
                    <div
                      v-else
                      class="oc-markdown oc-analysis-text"
                      v-html="renderMarkdown(block.text)"
                    ></div>
                  </div>

                  <div v-else-if="block.type === 'tool' && block.toolPart" class="oc-tools">
                    <div
                      class="oc-tool"
                      :class="{
                        expanded: expandedTools.has(block.toolPart.callID),
                        [block.toolPart.state.status]: true,
                        'has-error': block.toolPart.state.status === 'error'
                      }"
                    >
                      <template
                        v-if="block.toolPart.state.status === 'error' && block.toolPart.state.error"
                      >
                        <div class="oc-tool-error-card">
                          <div class="oc-error-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>
                          </div>
                          <div class="oc-error-content">
                            <div class="oc-error-title">
                              {{ getErrorTitle(block.toolPart.state.error).title }}
                            </div>
                            <div class="oc-error-message">
                              {{ getErrorTitle(block.toolPart.state.error).message }}
                            </div>
                          </div>
                        </div>
                      </template>

                      <template v-else>
                        <div class="oc-tool-trigger" @click="toggleTool(block.toolPart.callID)">
                          <div class="oc-tool-icon">
                            <svg
                              v-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'terminal'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <polyline points="4 17 10 11 4 5"></polyline>
                              <line x1="12" y1="19" x2="20" y2="19"></line>
                            </svg>
                            <svg
                              v-else-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'file-text'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                              ></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                            <svg
                              v-else-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'folder'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                              ></path>
                            </svg>
                            <svg
                              v-else-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'code'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <polyline points="16 18 22 12 16 6"></polyline>
                              <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            <svg
                              v-else-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'file-plus'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                              ></path>
                              <line x1="12" y1="18" x2="12" y2="12"></line>
                              <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                            <svg
                              v-else-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'checklist'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <polyline points="9 11 12 14 22 4"></polyline>
                              <path
                                d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                              ></path>
                            </svg>
                            <svg
                              v-else-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'search'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <svg
                              v-else-if="
                                getToolInfo(
                                  block.toolPart.tool,
                                  block.toolPart.state.input,
                                  block.toolPart.state.metadata || {}
                                ).icon === 'globe'
                              "
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                            </svg>
                            <svg
                              v-else
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                          </div>
                          <div class="oc-tool-info">
                            <span class="oc-tool-title">{{
                              getToolInfo(
                                block.toolPart.tool,
                                block.toolPart.state.input,
                                block.toolPart.state.metadata || {}
                              ).title
                            }}</span>
                            <span class="oc-tool-subtitle">{{
                              getToolInfo(
                                block.toolPart.tool,
                                block.toolPart.state.input,
                                block.toolPart.state.metadata || {}
                              ).subtitle
                            }}</span>
                          </div>
                          <div class="oc-tool-status" :class="block.toolPart.state.status">
                            <span
                              v-if="block.toolPart.state.status === 'running'"
                              class="oc-status-dot"
                            ></span>
                            {{ getToolStatusText(block.toolPart.state.status) }}
                          </div>
                          <svg
                            class="oc-chevron"
                            :class="{ expanded: expandedTools.has(block.toolPart.callID) }"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                        <div
                          v-if="expandedTools.has(block.toolPart.callID)"
                          class="oc-tool-content"
                        >
                          <div
                            v-if="
                              block.toolPart.tool === 'todowrite' && block.toolPart.state.output
                            "
                            class="oc-tool-input"
                          >
                            <div class="oc-tool-section-label">Plan</div>
                            <div
                              class="oc-tool-output-content"
                              v-html="renderMarkdown(block.toolPart.state.output)"
                            ></div>
                          </div>
                          <div
                            v-else-if="
                              block.toolPart.tool === 'bash' &&
                              (block.toolPart.state.input?.command || block.toolPart.state.output)
                            "
                            class="oc-tool-input"
                          >
                            <div class="oc-tool-section-label">Command</div>
                            <pre>{{
                              block.toolPart.state.input?.command ||
                              block.toolPart.state.input?.description
                            }}</pre>
                          </div>
                          <div
                            v-else-if="
                              block.toolPart.tool === 'read_file' &&
                              block.toolPart.state.input?.path
                            "
                            class="oc-tool-input"
                          >
                            <div class="oc-tool-section-label">File Path</div>
                            <pre>{{ block.toolPart.state.input.path }}</pre>
                          </div>
                          <div
                            v-else-if="
                              block.toolPart.state.input &&
                              Object.keys(block.toolPart.state.input).length > 0
                            "
                            class="oc-tool-input"
                          >
                            <div class="oc-tool-section-label">Input</div>
                            <pre>{{ JSON.stringify(block.toolPart.state.input, null, 2) }}</pre>
                          </div>
                          <div
                            v-if="
                              block.toolPart.state.status === 'completed' &&
                              block.toolPart.state.output
                            "
                            class="oc-tool-output"
                          >
                            <div class="oc-tool-section-label">Output</div>
                            <div
                              class="oc-tool-output-content"
                              v-html="renderMarkdown(block.toolPart.state.output)"
                            ></div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>

                  <div v-else-if="block.type === 'todos' && block.todos" class="oc-todos">
                    <div class="oc-todos-header">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                      <span>To-dos</span>
                    </div>
                    <div class="oc-todos-list">
                      <div
                        v-for="todo in block.todos"
                        :key="todo.id"
                        class="oc-todo-item"
                        :class="{ completed: todo.status === 'completed' }"
                      >
                        <div class="oc-todo-checkbox">
                          <svg
                            v-if="todo.status === 'completed'"
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                        </div>
                        <span class="oc-todo-content">{{ todo.activeForm || todo.content }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="block.type === 'diffs' && block.diffs" class="oc-diffs">
                    <div class="oc-diffs-header">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                      <span>Changes</span>
                    </div>
                    <div v-for="diff in block.diffs" :key="diff.file" class="oc-diff-item">
                      <div class="oc-diff-file">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                          ></path>
                        </svg>
                        <span class="oc-diff-path">{{ diff.file }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else-if="(block.type === 'inquiry' || block.type === 'summary') && block.text"
                    class="oc-response"
                  >
                    <div class="oc-response-header">
                      <span class="oc-response-title">{{
                        block.type === 'inquiry' ? '询问' : '总结'
                      }}</span>
                      <button
                        class="oc-copy-button"
                        @click="copyResponse(block.text)"
                        :title="responseCopied ? 'Copied!' : 'Copy'"
                      >
                        <svg
                          v-if="!responseCopied"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                    </div>
                    <div class="oc-response-content" v-html="renderMarkdown(block.text)"></div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="error" class="oc-error">
      <span class="oc-error-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </span>
      <span>{{ normalizeUserErrorMessage(error.message || error) }}</span>
    </div>

    <div v-if="currentStatus" class="oc-session-status" :class="`is-${currentStage}`">
      <div class="oc-session-status-main">
        <span
          v-if="isGenerating || currentStage === 'thinking' || currentStage === 'executing'"
          class="oc-status-dot"
        ></span>
        <span class="oc-session-status-text">{{ currentStatus }}</span>
        <span v-if="sessionDuration && isGenerating" class="oc-session-status-time">{{
          sessionDuration
        }}</span>
        <button
          class="oc-session-toggle"
          type="button"
          @click="toggleSessionStatusExpanded"
          :aria-expanded="sessionStatusExpanded"
          :title="sessionStatusExpanded ? '收起会话状态' : '展开会话状态'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="{ expanded: sessionStatusExpanded }"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      <div v-if="sessionStatusExpanded">
        <div class="oc-session-status-steps">
          <div
            v-for="step in sessionSteps"
            :key="step.key"
            class="oc-session-step"
            :class="{ active: step.active, done: step.done }"
          >
            <span class="oc-session-step-dot"></span>
            <span class="oc-session-step-label">{{ step.label }}</span>
          </div>
        </div>
        <div v-if="performanceBadges.length > 0" class="oc-session-metrics">
          <span v-for="badge in performanceBadges" :key="badge" class="oc-session-metric-badge">
            {{ badge }}
          </span>
        </div>
        <div v-if="performanceInsight" class="oc-session-insight">
          {{ performanceInsight }}
        </div>
        <div v-if="interruptionState" class="oc-session-interruption">
          <div class="oc-session-interruption-title">已保留当前进度</div>
          <div class="oc-session-interruption-meta">
            <span>已完成工具 {{ interruptionState.completedTools }} 次</span>
            <span class="oc-hint-divider">·</span>
            <span>最后一步: {{ interruptionState.lastTool }}</span>
          </div>
          <div v-if="interruptionState.partialResponse" class="oc-session-interruption-preview">
            {{ interruptionState.partialResponse }}
          </div>
          <div v-if="interruptionState.canResume" class="oc-session-interruption-hint">
            直接发送“继续”或补一句新要求，我会基于当前上下文接着处理。
          </div>
        </div>
        <div v-if="debugFacts.length > 0 || debugToolChain.length > 0" class="oc-debug-panel">
          <div class="oc-debug-panel-title">会话观测</div>
          <div v-if="debugFacts.length > 0" class="oc-debug-facts">
            <div v-for="fact in debugFacts" :key="fact.label" class="oc-debug-fact">
              <span class="oc-debug-fact-label">{{ fact.label }}</span>
              <span class="oc-debug-fact-value">{{ fact.value }}</span>
            </div>
          </div>
          <div v-if="debugToolChain.length > 0" class="oc-debug-chain">
            <span class="oc-debug-chain-label">最近工具链</span>
            <span
              v-for="tool in debugToolChain"
              :key="tool.id"
              class="oc-debug-chain-item"
              :class="`is-${tool.status}`"
            >
              {{ tool.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="oc-input-wrapper">
      <div class="oc-input-container">
        <textarea
          ref="inputRef"
          v-model="inputMessage"
          class="oc-input"
          :placeholder="`${PLACEHOLDERS[placeholderIndex]}...\nEnter to send · Shift+Enter for new line`"
          @keydown="handleInputKeydown"
          rows="2"
        ></textarea>
      </div>
      <div class="oc-input-actions">
        <div class="oc-input-actions-left">
          <div
            v-if="props.showServerEnvButton"
            ref="serverEnvMenuRef"
            class="oc-action-menu"
            @mouseenter="openServerEnvMenu"
            @mouseleave="closeServerEnvMenu"
          >
            <button
              class="oc-action-button"
              type="button"
              :aria-expanded="serverEnvMenuOpen"
              title="更多环境文档操作"
            >
              <i class="bi bi-three-dots"></i>
              <span>更多</span>
            </button>

            <div v-if="serverEnvMenuOpen" class="oc-action-menu-popover">
              <button class="oc-action-menu-item" type="button" @click="openServerEnvDoc">
                <i class="bi bi-file-earmark-text"></i>
                <span>查看文档</span>
              </button>
              <button
                class="oc-action-menu-item"
                type="button"
                @click="prepareServerEnvUpdatePrompt"
              >
                <i class="bi bi-pencil-square"></i>
                <span>更新文档</span>
              </button>
            </div>
          </div>
        </div>
        <div class="oc-input-actions-right">
          <button
            v-if="!isGenerating"
            class="oc-send-button"
            :disabled="!inputMessage.trim()"
            @click="handleSendMessage"
          >
            <i class="bi bi-arrow-up"></i>
          </button>
          <button
            v-else
            class="oc-send-button oc-stop-button is-stopping"
            :disabled="isStopping"
            @click="handleStop"
          >
            <i :class="isStopping ? 'bi bi-hourglass-split' : 'bi bi-stop-fill'"></i>
            <span v-if="isStopping">Stopping...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import 'highlight.js/styles/github-dark.css';

.oc-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--background-base);
  color: var(--text-base);
  font-family: var(--font-family-sans);
}

.oc-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 24px;
  scroll-behavior: smooth;
}

.oc-connection-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(77, 170, 252, 0.08);
  border: 1px solid rgba(77, 170, 252, 0.18);
}

.oc-connection-banner-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.oc-connection-banner-name {
  color: var(--text-base);
  font-size: 13px;
  font-weight: 600;
}

.oc-connection-banner-host {
  color: var(--text-weak);
  font-size: 12px;
  word-break: break-all;
}

.oc-connection-banner-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.oc-connection-banner-label {
  color: var(--text-interactive-base);
  font-size: 11px;
}

.oc-connection-banner-id {
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-base);
  font-size: 11px;
  font-family: 'Consolas', 'Monaco', monospace;
}

.oc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--text-weak);
}

.oc-empty-icon {
  color: var(--text-weak);
  margin-bottom: 16px;
}
.oc-empty-icon svg {
  opacity: 0.5;
}
.oc-empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-strong);
  margin-bottom: 8px;
}
.oc-empty-text {
  font-size: 14px;
  min-height: 24px;
}

.oc-empty-hint {
  margin-top: 16px;
  font-size: 12px;
  background: var(--surface-base);
  padding: 8px 16px;
  border-radius: 20px;
}

.oc-empty-hint kbd {
  background: var(--surface-inset-base);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 11px;
}

.oc-message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.oc-load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--text-weak);
  font-size: 12px;
}

.oc-loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--surface-base);
  border-top-color: var(--text-interactive-base);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.oc-turn {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  margin: -12px -16px;
  border-radius: 12px;
  transition: background 0.15s ease;
  user-select: text;
  -webkit-user-select: text;
}

.oc-turn:hover {
  background: var(--surface-base);
}
.oc-turn.collapsed {
  cursor: pointer;
}
.oc-turn.working {
  background: var(--surface-base-hover);
}

.oc-turn-header {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 20px;
}

.oc-collapse-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: var(--text-weak);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.oc-collapse-button:hover {
  background: var(--surface-base-hover);
  color: var(--text-base);
}
.oc-collapse-button svg.expanded {
  transform: rotate(180deg);
}

.oc-turn-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  flex: 1;
}
.oc-turn-role {
  font-weight: 500;
  color: var(--text-strong);
  text-transform: capitalize;
}
.oc-turn-time {
  color: var(--text-weak);
}
.oc-model-badge {
  font-size: 9px;
  background: var(--surface-interactive-weak);
  color: var(--text-interactive-base);
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.oc-turn-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.oc-badge-success {
  background: var(--surface-success-weak);
  color: var(--surface-success-strong);
}
.oc-badge-info {
  background: var(--surface-interactive-weak);
  color: var(--text-interactive-base);
}
.oc-badge-spinner {
  width: 8px;
  height: 8px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.oc-turn-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 0;
}

.oc-user-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.oc-user-text {
  flex: 1;
}

.oc-copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-weak);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  opacity: 0;
  margin-top: 2px;
}

.oc-user-message:hover .oc-copy-button {
  opacity: 1;
}
.oc-copy-button:hover {
  background: var(--surface-base);
  color: var(--text-base);
}

.oc-markdown {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-base);
  user-select: text;
  -webkit-user-select: text;
}
.oc-markdown p {
  margin: 6px 0;
}
.oc-markdown p:first-child {
  margin-top: 0;
}
.oc-markdown pre {
  background: var(--surface-inset-base);
  padding: 10px 14px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 10px 0;
  font-family: var(--font-family-mono);
  font-size: 12px;
  line-height: 1.5;
}
.oc-markdown code {
  font-family: var(--font-family-mono);
  font-size: 12px;
  background: var(--surface-inset-base);
  padding: 2px 5px;
  border-radius: 4px;
}
.oc-markdown pre code {
  background: transparent;
  padding: 0;
}
.oc-markdown ul,
.oc-markdown ol {
  padding-left: 18px;
  margin: 8px 0;
}

.oc-analysis-text {
  margin-bottom: 8px;
  color: var(--text-weak);
}

.oc-analysis-block {
  margin-bottom: 8px;
  border: 1px solid var(--surface-base);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
}

.oc-analysis-block summary {
  cursor: pointer;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--text-weak);
  user-select: none;
}

.oc-analysis-block .oc-analysis-text {
  padding: 0 12px 12px;
  margin-bottom: 0;
}

.oc-todos {
  background: var(--surface-base);
  border: 1px solid var(--surface-base);
  border-radius: 10px;
  overflow: hidden;
}
.oc-todos-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--surface-base-hover);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-weak);
  border-bottom: 1px solid var(--surface-base);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.oc-todos-list {
  padding: 6px;
}
.oc-todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 6px;
  transition: background 0.15s ease;
}
.oc-todo-item:hover {
  background: var(--surface-base-hover);
}
.oc-todo-item.completed {
  opacity: 0.5;
}
.oc-todo-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--text-success-base);
}
.oc-todo-content {
  font-size: 12px;
  color: var(--text-base);
}
.oc-todo-item.completed .oc-todo-content {
  text-decoration: line-through;
}

.oc-tools {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.oc-tool {
  border: 1px solid var(--surface-base);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.15s ease;
}
.oc-tool.expanded {
  border-color: var(--surface-raised-base);
}
.oc-tool.running {
  border-left: 3px solid var(--text-interactive-base);
}
.oc-tool.completed {
  border-left: 3px solid var(--text-success-base);
}
.oc-tool.has-error {
  border-left: 3px solid var(--text-critical-base);
}

.oc-tool-error-card {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  background: var(--surface-critical-base);
  color: var(--text-on-critical-base);
}
.oc-error-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.oc-error-content {
  flex: 1;
  min-width: 0;
}
.oc-error-title {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 2px;
}
.oc-error-message {
  font-size: 11px;
  opacity: 0.9;
  word-break: break-word;
}

.oc-tool-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  background: var(--surface-base);
  transition: background 0.15s ease;
}
.oc-tool-trigger:hover {
  background: var(--surface-base-hover);
}
.oc-tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: var(--text-weak);
}
.oc-tool-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.oc-tool-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.oc-tool-subtitle {
  font-size: 11px;
  color: var(--text-weak);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.oc-tool-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: capitalize;
  flex-shrink: 0;
}
.oc-tool-status.pending {
  color: var(--text-weak);
}
.oc-tool-status.running {
  color: var(--text-interactive-base);
}
.oc-tool-status.completed {
  color: var(--text-success-base);
}
.oc-tool-status.error {
  color: var(--text-critical-base);
}
.oc-status-dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.oc-chevron {
  color: var(--text-weak);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}
.oc-chevron.expanded {
  transform: rotate(180deg);
}

.oc-tool-content {
  background: var(--surface-raised-base);
  border-top: 1px solid var(--surface-base);
  max-height: 300px;
  overflow-y: auto;
}
.oc-tool-input,
.oc-tool-output {
  padding: 10px 14px;
}
.oc-tool-input {
  border-bottom: 1px solid var(--surface-base);
}
.oc-tool-input pre,
.oc-tool-output-content {
  background: var(--surface-inset-base);
  padding: 10px;
  border-radius: 6px;
  margin: 6px 0 0;
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--text-base);
  overflow-x: auto;
  white-space: pre-wrap;
}
.oc-tool-output-content {
  color: var(--text-base);
  user-select: text;
  -webkit-user-select: text;
}
.oc-tool-section-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-weak);
  margin-bottom: 2px;
}

.oc-diffs {
  background: var(--surface-base);
  border: 1px solid var(--surface-base);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}
.oc-diffs-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--surface-base-hover);
  font-size: 11px;
  font-weight: 500;
  color: var(--text-weak);
  border-bottom: 1px solid var(--surface-base);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.oc-diff-item {
  padding: 8px 12px;
  border-bottom: 1px solid var(--surface-base);
}
.oc-diff-item:last-child {
  border-bottom: none;
}
.oc-diff-file {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-base);
}
.oc-diff-path {
  font-family: var(--font-family-mono);
}

.oc-response {
  background: var(--surface-base);
  border: 1px solid var(--surface-base);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}
.oc-response-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--surface-base-hover);
  border-bottom: 1px solid var(--surface-base);
}
.oc-response-title {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-weak);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.oc-response-content {
  padding: 12px 14px;
  font-size: 13px;
  user-select: text;
  -webkit-user-select: text;
}

.oc-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-critical-base);
  color: var(--text-on-critical-base);
  padding: 10px 14px;
  margin: 0 16px 8px;
  border-radius: 8px;
  font-size: 12px;
}
.oc-error-icon {
  display: flex;
  align-items: center;
}

.oc-session-status {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 16px 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-weak);
  font-size: 12px;
}

.oc-session-status.is-preparing,
.oc-session-status.is-thinking,
.oc-session-status.is-executing {
  color: var(--text-interactive-base);
}

.oc-session-status.is-complete {
  color: var(--text-success-base);
}

.oc-session-status.is-stopped {
  color: #f1b24a;
}

.oc-session-status.is-error {
  color: var(--text-critical-base);
}

.oc-session-status-steps {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.oc-session-step {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-weak);
  opacity: 0.7;
}

.oc-session-step.active,
.oc-session-step.done {
  opacity: 1;
}

.oc-session-step.done {
  color: var(--text-success-base);
}

.oc-session-step.active {
  color: var(--text-interactive-base);
}

.oc-session-step-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
}

.oc-session-status-main {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.oc-session-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: currentColor;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0.8;
}

.oc-session-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
  opacity: 1;
}

.oc-session-toggle svg {
  transition: transform 0.15s ease;
}

.oc-session-toggle svg.expanded {
  transform: rotate(180deg);
}

.oc-session-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.oc-session-metric-badge {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-weak);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.oc-session-insight {
  color: var(--text-weak);
  font-size: 12px;
  line-height: 1.5;
}

.oc-session-interruption {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(241, 178, 74, 0.08);
  border: 1px solid rgba(241, 178, 74, 0.2);
}

.oc-session-interruption-title {
  color: var(--text-base);
  font-size: 12px;
  font-weight: 600;
}

.oc-session-interruption-meta,
.oc-session-interruption-hint,
.oc-session-interruption-preview {
  color: var(--text-weak);
  font-size: 12px;
  line-height: 1.5;
}

.oc-session-interruption-preview {
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
}

.oc-debug-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.oc-debug-panel-title {
  color: var(--text-base);
  font-size: 12px;
  font-weight: 600;
}

.oc-debug-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.oc-debug-fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
}

.oc-debug-fact-label {
  color: var(--text-weak);
  font-size: 11px;
}

.oc-debug-fact-value {
  color: var(--text-base);
  font-size: 12px;
}

.oc-debug-chain {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.oc-debug-chain-label {
  color: var(--text-weak);
  font-size: 11px;
}

.oc-debug-chain-item {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-base);
  font-size: 11px;
}

.oc-debug-chain-item.is-completed {
  background: rgba(74, 201, 126, 0.12);
  color: var(--text-success-base);
}

.oc-debug-chain-item.is-running {
  background: rgba(77, 170, 252, 0.12);
  color: var(--text-interactive-base);
}

.oc-debug-chain-item.is-error {
  background: rgba(255, 107, 107, 0.12);
  color: var(--text-critical-base);
}

.oc-session-status-text {
  flex: 1;
  min-width: 0;
}

.oc-session-status-time {
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
}

.oc-input-wrapper {
  padding: 0;
  background: var(--background-weak);
  border-top: 1px solid var(--surface-base);
  display: flex;
  flex-direction: column;
  gap: 0;
}
.oc-input-container {
  display: flex;
  background: var(--surface-raised-base);
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 8px 10px;
  min-height: 56px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}
.oc-input-container:focus-within {
  border-color: transparent;
  box-shadow: none;
}
.oc-input {
  flex: 1;
  display: block;
  background: transparent;
  border: none;
  color: #ffffff;
  -webkit-text-fill-color: #ffffff;
  caret-color: #ffffff;
  opacity: 1;
  padding: 0;
  resize: none;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.35;
  min-height: 48px;
  height: 48px;
  max-height: 104px;
  overflow-y: hidden;
  box-sizing: border-box;
}

.oc-input-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 28px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px 6px;
}

.oc-input-actions-left,
.oc-input-actions-right {
  display: flex;
  align-items: center;
}

.oc-action-menu {
  position: relative;
}

.oc-action-menu::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 8px;
}

.oc-action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-weak);
  cursor: pointer;
  transition: all 0.15s ease;
}

.oc-action-menu-popover {
  position: absolute;
  left: 0;
  bottom: 100%;
  min-width: 132px;
  padding: 6px;
  border-radius: 10px;
  background: rgba(27, 27, 27, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 20;
}

.oc-action-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 32px;
  padding: 0 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-base);
  font-size: 12px;
  cursor: pointer;
  text-align: left;
}

.oc-action-menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.oc-action-menu-item i {
  font-size: 13px;
  color: var(--text-weak);
}

.oc-action-button:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-base);
}

.oc-action-button i {
  font-size: 13px;
  line-height: 1;
}

.oc-action-button span {
  font-size: 12px;
}
.oc-input:focus {
  outline: none;
  background: transparent;
  background-color: transparent;
  color: #ffffff;
  -webkit-text-fill-color: #ffffff;
}
.oc-input::placeholder {
  color: var(--text-weak);
  opacity: 0.7;
  transition: opacity 0.2s;
}
.oc-input:focus::placeholder {
  opacity: 0.5;
}
.oc-send-button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.oc-send-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}
.oc-send-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
.oc-send-button i {
  font-size: 14px;
  line-height: 1;
}
.oc-btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
.oc-stop-button {
  background: rgba(239, 68, 68, 0.14);
  color: #ffb4b4;
}
.oc-stop-button.is-stopping {
  gap: 6px;
  min-width: 92px;
}
.oc-stop-button:hover {
  background: rgba(239, 68, 68, 0.22);
  color: #ffd0d0;
}
.oc-stop-button:disabled {
  opacity: 0.8;
  cursor: wait;
}

.oc-input-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 10px;
  color: var(--text-weak);
  line-height: 1.2;
}
.oc-hint-divider {
  opacity: 0.5;
}
</style>
