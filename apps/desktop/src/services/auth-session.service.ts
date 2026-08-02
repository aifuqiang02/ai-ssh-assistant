import { computed, ref } from 'vue'
import { getStoredUser, hasStoredLogin } from './wechat-login.service'

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
})

export function useAuthSession() {
  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    syncAuthState
  }
}
