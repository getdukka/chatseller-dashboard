// stores/agents.ts
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Agent {
  id: string
  shopId: string
  name: string
  type: string
  personality: string
  description?: string
  avatar?: string
  welcomeMessage?: string
  fallbackMessage?: string
  isActive: boolean
  config: any
  createdAt: string
  updatedAt: string
}

interface AgentsState {
  agents: Agent[]
  currentAgent: Agent | null
  isLoading: boolean
  isCreating: boolean
  error: string | null
  lastFetch: Date | null
}

export const useAgentsStore = defineStore('agents', {
  state: (): AgentsState => ({
    agents: [],
    currentAgent: null,
    isLoading: false,
    isCreating: false,
    error: null,
    lastFetch: null
  }),

  getters: {
    // Filter agents
    activeAgents: (state) => 
      state.agents.filter(agent => agent.isActive),
    
    inactiveAgents: (state) => 
      state.agents.filter(agent => !agent.isActive),

    // Stats
    totalAgents: (state) => state.agents.length,
    activeCount: (state) => state.agents.filter(agent => agent.isActive).length,
    
    // Get agent by ID
    getAgentById: (state) => (id: string) => 
      state.agents.find(agent => agent.id === id),
    
    // Get agents by type
    getAgentsByType: (state) => (type: string) => 
      state.agents.filter(agent => agent.type === type),

    // Check if data needs refresh (15 minutes)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
      return state.lastFetch < fifteenMinutesAgo
    }
  },

  actions: {
    // ✅ FETCH AGENTS - VERSION CORRIGÉE
    async fetchAgents(forceRefresh = false): Promise<void> {
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
        console.log('🤖 [Agents] Chargement agents via API...')
        
        // ✅ UTILISER LA VRAIE API - SANS PARAMÈTRE userShopId
        const api = useApi()
        const response = await api.agents.list()

        console.log('🤖 [Agents] Réponse API:', response)

        if (response.success && response.data) {
          this.agents = response.data
          this.lastFetch = new Date()
          this.error = null
          console.log('✅ [Agents] Agents chargés:', response.data.length)
        } else {
          this.error = response.error || 'Erreur lors du chargement des agents'
          console.error('❌ [Agents] Erreur:', this.error)
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des agents'
        console.error('❌ [Agents] Exception:', error)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ CREATE AGENT
    async createAgent(data: {
      name: string,
      type: string,
      personality: string,
      description?: string,
      welcomeMessage?: string,
      fallbackMessage?: string,
      avatar?: string,
      isActive?: boolean,
      config?: any
    }): Promise<Agent | null> {
      this.isCreating = true
      this.error = null

      try {
        console.log('🤖 [Agents] Création agent...')
        
        const api = useApi()
        const response = await api.agents.create(data)

        if (response.success && response.data) {
          // Add to agents list
          this.agents.unshift(response.data)
          console.log('✅ [Agents] Agent créé')
          return response.data
        } else {
          this.error = response.error || 'Erreur lors de la création de l\'agent'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de l\'agent'
        console.error('❌ [Agents] Exception:', error)
        return null
      } finally {
        this.isCreating = false
      }
    },

    // ✅ UPDATE AGENT
    async updateAgent(agentId: string, data: Partial<Agent>): Promise<boolean> {
      try {
        console.log('🤖 [Agents] Mise à jour agent:', agentId)
        
        const api = useApi()
        const response = await api.agents.update(agentId, data)

        if (response.success && response.data) {
          // Update agent in list
          const index = this.agents.findIndex(agent => agent.id === agentId)
          if (index !== -1) {
            this.agents[index] = { ...this.agents[index], ...response.data }
          }
          
          // Update current agent if it's the same
          if (this.currentAgent?.id === agentId) {
            this.currentAgent = { ...this.currentAgent, ...response.data }
          }
          
          console.log('✅ [Agents] Agent mis à jour')
          return true
        } else {
          this.error = response.error || 'Erreur lors de la mise à jour de l\'agent'
          return false
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour de l\'agent'
        console.error('❌ [Agents] Exception:', error)
        return false
      }
    },

    // ✅ DELETE AGENT
    async deleteAgent(agentId: string): Promise<boolean> {
      try {
        console.log('🤖 [Agents] Suppression agent:', agentId)
        
        const api = useApi()
        const response = await api.agents.delete(agentId)

        if (response.success) {
          // Remove from agents list
          const index = this.agents.findIndex(agent => agent.id === agentId)
          if (index !== -1) {
            this.agents.splice(index, 1)
          }
          
          // Clear current agent if it's the same
          if (this.currentAgent?.id === agentId) {
            this.currentAgent = null
          }
          
          console.log('✅ [Agents] Agent supprimé')
          return true
        } else {
          this.error = response.error || 'Erreur lors de la suppression de l\'agent'
          return false
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression de l\'agent'
        console.error('❌ [Agents] Exception:', error)
        return false
      }
    },

    // ✅ TOGGLE AGENT STATUS
    async toggleAgent(agentId: string, isActive: boolean): Promise<boolean> {
      return await this.updateAgent(agentId, { isActive })
    },

    // ✅ SET CURRENT AGENT
    setCurrentAgent(agent: Agent | null): void {
      this.currentAgent = agent
    },

    // ✅ CLEAR ERROR
    clearError(): void {
      this.error = null
    },

    // ✅ CLEAR DATA - Pour logout
    clearData(): void {
      this.agents = []
      this.currentAgent = null
      this.error = null
      this.lastFetch = null
    },

    // ✅ GET AGENT TYPES
    getAgentTypes(): Array<{ value: string; label: string }> {
      return [
        { value: 'conversion', label: 'Vendeur Conversion Expert' },
        { value: 'product', label: 'Conseiller Produit Avancé' },
        { value: 'support', label: 'Support-Vente' },
        { value: 'premium', label: 'Vendeur Premium/Luxe' },
        { value: 'flash', label: 'Vendeur Flash/Promotions' },
        { value: 'custom', label: 'Agent Personnalisable' }
      ]
    },

    // ✅ GET PERSONALITIES
    getPersonalities(): Array<{ value: string; label: string }> {
      return [
        { value: 'friendly', label: 'Amical' },
        { value: 'professional', label: 'Professionnel' },
        { value: 'expert', label: 'Expert' },
        { value: 'casual', label: 'Décontracté' },
        { value: 'premium', label: 'Premium' },
        { value: 'enthusiastic', label: 'Enthousiaste' }
      ]
    }
  }
})

// ✅ COMPOSABLE POUR ACCÈS FACILE
export const useAgents = () => {
  const agentsStore = useAgentsStore()
  
  return {
    // State
    agents: computed(() => agentsStore.agents),
    currentAgent: computed(() => agentsStore.currentAgent),
    isLoading: computed(() => agentsStore.isLoading),
    isCreating: computed(() => agentsStore.isCreating),
    error: computed(() => agentsStore.error),
    
    // Getters
    activeAgents: computed(() => agentsStore.activeAgents),
    inactiveAgents: computed(() => agentsStore.inactiveAgents),
    totalAgents: computed(() => agentsStore.totalAgents),
    activeCount: computed(() => agentsStore.activeCount),
    
    // Actions
    fetchAgents: agentsStore.fetchAgents,
    createAgent: agentsStore.createAgent,
    updateAgent: agentsStore.updateAgent,
    deleteAgent: agentsStore.deleteAgent,
    toggleAgent: agentsStore.toggleAgent,
    setCurrentAgent: agentsStore.setCurrentAgent,
    clearError: agentsStore.clearError,
    clearData: agentsStore.clearData,
    getAgentTypes: agentsStore.getAgentTypes,
    getPersonalities: agentsStore.getPersonalities,
    
    // Utilities
    getAgentById: agentsStore.getAgentById,
    getAgentsByType: agentsStore.getAgentsByType
  }
}