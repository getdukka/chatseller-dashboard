// plugins/auto-imports.client.ts
export default defineNuxtPlugin(async () => {
  // Attendre que Pinia soit disponible
  await nextTick()
  
  // Auto-importer le store auth au niveau global pour éviter les erreurs
  const { useAuthStore } = await import('~/stores/auth')
  const authStore = useAuthStore()
  
  // Initialiser l'authentification au démarrage
  await authStore.initializeAuth()
  
  return {
    provide: {
      authStore
    }
  }
})