<template>
  <div class="welcome-page">
    <div class="welcome-shell">
      <main class="welcome-main">
        <header class="welcome-header">
          <h1 class="welcome-title">AI SSH</h1>
          <p class="welcome-subtitle">
            集成 AI Agent 的下一代终端，兼具传统 SSH 连接与高效文件管理功能。
          </p>
        </header>

        <section class="developer-card">
          <div class="developer-card__icon">
            <i class="bi bi-heart-fill text-2xl"></i>
          </div>
          <div>
            <h4 class="developer-card__title">来自开发者</h4>
            <p class="developer-card__body">
              “因软件作者是独立开发者，所以只有有收入，才能支撑不断迭代更新。希望大家能理解，如果工具大家用的不错的话，就支持下。”
            </p>
            <div class="developer-card__group">
              <i class="bi bi-people-fill text-xl"></i>
              <button type="button" class="qq-group-button" @click="copyQqGroupNumber">
                官方交流QQ群：<span class="font-bold">{{ qqGroupNumber }}</span>
              </button>
            </div>
          </div>
        </section>

        <section class="overview-grid">
          <div class="subscription-card">
            <div class="subscription-card__header">
              <div>
                <span class="subscription-card__badge">当前订阅状态</span>
                <h2 class="subscription-card__title">{{ currentStatusLabel }}</h2>
                <p class="subscription-card__text">{{ currentStatusDescription }}</p>
              </div>
              <div class="subscription-card__meta">
                <div class="subscription-card__label">到期时间</div>
                <div class="subscription-card__title subscription-card__title--small">
                  {{ subscriptionExpiryLabel }}
                </div>
              </div>
            </div>

            <div class="subscription-card__body">
              <div class="feature-item">
                <div class="feature-item__icon"><i class="bi bi-terminal"></i></div>
                <h3 class="feature-item__title">SSH 终端</h3>
                <p class="feature-item__text">毫秒级响应的远程连接，支持多标签与自定义主题。</p>
              </div>

              <div class="feature-item">
                <div class="feature-item__icon"><i class="bi bi-cpu"></i></div>
                <h3 class="feature-item__title">AI Agent</h3>
                <p class="feature-item__text">内置智能助手，自动补全命令并解释报错原因。</p>
              </div>

              <div class="feature-item">
                <div class="feature-item__icon"><i class="bi bi-folder2-open"></i></div>
                <h3 class="feature-item__title">文件管理</h3>
                <p class="feature-item__text">直观的 SFTP 管理界面，支持拖拽上传与在线编辑。</p>
              </div>
            </div>
          </div>

          <aside class="trial-card">
            <div>
              <h3 class="trial-card__title">{{ trialCardTitle }}</h3>
              <div class="trial-card__progress-wrap">
                <div class="trial-card__progress-top">
                  <span class="trial-card__pill">{{ trialCardPillText }}</span>
                  <span class="trial-card__accent">{{ trialProgressPercent }}%</span>
                </div>
                <div class="trial-card__track">
                  <div class="trial-card__bar" :style="{ width: `${trialProgressPercent}%` }"></div>
                </div>
              </div>
            </div>

            <div class="trial-card__stats">
              <div class="trial-card__row">
                <span class="trial-card__text">官方模型月额度</span>
                <strong class="trial-card__value">{{ officialUsageSummary }}</strong>
              </div>
              <div class="trial-card__row">
                <span class="trial-card__text">下次重置时间</span>
                <strong class="trial-card__value">{{ officialResetLabel }}</strong>
              </div>
            </div>

            <button class="trial-card__button" @click="openSubscriptionTab">
              立即升级
              <i class="bi bi-lightning-charge-fill text-sm"></i>
            </button>
          </aside>
        </section>

        <section class="highlights-section">
          <h3 class="highlights-section__title">功能亮点</h3>
          <div class="highlights-grid">
            <article class="highlight-card">
              <div class="highlight-card__header">
                <i class="bi bi-robot highlight-card__accent"></i>
                <div class="highlight-card__title">AI 命令辅助</div>
              </div>
              <p class="highlight-card__text">
                输入自然语言，自动生成复杂的 Shell 指令。支持实时纠错与性能优化建议。
              </p>
            </article>

            <article class="highlight-card">
              <div class="highlight-card__header">
                <i class="bi bi-keyboard highlight-card__accent"></i>
                <div class="highlight-card__title">极致终端体验</div>
              </div>
              <p class="highlight-card__text">
                基于 Xterm.js 构建，支持 256 色、TrueColor 以及超大数据量无感滚动流。
              </p>
            </article>

            <article class="highlight-card">
              <div class="highlight-card__header">
                <i class="bi bi-shield-check highlight-card__accent"></i>
                <div class="highlight-card__title">本地安全同步</div>
              </div>
              <p class="highlight-card__text">
                加密存储您的 SSH 配置、私钥与 AI
                设置，所有敏感信息仅存储在本地，不上传云端，确保极致安全。
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getRemainingTrialDays,
  getSubscriptionState,
  isTrialActive
} from '@/services/subscription.service'
import { fetchOfficialModelStatus } from '@/services/official-model-status.service'
import { $alert } from '@/composables/useDialog'

const router = useRouter()
const openNewTab =
  inject<(id: string, name: string, icon: string, path: string) => void>('openNewTab')
const subscriptionState = getSubscriptionState()
const qqGroupNumber = '307460844'
const officialStatus = ref<null | {
  monthlyLimit: number
  usedCount: number
  remainingCount: number
  resetAt: string
}>(null)

onMounted(async () => {
  try {
    officialStatus.value = await fetchOfficialModelStatus()
  } catch {
    officialStatus.value = null
  }
})

const isTrialFullAccess = computed(() => {
  return (
    isTrialActive(subscriptionState.trialExpiresAt) &&
    !subscriptionState.basePlanType &&
    !subscriptionState.aiPlanType
  )
})

const openSubscriptionTab = () => {
  console.log('[WelcomeView] openSubscriptionTab', {
    hasOpenNewTab: !!openNewTab
  })

  if (openNewTab) {
    console.log('[WelcomeView] opening profile via openNewTab')
    openNewTab('profile', '个人中心', 'bi bi-person-circle', '/profile')
    return
  }

  console.log('[WelcomeView] opening profile via router.push')
  router.push('/profile')
}

const copyQqGroupNumber = async () => {
  try {
    await navigator.clipboard.writeText(qqGroupNumber)
    $alert(`已复制QQ群号：${qqGroupNumber}`)
  } catch (error) {
    console.error('复制QQ群号失败:', error)
    $alert('复制失败，请手动复制群号')
  }
}

const currentStatusLabel = computed(() => {
  if (isTrialFullAccess.value) {
    return '1个月全功能试用'
  }

  if (subscriptionState.hasBasePlan && subscriptionState.hasAiPlan) {
    return '完整版已开通'
  }

  if (subscriptionState.hasBasePlan) {
    return '基础版已开通'
  }

  if (!subscriptionState.trialExpiresAt) {
    return '未登录'
  }

  return '试用已结束'
})

const currentStatusDescription = computed(() => {
  if (isTrialFullAccess.value) {
    return '您正享有全部专业功能的完整访问权限。'
  }

  if (subscriptionState.hasBasePlan && subscriptionState.hasAiPlan) {
    return '当前账号已开通完整功能与官方模型额度。'
  }

  if (subscriptionState.hasBasePlan) {
    return '当前账号已开通基础功能，可继续使用 SSH 与自定义模型。'
  }

  if (!subscriptionState.trialExpiresAt) {
    return '当前尚未登录账号，登录后可查看订阅权益并继续使用完整能力。'
  }

  return '试用期已结束，请继续订阅后使用完整能力。'
})

const subscriptionExpiryLabel = computed(() => {
  if (subscriptionState.hasAiPlan && subscriptionState.aiPlanType) {
    if (subscriptionState.aiPlanType === 'lifetime') {
      return '永久有效'
    }

    if (subscriptionState.aiExpiresAt) {
      return new Date(subscriptionState.aiExpiresAt).toLocaleDateString()
    }

    return '已开通'
  }

  if (subscriptionState.hasBasePlan && subscriptionState.basePlanType) {
    if (subscriptionState.basePlanType === 'lifetime') {
      return '永久有效'
    }

    if (subscriptionState.baseExpiresAt) {
      return new Date(subscriptionState.baseExpiresAt).toLocaleDateString()
    }

    return '已开通'
  }

  if (isTrialActive(subscriptionState.trialExpiresAt) && subscriptionState.trialExpiresAt) {
    return new Date(subscriptionState.trialExpiresAt).toLocaleDateString()
  }

  return '已结束'
})

const remainingTrialDays = computed(() => getRemainingTrialDays(subscriptionState.trialExpiresAt))

const officialUsageSummary = computed(() => {
  if (!officialStatus.value) {
    return '未加载'
  }
  return `${officialStatus.value.remainingCount} / ${officialStatus.value.monthlyLimit}`
})

const officialResetLabel = computed(() => {
  if (!officialStatus.value?.resetAt) {
    return '未设置'
  }
  return new Date(officialStatus.value.resetAt).toLocaleDateString()
})

const trialCardTitle = computed(() => {
  if (isTrialFullAccess.value) {
    return '试用剩余天数'
  }

  if (subscriptionState.hasBasePlan && subscriptionState.hasAiPlan) {
    return '完整版状态'
  }

  if (subscriptionState.hasBasePlan) {
    return '基础版状态'
  }

  return '订阅状态'
})

const trialCardPillText = computed(() => {
  if (isTrialFullAccess.value) {
    return `剩余 ${remainingTrialDays.value} 天`
  }

  if (subscriptionState.hasBasePlan && subscriptionState.hasAiPlan) {
    return '完整版已开通'
  }

  if (subscriptionState.hasBasePlan) {
    return '基础版已开通'
  }

  return '试用已结束'
})

const trialProgressPercent = computed(() => {
  if (isTrialFullAccess.value) {
    const days = remainingTrialDays.value
    if (days <= 0) return 0
    return Math.max(0, Math.min(100, Math.round((days / 30) * 100)))
  }

  if (subscriptionState.hasBasePlan && subscriptionState.hasAiPlan) {
    return 100
  }

  if (subscriptionState.hasBasePlan) {
    return 100
  }

  if (!isTrialActive(subscriptionState.trialExpiresAt)) {
    return 0
  }

  return 0
})
</script>

<style scoped>
.welcome-page {
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  height: 100%;
  overflow-y: auto;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.welcome-shell {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
  padding: 3rem 1rem;
}

.welcome-main {
  width: 100%;
  max-width: 72rem;
}

.welcome-header {
  margin-bottom: 2.5rem;
}

.welcome-title,
.subscription-card__title,
.trial-card__title,
.highlights-section__title,
.feature-item__title,
.highlight-card__title,
.developer-card__title {
  color: var(--vscode-fg);
}

.welcome-title {
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 800;
  margin: 0 0 0.75rem;
}

.welcome-subtitle,
.subscription-card__text,
.subscription-card__label,
.feature-item__text,
.trial-card__text,
.highlight-card__text,
.developer-card__body {
  color: var(--vscode-fg-muted);
}

.welcome-subtitle {
  max-width: 42rem;
  font-size: 1.125rem;
  line-height: 1.7;
  margin: 0;
}

.developer-card,
.subscription-card,
.trial-card,
.highlight-card {
  background: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 0.75rem;
}

.developer-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
}

.developer-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vscode-bg-lighter);
  color: var(--vscode-warning);
}

.developer-card__title {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.developer-card__body {
  margin: 0;
  font-style: italic;
  line-height: 1.7;
}

.developer-card__group {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vscode-border-subtle);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vscode-accent);
  font-weight: 500;
}

.qq-group-button {
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0;
  cursor: pointer;
}

.qq-group-button:hover {
  text-decoration: underline;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.subscription-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.subscription-card__header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between;
  padding: 2rem;
  border-bottom: 1px solid var(--vscode-border-subtle);
}

.subscription-card__badge,
.trial-card__pill {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vscode-accent);
  background: color-mix(in srgb, var(--vscode-accent) 12%, transparent);
}

.subscription-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.subscription-card__title--small {
  font-size: 1.125rem;
}

.subscription-card__text,
.subscription-card__label {
  margin: 0.25rem 0 0;
}

.subscription-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.subscription-card__body {
  display: grid;
  gap: 2rem;
  padding: 2rem;
  background: color-mix(in srgb, var(--vscode-bg) 70%, var(--vscode-bg-light) 30%);
}

.feature-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-icon-box {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: color-mix(in srgb, var(--vscode-accent) 12%, transparent);
  color: var(--vscode-accent);
}

.feature-item__title,
.highlight-card__title,
.trial-card__title,
.highlights-section__title {
  margin: 0;
  font-weight: 700;
}

.feature-item__text,
.highlight-card__text,
.trial-card__text {
  margin: 0;
  line-height: 1.7;
}

.trial-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: 2rem;
}

.trial-card__progress-wrap {
  position: relative;
  padding-top: 0.25rem;
}

.trial-card__progress-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.trial-card__accent,
.highlight-card__accent {
  color: var(--vscode-accent);
}

.trial-card__track {
  overflow: hidden;
  height: 0.5rem;
  display: flex;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vscode-accent) 12%, transparent);
}

.trial-card__bar {
  background: var(--vscode-accent);
}

.trial-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vscode-border-subtle);
}

.trial-card__value {
  color: var(--vscode-fg);
}

.trial-card__button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
  font-weight: 600;
  cursor: pointer;
}

.trial-card__button:hover {
  background: var(--vscode-accent-hover);
}

.highlights-section {
  grid-column: 1 / -1;
  margin-top: 2rem;
}

.highlights-section__title {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.highlight-card {
  padding: 1.5rem;
  transition: border-color 0.2s ease;
}

.highlight-card:hover {
  border-color: var(--vscode-accent);
}

.highlight-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.text-primary {
  color: var(--vscode-accent);
}

.bg-primary {
  background-color: var(--vscode-accent);
}

.border-primary {
  border-color: var(--vscode-accent);
}

@media (min-width: 768px) {
  .overview-grid {
    grid-template-columns: 2fr 1fr;
  }

  .subscription-card__header {
    flex-direction: row;
    align-items: center;
  }

  .subscription-card__meta {
    align-items: flex-end;
  }

  .subscription-card__body {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .highlights-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
