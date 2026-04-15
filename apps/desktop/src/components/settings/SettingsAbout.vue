<template>
  <section :id="'section-about'" class="setting-section">
    <h2 class="section-title">
      <i class="bi bi-info-circle"></i>
      {{ $t('settings.aboutTitle') }}
    </h2>

    <!-- 应用信息 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.version') }}</label>
      </div>
      <div class="setting-right">
        <span class="badge">v{{ appVersion }}</span>
      </div>
    </div>

    <!-- 发布日期 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.releaseDate') }}</label>
      </div>
      <div class="setting-right">
        <span>{{ releaseDate }}</span>
      </div>
    </div>

    <!-- 作者 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.author') }}</label>
      </div>
      <div class="setting-right">
        <span>{{ $t('settings.authorName') }}</span>
      </div>
    </div>

    <!-- 许可证 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.license') }}</label>
      </div>
      <div class="setting-right">
        <span>{{ $t('settings.licenseMit') }}</span>
      </div>
    </div>

    <!-- 检查更新 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.checkUpdate') }}</label>
      </div>
      <div class="setting-right">
        <button @click="checkUpdate" class="btn btn-primary">
          {{ $t('settings.checkUpdateNow') }}
        </button>
      </div>
    </div>

    <!-- 链接 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.documentation') }}</label>
      </div>
      <div class="setting-right">
        <a href="https://github.com/aifuqiang02/ai-ssh-assistant" target="_blank" class="link">
          {{ $t('settings.githubRepository') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { $alert } from '@/composables/useDialog'

const { t } = useI18n()

const appVersion = ref<string>('1.0.9')
const releaseDate = ref<string>('2024-10-21')

const checkUpdate = async () => {
  $alert(t('settings.checkingUpdates'))
  // 检查更新逻辑
}
</script>

<style scoped>
/* 样式从父组件继承 */
</style>
