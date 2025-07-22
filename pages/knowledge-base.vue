<!-- pages/knowledge-base.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Base de connaissance</h1>
            <p class="mt-1 text-sm text-gray-600">
              Gérez les documents qui alimentent votre agent IA commercial
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshDocuments"
              :disabled="refreshing"
              class="btn-secondary"
            >
              <svg 
                class="mr-2 h-4 w-4" 
                :class="{ 'animate-spin': refreshing }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ refreshing ? 'Actualisation...' : 'Actualiser' }}
            </button>
            
            <button
              @click="showUploadModal = true"
              class="btn-primary"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un document
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="p-6">
      <!-- Statut de la base de connaissance -->
      <div class="card mb-6">
        <div class="flex items-center justify-between p-6">
          <div class="flex items-center space-x-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg" :class="statusIconClass">
              <svg class="h-6 w-6" :class="statusIconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" v-if="knowledgeBaseStatus === 'ready'" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" v-else />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ getStatusTitle(knowledgeBaseStatus) }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ getStatusDescription(knowledgeBaseStatus) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900">{{ stats.totalDocuments }}</div>
            <div class="text-sm text-gray-500">documents</div>
          </div>
        </div>
        
        <!-- Barre de progression -->
        <div v-if="trainingProgress > 0 && trainingProgress < 100" class="px-6 pb-6">
          <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Formation de l'IA en cours...</span>
            <span>{{ trainingProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${trainingProgress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="card text-center">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 mx-auto mb-3">
            <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.pdfCount }}</div>
          <div class="text-sm text-gray-600">Fichiers PDF</div>
        </div>

        <div class="card text-center">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 mx-auto mb-3">
            <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.docCount }}</div>
          <div class="text-sm text-gray-600">Documents Word</div>
        </div>

        <div class="card text-center">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 mx-auto mb-3">
            <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2z" />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.csvCount }}</div>
          <div class="text-sm text-gray-600">Tableaux CSV</div>
        </div>

        <div class="card text-center">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 mx-auto mb-3">
            <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ stats.manualCount }}</div>
          <div class="text-sm text-gray-600">Contenu manuel</div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="card mb-6">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Documents</h3>
            <div class="flex items-center space-x-4">
              <!-- Recherche -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher un document..."
                  class="input-primary pl-10"
                  style="min-width: 250px;"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <!-- Filtre par type -->
              <select v-model="selectedType" class="input-primary">
                <option value="">Tous les types</option>
                <option value="pdf">PDF</option>
                <option value="doc">Word</option>
                <option value="csv">CSV</option>
                <option value="manual">Manuel</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Liste des documents -->
        <div v-if="loading" class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
              <div class="skeleton-avatar"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton-text w-1/3"></div>
                <div class="skeleton-text w-2/3"></div>
              </div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredDocuments.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="document in paginatedDocuments"
            :key="document.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Icône du type de fichier -->
                <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="getFileIconClass(document.type)">
                  <component :is="getFileIcon(document.type)" class="h-5 w-5" />
                </div>

                <!-- Informations du document -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ document.name }}
                    </h4>
                    <span 
                      class="badge"
                      :class="getStatusBadgeClass(document.status)"
                    >
                      {{ getDocumentStatusLabel(document.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ document.description || 'Aucune description' }}
                  </p>
                  <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{{ formatFileSize(document.size) }}</span>
                    <span>{{ formatDate(document.uploadedAt) }}</span>
                    <span v-if="document.processedAt">
                      Traité le {{ formatDate(document.processedAt) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <button
                  v-if="document.status === 'processed'"
                  @click="viewDocument(document.id)"
                  class="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                  title="Voir le contenu"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                
                <button
                  @click="editDocument(document.id)"
                  class="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                  title="Modifier"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  @click="deleteDocument(document.id)"
                  class="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                  title="Supprimer"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun document</h3>
          <p class="mt-1 text-sm text-gray-500">
            Commencez par ajouter des documents pour alimenter votre agent IA
          </p>
          <div class="mt-6">
            <button
              @click="showUploadModal = true"
              class="btn-primary"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter votre premier document
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredDocuments.length > pageSize" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Affichage de {{ ((currentPage - 1) * pageSize) + 1 }} à 
              {{ Math.min(currentPage * pageSize, filteredDocuments.length) }} sur 
              {{ filteredDocuments.length }} documents
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage > 1 && (currentPage--)"
                :disabled="currentPage <= 1"
                class="btn-secondary btn-sm"
              >
                Précédent
              </button>
              <button
                @click="currentPage < totalPages && (currentPage++)"
                :disabled="currentPage >= totalPages"
                class="btn-secondary btn-sm"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'upload -->
    <Modal v-model="showUploadModal" title="Ajouter un document" size="lg">
      <div class="space-y-6">
        <!-- Zone de drag & drop -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
          :class="{ 'border-blue-400 bg-blue-50': isDragging }"
          @drop="handleDrop"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
        >
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div class="text-lg font-medium text-gray-900 mb-2">
            Glissez vos fichiers ici
          </div>
          <div class="text-sm text-gray-600 mb-4">
            ou cliquez pour sélectionner
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.csv,.txt"
            class="hidden"
            @change="handleFileSelect"
          />
          <button
            @click="$refs.fileInput.click()"
            class="btn-primary"
          >
            Sélectionner des fichiers
          </button>
          <p class="text-xs text-gray-500 mt-4">
            Formats acceptés: PDF, Word, CSV, TXT (max 10 Mo par fichier)
          </p>
        </div>

        <!-- Fichiers sélectionnés -->
        <div v-if="selectedFiles.length > 0" class="space-y-3">
          <h4 class="text-sm font-medium text-gray-900">Fichiers sélectionnés:</h4>
          <div class="space-y-2">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                  <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ file.name }}</div>
                  <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
                </div>
              </div>
              <button
                @click="removeFile(index)"
                class="text-red-400 hover:text-red-600"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button variant="secondary" @click="cancelUpload">
          Annuler
        </Button>
        <Button 
          variant="primary" 
          :disabled="selectedFiles.length === 0 || uploading"
          :loading="uploading"
          @click="uploadFiles"
        >
          {{ uploading ? 'Upload en cours...' : `Uploader ${selectedFiles.length} fichier(s)` }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Types
interface Document {
  id: string
  name: string
  description?: string
  type: 'pdf' | 'doc' | 'csv' | 'manual'
  size: number
  status: 'uploading' | 'processing' | 'processed' | 'error'
  uploadedAt: string
  processedAt?: string
}

interface Stats {
  totalDocuments: number
  pdfCount: number
  docCount: number
  csvCount: number
  manualCount: number
}

// État du composant
const loading = ref(true)
const refreshing = ref(false)
const showUploadModal = ref(false)
const uploading = ref(false)
const isDragging = ref(false)
const selectedFiles = ref<File[]>([])
const searchQuery = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const knowledgeBaseStatus = ref<'empty' | 'partial' | 'ready' | 'training'>('partial')
const trainingProgress = ref(0)

// Données
const documents = ref<Document[]>([])
const stats = reactive<Stats>({
  totalDocuments: 0,
  pdfCount: 0,
  docCount: 0,
  csvCount: 0,
  manualCount: 0
})

// Computed properties
const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (searchQuery.value) {
    filtered = filtered.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(doc => doc.type === selectedType.value)
  }

  return filtered
})

const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredDocuments.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredDocuments.value.length / pageSize.value)
)

const statusIconClass = computed(() => {
  switch (knowledgeBaseStatus.value) {
    case 'ready': return 'bg-green-50'
    case 'training': return 'bg-blue-50'
    case 'partial': return 'bg-yellow-50'
    default: return 'bg-gray-50'
  }
})

const statusIconColor = computed(() => {
  switch (knowledgeBaseStatus.value) {
    case 'ready': return 'text-green-600'
    case 'training': return 'text-blue-600'
    case 'partial': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
})

// Méthodes utilitaires
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusTitle = (status: string): string => {
  const titles = {
    empty: 'Base de connaissance vide',
    partial: 'Configuration incomplète',
    ready: 'Agent IA opérationnel',
    training: 'Formation en cours'
  }
  return titles[status as keyof typeof titles] || status
}

const getStatusDescription = (status: string): string => {
  const descriptions = {
    empty: 'Ajoutez des documents pour commencer',
    partial: 'Ajoutez plus de contenu pour améliorer les réponses',
    ready: 'Votre agent IA est prêt à répondre aux clients',
    training: 'L\'IA assimile les nouveaux documents'
  }
  return descriptions[status as keyof typeof descriptions] || status
}

const getFileIconClass = (type: string): string => {
  const classes = {
    pdf: 'bg-red-50',
    doc: 'bg-blue-50',
    csv: 'bg-green-50',
    manual: 'bg-purple-50'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-50'
}

const getFileIcon = (type: string) => {
  // Retourne le nom du composant SVG basé sur le type
  return 'svg' // Simplifié pour cet exemple
}

const getDocumentStatusLabel = (status: string): string => {
  const labels = {
    uploading: 'Upload...',
    processing: 'Traitement...',
    processed: 'Prêt',
    error: 'Erreur'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    uploading: 'badge-warning',
    processing: 'badge-info',
    processed: 'badge-success',
    error: 'badge-error'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

// Actions
const loadDocuments = async () => {
  loading.value = true
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Données simulées
    documents.value = [
      {
        id: '1',
        name: 'Guide produits 2025.pdf',
        description: 'Catalogue complet des produits avec descriptions détaillées',
        type: 'pdf',
        size: 2500000,
        status: 'processed',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'FAQ clients.docx',
        description: 'Questions fréquentes et réponses standardisées',
        type: 'doc',
        size: 150000,
        status: 'processed',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Tarifs et promotions.csv',
        description: 'Grille tarifaire et offres promotionnelles en cours',
        type: 'csv',
        size: 45000,
        status: 'processing',
        uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Mise à jour des statistiques
    stats.totalDocuments = documents.value.length
    stats.pdfCount = documents.value.filter(d => d.type === 'pdf').length
    stats.docCount = documents.value.filter(d => d.type === 'doc').length
    stats.csvCount = documents.value.filter(d => d.type === 'csv').length
    stats.manualCount = documents.value.filter(d => d.type === 'manual').length

    // Déterminer le statut de la base de connaissance
    const processedCount = documents.value.filter(d => d.status === 'processed').length
    if (processedCount === 0) {
      knowledgeBaseStatus.value = 'empty'
    } else if (processedCount < 3) {
      knowledgeBaseStatus.value = 'partial'
    } else {
      knowledgeBaseStatus.value = 'ready'
    }

  } catch (error) {
    console.error('Erreur lors du chargement des documents:', error)
  } finally {
    loading.value = false
  }
}

const refreshDocuments = async () => {
  refreshing.value = true
  try {
    await loadDocuments()
  } finally {
    refreshing.value = false
  }
}

// Gestion des fichiers
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  addFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
}

const addFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv', 'text/plain']
    const validSize = file.size <= 10 * 1024 * 1024 // 10 Mo
    
    return validTypes.includes(file.type) && validSize
  })

  selectedFiles.value.push(...validFiles)
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const uploadFiles = async () => {
  uploading.value = true
  try {
    // Simulation d'upload
    for (const file of selectedFiles.value) {
      const newDocument: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file.type),
        size: file.size,
        status: 'uploading',
        uploadedAt: new Date().toISOString()
      }

      documents.value.unshift(newDocument)

      // Simulation du traitement
      setTimeout(() => {
        newDocument.status = 'processing'
      }, 1000)

      setTimeout(() => {
        newDocument.status = 'processed'
        newDocument.processedAt = new Date().toISOString()
      }, 3000)
    }

    selectedFiles.value = []
    showUploadModal.value = false
    
    // Mise à jour des stats
    stats.totalDocuments = documents.value.length
    
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
  } finally {
    uploading.value = false
  }
}

const getFileType = (mimeType: string): Document['type'] => {
  if (mimeType.includes('pdf')) return 'pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc'
  if (mimeType.includes('csv')) return 'csv'
  return 'manual'
}

const cancelUpload = () => {
  selectedFiles.value = []
  showUploadModal.value = false
}

// Actions sur les documents
const viewDocument = (id: string) => {
  console.log('Voir document:', id)
  // Logique pour afficher le contenu du document
}

const editDocument = (id: string) => {
  console.log('Modifier document:', id)
  // Logique pour modifier le document
}

const deleteDocument = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    return
  }

  try {
    documents.value = documents.value.filter(doc => doc.id !== id)
    stats.totalDocuments = documents.value.length
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadDocuments()
})
</script>

<style scoped>
/* Les styles sont définis dans le fichier CSS global */
</style>