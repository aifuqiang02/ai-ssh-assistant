const PROD_API_ORIGIN = 'https://api.tx07.cn/ai-ssh'
const DEV_API_ORIGIN = 'http://127.0.0.1:3000'

export function getRendererApiOrigin(): string {
  const envBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL
  return envBaseUrl || DEV_API_ORIGIN
}

export function getRendererApiBaseUrl(): string {
  return `${getRendererApiOrigin()}/api/v1`
}

export function getRendererLegalBaseUrl(): string {
  return `${getRendererApiOrigin()}/legal`
}

export function getApiOriginByMode(isProduction: boolean): string {
  return isProduction ? PROD_API_ORIGIN : DEV_API_ORIGIN
}

export function getApiBaseUrlByMode(isProduction: boolean): string {
  return `${getApiOriginByMode(isProduction)}/api/v1`
}
