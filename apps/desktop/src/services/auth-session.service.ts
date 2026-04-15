import { computed, ref } from 'vue'
import { getStoredUser, hasStoredLogin } from './wechat-login.service'
import { syncSubscriptionState } from './subscription.service'

const currentUser = ref(getStoredUser())
const isAuthenticated = ref(hasStoredLogin())

function syncAuthState() {
  currentUser.value = getStoredUser()
  isAuthenticated.value = hasStoredLogin() && !!currentUser.value

  console.log('[auth-session] syncAuthState', {
    hasToken: hasStoredLogin(),
    hasUser: !!currentUser.value,
    user: currentUser.value,
    isAuthenticated: isAuthenticated.value
  })
}

window.addEventListener('auth-state-changed', () => {
  console.log('[auth-session] received auth-state-changed event')
  syncAuthState()
  console.log('[auth-session] syncing subscription after auth change', {
    hasToken: hasStoredLogin(),
    hasUser: !!getStoredUser()
  })
  syncSubscriptionState().catch(error => {
    console.warn('[subscription] auth-state sync failed', error)
  })
})

export function useAuthSession() {
  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    syncAuthState
  }
}
