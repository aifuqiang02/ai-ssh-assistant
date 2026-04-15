<template>
  <div class="not-found-view flex items-center justify-center min-h-screen p-6">
    <div class="text-center max-w-md">
      <!-- 404 图标 -->
      <div class="mb-8">
        <div class="text-8xl font-bold text-gray-300 dark:text-gray-600">
          404
        </div>
        <div class="text-2xl text-gray-500 dark:text-gray-400 mt-2">
          页面未找到
        </div>
      </div>
      
      <!-- 错误信息 -->
      <div class="mb-8">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          抱歉，您访问的页面不存在或已被移动。
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          请检查 URL 地址是否正确，或使用导航菜单返回主页。
        </p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="space-y-3">
        <button
          @click="goHome"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          返回首页
        </button>
        
        <button
          @click="goBack"
          class="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          返回上一页
        </button>
      </div>
      
      <!-- 建议链接 -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
          您可能想要访问：
        </p>
        <div class="space-y-2">
          <router-link
            to="/chat"
            class="block text-blue-600 hover:text-blue-700 text-sm"
          >
            AI 对话
          </router-link>
          <router-link
            to="/ssh"
            class="block text-blue-600 hover:text-blue-700 text-sm"
          >
            SSH 连接
          </router-link>
          <router-link
            to="/connections"
            class="block text-blue-600 hover:text-blue-700 text-sm"
          >
            连接管理
          </router-link>
          <router-link
            to="/settings"
            class="block text-blue-600 hover:text-blue-700 text-sm"
          >
            设置
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found-view {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  .not-found-view {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }
}
</style>
