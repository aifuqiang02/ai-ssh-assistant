<template>
  <div class="theme-switcher">
    <button 
      class="theme-toggle-btn"
      :title="`当前主题: ${currentThemeLabel}`"
      @click="toggleTheme"
    >
      <i :class="themeIcon"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { themeService, type ThemeMode } from '@/services/theme.service'

const currentTheme = ref<ThemeMode>(themeService.getCurrentTheme())

const themeIcon = computed(() => {
  if (currentTheme.value.includes('dark')) {
    return 'bi bi-moon-stars-fill'
  }
  return 'bi bi-sun-fill'
})

const currentThemeLabel = computed(() => {
  const themes = themeService.getAvailableThemes()
  const theme = themes.find(t => t.value === currentTheme.value)
  return theme?.label || currentTheme.value
})

const toggleTheme = () => {
  themeService.toggleTheme()
  currentTheme.value = themeService.getCurrentTheme()
}

const handleThemeChange = (event: Event) => {
  const customEvent = event as CustomEvent
  currentTheme.value = customEvent.detail.theme
}

onMounted(() => {
  window.addEventListener('theme-changed', handleThemeChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('theme-changed', handleThemeChange)
})
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: var(--vscode-button-secondaryBackground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  color: var(--vscode-button-secondaryForeground);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.theme-toggle-btn:hover {
  background: var(--vscode-button-secondaryHoverBackground);
  border-color: var(--vscode-focusBorder);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.theme-toggle-btn i {
  transition: transform 0.3s ease;
}

.theme-toggle-btn:hover i {
  transform: rotate(20deg);
}
</style>

