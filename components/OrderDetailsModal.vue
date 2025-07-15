<!-- components/OrderDetailsModal.vue -->
<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  @click="$emit('close')"
                >
                  <span class="sr-only">Fermer</span>
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <div class="sm:flex sm:items-start">
                <div class="w-full">
                  <!-- Header -->
                  <div class="mb-6 flex items-center justify-between">
                    <div>
                      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                        Commande #{{ order?.orderNumber }}
                      </DialogTitle>
                      <p class="mt-1 text-sm text-gray-500">
                        Passée le {{ formatDate(order?.createdAt) }}
                      </p>
                    </div>
                    <span
                      class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                      :class="getStatusBadgeClass(order?.status)"
                    >
                      {{ getStatusText(order?.status) }}
                    </span>
                  </div>

                  <!-- Order Details Grid -->
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Order Items -->
                    <div class="lg:col-span-2 space-y-6">
                      <!-- Items List -->
                      <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-4">Produits commandés</h4>
                        <div class="space-y-3">
                          <div
                            v-for="item in order?.items"
                            :key="item.name"
                            class="flex items-center justify-between bg-white p-3 rounded-md"
                          >
                            <div class="flex items-center space-x-3">
                              <div class="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                                <ShoppingBagIcon class="h-6 w-6 text-gray-400" />
                              </div>
                              <div>
                                <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                                <p class="text-xs text-gray-500">Quantité: {{ item.quantity }}</p>
                              </div>
                            </div>
                            <div class="text-right">
                              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(item.price) }}</p>
                              <p class="text-xs text-gray-500">par unité</p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Order Total -->
                        <div class="mt-4 pt-4 border-t border-gray-200">
                          <div class="flex justify-between">
                            <span class="text-base font-medium text-gray-900">Total</span>
                            <span class="text-base font-medium text-gray-900">{{ formatCurrency(order?.totalAmount) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Status History -->
                      <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-4">Historique de la commande</h4>
                        <div class="flow-root">
                          <ul class="-mb-8">
                            <li v-for="(event, index) in orderHistory" :key="index">
                              <div class="relative pb-8" :class="{ 'pb-0': index === orderHistory.length - 1 }">
                                <span v-if="index !== orderHistory.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                                <div class="relative flex space-x-3">
                                  <div>
                                    <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" :class="event.iconBg">
                                      <component :is="event.icon" class="h-4 w-4 text-white" />
                                    </span>
                                  </div>
                                  <div class="min-w-0 flex-1 pt-1.5">
                                    <div>
                                      <p class="text-sm text-gray-500">{{ event.content }}</p>
                                      <p class="text-xs text-gray-400">{{ event.time }}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <!-- Customer & Payment Info -->
                    <div class="space-y-6">
                      <!-- Customer Info -->
                      <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Informations client</h4>
                        <div class="space-y-3">
                          <div class="flex items-center space-x-3">
                            <div class="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span class="text-white font-medium text-sm">
                                {{ getInitials(order?.customerName) }}
                              </span>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-900">{{ order?.customerName }}</p>
                              <p class="text-xs text-gray-500">{{ order?.customerEmail }}</p>
                            </div>
                          </div>
                          <div class="pt-3 border-t border-gray-100">
                            <div class="space-y-2">
                              <div>
                                <span class="text-xs text-gray-500">Téléphone:</span>
                                <p class="text-sm">{{ order?.customerPhone }}</p>
                              </div>
                              <div>
                                <span class="text-xs text-gray-500">Conversation:</span>
                                <p class="text-sm font-mono text-xs">{{ order?.conversationId }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Payment Info -->
                      <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Informations de paiement</h4>
                        <div class="space-y-2">
                          <div class="flex justify-between">
                            <span class="text-xs text-gray-500">Méthode:</span>
                            <span
                              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                              :class="getPaymentBadgeClass(order?.paymentMethod)"
                            >
                              {{ getPaymentText(order?.paymentMethod) }}
                            </span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-xs text-gray-500">Montant:</span>
                            <span class="text-sm font-medium">{{ formatCurrency(order?.totalAmount) }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-xs text-gray-500">Statut paiement:</span>
                            <span class="text-sm text-green-600">Payé</span>
                          </div>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="space-y-3">
                        <button
                          v-if="order?.status !== 'delivered' && order?.status !== 'cancelled'"
                          @click="updateStatus"
                          class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Mettre à jour le statut
                        </button>
                        <button class="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                          Contacter le client
                        </button>
                        <button class="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                          Exporter les détails
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  XMarkIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Props
const props = defineProps<{
  order: any
  isOpen: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
  update: [order: any]
}>()

// Mock order history
const orderHistory = computed(() => [
  {
    icon: CheckCircleIcon,
    iconBg: 'bg-green-500',
    content: 'Commande passée via ChatSeller',
    time: formatDate(props.order?.createdAt || new Date())
  },
  {
    icon: CheckCircleIcon,
    iconBg: 'bg-blue-500',
    content: 'Commande confirmée',
    time: 'Il y a 2 heures'
  },
  {
    icon: ClockIcon,
    iconBg: 'bg-yellow-500',
    content: 'En cours de préparation',
    time: 'Il y a 1 heure'
  }
])

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
  return format(date, 'dd/MM/yyyy à HH:mm', { locale: fr })
}

const updateStatus = () => {
  // Implement status update logic
  console.log('Updating order status...')
}
</script>