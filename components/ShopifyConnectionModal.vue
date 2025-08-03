<!-- components/ShopifyConnectionModal.vue - MODAL CONNEXION SHOPIFY -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg mr-3">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.337 2.543c-.161-.026-.322-.04-.483-.04-2.688 0-4.516 1.859-4.516 4.516 0 .201.013.402.04.603l-3.027 3.027c-.201-.027-.402-.04-.603-.04C3.859 10.609 2 12.468 2 15.337c0 2.868 1.859 4.727 4.748 4.727 2.068 0 3.845-.966 4.395-2.401l3.246-3.246c.966.402 2.068.322 2.951-.241 1.449-.966 1.931-2.951.966-4.4-.563-.859-1.449-1.369-2.388-1.369-.322 0-.643.067-.946.188l-3.528-3.528c.121-.308.188-.629.188-.951 0-.939-.51-1.825-1.369-2.388-.668-.441-1.489-.632-2.294-.441zM15.337 3.71c.51-.081 1.047.081 1.449.402.643.429.859 1.208.644 1.852-.215.644-.859 1.047-1.503.93-.644-.134-1.127-.71-1.208-1.369-.081-.644.215-1.288.618-1.815zm-6.969 7.637c.215-.644.859-1.047 1.503-.93.644.134 1.127.71 1.208 1.369.081.644-.215 1.288-.618 1.815-.51.081-1.047-.081-1.449-.402-.643-.429-.859-1.208-.644-1.852zm-1.503 5.778c-2.147 0-3.888-1.741-3.888-3.888s1.741-3.888 3.888-3.888c.215 0 .429.027.644.067l-.617 2.628c-.027.107-.027.215 0 .322l.617 2.628c-.215.04-.429.067-.644.067z"/>
            </svg>
          </div>
          <h3 class="modal-title">Connecter Shopify</h3>
        </div>
        <button @click="$emit('close')" class="modal-close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="space-y-6">
          <!-- Connection Method Selection -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Méthode de connexion</h4>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="connectionMethod"
                  type="radio"
                  value="oauth"
                  class="form-radio h-4 w-4 text-green-600"
                >
                <span class="ml-3 text-sm">
                  <span class="text-gray-900 font-medium">OAuth (Recommandé)</span>
                  <span class="text-gray-500 block">Connexion sécurisée via Shopify</span>
                </span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="connectionMethod"
                  type="radio"
                  value="private"
                  class="form-radio h-4 w-4 text-green-600"
                >
                <span class="ml-3 text-sm">
                  <span class="text-gray-900 font-medium">App privée</span>
                  <span class="text-gray-500 block">Utiliser une app privée existante</span>
                </span>
              </label>
            </div>
          </div>

          <!-- OAuth Method -->
          <div v-if="connectionMethod === 'oauth'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                URL de votre boutique Shopify *
              </label>
              <div class="flex">
                <span class="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                  https://
                </span>
                <input
                  v-model="form.shopDomain"
                  type="text"
                  placeholder="votre-boutique"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  :class="{ 'border-red-500': errors.shopDomain }"
                >
                <span class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-lg">
                  .myshopify.com
                </span>
              </div>
              <p v-if="errors.shopDomain" class="text-red-500 text-xs mt-1">{{ errors.shopDomain }}</p>
              <p v-else class="text-gray-500 text-xs mt-1">
                Exemple : ma-boutique → https://ma-boutique.myshopify.com
              </p>
            </div>

            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-sm text-green-800 font-medium">Connexion sécurisée</p>
                  <p class="text-sm text-green-700 mt-1">
                    Vous serez redirigé vers Shopify pour autoriser l'accès. Aucun mot de passe requis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Private App Method -->
          <div v-if="connectionMethod === 'private'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                URL de votre boutique Shopify *
              </label>
              <input
                v-model="form.shopUrl"
                type="url"
                placeholder="https://votre-boutique.myshopify.com"
                class="input-modern w-full"
                :class="{ 'border-red-500': errors.shopUrl }"
              >
              <p v-if="errors.shopUrl" class="text-red-500 text-xs mt-1">{{ errors.shopUrl }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <input
                v-model="form.apiKey"
                type="text"
                placeholder="Votre clé API Shopify"
                class="input-modern w-full"
                :class="{ 'border-red-500': errors.apiKey }"
              >
              <p v-if="errors.apiKey" class="text-red-500 text-xs mt-1">{{ errors.apiKey }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                API Secret Key *
              </label>
              <input
                v-model="form.apiPassword"
                type="password"
                placeholder="Votre clé secrète API"
                class="input-modern w-full"
                :class="{ 'border-red-500': errors.apiPassword }"
              >
              <p v-if="errors.apiPassword" class="text-red-500 text-xs mt-1">{{ errors.apiPassword }}</p>
            </div>
            
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-sm text-blue-800 font-medium">Comment créer une app privée ?</p>
                  <ol class="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                    <li>Admin Shopify → Apps → Développer des apps</li>
                    <li>Créer une app → App privée personnalisée</li>
                    <li>Configuration → Admin API → Sélectionner les permissions : Products (read), Inventory (read)</li>
                    <li>Installer l'app et récupérer les clés API</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions Info -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h5 class="text-sm font-medium text-gray-900 mb-2">Permissions demandées :</h5>
            <ul class="text-sm text-gray-700 space-y-1">
              <li class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Lecture des produits et collections
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Lecture de l'inventaire et des prix
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Accès aux images et descriptions
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">
          Annuler
        </button>
        <button 
          @click="handleConnect" 
          :disabled="!isFormValid || connecting"
          class="btn-primary btn-green"
        >
          {{ connecting ? 'Connexion...' : 'Connecter Shopify' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ✅ EMITS
const emit = defineEmits<{
  close: []
  success: []
}>()

// ✅ REACTIVE STATE
const connecting = ref(false)
const connectionMethod = ref<'oauth' | 'private'>('oauth')

const form = ref({
  shopDomain: '',
  shopUrl: '',
  apiKey: '',
  apiPassword: ''
})

const errors = ref({
  shopDomain: '',
  shopUrl: '',
  apiKey: '',
  apiPassword: ''
})

// ✅ COMPUTED
const isFormValid = computed(() => {
  if (connectionMethod.value === 'oauth') {
    return form.value.shopDomain.trim() !== '' && !errors.value.shopDomain
  } else {
    return form.value.shopUrl.trim() !== '' && 
           form.value.apiKey.trim() !== '' && 
           form.value.apiPassword.trim() !== '' &&
           !errors.value.shopUrl && 
           !errors.value.apiKey && 
           !errors.value.apiPassword
  }
})

// ✅ VALIDATION
const validateForm = () => {
  // Reset errors
  errors.value = {
    shopDomain: '',
    shopUrl: '',
    apiKey: '',
    apiPassword: ''
  }

  if (connectionMethod.value === 'oauth') {
    if (!form.value.shopDomain.trim()) {
      errors.value.shopDomain = 'Le nom de boutique est requis'
      return false
    }
    
    // Validate shop domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/
    if (!domainRegex.test(form.value.shopDomain)) {
      errors.value.shopDomain = 'Format invalide (lettres, chiffres et tirets uniquement)'
      return false
    }
  } else {
    if (!form.value.shopUrl.trim()) {
      errors.value.shopUrl = 'L\'URL de la boutique est requise'
      return false
    }
    
    if (!form.value.shopUrl.includes('.myshopify.com')) {
      errors.value.shopUrl = 'L\'URL doit contenir .myshopify.com'
      return false
    }
    
    if (!form.value.apiKey.trim()) {
      errors.value.apiKey = 'La clé API est requise'
      return false
    }
    
    if (!form.value.apiPassword.trim()) {
      errors.value.apiPassword = 'La clé secrète est requise'
      return false
    }
  }

  return true
}

// ✅ CONNECTION HANDLER
const handleConnect = async () => {
  if (!validateForm()) return

  connecting.value = true

  try {
    if (connectionMethod.value === 'oauth') {
      // OAuth flow - redirect to Shopify
      const shopUrl = `https://${form.value.shopDomain}.myshopify.com`
      
      // TODO: Replace with actual OAuth implementation
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store connection info
      const connectionData = {
        method: 'oauth',
        shopUrl,
        shopDomain: form.value.shopDomain,
        connectedAt: new Date().toISOString()
      }
      
      // TODO: Save to Supabase/backend
      localStorage.setItem('shopify_connection', JSON.stringify(connectionData))
      
    } else {
      // Private app flow
      const connectionData = {
        method: 'private',
        shopUrl: form.value.shopUrl,
        apiKey: form.value.apiKey,
        apiPassword: form.value.apiPassword,
        connectedAt: new Date().toISOString()
      }
      
      // TODO: Test connection and save to backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // TODO: Save to Supabase/backend (encrypted)
      localStorage.setItem('shopify_connection', JSON.stringify({
        method: 'private',
        shopUrl: connectionData.shopUrl,
        connectedAt: connectionData.connectedAt
        // Don't store sensitive keys in localStorage in production
      }))
    }

    emit('success')
    emit('close')
    
  } catch (error: any) {
    console.error('Shopify connection error:', error)
    // TODO: Show error notification
  } finally {
    connecting.value = false
  }
}
</script>

<style scoped>
/* ✅ MODAL STYLES */
.modal-overlay {
  @apply fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply flex items-center justify-end space-x-3 p-6 border-t border-gray-200;
}

/* ✅ FORM STYLES */
.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
}

.btn-green {
  @apply bg-green-600 hover:bg-green-700;
}

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}

.form-radio {
  @apply border-gray-300 text-green-600 focus:ring-green-500;
}
</style>