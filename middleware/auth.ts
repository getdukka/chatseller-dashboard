
// middleware/auth.ts - AVEC IMPORTS EXPLICITES CORRIGÉS

import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔒 Middleware auth: Vérification pour route:', to.path)
  
  // Ne pas exécuter côté serveur pour éviter les problèmes avec localStorage
  if (process.server) {
    console.log('⏭️ Middleware auth: Côté serveur, passage...')
    return
  }

  try {
    const authStore = useAuthStore()
    
    // Tentative de restauration de session si pas encore fait
    if (!authStore.isAuthenticated && !authStore.loading) {
      console.log('🔄 Middleware auth: Tentative de restauration de session')
      await authStore.restoreSession()
    }

    // Si toujours pas authentifié après restauration
    if (!authStore.isLoggedIn) {
      console.log('❌ Middleware auth: Non authentifié, redirection vers /login')
      
      // Sauvegarder la route de destination pour redirection après login
      const redirect = to.path !== '/login' ? to.fullPath : '/dashboard'
      
      return navigateTo({
        path: '/login',
        query: { redirect }
      })
    }

    console.log('✅ Middleware auth: Authentifié, accès autorisé')
  } catch (error) {
    console.error('❌ Middleware auth: Erreur:', error)
    // En cas d'erreur, rediriger vers login pour sécurité
    return navigateTo('/login')
  }
})