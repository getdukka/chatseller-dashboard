<!-- pages/analytics.vue - PAGE ANALYTICS MODERNE ET RESPONSIVE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Modern -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
            <p class="mt-2 text-gray-600">
              Suivez les performances de votre Vendeur IA
            </p>
          </div>
          
          <!-- Period Selector -->
          <div class="flex items-center space-x-4">
            <select 
              v-model="selectedPeriod" 
              @change="loadAnalytics" 
              class="input-modern"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="1y">1 an</option>
            </select>
            
            <button
              @click="refreshAnalytics"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg 
                class="w-4 h-4 mr-2" 
                :class="{ 'animate-spin': loading }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ loading ? 'Actualisation...' : 'Actualiser' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Conversations</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.totalConversations.toLocaleString() }}</p>
              <p class="text-xs text-blue-600 mt-1">+{{ analytics.conversationsGrowth }}% vs période précédente</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Commandes</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.completedOrders.toLocaleString() }}</p>
              <p class="text-xs text-green-600 mt-1">+{{ analytics.ordersGrowth }}% vs période précédente</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-xl">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Revenus</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(analytics.totalRevenue) }}</p>
              <p class="text-xs text-yellow-600 mt-1">+{{ analytics.revenueGrowth }}% vs période précédente</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-xl">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Taux de conversion</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.conversionRate }}%</p>
              <p class="text-xs text-purple-600 mt-1">+{{ analytics.conversionGrowth }}% vs période précédente</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Conversations Chart -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Conversations dans le temps</h3>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Conversations</span>
            </div>
          </div>
          <div class="chart-container">
            <LineChart :data="conversationsChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Revenus dans le temps</h3>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Revenus (€)</span>
            </div>
          </div>
          <div class="chart-container">
            <LineChart :data="revenueChartData" :options="revenueChartOptions" />
          </div>
        </div>
      </div>

      <!-- Additional Analytics Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Top Products -->
        <div class="lg:col-span-2 card-modern">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Produits les plus vendus</h3>
            <span class="text-sm text-gray-500">{{ selectedPeriod === '7d' ? '7 derniers jours' : selectedPeriod === '30d' ? '30 derniers jours' : '90 derniers jours' }}</span>
          </div>
          
          <div v-if="analytics.topProducts.length > 0" class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left py-3 text-sm font-medium text-gray-600">Produit</th>
                  <th class="text-center py-3 text-sm font-medium text-gray-600">Commandes</th>
                  <th class="text-right py-3 text-sm font-medium text-gray-600">Revenus</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(product, index) in analytics.topProducts" :key="product.name" class="hover:bg-gray-50">
                  <td class="py-3">
                    <div class="flex items-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium mr-3">
                        {{ index + 1 }}
                      </div>
                      <span class="text-sm font-medium text-gray-900">{{ product.name }}</span>
                    </div>
                  </td>
                  <td class="py-3 text-center text-sm text-gray-600">
                    {{ product.orders }}
                  </td>
                  <td class="py-3 text-right text-sm font-medium text-gray-900">
                    {{ formatCurrency(product.revenue) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M9 17v6a2 2 0 002 2h6l2-2h6a2 2 0 002-2v-6M9 17h12"/>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Aucune donnée de produit disponible</p>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="card-modern">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Métriques de performance</h3>
          <div class="space-y-4">
            <!-- Response Time -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Temps de réponse moyen</p>
                <p class="text-xs text-gray-500">Agent IA</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600">{{ analytics.avgResponseTime }}</p>
              </div>
            </div>

            <!-- Satisfaction Score -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Score de satisfaction</p>
                <p class="text-xs text-gray-500">Clients</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-blue-600">{{ analytics.satisfactionScore }}/5</p>
              </div>
            </div>

            <!-- Resolution Rate -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Taux de résolution</p>
                <p class="text-xs text-gray-500">Sans intervention humaine</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-purple-600">{{ analytics.resolutionRate }}%</p>
              </div>
            </div>

            <!-- Uptime -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Temps de fonctionnement</p>
                <p class="text-xs text-gray-500">Disponibilité système</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600">{{ analytics.uptime }}%</p>
              </div>
            </div>
          </div>

          <!-- Performance Indicator -->
          <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">Système optimal</p>
                <p class="text-xs text-green-700">Toutes les métriques sont dans la normale</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Channel Performance -->
        <div class="card-modern">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Performance par canal</h3>
          <div class="space-y-4">
            <div v-for="channel in analytics.channelPerformance" :key="channel.name" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" :style="{ backgroundColor: channel.color }"></div>
                <span class="text-sm font-medium text-gray-900">{{ channel.name }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">{{ channel.conversations }} conversations</span>
                <span class="text-sm font-medium text-gray-900">{{ channel.conversionRate }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card-modern">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Activité récente</h3>
          <div class="space-y-4">
            <div v-for="activity in analytics.recentActivity" :key="activity.id" class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTime(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-xl p-6 shadow-xl">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span class="text-gray-700">Chargement des analytics...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ CORRECTION META PAGE - UTILISER LAYOUT DEFAULT
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES LOCAUX
interface AnalyticsData {
  totalConversations: number
  conversationsGrowth: number
  completedOrders: number
  ordersGrowth: number
  totalRevenue: number
  revenueGrowth: number
  conversionRate: number
  conversionGrowth: number
  avgResponseTime: string
  satisfactionScore: number
  resolutionRate: number
  uptime: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
  }>
  channelPerformance: Array<{
    name: string
    conversations: number
    conversionRate: number
    color: string
  }>
  recentActivity: Array<{
    id: string
    title: string
    description: string
    timestamp: string
  }>
  conversationsByDay: Array<{
    date: string
    count: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
  }>
}

// ✅ COMPOSABLES
const authStore = useAuthStore()

// ✅ REACTIVE STATE
const loading = ref(false)
const selectedPeriod = ref('30d')

const analytics = ref<AnalyticsData>({
  totalConversations: 1247,
  conversationsGrowth: 15.2,
  completedOrders: 324,
  ordersGrowth: 23.8,
  totalRevenue: 48750.50,
  revenueGrowth: 31.4,
  conversionRate: 26.2,
  conversionGrowth: 8.7,
  avgResponseTime: '< 2s',
  satisfactionScore: 4.8,
  resolutionRate: 94.2,
  uptime: 99.9,
  topProducts: [
    { name: 'Produit Premium A', orders: 45, revenue: 6750 },
    { name: 'Produit Standard B', orders: 32, revenue: 3200 },
    { name: 'Accessoire C', orders: 28, revenue: 1680 }
  ],
  channelPerformance: [
    { name: 'Site Web', conversations: 856, conversionRate: 28.4, color: '#3B82F6' },
    { name: 'Page Produit', conversations: 234, conversionRate: 32.1, color: '#10B981' },
    { name: 'Mobile', conversations: 157, conversionRate: 19.7, color: '#F59E0B' }
  ],
  recentActivity: [
    {
      id: '1',
      title: 'Nouveau record de conversion',
      description: 'Taux de conversion de 34.2% atteint aujourd\'hui',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Optimisation automatique activée',
      description: 'L\'IA a optimisé les réponses pour le produit Premium A',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ],
  conversationsByDay: [],
  revenueByDay: []
})

// ✅ COMPUTED CHARTS DATA
const conversationsChartData = computed(() => ({
  labels: analytics.value.conversationsByDay.map(item => 
    new Date(item.date).toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    })
  ),
  datasets: [
    {
      label: 'Conversations',
      data: analytics.value.conversationsByDay.map(item => item.count),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4
    }
  ]
}))

const revenueChartData = computed(() => ({
  labels: analytics.value.revenueByDay.map(item => 
    new Date(item.date).toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    })
  ),
  datasets: [
    {
      label: 'Revenus (€)',
      data: analytics.value.revenueByDay.map(item => item.revenue),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#10B981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      border: {
        display: false
      },
      ticks: {
        callback: function(value: any) {
          return typeof value === 'number' ? value.toString() : ''
        }
      }
    }
  }
}))

const revenueChartOptions = computed(() => ({
  ...chartOptions.value,
  scales: {
    ...chartOptions.value.scales,
    y: {
      ...chartOptions.value.scales.y,
      ticks: {
        callback: function(value: any) {
          if (typeof value === 'number') {
            return formatCurrency(value)
          }
          return ''
        }
      }
    }
  },
  plugins: {
    ...chartOptions.value.plugins,
    tooltip: {
      ...chartOptions.value.plugins.tooltip,
      callbacks: {
        label: function(context: any) {
          return `Revenus: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  }
}))

// ✅ UTILITY METHODS
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatTime = (date: string): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
  return new Date(date).toLocaleDateString('fr-FR')
}

const generateMockData = (days: number) => {
  const conversations = []
  const revenue = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    conversations.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 20
    })
    
    revenue.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 2000) + 500
    })
  }

  return { conversations, revenue }
}

// ✅ ACTION METHODS
const loadAnalytics = async () => {
  loading.value = true
  
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Générer des données mock basées sur la période
    const days = selectedPeriod.value === '7d' ? 7 : selectedPeriod.value === '30d' ? 30 : 90
    const mockData = generateMockData(days)
    
    analytics.value.conversationsByDay = mockData.conversations
    analytics.value.revenueByDay = mockData.revenue
    
  } catch (error) {
    console.error('Erreur lors du chargement des analytics:', error)
  } finally {
    loading.value = false
  }
}

const refreshAnalytics = async () => {
  await loadAnalytics()
}

// ✅ LIFECYCLE
onMounted(() => {
  loadAnalytics()
})

// ✅ SEO
useHead({
  title: 'Analytics - ChatSeller Dashboard'
})
</script>

<style scoped>
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .chart-container {
    height: 250px;
  }
}

/* ✅ ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>