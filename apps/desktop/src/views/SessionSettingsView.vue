<template>
  <div class="session-settings-view">
    <!-- 左侧导航树 -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">会话设置</h3>
      </div>
      <nav class="settings-nav">
        <div 
          v-for="section in settingsSections" 
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
        <!-- 基本信息 -->
        <section :id="'section-basic'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-info-circle"></i>
            基本信息
          </h2>
          <p class="section-description">配置会话的基本信息</p>
        
          <!-- 会话名称 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">会话名称</label>
              <p class="setting-hint">为此会话设置一个易于识别的名称</p>
            </div>
            <div class="setting-right">
              <input
                v-model="sessionName"
                type="text"
                placeholder="输入会话名称..."
                class="form-input"
              />
            </div>
          </div>

          <!-- 会话描述 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">会话描述</label>
              <p class="setting-hint">添加会话的详细描述（可选）</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="sessionDescription"
                placeholder="输入会话描述..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- 模型配置 -->
        <section :id="'section-model'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-cpu"></i>
            模型配置
          </h2>
          <p class="section-description">配置会话使用的 AI 模型和相关参数</p>

          <!-- 当前模型 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">当前模型</label>
              <p class="setting-hint">选择此会话使用的 AI 模型</p>
            </div>
            <div class="setting-right">
              <div class="model-selector">
                <div v-if="currentModel" class="selected-model">
                  <div class="model-info">
                    <span class="model-name">{{ currentModel.name }}</span>
                    <span class="model-provider">{{ currentProvider?.name }}</span>
                  </div>
                  <button @click="openModelSelector" class="btn-change">
                    <i class="bi bi-pencil"></i>
                    更换模型
                  </button>
                </div>
                <div v-else class="no-model">
                  <span class="text-muted">未选择模型</span>
                  <button @click="openModelSelector" class="btn-select">
                    <i class="bi bi-plus-circle"></i>
                    选择模型
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 温度参数 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">温度 (Temperature)</label>
              <p class="setting-hint">控制输出的随机性，较低值使输出更确定，较高值使输出更随机</p>
            </div>
            <div class="setting-right">
              <div class="slider-container">
                <input
                  v-model.number="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  class="form-slider"
                />
                <div class="slider-value">{{ temperature.toFixed(1) }}</div>
              </div>
              <div class="slider-labels">
                <span class="label-left">更确定</span>
                <span class="label-right">更随机</span>
              </div>
            </div>
          </div>

          <!-- 最大令牌数 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">最大令牌数 (Max Tokens)</label>
              <p class="setting-hint">控制 AI 响应的最大长度</p>
            </div>
            <div class="setting-right">
              <div class="slider-container">
                <input
                  v-model.number="maxTokens"
                  type="range"
                  min="256"
                  max="8192"
                  step="256"
                  class="form-slider"
                />
                <div class="slider-value">{{ maxTokens }}</div>
              </div>
              <div class="slider-labels">
                <span class="label-left">256</span>
                <span class="label-right">8192</span>
              </div>
            </div>
          </div>

          <!-- Top P -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">Top P</label>
              <p class="setting-hint">核采样参数，控制输出多样性</p>
            </div>
            <div class="setting-right">
              <div class="slider-container">
                <input
                  v-model.number="topP"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  class="form-slider"
                />
                <div class="slider-value">{{ topP.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 系统提示词 -->
        <section :id="'section-system-prompt'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-chat-square-text"></i>
            系统提示词
          </h2>
          <p class="section-description">配置 AI 助手的角色和行为</p>

          <!-- 系统角色 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">系统角色</label>
              <p class="setting-hint">定义 AI 助手的角色和行为方式</p>
            </div>
            <div class="setting-right">
              <textarea
                v-model="systemRole"
                placeholder="例如：你是一个专业的编程助手..."
                class="form-textarea"
                rows="6"
              ></textarea>
            </div>
          </div>

          <!-- 预设模板 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">预设模板</label>
              <p class="setting-hint">快速应用常用的角色模板</p>
            </div>
            <div class="setting-right">
              <div class="preset-templates">
                <button
                  v-for="preset in rolePresets"
                  :key="preset.id"
                  @click="applyPreset(preset)"
                  class="preset-button"
                >
                  <div class="preset-name">{{ preset.name }}</div>
                  <div class="preset-desc">{{ preset.description }}</div>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 高级设置 -->
        <section :id="'section-advanced'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-gear-wide-connected"></i>
            高级设置
          </h2>
          <p class="section-description">配置会话的高级选项</p>

          <!-- 上下文窗口 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">上下文窗口</label>
              <p class="setting-hint">保留的历史消息数量</p>
            </div>
            <div class="setting-right">
              <div class="slider-container">
                <input
                  v-model.number="contextWindow"
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  class="form-slider"
                />
                <div class="slider-value">{{ contextWindow }} 条消息</div>
              </div>
            </div>
          </div>

          <!-- 启用流式输出 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">启用流式输出</label>
              <p class="setting-hint">实时显示 AI 回复内容</p>
            </div>
            <div class="setting-right">
              <label class="switch">
                <input v-model="enableStreaming" type="checkbox" />
                <span class="slider-switch"></span>
              </label>
            </div>
          </div>

          <!-- 自动保存会话 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">自动保存会话</label>
              <p class="setting-hint">自动保存会话历史记录</p>
            </div>
            <div class="setting-right">
              <label class="switch">
                <input v-model="autoSave" type="checkbox" />
                <span class="slider-switch"></span>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { AIProvider, AIModel } from '../types/ai-providers'

const router = useRouter()

// 设置章节
const settingsSections = [
  { id: 'basic', label: '基本信息', icon: 'bi bi-info-circle' },
  { id: 'model', label: '模型配置', icon: 'bi bi-cpu' },
  { id: 'system-prompt', label: '系统提示词', icon: 'bi bi-chat-square-text' },
  { id: 'advanced', label: '高级设置', icon: 'bi bi-gear-wide-connected' }
]

const activeSection = ref('basic')
const contentContainer = ref<HTMLElement | null>(null)

// 基本信息
const sessionName = ref('')
const sessionDescription = ref('')

// 模型配置
const currentProvider = ref<AIProvider | null>(null)
const currentModel = ref<AIModel | null>(null)
const temperature = ref(0.7)
const maxTokens = ref(4096)
const topP = ref(0.9)

// 系统提示词
const systemRole = ref('')

// 角色预设
interface RolePreset {
  id: string
  name: string
  description: string
  prompt: string
}

const rolePresets: RolePreset[] = [
  {
    id: 'general',
    name: '通用助手',
    description: '友好、专业的通用 AI 助手',
    prompt: '你是一个友好、专业的 AI 助手，能够帮助用户解决各种问题。请以清晰、准确的方式回答问题，并在必要时提供详细的解释。'
  },
  {
    id: 'programmer',
    name: '编程助手',
    description: '专注于编程和技术问题',
    prompt: '你是一个专业的编程助手，精通多种编程语言和开发框架。请提供清晰的代码示例、最佳实践建议，并解释技术概念。'
  },
  {
    id: 'translator',
    name: '翻译助手',
    description: '专业的多语言翻译',
    prompt: '你是一个专业的翻译助手，能够在多种语言之间进行准确、流畅的翻译。请保持原文的语气和风格，确保翻译的准确性和自然性。'
  },
  {
    id: 'writer',
    name: '写作助手',
    description: '帮助改进写作质量',
    prompt: '你是一个专业的写作助手，擅长帮助用户改进文章结构、语言表达和写作风格。请提供建设性的反馈和具体的改进建议。'
  }
]

// 高级设置
const contextWindow = ref(10)
const enableStreaming = ref(true)
const autoSave = ref(true)

// 方法
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(`section-${sectionId}`)
  if (element && contentContainer.value) {
    const containerTop = contentContainer.value.scrollTop
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
  const sections = settingsSections.map(s => {
    const element = document.getElementById(`section-${s.id}`)
    return {
      id: s.id,
      top: element ? element.offsetTop - 100 : 0
    }
  })
  
  for (let i = sections.length - 1; i >= 0; i--) {
    if (scrollTop >= sections[i].top) {
      activeSection.value = sections[i].id
      break
    }
  }
}

const openModelSelector = () => {
  // 触发模型选择器
  console.log('打开模型选择器')
}

const applyPreset = (preset: RolePreset) => {
  systemRole.value = preset.prompt
}

// 生命周期
onMounted(() => {
  // 加载会话设置
  console.log('加载会话设置')
})
</script>

<style scoped>
/* ========== 布局 ========== */
.session-settings-view {
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
.form-textarea {
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
.form-textarea:focus {
  border-color: var(--vscode-accent);
}

.form-input:hover,
.form-textarea:hover {
  border-color: var(--vscode-fg-muted);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

/* 滑块控件 */
.slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--vscode-border);
  outline: none;
  cursor: pointer;
}

.form-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--vscode-accent);
  cursor: pointer;
  transition: all 0.2s;
}

.form-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.form-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--vscode-accent);
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.form-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.slider-value {
  min-width: 60px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  background: var(--vscode-input-bg);
  color: var(--vscode-fg);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-switch {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vscode-border);
  border-radius: 24px;
  transition: 0.3s;
  cursor: pointer;
}

.slider-switch:before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider-switch {
  background-color: var(--vscode-accent);
}

input:checked + .slider-switch:before {
  transform: translateX(24px);
}

/* 模型选择器 */
.model-selector {
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  background: var(--vscode-input-bg);
}

.selected-model,
.no-model {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.model-provider {
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.text-muted {
  font-size: 13px;
  color: var(--vscode-fg-muted);
}

.btn-change,
.btn-select {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 2px;
  background: var(--vscode-accent);
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-change:hover,
.btn-select:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 预设模板 */
.preset-templates {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.preset-button {
  padding: 12px;
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  background: var(--vscode-input-bg);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.preset-button:hover {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.preset-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--vscode-fg);
}

.preset-desc {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  line-height: 1.4;
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

