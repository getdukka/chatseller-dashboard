// middleware/onboarding.ts - AVEC IMPORTS EXPLICITES
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

    // Vérifier si l'onboarding est nécessaire
    // TODO: Ajouter la logique métier pour déterminer si l'onboarding est terminé
    const hasCompletedOnboarding = true // À remplacer par la vraie logique

    if (!hasCompletedOnboarding && to.path !== '/onboarding') {
      console.log('🚀 Middleware onboarding: Redirection vers onboarding')
      return navigateTo('/onboarding')
    }

    if (hasCompletedOnboarding && to.path === '/onboarding') {
      console.log('✅ Middleware onboarding: Onboarding déjà terminé, redirection')
      return navigateTo('/')
    }

    console.log('✅ Middleware onboarding: Accès autorisé')
  } catch (error) {
    console.error('❌ Middleware onboarding: Erreur:', error)
    return navigateTo('/')
  }
})