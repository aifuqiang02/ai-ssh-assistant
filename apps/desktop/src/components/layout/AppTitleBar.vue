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
    
    <!-- 右侧：窗口控制按钮 -->
    <div class="flex items-center ml-auto">
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

// 响应式数据
const activeMenu = ref<string | null>(null)
const menuPosition = ref(0)
const currentFilePath = ref('AI SSH Assistant - 欢迎')

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

// 点击外部关闭菜单
const handleClickOutside = () => {
  activeMenu.value = null
}

// 监听点击事件
document.addEventListener('click', handleClickOutside)
</script>

<style scoped>
.vscode-titlebar {
  background-color: #252526 !important;
  border-bottom: 1px solid #3c3c3c;
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
  background-color: #374151;
}

.vscode-menu-item.active {
  background-color: #374151;
}

.vscode-window-control {
  width: 46px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cccccc;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
  -webkit-app-region: no-drag;
}

.vscode-window-control:hover {
  background-color: rgba(255, 255, 255, 0.1);
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
}

.vscode-dropdown-item {
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.vscode-dropdown-item:hover {
  background-color: #374151;
}

.vscode-dropdown-item[data-type="separator"] {
  border-top: 1px solid #4b5563;
  margin: 0.25rem 0;
  height: 1px;
  padding: 0;
}

/* VSCode 风格窗口控制按钮完成 */
</style>