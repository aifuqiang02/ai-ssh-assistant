<template>
  <div class="vscode-sidebar-container h-full flex flex-col">
    <!-- 侧边栏标题 -->
    <div class="vscode-sidebar-header px-4 py-2 border-b border-vscode-border">
      <h3 class="text-sm font-medium text-vscode-fg m-0">{{ sidebarTitle }}</h3>
    </div>
    
    <!-- 侧边栏内容 -->
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <!-- SSH 连接视图 -->
      <div v-if="activeView === 'ssh'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2">
            新建连接
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            连接列表
          </div>
          <div 
            v-for="connection in connections" 
            :key="connection.id"
            class="vscode-tree-item"
          >
            <i class="bi bi-hdd-network text-vscode-accent mr-2"></i>
            <span>{{ connection.name }}</span>
            <div class="vscode-tree-actions">
              <button class="vscode-icon-button" title="连接">
                <i class="bi bi-play"></i>
              </button>
              <button class="vscode-icon-button" title="编辑">
                <i class="bi bi-pencil"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- AI 聊天视图 -->
      <div v-else-if="activeView === 'chat'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2">
            新建对话
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            聊天历史
          </div>
          <div 
            v-for="chat in chatHistory" 
            :key="chat.id"
            class="vscode-tree-item"
          >
            <i class="bi bi-chat-dots text-vscode-success mr-2"></i>
            <span class="truncate">{{ chat.title }}</span>
          </div>
        </div>
      </div>
      
      <!-- 文件管理视图 -->
      <div v-else-if="activeView === 'files'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2">
            打开文件夹
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            文件浏览器
          </div>
          <div class="vscode-tree-item">
            <i class="bi bi-folder text-vscode-warning mr-2"></i>
            <span>项目文件夹</span>
          </div>
        </div>
      </div>
      
      <!-- 终端视图 -->
      <div v-else-if="activeView === 'terminal'" class="p-4">
        <div class="mb-4">
          <button class="vscode-button primary w-full mb-2">
            新建终端
          </button>
        </div>
        
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            终端会话
          </div>
          <div 
            v-for="terminal in terminals" 
            :key="terminal.id"
            class="vscode-tree-item"
          >
            <i class="bi bi-terminal text-vscode-info mr-2"></i>
            <span>{{ terminal.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- 历史记录视图 -->
      <div v-else-if="activeView === 'history'" class="p-4">
        <div class="space-y-2">
          <div class="vscode-tree-title text-xs font-medium text-vscode-fg-muted mb-2">
            操作历史
          </div>
          <div 
            v-for="item in history" 
            :key="item.id"
            class="vscode-tree-item"
          >
            <i class="bi bi-clock-history text-vscode-fg-muted mr-2"></i>
            <span class="text-sm">{{ item.action }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  activeView: string
}

const props = defineProps<Props>()

// 模拟数据
const connections = ref([
  { id: '1', name: '生产服务器', host: '192.168.1.100' },
  { id: '2', name: '开发环境', host: '192.168.1.101' },
  { id: '3', name: '测试服务器', host: '192.168.1.102' }
])

const chatHistory = ref([
  { id: '1', title: '如何优化数据库查询？' },
  { id: '2', title: 'SSH 连接问题排查' },
  { id: '3', title: 'Docker 部署指南' }
])

const terminals = ref([
  { id: '1', name: 'bash' },
  { id: '2', name: 'powershell' }
])

const history = ref([
  { id: '1', action: '连接到生产服务器' },
  { id: '2', action: '执行命令: ls -la' },
  { id: '3', action: '上传文件到服务器' }
])

// 计算侧边栏标题
const sidebarTitle = computed(() => {
  const titles: Record<string, string> = {
    ssh: 'SSH 连接',
    chat: 'AI 助手',
    files: '文件管理',
    terminal: '终端',
    history: '历史记录'
  }
  return titles[props.activeView] || 'SSH 连接'
})
</script>

<style scoped>
.vscode-sidebar-container {
  background: var(--vscode-bg-light);
  color: var(--vscode-fg);
}

.vscode-sidebar-header {
  background: var(--vscode-bg-light);
}

.vscode-button {
  padding: 6px 12px;
  font-size: 13px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  background: var(--vscode-bg-light);
  color: var(--vscode-fg);
  cursor: pointer;
  transition: all 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
}

.vscode-button:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.vscode-button:focus {
  outline: 1px solid var(--vscode-accent);
  outline-offset: 2px;
}

.vscode-button:active {
  background: var(--vscode-bg);
}

/* 主要按钮样式 */
.vscode-button.primary {
  background: var(--vscode-accent);
  color: #ffffff;
  border-color: var(--vscode-accent);
}

.vscode-button.primary:hover {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

.vscode-button.primary:active {
  background: var(--vscode-accent-hover);
}

.vscode-tree-title {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vscode-fg-muted);
}

.vscode-tree-item {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.1s ease;
}

.vscode-tree-item:hover {
  background: var(--vscode-bg-lighter);
}

.vscode-tree-actions {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.15s ease;
  display: flex;
  gap: 0.25rem;
}

.vscode-tree-item:hover .vscode-tree-actions {
  opacity: 1;
}

.vscode-icon-button {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: color 0.15s ease;
  color: var(--vscode-fg-muted);
}

.vscode-icon-button:hover {
  color: var(--vscode-fg);
  background: var(--vscode-bg-lighter);
}

.vscode-icon-button i {
  font-size: 11px;
}

/* Bootstrap Icons 图标字体支持 */
.bi-plus::before { content: "➕"; }
.bi-hdd-network::before { content: "🖥️"; }
.bi-play::before { content: "▶️"; }
.bi-pencil::before { content: "✏️"; }
.bi-chat-dots::before { content: "💬"; }
.bi-folder-plus::before { content: "📁"; }
.bi-folder::before { content: "📂"; }
.bi-terminal::before { content: "💻"; }
.bi-clock-history::before { content: "🕒"; }

[class^="bi-"] {
  font-style: normal;
  display: inline-block;
  width: 1rem;
  height: 1rem;
  text-align: center;
}

/* 颜色变量 */
.text-vscode-accent {
  color: var(--vscode-accent);
}

.text-vscode-success {
  color: var(--vscode-success);
}

.text-vscode-warning {
  color: var(--vscode-warning);
}

.text-vscode-info {
  color: var(--vscode-accent);
}

.text-vscode-fg-muted {
  color: var(--vscode-fg-muted);
}
</style>