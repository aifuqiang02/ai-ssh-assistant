/**
 * WebFetch Service
 * 获取网页内容
 */

export interface WebFetchResult {
  success: boolean
  url: string
  title?: string
  content: string
  error?: string
}

/**
 * 获取网页内容
 * 使用 fetch API 获取网页 HTML，并提取主要内容
 */
export async function fetchWebContent(url: string): Promise<WebFetchResult> {
  try {
    // 验证 URL
    const validatedUrl = validateUrl(url)
    if (!validatedUrl) {
      return {
        success: false,
        url,
        content: '',
        error: 'Invalid URL format'
      }
    }

    // 获取网页内容
    const response = await fetch(validatedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      return {
        success: false,
        url: validatedUrl,
        content: '',
        error: `HTTP ${response.status}: ${response.statusText}`
      }
    }

    const html = await response.text()

    // 提取标题和内容
    const title = extractTitle(html)
    const content = extractMainContent(html)

    return {
      success: true,
      url: validatedUrl,
      title,
      content
    }
  } catch (error) {
    return {
      success: false,
      url,
      content: '',
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * 验证并规范化 URL
 */
function validateUrl(url: string): string | null {
  if (!url) return null

  // 添加协议前缀
  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl
  }

  try {
    const urlObj = new URL(normalizedUrl)
    return urlObj.href
  } catch {
    return null
  }
}

/**
 * 从 HTML 中提取标题
 */
function extractTitle(html: string): string | undefined {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return titleMatch?.[1]?.trim()
}

/**
 * 从 HTML 中提取主要内容
 * 移除 script, style 标签并提取文本
 */
function extractMainContent(html: string): string {
  // 移除 script 和 style 标签及其内容
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')

  // 移除 HTML 标签
  text = text.replace(/<[^>]+>/g, ' ')

  // 解码 HTML 实体
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')

  // 规范化空白字符
  text = text.replace(/\s+/g, ' ').trim()

  // 限制长度（保留前 10000 字符）
  const maxLength = 10000
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '\n\n[内容已截断...]'
  }

  return text
}
