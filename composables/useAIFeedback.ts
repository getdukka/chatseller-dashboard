// composables/useAIFeedback.ts - VERSION REFACTORISÉE avec useApi()

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { AIFeedback } from '~/types/beauty'

export interface FeedbackStats {
  totalFeedbacks: number
  averageRating: number
  feedbacksByType: {
    correction: number
    improvement: number
    validation: number
    negative: number
  }
  commonIssues: Array<{
    tag: string
    count: number
    percentage: number
    description: string 
  }>
  improvementSuggestions: string[]
  period: {
    days: number
    startDate: string
    endDate: string
  }
}

export const useAIFeedback = () => {
  const authStore = useAuthStore()
  // ✅ CHANGEMENT PRINCIPAL : Utiliser useApi() au lieu de $fetch
  const api = useApi()

  // State (inchangé)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const feedbacks = ref<AIFeedback[]>([])
  const feedbackStats = ref<FeedbackStats | null>(null)

  // ✅ Feedback tags prédéfinis (inchangé)
  const beautyFeedbackTags = [
    { id: 'product_knowledge', label: 'Connaissance produits', category: 'expertise' },
    { id: 'skin_diagnosis', label: 'Diagnostic peau', category: 'skincare' },
    { id: 'makeup_technique', label: 'Techniques maquillage', category: 'makeup' },
    { id: 'fragrance_matching', label: 'Correspondances parfums', category: 'fragrance' },
    { id: 'hair_analysis', label: 'Analyse capillaire', category: 'haircare' },
    { id: 'ingredient_explanation', label: 'Explication ingrédients', category: 'expertise' },
    { id: 'routine_building', label: 'Construction routine', category: 'skincare' },
    { id: 'color_matching', label: 'Correspondance couleurs', category: 'makeup' },
    { id: 'seasonal_advice', label: 'Conseils saisonniers', category: 'general' },
    { id: 'price_justification', label: 'Justification prix', category: 'sales' },
    { id: 'upsell_relevance', label: 'Pertinence upsell', category: 'sales' },
    { id: 'tone_appropriateness', label: 'Ton adapté', category: 'communication' },
    { id: 'response_length', label: 'Longueur réponse', category: 'communication' },
    { id: 'personalization', label: 'Personnalisation', category: 'communication' },
    { id: 'urgency_creation', label: 'Création urgence', category: 'sales' }
  ]

  // Computed (inchangé)
  const averageRating = computed(() => {
    if (feedbacks.value.length === 0) return 0
    const ratingsWithValue = feedbacks.value.filter(f => f.feedbackRating && f.feedbackRating > 0)
    if (ratingsWithValue.length === 0) return 0
    const sum = ratingsWithValue.reduce((acc, f) => acc + (f.feedbackRating || 0), 0)
    return Math.round((sum / ratingsWithValue.length) * 10) / 10
  })

  const totalCorrections = computed(() => {
    return feedbacks.value.filter(f => f.feedbackType === 'correction').length
  })

  const mostCommonIssues = computed(() => {
    const tagCounts = new Map<string, number>()
    
    feedbacks.value.forEach(feedback => {
      feedback.feedbackTags?.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    
    return Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => {
        const tagInfo = beautyFeedbackTags.find(t => t.id === tag)
        return {
          tag,
          count,
          label: tagInfo?.label || tag,
          category: tagInfo?.category || 'other'
        }
      })
  })

  // ✅ ACTION REFACTORISÉE : submitFeedback
  const submitFeedback = async (feedbackData: Omit<AIFeedback, 'id' | 'createdAt' | 'shopId'>) => {
    saving.value = true
    error.value = null

    try {
      // ✅ UTILISER API CENTRALISÉE au lieu de $fetch
      const response = await api.feedback.create({
        messageId: feedbackData.messageId,
        agentId: feedbackData.agentId,
        conversationId: feedbackData.conversationId,
        originalResponse: feedbackData.originalResponse,
        correctedResponse: feedbackData.correctedResponse,
        feedbackType: feedbackData.feedbackType,
        feedbackRating: feedbackData.feedbackRating,
        feedbackComment: feedbackData.feedbackComment,
        feedbackTags: feedbackData.feedbackTags || [],
        userCorrection: feedbackData.userCorrection,
        isPublic: feedbackData.isPublic || false,
        beautyCategory: feedbackData.beautyCategory || authStore.user?.shop?.beauty_category || 'multi'
      })

      if (response.success && response.data) {
        feedbacks.value.unshift(response.data)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de l\'envoi du feedback')
      }

    } catch (err: any) {
      console.error('Erreur submit feedback:', err)
      error.value = err.message || 'Erreur lors de l\'envoi du feedback'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ ACTION REFACTORISÉE : getFeedbacks
  const getFeedbacks = async (agentId?: string, limit: number = 50) => {
    loading.value = true
    error.value = null

    try {
      // ✅ UTILISER API CENTRALISÉE
      const response = await api.feedback.list({
        agentId,
        limit,
        offset: 0
      })

      if (response.success && response.data) {
        feedbacks.value = response.data
        return { 
          success: true, 
          data: response.data,
          meta: { limit, offset: 0, hasMore: response.data.length === limit }
        }
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des feedbacks')
      }

    } catch (err: any) {
      console.error('Erreur get feedbacks:', err)
      error.value = err.message || 'Erreur lors de la récupération des feedbacks'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ ACTION REFACTORISÉE : getFeedbackStats
  const getFeedbackStats = async (agentId?: string, days: number = 30) => {
    loading.value = true
    error.value = null

    try {
      // ✅ UTILISER API CENTRALISÉE
      const response = await api.feedback.getStats({
        agentId,
        days
      })

      if (response.success && response.data) {
        feedbackStats.value = response.data
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des statistiques')
      }

    } catch (err: any) {
      console.error('Erreur get feedback stats:', err)
      error.value = err.message || 'Erreur lors de la récupération des statistiques'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ ACTION REFACTORISÉE : deleteFeedback
  const deleteFeedback = async (feedbackId: string) => {
    saving.value = true
    error.value = null

    try {
      // ✅ UTILISER API CENTRALISÉE
      const response = await api.feedback.delete(feedbackId)

      if (response.success) {
        feedbacks.value = feedbacks.value.filter(f => f.id !== feedbackId)
        return { success: true }
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression')
      }

    } catch (err: any) {
      console.error('Erreur delete feedback:', err)
      error.value = err.message || 'Erreur lors de la suppression'
      return { success: false, error: error.value }
    } finally {
      saving.value = false
    }
  }

  // ✅ ACTION REFACTORISÉE : getBeautyFeedbackTags
  const getBeautyFeedbackTags = async (category?: string) => {
    try {
      // ✅ UTILISER API CENTRALISÉE
      const response = await api.feedback.getTags(category)

      if (response.success && response.data) {
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des tags')
      }

    } catch (err: any) {
      console.error('Erreur get beauty feedback tags:', err)
      // ✅ Fallback vers les tags locaux en cas d'erreur API (inchangé)
      const filteredTags = category 
        ? beautyFeedbackTags.filter(tag => tag.category === category)
        : beautyFeedbackTags
        
      return { success: true, data: filteredTags }
    }
  }

  // ✅ NOUVELLE ACTION : getFeedbacksPaginated (utilise API centralisée)
  const getFeedbacksPaginated = async (options: {
    agentId?: string;
    feedbackType?: string;
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    rating?: number;
  } = {}) => {
    loading.value = true
    error.value = null

    try {
      // ✅ UTILISER API CENTRALISÉE
      const response = await api.feedback.list(options)

      if (response.success && response.data) {
        // Si offset = 0, remplacer les feedbacks, sinon les ajouter (pagination)
        if ((options.offset || 0) === 0) {
          feedbacks.value = response.data
        } else {
          feedbacks.value.push(...response.data)
        }
        
        return { 
          success: true, 
          data: response.data,
          meta: {
            limit: options.limit || 50,
            offset: options.offset || 0,
            hasMore: response.data.length === (options.limit || 50)
          }
        }
      } else {
        throw new Error(response.error || 'Erreur lors de la récupération des feedbacks')
      }

    } catch (err: any) {
      console.error('Erreur get feedbacks paginated:', err)
      error.value = err.message || 'Erreur lors de la récupération des feedbacks'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ✅ HELPERS (inchangés - interface publique préservée)
  const createQuickFeedback = (
    messageId: string,
    agentId: string,
    conversationId: string,
    originalResponse: string,
    type: 'positive' | 'negative',
    rating?: number,
    tags?: string[]
  ) => {
    return {
      messageId,
      agentId,
      conversationId,
      originalResponse,
      feedbackType: type === 'positive' ? 'validation' as const : 'negative' as const,
      feedbackRating: rating,
      feedbackTags: tags || [],
      isPublic: false,
      beautyCategory: authStore.user?.shop?.beauty_category || 'multi'
    }
  }

  const createCorrectionFeedback = (
    messageId: string,
    agentId: string,
    conversationId: string,
    originalResponse: string,
    correctedResponse: string,
    comment?: string,
    tags?: string[]
  ) => {
    return {
      messageId,
      agentId,
      conversationId,
      originalResponse,
      correctedResponse,
      feedbackType: 'correction' as const,
      feedbackComment: comment,
      feedbackTags: tags || [],
      isPublic: true,
      beautyCategory: authStore.user?.shop?.beauty_category || 'multi'
    }
  }

  const clearError = () => {
    error.value = null
  }

  // ✅ INTERFACE PUBLIQUE IDENTIQUE - Aucun impact sur les autres fichiers
  return {
    // State
    loading,
    saving,
    error,
    feedbacks,
    feedbackStats,

    // Computed
    averageRating,
    totalCorrections,
    mostCommonIssues,

    // Data
    beautyFeedbackTags,

    // Actions (signatures identiques)
    submitFeedback,
    getFeedbacks,
    getFeedbacksPaginated,
    getFeedbackStats,
    deleteFeedback,
    getBeautyFeedbackTags,

    // Helpers (signatures identiques)
    createQuickFeedback,
    createCorrectionFeedback,
    clearError
  }
}