// stores/conversations.ts
import { defineStore } from 'pinia'
import type { Conversation, Message } from '~/composables/useApi'
import { useAuthStore } from './auth'

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
    
    abandonedConversations: (state) => 
      state.conversations.filter(conv => conv.status === 'abandoned'),
    
    // Stats
    totalConversations: (state) => state.conversations.length,
    activeCount: (state) => state.conversations.filter(conv => conv.status === 'active').length,
    
    // Get conversation by ID
    getConversationById: (state) => (id: string) => 
      state.conversations.find(conv => conv.id === id),
    
    // Get latest conversations (most recent first)
    latestConversations: (state) => 
      [...state.conversations]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10),
    
    // Check if data needs refresh (5 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      return state.lastFetch < fiveMinutesAgo
    }
  },

  actions: {
    // =====================================
    // FETCH ACTIONS
    // =====================================
    
    /**
     * Fetch all conversations for current shop
     */
    async fetchConversations(forceRefresh = false): Promise<void> {
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
        const { conversations } = useApi()
        const response = await conversations.list(userShopId.value)

        if (response.success && response.data) {
          this.conversations = response.data
          this.lastFetch = new Date()
          this.error = null
        } else {
          this.error = response.error || 'Erreur lors du chargement des conversations'
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des conversations'
        console.error('Fetch conversations error:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch specific conversation details
     */
    async fetchConversation(conversationId: string): Promise<Conversation | null> {
      this.isLoadingConversation = true
      this.error = null

      try {
        const { conversations } = useApi()
        const response = await conversations.get(conversationId)

        if (response.success && response.data) {
          this.currentConversation = response.data
          
          // Update conversation in list if it exists
          const index = this.conversations.findIndex(conv => conv.id === conversationId)
          if (index !== -1) {
            this.conversations[index] = response.data
          }
          
          return response.data
        } else {
          this.error = response.error || 'Erreur lors du chargement de la conversation'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement de la conversation'
        console.error('Fetch conversation error:', error)
        return null
      } finally {
        this.isLoadingConversation = false
      }
    },

    // =====================================
    // CONVERSATION MANAGEMENT
    // =====================================
    
    /**
     * Take over a conversation (switch to human agent)
     */
    async takeoverConversation(conversationId: string): Promise<boolean> {
      try {
        const { conversations } = useApi()
        const response = await conversations.takeover(conversationId)

        if (response.success) {
          // Update conversation status in store
          const conversation = this.conversations.find(conv => conv.id === conversationId)
          if (conversation) {
            // Add system message about takeover
            const systemMessage: Message = {
              id: `system_${Date.now()}`,
              conversationId,
              content: 'Un agent humain a pris le contrôle de cette conversation',
              type: 'system',
              timestamp: new Date().toISOString()
            }
            conversation.messages.push(systemMessage)
          }

          // Update current conversation if it's the same
          if (this.currentConversation?.id === conversationId) {
            await this.fetchConversation(conversationId)
          }

          return true
        } else {
          this.error = response.error || 'Erreur lors de la prise de contrôle'
          return false
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la prise de contrôle'
        console.error('Takeover conversation error:', error)
        return false
      }
    },

    /**
     * Create new conversation
     */
    async createConversation(visitorId: string, metadata?: any): Promise<Conversation | null> {
      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return null
      }

      try {
        const { conversations } = useApi()
        const response = await conversations.create(userShopId.value, {
          visitorId,
          metadata
        })

        if (response.success && response.data) {
          // Add to conversations list
          this.conversations.unshift(response.data)
          return response.data
        } else {
          this.error = response.error || 'Erreur lors de la création de la conversation'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de la conversation'
        console.error('Create conversation error:', error)
        return null
      }
    },

    // =====================================
    // REAL-TIME UPDATES
    // =====================================
    
    /**
     * Add new message to conversation (for real-time updates)
     */
    addMessageToConversation(conversationId: string, message: Message): void {
      // Update in conversations list
      const conversation = this.conversations.find(conv => conv.id === conversationId)
      if (conversation) {
        conversation.messages.push(message)
        conversation.updatedAt = new Date().toISOString()
      }

      // Update current conversation
      if (this.currentConversation?.id === conversationId) {
        this.currentConversation.messages.push(message)
        this.currentConversation.updatedAt = new Date().toISOString()
      }
    },

    /**
     * Update conversation status
     */
    updateConversationStatus(conversationId: string, status: Conversation['status']): void {
      // Update in conversations list
      const conversation = this.conversations.find(conv => conv.id === conversationId)
      if (conversation) {
        conversation.status = status
        conversation.updatedAt = new Date().toISOString()
      }

      // Update current conversation
      if (this.currentConversation?.id === conversationId) {
        this.currentConversation.status = status
        this.currentConversation.updatedAt = new Date().toISOString()
      }
    },

    // =====================================
    // UTILITY ACTIONS
    // =====================================
    
    /**
     * Set current conversation
     */
    setCurrentConversation(conversation: Conversation | null): void {
      this.currentConversation = conversation
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
      this.conversations = []
      this.currentConversation = null
      this.error = null
      this.lastFetch = null
    },

    /**
     * Get conversation summary for display
     */
    getConversationSummary(conversation: Conversation): {
      lastMessage: string
      messageCount: number
      duration: string
      visitorName: string
    } {
      const lastMessage = conversation.messages.length > 0 
        ? conversation.messages[conversation.messages.length - 1].content
        : 'Aucun message'

      const messageCount = conversation.messages.length

      const startTime = new Date(conversation.createdAt)
      const endTime = new Date(conversation.updatedAt)
      const durationMs = endTime.getTime() - startTime.getTime()
      const durationMinutes = Math.floor(durationMs / (1000 * 60))
      const duration = durationMinutes > 0 ? `${durationMinutes}min` : '< 1min'

      const visitorName = conversation.metadata?.visitorInfo?.name || 
                         `Visiteur ${conversation.visitorId.slice(-4)}`

      return {
        lastMessage,
        messageCount,
        duration,
        visitorName
      }
    }
  }
})

// =====================================
// COMPOSABLE FOR EASY ACCESS
// =====================================

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
    abandonedConversations: computed(() => conversationsStore.abandonedConversations),
    totalConversations: computed(() => conversationsStore.totalConversations),
    activeCount: computed(() => conversationsStore.activeCount),
    latestConversations: computed(() => conversationsStore.latestConversations),
    
    // Actions
    fetchConversations: conversationsStore.fetchConversations,
    fetchConversation: conversationsStore.fetchConversation,
    takeoverConversation: conversationsStore.takeoverConversation,
    createConversation: conversationsStore.createConversation,
    addMessageToConversation: conversationsStore.addMessageToConversation,
    updateConversationStatus: conversationsStore.updateConversationStatus,
    setCurrentConversation: conversationsStore.setCurrentConversation,
    clearError: conversationsStore.clearError,
    clearData: conversationsStore.clearData,
    getConversationSummary: conversationsStore.getConversationSummary,
    
    // Utilities
    getConversationById: conversationsStore.getConversationById
  }
}