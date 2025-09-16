// composables/useQuotas.ts

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { checkQuotaUsage, type PlanQuotas } from '~/types/plans'

// ✅ Types inchangés (interface publique préservée)
export interface QuotaUsage {
  aiResponses: number
  knowledgeDocuments: number
  indexablePages: number
  agents: number
}

export type QuotaType = keyof QuotaUsage

export interface AgentCostInfo {
  additionalAgentCost: number
  totalMonthlyCost: number
  basePlanCost: number
}

export interface QuotaAlert {
  type: 'warning' | 'critical' | 'exceeded'
  quota: QuotaType
  message: string
  percentage: number
}

export const useQuotas = () => {
  const authStore = useAuthStore()
  // ✅ CHANGEMENT PRINCIPAL : Utiliser useApi() au lieu de $fetch
  const api = useApi()
  
  // State (inchangé)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ✅ COMPUTED : Status quotas en temps réel (inchangé)
  const quotaStatus = computed(() => {
    if (!authStore.user) return null
    
    const plan = authStore.currentPlan
    const usage = authStore.quotasUsage
    
    return checkQuotaUsage(plan, usage)
  })

  // ✅ COMPUTED : Informations sur les coûts des agents (corrigé)
  const agentCostInfo = computed((): AgentCostInfo => {
    const plan = authStore.planDetails
    const agentCount = quotaStatus.value?.agents.used || 0
    const additionalAgentCost = quotaStatus.value?.agents.additionalCost || 0
    
    return {
      additionalAgentCost,
      basePlanCost: plan.monthlyPrice || 0, // ✅ CORRECTION : monthlyPrice au lieu de price
      totalMonthlyCost: (plan.monthlyPrice || 0) + additionalAgentCost // ✅ CORRECTION
    }
  })

  // ✅ COMPUTED : Alertes quotas (inchangé)
  const quotaAlerts = computed((): QuotaAlert[] => {
    if (!quotaStatus.value) return []
    
    const alerts: QuotaAlert[] = []
    const quotasToCheck: QuotaType[] = ['aiResponses', 'knowledgeDocuments', 'indexablePages']
    
    quotasToCheck.forEach((quota) => {
      const status = quotaStatus.value![quota]
      const { used, limit, exceeded } = status
      
      if (limit === -1) return
      
      const percentage = (used / limit) * 100
      
      if (exceeded) {
        alerts.push({
          type: 'exceeded',
          quota,
          message: `Quota ${getQuotaLabel(quota)} dépassé (${used}/${limit})`,
          percentage: 100
        })
      } else if (percentage >= 90) {
        alerts.push({
          type: 'critical',
          quota,
          message: `Quota ${getQuotaLabel(quota)} presque atteint (${Math.round(percentage)}%)`,
          percentage
        })
      } else if (percentage >= 75) {
        alerts.push({
          type: 'warning',
          quota,
          message: `Quota ${getQuotaLabel(quota)} à ${Math.round(percentage)}%`,
          percentage
        })
      }
    })
    
    return alerts.sort((a, b) => {
      const priority = { exceeded: 3, critical: 2, warning: 1 }
      return priority[b.type] - priority[a.type]
    })
  })

  // ✅ COMPUTED : Alertes coût agents (inchangé)
  const agentCostAlerts = computed(() => {
    const costInfo = agentCostInfo.value
    const agentCount = quotaStatus.value?.agents.used || 0
    
    if (costInfo.additionalAgentCost > 50) {
      return {
        type: 'info' as const,
        message: `${agentCount} agents actifs - Coût additionnel: ${costInfo.additionalAgentCost}€/mois`,
        showUpgradeOption: agentCount > 5
      }
    }
    
    return null
  })

  // ✅ COMPUTED : Résumé quotas pour dashboard (inchangé)
  const quotaSummary = computed(() => {
    if (!quotaStatus.value) return null
    
    const getColorForQuota = (used: number, limit: number, exceeded: boolean) => {
      if (limit === -1) return 'blue'
      if (exceeded) return 'red'
      return (used / limit) > 0.9 ? 'orange' : 'green'
    }
    
    return {
      aiResponses: {
        ...quotaStatus.value.aiResponses,
        label: 'Réponses IA',
        icon: '🤖',
        color: getColorForQuota(
          quotaStatus.value.aiResponses.used, 
          quotaStatus.value.aiResponses.limit, 
          quotaStatus.value.aiResponses.exceeded
        )
      },
      knowledgeDocuments: {
        ...quotaStatus.value.knowledgeDocuments,
        label: 'Documents',
        icon: '📄',
        color: getColorForQuota(
          quotaStatus.value.knowledgeDocuments.used, 
          quotaStatus.value.knowledgeDocuments.limit, 
          quotaStatus.value.knowledgeDocuments.exceeded
        )
      },
      indexablePages: {
        ...quotaStatus.value.indexablePages,
        label: 'Pages indexées',
        icon: '🔍',
        color: getColorForQuota(
          quotaStatus.value.indexablePages.used, 
          quotaStatus.value.indexablePages.limit, 
          quotaStatus.value.indexablePages.exceeded
        )
      },
      agents: {
        ...quotaStatus.value.agents,
        label: 'Agents IA',
        icon: '👥',
        color: 'blue',
        costInfo: `+${quotaStatus.value.agents.additionalCost}€/mois`
      }
    }
  })

  // ✅ HELPERS (inchangés)
  const getQuotaLabel = (quota: QuotaType): string => {
    const labels: Record<QuotaType, string> = {
      aiResponses: 'réponses IA',
      knowledgeDocuments: 'documents',
      indexablePages: 'pages indexées',
      agents: 'agents IA'
    }
    return labels[quota] || quota
  }

  // ✅ ACTION REFACTORISÉE : checkQuotaBeforeAction
  const checkQuotaBeforeAction = (quota: QuotaType, requiredAmount: number = 1): { 
    allowed: boolean 
    error?: string 
    remaining?: number 
  } => {
    if (!quotaStatus.value) {
      return { allowed: false, error: 'Status quotas non disponible' }
    }
    
    if (!(quota in quotaStatus.value)) {
      return { allowed: false, error: `Quota ${quota} non trouvé` }
    }
    
    const status = quotaStatus.value[quota]
    
    if (status.limit === -1) {
      return { allowed: true, remaining: -1 }
    }
    
    if (status.exceeded) {
      return { 
        allowed: false, 
        error: `Quota ${getQuotaLabel(quota)} dépassé. Passez à un plan supérieur.` 
      }
    }
    
    const remaining = status.limit - status.used
    if (remaining < requiredAmount) {
      return { 
        allowed: false, 
        error: `Quota ${getQuotaLabel(quota)} insuffisant. ${remaining}/${requiredAmount} disponible.` 
      }
    }
    
    return { allowed: true, remaining }
  }

  // ✅ ACTION REFACTORISÉE : incrementQuota
  const incrementQuota = async (quota: QuotaType, amount: number = 1): Promise<{
    success: boolean
    error?: string
    newUsage?: QuotaUsage
  }> => {
    loading.value = true
    error.value = null
    
    try {
      // Vérifier quota avant incrémentation
      const check = checkQuotaBeforeAction(quota, amount)
      if (!check.allowed) {
        return { success: false, error: check.error }
      }
      
      const shopId = authStore.userShopId
      if (!shopId) {
        throw new Error('Shop ID manquant')
      }

      // ✅ UTILISER API CENTRALISÉE au lieu de $fetch
      const response = await api.quotas.increment(quota, amount, shopId)

      if (response.success && response.data) {
        // Mettre à jour le store local
        await authStore.updateQuotasUsage(response.data.quotas_usage)
        
        console.log(`✅ Quota ${quota} incrémenté: +${amount}`)
        return { success: true, newUsage: response.data.quotas_usage }
      } else {
        throw new Error(response.error || 'Erreur lors de l\'incrémentation quota')
      }
      
    } catch (err: any) {
      console.error(`❌ Erreur incrémentation quota ${quota}:`, err)
      const errorMessage = err.message || 'Erreur quota'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // ✅ ACTION REFACTORISÉE : syncQuotasFromAPI
  const syncQuotasFromAPI = async (): Promise<{ success: boolean; error?: string }> => {
    loading.value = true
    error.value = null
    
    try {
      const shopId = authStore.userShopId
      if (!shopId) {
        throw new Error('Shop ID manquant')
      }

      // ✅ UTILISER API CENTRALISÉE au lieu de $fetch
      const response = await api.quotas.get(shopId)

      if (response.success && response.data) {
        await authStore.updateQuotasUsage(response.data.quotas_usage)
        console.log('✅ Quotas synchronisés depuis API')
        return { success: true }
      } else {
        throw new Error(response.error || 'Erreur lors de la synchronisation')
      }
      
    } catch (err: any) {
      console.error('❌ Erreur sync quotas:', err)
      const errorMessage = err.message || 'Erreur synchronisation quotas'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // ✅ ACTION REFACTORISÉE : resetMonthlyQuotas
  const resetMonthlyQuotas = async (): Promise<{ success: boolean; error?: string }> => {
    loading.value = true
    error.value = null
    
    try {
      const shopId = authStore.userShopId
      if (!shopId) {
        throw new Error('Shop ID manquant')
      }

      // ✅ UTILISER API CENTRALISÉE au lieu de $fetch
      const response = await api.quotas.reset(shopId)

      if (response.success && response.data) {
        await authStore.updateQuotasUsage(response.data.quotas_usage)
        console.log('✅ Quotas mensuels réinitialisés')
        return { success: true }
      } else {
        throw new Error(response.error || 'Erreur lors de la réinitialisation')
      }
      
    } catch (err: any) {
      console.error('❌ Erreur reset quotas:', err)
      const errorMessage = err.message || 'Erreur reset quotas'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // ✅ ACTION REFACTORISÉE : calculateMonthlyCost (utilise computed séparé)
  const calculateMonthlyCost = (): { 
    basePlan: number
    agentsCost: number
    totalCost: number
    planName: string
  } => {
    const plan = authStore.planDetails
    const costInfo = agentCostInfo.value
    
    return {
      basePlan: costInfo.basePlanCost,
      agentsCost: costInfo.additionalAgentCost,
      totalCost: costInfo.totalMonthlyCost,
      planName: plan.name
    }
  }

  const clearError = () => {
    error.value = null
  }

  // ✅ INTERFACE PUBLIQUE IDENTIQUE - Aucun impact sur les autres fichiers
  return {
    // State
    loading,
    error,
    
    // Computed
    quotaStatus,
    quotaAlerts,
    quotaSummary,
    agentCostInfo,
    
    // Actions (signatures identiques)
    checkQuotaBeforeAction,
    incrementQuota,
    syncQuotasFromAPI,
    resetMonthlyQuotas,
    calculateMonthlyCost,
    
    // Helpers (signatures identiques)
    getQuotaLabel,
    clearError
  }
}