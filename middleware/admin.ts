// middleware/admin.ts - AVEC IMPORTS EXPLICITES
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

    // Vérifier les permissions admin
    const user = authStore.user
    if (!user || user.role !== 'admin') {
      console.log('⛔ Middleware admin: Accès refusé - role insuffisant')
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès refusé - Permissions insuffisantes'
      })
    }

    console.log('✅ Middleware admin: Accès autorisé')
  } catch (error) {
    console.error('❌ Middleware admin: Erreur:', error)
    return navigateTo('/')
  }
})