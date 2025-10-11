<template>
  <teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEdit ? '编辑连接' : '新建连接' }}</h3>
          <button class="close-button" @click="handleClose">
            <i class="bi bi-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- 连接名称 -->
            <div class="form-group">
              <label class="form-label">连接名称 <span class="required">*</span></label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input-full"
                placeholder="我的服务器"
                required
              />
            </div>

            <!-- 主机和端口 -->
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">主机地址 <span class="required">*</span></label>
                <input
                  v-model="formData.host"
                  type="text"
                  class="w-full"
                  placeholder="192.168.1.100"
                  required
                />
              </div>
              <div class="form-group" style="width: 120px;">
                <label class="form-label">端口</label>
                <input
                  v-model.number="formData.port"
                  type="number"
                  class="w-full"
                  placeholder="22"
                />
              </div>
            </div>

            <!-- 用户名 -->
            <div class="form-group">
              <label class="form-label">用户名 <span class="required">*</span></label>
              <input
                v-model="formData.username"
                type="text"
                class="form-input-full"
                placeholder="root"
                required
              />
            </div>

            <!-- 认证方式 -->
            <div class="form-group">
              <label class="form-label">认证方式</label>
              <select v-model="formData.authType" class="form-input-full">
                <option value="PASSWORD">密码</option>
                <option value="PRIVATE_KEY">私钥</option>
                <option value="SSH_AGENT">SSH Agent</option>
              </select>
            </div>

            <!-- 密码（当认证方式为密码时显示） -->
            <div v-if="formData.authType === 'PASSWORD'" class="form-group">
              <label class="form-label">密码</label>
              <input
                v-model="formData.password"
                type="password"
                class="form-input-full"
                placeholder="••••••••"
              />
            </div>

            <!-- 私钥（当认证方式为私钥时显示） -->
            <div v-if="formData.authType === 'PRIVATE_KEY'" class="form-group">
              <label class="form-label">私钥路径</label>
              <input
                v-model="formData.privateKey"
                type="text"
                class="form-input-full"
                placeholder="~/.ssh/id_rsa"
              />
            </div>

            <!-- 私钥密码 -->
            <div v-if="formData.authType === 'PRIVATE_KEY' && formData.privateKey" class="form-group">
              <label class="form-label">私钥密码（可选）</label>
              <input
                v-model="formData.passphrase"
                type="password"
                class="form-input-full"
                placeholder="如果私钥有密码保护"
              />
            </div>

            <!-- 错误和成功提示 -->
            <div v-if="error" class="error-message">
              <i class="bi bi-exclamation-circle"></i>
              {{ error }}
            </div>
            <div v-if="successMessage" class="success-message">
              <i class="bi bi-check-circle"></i>
              {{ successMessage }}
            </div>

            <!-- 底部按钮 -->
            <div class="modal-footer">
              <button type="button" class="btn-secondary" @click="handleClose">
                取消
              </button>
              <button type="button" class="btn-test" @click="handleTest" :disabled="loading">
                {{ loading ? '测试中...' : '测试连接' }}
              </button>
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? '保存中...' : (isEdit ? '更新' : '创建') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface SSHConnectionFormData {
  name: string
  host: string
  port: number
  username: string
  authType: 'PASSWORD' | 'PRIVATE_KEY' | 'SSH_AGENT'
  password?: string
  privateKey?: string
  passphrase?: string
  folderId?: string | null
}

interface Props {
  modelValue: boolean
  connection?: any
  folderId?: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: SSHConnectionFormData]
  'test': [data: SSHConnectionFormData]
}>()

const isEdit = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const formData = ref<SSHConnectionFormData>({
  name: '',
  host: '',
  port: 22,
  username: '',
  authType: 'PASSWORD',
  password: '',
  privateKey: '',
  passphrase: '',
  folderId: props.folderId
})

// 重置表单（需要先定义，因为 watch 中会用到）
const resetForm = () => {
  formData.value = {
    name: '',
    host: '',
    port: 22,
    username: '',
    authType: 'PASSWORD',
    password: '',
    privateKey: '',
    passphrase: '',
    folderId: props.folderId
  }
}

// 监听 connection 变化，用于编辑模式
watch(() => props.connection, (newVal) => {
  if (newVal) {
    isEdit.value = true
    formData.value = {
      name: newVal.name || '',
      host: newVal.host || '',
      port: newVal.port || 22,
      username: newVal.username || '',
      authType: newVal.authType || 'PASSWORD',
      password: newVal.password || '',
      privateKey: newVal.privateKey || '',
      passphrase: newVal.passphrase || '',
      folderId: newVal.folderId
    }
  } else {
    isEdit.value = false
    resetForm()
  }
}, { immediate: true })

// 监听 folderId 变化
watch(() => props.folderId, (newVal) => {
  formData.value.folderId = newVal
})

const handleClose = () => {
  emit('update:modelValue', false)
  error.value = null
  successMessage.value = null
  if (!isEdit.value) {
    resetForm()
  }
}

const handleSubmit = async () => {
  error.value = null
  loading.value = true
  
  try {
    emit('submit', { ...formData.value })
    handleClose()
  } catch (err: any) {
    error.value = err.message || '保存失败'
  } finally {
    loading.value = false
  }
}

const handleTest = async () => {
  error.value = null
  successMessage.value = null
  
  // 表单验证
  if (!formData.value.host) {
    error.value = '请输入主机地址'
    return
  }
  if (!formData.value.username) {
    error.value = '请输入用户名'
    return
  }
  if (formData.value.authType === 'PASSWORD' && !formData.value.password) {
    error.value = '请输入密码'
    return
  }
  if (formData.value.authType === 'PRIVATE_KEY' && !formData.value.privateKey) {
    error.value = '请输入私钥'
    return
  }
  
  loading.value = true
  
  try {
    // 直接调用 API 测试
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
    if (!token) {
      throw new Error('未登录')
    }

    console.log('Testing SSH connection:', {
      host: formData.value.host,
      port: formData.value.port || 22,
      username: formData.value.username,
      authType: formData.value.authType
    })

    const response = await fetch('http://localhost:3000/api/v1/ssh/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        host: formData.value.host,
        port: formData.value.port || 22,
        username: formData.value.username,
        authType: formData.value.authType,
        password: formData.value.password || null,
        privateKey: formData.value.privateKey || null,
        passphrase: formData.value.passphrase || null
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Test result:', result)
    
    if (result.success && result.data.connected) {
      successMessage.value = '✓ 连接测试成功！'
      error.value = null
    } else {
      error.value = result.data.error || '连接测试失败'
      successMessage.value = null
    }
  } catch (err: any) {
    console.error('Test connection failed:', err)
    error.value = err.message || '测试连接时发生错误'
    successMessage.value = null
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
  margin: 0;
}

.close-button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.close-button:hover {
  background: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

.close-button i {
  font-size: 20px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.flex-1 {
  flex: 1;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin-bottom: 6px;
}

.required {
  color: var(--vscode-error);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(var(--vscode-error-rgb, 244, 67, 54), 0.1);
  border: 1px solid var(--vscode-error);
  border-radius: 4px;
  color: var(--vscode-error);
  font-size: 13px;
  margin-bottom: 16px;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--vscode-editorGutter-addedBackground);
  opacity: 0.1;
  border: 1px solid var(--vscode-editorGutter-addedBackground);
  border-radius: 4px;
  color: var(--vscode-editorGutter-addedBackground);
  font-size: 13px;
  margin-bottom: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--vscode-border);
}

.btn-primary,
.btn-secondary,
.btn-test {
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  font-weight: 500;
}

.btn-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-button-background);
}

.btn-primary:hover:not(:disabled) {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--vscode-fg);
  border-color: var(--vscode-border);
}

.btn-secondary:hover {
  background: var(--vscode-bg-lighter);
}

.btn-test {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-button-background);
}

.btn-test:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-test:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图标 */
.bi-x::before { content: "✕"; font-size: 18px; }
.bi-exclamation-circle::before { content: "⚠"; font-size: 16px; }
.bi-check-circle::before { content: "✓"; font-size: 16px; }
</style>
