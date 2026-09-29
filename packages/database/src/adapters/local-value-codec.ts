type StoredFieldType = 'string' | 'number' | 'boolean' | 'json' | 'date'

const FIELD_TYPES: Record<string, Record<string, StoredFieldType>> = {
  User: {
    isActive: 'boolean'
  },
  UserSettings: {
    data: 'json'
  },
  SSHFolder: {
    order: 'number',
    isActive: 'boolean'
  },
  SSHConnection: {
    port: 'number',
    order: 'number',
    isActive: 'boolean'
  },
  ChatFolder: {
    order: 'number',
    isActive: 'boolean'
  },
  ChatSession: {
    config: 'json',
    meta: 'json',
    summarizedMessageCount: 'number'
  },
  Message: {
    meta: 'json',
    extra: 'json',
    translate: 'json',
    tts: 'json',
    isDeleted: 'boolean',
    isEdited: 'boolean'
  },
  CommandLog: {
    exitCode: 'number',
    duration: 'number',
    metadata: 'json'
  },
  DocumentFolder: {
    order: 'number',
    isActive: 'boolean'
  },
  DocumentFile: {
    order: 'number',
    size: 'number',
    openCount: 'number',
    isStarred: 'boolean'
  },
  DocumentEditHistory: {
    diff: 'json'
  }
}

function getFieldType(model: string, field: string): StoredFieldType {
  if (field === 'createdAt' || field === 'updatedAt' || field === 'lastUsed') {
    return 'date'
  }

  return FIELD_TYPES[model]?.[field] || 'string'
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function deserializeStoredField(value: unknown, type: StoredFieldType): unknown {
  if (value === null || value === undefined) return null

  if (type === 'string') {
    return typeof value === 'string' ? value : String(value)
  }

  if (type === 'json') {
    return typeof value === 'string' ? parseJson(value) : value
  }

  if (type === 'date') {
    if (typeof value !== 'string') return value
    const parsed = parseJson(value)
    return typeof parsed === 'string' ? parsed : value
  }

  if (type === 'number') {
    if (typeof value === 'number') return value
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : value
  }

  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0

  const normalized = String(value).trim().toLowerCase()
  if (normalized === 'true' || normalized === '1') return true
  if (normalized === 'false' || normalized === '0') return false
  return value
}

export function deserializeStorageRow(
  model: string,
  row: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key,
      deserializeStoredField(value, getFieldType(model, key))
    ])
  )
}
