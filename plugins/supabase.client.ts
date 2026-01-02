// plugins/supabase.client.ts
import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

// plugins/supabase.client.ts - PLUGIN AVEC COMPOSABLE MANUEL
export default defineNuxtPlugin(async () => {
  console.log('🔌 Plugin Supabase: Initialisation...')

  // ✅ DÉTECTER SI ON EST SUR UNE PAGE AUTH
  const currentPath = window.location.pathname
  const isAuthPage = currentPath.startsWith('/auth/') ||
                     currentPath === '/login' ||
                     currentPath === '/register' ||
                     currentPath === '/reset-password' ||
                     currentPath === '/onboarding'

  const authStore = useAuthStore()
  const supabase = useSupabase()

  // ✅ NE PAS configurer de listener sur les pages auth
  // Le plugin auth.client.ts gère déjà les événements auth
  // et les pages auth (callback, onboarding) gèrent leur propre flow
  if (!isAuthPage) {
    // ✅ ÉCOUTER LES CHANGEMENTS D'AUTHENTIFICATION SUPABASE - SEULEMENT SUR PAGES NON-AUTH
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase Auth State Change:', event, session?.user?.email)

      // Vérifier à nouveau le path (peut changer après navigation)
      const pathNow = window.location.pathname
      const isAuthPageNow = pathNow.startsWith('/auth/') ||
                            pathNow === '/login' ||
                            pathNow === '/register' ||
                            pathNow === '/reset-password' ||
                            pathNow === '/onboarding'

      if (isAuthPageNow) {
        console.log('⏭️ [Supabase Plugin] Page auth, skip traitement événement')
        return
      }

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log('✅ Utilisateur connecté via Supabase:', session.user.email)

            // Récupérer les données du shop
            const { data: shopData, error: shopError } = await supabase
              .from('shops')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (shopError && shopError.code !== 'PGRST116') {
              console.warn('⚠️ Shop fetch error:', shopError)
            }

            // Mettre à jour le store
            const user = {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.name || session.user.email,
              shopId: session.user.id,
              shop_id: session.user.id,
              avatar: session.user.user_metadata?.avatar_url,
              role: 'user' as const,
              createdAt: session.user.created_at,
              shop: shopData
            }

            authStore.setUser(user, session.access_token)
          }
          break

        case 'SIGNED_OUT':
          console.log('🚪 Utilisateur déconnecté via Supabase')
          authStore.clearAuth()
          break

        case 'TOKEN_REFRESHED':
          console.log('🔄 Token Supabase rafraîchi')
          if (session?.access_token) {
            authStore.token = session.access_token
          }
          break
      }
    })

    // ✅ RESTAURER LA SESSION AU CHARGEMENT - SEULEMENT SUR PAGES NON-AUTH
    try {
      await authStore.restoreSession()
    } catch (error) {
      console.warn('⚠️ Erreur lors de la restauration de session:', error)
    }
  } else {
    console.log('⏭️ [Supabase Plugin] Page auth détectée, skip initialisation:', currentPath)
  }

  console.log('✅ Plugin Supabase: Initialisé avec succès')
})