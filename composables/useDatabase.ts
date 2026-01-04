// composables/useDatabase.ts

import { useAgents } from "~~/stores/agents"
import { useAnalytics } from "~~/stores/analytics"
import { useConversations } from "~~/stores/conversations"
import { useOrders } from "~~/stores/orders"

export const useDatabase = () => {
  
  // ✅ UTILISER LES STORES CORRIGÉS
  const { 
    fetchConversations, 
    conversations,
    isLoading: conversationsLoading,
    error: conversationsError
  } = useConversations()
  
  const {
    fetchConversions,
    orders,
    isLoading: ordersLoading,
    error: ordersError
  } = useOrders()
  
  const { 
    fetchAgents, 
    agents,
    isLoading: agentsLoading,
    error: agentsError
  } = useAgents()
  
  const { 
    fetchAnalytics, 
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError
  } = useAnalytics()

  // =====================================
  // ✅ MÉTHODES PRINCIPALES
  // =====================================

  const getConversations = async () => {
    console.log('📞 [DB] Récupération conversations via store...')
    await fetchConversations()
    return conversations.value || []
  }

  const getOrders = async () => {
    console.log('🛒 [DB] Récupération commandes via store...')
    await fetchConversions()
    return orders.value || []
  }

  const getAgents = async () => {
    console.log('🤖 [DB] Récupération agents via store...')
    await fetchAgents()
    return agents.value || []
  }

  const getAnalytics = async () => {
    console.log('📊 [DB] Récupération analytics via store...')
    await fetchAnalytics()
    return analyticsData.value || {
      totalConversations: 0,
      activeConversations: 0,
      completedConversations: 0,
      completedOrders: 0,
      totalRevenue: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      conversationsByDay: [],
      revenueByDay: [],
      topProducts: []
    }
  }

  // ✅ KNOWLEDGE BASE - Utiliser directement l'API
  const getKnowledgeBase = async () => {
    console.log('📚 [DB] Récupération knowledge base via API...')
    try {
      const api = useApi()
      const response = await api.knowledgeBase.list()
      
      if (response.success && response.data) {
        console.log('✅ [DB] Documents récupérés:', response.data.length)
        return response.data
      } else {
        console.error('❌ [DB] Erreur knowledge base:', response.error)
        return []
      }
    } catch (error) {
      console.error('❌ [DB] Exception knowledge base:', error)
      return []
    }
  }

  // ✅ SHOP - Utiliser directement l'API
  const getShop = async (shopId?: string) => {
    console.log('🏪 [DB] Récupération shop via API...')
    try {
      const api = useApi()
      const response = await api.shops.get(shopId)
      
      if (response.success && response.data) {
        console.log('✅ [DB] Shop récupéré')
        return response.data
      } else {
        console.error('❌ [DB] Erreur shop:', response.error)
        return null
      }
    } catch (error) {
      console.error('❌ [DB] Exception shop:', error)
      return null
    }
  }

  // =====================================
  // ✅ OPÉRATIONS CRUD GÉNÉRIQUES
  // =====================================

  const create = async (table: string, data: any) => {
    console.log(`➕ [DB] Création ${table} via API:`, data)
    
    try {
      const api = useApi()
      
      switch (table) {
        case 'agents':
          const agentsStore = useAgents()
          return await agentsStore.createAgent(data)
          
        case 'products':
          const response = await api.products.create(data)
          return response.success ? response.data : null
          
        case 'conversations':
          const conversationsStore = useConversations()
          return await conversationsStore.createConversation(data)
          
        default:
          console.error('❌ [DB] Table non supportée:', table)
          return null
      }
    } catch (error) {
      console.error(`❌ [DB] Erreur création ${table}:`, error)
      return null
    }
  }

  const update = async (table: string, id: string, data: any) => {
    console.log(`✏️ [DB] Mise à jour ${table}/${id} via API:`, data)
    
    try {
      const api = useApi()
      
      switch (table) {
        case 'agents':
          const agentsStore = useAgents()
          const success = await agentsStore.updateAgent(id, data)
          return success ? data : null
          
        case 'products':
          const response = await api.products.update(id, data)
          return response.success ? response.data : null
          
        case 'shops':
          const shopResponse = await api.shops.update(id, data)
          return shopResponse.success ? shopResponse.data : null
          
        default:
          console.error('❌ [DB] Table non supportée:', table)
          return null
      }
    } catch (error) {
      console.error(`❌ [DB] Erreur mise à jour ${table}:`, error)
      return null
    }
  }

  const remove = async (table: string, id: string) => {
    console.log(`🗑️ [DB] Suppression ${table}/${id} via API`)
    
    try {
      const api = useApi()
      
      switch (table) {
        case 'agents':
          const agentsStore = useAgents()
          return await agentsStore.deleteAgent(id)
          
        case 'products':
          const response = await api.products.delete(id)
          return response.success
          
        case 'knowledge_base':
          const kbResponse = await api.knowledgeBase.delete(id)
          return kbResponse.success
          
        default:
          console.error('❌ [DB] Table non supportée:', table)
          return false
      }
    } catch (error) {
      console.error(`❌ [DB] Erreur suppression ${table}:`, error)
      return false
    }
  }

  // =====================================
  // ✅ FONCTIONS UTILITAIRES
  // =====================================

  const count = async (table: string, filters: any = {}) => {
    const data = await getData(table, filters)
    return data.length
  }

  const getData = async (table: string, filters: any = {}) => {
    switch (table) {
      case 'conversations':
        return await getConversations()
      case 'orders':
        return await getOrders()
      case 'agents':
        return await getAgents()
      case 'knowledge_base':
        return await getKnowledgeBase()
      default:
        console.error('❌ [DB] Table non supportée:', table)
        return []
    }
  }

  // =====================================
  // ✅ STATISTIQUES CALCULÉES
  // =====================================

  const getStats = async () => {
    console.log('📈 [DB] Calcul des statistiques via stores...')
    
    try {
      // Récupérer analytics directement
      const analytics = await getAnalytics()
      
      if (analytics) {
        console.log('✅ [DB] Statistiques récupérées depuis analytics')
        return {
          totalConversations: analytics.totalConversations,
          totalOrders: analytics.completedOrders,
          totalAgents: analytics.totalConversations > 0 ? 1 : 0, // Approximation
          totalRevenue: analytics.totalRevenue,
          conversionRate: analytics.conversionRate
        }
      }

      // Fallback : calculer depuis les stores
      const [conversationsData, ordersData, agentsData] = await Promise.all([
        getConversations(),
        getOrders(),
        getAgents()
      ])

      const stats = {
        totalConversations: conversationsData.length,
        totalOrders: ordersData.length,
        totalAgents: agentsData.length,
        totalRevenue: ordersData.reduce((sum: number, order: any) => 
          sum + (order.totalAmount || 0), 0),
        conversionRate: conversationsData.length > 0 
          ? (ordersData.length / conversationsData.length) * 100 
          : 0
      }

      console.log('✅ [DB] Statistiques calculées:', stats)
      return stats
    } catch (error) {
      console.error('❌ [DB] Erreur calcul statistiques:', error)
      return {
        totalConversations: 0,
        totalOrders: 0,
        totalAgents: 0,
        totalRevenue: 0,
        conversionRate: 0
      }
    }
  }

  // =====================================
  // ✅ HEALTH CHECK API
  // =====================================

  const healthCheck = async () => {
    console.log('🏥 [DB] Health check API...')
    
    try {
      const api = useApi()
      const response = await api.utils.healthCheck()
      
      if (response.success) {
        console.log('✅ [DB] API en bonne santé')
        return true
      } else {
        console.error('❌ [DB] API non disponible:', response.error)
        return false
      }
    } catch (error) {
      console.error('❌ [DB] Exception health check:', error)
      return false
    }
  }

  // =====================================
  // ✅ STATUS LOADING ET ERREURS
  // =====================================

  const isLoading = computed(() => 
    conversationsLoading.value || 
    ordersLoading.value || 
    agentsLoading.value || 
    analyticsLoading.value
  )

  const lastError = computed(() => 
    conversationsError.value || 
    ordersError.value || 
    agentsError.value || 
    analyticsError.value
  )

  return {
    // Fonctions principales
    getConversations,
    getOrders,
    getAgents,
    getAnalytics,
    getKnowledgeBase,
    getShop,
    getStats,
    
    // Opérations CRUD
    create,
    update,
    remove,
    
    // Utilitaires
    count,
    getData,
    healthCheck,
    
    // Status
    isLoading,
    lastError
  }
}