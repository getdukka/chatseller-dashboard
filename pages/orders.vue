<!-- pages/orders.vue - PAGE COMMANDES CORRIGÉE -->
<template>
  <div class="min-h-screen bg-gray-50">
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
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-xl">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total commandes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
              <p class="text-xs text-gray-500 mt-1">Ce mois-ci</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-xl">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</p>
              <p class="text-xs text-green-600 mt-1">+{{ stats.revenueGrowth }}% vs mois dernier</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-xl">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Panier moyen</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.averageOrderValue) }}</p>
              <p class="text-xs text-gray-500 mt-1">Par commande</p>
            </div>
          </div>
        </div>

        <div class="card-modern">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-xl">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En attente</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pendingOrders }}</p>
              <p class="text-xs text-orange-600 mt-1">Nécessitent une action</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card-modern mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <!-- Search -->
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher une commande..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex flex-wrap items-center space-x-4">
            <select v-model="filters.status" class="input-modern">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
            
            <select v-model="filters.period" class="input-modern">
              <option value="">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
            </select>
            
            <button
              v-if="hasActiveFilters"
              @click="clearFilters"
              class="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card-modern">
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
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Chargement des commandes...</span>
          </div>
        </div>

        <!-- Table -->
        <div v-else-if="filteredOrders.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header">Commande</th>
                <th class="table-header">Client</th>
                <th class="table-header">Produits</th>
                <th class="table-header">Montant</th>
                <th class="table-header">Statut</th>
                <th class="table-header">Date</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Order ID -->
                <td class="table-cell">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">
                      #{{ order.id.slice(-8).toUpperCase() }}
                    </div>
                  </div>
                </td>
                
                <!-- Customer -->
                <td class="table-cell">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ getCustomerName(order) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ getCustomerEmail(order) }}
                    </div>
                  </div>
                </td>
                
                <!-- Products -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ order.items.length }} article(s)
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ getProductSummary(order) }}
                  </div>
                </td>
                
                <!-- Amount -->
                <td class="table-cell">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(getTotalAmount(order)) }}
                  </div>
                </td>
                
                <!-- Status -->
                <td class="table-cell">
                  <span :class="getStatusBadgeClass(order.status)" class="status-badge">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                
                <!-- Date -->
                <td class="table-cell">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(order.createdAt) }}
                  </div>
                </td>
                
                <!-- Actions -->
                <td class="table-cell text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewOrder(order)"
                      class="action-button-primary"
                    >
                      Voir
                    </button>
                    <button
                      @click="updateOrderStatus(order)"
                      class="action-button-secondary"
                    >
                      Modifier
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune commande trouvée</h3>
          <p class="mt-2 text-gray-500">
            {{ searchQuery || hasActiveFilters ? 'Aucune commande ne correspond à vos critères' : 'Les commandes générées par votre Vendeur IA apparaîtront ici' }}
          </p>
          <div v-if="searchQuery || hasActiveFilters" class="mt-4">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div
      v-if="showOrderModal && selectedOrder"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeOrderModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>
        
        <div class="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">
              Détail de la commande #{{ selectedOrder.id.slice(-8).toUpperCase() }}
            </h3>
            <button
              @click="closeOrderModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-6">
            <!-- Customer Info -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Informations client</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span class="text-sm text-gray-500">Nom :</span>
                    <p class="font-medium">{{ getCustomerName(selectedOrder) }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">Email :</span>
                    <p class="font-medium">{{ getCustomerEmail(selectedOrder) }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">Téléphone :</span>
                    <p class="font-medium">{{ getCustomerPhone(selectedOrder) || 'Non renseigné' }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-gray-500">Adresse :</span>
                    <p class="font-medium">{{ getCustomerAddress(selectedOrder) || 'Non renseignée' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Articles commandés</h4>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="item in selectedOrder.items" :key="item.productId || item.productName">
                      <td class="px-4 py-3 text-sm text-gray-900">{{ item.productName }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ item.quantity }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900">{{ formatCurrency(item.price) }}</td>
                      <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Order Total -->
              <div class="mt-4 border-t pt-4">
                <div class="flex justify-between text-lg font-semibold">
                  <span>Total :</span>
                  <span>{{ formatCurrency(getTotalAmount(selectedOrder)) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              @click="closeOrderModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
            <button
              @click="updateOrderStatus(selectedOrder)"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modifier le statut
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ TYPES LOCAUX
interface OrderItem {
  productId?: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  conversationId: string
  customerInfo: {
    name: string
    email?: string
    phone?: string
    address?: string
  }
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

// ✅ COMPOSABLES
const authStore = useAuthStore()

// ✅ REACTIVE STATE
const loading = ref(false)
const exporting = ref(false) // ✅ AJOUTÉ
const searchQuery = ref('')
const showOrderModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const showSuccessMessage = ref(false)
const successMessage = ref('')

const filters = ref({
  status: '',
  period: ''
})

const orders = ref<Order[]>([])

const stats = ref({
  totalOrders: 89,
  totalRevenue: 45670.50,
  averageOrderValue: 512.30,
  pendingOrders: 12,
  revenueGrowth: 23.5
})

// ✅ COMPUTED
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      getCustomerName(order).toLowerCase().includes(query) ||
      getCustomerEmail(order).toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status)
  }

  // Period filter
  if (filters.value.period) {
    const now = new Date()
    const orderDate = (order: Order) => new Date(order.createdAt)
    
    filtered = filtered.filter(order => {
      const date = orderDate(order)
      switch (filters.value.period) {
        case 'today':
          return date.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return date >= weekAgo
        case 'month':
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3)
          const orderQuarter = Math.floor(date.getMonth() / 3)
          return orderQuarter === quarter && date.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || filters.value.period !== '' || searchQuery.value !== ''
})

// ✅ UTILITY METHODS
const getCustomerName = (order: Order): string => {
  return order.customerInfo.name || 'Client anonyme'
}

const getCustomerEmail = (order: Order): string => {
  return order.customerInfo.email || ''
}

const getCustomerPhone = (order: Order): string => {
  return order.customerInfo.phone || ''
}

const getCustomerAddress = (order: Order): string => {
  return order.customerInfo.address || ''
}

const getTotalAmount = (order: Order): number => {
  return order.totalAmount || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

const getProductSummary = (order: Order): string => {
  if (order.items.length === 1) {
    return order.items[0].productName
  }
  return `${order.items[0].productName}${order.items.length > 1 ? ` et ${order.items.length - 1} autre(s)` : ''}`
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
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

const showNotification = (message: string) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// ✅ EXPORT CSV FUNCTION - CORRECTION MAJEURE
const handleExportOrders = async () => {
  exporting.value = true
  
  try {
    // Créer les headers CSV
    const headers = [
      'ID Commande',
      'Nom Client',
      'Email Client',
      'Téléphone',
      'Produits',
      'Quantité Totale',
      'Montant Total',
      'Statut',
      'Date Création'
    ]
    
    // Préparer les données
    const csvData = filteredOrders.value.map(order => [
      `#${order.id.slice(-8).toUpperCase()}`,
      getCustomerName(order),
      getCustomerEmail(order),
      getCustomerPhone(order),
      getProductSummary(order),
      order.items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalAmount(order),
      getStatusLabel(order.status),
      formatDate(order.createdAt)
    ])
    
    // Créer le contenu CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
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
    showNotification('Erreur lors de l\'export CSV')
  } finally {
    exporting.value = false
  }
}

// ✅ ACTION METHODS
const loadOrders = async () => {
  loading.value = true
  
  try {
    // Simuler des données pour le développement
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    orders.value = [
      {
        id: 'ord_1234567890abcdef',
        conversationId: 'conv_123',
        customerInfo: {
          name: 'Marie Dubois',
          email: 'marie.dubois@email.com',
          phone: '+33 1 23 45 67 89',
          address: '123 Rue de la Paix, 75001 Paris'
        },
        items: [
          { productName: 'Produit Premium A', quantity: 2, price: 149.99 },
          { productName: 'Accessoire B', quantity: 1, price: 29.99 }
        ],
        totalAmount: 329.97,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ord_0987654321fedcba',
        conversationId: 'conv_124',
        customerInfo: {
          name: 'Pierre Martin',
          email: 'pierre.martin@email.com',
          phone: '+33 6 12 34 56 78'
        },
        items: [
          { productName: 'Produit Standard C', quantity: 1, price: 89.99 }
        ],
        totalAmount: 89.99,
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
  } finally {
    loading.value = false
  }
}

const refreshOrders = async () => {
  await loadOrders()
  showNotification('Commandes actualisées avec succès!')
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}

const updateOrderStatus = (order: Order) => {
  // TODO: Implémenter la mise à jour du statut
  console.log('Mise à jour du statut pour:', order.id)
  showNotification('Fonctionnalité de mise à jour du statut à venir')
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value.status = ''
  filters.value.period = ''
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
/* ✅ MODERN COMPONENTS */
.card-modern {
  @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
}

.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}

.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.action-button-primary {
  @apply text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors;
}

.action-button-secondary {
  @apply text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors;
}

/* ✅ RESPONSIVE */
@media (max-width: 768px) {
  .card-modern {
    @apply p-4;
  }
  
  .table-cell {
    @apply px-4 py-3;
  }
  
  .table-header {
    @apply px-4 py-2;
  }
}

/* ✅ ANIMATIONS */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>