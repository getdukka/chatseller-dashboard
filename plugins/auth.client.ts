// plugins/auth.client.ts

import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

export default defineNuxtPlugin(async () => {
  console.log('🚀 [Plugin Auth] Initialisation authentification côté client...')

  try {
    const authStore = useAuthStore()

    // ✅ DÉTECTER SI ON EST SUR UNE PAGE AUTH (callback, login, register, onboarding)
    const currentPath = window.location.pathname
    const isAuthPage = currentPath.startsWith('/auth/') ||
                       currentPath === '/login' ||
                       currentPath === '/register' ||
                       currentPath === '/reset-password' ||
                       currentPath === '/onboarding'

    if (isAuthPage) {
      console.log('⏭️ [Plugin Auth] Page auth détectée, skip initialisation complète:', currentPath)
      // Sur les pages auth, on ne fait que configurer l'écoute des événements
      // La restauration de session sera gérée par la page elle-même
    } else {
      // ✅ VÉRIFICATION SANTÉ API (NON BLOQUANTE) - Seulement sur pages non-auth
      console.log('🏥 [Plugin Auth] Vérification santé API...')
      try {
        const api = useApi()
        const healthResponse = await api.utils.healthCheck()

        if (healthResponse.success) {
          console.log('✅ [Plugin Auth] API opérationnelle')
        } else {
          console.warn('⚠️ [Plugin Auth] API non disponible:', healthResponse.error)
        }
      } catch (apiError) {
        console.warn('⚠️ [Plugin Auth] Erreur vérification API (non bloquante):', apiError)
      }

      // ✅ RESTAURATION SESSION (NON BLOQUANTE) - Seulement sur pages non-auth
      console.log('🔄 [Plugin Auth] Tentative de restauration de session...')
      try {
        const sessionResult = await authStore.restoreSession()

        if (sessionResult.success) {
          console.log('✅ [Plugin Auth] Session restaurée avec succès')
          console.log('👤 [Plugin Auth] Utilisateur connecté:', authStore.userEmail)
          console.log('📋 [Plugin Auth] Plan actuel:', authStore.currentPlan)
        } else {
          console.log('ℹ️ [Plugin Auth] Aucune session active à restaurer')
        }
      } catch (sessionError) {
        console.warn('⚠️ [Plugin Auth] Erreur restauration session (non bloquante):', sessionError)
      }
    }
    
    // ✅ ÉCOUTER LES CHANGEMENTS D'AUTHENTIFICATION SUPABASE
    const supabase = useSupabase()

    supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log('🔄 [Plugin Auth] Changement état auth Supabase:', event)

      // ✅ VÉRIFIER SI ON EST SUR UNE PAGE AUTH AVANT DE FAIRE restoreSession
      const currentPathNow = window.location.pathname
      const isAuthPageNow = currentPathNow.startsWith('/auth/') ||
                            currentPathNow === '/login' ||
                            currentPathNow === '/register' ||
                            currentPathNow === '/reset-password' ||
                            currentPathNow === '/onboarding'

      try {
        switch (event) {
          case 'SIGNED_IN':
            console.log('✅ [Plugin Auth] Utilisateur connecté via Supabase')
            // ✅ NE PAS faire restoreSession sur les pages auth - elles gèrent leur propre flow
            if (isAuthPageNow) {
              console.log('⏭️ [Plugin Auth] Page auth, skip restoreSession automatique')
            } else if (!authStore.isAuthenticated && session?.user) {
              console.log('🔄 [Plugin Auth] Synchronisation store après connexion')
              await authStore.restoreSession()
            }
            break

          case 'SIGNED_OUT':
            console.log('🚪 [Plugin Auth] Utilisateur déconnecté via Supabase')
            if (authStore.isAuthenticated) {
              console.log('🧹 [Plugin Auth] Nettoyage store après déconnexion')
              authStore.clearAuth()
            }
            break

          case 'TOKEN_REFRESHED':
            console.log('🔄 [Plugin Auth] Token rafraîchi')
            if (session?.access_token && authStore.isAuthenticated) {
              authStore.token = session.access_token
            }
            break

          default:
            console.log('ℹ️ [Plugin Auth] Événement auth:', event)
        }
      } catch (eventError) {
        console.warn('⚠️ [Plugin Auth] Erreur traitement événement auth:', eventError)
      }
    })
    
    console.log('✅ [Plugin Auth] Initialisation authentification terminée')
    
  } catch (error) {
    console.error('❌ [Plugin Auth] Erreur critique lors de l\'initialisation:', error)
    
    // ✅ NE PAS BLOQUER L'APPLICATION EN CAS D'ERREUR
    console.log('⚠️ [Plugin Auth] Application continuera malgré l\'erreur d\'initialisation')
  }
})