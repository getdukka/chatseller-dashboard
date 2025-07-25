// middleware/role.ts - AVEC IMPORTS EXPLICITES
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ne pas exécuter côté serveur
  if (process.server) return

  try {
    const authStore = useAuthStore()

    // Vérifier si l'utilisateur est connecté
    if (!authStore.isLoggedIn) {
      return navigateTo('/login')
    }

    const user = authStore.user
    if (!user) {
      return navigateTo('/login')
    }

    // Récupérer les rôles requis depuis les meta de la route
    const requiredRoles = to.meta.requiresRole as string[] | string | undefined

    if (requiredRoles) {
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
      const userRole = user.role || 'user'

      if (!roles.includes(userRole)) {
        console.log(`⛔ Middleware role: Accès refusé - rôle requis: ${roles.join(', ')}, rôle utilisateur: ${userRole}`)
        throw createError({
          statusCode: 403,
          statusMessage: 'Accès refusé - Rôle insuffisant'
        })
      }
    }

    console.log('✅ Middleware role: Accès autorisé')
  } catch (error) {
    console.error('❌ Middleware role: Erreur:', error)
    return navigateTo('/')
  }
})