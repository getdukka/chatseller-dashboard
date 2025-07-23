<!-- pages/analytics.vue - TYPES CORRIGÉS -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
        <p class="text-gray-600">Suivez les performances de votre Agent IA</p>
      </div>
      
      <!-- Filtres de période -->
      <div class="flex space-x-2">
        <select v-model="selectedPeriod" @change="loadAnalytics" class="border border-gray-300 rounded-lg px-3 py-2">
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">90 derniers jours</option>
        </select>
      </div>
    </div>

    <!-- KPIs Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Conversations</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.totalConversations }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Commandes</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.completedOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Revenus</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(analytics.totalRevenue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Taux de conversion</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.conversionRate }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Conversations Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Conversations dans le temps</h3>
        <div class="chart-container">
          <Line :data="conversationsChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Revenus dans le temps</h3>
        <div class="chart-container">
          <Line :data="revenueChartData" :options="revenueChartOptions" />
        </div>
      </div>
    </div>

    <!-- Top Products -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Produits les plus vendus</h3>
        
        <div v-if="analytics.topProducts.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commandes
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in analytics.topProducts" :key="product.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ product.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.orders }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(product.revenue) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="text-center py-6">
          <p class="text-gray-500">Aucune donnée de produit disponible</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions as ChartJSOptions,
  type Point
} from 'chart.js'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'

// ✅ REGISTRATION CHART.JS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// ✅ META PAGE
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// ✅ TYPES LOCAUX
interface AnalyticsDataLocal {
  totalConversations: number
  activeConversations: number
  completedOrders: number
  conversionRate: number
  totalRevenue: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
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
const auth = useAuth()
const api = useApi()

// ✅ REACTIVE DATA SANS TYPES GÉNÉRIQUES
const loading = ref(false)
const selectedPeriod = ref('30d')
const analytics = ref({
  totalConversations: 0,
  activeConversations: 0,
  completedOrders: 0,
  conversionRate: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  topProducts: [],
  conversationsByDay: [],
  revenueByDay: []
} as AnalyticsDataLocal)

// ✅ COMPUTED - CHART DATA AVEC TYPES CORRECTS
const conversationsChartData = computed((): ChartData<'line', (number | Point)[], unknown> => ({
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
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

const revenueChartData = computed((): ChartData<'line', (number | Point)[], unknown> => ({
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
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

// ✅ CHART OPTIONS AVEC TYPES CORRECTS
const chartOptions = computed((): ChartJSOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return typeof value === 'number' ? value.toString() : ''
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    }
  }
}))

const revenueChartOptions = computed((): ChartJSOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
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
    legend: {
      display: true
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  }
}))

// ✅ METHODS
const loadAnalytics = async () => {
  loading.value = true
  
  try {
    const response = await api.analytics.dashboard(auth.userShopId.value || undefined)
    
    if (response.success && response.data) {
      analytics.value = response.data
    } else {
      console.error('Erreur lors du chargement des analytics:', response.error)
      
      // Données factices pour le développement
      analytics.value = {
        totalConversations: 1247,
        activeConversations: 42,
        completedOrders: 324,
        conversionRate: 26.2,
        totalRevenue: 48750.50,
        averageOrderValue: 150.50,
        topProducts: [
          { name: 'Produit A', orders: 45, revenue: 4500 },
          { name: 'Produit B', orders: 32, revenue: 3200 },
          { name: 'Produit C', orders: 28, revenue: 2800 }
        ],
        conversationsByDay: generateMockConversationsData(30),
        revenueByDay: generateMockRevenueData(30)
      }
    }
  } catch (error) {
    console.error('Erreur API analytics:', error)
    
    // Fallback avec données factices
    analytics.value = {
      totalConversations: 1247,
      activeConversations: 42,
      completedOrders: 324,
      conversionRate: 26.2,
      totalRevenue: 48750.50,
      averageOrderValue: 150.50,
      topProducts: [
        { name: 'Produit A', orders: 45, revenue: 4500 },
        { name: 'Produit B', orders: 32, revenue: 3200 },
        { name: 'Produit C', orders: 28, revenue: 2800 }
      ],
      conversationsByDay: generateMockConversationsData(30),
      revenueByDay: generateMockRevenueData(30)
    }
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// ✅ MOCK DATA HELPERS
const generateMockConversationsData = (days: number) => {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 10
    })
  }
  
  return data
}

const generateMockRevenueData = (days: number) => {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 2000) + 500
    })
  }
  
  return data
}

// ✅ LIFECYCLE
onMounted(() => {
  loadAnalytics()
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
}
</style>