<!-- pages/knowledge-base.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Base de connaissance
        </h1>
        <p class="text-gray-600 mt-1">
          Gérez les documents qui alimentent votre agent IA
        </p>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <button
          @click="showUploadModal = true"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Uploader un fichier
        </button>
        
        <button
          @click="showManualModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter du contenu
        </button>
        
        <button
          @click="refreshDocuments"
          :disabled="isLoading"
          class="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2 inline" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>
    </div>

    <!-- Knowledge Base Status -->
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Statut de la base de connaissance
        </h3>
        <span 
          class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
          :class="getReadinessClass(knowledgeBaseStatus.readiness)"
        >
          {{ getReadinessLabel(knowledgeBaseStatus.readiness) }}
        </span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <p class="text-3xl font-bold text-blue-600">{{ knowledgeBaseStatus.totalDocuments }}</p>
          <p class="text-sm text-gray-600">Documents</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-green-600">{{ Math.round(knowledgeBaseStatus.totalContent / 1000) }}k</p>
          <p class="text-sm text-gray-600">Caractères</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-purple-600">{{ knowledgeBaseStatus.lastUpdate || 'Jamais' }}</p>
          <p class="text-sm text-gray-600">Dernière MAJ</p>
        </div>
      </div>
      
      <div v-if="knowledgeBaseStatus.isEmpty" class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex">
          <svg class="w-5 h-5 text-yellow-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h4 class="text-yellow-800 font-medium">Base de connaissance vide</h4>
            <p class="text-yellow-700 text-sm mt-1">
              Votre agent IA n'a pas encore de contenu pour répondre aux questions. Ajoutez des documents ou du contenu manuel pour améliorer ses réponses.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <span class="text-2xl">📄</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">PDF</p>
            <p class="text-2xl font-bold text-gray-900">{{ pdfDocuments.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <span class="text-2xl">📝</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Word</p>
            <p class="text-2xl font-bold text-gray-900">{{ wordDocuments.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <span class="text-2xl">📊</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">CSV</p>
            <p class="text-2xl font-bold text-gray-900">{{ csvDocuments.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <span class="text-2xl">✍️</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Manuel</p>
            <p class="text-2xl font-bold text-gray-900">{{ manualDocuments.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Type Filter -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Type:</label>
          <select 
            v-model="filters.type" 
            @change="setTypeFilter(filters.type)"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous</option>
            <option value="pdf">PDF</option>
            <option value="word">Word</option>
            <option value="csv">CSV</option>
            <option value="manual">Manuel</option>
          </select>
        </div>

        <!-- Search -->
        <div class="flex items-center space-x-2 flex-1 max-w-md">
          <label class="text-sm font-medium text-gray-700">Recherche:</label>
          <input 
            v-model="filters.search"
            @input="setSearchTerm(filters.search)"
            type="text"
            placeholder="Titre, contenu..."
            class="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Clear filters -->
        <button
          @click="clearAllFilters"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          Effacer
        </button>
      </div>
    </div>

    <!-- Documents List -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading && documents.length === 0" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="flex space-x-4">
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button @click="refreshDocuments" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Réessayer
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredDocuments.length === 0" class="p-6 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 mb-4">Aucun document trouvé</p>
        <div class="space-x-2">
          <button
            @click="showUploadModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Uploader un fichier
          </button>
          <button
            @click="showManualModal = true"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Ajouter du contenu
          </button>
        </div>
      </div>

      <!-- Documents List -->
      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="document in filteredDocuments"
          :key="document.id"
          class="p-6 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between">
            <!-- Document Info -->
            <div class="flex items-start space-x-4 flex-1">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <span class="text-2xl">{{ getFileTypeIcon(document.type) }}</span>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-medium text-gray-900 truncate">
                    {{ document.title }}
                  </h3>
                  <span class="text-sm text-gray-500">
                    {{ getDocumentSummary(document).uploadDate }}
                  </span>
                </div>
                
                <p class="text-sm text-gray-600 mb-3">
                  {{ getDocumentSummary(document).preview }}
                </p>
                
                <div class="flex items-center text-xs text-gray-500 space-x-4">
                  <span>{{ getDocumentSummary(document).wordCount }} mots</span>
                  <span>{{ getDocumentSummary(document).size }}</span>
                  <span v-if="document.fileName" class="truncate">{{ document.fileName }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2 ml-4">
              <button
                @click="viewDocument(document)"
                class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200"
              >
                Voir
              </button>
              <button
                @click="confirmDeleteDocument(document)"
                class="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full hover:bg-red-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Uploader un fichier</h3>
            <button
              @click="closeUploadModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Upload Area -->
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
            :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
            @drop="handleFileDrop"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.csv"
              @change="handleFileSelect"
              class="hidden"
            />
            
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p class="text-gray-600 mb-2">
              Glissez-déposez vos fichiers ici ou
              <button
                @click="$refs.fileInput.click()"
                class="text-blue-600 hover:text-blue-500 font-medium"
              >
                parcourez
              </button>
            </p>
            
            <p class="text-xs text-gray-500">
              Formats supportés: PDF, Word, CSV (max 10MB)
            </p>
          </div>

          <!-- Selected Files -->
          <div v-if="selectedFiles.length > 0" class="space-y-2">
            <h4 class="text-sm font-medium text-gray-900">Fichiers sélectionnés:</h4>
            <div class="space-y-2">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <span class="text-sm text-gray-600">{{ getFileTypeIcon(getFileType(file.type)) }}</span>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeSelectedFile(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="isUploading" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Upload en cours...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${uploadProgress}%` }"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="closeUploadModal"
              :disabled="isUploading"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              @click="uploadFiles"
              :disabled="selectedFiles.length === 0 || isUploading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isUploading ? 'Upload...' : 'Uploader' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Manual Content Modal -->
    <div v-if="showManualModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Ajouter du contenu manuel</h3>
            <button
              @click="closeManualModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Titre du document
              </label>
              <input
                v-model="manualContent.title"
                type="text"
                placeholder="Ex: FAQ Produits, Conditions de vente..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                v-model="manualContent.content"
                rows="12"
                placeholder="Saisissez le contenu de votre document..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                {{ manualContent.content.length }} caractères
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="closeManualModal"
              :disabled="isLoading"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              @click="saveManualContent"
              :disabled="!manualContent.title.trim() || !manualContent.content.trim() || isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Document View Modal -->
    <div v-if="selectedDocument" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ selectedDocument.title }}</h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ getDocumentSummary(selectedDocument).uploadDate }} • 
                {{ getDocumentSummary(selectedDocument).wordCount }} mots
              </p>
            </div>
            <button
              @click="selectedDocument = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre class="whitespace-pre-wrap text-sm text-gray-900">{{ selectedDocument.content }}</pre>
          </div>

          <!-- Actions -->
          <div class="flex justify-between">
            <button
              @click="confirmDeleteDocument(selectedDocument)"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Supprimer
            </button>
            <button
              @click="selectedDocument = null"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KnowledgeBaseDocument } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

// =====================================
// COMPOSABLES AND STORES
// =====================================

const {
  fetchDocuments,
  uploadFile,
  addManualContent,
  deleteDocument,
  isLoading,
  isUploading,
  error,
  uploadProgress,
  documents,
  filteredDocuments,
  pdfDocuments,
  wordDocuments,
  csvDocuments,
  manualDocuments,
  filters,
  setTypeFilter,
  setSearchTerm,
  clearFilters,
  getDocumentSummary,
  validateFile,
  getKnowledgeBaseStatus,
  getFileTypeIcon,
  clearError
} = useKnowledgeBase()

const { success, handleApiError, confirm } = useNotifications()

// =====================================
// REACTIVE STATE
// =====================================

const showUploadModal = ref(false)
const showManualModal = ref(false)
const selectedDocument = ref<KnowledgeBaseDocument | null>(null)
const selectedFiles = ref<File[]>([])
const isDragOver = ref(false)

const manualContent = reactive({
  title: '',
  content: ''
})

const fileInput = ref<HTMLInputElement>()

// =====================================
// COMPUTED
// =====================================

const knowledgeBaseStatus = computed(() => getKnowledgeBaseStatus())

// =====================================
// METHODS
// =====================================

/**
 * Refresh documents data
 */
const refreshDocuments = async (): Promise<void> => {
  try {
    await fetchDocuments(true)
    success('Données actualisées', 'Les documents ont été mis à jour')
  } catch (error: any) {
    handleApiError(error, 'Actualisation des documents')
  }
}

/**
 * Clear all filters
 */
const clearAllFilters = (): void => {
  filters.value.type = 'all'
  filters.value.search = ''
  clearFilters()
}

/**
 * View document details
 */
const viewDocument = (document: KnowledgeBaseDocument): void => {
  selectedDocument.value = document
}

/**
 * Confirm and delete document
 */
const confirmDeleteDocument = (document: KnowledgeBaseDocument): void => {
  confirm(
    'Supprimer le document',
    `Êtes-vous sûr de vouloir supprimer "${document.title}" ? Cette action est irréversible.`,
    async () => {
      try {
        const success_delete = await deleteDocument(document.id)
        if (success_delete) {
          success('Document supprimé', `"${document.title}" a été supprimé`)
          
          // Close modal if viewing deleted document
          if (selectedDocument.value?.id === document.id) {
            selectedDocument.value = null
          }
        }
      } catch (error: any) {
        handleApiError(error, 'Suppression du document')
      }
    },
    undefined,
    {
      confirmLabel: 'Supprimer',
      cancelLabel: 'Annuler',
      type: 'warning'
    }
  )
}

// =====================================
// FILE UPLOAD METHODS
// =====================================

/**
 * Handle file selection from input
 */
const handleFileSelect = (event: Event): void => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    addFiles(Array.from(input.files))
  }
}

/**
 * Handle file drop
 */
const handleFileDrop = (event: DragEvent): void => {
  event.preventDefault()
  isDragOver.value = false
  
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

/**
 * Add files to selection
 */
const addFiles = (files: File[]): void => {
  const validFiles: File[] = []
  
  for (const file of files) {
    const validation = validateFile(file)
    if (validation.isValid) {
      validFiles.push(file)
    } else {
      handleApiError(validation.error, 'Validation du fichier')
    }
  }
  
  selectedFiles.value.push(...validFiles)
}

/**
 * Remove selected file
 */
const removeSelectedFile = (index: number): void => {
  selectedFiles.value.splice(index, 1)
}

/**
 * Upload selected files
 */
const uploadFiles = async (): Promise<void> => {
  if (selectedFiles.value.length === 0) return

  try {
    for (const file of selectedFiles.value) {
      await uploadFile(file)
    }
    
    success('Upload réussi', `${selectedFiles.value.length} fichier(s) uploadé(s)`)
    closeUploadModal()
  } catch (error: any) {
    handleApiError(error, 'Upload des fichiers')
  }
}

/**
 * Close upload modal
 */
const closeUploadModal = (): void => {
  showUploadModal.value = false
  selectedFiles.value = []
  isDragOver.value = false
  clearError()
}

// =====================================
// MANUAL CONTENT METHODS
// =====================================

/**
 * Save manual content
 */
const saveManualContent = async (): Promise<void> => {
  if (!manualContent.title.trim() || !manualContent.content.trim()) {
    return
  }

  try {
    const document = await addManualContent(manualContent.title, manualContent.content)
    if (document) {
      success('Contenu ajouté', `"${manualContent.title}" a été ajouté à la base de connaissance`)
      closeManualModal()
    }
  } catch (error: any) {
    handleApiError(error, 'Ajout du contenu')
  }
}

/**
 * Close manual content modal
 */
const closeManualModal = (): void => {
  showManualModal.value = false
  manualContent.title = ''
  manualContent.content = ''
  clearError()
}

// =====================================
// UTILITY METHODS
// =====================================

/**
 * Get file type from MIME type
 */
const getFileType = (mimeType: string): KnowledgeBaseDocument['type'] => {
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'word'
  if (mimeType.includes('csv') || mimeType.includes('spreadsheet')) return 'csv'
  return 'pdf'
}

/**
 * Format file size
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Get readiness class
 */
const getReadinessClass = (readiness: string): string => {
  switch (readiness) {
    case 'excellent':
      return 'bg-green-100 text-green-800'
    case 'good':
      return 'bg-blue-100 text-blue-800'
    case 'minimal':
      return 'bg-yellow-100 text-yellow-800'
    case 'empty':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get readiness label
 */
const getReadinessLabel = (readiness: string): string => {
  switch (readiness) {
    case 'excellent':
      return 'Excellent'
    case 'good':
      return 'Bon'
    case 'minimal':
      return 'Minimal'
    case 'empty':
      return 'Vide'
    default:
      return 'Inconnu'
  }
}

// =====================================
// LIFECYCLE
// =====================================

onMounted(async () => {
  await fetchDocuments()
})

// =====================================
// SEO
// =====================================

useHead({
  title: 'Base de connaissance - ChatSeller',
  meta: [
    {
      name: 'description',
      content: 'Gérez les documents qui alimentent votre agent IA ChatSeller.'
    }
  ]
})
</script>