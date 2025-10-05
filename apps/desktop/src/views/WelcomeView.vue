<template>
  <div class="welcome-view h-full flex flex-col bg-vscode-bg-light">
    <!-- 欢迎页面内容 -->
    <div class="welcome-content flex-1 p-8 overflow-y-auto">
      <div class="max-w-4xl mx-auto">
        <!-- 应用标题和介绍 -->
        <div class="text-center mb-12">
          <div class="app-logo mb-6">
            <svg class="w-20 h-20 mx-auto text-vscode-accent" fill="currentColor" viewBox="0 0 16 16">
              <!-- SSH/Terminal 图标设计 -->
              <path d="M2 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2zm0 1h12v8H2V4z"/>
              <path d="M3 6l2 1.5L3 9v1l3-2V7L3 5v1zm4 3h3v1H7V9z"/>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-vscode-fg mb-4">AI SSH Assistant</h1>
          <p class="text-lg text-vscode-fg-muted max-w-2xl mx-auto">
            智能的 SSH 连接和管理工具，帮助您更高效地管理远程服务器
          </p>
        </div>

        <!-- 功能特性 -->
        <div class="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div class="feature-card bg-vscode-bg border border-vscode-border rounded-lg p-6 hover:border-vscode-accent transition-colors">
            <div class="feature-icon mb-4">
              <i class="bi bi-hdd-network text-2xl text-vscode-accent"></i>
            </div>
            <h3 class="text-lg font-semibold text-vscode-fg mb-2">SSH 连接管理</h3>
            <p class="text-vscode-fg-muted">
              安全地管理多个 SSH 连接，支持密钥认证和密码认证
            </p>
          </div>

          <div class="feature-card bg-vscode-bg border border-vscode-border rounded-lg p-6 hover:border-vscode-accent transition-colors">
            <div class="feature-icon mb-4">
              <i class="bi bi-terminal text-2xl text-vscode-accent"></i>
            </div>
            <h3 class="text-lg font-semibold text-vscode-fg mb-2">终端操作</h3>
            <p class="text-vscode-fg-muted">
              内置终端模拟器，支持多标签页和会话管理
            </p>
          </div>

          <div class="feature-card bg-vscode-bg border border-vscode-border rounded-lg p-6 hover:border-vscode-accent transition-colors">
            <div class="feature-icon mb-4">
              <i class="bi bi-folder text-2xl text-vscode-accent"></i>
            </div>
            <h3 class="text-lg font-semibold text-vscode-fg mb-2">文件管理</h3>
            <p class="text-vscode-fg-muted">
              可视化文件浏览器，支持文件上传、下载和编辑
            </p>
          </div>

          <div class="feature-card bg-vscode-bg border border-vscode-border rounded-lg p-6 hover:border-vscode-accent transition-colors">
            <div class="feature-icon mb-4">
              <i class="bi bi-gear text-2xl text-vscode-accent"></i>
            </div>
            <h3 class="text-lg font-semibold text-vscode-fg mb-2">配置管理</h3>
            <p class="text-vscode-fg-muted">
              灵活的配置管理，支持多种连接参数和个性化设置
            </p>
          </div>


          <div class="feature-card bg-vscode-bg border border-vscode-border rounded-lg p-6 hover:border-vscode-accent transition-colors">
            <div class="feature-icon mb-4">
              <i class="bi bi-shield-check text-2xl text-vscode-accent"></i>
            </div>
            <h3 class="text-lg font-semibold text-vscode-fg mb-2">安全可靠</h3>
            <p class="text-vscode-fg-muted">
              采用业界标准的安全协议，保护您的连接和数据安全
            </p>
          </div>
        </div>

        <!-- 快速开始 -->
        <div class="quick-start bg-vscode-bg border border-vscode-border rounded-lg p-8 text-center">
          <h2 class="text-2xl font-bold text-vscode-fg mb-4">快速开始</h2>
          <p class="text-vscode-fg-muted mb-6">
            选择左侧功能菜单开始使用，开始您的 SSH 管理之旅
          </p>
          <div class="flex justify-center gap-4">
            <button 
              @click="openSSHConnections"
              class="px-6 py-3 bg-vscode-accent text-white rounded-md hover:bg-vscode-accent-hover transition-colors flex items-center gap-2"
            >
              <i class="bi bi-hdd-network"></i>
              管理 SSH 连接
            </button>
            <button 
              @click="openFileManager"
              class="px-6 py-3 border border-vscode-border text-vscode-fg rounded-md hover:bg-vscode-bg-lighter transition-colors flex items-center gap-2"
            >
              <i class="bi bi-folder"></i>
              文件管理
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 快速开始按钮的处理函数
const openSSHConnections = () => {
  // 切换到 SSH 连接视图
  const event = new CustomEvent('switch-view', {
    detail: { viewId: 'ssh' }
  })
  window.dispatchEvent(event)
}

const openFileManager = () => {
  // 切换到文件管理视图
  const event = new CustomEvent('switch-view', {
    detail: { viewId: 'files' }
  })
  window.dispatchEvent(event)
}
</script>

<style scoped>
.welcome-view {
  height: 100vh;
}

.app-logo svg {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-start {
  background: linear-gradient(135deg, rgba(var(--vscode-accent-rgb), 0.05) 0%, rgba(var(--vscode-accent-rgb), 0.1) 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-content {
    padding: 1rem;
  }
  
  .flex.justify-center.gap-4 {
    flex-direction: column;
    align-items: center;
  }
  
  .flex.justify-center.gap-4 button {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
