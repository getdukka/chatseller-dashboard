<!-- pages/orders.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          Commandes
        </h1>
        <p class="text-gray-600 mt-1">
          Gérez et suivez toutes vos commandes
        </p>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-3">
        <button
          @click="exportOrders"
          class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter
        </button>
        
        <button
          @click="refreshOrders"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2 inline" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingOrders.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Confirmées</p>
            <p class="text-2xl font-bold text-gray-900">{{ confirmedOrders.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Revenus</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalRevenue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select 
            v-model="filters.status" 
            @change="setStatusFilter(filters.status)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date début</label>
          <input 
            v-model="filters.dateStart"
            @change="updateDateRange"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
          <input 
            v-model="filters.dateEnd"
            @change="updateDateRange"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <input 
            v-model="filters.search"
            @input="setSearchTerm(filters.search)"
            type="text"
            placeholder="Client, email, produit..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Clear Filters -->
      <div class="mt-4 flex justify-end">
        <button
          @click="clearAllFilters"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Effacer les filtres
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div v-for="i in 5" :key="i" class="flex space-x-4">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button @click="refreshOrders" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Réessayer
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="p-6 text-center">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="text-gray-500">Aucune commande trouvée</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commande
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produits
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="order in filteredOrders" 
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <!-- Order ID -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  #{{ order.id.slice(-8) }}
                </div>
              </td>

              <!-- Customer -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ order.customerInfo.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ order.customerInfo.email || order.customerInfo.phone }}
                  </div>
                </div>
              </td>

              <!-- Products -->
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  <div v-for="item in order.items" :key="item.productName" class="mb-1">
                    {{ item.productName }} × {{ item.quantity }}
                  </div>
                </div>
              </td>

              <!-- Amount -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(order.totalAmount) }}
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>

              <!-- Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ formatDate(order.createdAt) }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewOrder(order)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Voir
                </button>
                <button
                  @click="goToConversation(order.conversationId)"
                  class="text-gray-600 hover:text-gray-900"
                >
                  Conversation
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">
              Détails de la commande #{{ selectedOrder.id.slice(-8) }}
            </h3>
            <button
              @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Order Details -->
          <div class="space-y-6">
            <!-- Customer Info -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Informations client</h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span class="font-medium">Nom:</span> {{ selectedOrder.customerInfo.name }}</p>
                <p v-if="selectedOrder.customerInfo.email">
                  <span class="font-medium">Email:</span> {{ selectedOrder.customerInfo.email }}
                </p>
                <p v-if="selectedOrder.customerInfo.phone">
                  <span class="font-medium">Téléphone:</span> {{ selectedOrder.customerInfo.phone }}
                </p>
                <p v-if="selectedOrder.customerInfo.address">
                  <span class="font-medium">Adresse:</span> {{ selectedOrder.customerInfo.address }}
                </p>
              </div>
            </div>

            <!-- Items -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Produits commandés</h4>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="item in selectedOrder.items" :key="item.productName">
                      <td class="px-4 py-2 text-sm text-gray-900">{{ item.productName }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900">{{ item.quantity }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900">{{ formatCurrency(item.price) }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="3" class="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total:</td>
                      <td class="px-4 py-2 text-sm font-bold text-gray-900">{{ formatCurrency(selectedOrder.totalAmount) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Order Meta -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Informations de commande</h4>
              <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span class="font-medium">Statut:</span> 
                  <span :class="getStatusClass(selectedOrder.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2">
                    {{ getStatusLabel(selectedOrder.status) }}
                  </span>
                </p>
                <p><span class="font-medium">Date de commande:</span> {{ formatDate(selectedOrder.createdAt) }}</p>
                <p><span class="font-medium">ID Conversation:</span> {{ selectedOrder.conversationId }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="goToConversation(selectedOrder.conversationId)"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Voir conversation
            </button>
            <button
              @click="selectedOrder = null"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

// =====================================
// COMPOSABLES AND STORES
// =====================================

const {
  fetchOrders,
  isLoading,
  error,
  filteredOrders,
  totalOrders,
  totalRevenue,
  pendingOrders,
  confirmedOrders,
  filters: storeFilters,
  setStatusFilter,
  setDateRangeFilter,
  setSearchTerm,
  clearFilters,
  exportToCSV
} = useOrders()

const { success, handleApiError } = useNotifications()

// =====================================
// REACTIVE STATE
// =====================================

const selectedOrder = ref<Order | null>(null)

const filters = reactive({
  status: 'all' as const,
  dateStart: '',
  dateEnd: '',
  search: ''
})

// =====================================
// METHODS
// =====================================

/**
 * Refresh orders data
 */
const refreshOrders = async (): Promise<void> => {
  try {
    await fetchOrders(true)
    success('Données actualisées', 'Les commandes ont été mises à jour')
  } catch (error: any) {
    handleApiError(error, 'Actualisation des commandes')
  }
}

/**
 * Update date range filter
 */
const updateDateRange = (): void => {
  const startDate = filters.dateStart ? new Date(filters.dateStart) : null
  const endDate = filters.dateEnd ? new Date(filters.dateEnd) : null
  setDateRangeFilter(startDate, endDate)
}

/**
 * Clear all filters
 */
const clearAllFilters = (): void => {
  filters.status = 'all'
  filters.dateStart = ''
  filters.dateEnd = ''
  filters.search = ''
  clearFilters()
}

/**
 * Export orders to CSV
 */
const exportOrders = (): void => {
  try {
    const csvContent = exportToCSV()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    success('Export réussi', 'Le fichier CSV a été téléchargé')
  } catch (error: any) {
    handleApiError(error, 'Export des commandes')
  }
}

/**
 * View order details
 */
const viewOrder = (order: Order): void => {
  selectedOrder.value = order
}

/**
 * Navigate to conversation
 */
const goToConversation = (conversationId: string): void => {
  navigateTo(`/conversations?id=${conversationId}`)
}

/**
 * Get status CSS class
 */
const getStatusClass = (status: Order['status']): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get status label
 */
const getStatusLabel = (status: Order['status']): string => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'confirmed':
      return 'Confirmée'
    case 'cancelled':
      return 'Annulée'
    default:
      return 'Inconnu'
  }
}

/**
 * Format currency
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

/**
 * Format date
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// =====================================
// LIFECYCLE
// =====================================

onMounted(async () => {
  await fetchOrders()
})

// =====================================
// SEO
// =====================================

useHead({
  title: 'Commandes - ChatSeller',
  meta: [
    {
      name: 'description',
      content: 'Gérez et suivez toutes vos commandes ChatSeller.'
    }
  ]
})
</script>