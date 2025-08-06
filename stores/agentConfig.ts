// stores/agentConfig.ts - STORE TEMPORAIRE POUR CONFIGURATION AGENT
import { defineStore } from 'pinia'

export interface AgentConfigData {
  id: string
  name: string
  type: string
  personality?: string
  description?: string
  welcomeMessage?: string
  fallbackMessage?: string
  avatar?: string
  isActive: boolean
  config?: any
  stats?: any
  sourceComponent?: string 
  knowledgeBase?: any[]
}

export const useAgentConfigStore = defineStore('agentConfig', {
  state: () => ({
    currentAgent: null as AgentConfigData | null,
    navigationSource: '' as string,
    timestamp: null as number | null
  }),

  getters: {
    hasValidAgent: (state): boolean => {
      return !!(state.currentAgent && state.currentAgent.id && state.currentAgent.name)
    },

    isDataFresh: (state): boolean => {
      if (!state.timestamp) return false
      // Les données sont valides pendant 5 minutes
      return (Date.now() - state.timestamp) < 5 * 60 * 1000
    }
  },

  actions: {
    setAgentForConfig(agent: AgentConfigData, source: string = 'vendeurs-ia') {
      console.log('📦 Store AgentConfig: Sauvegarde agent pour configuration:', agent.name, agent.id)
      
      this.currentAgent = {
        ...agent,
        sourceComponent: source
      }
      this.navigationSource = source
      this.timestamp = Date.now()
      
      // Sauvegarde temporaire dans localStorage pour backup
      if (process.client) {
        try {
          localStorage.setItem('chatseller_temp_agent_config', JSON.stringify({
            agent: this.currentAgent,
            timestamp: this.timestamp
          }))
        } catch (error) {
          console.warn('⚠️ Impossible de sauvegarder dans localStorage:', error)
        }
      }
    },

    getAgentForConfig(): AgentConfigData | null {
      // Essayer d'abord le store
      if (this.hasValidAgent && this.isDataFresh) {
        console.log('✅ Store AgentConfig: Données agent récupérées depuis store')
        return this.currentAgent
      }

      // Fallback : récupération depuis localStorage
      if (process.client) {
        try {
          const saved = localStorage.getItem('chatseller_temp_agent_config')
          if (saved) {
            const data = JSON.parse(saved)
            const age = Date.now() - data.timestamp
            
            if (age < 5 * 60 * 1000 && data.agent) { // 5 minutes max
              console.log('✅ Store AgentConfig: Données agent récupérées depuis localStorage')
              this.currentAgent = data.agent
              this.timestamp = data.timestamp
              return this.currentAgent
            } else {
              console.log('🕐 Store AgentConfig: Données localStorage expirées, nettoyage')
              localStorage.removeItem('chatseller_temp_agent_config')
            }
          }
        } catch (error) {
          console.warn('⚠️ Erreur lecture localStorage:', error)
        }
      }

      console.log('❌ Store AgentConfig: Aucune donnée agent valide trouvée')
      return null
    },

    clearAgentConfig() {
      console.log('🧹 Store AgentConfig: Nettoyage données agent')
      this.currentAgent = null
      this.navigationSource = ''
      this.timestamp = null
      
      if (process.client) {
        try {
          localStorage.removeItem('chatseller_temp_agent_config')
        } catch (error) {
          console.warn('⚠️ Erreur nettoyage localStorage:', error)
        }
      }
    },

    // Méthode utilitaire pour récupérer l'agent depuis l'API si nécessaire
    async fetchAgentIfNeeded(agentId: string) {
      if (this.hasValidAgent && this.currentAgent?.id === agentId && this.isDataFresh) {
        return this.currentAgent
      }

      try {
        console.log('🔄 Store AgentConfig: Récupération agent depuis API:', agentId)
        
        // Utiliser le composable useAgents pour récupérer les données
        // Cette méthode sera appelée depuis le composant si nécessaire
        return null
      } catch (error) {
        console.error('❌ Store AgentConfig: Erreur récupération agent:', error)
        return null
      }
    }
  }
})