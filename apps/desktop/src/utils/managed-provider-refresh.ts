type EventTargetLike = Pick<Window, 'addEventListener' | 'removeEventListener'>

export function registerManagedProviderRefreshListeners(
  target: EventTargetLike,
  reload: EventListener
) {
  target.addEventListener('ai-provider-configs-updated', reload)

  return () => {
    target.removeEventListener('ai-provider-configs-updated', reload)
  }
}
