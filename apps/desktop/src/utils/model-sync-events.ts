type EventTargetLike = Pick<Window, 'addEventListener' | 'removeEventListener'>

export function registerModelSelectionSyncListeners(
  target: EventTargetLike,
  reload: EventListener
) {
  target.addEventListener('ai-model-changed', reload)
  target.addEventListener('settings-updated', reload)
  target.addEventListener('ai-provider-configs-updated', reload)

  return () => {
    target.removeEventListener('ai-model-changed', reload)
    target.removeEventListener('settings-updated', reload)
    target.removeEventListener('ai-provider-configs-updated', reload)
  }
}
