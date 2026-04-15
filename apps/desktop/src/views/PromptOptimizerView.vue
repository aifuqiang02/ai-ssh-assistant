<template>
  <div class="prompt-optimizer-view">
    <!-- 左侧导航树 -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">提示词优化助手</h3>
      </div>
      <nav class="settings-nav">
        <div
          v-for="section in optimizerSections"
          :key="section.id"
          :class="['nav-item', { active: activeSection === section.id }]"
          @click="scrollToSection(section.id)"
        >
          <i :class="['nav-icon', section.icon]"></i>
          <span class="nav-label">{{ section.label }}</span>
        </div>
      </nav>
    </div>

    <!-- 内容区域 -->
    <div class="settings-content" ref="contentContainer" @scroll="onScroll">
      <div class="content-inner">
        <!-- 步骤1: 任务描述与生成提示词 -->
        <section :id="'section-task'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-1-circle"></i>
            描述您的任务
          </h2>
          <p class="section-description">
            告诉 AI 您希望助手完成什么任务，我们将为您生成基础提示词
          </p>

          <div class="setting-row">
            <div class="task-input-container">
              <textarea
                v-model="taskDescription"
                placeholder="例如：我需要一个专业的 Python 编程助手，能够帮我解答代码问题，提供最佳实践建议..."
                class="form-textarea"
                rows="6"
                @keydown="handleTextareaKeyDown"
              ></textarea>
              <button
                @click="generatePrompt"
                :disabled="!taskDescription.trim() || isGenerating"
                class="btn-primary generate-btn"
              >
                <i :class="['bi', isGenerating ? 'bi-hourglass-split' : 'bi-magic']"></i>
                {{ isGenerating ? '生成中...' : '生成基础提示词' }}
              </button>
            </div>
          </div>
        </section>

        <!-- 步骤2: 显示生成的提示词并测试 -->
        <section :id="'section-prompt'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-2-circle"></i>
            生成的提示词
          </h2>
          <p class="section-description">这是根据您的任务描述生成的系统提示词，您可以进行测试</p>

          <div class="setting-row">
            <textarea
              v-model="generatedPrompt"
              placeholder="您可以手动编辑提示词后再测试..."
              class="form-textarea prompt-display"
              rows="10"
              @keydown="handlePromptTextareaKeyDown"
            ></textarea>
          </div>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">测试提示词</label>
              <p class="setting-hint">输入一个测试问题，查看 AI 的回复效果</p>
            </div>
            <div class="setting-right">
              <input
                v-model="testQuestion"
                type="text"
                placeholder="例如：如何实现一个二分查找算法？"
                class="form-input"
              />
              <button
                @click="testPrompt"
                :disabled="!testQuestion.trim() || isTesting"
                class="btn-primary mt-2"
              >
                <i :class="['bi', isTesting ? 'bi-hourglass-split' : 'bi-send']"></i>
                {{ isTesting ? '测试中...' : '测试提示词' }}
              </button>
            </div>
          </div>
        </section>

        <!-- 步骤3: 测试结果与优化 -->
        <section :id="'section-test'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-3-circle"></i>
            测试结果与优化
          </h2>
          <p class="section-description">查看 AI 的回复，并获取优化建议</p>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">AI 回复</label>
              <p class="setting-hint">基于当前提示词，AI 对您测试问题的回复</p>
            </div>
            <div class="setting-right">
              <div class="result-container">
                <div class="result-header">
                  <span class="result-title">回复内容</span>
                  <button
                    v-if="testResult"
                    @click="copyTestResult"
                    class="btn-copy"
                    :class="{ copied: isCopied }"
                    :title="isCopied ? '已复制' : '复制回复内容'"
                  >
                    <i :class="['bi', isCopied ? 'bi-check-lg' : 'bi-clipboard']"></i>
                    {{ isCopied ? '已复制' : '复制' }}
                  </button>
                </div>
                <div class="test-result-box">
                  {{ testResult }}
                </div>
              </div>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">您的点评</label>
              <p class="setting-hint">请描述您对 AI 回复的评价和期望的改进方向</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="userFeedback"
                placeholder="例如：回复太简短了，希望能提供更详细的解释和具体的代码示例..."
                class="form-textarea"
                rows="5"
                @keydown="handleTextareaKeyDown"
              ></textarea>
              <button
                @click="optimizePrompt"
                :disabled="!userFeedback.trim() || isOptimizing"
                class="btn-primary mt-2"
              >
                <i :class="['bi', isOptimizing ? 'bi-hourglass-split' : 'bi-magic']"></i>
                {{ isOptimizing ? '优化中...' : '优化提示词' }}
              </button>
            </div>
          </div>
        </section>

        <!-- 操作按钮区 -->
        <div class="action-bar">
          <button @click="savePrompt" :disabled="!generatedPrompt.trim()" class="btn-success">
            <i class="bi bi-check-circle"></i>
            保存提示词
          </button>
          <button @click="resetAll" class="btn-secondary">
            <i class="bi bi-arrow-counterclockwise"></i>
            重新开始
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { chatCompletion } from '../services/ai-api.service'
import { settingsService } from '../services/settings.service'
import { chatService } from '../services/chat.service'
import { DEFAULT_PROVIDERS, type AIProvider, type AIModel } from '../types/ai-providers'
import { resolveSelectedModel } from '../services/selected-model-resolver.service'
import { registerModelSelectionSyncListeners } from '../utils/model-sync-events'
import { $alert, $confirm } from '@/composables/useDialog'

// 左侧菜单配置
const optimizerSections = [
  { id: 'task', label: '任务描述', icon: 'bi bi-pencil-square' },
  { id: 'prompt', label: '生成提示词', icon: 'bi bi-file-text' },
  { id: 'test', label: '测试优化', icon: 'bi bi-check2-circle' }
]

const activeSection = ref('task')
const contentContainer = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

// AI 配置
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)
let unregisterModelSyncListeners: (() => void) | null = null

// 步骤1: 任务描述与生成
const taskDescription = ref('')
const isGenerating = ref(false)
const generatedPrompt = ref('')

// 步骤2: 测试提示词
const testQuestion = ref('')
const isTesting = ref(false)
const testResult = ref('')

// 步骤3: 用户点评与优化
const userFeedback = ref('')
const isOptimizing = ref(false)

// 复制功能
const isCopied = ref(false)

// 加载当前选中的 AI 模型
const loadAIModelConfiguration = async () => {
  try {
    const saved = localStorage.getItem('selectedAIModel')
    if (!saved) {
      currentProvider.value = null
      currentModel.value = null
      console.warn('[PromptOptimizer] 未找到已选择的模型')
      return false
    }

    const resolved = resolveSelectedModel(
      saved,
      (await settingsService.getSettings())?.aiProviders || []
    )
    if (resolved?.source === 'official') {
      currentProvider.value = null
      currentModel.value = null
      return false
    }

    const parsed = JSON.parse(saved)

    // 新格式：完整的 provider 和 model 对象
    if (parsed.provider && parsed.model) {
      currentProvider.value = parsed.provider
      currentModel.value = parsed.model
      return true
    }

    // 旧格式兼容：只有 providerId 和 modelId
    if (parsed.providerId && parsed.modelId) {
      const settings = await settingsService.getSettings()
      const configs = settings?.aiProviders || []

      // 合并配置与默认 provider
      const savedConfig = configs.find((p: any) => p.id === parsed.providerId)
      const defaultProvider = DEFAULT_PROVIDERS.find(p => p.id === parsed.providerId)

      if (savedConfig && defaultProvider) {
        // 合并 provider 数据
        const provider: AIProvider = {
          ...defaultProvider,
          apiKey: savedConfig.apiKey || '',
          enabled: savedConfig.enabled !== undefined ? savedConfig.enabled : false,
          isDefault: false,
          models:
            savedConfig.models && savedConfig.models.length > 0
              ? savedConfig.models.map((configModel: any) => {
                  const defaultModel = defaultProvider.models.find(m => m.id === configModel.id)
                  return defaultModel
                    ? {
                        ...defaultModel,
                        enabled: configModel.enabled !== undefined ? configModel.enabled : true
                      }
                    : configModel
                })
              : defaultProvider.models
        }

        const model = provider.models?.find(m => m.id === parsed.modelId)
        if (model) {
          currentProvider.value = provider
          currentModel.value = model
          return true
        }
      }
    }

    currentProvider.value = null
    currentModel.value = null
    return false
  } catch (error) {
    currentProvider.value = null
    currentModel.value = null
    console.error('[PromptOptimizer] ❌ AI模型配置加载失败:', error)
    return false
  }
}

// 检查模型是否可用
const checkModelAvailable = (): boolean => {
  if (!currentProvider.value || !currentModel.value) {
    $alert('请先在设置中配置并选择 AI 模型。提示词优化器当前暂不支持官方模型。')
    return false
  }
  return true
}

// 方法：生成基础提示词
const generatePrompt = async () => {
  if (!checkModelAvailable()) return

  isGenerating.value = true
  try {
    const response = await chatCompletion(currentProvider.value!, currentModel.value!, {
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的提示词工程师。你的任务是根据用户描述的任务需求，生成一个高质量、清晰、有效的系统提示词（system prompt）。提示词应该明确定义 AI 助手的角色、职责和行为准则。'
        },
        {
          role: 'user',
          content: `请为以下任务生成一个专业的系统提示词：\n\n${taskDescription.value}\n\n要求：\n1. 明确定义 AI 助手的角色\n2. 说明具体的任务和职责\n3. 提供清晰的行为准则\n4. 语言简洁专业\n\n请直接返回生成的提示词内容，不要包含任何解释或其他文字。`
        }
      ],
      stream: false,
      temperature: 0.7
    })

    generatedPrompt.value = response.content.trim()
  } catch (error: any) {
    $alert(`生成失败：${error.message}`)
  } finally {
    isGenerating.value = false
  }
}

// 方法：测试提示词
const testPrompt = async () => {
  if (!checkModelAvailable()) return

  isTesting.value = true
  try {
    const response = await chatCompletion(currentProvider.value!, currentModel.value!, {
      messages: [
        {
          role: 'system',
          content: generatedPrompt.value
        },
        {
          role: 'user',
          content: testQuestion.value
        }
      ],
      stream: false,
      temperature: 0.7
    })

    testResult.value = response.content
  } catch (error: any) {
    $alert(`测试失败：${error.message}`)
  } finally {
    isTesting.value = false
  }
}

// 方法：根据用户点评优化提示词
const optimizePrompt = async () => {
  if (!checkModelAvailable()) return

  isOptimizing.value = true
  try {
    const response = await chatCompletion(currentProvider.value!, currentModel.value!, {
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的提示词工程师。你的任务是根据用户的反馈意见优化系统提示词，使其更好地满足用户的需求。'
        },
        {
          role: 'user',
          content: `请优化以下系统提示词：

【当前提示词】
${generatedPrompt.value}

【测试问题】
${testQuestion.value}

【AI 回复】
${testResult.value}

【用户点评和改进要求】
${userFeedback.value}

请基于用户的点评和改进要求，生成一个优化后的系统提示词。要求：
1. 保留原有提示词的核心功能和定位
2. 针对性地解决用户提出的问题
3. 确保优化后的提示词清晰、具体、有效
4. 直接返回优化后的完整提示词内容，不要包含任何解释或其他文字`
        }
      ],
      stream: false,
      temperature: 0.7
    })

    generatedPrompt.value = response.content.trim()

    // 清空用户点评
    userFeedback.value = ''

    // 自动重新测试优化后的提示词
    if (testQuestion.value) {
      await testPrompt()
    }
  } catch (error: any) {
    $alert(`优化失败：${error.message}`)
  } finally {
    isOptimizing.value = false
  }
}

// 方法：保存提示词
const savePrompt = async () => {
  if (!generatedPrompt.value.trim()) {
    $alert('提示词不能为空！')
    return
  }

  try {
    const currentSessionId = localStorage.getItem('current-session-id')
    let savedToDatabase = false

    // 1. 如果有当前会话ID，保存到数据库
    if (currentSessionId) {
      try {
        // 保存到 localStorage（本地缓存）
        const sessionConfigKey = `chat-session-config-${currentSessionId}`
        const existingConfig = localStorage.getItem(sessionConfigKey)
        const config = existingConfig ? JSON.parse(existingConfig) : {}

        config.systemPrompt = generatedPrompt.value
        config.updatedAt = new Date().toISOString()

        localStorage.setItem(sessionConfigKey, JSON.stringify(config))

        // 保存到数据库
        await chatService.updateSession(currentSessionId, {
          config: {
            systemPrompt: generatedPrompt.value
          }
        })

        savedToDatabase = true

        // 触发事件通知会话更新
        window.dispatchEvent(
          new CustomEvent('session-prompt-updated', {
            detail: { sessionId: currentSessionId, systemPrompt: generatedPrompt.value }
          })
        )
      } catch (dbError: any) {
        console.error('[PromptOptimizer] ⚠️ 数据库保存失败，仅保存到本地:', dbError)
        // 数据库保存失败，但 localStorage 已保存，继续执行
      }
    }

    // 2. 显示保存结果
    const message = currentSessionId
      ? `✅ 提示词已保存成功！\n\n` +
        `• 已应用到当前会话\n` +
        `• 已保存到${savedToDatabase ? '数据库和' : ''}本地配置`
      : `⚠️ 请先打开一个聊天会话，然后再保存提示词。\n\n提示词需要关联到具体的会话。`
    $alert(message)
  } catch (error: any) {
    $alert('❌ 保存失败：' + error.message)
  }
}

// 方法：重置所有内容
const resetAll = async () => {
  if (await $confirm('确定要重新开始吗？所有内容将被清空。')) {
    taskDescription.value = ''
    generatedPrompt.value = ''
    testQuestion.value = ''
    testResult.value = ''
    userFeedback.value = ''
  }
}

// 方法：复制测试结果
const copyTestResult = async () => {
  try {
    await navigator.clipboard.writeText(testResult.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    $alert('复制失败，请手动选择文本复制')
  }
}

// 处理 textarea 的键盘事件 - 确保回车键能正常换行
const handleTextareaKeyDown = (e: KeyboardEvent) => {
  // 允许回车键的默认行为（换行）
  // 阻止事件冒泡，防止全局监听器拦截
  if (e.key === 'Enter') {
    e.stopPropagation()
    // 不调用 preventDefault()，让默认的换行行为正常工作
  }
}

// 处理提示词 textarea 的键盘事件（与上面相同，但保留以保持兼容性）
const handlePromptTextareaKeyDown = handleTextareaKeyDown

// 左侧菜单导航方法
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(`section-${sectionId}`)
  if (element && contentContainer.value) {
    isScrolling.value = true
    activeSection.value = sectionId

    const container = contentContainer.value
    const offsetTop = element.offsetTop - 82

    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })

    setTimeout(() => {
      isScrolling.value = false
    }, 600)
  }
}

const onScroll = () => {
  if (isScrolling.value) return

  const container = contentContainer.value
  if (!container) return

  const scrollTop = container.scrollTop
  const sections = optimizerSections.map(s => ({
    id: s.id,
    element: document.getElementById(`section-${s.id}`)
  }))

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element) {
      const offsetTop = section.element.offsetTop - 60
      if (scrollTop >= offsetTop) {
        activeSection.value = section.id
        break
      }
    }
  }
}

// 监听模型切换事件
const handleModelChanged = () => {
  loadAIModelConfiguration()
}

const handleSettingsUpdated = () => {
  loadAIModelConfiguration()
}

// 生命周期
onMounted(async () => {
  await loadAIModelConfiguration()

  // 检查是否有从其他页面传递过来的提示词（例如从聊天会话的"编辑提示词"按钮）
  const editPrompt = localStorage.getItem('prompt-optimizer-edit-prompt')
  if (editPrompt) {
    generatedPrompt.value = editPrompt
    // 清除临时存储，避免下次打开时重复加载
    localStorage.removeItem('prompt-optimizer-edit-prompt')

    // 自动滚动到提示词编辑区域
    await nextTick()
    scrollToSection('prompt')
  }

  // 监听事件
  unregisterModelSyncListeners = registerModelSelectionSyncListeners(window, handleModelChanged)
})

onUnmounted(() => {
  unregisterModelSyncListeners?.()
})
</script>

<style scoped>
/* ========== 布局 ========== */
.prompt-optimizer-view {
  display: flex;
  height: 100vh;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* ========== 左侧导航 ========== */
.settings-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--vscode-bg-lighter);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
}

.sidebar-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.settings-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vscode-fg-muted);
  user-select: none;
}

.nav-item:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.nav-item.active {
  background: var(--vscode-bg);
  color: var(--vscode-accent);
  border-left: 2px solid var(--vscode-accent);
  padding-left: 18px;
}

.nav-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
}

/* ========== 内容区域 ========== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-inner {
  max-width: 900px;
  padding: 32px 48px 80px 48px;
}

/* ========== Section 样式 ========== */
.setting-section {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--vscode-border);
}

.setting-section:last-of-type {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--vscode-fg);
}

.section-title i {
  font-size: 24px;
  color: var(--vscode-accent);
}

.section-description {
  margin: 0 0 24px 0;
  color: var(--vscode-fg-muted);
  font-size: 14px;
  line-height: 1.6;
}

/* ========== Setting Row ========== */
.setting-row {
  display: flex;
  gap: 32px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vscode-border);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-left {
  flex: 1;
  min-width: 0;
}

.setting-right {
  flex-shrink: 0;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.setting-hint {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin: 0;
  line-height: 1.5;
}

/* ========== 表单控件 ========== */
.form-input,
.form-textarea {
  width: 100%;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  color: var(--vscode-fg);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input {
  padding: 0 12px;
  height: 36px;
}

.form-textarea {
  padding: 8px 12px;
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--vscode-accent);
}

.form-input:hover,
.form-textarea:hover {
  border-color: var(--vscode-fg-muted);
}

.prompt-display {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}

/* ========== 任务输入容器 ========== */
.task-input-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-input-container .form-textarea {
  width: 100%;
}

.task-input-container .generate-btn {
  align-self: flex-end;
}

/* ========== 按钮样式 ========== */
.btn-primary,
.btn-success,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.btn-primary:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-success {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
}

.btn-success:hover:not(:disabled) {
  background: var(--vscode-button-hoverBackground);
  transform: translateY(-1px);
}

.btn-success:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
}

.btn-secondary:hover {
  background: var(--vscode-list-hoverBackground);
  border-color: var(--vscode-accent);
}

/* ========== 结果展示区域 ========== */
.result-container {
  width: 100%;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.result-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg-muted);
}

.btn-copy {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 12px;
  background: transparent;
  color: var(--vscode-fg-muted);
  border: 1px solid var(--vscode-border);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
  border-color: var(--vscode-accent);
}

.btn-copy.copied {
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-button-background);
}

.btn-copy i {
  font-size: 12px;
}

.test-result-box {
  padding: 16px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 0 0 4px 4px;
  color: var(--vscode-fg);
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
  user-select: text;
  cursor: text;
}

/* ========== 操作栏 ========== */
.action-bar {
  display: flex;
  gap: 12px;
  padding: 24px 0;
  margin-top: 32px;
  border-top: 2px solid var(--vscode-border);
  justify-content: center;
}

/* ========== 工具类 ========== */
.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

/* ========== 滚动条 ========== */
.settings-content::-webkit-scrollbar,
.settings-nav::-webkit-scrollbar,
.test-result-box::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track,
.settings-nav::-webkit-scrollbar-track,
.test-result-box::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb,
.settings-nav::-webkit-scrollbar-thumb,
.test-result-box::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
.settings-nav::-webkit-scrollbar-thumb:hover,
.test-result-box::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-fg-muted);
}

/* ========== 动画效果 ========== */
.bi-hourglass-split {
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
</style>
