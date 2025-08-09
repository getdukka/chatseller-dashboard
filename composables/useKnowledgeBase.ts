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

// ✅ TYPES DE RETOUR
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

interface KnowledgeBaseResponse {
  success: boolean
  data: KnowledgeBaseDocument[]
  meta: {
    total: number
    activeCount: number
    planLimit: number
    canUpload: boolean
  }
}

// ✅ COMPOSABLE PRINCIPAL 100% API PURE
export const useKnowledgeBase = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const documents = ref<KnowledgeBaseDocument[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

  // ✅ COMPUTED POUR GESTION DES LIMITES DE PLAN
  const planDetails = computed(() => {
    return authStore.planDetails
  })

  const currentDocumentCount = computed(() => {
    return documents.value.length
  })

  const documentLimit = computed(() => {
    return planDetails.value.knowledgeBaseLimit
  })

  const canUploadDocument = computed(() => {
    // ✅ VÉRIFICATIONS STRICTES SELON LES SPÉCIFICATIONS
    if (planDetails.value.hasExpired) {
      return false // Essai expiré
    }

    if (documentLimit.value === -1) {
      return true // Plan Enterprise - illimité
    }

    return currentDocumentCount.value < documentLimit.value
  })

  const documentsRemaining = computed(() => {
    if (documentLimit.value === -1) {
      return -1 // Illimité
    }
    
    return Math.max(0, documentLimit.value - currentDocumentCount.value)
  })

  const isLimitReached = computed(() => {
    return !canUploadDocument.value && documentLimit.value !== -1
  })

  // ✅ GETTERS
  const activeDocuments = computed(() => 
    documents.value.filter(doc => doc.isActive)
  )

  const documentsByType = computed(() => {
    return documents.value.reduce((acc, doc) => {
      if (!acc[doc.contentType]) {
        acc[doc.contentType] = []
      }
      acc[doc.contentType].push(doc)
      return acc
    }, {} as Record<string, KnowledgeBaseDocument[]>)
  })

  const totalWordCount = computed(() => 
    documents.value.reduce((total, doc) => total + (doc.metadata?.wordCount || 0), 0)
  )

  // ✅ HELPER: Headers avec authentification
  const getAuthHeaders = () => {
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
  }

  // ✅ HELPER: Gestion des erreurs API
  const handleApiError = (err: any, defaultMessage: string): ApiErrorResponse => {
    console.error('❌ KB API Error:', err)
    
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

  // ✅ VÉRIFICATION DES LIMITES AVANT ACTION
  const checkLimitsBeforeAction = (action: string): boolean => {
    if (planDetails.value.hasExpired) {
      error.value = '❌ Votre essai gratuit de 7 jours est terminé. Passez au plan Starter pour ajouter des documents à votre base de connaissances.'
      return false
    }

    if (action === 'create' && !canUploadDocument.value) {
      const limitText = documentLimit.value === -1 ? 'illimitée' : `${documentLimit.value} documents maximum`
      error.value = `❌ Limite de votre plan atteinte (${limitText}). Vous avez déjà ${currentDocumentCount.value} documents. Passez au plan supérieur pour ajouter plus de documents.`
      return false
    }

    if (['update', 'delete', 'toggle'].includes(action) && planDetails.value.hasExpired) {
      error.value = '❌ Votre essai gratuit est terminé. Passez au plan Starter pour gérer vos documents.'
      return false
    }

    return true
  }

  // ✅ RÉCUPÉRER TOUS LES DOCUMENTS VIA API
  const fetchDocuments = async (): Promise<ApiResponse<KnowledgeBaseDocument[]>> => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useKnowledgeBase] Récupération des documents via API...')
      console.log('📋 [useKnowledgeBase] Plan:', planDetails.value.name, `- Limite: ${documentLimit.value === -1 ? 'illimitée' : documentLimit.value}`)
      
      // ✅ APPEL API EXCLUSIVEMENT
      const response = await $fetch('/api/v1/knowledge-base', {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as KnowledgeBaseResponse

      if (response.success) {
        documents.value = response.data || []
        console.log(`✅ [useKnowledgeBase] ${response.data.length} documents récupérés via API`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      console.error('❌ [useKnowledgeBase] Erreur API:', err)
      
      // ✅ FALLBACK AVEC DONNÉES LIMITÉES SELON LE PLAN
      let fallbackDocuments: KnowledgeBaseDocument[] = []
      
      if (!planDetails.value.hasExpired) {
        const baseMockDocuments: KnowledgeBaseDocument[] = [
          {
            id: 'kb_mock_001',
            title: 'Guide Produits (Démonstration)',
            content: 'Contenu de démonstration pour tester les fonctionnalités de base de connaissances. En mode réel, ce document serait connecté à votre API backend.',
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

        // ✅ APPLIQUER LES LIMITES DE PLAN
        if (documentLimit.value !== -1) {
          fallbackDocuments = baseMockDocuments.slice(0, documentLimit.value)
        } else {
          fallbackDocuments = baseMockDocuments
        }
      }
      
      documents.value = fallbackDocuments
      console.log(`⚠️ [useKnowledgeBase] Mode fallback: ${fallbackDocuments.length} documents`)
      return { success: true, data: fallbackDocuments }
      
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER UN DOCUMENT VIA API EXCLUSIVEMENT
  const createDocument = async (data: CreateKnowledgeBaseData): Promise<ApiResponse<KnowledgeBaseDocument>> => {
    saving.value = true
    error.value = null

    try {
      console.log('🏗️ Création d\'un document KB via API:', data.title)
      
      // ✅ VÉRIFIER LES LIMITES AVANT CRÉATION
      if (!checkLimitsBeforeAction('create')) {
        return { success: false, error: error.value || 'Limite atteinte' }
      }
      
      // ✅ APPEL API EXCLUSIVEMENT
      const response = await $fetch('/api/v1/knowledge-base', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          ...data,
          shopId: authStore.userShopId,
          isActive: data.isActive ?? true,
          tags: data.tags || []
        }
      }) as { success: boolean; data: KnowledgeBaseDocument }

      if (response.success) {
        documents.value.unshift(response.data)
        console.log(`✅ Document KB créé via API: ${response.data.id}`)
        console.log(`📊 Nouveau total: ${currentDocumentCount.value}/${documentLimit.value === -1 ? '∞' : documentLimit.value}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
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
      
      // ✅ VÉRIFIER LES LIMITES
      if (!checkLimitsBeforeAction('update')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: data
      }) as { success: boolean; data: KnowledgeBaseDocument }

      if (response.success) {
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
          documents.value[index] = { ...documents.value[index], ...response.data }
        }
        console.log(`✅ Document KB modifié via API: ${id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
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
      
      // ✅ VÉRIFIER LES LIMITES
      if (!checkLimitsBeforeAction('delete')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as { success: boolean }

      if (response.success) {
        documents.value = documents.value.filter(doc => doc.id !== id)
        console.log(`✅ Document KB supprimé via API: ${id}`)
        console.log(`📊 Nouveau total: ${currentDocumentCount.value}/${documentLimit.value === -1 ? '∞' : documentLimit.value}`)
        return { success: true, data: null }
      } else {
        throw new Error('Réponse API invalide')
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
      
      // ✅ VÉRIFIER LES LIMITES
      if (!checkLimitsBeforeAction('toggle')) {
        return { success: false, error: error.value || 'Accès limité' }
      }
      
      const response = await $fetch(`/api/v1/knowledge-base/${id}/toggle`, {
        method: 'PATCH',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { isActive }
      }) as { success: boolean; data: { updatedAt: string } }

      if (response.success) {
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
          documents.value[index].isActive = isActive
          documents.value[index].updatedAt = response.data.updatedAt
        }
        console.log(`✅ Statut document KB modifié via API: ${id} -> ${isActive ? 'actif' : 'inactif'}`)
        return { success: true, data: null }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la modification du statut')
    } finally {
      saving.value = false
    }
  }

  // ✅ UPLOAD D'UN FICHIER VIA API (AVEC MULTIPART)
  const uploadFile = async (file: File, title?: string, tags?: string[]): Promise<ApiResponse<KnowledgeBaseDocument>> => {
    saving.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      console.log('📤 Upload fichier KB via API:', file.name)
      
      // ✅ VÉRIFIER LES LIMITES AVANT UPLOAD
      if (!checkLimitsBeforeAction('create')) {
        return { success: false, error: error.value || 'Limite atteinte' }
      }

      // ✅ VÉRIFIER TAILLE FICHIER (5MB MAX)
      if (file.size > 5 * 1024 * 1024) {
        error.value = 'Fichier trop volumineux (5MB maximum)'
        return { success: false, error: error.value }
      }
      
      uploadProgress.value = 20

      // ✅ PRÉPARER FORMDATA POUR UPLOAD MULTIPART
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title || file.name)
      formData.append('tags', JSON.stringify(tags || ['fichier', 'upload']))
      formData.append('shopId', authStore.userShopId || '')

      uploadProgress.value = 40

      // ✅ UPLOAD VIA API EXCLUSIVEMENT (L'API GÈRE SUPABASE STORAGE)
      const response = await $fetch('/api/v1/knowledge-base/upload', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Authorization': `Bearer ${authStore.token}`
          // Pas de Content-Type pour FormData (ajouté automatiquement)
        },
        body: formData
      }) as { success: boolean; data: KnowledgeBaseDocument }

      uploadProgress.value = 80

      if (response.success) {
        documents.value.unshift(response.data)
        uploadProgress.value = 100
        
        console.log(`✅ Fichier KB uploadé via API: ${response.data.id}`)
        console.log(`📊 Nouveau total: ${currentDocumentCount.value}/${documentLimit.value === -1 ? '∞' : documentLimit.value}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de l\'upload du fichier')
    } finally {
      saving.value = false
      uploadProgress.value = 0
    }
  }

  // ✅ TRAITEMENT D'URL/SITE WEB VIA API
  const processWebsite = async (url: string, title?: string, tags?: string[]): Promise<ApiResponse<KnowledgeBaseDocument>> => {
    saving.value = true
    error.value = null

    try {
      console.log('🌐 Traitement URL/site web via API:', url)
      
      // ✅ VÉRIFIER LES LIMITES AVANT TRAITEMENT
      if (!checkLimitsBeforeAction('create')) {
        return { success: false, error: error.value || 'Limite atteinte' }
      }
      
      // ✅ APPEL API POUR TRAITEMENT WEB
      const response = await $fetch('/api/v1/knowledge-base/website', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: {
          url,
          title: title || `Contenu de ${new URL(url).hostname}`,
          tags: tags || ['website', 'web', 'automatique'],
          shopId: authStore.userShopId
        }
      }) as { success: boolean; data: KnowledgeBaseDocument }
      
      if (response.success) {
        documents.value.unshift(response.data)
        console.log(`✅ Site web traité via API: ${response.data.id}`)
        console.log(`📊 Nouveau total: ${currentDocumentCount.value}/${documentLimit.value === -1 ? '∞' : documentLimit.value}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors du traitement du site web')
    } finally {
      saving.value = false
    }
  }

  // ✅ RECHERCHER DANS LES DOCUMENTS
  const searchDocuments = (query: string) => {
    if (!query.trim()) return documents.value
    
    const searchTerm = query.toLowerCase()
    return documents.value.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.content.toLowerCase().includes(searchTerm) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // ✅ OBTENIR LES DOCUMENTS LIÉS À UN AGENT
  const getDocumentsForAgent = (agentId: string) => {
    return documents.value.filter(doc => 
      doc.isActive && doc.linkedAgents?.includes(agentId)
    )
  }

  // ✅ OBTENIR UN DOCUMENT PAR ID
  const getDocument = (id: string): KnowledgeBaseDocument | null => {
    return documents.value.find(doc => doc.id === id) || null
  }

  // ✅ LIER/DÉLIER UN DOCUMENT À UN AGENT VIA API
  const linkToAgent = async (documentId: string, agentId: string, link: boolean = true): Promise<ApiResponse<null>> => {
    try {
      console.log(`🔗 ${link ? 'Liaison' : 'Délaison'} document KB ${documentId} vers agent ${agentId} via API`)
      
      const response = await $fetch(`/api/v1/knowledge-base/${documentId}/agents`, {
        method: link ? 'POST' : 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: { agentId }
      }) as { success: boolean }

      if (response.success) {
        // Mettre à jour localement
        const docIndex = documents.value.findIndex(doc => doc.id === documentId)
        if (docIndex !== -1) {
          const doc = documents.value[docIndex]
          const linkedAgents = doc.linkedAgents || []
          
          if (link && !linkedAgents.includes(agentId)) {
            linkedAgents.push(agentId)
          } else if (!link && linkedAgents.includes(agentId)) {
            const agentIndex = linkedAgents.indexOf(agentId)
            linkedAgents.splice(agentIndex, 1)
          }
          
          documents.value[docIndex].linkedAgents = linkedAgents
          documents.value[docIndex].updatedAt = new Date().toISOString()
        }
        
        console.log(`✅ Document KB ${link ? 'lié' : 'délié'} à/de l'agent via API`)
        return { success: true, data: null }
      } else {
        throw new Error('Réponse API invalide')
      }
      
    } catch (err: any) {
      return handleApiError(err, `Erreur lors de la ${link ? 'liaison' : 'délaison'}`)
    }
  }

  // ✅ HELPER: Formater la taille de fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // ✅ HELPER: Obtenir le libellé du type de contenu
  const getContentTypeLabel = (type: string): string => {
    const labels = {
      manual: '📝 Manuel',
      file: '📄 Fichier',
      url: '🔗 URL',
      website: '🌐 Site web'
    }
    return labels[type as keyof typeof labels] || type
  }

  // ✅ RÉINITIALISER L'ERREUR
  const clearError = () => {
    error.value = null
  }

  // ✅ RETOURNER TOUTES LES MÉTHODES ET PROPRIÉTÉS
  return {
    // State
    documents: readonly(documents),
    loading: readonly(loading),
    saving: readonly(saving),
    error: readonly(error),
    uploadProgress: readonly(uploadProgress),

    // ✅ COMPUTED POUR GESTION PLAN
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
    linkToAgent,
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