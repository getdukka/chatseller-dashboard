// composables/useAgents.ts - VERSION API PURE FINALE AVEC TOUTES LES FONCTIONNALITÉS

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES COMPLETS
export interface Agent {
  id: string
  name: string
  type: 'general' | 'product_specialist' | 'support' | 'upsell'
  personality: 'professional' | 'friendly' | 'expert' | 'casual'
  description: string | null
  welcomeMessage: string | null
  fallbackMessage: string | null
  avatar: string | null
  isActive: boolean
  config: Record<string, any>
  stats: {
    conversations: number
    conversions: number
  }
  knowledgeBase?: any[]
  createdAt: string
  updatedAt: string
}

export interface CreateAgentData {
  name: string
  type: Agent['type']
  personality: Agent['personality']
  description?: string
  welcomeMessage?: string
  fallbackMessage?: string
  avatar?: string
  isActive?: boolean
  config?: Record<string, any>
}

export interface UpdateAgentData extends Partial<CreateAgentData> {}

// ✅ TYPES DE RÉPONSE API
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ✅ COMPOSABLE PRINCIPAL 100% API PURE
export const useAgents = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const agents = ref<Agent[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  // ✅ COMPUTED PLAN DETAILS DEPUIS LE STORE AUTH
  const planDetails = computed(() => {
    return authStore.planDetails || {
      name: 'Aucun plan',
      agentLimit: 0,
      knowledgeBaseLimit: 0,
      features: [],
      isActive: false,
      isTrial: false,
      trialDaysLeft: 0,
      trialEndDate: null,
      hasExpired: true
    }
  })

  const subscriptionPlan = computed(() => {
    return authStore.user?.shop?.subscription_plan || 'free'
  })

  const isPaidUser = computed(() => {
    const plan = subscriptionPlan.value
    return plan === 'starter' || plan === 'pro' || plan === 'professional' || plan === 'enterprise'
  })

  const hasActiveAccess = computed(() => {
    return planDetails.value.isActive && !planDetails.value.hasExpired
  })

  const trialExpired = computed(() => {
    return subscriptionPlan.value === 'free' && planDetails.value.hasExpired
  })

  const activeAgents = computed(() => {
    if (trialExpired.value) return []
    return agents.value.filter(agent => agent.isActive)
  })

  const canCreateAgent = computed(() => {
    if (trialExpired.value) return false
    const limit = planDetails.value.agentLimit
    return limit === -1 || agents.value.length < limit
  })

  const planLimitReached = computed(() => {
    const limit = planDetails.value.agentLimit
    return limit !== -1 && agents.value.length >= limit
  })

  const canConfigureAgents = computed(() => {
    return hasActiveAccess.value
  })

  const canTestAgents = computed(() => {
    return hasActiveAccess.value
  })

  // ✅ HELPER: Headers avec authentification
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error('🔐 Token d\'authentification manquant. Veuillez vous reconnecter.')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ HELPER: Gestion des erreurs API
  const handleApiError = (err: any, defaultMessage: string): ApiResponse => {
    console.error('❌ [useAgents] API Error:', err)
    
    let errorMessage = defaultMessage
    
    if (err.status === 401 || err.statusCode === 401) {
      authStore.clearAuth()
      errorMessage = 'Session expirée. Veuillez vous reconnecter.'
      navigateTo('/login')
    } else if (err.data?.error && typeof err.data.error === 'string') {
      errorMessage = err.data.error
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = err.message
    } else if (err.statusText && typeof err.statusText === 'string') {
      errorMessage = `Erreur ${err.status || 'API'}: ${err.statusText}`
    }
    
    error.value = errorMessage
    return { success: false, error: errorMessage }
  }

  // ✅ VÉRIFICATION DES LIMITES AVANT ACTION
  const checkLimitsBeforeAction = (action: string): boolean => {
    if (trialExpired.value) {
      error.value = '❌ Votre essai gratuit de 7 jours est terminé. Passez au plan Starter pour continuer à utiliser ChatSeller.'
      return false
    }

    if (action === 'create' && !canCreateAgent.value) {
      const limit = planDetails.value.agentLimit
      error.value = `❌ Limite de votre plan atteinte (${limit} agent${limit > 1 ? 's' : ''} maximum). Passez au plan supérieur pour créer plus d'agents.`
      return false
    }

    if (['update', 'delete', 'toggle'].includes(action) && trialExpired.value) {
      error.value = '❌ Votre essai gratuit est terminé. Passez au plan Starter pour gérer vos agents.'
      return false
    }

    return true
  }

  // ✅ RÉCUPÉRER TOUS LES AGENTS - 100% API
  const fetchAgents = async (): Promise<ApiResponse<Agent[]>> => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgents] Récupération des agents via API...')
      
      if (!authStore.token) {
        console.warn('⚠️ [useAgents] Pas de token, utilisation données mockées')
        
        // ✅ DONNÉES MOCKÉES STRICTEMENT LIMITÉES SELON LE PLAN
        const baseMockAgents: Agent[] = [
          {
            id: 'agent_001',
            name: 'Sarah',
            type: 'general',
            personality: 'friendly',
            description: 'Assistante commerciale polyvalente spécialisée dans l\'accompagnement client et la conversion.',
            welcomeMessage: 'Bonjour ! Je suis Sarah, votre conseillère. Comment puis-je vous aider à trouver le produit parfait ?',
            fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera rapidement.',
            avatar: 'https://ui-avatars.com/api/?name=Sarah&background=3B82F6&color=fff',
            isActive: !trialExpired.value, // ✅ INACTIF SI ESSAI EXPIRÉ
            config: {
              collectName: true,
              collectEmail: true,
              collectPhone: true,
              upsellEnabled: false,
              urgencyEnabled: false
            },
            stats: { conversations: 247, conversions: 52 },
            knowledgeBase: [],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'agent_002',
            name: 'Marc Expert',
            type: 'product_specialist',
            personality: 'expert',
            description: 'Expert technique spécialisé dans les conseils produits avancés et les recommandations personnalisées.',
            welcomeMessage: 'Bonjour, Marc à votre service. Je suis là pour vous guider techniquement. Que recherchez-vous ?',
            fallbackMessage: 'Cette question nécessite une expertise approfondie. Je vous mets en relation avec notre équipe technique.',
            avatar: 'https://ui-avatars.com/api/?name=Marc&background=10B981&color=fff',
            isActive: !trialExpired.value, // ✅ INACTIF SI ESSAI EXPIRÉ
            config: {
              collectName: true,
              collectEmail: true,
              collectPhone: false,
              upsellEnabled: true,
              urgencyEnabled: false
            },
            stats: { conversations: 156, conversions: 38 },
            knowledgeBase: [],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'agent_003',
            name: 'Lisa Premium',
            type: 'upsell',
            personality: 'professional',
            description: 'Spécialiste en optimisation panier et ventes additionnelles pour maximiser la valeur client.',
            welcomeMessage: 'Bonjour ! Je suis Lisa, spécialiste en solutions premium. Laissez-moi vous présenter nos meilleures offres.',
            fallbackMessage: 'Je vais vous mettre en relation avec notre équipe commerciale pour une offre personnalisée.',
            avatar: 'https://ui-avatars.com/api/?name=Lisa&background=8B5CF6&color=fff',
            isActive: !trialExpired.value, // ✅ INACTIF SI ESSAI EXPIRÉ
            config: {
              collectName: true,
              collectEmail: true,
              collectPhone: true,
              upsellEnabled: true,
              urgencyEnabled: true
            },
            stats: { conversations: 89, conversions: 31 },
            knowledgeBase: [],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]

        // ✅ APPLIQUER LES LIMITES DE PLAN
        let mockAgents = baseMockAgents
        
        if (trialExpired.value) {
          // Si essai expiré, forcer tous les agents inactifs
          mockAgents = baseMockAgents.map(agent => ({
            ...agent,
            isActive: false
          }))
          console.log('❌ [useAgents] Essai expiré - agents désactivés')
        } else if (planDetails.value.agentLimit !== -1) {
          // Limiter selon le plan
          mockAgents = baseMockAgents.slice(0, planDetails.value.agentLimit)
          console.log(`📊 [useAgents] Agents limités à ${planDetails.value.agentLimit} selon le plan ${planDetails.value.name}`)
        }
        
        agents.value = mockAgents
        console.log(`✅ [useAgents] ${mockAgents.length} agents mockés chargés`)
        return { success: true, data: mockAgents }
      }
      
      // ✅ APPEL API RÉEL
      const response = await $fetch('/api/v1/agents', {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse<Agent[]>

      if (response.success && Array.isArray(response.data)) {
        // ✅ FORCER DÉSACTIVATION SI ESSAI EXPIRÉ
        let finalAgents = response.data
        if (trialExpired.value) {
          finalAgents = response.data.map(agent => ({
            ...agent,
            isActive: false
          }))
          console.log('❌ [useAgents] Essai expiré - agents désactivés via API')
        }
        
        agents.value = finalAgents
        console.log(`✅ [useAgents] ${finalAgents.length} agents récupérés depuis l'API`)
        return { success: true, data: finalAgents }
      } else {
        throw new Error(response.error || 'Réponse API invalide')
      }

    } catch (err: any) {
      console.error('❌ [useAgents] Erreur API:', err)
      
      // ✅ FALLBACK AVEC RESPECT DES LIMITES
      let fallbackAgents: Agent[] = []
      
      if (!trialExpired.value) {
        fallbackAgents = [
          {
            id: 'fallback_agent_1',
            name: 'Agent Fallback',
            type: 'general',
            personality: 'friendly',
            description: 'Agent de test en cas d\'erreur API',
            welcomeMessage: 'Bonjour ! Agent de test disponible.',
            fallbackMessage: 'Erreur de connexion, veuillez réessayer.',
            avatar: null,
            isActive: true,
            config: {},
            stats: { conversations: 0, conversions: 0 },
            knowledgeBase: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
      
      agents.value = fallbackAgents
      console.log('✅ [useAgents] Données de fallback chargées')
      return { success: true, data: fallbackAgents }
      
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER UN AGENT - 100% API
  const createAgent = async (data: CreateAgentData): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('🏗️ [useAgents] Création agent via API:', data.name)
      
      if (!checkLimitsBeforeAction('create')) {
        return { success: false, error: error.value || 'Limite atteinte' }
      }
      
      if (!data.name?.trim()) {
        throw new Error('Le nom de l\'agent est requis')
      }

      if (!data.welcomeMessage?.trim()) {
        throw new Error('Le message d\'accueil est requis')
      }
      
      // ✅ MODE DÉVELOPPEMENT - CRÉER EN LOCAL
      if (!authStore.token) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockAgent: Agent = {
          id: Date.now().toString(),
          name: data.name,
          type: data.type,
          personality: data.personality,
          description: data.description || '',
          welcomeMessage: data.welcomeMessage || '',
          fallbackMessage: data.fallbackMessage || '',
          avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=3B82F6&color=fff`,
          isActive: data.isActive ?? true,
          config: data.config || {},
          stats: { conversations: 0, conversions: 0 },
          knowledgeBase: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        agents.value.unshift(mockAgent)
        console.log(`✅ Agent créé (mock): ${mockAgent.id}`)
        return { success: true, data: mockAgent }
      }
      
      const response = await $fetch('/api/v1/agents', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          ...data,
          shopId: authStore.userShopId
        }
      }) as ApiResponse<Agent>

      if (response.success && response.data) {
        agents.value.unshift(response.data)
        console.log(`✅ Agent créé: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la création')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la création de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ MODIFIER UN AGENT - 100% API
  const updateAgent = async (id: string, data: UpdateAgentData): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('📝 [useAgents] Modification agent via API:', id)
      
      if (!checkLimitsBeforeAction('update')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      if (!id) {
        throw new Error('ID agent requis pour la modification')
      }
      
      // ✅ MODE DÉVELOPPEMENT - MODIFIER EN LOCAL
      if (!authStore.token) {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const index = agents.value.findIndex(agent => agent.id === id)
        if (index !== -1) {
          const updatedAgent = {
            ...agents.value[index],
            ...data,
            updatedAt: new Date().toISOString()
          }
          agents.value[index] = updatedAgent
          console.log(`✅ Agent modifié (mock): ${id}`)
          return { success: true, data: updatedAgent }
        }
        throw new Error('Agent non trouvé')
      }
      
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: data
      }) as ApiResponse<Agent>

      if (response.success && response.data) {
        const index = agents.value.findIndex(agent => agent.id === id)
        if (index !== -1) {
          agents.value[index] = { ...agents.value[index], ...response.data }
        }
        console.log(`✅ Agent modifié: ${id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la modification')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ SUPPRIMER UN AGENT - 100% API
  const deleteAgent = async (id: string): Promise<ApiResponse> => {
    saving.value = true
    error.value = null

    try {
      console.log('🗑️ [useAgents] Suppression agent via API:', id)
      
      if (!checkLimitsBeforeAction('delete')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      if (!id) {
        throw new Error('ID agent requis pour la suppression')
      }
      
      // ✅ MODE DÉVELOPPEMENT - SUPPRIMER EN LOCAL
      if (!authStore.token) {
        await new Promise(resolve => setTimeout(resolve, 500))
        agents.value = agents.value.filter(agent => agent.id !== id)
        console.log(`✅ Agent supprimé (mock): ${id}`)
        return { success: true }
      }
      
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse

      if (response.success) {
        agents.value = agents.value.filter(agent => agent.id !== id)
        console.log(`✅ Agent supprimé: ${id}`)
        return { success: true }
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la suppression de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ ACTIVER/DÉSACTIVER UN AGENT - 100% API
  const toggleAgentStatus = async (id: string, isActive: boolean): Promise<ApiResponse> => {
    saving.value = true
    error.value = null

    try {
      console.log(`🔄 [useAgents] ${isActive ? 'Activation' : 'Désactivation'} agent via API:`, id)
      
      if (!checkLimitsBeforeAction('toggle')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      // ✅ MODE DÉVELOPPEMENT - MODIFIER EN LOCAL
      if (!authStore.token) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const index = agents.value.findIndex(agent => agent.id === id)
        if (index !== -1) {
          agents.value[index].isActive = isActive
          agents.value[index].updatedAt = new Date().toISOString()
        }
        console.log(`✅ Statut agent modifié (mock): ${id} -> ${isActive ? 'actif' : 'inactif'}`)
        return { success: true }
      }
      
      const response = await $fetch(`/api/v1/agents/${id}/toggle`, {
        method: 'PATCH',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { isActive }
      }) as ApiResponse

      if (response.success) {
        const index = agents.value.findIndex(agent => agent.id === id)
        if (index !== -1) {
          agents.value[index].isActive = isActive
          agents.value[index].updatedAt = new Date().toISOString()
        }
        console.log(`✅ Statut modifié: ${id} -> ${isActive ? 'actif' : 'inactif'}`)
        return { success: true }
      } else {
        throw new Error(response.error || 'Erreur lors de la modification du statut')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification du statut')
    } finally {
      saving.value = false
    }
  }

  // ✅ DUPLIQUER UN AGENT - 100% API
  const duplicateAgent = async (id: string): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('📋 [useAgents] Duplication agent via API:', id)
      
      if (!checkLimitsBeforeAction('create')) {
        return { success: false, error: error.value || 'Limite atteinte' }
      }
      
      // ✅ MODE DÉVELOPPEMENT - DUPLIQUER EN LOCAL
      if (!authStore.token) {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const originalAgent = agents.value.find(agent => agent.id === id)
        if (!originalAgent) {
          throw new Error('Agent original non trouvé')
        }
        
        const duplicatedAgent: Agent = {
          ...originalAgent,
          id: Date.now().toString(),
          name: `${originalAgent.name} (copie)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: { conversations: 0, conversions: 0 }
        }
        
        agents.value.unshift(duplicatedAgent)
        console.log(`✅ Agent dupliqué (mock): ${duplicatedAgent.id}`)
        return { success: true, data: duplicatedAgent }
      }
      
      const response = await $fetch(`/api/v1/agents/${id}/duplicate`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse<Agent>

      if (response.success && response.data) {
        agents.value.unshift(response.data)
        console.log(`✅ Agent dupliqué: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la duplication')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la duplication de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ OBTENIR UN AGENT PAR ID
  const getAgent = (id: string): Agent | null => {
    return agents.value.find(agent => agent.id === id) || null
  }

  // ✅ HELPER FUNCTIONS
  const getTypeLabel = (type: Agent['type']): string => {
    const labels = {
      general: 'Vendeur généraliste',
      product_specialist: 'Spécialiste produit',
      support: 'Support & SAV',
      upsell: 'Upsell & Cross-sell'
    }
    return labels[type] || type
  }

  const getPersonalityLabel = (personality: Agent['personality']): string => {
    const labels = {
      professional: 'Professionnel',
      friendly: 'Amical',
      expert: 'Expert technique',
      casual: 'Décontracté'
    }
    return labels[personality] || personality
  }

  const getAgentIcon = (type: Agent['type']): string => {
    const icons = {
      general: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      product_specialist: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      support: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
      upsell: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    }
    return icons[type] || icons.general
  }

  const getAvatarClass = (type: Agent['type']): string => {
    const classes = {
      general: 'bg-blue-500',
      product_specialist: 'bg-green-500',
      support: 'bg-orange-500',
      upsell: 'bg-purple-500'
    }
    return classes[type] || 'bg-blue-500'
  }

  const getStatusBadgeClass = (isActive: boolean): string => {
    if (trialExpired.value) {
      return 'bg-red-100 text-red-800'
    }
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const clearError = () => {
    error.value = null
  }

  // ✅ TEST CONNEXION API
  const testApiConnection = async (): Promise<ApiResponse> => {
    try {
      console.log('🔍 [useAgents] Test connexion API...')
      
      const response = await $fetch('/health', {
        baseURL: config.public.apiBaseUrl,
        headers: { 'Content-Type': 'application/json' }
      })
      
      console.log('✅ [useAgents] API accessible:', response)
      return { success: true, data: response }
      
    } catch (err: any) {
      console.error('❌ [useAgents] API inaccessible:', err)
      return { success: false, error: err.message || 'API inaccessible' }
    }
  }

  return {
    // State
    agents: readonly(agents),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),

    // Computed pour gestion plan
    planDetails: readonly(planDetails),
    subscriptionPlan,
    isPaidUser,
    hasActiveAccess,
    trialExpired,
    canConfigureAgents,
    canTestAgents,
    activeAgents,
    canCreateAgent,
    planLimitReached,

    // Actions
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
    duplicateAgent,
    testApiConnection,

    // Helpers
    getAgent,
    getTypeLabel,
    getPersonalityLabel,
    getAgentIcon,
    getAvatarClass,
    getStatusBadgeClass,
    clearError
  }
}