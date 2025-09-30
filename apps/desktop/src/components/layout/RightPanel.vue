<template>
  <div class="vscode-right-panel-container h-full flex flex-col">
    <!-- 右侧面板标题栏 -->
    <div class="vscode-right-panel-header px-4 py-2 border-b border-vscode-border flex items-center justify-between">
      <h3 class="text-sm font-medium text-vscode-fg m-0">AI 助手 (Cline)</h3>
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
              'p-3 rounded-lg max-w-full',
              message.role === 'user' 
                ? 'bg-vscode-accent text-white ml-4' 
                : 'bg-vscode-bg-light border border-vscode-border text-vscode-fg mr-4'
            ]"
          >
            <div class="text-xs font-medium mb-1 opacity-70">
              {{ message.role === 'user' ? '你' : 'AI 助手' }}
            </div>
            <div class="whitespace-pre-wrap text-sm">{{ message.content }}</div>
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
            :disabled="!inputMessage.trim()"
            class="vscode-button primary px-4 py-1"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// 响应式数据
const messages = ref<Message[]>([])
const inputMessage = ref('')

// 方法
const closePanel = () => {
  // 通过事件通知父组件关闭面板
  window.dispatchEvent(new CustomEvent('close-right-panel'))
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
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
  
  // 模拟 AI 回复
  setTimeout(() => {
    const aiResponse: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `我收到了您的消息："${userInput}"。作为您的 AI 助手，我可以帮助您进行代码分析、文件操作、SSH 连接管理等任务。请告诉我您需要什么帮助？`,
      timestamp: new Date()
    }
    messages.value.push(aiResponse)
    
    nextTick(() => {
      scrollToBottom()
    })
  }, 1000)
}

const clearMessages = () => {
  messages.value = []
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

/* Bootstrap Icons */
.bi-x::before { content: "✕"; }
.bi-paperclip::before { content: "📎"; }
.bi-trash::before { content: "🗑️"; }

[class^="bi-"] {
  font-style: normal;
  display: inline-block;
  font-weight: normal;
  line-height: 1;
}
</style>
