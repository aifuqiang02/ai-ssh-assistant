import { toJSONSchema } from 'zod'

export function zodToOpenAIParameters(zodType: any): any {
  if (!zodType || typeof zodType !== 'object') {
    return { type: 'object', properties: {} }
  }

  const { $schema: _schema, ...parameters } = toJSONSchema(zodType, {
    target: 'draft-7',
    unrepresentable: 'any'
  }) as Record<string, any>
  return parameters
}
