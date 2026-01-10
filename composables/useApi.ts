// composables/useApi.ts 
import { useAuthStore } from "~~/stores/auth"
import { useSupabase } from "~~/composables/useSupabase"

export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  meta?: {
    totalPagesDiscovered?: number
    totalDocumentsCreated?: number
    baseUrl?: string
    indexationType?: string
    processedAt?: string
    [key: string]: any
  }
  message?: string
  error?: never
}

export interface ApiErrorResponse {
  success: false
  error: string
  data?: never
  meta?: never
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

export const useApi = () => {
  const config = useRuntimeConfig()

  // ✅ TOUJOURS utiliser la config runtime (définie dans .env ou Vercel)
  // Ne pas hardcoder localhost - laisser .env.local gérer ça
  const baseURL = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

  // ✅ FONCTION CORRIGÉE : RÉCUPÉRATION TOKEN AVEC FALLBACK SUPABASE
  const getAuthToken = async (): Promise<string | null> => {
    if (!process.client) return null

    try {
      const authStore = useAuthStore()
      
      // ✅ ÉTAPE 1 : ESSAYER LE TOKEN DU STORE
      if (authStore.token && authStore.isAuthenticated) {
        console.log('🎫 [API] Token récupéré depuis store')
        return authStore.token
      }

      // ✅ ÉTAPE 2 : FALLBACK - RÉCUPÉRER DIRECTEMENT DEPUIS SUPABASE
      console.log('🔄 [API] Store vide, récupération token depuis Supabase...')
      const supabase = useSupabase()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session?.access_token) {
        console.warn('❌ [API] Impossible de récupérer le token Supabase')
        return null
      }

      // ✅ SYNCHRONISER LE STORE AVEC LE TOKEN FRAIS
      if (session.access_token !== authStore.token) {
        console.log('🔄 [API] Synchronisation token store avec Supabase')
        authStore.token = session.access_token
      }

      console.log('✅ [API] Token récupéré depuis Supabase et synchronisé')
      return session.access_token

    } catch (error) {
      console.error('❌ [API] Erreur récupération token:', error)
      return null
    }
  }

  const createFetchOptions = async (options: any = {}): Promise<any> => {
    const token = await getAuthToken()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
      console.log('🔑 [API] Token utilisé pour auth:', token.substring(0, 20) + '...')
    } else {
      console.warn('⚠️ [API] Aucun token d\'authentification trouvé')
    }

    return {
      ...options,
      baseURL,
      headers,
      onResponseError({ response }: any) {
        console.error('❌ [API] Erreur réponse:', response.status, response.statusText, response._data)
        
        if (response.status === 401) {
          console.warn('🔐 [API] Token expiré ou invalide')
          handleUnauthorized()
        }
      }
    }
  }

  // ✅ NOUVELLE FONCTION : GESTION CENTRALISÉE DES 401
  const handleUnauthorized = async () => {
    console.log('🔄 [API] Tentative de rafraîchissement du token...')
    
    try {
      const authStore = useAuthStore()
      const supabase = useSupabase()
      
      // Essayer de rafraîchir le token
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error || !data.session) {
        throw new Error('Impossible de rafraîchir le token')
      }
      
      // Mettre à jour le store
      authStore.token = data.session.access_token
      console.log('✅ [API] Token rafraîchi avec succès')
      
      return true
    } catch (error) {
      console.error('❌ [API] Échec rafraîchissement token, déconnexion:', error)
      const authStore = useAuthStore()
      authStore.clearAuth()
      
      if (process.client) {
        navigateTo('/login')
      }
      return false
    }
  }

  // ✅ HELPER: Attendre avec exponential backoff
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const apiCall = async (
    endpoint: string,
    options: any = {},
    retryCount: number = 0,
    maxRetries: number = 3
  ): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 [API] Appel: ${endpoint} (tentative ${retryCount + 1}/${maxRetries + 1})`)

      const fetchOptions = await createFetchOptions(options)
      const response = await $fetch(endpoint, fetchOptions) as any

      console.log(`✅ [API] Réponse ${endpoint}:`, response)

      if (response && typeof response === 'object') {
        if ('success' in response) {
          return response
        }
        if ('data' in response) {
          return {
            success: true,
            data: response.data,
            ...response
          }
        }
      }

      return {
        data: response,
        success: true
      }
    } catch (error: any) {
      console.error(`❌ [API] Échec ${endpoint}:`, error)

      // ✅ RETRY AUTOMATIQUE EN CAS DE 401 (UNE SEULE FOIS)
      if (error.status === 401 && retryCount === 0) {
        console.log('🔄 [API] Erreur 401, tentative de retry après rafraîchissement token')

        const refreshed = await handleUnauthorized()
        if (refreshed) {
          console.log('🔄 [API] Retry de l\'appel après rafraîchissement token')
          return apiCall(endpoint, options, retryCount + 1, maxRetries)
        }
      }

      // ✅ NOUVEAU: RETRY AUTOMATIQUE POUR ERREURS RÉSEAU (avec exponential backoff)
      const isNetworkError = !error.status || error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')
      const shouldRetry = isNetworkError && retryCount < maxRetries

      if (shouldRetry) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Max 10s
        console.warn(`⚠️ [API] Erreur réseau, retry dans ${delay}ms... (tentative ${retryCount + 1}/${maxRetries})`)

        await wait(delay)
        return apiCall(endpoint, options, retryCount + 1, maxRetries)
      }

      let errorMessage = 'Une erreur est survenue'

      if (error.data?.error) {
        errorMessage = error.data.error
      } else if (error.data?.message) {
        errorMessage = error.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      // Message user-friendly si on a épuisé les retries
      if (isNetworkError && retryCount >= maxRetries) {
        errorMessage = 'Impossible de contacter nos serveurs après plusieurs tentatives. Vérifiez votre connexion internet.'
      }

      return {
        error: errorMessage,
        success: false
      }
    }
  }

  // =====================================
  // SHOPS - VERSION CORRIGÉE AVEC getUsage
  // =====================================
  
  const shops = {
    get: async (shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      return apiCall(`/api/v1/shops/${targetShopId}`)
    },

    // ✅ NOUVELLE MÉTHODE : getUsage pour les quotas
    getUsage: async (shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      console.log('📊 [API] Récupération usage quotas pour shop:', targetShopId)
      return apiCall(`/api/v1/shops/${targetShopId}/usage`)
    },

    create: async (data: any): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/shops', {
        method: 'POST',
        body: data
      })
    },

    update: async (shopId: string, data: any): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/shops/${shopId}`, {
        method: 'PUT',
        body: data
      })
    },

    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/shops')
    },

    // ✅ NOUVELLE MÉTHODE : updateUsage pour mettre à jour les quotas
    updateUsage: async (shopId: string, usage: any): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/shops/${shopId}/usage`, {
        method: 'PUT',
        body: usage
      })
    }
  }

  // =====================================
  // CONVERSATIONS - VERSION CORRIGÉE
  // =====================================

  const conversations = {
    list: async (): Promise<ApiResponse<any[]>> => {
      console.log('📋 [API] Récupération liste conversations')
      return apiCall('/api/v1/conversations')
    },

    get: async (conversationId: string): Promise<ApiResponse<any>> => {
      console.log('🔍 [API] Récupération conversation:', conversationId)
      return apiCall(`/api/v1/conversations/${conversationId}`)
    },

    getMessages: async (conversationId: string): Promise<ApiResponse<any[]>> => {
      console.log('📨 [API] Récupération messages pour conversation:', conversationId)
      return apiCall(`/api/v1/conversations/${conversationId}/messages`)
    },

    create: async (data: {
      shopId: string,
      visitorId: string,
      productId?: string,
      productName?: string,
      productPrice?: number,
      productUrl?: string,
      agentId?: string
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/conversations', {
        method: 'POST',
        body: data
      })
    },

    update: async (conversationId: string, data: {
      status?: string,
      last_activity?: string,
      message_count?: number,
      conversion_completed?: boolean
    }): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/conversations/${conversationId}`, {
        method: 'PUT',
        body: data
      })
    },

    delete: async (conversationId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/conversations/${conversationId}`, {
        method: 'DELETE'
      })
    },

    sendMessage: async (conversationId: string, data: {
      content: string,
      sender: 'agent' | 'visitor'
    }): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: data
      })
    },

    updateMessage: async (conversationId: string, messageId: string, data: {
      content: string
    }): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/conversations/${conversationId}/messages/${messageId}`, {
        method: 'PUT',
        body: data
      })
    },

    takeover: async (conversationId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/conversations/${conversationId}/takeover`, {
        method: 'POST'
      })
    },

    stats: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/conversations/stats')
    }
  }

  // =====================================
  // ORDERS - VERSION AMÉLIORÉE
  // =====================================
  
  const orders = {
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/orders/list')
    },

    get: async (orderId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/orders/details/${orderId}`)
    },

    create: async (data: {
      conversationId: string,
      productId?: string,
      productName?: string,
      productPrice?: number,
      quantity?: number,
      customerInfo?: any,
      orderData?: any
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/orders', {
        method: 'POST',
        body: data
      })
    },

    update: async (orderId: string, data: any): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/orders/status/${orderId}`, {
        method: 'PATCH',
        body: data
      })
    },

    delete: async (orderId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/orders/${orderId}`, {
        method: 'DELETE'
      })
    },

    // ✅ NOUVELLES MÉTHODES POUR WORKFLOW COMMANDES
    startOrder: async (data: {
      conversationId: string,
      productInfo?: any,
      message?: string
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/orders/start-order', {
        method: 'POST',
        body: data
      })
    },

    processStep: async (data: {
      conversationId: string,
      step: string,
      data: any
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/orders/process-step', {
        method: 'POST',
        body: data
      })
    },

    complete: async (data: {
      conversationId: string,
      orderData: any
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/orders/complete', {
        method: 'POST',
        body: data
      })
    },

    analyzeIntent: async (data: {
      message: string,
      conversationId: string,
      productInfo?: any
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/orders/analyze-intent', {
        method: 'POST',
        body: data
      })
    },

    getWorkflow: async (conversationId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/orders/workflow/${conversationId}`)
    }
  }

  // =====================================
  // PRODUCTS - VERSION COMPLÈTE BEAUTÉ
  // =====================================
  
  const products = {
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/products')
    },

    get: async (productId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}`)
    },

    create: async (data: {
      name: string,
      description?: string,
      price?: number,
      imageUrl?: string,
      category?: string,
      isActive?: boolean,
      metadata?: any
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/products', {
        method: 'POST',
        body: data
      })
    },

    update: async (productId: string, data: any): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}`, {
        method: 'PUT',
        body: data
      })
    },

    delete: async (productId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}`, {
        method: 'DELETE'
      })
    },

    // ✅ NOUVELLES MÉTHODES BEAUTÉ
    sync: async (platform: string, credentials: any): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/products/sync', {
        method: 'POST',
        body: {
          platform,
          ...credentials // ✅ Spread credentials pour format plat: shop_url, access_token, auto_enrich
        }
      })
    },

    enrich: async (productId: string, beautyData: any): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}/enrich`, {
        method: 'POST',
        body: beautyData
      })
    },

    getBeautyInsights: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/products/beauty-insights')
    },

    aiAnalyze: async (productData: any): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/products/ai-analyze', {
        method: 'POST', 
        body: productData
      })
    },

    getPerformanceMetrics: async (productId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}/metrics`)
    },

    getAIInsights: async (productId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}/ai-insights`)
    },

    toggleRecommendation: async (productId: string, recommend: boolean): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}/ai-recommend`, {
        method: 'PATCH',
        body: { recommend }
      })
    },

    getStats: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/products/stats')
    },

    duplicate: async (productId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}/duplicate`, {
        method: 'POST'
      })
    },

    toggle: async (productId: string, field: 'is_active' | 'is_visible' | 'available_for_sale'): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}/toggle`, {
        method: 'PATCH',
        body: { field }
      })
    }
  }

  const agents = {
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/agents')
    },

    create: async (data: {
      name: string,
      type: string,
      personality: string,
      description?: string,
      welcomeMessage?: string,
      fallbackMessage?: string,
      avatar?: string,
      isActive?: boolean,
      config?: any
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/agents', {
        method: 'POST',
        body: data
      })
    },

    update: async (agentId: string, data: any): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/agents/${agentId}`, {
        method: 'PUT',
        body: data
      })
    },

    delete: async (agentId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/agents/${agentId}`, {
        method: 'DELETE'
      })
    },

    getConfig: async (agentId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/agents/${agentId}/config`)
    }
  }

  // =====================================
  // ANALYTICS - VERSION COMPLÈTE BEAUTÉ
  // =====================================
  
  const analytics = {
    dashboard: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/analytics/dashboard')
    },

    detailed: async (params: {
      period?: string
    } = {}): Promise<ApiResponse<any>> => {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/api/v1/analytics/detailed?${queryString}` : '/api/v1/analytics/detailed'
      return apiCall(endpoint)
    },

    // ✅ NOUVELLES MÉTHODES ANALYTICS BEAUTÉ
    getConversions: async (filters: {
      timeRange?: string,
      attributionMethod?: string
    } = {}): Promise<ApiResponse<any[]>> => {
      const queryString = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryString.append(key, value)
      })
      const endpoint = queryString.toString() 
        ? `/api/v1/analytics/conversions?${queryString.toString()}`
        : '/api/v1/analytics/conversions'
      return apiCall(endpoint)
    },

    getTopProducts: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/analytics/top-products')
    },

    getBeautyInsights: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/analytics/beauty-insights')
    },

    analyzeConversion: async (conversionId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/analytics/conversions/${conversionId}/analyze`)
    },

    getROIData: async (period: string = 'month'): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/analytics/roi?period=${period}`)
    },

    getFunnelData: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/analytics/funnel')
    },

    getROICalculator: async (timeframe: string = 'month'): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/analytics/roi-calculator?timeframe=${timeframe}`)
    },

    getConversionAttribution: async (filters: any = {}): Promise<ApiResponse<any>> => {
      const params = new URLSearchParams(filters).toString()
      return apiCall(`/api/v1/analytics/attribution${params ? '?' + params : ''}`)
    },

    getBeautyTrends: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/analytics/beauty-trends')
    }
  }

  const knowledgeBase = {
  list: async (): Promise<ApiResponse<any[]>> => {
    console.log('📋 [API] Récupération documents base de connaissances beauté')
    return apiCall('/api/v1/knowledge-base')
  },

  get: async (documentId: string): Promise<ApiResponse<any>> => {
    console.log('🔍 [API] Récupération document beauté:', documentId)
    return apiCall(`/api/v1/knowledge-base/${documentId}`)
  },

  create: async (data: {
    title: string
    content: string
    contentType: 'manual' | 'file' | 'url' | 'website'
    sourceFile?: string
    sourceUrl?: string
    tags?: string[]
    isActive?: boolean
    metadata?: any
    beautyCategory?: string
    productType?: string
  }): Promise<ApiResponse<any>> => {
    console.log('🏗️ [API] Création document beauté:', data.title)
    return apiCall('/api/v1/knowledge-base', {
      method: 'POST',
      body: data
    })
  },

  update: async (documentId: string, data: any): Promise<ApiResponse<any>> => {
    console.log('📝 [API] Mise à jour document beauté:', documentId)
    return apiCall(`/api/v1/knowledge-base/${documentId}`, {
      method: 'PUT',
      body: data
    })
  },

  delete: async (documentId: string): Promise<ApiResponse<any>> => {
    console.log('🗑️ [API] Suppression document beauté:', documentId)
    return apiCall(`/api/v1/knowledge-base/${documentId}`, {
      method: 'DELETE'
    })
  },

  toggle: async (documentId: string, isActive: boolean): Promise<ApiResponse<any>> => {
    console.log(`🔄 [API] Toggle document beauté: ${documentId} -> ${isActive}`)
    return apiCall(`/api/v1/knowledge-base/${documentId}/toggle`, {
      method: 'PATCH',
      body: { isActive }
    })
  },

  upload: async (file: File, metadata?: any): Promise<ApiResponse<any>> => {
    console.log('📤 [API] Upload fichier beauté:', file.name)
    
    const formData = new FormData()
    formData.append('file', file)
    
    if (metadata?.title) formData.append('title', metadata.title)
    if (metadata?.beautyCategory) formData.append('beautyCategory', metadata.beautyCategory)
    if (metadata?.tags) formData.append('tags', JSON.stringify(metadata.tags))

    return apiCall('/api/v1/knowledge-base/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Pas de Content-Type pour FormData
    })
  },

  processWebsite: async (data: {
    url: string
    title?: string
    tags?: string[]
    beautyCategory?: string
    maxPages?: number
  }): Promise<ApiResponse<any>> => {
    console.log('🌐 [API] Traitement site beauté:', data.url)
    return apiCall('/api/v1/knowledge-base/website', {
      method: 'POST',
      body: data
    })
  },

  extractUrl: async (data: {
    url: string
    title?: string
    beautyCategory?: string
  }): Promise<ApiResponse<any>> => {
    console.log('🔗 [API] Extraction URL beauté:', data.url)
    return apiCall('/api/v1/knowledge-base/extract-url', {
      method: 'POST',
      body: data
    })
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    console.log('📊 [API] Récupération statistiques base de connaissances beauté')
    return apiCall('/api/v1/knowledge-base/stats')
  },

  checkHealth: async (): Promise<ApiResponse<any>> => {
    console.log('🏥 [API] Vérification santé API base de connaissances')
    return apiCall('/api/v1/knowledge-base/health')
  }
}

  const billing = {
    subscriptionStatus: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/billing/subscription-status')
    },

    plans: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/billing/plans')
    },

    createCheckoutSession: async (data: {
      plan: string
      successUrl: string
      cancelUrl: string
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/billing/create-checkout-session', {
        method: 'POST',
        body: data
      })
    },

    paymentHistory: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/billing/payment-history')
    },

    cancelSubscription: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/billing/cancel-subscription', {
        method: 'POST'
      })
    }
  }

  // =====================================
  // SETTINGS - NOUVEAU SERVICE
  // =====================================
  
  const settings = {
    get: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/settings')
    },

    update: async (data: any): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/settings', {
        method: 'PUT',
        body: data
      })
    },

    updateAttribution: async (config: any): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/settings/attribution', {
        method: 'PUT',
        body: config
      })
    },

    getAttribution: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/settings/attribution')
    },

    updateNotifications: async (config: any): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/settings/notifications', {
        method: 'PUT',
        body: config
      })
    }
  }

  // =====================================
  // FEEDBACK - NOUVEAUX SERVICES
  // =====================================
  
  const feedback = {
    list: async (params: {
      agentId?: string
      feedbackType?: string
      limit?: number
      offset?: number
      startDate?: string
      endDate?: string
      rating?: number
    } = {}): Promise<ApiResponse<any[]>> => {
      const queryString = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryString.append(key, value.toString())
        }
      })
      
      const endpoint = queryString.toString() 
        ? `/api/v1/feedback?${queryString.toString()}`
        : '/api/v1/feedback'
      
      return apiCall(endpoint)
    },

    create: async (data: {
      messageId: string
      agentId: string
      conversationId: string
      originalResponse: string
      correctedResponse?: string
      feedbackType: 'correction' | 'improvement' | 'validation' | 'negative'
      feedbackRating?: number
      feedbackComment?: string
      feedbackTags?: string[]
      userCorrection?: string
      isPublic?: boolean
      beautyCategory?: string
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/feedback', {
        method: 'POST',
        body: data
      })
    },

    getStats: async (params: {
      agentId?: string
      days?: number
    } = {}): Promise<ApiResponse<any>> => {
      const queryString = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryString.append(key, value.toString())
        }
      })
      
      const endpoint = queryString.toString()
        ? `/api/v1/feedback/stats?${queryString.toString()}`
        : '/api/v1/feedback/stats'
      
      return apiCall(endpoint)
    },

    delete: async (feedbackId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/feedback/${feedbackId}`, {
        method: 'DELETE'
      })
    },

    getTags: async (category?: string): Promise<ApiResponse<any[]>> => {
      const endpoint = category 
        ? `/api/v1/feedback/tags?category=${category}`
        : '/api/v1/feedback/tags'
      
      return apiCall(endpoint)
    }
  }

  // ============================
  // QUOTAS - NOUVEAUX SERVICES
  // ============================
  
  const quotas = {
    get: async (shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      return apiCall(`/api/v1/shops/${targetShopId}/quotas`)
    },

    increment: async (quota: 'aiResponses' | 'knowledgeDocuments' | 'indexablePages' | 'agents', amount: number = 1, shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      return apiCall(`/api/v1/shops/${targetShopId}/quotas/increment`, {
        method: 'POST',
        body: { quota, amount }
      })
    },

    reset: async (shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      return apiCall(`/api/v1/shops/${targetShopId}/quotas/reset`, {
        method: 'POST'
      })
    },

    updatePlan: async (newPlan: 'starter' | 'growth' | 'performance', shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      return apiCall(`/api/v1/shops/${targetShopId}/quotas/plan`, {
        method: 'PUT',
        body: { newPlan }
      })
    },

    calculateCosts: async (shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      return apiCall(`/api/v1/shops/${targetShopId}/quotas/costs`)
    }
  }

  const utils = {
    healthCheck: async (): Promise<ApiResponse<any>> => {
      return apiCall('/health')
    },

    info: async (): Promise<ApiResponse<any>> => {
      return apiCall('/')
    }
  }

  return {
    baseURL,
    shops,
    orders, 
    products,
    agents,
    conversations,
    analytics,
    knowledgeBase,
    billing,
    feedback, 
    quotas,
    settings, 
    utils
  }
}