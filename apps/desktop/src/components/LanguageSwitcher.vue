<template>
  <div class="language-switcher">
    <select 
      v-model="currentLocale" 
      @change="handleChange"
      class="form-select form-select-sm"
      :title="$t('settings.language')"
    >
      <option value="zh-CN">🇨🇳 简体中文</option>
      <option value="en-US">🇺🇸 English</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, getLocale } from '../locales'
import type { Locale } from '@ai-ssh/shared'

const { locale } = useI18n()
const currentLocale = ref<Locale>(getLocale())

// 监听语言切换
function handleChange() {
  setLocale(currentLocale.value)
  
  // 显示切换成功提示

}

onMounted(() => {
  currentLocale.value = getLocale()
})
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-switcher select {
  cursor: pointer;
  min-width: 140px;
}
</style>

