// composables/useKnowledgeBase.ts 

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES PARFAITEMENT DÉFINIS
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
}

export interface UpdateKnowledgeBaseData extends Partial<CreateKnowledgeBaseData> {}

// ✅ TYPES DE RETOUR GÉNÉRIQUES
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  meta?: {
    totalPagesDiscovered?: number
    totalDocumentsCreated?: number
    baseUrl?: string
    indexationType?: string
    processedAt?: string
    [key: string]: any
  }
  error?: never
}

export interface ApiErrorResponse {
  success: false
  error: string
  data?: never
  meta?: never
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// ✅ INTERFACES CORRIGÉES POUR LES RÉPONSES
interface KnowledgeBaseSuccessResponse {
  success: true
  data: KnowledgeBaseDocument[]
  meta?: {
    total: number
    activeCount: number
    planLimit: number
    canUpload: boolean
  }
  error?: never
}

interface KnowledgeBaseErrorResponse {
  success: false
  error: string
  data?: never
  meta?: never
}

type KnowledgeBaseResponse = KnowledgeBaseSuccessResponse | KnowledgeBaseErrorResponse

// ✅ INTERFACE POUR LES RÉPONSES DE CRÉATION/MODIFICATION
interface DocumentSuccessResponse {
  success: true
  data: KnowledgeBaseDocument
  error?: never
}

interface DocumentErrorResponse {
  success: false
  error: string
  data?: never
}

type DocumentResponse = DocumentSuccessResponse | DocumentErrorResponse

// ✅ INTERFACE PLAN DETAILS CORRIGÉE
interface PlanDetails {
  name: string
  knowledgeBaseLimit: number
  hasExpired: boolean
  fileSizeLimit?: number  
}

// ✅ INTERFACE POUR LES RÉPONSES DE TOGGLE
interface ToggleSuccessResponse {
  success: true
  data: {
    updatedAt: string
  }
  error?: never
}

interface ToggleErrorResponse {
  success: false
  error: string
  data?: never
}

type ToggleResponse = ToggleSuccessResponse | ToggleErrorResponse

// ✅ COMPOSABLE PRINCIPAL AVEC GESTION D'ERREURS ULTRA-ROBUSTE
export const useKnowledgeBase = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF AVEC INITIALISATION SÉCURISÉE
  const documents = ref<KnowledgeBaseDocument[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

  // ✅ COMPUTED POUR GESTION DES LIMITES DE PLAN AVEC FALLBACKS
  const planDetails = computed(() => {
    try {
      return authStore.planDetails || {
        name: 'free',
        knowledgeBaseLimit: 10,
        hasExpired: false
      }
    } catch (err) {
      console.warn('⚠️ Erreur planDetails, utilisation fallback:', err)
      return {
        name: 'free',
        knowledgeBaseLimit: 10,
        hasExpired: false
      }
    }
  })

  const currentDocumentCount = computed(() => {
    return documents.value?.length || 0
  })

  const documentLimit = computed(() => {
    try {
      return planDetails.value?.knowledgeBaseLimit || 10
    } catch (err) {
      console.warn('⚠️ Erreur documentLimit, fallback:', err)
      return 10
    }
  })

  const canUploadDocument = computed(() => {
    try {
      // ✅ VÉRIFICATIONS STRICTES SELON LES SPÉCIFICATIONS
      if (planDetails.value?.hasExpired) {
        return false // Essai expiré
      }

      if (documentLimit.value === -1) {
        return true // Plan Enterprise - illimité
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

  // ✅ GETTERS AVEC PROTECTION CONTRE LES ERREURS
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

  // ✅ HELPER: Headers avec authentification SÉCURISÉE
  const getAuthHeaders = () => {
    try {
      if (!authStore.token) {
        console.warn('⚠️ [useKnowledgeBase] Pas de token disponible')
        return {
          'Content-Type': 'application/json'
        }
      }
      
      return {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    } catch (err) {
      console.error('❌ [useKnowledgeBase] Erreur getAuthHeaders:', err)
      return {
        'Content-Type': 'application/json'
      }
    }
  }

  // ✅ HELPER: Gestion des erreurs API ULTRA-ROBUSTE
  const handleApiError = (err: any, defaultMessage: string): ApiErrorResponse => {
  console.error('❌ KB API Error:', err)
  
  let errorMessage = defaultMessage
  
  try {
    // ✅ GESTION SÉCURISÉE DES ERREURS
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

  // ✅ VÉRIFICATION DES LIMITES AVANT ACTION AVEC PROTECTION
  const checkLimitsBeforeAction = (action: string): boolean => {
    try {
      if (planDetails.value?.hasExpired) {
        error.value = '❌ Votre essai gratuit de 7 jours est terminé. Passez au plan Starter pour ajouter des documents à votre base de connaissances.'
        return false
      }

      if (action === 'create' && !canUploadDocument.value) {
        const limitText = documentLimit.value === -1 ? 'illimitée' : `${documentLimit.value} documents maximum`
        error.value = `❌ Limite de votre plan atteinte (${limitText}). Vous avez déjà ${currentDocumentCount.value} documents. Passez au plan supérieur pour ajouter plus de documents.`
        return false
      }

      if (['update', 'delete', 'toggle'].includes(action) && planDetails.value?.hasExpired) {
        error.value = '❌ Votre essai gratuit est terminé. Passez au plan Starter pour gérer vos documents.'
        return false
      }

      return true
    } catch (err) {
      console.error('❌ Erreur checkLimitsBeforeAction:', err)
      error.value = 'Erreur de vérification des limites'
      return false
    }
  }

  // ✅ RÉCUPÉRER TOUS LES DOCUMENTS VIA API AVEC GESTION D'ERREURS ROBUSTE
  const fetchDocuments = async (): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
  loading.value = true
  error.value = null

  try {
    console.log('🔍 [useKnowledgeBase] Récupération des documents via API...')
    
    if (!config?.public?.apiBaseUrl) {
      throw new Error('Configuration API manquante')
    }

    const response = await $fetch('/api/v1/knowledge-base', {
      baseURL: config.public.apiBaseUrl,
      headers: getAuthHeaders(),
      timeout: 10000
    }) as KnowledgeBaseResponse

    // ✅ VÉRIFICATION TYPE-SAFE
    if (response.success && response.data) {
      const validDocuments = response.data.filter(doc => doc && doc.id)
      documents.value = validDocuments
      console.log(`✅ [useKnowledgeBase] ${validDocuments.length} documents récupérés via API`)
      return { success: true, data: validDocuments }
    } else {
      // TypeScript sait maintenant que response.error existe
      throw new Error(response.error || 'Réponse API invalide')
    }

  } catch (err: any) {
    console.error('❌ [useKnowledgeBase] Erreur API:', err)
    
    // Fallback avec données demo
    const fallbackDocuments: KnowledgeBaseDocument[] = []
    
    try {
      if (!planDetails.value?.hasExpired) {
        const baseMockDocuments: KnowledgeBaseDocument[] = [
          {
            id: 'kb_demo_001',
            title: 'Guide Produits (Mode Démo)',
            content: 'Contenu de démonstration pour tester les fonctionnalités de base de connaissances.',
            contentType: 'manual',
            tags: ['demo', 'test', 'produits'],
            isActive: true,
            shopId: authStore.userShopId || 'demo-shop',
            linkedAgents: [],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              wordCount: 25,
              lastProcessed: new Date().toISOString()
            }
          }
        ]

        if (documentLimit.value !== -1) {
          fallbackDocuments.push(...baseMockDocuments.slice(0, documentLimit.value))
        } else {
          fallbackDocuments.push(...baseMockDocuments)
        }
      }
    } catch (fallbackError) {
      console.warn('⚠️ Erreur création fallback:', fallbackError)
    }
    
    documents.value = fallbackDocuments
    console.log(`⚠️ [useKnowledgeBase] Mode fallback: ${fallbackDocuments.length} documents`)
    
    return handleApiError(err, 'Erreur lors de la récupération des documents')
    
  } finally {
    loading.value = false
  }
}

  // ✅ CRÉER UN DOCUMENT VIA API AVEC PROTECTION COMPLÈTE
  const createDocument = async (data: CreateKnowledgeBaseData): Promise<ApiResponse<KnowledgeBaseDocument>> => {
  saving.value = true
  error.value = null

  try {
    if (!data || !data.title || !data.content) {
      throw new Error('Données de document invalides')
    }
    
    if (!checkLimitsBeforeAction('create')) {
      return { success: false, error: error.value || 'Limite atteinte' }
    }
    
    const response = await $fetch('/api/v1/knowledge-base', {
      method: 'POST',
      baseURL: config.public.apiBaseUrl,
      headers: getAuthHeaders(),
      timeout: 15000,
      body: {
        ...data,
        shopId: authStore.userShopId || 'demo-shop',
        isActive: data.isActive ?? true,
        tags: data.tags || []
      }
    }) as DocumentResponse

    // ✅ VÉRIFICATION TYPE-SAFE
    if (response.success && response.data) {
      documents.value.unshift(response.data)
      console.log(`✅ Document KB créé via API: ${response.data.id}`)
      return { success: true, data: response.data }
    } else {
      // TypeScript sait maintenant que response.error existe
      throw new Error(response.error || 'Réponse API invalide')
    }

  } catch (err: any) {
    return handleApiError(err, 'Erreur lors de la création du document')
  } finally {
    saving.value = false
  }
}

  // ✅ METTRE À JOUR UN DOCUMENT VIA API AVEC PROTECTION
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
    
    // ✅ TYPAGE EXPLICIT POUR ÉVITER L'ERREUR
    const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
      method: 'PUT',
      baseURL: config.public.apiBaseUrl,
      headers: getAuthHeaders(),
      timeout: 15000,
      body: data
    }) as DocumentResponse // ← Type explicite

    // ✅ VÉRIFICATION TYPE-SAFE AVEC DISTINCTION CLAIRE
    if (response.success) {
      // TypeScript sait maintenant que response.data existe
      if (response.data) {
        const index = documents.value.findIndex(doc => doc?.id === id)
        if (index !== -1) {
          documents.value[index] = { ...documents.value[index], ...response.data }
        }
        console.log(`✅ Document KB modifié via API: ${id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Données de réponse manquantes')
      }
    } else {
      // TypeScript sait maintenant que response.error existe
      throw new Error(response.error || 'Réponse API invalide')
    }

  } catch (err: any) {
    return handleApiError(err, 'Erreur lors de la modification du document')
  } finally {
    saving.value = false
  }
}

  // ✅ SUPPRIMER UN DOCUMENT VIA API AVEC PROTECTION
  const deleteDocument = async (id: string): Promise<ApiResponse<null>> => {
    saving.value = true
    error.value = null

    try {
      console.log('🗑️ Suppression du document KB via API:', id)
      
      // ✅ VALIDATION ID
      if (!id) {
        throw new Error('ID document manquant')
      }
      
      // ✅ VÉRIFIER LES LIMITES
      if (!checkLimitsBeforeAction('delete')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        timeout: 10000
      }) as { success: boolean }

      if (response?.success) {
        documents.value = documents.value.filter(doc => doc?.id !== id)
        console.log(`✅ Document KB supprimé via API: ${id}`)
        console.log(`📊 Nouveau total: ${currentDocumentCount.value}/${documentLimit.value === -1 ? '∞' : documentLimit.value}`)
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

  // ✅ ACTIVER/DÉSACTIVER UN DOCUMENT VIA API AVEC PROTECTION
  const toggleDocumentStatus = async (id: string, isActive: boolean): Promise<ApiResponse<null>> => {
    saving.value = true
    error.value = null

    try {
      console.log(`🔄 ${isActive ? 'Activation' : 'Désactivation'} du document KB via API:`, id)
      
      // ✅ VALIDATION PARAMÈTRES
      if (!id || typeof isActive !== 'boolean') {
        throw new Error('Paramètres invalides')
      }
      
      // ✅ VÉRIFIER LES LIMITES
      if (!checkLimitsBeforeAction('toggle')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await $fetch(`/api/v1/knowledge-base/${id}/toggle`, {
        method: 'PATCH',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        timeout: 10000,
        body: { isActive }
      }) as { success: boolean; data: { updatedAt: string } }

      if (response?.success) {
        const index = documents.value.findIndex(doc => doc?.id === id)
        if (index !== -1) {
          documents.value[index].isActive = isActive
          documents.value[index].updatedAt = response.data?.updatedAt || new Date().toISOString()
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

  // ✅ MÉTHODES UTILITAIRES AVEC PROTECTION
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

  // ✅ MÉTHODE UPLOAD FICHIER
const uploadFile = async (file: File): Promise<ApiResponse<KnowledgeBaseDocument>> => {
  saving.value = true
  error.value = null
  uploadProgress.value = 0

  try {
    console.log('📤 Upload fichier KB:', file.name, file.type, file.size)
    
    const user = authStore.user
    if (!user) {
      throw new Error('Utilisateur non connectifié')
    }
    
    // ✅ VÉRIFIER LES LIMITES DU PLAN
    if (!canUploadDocument.value) {
      const limit = documentLimit.value === -1 ? 'illimitée' : `${documentLimit.value} documents maximum`
      throw new Error(`Limite de votre plan atteinte (${limit}). Vous avez déjà ${currentDocumentCount.value} documents. Passez au plan supérieur pour ajouter plus de documents.`)
    }

    // ✅ VÉRIFIER LA TAILLE DU FICHIER
    const maxSize = (planDetails.value as any)?.fileSizeLimit || 5 * 1024 * 1024 // 5MB par défaut
    if (file.size > maxSize) {
      throw new Error(`Fichier trop volumineux. Taille maximum : ${Math.round(maxSize / 1024 / 1024)}MB`)
    }

    // ✅ VÉRIFIER LE TYPE DE FICHIER
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non supporté. Formats acceptés : PDF, DOC, DOCX, TXT, CSV')
    }

    // ✅ CRÉER FORMDATA
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', file.name)
    formData.append('contentType', 'file')
    formData.append('tags', JSON.stringify(['fichier', 'upload']))

    // ✅ UPLOAD AVEC PROGRESS
    const response = await $fetch('/api/v1/knowledge-base/upload', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formData,
      onUploadProgress: (progress) => {
        uploadProgress.value = Math.round((progress.loaded / progress.total) * 100)
      }
    })

    if (response.success) {
      // Ajouter le nouveau document à la liste
      documents.value.unshift(response.data)
      console.log(`✅ Fichier uploadé avec succès: ${response.data.id}`)
      return { success: true, data: response.data }
    } else {
      throw new Error(response.error || 'Erreur lors de l\'upload')
    }

  } catch (err: any) {
    console.error('❌ Erreur upload fichier:', err)
    const errorMessage = err.response?.data?.error || err.message || 'Erreur lors de l\'upload du fichier'
    error.value = errorMessage
    return { success: false, error: errorMessage }
  } finally {
    saving.value = false
    uploadProgress.value = 0
  }
}

// ✅ MÉTHODE TRAITEMENT SITE WEB 
const processWebsite = async (
  url: string, 
  title?: string, 
  tags?: string[]
): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
  saving.value = true
  error.value = null

  try {
    console.log('🌐 Traitement complet du site web:', url)
    
    if (!url || !url.startsWith('http')) {
      throw new Error('URL invalide')
    }
    
    // ✅ VÉRIFIER LES LIMITES DU PLAN
    if (!canUploadDocument.value) {
      const limit = documentLimit.value === -1 ? 'illimitée' : `${documentLimit.value} documents maximum`
      throw new Error(`Limite de votre plan atteinte (${limit}). Vous avez déjà ${currentDocumentCount.value} documents. Passez au plan supérieur pour ajouter plus de documents.`)
    }

    const response = await $fetch('/api/v1/knowledge-base/website', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      headers: getAuthHeaders(),
      timeout: 60000, // ✅ TIMEOUT PLUS LONG POUR TRAITEMENT MULTIPLE
      body: {
        url: url.trim(),
        title: title?.trim(),
        tags: tags || ['website', 'indexation-complete']
      }
    })

    if (response.success) {
      // ✅ AJOUTER TOUS LES DOCUMENTS CRÉÉS À LA LISTE
      const createdDocuments = Array.isArray(response.data) ? response.data : [response.data]
      
      createdDocuments.forEach(doc => {
        documents.value.unshift(doc)
      })
      
      console.log(`✅ Site web traité avec succès: ${createdDocuments.length} document(s) créé(s)`)
      
      return { 
        success: true, 
        data: createdDocuments,
        meta: response.meta 
      }
    } else {
      throw new Error(response.error || 'Erreur lors du traitement du site web')
    }

  } catch (err: any) {
    console.error('❌ Erreur traitement site web:', err)
    
    let errorMessage = 'Erreur lors du traitement du site web'
    
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    } else if (err.message) {
      errorMessage = err.message
    }
    
    // ✅ GESTION SPÉCIFIQUE DES ERREURS DE PLAN
    if (err.response?.data?.requiresUpgrade) {
      errorMessage += ' Passez au plan supérieur pour indexer plus de pages.'
    }
    
    error.value = errorMessage
    return { success: false, error: errorMessage }
  } finally {
    saving.value = false
  }
}

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES ET PROPRIÉTÉS AVEC PROTECTION READONLY
  return {
    // State
    documents: readonly(documents),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    uploadProgress: readonly(uploadProgress),

    // ✅ COMPUTED POUR GESTION PLAN - MAINTENANT EXPORTÉS
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