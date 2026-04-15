// 国际主流 AI 服务商

import type { ProviderConfig } from './ai-providers.types'

export const INTERNATIONAL_PROVIDERS: ProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: '全球领先的 AI 模型提供商',
    icon: 'bi bi-robot',
    website: 'https://platform.openai.com',
    endpoint: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '最新的 GPT-4 模型，性能更强', providerId: 'openai', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: true }, price: { input: 10, output: 30 }, recommended: true },
      { id: 'gpt-4', name: 'GPT-4', providerId: 'openai', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 30, output: 60 } },
      { id: 'gpt-4-vision-preview', name: 'GPT-4 Vision', providerId: 'openai', contextWindow: 128000, capabilities: { text: true, image: true, functionCall: true, vision: true }, price: { input: 10, output: 30 } },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', providerId: 'openai', contextWindow: 16385, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 0.5, output: 1.5 }, recommended: true }
    ]
  },
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    description: 'Microsoft Azure 提供的 OpenAI 服务',
    icon: 'bi bi-microsoft',
    website: 'https://azure.microsoft.com',
    endpoint: 'https://YOUR_RESOURCE.openai.azure.com',
    models: [
      { id: 'gpt-4', name: 'GPT-4', providerId: 'azure-openai', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'gpt-35-turbo', name: 'GPT-3.5 Turbo', providerId: 'azure-openai', contextWindow: 16385, capabilities: { text: true, image: false, functionCall: true, vision: false } }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude 系列模型',
    icon: 'bi bi-chat-quote',
    website: 'https://console.anthropic.com',
    endpoint: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Claude 3 最强大模型', providerId: 'anthropic', contextWindow: 200000, capabilities: { text: true, image: true, functionCall: true, vision: true }, price: { input: 15, output: 75 }, recommended: true },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: '性能与速度平衡', providerId: 'anthropic', contextWindow: 200000, capabilities: { text: true, image: true, functionCall: true, vision: true }, price: { input: 3, output: 15 }, recommended: true },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: '最快速经济', providerId: 'anthropic', contextWindow: 200000, capabilities: { text: true, image: true, functionCall: true, vision: true }, price: { input: 0.25, output: 1.25 } }
    ]
  },
  {
    id: 'google',
    name: 'Google Gemini',
    description: 'Google 多模态 AI 模型',
    icon: 'bi bi-google',
    website: 'https://makersuite.google.com',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      { id: 'models/gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: '超长上下文窗口', providerId: 'google', contextWindow: 1000000, capabilities: { text: true, image: true, functionCall: true, vision: true }, price: { input: 3.5, output: 10.5 }, recommended: true },
      { id: 'models/gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: '快速且经济', providerId: 'google', contextWindow: 1000000, capabilities: { text: true, image: true, functionCall: true, vision: true }, price: { input: 0.35, output: 1.05 }, recommended: true },
      { id: 'models/gemini-pro', name: 'Gemini 1.0 Pro', providerId: 'google', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 0.5, output: 1.5 } }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: '欧洲领先的开源 AI 公司',
    icon: 'bi bi-wind',
    website: 'https://console.mistral.ai',
    endpoint: 'https://api.mistral.ai/v1',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', description: '最强大的 Mistral 模型', providerId: 'mistral', contextWindow: 32000, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 8, output: 24 }, recommended: true },
      { id: 'mistral-medium-latest', name: 'Mistral Medium', providerId: 'mistral', contextWindow: 32000, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 2.7, output: 8.1 } },
      { id: 'mistral-small-latest', name: 'Mistral Small', providerId: 'mistral', contextWindow: 32000, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 1, output: 3 } }
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    description: '超高速 AI 推理服务',
    icon: 'bi bi-lightning-charge',
    website: 'https://console.groq.com',
    endpoint: 'https://api.groq.com/openai/v1',
    models: [
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', description: 'Meta 最新开源模型', providerId: 'groq', contextWindow: 131072, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 0.59, output: 0.79 }, recommended: true },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', providerId: 'groq', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 0.24, output: 0.24 } },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', providerId: 'groq', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, price: { input: 0.2, output: 0.2 } }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: '专注于搜索增强的 AI 模型',
    icon: 'bi bi-search',
    website: 'https://www.perplexity.ai',
    endpoint: 'https://api.perplexity.ai',
    models: [
      { id: 'llama-3.1-sonar-large-128k-online', name: 'Sonar Large Online', description: '支持联网搜索', providerId: 'perplexity', contextWindow: 127072, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'llama-3.1-sonar-small-128k-online', name: 'Sonar Small Online', providerId: 'perplexity', contextWindow: 127072, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'cohere',
    name: 'Cohere',
    description: '企业级 AI 平台',
    icon: 'bi bi-diagram-3',
    website: 'https://cohere.com',
    endpoint: 'https://api.cohere.ai/v1',
    models: [
      { id: 'command-r-plus', name: 'Command R+', description: '最强大的 Command 模型', providerId: 'cohere', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'command-r', name: 'Command R', providerId: 'cohere', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false } }
    ]
  },
  {
    id: 'xai',
    name: 'xAI (Grok)',
    description: 'Elon Musk 的 AI 公司',
    icon: 'bi bi-x-diamond',
    website: 'https://x.ai',
    endpoint: 'https://api.x.ai/v1',
    models: [
      { id: 'grok-beta', name: 'Grok Beta', description: '幽默风趣的 AI 模型', providerId: 'xai', contextWindow: 131072, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  }
]

