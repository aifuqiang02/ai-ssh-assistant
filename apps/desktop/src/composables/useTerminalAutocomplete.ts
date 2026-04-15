/**
 * 终端自动补全 Composable
 */
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue'
import type { Terminal } from '@xterm/xterm'
import { AutocompleteEngine } from '@/services/autocomplete/autocomplete-engine'
import { builtInSpecs } from '@/services/autocomplete/specs'
import type { Suggestion, CompletionContext } from '@/types/autocomplete'
import { envManager } from '@/services/autocomplete/env-manager'
import { historyManager } from '@/services/autocomplete/history-manager'
import { aliasManager } from '@/services/autocomplete/alias-manager'

interface AutocompletePosition {
  x: number
  y: number
}

export function useTerminalAutocomplete(
  terminal: Ref<Terminal | null>,
  terminalContainer: Ref<HTMLElement | null>,
  connectionId: Ref<string>
) {
  // 补全引擎
  const engine = new AutocompleteEngine({
    enabled: true,
    triggerDelay: 150,
    maxSuggestions: 50,
    fuzzyMatch: true,
    showDescriptions: true,
    showIcons: true
  })

  // 注册内置规范
  engine.registerSpecs(builtInSpecs)

  /**
   * 预加载数据
   * 在后台加载历史命令、别名和环境变量，加速后续补全
   */
  async function preloadData() {
    if (!connectionId.value) return

    try {
      // 并行加载
      await Promise.all([
        historyManager.getHistory(connectionId.value),
        aliasManager.getAliases(connectionId.value),
        envManager.getEnvVariables(connectionId.value)
      ])
    } catch (error) {
      // 预加载数据失败
    }
  }

  // 状态
  const suggestions = ref<Suggestion[]>([])
  const popupVisible = ref(false)
  const popupPosition = reactive<AutocompletePosition>({ x: 0, y: 0 })
  const currentContext = ref<CompletionContext | null>(null)

  // 自动补全启用状态
  const isAutocompleteEnabled = ref(false)

  // 当前输入缓冲区
  const currentLineBuffer = ref('')
  const cursorCol = ref(0)

  // 防抖定时器
  let triggerTimer: ReturnType<typeof setTimeout> | null = null

  // 防抖延迟 (毫秒)
  const DEBOUNCE_DELAY = 300 // 增加到 300ms,避免频繁触发

  // Popup 组件引用 (由父组件设置)
  let popupRef: any = null

  /**
   * 加载自动补全启用状态
   */
  function loadAutocompleteEnabled() {
    const saved = localStorage.getItem('terminalAutocompleteEnabled')
    if (saved !== null) {
      isAutocompleteEnabled.value = saved === 'true'
    }
  }

  /**
   * 设置 popup 组件引用
   */
  function setPopupRef(ref: any) {
    popupRef = ref
  }

  /**
   * 触发补全
   */
  async function triggerAutocomplete() {
    // 检查是否启用自动补全
    if (!isAutocompleteEnabled.value) {
      return
    }

    if (!terminal.value || !terminalContainer.value) return

    try {
      // 从终端 buffer 读取当前行和目录
      const { command: currentLine, directory } = getCurrentLineAndDirectory()
      const cursor = currentLine.length

      // 如果当前行为空,不显示补全
      if (!currentLine.trim()) {
        hidePopup()
        return
      }

      // 检测环境变量补全
      const envDetection = envManager.detectEnvVariable(currentLine, cursor)
      if (envDetection) {
        // 获取环境变量建议
        const envVars = await envManager.getEnvSuggestions(connectionId.value, envDetection.prefix)

        if (envVars.length > 0) {
          suggestions.value = envVars.map(v => ({
            name: '$' + v.name,
            description: v.description || v.value || '环境变量',
            icon: '💲',
            type: 'special' as const,
            priority: 90
          }))

          updatePopupPosition()
          popupVisible.value = true

          nextTick(() => {
            updatePopupPosition()
          })
          return
        }
      }

      // 解析上下文
      const context = engine.parseContext(
        currentLine,
        cursor,
        connectionId.value,
        directory // 传递当前目录
      )

      currentContext.value = context

      // 获取补全建议
      const result = await engine.getCompletions(context)

      if (result.suggestions.length > 0) {
        suggestions.value = result.suggestions
        updatePopupPosition() // 第一次计算位置（使用估算高度）
        popupVisible.value = true

        // 等待弹窗渲染完成后，使用实际高度重新计算位置
        nextTick(() => {
          updatePopupPosition() // 第二次计算位置（使用实际高度）
        })
      } else {
        hidePopup()
      }
    } catch (error) {
      // 补全错误
      hidePopup()
    }
  }

  /**
   * 延迟触发补全
   */
  function debouncedTrigger() {
    if (triggerTimer) {
      clearTimeout(triggerTimer)
    }

    triggerTimer = setTimeout(() => {
      triggerAutocomplete()
    }, DEBOUNCE_DELAY)
  }

  /**
   * 更新弹窗位置
   */
  function updatePopupPosition() {
    if (!terminal.value || !terminalContainer.value) return

    try {
      // 获取终端容器的位置
      const rect = terminalContainer.value.getBoundingClientRect()

      // 获取光标位置 (基于字符网格)
      const buffer = terminal.value.buffer.active
      const cursorX = buffer.cursorX
      const cursorY = buffer.cursorY

      // xterm.js 字体大小 (假设为 14px, 可以从配置获取)
      const fontSize = 14
      const lineHeight = fontSize * 1.2
      const charWidth = fontSize * 0.6

      // 计算光标的屏幕坐标
      const cursorScreenX = rect.left + cursorX * charWidth
      const cursorScreenY = rect.top + cursorY * lineHeight

      // 弹窗尺寸
      const popupWidth = 400 // 最小宽度

      // 获取实际弹窗高度，如果弹窗还未渲染则使用估算高度
      const actualPopupHeight = popupRef.value?.getPopupHeight() || 0
      // 估算高度：头部(40px) + 每项(24px) * 建议数量，最大320px
      const estimatedHeight = Math.min(40 + suggestions.value.length * 24, 320)
      const popupHeight = actualPopupHeight > 0 ? actualPopupHeight : estimatedHeight

      // 边界检查 - 避免超出屏幕
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // 弹窗左下角对齐光标位置
      // x: 光标位置就是弹窗左边界
      // y: 光标位置就是弹窗底部,所以需要向上偏移弹窗高度
      let x = cursorScreenX
      let y = cursorScreenY - popupHeight

      // 如果右侧空间不足,调整到屏幕内
      if (x + popupWidth > screenWidth - 20) {
        x = screenWidth - popupWidth - 20
      }

      // 如果上方空间不足,显示在光标下方
      if (y < 20) {
        y = cursorScreenY + lineHeight // 显示在光标下方
      }

      // 确保不超出左边界
      if (x < 20) {
        x = 20
      }

      // 确保不超出下边界
      if (y + popupHeight > screenHeight - 20) {
        y = screenHeight - popupHeight - 20
      }

      popupPosition.x = x
      popupPosition.y = y
    } catch (error) {
      // 更新弹窗位置错误
    }
  }

  /**
   * 隐藏弹窗
   */
  function hidePopup() {
    popupVisible.value = false
    suggestions.value = []
    currentContext.value = null
  }

  /**
   * 选择建议
   */
  async function selectSuggestion(suggestion: Suggestion) {
    if (!terminal.value || !connectionId.value) {
      return
    }

    if (!currentContext.value) {
      return
    }

    try {
      const insertValue = suggestion.insertValue || suggestion.name

      // 判断是否是完整命令（AI建议、历史命令、别名）
      const isCompleteCommand =
        suggestion.type === 'special' &&
        (suggestion.icon === '🤖' || suggestion.icon === '🕐' || suggestion.icon === '🔗')

      let deleteCount = currentContext.value.currentToken.length

      // 如果是完整命令，需要删除整行输入
      if (isCompleteCommand) {
        deleteCount = currentContext.value.currentLine.length
      }

      // 删除内容 (发送退格键到 SSH)
      for (let i = 0; i < deleteCount; i++) {
        await window.electronAPI.ssh.write(connectionId.value, '\x7F')
      }

      // 插入新值 (发送到 SSH)
      await window.electronAPI.ssh.write(connectionId.value, insertValue)

      // 根据类型决定后续操作
      if (suggestion.type === 'folder') {
        // 如果是目录,立即执行 cd
        await window.electronAPI.ssh.write(connectionId.value, '\r')
      } else if (suggestion.type === 'option' || suggestion.type === 'subcommand') {
        // 如果是选项或子命令,添加空格
        await window.electronAPI.ssh.write(connectionId.value, ' ')
      } else if (suggestion.type === 'special' && suggestion.icon === '🤖') {
        // AI 智能建议 - 直接执行命令
        await window.electronAPI.ssh.write(connectionId.value, '\r')
      } else if (
        suggestion.type === 'special' &&
        (suggestion.icon === '🕐' || suggestion.icon === '🔗')
      ) {
        // 历史命令或别名 - 也直接执行
        await window.electronAPI.ssh.write(connectionId.value, '\r')
      }

      hidePopup()
    } catch (error) {
      // 插入建议错误
    }
  }

  /**
   * 处理键盘事件
   */
  function handleKeydown(event: KeyboardEvent) {
    if (!popupVisible.value) return

    // 如果弹窗可见,处理导航按键
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        event.stopPropagation()
        popupRef?.moveUp()
        return false

      case 'ArrowDown':
        event.preventDefault()
        event.stopPropagation()
        popupRef?.moveDown()
        return false

      case 'Tab':
        // Tab 键始终尝试补全（如果有选中项则使用，否则关闭弹窗）
        event.preventDefault()
        event.stopPropagation()
        if (popupRef?.hasSelection()) {
          popupRef?.selectCurrent()
        } else {
          hidePopup()
        }
        return false

      case 'Enter':
        // Enter 键：只有在有选中项时才使用建议，否则让它正常提交命令
        if (popupRef?.hasSelection()) {
          event.preventDefault()
          event.stopPropagation()
          popupRef?.selectCurrent()
          return false
        }
        // 没有选中项时，让 Enter 正常提交命令（不阻止默认行为）
        hidePopup()
        return true

      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        hidePopup()
        return false
    }

    return true
  }

  /**
   * 从终端 buffer 读取当前行和当前目录
   */
  function getCurrentLineAndDirectory(): { command: string; directory: string } {
    if (!terminal.value) return { command: '', directory: '' }

    try {
      const buffer = terminal.value.buffer.active
      const cursorY = buffer.cursorY
      const line = buffer.getLine(cursorY)

      if (!line) return { command: '', directory: '' }

      // 获取整行文本
      let fullLine = ''
      for (let i = 0; i < line.length; i++) {
        const cell = line.getCell(i)
        if (cell) {
          const char = cell.getChars()
          if (char) {
            fullLine += char
          }
        }
      }

      // 清理 ANSI 转义序列
      fullLine = fullLine.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '')
      fullLine = fullLine.replace(/\x1b\][^\x07]*\x07/g, '')

      // 尝试从提示符中提取目录
      // 格式: user@host:~/path$ command 或 user@host:/full/path# command
      let directory = ''
      // 匹配冒号后到提示符结束符之间的内容
      const dirMatch = fullLine.match(/:([^$#>]*)[$#>]\s*/)
      if (dirMatch) {
        directory = dirMatch[1].trim()
      }

      // 找到提示符的位置 (查找 $, #, > 等)
      const promptMatch = fullLine.match(/(.*?)[$#>]\s*(.*)$/)
      if (promptMatch) {
        const command = promptMatch[2]
        return { command, directory }
      }

      // 如果没有找到提示符,返回从光标位置前的文本
      const textBeforeCursor = fullLine.substring(0, buffer.cursorX).trim()

      return { command: textBeforeCursor, directory }
    } catch (error) {
      // 读取当前行错误
      return { command: '', directory: '' }
    }
  }

  /**
   * 监听终端数据
   */
  function setupTerminalListener() {
    if (!terminal.value) return

    // 监听终端数据输出 (包括用户输入)
    terminal.value.onData(data => {
      const charCode = data.charCodeAt(0)

      // 处理特殊键
      if (data === '\r') {
        // Enter - 清空缓冲区
        currentLineBuffer.value = ''
        cursorCol.value = 0
        hidePopup()
        return
      }

      if (data === '\x03') {
        // Ctrl+C - 清空缓冲区
        currentLineBuffer.value = ''
        cursorCol.value = 0
        hidePopup()
        return
      }

      // 退格键 (Backspace)
      if (charCode === 127 || data === '\x7f') {
        // 退格键:只隐藏弹窗,不触发补全
        // 如果用户继续输入字符,会自然触发补全
        hidePopup()
        // 不要 return,让事件继续传递给其他监听器
        // (实际上 onData 不是 DOM 事件,不存在阻止传播的问题)
        return
      }

      // Escape 键
      if (data === '\x1b' || charCode === 27) {
        hidePopup()
        return
      }

      // 方向键和其他控制字符 (忽略)
      // 方向键会发送 ESC 序列,如 \x1b[A (上), \x1b[B (下) 等
      if (data.startsWith('\x1b[')) {
        hidePopup()
        return
      }

      // Tab 键 - 被键盘事件处理器捕获了,这里不应该收到
      if (data === '\t' || charCode === 9) {
        return
      }

      // 可打印字符或空格 - 触发补全
      if (charCode >= 32 && charCode <= 126) {
        debouncedTrigger()
        return
      }

      // 其他未处理的字符
    })
  }

  /**
   * 初始化
   */
  onMounted(() => {
    // 监听全局键盘事件
    document.addEventListener('keydown', handleKeydown, true)

    // 预加载数据（异步，不阻塞初始化）
    preloadData()
  })

  /**
   * 清理
   */
  // 监听 localStorage 中 AI 模型配置的变化
  const handleAIModelChange = async () => {
    await engine.getAIManager().reloadConfig()
  }

  /**
   * 处理自动补全开关变化
   */
  const handleAutocompleteToggle = (e: StorageEvent) => {
    if (e.key === 'terminalAutocompleteEnabled') {
      const newValue = e.newValue === 'true'
      isAutocompleteEnabled.value = newValue

      // 如果禁用，隐藏弹窗
      if (!newValue) {
        hidePopup()
      }
    }
  }

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === 'selectedAIModel') {
      handleAIModelChange()
    } else if (e.key === 'terminalAutocompleteEnabled') {
      handleAutocompleteToggle(e)
    }
  }

  // 监听 storage 事件
  onMounted(() => {
    // 加载自动补全启用状态
    loadAutocompleteEnabled()

    // 监听配置变化
    window.addEventListener('storage', handleStorageEvent)
    window.addEventListener('ai-model-changed', handleAIModelChange)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown, true)
    window.removeEventListener('storage', handleStorageEvent)
    window.removeEventListener('ai-model-changed', handleAIModelChange)

    if (triggerTimer) {
      clearTimeout(triggerTimer)
    }
  })

  return {
    // 状态
    suggestions,
    popupVisible,
    popupPosition,

    // 方法
    setPopupRef,
    triggerAutocomplete,
    hidePopup,
    selectSuggestion,
    setupTerminalListener,

    // AI 相关
    isAIAvailable: () => engine.isAIAvailable(),
    reloadAIConfig: handleAIModelChange
  }
}
