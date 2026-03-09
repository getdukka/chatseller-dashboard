<!-- pages/conversations/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-6 lg:px-8 py-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Conversations</h1>
            <p class="mt-1 text-sm text-gray-500">
              Suivez les conversations de {{ agentName }}
            </p>
          </div>

          <div class="flex items-center space-x-4">
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
    <div class="px-6 lg:px-8 py-6">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <!-- KPI 1 : Conversations actives -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Conversations actives</p>
              <template v-if="hasConversations">
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.active }}</p>
                <p class="text-gray-500 text-xs mt-1">
                  +{{ stats.newToday }} aujourd'hui
                </p>
              </template>
              <template v-else>
                <p class="text-lg font-semibold text-gray-900 mt-1">Bientôt ici</p>
                <p class="text-gray-500 text-xs mt-1">Vos premières conversations</p>
              </template>
            </div>
            <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- KPI 2 : Conseils terminés -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Conseils terminés</p>
              <template v-if="stats.completed > 0">
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.completed }}</p>
                <p class="text-gray-500 text-xs mt-1">
                  {{ stats.completionRate }}% des conversations
                </p>
              </template>
              <template v-else>
                <p class="text-lg font-semibold text-gray-900 mt-1">En attente</p>
                <p class="text-gray-500 text-xs mt-1">Aucun conseil clôturé</p>
              </template>
            </div>
            <div class="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- KPI 3 : Commandes via chat -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Commandes via chat</p>
              <template v-if="hasConversations">
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.ordersViaChat }}</p>
                <p class="text-gray-500 text-xs mt-1">
                  <template v-if="stats.ordersViaChat > 0">
                    Ventes générées par {{ agentName }}
                  </template>
                  <template v-else>
                    {{ agentName }} n'a pas encore vendu
                  </template>
                </p>
              </template>
              <template v-else>
                <p class="text-lg font-semibold text-gray-900 mt-1">Prête à vendre</p>
                <p class="text-gray-500 text-xs mt-1">{{ agentName }} attend ses clients</p>
              </template>
            </div>
            <div class="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- KPI 4 : Taux de conversion -->
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Taux de conversion</p>
              <template v-if="hasConversations">
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.conversionRate }}%</p>
                <p class="text-gray-500 text-xs mt-1">
                  Conversations &rarr; commandes
                </p>
              </template>
              <template v-else>
                <p class="text-lg font-semibold text-gray-900 mt-1">À découvrir</p>
                <p class="text-gray-500 text-xs mt-1">Vos performances à venir</p>
              </template>
            </div>
            <div class="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>

      </div>

      <!-- Table des Conversations -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
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
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
          <button @click="loadConversations" class="px-4 py-2 text-sm font-medium rounded-lg btn-brand-primary">
            Réessayer
          </button>
        </div>

        <!-- Table -->
        <div v-else-if="conversations.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">Statut</th>
                <th class="table-header">Client</th>
                <th class="table-header">Produit consulté</th>
                <th class="table-header">Messages</th>
                <th class="table-header">Date</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="conversation in conversations"
                :key="conversation.id"
                @click="navigateToConversation(conversation)"
                class="conversation-row cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                :title="`Voir la conversation #${conversation.id.slice(-8).toUpperCase()}`"
              >
                <!-- Statut + ID court -->
                <td class="table-cell">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full flex-shrink-0" :class="getBeautyStatusIndicator(conversation.status)"></div>
                    <div>
                      <span :class="getBeautyStatusBadge(conversation.status)" class="beauty-status-badge">
                        {{ getBeautyStatusLabel(conversation.status) }}
                      </span>
                      <div v-if="conversation.conversion_completed" class="text-xs text-emerald-600 font-medium flex items-center mt-1">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        Commande
                      </div>
                      <div class="text-xs text-gray-400 mt-0.5">#{{ conversation.id.slice(-8).toUpperCase() }}</div>
                    </div>
                  </div>
                </td>

                <!-- Client + localisation -->
                <td class="table-cell">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center">
                        <span class="text-xs font-medium text-white">
                          {{ getVisitorInitials(conversation) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ getVisitorInfo(conversation) }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ getVisitorLocation(conversation) }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Produit consulté -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900 font-medium">
                    {{ getBeautyProductName(conversation) }}
                  </div>
                  <div v-if="conversation.product_price" class="text-sm text-gray-600 font-semibold">
                    {{ formatCurrency(conversation.product_price) }}
                  </div>
                </td>

                <!-- Messages + apercu -->
                <td class="table-cell">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ conversation.message_count || 0 }} message{{ (conversation.message_count || 0) !== 1 ? 's' : '' }}
                  </div>
                  <div v-if="conversation.last_message" class="text-xs text-gray-500 truncate max-w-[200px]" :title="conversation.last_message.content">
                    {{ conversation.last_message.role === 'assistant' ? 'IA: ' : '' }}{{ truncateText(conversation.last_message.content, 45) }}
                  </div>
                </td>

                <!-- Date -->
                <td class="table-cell">
                  <div
                    class="text-sm text-gray-900"
                    :title="formatDate(conversation.started_at)"
                  >
                    {{ formatSmartDate(conversation.started_at) }}
                  </div>
                  <div v-if="conversation.last_activity && conversation.last_activity !== conversation.started_at" class="text-xs text-gray-400">
                    Actif {{ formatTimeAgo(conversation.last_activity) }}
                  </div>
                </td>

                <!-- Actions -->
                <td class="table-cell text-right" @click.stop="">
                  <div class="flex items-center justify-end space-x-2">
                    <div v-if="conversation.status === 'active'" class="flex items-center space-x-1">
                      <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span class="text-xs text-emerald-600 font-medium">En direct</span>
                    </div>
                    <div class="flex items-center text-gray-400 hover:text-gray-600 transition-colors">
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
        <div v-else class="text-center py-16 px-6">
          <div class="max-w-md mx-auto">
            <!-- Illustration -->
            <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>

            <!-- Titre -->
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ agentName }} est prête à accueillir vos clients !
            </h3>

            <!-- Description -->
            <p class="text-gray-600 mb-2">
              Les conversations avec vos clients apparaîtront ici dès qu'ils interagiront avec {{ agentName }}.
            </p>
            <p class="text-sm text-gray-500 mb-8">
              Assurez-vous que le widget est bien installé sur votre boutique.
            </p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NuxtLink
                to="/agent-ia"
                class="inline-flex items-center px-6 py-3 font-medium rounded-xl btn-brand-primary"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Personnaliser {{ agentName }}
              </NuxtLink>

              <button
                @click="refreshConversations"
                :disabled="refreshing"
                class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg
                  class="w-5 h-5 mr-2"
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

            <!-- Conseil -->
            <div class="mt-8 p-4 bg-gray-900 rounded-xl text-left">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="font-medium text-white text-sm">Conseil</p>
                  <p class="text-gray-300 text-sm mt-1">
                    Testez {{ agentName }} depuis l'onglet "Tester" de la page de configuration pour vérifier qu'elle fonctionne correctement.
                  </p>
                </div>
              </div>
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
            <svg v-if="notification.type === 'success'" class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import { ref, onMounted, computed } from 'vue'

// PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// COMPOSABLES
const api = useApi()
const agentName = ref('Mia')

// REACTIVE STATE
const loading = ref(true)
const refreshing = ref(false)
const error = ref<string | null>(null)

const conversations = ref<any[]>([])

const stats = ref({
  active: 0,
  completed: 0,
  ordersViaChat: 0,
  conversionRate: 0,
  newToday: 0,
  completionRate: 0
})

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// Computed pour vérifier si des conversations existent
const hasConversations = computed(() => conversations.value.length > 0)

// ✅ MÉTHODES CONTEXTUELLES BEAUTÉ

// ✅ MÉTHODES CONVERSATION BEAUTÉ - Sans données simulées
const getBeautyContext = (conversation: any): string | null => {
  // Retourner uniquement les données réelles, null sinon
  if (conversation.beauty_context) return conversation.beauty_context
  if (conversation.product_category) return conversation.product_category
  return null
}

const getBeautyProfile = (conversation: any): string | null => {
  // Retourner uniquement les données réelles
  if (conversation.customer_beauty_profile) return conversation.customer_beauty_profile
  return null
}

const getBeautyProductName = (conversation: any): string => {
  // Retourner le nom du produit ou un texte par défaut
  if (conversation.product_name) return conversation.product_name
  return 'Produit non spécifié'
}

const getProductCategory = (conversation: any): string | null => {
  // Retourner uniquement les données réelles
  if (conversation.product_category) return conversation.product_category
  return null
}

// ✅ MÉTHODES STATUT BEAUTÉ
const getBeautyStatusIndicator = (status: string): string => {
  const classes = {
    active: 'bg-emerald-500 animate-pulse',
    completed: 'bg-emerald-500',
    abandoned: 'bg-gray-400'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-400'
}

const getBeautyStatusBadge = (status: string): string => {
  const classes = {
    active: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    abandoned: 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getBeautyStatusLabel = (status: string): string => {
  const labels = {
    active: 'En cours',
    completed: 'Conseil terminé',
    abandoned: 'Conversation interrompue'
  }
  return labels[status as keyof typeof labels] || status
}

// ✅ MÉTHODES UTILITAIRES (INCHANGÉES)
const getVisitorInfo = (conversation: any): string => {
  try {
    if (!conversation) return 'Client anonyme'

    if (conversation.customer_data && typeof conversation.customer_data === 'object') {
      const data = conversation.customer_data
      if (data.name && typeof data.name === 'string') return data.name
      if (data.email && typeof data.email === 'string') return data.email
    }

    return conversation.visitor_id ? `Client ${conversation.visitor_id.slice(0, 8)}` : 'Client anonyme'
  } catch (error) {
    console.warn('Erreur getVisitorInfo:', error)
    return 'Client anonyme'
  }
}

const getVisitorInitials = (conversation: any): string => {
  const visitorInfo = getVisitorInfo(conversation)
  if (visitorInfo.includes('Client')) {
    return 'C'
  }
  return visitorInfo.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

// Affiche "🇸🇳 Dakar" ou "Visiteur anonyme" selon les données geo disponibles
const getVisitorLocation = (conversation: any): string => {
  const country = conversation.visitorCountry || conversation.visitor_country
  const city = conversation.visitorCity || conversation.visitor_city

  if (!country && !city) return 'Localisation inconnue'

  const flagMap: Record<string, string> = {
    SN: '🇸🇳', FR: '🇫🇷', CI: '🇨🇮', CM: '🇨🇲', ML: '🇲🇱',
    BJ: '🇧🇯', BF: '🇧🇫', TG: '🇹🇬', GN: '🇬🇳', MR: '🇲🇷',
    MA: '🇲🇦', TN: '🇹🇳', DZ: '🇩🇿', BE: '🇧🇪', CH: '🇨🇭',
    CA: '🇨🇦', US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', ES: '🇪🇸'
  }
  const flag = country ? (flagMap[country] || '🌍') : ''
  const location = [city, country].filter(Boolean).join(', ')
  return `${flag} ${location}`.trim()
}

// Date intelligente : "Il y a 2h", "Hier", ou "24 févr." selon l'ancienneté
const formatSmartDate = (date: string): string => {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins}min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays === 1) return `Hier, ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
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

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
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

// ✅ NAVIGATION INCHANGÉE
const navigateToConversation = (conversation: any) => {
  try {
    console.log('🔄 Navigation vers la conversation:', conversation?.id)

    if (!conversation?.id) {
      console.error('❌ ID conversation invalide')
      showNotification('Erreur: données de conversation manquantes', 'error')
      return
    }

    console.log('✅ Navigation vers conversation ID:', conversation.id)
    navigateTo(`/conversations/${conversation.id}`)

  } catch (err: any) {
    console.error('❌ Erreur navigation:', err)
    showNotification('Erreur lors de la navigation', 'error')
  }
}

// ✅ CHARGEMENT DES DONNÉES (INCHANGÉ)
const loadConversations = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Chargement de la conversations via API...')

    const response = await api.conversations.list()

    if (response.success && response.data) {
      conversations.value = response.data.map((conv: any) => ({
        ...conv,
        message_count: conv.messageCount || conv.message_count || 0,
        last_message: conv.lastMessage || null,
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

    const totalConvs = convs.length
    const completed = convs.filter(c => c.status === 'completed').length
    const orders = convs.filter(c => c.conversion_completed).length

    stats.value = {
      active: convs.filter(c => c.status === 'active').length,
      completed,
      ordersViaChat: orders,
      newToday: convs.filter(c => new Date(c.started_at).toDateString() === today).length,
      conversionRate: totalConvs > 0 ? Math.round((orders / totalConvs) * 100) : 0,
      completionRate: totalConvs > 0 ? Math.round((completed / totalConvs) * 100) : 0
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
  // Load agent name
  api.agents.list().then((res: any) => {
    if (res.success && res.data?.length > 0) {
      agentName.value = res.data[0].name || 'Mia'
    }
  }).catch(() => {})
})

// SEO
useHead({
  title: 'Conversations - Espace de travail - Chatseller'
})
</script>

<style scoped>
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}

.beauty-status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.conversation-row {
  @apply transition-colors duration-150 ease-in-out;
}

/* Animations */
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

.btn-brand-primary {
  background-color: var(--color-primary);
  color: #ffffff;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn-brand-primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(234, 66, 66, 0.25);
}
</style>
