<!-- pages/vendeurs-ia/[id].vue - VERSION CORRIGÉE ET ROBUSTE -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Debug Info -->
    <div v-if="debugMode" class="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <h3 class="text-yellow-800 font-medium">🔧 Mode Debug</h3>
      <div class="text-yellow-700 text-sm mt-2">
        <p><strong>Agent ID:</strong> {{ agentId }}</p>
        <p><strong>Route valide:</strong> {{ !!agentId }}</p>
        <p><strong>Auth Token:</strong> {{ authStore.token ? '✅ Présent' : '❌ Manquant' }}</p>
        <p><strong>Loading:</strong> {{ loading }}</p>
        <p><strong>Error:</strong> {{ error || 'Aucune' }}</p>
        <p><strong>Agent chargé:</strong> {{ agent ? '✅ Oui' : '❌ Non' }}</p>
        <p><strong>Mode:</strong> {{ useMockData ? 'Mock Data' : 'API Backend' }}</p>
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
              {{ loading ? 'Chargement...' : 'Recharger' }}
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

    <!-- Error State -->
    <div v-else-if="error && !agent" class="p-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-red-900">Erreur de chargement</h3>
        <p class="mt-2 text-red-700">{{ error }}</p>
        <div class="mt-4 space-x-2">
          <button 
            @click="loadAgent"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
          <button 
            @click="useMockData = true; loadAgent()"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mode Développement
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
                  v-model="configData.name"
                  type="text"
                  class="input-modern w-full"
                  :placeholder="agent.name"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type d'agent</label>
                <select v-model="configData.type" class="input-modern w-full">
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
                  v-model="configData.welcomeMessage"
                  rows="3"
                  class="input-modern w-full"
                  :placeholder="agent.welcomeMessage || 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message de fallback</label>
                <textarea
                  v-model="configData.fallbackMessage"
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
                    <input v-model="configData.collectName" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Nom complet</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="configData.collectPhone" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Numéro de téléphone</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="configData.collectAddress" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-700">Adresse de livraison</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="configData.collectPayment" type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
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
                  @click="configData.upsellEnabled = !configData.upsellEnabled"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    configData.upsellEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      configData.upsellEnabled ? 'translate-x-5' : 'translate-x-0'
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

            <!-- Mode indicator -->
            <div v-if="useMockData" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-xs text-yellow-700">
                ⚠️ Mode développement avec données simulées
              </p>
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

// ✅ TYPES
interface AgentConfigData {
  name: string
  type: 'general' | 'product_specialist' | 'support' | 'upsell'
  welcomeMessage: string
  fallbackMessage: string
  collectName: boolean
  collectPhone: boolean
  collectAddress: boolean
  collectPayment: boolean
  upsellEnabled: boolean
}

// ✅ REACTIVE STATE
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const agent = ref<any | null>(null)
const knowledgeBase = ref<any[]>([])
const debugMode = ref(false)
const useMockData = ref(false)

// ✅ CONFIGURATION STATE
const configData = ref<AgentConfigData>({
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
const agentId = computed(() => {
  const id = route.params.id as string
  return id && id !== 'undefined' && id !== 'null' ? id : null
})

// ✅ HELPER: Convertir query params en string
const getStringFromQuery = (value: string | string[] | undefined, fallback: string): string => {
  if (!value) return fallback
  return Array.isArray(value) ? value[0] || fallback : value
}

// ✅ HELPER: Valider le type d'agent
const validateAgentType = (type: string): AgentConfigData['type'] => {
  const validTypes: AgentConfigData['type'][] = ['general', 'product_specialist', 'support', 'upsell']
  return validTypes.includes(type as AgentConfigData['type']) ? type as AgentConfigData['type'] : 'general'
}

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

// ✅ MÉTHODES
const goBack = () => {
  router.push('/vendeurs-ia')
}

// ✅ CHARGER AGENT AVEC FALLBACK ROBUSTE
const loadAgent = async () => {
  loading.value = true
  error.value = null

  try {
    if (!agentId.value) {
      throw new Error('ID agent invalide')
    }

    console.log('🔍 Chargement agent:', agentId.value)

    // ✅ MODE DÉVELOPPEMENT : Utiliser des données simulées
    if (useMockData.value || !authStore.token) {
      console.log('📝 Mode développement - données simulées')
      
      const mockAgent = {
        id: agentId.value,
        name: getStringFromQuery(route.query.name, 'Rose - Vendeuse IA'),
        type: validateAgentType(getStringFromQuery(route.query.type, 'general')),
        personality: 'friendly',
        description: 'Assistante d\'achat spécialisée dans la vente de produits.',
        welcomeMessage: 'Bonjour ! Je suis Rose, votre assistante d\'achat. Comment puis-je vous aider aujourd\'hui ?',
        fallbackMessage: 'Je transmets votre question à notre équipe, un conseiller vous recontactera bientôt.',
        avatar: 'https://ui-avatars.com/api/?name=Rose&background=E91E63&color=fff',
        isActive: true,
        config: {
          collectName: true,
          collectPhone: true,
          collectAddress: false,
          collectPayment: true,
          upsellEnabled: false
        },
        stats: {
          conversations: 47,
          conversions: 12
        }
      }

      const mockKnowledge = [
        {
          id: 'kb_001',
          title: 'Catalogue produits 2024',
          contentType: 'file',
          isActive: true,
          tags: ['produits', 'catalogue', '2024']
        },
        {
          id: 'kb_002',
          title: 'FAQ Support Client',
          contentType: 'manual',
          isActive: true,
          tags: ['faq', 'support', 'client']
        }
      ]

      agent.value = mockAgent
      knowledgeBase.value = mockKnowledge

      // Initialiser la configuration
      configData.value = {
        name: mockAgent.name,
        type: mockAgent.type,
        welcomeMessage: mockAgent.welcomeMessage || '',
        fallbackMessage: mockAgent.fallbackMessage || '',
        collectName: mockAgent.config?.collectName ?? true,
        collectPhone: mockAgent.config?.collectPhone ?? true,
        collectAddress: mockAgent.config?.collectAddress ?? false,
        collectPayment: mockAgent.config?.collectPayment ?? true,
        upsellEnabled: mockAgent.config?.upsellEnabled ?? false
      }

      console.log('✅ Données simulées chargées:', mockAgent.name)
      return
    }

    // ✅ MODE PRODUCTION : Appel API
    try {
      const response = await $fetch(`/api/v1/agents/${agentId.value}/config`, {
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.success && response.data?.agent) {
        agent.value = response.data.agent
        knowledgeBase.value = response.data.knowledgeBase || []

        // Initialiser la configuration depuis l'API
        configData.value = {
          name: agent.value.name || '',
          type: validateAgentType(agent.value.type || 'general'),
          welcomeMessage: agent.value.welcomeMessage || '',
          fallbackMessage: agent.value.fallbackMessage || '',
          collectName: agent.value.config?.collectName ?? true,
          collectPhone: agent.value.config?.collectPhone ?? true,
          collectAddress: agent.value.config?.collectAddress ?? false,
          collectPayment: agent.value.config?.collectPayment ?? true,
          upsellEnabled: agent.value.config?.upsellEnabled ?? false
        }

        console.log('✅ Agent chargé depuis API:', agent.value.name)
      } else {
        throw new Error(response.error || 'Réponse API invalide')
      }

    } catch (apiError: any) {
      console.warn('⚠️ Erreur API, basculement vers mode développement:', apiError)
      useMockData.value = true
      await loadAgent() // Récursion avec mode mock
    }

  } catch (err: any) {
    console.error('❌ Erreur chargement agent:', err)
    error.value = err.message || 'Erreur lors du chargement'
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
    console.log('💾 Sauvegarde configuration...')

    if (useMockData.value) {
      // Mode développement : simulation
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('✅ Configuration simulée sauvegardée')
      alert('✅ Configuration sauvegardée (mode développement)')
    } else {
      // Mode production : API
      const response = await $fetch(`/api/v1/agents/${agentId.value}/config`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        },
        body: {
          config: configData.value
        }
      })

      if (response.success) {
        console.log('✅ Configuration sauvegardée')
        alert('✅ Configuration sauvegardée avec succès !')
      } else {
        throw new Error(response.error || 'Erreur de sauvegarde')
      }
    }

  } catch (err: any) {
    console.error('❌ Erreur sauvegarde:', err)
    alert('❌ ' + (err.message || 'Erreur lors de la sauvegarde'))
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
  console.log('🚀 Montage page configuration agent:', agentId.value)
  
  // ✅ Activer le debug en développement
  if (process.env.NODE_ENV === 'development') {
    debugMode.value = true
  }
  
  if (!agentId.value) {
    error.value = 'ID agent invalide ou manquant'
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