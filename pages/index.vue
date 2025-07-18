<template>
  <div class="space-y-8">
    <!-- Header avec actions rapides -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">
            Bonjour {{ userProfile?.firstName || 'Marchand' }} ! 👋
          </h1>
          <p class="text-blue-100 mt-2 text-lg">
            Voici un aperçu de votre Agent IA Commercial aujourd'hui
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <button
            @click="refreshData"
            :disabled="loading"
            class="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            <ArrowPathIcon :class="['h-5 w-5 mr-2', loading && 'animate-spin']" />
            Actualiser
          </button>
          
          <NuxtLink
            to="/settings"
            class="inline-flex items-center px-6 py-3 bg-white text-blue-600 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 shadow-md"
          >
            <Cog6ToothIcon class="h-5 w-5 mr-2" />
            Configurer
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Statut du widget en première position -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Statut du widget</h2>
        <div class="flex items-center space-x-2">
          <div class="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-green-600">En ligne</span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Statut principal -->
        <div class="col-span-1 md:col-span-2">
          <div class="bg-green-50 rounded-lg p-6 border border-green-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon class="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-green-800">Widget actif</h3>
                  <p class="text-sm text-green-600">Dernière activité il y a 2 minutes</p>
                </div>
              </div>
              <button
                @click="previewWidget"
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <EyeIcon class="h-4 w-4 mr-2" />
                Aperçu
              </button>
            </div>
          </div>
        </div>
        
        <!-- Métriques du widget -->
        <div class="space-y-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-gray-900">{{ widgetStats.impressions.toLocaleString() }}</p>
            <p class="text-sm text-gray-500">Vues aujourd'hui</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-3xl font-bold text-gray-900">{{ widgetStats.clicks.toLocaleString() }}</p>
            <p class="text-sm text-gray-500">Clics aujourd'hui</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Métriques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <!-- Conversations totales -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Conversations totales</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ metrics.totalConversations.toLocaleString() }}
            </p>
            <div class="flex items-center mt-3">
              <div :class="[
                'flex items-center text-sm font-medium',
                metrics.conversationsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                <component 
                  :is="metrics.conversationsGrowth >= 0 ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'" 
                  class="h-4 w-4 mr-1" 
                />
                {{ Math.abs(metrics.conversationsGrowth) }}%
              </div>
              <span class="text-sm text-gray-500 ml-2">vs hier</span>
            </div>
          </div>
          <div class="p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-200">
            <ChatBubbleLeftRightIcon class="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Taux de conversion -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Taux de conversion</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ metrics.conversionRate }}%
            </p>
            <div class="flex items-center mt-3">
              <div :class="[
                'flex items-center text-sm font-medium',
                metrics.conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                <component 
                  :is="metrics.conversionGrowth >= 0 ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'" 
                  class="h-4 w-4 mr-1" 
                />
                {{ Math.abs(metrics.conversionGrowth) }}%
              </div>
              <span class="text-sm text-gray-500 ml-2">vs hier</span>
            </div>
          </div>
          <div class="p-4 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-200">
            <ChartBarIcon class="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Revenus générés -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Revenus générés</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ formatCurrency(metrics.revenue) }}
            </p>
            <div class="flex items-center mt-3">
              <div :class="[
                'flex items-center text-sm font-medium',
                metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                <component 
                  :is="metrics.revenueGrowth >= 0 ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'" 
                  class="h-4 w-4 mr-1" 
                />
                {{ Math.abs(metrics.revenueGrowth) }}%
              </div>
              <span class="text-sm text-gray-500 ml-2">vs hier</span>
            </div>
          </div>
          <div class="p-4 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-200">
            <CurrencyDollarIcon class="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- Panier moyen -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Panier moyen</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ formatCurrency(metrics.averageOrderValue) }}
            </p>
            <div class="flex items-center mt-3">
              <div :class="[
                'flex items-center text-sm font-medium',
                metrics.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                <component 
                  :is="metrics.aovGrowth >= 0 ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'" 
                  class="h-4 w-4 mr-1" 
                />
                {{ Math.abs(metrics.aovGrowth) }}%
              </div>
              <span class="text-sm text-gray-500 ml-2">vs hier</span>
            </div>
          </div>
          <div class="p-4 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors duration-200">
            <ShoppingBagIcon class="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <!-- Activité récente (2/3) -->
      <div class="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Activité récente</h2>
          <NuxtLink
            to="/conversations"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Voir tout →
          </NuxtLink>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div :class="[
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              activity.type === 'conversation' && 'bg-blue-100',
              activity.type === 'order' && 'bg-green-100',
              activity.type === 'visitor' && 'bg-purple-100'
            ]">
              <component :is="getActivityIcon(activity.type)" :class="[
                'h-5 w-5',
                activity.type === 'conversation' && 'text-blue-600',
                activity.type === 'order' && 'text-green-600',
                activity.type === 'visitor' && 'text-purple-600'
              ]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(activity.timestamp) }}</p>
            </div>
            <span v-if="activity.amount" class="text-sm font-semibold text-green-600">
              {{ formatCurrency(activity.amount as number) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions rapides (1/3) -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        
        <div class="space-y-4">
          <button
            @click="$router.push('/settings')"
            class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group text-left"
          >
            <div class="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
              <Cog6ToothIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                Configurer l'agent
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                Personnalisez votre IA
              </p>
            </div>
          </button>
          
          <button
            @click="$router.push('/knowledge')"
            class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group text-left"
          >
            <div class="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
              <BookOpenIcon class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900 group-hover:text-green-700">
                Base de connaissance
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                Ajouter du contenu
              </p>
            </div>
          </button>
          
          <button
            @click="showIntegrationModal = true"
            class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group text-left"
          >
            <div class="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-200">
              <CodeBracketIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                Code d'intégration
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                Installer le widget
              </p>
            </div>
          </button>
          
          <button
            @click="$router.push('/analytics')"
            class="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group text-left"
          >
            <div class="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors duration-200">
              <ChartBarIcon class="h-6 w-6 text-orange-600" />
            </div>
            <div class="ml-4">
              <h3 class="text-sm font-medium text-gray-900 group-hover:text-orange-700">
                Analytics détaillées
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                Voir les performances
              </p>
            </div>
          </button>
        </div>
        
        <!-- Configuration widget actuelle -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-900 mb-4">Configuration actuelle</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">Agent :</span>
              <span class="font-medium">{{ widgetConfig.agentName }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">Couleur :</span>
              <div class="flex items-center">
                <div 
                  class="w-4 h-4 rounded-full mr-2" 
                  :style="{ backgroundColor: widgetConfig.primaryColor }"
                ></div>
                <span class="font-medium">{{ widgetConfig.primaryColor }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-500">Statut :</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div class="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                Actif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'intégration -->
    <IntegrationModal 
      :show="showIntegrationModal" 
      @close="showIntegrationModal = false"
      :user-id="userProfile?.id" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  CodeBracketIcon,
  CheckCircleIcon,
  EyeIcon,
  UserIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/vue/24/outline'

// Authentification
const { userProfile } = useAuth()

// État local
const loading = ref(false)
const showIntegrationModal = ref(false)

// Métriques principales (à connecter avec l'API)
const metrics = ref({
  totalConversations: 127,
  conversationsGrowth: 12,
  conversionRate: 34,
  conversionGrowth: 2.1,
  revenue: 602000,
  revenueGrowth: 15,
  averageOrderValue: 63953,
  aovGrowth: -1.2
})

// Stats du widget
const widgetStats = ref({
  impressions: 1547,
  clicks: 234
})

// Configuration du widget
const widgetConfig = ref({
  agentName: 'Sophie',
  primaryColor: '#ec4899'
})

// Activité récente (à connecter avec l'API)
const recentActivity = ref([
  {
    id: 1,
    type: 'order',
    message: 'Nouvelle commande de Marie Dubois',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    amount: 45000
  },
  {
    id: 2,
    type: 'conversation',
    message: 'Conversation démarrée par client@example.com',
    timestamp: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 3,
    type: 'visitor',
    message: 'Nouveau visiteur sur la page produit iPhone',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 4,
    type: 'order',
    message: 'Commande finalisée par Jean Martin',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    amount: 75000
  },
  {
    id: 5,
    type: 'conversation',
    message: 'Conversation terminée avec succès',
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

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, any> = {
    conversation: ChatBubbleLeftRightIcon,
    order: ShoppingCartIcon,
    visitor: EyeIcon
  }
  return icons[type] || UserIcon
}

// Actions
const refreshData = async () => {
  loading.value = true
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const showNotification = inject('showNotification') as (message: string, type: string) => void
    if (showNotification) {
      showNotification('Données actualisées avec succès !', 'success')
    }
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
    const showNotification = inject('showNotification') as (message: string, type: string) => void
    if (showNotification) {
      showNotification('Erreur lors de l\'actualisation', 'error')
    }
  } finally {
    loading.value = false
  }
}

const previewWidget = () => {
  window.open('https://widget.chatseller.app/preview', '_blank')
}

// Métadonnées de la page
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Dashboard - ChatSeller',
  description: 'Tableau de bord de votre Agent IA Commercial'
})

// Charger les données au montage
onMounted(() => {
  console.log('Dashboard monté, chargement des données...')
})
</script>