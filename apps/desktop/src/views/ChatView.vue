<template>
  <div class="chat-view h-full flex flex-col bg-vscode-bg-light">
    <!-- 聊天头部 -->
    <div class="chat-header p-4 border-b bg-vscode-bg-light border-vscode-border">
      <div class="header-content">
        <div class="header-text">
          <h2 class="text-xl font-bold text-vscode-fg">{{ currentSessionName }}</h2>
          <p class="text-vscode-fg-muted">{{ currentSessionId ? '会话对话' : '与 AI 助手进行对话' }}</p>
        </div>
      </div>
    </div>
    
    <!-- AI 会话组件 -->
    <div class="flex-1 overflow-hidden">
      <AIChatSession
        :messages="messages"
        :current-provider="currentProvider"
        :current-model="currentModel"
        :session-name="currentSessionName"
        :session-id="currentSessionId || undefined"
        :multiline="true"
        :input-rows="3"
        input-placeholder="输入消息... (Ctrl+Enter 发送)"
        :empty-state-text="currentSessionId ? `${currentSessionName}` : '开始与 AI 助手对话吧！'"
        :empty-state-subtext="currentSessionId ? '这是一个新的对话会话，开始与 AI 助手对话吧！' : '提示：您可以在左侧创建会话来保存对话历史'"
        :show-attach-button="true"
        :show-status-info="false"
        @send-message="handleSendMessage"
        @clear-messages="handleClearMessages"
        @attach-file="handleAttachFile"
        @update:messages="handleUpdateMessages"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AIChatSession, { type Message } from '../components/chat/AIChatSession.vue'
import type { AIProvider, AIModel } from '../types/ai-providers'
import { chatCompletion, type ChatMessage as APIChatMessage } from '../services/ai-api.service'
import { chatService } from '../services/chat.service'
import { settingsService } from '../services/settings.service'

interface SelectedModel {
  providerId: string
  modelId: string
}

// 路由和会话管理
const route = useRoute()

// Chat 树数据
const chatTree = ref<any[]>([])

// 响应式数据
const messages = ref<Message[]>([])
const selectedModel = ref<SelectedModel | undefined>()
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)

// 当前会话信息
const currentSessionId = computed(() => route.query.sessionId as string || null)
const currentSessionName = ref('AI 对话')


// 消息发送处理
const handleSendMessage = async (content: string) => {
  // 检查是否选择了模型
  if (!selectedModel.value || !currentProvider.value || !currentModel.value) {
    const tipMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: '请先在右上角选择一个 AI 模型，然后再开始对话。',
      timestamp: new Date()
    }
    messages.value.push(tipMessage)
    return
  }
  
  // 添加用户消息
  const userMessage: Message = {
    id: Date.now(),
    role: 'user',
    content,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  
  // 准备 AI 响应消息
  const assistantMessage: Message = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    streaming: true
  }
  messages.value.push(assistantMessage)
  
  try {
    // 准备 API 消息格式
    const apiMessages: APIChatMessage[] = messages.value
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
    
    // ✅ 使用 settingsService 获取 API 密钥（自动处理 userId）
    const settings = await settingsService.getSettings()
    const configs = settings?.aiProviders || []
    const providerConfig = configs.find((p: any) => p.id === currentProvider.value?.id)
    
    if (!providerConfig?.apiKey) {
      throw new Error('未找到 API 密钥配置')
    }
    
    // 创建包含 API Key 的 provider 对象
    const providerWithApiKey = {
      ...currentProvider.value,
      apiKey: providerConfig.apiKey
    }
    
    // 调用 AI API
    const response = await chatCompletion(
      providerWithApiKey,
      currentModel.value,
      {
        messages: apiMessages,
        stream: true
      },
      (chunk) => {
        assistantMessage.content += chunk.content || ''
        // 强制触发响应式更新
        messages.value = [...messages.value]
      }
    )
    
    // 完成流式输出
    assistantMessage.streaming = false
    assistantMessage.content = response.content
    
    // 如果有会话ID，保存消息
    if (currentSessionId.value) {
      await saveSessionMessages(currentSessionId.value)
    }
    
  } catch (error: any) {
    console.error('AI 响应错误:', error)
    assistantMessage.streaming = false
    assistantMessage.content = `抱歉，发生了错误：${error.message}`
  }
}

// 清空消息处理
const handleClearMessages = () => {
  messages.value = []
  if (currentSessionId.value) {
    saveSessionMessages(currentSessionId.value)
  }
}

// 消息更新处理
const handleUpdateMessages = (newMessages: Message[]) => {
  messages.value = newMessages
}

// 附加文件处理
const handleAttachFile = () => {
  console.log('附加文件功能')
}

// 加载会话消息
const loadSessionMessages = async (sessionId: string) => {
  try {
    const savedMessages = localStorage.getItem(`chat-session-${sessionId}`)
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      messages.value = parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    } else {
      messages.value = []
    }

    const savedSessionName = localStorage.getItem(`chat-session-name-${sessionId}`)
    if (savedSessionName) {
      currentSessionName.value = savedSessionName
    }
    console.log(`已加载会话 ${sessionId} 的消息:`, messages.value.length, '条')
  } catch (error) {
    console.error('加载会话消息失败:', error)
    messages.value = []
  }
}

// 保存会话消息
const saveSessionMessages = async (sessionId: string) => {
  try {
    localStorage.setItem(`chat-session-${sessionId}`, JSON.stringify(messages.value))
    localStorage.setItem(`chat-session-name-${sessionId}`, currentSessionName.value)
    console.log(`已保存会话 ${sessionId} 的消息:`, messages.value.length, '条')
  } catch (error) {
    console.error('保存会话消息失败:', error)
  }
}

// 保存选中的模型
const saveSelectedModel = () => {
  if (selectedModel.value) {
    localStorage.setItem('selectedAIModel', JSON.stringify(selectedModel.value))
  }
}

// Token 估算
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4)
}

// 监听会话ID变化
watch(currentSessionId, async (newSessionId, oldSessionId) => {
  if (oldSessionId) {
    await saveSessionMessages(oldSessionId)
  }
  if (newSessionId) {
    await loadSessionMessages(newSessionId)
    const findSessionInTree = (nodes: any[], sessionId: string): any => {
      for (const node of nodes) {
        if (node.id === sessionId && node.type === 'session') {
          return node
        }
        if (node.children) {
          const found = findSessionInTree(node.children, sessionId)
          if (found) return found
        }
      }
      return null
    }
    const session = findSessionInTree(chatTree.value, newSessionId)
    if (session) {
      currentSessionName.value = session.name || session.title || 'AI 对话'
    }
  } else {
    messages.value = []
    currentSessionName.value = 'AI 对话'
  }
}, { immediate: true })

// 监听模型变化
watch(selectedModel, () => {
  saveSelectedModel()
}, { deep: true })

// 加载模型配置
const loadModelConfiguration = async () => {
  try {
    const saved = localStorage.getItem('selectedAIModel')
    if (!saved) {
      console.log('[ChatView] 未找到已选择的模型')
      return
    }
    
    const savedModel = JSON.parse(saved)
    console.log('[ChatView] 尝试加载模型:', savedModel)
    
    // ✅ 使用 settingsService 获取配置（自动处理 userId）
    const settings = await settingsService.getSettings()
    const configs = settings?.aiProviders || []
    
    if (configs.length > 0 && savedModel) {
      const provider = configs.find((p: AIProvider) => p.id === savedModel.providerId)
      
      if (provider) {
        const model = provider.models?.find((m: AIModel) => m.id === savedModel.modelId)
        if (model) {
          selectedModel.value = savedModel
          currentProvider.value = provider
          currentModel.value = model
          console.log('[ChatView] ✅ 已加载模型:', provider.name, '-', model.name)
        } else {
          console.warn('[ChatView] ⚠️ 未找到模型:', savedModel.modelId)
        }
      } else {
        console.warn('[ChatView] ⚠️ 未找到服务商:', savedModel.providerId)
      }
    }
  } catch (error) {
    console.error('[ChatView] ❌ 模型配置加载失败:', error)
  }
}

// 监听模型切换事件
const handleModelChanged = () => {
  console.log('[ChatView] 🔄 检测到模型切换，重新加载')
  loadModelConfiguration()
}

const handleSettingsUpdated = () => {
  console.log('[ChatView] 🔄 检测到设置更新，重新加载模型')
  loadModelConfiguration()
}

// 加载 Chat 树
const loadChatTree = async () => {
  try {
    chatTree.value = await chatService.getChatTree()
  } catch (err) {
    console.error('加载 Chat 树失败:', err)
  }
}

// 生命周期
onMounted(async () => {
  loadModelConfiguration()
  // ✅ 直接使用 chatService
  await loadChatTree()
  
  // 监听模型切换和设置更新事件
  window.addEventListener('ai-model-changed', handleModelChanged)
  window.addEventListener('settings-updated', handleSettingsUpdated)
  window.addEventListener('ai-provider-configs-updated', handleSettingsUpdated)
})

onBeforeUnmount(() => {
  window.removeEventListener('ai-model-changed', handleModelChanged)
  window.removeEventListener('settings-updated', handleSettingsUpdated)
  window.removeEventListener('ai-provider-configs-updated', handleSettingsUpdated)
})
</script>

<style scoped>
.chat-view {
  background: var(--vscode-editor-background);
}

.chat-header {
  background: var(--vscode-editor-background);
  border-bottom: 1px solid var(--vscode-panel-border);
}

.header-content {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.header-text h2 {
  color: var(--vscode-editor-foreground);
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.header-text p {
  color: var(--vscode-descriptionForeground);
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}
</style>