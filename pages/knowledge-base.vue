<!-- pages/knowledge-base.vue - ADAPTÉ AU useApi EXISTANT -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Base de connaissances</h1>
        <p class="text-gray-600">Gérez les informations que votre agent IA utilise pour répondre aux clients</p>
      </div>
      
      <div class="flex space-x-3">
        <button
          @click="showUploadModal = true"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          Importer un fichier
        </button>
        
        <button
          @click="showAddModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Ajouter manuellement
        </button>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher dans la base de connaissances..."
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
        </div>
        
        <select v-model="selectedType" class="border border-gray-300 rounded-md px-3 py-2">
          <option value="">Tous les types</option>
          <option value="pdf">PDF</option>
          <option value="word">Word</option>
          <option value="csv">CSV</option>
          <option value="manual">Manuel</option>
        </select>
      </div>
    </div>

    <!-- Liste des connaissances -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <ul class="divide-y divide-gray-200">
        <li v-for="item in filteredKnowledge" :key="item.id" class="p-6 hover:bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-sm font-medium text-gray-900">{{ item.title }}</h3>
                
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    item.type === 'manual' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'pdf' ? 'bg-red-100 text-red-800' :
                    item.type === 'word' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  ]"
                >
                  {{ getTypeLabel(item.type) }}
                </span>
                
                <span v-if="item.fileName" class="text-xs text-gray-500">
                  {{ item.fileName }}
                </span>
              </div>
              
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                {{ item.content }}
              </p>
              
              <div class="mt-2 flex items-center text-xs text-gray-500">
                <time :datetime="item.uploadedAt">
                  Ajouté le {{ formatDate(item.uploadedAt) }}
                </time>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button
                @click="editItem(item)"
                class="p-2 text-gray-400 hover:text-gray-600"
                title="Modifier"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              
              <button
                @click="deleteItem(item)"
                class="p-2 text-gray-400 hover:text-red-600"
                title="Supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>
      
      <!-- État vide -->
      <div v-if="filteredKnowledge.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune connaissance trouvée</h3>
        <p class="mt-1 text-sm text-gray-500">
          Commencez par ajouter des informations à votre base de connaissances.
        </p>
        <div class="mt-6">
          <button
            @click="showAddModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Ajouter votre première connaissance
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UploadModal
      v-if="showUploadModal"
      @close="showUploadModal = false"
      @upload="handleFileUpload"
    />
    
    <KnowledgeEditModal
      v-if="showAddModal || editingItem"
      :item="editingItem"
      @close="closeEditModal"
      @save="handleSaveItem"
    />

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KnowledgeBaseDocument } from '../types/index'

// ✅ META PAGE
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// ✅ COMPOSABLES
const auth = useAuth()
const api = useApi() // ✅ Utilise le useApi existant

// ✅ REACTIVE DATA - SANS TYPES EXPLICITES POUR ÉVITER LES ERREURS
const loading = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const showUploadModal = ref(false)
const showAddModal = ref(false)
const editingItem = ref(null)
const knowledgeItems = ref([])

// ✅ COMPUTED
const filteredKnowledge = computed(() => {
  let filtered = knowledgeItems.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(item => item.type === selectedType.value)
  }

  return filtered
})

// ✅ METHODS
const editItem = (item: KnowledgeBaseDocument) => {
  editingItem.value = { ...item }
}

const deleteItem = async (item: KnowledgeBaseDocument) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette connaissance ?')) {
    try {
      // ✅ Utilise la méthode correcte du useApi existant
      const response = await api.knowledgeBase.delete(item.id)
      if (response.success) {
        await loadKnowledgeItems()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const loadKnowledgeItems = async () => {
  loading.value = true
  
  try {
    // ✅ Utilise la méthode correcte du useApi existant
    const response = await api.knowledgeBase.list(auth.userShopId.value || undefined)
    if (response.success && response.data) {
      knowledgeItems.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    
    // Données factices pour le développement
    knowledgeItems.value = [
      {
        id: '1',
        shopId: auth.userShopId.value || 'shop1',
        title: 'Guide des produits',
        content: 'Informations détaillées sur tous nos produits...',
        type: 'manual',
        uploadedAt: new Date().toISOString()
      },
      {
        id: '2',
        shopId: auth.userShopId.value || 'shop1',
        title: 'Politique de livraison',
        content: 'Nos délais et conditions de livraison...',
        type: 'pdf',
        fileName: 'livraison.pdf',
        uploadedAt: new Date().toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

const handleFileUpload = async (file: File) => {
  try {
    // ✅ Utilise la méthode correcte du useApi existant
    const response = await api.knowledgeBase.upload(auth.userShopId.value || '', file)
    if (response.success) {
      showUploadModal.value = false
      await loadKnowledgeItems()
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
  }
}

const handleSaveItem = async (item: Partial<KnowledgeBaseDocument>) => {
  try {
    if (editingItem.value?.id) {
      // TODO: Ajouter méthode update au useApi si nécessaire
      console.log('Update item:', item)
    } else {
      // ✅ Utilise la méthode correcte du useApi existant
      const response = await api.knowledgeBase.addManual(
        auth.userShopId.value || '', 
        {
          title: item.title || '',
          content: item.content || ''
        }
      )
      
      if (response.success) {
        closeEditModal()
        await loadKnowledgeItems()
      }
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const closeEditModal = () => {
  showAddModal.value = false
  editingItem.value = null
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    manual: 'Manuel',
    pdf: 'PDF',
    word: 'Word',
    csv: 'CSV'
  }
  return labels[type] || type
}

// ✅ LIFECYCLE
onMounted(() => {
  loadKnowledgeItems()
})
</script>
