// composables/useAgents.ts - COMPOSABLE GESTION AGENTS
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

interface AgentsResponse {
  success: boolean
  data: Agent[]
  meta: {
    total: number
    planLimit: number
  }
}

interface AgentResponse {
  success: boolean
  data: Agent
}

interface ErrorResponse {
  error: string
  details?: any
  planLimit?: number
  currentCount?: number
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

  // ✅ HELPER: Headers avec authentification
  const getAuthHeaders = () => {
    if (!authStore.token) {
      throw new Error('Token d\'authentification manquant')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  // ✅ HELPER: Gestion des erreurs API
  const handleApiError = (err: any, defaultMessage: string) => {
    console.error('❌ API Error:', err)
    
    // Forcer le type string pour éviter les boolean/other
    let errorMessage = defaultMessage
    
    if (err.data?.error && typeof err.data.error === 'string') {
      errorMessage = err.data.error
    } else if (err.message && typeof err.message === 'string') {
      errorMessage = err.message
    } else if (err.statusText && typeof err.statusText === 'string') {
      errorMessage = `Erreur ${err.status || 'API'}: ${err.statusText}`
    }
    
    error.value = errorMessage
    return { success: false, error: errorMessage }
  }

  // ✅ RÉCUPÉRER TOUS LES AGENTS
  const fetchAgents = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 Récupération des agents...')
      
      const response = await $fetch('/api/agents', {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as AgentsResponse

      if (response.success) {
        agents.value = response.data
        planLimit.value = response.meta.planLimit
        console.log(`✅ ${response.data.length} agents récupérés`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la récupération des agents')
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER UN AGENT
  const createAgent = async (data: CreateAgentData) => {
    saving.value = true
    error.value = null

    try {
      console.log('🏗️ Création d\'un agent:', data.name)
      
      const response = await $fetch('/api/agents', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: data
      }) as AgentResponse

      if (response.success) {
        agents.value.unshift(response.data)
        console.log(`✅ Agent créé: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la création de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ MODIFIER UN AGENT
  const updateAgent = async (id: string, data: UpdateAgentData) => {
    saving.value = true
    error.value = null

    try {
      console.log('📝 Modification de l\'agent:', id)
      
      const response = await $fetch(`/api/agents/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: data
      }) as AgentResponse

      if (response.success) {
        const index = agents.value.findIndex(agent => agent.id === id)
        if (index !== -1) {
          agents.value[index] = { ...agents.value[index], ...response.data }
        }
        console.log(`✅ Agent modifié: ${id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ SUPPRIMER UN AGENT
  const deleteAgent = async (id: string) => {
    saving.value = true
    error.value = null

    try {
      console.log('🗑️ Suppression de l\'agent:', id)
      
      const response = await $fetch(`/api/agents/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as { success: boolean }

      if (response.success) {
        agents.value = agents.value.filter(agent => agent.id !== id)
        console.log(`✅ Agent supprimé: ${id}`)
        return { success: true }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la suppression de l\'agent')
    } finally {
      saving.value = false
    }
  }

  // ✅ ACTIVER/DÉSACTIVER UN AGENT
  const toggleAgentStatus = async (id: string, isActive: boolean) => {
    saving.value = true
    error.value = null

    try {
      console.log(`🔄 ${isActive ? 'Activation' : 'Désactivation'} de l'agent:`, id)
      
      const response = await $fetch(`/api/agents/${id}/toggle`, {
        method: 'PATCH',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { isActive }
      }) as { success: boolean; data: { updatedAt: string } }

      if (response.success) {
        const index = agents.value.findIndex(agent => agent.id === id)
        if (index !== -1) {
          agents.value[index].isActive = isActive
          agents.value[index].updatedAt = response.data.updatedAt
        }
        console.log(`✅ Statut agent modifié: ${id} -> ${isActive ? 'actif' : 'inactif'}`)
        return { success: true }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification du statut')
    } finally {
      saving.value = false
    }
  }

  // ✅ DUPLIQUER UN AGENT
  const duplicateAgent = async (id: string) => {
    saving.value = true
    error.value = null

    try {
      console.log('📋 Duplication de l\'agent:', id)
      
      const response = await $fetch(`/api/agents/${id}/duplicate`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as AgentResponse

      if (response.success) {
        agents.value.unshift(response.data)
        console.log(`✅ Agent dupliqué: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
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