// middleware/auth.ts 

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
    '/reset-password',
    '/auth/confirm'
  ]
  
  // ✅ ROUTES SEMI-PUBLIQUES - AVEC AUTHENTIFICATION MAIS ACCÈS SPÉCIAL
  const semiPublicRoutes = [
    '/onboarding' 
  ]
  
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  const isSemiPublicRoute = semiPublicRoutes.some(route => to.path.startsWith(route))
  
  // ✅ LAISSER PASSER LES ROUTES CALLBACK COMPLÈTEMENT
  if (to.path.startsWith('/auth/')) {
    console.log('🔗 [AUTH] Route auth - Passage libre total')
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
    
    // ✅ ÉTAPE 1 : VÉRIFICATION SESSION SUPABASE AVEC RETRY
    let user = null
    let sessionError = null
    
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      user = currentUser
      sessionError = error
    } catch (supabaseError) {
      console.warn('⚠️ [AUTH] Erreur première tentative Supabase, retry...')
      
      // Retry une seule fois
      try {
        await new Promise(resolve => setTimeout(resolve, 500)) // Attendre 500ms
        const { data: { user: retryUser }, error: retryError } = await supabase.auth.getUser()
        user = retryUser
        sessionError = retryError
      } catch (retryError) {
        console.error('❌ [AUTH] Échec après retry Supabase:', retryError)
        sessionError = retryError
      }
    }
    
    if (sessionError || !user) {
      console.log('❌ [AUTH] Pas de session Supabase valide')
      authStore.clearAuth()
      return navigateTo('/login')
    }

    console.log('✅ [AUTH] Session Supabase valide pour:', user.email)
    
    // ✅ ÉTAPE 2 : SYNCHRONISER STORE SI NÉCESSAIRE (SANS BLOQUER)
    if (!authStore.isAuthenticated || authStore.user?.id !== user.id) {
      console.log('🔄 [AUTH] Synchronisation store depuis session Supabase (non bloquante)')
      
      // ✅ SYNCHRONISATION NON BLOQUANTE
      authStore.restoreSession().catch(storeError => {
        console.warn('⚠️ [AUTH] Erreur synchronisation store (ignorée):', storeError)
        // Continuer même si le store a des problèmes
      })
    }

    // ✅ ÉTAPE 3 : GESTION ONBOARDING POUR LES ROUTES SEMI-PUBLIQUES
    if (isSemiPublicRoute) {
      console.log('✅ [AUTH] Route onboarding, accès autorisé')
      return
    }

    // ✅ VÉRIFICATION EMAIL CONFIRMÉ (SIMPLE)
    if (!user.email_confirmed_at) {
      console.log('📧 [AUTH] Email non confirmé, redirection onboarding')
      return navigateTo('/onboarding')
    }

    // ✅ VÉRIFICATION ONBOARDING COMPLÉTÉ
    // Si l'utilisateur n'a pas complété l'onboarding, le rediriger
    try {
      const { data: shopData } = await supabase
        .from('shops')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (shopData && !shopData.onboarding_completed) {
        console.log('📋 [AUTH] Onboarding non complété, redirection...')
        return navigateTo('/onboarding')
      }
    } catch (shopError) {
      console.warn('⚠️ [AUTH] Impossible de vérifier onboarding (continuer):', shopError)
      // Continuer même si la vérification échoue pour ne pas bloquer l'utilisateur
    }

    console.log('✅ [AUTH] Accès autorisé à:', to.path)

  } catch (error) {
    console.error('❌ [AUTH] Erreur critique middleware:', error)
    
    // ✅ EN CAS D'ERREUR CRITIQUE, REDIRIGER VERS LOGIN PAR SÉCURITÉ
    console.log('🚨 [AUTH] Erreur critique, redirection login par sécurité')
    return navigateTo('/login')
  }
})