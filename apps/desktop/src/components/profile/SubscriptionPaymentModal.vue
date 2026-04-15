<template>
  <div v-if="show" class="payment-modal-overlay" @click.self="emit('close')">
    <div class="payment-modal">
      <button type="button" class="close-button" @click="emit('close')" aria-label="关闭">
        <i class="bi bi-x-lg"></i>
      </button>

      <div class="payment-header">
        <div class="header-icon">
          <i class="bi bi-qr-code"></i>
        </div>
        <h2>微信支付</h2>
        <p>请使用微信扫一扫完成支付</p>
      </div>

      <div class="payment-qr-section">
        <div class="qr-wrapper">
          <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="支付二维码" class="qr-image" />
          <div v-else class="qr-placeholder">
            {{ loading ? '二维码加载中...' : '点击重新生成二维码' }}
          </div>
          <div class="qr-overlay-icon">
            <i class="bi bi-wechat"></i>
          </div>
        </div>

        <div class="payment-badge">
          <i class="bi bi-shield-check"></i>
          微信支付 安全保障
        </div>
      </div>

      <div class="payment-details">
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-label">套餐名称</span>
            <span class="detail-value">{{ title }}</span>
          </div>
          <div class="detail-item text-right">
            <span class="detail-label">价格</span>
            <span class="detail-value price">{{ price }}</span>
          </div>
        </div>
      </div>

      <div v-if="statusText && statusText !== '待支付'" class="payment-status">
        {{ statusText }}
      </div>

      <div class="payment-security">
        <i class="bi bi-lock-fill"></i>
        加密安全交易
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  description: string
  price: string
  statusText: string
  qrCodeDataUrl: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.payment-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}

.payment-modal {
  width: min(420px, 92vw);
  background: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Segoe UI', sans-serif;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  color: var(--vscode-fg-muted);
  padding: 6px;
  border-radius: 6px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: var(--vscode-fg);
  background: var(--vscode-bg);
}

.payment-header {
  padding: 28px 24px 20px;
  text-align: center;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #f0fdf4;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.header-icon .bi {
  color: #16a34a;
  font-size: 28px;
}

.payment-header h2 {
  font-size: 22px;
  font-weight: 800;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.payment-header p {
  font-size: 13px;
  color: var(--vscode-fg-muted);
}

.payment-qr-section {
  padding: 0 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-wrapper {
  position: relative;
  padding: 12px;
  background: var(--vscode-bg);
  border: 2px solid var(--vscode-border);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.qr-image,
.qr-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 8px;
}

.qr-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vscode-bg);
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.qr-overlay-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
  pointer-events: none;
}

.qr-overlay-icon .bi {
  font-size: 64px;
}

.payment-badge {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f0fdf4;
  color: #15803d;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.payment-badge .bi {
  font-size: 16px;
}

.payment-details {
  margin: 0 24px;
  padding: 16px;
  background: var(--vscode-bg);
  border-radius: 12px;
  border: 1px solid var(--vscode-border);
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap-y: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.text-right {
  text-align: right;
}

.detail-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--vscode-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.detail-value.price {
  color: var(--vscode-accent);
}

.payment-status {
  margin: 16px 24px 0;
  padding: 10px;
  text-align: center;
  font-size: 13px;
  color: var(--vscode-accent);
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
}

.payment-security {
  padding: 16px 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;
  color: var(--vscode-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.payment-security .bi {
  font-size: 12px;
}
</style>
