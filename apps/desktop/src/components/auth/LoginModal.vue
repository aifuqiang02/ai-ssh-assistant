<template>
  <div v-if="showModal" class="login-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="login-modal bg-vscode-bg-light border border-vscode-border rounded-lg shadow-lg w-96 p-6">
      <div class="modal-header mb-6">
        <h2 class="text-xl font-semibold text-vscode-fg mb-2">云端存储登录</h2>
        <p class="text-vscode-fg-muted text-sm">登录以启用云端数据同步功能</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- 邮箱 -->
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-vscode-fg mb-2">邮箱</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border rounded-md bg-vscode-bg border-vscode-border text-vscode-fg focus:outline-none focus:border-vscode-accent"
            placeholder="请输入邮箱地址"
          />
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label for="password" class="block text-sm font-medium text-vscode-fg mb-2">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded-md bg-vscode-bg border-vscode-border text-vscode-fg focus:outline-none focus:border-vscode-accent"
            placeholder="请输入密码"
          />
        </div>

        <!-- 记住登录 -->
        <div class="form-group flex items-center">
          <input
            id="remember"
            v-model="rememberMe"
            type="checkbox"
            class="w-4 h-4 text-vscode-accent bg-vscode-bg border-vscode-border rounded"
          />
          <label for="remember" class="ml-2 text-sm text-vscode-fg-muted">记住登录状态</label>
        </div>

        <!-- 错误信息 -->
        <div v-if="errorMessage" class="error-message text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <!-- 按钮组 -->
        <div class="modal-actions flex space-x-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 vscode-button"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 vscode-button primary"
          >
            <span v-if="isLoading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </div>

        <!-- 注册链接 -->
        <div class="text-center pt-4">
          <button
            type="button"
            @click="toggleMode"
            class="text-vscode-accent hover:underline text-sm"
          >
            {{ isLoginMode ? '没有账号？点击注册' : '已有账号？点击登录' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'login-success', user: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showModal = ref(props.show)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isLoginMode = ref(true)

watch(() => props.show, (newVal) => {
  showModal.value = newVal
  if (newVal) {
    resetForm()
  }
})

const resetForm = () => {
  email.value = ''
  password.value = ''
  rememberMe.value = false
  errorMessage.value = ''
  isLoading.value = false
}

const closeModal = () => {
  showModal.value = false
  emit('close')
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '请填写完整的登录信息'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 这里替换为实际的登录API调用
    const response = await mockLogin(email.value, password.value)
    
    if (response.success) {
      // 保存用户信息和token
      if (rememberMe.value) {
        localStorage.setItem('userToken', response.token)
        localStorage.setItem('userInfo', JSON.stringify(response.user))
      } else {
        sessionStorage.setItem('userToken', response.token)
        sessionStorage.setItem('userInfo', JSON.stringify(response.user))
      }

      emit('login-success', response.user)
      closeModal()
    } else {
      errorMessage.value = response.message || '登录失败，请检查邮箱和密码'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = '网络错误，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 模拟登录API - 实际项目中替换为真实API
const mockLogin = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟网络延迟
  
  // 模拟登录验证
  if (email === 'demo@example.com' && password === 'demo123') {
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        email: email,
        name: '演示用户',
        avatar: '',
        cloudStorageEnabled: true
      }
    }
  } else {
    return {
      success: false,
      message: '邮箱或密码错误'
    }
  }
}
</script>

<style scoped>
.login-modal-overlay {
  backdrop-filter: blur(4px);
}

.login-modal {
  background: var(--vscode-bg-light);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.vscode-button {
  padding: 8px 16px;
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
  min-height: 32px;
}

.vscode-button:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.vscode-button:focus {
  outline: 1px solid var(--vscode-accent);
  outline-offset: 2px;
}

.vscode-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vscode-button.primary {
  background: var(--vscode-accent);
  color: #ffffff;
  border-color: var(--vscode-accent);
}

.vscode-button.primary:hover:not(:disabled) {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

.error-message {
  padding: 8px 12px;
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 4px;
  font-size: 13px;
}
</style>
