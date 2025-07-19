<!-- pages/analytics.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Analytics
        </h1>
        <p class="text-gray-600 mt-1">
          Analysez les performances de votre agent IA commercial
        </p>
      </div>
      
      <!-- Period & Actions -->
      <div class="flex items-center space-x-3">
        <!-- Period Selector -->
        <select 
          v-model="selectedPeriod" 
          @change="handlePeriodChange"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">3 derniers mois</option>
          <option value="1y">12 derniers mois</option>
        </select>
        
        <!-- Export Button -->
        <button
          @click="exportAnalytics"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter
        </button>
        
        <!-- Refresh Button -->
        <button
          @click="refreshAnalytics"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2 inline" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !data" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-lg shadow animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="bg-white p-6 rounded-lg shadow animate-pulse">
          <div class="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <h3 class="text-red-800 font-medium">Erreur de chargement</h3>
          <p class="text-red-700 text-sm mt-1">{{ error }}</p>
        </div>
      </div>
      <button 
        @click="refreshAnalytics" 
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
      >
        Réessayer
      </button>
    </div>

    <!-- Analytics Content -->
    <div v-else-if="data" class="space-y-6">
      <!-- Performance Indicators -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="indicator in performanceIndicators"
          :key="indicator.label"
          class="bg-white p-6 rounded-lg shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ indicator.label }}</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatIndicatorValue(indicator) }}
              </p>
            </div>
            <div 
              v-if="indicator.trend"
              class="flex items-center"
              :class="indicator.trend.isPositive ? 'text-green-600' : 'text-red-600'"
            >
              <svg 
                class="w-4 h-4 mr-1"
                :class="indicator.trend.isPositive ? 'transform rotate-180' : ''"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium">{{ indicator.trend.formatted }}</span>
            </div>
          </div>
          
          <!-- Progress bar for percentage metrics -->
          <div v-if="indicator.type === 'percentage'" class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${Math.min(indicator.value, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Conversations Chart -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Évolution des conversations
            </h3>
            <span class="text-sm text-gray-500">{{ getPeriodLabel() }}</span>
          </div>
          
          <div v-if="conversationsChartData.length > 0" class="space-y-4">
            <!-- Simple Bar Chart -->
            <div class="h-64 flex items-end justify-between space-x-1">
              <div
                v-for="(point, index) in conversationsChartData.slice(-20)"
                :key="index"
                class="bg-blue-500 rounded-t flex-1 flex flex-col justify-end group relative"
                :style="{ height: `${Math.max(10, (point.value / Math.max(...conversationsChartData.map(p => p.value))) * 100)}%` }"
              >
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {{ point.date }}: {{ point.value }} conversations
                </div>
              </div>
            </div>
            
            <!-- X-axis labels -->
            <div class="flex justify-between text-xs text-gray-500">
              <span>{{ conversationsChartData[0]?.date }}</span>
              <span>{{ conversationsChartData[conversationsChartData.length - 1]?.date }}</span>
            </div>
          </div>
          
          <div v-else class="h-64 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Aucune donnée disponible</p>
            </div>
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Évolution du chiffre d'affaires
            </h3>
            <span class="text-sm text-gray-500">{{ getPeriodLabel() }}</span>
          </div>
          
          <div v-if="revenueChartData.length > 0" class="space-y-4">
            <!-- Simple Bar Chart -->
            <div class="h-64 flex items-end justify-between space-x-1">
              <div
                v-for="(point, index) in revenueChartData.slice(-20)"
                :key="index"
                class="bg-green-500 rounded-t flex-1 flex flex-col justify-end group relative"
                :style="{ height: `${Math.max(10, (point.value / Math.max(...revenueChartData.map(p => p.value))) * 100)}%` }"
              >
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {{ point.date }}: {{ formatCurrency(point.value) }}
                </div>
              </div>
            </div>
            
            <!-- X-axis labels -->
            <div class="flex justify-between text-xs text-gray-500">
              <span>{{ revenueChartData[0]?.date }}</span>
              <span>{{ revenueChartData[revenueChartData.length - 1]?.date }}</span>
            </div>
          </div>
          
          <div v-else class="h-64 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <p>Aucune donnée disponible</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Analytics Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Products -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Produits les plus vendus
          </h3>
          
          <div v-if="topProductsForDisplay.length > 0" class="space-y-3">
            <div 
              v-for="product in topProductsForDisplay" 
              :key="product.name"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <span class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm rounded-full mr-3">
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
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p class="text-sm">Aucune donnée produit</p>
          </div>
        </div>

        <!-- Real-time Stats -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Statistiques en temps réel
          </h3>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Visiteurs en ligne</span>
              <div class="flex items-center">
                <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span class="font-medium">{{ realTimeStats.activeNow }}</span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Conversations aujourd'hui</span>
              <span class="font-medium">{{ realTimeStats.todayConversations }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Revenus aujourd'hui</span>
              <span class="font-medium">{{ formatCurrency(realTimeStats.todayRevenue) }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Temps de réponse moyen</span>
              <span class="font-medium">{{ realTimeStats.responseTime }}</span>
            </div>
          </div>
        </div>

        <!-- Performance Summary -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Résumé des performances
          </h3>
          
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Taux de conversion</span>
                <span class="text-sm font-medium">{{ formattedConversionRate }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${conversionRate * 100}%` }"
                ></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Satisfaction client</span>
                <span class="text-sm font-medium">85%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full w-[85%] transition-all duration-300"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Résolution automatique</span>
                <span class="text-sm font-medium">78%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-purple-500 h-2 rounded-full w-[78%] transition-all duration-300"></div>
              </div>
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
  isLoading, 
  error,
  data,
  selectedPeriod,
  setPeriod,
  conversationsChartData,
  revenueChartData,
  topProductsForDisplay,
  performanceIndicators,
  formattedConversionRate,
  conversionRate,
  getPeriodLabel,
  getRealTimeStats,
  exportToCSV
} = useAnalytics()

const { success, handleApiError } = useNotifications()

// =====================================
// COMPUTED
// =====================================

const realTimeStats = computed(() => getRealTimeStats())

// =====================================
// METHODS
// =====================================

/**
 * Refresh analytics data
 */
const refreshAnalytics = async (): Promise<void> => {
  try {
    await fetchAnalytics(true)
    success('Données actualisées', 'Les analytics ont été mises à jour')
  } catch (error: any) {
    handleApiError(error, 'Actualisation des analytics')
  }
}

/**
 * Handle period change
 */
const handlePeriodChange = (): void => {
  setPeriod(selectedPeriod.value)
}

/**
 * Export analytics data
 */
const exportAnalytics = (): void => {
  try {
    const csvContent = exportToCSV()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `analytics_${selectedPeriod.value}_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    success('Export réussi', 'Le fichier CSV a été téléchargé')
  } catch (error: any) {
    handleApiError(error, 'Export des analytics')
  }
}

/**
 * Format indicator value based on type
 */
const formatIndicatorValue = (indicator: any): string => {
  switch (indicator.type) {
    case 'currency':
      return formatCurrency(indicator.value)
    case 'percentage':
      return `${indicator.value.toFixed(1)}%`
    case 'number':
    default:
      return indicator.value.toLocaleString()
  }
}

/**
 * Format currency
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// =====================================
// LIFECYCLE
// =====================================

onMounted(async () => {
  await fetchAnalytics()
})

// Auto-refresh every 5 minutes
let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
  refreshInterval = setInterval(() => {
    fetchAnalytics(true)
  }, 5 * 60 * 1000) // 5 minutes
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
  title: 'Analytics - ChatSeller',
  meta: [
    {
      name: 'description',
      content: 'Analysez les performances de votre agent IA commercial ChatSeller.'
    }
  ]
})
</script>