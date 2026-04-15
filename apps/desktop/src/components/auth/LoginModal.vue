<template>
  <div
    v-if="props.show"
    class="login-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="login-modal bg-vscode-bg-light border border-vscode-border rounded-lg shadow-lg w-[420px] p-6"
    >
      <div class="modal-header mb-6">
        <h2 class="text-xl font-semibold text-vscode-fg">微信扫码登录</h2>
      </div>

      <div class="space-y-4">
        <div class="qr-container">
          <button type="button" class="qr-button" @click="refreshQrCode" :disabled="isLoading">
            <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="微信登录二维码" class="qr-image" />
            <div v-else class="qr-placeholder">
              <span>{{ isLoading ? '二维码加载中...' : '点击刷新二维码' }}</span>
            </div>
          </button>
        </div>

        <div class="text-center text-sm text-vscode-fg-muted">
          <p>{{ statusText }}</p>
          <p v-if="session?.expiresAt">过期时间：{{ formatExpireTime(session.expiresAt) }}</p>
        </div>

        <div class="form-group flex items-center">
          <input
            id="agreeTerms"
            v-model="agreeTerms"
            type="checkbox"
            class="w-4 h-4 text-vscode-accent bg-vscode-bg border-vscode-border rounded"
          />
          <label for="agreeTerms" class="ml-2 text-sm text-vscode-fg-muted">
            我已阅读
            <button type="button" class="agreement-link" @click.stop="openAgreementLink('terms')">
              用户协议
            </button>
            、
            <button type="button" class="agreement-link" @click.stop="openAgreementLink('privacy')">
              隐私协议
            </button>
          </label>
        </div>

        <div v-if="errorMessage" class="error-message text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <div class="modal-actions flex space-x-3 pt-4">
          <button type="button" @click="closeModal" class="flex-1 vscode-button">取消</button>
          <button
            type="button"
            @click="refreshQrCode"
            :disabled="isLoading"
            class="flex-1 vscode-button primary"
          >
            <span v-if="isLoading">刷新中...</span>
            <span v-else>刷新二维码</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { getRendererLegalBaseUrl } from '@/config/api-environment'
import {
  createWechatLoginSession,
  exchangeWechatProfileForLogin,
  startWechatLoginPolling,
  type LoggedInWechatUser,
  type WechatLoginSession
} from '../../services/wechat-login.service'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'login-success', user: LoggedInWechatUser): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rememberMe = ref(true)
const agreeTerms = ref(true)
const errorMessage = ref('')
const isLoading = ref(false)
const qrCodeUrl = ref('')
const session = ref<WechatLoginSession | null>(null)
let stopPolling: (() => void) | null = null
let isInitializing = false

const renderQrCode = async (content: string) => {
  qrCodeUrl.value = await QRCode.toDataURL(content, {
    width: 240,
    margin: 1,
    errorCorrectionLevel: 'M'
  })
}

const statusText = computed(() => {
  if (errorMessage.value) {
    return errorMessage.value
  }

  switch (session.value?.status) {
    case 'success':
      return '扫码成功，正在登录...'
    case 'expired':
      return '二维码已过期，请点击刷新二维码。'
    default:
      return '请使用微信公众号扫码登录。'
  }
})

watch(
  () => props.show,
  newVal => {
    console.log('[LoginModal] props.show changed', { newVal })
    if (newVal) {
      void initializeLogin()
    } else if (!newVal) {
      cleanupPolling()
    }
  },
  { immediate: true }
)

onMounted(() => {
  console.log('[LoginModal] mounted', { show: props.show })
  if (props.show) {
    void initializeLogin()
  }
})

const resetForm = () => {
  rememberMe.value = true
  agreeTerms.value = true
  errorMessage.value = ''
  isLoading.value = false
  qrCodeUrl.value = ''
  session.value = null
}

const closeModal = () => {
  console.log('[LoginModal] closeModal')
  cleanupPolling()
  emit('close')
}

const cleanupPolling = () => {
  stopPolling?.()
  stopPolling = null
  session.value = null
}

const openAgreementLink = async (type: 'terms' | 'privacy') => {
  const baseUrl = getRendererLegalBaseUrl()
  const url = `${baseUrl}/${type}`

  if (window.electronAPI?.shell?.openExternal) {
    await window.electronAPI.shell.openExternal(url)
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

const formatExpireTime = (expiresAt: string) => {
  return new Date(expiresAt).toLocaleString()
}

const handleSessionTick = async (nextSession: WechatLoginSession) => {
  console.log('[LoginModal] handleSessionTick', nextSession)
  session.value = nextSession
  if (nextSession.qrCodeUrl) {
    await renderQrCode(nextSession.qrCodeUrl)
  }

  if (nextSession.status === 'expired') {
    cleanupPolling()
    return
  }

  if (nextSession.status === 'success' && nextSession.profile) {
    cleanupPolling()
    const payload = await exchangeWechatProfileForLogin(
      nextSession.bizId,
      nextSession.profile,
      rememberMe.value
    )
    emit('login-success', payload.user as LoggedInWechatUser)
    closeModal()
  }
}

const initializeLogin = async () => {
  if (isInitializing) {
    console.log('[LoginModal] initializeLogin skipped - already initializing')
    return
  }

  if (session.value?.status === 'pending' && stopPolling) {
    console.log('[LoginModal] initializeLogin skipped - active session exists')
    return
  }

  isInitializing = true
  console.log('[LoginModal] initializeLogin')
  resetForm()
  isLoading.value = true
  try {
    await refreshQrCode()
  } finally {
    isInitializing = false
  }
}

const refreshQrCode = async () => {
  console.log('[LoginModal] refreshQrCode start', {
    agreeTerms: agreeTerms.value,
    rememberMe: rememberMe.value
  })
  if (!agreeTerms.value) {
    errorMessage.value = '请先勾选用户协议、隐私协议'
    return
  }

  cleanupPolling()
  isLoading.value = true
  errorMessage.value = ''

  try {
    const nextSession = await createWechatLoginSession()
    console.log('[LoginModal] refreshQrCode session', nextSession)
    session.value = nextSession
    if (nextSession.qrCodeUrl) {
      await renderQrCode(nextSession.qrCodeUrl)
    } else {
      qrCodeUrl.value = ''
    }
    stopPolling = startWechatLoginPolling(
      nextSession.pollUrl || '',
      current => {
        void handleSessionTick(current)
      },
      error => {
        errorMessage.value = error.message
      }
    )
  } catch (error) {
    console.error('[LoginModal] refreshQrCode error', error)
    errorMessage.value = error instanceof Error ? error.message : '二维码加载失败，请重试'
  } finally {
    console.log('[LoginModal] refreshQrCode done')
    isLoading.value = false
  }
}

onBeforeUnmount(() => {
  cleanupPolling()
})
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

.qr-container {
  display: flex;
  justify-content: center;
}

.qr-button {
  width: 240px;
  height: 240px;
  padding: 0;
  border: 1px solid var(--vscode-border);
  border-radius: 12px;
  background: var(--vscode-bg);
  cursor: pointer;
  overflow: hidden;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vscode-fg-muted);
  font-size: 13px;
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
  font-family:
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;
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
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-accent);
}

.vscode-button.primary:hover:not(:disabled) {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
}

.error-message {
  padding: 8px 12px;
  background: var(--vscode-inputValidation-errorBackground);
  border: 1px solid var(--vscode-inputValidation-errorBorder);
  border-radius: 4px;
  font-size: 13px;
}

.agreement-link {
  color: var(--vscode-accent);
  text-decoration: underline;
  cursor: pointer;
}

.agreement-link:hover {
  color: var(--vscode-accent-hover);
}
</style>
