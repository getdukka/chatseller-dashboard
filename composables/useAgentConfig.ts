// composables/useAgentConfig.ts - VERSION CORRIGÉE AVEC CODE D'INTÉGRATION FONCTIONNEL
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
      linkedKnowledgeBase?: string[]
      aiProvider?: 'openai' | 'claude'
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
      tone?: string
    }
    stats: {
      conversations: number
      conversions: number
    }
    knowledgeBase?: Array<{
      id: string
      title: string
      contentType: string
      isActive: boolean
      tags: string[]
    }>
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
    language: 'fr' | 'en' | 'wo'
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
  const widgetSyncStatus = ref<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  // ✅ COMPUTED POUR VALIDATION
  const isConfigValid = computed(() => {
    return agentConfig.value?.agent?.name && 
           agentConfig.value?.agent?.welcomeMessage &&
           agentConfig.value?.widget?.buttonText
  })

  // ✅ NOUVEAU COMPUTED POUR CODE D'INTÉGRATION - VERSION ROBUSTE
  const integrationCode = computed(() => {
    // Vérifier si les données minimales sont disponibles
    if (!agentConfig.value?.agent?.id || !agentConfig.value?.agent?.name) {
      return '<!-- Chargement de la configuration... -->'
    }

    try {
      const shopId = authStore.user?.id || authStore.userShopId || 'demo-shop'
      const agentId = agentConfig.value.agent.id
      const agentName = agentConfig.value.agent.name
      const buttonText = agentConfig.value.widget?.buttonText || 'Parler à un conseiller'
      const primaryColor = agentConfig.value.widget?.primaryColor || '#3B82F6'
      const position = agentConfig.value.widget?.position || 'above-cta'
      const theme = agentConfig.value.widget?.theme || 'modern'
      const language = agentConfig.value.widget?.language || 'fr'
      
      const baseUrl = config.public.widgetUrl || 'https://widget.chatseller.app'
      const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

      return `<!-- ChatSeller Widget - Agent: ${agentName} -->
<script>
(function() {
  // Configuration du widget ChatSeller
  window.ChatSellerConfig = {
    shopId: '${shopId}',
    agentId: '${agentId}',
    apiUrl: '${apiUrl}',
    buttonText: '${buttonText}',
    primaryColor: '${primaryColor}',
    position: '${position}',
    theme: '${theme}',
    language: '${language}',
    autoDetectProduct: true,
    debug: false,
    agentConfig: {
      id: '${agentId}',
      name: '${agentName}',
      title: '${getTypeLabel(agentConfig.value.agent.type)}',
      welcomeMessage: '${agentConfig.value.agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?'}',
      fallbackMessage: '${agentConfig.value.agent.fallbackMessage || 'Un instant, je transmets votre question à notre équipe.'}',
      personality: '${agentConfig.value.agent.personality || 'friendly'}'
    }
  };
  
  // Chargement asynchrone du widget
  var script = document.createElement('script');
  script.src = '${baseUrl}/embed.js';
  script.async = true;
  script.onload = function() {
    console.log('✅ ChatSeller widget chargé avec succès');
    if (window.ChatSeller && window.ChatSeller.init) {
      window.ChatSeller.init(window.ChatSellerConfig);
    }
  };
  script.onerror = function() {
    console.error('❌ Erreur lors du chargement du widget ChatSeller');
  };
  
  // Injecter le script dans le head
  document.head.appendChild(script);
})();
</script>
<!-- Fin du code ChatSeller -->`

    } catch (error) {
      console.error('❌ Erreur génération code intégration:', error)
      return `<!-- Erreur lors de la génération du code d'intégration -->`
    }
  })

  // ✅ HELPER POUR LES LABELS DE TYPE
  const getTypeLabel = (type: string): string => {
    const labels = {
      general: 'Vendeur généraliste',
      product_specialist: 'Spécialiste produit',
      support: 'Support & SAV',
      upsell: 'Upsell & Cross-sell'
    }
    return labels[type as keyof typeof labels] || 'Assistant commercial'
  }

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

  // ✅ RÉCUPÉRER LA CONFIGURATION - VERSION AMÉLIORÉE
  const fetchAgentConfig = async (agentId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgentConfig] Récupération configuration agent:', agentId)
      
      if (!agentId || agentId === 'undefined' || agentId === 'null') {
        throw new Error('ID agent invalide')
      }

      if (!authStore.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      // ✅ RÉCUPÉRATION CONFIGURATION AGENT + KNOWLEDGE BASE
      const [agentResponse, kbResponse] = await Promise.all([
        $fetch(`/api/v1/agents/${agentId}/config`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }),
        $fetch(`/api/v1/agents/${agentId}/knowledge`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }).catch(() => ({ success: true, data: [] }))
      ])

      if (!agentResponse.success) {
        throw new Error(agentResponse.error || 'Erreur lors de la récupération de la configuration agent')
      }

      // ✅ RÉCUPÉRER CONFIG SHOP/WIDGET
      const shopId = authStore.user?.id || authStore.userShopId
      if (!shopId) {
        console.warn('⚠️ Shop ID manquant, utilisation config par défaut')
      }

      let shopResponse = null
      if (shopId) {
        try {
          shopResponse = await $fetch(`/api/v1/shops/${shopId}`, {
            baseURL: config.public.apiBaseUrl,
            headers: getAuthHeaders()
          })
        } catch (shopError) {
          console.warn('⚠️ Erreur récupération shop, utilisation config par défaut:', shopError)
        }
      }

      // ✅ CONSTRUIRE CONFIG COMPLÈTE AVEC FALLBACKS
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
          config: {
            ...agentResponse.data.agent.config,
            linkedKnowledgeBase: kbResponse.data?.map((kb: any) => kb.id) || [],
            aiProvider: agentResponse.data.agent.config?.aiProvider || 'openai',
            temperature: agentResponse.data.agent.config?.temperature || 0.7,
            maxTokens: agentResponse.data.agent.config?.maxTokens || 1000,
            systemPrompt: agentResponse.data.agent.config?.systemPrompt || '',
            tone: agentResponse.data.agent.config?.tone || 'friendly'
          },
          stats: {
            conversations: agentResponse.data.agent.totalConversations || 0,
            conversions: agentResponse.data.agent.totalConversions || 0
          },
          knowledgeBase: kbResponse.data || []
        },
        widget: {
          buttonText: shopResponse?.widget_config?.buttonText || 'Parler à un conseiller',
          primaryColor: shopResponse?.widget_config?.primaryColor || '#3B82F6',
          position: shopResponse?.widget_config?.position || 'above-cta',
          widgetSize: shopResponse?.widget_config?.widgetSize || 'medium',
          theme: shopResponse?.widget_config?.theme || 'modern',
          borderRadius: shopResponse?.widget_config?.borderRadius || 'md',
          animation: shopResponse?.widget_config?.animation || 'fade',
          autoOpen: shopResponse?.widget_config?.autoOpen || false,
          showAvatar: shopResponse?.widget_config?.showAvatar !== false,
          soundEnabled: shopResponse?.widget_config?.soundEnabled !== false,
          mobileOptimized: shopResponse?.widget_config?.mobileOptimized !== false,
          offlineMessage: shopResponse?.widget_config?.offlineMessage,
          isActive: shopResponse?.widget_config?.isActive !== false,
          language: shopResponse?.widget_config?.language || 'fr'
        },
        knowledgeBase: agentResponse.data.knowledgeBase || [],
        integration: {
          shopId: shopId || 'demo-shop',
          domain: shopResponse?.domain,
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
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ NOUVEAU : LIER DOCUMENTS DE BASE DE CONNAISSANCES
  const linkKnowledgeBaseDocuments = async (agentId: string, documentIds: string[]) => {
    saving.value = true
    error.value = null

    try {
      console.log('🔗 [useAgentConfig] Liaison documents KB:', documentIds.length)
      
      const response = await $fetch(`/api/v1/agents/${agentId}/knowledge`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { knowledgeBaseIds: documentIds }
      })

      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de la liaison')
      }

      // ✅ METTRE À JOUR CONFIG LOCALE
      if (agentConfig.value) {
        agentConfig.value.agent.config.linkedKnowledgeBase = documentIds
      }

      console.log('✅ [useAgentConfig] Documents KB liés avec succès')
      return { success: true }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur linkKnowledgeBase:', err)
      error.value = err.message || 'Erreur lors de la liaison des documents'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ SAUVEGARDER CONFIGURATION COMPLÈTE AVEC SYNC WIDGET
  const saveCompleteConfig = async (agentId: string, updates: Partial<AgentConfig>) => {
    saving.value = true
    widgetSyncStatus.value = 'syncing'
    error.value = null

    try {
      const results = []

      if (!authStore.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      if (!agentId) {
        throw new Error('ID agent manquant')
      }

      // ✅ SAUVEGARDER AGENT SI FOURNI
      if (updates.agent) {
        console.log('💾 Sauvegarde configuration agent...')
        
        const agentResult = await $fetch(`/api/v1/agents/${agentId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: {
            ...updates.agent,
            config: {
              ...updates.agent.config,
              aiProvider: updates.agent.config?.aiProvider || 'openai',
              temperature: updates.agent.config?.temperature || 0.7,
              maxTokens: updates.agent.config?.maxTokens || 1000
            }
          }
        })

        if (!agentResult.success) {
          throw new Error(`Erreur agent: ${agentResult.error}`)
        }
        
        results.push(agentResult)
      }

      // ✅ SAUVEGARDER WIDGET SI FOURNI
      if (updates.widget) {
        console.log('🎨 Sauvegarde configuration widget...')
        const shopId = authStore.user?.id || authStore.userShopId
        if (!shopId) {
          console.warn('⚠️ Shop ID manquant pour sauvegarder le widget, on continue')
        } else {
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
      }

      // ✅ LIER DOCUMENTS KB SI FOURNI
      if (updates.agent?.config?.linkedKnowledgeBase) {
        await linkKnowledgeBaseDocuments(agentId, updates.agent.config.linkedKnowledgeBase)
      }

      // ✅ METTRE À JOUR LA CONFIG LOCALE POUR RAFRAÎCHIR LE CODE D'INTÉGRATION
      if (agentConfig.value) {
        if (updates.agent) {
          agentConfig.value.agent = { ...agentConfig.value.agent, ...updates.agent }
        }
        if (updates.widget) {
          agentConfig.value.widget = { ...agentConfig.value.widget, ...updates.widget }
        }
      }

      widgetSyncStatus.value = 'synced'
      console.log('✅ Configuration complète sauvegardée et synchronisée')
      return { success: true, message: 'Configuration sauvegardée avec succès' }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur saveCompleteConfig:', err)
      error.value = err.message || 'Erreur lors de la sauvegarde'
      widgetSyncStatus.value = 'error'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
      // Reset sync status après 3 secondes
      setTimeout(() => {
        if (widgetSyncStatus.value !== 'error') {
          widgetSyncStatus.value = 'idle'
        }
      }, 3000)
    }
  }

  // ✅ NOUVEAU : TESTER L'IA EN TEMPS RÉEL
  const testAIMessage = async (message: string, agentId: string) => {
    try {
      const response = await $fetch('/api/v1/chat/test', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          message,
          agentId,
          shopId: authStore.user?.id || authStore.userShopId,
          testMode: true
        }
      })

      if (response.success) {
        return {
          success: true,
          message: response.data.message,
          provider: response.data.provider || 'openai',
          responseTime: response.data.responseTime || 0
        }
      } else {
        throw new Error(response.error || 'Erreur lors du test IA')
      }
    } catch (error: any) {
      console.error('❌ Erreur test IA:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors du test IA'
      }
    }
  }

  // ✅ COPIER LE CODE D'INTÉGRATION
  const copyIntegrationCode = async () => {
    try {
      if (!integrationCode.value) {
        throw new Error('Code d\'intégration non disponible')
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
    if (widgetSyncStatus.value === 'error') {
      widgetSyncStatus.value = 'idle'
    }
  }

  return {
    // State
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    agentConfig: readonly(agentConfig),
    widgetSyncStatus: readonly(widgetSyncStatus),

    // Computed
    isConfigValid,
    integrationCode,

    // Actions
    fetchAgentConfig,
    saveCompleteConfig,
    linkKnowledgeBaseDocuments,
    testAIMessage,
    copyIntegrationCode,
    clearError
  }
}