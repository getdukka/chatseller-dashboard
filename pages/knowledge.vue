<!-- pages/knowledge.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Base de connaissance</h1>
          <p class="mt-1 text-sm text-gray-600">
            Gérez le contenu qui permet à votre Agent IA de répondre intelligemment aux questions des visiteurs
          </p>
        </div>
        
        <!-- Actions -->
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button
            @click="refreshKnowledge"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            :disabled="loading"
          >
            <ArrowPathIcon class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
            Actualiser
          </button>
          
          <button 
            @click="showUploadModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <DocumentPlusIcon class="h-4 w-4 mr-2" />
            Ajouter du contenu
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-50 rounded-full">
              <DocumentTextIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Documents</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalDocuments }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-green-50 rounded-full">
              <ChatBubbleBottomCenterTextIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">FAQ</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalFAQ }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-yellow-50 rounded-full">
              <TagIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Catégories</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalCategories }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-50 rounded-full">
              <ClockIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Dernière MAJ</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatRelativeTime(stats.lastUpdate) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200'
            ]"
          >
            <component :is="tab.icon" class="h-5 w-5 mr-2" />
            {{ tab.name }}
            <span v-if="tab.count" class="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Documents Tab -->
        <div v-if="activeTab === 'documents'" class="space-y-6">
          <!-- Filters -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div class="flex space-x-4">
              <select
                v-model="filters.documentType"
                class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Tous les types</option>
                <option value="pdf">PDF</option>
                <option value="docx">Word</option>
                <option value="csv">CSV</option>
                <option value="txt">Texte</option>
              </select>

              <select
                v-model="filters.category"
                class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Toutes les catégories</option>
                <option value="products">Produits</option>
                <option value="policies">Politiques</option>
                <option value="shipping">Livraison</option>
                <option value="payment">Paiement</option>
              </select>
            </div>

            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="filters.search"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Rechercher un document..."
              />
            </div>
          </div>

          <!-- Documents Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="document in filteredDocuments"
              :key="document.id"
              class="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              @click="viewDocument(document)"
            >
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-md flex items-center justify-center" :class="getDocumentIconBg(document.type)">
                    <component :is="getDocumentIcon(document.type)" class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 truncate">{{ document.name }}</h3>
                    <p class="text-xs text-gray-500">{{ document.type.toUpperCase() }} • {{ formatFileSize(document.size) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-1">
                  <button
                    @click.stop="editDocument(document)"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click.stop="deleteDocument(document)"
                    class="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div class="space-y-2">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ getCategoryText(document.category) }}
                </span>
                <p class="text-sm text-gray-600 line-clamp-3">{{ document.description }}</p>
                <p class="text-xs text-gray-500">
                  Ajouté le {{ formatDate(document.createdAt) }}
                </p>
              </div>
            </div>

            <!-- Upload Card -->
            <div
              @click="showUploadModal = true"
              class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer group"
            >
              <div class="text-center">
                <DocumentPlusIcon class="h-12 w-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4" />
                <h3 class="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Ajouter un document
                </h3>
                <p class="text-xs text-gray-500 mt-2">
                  PDF, Word, CSV ou texte
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Tab -->
        <div v-if="activeTab === 'faq'" class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Questions fréquentes</h3>
            <button
              @click="showFAQModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Ajouter une FAQ
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="faq in faqs"
              :key="faq.id"
              class="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">{{ faq.question }}</h4>
                  <p class="text-sm text-gray-600">{{ faq.answer }}</p>
                  <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Catégorie: {{ getCategoryText(faq.category) }}</span>
                    <span>{{ formatDate(faq.createdAt) }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                  <button
                    @click="editFAQ(faq)"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteFAQ(faq)"
                    class="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Training Tab -->
        <div v-if="activeTab === 'training'" class="space-y-6">
          <div class="text-center py-12">
            <CpuChipIcon class="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Entraînement de l'IA</h3>
            <p class="text-sm text-gray-600 max-w-md mx-auto mb-6">
              L'IA s'entraîne automatiquement avec votre contenu. Vous pouvez voir ici les performances et optimiser les réponses.
            </p>
            <div class="flex justify-center space-x-4">
              <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Analyser les performances
              </button>
              <button class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
                Réentraîner le modèle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <UploadModal
      :is-open="showUploadModal"
      @close="showUploadModal = false"
      @upload="handleFileUpload"
    />

    <!-- FAQ Modal -->
    <FAQModal
      :is-open="showFAQModal"
      :faq="selectedFAQ"
      @close="closeFAQModal"
      @save="handleFAQSave"
    />
  </div>
</template>

<script setup lang="ts">
import {
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  TagIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CpuChipIcon,
  DocumentIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

// Define page meta
definePageMeta({
  layout: 'default',
  title: 'Base de connaissance - ChatSeller'
})

// State
const loading = ref(false)
const activeTab = ref('documents')
const showUploadModal = ref(false)
const showFAQModal = ref(false)
const selectedFAQ = ref<any>(null)

// Filters
const filters = reactive({
  documentType: '',
  category: '',
  search: ''
})

// Stats
const stats = ref({
  totalDocuments: 12,
  totalFAQ: 18,
  totalCategories: 4,
  lastUpdate: new Date('2025-01-14T09:30:00')
})

// Tabs configuration
const tabs = computed(() => [
  {
    id: 'documents',
    name: 'Documents',
    icon: DocumentTextIcon,
    count: stats.value.totalDocuments
  },
  {
    id: 'faq',
    name: 'FAQ',
    icon: ChatBubbleBottomCenterTextIcon,
    count: stats.value.totalFAQ
  },
  {
    id: 'training',
    name: 'Entraînement IA',
    icon: CpuChipIcon,
    count: null
  }
])

// Mock documents data
const documents = ref([
  {
    id: '1',
    name: 'Catalogue produits 2025',
    type: 'pdf',
    size: 2500000,
    category: 'products',
    description: 'Catalogue complet de tous nos produits avec descriptions détaillées et prix.',
    createdAt: new Date('2025-01-10T10:00:00'),
    status: 'processed'
  },
  {
    id: '2',
    name: 'Politique de retour',
    type: 'docx',
    size: 150000,
    category: 'policies',
    description: 'Conditions de retour et d\'échange des produits.',
    createdAt: new Date('2025-01-08T14:30:00'),
    status: 'processed'
  },
  {
    id: '3',
    name: 'Guide des tarifs de livraison',
    type: 'csv',
    size: 45000,
    category: 'shipping',
    description: 'Tarifs de livraison par zone géographique et poids.',
    createdAt: new Date('2025-01-05T09:15:00'),
    status: 'processing'
  }
])

// Mock FAQ data
const faqs = ref([
  {
    id: '1',
    question: 'Quels sont vos délais de livraison ?',
    answer: 'Nos délais de livraison varient selon votre zone : 24-48h pour Abidjan, 3-5 jours pour l\'intérieur du pays.',
    category: 'shipping',
    createdAt: new Date('2025-01-12T11:00:00')
  },
  {
    id: '2',
    question: 'Acceptez-vous le paiement Mobile Money ?',
    answer: 'Oui, nous acceptons Orange Money, MTN Money et Moov Money pour tous vos achats.',
    category: 'payment',
    createdAt: new Date('2025-01-10T09:30:00')
  },
  {
    id: '3',
    question: 'Puis-je retourner un produit si je ne suis pas satisfait ?',
    answer: 'Oui, vous avez 14 jours pour retourner un produit en parfait état avec son emballage d\'origine.',
    category: 'policies',
    createdAt: new Date('2025-01-08T15:20:00')
  }
])

// Computed
const filteredDocuments = computed(() => {
  let filtered = documents.value

  if (filters.documentType) {
    filtered = filtered.filter(doc => doc.type === filters.documentType)
  }

  if (filters.category) {
    filtered = filtered.filter(doc => doc.category === filters.category)
  }

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.name.toLowerCase().includes(search) ||
      doc.description.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

// Methods
const getDocumentIcon = (type: string) => {
  return DocumentIcon
}

const getDocumentIconBg = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-500'
    case 'docx':
      return 'bg-blue-500'
    case 'csv':
      return 'bg-green-500'
    case 'txt':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

const getCategoryText = (category: string) => {
  switch (category) {
    case 'products':
      return 'Produits'
    case 'policies':
      return 'Politiques'
    case 'shipping':
      return 'Livraison'
    case 'payment':
      return 'Paiement'
    default:
      return 'Autre'
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, { locale: fr, addSuffix: true })
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const refreshKnowledge = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}

const viewDocument = (document: any) => {
  console.log('Viewing document:', document.id)
}

const editDocument = (document: any) => {
  console.log('Editing document:', document.id)
}

const deleteDocument = (document: any) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    const index = documents.value.findIndex(doc => doc.id === document.id)
    if (index !== -1) {
      documents.value.splice(index, 1)
      stats.value.totalDocuments--
    }
  }
}

const editFAQ = (faq: any) => {
  selectedFAQ.value = faq
  showFAQModal.value = true
}

const deleteFAQ = (faq: any) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) {
    const index = faqs.value.findIndex(f => f.id === faq.id)
    if (index !== -1) {
      faqs.value.splice(index, 1)
      stats.value.totalFAQ--
    }
  }
}

const closeFAQModal = () => {
  showFAQModal.value = false
  selectedFAQ.value = null
}

const handleFileUpload = (files: FileList) => {
  console.log('Uploading files:', files)
  showUploadModal.value = false
  
  const setNotification = inject('setNotification') as (message: string) => void
  if (setNotification) {
    setNotification('Fichier(s) uploadé(s) avec succès!')
  }
}

const handleFAQSave = (faqData: any) => {
  if (selectedFAQ.value && selectedFAQ.value.id) {
    const index = faqs.value.findIndex(f => f.id === selectedFAQ.value?.id)
    if (index !== -1) {
      faqs.value[index] = { ...faqs.value[index], ...faqData }
    }
  } else {
    const newFAQ = {
      id: Date.now().toString(),
      ...faqData,
      createdAt: new Date()
    }
    faqs.value.unshift(newFAQ)
    stats.value.totalFAQ++
  }
  
  closeFAQModal()
  
  const setNotification = inject('setNotification') as (message: string) => void
  if (setNotification) {
    setNotification('FAQ sauvegardée avec succès!')
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>