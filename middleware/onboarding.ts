// middleware/onboarding.ts - VERSION CORRIGÉE AVEC VRAIE LOGIQUE
import { useAuthStore } from '~/stores/auth'
import { useSupabase } from '~/composables/useSupabase'

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🚀 Middleware onboarding: Vérification pour route:', to.path)
  
  // Ne pas exécuter côté serveur
  if (process.server) {
    console.log('⏭️ Middleware onboarding: Côté serveur, passage...')
    return
  }

  // Ignorer les routes qui ne nécessitent pas de vérification onboarding
  const excludedRoutes = ['/login', '/register', '/auth/callback', '/reset-password']
  if (excludedRoutes.includes(to.path)) {
    console.log('✅ Middleware onboarding: Route exclue, passage...')
    return
  }

  try {
    const authStore = useAuthStore()
    const supabase = useSupabase()

    // Vérifier si l'utilisateur est connecté
    if (!authStore.isLoggedIn) {
      console.log('❌ Middleware onboarding: Utilisateur non connecté')
      return navigateTo('/login')
    }

    const user = authStore.user
    if (!user) {
      console.log('❌ Middleware onboarding: Pas de données utilisateur')
      return navigateTo('/login')
    }

    // ✅ VÉRIFIER RÉELLEMENT SI L'ONBOARDING EST TERMINÉ
    console.log('🔍 Middleware onboarding: Vérification statut onboarding pour user:', user.id)
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('onboarding_completed, company, first_name, last_name')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('❌ Error fetching user data:', error)
      // En cas d'erreur, laisser passer - ne pas bloquer
      return
    }

    // ✅ LOGIQUE CORRIGÉE
    const hasCompletedOnboarding = userData?.onboarding_completed === true
    const hasBasicInfo = userData?.company && (userData?.first_name || userData?.last_name)
    
    console.log('📋 Middleware onboarding: Statut utilisateur:', {
      onboarding_completed: userData?.onboarding_completed,
      has_company: !!userData?.company,
      has_name: !!(userData?.first_name || userData?.last_name),
      hasCompletedOnboarding,
      hasBasicInfo
    })

    // Si onboarding pas terminé ET on n'est pas sur la page onboarding → rediriger vers onboarding
    if (!hasCompletedOnboarding && !hasBasicInfo && to.path !== '/onboarding') {
      console.log('🚀 Middleware onboarding: Redirection vers onboarding')
      return navigateTo('/onboarding')
    }

    // Si onboarding terminé ET on est sur la page onboarding → rediriger vers dashboard
    if (hasCompletedOnboarding && hasBasicInfo && to.path === '/onboarding') {
      console.log('✅ Middleware onboarding: Onboarding déjà terminé, redirection vers dashboard')
      return navigateTo('/')
    }

    console.log('✅ Middleware onboarding: Accès autorisé pour:', to.path)
  } catch (error) {
    console.error('❌ Middleware onboarding: Erreur:', error)
    // En cas d'erreur, ne pas bloquer - laisser passer
    return
  }
})