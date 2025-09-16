// stores/orders.ts
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

// ✅ TYPES ANALYTICS CONVERSION
interface ConversionOrder {
  id: string
  conversation_id: string
  shop_id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address?: string
  customer_profile?: {
    beauty_category?: string
    skin_type?: string
    age_range?: string
    preferences?: string[]
  }
  
  // Produits et analytics
  product_items: Array<{
    id?: string
    name: string
    price: number
    quantity: number
    category?: string
    ai_recommended?: boolean
  }>
  upsell_items?: Array<{
    id?: string
    name: string
    price: number
    quantity: number
    ai_suggested?: boolean
  }>
  
  // Montants et attribution
  total_amount: number
  upsell_amount?: number
  ai_attributed_revenue: number
  organic_revenue?: number
  currency: string
  
  // Attribution et tracking
  attribution_method: 'utm' | 'cookie' | 'session' | 'referral'
  confidence_score?: number
  tracking_data?: {
    utm_source?: string
    utm_campaign?: string
    referrer?: string
    session_id?: string
  }
  
  // Conversation analytics
  conversation_duration?: string
  messages_count?: number
  satisfaction_score?: number
  personalized_recommendations?: boolean
  
  // Métadonnées
  payment_method: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  roi?: number
  attributed_cost?: number
  created_at: string
  updated_at?: string
}

interface AnalyticsData {
  aiConversions: number
  organicConversions: number
  aiConversionRate: number
  aiRevenue: number
  organicRevenue: number
  avgOrderValueAI: number
  avgOrderValueOrganic: number
  monthlyCost: number
  upsellConversions: number
  upsellRevenue: number
}

interface BeautyInsights {
  dominantAge: string
  agePercentage: number
  topSkinType: string
  skinTypePercentage: number
  avgBudget: number
  loyaltyRate: number
  topCategories: Array<{
    name: string
    percentage: number
    revenue: number
  }>
  seasonalTrends?: Record<string, any>
}

interface ConversionFunnel {
  visitors: number
  conversations: number
  recommendations: number
  conversions: number
}

interface OrdersState {
  orders: ConversionOrder[]
  analyticsData: AnalyticsData
  beautyInsights: BeautyInsights
  conversionFunnel: ConversionFunnel
  topAIProducts: Array<{
    id: string
    name: string
    category: string
    aiConversions: number
    aiRevenue: number
    conversionRate: number
  }>
  
  // État de chargement
  isLoading: boolean
  isExporting: boolean
  error: string | null
  lastFetch: Date | null
  
  // Filtres analytics
  filters: {
    timeRange: 'today' | 'week' | 'month' | 'quarter'
    attributionMethod: string
    beautyCategory: string
  }
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    analyticsData: {
      aiConversions: 0,
      organicConversions: 0,
      aiConversionRate: 0,
      aiRevenue: 0,
      organicRevenue: 0,
      avgOrderValueAI: 0,
      avgOrderValueOrganic: 0,
      monthlyCost: 149, // Plan par défaut
      upsellConversions: 0,
      upsellRevenue: 0
    },
    beautyInsights: {
      dominantAge: '25-35',
      agePercentage: 0,
      topSkinType: 'Mixte',
      skinTypePercentage: 0,
      avgBudget: 0,
      loyaltyRate: 0,
      topCategories: []
    },
    conversionFunnel: {
      visitors: 0,
      conversations: 0,
      recommendations: 0,
      conversions: 0
    },
    topAIProducts: [],
    
    isLoading: false,
    isExporting: false,
    error: null,
    lastFetch: null,
    
    filters: {
      timeRange: 'month',
      attributionMethod: '',
      beautyCategory: ''
    }
  }),

  getters: {
    // ✅ CONVERSIONS FILTRÉES
    filteredConversions: (state) => {
      let filtered = [...state.orders]

      // Filtre par méthode d'attribution
      if (state.filters.attributionMethod) {
        filtered = filtered.filter(order => 
          order.attribution_method === state.filters.attributionMethod
        )
      }

      // Filtre par catégorie beauté
      if (state.filters.beautyCategory) {
        filtered = filtered.filter(order => 
          order.customer_profile?.beauty_category === state.filters.beautyCategory
        )
      }

      // Filtre par période (implémentation simplifiée)
      const now = new Date()
      if (state.filters.timeRange !== 'month') {
        // TODO: Implémenter filtres temporels
      }

      return filtered.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },

    // ✅ MÉTRIQUES ROI
    roiMetrics: (state) => {
      const totalRevenue = state.analyticsData.aiRevenue
      const totalCost = state.analyticsData.monthlyCost
      
      return {
        roi: totalCost > 0 ? (totalRevenue / totalCost).toFixed(1) : '0.0',
        netProfit: totalRevenue - totalCost,
        revenueGrowth: state.analyticsData.organicRevenue > 0 
          ? Math.round(((state.analyticsData.aiRevenue - state.analyticsData.organicRevenue) / state.analyticsData.organicRevenue) * 100)
          : 0,
        conversionUplift: state.analyticsData.organicConversions > 0
          ? Math.round(((state.analyticsData.aiConversions - state.analyticsData.organicConversions) / state.analyticsData.organicConversions) * 100)
          : 0
      }
    },

    // ✅ STATS PAR ATTRIBUTION
    attributionStats: (state) => {
      const stats = state.orders.reduce((acc, order) => {
        const method = order.attribution_method
        if (!acc[method]) {
          acc[method] = {
            count: 0,
            revenue: 0,
            avgConfidence: 0
          }
        }
        
        acc[method].count++
        acc[method].revenue += order.ai_attributed_revenue
        acc[method].avgConfidence += (order.confidence_score || 0)
        
        return acc
      }, {} as Record<string, any>)
      
      // Calculer moyennes
      Object.keys(stats).forEach(method => {
        if (stats[method].count > 0) {
          stats[method].avgConfidence = Math.round(stats[method].avgConfidence / stats[method].count)
        }
      })
      
      return stats
    },

    // ✅ INSIGHTS TEMPORELS
    temporalInsights: (state) => {
      const today = new Date()
      const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      
      return {
        today: state.orders.filter(o => 
          new Date(o.created_at) >= new Date(today.toDateString())
        ).length,
        thisWeek: state.orders.filter(o => 
          new Date(o.created_at) >= thisWeek
        ).length,
        thisMonth: state.orders.filter(o => 
          new Date(o.created_at) >= thisMonth
        ).length
      }
    },

    // ✅ CHECK SI DONNÉES FRAÎCHES
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
      return state.lastFetch < tenMinutesAgo
    }
  },

  actions: {
    // ✅ CHARGER ANALYTICS DE CONVERSION
    async fetchConversions(forceRefresh = false) {
      if (!forceRefresh && !this.needsRefresh) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        console.log('📊 [Orders Store] Chargement analytics de conversion...')
        
        const api = useApi()
        
        // Charger conversions avec attribution
        const conversionsResponse = await api.analytics.getConversions(this.filters)
        
        if (conversionsResponse.success && conversionsResponse.data) {
          this.orders = conversionsResponse.data.map(this.convertToConversionOrder)
          
          // Calculer analytics depuis les données
          this.calculateAnalyticsData()
          
          console.log('✅ [Orders Store] Analytics de conversion chargées:', this.orders.length)
        } else {
          // Fallback avec données simulées pour développement
          this.loadMockData()
        }
        
        this.lastFetch = new Date()
        
      } catch (error: any) {
        console.error('❌ [Orders Store] Erreur chargement analytics:', error)
        this.error = error.message || 'Erreur lors du chargement des analytics'
        
        // Fallback avec données simulées
        this.loadMockData()
        this.lastFetch = new Date()
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CHARGER DONNÉES COMPLÉMENTAIRES
    async loadAdditionalAnalytics() {
      try {
        const api = useApi()
        
        // Charger en parallèle
        const [topProductsResponse, beautyInsightsResponse] = await Promise.allSettled([
          api.analytics.getTopProducts(),
          api.analytics.getBeautyInsights()
        ])
        
        if (topProductsResponse.status === 'fulfilled' && topProductsResponse.value.success) {
          this.topAIProducts = topProductsResponse.value.data || []
        }
        
        if (beautyInsightsResponse.status === 'fulfilled' && beautyInsightsResponse.value.success) {
          this.beautyInsights = {
            ...this.beautyInsights,
            ...beautyInsightsResponse.value.data
          }
        }
        
      } catch (error) {
        console.warn('⚠️ [Orders Store] Erreur chargement données complémentaires:', error)
      }
    },

    // ✅ CALCULER ANALYTICS DEPUIS LES DONNÉES
    calculateAnalyticsData() {
      const aiOrders = this.orders.filter(o => o.ai_attributed_revenue > 0)
      const organicOrders = this.orders.filter(o => (o.organic_revenue || 0) > 0)
      
      const aiRevenue = aiOrders.reduce((sum, o) => sum + o.ai_attributed_revenue, 0)
      const organicRevenue = organicOrders.reduce((sum, o) => sum + (o.organic_revenue || 0), 0)
      const upsellRevenue = this.orders.reduce((sum, o) => sum + (o.upsell_amount || 0), 0)
      
      this.analyticsData = {
        aiConversions: aiOrders.length,
        organicConversions: organicOrders.length,
        aiConversionRate: aiOrders.length > 0 ? Math.round((aiOrders.length / this.orders.length) * 100) : 0,
        aiRevenue,
        organicRevenue,
        avgOrderValueAI: aiOrders.length > 0 ? Math.round(aiRevenue / aiOrders.length) : 0,
        avgOrderValueOrganic: organicOrders.length > 0 ? Math.round(organicRevenue / organicOrders.length) : 0,
        monthlyCost: this.analyticsData.monthlyCost, // Garder valeur existante
        upsellConversions: this.orders.filter(o => (o.upsell_amount || 0) > 0).length,
        upsellRevenue
      }
      
      // Calculer insights beauté
      this.calculateBeautyInsights()
    },

    // ✅ CALCULER INSIGHTS BEAUTÉ
    calculateBeautyInsights() {
      if (!this.orders.length) return
      
      // Analyser âges
      const ageRanges = this.orders
        .map(o => o.customer_profile?.age_range)
        .filter(Boolean)
        .reduce((acc: Record<string, number>, age) => {
          acc[age!] = (acc[age!] || 0) + 1
          return acc
        }, {})
      
      const topAge = Object.entries(ageRanges)
        .sort(([,a], [,b]) => b - a)[0]
      
      // Analyser types de peau
      const skinTypes = this.orders
        .map(o => o.customer_profile?.skin_type)
        .filter(Boolean)
        .reduce((acc: Record<string, number>, skin) => {
          acc[skin!] = (acc[skin!] || 0) + 1
          return acc
        }, {})
      
      const topSkin = Object.entries(skinTypes)
        .sort(([,a], [,b]) => b - a)[0]
      
      // Budget moyen
      const avgBudget = this.orders.length > 0 
        ? Math.round(this.orders.reduce((sum, o) => sum + o.total_amount, 0) / this.orders.length)
        : 0
      
      this.beautyInsights = {
        dominantAge: topAge?.[0] || '25-35',
        agePercentage: topAge ? Math.round((topAge[1] / this.orders.length) * 100) : 0,
        topSkinType: topSkin?.[0] || 'Mixte',
        skinTypePercentage: topSkin ? Math.round((topSkin[1] / this.orders.length) * 100) : 0,
        avgBudget,
        loyaltyRate: 67, // TODO: Calculer vraiment
        topCategories: this.calculateTopCategories()
      }
    },

    // ✅ CALCULER TOP CATÉGORIES
    calculateTopCategories() {
      const categories = this.orders.reduce((acc: Record<string, {count: number, revenue: number}>, order) => {
        order.product_items.forEach(item => {
          const cat = item.category || 'Non classé'
          if (!acc[cat]) {
            acc[cat] = { count: 0, revenue: 0 }
          }
          acc[cat].count += item.quantity
          acc[cat].revenue += item.price * item.quantity
        })
        return acc
      }, {})
      
      const totalRevenue = Object.values(categories).reduce((sum, cat) => sum + cat.revenue, 0)
      
      return Object.entries(categories)
        .map(([name, data]) => ({
          name,
          percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
          revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    },

    // ✅ CONVERTIR COMMANDE API VERS CONVERSION ORDER
    convertToConversionOrder(apiOrder: any): ConversionOrder {
      return {
        id: apiOrder.id,
        conversation_id: apiOrder.conversation_id,
        shop_id: apiOrder.shop_id,
        customer_name: apiOrder.customer_name,
        customer_phone: apiOrder.customer_phone,
        customer_email: apiOrder.customer_email,
        customer_address: apiOrder.customer_address,
        customer_profile: apiOrder.customer_profile,
        product_items: apiOrder.product_items || [],
        upsell_items: apiOrder.upsell_items,
        total_amount: apiOrder.total_amount || 0,
        upsell_amount: apiOrder.upsell_amount,
        ai_attributed_revenue: apiOrder.ai_attributed_revenue || apiOrder.total_amount || 0,
        organic_revenue: apiOrder.organic_revenue,
        currency: apiOrder.currency || 'XOF',
        attribution_method: apiOrder.attribution_method || 'session',
        confidence_score: apiOrder.confidence_score,
        tracking_data: apiOrder.tracking_data,
        conversation_duration: apiOrder.conversation_duration,
        messages_count: apiOrder.messages_count,
        satisfaction_score: apiOrder.satisfaction_score,
        personalized_recommendations: apiOrder.personalized_recommendations,
        payment_method: apiOrder.payment_method,
        status: apiOrder.status || 'pending',
        notes: apiOrder.notes,
        roi: apiOrder.roi,
        attributed_cost: apiOrder.attributed_cost,
        created_at: apiOrder.created_at,
        updated_at: apiOrder.updated_at
      }
    },

    // ✅ DONNÉES SIMULÉES POUR DÉVELOPPEMENT
    loadMockData() {
      console.log('🎭 [Orders Store] Chargement données simulées pour développement')
      
      this.orders = [
        {
          id: 'mock-1',
          conversation_id: 'conv-1',
          shop_id: 'shop-1',
          customer_name: 'Marie Dubois',
          customer_phone: '+33123456789',
          customer_email: 'marie@example.com',
          customer_profile: {
            beauty_category: 'skincare',
            skin_type: 'Mixte',
            age_range: '25-35'
          },
          product_items: [
            {
              name: 'Sérum Vitamine C',
              price: 45,
              quantity: 1,
              category: 'Skincare',
              ai_recommended: true
            }
          ],
          total_amount: 45,
          ai_attributed_revenue: 45,
          currency: 'EUR',
          attribution_method: 'utm',
          confidence_score: 95,
          conversation_duration: '8min',
          messages_count: 12,
          satisfaction_score: 5,
          personalized_recommendations: true,
          payment_method: 'card',
          status: 'confirmed',
          roi: 3.2,
          attributed_cost: 14,
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-2',
          conversation_id: 'conv-2',
          shop_id: 'shop-1',
          customer_name: 'Sophie Martin',
          customer_phone: '+33987654321',
          customer_profile: {
            beauty_category: 'makeup',
            skin_type: 'Sèche',
            age_range: '35-45'
          },
          product_items: [
            {
              name: 'Fond de teint longue tenue',
              price: 32,
              quantity: 1,
              category: 'Makeup',
              ai_recommended: true
            }
          ],
          upsell_items: [
            {
              name: 'Primer matifiant',
              price: 18,
              quantity: 1,
              ai_suggested: true
            }
          ],
          total_amount: 50,
          upsell_amount: 18,
          ai_attributed_revenue: 50,
          currency: 'EUR',
          attribution_method: 'cookie',
          confidence_score: 88,
          conversation_duration: '12min',
          messages_count: 18,
          satisfaction_score: 4,
          personalized_recommendations: true,
          payment_method: 'paypal',
          status: 'shipped',
          roi: 2.8,
          attributed_cost: 18,
          created_at: new Date(Date.now() - 86400000).toISOString() // Hier
        }
      ]
      
      this.analyticsData = {
        aiConversions: 47,
        organicConversions: 23,
        aiConversionRate: 8.3,
        aiRevenue: 4750,
        organicRevenue: 2100,
        avgOrderValueAI: 101,
        avgOrderValueOrganic: 91,
        monthlyCost: 149,
        upsellConversions: 18,
        upsellRevenue: 890
      }
      
      this.conversionFunnel = {
        visitors: 1247,
        conversations: 312,
        recommendations: 189,
        conversions: 47
      }
      
      this.topAIProducts = [
        {
          id: 'product-1',
          name: 'Sérum Hyaluronique',
          category: 'Skincare',
          aiConversions: 23,
          aiRevenue: 1150,
          conversionRate: 18.5
        },
        {
          id: 'product-2',
          name: 'Mascara Volume',
          category: 'Makeup',
          aiConversions: 18,
          aiRevenue: 540,
          conversionRate: 15.2
        }
      ]
      
      this.calculateBeautyInsights()
    },

    // ✅ FILTRAGE
    setTimeRange(timeRange: typeof this.filters.timeRange) {
      this.filters.timeRange = timeRange
      return this.fetchConversions()
    },

    setAttributionFilter(method: string) {
      this.filters.attributionMethod = method
    },

    setBeautyCategoryFilter(category: string) {
      this.filters.beautyCategory = category
    },

    // ✅ EXPORT
    async exportConversions() {
      this.isExporting = true
      
      try {
        // Logique d'export sera implémentée côté composant
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
        console.log('✅ [Orders Store] Export terminé')
      } catch (error) {
        console.error('❌ [Orders Store] Erreur export:', error)
        throw error
      } finally {
        this.isExporting = false
      }
    },

    // ✅ NETTOYAGE
    clearError() {
      this.error = null
    },

    clearData() {
      this.orders = []
      this.analyticsData = {
        aiConversions: 0,
        organicConversions: 0,
        aiConversionRate: 0,
        aiRevenue: 0,
        organicRevenue: 0,
        avgOrderValueAI: 0,
        avgOrderValueOrganic: 0,
        monthlyCost: 149,
        upsellConversions: 0,
        upsellRevenue: 0
      }
      this.error = null
      this.lastFetch = null
    }
  }
})

// ✅ COMPOSABLE POUR ACCÈS FACILE
export const useOrders = () => {
  const ordersStore = useOrdersStore()
  
  return {
    // State
    orders: computed(() => ordersStore.orders),
    analyticsData: computed(() => ordersStore.analyticsData),
    beautyInsights: computed(() => ordersStore.beautyInsights),
    conversionFunnel: computed(() => ordersStore.conversionFunnel),
    topAIProducts: computed(() => ordersStore.topAIProducts),
    isLoading: computed(() => ordersStore.isLoading),
    isExporting: computed(() => ordersStore.isExporting),
    error: computed(() => ordersStore.error),
    filters: computed(() => ordersStore.filters),
    
    // Getters
    filteredConversions: computed(() => ordersStore.filteredConversions),
    roiMetrics: computed(() => ordersStore.roiMetrics),
    attributionStats: computed(() => ordersStore.attributionStats),
    temporalInsights: computed(() => ordersStore.temporalInsights),
    
    // Actions
    fetchConversions: ordersStore.fetchConversions,
    loadAdditionalAnalytics: ordersStore.loadAdditionalAnalytics,
    setTimeRange: ordersStore.setTimeRange,
    setAttributionFilter: ordersStore.setAttributionFilter,
    setBeautyCategoryFilter: ordersStore.setBeautyCategoryFilter,
    exportConversions: ordersStore.exportConversions,
    clearError: ordersStore.clearError,
    clearData: ordersStore.clearData
  }
}