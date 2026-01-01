<!-- pages/orders/index.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <!-- Header Modern -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Commandes</h1>
            <p class="mt-2 text-gray-600">
              Gérez toutes les commandes générées par votre agent IA
            </p>
          </div>

          <!-- Actions Header -->
          <div class="flex items-center space-x-4">
            <button
              @click="handleExportOrders"
              :disabled="exporting"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': exporting }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ exporting ? 'Export en cours...' : 'Exporter CSV' }}
            </button>

            <button
              @click="refreshOrders"
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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Commandes -->
        <div class="card-beauty-gradient from-blue-500 to-blue-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total commandes</p>
              <p class="text-3xl font-bold">{{ stats.totalOrders }}</p>
              <p class="text-blue-100 text-sm mt-1">
                Ce mois-ci
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Revenus Totaux -->
        <div class="card-beauty-gradient from-green-500 to-green-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-green-100 text-sm font-medium">Revenus totaux</p>
              <p class="text-3xl font-bold">{{ formatCurrency(stats.totalRevenue) }}</p>
              <p class="text-green-100 text-sm mt-1">
                +{{ stats.revenueGrowth }}% vs mois dernier
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Panier Moyen -->
        <div class="card-beauty-gradient from-amber-500 to-orange-500">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-orange-100 text-sm font-medium">Panier moyen</p>
              <p class="text-3xl font-bold">{{ formatCurrency(stats.averageOrderValue) }}</p>
              <p class="text-orange-100 text-sm mt-1">
                Par commande
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- En Attente -->
        <div class="card-beauty-gradient from-purple-500 to-purple-600">
          <div class="flex items-center justify-between text-white">
            <div>
              <p class="text-purple-100 text-sm font-medium">En attente</p>
              <p class="text-3xl font-bold">{{ stats.pendingOrders }}</p>
              <p class="text-purple-100 text-sm mt-1">
                Nécessitent une action
              </p>
            </div>
            <div class="p-3 bg-white bg-opacity-20 rounded-xl">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rechercher une commande
            </label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ID commande, nom client, email..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-3 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Filtrer par statut
            </label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              Liste des commandes
            </h3>
            <span class="text-sm text-gray-500">
              {{ filteredOrders.length }} commande(s)
            </span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-12">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            <span class="ml-3 text-gray-600">Chargement des commandes...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-red-600 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="refreshOrders"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700 transition-all"
          >
            Réessayer
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredOrders.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune commande</h3>
          <p class="mt-2 text-gray-600">
            {{ orders.length === 0 ? 'Les nouvelles commandes apparaîtront ici' : 'Aucune commande ne correspond à vos filtres' }}
          </p>
        </div>

        <!-- Table -->
        <div v-else-if="filteredOrders.length > 0" class="overflow-x-auto">
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
                  Paiement
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
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Commande -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    #{{ order.id.slice(-8).toUpperCase() }}
                  </div>
                  <div v-if="order.external_order_id" class="text-xs text-gray-500">
                    Ext: {{ order.external_order_id }}
                  </div>
                </td>

                <!-- Client -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ order.customer_name || 'N/A' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ order.customer_email || 'N/A' }}
                  </div>
                </td>

                <!-- Produits -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                    {{ getProductSummary(order) }}
                  </div>
                </td>

                <!-- Montant -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(order.amount, order.currency) }}
                  </div>
                </td>

                <!-- Paiement -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 capitalize">
                    {{ order.payment_method || 'N/A' }}
                  </div>
                </td>

                <!-- Statut -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click.stop="viewOrder(order)"
                    class="text-rose-600 hover:text-rose-900 transition-colors"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const api = useApi()

// ✅ REACTIVE STATE
const loading = ref(true)
const exporting = ref(false)
const searchQuery = ref('')
const error = ref<string | null>(null)

const filters = ref({
  status: ''
})

const orders = ref<any[]>([])

const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  pendingOrders: 0,
  revenueGrowth: 0
})

// Notification
const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// ✅ COMPUTED
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.customer_name?.toLowerCase().includes(query) ||
      order.customer_email?.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.external_order_id?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status)
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || searchQuery.value !== ''
})

// ✅ UTILITY METHODS
const getProductCount = (order: any): number => {
  if (!order.product_items || !Array.isArray(order.product_items)) return 0
  return order.product_items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
}

const getUpsellCount = (order: any): number => {
  if (!order.upsell_items || !Array.isArray(order.upsell_items)) return 0
  return order.upsell_items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
}

const hasUpsellItems = (order: any): boolean => {
  return order.upsell_items && Array.isArray(order.upsell_items) && order.upsell_items.length > 0
}

const getProductSummary = (order: any): string => {
  if (!order.product_items || !Array.isArray(order.product_items) || order.product_items.length === 0) {
    return 'Aucun produit'
  }

  const firstItem = order.product_items[0]
  const itemName = firstItem.name || firstItem.productName || 'Produit'

  if (order.product_items.length === 1) {
    return itemName
  }

  return `${itemName} et ${order.product_items.length - 1} autre(s)`
}

const getTotalOrderAmount = (order: any): number => {
  return (order.total_amount || 0) + (order.upsell_amount || 0)
}

const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  // Adaptation pour XOF (Franc CFA)
  if (currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(amount)
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentMethodLabel = (method: string | null): string => {
  if (!method) return 'Non spécifié'

  const labels: Record<string, string> = {
    card: 'Carte bancaire',
    paypal: 'PayPal',
    bank_transfer: 'Virement',
    cash: 'Espèces',
    mobile_money: 'Mobile Money'
  }
  return labels[method] || method
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }

  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

// ✅ API METHODS UTILISANT LE COMPOSABLE API
const loadOrders = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('Chargement commandes via API...')

    const response: any = await api.orders.list()
    console.log('Réponse API brute:', response)

    if (response?.success) {
      let commandesArray: any[] = []

      if (response.data) {
        // ✅ CAS 1: data contient une structure imbriquée avec orders (format actuel de l'API)
        if (response.data.orders && Array.isArray(response.data.orders)) {
          commandesArray = response.data.orders
          console.log('✅ Structure API: objet avec orders -', commandesArray.length, 'commandes trouvées')
        }
        // ✅ CAS 2: data est directement un tableau (fallback pour compatibilité)
        else if (Array.isArray(response.data)) {
          commandesArray = response.data
          console.log('✅ Structure: tableau direct -', commandesArray.length, 'commandes trouvées')
        }
        // ❌ Structure inconnue
        else {
          console.warn('⚠️ Structure de réponse API inconnue:', response.data)
          commandesArray = []
        }
      }

      orders.value = commandesArray
      console.log('📦 Commandes chargées avec succès:', orders.value.length)

      await loadStats()
    } else {
      const errorMsg = response?.error || 'Erreur lors du chargement des commandes'
      throw new Error(errorMsg)
    }

  } catch (err: unknown) {
    const errorObj = err as Error
    console.error('Erreur chargement commandes:', errorObj)
    error.value = errorObj.message || 'Erreur lors du chargement des commandes'
    orders.value = []
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const ordersData = orders.value
    const today = new Date()
    const thisMonth = ordersData.filter((o: any) => {
      const orderDate = new Date(o.created_at)
      return orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()
    })

    const totalRevenue = thisMonth.reduce((sum: number, order: any) => sum + getTotalOrderAmount(order), 0)

    stats.value = {
      totalOrders: thisMonth.length,
      totalRevenue,
      averageOrderValue: thisMonth.length > 0 ? totalRevenue / thisMonth.length : 0,
      pendingOrders: ordersData.filter((o: any) => o.status === 'pending').length,
      revenueGrowth: 23.5 // TODO: Calculer réellement vs mois précédent
    }
  } catch (err) {
    console.warn('⚠️ Erreur chargement stats:', err)
  }
}

const refreshOrders = async () => {
  await loadOrders()
  showNotification('Commandes actualisées avec succès!')
}

// ✅ EXPORT CSV FUNCTION
const handleExportOrders = async () => {
  exporting.value = true

  try {
    // Créer les headers CSV
    const headers = [
      'ID Commande',
      'ID Externe',
      'Nom Client',
      'Email Client',
      'Téléphone',
      'Adresse',
      'Produits',
      'Quantité Totale',
      'Montant Total',
      'Montant Upsell',
      'Devise',
      'Méthode Paiement',
      'Statut',
      'Date Création',
      'Date Export',
      'Notes'
    ]

    // Préparer les données
    const csvData = filteredOrders.value.map((order: any) => [
      `#${order.id.slice(-8).toUpperCase()}`,
      order.external_order_id || '',
      order.customer_name || '',
      order.customer_email || '',
      order.customer_phone || '',
      order.customer_address || '',
      getProductSummary(order),
      getProductCount(order) + getUpsellCount(order),
      getTotalOrderAmount(order),
      order.upsell_amount || 0,
      order.currency,
      getPaymentMethodLabel(order.payment_method),
      getStatusLabel(order.status),
      formatDate(order.created_at),
      order.exported_at ? formatDate(order.exported_at) : '',
      order.notes || ''
    ])

    // Créer le contenu CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n')

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `commandes-chatseller-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification(`${filteredOrders.value.length} commande(s) exportée(s) avec succès!`)

  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error)
    showNotification('Erreur lors de l\'export CSV', 'error')
  } finally {
    exporting.value = false
  }
}

// ✅ ACTION METHODS
const viewOrder = async (order: any) => {
  try {
    const response = await api.orders.get(order.id)

    if (response.success) {
      console.log('Commande détaillée:', response.data)
      // TODO: Ouvrir modal ou page de détail
    } else {
      showNotification('Erreur lors du chargement des détails', 'error')
    }
  } catch (err) {
    console.error('Erreur vue commande:', err)
    showNotification('Erreur lors du chargement des détails', 'error')
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value.status = ''
}

// ✅ LIFECYCLE
onMounted(() => {
  loadOrders()
})

// ✅ SEO
useHead({
  title: 'Commandes - ChatSeller Dashboard'
})
</script>

<style scoped>
.card-beauty-gradient {
  @apply bg-gradient-to-br rounded-xl shadow-lg p-6 text-white;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
