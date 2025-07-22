// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Éviter l'exécution côté serveur pour le moment
  if (process.server) return

  const authStore = useAuthStore()
  
  // Initialiser l'authentification si pas encore fait
  if (!authStore.user && !authStore.token) {
    await authStore.initializeAuth()
  }

  // Vérifier l'authentification
  if (!authStore.isAuthenticated) {
    console.log('🔒 Accès refusé - Utilisateur non authentifié')
    
    // Sauvegarder l'URL de destination pour redirection après login
    const targetPath = to.fullPath
    if (targetPath && targetPath !== '/login') {
      await navigateTo(`/login?redirect=${encodeURIComponent(targetPath)}`)
    } else {
      await navigateTo('/login')
    }
    return
  }

  // Vérifier la validité de la session
  if (!authStore.isSessionValid) {
    console.log('⏰ Session expirée')
    await authStore.logout(false)
    await navigateTo('/login?expired=true')
    return
  }

  // Essayer de renouveler le token si nécessaire
  try {
    const tokenValid = await authStore.ensureValidToken()
    if (!tokenValid) {
      console.log('🔑 Token invalide')
      await navigateTo('/login?invalid=true')
      return
    }
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    await authStore.logout(false)
    await navigateTo('/login?error=true')
    return
  }

  // Mettre à jour l'activité utilisateur
  authStore.updateActivity()

  console.log('✅ Accès autorisé pour:', authStore.userFullName)
})











