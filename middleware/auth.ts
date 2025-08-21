// middleware/auth.ts - VERSION SIMPLIFIÉE ET ROBUSTE

import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔒 [AUTH] Middleware auth: Vérification pour route:', to.path)
  
  // ✅ NE PAS EXÉCUTER CÔTÉ SERVEUR
  if (process.server) {
    console.log('⏭️ [AUTH] Côté serveur, passage...')
    return
  }

  // ✅ ROUTES PUBLIQUES - ACCÈS LIBRE SANS AUTHENTIFICATION
  const publicRoutes = [
    '/login', 
    '/register', 
    '/auth/callback',
    '/auth/reset-password',
    '/reset-password'
  ]
  
  // ✅ ROUTES SEMI-PUBLIQUES - AVEC AUTHENTIFICATION
  const semiPublicRoutes = [
    '/onboarding' 
  ]
  
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  const isSemiPublicRoute = semiPublicRoutes.some(route => to.path.startsWith(route))
  
  // ✅ LAISSER PASSER LES ROUTES CALLBACK COMPLÈTEMENT
  if (to.path.startsWith('/auth/callback')) {
    console.log('🔗 [AUTH] Route callback - Passage libre total')
    return
  }
  
  // ✅ LAISSER PASSER LES ROUTES PUBLIQUES
  if (isPublicRoute) {
    console.log('✅ [AUTH] Route publique, accès libre:', to.path)
    return
  }

  // 🔐 POUR TOUTES LES AUTRES ROUTES - VÉRIFICATION AUTHENTIFICATION
  console.log('🔐 [AUTH] Route protégée détectée:', to.path)
  
  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()
    
    // ✅ ÉTAPE 1 : VÉRIFIER SESSION SUPABASE
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('❌ [AUTH] Pas de session Supabase valide')
      authStore.clearAuth()
      return navigateTo('/login')
    }

    console.log('✅ [AUTH] Session Supabase valide pour:', user.email)
    
    // ✅ ÉTAPE 2 : SYNCHRONISER STORE SI NÉCESSAIRE
    if (!authStore.isAuthenticated || authStore.user?.id !== user.id) {
      console.log('🔄 [AUTH] Synchronisation store depuis session Supabase')
      try {
        await authStore.restoreSession()
        console.log('✅ [AUTH] Store synchronisé')
      } catch (storeError) {
        console.warn('⚠️ [AUTH] Erreur synchronisation store (non bloquante):', storeError)
        // Continue même si le store a des problèmes
      }
    }

    // ✅ ÉTAPE 3 : GESTION INTELLIGENTE ONBOARDING (SIMPLIFIÉE)
    if (isSemiPublicRoute) {
      console.log('✅ [AUTH] Route onboarding, accès autorisé')
      return
    }

    // ✅ LOGIQUE ONBOARDING SIMPLIFIÉE ET PERMISSIVE
    const needsOnboarding = checkIfNeedsOnboarding(user, authStore.user)
    
    if (needsOnboarding) {
      console.log('🚨 [AUTH] Redirection vers onboarding nécessaire')
      return navigateTo('/onboarding')
    }

    console.log('✅ [AUTH] Accès autorisé à:', to.path)

  } catch (error) {
    console.error('❌ [AUTH] Erreur critique:', error)
    
    // ✅ EN CAS D'ERREUR, AUTORISER L'ACCÈS (PRINCIPE DE RÉSILIENCE)
    console.log('⚠️ [AUTH] Erreur critique, autorisation d\'accès par défaut')
    return
  }
})

// ✅ FONCTION SIMPLIFIÉE POUR VÉRIFIER LE BESOIN D'ONBOARDING
function checkIfNeedsOnboarding(supabaseUser: any, storeUser: any): boolean {
  // Si pas de confirmation email, onboarding requis
  if (!supabaseUser.email_confirmed_at) {
    console.log('🚨 [AUTH] Email non confirmé')
    return true
  }
  
  // Si le compte est très récent (moins de 5 minutes) et pas de données, onboarding requis
  const accountAge = Date.now() - new Date(supabaseUser.created_at).getTime()
  const isVeryNew = accountAge < 5 * 60 * 1000 // 5 minutes
  
  if (isVeryNew && !storeUser?.shop?.name) {
    console.log('🚨 [AUTH] Compte très récent sans données')
    return true
  }
  
  // ✅ DANS TOUS LES AUTRES CAS, PAS D'ONBOARDING REQUIS
  console.log('✅ [AUTH] Onboarding non requis - Accès autorisé')
  return false
}