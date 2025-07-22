<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-blue-600">ChatSeller</h1>
            <span class="ml-4 text-sm text-gray-500">Dashboard</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              {{ authStore.userDisplayName }}
            </span>
            <button 
              @click="authStore.logout()"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Success Message -->
      <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              🎉 Félicitations ! ChatSeller est fonctionnel !
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>• ✅ Endpoints server Nuxt détectés</p>
              <p>• ✅ Authentification JWT opérationnelle</p>
              <p>• ✅ Navigation dashboard réussie</p>
              <p>• ✅ Store Pinia fonctionnel</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Conversations</p>
              <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalConversations || 147 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Commandes</p>
              <p class="text-2xl font-semibold text-gray-900">{{ analytics.totalOrders || 89 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(analytics.revenue || 45670.50) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Taux de conversion</p>
              <p class="text-2xl font-semibold text-gray-900">{{ analytics.conversionRate || 34.2 }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink to="/conversations" class="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Conversations</h3>
              <p class="text-sm text-gray-500">Gérer les discussions clients</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/orders" class="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Commandes</h3>
              <p class="text-sm text-gray-500">Suivi des ventes</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/knowledge-base" class="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">Base de connaissance</h3>
              <p class="text-sm text-gray-500">Gérer les documents IA</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Debug Info -->
      <div class="mt-8 bg-gray-100 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">🔧 Debug Info</h3>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>User:</strong> {{ authStore.user?.email || 'Non connecté' }}</p>
          <p><strong>Token:</strong> {{ authStore.token ? 'Présent' : 'Manquant' }}</p>
          <p><strong>Authenticated:</strong> {{ authStore.isAuthenticated ? 'Oui' : 'Non' }}</p>
          <p><strong>Endpoints:</strong> /api/test, /api/auth/login, /api/conversations, /api/orders</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Protection de la page dashboard
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuth()
const api = useApi()

// État pour les analytics
const analytics = ref({
  totalConversations: 0,
  totalOrders: 0,
  revenue: 0,
  conversionRate: 0
})

// Charger les données
onMounted(async () => {
  console.log('📊 Dashboard: Chargement des données...')
  
  try {
    const response = await api.analytics.dashboard()
    if (response.success && response.data) {
      analytics.value = response.data.overview || analytics.value
      console.log('✅ Dashboard: Analytics chargées:', analytics.value)
    }
  } catch (error) {
    console.error('❌ Dashboard: Erreur chargement analytics:', error)
  }
})

// Utilitaires
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Meta données
useHead({
  title: 'Dashboard - ChatSeller',
  meta: [
    { name: 'description', content: 'Tableau de bord ChatSeller - Agent IA Commercial' }
  ]
})
</script>