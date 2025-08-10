// composables/useApi.ts - VERSION CORRIGÉE DEV/PROD

import { useAuthStore } from "~~/stores/auth"

export interface ApiResponse<T = any> {
  data?: T
  success: boolean
  error?: string
  message?: string
}

export const useApi = () => {
  const config = useRuntimeConfig()
  
  // ✅ CONFIGURATION DYNAMIQUE DEV/PROD
  const getBaseURL = () => {
    // En développement
    if (process.dev || process.env.NODE_ENV === 'development') {
      return 'http://localhost:3001' // ✅ CORRIGÉ : Port 3001 comme dans ton serveur
    }
    
    // En production
    return config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
  }
  
  const baseURL = getBaseURL()
  
  console.log('🔧 API Configuration:', { 
    baseURL, 
    env: process.env.NODE_ENV,
    isDev: process.dev,
    configApiUrl: config.public.apiBaseUrl 
  })

  // ✅ GET SUPABASE TOKEN FROM AUTH STORE
  const getAuthToken = (): string | null => {
    if (process.client) {
      const authStore = useAuthStore()
      return authStore.token
    }
    return null
  }

  // ✅ CREATE AUTHENTICATED FETCH OPTIONS
  const createFetchOptions = (options: any = {}): any => {
    const token = getAuthToken()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return {
      ...options,
      baseURL,
      headers,
      onResponseError({ response }: any) {
        console.error('❌ API Error:', response.status, response.statusText, response._data)
        
        if (response.status === 401) {
          console.error('🚨 Token invalide, redirection vers login')
          const authStore = useAuthStore()
          authStore.clearAuth()
          navigateTo('/login')
        }
      }
    }
  }

  // ✅ GENERIC API CALL WITH PROPER ERROR HANDLING
  const apiCall = async (
    endpoint: string, 
    options: any = {}
  ): Promise<ApiResponse<any>> => {
    try {
      console.log(`📡 API Call: ${options.method || 'GET'} ${baseURL}${endpoint}`)
      
      const fetchOptions = createFetchOptions(options)
      const response = await $fetch(endpoint, fetchOptions) as any
      
      console.log('✅ API Response:', response)
      
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
      console.error('❌ API call failed for', endpoint, ':', error)
      
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
  // ✅ CONVERSATIONS
  // =====================================
  
  const conversations = {
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/conversations')
    },

    get: async (conversationId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/conversations/${conversationId}`)
    },

    create: async (data: { 
      shopId: string, 
      visitorId: string, 
      productId?: string,
      productName?: string,
      productPrice?: number,
      productUrl?: string 
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/conversations', {
        method: 'POST',
        body: data
      })
    }
  }

  // =====================================
  // ✅ ORDERS  
  // =====================================
  
  const orders = {
    list: async (): Promise<ApiResponse<any[]>> => {
      return { success: true, data: [] }
    },

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
    }
  }

  // =====================================
  // ✅ AGENTS
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
    }
  }

  // =====================================
  // ✅ PRODUCTS
  // =====================================
  
  const products = {
    list: async (params: {
      search?: string,
      category?: string,
      source?: string,
      isActive?: string,
      page?: string,
      limit?: string
    } = {}): Promise<ApiResponse<any[]>> => {
      const queryString = new URLSearchParams(params).toString()
      const endpoint = queryString ? `/api/v1/products?${queryString}` : '/api/v1/products'
      return apiCall(endpoint)
    },

    get: async (productId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/products/${productId}`)
    },

    create: async (data: any): Promise<ApiResponse<any>> => {
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

  // =====================================
  // ✅ ANALYTICS
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

    usageStats: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/analytics/usage-stats')
    },

    billing: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/analytics/billing')
    }
  }

  // =====================================
  // ✅ KNOWLEDGE BASE
  // =====================================
  
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

  // =====================================
  // ✅ BILLING
  // =====================================

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
  // ✅ SHOPS
  // =====================================
  
  const shops = {
    get: async (shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId
      
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
    }
  }

  // =====================================
  // ✅ CHAT
  // =====================================
  
  const chat = {
    test: async (data: {
      message: string,
      agentId: string,
      shopId: string,
      testMode?: boolean
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/chat/test', {
        method: 'POST',
        body: data
      })
    },

    message: async (data: {
      message: string,
      conversationId?: string,
      shopId: string,
      agentId?: string,
      productContext?: any
    }): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/chat/message', {
        method: 'POST',
        body: data
      })
    }
  }

  // =====================================
  // ✅ UTILS
  // =====================================
  
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
    conversations,
    orders,
    agents,
    products,
    analytics,
    knowledgeBase,
    shops,
    chat,
    billing,
    utils
  }
}