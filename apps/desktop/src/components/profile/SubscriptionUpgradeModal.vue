<template>
  <div v-if="show" class="upgrade-modal-overlay" @click.self="emit('close')">
    <div class="upgrade-modal">
      <div class="upgrade-modal-header">
        <h3>选择开通套餐</h3>
        <button type="button" class="close-button" @click="emit('close')">关闭</button>
      </div>

      <div class="upgrade-plan-grid">
        <button
          v-for="plan in plans"
          :key="plan.id"
          type="button"
          class="upgrade-plan-card"
          :class="{ active: selectedPlan === plan.id, recommended: plan.id === 'full' }"
          @click="selectedPlan = plan.id"
        >
          <div class="upgrade-plan-title">{{ plan.title }}</div>
          <div class="upgrade-plan-desc">{{ plan.description }}</div>
          <div class="upgrade-plan-pricing">
            <p>{{ currentPrice(plan) }}</p>
          </div>
        </button>
      </div>

      <div class="upgrade-modal-footer">
        <button type="button" class="secondary-button" @click="emit('close')">取消</button>
        <button type="button" class="primary-button" @click="emit('confirm', selectedPlan)">
          立即开通
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

export type UpgradePlan = 'base' | 'ai' | 'full'
export type BillingCycle = 'monthly' | 'yearly' | 'lifetime'

const props = defineProps<{
  show: boolean
  initialPlan: UpgradePlan
  billingCycle: BillingCycle
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', plan: UpgradePlan): void
}>()

const selectedPlan = ref<UpgradePlan>(props.initialPlan)

watch(
  () => props.initialPlan,
  plan => {
    selectedPlan.value = plan
  },
  { immediate: true }
)

const plans: Array<{
  id: UpgradePlan
  title: string
  description: string
  pricing: Record<BillingCycle, string>
}> = [
  {
    id: 'base',
    title: '基础版',
    description: '用于 SSH 与软件核心功能。',
    pricing: {
      monthly: '2 元/月',
      yearly: '20 元/年',
      lifetime: '99 元（永久）'
    }
  },
  {
    id: 'ai',
    title: 'AI 套餐',
    description: '用于官方模型每月 1000 次额度。',
    pricing: {
      monthly: '3 元/月',
      yearly: '3 元/月',
      lifetime: '3 元/月'
    }
  },
  {
    id: 'full',
    title: '完整版',
    description: '包含基础功能与 AI 套餐。',
    pricing: {
      monthly: '5 元/月',
      yearly: '50 元/年',
      lifetime: '199 元（永久）'
    }
  }
]

const currentPrice = (plan: (typeof plans)[number]) => {
  return plan.pricing[props.billingCycle]
}
</script>

<style scoped>
.upgrade-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.upgrade-modal {
  width: min(760px, 92vw);
  background: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 14px;
  padding: 20px;
}

.upgrade-modal-header,
.upgrade-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.upgrade-plan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 18px 0;
}

.upgrade-plan-card {
  text-align: left;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--vscode-border);
  background: var(--vscode-bg);
}

.upgrade-plan-card.active {
  border-color: var(--vscode-accent);
}

.upgrade-plan-card.recommended {
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.upgrade-plan-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.upgrade-plan-desc,
.upgrade-plan-pricing {
  font-size: 13px;
  color: var(--vscode-fg-muted);
}

.upgrade-plan-pricing {
  margin-top: 12px;
}

.close-button,
.secondary-button,
.primary-button {
  padding: 8px 14px;
  border-radius: 8px;
}

.primary-button {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
}
</style>
