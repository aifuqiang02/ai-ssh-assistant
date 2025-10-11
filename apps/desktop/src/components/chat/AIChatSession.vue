<template>
  <div class="ai-chat-session h-full flex">
    <!-- 主聊天区域 -->
    <div class="chat-main flex-1 flex flex-col">
      <!-- 消息区域 -->
      <div ref="messagesContainer" class="messages-area flex-1 overflow-y-auto scrollbar-thin">
        <div class="messages-content max-w-4xl mx-auto px-4 py-6">
          <!-- 空状态 -->
          <div v-if="messages.length === 0" class="empty-state text-center text-vscode-fg-muted py-12">
            <div class="empty-icon mb-6">
              <i class="bi bi-chat-dots text-6xl opacity-30"></i>
            </div>
            <p class="text-base font-medium mb-2">{{ emptyStateText || '开始与 AI 助手对话' }}</p>
            <p v-if="emptyStateSubtext" class="text-sm opacity-75">{{ emptyStateSubtext }}</p>
          </div>
          
          <!-- 消息列表 - 参考 lobe-chat 设计 -->
          <div 
            v-for="message in messages" 
            :key="message.id" 
            :class="[
              'message-item mb-6',
              message.role === 'user' ? 'flex justify-end' : ''
            ]"
          >
            <div 
              :class="[
                'message-container flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              ]"
            >
              <!-- 头像 -->
              <div class="message-avatar flex-shrink-0">
                <div 
                  :class="[
                    'avatar w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium',
                    message.role === 'user' 
                      ? 'bg-vscode-accent text-white' 
                      : 'bg-vscode-bg-lighter text-vscode-fg border border-vscode-border'
                  ]"
                  :title="message.role === 'user' ? '你' : 'AI 助手'"
                >
                  <i :class="message.role === 'user' ? 'bi bi-person-fill' : 'bi bi-robot'"></i>
                </div>
              </div>

              <!-- 消息内容容器 -->
              <div 
                :class="[
                  'message-content-wrapper',
                  message.role === 'user' ? 'max-w-lg' : 'max-w-3xl'
                ]"
              >
                <!-- 消息气泡 -->
                <div class="message-bubble-container group relative">
                  <div 
                    :class="[
                      'message-bubble rounded-lg px-3 py-2 relative',
                      message.role === 'user' 
                        ? 'user-bubble' 
                        : 'assistant-bubble'
                    ]"
                  >
                    <!-- 用户消息内容 -->
                    <div 
                      v-if="message.role === 'user'"
                      class="message-text whitespace-pre-wrap break-words text-sm leading-relaxed text-right"
                    >
                      {{ message.content }}
                    </div>

                    <!-- AI 消息：流式输出时显示纯文本 -->
                    <div 
                      v-else-if="message.streaming"
                      class="message-text whitespace-pre-wrap break-words text-sm leading-relaxed streaming-text"
                    >
                      {{ message.content }}<span class="cursor-blink ml-0.5">▋</span>
                    </div>

                    <!-- AI 消息：完成后渲染 Markdown -->
                    <div 
                      v-else
                      class="message-text markdown-content text-sm leading-relaxed"
                    >
                      <MarkdownRenderer :content="message.content" />
                    </div>
                  </div>

                  <!-- 消息操作栏 - 仅对 AI 消息显示 -->
                  <div 
                    v-if="message.role === 'assistant' && !message.streaming"
                    class="message-actions mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      @click="copyMessage(message.content, message.id)"
                      class="action-button"
                      :title="copiedMessageId === message.id ? '已复制' : '复制'"
                    >
                      <i :class="copiedMessageId === message.id ? 'bi bi-check2' : 'bi bi-clipboard'"></i>
                    </button>
                    <button
                      v-if="showRegenerateButton"
                      @click="$emit('regenerate', message.id)"
                      class="action-button"
                      title="重新生成"
                    >
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                    <button
                      v-if="showDeleteButton"
                      @click="$emit('delete-message', message.id)"
                      class="action-button"
                      title="删除"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 输入区域 - 参考 lobe-chat 设计 -->
      <div class="input-area bg-vscode-editor-background">
        <div class="input-container max-w-4xl mx-auto px-4 py-3">
          <!-- 输入框主体 -->
          <div class="input-wrapper border border-vscode-input-border rounded-lg bg-vscode-input-background focus-within:border-vscode-focusBorder transition-colors">
            <!-- 输入编辑器 -->
            <textarea
              ref="inputTextarea"
              v-model="inputMessage"
              @keydown="handleKeyDown"
              @input="handleInput"
              :disabled="isGenerating"
              :placeholder="inputPlaceholder || '输入消息...'"
              class="input-editor w-full px-4 py-3 bg-transparent border-none outline-none resize-none text-sm text-vscode-input-foreground placeholder-vscode-input-placeholderForeground"
              :style="{ height: inputHeight + 'px' }"
              :rows="1"
            ></textarea>

            <!-- 操作栏 -->
            <div class="input-actions flex items-center justify-between px-4 pt-1">
              <!-- 左侧工具 -->
              <div class="actions-left flex items-center gap-1">
                <button 
                  v-if="showClearButton"
                  @click="handleClearMessages"
                  class="action-tool-button"
                  title="清空对话"
                >
                  <i class="bi bi-trash"></i>
                </button>
                <button 
                  v-if="showModelSelector"
                  @click="$emit('open-model-selector')"
                  class="action-tool-button"
                  :title="currentModel ? `当前: ${currentModel.name}` : '选择模型'"
                >
                  <i class="bi bi-cpu"></i>
                </button>
                <button 
                  v-if="showSettingsButton"
                  @click="openSettings"
                  class="action-tool-button"
                  title="打开设置"
                >
                  <i class="bi bi-sliders"></i>
                </button>
              </div>

              <!-- 右侧：Token 计数和发送按钮 -->
              <div class="actions-right flex items-center gap-3">
                <span 
                  v-if="showTokenCount && inputMessage.trim()"
                  class="token-hint text-xs text-vscode-descriptionForeground"
                >
                  <i class="bi bi-coin text-xs"></i>
                  ~{{ estimateTokens(inputMessage) }}
                </span>
                <button
                  @click="handleSendMessage"
                  :disabled="!canSend"
                  :class="[
                    'send-button flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all',
                    canSend 
                      ? 'bg-vscode-button-background text-vscode-button-foreground hover:bg-vscode-button-hoverBackground' 
                      : 'bg-vscode-button-background opacity-40 cursor-not-allowed'
                  ]"
                >
                  <i v-if="isGenerating" class="bi bi-hourglass-split animate-spin text-sm"></i>
                  <i v-else class="bi bi-send-fill text-sm"></i>
                  <span>{{ isGenerating ? '生成中' : '发送' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧面板：角色设定 -->
    <div 
      class="role-settings-panel flex-shrink-0 flex flex-col border-l border-vscode-border bg-vscode-sideBar-background"
      style="width: 400px;"
    >
      <div class="panel-header px-6 py-4 border-b border-vscode-border bg-vscode-sideBar-background">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-vscode-sideBarTitle-foreground flex items-center gap-2">
            <i class="bi bi-chat-square-text"></i>
            <span>角色设定</span>
          </h3>
          <button 
            @click="openPromptOptimizer"
            class="edit-button p-2 rounded-md hover:bg-vscode-list-hoverBackground transition-colors"
            title="编辑提示词"
          >
            <i class="bi bi-pencil-square text-base"></i>
          </button>
        </div>
      </div>

      <div class="panel-content flex-1 overflow-y-auto">
        <!-- 系统角色显示区 -->
        <div class="setting-section">
          <div class="prompt-display w-full text-vscode-input-foreground text-sm leading-relaxed">
            <MarkdownRenderer v-if="systemRole" :content="systemRole" />
            <span v-else class="text-vscode-descriptionForeground opacity-50">暂无系统提示词，点击右上角编辑图标进入提示词优化助手...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onBeforeUnmount, watch, inject } from 'vue'
import { useRouter } from 'vue-router'
import { chatCompletion, type ChatMessage as APIChatMessage } from '../../services/ai-api.service'
import type { AIProvider, AIModel } from '../../types/ai-providers'
import { settingsService } from '../../services/settings.service'
import { chatService } from '../../services/chat.service'
import { marked } from 'marked'
import hljs from 'highlight.js'
import MarkdownRenderer from './MarkdownRenderer.vue'

const router = useRouter()

// 注入 openNewTab 方法
const openNewTab = inject<(id: string, name: string, icon: string, path: string) => void>('openNewTab')

// 消息接口
export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  streaming?: boolean
}

// 组件属性
interface Props {
  messages?: Message[]
  currentProvider?: AIProvider | null
  currentModel?: AIModel | null
  sessionName?: string
  sessionId?: string
  inputPlaceholder?: string
  emptyStateText?: string
  emptyStateSubtext?: string
  showCopyButton?: boolean
  showRegenerateButton?: boolean
  showDeleteButton?: boolean
  showClearButton?: boolean
  showTokenCount?: boolean
  showFootnote?: boolean
  showModelSelector?: boolean
  showSettingsButton?: boolean
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  inputPlaceholder: '输入消息...',
  emptyStateText: '开始与 AI 助手对话',
  showCopyButton: true,
  showRegenerateButton: true,
  showDeleteButton: false,
  showClearButton: true,
  showTokenCount: true,
  showFootnote: true,
  showModelSelector: true,
  showSettingsButton: true,
  autoScroll: true
})

// 组件事件
const emit = defineEmits<{
  'send-message': [content: string]
  'clear-messages': []
  'regenerate': [messageId: number]
  'delete-message': [messageId: number]
  'update:messages': [messages: Message[]]
  'open-model-selector': []
  'update:session-name': [name: string]
}>()

// 响应式数据
const inputMessage = ref('')
const inputHeight = ref(54)
const isGenerating = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const inputTextarea = ref<HTMLTextAreaElement | null>(null)
const copiedMessageId = ref<number | null>(null)

// 系统角色和设置
const systemRole = ref('')
const temperature = ref(0.7)
const maxTokens = ref(4096)

// 内部消息列表
const internalMessages = ref<Message[]>([...props.messages])

// 监听外部消息变化
watch(() => props.messages, (newMessages) => {
  internalMessages.value = [...newMessages]
}, { deep: true })

// 计算属性
const messages = computed(() => internalMessages.value)
const canSend = computed(() => inputMessage.value.trim() && !isGenerating.value)

// Markdown 渲染配置
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const codeStr = String(text || '')
  const langStr = String(lang || '')
  const validLanguage = hljs.getLanguage(langStr) ? langStr : 'plaintext'
  const highlighted = hljs.highlight(codeStr, { language: validLanguage }).value
  return `<pre class="hljs-code-block"><code class="language-${validLanguage}">${highlighted}</code></pre>`
}

marked.use({
  renderer,
  breaks: true,
  gfm: true,
  async: false
})

// 方法
const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}小时前`
  
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = async () => {
  if (!props.autoScroll) return
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const copyMessage = async (content: string, messageId: number) => {
  try {
    await navigator.clipboard.writeText(content)
    copiedMessageId.value = messageId
    setTimeout(() => {
      copiedMessageId.value = null
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
  }
}

const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4)
}

// 输入框自动调整高度
const handleInput = () => {
  if (!inputTextarea.value) return
  
  inputTextarea.value.style.height = 'auto'
  const scrollHeight = inputTextarea.value.scrollHeight
  inputHeight.value = Math.min(Math.max(scrollHeight, 54), 200)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    handleSendMessage()
  }
}

const handleSendMessage = async () => {
  if (!canSend.value) return
  
  const content = inputMessage.value.trim()
  inputMessage.value = ''
  inputHeight.value = 54
  
  // 总是内部处理（因为现在 ChatView 不再拦截）
  await sendMessageInternal(content)
}

const sendMessageInternal = async (content: string) => {
  console.log('[AIChatSession] 发送消息:', content)
  console.log('[AIChatSession] currentProvider:', props.currentProvider)
  console.log('[AIChatSession] currentModel:', props.currentModel)
  
  if (!props.currentProvider || !props.currentModel) {
    console.warn('[AIChatSession] ⚠️ 缺少模型配置，显示提示')
    const tipMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: '请先选择一个 AI 模型，然后再开始对话。',
      timestamp: new Date()
    }
    internalMessages.value.push(tipMessage)
    emit('update:messages', internalMessages.value)
    scrollToBottom()
    return
  }
  
  // 添加用户消息
  const userMessage: Message = {
    id: Date.now(),
    role: 'user',
    content,
    timestamp: new Date()
  }
  internalMessages.value.push(userMessage)
  emit('update:messages', internalMessages.value)
  scrollToBottom()
  
  // 准备 AI 响应消息
  const assistantMessage: Message = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    streaming: true
  }
  internalMessages.value.push(assistantMessage)
  emit('update:messages', internalMessages.value)
  
  isGenerating.value = true
  
  try {
    // 准备 API 消息格式
    const apiMessages: APIChatMessage[] = internalMessages.value
      .filter(msg => !msg.streaming)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    
    // 添加系统角色（如果有）
    if (systemRole.value) {
      console.log('[AIChatSession] ✅ 使用 systemPrompt:', systemRole.value.substring(0, 100) + '...')
    } else {
      console.log('[AIChatSession] ℹ️ 没有 systemPrompt')
    }
    
    const messages: APIChatMessage[] = systemRole.value 
      ? [{ role: 'system', content: systemRole.value }, ...apiMessages, { role: 'user', content }]
      : [...apiMessages, { role: 'user', content }]
    
    // 获取 API 密钥配置
    const settings = await settingsService.getSettings()
    const configs = settings?.aiProviders || []
    const providerConfig = configs.find((p: any) => p.id === props.currentProvider?.id)
    
    if (!providerConfig?.apiKey) {
      throw new Error('未找到 API 密钥配置')
    }
    
    const providerWithApiKey = {
      ...props.currentProvider,
      apiKey: providerConfig.apiKey
    }
    
    // 调用 AI API
    const response = await chatCompletion(
      providerWithApiKey,
      props.currentModel,
      {
        messages,
        stream: true,
        temperature: temperature.value,
        maxTokens: maxTokens.value
      },
      (chunk) => {
        assistantMessage.content += chunk.content || ''
        internalMessages.value = [...internalMessages.value]
        scrollToBottom()
      }
    )
    
    // 完成流式输出
    assistantMessage.streaming = false
    assistantMessage.content = response.content
    emit('update:messages', internalMessages.value)
    scrollToBottom()
    
  } catch (error: any) {
    console.error('AI 响应错误:', error)
    assistantMessage.streaming = false
    assistantMessage.content = `抱歉，发生了错误：${error.message}`
    emit('update:messages', internalMessages.value)
    scrollToBottom()
  } finally {
    isGenerating.value = false
  }
}

const handleClearMessages = () => {
  if (confirm('确定要清空所有消息吗？')) {
    emit('clear-messages')
    if (props.messages.length === 0) {
      internalMessages.value = []
      emit('update:messages', internalMessages.value)
    }
  }
}

// 打开会话设置（在新标签页中打开）
const openSettings = () => {
  if (openNewTab) {
    openNewTab('session-settings', '会话设置', 'bi bi-sliders', '/session-settings')
  }
}

// 打开提示词优化助手（在新标签页中打开）
const openPromptOptimizer = () => {
  if (openNewTab) {
    openNewTab('prompt-optimizer', '提示词优化助手', 'bi bi-stars', '/prompt-optimizer')
  }
}

// 加载系统提示词
const loadSystemPrompt = async () => {
  if (props.sessionId) {
    try {
      // 1. 优先从数据库加载会话配置
      const session = await chatService.getSession(props.sessionId)
      if (session?.config?.systemPrompt) {
        systemRole.value = session.config.systemPrompt
        console.log('[AIChatSession] ✅ 已从数据库加载会话提示词')
        
        // 同步到 localStorage 作为缓存
        const sessionConfigKey = `chat-session-config-${props.sessionId}`
        localStorage.setItem(sessionConfigKey, JSON.stringify(session.config))
        return
      }
    } catch (error) {
      console.warn('[AIChatSession] ⚠️ 从数据库加载失败，尝试本地缓存:', error)
    }
    
    // 2. 如果数据库加载失败，尝试从 localStorage 加载
    const sessionConfigKey = `chat-session-config-${props.sessionId}`
    const sessionConfig = localStorage.getItem(sessionConfigKey)
    if (sessionConfig) {
      try {
        const config = JSON.parse(sessionConfig)
        if (config.systemPrompt) {
          systemRole.value = config.systemPrompt
          console.log('[AIChatSession] 📦 已从本地缓存加载会话提示词')
          return
        }
      } catch (error) {
        console.error('[AIChatSession] ❌ 解析本地配置失败:', error)
      }
    }
  }
  
  // 3. 如果都没有，加载默认提示词
  const defaultPrompt = localStorage.getItem('default-system-prompt')
  if (defaultPrompt) {
    systemRole.value = defaultPrompt
    console.log('[AIChatSession] 📝 已加载默认提示词')
  } else {
    console.log('[AIChatSession] ℹ️ 未设置系统提示词')
  }
}

// 监听提示词更新事件
const handlePromptUpdate = (event: CustomEvent) => {
  const { sessionId, systemPrompt } = event.detail
  if (sessionId === props.sessionId) {
    systemRole.value = systemPrompt
    console.log('[AIChatSession] 提示词已更新')
  }
}

// 保存当前会话 ID 到 localStorage（用于提示词优化助手）
const saveCurrentSessionId = () => {
  if (props.sessionId) {
    localStorage.setItem('current-session-id', props.sessionId)
  }
}

// 生命周期
onMounted(async () => {
  scrollToBottom()
  await loadSystemPrompt()
  saveCurrentSessionId()
  
  // 监听提示词更新事件
  window.addEventListener('session-prompt-updated', handlePromptUpdate as EventListener)
})

// 清理事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('session-prompt-updated', handlePromptUpdate as EventListener)
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// 监听 sessionId 变化
watch(() => props.sessionId, async () => {
  await loadSystemPrompt()
  saveCurrentSessionId()
})
</script>

<style scoped>
.ai-chat-session {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}

/* 消息区域 */
.messages-area {
  background: var(--vscode-editor-background);
  /* 确保消息区域支持文本选择 */
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.message-item {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 头像样式 */
.message-avatar .avatar {
  transition: transform 0.2s;
}

.message-avatar .avatar:hover {
  transform: scale(1.05);
}

/* 消息气泡 */
.message-bubble {
  word-wrap: break-word;
  word-break: break-word;
  transition: box-shadow 0.2s;
  /* 允许文本选择 */
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  cursor: text;
}

.message-bubble * {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.user-bubble {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.user-bubble * {
  color: var(--vscode-button-foreground) !important;
  /* 确保用户消息也能选择 */
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
}

.assistant-bubble {
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
}

/* 消息内容可选择 */
.message-text {
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  cursor: text !important;
}

/* 用户消息选择高亮 */
.user-bubble .message-text::selection {
  background: var(--vscode-editor-selectionBackground);
  color: var(--vscode-editor-selectionForeground);
}

.user-bubble .message-text::-moz-selection {
  background: var(--vscode-editor-selectionBackground);
  color: var(--vscode-editor-selectionForeground);
}

/* Markdown 内容样式 */
.markdown-content {
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
}

.markdown-content ::selection {
  background: var(--vscode-editor-selectionBackground);
}

.markdown-content ::-moz-selection {
  background: var(--vscode-editor-selectionBackground);
}

.markdown-content pre,
.markdown-content code {
  user-select: text;
  cursor: text;
}

.markdown-content p {
  margin: 0.5em 0;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.markdown-content li {
  margin: 0.25em 0;
}

.markdown-content blockquote {
  border-left: 3px solid var(--vscode-textBlockQuote-border, #007acc);
  padding-left: 1em;
  margin: 0.5em 0;
  color: var(--vscode-textBlockQuote-foreground);
}

.markdown-content a {
  color: var(--vscode-textLink-foreground, #3794ff);
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

.markdown-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid var(--vscode-panel-border);
  padding: 0.5em;
  text-align: left;
}

.markdown-content th {
  background: var(--vscode-editorWidget-background);
  font-weight: 600;
}

/* 流式输出光标 */
.streaming-text .cursor-blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 消息操作按钮 */
.action-button {
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-button:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

/* 输入区域 */
.input-editor {
  min-height: 54px;
  max-height: 200px;
  line-height: 1.5;
}

.input-editor::placeholder {
  color: var(--vscode-input-placeholderForeground);
}

/* 操作工具按钮 */
.action-tool-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.action-tool-button:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

/* 发送按钮 */
.send-button {
  transition: all 0.2s;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Keyboard hint */
.kbd {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  font-size: 0.75rem;
  font-family: monospace;
}

/* 角色设定面板 - 与设置页面风格一致 */
.role-settings-panel {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
}



.role-settings-panel .panel-header {
  background: var(--vscode-bg-lighter) !important;
}

.role-settings-panel .panel-header h3 {
  font-weight: 600;
}

.role-settings-panel .setting-section {
  margin-bottom: 1.5rem;
}

/* 提示词显示区域 */
.prompt-display {
  padding: 12px;
}

.prompt-display :deep(.markdown-renderer) {
  font-size: 0.875rem;
}

.prompt-display :deep(.code-block-container) {
  margin: 8px 0;
}

.role-settings-panel .setting-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vscode-foreground);
  opacity: 1;
}

.role-settings-panel .setting-hint {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--vscode-descriptionForeground);
}

.role-settings-panel .form-textarea {
  font-family: inherit;
  line-height: 1.6;
}

.role-settings-panel .preset-button {
  cursor: pointer;
}

.role-settings-panel .preset-name {
  font-weight: 500;
}

.role-settings-panel .preset-desc {
  line-height: 1.5;
}

/* 设置抽屉 */
.settings-drawer {
  animation: fadeIn 0.2s ease-out;
}

.drawer-content {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.drawer-close-button {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s;
}

.drawer-close-button:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vscode-foreground);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vscode-input-border);
}

.setting-item {
  margin-bottom: 1rem;
}

.setting-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vscode-foreground);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.setting-value {
  font-size: 0.875rem;
}

.setting-input,
.setting-range {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  color: var(--vscode-input-foreground);
  font-size: 0.875rem;
}

.setting-input:focus,
.setting-range:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.setting-value-display {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--vscode-descriptionForeground);
}

.footer-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.footer-button-secondary {
  background: transparent;
  color: var(--vscode-foreground);
  border: 1px solid var(--vscode-input-border);
}

.footer-button-secondary:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.footer-button-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.footer-button-primary:hover {
  background: var(--vscode-button-hoverBackground);
}

/* Markdown 样式 */
.markdown-content :deep(pre.hljs-code-block) {
  background: var(--vscode-textCodeBlock-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.75rem 0;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  background: var(--vscode-textCodeBlock-background);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875em;
}

.markdown-content :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid var(--vscode-textBlockQuote-border);
  background: var(--vscode-textBlockQuote-background);
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.75rem 0;
  border-radius: 0.375rem;
  overflow: hidden;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid var(--vscode-input-border);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.markdown-content :deep(th) {
  background: var(--vscode-input-background);
  font-weight: 600;
}

.markdown-content :deep(p) {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.markdown-content :deep(li) {
  margin: 0.25rem 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 1rem 0 0.5rem;
  font-weight: 600;
}

.markdown-content :deep(a) {
  color: var(--vscode-textLink-foreground);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

/* 工具提示 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

</style>
