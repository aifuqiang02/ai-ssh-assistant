/**
 * AI 消息统计类型定义
 * 参考 lobe-chat 的实现
 */

/**
 * Token 使用量统计
 */
export interface ModelTokensUsage {
  // 输入 Token 细分
  /**
   * 用户提示文本
   */
  inputTextTokens?: number
  /**
   * 输入图片 Token
   */
  inputImageTokens?: number
  /**
   * 输入音频 Token
   */
  inputAudioTokens?: number
  /**
   * 引用 Token (如 pplx)
   */
  inputCitationTokens?: number

  // 输入缓存 Token
  /**
   * 缓存命中的 Token
   */
  inputCachedTokens?: number
  /**
   * 缓存未命中的 Token
   */
  inputCacheMissTokens?: number
  /**
   * 写入缓存的 Token
   */
  inputWriteCacheTokens?: number

  // 输出 Token 细分
  /**
   * 输出文本 Token
   */
  outputTextTokens?: number
  /**
   * 输出图片 Token
   */
  outputImageTokens?: number
  /**
   * 输出音频 Token
   */
  outputAudioTokens?: number
  /**
   * 推理 Token (如 o1 模型)
   */
  outputReasoningTokens?: number

  // 预测 Token
  acceptedPredictionTokens?: number
  rejectedPredictionTokens?: number

  // Token 总计
  totalInputTokens?: number
  totalOutputTokens?: number
  totalTokens?: number
}

/**
 * 模型速度统计
 */
export interface ModelSpeed {
  /**
   * 每秒 Token 数 (Tokens Per Second)
   */
  tps?: number
  /**
   * 首个 Token 时间 (Time To First Token, 毫秒)
   */
  ttft?: number
  /**
   * 输出持续时间 (从输出开始到结束, 毫秒)
   */
  duration?: number
  /**
   * 总延迟 (从输入开始到输出结束, 毫秒)
   */
  latency?: number
}

/**
 * 消息元数据 (包含使用量和速度统计)
 */
export interface MessageMetadata extends ModelTokensUsage, ModelSpeed {
  /**
   * 花费 (美元)
   */
  cost?: number
}

/**
 * Token 进度条数据项
 */
export interface TokenProgressItem {
  id: string
  title: string
  value: number
  color: string
}

/**
 * Token 详情数据
 */
export interface TokenDetail {
  token: number
  credit?: number
}

/**
 * 详细 Token 统计
 */
export interface DetailedTokens {
  // 输入细分
  inputText?: TokenDetail
  inputImage?: TokenDetail
  inputAudio?: TokenDetail
  inputCitation?: TokenDetail

  // 缓存细分
  inputCacheMiss?: TokenDetail
  inputCached?: TokenDetail
  inputCachedWrite?: TokenDetail

  // 输出细分
  outputText?: TokenDetail
  outputImage?: TokenDetail
  outputAudio?: TokenDetail
  outputReasoning?: TokenDetail

  // 总计
  totalInput?: TokenDetail
  totalOutput?: TokenDetail
  totalTokens?: TokenDetail
}

