<template>
  <div class="mcp-settings">
    <div class="mcp-header">
      <h3>{{ t('mcp.title') }}</h3>
      <button class="btn btn-primary btn-sm" @click="showAddModal = true">
        {{ t('mcp.addServer') }}
      </button>
    </div>

    <div class="mcp-info">
      <p class="info-text">{{ t('mcp.description') }}</p>
    </div>

    <div class="mcp-list">
      <div v-if="servers.length === 0" class="empty-state">
        <p>{{ t('mcp.empty') }}</p>
      </div>

      <div v-for="server in servers" :key="server.id" class="mcp-item">
        <div class="mcp-info">
          <div class="mcp-name">
            <span class="name">{{ server.name }}</span>
            <span :class="['status-badge', server.connected ? 'connected' : 'disconnected']">
              {{ server.connected ? t('mcp.connected') : t('mcp.disconnected') }}
            </span>
          </div>
          <div class="mcp-url">{{ server.url }}</div>
          <div class="mcp-tools" v-if="server.toolCount !== undefined">
            {{ t('mcp.toolsCount', { count: server.toolCount }) }}
          </div>
          <div class="mcp-error" v-if="server.error">
            {{ server.error }}
          </div>
        </div>

        <div class="mcp-actions">
          <button
            v-if="!server.connected"
            class="btn btn-success btn-sm"
            @click="connectServer(server.id)"
            :disabled="connecting === server.id"
          >
            {{ connecting === server.id ? t('mcp.connecting') : t('mcp.connect') }}
          </button>
          <button v-else class="btn btn-warning btn-sm" @click="disconnectServer(server.id)">
            {{ t('mcp.disconnect') }}
          </button>
          <button class="btn btn-secondary btn-sm" @click="editServer(server)">
            {{ t('mcp.edit') }}
          </button>
          <button class="btn btn-danger btn-sm" @click="removeServer(server.id)">
            {{ t('mcp.remove') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="mcp-modal-overlay" @click.self="closeModal">
      <div class="mcp-modal">
        <h4>{{ editingServer ? t('mcp.editServer') : t('mcp.addServer') }}</h4>

        <div class="form-group">
          <label>{{ t('mcp.serverName') }}</label>
          <input
            v-model="formData.name"
            type="text"
            class="form-control"
            :placeholder="t('mcp.serverNamePlaceholder')"
          />
        </div>

        <div class="form-group">
          <label>{{ t('mcp.serverUrl') }}</label>
          <input
            v-model="formData.url"
            type="text"
            class="form-control"
            :placeholder="t('mcp.serverUrlPlaceholder')"
          />
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="formData.enabled" />
            {{ t('mcp.enabled') }}
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="formData.autoConnect" />
            {{ t('mcp.autoConnect') }}
          </label>
        </div>

        <div class="mcp-modal-actions">
          <button class="btn btn-secondary" @click="closeModal">
            {{ t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary"
            @click="saveServer"
            :disabled="!formData.name || !formData.url"
          >
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { mcpService, type MCPServerConfig } from '@/services/mcp'

const { t } = useI18n()

interface MCPServerWithState extends MCPServerConfig {
  connected: boolean
  toolCount?: number
  error?: string
}

const servers = ref<MCPServerWithState[]>([])
const showAddModal = ref(false)
const editingServer = ref<MCPServerWithState | null>(null)
const connecting = ref<string | null>(null)

const formData = reactive({
  name: '',
  url: '',
  enabled: true,
  autoConnect: false
})

function loadServers() {
  const serverConfigs = mcpService.getConfigs()
  servers.value = serverConfigs.map(config => {
    const state = mcpService.getServerState(config.id)
    return {
      ...config,
      connected: state?.connected ?? false,
      toolCount: state?.tools.length,
      error: state?.error ?? undefined
    }
  })
}

async function connectServer(id: string) {
  connecting.value = id
  try {
    await mcpService.connect(id)
  } catch (error) {
    console.error('Failed to connect:', error)
  } finally {
    connecting.value = null
    loadServers()
  }
}

async function disconnectServer(id: string) {
  await mcpService.disconnect(id)
  loadServers()
}

function editServer(server: MCPServerWithState) {
  editingServer.value = server
  formData.name = server.name
  formData.url = server.url
  formData.enabled = server.enabled
  formData.autoConnect = server.autoConnect
  showAddModal.value = true
}

async function removeServer(id: string) {
  await mcpService.removeServer(id)
  loadServers()
}

function closeModal() {
  showAddModal.value = false
  editingServer.value = null
  formData.name = ''
  formData.url = ''
  formData.enabled = true
  formData.autoConnect = false
}

async function saveServer() {
  if (editingServer.value) {
    await mcpService.removeServer(editingServer.value.id)
  }

  await mcpService.addServer({
    id: editingServer.value?.id || `mcp-${Date.now()}`,
    name: formData.name,
    url: formData.url,
    enabled: formData.enabled,
    autoConnect: formData.autoConnect
  })

  closeModal()
  loadServers()
}

loadServers()
</script>

<style>
.mcp-modal-overlay {
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

.mcp-modal {
  background: var(--bg-primary, #1e1e1e);
  padding: 24px;
  border-radius: 12px;
  min-width: 480px;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.mcp-modal h4 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
}

.mcp-modal .form-group {
  margin-bottom: 16px;
}

.mcp-modal .form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.mcp-modal .form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-secondary, #2d2d2d);
  color: var(--text-primary, #e0e0e0);
}

.mcp-modal .form-control:focus {
  outline: none;
  border-color: var(--primary-color, #4a9eff);
}

.mcp-modal .checkbox-group {
  margin-bottom: 12px;
}

.mcp-modal .checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
}

.mcp-modal .checkbox-group input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.mcp-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.mcp-modal .btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.mcp-modal .btn-secondary {
  background: var(--bg-secondary, #3a3a3a);
  color: var(--text-primary, #e0e0e0);
}

.mcp-modal .btn-primary {
  background: var(--primary-color, #4a9eff);
  color: white;
}

.mcp-modal .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<style scoped>
.mcp-settings {
  padding: 16px;
}

.mcp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.mcp-header h3 {
  margin: 0;
}

.mcp-info {
  margin-bottom: 16px;
}

.info-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.mcp-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mcp-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.mcp-info {
  flex: 1;
}

.mcp-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mcp-name .name {
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.connected {
  background: #d4edda;
  color: #155724;
}

.status-badge.disconnected {
  background: #fff3cd;
  color: #856404;
}

.mcp-url {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  font-family: monospace;
}

.mcp-tools {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.mcp-error {
  font-size: 12px;
  color: #dc3545;
  margin-top: 4px;
}

.mcp-actions {
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
  background: #6c757d;
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
