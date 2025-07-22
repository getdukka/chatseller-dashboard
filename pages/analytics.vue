<!-- pages/analytics.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
            <p class="mt-1 text-sm text-gray-600">
              Analysez les performances de votre agent IA commercial
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Sélecteur de période -->
            <select v-model="selectedPeriod" @change="loadAnalytics" class="input-primary">
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">3 derniers mois</option>
              <option value="365">12 derniers mois</option>
            </select>

            <button
              @click="refreshAnalytics"
              :disabled="refreshing"
              class="btn-secondary"
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
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="p-6">
      <!-- Métriques principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Conversations</p>
              <p class="text-3xl font-bold text-gray-900">{{ analytics.totalConversations }}</p>
              <p class="text-sm" :class="getChangeClass(analytics.conversationsChange)">
                {{ getChangeText(analytics.conversationsChange) }} vs période précédente
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Taux de conversion</p>
              <p class="text-3xl font-bold text-gray-900">{{ analytics.conversionRate }}%</p>
              <p class="text-sm" :class="getChangeClass(analytics.conversionChange)">
                {{ getChangeText(analytics.conversionChange) }} vs période précédente
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(analytics.revenue) }}</p>
              <p class="text-sm" :class="getChangeClass(analytics.revenueChange)">
                {{ getChangeText(analytics.revenueChange) }} vs période précédente
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Temps de réponse</p>
              <p class="text-3xl font-bold text-gray-900">{{ analytics.responseTime }}s</p>
              <p class="text-sm" :class="getChangeClass(-analytics.responseTimeChange)">
                {{ getChangeText(-analytics.responseTimeChange, 's') }} vs période précédente
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Évolution des conversations -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Évolution des conversations</h3>
          </div>
          <div class="p-6">
            <div class="h-64 flex items-center justify-center" v-if="loading">
              <div class="skeleton h-full w-full"></div>
            </div>
            <LineChart
              v-else
              :data="conversationsChartData"
              :options="chartOptions"
              class="h-64"
            />
          </div>
        </div>

        <!-- Taux de conversion par jour -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Taux de conversion</h3>
          </div>
          <div class="p-6">
            <div class="h-64 flex items-center justify-center" v-if="loading">
              <div class="skeleton h-full w-full"></div>
            </div>
            <LineChart
              v-else
              :data="conversionChartData"
              :options="conversionChartOptions"
              class="h-64"
            />
          </div>
        </div>

        <!-- Répartition des sources de trafic -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Sources de trafic</h3>
          </div>
          <div class="p-6">
            <div class="h-64 flex items-center justify-center" v-if="loading">
              <div class="skeleton h-full w-full"></div>
            </div>
            <PieChart
              v-else
              :data="trafficSourcesData"
              :options="pieChartOptions"
              class="h-64"
            />
          </div>
        </div>

        <!-- Performance horaire -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Performance horaire</h3>
          </div>
          <div class="p-6">
            <div class="h-64 flex items-center justify-center" v-if="loading">
              <div class="skeleton h-full w-full"></div>
            </div>
            <BarChart
              v-else
              :data="hourlyPerformanceData"
              :options="barChartOptions"
              class="h-64"
            />
          </div>
        </div>
      </div>

      <!-- Tableaux détaillés -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Pages les plus performantes -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Pages les plus performantes</h3>
          </div>
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversations
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="page in topPages" :key="page.url">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ page.title }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ page.url }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="text-sm text-gray-900">{{ page.conversations }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span class="badge badge-success">{{ page.conversionRate }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Questions fréquentes -->
        <div class="card">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Questions les plus fréquentes</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="question in frequentQuestions" :key="question.id" class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ question.text }}
                  </p>
                  <div class="mt-1 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: `${(question.count / frequentQuestions[0].count) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <span class="text-sm font-medium text-gray-700">{{ question.count }}</span>
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
import { LineChart, PieChart, BarChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  BarElement
} from 'chart.js'

// Enregistrement des composants Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  BarElement
)

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Types
interface Analytics {
  totalConversations: number
  conversationsChange: number
  conversionRate: number
  conversionChange: number
  revenue: number
  revenueChange: number
  responseTime: number
  responseTimeChange: number
}

interface ChartDataPoint {
  date: string
  conversations: number
  conversions: number
}

interface TopPage {
  url: string
  title: string
  conversations: number
  conversionRate: number
}

interface FrequentQuestion {
  id: string
  text: string
  count: number
}

// État du composant
const loading = ref(true)
const refreshing = ref(false)
const selectedPeriod = ref('30')

// Données
const analytics = reactive<Analytics>({
  totalConversations: 1247,
  conversationsChange: 12.5,
  conversionRate: 34.2,
  conversionChange: -2.1,
  revenue: 45670.50,
  revenueChange: 18.3,
  responseTime: 1.8,
  responseTimeChange: -0.2
})

const chartData = ref<ChartDataPoint[]>([])
const topPages = ref<TopPage[]>([])
const frequentQuestions = ref<FrequentQuestion[]>([])

// Configuration des graphiques
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false
    }
  }
}

const conversionChartOptions = {
  ...chartOptions,
  scales: {
    ...chartOptions.scales,
    y: {
      ...chartOptions.scales.y,
      min: 0,
      max: 100,
      ticks: {
        callback: (value: any) => `${value}%`
      }
    }
  }
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        padding: 20,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed || 0
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${percentage}%`
        }
      }
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

// Données des graphiques calculées
const conversationsChartData = computed(() => ({
  labels: chartData.value.map(d => d.date),
  datasets: [
    {
      label: 'Conversations',
      data: chartData.value.map(d => d.conversations),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

const conversionChartData = computed(() => ({
  labels: chartData.value.map(d => d.date),
  datasets: [
    {
      label: 'Taux de conversion (%)',
      data: chartData.value.map(d => (d.conversions / d.conversations * 100).toFixed(1)),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

const trafficSourcesData = computed(() => ({
  labels: ['Page produit', 'Page d\'accueil', 'Blog', 'Landing page', 'Autres'],
  datasets: [
    {
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6'
      ],
      borderWidth: 0
    }
  ]
}))

const hourlyPerformanceData = computed(() => ({
  labels: ['00h', '04h', '08h', '12h', '16h', '20h'],
  datasets: [
    {
      label: 'Conversations par tranche horaire',
      data: [12, 8, 45, 78, 92, 56],
      backgroundColor: '#3b82f6',
      borderRadius: 4
    }
  ]
}))

// Méthodes utilitaires
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getChangeClass = (change: number): string => {
  return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
}

const getChangeText = (change: number, suffix: string = '%'): string => {
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}${suffix}`
}

// Actions
const loadAnalytics = async () => {
  loading.value = true
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Génération de données simulées basées sur la période
    const days = parseInt(selectedPeriod.value)
    const generatedData: ChartDataPoint[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const conversations = Math.floor(Math.random() * 50) + 20
      const conversions = Math.floor(conversations * (Math.random() * 0.4 + 0.2))

      generatedData.push({
        date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        conversations,
        conversions
      })
    }

    chartData.value = generatedData

    // Données simulées pour les pages
    topPages.value = [
      { url: '/produit-premium', title: 'Produit Premium', conversations: 89, conversionRate: 42.1 },
      { url: '/pack-starter', title: 'Pack Starter', conversations: 67, conversionRate: 38.5 },
      { url: '/homepage', title: 'Page d\'accueil', conversations: 45, conversionRate: 28.9 },
      { url: '/offre-special', title: 'Offre spéciale', conversations: 34, conversionRate: 51.2 },
      { url: '/about', title: 'À propos', conversations: 12, conversionRate: 15.6 }
    ]

    // Questions fréquentes simulées
    frequentQuestions.value = [
      { id: '1', text: 'Quels sont les délais de livraison ?', count: 156 },
      { id: '2', text: 'Comment fonctionne la garantie ?', count: 98 },
      { id: '3', text: 'Proposez-vous des remises sur commande groupée ?', count: 87 },
      { id: '4', text: 'Quels sont les modes de paiement acceptés ?', count: 76 },
      { id: '5', text: 'Puis-je modifier ma commande après validation ?', count: 54 }
    ]

  } catch (error) {
    console.error('Erreur lors du chargement des analytics:', error)
  } finally {
    loading.value = false
  }
}

const refreshAnalytics = async () => {
  refreshing.value = true
  try {
    await loadAnalytics()
  } finally {
    refreshing.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadAnalytics()
})
</script>

<style scoped>
/* Les styles sont définis dans le fichier CSS global */
</style>