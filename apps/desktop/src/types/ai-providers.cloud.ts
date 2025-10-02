// 云服务平台 AI 服务商

import type { ProviderConfig } from './ai-providers.types'

export const CLOUD_PROVIDERS: ProviderConfig[] = [
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    description: 'Amazon Web Services 托管的 AI 模型',
    icon: 'bi bi-amazon',
    website: 'https://aws.amazon.com/bedrock',
    endpoint: 'https://bedrock-runtime.{region}.amazonaws.com',
    models: [
      { id: 'anthropic.claude-3-opus-20240229-v1:0', name: 'Claude 3 Opus', providerId: 'aws-bedrock', contextWindow: 200000, capabilities: { text: true, image: true, functionCall: true, vision: true }, recommended: true },
      { id: 'anthropic.claude-3-sonnet-20240229-v1:0', name: 'Claude 3 Sonnet', providerId: 'aws-bedrock', contextWindow: 200000, capabilities: { text: true, image: true, functionCall: true, vision: true } },
      { id: 'meta.llama3-70b-instruct-v1:0', name: 'Llama 3 70B', providerId: 'aws-bedrock', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'cohere.command-r-plus-v1:0', name: 'Command R+', providerId: 'aws-bedrock', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false } }
    ]
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare AI',
    description: 'Cloudflare Workers AI',
    icon: 'bi bi-cloud',
    website: 'https://ai.cloudflare.com',
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai',
    models: [
      { id: '@cf/meta/llama-3-8b-instruct', name: 'Llama 3 8B', providerId: 'cloudflare', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: '@cf/mistral/mistral-7b-instruct-v0.1', name: 'Mistral 7B', providerId: 'cloudflare', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: '@cf/qwen/qwen1.5-7b-chat-awq', name: 'Qwen 1.5 7B', providerId: 'cloudflare', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'github-models',
    name: 'GitHub Models',
    description: 'GitHub 提供的模型市场',
    icon: 'bi bi-github',
    website: 'https://github.com/marketplace/models',
    endpoint: 'https://models.inference.ai.azure.com',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', providerId: 'github-models', contextWindow: 128000, capabilities: { text: true, image: true, functionCall: true, vision: true }, recommended: true },
      { id: 'Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B', providerId: 'github-models', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'Mistral-large', name: 'Mistral Large', providerId: 'github-models', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false } }
    ]
  },
  {
    id: 'ai21',
    name: 'AI21 Labs',
    description: 'Jamba 系列模型',
    icon: 'bi bi-lightbulb-fill',
    website: 'https://www.ai21.com',
    endpoint: 'https://api.ai21.com/studio/v1',
    models: [
      { id: 'jamba-instruct', name: 'Jamba Instruct', description: '混合架构模型', providerId: 'ai21', contextWindow: 256000, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'j2-ultra', name: 'Jurassic-2 Ultra', providerId: 'ai21', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'novita',
    name: 'Novita AI',
    description: '高性价比 GPU 云服务',
    icon: 'bi bi-gpu-card',
    website: 'https://novita.ai',
    endpoint: 'https://api.novita.ai/v3',
    models: [
      { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', providerId: 'novita', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', providerId: 'novita', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  }
]

