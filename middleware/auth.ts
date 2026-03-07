// middleware/auth.ts
// OPTIMIZED: Uses getSession() (local cache) instead of getUser() (network call)
// Caches onboarding check in sessionStorage to avoid redundant API calls

import { useSupabase } from "~~/composables/useSupabase"
import { useAuthStore } from "~~/stores/auth"

const ONBOARDING_CACHE_KEY = 'cs_onboarding_checked'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // NE PAS EXÉCUTER CÔTÉ SERVEUR
  if (process.server) return

  // ROUTES PUBLIQUES - ACCÈS LIBRE
  const publicRoutes = ['/login', '/register', '/auth/', '/reset-password']
  if (publicRoutes.some(route => to.path.startsWith(route))) return

  // ROUTES SEMI-PUBLIQUES
  const isSemiPublicRoute = to.path.startsWith('/onboarding')

  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()

    // ÉTAPE 1 : Vérifier session depuis le cache local Supabase (PAS de requête réseau)
    // getSession() lit depuis le cache mémoire, getUser() fait un appel réseau
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      authStore.clearAuth()
      return navigateTo('/login')
    }

    const user = session.user

    // ÉTAPE 2 : Synchroniser store si nécessaire (non bloquant)
    if (!authStore.isAuthenticated || authStore.user?.id !== user.id) {
      authStore.restoreSession().catch(() => {})
    }

    // Routes semi-publiques : accès autorisé
    if (isSemiPublicRoute) return

    // Vérification email confirmé
    if (!user.email_confirmed_at) {
      return navigateTo('/onboarding')
    }

    // ÉTAPE 3 : Vérification onboarding AVEC CACHE
    // Si déjà vérifié dans cette session, ne pas refaire l'appel réseau
    const onboardingCached = sessionStorage.getItem(ONBOARDING_CACHE_KEY)
    if (onboardingCached === user.id) {
      // Déjà vérifié pour cet utilisateur dans cette session
      return
    }

    // Première vérification de la session → appel API
    const token = session.access_token
    if (!token) {
      return navigateTo('/login')
    }

    try {
      const config = useRuntimeConfig()
      const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

      const response = await fetch(`${apiUrl}/api/v1/shops/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return navigateTo('/onboarding')
      }

      const shopResponse = await response.json()
      const shopData = shopResponse.data || shopResponse

      if (!shopData?.onboarding_completed) {
        return navigateTo('/onboarding')
      }

      // Cache le résultat pour le reste de la session
      sessionStorage.setItem(ONBOARDING_CACHE_KEY, user.id)
    } catch (error) {
      console.warn('⚠️ [AUTH] Erreur vérification onboarding, passage autorisé')
    }

  } catch (error) {
    console.error('❌ [AUTH] Erreur critique middleware:', error)
    return navigateTo('/login')
  }
})