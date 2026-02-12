// composables/useKnowledgeBase.ts 

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useQuotas } from '~/composables/useQuotas'
import { BEAUTY_CATEGORIES, validateBeautyFile } from '../constants/beauty'
import { checkQuotaUsage } from '~/types/plans'
import type { ApiErrorResponse, ApiResponse } from '~/composables/useApi'

// ✅ TYPES COMPLETS (restaurés)
export interface KnowledgeBaseDocument {
  id: string
  title: string
  content: string
  contentType: 'manual' | 'file' | 'url' | 'website'
  sourceFile?: string
  sourceUrl?: string
  tags: string[]
  isActive: boolean
  shopId: string
  linkedAgents?: string[]
  createdAt: string
  updatedAt: string
  metadata?: {
    fileSize?: number
    fileType?: string
    wordCount?: number
    lastProcessed?: string
    storagePath?: string
    originalFileName?: string
    beautyCategory?: string
    productType?: string
    [key: string]: any
  }
}

export interface CreateKnowledgeBaseData {
  title: string
  content: string
  contentType: KnowledgeBaseDocument['contentType']
  sourceFile?: string
  sourceUrl?: string
  tags?: string[]
  isActive?: boolean
  metadata?: Partial<KnowledgeBaseDocument['metadata']>
  beautyCategory?: string
  productType?: string
}

export interface UpdateKnowledgeBaseData extends Partial<CreateKnowledgeBaseData> {}

// ✅ INTERFACE PLAN DETAILS COMPLÈTE (restaurée)
interface PlanLimits {
  knowledgeDocuments: number // 50, 200, -1
  indexablePages: number // 500, 2000, -1
  aiResponses: number // 1000, 10000, -1
  agents: number // -1 (illimité pour tous)
}

interface PlanDetails {
  name: 'starter' | 'growth' | 'performance'
  limits: PlanLimits
  quotasStatus: ReturnType<typeof import('~/types/plans').checkQuotaUsage>
  trialDaysLeft: number
  trialEndDate: Date | null
  hasExpired: boolean
  fileSizeLimit?: number
}

export const useKnowledgeBase = () => {
  const authStore = useAuthStore()
  const { checkQuotaBeforeAction, incrementQuota } = useQuotas()
  const api = useApi()

  // ✅ STATE RÉACTIF (restauré)
  const documents = ref<KnowledgeBaseDocument[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

  // ✅ COMPUTED PLAN DETAILS COMPLET (restauré de l'original)
  const planDetails = computed((): PlanDetails => {
    try {
      const user = authStore.user
      const subscriptionPlan = user?.shop?.subscription_plan || 'starter'
      
      // ✅ CORRECTION : Normaliser le plan avant utilisation
      let normalizedPlan = subscriptionPlan.toLowerCase()
      
      // ✅ Mapper les anciens plans vers les nouveaux
      const planMapping: Record<string, string> = {
        'free': 'starter',
        'basic': 'starter', 
        'pro': 'growth',
        'professional': 'growth',
        'enterprise': 'performance'
      }
      
      if (planMapping[normalizedPlan]) {
        console.log(`🔄 [useKnowledgeBase] Migration plan ${subscriptionPlan} → ${planMapping[normalizedPlan]}`)
        normalizedPlan = planMapping[normalizedPlan]
      }
      
      // ✅ DÉFINIR LES LIMITES SELON LE PLAN
      const planLimits: PlanLimits = {
        knowledgeDocuments: normalizedPlan === 'starter' ? 50 : 
                           normalizedPlan === 'growth' ? 200 : -1,
        indexablePages: normalizedPlan === 'starter' ? 500 : 
                       normalizedPlan === 'growth' ? 2000 : -1,
        aiResponses: normalizedPlan === 'starter' ? 1000 : 
                    normalizedPlan === 'growth' ? 10000 : -1,
        agents: -1 // Tous les plans ont agents illimités
      }
      
      // ✅ Calcul sécurisé des dates d'essai
      let createdAt: Date
      try {
        createdAt = new Date(user?.shop?.createdAt || user?.shop?.created_at || Date.now())
      } catch {
        createdAt = new Date()
      }
      
      const now = new Date()
      const trialDays = 14 // Essai de 14 jours pour starter
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      const trialDaysLeft = Math.max(0, trialDays - daysSinceCreation)
      const trialEndDate = new Date(createdAt.getTime() + trialDays * 24 * 60 * 60 * 1000)
      
      // ✅ Calcul sécurisé du statut des quotas
      let quotasStatus
      try {
        quotasStatus = checkQuotaUsage(normalizedPlan, authStore.quotasUsage)
      } catch (quotaError) {
        console.warn('⚠️ [useKnowledgeBase] Erreur checkQuotaUsage, utilisation des valeurs par défaut:', quotaError)
        quotasStatus = {
          aiResponses: { used: authStore.quotasUsage.aiResponses || 0, limit: planLimits.aiResponses, exceeded: false },
          knowledgeDocuments: { used: authStore.quotasUsage.knowledgeDocuments || 0, limit: planLimits.knowledgeDocuments, exceeded: false },
          indexablePages: { used: authStore.quotasUsage.indexablePages || 0, limit: planLimits.indexablePages, exceeded: false },
          agents: { used: authStore.quotasUsage.agents || 0, limit: planLimits.agents, exceeded: false, additionalCost: 0 }
        }
      }
      
      return {
        name: normalizedPlan as 'starter' | 'growth' | 'performance',
        limits: planLimits,
        quotasStatus,
        trialDaysLeft,
        trialEndDate,
        hasExpired: normalizedPlan === 'starter' && trialDaysLeft <= 0,
        fileSizeLimit: 10 * 1024 * 1024 // 10MB pour tous les plans
      }
      
    } catch (error) {
      console.error('❌ [useKnowledgeBase] Erreur critique dans planDetails:', error)
      
      // ✅ Fallback complet en cas d'erreur critique
      return {
        name: 'starter',
        limits: {
          knowledgeDocuments: 50,
          indexablePages: 500,
          aiResponses: 1000,
          agents: -1
        },
        quotasStatus: {
          aiResponses: { used: 0, limit: 1000, exceeded: false },
          knowledgeDocuments: { used: 0, limit: 50, exceeded: false },
          indexablePages: { used: 0, limit: 500, exceeded: false },
          agents: { used: 0, limit: -1, exceeded: false, additionalCost: 0 }
        },
        trialDaysLeft: 14,
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        hasExpired: false,
        fileSizeLimit: 10 * 1024 * 1024
      }
    }
  })

  const currentDocumentCount = computed(() => documents.value?.length || 0)
  const documentLimit = computed(() => {
    try {
      return planDetails.value.limits.knowledgeDocuments
    } catch (err) {
      console.warn('⚠️ Erreur documentLimit, fallback:', err)
      return 50
    }
  })

  const canUploadDocument = computed(() => {
    try {
      if (planDetails.value.hasExpired) {
        return false // Essai expiré
      }

      if (documentLimit.value === -1) {
        return true // Plan Performance - illimité
      }

      return currentDocumentCount.value < documentLimit.value
    } catch (err) {
      console.warn('⚠️ Erreur canUploadDocument, fallback false:', err)
      return false
    }
  })

  const documentsRemaining = computed(() => {
    try {
      if (documentLimit.value === -1) {
        return -1 // Illimité
      }
      
      return Math.max(0, documentLimit.value - currentDocumentCount.value)
    } catch (err) {
      console.warn('⚠️ Erreur documentsRemaining, fallback 0:', err)
      return 0
    }
  })

  const isLimitReached = computed(() => {
    try {
      return !canUploadDocument.value && documentLimit.value !== -1
    } catch (err) {
      console.warn('⚠️ Erreur isLimitReached, fallback true:', err)
      return true
    }
  })

  // ✅ COMPUTED EXISTANTS (restaurés)
  const activeDocuments = computed(() => {
    try {
      return documents.value?.filter(doc => doc?.isActive) || []
    } catch (err) {
      console.warn('⚠️ Erreur activeDocuments:', err)
      return []
    }
  })

  const documentsByType = computed(() => {
    try {
      return documents.value?.reduce((acc, doc) => {
        if (!acc[doc.contentType]) {
          acc[doc.contentType] = []
        }
        acc[doc.contentType].push(doc)
        return acc
      }, {} as Record<string, KnowledgeBaseDocument[]>) || {}
    } catch (err) {
      console.warn('⚠️ Erreur documentsByType:', err)
      return {}
    }
  })

  const totalWordCount = computed(() => {
    try {
      return documents.value?.reduce((total, doc) => total + (doc?.metadata?.wordCount || 0), 0) || 0
    } catch (err) {
      console.warn('⚠️ Erreur totalWordCount:', err)
      return 0
    }
  })

  // ✅ HELPER: Gestion des erreurs API ULTRA-ROBUSTE (restaurée)
  const handleApiError = (err: any, defaultMessage: string): ApiErrorResponse => {
    console.error('❌ KB API Error:', err)
    
    let errorMessage = defaultMessage
    
    try {
      if (err?.data?.error && typeof err.data.error === 'string') {
        errorMessage = err.data.error
      } else if (err?.response?.data?.error && typeof err.response.data.error === 'string') {
        errorMessage = err.response.data.error
      } else if (err?.message && typeof err.message === 'string') {
        errorMessage = err.message
      } else if (err?.statusText && typeof err.statusText === 'string') {
        errorMessage = `Erreur ${err.status || 'API'}: ${err.statusText}`
      }
    } catch (parseError) {
      console.warn('⚠️ Erreur parsing error message:', parseError)
    }
    
    error.value = errorMessage
    return { success: false, error: errorMessage }
  }

  // ✅ VÉRIFICATION DES LIMITES AVANT ACTION (restaurée)
  const checkLimitsBeforeAction = (action: string): boolean => {
    try {
      if (planDetails.value.hasExpired) {
        error.value = '❌ Votre période d\'essai est terminée. Passez au plan Starter pour continuer à utiliser la base de connaissances.'
        return false
      }

      if (action === 'create' && !canUploadDocument.value) {
        const plan = planDetails.value.name
        const limit = documentLimit.value
        
        let limitText = ''
        let upgradeText = ''
        
        if (limit === -1) {
          limitText = 'illimitée'
        } else {
          limitText = `${limit} documents maximum`
          
          if (plan === 'starter') {
            upgradeText = ' Passez au plan Growth (200 documents) ou Performance (illimité).'
          } else if (plan === 'growth') {
            upgradeText = ' Passez au plan Performance pour un nombre illimité de documents.'
          }
        }
        
        error.value = `❌ Limite de votre plan ${plan} atteinte (${limitText}). Vous avez déjà ${currentDocumentCount.value} documents.${upgradeText}`
        return false
      }

      return true
    } catch (err) {
      console.error('❌ Erreur checkLimitsBeforeAction:', err)
      error.value = 'Erreur de vérification des limites'
      return false
    }
  }

  // ✅ MÉTHODE DE VALIDATION DES URLs BEAUTÉ (restaurée)
  const validateBeautyUrl = (url: string): { valid: boolean; error?: string } => {
    try {
      const urlObj = new URL(url)
      
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { valid: false, error: 'URL doit commencer par http:// ou https://' }
      }
      
      if (['localhost', '127.0.0.1', '0.0.0.0'].some(local => urlObj.hostname.includes(local))) {
        return { valid: false, error: 'URLs locales non autorisées' }
      }
      
      if (/\.(pdf|exe|zip|rar|dmg)$/i.test(urlObj.pathname)) {
        return { valid: false, error: 'URL doit pointer vers une page web, pas un fichier' }
      }
      
      return { valid: true }
    } catch {
      return { valid: false, error: 'Format d\'URL invalide' }
    }
  }

  // ✅ RÉCUPÉRER TOUS LES DOCUMENTS VIA API (corrigée avec useApi)
  const fetchDocuments = async (): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useKnowledgeBase] Récupération des documents via useApi()')
      
      const response = await api.knowledgeBase.list()

      if (response.success && response.data) {
        const validDocuments = response.data.filter(doc => doc && doc.id)
        documents.value = validDocuments
        console.log(`✅ [useKnowledgeBase] ${validDocuments.length} documents récupérés via API`)
        return { success: true, data: validDocuments }
      } else {
        throw new Error(response.error || 'Réponse API invalide')
      }

    } catch (err: any) {
      console.error('❌ [useKnowledgeBase] Erreur API:', err)
      return handleApiError(err, 'Erreur lors de la récupération des documents')
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER UN DOCUMENT VIA API (corrigée)
  const createDocument = async (data: CreateKnowledgeBaseData): Promise<ApiResponse<KnowledgeBaseDocument>> => {
    saving.value = true
    error.value = null

    try {
      if (!data || !data.title || !data.content) {
        throw new Error('Données de document invalides')
      }
      
      const quotaCheck = checkQuotaBeforeAction('knowledgeDocuments', 1)
      if (!quotaCheck.allowed) {
        return { success: false, error: quotaCheck.error || 'Quota documents atteint' }
      }
      
      if (!checkLimitsBeforeAction('create')) {
        return { success: false, error: error.value || 'Limite atteinte' }
      }
      
      const response = await api.knowledgeBase.create({
        ...data,
        tags: data.tags || [],
        isActive: data.isActive ?? true
      })

      if (response.success && response.data) {
        documents.value.unshift(response.data)
        await incrementQuota('knowledgeDocuments', 1)
        console.log(`✅ Document KB créé via API: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la création du document')
    } finally {
      saving.value = false
    }
  }

  // ✅ METTRE À JOUR UN DOCUMENT VIA API
  const updateDocument = async (id: string, data: UpdateKnowledgeBaseData): Promise<ApiResponse<KnowledgeBaseDocument>> => {
    saving.value = true
    error.value = null

    try {
      console.log('📝 Modification du document KB via API:', id)
      
      if (!id || !data) {
        throw new Error('ID ou données manquants')
      }
      
      if (!checkLimitsBeforeAction('update')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await api.knowledgeBase.update(id, data)

      if (response.success && response.data) {
        const index = documents.value.findIndex(doc => doc?.id === id)
        if (index !== -1) {
          documents.value[index] = { ...documents.value[index], ...response.data }
        }
        console.log(`✅ Document KB modifié via API: ${id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification du document')
    } finally {
      saving.value = false
    }
  }

  // ✅ SUPPRIMER UN DOCUMENT VIA API
  const deleteDocument = async (id: string): Promise<ApiResponse<null>> => {
    saving.value = true
    error.value = null

    try {
      console.log('🗑️ Suppression du document KB via API:', id)
      
      if (!id) {
        throw new Error('ID document manquant')
      }
      
      if (!checkLimitsBeforeAction('delete')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await api.knowledgeBase.delete(id)

      if (response.success) {
        documents.value = documents.value.filter(doc => doc?.id !== id)
        console.log(`✅ Document KB supprimé via API: ${id}`)
        return { success: true, data: null }
      } else {
        throw new Error('Erreur lors de la suppression')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la suppression du document')
    } finally {
      saving.value = false
    }
  }

  // ✅ ACTIVER/DÉSACTIVER UN DOCUMENT VIA API
  const toggleDocumentStatus = async (id: string, isActive: boolean): Promise<ApiResponse<null>> => {
    saving.value = true
    error.value = null

    try {
      console.log(`🔄 ${isActive ? 'Activation' : 'Désactivation'} du document KB via API:`, id)
      
      if (!id || typeof isActive !== 'boolean') {
        throw new Error('Paramètres invalides')
      }
      
      if (!checkLimitsBeforeAction('toggle')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await api.knowledgeBase.toggle(id, isActive)

      if (response.success) {
        const index = documents.value.findIndex(doc => doc?.id === id)
        if (index !== -1) {
          documents.value[index].isActive = isActive
          documents.value[index].updatedAt = new Date().toISOString()
        }
        console.log(`✅ Statut document KB modifié via API: ${id} -> ${isActive ? 'actif' : 'inactif'}`)
        return { success: true, data: null }
      } else {
        throw new Error('Erreur lors de la modification du statut')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification du statut')
    } finally {
      saving.value = false
    }
  }

  // ✅ MÉTHODE UPLOAD FICHIER AVEC VALIDATION BEAUTÉ (restaurée)
  const uploadFile = async (file: File): Promise<ApiResponse<KnowledgeBaseDocument>> => {
    saving.value = true
    error.value = null
    uploadProgress.value = 0

    try {
      const user = authStore.user
      if (!user) {
        throw new Error('Utilisateur non connecté')
      }

      // ✅ VALIDATION BEAUTÉ CÔTÉ CLIENT (restaurée)
      const plan = authStore.currentPlan
      const validation = validateBeautyFile(file, plan)
      
      if (!validation.valid) {
        throw new Error(validation.error || 'Fichier invalide')
      }

      console.log(`📤 Upload fichier beauté validé: ${file.name} (catégorie: ${validation.category})`)

      // ✅ VÉRIFIER LES QUOTAS AVANT UPLOAD
      const quotaCheck = checkQuotaBeforeAction('knowledgeDocuments', 1)
      if (!quotaCheck.allowed) {
        throw new Error(quotaCheck.error || 'Quota documents atteint')
      }

      const response = await api.knowledgeBase.upload(file, {
        title: file.name,
        beautyCategory: validation.category || 'multi',
        tags: [
          'fichier', 
          'upload', 
          'beaute', 
          validation.category || 'multi',
          plan
        ]
      })

      if (response.success && response.data) {
        documents.value.unshift(response.data)
        await incrementQuota('knowledgeDocuments', 1)
        console.log(`✅ Fichier beauté uploadé: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error(response.error || 'Erreur lors de l\'upload')
      }

    } catch (err: any) {
      console.error('❌ Erreur upload fichier beauté:', err)
      const errorMessage = err.message || 'Erreur lors de l\'upload du fichier beauté'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      saving.value = false
      uploadProgress.value = 0
    }
  }

  // ✅ MÉTHODE TRAITEMENT SITE WEB AVEC VALIDATION (restaurée)
  const processWebsite = async (
    url: string, 
    title?: string, 
    tags?: string[]
  ): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
    saving.value = true
    error.value = null

    try {
      console.log('🌐 Validation et traitement site beauté:', url)
      
      // ✅ VALIDATION URL CÔTÉ CLIENT
      const urlValidation = validateBeautyUrl(url)
      if (!urlValidation.valid) {
        throw new Error(urlValidation.error || 'URL invalide')
      }
      
      // ✅ VÉRIFIER LES QUOTAS AVANT TRAITEMENT
      const quotaCheck = checkQuotaBeforeAction('knowledgeDocuments', 1)
      if (!quotaCheck.allowed) {
        throw new Error(quotaCheck.error || 'Quota documents atteint')
      }
      
      // ✅ VÉRIFIER LES LIMITES DU PLAN BEAUTÉ
      if (!canUploadDocument.value) {
        const plan = planDetails.value.name
        const limit = documentLimit.value === -1 ? 'illimitée' : `${documentLimit.value} documents maximum`
        let upgradeMsg = ''
        
        if (plan === 'starter') {
          upgradeMsg = ' Passez au plan Growth (200 documents) ou Performance (illimité).'
        } else if (plan === 'growth') {
          upgradeMsg = ' Passez au plan Performance pour un nombre illimité de documents.'
        }
        
        throw new Error(`Limite de votre plan ${plan} atteinte (${limit}). Vous avez déjà ${currentDocumentCount.value} documents.${upgradeMsg}`)
      }

      // ✅ DÉTECTER LA CATÉGORIE BEAUTÉ DEPUIS L'URL
      let beautyCategory = 'multi'
      const urlLower = url.toLowerCase()
      
      for (const [category, config] of Object.entries(BEAUTY_CATEGORIES)) {
        if (config.keywords.some(keyword => urlLower.includes(keyword))) {
          beautyCategory = category
          break
        }
      }
      
      console.log(`🎯 Catégorie beauté détectée: ${beautyCategory}`)

      const response = await api.knowledgeBase.processWebsite({
        url: url.trim(),
        title: title?.trim(),
        tags: tags || ['website', 'indexation-beaute', beautyCategory],
        beautyCategory: beautyCategory,
        maxPages: planDetails.value.limits.indexablePages
      })

      if (response.success && response.data) {
        const createdDocuments = Array.isArray(response.data) ? response.data : [response.data]
        
        createdDocuments.forEach(doc => {
          documents.value.unshift(doc)
        })
        
        // ✅ INCRÉMENTER LE QUOTA POUR CHAQUE DOCUMENT CRÉÉ
        await incrementQuota('knowledgeDocuments', createdDocuments.length)
        
        console.log(`✅ Site beauté traité: ${createdDocuments.length} document(s), catégorie: ${beautyCategory}`)
        
        return { 
          success: true, 
          data: createdDocuments,
          meta: {
            ...response.meta,
            beautyCategory: beautyCategory
          }
        }
      } else {
        throw new Error(response.error || 'Erreur lors du traitement du site beauté')
      }

    } catch (err: any) {
      console.error('❌ Erreur traitement site beauté:', err)
      
      let errorMessage = 'Erreur lors du traitement du site beauté'
      
      if (err.message) {
        errorMessage = err.message
      }
      
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      saving.value = false
    }
  }

  // ✅ MÉTHODES UTILITAIRES (restaurées, inchangées)
  const searchDocuments = (query: string) => {
    try {
      if (!query?.trim()) return documents.value || []
      
      const searchTerm = query.toLowerCase()
      return (documents.value || []).filter(doc => 
        doc?.title?.toLowerCase().includes(searchTerm) ||
        doc?.content?.toLowerCase().includes(searchTerm) ||
        doc?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm))
      )
    } catch (err) {
      console.warn('⚠️ Erreur searchDocuments:', err)
      return []
    }
  }

  const getDocumentsForAgent = (agentId: string) => {
    try {
      if (!agentId) return []
      
      return (documents.value || []).filter(doc => 
        doc?.isActive && doc?.linkedAgents?.includes(agentId)
      )
    } catch (err) {
      console.warn('⚠️ Erreur getDocumentsForAgent:', err)
      return []
    }
  }

  const getDocument = (id: string): KnowledgeBaseDocument | null => {
    try {
      if (!id) return null
      return (documents.value || []).find(doc => doc?.id === id) || null
    } catch (err) {
      console.warn('⚠️ Erreur getDocument:', err)
      return null
    }
  }

  const getContentTypeLabel = (type: string): string => {
    try {
      const labels = {
        manual: '📝 Manuel',
        file: '📄 Fichier',
        url: '🔗 URL',
        website: '🌐 Site web'
      }
      return labels[type as keyof typeof labels] || type || 'Inconnu'
    } catch (err) {
      console.warn('⚠️ Erreur getContentTypeLabel:', err)
      return 'Inconnu'
    }
  }

  const formatFileSize = (bytes: number): string => {
    try {
      if (!bytes || bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    } catch (err) {
      console.warn('⚠️ Erreur formatFileSize:', err)
      return '0 B'
    }
  }

  const clearError = () => {
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES ET PROPRIÉTÉS (interface identique)
  return {
    // State
    documents: readonly(documents),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    uploadProgress: readonly(uploadProgress),

    // Computed pour gestion plan
    planDetails: readonly(planDetails),
    currentDocumentCount,
    documentLimit,
    canUploadDocument,
    documentsRemaining,
    isLimitReached,

    // Computed existants
    activeDocuments,
    documentsByType,
    totalWordCount,

    // Actions API pures
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    toggleDocumentStatus,
    uploadFile,        
    processWebsite,    

    // Helpers
    searchDocuments,
    getDocumentsForAgent,
    getDocument,
    getContentTypeLabel,
    formatFileSize,
    clearError
  }
}