// composables/useDebug.ts - COMPOSABLE DE DEBUG POUR NAVIGATION
import { ref, computed } from 'vue'

interface DebugInfo {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  component: string
  message: string
  data?: any
}

const debugLogs = ref<DebugInfo[]>([])
const isDebugEnabled = ref(false)

export const useDebug = () => {
  
  // ✅ ACTIVER/DÉSACTIVER LE DEBUG
  const enableDebug = () => {
    isDebugEnabled.value = true
    console.log('🔧 Debug mode activé')
  }

  const disableDebug = () => {
    isDebugEnabled.value = false
    console.log('🔧 Debug mode désactivé')
  }

  const toggleDebug = () => {
    isDebugEnabled.value = !isDebugEnabled.value
    console.log(`🔧 Debug mode ${isDebugEnabled.value ? 'activé' : 'désactivé'}`)
  }

  // ✅ LOGGER AVEC NIVEAUX
  const log = (level: 'info' | 'warn' | 'error', component: string, message: string, data?: any) => {
    if (!isDebugEnabled.value) return

    const debugInfo: DebugInfo = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data
    }

    debugLogs.value.unshift(debugInfo)

    // Limiter à 100 logs pour éviter les fuites mémoire
    if (debugLogs.value.length > 100) {
      debugLogs.value = debugLogs.value.slice(0, 100)
    }

    // Logger aussi dans la console avec couleurs
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : '🔍'
    const style = level === 'error' ? 'color: red' : level === 'warn' ? 'color: orange' : 'color: blue'
    
    console.log(`%c${emoji} [${component}] ${message}`, style, data || '')
  }

  // ✅ HELPERS SPÉCIALISÉS
  const logInfo = (component: string, message: string, data?: any) => {
    log('info', component, message, data)
  }

  const logWarn = (component: string, message: string, data?: any) => {
    log('warn', component, message, data)
  }

  const logError = (component: string, message: string, data?: any) => {
    log('error', component, message, data)
  }

  // ✅ DEBUG NAVIGATION SPÉCIALISÉ
  const debugNavigation = (from: string, to: string, agentId?: string, extra?: any) => {
    logInfo('Navigation', `${from} → ${to}`, {
      agentId,
      timestamp: Date.now(),
      ...extra
    })
  }

  const debugRoute = (routeName: string, params: any, query: any) => {
    logInfo('Route', `Route active: ${routeName}`, {
      params,
      query,
      fullPath: `${routeName}?${new URLSearchParams(query).toString()}`
    })
  }

  const debugAgent = (action: string, agentId: string, data?: any) => {
    logInfo('Agent', `${action} - ID: ${agentId}`, data)
  }

  const debugAPI = (endpoint: string, method: string, status: 'start' | 'success' | 'error', data?: any) => {
    const level = status === 'error' ? 'error' : status === 'success' ? 'info' : 'info'
    log(level, 'API', `${method} ${endpoint} - ${status}`, data)
  }

  // ✅ VÉRIFICATIONS SYSTÈME
  const checkSystem = () => {
    const router = useRouter()
    const route = useRoute()
    const config = useRuntimeConfig()

    const systemInfo = {
      route: {
        path: route.path,
        fullPath: route.fullPath,
        params: route.params,
        query: route.query,
        name: route.name
      },
      config: {
        apiBaseUrl: config.public.apiBaseUrl,
        supabaseUrl: config.public.supabaseUrl?.substring(0, 30) + '...',
        appUrl: config.public.appUrl
      },
      browser: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      },
      performance: {
        navigationStart: performance.timing.navigationStart,
        loadEventEnd: performance.timing.loadEventEnd,
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
      }
    }

    logInfo('System', 'Check système complet', systemInfo)
    return systemInfo
  }

  // ✅ VÉRIFICATIONS SPÉCIFIQUES VENDEUR-IA
  const checkVendeurIA = (agentId: string | null) => {
    const route = useRoute()
    
    const vendeurIAInfo = {
      agentId,
      isValidAgentId: agentId && agentId !== 'undefined' && agentId !== 'null' && agentId.length > 10,
      routePath: route.path,
      routeParams: route.params,
      routeQuery: route.query,
      expectedPattern: '/agent-ia/[id]',
      matchesPattern: route.path.startsWith('/agent-ia/') && route.path.split('/').length === 3
    }

    logInfo('VendeurIA', 'Check spécifique Vendeur IA', vendeurIAInfo)
    return vendeurIAInfo
  }

  // ✅ CLEAR LOGS
  const clearLogs = () => {
    debugLogs.value = []
    logInfo('Debug', 'Logs effacés')
  }

  // ✅ EXPORT LOGS
  const exportLogs = () => {
    const logsData = {
      timestamp: new Date().toISOString(),
      logs: debugLogs.value,
      system: checkSystem()
    }

    const blob = new Blob([JSON.stringify(logsData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatseller-debug-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    logInfo('Debug', 'Logs exportés')
  }

  // ✅ COMPUTED
  const errorLogs = computed(() => debugLogs.value.filter(log => log.level === 'error'))
  const warnLogs = computed(() => debugLogs.value.filter(log => log.level === 'warn'))
  const recentLogs = computed(() => debugLogs.value.slice(0, 10))

  // ✅ AUTO-ACTIVER EN MODE DÉVELOPPEMENT
  if (process.env.NODE_ENV === 'development') {
    enableDebug()
  }

  return {
    // State
    isDebugEnabled: readonly(isDebugEnabled),
    debugLogs: readonly(debugLogs),
    errorLogs,
    warnLogs,
    recentLogs,

    // Actions
    enableDebug,
    disableDebug,
    toggleDebug,

    // Loggers
    log,
    logInfo,
    logWarn,
    logError,

    // Spécialisés
    debugNavigation,
    debugRoute,
    debugAgent,
    debugAPI,

    // Vérifications
    checkSystem,
    checkVendeurIA,

    // Utilitaires
    clearLogs,
    exportLogs
  }
}