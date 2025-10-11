<template>
  <div class="ai-chat-session" :class="{ 'generating': isGenerating }">
    <!-- 消息列表 -->
    <div 
      ref="messagesContainer" 
      class="messages-area"
      :style="{ maxHeight: maxHeight || 'calc(100vh - 200px)' }"
    >
      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-chat-dots"></i>
        </div>
        <div class="empty-text">{{ emptyStateText }}</div>
        <div v-if="emptyStateSubtext" class="empty-subtext">{{ emptyStateSubtext }}</div>
      </div>

      <!-- 消息列表 -->
      <div v-else class="messages-list">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message-row"
          :class="[
            `message-${message.role}`,
            { 'message-streaming': message.streaming },
            { 'message-has-tool': message.toolUse }
          ]"
        >
          <div class="message-container">
            <!-- 消息头部（图标 + 角色） -->
            <div class="message-header">
              <div class="message-icon">
                <i v-if="message.role === 'user'" class="bi bi-person-circle"></i>
                <i v-else-if="message.role === 'assistant'" class="bi bi-robot"></i>
                <i v-else class="bi bi-info-circle"></i>
              </div>
              <div class="message-role">
                {{ message.role === 'user' ? '你' : (message.role === 'assistant' ? 'AI 助手' : '系统') }}
              </div>
              <div v-if="message.role === 'assistant'" class="message-timestamp">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>

            <!-- 消息内容 -->
            <div class="message-body">
              <!-- 普通文本消息 -->
              <div 
                v-if="!message.toolUse && message.content" 
                class="message-content"
                v-html="renderMarkdown(getMessageContentWithoutTodo(message))"
              ></div>

              <!-- 工具调用 -->
              <div v-if="message.toolUse" class="tool-use-block">
                <div class="tool-header">
                  <div class="tool-icon">
                    <i v-if="message.toolUse.name === 'execute_ssh_command'" class="bi bi-terminal"></i>
                    <i v-else-if="message.toolUse.name === 'read_file'" class="bi bi-file-text"></i>
                    <i v-else-if="message.toolUse.name === 'list_files'" class="bi bi-folder"></i>
                    <i v-else class="bi bi-tools"></i>
                  </div>
                  <div class="tool-title">
                    {{ getToolTitle(message.toolUse.name) }}
                  </div>
                </div>

                <!-- 工具参数 -->
                <div class="tool-params">
                  <div v-for="(value, key) in message.toolUse.params" :key="key" class="tool-param">
                    <code class="param-value">{{ value }}</code>
                  </div>
                </div>

                <!-- 权限确认（待批准状态） -->
                <div v-if="message.toolApprovalPending" class="tool-approval">
                  <div class="approval-message">
                    <i class="bi bi-shield-check"></i>
                    <span>此操作需要您的确认</span>
                  </div>
                  <div class="approval-buttons">
                    <button 
                      class="approval-btn approve-btn" 
                      @click="handleInlineApproval(message.id, true)"
                    >
                      <i class="bi bi-check-circle"></i>
                      同意
                    </button>
                    <button 
                      class="approval-btn reject-btn" 
                      @click="handleInlineApproval(message.id, false)"
                    >
                      <i class="bi bi-x-circle"></i>
                      拒绝
                    </button>
                  </div>
                </div>

                <!-- 工具执行结果 -->
                <div v-if="message.toolResult && message.toolUse?.name !== 'attempt_completion'" class="tool-result">
                  <div 
                    class="tool-result-status" 
                    :class="{ 'success': message.toolResult.success, 'error': !message.toolResult.success }"
                  >
                    <i v-if="message.toolResult.success" class="bi bi-check-circle"></i>
                    <i v-else class="bi bi-x-circle"></i>
                    <span>{{ message.toolResult.success ? '执行成功' : '执行失败' }}</span>
                  </div>

                  <!-- 成功输出 -->
                  <div v-if="message.toolResult.success && message.toolResult.content" class="tool-output">
                    <pre><code>{{ extractCommandOutput(message.toolResult.content) }}</code></pre>
                  </div>

                  <!-- 错误信息 -->
                  <div v-if="!message.toolResult.success && message.toolResult.error" class="tool-error">
                    <span>{{ message.toolResult.error }}</span>
                  </div>
                </div>
              </div>

              <!-- 加载指示器 -->
              <div v-if="message.streaming" class="message-loading">
                <div class="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 工具执行进度 -->
      <div v-if="toolExecutionProgress" class="tool-progress">
        <div class="progress-spinner">
          <i class="bi bi-arrow-repeat spin"></i>
        </div>
        <span>{{ toolExecutionProgress }}</span>
      </div>
    </div>

    <!-- Todo List 显示 -->
    <TodoListDisplay 
      v-if="todoList.length > 0" 
      :todos="todoList"
      @clear="handleClearTodoList"
    />

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-container">
        <!-- 输入框 -->
        <textarea
          ref="textareaRef"
          v-model="inputMessage"
          class="message-input"
          :placeholder="currentPlaceholder"
          :rows="inputRows"
          :disabled="isGenerating"
          @keydown="handleKeyDown"
        ></textarea>

        <!-- 底部控制栏：模式选择 + 按钮组 -->
        <div class="input-controls">
          <!-- 左侧控制组 -->
          <div class="left-controls">
            <!-- 模式选择下拉框 -->
            <div class="select-wrapper">
              <select v-model="chatMode" class="mode-select">
                <option value="agent">🤖 Agent</option>
                <option value="ask">💬 Ask</option>
              </select>
              <i class="bi bi-chevron-down select-icon"></i>
            </div>

            <!-- 清空会话按钮 -->
            <button
              v-if="messages.length > 0"
              class="icon-button clear-session-icon"
              title="清空会话"
              @click="handleClearSession"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <!-- 右侧按钮组 -->
          <div class="action-buttons">
            <!-- 发送/停止按钮 -->
            <button
              class="control-button send-button"
              :class="{ 'is-generating': isGenerating, 'has-content': inputMessage.trim() }"
              :disabled="!inputMessage.trim() && !isGenerating"
              :title="isGenerating ? '停止生成 (Ctrl+C)' : '发送消息 (Ctrl+Enter)'"
              @click="isGenerating ? handleStopGeneration() : handleSendMessage()"
            >
              <i v-if="!isGenerating" class="bi bi-send-fill"></i>
              <i v-else class="bi bi-stop-circle-fill"></i>
              <span v-if="!isGenerating">发送</span>
              <span v-else>停止</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css'

import type { AIProvider, AIModel } from '@/types/ai-providers'
import { chatCompletion, type ChatMessage as APIChatMessage } from '@/services/ai-api.service'
import { generateSystemPrompt } from '@/services/tools/system-prompt'
import { parseToolUse, executeTool } from '@/services/tools/tool-executor'
import type { ToolResult } from '@/types/tools'
import { settingsService } from '@/services/settings.service'
import TodoListDisplay from './TodoListDisplay.vue'

// Props
interface Props {
  currentProvider: AIProvider | null
  currentModel: AIModel | null
  connectionId?: string
  serverInfo?: {
    host: string
    username: string
  }
  enableTools?: boolean
  multiline?: boolean
  inputRows?: number
  inputPlaceholder?: string
  emptyStateText?: string
  emptyStateSubtext?: string
  maxHeight?: string
  showAttachButton?: boolean
  showStatusInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableTools: true,
  multiline: false,
  inputRows: 2,
  inputPlaceholder: '输入消息...',
  emptyStateText: '开始与 AI 助手对话',
  maxHeight: '',
  showAttachButton: true,
  showStatusInfo: true
})

// Emits
const emit = defineEmits<{
  'tool-executed': [toolName: string, result: ToolResult]
  'session-cleared': []
}>()

// Todo 类型定义
interface TodoItem {
  id: string
  content: string
  status: 'pending' | 'in_progress' | 'completed'
}

// 消息类型定义
interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  streaming?: boolean
  toolUse?: {
    name: string
    params: Record<string, any>
  }
  toolResult?: ToolResult
  toolApprovalPending?: boolean
}

// 工具批准请求
interface ToolApprovalRequest {
  tool: string
  params: Record<string, any>
  description: string
  timestamp: number
}

interface ToolApprovalResponse {
  approved: boolean
  feedback?: string
}

// 响应式数据
const inputMessage = ref('')
const isGenerating = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const internalMessages = ref<Message[]>([])

// 聊天模式：agent (可执行工具) 或 ask (只回答问题)
const chatMode = ref<'agent' | 'ask'>('agent')

// Todo List 状态
// 自动从 AI 响应中提取 Markdown checklist 格式的任务列表
// 支持格式: [ ] pending, [-] in_progress, [x] completed
const todoList = ref<TodoItem[]>([])

// Markdown Checklist 解析函数
const parseMarkdownChecklist = (markdown: string): TodoItem[] => {
  if (typeof markdown !== 'string') return []
  
  const lines = markdown
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
  
  const todos: TodoItem[] = []
  
  for (const line of lines) {
    // 支持两种格式: "[ ] Task" 和 "- [ ] Task"
    const match = line.match(/^(?:-\s*)?\[\s*([ xX\-~])\s*\]\s+(.+)$/)
    if (!match) continue
    
    let status: 'pending' | 'in_progress' | 'completed' = 'pending'
    if (match[1] === 'x' || match[1] === 'X') {
      status = 'completed'
    } else if (match[1] === '-' || match[1] === '~') {
      status = 'in_progress'
    }
    
    // 使用内容 + 状态生成简单的 ID
    const id = `todo-${todos.length}-${Date.now()}`
    
    todos.push({
      id,
      content: match[2],
      status
    })
  }
  
  return todos
}

// 从 AI 响应中提取 Todo List
const extractTodoListFromMessage = (content: string): TodoItem[] | null => {
  // 检测常见的 todo list 模式
  const patterns = [
    // 匹配类似 "Todo:" 或 "TODO:" 或 "任务列表:" 后面的清单
    /(?:todo|TODO|Todo|任务列表|Task List)[:\s]*\n((?:(?:-\s*)?\[[\sxX\-~]\].+\n?)+)/i,
    // 匹配独立的清单块（连续的 checkbox）
    /((?:^|\n)(?:-\s*)?\[[\sxX\-~]\].+(?:\n(?:-\s*)?\[[\sxX\-~]\].+)*)/m
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      const checklistText = match[1] || match[0]
      const todos = parseMarkdownChecklist(checklistText)
      if (todos.length > 0) {
        return todos
      }
    }
  }
  
  return null
}

/**
 * 从消息内容中移除 Todo List 部分
 * 这样可以避免 Todo List 在消息和独立面板中重复显示
 */
const removeTodoListFromMessage = (content: string): string => {
  // 移除 "Todo:" 或 "TODO:" 等标题及其后面的清单
  const pattern1 = /(?:todo|TODO|Todo|任务列表|Task List)[:\s]*\n(?:(?:-\s*)?\[[\sxX\-~]\].+\n?)+/gi
  let result = content.replace(pattern1, '')
  
  // 移除独立的清单块（连续的 checkbox 行）
  const pattern2 = /(?:^|\n)(?:-\s*)?\[[\sxX\-~]\].+(?:\n(?:-\s*)?\[[\sxX\-~]\].+)*/gm
  result = result.replace(pattern2, '')
  
  // 清理多余的空行（超过2个连续换行）
  result = result.replace(/\n{3,}/g, '\n\n')
  
  return result.trim()
}

/**
 * 获取消息内容（如果有 Todo List 且已提取，则移除 Todo List 部分）
 */
const getMessageContentWithoutTodo = (message: Message): string => {
  // 只对 assistant 的消息处理
  if (message.role !== 'assistant') {
    return message.content
  }
  
  // 如果当前有活跃的 todoList，并且消息中包含 Todo List，则移除它
  if (todoList.value.length > 0) {
    const hasTodoList = extractTodoListFromMessage(message.content)
    if (hasTodoList && hasTodoList.length > 0) {
      return removeTodoListFromMessage(message.content)
    }
  }
  
  return message.content
}

// 工具相关状态
const pendingToolResolve = ref<((response: ToolApprovalResponse) => void) | null>(null)
const pendingToolMessageId = ref<number | null>(null)
const toolExecutionProgress = ref('')

// AI 助手设置
const aiSettings = ref({
  autoApproveReadOnly: true,
  commandRiskLevel: 2, // 命令风险等级：0-5
  enableChatHistory: true,
  maxHistoryMessages: 50
})

// 停止生成控制
const abortController = ref<AbortController | null>(null)

/**
 * 评估命令风险等级
 * @param command SSH命令
 * @returns 风险等级 1-5
 */
const assessCommandRisk = (command: string): number => {
  if (!command) return 5 // 空命令视为高风险
  
  const cmd = command.trim().toLowerCase()
  
  // 等级5: 系统级操作（最高风险）
  const level5Patterns = [
    /^sudo\s/,           // sudo 命令
    /^su\s/,             // 切换用户
    /\bsudo\b/,          // 包含 sudo
    /^systemctl/,        // 系统服务
    /^service\s/,        // 服务管理
    /^reboot/,           // 重启
    /^shutdown/,         // 关机
    /^halt/,             // 停机
    /^init\s/,           // 初始化级别
    /^kill\s+-9/,        // 强制杀进程
    /^pkill\s+-9/,       // 强制批量杀进程
    /^dd\s/,             // 磁盘操作
    /^fdisk/,            // 分区操作
    /^mkfs/,             // 格式化
    /^mount/,            // 挂载
    /^umount/,           // 卸载
    /^iptables/,         // 防火墙
    /^firewall/,         // 防火墙
    /^useradd/,          // 添加用户
    /^userdel/,          // 删除用户
    /^passwd/,           // 修改密码
  ]
  
  for (const pattern of level5Patterns) {
    if (pattern.test(cmd)) return 5
  }
  
  // 等级4: 删除/修改操作（高风险）
  const level4Patterns = [
    /^rm\s/,             // 删除文件
    /\brm\s+-rf?\b/,     // 递归删除
    /^rmdir/,            // 删除目录
    /^chmod/,            // 修改权限
    /^chown/,            // 修改所有者
    /^chgrp/,            // 修改组
    /sed\s+-i/,          // 原地修改文件
    /^truncate/,         // 截断文件
    />>/,                // 追加重定向
    />/,                 // 覆盖重定向
    /^kill\s/,           // 杀进程
    /^pkill/,            // 批量杀进程
    /^killall/,          // 杀所有进程
  ]
  
  for (const pattern of level4Patterns) {
    if (pattern.test(cmd)) return 4
  }
  
  // 等级3: 文件操作（中等风险）
  const level3Patterns = [
    /^mkdir/,            // 创建目录
    /^touch/,            // 创建文件
    /^cp\s/,             // 复制
    /^mv\s/,             // 移动/重命名
    /^ln\s/,             // 创建链接
    /^tar\s/,            // 压缩解压
    /^zip/,              // 压缩
    /^unzip/,            // 解压
    /^gzip/,             // 压缩
    /^gunzip/,           // 解压
    /^wget/,             // 下载
    /^curl\s+-o/,        // 下载到文件
    /^scp\s/,            // 远程复制
    /^rsync/,            // 同步
    /^git\s+clone/,      // 克隆仓库
    /^git\s+pull/,       // 拉取更新
    /^npm\s+install/,    // 安装包
    /^apt\s+install/,    // 安装包
    /^yum\s+install/,    // 安装包
  ]
  
  for (const pattern of level3Patterns) {
    if (pattern.test(cmd)) return 3
  }
  
  // 等级2: 查看系统状态（低风险）
  const level2Patterns = [
    /^ps\s/,             // 进程列表
    /^top/,              // 实时进程
    /^htop/,             // 增强top
    /^df\s/,             // 磁盘使用
    /^du\s/,             // 目录大小
    /^free/,             // 内存使用
    /^uptime/,           // 运行时间
    /^who/,              // 在线用户
    /^w\s/,              // 用户活动
    /^netstat/,          // 网络状态
    /^ss\s/,             // socket状态
    /^lsof/,             // 打开文件
    /^uname/,            // 系统信息
    /^hostname/,         // 主机名
    /^ifconfig/,         // 网络配置
    /^ip\s+addr/,        // IP地址
    /^route/,            // 路由表
    /^ping\s/,           // 网络测试
    /^traceroute/,       // 路由跟踪
    /^history/,          // 命令历史
    /^env/,              // 环境变量
    /^printenv/,         // 打印环境变量
    /^date/,             // 日期时间
    /^cal/,              // 日历
    /^which/,            // 查找命令
    /^whereis/,          // 查找文件
    /^locate/,           // 定位文件
  ]
  
  for (const pattern of level2Patterns) {
    if (pattern.test(cmd)) return 2
  }
  
  // 等级1: 只读命令（最低风险）
  const level1Patterns = [
    /^ls\s/,             // 列出文件
    /^ls$/,              // ls 单独命令
    /^ll\s/,             // ls -l 别名
    /^ll$/,              // ll 单独命令
    /^pwd/,              // 当前目录
    /^cd\s/,             // 切换目录
    /^cat\s/,            // 查看文件
    /^less\s/,           // 分页查看
    /^more\s/,           // 分页查看
    /^head\s/,           // 查看开头
    /^tail\s/,           // 查看结尾
    /^grep\s/,           // 搜索
    /^find\s/,           // 查找文件
    /^wc\s/,             // 统计
    /^diff\s/,           // 比较文件
    /^echo\s/,           // 输出
    /^printf\s/,         // 格式化输出
    /^stat\s/,           // 文件状态
    /^file\s/,           // 文件类型
    /^tree/,             // 目录树
    /^realpath/,         // 真实路径
    /^basename/,         // 基本名
    /^dirname/,          // 目录名
    /^type\s/,           // 命令类型
  ]
  
  for (const pattern of level1Patterns) {
    if (pattern.test(cmd)) return 1
  }
  
  // 默认返回中等风险
  return 3
}

// 计算属性
const messages = computed(() => internalMessages.value)

// 根据模式动态调整占位符
const currentPlaceholder = computed(() => {
  if (chatMode.value === 'agent') {
    return props.inputPlaceholder || '描述你的任务，AI 会主动执行操作...'
  } else {
    return '提出你的问题，AI 会进行回答...'
  }
})

// Markdown 渲染配置
const renderer: any = new marked.Renderer()
renderer.code = (code: any) => {
  const codeStr = String(code.text || code || '')
  const langStr = String(code.lang || '')
  
  const validLanguage = hljs.getLanguage(langStr) ? langStr : 'plaintext'
  const highlighted = hljs.highlight(codeStr, { language: validLanguage }).value
  return `<pre class="code-block"><code class="language-${validLanguage}">${highlighted}</code></pre>`
}

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

// 方法
const renderMarkdown = (content: string): string => {
  try {
    const contentStr = String(content || '')
    if (!contentStr.trim()) {
      return contentStr
    }
    const result: any = marked(contentStr)
    return result ? String(result) : ''
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return String(content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getToolTitle = (toolName: string): string => {
  const titles: Record<string, string> = {
    'execute_ssh_command': 'SSH 命令执行',
    'read_file': '读取文件',
    'list_files': '列出文件',
    'ask_followup_question': '询问问题',
    'attempt_completion': '完成任务'
  }
  return titles[toolName] || toolName
}

const extractCommandOutput = (content: string): string => {
  // 尝试匹配 command_result 标签
  let match = content.match(/<command_result>([\s\S]*?)<\/command_result>/)
  if (match) {
    return match[1].trim()
  }
  
  // 尝试匹配 completion_result 标签
  match = content.match(/<completion_result>([\s\S]*?)<\/completion_result>/)
  if (match) {
    return match[1].trim()
  }
  
  // 如果都没有匹配，返回原始内容
  return content
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

/**
 * 请求工具批准
 */
const requestToolApproval = (toolName: string, params: any, description: string, messageId: number): Promise<ToolApprovalResponse> => {
  return new Promise((resolve) => {
    // 找到对应的消息并设置待批准状态
    const message = internalMessages.value.find(m => m.id === messageId)
    if (message) {
      message.toolApprovalPending = true
      // 强制触发响应式更新
      internalMessages.value = [...internalMessages.value]
      pendingToolMessageId.value = messageId
      pendingToolResolve.value = resolve
      
      nextTick(() => {
        scrollToBottom()
      })
    } else {
      console.error('[Chat] 未找到消息:', messageId)
      resolve({ approved: false })
    }
  })
}

/**
 * 处理内联批准/拒绝
 */
const handleInlineApproval = (messageId: number, approved: boolean) => {
  // 找到对应的消息并清除待批准状态
  const message = internalMessages.value.find(m => m.id === messageId)
  if (message) {
    message.toolApprovalPending = false
    // 强制触发响应式更新
    internalMessages.value = [...internalMessages.value]
  }
  
  if (pendingToolResolve.value) {
    pendingToolResolve.value({ approved })
    pendingToolResolve.value = null
    pendingToolMessageId.value = null
  }
}

/**
 * 执行工具调用
 */
const executeToolCall = async (toolName: string, params: any, messageId: number): Promise<ToolResult> => {
  // 定义无需确认的工具列表
  const alwaysAutoApproveTools = [
    'attempt_completion',     // 任务完成
    'ask_followup_question'   // 询问问题
  ]
  
  // 定义只读工具列表
  const readOnlyTools = [
    'read_file',              // 读取文件
    'list_files'              // 列出文件
  ]

  let approval: ToolApprovalResponse = { approved: true }

  // 判断是否需要确认
  let needsApproval = !alwaysAutoApproveTools.includes(toolName) && 
                      !(aiSettings.value.autoApproveReadOnly && readOnlyTools.includes(toolName))
  
  // 针对 execute_ssh_command，使用风险等级判断
  if (toolName === 'execute_ssh_command' && params.command) {
    const commandRisk = assessCommandRisk(params.command)
    
    // 如果命令风险等级 <= 设置的自动执行等级，则自动批准
    if (commandRisk <= aiSettings.value.commandRiskLevel) {
      needsApproval = false
    } else {
      needsApproval = true
    }
  }

  // 只有需要确认的工具才请求批准
  if (needsApproval) {
    // 生成描述
    let description = `AI 助手请求执行工具: ${toolName}`
    if (toolName === 'execute_ssh_command') {
      const commandRisk = assessCommandRisk(params.command)
      const riskLabels = ['', '✅ 只读', '✅ 查看', '⚠️ 操作', '⚠️ 删除', '⛔ 系统']
      const riskLabel = riskLabels[commandRisk] || '❓ 未知'
      description = `AI 助手请求执行 SSH 命令 [风险等级${commandRisk}: ${riskLabel}]:\n${params.command}`
    }

    // 请求用户批准
    approval = await requestToolApproval(toolName, params, description, messageId)

    if (!approval.approved) {
      return {
        success: false,
        content: '',
        error: '用户拒绝执行此工具'
      }
    }

    // 如果用户提供了反馈，修改参数
    if (approval.feedback) {
      if (toolName === 'execute_ssh_command') {
        params.command = `${params.command} # ${approval.feedback}`
      }
    }
  }

  // 执行工具
  if (!props.connectionId && toolName !== 'ask_followup_question' && toolName !== 'attempt_completion') {
    console.error('[Chat] ❌ 未建立 SSH 连接')
    return {
      success: false,
      content: '',
      error: '未建立 SSH 连接'
    }
  }

  const result = await executeTool(
    toolName,
    params,
    props.connectionId || '',
    (progress) => {
      toolExecutionProgress.value = progress
    }
  )

  toolExecutionProgress.value = ''

  // 发出工具执行事件
  emit('tool-executed', toolName, result)

  return result
}

const handleSendMessage = async () => {
  if (!inputMessage.value.trim() || isGenerating.value) {
    return
  }
  
  const content = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 直接调用 sendMessageInternal 处理消息
  await sendMessageInternal(content)
}

const sendMessageInternal = async (content: string, hideUserMessage = false) => {
  if (!props.currentProvider || !props.currentModel) {
    const tipMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: '请先选择一个 AI 模型，然后再开始对话。',
      timestamp: new Date()
    }
    internalMessages.value.push(tipMessage)
    scrollToBottom()
    return
  }
  
  // 添加用户消息（除非是隐藏的系统消息）
  if (!hideUserMessage) {
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    internalMessages.value.push(userMessage)
    scrollToBottom()
  }
  
  // 准备 AI 响应消息
  const assistantMessage: Message = {
    id: Date.now() + 1,
    role: 'assistant',
    content: '',
    timestamp: new Date(),
    streaming: true
  }
  internalMessages.value.push(assistantMessage)
  scrollToBottom()
  
  isGenerating.value = true
  
  try {
    // 准备 API 消息格式
    const apiMessages: APIChatMessage[] = []

    // 添加系统提示词（根据模式决定）
    if (props.enableTools && chatMode.value === 'agent') {
      const systemPrompt = generateSystemPrompt({
        enableSSH: true,
        enableFileOps: true,
        serverInfo: props.serverInfo
      })
      
      apiMessages.push({
        role: 'system',
        content: systemPrompt
      })
    } else if (chatMode.value === 'ask') {
      apiMessages.push({
        role: 'system',
        content: '你是一个乐于助人的 AI 助手。请专注于回答用户的问题，提供清晰准确的信息和建议。不要尝试执行任何工具或命令。'
      })
    }

    // 添加历史消息
    // 获取历史消息
    let historyMessages = internalMessages.value
      .filter(msg => !msg.streaming && msg.role !== 'system')
    
    // 如果启用了历史记录限制，只保留最近的消息
    if (aiSettings.value.enableChatHistory && aiSettings.value.maxHistoryMessages > 0) {
      const maxMessages = aiSettings.value.maxHistoryMessages
      if (historyMessages.length > maxMessages) {
        historyMessages = historyMessages.slice(-maxMessages)
      }
    }
    
    historyMessages.forEach(msg => {
      apiMessages.push({
        role: msg.role,
        content: msg.content
      })

      // 如果有工具结果，添加为独立消息
      if (msg.toolResult) {
        apiMessages.push({
          role: 'user',
          content: `Tool execution result:\n${msg.toolResult.content}`
        })
      }
    })
    
    // 添加当前用户消息
    apiMessages.push({
      role: 'user',
      content
    })
    
    // 使用 settingsService 获取 API 密钥配置（自动处理 userId）
    const settings = await settingsService.getSettings()
    const configs = settings?.aiProviders || []
    const providerConfig = configs.find((p: any) => p.id === props.currentProvider?.id)
    
    if (!providerConfig?.apiKey) {
      console.error('[Chat] ❌ 未找到 API 密钥配置')
      throw new Error('未找到 API 密钥配置')
    }
    
    const providerWithApiKey = {
      ...props.currentProvider,
      apiKey: providerConfig.apiKey
    }
    
    // 调用 AI API
    
    // 创建 AbortController 用于取消请求
    abortController.value = new AbortController()
    
    const response = await chatCompletion(
      providerWithApiKey,
      props.currentModel,
      {
        messages: apiMessages,
        stream: true,
        signal: abortController.value.signal
      },
      (chunk) => {
        assistantMessage.content += chunk.content || ''
        
        // 在流式输出过程中实时检测并提取 Todo List
        // 这样可以避免 Todo 内容在 Markdown 渲染中"一闪而过"
        const extractedTodos = extractTodoListFromMessage(assistantMessage.content)
        if (extractedTodos && extractedTodos.length > 0) {
          // 实时更新 todoList，让 Todo 内容从消息中分离出来
          if (todoList.value.length === 0 || extractedTodos.length !== todoList.value.length) {
            todoList.value = extractedTodos
          } else {
            // 任务数量相同，更新状态
            todoList.value = extractedTodos
          }
        }
        
        internalMessages.value = [...internalMessages.value]
        scrollToBottom()
      }
    )
    
    // 完成流式输出
    assistantMessage.streaming = false
    assistantMessage.content = response.content

    // 最终再次检测并更新 Todo List（确保完整性）
    const extractedTodos = extractTodoListFromMessage(response.content)
    if (extractedTodos && extractedTodos.length > 0) {
      // 如果当前没有 todo list，或者新的 todo list 任务数量不同，则更新
      // 这样可以保留已有的 todo list，避免被后续无 todo 的响应清空
      if (todoList.value.length === 0 || extractedTodos.length !== todoList.value.length) {
        console.log('[Chat] 🔄 检测到 Todo List，共', extractedTodos.length, '个任务')
        console.log('[Chat] 📋 任务列表:', extractedTodos.map(t => `${t.status}: ${t.content}`).join(', '))
        todoList.value = extractedTodos
      } else {
        // 任务数量相同，更新状态（支持任务状态更新）
        console.log('[Chat] 🔄 更新 Todo List 状态')
        todoList.value = extractedTodos
      }
    }
    // 注意：如果没有检测到 todo list，不清空现有的列表

    // 检查是否包含工具调用
    if (props.enableTools) {
      const toolUse = parseToolUse(assistantMessage.content)
      
      if (toolUse) {
        // 保存工具调用信息
        assistantMessage.toolUse = {
          name: toolUse.toolName,
          params: toolUse.params
        }

        // 执行工具
        try {
          const toolResult = await executeToolCall(toolUse.toolName, toolUse.params, assistantMessage.id)
          assistantMessage.toolResult = toolResult

          // 如果工具执行成功，继续对话让 AI 处理结果
          if (toolResult.success && toolUse.toolName !== 'attempt_completion') {
            scrollToBottom()

            // 递归调用以处理工具结果（隐藏系统消息）
            await sendMessageInternal('Please analyze the tool execution result and continue.', true)
            return
          }
        } catch (error: any) {
          console.error('[Chat] 工具执行异常:', error)
          assistantMessage.toolResult = {
            success: false,
            content: '',
            error: error.message
          }
        }
      }
    }

    scrollToBottom()
    
  } catch (error: any) {
    console.error('AI 响应错误:', error)
    assistantMessage.streaming = false
    
    // 检查是否为用户取消
    if (error.name === 'AbortError') {
      assistantMessage.content = '已停止生成'
    } else {
      assistantMessage.content = `抱歉，发生了错误：${error.message}`
    }
    scrollToBottom()
  } finally {
    isGenerating.value = false
    abortController.value = null
  }
}

// 停止生成
const handleStopGeneration = () => {
  if (abortController.value) {
    abortController.value.abort()
  }
}

// 清空输入
const handleClearInput = () => {
  inputMessage.value = ''
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    handleSendMessage()
  }
}

// 加载 AI 助手设置
const loadAISettings = async () => {
  try {
    const settings = await settingsService.getSettings()
    
    if (settings) {
      // ✅ 从正确的嵌套路径读取（settings.aiAssistant.*）
      const aiAssistant = settings.aiAssistant || {}
      
      aiSettings.value = {
        autoApproveReadOnly: aiAssistant.autoApproveReadOnly !== undefined ? aiAssistant.autoApproveReadOnly : true,
        commandRiskLevel: aiAssistant.commandRiskLevel !== undefined ? aiAssistant.commandRiskLevel : 2,
        enableChatHistory: aiAssistant.enableChatHistory !== undefined ? aiAssistant.enableChatHistory : true,
        maxHistoryMessages: aiAssistant.maxHistoryMessages || 50
      }
      
      console.log('[Chat] AI 助手设置已加载，风险等级阈值:', aiSettings.value.commandRiskLevel)
    }
  } catch (error) {
    console.error('[Chat] 加载 AI 助手设置失败:', error)
  }
}

// 事件处理器
const handleStorageChange = () => {
  loadAISettings()
}

const handleSettingsUpdate = () => {
  loadAISettings()
}

// 清除 Todo List
const handleClearTodoList = () => {
  console.log('[Chat] 🗑️ 用户清除 Todo List')
  todoList.value = []
}

/**
 * 清空会话
 */
const handleClearSession = () => {
  // 确认对话框
  if (internalMessages.value.length > 0) {
    const confirmed = confirm('确定要清空当前会话吗？此操作不可恢复。')
    if (!confirmed) {
      return
    }
  }
  
  console.log('[Chat] 🗑️ 清空会话')
  
  // 清空消息列表
  internalMessages.value = []
  
  // 清空 Todo List
  todoList.value = []
  
  // 清空输入框
  inputMessage.value = ''
  
  // 如果正在生成，停止生成
  if (isGenerating.value) {
    handleStopGeneration()
  }
  
  // 发出清空事件（如果父组件需要知道）
  emit('session-cleared')
}

// 监听 props 变化
watch(() => [props.currentProvider, props.currentModel], ([newProvider, newModel]) => {
  // 模型变化时可以在这里处理
}, { deep: true })

// 监听 connectionId 变化
watch(() => props.connectionId, (newId, oldId) => {
  if (newId !== oldId) {
    console.log('[AIChatSessionWithTools] 🔄 连接ID已更新:', { oldId, newId })
  }
})

onMounted(() => {
  
  loadAISettings()
  scrollToBottom()
  
  // 监听设置变化
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('settings-updated', handleSettingsUpdate)
})

onBeforeUnmount(() => {
  // 清理事件监听
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('settings-updated', handleSettingsUpdate)
})
</script>

<style scoped>
.ai-chat-session {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 188px);
  max-height: 100%;
  background: var(--vscode-editor-background);
  color: var(--vscode-foreground);
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 6px 10px;
  user-select: text;
}

.messages-area::-webkit-scrollbar {
  width: 10px;
}

.messages-area::-webkit-scrollbar-track {
  background: var(--vscode-scrollbarSlider-background);
}

.messages-area::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-hoverBackground);
  border-radius: 5px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  opacity: 0.6;
}

.empty-icon {
  font-size: 64px;
  color: var(--vscode-descriptionForeground);
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
}

.empty-subtext {
  font-size: 14px;
  color: var(--vscode-descriptionForeground);
}

/* 消息列表 */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-row {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  user-select: text;
}

/* 用户消息背景（使用主题色） */
.message-user .message-container {
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.08);
  border-left: 3px solid var(--vscode-accent);
  border-radius: 6px;
  padding: 8px 10px;
  margin-left: 0;
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 2px;
}

.message-icon {
  font-size: 18px;
  color: var(--vscode-foreground);
}

.message-user .message-icon {
  color: var(--vscode-charts-blue);
}

.message-assistant .message-icon {
  color: var(--vscode-charts-green);
}

.message-role {
  font-weight: 600;
  font-size: 14px;
}

.message-timestamp {
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
  margin-left: auto;
}

/* 消息体 */
.message-body {
  padding-left: 12px;
  user-select: text;
  cursor: text;
}

.message-content {
  line-height: 1.6;
  word-wrap: break-word;
  user-select: text;
}

.message-content :deep(p) {
  margin: 4px 0;
}

.message-content :deep(code) {
  background: var(--vscode-textCodeBlock-background);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  user-select: text;
}

.message-content :deep(pre) {
  margin: 6px 0;
  user-select: text;
}

.message-content :deep(.code-block) {
  background: var(--vscode-textCodeBlock-background);
  border: 1px solid var(--vscode-editorGroup-border);
  border-radius: 4px;
  padding: 8px 10px;
  overflow-x: auto;
  user-select: text;
}

.message-content :deep(.code-block code) {
  background: none;
  padding: 0;
  font-size: 13px;
  line-height: 1.5;
  user-select: text;
}

/* 工具块 */
.tool-use-block {
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-editorGroup-border);
  border-radius: 6px;
  overflow: hidden;
  margin: 4px 0;
  user-select: text;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--vscode-editorGroupHeader-tabsBackground);
  border-bottom: 1px solid var(--vscode-editorGroup-border);
}

.tool-icon {
  font-size: 16px;
  color: var(--vscode-charts-purple);
}

.tool-title {
  font-weight: 600;
  font-size: 14px;
}

.tool-params {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tool-param {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.param-key {
  color: var(--vscode-descriptionForeground);
  font-weight: 500;
}

.param-value {
  background: var(--vscode-textCodeBlock-background);
  padding: 2px 8px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', monospace;
  flex: 1;
  user-select: text;
}

/* 工具权限确认 */
.tool-approval {
  border-top: 1px solid var(--vscode-editorGroup-border);
  padding: 10px;
  background: rgba(var(--vscode-accent-rgb, 0, 122, 204), 0.05);
}

.approval-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--vscode-foreground);
}

.approval-message i {
  font-size: 16px;
  color: var(--vscode-charts-orange);
}

.approval-buttons {
  display: flex;
  gap: 8px;
}

.approval-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.approve-btn {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.approve-btn:hover {
  background: var(--vscode-button-hoverBackground);
  transform: translateY(-1px);
}

.reject-btn {
  background: var(--vscode-editorGroupHeader-tabsBackground);
  color: var(--vscode-foreground);
  border: 1px solid var(--vscode-editorGroup-border);
}

.reject-btn:hover {
  background: var(--vscode-list-hoverBackground);
  transform: translateY(-1px);
}

.approval-btn i {
  font-size: 14px;
}

/* 工具结果 */
.tool-result {
  border-top: 1px solid var(--vscode-editorGroup-border);
}

.tool-result-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  font-weight: 500;
  font-size: 13px;
}

.tool-result-status.success {
  color: var(--vscode-charts-green);
  background: rgba(0, 255, 0, 0.05);
}

.tool-result-status.error {
  color: var(--vscode-errorForeground);
  background: rgba(255, 0, 0, 0.05);
}

.tool-output {
  padding: 8px 10px;
  border-top: 1px solid var(--vscode-editorGroup-border);
  user-select: text;
}

.tool-output pre {
  background: var(--vscode-textCodeBlock-background);
  padding: 8px 10px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
  user-select: text;
}

.tool-output code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
  user-select: text;
}

.tool-error {
  padding: 8px 10px;
  color: var(--vscode-errorForeground);
  font-size: 13px;
  user-select: text;
}

/* 加载指示器 */
.message-loading {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.loading-dots {
  display: flex;
  gap: 6px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: var(--vscode-charts-blue);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 工具进度 */
.tool-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--vscode-editorGroupHeader-tabsBackground);
  border-radius: 6px;
  margin-top: 16px;
  font-size: 13px;
  color: var(--vscode-charts-blue);
}

.progress-spinner i {
  font-size: 18px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 输入区域 */
.input-area {
  border-top: 1px solid var(--vscode-editorGroup-border);
  background: var(--vscode-editor-background);
  padding: 8px 12px 12px;
}

.input-area .input-container {
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  padding: 10px;
  background: var(--vscode-bg);
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 模式选择下拉框 */
.select-wrapper {
  position: relative;
  width: 100px;
}

.mode-select {
  width: 100%;
  padding-left: 5px;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  transition: all 0.2s;
}

.mode-select:hover {
  background: var(--vscode-bg);
  opacity: 0.9;
}

.mode-select:focus {
  border-color: var(--vscode-accent);
  box-shadow: 0 0 0 3px rgba(var(--vscode-accent-rgb), 0.1);
}

.mode-select option {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
  padding: 8px;
}

.select-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: var(--vscode-descriptionForeground);
  pointer-events: none;
}

/* 输入框样式 */
.message-input {
  width: 100%;
  max-height: 300px;
  padding: 10px 12px;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  border: 1px solid var(--vscode-input-border);
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.message-input:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
  box-shadow: 0 0 0 1px var(--vscode-focusBorder);
}

.message-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 底部控制栏：模式选择 + 按钮组 */
.input-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 12px;
}

/* 左侧控制组 */
.left-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 清空会话图标按钮 */
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.icon-button:hover {
  background: var(--vscode-error);
  border-color: var(--vscode-error);
  color: #ffffff;
}

.icon-button:active {
  transform: scale(0.95);
}

/* 右侧按钮组 */
.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.control-button i {
  font-size: 14px;
}

.control-button:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
  transform: translateY(-1px);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button.send-button.is-generating {
  background: var(--vscode-errorForeground);
}

.control-button.send-button.is-generating:hover:not(:disabled) {
  background: var(--vscode-errorForeground);
  opacity: 0.9;
}
</style>
