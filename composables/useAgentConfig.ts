// composables/useAgentConfig.ts - VERSION PRODUCTION SANS MOCKS
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export interface AgentConfig {
  agent: {
    id: string
    name: string
    type: 'general' | 'product_specialist' | 'support' | 'upsell'
    personality: 'professional' | 'friendly' | 'expert' | 'casual'
    description: string | null
    welcomeMessage: string | null
    fallbackMessage: string | null
    avatar: string | null
    isActive: boolean
    config: {
      collectName?: boolean
      collectPhone?: boolean
      collectEmail?: boolean
      collectAddress?: boolean
      collectPayment?: boolean
      upsellEnabled?: boolean
      urgencyEnabled?: boolean
      conversationTone?: string
      responseStyle?: string
      proactiveLevel?: number
      maxConversationTime?: number
      escalationKeywords?: string[]
      customPrompt?: string
      specificInstructions?: string[]
    }
    stats: {
      conversations: number
      conversions: number
    }
  }
  widget: {
    buttonText: string
    primaryColor: string
    position: 'above-cta' | 'below-cta' | 'beside-cta' | 'bottom-right' | 'bottom-left'
    widgetSize: 'small' | 'medium' | 'large'
    theme: 'modern' | 'minimal' | 'brand_adaptive'
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
    animation: 'fade' | 'slide' | 'bounce' | 'none'
    autoOpen: boolean
    showAvatar: boolean
    soundEnabled: boolean
    mobileOptimized: boolean
    offlineMessage?: string
    isActive: boolean
  }
  knowledgeBase: Array<{
    id: string
    title: string
    contentType: string
    isActive: boolean
    tags: string[]
  }>
  integration: {
    shopId: string
    domain?: string
    widgetUrl: string
    apiUrl: string
    jsCode: string
  }
}

export const useAgentConfig = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const agentConfig = ref<AgentConfig | null>(null)

  // ✅ COMPUTED
  const isConfigValid = computed(() => {
    return agentConfig.value?.agent?.name && 
           agentConfig.value?.agent?.welcomeMessage &&
           agentConfig.value?.widget?.buttonText
  })

  const integrationCode = computed(() => {
    if (!agentConfig.value) return ''
    
    const shopId = authStore.userShopId || agentConfig.value.integration.shopId
    const baseUrl = config.public.widgetUrl || 'https://widget.chatseller.app'
    
    return `<script>
(function() {
  var script = document.createElement('script');
  script.src = '${baseUrl}/widget.js';
  script.setAttribute('data-shop-id', '${shopId}');
  script.setAttribute('data-agent-id', '${agentConfig.value.agent.id}');
  script.setAttribute('data-config', '${JSON.stringify({
    buttonText: agentConfig.value.widget.buttonText,
    primaryColor: agentConfig.value.widget.primaryColor,
    position: agentConfig.value.widget.position,
    theme: agentConfig.value.widget.theme,
    autoOpen: agentConfig.value.widget.autoOpen
  })}');
  document.head.appendChild(script);
})();
</script>`
  })

  // ✅ HELPER: Headers avec authentification
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ RÉCUPÉRER LA CONFIGURATION - VERSION PRODUCTION
  const fetchAgentConfig = async (agentId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgentConfig] Récupération configuration agent:', agentId)
      
      // ✅ VALIDATION STRICTE
      if (!agentId || agentId === 'undefined' || agentId === 'null') {
        throw new Error('ID agent invalide')
      }

      if (!authStore.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      // ✅ APPEL API AGENT CONFIG
      const agentResponse = await $fetch(`/api/v1/agents/${agentId}/config`, {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      })

      if (!agentResponse.success) {
        throw new Error(agentResponse.error || 'Erreur lors de la récupération de la configuration agent')
      }

      // ✅ RÉCUPÉRER CONFIG SHOP/WIDGET
      const shopId = authStore.userShopId
      if (!shopId) {
        throw new Error('Shop ID manquant. Configuration utilisateur incomplète.')
      }

      const shopResponse = await $fetch(`/api/v1/shops/${shopId}`, {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      })

      // ✅ CONSTRUIRE CONFIG COMPLÈTE VALIDÉE
      const completeConfig: AgentConfig = {
        agent: {
          id: agentResponse.data.agent.id,
          name: agentResponse.data.agent.name,
          type: agentResponse.data.agent.type,
          personality: agentResponse.data.agent.personality,
          description: agentResponse.data.agent.description,
          welcomeMessage: agentResponse.data.agent.welcomeMessage,
          fallbackMessage: agentResponse.data.agent.fallbackMessage,
          avatar: agentResponse.data.agent.avatar,
          isActive: agentResponse.data.agent.isActive,
          config: agentResponse.data.agent.config || {},
          stats: {
            conversations: agentResponse.data.agent.totalConversations || 0,
            conversions: agentResponse.data.agent.totalConversions || 0
          }
        },
        widget: {
          buttonText: shopResponse.widget_config?.buttonText || 'Parler à un conseiller',
          primaryColor: shopResponse.widget_config?.primaryColor || '#007AFF',
          position: shopResponse.widget_config?.position || 'above-cta',
          widgetSize: shopResponse.widget_config?.widgetSize || 'medium',
          theme: shopResponse.widget_config?.theme || 'modern',
          borderRadius: shopResponse.widget_config?.borderRadius || 'md',
          animation: shopResponse.widget_config?.animation || 'fade',
          autoOpen: shopResponse.widget_config?.autoOpen || false,
          showAvatar: shopResponse.widget_config?.showAvatar || true,
          soundEnabled: shopResponse.widget_config?.soundEnabled || true,
          mobileOptimized: shopResponse.widget_config?.mobileOptimized || true,
          offlineMessage: shopResponse.widget_config?.offlineMessage,
          isActive: shopResponse.widget_config?.isActive || true
        },
        knowledgeBase: agentResponse.data.knowledgeBase || [],
        integration: {
          shopId: shopId,
          domain: shopResponse.domain,
          widgetUrl: config.public.widgetUrl || 'https://widget.chatseller.app',
          apiUrl: config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app',
          jsCode: ''
        }
      }

      agentConfig.value = completeConfig
      console.log('✅ [useAgentConfig] Configuration chargée avec succès')
      return { success: true, data: completeConfig }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur fetchAgentConfig:', err)
      error.value = err.message || 'Erreur lors de la récupération de la configuration'
      
      // ✅ PAS DE FALLBACK MOCKÉS EN PRODUCTION
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ SAUVEGARDER CONFIGURATION COMPLÈTE - VERSION PRODUCTION
  const saveCompleteConfig = async (agentId: string, updates: Partial<AgentConfig>) => {
    saving.value = true
    error.value = null

    try {
      const results = []

      // ✅ VALIDATION AVANT SAUVEGARDE
      if (!authStore.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      if (!agentId) {
        throw new Error('ID agent manquant')
      }

      // Sauvegarder agent si fourni
      if (updates.agent) {
        console.log('💾 Sauvegarde configuration agent...')
        const agentResult = await $fetch(`/api/v1/agents/${agentId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: updates.agent
        })

        if (!agentResult.success) {
          throw new Error(`Erreur agent: ${agentResult.error}`)
        }
        
        results.push(agentResult)
      }

      // Sauvegarder widget si fourni
      if (updates.widget) {
        console.log('🎨 Sauvegarde configuration widget...')
        const shopId = authStore.userShopId
        if (!shopId) {
          throw new Error('Shop ID manquant pour sauvegarder le widget')
        }

        const widgetResult = await $fetch(`/api/v1/shops/${shopId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: {
            widget_config: updates.widget
          }
        })

        results.push({ success: true, data: widgetResult })
      }

      // ✅ RECHARGER LA CONFIG APRÈS SAUVEGARDE
      await fetchAgentConfig(agentId)
      
      console.log('✅ Configuration complète sauvegardée et rechargée')
      return { success: true, message: 'Configuration sauvegardée avec succès' }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur saveCompleteConfig:', err)
      error.value = err.message || 'Erreur lors de la sauvegarde'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ TESTER LA CONNEXION API
  const testApiConnection = async () => {
    try {
      const response = await $fetch('/health', {
        baseURL: config.public.apiBaseUrl
      })
      
      return { 
        success: true, 
        data: response,
        message: 'API accessible' 
      }
    } catch (err: any) {
      return { 
        success: false, 
        error: err.message,
        message: 'API inaccessible' 
      }
    }
  }

  // ✅ COPIER LE CODE D'INTÉGRATION
  const copyIntegrationCode = async () => {
    try {
      if (!integrationCode.value) {
        throw new Error('Configuration incomplète pour générer le code')
      }

      await navigator.clipboard.writeText(integrationCode.value)
      return { success: true, message: 'Code d\'intégration copié!' }
    } catch (err: any) {
      console.error('❌ Erreur copie:', err)
      return { success: false, error: 'Impossible de copier le code' }
    }
  }

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    agentConfig: readonly(agentConfig),

    // Computed
    isConfigValid,
    integrationCode,

    // Actions
    fetchAgentConfig,
    saveCompleteConfig,
    testApiConnection,
    copyIntegrationCode,
    clearError
  }
}