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
    <div v-if="isOpen" class="dropdown-overlay" @click.self="closeDropdown"></div>
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
                @click.stop="selectModel(provider, model)"
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
  // 先过滤出启用的 provider，并过滤每个 provider 中启用的模型
  const providersWithEnabledModels = enabledProviders.value.map(provider => ({
    ...provider,
    models: provider.models.filter(model => model.enabled !== false)  // 只显示已启用的模型
  })).filter(provider => provider.models.length > 0)  // 移除没有启用模型的 provider
  
  if (!searchQuery.value.trim()) {
    return providersWithEnabledModels
  }
  
  const query = searchQuery.value.toLowerCase()
  return providersWithEnabledModels
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
  const result = props.modelValue?.providerId === providerId && props.modelValue?.modelId === modelId
  console.log(`isModelSelected(${providerId}, ${modelId}):`, result, 'current:', props.modelValue)
  return result
}

const selectModel = (provider: AIProvider, model: AIModel) => {
  console.log('=== 点击选择模型 ===')
  console.log('Provider:', provider.name, provider.id)
  console.log('Model:', model.name, model.id)
  
  const selection: SelectedModel = {
    providerId: provider.id,
    modelId: model.id
  }
  
  console.log('创建选择对象:', JSON.stringify(selection))
  console.log('当前 modelValue:', JSON.stringify(props.modelValue))
  
  emit('update:modelValue', selection)
  emit('change', provider, model)
  
  // 保存到 localStorage 并通知其他组件
  localStorage.setItem('selectedAIModel', JSON.stringify(selection))
  window.dispatchEvent(new CustomEvent('ai-model-changed', {
    detail: selection
  }))
  
  console.log('已触发 emit 和模型切换事件')
  
  // 延迟关闭下拉菜单，确保选择操作完成
  setTimeout(() => {
    closeDropdown()
  }, 100)
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

const loadProviders = async () => {
  console.log('[ModelSelector] 🔄 开始加载 AI Providers...')
  
  // 从默认配置初始化
  aiProviders.value = DEFAULT_PROVIDERS.map(provider => ({
    ...provider,
    apiKey: '',
    enabled: false,
    isDefault: false,
    // 为每个模型设置默认启用状态（默认禁用）
    models: provider.models.map(model => ({
      ...model,
      enabled: model.enabled === true  // 只有明确为 true 才启用
    }))
  }))
  
  // 从数据库加载已保存的配置
  try {
    const settings = await window.electronAPI.settings.get()
    if (settings?.aiProviders && settings.aiProviders.length > 0) {
      console.log(`[ModelSelector] 📦 从数据库加载到 ${settings.aiProviders.length} 个服务商`)
      
      const savedConfigs = settings.aiProviders
      aiProviders.value = aiProviders.value.map(provider => {
        const savedConfig = savedConfigs.find((c: any) => c.id === provider.id)
        if (savedConfig) {
          // 优先使用数据库中保存的完整模型列表
          const models = savedConfig.models && savedConfig.models.length > 0
            ? savedConfig.models.map((savedModel: any) => ({
                ...savedModel,
                // 只有明确为 true 才启用，否则禁用
                enabled: savedModel.enabled === true
              }))
            : provider.models.map(model => ({
                ...model,
                // 如果数据库中没有模型，使用默认配置（保持原有 enabled 状态）
                enabled: model.enabled === true
              }))
          
          const enabledModelsCount = models.filter((m: any) => m.enabled !== false).length
          console.log(`[ModelSelector]   - ${provider.id}: ${models.length} 个模型, ${enabledModelsCount} 个已启用`)
          
          return {
            ...provider,
            models,
            // 覆盖配置字段
            apiKey: savedConfig.apiKey || '',
            endpoint: savedConfig.endpoint || provider.endpoint,
            enabled: savedConfig.enabled || false,
            isDefault: savedConfig.isDefault || false,
            config: savedConfig.config || provider.config
          }
        }
        return provider
      })
      console.log('[ModelSelector] ✅ AI Providers 加载完成')
    } else {
      console.log('[ModelSelector] ⚠️ 数据库中无 AI Providers 配置')
    }
  } catch (error) {
    console.error('[ModelSelector] ❌ 加载 AI Providers 失败:', error)
  }
}

// 监听设置更新事件
const handleSettingsUpdate = () => {
  console.log('[ModelSelector] 📢 检测到设置更新事件，重新加载配置')
  loadProviders()
}

// Lifecycle
onMounted(() => {
  loadProviders()
  // 监听来自设置页面的配置更新事件
  window.addEventListener('ai-provider-configs-updated', handleSettingsUpdate)
  window.addEventListener('settings-updated', handleSettingsUpdate)
})

onUnmounted(() => {
  window.removeEventListener('ai-provider-configs-updated', handleSettingsUpdate)
  window.removeEventListener('settings-updated', handleSettingsUpdate)
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
    // 延迟添加监听器，避免打开下拉菜单的点击事件立即触发关闭
    setTimeout(() => {
      if (isOpen.value) {
        document.addEventListener('click', handleClickOutside)
      }
    }, 0)
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

