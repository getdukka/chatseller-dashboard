// middleware/guest.ts - AVEC IMPORTS EXPLICITES
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ne pas exécuter côté serveur
  if (process.server) return

  try {
    const authStore = useAuthStore()

    // Restaurer la session si nécessaire
    if (!authStore.isAuthenticated) {
      await authStore.restoreSession()
    }

    // Si l'utilisateur est connecté, rediriger vers le dashboard
    if (authStore.isLoggedIn) {
      console.log('🔄 Middleware guest: Utilisateur connecté, redirection vers dashboard')
      return navigateTo('/')
    }

    console.log('✅ Middleware guest: Accès autorisé pour utilisateur non connecté')
  } catch (error) {
    console.warn('⚠️ Middleware guest: Erreur store, autorisation par défaut:', error)
    // En cas d'erreur, on laisse passer pour ne pas bloquer l'accès
  }
})