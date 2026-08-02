import test from 'node:test'
import assert from 'node:assert/strict'
import z from 'zod'

import { zodToOpenAIParameters } from './zod-schema.ts'

test('zodToOpenAIParameters preserves Zod 4 optional fields and boolean types', () => {
  const schema = z.object({
    content: z.string().optional(),
    old_string: z.string().optional(),
    new_string: z.string().optional(),
    force_replace: z.boolean().optional(),
    required_value: z.string()
  })

  const parameters = zodToOpenAIParameters(schema)

  assert.equal(parameters.type, 'object')
  assert.equal(parameters.properties.force_replace.type, 'boolean')
  assert.deepEqual(parameters.required, ['required_value'])
  assert.equal(parameters.$schema, undefined)
})
