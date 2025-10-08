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
/* ========== 布局 ========== */
.prompt-optimizer-view {
  display: flex;
  height: 100vh;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* ========== 左侧导航 ========== */
.settings-sidebar {
  width: 280px;
  background: var(--vscode-bg-light);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px 20px 16px 20px;
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

/* ========== 右侧内容 ========== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-inner {
  max-width: 800px;
  padding: 32px 48px;
}

.setting-section {
  margin-bottom: 48px;
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
  font-size: 22px;
  color: var(--vscode-accent);
}

.section-description {
  margin: 0 0 24px 0;
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

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
  width: 320px;
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
.form-textarea,
.prompt-textarea {
  width: 100%;
  padding: 8px 12px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  color: var(--vscode-fg);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.prompt-textarea:focus {
  border-color: var(--vscode-accent);
}

.form-input:hover,
.form-textarea:hover,
.prompt-textarea:hover {
  border-color: var(--vscode-fg-muted);
}

.form-textarea,
.prompt-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

/* 按钮 */
.btn-optimize,
.btn-generate,
.btn-add-example,
.btn-restore {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 2px;
  background: var(--vscode-accent);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-optimize:hover,
.btn-generate:hover,
.btn-add-example:hover,
.btn-restore:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-optimize:disabled,
.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 示例对话 */
.examples-list {
  margin-bottom: 16px;
}

.example-item {
  padding: 20px;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  margin-bottom: 16px;
  background: var(--vscode-input-bg);
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.example-number {
  font-weight: 600;
  font-size: 14px;
  color: var(--vscode-fg);
}

.btn-remove {
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: var(--vscode-errorForeground);
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
  font-size: 13px;
}

.btn-remove:hover {
  background: rgba(231, 76, 60, 0.1);
}

.example-field {
  margin-bottom: 16px;
}

.example-field:last-child {
  margin-bottom: 0;
}

.example-field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--vscode-fg);
}

/* 版本历史 */
.history-list {
  margin-top: 16px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  margin-bottom: 12px;
  background: var(--vscode-input-bg);
  transition: all 0.2s;
}

.history-item:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.history-info {
  flex: 1;
}

.history-date {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin-bottom: 4px;
}

.history-preview {
  font-size: 13px;
  color: var(--vscode-fg);
  opacity: 0.8;
}

.history-actions {
  margin-left: 16px;
}

.btn-restore {
  padding: 6px 12px;
  font-size: 13px;
}

.empty-history {
  text-align: center;
  padding: 48px;
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

/* ========== 滚动条 ========== */
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
  background: var(--vscode-border);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
.settings-nav::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-fg-muted);
}
</style>

