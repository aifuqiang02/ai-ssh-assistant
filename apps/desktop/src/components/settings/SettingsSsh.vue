<template>
  <section :id="'section-ssh'" class="setting-section">
    <h2 class="section-title">
      <i class="bi bi-terminal"></i>
      {{ $t('settings.sshTitle') }}
    </h2>
    <p class="section-description">{{ $t('settings.sshDesc') }}</p>

    <!-- 默认超时时间 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.connectionTimeout') }}</label>
        <p class="setting-hint">{{ $t('settings.connectionTimeoutHint') }}</p>
      </div>
      <div class="setting-right">
        <input 
          v-model.number="sshTimeout" 
          type="number" 
          class="form-input"
          min="10"
          max="300"
        />
      </div>
    </div>

    <!-- 保持连接 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.keepAliveInterval') }}</label>
        <p class="setting-hint">{{ $t('settings.keepAliveIntervalHint') }}</p>
      </div>
      <div class="setting-right">
        <label class="toggle-switch">
          <input v-model="keepAlive" type="checkbox" />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- 默认端口 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.defaultPort') }}</label>
        <p class="setting-hint">{{ $t('settings.defaultPortHint') }}</p>
      </div>
      <div class="setting-right">
        <input 
          v-model.number="defaultSSHPort" 
          type="number" 
          class="form-input"
          min="1"
          max="65535"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// SSH 配置
const sshTimeout = ref<number>(30)
const keepAlive = ref<boolean>(true)
const defaultSSHPort = ref<number>(22)
</script>

<style scoped>
/* 样式从父组件继承 */
</style>
