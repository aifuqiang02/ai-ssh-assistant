<template>
  <span 
    class="ai-provider-icon"
    :title="title"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <!-- 使用 img 标签加载 SVG -->
    <img 
      v-if="iconUrl && !imageLoadError"
      :src="iconUrl" 
      :alt="providerId"
      :style="{ width: size + 'px', height: size + 'px' }"
      class="ai-provider-icon-img"
      @error="onImageError"
      @load="onImageLoad"
    />
    <!-- 备用图标 -->
    <i v-else :class="fallbackIcon" :style="{ fontSize: size + 'px' }"></i>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  providerId: string
  title?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  title: ''
})

// 图片加载错误状态
const imageLoadError = ref(false)

const onImageError = () => {
  console.warn(`[ProviderIcon] 无法加载图标: ${props.providerId}`)
  imageLoadError.value = true
}

const onImageLoad = () => {
  console.log(`[ProviderIcon] 成功加载图标: ${props.providerId}`)
  imageLoadError.value = false
}

// SVG 图标映射（使用 Simple Icons CDN）
// Simple Icons 提供 2800+ 品牌的官方彩色 logo，与 @lobehub/icons 效果完全一致
const iconMap: Record<string, { name: string, fallback: string }> = {
  // ===== OpenAI 系列 =====
  openai: { name: 'openai', fallback: 'bi bi-robot' },
  
  // ===== Anthropic =====
  anthropic: { name: 'anthropic', fallback: 'bi bi-brain' },
  claude: { name: 'anthropic', fallback: 'bi bi-brain' },
  
  // ===== Google =====
  google: { name: 'google', fallback: 'bi bi-search' },
  gemini: { name: 'google', fallback: 'bi bi-search' },
  palm: { name: 'google', fallback: 'bi bi-search' },
  vertex: { name: 'googlecloud', fallback: 'bi bi-cloud' },
  
  // ===== Meta =====
  meta: { name: 'meta', fallback: 'bi bi-facebook' },
  llama: { name: 'meta', fallback: 'bi bi-facebook' },
  
  // ===== Mistral AI =====
  mistral: { name: 'mistral', fallback: 'bi bi-wind' },
  
  // ===== Microsoft =====
  azure: { name: 'microsoftazure', fallback: 'bi bi-cloud' },
  microsoft: { name: 'microsoft', fallback: 'bi bi-windows' },
  
  // ===== Amazon =====
  bedrock: { name: 'amazon', fallback: 'bi bi-cloud' },
  aws: { name: 'amazonwebservices', fallback: 'bi bi-cloud' },
  
  // ===== Cohere =====
  cohere: { name: 'cohere', fallback: 'bi bi-graph-up' },
  
  // ===== DeepSeek =====
  deepseek: { name: 'deepseek', fallback: 'bi bi-search-heart' },
  
  // ===== 阿里巴巴 =====
  qwen: { name: 'alibabadotcom', fallback: 'bi bi-cloud' },
  alibaba: { name: 'alibabadotcom', fallback: 'bi bi-cloud' },
  tongyi: { name: 'alibabadotcom', fallback: 'bi bi-cloud' },
  
  // ===== 零一万物 =====
  yi: { name: '01ai', fallback: 'bi bi-lightning' },
  
  // ===== 聚合平台 =====
  openrouter: { name: 'openrouter', fallback: 'bi bi-diagram-3' },
  together: { name: 'togetherdotai', fallback: 'bi bi-layers' },
  
  // ===== Hugging Face =====
  huggingface: { name: 'huggingface', fallback: 'bi bi-emoji-smile' },
  
  // ===== Groq =====
  groq: { name: 'groq', fallback: 'bi bi-lightning' },
  
  // ===== Perplexity =====
  perplexity: { name: 'perplexity', fallback: 'bi bi-search' },
  
  // ===== 其他中国厂商 =====
  baichuan: { name: 'baichuan', fallback: 'bi bi-cpu' },
  minimax: { name: 'minimax', fallback: 'bi bi-cpu' },
  moonshot: { name: 'moonshot', fallback: 'bi bi-moon-stars' },
  zhipu: { name: 'zhipu', fallback: 'bi bi-star' },
  
  // ===== 其他国际厂商 =====
  stability: { name: 'stabilityai', fallback: 'bi bi-image' },
  replicate: { name: 'replicate', fallback: 'bi bi-arrow-repeat' },
  fireworks: { name: 'fireworks', fallback: 'bi bi-fire' },
}

const iconUrl = computed(() => {
  const providerId = props.providerId.toLowerCase()
  
  // 尝试从映射表中找到图标
  const iconInfo = iconMap[providerId]
  if (iconInfo?.name) {
    // 使用 Simple Icons CDN
    const url = `https://cdn.simpleicons.org/${iconInfo.name}`
    console.log(`[ProviderIcon] 图标 URL: ${providerId} -> ${url}`)
    return url
  }
  
  console.warn(`[ProviderIcon] 未找到图标映射: ${providerId}`)
  return null
})

const fallbackIcon = computed(() => {
  const providerId = props.providerId.toLowerCase()
  return iconMap[providerId]?.fallback || 'bi bi-cpu'
})
</script>

<style scoped>
.ai-provider-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-provider-icon-img {
  display: block;
  object-fit: contain;
}

/* 暗色模式下图标会自动适配（Simple Icons 的 SVG 默认适配良好） */
</style>

