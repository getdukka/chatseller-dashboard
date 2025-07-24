// composables/useApi.ts - VERSION COMPATIBLE CORRIGÉE

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string
  lastName: string
  company: string
  platform?: string
  newsletter?: boolean
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name?: string
    shopId?: string
  }
}

export interface Shop {
  id: string
  name: string
  domain?: string
  settings: {
    agentName?: string
    agentAvatar?: string
    primaryColor?: string
    welcomeMessage?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  shopId: string
  visitorId: string
  status: 'active' | 'completed' | 'abandoned'
  messages: Message[]
  metadata?: {
    visitorInfo?: any
    product?: any
  }
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  content: string
  type: 'visitor' | 'agent' | 'system'
  timestamp: string
}

export interface Order {
  id: string
  conversationId: string
  shopId: string
  customerInfo: {
    name: string
    email?: string
    phone?: string
    address?: string
  }
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface OrderItem {
  productId?: string
  productName: string
  quantity: number
  price: number
}

export interface KnowledgeBaseDocument {
  id: string
  shopId: string
  title: string
  content: string
  type: 'pdf' | 'word' | 'csv' | 'manual'
  fileName?: string
  uploadedAt: string
}

export interface AnalyticsData {
  totalConversations: number
  activeConversations: number
  completedOrders: number
  conversionRate: number
  totalRevenue: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
  }>
  conversationsByDay: Array<{
    date: string
    count: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
  }>
}

export const useApi = () => {
  const config = useRuntimeConfig()
  
  // ✅ CONFIGURATION CORRIGÉE - URL API EXTERNE
  const baseURL = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
  
  console.log('🔧 API Configuration:', { baseURL })

  // Get auth token from localStorage
  const getAuthToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('chatseller_token')
    }
    return null
  }

  // Set auth token
  const setAuthToken = (token: string) => {
    if (process.client) {
      localStorage.setItem('chatseller_token', token)
    }
  }

  // Remove auth token
  const removeAuthToken = () => {
    if (process.client) {
      localStorage.removeItem('chatseller_token')
    }
  }

  // Create authenticated fetch options
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
      // Handle errors globally
      onResponseError({ response }: any) {
        console.error('❌ API Error:', response.status, response.statusText)
        
        // Handle unauthorized
        if (response.status === 401) {
          removeAuthToken()
          navigateTo('/login')
        }
      }
    }
  }

  // ✅ GENERIC API CALL WRAPPER - VERSION CORRIGÉE SANS GÉNÉRIQUE PROBLÉMATIQUE
  const apiCall = async (
    endpoint: string, 
    options: any = {}
  ): Promise<ApiResponse<any>> => {
    try {
      console.log(`📡 API Call: ${options.method || 'GET'} ${baseURL}${endpoint}`)
      
      const fetchOptions = createFetchOptions(options)
      const response = await $fetch(endpoint, fetchOptions) as any
      
      console.log('✅ API Response:', response)
      
      // Si la réponse est déjà au format ApiResponse
      if (response && typeof response === 'object' && ('success' in response || 'data' in response)) {
        return {
          success: true,
          data: response.data || response,
          ...response
        }
      }
      
      // Sinon, wrapper la réponse
      return {
        data: response,
        success: true
      }
    } catch (error: any) {
      console.error('❌ API call failed:', error)
      
      const errorMessage = error.data?.message || error.message || 'Une erreur est survenue'
      
      return {
        error: errorMessage,
        success: false
      }
    }
  }

  // =====================================
  // AUTHENTICATION ENDPOINTS
  // =====================================
  
  const auth = {
    // ✅ LOGIN - CORRIGÉ POUR API EXTERNE
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
      console.log('🔐 API: Tentative de login pour:', credentials.email)
      
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      if (response.success && response.data?.token) {
        setAuthToken(response.data.token)
      }
      
      return response
    },

    // ✅ REGISTER - NOUVEAU ENDPOINT
    register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
      console.log('📝 API: Tentative d\'inscription pour:', credentials.email)
      
      const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: credentials
      })
      
      if (response.success && response.data?.token) {
        setAuthToken(response.data.token)
      }
      
      return response
    },

    // ✅ VERIFY TOKEN
    verify: async (): Promise<ApiResponse<{ user: AuthResponse['user'] }>> => {
      const token = getAuthToken()
      if (!token) {
        return { success: false, error: 'Pas de token' }
      }
      
      return await apiCall('/api/auth/verify', {
        method: 'POST'
      })
    },

    // ✅ REFRESH TOKEN
    refresh: async (): Promise<ApiResponse<{ token: string }>> => {
      const response = await apiCall('/api/auth/refresh', {
        method: 'POST'
      })
      
      if (response.success && response.data?.token) {
        setAuthToken(response.data.token)
      }
      
      return response
    },

    logout: () => {
      removeAuthToken()
    }
  }

  // =====================================
  // SHOP ENDPOINTS
  // =====================================
  
  const shops = {
    get: async (shopId: string): Promise<ApiResponse<Shop>> => {
      return apiCall(`/api/shops/${shopId}`)
    },

    update: async (shopId: string, settings: Partial<Shop['settings']>): Promise<ApiResponse<Shop>> => {
      return apiCall(`/api/shops/${shopId}`, {
        method: 'PUT',
        body: { settings }
      })
    }
  }

  // =====================================
  // CONVERSATIONS ENDPOINTS
  // =====================================
  
  const conversations = {
    // ✅ MAINTENIR COMPATIBILITÉ AVEC LES STORES EXISTANTS
    list: async (shopId?: string): Promise<ApiResponse<Conversation[]>> => {
      // Ignorer le shopId pour l'instant car l'API se base sur l'auth
      return apiCall('/api/conversations')
    },

    get: async (conversationId: string): Promise<ApiResponse<Conversation>> => {
      return apiCall(`/api/conversations/${conversationId}`)
    },

    create: async (shopId: string, data: { visitorId: string, metadata?: any }): Promise<ApiResponse<Conversation>> => {
      return apiCall('/api/conversations', {
        method: 'POST',
        body: { shopId, ...data }
      })
    },

    // ✅ AJOUTER LA MÉTHODE TAKEOVER MANQUANTE
    takeover: async (conversationId: string): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall(`/api/conversations/${conversationId}/takeover`, {
        method: 'POST'
      })
    }
  }

  // =====================================
  // ORDERS ENDPOINTS
  // =====================================
  
  const orders = {
    // ✅ MAINTENIR COMPATIBILITÉ AVEC LES STORES EXISTANTS
    list: async (shopId?: string): Promise<ApiResponse<Order[]>> => {
      // Ignorer le shopId pour l'instant car l'API se base sur l'auth
      return apiCall('/api/orders')
    },

    get: async (orderId: string): Promise<ApiResponse<Order>> => {
      return apiCall(`/api/orders/${orderId}`)
    },

    create: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<ApiResponse<Order>> => {
      return apiCall('/api/orders', {
        method: 'POST',
        body: orderData
      })
    }
  }

  // =====================================
  // ANALYTICS ENDPOINTS
  // =====================================
  
  const analytics = {
    // ✅ MAINTENIR COMPATIBILITÉ - IGNORER LE PARAMÈTRE SHOPID
    dashboard: async (shopId?: string): Promise<ApiResponse<AnalyticsData>> => {
      // Ignorer le shopId pour l'instant car l'API se base sur l'auth
      return apiCall('/api/analytics')
    },

    trackEvent: async (eventData: {
      shopId: string
      type: string
      data: any
    }): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall('/api/analytics/events', {
        method: 'POST',
        body: eventData
      })
    }
  }

  // =====================================
  // KNOWLEDGE BASE ENDPOINTS
  // =====================================
  
  const knowledgeBase = {
    // ✅ MAINTENIR COMPATIBILITÉ AVEC LES STORES EXISTANTS
    list: async (shopId?: string): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
      // Ignorer le shopId pour l'instant car l'API se base sur l'auth
      return apiCall('/api/knowledge-base')
    },

    upload: async (shopId: string, file: File): Promise<ApiResponse<KnowledgeBaseDocument>> => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('shopId', shopId)

      return apiCall('/api/knowledge-base/upload', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type for FormData
      })
    },

    addManual: async (shopId: string, data: {
      title: string
      content: string
    }): Promise<ApiResponse<KnowledgeBaseDocument>> => {
      return apiCall('/api/knowledge-base/manual', {
        method: 'POST',
        body: { shopId, ...data }
      })
    },

    delete: async (documentId: string): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall(`/api/knowledge-base/${documentId}`, {
        method: 'DELETE'
      })
    }
  }

  // =====================================
  // UTILITAIRES
  // =====================================
  
  const utils = {
    healthCheck: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/health')
    },

    test: async (): Promise<ApiResponse<any>> => {
      return apiCall('/api/test')
    }
  }

  return {
    // Configuration
    baseURL,
    
    // Utilities
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    
    // API groups
    auth,
    shops,
    conversations,
    orders,
    analytics,
    knowledgeBase,
    utils
  }
}