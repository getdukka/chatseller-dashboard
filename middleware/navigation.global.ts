// middleware/navigation.global.ts - MIDDLEWARE NAVIGATION OPTIMISÉ
export default defineNuxtRouteMiddleware((to, from) => {
  // ✅ ÉVITER LE MIDDLEWARE SUR LE SERVEUR POUR RÉDUIRE LES CONFLITS
  if (process.server) return
  
  console.log('🛣️ Navigation middleware:', {
    from: from?.path,
    to: to.path,
    timestamp: new Date().toISOString()
  })
  
  // ✅ GÉRER LES REDIRECTIONS PROPRES
  try {
    // Éviter les redirections en boucle
    if (from?.path === to.path) {
      console.log('⚠️ Évitement de redirection en boucle')
      return
    }
    
    // ✅ NETTOYAGE DES PATHS AVEC PARAMÈTRES
    const cleanPath = to.path.split('?')[0]
    
    // ✅ NAVIGATION IMMÉDIATE POUR LES ROUTES STATIQUES
    const staticRoutes = [
      '/',
      '/login', 
      '/register', 
      '/dashboard',
      '/conversations',
      '/orders',
      '/products',
      '/analytics',
      '/knowledge-base',
      '/billing',
      '/settings'
    ]
    
    if (staticRoutes.includes(cleanPath)) {
      console.log('✅ Route statique autorisée:', cleanPath)
      return
    }
    
    // ✅ VALIDATION DES ROUTES DYNAMIQUES
    if (cleanPath.startsWith('/vendeurs-ia/')) {
      console.log('✅ Route vendeur IA autorisée:', cleanPath)
      return
    }
    
    // ✅ GESTION DES ROUTES INCONNUES
    if (!staticRoutes.includes(cleanPath) && !cleanPath.startsWith('/vendeurs-ia/')) {
      console.warn('⚠️ Route inconnue, redirection vers dashboard:', cleanPath)
      return navigateTo('/')
    }
    
  } catch (error) {
    console.error('❌ Erreur navigation middleware:', error)
    // En cas d'erreur, laisser passer la navigation
    return
  }
})