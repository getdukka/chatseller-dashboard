// composables/useApi.ts

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
  const baseURL = '/api'
  
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
        console.error('API Error:', response.status, response.statusText)
        
        // Handle unauthorized
        if (response.status === 401) {
          removeAuthToken()
          navigateTo('/login')
        }
      }
    }
  }

  // Generic API call wrapper - VERSION CORRIGÉE
  const apiCall = async <T>(
    endpoint: string, 
    options: any = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options)
      const response = await $fetch(endpoint, fetchOptions) as any
      
      // Si la réponse est déjà au format ApiResponse, la retourner
      if (response && typeof response === 'object' && 'success' in response) {
        return response as ApiResponse<T>
      }
      
      // Sinon, wrapper la réponse dans le format ApiResponse
      return {
        data: response as T,
        success: true
      }
    } catch (error: any) {
      console.error('API call failed:', error)
      
      return {
        error: error.data?.message || error.message || 'Une erreur est survenue',
        success: false
      }
    }
  }

  // =====================================
  // AUTHENTICATION ENDPOINTS
  // =====================================
  
  const auth = {
    // Login - VERSION CORRIGÉE pour mes endpoints
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
      console.log('🔐 API: Tentative de login pour:', credentials.email)
      
      try {
        const response = await apiCall<any>('/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        console.log('📡 API: Réponse login:', response)
        
        if (response.success && response.data?.token) {
          setAuthToken(response.data.token)
          
          // Restructurer pour correspondre à AuthResponse
          const authData: AuthResponse = {
            token: response.data.token,
            user: response.data.user
          }
          
          return {
            success: true,
            data: authData
          }
        }
        
        return {
          success: false,
          error: response.error || 'Échec de la connexion'
        }
        
      } catch (error: any) {
        console.error('❌ API: Erreur login:', error)
        return {
          error: error.message || 'Erreur de connexion',
          success: false
        }
      }
    },

    // Verify token - VERSION SIMPLIFIÉE
    verify: async (): Promise<ApiResponse<{ user: AuthResponse['user'] }>> => {
      const token = getAuthToken()
      if (!token) {
        return { success: false, error: 'Pas de token' }
      }
      
      try {
        return await apiCall<{ user: AuthResponse['user'] }>('/auth/verify', {
          method: 'POST',
          body: { token }
        })
      } catch (error) {
        return { error: 'Impossible de vérifier le token', success: false }
      }
    },

    // Register - pour compatibilité future
    register: async (credentials: LoginCredentials & { name: string }): Promise<ApiResponse<AuthResponse>> => {
      return apiCall<AuthResponse>('/auth/register', {
        method: 'POST',
        body: credentials
      })
    },

    // Refresh - pour compatibilité future
    refresh: async (): Promise<ApiResponse<{ token: string }>> => {
      const response = await apiCall<{ token: string }>('/auth/refresh', {
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
    // Get shop configuration
    get: async (shopId: string): Promise<ApiResponse<Shop>> => {
      return apiCall<Shop>(`/shops/${shopId}`)
    },

    // Update shop configuration
    update: async (shopId: string, settings: Partial<Shop['settings']>): Promise<ApiResponse<Shop>> => {
      return apiCall<Shop>(`/shops/${shopId}`, {
        method: 'PUT',
        body: { settings }
      })
    }
  }

  // =====================================
  // CONVERSATIONS ENDPOINTS
  // =====================================
  
  const conversations = {
    // Get all conversations - ADAPTÉ pour mes endpoints
    list: async (shopId?: string): Promise<ApiResponse<Conversation[]>> => {
      return apiCall<Conversation[]>('/conversations')
    },

    // Get conversation details
    get: async (conversationId: string): Promise<ApiResponse<Conversation>> => {
      return apiCall<Conversation>(`/conversations/${conversationId}`)
    },

    // Create new conversation
    create: async (shopId: string, data: { visitorId: string, metadata?: any }): Promise<ApiResponse<Conversation>> => {
      return apiCall<Conversation>('/conversations', {
        method: 'POST',
        body: { shopId, ...data }
      })
    },

    // Take over conversation (human agent)
    takeover: async (conversationId: string): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall<{ success: boolean }>(`/conversations/${conversationId}/takeover`, {
        method: 'POST'
      })
    }
  }

  // =====================================
  // ORDERS ENDPOINTS
  // =====================================
  
  const orders = {
    // Get all orders - ADAPTÉ pour mes endpoints
    list: async (shopId?: string): Promise<ApiResponse<Order[]>> => {
      return apiCall<Order[]>('/orders')
    },

    // Get order details
    get: async (orderId: string): Promise<ApiResponse<Order>> => {
      return apiCall<Order>(`/orders/${orderId}`)
    },

    // Create new order
    create: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<ApiResponse<Order>> => {
      return apiCall<Order>('/orders', {
        method: 'POST',
        body: orderData
      })
    }
  }

  // =====================================
  // ANALYTICS ENDPOINTS
  // =====================================
  
  const analytics = {
    // Get dashboard metrics - ADAPTÉ pour mes endpoints
    dashboard: async (shopId?: string): Promise<ApiResponse<AnalyticsData>> => {
      return apiCall<AnalyticsData>('/analytics')
    },

    // Track event
    trackEvent: async (eventData: {
      shopId: string
      type: string
      data: any
    }): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall<{ success: boolean }>('/analytics/events', {
        method: 'POST',
        body: eventData
      })
    }
  }

  // =====================================
  // KNOWLEDGE BASE ENDPOINTS
  // =====================================
  
  const knowledgeBase = {
    // Get all documents - ADAPTÉ pour mes endpoints
    list: async (shopId?: string): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
      return apiCall<KnowledgeBaseDocument[]>('/knowledge-base')
    },

    // Upload document
    upload: async (shopId: string, file: File): Promise<ApiResponse<KnowledgeBaseDocument>> => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('shopId', shopId)

      return apiCall<KnowledgeBaseDocument>('/knowledge-base/upload', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type to let browser set it for FormData
      })
    },

    // Add manual content
    addManual: async (shopId: string, data: {
      title: string
      content: string
    }): Promise<ApiResponse<KnowledgeBaseDocument>> => {
      return apiCall<KnowledgeBaseDocument>('/knowledge-base/manual', {
        method: 'POST',
        body: { shopId, ...data }
      })
    },

    // Delete document
    delete: async (documentId: string): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall<{ success: boolean }>(`/knowledge-base/${documentId}`, {
        method: 'DELETE'
      })
    }
  }

  // =====================================
  // UTILITAIRES ADDITIONNELS
  // =====================================
  
  const utils = {
    // Test de connectivité
    healthCheck: async (): Promise<ApiResponse<any>> => {
      return apiCall<any>('/health')
    },

    // Test simple
    test: async (): Promise<ApiResponse<any>> => {
      return apiCall<any>('/test')
    }
  }

  return {
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