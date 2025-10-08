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
          <div v-for="message in messages" :key="message.id" class="message-item mb-6">
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
                  'message-content-wrapper flex-1 min-w-0',
                  message.role === 'user' ? 'max-w-2xl' : ''
                ]"
              >
                <!-- 消息头部：名称和时间 -->
                <div 
                  :class="[
                    'message-header flex items-center gap-2 mb-1.5',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  ]"
                >
                  <span class="message-name text-xs font-medium text-vscode-fg opacity-90">
                    {{ message.role === 'user' ? '你' : (currentModel?.name || 'AI 助手') }}
                  </span>
                  <span class="message-time text-xs opacity-50">
                    {{ formatTime(message.timestamp) }}
                  </span>
                </div>

                <!-- 消息气泡 -->
                <div class="message-bubble-container group relative">
                  <div 
                    :class="[
                      'message-bubble rounded-lg px-4 py-3 relative',
                      message.role === 'user' 
                        ? 'bg-vscode-button-background text-white user-bubble' 
                        : 'bg-vscode-input-background border border-vscode-input-border assistant-bubble'
                    ]"
                  >
                    <!-- 用户消息内容 -->
                    <div 
                      v-if="message.role === 'user'"
                      class="message-text whitespace-pre-wrap break-words text-sm leading-relaxed"
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
                      v-html="renderMarkdown(message.content)"
                    ></div>
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
      <div class="input-area border-t border-vscode-border bg-vscode-editor-background">
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
            <div class="input-actions flex items-center justify-between px-4 pb-3 pt-1">
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

          <!-- 底部提示 -->
          <div v-if="showFootnote" class="footnote text-center mt-2">
            <span class="text-xs text-vscode-descriptionForeground opacity-75">
              按 <kbd class="kbd">Ctrl+Enter</kbd> 发送消息 · AI 可能会犯错，请检查重要信息
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧面板：系统角色设定 -->
    <div 
      v-if="showSystemRolePanel"
      class="system-role-panel flex-shrink-0 w-80 border-l border-vscode-border bg-vscode-sideBar-background overflow-y-auto"
    >
      <div class="panel-header px-4 py-3 border-b border-vscode-border sticky top-0 bg-vscode-sideBar-background z-10">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-vscode-sideBarTitle-foreground flex items-center gap-2">
            <i class="bi bi-chat-square-text"></i>
            <span>系统提示词</span>
          </h3>
          <button
            @click="toggleSystemRolePanel"
            class="panel-close-button"
            title="关闭面板"
          >
            <i class="bi bi-x-lg text-xs"></i>
          </button>
        </div>
      </div>

      <div class="panel-content px-4 py-4">
        <!-- 系统角色编辑区 -->
        <div class="system-role-editor">
          <div class="editor-label text-xs font-medium text-vscode-foreground mb-2 opacity-70">
            系统角色设定
          </div>
          <textarea
            v-model="systemRole"
            @input="handleSystemRoleChange"
            placeholder="输入系统提示词，例如：你是一个专业的编程助手..."
            class="system-role-textarea w-full px-3 py-2 border border-vscode-input-border rounded-md bg-vscode-input-background text-vscode-input-foreground text-sm resize-none focus:outline-none focus:border-vscode-focusBorder"
            rows="8"
          ></textarea>
          <div class="editor-hint text-xs text-vscode-descriptionForeground mt-2">
            系统提示词将影响 AI 的行为和回复风格
          </div>
        </div>

        <!-- 预设模板 -->
        <div class="role-presets mt-6">
          <div class="presets-label text-xs font-medium text-vscode-foreground mb-2 opacity-70">
            预设模板
          </div>
          <div class="presets-list space-y-2">
            <button
              v-for="preset in rolePresets"
              :key="preset.id"
              @click="applyPreset(preset)"
              class="preset-button w-full text-left px-3 py-2 rounded-md border border-vscode-input-border hover:bg-vscode-list-hoverBackground transition-colors"
            >
              <div class="preset-name text-sm font-medium text-vscode-foreground mb-0.5">
                {{ preset.name }}
              </div>
              <div class="preset-desc text-xs text-vscode-descriptionForeground line-clamp-2">
                {{ preset.description }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 会话设置抽屉 -->
    <Transition name="drawer">
      <div 
        v-if="showSessionSettings"
        class="session-settings-overlay fixed inset-0 bg-black bg-opacity-50 z-50"
        @click="closeSessionSettings"
      >
        <div 
          class="session-settings-drawer fixed bottom-0 left-0 right-0 bg-vscode-sideBar-background border-t border-vscode-border rounded-t-xl shadow-2xl"
          @click.stop
        >
          <!-- 抽屉头部 -->
          <div class="drawer-header px-6 py-4 border-b border-vscode-border flex items-center justify-between">
            <h2 class="text-lg font-semibold text-vscode-foreground flex items-center gap-2">
              <i class="bi bi-gear-fill"></i>
              <span>会话设置</span>
            </h2>
            <button
              @click="closeSessionSettings"
              class="close-button p-2 rounded-md hover:bg-vscode-list-hoverBackground transition-colors"
              title="关闭"
            >
              <i class="bi bi-x-lg text-lg"></i>
            </button>
          </div>

          <!-- 抽屉内容 -->
          <div class="drawer-content px-6 py-6 max-h-96 overflow-y-auto">
            <div class="settings-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 会话名称 -->
              <div class="setting-item">
                <label class="setting-label text-sm font-medium text-vscode-foreground mb-2 block">
                  <i class="bi bi-chat-dots mr-2"></i>
                  会话名称
                </label>
                <input
                  v-model="sessionNameEdit"
                  @blur="saveSessionName"
                  type="text"
                  placeholder="输入会话名称..."
                  class="setting-input w-full px-3 py-2 border border-vscode-input-border rounded-md bg-vscode-input-background text-vscode-input-foreground text-sm focus:outline-none focus:border-vscode-focusBorder"
                />
                <p class="setting-hint text-xs text-vscode-descriptionForeground mt-1">
                  为此会话设置一个易于识别的名称
                </p>
              </div>

              <!-- 温度参数 -->
              <div class="setting-item">
                <label class="setting-label text-sm font-medium text-vscode-foreground mb-2 block">
                  <i class="bi bi-thermometer-half mr-2"></i>
                  温度 (Temperature)
                </label>
                <div class="flex items-center gap-3">
                  <input
                    v-model.number="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    class="setting-slider flex-1"
                  />
                  <span class="temperature-value text-sm font-mono text-vscode-foreground bg-vscode-input-background px-2 py-1 rounded border border-vscode-input-border min-w-[3rem] text-center">
                    {{ temperature.toFixed(1) }}
                  </span>
                </div>
                <p class="setting-hint text-xs text-vscode-descriptionForeground mt-1">
                  较低值使输出更确定，较高值使输出更随机（0-2）
                </p>
              </div>

              <!-- 最大令牌数 -->
              <div class="setting-item">
                <label class="setting-label text-sm font-medium text-vscode-foreground mb-2 block">
                  <i class="bi bi-file-text mr-2"></i>
                  最大令牌数 (Max Tokens)
                </label>
                <div class="flex items-center gap-3">
                  <input
                    v-model.number="maxTokens"
                    type="range"
                    min="256"
                    max="8192"
                    step="256"
                    class="setting-slider flex-1"
                  />
                  <span class="max-tokens-value text-sm font-mono text-vscode-foreground bg-vscode-input-background px-2 py-1 rounded border border-vscode-input-border min-w-[4rem] text-center">
                    {{ maxTokens }}
                  </span>
                </div>
                <p class="setting-hint text-xs text-vscode-descriptionForeground mt-1">
                  控制 AI 响应的最大长度（256-8192）
                </p>
              </div>

              <!-- 当前模型信息 -->
              <div class="setting-item">
                <label class="setting-label text-sm font-medium text-vscode-foreground mb-2 block">
                  <i class="bi bi-cpu mr-2"></i>
                  当前模型
                </label>
                <div class="model-info px-3 py-2 border border-vscode-input-border rounded-md bg-vscode-input-background text-sm">
                  <div v-if="currentModel" class="flex items-center justify-between">
                    <span class="text-vscode-foreground">{{ currentModel.name }}</span>
                    <button
                      @click="$emit('open-model-selector')"
                      class="text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground text-xs"
                    >
                      <i class="bi bi-pencil mr-1"></i>更换
                    </button>
                  </div>
                  <div v-else class="text-vscode-descriptionForeground">
                    未选择模型
                  </div>
                </div>
                <p class="setting-hint text-xs text-vscode-descriptionForeground mt-1">
                  点击"更换"选择其他 AI 模型
                </p>
              </div>
            </div>
          </div>

          <!-- 抽屉底部 -->
          <div class="drawer-footer px-6 py-4 border-t border-vscode-border flex items-center justify-between bg-vscode-sideBar-background">
            <div class="footer-hint text-xs text-vscode-descriptionForeground">
              <i class="bi bi-info-circle mr-1"></i>
              这些设置仅影响当前会话
            </div>
            <button
              @click="closeSessionSettings"
              class="done-button px-4 py-2 bg-vscode-button-background text-vscode-button-foreground rounded-md hover:bg-vscode-button-hoverBackground transition-colors text-sm font-medium"
            >
              <i class="bi bi-check-lg mr-1"></i>
              完成
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, watch } from 'vue'
import { chatCompletion, type ChatMessage as APIChatMessage } from '../../services/ai-api.service'
import type { AIProvider, AIModel } from '../../types/ai-providers'
import { settingsService } from '../../services/settings.service'
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

// 角色预设接口
interface RolePreset {
  id: string
  name: string
  description: string
  prompt: string
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
const inputHeight = ref(44)
const isGenerating = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const inputTextarea = ref<HTMLTextAreaElement | null>(null)
const copiedMessageId = ref<number | null>(null)

// UI 状态
const showSystemRolePanel = ref(false)
const showSessionSettings = ref(false)

// 系统角色和设置
const systemRole = ref('')
const temperature = ref(0.7)
const maxTokens = ref(4096)
const sessionNameEdit = ref('')

// 内部消息列表
const internalMessages = ref<Message[]>([...props.messages])

// 监听外部消息变化
watch(() => props.messages, (newMessages) => {
  internalMessages.value = [...newMessages]
}, { deep: true })

// 计算属性
const messages = computed(() => internalMessages.value)
const canSend = computed(() => inputMessage.value.trim() && !isGenerating.value)

// 角色预设模板
const rolePresets: RolePreset[] = [
  {
    id: 'default',
    name: '通用助手',
    description: '友好、专业的 AI 助手',
    prompt: '你是一个友好、专业的 AI 助手。请用清晰、准确的语言回答用户的问题。'
  },
  {
    id: 'programmer',
    name: '编程助手',
    description: '专业的编程和技术顾问',
    prompt: '你是一个专业的编程助手。擅长各种编程语言和开发工具，能提供高质量的代码示例和技术建议。'
  },
  {
    id: 'translator',
    name: '翻译助手',
    description: '专业的中英文翻译',
    prompt: '你是一个专业的翻译助手。请提供准确、流畅的翻译，并保持原文的语气和风格。'
  },
  {
    id: 'writer',
    name: '写作助手',
    description: '创意写作和文案优化',
    prompt: '你是一个创意写作助手。擅长各类文体写作，能够提供优质的文案建议和内容优化。'
  }
]

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
const renderMarkdown = (content: string): string => {
  try {
    const contentStr = String(content || '')
    if (!contentStr.trim()) return contentStr
    const result = marked(contentStr)
    return typeof result === 'string' ? result : contentStr
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return String(content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}

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
  inputHeight.value = Math.min(Math.max(scrollHeight, 44), 200)
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
  inputHeight.value = 44
  
  emit('send-message', content)
  
  // 如果没有外部处理，则内部处理
  if (props.messages.length === 0) {
    await sendMessageInternal(content)
  }
}

const sendMessageInternal = async (content: string) => {
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
    
    // 添加系统角色（如果有）
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

// 系统角色面板
const toggleSystemRolePanel = () => {
  showSystemRolePanel.value = !showSystemRolePanel.value
}

const handleSystemRoleChange = () => {
  // 可以在这里触发保存事件
}

const applyPreset = (preset: RolePreset) => {
  systemRole.value = preset.prompt
}

// 打开会话设置
const openSettings = () => {
  sessionNameEdit.value = props.sessionName || ''
  showSessionSettings.value = true
}

// 关闭会话设置
const closeSessionSettings = () => {
  showSessionSettings.value = false
}

// 保存会话名称
const saveSessionName = () => {
  if (sessionNameEdit.value.trim()) {
    emit('update:session-name', sessionNameEdit.value.trim())
  }
}

// 生命周期
onMounted(() => {
  scrollToBottom()
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.ai-chat-session {
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}

/* 消息区域 */
.messages-area {
  background: var(--vscode-editor-background);
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
}

.user-bubble {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.user-bubble * {
  color: var(--vscode-button-foreground) !important;
}

.assistant-bubble {
  background: var(--vscode-input-background);
  border-color: var(--vscode-input-border);
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
  min-height: 44px;
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

/* 系统角色面板 */
.system-role-panel {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.panel-close-button {
  padding: 0.375rem;
  border-radius: 0.25rem;
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s;
}

.panel-close-button:hover {
  opacity: 1;
  background: var(--vscode-toolbar-hoverBackground);
}

.system-role-textarea {
  font-family: inherit;
  line-height: 1.5;
}

.preset-button {
  background: var(--vscode-input-background);
  transition: all 0.2s;
}

.preset-button:hover {
  background: var(--vscode-list-hoverBackground);
  border-color: var(--vscode-focusBorder);
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

/* 会话设置抽屉 */
.session-settings-overlay {
  display: flex;
  align-items: flex-end;
  backdrop-filter: blur(2px);
}

.session-settings-drawer {
  max-height: 70vh;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .session-settings-drawer,
.drawer-leave-active .session-settings-drawer {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from .session-settings-drawer,
.drawer-leave-to .session-settings-drawer {
  transform: translateY(100%);
}

.setting-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: var(--vscode-input-border);
  outline: none;
  cursor: pointer;
}

.setting-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vscode-button-background);
  cursor: pointer;
  transition: all 0.2s;
}

.setting-slider::-webkit-slider-thumb:hover {
  background: var(--vscode-button-hoverBackground);
  transform: scale(1.1);
}

.setting-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vscode-button-background);
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.setting-slider::-moz-range-thumb:hover {
  background: var(--vscode-button-hoverBackground);
  transform: scale(1.1);
}

.close-button {
  color: var(--vscode-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  color: var(--vscode-errorForeground);
}
</style>
