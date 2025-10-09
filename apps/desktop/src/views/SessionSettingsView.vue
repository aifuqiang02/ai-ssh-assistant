<template>
  <div class="session-settings-view">
    <!-- 左侧导航树 -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">会话设置</h3>
        <!-- 保存状态指示器 -->
        <div class="save-status" v-if="saveStatus">
          <i :class="['bi', saveStatus === 'saving' ? 'bi-hourglass-split' : saveStatus === 'saved' ? 'bi-check-circle' : 'bi-exclamation-triangle']"></i>
          <span>{{ saveStatusText }}</span>
        </div>
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
              <input 
                v-model.number="contextWindow" 
                type="number" 
                class="form-input"
                min="1"
                max="50"
              />
            </div>
          </div>

          <!-- 启用流式输出 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">启用流式输出</label>
              <p class="setting-hint">实时显示 AI 回复内容</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="enableStreaming" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { chatService } from '../services/chat.service'
import type { ChatSession } from '@ai-ssh/shared'

const router = useRouter()

// 设置章节
const settingsSections = [
  { id: 'basic', label: '基本信息', icon: 'bi bi-info-circle' },
  { id: 'advanced', label: '高级设置', icon: 'bi bi-gear-wide-connected' }
]

const activeSection = ref('basic')
const contentContainer = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

// 会话管理
const currentSessionId = ref<string>('')
const isLoading = ref(true)

// 保存状态
type SaveStatus = 'saving' | 'saved' | 'error' | null
const saveStatus = ref<SaveStatus>(null)
const saveStatusText = computed(() => {
  switch (saveStatus.value) {
    case 'saving': return '保存中...'
    case 'saved': return '已保存'
    case 'error': return '保存失败'
    default: return ''
  }
})

// 基本信息
const sessionName = ref('')

// 高级设置
const contextWindow = ref(50)
const enableStreaming = ref(true)

// 防抖定时器
let saveTimer: ReturnType<typeof setTimeout> | null = null

// 方法
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
  const sections = settingsSections.map(s => ({
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

// 加载会话配置
const loadSessionConfig = async () => {
  try {
    // 从 localStorage 获取当前会话 ID
    const sessionId = localStorage.getItem('current-session-id')
    if (!sessionId) {
      console.warn('[SessionSettings] ⚠️ 未找到当前会话 ID')
      isLoading.value = false
      return
    }
    
    currentSessionId.value = sessionId
    console.log('[SessionSettings] 📥 加载会话配置:', sessionId)
    
    // 从数据库加载会话信息
    const session = await chatService.getSession(sessionId)
    if (!session) {
      console.error('[SessionSettings] ❌ 会话不存在:', sessionId)
      isLoading.value = false
      return
    }
    
    // 填充表单
    sessionName.value = session.title || ''
    
    // 从 config 中加载高级设置
    if (session.config) {
      contextWindow.value = (session.config as any).contextWindow || 50
      enableStreaming.value = (session.config as any).enableStreaming !== false
    }
    
    console.log('[SessionSettings] ✅ 会话配置加载成功')
    isLoading.value = false
    
  } catch (error: any) {
    console.error('[SessionSettings] ❌ 加载会话配置失败:', error)
    isLoading.value = false
  }
}

// 保存会话配置（带防抖）
const saveSessionConfig = () => {
  if (!currentSessionId.value) {
    console.warn('[SessionSettings] ⚠️ 无法保存：未找到会话 ID')
    return
  }
  
  // 清除之前的定时器
  if (saveTimer) {
    clearTimeout(saveTimer)
  }
  
  // 设置新的定时器（800ms 防抖）
  saveTimer = setTimeout(async () => {
    try {
      saveStatus.value = 'saving'
      
      // 构建更新数据
      const updateData = {
        title: sessionName.value,
        config: {
          contextWindow: contextWindow.value,
          enableStreaming: enableStreaming.value
        }
      }
      
      // 保存到数据库
      await chatService.updateSession(currentSessionId.value, updateData)
      
      console.log('[SessionSettings] ✅ 会话配置已保存', updateData)
      saveStatus.value = 'saved'
      
      // 2秒后隐藏"已保存"提示
      setTimeout(() => {
        if (saveStatus.value === 'saved') {
          saveStatus.value = null
        }
      }, 2000)
      
    } catch (error: any) {
      console.error('[SessionSettings] ❌ 保存会话配置失败:', error)
      saveStatus.value = 'error'
      
      // 3秒后隐藏错误提示
      setTimeout(() => {
        if (saveStatus.value === 'error') {
          saveStatus.value = null
        }
      }, 3000)
    }
  }, 800)
}

// 监听字段变化，自动保存
watch([sessionName, contextWindow, enableStreaming], () => {
  if (!isLoading.value && currentSessionId.value) {
    saveSessionConfig()
  }
}, { deep: true })

// 生命周期
onMounted(async () => {
  await loadSessionConfig()
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

.save-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--vscode-fg-muted);
  animation: fadeIn 0.3s ease-in-out;
}

.save-status i {
  font-size: 14px;
}

.save-status i.bi-hourglass-split {
  color: var(--vscode-accent);
  animation: spin 1s linear infinite;
}

.save-status i.bi-check-circle {
  color: #27ae60;
}

.save-status i.bi-exclamation-triangle {
  color: #e74c3c;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  color: var(--vscode-fg);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input {
  padding: 0 12px;
}

.form-textarea {
  padding: 8px 12px;
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--vscode-accent);
}

.form-input:hover,
.form-textarea:hover {
  border-color: var(--vscode-fg-muted);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vscode-border);
  border-radius: 24px;
  transition: 0.3s;
}

.toggle-slider:before {
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

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--vscode-accent);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
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

