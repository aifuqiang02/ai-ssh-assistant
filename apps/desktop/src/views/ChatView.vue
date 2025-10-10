<template>
  <div class="chat-view h-full flex flex-col bg-vscode-bg-light">
    <!-- AI 会话组件 -->
    <div class="flex-1 overflow-hidden">
      <AIChatSession
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
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import AIChatSession from '../components/chat/AIChatSession.vue'
import type { AIProvider, AIModel } from '../types/ai-providers'
import { chatService } from '../services/chat.service'

// 路由和会话管理
const route = useRoute()

// 响应式数据
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)

// 当前会话信息
const currentSessionId = computed(() => route.query.sessionId as string || null)
const currentSessionName = ref('AI 对话')

// 保存选中的模型
const saveSelectedModel = () => {
  if (currentProvider.value && currentModel.value) {
    localStorage.setItem('selectedAIModel', JSON.stringify({
      provider: currentProvider.value,
      model: currentModel.value
    }))
  }
}

// 加载会话名称
const loadSessionName = async (sessionId: string) => {
  try {
    const session = await chatService.getSession(sessionId)
    if (session) {
      currentSessionName.value = session.title || 'AI 对话'
    }
  } catch (error) {
    console.error('加载会话名称失败:', error)
  }
}

// 监听 AI 模型选择事件（从 AppTitleBar 触发）
const handleModelSelected = (event: CustomEvent) => {
  const detail = event.detail
  console.log('[ChatView] 接收到模型切换事件:', detail)
  
  // 新格式：包含完整的 provider 和 model 对象
  if (detail.provider && detail.model) {
    currentProvider.value = detail.provider
    currentModel.value = detail.model
    console.log('[ChatView] ✅ 模型已选择:', detail.provider.name, detail.model.name)
  }
  // 旧格式兼容：只有 providerId 和 modelId（不应该再出现）
  else if (detail.providerId && detail.modelId) {
    console.warn('[ChatView] ⚠️ 收到旧格式事件，忽略')
  }
}

// 恢复上次选择的模型
const loadSavedModel = () => {
  const savedModel = localStorage.getItem('selectedAIModel')
  if (savedModel) {
    try {
      const parsed = JSON.parse(savedModel)
      
      // 检查是否是新格式（完整对象）
      if (parsed.provider && parsed.model) {
        currentProvider.value = parsed.provider
        currentModel.value = parsed.model
        console.log('[ChatView] ✅ 已恢复模型:', parsed.provider.name, parsed.model.name)
      } else if (parsed.providerId && parsed.modelId) {
        // 旧格式，清理并提示用户重新选择
        console.warn('[ChatView] ⚠️ 检测到旧格式模型配置，已清理，请重新选择')
        localStorage.removeItem('selectedAIModel')
      }
    } catch (error) {
      console.error('[ChatView] ❌ 解析保存的模型失败:', error)
      // 清理损坏的数据
      localStorage.removeItem('selectedAIModel')
    }
  }
}

// 监听会话ID变化
watch(currentSessionId, async (newSessionId, oldSessionId) => {
  if (newSessionId && newSessionId !== oldSessionId) {
    await loadSessionName(newSessionId)
  }
}, { immediate: true })

// 生命周期
onMounted(async () => {
  // 恢复上次选择的模型
  loadSavedModel()

  // 监听模型选择事件（事件名称与 AppTitleBar 一致）
  window.addEventListener('ai-model-changed', handleModelSelected as EventListener)
  
  // 如果有会话ID，加载会话名称
  if (currentSessionId.value) {
    await loadSessionName(currentSessionId.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('ai-model-changed', handleModelSelected as EventListener)
})
</script>

<style scoped>
.chat-view {
  background: var(--vscode-bg-light);
}
</style>
