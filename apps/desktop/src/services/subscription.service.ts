import { reactive } from 'vue'
import apiService, { type BillingSubscriptionState } from './api.service'
import { getStoredUser } from './wechat-login.service'

export type PlanType = 'monthly' | 'yearly' | 'lifetime' | null

export interface SubscriptionState {
  trialExpiresAt: string | null
  hasBasePlan: boolean
  hasAiPlan: boolean
  basePlanType: PlanType
  aiPlanType: PlanType
  baseExpiresAt: string | null
  aiExpiresAt: string | null
}

const STORAGE_KEY = 'subscriptionState'

function readStoredState(): SubscriptionState | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as SubscriptionState
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function buildGuestState(): SubscriptionState {
  return {
    trialExpiresAt: null,
    hasBasePlan: false,
    hasAiPlan: false,
    basePlanType: null,
    aiPlanType: null,
    baseExpiresAt: null,
    aiExpiresAt: null
  }
}

export function getSubscriptionState(): SubscriptionState {
  return subscriptionState
}

export function setSubscriptionState(state: SubscriptionState) {
  Object.assign(subscriptionState, state)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptionState))
}

export function clearSubscriptionState() {
  localStorage.removeItem(STORAGE_KEY)
  Object.assign(subscriptionState, buildGuestState())
}

export async function syncSubscriptionState() {
  const user = getStoredUser()
  const localToken = localStorage.getItem('userToken') || sessionStorage.getItem('userToken')

  console.log('[subscription] sync start', {
    hasUser: !!user,
    userId: user?.id,
    username: user?.username,
    hasToken: !!localToken,
    tokenPreview: localToken?.slice(0, 16)
  })

  if (!user) {
    setSubscriptionState(buildGuestState())
    console.log('[subscription] sync short-circuit guest state')
    return subscriptionState
  }

  try {
    const response = await apiService.getSubscription()
    if (response.success && response.data) {
      setSubscriptionState(response.data as BillingSubscriptionState)
      console.log('[subscription] sync success', {
        hasBasePlan: response.data.hasBasePlan,
        hasAiPlan: response.data.hasAiPlan,
        trialExpiresAt: response.data.trialExpiresAt
      })
    }
  } catch (error) {
    console.warn('[subscription] sync failed, keep local state', error)
  }

  return subscriptionState
}

const initialState = readStoredState() || buildGuestState()
const subscriptionState = reactive<SubscriptionState>(initialState)

localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptionState))

export function isTrialActive(trialExpiresAt: string | null) {
  return Boolean(trialExpiresAt && new Date(trialExpiresAt).getTime() > Date.now())
}

export function getRemainingTrialDays(trialExpiresAt: string | null) {
  if (!trialExpiresAt) {
    return 0
  }

  const diff = new Date(trialExpiresAt).getTime() - Date.now()
  if (diff <= 0) {
    return 0
  }

  return Math.ceil(diff / (24 * 60 * 60 * 1000))
}

export function canUseSsh(state: SubscriptionState) {
  return isTrialActive(state.trialExpiresAt) || state.hasBasePlan
}

export function getSshUpgradeMessage(state: SubscriptionState) {
  if (isTrialActive(state.trialExpiresAt)) {
    return null
  }

  if (!state.hasBasePlan) {
    return '试用期结束,需要继续订阅才能使用。'
  }

  return null
}
