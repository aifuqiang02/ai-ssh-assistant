import QRCode from 'qrcode'
import apiService, {
  type ActivateSubscriptionRequest,
  type BillingSubscriptionState,
  type CreatePaymentSessionRequest,
  type PaymentSessionResponse
} from './api.service'
import { setSubscriptionState } from './subscription.service'

export type UpgradePlan = 'base' | 'ai' | 'full'
export type PurchasePlanCode = CreatePaymentSessionRequest['planCode']

export function createPaymentBizId() {
  return `pay-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function resolveDefaultPlanCode(plan: UpgradePlan): PurchasePlanCode {
  switch (plan) {
    case 'ai':
      return 'AI_MONTHLY'
    case 'full':
      return 'FULL_MONTHLY'
    default:
      return 'BASE_MONTHLY'
  }
}

type PaymentPollEnvelope = {
  code: number
  msg: string
  data?: PaymentSessionResponse
}

async function requestPaymentPoll(url: string): Promise<PaymentPollEnvelope> {
  if (window.electronAPI?.api?.wechatRequest) {
    return window.electronAPI.api.wechatRequest('', 'GET', undefined, undefined, url)
  }

  const response = await fetch(url)
  return response.json()
}

export async function createPaymentQrCode(planCode: PurchasePlanCode) {
  const bizId = createPaymentBizId()
  const response = await apiService.createPaymentSession({ bizId, planCode })

  if (!response.success || !response.data) {
    throw new Error(response.message || '生成支付二维码失败')
  }

  const qrCodeDataUrl = await QRCode.toDataURL(response.data.qrCodeUrl, {
    width: 240,
    margin: 1,
    errorCorrectionLevel: 'M'
  })

  return {
    bizId,
    session: response.data,
    qrCodeDataUrl
  }
}

export async function pollPaymentSession(pollUrl: string) {
  const payload = await requestPaymentPoll(pollUrl)

  if (payload.code !== 200 || !payload.data) {
    throw new Error(payload.msg || '查询支付状态失败')
  }

  return payload.data
}

export async function activatePaidSubscription(input: ActivateSubscriptionRequest) {
  const response = await apiService.activateSubscription(input)

  if (!response.success || !response.data) {
    throw new Error(response.message || '订阅生效失败')
  }

  setSubscriptionState(response.data as BillingSubscriptionState)
  return response.data
}
