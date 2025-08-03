// composables/useAnalytics.ts - SERVICE ANALYTICS OPTIMISÉ
import { useSupabase } from '~/composables/useSupabase'
import { useAuthStore } from '~/stores/auth'

export interface AnalyticsData {
  totalConversations: number
  conversationsGrowth: number | null
  completedOrders: number
  ordersGrowth: number | null
  totalRevenue: number
  revenueGrowth: number | null
  conversionRate: number
  conversionGrowth: number | null
  convertedConversations: number
  avgMessagesPerConversation: number
  avgConversationDuration: number
  avgOrderValue: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
  }>
  agentPerformance: Array<{
    id: string
    name: string
    type: string
    avatar: string
    conversations: number
    conversionRate: number
  }>
  recentActivity: Array<{
    id: string
    title: string
    description: string
    timestamp: string
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

export const useAnalytics = () => {
  const supabase = useSupabase()
  const authStore = useAuthStore()

  // ✅ UTILITAIRES DE DATE
  const getDaysFromPeriod = (period: string): number => {
    switch (period) {
      case '7d': return 7
      case '30d': return 30
      case '90d': return 90
      default: return 30
    }
  }

  const getDateRange = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  }

  // ✅ FONCTION PRINCIPALE DE CHARGEMENT
  const loadAnalytics = async (period: string = '30d'): Promise<AnalyticsData> => {
    if (!authStore.userShopId) {
      throw new Error('Shop ID non disponible')
    }

    const shopId = authStore.userShopId
    const days = getDaysFromPeriod(period)
    const { startDate, endDate } = getDateRange(days)

    console.log('🔄 Chargement analytics optimisé:', { shopId, period, days })

    try {
      // ✅ UTILISATION DES FONCTIONS RPC OPTIMISÉES
      const [
        periodAnalytics,
        dailyConversations,
        dailyRevenue,
        topProducts,
        agentPerformance,
        recentActivity,
        growthMetrics
      ] = await Promise.allSettled([
        // 1. Analytics générales de la période
        supabase.rpc('get_period_analytics', {
          p_shop_id: shopId,
          p_start_date: startDate,
          p_end_date: endDate
        }),

        // 2. Conversations par jour
        supabase.rpc('get_daily_conversations', {
          p_shop_id: shopId,
          p_start_date: startDate,
          p_end_date: endDate
        }),

        // 3. Revenus par jour
        supabase.rpc('get_daily_revenue', {
          p_shop_id: shopId,
          p_start_date: startDate,
          p_end_date: endDate
        }),

        // 4. Top produits
        supabase.rpc('get_top_products', {
          p_shop_id: shopId,
          p_start_date: startDate,
          p_end_date: endDate,
          p_limit: 5
        }),

        // 5. Performance des agents
        supabase.rpc('get_agent_performance', {
          p_shop_id: shopId,
          p_start_date: startDate,
          p_end_date: endDate
        }),

        // 6. Activité récente
        supabase.rpc('get_recent_activity', {
          p_shop_id: shopId,
          p_limit: 10
        }),

        // 7. Métriques de croissance
        supabase.rpc('get_growth_metrics', {
          p_shop_id: shopId,
          p_current_start: startDate,
          p_current_end: endDate,
          p_previous_start: getDateRange(days * 2).startDate,
          p_previous_end: startDate
        })
      ])

      // ✅ TRAITEMENT DES RÉSULTATS
      const analytics = getPromiseResult(periodAnalytics)
      const conversations = getPromiseResult(dailyConversations) || []
      const revenue = getPromiseResult(dailyRevenue) || []
      const products = getPromiseResult(topProducts) || []
      const agents = getPromiseResult(agentPerformance) || []
      const activity = getPromiseResult(recentActivity) || []
      const growth = getPromiseResult(growthMetrics)

      console.log('📊 Données analytics récupérées:', {
        analytics: !!analytics,
        conversations: conversations.length,
        revenue: revenue.length,
        products: products.length,
        agents: agents.length,
        activity: activity.length
      })

      // ✅ CONSTRUCTION DE LA RÉPONSE
      const result: AnalyticsData = {
        // Métriques principales
        totalConversations: analytics?.total_conversations || 0,
        completedOrders: analytics?.completed_orders || 0,
        totalRevenue: analytics?.total_revenue || 0,
        conversionRate: analytics?.conversion_rate || 0,
        convertedConversations: Math.floor((analytics?.total_conversations || 0) * (analytics?.conversion_rate || 0) / 100),
        avgMessagesPerConversation: analytics?.avg_messages_per_conversation || 0,
        avgConversationDuration: analytics?.avg_conversation_duration_seconds || 0,
        avgOrderValue: analytics?.avg_order_value || 0,

        // Métriques de croissance
        conversationsGrowth: growth?.conversations_growth || null,
        ordersGrowth: growth?.orders_growth || null,
        revenueGrowth: growth?.revenue_growth || null,
        conversionGrowth: growth?.conversion_growth || null,

        // Données détaillées
        topProducts: products.map((p: any) => ({
          name: p.product_name || 'Produit sans nom',
          orders: parseInt(p.orders_count) || 0,
          revenue: parseFloat(p.total_revenue) || 0
        })),

        agentPerformance: agents.map((a: any) => ({
          id: a.agent_id,
          name: a.agent_name || 'Agent sans nom',
          type: a.agent_type || 'general',
          avatar: a.agent_avatar || '',
          conversations: parseInt(a.conversations_count) || 0,
          conversionRate: parseFloat(a.conversion_rate) || 0
        })),

        recentActivity: activity.map((act: any) => ({
          id: act.activity_id,
          title: act.title,
          description: act.description,
          timestamp: act.timestamp
        })),

        // Données pour les graphiques
        conversationsByDay: conversations.map((c: any) => ({
          date: c.date,
          count: parseInt(c.count) || 0
        })),

        revenueByDay: revenue.map((r: any) => ({
          date: r.date,  
          revenue: parseFloat(r.revenue) || 0
        }))
      }

      console.log('✅ Analytics traitées avec succès:', result)
      return result

    } catch (error: any) {
      console.error('❌ Erreur chargement analytics:', error)
      
      // ✅ DONNÉES PAR DÉFAUT EN CAS D'ERREUR
      return {
        totalConversations: 0,
        conversationsGrowth: null,
        completedOrders: 0,
        ordersGrowth: null,
        totalRevenue: 0,
        revenueGrowth: null,
        conversionRate: 0,
        conversionGrowth: null,
        convertedConversations: 0,
        avgMessagesPerConversation: 0,
        avgConversationDuration: 0,
        avgOrderValue: 0,
        topProducts: [],
        agentPerformance: [],
        recentActivity: [],
        conversationsByDay: generateEmptyDailyData(days),
        revenueByDay: generateEmptyDailyData(days, 'revenue')
      }
    }
  }

  // ✅ FONCTION UTILITAIRE POUR TRAITER LES PROMESSES
  const getPromiseResult = (promiseResult: PromiseSettledResult<any>) => {
    if (promiseResult.status === 'fulfilled' && !promiseResult.value.error) {
      return promiseResult.value.data
    }
    
    if (promiseResult.status === 'rejected') {
      console.warn('⚠️ Promise rejetée:', promiseResult.reason)
    } else if (promiseResult.value.error) {
      console.warn('⚠️ Erreur RPC:', promiseResult.value.error)
    }
    
    return null
  }

  // ✅ GÉNÉRATION DE DONNÉES VIDES POUR LES GRAPHIQUES
  const generateEmptyDailyData = (days: number, type: 'count' | 'revenue' = 'count') => {
    const data = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      if (type === 'revenue') {
        data.push({
          date: date.toISOString().split('T')[0],
          revenue: 0
        })
      } else {
        data.push({
          date: date.toISOString().split('T')[0],
          count: 0
        })
      }
    }
    
    return data
  }

  // ✅ CACHE SIMPLE POUR ÉVITER LES REQUÊTES RÉPÉTÉES
  const analyticsCache = new Map<string, { data: AnalyticsData, timestamp: number }>()
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const loadAnalyticsWithCache = async (period: string = '30d'): Promise<AnalyticsData> => {
    const cacheKey = `${authStore.userShopId}-${period}`
    const cached = analyticsCache.get(cacheKey)
    
    // Vérifier le cache
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('📋 Utilisation du cache analytics')
      return cached.data
    }
    
    // Charger les nouvelles données
    const data = await loadAnalytics(period)
    
    // Mettre en cache
    analyticsCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })
    
    return data
  }

  // ✅ FONCTION POUR VIDER LE CACHE
  const clearAnalyticsCache = () => {
    analyticsCache.clear()
    console.log('🧹 Cache analytics vidé')
  }

  // ✅ FONCTION POUR EXPORTER LES DONNÉES
  const exportAnalytics = async (period: string = '30d', format: 'json' | 'csv' = 'json') => {
    const data = await loadAnalytics(period)
    
    if (format === 'csv') {
      return convertToCSV(data)
    }
    
    return JSON.stringify(data, null, 2)
  }

  // ✅ CONVERSION CSV POUR EXPORT
  const convertToCSV = (data: AnalyticsData): string => {
    const headers = [
      'Date',
      'Conversations',
      'Revenus',
      'Taux de conversion',
      'Panier moyen'
    ]
    
    const rows = data.conversationsByDay.map((conv, index) => {
      const revenue = data.revenueByDay[index]
      return [
        conv.date,
        conv.count.toString(),
        revenue ? revenue.revenue.toString() : '0',
        data.conversionRate.toFixed(2) + '%',
        data.avgOrderValue.toFixed(2) + '€'
      ]
    })
    
    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
  }

  return {
    loadAnalytics: loadAnalyticsWithCache,
    loadAnalyticsForced: loadAnalytics,
    clearAnalyticsCache,
    exportAnalytics,
    getDaysFromPeriod,
    getDateRange
  }
}