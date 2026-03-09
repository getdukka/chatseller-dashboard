<!-- pages/orders/create.vue -->
<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 md:px-8 py-5">
      <div class="max-w-4xl mx-auto flex items-center gap-4">
        <button
          @click="$router.back()"
          class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-gray-900">Créer une commande</h1>
          <p class="text-sm text-gray-500 mt-0.5">Finaliser la commande depuis la conversation</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 md:px-8 py-6">
      <div class="max-w-4xl mx-auto space-y-5">

        <!-- Données de la conversation -->
        <div v-if="orderData" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--color-primary-light);">
              <svg class="w-4 h-4" style="color: var(--color-brand-rose);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <h2 class="text-base font-semibold text-gray-900">Informations de la conversation</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Client</p>
              <p class="text-sm font-medium text-gray-900">{{ orderData.visitorName || 'Anonyme' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Email</p>
              <p class="text-sm font-medium text-gray-900 truncate">{{ orderData.visitorEmail || '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">Téléphone</p>
              <p class="text-sm font-medium text-gray-900">{{ orderData.visitorPhone || '—' }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-500 mb-1">ID Conversation</p>
              <p class="text-sm font-mono text-gray-900">···{{ orderData.conversationId?.slice(-8) }}</p>
            </div>
            <div v-if="orderData.productName" class="col-span-2 md:col-span-4 bg-rose-50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p class="text-xs text-rose-600 mb-0.5">Produit de la conversation</p>
                <p class="text-sm font-medium text-gray-900">{{ orderData.productName }}</p>
              </div>
              <p v-if="orderData.productPrice" class="text-base font-bold" style="color: var(--color-brand-rose);">
                {{ formatCurrency(orderData.productPrice) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Formulaire de commande -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--color-primary-light);">
              <svg class="w-4 h-4" style="color: var(--color-brand-rose);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h2 class="text-base font-semibold text-gray-900">Détails de la commande</h2>
          </div>

          <form @submit.prevent="createOrder" class="space-y-5">
            <!-- Client -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Client</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom complet <span class="text-rose-500">*</span></label>
                  <input
                    v-model="form.customerName"
                    type="text"
                    required
                    class="form-input"
                    placeholder="Nom du client"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Email <span class="text-rose-500">*</span></label>
                  <input
                    v-model="form.customerEmail"
                    type="email"
                    required
                    class="form-input"
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                  <input
                    v-model="form.customerPhone"
                    type="tel"
                    class="form-input"
                    placeholder="+221 77 000 00 00"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Statut</label>
                  <select v-model="form.status" class="form-input">
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-100"></div>

            <!-- Produit -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Produit</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Produit <span class="text-rose-500">*</span></label>
                  <input
                    v-model="form.productName"
                    type="text"
                    required
                    class="form-input"
                    placeholder="Nom du produit"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Prix <span class="text-rose-500">*</span></label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="form-input"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-100"></div>

            <!-- Livraison & Notes -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Livraison & Notes</p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Adresse de livraison</label>
                  <textarea
                    v-model="form.shippingAddress"
                    rows="2"
                    class="form-input"
                    placeholder="Adresse complète de livraison"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                  <textarea
                    v-model="form.notes"
                    rows="2"
                    class="form-input"
                    placeholder="Instructions spéciales..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between pt-5 border-t border-gray-100">
              <button
                type="button"
                @click="$router.back()"
                class="px-5 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Annuler
              </button>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="saveDraft"
                  class="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors btn-brand-secondary"
                  :disabled="saving"
                >
                  Brouillon
                </button>
                <button
                  type="submit"
                  class="px-5 py-2.5 text-sm font-medium rounded-lg disabled:opacity-50 btn-brand-primary"
                  :disabled="saving"
                >
                  <span v-if="saving" class="flex items-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Création...
                  </span>
                  <span v-else>Créer la commande</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="notification.show"
        class="fixed bottom-4 right-4 max-w-sm bg-white shadow-lg rounded-xl border z-50 overflow-hidden"
        :class="notification.type === 'success' ? 'border-green-200' : 'border-red-200'"
      >
        <div class="p-4 flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            :class="notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'"
          >
            <svg v-if="notification.type === 'success'" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-900 flex-1">{{ notification.message }}</p>
          <button @click="notification.show = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
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
.form-input {
  @apply w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm transition-colors;
  outline: none;
}
.form-input:focus {
  border-color: var(--color-brand-rose);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.btn-brand-primary {
  background-color: var(--color-primary);
  color: #ffffff;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.btn-brand-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(234, 66, 66, 0.25);
}

.btn-brand-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  transition: background-color 0.2s ease;
}
.btn-brand-secondary:hover:not(:disabled) {
  background-color: var(--color-primary-light);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>