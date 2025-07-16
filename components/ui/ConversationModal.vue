<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="closeModal" class="relative z-50">
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
              <div class="bg-white">
                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon class="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <DialogTitle class="text-lg font-semibold text-gray-900">
                        {{ conversation?.visitor_email || 'Visiteur anonyme' }}
                      </DialogTitle>
                      <p class="text-sm text-gray-500">
                        {{ conversation?.visitor_ip }} • {{ formatDate(conversation?.created_at) }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <span :class="getStatusClass(conversation?.status)">
                      {{ getStatusText(conversation?.status) }}
                    </span>
                    <button
                      @click="closeModal"
                      class="rounded-md text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <!-- Contenu de la conversation -->
                <div class="flex h-96">
                  <!-- Messages -->
                  <div class="flex-1 flex flex-col">
                    <div class="flex-1 overflow-y-auto p-6 space-y-4">
                      <div 
                        v-for="message in messages" 
                        :key="message.id"
                        :class="[
                          'flex',
                          message.sender === 'visitor' ? 'justify-end' : 'justify-start'
                        ]"
                      >
                        <div :class="[
                          'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                          message.sender === 'visitor' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        ]">
                          <p class="text-sm">{{ message.content }}</p>
                          <p :class="[
                            'text-xs mt-1',
                            message.sender === 'visitor' ? 'text-blue-100' : 'text-gray-500'
                          ]">
                            {{ formatTime(message.timestamp) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Zone de saisie pour takeover -->
                    <div v-if="isTakeoverMode" class="border-t border-gray-200 p-4">
                      <div class="flex items-center space-x-2">
                        <input
                          v-model="newMessage"
                          type="text"
                          placeholder="Tapez votre message..."
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          @keydown.enter="sendMessage"
                        />
                        <button
                          @click="sendMessage"
                          :disabled="!newMessage.trim()"
                          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          Envoyer
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Sidebar infos -->
                  <div class="w-80 border-l border-gray-200 p-6 bg-gray-50">
                    <h3 class="text-sm font-semibold text-gray-900 mb-4">Informations</h3>
                    
                    <div class="space-y-4">
                      <!-- Infos visiteur -->
                      <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visiteur
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          {{ conversation?.visitor_email || 'Email non fourni' }}
                        </dd>
                      </div>
                      
                      <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Adresse IP
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          {{ conversation?.visitor_ip }}
                        </dd>
                      </div>
                      
                      <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durée
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          {{ conversation?.duration || 'En cours...' }}
                        </dd>
                      </div>
                      
                      <!-- Commande associée -->
                      <div v-if="conversation?.order_amount">
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commande générée
                        </dt>
                        <dd class="mt-1">
                          <div class="bg-white rounded-lg p-3 border">
                            <p class="text-sm font-medium text-green-600">
                              {{ formatCurrency(conversation.order_amount) }}
                            </p>
                            <p class="text-xs text-gray-500">
                              {{ conversation.order_status }}
                            </p>
                          </div>
                        </dd>
                      </div>
                      
                      <!-- Actions -->
                      <div class="pt-4 border-t border-gray-200">
                        <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Actions
                        </h4>
                        <div class="space-y-2">
                          <button
                            v-if="conversation?.status === 'active' && !isTakeoverMode"
                            @click="startTakeover"
                            class="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Prendre le contrôle
                          </button>
                          
                          <button
                            v-if="isTakeoverMode"
                            @click="endTakeover"
                            class="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                          >
                            Rendre le contrôle à l'IA
                          </button>
                          
                          <button
                            @click="exportConversation"
                            class="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Exporter la conversation
                          </button>
                        </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon, UserIcon } from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  conversationId?: string
}

interface Emits {
  (e: 'update:show', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// État local
const loading = ref(false)
const isTakeoverMode = ref(false)
const newMessage = ref('')

// Données simulées
const conversation = ref({
  id: '1',
  visitor_email: 'client@example.com',
  visitor_ip: '192.168.1.1',
  status: 'completed',
  order_amount: 45000,
  order_status: 'confirmée',
  duration: '12 minutes',
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
})

const messages = ref([
  {
    id: '1',
    sender: 'ai',
    content: 'Bonjour ! Je suis Sophie, votre assistante virtuelle. Comment puis-je vous aider ?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    sender: 'visitor',
    content: 'Bonjour, je cherche un smartphone pour mon fils',
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    sender: 'ai',
    content: 'Parfait ! Quel est votre budget approximatif et quelles sont les fonctionnalités importantes pour vous ?',
    timestamp: new Date(Date.now() - 13 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    sender: 'visitor',
    content: 'Budget autour de 50 000 F CFA, et il aime prendre des photos',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  }
])

// Fonctions utilitaires
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const getStatusClass = (status?: string) => {
  const classes: Record<string, string> = {
    active: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    completed: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    abandoned: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }
  return classes[status || 'abandoned'] || classes.abandoned
}

const getStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    active: 'En cours',
    completed: 'Terminée',
    abandoned: 'Abandonnée'
  }
  return texts[status || 'abandoned'] || 'Inconnue'
}

// Actions
const closeModal = () => {
  emit('update:show', false)
  isTakeoverMode.value = false
  newMessage.value = ''
}

const startTakeover = () => {
  isTakeoverMode.value = true
  console.log('Prise de contrôle activée')
}

const endTakeover = () => {
  isTakeoverMode.value = false
  console.log('Contrôle rendu à l\'IA')
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  // Ajouter le message à la conversation
  messages.value.push({
    id: Date.now().toString(),
    sender: 'human',
    content: newMessage.value,
    timestamp: new Date().toISOString()
  })
  
  newMessage.value = ''
  console.log('Message envoyé')
}

const exportConversation = () => {
  console.log('Export de la conversation')
  // Ici implémenter l'export
}

// Charger les données quand l'ID change
watch(() => props.conversationId, (newId) => {
  if (newId && props.show) {
    console.log('Chargement de la conversation:', newId)
    // Ici faire l'appel API pour charger la vraie conversation
  }
})
</script>