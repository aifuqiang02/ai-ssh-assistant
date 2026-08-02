<template>
  <div class="profile-page">
    <main class="profile-card">
      <div class="profile-avatar">
        <img v-if="avatarUrl" :src="avatarUrl" alt="用户头像" />
        <i v-else class="bi bi-person-fill"></i>
      </div>
      <div>
        <p class="profile-eyebrow">个人中心</p>
        <h1>{{ displayName }}</h1>
        <p class="profile-description">
          登录状态用于同步账号身份并访问官方 AI。SSH 与自定义模型功能可直接使用。
        </p>
      </div>
      <dl class="profile-details">
        <div>
          <dt>账号状态</dt>
          <dd>{{ user ? '已登录' : '未登录' }}</dd>
        </div>
        <div v-if="user?.email">
          <dt>邮箱</dt>
          <dd>{{ user.email }}</dd>
        </div>
      </dl>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthSession } from '@/services/auth-session.service'

const { currentUser } = useAuthSession()
const user = computed(() => currentUser.value)
const displayName = computed(
  () => user.value?.wechatProfile?.nickname || user.value?.username || '未登录用户'
)
const avatarUrl = computed(() => user.value?.wechatProfile?.avatarUrl || user.value?.avatar || '')
</script>

<style scoped>
.profile-page {
  height: 100%;
  overflow-y: auto;
  padding: clamp(2rem, 7vw, 6rem) 1.5rem;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.profile-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.5rem;
  max-width: 48rem;
  margin: 0 auto;
  padding: clamp(1.5rem, 5vw, 3rem);
  border: 1px solid var(--vscode-border);
  border-radius: 1rem;
  background: var(--vscode-bg-light);
}

.profile-avatar {
  width: 5rem;
  height: 5rem;
  overflow: hidden;
  display: grid;
  place-items: center;
  border-radius: 1rem;
  background: var(--vscode-bg-lighter);
  color: var(--vscode-accent);
  font-size: 2rem;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-eyebrow {
  margin: 0 0 0.5rem;
  color: var(--vscode-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.profile-description {
  max-width: 38rem;
  margin: 0.75rem 0 0;
  color: var(--vscode-fg-muted);
  line-height: 1.7;
}

.profile-details {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
  margin: 1rem 0 0;
}

.profile-details div {
  padding: 1rem;
  border: 1px solid var(--vscode-border-subtle);
  border-radius: 0.75rem;
}

.profile-details dt {
  color: var(--vscode-fg-muted);
  font-size: 0.75rem;
}

.profile-details dd {
  margin: 0.35rem 0 0;
  font-weight: 600;
}

@media (max-width: 560px) {
  .profile-card {
    grid-template-columns: 1fr;
  }
}
</style>
