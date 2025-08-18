// composables/useAgents.ts 

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES COMPLETS
export interface Agent {
  id: string
  name: string
  title?: string // ✅ NOUVEAU: Title personnalisable
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
  title?: string // ✅ NOUVEAU: Title personnalisable
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
  meta?: any
}

// ✅ COMPOSABLE PRODUCTION PURE - 100% API
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
      name: 'Free',
      agentLimit: 1,
      knowledgeBaseLimit: 1,
      features: [],
      isActive: true,
      isTrial: true,
      trialDaysLeft: 7,
      trialEndDate: null,
      hasExpired: false
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

  // ✅ HELPER: Headers avec authentification ROBUSTE
  const getAuthHeaders = () => {
    if (!authStore.token) {
      console.error('❌ [useAgents] Token manquant - redirection vers login')
      navigateTo('/login')
      throw new Error('🔐 Session expirée. Redirection vers la connexion...')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ HELPER: Gestion des erreurs API AMÉLIORÉE
  const handleApiError = (err: any, defaultMessage: string): ApiResponse => {
    console.error('❌ [useAgents] API Error:', err)
    
    let errorMessage = defaultMessage
    
    if (err.status === 401 || err.statusCode === 401) {
      authStore.clearAuth()
      errorMessage = '🔐 Session expirée. Veuillez vous reconnecter.'
      navigateTo('/login')
    } else if (err.status === 403 || err.statusCode === 403) {
      errorMessage = '🚫 Accès refusé. Vérifiez vos permissions ou votre plan.'
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

  // ✅ VÉRIFICATION API DISPONIBLE
  const checkApiAvailable = async (): Promise<boolean> => {
    try {
      const response = await $fetch('/health', {
        baseURL: config.public.apiBaseUrl,
        timeout: 5000
      })
      
      if (response?.status === 'ok') {
        console.log('✅ [useAgents] API disponible:', config.public.apiBaseUrl)
        return true
      }
      
      console.warn('⚠️ [useAgents] API répond mais status incorrect:', response)
      return false
      
    } catch (error) {
      console.error('❌ [useAgents] API indisponible:', config.public.apiBaseUrl, error)
      throw new Error(`API indisponible sur ${config.public.apiBaseUrl}. Vérifiez que votre serveur local fonctionne.`)
    }
  }

  // ✅ RÉCUPÉRER TOUS LES AGENTS - 100% API PURE
  const fetchAgents = async (): Promise<ApiResponse<Agent[]>> => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgents] Récupération des agents via API pure...')
      
      // ✅ VÉRIFIER API DISPONIBLE
      await checkApiAvailable()
      
      // ✅ APPEL API DIRECT - PLUS DE FALLBACK MOCK
      const response = await $fetch('/api/v1/agents', {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse<Agent[]>

      console.log('📦 [useAgents] Réponse API brute:', response)

      if (response.success && Array.isArray(response.data)) {
        agents.value = response.data
        console.log(`✅ [useAgents] ${response.data.length} agents récupérés depuis l'API`)
        
        // ✅ LOG DES LIMITES DE PLAN
        const limit = planDetails.value.agentLimit
        console.log(`📊 [useAgents] Plan ${planDetails.value.name}: ${agents.value.length}/${limit === -1 ? '∞' : limit} agents`)
        
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la récupération des agents')
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER UN AGENT - 100% API PURE
  const createAgent = async (data: CreateAgentData): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('🏗️ [useAgents] Création agent via API pure:', data.name)
      
      // ✅ VÉRIFICATIONS PRÉALABLES
      if (!data.name?.trim()) {
        throw new Error('Le nom de l\'agent est requis')
      }

      if (!data.welcomeMessage?.trim()) {
        throw new Error('Le message d\'accueil est requis')
      }

      // ✅ VÉRIFIER LIMITES AVANT APPEL API
      if (!canCreateAgent.value) {
        const limit = planDetails.value.agentLimit
        throw new Error(`❌ Limite de votre plan atteinte (${limit} agent${limit > 1 ? 's' : ''} maximum). Passez au plan supérieur pour créer plus d'agents.`)
      }

      // ✅ VÉRIFIER API DISPONIBLE
      await checkApiAvailable()
      
      // ✅ CONSTRUIRE PAYLOAD AVEC TITLE
      const payload: CreateAgentData & { shopId?: string } = {
        name: data.name.trim(),
        title: data.title?.trim() || undefined, // ✅ NOUVEAU: Title personnalisable
        type: data.type,
        personality: data.personality,
        description: data.description?.trim() || null,
        welcomeMessage: data.welcomeMessage.trim(),
        fallbackMessage: data.fallbackMessage?.trim() || null,
        avatar: data.avatar || null,
        isActive: data.isActive ?? true,
        config: data.config || {},
        shopId: authStore.userShopId || authStore.user?.id
      }

      console.log('📤 [useAgents] Payload envoyé:', payload)
      
      const response = await $fetch('/api/v1/agents', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: payload
      }) as ApiResponse<Agent>

      console.log('📦 [useAgents] Réponse création:', response)

      if (response.success && response.data) {
        agents.value.unshift(response.data)
        console.log(`✅ Agent créé avec succès: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la création de l\'agent')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la création de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ MODIFIER UN AGENT - 100% API PURE
  const updateAgent = async (id: string, data: UpdateAgentData): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('📝 [useAgents] Modification agent via API pure:', id)
      
      if (!id) {
        throw new Error('ID agent requis pour la modification')
      }

      // ✅ VÉRIFIER API DISPONIBLE
      await checkApiAvailable()
      
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
        console.log(`✅ Agent modifié avec succès: ${id}`)
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

  // ✅ SUPPRIMER UN AGENT - 100% API PURE
  const deleteAgent = async (id: string): Promise<ApiResponse> => {
    saving.value = true
    error.value = null

    try {
      console.log('🗑️ [useAgents] Suppression agent via API pure:', id)
      
      if (!id) {
        throw new Error('ID agent requis pour la suppression')
      }

      // ✅ VÉRIFIER API DISPONIBLE
      await checkApiAvailable()
      
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse

      if (response.success) {
        agents.value = agents.value.filter(agent => agent.id !== id)
        console.log(`✅ Agent supprimé avec succès: ${id}`)
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

  // ✅ ACTIVER/DÉSACTIVER UN AGENT - 100% API PURE
  const toggleAgentStatus = async (id: string, isActive: boolean): Promise<ApiResponse> => {
    saving.value = true
    error.value = null

    try {
      console.log(`🔄 [useAgents] ${isActive ? 'Activation' : 'Désactivation'} agent via API pure:`, id)
      
      // ✅ VÉRIFIER API DISPONIBLE
      await checkApiAvailable()
      
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

  // ✅ DUPLIQUER UN AGENT - 100% API PURE
  const duplicateAgent = async (id: string): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('📋 [useAgents] Duplication agent via API pure:', id)
      
      // ✅ VÉRIFIER LIMITES AVANT DUPLICATION
      if (!canCreateAgent.value) {
        const limit = planDetails.value.agentLimit
        throw new Error(`❌ Limite de votre plan atteinte (${limit} agent${limit > 1 ? 's' : ''} maximum). Impossible de dupliquer.`)
      }

      // ✅ VÉRIFIER API DISPONIBLE
      await checkApiAvailable()
      
      const response = await $fetch(`/api/v1/agents/${id}/duplicate`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse<Agent>

      if (response.success && response.data) {
        agents.value.unshift(response.data)
        console.log(`✅ Agent dupliqué avec succès: ${response.data.id}`)
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

  // ✅ HELPER FUNCTIONS AVEC TITLE
  const getTypeLabel = (type: Agent['type']): string => {
    const labels = {
      general: 'Vendeur généraliste',
      product_specialist: 'Spécialiste produit',
      support: 'Support & SAV',
      upsell: 'Upsell & Cross-sell'
    }
    return labels[type] || type
  }

  const getDefaultTitle = (type: Agent['type']): string => {
    const titles = {
      general: 'Conseiller commercial',
      product_specialist: 'Spécialiste produit',
      support: 'Conseiller support',
      upsell: 'Conseiller premium'
    }
    return titles[type] || 'Assistant commercial'
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
        timeout: 5000
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
    getDefaultTitle, // ✅ NOUVEAU
    getPersonalityLabel,
    getAgentIcon,
    getAvatarClass,
    getStatusBadgeClass,
    clearError
  }
}