<template>
  <div class="markdown-renderer">
    <template v-for="(part, index) in contentParts" :key="index">
      <!-- 普通文本/Markdown 内容 -->
      <div 
        v-if="part.type === 'text'" 
        v-html="part.html"
        class="markdown-text"
      ></div>
      
      <!-- 代码块组件 -->
      <CodeBlockWithCopy
        v-else-if="part.type === 'code'"
        :code="part.code || ''"
        :language="part.language || 'text'"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import CodeBlockWithCopy from './CodeBlockWithCopy.vue'

const props = defineProps<{
  content: string
}>()

interface ContentPart {
  type: 'text' | 'code'
  html?: string
  code?: string
  language?: string
}

// 提取代码块
const extractCodeBlocks = (content: string) => {
  const blocks: Array<{
    code: string
    language: string
    placeholder: string
  }> = []
  
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let match
  let processedContent = content
  let blockIndex = 0

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'text'
    const code = match[2].trim()
    // 使用 HTML 注释作为占位符，Marked 不会处理它
    const placeholder = `<!--CODEBLOCK${blockIndex}-->`
    
    blocks.push({
      code,
      language,
      placeholder
    })
    
    processedContent = processedContent.replace(match[0], placeholder)
    blockIndex++
  }

  return { blocks, processedContent }
}

// 解析内容为部分
const contentParts = computed<ContentPart[]>(() => {
  const parts: ContentPart[] = []
  
  try {
    const contentStr = String(props.content || '')
    if (!contentStr.trim()) {
      return [{ type: 'text', html: '' }]
    }
    
    // 提取代码块
    const { blocks, processedContent } = extractCodeBlocks(contentStr)
    
    // 调试日志
    if (blocks.length > 0) {
      console.log('[MarkdownRenderer] 提取到代码块:', blocks.length)
      console.log('[MarkdownRenderer] 处理后内容:', processedContent.substring(0, 200))
    }
    
    // 渲染 Markdown（不包含代码块）
    const markedResult = marked(processedContent)
    let html = typeof markedResult === 'string' ? markedResult : processedContent
    
    if (blocks.length > 0) {
      console.log('[MarkdownRenderer] Marked 渲染后:', html.substring(0, 200))
    }
    
    // 分割 HTML，插入代码块
    if (blocks.length === 0) {
      // 没有代码块，直接返回 HTML
      parts.push({ type: 'text', html })
    } else {
      // 有代码块，需要分割和插入
      let remainingHtml = html
      
      blocks.forEach((block, index) => {
        const placeholderIndex = remainingHtml.indexOf(block.placeholder)
        
        console.log(`[MarkdownRenderer] 查找占位符 "${block.placeholder}":`, placeholderIndex !== -1 ? '找到' : '未找到')
        
        if (placeholderIndex !== -1) {
          // 添加占位符之前的文本
          const beforeText = remainingHtml.substring(0, placeholderIndex)
          if (beforeText.trim()) {
            parts.push({ type: 'text', html: beforeText })
          }
          
          // 添加代码块
          parts.push({
            type: 'code',
            code: block.code,
            language: block.language
          })
          console.log(`[MarkdownRenderer] 添加代码块 #${index}:`, block.language, `(${block.code.length} 字符)`)
          
          // 更新剩余 HTML
          remainingHtml = remainingHtml.substring(placeholderIndex + block.placeholder.length)
        } else {
          console.warn(`[MarkdownRenderer] ⚠️ 占位符未找到:`, block.placeholder)
          console.warn('[MarkdownRenderer] 当前 HTML:', remainingHtml.substring(0, 100))
        }
      })
      
      // 添加最后剩余的文本
      if (remainingHtml.trim()) {
        parts.push({ type: 'text', html: remainingHtml })
      }
    }
    
    return parts
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return [{ 
      type: 'text', 
      html: String(props.content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }]
  }
})
</script>

<style scoped>
/* Markdown 渲染器容器 - 确保可以选择文本 */
.markdown-renderer {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  cursor: text;
}

.markdown-renderer * {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* Markdown 内容样式 */
.markdown-text {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.markdown-text :deep(p) {
  margin: 0.5em 0;
}

.markdown-text :deep(ul),
.markdown-text :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.markdown-text :deep(li) {
  margin: 0.25em 0;
}

.markdown-text :deep(blockquote) {
  border-left: 3px solid var(--vscode-textBlockQuote-border, #007acc);
  padding-left: 1em;
  margin: 0.5em 0;
  color: var(--vscode-textBlockQuote-foreground);
}

.markdown-text :deep(a) {
  color: var(--vscode-textLink-foreground, #3794ff);
  text-decoration: none;
}

.markdown-text :deep(a:hover) {
  text-decoration: underline;
}

.markdown-text :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}

.markdown-text :deep(th),
.markdown-text :deep(td) {
  border: 1px solid var(--vscode-panel-border);
  padding: 0.5em;
  text-align: left;
}

.markdown-text :deep(th) {
  background: var(--vscode-editorWidget-background);
  font-weight: 600;
}

.markdown-text :deep(code) {
  background: var(--vscode-textCodeBlock-background);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-text :deep(pre) {
  background: var(--vscode-textCodeBlock-background);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.markdown-text :deep(pre code) {
  background: transparent;
  padding: 0;
}

.markdown-text :deep(h1),
.markdown-text :deep(h2),
.markdown-text :deep(h3),
.markdown-text :deep(h4),
.markdown-text :deep(h5),
.markdown-text :deep(h6) {
  margin: 1em 0 0.5em 0;
  font-weight: 600;
}

.markdown-text :deep(h1) {
  font-size: 1.5em;
  border-bottom: 1px solid var(--vscode-panel-border);
  padding-bottom: 0.3em;
}

.markdown-text :deep(h2) {
  font-size: 1.3em;
  border-bottom: 1px solid var(--vscode-panel-border);
  padding-bottom: 0.3em;
}

.markdown-text :deep(h3) {
  font-size: 1.1em;
}
</style>

