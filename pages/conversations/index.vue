<!-- pages/conversations/index.vue - VERSION AVEC LIGNES CLIQUABLES -->
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
              <p class="text-orange-100 text-sm font-medium">En cours</p>
              <p class="text-3xl font-bold">{{ stats.inProgress }}</p>
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

      <!-- Conversations Table -->
      <div class="card-modern">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Conversations récentes
            </h3>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                {{ conversations.length }} conversation(s)
              </span>
              <div class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Cliquez sur une ligne pour voir les détails
              </div>
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

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p class="text-gray-500 mb-4">{{ error }}</p>
          <button @click="loadConversations" class="btn-primary">
            Réessayer
          </button>
        </div>

        <!-- Table -->
        <div v-else-if="conversations.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">Conversation</th>
                <th class="table-header">Visiteur</th>
                <th class="table-header">Produit</th>
                <th class="table-header">Messages</th>
                <th class="table-header">Statut</th>
                <th class="table-header">Date</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- LIGNE CLIQUABLE - MODIFICATION PRINCIPALE -->
              <tr 
                v-for="conversation in conversations" 
                :key="conversation.id"
                @click="navigateToConversation(conversation)"
                class="conversation-row cursor-pointer hover:bg-blue-50 transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
                :title="`Cliquer pour voir la conversation #${conversation.id.slice(-8).toUpperCase()}`"
              >
                <!-- Conversation ID -->
                <td class="table-cell">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-2 h-2 rounded-full" :class="getStatusIndicatorClass(conversation.status)"></div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        #{{ conversation.id.slice(-8).toUpperCase() }}
                      </div>
                      <div v-if="conversation.conversion_completed" class="text-xs text-green-600 font-medium flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Convertie
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Visitor -->
                <td class="table-cell">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-600">
                          {{ getVisitorInitials(conversation) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ getVisitorInfo(conversation) }}
                      </div>
                      <div v-if="conversation.visitor_ip" class="text-xs text-gray-500">
                        {{ conversation.visitor_ip }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Product -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900 font-medium">
                    {{ conversation.product_name || 'Aucun produit' }}
                  </div>
                  <div v-if="conversation.product_price" class="text-sm text-green-600 font-semibold">
                    {{ formatCurrency(conversation.product_price) }}
                  </div>
                </td>
                
                <!-- Messages -->
                <td class="table-cell">
                  <div class="flex items-center space-x-2">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ conversation.message_count || 0 }}
                    </div>
                    <div class="text-xs text-gray-500">
                      message{{ (conversation.message_count || 0) !== 1 ? 's' : '' }}
                    </div>
                  </div>
                </td>
                
                <!-- Status -->
                <td class="table-cell">
                  <span :class="getStatusBadgeClass(conversation.status)" class="status-badge">
                    {{ getStatusLabel(conversation.status) }}
                  </span>
                </td>
                
                <!-- Date -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(conversation.started_at) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ formatTimeAgo(conversation.last_activity) }}
                  </div>
                </td>
                
                <!-- Actions - SIMPLIFIÉES -->
                <td class="table-cell text-right" @click.stop="">
                  <div class="flex items-center justify-end space-x-2">
                    <!-- Badge indicateur seulement -->
                    <div v-if="conversation.status === 'active'" class="flex items-center space-x-1">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span class="text-xs text-green-600 font-medium">En cours</span>
                    </div>
                    
                    <!-- Flèche pour indiquer que la ligne est cliquable -->
                    <div class="flex items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune conversation</h3>
          <p class="mt-2 text-gray-500">
            Les nouvelles conversations apparaîtront ici
          </p>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// COMPOSABLES
const authStore = useAuthStore()
const api = useApi()

// REACTIVE STATE
const loading = ref(true)
const refreshing = ref(false)
const error = ref<string | null>(null)

const conversations = ref<any[]>([])

const stats = ref({
  active: 0,
  completed: 0,
  inProgress: 0,
  conversionRate: 0,
  newToday: 0,
  completionRate: 0,
  averageWaitTime: 0,
  conversionGrowth: 0
})

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// UTILITY METHODS
const getVisitorInfo = (conversation: any): string => {
  try {
    if (!conversation) return 'Visiteur anonyme'
    
    if (conversation.customer_data && typeof conversation.customer_data === 'object') {
      const data = conversation.customer_data
      if (data.name && typeof data.name === 'string') return data.name
      if (data.email && typeof data.email === 'string') return data.email
    }
    
    return conversation.visitor_id ? `Visiteur ${conversation.visitor_id.slice(0, 8)}` : 'Visiteur anonyme'
  } catch (error) {
    console.warn('Erreur getVisitorInfo:', error)
    return 'Visiteur anonyme'
  }
}

const getVisitorInitials = (conversation: any): string => {
  const visitorInfo = getVisitorInfo(conversation)
  if (visitorInfo.includes('Visiteur')) {
    return 'V'
  }
  return visitorInfo.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusIndicatorClass = (status: string): string => {
  const classes = {
    active: 'bg-green-500 animate-pulse',
    completed: 'bg-blue-500',
    abandoned: 'bg-gray-400'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-400'
}

const formatTimeAgo = (date: string): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)}h`
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getStatusLabel = (status: string): string => {
  if (!status || typeof status !== 'string') return 'Inconnu'
  
  const labels = {
    active: 'Active',
    completed: 'Terminée',
    abandoned: 'Abandonnée'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadgeClass = (status: string): string => {
  if (!status || typeof status !== 'string') return 'bg-gray-100 text-gray-800'
  
  const classes = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    abandoned: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
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

// NAVIGATION METHOD - VERSION CORRIGÉE
const navigateToConversation = (conversation: any) => {
  try {
    console.log('🔄 Tentative navigation vers conversation:', conversation?.id)
    
    // Validation stricte des données
    if (!conversation) {
      console.error('❌ Objet conversation null/undefined')
      showNotification('Erreur: données de conversation manquantes', 'error')
      return
    }
    
    if (!conversation.id || typeof conversation.id !== 'string') {
      console.error('❌ ID conversation invalide:', conversation.id)
      showNotification('Erreur: ID de conversation invalide', 'error')
      return
    }

    console.log('✅ Navigation vers conversation ID:', conversation.id)
    
    // Navigation simple et directe avec navigateTo (Nuxt 3)
    navigateTo(`/conversations/${conversation.id}`)
    
  } catch (err: any) {
    console.error('❌ Erreur critique navigation:', err)
    showNotification('Erreur lors de la navigation', 'error')
    
    // Fallback uniquement en cas d'erreur critique
    if (process.client && conversation?.id) {
      setTimeout(() => {
        window.location.href = `/conversations/${conversation.id}`
      }, 500)
    }
  }
}


// API METHODS
const loadConversations = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Chargement conversations via API...')
    
    const response = await api.conversations.list()
    
    if (response.success && response.data) {
      conversations.value = response.data.map((conv: any) => ({
        ...conv,
        message_count: conv.message_count || (conv.messages ? conv.messages.length : 0),
        started_at: conv.started_at || conv.startedAt,
        last_activity: conv.last_activity || conv.lastActivity || conv.started_at
      }))
      
      console.log('Conversations chargées:', conversations.value.length)
      
      await loadStats()
    } else {
      throw new Error(response.error || 'Erreur lors du chargement des conversations')
    }
    
  } catch (err: any) {
    console.error('Erreur chargement conversations:', err)
    error.value = err.message || 'Erreur lors du chargement des conversations'
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const convs = conversations.value
    const today = new Date().toDateString()
    
    stats.value = {
      active: convs.filter(c => c.status === 'active').length,
      completed: convs.filter(c => c.status === 'completed').length,
      inProgress: convs.filter(c => c.status === 'active').length,
      newToday: convs.filter(c => new Date(c.started_at).toDateString() === today).length,
      conversionRate: convs.length > 0 ? Math.round((convs.filter(c => c.conversion_completed).length / convs.length) * 100) : 0,
      completionRate: convs.length > 0 ? Math.round((convs.filter(c => c.status === 'completed').length / convs.length) * 100) : 0,
      averageWaitTime: 3,
      conversionGrowth: 12
    }
  } catch (err) {
    console.warn('Erreur chargement stats:', err)
  }
}

const refreshConversations = async () => {
  refreshing.value = true
  try {
    await loadConversations()
    showNotification('Conversations actualisées')
  } finally {
    refreshing.value = false
  }
}

// LIFECYCLE
onMounted(() => {
  loadConversations()
})

// SEO
useHead({
  title: 'Conversations - ChatSeller Dashboard'
})
</script>

<style scoped>
/* STYLES MODERNES */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200;
}

.card-modern-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

/* STYLES POUR LIGNES CLIQUABLES */
.conversation-row {
  @apply transition-all duration-200 ease-in-out;
}

.conversation-row:hover {
  @apply transform scale-[1.01] shadow-sm;
}

.conversation-row:active {
  @apply transform scale-[0.99];
}

/* ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .conversation-row {
    @apply hover:scale-100;
  }
}
</style>