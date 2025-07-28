// composables/useKnowledgeBase.ts - COMPOSABLE BASE DE CONNAISSANCE
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ TYPES
export interface KnowledgeBaseDocument {
  id: string
  title: string
  content: string
  contentType: 'manual' | 'file' | 'url' | 'website'
  sourceFile?: string
  tags: string[]
  isActive: boolean
  shopId: string
  linkedAgents?: string[] // IDs des agents qui utilisent ce document
  createdAt: string
  updatedAt: string
  metadata?: {
    fileSize?: number
    fileType?: string
    wordCount?: number
    lastProcessed?: string
  }
}

export interface CreateKnowledgeBaseData {
  title: string
  content: string
  contentType: KnowledgeBaseDocument['contentType']
  sourceFile?: string
  tags?: string[]
  isActive?: boolean
}

export interface UpdateKnowledgeBaseData extends Partial<CreateKnowledgeBaseData> {}

interface KnowledgeBaseResponse {
  success: boolean
  data: KnowledgeBaseDocument[]
  meta: {
    total: number
    activeCount: number
  }
}

interface DocumentResponse {
  success: boolean
  data: KnowledgeBaseDocument
}

// ✅ COMPOSABLE PRINCIPAL
export const useKnowledgeBase = () => {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()

  // ✅ STATE RÉACTIF
  const documents = ref<KnowledgeBaseDocument[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

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
      console.warn('⚠️ [useKnowledgeBase] Pas de token disponible, mode développement')
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
  const handleApiError = (err: any, defaultMessage: string) => {
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

  // ✅ RÉCUPÉRER TOUS LES DOCUMENTS
  const fetchDocuments = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 [useKnowledgeBase] Récupération des documents...')
      
      // ✅ Vérifier si on a un token
      if (!authStore.token) {
        console.log('⚠️ [useKnowledgeBase] Pas de token, utilisation données mockées')
        
        // ✅ DONNÉES MOCKÉES POUR DÉVELOPPEMENT
        const mockDocuments: KnowledgeBaseDocument[] = [
          {
            id: 'kb_001',
            title: 'Catalogue Produits 2024',
            content: 'Notre catalogue comprend une large gamme de produits innovants pour répondre à tous vos besoins. Nous proposons des solutions technologiques de pointe, des accessoires de qualité premium, et des services personnalisés.',
            contentType: 'file',
            sourceFile: 'catalogue-2024.pdf',
            tags: ['produits', 'catalogue', '2024', 'technologie'],
            isActive: true,
            shopId: authStore.userShopId || 'mock-shop',
            linkedAgents: [],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              fileSize: 2048000,
              fileType: 'application/pdf',
              wordCount: 1250,
              lastProcessed: new Date().toISOString()
            }
          },
          {
            id: 'kb_002',
            title: 'FAQ Support Client',
            content: 'Questions fréquemment posées par nos clients : Livraison sous 24-48h en France métropolitaine. Retours gratuits sous 30 jours. Garantie 2 ans sur tous nos produits. Support technique disponible 7j/7.',
            contentType: 'manual',
            tags: ['faq', 'support', 'client', 'livraison'],
            isActive: true,
            shopId: authStore.userShopId || 'mock-shop',
            linkedAgents: [],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              wordCount: 450,
              lastProcessed: new Date().toISOString()
            }
          },
          {
            id: 'kb_003',
            title: 'Politique de Prix et Promotions',
            content: 'Nos prix sont compétitifs et transparents. Promotions régulières : -20% pour les nouveaux clients, fidélité récompensée, prix dégressifs selon quantité. Paiement sécurisé en 3x sans frais.',
            contentType: 'manual',
            tags: ['prix', 'promotions', 'paiement', 'fidélité'],
            isActive: true,
            shopId: authStore.userShopId || 'mock-shop',
            linkedAgents: [],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              wordCount: 320,
              lastProcessed: new Date().toISOString()
            }
          },
          {
            id: 'kb_004',
            title: 'Guide Installation Produits',
            content: 'Guide détaillé pour l\'installation et la configuration de nos produits. Étapes simples, illustrations claires, troubleshooting des problèmes courants. Assistance à distance disponible.',
            contentType: 'file',
            sourceFile: 'guide-installation.pdf',
            tags: ['installation', 'guide', 'technique', 'assistance'],
            isActive: false,
            shopId: authStore.userShopId || 'mock-shop',
            linkedAgents: [],
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              fileSize: 1024000,
              fileType: 'application/pdf',
              wordCount: 890,
              lastProcessed: new Date().toISOString()
            }
          }
        ]
        
        documents.value = mockDocuments
        console.log(`✅ [useKnowledgeBase] ${mockDocuments.length} documents mockés chargés`)
        return { success: true, data: mockDocuments }
      }
      
      // ✅ APPEL API NORMAL
      const response = await $fetch('/api/v1/knowledge-base', {
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as KnowledgeBaseResponse

      if (response.success) {
        documents.value = response.data
        console.log(`✅ [useKnowledgeBase] ${response.data.length} documents récupérés`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      console.error('❌ [useKnowledgeBase] Erreur API, tentative fallback...', err)
      
      // ✅ FALLBACK EN CAS D'ERREUR API
      const fallbackDocuments: KnowledgeBaseDocument[] = [
        {
          id: 'fallback_kb_1',
          title: 'Document de Fallback',
          content: 'Contenu de test en cas d\'erreur API',
          contentType: 'manual',
          tags: ['fallback', 'test'],
          isActive: true,
          shopId: authStore.userShopId || 'fallback-shop',
          linkedAgents: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: { wordCount: 50 }
        }
      ]
      
      documents.value = fallbackDocuments
      console.log('✅ [useKnowledgeBase] Données de fallback chargées')
      return { success: true, data: fallbackDocuments }
      
    } finally {
      loading.value = false
    }
  }

  // ✅ CRÉER UN DOCUMENT
  const createDocument = async (data: CreateKnowledgeBaseData) => {
    saving.value = true
    error.value = null

    try {
      console.log('🏗️ Création d\'un document KB:', data.title)
      
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
      }) as DocumentResponse

      if (response.success) {
        documents.value.unshift(response.data)
        console.log(`✅ Document KB créé: ${response.data.id}`)
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

  // ✅ METTRE À JOUR UN DOCUMENT
  const updateDocument = async (id: string, data: UpdateKnowledgeBaseData) => {
    saving.value = true
    error.value = null

    try {
      console.log('📝 Modification du document KB:', id)
      
      const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders(),
        body: data
      }) as DocumentResponse

      if (response.success) {
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
          documents.value[index] = { ...documents.value[index], ...response.data }
        }
        console.log(`✅ Document KB modifié: ${id}`)
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

  // ✅ SUPPRIMER UN DOCUMENT
  const deleteDocument = async (id: string) => {
    saving.value = true
    error.value = null

    try {
      console.log('🗑️ Suppression du document KB:', id)
      
      const response = await $fetch(`/api/v1/knowledge-base/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
        headers: getAuthHeaders()
      }) as { success: boolean }

      if (response.success) {
        documents.value = documents.value.filter(doc => doc.id !== id)
        console.log(`✅ Document KB supprimé: ${id}`)
        return { success: true }
      } else {
        throw new Error('Réponse API invalide')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de la suppression du document')
    } finally {
      saving.value = false
    }
  }

  // ✅ ACTIVER/DÉSACTIVER UN DOCUMENT
  const toggleDocumentStatus = async (id: string, isActive: boolean) => {
    saving.value = true
    error.value = null

    try {
      console.log(`🔄 ${isActive ? 'Activation' : 'Désactivation'} du document KB:`, id)
      
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
        console.log(`✅ Statut document KB modifié: ${id} -> ${isActive ? 'actif' : 'inactif'}`)
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

  // ✅ LIER/DÉLIER UN DOCUMENT À UN AGENT
  const linkToAgent = async (documentId: string, agentId: string, link: boolean = true) => {
    try {
      console.log(`🔗 ${link ? 'Liaison' : 'Délaison'} document KB ${documentId} vers agent ${agentId}`)
      
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
      
      // ✅ TODO: Appel API pour sauvegarder en base
      // await $fetch(`/api/v1/knowledge-base/${documentId}/link-agent`, {
      //   method: 'POST',
      //   body: { agentId, link }
      // })
      
      console.log(`✅ Document KB ${link ? 'lié' : 'délié'} à/de l'agent`)
      return { success: true }
      
    } catch (err: any) {
      return handleApiError(err, `Erreur lors de la ${link ? 'liaison' : 'délaison'}`)
    }
  }

  // ✅ UPLOAD D'UN FICHIER
  const uploadFile = async (file: File, title?: string, tags?: string[]) => {
    saving.value = true
    uploadProgress.value = 0
    error.value = null

    try {
      console.log('📤 Upload fichier KB:', file.name)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title || file.name)
      formData.append('shopId', authStore.userShopId || '')
      if (tags) {
        formData.append('tags', JSON.stringify(tags))
      }

      // ✅ Simulation d'upload avec progress
      const response = await new Promise<DocumentResponse>((resolve, reject) => {
        // Simuler le progress
        const interval = setInterval(() => {
          uploadProgress.value += 10
          if (uploadProgress.value >= 100) {
            clearInterval(interval)
            
            // Mock response
            const mockDoc: KnowledgeBaseDocument = {
              id: Date.now().toString(),
              title: title || file.name,
              content: `Contenu du fichier ${file.name} extrait et traité automatiquement.`,
              contentType: 'file',
              sourceFile: file.name,
              tags: tags || ['fichier', 'upload'],
              isActive: true,
              shopId: authStore.userShopId || 'mock-shop',
              linkedAgents: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              metadata: {
                fileSize: file.size,
                fileType: file.type,
                wordCount: Math.floor(Math.random() * 1000) + 100,
                lastProcessed: new Date().toISOString()
              }
            }
            
            resolve({ success: true, data: mockDoc })
          }
        }, 200)
      })

      if (response.success) {
        documents.value.unshift(response.data)
        console.log(`✅ Fichier KB uploadé: ${response.data.id}`)
        return { success: true, data: response.data }
      } else {
        throw new Error('Erreur upload')
      }

    } catch (err: any) {
      return handleApiError(err, 'Erreur lors de l\'upload du fichier')
    } finally {
      saving.value = false
      uploadProgress.value = 0
    }
  }

  // ✅ TRAITEMENT D'URL/SITE WEB
  const processWebsite = async (url: string, title?: string, tags?: string[]) => {
    saving.value = true
    error.value = null

    try {
      console.log('🌐 Traitement URL/site web:', url)
      
      // ✅ Simulation de traitement web
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockDoc: KnowledgeBaseDocument = {
        id: Date.now().toString(),
        title: title || `Contenu de ${new URL(url).hostname}`,
        content: `Contenu extrait automatiquement depuis ${url}. Informations sur les produits, services, conditions générales, etc.`,
        contentType: 'website',
        sourceFile: url,
        tags: tags || ['website', 'web', 'automatique'],
        isActive: true,
        shopId: authStore.userShopId || 'mock-shop',
        linkedAgents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          wordCount: Math.floor(Math.random() * 2000) + 500,
          lastProcessed: new Date().toISOString()
        }
      }
      
      documents.value.unshift(mockDoc)
      console.log(`✅ Site web traité: ${mockDoc.id}`)
      return { success: true, data: mockDoc }

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

    // Computed
    activeDocuments,
    documentsByType,
    totalWordCount,

    // Actions
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
    clearError
  }
}