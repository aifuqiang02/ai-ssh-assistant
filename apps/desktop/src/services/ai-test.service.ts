// AI 服务商连接测试服务

import type { AIProvider } from '../types/ai-providers'

export interface TestResult {
  success: boolean
  message: string
  latency?: number
  error?: string
}

function getRuntimeProviderId(provider: AIProvider): string {
  return provider.config?.runtimeProviderId || provider.id
}

/**
 * 测试 OpenAI 连接
 */
async function testOpenAI(provider: AIProvider, modelId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(`${provider.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 1
      })
    })

    const latency = Date.now() - startTime

    if (response.ok) {
      return {
        success: true,
        message: `连接成功！响应时间: ${latency}ms`,
        latency
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: '连接失败',
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: '连接失败',
      error: error.message || '网络错误或超时'
    }
  }
}

/**
 * 测试 Anthropic 连接
 */
async function testAnthropic(provider: AIProvider, modelId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(`${provider.endpoint}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      }),
      signal: AbortSignal.timeout(10000)
    })

    const latency = Date.now() - startTime

    if (response.ok) {
      return {
        success: true,
        message: `连接成功！响应时间: ${latency}ms`,
        latency
      }
    } else if (response.status === 401) {
      return {
        success: false,
        message: 'API Key 无效',
        error: '认证失败，请检查 API Key'
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: '连接失败',
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: '连接失败',
      error: error.message || '网络错误或超时'
    }
  }
}

/**
 * 测试 Google Gemini 连接
 */
async function testGoogle(provider: AIProvider, modelId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(
      `${provider.endpoint}/v1beta/models/${modelId}:generateContent?key=${provider.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hi' }] }]
        })
      }
    )

    const latency = Date.now() - startTime

    if (response.ok) {
      return {
        success: true,
        message: `连接成功！响应时间: ${latency}ms`,
        latency
      }
    } else if (response.status === 400 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: 'API Key 无效',
        error: errorData.error?.message || '认证失败，请检查 API Key'
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: '连接失败',
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: '连接失败',
      error: error.message || '网络错误或超时'
    }
  }
}

/**
 * 测试 MiniMax 连接
 */
async function testMinimax(provider: AIProvider, modelId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(`${provider.endpoint}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 1
      })
    })

    const latency = Date.now() - startTime

    if (response.ok) {
      const data = await response.json()
      if (data.base_resp?.status_code !== 0) {
        return {
          success: false,
          message: '连接失败',
          error: data.base_resp?.status_msg || data.msg || '业务错误'
        }
      }
      return {
        success: true,
        message: `连接成功！响应时间: ${latency}ms`,
        latency
      }
    } else if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: 'API Key 无效',
        error: '认证失败，请检查 API Key'
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: '连接失败',
        error:
          errorData.base_resp?.status_msg ||
          errorData.msg ||
          `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: '连接失败',
      error: error.message || '网络错误或超时'
    }
  }
}

/**
 * 通用测试（支持 OpenAI 兼容接口）
 */
async function testGeneric(provider: AIProvider, modelId: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(`${provider.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 1
      })
    })

    const latency = Date.now() - startTime

    if (response.ok) {
      return {
        success: true,
        message: `连接成功！响应时间: ${latency}ms`,
        latency
      }
    } else if (response.status === 401 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: 'API Key 无效',
        error: errorData.error?.message || '认证失败，请检查 API Key'
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: '连接失败',
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: '连接失败',
      error: error.message || '网络错误或超时'
    }
  }
}

/**
 * 测试 Ollama 本地连接
 */
async function testOllama(provider: AIProvider): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(`${provider.endpoint}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 本地连接超时时间短一些
    })

    const latency = Date.now() - startTime

    if (response.ok) {
      const data = await response.json()
      const modelCount = data.models?.length || 0
      return {
        success: true,
        message: `连接成功！找到 ${modelCount} 个本地模型，响应时间: ${latency}ms`,
        latency
      }
    } else {
      return {
        success: false,
        message: '连接失败',
        error: `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Ollama 未运行',
      error: '无法连接到本地 Ollama 服务，请确保 Ollama 已启动'
    }
  }
}

/**
 * 测试 AI 服务商连接
 */
export async function testProviderConnection(
  provider: AIProvider,
  modelId?: string
): Promise<TestResult> {
  // 检查 API Key
  if (!provider.apiKey && provider.id !== 'ollama') {
    return {
      success: false,
      message: '请先输入 API Key',
      error: 'API Key 为空'
    }
  }

  // 检查端点
  if (!provider.endpoint) {
    return {
      success: false,
      message: '端点 URL 未配置',
      error: '缺少端点配置'
    }
  }

  // Ollama 不需要模型ID
  if (provider.id === 'ollama') {
    return await testOllama(provider)
  }

  // 如果没有提供模型ID，返回错误
  if (!modelId) {
    return {
      success: false,
      message: '请提供要测试的模型ID',
      error: '缺少模型ID'
    }
  }

  // 根据服务商类型选择测试方法
  switch (getRuntimeProviderId(provider)) {
    case 'openai':
      return await testOpenAI(provider, modelId)

    case 'anthropic':
      return await testAnthropic(provider, modelId)

    case 'google':
      return await testGoogle(provider, modelId)

    case 'minimax':
      return await testMinimax(provider, modelId)

    // 其他服务商使用通用测试（OpenAI 兼容接口）
    case 'qwen':
    case 'deepseek':
    case 'moonshot':
    default:
      return await testGeneric(provider, modelId)
  }
}
