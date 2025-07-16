<template>
  <div class="space-y-6">
    <!-- Header avec actions rapides -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">
            Bonjour {{ userProfile?.firstName || 'Marchand' }} ! 👋
          </h1>
          <p class="text-blue-100 mt-1">
            Voici un aperçu de votre Agent IA Commercial aujourd'hui
          </p>
        </div>
        
        <div class="flex items-center space-x-3">
          <button
            @click="refreshData"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
            Actualiser
          </button>
          
          <NuxtLink
            to="/settings"
            class="inline-flex items-center px-4 py-2 bg-white text-blue-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
          >
            <Cog6ToothIcon class="h-4 w-4 mr-2" />
            Configurer
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Métriques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <!-- Conversations totales -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Conversations totales</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ metrics.totalConversations.toLocaleString() }}
            </p>
            <div class="flex items-center mt-2">
              <span :class="[
                'text-sm font-medium',
                metrics.conversationsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ metrics.conversationsGrowth >= 0 ? '+' : '' }}{{ metrics.conversationsGrowth }}%
              </span>
              <span class="text-sm text-gray-500 ml-1">vs hier</span>
            </div>
          </div>
          <div class="p-3 bg-blue-50 rounded-full">
            <ChatBubbleLeftRightIcon class="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Taux de conversion -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Taux de conversion</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ metrics.conversionRate }}%
            </p>
            <div class="flex items-center mt-2">
              <span :class="[
                'text-sm font-medium',
                metrics.conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ metrics.conversionGrowth >= 0 ? '+' : '' }}{{ metrics.conversionGrowth }}%
              </span>
              <span class="text-sm text-gray-500 ml-1">vs hier</span>
            </div>
          </div>
          <div class="p-3 bg-green-50 rounded-full">
            <ChartBarIcon class="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Revenus générés -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Revenus générés</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ formatCurrency(metrics.revenue) }}
            </p>
            <div class="flex items-center mt-2">
              <span :class="[
                'text-sm font-medium',
                metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ metrics.revenueGrowth >= 0 ? '+' : '' }}{{ metrics.revenueGrowth }}%
              </span>
              <span class="text-sm text-gray-500 ml-1">vs hier</span>
            </div>
          </div>
          <div class="p-3 bg-blue-50 rounded-full">
            <CurrencyDollarIcon class="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Panier moyen -->
      <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Panier moyen</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ formatCurrency(metrics.averageOrderValue) }}
            </p>
            <div class="flex items-center mt-2">
              <span :class="[
                'text-sm font-medium',
                metrics.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ metrics.aovGrowth >= 0 ? '+' : '' }}{{ metrics.aovGrowth }}%
              </span>
              <span class="text-sm text-gray-500 ml-1">vs hier</span>
            </div>
          </div>
          <div class="p-3 bg-orange-50 rounded-full">
            <ShoppingBagIcon class="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques et activité -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Graphique des conversations (2/3) -->
      <div class="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            Conversations des 7 derniers jours
          </h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="period in chartPeriods"
              :key="period.value"
              @click="selectedPeriod = period.value"
              :class="[
                'px-3 py-1 text-sm rounded-md transition-colors duration-200',
                selectedPeriod === period.value
                  ? 'bg-blue-100 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
        
        <!-- Placeholder pour Chart.js -->
        <div class="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div class="text-center">
            <ChartBarIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-500">Graphique des conversations</p>
            <p class="text-xs text-gray-400 mt-1">(À implémenter avec Chart.js)</p>
          </div>
        </div>
      </div>

      <!-- Activité récente (1/3) -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Activité récente</h3>
          <NuxtLink
            to="/conversations"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Voir tout
          </NuxtLink>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="activity in recentActivity" 
            :key="activity.id"
            class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div :class="[
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              activity.type === 'conversation' && 'bg-blue-100 text-blue-700',
              activity.type === 'order' && 'bg-green-100 text-green-700',
              activity.type === 'visitor' && 'bg-purple-100 text-purple-700'
            ]">
              <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatTime(activity.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides et statut -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Actions rapides -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>
        
        <div class="grid grid-cols-2 gap-4">
          <button
            @click="$router.push('/settings')"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <Cog6ToothIcon class="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 group-hover:text-blue-700">
              Configurer l'agent
            </span>
          </button>
          
          <button
            @click="$router.push('/knowledge')"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <BookOpenIcon class="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 group-hover:text-blue-700">
              Base de connaissance
            </span>
          </button>
          
          <button
            @click="showIntegrationModal = true"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <CodeBracketIcon class="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 group-hover:text-blue-700">
              Code d'intégration
            </span>
          </button>
          
          <button
            @click="$router.push('/analytics')"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <ChartBarIcon class="h-8 w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
            <span class="text-sm font-medium text-gray-900 group-hover:text-blue-700">
              Analytics détaillées
            </span>
          </button>
        </div>
      </div>

      <!-- Statut du widget -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Statut du widget</h3>
        
        <div class="space-y-4">
          <!-- Statut principal -->
          <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-center">
              <div class="h-3 w-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <div>
                <p class="text-sm font-medium text-green-800">Widget actif</p>
                <p class="text-xs text-green-600">Dernière activité il y a 2 minutes</p>
              </div>
            </div>
            <CheckCircleIcon class="h-6 w-6 text-green-500" />
          </div>
          
          <!-- Métriques du widget -->
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <p class="text-2xl font-bold text-gray-900">{{ widgetStats.impressions }}</p>
              <p class="text-xs text-gray-500">Vues aujourd'hui</p>
            </div>
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <p class="text-2xl font-bold text-gray-900">{{ widgetStats.clicks }}</p>
              <p class="text-xs text-gray-500">Clics aujourd'hui</p>
            </div>
          </div>
          
          <!-- Configuration rapide -->
          <div class="pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-3">Configuration actuelle :</p>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Nom de l'agent :</span>
                <span class="font-medium">{{ widgetConfig.agentName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Couleur principale :</span>
                <div class="flex items-center">
                  <div 
                    class="w-4 h-4 rounded mr-2" 
                    :style="{ backgroundColor: widgetConfig.primaryColor }"
                  ></div>
                  <span class="font-medium">{{ widgetConfig.primaryColor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal code d'intégration -->
    <IntegrationModal 
      v-model:show="showIntegrationModal" 
      :user-id="userProfile?.id" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  UserIcon,
  ShoppingCartIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

// Authentification
const { userProfile } = useAuth()

// État local
const loading = ref(false)
const showIntegrationModal = ref(false)
const selectedPeriod = ref('7d')

// Périodes pour le graphique
const chartPeriods = [
  { label: '7j', value: '7d' },
  { label: '30j', value: '30d' },
  { label: '90j', value: '90d' }
]

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

// Activité récente (à connecter avec l'API)
const recentActivity = ref([
  {
    id: 1,
    type: 'conversation',
    message: 'Nouvelle conversation démarrée par client@example.com',
    timestamp: new Date(Date.now() - 2 * 60 * 1000) // Il y a 2 minutes
  },
  {
    id: 2,
    type: 'order',
    message: 'Commande générée : 45,000 F CFA',
    timestamp: new Date(Date.now() - 10 * 60 * 1000) // Il y a 10 minutes
  },
  {
    id: 3,
    type: 'visitor',
    message: 'Nouveau visiteur sur la page produit',
    timestamp: new Date(Date.now() - 15 * 60 * 1000) // Il y a 15 minutes
  },
  {
    id: 4,
    type: 'conversation',
    message: 'Conversation terminée avec succès',
    timestamp: new Date(Date.now() - 30 * 60 * 1000) // Il y a 30 minutes
  }
])

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
    
    // Ici, faire les vrais appels API pour récupérer les données
    console.log('Données actualisées')
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  } finally {
    loading.value = false
  }
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
  // Ici, charger les vraies données depuis l'API
  console.log('Dashboard monté, chargement des données...')
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>