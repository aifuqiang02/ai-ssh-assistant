# 🤖 AI 服务商设置实现分析

本文档分析 LobeChat 的 AI 服务商设置实现，并设计我们自己的实现方案。

## 📊 LobeChat AI 服务商设置分析

### 1. 核心架构

LobeChat 的 AI 服务商设置基于以下架构：

```
┌─────────────────────────────────────┐
│         设置界面（Settings）         │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │    AI 服务商列表              │  │
│  │  • OpenAI                     │  │
│  │  • Anthropic Claude           │  │
│  │  • Google                     │  │
│  │  • Azure                      │  │
│  │  • ... (50+ providers)        │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│        每个服务商配置项               │
│  • API Key                          │
│  • 端点 URL (可选)                   │
│  • 模型列表                         │
│  • 其他参数                         │
└─────────────────────────────────────┘
```

### 2. 支持的 AI 服务商

LobeChat 支持 **50+ AI 服务商**，主要包括：

#### 主流国际服务商
- **OpenAI** - GPT-4o, GPT-4-turbo, GPT-3.5-turbo
- **Anthropic** - Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Google** - Gemini Pro, Gemini Ultra
- **Azure OpenAI** - Azure 托管的 OpenAI 模型
- **AWS Bedrock** - Amazon 的 AI 服务
- **Groq** - 超快推理速度
- **Mistral AI** - Mistral 系列模型
- **Perplexity** - 搜索增强的 AI

#### 国内服务商
- **通义千问** - 阿里云
- **文心一言** - 百度
- **智谱 AI** - ChatGLM
- **Moonshot** - 月之暗面
- **DeepSeek** - 深度求索
- **腾讯混元** - 腾讯云
- **讯飞星火** - 科大讯飞
- **MiniMax** - MiniMax
- **零一万物** - 01.AI
- **Step Fun** - 阶跃星辰

#### 本地/开源方案
- **Ollama** - 本地模型运行
- **LM Studio** - 本地模型管理
- **vLLM** - 高性能推理引擎

### 3. 配置流程

#### 用户配置步骤
1. 进入"设置"界面
2. 找到"AI 服务商"部分
3. 选择要配置的服务商
4. 填入 API Key 和其他配置
5. 在聊天时选择对应的模型

#### 技术实现要点

**配置项结构：**
```typescript
interface ProviderConfig {
  id: string                  // 服务商 ID
  name: string                // 显示名称
  icon: string                // 图标
  apiKey: string              // API 密钥
  endpoint?: string           // 自定义端点
  models: ModelConfig[]       // 支持的模型列表
  enabled: boolean            // 是否启用
  customHeaders?: Record      // 自定义请求头
  maxTokens?: number          // 最大 token
  temperature?: number        // 温度参数
}

interface ModelConfig {
  id: string                  // 模型 ID
  name: string                // 显示名称
  contextWindow: number       // 上下文窗口
  pricing?: {                 // 价格信息
    input: number
    output: number
  }
  capabilities: string[]      // 能力（文本、图像、函数调用等）
}
```

**存储方式：**
- 本地存储：使用 localStorage 或 IndexedDB
- 云端同步：可选的账户同步功能
- 加密：敏感信息（API Key）加密存储

### 4. UI/UX 设计特点

#### 设置界面布局
```
┌─────────────────────────────────────────────┐
│  AI 服务商                    [+ 添加自定义]  │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │  [OpenAI Logo] OpenAI        [启用]  │   │
│  │  API Key: sk-••••••••••••••••••••••  │   │
│  │  支持模型: GPT-4o, GPT-4-turbo...   │   │
│  │  [查看详情]                [测试连接]  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  [Claude Logo] Anthropic     [禁用]  │   │
│  │  API Key: sk-ant-•••••••••••••••••   │   │
│  │  [查看详情]                [测试连接]  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### 交互特点
1. **折叠/展开** - 每个服务商可以折叠或展开详细配置
2. **实时验证** - 输入 API Key 后可以测试连接
3. **模型选择器** - 聊天时动态选择模型
4. **状态指示** - 显示服务商是否可用
5. **快速启用/禁用** - 一键切换服务商

### 5. 环境变量支持

LobeChat 支持通过环境变量预配置服务商：

```bash
# OpenAI
OPENAI_API_KEY=sk-xxx
OPENAI_ENDPOINT=https://api.openai.com/v1

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# Azure OpenAI
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_ENDPOINT=xxx
AZURE_OPENAI_API_VERSION=2023-12-01-preview

# 自定义模型列表
CUSTOM_MODELS=-gpt-4,+gpt-4-32k  # 删除/添加模型
```

---

## 🎯 我们的实现方案

### 1. 功能范围

**第一阶段（MVP）：**
- ✅ 支持 5-8 个主流服务商
  - OpenAI
  - Anthropic Claude
  - Google Gemini
  - 通义千问（阿里云）
  - 文心一言（百度）
  - Ollama（本地）
  - DeepSeek
  - Moonshot

- ✅ 基础配置项
  - API Key
  - 自定义端点
  - 模型选择
  - 温度/最大 token

**第二阶段（扩展）：**
- 更多服务商支持
- 高级参数配置
- 费用追踪
- 使用统计

### 2. 数据库设计

```prisma
// AI 服务商配置表
model AIProviderConfig {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // 服务商信息
  providerId  String   // openai, anthropic, google, etc.
  providerName String  // 显示名称
  
  // 认证信息（加密存储）
  apiKey      String   // API 密钥
  endpoint    String?  // 自定义端点
  
  // 配置
  config      Json?    // 其他配置（模型列表、参数等）
  
  // 状态
  enabled     Boolean  @default(true)
  isDefault   Boolean  @default(false) // 是否为默认服务商
  
  // 元数据
  lastUsed    DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("ai_provider_configs")
  @@index([userId, providerId])
}

// AI 模型配置表
model AIModelConfig {
  id              String   @id @default(cuid())
  providerId      String   // 所属服务商
  
  // 模型信息
  modelId         String   // 模型 ID (gpt-4o, claude-3-opus, etc.)
  modelName       String   // 显示名称
  contextWindow   Int      // 上下文窗口大小
  
  // 能力
  capabilities    Json     // 支持的能力（文本、图像、函数调用等）
  
  // 价格（每 1M tokens）
  inputPrice      Float?   // 输入价格
  outputPrice     Float?   // 输出价格
  
  // 状态
  enabled         Boolean  @default(true)
  isRecommended   Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("ai_model_configs")
  @@unique([providerId, modelId])
}

// AI 使用记录表（可选，用于统计）
model AIUsageLog {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  providerId      String
  modelId         String
  
  // 使用量
  inputTokens     Int
  outputTokens    Int
  totalTokens     Int
  
  // 费用
  cost            Float?
  
  // 会话信息
  sessionId       String?
  
  createdAt       DateTime @default(now())
  
  @@map("ai_usage_logs")
  @@index([userId, createdAt])
  @@index([providerId, modelId])
}
```

### 3. 前端实现

#### 设置页面新增 AI 服务商部分

在 `SettingsView.vue` 中添加新的 section：

```vue
<section :id="'section-ai-providers'" class="setting-section">
  <h2 class="section-title">
    <i class="bi bi-robot"></i>
    AI 服务商
  </h2>
  <p class="section-description">配置 AI 模型的服务提供商</p>
  
  <!-- 服务商列表 -->
  <div class="providers-list">
    <div 
      v-for="provider in aiProviders" 
      :key="provider.id"
      class="provider-card"
    >
      <div class="provider-header">
        <div class="provider-info">
          <img :src="provider.icon" :alt="provider.name" class="provider-icon" />
          <div>
            <h4>{{ provider.name }}</h4>
            <p>{{ provider.description }}</p>
          </div>
        </div>
        <label class="toggle-switch">
          <input v-model="provider.enabled" type="checkbox" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div v-if="provider.enabled" class="provider-config">
        <!-- API Key -->
        <div class="config-item">
          <label>API Key</label>
          <input 
            v-model="provider.apiKey" 
            type="password" 
            placeholder="输入 API Key"
          />
        </div>
        
        <!-- 自定义端点 -->
        <div class="config-item">
          <label>端点 URL（可选）</label>
          <input 
            v-model="provider.endpoint" 
            type="url" 
            placeholder="https://api.example.com/v1"
          />
        </div>
        
        <!-- 测试连接按钮 -->
        <button @click="testProvider(provider)" class="btn-test">
          <i class="bi bi-lightning"></i>
          测试连接
        </button>
      </div>
    </div>
  </div>
</section>
```

#### 模型选择器组件

```vue
<!-- ModelSelector.vue -->
<template>
  <div class="model-selector">
    <select v-model="selectedModel" @change="onModelChange">
      <optgroup v-for="provider in enabledProviders" :key="provider.id" :label="provider.name">
        <option 
          v-for="model in provider.models" 
          :key="model.id" 
          :value="model.id"
        >
          {{ model.name }} 
          <span v-if="model.contextWindow">({{ model.contextWindow }}k)</span>
        </option>
      </optgroup>
    </select>
  </div>
</template>
```

### 4. 服务商配置定义

```typescript
// src/types/ai-providers.ts

export interface AIProvider {
  id: string
  name: string
  description: string
  icon: string
  website: string
  
  // 配置
  apiKey: string
  endpoint?: string
  enabled: boolean
  isDefault: boolean
  
  // 支持的模型
  models: AIModel[]
  
  // 配置项
  config?: {
    organization?: string
    project?: string
    customHeaders?: Record<string, string>
  }
}

export interface AIModel {
  id: string
  name: string
  providerId: string
  contextWindow: number
  
  capabilities: {
    text: boolean
    image: boolean
    function: boolean
    vision: boolean
  }
  
  pricing?: {
    input: number   // 每 1M tokens 价格
    output: number
  }
  
  recommended?: boolean
}

// 预定义的服务商列表
export const DEFAULT_PROVIDERS: Partial<AIProvider>[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, GPT-4-turbo, GPT-3.5',
    icon: '/icons/openai.svg',
    website: 'https://openai.com',
    endpoint: 'https://api.openai.com/v1',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        contextWindow: 128,
        capabilities: { text: true, image: true, function: true, vision: true },
        pricing: { input: 2.5, output: 10 },
        recommended: true
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        contextWindow: 128,
        capabilities: { text: true, image: false, function: true, vision: true }
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        contextWindow: 16,
        capabilities: { text: true, image: false, function: true, vision: false },
        pricing: { input: 0.5, output: 1.5 }
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude 3.5 Sonnet, Claude 3 Opus',
    icon: '/icons/anthropic.svg',
    website: 'https://anthropic.com',
    endpoint: 'https://api.anthropic.com',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        contextWindow: 200,
        capabilities: { text: true, image: true, function: true, vision: true },
        recommended: true
      }
    ]
  },
  {
    id: 'qwen',
    name: '通义千问',
    description: '阿里云 Qwen 系列模型',
    icon: '/icons/qwen.svg',
    website: 'https://dashscope.aliyun.com',
    endpoint: 'https://dashscope.aliyuncs.com/api/v1',
    models: [
      {
        id: 'qwen-plus',
        name: 'Qwen Plus',
        contextWindow: 32,
        capabilities: { text: true, image: false, function: true, vision: false }
      }
    ]
  }
]
```

### 5. API 封装

```typescript
// src/services/ai-provider.service.ts

export class AIProviderService {
  // 测试服务商连接
  async testProvider(provider: AIProvider): Promise<boolean> {
    try {
      const response = await fetch(`${provider.endpoint}/models`, {
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      return response.ok
    } catch (error) {
      console.error('Provider test failed:', error)
      return false
    }
  }
  
  // 保存服务商配置
  async saveProviderConfig(provider: AIProvider): Promise<void> {
    if (window.electronAPI) {
      await window.electronAPI.ai.saveProviderConfig(provider)
    }
  }
  
  // 获取可用模型列表
  async getAvailableModels(): Promise<AIModel[]> {
    const providers = await this.getEnabledProviders()
    return providers.flatMap(p => p.models)
  }
}
```

---

## 📈 实现优先级

### Phase 1（MVP）
1. ✅ 数据库表设计
2. ✅ 基础 UI 组件
3. ✅ 配置存储/读取
4. ✅ 3-5 个主流服务商
5. ✅ 基础模型选择

### Phase 2（增强）
1. ⏰ 连接测试功能
2. ⏰ 更多服务商支持
3. ⏰ 高级配置选项
4. ⏰ 使用统计

### Phase 3（高级）
1. 🔮 费用追踪
2. 🔮 模型对比
3. 🔮 智能推荐
4. 🔮 负载均衡

---

## 🔗 相关文档

- [LobeChat 官方文档](https://lobehub.com/docs)
- [数据库表结构](./database-schema.md)
- [开发入门](./getting-started.md)

---

**最后更新：** 2024-10-02

