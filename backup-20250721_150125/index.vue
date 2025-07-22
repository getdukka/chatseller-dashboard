<!-- pages/index.vue -->
<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard ChatSeller</h1>
      <p class="text-gray-600">Bienvenue sur votre tableau de bord</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5L8 11L18 1" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Conversations</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.conversations }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Commandes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.orders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-pink-100 rounded-lg">
            <svg class="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Conversion</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.conversion }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Revenus</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.revenue }}€</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold">Activité récente</h2>
      </div>
      <div class="p-6">
        <div v-if="isLoading" class="text-center py-8">
          <p class="text-gray-500">Chargement...</p>
        </div>
        <div v-else-if="recentActivity.length === 0" class="text-center py-8">
          <p class="text-gray-500">Aucune activité récente</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-center justify-between py-2"
          >
            <div>
              <p class="font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
            </div>
            <span class="text-sm text-gray-400">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

// Données réactives
const stats = ref({
  conversations: 47,
  orders: 12,
  conversion: 25.5,
  revenue: 1247
})

const isLoading = ref(false)

const recentActivity = ref([
  {
    id: 1,
    title: 'Nouvelle conversation',
    description: 'Un visiteur a initié une conversation',
    time: 'Il y a 2 minutes'
  },
  {
    id: 2,
    title: 'Commande créée',
    description: 'Commande #1234 pour 89€',
    time: 'Il y a 15 minutes'
  },
  {
    id: 3,
    title: 'Document uploadé',
    description: 'Catalogue produits mis à jour',
    time: 'Il y a 1 heure'
  }
])

// Charger les données au montage
onMounted(async () => {
  // On peut ajouter des appels API ici plus tard
})
</script>