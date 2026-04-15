// 开源和小型服务商

import type { ProviderConfig } from './ai-providers.types'

export const OPENSOURCE_PROVIDERS: ProviderConfig[] = [
  {
    id: 'upstage',
    name: 'Upstage',
    description: '韩国 AI 公司 Solar 模型',
    icon: 'bi bi-sunrise',
    website: 'https://www.upstage.ai',
    endpoint: 'https://api.upstage.ai/v1',
    models: [
      { id: 'solar-1-mini-chat', name: 'Solar 1 Mini', description: '轻量级高效模型', providerId: 'upstage', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'solar-pro', name: 'Solar Pro', providerId: 'upstage', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'lepton',
    name: 'Lepton AI',
    description: '快速部署 AI 模型',
    icon: 'bi bi-lightning',
    website: 'https://lepton.ai',
    endpoint: 'https://api.lepton.ai/v1',
    models: [
      { id: 'llama3-70b', name: 'Llama 3 70B', providerId: 'lepton', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', providerId: 'lepton', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'anyscale',
    name: 'Anyscale',
    description: 'Ray 团队的 LLM 服务',
    icon: 'bi bi-bounding-box',
    website: 'https://www.anyscale.com',
    endpoint: 'https://api.endpoints.anyscale.com/v1',
    models: [
      { id: 'meta-llama/Meta-Llama-3-70B-Instruct', name: 'Llama 3 70B', providerId: 'anyscale', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', providerId: 'anyscale', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'deepinfra',
    name: 'DeepInfra',
    description: '开源模型推理服务',
    icon: 'bi bi-server',
    website: 'https://deepinfra.com',
    endpoint: 'https://api.deepinfra.com/v1/openai',
    models: [
      { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B', providerId: 'deepinfra', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'mistralai/Mixtral-8x22B-Instruct-v0.1', name: 'Mixtral 8x22B', providerId: 'deepinfra', contextWindow: 65536, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'octoai',
    name: 'OctoAI',
    description: '高性能模型服务',
    icon: 'bi bi-octagon',
    website: 'https://octo.ai',
    endpoint: 'https://text.octoai.run/v1',
    models: [
      { id: 'meta-llama-3-70b-instruct', name: 'Llama 3 70B', providerId: 'octoai', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'mixtral-8x7b-instruct', name: 'Mixtral 8x7B', providerId: 'octoai', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'modal',
    name: 'Modal Labs',
    description: '无服务器 AI 部署',
    icon: 'bi bi-window-stack',
    website: 'https://modal.com',
    endpoint: 'https://api.modal.com/v1',
    models: [
      { id: 'llama-3-70b', name: 'Llama 3 70B', providerId: 'modal', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'runpod',
    name: 'RunPod',
    description: 'GPU 云服务',
    icon: 'bi bi-cpu',
    website: 'https://runpod.io',
    endpoint: 'https://api.runpod.ai/v2',
    models: [
      { id: 'llama3-70b-instruct', name: 'Llama 3 70B', providerId: 'runpod', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'banana',
    name: 'Banana',
    description: 'ML 模型托管',
    icon: 'bi bi-bookmark',
    website: 'https://banana.dev',
    endpoint: 'https://api.banana.dev/v1',
    models: [
      { id: 'llama-2-70b', name: 'Llama 2 70B', providerId: 'banana', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'higress',
    name: 'Higress AI',
    description: '阿里云网关 AI 插件',
    icon: 'bi bi-router',
    website: 'https://higress.io',
    endpoint: 'https://api.higress.io/v1',
    models: [
      { id: 'qwen-turbo', name: 'Qwen Turbo (via Higress)', providerId: 'higress', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'friendli',
    name: 'Friendli AI',
    description: '优化的模型推理',
    icon: 'bi bi-emoji-smile',
    website: 'https://friendli.ai',
    endpoint: 'https://api.friendli.ai/v1',
    models: [
      { id: 'mixtral-8x7b-instruct-v0-1', name: 'Mixtral 8x7B', providerId: 'friendli', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  }
]

