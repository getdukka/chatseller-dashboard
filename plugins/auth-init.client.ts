// plugins/auth-init.client.ts - INITIALISATION AUTHENTIFICATION

export default defineNuxtPlugin(async () => {
  console.log('🚀 Plugin auth-init: Initialisation de l\'authentification')
  
  const authStore = useAuthStore()
  
  // Tentative de restauration automatique de la session
  try {
    if (!authStore.isAuthenticated) {
      console.log('🔄 Plugin auth-init: Restauration de session...')
      await authStore.restoreSession()
      
      if (authStore.isAuthenticated) {
        console.log('✅ Plugin auth-init: Session restaurée avec succès')
      } else {
        console.log('ℹ️ Plugin auth-init: Aucune session à restaurer')
      }
    }
  } catch (error) {
    console.error('❌ Plugin auth-init: Erreur lors de la restauration:', error)
  }
})