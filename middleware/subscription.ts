// middleware/subscription.ts - AVEC IMPORTS EXPLICITES
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ne pas exécuter côté serveur
  if (process.server) return

  try {
    const authStore = useAuthStore()

    // Vérifier si l'utilisateur est connecté
    if (!authStore.isLoggedIn) {
      return navigateTo('/login')
    }

    const user = authStore.user
    if (!user) {
      return navigateTo('/login')
    }

    // TODO: Implémenter la logique de vérification d'abonnement
    // Pour l'instant, on autorise tous les utilisateurs connectés
    const hasValidSubscription = true // À remplacer par la vraie logique

    if (!hasValidSubscription && to.path !== '/billing') {
      console.log('💳 Middleware subscription: Abonnement requis, redirection vers billing')
      throw createError({
        statusCode: 402,
        statusMessage: 'Abonnement requis'
      })
    }

    console.log('✅ Middleware subscription: Abonnement valide')
  } catch (error) {
    console.error('❌ Middleware subscription: Erreur:', error)
    // En cas d'erreur, rediriger vers le dashboard pour éviter de bloquer
    return navigateTo('/dashboard')
  }
})