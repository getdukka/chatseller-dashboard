// plugins/global-composables.client.ts 

export default defineNuxtPlugin(() => {
  // Force l'enregistrement global des composables
  if (process.client) {
    try {
      // Importer et rendre disponibles les composables
      const { useAuth } = useAuth()
      const { useApi } = useApi()
      
      // Les attacher à window pour debugging et accès global
      ;(window as any).useAuth = useAuth
      ;(window as any).useApi = useApi
      
      console.log('✅ Global composables plugin: useAuth et useApi sont disponibles')
    } catch (error) {
      console.error('❌ Global composables plugin: Erreur lors de l\'import des composables:', error)
    }
  }
})