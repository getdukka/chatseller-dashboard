<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="$emit('close')" class="relative z-50">
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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              <div class="bg-white px-6 py-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <DialogTitle class="text-lg font-semibold text-gray-900">
                      Commande {{ order?.orderNumber }}
                    </DialogTitle>
                    <p class="text-sm text-gray-500 mt-1">
                      Créée le {{ formatDate(order?.createdAt) }}
                    </p>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                
                <div v-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Détails client -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Informations client -->
                    <div class="bg-gray-50 rounded-lg p-6">
                      <h3 class="text-lg font-medium text-gray-900 mb-4">Informations client</h3>
                      <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span class="text-gray-500">Nom :</span>
                          <p class="font-medium">{{ order.customerName }}</p>
                        </div>
                        <div>
                          <span class="text-gray-500">Téléphone :</span>
                          <p class="font-medium">{{ order.customerPhone }}</p>
                        </div>
                        <div class="col-span-2">
                          <span class="text-gray-500">Email :</span>
                          <p class="font-medium">{{ order.customerEmail }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Articles commandés -->
                    <div class="bg-gray-50 rounded-lg p-6">
                      <h3 class="text-lg font-medium text-gray-900 mb-4">Articles commandés</h3>
                      <div class="space-y-4">
                        <div
                          v-for="item in order.items"
                          :key="item.name"
                          class="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                        >
                          <div>
                            <p class="font-medium text-gray-900">{{ item.name }}</p>
                            <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                          </div>
                          <p class="font-medium text-gray-900">
                            {{ formatCurrency(item.price * item.quantity) }}
                          </p>
                        </div>
                      </div>
                      <div class="border-t border-gray-200 pt-4 mt-4">
                        <div class="flex justify-between items-center text-lg font-bold">
                          <span>Total</span>
                          <span>{{ formatCurrency(order.totalAmount) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Statut et actions -->
                  <div class="space-y-6">
                    <!-- Statut actuel -->
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-medium text-gray-900 mb-4">Statut</h3>
                      <div class="space-y-4">
                        <div>
                          <span class="text-sm text-gray-500">Statut de la commande</span>
                          <p class="mt-1">
                            <span :class="getStatusBadgeClass(order.status)">
                              {{ getStatusText(order.status) }}
                            </span>
                          </p>
                        </div>
                        <div>
                          <span class="text-sm text-gray-500">Mode de paiement</span>
                          <p class="mt-1">
                            <span :class="getPaymentBadgeClass(order.paymentMethod)">
                              {{ getPaymentText(order.paymentMethod) }}
                            </span>
                          </p>
                        </div>
                        <div>
                          <span class="text-sm text-gray-500">Dernière mise à jour</span>
                          <p class="text-sm font-medium mt-1">{{ formatDate(order.updatedAt) }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                      <div class="space-y-3">
                        <button
                          v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
                          @click="updateStatus('processing')"
                          class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Marquer en traitement
                        </button>
                        <button
                          v-if="order.status === 'processing'"
                          @click="updateStatus('shipped')"
                          class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Marquer comme expédiée
                        </button>
                        <button
                          v-if="order.status === 'shipped'"
                          @click="updateStatus('delivered')"
                          class="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          Marquer comme livrée
                        </button>
                        <button
                          v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
                          @click="updateStatus('cancelled')"
                          class="w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        >
                          Annuler la commande
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Props
const props = defineProps<{
  isOpen: boolean
  order?: any
}>()

// Emits
const emit = defineEmits<{
  close: []
  update: [order: any]
}>()

// Méthodes utilitaires
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr })
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

const updateStatus = (newStatus: string) => {
  if (!props.order) return
  
  const updatedOrder = {
    ...props.order,
    status: newStatus,
    updatedAt: new Date().toISOString()
  }
  
  emit('update', updatedOrder)
  emit('close')
}
</script>