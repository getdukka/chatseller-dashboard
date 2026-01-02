// plugins/auth-init.client.ts - VERSION CORRIGÉE
export default defineNuxtPlugin(async () => {
  console.log('🚀 Plugin auth-init: Initialisation de l\'authentification')

  // Attendre que l'app soit hydratée
  await nextTick()

  // ✅ DÉTECTER SI ON EST SUR UNE PAGE AUTH (callback, login, register, onboarding)
  const currentPath = window.location.pathname
  const isAuthPage = currentPath.startsWith('/auth/') ||
                     currentPath === '/login' ||
                     currentPath === '/register' ||
                     currentPath === '/reset-password' ||
                     currentPath === '/onboarding'

  if (isAuthPage) {
    console.log('⏭️ Plugin auth-init: Page auth détectée, skip restauration:', currentPath)
    return // Ne pas restaurer la session sur les pages auth
  }

  try {
    // Import du store après l'hydratation
    const { useAuthStore } = await import('~/stores/auth')
    const authStore = useAuthStore()

    // Tentative de restauration automatique de la session
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