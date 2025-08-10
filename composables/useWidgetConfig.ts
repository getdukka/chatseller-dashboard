// composables/useWidgetConfig.ts
// ✅ COMPOSABLE OPTIONNEL pour centraliser la logique Widget

import { ref, computed, watch, type Ref } from 'vue'

export interface WidgetConfig {
  buttonText: string
  primaryColor: string
  position: 'above-cta' | 'below-cta' | 'beside-cta' | 'bottom-right' | 'bottom-left'
  widgetSize: 'small' | 'medium' | 'large'
  theme: 'modern' | 'minimal' | 'brand_adaptive'
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animation: 'fade' | 'slide' | 'bounce' | 'none'
  autoOpen: boolean
  showAvatar: boolean
  soundEnabled: boolean
  mobileOptimized: boolean
  isActive: boolean
  language: 'fr' | 'en' | 'wo'
}

export interface AgentConfig {
  id: string
  name: string
  type: string
  personality: string
  welcomeMessage: string
  fallbackMessage: string
  avatar?: string
}

export function useWidgetConfig() {
  
  // ✅ STATE
  const widgetConfig = ref<WidgetConfig>({
    buttonText: 'Parler à un conseiller',
    primaryColor: '#3B82F6',
    position: 'above-cta',
    widgetSize: 'medium',
    theme: 'modern',
    borderRadius: 'md',
    animation: 'fade',
    autoOpen: false,
    showAvatar: true,
    soundEnabled: true,
    mobileOptimized: true,
    isActive: true,
    language: 'fr'
  })

  const syncStatus = ref<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const error = ref<string | null>(null)

  // ✅ PRESET COLORS
  const presetColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ]

  // ✅ COMPUTED
  const embedCode = computed(() => (shopId: string, agentConfig: AgentConfig) => {
    const config = {
      shopId,
      apiUrl: 'https://chatseller-api-production.up.railway.app',
      theme: widgetConfig.value.theme,
      primaryColor: widgetConfig.value.primaryColor,
      position: widgetConfig.value.position,
      buttonText: widgetConfig.value.buttonText,
      language: widgetConfig.value.language,
      autoDetectProduct: true,
      agentConfig: {
        id: agentConfig.id,
        name: agentConfig.name,
        title: getTypeLabel(agentConfig.type),
        welcomeMessage: agentConfig.welcomeMessage,
        fallbackMessage: agentConfig.fallbackMessage,
        personality: agentConfig.personality
      }
    }

    return `<!-- Code d'intégration ChatSeller - ${agentConfig.name} -->
<script>
  window.ChatSellerConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://widget.chatseller.app/embed.js" async></script>
<!-- Fin du code ChatSeller -->`
  })

  const previewStyles = computed(() => ({
    backgroundColor: widgetConfig.value.primaryColor,
    borderRadius: getBorderRadiusValue(widgetConfig.value.borderRadius),
    padding: getWidgetPadding(widgetConfig.value.widgetSize),
    fontSize: getWidgetFontSize(widgetConfig.value.widgetSize)
  }))

  // ✅ METHODS
  const updateConfig = (updates: Partial<WidgetConfig>) => {
    widgetConfig.value = { ...widgetConfig.value, ...updates }
    triggerSync()
  }

  const selectPresetColor = (color: string) => {
    updateConfig({ primaryColor: color })
  }

  const toggleFeature = (feature: keyof WidgetConfig) => {
    if (typeof widgetConfig.value[feature] === 'boolean') {
      updateConfig({ [feature]: !widgetConfig.value[feature] })
    }
  }

  const resetToDefaults = () => {
    widgetConfig.value = {
      buttonText: 'Parler à un conseiller',
      primaryColor: '#3B82F6',
      position: 'above-cta',
      widgetSize: 'medium',
      theme: 'modern',
      borderRadius: 'md',
      animation: 'fade',
      autoOpen: false,
      showAvatar: true,
      soundEnabled: true,
      mobileOptimized: true,
      isActive: true,
      language: 'fr'
    }
    triggerSync()
  }

  const triggerSync = () => {
    if (syncStatus.value !== 'syncing') {
      syncStatus.value = 'syncing'
      
      // Simuler synchronisation
      setTimeout(() => {
        syncStatus.value = 'synced'
        setTimeout(() => {
          syncStatus.value = 'idle'
        }, 2000)
      }, 500)
    }
  }

  const saveConfiguration = async (shopId: string) => {
    try {
      syncStatus.value = 'syncing'
      
      const response = await $fetch(`/api/shops/${shopId}/widget`, {
        method: 'PUT',
        body: {
          widgetConfig: widgetConfig.value
        }
      })

      if (response.success) {
        syncStatus.value = 'synced'
        setTimeout(() => {
          syncStatus.value = 'idle'
        }, 2000)
        return { success: true }
      } else {
        throw new Error(response.error)
      }

    } catch (err: any) {
      console.error('❌ Erreur sauvegarde widget:', err)
      syncStatus.value = 'error'
      error.value = err.message
      
      setTimeout(() => {
        syncStatus.value = 'idle'
        error.value = null
      }, 3000)
      
      return { success: false, error: err.message }
    }
  }

  const loadConfiguration = async (shopId: string) => {
    try {
      const response = await $fetch(`/api/shops/${shopId}/widget`)
      
      if (response.success && response.data.widgetConfig) {
        widgetConfig.value = { ...widgetConfig.value, ...response.data.widgetConfig }
        return { success: true }
      }
      
      return { success: false, error: 'Configuration non trouvée' }

    } catch (err: any) {
      console.error('❌ Erreur chargement widget:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // ✅ HELPERS
  const getBorderRadiusValue = (radius: string): string => {
    const radiusMap = {
      none: '0px', sm: '4px', md: '8px', lg: '12px', xl: '16px'
    }
    return radiusMap[radius as keyof typeof radiusMap] || '8px'
  }

  const getWidgetPadding = (size: string): string => {
    const paddingMap = {
      small: '8px 16px', medium: '12px 24px', large: '16px 32px'
    }
    return paddingMap[size as keyof typeof paddingMap] || '12px 24px'
  }

  const getWidgetFontSize = (size: string): string => {
    const fontSizeMap = {
      small: '13px', medium: '15px', large: '17px'
    }
    return fontSizeMap[size as keyof typeof fontSizeMap] || '15px'
  }

  const getPositionLabel = (position: string): string => {
    const positionLabels = {
      'above-cta': 'Au-dessus du CTA',
      'below-cta': 'En-dessous du CTA',
      'beside-cta': 'À côté du CTA',
      'bottom-right': 'Coin bas droite',
      'bottom-left': 'Coin bas gauche'
    }
    return positionLabels[position as keyof typeof positionLabels] || position
  }

  const getWidgetSizeLabel = (size: string): string => {
    const sizeLabels = { small: 'Petit', medium: 'Moyen', large: 'Grand' }
    return sizeLabels[size as keyof typeof sizeLabels] || size
  }

  const getTypeLabel = (type: string): string => {
    const labels = {
      general: 'Vendeur généraliste',
      product_specialist: 'Spécialiste produit',
      support: 'Support & SAV',
      upsell: 'Upsell & Cross-sell'
    }
    return labels[type as keyof typeof labels] || type
  }

  const adjustColor = (color: string, percent: number): string => {
    try {
      const hex = color.replace('#', '')
      if (hex.length !== 6) return color
      
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      const adjust = (channel: number) => {
        const adjusted = channel + (channel * percent / 100)
        return Math.max(0, Math.min(255, Math.round(adjusted)))
      }
      
      const newR = adjust(r)
      const newG = adjust(g)
      const newB = adjust(b)
      
      return `rgb(${newR}, ${newG}, ${newB})`
    } catch (error) {
      console.warn('⚠️ Erreur ajustement couleur:', error)
      return color
    }
  }

  // ✅ WATCHERS
  watch(widgetConfig, () => {
    triggerSync()
  }, { deep: true })

  // ✅ RETURN
  return {
    // State
    widgetConfig,
    syncStatus,
    error,
    presetColors,
    
    // Computed
    embedCode,
    previewStyles,
    
    // Methods
    updateConfig,
    selectPresetColor,
    toggleFeature,
    resetToDefaults,
    saveConfiguration,
    loadConfiguration,
    
    // Helpers
    getBorderRadiusValue,
    getWidgetPadding,
    getWidgetFontSize,
    getPositionLabel,
    getWidgetSizeLabel,
    getTypeLabel,
    adjustColor
  }
}

// ✅ UTILISATION DANS agent-config.vue :
/*
import { useWidgetConfig } from '~/composables/useWidgetConfig'

// Dans setup()
const {
  widgetConfig,
  syncStatus,
  presetColors,
  selectPresetColor,
  toggleFeature,
  resetToDefaults,
  saveConfiguration,
  loadConfiguration,
  previewStyles,
  embedCode
} = useWidgetConfig()

// Exemple d'utilisation :
const selectColor = (color: string) => selectPresetColor(color)
const toggleAutoOpen = () => toggleFeature('autoOpen')
const saveWidget = () => saveConfiguration(agentId.value)
*/