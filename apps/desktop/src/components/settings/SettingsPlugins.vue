<template>
  <div class="plugin-settings">
    <div class="plugin-header">
      <h3>{{ t('plugins.title') }}</h3>
      <button class="btn btn-primary btn-sm" @click="showInstallModal = true">
        {{ t('plugins.install') }}
      </button>
    </div>

    <div class="plugin-list">
      <div v-if="plugins.length === 0" class="empty-state">
        <p>{{ t('plugins.empty') }}</p>
      </div>

      <div v-for="plugin in plugins" :key="plugin.id" class="plugin-item">
        <div class="plugin-info">
          <div class="plugin-name">
            <span class="name">{{ plugin.name }}</span>
            <span class="version">v{{ plugin.version }}</span>
          </div>
          <div class="plugin-description">{{ plugin.description }}</div>
          <div class="plugin-status">
            <span :class="['status-badge', plugin.loaded ? 'loaded' : 'unloaded']">
              {{ plugin.loaded ? t('plugins.loaded') : t('plugins.unloaded') }}
            </span>
          </div>
        </div>

        <div class="plugin-actions">
          <button
            v-if="!plugin.loaded"
            class="btn btn-secondary btn-sm"
            @click="loadPlugin(plugin.id)"
          >
            {{ t('plugins.load') }}
          </button>
          <button
            v-else-if="!plugin.enabled"
            class="btn btn-success btn-sm"
            @click="enablePlugin(plugin.id)"
          >
            {{ t('plugins.enable') }}
          </button>
          <button v-else class="btn btn-warning btn-sm" @click="disablePlugin(plugin.id)">
            {{ t('plugins.disable') }}
          </button>
          <button class="btn btn-danger btn-sm" @click="uninstallPlugin(plugin.id)">
            {{ t('plugins.uninstall') }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showInstallModal"
      class="plugin-modal-overlay"
      @click.self="showInstallModal = false"
    >
      <div class="plugin-modal">
        <h4>{{ t('plugins.installTitle') }}</h4>
        <div class="form-group">
          <label>{{ t('plugins.manifestUrl') }}</label>
          <input
            v-model="installUrl"
            type="text"
            class="form-control"
            :placeholder="t('plugins.manifestUrlPlaceholder')"
          />
        </div>
        <div class="plugin-modal-actions">
          <button class="btn btn-secondary" @click="showInstallModal = false">
            {{ t('common.cancel') }}
          </button>
          <button class="btn btn-primary" @click="installPlugin" :disabled="!installUrl">
            {{ t('plugins.install') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { pluginService, type PluginWithState } from '@/services/plugins'

const { t } = useI18n()

const plugins = ref(pluginService.allPlugins)
const showInstallModal = ref(false)
const installUrl = ref('')

async function loadPlugin(id: string) {
  await pluginService.loadPlugin(id)
}

async function enablePlugin(id: string) {
  await pluginService.enablePlugin(id)
}

async function disablePlugin(id: string) {
  await pluginService.disablePlugin(id)
}

async function uninstallPlugin(id: string) {
  await pluginService.unregisterPlugin(id)
}

async function installPlugin() {
  if (!installUrl.value) return

  // TODO: Implement plugin installation from URL
  console.log('Installing plugin from:', installUrl.value)
  showInstallModal.value = false
  installUrl.value = ''
}
</script>

<style>
.plugin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.plugin-modal {
  background: var(--bg-primary, #1e1e1e);
  padding: 24px;
  border-radius: 12px;
  min-width: 420px;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.plugin-modal h4 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.plugin-modal .form-group {
  margin-bottom: 16px;
}

.plugin-modal .form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.plugin-modal .form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-secondary, #2d2d2d);
  color: var(--text-primary, #e0e0e0);
}

.plugin-modal .form-control:focus {
  outline: none;
  border-color: var(--primary-color, #4a9eff);
}

.plugin-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.plugin-modal .btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.plugin-modal .btn-secondary {
  background: var(--bg-secondary, #3a3a3a);
  color: var(--text-primary, #e0e0e0);
}

.plugin-modal .btn-primary {
  background: var(--primary-color, #4a9eff);
  color: white;
}

.plugin-modal .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<style scoped>
.plugin-settings {
  padding: 16px;
}

.plugin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plugin-header h3 {
  margin: 0;
}

.plugin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plugin-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.plugin-info {
  flex: 1;
}

.plugin-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plugin-name .name {
  font-weight: 600;
}

.plugin-name .version {
  font-size: 12px;
  color: var(--text-secondary);
}

.plugin-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.plugin-status {
  margin-top: 8px;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.loaded {
  background: #d4edda;
  color: #155724;
}

.status-badge.unloaded {
  background: #fff3cd;
  color: #856404;
}

.plugin-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-secondary {
  background: var(--secondary-color);
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: black;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
