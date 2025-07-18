// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPages = ['/login', '/register', '/reset-password']
  
  // Vérifier si la page actuelle est publique
  const isPublicPage = publicPages.some(page => to.path.startsWith(page))

  // Skip middleware on server-side during SSR
  if (process.server) {
    return
  }

  // Get auth state
  const { isLoggedIn, initialized, isLoading } = useAuth()

  // Si l'auth n'est pas encore initialisée, attendre
  if (!initialized.value && isLoading.value) {
    return
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page privée
  if (!isLoggedIn.value && !isPublicPage) {
    return navigateTo('/login')
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'auth
  if (isLoggedIn.value && isPublicPage) {
    return navigateTo('/')
  }
})