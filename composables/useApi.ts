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

  // Generic API call wrapper
  const apiCall = async <T>(
    endpoint: string, 
    options: any = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const fetchOptions = createFetchOptions(options)
      const response = await $fetch<T>(endpoint, fetchOptions)
      
      return {
        data: response,
        success: true
      }
    } catch (error: any) {
      console.error('API call failed:', error)
      
      return {
        error: error.message || 'Une erreur est survenue',
        success: false
      }
    }
  }

  // =====================================
  // AUTHENTICATION ENDPOINTS
  // =====================================
  
  const auth = {
    // Login - Testons différents endpoints
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
      // Essayons d'abord l'endpoint simple
      try {
        console.log('🧪 Tentative 1: /auth/login')
        const response = await apiCall<AuthResponse>('/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        if (response.success && response.data?.token) {
          setAuthToken(response.data.token)
          return response
        }
      } catch (error) {
        console.log('❌ Endpoint /auth/login échoué, tentative suivante...')
      }
      
      // Si ça ne marche pas, essayons le endpoint avec /api/v1
      try {
        console.log('🧪 Tentative 2: /api/v1/auth/login')
        const response = await apiCall<AuthResponse>('/api/v1/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        if (response.success && response.data?.token) {
          setAuthToken(response.data.token)
          return response
        }
      } catch (error) {
        console.log('❌ Endpoint /api/v1/auth/login échoué')
      }
      
      // Si ça ne marche toujours pas, essayons d'autres variantes
      try {
        console.log('🧪 Tentative 3: /login')
        const response = await apiCall<AuthResponse>('/login', {
          method: 'POST',
          body: credentials
        })
        
        if (response.success && response.data?.token) {
          setAuthToken(response.data.token)
          return response
        }
      } catch (error) {
        console.log('❌ Endpoint /login échoué')
      }
      
      return {
        error: 'Tous les endpoints de login ont échoué. Problème CORS ou endpoints incorrects.',
        success: false
      }
    },

    // Verify token - version simplifiée
    verify: async (): Promise<ApiResponse<{ user: AuthResponse['user'] }>> => {
      try {
        return await apiCall<{ user: AuthResponse['user'] }>('/auth/verify')
      } catch (error) {
        try {
          return await apiCall<{ user: AuthResponse['user'] }>('/api/v1/auth/verify')
        } catch (error2) {
          return {
            error: 'Impossible de vérifier le token',
            success: false
          }
        }
      }
    },

    // Autres méthodes auth...
    register: async (credentials: LoginCredentials & { name: string }): Promise<ApiResponse<AuthResponse>> => {
      return apiCall<AuthResponse>('/auth/register', {
        method: 'POST',
        body: credentials
      })
    },

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
      return apiCall<Shop>(`/api/v1/shops/${shopId}`)
    },

    // Update shop configuration
    update: async (shopId: string, settings: Partial<Shop['settings']>): Promise<ApiResponse<Shop>> => {
      return apiCall<Shop>(`/api/v1/shops/${shopId}`, {
        method: 'PUT',
        body: { settings }
      })
    }
  }

  // =====================================
  // CONVERSATIONS ENDPOINTS
  // =====================================
  
  const conversations = {
    // Get all conversations
    list: async (shopId: string): Promise<ApiResponse<Conversation[]>> => {
      return apiCall<Conversation[]>(`/api/v1/shops/${shopId}/conversations`)
    },

    // Get conversation details
    get: async (conversationId: string): Promise<ApiResponse<Conversation>> => {
      return apiCall<Conversation>(`/api/v1/conversations/${conversationId}`)
    },

    // Create new conversation
    create: async (shopId: string, data: { visitorId: string, metadata?: any }): Promise<ApiResponse<Conversation>> => {
      return apiCall<Conversation>('/api/v1/conversations', {
        method: 'POST',
        body: { shopId, ...data }
      })
    },

    // Take over conversation (human agent)
    takeover: async (conversationId: string): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall<{ success: boolean }>(`/api/v1/conversations/${conversationId}/takeover`, {
        method: 'POST'
      })
    }
  }

  // =====================================
  // ORDERS ENDPOINTS
  // =====================================
  
  const orders = {
    // Get all orders
    list: async (shopId: string): Promise<ApiResponse<Order[]>> => {
      return apiCall<Order[]>(`/api/v1/shops/${shopId}/orders`)
    },

    // Get order details
    get: async (orderId: string): Promise<ApiResponse<Order>> => {
      return apiCall<Order>(`/api/v1/orders/${orderId}`)
    },

    // Create new order
    create: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<ApiResponse<Order>> => {
      return apiCall<Order>('/api/v1/orders', {
        method: 'POST',
        body: orderData
      })
    }
  }

  // =====================================
  // ANALYTICS ENDPOINTS
  // =====================================
  
  const analytics = {
    // Get dashboard metrics
    dashboard: async (shopId: string): Promise<ApiResponse<AnalyticsData>> => {
      return apiCall<AnalyticsData>(`/api/v1/shops/${shopId}/analytics`)
    },

    // Track event
    trackEvent: async (eventData: {
      shopId: string
      type: string
      data: any
    }): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall<{ success: boolean }>('/api/v1/analytics/events', {
        method: 'POST',
        body: eventData
      })
    }
  }

  // =====================================
  // KNOWLEDGE BASE ENDPOINTS
  // =====================================
  
  const knowledgeBase = {
    // Get all documents
    list: async (shopId: string): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
      return apiCall<KnowledgeBaseDocument[]>(`/api/v1/shops/${shopId}/knowledge-base`)
    },

    // Upload document
    upload: async (shopId: string, file: File): Promise<ApiResponse<KnowledgeBaseDocument>> => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('shopId', shopId)

      return apiCall<KnowledgeBaseDocument>('/api/v1/knowledge-base/upload', {
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
      return apiCall<KnowledgeBaseDocument>('/api/v1/knowledge-base/manual', {
        method: 'POST',
        body: { shopId, ...data }
      })
    },

    // Delete document
    delete: async (documentId: string): Promise<ApiResponse<{ success: boolean }>> => {
      return apiCall<{ success: boolean }>(`/api/v1/knowledge-base/${documentId}`, {
        method: 'DELETE'
      })
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
    knowledgeBase
  }
}