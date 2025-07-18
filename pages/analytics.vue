<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
          <p class="text-sm text-gray-500 mt-1">
            Suivez les performances de votre Agent IA Commercial
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <select
            v-model="selectedPeriod"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
          </select>
          
          <button
            @click="exportReport"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
            Exporter
          </button>
          
          <button
            @click="refreshData"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Métriques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-blue-50 rounded-xl">
              <EyeIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Vues widget</p>
            <p class="text-2xl font-bold text-gray-900">{{ metrics.views.toLocaleString() }}</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ metrics.viewsGrowth }}% vs période précédente
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-green-50 rounded-xl">
              <ChatBubbleLeftRightIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Conversations</p>
            <p class="text-2xl font-bold text-gray-900">{{ metrics.conversations.toLocaleString() }}</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ metrics.conversationsGrowth }}% vs période précédente
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-yellow-50 rounded-xl">
              <ShoppingCartIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Commandes</p>
            <p class="text-2xl font-bold text-gray-900">{{ metrics.orders.toLocaleString() }}</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ metrics.ordersGrowth }}% vs période précédente
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="p-3 bg-purple-50 rounded-xl">
              <CurrencyDollarIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Revenus</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metrics.revenue) }}</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ metrics.revenueGrowth }}% vs période précédente
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Taux de conversion -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Taux de conversion</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600">{{ conversionRates.viewToConversation }}%</div>
          <div class="text-sm text-gray-500 mt-1">Vue → Conversation</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600">{{ conversionRates.conversationToOrder }}%</div>
          <div class="text-sm text-gray-500 mt-1">Conversation → Commande</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600">{{ conversionRates.overall }}%</div>
          <div class="text-sm text-gray-500 mt-1">Vue → Commande (Global)</div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Évolution des conversations -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution des conversations</h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div class="text-center">
            <ChartBarIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Graphique des conversations</p>
            <p class="text-xs text-gray-400 mt-1">Intégration Chart.js à venir</p>
          </div>
        </div>
      </div>
      
      <!-- Revenus par jour -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenus quotidiens</h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div class="text-center">
            <CurrencyDollarIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">Graphique des revenus</p>
            <p class="text-xs text-gray-400 mt-1">Intégration Chart.js à venir</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Top produits et pages -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top produits vendus -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Top produits vendus</h3>
        <div class="space-y-4">
          <div 
            v-for="(product, index) in topProducts" 
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 font-medium text-sm">{{ index + 1 }}</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-xs text-gray-500">{{ product.sales }} ventes</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(product.revenue) }}</p>
              <p class="text-xs text-gray-500">{{ product.conversionRate }}% conv.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Top pages avec widget -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Top pages performantes</h3>
        <div class="space-y-4">
          <div 
            v-for="(page, index) in topPages" 
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-green-600 font-medium text-sm">{{ index + 1 }}</span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ page.url }}</p>
                <p class="text-xs text-gray-500">{{ page.views }} vues</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ page.conversations }} conv.</p>
              <p class="text-xs text-gray-500">{{ page.conversionRate }}% conv.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Détails temporels -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité par heure</h3>
      <div class="grid grid-cols-12 gap-2">
        <div 
          v-for="hour in hourlyActivity" 
          :key="hour.hour"
          class="text-center"
        >
          <div 
            :style="{ height: `${hour.activity * 2}px` }"
            class="bg-blue-500 rounded-t-sm mx-auto mb-2 transition-all duration-300 hover:bg-blue-600"
            :class="hour.activity === 0 ? 'bg-gray-200' : ''"
            style="width: 20px; min-height: 4px;"
          ></div>
          <div class="text-xs text-gray-500">{{ hour.hour }}h</div>
        </div>
      </div>
      <div class="mt-4 text-xs text-gray-500 text-center">
        Activité des conversations par heure ({{ selectedPeriod }} derniers jours)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue'
import {
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

// État local
const loading = ref(false)
const selectedPeriod = ref(30)

// Métriques principales (données simulées)
const metrics = ref({
  views: 15247,
  viewsGrowth: 12.3,
  conversations: 1284,
  conversationsGrowth: 8.7,
  orders: 347,
  ordersGrowth: 15.2,
  revenue: 2750000,
  revenueGrowth: 18.5
})

// Taux de conversion
const conversionRates = computed(() => ({
  viewToConversation: ((metrics.value.conversations / metrics.value.views) * 100).toFixed(1),
  conversationToOrder: ((metrics.value.orders / metrics.value.conversations) * 100).toFixed(1),
  overall: ((metrics.value.orders / metrics.value.views) * 100).toFixed(1)
}))

// Top produits
const topProducts = ref([
  {
    name: 'iPhone 15 Pro Max',
    sales: 45,
    revenue: 675000,
    conversionRate: 23.5
  },
  {
    name: 'Samsung Galaxy S24',
    sales: 38,
    revenue: 456000,
    conversionRate: 19.2
  },
  {
    name: 'MacBook Air M3',
    sales: 22,
    revenue: 330000,
    conversionRate: 15.8
  },
  {
    name: 'AirPods Pro 2',
    sales: 67,
    revenue: 201000,
    conversionRate: 28.3
  },
  {
    name: 'iPad Pro 12.9"',
    sales: 18,
    revenue: 162000,
    conversionRate: 12.4
  }
])

// Top pages
const topPages = ref([
  {
    url: '/produits/iphone-15-pro',
    views: 2847,
    conversations: 287,
    conversionRate: 10.1
  },
  {
    url: '/produits/samsung-galaxy-s24',
    views: 2156,
    conversations: 198,
    conversionRate: 9.2
  },
  {
    url: '/produits/macbook-air-m3',
    views: 1923,
    conversations: 156,
    conversionRate: 8.1
  },
  {
    url: '/produits/airpods-pro',
    views: 1687,
    conversations: 189,
    conversionRate: 11.2
  },
  {
    url: '/produits/ipad-pro',
    views: 1534,
    conversations: 134,
    conversionRate: 8.7
  }
])

// Activité horaire
const hourlyActivity = ref([
  { hour: 0, activity: 5 },
  { hour: 1, activity: 2 },
  { hour: 2, activity: 1 },
  { hour: 3, activity: 0 },
  { hour: 4, activity: 1 },
  { hour: 5, activity: 3 },
  { hour: 6, activity: 8 },
  { hour: 7, activity: 15 },
  { hour: 8, activity: 25 },
  { hour: 9, activity: 35 },
  { hour: 10, activity: 42 },
  { hour: 11, activity: 38 },
  { hour: 12, activity: 45 },
  { hour: 13, activity: 40 },
  { hour: 14, activity: 48 },
  { hour: 15, activity: 52 },
  { hour: 16, activity: 47 },
  { hour: 17, activity: 35 },
  { hour: 18, activity: 28 },
  { hour: 19, activity: 22 },
  { hour: 20, activity: 18 },
  { hour: 21, activity: 12 },
  { hour: 22, activity: 8 },
  { hour: 23, activity: 6 }
])

// Fonctions utilitaires
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

// Actions
const refreshData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simuler mise à jour des données
    metrics.value = {
      ...metrics.value,
      views: metrics.value.views + Math.floor(Math.random() * 100),
      conversations: metrics.value.conversations + Math.floor(Math.random() * 10),
      orders: metrics.value.orders + Math.floor(Math.random() * 5)
    }
    
    const showNotification = inject('showNotification') as ((message: string, type: string) => void) | undefined
    if (showNotification) {
      showNotification('Analytics actualisées avec succès !', 'success')
    }
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  } finally {
    loading.value = false
  }
}

const exportReport = () => {
  console.log('Export du rapport analytics')
  const showNotification = inject('showNotification') as ((message: string, type: string) => void) | undefined
  if (showNotification) {
    showNotification('Export du rapport démarré ! Le fichier sera téléchargé sous peu.', 'info')
  }
}

// Watcher pour la période sélectionnée
watch(selectedPeriod, (newPeriod) => {
  console.log('Période changée:', newPeriod)
  // Ici on rechargerait les données pour la nouvelle période
})

// Métadonnées de la page
definePageMeta({
  middleware: defineNuxtRouteMiddleware((to) => {
    if (process.client) {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('user_data')
      
      if (!token || !user) {
        if (to.path !== '/login' && to.path !== '/register') {
          return navigateTo('/login')
        }
      }
    }
  })
})

useSeoMeta({
  title: 'Analytics - ChatSeller',
  description: 'Suivez les performances de votre Agent IA Commercial'
})

// Charger les données au montage
onMounted(() => {
  console.log('Page analytics montée')
})
</script>