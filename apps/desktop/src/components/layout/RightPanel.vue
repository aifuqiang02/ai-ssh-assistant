<template>
  <div class="vscode-right-panel-container h-full flex flex-col">
    <!-- 右侧面板标题栏 -->
    <div class="vscode-right-panel-header px-4 py-2 border-b border-vscode-border flex items-center justify-between">
      <div class="flex flex-col">
        <h3 class="text-sm font-medium text-vscode-fg m-0">AI 助手 (Cline)</h3>
      </div>
      <button 
        @click="closePanel"
        class="vscode-icon-button"
        title="关闭面板"
      >
        <i class="bi bi-x"></i>
      </button>
    </div>
    
    <!-- AI 会话组件 -->
    <AIChatSession
      :messages="messages"
      :current-provider="currentProvider"
      :current-model="currentModel"
      :multiline="true"
      :input-rows="3"
      input-placeholder="输入消息... (Ctrl+Enter 发送)"
      empty-state-text="开始与 AI 助手对话"
      empty-state-subtext="类似 VSCode Cline 插件的功能"
      :show-attach-button="true"
      :show-status-info="false"
      @send-message="handleSendMessage"
      @clear-messages="handleClearMessages"
      @attach-file="handleAttachFile"
      @update:messages="handleUpdateMessages"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { AIProvider, AIModel } from '../../types/ai-providers'
import AIChatSession, { type Message } from '../chat/AIChatSession.vue'

// 响应式数据
const messages = ref<Message[]>([])
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)

// 加载配置
const loadConfiguration = () => {
  try {
    const saved = localStorage.getItem('selectedAIModel')
    if (!saved) return
    
    const savedModel = JSON.parse(saved)
    const configsStr = localStorage.getItem('aiProviderConfigs')
    
    if (configsStr && savedModel) {
      const configs = JSON.parse(configsStr)
      const provider = configs.find((p: AIProvider) => p.id === savedModel.providerId)
      
      if (provider) {
        const model = provider.models?.find((m: AIModel) => m.id === savedModel.modelId)
        if (model) {
          currentProvider.value = provider
          currentModel.value = model
        }
      }
    }
  } catch (error) {
    console.error('配置加载失败:', error)
  }
}

// 监听配置变化
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'selectedAIModel' || e.key === 'aiProviderConfigs') {
    loadConfiguration()
  }
}

const handleModelChange = (e: CustomEvent) => {
  loadConfiguration()
}

// 关闭面板
const closePanel = () => {
  window.dispatchEvent(new CustomEvent('close-right-panel'))
}

// 事件处理器
const handleSendMessage = (content: string) => {
  // AIChatSession 组件会处理消息发送逻辑
  console.log('发送消息:', content)
}

const handleClearMessages = () => {
  messages.value = []
}

const handleAttachFile = () => {
  console.log('附加文件功能')
}

const handleUpdateMessages = (newMessages: Message[]) => {
  messages.value = newMessages
}

// 生命周期
onMounted(() => {
  loadConfiguration()
  
  // 监听配置变化
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('ai-model-changed', handleModelChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('ai-model-changed', handleModelChange)
})
</script>

<style scoped>
.vscode-right-panel-container {
  background: var(--vscode-sideBar-background);
  border-left: 1px solid var(--vscode-sideBar-border);
}

.vscode-right-panel-header {
  background: var(--vscode-sideBarSectionHeader-background);
  border-bottom: 1px solid var(--vscode-sideBar-border);
}

.vscode-icon-button {
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--vscode-icon-foreground);
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vscode-icon-button:hover {
  background: var(--vscode-toolbar-hoverBackground);
}
</style>
