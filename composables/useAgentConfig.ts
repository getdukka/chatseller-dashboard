// composables/useAgentConfig.ts - VERSION CORRIGÉE AVEC PERSISTANCE WIDGET
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAgentConfigStore } from '~/stores/agentConfig'

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
}

export const useAgentConfig = () => {
  const authStore = useAuthStore()
  const agentConfigStore = useAgentConfigStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const agentConfig = ref<AgentConfig | null>(null)
  const widgetSyncStatus = ref<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  // ✅ COMPUTED POUR VALIDATION
  const isConfigValid = computed(() => {
    const hasAgentData = agentConfig.value?.agent?.name && agentConfig.value?.agent?.id
    const hasStoreData = agentConfigStore.hasValidAgent
    const hasWidgetData = agentConfig.value?.widget?.buttonText
    
    return hasAgentData || hasStoreData || hasWidgetData
  })

  // ✅ COMPUTED POUR CODE D'INTÉGRATION - VERSION CORRIGÉE SHOPIFY
  const integrationCode = computed(() => {
    console.log('🔧 [integrationCode] Génération du code d\'intégration...')
    
    // ✅ RÉCUPÉRATION DONNÉES MULTIPLES SOURCES
    let agentData = null
    let agentId = ''
    let agentName = ''
    let widgetData = null
    
    // Source 1: agentConfig (API)
    if (agentConfig.value?.agent?.id && agentConfig.value?.agent?.name) {
      agentData = agentConfig.value.agent
      widgetData = agentConfig.value.widget
      agentId = agentData.id
      agentName = agentData.name
      console.log('✅ [integrationCode] Données depuis agentConfig API')
    }
    // Source 2: agentConfigStore (store temporaire)
    else if (agentConfigStore.hasValidAgent) {
      const storeAgent = agentConfigStore.getAgentForConfig()
      if (storeAgent) {
        agentId = storeAgent.id
        agentName = storeAgent.name
        console.log('✅ [integrationCode] Données depuis agentConfigStore')
        
        // Construire un objet minimal
        agentData = {
          id: storeAgent.id,
          name: storeAgent.name,
          type: storeAgent.type,
          personality: storeAgent.personality || 'friendly',
          welcomeMessage: storeAgent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?',
          fallbackMessage: storeAgent.fallbackMessage || 'Un instant, je transmets votre question à notre équipe.'
        }
        
        widgetData = {
          buttonText: 'Parler à un conseiller',
          primaryColor: '#3B82F6',
          position: 'above-cta',
          theme: 'modern',
          language: 'fr'
        }
      }
    }
    
    // ✅ SI AUCUNE DONNÉE, RETOURNER MESSAGE DE CHARGEMENT
    if (!agentData || !agentId || !agentName) {
      console.warn('⚠️ [integrationCode] Données agent manquantes pour générer le code')
      return '<!-- ⏳ Chargement de la configuration de l\'agent... Veuillez patienter ou actualiser la page. -->'
    }

    try {
      // ✅ CONFIGURATION AVEC FALLBACKS ROBUSTES
      const shopId = authStore.user?.id || authStore.userShopId || 'demo-shop'
      const buttonText = widgetData?.buttonText || 'Parler à un conseiller'
      const primaryColor = widgetData?.primaryColor || '#3B82F6'
      const position = widgetData?.position || 'above-cta'
      const theme = widgetData?.theme || 'modern'
      const language = widgetData?.language || 'fr'
      
      // ✅ URLS SELON L'ENVIRONNEMENT - CORRIGÉES POUR SHOPIFY
      const baseUrl = config.public.widgetUrl || 'https://widget.chatseller.app'
      const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

      console.log('✅ [integrationCode] Configuration finale:', {
        shopId,
        agentId,
        agentName,
        buttonText,
        primaryColor,
        baseUrl,
        apiUrl
      })

      // ✅ CODE D'INTÉGRATION OPTIMISÉ SHOPIFY
      return `<!-- 🤖 ChatSeller Widget - Agent: ${agentName} -->
<script>
(function() {
  // Configuration du widget ChatSeller
  window.ChatSellerConfig = {
    shopId: '${shopId}',
    agentId: '${agentId}',
    apiUrl: '${apiUrl}',
    buttonText: '${buttonText.replace(/'/g, "\\'")}',
    primaryColor: '${primaryColor}',
    position: '${position}',
    theme: '${theme}',
    language: '${language}',
    autoDetectProduct: true,
    debug: false,
    agentConfig: {
      id: '${agentId}',
      name: '${agentName.replace(/'/g, "\\'")}',
      title: '${getTypeLabel(agentData.type)}',
      welcomeMessage: '${(agentData.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?').replace(/'/g, "\\'")}',
      fallbackMessage: '${(agentData.fallbackMessage || 'Un instant, je transmets votre question à notre équipe.').replace(/'/g, "\\'")}',
      personality: '${agentData.personality || 'friendly'}'
    }
  };
  
  // Fonction de chargement du widget avec retry automatique
  function loadChatSellerWidget() {
    console.log('🚀 ChatSeller: Début chargement widget...');
    
    var script = document.createElement('script');
    script.src = '${baseUrl}/embed.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = function() {
      console.log('✅ ChatSeller: Script chargé avec succès');
      
      // Attendre que ChatSeller soit disponible
      var maxAttempts = 20;
      var attempts = 0;
      
      function initChatSeller() {
        attempts++;
        
        if (window.ChatSeller && typeof window.ChatSeller.init === 'function') {
          console.log('✅ ChatSeller: Initialisation du widget...');
          
          try {
            window.ChatSeller.init(window.ChatSellerConfig);
            console.log('✅ ChatSeller: Widget initialisé avec succès');
          } catch (error) {
            console.error('❌ ChatSeller: Erreur lors de l\'initialisation:', error);
          }
          
        } else if (attempts < maxAttempts) {
          console.log('⏳ ChatSeller: En attente du SDK... (' + attempts + '/' + maxAttempts + ')');
          setTimeout(initChatSeller, 100);
          
        } else {
          console.error('❌ ChatSeller: Timeout - SDK non disponible après ' + (maxAttempts * 100) + 'ms');
        }
      }
      
      // Démarrer l'initialisation
      initChatSeller();
    };
    
    script.onerror = function(error) {
      console.error('❌ ChatSeller: Erreur lors du chargement du script:', error);
      console.log('🔄 ChatSeller: Tentative de rechargement dans 3 secondes...');
      
      setTimeout(function() {
        console.log('🔄 ChatSeller: Nouvelle tentative de chargement...');
        loadChatSellerWidget();
      }, 3000);
    };
    
    // Injecter le script dans le document
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }
  
  // Démarrer le chargement quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChatSellerWidget);
  } else {
    // DOM déjà prêt
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      // Petite pause pour s'assurer que Shopify est bien initialisé
      setTimeout(loadChatSellerWidget, 500);
    } else {
      loadChatSellerWidget();
    }
  }
  
  // Fallback de sécurité
  setTimeout(function() {
    if (!window.ChatSeller) {
      console.log('🔄 ChatSeller: Fallback - Force loading after 5s');
      loadChatSellerWidget();
    }
  }, 5000);
  
})();
</script>
<!-- 🚀 Fin du code ChatSeller - Support: support@chatseller.app -->`

    } catch (error) {
      console.error('❌ [integrationCode] Erreur génération code intégration:', error)
      return `<!-- ❌ Erreur lors de la génération du code d'intégration. Veuillez contacter le support. -->`
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

  // ✅ RÉCUPÉRER LA CONFIGURATION - VERSION CORRIGÉE
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

      // ✅ RÉCUPÉRATION CONFIG AGENT + SHOP WIDGET EN PARALLÈLE
      const shopId = authStore.user?.id || authStore.userShopId
      
      const [agentResponse, shopResponse, kbResponse] = await Promise.all([
        $fetch(`/api/v1/agents/${agentId}/config`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }),
        shopId ? $fetch(`/api/v1/shops/${shopId}`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }).catch(err => {
          console.warn('⚠️ Erreur récupération shop:', err)
          return null
        }) : Promise.resolve(null),
        $fetch(`/api/v1/agents/${agentId}/knowledge`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }).catch(() => ({ success: true, data: [] }))
      ])

      if (!agentResponse.success) {
        throw new Error(agentResponse.error || 'Erreur lors de la récupération de la configuration agent')
      }

      console.log('📦 [useAgentConfig] Réponse API shop:', shopResponse?.data?.widget_config)

      // ✅ CONSTRUIRE CONFIG COMPLÈTE AVEC WIDGET PERSISTÉ
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
        // ✅ WIDGET CONFIG DEPUIS L'API SHOP (PERSISTÉE) - CORRIGÉ
        widget: {
          buttonText: shopResponse?.data?.widget_config?.buttonText || 'Parler à un conseiller',
          primaryColor: shopResponse?.data?.widget_config?.primaryColor || '#3B82F6',
          position: shopResponse?.data?.widget_config?.position || 'above-cta',
          widgetSize: shopResponse?.data?.widget_config?.widgetSize || 'medium',
          theme: shopResponse?.data?.widget_config?.theme || 'modern',
          borderRadius: shopResponse?.data?.widget_config?.borderRadius || 'md',
          animation: shopResponse?.data?.widget_config?.animation || 'fade',
          autoOpen: shopResponse?.data?.widget_config?.autoOpen || false,
          showAvatar: shopResponse?.data?.widget_config?.showAvatar !== false,
          soundEnabled: shopResponse?.data?.widget_config?.soundEnabled !== false,
          mobileOptimized: shopResponse?.data?.widget_config?.mobileOptimized !== false,
          offlineMessage: shopResponse?.data?.widget_config?.offlineMessage,
          isActive: shopResponse?.data?.widget_config?.isActive !== false,
          language: shopResponse?.data?.widget_config?.language || 'fr'
        },
        knowledgeBase: agentResponse.data.knowledgeBase || []
      }

      agentConfig.value = completeConfig
      console.log('✅ [useAgentConfig] Configuration chargée avec widget persisté:', {
        agent: completeConfig.agent.name,
        widget: completeConfig.widget.buttonText,
        widgetPersisted: !!shopResponse?.data?.widget_config
      })
      return { success: true, data: completeConfig }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur fetchAgentConfig:', err)
      error.value = err.message || 'Erreur lors de la récupération de la configuration'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ LIER DOCUMENTS DE BASE DE CONNAISSANCES
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

  // ✅ SAUVEGARDER CONFIGURATION COMPLÈTE - VERSION CORRIGÉE WIDGET
  const saveCompleteConfig = async (agentId: string, updates: Partial<AgentConfig>) => {
    saving.value = true
    widgetSyncStatus.value = 'syncing'
    error.value = null

    try {
      if (!authStore.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      if (!agentId) {
        throw new Error('ID agent manquant')
      }

      const shopId = authStore.user?.id || authStore.userShopId
      if (!shopId) {
        throw new Error('Shop ID manquant')
      }

      console.log('💾 [saveCompleteConfig] Début sauvegarde:', {
        agentId,
        shopId,
        hasAgentUpdates: !!updates.agent,
        hasWidgetUpdates: !!updates.widget
      })

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

        console.log('✅ Agent sauvegardé')
      }

      // ✅ SAUVEGARDER WIDGET - VERSION CORRIGÉE
      if (updates.widget) {
        console.log('🎨 Sauvegarde configuration widget...', updates.widget)
        
        const widgetPayload = {
          widget_config: {
            // ✅ S'assurer que TOUTES les propriétés sont incluses
            buttonText: updates.widget.buttonText || 'Parler à un conseiller',
            primaryColor: updates.widget.primaryColor || '#3B82F6',
            position: updates.widget.position || 'above-cta',
            theme: updates.widget.theme || 'modern',
            language: updates.widget.language || 'fr',
            widgetSize: updates.widget.widgetSize || 'medium',
            borderRadius: updates.widget.borderRadius || 'md',
            animation: updates.widget.animation || 'fade',
            autoOpen: updates.widget.autoOpen || false,
            showAvatar: updates.widget.showAvatar !== false,
            soundEnabled: updates.widget.soundEnabled !== false,
            mobileOptimized: updates.widget.mobileOptimized !== false,
            isActive: updates.widget.isActive !== false,
            offlineMessage: updates.widget.offlineMessage || null
          }
        }

        console.log('📤 [saveCompleteConfig] Payload widget à envoyer:', widgetPayload)
        
        const widgetResult = await $fetch(`/api/v1/shops/${shopId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: widgetPayload
        })

        if (!widgetResult.success) {
          console.error('❌ Erreur API widget:', widgetResult)
          throw new Error(`Erreur widget: ${widgetResult.error}`)
        }

        console.log('✅ Widget config sauvegardée avec succès:', widgetResult.data?.widget_config)
      }

      // ✅ LIER DOCUMENTS KB SI FOURNI
      if (updates.agent?.config?.linkedKnowledgeBase) {
        await linkKnowledgeBaseDocuments(agentId, updates.agent.config.linkedKnowledgeBase)
      }

      // ✅ METTRE À JOUR CONFIG LOCALE
      if (agentConfig.value) {
        if (updates.agent) {
          agentConfig.value.agent = { ...agentConfig.value.agent, ...updates.agent }
        }
        if (updates.widget) {
          agentConfig.value.widget = { ...agentConfig.value.widget, ...updates.widget }
          console.log('✅ Widget config locale mise à jour:', agentConfig.value.widget)
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
      setTimeout(() => {
        if (widgetSyncStatus.value !== 'error') {
          widgetSyncStatus.value = 'idle'
        }
      }, 3000)
    }
  }

  // ✅ TESTER L'IA EN TEMPS RÉEL
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