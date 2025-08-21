// composables/useApi.ts - VERSION CORRIGÉE ET SIMPLIFIÉE

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
    if (process.dev || process.env.NODE_ENV === 'development') {
      return 'http://localhost:3001'
    }
    return config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
  }
  
  const baseURL = getBaseURL()
  
  console.log('🔧 API Configuration:', { 
    baseURL, 
    env: process.env.NODE_ENV,
    isDev: process.dev
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
        console.error('❌ API Error:', response.status, response.statusText)
        
        if (response.status === 401) {
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
      
      // ✅ NORMALISER LA RÉPONSE
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
  // ✅ SHOPS (ROUTES PRINCIPALES UTILISÉES PAR LE MIDDLEWARE)
  // =====================================
  
  const shops = {
    // ✅ GET SHOP (ROUTE PRINCIPALE)
    get: async (shopId?: string): Promise<ApiResponse<any>> => {
      const authStore = useAuthStore()
      const targetShopId = shopId || authStore.userShopId || authStore.user?.id
      
      if (!targetShopId) {
        return { success: false, error: 'Shop ID manquant' }
      }
      
      return apiCall(`/api/v1/shops/${targetShopId}`)
    },

    // ✅ CREATE SHOP
    create: async (data: any): Promise<ApiResponse<any>> => {
      return apiCall('/api/v1/shops', {
        method: 'POST',
        body: data
      })
    },

    // ✅ UPDATE SHOP
    update: async (shopId: string, data: any): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/shops/${shopId}`, {
        method: 'PUT',
        body: data
      })
    },

    // ✅ LIST SHOPS
    list: async (): Promise<ApiResponse<any[]>> => {
      return apiCall('/api/v1/shops')
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
    },

    getConfig: async (agentId: string): Promise<ApiResponse<any>> => {
      return apiCall(`/api/v1/agents/${agentId}/config`)
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
        headers: {} // Laisser le navigateur définir le Content-Type pour FormData
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
    shops,
    agents,
    conversations,
    analytics,
    knowledgeBase,
    billing,
    utils
  }
}