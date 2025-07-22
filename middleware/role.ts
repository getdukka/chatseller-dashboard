// middleware/role.ts
interface RoleOptions {
  roles: string[]
  redirectTo?: string
  strict?: boolean
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Éviter l'exécution côté serveur
  if (process.server) return

  const authStore = useAuthStore()
  
  // Récupérer les options de rôle depuis les métadonnées de la page
  const roleOptions = to.meta.requiresRole as RoleOptions
  
  if (!roleOptions || !roleOptions.roles?.length) {
    console.warn('⚠️ Middleware role utilisé sans configuration')
    return
  }

  // Vérifier l'authentification
  if (!authStore.isAuthenticated || !authStore.isSessionValid) {
    console.log('🔒 Accès role refusé - Utilisateur non authentifié')
    await navigateTo('/login')
    return
  }

  const userRole = authStore.user?.role
  const hasRequiredRole = roleOptions.roles.includes(userRole || '')

  if (!hasRequiredRole) {
    console.log(`🚫 Accès refusé - Rôle ${userRole} non autorisé. Rôles requis: ${roleOptions.roles.join(', ')}`)
    
    if (roleOptions.redirectTo) {
      await navigateTo(roleOptions.redirectTo)
    } else {
      throw createError({
        statusCode: 403,
        statusMessage: `Accès interdit - Rôle requis: ${roleOptions.roles.join(' ou ')}`
      })
    }
    return
  }

  console.log(`✅ Accès role autorisé - Rôle ${userRole} valide`)
})