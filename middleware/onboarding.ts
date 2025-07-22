// middleware/onboarding.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Éviter l'exécution côté serveur
  if (process.server) return

  const authStore = useAuthStore()
  
  // Vérifier l'authentification
  if (!authStore.isAuthenticated || !authStore.isSessionValid) {
    await navigateTo('/login')
    return
  }

  // Vérifier si l'utilisateur a terminé l'onboarding
  const user = authStore.user
  if (!user) return

  // Logique de vérification de l'onboarding (à adapter selon vos besoins)
  const onboardingComplete = user.emailVerified && 
                           user.company && 
                           user.firstName && 
                           user.lastName

  // Pages autorisées pendant l'onboarding
  const onboardingPaths = ['/onboarding', '/verify-email', '/profile/setup']
  const isOnboardingPath = onboardingPaths.some(path => to.path.startsWith(path))

  if (!onboardingComplete && !isOnboardingPath) {
    console.log('📝 Onboarding incomplet, redirection')
    
    if (!user.emailVerified) {
      await navigateTo('/verify-email')
    } else {
      await navigateTo('/onboarding')
    }
    return
  }

  if (onboardingComplete && isOnboardingPath) {
    console.log('✅ Onboarding déjà terminé, redirection vers dashboard')
    await navigateTo('/')
    return
  }

  console.log('📝 Statut onboarding vérifié')
})