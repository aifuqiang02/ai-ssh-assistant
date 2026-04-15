// 中国其他 AI 服务商（扩展）

import type { ProviderConfig } from './ai-providers.types'

export const CHINESE_EXTENDED_PROVIDERS: ProviderConfig[] = [
  {
    id: 'sensenova',
    name: '商汤日日新',
    description: '商汤科技大模型',
    icon: 'bi bi-sun',
    website: 'https://platform.sensenova.cn',
    endpoint: 'https://api.sensenova.cn/v1',
    models: [
      { id: 'SenseChat-5', name: 'SenseChat 5', description: '商汤最新模型', providerId: 'sensenova', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'SenseChat-Turbo', name: 'SenseChat Turbo', providerId: 'sensenova', contextWindow: 16384, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'taichu',
    name: '太初大模型',
    description: '中科院自动化所',
    icon: 'bi bi-yin-yang',
    website: 'https://taichu-web.ia.ac.cn',
    endpoint: 'https://api.taichu.ia.ac.cn/v1',
    models: [
      { id: 'taichu-2.0', name: '太初 2.0', description: '多模态大模型', providerId: 'taichu', contextWindow: 8192, capabilities: { text: true, image: true, functionCall: false, vision: true }, recommended: true }
    ]
  },
  {
    id: 'skylark',
    name: '云雀大模型',
    description: '昆仑万维',
    icon: 'bi bi-bird',
    website: 'https://www.kunlun.com',
    endpoint: 'https://api.skylark.com/v1',
    models: [
      { id: 'skylark-chat', name: 'Skylark Chat', providerId: 'skylark', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'chatglm',
    name: 'ChatGLM',
    description: '清华 KEG 实验室（旧版）',
    icon: 'bi bi-mortarboard',
    website: 'https://chatglm.cn',
    endpoint: 'https://open.bigmodel.cn/api/paas/v3',
    models: [
      { id: 'chatglm_turbo', name: 'ChatGLM Turbo', providerId: 'chatglm', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'minimax-music',
    name: 'MiniMax Music',
    description: 'MiniMax 音乐生成',
    icon: 'bi bi-music-note-beamed',
    website: 'https://www.minimaxi.com',
    endpoint: 'https://api.minimax.chat/v1/music',
    models: [
      { id: 'music-01', name: 'Music 01', description: 'AI 音乐生成', providerId: 'minimax-music', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'infini-ai',
    name: '无问芯穹',
    description: '高性能推理',
    icon: 'bi bi-infinity',
    website: 'https://cloud.infini-ai.com',
    endpoint: 'https://api.infini-ai.com/v1',
    models: [
      { id: 'Qwen2-72B-Instruct', name: 'Qwen2 72B', providerId: 'infini-ai', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'Llama-3-70B-Instruct', name: 'Llama 3 70B', providerId: 'infini-ai', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'zhipuai-all',
    name: '智谱清言',
    description: '智谱 AI 完整版',
    icon: 'bi bi-chat-dots',
    website: 'https://chatglm.cn',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4-air', name: 'GLM-4 Air', description: '超快速推理', providerId: 'zhipuai-all', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'glm-4-airx', name: 'GLM-4 AirX', description: '平衡版', providerId: 'zhipuai-all', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: true, vision: false } },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', description: '极速版', providerId: 'zhipuai-all', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'doubao',
    name: '豆包大模型',
    description: '字节跳动',
    icon: 'bi bi-bag',
    website: 'https://www.doubao.com',
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    models: [
      { id: 'doubao-pro-32k', name: 'Doubao Pro 32K', description: '豆包专业版', providerId: 'doubao', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'doubao-lite-32k', name: 'Doubao Lite 32K', providerId: 'doubao', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'yuan',
    name: '源 2.0',
    description: '浪潮信息',
    icon: 'bi bi-water',
    website: 'https://air.inspur.com',
    endpoint: 'https://api.inspur.com/v1',
    models: [
      { id: 'Yuan2-102B', name: 'Yuan 2.0 102B', description: '千亿参数模型', providerId: 'yuan', contextWindow: 16384, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'tiangong',
    name: '天工 AI',
    description: '昆仑万维天工大模型',
    icon: 'bi bi-clouds',
    website: 'https://tiangong.kunlun.com',
    endpoint: 'https://sky-api.singularity-ai.com/v1',
    models: [
      { id: 'SkyChat-MegaVerse', name: 'SkyChat MegaVerse', description: '超大规模模型', providerId: 'tiangong', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  }
]

