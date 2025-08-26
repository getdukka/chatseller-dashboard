// composables/useApi.ts 

import { useAuthStore } from "~~/stores/auth"

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

  // ✅ GET SUPABASE TOKEN - ERREUR TYPESCRIPT CORRIGÉE
  const getAuthToken = (): string | null => {
    if (process.client) {
      const authStore = useAuthStore()
      // ✅ CORRECTION : Utiliser uniquement authStore.token (pas de .session)
      return authStore.token || null
    }
    return null
  }

  const createFetchOptions = (options: any = {}): any => {
    const token = getAuthToken()
    
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
          console.warn('🔐 [API] Token expiré ou invalide, redirection login')
          const authStore = useAuthStore()
          authStore.clearAuth()
          if (process.client) {
            navigateTo('/login')
          }
        }
      }
    }
  }

  const apiCall = async (
    endpoint: string, 
    options: any = {}
  ): Promise<ApiResponse<any>> => {
    try {
      console.log(`🔄 [API] Appel: ${endpoint}`)
      
      const fetchOptions = createFetchOptions(options)
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
  // ORDERS - ✅ AJOUT DU SERVICE MANQUANT
  // =====================================
  
  const orders = {
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/orders')
    },

    get: async (orderId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/orders/${orderId}`)
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
      return apiCall(`/api/v1/orders/${orderId}`, {
        method: 'PUT',
        body: data
      })
    },

    delete: async (orderId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/orders/${orderId}`, {
        method: 'DELETE'
      })
    },

    startOrder: async (data: {
      conversationId: string,
      productInfo?: any,
      message?: string
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/orders/start', {
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

    cancel: async (orderId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/orders/${orderId}/cancel`, {
        method: 'PUT'
      })
    },

    stats: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/orders/stats')
    }
  }

  // =====================================
  // PRODUCTS - ✅ AJOUT DU SERVICE MANQUANT
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

    sync: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/products/sync', {
        method: 'POST'
      })
    },

    detectFromUrl: async (url: string): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/products/detect', {
        method: 'POST',
        body: { url }
      })
    }
  }

  // =====================================
  // AGENTS
  // =====================================
  
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
    },

    uploadAvatar: async (file: File): Promise<ApiResponse<any>> => {
      const formData = new FormData()
      formData.append('avatar', file)

      return apiCall('/api/v1/agents/upload-avatar', {
        method: 'POST',
        body: formData,
        headers: {} // Laisser le navigateur définir le Content-Type pour FormData
      })
    }
  }

  // =====================================
  // CONVERSATIONS
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

    // ✅ NOUVELLE MÉTHODE : ÉDITER UN MESSAGE
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