// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  // Initialiser l'authentification au démarrage de l'application
  try {
    await authStore.initializeAuth()
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'authentification:', error)
  }

  // Intercepter les erreurs 401 globalement
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.statusCode === 401) {
        authStore.logout()
      }
    })
  }
})