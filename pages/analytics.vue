<!-- pages/analytics.vue - VERSION AVEC VRAIES DONNÉES SUPABASE -->
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
            </p>
          </div>
          
          <!-- Actions Toolbar -->
          <div class="flex items-center space-x-4">
            <select 
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
      <!-- KPI Cards -->
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
              <p class="text-2xl font-bold text-gray-900">{{ analytics.totalConversations.toLocaleString() }}</p>
              <p class="text-xs text-blue-600 mt-1" v-if="analytics.conversationsGrowth !== null">
                {{ analytics.conversationsGrowth >= 0 ? '+' : '' }}{{ analytics.conversationsGrowth.toFixed(1) }}% vs période précédente
              </p>
              <p class="text-xs text-gray-500 mt-1" v-else>Pas de données précédentes</p>
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
              <p class="text-2xl font-bold text-gray-900">{{ analytics.completedOrders.toLocaleString() }}</p>
              <p class="text-xs text-green-600 mt-1" v-if="analytics.ordersGrowth !== null">
                {{ analytics.ordersGrowth >= 0 ? '+' : '' }}{{ analytics.ordersGrowth.toFixed(1) }}% vs période précédente
              </p>
              <p class="text-xs text-gray-500 mt-1" v-else>Pas de données précédentes</p>
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
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(analytics.totalRevenue) }}</p>
              <p class="text-xs text-yellow-600 mt-1" v-if="analytics.revenueGrowth !== null">
                {{ analytics.revenueGrowth >= 0 ? '+' : '' }}{{ analytics.revenueGrowth.toFixed(1) }}% vs période précédente
              </p>
              <p class="text-xs text-gray-500 mt-1" v-else>Pas de données précédentes</p>
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
              <p class="text-2xl font-bold text-gray-900">{{ analytics.conversionRate.toFixed(1) }}%</p>
              <p class="text-xs text-purple-600 mt-1" v-if="analytics.conversionGrowth !== null">
                {{ analytics.conversionGrowth >= 0 ? '+' : '' }}{{ analytics.conversionGrowth.toFixed(1) }}% vs période précédente
              </p>
              <p class="text-xs text-gray-500 mt-1" v-else>Pas de données précédentes</p>
            </div>
          </div>
        </div>
      </div>

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
        <!-- Top Products -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Produits les plus vendus</h3>
            <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ getPeriodLabel() }}</span>
          </div>
          
          <div v-if="analytics.topProducts.length > 0" class="space-y-4">
            <div 
              v-for="(product, index) in analytics.topProducts" 
              :key="product.name || index" 
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-medium mr-3">
                  {{ index + 1 }}
                </div>
                <span class="text-sm font-medium text-gray-900">{{ product.name || 'Produit sans nom' }}</span>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ formatCurrency(product.revenue) }}</p>
                <p class="text-xs text-gray-500">{{ product.orders }} commandes</p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Aucune vente enregistrée</p>
            <p class="text-xs text-gray-400">Les ventes apparaîtront ici une fois configurées</p>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Métriques de performance</h3>
          <div class="space-y-6">
            <!-- Messages par conversation -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Messages/conversation</p>
                <p class="text-xs text-gray-500">Engagement moyen</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-blue-600">{{ analytics.avgMessagesPerConversation.toFixed(1) }}</p>
              </div>
            </div>

            <!-- Durée moyenne conversation -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Durée conversation</p>
                <p class="text-xs text-gray-500">Temps moyen</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600">{{ formatDuration(analytics.avgConversationDuration) }}</p>
              </div>
            </div>

            <!-- Panier moyen -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Panier moyen</p>
                <p class="text-xs text-gray-500">Valeur commande</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-purple-600">{{ formatCurrency(analytics.avgOrderValue) }}</p>
              </div>
            </div>

            <!-- Conversations converties -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">Conversions totales</p>
                <p class="text-xs text-gray-500">Visiteurs convertis</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-yellow-600">{{ analytics.convertedConversations }}</p>
              </div>
            </div>
          </div>

          <!-- Performance Indicator -->
          <div class="mt-6 p-4 rounded-lg" :class="getPerformanceClass()">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5" :class="getPerformanceIconClass()" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="analytics.conversionRate >= 15" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  <path v-else-if="analytics.conversionRate >= 5" fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
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
      </div>

      <!-- Agents & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Agents Performance -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Performance par agent</h3>
            <span class="text-xs text-gray-500">{{ analytics.agentPerformance.length }} agent(s)</span>
          </div>
          
          <div v-if="analytics.agentPerformance.length > 0" class="space-y-4">
            <div 
              v-for="agent in analytics.agentPerformance" 
              :key="agent.id" 
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <img v-if="agent.avatar" :src="agent.avatar" :alt="agent.name" class="w-10 h-10 rounded-full mr-3">
                <div v-else class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span class="text-sm font-medium text-white">{{ getInitials(agent.name) }}</span>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-900">{{ agent.name }}</span>
                  <p class="text-xs text-gray-500 capitalize">{{ agent.type }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="text-sm text-gray-600">{{ agent.conversations }} conv.</p>
                  <p class="text-xs text-gray-500">{{ agent.conversionRate.toFixed(1) }}% conv.</p>
                </div>
                <div class="w-2 h-8 rounded-full" :class="getAgentPerformanceColor(agent.conversionRate)"></div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 0112 0v1h-9M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Aucun agent configuré</p>
            <p class="text-xs text-gray-400">Créez votre premier vendeur IA</p>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Activité récente</h3>
            <span class="text-xs text-gray-500">{{ analytics.recentActivity.length }} événement(s)</span>
          </div>
          
          <div v-if="analytics.recentActivity.length > 0" class="space-y-4">
            <div 
              v-for="activity in analytics.recentActivity" 
              :key="activity.id" 
              class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="activity.type === 'order'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
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
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useSupabase } from '~~/composables/useSupabase'

// ✅ CORRECTION META PAGE
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES
interface AnalyticsData {
  totalConversations: number
  conversationsGrowth: number | null
  completedOrders: number
  ordersGrowth: number | null
  totalRevenue: number
  revenueGrowth: number | null
  conversionRate: number
  conversionGrowth: number | null
  convertedConversations: number
  avgMessagesPerConversation: number
  avgConversationDuration: number
  avgOrderValue: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
  }>
  agentPerformance: Array<{
    id: string
    name: string
    type: string
    avatar: string
    conversations: number
    conversionRate: number
  }>
  recentActivity: Array<{
    id: string
    type: string
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
const supabase = useSupabase()

// ✅ REACTIVE STATE
const loading = ref(false)
const selectedPeriod = ref('30d')
const conversationsChart = ref<HTMLCanvasElement>()
const revenueChart = ref<HTMLCanvasElement>()

const analytics = ref<AnalyticsData>({
  totalConversations: 0,
  conversationsGrowth: null,
  completedOrders: 0,
  ordersGrowth: null,
  totalRevenue: 0,
  revenueGrowth: null,
  conversionRate: 0,
  conversionGrowth: null,
  convertedConversations: 0,
  avgMessagesPerConversation: 0,
  avgConversationDuration: 0,
  avgOrderValue: 0,
  topProducts: [],
  agentPerformance: [],
  recentActivity: [],
  conversationsByDay: [],
  revenueByDay: []
})

// ✅ UTILITY METHODS
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`
  return `${Math.round(seconds / 3600)}h`
}

const formatTime = (date: string): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
  if (diffInMinutes < 24 * 60) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const getPeriodLabel = (): string => {
  switch (selectedPeriod.value) {
    case '7d': return '7 derniers jours'
    case '30d': return '30 derniers jours'
    case '90d': return '90 derniers jours'
    default: return '30 derniers jours'
  }
}

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getAgentPerformanceColor = (rate: number): string => {
  if (rate >= 20) return 'bg-green-500'
  if (rate >= 10) return 'bg-yellow-500'
  if (rate >= 5) return 'bg-orange-500'
  return 'bg-red-500'
}

const getPerformanceClass = (): string => {
  if (analytics.value.conversionRate >= 15) return 'bg-green-50 border border-green-200'
  if (analytics.value.conversionRate >= 5) return 'bg-yellow-50 border border-yellow-200'
  return 'bg-red-50 border border-red-200'
}

const getPerformanceIconClass = (): string => {
  if (analytics.value.conversionRate >= 15) return 'text-green-400'
  if (analytics.value.conversionRate >= 5) return 'text-yellow-400'
  return 'text-red-400'
}

const getPerformanceTextClass = (): string => {
  if (analytics.value.conversionRate >= 15) return 'text-green-800'
  if (analytics.value.conversionRate >= 5) return 'text-yellow-800'
  return 'text-red-800'
}

const getPerformanceSubTextClass = (): string => {
  if (analytics.value.conversionRate >= 15) return 'text-green-700'
  if (analytics.value.conversionRate >= 5) return 'text-yellow-700'
  return 'text-red-700'
}

const getPerformanceStatus = (): string => {
  if (analytics.value.conversionRate >= 15) return 'Performance excellente'
  if (analytics.value.conversionRate >= 5) return 'Performance correcte'
  return 'Performance à améliorer'
}

const getPerformanceMessage = (): string => {
  if (analytics.value.conversionRate >= 15) return 'Votre agent convertit très bien'
  if (analytics.value.conversionRate >= 5) return 'Il y a une marge d\'amélioration'
  return 'Optimisation fortement recommandée'
}

// ✅ FONCTIONS DE REQUÊTE SUPABASE
const getDaysFromPeriod = (period: string): number => {
  switch (period) {
    case '7d': return 7
    case '30d': return 30
    case '90d': return 90
    default: return 30
  }
}

const getDateRange = (days: number) => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  }
}

const generateEmptyDailyData = (days: number, type: 'count' | 'revenue' = 'count') => {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    if (type === 'revenue') {
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: 0
      })
    } else {
      data.push({
        date: date.toISOString().split('T')[0],
        count: 0
      })
    }
  }
  
  return data
}

// ✅ CHARGEMENT DES VRAIES DONNÉES SUPABASE
const loadAnalytics = async () => {
  if (!authStore.userShopId) {
    console.warn('❌ Pas de shop_id disponible')
    return
  }

  loading.value = true
  
  try {
    const shopId = authStore.userShopId
    const days = getDaysFromPeriod(selectedPeriod.value)
    const { startDate, endDate } = getDateRange(days)

    console.log('🔄 Chargement analytics pour:', { shopId, period: selectedPeriod.value, days })

    // ✅ REQUÊTES PARALLÈLES POUR OPTIMISER LA PERFORMANCE
    const [
      conversationsResult,
      ordersResult,
      messagesResult,
      agentsResult
    ] = await Promise.all([
      // 1. Conversations de la période
      supabase
        .from('conversations')
        .select('id, started_at, completed_at, conversion_completed')
        .eq('shop_id', shopId)
        .gte('started_at', startDate)
        .lte('started_at', endDate),

      // 2. Commandes de la période
      supabase
        .from('orders')
        .select('id, total_amount, created_at, product_items')
        .eq('shop_id', shopId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .neq('status', 'cancelled'),

      // 3. Messages pour calculer les moyennes
      supabase
        .from('messages')
        .select('conversation_id, created_at')
        .in('conversation_id', []), // On récupérera les IDs après

      // 4. Agents actifs
      supabase
        .from('agents')
        .select('id, name, type, avatar, total_conversations, total_conversions')
        .eq('shop_id', shopId)
        .eq('is_active', true)
    ])

    // Vérifier les erreurs
    if (conversationsResult.error) {
      console.error('❌ Erreur conversations:', conversationsResult.error)
    }
    if (ordersResult.error) {
      console.error('❌ Erreur orders:', ordersResult.error)
    }
    if (agentsResult.error) {
      console.error('❌ Erreur agents:', agentsResult.error)
    }

    const conversations = conversationsResult.data || []
    const orders = ordersResult.data || []
    const agents = agentsResult.data || []

    console.log('📊 Données récupérées:', {
      conversations: conversations.length,
      orders: orders.length,
      agents: agents.length
    })

    // ✅ CALCULER LES MÉTRIQUES PRINCIPALES
    const totalConversations = conversations.length
    const completedOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)
    const conversionRate = totalConversations > 0 ? (completedOrders / totalConversations) * 100 : 0
    const convertedConversations = conversations.filter(c => c.conversion_completed).length

    // ✅ CALCULER LES DONNÉES QUOTIDIENNES
    const conversationsByDay = generateDailyConversations(conversations, days)
    const revenueByDay = generateDailyRevenue(orders, days)

    // ✅ TOP PRODUITS
    const topProducts = calculateTopProducts(orders)

    // ✅ PERFORMANCE DES AGENTS
    const agentPerformance = agents.map(agent => ({
      id: agent.id,
      name: agent.name || 'Agent sans nom',
      type: agent.type || 'general',
      avatar: agent.avatar || '',
      conversations: agent.total_conversations || 0,
      conversionRate: agent.total_conversations > 0 
        ? ((agent.total_conversions || 0) / agent.total_conversations) * 100 
        : 0
    }))

    // ✅ CALCULER LES MÉTRIQUES AVANCÉES
    const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0
    const avgMessagesPerConversation = await calculateAvgMessages(shopId, conversations)
    const avgConversationDuration = calculateAvgDuration(conversations)

    // ✅ ACTIVITÉ RÉCENTE
    const recentActivity = generateRecentActivity(conversations, orders)

    // ✅ CALCULER LA CROISSANCE (période précédente)
    const previousPeriodData = await calculatePreviousPeriodGrowth(shopId, days)

    // ✅ METTRE À JOUR LES DONNÉES
    analytics.value = {
      totalConversations,
      conversationsGrowth: previousPeriodData.conversationsGrowth,
      completedOrders,
      ordersGrowth: previousPeriodData.ordersGrowth,
      totalRevenue,
      revenueGrowth: previousPeriodData.revenueGrowth,
      conversionRate,
      conversionGrowth: previousPeriodData.conversionGrowth,
      convertedConversations,
      avgMessagesPerConversation,
      avgConversationDuration,
      avgOrderValue,
      topProducts,
      agentPerformance,
      recentActivity,
      conversationsByDay,
      revenueByDay
    }

    // Dessiner les graphiques après mise à jour des données
    await nextTick()
    drawCharts()
    
    console.log('✅ Analytics chargées avec succès:', analytics.value)

  } catch (error: any) {
    console.error('❌ Erreur lors du chargement des analytics:', error)
    
    // ✅ DONNÉES PAR DÉFAUT EN CAS D'ERREUR (tout à 0)
    const days = getDaysFromPeriod(selectedPeriod.value)
    analytics.value = {
      totalConversations: 0,
      conversationsGrowth: null,
      completedOrders: 0,
      ordersGrowth: null,
      totalRevenue: 0,
      revenueGrowth: null,
      conversionRate: 0,
      conversionGrowth: null,
      convertedConversations: 0,
      avgMessagesPerConversation: 0,
      avgConversationDuration: 0,
      avgOrderValue: 0,
      topProducts: [],
      agentPerformance: [],
      recentActivity: [],
      conversationsByDay: generateEmptyDailyData(days),
      revenueByDay: generateEmptyDailyData(days, 'revenue')
    }

    await nextTick()
    drawCharts()
  } finally {
    loading.value = false
  }
}

// ✅ FONCTIONS UTILITAIRES POUR TRAITER LES DONNÉES
const generateDailyConversations = (conversations: any[], days: number) => {
  const dailyData = generateEmptyDailyData(days)
  
  conversations.forEach(conv => {
    const date = new Date(conv.started_at).toISOString().split('T')[0]
    const dayData = dailyData.find(d => d.date === date)
    if (dayData) {
      dayData.count++
    }
  })
  
  return dailyData
}

const generateDailyRevenue = (orders: any[], days: number) => {
  const dailyData = generateEmptyDailyData(days, 'revenue')
  
  orders.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0]
    const dayData = dailyData.find(d => d.date === date)
    if (dayData) {
      dayData.revenue += parseFloat(order.total_amount) || 0
    }
  })
  
  return dailyData
}

const calculateTopProducts = (orders: any[]) => {
  const productStats: { [key: string]: { orders: number, revenue: number } } = {}
  
  orders.forEach(order => {
    if (order.product_items && Array.isArray(order.product_items)) {
      order.product_items.forEach((item: any) => {
        const productName = item.name || item.product_name || 'Produit sans nom'
        if (!productStats[productName]) {
          productStats[productName] = { orders: 0, revenue: 0 }
        }
        productStats[productName].orders += 1
        productStats[productName].revenue += parseFloat(item.price || item.total) || 0
      })
    } else {
      // Si pas de product_items, utiliser les données de la commande
      const productName = 'Commande générale'
      if (!productStats[productName]) {
        productStats[productName] = { orders: 0, revenue: 0 }
      }
      productStats[productName].orders += 1
      productStats[productName].revenue += parseFloat(order.total_amount) || 0
    }
  })
  
  return Object.entries(productStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}

const calculateAvgMessages = async (shopId: string, conversations: any[]) => {
  if (conversations.length === 0) return 0
  
  try {
    const conversationIds = conversations.map(c => c.id)
    if (conversationIds.length === 0) return 0

    const { data: messages, error } = await supabase
      .from('messages')
      .select('conversation_id')
      .in('conversation_id', conversationIds)
    
    if (error) {
      console.warn('⚠️ Erreur calcul messages moyens:', error)
      return 0
    }
    
    return messages ? messages.length / conversations.length : 0
  } catch (error) {
    console.warn('⚠️ Erreur calcul messages moyens:', error)
    return 0
  }
}

const calculateAvgDuration = (conversations: any[]) => {
  const completedConversations = conversations.filter(c => c.completed_at && c.started_at)
  
  if (completedConversations.length === 0) return 0
  
  const totalDuration = completedConversations.reduce((sum, conversation) => {
    const start = new Date(conversation.started_at).getTime()
    const end = new Date(conversation.completed_at).getTime()
    return sum + (end - start) / 1000 // en secondes
  }, 0)
  
  return totalDuration / completedConversations.length
}

const generateRecentActivity = (conversations: any[], orders: any[]) => {
  const activities = []
  
  // Dernières commandes
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)
  
  recentOrders.forEach(order => {
    activities.push({
      id: `order-${order.id}`,
      type: 'order',
      title: 'Nouvelle commande',
      description: `Commande de ${formatCurrency(parseFloat(order.total_amount) || 0)} générée`,
      timestamp: order.created_at
    })
  })
  
  // Dernières conversions
  const recentConversions = conversations
    .filter(c => c.conversion_completed)
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, 2)
  
  recentConversions.forEach(conv => {
    activities.push({
      id: `conv-${conv.id}`,
      type: 'conversion',
      title: 'Conversion réussie',
      description: 'Un visiteur a été converti en client',
      timestamp: conv.completed_at || conv.started_at
    })
  })
  
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
}

const calculatePreviousPeriodGrowth = async (shopId: string, days: number) => {
  try {
    const previousEndDate = new Date()
    previousEndDate.setDate(previousEndDate.getDate() - days)
    const previousStartDate = new Date()
    previousStartDate.setDate(previousStartDate.getDate() - (days * 2))
    
    const [prevConversations, prevOrders] = await Promise.all([
      supabase
        .from('conversations')
        .select('id, conversion_completed')
        .eq('shop_id', shopId)
        .gte('started_at', previousStartDate.toISOString())
        .lt('started_at', previousEndDate.toISOString()),
      
      supabase
        .from('orders')
        .select('id, total_amount')
        .eq('shop_id', shopId)
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', previousEndDate.toISOString())
        .neq('status', 'cancelled')
    ])
    
    if (prevConversations.error || prevOrders.error) {
      return { conversationsGrowth: null, ordersGrowth: null, revenueGrowth: null, conversionGrowth: null }
    }
    
    const prevConvCount = (prevConversations.data || []).length
    const prevOrderCount = (prevOrders.data || []).length
    const prevRevenue = (prevOrders.data || []).reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)
    const prevConversionRate = prevConvCount > 0 ? (prevOrderCount / prevConvCount) * 100 : 0
    
    const currentConvCount = analytics.value.totalConversations
    const currentOrderCount = analytics.value.completedOrders
    const currentRevenue = analytics.value.totalRevenue
    const currentConversionRate = analytics.value.conversionRate
    
    return {
      conversationsGrowth: prevConvCount > 0 ? ((currentConvCount - prevConvCount) / prevConvCount) * 100 : null,
      ordersGrowth: prevOrderCount > 0 ? ((currentOrderCount - prevOrderCount) / prevOrderCount) * 100 : null,
      revenueGrowth: prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : null,
      conversionGrowth: prevConversionRate > 0 ? ((currentConversionRate - prevConversionRate) / prevConversionRate) * 100 : null
    }
  } catch (error) {
    console.warn('⚠️ Erreur calcul croissance:', error)
    return { conversationsGrowth: null, ordersGrowth: null, revenueGrowth: null, conversionGrowth: null }
  }
}

// ✅ GRAPHIQUES AVEC CANVAS
const drawCharts = () => {
  drawConversationsChart()
  drawRevenueChart()
}

const drawConversationsChart = () => {
  const canvas = conversationsChart.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Configurer le canvas
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  // Données
  const data = analytics.value.conversationsByDay
  const maxValue = Math.max(...data.map(d => d.count)) || 1 // Éviter division par 0
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

  // Dessiner la courbe seulement s'il y a des données
  if (data.length > 1 && maxValue > 0) {
    ctx.strokeStyle = '#3B82F6'
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
    ctx.lineWidth = 2

    ctx.beginPath()
    const stepX = width / (data.length - 1)
    
    // Ligne de base pour le remplissage
    ctx.moveTo(padding, rect.height - padding)
    
    // Points de la courbe
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.count / adjustedMaxValue * height)
      
      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Fermer le remplissage
    const lastX = padding + (data.length - 1) * stepX
    ctx.lineTo(lastX, rect.height - padding)
    ctx.closePath()
    ctx.fill()

    // Tracer la ligne
    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.count / adjustedMaxValue * height)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Points sur la courbe
    ctx.fillStyle = '#3B82F6'
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.count / adjustedMaxValue * height)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  } else {
    // Afficher "Aucune donnée" si pas de données
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '14px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Aucune donnée disponible', rect.width / 2, rect.height / 2)
  }
}

const drawRevenueChart = () => {
  const canvas = revenueChart.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Configurer le canvas
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'

  // Données
  const data = analytics.value.revenueByDay
  const maxValue = Math.max(...data.map(d => d.revenue)) || 1 // Éviter division par 0
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

  // Dessiner la courbe seulement s'il y a des données
  if (data.length > 1 && maxValue > 0) {
    ctx.strokeStyle = '#10B981'
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
    ctx.lineWidth = 2

    ctx.beginPath()
    const stepX = width / (data.length - 1)
    
    // Ligne de base pour le remplissage
    ctx.moveTo(padding, rect.height - padding)
    
    // Points de la courbe
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.revenue / adjustedMaxValue * height)
      
      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Fermer le remplissage
    const lastX = padding + (data.length - 1) * stepX
    ctx.lineTo(lastX, rect.height - padding)
    ctx.closePath()
    ctx.fill()

    // Tracer la ligne
    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.revenue / adjustedMaxValue * height)
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Points sur la courbe
    ctx.fillStyle = '#10B981'
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = rect.height - padding - (point.revenue / adjustedMaxValue * height)
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  } else {
    // Afficher "Aucune donnée" si pas de données
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '14px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Aucune donnée disponible', rect.width / 2, rect.height / 2)
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