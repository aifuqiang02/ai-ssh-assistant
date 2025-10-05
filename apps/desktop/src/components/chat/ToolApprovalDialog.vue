<template>
  <div v-if="visible" class="tool-approval-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="tool-approval-dialog bg-vscode-bg border border-vscode-border rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- 头部 -->
      <div class="dialog-header p-4 border-b border-vscode-border">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-vscode-fg flex items-center gap-2">
            <i class="bi bi-tools text-vscode-accent"></i>
            工具调用请求
          </h3>
          <span class="px-2 py-1 text-xs rounded bg-vscode-bg-lighter text-vscode-fg-muted">
            需要批准
          </span>
        </div>
      </div>

      <!-- 内容 -->
      <div class="dialog-content p-4 space-y-4 max-h-96 overflow-y-auto">
        <!-- 工具信息 -->
        <div class="tool-info">
          <div class="text-sm text-vscode-fg-muted mb-2">工具名称</div>
          <div class="px-3 py-2 bg-vscode-bg-darker rounded text-vscode-fg font-mono">
            {{ request?.tool }}
          </div>
        </div>

        <!-- 参数 -->
        <div class="tool-params">
          <div class="text-sm text-vscode-fg-muted mb-2">参数</div>
          <div class="space-y-2">
            <div 
              v-for="(value, key) in request?.params" 
              :key="key"
              class="param-item p-3 bg-vscode-bg-darker rounded"
            >
              <div class="param-key text-xs text-vscode-fg-muted mb-1">{{ key }}</div>
              <div class="param-value text-sm text-vscode-fg font-mono whitespace-pre-wrap break-all">
                {{ value }}
              </div>
            </div>
          </div>
        </div>

        <!-- 描述 -->
        <div v-if="request?.description" class="tool-description">
          <div class="text-sm text-vscode-fg-muted mb-2">说明</div>
          <div class="p-3 bg-vscode-bg-lighter rounded text-sm text-vscode-fg">
            {{ request.description }}
          </div>
        </div>

        <!-- 警告信息（如果是潜在危险命令） -->
        <div v-if="isDangerousCommand" class="warning-box p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
          <div class="flex items-start gap-2">
            <i class="bi bi-exclamation-triangle text-yellow-500 mt-0.5"></i>
            <div class="text-sm text-yellow-400">
              <div class="font-medium mb-1">⚠️ 警告：潜在危险操作</div>
              <div class="text-xs opacity-90">
                此命令可能会修改或删除文件，请仔细确认后再批准执行。
              </div>
            </div>
          </div>
        </div>

        <!-- 反馈输入 -->
        <div class="feedback-section">
          <label class="text-sm text-vscode-fg-muted mb-2 block">
            反馈（可选）
            <span class="text-xs opacity-75 ml-2">提供额外的指示或限制</span>
          </label>
          <textarea
            v-model="feedback"
            placeholder="例如：只显示前10行，或者使用 sudo 执行..."
            class="w-full px-3 py-2 bg-vscode-bg-darker border border-vscode-border rounded text-vscode-fg text-sm resize-none"
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="dialog-footer p-4 border-t border-vscode-border flex items-center justify-between">
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-2 text-sm text-vscode-fg cursor-pointer">
            <input
              v-model="rememberChoice"
              type="checkbox"
              class="form-checkbox h-4 w-4"
            />
            <span>记住此类工具的选择</span>
          </label>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="handleReject"
            class="px-4 py-2 rounded border border-vscode-border text-vscode-fg hover:bg-vscode-bg-lighter transition"
          >
            拒绝
          </button>
          <button
            @click="handleApprove"
            class="px-4 py-2 rounded bg-vscode-accent text-white hover:bg-vscode-accent-hover transition flex items-center gap-2"
          >
            <i class="bi bi-check-lg"></i>
            批准执行
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ToolApprovalRequest, ToolApprovalResponse } from '../../types/tools'

interface Props {
  visible: boolean
  request: ToolApprovalRequest | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'approve': [response: ToolApprovalResponse]
  'reject': [response: ToolApprovalResponse]
  'close': []
}>()

const feedback = ref('')
const rememberChoice = ref(false)

// 检查是否为危险命令
const isDangerousCommand = computed(() => {
  if (props.request?.tool !== 'execute_ssh_command') {
    return false
  }

  const command = props.request.params.command as string
  if (!command) return false

  const dangerousPatterns = [
    /rm\s+-rf/,
    /rm\s+.*\*/,
    /dd\s+/,
    /mkfs/,
    /chmod\s+-R/,
    /chown\s+-R/,
    />.*\/dev/,
    /shutdown/,
    /reboot/,
    /kill\s+-9/,
    /pkill/,
    /format/,
  ]

  return dangerousPatterns.some(pattern => pattern.test(command))
})

const handleApprove = () => {
  emit('approve', {
    approved: true,
    feedback: feedback.value.trim() || undefined
  })
  emit('close')
  feedback.value = ''
  rememberChoice.value = false
}

const handleReject = () => {
  emit('reject', {
    approved: false,
    feedback: feedback.value.trim() || undefined
  })
  emit('close')
  feedback.value = ''
  rememberChoice.value = false
}
</script>

<style scoped>
.tool-approval-overlay {
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
}

.tool-approval-dialog {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.param-item {
  transition: background-color 0.2s;
}

.param-item:hover {
  background-color: var(--vscode-list-hoverBackground);
}
</style>

