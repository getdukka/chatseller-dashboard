<!-- pages/conversations/[id].vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la page -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Bouton retour -->
            <button
              @click="$router.back()"
              class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <!-- Informations de la conversation -->
            <div v-if="conversation">
              <div class="flex items-center space-x-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span class="text-sm font-medium text-blue-700">
                    {{ getInitials(conversation.visitorName) }}
                  </span>
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900">
                    {{ conversation.visitorName || 'Visiteur anonyme' }}
                  </h1>
                  <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{{ conversation.visitorEmail }}</span>
                    <span class="badge" :class="getStatusBadgeClass(conversation.status)">
                      {{ getStatusLabel(conversation.status) }}
                    </span>
                    <span>{{ formatDate(conversation.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button
              @click="markAsRead"
              v-if="conversation?.unreadCount > 0"
              class="btn-secondary"
            >
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Marquer comme lu
            </button>

            <div class="relative">
              <button
                @click="showActionsMenu = !showActionsMenu"
                class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>

              <!-- Menu d'actions -->
              <div
                v-if="showActionsMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
              >
                <div class="py-1">
                  <button
                    @click="assignToAgent"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Assigner à un agent
                  </button>
                  <button
                    @click="exportConversation"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Exporter
                  </button>
                  <hr class="my-1">
                  <button
                    @click="deleteConversation"
                    class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="flex h-screen pt-16">
      <!-- Zone de chat -->
      <div class="flex-1 flex flex-col">
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>

          <div v-else-if="messages.length > 0" class="space-y-4 max-w-4xl mx-auto">
            <div
              v-for="message in messages"
              :key="message.id"
              class="flex"
              :class="message.sender === 'visitor' ? 'justify-end' : 'justify-start'"
            >
              <!-- Message de l'agent -->
              <div
                v-if="message.sender === 'agent'"
                class="flex items-start space-x-3 max-w-lg"
              >
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                  <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                  <div class="text-sm font-medium text-gray-900 mb-1">Agent IA</div>
                  <div class="text-gray-800 whitespace-pre-wrap">{{ message.content }}</div>
                  <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</div>
                    <div class="flex items-center space-x-2">
                      <!-- Boutons d'actions -->
                      <button
                        @click="copyMessage(message.content)"
                        class="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title="Copier"
                      >
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <div
                        v-if="message.confidence !== undefined"
                        class="flex items-center space-x-1"
                        :title="`Confiance: ${message.confidence}%`"
                      >
                        <div class="w-2 h-2 rounded-full" :class="getConfidenceColor(message.confidence)"></div>
                        <span class="text-xs text-gray-500">{{ message.confidence }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Message du visiteur -->
              <div
                v-else
                class="flex items-start space-x-3 max-w-lg"
              >
                <div class="bg-blue-600 text-white rounded-lg p-3">
                  <div class="text-white whitespace-pre-wrap">{{ message.content }}</div>
                  <div class="text-blue-100 text-xs mt-2 text-right">{{ formatTime(message.timestamp) }}</div>
                </div>
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                  <span class="text-xs font-medium text-gray-600">
                    {{ getInitials(conversation?.visitorName || 'V') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- État vide -->
          <div v-else class="flex justify-center items-center h-full">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun message</h3>
              <p class="mt-1 text-sm text-gray-500">Cette conversation n'a pas encore de messages</p>
            </div>
          </div>
        </div>

        <!-- Zone de saisie (si intervention manuelle possible) -->
        <div v-if="conversation?.status === 'active'" class="bg-white border-t border-gray-200 p-4">
          <div class="max-w-4xl mx-auto">
            <div class="flex items-end space-x-3">
              <div class="flex-1">
                <textarea
                  v-model="newMessage"
                  rows="2"
                  placeholder="Tapez votre message..."
                  class="input-primary resize-none"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="null"
                />
              </div>
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="btn-primary"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
            </p>
          </div>
        </div>
      </div>

      <!-- Sidebar droite avec informations -->
      <div class="w-80 bg-white border-l border-gray-200">
        <div class="p-6 space-y-6">
          <!-- Informations du visiteur -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informations visiteur</h3>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-700">Nom</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ conversation?.visitorName || 'Non renseigné' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Email</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ conversation?.visitorEmail || 'Non renseigné' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Téléphone</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ conversation?.visitorPhone || 'Non renseigné' }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Première visite</label>
                <p class="text-sm text-gray-900 mt-1">
                  {{ formatDate(conversation?.createdAt) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Métriques de la conversation -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Métriques</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Messages échangés</span>
                <span class="text-sm font-medium text-gray-900">{{ messages.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Durée</span>
                <span class="text-sm font-medium text-gray-900">{{ getConversationDuration() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Temps de réponse moyen</span>
                <span class="text-sm font-medium text-gray-900">< 2s</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-700">Satisfaction</span>
                <span class="text-sm font-medium text-green-600">Positive</span>
              </div>
            </div>
          </div>

          <!-- Page source -->
          <div v-if="conversation?.sourcePage">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Page source</h3>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-sm font-medium text-gray-900 mb-1">
                {{ conversation.sourcePage.title }}
              </p>
              <p class="text-sm text-gray-600">
                {{ conversation.sourcePage.url }}
              </p>
            </div>
          </div>

          <!-- Actions rapides -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
            <div class="space-y-2">
              <button
                @click="createOrder"
                class="w-full btn-primary btn-sm"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Créer une commande
              </button>
              <button
                @click="sendEmail"
                class="w-full btn-secondary btn-sm"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyer un email
              </button>
              <button
                @click="addNote"
                class="w-full btn-secondary btn-sm"
              >
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Ajouter une note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// Middleware d'authentification
definePageMeta({
  middleware: 'auth'
})

// Paramètres de la route
const route = useRoute()
const conversationId = route.params.id as string

// Types
interface Message {
  id: string
  sender: 'visitor' | 'agent'
  content: string
  timestamp: string
  confidence?: number
}

interface Conversation {
  id: string
  visitorName: string
  visitorEmail?: string
  visitorPhone?: string
  status: 'active' | 'pending' | 'completed' | 'abandoned'
  unreadCount: number
  createdAt: string
  updatedAt: string
  sourcePage?: {
    title: string
    url: string
  }
}

// État du composant
const loading = ref(true)
const showActionsMenu = ref(false)
const newMessage = ref('')

// Données
const conversation = ref<Conversation | null>(null)
const messages = ref<Message[]>([])

// Méthodes utilitaires
const getInitials = (name: string): string => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const getStatusLabel = (status: string): string => {
  const labels = {
    active: 'Active',
    pending: 'En attente',
    completed: 'Terminée',
    abandoned: 'Abandonnée'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    active: 'badge-success',
    pending: 'badge-warning',
    completed: 'badge-primary',
    abandoned: 'badge-gray'
  }
  return classes[status as keyof typeof classes] || 'badge-gray'
}

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return 'bg-green-500'
  if (confidence >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getConversationDuration = (): string => {
  if (!conversation.value || messages.value.length === 0) return 'N/A'
  
  const start = new Date(conversation.value.createdAt)
  const end = new Date(messages.value[messages.value.length - 1].timestamp)
  const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  
  if (diffMinutes < 1) return '< 1min'
  if (diffMinutes < 60) return `${diffMinutes}min`
  
  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60
  return `${hours}h ${mins}min`
}

// Actions
const loadConversation = async () => {
  loading.value = true
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Données simulées
    conversation.value = {
      id: conversationId,
      visitorName: 'Marie Dubois',
      visitorEmail: 'marie.dubois@email.com',
      visitorPhone: '+33 6 12 34 56 78',
      status: 'active',
      unreadCount: 2,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      sourcePage: {
        title: 'Produit Premium - Notre meilleur produit',
        url: 'https://monsite.com/produit-premium'
      }
    }

    messages.value = [
      {
        id: '1',
        sender: 'agent',
        content: 'Bonjour ! Je suis Sophie, votre assistante commerciale. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        confidence: 95
      },
      {
        id: '2',
        sender: 'visitor',
        content: 'Bonjour ! J\'aimerais avoir plus d\'informations sur le produit premium que je regarde.',
        timestamp: new Date(Date.now() - 44 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        sender: 'agent',
        content: 'Excellente question ! Le produit premium est notre solution la plus complète. Il inclut :\n\n• Toutes les fonctionnalités avancées\n• Support prioritaire 24/7\n• Garantie étendue de 3 ans\n• Formation personnalisée incluse\n\nSouhaitez-vous que je vous explique une fonctionnalité en particulier ?',
        timestamp: new Date(Date.now() - 43 * 60 * 1000).toISOString(),
        confidence: 88
      },
      {
        id: '4',
        sender: 'visitor',
        content: 'Oui, j\'aimerais en savoir plus sur le support prioritaire. Comment ça fonctionne exactement ?',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        sender: 'agent',
        content: 'Le support prioritaire vous garantit :\n\n✅ Réponse en moins de 2 heures\n✅ Ligne directe dédiée\n✅ Accès à nos experts techniques\n✅ Résolution prioritaire des problèmes\n\nDe plus, vous avez accès à notre portail client exclusif avec des ressources avancées. Cela vous intéresse-t-il ?',
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        confidence: 92
      },
      {
        id: '6',
        sender: 'visitor',
        content: 'Ça semble parfait ! Et quel est le prix ?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        sender: 'agent',
        content: 'Le produit premium est à 199€/mois. Mais j\'ai une excellente nouvelle : nous avons une promotion spéciale ce mois-ci avec 20% de réduction sur les 3 premiers mois, soit 159€/mois.\n\nDe plus, si vous commandez aujourd\'hui, la formation personnalisée (valeur 300€) est offerte. Souhaitez-vous que je prépare votre commande ?',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        confidence: 85
      }
    ]

  } catch (error) {
    console.error('Erreur lors du chargement de la conversation:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = async () => {
  try {
    // Appel API pour marquer comme lu
    if (conversation.value) {
      conversation.value.unreadCount = 0
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const message: Message = {
    id: Date.now().toString(),
    sender: 'agent',
    content: newMessage.value.trim(),
    timestamp: new Date().toISOString(),
    confidence: 95
  }

  messages.value.push(message)
  newMessage.value = ''

  try {
    // Appel API pour envoyer le message
    console.log('Message envoyé:', message)
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
  }
}

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    console.log('✅ Message copié')
  } catch (error) {
    console.error('❌ Erreur lors de la copie:', error)
  }
}

const assignToAgent = () => {
  console.log('Assigner à un agent')
  showActionsMenu.value = false
}

const exportConversation = () => {
  console.log('Exporter conversation')
  showActionsMenu.value = false
}

const deleteConversation = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
    console.log('Supprimer conversation')
    navigateTo('/conversations')
  }
  showActionsMenu.value = false
}

const createOrder = () => {
  console.log('Créer une commande')
}

const sendEmail = () => {
  console.log('Envoyer un email')
}

const addNote = () => {
  console.log('Ajouter une note')
}

// Fermer le menu d'actions en cliquant ailleurs
const closeActionMenu = (event: Event) => {
  if (showActionsMenu.value && !(event.target as Element).closest('.relative')) {
    showActionsMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadConversation()
  document.addEventListener('click', closeActionMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeActionMenu)
})
</script>

<style scoped>
/* Styles spécifiques pour la page de conversation */
.chat-message-enter-active,
.chat-message-leave-active {
  transition: all 0.3s ease-in-out;
}

.chat-message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.chat-message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>