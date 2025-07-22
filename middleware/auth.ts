// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Pages publiques qui n'ont pas besoin d'authentification
  const publicPages = ['/login', '/register', '/reset-password', '/']
  
  // Si on est sur une page publique, laisser passer
  if (publicPages.includes(to.path)) {
    return
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Vérifier si le token est encore valide (optionnel)
  // On pourrait ajouter une vérification de validité du token ici
})

// middleware/guest.ts - Pour les pages accessibles uniquement aux non-connectés
export const guestMiddleware = defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})

// middleware/admin.ts - Pour les pages admin uniquement
export const adminMiddleware = defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  // Vérifier l'authentification d'abord
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Vérifier le rôle admin
  if (!authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès refusé - Droits administrateur requis'
    })
  }
})