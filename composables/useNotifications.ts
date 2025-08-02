// composables/useNotifications.ts - COMPOSABLE POUR NOTIFICATIONS TEMPS RÉEL
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSupabase } from './useSupabase'

interface NotificationCounts {
  unreadConversations: number
  totalConversations: number
  unreadOrders: number
  totalOrders: number
}

export const useNotifications = () => {
  const authStore = useAuthStore()
  const supabase = useSupabase()
  
  // ✅ STATE RÉACTIF
  const counts = ref<NotificationCounts>({
    unreadConversations: 0,
    totalConversations: 0,
    unreadOrders: 0,
    totalOrders: 0
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // ✅ SUBSCRIPTIONS TEMPS RÉEL
  let conversationsSubscription: any = null
  let ordersSubscription: any = null
  
  // ✅ COMPUTED PROPERTIES
  const unreadCount = computed(() => 
    counts.value.unreadConversations + counts.value.unreadOrders
  )
  
  const hasUnreadNotifications = computed(() => unreadCount.value > 0)
  
  // ✅ CHARGER LES COMPTES INITIAUX
  const loadNotificationCounts = async () => {
    if (!authStore.userShopId) {
      console.warn('⚠️ Pas de shop_id disponible pour les notifications')
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      const shopId = authStore.userShopId
      
      console.log('🔄 Chargement des comptes de notifications pour shop:', shopId)
      
      // ✅ REQUÊTES PARALLÈLES POUR OPTIMISER LA PERFORMANCE
      const [conversationsResult, ordersResult] = await Promise.all([
        // Conversations avec comptage des non lues
        supabase
          .from('conversations')
          .select('id, status, last_customer_message_at, last_agent_response_at')
          .eq('shop_id', shopId)
          .order('created_at', { ascending: false }),
        
        // Commandes avec statut
        supabase
          .from('orders')
          .select('id, status, created_at')
          .eq('shop_id', shopId)
          .order('created_at', { ascending: false })
      ])
      
      if (conversationsResult.error) {
        console.error('❌ Erreur conversations:', conversationsResult.error)
        throw conversationsResult.error
      }
      
      if (ordersResult.error) {
        console.error('❌ Erreur orders:', ordersResult.error)
        throw ordersResult.error
      }
      
      const conversations = conversationsResult.data || []
      const orders = ordersResult.data || []
      
      // ✅ CALCULER LES CONVERSATIONS NON LUES
      // Une conversation est "non lue" si le dernier message client est plus récent que la dernière réponse agent
      const unreadConversations = conversations.filter(conv => {
        // Statut en attente = non lu
        if (conv.status === 'pending' || conv.status === 'waiting_agent') {
          return true
        }
        
        // Comparer les timestamps si disponibles
        if (conv.last_customer_message_at && conv.last_agent_response_at) {
          return new Date(conv.last_customer_message_at) > new Date(conv.last_agent_response_at)
        }
        
        // Si pas de réponse agent mais message client = non lu
        if (conv.last_customer_message_at && !conv.last_agent_response_at) {
          return true
        }
        
        return false
      }).length
      
      // ✅ CALCULER LES COMMANDES NON LUES (nouvelles commandes)
      const unreadOrders = orders.filter(order => 
        order.status === 'pending' || order.status === 'processing'
      ).length
      
      // ✅ METTRE À JOUR LE STATE
      counts.value = {
        unreadConversations,
        totalConversations: conversations.length,
        unreadOrders,
        totalOrders: orders.length
      }
      
      console.log('✅ Comptes de notifications mis à jour:', counts.value)
      
    } catch (err: any) {
      console.error('❌ Erreur lors du chargement des notifications:', err)
      error.value = err.message || 'Erreur lors du chargement des notifications'
      
      // ✅ FALLBACK EN CAS D'ERREUR
      counts.value = {
        unreadConversations: 0,
        totalConversations: 0,
        unreadOrders: 0,
        totalOrders: 0
      }
    } finally {
      loading.value = false
    }
  }
  
  // ✅ ABONNEMENT TEMPS RÉEL POUR LES CONVERSATIONS
  const subscribeToConversations = () => {
    if (!authStore.userShopId) return
    
    console.log('🔔 Abonnement temps réel aux conversations')
    
    conversationsSubscription = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `shop_id=eq.${authStore.userShopId}`
        },
        (payload) => {
          console.log('🔄 Changement temps réel conversation:', payload)
          // Recharger les comptes quand il y a un changement
          loadNotificationCounts()
        }
      )
      .subscribe()
  }
  
  // ✅ ABONNEMENT TEMPS RÉEL POUR LES COMMANDES
  const subscribeToOrders = () => {
    if (!authStore.userShopId) return
    
    console.log('🔔 Abonnement temps réel aux commandes')
    
    ordersSubscription = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `shop_id=eq.${authStore.userShopId}`
        },
        (payload) => {
          console.log('🔄 Changement temps réel commande:', payload)
          // Recharger les comptes quand il y a un changement
          loadNotificationCounts()
        }
      )
      .subscribe()
  }
  
  // ✅ MARQUER UNE CONVERSATION COMME LUE
  const markConversationAsRead = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          status: 'active',
          last_agent_response_at: new Date().toISOString()
        })
        .eq('id', conversationId)
      
      if (error) throw error
      
      // Recharger les comptes après mise à jour
      await loadNotificationCounts()
      
    } catch (err: any) {
      console.error('❌ Erreur lors du marquage comme lu:', err)
    }
  }
  
  // ✅ MARQUER UNE COMMANDE COMME TRAITÉE
  const markOrderAsProcessed = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId)
      
      if (error) throw error
      
      // Recharger les comptes après mise à jour
      await loadNotificationCounts()
      
    } catch (err: any) {
      console.error('❌ Erreur lors du marquage commande:', err)
    }
  }
  
  // ✅ ACTUALISER MANUELLEMENT
  const refreshNotifications = async () => {
    await loadNotificationCounts()
  }
  
  // ✅ DÉMARRER LES ABONNEMENTS
  const startSubscriptions = () => {
    subscribeToConversations()
    subscribeToOrders()
  }
  
  // ✅ ARRÊTER LES ABONNEMENTS
  const stopSubscriptions = () => {
    if (conversationsSubscription) {
      supabase.removeChannel(conversationsSubscription)
      conversationsSubscription = null
    }
    
    if (ordersSubscription) {
      supabase.removeChannel(ordersSubscription)
      ordersSubscription = null
    }
  }
  
  // ✅ LIFECYCLE
  onMounted(() => {
    if (authStore.isAuthenticated && authStore.userShopId) {
      loadNotificationCounts()
      startSubscriptions()
    }
  })
  
  onUnmounted(() => {
    stopSubscriptions()
  })
  
  // ✅ WATCHER POUR RÉAGIR AUX CHANGEMENTS D'AUTH
  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth && authStore.userShopId) {
      loadNotificationCounts()
      startSubscriptions()
    } else {
      stopSubscriptions()
      counts.value = {
        unreadConversations: 0,
        totalConversations: 0,
        unreadOrders: 0,
        totalOrders: 0
      }
    }
  })
  
  return {
    // ✅ STATE
    counts: readonly(counts),
    loading: readonly(loading),
    error: readonly(error),
    
    // ✅ COMPUTED
    unreadCount,
    hasUnreadNotifications,
    
    // ✅ METHODS
    loadNotificationCounts,
    markConversationAsRead,
    markOrderAsProcessed,
    refreshNotifications,
    startSubscriptions,
    stopSubscriptions
  }
}