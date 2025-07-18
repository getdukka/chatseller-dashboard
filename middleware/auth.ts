// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // Vérifier si on est côté client
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user_data')
    
    // Si pas de token ou user, rediriger vers login
    if (!token || !user) {
      // Éviter la redirection infinie
      if (to.path !== '/login' && to.path !== '/register') {
        return navigateTo('/login')
      }
    }
    
    // Si connecté et qu'on va sur login/register, rediriger vers dashboard
    if ((to.path === '/login' || to.path === '/register') && token && user) {
      return navigateTo('/')
    }
  }
})