// composables/useAgents.ts

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useCache } from '~/composables/useCache' // ✅ NOUVEAU: Cache offline

// ✅ IMPORT TYPES CENTRALISÉS BEAUTÉ
import type {
  Agent,
  AgentType,
  BeautyAgentType,
  PersonalityType
} from '~/types/beauty'

import {
  BEAUTY_AGENT_TYPES,
  getTypeLabel,
  getAgentIcon,
  getAvatarClass
} from '~/types/beauty'

// ✅ INTERFACES POUR LES OPÉRATIONS CRUD
export interface CreateAgentData {
  name: string
  title?: string
  type: AgentType
  personality: PersonalityType
  description?: string
  welcomeMessage?: string
  fallbackMessage?: string
  avatar?: string
  isActive?: boolean
  config?: Record<string, any>
}

export interface UpdateAgentData extends Partial<Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'stats'>> {}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: any
}

export const useAgents = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const cache = useCache() // ✅ NOUVEAU: Instance cache

  // State réactif
  const agents = ref<Agent[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  // Computed basés sur le nouveau système beauté
  const planDetails = computed(() => {
    return authStore.planDetails
  })

  const subscriptionPlan = computed(() => {
    return authStore.currentPlan
  })

  const isPaidUser = computed(() => {
    return authStore.isPaidUser
  })

  const hasActiveAccess = computed(() => {
    return authStore.hasActiveAccess
  })

  const trialExpired = computed(() => {
    return authStore.trialExpired
  })

  const activeAgents = computed(() => {
    if (trialExpired.value) return []
    return agents.value.filter(agent => agent.isActive)
  })

  // ✅ NOUVEAU SYSTÈME : Agents illimités mais avec coût additionnel
  const canCreateAgent = computed(() => {
    // Plus de limite d'agents - vérifier seulement si essai expiré
    return !trialExpired.value
  })

  const planLimitReached = computed(() => {
    // Plus de limite de plan - toujours false
    return false
  })

  const canConfigureAgents = computed(() => {
    return hasActiveAccess.value
  })

  const canTestAgents = computed(() => {
    return hasActiveAccess.value
  })

  // ✅ NOUVEAU : Calcul du coût mensuel des agents
  const monthlyAgentsCost = computed(() => {
    const plan = planDetails.value
    if (!plan || plan.quotas.agents === -1 && plan.quotas.additionalAgentCost === 0) {
      return 0 // Plan Performance - agents inclus
    }
    
    const agentCount = agents.value.length
    if (agentCount <= 1) {
      return 0 // Premier agent inclus
    }
    
    return (agentCount - 1) * (plan.quotas.additionalAgentCost || 10)
  })

  // ✅ NOUVEAU : Estimation coût avec nouveaux agents
  const estimateAgentCost = (newAgentCount: number): number => {
    const plan = planDetails.value
    if (!plan || plan.quotas.additionalAgentCost === 0) return 0
    
    const totalAgents = agents.value.length + newAgentCount
    return Math.max(0, totalAgents - 1) * plan.quotas.additionalAgentCost
  }

  // Helper functions
  const getAuthHeaders = () => {
    if (!authStore.token) {
      console.error('Token manquant - redirection vers login')
      navigateTo('/login')
      throw new Error('Session expirée. Redirection vers la connexion...')
    }
    
    return {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json'
    }
  }

  const handleApiError = (err: any, defaultMessage: string): ApiResponse => {
    console.error('❌ [Agents] Erreur API:', err)

    let errorMessage = defaultMessage

    // Gestion des erreurs d'authentification
    if (err.status === 401 || err.statusCode === 401) {
      authStore.clearAuth()
      errorMessage = 'Session expirée. Veuillez vous reconnecter.'
      navigateTo('/login')
    }
    // Gestion des erreurs de permission
    else if (err.status === 403 || err.statusCode === 403) {
      errorMessage = 'Accès refusé. Vérifiez vos permissions ou votre plan.'
    }
    // Gestion des erreurs de connexion réseau (API offline/slow)
    else if (err.message?.includes('fetch') || err.code === 'NETWORK_ERROR' || !err.status) {
      errorMessage = 'Impossible de contacter nos serveurs. Vérifiez votre connexion internet et réessayez.'
      console.warn('⚠️ [Agents] Problème de connexion réseau - API potentiellement offline')
    }
    // Gestion des erreurs API spécifiques
    else if (err.data?.error && typeof err.data.error === 'string') {
      errorMessage = err.data.error
    }
    // Fallback sur le message d'erreur brut
    else if (err.message && typeof err.message === 'string') {
      // Nettoyer les messages techniques pour l'utilisateur
      if (err.message.includes('fetch')) {
        errorMessage = 'Problème de connexion. Veuillez réessayer dans quelques instants.'
      } else {
        errorMessage = err.message
      }
    }

    error.value = errorMessage
    return { success: false, error: errorMessage }
  }

  // ✅ RÉCUPÉRER TOUS LES AGENTS - AVEC CACHE OFFLINE
  const fetchAgents = async (forceRefresh: boolean = false): Promise<ApiResponse<Agent[]>> => {
    loading.value = true
    error.value = null

    // ✅ NOUVEAU: Essayer le cache d'abord (sauf si forceRefresh)
    if (!forceRefresh) {
      const cached = cache.get<Agent[]>('agents')
      if (cached) {
        console.log('🚀 [Agents] Utilisation cache offline')
        agents.value = cached
        loading.value = false
        return { success: true, data: cached }
      }
    }

    try {
      console.log('📡 [Agents] Récupération agents depuis API...')

      const apiUrl = config.public.apiBaseUrl || 'https://chatseller-api-production.up.railway.app'

      // ✅ CORRECTION : Utiliser l'endpoint agents directement
      const response = await $fetch('/api/v1/agents', {
        baseURL: apiUrl,
        headers: getAuthHeaders(),
        timeout: 10000
      }) as ApiResponse<Agent[]>

      if (response.success && Array.isArray(response.data)) {
        agents.value = response.data

        // ✅ NOUVEAU: Sauvegarder dans le cache (5 minutes)
        cache.set('agents', response.data, 300000)

        // Mettre à jour le nombre d'agents dans le store
        await authStore.updateAgentsCount(response.data.length)

        console.log(`✅ ${response.data.length} agents récupérés et mis en cache`)
        console.log(`💰 Coût mensuel agents: ${monthlyAgentsCost.value}€`)

        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Réponse API invalide')
      }

    } catch (err: any) {
      // ✅ NOUVEAU: En cas d'erreur réseau, essayer de retourner le cache même expiré
      const staleCache = cache.get<Agent[]>('agents')
      if (staleCache) {
        console.warn('⚠️ [Agents] Erreur API, utilisation cache expiré')
        agents.value = staleCache
        return { success: true, data: staleCache }
      }

      return handleApiError(err, 'Erreur lors de la récupération des agents')
    } finally {
      loading.value = false
    }
  }

  // ✅ AMÉLIORATION : Fonction helper pour vérification permissions
  const checkAgentPermissions = (action: 'create' | 'duplicate' | 'modify'): {
    allowed: boolean
    error?: string
    requiresUpgrade?: boolean
  } => {
    // Vérification essai expiré - BLOQUE TOUT
    if (trialExpired.value) {
      return {
        allowed: false,
        error: `Essai gratuit expiré. Passez au plan Starter (${planDetails.value.monthlyPrice}€/mois) pour continuer à utiliser vos agents.`,
        requiresUpgrade: true
      }
    }
    
    // Vérification accès actif
    if (!hasActiveAccess.value) {
      return {
        allowed: false,
        error: 'Accès suspendu. Vérifiez votre abonnement.',
        requiresUpgrade: true
      }
    }
    
    return { allowed: true }
  }

  // ✅ CRÉER UN AGENT - AVEC NOUVEAU SYSTÈME DE COÛT
    const createAgent = async (data: CreateAgentData): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('Création agent beauté:', data.name)
      
      // ✅ AMÉLIORATION : Vérification permissions en premier
      const permissions = checkAgentPermissions('create')
      if (!permissions.allowed) {
        if (permissions.requiresUpgrade) {
          // Rediriger vers billing si nécessaire
          setTimeout(() => navigateTo('/billing'), 2000)
        }
        throw new Error(permissions.error)
      }

      if (!data.name?.trim()) {
        throw new Error('Le nom de l\'agent est requis')
      }

      if (!data.welcomeMessage?.trim()) {
        throw new Error('Le message d\'accueil est requis')
      }

      // ✅ NOUVEAU : Confirmation coût avec gestion essai expiré
      const currentCount = agents.value.length
      const newCost = estimateAgentCost(1)
      const currentCost = monthlyAgentsCost.value

      if (newCost > currentCost) {
        const additionalCost = newCost - currentCost
        console.log(`Nouvel agent ajoutera ${additionalCost}€/mois au coût`)
        
        // L'interface doit avoir confirmé ce coût avant d'appeler cette fonction
        // Vérification de sécurité
        if (currentCount > 0) {
          console.log(`⚠️ Création agent ${currentCount + 1} - Coût additionnel: +${additionalCost}€/mois`)
        }
      }

      
      // ... reste de la logique de création inchangée
      
    } catch (err: any) {
      // ✅ AMÉLIORATION : Gestion erreurs spécifique essai expiré
      if (err.message.includes('essai expiré') || err.message.includes('Essai gratuit')) {
        error.value = `⏰ ${err.message}`
        // Auto-redirection vers billing après 3 secondes
        setTimeout(() => {
          if (process.client) {
            navigateTo('/billing')
          }
        }, 3000)
      } else {
        return handleApiError(err, 'Erreur lors de la création de l\'agent')
      }
    } finally {
      saving.value = false
    }
  }

  // ✅ MODIFIER UN AGENT - 100% API
  const updateAgent = async (id: string, data: UpdateAgentData): Promise<ApiResponse<Agent>> => {
    saving.value = true
    error.value = null

    try {
      console.log('Modification agent beauté:', id)
      
      if (!id) {
        throw new Error('ID agent requis pour la modification')
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
        console.log(`Agent modifié: ${id}`)
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

  // ✅ SUPPRIMER UN AGENT - AVEC NOUVEAU CALCUL DE COÛT
  const deleteAgent = async (id: string): Promise<ApiResponse> => {
    saving.value = true
    error.value = null

    try {
      console.log('Suppression agent beauté:', id)
      
      if (!id) {
        throw new Error('ID agent requis pour la suppression')
      }

      // Calculer économie après suppression
      const currentCost = monthlyAgentsCost.value
      const newCost = estimateAgentCost(-1)
      const savings = Math.max(0, currentCost - newCost)

      
      const response = await $fetch(`/api/v1/agents/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse

      if (response.success) {
        agents.value = agents.value.filter(agent => agent.id !== id)
        
        // Mettre à jour le nombre d'agents
        await authStore.updateAgentsCount(agents.value.length)
        
        console.log(`Agent supprimé: ${id}`)
        if (savings > 0) {
          console.log(`Économie mensuelle: ${savings}€`)
        }
        
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
      console.log(`${isActive ? 'Activation' : 'Désactivation'} agent beauté:`, id)
      
      // ✅ AMÉLIORATION : Vérification pour activation seulement
      if (isActive) {
        const permissions = checkAgentPermissions('modify')
        if (!permissions.allowed) {
          if (permissions.requiresUpgrade) {
            setTimeout(() => navigateTo('/billing'), 2000)
          }
          throw new Error(permissions.error)
        }
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
        console.log(`Statut modifié: ${id} -> ${isActive ? 'actif' : 'inactif'}`)
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

  // ✅ DUPLIQUER UN AGENT - AVEC CONFIRMATION DE COÛT
  const duplicateAgent = async (id: string): Promise<ApiResponse<Agent>> => {
  saving.value = true
  error.value = null

  try {
    console.log('Duplication agent beauté:', id)
    
    // ✅ AMÉLIORATION : Même vérification
    const permissions = checkAgentPermissions('duplicate')
    if (!permissions.allowed) {
      if (permissions.requiresUpgrade) {
        setTimeout(() => navigateTo('/billing'), 2000)
      }
      throw new Error(permissions.error)
    }
      
      // Calculer coût additionnel
      const additionalCost = estimateAgentCost(1) - monthlyAgentsCost.value
      
      if (additionalCost > 0) {
        console.log(`La duplication ajoutera ${additionalCost}€/mois`)
        // L'interface doit avoir confirmé ce coût
      }

      if (!canCreateAgent.value) {
        throw new Error('Essai gratuit expiré. Impossible de dupliquer.')
      }

      
      const response = await $fetch(`/api/v1/agents/${id}/duplicate`, {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as ApiResponse<Agent>

      if (response.success && response.data) {
        agents.value.unshift(response.data)
        
        // Mettre à jour le nombre d'agents
        await authStore.updateAgentsCount(agents.value.length)
        
        console.log(`Agent dupliqué: ${response.data.id}`)
        console.log(`Nouveau coût mensuel: ${monthlyAgentsCost.value}€`)
        
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la duplication')
      }

    } catch (error: any) {
    if (error.message.includes('essai expiré')) {
      setTimeout(() => navigateTo('/billing'), 3000)
    }
    return handleApiError(error, 'Erreur lors de la duplication de l\'agent')
  } finally {
    saving.value = false
  }
}

  // ✅ OBTENIR UN AGENT PAR ID
  const getAgent = (id: string): Agent | null => {
    return agents.value.find(agent => agent.id === id) || null
  }

  // ✅ HELPER FUNCTIONS BEAUTÉ CENTRALISÉES
  const getDefaultTitle = (type: AgentType): string => {
    const beautyType = BEAUTY_AGENT_TYPES[type as BeautyAgentType]
    if (beautyType) {
      return beautyType.label.replace(' IA', '').toLowerCase()
    }
    
    const classicTitles = {
      general: 'Conseiller commercial',
      product_specialist: 'Spécialiste produit',
      support: 'Conseiller support',
      upsell: 'Conseiller premium'
    }
    
    return classicTitles[type as keyof typeof classicTitles] || 'Assistant commercial'
  }

  const getPersonalityLabel = (personality: PersonalityType): string => {
    const labels = {
      professional: 'Professionnel',
      friendly: 'Amical',
      expert: 'Expert technique',
      casual: 'Décontracté'
    }
    return labels[personality] || personality
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

  const testApiConnection = async (): Promise<ApiResponse> => {
    try {
      console.log('Test connexion API...')
      
      const response = await $fetch('/health', {
        baseURL: config.public.apiBaseUrl,
        timeout: 5000
      }) as any
      
      console.log('API accessible:', response)
      return { success: true, data: response }
      
    } catch (err: any) {
      console.error('API inaccessible:', err)
      return { success: false, error: err.message || 'API inaccessible' }
    }
  }

  return {
    // State
    agents,
    loading,
    saving,
    error,

    // Computed pour gestion plan beauté
    planDetails,
    subscriptionPlan,
    isPaidUser,
    hasActiveAccess,
    trialExpired,
    canConfigureAgents,
    canTestAgents,
    activeAgents,
    canCreateAgent,
    planLimitReached,

    // ✅ NOUVEAU : Computed coûts
    monthlyAgentsCost,
    estimateAgentCost,

    // Actions
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
    duplicateAgent,
    testApiConnection,
    checkAgentPermissions,

    // Helpers
    getAgent,
    getDefaultTitle,
    getPersonalityLabel,
    clearError,

    // ✅ Helpers importés de types/beauty.ts
    getTypeLabel,
    getAgentIcon,
    getAvatarClass,
    getStatusBadgeClass
  }
}