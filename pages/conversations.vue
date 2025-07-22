<!-- pages/conversations.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Conversations</h1>
            <p class="mt-1 text-sm text-gray-600">
              Gérez et suivez toutes vos conversations en temps réel
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshConversations"
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
              @click="showFilters = !showFilters"
              class="btn-secondary"
              :class="{ 'bg-blue-50 text-blue-700 border-blue-300': activeFiltersCount > 0 }"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filtres
              <span v-if="activeFiltersCount > 0" class="ml-2 badge-primary">
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="p-6">
      <!-- Statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Actives</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Terminées</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.completed }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En attente</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Taux conversion</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.conversionRate }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau de filtres -->
      <div v-if="showFilters" class="card mb-6 animate-slide-in-up">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filtres</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select v-model="filters.status" class="input-primary">
              <option value="">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminées</option>
              <option value="abandoned">Abandonnées</option>
            </select>
          </div>

          <!-- Période -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select v-model="filters.period" class="input-primary">
              <option value="">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="custom">Personnalisée</option>
            </select>
          </div>

          <!-- Recherche -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nom, email, message..."
              class="input-primary"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-end space-x-2">
            <button @click="applyFilters" class="btn-primary">
              Appliquer
            </button>
            <button @click="clearFilters" class="btn-secondary">
              Effacer
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des conversations -->
      <div class="card">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Conversations récentes
          </h2>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-500">
              {{ conversations.length }} conversation(s)
            </span>
            <div class="flex items-center space-x-1">
              <button
                @click="currentPage > 1 && changePage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="text-sm text-gray-500">
                Page {{ currentPage }} sur {{ totalPages }}
              </span>
              <button
                @click="currentPage < totalPages && changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
              <div class="skeleton-avatar"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton-text w-1/4"></div>
                <div class="skeleton-text w-3/4"></div>
              </div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>

        <!-- Liste des conversations -->
        <div v-else-if="conversations.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="conversation in conversations"
            :key="conversation.id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="openConversation(conversation.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <!-- Avatar -->
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span class="text-sm font-medium text-blue-700">
                    {{ getInitials(conversation.visitorName) }}
                  </span>
                </div>

                <!-- Informations -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-medium text-gray-900">
                      {{ conversation.visitorName || 'Visiteur anonyme' }}
                    </h3>
                    <span 
                      class="badge"
                      :class="getStatusBadgeClass(conversation.status)"
                    >
                      {{ getStatusLabel(conversation.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ conversation.lastMessage }}
                  </p>
                  <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{{ formatDate(conversation.updatedAt) }}</span>
                    <span>{{ conversation.messageCount }} message(s)</span>
                    <span v-if="conversation.visitorEmail">{{ conversation.visitorEmail }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-2">
                <!-- Indicateur de nouveaux messages -->
                <div
                  v-if="conversation.unreadCount > 0"
                  class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white"
                >
                  {{ conversation.unreadCount }}
                </div>

                <!-- Menu actions -->
                <div class="relative">
                  <button
                    @click.stop="toggleActionMenu(conversation.id)"
                    class="p-2 rounded-md hover:bg-gray-100"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </button>

                  <!-- Dropdown menu -->
                  <div
                    v-if="activeActionMenu === conversation.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                  >
                    <div class="py-1">
                      <button
                        @click="markAsRead(conversation.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Marquer comme lu
                      </button>
                      <button
                        @click="assignToAgent(conversation.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Assigner à un agent
                      </button>
                      <button
                        @click="archiveConversation(conversation.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Archiver
                      </button>
                      <hr class="my-1">
                      <button
                        @click="deleteConversation(conversation.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune conversation</h3>
          <p class="mt-1 text-sm text-gray-500">
            Les nouvelles conversations apparaîtront ici
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Types
interface Conversation {
  id: string
  visitorName: string
  visitorEmail?: string
  lastMessage: string
  status: 'active' | 'pending' | 'completed' | 'abandoned'
  messageCount: number
  unreadCount: number
  createdAt: string
  updatedAt: string
}

interface Stats {
  active: number
  pending: number
  completed: number
  conversionRate: number
}

// État du composant
const loading = ref(true)
const refreshing = ref(false)
const showFilters = ref(false)
const activeActionMenu = ref<string | null>(null)

// Données
const conversations = ref<Conversation[]>([])
const stats = reactive<Stats>({
  active: 12,
  pending: 8,
  completed: 127,
  conversionRate: 34.2
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// Filtres
const filters = reactive({
  status: '',
  period: '',
  search: ''
})

const activeFiltersCount = computed(() => {
  return Object.values(filters).filter(value => value !== '').length
})

// Méthodes utilitaires
const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusLabel = (status: string): string => {
  const labels = {
    active: 'Active',
    pending: 'En attente',
    completed: 'Terminée',
    abandoned: 'Abandonnée'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    active: 'badge-success',
    pending: 'badge-warning',
    completed: 'badge-primary',
    abandoned: 'badge-gray'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
  return date.toLocaleDateString('fr-FR')
}

// Actions
const loadConversations = async () => {
  loading.value = true
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Données simulées
    conversations.value = [
      {
        id: '1',
        visitorName: 'Marie Dubois',
        visitorEmail: 'marie.dubois@email.com',
        lastMessage: 'Merci pour ces informations sur les délais de livraison',
        status: 'active',
        messageCount: 8,
        unreadCount: 2,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        visitorName: 'Pierre Martin',
        visitorEmail: 'pierre.martin@email.com',
        lastMessage: 'Je voudrais passer commande pour 2 unités',
        status: 'pending',
        messageCount: 12,
        unreadCount: 0,
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        visitorName: 'Sophie Laurent',
        lastMessage: 'Parfait, merci beaucoup !',
        status: 'completed',
        messageCount: 6,
        unreadCount: 0,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]

    totalItems.value = conversations.value.length
  } catch (error) {
    console.error('Erreur lors du chargement des conversations:', error)
  } finally {
    loading.value = false
  }
}

const refreshConversations = async () => {
  refreshing.value = true
  try {
    await loadConversations()
  } finally {
    refreshing.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  loadConversations()
}

const applyFilters = () => {
  currentPage.value = 1
  loadConversations()
}

const clearFilters = () => {
  Object.assign(filters, {
    status: '',
    period: '',
    search: ''
  })
  applyFilters()
}

const openConversation = (id: string) => {
  // Fermer le menu d'actions si ouvert
  activeActionMenu.value = null
  
  // Navigation vers la conversation détaillée
  navigateTo(`/conversations/${id}`)
}

const toggleActionMenu = (id: string) => {
  activeActionMenu.value = activeActionMenu.value === id ? null : id
}

const markAsRead = async (id: string) => {
  try {
    // Appel API pour marquer comme lu
    console.log('Marquer comme lu:', id)
    
    // Mise à jour locale
    const conversation = conversations.value.find(c => c.id === id)
    if (conversation) {
      conversation.unreadCount = 0
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
  activeActionMenu.value = null
}

const assignToAgent = async (id: string) => {
  try {
    console.log('Assigner à un agent:', id)
    // Logique d'assignation
  } catch (error) {
    console.error('Erreur lors de l\'assignation:', error)
  }
  activeActionMenu.value = null
}

const archiveConversation = async (id: string) => {
  try {
    console.log('Archiver conversation:', id)
    // Retirer de la liste
    conversations.value = conversations.value.filter(c => c.id !== id)
  } catch (error) {
    console.error('Erreur lors de l\'archivage:', error)
  }
  activeActionMenu.value = null
}

const deleteConversation = async (id: string) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
    activeActionMenu.value = null
    return
  }

  try {
    console.log('Supprimer conversation:', id)
    conversations.value = conversations.value.filter(c => c.id !== id)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
  activeActionMenu.value = null
}

// Fermer le menu d'actions en cliquant ailleurs
const closeActionMenu = (event: Event) => {
  if (activeActionMenu.value && !(event.target as Element).closest('.relative')) {
    activeActionMenu.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadConversations()
  document.addEventListener('click', closeActionMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})
</script>

<style scoped>
/* Les styles sont définis dans le fichier CSS global */
</style>