// composables/useAgentConfig.ts - CORRIGÉ
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
    customProductType?: string 
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

  // STATE RÉACTIF
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const agentConfig = ref<AgentConfig | null>(null)
  const localConfig = ref<AgentConfig | null>(null)
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

  // HELPER POUR LES LABELS DE TYPE
  const getTypeLabel = (type: string): string => {
    const labels = {
      general: 'Conseiller commercial',
      product_specialist: 'Spécialiste produit', 
      support: 'Conseiller support',
      upsell: 'Conseiller premium'
    }
    return labels[type as keyof typeof labels] || 'Vendeur IA' 
  }

  // HELPERS POUR TYPE DE PRODUIT AVEC CUSTOM
  const getProductTypeOptions = () => [
    { value: 'auto', label: '🎯 Détection automatique', description: 'Le système détecte automatiquement le type' },
    { value: 'jeu', label: '🎮 Jeu', description: 'Jeux de société, cartes, etc.' },
    { value: 'livre', label: '📚 Livre', description: 'Livres, romans, manuels' },
    { value: 'formation', label: '🎓 Formation', description: 'Cours en ligne, formations' },
    { value: 'smartphone', label: '📱 Smartphone', description: 'Téléphones, accessoires mobiles' },
    { value: 'ordinateur', label: '💻 Ordinateur', description: 'PC, laptops, composants' },
    { value: 'vêtement', label: '👗 Vêtement', description: 'Mode, accessoires vestimentaires' },
    { value: 'service', label: '🔧 Service', description: 'Consultations, prestations' },
    { value: 'bijou', label: '💎 Bijou', description: 'Bijoux, montres, accessoires' },
    { value: 'produit', label: '📦 Autre produit', description: 'Spécifiez votre type de produit' } 
  ]

  const getProductTypeLabel = (type: string, customType?: string): string => {
    // Si c'est un type personnalisé, utiliser la valeur personnalisée
    if (type === 'produit' && customType) {
      return customType
    }
    
    const option = getProductTypeOptions().find(opt => opt.value === type)
    return option ? option.label : '🎯 Détection automatique'
  }

  // TEMPLATE PAR DÉFAUT INTELLIGENT
  const getDefaultWelcomeTemplate = () => {
    return `\${greeting} 👋 Je suis \${agentName}, \${agentTitle} chez \${shopName}.

Je vois que vous vous intéressez à notre \${productType} "\${productName}". Excellent choix ! ✨

Comment puis-je vous aider avec ce \${productType} ? 😊`
  }

  // ✅ CORRECTION MAJEURE : Prévisualisation du message d'accueil CORRIGÉE
  const previewWelcomeMessage = computed(() => {
    const message = localConfig.value?.agent?.welcomeMessage || agentConfig.value?.agent?.welcomeMessage
    if (!message) return ''
    
    const agentName = localConfig.value?.agent?.name || agentConfig.value?.agent?.name || 'Assistant'
    const agentTitle = localConfig.value?.agent?.title || agentConfig.value?.agent?.title || getTypeLabel(localConfig.value?.agent?.type || 'general')
    const shopName = localConfig.value?.agent?.shopName || agentConfig.value?.agent?.shopName || 'Votre Boutique'
    const currentTime = new Date().getHours()
    const greeting = currentTime < 12 ? 'Bonjour' : currentTime < 18 ? 'Bonsoir' : 'Bonsoir'
    
    // Utiliser le type personnalisé s'il existe
    let productType = 'produit'
    const currentProductType = localConfig.value?.agent?.productType || agentConfig.value?.agent?.productType
    const currentCustomType = localConfig.value?.agent?.customProductType || agentConfig.value?.agent?.customProductType
    
    if (currentProductType === 'produit' && currentCustomType) {
      productType = currentCustomType
    } else if (currentProductType !== 'auto') {
      const typeOption = getProductTypeOptions().find(opt => opt.value === currentProductType)
      productType = typeOption?.label.replace(/[🎯🎮📚🎓📱💻👗🔧💎📦]/g, '').trim().toLowerCase() || 'produit'
    }
    
    return message
      .replace(/\$\{agentName\}/g, `<strong>${agentName}</strong>`)
      .replace(/\$\{agentTitle\}/g, `<strong>${agentTitle}</strong>`)
      .replace(/\$\{shopName\}/g, `<strong>${shopName}</strong>`)
      .replace(/\$\{productName\}/g, '<strong>Nom du Produit</strong>')
      .replace(/\$\{productType\}/g, `<strong>${productType}</strong>`)
      .replace(/\$\{greeting\}/g, `<strong>${greeting}</strong>`)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
  })

  // ✅ CORRECTION : Test spécifique du message d'accueil
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
            name: localConfig.value?.agent?.customProductType || 'Produit de test',
            price: 29900,
            id: 'test-product-123'
          },
          visitorId: `test-visitor-${Date.now()}`,
          isFirstMessage: true
        }
      })

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

  // ✅ NOUVELLE FONCTION : Nettoyer l'URL avatar - CORRIGÉE
  const getCleanAvatarUrl = (avatar: string | null | undefined): string => {
    // Si pas d'avatar ou si c'est un base64 trop long, utiliser un avatar généré
    if (!avatar || avatar.startsWith('data:image/') || avatar.length > 200) {
      // ✅ CORRECTION: Utiliser les références correctes
      const currentAgentName = localConfig.value?.agent?.name || agentConfig.value?.agent?.name || 'Agent'
      const currentPrimaryColor = localConfig.value?.widget?.primaryColor || agentConfig.value?.widget?.primaryColor || '#8B5CF6'
      
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
  const primaryColor = agentConfig.value?.widget?.primaryColor || localConfig.value?.widget?.primaryColor || '#EF4444'
  const position = agentConfig.value?.widget?.position || localConfig.value?.widget?.position || 'below-cta'
  const borderRadius = agentConfig.value?.widget?.borderRadius || localConfig.value?.widget?.borderRadius || 'full'
  const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'
  
  // Message d'accueil avec gestion des variables
  let welcomeMessage = agentConfig.value?.agent?.welcomeMessage || localConfig.value?.agent?.welcomeMessage
  if (welcomeMessage) {
    const currentTime = new Date().getHours()
    const greeting = currentTime < 12 ? 'Bonjour' : 'Bonsoir'
    const shopName = agentConfig.value?.agent?.shopName || localConfig.value?.agent?.shopName || 'cette boutique'
    
    let productType = 'produit'
    const agentProductType = agentConfig.value?.agent?.productType || localConfig.value?.agent?.productType
    const customProductType = agentConfig.value?.agent?.customProductType || localConfig.value?.agent?.customProductType
    
    if (agentProductType === 'produit' && customProductType) {
      productType = customProductType
    } else if (agentProductType && agentProductType !== 'auto') {
      const typeOption = getProductTypeOptions().find(opt => opt.value === agentProductType)
      productType = typeOption?.label.replace(/[🎯🎮📚🎓📱💻👗🔧💎📦]/g, '').trim().toLowerCase() || 'produit'
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

  return `<!-- ChatSeller Widget Hybride Amélioré -->
  <script>
  (function() {
    console.log('🚀 ChatSeller Hybride v2 - Démarrage avec fallbacks robustes');
    
    // ✅ CONFIGURATION COMPLÈTE
    window.ChatSellerConfig = {
      shopId: '${shopId}',
      agentId: '${agentId}',
      apiUrl: '${apiUrl}',
      buttonText: '${buttonText.replace(/'/g, "\\'")}',
      primaryColor: '${primaryColor}',
      position: '${position}',
      theme: 'modern',
      language: 'fr',
      borderRadius: '${borderRadius}',
      autoDetectProduct: true,
      debug: true,
      forceDisplay: true,
      agentConfig: {
        id: '${agentId}',
        name: '${agentName.replace(/'/g, "\\'")}',
        title: '${agentTitle.replace(/'/g, "\\'")}',
        welcomeMessage: ${welcomeMessage ? `'${welcomeMessage.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'` : 'null'},
        personality: 'friendly',
        avatar: '${getCleanAvatarUrl(agentConfig.value?.agent?.avatar || localConfig.value?.agent?.avatar)}'
      }
    };
    
    // ✅ VARIABLES ES5 POUR COMPATIBILITÉ
    var shopId = '${shopId}';
    var agentName = '${agentName.replace(/'/g, "\\'")}';
    var agentTitle = '${agentTitle.replace(/'/g, "\\'")}';  
    var buttonText = '${buttonText.replace(/'/g, "\\'")}';
    var primaryColor = '${primaryColor}';
    var position = '${position}';
    var borderRadius = '${borderRadiusValue}';
    var apiUrl = '${apiUrl}';
    
    // ✅ FLAGS DE CONTRÔLE
    var realWidgetLoaded = false;
    var realWidgetAttempted = false;
    var hybridWidgetCreated = false;
    
    // ✅ UTILITAIRES
    function hexToRgb(hex) {
      var result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
      if (result) {
        return parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16);
      }
      return '239, 68, 68';
    }
    
    // ✅ CRÉATION WIDGET HYBRIDE AMÉLIORÉ
    function createHybridWidget() {
      if (hybridWidgetCreated) {
        console.log('⚠️ Widget hybride déjà créé, ignore');
        return null;
      }
      
      console.log('🎨 Création widget hybride amélioré...');
      
      var container = document.createElement('div');
      container.id = 'chatseller-widget-hybrid';
      container.style.cssText = 'margin: 12px 0; width: 100%; position: relative; z-index: 999999;';
      
      var rgbColor = hexToRgb(primaryColor);
      
      container.innerHTML = '<button id="cs-btn-hybrid" style="width: 100%; padding: 16px 24px; background: ' + primaryColor + '; color: white; border: none; border-radius: ' + borderRadius + '; font-size: 15px; font-weight: 600; cursor: pointer; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 56px; box-shadow: 0 8px 25px rgba(' + rgbColor + ', 0.3); transition: all 0.3s ease;">' +
        '<svg style="width: 20px; height: 20px; stroke: white; fill: none; stroke-width: 2; flex-shrink: 0;" viewBox="0 0 24 24">' +
        '<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.906-1.479L3 21l2.521-5.094A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
        '</svg>' +
        '<span>' + buttonText + '</span>' +
        '</button>';
      
      // ✅ EVENT LISTENERS ROBUSTES
      var button = container.querySelector('#cs-btn-hybrid');
      if (button) {
        button.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('🖱️ Clic widget hybride détecté');
          openHybridChat();
        };
        
        // ✅ EFFETS VISUELS
        button.onmouseenter = function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 12px 35px rgba(' + rgbColor + ', 0.4)';
        };
        
        button.onmouseleave = function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 8px 25px rgba(' + rgbColor + ', 0.3)';
        };
      }
      
      hybridWidgetCreated = true;
      return container;
    }
    
    // ✅ OUVERTURE CHAT INTELLIGENTE
    function openHybridChat() {
      console.log('💬 Tentative ouverture chat hybride...');
      
      // Essayer d'abord le vrai widget si disponible
      if (window.ChatSeller && typeof window.ChatSeller.init === 'function' && realWidgetLoaded) {
        console.log('✅ Utilisation du vrai ChatSeller');
        try {
          if (window.ChatSeller.openChat) {
            window.ChatSeller.openChat();
            return;
          }
        } catch (error) {
          console.log('⚠️ Erreur avec le vrai widget, utilisation fallback:', error);
        }
      }
      
      // Fallback sur le chat amélioré
      console.log('🔄 Utilisation du chat fallback amélioré');
      openEnhancedChat();
    }
    
    // ✅ CHAT FALLBACK AVEC API RÉELLE
    function openEnhancedChat() {
      // Supprimer modal existant
      var existingModal = document.getElementById('cs-modal-enhanced');
      if (existingModal) {
        existingModal.remove();
      }
      
      var modal = document.createElement('div');
      modal.id = 'cs-modal-enhanced';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px); z-index: 2147483647; display: flex; align-items: center; justify-content: center; padding: 20px;';
      
      modal.innerHTML = '<div style="background: white; border-radius: 16px; padding: 24px; max-width: 450px; width: 100%; text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);">' +
        '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">' +
        '<h3 style="margin: 0; color: ' + primaryColor + '; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px;">' +
        '<svg style="width: 24px; height: 24px; stroke: ' + primaryColor + '; fill: none;" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>' +
        agentName + ' - ' + agentTitle + '</h3>' +
        '<button id="cs-close-enhanced" style="background: #f3f4f6; color: #6b7280; border: none; border-radius: 50%; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">×</button>' +
        '</div>' +
        '<div id="cs-messages-enhanced" style="margin: 16px 0; text-align: left; max-height: 350px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: linear-gradient(to bottom, #f9fafb, #ffffff);"></div>' +
        '<div style="display: flex; gap: 8px; margin-top: 16px;">' +
        '<input id="cs-input-enhanced" type="text" placeholder="Tapez votre message..." style="flex: 1; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 25px; outline: none; font-size: 14px; transition: border-color 0.2s;" />' +
        '<button id="cs-send-enhanced" style="padding: 12px 20px; background: ' + primaryColor + '; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: 600; min-width: 80px;">Envoyer</button>' +
        '</div>' +
        '</div>';
      
      document.body.appendChild(modal);
      
      // ✅ EVENT LISTENERS
      var closeBtn = modal.querySelector('#cs-close-enhanced');
      var sendBtn = modal.querySelector('#cs-send-enhanced');
      var input = modal.querySelector('#cs-input-enhanced');
      
      if (closeBtn) {
        closeBtn.onclick = function() {
          modal.remove();
          console.log('❌ Chat fermé');
        };
      }
      
      if (sendBtn) {
        sendBtn.onclick = function() {
          sendEnhancedMessage();
        };
      }
      
      if (input) {
        input.focus();
        input.onkeypress = function(e) {
          if (e.key === 'Enter' || e.keyCode === 13) {
            sendEnhancedMessage();
          }
        };
        
        input.onfocus = function() {
          this.style.borderColor = primaryColor;
        };
        
        input.onblur = function() {
          this.style.borderColor = '#e5e7eb';
        };
      }
      
      // Fermer en cliquant à l'extérieur
      modal.onclick = function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      };
      
      // ✅ MESSAGE D'ACCUEIL IMMÉDIAT
      console.log('👋 Envoi message d\\'accueil via API...');
      callChatAPI('', true).then(function(welcomeMsg) {
        addEnhancedMessage('agent', welcomeMsg);
      });
    }
    
    // ✅ APPEL API CHATSELLER RÉEL
    function callChatAPI(message, isWelcome) {
      console.log('🌐 Appel API ChatSeller:', { message: message, isWelcome: isWelcome });
      
      // Détection produit Shopify
      var productInfo = { name: null, price: null, url: window.location.href };
      if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product) {
        var sp = window.ShopifyAnalytics.meta.product;
        productInfo.name = sp.title;
        productInfo.price = sp.price / 100;
      }
      
      // ✅ CORRECTION CRITIQUE : S'assurer que c'est bien POST
      var requestOptions = {
        method: 'POST', // ✅ EXPLICITEMENT POST
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          shopId: shopId,
          message: isWelcome ? 'Bonjour' : message,
          conversationId: null,
          productInfo: productInfo,
          visitorId: 'visitor_' + Date.now(),
          isFirstMessage: isWelcome || false
        })
      };
      
      console.log('🌐 [DEBUG] Options de requête:', requestOptions);
      console.log('🌐 [DEBUG] URL complète:', apiUrl + '/api/v1/public/chat');
      
      return fetch(apiUrl + '/api/v1/public/chat', requestOptions)
        .then(function(response) {
          console.log('📥 [DEBUG] Réponse reçue:', response.status, response.statusText);
          if (!response.ok) {
            throw new Error('HTTP ' + response.status + ' - ' + response.statusText);
          }
          return response.json();
        })
        .then(function(data) {
          console.log('✅ Réponse API reçue:', data);
          return data.success ? data.data.message : 'Bonjour ! Je suis ' + agentName + ', ' + agentTitle + '. Comment puis-je vous aider ?';
        })
        .catch(function(error) {
          console.error('❌ Erreur API ChatSeller détaillée:', error);
          if (isWelcome) {
            return ${welcomeMessage ? `'${welcomeMessage.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'` : `'Bonjour ! Je suis ' + agentName + ', ' + agentTitle + '. Comment puis-je vous aider ?'`};
          }
          return 'Merci pour votre message ! Un conseiller va vous recontacter rapidement.';
        });
    }
    
    // ✅ ENVOI MESSAGE
    function sendEnhancedMessage() {
      var input = document.getElementById('cs-input-enhanced');
      if (!input || !input.value.trim()) return;
      
      var message = input.value.trim();
      input.value = '';
      
      addEnhancedMessage('user', message);
      
      callChatAPI(message, false).then(function(response) {
        addEnhancedMessage('agent', response);
      });
    }
    
    // ✅ AJOUT MESSAGE
    function addEnhancedMessage(type, content) {
      var container = document.getElementById('cs-messages-enhanced');
      if (!container) return;
      
      var msg = document.createElement('div');
      msg.style.cssText = 'margin: 12px 0; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.4; max-width: 85%; animation: fadeIn 0.3s ease;';
      
      if (type === 'user') {
        msg.style.cssText += 'background: ' + primaryColor + '; color: white; margin-left: auto; text-align: right; box-shadow: 0 2px 8px rgba(' + hexToRgb(primaryColor) + ', 0.3);';
        msg.textContent = content;
      } else {
        msg.style.cssText += 'background: white; color: #374151; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);';
        msg.innerHTML = '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><div style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e;"></div><strong style="color: ' + primaryColor + ';">' + agentName + '</strong></div>' + content.replace(/\\\\n/g, '<br>');
      }
      
      container.appendChild(msg);
      container.scrollTop = container.scrollHeight;
    }
    
    // ✅ INSERTION WIDGET AVEC SÉLECTEURS ÉTENDUS
    function insertHybridWidget(widget) {
      console.log('📍 Insertion widget hybride, position:', position);
      
      var targetElement = null;
      
      // ✅ SÉLECTEURS CTA ÉTENDUS (repris de nos corrections embed.ts)
      var ctaSelectors = [
        // Shopify modernes
        'form[action*="/cart/add"] button[type="submit"]',
        'form[action*="/cart/add"] [name="add"]',
        '.product-form__cart button',
        '.product-form__buttons button[name="add"]',
        '.product-form__buttons .btn--add-to-cart',
        '.product-single__add-to-cart',
        '.shopify-payment-button__button',
        'button[name="add"]:not([name="add-to-cart"])',
        '[data-shopify-add-to-cart]',
        '.product-form button[type="submit"]',
        
        // Thèmes Shopify populaires
        '.btn--add-to-cart',
        '.product__add-to-cart',
        '.product-single__cart-submit',
        '.product-form-cart__submit',
        '.cart-submit',
        
        // WooCommerce
        '.single_add_to_cart_button',
        'button[name="add-to-cart"]',
        '.wc-add-to-cart',
        '.add_to_cart_button',
        
        // Génériques
        'button[class*="add-to-cart"]',
        'button[class*="add-cart"]',
        'button[class*="buy"]',
        'button[class*="purchase"]',
        '.buy-button',
        '.purchase-button',
        '.add-to-basket',
        '[data-add-to-cart]'
      ];
      
      // ✅ CHERCHER LE PREMIER CTA VISIBLE
      for (var i = 0; i < ctaSelectors.length; i++) {
        var element = document.querySelector(ctaSelectors[i]);
        if (element && isElementVisible(element)) {
          targetElement = element;
          console.log('✅ CTA trouvé:', ctaSelectors[i]);
          break;
        }
      }
      
      // ✅ INSERTION SELON POSITION
      if (targetElement && targetElement.parentNode) {
        var parent = targetElement.parentNode;
        
        try {
          if (position === 'above-cta') {
            parent.insertBefore(widget, targetElement);
            console.log('✅ Widget inséré AVANT le CTA');
          } else if (position === 'below-cta') {
            if (targetElement.nextSibling) {
              parent.insertBefore(widget, targetElement.nextSibling);
            } else {
              parent.appendChild(widget);
            }
            console.log('✅ Widget inséré APRÈS le CTA');
          } else if (position === 'beside-cta') {
            var flexDiv = document.createElement('div');
            flexDiv.style.cssText = 'display: flex; gap: 12px; align-items: stretch; flex-wrap: wrap;';
            parent.insertBefore(flexDiv, targetElement);
            flexDiv.appendChild(targetElement);
            flexDiv.appendChild(widget);
            console.log('✅ Widget inséré À CÔTÉ du CTA');
          } else {
            parent.insertBefore(widget, targetElement);
            console.log('✅ Widget inséré par défaut');
          }
          return; // Succès
        } catch (insertError) {
          console.warn('⚠️ Erreur insertion près CTA:', insertError);
        }
      }
      
      // ✅ FALLBACKS ROBUSTES
      var fallbackSelectors = [
        '.product-form', '.product-single', '.product__info',
        '.product-details', '.woocommerce-product', '.product',
        '[data-product]', 'main', '.main-content'
      ];
      
      for (var j = 0; j < fallbackSelectors.length; j++) {
        var container = document.querySelector(fallbackSelectors[j]);
        if (container) {
          container.appendChild(widget);
          console.log('✅ Widget inséré dans fallback:', fallbackSelectors[j]);
          return;
        }
      }
      
      // ✅ DERNIER RECOURS : BODY
      document.body.appendChild(widget);
      widget.style.position = 'fixed';
      widget.style.bottom = '20px';
      widget.style.right = '20px';
      widget.style.maxWidth = '300px';
      widget.style.zIndex = '999999';
      console.log('⚠️ Widget inséré dans body (dernier recours)');
    }
    
    // ✅ HELPER : VÉRIFIER VISIBILITÉ
    function isElementVisible(element) {
      if (!element) return false;
      var style = window.getComputedStyle(element);
      return style.display !== 'none' && 
            style.visibility !== 'hidden' && 
            style.opacity !== '0' &&
            element.offsetWidth > 0 && 
            element.offsetHeight > 0;
    }
    
    // ✅ CHARGEMENT VRAI WIDGET EN ARRIÈRE-PLAN
    function loadRealWidget() {
      if (realWidgetAttempted) return;
      realWidgetAttempted = true;
      
      console.log('🔄 Tentative chargement vrai widget...');
      
      var script = document.createElement('script');
      script.src = 'https://widget.chatseller.app/embed.js?v=2.0&t=' + Date.now();
      script.async = true;
      
      script.onload = function() {
        console.log('✅ Vrai widget chargé avec succès');
        if (window.ChatSeller && typeof window.ChatSeller.init === 'function') {
          try {
            window.ChatSeller.init(window.ChatSellerConfig);
            realWidgetLoaded = true;
            console.log('✅ Vrai widget initialisé');
            
            // Masquer le widget hybride si le vrai fonctionne
            var hybridWidget = document.getElementById('chatseller-widget-hybrid');
            if (hybridWidget && window.ChatSeller.isReady) {
              hybridWidget.style.display = 'none';
              console.log('🔄 Widget hybride masqué, vrai widget actif');
            }
          } catch (error) {
            console.log('⚠️ Erreur initialisation vrai widget:', error);
          }
        }
      };
      
      script.onerror = function() {
        console.log('❌ Échec chargement vrai widget, mode fallback uniquement');
      };
      
      document.head.appendChild(script);
    }
    
    // ✅ INITIALISATION PRINCIPALE
    function initHybridWidget() {
      console.log('🚀 Initialisation widget hybride...');
      
      try {
        var widget = createHybridWidget();
        if (widget) {
          insertHybridWidget(widget);
          console.log('✅ Widget hybride créé et inséré avec succès !');
          
          // Charger le vrai widget en arrière-plan après 2s
          setTimeout(loadRealWidget, 2000);
        } else {
          console.error('❌ Échec création widget hybride');
        }
      } catch (error) {
        console.error('❌ Erreur initialisation widget hybride:', error);
      }
    }
    
    // ✅ DÉMARRAGE ROBUSTE
    function startWidget() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(initHybridWidget, 100);
        });
      } else {
        setTimeout(initHybridWidget, 100);
      }
    }
    
    // ✅ LANCEMENT
    startWidget();
    
    console.log('✅ ChatSeller Hybride v2 configuré et prêt');
    
  })();
  </script>`
  })

  // HELPER: Headers avec authentification 
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
          title: agentData.data.agent.title || getTypeLabel(agentData.data.agent.type || 'general'),
          type: agentData.data.agent.type,
          personality: agentData.data.agent.personality,
          productType: agentData.data.agent.productType || 'auto',
          customProductType: agentData.data.agent.customProductType || '',
          shopName: shopData?.data?.name || agentData.data.agent.shopName || 'cette boutique en ligne',
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
          buttonText: shopData?.data?.widget_config?.buttonText || 'Parler au vendeur',
          primaryColor: shopData?.data?.widget_config?.primaryColor || '#EC4899',
          position: shopData?.data?.widget_config?.position || 'above-cta',
          widgetSize: shopData?.data?.widget_config?.widgetSize || 'medium',
          theme: shopData?.data?.widget_config?.theme || 'modern',
          borderRadius: shopData?.data?.widget_config?.borderRadius || 'full',
          animation: shopData?.data?.widget_config?.animation || 'fade',
          autoOpen: shopData?.data?.widget_config?.autoOpen || false,
          showAvatar: shopData?.data?.widget_config?.showAvatar !== false,
          soundEnabled: shopData?.data?.widget_config?.soundEnabled !== false,
          mobileOptimized: shopData?.data?.widget_config?.mobileOptimized !== false,
          showTypingIndicator: shopData?.data?.widget_config?.showTypingIndicator !== false,
          offlineMessage: shopData?.data?.widget_config?.offlineMessage,
          isActive: shopData?.data?.widget_config?.isActive !== false,
          language: shopData?.data?.widget_config?.language || 'fr'
        },
        knowledgeBase: kbData.data || []
      }

      agentConfig.value = completeConfig
      console.log('✅ [useAgentConfig] Configuration chargée:', {
        agent: completeConfig.agent.name,
        title: completeConfig.agent.title,
        productType: completeConfig.agent.productType,
        customProductType: completeConfig.agent.customProductType,
        shopName: completeConfig.agent.shopName,
        welcomeMessage: !!completeConfig.agent.welcomeMessage,
        widget: completeConfig.widget.buttonText
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

  // ✅ CORRECTION MAJEURE : Test IA réel
  const testAIMessage = async (message: string, agentId: string, isWelcomeTest = false) => {
    try {
      console.log('🧪 [testAIMessage] Test cohérent avec Widget:', { message, agentId, isWelcomeTest })
      
      if (!message.trim() && !isWelcomeTest) {
        throw new Error('Message vide')
      }

      if (!agentId) {
        throw new Error('Agent ID manquant')
      }

      // Utiliser le type de produit personnalisé dans la payload
      const getEffectiveProductType = () => {
        if (localConfig.value?.agent?.productType === 'produit' && localConfig.value?.agent?.customProductType) {
          return localConfig.value.agent.customProductType
        }
        return getProductTypeLabel(localConfig.value?.agent?.productType || 'auto')
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
            name: `Produit de test ${getEffectiveProductType()}`,
            price: 29900,
            id: 'test-product-123'
          },
          visitorId: `test-visitor-${Date.now()}`,
          isFirstMessage: isWelcomeTest 
        }
      })

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

  // ✅ CORRECTION MAJEURE : SAUVEGARDER CONFIGURATION COMPLÈTE
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

      console.log('💾 [saveCompleteConfig] Début sauvegarde:', {
        agentId,
        shopId,
        hasAgentUpdates: !!updates.agent,
        hasWidgetUpdates: !!updates.widget,
        agentTitle: updates.agent?.title,
        productType: updates.agent?.productType,
        customProductType: updates.agent?.customProductType,
        welcomeMessage: !!updates.agent?.welcomeMessage,
        isAutoSave
      })

      // ✅ SAUVEGARDER AGENT AVEC TOUS LES CHAMPS CORRIGÉS
      if (updates.agent) {
        console.log('💾 Sauvegarde configuration agent avec champs complets...', {
          title: updates.agent.title,
          productType: updates.agent.productType,
          customProductType: updates.agent.customProductType,
          welcomeMessage: !!updates.agent.welcomeMessage,
          specificInstructions: updates.agent.config?.specificInstructions
        })
        
        const agentPayload = {
          ...updates.agent,
          title: updates.agent.title || getTypeLabel(updates.agent.type || 'general'),
          productType: updates.agent.productType || 'auto',
          customProductType: updates.agent.customProductType || '',
          shopName: updates.agent.shopName || 'cette boutique',
          welcomeMessage: updates.agent.welcomeMessage || null, 
          config: {
            ...updates.agent.config,
            aiProvider: updates.agent.config?.aiProvider || 'openai',
            temperature: updates.agent.config?.temperature || 0.7,
            maxTokens: updates.agent.config?.maxTokens || 1000,
            specificInstructions: updates.agent.config?.specificInstructions || [] 
          }
        }
        
        console.log('📤 [AGENT SAVE] Payload complet:', {
          name: agentPayload.name,
          title: agentPayload.title,
          type: agentPayload.type,
          productType: agentPayload.productType,
          customProductType: agentPayload.customProductType,
          welcomeMessage: !!agentPayload.welcomeMessage,
          specificInstructionsCount: agentPayload.config.specificInstructions?.length || 0
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

        console.log('✅ Agent sauvegardé avec tous les champs')
      }

      // ✅ SAUVEGARDER WIDGET 
      if (updates.widget) {
        console.log('🎨 Sauvegarde configuration widget...', updates.widget)
        
        const widgetPayload = {
          widget_config: {
            buttonText: updates.widget.buttonText || 'Parler au vendeur',
            primaryColor: updates.widget.primaryColor || '#EC4899',
            position: updates.widget.position || 'above-cta',
            theme: updates.widget.theme || 'modern',
            language: updates.widget.language || 'fr',
            widgetSize: updates.widget.widgetSize || 'medium',
            borderRadius: updates.widget.borderRadius || 'full',
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

        console.log('📤 [saveCompleteConfig] Payload widget:', widgetPayload)
        
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

        console.log('✅ Widget sauvegardé:', widgetResult.data?.widget_config)
      }

      // METTRE À JOUR CONFIG LOCALE
      if (agentConfig.value) {
        if (updates.agent) {
          agentConfig.value.agent = { ...agentConfig.value.agent, ...updates.agent }
          if (!agentConfig.value.agent.title && agentConfig.value.agent.type) {
            agentConfig.value.agent.title = getTypeLabel(agentConfig.value.agent.type)
          }
          if (!agentConfig.value.agent.productType) {
            agentConfig.value.agent.productType = 'auto'
          }
          if (!agentConfig.value.agent.shopName) {
            agentConfig.value.agent.shopName = 'cette boutique'
          }
          console.log('✅ Config locale agent mise à jour')
        }
        if (updates.widget) {
          agentConfig.value.widget = { ...agentConfig.value.widget, ...updates.widget }
          console.log('✅ Widget config locale mise à jour')
        }
      }

      // MISE À JOUR STATE POUR SAUVEGARDE AUTO
      if (isAutoSave) {
        lastAutoSave.value = new Date()
        hasUnsavedChanges.value = false
      }

      widgetSyncStatus.value = 'synced'
      console.log('✅ Configuration complète sauvegardée et synchronisée')
      return { success: true, message: isAutoSave ? 'Sauvegarde automatique effectuée' : 'Configuration sauvegardée avec succès' }

    } catch (err: any) {
      console.error('❌ [useAgentConfig] Erreur saveCompleteConfig:', err)
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

  // LIER DOCUMENTS À LA BASE DE CONNAISSANCES
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

    // Helpers
    getProductTypeOptions,
    getProductTypeLabel,
    getTypeLabel,
    getBorderRadiusValue,
    hexToRgb,
    adjustColor,
    formatTime,
    getDefaultWelcomeTemplate,

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