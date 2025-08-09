// stores/conversations.ts 
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Conversation {
  id: string
  shopId: string
  agentId: string | null
  visitorId: string | null
  productName: string | null
  status: string
  startedAt: string
  lastActivity: string
  completedAt: string | null
  conversionCompleted: boolean
  messages: Message[]
}

interface Message {
  id: string
  conversationId: string
  role: string
  content: string
  createdAt: string
}

interface ConversationsState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  isLoading: boolean
  isLoadingConversation: boolean
  error: string | null
  lastFetch: Date | null
}

export const useConversationsStore = defineStore('conversations', {
  state: (): ConversationsState => ({
    conversations: [],
    currentConversation: null,
    isLoading: false,
    isLoadingConversation: false,
    error: null,
    lastFetch: null
  }),

  getters: {
    // Get conversations by status
    activeConversations: (state) => 
      state.conversations.filter(conv => conv.status === 'active'),
    
    completedConversations: (state) => 
      state.conversations.filter(conv => conv.status === 'completed'),
    
    // Stats
    totalConversations: (state) => state.conversations.length,
    activeCount: (state) => state.conversations.filter(conv => conv.status === 'active').length,
    
    // Get conversation by ID
    getConversationById: (state) => (id: string) => 
      state.conversations.find(conv => conv.id === id),
    
    // Get latest conversations (most recent first)
    latestConversations: (state) => 
      [...state.conversations]
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
        .slice(0, 10),
    
    // Check if data needs refresh (5 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return state.lastFetch < fiveMinutesAgo
    }
  },

  actions: {
    // ✅ FETCH CONVERSATIONS - VERSION CORRIGÉE
    async fetchConversations(forceRefresh = false): Promise<void> {
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
        console.log('💬 [Conversations] Chargement conversations via API...')
        
        // ✅ UTILISER LA VRAIE API - SANS PARAMÈTRE userShopId
        const api = useApi()
        const response = await api.conversations.list()

        console.log('💬 [Conversations] Réponse API:', response)

        if (response.success && response.data) {
          this.conversations = response.data
          this.lastFetch = new Date()
          this.error = null
          console.log('✅ [Conversations] Conversations chargées:', response.data.length)
        } else {
          this.error = response.error || 'Erreur lors du chargement des conversations'
          console.error('❌ [Conversations] Erreur:', this.error)
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des conversations'
        console.error('❌ [Conversations] Exception:', error)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ FETCH SPECIFIC CONVERSATION
    async fetchConversation(conversationId: string): Promise<Conversation | null> {
      this.isLoadingConversation = true
      this.error = null

      try {
        console.log('💬 [Conversations] Chargement conversation:', conversationId)
        
        const api = useApi()
        const response = await api.conversations.get(conversationId)

        if (response.success && response.data) {
          this.currentConversation = response.data
          
          // Update conversation in list if it exists
          const index = this.conversations.findIndex(conv => conv.id === conversationId)
          if (index !== -1) {
            this.conversations[index] = response.data
          }
          
          console.log('✅ [Conversations] Conversation chargée')
          return response.data
        } else {
          this.error = response.error || 'Erreur lors du chargement de la conversation'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement de la conversation'
        console.error('❌ [Conversations] Exception:', error)
        return null
      } finally {
        this.isLoadingConversation = false
      }
    },

    // ✅ CREATE NEW CONVERSATION
    async createConversation(data: {
      shopId: string,
      visitorId: string,
      productId?: string,
      productName?: string,
      productPrice?: number,
      productUrl?: string
    }): Promise<Conversation | null> {
      try {
        console.log('💬 [Conversations] Création conversation...')
        
        const api = useApi()
        const response = await api.conversations.create(data)

        if (response.success && response.data) {
          // Add to conversations list
          this.conversations.unshift(response.data)
          console.log('✅ [Conversations] Conversation créée')
          return response.data
        } else {
          this.error = response.error || 'Erreur lors de la création de la conversation'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de la conversation'
        console.error('❌ [Conversations] Exception:', error)
        return null
      }
    },

    // ✅ SET CURRENT CONVERSATION
    setCurrentConversation(conversation: Conversation | null): void {
      this.currentConversation = conversation
    },

    // ✅ CLEAR ERROR
    clearError(): void {
      this.error = null
    },

    // ✅ CLEAR DATA - Pour logout
    clearData(): void {
      this.conversations = []
      this.currentConversation = null
      this.error = null
      this.lastFetch = null
    }
  }
})

// ✅ COMPOSABLE POUR ACCÈS FACILE
export const useConversations = () => {
  const conversationsStore = useConversationsStore()
  
  return {
    // State
    conversations: computed(() => conversationsStore.conversations),
    currentConversation: computed(() => conversationsStore.currentConversation),
    isLoading: computed(() => conversationsStore.isLoading),
    isLoadingConversation: computed(() => conversationsStore.isLoadingConversation),
    error: computed(() => conversationsStore.error),
    
    // Getters
    activeConversations: computed(() => conversationsStore.activeConversations),
    completedConversations: computed(() => conversationsStore.completedConversations),
    totalConversations: computed(() => conversationsStore.totalConversations),
    activeCount: computed(() => conversationsStore.activeCount),
    latestConversations: computed(() => conversationsStore.latestConversations),
    
    // Actions
    fetchConversations: conversationsStore.fetchConversations,
    fetchConversation: conversationsStore.fetchConversation,
    createConversation: conversationsStore.createConversation,
    setCurrentConversation: conversationsStore.setCurrentConversation,
    clearError: conversationsStore.clearError,
    clearData: conversationsStore.clearData,
    
    // Utilities
    getConversationById: conversationsStore.getConversationById
  }
}