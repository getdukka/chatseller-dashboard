<!-- pages/vendeurs-ia/[id]/configure.vue - CONFIGURATION AGENT IA -->
<template>
  <div class="min-h-screen bg-gray-50">
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
              @click="testAgent"
              :disabled="!agent || loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Tester l'Agent
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
        <span class="text-lg text-gray-600">Chargement de la configuration...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="agent" class="p-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Configuration Panel -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Agent Settings -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Paramètres de l'Agent</h3>
            
            <div class="space-y-6">
              <!-- Basic Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'agent</label>
                  <input
                    v-model="config.name"
                    type="text"
                    class="input-modern w-full"
                    placeholder="Ex: Rose - Assistante d'achat"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select v-model="config.type" class="input-modern w-full">
                    <option value="general">Vendeur généraliste</option>
                    <option value="product_specialist">Spécialiste produit</option>
                    <option value="support">Support & SAV</option>
                    <option value="upsell">Upsell & Cross-sell</option>
                  </select>
                </div>
              </div>

              <!-- Messages -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message d'accueil</label>
                <textarea
                  v-model="config.welcomeMessage"
                  rows="3"
                  class="input-modern w-full"
                  placeholder="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message de fallback</label>
                <textarea
                  v-model="config.fallbackMessage"
                  rows="2"
                  class="input-modern w-full"
                  placeholder="Je transmets votre question à notre équipe..."
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
                Gérer les documents
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
                    <p class="text-xs text-gray-500">{{ doc.contentType }}</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
          
          <!-- Widget Preview -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Aperçu du Widget</h3>
            
            <div class="bg-gray-100 rounded-lg p-4 h-64 flex items-end justify-end">
              <div class="bg-blue-600 rounded-full p-3 cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
            </div>
            
            <p class="text-sm text-gray-500 mt-3 text-center">
              Aperçu du bouton chat sur votre site
            </p>
          </div>

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
            
            <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto"><code>&lt;script&gt;
(function() {
  var script = document.createElement('script');
  script.src = 'https://widget.chatseller.app/widget.js';
  script.setAttribute('data-agent-id', '{{ agent?.id }}');
  script.setAttribute('data-shop-id', '{{ authStore.userShopId }}');
  document.head.appendChild(script);
})();
&lt;/script&gt;</code></pre>
            
            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 class="text-sm font-medium text-blue-900 mb-1">Instructions</h4>
              <p class="text-xs text-blue-700">
                Copiez ce code et collez-le dans le &lt;head&gt; de votre site web ou dans votre thème Shopify/WooCommerce.
              </p>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Conversations</span>
                <span class="text-lg font-semibold text-gray-900">{{ agent.stats.conversations }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Conversions</span>
                <span class="text-lg font-semibold text-gray-900">{{ agent.stats.conversions }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Taux de conversion</span>
                <span class="text-lg font-semibold text-gray-900">
                  {{ agent.stats.conversations > 0 ? Math.round((agent.stats.conversions / agent.stats.conversations) * 100) : 0 }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-16">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Erreur de chargement</h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
        <button 
          @click="loadAgent"
          class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>

    <!-- Test Chat Modal -->
    <div v-if="showTestModal" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full h-96 flex flex-col">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Test de l'Agent IA</h3>
          <button @click="showTestModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <div class="space-y-3">
            <div class="flex items-start space-x-2">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">IA</span>
              </div>
              <div class="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                <p class="text-sm text-gray-800">{{ config.welcomeMessage || 'Bonjour ! Comment puis-je vous aider ?' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-200">
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="Tapez votre message..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAgents, type Agent } from '~/composables/useAgents'

// ✅ PAGE META
definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

import { useAgentConfig } from '~/composables/useAgentConfig'

// ✅ COMPOSABLES
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { getAgent } = useAgents()
const {
  loading,
  saving,
  error,
  agentConfig,
  fetchAgentConfig,
  updateAgentConfig,
  linkKnowledgeBase,
  fetchAvailableKnowledge,
  copyIntegrationCode,
  clearError
} = useAgentConfig()

// ✅ REACTIVE STATE
const showTestModal = ref(false)
const agent = ref<any | null>(null) // TODO: Supprimer et utiliser agentConfig.agent
const knowledgeBase = ref<any[]>([]) // TODO: Supprimer et utiliser agentConfig.knowledgeBase

// ✅ CONFIGURATION STATE
const config = ref({
  name: '',
  type: 'general',
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

// ✅ METHODS
const goBack = () => {
  router.push('/vendeurs-ia')
}

const loadAgent = async () => {
  clearError()
  
  try {
    // Récupérer la configuration complète via l'API
    const result = await fetchAgentConfig(agentId.value)
    
    if (result.success && agentConfig.value) {
      agent.value = agentConfig.value.agent
      knowledgeBase.value = agentConfig.value.knowledgeBase
      
      // Initialiser la configuration du formulaire
      config.value = {
        name: agentConfig.value.agent.name,
        type: agentConfig.value.agent.type,
        welcomeMessage: agentConfig.value.agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
        fallbackMessage: agentConfig.value.agent.fallbackMessage || 'Je transmets votre question à notre équipe...',
        collectName: agentConfig.value.agent.config?.collectName ?? true,
        collectPhone: agentConfig.value.agent.config?.collectPhone ?? true,
        collectAddress: agentConfig.value.agent.config?.collectAddress ?? false,
        collectPayment: agentConfig.value.agent.config?.collectPayment ?? true,
        upsellEnabled: agentConfig.value.agent.config?.upsellEnabled ?? false
      }
    }
    
  } catch (err: any) {
    console.error('Erreur lors du chargement:', err)
  }
}

const saveConfiguration = async () => {
  try {
    const configData = {
      collectName: config.value.collectName,
      collectPhone: config.value.collectPhone,
      collectAddress: config.value.collectAddress,
      collectPayment: config.value.collectPayment,
      upsellEnabled: config.value.upsellEnabled
    }
    
    const result = await updateAgentConfig(agentId.value, configData)
    
    if (result.success) {
      // Afficher un message de succès (vous pouvez utiliser un toast)
      alert('Configuration sauvegardée avec succès !')
    } else {
      // L'erreur est automatiquement gérée par le composable et disponible via la ref error
      console.error('Erreur sauvegarde:', error.value)
    }
    
  } catch (err: any) {
    console.error('Erreur lors de la sauvegarde:', err)
    alert('Erreur lors de la sauvegarde')
  }
}

const testAgent = () => {
  showTestModal.value = true
}

const copyCode = async () => {
  if (!agent.value || !authStore.userShopId) return
  
  const result = await copyIntegrationCode(agent.value.id, authStore.userShopId)
  
  if (result.success) {
    alert(result.message)
  } else {
    alert('Erreur: ' + result.error)
  }
}

// ✅ LIFECYCLE
onMounted(async () => {
  await loadAgent()
})

// ✅ SEO
useHead({
  title: `Configuration - ${agent.value?.name || 'Vendeur IA'} - ChatSeller`
})
</script>

<style scoped>
.input-modern {
  @apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm;
}
</style>