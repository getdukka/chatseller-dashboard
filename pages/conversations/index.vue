<!-- pages/conversations/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header Beauté -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Conversations</h1>
            <p class="mt-2 text-gray-600">
              Suivez les conversations de vos {{ getAgentTypeLabel() }} en temps réel
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Live indicator beauté -->
            <div class="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg">
              <div class="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
              <span class="text-sm font-medium text-rose-700">Conseils en direct</span>
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
      <!-- KPI Cards Beauté - Avec messages d'encouragement si stats à 0 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Consultations Actives -->
        <div class="card-beauty-gradient from-rose-500 to-pink-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-rose-100 text-sm font-medium">Conversations actives</p>
              <template v-if="hasConversations">
                <p class="text-3xl font-bold">{{ stats.active }}</p>
                <p class="text-rose-100 text-sm mt-1">
                  +{{ stats.newToday }} aujourd'hui
                </p>
              </template>
              <template v-else>
                <p class="text-xl font-semibold mt-1">Bientôt ici</p>
                <p class="text-rose-100 text-sm mt-1">
                  Vos premières conversations
                </p>
              </template>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Conseils Terminés -->
        <div class="card-beauty-gradient from-purple-500 to-violet-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-purple-100 text-sm font-medium">Conseils terminés</p>
              <template v-if="stats.completed > 0">
                <p class="text-3xl font-bold">{{ stats.completed }}</p>
                <p class="text-purple-100 text-sm mt-1">
                  {{ stats.completionRate }}% de satisfaction
                </p>
              </template>
              <template v-else>
                <p class="text-xl font-semibold mt-1">En attente</p>
                <p class="text-purple-100 text-sm mt-1">
                  Taux de satisfaction à venir
                </p>
              </template>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Conseils en cours -->
        <div class="card-beauty-gradient from-amber-500 to-orange-500">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-orange-100 text-sm font-medium">Conseils en cours</p>
              <template v-if="stats.inProgress > 0">
                <p class="text-3xl font-bold">{{ stats.inProgress }}</p>
                <p class="text-orange-100 text-sm mt-1">
                  Clientes accompagnées
                </p>
              </template>
              <template v-else>
                <p class="text-xl font-semibold mt-1">Prête à aider</p>
                <p class="text-orange-100 text-sm mt-1">
                  Votre Vendeuse IA attend
                </p>
              </template>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Taux de conversion -->
        <div class="card-beauty-gradient from-emerald-500 to-teal-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-emerald-100 text-sm font-medium">Taux de conversion</p>
              <template v-if="hasConversations">
                <p class="text-3xl font-bold">{{ stats.conversionRate }}%</p>
                <p class="text-emerald-100 text-sm mt-1">
                  Sur {{ conversations.length }} conversation{{ conversations.length > 1 ? 's' : '' }}
                </p>
              </template>
              <template v-else>
                <p class="text-xl font-semibold mt-1">À découvrir</p>
                <p class="text-emerald-100 text-sm mt-1">
                  Vos performances à venir
                </p>
              </template>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Table des Conversations Beauté -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Conversations récentes
            </h3>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                {{ conversations.length }} consultation(s)
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
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
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
          <button @click="loadConversations" class="btn-beauty-primary">
            Réessayer
          </button>
        </div>

        <!-- Table -->
        <div v-else-if="conversations.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-rose-50 to-pink-50">
              <tr>
                <th class="table-header">Consultation</th>
                <th class="table-header">Cliente</th>
                <th class="table-header">{{ getProductColumnLabel() }}</th>
                <th class="table-header">{{ getAgentTypeLabel() }}</th>
                <th class="table-header">Messages</th>
                <th class="table-header">Statut</th>
                <th class="table-header">Date</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="conversation in conversations" 
                :key="conversation.id"
                @click="navigateToConversation(conversation)"
                class="conversation-row cursor-pointer hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-200 border-l-4 border-transparent hover:border-rose-400"
                :title="`Voir la consultation #${conversation.id.slice(-8).toUpperCase()}`"
              >
                <!-- Consultation ID avec contexte beauté -->
                <td class="table-cell">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="w-2 h-2 rounded-full" :class="getBeautyStatusIndicator(conversation.status)"></div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        #{{ conversation.id.slice(-8).toUpperCase() }}
                      </div>
                      <div v-if="conversation.conversion_completed" class="text-xs text-emerald-600 font-medium flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                        {{ getConversionLabel() }}
                      </div>
                      <div v-if="getBeautyContext(conversation)" class="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full mt-1 inline-block">
                        {{ getBeautyContext(conversation) }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Cliente -->
                <td class="table-cell">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                        <span class="text-xs font-medium text-white">
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
                      <div v-if="getBeautyProfile(conversation)" class="text-xs text-rose-600">
                        {{ getBeautyProfile(conversation) }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Produit Beauté -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900 font-medium">
                    {{ getBeautyProductName(conversation) }}
                  </div>
                  <div v-if="conversation.product_price" class="text-sm text-rose-600 font-semibold">
                    {{ formatCurrency(conversation.product_price) }}
                  </div>
                  <div v-if="getProductCategory(conversation)" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    {{ getProductCategory(conversation) }}
                  </div>
                </td>

                <!-- Type Agent Beauté -->
                <td class="table-cell">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg">{{ getAgentIcon() }}</span>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ getAgentName(conversation) }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ getAgentSpecialty() }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <!-- Messages -->
                <td class="table-cell">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ conversation.message_count || 0 }} message{{ (conversation.message_count || 0) !== 1 ? 's' : '' }}
                  </div>
                  <div v-if="conversation.last_message" class="text-xs text-gray-500 truncate max-w-[200px]" :title="conversation.last_message.content">
                    {{ conversation.last_message.role === 'assistant' ? '🤖 ' : '👤 ' }}{{ truncateText(conversation.last_message.content, 50) }}
                  </div>
                </td>
                
                <!-- Statut -->
                <td class="table-cell">
                  <span :class="getBeautyStatusBadge(conversation.status)" class="beauty-status-badge">
                    {{ getBeautyStatusLabel(conversation.status) }}
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
                
                <!-- Actions -->
                <td class="table-cell text-right" @click.stop="">
                  <div class="flex items-center justify-end space-x-2">
                    <div v-if="conversation.status === 'active'" class="flex items-center space-x-1">
                      <div class="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                      <span class="text-xs text-rose-600 font-medium">En consultation</span>
                    </div>
                    
                    <div class="flex items-center text-gray-400 group-hover:text-rose-500 transition-colors">
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

        <!-- Empty State Beauté - Avec CTA actionnable -->
        <div v-else class="text-center py-16 px-6">
          <div class="max-w-md mx-auto">
            <!-- Illustration -->
            <div class="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg class="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>

            <!-- Titre encourageant -->
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              Votre Vendeuse IA est prête !
            </h3>

            <!-- Description -->
            <p class="text-gray-600 mb-2">
              Les conversations avec vos clientes apparaîtront ici dès qu'elles interagiront avec votre {{ getAgentTypeLabel() }}.
            </p>
            <p class="text-sm text-gray-500 mb-8">
              Assurez-vous que le widget est bien installé sur votre boutique.
            </p>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NuxtLink
                to="/agent-ia"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Configurer ma Vendeuse IA
              </NuxtLink>

              <button
                @click="refreshConversations"
                :disabled="refreshing"
                class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
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
            <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
              <div class="flex items-start space-x-3">
                <span class="text-2xl">💡</span>
                <div>
                  <p class="font-medium text-amber-800 text-sm">Conseil</p>
                  <p class="text-amber-700 text-sm mt-1">
                    Testez votre Vendeuse IA depuis l'onglet "Tester" de la page de configuration pour vérifier qu'elle fonctionne correctement.
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
const getAgentTypeLabel = () => {
  const userBeautyCategory = authStore.user?.shop?.beauty_category || 'multi'
  
  return 'Vendeuse IA'
}

const getProductColumnLabel = () => {
  const userBeautyCategory = authStore.user?.shop?.beauty_category || 'multi'
  
  const labels: Record<string, string> = {
    'skincare': 'Soin consulté',
    'makeup': 'Produit makeup',
    'fragrance': 'Parfum',
    'haircare': 'Soin capillaire',
    'bodycare': 'Soin corps',
    'multi': 'Produit beauté'
  }
  
  return labels[userBeautyCategory] || 'Produit'
}

const getConversionLabel = () => {
  const userBeautyCategory = authStore.user?.shop?.beauty_category || 'multi'
  
  const labels: Record<string, string> = {
    'skincare': 'Routine adoptée',
    'makeup': 'Look commandé',
    'fragrance': 'Parfum choisi',
    'haircare': 'Soins commandés',
    'bodycare': 'Rituel adopté',
    'multi': 'Produits commandés'
  }
  
  return labels[userBeautyCategory] || 'Convertie'
}

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

const getAgentIcon = (): string => {
  const userBeautyCategory = authStore.user?.shop?.beauty_category || 'multi'

  const icons: Record<string, string> = {
    'skincare': '✨',
    'makeup': '💄',
    'fragrance': '🌸',
    'haircare': '💇‍♀️',
    'bodycare': '🧴',
    'multi': '💋'
  }

  return icons[userBeautyCategory] || '💋'
}

const getAgentName = (conversation: any): string => {
  // Retourner le nom de l'agent ou le nom de la Vendeuse IA configurée
  if (conversation.agent_name) return conversation.agent_name
  return authStore.user?.shop?.name ? `Vendeuse IA ${authStore.user.shop.name}` : 'Vendeuse IA'
}

const getAgentSpecialty = (): string => {
  const userBeautyCategory = authStore.user?.shop?.beauty_category || 'multi'

  const specialties: Record<string, string> = {
    'skincare': 'Soins visage',
    'makeup': 'Maquillage',
    'fragrance': 'Parfums',
    'haircare': 'Soins capillaires',
    'bodycare': 'Soins corps',
    'multi': 'Multi-beauté'
  }

  return specialties[userBeautyCategory] || 'Beauté'
}

// ✅ MÉTHODES STATUT BEAUTÉ
const getBeautyStatusIndicator = (status: string): string => {
  const classes = {
    active: 'bg-rose-500 animate-pulse',
    completed: 'bg-emerald-500',
    abandoned: 'bg-gray-400'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-400'
}

const getBeautyStatusBadge = (status: string): string => {
  const classes = {
    active: 'bg-rose-100 text-rose-800 border border-rose-200',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    abandoned: 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getBeautyStatusLabel = (status: string): string => {
  const labels = {
    active: 'En consultation',
    completed: 'Conseil terminé',
    abandoned: 'Consultation interrompue'
  }
  return labels[status as keyof typeof labels] || status
}

// ✅ MÉTHODES UTILITAIRES (INCHANGÉES)
const getVisitorInfo = (conversation: any): string => {
  try {
    if (!conversation) return 'Cliente anonyme'
    
    if (conversation.customer_data && typeof conversation.customer_data === 'object') {
      const data = conversation.customer_data
      if (data.name && typeof data.name === 'string') return data.name
      if (data.email && typeof data.email === 'string') return data.email
    }
    
    return conversation.visitor_id ? `Cliente ${conversation.visitor_id.slice(0, 8)}` : 'Cliente anonyme'
  } catch (error) {
    console.warn('Erreur getVisitorInfo:', error)
    return 'Cliente anonyme'
  }
}

const getVisitorInitials = (conversation: any): string => {
  const visitorInfo = getVisitorInfo(conversation)
  if (visitorInfo.includes('Cliente')) {
    return 'C'
  }
  return visitorInfo.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
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
    console.log('🔄 Navigation vers consultation beauté:', conversation?.id)
    
    if (!conversation?.id) {
      console.error('❌ ID consultation invalide')
      showNotification('Erreur: données de consultation manquantes', 'error')
      return
    }

    console.log('✅ Navigation vers consultation ID:', conversation.id)
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
    console.log('Chargement consultations beauté via API...')
    
    const response = await api.conversations.list()
    
    if (response.success && response.data) {
      conversations.value = response.data.map((conv: any) => ({
        ...conv,
        message_count: conv.messageCount || conv.message_count || 0,
        last_message: conv.lastMessage || null,
        started_at: conv.started_at || conv.startedAt,
        last_activity: conv.last_activity || conv.lastActivity || conv.started_at
      }))
      
      console.log('Consultations beauté chargées:', conversations.value.length)
      
      await loadStats()
    } else {
      throw new Error(response.error || 'Erreur lors du chargement des consultations')
    }
    
  } catch (err: any) {
    console.error('Erreur chargement consultations beauté:', err)
    error.value = err.message || 'Erreur lors du chargement des consultations'
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
      completionRate: convs.length > 0 ? Math.round((convs.filter(c => c.status === 'completed').length / convs.length) * 100) : 0
    }
  } catch (err) {
    console.warn('Erreur chargement stats:', err)
  }
}

const refreshConversations = async () => {
  refreshing.value = true
  try {
    await loadConversations()
    showNotification('Consultations beauté actualisées')
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
  title: 'Consultations Beauté - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ STYLES BEAUTÉ ADAPTÉS */
.card-beauty-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6;
}

.btn-beauty-primary {
  @apply px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all;
}

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
  @apply transition-all duration-200 ease-in-out;
}

.conversation-row:hover {
  @apply transform scale-[1.01] shadow-sm;
}

.conversation-row:active {
  @apply transform scale-[0.99];
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

/* Responsive */
@media (max-width: 768px) {
  .conversation-row {
    @apply hover:scale-100;
  }
}
</style>