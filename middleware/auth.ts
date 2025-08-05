// middleware/auth.ts - VERSION AVEC PROTECTION DASHBOARD CORRIGÉE

import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔒 [AUTH] Middleware auth: Vérification pour route:', to.path, 'depuis:', from?.path)
  
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
    '/reset-password'
  ]
  
  // ✅ ROUTES SEMI-PUBLIQUES - ACCÈS LIBRE MAIS AVEC AUTHENTIFICATION REQUISE
  const semiPublicRoutes = [
    '/onboarding' // ✅ Accessible SEULEMENT si connecté
  ]
  
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  const isSemiPublicRoute = semiPublicRoutes.some(route => to.path.startsWith(route))
  
  if (isPublicRoute) {
    console.log('✅ [AUTH] Route publique, accès libre:', to.path)
    
    // ✅ MISE À JOUR LÉGÈRE DU STORE SI NÉCESSAIRE
    try {
      const authStore = useAuthStore()
      const supabase = useSupabase()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && !authStore.isAuthenticated) {
        console.log('🔄 [AUTH] Synchronisation silencieuse du store')
        await authStore.restoreSession()
      }
    } catch (error) {
      console.warn('⚠️ [AUTH] Erreur synchronisation (non bloquante):', error)
    }
    
    return // ✅ LAISSER PASSER LIBREMENT
  }

  // 🔐 POUR TOUTES LES AUTRES ROUTES - VÉRIFICATION AUTHENTIFICATION OBLIGATOIRE
  console.log('🔐 [AUTH] Route protégée détectée:', to.path, '- Vérification authentification...')
  
  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()
    
    // ✅ VÉRIFIER SESSION SUPABASE - OBLIGATOIRE
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('❌ [AUTH] Pas de session Supabase valide pour route protégée:', to.path)
      console.log('❌ [AUTH] Redirection vers /login')
      
      // ✅ NETTOYER LE STORE
      if (authStore.isAuthenticated) {
        console.log('🧹 [AUTH] Nettoyage du store')
        authStore.clearAuth()
      }
      
      return navigateTo('/login')
    }

    // ✅ SESSION VALIDE
    console.log('✅ [AUTH] Session Supabase valide pour:', user.email)
    
    // ✅ SYNCHRONISER STORE SI NÉCESSAIRE
    if (!authStore.isAuthenticated || authStore.user?.id !== user.id) {
      console.log('🔄 [AUTH] Mise à jour store depuis session Supabase')
      await authStore.restoreSession()
    }

    // ✅ POUR LA ROUTE ONBOARDING - PAS DE VÉRIFICATION SUPPLÉMENTAIRE
    if (isSemiPublicRoute) {
      console.log('✅ [AUTH] Route onboarding, accès autorisé (connecté)')
      return
    }

    // 🔍 POUR LE DASHBOARD ET PAGES PROTÉGÉES - VÉRIFIER ONBOARDING
    console.log('🔍 [AUTH] Vérification statut onboarding pour route protégée:', to.path)
    
    const { data: userData, error: onboardingError } = await supabase
      .from('users')
      .select('onboarding_completed, company, first_name, last_name')
      .eq('id', user.id)
      .single()

    console.log('📊 [AUTH] Données utilisateur:', userData)

    // 🛑 GESTION DES ERREURS DB
    if (onboardingError) {
      console.error('❌ [AUTH] Erreur DB onboarding:', onboardingError.code, onboardingError.message)
      
      if (onboardingError.code === 'PGRST116') {
        console.log('🆕 [AUTH] Utilisateur inexistant en DB, création...')
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            first_name: authStore.user?.firstName || '',
            last_name: authStore.user?.lastName || '',
            onboarding_completed: false,
            created_at: new Date().toISOString()
          })
        
        if (!insertError) {
          console.log('✅ [AUTH] Utilisateur créé en DB')
        }
        
        console.log('🚀 [AUTH] Redirection vers onboarding (utilisateur créé)')
        return navigateTo('/onboarding')
      } else {
        console.warn('⚠️ [AUTH] Erreur DB non critique, redirection vers onboarding')
        return navigateTo('/onboarding')
      }
    }

    // ✅ VÉRIFICATION STATUT ONBOARDING
    const hasCompletedOnboarding = userData?.onboarding_completed === true
    const hasMinimalInfo = !!(userData?.company && (userData?.first_name || userData?.last_name))
    
    console.log('📋 [AUTH] État onboarding:', {
      completed: hasCompletedOnboarding,
      hasInfo: hasMinimalInfo,
      route: to.path,
      company: userData?.company,
      firstName: userData?.first_name,
      lastName: userData?.last_name
    })

    // 🚀 REDIRECTION ONBOARDING SI NÉCESSAIRE
    if (!hasCompletedOnboarding || !hasMinimalInfo) {
      console.log('🚨 [AUTH] Onboarding requis pour accéder à:', to.path)
      console.log('🚀 [AUTH] Redirection vers /onboarding')
      return navigateTo('/onboarding')
    }

    // ✅ TOUT OK - ACCÈS AUTORISÉ
    console.log('✅ [AUTH] Onboarding terminé - Accès autorisé à:', to.path)

  } catch (error) {
    console.error('❌ [AUTH] Erreur critique lors de la vérification:', error)
    console.log('🚀 [AUTH] Redirection d\'urgence vers /login')
    return navigateTo('/login')
  }
})