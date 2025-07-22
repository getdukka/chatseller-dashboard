<!-- pages/orders.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Commandes</h1>
            <p class="mt-1 text-sm text-gray-600">
              Suivez et gérez toutes vos ventes réalisées par l'agent IA
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshOrders"
              :disabled="refreshing"
              class="btn-secondary"
            >
              <svg 
                class="mr-2 h-4 w-4" 
                :class="{ 'animate-spin': refreshing }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ refreshing ? 'Actualisation...' : 'Actualiser' }}
            </button>
            
            <button
              @click="exportOrders"
              class="btn-secondary"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter CSV
            </button>

            <button
              @click="showFilters = !showFilters"
              class="btn-secondary"
              :class="{ 'bg-blue-50 text-blue-700 border-blue-300': activeFiltersCount > 0 }"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filtres
              <span v-if="activeFiltersCount > 0" class="ml-2 badge-primary">
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="p-6">
      <!-- Statistiques des commandes -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <!-- Total commandes -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>

        <!-- En attente -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En attente</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
            </div>
          </div>
        </div>

        <!-- Confirmées -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Confirmées</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.confirmed }}</p>
            </div>
          </div>
        </div>

        <!-- Revenus -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Revenus</p>
              <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(stats.revenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau de filtres -->
      <div v-if="showFilters" class="card mb-6 animate-slide-in-up">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filtres</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- Statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select v-model="filters.status" class="input-primary">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="processing">En traitement</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <!-- Date de début -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date début</label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="input-primary"
            />
          </div>

          <!-- Date de fin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="input-primary"
            />
          </div>

          <!-- Recherche -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Client, email, n° commande..."
              class="input-primary"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-end space-x-2">
            <button @click="applyFilters" class="btn-primary">
              Appliquer
            </button>
            <button @click="clearFilters" class="btn-secondary">
              Effacer
            </button>
          </div>
        </div>
      </div>

      <!-- Table des commandes -->
      <div class="card">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Commandes récentes
          </h2>
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-500">
              {{ orders.length }} commande(s)
            </span>
            <div class="flex items-center space-x-1">
              <button
                @click="currentPage > 1 && changePage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="text-sm text-gray-500">
                Page {{ currentPage }} sur {{ totalPages }}
              </span>
              <button
                @click="currentPage < totalPages && changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                class="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="p-6">
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
              <div class="skeleton w-20 h-4"></div>
              <div class="skeleton w-32 h-4"></div>
              <div class="skeleton w-24 h-4"></div>
              <div class="skeleton w-16 h-4"></div>
              <div class="skeleton w-20 h-4"></div>
              <div class="skeleton w-12 h-4"></div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div v-else-if="orders.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Commande
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
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in orders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- N° Commande -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800"
                    @click="viewOrderDetails(order.id)">
                  #{{ order.orderNumber }}
                </td>

                <!-- Client -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <span class="text-xs font-medium text-gray-700">
                        {{ getInitials(order.customerName) }}
                      </span>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ order.customerName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ order.customerEmail }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Produits -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                    {{ order.products.length }} produit(s)
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ order.products.slice(0, 2).map(p => p.name).join(', ') }}
                    <span v-if="order.products.length > 2">...</span>
                  </div>
                </td>

                <!-- Montant -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(order.total) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ order.products.reduce((sum, p) => sum + p.quantity, 0) }} article(s)
                  </div>
                </td>

                <!-- Statut -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(order.status)" class="badge">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.createdAt) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewOrderDetails(order.id)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Voir détails"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button
                      @click="updateOrderStatus(order.id, order.status)"
                      class="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Modifier statut"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <div class="relative">
                      <button
                        @click="toggleOrderMenu(order.id)"
                        class="text-gray-400 hover:text-gray-600 p-1 rounded"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                        </svg>
                      </button>

                      <!-- Menu déroulant -->
                      <div
                        v-if="activeOrderMenu === order.id"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                      >
                        <div class="py-1">
                          <button
                            @click="duplicateOrder(order.id)"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dupliquer commande
                          </button>
                          <button
                            @click="printOrder(order.id)"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Imprimer
                          </button>
                          <hr class="my-1">
                          <button
                            @click="cancelOrder(order.id)"
                            class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            Annuler commande
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- État vide -->
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
          <p class="mt-1 text-sm text-gray-500">
            Les nouvelles commandes générées par votre agent IA apparaîtront ici
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de détails de commande -->
    <Modal
      v-model="showOrderModal"
      :title="`Commande #${selectedOrder?.orderNumber}`"
      size="lg"
      @close="selectedOrder = null"
    >
      <div v-if="selectedOrder" class="space-y-6">
        <!-- Informations client -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-3">Informations client</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-500">Nom</label>
              <p class="text-sm text-gray-900">{{ selectedOrder.customerName }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Email</label>
              <p class="text-sm text-gray-900">{{ selectedOrder.customerEmail }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Téléphone</label>
              <p class="text-sm text-gray-900">{{ selectedOrder.customerPhone || 'Non renseigné' }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-500">Adresse</label>
              <p class="text-sm text-gray-900">{{ selectedOrder.shippingAddress || 'Non renseignée' }}</p>
            </div>
          </div>
        </div>

        <!-- Produits commandés -->
        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-3">Produits commandés</h4>
          <div class="border border-gray-200 rounded-md overflow-hidden">
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
                <tr v-for="product in selectedOrder.products" :key="product.id">
                  <td class="px-4 py-2 text-sm text-gray-900">{{ product.name }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ product.quantity }}</td>
                  <td class="px-4 py-2 text-sm text-gray-900">{{ formatCurrency(product.price) }}</td>
                  <td class="px-4 py-2 text-sm font-medium text-gray-900">{{ formatCurrency(product.price * product.quantity) }}</td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="3" class="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total</td>
                  <td class="px-4 py-2 text-sm font-bold text-gray-900">{{ formatCurrency(selectedOrder.total) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showOrderModal = false" class="btn-secondary">
          Fermer
        </button>
        <button @click="printOrder(selectedOrder?.id)" class="btn-primary ml-3">
          Imprimer
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import Modal from '~/components/ui/Modal.vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Types
interface Product {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress?: string
  products: Product[]
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  revenue: number
}

// État du composant
const loading = ref(true)
const refreshing = ref(false)
const showFilters = ref(false)
const activeOrderMenu = ref<string | null>(null)
const showOrderModal = ref(false)
const selectedOrder = ref<Order | null>(null)

// Données
const orders = ref<Order[]>([])
const stats = reactive<Stats>({
  total: 89,
  pending: 15,
  confirmed: 74,
  revenue: 45670.50
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// Filtres
const filters = reactive({
  status: '',
  dateFrom: '',
  dateTo: '',
  search: ''
})

const activeFiltersCount = computed(() => {
  return Object.values(filters).filter(value => value !== '').length
})

// Méthodes utilitaires
const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusLabel = (status: string): string => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    processing: 'En traitement',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    pending: 'badge-warning',
    confirmed: 'badge-primary',
    processing: 'badge-info',
    shipped: 'badge-secondary',
    delivered: 'badge-success',
    cancelled: 'badge-error'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Actions
const loadOrders = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Données simulées
    orders.value = [
      {
        id: '1',
        orderNumber: '1299',
        customerName: 'Pierre Martin',
        customerEmail: 'pierre.martin@email.com',
        customerPhone: '06 12 34 56 78',
        shippingAddress: '123 rue de la Paix, 75001 Paris',
        products: [
          { id: '1', name: 'Produit Premium A', quantity: 2, price: 64.99 },
        ],
        total: 129.98,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        orderNumber: '1298',
        customerName: 'Sophie Laurent',
        customerEmail: 'sophie.laurent@email.com',
        products: [
          { id: '2', name: 'Produit Standard B', quantity: 1, price: 89.50 },
        ],
        total: 89.50,
        status: 'processing',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        orderNumber: '1297',
        customerName: 'Marie Dubois',
        customerEmail: 'marie.dubois@email.com',
        products: [
          { id: '3', name: 'Pack Découverte', quantity: 1, price: 45.00 },
          { id: '4', name: 'Accessoire Premium', quantity: 2, price: 25.00 },
        ],
        total: 95.00,
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]

    totalItems.value = orders.value.length
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)
  } finally {
    loading.value = false
  }
}

const refreshOrders = async () => {
  refreshing.value = true
  try {
    await loadOrders()
  } finally {
    refreshing.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  loadOrders()
}

const applyFilters = () => {
  currentPage.value = 1
  loadOrders()
}

const clearFilters = () => {
  Object.assign(filters, {
    status: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })
  applyFilters()
}

const exportOrders = async () => {
  try {
    // Simulation d'export CSV
    const csvData = orders.value.map(order => ({
      'N° Commande': order.orderNumber,
      'Client': order.customerName,
      'Email': order.customerEmail,
      'Montant': order.total,
      'Statut': getStatusLabel(order.status),
      'Date': formatDate(order.createdAt)
    }))

    // Conversion en CSV
    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    // Téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `commandes-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    console.log('✅ Export CSV généré')
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error)
  }
}

const viewOrderDetails = (orderId: string) => {
  selectedOrder.value = orders.value.find(o => o.id === orderId) || null
  showOrderModal.value = true
  activeOrderMenu.value = null
}

const toggleOrderMenu = (orderId: string) => {
  activeOrderMenu.value = activeOrderMenu.value === orderId ? null : orderId
}

const updateOrderStatus = (orderId: string, currentStatus: string) => {
  console.log('Modifier statut commande:', orderId, currentStatus)
  // Implémentation de la mise à jour de statut
  activeOrderMenu.value = null
}

const duplicateOrder = (orderId: string) => {
  console.log('Dupliquer commande:', orderId)
  activeOrderMenu.value = null
}

const printOrder = (orderId: string) => {
  console.log('Imprimer commande:', orderId)
  activeOrderMenu.value = null
}

const cancelOrder = async (orderId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    activeOrderMenu.value = null
    return
  }

  try {
    console.log('Annuler commande:', orderId)
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'cancelled'
    }
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error)
  }
  activeOrderMenu.value = null
}

// Fermer le menu d'actions en cliquant ailleurs
const closeOrderMenu = (event: Event) => {
  if (activeOrderMenu.value && !(event.target as Element).closest('.relative')) {
    activeOrderMenu.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadOrders()
  document.addEventListener('click', closeOrderMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOrderMenu)
})
</script>