<template>
  <div class="model-selector">
    <!-- 当前选中的模型显示 -->
    <div class="current-model" @click="toggleDropdown">
      <div class="model-info">
        <i :class="selectedProvider?.icon || 'bi bi-robot'"></i>
        <div class="model-text">
          <span class="model-name">{{ selectedModel?.name || '选择模型' }}</span>
          <span class="model-provider">{{ selectedProvider?.name || '未配置' }}</span>
        </div>
      </div>
      <i :class="['bi', isOpen ? 'bi-chevron-up' : 'bi-chevron-down', 'chevron']"></i>
    </div>

    <!-- 下拉选择框 -->
    <div v-if="isOpen" class="dropdown-overlay" @click="closeDropdown"></div>
    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <!-- 搜索框 -->
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="搜索模型..."
            @click.stop
          />
        </div>

        <!-- 模型列表 -->
        <div class="models-scroll">
          <div v-if="filteredProviders.length === 0" class="empty-state">
            <i class="bi bi-inbox"></i>
            <p>{{ searchQuery ? '未找到匹配的模型' : '请先在设置中配置 AI 服务商' }}</p>
          </div>

          <div 
            v-for="provider in filteredProviders" 
            :key="provider.id"
            class="provider-group"
          >
            <!-- 服务商头部 -->
            <div class="provider-header">
              <i :class="provider.icon"></i>
              <span class="provider-name">{{ provider.name }}</span>
              <span class="model-count">({{ provider.models.length }})</span>
            </div>

            <!-- 模型列表 -->
            <div class="model-list">
              <div 
                v-for="model in provider.models"
                :key="model.id"
                class="model-item"
                :class="{ selected: isModelSelected(provider.id, model.id) }"
                @click="selectModel(provider, model)"
              >
                <div class="model-item-content">
                  <div class="model-item-header">
                    <span class="model-item-name">{{ model.name }}</span>
                    <span v-if="model.recommended" class="recommended-badge">
                      <i class="bi bi-star-fill"></i>
                    </span>
                  </div>
                  <p v-if="model.description" class="model-item-description">
                    {{ model.description }}
                  </p>
                  <div class="model-item-meta">
                    <span class="meta-item">
                      <i class="bi bi-window-stack"></i>
                      {{ formatContextWindow(model.contextWindow) }}
                    </span>
                    <span v-if="model.price" class="meta-item">
                      <i class="bi bi-currency-dollar"></i>
                      ${{ model.price.input }}/{{ model.price.output }}
                    </span>
                  </div>
                </div>
                <i v-if="isModelSelected(provider.id, model.id)" class="bi bi-check-circle-fill check-icon"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="dropdown-footer">
          <button class="btn-settings" @click="openSettings">
            <i class="bi bi-gear"></i>
            配置服务商
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { DEFAULT_PROVIDERS, type AIProvider, type AIModel } from '../../types/ai-providers'
import { decryptApiKey } from '../../utils/encryption'
import { useRouter } from 'vue-router'

interface SelectedModel {
  providerId: string
  modelId: string
}

// Props & Emits
const props = defineProps<{
  modelValue?: SelectedModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SelectedModel]
  'change': [provider: AIProvider, model: AIModel]
}>()

// Router
const router = useRouter()

// State
const isOpen = ref(false)
const searchQuery = ref('')
const aiProviders = ref<AIProvider[]>([])

// Computed
const selectedProvider = computed(() => {
  if (!props.modelValue) return null
  return aiProviders.value.find(p => p.id === props.modelValue?.providerId)
})

const selectedModel = computed(() => {
  if (!selectedProvider.value || !props.modelValue) return null
  return selectedProvider.value.models.find(m => m.id === props.modelValue?.modelId)
})

const enabledProviders = computed(() => {
  return aiProviders.value.filter(p => p.enabled && p.apiKey)
})

const filteredProviders = computed(() => {
  if (!searchQuery.value.trim()) {
    return enabledProviders.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return enabledProviders.value
    .map(provider => ({
      ...provider,
      models: provider.models.filter(model => 
        model.name.toLowerCase().includes(query) ||
        model.description?.toLowerCase().includes(query)
      )
    }))
    .filter(provider => provider.models.length > 0)
})

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const isModelSelected = (providerId: string, modelId: string) => {
  return props.modelValue?.providerId === providerId && props.modelValue?.modelId === modelId
}

const selectModel = (provider: AIProvider, model: AIModel) => {
  const selection: SelectedModel = {
    providerId: provider.id,
    modelId: model.id
  }
  
  emit('update:modelValue', selection)
  emit('change', provider, model)
  closeDropdown()
}

const formatContextWindow = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M`
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K`
  }
  return `${tokens}`
}

const openSettings = () => {
  closeDropdown()
  router.push('/settings')
}

const loadProviders = () => {
  // 从默认配置初始化
  aiProviders.value = DEFAULT_PROVIDERS.map(provider => ({
    ...provider,
    apiKey: '',
    enabled: false,
    isDefault: false
  }))
  
  // 从 localStorage 加载已保存的配置
  try {
    const saved = localStorage.getItem('aiProviderConfigs')
    if (saved) {
      const savedConfigs = JSON.parse(saved)
      aiProviders.value = aiProviders.value.map(provider => {
        const savedConfig = savedConfigs.find((c: AIProvider) => c.id === provider.id)
        if (savedConfig) {
          return {
            ...provider,
            ...savedConfig,
            apiKey: savedConfig.apiKey ? decryptApiKey(savedConfig.apiKey) : ''
          }
        }
        return provider
      })
    }
  } catch (error) {
    console.error('Failed to load AI provider configs:', error)
  }
}

// 监听 storage 事件，当其他标签页修改配置时同步
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'aiProviderConfigs') {
    loadProviders()
  }
}

// Lifecycle
onMounted(() => {
  loadProviders()
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})

// 点击外部关闭下拉框
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (isOpen.value && !target.closest('.model-selector')) {
    closeDropdown()
  }
}

watch(isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.model-selector {
  position: relative;
  width: 100%;
  max-width: 350px;
}

.current-model {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.current-model:hover {
  border-color: var(--vscode-accent);
  background: var(--vscode-bg-lighter);
}

.model-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.model-info > i {
  font-size: 20px;
  color: var(--vscode-accent);
  flex-shrink: 0;
}

.model-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.model-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.model-provider {
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.chevron {
  font-size: 14px;
  color: var(--vscode-fg-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}

/* 下拉菜单 */
.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 500px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-border);
  background: var(--vscode-bg);
}

.search-box i {
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

.search-box input {
  flex: 1;
  padding: 6px 8px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 13px;
  outline: none;
}

.search-box input:focus {
  border-color: var(--vscode-accent);
}

/* 模型滚动区域 */
.models-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.models-scroll::-webkit-scrollbar {
  width: 8px;
}

.models-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.models-scroll::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 4px;
}

.models-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-fg-muted);
}

/* 服务商组 */
.provider-group {
  margin-bottom: 16px;
}

.provider-group:last-child {
  margin-bottom: 0;
}

.provider-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.provider-header i {
  font-size: 16px;
  color: var(--vscode-accent);
}

.model-count {
  margin-left: auto;
  color: var(--vscode-fg-muted);
  font-weight: 400;
}

/* 模型列表 */
.model-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.model-item:hover {
  background: var(--vscode-bg);
}

.model-item.selected {
  background: rgba(var(--vscode-accent-rgb), 0.15);
  border: 1px solid var(--vscode-accent);
}

.model-item-content {
  flex: 1;
  min-width: 0;
}

.model-item-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.model-item-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.recommended-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  border-radius: 10px;
  font-size: 10px;
  color: white;
}

.recommended-badge i {
  font-size: 8px;
}

.model-item-description {
  margin: 0 0 4px 0;
  font-size: 11px;
  color: var(--vscode-fg-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.model-item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--vscode-fg-muted);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.check-icon {
  font-size: 18px;
  color: var(--vscode-accent);
  flex-shrink: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: var(--vscode-fg-muted);
}

.empty-state i {
  font-size: 36px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

/* 底部操作 */
.dropdown-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--vscode-border);
  background: var(--vscode-bg);
}

.btn-settings {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-settings:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
  color: var(--vscode-accent);
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

