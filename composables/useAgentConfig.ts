// composables/useAgentConfig.ts 
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

    // ✅ COMPUTED POUR CODE D'INTÉGRATION - VERSION CORRIGÉE
    const integrationCode = computed(() => {
    console.log('🔧 [integrationCode] Génération du code d\'intégration...')
    
    // ✅ RÉCUPÉRATION DONNÉES AVEC GESTION D'ERREURS ROBUSTE
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
      
      // ✅ URL WIDGET CORRIGÉE - POINT CRUCIAL
      const widgetUrl = 'https://widget.chatseller.app'
      const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

    // ✅ CODE D'INTÉGRATION ROBUSTE POUR SHOPIFY - CORRIGÉ
    return `<!-- 🤖 ChatSeller Widget - Agent: ${agentName} -->
    <script>
    (function() {
      'use strict';
      
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
        disableFallback: true, // ✅ AJOUTÉ : Empêche le double bouton
        agentConfig: {
          id: '${agentId}',
          name: '${agentName.replace(/'/g, "\\'")}',
          title: '${getTypeLabel(agentData.type)}',
          welcomeMessage: '${(agentData.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?').replace(/'/g, "\\'")}',
          fallbackMessage: '${(agentData.fallbackMessage || 'Un instant, je transmets votre question à notre équipe.').replace(/'/g, "\\'")}',
          personality: '${agentData.personality || 'friendly'}'
        }
      };
      
      // ✅ VARIABLES GLOBALES POUR ÉVITER DOUBLE CHARGEMENT
      if (window.ChatSellerInitialized) {
        console.log('⚠️ ChatSeller: Déjà initialisé, arrêt');
        return;
      }
      window.ChatSellerInitialized = true;
      
      // ✅ NETTOYAGE PRÉVENTIF DES WIDGETS EXISTANTS
      function cleanupExistingWidgets() {
        const selectors = [
          '#chatseller-widget',
          '#chatseller-fallback', 
          '[data-chatseller]',
          '.chatseller-widget',
          '.chatseller-button'
        ];
        
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
      }
      
      // Fonction de chargement robuste pour Shopify
      function loadChatSellerWidget() {
        console.log('🚀 ChatSeller: Initialisation widget...');
        
        // Nettoyer avant de commencer
        cleanupExistingWidgets();
        
        // Vérification anti-double chargement
        if (window.ChatSellerLoaded) {
          console.log('⚠️ ChatSeller: Déjà chargé, ignore');
          return;
        }
        window.ChatSellerLoaded = true;
        
        // Création et configuration du script
        var script = document.createElement('script');
        script.src = '${widgetUrl}/embed.js?v=' + Date.now();
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-chatseller', 'main-widget');
        
        // Gestion du succès
        script.onload = function() {
          console.log('✅ ChatSeller: Script chargé');
          
          // Attendre que le SDK soit disponible
          var maxAttempts = 25; // ✅ AUGMENTÉ
          var attempts = 0;
          
          function tryInit() {
            attempts++;
            if (window.ChatSeller && typeof window.ChatSeller.init === 'function') {
              try {
                window.ChatSeller.init(window.ChatSellerConfig);
                console.log('✅ ChatSeller: Widget initialisé');
                
                // Analytics optionnel
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'chatseller_loaded', {
                    'agent_id': '${agentId}',
                    'shop_id': '${shopId}'
                  });
                }
              } catch (error) {
                console.error('❌ ChatSeller: Erreur init:', error);
                // ✅ PAS DE FALLBACK automatique - pour déboguer
              }
            } else if (attempts < maxAttempts) {
              setTimeout(tryInit, 300); // ✅ DÉLAI PLUS LONG
            } else {
              console.warn('⏰ ChatSeller: Timeout init - max tentatives atteint');
              // ✅ Fallback seulement si pas disableFallback
              if (!window.ChatSellerConfig.disableFallback) {
                createFallbackWidget();
              }
            }
          }
          
          tryInit();
        };
        
        // Gestion des erreurs
        script.onerror = function(error) {
          console.error('❌ ChatSeller: Erreur chargement:', error);
          // ✅ Fallback seulement si autorisé
          if (!window.ChatSellerConfig.disableFallback) {
            createFallbackWidget();
          }
        };
        
        // ✅ TIMEOUT DE SÉCURITÉ PLUS LONG
        setTimeout(function() {
          if (!window.ChatSeller || !window.ChatSeller.isReady) {
            console.warn('⏰ ChatSeller: Timeout général');
            if (!window.ChatSellerConfig.disableFallback) {
              createFallbackWidget();
            }
          }
        }, 20000); // ✅ 20 secondes au lieu de 15
        
        // Injection sécurisée du script
        var firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        } else {
          document.head.appendChild(script);
        }
      }
      
      // Widget de fallback Shopify-optimisé (seulement si autorisé)
      function createFallbackWidget() {
        if (document.getElementById('chatseller-fallback')) return;
        
        console.log('🔧 ChatSeller: Activation fallback');
        
        // Styles CSS
        var style = document.createElement('style');
        style.textContent = ` + '`' + `
          #chatseller-fallback {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            background: ${primaryColor} !important;
            color: white !important;
            padding: 12px 20px !important;
            border-radius: 25px !important;
            border: none !important;
            cursor: pointer !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
          }
          #chatseller-fallback:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 25px rgba(0,0,0,0.4) !important;
          }
        ` + '`' + `;
        document.head.appendChild(style);
        
        // Bouton de fallback
        var fallbackButton = document.createElement('a');
        fallbackButton.id = 'chatseller-fallback';
        fallbackButton.href = 'https://dashboard.chatseller.app/contact';
        fallbackButton.target = '_blank';
        fallbackButton.innerHTML = '💬 ${buttonText}';
        
        document.body.appendChild(fallbackButton);
      }
      
      // Démarrage intelligent pour Shopify
      function startWidget() {
        // Vérifier que nous ne sommes pas dans l'admin Shopify
        if (window.location.href.includes('/admin/')) {
          console.log('🛑 ChatSeller: Admin Shopify détecté, widget désactivé');
          return;
        }
        
        loadChatSellerWidget();
      }
      
      // Démarrage selon l'état du DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startWidget);
      } else {
        // DOM déjà chargé, démarrer avec délai pour Shopify
        setTimeout(startWidget, 200); // ✅ DÉLAI AUGMENTÉ
      }
      
      // Support Shopify sections dynamiques AMÉLIORÉ
      if (window.Shopify || document.querySelector('[data-shopify]')) {
        console.log('🛍️ ChatSeller: Mode Shopify activé');
        
        // Écouter les changements de section Shopify
        document.addEventListener('shopify:section:load', function(event) {
          console.log('🔄 ChatSeller: Section Shopify rechargée');
          if (!window.ChatSeller || !window.ChatSeller.isReady) {
            cleanupExistingWidgets();
            setTimeout(startWidget, 800);
          }
        });
        
        // Écouter les changements de produit (thèmes avec AJAX)
        document.addEventListener('variant:change', function() {
          if (window.ChatSeller && window.ChatSeller.refreshProduct) {
            window.ChatSeller.refreshProduct();
          }
        });
        
        // ✅ ÉCOUTER CHANGEMENTS URL POUR SPA SHOPIFY
        let currentUrl = window.location.href;
        setInterval(function() {
          if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            console.log('🔄 URL changée, rechargement widget');
            cleanupExistingWidgets();
            setTimeout(startWidget, 500);
          }
        }, 2000);
      }
      
    })();
    <\/script>
    <!-- 🚀 Fin ChatSeller Widget -->`

    } catch (error) {
      console.error('❌ Erreur génération code intégration:', error)
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

  // ✅ RÉCUPÉRER LA CONFIGURATION - VERSION CORRIGÉE AVEC GESTION D'ERREURS
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

      // ✅ RÉCUPÉRATION CONFIG AGENT + SHOP WIDGET EN PARALLÈLE AVEC GESTION D'ERREURS
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

      // ✅ GESTION DES ERREURS AVEC DETAILS
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

      console.log('📦 [useAgentConfig] Réponse API shop:', shopData?.data?.widget_config)

      // ✅ CONSTRUIRE CONFIG COMPLÈTE AVEC WIDGET PERSISTÉ
      const completeConfig: AgentConfig = {
        agent: {
          id: agentData.data.agent.id,
          name: agentData.data.agent.name,
          type: agentData.data.agent.type,
          personality: agentData.data.agent.personality,
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
            maxTokens: agentData.data.agent.config?.maxTokens || 1000,
            systemPrompt: agentData.data.agent.config?.systemPrompt || '',
            tone: agentData.data.agent.config?.tone || 'friendly'
          },
          stats: {
            conversations: agentData.data.agent.totalConversations || 0,
            conversions: agentData.data.agent.totalConversions || 0
          },
          knowledgeBase: kbData.data || []
        },
        // ✅ WIDGET CONFIG AVEC FALLBACKS ROBUSTES
        widget: {
          buttonText: shopData?.data?.widget_config?.buttonText || 'Parler à un conseiller',
          primaryColor: shopData?.data?.widget_config?.primaryColor || '#3B82F6',
          position: shopData?.data?.widget_config?.position || 'above-cta',
          widgetSize: shopData?.data?.widget_config?.widgetSize || 'medium',
          theme: shopData?.data?.widget_config?.theme || 'modern',
          borderRadius: shopData?.data?.widget_config?.borderRadius || 'md',
          animation: shopData?.data?.widget_config?.animation || 'fade',
          autoOpen: shopData?.data?.widget_config?.autoOpen || false,
          showAvatar: shopData?.data?.widget_config?.showAvatar !== false,
          soundEnabled: shopData?.data?.widget_config?.soundEnabled !== false,
          mobileOptimized: shopData?.data?.widget_config?.mobileOptimized !== false,
          offlineMessage: shopData?.data?.widget_config?.offlineMessage,
          isActive: shopData?.data?.widget_config?.isActive !== false,
          language: shopData?.data?.widget_config?.language || 'fr'
        },
        knowledgeBase: kbData.data || []
      }

      agentConfig.value = completeConfig
      console.log('✅ [useAgentConfig] Configuration chargée avec widget persisté:', {
        agent: completeConfig.agent.name,
        widget: completeConfig.widget.buttonText,
        widgetPersisted: !!shopData?.data?.widget_config
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

  // ✅ NOUVELLE MÉTHODE POUR TEST IA AVEC GESTION D'ERREURS ROBUSTE
  const testAIMessage = async (message: string, agentId: string) => {
    try {
      console.log('🧪 [testAIMessage] Test IA:', { message, agentId })
      
      if (!message.trim()) {
        throw new Error('Message vide')
      }

      if (!agentId) {
        throw new Error('Agent ID manquant')
      }

      const response = await $fetch('/api/v1/chat/test', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          message: message.trim(),
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
        error: error.response?.data?.error || error.message || 'Erreur lors du test IA'
      }
    }
  }

  // ✅ SAUVEGARDER CONFIGURATION COMPLÈTE - VERSION CORRIGÉE
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

      // ✅ SAUVEGARDER WIDGET
      if (updates.widget) {
        console.log('🎨 Sauvegarde configuration widget...', updates.widget)
        
        const widgetPayload = {
          widget_config: {
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
      const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de la sauvegarde'
      error.value = errorMessage
      widgetSyncStatus.value = 'error'
      return { success: false, error: errorMessage }
    } finally {
      saving.value = false
      setTimeout(() => {
        if (widgetSyncStatus.value !== 'error') {
          widgetSyncStatus.value = 'idle'
        }
      }, 3000)
    }
  }

      // ✅ NOUVELLE MÉTHODE : Lier documents à la base de connaissances
    const linkKnowledgeBaseDocuments = async (agentId: string, documentIds: string[]) => {
      saving.value = true
      error.value = null

      try {
        console.log('🔗 [linkKnowledgeBaseDocuments] Liaison documents:', { agentId, documentIds })

        if (!agentId) {
          throw new Error('Agent ID manquant')
        }

        // ✅ TYPAGE EXPLICIT DE LA RÉPONSE
        const response = await $fetch(`/api/v1/agents/${agentId}/knowledge-base`, {
          method: 'PUT',
          baseURL: config.public.apiBaseUrl,
          headers: getAuthHeaders(),
          body: {
            documentIds: documentIds
          }
        }) as { success: boolean; data?: any; error?: string } // ← Type explicite

        // ✅ VÉRIFICATION TYPE-SAFE AMÉLIORÉE
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
          // TypeScript sait maintenant que response.error peut exister
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
    testAIMessage,
    linkKnowledgeBaseDocuments, 
    copyIntegrationCode,
    clearError
  }
}