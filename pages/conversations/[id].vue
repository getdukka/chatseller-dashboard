<!-- pages/conversations/[id].vue - VERSION API PURE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Bouton retour -->
            <button
              @click="$router.back()"
              class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <!-- Informations de la conversation -->
            <div v-if="conversation && !loading">
              <div class="flex items-center space-x-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span class="text-sm font-medium text-blue-700">
                    {{ getInitials(getVisitorName()) }}
                  </span>
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900">
                    {{ getVisitorName() }}
                  </h1>
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{{ getVisitorEmail() }}</span>
                    <span class="badge" :class="getStatusBadgeClass(conversation.status)">
                      {{ getStatusLabel(conversation.status) }}
                    </span>
                    <span>{{ formatDate(conversation.started_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading state -->
            <div v-else-if="loading" class="flex items-center space-x-3">
              <div class="animate-pulse">
                <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button
              @click="markAsRead"
              v-if="conversation && conversation.unread_count > 0"
              class="btn-secondary"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Marquer comme lu
            </button>

            <div class="relative">
              <button
                @click="showActionsMenu = !showActionsMenu"
                class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>

              <!-- Menu d'actions -->
              <div
                v-if="showActionsMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
              >
                <div class="py-1">
                  <button
                    @click="takeOverConversation"
                    v-if="conversation?.status === 'active'"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Prendre en charge
                  </button>
                  <button
                    @click="exportConversation"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Exporter
                  </button>
                  <hr class="my-1">
                  <button
                    @click="deleteConversation"
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

    <!-- Error State -->
    <div v-if="error && !loading" class="p-12 text-center">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
      <p class="text-gray-500 mb-4">{{ error }}</p>
      <button @click="loadConversation" class="btn-primary">
        Réessayer
      </button>
    </div>

    <!-- Contenu principal -->
    <div v-else class="flex h-screen pt-16">
      <!-- Zone de chat -->
      <div class="flex-1 flex flex-col">
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Chargement de la conversation...</span>
          </div>

          <div v-else-if="messages.length > 0" class="space-y-4 max-w-4xl mx-auto">
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="message.sender === 'visitor' ? 'justify-end' : 'justify-start'"
            >
              <!-- Message de l'agent -->
              <div
                v-if="message.sender === 'agent'"
                class="flex items-start space-x-3 max-w-lg"
              >
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                  <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                  <div class="text-sm font-medium text-gray-900 mb-1">Agent IA</div>
                  <div class="text-gray-800 whitespace-pre-wrap">{{ message.content }}</div>
                  <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div class="text-xs text-gray-500">{{ formatTime(message.sent_at || message.created_at) }}</div>
                    <div class="flex items-center space-x-2">
                      <!-- Boutons d'actions -->
                      <button
                        @click="copyMessage(message.content)"
                        class="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title="Copier"
                      >
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <div
                        v-if="message.confidence !== undefined"
                        class="flex items-center space-x-1"
                        :title="`Confiance: ${message.confidence}%`"
                      >
                        <div class="w-2 h-2 rounded-full" :class="getConfidenceColor(message.confidence)"></div>
                        <span class="text-xs text-gray-500">{{ message.confidence }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message du visiteur -->
              <div
                v-else
                class="flex items-start space-x-3 max-w-lg"
              >
                <div class="bg-blue-600 text-white rounded-lg p-3">
                  <div class="text-white whitespace-pre-wrap">{{ message.content }}</div>
                  <div class="text-blue-100 text-xs mt-2 text-right">{{ formatTime(message.sent_at || message.created_at) }}</div>
                </div>
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                  <span class="text-xs font-medium text-gray-600">
                    {{ getInitials(getVisitorName()) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div v-else class="flex justify-center items-center h-full">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun message</h3>
              <p class="mt-1 text-sm text-gray-500">Cette conversation n'a pas encore de messages</p>
            </div>
          </div>
        </div>

        <!-- Zone de saisie (si intervention manuelle possible) -->
        <div v-if="conversation?.status === 'active'" class="bg-white border-t border-gray-200 p-4">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-end space-x-3">
              <div class="flex-1">
                <textarea
                  v-model="newMessage"
                  rows="2"
                  placeholder="Tapez votre message..."
                  class="input-primary resize-none"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="null"
                  :disabled="sendingMessage"
                />
              </div>
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim() || sendingMessage"
                class="btn-primary"
              >
                <svg v-if="sendingMessage" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
            </p>
          </div>
        </div>
      </div>

      <!-- Sidebar droite avec informations -->
      <div class="w-80 bg-white border-l border-gray-200">
        <div class="p-6 space-y-6">
          <!-- Informations du visiteur -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informations visiteur</h3>
            <div v-if="conversation && !loading" class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-700">Nom</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ getVisitorName() }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Email</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ getVisitorEmail() || 'Non renseigné' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Téléphone</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ getVisitorPhone() || 'Non renseigné' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Première visite</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ formatDate(conversation.started_at) }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Produit consulté</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ conversation.product_name || 'Aucun produit' }}
                </p>
              </div>
            </div>
            <div v-else class="space-y-3">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>

          <!-- Métriques de la conversation -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Métriques</h3>
            <div v-if="conversation && !loading" class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Messages échangés</span>
                <span class="text-sm font-medium text-gray-900">{{ conversation.message_count || messages.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Durée</span>
                <span class="text-sm font-medium text-gray-900">{{ getConversationDuration() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Statut</span>
                <span class="text-sm font-medium" :class="getStatusTextClass(conversation.status)">
                  {{ getStatusLabel(conversation.status) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Conversion</span>
                <span class="text-sm font-medium" :class="conversation.conversion_completed ? 'text-green-600' : 'text-gray-500'">
                  {{ conversation.conversion_completed ? 'Oui' : 'Non' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
            <div class="space-y-2">
              <button
                @click="createOrder"
                class="w-full btn-primary btn-sm"
                :disabled="!conversation"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Créer une commande
              </button>
              <button
                @click="exportConversation"
                class="w-full btn-secondary btn-sm"
                :disabled="!conversation"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter
              </button>
              <button
                @click="addNote"
                class="w-full btn-secondary btn-sm"
                :disabled="!conversation"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Ajouter une note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="notification.show = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ✅ MIDDLEWARE D'AUTHENTIFICATION
definePageMeta({
  middleware: 'auth'
})

// ✅ COMPOSABLES API
const api = useApi()
const route = useRoute()
const conversationId = route.params.id as string

// ✅ REACTIVE STATE
const loading = ref(true)
const error = ref<string | null>(null)
const showActionsMenu = ref(false)
const newMessage = ref('')
const sendingMessage = ref(false)

const conversation = ref<any>(null)
const messages = ref<any[]>([])

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// ✅ UTILITY METHODS
const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getVisitorName = (): string => {
  if (!conversation.value) return 'Visiteur'
  
  if (conversation.value.customer_data) {
    const data = conversation.value.customer_data
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        if (parsed.name) return parsed.name
        if (parsed.firstName && parsed.lastName) return `${parsed.firstName} ${parsed.lastName}`
        if (parsed.firstName) return parsed.firstName
      } catch (e) {
        // If parsing fails, treat as string
        if (data) return data
      }
    } else if (typeof data === 'object') {
      if (data.name) return data.name
      if (data.firstName && data.lastName) return `${data.firstName} ${data.lastName}`
      if (data.firstName) return data.firstName
    }
  }
  
  return conversation.value.visitor_id ? `Visiteur ${conversation.value.visitor_id.slice(0, 8)}` : 'Visiteur anonyme'
}

const getVisitorEmail = (): string | null => {
  if (!conversation.value?.customer_data) return null
  
  const data = conversation.value.customer_data
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return parsed.email || null
    } catch (e) {
      return null
    }
  } else if (typeof data === 'object') {
    return data.email || null
  }
  
  return null
}

const getVisitorPhone = (): string | null => {
  if (!conversation.value?.customer_data) return null
  
  const data = conversation.value.customer_data
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return parsed.phone || null
    } catch (e) {
      return null
    }
  } else if (typeof data === 'object') {
    return data.phone || null
  }
  
  return null
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

const getStatusTextClass = (status: string): string => {
  const classes = {
    active: 'text-green-600',
    pending: 'text-yellow-600',
    completed: 'text-blue-600',
    abandoned: 'text-gray-600'
  }
  return classes[status as keyof typeof classes] || 'text-gray-600'
}

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return 'bg-green-500'
  if (confidence >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getConversationDuration = (): string => {
  if (!conversation.value || !conversation.value.started_at) return 'N/A'
  
  const start = new Date(conversation.value.started_at)
  const end = conversation.value.completed_at ? new Date(conversation.value.completed_at) : new Date()
  const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  
  if (diffMinutes < 1) return '< 1min'
  if (diffMinutes < 60) return `${diffMinutes}min`
  
  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60
  return `${hours}h ${mins}min`
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// ✅ API METHODS
const loadConversation = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('🔄 Chargement conversation via API:', conversationId)
    
    // Charger les détails de la conversation
    const conversationResponse = await api.conversations.get(conversationId)
    
    if (!conversationResponse.success) {
      throw new Error(conversationResponse.error || 'Conversation non trouvée')
    }
    
    conversation.value = conversationResponse.data
    console.log('✅ Conversation chargée:', conversation.value)
    
    // Charger les messages
    await loadMessages()
    
  } catch (err: any) {
    console.error('❌ Erreur chargement conversation:', err)
    error.value = err.message || 'Erreur lors du chargement de la conversation'
  } finally {
    loading.value = false
  }
}

const loadMessages = async () => {
  try {
    console.log('🔄 Chargement messages via API:', conversationId)
    
    const messagesResponse = await api.conversations.getMessages(conversationId)
    
    if (messagesResponse.success && messagesResponse.data) {
      messages.value = messagesResponse.data
      console.log('✅ Messages chargés:', messages.value.length)
    } else {
      console.warn('⚠️ Aucun message trouvé ou erreur:', messagesResponse.error)
      messages.value = []
    }
  } catch (err) {
    console.warn('⚠️ Erreur chargement messages:', err)
    messages.value = []
  }
}

const markAsRead = async () => {
  try {
    // TODO: Implémenter l'endpoint pour marquer comme lu
    if (conversation.value) {
      conversation.value.unread_count = 0
      showNotification('Conversation marquée comme lue')
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
    showNotification('Erreur lors du marquage', 'error')
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || sendingMessage.value) return

  const messageContent = newMessage.value.trim()
  sendingMessage.value = true

  try {
    console.log('📤 Envoi message via API:', messageContent)
    
    const response = await api.conversations.sendMessage(conversationId, {
      content: messageContent,
      sender: 'agent'
    })

    if (response.success) {
      // Ajouter le message à la liste locale
      const newMsg = {
        id: Date.now().toString(),
        content: messageContent,
        sender: 'agent',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
      
      messages.value.push(newMsg)
      newMessage.value = ''
      
      showNotification('Message envoyé')
      
      // Optionnel: recharger tous les messages pour la synchronisation
      // await loadMessages()
    } else {
      throw new Error(response.error || 'Erreur envoi message')
    }
  } catch (err: any) {
    console.error('❌ Erreur envoi message:', err)
    showNotification('Erreur lors de l\'envoi du message', 'error')
  } finally {
    sendingMessage.value = false
  }
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    showNotification('Message copié')
  } catch (error) {
    console.error('❌ Erreur lors de la copie:', error)
    showNotification('Erreur lors de la copie', 'error')
  }
}

const takeOverConversation = async () => {
  try {
    console.log('👋 Prise en charge conversation via API:', conversationId)
    
    const response = await api.conversations.takeover(conversationId)
    
    if (response.success) {
      showNotification('Conversation prise en charge')
      await loadConversation() // Recharger pour mettre à jour le statut
    } else {
      throw new Error(response.error || 'Erreur lors de la prise en charge')
    }
  } catch (err: any) {
    console.error('❌ Erreur takeover:', err)
    showNotification('Erreur lors de la prise en charge', 'error')
  }
  showActionsMenu.value = false
}

const exportConversation = () => {
  try {
    const data = {
      conversation: conversation.value,
      messages: messages.value
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${conversationId}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    showNotification('Conversation exportée')
  } catch (err) {
    console.error('Erreur export:', err)
    showNotification('Erreur lors de l\'export', 'error')
  }
  showActionsMenu.value = false
}

const deleteConversation = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
    showActionsMenu.value = false
    return
  }
  
  try {
    // TODO: Implémenter l'endpoint de suppression
    console.log('🗑️ Suppression conversation:', conversationId)
    showNotification('Conversation supprimée')
    navigateTo('/conversations')
  } catch (err) {
    console.error('Erreur suppression:', err)
    showNotification('Erreur lors de la suppression', 'error')
  }
  showActionsMenu.value = false
}

const createOrder = () => {
  console.log('🛒 Création commande pour conversation:', conversationId)
  // TODO: Rediriger vers la création de commande
  showNotification('Redirection vers la création de commande')
}

const addNote = () => {
  console.log('📝 Ajout note pour conversation:', conversationId)
  // TODO: Ouvrir modal d'ajout de note
  showNotification('Fonctionnalité d\'ajout de note en développement')
}

// ✅ EVENT HANDLERS
const closeActionMenu = (event: Event) => {
  if (showActionsMenu.value && !(event.target as Element).closest('.relative')) {
    showActionsMenu.value = false
  }
}

// ✅ LIFECYCLE
onMounted(() => {
  loadConversation()
  document.addEventListener('click', closeActionMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})

// ✅ SEO
useHead({
  title: `Conversation ${conversationId.slice(-8)} - ChatSeller Dashboard`
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-sm {
  @apply px-3 py-1.5 text-xs;
}

.input-primary {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-primary {
  @apply bg-blue-100 text-blue-800;
}

.badge-gray {
  @apply bg-gray-100 text-gray-800;
}

/* ✅ ANIMATIONS */
.chat-message-enter-active,
.chat-message-leave-active {
  transition: all 0.3s ease-in-out;
}

.chat-message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.chat-message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>