<!-- pages/conversations.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Conversations
        </h1>
        <p class="text-gray-600 mt-1">
          Gérez et suivez toutes vos conversations en temps réel
        </p>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <button
          @click="refreshConversations"
          :disabled="isLoading"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2 inline" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Conversations actives</p>
            <p class="text-2xl font-bold text-green-600">{{ activeConversations.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Terminées</p>
            <p class="text-2xl font-bold text-blue-600">{{ completedConversations.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Abandonnées</p>
            <p class="text-2xl font-bold text-gray-600">{{ abandonedConversations.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Status Filter -->
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Statut:</label>
          <select 
            v-model="selectedStatus" 
            @change="filterByStatus"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous</option>
            <option value="active">Actives</option>
            <option value="completed">Terminées</option>
            <option value="abandoned">Abandonnées</option>
          </select>
        </div>

        <!-- Search -->
        <div class="flex items-center space-x-2 flex-1 max-w-md">
          <label class="text-sm font-medium text-gray-700">Recherche:</label>
          <input 
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher par visiteur, message..."
            class="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Clear filters -->
        <button
          @click="clearFilters"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          Effacer
        </button>
      </div>
    </div>

    <!-- Conversations List -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading && conversations.length === 0" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="flex space-x-4">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
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
        <button @click="refreshConversations" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Réessayer
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="displayedConversations.length === 0" class="p-6 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-gray-500">Aucune conversation trouvée</p>
      </div>

      <!-- Conversations List -->
      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="conversation in displayedConversations"
          :key="conversation.id"
          class="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="openConversation(conversation)"
        >
          <div class="flex items-start justify-between">
            <!-- Conversation Info -->
            <div class="flex items-start space-x-4 flex-1">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 font-medium text-sm">
                    {{ getConversationSummary(conversation).visitorName.charAt(0) }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    {{ getConversationSummary(conversation).visitorName }}
                  </h3>
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(conversation.status)"
                  >
                    {{ getStatusLabel(conversation.status) }}
                  </span>
                </div>
                
                <p class="text-sm text-gray-600 truncate mb-2">
                  {{ getConversationSummary(conversation).lastMessage }}
                </p>
                
                <div class="flex items-center text-xs text-gray-500 space-x-4">
                  <span>{{ getConversationSummary(conversation).messageCount }} messages</span>
                  <span>{{ getConversationSummary(conversation).duration }}</span>
                  <span>{{ formatDate(conversation.updatedAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2 ml-4">
              <button
                v-if="conversation.status === 'active'"
                @click.stop="takeoverConversation(conversation.id)"
                class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full hover:bg-yellow-200 transition-colors"
                title="Prendre le contrôle"
              >
                Prendre contrôle
              </button>
              
              <button
                @click.stop="openConversation(conversation)"
                class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
              >
                Voir détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conversation Details Modal -->
    <div v-if="selectedConversation" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-4 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b">
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                Conversation avec {{ getConversationSummary(selectedConversation).visitorName }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatDate(selectedConversation.createdAt) }} • 
                {{ getConversationSummary(selectedConversation).messageCount }} messages • 
                {{ getConversationSummary(selectedConversation).duration }}
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <span 
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                :class="getStatusClass(selectedConversation.status)"
              >
                {{ getStatusLabel(selectedConversation.status) }}
              </span>
              <button
                @click="selectedConversation = null"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Conversation Metadata -->
          <div v-if="selectedConversation.metadata" class="bg-gray-50 p-4 rounded-lg">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Informations du visiteur</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="selectedConversation.metadata.visitorInfo">
                <span class="text-gray-600">Visiteur:</span>
                <span class="ml-2 text-gray-900">{{ selectedConversation.metadata.visitorInfo.name || 'Anonyme' }}</span>
              </div>
              <div v-if="selectedConversation.metadata.product">
                <span class="text-gray-600">Produit d'intérêt:</span>
                <span class="ml-2 text-gray-900">{{ selectedConversation.metadata.product.name }}</span>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <h4 class="text-sm font-medium text-gray-900">Messages</h4>
            <div class="space-y-3">
              <div
                v-for="message in selectedConversation.messages"
                :key="message.id"
                class="flex"
                :class="message.type === 'visitor' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                  :class="getMessageClass(message.type)"
                >
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium">
                      {{ getMessageSender(message.type) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ formatMessageTime(message.timestamp) }}
                    </span>
                  </div>
                  <p class="text-sm">{{ message.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-4 border-t">
            <div class="flex space-x-3">
              <button
                v-if="selectedConversation.status === 'active'"
                @click="takeoverConversation(selectedConversation.id)"
                class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Prendre le contrôle
              </button>
            </div>
            
            <div class="flex space-x-3">
              <button
                @click="selectedConversation = null"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Conversation } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

// =====================================
// COMPOSABLES AND STORES
// =====================================

const {
  fetchConversations,
  takeoverConversation: performTakeover,
  isLoading,
  error,
  conversations,
  activeConversations,
  completedConversations,
  abandonedConversations,
  getConversationSummary,
  clearError
} = useConversations()

const { success, handleApiError, confirm } = useNotifications()
const route = useRoute()

// =====================================
// REACTIVE STATE
// =====================================

const selectedConversation = ref<Conversation | null>(null)
const selectedStatus = ref<'all' | 'active' | 'completed' | 'abandoned'>('all')
const searchTerm = ref('')

// =====================================
// COMPUTED
// =====================================

const displayedConversations = computed(() => {
  let filtered = conversations.value

  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(conv => conv.status === selectedStatus.value)
  }

  // Filter by search term
  if (searchTerm.value.trim()) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(conv => {
      const summary = getConversationSummary(conv)
      return summary.visitorName.toLowerCase().includes(search) ||
             summary.lastMessage.toLowerCase().includes(search) ||
             conv.messages.some(msg => msg.content.toLowerCase().includes(search))
    })
  }

  return filtered.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
})

// =====================================
// METHODS
// =====================================

/**
 * Refresh conversations data
 */
const refreshConversations = async (): Promise<void> => {
  try {
    await fetchConversations(true)
    success('Données actualisées', 'Les conversations ont été mises à jour')
  } catch (error: any) {
    handleApiError(error, 'Actualisation des conversations')
  }
}

/**
 * Filter conversations by status
 */
const filterByStatus = (): void => {
  // The computed property will handle the filtering
}

/**
 * Clear all filters
 */
const clearFilters = (): void => {
  selectedStatus.value = 'all'
  searchTerm.value = ''
}

/**
 * Open conversation details
 */
const openConversation = (conversation: Conversation): void => {
  selectedConversation.value = conversation
}

/**
 * Take over a conversation
 */
const takeoverConversation = async (conversationId: string): Promise<void> => {
  confirm(
    'Prendre le contrôle',
    'Voulez-vous vraiment prendre le contrôle de cette conversation ? L\'IA sera désactivée.',
    async () => {
      try {
        const success_takeover = await performTakeover(conversationId)
        if (success_takeover) {
          success('Contrôle pris', 'Vous contrôlez maintenant cette conversation')
          
          // Refresh the conversation if it's currently selected
          if (selectedConversation.value?.id === conversationId) {
            const updatedConv = conversations.value.find(c => c.id === conversationId)
            if (updatedConv) {
              selectedConversation.value = updatedConv
            }
          }
        }
      } catch (error: any) {
        handleApiError(error, 'Prise de contrôle')
      }
    },
    undefined,
    {
      confirmLabel: 'Prendre contrôle',
      cancelLabel: 'Annuler',
      type: 'warning'
    }
  )
}

/**
 * Get status CSS class
 */
const getStatusClass = (status: Conversation['status']): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'abandoned':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get status label
 */
const getStatusLabel = (status: Conversation['status']): string => {
  switch (status) {
    case 'active':
      return 'Active'
    case 'completed':
      return 'Terminée'
    case 'abandoned':
      return 'Abandonnée'
    default:
      return 'Inconnue'
  }
}

/**
 * Get message CSS class
 */
const getMessageClass = (type: string): string => {
  switch (type) {
    case 'visitor':
      return 'bg-blue-600 text-white'
    case 'agent':
      return 'bg-gray-200 text-gray-900'
    case 'system':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-900'
  }
}

/**
 * Get message sender label
 */
const getMessageSender = (type: string): string => {
  switch (type) {
    case 'visitor':
      return 'Visiteur'
    case 'agent':
      return 'Agent IA'
    case 'system':
      return 'Système'
    default:
      return 'Inconnu'
  }
}

/**
 * Format date
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format message time
 */
const formatMessageTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// =====================================
// LIFECYCLE
// =====================================

onMounted(async () => {
  // Load conversations
  await fetchConversations()
  
  // Check if we need to open a specific conversation from URL
  const conversationId = route.query.id as string
  if (conversationId) {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      selectedConversation.value = conversation
    }
  }
})

// =====================================
// WATCHERS
// =====================================

// Auto-refresh conversations every 30 seconds for active ones
let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
  refreshInterval = setInterval(() => {
    if (activeConversations.value.length > 0) {
      fetchConversations(true)
    }
  }, 30000) // 30 seconds
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// =====================================
// SEO
// =====================================

useHead({
  title: 'Conversations - ChatSeller',
  meta: [
    {
      name: 'description',
      content: 'Gérez et suivez toutes vos conversations ChatSeller en temps réel.'
    }
  ]
})
</script>