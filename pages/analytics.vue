<!-- pages/analytics.vue - VERSION BEAUTÉ ADAPTÉE COMPLÈTE -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header Beauté -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center">
              <span class="mr-3">📊</span>
              Analytics
            </h1>
            <p class="mt-2 text-gray-600">
              Suivez les performances de {{ getAnalyticsTitle() }}
              <span v-if="planDetails.code === 'starter'" class="ml-2 text-sm bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 px-3 py-1 rounded-full border border-rose-200">
                Plan {{ planDetails.name }}
              </span>
            </p>
          </div>
          
          <!-- Actions Toolbar Beauté -->
          <div class="flex items-center space-x-4">
            <select 
              v-if="isAdvancedPlan"
              v-model="selectedPeriod" 
              @change="loadAnalytics" 
              class="px-3 py-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-sm bg-white"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
            </select>
            
            <button
              @click="refreshAnalytics"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 transition-all shadow-sm"
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
      <!-- KPI Cards Beauté -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Consultations Beauté -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div class="flex items-center relative z-10">
            <div class="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
              <span class="text-2xl">{{ getAnalyticsIcon() }}</span>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">{{ getConsultationsLabel() }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.conversations?.current?.toLocaleString() || 0 }}</p>
              <p v-if="analytics.conversations?.growth !== undefined" class="text-xs mt-1" :class="getGrowthClass(analytics.conversations.growth)">
                {{ formatGrowth(analytics.conversations.growth) }} vs période précédente
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">{{ getFirstPeriodLabel() }}</p>
            </div>
          </div>
        </div>

        <!-- Ventes Beauté -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div class="flex items-center relative z-10">
            <div class="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">{{ getOrdersLabel() }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.orders?.current?.toLocaleString() || 0 }}</p>
              <p v-if="analytics.orders?.growth !== undefined" class="text-xs mt-1" :class="getGrowthClass(analytics.orders.growth)">
                {{ formatGrowth(analytics.orders.growth) }} vs période précédente
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">{{ getFirstPeriodLabel() }}</p>
            </div>
          </div>
        </div>

        <!-- Revenus Beauté -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div class="flex items-center relative z-10">
            <div class="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">Revenus générés</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(analytics.revenue?.current || 0) }}</p>
              <p v-if="analytics.revenue?.growth !== undefined" class="text-xs mt-1" :class="getGrowthClass(analytics.revenue.growth)">
                {{ formatGrowth(analytics.revenue.growth) }} vs période précédente
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">{{ getFirstPeriodLabel() }}</p>
            </div>
          </div>
        </div>

        <!-- Taux de conversion beauté -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div class="flex items-center relative z-10">
            <div class="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">{{ getConversionLabel() }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ (analytics.conversionRate?.current || 0).toFixed(1) }}%</p>
              <p v-if="analytics.conversionRate?.previous !== undefined" class="text-xs mt-1" :class="getConversionGrowthClass()">
                {{ getConversionGrowthText() }}
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">{{ getFirstPeriodLabel() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Avancées Beauté - SEULEMENT POUR GROWTH+ -->
      <div v-if="isAdvancedPlan">
        <!-- Charts Row Beauté -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Évolution des consultations beauté -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <span class="mr-2">{{ getAnalyticsIcon() }}</span>
                Évolution des {{ getConsultationsLabel().toLowerCase() }}
              </h3>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <div class="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full"></div>
                <span>{{ getConsultationsLabel() }} quotidiennes</span>
              </div>
            </div>
            <div class="h-64">
              <canvas ref="conversationsChart"></canvas>
            </div>
          </div>

          <!-- Évolution des revenus beauté -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <span class="mr-2">💰</span>
                Évolution des revenus beauté
              </h3>
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <div class="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                <span>Revenus quotidiens (€)</span>
              </div>
            </div>
            <div class="h-64">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Analytics Row Supplémentaires Beauté -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Métriques de performance beauté -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <span class="mr-2">⚡</span>
              Métriques de performance beauté
            </h3>
            <div class="space-y-6">
              <!-- Panier moyen beauté -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ getAverageBasketLabel() }}</p>
                  <p class="text-xs text-gray-500">{{ getBasketDescription() }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-purple-600">{{ formatCurrency(detailedAnalytics.performance?.averageOrderValue || 0) }}</p>
                </div>
              </div>

              <!-- Total consultations beauté -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Total {{ getConsultationsLabel().toLowerCase() }}</p>
                  <p class="text-xs text-gray-500">Toutes périodes</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-rose-600">{{ (detailedAnalytics.performance?.totalConversations || 0).toLocaleString() }}</p>
                </div>
              </div>

              <!-- Total ventes beauté -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Total {{ getOrdersLabel().toLowerCase() }}</p>
                  <p class="text-xs text-gray-500">Toutes périodes</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-emerald-600">{{ (detailedAnalytics.performance?.totalOrders || 0).toLocaleString() }}</p>
                </div>
              </div>

              <!-- Revenus totaux beauté -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Revenus totaux beauté</p>
                  <p class="text-xs text-gray-500">Toutes périodes</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-amber-600">{{ formatCurrency(detailedAnalytics.performance?.totalRevenue || 0) }}</p>
                </div>
              </div>
            </div>

            <!-- Indicateur de performance beauté -->
            <div class="mt-6 p-4 rounded-lg" :class="getBeautyPerformanceClass()">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <span class="text-2xl">{{ getBeautyPerformanceIcon() }}</span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium" :class="getBeautyPerformanceTextClass()">{{ getBeautyPerformanceStatus() }}</p>
                  <p class="text-xs" :class="getBeautyPerformanceSubTextClass()">{{ getBeautyPerformanceMessage() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline d'activité beauté -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <span class="mr-2">🕒</span>
                Activité beauté récente
              </h3>
              <span class="text-xs text-gray-500">{{ getPeriodLabel() }}</span>
            </div>
            
            <div v-if="detailedAnalytics.conversationHistory?.length > 0 || detailedAnalytics.orderHistory?.length > 0" class="space-y-4">
              <!-- Consultations beauté récentes -->
              <div v-if="detailedAnalytics.conversationHistory?.slice(-3).length > 0">
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span class="mr-1">{{ getAnalyticsIcon() }}</span>
                  {{ getConsultationsLabel() }} récentes
                </h4>
                <div v-for="day in detailedAnalytics.conversationHistory.slice(-3)" :key="`conv-${day.date}`" class="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                  <span class="text-sm text-gray-900">{{ formatDate(day.date) }}</span>
                  <span class="text-sm font-medium text-rose-600">{{ day.count }} {{ getConsultationsLabel().toLowerCase() }}</span>
                </div>
              </div>

              <!-- Ventes beauté récentes -->
              <div v-if="detailedAnalytics.orderHistory?.slice(-3).length > 0">
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span class="mr-1">🛍️</span>
                  {{ getOrdersLabel() }} récentes
                </h4>
                <div v-for="day in detailedAnalytics.orderHistory.slice(-3)" :key="`order-${day.date}`" class="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <span class="text-sm text-gray-900">{{ formatDate(day.date) }}</span>
                  <div class="text-right">
                    <span class="text-sm font-medium text-emerald-600">{{ day.count }} {{ getOrdersLabel().toLowerCase() }}</span>
                    <p class="text-xs text-emerald-700">{{ formatCurrency(day.revenue) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8">
              <div class="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">{{ getAnalyticsIcon() }}</span>
              </div>
              <p class="mt-2 text-sm text-gray-500">Aucune activité beauté récente</p>
              <p class="text-xs text-gray-400">L'activité de {{ getConsultationsLabel().toLowerCase() }} apparaîtra ici</p>
            </div>
          </div>
        </div>

        <!-- Insights Beauté Spécialisés (Nouveau) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Top catégories beauté -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">🏆</span>
              Top catégories beauté
            </h3>
            <div class="space-y-3">
              <div v-for="category in getTopBeautyCategories()" :key="category.name" class="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div class="flex items-center">
                  <span class="text-lg mr-2">{{ category.icon }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                </div>
                <span class="text-sm font-bold text-purple-600">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Profils clients beauté -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">👥</span>
              Profils clients beauté
            </h3>
            <div class="space-y-3">
              <div v-for="profile in getBeautyClientProfiles()" :key="profile.type" class="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                <div>
                  <span class="text-sm font-medium text-gray-900">{{ profile.type }}</span>
                  <p class="text-xs text-gray-500">{{ profile.description }}</p>
                </div>
                <span class="text-sm font-bold text-amber-600">{{ profile.count }}</span>
              </div>
            </div>
          </div>

          <!-- Tendances saisonnières beauté -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span class="mr-2">📈</span>
              Tendances beauté
            </h3>
            <div class="space-y-3">
              <div v-for="trend in getBeautyTrends()" :key="trend.name" class="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                <div>
                  <span class="text-sm font-medium text-gray-900">{{ trend.name }}</span>
                  <p class="text-xs text-gray-500">{{ trend.period }}</p>
                </div>
                <span class="text-sm font-bold" :class="trend.trending === 'up' ? 'text-emerald-600' : trend.trending === 'down' ? 'text-red-600' : 'text-gray-600'">
                  {{ trend.trending === 'up' ? '↗️' : trend.trending === 'down' ? '↘️' : '→' }} {{ trend.change }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Upgrade pour Starter -->
      <div v-if="planDetails.code === 'starter'" class="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
        <!-- Décorations beauté -->
        <div class="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div class="text-6xl transform rotate-12">💄</div>
        </div>
        <div class="absolute bottom-0 left-0 w-24 h-24 opacity-20">
          <div class="text-5xl transform -rotate-12">✨</div>
        </div>
        
        <div class="flex items-center space-x-6 relative z-10">
          <div class="flex-shrink-0">
            <div class="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span class="text-2xl">📊</span>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold mb-2">
              🚀 Débloquez les Analytics Beauté Avancées
            </h3>
            <p class="text-rose-100 mb-4 text-lg">
              Passez au Plan Growth pour accéder aux insights beauté détaillés, analyses de tendances, profils clients et métriques avancées spécialisées.
            </p>
            <div class="flex flex-wrap gap-3 mb-6">
              <span class="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">📈 Tendances beauté saisonnières</span>
              <span class="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">👥 Profils clients détaillés</span>
              <span class="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">🎯 Recommandations personnalisées</span>
              <span class="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">🏆 Top catégories produits</span>
              <span class="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium">📊 Analytics prédictives</span>
            </div>
            <button 
              @click="goToBilling" 
              class="bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-colors shadow-lg"
            >
              Passer au Growth - {{ formatCurrency(149) }}/mois
              <span class="block text-sm font-normal opacity-80">Ou {{ formatCurrency(127) }}/mois facturé annuellement</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Message pour essai gratuit expiré -->
      <div v-if="planDetails.hasExpired" class="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <span class="text-xl">⚠️</span>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-red-800">Essai gratuit beauté expiré</h3>
            <p class="text-red-700 text-sm mt-1">
              Votre essai gratuit de {{ planDetails.trialDays }} jours est terminé. Choisissez un plan pour continuer à utiliser vos analytics beauté spécialisées.
            </p>
            <button 
              @click="goToBilling" 
              class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Choisir un plan beauté
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay Beauté -->
    <div v-if="loading" class="fixed inset-0 bg-gradient-to-br from-rose-900 to-pink-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="bg-white rounded-xl p-8 shadow-2xl border border-rose-200">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          <div>
            <h3 class="font-semibold text-gray-900">Chargement des analytics beauté...</h3>
            <p class="text-sm text-gray-600">Analyse de vos performances</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// META PAGE
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// TYPES
type PeriodType = '7d' | '30d' | '90d' | '1y'

// COMPOSABLES
const authStore = useAuthStore()
const api = useApi()

// COMPUTED - GESTION DES PLANS
const planDetails = computed(() => authStore.planDetails)
const isAdvancedPlan = computed(() => {
  const code = planDetails.value.code
  return ['growth', 'pro', 'professional', 'performance', 'enterprise'].includes(code)
})

// COMPUTED - BEAUTY CATEGORY
const beautyCategory = computed(() => authStore.user?.shop?.beauty_category || 'multi')

// REACTIVE STATE
const loading = ref(false)
const selectedPeriod = ref<PeriodType>('30d')
const conversationsChart = ref<HTMLCanvasElement>()
const revenueChart = ref<HTMLCanvasElement>()

// Analytics data structure
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

// ✅ MÉTHODES CONTEXTUELLES BEAUTÉ
const getAnalyticsTitle = (): string => {
  const titles: Record<string, string> = {
    'skincare': 'vos Esthéticiennes IA',
    'makeup': 'vos Expertes Maquillage IA',
    'fragrance': 'vos Conseillères Parfums IA',
    'haircare': 'vos Expertes Capillaires IA',
    'bodycare': 'vos Expertes Soins Corps IA',
    'multi': 'vos Conseillère IA'
  }
  return titles[beautyCategory.value] || titles.multi
}

const getAnalyticsIcon = (): string => {
  const icons: Record<string, string> = {
    'skincare': '✨',
    'makeup': '💄',
    'fragrance': '🌸',
    'haircare': '💇‍♀️',
    'bodycare': '🧴',
    'multi': '💋'
  }
  return icons[beautyCategory.value] || icons.multi
}

const getConsultationsLabel = (): string => {
  const labels: Record<string, string> = {
    'skincare': 'Consultations skincare',
    'makeup': 'Séances maquillage',
    'fragrance': 'Conseils parfums',
    'haircare': 'Consultations capillaires',
    'bodycare': 'Consultations bien-être',
    'multi': 'Consultations beauté'
  }
  return labels[beautyCategory.value] || labels.multi
}

const getOrdersLabel = (): string => {
  const labels: Record<string, string> = {
    'skincare': 'Routines vendues',
    'makeup': 'Looks créés',
    'fragrance': 'Parfums choisis',
    'haircare': 'Soins recommandés',
    'bodycare': 'Rituels adoptés',
    'multi': 'Produits vendus'
  }
  return labels[beautyCategory.value] || labels.multi
}

const getConversionLabel = (): string => {
  const labels: Record<string, string> = {
    'skincare': 'Taux d\'adoption routines',
    'makeup': 'Taux de création looks',
    'fragrance': 'Taux de choix parfums',
    'haircare': 'Taux de soins',
    'bodycare': 'Taux d\'adoption rituels',
    'multi': 'Taux de conversion beauté'
  }
  return labels[beautyCategory.value] || labels.multi
}

const getAverageBasketLabel = (): string => {
  const labels: Record<string, string> = {
    'skincare': 'Panier routine moyen',
    'makeup': 'Panier look moyen',
    'fragrance': 'Panier parfums moyen',
    'haircare': 'Panier soins moyen',
    'bodycare': 'Panier bien-être moyen',
    'multi': 'Panier beauté moyen'
  }
  return labels[beautyCategory.value] || labels.multi
}

const getBasketDescription = (): string => {
  const descriptions: Record<string, string> = {
    'skincare': 'Valeur routine skincare',
    'makeup': 'Valeur look complet',
    'fragrance': 'Valeur parfums',
    'haircare': 'Valeur soins capillaires',
    'bodycare': 'Valeur rituels corps',
    'multi': 'Valeur produits beauté'
  }
  return descriptions[beautyCategory.value] || descriptions.multi
}

const getFirstPeriodLabel = (): string => {
  return 'Première période d\'analyse'
}

// ✅ MÉTHODES INSIGHTS BEAUTÉ SPÉCIALISÉS
const getTopBeautyCategories = () => {
  const categoryData: Record<string, any[]> = {
    'skincare': [
      { name: 'Anti-âge', icon: '⏰', percentage: 35 },
      { name: 'Hydratation', icon: '💧', percentage: 28 },
      { name: 'Nettoyage', icon: '🧼', percentage: 20 },
      { name: 'Protection UV', icon: '☀️', percentage: 17 }
    ],
    'makeup': [
      { name: 'Teint', icon: '🎨', percentage: 40 },
      { name: 'Yeux', icon: '👁️', percentage: 30 },
      { name: 'Lèvres', icon: '💋', percentage: 20 },
      { name: 'Sourcils', icon: '🎯', percentage: 10 }
    ],
    'fragrance': [
      { name: 'Floral', icon: '🌸', percentage: 45 },
      { name: 'Fruité', icon: '🍑', percentage: 25 },
      { name: 'Boisé', icon: '🌳', percentage: 20 },
      { name: 'Oriental', icon: '🌙', percentage: 10 }
    ],
    'haircare': [
      { name: 'Réparation', icon: '🔧', percentage: 35 },
      { name: 'Hydratation', icon: '💧', percentage: 30 },
      { name: 'Volume', icon: '🎈', percentage: 20 },
      { name: 'Lissage', icon: '➡️', percentage: 15 }
    ],
    'bodycare': [
      { name: 'Hydratation', icon: '💧', percentage: 40 },
      { name: 'Exfoliation', icon: '🧽', percentage: 25 },
      { name: 'Anti-âge corps', icon: '⏰', percentage: 20 },
      { name: 'Parfumés', icon: '🌺', percentage: 15 }
    ],
    'multi': [
      { name: 'Skincare', icon: '✨', percentage: 40 },
      { name: 'Maquillage', icon: '💄', percentage: 30 },
      { name: 'Parfums', icon: '🌸', percentage: 20 },
      { name: 'Soins corps', icon: '🧴', percentage: 10 }
    ]
  }
  
  return categoryData[beautyCategory.value] || categoryData.multi
}

const getBeautyClientProfiles = () => {
  const profileData: Record<string, any[]> = {
    'skincare': [
      { type: 'Peau mixte', description: '25-35 ans', count: 45 },
      { type: 'Peau mature', description: '40+ ans', count: 32 },
      { type: 'Peau sensible', description: 'Tous âges', count: 23 }
    ],
    'makeup': [
      { type: 'Débutantes', description: '18-25 ans', count: 38 },
      { type: 'Expertes', description: '25-40 ans', count: 42 },
      { type: 'Occasionnelles', description: '30+ ans', count: 20 }
    ],
    'fragrance': [
      { type: 'Classiques', description: 'Fidèles marques', count: 40 },
      { type: 'Exploratrices', description: 'Nouveautés', count: 35 },
      { type: 'Saisonnières', description: 'Selon saisons', count: 25 }
    ],
    'haircare': [
      { type: 'Cheveux abîmés', description: 'Réparation', count: 45 },
      { type: 'Cheveux bouclés', description: 'Définition', count: 30 },
      { type: 'Cheveux fins', description: 'Volume', count: 25 }
    ],
    'bodycare': [
      { type: 'Routine complète', description: 'Quotidienne', count: 40 },
      { type: 'Occasionnelles', description: 'Week-ends', count: 35 },
      { type: 'Spécialisées', description: 'Problèmes ciblés', count: 25 }
    ],
    'multi': [
      { type: 'Multi-produits', description: 'Tous besoins', count: 40 },
      { type: 'Spécialisées', description: 'Un domaine', count: 35 },
      { type: 'Découverte', description: 'Exploration', count: 25 }
    ]
  }
  
  return profileData[beautyCategory.value] || profileData.multi
}

const getBeautyTrends = () => {
  const trendData: Record<string, any[]> = {
    'skincare': [
      { name: 'Skincare minimaliste', period: 'Ce mois', trending: 'up', change: '+15%' },
      { name: 'Acides naturels', period: 'Cette semaine', trending: 'up', change: '+8%' },
      { name: 'Anti-pollution', period: 'Ce trimestre', trending: 'stable', change: '→' }
    ],
    'makeup': [
      { name: 'No-makeup makeup', period: 'Ce mois', trending: 'up', change: '+20%' },
      { name: 'Lèvres glossy', period: 'Cette semaine', trending: 'up', change: '+12%' },
      { name: 'Smoky coloré', period: 'Ce trimestre', trending: 'down', change: '-5%' }
    ],
    'fragrance': [
      { name: 'Parfums unisexes', period: 'Ce mois', trending: 'up', change: '+18%' },
      { name: 'Notes marines', period: 'Cette saison', trending: 'up', change: '+10%' },
      { name: 'Parfums poudrés', period: 'Ce trimestre', trending: 'stable', change: '→' }
    ],
    'haircare': [
      { name: 'Hair oiling', period: 'Ce mois', trending: 'up', change: '+25%' },
      { name: 'Curl enhancing', period: 'Cette semaine', trending: 'up', change: '+15%' },
      { name: 'Masques overnight', period: 'Ce trimestre', trending: 'up', change: '+8%' }
    ],
    'bodycare': [
      { name: 'Body slugging', period: 'Ce mois', trending: 'up', change: '+22%' },
      { name: 'Exfoliants doux', period: 'Cette semaine', trending: 'up', change: '+10%' },
      { name: 'Parfums corporels', period: 'Ce trimestre', trending: 'stable', change: '→' }
    ],
    'multi': [
      { name: 'Routines hybrid', period: 'Ce mois', trending: 'up', change: '+18%' },
      { name: 'Clean beauty', period: 'Cette semaine', trending: 'up', change: '+12%' },
      { name: 'Multi-usage', period: 'Ce trimestre', trending: 'up', change: '+6%' }
    ]
  }
  
  return trendData[beautyCategory.value] || trendData.multi
}

// ✅ MÉTHODES PERFORMANCE BEAUTÉ
const getBeautyPerformanceClass = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
  if (rate >= 8) return 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
  return 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
}

const getBeautyPerformanceIcon = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return '🏆'
  if (rate >= 8) return '⚡'
  return '📈'
}

const getBeautyPerformanceTextClass = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'text-emerald-800'
  if (rate >= 8) return 'text-amber-800'
  return 'text-red-800'
}

const getBeautyPerformanceSubTextClass = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'text-emerald-700'
  if (rate >= 8) return 'text-amber-700'
  return 'text-red-700'
}

const getBeautyPerformanceStatus = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  if (rate >= 15) return 'Performance beauté excellente'
  if (rate >= 8) return 'Performance beauté correcte'
  return 'Performance beauté à améliorer'
}

const getBeautyPerformanceMessage = (): string => {
  const rate = analytics.value.conversionRate?.current || 0
  const agentType = getAnalyticsTitle()
  
  if (rate >= 15) return `${agentType} convertissent parfaitement`
  if (rate >= 8) return 'Optimisation beauté recommandée'
  return 'Formation beauté nécessaire'
}

// ✅ UTILITY METHODS (INCHANGÉES)
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
  if (growth > 0) return 'text-emerald-600'
  if (growth < 0) return 'text-red-600'
  return 'text-gray-500'
}

const getConversionGrowthClass = (): string => {
  const current = analytics.value.conversionRate?.current || 0
  const previous = analytics.value.conversionRate?.previous || 0
  
  if (current > previous) return 'text-emerald-600'
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

// ✅ API CALLS (INCHANGÉES)
const loadAnalytics = async () => {
  if (!authStore.isAuthenticated) {
    console.warn('❌ Utilisateur non authentifié')
    return
  }

  loading.value = true
  
  try {
    console.log('🔄 Chargement analytics beauté via API...')

    const dashboardResponse = await api.analytics.dashboard()
    
    if (dashboardResponse.success && dashboardResponse.data) {
      analytics.value = dashboardResponse.data
      console.log('✅ Analytics beauté de base chargées:', analytics.value)
    } else {
      console.error('❌ Erreur analytics beauté de base:', dashboardResponse.error)
    }

    if (isAdvancedPlan.value) {
      console.log('📊 Chargement analytics beauté détaillées pour Plan Growth+...')
      
      const detailedResponse = await api.analytics.detailed({ 
        period: selectedPeriod.value as PeriodType
      })
      
      if (detailedResponse.success && detailedResponse.data) {
        detailedAnalytics.value = detailedResponse.data
        console.log('✅ Analytics beauté détaillées chargées:', detailedAnalytics.value)
        
        await nextTick()
        drawBeautyCharts()
      } else {
        console.error('❌ Erreur analytics beauté détaillées:', detailedResponse.error)
      }
    }

  } catch (error: any) {
    console.error('❌ Erreur lors du chargement des analytics beauté:', error)
    
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

// ✅ GRAPHIQUES BEAUTÉ
const drawBeautyCharts = () => {
  if (!isAdvancedPlan.value) return
  
  drawBeautyConversationsChart()
  drawBeautyRevenueChart()
}

const drawBeautyConversationsChart = () => {
  const canvas = conversationsChart.value
  if (!canvas || !detailedAnalytics.value.conversationHistory?.length) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Configuration beauté
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  const data = detailedAnalytics.value.conversationHistory
  const maxValue = Math.max(...data.map((d: any) => d.count), 1)
  const adjustedMaxValue = maxValue * 1.1
  const padding = 40
  const width = rect.width - padding * 2
  const height = rect.height - padding * 2

  ctx.clearRect(0, 0, rect.width, rect.height)

  // Axes beauté
  ctx.strokeStyle = '#F3F4F6'
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
    // Courbe beauté avec gradient rose-pink
    ctx.strokeStyle = '#E91E63'
    ctx.fillStyle = 'rgba(233, 30, 99, 0.1)'
    ctx.lineWidth = 3

    const stepX = width / (data.length - 1)
    
    // Remplissage gradient
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

    // Ligne principale
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

    // Points avec style beauté
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
    gradient.addColorStop(0, '#E91E63')
    gradient.addColorStop(1, '#F06292')
    ctx.fillStyle = gradient
    
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.count / adjustedMaxValue * height)
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
      
      // Halo beauté
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(233, 30, 99, 0.3)'
      ctx.lineWidth = 2
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.stroke()
    })
  }
}

const drawBeautyRevenueChart = () => {
  const canvas = revenueChart.value
  if (!canvas || !detailedAnalytics.value.orderHistory?.length) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  const data = detailedAnalytics.value.orderHistory
  const maxValue = Math.max(...data.map((d: any) => d.revenue), 1)
  const adjustedMaxValue = maxValue * 1.1
  const padding = 40
  const width = rect.width - padding * 2
  const height = rect.height - padding * 2

  ctx.clearRect(0, 0, rect.width, rect.height)

  ctx.strokeStyle = '#F3F4F6'
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
    // Courbe revenus avec gradient emerald-teal
    ctx.strokeStyle = '#10B981'
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
    ctx.lineWidth = 3

    const stepX = width / (data.length - 1)
    
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

    // Points revenus avec style emerald
    ctx.fillStyle = '#10B981'
    data.forEach((point: any, index: number) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.revenue / adjustedMaxValue * height)
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI)
      ctx.fill()
      
      // Halo revenus
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)'
      ctx.lineWidth = 2
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.stroke()
    })
  }
}

const refreshAnalytics = async () => {
  await loadAnalytics()
}

// NAVIGATION
const goToBilling = async () => {
  await navigateTo('/billing')
}

// LIFECYCLE
onMounted(() => {
  loadAnalytics()
})

// SEO
useHead({
  title: 'Analytics Beauté - ChatSeller Dashboard',
  meta: [
    { name: 'description', content: 'Suivez les performances de vos Conseillère IA ChatSeller' }
  ]
})
</script>

<style scoped>
/* Animations beauté */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hover effects beauté */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(233, 30, 99, 0.1), 0 2px 4px -1px rgba(233, 30, 99, 0.06);
}

.transition-shadow {
  transition: box-shadow 0.15s ease-in-out;
}

.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.transition-all {
  transition: all 0.15s ease-in-out;
}

/* Canvas responsive beauté */
canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Styles beauté personnalisés */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Responsive */
@media (max-width: 768px) {
  .px-8 {
    @apply px-4;
  }
  
  .p-8 {
    @apply p-4;
  }
  
  .gap-6 {
    @apply gap-4;
  }
  
  .text-3xl {
    @apply text-2xl;
  }
}

@media (max-width: 640px) {
  .grid-cols-4 {
    @apply grid-cols-2;
  }
  
  .lg\:grid-cols-2 {
    @apply grid-cols-1;
  }
  
  .lg\:grid-cols-3 {
    @apply grid-cols-1;
  }
}
</style>