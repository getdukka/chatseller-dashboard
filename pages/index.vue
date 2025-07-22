<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Message de bienvenue pour nouveaux utilisateurs -->
    <div v-if="showWelcome" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-blue-800">
            Bienvenue sur ChatSeller !
          </h3>
          <p class="mt-1 text-sm text-blue-700">
            Votre compte a été créé avec succès. Configurez votre agent IA pour commencer à vendre.
          </p>
        </div>
        <button
          @click="showWelcome = false"
          class="ml-4 text-blue-600 hover:text-blue-800"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="mt-1 text-sm text-gray-600">
              Pilotez votre agent IA commercial
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshData"
              :disabled="refreshing"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
            
            <NuxtLink
              to="/settings"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configurer
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="p-6">
      <!-- Métriques principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Conversations -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Conversations</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.conversations.total }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <span class="text-green-600 font-medium">{{ stats.conversations.active }}</span> actives
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/conversations"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Voir tout →
            </NuxtLink>
          </div>
        </div>

        <!-- Commandes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Commandes</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.orders.total }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <span class="text-blue-600 font-medium">{{ stats.orders.conversionRate }}%</span> conversion
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/orders"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Voir tout →
            </NuxtLink>
          </div>
        </div>

        <!-- Chiffre d'affaires -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(stats.revenue.total) }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <span class="text-green-600 font-medium">{{ formatCurrency(stats.revenue.average) }}</span> panier moyen
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/analytics"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Voir analytics →
            </NuxtLink>
          </div>
        </div>

        <!-- Performance -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Performance</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.performance.responseTime }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <span class="text-green-600 font-medium">{{ stats.performance.uptime }}%</span> uptime
              </p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-sm font-medium text-gray-500">Système optimal</span>
          </div>
        </div>
      </div>

      <!-- Sections principales -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Conversations récentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Conversations récentes</h3>
              <NuxtLink 
                to="/conversations"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Gérer les discussions
              </NuxtLink>
            </div>
          </div>
          <div class="p-6">
            <div v-if="recentConversations.length > 0" class="space-y-4">
              <div 
                v-for="conversation in recentConversations" 
                :key="conversation.id"
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                @click="goToConversation(conversation.id)"
              >
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <span class="text-sm font-medium text-blue-700">
                    {{ conversation.visitor.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ conversation.visitor }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ conversation.lastMessage }}
                  </p>
                </div>
                <div class="text-xs text-gray-400">
                  {{ formatTime(conversation.time) }}
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">Aucune conversation récente</p>
              <p class="text-xs text-gray-400 mt-1">Les nouvelles conversations apparaîtront ici</p>
            </div>
          </div>
        </div>

        <!-- Commandes récentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Commandes récentes</h3>
              <NuxtLink 
                to="/orders"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Suivi des ventes
              </NuxtLink>
            </div>
          </div>
          <div class="p-6">
            <div v-if="recentOrders.length > 0" class="space-y-4">
              <div 
                v-for="order in recentOrders" 
                :key="order.id"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                @click="goToOrder(order.id)"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ order.customer }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Commande #{{ order.id }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(order.amount) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatTime(order.time) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">Aucune commande récente</p>
              <p class="text-xs text-gray-400 mt-1">Les nouvelles ventes apparaîtront ici</p>
            </div>
          </div>
        </div>

        <!-- Configuration rapide -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Configuration</h3>
              <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {{ configurationProgress }}% complété
              </span>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <NuxtLink 
                to="/knowledge-base"
                class="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Base de connaissance</p>
                      <p class="text-xs text-gray-500">Alimenter votre agent IA</p>
                    </div>
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ knowledgeBaseStatus }}
                  </div>
                </div>
              </NuxtLink>

              <NuxtLink 
                to="/settings"
                class="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Paramètres agent</p>
                      <p class="text-xs text-gray-500">Personnaliser le comportement</p>
                    </div>
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ agentConfigStatus }}
                  </div>
                </div>
              </NuxtLink>

              <div class="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-gray-900">Widget intégration</p>
                      <p class="text-xs text-gray-500">Code à intégrer sur votre site</p>
                    </div>
                  </div>
                  <div class="text-xs text-gray-400">
                    Bientôt
                  </div>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// État du composant
const authStore = useAuthStore()
const refreshing = ref(false)
const showWelcome = ref(false)

// Données des statistiques
const stats = reactive({
  conversations: {
    total: 147,
    active: 12
  },
  orders: {
    total: 89,
    conversionRate: 34.2
  },
  revenue: {
    total: 45670.50,
    average: 512.30
  },
  performance: {
    responseTime: '< 2s',
    uptime: 99.9
  }
})

// Conversations récentes
const recentConversations = ref([
  {
    id: 1,
    visitor: 'Marie Dubois',
    lastMessage: 'Merci pour ces informations',
    time: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: 2,
    visitor: 'Pierre Martin',
    lastMessage: 'Je voudrais passer commande',
    time: new Date(Date.now() - 12 * 60 * 1000) // 12 minutes ago
  }
])

// Commandes récentes
const recentOrders = ref([
  {
    id: '1299',
    customer: 'Pierre Martin',
    amount: 129.99,
    time: new Date(Date.now() - 12 * 60 * 1000)
  },
  {
    id: '1298',
    customer: 'Sophie Laurent',
    amount: 89.50,
    time: new Date(Date.now() - 45 * 60 * 1000)
  }
])

// Configuration
const configurationProgress = computed(() => {
  let progress = 0
  if (knowledgeBaseStatus.value !== 'Vide') progress += 50
  if (agentConfigStatus.value !== 'À configurer') progress += 50
  return progress
})

const knowledgeBaseStatus = ref('Vide')
const agentConfigStatus = ref('À configurer')

// Méthodes utilitaires
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
  return date.toLocaleDateString('fr-FR')
}

// Actions
const refreshData = async () => {
  refreshing.value = true
  
  try {
    // Simulation de rechargement des données
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Ici, vous feriez des appels API réels
    // const newStats = await $fetch('/api/dashboard/stats')
    // Object.assign(stats, newStats)
    
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error)
  } finally {
    refreshing.value = false
  }
}

const goToConversation = (id: number) => {
  navigateTo(`/conversations?id=${id}`)
}

const goToOrder = (id: string) => {
  navigateTo(`/orders?id=${id}`)
}

// Lifecycle
onMounted(() => {
  // Vérifier si c'est un nouveau utilisateur
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('welcome') === 'true') {
    showWelcome.value = true
    // Nettoyer l'URL
    window.history.replaceState({}, '', window.location.pathname)
  }
  
  // Charger les données initiales
  loadDashboardData()
})

const loadDashboardData = async () => {
  try {
    // Charger les données depuis l'API
    // const dashboardData = await $fetch('/api/dashboard')
    // Object.assign(stats, dashboardData.stats)
    // recentConversations.value = dashboardData.recentConversations
    // recentOrders.value = dashboardData.recentOrders
    
    // Pour l'instant, on utilise des données statiques
    console.log('Dashboard data loaded')
  } catch (error) {
    console.error('Erreur lors du chargement des données dashboard:', error)
  }
}
</script>

<style scoped>
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.transition-all {
  transition: all 0.15s ease-in-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>