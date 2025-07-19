// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Only run on client side to avoid SSR issues
  if (process.server) return

  const { isAuthenticated, initialize, requiresAuth } = useAuth()
  
  // Initialize auth state if not already done
  if (!isAuthenticated.value) {
    await initialize()
  }
  
  // Check if route requires authentication
  const routeRequiresAuth = requiresAuth(to.path)
  
  // Public routes - allow access
  if (!routeRequiresAuth) {
    return
  }
  
  // Protected routes - check authentication
  if (!isAuthenticated.value) {
    // User not authenticated, redirect to login
    return navigateTo('/login')
  }
  
  // User is authenticated, allow access
  return
})