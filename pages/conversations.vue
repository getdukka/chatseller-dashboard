<template>
  <div class="space-y-6">
    <!-- Header avec filtres -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Conversations</h1>
          <p class="text-sm text-gray-500 mt-1">
            Gérez et supervisez toutes les conversations clients
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <button
            @click="exportConversations"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
            Exporter CSV
          </button>
          
          <button
            @click="refreshData"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
            Actualiser
          </button>
        </div>
      </div>
      
      <!-- Filtres -->
      <div class="flex items-center space-x-4">
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="active">En cours</option>
          <option value="completed">Terminées</option>
          <option value="abandoned">Abandonnées</option>
        </select>
        
        <select
          v-model="filters.period"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
        
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="filters.search"
            type="text"
            placeholder="Rechercher un client..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Métriques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-50 rounded-full">
              <ChatBubbleLeftRightIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total aujourd'hui</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalToday }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-green-50 rounded-full">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Converties</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.converted }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-yellow-50 rounded-full">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En cours</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-gray-50 rounded-full">
              <ClockIcon class="h-6 w-6 text-gray-600" />
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
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Liste des conversations ({{ filteredConversations.length }})
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
              v-for="conversation in filteredConversations" 
              :key="conversation.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon class="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div class="ml-3">
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
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ conversation.message_count }} messages
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
                <span v-else class="text-sm text-gray-500">-</span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(conversation.created_at) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  @click="viewConversation(conversation.id)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Voir
                </button>
                <button
                  v-if="conversation.status === 'active'"
                  @click="takeoverConversation(conversation.id)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Prendre le contrôle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
        
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
              à <span class="font-medium">{{ Math.min(currentPage * perPage, conversations.length) }}</span>
              sur <span class="font-medium">{{ conversations.length }}</span> résultats
            </p>
          </div>
          
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal détail conversation -->
    <ConversationModal 
      v-model:show="showConversationModal"
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
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import ConversationModal from '~/components/ui/ConversationModal.vue'

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

// Conversations (données simulées)
const conversations = ref([
  {
    id: '1',
    visitor_email: 'client@example.com',
    visitor_ip: '192.168.1.1',
    status: 'completed',
    message_count: 15,
    order_amount: 45000,
    order_status: 'confirmée',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    visitor_email: null,
    visitor_ip: '192.168.1.2',
    status: 'active',
    message_count: 3,
    order_amount: null,
    order_status: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    visitor_email: 'marie@test.com',
    visitor_ip: '192.168.1.3',
    status: 'abandoned',
    message_count: 8,
    order_amount: null,
    order_status: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
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

  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredConversations.value.length / perPage))
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
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
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
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`
  } else if (diffInMinutes < 24 * 60) {
    const hours = Math.floor(diffInMinutes / 60)
    return `Il y a ${hours}h`
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Actions
const refreshData = async () => {
  loading.value = true
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Données actualisées')
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  } finally {
    loading.value = false
  }
}

const exportConversations = () => {
  console.log('Export des conversations')
  // Ici implémenter l'export CSV
}

const viewConversation = (id: string) => {
  selectedConversationId.value = id
  showConversationModal.value = true
}

const takeoverConversation = (id: string) => {
  console.log('Prise de contrôle de la conversation:', id)
  // Ici implémenter la prise de contrôle
}

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
</style>