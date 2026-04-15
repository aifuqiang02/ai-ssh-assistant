import test from 'node:test'
import assert from 'node:assert/strict'

import { registerManagedProviderRefreshListeners } from './managed-provider-refresh.ts'

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

test('registerManagedProviderRefreshListeners reloads only on provider refresh events', () => {
  const target = new FakeTarget() as unknown as Window
  let calls = 0

  const cleanup = registerManagedProviderRefreshListeners(target, () => {
    calls += 1
  })

  ;['settings-updated', 'ai-provider-configs-updated'].forEach(type => {
    ;(target as unknown as FakeTarget).dispatch(type)
  })

  assert.equal(calls, 1)

  cleanup()
  ;(target as unknown as FakeTarget).dispatch('settings-updated')
  ;(target as unknown as FakeTarget).dispatch('ai-provider-configs-updated')
  assert.equal(calls, 1)
})
