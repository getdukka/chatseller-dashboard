// stores/analytics.ts - VERSION CORRIGÉE POUR VRAIE API
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface AnalyticsData {
  totalConversations: number
  activeConversations: number
  completedConversations: number
  completedOrders: number
  totalRevenue: number
  conversionRate: number
  averageOrderValue: number
  conversationsByDay: Array<{ date: string; count: number }>
  revenueByDay: Array<{ date: string; revenue: number }>
  topProducts: Array<{ name: string; orders: number; revenue: number }>
}

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

    // Check if data needs refresh (5 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return state.lastFetch < fiveMinutesAgo
    }
  },

  actions: {
    // ✅ FETCH ANALYTICS - VERSION CORRIGÉE
    async fetchAnalytics(forceRefresh = false): Promise<void> {
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
        console.log('📊 [Analytics] Chargement analytics via API...')
        
        // ✅ UTILISER LA VRAIE API - SANS PARAMÈTRE userShopId
        const api = useApi()
        const response = await api.analytics.dashboard()

        console.log('📊 [Analytics] Réponse API:', response)

        if (response.success && response.data) {
          this.data = response.data
          this.lastFetch = new Date()
          this.error = null
          console.log('✅ [Analytics] Analytics chargées avec succès')
        } else {
          this.error = response.error || 'Erreur lors du chargement des analytics'
          console.error('❌ [Analytics] Erreur:', this.error)
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des analytics'
        console.error('❌ [Analytics] Exception:', error)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ SET PERIOD - VERSION CORRIGÉE
    setPeriod(period: AnalyticsState['selectedPeriod']): void {
      if (this.selectedPeriod !== period) {
        this.selectedPeriod = period
        // Refresh data when period changes
        this.fetchAnalytics(true)
      }
    },

    // ✅ CLEAR ERROR
    clearError(): void {
      this.error = null
    },

    // ✅ CLEAR DATA - Pour logout
    clearData(): void {
      this.data = null
      this.error = null
      this.lastFetch = null
      this.selectedPeriod = '30d'
    },

    // ✅ GET PERIOD LABEL
    getPeriodLabel(): string {
      switch (this.selectedPeriod) {
        case '7d': return '7 derniers jours'
        case '30d': return '30 derniers jours'
        case '90d': return '3 derniers mois'
        case '1y': return '12 derniers mois'
        default: return '30 derniers jours'
      }
    }
  }
})

// ✅ COMPOSABLE POUR ACCÈS FACILE
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
    
    // Actions
    fetchAnalytics: analyticsStore.fetchAnalytics,
    setPeriod: analyticsStore.setPeriod,
    clearError: analyticsStore.clearError,
    clearData: analyticsStore.clearData,
    getPeriodLabel: analyticsStore.getPeriodLabel
  }
}