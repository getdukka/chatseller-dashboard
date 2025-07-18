<!-- pages/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Header de bienvenue -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold flex items-center">
            Bonjour Marchand ! 👋
          </h1>
          <p class="text-blue-100 mt-1">
            Voici un aperçu de votre Agent IA Commercial aujourd'hui !
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <button
            @click="refreshData"
            :disabled="loading"
            class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
            Actualiser
          </button>
          
          <button
            @click="configureAgent"
            class="bg-white text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center font-medium"
          >
            <Cog6ToothIcon class="h-4 w-4 mr-2" />
            Configurer
          </button>
        </div>
      </div>
    </div>

    <!-- Statut du widget -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-lg font-semibold text-gray-900">Widget actif</span>
          </div>
          <span class="text-sm text-gray-500">
            Dernière activité il y a 2 minutes
          </span>
        </div>
        
        <div class="flex items-center space-x-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ stats.todayViews }}</div>
            <div class="text-sm text-gray-500">Vues aujourd'hui</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ stats.todayClicks }}</div>
            <div class="text-sm text-gray-500">Clics aujourd'hui</div>
          </div>
        </div>
        
        <button
          @click="previewWidget"
          class="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
        >
          <EyeIcon class="h-4 w-4 mr-2" />
          Aperçu
        </button>
      </div>
    </div>

    <!-- Métriques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="p-3 bg-blue-50 rounded-xl">
            <ChatBubbleLeftRightIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Conversations totales</p>
            <p class="text-2xl font-bold text-gray-900">{{ metrics.totalConversations }}</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ metrics.conversationsGrowth }}% vs hier
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="p-3 bg-green-50 rounded-xl">
            <CheckCircleIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Taux de conversion</p>
            <p class="text-2xl font-bold text-gray-900">{{ metrics.conversionRate }}%</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ metrics.conversionGrowth }}% vs hier
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="p-3 bg-purple-50 rounded-xl">
            <CurrencyDollarIcon class="h-6 w-6 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Revenus générés</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metrics.revenue) }}</p>
            <p class="text-xs text-green-600 flex items-center mt-1">
              <ArrowTrendingUpIcon class="h-3 w-3 mr-1" />
              {{ metrics.revenueGrowth }}% vs hier
            </p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="p-3 bg-orange-50 rounded-xl">
            <ShoppingBagIcon class="h-6 w-6 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Panier moyen</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(metrics.averageOrder) }}</p>
            <p class="text-xs text-red-600 flex items-center mt-1">
              <ArrowTrendingDownIcon class="h-3 w-3 mr-1" />
              {{ metrics.averageOrderGrowth }}% vs hier
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sections côte à côte -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Activité récente -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Activité récente</h3>
            <NuxtLink
              to="/conversations"
              class="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Voir tout →
            </NuxtLink>
          </div>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div :class="['p-2 rounded-lg', getActivityIconClass(activity.type)]">
                <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-500">{{ activity.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
              <div v-if="activity.amount" class="text-right">
                <p class="text-sm font-medium text-green-600">{{ formatCurrency(activity.amount) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions rapides -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Actions rapides</h3>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4">
            <button
              @click="navigateTo('/settings')"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
            >
              <div class="p-2 bg-blue-50 rounded-lg">
                <Cog6ToothIcon class="h-5 w-5 text-blue-600" />
              </div>
              <div class="ml-4">
                <p class="font-medium text-gray-900">Configurer l'agent</p>
                <p class="text-sm text-gray-500">Personnalisez votre IA</p>
              </div>
            </button>
            
            <button
              @click="navigateTo('/knowledge-base')"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
            >
              <div class="p-2 bg-green-50 rounded-lg">
                <DocumentTextIcon class="h-5 w-5 text-green-600" />
              </div>
              <div class="ml-4">
                <p class="font-medium text-gray-900">Base de connaissance</p>
                <p class="text-sm text-gray-500">Ajouter du contenu</p>
              </div>
            </button>
            
            <button
              @click="showIntegrationModal = true"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
            >
              <div class="p-2 bg-purple-50 rounded-lg">
                <CodeBracketIcon class="h-5 w-5 text-purple-600" />
              </div>
              <div class="ml-4">
                <p class="font-medium text-gray-900">Code d'intégration</p>
                <p class="text-sm text-gray-500">Installer le widget</p>
              </div>
            </button>
            
            <button
              @click="navigateTo('/analytics')"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left"
            >
              <div class="p-2 bg-yellow-50 rounded-lg">
                <ChartBarIcon class="h-5 w-5 text-yellow-600" />
              </div>
              <div class="ml-4">
                <p class="font-medium text-gray-900">Analytics détaillées</p>
                <p class="text-sm text-gray-500">Voir les performances</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration actuelle -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Configuration actuelle</h3>
        <NuxtLink
          to="/settings"
          class="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          Modifier →
        </NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <dt class="text-sm font-medium text-gray-500">Agent :</dt>
          <dd class="mt-1 text-sm text-gray-900">{{ config.agentName }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Couleur :</dt>
          <dd class="mt-1 flex items-center">
            <div 
              class="w-4 h-4 rounded-full mr-2"
              :style="{ backgroundColor: config.primaryColor }"
            ></div>
            <span class="text-sm text-gray-900">{{ config.primaryColor }}</span>
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Statut :</dt>
          <dd class="mt-1">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ● Actif
            </span>
          </dd>
        </div>
      </div>
    </div>

    <!-- Modal d'intégration -->
    <IntegrationModal 
      :show="showIntegrationModal"
      @close="showIntegrationModal = false"
      :user-id="authStore.user?.shopId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  UserIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'

// État local
const loading = ref(false)
const showIntegrationModal = ref(false)

// Statistiques du widget
const stats = ref({
  todayViews: 1547,
  todayClicks: 234
})

// Métriques principales
const metrics = ref({
  totalConversations: 127,
  conversationsGrowth: 12,
  conversionRate: 34,
  conversionGrowth: 2.1,
  revenue: 602000,
  revenueGrowth: 15,
  averageOrder: 63953,
  averageOrderGrowth: -1.2
})

// Configuration actuelle
const config = ref({
  agentName: 'Sophie',
  primaryColor: '#ec4899',
  status: 'active'
})

// Activité récente (données simulées)
const recentActivity = ref([
  {
    id: '1',
    type: 'order',
    title: 'Nouvelle commande de Marie Dubois',
    description: 'il y a 2 min',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    amount: 45000
  },
  {
    id: '2',
    type: 'conversation',
    title: 'Conversation démarrée par client@example.com',
    description: 'il y a 10 min',
    timestamp: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: '3',
    type: 'visitor',
    title: 'Nouveau visiteur sur la page produit iPhone',
    description: 'il y a 15 min',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: '4',
    type: 'order',
    title: 'Commande finalisée par Jean Martin',
    description: 'il y a 30 min',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    amount: 75000
  },
  {
    id: '5',
    type: 'conversation',
    title: 'Conversation terminée avec succès',
    description: 'il y a 45 min',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  }
])

// Fonctions utilitaires
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatTimeAgo = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true, locale: fr })
}

const getActivityIcon = (type: string) => {
  const icons = {
    order: ShoppingCartIcon,
    conversation: ChatBubbleLeftRightIcon,
    visitor: EyeIcon,
    user: UserIcon
  }
  return icons[type] || EyeSlashIcon
}

const getActivityIconClass = (type: string) => {
  const classes = {
    order: 'bg-green-50 text-green-600',
    conversation: 'bg-blue-50 text-blue-600',
    visitor: 'bg-purple-50 text-purple-600',
    user: 'bg-yellow-50 text-yellow-600'
  }
  return classes[type] || 'bg-gray-50 text-gray-600'
}

// Actions
const refreshData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simuler mise à jour des stats
    stats.value.todayViews += Math.floor(Math.random() * 10)
    stats.value.todayClicks += Math.floor(Math.random() * 3)
    
    const showNotification = inject('showNotification') as ((message: string, type: string) => void) | undefined
    if (showNotification) {
      showNotification('Données actualisées avec succès !', 'success')
    }
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  } finally {
    loading.value = false
  }
}

const configureAgent = () => {
  navigateTo('/settings')
}

const previewWidget = () => {
  // Ouvrir aperçu du widget dans nouvelle fenêtre
  window.open('https://widget.chatseller.app/preview', '_blank')
}

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
  title: 'Dashboard - ChatSeller',
  description: 'Aperçu de votre Agent IA Commercial'
})

// Charger les données au montage
onMounted(() => {
  console.log('Page dashboard montée')
})
</script>