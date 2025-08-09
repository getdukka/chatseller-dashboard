<!-- pages/analytics.vue - VERSION API PURE AVEC ADAPTATION PLANS -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Modern -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
            <p class="mt-2 text-gray-600">
              Suivez les performances de vos Vendeurs IA
              <span v-if="planDetails.code === 'starter'" class="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Plan {{ planDetails.name }}
              </span>
            </p>
          </div>
          
          <!-- Actions Toolbar -->
          <div class="flex items-center space-x-4">
            <select 
              v-if="isAdvancedPlan"
              v-model="selectedPeriod" 
              @change="loadAnalytics" 
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
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
      <!-- ✅ KPI CARDS - VISIBLES POUR TOUS LES PLANS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Conversations -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Conversations</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.conversations?.current?.toLocaleString() || 0 }}</p>
              <p v-if="analytics.conversations?.growth !== undefined" class="text-xs mt-1" :class="getGrowthClass(analytics.conversations.growth)">
                {{ formatGrowth(analytics.conversations.growth) }} vs période précédente
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">Pas de données précédentes</p>
            </div>
          </div>
        </div>

        <!-- Commandes -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Commandes</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.orders?.current?.toLocaleString() || 0 }}</p>
              <p v-if="analytics.orders?.growth !== undefined" class="text-xs mt-1" :class="getGrowthClass(analytics.orders.growth)">
                {{ formatGrowth(analytics.orders.growth) }} vs période précédente
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">Pas de données précédentes</p>
            </div>
          </div>
        </div>

        <!-- Revenus -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-xl">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Revenus</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(analytics.revenue?.current || 0) }}</p>
              <p v-if="analytics.revenue?.growth !== undefined" class="text-xs mt-1" :class="getGrowthClass(analytics.revenue.growth)">
                {{ formatGrowth(analytics.revenue.growth) }} vs période précédente
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">Pas de données précédentes</p>
            </div>
          </div>
        </div>

        <!-- Taux de conversion -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-xl">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Taux de conversion</p>
              <p class="text-2xl font-bold text-gray-900">{{ (analytics.conversionRate?.current || 0).toFixed(1) }}%</p>
              <p v-if="analytics.conversionRate?.previous !== undefined" class="text-xs mt-1" :class="getConversionGrowthClass()">
                {{ getConversionGrowthText() }}
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">Pas de données précédentes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ ANALYTICS AVANCÉES - SEULEMENT POUR PRO+ -->
      <div v-if="isAdvancedPlan">
        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Conversations Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Évolution des conversations</h3>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Conversations quotidiennes</span>
              </div>
            </div>
            <div class="h-64">
              <canvas ref="conversationsChart"></canvas>
            </div>
          </div>

          <!-- Revenue Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Évolution des revenus</h3>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Revenus quotidiens (€)</span>
              </div>
            </div>
            <div class="h-64">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Additional Analytics Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Performance Summary -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Métriques de performance</h3>
            <div class="space-y-6">
              <!-- Panier moyen -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Panier moyen</p>
                  <p class="text-xs text-gray-500">Valeur commande</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-purple-600">{{ formatCurrency(detailedAnalytics.performance?.averageOrderValue || 0) }}</p>
                </div>
              </div>

              <!-- Total conversations -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Total conversations</p>
                  <p class="text-xs text-gray-500">Toutes périodes</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-blue-600">{{ (detailedAnalytics.performance?.totalConversations || 0).toLocaleString() }}</p>
                </div>
              </div>

              <!-- Total commandes -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Total commandes</p>
                  <p class="text-xs text-gray-500">Toutes périodes</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-green-600">{{ (detailedAnalytics.performance?.totalOrders || 0).toLocaleString() }}</p>
                </div>
              </div>

              <!-- Revenus totaux -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Revenus totaux</p>
                  <p class="text-xs text-gray-500">Toutes périodes</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-yellow-600">{{ formatCurrency(detailedAnalytics.performance?.totalRevenue || 0) }}</p>
                </div>
              </div>
            </div>

            <!-- Performance Indicator -->
            <div class="mt-6 p-4 rounded-lg" :class="getPerformanceClass()">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5" :class="getPerformanceIconClass()" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="(analytics.conversionRate?.current || 0) >= 15" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    <path v-else-if="(analytics.conversionRate?.current || 0) >= 5" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    <path v-else fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium" :class="getPerformanceTextClass()">{{ getPerformanceStatus() }}</p>
                  <p class="text-xs" :class="getPerformanceSubTextClass()">{{ getPerformanceMessage() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Timeline -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Activité récente</h3>
              <span class="text-xs text-gray-500">{{ getPeriodLabel() }}</span>
            </div>
            
            <div v-if="detailedAnalytics.conversationHistory?.length > 0 || detailedAnalytics.orderHistory?.length > 0" class="space-y-4">
              <!-- Conversations récentes -->
              <div v-if="detailedAnalytics.conversationHistory?.slice(-3).length > 0">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Conversations récentes</h4>
                <div v-for="day in detailedAnalytics.conversationHistory.slice(-3)" :key="`conv-${day.date}`" class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span class="text-sm text-gray-900">{{ formatDate(day.date) }}</span>
                  <span class="text-sm font-medium text-blue-600">{{ day.count }} conversations</span>
                </div>
              </div>

              <!-- Commandes récentes -->
              <div v-if="detailedAnalytics.orderHistory?.slice(-3).length > 0">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Commandes récentes</h4>
                <div v-for="day in detailedAnalytics.orderHistory.slice(-3)" :key="`order-${day.date}`" class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span class="text-sm text-gray-900">{{ formatDate(day.date) }}</span>
                  <div class="text-right">
                    <span class="text-sm font-medium text-green-600">{{ day.count }} commandes</span>
                    <p class="text-xs text-green-700">{{ formatCurrency(day.revenue) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <p class="mt-2 text-sm text-gray-500">Aucune activité récente</p>
              <p class="text-xs text-gray-400">L'activité apparaîtra ici</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ MESSAGE UPGRADE POUR STARTER -->
      <div v-if="planDetails.code === 'starter'" class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
            <svg class="h-12 w-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">🚀 Débloquez les Analytics Avancées</h3>
            <p class="text-blue-100 mb-4">
              Passez au plan Pro pour accéder aux graphiques détaillés, historiques de performance, métriques avancées et bien plus.
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">📊 Graphiques historiques</span>
              <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">📈 Métriques avancées</span>
              <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">⏱️ Activité en temps réel</span>
              <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">📋 Rapports détaillés</span>
            </div>
            <button 
              @click="goToBilling" 
              class="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Passer au Pro - {{ formatCurrency(29) }}/mois
            </button>
          </div>
        </div>
      </div>

      <!-- ✅ MESSAGE POUR ESSAI GRATUIT EXPIRÉ -->
      <div v-if="planDetails.hasExpired" class="bg-red-50 border border-red-200 rounded-xl p-6">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <svg class="h-10 w-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-red-800">Essai gratuit expiré</h3>
            <p class="text-red-700 text-sm">
              Votre essai gratuit de 7 jours est terminé. Choisissez un plan pour continuer à utiliser ChatSeller.
            </p>
            <button 
              @click="goToBilling" 
              class="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Choisir un plan
            </button>
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
import { ref, onMounted, nextTick, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ META PAGE
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES
type PeriodType = '7d' | '30d' | '90d' | '1y'

// ✅ COMPOSABLES
const authStore = useAuthStore()
const api = useApi()

// ✅ COMPUTED - GESTION DES PLANS
const planDetails = computed(() => authStore.planDetails)
const isAdvancedPlan = computed(() => {
  const code = planDetails.value.code
  return ['pro', 'professional', 'enterprise'].includes(code)
})

// ✅ REACTIVE STATE
const loading = ref(false)
const selectedPeriod = ref<PeriodType>('30d')
const conversationsChart = ref<HTMLCanvasElement>()
const revenueChart = ref<HTMLCanvasElement>()

// Analytics data structure matching API responses
const analytics = ref<any>({
  conversations: { current: 0, previous: 0, growth: 0 },
  orders: { current: 0, previous: 0, growth: 0 },
  revenue: { current: 0, previous: 0, growth: 0 },
  conversionRate: { current: 0, previous: 0 }
})

const detailedAnalytics = ref<any>({
  performance: {
    totalConversations: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  },
  conversationHistory: [],
  orderHistory: []
})

// ✅ UTILITY METHODS
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatGrowth = (growth: number): string => {
  const sign = growth >= 0 ? '+' : ''
  return `${sign}${growth.toFixed(1)}%`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const getGrowthClass = (growth: number): string => {
  if (growth > 0) return 'text-green-600'
  if (growth < 0) return 'text-red-600'
  return 'text-gray-500'
}

const getConversionGrowthClass = (): string => {
  const current = analytics.value.conversionRate?.current || 0
  const previous = analytics.value.conversionRate?.previous || 0
  
  if (current > previous) return 'text-green-600'
  if (current < previous) return 'text-red-600'
  return 'text-gray-500'
}

const getConversionGrowthText = (): string => {
  const current = analytics.value.conversionRate?.current || 0
  const previous = analytics.value.conversionRate?.previous || 0
  
  if (previous === 0) return 'Première période'
  
  const diff = current - previous
  const sign = diff >= 0 ? '+' : ''
  return `${sign}${diff.toFixed(1)}% vs précédente`
}

const getPeriodLabel = (): string => {
  switch (selectedPeriod.value) {
    case '7d': return '7 derniers jours'
    case '30d': return '30 derniers jours' 
    case '90d': return '90 derniers jours'
    default: return '30 derniers jours'
  }
}

const getPerformanceClass = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'bg-green-50 border border-green-200'
  if (rate >= 5) return 'bg-yellow-50 border border-yellow-200'
  return 'bg-red-50 border border-red-200'
}

const getPerformanceIconClass = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'text-green-400'
  if (rate >= 5) return 'text-yellow-400'
  return 'text-red-400'
}

const getPerformanceTextClass = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'text-green-800'
  if (rate >= 5) return 'text-yellow-800'
  return 'text-red-800'
}

const getPerformanceSubTextClass = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'text-green-700'
  if (rate >= 5) return 'text-yellow-700'
  return 'text-red-700'
}

const getPerformanceStatus = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'Performance excellente'
  if (rate >= 5) return 'Performance correcte'
  return 'Performance à améliorer'
}

const getPerformanceMessage = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'Votre agent convertit très bien'
  if (rate >= 5) return 'Il y a une marge d\'amélioration'
  return 'Optimisation fortement recommandée'
}

// ✅ API CALLS - PURE API ARCHITECTURE
const loadAnalytics = async () => {
  if (!authStore.isAuthenticated) {
    console.warn('❌ Utilisateur non authentifié')
    return
  }

  loading.value = true
  
  try {
    console.log('🔄 Chargement analytics via API...')

    // ✅ TOUJOURS CHARGER LES STATS DE BASE (DASHBOARD)
    const dashboardResponse = await api.analytics.dashboard()
    
    if (dashboardResponse.success && dashboardResponse.data) {
      analytics.value = dashboardResponse.data
      console.log('✅ Analytics de base chargées:', analytics.value)
    } else {
      console.error('❌ Erreur analytics de base:', dashboardResponse.error)
    }

    // ✅ CHARGER LES ANALYTICS DÉTAILLÉES SEULEMENT POUR PRO+
    if (isAdvancedPlan.value) {
      console.log('📊 Chargement analytics détaillées pour plan Pro+...')
      
      const detailedResponse = await api.analytics.detailed({ 
        period: selectedPeriod.value as PeriodType
      })
      
      if (detailedResponse.success && detailedResponse.data) {
        detailedAnalytics.value = detailedResponse.data
        console.log('✅ Analytics détaillées chargées:', detailedAnalytics.value)
        
        // Dessiner les graphiques après chargement
        await nextTick()
        drawCharts()
      } else {
        console.error('❌ Erreur analytics détaillées:', detailedResponse.error)
      }
    }

  } catch (error: any) {
    console.error('❌ Erreur lors du chargement des analytics:', error)
    
    // ✅ DONNÉES PAR DÉFAUT EN CAS D'ERREUR
    analytics.value = {
      conversations: { current: 0, previous: 0, growth: 0 },
      orders: { current: 0, previous: 0, growth: 0 },
      revenue: { current: 0, previous: 0, growth: 0 },
      conversionRate: { current: 0, previous: 0 }
    }

    detailedAnalytics.value = {
      performance: {
        totalConversations: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      },
      conversationHistory: [],
      orderHistory: []
    }
  } finally {
    loading.value = false
  }
}

// ✅ GRAPHIQUES AVEC CANVAS (SEULEMENT POUR PRO+)
const drawCharts = () => {
  if (!isAdvancedPlan.value) return
  
  drawConversationsChart()
  drawRevenueChart()
}

const drawConversationsChart = () => {
  const canvas = conversationsChart.value
  if (!canvas || !detailedAnalytics.value.conversationHistory?.length) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Configuration du canvas
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  // Données
  const data = detailedAnalytics.value.conversationHistory
  const maxValue = Math.max(...data.map((d: any) => d.count), 1)
  const adjustedMaxValue = maxValue * 1.1
  const padding = 40
  const width = rect.width - padding * 2
  const height = rect.height - padding * 2

  // Nettoyer
  ctx.clearRect(0, 0, rect.width, rect.height)

  // Dessiner les axes
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1

  // Axe Y
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, rect.height - padding)
  ctx.stroke()

  // Axe X
  ctx.beginPath()
  ctx.moveTo(padding, rect.height - padding)
  ctx.lineTo(rect.width - padding, rect.height - padding)
  ctx.stroke()

  if (data.length > 1 && maxValue > 0) {
    // Dessiner la courbe
    ctx.strokeStyle = '#3B82F6'
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
    ctx.lineWidth = 2

    const stepX = width / (data.length - 1)
    
    // Remplissage
    ctx.beginPath()
    ctx.moveTo(padding, rect.height - padding)
    
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.count / adjustedMaxValue * height)
      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.lineTo(padding + (data.length - 1) * stepX, rect.height - padding)
    ctx.closePath()
    ctx.fill()

    // Ligne
    ctx.beginPath()
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.count / adjustedMaxValue * height)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Points
    ctx.fillStyle = '#3B82F6'
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.count / adjustedMaxValue * height)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }
}

const drawRevenueChart = () => {
  const canvas = revenueChart.value
  if (!canvas || !detailedAnalytics.value.orderHistory?.length) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Configuration du canvas
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  // Données
  const data = detailedAnalytics.value.orderHistory
  const maxValue = Math.max(...data.map((d: any) => d.revenue), 1)
  const adjustedMaxValue = maxValue * 1.1
  const padding = 40
  const width = rect.width - padding * 2
  const height = rect.height - padding * 2

  // Nettoyer
  ctx.clearRect(0, 0, rect.width, rect.height)

  // Dessiner les axes
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, rect.height - padding)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(padding, rect.height - padding)
  ctx.lineTo(rect.width - padding, rect.height - padding)
  ctx.stroke()

  if (data.length > 1 && maxValue > 0) {
    // Dessiner la courbe de revenus
    ctx.strokeStyle = '#10B981'
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
    ctx.lineWidth = 2

    const stepX = width / (data.length - 1)
    
    // Remplissage
    ctx.beginPath()
    ctx.moveTo(padding, rect.height - padding)
    
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.revenue / adjustedMaxValue * height)
      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.lineTo(padding + (data.length - 1) * stepX, rect.height - padding)
    ctx.closePath()
    ctx.fill()

    // Ligne
    ctx.beginPath()
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.revenue / adjustedMaxValue * height)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Points
    ctx.fillStyle = '#10B981'
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.revenue / adjustedMaxValue * height)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }
}

const refreshAnalytics = async () => {
  await loadAnalytics()
}

// ✅ NAVIGATION FUNCTIONS
const goToBilling = async () => {
  await navigateTo('/billing')
}

// ✅ LIFECYCLE
onMounted(() => {
  loadAnalytics()
})

// ✅ SEO
useHead({
  title: 'Analytics - ChatSeller Dashboard',
  meta: [
    { name: 'description', content: 'Suivez les performances de vos vendeurs IA ChatSeller' }
  ]
})
</script>

<style scoped>
/* Animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-shadow {
  transition: box-shadow 0.15s ease-in-out;
}

.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* Canvas responsive */
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>