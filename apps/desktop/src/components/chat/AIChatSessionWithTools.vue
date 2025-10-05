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
              'message-bubble p-3 rounded-lg group relative border',
              message.role === 'user' 
                ? 'user-message ml-auto bg-vscode-accent border-vscode-accent max-w-3xl' 
                : 'assistant-message bg-vscode-bg-light border-vscode-border text-vscode-fg'
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
            <div class="message-header text-xs font-medium mb-1 opacity-70 flex items-center gap-2">
              <span>{{ message.role === 'user' ? '你' : 'AI 助手' }}</span>
              <span v-if="message.toolUse" class="tool-badge px-2 py-0.5 bg-vscode-bg-darker rounded text-xs">
                <i class="bi bi-tools"></i> {{ message.toolUse.name }}
              </span>
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

            <!-- 工具执行结果 -->
            <div v-if="message.toolResult" class="tool-result mt-3 p-3 bg-vscode-bg-darker rounded border border-vscode-border">
              <div class="flex items-start gap-2">
                <i :class="[
                  'bi text-sm mt-0.5',
                  message.toolResult.success ? 'bi-check-circle text-green-500' : 'bi-x-circle text-red-500'
                ]"></i>
                <div class="flex-1">
                  <div class="text-xs text-vscode-fg-muted mb-1">
                    {{ message.toolResult.success ? '执行成功' : '执行失败' }}
                  </div>
                  <pre v-if="message.toolResult.content" class="text-xs text-vscode-fg whitespace-pre-wrap font-mono">{{ message.toolResult.content }}</pre>
                  <div v-if="message.toolResult.error" class="text-xs text-red-400">{{ message.toolResult.error }}</div>
                </div>
              </div>
            </div>
            
            <!-- 时间戳 -->
            <div class="message-timestamp text-xs opacity-50 mt-2">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- 工具执行进度 -->
        <div v-if="toolExecutionProgress" class="tool-progress p-3 bg-vscode-bg-lighter rounded border border-vscode-border animate-pulse">
          <div class="flex items-center gap-2 text-sm text-vscode-fg">
            <i class="bi bi-hourglass-split animate-spin"></i>
            <span>{{ toolExecutionProgress }}</span>
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
              v-if="showClearButton"
              class="toolbar-button vscode-icon-button"
              title="清空对话"
              @click="handleClearMessages"
            >
              <i class="bi bi-trash"></i>
            </button>
            <div v-if="enableTools" class="tool-indicator flex items-center gap-1 px-2 py-1 rounded bg-vscode-bg-darker text-xs text-vscode-fg-muted">
              <i class="bi bi-tools"></i>
              <span>工具已启用</span>
            </div>
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
            <span v-if="connectionId">
              <i class="bi bi-server"></i>
              SSH 连接已建立
            </span>
            <span v-if="messages.length > 0">
              <i class="bi bi-chat-dots"></i>
              {{ messages.length }} 条消息
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具批准对话框 -->
    <ToolApprovalDialog
      :visible="showToolApproval"
      :request="pendingToolRequest"
      @approve="handleToolApproval"
      @reject="handleToolRejection"
      @close="showToolApproval = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, watch } from 'vue'
import { chatCompletion, type ChatMessage as APIChatMessage } from '../../services/ai-api.service'
import type { AIProvider, AIModel } from '../../types/ai-providers'
import type { ToolApprovalRequest, ToolApprovalResponse, ToolResult } from '../../types/tools'
import { marked } from 'marked'
import hljs from 'highlight.js'
import ToolApprovalDialog from './ToolApprovalDialog.vue'
import { generateSystemPrompt } from '../../services/tools/system-prompt'
import { parseToolUse, executeTool } from '../../services/tools/tool-executor'

// 消息接口
export interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  streaming?: boolean
  toolUse?: {
    name: string
    params: any
  }
  toolResult?: ToolResult
}

// 组件属性
interface Props {
  messages?: Message[]
  currentProvider?: AIProvider | null
  currentModel?: AIModel | null
  connectionId?: string  // SSH 连接 ID
  enableTools?: boolean  // 是否启用工具
  serverInfo?: {
    host: string
    username: string
  }
  sessionName?: string
  sessionId?: string
  multiline?: boolean
  inputRows?: number
  inputPlaceholder?: string
  emptyStateText?: string
  emptyStateSubtext?: string
  showCopyButton?: boolean
  showToolbar?: boolean
  showClearButton?: boolean
  showTokenCount?: boolean
  showStatusInfo?: boolean
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  enableTools: true,
  multiline: false,
  inputRows: 3,
  inputPlaceholder: '输入消息...',
  emptyStateText: '开始与 AI 助手对话',
  showCopyButton: true,
  showToolbar: true,
  showClearButton: true,
  showTokenCount: true,
  showStatusInfo: true,
  autoScroll: true
})

const emit = defineEmits<{
  'send-message': [content: string]
  'clear-messages': []
  'update:messages': [messages: Message[]]
  'tool-executed': [toolName: string, result: ToolResult]
}>()

// 响应式数据
const inputMessage = ref('')
const isGenerating = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const copiedMessageId = ref<number | null>(null)
const internalMessages = ref<Message[]>([...props.messages])

// 工具相关状态
const showToolApproval = ref(false)
const pendingToolRequest = ref<ToolApprovalRequest | null>(null)
const pendingToolResolve = ref<((response: ToolApprovalResponse) => void) | null>(null)
const toolExecutionProgress = ref('')

// 监听外部消息变化
watch(() => props.messages, (newMessages) => {
  internalMessages.value = [...newMessages]
}, { deep: true })

// 计算属性
const messages = computed(() => internalMessages.value)

// Markdown 渲染配置
const renderer: any = new marked.Renderer()
renderer.code = (code: any) => {
  const codeStr = String(code.text || code || '')
  const langStr = String(code.lang || '')
  
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
    const contentStr = String(content || '')
    if (!contentStr.trim()) {
      return contentStr
    }
    const result: any = marked(contentStr)
    return result ? String(result) : ''
  } catch (error) {
    console.error('Markdown rendering error:', error)
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

/**
 * 请求工具批准
 */
const requestToolApproval = (toolName: string, params: any, description: string): Promise<ToolApprovalResponse> => {
  console.log('[Chat] ========== 请求工具批准 ==========')
  console.log('[Chat] 工具名称:', toolName)
  console.log('[Chat] 参数:', params)
  console.log('[Chat] 描述:', description)
  
  return new Promise((resolve) => {
    pendingToolRequest.value = {
      tool: toolName,
      params,
      description,
      timestamp: Date.now()
    }
    pendingToolResolve.value = resolve
    showToolApproval.value = true
    console.log('[Chat] 批准对话框已显示')
  })
}

const handleToolApproval = (response: ToolApprovalResponse) => {
  console.log('[Chat] ✅ 用户批准工具执行')
  console.log('[Chat] 反馈:', response.feedback)
  if (pendingToolResolve.value) {
    pendingToolResolve.value(response)
    pendingToolResolve.value = null
  }
}

const handleToolRejection = (response: ToolApprovalResponse) => {
  console.log('[Chat] ❌ 用户拒绝工具执行')
  if (pendingToolResolve.value) {
    pendingToolResolve.value(response)
    pendingToolResolve.value = null
  }
}

/**
 * 执行工具调用
 */
const executeToolCall = async (toolName: string, params: any): Promise<ToolResult> => {
  console.log('[Chat] ========== 开始执行工具调用 ==========')
  console.log('[Chat] 工具名称:', toolName)
  console.log('[Chat] 参数:', params)
  console.log('[Chat] 连接ID:', props.connectionId)
  console.log('[Chat] enableTools:', props.enableTools)
  
  // 生成描述
  let description = `AI 助手请求执行工具: ${toolName}`
  if (toolName === 'execute_ssh_command') {
    description = `AI 助手请求执行 SSH 命令:\n${params.command}`
  } else if (toolName === 'read_file') {
    description = `AI 助手请求读取文件: ${params.path}`
  }

  console.log('[Chat] 描述:', description)
  console.log('[Chat] 等待用户批准...')

  // 请求用户批准
  const approval = await requestToolApproval(toolName, params, description)

  console.log('[Chat] 用户响应:', approval)

  if (!approval.approved) {
    console.log('[Chat] ❌ 用户拒绝')
    return {
      success: false,
      content: '',
      error: '用户拒绝执行此工具'
    }
  }

  console.log('[Chat] ✅ 用户批准，准备执行')

  // 如果用户提供了反馈，修改参数
  if (approval.feedback) {
    console.log('[Chat] 用户提供了反馈:', approval.feedback)
    if (toolName === 'execute_ssh_command') {
      params.command = `${params.command} # ${approval.feedback}`
      console.log('[Chat] 修改后的命令:', params.command)
    }
  }

  // 执行工具
  if (!props.connectionId && toolName !== 'ask_followup_question' && toolName !== 'attempt_completion') {
    console.error('[Chat] ❌ 未建立 SSH 连接')
    return {
      success: false,
      content: '',
      error: '未建立 SSH 连接'
    }
  }

  console.log('[Chat] 调用 executeTool...')

  const result = await executeTool(
    toolName,
    params,
    props.connectionId || '',
    (progress) => {
      console.log('[Chat] 进度:', progress)
      toolExecutionProgress.value = progress
    }
  )

  toolExecutionProgress.value = ''

  console.log('[Chat] 工具执行完成')
  console.log('[Chat] 结果:', result)

  // 发出工具执行事件
  emit('tool-executed', toolName, result)

  return result
}

const handleSendMessage = async () => {
  console.log('[Chat] ========== 用户发送消息 ==========')
  console.log('[Chat] 输入内容:', inputMessage.value)
  console.log('[Chat] 是否正在生成:', isGenerating.value)
  
  if (!inputMessage.value.trim() || isGenerating.value) {
    console.log('[Chat] ⚠️ 消息为空或正在生成，跳过')
    return
  }
  
  const content = inputMessage.value.trim()
  inputMessage.value = ''
  
  console.log('[Chat] 发送消息:', content)
  console.log('[Chat] props.messages.length:', props.messages.length)
  
  // 不再 emit send-message，因为父组件不需要处理了
  // emit('send-message', content)
  
  // 直接调用 sendMessageInternal 处理消息
  console.log('[Chat] 直接调用 sendMessageInternal')
  await sendMessageInternal(content)
}

const sendMessageInternal = async (content: string) => {
  console.log('[Chat] ========== sendMessageInternal 被调用 ==========')
  console.log('[Chat] 消息内容:', content)
  console.log('[Chat] 当前提供商:', props.currentProvider)
  console.log('[Chat] 当前模型:', props.currentModel)
  console.log('[Chat] 连接ID:', props.connectionId)
  console.log('[Chat] 工具启用:', props.enableTools)
  
  if (!props.currentProvider || !props.currentModel) {
    console.log('[Chat] ❌ 没有选择 AI 模型')
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
  
  console.log('[Chat] ✅ AI 模型已配置，开始处理消息')
  
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
  
  console.log('[Chat] 用户消息已添加，准备 AI 响应')
  
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
    console.log('[Chat] 开始准备 API 请求')
    
    // 准备 API 消息格式
    const apiMessages: APIChatMessage[] = []

    // 添加系统提示词（如果启用工具）
    if (props.enableTools) {
      console.log('[Chat] 工具已启用，生成系统提示词')
      const systemPrompt = generateSystemPrompt({
        enableSSH: true,
        enableFileOps: true,
        serverInfo: props.serverInfo
      })
      console.log('[Chat] 系统提示词长度:', systemPrompt.length)
      console.log('[Chat] 系统提示词前500字符:')
      console.log(systemPrompt.substring(0, 500))
      console.log('[Chat] 系统提示词后500字符:')
      console.log(systemPrompt.substring(systemPrompt.length - 500))
      
      apiMessages.push({
        role: 'system',
        content: systemPrompt
      })
    } else {
      console.log('[Chat] ⚠️ 工具未启用，跳过系统提示词')
    }

    // 添加历史消息
    console.log('[Chat] 添加历史消息，当前消息数:', internalMessages.value.length)
    internalMessages.value
      .filter(msg => !msg.streaming && msg.role !== 'system')
      .forEach(msg => {
        apiMessages.push({
          role: msg.role,
          content: msg.content
        })

        // 如果有工具结果，添加为独立消息
        if (msg.toolResult) {
          apiMessages.push({
            role: 'user',
            content: `Tool execution result:\n${msg.toolResult.content}`
          })
        }
      })
    
    // 添加当前用户消息
    apiMessages.push({
      role: 'user',
      content
    })
    
    console.log('[Chat] API 消息总数:', apiMessages.length)
    console.log('[Chat] 💬 发送给 AI 的消息预览:')
    apiMessages.forEach((msg, index) => {
      console.log(`  ${index + 1}. [${msg.role}] ${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}`)
    })
    
    // 获取 API 密钥配置
    const configsStr = localStorage.getItem('aiProviderConfigs') || '[]'
    const configs = JSON.parse(configsStr)
    const providerConfig = configs.find((p: any) => p.id === props.currentProvider?.id)
    
    if (!providerConfig?.apiKey) {
      console.error('[Chat] ❌ 未找到 API 密钥配置')
      throw new Error('未找到 API 密钥配置')
    }
    
    console.log('[Chat] ✅ API 密钥已找到')
    
    const providerWithApiKey = {
      ...props.currentProvider,
      apiKey: providerConfig.apiKey
    }
    
    console.log('[Chat] 准备调用 AI API...')
    console.log('[Chat] 提供商:', props.currentProvider?.name)
    console.log('[Chat] 模型:', props.currentModel?.id)
    
    // 调用 AI API
    console.log('[Chat] 🚀 调用 AI API (流式输出)...')
    const response = await chatCompletion(
      providerWithApiKey,
      props.currentModel,
      {
        messages: apiMessages,
        stream: true
      },
      (chunk) => {
        assistantMessage.content += chunk.content || ''
        internalMessages.value = [...internalMessages.value]
        scrollToBottom()
      }
    )
    
    console.log('[Chat] ✅ AI API 调用完成')
    console.log('[Chat] 响应内容长度:', response.content?.length || 0)
    console.log('[Chat] 响应内容类型:', typeof response.content)
    console.log('[Chat] 响应对象:', response)
    
    // 完成流式输出
    assistantMessage.streaming = false
    assistantMessage.content = response.content
    
    console.log('[Chat] AI 完整响应:')
    console.log(response.content)
    console.log('[Chat] AI 响应字符码:', response.content ? [...response.content].map(c => c.charCodeAt(0)) : 'empty')

    // 检查是否包含工具调用
    console.log('[Chat] 检查是否包含工具调用...')
    console.log('[Chat] enableTools:', props.enableTools)
    console.log('[Chat] AI 响应内容长度:', assistantMessage.content.length)
    
    if (props.enableTools) {
      console.log('[Chat] 工具已启用，解析 AI 响应...')
      const toolUse = parseToolUse(assistantMessage.content)
      
      console.log('[Chat] 解析结果:', toolUse)
      
      if (toolUse) {
        console.log('[Chat] ✅ 检测到工具调用!')
        console.log('[Chat] 工具名:', toolUse.toolName)
        console.log('[Chat] 参数:', toolUse.params)
        
        // 保存工具调用信息
        assistantMessage.toolUse = {
          name: toolUse.toolName,
          params: toolUse.params
        }

        // 执行工具
        try {
          console.log('[Chat] 开始执行工具...')
          const toolResult = await executeToolCall(toolUse.toolName, toolUse.params)
          assistantMessage.toolResult = toolResult
          
          console.log('[Chat] 工具执行结果:', toolResult)

          // 如果工具执行成功，继续对话让 AI 处理结果
          if (toolResult.success && toolUse.toolName !== 'attempt_completion') {
            console.log('[Chat] 工具执行成功，继续对话...')
            emit('update:messages', internalMessages.value)
            scrollToBottom()

            // 递归调用以处理工具结果
            await sendMessageInternal('Please analyze the tool execution result and continue.')
            return
          }
        } catch (error: any) {
          console.error('[Chat] 工具执行异常:', error)
          assistantMessage.toolResult = {
            success: false,
            content: '',
            error: error.message
          }
        }
      } else {
        console.log('[Chat] ❌ 未检测到工具调用')
      }
    } else {
      console.log('[Chat] ⚠️ 工具未启用')
    }

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
  color: #ffffff !important;
}

.user-message * {
  color: #ffffff !important;
}

.assistant-message {
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  color: var(--vscode-editor-foreground);
}

.tool-badge {
  border: 1px solid var(--vscode-border);
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

.tool-indicator {
  border: 1px solid var(--vscode-border);
}

.tool-progress {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.tool-result {
  font-size: 0.875rem;
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

