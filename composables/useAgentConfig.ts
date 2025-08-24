// composables/useAgentConfig.ts - VERSION CORRIGÉE COMPLÈTE AVEC TOUTES LES CORRECTIONS ✅
import { ref, computed, readonly } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAgentConfigStore } from '~/stores/agentConfig'

export interface AgentConfig {
  agent: {
    id: string
    name: string
    title?: string 
    type: 'general' | 'product_specialist' | 'support' | 'upsell'
    personality: 'professional' | 'friendly' | 'expert' | 'casual'
    productType?: 'auto' | 'jeu' | 'livre' | 'formation' | 'smartphone' | 'ordinateur' | 'vêtement' | 'service' | 'bijou' | 'produit' 
    shopName?: string
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
    showTypingIndicator?: boolean
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
  const localConfig = ref<AgentConfig | null>(null)
  const widgetSyncStatus = ref<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  // ✅ NOUVEAU : État pour sauvegarde automatique
  const autoSaveEnabled = ref(true)
  const lastAutoSave = ref<Date | null>(null)
  const hasUnsavedChanges = ref(false)

  // ✅ COMPUTED POUR VALIDATION
  const isConfigValid = computed(() => {
    const hasAgentData = agentConfig.value?.agent?.name && 
                        agentConfig.value?.agent?.title &&  
                        agentConfig.value?.agent?.id
    const hasStoreData = agentConfigStore.hasValidAgent
    const hasWidgetData = agentConfig.value?.widget?.buttonText
    
    return hasAgentData || hasStoreData || hasWidgetData
  })

  // ✅ HELPER FUNCTIONS POUR LE CODE D'INTÉGRATION
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
      'xl': '24px',
      'full': '50px'
    }
    return radiusMap[radius as keyof typeof radiusMap] || '12px'
  }

  // ✅ CORRECTION : Fonction formatTime manquante
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

  // ✅ HELPER POUR LES LABELS DE TYPE
  const getTypeLabel = (type: string): string => {
    const labels = {
      general: 'Conseiller commercial',
      product_specialist: 'Spécialiste produit', 
      support: 'Conseiller support',
      upsell: 'Conseiller premium'
    }
    return labels[type as keyof typeof labels] || 'Vendeur IA' 
  }

  // ✅ NOUVEAUX HELPERS POUR TYPE DE PRODUIT
  const getProductTypeOptions = () => [
    { value: 'auto', label: '🎯 Détection automatique', description: 'Le système détecte automatiquement le type' },
    { value: 'jeu', label: '🎮 Jeux', description: 'Jeux de société, cartes, etc.' },
    { value: 'livre', label: '📚 Livres', description: 'Livres, romans, manuels' },
    { value: 'formation', label: '🎓 Formations', description: 'Cours en ligne, formations' },
    { value: 'smartphone', label: '📱 Smartphones', description: 'Téléphones, accessoires mobiles' },
    { value: 'ordinateur', label: '💻 Ordinateurs', description: 'PC, laptops, composants' },
    { value: 'vêtement', label: '👗 Vêtements', description: 'Mode, accessoires vestimentaires' },
    { value: 'service', label: '🔧 Services', description: 'Consultations, prestations' },
    { value: 'bijou', label: '💎 Bijoux', description: 'Bijoux, montres, accessoires' },
    { value: 'produit', label: '📦 Autre produit', description: 'Autres types de produits' }
  ]

  const getProductTypeLabel = (type: string): string => {
    const option = getProductTypeOptions().find(opt => opt.value === type)
    return option ? option.label : '🎯 Détection automatique'
  }

  // ✅ COMPUTED POUR CODE D'INTÉGRATION - VERSION FINALE MODERNE
  const integrationCode = computed(() => {
    console.log('🔧 [integrationCode] Génération du code d\'intégration avec icône...')
    
    // Récupération données avec gestion d'erreurs
    let agentData = null
    let agentId = ''
    let agentName = ''
    let agentTitle = ''
    let widgetData = null
    
    // Source : agentConfig (API)
    if (agentConfig.value?.agent?.id && agentConfig.value?.agent?.name) {
      agentData = agentConfig.value.agent
      widgetData = agentConfig.value.widget
      agentId = agentData.id
      agentName = agentData.name
      agentTitle = agentData.title || getTypeLabel(agentData.type)
    }
    // Source : localConfig en cours d'édition
    else if (localConfig.value?.agent?.name) {
      agentData = localConfig.value.agent
      widgetData = localConfig.value.widget
      agentId = agentData.id || 'temp-agent'
      agentName = agentData.name
      agentTitle = agentData.title || getTypeLabel(agentData.type || 'general')
    }
    
    if (!agentData || !agentId || !agentName) {
      return '<!-- ⏳ Chargement de la configuration du Vendeur IA... -->'
    }

    try {
      const shopId = authStore.user?.id || authStore.userShopId || 'demo-shop'
      const buttonText = widgetData?.buttonText || 'Parler au vendeur'
      const primaryColor = widgetData?.primaryColor || '#EC4899'
      const position = widgetData?.position || 'above-cta'
      const theme = widgetData?.theme || 'modern'
      const language = widgetData?.language || 'fr'
      const borderRadius = widgetData?.borderRadius || 'md'
      
      const adjustedColor = adjustColor(primaryColor, -15)
      const borderRadiusValue = getBorderRadiusValue(borderRadius)
      
      const widgetUrl = 'https://widget.chatseller.app'
      const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

      // ✅ CODE D'INTÉGRATION FINAL AVEC ICÔNE ET CORRECTIONS
      return `<!-- 🤖 ChatSeller Widget v1.5.1 - ${agentName} (${agentTitle}) - ICÔNE CORRIGÉE -->

<script>
(function() {
  'use strict';
  
  // ✅ Configuration ChatSeller Widget avec ICÔNE FORCÉE
  window.ChatSellerConfig = {
    shopId: '${shopId}',
    agentId: '${agentId}',
    apiUrl: '${apiUrl}',
    buttonText: '${buttonText.replace(/'/g, "\\'")}',
    primaryColor: '${primaryColor}',
    position: '${position}',
    theme: '${theme}',
    language: '${language}',
    borderRadius: '${borderRadius}',
    autoDetectProduct: true,
    debug: false,
    disableFallback: false,
    agentConfig: {
      id: '${agentId}',
      name: '${agentName.replace(/'/g, "\\'")}',
      title: '${agentTitle.replace(/'/g, "\\'")}',
      welcomeMessage: '${(agentData.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?').replace(/'/g, "\\'")}',
      fallbackMessage: '${(agentData.fallbackMessage || 'Un instant, je transmets votre question à notre équipe.').replace(/'/g, "\\'")}',
      personality: '${agentData.personality || 'friendly'}',
      productType: '${agentData.productType || 'auto'}',
      shopName: '${agentData.shopName || 'cette boutique'}'
    }
  };
  
  // ✅ PROTECTION ANTI-DOUBLE CHARGEMENT
  if (window.ChatSellerInitialized) {
    console.log('⚠️ ChatSeller: Déjà initialisé');
    return;
  }
  window.ChatSellerInitialized = true;
  
  // ✅ NETTOYAGE PRÉVENTIF (supprime automatiquement les boutons flottants)
  function cleanupExistingWidgets() {
    const selectors = [
      '#chatseller-widget',
      '#chatseller-modal',
      '[data-chatseller]',
      '.chatseller-widget',
      '#chatseller-fallback' // ✅ AJOUT : Supprime le bouton flottant indésirable
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });
  }
  
  // ✅ CSS CRITIQUE AVEC ICÔNE FORCÉE MAXIMAL
  function injectCriticalCSS() {
    if (document.getElementById('chatseller-critical-css')) return;
    
    const style = document.createElement('style');
    style.id = 'chatseller-critical-css';
    style.textContent = \`
/* 🎨 CHATSELLER CSS AVEC ICÔNE FORCÉE SHOPIFY-PROOF */
.cs-chatseller-widget, .cs-chatseller-widget * {
  all: unset !important;
  box-sizing: border-box !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

.cs-chatseller-widget {
  position: relative !important;
  z-index: 999999 !important;
  display: block !important;
  margin: 8px 0 !important;
  width: 100% !important;
  contain: layout style !important;
  isolation: isolate !important;
}

/* ✅ BOUTON AVEC ICÔNE FORCÉE MAXIMALE */
.cs-chat-trigger-button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  padding: 16px 24px !important;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${adjustedColor} 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: ${borderRadiusValue} !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 8px 25px rgba(${hexToRgb(primaryColor)}, 0.3) !important;
  min-height: 56px !important;
  font-family: inherit !important;
  gap: 8px !important;
  outline: none !important;
}

.cs-chat-trigger-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 35px rgba(${hexToRgb(primaryColor)}, 0.4) !important;
}

/* ✅ ICÔNE SVG PROTECTION MAXIMALE SHOPIFY */
.cs-chat-trigger-button svg {
  width: 20px !important;
  height: 20px !important;
  fill: none !important;
  stroke: white !important;
  stroke-width: 2 !important;
  flex-shrink: 0 !important;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  position: relative !important;
  z-index: 999999 !important;
  pointer-events: none !important;
  min-width: 20px !important;
  max-width: 20px !important;
  min-height: 20px !important;
  max-height: 20px !important;
  color: white !important;
}

.cs-chat-trigger-button svg * {
  fill: none !important;
  stroke: white !important;
  stroke-width: 2 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  pointer-events: none !important;
  color: white !important;
}

/* ✅ PROTECTION ANTI-OVERRIDE SHOPIFY MAXIMALE */
.shopify-section .cs-chat-trigger-button svg,
.product-form .cs-chat-trigger-button svg,
[class*="product"] .cs-chat-trigger-button svg,
.theme-shopify .cs-chat-trigger-button svg,
.page .cs-chat-trigger-button svg {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  width: 20px !important;
  height: 20px !important;
  stroke: white !important;
  color: white !important;
}
    \`;
    document.head.appendChild(style);
  }
  
  // ✅ FONCTION DE CHARGEMENT PRINCIPALE
  function loadChatSellerWidget() {
    console.log('🚀 ChatSeller: Chargement widget avec icône corrigée...');
    
    cleanupExistingWidgets(); // Supprime tout bouton flottant existant
    injectCriticalCSS(); // Injecte le CSS avec icône forcée
    
    if (window.ChatSellerLoaded) {
      console.log('⚠️ ChatSeller: Déjà chargé');
      return;
    }
    window.ChatSellerLoaded = true;
    
    // ✅ CHARGEMENT SCRIPT WIDGET
    var script = document.createElement('script');
    script.src = '${widgetUrl}/embed.js?v=1.5.1&t=' + Date.now();
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-chatseller', 'modern-widget-fixed');
    
    script.onload = function() {
      console.log('✅ ChatSeller: Script chargé avec icône');
      
      var maxAttempts = 30;
      var attempts = 0;
      
      function tryInit() {
        attempts++;
        if (window.ChatSeller && typeof window.ChatSeller.init === 'function') {
          try {
            window.ChatSeller.init(window.ChatSellerConfig);
            console.log('✅ ChatSeller: Widget initialisé avec icône visible');
          } catch (error) {
            console.error('❌ ChatSeller: Erreur init:', error);
          }
        } else if (attempts < maxAttempts) {
          setTimeout(tryInit, 300);
        } else {
          console.warn('⏰ ChatSeller: Timeout init');
          // ✅ PAS DE FALLBACK FLOTTANT - comportement corrigé
        }
      }
      
      tryInit();
    };
    
    script.onerror = function(error) {
      console.error('❌ ChatSeller: Erreur chargement:', error);
      // ✅ PAS DE FALLBACK FLOTTANT - comportement corrigé
    };
    
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }
  
  // ✅ DÉMARRAGE INTELLIGENT
  function startWidget() {
    if (window.location.href.includes('/admin/')) {
      console.log('🛑 ChatSeller: Admin détecté, arrêt');
      return;
    }
    
    loadChatSellerWidget();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWidget);
  } else {
    setTimeout(startWidget, 200);
  }
  
})();
<\/script>
<!-- 🚀 Fin ChatSeller Widget ICÔNE CORRIGÉE -->`

    } catch (error) {
      console.error('❌ Erreur génération code intégration:', error)
      return `<!-- ❌ Erreur lors de la génération du code d'intégration. -->`
    }
  })

  // ✅ HELPER: Headers avec authentification ROBUSTE
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ RÉCUPÉRER LA CONFIGURATION
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

      // ✅ GESTION DES ERREURS
      if (agentResponse.status === 'rejected') {
        console.error('❌ Erreur récupération agent:', agentResponse.reason)
        throw new Error('Erreur lors de la récupération de l\'agent: ' + agentResponse.reason.message)
      }

      const agentData = agentResponse.value
      if (!agentData.success) {
        throw new Error(agentData.error || 'Erreur lors de la récupération de la configuration agent')
      }

      const shopData = shopResponse.status === 'fulfilled' ? shopResponse.value : null
      const kbData = kbResponse.status === 'fulfilled' ? kbResponse.value : { success: true, data: [] }

      // ✅ CONSTRUIRE CONFIG COMPLÈTE AVEC NOUVEAUX CHAMPS
      const completeConfig: AgentConfig = {
        agent: {
          id: agentData.data.agent.id,
          name: agentData.data.agent.name,
          title: agentData.data.agent.title || getTypeLabel(agentData.data.agent.type || 'general'), // ✅ CORRECTION: Titre obligatoire
          type: agentData.data.agent.type,
          personality: agentData.data.agent.personality,
          productType: agentData.data.agent.productType || 'auto', // ✅ NOUVEAU CHAMP
          shopName: shopData?.data?.name || agentData.data.agent.shopName || 'cette boutique', // ✅ NOUVEAU CHAMP
          description: agentData.data.agent.description,
          welcomeMessage: agentData.data.agent.welcomeMessage,
          fallbackMessage: agentData.data.agent.fallbackMessage,
          avatar: agentData.data.agent.avatar,
          isActive: agentData.data.agent.isActive,
          config: {
            ...agentData.data.agent.config,
            linkedKnowledgeBase: kbData.data?.map((kb: any) => kb.id) || [],
            aiProvider: agentData.data.agent.config?.aiProvider || 'openai',
            temperature: agentData.data.agent.config?.temperature || 0.7,
            maxTokens: agentData.data.agent.config?.maxTokens || 1000
          },
          stats: {
            conversations: agentData.data.agent.totalConversations || 0,
            conversions: agentData.data.agent.totalConversions || 0
          },
          knowledgeBase: kbData.data || []
        },
        widget: {
          buttonText: shopData?.data?.widget_config?.buttonText || 'Parler à un conseiller',
          primaryColor: shopData?.data?.widget_config?.primaryColor || '#EC4899', // ✅ Rose par défaut
          position: shopData?.data?.widget_config?.position || 'above-cta',
          widgetSize: shopData?.data?.widget_config?.widgetSize || 'medium',
          theme: shopData?.data?.widget_config?.theme || 'modern',
          borderRadius: shopData?.data?.widget_config?.borderRadius || 'md',
          animation: shopData?.data?.widget_config?.animation || 'fade',
          autoOpen: shopData?.data?.widget_config?.autoOpen || false,
          showAvatar: shopData?.data?.widget_config?.showAvatar !== false,
          soundEnabled: shopData?.data?.widget_config?.soundEnabled !== false,
          mobileOptimized: shopData?.data?.widget_config?.mobileOptimized !== false,
          showTypingIndicator: shopData?.data?.widget_config?.showTypingIndicator !== false, // ✅ NOUVEAU CHAMP
          offlineMessage: shopData?.data?.widget_config?.offlineMessage,
          isActive: shopData?.data?.widget_config?.isActive !== false,
          language: shopData?.data?.widget_config?.language || 'fr'
        },
        knowledgeBase: kbData.data || []
      }

      agentConfig.value = completeConfig
      console.log('✅ [useAgentConfig] Configuration moderne chargée:', {
        agent: completeConfig.agent.name,
        title: completeConfig.agent.title,
        productType: completeConfig.agent.productType,
        shopName: completeConfig.agent.shopName,
        widget: completeConfig.widget.buttonText,
        primaryColor: completeConfig.widget.primaryColor
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

  // ✅ TEST IA RÉEL (CORRECTION MAJEURE POUR PLAYGROUND COHÉRENT)
  const testAIMessage = async (message: string, agentId: string) => {
    try {
      console.log('🧪 [testAIMessage] Test IA cohérent avec Widget:', { message, agentId })
      
      if (!message.trim()) {
        throw new Error('Message vide')
      }

      if (!agentId) {
        throw new Error('Agent ID manquant')
      }

      // ✅ CORRECTION MAJEURE : Utiliser la vraie API publique comme le Widget
      const response = await $fetch('/api/v1/public/chat', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          message: message.trim(),
          shopId: authStore.user?.id || authStore.userShopId || 'demo-shop',
          conversationId: null,
          productInfo: {
            name: localConfig.value?.agent?.productType !== 'auto' 
              ? `Produit de test ${getProductTypeLabel(localConfig.value?.agent?.productType || 'auto')}` 
              : 'Produit de test',
            price: 29900, // Prix de test en centimes (299€)
            id: 'test-product-123'
          },
          visitorId: `test-visitor-${Date.now()}`,
          isFirstMessage: false
        }
      })

      if (response.success) {
        return {
          success: true,
          message: response.data.message,
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

  // ✅ SAUVEGARDER CONFIGURATION COMPLÈTE AVEC SAUVEGARDE AUTO
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

      console.log('💾 [saveCompleteConfig] Début sauvegarde moderne:', {
        agentId,
        shopId,
        hasAgentUpdates: !!updates.agent,
        hasWidgetUpdates: !!updates.widget,
        agentTitle: updates.agent?.title,
        productType: updates.agent?.productType,
        shopName: updates.agent?.shopName,
        isAutoSave
      })

      // ✅ SAUVEGARDER AGENT AVEC NOUVEAUX CHAMPS
      if (updates.agent) {
        console.log('💾 Sauvegarde configuration agent avec nouveaux champs...', {
          title: updates.agent.title,
          productType: updates.agent.productType,
          shopName: updates.agent.shopName
        })
        
        const agentPayload = {
          ...updates.agent,
          title: updates.agent.title || getTypeLabel(updates.agent.type || 'general'), // ✅ CORRECTION : Titre obligatoire
          productType: updates.agent.productType || 'auto', // ✅ NOUVEAU CHAMP
          shopName: updates.agent.shopName || 'cette boutique', // ✅ NOUVEAU CHAMP
          config: {
            ...updates.agent.config,
            aiProvider: updates.agent.config?.aiProvider || 'openai',
            temperature: updates.agent.config?.temperature || 0.7,
            maxTokens: updates.agent.config?.maxTokens || 1000,
            specificInstructions: updates.agent.config?.specificInstructions || []
          }
        }
        
        console.log('📤 [AGENT SAVE] Payload complet avec nouveaux champs:', {
          name: agentPayload.name,
          title: agentPayload.title,
          type: agentPayload.type,
          productType: agentPayload.productType,
          shopName: agentPayload.shopName
        })
        
        const agentResult = await $fetch(`/api/v1/agents/${agentId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: agentPayload
        })

        if (!agentResult.success) {
          throw new Error(`Erreur agent: ${agentResult.error}`)
        }

        console.log('✅ Agent sauvegardé avec nouveaux champs:', agentResult.data?.title)
      }

      // ✅ SAUVEGARDER WIDGET MODERNE AVEC NOUVEAU CHAMP
      if (updates.widget) {
        console.log('🎨 Sauvegarde configuration widget moderne...', updates.widget)
        
        const widgetPayload = {
          widget_config: {
            buttonText: updates.widget.buttonText || 'Parler au vendeur',
            primaryColor: updates.widget.primaryColor || '#EC4899', // ✅ Rose par défaut
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
            showTypingIndicator: updates.widget.showTypingIndicator !== false, // ✅ NOUVEAU CHAMP
            isActive: updates.widget.isActive !== false,
            offlineMessage: updates.widget.offlineMessage || null
          }
        }

        console.log('📤 [saveCompleteConfig] Payload widget moderne à envoyer:', widgetPayload)
        
        const widgetResult = await $fetch(`/api/v1/shops/${shopId}`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: widgetPayload
        })

        if (!widgetResult.success) {
          console.error('❌ Erreur API widget moderne:', widgetResult)
          throw new Error(`Erreur widget: ${widgetResult.error}`)
        }

        console.log('✅ Widget moderne sauvegardé:', widgetResult.data?.widget_config)
      }

      // ✅ METTRE À JOUR CONFIG LOCALE AVEC NOUVEAUX CHAMPS
      if (agentConfig.value) {
        if (updates.agent) {
          agentConfig.value.agent = { ...agentConfig.value.agent, ...updates.agent }
          // ✅ CORRECTION : S'assurer que les nouveaux champs sont bien dans la config locale
          if (!agentConfig.value.agent.title && agentConfig.value.agent.type) {
            agentConfig.value.agent.title = getTypeLabel(agentConfig.value.agent.type)
          }
          if (!agentConfig.value.agent.productType) {
            agentConfig.value.agent.productType = 'auto'
          }
          if (!agentConfig.value.agent.shopName) {
            agentConfig.value.agent.shopName = 'cette boutique'
          }
          console.log('✅ Config locale agent mise à jour avec nouveaux champs:', {
            title: agentConfig.value.agent.title,
            productType: agentConfig.value.agent.productType,
            shopName: agentConfig.value.agent.shopName
          })
        }
        if (updates.widget) {
          agentConfig.value.widget = { ...agentConfig.value.widget, ...updates.widget }
          console.log('✅ Widget moderne config locale mise à jour:', agentConfig.value.widget)
        }
      }

      // ✅ MISE À JOUR STATE POUR SAUVEGARDE AUTO
      if (isAutoSave) {
        lastAutoSave.value = new Date()
        hasUnsavedChanges.value = false
      }

      widgetSyncStatus.value = 'synced'
      console.log('✅ Configuration moderne complète sauvegardée et synchronisée')
      return { success: true, message: isAutoSave ? 'Sauvegarde automatique effectuée' : 'Configuration sauvegardée avec succès' }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur saveCompleteConfig moderne:', err)
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

  // ✅ NOUVELLE FONCTION : Sauvegarde automatique
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
        console.log('💾 [AUTO-SAVE] Déclenchement sauvegarde automatique...')
        try {
          await saveCompleteConfig(
            agentConfig.value.agent.id,
            {
              agent: localConfig.value.agent,
              widget: localConfig.value.widget
            },
            true // isAutoSave = true
          )
          console.log('✅ [AUTO-SAVE] Sauvegarde automatique réussie')
        } catch (error) {
          console.error('❌ [AUTO-SAVE] Erreur sauvegarde automatique:', error)
        }
      }
    }, 120000) // 2 minutes
  }

  // ✅ LIER DOCUMENTS À LA BASE DE CONNAISSANCES
  const linkKnowledgeBaseDocuments = async (agentId: string, documentIds: string[]) => {
    saving.value = true
    error.value = null

    try {
      console.log('🔗 [linkKnowledgeBaseDocuments] Liaison documents:', { agentId, documentIds })

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

        console.log('✅ Documents liés avec succès')
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

  // ✅ COPIER LE CODE D'INTÉGRATION
  const copyIntegrationCode = async () => {
    try {
      if (!integrationCode.value) {
        throw new Error('Code d\'intégration non disponible')
      }

      await navigator.clipboard.writeText(integrationCode.value)
      return { success: true, message: 'Code d\'intégration moderne copié!' }
    } catch (err: any) {
      console.error('❌ Erreur copie:', err)
      return { success: false, error: 'Impossible de copier le code' }
    }
  }

  // ✅ CORRECTION : Fonction setError manquante
  const setError = (message: string) => {
    error.value = message
    widgetSyncStatus.value = 'error'
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
    localConfig,
    widgetSyncStatus: readonly(widgetSyncStatus),
    autoSaveEnabled: readonly(autoSaveEnabled),
    lastAutoSave: readonly(lastAutoSave),
    hasUnsavedChanges: readonly(hasUnsavedChanges),

    // Computed
    isConfigValid,
    integrationCode,

    // Helpers
    getProductTypeOptions,
    getProductTypeLabel,
    getTypeLabel,
    getBorderRadiusValue,
    hexToRgb,
    adjustColor,
    formatTime, 

    // Actions
    fetchAgentConfig,
    saveCompleteConfig,
    testAIMessage,
    linkKnowledgeBaseDocuments, 
    copyIntegrationCode,
    triggerAutoSave,
    setError, 
    clearError
  }
}