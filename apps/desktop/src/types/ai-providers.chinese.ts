// 中国主流 AI 服务商

import type { ProviderConfig } from './ai-providers.types'

export const CHINESE_PROVIDERS: ProviderConfig[] = [
  {
    id: 'qwen',
    name: '通义千问',
    description: '阿里云推出的大语言模型',
    icon: 'bi bi-cloud',
    website: 'https://dashscope.aliyun.com',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { id: 'qwen-max', name: 'Qwen Max', description: '通义千问最强模型', providerId: 'qwen', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'qwen-plus', name: 'Qwen Plus', providerId: 'qwen', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'qwen-turbo', name: 'Qwen Turbo', providerId: 'qwen', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: true, vision: false } },
      { id: 'qwen-vl-plus', name: 'Qwen VL Plus', description: '多模态视觉模型', providerId: 'qwen', contextWindow: 8192, capabilities: { text: true, image: true, functionCall: false, vision: true } }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: '深度求索开发的大模型',
    icon: 'bi bi-star',
    website: 'https://platform.deepseek.com',
    endpoint: 'https://api.deepseek.com/v1',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: '高性价比的对话模型', providerId: 'deepseek', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, price: { input: 0.14, output: 0.28 }, recommended: true },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', description: '专业的代码生成模型', providerId: 'deepseek', contextWindow: 16384, capabilities: { text: true, image: false, functionCall: false, vision: false }, price: { input: 0.14, output: 0.28 } }
    ]
  },
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    description: '月之暗面科技的 Kimi 模型',
    icon: 'bi bi-moon-stars',
    website: 'https://platform.moonshot.cn',
    endpoint: 'https://api.moonshot.cn/v1',
    models: [
      { id: 'moonshot-v1-128k', name: 'Moonshot v1 128K', description: '超长上下文模型', providerId: 'moonshot', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'moonshot-v1-32k', name: 'Moonshot v1 32K', providerId: 'moonshot', contextWindow: 32000, capabilities: { text: true, image: false, functionCall: true, vision: false } },
      { id: 'moonshot-v1-8k', name: 'Moonshot v1 8K', providerId: 'moonshot', contextWindow: 8000, capabilities: { text: true, image: false, functionCall: true, vision: false } }
    ]
  },
  {
    id: 'zhipu',
    name: '智谱 AI',
    description: '清华系 AI 公司，GLM 系列模型',
    icon: 'bi bi-lightbulb',
    website: 'https://open.bigmodel.cn',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4', name: 'GLM-4', description: '最新的 GLM 模型', providerId: 'zhipu', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'glm-4v', name: 'GLM-4V', description: '多模态视觉模型', providerId: 'zhipu', contextWindow: 8192, capabilities: { text: true, image: true, functionCall: false, vision: true } },
      { id: 'glm-3-turbo', name: 'GLM-3 Turbo', providerId: 'zhipu', contextWindow: 128000, capabilities: { text: true, image: false, functionCall: true, vision: false } }
    ]
  },
  {
    id: 'baichuan',
    name: '百川智能',
    description: '搜狗创始人王小川创立的 AI 公司',
    icon: 'bi bi-tsunami',
    website: 'https://platform.baichuan-ai.com',
    endpoint: 'https://api.baichuan-ai.com/v1',
    models: [
      { id: 'Baichuan4', name: 'Baichuan 4', description: '最新的百川模型', providerId: 'baichuan', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'Baichuan3-Turbo', name: 'Baichuan 3 Turbo', providerId: 'baichuan', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    description: '稀宇科技推出的大模型',
    icon: 'bi bi-box',
    website: 'https://www.minimaxi.com',
    endpoint: 'https://api.minimax.chat/v1',
    models: [
      { id: 'abab6-chat', name: 'abab6 Chat', description: 'MiniMax 最新对话模型', providerId: 'minimax', contextWindow: 245760, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'abab5.5-chat', name: 'abab5.5 Chat', providerId: 'minimax', contextWindow: 16384, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'yi',
    name: '零一万物',
    description: '李开复创立的 AI 公司',
    icon: 'bi bi-hexagon',
    website: 'https://platform.lingyiwanwu.com',
    endpoint: 'https://api.lingyiwanwu.com/v1',
    models: [
      { id: 'yi-large', name: 'Yi Large', description: '零一万物最强模型', providerId: 'yi', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'yi-medium', name: 'Yi Medium', providerId: 'yi', contextWindow: 16384, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'yi-vision', name: 'Yi Vision', description: '多模态视觉模型', providerId: 'yi', contextWindow: 4096, capabilities: { text: true, image: true, functionCall: false, vision: true } }
    ]
  },
  {
    id: 'stepfun',
    name: '阶跃星辰',
    description: 'Step-1 系列模型',
    icon: 'bi bi-stars',
    website: 'https://platform.stepfun.com',
    endpoint: 'https://api.stepfun.com/v1',
    models: [
      { id: 'step-1-256k', name: 'Step-1 256K', description: '超长上下文对话模型', providerId: 'stepfun', contextWindow: 262144, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'step-1-flash', name: 'Step-1 Flash', providerId: 'stepfun', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'step-1v-32k', name: 'Step-1V 32K', description: '多模态视觉模型', providerId: 'stepfun', contextWindow: 32768, capabilities: { text: true, image: true, functionCall: false, vision: true } }
    ]
  },
  {
    id: 'spark',
    name: '讯飞星火',
    description: '科大讯飞的大模型',
    icon: 'bi bi-fire',
    website: 'https://xinghuo.xfyun.cn',
    endpoint: 'https://spark-api.xf-yun.com/v1',
    models: [
      { id: 'spark-max', name: 'Spark Max', description: '星火最强模型', providerId: 'spark', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: 'spark-pro', name: 'Spark Pro', providerId: 'spark', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'spark-lite', name: 'Spark Lite', providerId: 'spark', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'hunyuan',
    name: '腾讯混元',
    description: '腾讯云推出的大语言模型',
    icon: 'bi bi-chat-left-dots',
    website: 'https://cloud.tencent.com/product/hunyuan',
    endpoint: 'https://api.hunyuan.cloud.tencent.com/v1',
    models: [
      { id: 'hunyuan-pro', name: 'Hunyuan Pro', description: '混元专业版', providerId: 'hunyuan', contextWindow: 32768, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'hunyuan-standard', name: 'Hunyuan Standard', providerId: 'hunyuan', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'hunyuan-lite', name: 'Hunyuan Lite', providerId: 'hunyuan', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: 'wenxin',
    name: '文心一言',
    description: '百度推出的大语言模型',
    icon: 'bi bi-chat-square-text',
    website: 'https://cloud.baidu.com/product/wenxinworkshop',
    endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1',
    models: [
      { id: 'ernie-4.0', name: 'ERNIE 4.0', description: '文心大模型 4.0', providerId: 'wenxin', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: true, vision: false }, recommended: true },
      { id: 'ernie-3.5', name: 'ERNIE 3.5', providerId: 'wenxin', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } },
      { id: 'ernie-bot-turbo', name: 'ERNIE Bot Turbo', providerId: 'wenxin', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  },
  {
    id: '360ai',
    name: '360智脑',
    description: '360 集团的 AI 大模型',
    icon: 'bi bi-shield-check',
    website: 'https://ai.360.cn',
    endpoint: 'https://api.360.cn/v1',
    models: [
      { id: '360gpt-pro', name: '360GPT Pro', description: '360智脑专业版', providerId: '360ai', contextWindow: 8192, capabilities: { text: true, image: false, functionCall: false, vision: false }, recommended: true },
      { id: '360gpt-turbo', name: '360GPT Turbo', providerId: '360ai', contextWindow: 4096, capabilities: { text: true, image: false, functionCall: false, vision: false } }
    ]
  }
]

