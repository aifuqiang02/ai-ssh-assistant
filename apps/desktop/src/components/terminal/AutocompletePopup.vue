<template>
  <Teleport to="body">
    <div
      v-if="visible && suggestions.length > 0"
      ref="popupRef"
      class="autocomplete-popup"
      :style="popupStyle"
    >
      <div class="autocomplete-header">
        <span class="autocomplete-title">
          <span class="icon">✨</span>
          建议 ({{ suggestions.length }})
        </span>
        <span class="autocomplete-hint">
          <kbd>↑</kbd><kbd>↓</kbd> 选择
          <kbd>Tab</kbd> 插入
          <kbd>Esc</kbd> 关闭
        </span>
      </div>
      
      <div class="autocomplete-list" ref="listRef">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="autocomplete-item"
          :class="{
            'active': index === selectedIndex,
            [`type-${suggestion.type}`]: true
          }"
          @mouseenter="selectedIndex = index"
          @click="selectSuggestion(suggestion)"
        >
          <span class="item-icon" v-if="suggestion.icon">{{ suggestion.icon }}</span>
          <span class="item-name">{{ suggestion.name }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Suggestion, SuggestionType } from '@/types/autocomplete'

interface Props {
  suggestions: Suggestion[]
  visible: boolean
  position: { x: number; y: number }
}

interface Emits {
  (e: 'select', suggestion: Suggestion): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const popupRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()
const selectedIndex = ref(-1) // -1 表示无选中

const popupStyle = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`
}))

// 暴露弹窗的实际高度给父组件
function getPopupHeight(): number {
  if (!popupRef.value) return 0
  return popupRef.value.offsetHeight
}

// 监听建议列表变化,重置为无选中状态
watch(() => props.suggestions, () => {
  selectedIndex.value = -1 // 默认不选中任何项
})

// 监听可见性变化
watch(() => props.visible, (visible) => {
  if (visible) {
    selectedIndex.value = -1 // 默认不选中任何项
  }
})

/**
 * 选择建议
 */
function selectSuggestion(suggestion: Suggestion) {
  emit('select', suggestion)
}

/**
 * 向上移动选择
 */
function moveUp() {
  if (selectedIndex.value === -1) {
    // 如果没有选中,从最后一项开始
    selectedIndex.value = props.suggestions.length - 1
  } else if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
  scrollToSelected()
}

/**
 * 向下移动选择
 */
function moveDown() {
  if (selectedIndex.value === -1) {
    // 如果没有选中,从第一项开始
    selectedIndex.value = 0
  } else if (selectedIndex.value < props.suggestions.length - 1) {
    selectedIndex.value++
  }
  scrollToSelected()
}

/**
 * 选择当前项 (Tab 键)
 * 注意：Enter 键不应该在这里处理，应该让终端正常处理
 */
function selectCurrent() {
  // 只有当有选中项时才执行
  if (selectedIndex.value !== -1 && props.suggestions[selectedIndex.value]) {
    selectSuggestion(props.suggestions[selectedIndex.value])
  }
  // 如果没有选中项，不做任何操作（让 Enter 键正常提交命令）
}

/**
 * 滚动到选中项
 */
function scrollToSelected() {
  if (!listRef.value) return
  
  const items = listRef.value.querySelectorAll('.autocomplete-item')
  const selectedItem = items[selectedIndex.value] as HTMLElement
  
  if (selectedItem) {
    selectedItem.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth'
    })
  }
}

/**
 * 获取类型标签
 */
function getTypeLabel(type: SuggestionType): string {
  const labels: Record<SuggestionType, string> = {
    subcommand: '命令',
    option: '选项',
    arg: '参数',
    file: '文件',
    folder: '目录',
    special: '特殊'
  }
  return labels[type] || type
}

/**
 * 检查是否有选中项
 */
function hasSelection(): boolean {
  return selectedIndex.value !== -1
}

// 暴露方法给父组件
defineExpose({
  moveUp,
  moveDown,
  selectCurrent,
  getPopupHeight,
  hasSelection
})
</script>

<style scoped>
.autocomplete-popup {
  position: fixed;
  z-index: 9999;
  background: var(--vscode-editorSuggestWidget-background, #2D2D2D);
  border: 1px solid var(--vscode-editorSuggestWidget-border, #454545);
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  min-width: 300px;
  max-width: 500px;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.autocomplete-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vscode-editorSuggestWidget-selectedBackground, #2A2D2E);
  border-bottom: 1px solid var(--vscode-editorSuggestWidget-border, #454545);
  font-size: 12px;
}

.autocomplete-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vscode-editorSuggestWidget-foreground, #CCCCCC);
  font-weight: 500;
}

.autocomplete-title .icon {
  font-size: 14px;
}

.autocomplete-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--vscode-descriptionForeground);
  font-size: 11px;
}

.autocomplete-hint kbd {
  padding: 2px 6px;
  background: var(--vscode-keybindingLabel-background);
  border: 1px solid var(--vscode-keybindingLabel-border);
  border-radius: 3px;
  color: var(--vscode-keybindingLabel-foreground);
  font-family: monospace;
  font-size: 10px;
  line-height: 1;
}

.autocomplete-list {
  overflow-y: auto;
  overflow-x: hidden;
}

.autocomplete-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  cursor: pointer;
  transition: background-color 0.1s;
  border-left: 2px solid transparent;
  min-height: 24px;
}

.autocomplete-item:hover,
.autocomplete-item.active {
  background: var(--vscode-editorSuggestWidget-selectedBackground, #2A2D2E);
  border-left-color: var(--vscode-editorSuggestWidget-focusHighlightForeground, #007ACC);
}

.item-icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
  flex-shrink: 0;
}

.item-name {
  color: var(--vscode-editorSuggestWidget-foreground, #CCCCCC);
  font-family: var(--vscode-editor-font-family, 'Courier New', monospace);
  font-size: 12px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.item-type {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge-subcommand {
  background: rgba(76, 175, 80, 0.2);
  color: #81c784;
}

.type-badge-option {
  background: rgba(33, 150, 243, 0.2);
  color: #64b5f6;
}

.type-badge-arg {
  background: rgba(255, 152, 0, 0.2);
  color: #ffb74d;
}

.type-badge-file {
  background: rgba(156, 39, 176, 0.2);
  color: #ba68c8;
}

.type-badge-folder {
  background: rgba(233, 30, 99, 0.2);
  color: #f06292;
}

.type-badge-special {
  background: rgba(158, 158, 158, 0.2);
  color: #bdbdbd;
}

.item-description {
  grid-column: 2 / 4;
  color: var(--vscode-descriptionForeground);
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: -4px;
}

/* 滚动条样式 */
.autocomplete-list::-webkit-scrollbar {
  width: 10px;
}

.autocomplete-list::-webkit-scrollbar-track {
  background: transparent;
}

.autocomplete-list::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 5px;
}

.autocomplete-list::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}
</style>

