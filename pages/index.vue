<!-- pages/index.vue -->
<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Aperçu du Dashboard</h1>
            <p class="mt-1 text-sm text-gray-600">
              Suivez les performances de votre Agent IA Commercial ChatSeller.
            </p>
          </div>
          
          <!-- Quick actions -->
          <div class="mt-4 sm:mt-0 flex space-x-3">
            <button @click="testWidget" class="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <EyeIcon class="h-4 w-4 inline mr-2" />
              Tester le widget
            </button>
            <button class="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
              <PlusIcon class="h-4 w-4 inline mr-2" />
              Nouveau projet
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Conversations -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                    <ChatBubbleLeftRightIcon class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Conversations totales</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ analytics.totalConversations }}</div>
                      <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon class="h-3 w-3 flex-shrink-0 self-center" />
                        <span class="sr-only">Augmentation de</span>
                        12%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversions -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                    <CheckCircleIcon class="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Conversions</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ analytics.convertedConversations }}</div>
                      <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon class="h-3 w-3 flex-shrink-0 self-center" />
                        <span class="sr-only">Augmentation de</span>
                        8%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversion Rate -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 bg-pink-100 rounded-md flex items-center justify-center">
                    <ChartBarIcon class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Taux de conversion</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ Math.round(analytics.conversionRate) }}%</div>
                      <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon class="h-3 w-3 flex-shrink-0 self-center" />
                        <span class="sr-only">Augmentation de</span>
                        2.1%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 bg-yellow-100 rounded-md flex items-center justify-center">
                    <CurrencyDollarIcon class="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Revenus générés</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">{{ formatCurrency(analytics.totalRevenue) }}</div>
                      <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowUpIcon class="h-3 w-3 flex-shrink-0 self-center" />
                        <span class="sr-only">Augmentation de</span>
                        15%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Conversations Chart -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Conversations des 7 derniers jours</h3>
            </div>
            <div class="p-6">
              <div class="h-64 flex items-center justify-center text-gray-500">
                <div class="text-center">
                  <ChartBarIcon class="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p>Graphique des conversations</p>
                  <p class="text-sm">(À implémenter avec Chart.js)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Activité récente</h3>
            </div>
            <div class="p-6">
              <div class="flow-root">
                <ul class="-mb-8">
                  <li v-for="(activity, index) in recentActivities" :key="index">
                    <div class="relative pb-8" :class="{ 'pb-0': index === recentActivities.length - 1 }">
                      <span v-if="index !== recentActivities.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                      <div class="relative flex space-x-3">
                        <div>
                          <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" :class="activity.iconBg">
                            <component :is="activity.icon" class="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p class="text-sm text-gray-500">{{ activity.content }}</p>
                          </div>
                          <div class="text-right text-sm whitespace-nowrap text-gray-500">
                            {{ activity.time }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Actions rapides</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                @click="testWidget"
                class="group relative bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <EyeIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-8">
                  <h3 class="text-lg font-medium text-gray-900">
                    <span class="absolute inset-0"></span>
                    Tester le widget
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Voir à quoi ressemble votre agent IA sur votre site
                  </p>
                </div>
              </button>

              <NuxtLink
                to="/knowledge"
                class="group relative bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <BookOpenIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-8">
                  <h3 class="text-lg font-medium text-gray-900">
                    <span class="absolute inset-0"></span>
                    Gérer la base de connaissance
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Ajouter du contenu pour améliorer les réponses de l'IA
                  </p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/conversations"
                class="group relative bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <ChatBubbleLeftRightIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-8">
                  <h3 class="text-lg font-medium text-gray-900">
                    <span class="absolute inset-0"></span>
                    Voir les conversations
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Suivre les interactions de vos visiteurs
                  </p>
                </div>
              </NuxtLink>

              <NuxtLink
                to="/settings"
                class="group relative bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                    <Cog6ToothIcon class="h-6 w-6" />
                  </span>
                </div>
                <div class="mt-8">
                  <h3 class="text-lg font-medium text-gray-900">
                    <span class="absolute inset-0"></span>
                    Configurer l'agent
                  </h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Personnaliser l'apparence et le comportement
                  </p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Integration Code -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Code d'intégration</h3>
            <p class="mt-1 text-sm text-gray-600">
              Copiez ce code dans votre site web pour activer ChatSeller
            </p>
          </div>
          <div class="p-6">
            <div class="bg-gray-900 rounded-md p-4">
              <pre class="text-green-400 text-sm font-mono"><code>&lt;script src="{{ config.public.widgetUrl }}/widget.js" data-shop-id="{{ user?.id }}"&gt;&lt;/script&gt;</code></pre>
            </div>
            <div class="mt-4 flex justify-between">
              <p class="text-sm text-gray-500">
                Remplacez <code class="bg-gray-100 px-1 rounded">data-shop-id</code> par votre ID unique
              </p>
              <button
                @click="copyIntegrationCode"
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Copier le code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EyeIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

// Define the page meta with dashboard layout
definePageMeta({
  layout: 'dashboard',
  title: 'Dashboard ChatSeller'
  // Suppression du middleware qui cause une erreur
})

// Auth & config
// Auth & config - Correction auto-import
const { user } = useAuth()
const config = useRuntimeConfig()

// Data
const analytics = ref({
  totalConversations: 127,
  convertedConversations: 43,
  conversionRate: 33.9,
  totalRevenue: 602000,
  totalOrders: 43
})

const recentActivities = ref([
  {
    icon: ChatBubbleLeftRightIcon,
    iconBg: 'bg-blue-500',
    content: 'Nouvelle conversation démarrée par client@example.com',
    time: 'Il y a 2 min'
  },
  {
    icon: ShoppingBagIcon,
    iconBg: 'bg-green-500',
    content: 'Commande générée: 45,000 CFA',
    time: 'Il y a 10 min'
  },
  {
    icon: UserIcon,
    iconBg: 'bg-purple-500',
    content: 'Nouveau visiteur sur la page produit',
    time: 'Il y a 15 min'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    iconBg: 'bg-blue-500',
    content: 'Conversation terminée avec succès',
    time: 'Il y a 30 min'
  }
])

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const testWidget = () => {
  window.open(`${config.public.widgetUrl}/`, '_blank')
}

const copyIntegrationCode = async () => {
  const scriptTag = '<' + 'script src="' + config.public.widgetUrl + '/widget.js" data-shop-id="' + user.value?.id + '"><' + '/script>'
  
  try {
    await navigator.clipboard.writeText(scriptTag)
    
    // Show notification
    const setNotification = inject('setNotification') as (message: string) => void
    setNotification('Code d\'intégration copié dans le presse-papiers!')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>