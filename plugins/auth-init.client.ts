// plugins/auth-init.client.ts

export default defineNuxtPlugin(() => {
  const authStore = useAuth()
  
  // Initialiser une seule fois au chargement de l'app
  authStore.initializeFromStorage()
  
  console.log('🔧 Plugin: Store auth initialisé')
})