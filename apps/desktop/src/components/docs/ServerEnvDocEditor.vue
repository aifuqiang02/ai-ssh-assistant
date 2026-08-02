<template>
  <div class="server-env-doc-editor">
    <!-- 编辑器头部 -->
    <div class="editor-header">
      <div class="header-left">
        <i class="bi bi-file-earmark-text"></i>
        <h3>{{ connectionInfo?.name || '服务器环境文档' }}</h3>
      </div>
      <div class="header-actions">
        <button @click="handleSave" class="btn btn-sm btn-primary" :disabled="saving">
          <i class="bi bi-save" :class="{ 'spinning': saving }"></i>
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <button @click="handleClose" class="btn btn-sm btn-secondary">
          <i class="bi bi-x"></i>
          关闭
        </button>
      </div>
    </div>

    <!-- 编辑器内容 -->
    <div class="editor-content">
      <div ref="editorContainer" class="monaco-editor-container"></div>
    </div>

    <!-- 状态提示 -->
    <div v-if="saveStatus" class="save-status" :class="saveStatus.type">
      <i :class="saveStatus.icon"></i>
      {{ saveStatus.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'
import { docStorageService } from '@/services/doc-storage.service'

interface Props {
  connectionId: string
  connectionInfo?: {
    name: string
    host: string
    port: number
    username: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: [doc: any]
}>()

const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null
const saving = ref(false)
const saveStatus = ref<{ type: 'success' | 'error'; icon: string; message: string } | null>(null)

// 配置 Monaco Editor
loader.config({ monaco })

// 加载或创建文档
const loadDocument = async () => {
  try {
    // 尝试读取现有文档
    let doc = await docStorageService.readServerEnvDoc(props.connectionId)
    
    if (!doc && props.connectionInfo) {
      // 如果不存在，生成模板
      const template = docStorageService.generateServerEnvTemplate(props.connectionInfo)
      doc = await docStorageService.saveServerEnvDoc(props.connectionId, template)
    }
    
    if (editor && doc) {
      editor.setValue(doc.content)
    }
  } catch (error) {
    console.error('[ServerEnvDocEditor] 加载文档失败:', error)
    if (editor) {
      editor.setValue('# 服务器环境文档\n\n加载失败，请重试。')
    }
  }
}

// 保存文档
const handleSave = async () => {
  if (!editor) return

  saving.value = true
  saveStatus.value = null

  try {
    const content = editor.getValue()
    const doc = await docStorageService.saveServerEnvDoc(props.connectionId, content)
    
    saveStatus.value = {
      type: 'success',
      icon: 'bi bi-check-circle-fill',
      message: '文档已保存'
    }
    
    emit('saved', doc)
    
    // 3秒后清除状态提示
    setTimeout(() => {
      saveStatus.value = null
    }, 3000)
  } catch (error: any) {
    console.error('[ServerEnvDocEditor] 保存文档失败:', error)
    saveStatus.value = {
      type: 'error',
      icon: 'bi bi-x-circle-fill',
      message: `保存失败: ${error.message}`
    }
  } finally {
    saving.value = false
  }
}

// 关闭编辑器
const handleClose = () => {
  emit('close')
}

// 初始化编辑器
onMounted(async () => {
  if (!editorContainer.value) return

  // 创建编辑器
  editor = monaco.editor.create(editorContainer.value, {
    value: '# 加载中...',
    language: 'markdown',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    insertSpaces: true,
    folding: true,
    renderWhitespace: 'selection',
  })

  // 加载文档
  await loadDocument()
  
  // 设置主题为 VSCode 风格
  monaco.editor.setTheme('vs-dark')
  
  // 聚焦编辑器
  editor.focus()
})

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<style scoped>
.server-env-doc-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vscode-editor-background);
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-panel-border);
  background: var(--vscode-panel-background);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left i {
  font-size: 20px;
  color: var(--vscode-accent);
}

.header-left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.editor-content {
  flex: 1;
  overflow: hidden;
}

.monaco-editor-container {
  width: 100%;
  height: 100%;
}

.save-status {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.save-status.success {
  background: var(--vscode-editorGutter-addedBackground);
  color: var(--vscode-button-foreground);
}

.save-status.error {
  background: var(--vscode-error);
  color: var(--vscode-button-foreground);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
