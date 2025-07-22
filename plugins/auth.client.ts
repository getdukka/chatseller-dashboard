// plugins/auth.client.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  // Plugin côté client uniquement
  const authStore = useAuthStore()
  
  try {
    // Initialiser l'authentification depuis le localStorage
    await authStore.initializeAuth()
    
    // Configuration d'auto-rafraîchissement du token
    if (authStore.isAuthenticated) {
      setupTokenRefreshTimer(authStore)
      setupActivityTracking(authStore)
    }

    console.log('✅ Plugin auth initialisé')
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'auth:', error)
  }
})

/**
 * Configure le rafraîchissement automatique du token
 */
function setupTokenRefreshTimer(authStore: any) {
  const checkTokenExpiry = () => {
    if (!authStore.isAuthenticated) return

    const timeUntilExpiry = authStore.timeUntilExpiry
    const tenMinutes = 10 * 60 * 1000 // 10 minutes

    // Si le token expire dans moins de 10 minutes, on le renouvelle
    if (timeUntilExpiry > 0 && timeUntilExpiry < tenMinutes) {
      authStore.refreshAuthToken().catch((error: any) => {
        console.error('Erreur lors du rafraîchissement automatique du token:', error)
        // En cas d'erreur, déconnecter l'utilisateur
        authStore.logout(false)
        navigateTo('/login?expired=true')
      })
    }
  }

  // Vérifier toutes les 5 minutes
  const intervalId = setInterval(checkTokenExpiry, 5 * 60 * 1000)
  
  // Vérification initiale
  checkTokenExpiry()

  // Nettoyer l'intervalle lors de la destruction
  onBeforeUnmount(() => {
    clearInterval(intervalId)
  })
}

/**
 * Configure le suivi d'activité utilisateur
 */
function setupActivityTracking(authStore: any) {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  let activityTimeout: NodeJS.Timeout | null = null

  const updateActivity = () => {
    if (authStore.isAuthenticated) {
      authStore.updateActivity()
    }
  }

  const throttledUpdateActivity = throttle(updateActivity, 60000) // Throttle à 1 minute

  // Écouter les événements d'activité
  events.forEach(event => {
    document.addEventListener(event, throttledUpdateActivity, { passive: true })
  })

  // Vérifier la validité de session périodiquement
  const sessionCheckInterval = setInterval(() => {
    if (authStore.isAuthenticated && !authStore.isSessionValid) {
      console.log('Session expirée due à l\'inactivité')
      authStore.logout(false)
      navigateTo('/login?timeout=true')
    }
  }, 60000) // Vérifier toutes les minutes

  // Nettoyer lors de la destruction
  onBeforeUnmount(() => {
    events.forEach(event => {
      document.removeEventListener(event, throttledUpdateActivity)
    })
    clearInterval(sessionCheckInterval)
    if (activityTimeout) {
      clearTimeout(activityTimeout)
    }
  })
}

/**
 * Fonction throttle pour limiter la fréquence d'exécution
 */
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}