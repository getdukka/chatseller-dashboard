// stores/orders.ts 
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Order {
  id: string
  conversationId: string
  shopId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress?: string
  productItems: Array<{
    name: string
    price: number
    quantity: number
  }>
  totalAmount: number
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt?: string
}

interface OrdersState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  isCreating: boolean
  error: string | null
  lastFetch: Date | null
  filters: {
    status: Order['status'] | 'all'
    dateRange: {
      start: Date | null
      end: Date | null
    }
    searchTerm: string
  }
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    isCreating: false,
    error: null,
    lastFetch: null,
    filters: {
      status: 'all',
      dateRange: {
        start: null,
        end: null
      },
      searchTerm: ''
    }
  }),

  getters: {
    // Filter orders based on current filters
    filteredOrders: (state) => {
      let filtered = [...state.orders]

      // Filter by status
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(order => order.status === state.filters.status)
      }

      // Filter by date range
      if (state.filters.dateRange.start) {
        filtered = filtered.filter(order => 
          new Date(order.createdAt) >= state.filters.dateRange.start!
        )
      }
      if (state.filters.dateRange.end) {
        filtered = filtered.filter(order => 
          new Date(order.createdAt) <= state.filters.dateRange.end!
        )
      }

      // Filter by search term
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(order => 
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerPhone.toLowerCase().includes(searchLower) ||
          (order.customerEmail && order.customerEmail.toLowerCase().includes(searchLower)) ||
          order.productItems.some(item => 
            item.name.toLowerCase().includes(searchLower)
          )
        )
      }

      return filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },

    // Orders by status
    pendingOrders: (state) => 
      state.orders.filter(order => order.status === 'pending'),
    
    confirmedOrders: (state) => 
      state.orders.filter(order => order.status === 'confirmed'),
    
    cancelledOrders: (state) => 
      state.orders.filter(order => order.status === 'cancelled'),

    // Statistics
    totalOrders: (state) => state.orders.length,
    totalRevenue: (state) => 
      state.orders
        .filter(order => order.status === 'confirmed')
        .reduce((sum, order) => sum + order.totalAmount, 0),
    
    averageOrderValue: (state) => {
      const confirmedOrders = state.orders.filter(order => order.status === 'confirmed')
      if (confirmedOrders.length === 0) return 0
      return confirmedOrders.reduce((sum, order) => sum + order.totalAmount, 0) / confirmedOrders.length
    },

    // Get order by ID
    getOrderById: (state) => (id: string) => 
      state.orders.find(order => order.id === id),

    // Check if data needs refresh (10 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
      return state.lastFetch < tenMinutesAgo
    }
  },

  actions: {
    // ✅ FETCH ORDERS - VERSION TEMPORAIRE (API list pas encore implémentée)
    async fetchOrders(forceRefresh = false): Promise<void> {
      // Skip if data is fresh and not forcing refresh
      if (!forceRefresh && !this.needsRefresh) {
        return
      }

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.error = 'Utilisateur non authentifié'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        console.log('🛒 [Orders] Chargement commandes via API...')
        
        // ✅ UTILISER LA VRAIE API - VERSION TEMPORAIRE
        const api = useApi()
        const response = await api.orders.list()

        console.log('🛒 [Orders] Réponse API:', response)

        if (response.success && response.data) {
          this.orders = response.data
          this.lastFetch = new Date()
          this.error = null
          console.log('✅ [Orders] Commandes chargées:', response.data.length)
        } else {
          // Pour l'instant, initialiser avec un tableau vide si pas d'implémentation
          this.orders = []
          this.lastFetch = new Date()
          this.error = null
          console.log('ℹ️ [Orders] Pas de commandes (API pas encore implémentée)')
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des commandes'
        console.error('❌ [Orders] Exception:', error)
        // Fallback : tableau vide
        this.orders = []
        this.lastFetch = new Date()
      } finally {
        this.isLoading = false
      }
    },

    // ✅ START ORDER WORKFLOW
    async startOrder(data: {
      conversationId: string,
      productInfo?: any,
      message?: string
    }): Promise<any> {
      try {
        console.log('🛒 [Orders] Démarrage workflow commande...')
        
        const api = useApi()
        const response = await api.orders.startOrder(data)

        if (response.success) {
          console.log('✅ [Orders] Workflow commande démarré')
          return response.data
        } else {
          this.error = response.error || 'Erreur lors du démarrage de la commande'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du démarrage de la commande'
        console.error('❌ [Orders] Exception:', error)
        return null
      }
    },

    // ✅ COMPLETE ORDER
    async completeOrder(data: {
      conversationId: string,
      orderData: any
    }): Promise<Order | null> {
      this.isCreating = true
      
      try {
        console.log('🛒 [Orders] Finalisation commande...')
        
        const api = useApi()
        const response = await api.orders.complete(data)

        if (response.success && response.data) {
          // Add to orders list
          this.orders.unshift(response.data)
          console.log('✅ [Orders] Commande finalisée')
          return response.data
        } else {
          this.error = response.error || 'Erreur lors de la finalisation de la commande'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la finalisation de la commande'
        console.error('❌ [Orders] Exception:', error)
        return null
      } finally {
        this.isCreating = false
      }
    },

    // ✅ FILTERING ACTIONS
    setStatusFilter(status: Order['status'] | 'all'): void {
      this.filters.status = status
    },

    setDateRangeFilter(start: Date | null, end: Date | null): void {
      this.filters.dateRange.start = start
      this.filters.dateRange.end = end
    },

    setSearchTerm(term: string): void {
      this.filters.searchTerm = term
    },

    clearFilters(): void {
      this.filters = {
        status: 'all',
        dateRange: {
          start: null,
          end: null
        },
        searchTerm: ''
      }
    },

    // ✅ UTILITY ACTIONS
    setCurrentOrder(order: Order | null): void {
      this.currentOrder = order
    },

    clearError(): void {
      this.error = null
    },

    clearData(): void {
      this.orders = []
      this.currentOrder = null
      this.error = null
      this.lastFetch = null
      this.clearFilters()
    }
  }
})

// ✅ COMPOSABLE POUR ACCÈS FACILE
export const useOrders = () => {
  const ordersStore = useOrdersStore()
  
  return {
    // State
    orders: computed(() => ordersStore.orders),
    currentOrder: computed(() => ordersStore.currentOrder),
    isLoading: computed(() => ordersStore.isLoading),
    isCreating: computed(() => ordersStore.isCreating),
    error: computed(() => ordersStore.error),
    filters: computed(() => ordersStore.filters),
    
    // Getters
    filteredOrders: computed(() => ordersStore.filteredOrders),
    pendingOrders: computed(() => ordersStore.pendingOrders),
    confirmedOrders: computed(() => ordersStore.confirmedOrders),
    cancelledOrders: computed(() => ordersStore.cancelledOrders),
    totalOrders: computed(() => ordersStore.totalOrders),
    totalRevenue: computed(() => ordersStore.totalRevenue),
    averageOrderValue: computed(() => ordersStore.averageOrderValue),
    
    // Actions
    fetchOrders: ordersStore.fetchOrders,
    startOrder: ordersStore.startOrder,
    completeOrder: ordersStore.completeOrder,
    setStatusFilter: ordersStore.setStatusFilter,
    setDateRangeFilter: ordersStore.setDateRangeFilter,
    setSearchTerm: ordersStore.setSearchTerm,
    clearFilters: ordersStore.clearFilters,
    setCurrentOrder: ordersStore.setCurrentOrder,
    clearError: ordersStore.clearError,
    clearData: ordersStore.clearData,
    
    // Utilities
    getOrderById: ordersStore.getOrderById
  }
}