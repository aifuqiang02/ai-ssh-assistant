<template>
  <div class="vscode-right-panel-container h-full flex flex-col">
    <!-- 右侧面板标题栏 -->
    <div class="vscode-right-panel-header px-4 py-2 border-b border-vscode-border flex items-center justify-between">
      <div class="flex flex-col">
        <h3 class="text-sm font-medium text-vscode-fg m-0">AI 助手 (Cline)</h3>
        <div v-if="currentProvider && currentModel" class="text-xs text-vscode-fg-muted mt-1">
          <i class="bi bi-cpu"></i>
          {{ currentProvider.name }} - {{ currentModel.name }}
        </div>
        <div v-else class="text-xs text-vscode-warning mt-1">
          ⚠️ 未选择模型
        </div>
      </div>
      <button 
        @click="closePanel"
        class="vscode-icon-button"
        title="关闭面板"
      >
        <i class="bi bi-x"></i>
      </button>
    </div>
    
    <!-- 右侧面板内容 -->
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <!-- AI 对话区域 -->
      <div class="p-4">
        <!-- 对话历史 -->
        <div class="space-y-4 mb-4">
          <div 
            v-for="message in messages" 
            :key="message.id"
            :class="[
              'p-3 rounded-lg max-w-full group relative',
              message.role === 'user' 
                ? 'bg-vscode-accent text-white ml-4' 
                : 'bg-vscode-bg-light border border-vscode-border text-vscode-fg mr-4'
            ]"
          >
            <!-- 复制按钮 -->
            <button
              v-if="message.role === 'assistant' && message.content"
              @click="copyMessage(message.content, message.id)"
              :class="[
                'absolute top-2 right-2 p-1.5 rounded transition-opacity',
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
            
            <div class="text-xs font-medium mb-1 opacity-70">
              {{ message.role === 'user' ? '你' : 'AI 助手' }}
            </div>
            <div 
              v-if="message.role === 'user'"
              class="whitespace-pre-wrap text-sm pr-8 message-content"
            >
              {{ message.content }}
            </div>
            <!-- AI 消息：流式输出时显示纯文本，完成后渲染 Markdown -->
            <div 
              v-else-if="message.streaming"
              class="whitespace-pre-wrap text-sm pr-8 message-content streaming-text"
            >
              {{ message.content }}<span class="cursor-blink">▋</span>
            </div>
            <div 
              v-else
              class="markdown-content text-sm pr-8 message-content"
              v-html="renderMarkdown(message.content)"
            ></div>
            <div class="text-xs opacity-50 mt-2">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="text-center text-vscode-fg-muted py-8">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7 3v2H5v1h2v2h1V6h2V5H8V3H7z"/>
            <path d="M8 11.5a.5.5 0 0 1-.5-.5V9.5a.5.5 0 0 1 1 0V11a.5.5 0 0 1-.5.5z"/>
          </svg>
          <p class="text-sm">开始与 AI 助手对话</p>
          <p class="text-xs mt-2">类似 VSCode Cline 插件的功能</p>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="vscode-right-panel-input border-t border-vscode-border p-4">
      <div class="flex flex-col space-y-2">
        <textarea
          v-model="inputMessage"
          @keydown.ctrl.enter="sendMessage"
          @keydown.meta.enter="sendMessage"
          :disabled="isGenerating"
          placeholder="输入消息... (Ctrl+Enter 发送)"
          class="form-input-full resize-none"
          rows="3"
        ></textarea>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <button 
              class="vscode-icon-button"
              title="附加文件"
            >
              <i class="bi bi-paperclip"></i>
            </button>
            <button 
              class="vscode-icon-button"
              title="清空对话"
              @click="clearMessages"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isGenerating"
            class="vscode-button primary px-4 py-1"
          >
            <i v-if="isGenerating" class="bi bi-hourglass-split animate-spin mr-1"></i>
            {{ isGenerating ? '生成中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue'
import { chatCompletion, type ChatMessage as APIChatMessage } from '../../services/ai-api.service'
import type { AIProvider, AIModel } from '../../types/ai-providers'
import { decryptApiKey } from '../../utils/encryption'
import { marked } from 'marked'
import hljs from 'highlight.js'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  streaming?: boolean
}

// 配置 marked
marked.setOptions({
  breaks: true, // 支持 GFM 换行
  gfm: true, // 启用 GitHub Flavored Markdown
})

// 自定义代码块渲染
const renderer = new marked.Renderer()
renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  const escapedCode = text.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
  
  let highlightedCode = ''
  let languageLabel = lang || 'text'
  
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlightedCode = hljs.highlight(text, { language: lang }).value
    } catch (err) {
      console.error('代码高亮失败:', err)
      highlightedCode = hljs.highlightAuto(text).value
      languageLabel = 'auto'
    }
  } else {
    const result = hljs.highlightAuto(text)
    highlightedCode = result.value
    languageLabel = result.language || 'text'
  }
  
  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-language">${languageLabel}</span>
        <button class="code-copy-btn" data-code-id="${codeId}" title="复制代码">
          <i class="bi bi-clipboard"></i>
        </button>
      </div>
      <pre id="${codeId}"><code class="hljs language-${lang || 'plaintext'}">${highlightedCode}</code></pre>
      <div class="code-content-hidden" data-for="${codeId}" style="display: none;">${escapedCode}</div>
    </div>
  `
}

marked.use({ renderer })

// 响应式数据
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isGenerating = ref(false)
const copiedMessageId = ref<number | null>(null)
const copiedCodeBlockId = ref<string | null>(null)

// 从 localStorage 加载配置
const savedModel = ref<{ providerId: string; modelId: string } | null>(null)
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)

// 渲染 Markdown
const renderMarkdown = (content: string): string => {
  try {
    return marked.parse(content) as string
  } catch (error) {
    console.error('Markdown 渲染失败:', error)
    return content
  }
}

// 加载配置的函数
const loadConfiguration = () => {
  try {
    console.log('=== RightPanel 开始加载配置 ===')
    
    // 加载选中的模型
    const saved = localStorage.getItem('selectedAIModel')
    console.log('1. localStorage selectedAIModel:', saved)
    
    if (saved) {
      savedModel.value = JSON.parse(saved)
      console.log('2. 解析后的 savedModel:', savedModel.value)
    } else {
      console.warn('2. 未找到 selectedAIModel，配置可能未保存')
      return
    }
    
    // 加载 AI 提供商配置
    const configsStr = localStorage.getItem('aiProviderConfigs')
    console.log('3. localStorage aiProviderConfigs 长度:', configsStr?.length)
    
    if (configsStr && savedModel.value) {
      const configs = JSON.parse(configsStr)
      console.log('4. 解析后的 configs 数量:', configs.length)
      console.log('5. 查找 providerId:', savedModel.value?.providerId)
      
      const provider = configs.find((p: AIProvider) => p.id === savedModel.value?.providerId)
      console.log('6. 找到的 provider:', provider ? provider.name : 'null')
      
      if (provider) {
        console.log('7. provider.models 数量:', provider.models?.length)
        console.log('8. 查找 modelId:', savedModel.value?.modelId)
        
        const model = provider.models?.find((m: AIModel) => m.id === savedModel.value?.modelId)
        console.log('9. 找到的 model:', model ? model.name : 'null')
        
        // 解密 API Key
        if (provider.apiKey) {
          const decryptedApiKey = decryptApiKey(provider.apiKey)
          console.log('9.5. 解密 API Key:', {
            加密长度: provider.apiKey.length,
            解密长度: decryptedApiKey.length,
            解密后前缀: decryptedApiKey.substring(0, 10)
          })
          provider.apiKey = decryptedApiKey
        }
        
        currentProvider.value = provider
        currentModel.value = model || null
        
        console.log('10. ✅ 最终配置:')
        console.log('    - Provider:', currentProvider.value?.name, '(有 apiKey:', !!currentProvider.value?.apiKey, ')')
        console.log('    - Model:', currentModel.value?.name)
      } else {
        console.warn('6. ❌ 未找到匹配的 provider')
      }
    } else {
      console.warn('3. ❌ 缺少必要数据:', { hasConfigs: !!configsStr, hasSavedModel: !!savedModel.value })
    }
    
    console.log('=== RightPanel 配置加载完成 ===\n')
  } catch (error) {
    console.error('❌ 加载配置失败:', error)
  }
}

// 组件挂载时加载配置
onMounted(() => {
  loadConfiguration()
  
  // 监听 storage 事件，当其他页面更新配置时同步
  window.addEventListener('storage', handleStorageChange)
  
  // 监听自定义事件（用于同一页面内的更新）
  window.addEventListener('ai-model-changed', handleModelChange as EventListener)
  
  // 添加代码块复制按钮事件监听（事件委托）
  const chatArea = document.querySelector('.vscode-right-panel-container')
  if (chatArea) {
    chatArea.addEventListener('click', handleCodeCopyClick)
  }
})

// 清理监听器
onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('ai-model-changed', handleModelChange as EventListener)
  
  // 移除代码块复制按钮事件监听
  const chatArea = document.querySelector('.vscode-right-panel-container')
  if (chatArea) {
    chatArea.removeEventListener('click', handleCodeCopyClick)
  }
})

// 处理 storage 变化
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'selectedAIModel' || e.key === 'aiProviderConfigs') {
    console.log('\n🔄 [Storage 事件] 检测到 localStorage 变化:', e.key)
    loadConfiguration()
  }
}

// 处理自定义模型变化事件
const handleModelChange = (e: CustomEvent) => {
  console.log('\n🔄 [自定义事件] 检测到模型切换:', e.detail)
  loadConfiguration()
}

// 方法
const closePanel = () => {
  // 通过事件通知父组件关闭面板
  window.dispatchEvent(new CustomEvent('close-right-panel'))
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isGenerating.value) return
  
  console.log('=== 发送消息检查 ===')
  console.log('currentProvider:', currentProvider.value ? currentProvider.value.name : 'null')
  console.log('currentModel:', currentModel.value ? currentModel.value.name : 'null')
  
  // 检查是否配置了模型
  if (!currentProvider.value || !currentModel.value) {
    console.warn('❌ 模型配置检查失败:')
    console.log('  - currentProvider 存在:', !!currentProvider.value)
    console.log('  - currentModel 存在:', !!currentModel.value)
    
    const tipMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: '请先在设置中配置 AI 模型，或在聊天页面选择模型后再使用 AI 助手。\n\n提示：您可以点击聊天页面右上角的模型选择器来选择模型。',
      timestamp: new Date()
    }
    messages.value.push(tipMessage)
    scrollToBottom()
    return
  }
  
  console.log('✅ 模型配置检查通过')
  console.log('Provider apiKey 长度:', currentProvider.value.apiKey?.length || 0)
  
  // 检查 API Key
  if (!currentProvider.value.apiKey && currentProvider.value.id !== 'ollama') {
    console.warn('❌ API Key 检查失败')
    
    const tipMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: `请先在设置中配置 ${currentProvider.value.name} 的 API Key。`,
      timestamp: new Date()
    }
    messages.value.push(tipMessage)
    scrollToBottom()
    return
  }
  
  console.log('✅ API Key 检查通过，准备发送消息...\n')
  
  const userMessage: Message = {
    id: Date.now(),
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  
  const userInput = inputMessage.value
  inputMessage.value = ''
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  isGenerating.value = true
  
  // 创建 AI 响应消息（用于流式更新）
  const aiMessage: Message = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    streaming: true
  }
  messages.value.push(aiMessage)
  const aiMessageIndex = messages.value.length - 1 // 记录索引
  scrollToBottom()
  
  // 打字机效果相关变量（需要在 try-catch 外定义，以便清理）
  let bufferContent = ''
  let typewriterInterval: NodeJS.Timeout | null = null
  let apiStreamCompleted = false
  
  try {
    // 构建 API 请求消息
    const apiMessages: APIChatMessage[] = messages.value
      .filter(m => !m.streaming)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    
    // 添加系统提示
    apiMessages.unshift({
      role: 'system',
      content: 'You are a helpful AI assistant for SSH remote server management. You can help with code analysis, file operations, SSH connection management, and terminal commands.'
    })
    
    // 节流控制：避免过于频繁的滚动
    let lastScrollTime = 0
    const scrollThrottle = 100 // 100ms 更新一次滚动
    
    // 打字机效果：逐字符显示
    const startTypewriter = () => {
      if (typewriterInterval) return
      
      typewriterInterval = setInterval(() => {
        if (bufferContent.length > 0) {
          // 每次取出 2-5 个字符（模拟自然的打字速度）
          const charsToAdd = bufferContent.slice(0, Math.min(Math.floor(Math.random() * 4) + 2, bufferContent.length))
          
          // 通过索引更新，确保 Vue 响应式系统能检测到变化
          messages.value[aiMessageIndex].content += charsToAdd
          bufferContent = bufferContent.slice(charsToAdd.length)
          
          // 节流滚动更新
          const now = Date.now()
          if (now - lastScrollTime > scrollThrottle) {
            scrollToBottom()
            lastScrollTime = now
          }
        } else if (apiStreamCompleted) {
          // API 完成且缓冲区清空，停止打字机效果
          if (typewriterInterval) {
            clearInterval(typewriterInterval)
            typewriterInterval = null
          }
        }
      }, 20) // 每 20ms 添加几个字符
    }
    
    // 调用 AI API（流式）
    await chatCompletion(
      currentProvider.value,
      currentModel.value,
      {
        messages: apiMessages,
        temperature: 0.7,
        maxTokens: 4096,
        stream: true
      },
      (chunk) => {
        if (!chunk.done && chunk.content) {
          // 将接收到的内容添加到缓冲区
          bufferContent += chunk.content
          
          // 启动打字机效果
          if (!typewriterInterval) {
            startTypewriter()
          }
        }
      }
    )
    
    // API 流式响应完成
    apiStreamCompleted = true
    
    // 等待缓冲区内容全部显示（打字机效果完成）
    while (bufferContent.length > 0 || (typewriterInterval !== null)) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    // 清理打字机定时器
    if (typewriterInterval) {
      clearInterval(typewriterInterval)
      typewriterInterval = null
    }
    
    // 打字机效果完成，切换到 Markdown 渲染
    messages.value[aiMessageIndex].streaming = false
    
    // 如果内容为空，显示错误提示
    if (!messages.value[aiMessageIndex].content.trim()) {
      messages.value[aiMessageIndex].content = '抱歉，AI 没有返回任何内容。请重试。'
    }
    
    // 等待 Markdown 渲染完成后滚动到底部
    await nextTick()
    scrollToBottom()
    
  } catch (error: any) {
    console.error('AI API 调用失败:', error)
    
    // 标记 API 完成（即使出错）
    apiStreamCompleted = true
    
    // 清理打字机定时器
    if (typewriterInterval) {
      clearInterval(typewriterInterval)
      typewriterInterval = null
    }
    
    // 更新消息为错误提示
    messages.value[aiMessageIndex].content = `❌ 调用失败: ${error.message}\n\n请检查：\n1. API Key 是否正确\n2. 网络连接是否正常\n3. API 配额是否充足\n4. 端点 URL 是否正确`
    messages.value[aiMessageIndex].streaming = false
  } finally {
    isGenerating.value = false
    scrollToBottom()
  }
}

const clearMessages = () => {
  messages.value = []
}

const copyMessage = async (content: string, messageId: number) => {
  try {
    await navigator.clipboard.writeText(content)
    copiedMessageId.value = messageId
    console.log('✅ 已复制消息内容到剪贴板')
    
    // 2秒后恢复复制按钮状态
    setTimeout(() => {
      if (copiedMessageId.value === messageId) {
        copiedMessageId.value = null
      }
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    // 如果剪贴板 API 不可用，尝试使用传统方法
    try {
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      
      copiedMessageId.value = messageId
      setTimeout(() => {
        if (copiedMessageId.value === messageId) {
          copiedMessageId.value = null
        }
      }, 2000)
    } catch (fallbackError) {
      console.error('备用复制方法也失败:', fallbackError)
    }
  }
}

// 复制代码块
const copyCodeBlock = async (codeId: string) => {
  try {
    // 从隐藏的 div 中获取原始代码（未转义的）
    const hiddenDiv = document.querySelector(`[data-for="${codeId}"]`) as HTMLElement
    if (!hiddenDiv) {
      console.error('未找到代码内容')
      return
    }
    
    // 解码 HTML 实体
    const code = hiddenDiv.textContent || ''
    const decodedCode = code
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    
    await navigator.clipboard.writeText(decodedCode)
    copiedCodeBlockId.value = codeId
    console.log('✅ 已复制代码块到剪贴板')
    
    // 更新按钮图标
    const btn = document.querySelector(`[data-code-id="${codeId}"]`)
    if (btn) {
      btn.classList.add('copied')
      const icon = btn.querySelector('i')
      if (icon) {
        icon.className = 'bi bi-check2'
      }
    }
    
    // 2秒后恢复按钮状态
    setTimeout(() => {
      if (copiedCodeBlockId.value === codeId) {
        copiedCodeBlockId.value = null
        const btn = document.querySelector(`[data-code-id="${codeId}"]`)
        if (btn) {
          btn.classList.remove('copied')
          const icon = btn.querySelector('i')
          if (icon) {
            icon.className = 'bi bi-clipboard'
          }
        }
      }
    }, 2000)
  } catch (error) {
    console.error('复制代码块失败:', error)
  }
}

// 事件委托：处理代码块复制按钮点击
const handleCodeCopyClick = (event: Event) => {
  const target = event.target as HTMLElement
  const btn = target.closest('.code-copy-btn') as HTMLElement
  if (btn) {
    const codeId = btn.getAttribute('data-code-id')
    if (codeId) {
      copyCodeBlock(codeId)
    }
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const scrollToBottom = () => {
  const container = document.querySelector('.vscode-right-panel-container .overflow-y-auto')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 不需要监听事件，直接通过点击触发closePanel
</script>

<style>
/* 引入 highlight.js 代码高亮主题 (VS Code Dark+) */
@import 'highlight.js/styles/vs2015.css';
</style>

<style scoped>
.vscode-right-panel-container {
  background: var(--vscode-bg-light);
  color: var(--vscode-fg);
}

.vscode-right-panel-header {
  background: var(--vscode-bg-light);
  height: 37px;
  min-height: 37px;
}

.vscode-right-panel-input {
  background: var(--vscode-bg-light);
}

.vscode-icon-button {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: color 0.15s ease, background-color 0.15s ease;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  border: none;
  background: transparent;
}

.vscode-icon-button:hover {
  color: var(--vscode-fg);
  background-color: var(--vscode-bg-lighter);
}

.vscode-button {
  padding: 6px 12px;
  font-size: 13px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  background: var(--vscode-bg-light);
  color: var(--vscode-fg);
  cursor: pointer;
  transition: all 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
}

.vscode-button:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.vscode-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.vscode-button.primary {
  background: var(--vscode-accent);
  color: #ffffff;
  border-color: var(--vscode-accent);
}

.vscode-button.primary:hover:not(:disabled) {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

/* 滚动条样式 */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--vscode-bg-lighter) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: var(--vscode-bg-lighter);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: var(--vscode-border);
}

/* 消息内容可选中 */
.message-content {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  cursor: text;
}

/* 流式输出光标闪烁效果 */
.streaming-text .cursor-blink {
  animation: blink 1s infinite;
  color: var(--vscode-accent);
  font-weight: bold;
}

@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

/* Markdown 内容样式 */
.markdown-content {
  line-height: 1.6;
  word-wrap: break-word;
}

/* 确保 Markdown 内容中的所有元素都可以被选中 */
.markdown-content :deep(*) {
  user-select: text;
  -webkit-user-select: text;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(h1) { font-size: 1.5em; border-bottom: 1px solid var(--vscode-border); padding-bottom: 0.3em; }
.markdown-content :deep(h2) { font-size: 1.25em; border-bottom: 1px solid var(--vscode-border); padding-bottom: 0.3em; }
.markdown-content :deep(h3) { font-size: 1.1em; }
.markdown-content :deep(h4) { font-size: 1em; }

.markdown-content :deep(p) {
  margin-top: 0;
  margin-bottom: 0.75em;
}

.markdown-content :deep(code) {
  background-color: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 3px;
  padding: 0.2em 0.4em;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

/* 代码块容器 */
.markdown-content :deep(.code-block-wrapper) {
  position: relative;
  margin: 0.75em 0;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  background-color: var(--vscode-bg);
  overflow: hidden;
}

/* 代码块头部 */
.markdown-content :deep(.code-block-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid var(--vscode-border);
}

.markdown-content :deep(.code-language) {
  font-size: 0.75em;
  color: var(--vscode-fg-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 代码复制按钮 */
.markdown-content :deep(.code-copy-btn) {
  background: transparent;
  border: none;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.markdown-content :deep(.code-copy-btn:hover) {
  background-color: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

.markdown-content :deep(.code-copy-btn.copied) {
  color: #4CAF50;
}

.markdown-content :deep(.code-copy-btn .bi) {
  font-style: normal;
}

.markdown-content :deep(pre) {
  background-color: transparent;
  border: none;
  border-radius: 0;
  padding: 12px;
  overflow-x: auto;
  margin: 0;
}

.markdown-content :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9em;
  line-height: 1.5;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.75em 0;
  padding-left: 2em;
}

.markdown-content :deep(li) {
  margin: 0.25em 0;
}

.markdown-content :deep(blockquote) {
  margin: 0.75em 0;
  padding: 0 1em;
  border-left: 4px solid var(--vscode-accent);
  color: var(--vscode-fg-muted);
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.75em 0;
}

.markdown-content :deep(table th),
.markdown-content :deep(table td) {
  border: 1px solid var(--vscode-border);
  padding: 6px 13px;
}

.markdown-content :deep(table th) {
  font-weight: 600;
  background-color: var(--vscode-bg);
}

.markdown-content :deep(a) {
  color: var(--vscode-accent);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(hr) {
  height: 1px;
  border: none;
  background-color: var(--vscode-border);
  margin: 1em 0;
}

.markdown-content :deep(strong) {
  font-weight: 600;
}

/* Bootstrap Icons */
.bi-x::before { content: "✕"; }
.bi-paperclip::before { content: "📎"; }
.bi-trash::before { content: "🗑️"; }
.bi-hourglass-split::before { content: "⏳"; }
.bi-cpu::before { content: "🖥️"; }
.bi-clipboard::before { content: "📋"; }
.bi-check2::before { content: "✓"; }

[class^="bi-"] {
  font-style: normal;
  display: inline-block;
  font-weight: normal;
  line-height: 1;
}

/* 动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
