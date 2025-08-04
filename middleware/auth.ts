// middleware/auth.ts - VERSION OPTIMISÉE POUR ÉVITER CONFLITS

import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔒 Middleware auth: Vérification pour route:', to.path)
  
  // Ne pas exécuter côté serveur pour éviter les problèmes
  if (process.server) {
    console.log('⏭️ Middleware auth: Côté serveur, passage...')
    return
  }

  // ✅ NOUVEAU: Ignorer les routes publiques et de callback
  const publicRoutes = ['/login', '/register', '/auth/callback', '/reset-password', '/onboarding']
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  
  if (isPublicRoute) {
    console.log('✅ Middleware auth: Route publique, vérification simple...')
    
    // Pour les routes publiques, juste s'assurer que le store est à jour si connecté
    try {
      const authStore = useAuthStore()
      const supabase = useSupabase()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && !authStore.isAuthenticated) {
        console.log('🔄 Middleware auth: Mise à jour silencieuse du store')
        await authStore.restoreSession()
      }
    } catch (error) {
      console.warn('⚠️ Middleware auth: Erreur mise à jour silencieuse:', error)
    }
    
    return // Laisser passer
  }

  // ✅ POUR LES ROUTES PROTÉGÉES UNIQUEMENT
  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()
    
    // Vérifier la session Supabase
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('❌ Middleware auth: Pas de session Supabase valide')
      
      // Nettoyer le store si nécessaire
      if (authStore.isAuthenticated) {
        authStore.clearAuth()
      }
      
      // Sauvegarder la route de destination pour redirection après login
      const redirect = to.path !== '/login' ? to.fullPath : '/'
      
      return navigateTo({
        path: '/login',
        query: { redirect }
      })
    }

    // ✅ SESSION SUPABASE VALIDE
    console.log('✅ Middleware auth: Session Supabase valide pour:', user.email)
    
    // Mettre à jour le store si nécessaire
    if (!authStore.isAuthenticated) {
      console.log('🔄 Middleware auth: Mise à jour du store depuis Supabase')
      await authStore.restoreSession()
    }

    console.log('✅ Middleware auth: Accès autorisé')
  } catch (error) {
    console.error('❌ Middleware auth: Erreur:', error)
    // En cas d'erreur, rediriger vers login pour sécurité
    return navigateTo('/login')
  }
})