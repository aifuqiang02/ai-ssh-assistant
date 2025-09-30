<template>
  <div class="ssh-view p-6 bg-vscode-bg-light h-full">
    <div class="ssh-header mb-6">
      <h2 class="text-2xl font-bold text-vscode-fg">SSH 连接</h2>
      <p class="text-vscode-fg-muted">管理和创建 SSH 连接</p>
    </div>
    
    <div class="ssh-form bg-vscode-bg rounded-lg p-6 border border-vscode-border mb-6">
      <h3 class="text-lg font-semibold mb-4 text-vscode-fg">新建连接</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-vscode-fg mb-2">
            主机地址
          </label>
          <input
            v-model="connectionForm.host"
            type="text"
            placeholder="192.168.1.100"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-vscode-fg mb-2">
            端口
          </label>
          <input
            v-model="connectionForm.port"
            type="number"
            placeholder="22"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-vscode-fg mb-2">
            用户名
          </label>
          <input
            v-model="connectionForm.username"
            type="text"
            placeholder="root"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-vscode-fg mb-2">
            密码
          </label>
          <input
            v-model="connectionForm.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
          />
        </div>
      </div>
      
      <div class="mt-4">
        <label class="block text-sm font-medium text-vscode-fg mb-2">
          连接名称
        </label>
        <input
          v-model="connectionForm.name"
          type="text"
          placeholder="我的服务器"
          class="form-input-full"
        />
      </div>
      
      <div class="mt-6 flex gap-2">
        <button
          @click="testConnection"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          测试连接
        </button>
        <button
          @click="saveConnection"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          保存连接
        </button>
      </div>
    </div>
    
    <div class="connection-status" v-if="connectionStatus">
      <div 
        :class="[
          'p-4 rounded-md mb-4',
          connectionStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]"
      >
        {{ connectionStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ConnectionForm {
  host: string
  port: number
  username: string
  password: string
  name: string
}

interface ConnectionStatus {
  type: 'success' | 'error'
  message: string
}

const connectionForm = ref<ConnectionForm>({
  host: '',
  port: 22,
  username: '',
  password: '',
  name: ''
})

const connectionStatus = ref<ConnectionStatus | null>(null)

const testConnection = () => {
  connectionStatus.value = {
    type: 'success',
    message: '连接测试成功！'
  }
  
  // 3秒后清除状态
  setTimeout(() => {
    connectionStatus.value = null
  }, 3000)
}

const saveConnection = () => {
  if (!connectionForm.value.host || !connectionForm.value.username) {
    connectionStatus.value = {
      type: 'error',
      message: '请填写主机地址和用户名'
    }
    return
  }
  
  connectionStatus.value = {
    type: 'success',
    message: '连接配置已保存！'
  }
  
  // 清空表单
  connectionForm.value = {
    host: '',
    port: 22,
    username: '',
    password: '',
    name: ''
  }
  
  setTimeout(() => {
    connectionStatus.value = null
  }, 3000)
}
</script>

<style scoped>
.ssh-view {
  max-height: 100vh;
  overflow-y: auto;
}
</style>
