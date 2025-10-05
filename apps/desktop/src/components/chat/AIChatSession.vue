<template>
  <div class="ai-chat-session h-full flex flex-col">
    <!-- 消息区域 -->
    <div ref="messagesContainer" class="messages-area flex-1 overflow-y-auto scrollbar-thin">
      <div class="messages-content p-4">
        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="empty-state text-center text-vscode-fg-muted py-8">
          <div class="empty-icon mb-4">
            <i class="bi bi-chat-dots text-4xl opacity-50"></i>
          </div>
          <p class="text-sm">{{ emptyStateText || '开始与 AI 助手对话' }}</p>
          <p v-if="emptyStateSubtext" class="text-xs mt-2 opacity-75">{{ emptyStateSubtext }}</p>
        </div>
        
        <!-- 消息列表 -->
        <div v-for="message in messages" :key="message.id" class="message mb-4">
          <div 
            :class="[
              'message-bubble max-w-3xl p-3 rounded-lg group relative',
              message.role === 'user' 
                ? 'user-message ml-auto bg-vscode-accent text-white' 
                : 'assistant-message mr-auto bg-vscode-bg-light border border-vscode-border text-vscode-fg'
            ]"
          >
            <!-- 复制按钮 -->
            <button
              v-if="message.role === 'assistant' && message.content && showCopyButton"
              @click="copyMessage(message.content, message.id)"
              :class="[
                'copy-button absolute top-2 right-2 p-1.5 rounded transition-opacity',
                'opacity-0 group-hover:opacity-100',
                copiedMessageId === message.id 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-vscode-bg hover:bg-vscode-bg-lighter text-vscode-fg-muted hover:text-vscode-fg'
              ]"
              :title="copiedMessageId === message.id ? '已复制' : '复制内容'"
            >
              <i 
                :class="[
                  'bi text-xs',
                  copiedMessageId === message.id ? 'bi-check2' : 'bi-clipboard'
                ]"
              ></i>
            </button>
            
            <!-- 消息头部 -->
            <div class="message-header text-xs font-medium mb-1 opacity-70">
              {{ message.role === 'user' ? '你' : 'AI 助手' }}
            </div>
            
            <!-- 消息内容 -->
            <div 
              v-if="message.role === 'user'"
              class="message-content whitespace-pre-wrap text-sm pr-8"
            >
              {{ message.content }}
            </div>
            <!-- AI 消息：流式输出时显示纯文本，完成后渲染 Markdown -->
            <div 
              v-else-if="message.streaming"
              class="message-content whitespace-pre-wrap text-sm pr-8 streaming-text"
            >
              {{ message.content }}<span class="cursor-blink">▋</span>
            </div>
            <div 
              v-else
              class="message-content markdown-content text-sm pr-8"
              v-html="renderMarkdown(message.content)"
            ></div>
            
            <!-- 时间戳 -->
            <div class="message-timestamp text-xs opacity-50 mt-2">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-area border-t border-vscode-border p-4">
      <div class="input-container flex flex-col space-y-2">
        <div class="input-row flex gap-2">
          <textarea
            v-if="multiline"
            v-model="inputMessage"
            @keydown.ctrl.enter="handleSendMessage"
            @keydown.meta.enter="handleSendMessage"
            :disabled="isGenerating"
            :placeholder="inputPlaceholder"
            class="input-field flex-1 resize-none form-input-full"
            :rows="inputRows"
          ></textarea>
          <input
            v-else
            v-model="inputMessage"
            @keyup.enter="handleSendMessage"
            type="text"
            :placeholder="inputPlaceholder"
            :disabled="isGenerating"
            class="input-field flex-1 px-3 py-2 border rounded-md bg-vscode-bg border-vscode-border text-vscode-fg placeholder-vscode-fg-muted disabled:opacity-50"
          />
          <button
            @click="handleSendMessage"
            :disabled="!inputMessage.trim() || isGenerating"
            class="send-button px-4 py-2 bg-vscode-accent text-white rounded-md hover:bg-vscode-accent-hover disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="isGenerating" class="bi bi-hourglass-split animate-spin"></i>
            <span>{{ isGenerating ? '生成中...' : '发送' }}</span>
          </button>
        </div>
        
        <!-- 工具栏 -->
        <div v-if="showToolbar" class="toolbar flex items-center justify-between">
          <div class="toolbar-left flex items-center space-x-2">
            <button 
              v-if="showAttachButton"
              class="toolbar-button vscode-icon-button"
              title="附加文件"
              @click="$emit('attach-file')"
            >
              <i class="bi bi-paperclip"></i>
            </button>
            <button 
              v-if="showClearButton"
              class="toolbar-button vscode-icon-button"
              title="清空对话"
              @click="handleClearMessages"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="toolbar-right">
            <span v-if="inputMessage.trim() && showTokenCount" class="token-count text-xs text-vscode-fg-muted">
              <i class="bi bi-coin"></i>
              约 {{ estimateTokens(inputMessage) }} tokens
            </span>
          </div>
        </div>
        
        <!-- 状态信息 -->
        <div v-if="showStatusInfo && (currentModel || messages.length > 0)" class="status-info flex items-center justify-between text-xs text-vscode-fg-muted">
          <div class="status-left flex items-center gap-3">
            <span v-if="currentModel && currentProvider">
              <i class="bi bi-cpu"></i>
              {{ currentProvider.name }} - {{ currentModel.name }}
            </span>
            <span v-if="sessionName">
              <i class="bi bi-bookmark"></i>
              会话: {{ sessionName }}
            </span>
            <span v-if="messages.length > 0">
              <i class="bi bi-chat-dots"></i>
              {{ messages.length }} 条消息
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { chatCompletion, estimateRequestTokens, type ChatMessage as APIChatMessage } from '../../services/ai-api.service'
import type { AIProvider, AIModel } from '../../types/ai-providers'
import { marked } from 'marked'
import hljs from 'highlight.js'

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
  // 消息数据
  messages?: Message[]
  // 当前选择的模型
  currentProvider?: AIProvider | null
  currentModel?: AIModel | null
  // 会话信息
  sessionName?: string
  sessionId?: string
  // UI 配置
  multiline?: boolean
  inputRows?: number
  inputPlaceholder?: string
  emptyStateText?: string
  emptyStateSubtext?: string
  // 功能开关
  showCopyButton?: boolean
  showToolbar?: boolean
  showAttachButton?: boolean
  showClearButton?: boolean
  showTokenCount?: boolean
  showStatusInfo?: boolean
  // 自动滚动
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  multiline: false,
  inputRows: 3,
  inputPlaceholder: '输入消息...',
  emptyStateText: '开始与 AI 助手对话',
  showCopyButton: true,
  showToolbar: true,
  showAttachButton: false,
  showClearButton: true,
  showTokenCount: true,
  showStatusInfo: true,
  autoScroll: true
})

// 组件事件
const emit = defineEmits<{
  'send-message': [content: string]
  'clear-messages': []
  'attach-file': []
  'update:messages': [messages: Message[]]
}>()

// 响应式数据
const inputMessage = ref('')
const isGenerating = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const copiedMessageId = ref<number | null>(null)

// 内部消息列表
const internalMessages = ref<Message[]>([...props.messages])

// 监听外部消息变化
watch(() => props.messages, (newMessages) => {
  internalMessages.value = [...newMessages]
}, { deep: true })

// 计算属性
const messages = computed(() => internalMessages.value)

// Markdown 渲染配置
const renderer = new marked.Renderer()
renderer.code = (code: string | any, language: string | any) => {
  // 确保 code 和 language 都是字符串
  const codeStr = String(code || '')
  const langStr = String(language || '')
  
  const validLanguage = hljs.getLanguage(langStr) ? langStr : 'plaintext'
  const highlighted = hljs.highlight(codeStr, { language: validLanguage }).value
  return `<pre class="hljs bg-vscode-bg-darker rounded p-3 my-2 overflow-x-auto"><code class="language-${validLanguage}">${highlighted}</code></pre>`
}

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

// 方法
const renderMarkdown = (content: string): string => {
  try {
    // 确保 content 是字符串
    const contentStr = String(content || '')
    if (!contentStr.trim()) {
      return contentStr
    }
    return marked(contentStr)
  } catch (error) {
    console.error('Markdown rendering error:', error)
    // 返回原始内容，但进行 HTML 转义以防止 XSS
    return String(content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}

const formatTime = (date: Date): string => {
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

const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isGenerating.value) return
  
  const content = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 发送消息事件
  emit('send-message', content)
  
  // 如果没有外部处理，则内部处理
  if (props.messages.length === 0) {
    await sendMessageInternal(content)
  }
}

const sendMessageInternal = async (content: string) => {
  // 检查是否选择了模型
  if (!props.currentProvider || !props.currentModel) {
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
    
    // 添加当前用户消息
    apiMessages.push({
      role: 'user',
      content
    })
    
    // 获取加密的 API 密钥
    const configs = JSON.parse(localStorage.getItem('aiProviderConfigs') || '{}')
    const providerConfig = configs[props.currentProvider.id]
    
    if (!providerConfig?.apiKey) {
      throw new Error('未找到 API 密钥配置')
    }
    
    const apiKey = providerConfig.apiKey
    
    // 调用 AI API
    const response = await chatCompletion({
      provider: props.currentProvider,
      model: props.currentModel,
      messages: apiMessages,
      apiKey,
      baseUrl: providerConfig.baseUrl,
      onStream: (chunk: string) => {
        assistantMessage.content += chunk
        scrollToBottom()
      }
    })
    
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
  emit('clear-messages')
  if (props.messages.length === 0) {
    internalMessages.value = []
    emit('update:messages', internalMessages.value)
  }
}

// 生命周期
onMounted(() => {
  scrollToBottom()
})

// 监听消息变化自动滚动
watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.ai-chat-session {
  background: var(--vscode-editor-background);
}

.messages-area {
  background: var(--vscode-editor-background);
}

.message-bubble {
  word-wrap: break-word;
  word-break: break-word;
}

.user-message {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.assistant-message {
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  color: var(--vscode-editor-foreground);
}

.copy-button {
  font-size: 12px;
}

.streaming-text .cursor-blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.input-field {
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  color: var(--vscode-input-foreground);
}

.input-field:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.send-button {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.send-button:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-button {
  padding: 6px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: var(--vscode-icon-foreground);
  cursor: pointer;
  transition: background-color 0.2s;
}

.toolbar-button:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.status-info {
  font-size: 11px;
  color: var(--vscode-descriptionForeground);
}

.token-count {
  font-size: 11px;
  color: var(--vscode-descriptionForeground);
}

/* Markdown 样式 */
.markdown-content :deep(pre) {
  background: var(--vscode-textCodeBlock-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  background: var(--vscode-textCodeBlock-background);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid var(--vscode-textBlockQuote-border);
  background: var(--vscode-textBlockQuote-background);
  margin: 8px 0;
  padding: 8px 16px;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid var(--vscode-input-border);
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(th) {
  background: var(--vscode-input-background);
  font-weight: 600;
}
</style>
