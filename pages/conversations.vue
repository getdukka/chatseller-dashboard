<template>
  <div class="space-y-6">
    <!-- Header avec filtres -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Conversations</h1>
          <p class="text-sm text-gray-500 mt-1">
            Gérez et supervisez toutes les conversations clients en temps réel
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            @click="exportConversations"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
            Exporter CSV
          </button>
          
          <button
            @click="refreshData"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
            Actualiser
          </button>
        </div>
      </div>
      
      <!-- Filtres -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="active">En cours</option>
          <option value="completed">Terminées</option>
          <option value="abandoned">Abandonnées</option>
        </select>
        
        <select
          v-model="filters.period"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="all">Toutes</option>
        </select>
        
        <div class="relative flex-1 max-w-md">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="filters.search"
            type="text"
            placeholder="Rechercher un client..."
            class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Métriques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-50 rounded-xl">
              <ChatBubbleLeftRightIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total aujourd'hui</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalToday }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-green-50 rounded-xl">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Converties</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.converted }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-yellow-50 rounded-xl">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En cours</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-purple-50 rounded-xl">
              <ClockIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Temps moyen</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.averageTime }}min</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des conversations -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Conversations récentes ({{ filteredConversations.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visiteur
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Messages
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commande
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Démarrée
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="conversation in paginatedConversations" 
              :key="conversation.id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                      <span class="text-white font-medium text-sm">
                        {{ getInitials(conversation.visitor_email || 'Visiteur') }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">
                      {{ conversation.visitor_email || 'Visiteur anonyme' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ conversation.visitor_ip }}
                    </p>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(conversation.status)">
                  {{ getStatusText(conversation.status) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <span class="font-medium">{{ conversation.message_count }}</span> messages
                </div>
                <div class="text-xs text-gray-500">
                  Dernière activité il y a {{ getTimeAgo(conversation.last_activity) }}
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="conversation.order_amount" class="text-sm">
                  <p class="font-medium text-green-600">
                    {{ formatCurrency(conversation.order_amount) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ conversation.order_status }}
                  </p>
                </div>
                <span v-else class="text-sm text-gray-400">Aucune commande</span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(conversation.created_at) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewConversation(conversation.id)"
                    class="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Voir détails"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    v-if="conversation.status === 'active'"
                    @click="takeoverConversation(conversation.id)"
                    class="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    title="Prendre le contrôle"
                  >
                    <UserIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteConversation(conversation.id)"
                    class="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Supprimer"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
        
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">{{ startIndex }}</span>
              à <span class="font-medium">{{ endIndex }}</span>
              sur <span class="font-medium">{{ filteredConversations.length }}</span> résultats
            </p>
          </div>
          
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  page === currentPage 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal détail conversation -->
    <ConversationMod 
      :show="showConversationModal"
      @close="showConversationModal = false"
      :conversation-id="selectedConversationId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// État local
const loading = ref(false)
const showConversationModal = ref(false)
const selectedConversationId = ref<string>('')
const currentPage = ref(1)
const perPage = 10

// Filtres
const filters = ref({
  status: '',
  period: 'today',
  search: ''
})

// Stats (données simulées)
const stats = ref({
  totalToday: 23,
  converted: 8,
  active: 3,
  averageTime: 12
})

// Conversations (données simulées améliorées)
const conversations = ref([
  {
    id: '1',
    visitor_email: 'marie.dubois@email.com',
    visitor_ip: '192.168.1.1',
    status: 'completed',
    message_count: 15,
    order_amount: 45000,
    order_status: 'confirmée',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_activity: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: '2',
    visitor_email: null,
    visitor_ip: '192.168.1.2',
    status: 'active',
    message_count: 3,
    order_amount: null,
    order_status: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    last_activity: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: '3',
    visitor_email: 'jean.martin@test.com',
    visitor_ip: '192.168.1.3',
    status: 'abandoned',
    message_count: 8,
    order_amount: null,
    order_status: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '4',
    visitor_email: 'sophie.laurent@gmail.com',
    visitor_ip: '192.168.1.4',
    status: 'completed',
    message_count: 12,
    order_amount: 75000,
    order_status: 'en traitement',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    last_activity: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
])

// Conversations filtrées
const filteredConversations = computed(() => {
  let filtered = conversations.value

  if (filters.value.status) {
    filtered = filtered.filter(conv => conv.status === filters.value.status)
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(conv => 
      conv.visitor_email?.toLowerCase().includes(search) ||
      conv.visitor_ip.includes(search)
    )
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredConversations.value.length / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * perPage, filteredConversations.value.length))

const paginatedConversations = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredConversations.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Fonctions utilitaires
const getInitials = (name: string) => {
  if (!name) return 'V'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    abandoned: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.abandoned
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: 'En cours',
    completed: 'Terminée',
    abandoned: 'Abandonnée'
  }
  return texts[status] || 'Inconnue'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'à l\'instant'
  if (diffInMinutes < 60) return `${diffInMinutes} min`
  const hours = Math.floor(diffInMinutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}j`
}

// Actions
const refreshData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const showNotification = inject('showNotification') as (message: string, type: string) => void
    if (showNotification) {
      showNotification('Conversations actualisées avec succès !', 'success')
    }
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  } finally {
    loading.value = false
  }
}

const exportConversations = () => {
  console.log('Export des conversations')
  const showNotification = inject('showNotification') as (message: string, type: string) => void
  if (showNotification) {
    showNotification('Export CSV démarré ! Le fichier sera téléchargé sous peu.', 'info')
  }
}

const viewConversation = (id: string) => {
  selectedConversationId.value = id
  showConversationModal.value = true
}

const takeoverConversation = (id: string) => {
  console.log('Prise de contrôle de la conversation:', id)
  const showNotification = inject('showNotification') as (message: string, type: string) => void
  if (showNotification) {
    showNotification('Prise de contrôle activée !', 'success')
  }
}

const deleteConversation = (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
    const index = conversations.value.findIndex(conv => conv.id === id)
    if (index !== -1) {
      conversations.value.splice(index, 1)
      const showNotification = inject('showNotification') as (message: string, type: string) => void
      if (showNotification) {
        showNotification('Conversation supprimée avec succès !', 'success')
      }
    }
  }
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Métadonnées de la page
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Conversations - ChatSeller',
  description: 'Gérez et supervisez toutes les conversations clients'
})

// Charger les données au montage
onMounted(() => {
  console.log('Page conversations montée')
})
</script>