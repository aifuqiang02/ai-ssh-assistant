<template>
  <div class="about-view p-6">
    <div class="about-content max-w-2xl mx-auto">
      <!-- 应用logo和标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold  dark:text-white mb-2">
          AI SSH 助手
        </h1>
        <p class=" ">
          智能的 SSH 连接和管理工具
        </p>
        <div class="mt-2">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            版本 {{ appVersion }}
          </span>
        </div>
      </div>
      
      <!-- 应用介绍 -->
      <div class="app-info dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
        <h2 class="text-xl font-semibold mb-4  dark:text-white">关于应用</h2>
        <div class="space-y-3  ">
          <p>
            AI SSH 助手是一款现代化的 SSH 连接管理工具，集成了 AI 智能助手功能，
            帮助您更高效地管理远程服务器连接和操作。
          </p>
          <p>
            主要功能包括：智能对话助手、SSH 连接管理、终端操作、文件传输等。
          </p>
        </div>
      </div>
      
      <!-- 技术栈 -->
      <div class="tech-stack dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
        <h2 class="text-xl font-semibold mb-4  dark:text-white">技术栈</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="tech-item">
            <div class="font-medium  ">前端框架</div>
            <div class=" ">Vue 3 + TypeScript</div>
          </div>
          <div class="tech-item">
            <div class="font-medium  ">桌面框架</div>
            <div class=" ">Electron</div>
          </div>
          <div class="tech-item">
            <div class="font-medium  ">样式框架</div>
            <div class=" ">Tailwind CSS</div>
          </div>
          <div class="tech-item">
            <div class="font-medium  ">构建工具</div>
            <div class=" ">Vite</div>
          </div>
        </div>
      </div>
      
      <!-- 系统信息 -->
      <div class="system-info dark:bg-gray-800 rounded-lg p-6 shadow mb-6">
        <h2 class="text-xl font-semibold mb-4  dark:text-white">系统信息</h2>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class=" ">操作系统:</span>
            <span class="">{{ systemInfo.platform }}</span>
          </div>
          <div class="flex justify-between">
            <span class=" ">架构:</span>
            <span class="">{{ systemInfo.arch }}</span>
          </div>
          <div class="flex justify-between">
            <span class=" ">Node.js 版本:</span>
            <span class="">{{ systemInfo.nodeVersion }}</span>
          </div>
          <div class="flex justify-between">
            <span class=" ">Electron 版本:</span>
            <span class="">{{ systemInfo.electronVersion }}</span>
          </div>
        </div>
      </div>
      
      <!-- 链接 -->
      <div class="links dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 class="text-xl font-semibold mb-4  dark:text-white">相关链接</h2>
        <div class="flex flex-wrap gap-4">
          <a 
            href="#" 
            @click.prevent="openExternal('https://github.com')"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            GitHub 仓库
          </a>
          <a 
            href="#" 
            @click.prevent="openExternal('https://github.com')"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            使用文档
          </a>
          <a 
            href="#" 
            @click.prevent="openExternal('https://github.com')"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            问题反馈
          </a>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="copyright text-center mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 AI SSH 助手. 保留所有权利.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 应用版本号
const appVersion = ref('Loading...')

const systemInfo = ref({
  platform: 'Windows 10',
  arch: 'x64',
  nodeVersion: '18.17.0',
  electronVersion: '27.3.11'
})

const openExternal = (url: string) => {
  // 在 Electron 环境中打开外部链接
  if (window.electronAPI?.system?.openExternal) {
    window.electronAPI.system.openExternal(url)
  } else {
    window.open(url, '_blank')
  }
}

onMounted(() => {
  // 获取应用版本号
  if (window.electronAPI?.getVersion) {
    window.electronAPI.getVersion().then((version: string) => {
      appVersion.value = version
    }).catch(() => {
      appVersion.value = 'Unknown'
    })
  }

  // 获取系统信息
  if (window.electronAPI?.system?.getSystemInfo) {
    window.electronAPI.system.getSystemInfo().then((info: any) => {
      systemInfo.value = info
    })
  }
})
</script>

<style scoped>
.about-view {
  max-height: 100vh;
  overflow-y: auto;
  background: var(--vscode-bg);
  background-attachment: fixed;
}

.about-content {
  padding: 2rem 0;
}

.app-logo {
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
</style>
