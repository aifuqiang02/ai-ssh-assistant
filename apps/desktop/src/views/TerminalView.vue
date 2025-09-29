<template>
  <div class="terminal-view p-6">
    <div class="terminal-header mb-4">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">终端</h2>
      <p class="text-gray-600 dark:text-gray-300">SSH 终端界面</p>
    </div>
    
    <div class="terminal-container bg-black rounded-lg p-4 font-mono text-green-400 min-h-96">
      <div class="terminal-content">
        <div class="terminal-prompt">
          $ 欢迎使用 AI SSH 助手终端
        </div>
        <div class="terminal-cursor animate-pulse">_</div>
      </div>
    </div>
    
    <div class="terminal-controls mt-4 flex gap-2">
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        连接
      </button>
      <button class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        断开
      </button>
      <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        清屏
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('TerminalView mounted')
})
</script>

<style scoped>
.terminal-cursor {
  display: inline-block;
  background-color: #00ff00;
  width: 8px;
  height: 1.2em;
}

.terminal-view {
  height: 100vh;
  overflow-y: auto;
}
</style>
