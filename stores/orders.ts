// stores/orders.ts
import { defineStore } from 'pinia'
import type { Order, OrderItem } from '~/composables/useApi'
import { useAuthStore } from './auth'

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

      // Filter by search term (customer name, email, product)
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(order => 
          order.customerInfo.name.toLowerCase().includes(searchLower) ||
          order.customerInfo.email?.toLowerCase().includes(searchLower) ||
          order.items.some(item => 
            item.productName.toLowerCase().includes(searchLower)
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

    // Recent orders (last 7 days)
    recentOrders: (state) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return state.orders.filter(order => 
        new Date(order.createdAt) >= sevenDaysAgo
      ).length
    },

    // Top products
    topProducts: (state) => {
      const productStats: Record<string, { name: string; quantity: number; revenue: number }> = {}
      
      state.orders
        .filter(order => order.status === 'confirmed')
        .forEach(order => {
          order.items.forEach(item => {
            const key = item.productName
            if (!productStats[key]) {
              productStats[key] = { name: item.productName, quantity: 0, revenue: 0 }
            }
            productStats[key].quantity += item.quantity
            productStats[key].revenue += item.price * item.quantity
          })
        })

      return Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
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
    // =====================================
    // FETCH ACTIONS
    // =====================================
    
    /**
     * Fetch all orders for current shop
     */
    async fetchOrders(forceRefresh = false): Promise<void> {
      // Skip if data is fresh and not forcing refresh
      if (!forceRefresh && !this.needsRefresh) {
        return
      }

      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const { orders } = useApi()
        const response = await orders.list(userShopId.value)

        if (response.success && response.data) {
          this.orders = response.data
          this.lastFetch = new Date()
          this.error = null
        } else {
          this.error = response.error || 'Erreur lors du chargement des commandes'
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des commandes'
        console.error('Fetch orders error:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch specific order details
     */
    async fetchOrder(orderId: string): Promise<Order | null> {
      try {
        const { orders } = useApi()
        const response = await orders.get(orderId)

        if (response.success && response.data) {
          this.currentOrder = response.data
          
          // Update order in list if it exists
          const index = this.orders.findIndex(order => order.id === orderId)
          if (index !== -1) {
            this.orders[index] = response.data
          }
          
          return response.data
        } else {
          this.error = response.error || 'Erreur lors du chargement de la commande'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement de la commande'
        console.error('Fetch order error:', error)
        return null
      }
    },

    // =====================================
    // ORDER MANAGEMENT
    // =====================================
    
    /**
     * Create new order
     */
    async createOrder(orderData: {
      conversationId: string
      customerInfo: Order['customerInfo']
      items: OrderItem[]
      totalAmount: number
    }): Promise<Order | null> {
      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return null
      }

      this.isCreating = true
      this.error = null

      try {
        const { orders } = useApi()
        const response = await orders.create({
          ...orderData,
          shopId: userShopId.value,
          status: 'pending'
        })

        if (response.success && response.data) {
          // Add to orders list
          this.orders.unshift(response.data)
          return response.data
        } else {
          this.error = response.error || 'Erreur lors de la création de la commande'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de la commande'
        console.error('Create order error:', error)
        return null
      } finally {
        this.isCreating = false
      }
    },

    // =====================================
    // FILTERING AND SEARCH
    // =====================================
    
    /**
     * Set status filter
     */
    setStatusFilter(status: Order['status'] | 'all'): void {
      this.filters.status = status
    },

    /**
     * Set date range filter
     */
    setDateRangeFilter(start: Date | null, end: Date | null): void {
      this.filters.dateRange.start = start
      this.filters.dateRange.end = end
    },

    /**
     * Set search term
     */
    setSearchTerm(term: string): void {
      this.filters.searchTerm = term
    },

    /**
     * Clear all filters
     */
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

    // =====================================
    // UTILITY ACTIONS
    // =====================================
    
    /**
     * Set current order
     */
    setCurrentOrder(order: Order | null): void {
      this.currentOrder = order
    },

    /**
     * Clear error
     */
    clearError(): void {
      this.error = null
    },

    /**
     * Clear all data (for logout)
     */
    clearData(): void {
      this.orders = []
      this.currentOrder = null
      this.error = null
      this.lastFetch = null
      this.clearFilters()
    },

    /**
     * Get revenue for specific period
     */
    getRevenueForPeriod(days: number): number {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      
      return this.orders
        .filter(order => 
          order.status === 'confirmed' && 
          new Date(order.createdAt) >= startDate
        )
        .reduce((sum, order) => sum + order.totalAmount, 0)
    },

    /**
     * Get orders count for specific period
     */
    getOrdersCountForPeriod(days: number): number {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      
      return this.orders.filter(order => 
        new Date(order.createdAt) >= startDate
      ).length
    },

    /**
     * Export orders to CSV
     */
    exportToCSV(): string {
      const headers = [
        'ID',
        'Date',
        'Client',
        'Email',
        'Téléphone',
        'Produits',
        'Montant Total',
        'Statut'
      ]

      const rows = this.filteredOrders.map(order => [
        order.id,
        new Date(order.createdAt).toLocaleDateString('fr-FR'),
        order.customerInfo.name,
        order.customerInfo.email || '',
        order.customerInfo.phone || '',
        order.items.map(item => `${item.productName} (${item.quantity})`).join('; '),
        `${order.totalAmount}€`,
        order.status
      ])

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')

      return csvContent
    }
  }
})

// =====================================
// COMPOSABLE FOR EASY ACCESS
// =====================================

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
    recentOrders: computed(() => ordersStore.recentOrders),
    topProducts: computed(() => ordersStore.topProducts),
    
    // Actions
    fetchOrders: ordersStore.fetchOrders,
    fetchOrder: ordersStore.fetchOrder,
    createOrder: ordersStore.createOrder,
    setStatusFilter: ordersStore.setStatusFilter,
    setDateRangeFilter: ordersStore.setDateRangeFilter,
    setSearchTerm: ordersStore.setSearchTerm,
    clearFilters: ordersStore.clearFilters,
    setCurrentOrder: ordersStore.setCurrentOrder,
    clearError: ordersStore.clearError,
    clearData: ordersStore.clearData,
    getRevenueForPeriod: ordersStore.getRevenueForPeriod,
    getOrdersCountForPeriod: ordersStore.getOrdersCountForPeriod,
    exportToCSV: ordersStore.exportToCSV,
    
    // Utilities
    getOrderById: ordersStore.getOrderById
  }
}