// stores/analytics.ts
import { defineStore } from 'pinia'
import type { AnalyticsData } from '~/composables/useApi'
import { useAuthStore } from './auth'

interface AnalyticsState {
  data: AnalyticsData | null
  isLoading: boolean
  error: string | null
  lastFetch: Date | null
  selectedPeriod: '7d' | '30d' | '90d' | '1y'
}

export const useAnalyticsStore = defineStore('analytics', {
  state: (): AnalyticsState => ({
    data: null,
    isLoading: false,
    error: null,
    lastFetch: null,
    selectedPeriod: '30d'
  }),

  getters: {
    // Quick stats
    totalConversations: (state) => state.data?.totalConversations || 0,
    activeConversations: (state) => state.data?.activeConversations || 0,
    completedOrders: (state) => state.data?.completedOrders || 0,
    conversionRate: (state) => state.data?.conversionRate || 0,
    totalRevenue: (state) => state.data?.totalRevenue || 0,
    averageOrderValue: (state) => state.data?.averageOrderValue || 0,

    // Formatted values
    formattedRevenue: (state) => {
      const revenue = state.data?.totalRevenue || 0
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(revenue)
    },

    formattedAOV: (state) => {
      const aov = state.data?.averageOrderValue || 0
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(aov)
    },

    formattedConversionRate: (state) => {
      const rate = state.data?.conversionRate || 0
      return `${(rate * 100).toFixed(1)}%`
    },

    // Chart data for conversations
    conversationsChartData: (state) => {
      if (!state.data?.conversationsByDay) return []
      
      return state.data.conversationsByDay.map(item => ({
        date: new Date(item.date).toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        value: item.count,
        fullDate: item.date
      }))
    },

    // Chart data for revenue
    revenueChartData: (state) => {
      if (!state.data?.revenueByDay) return []
      
      return state.data.revenueByDay.map(item => ({
        date: new Date(item.date).toLocaleDateString('fr-FR', { 
          month: 'short', 
          day: 'numeric' 
        }),
        value: item.revenue,
        fullDate: item.date
      }))
    },

    // Top products for display
    topProductsForDisplay: (state) => {
      if (!state.data?.topProducts) return []
      
      return state.data.topProducts.slice(0, 5).map((product, index) => ({
        ...product,
        rank: index + 1,
        formattedRevenue: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(product.revenue)
      }))
    },

    // Performance indicators
    performanceIndicators: (state) => {
      if (!state.data) return []

      const indicators = [
        {
          label: 'Conversations totales',
          value: state.data.totalConversations,
          type: 'number',
          trend: null // Could be calculated with historical data
        },
        {
          label: 'Conversations actives',
          value: state.data.activeConversations,
          type: 'number',
          trend: null
        },
        {
          label: 'Commandes',
          value: state.data.completedOrders,
          type: 'number',
          trend: null
        },
        {
          label: 'Taux de conversion',
          value: state.data.conversionRate * 100,
          type: 'percentage',
          trend: null
        },
        {
          label: 'Chiffre d\'affaires',
          value: state.data.totalRevenue,
          type: 'currency',
          trend: null
        },
        {
          label: 'Panier moyen',
          value: state.data.averageOrderValue,
          type: 'currency',
          trend: null
        }
      ]

      return indicators
    },

    // Check if data needs refresh (5 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return state.lastFetch < fiveMinutesAgo
    },

    // Get period in days
    periodInDays: (state) => {
      switch (state.selectedPeriod) {
        case '7d': return 7
        case '30d': return 30
        case '90d': return 90
        case '1y': return 365
        default: return 30
      }
    }
  },

  actions: {
    // =====================================
    // FETCH ACTIONS
    // =====================================
    
    /**
     * Fetch analytics data for current shop
     */
    async fetchAnalytics(forceRefresh = false): Promise<void> {
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
        const { analytics } = useApi()
        const response = await analytics.dashboard(userShopId.value)

        if (response.success && response.data) {
          this.data = response.data
          this.lastFetch = new Date()
          this.error = null
        } else {
          this.error = response.error || 'Erreur lors du chargement des analytics'
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des analytics'
        console.error('Fetch analytics error:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Track custom analytics event
     */
    async trackEvent(eventType: string, eventData: any = {}): Promise<void> {
      const authStore = useAuthStore()
    const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) return

      try {
        const { analytics } = useApi()
        await analytics.trackEvent({
          shopId: userShopId.value,
          type: eventType,
          data: {
            timestamp: new Date().toISOString(),
            period: this.selectedPeriod,
            ...eventData
          }
        })
      } catch (error) {
        console.error('Failed to track event:', error)
      }
    },

    // =====================================
    // PERIOD MANAGEMENT
    // =====================================
    
    /**
     * Set selected time period
     */
    setPeriod(period: AnalyticsState['selectedPeriod']): void {
      if (this.selectedPeriod !== period) {
        this.selectedPeriod = period
        // Refresh data when period changes
        this.fetchAnalytics(true)
      }
    },

    // =====================================
    // UTILITY ACTIONS
    // =====================================
    
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
      this.data = null
      this.error = null
      this.lastFetch = null
      this.selectedPeriod = '30d'
    },

    /**
     * Calculate growth percentage
     */
    calculateGrowth(current: number, previous: number): {
      percentage: number
      isPositive: boolean
      formatted: string
    } {
      if (previous === 0) {
        return {
          percentage: current > 0 ? 100 : 0,
          isPositive: current > 0,
          formatted: current > 0 ? '+100%' : '0%'
        }
      }

      const percentage = ((current - previous) / previous) * 100
      const isPositive = percentage > 0

      return {
        percentage: Math.abs(percentage),
        isPositive,
        formatted: `${isPositive ? '+' : '-'}${Math.abs(percentage).toFixed(1)}%`
      }
    },

    /**
     * Get period label for display
     */
    getPeriodLabel(): string {
      switch (this.selectedPeriod) {
        case '7d': return '7 derniers jours'
        case '30d': return '30 derniers jours'
        case '90d': return '3 derniers mois'
        case '1y': return '12 derniers mois'
        default: return '30 derniers jours'
      }
    },

    /**
     * Export analytics data to CSV
     */
    exportToCSV(): string {
      if (!this.data) return ''

      const headers = ['Métrique', 'Valeur', 'Période']
      const rows = [
        ['Conversations totales', this.data.totalConversations.toString(), this.getPeriodLabel()],
        ['Conversations actives', this.data.activeConversations.toString(), this.getPeriodLabel()],
        ['Commandes complétées', this.data.completedOrders.toString(), this.getPeriodLabel()],
        ['Taux de conversion', this.formattedConversionRate, this.getPeriodLabel()],
        ['Chiffre d\'affaires', this.formattedRevenue, this.getPeriodLabel()],
        ['Panier moyen', this.formattedAOV, this.getPeriodLabel()]
      ]

      // Add top products
      if (this.data.topProducts?.length > 0) {
        rows.push(['--- Produits les plus vendus ---', '', ''])
        this.data.topProducts.forEach((product, index) => {
          rows.push([
            `${index + 1}. ${product.name}`,
            `${product.orders} commandes - ${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(product.revenue)}`,
            this.getPeriodLabel()
          ])
        })
      }

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')

      return csvContent
    },

    /**
     * Get real-time stats summary
     */
    getRealTimeStats(): {
      activeNow: number
      todayConversations: number
      todayRevenue: number
      responseTime: string
    } {
      // This would typically come from real-time data
      // For now, using available data as approximation
      return {
        activeNow: this.data?.activeConversations || 0,
        todayConversations: this.data?.conversationsByDay?.slice(-1)[0]?.count || 0,
        todayRevenue: this.data?.revenueByDay?.slice(-1)[0]?.revenue || 0,
        responseTime: '< 30s' // This would come from conversation analytics
      }
    }
  }
})

// =====================================
// COMPOSABLE FOR EASY ACCESS
// =====================================

export const useAnalytics = () => {
  const analyticsStore = useAnalyticsStore()
  
  return {
    // State
    data: computed(() => analyticsStore.data),
    isLoading: computed(() => analyticsStore.isLoading),
    error: computed(() => analyticsStore.error),
    selectedPeriod: computed(() => analyticsStore.selectedPeriod),
    
    // Getters
    totalConversations: computed(() => analyticsStore.totalConversations),
    activeConversations: computed(() => analyticsStore.activeConversations),
    completedOrders: computed(() => analyticsStore.completedOrders),
    conversionRate: computed(() => analyticsStore.conversionRate),
    totalRevenue: computed(() => analyticsStore.totalRevenue),
    averageOrderValue: computed(() => analyticsStore.averageOrderValue),
    formattedRevenue: computed(() => analyticsStore.formattedRevenue),
    formattedAOV: computed(() => analyticsStore.formattedAOV),
    formattedConversionRate: computed(() => analyticsStore.formattedConversionRate),
    conversationsChartData: computed(() => analyticsStore.conversationsChartData),
    revenueChartData: computed(() => analyticsStore.revenueChartData),
    topProductsForDisplay: computed(() => analyticsStore.topProductsForDisplay),
    performanceIndicators: computed(() => analyticsStore.performanceIndicators),
    
    // Actions
    fetchAnalytics: analyticsStore.fetchAnalytics,
    trackEvent: analyticsStore.trackEvent,
    setPeriod: analyticsStore.setPeriod,
    clearError: analyticsStore.clearError,
    clearData: analyticsStore.clearData,
    calculateGrowth: analyticsStore.calculateGrowth,
    getPeriodLabel: analyticsStore.getPeriodLabel,
    exportToCSV: analyticsStore.exportToCSV,
    getRealTimeStats: analyticsStore.getRealTimeStats
  }
}