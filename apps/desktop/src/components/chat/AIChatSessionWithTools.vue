<template>
  <div class="ai-chat-session" :class="{ 'generating': isGenerating }">
    <!-- 消息列表 -->
    <div 
      ref="messagesContainer" 
      class="messages-area"
      :style="{ maxHeight: maxHeight || 'calc(100vh - 200px)' }"
    >
      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-chat-dots"></i>
        </div>
        <div class="empty-text">{{ emptyStateText }}</div>
        <div v-if="emptyStateSubtext" class="empty-subtext">{{ emptyStateSubtext }}</div>
      </div>

      <!-- 消息列表 -->
      <div v-else class="messages-list">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message-row"
          :class="[
            `message-${message.role}`,
            { 'message-streaming': message.streaming },
            { 'message-has-tool': message.toolUse }
          ]"
        >
          <div class="message-container">
            <!-- 消息头部（图标 + 角色） -->
            <div class="message-header">
              <div class="message-icon">
                <i v-if="message.role === 'user'" class="bi bi-person-circle"></i>
                <i v-else-if="message.role === 'assistant'" class="bi bi-robot"></i>
                <i v-else class="bi bi-info-circle"></i>
              </div>
              <div class="message-role">
                {{ message.role === 'user' ? '你' : (message.role === 'assistant' ? 'AI 助手' : '系统') }}
              </div>
              <div v-if="message.role === 'assistant'" class="message-timestamp">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>

            <!-- 消息内容 -->
            <div class="message-body">
              <!-- 普通文本消息 -->
              <div 
                v-if="!message.toolUse && message.content" 
                class="message-content"
                v-html="renderMarkdown(message.content)"
              ></div>

              <!-- 工具调用 -->
              <div v-if="message.toolUse" class="tool-use-block">
                <div class="tool-header">
                  <div class="tool-icon">
                    <i v-if="message.toolUse.name === 'execute_ssh_command'" class="bi bi-terminal"></i>
                    <i v-else-if="message.toolUse.name === 'read_file'" class="bi bi-file-text"></i>
                    <i v-else-if="message.toolUse.name === 'list_files'" class="bi bi-folder"></i>
                    <i v-else class="bi bi-tools"></i>
                  </div>
                  <div class="tool-title">
                    {{ getToolTitle(message.toolUse.name) }}
                  </div>
                </div>

                <!-- 工具参数 -->
                <div class="tool-params">
                  <div v-for="(value, key) in message.toolUse.params" :key="key" class="tool-param">
                    <span class="param-key">{{ key }}:</span>
                    <code class="param-value">{{ value }}</code>
                  </div>
                </div>

                <!-- 工具执行结果 -->
                <div v-if="message.toolResult" class="tool-result">
                  <div 
                    class="tool-result-status" 
                    :class="{ 'success': message.toolResult.success, 'error': !message.toolResult.success }"
                  >
                    <i v-if="message.toolResult.success" class="bi bi-check-circle"></i>
                    <i v-else class="bi bi-x-circle"></i>
                    <span>{{ message.toolResult.success ? '执行成功' : '执行失败' }}</span>
                  </div>

                  <!-- 成功输出 -->
                  <div v-if="message.toolResult.success && message.toolResult.content" class="tool-output">
                    <pre><code>{{ extractCommandOutput(message.toolResult.content) }}</code></pre>
                  </div>

                  <!-- 错误信息 -->
                  <div v-if="!message.toolResult.success && message.toolResult.error" class="tool-error">
                    <span>{{ message.toolResult.error }}</span>
                  </div>
                </div>
              </div>

              <!-- 加载指示器 -->
              <div v-if="message.streaming" class="message-loading">
                <div class="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 工具执行进度 -->
      <div v-if="toolExecutionProgress" class="tool-progress">
        <div class="progress-spinner">
          <i class="bi bi-arrow-repeat spin"></i>
        </div>
        <span>{{ toolExecutionProgress }}</span>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-container">
        <div class="textarea-wrapper">
          <textarea
            ref="textareaRef"
            v-model="inputMessage"
            class="message-input"
            :placeholder="inputPlaceholder"
            :rows="inputRows"
            :disabled="isGenerating"
            @keydown="handleKeyDown"
          ></textarea>
          
          <!-- 右侧功能按钮组 -->
          <div class="input-buttons">
            <!-- 清空按钮 -->
            <button
              v-if="inputMessage.trim() && !isGenerating"
              class="icon-button"
              title="清空输入"
              @click="handleClearInput"
            >
              <i class="bi bi-x-lg"></i>
            </button>
            
            <!-- 发送/停止按钮 -->
            <button
              class="icon-button send-button"
              :class="{ 'is-generating': isGenerating, 'has-content': inputMessage.trim() }"
              :disabled="!inputMessage.trim() && !isGenerating"
              :title="isGenerating ? '停止生成 (Ctrl+C)' : '发送消息 (Ctrl+Enter)'"
              @click="isGenerating ? handleStopGeneration() : handleSendMessage()"
            >
              <i v-if="!isGenerating" class="bi bi-send-fill"></i>
              <i v-else class="bi bi-stop-circle-fill"></i>
            </button>
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
      @close="() => { showToolApproval = false }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

import type { AIProvider, AIModel } from '@/types/ai-providers'
import { chatCompletion, type ChatMessage as APIChatMessage } from '@/services/ai-api.service'
import { generateSystemPrompt } from '@/services/tools/system-prompt'
import { parseToolUse, executeTool } from '@/services/tools/tool-executor'
import type { ToolResult } from '@/types/tools'
import ToolApprovalDialog from './ToolApprovalDialog.vue'

// Props
interface Props {
  currentProvider: AIProvider | null
  currentModel: AIModel | null
  connectionId?: string
  serverInfo?: {
    host: string
    username: string
  }
  enableTools?: boolean
  multiline?: boolean
  inputRows?: number
  inputPlaceholder?: string
  emptyStateText?: string
  emptyStateSubtext?: string
  maxHeight?: string
  showAttachButton?: boolean
  showStatusInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableTools: true,
  multiline: false,
  inputRows: 3,
  inputPlaceholder: '输入消息...',
  emptyStateText: '开始与 AI 助手对话',
  maxHeight: '',
  showAttachButton: true,
  showStatusInfo: true
})

// Emits
const emit = defineEmits<{
  'tool-executed': [toolName: string, result: ToolResult]
}>()

// 消息类型定义
interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  streaming?: boolean
  toolUse?: {
    name: string
    params: Record<string, any>
  }
  toolResult?: ToolResult
}

// 工具批准请求
interface ToolApprovalRequest {
  tool: string
  params: Record<string, any>
  description: string
  timestamp: number
}

interface ToolApprovalResponse {
  approved: boolean
  feedback?: string
}

// 响应式数据
const inputMessage = ref('')
const isGenerating = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const internalMessages = ref<Message[]>([])

// 工具相关状态
const showToolApproval = ref(false)
const pendingToolRequest = ref<ToolApprovalRequest | null>(null)
const pendingToolResolve = ref<((response: ToolApprovalResponse) => void) | null>(null)
const toolExecutionProgress = ref('')

// 停止生成控制
const abortController = ref<AbortController | null>(null)

// 计算属性
const messages = computed(() => internalMessages.value)

// Markdown 渲染配置
const renderer: any = new marked.Renderer()
renderer.code = (code: any) => {
  const codeStr = String(code.text || code || '')
  const langStr = String(code.lang || '')
  
  const validLanguage = hljs.getLanguage(langStr) ? langStr : 'plaintext'
  const highlighted = hljs.highlight(codeStr, { language: validLanguage }).value
  return `<pre class="code-block"><code class="language-${validLanguage}">${highlighted}</code></pre>`
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

const getToolTitle = (toolName: string): string => {
  const titles: Record<string, string> = {
    'execute_ssh_command': 'SSH 命令执行',
    'read_file': '读取文件',
    'list_files': '列出文件',
    'ask_followup_question': '询问问题',
    'attempt_completion': '完成任务'
  }
  return titles[toolName] || toolName
}

const extractCommandOutput = (content: string): string => {
  const match = content.match(/<command_result>([\s\S]*?)<\/command_result>/)
  return match ? match[1].trim() : content
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
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
  showToolApproval.value = false
  if (pendingToolResolve.value) {
    pendingToolResolve.value(response)
    pendingToolResolve.value = null
  }
}

const handleToolRejection = (response: ToolApprovalResponse) => {
  console.log('[Chat] ❌ 用户拒绝工具执行')
  showToolApproval.value = false
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
  console.log('[Chat] props.messages.length:', 0)
  
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
  scrollToBottom()
  
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
    
    // 创建 AbortController 用于取消请求
    abortController.value = new AbortController()
    
    const response = await chatCompletion(
      providerWithApiKey,
      props.currentModel,
      {
        messages: apiMessages,
        stream: true,
        signal: abortController.value.signal
      },
      (chunk) => {
        assistantMessage.content += chunk.content || ''
        internalMessages.value = [...internalMessages.value]
        scrollToBottom()
      }
    )
    
    console.log('[Chat] ✅ AI API 调用完成')
    console.log('[Chat] 响应内容长度:', response.content?.length || 0)
    
    // 完成流式输出
    assistantMessage.streaming = false
    assistantMessage.content = response.content
    
    console.log('[Chat] AI 完整响应:')
    console.log(response.content)

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

    scrollToBottom()
    
  } catch (error: any) {
    console.error('AI 响应错误:', error)
    assistantMessage.streaming = false
    
    // 检查是否为用户取消
    if (error.name === 'AbortError') {
      assistantMessage.content = '已停止生成'
    } else {
      assistantMessage.content = `抱歉，发生了错误：${error.message}`
    }
    scrollToBottom()
  } finally {
    isGenerating.value = false
    abortController.value = null
  }
}

// 停止生成
const handleStopGeneration = () => {
  console.log('[Chat] 用户请求停止生成')
  if (abortController.value) {
    abortController.value.abort()
    console.log('[Chat] 已发送停止信号')
  }
}

// 清空输入
const handleClearInput = () => {
  console.log('[Chat] 清空输入')
  inputMessage.value = ''
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    handleSendMessage()
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.ai-chat-session {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vscode-editor-background);
  color: var(--vscode-foreground);
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 6px 10px;
}

.messages-area::-webkit-scrollbar {
  width: 10px;
}

.messages-area::-webkit-scrollbar-track {
  background: var(--vscode-scrollbarSlider-background);
}

.messages-area::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-hoverBackground);
  border-radius: 5px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  opacity: 0.6;
}

.empty-icon {
  font-size: 64px;
  color: var(--vscode-descriptionForeground);
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
}

.empty-subtext {
  font-size: 14px;
  color: var(--vscode-descriptionForeground);
}

/* 消息列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-row {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-in;
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

.message-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 2px;
}

.message-icon {
  font-size: 18px;
  color: var(--vscode-foreground);
}

.message-user .message-icon {
  color: var(--vscode-charts-blue);
}

.message-assistant .message-icon {
  color: var(--vscode-charts-green);
}

.message-role {
  font-weight: 600;
  font-size: 14px;
}

.message-timestamp {
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
  margin-left: auto;
}

/* 消息体 */
.message-body {
  padding-left: 12px;
}

.message-content {
  line-height: 1.6;
  word-wrap: break-word;
}

.message-content :deep(p) {
  margin: 4px 0;
}

.message-content :deep(code) {
  background: var(--vscode-textCodeBlock-background);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

.message-content :deep(pre) {
  margin: 6px 0;
}

.message-content :deep(.code-block) {
  background: var(--vscode-textCodeBlock-background);
  border: 1px solid var(--vscode-editorGroup-border);
  border-radius: 4px;
  padding: 8px 10px;
  overflow-x: auto;
}

.message-content :deep(.code-block code) {
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
}

/* 工具块 */
.tool-use-block {
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-editorGroup-border);
  border-radius: 6px;
  overflow: hidden;
  margin: 4px 0;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--vscode-editorGroupHeader-tabsBackground);
  border-bottom: 1px solid var(--vscode-editorGroup-border);
}

.tool-icon {
  font-size: 16px;
  color: var(--vscode-charts-purple);
}

.tool-title {
  font-weight: 600;
  font-size: 14px;
}

.tool-params {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tool-param {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.param-key {
  color: var(--vscode-descriptionForeground);
  font-weight: 500;
}

.param-value {
  background: var(--vscode-textCodeBlock-background);
  padding: 2px 8px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  flex: 1;
}

/* 工具结果 */
.tool-result {
  border-top: 1px solid var(--vscode-editorGroup-border);
}

.tool-result-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  font-weight: 500;
  font-size: 13px;
}

.tool-result-status.success {
  color: var(--vscode-charts-green);
  background: rgba(0, 255, 0, 0.05);
}

.tool-result-status.error {
  color: var(--vscode-errorForeground);
  background: rgba(255, 0, 0, 0.05);
}

.tool-output {
  padding: 8px 10px;
  border-top: 1px solid var(--vscode-editorGroup-border);
}

.tool-output pre {
  background: var(--vscode-textCodeBlock-background);
  padding: 8px 10px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
}

.tool-output code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
}

.tool-error {
  padding: 8px 10px;
  color: var(--vscode-errorForeground);
  font-size: 13px;
}

/* 加载指示器 */
.message-loading {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: var(--vscode-charts-blue);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 工具进度 */
.tool-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--vscode-editorGroupHeader-tabsBackground);
  border-radius: 6px;
  margin-top: 16px;
  font-size: 13px;
  color: var(--vscode-charts-blue);
}

.progress-spinner i {
  font-size: 18px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 输入区域 */
.input-area {
  border-top: 1px solid var(--vscode-editorGroup-border);
  background: var(--vscode-editor-background);
  padding: 8px 12px 12px;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.textarea-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  min-height: 80px;
  max-height: 300px;
  padding: 8px 50px 8px 10px;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.15s;
}

.message-input:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
  box-shadow: 0 0 0 1px var(--vscode-focusBorder);
}

.message-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 右侧按钮组 */
.input-buttons {
  position: absolute;
  right: 4px;
  bottom: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  color: var(--vscode-descriptionForeground);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.15s;
}

.icon-button:hover {
  opacity: 1;
  color: var(--vscode-foreground);
  background: rgba(255, 255, 255, 0.05);
}

.icon-button:active {
  background: rgba(255, 255, 255, 0.1);
}

.icon-button:disabled {
  opacity: 0;
  pointer-events: none;
}

.icon-button.send-button {
  opacity: 0;
  transition: opacity 0.2s;
}

.icon-button.send-button.has-content {
  opacity: 1;
  pointer-events: auto;
}

.icon-button.send-button.is-generating {
  opacity: 1;
  color: var(--vscode-errorForeground);
}

.icon-button.send-button.is-generating:hover {
  color: var(--vscode-errorForeground);
  background: rgba(255, 0, 0, 0.1);
}
</style>
