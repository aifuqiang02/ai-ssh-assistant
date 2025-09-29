<template>
  <div class="chat-view h-full flex flex-col bg-vscode-bg-light">
    <div class="chat-header p-4 border-b bg-vscode-bg-light border-vscode-border">
      <h2 class="text-xl font-bold text-vscode-fg">AI 对话</h2>
      <p class="text-vscode-fg-muted">与 AI 助手进行对话</p>
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
          class="flex-1 px-3 py-2 border rounded-md bg-vscode-bg border-vscode-border text-vscode-fg placeholder-vscode-fg-muted"
        />
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim()"
          class="px-4 py-2 bg-vscode-accent text-white rounded-md hover:bg-vscode-accent-hover disabled:opacity-50"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const messages = ref<Message[]>([])
const inputMessage = ref('')

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
  
  // 模拟 AI 回复
  setTimeout(() => {
    const aiResponse: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `收到您的消息："${userInput}"。这是一个模拟的 AI 回复。`,
      timestamp: new Date()
    }
    messages.value.push(aiResponse)
  }, 1000)
}
</script>

<style scoped>
.chat-view {
  height: 100vh;
}
</style>
