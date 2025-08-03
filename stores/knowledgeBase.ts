// stores/knowledgeBase.ts
import { defineStore } from 'pinia'
import type { KnowledgeBaseDocument } from '~/composables/useApi'
import { useAnalytics } from './analytics'
import { useAuthStore } from './auth'

interface KnowledgeBaseState {
  documents: KnowledgeBaseDocument[]
  isLoading: boolean
  isUploading: boolean
  error: string | null
  lastFetch: Date | null
  filters: {
    type: KnowledgeBaseDocument['type'] | 'all'
    searchTerm: string
  }
  uploadProgress: number
}

export const useKnowledgeBaseStore = defineStore('knowledgeBase', {
  state: (): KnowledgeBaseState => ({
    documents: [],
    isLoading: false,
    isUploading: false,
    error: null,
    lastFetch: null,
    filters: {
      type: 'all',
      searchTerm: ''
    },
    uploadProgress: 0
  }),

  getters: {
    // Filter documents based on current filters
    filteredDocuments: (state) => {
      let filtered = [...state.documents]

      // Filter by type
      if (state.filters.type !== 'all') {
        filtered = filtered.filter(doc => doc.type === state.filters.type)
      }

      // Filter by search term
      if (state.filters.searchTerm) {
        const searchLower = state.filters.searchTerm.toLowerCase()
        filtered = filtered.filter(doc => 
          doc.title.toLowerCase().includes(searchLower) ||
          doc.content.toLowerCase().includes(searchLower) ||
          doc.fileName?.toLowerCase().includes(searchLower)
        )
      }

      return filtered.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
    },

    // Documents by type
    pdfDocuments: (state) => 
      state.documents.filter(doc => doc.type === 'pdf'),
    
    wordDocuments: (state) => 
      state.documents.filter(doc => doc.type === 'word'),
    
    csvDocuments: (state) => 
      state.documents.filter(doc => doc.type === 'csv'),
    
    manualDocuments: (state) => 
      state.documents.filter(doc => doc.type === 'manual'),

    // Statistics
    totalDocuments: (state) => state.documents.length,
    
    documentsByType: (state) => {
      const typeCount: Record<string, number> = {}
      state.documents.forEach(doc => {
        typeCount[doc.type] = (typeCount[doc.type] || 0) + 1
      })
      return typeCount
    },

    // Recent documents (last 7 days)
    recentDocuments: (state) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return state.documents.filter(doc => 
        new Date(doc.uploadedAt) >= sevenDaysAgo
      )
    },

    // Get document by ID
    getDocumentById: (state) => (id: string) => 
      state.documents.find(doc => doc.id === id),

    // Check if data needs refresh (15 minutes for knowledge base)
    needsRefresh: (state) => {
      if (!state.lastFetch) return true
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
      return state.lastFetch < fifteenMinutesAgo
    },

    // Get supported file types
    supportedFileTypes: () => ({
      'application/pdf': { label: 'PDF', icon: '📄' },
      'application/msword': { label: 'Word', icon: '📝' },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'Word', icon: '📝' },
      'text/csv': { label: 'CSV', icon: '📊' },
      'application/vnd.ms-excel': { label: 'Excel', icon: '📊' },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { label: 'Excel', icon: '📊' }
    }),

    // Get file type icon
    getFileTypeIcon: () => (type: KnowledgeBaseDocument['type']) => {
      switch (type) {
        case 'pdf': return '📄'
        case 'word': return '📝'
        case 'csv': return '📊'
        case 'manual': return '✍️'
        default: return '📄'
      }
    }
  },

  actions: {
    // =====================================
    // FETCH ACTIONS
    // =====================================
    
    /**
     * Fetch all knowledge base documents for current shop
     */
    async fetchDocuments(forceRefresh = false): Promise<void> {
      // Skip if data is fresh and not forcing refresh
      if (!forceRefresh && !this.needsRefresh) {
        return
      }

      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const { knowledgeBase } = useApi()
        const response = await knowledgeBase.list(userShopId.value)

        if (response.success && response.data) {
          this.documents = response.data
          this.lastFetch = new Date()
          this.error = null
        } else {
          this.error = response.error || 'Erreur lors du chargement des documents'
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des documents'
        console.error('Fetch documents error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // =====================================
    // DOCUMENT MANAGEMENT
    // =====================================
    
    /**
     * Upload a file to knowledge base
     */
    async uploadFile(file: File): Promise<KnowledgeBaseDocument | null> {
      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return null
      }

      // Validate file type
      const supportedTypes = Object.keys(this.supportedFileTypes)
      if (!supportedTypes.includes(file.type)) {
        this.error = 'Type de fichier non supporté. Veuillez utiliser PDF, Word ou CSV.'
        return null
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        this.error = 'Le fichier est trop volumineux. Taille maximum: 10MB.'
        return null
      }

      this.isUploading = true
      this.uploadProgress = 0
      this.error = null

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          if (this.uploadProgress < 90) {
            this.uploadProgress += Math.random() * 20
          }
        }, 500)

        const { knowledgeBase } = useApi()
        const response = await knowledgeBase.upload(userShopId.value, file)

        clearInterval(progressInterval)
        this.uploadProgress = 100

        if (response.success && response.data) {
          // Add to documents list
          this.documents.unshift(response.data)
          
          // Track upload event
          const { trackEvent } = useAnalytics()
          await trackEvent('knowledge_base_upload', {
            documentType: response.data.type,
            fileName: response.data.fileName,
            fileSize: file.size
          })

          return response.data
        } else {
          this.error = response.error || 'Erreur lors de l\'upload du fichier'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de l\'upload du fichier'
        console.error('Upload file error:', error)
        return null
      } finally {
        this.isUploading = false
        this.uploadProgress = 0
      }
    },

    /**
     * Add manual content to knowledge base
     */
    async addManualContent(title: string, content: string): Promise<KnowledgeBaseDocument | null> {
      const authStore = useAuthStore()
      const userShopId = computed(() => authStore.userShopId)
      if (!userShopId.value) {
        this.error = 'Shop ID manquant'
        return null
      }

      if (!title.trim() || !content.trim()) {
        this.error = 'Le titre et le contenu sont requis'
        return null
      }

      this.isLoading = true
      this.error = null

      try {
        const { knowledgeBase } = useApi()
        const response = await knowledgeBase.addManual(userShopId.value, {
          title: title.trim(),
          content: content.trim()
        })

        if (response.success && response.data) {
          // Add to documents list
          this.documents.unshift(response.data)
          
          // Track manual content addition
          const { trackEvent } = useAnalytics()
          await trackEvent('knowledge_base_manual_add', {
            title,
            contentLength: content.length
          })

          return response.data
        } else {
          this.error = response.error || 'Erreur lors de l\'ajout du contenu'
          return null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de l\'ajout du contenu'
        console.error('Add manual content error:', error)
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete a document from knowledge base
     */
    async deleteDocument(documentId: string): Promise<boolean> {
      try {
        const { knowledgeBase } = useApi()
        const response = await knowledgeBase.delete(documentId)

        if (response.success) {
          // Remove from documents list
          const index = this.documents.findIndex(doc => doc.id === documentId)
          if (index !== -1) {
            const deletedDoc = this.documents[index]
            this.documents.splice(index, 1)
            
            // Track deletion
            const { trackEvent } = useAnalytics()
            await trackEvent('knowledge_base_delete', {
              documentType: deletedDoc.type,
              documentTitle: deletedDoc.title
            })
          }

          return true
        } else {
          this.error = response.error || 'Erreur lors de la suppression du document'
          return false
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression du document'
        console.error('Delete document error:', error)
        return false
      }
    },

    // =====================================
    // FILTERING AND SEARCH
    // =====================================
    
    /**
     * Set type filter
     */
    setTypeFilter(type: KnowledgeBaseDocument['type'] | 'all'): void {
      this.filters.type = type
    },

    /**
     * Set search term
     */
    setSearchTerm(term: string): void {
      this.filters.searchTerm = term
    },

    /**
     * Clear all filters
     */
    clearFilters(): void {
      this.filters = {
        type: 'all',
        searchTerm: ''
      }
    },

    // =====================================
    // UTILITY ACTIONS
    // =====================================
    
    /**
     * Clear error
     */
    clearError(): void {
      this.error = null
    },

    /**
     * Clear all data (for logout)
     */
    clearData(): void {
      this.documents = []
      this.error = null
      this.lastFetch = null
      this.uploadProgress = 0
      this.clearFilters()
    },

    /**
     * Get document summary for display
     */
    getDocumentSummary(document: KnowledgeBaseDocument): {
      preview: string
      wordCount: number
      size: string
      uploadDate: string
    } {
      const preview = document.content.length > 150 
        ? document.content.substring(0, 150) + '...'
        : document.content

      const wordCount = document.content.split(/\s+/).filter(word => word.length > 0).length
      
      const size = document.fileName 
        ? 'Fichier uploadé'
        : `${Math.ceil(document.content.length / 1000)}k caractères`

      const uploadDate = new Date(document.uploadedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })

      return {
        preview,
        wordCount,
        size,
        uploadDate
      }
    },

    /**
     * Validate file before upload
     */
    validateFile(file: File): { isValid: boolean; error?: string } {
      // Check file type
      const supportedTypes = Object.keys(this.supportedFileTypes)
      if (!supportedTypes.includes(file.type)) {
        return {
          isValid: false,
          error: 'Type de fichier non supporté. Veuillez utiliser PDF, Word ou CSV.'
        }
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        return {
          isValid: false,
          error: 'Le fichier est trop volumineux. Taille maximum: 10MB.'
        }
      }

      // Check file name
      if (!file.name || file.name.length > 255) {
        return {
          isValid: false,
          error: 'Nom de fichier invalide.'
        }
      }

      return { isValid: true }
    },

    /**
     * Get knowledge base status
     */
    getKnowledgeBaseStatus(): {
      isEmpty: boolean
      totalDocuments: number
      totalContent: number
      lastUpdate: string | null
      readiness: 'empty' | 'minimal' | 'good' | 'excellent'
    } {
      const totalDocuments = this.documents.length
      const totalContent = this.documents.reduce((sum, doc) => sum + doc.content.length, 0)
      
      const lastUpdate = this.documents.length > 0
        ? new Date(Math.max(...this.documents.map(doc => new Date(doc.uploadedAt).getTime())))
            .toLocaleDateString('fr-FR')
        : null

      let readiness: 'empty' | 'minimal' | 'good' | 'excellent' = 'empty'
      if (totalDocuments === 0) {
        readiness = 'empty'
      } else if (totalDocuments < 3 || totalContent < 5000) {
        readiness = 'minimal'
      } else if (totalDocuments < 10 || totalContent < 20000) {
        readiness = 'good'
      } else {
        readiness = 'excellent'
      }

      return {
        isEmpty: totalDocuments === 0,
        totalDocuments,
        totalContent,
        lastUpdate,
        readiness
      }
    }
  }
})

// =====================================
// COMPOSABLE FOR EASY ACCESS
// =====================================

export const useKnowledgeBase = () => {
  const knowledgeBaseStore = useKnowledgeBaseStore()
  
  return {
    // State
    documents: computed(() => knowledgeBaseStore.documents),
    isLoading: computed(() => knowledgeBaseStore.isLoading),
    isUploading: computed(() => knowledgeBaseStore.isUploading),
    error: computed(() => knowledgeBaseStore.error),
    filters: computed(() => knowledgeBaseStore.filters),
    uploadProgress: computed(() => knowledgeBaseStore.uploadProgress),
    
    // Getters
    filteredDocuments: computed(() => knowledgeBaseStore.filteredDocuments),
    pdfDocuments: computed(() => knowledgeBaseStore.pdfDocuments),
    wordDocuments: computed(() => knowledgeBaseStore.wordDocuments),
    csvDocuments: computed(() => knowledgeBaseStore.csvDocuments),
    manualDocuments: computed(() => knowledgeBaseStore.manualDocuments),
    totalDocuments: computed(() => knowledgeBaseStore.totalDocuments),
    documentsByType: computed(() => knowledgeBaseStore.documentsByType),
    recentDocuments: computed(() => knowledgeBaseStore.recentDocuments),
    supportedFileTypes: computed(() => knowledgeBaseStore.supportedFileTypes),
    
    // Actions
    fetchDocuments: knowledgeBaseStore.fetchDocuments,
    uploadFile: knowledgeBaseStore.uploadFile,
    addManualContent: knowledgeBaseStore.addManualContent,
    deleteDocument: knowledgeBaseStore.deleteDocument,
    setTypeFilter: knowledgeBaseStore.setTypeFilter,
    setSearchTerm: knowledgeBaseStore.setSearchTerm,
    clearFilters: knowledgeBaseStore.clearFilters,
    clearError: knowledgeBaseStore.clearError,
    clearData: knowledgeBaseStore.clearData,
    getDocumentSummary: knowledgeBaseStore.getDocumentSummary,
    validateFile: knowledgeBaseStore.validateFile,
    getKnowledgeBaseStatus: knowledgeBaseStore.getKnowledgeBaseStatus,
    
    // Utilities
    getDocumentById: knowledgeBaseStore.getDocumentById,
    getFileTypeIcon: knowledgeBaseStore.getFileTypeIcon
  }
}