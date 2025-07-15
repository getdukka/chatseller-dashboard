<!-- pages/orders.vue -->
<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Commandes</h1>
            <p class="mt-1 text-sm text-gray-600">
              Gérez et suivez toutes les commandes générées par votre Agent IA Commercial.
            </p>
          </div>
          
          <!-- Actions -->
          <div class="mt-4 sm:mt-0 flex space-x-3">
            <button
              @click="refreshOrders"
              class="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              :disabled="loading"
            >
              <ArrowPathIcon class="h-4 w-4 inline mr-2" :class="{ 'animate-spin': loading }" />
              Actualiser
            </button>
            
            <button 
              @click="exportOrders"
              class="bg-green-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <DocumentArrowDownIcon class="h-4 w-4 inline mr-2" />
              Exporter CSV
            </button>
            
            <button class="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
              <PlusIcon class="h-4 w-4 inline mr-2" />
              Nouvelle commande
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <ShoppingBagIcon class="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total commandes</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.totalOrders }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                    <CurrencyDollarIcon class="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Chiffre d'affaires</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <ClockIcon class="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">En attente</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.pendingOrders }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 bg-pink-100 rounded-md flex items-center justify-center">
                    <ChartBarIcon class="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Panier moyen</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ formatCurrency(stats.averageOrderValue) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div class="flex space-x-4">
                <!-- Status filter -->
                <select
                  v-model="filters.status"
                  class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>

                <!-- Payment filter -->
                <select
                  v-model="filters.paymentMethod"
                  class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Tous les paiements</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="cash">Espèces</option>
                  <option value="card">Carte bancaire</option>
                  <option value="bank_transfer">Virement</option>
                </select>

                <!-- Date filter -->
                <select
                  v-model="filters.period"
                  class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="all">Toutes</option>
                </select>
              </div>

              <!-- Search -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="filters.search"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher une commande..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              Commandes ({{ filteredOrders.length }})
            </h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produits
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      #{{ order.orderNumber }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ order.conversationId }}
                    </div>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span class="text-white font-medium text-xs">
                          {{ getInitials(order.customerName) }}
                        </span>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ order.customerName }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ order.customerPhone }}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ order.items.length }} produit{{ order.items.length > 1 ? 's' : '' }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ order.items.map(item => item.name).join(', ') }}
                    </div>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ formatCurrency(order.totalAmount) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      Qté: {{ order.items.reduce((sum, item) => sum + item.quantity, 0) }}
                    </div>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getPaymentBadgeClass(order.paymentMethod)"
                    >
                      {{ getPaymentText(order.paymentMethod) }}
                    </span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusBadgeClass(order.status)"
                    >
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(order.createdAt) }}
                  </td>
                  
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button
                        @click="viewOrder(order)"
                        class="text-blue-600 hover:text-pink-900"
                        title="Voir détails"
                      >
                        <EyeIcon class="h-4 w-4" />
                      </button>
                      <button
                        @click="editOrder(order)"
                        class="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <PencilIcon class="h-4 w-4" />
                      </button>
                      <button
                        v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
                        @click="updateOrderStatus(order)"
                        class="text-green-600 hover:text-green-900"
                        title="Mettre à jour le statut"
                      >
                        <CheckCircleIcon class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Affichage de <span class="font-medium">{{ startIndex }}</span> à
                  <span class="font-medium">{{ endIndex }}</span> sur
                  <span class="font-medium">{{ filteredOrders.length }}</span> résultats
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon class="h-5 w-5" />
                  </button>
                  
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    :class="page === currentPage 
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                  >
                    {{ page }}
                  </button>
                  
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Details Modal -->
        <OrderDetailsModal
          v-if="selectedOrder"
          :order="selectedOrder"
          :is-open="isModalOpen"
          @close="closeModal"
          @update="handleOrderUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Define page meta
definePageMeta({
  layout: 'dashboard',
  title: 'Commandes - ChatSeller'
})

// State
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const selectedOrder = ref(null)
const isModalOpen = ref(false)

// Filters
const filters = reactive({
  status: '',
  paymentMethod: '',
  period: 'month',
  search: ''
})

// Stats
const stats = ref({
  totalOrders: 43,
  totalRevenue: 2750000,
  pendingOrders: 8,
  averageOrderValue: 63953
})

// Mock orders data
const orders = ref([
  {
    id: '1',
    orderNumber: 'CS-001',
    conversationId: 'conv_123456',
    customerName: 'Marie Dubois',
    customerPhone: '+225 07 12 34 56 78',
    customerEmail: 'marie@example.com',
    items: [
      { name: 'Smartphone Galaxy A54', quantity: 1, price: 180000 },
      { name: 'Coque protection', quantity: 1, price: 5000 }
    ],
    totalAmount: 185000,
    paymentMethod: 'mobile_money',
    status: 'confirmed',
    createdAt: new Date('2025-01-14T10:45:00'),
    updatedAt: new Date('2025-01-14T11:00:00')
  },
  {
    id: '2',
    orderNumber: 'CS-002',
    conversationId: 'conv_789012',
    customerName: 'Jean Martin',
    customerPhone: '+225 05 98 76 54 32',
    customerEmail: 'jean@example.com',
    items: [
      { name: 'MacBook Air M2', quantity: 1, price: 750000 }
    ],
    totalAmount: 750000,
    paymentMethod: 'bank_transfer',
    status: 'processing',
    createdAt: new Date('2025-01-13T16:30:00'),
    updatedAt: new Date('2025-01-14T09:15:00')
  },
  {
    id: '3',
    orderNumber: 'CS-003',
    conversationId: 'conv_345678',
    customerName: 'Sophie Laurent',
    customerPhone: '+225 01 23 45 67 89',
    customerEmail: 'sophie@example.com',
    items: [
      { name: 'Casque Bluetooth Sony', quantity: 2, price: 45000 },
      { name: 'Chargeur sans fil', quantity: 1, price: 15000 }
    ],
    totalAmount: 105000,
    paymentMethod: 'mobile_money',
    status: 'shipped',
    createdAt: new Date('2025-01-12T14:20:00'),
    updatedAt: new Date('2025-01-13T10:30:00')
  },
  {
    id: '4',
    orderNumber: 'CS-004',
    conversationId: 'conv_901234',
    customerName: 'Ahmed Koné',
    customerPhone: '+225 07 87 65 43 21',
    customerEmail: 'ahmed@example.com',
    items: [
      { name: 'iPad Pro 11"', quantity: 1, price: 450000 },
      { name: 'Apple Pencil', quantity: 1, price: 65000 }
    ],
    totalAmount: 515000,
    paymentMethod: 'cash',
    status: 'delivered',
    createdAt: new Date('2025-01-10T11:15:00'),
    updatedAt: new Date('2025-01-12T16:45:00')
  },
  {
    id: '5',
    orderNumber: 'CS-005',
    conversationId: 'conv_567890',
    customerName: 'Fatou Diallo',
    customerPhone: '+225 05 11 22 33 44',
    customerEmail: 'fatou@example.com',
    items: [
      { name: 'Montre connectée', quantity: 1, price: 85000 }
    ],
    totalAmount: 85000,
    paymentMethod: 'mobile_money',
    status: 'pending',
    createdAt: new Date('2025-01-14T09:30:00'),
    updatedAt: new Date('2025-01-14T09:30:00')
  }
])

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter(order => order.status === filters.status)
  }

  // Filter by payment method
  if (filters.paymentMethod) {
    filtered = filtered.filter(order => order.paymentMethod === filters.paymentMethod)
  }

  // Filter by search
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(order => 
      order.orderNumber.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      order.customerPhone.includes(search) ||
      order.customerEmail.toLowerCase().includes(search)
    )
  }

  // Filter by period
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (filters.period) {
    case 'today':
      filtered = filtered.filter(order => order.createdAt >= today)
      break
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(order => order.createdAt >= weekAgo)
      break
    case 'month':
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
      filtered = filtered.filter(order => order.createdAt >= monthAgo)
      break
    // 'all' - no filter
  }

  return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOrders.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredOrders.value.length))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const getInitials = (name: string) => {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-purple-100 text-purple-800'
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'confirmed':
      return 'Confirmée'
    case 'processing':
      return 'En traitement'
    case 'shipped':
      return 'Expédiée'
    case 'delivered':
      return 'Livrée'
    case 'cancelled':
      return 'Annulée'
    default:
      return 'Inconnue'
  }
}

const getPaymentBadgeClass = (paymentMethod: string) => {
  switch (paymentMethod) {
    case 'mobile_money':
      return 'bg-orange-100 text-orange-800'
    case 'cash':
      return 'bg-green-100 text-green-800'
    case 'card':
      return 'bg-blue-100 text-blue-800'
    case 'bank_transfer':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentText = (paymentMethod: string) => {
  switch (paymentMethod) {
    case 'mobile_money':
      return 'Mobile Money'
    case 'cash':
      return 'Espèces'
    case 'card':
      return 'Carte'
    case 'bank_transfer':
      return 'Virement'
    default:
      return 'Autre'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: fr })
}

const refreshOrders = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}

const exportOrders = () => {
  // Implement CSV export
  console.log('Exporting orders to CSV...')
  
  const notification = inject('setNotification') as (message: string) => void
  notification('Export CSV démarré! Le fichier sera téléchargé sous peu.')
}

const viewOrder = (order: any) => {
  selectedOrder.value = order
  isModalOpen.value = true
}

const editOrder = (order: any) => {
  // Implement order editing
  console.log('Editing order:', order.id)
}

const updateOrderStatus = (order: any) => {
  // Implement status update
  console.log('Updating order status:', order.id)
}

const closeModal = () => {
  isModalOpen.value = false
  selectedOrder.value = null
}

const handleOrderUpdate = (updatedOrder: any) => {
  // Update the order in the list
  const index = orders.value.findIndex(order => order.id === updatedOrder.id)
  if (index !== -1) {
    orders.value[index] = updatedOrder
  }
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
})
</script>