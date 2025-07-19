<!-- pages/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p class="text-gray-600 mt-1">
          Vue d'ensemble de votre activité ChatSeller
        </p>
      </div>
      
      <!-- Period Selector -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-700">Période :</label>
        <select 
          v-model="selectedPeriod" 
          @change="handlePeriodChange"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">3 derniers mois</option>
          <option value="1y">12 derniers mois</option>
        </select>
        
        <button 
          @click="refreshAllData"
          :disabled="isRefreshing"
          class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm disabled:opacity-50"
          title="Actualiser les données"
        >
          <svg 
            class="w-4 h-4" 
            :class="{ 'animate-spin': isRefreshing }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isInitialLoading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-lg shadow animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow animate-pulse">
        <div class="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasErrors" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <h3 class="text-red-800 font-medium">Erreur de chargement</h3>
          <p class="text-red-700 text-sm mt-1">
            Impossible de charger les données du dashboard.
          </p>
        </div>
      </div>
      <button 
        @click="refreshAllData" 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
      >
        Réessayer
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Conversations -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Conversations totales</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ totalConversations.toLocaleString() }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600">{{ activeConversations }}</span>
            <span class="text-gray-500 ml-1">actives en cours</span>
          </div>
        </div>

        <!-- Orders -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Commandes</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ completedOrders.toLocaleString() }}
              </p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-blue-600">{{ formattedConversionRate }}</span>
            <span class="text-gray-500 ml-1">taux de conversion</span>
          </div>
        </div>

        <!-- Revenue -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Chiffre d'affaires</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formattedRevenue }}
              </p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600">{{ formattedAOV }}</span>
            <span class="text-gray-500 ml-1">panier moyen</span>
          </div>
        </div>

        <!-- Response Time -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Temps de réponse</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ realTimeStats.responseTime }}
              </p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-green-600">{{ realTimeStats.activeNow }}</span>
            <span class="text-gray-500 ml-1">en ligne maintenant</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Conversations Chart -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Évolution des conversations
          </h3>
          <div v-if="conversationsChartData.length > 0" class="h-64">
            <!-- Simple chart representation -->
            <div class="flex items-end justify-between h-full space-x-1">
              <div 
                v-for="(point, index) in conversationsChartData.slice(-14)" 
                :key="index"
                class="bg-blue-500 rounded-t flex-1 flex flex-col justify-end"
                :style="{ height: `${Math.max(10, (point.value / Math.max(...conversationsChartData.map(p => p.value))) * 100)}%` }"
                :title="`${point.date}: ${point.value} conversations`"
              >
              </div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-2">
              <span>{{ conversationsChartData[0]?.date }}</span>
              <span>{{ conversationsChartData[conversationsChartData.length - 1]?.date }}</span>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-gray-500">
            <p>Aucune donnée disponible</p>
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Évolution du chiffre d'affaires
          </h3>
          <div v-if="revenueChartData.length > 0" class="h-64">
            <!-- Simple chart representation -->
            <div class="flex items-end justify-between h-full space-x-1">
              <div 
                v-for="(point, index) in revenueChartData.slice(-14)" 
                :key="index"
                class="bg-green-500 rounded-t flex-1 flex flex-col justify-end"
                :style="{ height: `${Math.max(10, (point.value / Math.max(...revenueChartData.map(p => p.value))) * 100)}%` }"
                :title="`${point.date}: ${point.value}€`"
              >
              </div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-2">
              <span>{{ revenueChartData[0]?.date }}</span>
              <span>{{ revenueChartData[revenueChartData.length - 1]?.date }}</span>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-gray-500">
            <p>Aucune donnée disponible</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Conversations -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Conversations récentes
            </h3>
            <NuxtLink 
              to="/conversations"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              Voir tout
            </NuxtLink>
          </div>
          
          <div v-if="latestConversations.length > 0" class="space-y-3">
            <div 
              v-for="conversation in latestConversations.slice(0, 5)" 
              :key="conversation.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ getConversationSummary(conversation).visitorName }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ getConversationSummary(conversation).lastMessage.substring(0, 50) }}...
                </p>
              </div>
              <div class="text-right">
                <span 
                  class="inline-flex px-2 py-1 text-xs rounded-full"
                  :class="getStatusBadgeClass(conversation.status)"
                >
                  {{ getStatusLabel(conversation.status) }}
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  {{ getConversationSummary(conversation).duration }}
                </p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Aucune conversation récente</p>
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Produits populaires
            </h3>
            <NuxtLink 
              to="/analytics"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              Voir détails
            </NuxtLink>
          </div>
          
          <div v-if="topProductsForDisplay.length > 0" class="space-y-3">
            <div 
              v-for="product in topProductsForDisplay" 
              :key="product.name"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <span class="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs rounded-full mr-3">
                  {{ product.rank }}
                </span>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ product.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ product.orders }} commandes
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">
                  {{ product.formattedRevenue }}
                </p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p>Aucune donnée produit</p>
          </div>
        </div>

        <!-- Knowledge Base Status -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Base de connaissance
            </h3>
            <NuxtLink 
              to="/knowledge-base"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              Gérer
            </NuxtLink>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Documents</span>
              <span class="font-medium">{{ knowledgeBaseStatus.totalDocuments }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Statut</span>
              <span 
                class="inline-flex px-2 py-1 text-xs rounded-full"
                :class="getReadinessClass(knowledgeBaseStatus.readiness)"
              >
                {{ getReadinessLabel(knowledgeBaseStatus.readiness) }}
              </span>
            </div>
            
            <div v-if="knowledgeBaseStatus.lastUpdate" class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Dernière MAJ</span>
              <span class="text-sm">{{ knowledgeBaseStatus.lastUpdate }}</span>
            </div>
            
            <div v-if="knowledgeBaseStatus.isEmpty" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm text-yellow-800">
                ⚠️ Aucun document dans votre base de connaissance. Ajoutez du contenu pour améliorer les réponses de votre agent IA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

// =====================================
// COMPOSABLES AND STORES
// =====================================

const { 
  fetchAnalytics, 
  isLoading: analyticsLoading, 
  error: analyticsError,
  selectedPeriod,
  setPeriod,
  totalConversations,
  activeConversations,
  completedOrders,
  formattedRevenue,
  formattedAOV,
  formattedConversionRate,
  conversationsChartData,
  revenueChartData,
  topProductsForDisplay,
  getRealTimeStats
} = useAnalytics()

const {
  fetchConversations,
  isLoading: conversationsLoading,
  error: conversationsError,
  latestConversations,
  getConversationSummary
} = useConversations()

const {
  fetchDocuments,
  isLoading: knowledgeLoading,
  error: knowledgeError,
  getKnowledgeBaseStatus
} = useKnowledgeBase()

const { success, handleApiError } = useNotifications()

// =====================================
// REACTIVE STATE
// =====================================

const isRefreshing = ref(false)

// =====================================
// COMPUTED
// =====================================

const isInitialLoading = computed(() => 
  analyticsLoading.value && conversationsLoading.value && knowledgeLoading.value
)

const hasErrors = computed(() => 
  analyticsError.value || conversationsError.value || knowledgeError.value
)

const realTimeStats = computed(() => getRealTimeStats())
const knowledgeBaseStatus = computed(() => getKnowledgeBaseStatus())

// =====================================
// METHODS
// =====================================

/**
 * Refresh all dashboard data
 */
const refreshAllData = async (): Promise<void> => {
  isRefreshing.value = true
  
  try {
    await Promise.all([
      fetchAnalytics(true),
      fetchConversations(true),
      fetchDocuments(true)
    ])
    
    success('Données actualisées', 'Le dashboard a été mis à jour')
  } catch (error: any) {
    handleApiError(error, 'Actualisation des données')
  } finally {
    isRefreshing.value = false
  }
}

/**
 * Handle period change
 */
const handlePeriodChange = (): void => {
  setPeriod(selectedPeriod.value)
}

/**
 * Get status badge class for conversations
 */
const getStatusBadgeClass = (status: string): string => {
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
 * Get status label for conversations
 */
const getStatusLabel = (status: string): string => {
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
 * Get readiness class for knowledge base
 */
const getReadinessClass = (readiness: string): string => {
  switch (readiness) {
    case 'excellent':
      return 'bg-green-100 text-green-800'
    case 'good':
      return 'bg-blue-100 text-blue-800'
    case 'minimal':
      return 'bg-yellow-100 text-yellow-800'
    case 'empty':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get readiness label for knowledge base
 */
const getReadinessLabel = (readiness: string): string => {
  switch (readiness) {
    case 'excellent':
      return 'Excellent'
    case 'good':
      return 'Bon'
    case 'minimal':
      return 'Minimal'
    case 'empty':
      return 'Vide'
    default:
      return 'Inconnu'
  }
}

// =====================================
// LIFECYCLE
// =====================================

onMounted(async () => {
  // Load all data on mount
  await Promise.all([
    fetchAnalytics(),
    fetchConversations(),
    fetchDocuments()
  ])
})

// =====================================
// SEO
// =====================================

useHead({
  title: 'Dashboard - ChatSeller',
  meta: [
    {
      name: 'description',
      content: 'Tableau de bord ChatSeller - Vue d\'ensemble de votre activité et performances.'
    }
  ]
})
</script>