// plugins/auth.client.ts - VERSION FUSIONNÉE AVEC TES FONCTIONNALITÉS
import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  // Seulement côté client
  if (!process.client) return

  console.log('🔌 [Plugin Auth] Initialisation côté client...')
  
  // ✅ TON CODE EXISTANT - Intercepter les erreurs 401 globalement
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.statusCode === 401) {
      localStorage.removeItem('chatseller_token')
      localStorage.removeItem('chatseller_user')
      window.location.href = '/login'
    }
  })
  
  console.log('✅ Plugin auth: Intercepteur d\'erreurs 401 installé')

  // ✅ AJOUT - Restaurer la session si elle existe
  const authStore = useAuthStore()
  
  try {
    await authStore.restoreSession()
    console.log('✅ [Plugin Auth] Session restaurée:', authStore.isAuthenticated)
  } catch (error) {
    console.warn('⚠️ [Plugin Auth] Erreur restauration session:', error)
    // Ne pas bloquer l'app, juste nettoyer
    authStore.clearAuth()
  }
})