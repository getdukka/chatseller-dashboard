// middleware/auth.ts - VERSION CORRIGÉE AVEC MEILLEURE GESTION CALLBACK

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
    '/onboarding' 
  ]
  
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  const isSemiPublicRoute = semiPublicRoutes.some(route => to.path.startsWith(route))
  
  // ✅ SI ROUTE CALLBACK - LAISSER PASSER COMPLÈTEMENT SANS VÉRIFICATION
  if (to.path.startsWith('/auth/callback')) {
    console.log('🔗 [AUTH] Route callback détectée - Passage libre pour traitement confirmation')
    return // ✅ LAISSER PASSER SANS AUCUNE VÉRIFICATION
  }
  
  if (isPublicRoute) {
    console.log('✅ [AUTH] Route publique, accès libre:', to.path)
    
    // ✅ MISE À JOUR LÉGÈRE DU STORE SI NÉCESSAIRE (SUPABASE AUTH SEULEMENT)
    try {
      const authStore = useAuthStore()
      const supabase = useSupabase()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && !authStore.isAuthenticated) {
        console.log('🔄 [AUTH] Synchronisation silencieuse du store (auth seulement)')
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
    
    // ✅ ÉTAPE 1 : VÉRIFIER SESSION SUPABASE - OBLIGATOIRE
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

    // ✅ ÉTAPE 2 : SESSION SUPABASE VALIDE
    console.log('✅ [AUTH] Session Supabase valide pour:', user.email)
    
    // ✅ ÉTAPE 3 : SYNCHRONISER STORE SI NÉCESSAIRE (VIA API)
    if (!authStore.isAuthenticated || authStore.user?.id !== user.id) {
      console.log('🔄 [AUTH] Mise à jour store depuis session Supabase (via API)')
      await authStore.restoreSession()
    }

    // ✅ AMÉLIORATION: GESTION INTELLIGENTE DES RETOURS DE PAIEMENT
    const urlParams = new URLSearchParams(to.fullPath.split('?')[1] || '')
    const isPaymentReturn = urlParams.get('success') === 'true' || urlParams.get('cancelled') === 'true'
    
    if (isPaymentReturn && to.path === '/billing') {
      console.log('💳 [AUTH] Retour de paiement détecté, synchronisation forcée...')
      
      // ✅ FORCER UNE SYNCHRONISATION COMPLÈTE DES DONNÉES
      setTimeout(async () => {
        try {
          await authStore.forceDataSync()
          console.log('✅ [AUTH] Synchronisation forcée après paiement terminée')
        } catch (syncError) {
          console.warn('⚠️ [AUTH] Erreur synchronisation forcée:', syncError)
        }
      }, 1000) // Délai pour laisser le composant se monter
    }

    // ✅ ÉTAPE 4 : POUR LA ROUTE ONBOARDING - PAS DE VÉRIFICATION SUPPLÉMENTAIRE
    if (isSemiPublicRoute) {
      console.log('✅ [AUTH] Route onboarding, accès autorisé (connecté)')
      return
    }

    // 🔍 ÉTAPE 5 : POUR LE DASHBOARD - VÉRIFICATION INTELLIGENTE DE L'ONBOARDING VIA API
    console.log('🔍 [AUTH] Vérification intelligente du statut onboarding via API pour:', to.path)
    
    try {
      // ✅ UTILISER L'API POUR RÉCUPÉRER LES DONNÉES UTILISATEUR
      const api = useApi()
      const shopResponse = await api.shops.get(user.id)
      
      if (!shopResponse.success) {
        console.log('🆕 [AUTH] Shop inexistant, création nécessaire...')
        
        // Si le shop n'existe pas, rediriger vers onboarding
        console.log('🚀 [AUTH] Redirection vers onboarding (shop manquant)')
        return navigateTo('/onboarding')
      }

      const shopData = shopResponse.data
      console.log('📊 [AUTH] Données shop récupérées via API:', {
        id: shopData.id,
        name: shopData.name,
        subscription_plan: shopData.subscription_plan,
        created_at: shopData.created_at
      })

      // 🧠 LOGIQUE INTELLIGENTE DE VÉRIFICATION ONBOARDING
      const hasCompletedOnboarding = shopData.onboarding_completed === true
      const hasShopInfo = !!(shopData.name && shopData.name !== `Shop de ${user.email?.split('@')[0]}`)
      const accountAge = shopData.created_at ? 
        (Date.now() - new Date(shopData.created_at).getTime()) / (1000 * 60 * 60 * 24) : 0 // Age en jours
      
      console.log('🧠 [AUTH] Analyse intelligente onboarding:', {
        completed: hasCompletedOnboarding,
        hasShopInfo: hasShopInfo,
        accountAge: Math.round(accountAge),
        route: to.path,
        shopName: shopData.name
      })

      // ✅ LOGIQUE INTELLIGENTE : Pas de redirection forcée pour les comptes existants
      if (!hasCompletedOnboarding) {
        
        // 🔄 SI L'UTILISATEUR A DES INFOS ET COMPTE > 1 JOUR = AUTO-COMPLETE ONBOARDING
        if (hasShopInfo && accountAge > 1) {
          console.log('🔄 [AUTH] Compte existant avec infos détecté, auto-completion onboarding via API...')
          
          try {
            const updateResponse = await api.shops.update(user.id, {
              onboarding_completed: true,
              onboarding_completed_at: new Date().toISOString()
            })
            
            if (updateResponse.success) {
              console.log('✅ [AUTH] Onboarding auto-complété pour compte existant via API')
              return // ✅ AUTORISER L'ACCÈS
            }
          } catch (error) {
            console.warn('⚠️ [AUTH] Erreur auto-completion onboarding, autorisation quand même')
          }
          
          return // ✅ AUTORISER L'ACCÈS MÊME SI L'UPDATE A ÉCHOUÉ
        }
        
        // 🚨 SEULEMENT REDIRIGER VERS ONBOARDING SI COMPTE RÉCENT SANS INFOS
        if (!hasShopInfo && accountAge <= 1) {
          console.log('🚨 [AUTH] Compte récent sans infos, redirection vers onboarding')
          return navigateTo('/onboarding')
        }
        
        // ✅ POUR TOUS LES AUTRES CAS = ACCÈS AUTORISÉ
        console.log('✅ [AUTH] Autorisation d\'accès malgré onboarding non complété')
      }

      // ✅ ACCÈS AUTORISÉ - ONBOARDING COMPLÉTÉ OU EXCEPTIONS
      console.log('✅ [AUTH] Accès autorisé à:', to.path)

    } catch (apiError) {
      console.warn('⚠️ [AUTH] Erreur API pour récupération données utilisateur:', apiError)
      
      // ✅ EN CAS D'ERREUR API, AUTORISER L'ACCÈS PLUTÔT QUE BLOQUER
      console.log('⚠️ [AUTH] Erreur API, autorisation d\'accès par défaut')
      return // ✅ ACCÈS AUTORISÉ PAR DÉFAUT
    }

  } catch (error) {
    console.error('❌ [AUTH] Erreur critique lors de la vérification:', error)
    
    // 🚨 EN CAS D'ERREUR CRITIQUE, AUTORISER L'ACCÈS PLUTÔT QUE BLOQUER
    console.log('⚠️ [AUTH] Erreur critique, autorisation d\'accès par défaut')
    return // ✅ ACCÈS AUTORISÉ PAR DÉFAUT
  }
})