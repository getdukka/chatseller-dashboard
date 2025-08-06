// middleware/auth.ts - VERSION CORRIGÉE SANS REDIRECTION FORCÉE ONBOARDING

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

    // 🔍 POUR LE DASHBOARD ET PAGES PROTÉGÉES - VÉRIFICATION INTELLIGENTE DE L'ONBOARDING
    console.log('🔍 [AUTH] Vérification intelligente du statut onboarding pour:', to.path)
    
    const { data: userData, error: onboardingError } = await supabase
      .from('users')
      .select('onboarding_completed, company, first_name, last_name, email, created_at')
      .eq('id', user.id)
      .single()

    console.log('📊 [AUTH] Données utilisateur:', userData)

    // 🛑 GESTION DES ERREURS DB
    if (onboardingError) {
      console.error('❌ [AUTH] Erreur DB onboarding:', onboardingError.code, onboardingError.message)
      
      if (onboardingError.code === 'PGRST116') {
        console.log('🆕 [AUTH] Utilisateur inexistant en DB, création et redirection vers onboarding...')
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            onboarding_completed: false,
            created_at: new Date().toISOString()
          })
        
        if (!insertError) {
          console.log('✅ [AUTH] Utilisateur créé en DB')
        }
        
        console.log('🚀 [AUTH] Redirection vers onboarding (utilisateur créé)')
        return navigateTo('/onboarding')
      } else {
        console.warn('⚠️ [AUTH] Erreur DB non critique, autorisation d\'accès')
        return // ✅ AUTORISER L'ACCÈS EN CAS D'ERREUR DB
      }
    }

    // 🧠 LOGIQUE INTELLIGENTE DE VÉRIFICATION ONBOARDING
    const hasCompletedOnboarding = userData?.onboarding_completed === true
    const hasMinimalInfo = !!(userData?.company || userData?.first_name || userData?.last_name)
    const accountAge = userData?.created_at ? 
      (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24) : 0 // Age en jours
    
    console.log('🧠 [AUTH] Analyse intelligente onboarding:', {
      completed: hasCompletedOnboarding,
      hasInfo: hasMinimalInfo,
      accountAge: Math.round(accountAge),
      route: to.path,
      company: userData?.company,
      firstName: userData?.first_name,
      lastName: userData?.last_name
    })

    // ✅ LOGIQUE INTELLIGENTE : Pas de redirection forcée pour les comptes existants
    if (!hasCompletedOnboarding) {
      
      // 🔄 SI L'UTILISATEUR A DES INFOS ET COMPTE > 1 JOUR = AUTO-COMPLETE ONBOARDING
      if (hasMinimalInfo && accountAge > 1) {
        console.log('🔄 [AUTH] Compte existant avec infos détecté, auto-completion onboarding...')
        
        try {
          const { error: updateError } = await supabase
            .from('users')
            .update({
              onboarding_completed: true,
              onboarding_completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
          
          if (!updateError) {
            console.log('✅ [AUTH] Onboarding auto-complété pour compte existant')
            return // ✅ AUTORISER L'ACCÈS
          }
        } catch (error) {
          console.warn('⚠️ [AUTH] Erreur auto-completion onboarding, autorisation quand même')
        }
        
        return // ✅ AUTORISER L'ACCÈS MÊME SI L'UPDATE A ÉCHOUÉ
      }
      
      // 🚨 SEULEMENT REDIRIGER VERS ONBOARDING SI COMPTE RÉCENT SANS INFOS
      if (!hasMinimalInfo && accountAge <= 1) {
        console.log('🚨 [AUTH] Compte récent sans infos, redirection vers onboarding')
        return navigateTo('/onboarding')
      }
      
      // ✅ POUR TOUS LES AUTRES CAS = ACCÈS AUTORISÉ
      console.log('✅ [AUTH] Autorisation d\'accès malgré onboarding non complété')
    }

    // ✅ ACCÈS AUTORISÉ - ONBOARDING COMPLÉTÉ OU EXCEPTIONS
    console.log('✅ [AUTH] Accès autorisé à:', to.path)

  } catch (error) {
    console.error('❌ [AUTH] Erreur critique lors de la vérification:', error)
    
    // 🚨 EN CAS D'ERREUR CRITIQUE, AUTORISER L'ACCÈS PLUTÔT QUE BLOQUER
    console.log('⚠️ [AUTH] Erreur critique, autorisation d\'accès par défaut')
    return // ✅ ACCÈS AUTORISÉ PAR DÉFAUT
  }
})