// composables/useAgentConfig.ts 
import { ref, computed, readonly } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAgentConfigStore } from '~/stores/agentConfig'

// ✅ IMPORT TYPES CENTRALISÉS BEAUTÉ
import type {
  AgentType,
  BeautyAgentType,
  PersonalityType,
  ProductRange,
  WidgetTheme,
  WidgetPosition,
  WidgetLanguage,
  AgentConfig,
  Agent,
  WidgetConfig
} from '~/types/beauty'

// ✅ RE-EXPORT AgentConfig pour compatibilité
export type { AgentConfig, Agent, WidgetConfig } from '~/types/beauty'

import {
  BEAUTY_AGENT_TYPES,
  PRODUCT_RANGE_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  getTypeLabel,
  getProductTypeLabel,
  getProductRangeLabel,
  getDefaultWelcomeTemplate
} from '~/types/beauty'

export const useAgentConfig = () => {
  const authStore = useAuthStore()
  const agentConfigStore = useAgentConfigStore()
  const config = useRuntimeConfig()

  // STATE RÉACTIF
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const agentConfig = ref<AgentConfig | null>(null)
  const localConfig = ref<Partial<AgentConfig> | null>(null)
  const widgetSyncStatus = ref<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  // NOUVEAU : État pour sauvegarde automatique
  const autoSaveEnabled = ref(true)
  const lastAutoSave = ref<Date | null>(null)
  const hasUnsavedChanges = ref(false)

  // COMPUTED POUR VALIDATION
  const isConfigValid = computed(() => {
    const hasAgentData = agentConfig.value?.agent?.name && 
                        agentConfig.value?.agent?.title &&  
                        agentConfig.value?.agent?.id
    const hasStoreData = agentConfigStore.hasValidAgent
    const hasWidgetData = agentConfig.value?.widget?.buttonText
    
    return hasAgentData || hasStoreData || hasWidgetData
  })

  // HELPER FUNCTIONS
  const hexToRgb = (hex: string): string => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }

  const adjustColor = (color: string, percent: number): string => {
    try {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      const adjust = (channel: number) => {
        const adjusted = channel + (channel * percent / 100)
        return Math.max(0, Math.min(255, Math.round(adjusted)))
      }
      
      return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`
    } catch (error) {
      return color
    }
  }

  const getBorderRadiusValue = (radius: string): string => {
    const radiusMap = {
      'none': '0px',
      'sm': '6px',
      'md': '12px',
      'lg': '16px',
      'full': '50px'
    }
    return radiusMap[radius as keyof typeof radiusMap] || '12px'
  }

  // FONCTION formatTime 
  const formatTime = (date: Date | null): string => {
    if (!date) return ''
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `il y a ${diffInSeconds}s`
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)}min`
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)}h`
    
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // ✅ CORRECTION MAJEURE : Prévisualisation du message d'accueil CORRIGÉE
  const previewWelcomeMessage = computed(() => {
    const message = localConfig.value?.agent?.welcomeMessage || agentConfig.value?.agent?.welcomeMessage
    if (!message) return ''
    
    const agentName = localConfig.value?.agent?.name || agentConfig.value?.agent?.name || 'Assistant'
    const agentTitle = localConfig.value?.agent?.title || agentConfig.value?.agent?.title || getTypeLabel(localConfig.value?.agent?.type || 'beauty_expert')
    const shopName = localConfig.value?.agent?.shopName || agentConfig.value?.agent?.shopName || 'Votre Boutique'
    const currentTime = new Date().getHours()
    const greeting = currentTime < 12 ? 'Bonjour' : currentTime < 18 ? 'Bonsoir' : 'Bonsoir'
    
    // ✅ Utiliser productRange pour la beauté
    let productType = 'produit beauté'
    const currentProductRange = localConfig.value?.agent?.productRange || agentConfig.value?.agent?.productRange
    const currentCustomRange = localConfig.value?.agent?.customProductRange || agentConfig.value?.agent?.customProductRange
    
    if (currentProductRange === 'custom' && currentCustomRange) {
      productType = currentCustomRange
    } else if (currentProductRange) {
      const rangeOption = PRODUCT_RANGE_OPTIONS.find(opt => opt.value === currentProductRange)
      productType = rangeOption?.label.replace(/[💎🛍️🌿🐰⏰🤲🎯]/g, '').trim().toLowerCase() || 'produit beauté'
    }
    
    return message
      .replace(/\$\{agentName\}/g, `${agentName}`)
      .replace(/\$\{agentTitle\}/g, `${agentTitle}`)
      .replace(/\$\{shopName\}/g, `${shopName}`)
      .replace(/\$\{productName\}/g, 'Nom du Produit')
      .replace(/\$\{productType\}/g, `${productType}`)
      .replace(/\$\{greeting\}/g, `${greeting}`)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\n/g, '<br>')
  })

  // ✅ NOUVELLE FONCTION : Nettoyer l'URL avatar - CORRIGÉE
  const getCleanAvatarUrl = (avatar: string | null | undefined): string => {
    // Si pas d'avatar ou si c'est un base64 trop long, utiliser un avatar généré
    if (!avatar || avatar.startsWith('data:image/') || avatar.length > 200) {
      // ✅ CORRECTION: Utiliser les références correctes
      const currentAgentName = localConfig.value?.agent?.name || agentConfig.value?.agent?.name || 'Agent'
      const currentPrimaryColor = localConfig.value?.widget?.primaryColor || agentConfig.value?.widget?.primaryColor || '#E91E63'
      
      const name = encodeURIComponent(currentAgentName)
      const color = currentPrimaryColor.replace('#', '')
      return `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&size=128`
    }
    
    return avatar
  }

  // ✅ CORRECTION MAJEURE : Code d'intégration CORRIGÉ avec welcomeMessage
  const integrationCode = computed(() => {
    // Configuration de base
    const shopId = authStore.user?.id || 'demo-shop'
    const agentId = agentConfig.value?.agent?.id || localConfig.value?.agent?.id || 'b5caf159-bb0d-4dc7-9def-7c4167ec3e17'
    const agentName = agentConfig.value?.agent?.name || localConfig.value?.agent?.name || 'Rose'
    const agentTitle = agentConfig.value?.agent?.title || localConfig.value?.agent?.title || 'Commerciale'
    const buttonText = agentConfig.value?.widget?.buttonText || localConfig.value?.widget?.buttonText || 'Parler à la commerciale'
    const primaryColor = agentConfig.value?.widget?.primaryColor || localConfig.value?.widget?.primaryColor || '#E91E63'
    const position = agentConfig.value?.widget?.position || localConfig.value?.widget?.position || 'above-cta'
    const borderRadius = agentConfig.value?.widget?.borderRadius || localConfig.value?.widget?.borderRadius || 'full'
    const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
    
    // Message d'accueil avec gestion des variables
    let welcomeMessage = agentConfig.value?.agent?.welcomeMessage || localConfig.value?.agent?.welcomeMessage
    if (welcomeMessage) {
      const currentTime = new Date().getHours()
      const greeting = currentTime < 12 ? 'Bonjour' : 'Bonsoir'
      const shopName = agentConfig.value?.agent?.shopName || localConfig.value?.agent?.shopName || 'cette boutique'
      
      // ✅ Utiliser productRange pour la beauté
      let productType = 'produit beauté'
      const agentProductRange = agentConfig.value?.agent?.productRange || localConfig.value?.agent?.productRange
      const customProductRange = agentConfig.value?.agent?.customProductRange || localConfig.value?.agent?.customProductRange
      
      if (agentProductRange === 'custom' && customProductRange) {
        productType = customProductRange
      } else if (agentProductRange) {
        const rangeOption = PRODUCT_RANGE_OPTIONS.find(opt => opt.value === agentProductRange)
        productType = rangeOption?.label.replace(/[💎🛍️🌿🐰⏰🤲🎯]/g, '').trim().toLowerCase() || 'produit beauté'
      }
      
      welcomeMessage = welcomeMessage
        .replace(/\$\{agentName\}/g, agentName)
        .replace(/\$\{agentTitle\}/g, agentTitle)
        .replace(/\$\{shopName\}/g, shopName)
        .replace(/\$\{productName\}/g, '${productName}')
        .replace(/\$\{productType\}/g, productType)
        .replace(/\$\{greeting\}/g, greeting)
    }
    
    // ✅ CALCUL BORDER RADIUS
    let borderRadiusValue = '12px'
    if (borderRadius === 'none') borderRadiusValue = '0px'
    else if (borderRadius === 'sm') borderRadiusValue = '6px'  
    else if (borderRadius === 'md') borderRadiusValue = '12px'
    else if (borderRadius === 'lg') borderRadiusValue = '16px'
    else if (borderRadius === 'full') borderRadiusValue = '50px'

    return `<!-- ChatSeller Widget Beauté -->
<script>
(function() {
  window.chatSellerConfig = {
    shopId: '${shopId}',
    agentId: '${agentId}',
    apiUrl: '${apiUrl}',
    position: '${position}',
    widget: {
      buttonText: '${buttonText}',
      primaryColor: '${primaryColor}',
      borderRadius: '${borderRadiusValue}',
      agentName: '${agentName}',
      agentTitle: '${agentTitle}',
      welcomeMessage: \`${welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?'}\`
    }
  };
  
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>`
  })

  // Helper: Headers avec authentification 
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ RÉCUPÉRER LA CONFIGURATION BEAUTÉ
  const fetchAgentConfig = async (agentId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgentConfig] Récupération configuration agent beauté:', agentId)
      
      if (!agentId || agentId === 'undefined' || agentId === 'null') {
        throw new Error('ID agent invalide')
      }

      if (!authStore.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.')
      }

      // RÉCUPÉRATION CONFIG AGENT + SHOP WIDGET EN PARALLÈLE
      const shopId = authStore.user?.id || authStore.userShopId
      
      const [agentResponse, shopResponse, kbResponse] = await Promise.allSettled([
        $fetch(`/api/v1/agents/${agentId}/config`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }),
        shopId ? $fetch(`/api/v1/shops/${shopId}`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }) : Promise.resolve(null),
        $fetch(`/api/v1/agents/${agentId}/knowledge`, {
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders()
        }).catch(() => ({ success: true, data: [] }))
      ])

      // GESTION DES ERREURS
      if (agentResponse.status === 'rejected') {
        console.error('❌ Erreur récupération agent:', agentResponse.reason)
        throw new Error('Erreur lors de la récupération de l\'agent: ' + agentResponse.reason.message)
      }

      const agentData = agentResponse.value as any
      if (!agentData.success) {
        throw new Error(agentData.error || 'Erreur lors de la récupération de la configuration agent')
      }

      const shopData = shopResponse.status === 'fulfilled' ? shopResponse.value as any : null
      const kbData = kbResponse.status === 'fulfilled' ? kbResponse.value as any : { success: true, data: [] }

      // ✅ CONSTRUIRE CONFIG COMPLÈTE BEAUTÉ
      const completeConfig: AgentConfig = {
        agent: {
          id: agentData.data.agent.id,
          name: agentData.data.agent.name,
          title: agentData.data.agent.title || getTypeLabel(agentData.data.agent.type || 'beauty_expert'),
          type: agentData.data.agent.type as AgentType,
          personality: agentData.data.agent.personality as PersonalityType,
          productType: agentData.data.agent.productType || 'auto',
          customProductType: agentData.data.agent.customProductType || '',
          // ✅ NOUVELLES PROPRIÉTÉS BEAUTÉ
          productRange: (agentData.data.agent.productRange as ProductRange) || 'premium',
          customProductRange: agentData.data.agent.customProductRange || '',
          shopName: shopData?.data?.name || agentData.data.agent.shopName || 'cette boutique beauté',
          description: agentData.data.agent.description,
          welcomeMessage: agentData.data.agent.welcomeMessage,
          fallbackMessage: agentData.data.agent.fallbackMessage,
          avatar: agentData.data.agent.avatar,
          isActive: agentData.data.agent.isActive,
          config: {
            ...agentData.data.agent.config,
            collectBeautyProfile: agentData.data.agent.config?.collectBeautyProfile ?? true, 
            linkedKnowledgeBase: kbData.data?.map((kb: any) => kb.id) || [],
            aiProvider: agentData.data.agent.config?.aiProvider || 'openai',
            temperature: agentData.data.agent.config?.temperature || 0.7,
            maxTokens: agentData.data.agent.config?.maxTokens || 1000
          },
          stats: {
            conversations: agentData.data.agent.totalConversations || 0,
            conversions: agentData.data.agent.totalConversions || 0
          },
          knowledgeBase: kbData.data || [],
          createdAt: agentData.data.agent.createdAt || new Date().toISOString(),
          updatedAt: agentData.data.agent.updatedAt || new Date().toISOString()
        },
        widget: {
          buttonText: shopData?.data?.widget_config?.buttonText || 'Parler à votre vendeuse beauté',
          primaryColor: shopData?.data?.widget_config?.primaryColor || '#E91E63',
          position: (shopData?.data?.widget_config?.position as WidgetPosition) || 'above-cta',
          floatingPosition: (shopData?.data?.widget_config?.floatingPosition as 'bottom-right' | 'bottom-left') || 'bottom-right',
          widgetSize: shopData?.data?.widget_config?.widgetSize || 'medium',
          theme: (shopData?.data?.widget_config?.theme as WidgetTheme) || 'beauty_modern',
          borderRadius: shopData?.data?.widget_config?.borderRadius || 'lg',
          animation: shopData?.data?.widget_config?.animation || 'fade',
          autoOpen: shopData?.data?.widget_config?.autoOpen || false,
          showAvatar: shopData?.data?.widget_config?.showAvatar !== false,
          soundEnabled: shopData?.data?.widget_config?.soundEnabled !== false,
          mobileOptimized: shopData?.data?.widget_config?.mobileOptimized !== false,
          showTypingIndicator: shopData?.data?.widget_config?.showTypingIndicator !== false,
          offlineMessage: shopData?.data?.widget_config?.offlineMessage,
          isActive: shopData?.data?.widget_config?.isActive !== false,
          language: (shopData?.data?.widget_config?.language as WidgetLanguage) || 'fr'
        },
        knowledgeBase: kbData.data || []
      }

      agentConfig.value = completeConfig
      console.log('✅ [useAgentConfig] Configuration beauté chargée:', {
        agent: completeConfig.agent.name,
        title: completeConfig.agent.title,
        type: completeConfig.agent.type,
        productRange: completeConfig.agent.productRange,
        customProductRange: completeConfig.agent.customProductRange,
        shopName: completeConfig.agent.shopName,
        welcomeMessage: !!completeConfig.agent.welcomeMessage,
        widget: completeConfig.widget.buttonText,
        theme: completeConfig.widget.theme
      })
      return { success: true, data: completeConfig }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur fetchAgentConfig:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la récupération de la configuration'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // ✅ CORRECTION MAJEURE : Test IA réel beauté
  const testAIMessage = async (message: string, agentId: string, isWelcomeTest = false) => {
    try {
      console.log('🧪 [testAIMessage] Test cohérent avec Widget beauté:', { message, agentId, isWelcomeTest })
      
      if (!message.trim() && !isWelcomeTest) {
        throw new Error('Message vide')
      }

      if (!agentId) {
        throw new Error('Agent ID manquant')
      }

      // Utiliser productRange pour la beauté
      const getEffectiveProductType = () => {
        if (localConfig.value?.agent?.productRange === 'custom' && localConfig.value?.agent?.customProductRange) {
          return localConfig.value.agent.customProductRange
        }
        const rangeOption = PRODUCT_RANGE_OPTIONS.find(opt => opt.value === (localConfig.value?.agent?.productRange || 'premium'))
        return rangeOption?.label || 'produit beauté'
      }

      // Utiliser la vraie API publique comme le Widget
      const response = await $fetch('/api/v1/public/chat', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          message: isWelcomeTest ? 'Bonjour' : message.trim(),
          shopId: authStore.user?.id || authStore.userShopId || 'demo-shop',
          conversationId: null,
          productInfo: {
            name: `Produit beauté ${getEffectiveProductType()}`,
            price: 29900,
            id: 'test-product-123'
          },
          visitorId: `test-visitor-${Date.now()}`,
          isFirstMessage: isWelcomeTest 
        }
      }) as any

      if (response.success) {
        return {
          success: true,
          message: response.data.message,
          isWelcome: response.data.isWelcomeMessage || isWelcomeTest,
          provider: response.data.mode === 'test' ? 'openai' : (response.data.provider || 'openai'),
          responseTime: response.data.responseTime || 0
        }
      } else {
        throw new Error(response.error || 'Erreur lors du test IA')
      }
    } catch (error: any) {
      console.error('❌ Erreur test IA:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur lors du test IA'
      }
    }
  }

  // ✅ Test spécifique du message d'accueil
  const testWelcomeMessage = async (agentId: string) => {
    try {
      console.log('🧪 [testWelcomeMessage] Test message d\'accueil avec vraie API...')
      
      if (!agentId) {
        throw new Error('Agent ID manquant')
      }

      // Appeler l'API publique pour obtenir le vrai message d'accueil
      const response = await $fetch('/api/v1/public/chat', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          message: 'Bonjour',
          shopId: authStore.user?.id || authStore.userShopId || 'demo-shop',
          conversationId: null,
          productInfo: {
            name: localConfig.value?.agent?.customProductRange || 'Produit beauté de test',
            price: 29900,
            id: 'test-product-123'
          },
          visitorId: `test-visitor-${Date.now()}`,
          isFirstMessage: true
        }
      }) as any

      if (response.success) {
        return {
          success: true,
          message: response.data.message,
          isWelcome: response.data.isWelcomeMessage || true
        }
      } else {
        throw new Error(response.error || 'Erreur lors du test du message d\'accueil')
      }
    } catch (error: any) {
      console.error('❌ Erreur test message d\'accueil:', error)
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur lors du test du message d\'accueil'
      }
    }
  }

  // ✅ CORRECTION MAJEURE : SAUVEGARDER CONFIGURATION BEAUTÉ COMPLÈTE
  const saveCompleteConfig = async (agentId: string, updates: Partial<AgentConfig>, isAutoSave = false) => {
    if (!isAutoSave) saving.value = true
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

      console.log('💾 [saveCompleteConfig] Début sauvegarde beauté:', {
        agentId,
        shopId,
        hasAgentUpdates: !!updates.agent,
        hasWidgetUpdates: !!updates.widget,
        agentTitle: updates.agent?.title,
        agentType: updates.agent?.type,
        productRange: updates.agent?.productRange,
        customProductRange: updates.agent?.customProductRange,
        welcomeMessage: !!updates.agent?.welcomeMessage,
        widgetTheme: updates.widget?.theme,
        isAutoSave
      })

      // ✅ SAUVEGARDER AGENT BEAUTÉ AVEC TOUS LES CHAMPS CORRIGÉS
      if (updates.agent) {
        console.log('💾 Sauvegarde configuration agent beauté avec champs complets...', {
          title: updates.agent.title,
          type: updates.agent.type,
          productRange: updates.agent.productRange,
          customProductRange: updates.agent.customProductRange,
          welcomeMessage: !!updates.agent.welcomeMessage,
          specificInstructions: updates.agent.config?.specificInstructions
        })
        
        const agentPayload = {
          ...updates.agent,
          title: updates.agent.title || getTypeLabel(updates.agent.type || 'beauty_expert'),
          type: updates.agent.type || 'beauty_expert',
          productType: updates.agent.productType || 'auto',
          customProductType: updates.agent.customProductType || '',
          // ✅ NOUVELLES PROPRIÉTÉS BEAUTÉ
          productRange: updates.agent.productRange || 'premium',
          customProductRange: updates.agent.customProductRange || '',
          shopName: updates.agent.shopName || 'cette boutique beauté',
          welcomeMessage: updates.agent.welcomeMessage || null, 
          config: {
            ...updates.agent.config,
            collectBeautyProfile: updates.agent.config?.collectBeautyProfile ?? true,
            aiProvider: updates.agent.config?.aiProvider || 'openai',
            temperature: updates.agent.config?.temperature || 0.7,
            maxTokens: updates.agent.config?.maxTokens || 1000,
            specificInstructions: updates.agent.config?.specificInstructions || [] 
          }
        }
        
        console.log('📤 [AGENT SAVE] Payload complet beauté:', {
          name: agentPayload.name,
          title: agentPayload.title,
          type: agentPayload.type,
          productRange: agentPayload.productRange,
          customProductRange: agentPayload.customProductRange,
          welcomeMessage: !!agentPayload.welcomeMessage,
          collectBeautyProfile: agentPayload.config.collectBeautyProfile,
          specificInstructionsCount: agentPayload.config.specificInstructions?.length || 0
        })
        
        const agentResult = await $fetch(`/api/v1/agents/${agentId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: agentPayload
        }) as any

        if (!agentResult.success) {
          throw new Error(`Erreur agent: ${agentResult.error}`)
        }

        console.log('✅ Agent beauté sauvegardé avec tous les champs')
      }

      // ✅ SAUVEGARDER WIDGET BEAUTÉ
      if (updates.widget) {
        console.log('🎨 Sauvegarde configuration widget beauté...', {
          theme: updates.widget.theme,
          buttonText: updates.widget.buttonText,
          position: updates.widget.position
        })
        
        const widgetPayload = {
          widget_config: {
            buttonText: updates.widget.buttonText || 'Parler à votre vendeuse beauté',
            primaryColor: updates.widget.primaryColor || '#E91E63',
            position: updates.widget.position || 'above-cta',
            theme: updates.widget.theme || 'beauty_modern',
            language: updates.widget.language || 'fr',
            widgetSize: updates.widget.widgetSize || 'medium',
            borderRadius: updates.widget.borderRadius || 'lg',
            animation: updates.widget.animation || 'fade',
            autoOpen: updates.widget.autoOpen || false,
            showAvatar: updates.widget.showAvatar !== false,
            soundEnabled: updates.widget.soundEnabled !== false, 
            mobileOptimized: true, 
            showTypingIndicator: false, 
            isActive: updates.widget.isActive !== false,
            offlineMessage: updates.widget.offlineMessage || null
          }
        }

        console.log('📤 [saveCompleteConfig] Payload widget beauté:', widgetPayload)
        
        const widgetResult = await $fetch(`/api/v1/shops/${shopId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: widgetPayload
        }) as any

        if (!widgetResult.success) {
          console.error('❌ Erreur API widget:', widgetResult)
          throw new Error(`Erreur widget: ${widgetResult.error}`)
        }

        console.log('✅ Widget beauté sauvegardé:', widgetResult.data?.widget_config)
      }

      // METTRE À JOUR CONFIG LOCALE BEAUTÉ
      if (agentConfig.value) {
        if (updates.agent) {
          agentConfig.value.agent = { ...agentConfig.value.agent, ...updates.agent }
          if (!agentConfig.value.agent.title && agentConfig.value.agent.type) {
            agentConfig.value.agent.title = getTypeLabel(agentConfig.value.agent.type)
          }
          if (!agentConfig.value.agent.productRange) {
            agentConfig.value.agent.productRange = 'premium'
          }
          if (!agentConfig.value.agent.shopName) {
            agentConfig.value.agent.shopName = 'cette boutique beauté'
          }
          console.log('✅ Config locale agent beauté mise à jour')
        }
        if (updates.widget) {
          agentConfig.value.widget = { ...agentConfig.value.widget, ...updates.widget }
          console.log('✅ Widget config beauté locale mise à jour')
        }
      }

      // MISE À JOUR STATE POUR SAUVEGARDE AUTO
      if (isAutoSave) {
        lastAutoSave.value = new Date()
        hasUnsavedChanges.value = false
      }

      widgetSyncStatus.value = 'synced'
      console.log('✅ Configuration beauté complète sauvegardée et synchronisée')
      return { success: true, message: isAutoSave ? 'Sauvegarde automatique effectuée' : 'Configuration sauvegardée avec succès' }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur saveCompleteConfig beauté:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde'
      error.value = errorMessage
      widgetSyncStatus.value = 'error'
      return { success: false, error: errorMessage }
    } finally {
      if (!isAutoSave) saving.value = false
      setTimeout(() => {
        if (widgetSyncStatus.value !== 'error') {
          widgetSyncStatus.value = 'idle'
        }
      }, 3000)
    }
  }

  // NOUVELLE FONCTION : Sauvegarde automatique
  let autoSaveTimeout: NodeJS.Timeout | null = null
  const triggerAutoSave = () => {
    if (!autoSaveEnabled.value) return
    
    hasUnsavedChanges.value = true
    
    // Annuler la précédente sauvegarde programmée
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
    }
    
    // Programmer une nouvelle sauvegarde dans 2 minutes
    autoSaveTimeout = setTimeout(async () => {
      if (hasUnsavedChanges.value && localConfig.value && agentConfig.value) {
        console.log('💾 [AUTO-SAVE] Déclenchement sauvegarde automatique beauté...')
        try {
          await saveCompleteConfig(
            agentConfig.value.agent.id,
            {
              agent: localConfig.value.agent,
              widget: localConfig.value.widget
            },
            true // isAutoSave = true
          )
          console.log('✅ [AUTO-SAVE] Sauvegarde automatique beauté réussie')
        } catch (error) {
          console.error('❌ [AUTO-SAVE] Erreur sauvegarde automatique:', error)
        }
      }
    }, 120000) // 2 minutes
  }

  // LIER DOCUMENTS À LA BASE DE CONNAISSANCES BEAUTÉ
  const linkKnowledgeBaseDocuments = async (agentId: string, documentIds: string[]) => {
    saving.value = true
    error.value = null

    try {
      console.log('🔗 [linkKnowledgeBaseDocuments] Liaison documents beauté:', { agentId, documentIds })

      if (!agentId) {
        throw new Error('Agent ID manquant')
      }

      const response = await $fetch(`/api/v1/agents/${agentId}/knowledge-base`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          documentIds: documentIds
        }
      }) as { success: boolean; data?: any; error?: string }

      if (response.success) {
        // Mettre à jour config locale
        if (agentConfig.value) {
          agentConfig.value.agent.config.linkedKnowledgeBase = documentIds
          
          if (response.data?.documents) {
            agentConfig.value.agent.knowledgeBase = response.data.documents
            agentConfig.value.knowledgeBase = response.data.documents
          }
        }

        console.log('✅ Documents beauté liés avec succès')
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la liaison des documents')
      }

    } catch (err: any) {
      console.error('❌ [linkKnowledgeBaseDocuments] Erreur:', err)
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la liaison des documents'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      saving.value = false
    }
  }

  // COPIER LE CODE D'INTÉGRATION
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

  // RÉINITIALISER L'ERREUR
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
    localConfig,
    widgetSyncStatus: readonly(widgetSyncStatus),
    autoSaveEnabled: readonly(autoSaveEnabled),
    lastAutoSave: readonly(lastAutoSave),
    hasUnsavedChanges: readonly(hasUnsavedChanges),

    // Computed
    isConfigValid,
    integrationCode,
    previewWelcomeMessage,

    // Helpers importés de types/beauty.ts
    getProductTypeOptions: () => PRODUCT_TYPE_OPTIONS,
    getProductRangeOptions: () => PRODUCT_RANGE_OPTIONS, 
    getProductTypeLabel,
    getProductRangeLabel,
    getTypeLabel,
    getBorderRadiusValue,
    hexToRgb,
    adjustColor,
    formatTime,
    getDefaultWelcomeTemplate,
    getCleanAvatarUrl,

    // Actions
    fetchAgentConfig,
    saveCompleteConfig,
    testAIMessage,
    testWelcomeMessage,
    linkKnowledgeBaseDocuments, 
    copyIntegrationCode,
    triggerAutoSave,
    clearError
  }
}