// middleware/guest.ts

export default defineNuxtRouteMiddleware((to, from) => {
  console.log('👤 Middleware guest: Vérification...')
  
  if (process.client) {
    const authStore = useAuth()
    
    // S'assurer que le store est initialisé
    if (!authStore.initialized) {
      authStore.initializeFromStorage()
    }
    
    // Double vérification : store ET localStorage
    const hasStoredSession = authStore.hasValidSession()
    const isStoreAuthenticated = authStore.isAuthenticated
    
    if (hasStoredSession && isStoreAuthenticated) {
      console.log('🔄 Middleware guest: Session active, redirection dashboard')
      return navigateTo('/')
    }
    
    console.log('✅ Middleware guest: Pas de session, accès page guest autorisé')
  }
})