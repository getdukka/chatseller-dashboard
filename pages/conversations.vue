<!-- pages/conversations.vue - PAGE CONVERSATIONS MODERNE ET TEMPS RÉEL -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Conversations</h1>
            <p class="mt-2 text-gray-600">
              Gérez toutes vos conversations en temps réel
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Live indicator -->
            <div class="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-green-700">En direct</span>
            </div>
            
            <button
              @click="refreshConversations"
              :disabled="refreshing"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': refreshing }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ refreshing ? 'Actualisation...' : 'Actualiser' }}
            </button>
            
            <button
              @click="showFilters = !showFilters"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              :class="{ 'bg-blue-700': activeFiltersCount > 0 }"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
              </svg>
              Filtres
              <span v-if="activeFiltersCount > 0" class="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-white rounded-full">
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card-modern-gradient from-green-500 to-green-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-green-100 text-sm font-medium">Actives</p>
              <p class="text-3xl font-bold">{{ stats.active }}</p>
              <p class="text-green-100 text-sm mt-1">
                +{{ stats.newToday }} aujourd'hui
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-modern-gradient from-blue-500 to-blue-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-blue-100 text-sm font-medium">Terminées</p>
              <p class="text-3xl font-bold">{{ stats.completed }}</p>
              <p class="text-blue-100 text-sm mt-1">
                {{ stats.completionRate }}% résolution
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-modern-gradient from-yellow-500 to-orange-500">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-orange-100 text-sm font-medium">En attente</p>
              <p class="text-3xl font-bold">{{ stats.pending }}</p>
              <p class="text-orange-100 text-sm mt-1">
                {{ stats.averageWaitTime }}min moyenne
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="card-modern-gradient from-purple-500 to-purple-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-purple-100 text-sm font-medium">Conversion</p>
              <p class="text-3xl font-bold">{{ stats.conversionRate }}%</p>
              <p class="text-purple-100 text-sm mt-1">
                +{{ stats.conversionGrowth }}% ce mois
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="card-modern mb-6 animate-slide-in-up">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select v-model="filters.status" class="input-modern w-full">
              <option value="">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminées</option>
              <option value="abandoned">Abandonnées</option>
            </select>
          </div>

          <!-- Agent Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Agent IA</label>
            <select v-model="filters.agent" class="input-modern w-full">
              <option value="">Tous les agents</option>
              <option value="main">Agent principal</option>
              <option value="support">Agent support</option>
              <option value="sales">Agent ventes</option>
            </select>
          </div>

          <!-- Period Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
            <select v-model="filters.period" class="input-modern w-full">
              <option value="">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nom, email, message..."
              class="input-modern w-full"
            >
          </div>

          <!-- Actions -->
          <div class="flex items-end space-x-2">
            <button @click="applyFilters" class="btn-primary flex-1">
              Appliquer
            </button>
            <button @click="clearFilters" class="btn-secondary">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Conversations Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Conversations List -->
        <div class="lg:col-span-2">
          <div class="card-modern">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">
                Conversations récentes
              </h2>
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-500">
                  {{ filteredConversations.length }} conversation(s)
                </span>
                <div class="flex items-center space-x-1">
                  <button
                    @click="currentPage > 1 && changePage(currentPage - 1)"
                    :disabled="currentPage <= 1"
                    class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <span class="text-sm text-gray-500 px-2">
                    {{ currentPage }} / {{ totalPages }}
                  </span>
                  <button
                    @click="currentPage < totalPages && changePage(currentPage + 1)"
                    :disabled="currentPage >= totalPages"
                    class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="p-12">
              <div class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-gray-600">Chargement des conversations...</span>
              </div>
            </div>

            <!-- Conversations List -->
            <div v-else-if="filteredConversations.length > 0" class="divide-y divide-gray-200">
              <div
                v-for="conversation in paginatedConversations"
                :key="conversation.id"
                class="conversation-item"
                :class="{ 'selected': selectedConversation?.id === conversation.id }"
                @click="selectConversation(conversation)"
              >
                <div class="flex items-center space-x-4">
                  <!-- Avatar -->
                  <div class="conversation-avatar" :class="getStatusColor(conversation.status)">
                    <span class="text-sm font-medium text-white">
                      {{ getInitials(conversation.visitorName) }}
                    </span>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-2">
                        <h3 class="text-sm font-medium text-gray-900 truncate">
                          {{ conversation.visitorName || 'Visiteur anonyme' }}
                        </h3>
                        <span 
                          class="conversation-status-badge"
                          :class="getStatusBadgeClass(conversation.status)"
                        >
                          {{ getStatusLabel(conversation.status) }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-400">
                          {{ formatTimeAgo(conversation.updatedAt) }}
                        </span>
                        <div v-if="conversation.unreadCount > 0" class="unread-badge">
                          {{ conversation.unreadCount }}
                        </div>
                      </div>
                    </div>
                    
                    <p class="text-sm text-gray-600 truncate mb-1">
                      {{ conversation.lastMessage }}
                    </p>
                    
                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{{ conversation.messageCount }} messages</span>
                      <span v-if="conversation.visitorEmail">{{ conversation.visitorEmail }}</span>
                      <span v-if="conversation.assignedAgent">{{ conversation.assignedAgent }}</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="conversation.status === 'active'"
                      @click.stop="takeOver(conversation)"
                      class="action-button-primary"
                      title="Reprendre la conversation"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                    </button>
                    
                    <div class="conversation-actions">
                      <button
                        @click.stop="toggleActionMenu(conversation.id)"
                        class="action-button-secondary"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"/>
                        </svg>
                      </button>

                      <!-- Dropdown Actions -->
                      <div
                        v-if="activeActionMenu === conversation.id"
                        class="action-dropdown"
                      >
                        <button @click="markAsRead(conversation)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                          </svg>
                          Marquer comme lu
                        </button>
                        <button @click="assignAgent(conversation)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          Assigner agent
                        </button>
                        <button @click="archiveConversation(conversation)" class="action-dropdown-item">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                          </svg>
                          Archiver
                        </button>
                        <hr class="my-1">
                        <button @click="deleteConversation(conversation)" class="action-dropdown-item text-red-600 hover:bg-red-50">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">
                {{ hasActiveFilters ? 'Aucune conversation trouvée' : 'Aucune conversation' }}
              </h3>
              <p class="mt-2 text-gray-500">
                {{ hasActiveFilters 
                  ? 'Aucune conversation ne correspond à vos critères'
                  : 'Les nouvelles conversations apparaîtront ici'
                }}
              </p>
              <div v-if="hasActiveFilters" class="mt-4">
                <button
                  @click="clearFilters"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  Effacer les filtres
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversation Detail Panel -->
        <div class="lg:col-span-1">
          <div class="card-modern h-full">
            <div v-if="!selectedConversation" class="flex items-center justify-center h-96 text-gray-500">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <p class="mt-2 text-sm">Sélectionnez une conversation</p>
                <p class="text-xs text-gray-400">pour voir les détails</p>
              </div>
            </div>

            <div v-else class="h-full flex flex-col">
              <!-- Conversation Header -->
              <div class="conversation-detail-header">
                <div class="flex items-center space-x-3">
                  <div class="conversation-avatar" :class="getStatusColor(selectedConversation.status)">
                    <span class="text-sm font-medium text-white">
                      {{ getInitials(selectedConversation.visitorName) }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ selectedConversation.visitorName }}</h3>
                    <p class="text-sm text-gray-500">{{ selectedConversation.visitorEmail }}</p>
                  </div>
                </div>
                <span 
                  class="conversation-status-badge"
                  :class="getStatusBadgeClass(selectedConversation.status)"
                >
                  {{ getStatusLabel(selectedConversation.status) }}
                </span>
              </div>

              <!-- Conversation Messages -->
              <div class="conversation-messages">
                <div v-for="message in selectedConversation.messages" :key="message.id" class="message-item" :class="{ 'from-agent': message.fromAgent }">
                  <div class="message-content">
                    <p class="text-sm">{{ message.content }}</p>
                    <span class="message-time">{{ formatTime(message.createdAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Conversation Info -->
              <div class="conversation-info">
                <div class="info-item">
                  <span class="info-label">Durée :</span>
                  <span class="info-value">{{ calculateDuration(selectedConversation) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Messages :</span>
                  <span class="info-value">{{ selectedConversation.messageCount }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Agent :</span>
                  <span class="info-value">{{ selectedConversation.assignedAgent || 'IA automatique' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES
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
  assignedAgent?: string
  messages?: Array<{
    id: string
    content: string
    fromAgent: boolean
    createdAt: string
  }>
}

// ✅ COMPOSABLES
const authStore = useAuthStore()

// ✅ REACTIVE STATE
const loading = ref(true)
const refreshing = ref(false)
const showFilters = ref(false)
const activeActionMenu = ref<string | null>(null)
const selectedConversation = ref<Conversation | null>(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)

// Filters
const filters = ref({
  status: '',
  agent: '',
  period: '',
  search: ''
})

// Stats
const stats = ref({
  active: 23,
  completed: 127,
  pending: 8,
  conversionRate: 34.2,
  newToday: 5,
  completionRate: 89,
  averageWaitTime: 3,
  conversionGrowth: 12
})

// Mock conversations data
const conversations = ref<Conversation[]>([
  {
    id: '1',
    visitorName: 'Marie Dubois',
    visitorEmail: 'marie.dubois@email.com',
    lastMessage: 'Merci pour ces informations sur les délais de livraison',
    status: 'active',
    messageCount: 8,
    unreadCount: 2,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    assignedAgent: 'Vendeur IAPrincipal',
    messages: [
      { id: '1', content: 'Bonjour ! Comment puis-je vous aider ?', fromAgent: true, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      { id: '2', content: 'J\'aimerais connaître vos délais de livraison', fromAgent: false, createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
      { id: '3', content: 'Nos délais sont de 2-3 jours ouvrables en France', fromAgent: true, createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() }
    ]
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
    updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    messages: []
  },
  {
    id: '3',
    visitorName: 'Sophie Laurent',
    lastMessage: 'Parfait, merci beaucoup !',
    status: 'completed',
    messageCount: 6,
    unreadCount: 0,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    messages: []
  }
])

// ✅ COMPUTED
const filteredConversations = computed(() => {
  let filtered = conversations.value

  if (filters.value.search) {
    const query = filters.value.search.toLowerCase()
    filtered = filtered.filter(conv => 
      conv.visitorName?.toLowerCase().includes(query) ||
      conv.visitorEmail?.toLowerCase().includes(query) ||
      conv.lastMessage.toLowerCase().includes(query)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(conv => conv.status === filters.value.status)
  }

  if (filters.value.agent) {
    filtered = filtered.filter(conv => conv.assignedAgent?.includes(filters.value.agent))
  }

  if (filters.value.period) {
    const now = new Date()
    filtered = filtered.filter(conv => {
      const date = new Date(conv.updatedAt)
      switch (filters.value.period) {
        case 'today':
          return date.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return date >= weekAgo
        case 'month':
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
})

const paginatedConversations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredConversations.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredConversations.value.length / pageSize.value))

const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(value => value !== '').length
})

const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

// ✅ UTILITY METHODS
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
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    abandoned: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusColor = (status: string): string => {
  const colors = {
    active: 'bg-green-500',
    pending: 'bg-yellow-500',
    completed: 'bg-blue-500',
    abandoned: 'bg-gray-500'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500'
}

const formatTimeAgo = (date: string): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}h`
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const calculateDuration = (conversation: Conversation): string => {
  const start = new Date(conversation.createdAt)
  const end = new Date(conversation.updatedAt)
  const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) return `${diffInMinutes}min`
  const hours = Math.floor(diffInMinutes / 60)
  const minutes = diffInMinutes % 60
  return `${hours}h ${minutes}min`
}

// ✅ ACTION METHODS
const loadConversations = async () => {
  loading.value = true
  try {
    // Simuler chargement API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Remplacer par vraie API
    console.log('Conversations chargées')
  } catch (error) {
    console.error('Erreur chargement conversations:', error)
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

const selectConversation = (conversation: Conversation) => {
  selectedConversation.value = conversation
  if (conversation.unreadCount > 0) {
    markAsRead(conversation)
  }
}

const changePage = (page: number) => {
  currentPage.value = page
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  Object.assign(filters.value, {
    status: '',
    agent: '',
    period: '',
    search: ''
  })
  currentPage.value = 1
}

const toggleActionMenu = (conversationId: string) => {
  activeActionMenu.value = activeActionMenu.value === conversationId ? null : conversationId
}

const markAsRead = async (conversation: Conversation) => {
  conversation.unreadCount = 0
  activeActionMenu.value = null
}

const assignAgent = async (conversation: Conversation) => {
  console.log('Assigner agent:', conversation.id)
  activeActionMenu.value = null
}

const archiveConversation = async (conversation: Conversation) => {
  console.log('Archiver:', conversation.id)
  conversations.value = conversations.value.filter(c => c.id !== conversation.id)
  activeActionMenu.value = null
}

const deleteConversation = async (conversation: Conversation) => {
  if (confirm('Supprimer cette conversation ?')) {
    conversations.value = conversations.value.filter(c => c.id !== conversation.id)
    if (selectedConversation.value?.id === conversation.id) {
      selectedConversation.value = null
    }
  }
  activeActionMenu.value = null
}

const takeOver = async (conversation: Conversation) => {
  console.log('Reprendre conversation:', conversation.id)
  // TODO: Basculer en mode manuel
}

// Close action menu when clicking outside
const closeActionMenu = (event: Event) => {
  if (activeActionMenu.value && !(event.target as Element).closest('.conversation-actions')) {
    activeActionMenu.value = null
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  loadConversations()
  document.addEventListener('click', closeActionMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})

// ✅ SEO
useHead({
  title: 'Conversations - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.card-modern-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors;
}

/* ✅ CONVERSATION COMPONENTS */
.conversation-item {
  @apply p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-transparent;
}

.conversation-item.selected {
  @apply bg-blue-50 border-l-blue-500;
}

.conversation-avatar {
  @apply flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0;
}

.conversation-status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.unread-badge {
  @apply flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full;
}

.action-button-primary {
  @apply p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors;
}

.action-button-secondary {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.conversation-actions {
  @apply relative;
}

.action-dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1;
}

.action-dropdown-item {
  @apply w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors;
}

/* ✅ CONVERSATION DETAIL */
.conversation-detail-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.conversation-messages {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

.message-item {
  @apply flex;
}

.message-item.from-agent {
  @apply justify-start;
}

.message-item:not(.from-agent) {
  @apply justify-end;
}

.message-content {
  @apply max-w-xs px-3 py-2 rounded-lg;
}

.message-item.from-agent .message-content {
  @apply bg-gray-100 text-gray-900;
}

.message-item:not(.from-agent) .message-content {
  @apply bg-blue-600 text-white;
}

.message-time {
  @apply block text-xs opacity-70 mt-1;
}

.conversation-info {
  @apply p-4 border-t border-gray-200 space-y-2;
}

.info-item {
  @apply flex justify-between text-sm;
}

.info-label {
  @apply text-gray-500;
}

.info-value {
  @apply font-medium text-gray-900;
}

/* ✅ ANIMATIONS */
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slide-in-up 0.3s ease-out;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .conversation-item {
    @apply p-3;
  }
}
</style>