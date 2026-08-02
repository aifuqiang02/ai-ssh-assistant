export const SSH_CONNECTION_EXPORT_FORMAT = 'ai-ssh-assistant-connections'
export const SSH_CONNECTION_EXPORT_VERSION = 1

export interface SSHConnectionExportItem {
  name: string
  host: string
  port: number
  username: string
  authType: 'PASSWORD' | 'PRIVATE_KEY' | 'SSH_AGENT'
  password?: string
  privateKey?: string
  publicKey?: string
  passphrase?: string
}

export interface SSHConnectionExportEnvelope {
  format: typeof SSH_CONNECTION_EXPORT_FORMAT
  version: typeof SSH_CONNECTION_EXPORT_VERSION
  connections: SSHConnectionExportItem[]
}

export interface SSHConnectionImportResult {
  imported: number
  skipped: number
  invalid: number
}

export function normalizeConnectionHost(host: unknown): string {
  return typeof host === 'string' ? host.trim().toLowerCase() : ''
}

export function normalizeStoredAuthType(authType: unknown): SSHConnectionExportItem['authType'] {
  if (authType === 'PRIVATE_KEY' || authType === 'privateKey') return 'PRIVATE_KEY'
  if (authType === 'SSH_AGENT' || authType === 'agent') return 'SSH_AGENT'
  return 'PASSWORD'
}

export function prepareConnectionImport(
  value: unknown,
  existingHosts: unknown[]
): { connections: SSHConnectionExportItem[]; result: SSHConnectionImportResult } {
  if (!isConnectionExportEnvelope(value)) {
    throw new Error('Unsupported or invalid connection export file')
  }

  const knownHosts = new Set(existingHosts.map(normalizeConnectionHost).filter(Boolean))
  const connections: SSHConnectionExportItem[] = []
  const result: SSHConnectionImportResult = { imported: 0, skipped: 0, invalid: 0 }

  for (const candidate of value.connections) {
    const connection = parseImportConnection(candidate)
    if (!connection) {
      result.invalid++
      continue
    }

    const normalizedHost = normalizeConnectionHost(connection.host)
    if (knownHosts.has(normalizedHost)) {
      result.skipped++
      continue
    }

    knownHosts.add(normalizedHost)
    connections.push(connection)
    result.imported++
  }

  return { connections, result }
}

function isConnectionExportEnvelope(value: unknown): value is SSHConnectionExportEnvelope {
  if (!value || typeof value !== 'object') return false
  const envelope = value as Partial<SSHConnectionExportEnvelope>
  return envelope.format === SSH_CONNECTION_EXPORT_FORMAT &&
    envelope.version === SSH_CONNECTION_EXPORT_VERSION &&
    Array.isArray(envelope.connections)
}

function parseImportConnection(value: unknown): SSHConnectionExportItem | null {
  if (!value || typeof value !== 'object') return null
  const connection = value as Record<string, unknown>
  const name = typeof connection.name === 'string' ? connection.name.trim() : ''
  const host = typeof connection.host === 'string' ? connection.host.trim() : ''
  const username = typeof connection.username === 'string' ? connection.username.trim() : ''
  const port = connection.port === undefined ? 22 : connection.port
  const validAuthTypes = ['PASSWORD', 'PRIVATE_KEY', 'SSH_AGENT', 'password', 'privateKey', 'agent']

  if (!name || !host || !username || !Number.isInteger(port) || Number(port) < 1 || Number(port) > 65535) {
    return null
  }
  if (!validAuthTypes.includes(String(connection.authType))) return null

  const optionalFields = ['password', 'privateKey', 'publicKey', 'passphrase'] as const
  if (optionalFields.some(field => connection[field] !== undefined && typeof connection[field] !== 'string')) {
    return null
  }

  return {
    name,
    host,
    port: Number(port),
    username,
    authType: normalizeStoredAuthType(connection.authType),
    ...(typeof connection.password === 'string' && connection.password ? { password: connection.password } : {}),
    ...(typeof connection.privateKey === 'string' && connection.privateKey ? { privateKey: connection.privateKey } : {}),
    ...(typeof connection.publicKey === 'string' && connection.publicKey ? { publicKey: connection.publicKey } : {}),
    ...(typeof connection.passphrase === 'string' && connection.passphrase ? { passphrase: connection.passphrase } : {})
  }
}
