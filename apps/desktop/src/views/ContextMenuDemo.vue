<template>
  <div class="context-menu-demo">
    <h2>右键菜单组件示例</h2>
    
    <div class="demo-section">
      <h3>基础菜单</h3>
      <div class="demo-box" @contextmenu="handleBasicMenu">
        右键点击这里显示基础菜单
      </div>
    </div>
    
    <div class="demo-section">
      <h3>带图标和快捷键</h3>
      <div class="demo-box" @contextmenu="handleFullMenu">
        右键点击这里显示完整菜单
      </div>
    </div>
    
    <div class="demo-section">
      <h3>文件操作菜单</h3>
      <div class="demo-box" @contextmenu="handleFileMenu">
        右键点击这里显示文件操作菜单
      </div>
    </div>
    
    <div class="demo-section">
      <h3>危险操作</h3>
      <div class="demo-box" @contextmenu="handleDangerMenu">
        右键点击这里显示危险操作菜单
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <ContextMenu
      :visible="menuVisible"
      :x="menuX"
      :y="menuY"
      :items="currentMenuItems"
      @close="menuVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContextMenu, { type ContextMenuItem } from '../components/common/ContextMenu.vue'
import { $confirm } from '@/composables/useDialog'

const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const currentMenuItems = ref<ContextMenuItem[]>([])

// 基础菜单
const basicMenuItems: ContextMenuItem[] = [
  {
    label: '选项 1',
    onClick: () => alert('选项 1 被点击')
  },
  {
    label: '选项 2',
    onClick: () => alert('选项 2 被点击')
  },
  {
    label: '选项 3',
    onClick: () => alert('选项 3 被点击')
  }
]

// 完整菜单
const fullMenuItems: ContextMenuItem[] = [
  {
    label: '复制',
    icon: 'bi bi-clipboard',
    shortcut: 'Ctrl+C',
    onClick: () => alert('复制')
  },
  {
    label: '粘贴',
    icon: 'bi bi-clipboard-check',
    shortcut: 'Ctrl+V',
    onClick: () => alert('粘贴')
  },
  {
    label: '剪切',
    icon: 'bi bi-scissors',
    shortcut: 'Ctrl+X',
    disabled: true,
    onClick: () => alert('剪切（已禁用）')
  },
  { type: 'divider' },
  {
    label: '全选',
    icon: 'bi bi-check2-square',
    shortcut: 'Ctrl+A',
    onClick: () => alert('全选')
  }
]

// 文件操作菜单
const fileMenuItems: ContextMenuItem[] = [
  {
    label: '新建文件',
    icon: 'bi bi-file-earmark-plus',
    onClick: () => alert('新建文件')
  },
  {
    label: '新建文件夹',
    icon: 'bi bi-folder-plus',
    onClick: () => alert('新建文件夹')
  },
  { type: 'divider' },
  {
    label: '打开',
    icon: 'bi bi-folder2-open',
    shortcut: 'Enter',
    onClick: () => alert('打开')
  },
  {
    label: '重命名',
    icon: 'bi bi-pencil',
    shortcut: 'F2',
    onClick: () => alert('重命名')
  },
  { type: 'divider' },
  {
    label: '复制路径',
    icon: 'bi bi-clipboard',
    onClick: () => alert('已复制路径')
  },
  {
    label: '在文件管理器中显示',
    icon: 'bi bi-folder',
    onClick: () => alert('在文件管理器中显示')
  }
]

// 危险操作菜单
const dangerMenuItems: ContextMenuItem[] = [
  {
    label: '编辑',
    icon: 'bi bi-pencil',
    onClick: () => alert('编辑')
  },
  {
    label: '复制',
    icon: 'bi bi-clipboard',
    onClick: () => alert('复制')
  },
  { type: 'divider' },
  {
    label: '删除',
    icon: 'bi bi-trash',
    danger: true,
    onClick: async () => {
      if (await $confirm('确定要删除吗？')) {
        alert('已删除')
      }
    }
  },
  {
    label: '永久删除',
    icon: 'bi bi-trash3',
    danger: true,
    onClick: async () => {
      if (await $confirm('确定要永久删除吗？此操作无法撤销！')) {
        alert('已永久删除')
      }
    }
  }
]

function showMenu(e: MouseEvent, items: ContextMenuItem[]) {
  e.preventDefault()
  menuX.value = e.clientX
  menuY.value = e.clientY
  currentMenuItems.value = items
  menuVisible.value = true
}

function handleBasicMenu(e: MouseEvent) {
  showMenu(e, basicMenuItems)
}

function handleFullMenu(e: MouseEvent) {
  showMenu(e, fullMenuItems)
}

function handleFileMenu(e: MouseEvent) {
  showMenu(e, fileMenuItems)
}

function handleDangerMenu(e: MouseEvent) {
  showMenu(e, dangerMenuItems)
}
</script>

<style scoped>
.context-menu-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 2rem;
  color: var(--bs-body-color);
}

.demo-section {
  margin-bottom: 2rem;
}

.demo-section h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--bs-secondary-color);
}

.demo-box {
  padding: 3rem 2rem;
  border: 2px dashed var(--bs-border-color);
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bs-body-bg);
  color: var(--bs-secondary-color);
}

.demo-box:hover {
  border-color: var(--bs-primary);
  background: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}
</style>

