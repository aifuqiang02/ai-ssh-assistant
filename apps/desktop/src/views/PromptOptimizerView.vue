<template>
  <div class="prompt-optimizer-view">
    <!-- 左侧导航树 -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">提示词优化助手</h3>
      </div>
      <nav class="settings-nav">
        <div 
          v-for="section in sections" 
          :key="section.id"
          :class="['nav-item', { active: activeSection === section.id }]"
          @click="scrollToSection(section.id)"
        >
          <i :class="['nav-icon', section.icon]"></i>
          <span class="nav-label">{{ section.label }}</span>
        </div>
      </nav>
    </div>
    
    <!-- 右侧内容区域 -->
    <div class="settings-content" ref="contentContainer" @scroll="onScroll">
      <div class="content-inner">
        <!-- 提示词编辑 -->
        <section :id="'section-editor'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-pencil-square"></i>
            提示词编辑
          </h2>
          <p class="section-description">编辑和优化您的系统提示词</p>
        
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">当前提示词</label>
              <p class="setting-hint">编辑您的系统提示词内容</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="promptText"
                placeholder="输入系统提示词，例如：你是一个专业的编程助手..."
                class="prompt-textarea"
                rows="12"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- AI 优化 -->
        <section :id="'section-ai-optimize'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-stars"></i>
            AI 智能优化
          </h2>
          <p class="section-description">使用 AI 分析和优化您的提示词</p>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">优化目标</label>
              <p class="setting-hint">描述您期望 AI 的行为方式</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="optimizationGoal"
                placeholder="例如：我希望 AI 能够更专业地回答编程问题，提供详细的代码示例..."
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">基于对话优化</label>
              <p class="setting-hint">分析最近的对话记录，AI 将给出优化建议</p>
            </div>
            <div class="setting-right">
              <button
                @click="optimizeFromConversation"
                class="btn-optimize"
              >
                <i class="bi bi-chat-left-text mr-2"></i>
                分析对话并优化
              </button>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">智能生成</label>
              <p class="setting-hint">根据优化目标自动生成提示词</p>
            </div>
            <div class="setting-right">
              <button
                @click="generatePrompt"
                :disabled="!optimizationGoal.trim()"
                class="btn-generate"
              >
                <i class="bi bi-magic mr-2"></i>
                生成优化提示词
              </button>
            </div>
          </div>
        </section>

        <!-- 示例对话 -->
        <section :id="'section-examples'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-chat-dots"></i>
            示例对话
          </h2>
          <p class="section-description">通过示例对话帮助 AI 理解您的期望</p>

          <div class="examples-list">
            <div
              v-for="(example, index) in examples"
              :key="index"
              class="example-item"
            >
              <div class="example-header">
                <span class="example-number">示例 {{ index + 1 }}</span>
                <button
                  @click="removeExample(index)"
                  class="btn-remove"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div class="example-content">
                <div class="example-field">
                  <label>用户输入</label>
                  <input
                    v-model="example.input"
                    type="text"
                    placeholder="例如：如何实现一个快速排序？"
                    class="form-input"
                  />
                </div>
                <div class="example-field">
                  <label>期望输出</label>
                  <textarea
                    v-model="example.output"
                    placeholder="描述您期望 AI 如何回复..."
                    class="form-textarea"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="addExample"
            class="btn-add-example"
          >
            <i class="bi bi-plus-circle mr-2"></i>
            添加示例
          </button>

          <div class="setting-row mt-4">
            <div class="setting-left">
              <label class="setting-label">基于示例优化</label>
              <p class="setting-hint">AI 将根据您提供的示例生成最优提示词</p>
            </div>
            <div class="setting-right">
              <button
                @click="optimizeFromExamples"
                :disabled="examples.length === 0"
                class="btn-optimize"
              >
                <i class="bi bi-lightbulb mr-2"></i>
                使用示例优化
              </button>
            </div>
          </div>
        </section>

        <!-- 版本历史 -->
        <section :id="'section-history'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-clock-history"></i>
            版本历史
          </h2>
          <p class="section-description">查看和恢复历史版本</p>

          <div class="history-list">
            <div
              v-for="(version, index) in promptHistory"
              :key="index"
              class="history-item"
            >
              <div class="history-info">
                <div class="history-date">{{ formatDate(version.date) }}</div>
                <div class="history-preview">{{ version.content.substring(0, 100) }}...</div>
              </div>
              <div class="history-actions">
                <button
                  @click="restoreVersion(version)"
                  class="btn-restore"
                >
                  <i class="bi bi-arrow-counterclockwise"></i>
                  恢复
                </button>
              </div>
            </div>

            <div v-if="promptHistory.length === 0" class="empty-history">
              <i class="bi bi-inbox text-4xl opacity-30 mb-2"></i>
              <p>暂无历史版本</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 导航sections
const sections = [
  { id: 'editor', label: '提示词编辑', icon: 'bi bi-pencil-square' },
  { id: 'ai-optimize', label: 'AI 优化', icon: 'bi bi-stars' },
  { id: 'examples', label: '示例对话', icon: 'bi bi-chat-dots' },
  { id: 'history', label: '版本历史', icon: 'bi bi-clock-history' }
]

const activeSection = ref('editor')
const contentContainer = ref<HTMLElement | null>(null)

// 提示词相关
const promptText = ref('')
const optimizationGoal = ref('')

// 示例对话
interface Example {
  input: string
  output: string
}

const examples = ref<Example[]>([])

// 版本历史
interface PromptVersion {
  date: Date
  content: string
}

const promptHistory = ref<PromptVersion[]>([])

// 方法
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(`section-${sectionId}`)
  if (element && contentContainer.value) {
    const elementTop = element.offsetTop - 20
    contentContainer.value.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    })
    activeSection.value = sectionId
  }
}

const onScroll = () => {
  if (!contentContainer.value) return
  
  const scrollTop = contentContainer.value.scrollTop
  const sectionElements = sections.map(s => {
    const element = document.getElementById(`section-${s.id}`)
    return {
      id: s.id,
      top: element ? element.offsetTop - 100 : 0
    }
  })
  
  for (let i = sectionElements.length - 1; i >= 0; i--) {
    if (scrollTop >= sectionElements[i].top) {
      activeSection.value = sectionElements[i].id
      break
    }
  }
}

const optimizeFromConversation = () => {
  console.log('分析对话并优化')
  // TODO: 实现基于对话的优化
}

const generatePrompt = () => {
  console.log('生成优化提示词')
  // TODO: 实现 AI 生成提示词
}

const addExample = () => {
  examples.value.push({
    input: '',
    output: ''
  })
}

const removeExample = (index: number) => {
  examples.value.splice(index, 1)
}

const optimizeFromExamples = () => {
  console.log('使用示例优化')
  // TODO: 实现基于示例的优化
}

const restoreVersion = (version: PromptVersion) => {
  promptText.value = version.content
  console.log('恢复版本:', version.date)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  // 加载当前提示词
  console.log('加载提示词优化助手')
})
</script>

<style scoped>
.prompt-optimizer-view {
  display: flex;
  height: 100vh;
  background: var(--vscode-editor-background);
  color: var(--vscode-editor-foreground);
}

/* 侧边栏 */
.settings-sidebar {
  width: 240px;
  border-right: 1px solid var(--vscode-panel-border);
  background: var(--vscode-sideBar-background);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.sidebar-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vscode-sideBarTitle-foreground);
}

.settings-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vscode-foreground);
}

.nav-item:hover {
  background: var(--vscode-list-hoverBackground);
}

.nav-item.active {
  background: var(--vscode-list-activeSelectionBackground);
  color: var(--vscode-list-activeSelectionForeground);
}

.nav-icon {
  margin-right: 0.75rem;
  font-size: 1rem;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
}

/* 内容区域 */
.settings-content {
  flex: 1;
  overflow-y: auto;
  background: var(--vscode-editor-background);
}

.content-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

/* 设置章节 */
.setting-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.setting-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--vscode-foreground);
}

.section-description {
  margin: 0 0 2rem 0;
  color: var(--vscode-descriptionForeground);
  font-size: 0.875rem;
}

/* 设置行 */
.setting-row {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--vscode-panel-border);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-left {
  flex: 1;
  padding-right: 2rem;
}

.setting-label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--vscode-foreground);
}

.setting-hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--vscode-descriptionForeground);
  line-height: 1.5;
}

.setting-right {
  flex: 1;
  min-width: 0;
}

/* 表单控件 */
.form-input,
.form-textarea,
.prompt-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--vscode-input-border);
  border-radius: 0.375rem;
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.prompt-textarea:focus {
  outline: none;
  border-color: var(--vscode-focusBorder);
}

.form-textarea,
.prompt-textarea {
  resize: vertical;
  line-height: 1.6;
}

/* 按钮 */
.btn-optimize,
.btn-generate,
.btn-add-example,
.btn-restore {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-optimize:hover,
.btn-generate:hover,
.btn-add-example:hover,
.btn-restore:hover {
  background: var(--vscode-button-hoverBackground);
}

.btn-optimize:disabled,
.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 示例对话 */
.examples-list {
  margin-bottom: 1rem;
}

.example-item {
  padding: 1.5rem;
  border: 1px solid var(--vscode-input-border);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background: var(--vscode-input-background);
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.example-number {
  font-weight: 600;
  color: var(--vscode-foreground);
}

.btn-remove {
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--vscode-errorForeground);
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: var(--vscode-list-errorForeground);
}

.example-field {
  margin-bottom: 1rem;
}

.example-field:last-child {
  margin-bottom: 0;
}

.example-field label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--vscode-foreground);
}

/* 版本历史 */
.history-list {
  margin-top: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--vscode-input-border);
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
  background: var(--vscode-input-background);
}

.history-info {
  flex: 1;
}

.history-date {
  font-size: 0.75rem;
  color: var(--vscode-descriptionForeground);
  margin-bottom: 0.25rem;
}

.history-preview {
  font-size: 0.875rem;
  color: var(--vscode-foreground);
  opacity: 0.8;
}

.history-actions {
  margin-left: 1rem;
}

.btn-restore {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.empty-history {
  text-align: center;
  padding: 3rem;
  color: var(--vscode-descriptionForeground);
}

/* 滚动条 */
.settings-content::-webkit-scrollbar,
.settings-nav::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track,
.settings-nav::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb,
.settings-nav::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
.settings-nav::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}
</style>

