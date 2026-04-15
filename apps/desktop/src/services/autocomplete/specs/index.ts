/**
 * 所有补全规范的索引
 */
import type { CompletionSpec } from '@/types/autocomplete'

import { cdSpec } from './cd'
import { gitSpec } from './git'
import { npmSpec } from './npm'
import { lsSpec } from './ls'
import { dockerSpec } from './docker'
import { catSpec } from './cat'
import { grepSpec } from './grep'
import { findSpec } from './find'

/**
 * 所有内置的补全规范
 */
export const builtInSpecs: CompletionSpec[] = [
  cdSpec,
  lsSpec,
  catSpec,
  grepSpec,
  findSpec,
  gitSpec,
  npmSpec,
  dockerSpec
]

/**
 * 根据命令名称获取规范
 */
export function getSpecByName(name: string): CompletionSpec | undefined {
  return builtInSpecs.find(spec => {
    if (Array.isArray(spec.name)) {
      return spec.name.includes(name)
    }
    return spec.name === name
  })
}

/**
 * 获取所有命令名称
 */
export function getAllCommandNames(): string[] {
  const names: string[] = []
  builtInSpecs.forEach(spec => {
    if (Array.isArray(spec.name)) {
      names.push(...spec.name)
    } else {
      names.push(spec.name)
    }
  })
  return names
}

