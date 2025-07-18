<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Commandes</h1>
          <p class="text-sm text-gray-500 mt-1">
            Gérez et suivez toutes les commandes générées par votre Agent IA Commercial
          </p>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button
            @click="refreshOrders"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            :disabled="loading"
          >
            <ArrowPathIcon :class="['h-4 w-4 mr-2', loading && 'animate-spin']" />
            Actualiser
          </button>
          
          <button 
            @click="exportOrders"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <DocumentArrowDownIcon class="h-4 w-4 mr-2" />
            Exporter CSV
          </button>
          
          <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
            <PlusIcon class="h-4 w-4 mr-2" />
            Nouvelle commande
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- Status filter -->
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
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
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
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
          class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="all">Toutes</option>
        </select>

        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="filters.search"
            type="text"
            placeholder="Rechercher une commande..."
            class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShoppingBagIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total commandes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.totalRevenue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En attente</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <ChartBarIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Panier moyen</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.averageOrderValue) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Commandes récentes ({{ filteredOrders.length }})
        </h3>
      </div>

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
            <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 transition-colors duration-200">
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
                  <div class="h-10 w-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-sm">
                      {{ getInitials(order.customerName) }}
                    </span>
                  </div>
                  <div class="ml-4">
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
                  <span class="font-medium">{{ order.items.length }}</span> 
                  produit{{ order.items.length > 1 ? 's' : '' }}
                </div>
                <div class="text-sm text-gray-500 max-w-xs truncate">
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
                <span :class="getPaymentBadgeClass(order.paymentMethod)">
                  {{ getPaymentText(order.paymentMethod) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewOrder(order)"
                    class="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Voir détails"
                  >
                    <EyeIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="editOrder(order)"
                    class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    title="Modifier"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
                    @click="updateOrderStatus(order)"
                    class="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
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
                :class="[
                  page === currentPage 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

// State
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const selectedOrder = ref(null)
const isModalOpen = ref(false)

// Filtres
const filters = ref({
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

// Mock orders data (données améliorées)
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
  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status)
  }

  // Filter by payment method
  if (filters.value.paymentMethod) {
    filtered = filtered.filter(order => order.paymentMethod === filters.value.paymentMethod)
  }

  // Filter by search
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
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
  
  switch (filters.value.period) {
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
  const classes = {
    pending: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    confirmed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    processing: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800',
    shipped: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800',
    delivered: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    cancelled: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || classes.pending
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return texts[status as keyof typeof texts] || 'Inconnue'
}

const getPaymentBadgeClass = (paymentMethod: string) => {
  const classes = {
    mobile_money: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800',
    cash: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    card: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    bank_transfer: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
  }
  return classes[paymentMethod as keyof typeof classes] || classes.cash
}

const getPaymentText = (paymentMethod: string) => {
  const texts = {
    mobile_money: 'Mobile Money',
    cash: 'Espèces',
    card: 'Carte',
    bank_transfer: 'Virement'
  }
  return texts[paymentMethod as keyof typeof texts] || 'Autre'
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
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
  
  const showNotification = inject('showNotification') as (message: string, type: string) => void
  if (showNotification) {
    showNotification('Commandes actualisées avec succès !', 'success')
  }
}

const exportOrders = () => {
  console.log('Exporting orders to CSV...')
  const showNotification = inject('showNotification') as (message: string, type: string) => void
  if (showNotification) {
    showNotification('Export CSV démarré ! Le fichier sera téléchargé sous peu.', 'info')
  }
}

const viewOrder = (order: any) => {
  selectedOrder.value = order
  isModalOpen.value = true
}

const editOrder = (order: any) => {
  console.log('Editing order:', order.id)
  const showNotification = inject('showNotification') as (message: string, type: string) => void
  if (showNotification) {
    showNotification('Modification de commande à implémenter', 'info')
  }
}

const updateOrderStatus = (order: any) => {
  console.log('Updating order status:', order.id)
  const showNotification = inject('showNotification') as (message: string, type: string) => void
  if (showNotification) {
    showNotification('Mise à jour du statut à implémenter', 'info')
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedOrder.value = null
}

const handleOrderUpdate = (updatedOrder: any) => {
  const index = orders.value.findIndex(order => order.id === updatedOrder.id)
  if (index !== -1) {
    orders.value[index] = updatedOrder
  }
  closeModal()
  
  const showNotification = inject('showNotification') as (message: string, type: string) => void
  if (showNotification) {
    showNotification('Commande mise à jour avec succès !', 'success')
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
}, { deep: true })

// Métadonnées de la page
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Commandes - ChatSeller',
  description: 'Gérez et suivez toutes les commandes générées par votre Agent IA Commercial'
})
</script>