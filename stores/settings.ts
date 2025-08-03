// stores/settings.ts
import { defineStore } from 'pinia'
import type { Shop } from '~/composables/useApi'
import { useAnalytics } from './analytics'
import { useAuthStore } from './auth'

interface AgentSettings {
  agentName: string
  agentAvatar?: string
  primaryColor: string
  welcomeMessage: string
  fallbackMessage: string
  enableUpsell: boolean
  upsellRules: UpsellRule[]
  businessHours: {
    enabled: boolean
    timezone: string
    schedule: WeeklySchedule
  }
  autoResponses: {
    greeting: string
    closing: string
    offline: string
  }
}

interface UpsellRule {
  id: string
  name: string
  condition: {
    productNames: string[]
    minQuantity?: number
  }
  offer: {
    productName: string
    discount?: number
    message: string
  }
  enabled: boolean
}

interface WeeklySchedule {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

interface DaySchedule {
  enabled: boolean
  openTime: string // HH:mm format
  closeTime: string // HH:mm format
}

interface SettingsState {
  settings: AgentSettings | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastFetch: Date | null
  hasUnsavedChanges: boolean
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    settings: null,
    isLoading: false,
    isSaving: false,
    error: null,
    lastFetch: null,
    hasUnsavedChanges: false
  }),

  getters: {
    // Agent display settings
    agentName: (state) => state.settings?.agentName || 'Assistant IA',
    agentAvatar: (state) => state.settings?.agentAvatar,
    primaryColor: (state) => state.settings?.primaryColor || '#3B82F6',
    welcomeMessage: (state) => state.settings?.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?',
    
    // Business settings
    isUpsellEnabled: (state) => state.settings?.enableUpsell || false,
    activeUpsellRules: (state) => state.settings?.upsellRules?.filter(rule => rule.enabled) || [],
    businessHours: (state) => state.settings?.businessHours,
    
    // Status checks
    isBusinessOpen: (state) => {
      if (!state.settings?.businessHours?.enabled) return true
      
      const now = new Date()
      const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }) as keyof WeeklySchedule
      const schedule = state.settings.businessHours.schedule[dayName]
      
      if (!schedule.enabled) return false
      
      const currentTime = now.toTimeString().slice(0, 5) // HH:mm
      return currentTime >= schedule.openTime && currentTime <= schedule.closeTime
    },
    
    // Configuration completion
    configurationScore: (state) => {
      if (!state.settings) return 0
      
      let score = 0
      const maxScore = 10
      
      // Basic settings (4 points)
      if (state.settings.agentName && state.settings.agentName !== 'Assistant IA') score += 1
      if (state.settings.agentAvatar) score += 1
      if (state.settings.welcomeMessage !== 'Bonjour ! Comment puis-je vous aider ?') score += 1
      if (state.settings.primaryColor !== '#3B82F6') score += 1
      
      // Advanced settings (3 points)
      if (state.settings.fallbackMessage) score += 1
      if (state.settings.autoResponses.greeting) score += 1
      if (state.settings.businessHours.enabled) score += 1
      
      // Upsell configuration (3 points)
      if (state.settings.enableUpsell) score += 1
      if (state.settings.upsellRules && state.settings.upsellRules.length > 0) score += 1
      if (state.settings.upsellRules && state.settings.upsellRules.some(rule => rule.enabled)) score += 1
      
      return Math.round((score / maxScore) * 100)
    },
    
    // Check if data needs refresh (30 minutes for settings)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      return state.lastFetch < thirtyMinutesAgo
    }
  },

  actions: {
    // =====================================
    // FETCH ACTIONS
    // =====================================
    
    /**
     * Fetch agent settings for current shop
     */
    async fetchSettings(forceRefresh = false): Promise<void> {
      // Skip if data is fresh and not forcing refresh
      if (!forceRefresh && !this.needsRefresh) {
        return
      }

      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const { shops } = useApi()
        const response = await shops.get(userShopId.value)

        if (response.success && response.data) {
          // Convert shop settings to agent settings format
          this.settings = this.convertShopToAgentSettings(response.data)
          this.lastFetch = new Date()
          this.hasUnsavedChanges = false
          this.error = null
        } else {
          this.error = response.error || 'Erreur lors du chargement des paramètres'
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des paramètres'
        console.error('Fetch settings error:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Save agent settings
     */
    async saveSettings(): Promise<boolean> {
      if (!this.settings) {
        this.error = 'Aucuns paramètres à sauvegarder'
        return false
      }

      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return false
      }

      this.isSaving = true
      this.error = null

      try {
        const { shops } = useApi()
        const shopSettings = this.convertAgentToShopSettings(this.settings)
        
        const response = await shops.update(userShopId.value, shopSettings)

        if (response.success) {
          this.hasUnsavedChanges = false
          this.lastFetch = new Date()
          
          // Track settings update
          const { trackEvent } = useAnalytics()
          await trackEvent('settings_updated', {
            configurationScore: this.configurationScore,
            upsellEnabled: this.settings.enableUpsell,
            businessHoursEnabled: this.settings.businessHours.enabled
          })

          return true
        } else {
          this.error = response.error || 'Erreur lors de la sauvegarde des paramètres'
          return false
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la sauvegarde des paramètres'
        console.error('Save settings error:', error)
        return false
      } finally {
        this.isSaving = false
      }
    },

    // =====================================
    // SETTINGS MANAGEMENT
    // =====================================
    
    /**
     * Update agent basic settings
     */
    updateAgentSettings(updates: Partial<Pick<AgentSettings, 'agentName' | 'agentAvatar' | 'primaryColor' | 'welcomeMessage' | 'fallbackMessage'>>): void {
      if (!this.settings) return
      
      Object.assign(this.settings, updates)
      this.hasUnsavedChanges = true
    },

    /**
     * Update auto responses
     */
    updateAutoResponses(responses: Partial<AgentSettings['autoResponses']>): void {
      if (!this.settings) return
      
      Object.assign(this.settings.autoResponses, responses)
      this.hasUnsavedChanges = true
    },

    /**
     * Update business hours
     */
    updateBusinessHours(businessHours: Partial<AgentSettings['businessHours']>): void {
      if (!this.settings) return
      
      Object.assign(this.settings.businessHours, businessHours)
      this.hasUnsavedChanges = true
    },

    /**
     * Update day schedule
     */
    updateDaySchedule(day: keyof WeeklySchedule, schedule: Partial<DaySchedule>): void {
      if (!this.settings) return
      
      Object.assign(this.settings.businessHours.schedule[day], schedule)
      this.hasUnsavedChanges = true
    },

    /**
     * Toggle upsell feature
     */
    toggleUpsell(enabled: boolean): void {
      if (!this.settings) return
      
      this.settings.enableUpsell = enabled
      this.hasUnsavedChanges = true
    },

    /**
     * Add upsell rule
     */
    addUpsellRule(rule: Omit<UpsellRule, 'id'>): void {
      if (!this.settings) return
      
      const newRule: UpsellRule = {
        ...rule,
        id: `upsell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      
      this.settings.upsellRules.push(newRule)
      this.hasUnsavedChanges = true
    },

    /**
     * Update upsell rule
     */
    updateUpsellRule(ruleId: string, updates: Partial<UpsellRule>): void {
      if (!this.settings) return
      
      const rule = this.settings.upsellRules.find(r => r.id === ruleId)
      if (rule) {
        Object.assign(rule, updates)
        this.hasUnsavedChanges = true
      }
    },

    /**
     * Delete upsell rule
     */
    deleteUpsellRule(ruleId: string): void {
      if (!this.settings) return
      
      const index = this.settings.upsellRules.findIndex(r => r.id === ruleId)
      if (index !== -1) {
        this.settings.upsellRules.splice(index, 1)
        this.hasUnsavedChanges = true
      }
    },

    /**
     * Toggle upsell rule
     */
    toggleUpsellRule(ruleId: string, enabled: boolean): void {
      if (!this.settings) return
      
      const rule = this.settings.upsellRules.find(r => r.id === ruleId)
      if (rule) {
        rule.enabled = enabled
        this.hasUnsavedChanges = true
      }
    },

    // =====================================
    // UTILITY ACTIONS
    // =====================================
    
    /**
     * Reset settings to defaults
     */
    resetToDefaults(): void {
      this.settings = this.getDefaultSettings()
      this.hasUnsavedChanges = true
    },

    /**
     * Discard unsaved changes
     */
    discardChanges(): void {
      this.hasUnsavedChanges = false
      this.fetchSettings(true)
    },

    /**
     * Clear error
     */
    clearError(): void {
      this.error = null
    },

    /**
     * Clear all data (for logout)
     */
    clearData(): void {
      this.settings = null
      this.error = null
      this.lastFetch = null
      this.hasUnsavedChanges = false
    },

    // =====================================
    // CONVERSION HELPERS
    // =====================================
    
    /**
     * Convert shop data to agent settings format
     */
    convertShopToAgentSettings(shop: Shop): AgentSettings {
      return {
        agentName: shop.settings.agentName || 'Assistant IA',
        agentAvatar: shop.settings.agentAvatar,
        primaryColor: shop.settings.primaryColor || '#3B82F6',
        welcomeMessage: shop.settings.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?',
        fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
        enableUpsell: false,
        upsellRules: [],
        businessHours: {
          enabled: false,
          timezone: 'Europe/Paris',
          schedule: this.getDefaultWeeklySchedule()
        },
        autoResponses: {
          greeting: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
          closing: 'Merci pour votre visite ! N\'hésitez pas à revenir si vous avez d\'autres questions.',
          offline: 'Nous sommes actuellement fermés. Laissez-nous un message et nous vous répondrons dès que possible.'
        }
      }
    },

    /**
     * Convert agent settings to shop format
     */
    convertAgentToShopSettings(settings: AgentSettings): Shop['settings'] {
      return {
        agentName: settings.agentName,
        agentAvatar: settings.agentAvatar,
        primaryColor: settings.primaryColor,
        welcomeMessage: settings.welcomeMessage
      }
    },

    /**
     * Get default settings
     */
    getDefaultSettings(): AgentSettings {
      return {
        agentName: 'Assistant IA',
        agentAvatar: undefined,
        primaryColor: '#3B82F6',
        welcomeMessage: 'Bonjour ! Comment puis-je vous aider ?',
        fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
        enableUpsell: false,
        upsellRules: [],
        businessHours: {
          enabled: false,
          timezone: 'Europe/Paris',
          schedule: this.getDefaultWeeklySchedule()
        },
        autoResponses: {
          greeting: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
          closing: 'Merci pour votre visite ! N\'hésitez pas à revenir si vous avez d\'autres questions.',
          offline: 'Nous sommes actuellement fermés. Laissez-nous un message et nous vous répondrons dès que possible.'
        }
      }
    },

    /**
     * Get default weekly schedule
     */
    getDefaultWeeklySchedule(): WeeklySchedule {
      const defaultDay: DaySchedule = {
        enabled: true,
        openTime: '09:00',
        closeTime: '18:00'
      }

      return {
        monday: { ...defaultDay },
        tuesday: { ...defaultDay },
        wednesday: { ...defaultDay },
        thursday: { ...defaultDay },
        friday: { ...defaultDay },
        saturday: { enabled: false, openTime: '09:00', closeTime: '18:00' },
        sunday: { enabled: false, openTime: '09:00', closeTime: '18:00' }
      }
    },

    /**
     * Validate settings before save
     */
    validateSettings(): { isValid: boolean; errors: string[] } {
      const errors: string[] = []

      if (!this.settings) {
        errors.push('Paramètres manquants')
        return { isValid: false, errors }
      }

      // Validate agent name
      if (!this.settings.agentName || this.settings.agentName.trim().length < 2) {
        errors.push('Le nom de l\'agent doit contenir au moins 2 caractères')
      }

      // Validate welcome message
      if (!this.settings.welcomeMessage || this.settings.welcomeMessage.trim().length < 10) {
        errors.push('Le message de bienvenue doit contenir au moins 10 caractères')
      }

      // Validate primary color
      if (!this.settings.primaryColor || !/^#[0-9A-F]{6}$/i.test(this.settings.primaryColor)) {
        errors.push('La couleur primaire doit être un code hexadécimal valide')
      }

      // Validate upsell rules if enabled
      if (this.settings.enableUpsell) {
        this.settings.upsellRules.forEach((rule, index) => {
          if (!rule.name || rule.name.trim().length < 2) {
            errors.push(`Règle d'upsell ${index + 1}: Le nom est requis`)
          }
          if (!rule.condition.productNames || rule.condition.productNames.length === 0) {
            errors.push(`Règle d'upsell ${index + 1}: Au moins un produit déclencheur est requis`)
          }
          if (!rule.offer.productName || rule.offer.productName.trim().length < 2) {
            errors.push(`Règle d'upsell ${index + 1}: Le nom du produit à proposer est requis`)
          }
        })
      }

      return {
        isValid: errors.length === 0,
        errors
      }
    }
  }
})

// =====================================
// COMPOSABLE FOR EASY ACCESS
// =====================================

export const useSettings = () => {
  const settingsStore = useSettingsStore()
  
  return {
    // State
    settings: computed(() => settingsStore.settings),
    isLoading: computed(() => settingsStore.isLoading),
    isSaving: computed(() => settingsStore.isSaving),
    error: computed(() => settingsStore.error),
    hasUnsavedChanges: computed(() => settingsStore.hasUnsavedChanges),
    
    // Getters
    agentName: computed(() => settingsStore.agentName),
    agentAvatar: computed(() => settingsStore.agentAvatar),
    primaryColor: computed(() => settingsStore.primaryColor),
    welcomeMessage: computed(() => settingsStore.welcomeMessage),
    isUpsellEnabled: computed(() => settingsStore.isUpsellEnabled),
    activeUpsellRules: computed(() => settingsStore.activeUpsellRules),
    businessHours: computed(() => settingsStore.businessHours),
    isBusinessOpen: computed(() => settingsStore.isBusinessOpen),
    configurationScore: computed(() => settingsStore.configurationScore),
    
    // Actions
    fetchSettings: settingsStore.fetchSettings,
    saveSettings: settingsStore.saveSettings,
    updateAgentSettings: settingsStore.updateAgentSettings,
    updateAutoResponses: settingsStore.updateAutoResponses,
    updateBusinessHours: settingsStore.updateBusinessHours,
    updateDaySchedule: settingsStore.updateDaySchedule,
    toggleUpsell: settingsStore.toggleUpsell,
    addUpsellRule: settingsStore.addUpsellRule,
    updateUpsellRule: settingsStore.updateUpsellRule,
    deleteUpsellRule: settingsStore.deleteUpsellRule,
    toggleUpsellRule: settingsStore.toggleUpsellRule,
    resetToDefaults: settingsStore.resetToDefaults,
    discardChanges: settingsStore.discardChanges,
    clearError: settingsStore.clearError,
    clearData: settingsStore.clearData,
    validateSettings: settingsStore.validateSettings
  }
}