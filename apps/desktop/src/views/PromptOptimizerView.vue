<template>
  <div class="prompt-optimizer-view">
    <!-- 内容区域 -->
    <div class="settings-content">
      <div class="content-inner">
        <!-- 等待添加内容 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 预留变量和方法区域
</script>

<style scoped>
/* ========== 布局 ========== */
.prompt-optimizer-view {
  display: flex;
  height: 100vh;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* ========== 内容区域 ========== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-inner {
  max-width: 800px;
  padding: 32px 48px;
}

/* ========== 滚动条 ========== */
.settings-content::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-fg-muted);
}
</style>

