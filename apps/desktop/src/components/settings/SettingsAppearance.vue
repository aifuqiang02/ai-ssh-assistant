<template>
  <section :id="'section-appearance'" class="setting-section">
    <h2 class="section-title">
      <i class="bi bi-palette"></i>
      {{ $t('settings.appearanceTitle') }}
    </h2>
    <p class="section-description">{{ $t('settings.appearanceDesc') }}</p>

    <!-- 主题模式 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.themeMode') }}</label>
        <p class="setting-hint">{{ $t('settings.themeModeHint') }}</p>
      </div>
      <div class="setting-right">
        <select :value="selectedThemeMode" @change="onThemeModeChange" class="form-select">
          <option 
            v-for="themeOption in availableThemes" 
            :key="themeOption.value"
            :value="themeOption.value"
          >
            {{ themeOption.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 颜色方案 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.colorScheme') }}</label>
        <p class="setting-hint">{{ $t('settings.colorSchemeHint') }}</p>
      </div>
      <div class="setting-right">
        <select 
          :value="selectedColorScheme" 
          @change="onColorSchemeChange" 
          class="form-select"
        >
          <option 
            v-for="scheme in availableColorSchemes" 
            :key="scheme.value"
            :value="scheme.value"
          >
            {{ scheme.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 字体大小 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.fontSize') }}</label>
        <p class="setting-hint">{{ $t('settings.fontSizeHint') }}</p>
      </div>
      <div class="setting-right">
        <select :value="fontSize" @change="onFontSizeChange" class="form-select">
          <option value="small">{{ $t('settings.sizeSmall') }}</option>
          <option value="medium">{{ $t('settings.sizeMedium') }}</option>
          <option value="large">{{ $t('settings.sizeLarge') }}</option>
        </select>
      </div>
    </div>

    <!-- 语言设置 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.language') }}</label>
        <p class="setting-hint">{{ $t('settings.languageHint') }}</p>
      </div>
      <div class="setting-right">
        <LanguageSwitcher />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { type ThemeMode } from '@/services/theme.service'

const { t: $t } = useI18n()

// Props - 从父级接收状态
defineProps<{
  selectedThemeMode: ThemeMode
  selectedColorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  fontSize: 'small' | 'medium' | 'large'
  availableThemes: Array<{ value: ThemeMode; label: string }>
  availableColorSchemes: Array<{ value: string; label: string }>
}>()

// Emit - 通知父级状态变化
const emit = defineEmits<{
  'theme-mode-change': [value: ThemeMode]
  'color-scheme-change': [value: 'blue' | 'green' | 'purple' | 'orange' | 'red']
  'font-size-change': [value: 'small' | 'medium' | 'large']
}>()

// 事件处理函数 - 直接调用父级的方法
const onThemeModeChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as ThemeMode
  emit('theme-mode-change', value)
}

const onColorSchemeChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as 'blue' | 'green' | 'purple' | 'orange' | 'red'
  emit('color-scheme-change', value)
}

const onFontSizeChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as 'small' | 'medium' | 'large'
  emit('font-size-change', value)
}
</script>

<style scoped>
.setting-row {
  display: flex;
  gap: 32px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vscode-border);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-left {
  flex: 1;
  min-width: 0;
}

.setting-right {
  flex-shrink: 0;
  width: 300px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.setting-hint {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin: 0;
  line-height: 1.5;
}

.form-select {
  width: 100%;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  color: var(--vscode-fg);
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.form-select:hover {
  border-color: var(--vscode-fg-muted);
}

.form-select:focus {
  border-color: var(--vscode-accent);
}
</style>
