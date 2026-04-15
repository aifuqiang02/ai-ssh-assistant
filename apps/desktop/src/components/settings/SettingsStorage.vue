<template>
  <section :id="'section-storage'" class="setting-section">
    <h2 class="section-title">
      <i class="bi bi-database"></i>
      {{ $t('settings.storageTitle') }}
    </h2>
    <p class="section-description">{{ $t('settings.storageDesc') }}</p>

    <!-- 缓存大小 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.cacheSize') }}</label>
        <p class="setting-hint">{{ $t('settings.cacheSizeHint') }}</p>
      </div>
      <div class="setting-right">
        <span class="badge">{{ cacheSize }} MB</span>
      </div>
    </div>

    <!-- 清空缓存按钮 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.clearCache') }}</label>
        <p class="setting-hint">{{ $t('settings.clearCacheHint') }}</p>
      </div>
      <div class="setting-right">
        <button @click="clearCache" class="btn btn-danger">
          {{ $t('settings.clearCache') }}
        </button>
      </div>
    </div>

    <!-- 数据同步间隔 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.syncInterval') }}</label>
        <p class="setting-hint">{{ $t('settings.syncIntervalHint') }}</p>
      </div>
      <div class="setting-right">
        <input v-model.number="syncInterval" type="number" class="form-input" min="1" max="60" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { $confirm } from '@/composables/useDialog'

const { t } = useI18n()

const cacheSize = ref<number>(0)
const syncInterval = ref<number>(5)

const clearCache = async () => {
  if (await $confirm(t('settings.clearCacheConfirm'))) {
    // 清空缓存逻辑
    cacheSize.value = 0
    localStorage.clear()
  }
}
</script>

<style scoped>
/* 样式从父组件继承 */
</style>
