<template>
  <div class="code-block-container">
    <div class="code-header">
      <span class="code-language">{{ displayLanguage }}</span>
      <span class="code-lines">{{ lines }} {{ lines > 1 ? 'lines' : 'line' }}</span>
      <button 
        @click="copyCode" 
        class="copy-button" 
        :class="{ copied }"
        :title="copied ? '已复制' : '复制代码'"
      >
        <i :class="copied ? 'bi bi-check2' : 'bi bi-clipboard'"></i>
      </button>
    </div>
    <div class="code-content" ref="codeRef">
      <pre><code :class="`language-${language}`" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import hljs from 'highlight.js'

const props = defineProps<{
  code: string
  language: string
}>()

const copied = ref(false)
const codeRef = ref<HTMLElement>()

const lines = computed(() => props.code.split('\n').length)

const displayLanguage = computed(() => {
  const lang = props.language || 'text'
  // 语言名称映射
  const langMap: Record<string, string> = {
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'py': 'Python',
    'sh': 'Shell',
    'bash': 'Bash',
    'json': 'JSON',
    'xml': 'XML',
    'html': 'HTML',
    'css': 'CSS',
    'sql': 'SQL',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'go': 'Go',
    'rust': 'Rust',
    'php': 'PHP',
    'ruby': 'Ruby',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'text': 'Plain Text',
    'plaintext': 'Plain Text'
  }
  return langMap[lang.toLowerCase()] || lang.toUpperCase()
})

const highlightedCode = computed(() => {
  try {
    if (props.language && hljs.getLanguage(props.language)) {
      return hljs.highlight(props.code, { language: props.language }).value
    } else {
      return hljs.highlightAuto(props.code).value
    }
  } catch (error) {
    console.error('Code highlighting error:', error)
    return escapeHtml(props.code)
  }
})

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}
</script>

<style scoped>
.code-block-container {
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  /* 确保代码块内容可以选择 */
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--vscode-bg-lighter);
  border-bottom: 1px solid var(--vscode-border);
  min-height: 32px;
  /* 头部不应被选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.code-language {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--vscode-descriptionForeground, #999);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.code-lines {
  font-size: 10px;
  color: var(--vscode-descriptionForeground, #999);
  opacity: 0.6;
  margin-left: auto;
  margin-right: 8px;
}

.copy-button {
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: var(--vscode-fg);
  cursor: pointer;
  border-radius: 4px;
  opacity: 0.6;
  transition: all 0.2s;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  /* 按钮本身不应被选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.copy-button:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.copy-button.copied {
  color: #4caf50;
  opacity: 1;
}

.code-content {
  overflow-x: auto;
  background: var(--vscode-bg);
}

.code-content pre {
  margin: 0;
  padding: 16px;
  background: transparent;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  cursor: text;
}

.code-content code {
  font-family: 'Consolas', 'Monaco', 'Courier New', 'SF Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vscode-fg);
  background: transparent;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  cursor: text;
}

/* 文本选择样式 */
.code-content {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.code-content ::selection {
  background: rgba(100, 150, 255, 0.3);
}

.code-content ::-moz-selection {
  background: rgba(100, 150, 255, 0.3);
}

/* 滚动条样式 */
.code-content::-webkit-scrollbar {
  height: 8px;
}

.code-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.code-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.code-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

