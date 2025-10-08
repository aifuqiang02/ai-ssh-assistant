<template>
  <div class="prompt-optimizer-view">
    <!-- 右侧内容区域 -->
    <div class="settings-content">
      <div class="content-inner">
        <!-- 提示词编辑 -->
        <section class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-pencil-square"></i>
            提示词编辑
          </h2>
          <p class="section-description">编辑和优化您的系统提示词</p>
        
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">当前提示词</label>
              <p class="setting-hint">编辑您的系统提示词内容</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="promptText"
                placeholder="输入系统提示词，例如：你是一个专业的编程助手..."
                class="prompt-textarea"
                rows="12"
              ></textarea>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 提示词相关
const promptText = ref('')

// 生命周期
onMounted(() => {
  // 加载当前提示词
  console.log('加载提示词优化助手')
})
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

.setting-section {
  margin-bottom: 48px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--vscode-fg);
}

.section-title i {
  font-size: 22px;
  color: var(--vscode-accent);
}

.section-description {
  margin: 0 0 24px 0;
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

.setting-row {
  display: flex;
  gap: 32px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vscode-border);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-left {
  flex: 1;
  min-width: 0;
}

.setting-right {
  flex-shrink: 0;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.setting-hint {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin: 0;
  line-height: 1.5;
}

/* ========== 表单控件 ========== */
.prompt-textarea {
  width: 100%;
  padding: 8px 12px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  color: var(--vscode-fg);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.prompt-textarea:focus {
  border-color: var(--vscode-accent);
}

.prompt-textarea:hover {
  border-color: var(--vscode-fg-muted);
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

