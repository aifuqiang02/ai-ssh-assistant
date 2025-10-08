<template>
  <div class="prompt-optimizer-view">
    <!-- 内容区域 -->
    <div class="settings-content">
      <div class="content-inner">
        <!-- 步骤1: 任务描述与生成提示词 -->
        <section class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-1-circle"></i>
            描述您的任务
          </h2>
          <p class="section-description">告诉 AI 您希望助手完成什么任务，我们将为您生成基础提示词</p>
        
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">任务描述</label>
              <p class="setting-hint">详细描述您希望 AI 助手的角色和任务</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="taskDescription"
                placeholder="例如：我需要一个专业的 Python 编程助手，能够帮我解答代码问题，提供最佳实践建议..."
                class="form-textarea"
                rows="6"
              ></textarea>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">生成提示词</label>
              <p class="setting-hint">基于您的任务描述，AI 将生成一个优化的系统提示词</p>
            </div>
            <div class="setting-right">
              <button
                @click="generatePrompt"
                :disabled="!taskDescription.trim() || isGenerating"
                class="btn-primary"
              >
                <i :class="['bi', isGenerating ? 'bi-hourglass-split' : 'bi-magic']"></i>
                {{ isGenerating ? '生成中...' : '生成基础提示词' }}
              </button>
            </div>
          </div>
        </section>

        <!-- 步骤2: 显示生成的提示词并测试 -->
        <section class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-2-circle"></i>
            生成的提示词
          </h2>
          <p class="section-description">这是根据您的任务描述生成的系统提示词，您可以进行测试</p>
        
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">当前提示词</label>
              <p class="setting-hint">您可以手动编辑提示词后再测试</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="generatedPrompt"
                class="form-textarea prompt-display"
                rows="10"
              ></textarea>
            </div>
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
        <section class="setting-section">
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
              <div class="test-result-box">
                {{ testResult }}
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
          <button 
            @click="savePrompt" 
            :disabled="!generatedPrompt.trim()"
            class="btn-success"
          >
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
import { ref, onMounted, onUnmounted } from 'vue'
import { chatCompletion } from '../services/ai-api.service'
import { settingsService } from '../services/settings.service'
import { DEFAULT_PROVIDERS, type AIProvider, type AIModel } from '../types/ai-providers'

// AI 配置
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)

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

// 加载当前选中的 AI 模型
const loadAIModelConfiguration = async () => {
  try {
    const saved = localStorage.getItem('selectedAIModel')
    if (!saved) {
      console.warn('[PromptOptimizer] 未找到已选择的模型')
      return false
    }
    
    const savedModel = JSON.parse(saved)
    const settings = await settingsService.getSettings()
    const configs = settings?.aiProviders || []
    
    if (configs.length > 0 && savedModel) {
      // 合并配置与默认 provider
      const savedConfig = configs.find((p: any) => p.id === savedModel.providerId)
      const defaultProvider = DEFAULT_PROVIDERS.find(p => p.id === savedModel.providerId)
      
      if (savedConfig && defaultProvider) {
        // 合并 provider 数据
        const provider: AIProvider = {
          ...defaultProvider,
          apiKey: savedConfig.apiKey || '',
          enabled: savedConfig.enabled !== undefined ? savedConfig.enabled : false,
          isDefault: false,
          models: savedConfig.models && savedConfig.models.length > 0 
            ? savedConfig.models.map((configModel: any) => {
                const defaultModel = defaultProvider.models.find(m => m.id === configModel.id)
                return defaultModel ? {
                  ...defaultModel,
                  enabled: configModel.enabled !== undefined ? configModel.enabled : true
                } : configModel
              })
            : defaultProvider.models
        }
        
        const model = provider.models?.find(m => m.id === savedModel.modelId)
        if (model) {
          currentProvider.value = provider
          currentModel.value = model
          console.log('[PromptOptimizer] ✅ 已加载模型:', provider.name, '-', model.name)
          return true
        }
      }
    }
    return false
  } catch (error) {
    console.error('[PromptOptimizer] ❌ AI模型配置加载失败:', error)
    return false
  }
}

// 检查模型是否可用
const checkModelAvailable = (): boolean => {
  if (!currentProvider.value || !currentModel.value) {
    alert('请先在设置中配置并选择 AI 模型')
    return false
  }
  return true
}

// 方法：生成基础提示词
const generatePrompt = async () => {
  if (!checkModelAvailable()) return
  
  isGenerating.value = true
  try {
    const response = await chatCompletion(
      currentProvider.value!,
      currentModel.value!,
      {
        messages: [
          {
            role: 'system',
            content: '你是一个专业的提示词工程师。你的任务是根据用户描述的任务需求，生成一个高质量、清晰、有效的系统提示词（system prompt）。提示词应该明确定义 AI 助手的角色、职责和行为准则。'
          },
          {
            role: 'user',
            content: `请为以下任务生成一个专业的系统提示词：\n\n${taskDescription.value}\n\n要求：\n1. 明确定义 AI 助手的角色\n2. 说明具体的任务和职责\n3. 提供清晰的行为准则\n4. 语言简洁专业\n\n请直接返回生成的提示词内容，不要包含任何解释或其他文字。`
          }
        ],
        stream: false,
        temperature: 0.7
      }
    )
    
    generatedPrompt.value = response.content.trim()
  } catch (error: any) {
    console.error('生成提示词失败:', error)
    alert(`生成失败：${error.message}`)
  } finally {
    isGenerating.value = false
  }
}

// 方法：测试提示词
const testPrompt = async () => {
  if (!checkModelAvailable()) return
  
  isTesting.value = true
  try {
    const response = await chatCompletion(
      currentProvider.value!,
      currentModel.value!,
      {
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
      }
    )
    
    testResult.value = response.content
  } catch (error: any) {
    console.error('测试失败:', error)
    alert(`测试失败：${error.message}`)
  } finally {
    isTesting.value = false
  }
}

// 方法：根据用户点评优化提示词
const optimizePrompt = async () => {
  if (!checkModelAvailable()) return
  
  isOptimizing.value = true
  try {
    const response = await chatCompletion(
      currentProvider.value!,
      currentModel.value!,
      {
        messages: [
          {
            role: 'system',
            content: '你是一个专业的提示词工程师。你的任务是根据用户的反馈意见优化系统提示词，使其更好地满足用户的需求。'
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
      }
    )
    
    generatedPrompt.value = response.content.trim()
    
    // 清空测试相关内容，提示用户重新测试
    testResult.value = ''
    userFeedback.value = ''
    testQuestion.value = ''
    alert('提示词已优化！建议重新测试以验证效果。')
  } catch (error: any) {
    console.error('优化失败:', error)
    alert(`优化失败：${error.message}`)
  } finally {
    isOptimizing.value = false
  }
}

// 方法：保存提示词
const savePrompt = () => {
  // TODO: 保存提示词到会话设置
  // 可以通过路由传递或使用 localStorage
  console.log('保存提示词:', generatedPrompt.value)
  
  // 临时存储到 localStorage
  localStorage.setItem('optimizedPrompt', generatedPrompt.value)
  alert('提示词已保存到临时存储！\n\n提示：您可以在会话设置中使用这个提示词。')
}

// 方法：重置所有内容
const resetAll = () => {
  if (confirm('确定要重新开始吗？所有内容将被清空。')) {
    taskDescription.value = ''
    generatedPrompt.value = ''
    testQuestion.value = ''
    testResult.value = ''
    userFeedback.value = ''
  }
}

// 监听模型切换事件
const handleModelChanged = () => {
  console.log('[PromptOptimizer] 🔄 检测到模型切换，重新加载')
  loadAIModelConfiguration()
}

const handleSettingsUpdated = () => {
  console.log('[PromptOptimizer] 🔄 检测到设置更新，重新加载模型')
  loadAIModelConfiguration()
}

// 生命周期
onMounted(async () => {
  await loadAIModelConfiguration()
  
  // 监听事件
  window.addEventListener('ai-model-changed', handleModelChanged)
  window.addEventListener('settings-updated', handleSettingsUpdated)
  window.addEventListener('ai-provider-configs-updated', handleSettingsUpdated)
})

onUnmounted(() => {
  window.removeEventListener('ai-model-changed', handleModelChanged)
  window.removeEventListener('settings-updated', handleSettingsUpdated)
  window.removeEventListener('ai-provider-configs-updated', handleSettingsUpdated)
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

/* ========== 内容区域 ========== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-inner {
  max-width: 900px;
  padding: 32px 48px;
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
  background: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #229954;
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
.test-result-box {
  padding: 16px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
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
.test-result-box::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track,
.test-result-box::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb,
.test-result-box::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
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

