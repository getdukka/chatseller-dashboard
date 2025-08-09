// middleware/auth.ts - VERSION CORRIGÉE POUR ÉVITER REDIRECTIONS INFINIES

import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔒 [AUTH] Middleware auth: Vérification pour route:', to.path)
  
  // ✅ NE PAS EXÉCUTER CÔTÉ SERVEUR
  if (process.server) {
    return
  }

  // ✅ ROUTES PUBLIQUES - ACCÈS LIBRE TOTAL
  const publicRoutes = [
    '/login', 
    '/register', 
    '/auth/callback', 
    '/reset-password'
  ]
  
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  
  if (isPublicRoute) {
    console.log('✅ [AUTH] Route publique:', to.path)
    return // ✅ ACCÈS LIBRE TOTAL
  }

  // ✅ ROUTES SEMI-PUBLIQUES
  const semiPublicRoutes = ['/onboarding']
  const isSemiPublicRoute = semiPublicRoutes.some(route => to.path.startsWith(route))

  // 🔐 VÉRIFICATION AUTHENTIFICATION POUR ROUTES PROTÉGÉES
  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()
    
    // ✅ VÉRIFIER SESSION SUPABASE
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('❌ [AUTH] Pas de session Supabase valide - redirection login')
      
      // ✅ ÉVITER BOUCLE INFINIE : ne pas rediriger si on vient déjà de register
      if (from?.path === '/register') {
        console.log('⚠️ [AUTH] Vient de register, pas de redirection')
        return
      }
      
      authStore.clearAuth()
      return navigateTo('/login')
    }

    console.log('✅ [AUTH] Session Supabase valide:', user.email)
    
    // ✅ SYNCHRONISER STORE SI NÉCESSAIRE
    if (!authStore.isAuthenticated || authStore.user?.id !== user.id) {
      console.log('🔄 [AUTH] Synchronisation store...')
      try {
        await authStore.restoreSession()
      } catch (syncError) {
        console.warn('⚠️ [AUTH] Erreur sync non bloquante:', syncError)
      }
    }

    // ✅ POUR ONBOARDING - ACCÈS LIBRE SI CONNECTÉ
    if (isSemiPublicRoute) {
      console.log('✅ [AUTH] Accès onboarding autorisé')
      return
    }

    // ✅ POUR AUTRES ROUTES PROTÉGÉES - ACCÈS AUTORISÉ
    console.log('✅ [AUTH] Accès autorisé à:', to.path)

  } catch (error) {
    console.error('❌ [AUTH] Erreur middleware:', error)
    // ✅ EN CAS D'ERREUR - AUTORISER L'ACCÈS PAR DÉFAUT
    return
  }
})