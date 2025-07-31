// composables/useAgentConfig.ts - VERSION SIMPLIFIÉE ET CORRIGÉE
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES SIMPLIFIÉS
export interface AgentConfig {
  agent: {
    id: string
    name: string
    type: string
    personality: string
    description: string | null
    welcomeMessage: string | null
    fallbackMessage: string | null
    avatar: string | null
    isActive: boolean
    config: Record<string, any>
    stats: {
      conversations: number
      conversions: number
    }
  }
  knowledgeBase: Array<{
    id: string
    title: string
    contentType: string
    isActive: boolean
    tags: string[]
  }>
}

// ✅ COMPOSABLE PRINCIPAL SIMPLIFIÉ
export const useAgentConfig = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const agentConfig = ref<AgentConfig | null>(null)

  // ✅ HELPER: Headers avec authentification
  const getAuthHeaders = () => {
    if (!authStore.token) {
      console.warn('⚠️ [useAgentConfig] Pas de token disponible, mode développement')
      return {
        'Content-Type': 'application/json'
      }
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ RÉCUPÉRER LA CONFIGURATION D'UN AGENT - SIMPLIFIÉ
  const fetchAgentConfig = async (agentId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgentConfig] Récupération configuration agent:', agentId)
      
      // ✅ VALIDATION DE L'ID
      if (!agentId || agentId === 'undefined' || agentId === 'null') {
        throw new Error('ID agent invalide: ' + agentId)
      }
      
      // ✅ DONNÉES MOCKÉES POUR DÉVELOPPEMENT
      const mockConfig: AgentConfig = {
        agent: {
          id: agentId,
          name: 'Rose - Vendeuse IA',
          type: 'general',
          personality: 'friendly',
          description: 'Assistante d\'achat spécialisée dans la vente de produits.',
          welcomeMessage: 'Bonjour ! Je suis Rose, votre assistante d\'achat. Comment puis-je vous aider aujourd\'hui ?',
          fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
          avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
          isActive: true,
          config: {
            collectName: true,
            collectPhone: true,
            collectAddress: false,
            collectPayment: true,
            upsellEnabled: false
          },
          stats: {
            conversations: 47,
            conversions: 12
          }
        },
        knowledgeBase: [
          {
            id: 'kb_001',
            title: 'Catalogue produits 2024',
            contentType: 'file',
            isActive: true,
            tags: ['produits', 'catalogue', '2024']
          },
          {
            id: 'kb_002',
            title: 'FAQ Support Client',
            contentType: 'manual',
            isActive: true,
            tags: ['faq', 'support', 'client']
          }
        ]
      }
      
      agentConfig.value = mockConfig
      console.log('✅ [useAgentConfig] Configuration mockée chargée pour:', mockConfig.agent.name)
      return { success: true, data: mockConfig }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur fetchAgentConfig:', err)
      error.value = err.message || 'Erreur lors de la récupération de la configuration'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ METTRE À JOUR LA CONFIGURATION - SIMPLIFIÉ
  const updateAgentConfig = async (agentId: string, configData: any) => {
    saving.value = true
    error.value = null

    try {
      console.log('💾 Mise à jour configuration agent:', agentId, configData)
      
      // ✅ SIMULATION DE SUCCÈS POUR LE DÉVELOPPEMENT
      if (agentConfig.value) {
        agentConfig.value.agent.config = { ...agentConfig.value.agent.config, ...configData }
      }
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('✅ Configuration simulée mise à jour')
      return { 
        success: true, 
        data: { 
          id: agentId, 
          config: configData, 
          updatedAt: new Date().toISOString() 
        } 
      }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur updateAgentConfig:', err)
      error.value = err.message || 'Erreur lors de la mise à jour'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ COPIER LE CODE D'INTÉGRATION
  const copyIntegrationCode = async (agentId: string, shopId: string) => {
    try {
      const code = `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-agent-id', '${agentId}');
  script.setAttribute('data-shop-id', '${shopId}');
  script.setAttribute('data-version', '2.0');
  document.head.appendChild(script);
})();
</script>`
      
      await navigator.clipboard.writeText(code)
      return { success: true, message: 'Code d\'intégration copié dans le presse-papier !' }
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
      return { success: false, error: 'Impossible de copier le code' }
    }
  }

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES
  return {
    // State
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    agentConfig: readonly(agentConfig),

    // Actions principales
    fetchAgentConfig,
    updateAgentConfig,
    copyIntegrationCode,
    clearError
  }
}