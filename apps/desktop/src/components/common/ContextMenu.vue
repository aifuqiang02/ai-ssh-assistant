<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="menuRef"
      class="context-menu"
      :style="menuStyle"
      @click.stop
    >
      <template v-for="(item, index) in items" :key="index">
        <!-- 分隔线 -->
        <div v-if="item.type === 'divider'" class="menu-divider"></div>
        
        <!-- 菜单项 -->
        <div
          v-else
          class="menu-item"
          :class="{
            'disabled': item.disabled,
            'danger': item.danger
          }"
          @click="handleItemClick(item)"
        >
          <i v-if="item.icon" class="menu-icon" :class="item.icon"></i>
          <span class="menu-label">{{ item.label }}</span>
          <span v-if="item.shortcut" class="menu-shortcut">{{ item.shortcut }}</span>
          <i v-if="item.children" class="menu-arrow bi bi-chevron-right"></i>
        </div>
      </template>
    </div>
    
    <!-- 遮罩层（用于点击外部关闭） -->
    <div
      v-if="visible"
      class="context-menu-backdrop"
      @click="close"
      @contextmenu.prevent="close"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

export interface ContextMenuItem {
  type?: 'item' | 'divider'
  label?: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  danger?: boolean  // 危险操作（如删除），显示为红色
  children?: ContextMenuItem[]  // 子菜单（暂不实现）
  onClick?: () => void
}

interface Props {
  items: ContextMenuItem[]
  visible: boolean
  x: number
  y: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const menuRef = ref<HTMLElement | null>(null)

// 计算菜单位置（避免超出屏幕）
const menuStyle = computed(() => {
  let x = props.x
  let y = props.y
  
  if (menuRef.value) {
    const menuRect = menuRef.value.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    // 如果右侧超出屏幕，向左偏移
    if (x + menuRect.width > windowWidth) {
      x = windowWidth - menuRect.width - 10
    }
    
    // 如果底部超出屏幕，向上偏移
    if (y + menuRect.height > windowHeight) {
      y = windowHeight - menuRect.height - 10
    }
    
    // 确保不超出左侧和顶部
    x = Math.max(10, x)
    y = Math.max(10, y)
  }
  
  return {
    left: `${x}px`,
    top: `${y}px`
  }
})

// 监听可见性变化，调整位置
watch(() => props.visible, async (val) => {
  if (val) {
    await nextTick()
    // 触发重新计算位置
    if (menuRef.value) {
      menuRef.value.style.opacity = '1'
    }
  }
})

function handleItemClick(item: ContextMenuItem) {
  if (item.disabled) return
  
  item.onClick?.()
  close()
}

function close() {
  emit('close')
}

// 键盘事件：Esc 关闭
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) {
    close()
  }
}

// 添加键盘监听
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
.context-menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background: transparent;
}

.context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 180px;
  background: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  gap: 10px;
  user-select: none;
}

.menu-item:hover:not(.disabled) {
  background: var(--bs-secondary-bg);
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.menu-item.danger {
  color: var(--bs-danger);
}

.menu-item.danger:hover:not(.disabled) {
  background: var(--bs-danger-bg-subtle);
}

.menu-icon {
  width: 18px;
  font-size: 0.875rem;
  flex-shrink: 0;
  text-align: center;
}

.menu-label {
  flex: 1;
}

.menu-shortcut {
  font-size: 0.75rem;
  color: var(--bs-secondary-color);
  opacity: 0.7;
}

.menu-arrow {
  font-size: 0.75rem;
  color: var(--bs-secondary-color);
  margin-left: auto;
}

.menu-divider {
  height: 1px;
  background: var(--bs-border-color);
  margin: 4px 0;
}
</style>

