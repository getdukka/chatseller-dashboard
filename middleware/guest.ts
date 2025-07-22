// middleware/guest.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Éviter l'exécution côté serveur
  if (process.server) return

  const authStore = useAuthStore()
  
  // Initialiser l'authentification si pas encore fait
  if (!authStore.user && !authStore.token) {
    await authStore.initializeAuth()
  }

  // Si l'utilisateur est authentifié, rediriger vers le dashboard
  if (authStore.isAuthenticated && authStore.isSessionValid) {
    console.log('👤 Utilisateur déjà connecté, redirection vers dashboard')
    
    // Vérifier s'il y a une URL de redirection dans les paramètres
    const redirectUrl = to.query.redirect as string
    if (redirectUrl && redirectUrl.startsWith('/') && redirectUrl !== '/login') {
      await navigateTo(redirectUrl)
    } else {
      await navigateTo('/')
    }
    return
  }

  console.log('👤 Accès guest autorisé')
})