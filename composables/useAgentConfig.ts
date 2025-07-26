// composables/useAgentConfig.ts - COMPOSABLE CONFIGURATION AGENT
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES
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
  }
  knowledgeBase: Array<{
    id: string
    title: string
    contentType: string
    isActive: boolean
    tags: string[]
  }>
}

export interface AgentConfigUpdate {
  collectName?: boolean
  collectPhone?: boolean
  collectAddress?: boolean
  collectPayment?: boolean
  upsellEnabled?: boolean
  [key: string]: any
}

interface ConfigResponse {
  success: boolean
  data: AgentConfig
}

interface UpdateResponse {
  success: boolean
  data: {
    id: string
    config: Record<string, any>
    updatedAt: string
  }
}

interface ErrorResponse {
  error: string
  details?: any
}

// ✅ COMPOSABLE PRINCIPAL
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
      throw new Error('Token d\'authentification manquant')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ HELPER: Gestion des erreurs API
  const handleApiError = (err: any, defaultMessage: string) => {
    console.error('❌ API Error:', err)
    
    let errorMessage = defaultMessage
    
    if (err.data?.error && typeof err.data.error === 'string') {
      errorMessage = err.data.error
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = err.message
    } else if (err.statusText && typeof err.statusText === 'string') {
      errorMessage = `Erreur ${err.status || 'API'}: ${err.statusText}`
    }
    
    error.value = errorMessage
    return { success: false, error: errorMessage }
  }

  // ✅ RÉCUPÉRER LA CONFIGURATION D'UN AGENT
  const fetchAgentConfig = async (agentId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 Récupération configuration agent:', agentId)
      
      const response = await $fetch(`/api/v1/agents/${agentId}/config`, {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ConfigResponse

      if (response.success) {
        agentConfig.value = response.data
        console.log(`✅ Configuration agent récupérée:`, response.data.agent.name)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la récupération de la configuration')
    } finally {
      loading.value = false
    }
  }

  // ✅ METTRE À JOUR LA CONFIGURATION D'UN AGENT
  const updateAgentConfig = async (agentId: string, configData: AgentConfigUpdate) => {
    saving.value = true
    error.value = null

    try {
      console.log('💾 Mise à jour configuration agent:', agentId)
      
      const response = await $fetch(`/api/v1/agents/${agentId}/config`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { config: configData }
      }) as UpdateResponse

      if (response.success) {
        // Mettre à jour la configuration locale
        if (agentConfig.value) {
          agentConfig.value.agent.config = response.data.config
        }
        
        console.log(`✅ Configuration agent mise à jour:`, agentId)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la mise à jour de la configuration')
    } finally {
      saving.value = false
    }
  }

  // ✅ LIER UN AGENT À DES DOCUMENTS DE BASE DE CONNAISSANCE
  const linkKnowledgeBase = async (agentId: string, knowledgeBaseIds: string[]) => {
    saving.value = true
    error.value = null

    try {
      console.log('🔗 Liaison base de connaissance:', agentId, knowledgeBaseIds)
      
      const response = await $fetch(`/api/v1/agents/${agentId}/knowledge`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { knowledgeBaseIds }
      }) as { success: boolean; message: string }

      if (response.success) {
        console.log(`✅ Base de connaissance liée:`, agentId)
        return { success: true, message: response.message }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la liaison de la base de connaissance')
    } finally {
      saving.value = false
    }
  }

  // ✅ RÉCUPÉRER LA BASE DE CONNAISSANCE DISPONIBLE
  const fetchAvailableKnowledge = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('📚 Récupération base de connaissance disponible...')
      
      // TODO: Implémenter l'endpoint pour récupérer la base de connaissance
      // const response = await $fetch('/api/v1/knowledge-base', {
      //   baseURL: config.public.apiBaseUrl,
      //   headers: getAuthHeaders()
      // })

      // Pour l'instant, retourner un mock
      const mockKnowledge = [
        {
          id: '1',
          title: 'Catalogue produits',
          contentType: 'manual',
          isActive: true,
          tags: ['produits', 'catalogue']
        },
        {
          id: '2',
          title: 'FAQ Support',
          contentType: 'manual',
          isActive: true,
          tags: ['faq', 'support']
        }
      ]

      return { success: true, data: mockKnowledge }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la récupération de la base de connaissance')
    } finally {
      loading.value = false
    }
  }

  // ✅ GÉNÉRER LE CODE D'INTÉGRATION
  const generateIntegrationCode = (agentId: string, shopId: string) => {
    return `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-agent-id', '${agentId}');
  script.setAttribute('data-shop-id', '${shopId}');
  document.head.appendChild(script);
})();
</script>`
  }

  // ✅ COPIER LE CODE D'INTÉGRATION
  const copyIntegrationCode = async (agentId: string, shopId: string) => {
    try {
      const code = generateIntegrationCode(agentId, shopId)
      await navigator.clipboard.writeText(code)
      return { success: true, message: 'Code copié dans le presse-papier !' }
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
      return { success: false, error: 'Impossible de copier le code' }
    }
  }

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  // ✅ RÉINITIALISER LA CONFIGURATION
  const clearConfig = () => {
    agentConfig.value = null
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES ET PROPRIÉTÉS
  return {
    // State
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    agentConfig: readonly(agentConfig),

    // Actions
    fetchAgentConfig,
    updateAgentConfig,
    linkKnowledgeBase,
    fetchAvailableKnowledge,
    generateIntegrationCode,
    copyIntegrationCode,

    // Helpers
    clearError,
    clearConfig
  }
}