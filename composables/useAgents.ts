// composables/useAgents.ts - VERSION FINALE AVEC TYPE GUARDS CORRECTS
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES
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

// ✅ INTERFACES AVEC GESTION D'ERREUR APPROPRIÉE
interface AgentsSuccessResponse {
  success: true
  data: Agent[]
  meta: {
    total: number
    planLimit: number
  }
}

interface AgentsErrorResponse {
  success: false
  error: string
  details?: any
  planLimit?: number
  currentCount?: number
}

type AgentsResponse = AgentsSuccessResponse | AgentsErrorResponse

interface AgentSuccessResponse {
  success: true
  data: Agent
}

interface AgentErrorResponse {
  success: false
  error: string
  details?: any
}

type AgentResponse = AgentSuccessResponse | AgentErrorResponse

interface DeleteSuccessResponse {
  success: true
}

interface DeleteErrorResponse {
  success: false
  error: string
}

type DeleteResponse = DeleteSuccessResponse | DeleteErrorResponse

interface ToggleSuccessResponse {
  success: true
  data: { updatedAt: string }
}

interface ToggleErrorResponse {
  success: false
  error: string
}

type ToggleResponse = ToggleSuccessResponse | ToggleErrorResponse

// ✅ TYPE GUARDS POUR VÉRIFIER LES TYPES
function isSuccessResponse<T extends { success: boolean }>(response: T): response is T & { success: true } {
  return response.success === true
}

function isErrorResponse<T extends { success: boolean }>(response: T): response is T & { success: false; error: string } {
  return response.success === false
}

// ✅ COMPOSABLE PRINCIPAL
export const useAgents = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const agents = ref<Agent[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const planLimit = ref(1)

  // ✅ GETTERS
  const activeAgents = computed(() => 
    agents.value.filter(agent => agent.isActive)
  )

  const canCreateAgent = computed(() => 
    planLimit.value === -1 || agents.value.length < planLimit.value
  )

  const planLimitReached = computed(() => 
    planLimit.value !== -1 && agents.value.length >= planLimit.value
  )

  // ✅ HELPER: Headers avec authentification STRICTE
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error('🔐 Token d\'authentification manquant. Veuillez vous reconnecter.')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ HELPER: Gestion des erreurs API STRICTE
  const handleApiError = (err: any, defaultMessage: string) => {
    console.error('❌ [useAgents] API Error:', err)
    
    let errorMessage = defaultMessage
    
    // Gestion spécifique des erreurs d'authentification
    if (err.status === 401 || err.statusCode === 401) {
      authStore.clearAuth()
      errorMessage = 'Session expirée. Veuillez vous reconnecter.'
      // Rediriger vers login
      navigateTo('/auth/login')
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

  // ✅ RÉCUPÉRER TOUS LES AGENTS - VERSION PRODUCTION STRICTE
  const fetchAgents = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useAgents] Récupération des agents via API...')
      
      // ✅ VALIDATION STRICTE - PAS DE FALLBACK
      if (!authStore.token) {
        throw new Error('Token d\'authentification requis')
      }

      if (!authStore.userShopId) {
        throw new Error('Shop ID manquant dans la session utilisateur')
      }

      // ✅ APPEL API OBLIGATOIRE - AUCUN MOCK
      const response = await $fetch('/api/v1/agents', {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as AgentsResponse

      // ✅ TYPE GUARD STRICT
      if (isErrorResponse(response)) {
        throw new Error(response.error || 'Réponse API invalide')
      }

      // ✅ ICI TYPESCRIPT SAIT QUE C'EST UNE AgentsSuccessResponse
      if (!Array.isArray(response.data)) {
        throw new Error('Format de données invalide reçu de l\'API')
      }

      agents.value = response.data
      planLimit.value = response.meta?.planLimit || 1
      
      console.log(`✅ [useAgents] ${response.data.length} agents récupérés depuis l'API`)
      return { success: true, data: response.data }

    } catch (err: any) {
      console.error('❌ [useAgents] Erreur API critique:', err)
      
      // ✅ AUCUN FALLBACK MOCKÉS - ERREUR PURE
      const result = handleApiError(err, 'Impossible de récupérer les agents depuis l\'API')
      
      // Garder les agents vides en cas d'erreur
      agents.value = []
      planLimit.value = 0
      
      return result
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER UN AGENT - VERSION PRODUCTION
  const createAgent = async (data: CreateAgentData) => {
    saving.value = true
    error.value = null

    try {
      console.log('🏗️ [useAgents] Création agent via API:', data.name)
      
      // ✅ VALIDATION ENTRÉE
      if (!data.name?.trim()) {
        throw new Error('Le nom de l\'agent est requis')
      }

      if (!data.welcomeMessage?.trim()) {
        throw new Error('Le message d\'accueil est requis')
      }
      
      const response = await $fetch('/api/v1/agents', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          ...data,
          shopId: authStore.userShopId
        }
      }) as AgentResponse

      // ✅ TYPE GUARD STRICT
      if (isErrorResponse(response)) {
        throw new Error(response.error || 'Erreur lors de la création')
      }

      // ✅ MISE À JOUR ÉTAT LOCAL
      agents.value.unshift(response.data)
      console.log(`✅ [useAgents] Agent créé avec succès: ${response.data.id}`)
      
      return { success: true, data: response.data }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la création de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ MODIFIER UN AGENT - VERSION PRODUCTION
  const updateAgent = async (id: string, data: UpdateAgentData) => {
    saving.value = true
    error.value = null

    try {
      console.log('📝 [useAgents] Modification agent via API:', id)
      
      if (!id) {
        throw new Error('ID agent requis pour la modification')
      }
      
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: data
      }) as AgentResponse

      // ✅ TYPE GUARD STRICT
      if (isErrorResponse(response)) {
        throw new Error(response.error || 'Erreur lors de la modification')
      }

      // ✅ MISE À JOUR ÉTAT LOCAL
      const index = agents.value.findIndex(agent => agent.id === id)
      if (index !== -1) {
        agents.value[index] = { ...agents.value[index], ...response.data }
      }
      
      console.log(`✅ [useAgents] Agent modifié avec succès: ${id}`)
      return { success: true, data: response.data }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ SUPPRIMER UN AGENT - VERSION PRODUCTION
  const deleteAgent = async (id: string) => {
    saving.value = true
    error.value = null

    try {
      console.log('🗑️ [useAgents] Suppression agent via API:', id)
      
      if (!id) {
        throw new Error('ID agent requis pour la suppression')
      }
      
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as DeleteResponse

      // ✅ TYPE GUARD STRICT
      if (isErrorResponse(response)) {
        throw new Error(response.error || 'Erreur lors de la suppression')
      }

      // ✅ MISE À JOUR ÉTAT LOCAL
      agents.value = agents.value.filter(agent => agent.id !== id)
      console.log(`✅ [useAgents] Agent supprimé avec succès: ${id}`)
      
      return { success: true }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la suppression de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ ACTIVER/DÉSACTIVER UN AGENT - VERSION PRODUCTION
  const toggleAgentStatus = async (id: string, isActive: boolean) => {
    saving.value = true
    error.value = null

    try {
      console.log(`🔄 [useAgents] ${isActive ? 'Activation' : 'Désactivation'} agent via API:`, id)
      
      const response = await $fetch(`/api/v1/agents/${id}/toggle`, {
        method: 'PATCH',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { isActive }
      }) as ToggleResponse

      // ✅ TYPE GUARD STRICT
      if (isErrorResponse(response)) {
        throw new Error(response.error || 'Erreur lors de la modification du statut')
      }

      // ✅ MISE À JOUR ÉTAT LOCAL
      const index = agents.value.findIndex(agent => agent.id === id)
      if (index !== -1) {
        agents.value[index].isActive = isActive
        agents.value[index].updatedAt = response.data.updatedAt
      }
      
      console.log(`✅ [useAgents] Statut modifié: ${id} -> ${isActive ? 'actif' : 'inactif'}`)
      return { success: true }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification du statut')
    } finally {
      saving.value = false
    }
  }

  // ✅ DUPLIQUER UN AGENT - VERSION PRODUCTION
  const duplicateAgent = async (id: string) => {
    saving.value = true
    error.value = null

    try {
      console.log('📋 [useAgents] Duplication agent via API:', id)
      
      if (!canCreateAgent.value) {
        throw new Error(`Limite du plan atteinte (${planLimit.value} agent(s) maximum)`)
      }
      
      const response = await $fetch(`/api/v1/agents/${id}/duplicate`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as AgentResponse

      // ✅ TYPE GUARD STRICT
      if (isErrorResponse(response)) {
        throw new Error(response.error || 'Erreur lors de la duplication')
      }

      // ✅ MISE À JOUR ÉTAT LOCAL
      agents.value.unshift(response.data)
      console.log(`✅ [useAgents] Agent dupliqué avec succès: ${response.data.id}`)
      
      return { success: true, data: response.data }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la duplication de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ TEST CONNEXION API
  const testApiConnection = async () => {
    try {
      console.log('🔍 [useAgents] Test connexion API...')
      
      const response = await $fetch('/health', {
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('✅ [useAgents] API accessible:', response)
      return { success: true, data: response }
      
    } catch (err: any) {
      console.error('❌ [useAgents] API inaccessible:', err)
      return { success: false, error: err.message || 'API inaccessible' }
    }
  }

  // ✅ OBTENIR UN AGENT PAR ID
  const getAgent = (id: string): Agent | null => {
    return agents.value.find(agent => agent.id === id) || null
  }

  // ✅ OBTENIR LE LIBELLÉ D'UN TYPE
  const getTypeLabel = (type: Agent['type']): string => {
    const labels = {
      general: 'Vendeur généraliste',
      product_specialist: 'Spécialiste produit',
      support: 'Support & SAV',
      upsell: 'Upsell & Cross-sell'
    }
    return labels[type] || type
  }

  // ✅ OBTENIR LE LIBELLÉ D'UNE PERSONNALITÉ
  const getPersonalityLabel = (personality: Agent['personality']): string => {
    const labels = {
      professional: 'Professionnel',
      friendly: 'Amical',
      expert: 'Expert technique',
      casual: 'Décontracté'
    }
    return labels[personality] || personality
  }

  // ✅ OBTENIR L'ICÔNE D'UN TYPE
  const getAgentIcon = (type: Agent['type']): string => {
    const icons = {
      general: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      product_specialist: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      support: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
      upsell: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    }
    return icons[type] || icons.general
  }

  // ✅ OBTENIR LA CLASSE CSS POUR L'AVATAR
  const getAvatarClass = (type: Agent['type']): string => {
    const classes = {
      general: 'bg-blue-500',
      product_specialist: 'bg-green-500',
      support: 'bg-orange-500',
      upsell: 'bg-purple-500'
    }
    return classes[type] || 'bg-blue-500'
  }

  // ✅ OBTENIR LA CLASSE CSS POUR LE BADGE DE STATUT
  const getStatusBadgeClass = (isActive: boolean): string => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES ET PROPRIÉTÉS
  return {
    // State
    agents: readonly(agents),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    planLimit: readonly(planLimit),

    // Computed
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