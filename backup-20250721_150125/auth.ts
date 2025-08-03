// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip sur le serveur
  if (process.server) return

  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  if (isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})