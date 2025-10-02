// 简单的加密工具 - 用于敏感信息存储
// 注意：这是基础的混淆方案，用于防止明文存储
// 对于生产环境，建议使用更强的加密算法

const ENCRYPTION_KEY = 'ai-ssh-assistant-encryption-key-2024'

/**
 * 简单的 XOR 加密
 */
function xorEncrypt(text: string, key: string): string {
  let result = ''
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

/**
 * Base64 编码
 */
function base64Encode(text: string): string {
  return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16))
  }))
}

/**
 * Base64 解码
 */
function base64Decode(encoded: string): string {
  return decodeURIComponent(Array.from(atob(encoded)).map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

/**
 * 加密 API Key
 */
export function encryptApiKey(apiKey: string): string {
  if (!apiKey) return ''
  
  try {
    // 1. XOR 加密
    const xorEncrypted = xorEncrypt(apiKey, ENCRYPTION_KEY)
    
    // 2. Base64 编码
    const base64Encrypted = base64Encode(xorEncrypted)
    
    // 3. 添加版本标识
    return `v1:${base64Encrypted}`
  } catch (error) {
    console.error('Encryption error:', error)
    return apiKey // 失败时返回原文
  }
}

/**
 * 解密 API Key
 */
export function decryptApiKey(encrypted: string): string {
  if (!encrypted) return ''
  
  try {
    // 检查版本标识
    if (!encrypted.startsWith('v1:')) {
      // 如果没有版本标识，可能是旧格式或明文
      return encrypted
    }
    
    // 1. 移除版本标识
    const base64Encrypted = encrypted.substring(3)
    
    // 2. Base64 解码
    const xorEncrypted = base64Decode(base64Encrypted)
    
    // 3. XOR 解密
    const decrypted = xorEncrypt(xorEncrypted, ENCRYPTION_KEY)
    
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    return encrypted // 失败时返回原文
  }
}

/**
 * 掩码显示 API Key（用于界面显示）
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey) return ''
  
  if (apiKey.length <= 8) {
    return '•'.repeat(apiKey.length)
  }
  
  // 显示前4个和后4个字符，中间用 • 代替
  const start = apiKey.substring(0, 4)
  const end = apiKey.substring(apiKey.length - 4)
  const middle = '•'.repeat(Math.min(20, apiKey.length - 8))
  
  return `${start}${middle}${end}`
}

/**
 * 验证 API Key 格式
 */
export function validateApiKey(provider: string, apiKey: string): { valid: boolean; message?: string } {
  if (!apiKey || apiKey.trim() === '') {
    return { valid: false, message: 'API Key 不能为空' }
  }
  
  // 各服务商的 API Key 格式验证
  const patterns: Record<string, { pattern: RegExp; message: string }> = {
    openai: {
      pattern: /^sk-[A-Za-z0-9]{20,}$/,
      message: 'OpenAI API Key 格式：sk-...'
    },
    anthropic: {
      pattern: /^sk-ant-[A-Za-z0-9\-_]{20,}$/,
      message: 'Anthropic API Key 格式：sk-ant-...'
    },
    google: {
      pattern: /^[A-Za-z0-9\-_]{20,}$/,
      message: 'Google API Key 格式无效'
    }
  }
  
  const validation = patterns[provider]
  if (validation && !validation.pattern.test(apiKey)) {
    return { valid: false, message: validation.message }
  }
  
  return { valid: true }
}

