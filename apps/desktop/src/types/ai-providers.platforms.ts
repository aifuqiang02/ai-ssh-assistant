// 开发者平台和本地模型

import type { ProviderConfig } from './ai-providers.types'

export const PLATFORM_PROVIDERS: ProviderConfig[] = [
  {
    id: 'together',
    name: 'Together AI',
    description: '开源模型托管平台',
    icon: 'bi bi-people',
    website: 'https://api.together.xyz',
    endpoint: 'https://api.together.xyz/v1',
    models: [
      { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B Chat', providerId: 'together', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', name: 'Mixtral 8x22B', providerId: 'together', contextWindow: 65536, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    description: '快速的开源模型服务',
    icon: 'bi bi-rocket-takeoff',
    website: 'https://fireworks.ai',
    endpoint: 'https://api.fireworks.ai/inference/v1',
    models: [
      { id: 'accounts/fireworks/models/llama-v3p1-70b-instruct', name: 'Llama 3.1 70B', providerId: 'fireworks', contextWindow: 131072, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'accounts/fireworks/models/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', providerId: 'fireworks', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'AI 模型路由平台，统一访问多个模型',
    icon: 'bi bi-router',
    website: 'https://openrouter.ai',
    endpoint: 'https://openrouter.ai/api/v1',
    models: [
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo (via OpenRouter)', providerId: 'openrouter', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (via OpenRouter)', providerId: 'openrouter', contextWindow: 200000, capabilities: { text: true, image: true, functionCall: true, vision: true } },
      { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B (via OpenRouter)', providerId: 'openrouter', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'siliconcloud',
    name: 'SiliconCloud',
    description: '硅基流动，高性价比 AI 云服务',
    icon: 'bi bi-cloud-arrow-up',
    website: 'https://siliconflow.cn',
    endpoint: 'https://api.siliconflow.cn/v1',
    models: [
      { id: 'Qwen/Qwen2-72B-Instruct', name: 'Qwen2 72B', providerId: 'siliconcloud', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'deepseek-ai/DeepSeek-V2-Chat', name: 'DeepSeek V2', providerId: 'siliconcloud', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'huggingface',
    name: 'HuggingFace',
    description: '开源 AI 模型社区',
    icon: 'bi bi-emoji-smile',
    website: 'https://huggingface.co',
    endpoint: 'https://api-inference.huggingface.co/models',
    models: [
      { id: 'meta-llama/Meta-Llama-3-70B-Instruct', name: 'Llama 3 70B', providerId: 'huggingface', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', providerId: 'huggingface', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: '运行开源模型的云平台',
    icon: 'bi bi-layers',
    website: 'https://replicate.com',
    endpoint: 'https://api.replicate.com/v1',
    models: [
      { id: 'meta/llama-2-70b-chat', name: 'Llama 2 70B Chat', providerId: 'replicate', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: '本地运行大语言模型',
    icon: 'bi bi-hdd',
    website: 'https://ollama.ai',
    endpoint: 'http://localhost:11434',
    models: [
      { id: 'llama3.1:70b', name: 'Llama 3.1 70B', description: 'Meta 最新开源模型', providerId: 'ollama', contextWindow: 131072, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'llama3.1:8b', name: 'Llama 3.1 8B', providerId: 'ollama', contextWindow: 131072, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'qwen2:72b', name: 'Qwen2 72B', providerId: 'ollama', contextWindow: 131072, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'gemma2:27b', name: 'Gemma 2 27B', providerId: 'ollama', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'mistral:7b', name: 'Mistral 7B', providerId: 'ollama', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'codellama:70b', name: 'Code Llama 70B', description: '专业代码生成模型', providerId: 'ollama', contextWindow: 100000, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  }
]

