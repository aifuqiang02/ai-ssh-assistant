<template>
  <div class="vscode-titlebar flex items-center text-vscode-fg select-none" style="height: 37px;">
    <!-- 左侧：应用菜单和标题 -->
    <div class="flex items-center space-x-4 pl-4">
      <!-- 应用图标和名称 -->
      <div class="flex items-center space-x-2">
        <svg class="text-vscode-accent" fill="currentColor" viewBox="0 0 16 16" style="width: 20px; height: 20px;">
          <!-- SSH/Terminal 图标设计 -->
          <path d="M2 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2zm0 1h12v8H2V4z"/>
          <path d="M3 6l2 1.5L3 9v1l3-2V7L3 5v1zm4 3h3v1H7V9z"/>
        </svg>
        <span class="text-sm font-medium">AI SSH Assistant</span>
      </div>
      
      <!-- 菜单栏 -->
      <div class="flex items-center space-x-1">
        <button 
          v-for="menu in menus" 
          :key="menu.id"
          @click="toggleMenu(menu.id)"
          :class="['vscode-menu-item', { 'active': activeMenu === menu.id }]"
        >
          {{ menu.label }}
        </button>
      </div>
    </div>
    
    <!-- 中间：当前文件路径 -->
    <div class="flex-1 flex justify-center">
      <div class="text-xs text-vscode-fg-muted truncate max-w-md">
        {{ currentFilePath }}
      </div>
    </div>
    
    <!-- 右侧：模型切换、主题切换和窗口控制按钮 -->
    <div class="flex items-center ml-auto">
      <!-- 大模型切换按钮 -->
      <div class="relative">
        <button 
          @click="toggleModelDropdown"
          class="vscode-window-control px-2"
          style="width: auto; min-width: 46px;"
          :title="`当前模型: ${currentModel.name}`"
        >
          <span class="text-xs font-medium whitespace-nowrap">{{ currentModel.shortName }}</span>
          <svg class="ml-1 inline-block" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1 3l4 4 4-4H1z"/>
          </svg>
        </button>
        
        <!-- 模型选择下拉窗口 -->
        <div 
          v-if="showModelDropdown"
          class="model-dropdown absolute top-full right-0 mt-1 bg-vscode-bg-light border border-vscode-border shadow-lg z-50 rounded"
          style="width: 280px;"
        >
          <!-- 标题栏 -->
          <div class="flex items-center justify-between px-3 py-2 border-b border-vscode-border">
            <span class="text-sm font-medium text-vscode-fg">选择大模型</span>
            <button 
              @click="openModelSettings"
              class="model-settings-btn p-1 rounded hover:bg-vscode-bg-lighter"
              title="模型设置"
            >
              <i class="bi bi-gear" style="font-size: 14px;"></i>
            </button>
          </div>
          
          <!-- 模型列表 -->
          <div class="py-1 max-h-96 overflow-y-auto">
            <div 
              v-for="model in availableModels" 
              :key="model.id"
              @click="selectModel(model)"
              :class="[
                'model-dropdown-item px-3 py-2 cursor-pointer transition-colors',
                currentModel.id === model.id ? 'bg-vscode-bg-lighter' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 flex-1">
                  <!-- 厂家 Logo -->
                  <div 
                    class="model-logo-container flex-shrink-0"
                    :style="model.logoStyle"
                  >
                    <svg 
                      :width="model.logoSize || 18" 
                      :height="model.logoSize || 18" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      v-html="model.logoSvg"
                    ></svg>
                  </div>
                  
                  <!-- 模型名称和徽章 -->
                  <div class="flex items-center gap-2 flex-1">
                    <span class="text-sm font-medium text-vscode-fg">{{ model.name }}</span>
                    <span 
                      v-if="model.badge"
                      :class="[
                        'text-xs px-1.5 py-0.5 rounded',
                        model.badge === 'free' ? 'bg-green-500/20 text-green-400' : 
                        model.badge === 'pro' ? 'bg-blue-500/20 text-blue-400' : ''
                      ]"
                    >
                      {{ model.badge === 'free' ? '免费' : '专业' }}
                    </span>
                  </div>
                </div>
                
                <!-- 选中标记 -->
                <svg 
                  v-if="currentModel.id === model.id"
                  class="text-vscode-accent flex-shrink-0 ml-2"
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快捷主题切换按钮 -->
      <button 
        @click="toggleTheme"
        class="vscode-window-control"
        :title="`当前主题: ${currentThemeLabel}`"
      >
        <svg v-if="mode === 'light'" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <!-- 太阳图标 -->
          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
        </svg>
        <svg v-else-if="mode === 'dark'" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <!-- 月亮图标 -->
          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <!-- 自动图标 -->
          <path d="M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zM3.732 1.732a.5.5 0 0 1 .707 0l1.415 1.415a.5.5 0 1 1-.708.707L3.732 2.439a.5.5 0 0 1 0-.707zM0 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 8zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
          <path d="M8 16a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5z"/>
        </svg>
      </button>
      <button 
        @click="minimizeWindow"
        class="vscode-window-control"
        title="最小化"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M0 5h10v1H0z"/>
        </svg>
      </button>
      <button 
        @click="maximizeWindow"
        class="vscode-window-control"
        title="最大化"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z"/>
        </svg>
      </button>
      <button 
        @click="closeWindow"
        class="vscode-window-control vscode-window-control-close"
        title="关闭"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M1.414 0L5 3.586L8.586 0L10 1.414L6.414 5L10 8.586L8.586 10L5 6.414L1.414 10L0 8.586L3.586 5L0 1.414L1.414 0z"/>
        </svg>
      </button>
    </div>
    
    <!-- 下拉菜单 -->
    <div 
      v-if="activeMenu"
      class="vscode-dropdown absolute top-8 left-0 bg-gray-800 border border-gray-600 shadow-lg z-50"
      :style="{ left: menuPosition + 'px' }"
    >
      <div 
        v-for="item in currentMenuItems" 
        :key="item.id"
        @click="executeMenuAction(item.action || '')"
        class="vscode-dropdown-item"
      >
        <span>{{ item.label }}</span>
        <span v-if="item.shortcut" class="text-xs text-gray-400">{{ item.shortcut }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'

// 定义 emits
const emit = defineEmits<{
  'open-settings': []
}>()

// 主题 Store
const themeStore = useThemeStore()
const { mode, currentTheme } = storeToRefs(themeStore)

// 响应式数据
const activeMenu = ref<string | null>(null)
const menuPosition = ref(0)
const currentFilePath = ref('AI SSH Assistant - 欢迎')

// 模型选择相关
const showModelDropdown = ref(false)

// 模型接口定义
interface AIModel {
  id: string
  name: string
  shortName: string
  badge?: 'free' | 'pro'
  logoSvg: string
  logoStyle?: string
  logoSize?: number
}

// 当前选择的模型
const currentModel = ref<AIModel>({
  id: 'auto-router',
  name: 'Auto Router',
  shortName: 'Auto',
  badge: 'free',
  logoSvg: '<path fill="currentColor" fill-rule="evenodd" d="M16.804 1.957l7.22 4.105v.087L16.73 10.21l.017-2.117-.821-.03c-1.059-.028-1.611.002-2.268.11-1.064.175-2.038.577-3.147 1.352L8.345 11.03c-.284.195-.495.336-.68.455l-.515.322-.397.234.385.23.53.338c.476.314 1.17.796 2.701 1.866 1.11.775 2.083 1.177 3.147 1.352l.3.045c.694.091 1.375.094 2.825.033l.022-2.159 7.22 4.105v.087L16.589 22l.014-1.862-.635.022c-1.386.042-2.137.002-3.138-.162-1.694-.28-3.26-.926-4.881-2.059l-2.158-1.5a21.997 21.997 0 00-.755-.498l-.467-.28a55.927 55.927 0 00-.76-.43C2.908 14.73.563 14.116 0 14.116V9.888l.14.004c.564-.007 2.91-.622 3.809-1.124l1.016-.58.438-.274c.428-.28 1.072-.726 2.686-1.853 1.621-1.133 3.186-1.78 4.881-2.059 1.152-.19 1.974-.213 3.814-.138l.02-1.907z"/>',
  logoStyle: 'background: rgb(101, 102, 241); border-radius: 6px; color: rgb(255, 255, 255); height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;'
})

// 可用模型列表
const availableModels = ref<AIModel[]>([
  {
    id: 'auto-router',
    name: 'Auto Router',
    shortName: 'Auto',
    badge: 'free',
    logoSvg: '<path fill="currentColor" fill-rule="evenodd" d="M16.804 1.957l7.22 4.105v.087L16.73 10.21l.017-2.117-.821-.03c-1.059-.028-1.611.002-2.268.11-1.064.175-2.038.577-3.147 1.352L8.345 11.03c-.284.195-.495.336-.68.455l-.515.322-.397.234.385.23.53.338c.476.314 1.17.796 2.701 1.866 1.11.775 2.083 1.177 3.147 1.352l.3.045c.694.091 1.375.094 2.825.033l.022-2.159 7.22 4.105v.087L16.589 22l.014-1.862-.635.022c-1.386.042-2.137.002-3.138-.162-1.694-.28-3.26-.926-4.881-2.059l-2.158-1.5a21.997 21.997 0 00-.755-.498l-.467-.28a55.927 55.927 0 00-.76-.43C2.908 14.73.563 14.116 0 14.116V9.888l.14.004c.564-.007 2.91-.622 3.809-1.124l1.016-.58.438-.274c.428-.28 1.072-.726 2.686-1.853 1.621-1.133 3.186-1.78 4.881-2.059 1.152-.19 1.974-.213 3.814-.138l.02-1.907z"/>',
    logoStyle: 'background: rgb(101, 102, 241); border-radius: 6px; color: rgb(255, 255, 255); height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3.1',
    shortName: 'DeepSeek V3.1',
    logoSvg: '<path fill="currentColor" fill-rule="evenodd" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L19.764 8 12 11.764 4.236 8 12 4.236zM4 9.236l7 3.5v7.528l-7-3.5V9.236zm16 0v7.528l-7 3.5v-7.528l7-3.5z"/>',
    logoStyle: 'background: rgb(77, 107, 254); border-radius: 6px; color: rgb(255, 255, 255); height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;'
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    shortName: 'Gemini',
    logoSvg: '<path d="M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z" fill="#4285F4"/><path d="M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z" fill="#34A853"/><path d="M5.839 14.175a6.867 6.867 0 01-.373-2.175c0-.756.135-1.489.361-2.175l-.006-.145-3.507-2.67-.115.053A10.869 10.869 0 001 12c0 1.782.446 3.464 1.199 4.937l3.64-2.762z" fill="#FBBC05"/><path d="M12.225 5.253c1.738 0 2.91.737 3.578 1.353l2.613-2.506C16.787 2.546 14.243 1 12.225 1 7.835 1 4.043 3.469 2.199 7.063l3.628 2.762c.924-2.696 3.547-4.572 6.398-4.572z" fill="#EB4335"/>',
    logoStyle: 'background: rgb(255, 255, 255); border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset; height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;'
  },
  {
    id: 'grok-fast',
    name: 'Grok Code Fast 1',
    shortName: 'Grok Fast',
    logoSvg: '<path fill="currentColor" fill-rule="evenodd" d="M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z"/>',
    logoStyle: 'background: rgb(255, 255, 255); border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset; color: rgb(0, 0, 0); height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;',
    logoSize: 14.6
  },
  {
    id: 'grok-free',
    name: 'Grok 4 Fast (free)',
    shortName: 'Grok Free',
    badge: 'free',
    logoSvg: '<path fill="currentColor" fill-rule="evenodd" d="M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z"/>',
    logoStyle: 'background: rgb(255, 255, 255); border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset; color: rgb(0, 0, 0); height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;',
    logoSize: 14.6
  },
  {
    id: 'deepseek-free',
    name: 'DeepSeek V3.1 (free)',
    shortName: 'DeepSeek Free',
    badge: 'free',
    logoSvg: '<path fill="currentColor" fill-rule="evenodd" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L19.764 8 12 11.764 4.236 8 12 4.236zM4 9.236l7 3.5v7.528l-7-3.5V9.236zm16 0v7.528l-7 3.5v-7.528l7-3.5z"/>',
    logoStyle: 'background: rgb(77, 107, 254); border-radius: 6px; color: rgb(255, 255, 255); height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;'
  },
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    shortName: 'GPT-5 Mini',
    badge: 'pro',
    logoSvg: '<path fill="currentColor" d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"/>',
    logoStyle: 'background: rgb(0, 0, 0); border-radius: 6px; color: rgb(255, 255, 255); height: 24px; width: 24px; display: flex; align-items: center; justify-content: center;'
  }
])

// 当前主题标签
const currentThemeLabel = computed(() => {
  switch (mode.value) {
    case 'light':
      return '☀️ 浅色'
    case 'dark':
      return '🌙 深色'
    case 'auto':
      return '🔄 跟随系统'
    default:
      return mode.value
  }
})

// 菜单配置
const menus = ref([
  { id: 'file', label: '文件' },
  { id: 'edit', label: '编辑' },
  { id: 'view', label: '查看' },
  { id: 'terminal', label: '终端' },
  { id: 'help', label: '帮助' }
])

// 菜单项配置
interface MenuItem {
  id: string
  label: string
  action: string
  shortcut?: string
  type?: string
}

interface MenuItems {
  [key: string]: MenuItem[]
}

const menuItems: MenuItems = {
  file: [
    { id: 'new', label: '新建连接', action: 'new-connection', shortcut: 'Ctrl+N' },
    { id: 'open', label: '打开文件', action: 'open-file', shortcut: 'Ctrl+O' },
    { id: 'save', label: '保存', action: 'save', shortcut: 'Ctrl+S' },
    { id: 'separator1', label: '', action: '', type: 'separator' },
    { id: 'exit', label: '退出', action: 'exit', shortcut: 'Alt+F4' }
  ],
  edit: [
    { id: 'undo', label: '撤销', action: 'undo', shortcut: 'Ctrl+Z' },
    { id: 'redo', label: '重做', action: 'redo', shortcut: 'Ctrl+Y' },
    { id: 'separator1', label: '', action: '', type: 'separator' },
    { id: 'copy', label: '复制', action: 'copy', shortcut: 'Ctrl+C' },
    { id: 'paste', label: '粘贴', action: 'paste', shortcut: 'Ctrl+V' }
  ],
  view: [
    { id: 'sidebar', label: '切换侧边栏', action: 'toggle-sidebar', shortcut: 'Ctrl+B' },
    { id: 'fullscreen', label: '全屏', action: 'toggle-fullscreen', shortcut: 'F11' },
    { id: 'zoom-in', label: '放大', action: 'zoom-in', shortcut: 'Ctrl+=' },
    { id: 'zoom-out', label: '缩小', action: 'zoom-out', shortcut: 'Ctrl+-' }
  ],
  terminal: [
    { id: 'new-terminal', label: '新建终端', action: 'new-terminal', shortcut: 'Ctrl+Shift+`' },
    { id: 'split-terminal', label: '拆分终端', action: 'split-terminal' }
  ],
  help: [
    { id: 'docs', label: '文档', action: 'open-docs' },
    { id: 'shortcuts', label: '键盘快捷键', action: 'show-shortcuts' },
    { id: 'about', label: '关于', action: 'show-about' }
  ]
}

// 计算当前菜单项
const currentMenuItems = computed(() => {
  if (!activeMenu.value) return []
  return menuItems[activeMenu.value as keyof typeof menuItems] || []
})

// 方法
const toggleMenu = (menuId: string) => {
  if (activeMenu.value === menuId) {
    activeMenu.value = null
  } else {
    activeMenu.value = menuId
    // 计算菜单位置（简化版）
    menuPosition.value = 100 // 这里应该根据实际菜单位置计算
  }
}

const executeMenuAction = (action: string) => {
  activeMenu.value = null
  
  switch (action) {
    case 'new-connection':
      // 新建连接逻辑
      break
    case 'toggle-sidebar':
      // 切换侧边栏逻辑
      break
    case 'toggle-fullscreen':
      if (window.electronAPI?.toggleFullscreen) {
        window.electronAPI.toggleFullscreen()
      }
      break
    // ... 其他菜单操作
  }
}

const minimizeWindow = () => {
  if (window.electronAPI?.minimizeWindow) {
    window.electronAPI.minimizeWindow()
  }
}

const maximizeWindow = () => {
  if (window.electronAPI?.maximizeWindow) {
    window.electronAPI.maximizeWindow()
  }
}

const closeWindow = () => {
  if (window.electronAPI?.closeWindow) {
    window.electronAPI.closeWindow()
  }
}

// 主题切换
const toggleTheme = () => {
  themeStore.toggleMode()
  console.log('Theme toggled to:', mode.value)
}

// 模型切换相关方法
const toggleModelDropdown = () => {
  showModelDropdown.value = !showModelDropdown.value
}

const selectModel = (model: AIModel) => {
  currentModel.value = model
  showModelDropdown.value = false
  console.log('Selected model:', model.name)
  // TODO: 这里可以调用 AI 服务切换模型
}

const openModelSettings = () => {
  showModelDropdown.value = false
  // 发出打开设置页面的事件
  emit('open-settings')
  console.log('Opening model settings...')
}

// 点击外部关闭菜单和下拉框
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  // 如果点击的不是模型下拉框相关元素，则关闭
  if (!target.closest('.model-dropdown') && !target.closest('.vscode-window-control')) {
    showModelDropdown.value = false
  }
  activeMenu.value = null
}

// 监听点击事件
document.addEventListener('click', handleClickOutside)
</script>

<style scoped>
.vscode-titlebar {
  background-color: var(--vscode-bg-light) !important;
  border-bottom: 1px solid var(--vscode-border);
  -webkit-app-region: drag;
  position: relative;
}

.vscode-titlebar > div:last-child {
  margin-left: auto;
  margin-right: 0;
}

.vscode-menu-item {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease, background-color 0.15s ease;
  -webkit-app-region: no-drag;
}

.vscode-menu-item:hover {
  background-color: var(--vscode-bg-lighter);
}

.vscode-menu-item.active {
  background-color: var(--vscode-bg-lighter);
}

.vscode-window-control {
  width: 46px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vscode-fg);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  -webkit-app-region: no-drag;
}

.vscode-window-control:hover {
  background-color: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

.vscode-window-control-close:hover {
  background-color: #e81123 !important;
  color: white;
}

.vscode-window-control svg {
  opacity: 0.9;
}

.vscode-window-control:hover svg {
  opacity: 1;
}

.vscode-dropdown {
  min-width: 200px;
  padding: 4px 0;
  background-color: var(--vscode-bg-light);
  border-color: var(--vscode-border);
}

.vscode-dropdown-item {
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  color: var(--vscode-fg);
}

.vscode-dropdown-item:hover {
  background-color: var(--vscode-bg-lighter);
}

.vscode-dropdown-item[data-type="separator"] {
  border-top: 1px solid var(--vscode-border);
  margin: 0.25rem 0;
  height: 1px;
  padding: 0;
}

/* 模型下拉窗口样式 */
.model-dropdown {
  -webkit-app-region: no-drag;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.model-dropdown-item:hover {
  background-color: var(--vscode-bg-lighter);
}

.model-settings-btn {
  transition: background-color 0.15s ease;
  color: var(--vscode-fg);
}

.model-settings-btn:hover {
  background-color: var(--vscode-bg-lighter);
}

.model-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-logo-container svg {
  flex: 0 0 auto;
  line-height: 1;
}

/* VSCode 风格窗口控制按钮完成 */
</style>