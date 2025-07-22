// middleware/subscription.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Éviter l'exécution côté serveur
  if (process.server) return

  const authStore = useAuthStore()
  
  // Vérifier l'authentification
  if (!authStore.isAuthenticated || !authStore.isSessionValid) {
    await navigateTo('/login')
    return
  }

  // Vérifier le statut de l'abonnement (à implémenter selon votre logique)
  try {
    const { data: subscription } = await $fetch<{
      data: {
        status: 'active' | 'expired' | 'cancelled' | 'trial'
        plan: string
        expiresAt?: string
      }
    }>('/api/subscription/status', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    // Gérer les différents statuts d'abonnement
    switch (subscription.status) {
      case 'expired':
      case 'cancelled':
        console.log('💳 Abonnement expiré/annulé')
        await navigateTo('/billing?expired=true')
        return
        
      case 'trial':
        // Permettre l'accès mais afficher une notification
        console.log('🆓 Période d\'essai active')
        break
        
      case 'active':
        console.log('✅ Abonnement actif')
        break
        
      default:
        console.log('❓ Statut d\'abonnement inconnu')
        await navigateTo('/billing?status=unknown')
        return
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'abonnement:', error)
    // En cas d'erreur, on permet l'accès mais on log l'erreur
    console.warn('⚠️ Impossible de vérifier l\'abonnement, accès autorisé par défaut')
  }
})