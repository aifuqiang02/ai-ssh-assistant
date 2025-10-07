<template>
  <div v-if="showModal" class="login-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="login-modal bg-vscode-bg-light border border-vscode-border rounded-lg shadow-lg w-96 p-6">
      <div class="modal-header mb-6">
        <h2 class="text-xl font-semibold text-vscode-fg mb-2">
          {{ isLoginMode ? '云端存储登录' : '创建新账号' }}
        </h2>
        <p class="text-vscode-fg-muted text-sm">
          {{ isLoginMode ? '登录以启用云端数据同步功能' : '注册账号以启用云端数据同步功能' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 邮箱 -->
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-vscode-fg mb-2">邮箱</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="form-input-full"
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
            class="form-input-full"
            :placeholder="isLoginMode ? '请输入密码' : '请设置密码（至少6位）'"
            :minlength="isLoginMode ? undefined : 6"
          />
        </div>

        <!-- 确认密码 (仅注册模式) -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="confirmPassword" class="block text-sm font-medium text-vscode-fg mb-2">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="form-input-full"
            placeholder="请再次输入密码"
            minlength="6"
          />
        </div>

        <!-- 用户名 (仅注册模式) -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="username" class="block text-sm font-medium text-vscode-fg mb-2">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="form-input-full"
            placeholder="请输入用户名"
            minlength="2"
          />
        </div>

        <!-- 记住登录 (仅登录模式) -->
        <div v-if="isLoginMode" class="form-group flex items-center">
          <input
            id="remember"
            v-model="rememberMe"
            type="checkbox"
            class="w-4 h-4 text-vscode-accent bg-vscode-bg border-vscode-border rounded"
          />
          <label for="remember" class="ml-2 text-sm text-vscode-fg-muted">记住登录状态</label>
        </div>

        <!-- 服务条款 (仅注册模式) -->
        <div v-if="!isLoginMode" class="form-group flex items-center">
          <input
            id="agreeTerms"
            v-model="agreeTerms"
            type="checkbox"
            required
            class="w-4 h-4 text-vscode-accent bg-vscode-bg border-vscode-border rounded"
          />
          <label for="agreeTerms" class="ml-2 text-sm text-vscode-fg-muted">
            我已阅读并同意 <a href="#" class="text-vscode-accent hover:underline">服务条款</a>
          </label>
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
            <span v-if="isLoading">{{ isLoginMode ? '登录中...' : '注册中...' }}</span>
            <span v-else>{{ isLoginMode ? '登录' : '注册' }}</span>
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
import apiService from '../../services/api.service'

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
const confirmPassword = ref('')
const username = ref('')
const rememberMe = ref(false)
const agreeTerms = ref(false)
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
  confirmPassword.value = ''
  username.value = ''
  rememberMe.value = false
  agreeTerms.value = false
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

const handleSubmit = async () => {
  if (isLoginMode.value) {
    await handleLogin()
  } else {
    await handleRegister()
  }
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '请填写完整的登录信息'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 调用真实的登录API
    const response = await apiService.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    })
    
    if (response.success && response.data) {
      // 保存用户信息和token
      const { user, accessToken } = response.data
      
      if (rememberMe.value) {
        localStorage.setItem('userToken', accessToken)
        localStorage.setItem('userInfo', JSON.stringify(user))
      } else {
        sessionStorage.setItem('userToken', accessToken)
        sessionStorage.setItem('userInfo', JSON.stringify(user))
      }

      // 设置API服务的token
      apiService.setToken(accessToken)

      // ✅ 服务架构会自动根据 token 切换到云端模式

      emit('login-success', user)
      closeModal()
    } else {
      errorMessage.value = response.message || '登录失败，请检查邮箱和密码'
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '网络错误，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  // 验证注册表单
  if (!email.value || !password.value || !confirmPassword.value || !username.value) {
    errorMessage.value = '请填写完整的注册信息'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = '密码长度至少6位'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  if (!agreeTerms.value) {
    errorMessage.value = '请同意服务条款'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 调用真实的注册API
    const response = await apiService.register({
      email: email.value,
      password: password.value,
      username: username.value
    })
    
    if (response.success && response.data) {
      // 注册成功，自动登录
      try {
        const loginResponse = await apiService.login({
          email: email.value,
          password: password.value,
          rememberMe: false
        })

        if (loginResponse.success && loginResponse.data) {
          const { user, accessToken } = loginResponse.data
          
          // 保存用户信息和token
          localStorage.setItem('userToken', accessToken)
          localStorage.setItem('userInfo', JSON.stringify(user))
          
          // 设置API服务的token
          apiService.setToken(accessToken)

          // ✅ 服务架构会自动根据 token 切换到云端模式

          emit('login-success', user)
          closeModal()
        } else {
          // 注册成功但自动登录失败，提示用户手动登录
          errorMessage.value = '注册成功！请手动登录'
          isLoginMode.value = true // 切换到登录模式
        }
      } catch (loginError) {
        console.error('Auto login after register failed:', loginError)
        errorMessage.value = '注册成功！请手动登录'
        isLoginMode.value = true // 切换到登录模式
      }
    } else {
      errorMessage.value = response.message || '注册失败，请稍后重试'
    }
  } catch (error) {
    console.error('Register error:', error)
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '网络错误，请稍后重试'
    }
  } finally {
    isLoading.value = false
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
