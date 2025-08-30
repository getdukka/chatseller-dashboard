// composables/useApi.ts - VERSION CORRIGÉE AVEC GESTION ROBUSTE DES TOKENS

import { useAuthStore } from "~~/stores/auth"
import { useSupabase } from "~~/composables/useSupabase"

export interface ApiResponse<T = any> {
  data?: T
  success: boolean
  error?: string
  message?: string
}

export const useApi = () => {
  const config = useRuntimeConfig()
  
  const getBaseURL = () => {
    if (process.dev || process.env.NODE_ENV === 'development') {
      return 'http://localhost:3001'
    }
    return config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
  }
  
  const baseURL = getBaseURL()

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

  const apiCall = async (
    endpoint: string, 
    options: any = {},
    retryCount: number = 0
  ): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 [API] Appel: ${endpoint} (tentative ${retryCount + 1})`)
      
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
          return apiCall(endpoint, options, retryCount + 1)
        }
      }
      
      let errorMessage = 'Une erreur est survenue'
      
      if (error.data?.error) {
        errorMessage = error.data.error
      } else if (error.data?.message) {
        errorMessage = error.data.message  
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return {
        error: errorMessage,
        success: false
      }
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
  // AUTRES SERVICES (INCHANGÉS)
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
    }
  }

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
    }
  }

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
    }
  }

  const knowledgeBase = {
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/knowledge-base')
    },

    upload: async (file: File): Promise<ApiResponse<any>> => {
      const formData = new FormData()
      formData.append('file', file)

      return apiCall('/api/v1/knowledge-base/upload', {
        method: 'POST',
        body: formData,
        headers: {}
      })
    },

    addManual: async (data: {
      title: string
      content: string
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/knowledge-base', {
        method: 'POST',
        body: data
      })
    },

    delete: async (documentId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/knowledge-base/${documentId}`, {
        method: 'DELETE'
      })
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
    utils
  }
}