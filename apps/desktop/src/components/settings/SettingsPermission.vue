<template>
  <section id="section-permission" class="setting-section">
    <h2 class="section-title">
      <i class="bi bi-shield-lock"></i>
      {{ $t('settings.permissionTitle') }}
    </h2>
    <p class="section-description">{{ $t('settings.permissionDesc') }}</p>

    <!-- 模式设置 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.permissionPlanMode') }}</label>
        <p class="setting-hint">{{ $t('settings.permissionPlanModeHint') }}</p>
      </div>
      <div class="setting-right">
        <label class="toggle-switch">
          <input v-model="planModeEnabled" type="checkbox" />
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-label">{{
          planModeEnabled ? $t('settings.enabled') : $t('settings.disabled')
        }}</span>
      </div>
    </div>

    <!-- 自动确认危险命令 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.permissionAutoConfirm') }}</label>
        <p class="setting-hint">{{ $t('settings.permissionAutoConfirmHint') }}</p>
      </div>
      <div class="setting-right">
        <label class="toggle-switch">
          <input v-model="autoConfirmDangerous" type="checkbox" />
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-label">{{
          autoConfirmDangerous ? $t('settings.enabled') : $t('settings.disabled')
        }}</span>
      </div>
    </div>

    <!-- 自定义规则列表 -->
    <div class="setting-row">
      <div class="setting-left">
        <label class="setting-label">{{ $t('settings.permissionCustomRules') }}</label>
        <p class="setting-hint">{{ $t('settings.permissionCustomRulesHint') }}</p>
      </div>
    </div>

    <!-- 规则列表 -->
    <div class="rules-list">
      <div v-for="(rule, index) in customRules" :key="index" class="rule-item">
        <div class="rule-pattern">
          <code>{{ rule.pattern }}</code>
        </div>
        <div class="rule-action" :class="rule.action">
          {{ getActionLabel(rule.action) }}
        </div>
        <button
          class="btn-icon delete-rule"
          @click="removeRule(index)"
          :title="$t('settings.deleteRule')"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>

      <div v-if="customRules.length === 0" class="empty-rules">
        <i class="bi bi-info-circle"></i>
        <span>{{ $t('settings.noCustomRules') }}</span>
      </div>
    </div>

    <!-- 添加新规则 -->
    <div class="add-rule-form">
      <h4>{{ $t('settings.addRule') }}</h4>
      <div class="form-row">
        <input
          v-model="newRule.pattern"
          type="text"
          class="form-input"
          :placeholder="$t('settings.rulePatternPlaceholder')"
        />
        <select v-model="newRule.action" class="form-select">
          <option value="allow">{{ $t('settings.actionAllow') }}</option>
          <option value="deny">{{ $t('settings.actionDeny') }}</option>
          <option value="ask">{{ $t('settings.actionAsk') }}</option>
        </select>
        <input
          v-model="newRule.description"
          type="text"
          class="form-input"
          :placeholder="$t('settings.ruleDescriptionPlaceholder')"
        />
        <button class="btn btn-primary" @click="addRule" :disabled="!newRule.pattern">
          <i class="bi bi-plus-lg"></i>
          {{ $t('settings.add') }}
        </button>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="setting-actions">
      <button class="btn btn-secondary" @click="resetToDefault">
        <i class="bi bi-arrow-counterclockwise"></i>
        {{ $t('settings.resetPermissionRules') }}
      </button>
      <button class="btn btn-primary" @click="saveSettings">
        <i class="bi bi-check-lg"></i>
        {{ $t('settings.savePermissionSettings') }}
      </button>
    </div>

    <!-- 危险命令预览 -->
    <div class="danger-preview">
      <h4><i class="bi bi-exclamation-triangle"></i> {{ $t('settings.dangerousCommands') }}</h4>
      <ul>
        <li><code>rm -rf /</code> - {{ $t('settings.dangerDeleteRoot') }}</li>
        <li><code>dd if=/dev/zero of=/dev/sda</code> - {{ $t('settings.dangerDiskDump') }}</li>
        <li><code>mkfs.*</code> - {{ $t('settings.dangerFormatFs') }}</li>
        <li><code>:(){ :|:& };:</code> - {{ $t('settings.dangerForkBomb') }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  settingsService,
  type PermissionConfig,
  type PermissionRule
} from '@/services/settings.service'
import { DEFAULT_PERMISSION_CONFIG } from '@/services/permissions/types'

const { t } = useI18n()

// 状态
const planModeEnabled = ref(true)
const autoConfirmDangerous = ref(false)
const customRules = ref<PermissionRule[]>([])
const newRule = ref({
  pattern: '',
  action: 'ask' as 'allow' | 'deny' | 'ask',
  description: ''
})

// 加载设置
onMounted(async () => {
  await loadSettings()
})

async function loadSettings() {
  try {
    const settings = await settingsService.getSettings()
    if (settings.permissionConfig) {
      planModeEnabled.value = settings.permissionConfig.modeSettings?.plan?.enabled ?? true
      autoConfirmDangerous.value =
        settings.permissionConfig.modeSettings?.build?.autoConfirmDangerous ?? false
      customRules.value = settings.permissionConfig.customRules || []
    }
  } catch (error) {
    console.error('[PermissionSettings] Failed to load settings:', error)
  }
}

async function saveSettings() {
  try {
    const config: PermissionConfig = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      customRules: customRules.value,
      modeSettings: {
        plan: {
          enabled: planModeEnabled.value
        },
        build: {
          autoConfirmDangerous: autoConfirmDangerous.value
        }
      }
    }

    const settings = await settingsService.getSettings()
    settings.permissionConfig = config

    await settingsService.saveSettings(settings)
    console.log('[PermissionSettings] Settings saved successfully')
  } catch (error) {
    console.error('[PermissionSettings] Failed to save settings:', error)
  }
}

async function resetToDefault() {
  if (confirm(t('settings.confirmReset'))) {
    customRules.value = []
    planModeEnabled.value = true
    autoConfirmDangerous.value = false
    await saveSettings()
  }
}

function addRule() {
  if (!newRule.value.pattern) return

  customRules.value.push({
    pattern: newRule.value.pattern,
    action: newRule.value.action,
    description: newRule.value.description || undefined
  })

  // 清空表单
  newRule.value = {
    pattern: '',
    action: 'ask',
    description: ''
  }
}

function removeRule(index: number) {
  customRules.value.splice(index, 1)
}

function getActionLabel(action: string): string {
  switch (action) {
    case 'allow':
      return t('settings.actionAllow')
    case 'deny':
      return t('settings.actionDeny')
    case 'ask':
      return t('settings.actionAsk')
    default:
      return action
  }
}
</script>

<style scoped>
.rules-list {
  margin: 1rem 0;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.rule-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-pattern {
  flex: 1;
  min-width: 0;
}

.rule-pattern code {
  background: var(--bg-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  word-break: break-all;
}

.rule-action {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.rule-action.allow {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.rule-action.deny {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.rule-action.ask {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.delete-rule {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.delete-rule:hover {
  opacity: 1;
  color: #ef4444;
}

.empty-rules {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--text-secondary);
}

.add-rule-form {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.add-rule-form h4 {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.form-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.form-row .form-input,
.form-row .form-select {
  flex: 1;
  min-width: 150px;
}

.setting-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.danger-preview {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
}

.danger-preview h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #ef4444;
}

.danger-preview ul {
  margin: 0;
  padding-left: 1.5rem;
}

.danger-preview li {
  margin-bottom: 0.5rem;
}

.danger-preview code {
  background: rgba(239, 68, 68, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.85rem;
}
</style>
