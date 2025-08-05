// utils/debug.ts - UTILITAIRE POUR DÉBOGUER LE FLUX D'ONBOARDING

export const debugOnboarding = {
  
  // ✅ LOGGER COLORÉ POUR ONBOARDING
  log: (stage: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString()
    console.log(`🔍 [${timestamp}] ONBOARDING ${stage}:`, data || '')
  },

  // ✅ VÉRIFIER L'ÉTAT COMPLET D'UN UTILISATEUR
  async checkUserState(userId: string, supabase: any): Promise<{
    needsOnboarding: boolean
    userData?: any
    shopData?: any
    authUser?: any
    error?: any
  }> {
    debugOnboarding.log('USER_STATE_CHECK', `Vérification pour userId: ${userId}`)
    
    try {
      // 1. Vérifier dans auth.users (métadonnées Supabase)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      debugOnboarding.log('AUTH_USER', {
        exists: !!user,
        email: user?.email || 'Email non disponible',
        confirmed: !!user?.email_confirmed_at,
        metadata: user?.user_metadata || {},
        error: authError?.message || 'Aucune erreur'
      })

      // 2. Vérifier dans table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      debugOnboarding.log('DB_USER', {
        exists: !!userData,
        onboarding_completed: userData?.onboarding_completed || false,
        company: userData?.company || 'Non renseigné',
        first_name: userData?.first_name || 'Non renseigné',
        last_name: userData?.last_name || 'Non renseigné',
        error: userError ? `${userError.code}: ${userError.message}` : 'Aucune erreur'
      })

      // 3. Vérifier dans table shops
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('id', userId)
        .single()

      debugOnboarding.log('DB_SHOP', {
        exists: !!shopData,
        name: shopData?.name || 'Non renseigné',
        is_active: shopData?.is_active || false,
        subscription_plan: shopData?.subscription_plan || 'Non défini',
        error: shopError ? `${shopError.code}: ${shopError.message}` : 'Aucune erreur'
      })

      // 4. Résumé de l'état
      const needsOnboarding = !userData?.onboarding_completed || 
                             !userData?.company || 
                             (!userData?.first_name && !userData?.last_name)

      debugOnboarding.log('FINAL_STATE', {
        needsOnboarding,
        canAccessDashboard: !needsOnboarding,
        reasons: {
          no_onboarding_flag: !userData?.onboarding_completed,
          no_company: !userData?.company,
          no_name: !userData?.first_name && !userData?.last_name
        }
      })

      return {
        needsOnboarding,
        userData,
        shopData,
        authUser: user
      }

    } catch (error: any) {
      debugOnboarding.log('CHECK_ERROR', error?.message || 'Erreur inconnue')
      return { needsOnboarding: true, error }
    }
  },

  // ✅ TRACER LES REDIRECTIONS
  traceRedirect: (from: string, to: string, reason: string) => {
    console.log(`🚀 REDIRECT: ${from} → ${to} (${reason})`)
  },

  // ✅ VÉRIFIER LES ERREURS SUPABASE COURANTES
  analyzeSupabaseError: (error: any) => {
    const commonErrors: Record<string, string> = {
      'PGRST116': 'Record non trouvé (utilisateur inexistant en DB)',
      '401': 'Non autorisé (token invalide ou expiré)',
      '406': 'Not Acceptable (problème de headers ou RLS)',
      '409': 'Conflit (enregistrement dupliqué)',
      '429': 'Trop de requêtes (rate limiting)'
    }

    const errorCode = error?.code || error?.status || 'UNKNOWN'
    const description = commonErrors[errorCode] || 'Erreur inconnue'

    debugOnboarding.log('SUPABASE_ERROR', {
      code: errorCode,
      message: error?.message ?? 'Message non disponible',
      description,
      hint: error?.hint ?? 'Aucun conseil disponible',
      details: error?.details ?? 'Détails non disponibles'
    })

    // ✅ SUGGESTIONS DE CORRECTION
    if (errorCode === 'PGRST116') {
      console.log('💡 SUGGESTION: Créer l\'utilisateur en base ou vérifier les RLS policies')
    } else if (errorCode === '406') {
      console.log('💡 SUGGESTION: Vérifier les headers Content-Type et Accept')
    } else if (errorCode === '401') {
      console.log('💡 SUGGESTION: Rafraîchir le token ou redemander connexion')
    }

    return { errorCode, description }
  },

  // ✅ NETTOYER LES LOGS EN PRODUCTION
  cleanup: () => {
    if (process.env.NODE_ENV === 'production') {
      // En production, remplacer les fonctions par des versions vides qui respectent les types
      debugOnboarding.log = () => {}
      debugOnboarding.checkUserState = async () => ({ needsOnboarding: true, error: null })
      debugOnboarding.traceRedirect = () => {}
      debugOnboarding.analyzeSupabaseError = () => ({ errorCode: 'UNKNOWN', description: 'Debug désactivé en production' })
    }
  }
}

// ✅ AUTO-CLEANUP EN PRODUCTION
if (typeof window !== 'undefined') {
  debugOnboarding.cleanup()
}