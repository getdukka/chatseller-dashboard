<!-- pages/orders/create.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.back()"
              class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Créer une commande</h1>
              <p class="text-gray-600">Finaliser la commande depuis la conversation</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Données de la conversation -->
        <div v-if="orderData" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de la conversation</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-sm font-medium text-gray-700">Client</label>
              <p class="text-gray-900 font-medium">{{ orderData.visitorName || 'Client anonyme' }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-700">Email</label>
              <p class="text-gray-900">{{ orderData.visitorEmail || 'Non renseigné' }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-700">Téléphone</label>
              <p class="text-gray-900">{{ orderData.visitorPhone || 'Non renseigné' }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-700">Conversation</label>
              <p class="text-gray-900 font-mono text-sm">{{ orderData.conversationId?.slice(-8) }}</p>
            </div>
            
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Produit</label>
              <p class="text-gray-900 font-medium">{{ orderData.productName || 'Produit non spécifié' }}</p>
              <p v-if="orderData.productPrice" class="text-green-600 font-semibold">
                {{ formatCurrency(orderData.productPrice) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Formulaire de commande -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Détails de la commande</h2>
          
          <form @submit.prevent="createOrder" class="space-y-6">
            <!-- Informations client -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  v-model="form.customerName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom du client"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  v-model="form.customerEmail"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  v-model="form.customerPhone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Statut de la commande
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                </select>
              </div>
            </div>

            <!-- Produit et prix -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Produit *
                </label>
                <input
                  v-model="form.productName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom du produit"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Prix (€) *
                </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <!-- Adresse de livraison -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Adresse de livraison
              </label>
              <textarea
                v-model="form.shippingAddress"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Adresse complète de livraison"
              ></textarea>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notes de commande
              </label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notes ou instructions spéciales..."
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="$router.back()"
                class="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              
              <div class="space-x-3">
                <button
                  type="button"
                  @click="saveDraft"
                  class="px-6 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  :disabled="saving"
                >
                  Sauvegarder brouillon
                </button>
                
                <button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  :disabled="saving"
                >
                  {{ saving ? 'Création...' : 'Créer la commande' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button @click="notification.show = false" class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

// STATE
const saving = ref(false)
const orderData = ref<any>(null)

const form = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  productName: '',
  price: 0,
  status: 'pending',
  shippingAddress: '',
  notes: ''
})

const notification = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

// METHODS
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

const loadOrderData = () => {
  // Récupérer les données depuis sessionStorage
  if (process.client) {
    const storedData = sessionStorage.getItem('orderData')
    if (storedData) {
      try {
        orderData.value = JSON.parse(storedData)
        
        // Pré-remplir le formulaire avec les données de la conversation
        form.value.customerName = orderData.value.visitorName || ''
        form.value.customerEmail = orderData.value.visitorEmail || ''
        form.value.customerPhone = orderData.value.visitorPhone || ''
        form.value.productName = orderData.value.productName || ''
        form.value.price = orderData.value.productPrice || 0
        
      } catch (e) {
        console.error('Erreur parsing orderData:', e)
      }
    }
  }
}

const createOrder = async () => {
  saving.value = true
  
  try {
    // Simulation de création de commande
    console.log('Création commande:', {
      ...form.value,
      conversationId: orderData.value?.conversationId
    })
    
    // TODO: Remplacer par vraie API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showNotification('Commande créée avec succès!')
    
    // Rediriger vers la liste des commandes ou dashboard
    setTimeout(() => {
      navigateTo('/conversations')
    }, 2000)
    
  } catch (error) {
    console.error('Erreur création commande:', error)
    showNotification('Erreur lors de la création de la commande', 'error')
  } finally {
    saving.value = false
  }
}

const saveDraft = async () => {
  saving.value = true
  
  try {
    // Simulation de sauvegarde brouillon
    console.log('Sauvegarde brouillon:', form.value)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showNotification('Brouillon sauvegardé')
    
  } catch (error) {
    console.error('Erreur sauvegarde brouillon:', error)
    showNotification('Erreur lors de la sauvegarde', 'error')
  } finally {
    saving.value = false
  }
}

// LIFECYCLE
onMounted(() => {
  loadOrderData()
})

// SEO
useHead({
  title: 'Créer une commande - ChatSeller Dashboard'
})
</script>

<style scoped>
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>