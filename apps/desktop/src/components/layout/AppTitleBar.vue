<template>
  <div class="vscode-titlebar flex items-center text-vscode-fg select-none" style="height: 37px">
    <!-- 左侧：应用菜单和标题 -->
    <div class="flex items-center space-x-4 pl-4">
      <!-- 应用图标和名称 -->
      <div class="flex items-center space-x-2">
        <svg
          class="text-vscode-accent"
          fill="currentColor"
          viewBox="0 0 16 16"
          style="width: 20px; height: 20px"
        >
          <!-- SSH/Terminal 图标设计 -->
          <path
            d="M2 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2zm0 1h12v8H2V4z"
          />
          <path d="M3 6l2 1.5L3 9v1l3-2V7L3 5v1zm4 3h3v1H7V9z" />
        </svg>
        <span class="text-sm font-medium">AI SSH Assistant</span>
      </div>

      <!-- 菜单栏 -->
      <div class="flex items-center space-x-1">
        <button
          v-for="menu in menus"
          :key="menu.id"
          @mouseenter="event => showMenu(menu.id, event)"
          @mouseleave="() => hideMenu()"
          :class="['vscode-menu-item', { active: activeMenu === menu.id }]"
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

    <!-- 右侧：用户区、模型切换、主题切换和窗口控制按钮 -->
    <div class="flex items-center ml-auto">
      <div
        class="user-menu-wrapper"
        @mouseenter="showUserMenu = true"
        @mouseleave="showUserMenu = false"
      >
        <button class="user-menu-trigger" @click="handleUserAreaClick">
          <img
            v-if="wechatUser?.wechatProfile?.avatarUrl || wechatUser?.avatar"
            :src="wechatUser?.wechatProfile?.avatarUrl || wechatUser?.avatar || ''"
            class="user-avatar-image"
          />
          <div v-else class="user-avatar-fallback">微</div>
          <span class="user-nickname">{{
            wechatUser?.wechatProfile?.nickname || wechatUser?.username || '未登录'
          }}</span>
        </button>

        <div v-if="showUserMenu && wechatUser" class="user-menu-panel">
          <button class="user-menu-item" @click="openProfileCenter">个人中心</button>
          <button class="user-menu-item" @click="handleLogout">退出登录</button>
        </div>
      </div>

      <!-- 大模型切换按钮 -->
      <div class="relative">
        <button
          @click="toggleModelDropdown"
          class="vscode-window-control px-2"
          style="width: auto; min-width: 46px"
          :title="`${$t('titlebar.currentModel')}: ${currentModel.name}`"
        >
          <span class="text-xs font-medium whitespace-nowrap">{{ currentModel.shortName }}</span>
          <svg
            class="ml-1 inline-block"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="currentColor"
          >
            <path d="M1 3l4 4 4-4H1z" />
          </svg>
        </button>

        <!-- 模型选择下拉窗口 -->
        <div
          v-if="showModelDropdown"
          class="model-dropdown absolute top-full right-0 mt-1 bg-vscode-bg-light border border-vscode-border shadow-lg z-50 rounded"
          style="width: 280px"
        >
          <!-- 标题栏 -->
          <div class="flex items-center justify-between px-3 py-2 border-b border-vscode-border">
            <span class="text-sm font-medium text-vscode-fg">{{
              $t('titlebar.selectAiModel')
            }}</span>
            <button
              @click="openModelSettings"
              class="model-settings-btn p-1 rounded hover:bg-vscode-bg-lighter"
              :title="$t('titlebar.modelSettings')"
            >
              <i class="bi bi-gear" style="font-size: 14px"></i>
            </button>
          </div>

          <!-- 模型列表 -->
          <div class="py-1 max-h-96 overflow-y-auto">
            <div
              v-if="availableModels.length === 0"
              class="px-3 py-4 text-center text-sm text-vscode-fg-muted"
            >
              <i class="bi bi-info-circle mr-1"></i>
              {{ $t('titlebar.noAvailableModels') }}
            </div>

            <template v-if="groupedModels.official.length > 0">
              <div
                class="px-3 py-2 text-xs font-medium text-vscode-fg-muted border-b border-vscode-border"
              >
                {{ officialGroupLabel }}
              </div>
              <div
                v-for="model in groupedModels.official"
                :key="`${model.providerId}-${model.id}`"
                @click="selectModel(model)"
                :class="[
                  'model-dropdown-item px-3 py-2 cursor-pointer transition-colors',
                  currentModel.id === model.id && currentModel.providerId === model.providerId
                    ? 'bg-vscode-bg-lighter'
                    : '',
                  model.disabled ? 'opacity-60 cursor-not-allowed' : ''
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 flex-1">
                    <i
                      class="bi bi-stars text-vscode-accent flex-shrink-0"
                      style="font-size: 16px"
                    ></i>
                    <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span class="text-sm font-medium text-vscode-fg truncate">{{
                        model.name
                      }}</span>
                      <span class="text-xs text-vscode-fg-muted">
                        {{ model.disabledReason || '官方托管' }}
                      </span>
                    </div>
                  </div>
                  <svg
                    v-if="
                      currentModel.id === model.id && currentModel.providerId === model.providerId
                    "
                    class="text-vscode-accent flex-shrink-0 ml-2"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                    />
                  </svg>
                </div>
              </div>
            </template>

            <template v-if="groupedModels.local.length > 0">
              <div
                class="px-3 py-2 text-xs font-medium text-vscode-fg-muted border-b border-vscode-border"
              >
                我的模型
              </div>
              <div
                v-for="model in groupedModels.local"
                :key="`${model.providerId}-${model.id}`"
                @click="selectModel(model)"
                :class="[
                  'model-dropdown-item px-3 py-2 cursor-pointer transition-colors',
                  currentModel.id === model.id && currentModel.providerId === model.providerId
                    ? 'bg-vscode-bg-lighter'
                    : ''
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 flex-1">
                    <i
                      class="bi bi-cpu text-vscode-accent flex-shrink-0"
                      style="font-size: 16px"
                    ></i>
                    <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span class="text-sm font-medium text-vscode-fg truncate">{{
                        model.name
                      }}</span>
                      <span class="text-xs text-vscode-fg-muted">{{ model.providerName }}</span>
                    </div>
                  </div>
                  <svg
                    v-if="
                      currentModel.id === model.id && currentModel.providerId === model.providerId
                    "
                    class="text-vscode-accent flex-shrink-0 ml-2"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                    />
                  </svg>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 快捷主题切换按钮 -->
      <button
        @click="handleQuickThemeToggle"
        class="vscode-window-control"
        :title="`${$t('titlebar.currentTheme')}: ${currentNewThemeLabel}`"
      >
        <svg
          v-if="currentNewTheme.includes('light')"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <!-- 太阳图标 -->
          <path
            d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
          />
        </svg>
        <svg
          v-else-if="currentNewTheme.includes('dark')"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <!-- 月亮图标 -->
          <path
            d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"
          />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <!-- 自动图标 -->
          <path
            d="M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zM3.732 1.732a.5.5 0 0 1 .707 0l1.415 1.415a.5.5 0 1 1-.708.707L3.732 2.439a.5.5 0 0 1 0-.707zM0 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 8zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
          />
          <path d="M8 16a.5.5 0 0 1-.5-.5v-1.5a.5.5 0 0 1 1 0v1.5a.5.5 0 0 1-.5.5z" />
        </svg>
      </button>

      <button
        @click="minimizeWindow"
        class="vscode-window-control"
        :title="$t('titlebar.minimize')"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M0 5h10v1H0z" />
        </svg>
      </button>
      <button
        @click="maximizeWindow"
        class="vscode-window-control"
        :title="$t('titlebar.maximize')"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z" />
        </svg>
      </button>
      <button
        @click="closeWindow"
        class="vscode-window-control vscode-window-control-close"
        :title="$t('titlebar.close')"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path
            d="M1.414 0L5 3.586L8.586 0L10 1.414L6.414 5L10 8.586L8.586 10L5 6.414L1.414 10L0 8.586L3.586 5L0 1.414L1.414 0z"
          />
        </svg>
      </button>
    </div>

    <!-- 下拉菜单 -->
    <div
      v-if="activeMenu"
      class="vscode-dropdown absolute bg-vscode-bg-light border border-vscode-border shadow-lg z-[9999]"
      :style="{
        left: menuPosition + 'px',
        top: '37px' // 标题栏高度
      }"
      @mouseenter="clearHideMenuTimeout"
      @mouseleave="hideMenu"
      @click.stop
    >
      <template v-for="item in currentMenuItems" :key="item.id">
        <div
          v-if="item.type !== 'separator'"
          @mouseenter="clearHideMenuTimeout"
          @click="executeMenuAction(item.action || '')"
          class="vscode-dropdown-item cursor-pointer"
          :class="{
            'opacity-50 pointer-events-none': !item.action
          }"
        >
          <span>{{ item.label }}</span>
          <span v-if="item.shortcut" class="text-xs text-vscode-fg-muted">{{ item.shortcut }}</span>
        </div>
        <div v-else-if="item.type === 'separator'" class="vscode-dropdown-separator"></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import apiService, { type OfficialModelStatus } from '../../services/api.service'
import type { AIModel, AIProvider as SharedAIProvider, AIProviderConfig } from '@ai-ssh/shared'
import { useTheme } from '../../composables/useTheme'
import { themeService } from '../../services/theme.service'
import { settingsService } from '../../services/settings.service'
import { sshService } from '../../services/ssh.service'
import { $alert } from '../../composables/useDialog'
import {
  logoutWechatLogin,
  type LoggedInWechatUser,
  getStoredUser
} from '../../services/wechat-login.service'
import type { AIProvider, AIModel as AIProviderModel } from '../../types/ai-providers'
import {
  buildOfficialTitleBarModels,
  buildTitleBarModels,
  resolveSelectedTitleBarModel,
  type TitleBarModelOption
} from '../../utils/titlebar-models'

// 定义 emits
const emit = defineEmits<{
  'open-settings': []
  'open-login': []
}>()

// Router
const router = useRouter()
const { t: $t } = useI18n()
const openNewTab =
  inject<(id: string, name: string, icon: string, path: string) => void>('openNewTab')

// 主题 Composable
const theme = useTheme()
const { mode, currentTheme } = theme

// 响应式数据
const activeMenu = ref<string | null>(null)
const menuPosition = ref(0)
const currentFilePath = computed(() => $t('titlebar.appWelcome'))

// 模型选择相关
const showModelDropdown = ref(false)
const showUserMenu = ref(false)

const wechatUser = ref<LoggedInWechatUser | null>(getStoredUser())
const officialStatus = ref<OfficialModelStatus | null>(null)

// 模型接口定义（用于标题栏显示）
interface TitleBarModel extends TitleBarModelOption {}

// 当前选择的模型
const currentModel = ref<TitleBarModel>({
  id: 'none',
  name: $t('titlebar.noModel'),
  shortName: $t('titlebar.selectModel'),
  providerId: '',
  providerName: ''
})

const resetCurrentModel = () => {
  currentModel.value = {
    id: 'none',
    name: $t('titlebar.noModel'),
    shortName: $t('titlebar.selectModel'),
    providerId: '',
    providerName: ''
  }
}

const getDefaultOfficialModel = () => {
  return groupedModels.value.official.find(model => !model.disabled) || null
}

const applyOfficialModelSelection = (model: TitleBarModel) => {
  currentModel.value = model

  const selection = {
    source: 'official' as const,
    providerId: 'official',
    modelId: model.id
  }

  localStorage.setItem('selectedAIModel', JSON.stringify(selection))
  window.dispatchEvent(
    new CustomEvent('ai-model-changed', {
      detail: selection
    })
  )
}

// 可用模型列表（从实际配置加载）
const availableModels = ref<TitleBarModel[]>([])
const groupedModels = computed(() => ({
  official: availableModels.value.filter(model => model.group === 'official'),
  local: availableModels.value.filter(model => model.group !== 'official')
}))

const officialGroupLabel = computed(() => {
  return '官方模型'
})

const officialModelsDisabledReason = computed(() => {
  return undefined
})

const loadOfficialStatus = async () => {
  try {
    const response = await apiService.getOfficialModelStatus()
    officialStatus.value = response.data || null
  } catch {
    officialStatus.value = null
  }
}

// 从数据库加载可用模型
const loadAvailableModels = async () => {
  try {
    await loadOfficialStatus()

    // 使用 settingsService 获取配置（自动处理 userId）
    const settings = await settingsService.getSettings()

    const configs: any[] = Array.isArray(settings?.aiProviders) ? settings.aiProviders : []
    const models: TitleBarModel[] = buildTitleBarModels(configs) as TitleBarModel[]
    const officialModels: TitleBarModel[] = officialStatus.value
      ? (buildOfficialTitleBarModels(officialStatus.value.models, {
          disabled: !!officialModelsDisabledReason.value,
          disabledReason: officialModelsDisabledReason.value
        }) as TitleBarModel[])
      : []

    availableModels.value = [...officialModels, ...models]

    // 加载当前选择的模型
    loadCurrentModel()
  } catch (error) {
    availableModels.value = []
  }
}

// 加载当前选择的模型
const loadCurrentModel = () => {
  try {
    const savedStr = localStorage.getItem('selectedAIModel')
    if (!savedStr) {
      const defaultOfficialModel = getDefaultOfficialModel()
      if (defaultOfficialModel) {
        applyOfficialModelSelection(defaultOfficialModel)
        return
      }

      resetCurrentModel()
      return
    }

    const resolved = resolveSelectedTitleBarModel(availableModels.value, savedStr)

    if (resolved.model) {
      currentModel.value = resolved.model
    } else {
      if (resolved.shouldClear) {
        localStorage.removeItem('selectedAIModel')
        window.dispatchEvent(new CustomEvent('ai-model-changed', { detail: null }))
      }
      resetCurrentModel()
    }
  } catch (error) {
    localStorage.removeItem('selectedAIModel')
    resetCurrentModel()
  }
}

// 监听配置变化
const handleStorageChange = (e: StorageEvent) => {
  if (e.key === 'selectedAIModel') {
    loadAvailableModels()
  }
}

const handleModelChange = () => {
  loadAvailableModels()
}

const handleProviderConfigsUpdated = () => {
  loadAvailableModels()
}

const handleSettingsUpdated = () => {
  loadAvailableModels()
}

// 监听主题变化
const handleThemeChange = (event: Event) => {
  const customEvent = event as CustomEvent
  currentNewTheme.value = customEvent.detail.theme
}

const handleAuthStateChange = () => {
  wechatUser.value = getStoredUser()
  loadAvailableModels()
}

onMounted(() => {
  loadAvailableModels()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('ai-model-changed', handleModelChange)
  window.addEventListener('ai-provider-configs-updated', handleProviderConfigsUpdated)
  window.addEventListener('settings-updated', handleSettingsUpdated)
  window.addEventListener('theme-changed', handleThemeChange)
  window.addEventListener('auth-state-changed', handleAuthStateChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('ai-model-changed', handleModelChange)
  window.removeEventListener('ai-provider-configs-updated', handleProviderConfigsUpdated)
  window.removeEventListener('settings-updated', handleSettingsUpdated)
  window.removeEventListener('theme-changed', handleThemeChange)
  window.removeEventListener('auth-state-changed', handleAuthStateChange)
})

// 当前主题标签（旧系统）
const currentThemeLabel = computed(() => {
  switch (mode.value) {
    case 'light':
      return $t('titlebar.lightTheme')
    case 'dark':
      return $t('titlebar.darkTheme')
    case 'auto':
      return $t('titlebar.autoTheme')
    default:
      return mode.value
  }
})

// 新主题系统
const currentNewTheme = ref(themeService.getCurrentTheme())
const currentNewThemeLabel = computed(() => {
  const themes = themeService.getAvailableThemes()
  const theme = themes.find(t => t.value === currentNewTheme.value)
  return theme?.label || currentNewTheme.value
})

// 快捷主题切换
const handleQuickThemeToggle = () => {
  themeService.toggleTheme()
  currentNewTheme.value = themeService.getCurrentTheme()
}

const handleUserAreaClick = () => {
  if (!wechatUser.value) {
    emit('open-login')
    showUserMenu.value = false
    return
  }

  openProfileCenter()
}

const openProfileCenter = () => {
  console.log('[AppTitleBar] openProfileCenter', { wechatUser: wechatUser.value })
  if (!wechatUser.value) {
    console.log('[AppTitleBar] emit open-login')
    emit('open-login')
    showUserMenu.value = false
    return
  }
  if (openNewTab) {
    openNewTab('profile', '个人中心', 'bi bi-person-circle', '/profile')
  } else {
    router.push('/profile')
  }
  showUserMenu.value = false
}

const handleLogout = async () => {
  await logoutWechatLogin()
  showUserMenu.value = false
}

// 菜单配置
const menus = computed(() => [
  { id: 'file', label: $t('titlebar.menuFile') },
  { id: 'view', label: $t('titlebar.menuView') },
  { id: 'help', label: $t('titlebar.menuHelp') }
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

const menuItems = computed<MenuItems>(() => ({
  file: [
    {
      id: 'import-connections',
      label: $t('titlebar.importConnections'),
      action: 'import-connections'
    },
    {
      id: 'export-connections',
      label: $t('titlebar.exportConnections'),
      action: 'export-connections'
    }
  ],
  view: [
    {
      id: 'fullscreen',
      label: $t('titlebar.fullscreen'),
      action: 'toggle-fullscreen',
      shortcut: 'F11'
    },
    { id: 'separator1', label: '', action: '', type: 'separator' },
    {
      id: 'theme-toggle',
      label: $t('titlebar.toggleTheme'),
      action: 'toggle-theme',
      shortcut: 'Ctrl+K Ctrl+T'
    },
    { id: 'separator2', label: '', action: '', type: 'separator' },
    { id: 'zoom-in', label: $t('titlebar.zoomIn'), action: 'zoom-in', shortcut: 'Ctrl+=' },
    { id: 'zoom-out', label: $t('titlebar.zoomOut'), action: 'zoom-out', shortcut: 'Ctrl+-' }
  ],
  help: [
    { id: 'docs', label: $t('titlebar.docs'), action: 'open-docs' },
    { id: 'shortcuts', label: $t('titlebar.shortcuts'), action: 'show-shortcuts' },
    {
      id: 'developer-tools',
      label: $t('titlebar.developerTools'),
      action: 'toggle-devtools',
      shortcut: 'F12'
    },
    { id: 'separator-gh', label: '', action: '', type: 'separator' },
    { id: 'github-repo', label: $t('titlebar.githubRepo'), action: 'open-github-repo' },
    { id: 'github-issues', label: $t('titlebar.githubIssues'), action: 'open-github-issues' },
    { id: 'about', label: $t('titlebar.about'), action: 'show-about' }
  ]
}))

// 计算当前菜单项
const currentMenuItems = computed(() => {
  if (!activeMenu.value) return []
  return menuItems.value[activeMenu.value] || []
})

// 菜单隐藏定时器
let hideMenuTimeout: NodeJS.Timeout | null = null

const showMenu = (menuId: string, event?: MouseEvent) => {
  // 清除延迟隐藏定时器
  if (hideMenuTimeout) {
    clearTimeout(hideMenuTimeout)
    hideMenuTimeout = null
  }

  activeMenu.value = menuId
  // 根据菜单ID和按钮位置计算菜单位置
  if (event) {
    const target = event.target as HTMLElement
    const rect = target.getBoundingClientRect()
    menuPosition.value = rect.left
  } else {
    // 如果没有事件，根据菜单ID计算位置
    const menuIndex = ['file', 'edit', 'view', 'help'].indexOf(menuId)
    menuPosition.value = 100 + menuIndex * 80 // 估算位置
  }
}

const hideMenu = () => {
  // 延迟隐藏，给用户移动到菜单的时间
  hideMenuTimeout = setTimeout(() => {
    activeMenu.value = null
  }, 150) // 150ms延迟
}

const clearHideMenuTimeout = () => {
  if (hideMenuTimeout) {
    clearTimeout(hideMenuTimeout)
    hideMenuTimeout = null
  }
}

const executeMenuAction = async (action: string) => {
  activeMenu.value = null

  switch (action) {
    case 'import-connections':
      try {
        const result = await sshService.importConnections()
        if (!result.canceled) {
          window.dispatchEvent(new CustomEvent('ssh-connections-imported'))
          $alert($t('ssh.importResult', {
            imported: result.imported || 0,
            skipped: result.skipped || 0,
            invalid: result.invalid || 0
          }))
        }
      } catch (error: any) {
        $alert(error.message || $t('ssh.importFailed'))
      }
      break
    case 'export-connections':
      try {
        const result = await sshService.exportConnections()
        if (!result.canceled) {
          $alert($t('ssh.exportResult', { exported: result.exported || 0 }))
        }
      } catch (error: any) {
        $alert(error.message || $t('ssh.exportFailed'))
      }
      break
    case 'toggle-fullscreen':
      if (window.electronAPI?.toggleFullscreen) {
        window.electronAPI.toggleFullscreen()
      }
      break
    case 'toggle-theme':
      // 切换主题
      themeService.toggleTheme()
      break
    case 'show-about':
      if (openNewTab) {
        openNewTab('about', $t('titlebar.about'), 'bi bi-info-circle', '/about')
      } else {
        console.warn('openNewTab 方法未注入，无法打开关于标签页')
      }
      break
    case 'toggle-devtools':
      if (window.electronAPI?.toggleDevTools) {
        window.electronAPI.toggleDevTools().catch((error: unknown) => {
          console.error('Failed to toggle developer tools:', error)
        })
      }
      break
    case 'show-shortcuts':
      // 显示快捷键

      showShortcutsModal()
      break
    case 'open-docs':
      // 打开文档
      openExternalLink('https://github.com/your-repo/docs')
      break
    case 'open-github-repo':
      openExternalLink('https://github.com/aifuqiang02/ai-ssh-assistant')
      break
    case 'open-github-issues':
      openExternalLink('https://github.com/aifuqiang02/ai-ssh-assistant/issues/new')
      break
    // ... 其他菜单操作
  }
}

// 显示快捷键模态框
const showShortcutsModal = () => {
  // 简单的快捷键显示，可以根据需要实现更复杂的功能
  const shortcuts = [
    'Ctrl+N: 新建连接',
    'Ctrl+B: 切换侧边栏',
    'F11: 全屏',
    'Ctrl+K Ctrl+T: 切换主题',
    'Ctrl+=: 放大',
    'Ctrl+Shift+`: 新建终端'
  ]

  const message = shortcuts.join('\n')
  alert(`键盘快捷键:\n\n${message}`)
}

// 打开外部链接
const openExternalLink = (url: string) => {
  if (window.electronAPI?.system?.openExternal) {
    window.electronAPI.system.openExternal(url)
  } else {
    window.open(url, '_blank')
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
  theme.toggleMode()
}

// 模型切换相关方法
const toggleModelDropdown = () => {
  showModelDropdown.value = !showModelDropdown.value

  // 打开下拉菜单时重新加载配置，确保显示最新的模型列表
  if (showModelDropdown.value) {
    loadAvailableModels()
  }
}

const selectModel = async (model: TitleBarModel) => {
  if (model.disabled) {
    return
  }

  // 更新当前显示的模型
  currentModel.value = model
  showModelDropdown.value = false

  if (model.providerId === 'official') {
    applyOfficialModelSelection(model)
    return
  }

  try {
    // 获取完整的 provider 和 model 对象用于保存
    const settings = await settingsService.getSettings()
    const provider = settings?.aiProviders?.find((p: any) => p.id === model.providerId)
    const fullModel = provider?.models?.find((m: any) => m.id === model.id)

    if (provider && fullModel) {
      // 保存完整对象到 localStorage
      const selection = {
        source: 'local',
        provider: provider,
        model: fullModel
      }

      localStorage.setItem('selectedAIModel', JSON.stringify(selection))

      // 触发自定义事件通知其他组件（传递完整对象）
      window.dispatchEvent(
        new CustomEvent('ai-model-changed', {
          detail: selection
        })
      )
    } else {
      // 降级：保存 ID
      const selection = {
        source: 'local',
        providerId: model.providerId,
        modelId: model.id
      }
      localStorage.setItem('selectedAIModel', JSON.stringify(selection))
      window.dispatchEvent(
        new CustomEvent('ai-model-changed', {
          detail: selection
        })
      )
    }
  } catch (error) {}
}

const openModelSettings = () => {
  showModelDropdown.value = false
  // 发出打开设置页面的事件
  emit('open-settings')
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
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
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
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
  -webkit-app-region: no-drag;
}

.vscode-window-control:hover {
  background-color: var(--vscode-bg-lighter);
  color: var(--vscode-fg);
}

.vscode-window-control-close:hover {
  background-color: var(--vscode-error) !important;
  color: var(--vscode-button-foreground);
}

.vscode-window-control svg {
  opacity: 0.9;
}

.vscode-window-control:hover svg {
  opacity: 1;
}

.user-menu-wrapper {
  position: relative;
  -webkit-app-region: no-drag;
  margin-right: 8px;
  padding-bottom: 6px;
  margin-bottom: -6px;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 37px;
  padding: 0 10px;
  color: var(--vscode-fg);
}

.user-avatar-image,
.user-avatar-fallback {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  object-fit: cover;
  background: var(--vscode-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.user-nickname {
  max-width: 96px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.user-menu-panel {
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 140px;
  background: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.28);
  padding: 6px;
  z-index: 9999;
  -webkit-app-region: no-drag;
}

.user-menu-item {
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--vscode-fg);
}

.user-menu-item:hover {
  background: var(--vscode-bg-lighter);
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

.vscode-dropdown-item[data-type='separator'] {
  border-top: 1px solid var(--vscode-border);
  margin: 0.25rem 0;
  height: 1px;
  padding: 0;
}

.vscode-dropdown-separator {
  border-top: 1px solid var(--vscode-border);
  margin: 0.25rem 0;
  height: 1px;
  padding: 0;
}

/* 模型下拉窗口样式 */
.model-dropdown {
  -webkit-app-region: no-drag;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.model-dropdown-item:hover {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
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
