<template>
  <div class="h-full overflow-y-auto bg-white text-slate-900 antialiased profile-page">
    <main class="max-w-7xl mx-auto px-6 py-10 lg:py-14">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
          选择您的订阅计划
        </h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          为您的软件研发流程提供灵活且强大的动力支持
        </p>

        <div class="mt-10 flex justify-center">
          <div class="relative flex bg-slate-100 p-1 rounded-xl">
            <button
              v-for="cycle in billingCycles"
              :key="cycle.id"
              type="button"
              class="px-6 py-2 text-sm font-semibold transition-all rounded-lg"
              :class="
                selectedBillingCycle === cycle.id
                  ? 'text-slate-900 bg-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              "
              @click="selectedBillingCycle = cycle.id"
            >
              {{ cycle.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div
          class="group relative bg-white rounded-xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
          <div class="mb-8">
            <h3 class="text-xl font-bold text-slate-900">基础版 (Basic)</h3>
            <p class="text-slate-500 text-sm mt-2">满足基础远程开发需求。</p>
          </div>

          <div class="mb-8">
            <span class="text-5xl font-extrabold text-slate-900">¥{{ basePlanDisplay.price }}</span>
            <span class="text-slate-500 font-medium">{{ basePlanDisplay.unit }}</span>
            <div class="text-xs text-slate-400 mt-1">年付 ¥20 · 永久 ¥99</div>
          </div>

          <ul class="space-y-4 mb-10 flex-1">
            <li class="flex items-center gap-3 text-slate-600 text-sm">
              <i class="bi bi-check-circle-fill text-blue-600 text-lg"></i>
              软件本体功能
            </li>
            <li class="flex items-center gap-3 text-slate-600 text-sm">
              <i class="bi bi-check-circle-fill text-blue-600 text-lg"></i>
              SSH 使用权
            </li>
            <li class="flex items-center gap-3 text-slate-600 text-sm">
              <i class="bi bi-check-circle-fill text-blue-600 text-lg"></i>
              自定义模型支持
            </li>
          </ul>

          <button
            class="w-full h-[60px] px-6 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            @click="openUpgradeModal('base')"
          >
            立即升级
          </button>
        </div>

        <div
          class="group relative bg-white rounded-xl border-2 border-blue-600 p-8 shadow-2xl transition-all duration-300 flex flex-col h-full transform lg:scale-105 z-10"
        >
          <div
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-lg text-xs font-bold uppercase tracking-widest"
          >
            最受欢迎
          </div>

          <div class="mb-8">
            <h3 class="text-xl font-bold text-slate-900">全能版 (Full)</h3>
            <p class="text-slate-500 text-sm mt-2">包含 AI 集成的完整套件。</p>
          </div>

          <div class="mb-8">
            <span class="text-5xl font-extrabold text-slate-900">¥{{ fullPlanDisplay.price }}</span>
            <span class="text-slate-500 font-medium">{{ fullPlanDisplay.unit }}</span>
            <div class="text-xs text-slate-400 mt-1">年付 ¥50 · 永久 ¥199</div>
          </div>

          <ul class="space-y-4 mb-10 flex-1">
            <li class="flex items-center gap-3 text-slate-600 text-sm font-semibold">
              <i class="bi bi-check-circle-fill text-blue-600 text-lg"></i>
              包含基础版所有功能
            </li>
            <li class="flex items-center gap-3 text-slate-600 text-sm">
              <i class="bi bi-lightning-charge-fill text-blue-600 text-lg"></i>
              官方模型 (1000次/月)
            </li>
            <li class="flex items-center gap-3 text-slate-600 text-sm">
              <i class="bi bi-check-circle-fill text-blue-600 text-lg"></i>
              优先技术支持
            </li>
          </ul>

          <button
            class="w-full h-[60px] px-6 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            @click="openUpgradeModal('full')"
          >
            立即升级
          </button>
        </div>

        <div
          v-if="selectedBillingCycle === 'monthly'"
          class="group relative bg-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
          <div class="mb-8">
            <h3 class="text-xl font-bold text-slate-900">AI 增强包</h3>
            <p class="text-slate-500 text-sm mt-2 font-medium italic text-blue-600">
              需配合基础版使用
            </p>
          </div>

          <div class="mb-8">
            <span class="text-5xl font-extrabold text-slate-900">¥3</span>
            <span class="text-slate-500 font-medium">/月</span>
          </div>

          <ul class="space-y-4 mb-10 flex-1">
            <li class="flex items-center gap-3 text-slate-600 text-sm">
              <i class="bi bi-cpu-fill text-blue-600 text-lg"></i>
              官方模型额外额度
            </li>
            <li class="flex items-center gap-3 text-slate-600 text-sm">
              <i class="bi bi-check-circle-fill text-blue-600 text-lg"></i>
              适合已有基础套餐的用户
            </li>
          </ul>

          <button
            class="w-full h-[60px] px-6 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-100 transition-colors"
            @click="openUpgradeModal('ai')"
          >
            添加到基础版
          </button>
        </div>
      </div>

      <div class="mt-16 mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div class="flex flex-col gap-2 text-sm text-slate-600">
          <div class="font-semibold text-slate-900">{{ currentStatusLabel }}</div>
          <div>{{ officialQuotaSummary }}</div>
          <div>下次重置时间：{{ officialQuotaResetLabel }}</div>
          <div>试用到期时间：{{ trialExpiresLabel }}</div>
        </div>
      </div>

      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <div
            class="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"
          >
            <i class="bi bi-shield-check"></i>
          </div>
          <h4 class="font-bold text-slate-900 mb-2">企业级安全</h4>
          <p class="text-sm text-slate-500">提供银行级的加密保护，确保您的代码和数据安全无忧。</p>
        </div>

        <div class="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <div
            class="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"
          >
            <i class="bi bi-speedometer2"></i>
          </div>
          <h4 class="font-bold text-slate-900 mb-2">极速连接</h4>
          <p class="text-sm text-slate-500">全球低延迟接入点，为您提供流畅的远程开发体验。</p>
        </div>

        <div class="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <div
            class="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"
          >
            <i class="bi bi-arrow-repeat"></i>
          </div>
          <h4 class="font-bold text-slate-900 mb-2">持续迭代</h4>
          <p class="text-sm text-slate-500">每周进行核心功能更新，确保您始终站在技术的最前沿。</p>
        </div>

        <div class="p-6 bg-slate-50 rounded-xl border border-slate-100">
          <div
            class="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"
          >
            <i class="bi bi-cloud-check"></i>
          </div>
          <h4 class="font-bold text-slate-900 mb-2">99.9% 稳定性</h4>
          <p class="text-sm text-slate-500">可靠的基础设施支持，为您的生产环境提供坚实保障。</p>
        </div>
      </div>

      <SubscriptionPaymentModal
        :show="showPaymentModal"
        :title="paymentModalTitle"
        :description="paymentModalDescription"
        :price="paymentModalPrice"
        :status-text="paymentStatusText"
        :qr-code-data-url="paymentQrCodeDataUrl"
        :loading="paymentLoading"
        @close="closePaymentModal"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SubscriptionPaymentModal from '@/components/profile/SubscriptionPaymentModal.vue'
import {
  activatePaidSubscription,
  createPaymentQrCode,
  pollPaymentSession,
  resolveDefaultPlanCode,
  type PurchasePlanCode
} from '@/services/payment.service'
import {
  getSubscriptionState,
  isTrialActive,
  syncSubscriptionState as syncSharedSubscriptionState
} from '@/services/subscription.service'
import { fetchOfficialModelStatus } from '@/services/official-model-status.service'

const subscriptionState = getSubscriptionState()
const officialStatus = ref<null | {
  monthlyLimit: number
  usedCount: number
  remainingCount: number
  resetAt: string
}>(null)
const showPaymentModal = ref(false)
const paymentLoading = ref(false)
const paymentQrCodeDataUrl = ref('')
const paymentStatusText = ref('待支付')
const paymentModalTitle = ref('开通套餐')
const paymentModalDescription = ref('请使用微信扫码完成支付。')
const paymentModalPrice = ref('')
const currentPaymentPlanCode = ref<PurchasePlanCode>('BASE_MONTHLY')
const currentPaymentBizId = ref('')
let paymentPollTimer: number | null = null
const selectedBillingCycle = ref<'monthly' | 'yearly' | 'lifetime'>('monthly')
type UpgradePlan = 'base' | 'full' | 'ai'

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

const billingCycles = [
  { id: 'monthly', label: '按月订阅' },
  { id: 'yearly', label: '按年订阅' },
  { id: 'lifetime', label: '永久订阅' }
] as const

const openUpgradeModal = (plan: UpgradePlan) => {
  void openPaymentModal(plan)
}

const basePlanDisplay = computed(() => {
  switch (selectedBillingCycle.value) {
    case 'yearly':
      return { price: '20', unit: '/年' }
    case 'lifetime':
      return { price: '99', unit: '' }
    default:
      return { price: '2', unit: '/月' }
  }
})

const fullPlanDisplay = computed(() => {
  switch (selectedBillingCycle.value) {
    case 'yearly':
      return { price: '50', unit: '/年' }
    case 'lifetime':
      return { price: '199', unit: '' }
    default:
      return { price: '5', unit: '/月' }
  }
})

const paymentPlanContent: Record<
  PurchasePlanCode,
  { title: string; description: string; price: string }
> = {
  BASE_MONTHLY: { title: '基础版', description: '用于 SSH 与软件核心功能。', price: '2 元/月' },
  BASE_YEARLY: { title: '基础版', description: '用于 SSH 与软件核心功能。', price: '20 元/年' },
  BASE_LIFETIME: {
    title: '基础版',
    description: '用于 SSH 与软件核心功能。',
    price: '99 元（永久）'
  },
  AI_MONTHLY: { title: 'AI 套餐', description: '用于官方模型每月 1000 次额度。', price: '3 元/月' },
  FULL_MONTHLY: { title: '完整版', description: '包含基础功能与 AI 套餐。', price: '5 元/月' },
  FULL_YEARLY: { title: '完整版', description: '包含基础功能与 AI 套餐。', price: '50 元/年' },
  FULL_LIFETIME: {
    title: '完整版',
    description: '包含基础功能与 AI 套餐。',
    price: '199 元（永久）'
  }
}

const clearPaymentPolling = () => {
  if (paymentPollTimer !== null) {
    window.clearTimeout(paymentPollTimer)
    paymentPollTimer = null
  }
}

const syncSubscriptionState = async () => {
  await syncSharedSubscriptionState()
}

const closePaymentModal = () => {
  clearPaymentPolling()
  showPaymentModal.value = false
}

const startPaymentPolling = async (pollUrl: string) => {
  try {
    const session = await pollPaymentSession(pollUrl)
    paymentStatusText.value =
      session.status === 'paid'
        ? '支付成功'
        : session.status === 'expired'
          ? '二维码已过期'
          : session.status === 'closed'
            ? '支付已关闭'
            : '待支付'

    if (session.status === 'paid') {
      await activatePaidSubscription({
        bizId: currentPaymentBizId.value,
        sessionId: session.sessionId,
        planCode: currentPaymentPlanCode.value
      })
      await syncSubscriptionState()
      window.setTimeout(() => {
        closePaymentModal()
      }, 2200)
      return
    }

    if (session.status === 'pending') {
      paymentPollTimer = window.setTimeout(() => {
        void startPaymentPolling(pollUrl)
      }, 2500)
    }
  } catch (error) {
    console.error('支付状态查询失败', error)
  }
}

const loadPaymentSession = async (planCode: PurchasePlanCode) => {
  paymentLoading.value = true
  paymentQrCodeDataUrl.value = ''
  paymentStatusText.value = '待支付'
  clearPaymentPolling()

  const content = paymentPlanContent[planCode]
  paymentModalTitle.value = content.title
  paymentModalDescription.value = content.description
  paymentModalPrice.value = content.price

  try {
    const result = await createPaymentQrCode(planCode)
    currentPaymentPlanCode.value = planCode
    currentPaymentBizId.value = result.bizId
    paymentQrCodeDataUrl.value = result.qrCodeDataUrl
    await startPaymentPolling(result.session.pollUrl)
  } catch (error) {
    console.error('生成支付二维码失败', error)
  } finally {
    paymentLoading.value = false
  }
}

const openPaymentModal = async (plan: UpgradePlan) => {
  showPaymentModal.value = true
  let planCode = resolveDefaultPlanCode(plan)

  if (plan === 'base') {
    planCode =
      selectedBillingCycle.value === 'yearly'
        ? 'BASE_YEARLY'
        : selectedBillingCycle.value === 'lifetime'
          ? 'BASE_LIFETIME'
          : 'BASE_MONTHLY'
  }

  if (plan === 'full') {
    planCode =
      selectedBillingCycle.value === 'yearly'
        ? 'FULL_YEARLY'
        : selectedBillingCycle.value === 'lifetime'
          ? 'FULL_LIFETIME'
          : 'FULL_MONTHLY'
  }

  await loadPaymentSession(planCode)
}

const trialExpiresLabel = computed(() => {
  if (!subscriptionState.trialExpiresAt) {
    return '未设置'
  }

  return new Date(subscriptionState.trialExpiresAt).toLocaleString()
})

const currentStatusLabel = computed(() => {
  if (isTrialFullAccess.value) {
    return '完整版试用中'
  }

  if (subscriptionState.hasBasePlan && subscriptionState.hasAiPlan) {
    return '完整版已开通'
  }

  if (subscriptionState.hasBasePlan) {
    return '基础版已开通'
  }

  return '未订阅'
})

const officialQuotaSummary = computed(() => {
  if (!officialStatus.value) {
    return '官方模型额度未加载'
  }
  return `官方模型月额度 ${officialStatus.value.remainingCount} / ${officialStatus.value.monthlyLimit}`
})

const officialQuotaResetLabel = computed(() => {
  if (!officialStatus.value?.resetAt) {
    return '未设置'
  }
  return new Date(officialStatus.value.resetAt).toLocaleDateString()
})
</script>

<style scoped>
.profile-page {
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  height: 100%;
  overflow-y: auto;
}
</style>
