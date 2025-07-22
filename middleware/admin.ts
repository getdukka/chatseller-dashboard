// middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Éviter l'exécution côté serveur
  if (process.server) return

  const authStore = useAuthStore()
  
  // Vérifier d'abord l'authentification
  if (!authStore.isAuthenticated || !authStore.isSessionValid) {
    console.log('🔒 Accès admin refusé - Utilisateur non authentifié')
    await navigateTo('/login')
    return
  }

  // Vérifier les permissions admin
  if (!authStore.isAdmin) {
    console.log('🚫 Accès admin refusé - Permissions insuffisantes')
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit - Permissions administrateur requises'
    })
  }

  console.log('👑 Accès admin autorisé pour:', authStore.userFullName)
})