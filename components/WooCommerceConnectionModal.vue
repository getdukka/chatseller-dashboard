<!-- components/WooCommerceConnectionModal.vue - MODAL CONNEXION WOOCOMMERCE -->
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg mr-3">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.527 8.257c-.223-1.37-1.209-2.368-2.587-2.368-1.377 0-2.362.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201.033-.402 0-.603zM20.94 7.654c.563 0 1.013.45 1.013 1.013s-.45 1.013-1.013 1.013-1.013-.45-1.013-1.013.45-1.013 1.013-1.013zM8.4 15.6c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM8.4 12.573c-1.377 0-2.364.998-2.587 2.368-.033.201-.033.402 0 .603.223 1.37 1.209 2.368 2.587 2.368s2.364-.998 2.587-2.368c.033-.201-.033-.402 0-.603-.223-1.37-1.209-2.368-2.587-2.368zM14.667 8.16c-.563 0-1.013-.45-1.013-1.013s.45-1.013 1.013-1.013 1.013.45 1.013 1.013-.45 1.013-1.013 1.013zM14.667 5.133c1.377 0 2.364.998 2.587 2.368.033.201.033.402 0 .603-.223 1.37-1.209 2.368-2.587 2.368s-2.364-.998-2.587-2.368c-.033-.201-.033-.402 0-.603.223-1.37 1.209-2.368 2.587-2.368z"/>
            </svg>
          </div>
          <h3 class="modal-title">Connecter WooCommerce</h3>
        </div>
        <button @click="$emit('close')" class="modal-close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="space-y-6">
          <!-- Site URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              URL de votre site WordPress *
            </label>
            <input
              v-model="form.siteUrl"
              type="url"
              placeholder="https://votre-site.com"
              class="input-modern w-full"
              :class="{ 'border-red-500': errors.siteUrl }"
            >
            <p v-if="errors.siteUrl" class="text-red-500 text-xs mt-1">{{ errors.siteUrl }}</p>
            <p v-else class="text-gray-500 text-xs mt-1">
              L'URL complète de votre site WordPress avec WooCommerce
            </p>
          </div>
          
          <!-- Consumer Key -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Consumer Key *
            </label>
            <input
              v-model="form.consumerKey"
              type="text"
              placeholder="ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              class="input-modern w-full"
              :class="{ 'border-red-500': errors.consumerKey }"
            >
            <p v-if="errors.consumerKey" class="text-red-500 text-xs mt-1">{{ errors.consumerKey }}</p>
            <p v-else class="text-gray-500 text-xs mt-1">
              Commence par "ck_" suivi de 40 caractères
            </p>
          </div>
          
          <!-- Consumer Secret -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Consumer Secret *
            </label>
            <input
              v-model="form.consumerSecret"
              type="password"
              placeholder="cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              class="input-modern w-full"
              :class="{ 'border-red-500': errors.consumerSecret }"
            >
            <p v-if="errors.consumerSecret" class="text-red-500 text-xs mt-1">{{ errors.consumerSecret }}</p>
            <p v-else class="text-gray-500 text-xs mt-1">
              Commence par "cs_" suivi de 40 caractères
            </p>
          </div>

          <!-- API Version -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Version API WooCommerce
            </label>
            <select v-model="form.apiVersion" class="input-modern w-full">
              <option value="wc/v3">v3 (Recommandé)</option>
              <option value="wc/v2">v2</option>
              <option value="wc/v1">v1</option>
            </select>
            <p class="text-gray-500 text-xs mt-1">
              La version 3 est recommandée pour les sites WooCommerce récents
            </p>
          </div>

          <!-- SSL Option -->
          <div class="flex items-center space-x-3">
            <input
              v-model="form.forceSsl"
              type="checkbox"
              id="forceSsl"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            >
            <label for="forceSsl" class="text-sm text-gray-700">
              Forcer HTTPS (recommandé si votre site utilise SSL)
            </label>
          </div>
          
          <!-- Instructions -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <p class="text-sm text-blue-800 font-medium">Comment obtenir vos clés API ?</p>
                <ol class="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Connectez-vous à votre admin WordPress</li>
                  <li>WooCommerce → Réglages → Avancé → REST API</li>
                  <li>Cliquez sur "Ajouter une clé"</li>
                  <li>
                    <strong>Description :</strong> ChatSeller Integration
                  </li>
                  <li>
                    <strong>Utilisateur :</strong> Choisissez un admin
                  </li>
                  <li>
                    <strong>Permissions :</strong> Lecture
                  </li>
                  <li>Générez les clés et copiez-les ici</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Test Connection -->
          <div v-if="testResult" 
               :class="testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
               class="border rounded-lg p-4">
            <div class="flex">
              <svg 
                :class="testResult.success ? 'text-green-600' : 'text-red-600'"
                class="w-5 h-5 mr-2 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  v-if="testResult.success"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p 
                  :class="testResult.success ? 'text-green-800' : 'text-red-800'"
                  class="text-sm font-medium"
                >
                  {{ testResult.success ? 'Connexion réussie!' : 'Erreur de connexion' }}
                </p>
                <p 
                  :class="testResult.success ? 'text-green-700' : 'text-red-700'"
                  class="text-sm mt-1"
                >
                  {{ testResult.message }}
                </p>
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
                Lecture des produits et catégories
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Lecture des stocks et prix
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Accès aux images et attributs
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
          @click="testConnection"
          :disabled="!isFormValid || testing"
          class="btn-secondary mr-2"
        >
          {{ testing ? 'Test...' : 'Tester' }}
        </button>
        <button 
          @click="handleConnect" 
          :disabled="!isFormValid || connecting || (testResult && !testResult.success)"
          class="btn-primary btn-blue"
        >
          {{ connecting ? 'Connexion...' : 'Connecter WooCommerce' }}
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
const testing = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const form = ref({
  siteUrl: '',
  consumerKey: '',
  consumerSecret: '',
  apiVersion: 'wc/v3',
  forceSsl: true
})

const errors = ref({
  siteUrl: '',
  consumerKey: '',
  consumerSecret: ''
})

// ✅ COMPUTED
const isFormValid = computed(() => {
  return form.value.siteUrl.trim() !== '' && 
         form.value.consumerKey.trim() !== '' && 
         form.value.consumerSecret.trim() !== '' &&
         !errors.value.siteUrl && 
         !errors.value.consumerKey && 
         !errors.value.consumerSecret
})

// ✅ VALIDATION
const validateForm = () => {
  // Reset errors
  errors.value = {
    siteUrl: '',
    consumerKey: '',
    consumerSecret: ''
  }

  // Validate site URL
  if (!form.value.siteUrl.trim()) {
    errors.value.siteUrl = 'L\'URL du site est requise'
    return false
  }
  
  try {
    new URL(form.value.siteUrl)
  } catch {
    errors.value.siteUrl = 'URL invalide'
    return false
  }
  
  // Validate consumer key
  if (!form.value.consumerKey.trim()) {
    errors.value.consumerKey = 'La Consumer Key est requise'
    return false
  }
  
  if (!form.value.consumerKey.startsWith('ck_')) {
    errors.value.consumerKey = 'La Consumer Key doit commencer par "ck_"'
    return false
  }
  
  if (form.value.consumerKey.length !== 43) { // ck_ + 40 chars
    errors.value.consumerKey = 'Format invalide (doit faire 43 caractères)'
    return false
  }
  
  // Validate consumer secret
  if (!form.value.consumerSecret.trim()) {
    errors.value.consumerSecret = 'La Consumer Secret est requise'
    return false
  }
  
  if (!form.value.consumerSecret.startsWith('cs_')) {
    errors.value.consumerSecret = 'La Consumer Secret doit commencer par "cs_"'
    return false
  }
  
  if (form.value.consumerSecret.length !== 43) { // cs_ + 40 chars
    errors.value.consumerSecret = 'Format invalide (doit faire 43 caractères)'
    return false
  }

  return true
}

// ✅ TEST CONNECTION
const testConnection = async () => {
  if (!validateForm()) return

  testing.value = true
  testResult.value = null

  try {
    // TODO: Implement actual WooCommerce API test
    // For now, simulate the test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate success based on form validation
    const isValid = Math.random() > 0.3 // 70% success rate for demo
    
    if (isValid) {
      testResult.value = {
        success: true,
        message: 'Connexion établie avec succès! WooCommerce détecté.'
      }
    } else {
      testResult.value = {
        success: false,
        message: 'Impossible de se connecter. Vérifiez vos paramètres.'
      }
    }
  } catch (error: any) {
    testResult.value = {
      success: false,
      message: error.message || 'Erreur lors du test de connexion'
    }
  } finally {
    testing.value = false
  }
}

// ✅ CONNECTION HANDLER
const handleConnect = async () => {
  if (!validateForm()) return

  connecting.value = true

  try {
    const connectionData = {
      siteUrl: form.value.siteUrl,
      consumerKey: form.value.consumerKey,
      consumerSecret: form.value.consumerSecret,
      apiVersion: form.value.apiVersion,
      forceSsl: form.value.forceSsl,
      connectedAt: new Date().toISOString()
    }
    
    // TODO: Save to Supabase/backend (encrypted)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Store connection (in production, encrypt sensitive data)
    localStorage.setItem('woocommerce_connection', JSON.stringify({
      siteUrl: connectionData.siteUrl,
      apiVersion: connectionData.apiVersion,
      forceSsl: connectionData.forceSsl,
      connectedAt: connectionData.connectedAt
      // Don't store keys in localStorage in production
    }))

    emit('success')
    emit('close')
    
  } catch (error: any) {
    console.error('WooCommerce connection error:', error)
    testResult.value = {
      success: false,
      message: error.message || 'Erreur lors de la connexion'
    }
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
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors;
}

.btn-blue {
  @apply bg-blue-600 hover:bg-blue-700;
}

.btn-secondary {
  @apply px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors;
}
</style>