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
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Success Banner -->
      <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              🎉 ChatSeller Dashboard Opérationnel !
            </h3>
            <div class="mt-2 text-sm text-green-700">
              <p>• ✅ Authentification sécurisée</p>
              <p>• ✅ Session persistante</p>
              <p>• ✅ Middleware fonctionnel</p>
              <p>• ✅ Prêt pour la production</p>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Conversations -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Conversations</p>
              <p class="text-2xl font-bold text-gray-900">147</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-sm text-green-600">
            <span class="font-medium">12 actives</span>
          </div>
        </div>

        <!-- Commandes -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Commandes</p>
              <p class="text-2xl font-bold text-gray-900">89</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-sm text-blue-600">
            <span class="font-medium">34.2% conversion</span>
          </div>
        </div>

        <!-- Revenue -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Chiffre d'affaires</p>
              <p class="text-2xl font-bold text-gray-900">45 670,50 €</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-sm text-green-600">
            <span class="font-medium">512,30 € panier moyen</span>
          </div>
        </div>

        <!-- Performance -->
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Performance</p>
              <p class="text-2xl font-bold text-gray-900">&lt; 2s</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-sm text-green-600">
            <span class="font-medium">99.9% uptime</span>
          </div>
        </div>
      </div>

      <!-- Navigation Sections -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer">
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
        </div>

        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer">
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
        </div>

        <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer">
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
              <p class="text-sm text-gray-500">Documents IA</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          <div class="space-y-3">
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-blue-600">MD</span>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">Marie Dubois</p>
                <p class="text-xs text-gray-500">Nouvelle conversation démarrée</p>
              </div>
              <span class="text-xs text-gray-400">Il y a 5min</span>
            </div>
            
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-green-600">PM</span>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">Pierre Martin</p>
                <p class="text-xs text-gray-500">Commande confirmée - 1299€</p>
              </div>
              <span class="text-xs text-gray-400">Il y a 12min</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques du jour</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Nouvelles conversations</span>
              <span class="text-sm font-medium text-gray-900">23</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Commandes traitées</span>
              <span class="text-sm font-medium text-gray-900">8</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Chiffre d'affaires</span>
              <span class="text-sm font-medium text-gray-900">3 240,50 €</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Taux de satisfaction</span>
              <span class="text-sm font-medium text-green-600">98.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ MIDDLEWARE ACTIVÉ
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuth()

// Meta données
useHead({
  title: 'Dashboard - ChatSeller',
  meta: [
    { name: 'description', content: 'Tableau de bord ChatSeller - Agent IA Commercial' }
  ]
})
</script>