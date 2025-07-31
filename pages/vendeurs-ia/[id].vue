<!-- pages/vendeurs-ia/[id].vue - VERSION API BACKEND -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Debug Info -->
    <div v-if="debugMode" class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <h3 class="text-yellow-800 font-medium">🔧 Mode Debug</h3>
      <div class="text-yellow-700 text-sm mt-2">
        <p><strong>Agent ID:</strong> {{ agentId }}</p>
        <p><strong>API URL:</strong> {{ apiUrl }}</p>
        <p><strong>Auth Token:</strong> {{ authStore.token ? '✅ Présent' : '❌ Manquant' }}</p>
        <p><strong>Loading:</strong> {{ loading }}</p>
        <p><strong>Error:</strong> {{ error || 'Aucune' }}</p>
        <p><strong>Agent chargé:</strong> {{ agent ? '✅ Oui' : '❌ Non' }}</p>
        <div v-if="debugInfo" class="mt-2 p-2 bg-yellow-50 rounded text-xs">
          <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                Configuration - {{ agent?.name || 'Vendeur IA' }}
              </h1>
              <p class="mt-1 text-gray-600">
                Configurez votre agent commercial et sa base de connaissance
              </p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="debugMode = !debugMode"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔧 Debug
            </button>
            
            <button
              @click="reloadAgent"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Recharger
            </button>
            
            <button
              @click="saveConfiguration"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="inline-flex items-center space-x-3">
        <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span class="text-lg text-gray-600">Chargement depuis l'API backend...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-red-900">Erreur API Backend</h3>
        <p class="mt-2 text-red-700">{{ error }}</p>
        <div class="mt-4 space-x-2">
          <button 
            @click="loadAgent"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
          <button 
            @click="checkAuth"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Vérifier Auth
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="agent" class="p-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Configuration Panel -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Agent Settings -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Paramètres de l'Agent</h3>
            
            <div class="space-y-6">
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'agent</label>
                <input
                  v-model="config.name"
                  type="text"
                  class="input-modern w-full"
                  :placeholder="agent.name"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type d'agent</label>
                <select v-model="config.type" class="input-modern w-full">
                  <option value="general">Vendeur généraliste</option>
                  <option value="product_specialist">Spécialiste produit</option>
                  <option value="support">Support & SAV</option>
                  <option value="upsell">Upsell & Cross-sell</option>
                </select>
              </div>

              <!-- Messages -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message d'accueil</label>
                <textarea
                  v-model="config.welcomeMessage"
                  rows="3"
                  class="input-modern w-full"
                  :placeholder="agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message de fallback</label>
                <textarea
                  v-model="config.fallbackMessage"
                  rows="2"
                  class="input-modern w-full"
                  :placeholder="agent.fallbackMessage || 'Je transmets votre question à notre équipe...'"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Knowledge Base -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">Base de Connaissance</h3>
              <NuxtLink 
                to="/knowledge-base"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Gérer
              </NuxtLink>
            </div>
            
            <div v-if="knowledgeBase.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h4 class="mt-4 text-lg font-medium text-gray-900">Aucun document</h4>
              <p class="mt-2 text-gray-500">Ajoutez des documents pour enrichir les connaissances de votre agent.</p>
              <NuxtLink 
                to="/knowledge-base"
                class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter des documents
              </NuxtLink>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="doc in knowledgeBase"
                :key="doc.id"
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">{{ doc.title }}</h4>
                    <p class="text-xs text-gray-500">{{ doc.contentType }} • {{ doc.tags?.join(', ') || 'Aucun tag' }}</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Actif
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Commercial Settings -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuration Commerciale</h3>
            
            <div class="space-y-6">
              <!-- Collection d'informations -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Informations à collecter</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input v-model="config.collectName" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Nom complet</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.collectPhone" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Numéro de téléphone</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.collectAddress" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Adresse de livraison</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.collectPayment" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Mode de paiement préféré</span>
                  </label>
                </div>
              </div>

              <!-- Upsell -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Propositions d'upsell</h4>
                  <p class="text-xs text-gray-500">L'agent propose des produits complémentaires</p>
                </div>
                <button
                  @click="config.upsellEnabled = !config.upsellEnabled"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    config.upsellEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      config.upsellEnabled ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview & Integration Panel -->
        <div class="space-y-8">
          
          <!-- Integration Code -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Code d'Intégration</h3>
              <button 
                @click="copyCode"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Copier
              </button>
            </div>
            
            <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto"><code>{{ integrationCode }}</code></pre>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Conversations</span>
                <span class="text-lg font-semibold text-gray-900">{{ agent.stats?.conversations || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Conversions</span>
                <span class="text-lg font-semibold text-gray-900">{{ agent.stats?.conversions || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Taux de conversion</span>
                <span class="text-lg font-semibold text-gray-900">
                  {{ conversionRate }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

// ✅ COMPOSABLES
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const config = useRuntimeConfig()

// ✅ REACTIVE STATE
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const agent = ref<any | null>(null)
const knowledgeBase = ref<any[]>([])
const debugMode = ref(false)
const debugInfo = ref<any>(null)

// ✅ CONFIGURATION STATE
const configData = ref({
  welcomeMessage: '',
  fallbackMessage: '',
  collectName: true,
  collectPhone: true,
  collectAddress: false,
  collectPayment: true,
  upsellEnabled: false
})

// ✅ COMPUTED
const agentId = computed(() => route.params.id as string)

const apiUrl = computed(() => config.public.apiBaseUrl)

const conversionRate = computed(() => {
  if (!agent.value?.stats) return 0
  const { conversations, conversions } = agent.value.stats
  return conversations > 0 ? Math.round((conversions / conversations) * 100) : 0
})

const integrationCode = computed(() => {
  return `<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-agent-id', '${agentId.value}');
  script.setAttribute('data-shop-id', '${authStore.userShopId || 'shop-id'}');
  document.head.appendChild(script);
})();
<\/script>`
})

// ✅ HELPER: Headers d'authentification
const getAuthHeaders = () => {
  if (!authStore.token) {
    throw new Error('Token d\'authentification manquant')
  }
  
  return {
    'Authorization': `Bearer ${authStore.token}`,
    'Content-Type': 'application/json'
  }
}

// ✅ MÉTHODES
const goBack = () => {
  router.push('/vendeurs-ia')
}

const checkAuth = async () => {
  debugInfo.value = {
    hasToken: !!authStore.token,
    tokenLength: authStore.token?.length || 0,
    apiUrl: apiUrl.value,
    userShopId: authStore.userShopId
  }
  alert('Voir les infos debug ci-dessus')
}

const loadAgent = async () => {
  loading.value = true
  error.value = null

  try {
    console.log('🔍 [API Backend] Chargement agent:', agentId.value)
    console.log('🔍 [API Backend] URL:', `${apiUrl.value}/api/v1/agents/${agentId.value}/config`)

    if (!agentId.value || agentId.value === 'undefined') {
      throw new Error('ID agent invalide: ' + agentId.value)
    }

    // ✅ APPEL À L'API BACKEND RÉELLE
    const response = await $fetch(`/api/v1/agents/${agentId.value}/config`, {
      baseURL: apiUrl.value,
      headers: getAuthHeaders()
    })

    debugInfo.value = response

    if (response.success && response.data?.agent) {
      agent.value = response.data.agent
      knowledgeBase.value = response.data.knowledgeBase || []

      // ✅ INITIALISER LA CONFIGURATION DEPUIS L'API
      configData.value = {
        welcomeMessage: agent.value.welcomeMessage || '',
        fallbackMessage: agent.value.fallbackMessage || '',
        collectName: agent.value.config?.collectName ?? true,
        collectPhone: agent.value.config?.collectPhone ?? true,
        collectAddress: agent.value.config?.collectAddress ?? false,
        collectPayment: agent.value.config?.collectPayment ?? true,
        upsellEnabled: agent.value.config?.upsellEnabled ?? false
      }

      console.log('✅ [API Backend] Agent chargé:', agent.value.name)
    } else {
      throw new Error(response.error || 'Réponse API invalide')
    }

  } catch (err: any) {
    console.error('❌ [API Backend] Erreur chargement agent:', err)
    
    // Messages d'erreur spécifiques
    if (err.statusCode === 401) {
      error.value = 'Erreur d\'authentification. Veuillez vous reconnecter.'
    } else if (err.statusCode === 404) {
      error.value = 'Agent non trouvé. Vérifiez l\'ID de l\'agent.'
    } else if (err.message?.includes('Token')) {
      error.value = 'Token d\'authentification manquant. Veuillez vous reconnecter.'
    } else {
      error.value = err.message || 'Erreur lors du chargement depuis l\'API backend'
    }
  } finally {
    loading.value = false
  }
}

const reloadAgent = () => {
  agent.value = null
  error.value = null
  loadAgent()
}

const saveConfiguration = async () => {
  saving.value = true

  try {
    console.log('💾 [API Backend] Sauvegarde configuration...')

    const response = await $fetch(`/api/v1/agents/${agentId.value}/config`, {
      method: 'PUT',
      baseURL: apiUrl.value,
      headers: getAuthHeaders(),
      body: {
        config: configData.value
      }
    })

    if (response.success) {
      alert('✅ Configuration sauvegardée avec succès dans l\'API backend !')
      console.log('✅ [API Backend] Configuration sauvegardée')
    } else {
      throw new Error(response.error || 'Erreur de sauvegarde')
    }

  } catch (err: any) {
    console.error('❌ [API Backend] Erreur sauvegarde:', err)
    
    let errorMessage = 'Erreur lors de la sauvegarde'
    if (err.statusCode === 401) {
      errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.'
    } else if (err.message) {
      errorMessage = err.message
    }
    
    alert('❌ ' + errorMessage)
  } finally {
    saving.value = false
  }
}

const copyCode = async () => {
  try {
    const codeToClipboard = integrationCode.value.replace(/\\\//g, '/')
    await navigator.clipboard.writeText(codeToClipboard)
    alert('✅ Code d\'intégration copié dans le presse-papier !')
  } catch (err) {
    console.error('Erreur copie:', err)
    alert('❌ Impossible de copier le code')
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  console.log('🚀 [API Backend] Montage page configuration agent:', agentId.value)
  console.log('🚀 [API Backend] API URL:', apiUrl.value)
  
  // ✅ Activer le debug en développement
  if (process.env.NODE_ENV === 'development') {
    debugMode.value = true
  }
  
  if (!agentId.value || agentId.value === 'undefined') {
    error.value = 'ID agent invalide'
    return
  }

  // ✅ Vérifier l'authentification
  if (!authStore.token) {
    error.value = 'Token d\'authentification manquant. Veuillez vous reconnecter.'
    return
  }
  
  await loadAgent()
})

// ✅ SEO
useHead({
  title: computed(() => `Configuration - ${agent.value?.name || 'Vendeur IA'} - ChatSeller`)
})
</script>

<style scoped>
.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>