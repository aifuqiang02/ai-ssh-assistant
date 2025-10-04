<template>
  <div class="chat-view h-full flex flex-col bg-vscode-bg-light">
    <div class="chat-header p-4 border-b bg-vscode-bg-light border-vscode-border">
      <div class="header-content">
        <div class="header-text">
          <h2 class="text-xl font-bold text-vscode-fg">AI 对话</h2>
          <p class="text-vscode-fg-muted">与 AI 助手进行对话</p>
        </div>
        <div class="header-actions">
          <ModelSelector v-model="selectedModel" @change="onModelChange" />
        </div>
      </div>
    </div>
    
    <div class="chat-messages flex-1 p-4 overflow-y-auto bg-vscode-bg-light">
      <div v-if="messages.length === 0" class="text-center text-vscode-fg-muted mt-10">
        开始与 AI 助手对话吧！
      </div>
      
      <div v-for="message in messages" :key="message.id" class="message mb-4">
        <div 
          :class="[
            'max-w-3xl p-3 rounded-lg',
            message.role === 'user' 
              ? 'ml-auto bg-vscode-accent text-white' 
              : 'mr-auto bg-vscode-bg border border-vscode-border text-vscode-fg'
          ]"
        >
          <div class="text-sm font-medium mb-1">
            {{ message.role === 'user' ? '你' : 'AI 助手' }}
          </div>
          <div class="whitespace-pre-wrap">{{ message.content }}</div>
        </div>
      </div>
    </div>
    
    <div class="chat-input p-4 border-t bg-vscode-bg-light border-vscode-border">
      <div class="flex gap-2">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="输入消息..."
          :disabled="isGenerating"
          class="flex-1 px-3 py-2 border rounded-md bg-vscode-bg border-vscode-border text-vscode-fg placeholder-vscode-fg-muted disabled:opacity-50"
        />
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isGenerating"
          class="px-4 py-2 bg-vscode-accent text-white rounded-md hover:bg-vscode-accent-hover disabled:opacity-50 flex items-center gap-2"
        >
          <i v-if="isGenerating" class="bi bi-hourglass-split animate-spin"></i>
          <span>{{ isGenerating ? '生成中...' : '发送' }}</span>
        </button>
      </div>
      
      <!-- Token 估算和模型信息 -->
      <div v-if="currentModel" class="flex items-center justify-between mt-2 text-xs text-vscode-fg-muted">
        <div class="flex items-center gap-3">
          <span>
            <i class="bi bi-cpu"></i>
            {{ currentProvider?.name }} - {{ currentModel.name }}
          </span>
          <span v-if="messages.length > 0">
            <i class="bi bi-chat-dots"></i>
            {{ messages.length }} 条消息
          </span>
        </div>
        <div v-if="inputMessage.trim()">
          <i class="bi bi-coin"></i>
          约 {{ estimateTokens(inputMessage) }} tokens
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ModelSelector from '../components/chat/ModelSelector.vue'
import type { AIProvider, AIModel } from '../types/ai-providers'
import { chatCompletion, estimateRequestTokens, type ChatMessage as APIChatMessage } from '../services/ai-api.service'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  streaming?: boolean
}

interface SelectedModel {
  providerId: string
  modelId: string
}

const messages = ref<Message[]>([])
const inputMessage = ref('')
const selectedModel = ref<SelectedModel | undefined>()
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)
const isGenerating = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const onModelChange = (provider: AIProvider, model: AIModel) => {
  currentProvider.value = provider
  currentModel.value = model
  console.log('模型已切换:', provider.name, model.name)
  console.log('selectedModel.value:', selectedModel.value)
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isGenerating.value) return
  
  // 检查是否选择了模型
  if (!selectedModel.value || !currentProvider.value || !currentModel.value) {
    // 显示提示消息
    const tipMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: '请先在右上角选择一个 AI 模型，然后再开始对话。',
      timestamp: new Date()
    }
    messages.value.push(tipMessage)
    scrollToBottom()
    return
  }
  
  // 检查 API Key
  if (!currentProvider.value.apiKey && currentProvider.value.id !== 'ollama') {
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
  
  const userMessage: Message = {
    id: Date.now(),
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  scrollToBottom()
  
  const userInput = inputMessage.value
  inputMessage.value = ''
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
  scrollToBottom()
  
  try {
    // 构建 API 请求消息
    const apiMessages: APIChatMessage[] = messages.value
      .filter(m => !m.streaming)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    
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
          aiMessage.content += chunk.content
          scrollToBottom()
        }
      }
    )
    
    // 流式完成
    aiMessage.streaming = false
    
    // 如果内容为空，显示错误提示
    if (!aiMessage.content.trim()) {
      aiMessage.content = '抱歉，AI 没有返回任何内容。请重试。'
    }
    
  } catch (error: any) {
    console.error('AI API 调用失败:', error)
    
    // 更新消息为错误提示
    aiMessage.content = `❌ 调用失败: ${error.message}\n\n请检查：\n1. API Key 是否正确\n2. 网络连接是否正常\n3. API 配额是否充足\n4. 端点 URL 是否正确`
    aiMessage.streaming = false
  } finally {
    isGenerating.value = false
    scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  const container = document.querySelector('.chat-messages')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 从 localStorage 加载上次选择的模型
onMounted(() => {
  try {
    const saved = localStorage.getItem('selectedAIModel')
    if (saved) {
      selectedModel.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load selected model:', error)
  }
})

// 保存模型选择
const saveSelectedModel = () => {
  if (selectedModel.value) {
    localStorage.setItem('selectedAIModel', JSON.stringify(selectedModel.value))
    // 触发自定义事件，通知其他组件模型已更改
    window.dispatchEvent(new CustomEvent('ai-model-changed', {
      detail: selectedModel.value
    }))
    console.log('模型已切换并通知:', selectedModel.value)
  }
}

// 监听模型变化并保存
import { watch } from 'vue'
watch(selectedModel, saveSelectedModel, { deep: true })

// 用于显示的 token 估算
const estimateTokens = (text: string): number => {
  return estimateRequestTokens([{ role: 'user', content: text }])
}
</script>

<style scoped>
.chat-view {
  height: 100vh;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-text {
  flex: 1;
}

.header-actions {
  flex-shrink: 0;
}

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
