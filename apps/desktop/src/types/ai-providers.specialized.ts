// 专业和特殊用途 AI 服务商

import type { ProviderConfig } from './ai-providers.types'

export const SPECIALIZED_PROVIDERS: ProviderConfig[] = [
  {
    id: 'minimax-speech',
    name: 'MiniMax Speech',
    description: 'MiniMax 语音服务',
    icon: 'bi bi-mic',
    website: 'https://www.minimaxi.com',
    endpoint: 'https://api.minimax.chat/v1/t2a',
    models: [
      { id: 'speech-01', name: 'Speech 01', description: 'TTS 语音合成', providerId: 'minimax-speech', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'stability',
    name: 'Stability AI',
    description: 'Stable Diffusion 图像生成',
    icon: 'bi bi-image',
    website: 'https://stability.ai',
    endpoint: 'https://api.stability.ai/v1',
    models: [
      { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', description: '图像生成', providerId: 'stability', contextWindow: 77, capabilities: { text: true, image: true, functionCall: false, vision: false }, recommended: true },
      { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', providerId: 'stability', contextWindow: 77, capabilities: { text: true, image: true, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI 艺术图像生成',
    icon: 'bi bi-palette',
    website: 'https://www.midjourney.com',
    endpoint: 'https://api.midjourney.com/v1',
    models: [
      { id: 'mj-6', name: 'Midjourney V6', description: '最新版本', providerId: 'midjourney', contextWindow: 256, capabilities: { text: true, image: true, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'AI 语音合成',
    icon: 'bi bi-volume-up',
    website: 'https://elevenlabs.io',
    endpoint: 'https://api.elevenlabs.io/v1',
    models: [
      { id: 'eleven_multilingual_v2', name: 'Multilingual V2', description: '多语言语音', providerId: 'elevenlabs', contextWindow: 5000, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'runway',
    name: 'Runway',
    description: 'AI 视频生成',
    icon: 'bi bi-camera-video',
    website: 'https://runwayml.com',
    endpoint: 'https://api.runwayml.com/v1',
    models: [
      { id: 'gen-2', name: 'Gen-2', description: '视频生成', providerId: 'runway', contextWindow: 120, capabilities: { text: true, image: true, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'suno',
    name: 'Suno AI',
    description: 'AI 音乐生成',
    icon: 'bi bi-music-note-list',
    website: 'https://suno.ai',
    endpoint: 'https://api.suno.ai/v1',
    models: [
      { id: 'chirp-v3', name: 'Chirp V3', description: '音乐生成', providerId: 'suno', contextWindow: 240, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    description: '文字图像生成专家',
    icon: 'bi bi-fonts',
    website: 'https://ideogram.ai',
    endpoint: 'https://api.ideogram.ai/v1',
    models: [
      { id: 'ideogram-v1', name: 'Ideogram V1', description: '精确文字渲染', providerId: 'ideogram', contextWindow: 256, capabilities: { text: true, image: true, functionCall: false, vision: false }, recommended: true }
    ]
  },
  {
    id: 'together-image',
    name: 'Together Image',
    description: 'Together 图像模型',
    icon: 'bi bi-image-fill',
    website: 'https://together.ai',
    endpoint: 'https://api.together.xyz/v1',
    models: [
      { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'SDXL', providerId: 'together-image', contextWindow: 77, capabilities: { text: true, image: true, functionCall: false, vision: false }, recommended: true }
    ]
  }
]

