// middleware/maintenance.ts - AVEC IMPORTS CORRECTS
export default defineNuxtRouteMiddleware((to, from) => {
  // Configuration de maintenance
  const config = useRuntimeConfig()
  const isMaintenanceMode = config.public.environment === 'maintenance'
  
  // Pages autorisées pendant la maintenance
  const allowedPaths = ['/maintenance', '/health', '/api']
  
  // Vérifier si la route actuelle est autorisée
  const isAllowedPath = allowedPaths.some(path => 
    to.path.startsWith(path)
  )
  
  // Si en mode maintenance et la route n'est pas autorisée
  if (isMaintenanceMode && !isAllowedPath) {
    console.log('🚧 Middleware maintenance: Mode maintenance activé')
    
    // Rediriger vers la page de maintenance
    return navigateTo('/maintenance')
  }
  
  // Si on essaie d'accéder à /maintenance mais que le mode n'est pas activé
  if (!isMaintenanceMode && to.path === '/maintenance') {
    console.log('✅ Middleware maintenance: Mode maintenance désactivé, redirection')
    return navigateTo('/index')
  }
  
  console.log('✅ Middleware maintenance: Accès autorisé')
})
