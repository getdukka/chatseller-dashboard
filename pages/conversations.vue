<!-- pages/conversations.vue -->
<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Conversations</h1>
            <p class="mt-1 text-sm text-gray-600">
              Suivez et gérez toutes les interactions de vos visiteurs avec l'Agent IA.
            </p>
          </div>
          
          <!-- Actions -->
          <div class="mt-4 sm:mt-0 flex space-x-3">
            <button
              @click="refreshConversations"
              class="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              :disabled="loading"
            >
              <ArrowPathIcon class="h-4 w-4 inline mr-2" :class="{ 'animate-spin': loading }" />
              Actualiser
            </button>
            
            <button class="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
              <DocumentArrowDownIcon class="h-4 w-4 inline mr-2" />
              Exporter CSV
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <ChatBubbleLeftRightIcon class="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total aujourd'hui</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.todayTotal }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                    <CheckCircleIcon class="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Converties</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.converted }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <ClockIcon class="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">En cours</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.active }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-pink-100 rounded-md flex items-center justify-center">
                    <ChartBarIcon class="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Taux conversion</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ Math.round((stats.converted / stats.todayTotal) * 100) }}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div class="flex space-x-4">
                <!-- Status filter -->
                <select
                  v-model="filters.status"
                  class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">En cours</option>
                  <option value="completed">Terminées</option>
                  <option value="converted">Converties</option>
                  <option value="abandoned">Abandonnées</option>
                </select>

                <!-- Date filter -->
                <select
                  v-model="filters.period"
                  class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="all">Toutes</option>
                </select>
              </div>

              <!-- Search -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="filters.search"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher une conversation..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Conversations Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              Liste des conversations ({{ filteredConversations.length }})
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visiteur
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Démarrée
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="conversation in paginatedConversations" :key="conversation.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-medium text-sm">
                          {{ getInitials(conversation.visitorName) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ conversation.visitorName || 'Visiteur anonyme' }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ conversation.visitorEmail || conversation.sessionId }}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusBadgeClass(conversation.status)"
                    >
                      {{ getStatusText(conversation.status) }}
                    </span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ conversation.messageCount }} messages
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span v-if="conversation.orderValue" class="text-green-600 font-medium">
                      {{ formatCurrency(conversation.orderValue) }}
                    </span>
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(conversation.createdAt) }}
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button
                        @click="viewConversation(conversation)"
                        class="text-blue-600 hover:text-pink-900"
                      >
                        <EyeIcon class="h-4 w-4" />
                      </button>
                      <button
                        v-if="conversation.status === 'active'"
                        @click="takeoverConversation(conversation)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        <UserIcon class="h-4 w-4" />
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
                  Affichage de <span class="font-medium">{{ startIndex }}</span> à
                  <span class="font-medium">{{ endIndex }}</span> sur
                  <span class="font-medium">{{ filteredConversations.length }}</span> résultats
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
                    @click="goToPage(page)"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    :class="page === currentPage 
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
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

        <!-- Conversation Modal -->
        <ConversationModal
          v-if="selectedConversation"
          :conversation="selectedConversation"
          :is-open="isModalOpen"
          @close="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Define page meta
definePageMeta({
  layout: 'dashboard',
  title: 'Conversations - ChatSeller'
})

// State
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const selectedConversation = ref(null)
const isModalOpen = ref(false)

// Filters
const filters = reactive({
  status: '',
  period: 'today',
  search: ''
})

// Stats
const stats = ref({
  todayTotal: 23,
  converted: 8,
  active: 3,
  abandoned: 12
})

// Mock conversations data
const conversations = ref([
  {
    id: '1',
    sessionId: 'sess_123456',
    visitorName: 'Marie Dubois',
    visitorEmail: 'marie@example.com',
    status: 'converted',
    messageCount: 12,
    orderValue: 75000,
    createdAt: new Date('2025-01-14T10:30:00'),
    lastMessageAt: new Date('2025-01-14T10:45:00')
  },
  {
    id: '2',
    sessionId: 'sess_789012',
    visitorName: 'Jean Martin',
    visitorEmail: 'jean@example.com',
    status: 'active',
    messageCount: 5,
    orderValue: null,
    createdAt: new Date('2025-01-14T11:15:00'),
    lastMessageAt: new Date('2025-01-14T11:20:00')
  },
  {
    id: '3',
    sessionId: 'sess_345678',
    visitorName: null,
    visitorEmail: null,
    status: 'abandoned',
    messageCount: 3,
    orderValue: null,
    createdAt: new Date('2025-01-14T09:45:00'),
    lastMessageAt: new Date('2025-01-14T09:48:00')
  },
  {
    id: '4',
    sessionId: 'sess_901234',
    visitorName: 'Sophie Laurent',
    visitorEmail: 'sophie@example.com',
    status: 'completed',
    messageCount: 8,
    orderValue: null,
    createdAt: new Date('2025-01-13T16:20:00'),
    lastMessageAt: new Date('2025-01-13T16:35:00')
  },
  {
    id: '5',
    sessionId: 'sess_567890',
    visitorName: 'Ahmed Koné',
    visitorEmail: 'ahmed@example.com',
    status: 'converted',
    messageCount: 15,
    orderValue: 125000,
    createdAt: new Date('2025-01-13T14:10:00'),
    lastMessageAt: new Date('2025-01-13T14:30:00')
  }
])

// Computed
const filteredConversations = computed(() => {
  let filtered = conversations.value

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter(conv => conv.status === filters.status)
  }

  // Filter by search
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(conv => 
      (conv.visitorName?.toLowerCase().includes(search)) ||
      (conv.visitorEmail?.toLowerCase().includes(search)) ||
      conv.sessionId.toLowerCase().includes(search)
    )
  }

  // Filter by period
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (filters.period) {
    case 'today':
      filtered = filtered.filter(conv => conv.createdAt >= today)
      break
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(conv => conv.createdAt >= weekAgo)
      break
    case 'month':
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
      filtered = filtered.filter(conv => conv.createdAt >= monthAgo)
      break
    // 'all' - no filter
  }

  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

const totalPages = computed(() => Math.ceil(filteredConversations.value.length / itemsPerPage))

const paginatedConversations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredConversations.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredConversations.value.length))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const getInitials = (name: string | null) => {
  if (!name) return 'V'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800'
    case 'converted':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-gray-100 text-gray-800'
    case 'abandoned':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'En cours'
    case 'converted':
      return 'Convertie'
    case 'completed':
      return 'Terminée'
    case 'abandoned':
      return 'Abandonnée'
    default:
      return 'Inconnue'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr })
}

const refreshConversations = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}

const viewConversation = (conversation: any) => {
  selectedConversation.value = conversation
  isModalOpen.value = true
}

const takeoverConversation = (conversation: any) => {
  // Implement takeover functionality
  console.log('Taking over conversation:', conversation.id)
}

const closeModal = () => {
  isModalOpen.value = false
  selectedConversation.value = null
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

const goToPage = (page: number) => {
  currentPage.value = page
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
})
</script>