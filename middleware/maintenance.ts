// middleware/maintenance.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  
  // Vérifier si le mode maintenance est activé
  const maintenanceMode = config.public.maintenanceMode === 'true'
  
  if (maintenanceMode) {
    // Pages autorisées pendant la maintenance
    const allowedPaths = ['/maintenance', '/admin', '/health']
    const isAllowedPath = allowedPaths.some(path => to.path.startsWith(path))
    
    if (!isAllowedPath) {
      console.log('🔧 Mode maintenance activé')
      throw createError({
        statusCode: 503,
        statusMessage: 'Service temporairement indisponible - Maintenance en cours'
      })
    }
  }
})

// Types pour TypeScript
declare module '#app' {
  interface PageMeta {
    requiresRole?: {
      roles: string[]
      redirectTo?: string
      strict?: boolean
    }
  }
}