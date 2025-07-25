// middleware/auth.ts - MIDDLEWARE AVEC COMPOSABLE MANUEL

import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔒 Middleware auth: Vérification pour route:', to.path)
  
  // Ne pas exécuter côté serveur pour éviter les problèmes
  if (process.server) {
    console.log('⏭️ Middleware auth: Côté serveur, passage...')
    return
  }

  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()
    
    // ✅ VÉRIFIER LA SESSION SUPABASE DIRECTEMENT
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('❌ Middleware auth: Pas de session Supabase valide')
      
      // Nettoyer le store si nécessaire
      if (authStore.isAuthenticated) {
        authStore.clearAuth()
      }
      
      // Sauvegarder la route de destination pour redirection après login
      const redirect = to.path !== '/login' ? to.fullPath : '/index'
      
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