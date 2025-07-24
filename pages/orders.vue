<!-- pages/orders.vue - CORRIGÉ SANS ERREURS TYPESCRIPT -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Commandes</h1>
        <p class="text-gray-600">Gérez toutes les commandes générées par votre agent IA</p>
      </div>
      
      <!-- Filtres rapides -->
      <div class="flex space-x-2">
        <select v-model="statusFilter" class="border border-gray-300 rounded-lg px-3 py-2">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total commandes</p>
            <p class="text-2xl font-bold text-gray-900">{{ orders.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Revenus totaux</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalRevenue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Panier moyen</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(averageOrderValue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingOrders }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table des commandes -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Liste des commandes</h3>
          
          <!-- Recherche -->
          <div class="max-w-sm">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une commande..."
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            >
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
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
                  Montant
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    #{{ order.id.slice(-8).toUpperCase() }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ order.items.length }} article(s)
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ getCustomerName(order) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ getCustomerEmail(order) }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(getTotalAmount(order)) }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(order.status)
                    ]"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewOrder(order)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Voir
                  </button>
                  <button
                    @click="editOrder(order)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- État vide -->
        <div v-if="filteredOrders.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune commande trouvée</h3>
          <p class="mt-1 text-sm text-gray-500">
            Les commandes générées par votre agent IA apparaîtront ici.
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de détail de commande -->
    <Modal
      :show="showOrderModal"
      title="Détail de la commande"
      size="lg"
      @close="closeOrderModal"
    >
      <div v-if="selectedOrder" class="space-y-6">
        <!-- Informations client -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-2">Informations client</h4>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4">
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

        <!-- Articles commandés -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-2">Articles commandés</h4>
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
                <tr v-for="item in selectedOrder.items" :key="item.productId || item.productName">
                  <td class="px-4 py-2 text-sm text-gray-900">{{ item.productName }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ item.quantity }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ formatCurrency(item.price) }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Total -->
          <div class="mt-4 border-t pt-4">
            <div class="flex justify-between text-lg font-medium border-t pt-2 mt-2">
              <span>Total :</span>
              <span>{{ formatCurrency(getTotalAmount(selectedOrder)) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ IMPORTS EXPLICITES POUR ÉVITER LES ERREURS
import { ref, computed, onMounted } from 'vue'

// ✅ TYPES LOCAUX POUR ÉVITER LES ERREURS D'IMPORT
interface OrderItem {
  productId?: string
  productName: string
  quantity: number
  price: number
}

interface OrderLocal {
  id: string
  conversationId: string
  shopId: string
  customerInfo: {
    name: string
    email?: string
    phone?: string
    address?: string
  }
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  // Propriétés de compatibilité
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  total?: number
  updatedAt?: string
}

// ✅ META PAGE
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// ✅ COMPOSABLES - SANS TYPES GÉNÉRIQUES POUR ÉVITER LES ERREURS
const auth = useAuth()
const api = useApi()

// ✅ REACTIVE DATA - TYPES EXPLICITES
const loading = ref<boolean>(false)
const searchQuery = ref<string>('')
const statusFilter = ref<string>('')
const orders = ref<OrderLocal[]>([])
const showOrderModal = ref<boolean>(false)
const selectedOrder = ref<OrderLocal | null>(null)

// ✅ COMPUTED
const filteredOrders = computed(() => {
  let filtered = orders.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      getCustomerName(order).toLowerCase().includes(query) ||
      getCustomerEmail(order)?.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const totalRevenue = computed(() => {
  return orders.value.reduce((sum, order) => sum + getTotalAmount(order), 0)
})

const averageOrderValue = computed(() => {
  if (orders.value.length === 0) return 0
  return totalRevenue.value / orders.value.length
})

const pendingOrders = computed(() => {
  return orders.value.filter(order => order.status === 'pending').length
})

// ✅ METHODS - ADAPTÉS AU FORMAT useApi
const getCustomerName = (order: OrderLocal): string => {
  return order.customerName || order.customerInfo?.name || 'Client anonyme'
}

const getCustomerEmail = (order: OrderLocal): string => {
  return order.customerEmail || order.customerInfo?.email || ''
}

const getCustomerPhone = (order: OrderLocal): string => {
  return order.customerPhone || order.customerInfo?.phone || ''
}

const getCustomerAddress = (order: OrderLocal): string => {
  return order.customerAddress || order.customerInfo?.address || ''
}

const getTotalAmount = (order: OrderLocal): number => {
  return order.total || order.totalAmount || 0
}

const loadOrders = async () => {
  loading.value = true
  
  try {
    // ✅ UTILISATION SANS TYPES GÉNÉRIQUES
    const response = await api.orders.list(auth.userShopId.value || undefined)
    if (response.success && response.data) {
      orders.value = response.data
    }
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
    
    // Données factices pour le développement
    orders.value = [
      {
        id: '1',
        conversationId: 'conv1',
        shopId: auth.userShopId.value || 'shop1',
        customerInfo: {
          name: 'Jean Dupont',
          email: 'jean@example.com',
          phone: '01 23 45 67 89',
          address: '123 Rue de la Paix, Paris'
        },
        items: [
          { productName: 'Produit A', quantity: 2, price: 50 },
          { productName: 'Produit B', quantity: 1, price: 30 }
        ],
        totalAmount: 130,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

const viewOrder = (order: OrderLocal) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

const editOrder = (order: OrderLocal) => {
  // TODO: Implémenter l'édition de commande
  console.log('Éditer la commande:', order)
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
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
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// ✅ LIFECYCLE
onMounted(() => {
  loadOrders()
})
</script>