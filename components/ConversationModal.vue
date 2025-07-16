<!-- components/ConversationModal.vue -->
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
                  <div class="mb-6">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      Détails de la conversation
                    </DialogTitle>
                    <p class="mt-2 text-sm text-gray-500">
                      Conversation avec {{ conversation?.visitorName || 'Visiteur anonyme' }}
                    </p>
                  </div>

                  <!-- Conversation Info -->
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Chat Messages -->
                    <div class="lg:col-span-2">
                      <div class="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                        <div class="space-y-4">
                          <!-- Mock messages -->
                          <div class="flex items-start space-x-3">
                            <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span class="text-blue-600 font-medium text-sm">AI</span>
                            </div>
                            <div class="bg-white rounded-lg px-4 py-2 shadow-sm">
                              <p class="text-sm text-gray-800">
                                Bonjour ! Je suis Sophie, votre assistante virtuelle. Comment puis-je vous aider ?
                              </p>
                              <p class="text-xs text-gray-500 mt-1">10:30</p>
                            </div>
                          </div>

                          <div class="flex items-start space-x-3 justify-end">
                            <div class="bg-blue-600 text-white rounded-lg px-4 py-2">
                              <p class="text-sm">
                                Bonjour, je cherche un smartphone avec une bonne caméra
                              </p>
                              <p class="text-xs text-blue-200 mt-1">10:31</p>
                            </div>
                            <div class="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span class="text-gray-600 font-medium text-sm">{{ getInitials(conversation?.visitorName) }}</span>
                            </div>
                          </div>

                          <div class="flex items-start space-x-3">
                            <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span class="text-blue-600 font-medium text-sm">AI</span>
                            </div>
                            <div class="bg-white rounded-lg px-4 py-2 shadow-sm">
                              <p class="text-sm text-gray-800">
                                Parfait ! J'ai plusieurs excellents smartphones avec d'excellentes caméras. Quel est votre budget approximatif ?
                              </p>
                              <p class="text-xs text-gray-500 mt-1">10:32</p>
                            </div>
                          </div>

                          <!-- Add more mock messages as needed -->
                        </div>
                      </div>
                    </div>

                    <!-- Conversation Details -->
                    <div class="space-y-6">
                      <!-- Visitor Info -->
                      <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Informations visiteur</h4>
                        <div class="space-y-2">
                          <div>
                            <span class="text-xs text-gray-500">Nom:</span>
                            <p class="text-sm font-medium">{{ conversation?.visitorName || 'Non renseigné' }}</p>
                          </div>
                          <div>
                            <span class="text-xs text-gray-500">Email:</span>
                            <p class="text-sm">{{ conversation?.visitorEmail || 'Non renseigné' }}</p>
                          </div>
                          <div>
                            <span class="text-xs text-gray-500">Session ID:</span>
                            <p class="text-sm font-mono text-xs">{{ conversation?.sessionId }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Conversation Stats -->
                      <div class="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Statistiques</h4>
                        <div class="space-y-2">
                          <div class="flex justify-between">
                            <span class="text-xs text-gray-500">Messages:</span>
                            <span class="text-sm font-medium">{{ conversation?.messageCount }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-xs text-gray-500">Statut:</span>
                            <span class="text-sm font-medium">{{ getStatusText(conversation?.status) }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-xs text-gray-500">Démarrée:</span>
                            <span class="text-sm">{{ formatDate(conversation?.createdAt) }}</span>
                          </div>
                          <div v-if="conversation?.orderValue" class="flex justify-between">
                            <span class="text-xs text-gray-500">Commande:</span>
                            <span class="text-sm font-medium text-green-600">{{ formatCurrency(conversation?.orderValue) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="space-y-3">
                        <button
                          v-if="conversation?.status === 'active'"
                          class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Prendre le contrôle
                        </button>
                        <button class="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                          Exporter la conversation
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
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Props
defineProps<{
  conversation: any
  isOpen: boolean
}>()

// Emits
defineEmits<{
  close: []
}>()

// Methods
const getInitials = (name: string | null) => {
  if (!name) return 'V'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'En cours'
    case 'converted':
      return 'Convertie'
    case 'completed':
      return 'Terminée'
    case 'abandoned':
      return 'Abandonnée'
    default:
      return 'Inconnue'
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
</script>