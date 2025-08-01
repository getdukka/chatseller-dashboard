import { useDebug } from "~~/composables/useDebug"

// plugins/debug.client.ts - PLUGIN DE DEBUG POUR DIAGNOSTIC NAVIGATION
export default defineNuxtPlugin((nuxtApp) => {
  const { logInfo, logWarn, logError, debugNavigation, debugRoute, checkSystem } = useDebug()

  // ✅ LOG D'INITIALISATION
  logInfo('Plugin', 'Debug plugin initialisé')
  
  // ✅ CHECK SYSTÈME INITIAL
  if (process.env.NODE_ENV === 'development') {
    checkSystem()
  }

  // ✅ WATCHER GLOBAL POUR TOUTES LES NAVIGATIONS
  nuxtApp.hook('app:mounted', () => {
    logInfo('Plugin', 'Application montée')
    
    const router = useRouter()
    const route = useRoute()

    // ✅ LOG DE LA ROUTE INITIALE
    debugRoute(route.name as string || 'unknown', route.params, route.query)

    // ✅ WATCHER POUR TOUTES LES NAVIGATIONS
    router.beforeEach((to, from, next) => {
      debugNavigation(
        from?.path || 'initial',
        to.path,
        to.params.id as string,
        {
          toName: to.name,
          fromName: from?.name,
          toParams: to.params,
          toQuery: to.query
        }
      )
      next()
    })

    // ✅ WATCHER POUR LES ERREURS DE NAVIGATION
    router.onError((error) => {
      logError('Router', 'Erreur de navigation', {
        error: error.message,
        stack: error.stack,
        route: router.currentRoute.value.path
      })
    })

    // ✅ AJOUT D'UN HANDLER GLOBAL POUR LES ERREURS NON CAPTURÉES
    window.addEventListener('error', (event) => {
      logError('Window', 'Erreur JavaScript non capturée', {
        message: event.error?.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })

    // ✅ HANDLER POUR LES PROMESSES REJETÉES
    window.addEventListener('unhandledrejection', (event) => {
      logError('Window', 'Promesse rejetée non gérée', {
        reason: event.reason,
        promise: event.promise
      })
    })

    // ✅ DEBUG CONSOLE POUR ACCÈS FACILE EN DEV
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      window.chatsellerDebug = {
        logs: useDebug().debugLogs,
        checkSystem: useDebug().checkSystem,
        checkVendeurIA: useDebug().checkVendeurIA,
        exportLogs: useDebug().exportLogs,
        clearLogs: useDebug().clearLogs
      }
      
      console.log('🔧 Debug ChatSeller disponible via window.chatsellerDebug')
      console.log('🔧 Utilisez window.chatsellerDebug.checkSystem() pour diagnostiquer')
    }
  })

  // ✅ HANDLER POUR LES ERREURS NUXT
  nuxtApp.hook('app:error', (error) => {
    logError('Nuxt', 'Erreur application Nuxt', {
      message: error.message,
      stack: error.stack,
      statusCode: (error as any).statusCode,
      statusMessage: (error as any).statusMessage
    })
  })

  // ✅ HANDLER POUR LE CHANGEMENT DE PAGE
  nuxtApp.hook('page:start', () => {
    logInfo('Plugin', 'Début changement de page')
  })

  nuxtApp.hook('page:finish', () => {
    logInfo('Plugin', 'Fin changement de page')
  })

  // ✅ DIAGNOSTIC SPÉCIAL POUR LES ROUTES VENDEURS-IA
  nuxtApp.hook('app:beforeMount', () => {
    const route = useRoute()
    
    if (route.path.startsWith('/vendeurs-ia/')) {
      const agentId = route.params.id as string
      const { checkVendeurIA } = useDebug()
      
      logInfo('Plugin', 'Route Vendeur IA détectée, diagnostic...')
      checkVendeurIA(agentId)
      
      // ✅ VÉRIFICATIONS SUPPLÉMENTAIRES POUR VENDEUR-IA
      if (!agentId || agentId === 'undefined' || agentId === 'null') {
        logError('Plugin', 'Agent ID invalide détecté', {
          agentId,
          params: route.params,
          query: route.query,
          fullPath: route.fullPath
        })
      }
    }
  })
})