import test from 'node:test'
import assert from 'node:assert/strict'

import { registerModelSelectionSyncListeners } from './model-sync-events'

class FakeTarget {
  listeners = new Map<string, Set<EventListener>>()

  addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    const fn = listener as EventListener
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(fn)
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
    this.listeners.get(type)?.delete(listener as EventListener)
  }

  dispatch(type: string) {
    for (const listener of this.listeners.get(type) || []) {
      listener(new Event(type))
    }
  }
}

test('registerModelSelectionSyncListeners reloads on model and settings related events', () => {
  const target = new FakeTarget() as unknown as Window
  let calls = 0

  const cleanup = registerModelSelectionSyncListeners(target, () => {
    calls += 1
  })

  ;['ai-model-changed', 'settings-updated', 'ai-provider-configs-updated'].forEach(type => {
    ;(target as unknown as FakeTarget).dispatch(type)
  })

  assert.equal(calls, 3)

  cleanup()
  ;(target as unknown as FakeTarget).dispatch('ai-model-changed')
  assert.equal(calls, 3)
})
